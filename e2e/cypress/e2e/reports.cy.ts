function reportSignIn(role: string) {
  cy.clearCookies()
  cy.intercept('POST', '/api/v1/auth/login').as('reportLogin')
  cy.intercept('GET', '/api/v1/dashboard*').as('dashboard')
  cy.visit('/login')
  cy.get('input[name="email"]', { timeout: 15000 }).type(role + '@zarate.test')
  cy.get('input[name="password"]').type('ZarateDemo2026!', { log: false })
  cy.contains('button', 'Ingresar').click()
  cy.wait('@reportLogin').its('response.statusCode').should('eq', 200)
  cy.wait('@dashboard').its('response.statusCode').should('eq', 200)
  cy.get('[data-testid="dashboard-data"]', { timeout: 15000 }).should('be.visible')
}
describe('Sprint 10: reportes y dashboards reales', () => {
  it('consulta dashboard administrativo y filtra y exporta un reporte CSV responsive', () => {
    reportSignIn('administrator')
    cy.contains('h2', 'Estudiantes activos').should('exist')
    cy.intercept('GET', '/api/v1/reports').as('catalog')
    cy.contains('nav[aria-label="Navegación principal"] a', 'Reportes').click()
    cy.wait('@catalog').its('response.body.data').should('have.length', 20)
    cy.intercept('GET', '/api/v1/reports/active-students?*').as('studentsReport')
    cy.get('select[name="report"]').select('active-students')
    cy.wait('@studentsReport').its('response.statusCode').should('eq', 200)
    cy.intercept('GET', '/api/v1/reports/active-students/options/student_id?*search=Demo').as('studentOptions')
    cy.get('input[aria-label="Buscar Estudiante"]').type('Demo')
    cy.wait('@studentOptions', { responseTimeout: 60000 }).its('response.statusCode').should('eq', 200)
    cy.contains('select[name="student_id"] option', /^Demo STUDENT$/, { timeout: 15000 }).then(option => {
      cy.get('select[name="student_id"]').select(option.val() as string)
    })
    cy.intercept('GET', '/api/v1/reports/active-students?*student_id=*').as('filteredStudents')
    cy.contains('button', 'Aplicar filtros').click()
    cy.wait('@filteredStudents').its('response.body.total').should('eq', 1)
    cy.get('tbody', { timeout: 15000 }).should('contain', 'Demo STUDENT')
    cy.intercept('GET', '/api/v1/reports/active-students/export?*').as('csv')
    cy.contains('button', 'Exportar CSV').click()
    cy.wait('@csv').then(({ response }) => {
      expect(response?.statusCode).to.eq(200)
      expect(response?.headers['content-type']).to.contain('text/csv')
      expect(String(response?.body)).to.contain('Demo STUDENT')
    })
    cy.readFile('cypress/downloads/active-students.csv', { timeout: 15000 }).should('contain', 'Demo STUDENT')
    cy.viewport(390, 844)
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })

  it('muestra indicadores por rol y mantiene reportes institucionales fuera del acceso familiar', () => {
    for (const role of ['secretary', 'treasury', 'teacher', 'student', 'guardian']) {
      reportSignIn(role)
      cy.get('[data-testid="dashboard-data"]').should('not.contain', 'undefined')
      if (['student', 'guardian'].includes(role)) {
        cy.contains('h2', 'Demo STUDENT').should('exist')
        cy.request({ url: '/api/v1/reports/enrollment-payments', failOnStatusCode: false, headers: { Origin: 'http://localhost:5173', Accept: 'application/json' } }).its('status').should('eq', 403)
      }
      cy.intercept('POST', '/api/v1/auth/logout').as('reportLogout')
      cy.contains('button', 'Cerrar sesión').click()
      cy.wait('@reportLogout').its('response.statusCode').should('eq', 204)
    }
  })
})
