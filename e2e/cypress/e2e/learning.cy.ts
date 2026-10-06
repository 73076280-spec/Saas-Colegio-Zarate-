export {}
beforeEach(() => {
  cy.intercept('POST', '/api/v1/auth/login').as('learningLogin')
  cy.intercept('POST', '/api/v1/auth/logout').as('learningLogout')
  cy.intercept('GET', '/api/v1/my/courses?*').as('learningCourses')
  cy.intercept('GET', '/api/v1/courses/*/assignments?*').as('tasks')
  cy.intercept('GET', '/api/v1/courses/*/assessments?*').as('assessments')
  cy.intercept('GET', '/api/v1/assignments/*/submissions?*').as('submissions')
  cy.intercept('GET', '/api/v1/assessments/*/scores?*').as('scores')
  cy.on('window:confirm', () => true)
})
function login(role: string) {
  cy.visit('/login')
  cy.get('input[name="email"]', { timeout: 15000 }).type(role + '@zarate.test')
  cy.get('input[name="password"]').type('ZarateDemo2026!', { log: false })
  cy.contains('button', 'Ingresar').click()
  cy.wait('@learningLogin').its('response.statusCode').should('eq', 200)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/app')
}
function logout() {
  cy.contains('button', 'Cerrar sesión').click()
  cy.wait('@learningLogout').its('response.statusCode').should('eq', 204)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/login')
}
function openCourse(tab: 'Tareas' | 'Evaluaciones') {
  cy.contains('nav a', 'Mis cursos').click()
  cy.wait('@learningCourses')
  cy.get('input[aria-label="Buscar curso o asignación"]').type('DEMO-MAT-2026')
  cy.contains('button', 'Buscar').click()
  cy.wait('@learningCourses')
  cy.contains('article', 'Matemática — curso demo', { timeout: 15000 }).within(() => cy.contains('button', 'Entrar al curso').click())
  cy.contains('[role="tab"]', tab, { timeout: 15000 }).click()
  cy.wait(tab === 'Tareas' ? '@tasks' : '@assessments').its('response.statusCode').should('eq', 200)
}
function request(path: string, body?: object) {
  return cy.getCookie('XSRF-TOKEN', { log: false }).then(cookie => cy.request({
    method: body ? 'POST' : 'GET', url: '/api/v1/' + path, body, log: false,
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json', 'X-XSRF-TOKEN': decodeURIComponent(cookie!.value) },
  }))
}
function selectOption(name: string, label: string) {
  cy.contains('select[name="' + name + '"] option', label, { timeout: 15000 }).then(o => cy.get('select[name="' + name + '"]').select(o.val() as string))
}
describe('Sprint 7: tareas entregas y notas', () => {
  it('docente crea publica tarea y consulta y revisa una entrega', () => {
    const title = 'E2E Tarea docente ' + Date.now()
    login('teacher'); openCourse('Tareas')
    cy.contains('button', 'Crear tarea', { timeout: 15000 }).click()
    cy.get('[data-testid="learning-form"]').within(() => {
      cy.get('[name="title"]').type(title)
      cy.get('[name="description"]').type('Resolver operaciones ficticias')
      cy.get('[name="instructions"]').type('Explicar el resultado')
      cy.get('[name="due_at"]').type('2030-12-20T18:00')
      cy.intercept('POST', '/api/v1/courses/*/assignments').as('createTask')
      cy.contains('button', 'Guardar').click()
    })
    cy.wait('@createTask').then(created => {
      expect(created.response?.statusCode).to.eq(201)
      const id = created.response?.body.data.id
      cy.contains('[data-testid="learning-card"]', title, { timeout: 15000 }).within(() => {
        cy.intercept('POST', '/api/v1/assignments/*/publish').as('publishTask')
        cy.contains('button', 'Publicar').click()
      })
      cy.wait('@publishTask').its('response.statusCode').should('eq', 200)
      logout(); login('student')
      request('assignments/' + id + '/submissions', { content: 'Respuesta ficticia para revisión' }).its('status').should('eq', 201)
      logout(); login('teacher'); openCourse('Tareas')
      cy.contains('[data-testid="learning-card"]', title, { timeout: 15000 }).within(() => cy.contains('button', 'Ver entregas').click())
      cy.wait('@submissions').its('response.statusCode').should('eq', 200)
      cy.get('[data-testid="learning-submissions"]').contains('Respuesta ficticia para revisión', { timeout: 15000 }).should('be.visible')
      cy.contains('button', 'Revisar entrega').click()
      cy.get('[data-testid="submission-form"]').within(() => {
        cy.get('[name="feedback"]').type('Buen trabajo ficticio')
        cy.intercept('POST', '/api/v1/submissions/*/review').as('reviewSubmission')
        cy.contains('button', 'Guardar revisión').click()
      })
      cy.wait('@reviewSubmission').its('response.statusCode').should('eq', 200)
      cy.get('[data-testid="learning-submissions"]').should('contain', 'Revisada').and('contain', 'Buen trabajo ficticio')
    })
  })

  it('estudiante entra al curso entrega archivo y consulta Mis entregas', () => {
    const title = 'E2E Entrega estudiante ' + Date.now()
    login('teacher')
    request('my/courses?search=DEMO-MAT-2026').then(courses => {
      const course = courses.body.data[0].id
      request('courses/' + course + '/assignments', { title, description: 'Entrega ficticia', due_at: '2030-12-20T23:00:00Z' }).then(task => {
        request('assignments/' + task.body.data.id + '/publish', {}).its('status').should('eq', 200)
      })
    })
    logout(); login('student'); openCourse('Tareas')
    cy.contains('[data-testid="learning-card"]', title, { timeout: 15000 }).within(() => cy.contains('button', 'Ver entregas').click())
    cy.wait('@submissions').its('response.statusCode').should('eq', 200)
    cy.contains('button', 'Entregar tarea', { timeout: 15000 }).click()
    cy.get('[data-testid="submission-form"]').within(() => {
      cy.get('[name="content"]').type('Mi respuesta de desarrollo')
      cy.get('[name="file"]').selectFile({ contents: Cypress.Buffer.from('Respuesta educativa ficticia'), fileName: 'entrega-e2e.txt', mimeType: 'text/plain' })
      cy.intercept('POST', '/api/v1/assignments/*/submissions').as('sendSubmission')
      cy.contains('button', 'Enviar entrega').click()
    })
    cy.wait('@sendSubmission').its('response.statusCode').should('eq', 201)
    cy.intercept('GET', '/api/v1/my/submissions?*').as('mySubmissions')
    cy.contains('nav a', 'Mis entregas').click()
    cy.wait('@mySubmissions').its('response.statusCode').should('eq', 200)
    cy.contains('[data-testid="learning-card"]', title, { timeout: 15000 }).should('contain', 'Entregada').and('contain', 'Mi respuesta de desarrollo')
    cy.viewport(390, 844)
    cy.document().then(d => expect(d.documentElement.scrollWidth).to.be.at.most(d.documentElement.clientWidth))
  })

  it('docente publica evaluación registra nota y el estudiante consulta su calificación', () => {
    const title = 'E2E Evaluación ' + Date.now()
    login('teacher'); openCourse('Evaluaciones')
    cy.contains('button', 'Crear evaluación', { timeout: 15000 }).click()
    cy.get('[data-testid="learning-form"]').within(() => {
      cy.get('[name="title"]').type(title)
      selectOption('academic_period_id', 'Bimestre 1')
      selectOption('assessment_type_id', 'Práctica')
      cy.intercept('POST', '/api/v1/courses/*/assessments').as('createAssessment')
      cy.contains('button', 'Guardar').click()
    })
    cy.wait('@createAssessment').its('response.statusCode').should('eq', 201)
    cy.contains('[data-testid="learning-card"]', title, { timeout: 15000 }).within(() => {
      cy.intercept('POST', '/api/v1/assessments/*/publish').as('publishAssessment')
      cy.contains('button', 'Publicar').click()
    })
    cy.wait('@publishAssessment').its('response.statusCode').should('eq', 200)
    cy.contains('[data-testid="learning-card"]', title, { timeout: 15000 }).should('contain', 'Publicado')
    cy.contains('[data-testid="learning-card"]', title, { timeout: 15000 }).within(() => cy.contains('button', 'Ver notas').click())
    cy.wait('@scores').its('response.statusCode').should('eq', 200)
    cy.contains('button', 'Registrar nota', { timeout: 15000 }).click()
    cy.get('[data-testid="score-form"]').within(() => {
      selectOption('student_id', 'Demo STUDENT')
      cy.get('[name="score"]').type('17.50')
      cy.get('[name="observations"]').type('Observación ficticia E2E')
      cy.intercept('POST', '/api/v1/assessments/*/scores').as('saveScore')
      cy.contains('button', 'Guardar nota').click()
    })
    cy.wait('@saveScore').its('response.statusCode').should('eq', 201)
    logout(); login('student')
    cy.intercept('GET', '/api/v1/my/scores?*').as('myScores')
    cy.contains('nav a', 'Mis notas').click()
    cy.wait('@myScores').its('response.statusCode').should('eq', 200)
    cy.contains('[data-testid="score-row"]', title, { timeout: 15000 }).should('contain', '17.50').and('contain', 'Observación ficticia E2E')
    cy.contains('button', 'Modificar nota').should('not.exist')
  })
})
