export {}
beforeEach(() => {
  cy.intercept('POST', '/api/v1/auth/login').as('officeLogin')
  cy.intercept('POST', '/api/v1/auth/logout').as('officeLogout')
  cy.intercept('GET', '/api/v1/my/requests?*').as('myRequests')
  cy.intercept('GET', '/api/v1/academic-requests?*').as('requests')
  cy.intercept('GET', /\/api\/v1\/academic-requests\/\d+$/).as('requestDetail')
  cy.intercept('GET', '/api/v1/academic-requests/*/history?*').as('requestHistory')
  cy.intercept('GET', '/api/v1/communications?*').as('communications')
  cy.on('window:confirm', () => true)
})
function login(role: string) {
  cy.visit('/login')
  cy.get('[name="email"]', { timeout: 15000 }).type(role + '@zarate.test')
  cy.get('[name="password"]').type('ZarateDemo2026!', { log: false })
  cy.contains('button', 'Ingresar').click()
  cy.wait('@officeLogin').its('response.statusCode').should('eq', 200)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/app')
}
function logout() {
  cy.contains('button', 'Cerrar sesión').click()
  cy.wait('@officeLogout').its('response.statusCode').should('eq', 204)
  cy.location('pathname', { timeout: 15000 }).should('eq', '/login')
}
function request(path: string, body?: object) {
  return cy.getCookie('XSRF-TOKEN', { log: false }).then(c => cy.request({
    method: body ? 'POST' : 'GET', url: '/api/v1/' + path, body, log: false,
    headers: { Origin: 'http://localhost:5173', Accept: 'application/json', 'X-XSRF-TOKEN': decodeURIComponent(c!.value) },
  }))
}
function select(name: string, label: string) {
  cy.contains('select[name="' + name + '"] option', label, { timeout: 15000 }).then(o => cy.get('select[name="' + name + '"]').select(String(o.val())))
}
function openRequest(title: string, personal = false) {
  cy.contains('nav a', personal ? 'Mis solicitudes' : 'Solicitudes académicas').click()
  cy.wait(personal ? '@myRequests' : '@requests')
  cy.get('input[name="search"]').type(title); cy.contains('button', 'Filtrar solicitudes').click()
  cy.wait(personal ? '@myRequests' : '@requests')
  cy.contains('[data-testid="request-row"]', title, { timeout: 15000 }).within(() => cy.contains('button', 'Ver solicitud').click())
  cy.get('[data-testid="request-detail"]', { timeout: 15000 }).should('contain', title)
}
function transition(operation: string, label: string, state: string) {
  cy.intercept('POST', '/api/v1/academic-requests/*/' + operation).as('transition')
  cy.get('[data-testid="request-detail"]').contains('button', label, { timeout: 15000 }).should('not.be.disabled').click()
  cy.wait('@transition').its('response.statusCode').should('eq', 200)
  cy.get('[data-testid="request-status"]', { timeout: 15000 }).should('have.text', state)
}
describe('Sprint 9: trámites documentos comunicaciones y notificaciones', () => {
  it('estudiante crea corrige solicitud y Secretaría observa aprueba emite documento y completa', () => {
    const title = 'E2E Solicitud ' + Date.now()
    login('student'); cy.contains('nav a', 'Mis solicitudes').click(); cy.wait('@myRequests')
    cy.contains('button', 'Nueva solicitud', { timeout: 15000 }).click()
    cy.get('[data-testid="request-form"]').within(() => {
      select('request_type_id', 'Constancia')
      cy.get('[name="subject"]').type(title); cy.get('[name="description"]').type('Motivo ficticio inicial')
      cy.intercept('POST', '/api/v1/academic-requests').as('createRequest')
      cy.contains('button', 'Registrar solicitud').click()
    })
    cy.wait('@createRequest').its('response.statusCode').should('eq', 201)
    cy.get('[data-testid="request-detail"]', { timeout: 15000 }).should('contain', 'Registrada')
    logout(); login('secretary'); openRequest(title)
    transition('review', 'Iniciar revisión', 'En revisión')
    cy.get('[data-testid="request-detail"] [name="comment"]', { timeout: 15000 }).type('Completar motivo ficticio')
    transition('observe', 'Observar solicitud', 'Observada')
    logout(); login('student'); openRequest(title, true)
    cy.get('[data-testid="request-detail"]').within(() => {
      cy.contains('button', 'Corregir solicitud', { timeout: 15000 }).click()
      cy.get('[name="description"]').clear().type('Motivo ficticio completado')
      cy.intercept('PATCH', '/api/v1/academic-requests/*').as('correct')
      cy.contains('button', 'Guardar corrección').click()
    })
    cy.wait('@correct').its('response.statusCode').should('eq', 200)
    logout(); login('secretary'); openRequest(title)
    transition('review', 'Iniciar revisión', 'En revisión')
    cy.get('[data-testid="request-detail"] [name="resolution"]', { timeout: 15000 }).type('Constancia autorizada')
    transition('approve', 'Aprobar solicitud', 'Aprobada')
    cy.get('[data-testid="academic-documents"]').contains('button', 'Nuevo documento', { timeout: 15000 }).click()
    cy.get('[data-testid="document-form"]').within(() => {
      cy.get('[name="document_type"]').type('CONSTANCIA E2E')
      cy.get('[name="file"]').selectFile({ contents: Cypress.Buffer.from('Constancia ficticia privada'), fileName: 'constancia-s9.txt', mimeType: 'text/plain' })
      cy.intercept('POST', '/api/v1/academic-documents').as('createDocument')
      cy.contains('button', 'Guardar documento').click()
    })
    cy.wait('@createDocument').its('response.statusCode').should('eq', 201)
    cy.contains('[data-testid="document-card"]', 'CONSTANCIA E2E', { timeout: 15000 }).within(() => {
      cy.intercept('POST', '/api/v1/academic-documents/*/issue').as('issue')
      cy.contains('button', 'Emitir documento').click()
    })
    cy.wait('@issue').its('response.statusCode').should('eq', 200)
    cy.get('[data-testid="request-detail"] [name="resolution"]').type('Constancia emitida y trámite completado')
    transition('complete', 'Completar solicitud', 'Completada')
    logout(); login('student'); openRequest(title, true)
    cy.get('[data-testid="request-detail"]').should('contain', 'Completada').and('contain', 'Motivo ficticio completado')
    cy.contains('[data-testid="document-card"]', 'constancia-s9.txt', { timeout: 15000 }).within(() => {
      cy.contains('Emitido').should('be.visible')
      cy.intercept('GET', '/api/v1/academic-documents/*/download').as('download')
      cy.contains('button', 'Descargar documento').click()
    })
    cy.wait('@download').its('response.statusCode').should('eq', 200)
    cy.contains('button', 'Emitir documento').should('not.exist')
  })
  it('Secretaría publica por rol y usuario y el docente recibe un único comunicado', () => {
    const title = 'E2E Comunicado ' + Date.now()
    login('secretary')
    cy.contains('nav a', 'Comunicaciones').click(); cy.wait('@communications')
    cy.contains('button', 'Nuevo comunicado', { timeout: 15000 }).click()
    cy.get('[data-testid="communication-form"]').within(() => {
      cy.get('[name="title"]').type(title); cy.get('[name="body"]').type('Mensaje educativo ficticio dirigido al docente')
      cy.get('[name="target_kind_0"]').select('role'); select('target_value_0', 'TEACHER')
      cy.contains('button', 'Agregar destinatario').click(); select('target_value_1', 'Demo TEACHER')
      cy.intercept('POST', '/api/v1/communications').as('createCommunication')
      cy.contains('button', 'Guardar borrador').click()
    })
    cy.wait('@createCommunication').its('response.statusCode').should('eq', 201)
    cy.contains('[data-testid="communication-card"]', title, { timeout: 15000 }).within(() => {
      cy.intercept('POST', '/api/v1/communications/*/publish').as('publish')
      cy.contains('button', 'Publicar comunicado').click()
    })
    cy.wait('@publish').its('response.statusCode').should('eq', 200)
    logout(); login('teacher')
    cy.contains('nav a', 'Comunicaciones').click(); cy.wait('@communications')
    cy.contains('[data-testid="communication-card"]', title, { timeout: 15000 }).within(() => cy.contains('button', 'Leer comunicado').click())
    cy.get('[data-testid="communication-detail"]', { timeout: 15000 }).should('contain', 'Mensaje educativo ficticio')
    cy.contains('button', 'Publicar comunicado').should('not.exist')
    request('notifications?per_page=100').then(r => expect(r.body.data.filter((n: { message: string }) => n.message.includes(title))).to.have.length(1))
  })
  it('usuario recibe notificación en campana y marca individual y todas como leídas', () => {
    const title = 'E2E Aviso personal ' + Date.now()
    login('secretary')
    request('office-options/users?search=Demo%20STUDENT').then(users => {
      const student = users.body.data.find((u: { name: string }) => u.name === 'Demo STUDENT')
      expect(student).to.exist
      for (const subject of [title, 'E2E Recordatorio independiente ' + Date.now()]) {
        request('communications', { title: subject, body: 'Mensaje privado de prueba', targets: [{ kind: 'user', target: String(student.id) }] }).then(c => {
          request('communications/' + c.body.data.id + '/publish', {}).its('status').should('eq', 200)
        })
      }
    })
    logout(); login('student')
    cy.get('[aria-label="Notificaciones"]', { timeout: 15000 }).click()
    cy.get('[aria-label="Notificaciones recientes"]').contains(title, { timeout: 15000 }).should('be.visible')
    cy.contains('button', 'Cerrar notificaciones').click()
    cy.contains('nav a', 'Mis notificaciones').click()
    cy.contains('[data-testid="notification-item"]', title, { timeout: 15000 }).within(() => {
      cy.intercept('POST', '/api/v1/notifications/*/read').as('read')
      cy.contains('button', 'Marcar como leída').click()
    })
    cy.wait('@read').its('response.statusCode').should('eq', 204)
    cy.contains('[data-testid="notification-item"]', title, { timeout: 15000 }).should('contain', 'Leída')
    cy.intercept('GET', '/api/v1/my/notifications?*status=unread').as('unreadNotices')
    cy.get('[aria-label="Estado de notificaciones"]').select('unread')
    cy.wait('@unreadNotices').its('response.statusCode').should('eq', 200)
    cy.contains('[data-testid="notification-item"]', title).should('not.exist')
    cy.intercept('POST', '/api/v1/notifications/read-all').as('readAll')
    cy.contains('button', 'Marcar todas como leídas').should('not.be.disabled').click()
    cy.wait('@readAll').its('response.statusCode').should('eq', 204)
    cy.get('[data-testid="unread-count"]', { timeout: 15000 }).should('contain', '0 sin leer')
    cy.viewport(390, 844)
    cy.document().then(d => expect(d.documentElement.scrollWidth).to.be.at.most(d.documentElement.clientWidth))
  })
})
