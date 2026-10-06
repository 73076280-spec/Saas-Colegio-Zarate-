export {}
beforeEach(() => {
  cy.intercept('POST', '/api/v1/auth/login').as('attendanceLogin')
  cy.intercept('POST', '/api/v1/auth/logout').as('attendanceLogout')
  cy.intercept('GET', '/api/v1/my/courses?*').as('attendanceCourses')
  cy.intercept('GET', '/api/v1/courses/*/attendance-sessions?*').as('sessions')
  cy.intercept('GET', '/api/v1/attendance-sessions/*/records?*').as('roster')
  cy.intercept('GET', /\/api\/v1\/absence-justifications\/\d+$/).as('justificationDetail')
  cy.intercept('GET', '/api/v1/absence-justifications/*/history?*').as('justificationHistory')
  cy.on('window:confirm', () => true)
})
function login(role: string) {
  cy.visit('/login')
  cy.get('[name="email"]', { timeout: 15000 }).type(role + '@zarate.test')
  cy.get('[name="password"]').type('ZarateDemo2026!', { log: false })
  cy.contains('button', 'Ingresar').click()
  cy.wait('@attendanceLogin').its('response.statusCode').should('eq', 200)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/app')
}
function logout() {
  cy.contains('button', 'Cerrar sesión').click()
  cy.wait('@attendanceLogout').its('response.statusCode').should('eq', 204)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/login')
}
function request(path: string, body?: object) {
  return cy.getCookie('XSRF-TOKEN', { log: false }).then(c => cy.request({
    method: body ? 'POST' : 'GET', url: '/api/v1/' + path, body, log: false,
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json', 'X-XSRF-TOKEN': decodeURIComponent(c!.value) },
  }))
}
function nextSession() {
  return request('my/courses?search=DEMO-MAT-2026').then(c => {
    const course: number = c.body.data[0].id
    return request('courses/' + course + '/attendance-sessions?per_page=1').then(s => {
      const date = new Date((s.body.data[0]?.date ?? '2026-10-05') + 'T12:00:00Z')
      date.setUTCDate(date.getUTCDate() + 1)
      return { course, date: date.toISOString().slice(0, 10) }
    })
  })
}
function absentFixture() {
  return nextSession().then(({ course, date }) =>
    request('courses/' + course + '/attendance-sessions', { date, topic: 'E2E asistencia ' + date }).then(s => {
      const session = s.body.data.id
      return request('courses/' + course + '/students').then(roster => {
        const student = roster.body.data.find((r: { name: string }) => r.name.includes('Demo STUDENT')).student_id
        return request('attendance-sessions/' + session + '/records', { records: [{ student_id: student, status: 'ABSENT', observations: 'Falta E2E ' + date }] })
          .then(r => ({ date, record: r.body.data[0].id as number }))
      })
    }))
}
function familyPage() {
  cy.intercept('GET', '/api/v1/guardians/*/students/*/attendance?*').as('familyAttendance')
  cy.contains('nav a', 'Asistencia de mis estudiantes').click()
  cy.wait('@familyAttendance').its('response.statusCode').should('eq', 200)
}
describe('Sprint 8: asistencia y justificaciones', () => {
  it('docente registra asistencia y cierra la sesión sin edición posterior', () => {
    login('teacher')
    nextSession().then(({ date }) => {
      cy.contains('nav a', 'Mis cursos').click(); cy.wait('@attendanceCourses')
      cy.get('[aria-label="Buscar curso o asignación"]').type('DEMO-MAT-2026')
      cy.contains('button', 'Buscar').click(); cy.wait('@attendanceCourses')
      cy.contains('article', 'Matemática — curso demo', { timeout: 15000 }).within(() => cy.contains('button', 'Entrar al curso').click())
      cy.contains('[role="tab"]', 'Asistencia', { timeout: 15000 }).click(); cy.wait('@sessions')
      cy.contains('button', 'Nueva asistencia', { timeout: 15000 }).click()
      cy.get('[data-testid="attendance-session-form"]').within(() => {
        cy.get('[name="date"]').type(date); cy.get('[name="topic"]').type('Registro docente E2E')
        cy.intercept('POST', '/api/v1/courses/*/attendance-sessions').as('createSession')
        cy.contains('button', 'Crear sesión').click()
      })
      cy.wait('@createSession').its('response.statusCode').should('eq', 201); cy.wait('@roster')
      cy.get('[data-testid="attendance-roster"]').within(() => {
        cy.contains('tr', 'Demo STUDENT', { timeout: 15000 }).within(() => {
          cy.get('select').select('PRESENT'); cy.get('input').type('Registro E2E')
        })
        cy.intercept('POST', '/api/v1/attendance-sessions/*/records').as('saveAttendance')
        cy.contains('button', 'Guardar asistencia').click()
        cy.wait('@saveAttendance').its('response.statusCode').should('eq', 200)
        cy.contains('Asistencia guardada.', { timeout: 15000 }).should('be.visible')
        cy.intercept('POST', '/api/v1/attendance-sessions/*/close').as('closeAttendance')
        cy.contains('button', 'Cerrar asistencia').should('not.be.disabled').click()
        cy.wait('@closeAttendance').its('response.statusCode').should('eq', 200)
        cy.contains('Cerrada', { timeout: 15000 }).should('be.visible'); cy.get('select').should('not.exist')
      })
    })
  })
  it('apoderado vinculado envía justificación con archivo privado y consulta historial', () => {
    login('teacher')
    absentFixture().then(({ date }) => {
      logout(); login('guardian'); familyPage()
      cy.contains('[data-testid="personal-attendance"]', date, { timeout: 15000 }).within(() => cy.contains('button', 'Justificar').click())
      cy.get('[data-testid="justification-form"]').within(() => {
        cy.get('[name="reason"]').type('Motivo familiar ficticio E2E ' + date)
        cy.get('[name="file"]').selectFile({ contents: Cypress.Buffer.from('Constancia ficticia de asistencia'), fileName: 'constancia-e2e.txt', mimeType: 'text/plain' })
        cy.intercept('POST', '/api/v1/attendance-records/*/justifications').as('justify')
        cy.contains('button', 'Enviar justificación').click()
      })
      cy.wait('@justify').its('response.statusCode').should('eq', 201)
      cy.contains('[data-testid="personal-attendance"]', date, { timeout: 15000 }).should('contain', 'Pendiente')
        .within(() => cy.contains('button', 'Ver justificación').click())
      cy.wait(['@justificationDetail', '@justificationHistory'])
      cy.get('[data-testid="justification-detail"]', { timeout: 15000 }).should('contain', 'constancia-e2e.txt').and('contain', 'Historial')
      cy.contains('button', 'Iniciar revisión').should('not.exist')
      cy.viewport(390, 844)
      cy.document().then(d => expect(d.documentElement.scrollWidth).to.be.at.most(d.documentElement.clientWidth))
    })
  })
  it('Secretaría revisa y aprueba y el estudiante y apoderado consultan Justificada', () => {
    login('teacher')
    absentFixture().then(({ date, record }) => {
      logout(); login('guardian')
      request('attendance-records/' + record + '/justifications', { reason: 'Justificación para aprobar E2E ' + date }).its('status').should('eq', 201)
      logout(); login('secretary')
      cy.intercept('GET', '/api/v1/absence-justifications?*').as('justifications')
      cy.contains('nav a', 'Justificaciones').click(); cy.wait('@justifications')
      cy.get('input[name="date"]').type(date); cy.contains('button', 'Filtrar').click(); cy.wait('@justifications')
      cy.contains('[data-testid="justification-row"]', date, { timeout: 15000 }).within(() => cy.contains('button', 'Ver justificación').click())
      cy.get('[data-testid="justification-detail"]').within(() => {
        cy.intercept('POST', '/api/v1/absence-justifications/*/review').as('review')
        cy.contains('button', 'Iniciar revisión', { timeout: 15000 }).click(); cy.wait('@review').its('response.statusCode').should('eq', 200)
        cy.get('[name="review_comment"]').type('Constancia verificada E2E')
        cy.intercept('POST', '/api/v1/absence-justifications/*/approve').as('approve')
        cy.contains('button', 'Aprobar justificación', { timeout: 15000 }).should('not.be.disabled').click()
        cy.wait('@approve').its('response.statusCode').should('eq', 200)
        cy.contains('Aprobada', { timeout: 15000 }).should('be.visible')
      })
      logout(); login('student')
      cy.intercept('GET', '/api/v1/my/attendance?*').as('mine')
      cy.contains('nav a', 'Mi asistencia').click(); cy.wait('@mine')
      cy.contains('[data-testid="personal-attendance"]', date, { timeout: 15000 }).should('contain', 'Justificada')
      cy.contains('button', 'Justificar').should('not.exist')
      logout(); login('guardian'); familyPage()
      cy.contains('[data-testid="personal-attendance"]', date, { timeout: 15000 }).should('contain', 'Justificada').and('contain', 'Aprobada')
    })
  })
})
