import { observeHealth } from '../support/observeHealth'

describe('Comunicación real frontend–Laravel', () => {
  it('consulta la API real a través del proxy y actualiza la pantalla', () => {
    cy.request('/api/health').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.deep.eq({ status: 'ok', service: 'backend' })
    })
    const health = observeHealth()
    cy.intercept('GET', '/api/health').as('health')
    cy.visit('/')
    health.assertResponse('@health.all')
    cy.get('[data-testid="backend-status"]').should('contain', 'Backend conectado correctamente.')
  })
})
