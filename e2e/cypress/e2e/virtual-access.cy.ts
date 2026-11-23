import type { User, RoleName } from '../../../frontend/src/auth/types'

// UI contract tests: synthetic sessions never change persisted roles or permissions.
const course = { id: 7, name: 'Curso M-01', code: 'M01', status: 'ACTIVE', teacher: { name: 'Docente de prueba' }, subject: { name: 'Matemática' }, academic_year: { name: '2026' }, grade_level: { name: 'Primero', level: 'Secundaria' }, section: { name: 'A' } }
const page = (data: unknown[]) => ({ data, meta: { current_page: 1, last_page: 1, total: data.length } })
function session(roles: RoleName[], permissions: string[]) {
  const user: User = { id: 1, institution_id: 1, first_name: 'Cuenta', last_name: 'M01', name: 'Cuenta M01', email: 'm01@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles, permissions, institution: { id: 1, name: 'Institución de prueba', code: 'TEST' } }
  const requests: string[] = []
  cy.intercept('GET', '/api/v1/**', req => {
    const path = new URL(req.url).pathname
    requests.push(path)
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    if (path === '/api/v1/dashboard') return req.reply({ academic_year: null, years: [], cards: [], sections: [], links: [], scope_note: '' })
    if (path === '/api/v1/my/courses' || path === '/api/v1/courses') return req.reply(page([course]))
    if (path === '/api/v1/courses/7') return req.reply({ data: course })
    if (path === '/api/v1/courses/7/students') return req.reply(page([]))
    if (path === '/api/v1/my/scores') return req.reply(page([{ id: 12, score: '18', student: { name: user.name }, course: { id: 7, name: course.name }, assessment: { title: 'Evaluación publicada' }, period: { name: 'Periodo 1' }, abilities: {} }]))
    if (path === '/api/v1/courses/7/assignments') return req.reply({ ...page([]), abilities: { create: permissions.includes('assignments.create') } })
    if (['units', 'materials', 'assessments'].some(segment => path === '/api/v1/courses/7/' + segment)) return req.reply({ ...page([]), abilities: {} })
    req.reply({ statusCode: 403, body: { message: 'No autorizado en esta sesión de prueba' } })
  })
  return requests
}

describe('M-01: navegación con permisos efectivos (API simulada)', () => {
  it('estudiante con solo notas accede desde ambos espacios sin consultar evaluaciones', () => {
    const requests = session(['STUDENT'], ['scores.view'])
    cy.visit('/app/my-courses')
    cy.contains('button', 'Entrar al curso').click()
    cy.contains('[role="tab"]', 'Calificaciones').should('be.visible')
    cy.get('a[href="/virtual/scores"]').contains('Mis notas').click()
    cy.get('[data-testid="score-row"]').should('contain', '18')
    cy.contains('a', 'Volver a Gestión Institucional').click()
    cy.location('pathname').should('eq', '/app')
    cy.contains('a', /^Ir al Aula Virtual$/).click()
    cy.get('nav[aria-label="Navegación del Aula Virtual"] a[href="/virtual/scores"]').should('exist')
    cy.get('[data-testid="course-card"] a').click()
    cy.contains('[role="tab"]', 'Calificaciones').click()
    cy.location('pathname').should('eq', '/virtual/courses/7/scores')
    cy.contains('a', /^Mis notas$/).click()
    cy.get('[data-testid="score-row"]').should('contain', '18')
    cy.contains('button', 'Registrar nota').should('not.exist')
    cy.then(() => expect(requests.some(path => /\/(assessments|materials|units)(\/|$)/.test(path))).to.eq(false))
  })

  it('docente sin materiales conserva tareas institucionales y virtuales', () => {
    const requests = session(['TEACHER'], ['assignments.view', 'assignments.create'])
    cy.visit('/app/my-courses')
    cy.contains('button', 'Entrar al curso').click()
    cy.contains('button', 'Crear tarea').should('be.visible')
    cy.get('[role="tab"]').should('have.length', 1).and('contain', 'Tareas')
    cy.contains('a', /^Ir al Aula Virtual$/).click()
    cy.get('nav[aria-label="Navegación del Aula Virtual"] a[href="/virtual/materials"]').should('not.exist')
    cy.get('[data-testid="course-card"] a').click()
    cy.contains('button', 'Crear tarea').should('be.visible')
    cy.contains('a', 'Volver a Gestión Institucional').click()
    cy.location('pathname').should('eq', '/app')
    cy.then(() => expect(requests.some(path => /\/(materials|units)(\/|$)/.test(path))).to.eq(false))
  })

  it('usuario sin contenido no tiene panel institucional ni entrada virtual', () => {
    const requests = session(['TEACHER'], [])
    cy.visit('/app/my-courses')
    cy.contains('button', 'Entrar al curso').click()
    cy.get('[data-testid="teaching-detail"]').should('be.visible')
    cy.get('[role="tablist"]').should('not.exist')
    cy.contains('a', /^Ir al Aula Virtual$/).should('not.exist')
    cy.visit('/virtual/courses/7/assignments')
    cy.contains('No tienes permiso para acceder al Aula Virtual.').should('be.visible')
    cy.then(() => expect(requests).not.to.include('/api/v1/courses/7/assignments'))
  })

  it('URL de una sección no autorizada no solicita su contenido', () => {
    const requests = session(['TEACHER'], ['assignments.view'])
    cy.visit('/virtual/courses/7/classroom')
    cy.contains('Curso o sección no disponible para tu cuenta.').should('be.visible')
    cy.then(() => expect(requests.some(path => /\/courses\/7\//.test(path))).to.eq(false))
  })

  for (const role of ['ADMINISTRATOR', 'TEACHER', 'STUDENT'] as const) {
    it('conserva las cuatro secciones habituales de ' + role, () => {
      session([role], ['courses.view', 'course-units.view', 'materials.view', 'assignments.view', 'assessments.view', 'scores.view'])
      cy.visit('/virtual/courses/7')
      cy.get('[role="tab"]').should('have.length', 4)
      for (const label of ['Aula Virtual', 'Tareas', 'Evaluaciones', 'Calificaciones']) cy.contains('[role="tab"]', label).should('be.visible')
      cy.contains('[role="tab"]', 'Calificaciones').click()
      cy.get('[data-testid="learning-assessments"]').should('be.visible')
    })
  }

  it('conserva la restricción de roles y el modo docente en cuentas mixtas', () => {
    session(['STUDENT', 'TEACHER'], ['scores.view'])
    cy.visit('/virtual')
    cy.contains('No tienes permiso para acceder al Aula Virtual.').should('be.visible')
  })

  it('no habilita el aula a Tesorería por tener un permiso de contenido aislado', () => {
    session(['TREASURY'], ['assignments.view'])
    cy.visit('/virtual')
    cy.contains('No tienes permiso para acceder al Aula Virtual.').should('be.visible')
  })
})
