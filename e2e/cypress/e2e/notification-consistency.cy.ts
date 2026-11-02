import type { User } from '../../../frontend/src/auth/types'

const full = '[aria-label="Bandeja de notificaciones"]'
const compact = '[aria-label="Bandeja reciente de notificaciones"]'
const count = '[data-testid="notification-count"]'
type Reply = { body?: unknown; statusCode?: number; delay?: number }
type Query = { bell: boolean; page: number; status: string; userId: number }
function setup(options: { denied?: boolean; empty?: boolean; writeFail?: boolean; writeDelay?: number; get?: (query: Query, body: unknown) => Reply } = {}) {
  let userId = 1
  const read = new Set([2])
  const requests: string[] = [], writes: string[] = []
  const user = (): User => ({ id: userId, institution_id: userId, first_name: 'Cuenta', last_name: 'Notificaciones', name: 'Cuenta Notificaciones', email: 'notice@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: ['STUDENT'], permissions: options.denied ? [] : ['notifications.view', 'communications.view'], institution: { id: userId, name: 'Institución de prueba', code: 'TEST' } })
  cy.intercept('/api/**', req => {
    const url = new URL(req.url), path = url.pathname
    if (path === '/api/v1/auth/me') return req.reply({ data: user() })
    if (path === '/api/v1/auth/logout') return req.reply({ statusCode: 204 })
    if (path === '/api/v1/auth/login') { userId = 2; return req.reply({ data: user() }) }
    if (req.method !== 'GET') {
      writes.push(path)
      req.alias = 'markNotice'
      if (options.writeFail) return req.reply({ statusCode: 500, body: { message: 'No se confirmó la lectura' } })
      const id = Number(path.split('/').at(-2)?.slice(-1))
      req.on('before:response', () => { if (path.endsWith('read-all')) [1, 2, 3].forEach(n => read.add(n)); else read.add(id) })
      return req.reply({ statusCode: 204, delay: options.writeDelay ?? 0 })
    }
    requests.push(url.pathname + url.search)
    if (path === '/api/v1/notifications' || path === '/api/v1/my/notifications') {
      const query: Query = { bell: path === '/api/v1/notifications', page: Number(url.searchParams.get('page') ?? 1), status: url.searchParams.get('status') ?? '', userId }
      req.alias = query.bell ? 'noticeCount' : url.searchParams.get('per_page') === '5' ? 'compactNotices' : 'fullNotices'
      const rows = options.empty ? [] : [1, 2, 3].map(id => ({ id: '00000000-0000-4000-8000-00000000000' + id, type: 'communication', message: 'Aviso usuario ' + userId + ' número ' + id, path: '/app/communications?communication=10', read_at: read.has(id) ? '2026-11-02T15:00:00Z' : null, created_at: '2026-11-02T15:00:00Z' }))
      const data = rows.filter(row => !query.status || (query.status === 'read' ? row.read_at : !row.read_at))
      const body = { data, current_page: query.page, last_page: 2, total: 30, unread_count: rows.filter(row => !row.read_at).length }
      const reply = options.get?.(query, body) ?? { body }
      if (query.status === 'unread' && reply.delay) req.alias = 'delayedFilter'
      if (query.userId === 1 && reply.delay && reply.delay >= 2000) req.alias = 'previousUser'
      return req.reply(reply)
    }
    if (/\/communications\/10$/.test(path)) return req.reply({ data: { id: 10, title: 'Comunicado autorizado', body: 'Contenido autorizado', status: 'PUBLISHED', abilities: {} } })
    if (path === '/api/v1/communications') return req.reply({ data: [], meta: { current_page: 1, last_page: 1 }, abilities: {} })
    return req.reply({ statusCode: 403, body: { message: 'No autorizado en simulación' } })
  })
  cy.intercept('GET', '/sanctum/csrf-cookie', { statusCode: 204 })
  cy.visit('/app/notifications')
  return { requests, writes }
}
function openBell() { cy.get('[aria-label="Notificaciones"]').click(); cy.get(compact).should('be.visible') }
function markFirst(region = full) { cy.get(region).contains('button', 'Marcar como leída').first().click() }

describe('BOLT-MIS-006 M-03: notificaciones coherentes (API simulada)', () => {
  it('presenta contador y estados de lectura proporcionados por el servidor', () => {
    setup(); cy.get(count).should('have.text', '2')
    cy.get(full).should('contain', '2 sin leer').and('contain', 'Leída').and('contain', 'Sin leer')
    cy.get(full).find('[data-testid="notification-item"]').should('have.length', 3)
  })

  it('sincroniza campana y ambas bandejas con una única escritura y una recarga por vista', () => {
    const { requests, writes } = setup(); cy.get(count).should('have.text', '2'); openBell()
    cy.get(compact).should('contain', '2 sin leer'); cy.get(full).should('contain', '2 sin leer')
    let fullBefore = 0
    cy.then(() => { fullBefore = requests.filter(url => url.includes('per_page=20')).length })
    markFirst(compact); cy.wait('@markNotice')
    cy.get(count).should('have.text', '1'); cy.get(full).should('contain', '1 sin leer'); cy.get(compact).should('contain', '1 sin leer')
    cy.then(() => { expect(writes).to.have.length(1); expect(requests.filter(url => url.includes('per_page=20'))).to.have.length(fullBefore + 1) })
    cy.get(full).contains('button', 'Marcar todas como leídas').click(); cy.wait('@markNotice')
    cy.get(count).should('have.text', '0'); cy.get(full).should('contain', '0 sin leer'); cy.get(compact).should('contain', '0 sin leer')
    cy.then(() => expect(writes).to.have.length(2))
  })

  it('no confirma lectura ni cambia contador antes de terminar la escritura', () => {
    setup({ writeDelay: 900 }); cy.get(count).should('have.text', '2'); markFirst()
    cy.get(full).contains('button', 'Marcar como leída').first().should('be.disabled'); cy.get(count).should('have.text', '2')
    cy.wait('@markNotice'); cy.get(count).should('have.text', '1')
  })

  it('mantiene lectura y contador si el servidor rechaza el marcado', () => {
    const { writes } = setup({ writeFail: true }); cy.get(count).should('have.text', '2'); markFirst(); cy.wait('@markNotice')
    cy.get(full).should('contain', 'No se confirmó la lectura').and('contain', '2 sin leer'); cy.get(count).should('have.text', '2')
    cy.get(full).find('[data-testid="notification-item"]').first().should('contain', 'Sin leer')
    cy.then(() => expect(writes).to.have.length(1))
  })

  it('reintenta GET conservando filtro y página sin repetir escrituras', () => {
    let failing = true
    const { writes } = setup({ get: (q, body) => !q.bell && q.page === 2 && q.status === 'unread' && failing ? { statusCode: 500, body: {} } : { body } })
    cy.get(full).should('contain', '2 sin leer'); cy.get(full).find('select').select('unread')
    cy.get(full).contains('button', 'Siguiente').click(); cy.get(full).find('[role="alert"]').should('be.visible')
    cy.get(full).should('not.contain', 'Aviso usuario 1'); cy.then(() => { failing = false })
    cy.get(full).contains('button', 'Reintentar consulta').click()
    cy.get(full).should('contain', 'Página 2 de 2'); cy.get(full).find('select').should('have.value', 'unread')
    cy.get(full).find('select').select('read'); cy.get(full).should('contain', 'Página 1 de 2')
    cy.then(() => expect(writes).to.have.length(0))
  })

  it('recupera contador fallido sin presentar cero ni enviar una escritura', () => {
    let failing = true
    const { writes } = setup({ get: (q, body) => q.bell && failing ? { statusCode: 500, body: {} } : { body } })
    cy.get(count).should('have.text', '—'); cy.get(full).should('contain', '2 sin leer')
    cy.then(() => { failing = false }); cy.contains('button', 'Reintentar consulta').click()
    cy.get(count).should('have.text', '2'); cy.then(() => expect(writes).to.have.length(0))
  })

  it('ignora la consulta tardía del filtro anterior', () => {
    setup({ get: (q, body) => ({ body, delay: !q.bell && q.status === 'unread' ? 700 : 0 }) })
    cy.get(full).should('contain', '2 sin leer'); cy.get(full).find('select').select('unread'); cy.get(full).find('select').select('read')
    cy.get(full).find('[data-testid="notification-item"]').should('have.length', 1).and('contain', 'número 2')
    cy.wait('@delayedFilter'); cy.get(full).find('[data-testid="notification-item"]').should('have.length', 1).and('contain', 'número 2')
  })

  it('abrir el comunicado consulta su detalle sin marcarlo automáticamente', () => {
    const { writes } = setup(); cy.get(full).contains('a', 'Abrir').first().click()
    cy.get('[aria-label="Detalle del comunicado"]').should('contain', 'Contenido autorizado')
    cy.then(() => expect(writes).to.have.length(0))
  })

  it('refresca por evento y foco sin polling y conserva la página', () => {
    setup(); cy.get(full).should('contain', '2 sin leer'); cy.get(full).contains('button', 'Siguiente').click()
    cy.get(full).should('contain', 'Página 2 de 2')
    cy.window().then(win => { win.dispatchEvent(new win.Event('office-notifications')); win.dispatchEvent(new win.Event('focus')) })
    cy.get(full).should('contain', 'Página 2 de 2').and('contain', '2 sin leer')
  })

  it('no expone controles ni consulta notificaciones sin permiso', () => {
    const { requests } = setup({ denied: true })
    cy.contains('No tienes permiso para acceder').should('be.visible'); cy.get('[aria-label="Notificaciones"]').should('not.exist')
    cy.then(() => expect(requests.filter(url => url.includes('notifications'))).to.have.length(0))
  })

  it('muestra vacío exitoso y contador cero sin confundirlo con error', () => {
    setup({ empty: true }); cy.get(count).should('have.text', '0'); cy.get(full).should('contain', 'No hay notificaciones.')
    cy.get(full).find('[role="alert"]').should('not.exist'); cy.get(full).contains('button', 'Marcar todas como leídas').should('be.disabled')
  })

  it('separa sesiones y descarta una respuesta del usuario anterior', () => {
    let delayOld = false
    setup({ get: (q, body) => ({ body, delay: q.userId === 1 && delayOld ? 3000 : 0 }) })
    cy.get(full).should('contain', 'Aviso usuario 1')
    cy.then(() => { delayOld = true }); cy.window().then(win => win.dispatchEvent(new win.Event('office-notifications')))
    cy.get(full).should('have.attr', 'aria-busy', 'true').and('not.contain', 'Aviso usuario 1')
    cy.contains('button', 'Cerrar sesión').click(); cy.location('pathname').should('eq', '/login')
    cy.get('[name="email"]').type('second@example.test'); cy.get('[name="password"]').type('FicticiaSoloSimulacion', { log: false }); cy.contains('button', 'Ingresar').click()
    cy.get('nav a[href="/app/notifications"]').click(); cy.get(full).should('contain', 'Aviso usuario 2').and('not.contain', 'Aviso usuario 1')
    cy.wait('@previousUser'); cy.get(full).should('contain', 'Aviso usuario 2').and('not.contain', 'Aviso usuario 1')
  })

  it('activa la campana con Enter nativo y conserva Escape y ancho móvil', () => {
    cy.viewport(390, 844); setup(); cy.get(count).should('have.text', '2')
    cy.get('[aria-label="Notificaciones"]').focus().should('have.focus')
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' } }))
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    cy.get(compact).should('be.visible').and('contain', '2 sin leer')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
    cy.get('[aria-label="Notificaciones"]').trigger('keydown', { key: 'Escape' }); cy.get(compact).should('not.exist')
  })
})
