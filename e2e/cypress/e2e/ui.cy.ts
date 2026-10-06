describe('Pantalla técnica', () => {
  it('carga React y muestra el estado correcto', () => {
    cy.intercept('GET', '/api/health', { statusCode: 200, body: { status: 'ok', service: 'backend' } })
    cy.visit('/')
    cy.contains('h1', 'Plataforma SaaS Colegio Zárate').should('be.visible')
    cy.get('[data-testid="backend-status"]').should('contain', 'Backend conectado correctamente.')
  })

  it('muestra el fallo de comunicación', () => {
    cy.intercept('GET', '/api/health', { statusCode: 503, body: {} })
    cy.visit('/')
    cy.get('[data-testid="backend-status"]').should('contain', 'No se pudo verificar')
    cy.intercept('GET', '/api/health', { statusCode: 200, body: { status: 'ok', service: 'backend' } })
    cy.contains('button', 'Volver a comprobar').click()
    cy.get('[data-testid="backend-status"]').should('contain', 'Backend conectado correctamente.')
  })

  it('rechaza una respuesta con formato inesperado', () => {
    cy.intercept('GET', '/api/health', { statusCode: 200, body: { status: 'ok' } })
    cy.visit('/')
    cy.get('[data-testid="backend-status"]').should('contain', 'No se pudo verificar')
  })
})
