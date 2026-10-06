export {}

beforeEach(() => {
  cy.intercept('POST', '/api/v1/auth/login').as('classroomLogin')
  cy.intercept('POST', '/api/v1/auth/logout').as('classroomLogout')
  cy.intercept('GET', '/api/v1/my/courses?*').as('classroomCourses')
  cy.intercept('GET', '/api/v1/courses/*/units?*').as('classroomUnits')
  cy.intercept('GET', '/api/v1/courses/*/materials?*').as('classroomMaterials')
  cy.on('window:confirm', () => true)
})
function login(role: string) {
  cy.visit('/login')
  cy.get('input[name="email"]').type(role + '@zarate.test')
  cy.get('input[name="password"]').type('ZarateDemo2026!', { log: false })
  cy.contains('button', 'Ingresar').click()
  cy.wait('@classroomLogin').its('response.statusCode').should('eq', 200)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/app')
}
function openCourse() {
  cy.contains('nav a', 'Mis cursos').click()
  cy.wait('@classroomCourses').its('response.statusCode').should('eq', 200)
  cy.contains('article', 'Matemática — curso demo', { timeout: 15000 }).within(() => cy.contains('button', 'Entrar al curso').click())
  cy.wait('@classroomUnits').its('response.statusCode').should('eq', 200)
  cy.wait('@classroomMaterials').its('response.statusCode').should('eq', 200)
  cy.get('[data-testid="classroom"]', { timeout: 15000 }).should('not.contain', 'Cargando aula…')
}
function logout() {
  cy.contains('button', 'Cerrar sesión').click()
  cy.wait('@classroomLogout').its('response.statusCode').should('eq', 204)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/login')
}
function request(path: string, method: 'GET' | 'POST' = 'GET', body?: object) {
  return cy.getCookie('XSRF-TOKEN', { log: false }).then(cookie => cy.request({
    method, url: '/api/v1/' + path, body, failOnStatusCode: false, log: false,
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json', 'X-XSRF-TOKEN': decodeURIComponent(cookie!.value) },
  }))
}
function lastPage(selector: string) {
  cy.get(selector).contains('button', 'Siguiente').then(button => {
    if (!button.prop('disabled')) {
      cy.wrap(button).click()
      cy.get('[data-testid="classroom"]').should('not.contain', 'Cargando aula…')
      lastPage(selector)
    }
  })
}
function lastUnitOptions() {
  cy.contains('button', 'Siguiente').then(button => {
    if (!button.prop('disabled')) {
      cy.intercept('GET', '/api/v1/courses/*/units?*').as('pickerPage')
      cy.wrap(button).click()
      cy.wait('@pickerPage').its('response.statusCode').should('eq', 200)
      lastUnitOptions()
    }
  })
}
describe('Sprint 6: Aula Virtual', () => {
  it('el docente crea y publica unidad y archivo, luego archiva conservando el historial', () => {
    const title = 'Unidad E2E ' + Date.now(), material = 'Archivo ' + title
    login('teacher')
    request('my/courses?search=DEMO-MAT-2026').then(r => {
      const course = r.body.data[0].id
      request('courses/' + course + '/units?per_page=1').then(first => {
        request('courses/' + course + '/units?per_page=1&page=' + first.body.last_page).then(last => {
          const sequence = (last.body.data[0]?.sequence ?? 0) + 1
          openCourse()
          cy.get('[data-testid="classroom"]').contains('button', 'Crear unidad', { timeout: 15000 }).click()
          cy.get('[data-testid="classroom-form"]').within(() => {
            cy.get('[name="title"]').type(title)
            cy.get('[name="sequence"]').clear().type(String(sequence))
            cy.get('[name="description"]').type('Contenido ficticio E2E')
            cy.intercept('POST', '/api/v1/courses/*/units').as('createUnit')
            cy.contains('button', 'Guardar').click()
          })
          cy.wait('@createUnit').its('response.statusCode').should('eq', 201)
          // Newly created unit may be on the last page on repeated local runs.
          cy.get('[data-testid="classroom"]').within(() => cy.contains('Contenido guardado.', { timeout: 15000 }).should('be.visible'))
          cy.get('[data-testid="classroom"]').should('not.contain', 'Cargando aula…')
          lastPage('[data-testid="unit-pagination"]')
          cy.contains('[data-testid="unit-card"]', title, { timeout: 15000 }).within(() => {
            cy.intercept('POST', '/api/v1/course-units/*/publish').as('publishUnit')
            cy.contains('button', 'Publicar').click()
          })
          cy.wait('@publishUnit').its('response.statusCode').should('eq', 200)
          cy.contains('[data-testid="unit-card"]', title, { timeout: 15000 }).should('contain', 'Publicado')
          cy.get('[data-testid="classroom"]').within(() => cy.contains('button', 'Crear material').click())
          cy.get('[data-testid="classroom-form"]').within(() => {
            cy.get('[name="title"]').type(material)
            cy.get('[name="type"]').select('FILE')
            lastUnitOptions()
            cy.contains('select[name="course_unit_id"] option', title, { timeout: 15000 }).then(option => cy.get('[name="course_unit_id"]').select(option.val() as string))
            cy.get('[name="file"]').selectFile({ contents: Cypress.Buffer.from('Material seguro de prueba'), fileName: 'e2e-clase.txt', mimeType: 'text/plain' })
            cy.intercept('POST', '/api/v1/courses/*/materials').as('createMaterial')
            cy.contains('button', 'Guardar').click()
          })
          cy.wait('@createMaterial').its('response.statusCode').should('eq', 201)
          cy.get('[data-testid="classroom-form"]').should('not.exist')
          cy.get('[data-testid="classroom"]').should('not.contain', 'Cargando aula…')
          lastPage('[data-testid="material-pagination"]')
          cy.contains('[data-testid="material-card"]', material, { timeout: 15000 }).within(() => {
            cy.intercept('POST', '/api/v1/materials/*/publish').as('publishMaterial')
            cy.contains('button', 'Publicar').click()
          })
          cy.wait('@publishMaterial').its('response.statusCode').should('eq', 200)
          cy.contains('[data-testid="material-card"]', material, { timeout: 15000 }).should('contain', 'Publicado')
          cy.contains('[data-testid="unit-card"]', title).within(() => {
            cy.intercept('POST', '/api/v1/course-units/*/archive').as('archiveUnit')
            cy.contains('button', 'Archivar').click()
          })
          cy.wait('@archiveUnit').its('response.statusCode').should('eq', 200)
          cy.contains('[data-testid="unit-card"]', title, { timeout: 15000 }).should('contain', 'Archivado')
        })
      })
    })
  })

  it('el estudiante aprobado consulta publicados y descarga el archivo privado sin gestión', () => {
    login('student'); openCourse()
    cy.get('[data-testid="classroom"]').within(() => {
      cy.contains('Unidad 1: números naturales').should('be.visible')
      cy.contains('Unidad 2: operaciones básicas').should('not.exist')
      cy.contains('button', 'Crear unidad').should('not.exist')
      cy.contains('button', 'Crear material').should('not.exist')
      cy.contains('button', 'Publicar').should('not.exist')
      cy.contains('[data-testid="material-card"]', 'Enlace de consulta (demo)').find('a').should('have.attr', 'rel', 'noopener noreferrer')
      cy.intercept('GET', '/api/v1/materials/*/download').as('downloadMaterial')
      cy.contains('button', 'Descargar classroom-demo.txt').click()
    })
    cy.wait('@downloadMaterial').then(r => {
      expect(r.response?.statusCode).to.eq(200)
      expect(r.response?.headers['x-content-type-options']).to.eq('nosniff')
    })
    cy.viewport(390, 844)
    cy.document().then(d => expect(d.documentElement.scrollWidth).to.be.at.most(d.documentElement.clientWidth))
  })

  it('oculta borradores por URL y niega contenido a estudiante sin matrícula aprobada', () => {
    login('teacher')
    request('my/courses?search=DEMO-MAT-2026').then(r => {
      const course = r.body.data[0].id
      request('courses/' + course + '/units?status=DRAFT').then(units => {
        const draft = units.body.data.find((u: { sequence: number }) => u.sequence === 2)
        expect(draft).to.exist
        request('courses/' + course + '/materials?status=PUBLISHED').then(materials => {
          const file = materials.body.data.find((m: { type: string; title: string }) => m.type === 'FILE' && m.title.includes('(demo)'))
          expect(file).to.exist
          logout(); login('student')
          request('course-units/' + draft.id).its('status').should('eq', 404)
          request('course-units/' + draft.id + '/publish', 'POST', {}).its('status').should('eq', 403)
          logout(); login('student2')
          request('courses/' + course + '/materials').its('status').should('eq', 404)
          request('materials/' + file.id + '/download').its('status').should('eq', 404)
          cy.contains('nav a', 'Mis cursos').click()
          cy.wait('@classroomCourses').its('response.body.data').should('have.length', 0)
          cy.contains('No hay cursos o asignaciones disponibles', { timeout: 15000 }).should('be.visible')
        })
      })
    })
  })
})
