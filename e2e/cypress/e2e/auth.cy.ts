const roles = [
  ['administrator', 'Administración', 'Dashboard de administración'],
  ['secretary', 'Secretaría', 'Dashboard de secretaría'],
  ['treasury', 'Tesorería', 'Dashboard de tesorería'],
  ['teacher', 'Docente', 'Dashboard docente'],
  ['student', 'Estudiante', 'Dashboard del estudiante'],
  ['guardian', 'Padre o apoderado', 'Portal de padres'],
] as const

function login(role = 'administrator', password = 'ZarateDemo2026!') {
  cy.intercept('POST', '/api/v1/auth/login').as('loginRequest')
  cy.visit('/login')
  cy.get('input[name="institution_code"]').clear().type('ZARATE')
  cy.get('input[name="email"]').type(role + '@zarate.test')
  cy.get('input[name="password"]').type(password, { log: false })
  cy.contains('button', 'Ingresar').click()
  cy.wait('@loginRequest')
}

describe('Sprint 1: autenticación real y núcleo SaaS', () => {
  it('redirige al login cuando no hay sesión', () => {
    cy.visit('/app/users')
    cy.location('pathname').should('eq', '/login')
    cy.contains('h2', 'Iniciar sesión').should('be.visible')
  })

  it('rechaza credenciales incorrectas', () => {
    login('administrator', 'WrongPassword123!')
    cy.get('[role="alert"]').should('contain', 'Credenciales incorrectas')
    cy.location('pathname').should('eq', '/login')
  })

  for (const [role, label, title] of roles) {
    it('muestra identidad, sesión persistente y dashboard de ' + role, () => {
      login(role)
      cy.location('pathname').should('eq', '/app')
      cy.contains('h1', title).should('be.visible')
      cy.get('[data-testid="user-name"]').should('contain', 'Demo ' + role.toUpperCase())
      cy.get('[data-testid="user-role"]').should('contain', label)
      cy.get('[data-testid="institution-name"]').should('contain', 'Colegio Zárate de Huancayo')
      cy.reload()
      cy.contains('h1', title).should('be.visible')
      cy.viewport(390, 844)
      cy.get('nav[aria-label="Navegación principal"]').should('be.visible')
      cy.contains('button', 'Cerrar sesión').should('be.visible')
      cy.document().then(document => {
        expect(document.documentElement.scrollWidth).to.be.at.most(document.documentElement.clientWidth)
      })
      if (role === 'administrator') {
        cy.intercept('GET', '/api/v1/users?page=1').as('usersPage')
        cy.contains('a', 'Usuarios').click()
        cy.contains('h1', 'Usuarios').should('be.visible')
        cy.wait('@usersPage').then(({ response }) => {
          expect(response?.statusCode).to.eq(200)
          expect(response?.body.data).to.have.length.greaterThan(0)
          cy.contains('td', response?.body.data[0].email, { timeout: 15000 }).should('be.visible')
        })
        cy.intercept('GET', '/api/v1/roles').as('rolesPage')
        cy.intercept('GET', '/api/v1/permissions').as('permissionsPage')
        cy.contains('a', 'Roles y permisos').click()
        cy.wait(['@rolesPage', '@permissionsPage'])
        cy.contains('h2', 'Administración', { timeout: 15000 }).should('be.visible')
        cy.intercept('GET', '/api/v1/audit-logs?page=1').as('auditPage')
        cy.contains('a', 'Auditoría').click()
        cy.wait('@auditPage').its('response.statusCode').should('eq', 200)
        cy.contains('td', 'LOGIN', { timeout: 15000 }).should('exist')
      } else {
        cy.visit('/app/users')
        cy.get('[role="alert"]').should('contain', 'No tienes permiso')
        cy.request({ url: '/api/v1/users', failOnStatusCode: false, headers: { Origin: 'http://localhost:5173', Accept: 'application/json' } }).its('status').should('eq', 403)
      }
      cy.contains('button', 'Cerrar sesión').click()
      cy.location('pathname').should('eq', '/login')
      cy.visit('/app')
      cy.location('pathname').should('eq', '/login')
      cy.request({ url: '/api/v1/auth/me', failOnStatusCode: false, headers: { Origin: 'http://localhost:5173', Accept: 'application/json' } }).its('status').should('eq', 401)
    })
  }

  it('rechaza login sin token CSRF', () => {
    cy.request({ method: 'POST', url: '/api/v1/auth/login', failOnStatusCode: false,
      headers: { Origin: 'http://localhost:5173', Accept: 'application/json' },
      body: { institution_code: 'ZARATE', email: 'administrator@zarate.test', password: 'ZarateDemo2026!' },
    }).its('status').should('eq', 419)
  })
})
