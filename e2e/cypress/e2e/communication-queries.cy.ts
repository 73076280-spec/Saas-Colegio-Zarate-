import type { User } from '../../../frontend/src/auth/types'

type Reply = { body?: unknown; statusCode?: number; delay?: number; forceNetworkError?: boolean }
const listRegion = '[aria-label="Listado de comunicados"]'
const detailRegion = '[aria-label="Detalle del comunicado"]'
const item = (id: number, manage = false) => ({ id, title: 'Comunicado ' + id, body: 'Contenido ' + id, status: manage ? 'DRAFT' : 'PUBLISHED', created_at: '2026-11-02T15:00:00Z', abilities: { update: manage, publish: manage, archive: manage }, targets: [{ kind: 'institution', target: '1' }] })
const page = (current = 1, manage = false) => ({ data: [item(current * 10, manage), item(current * 10 + 1, manage)], meta: { current_page: current, last_page: 2 }, abilities: { create: manage } })
function setup(reply: (path: string, page: number, attempt: number) => Reply, options: { manage?: boolean; denied?: boolean } = {}) {
  const user: User = { id: 1, institution_id: 1, first_name: 'Cuenta', last_name: 'Prueba', name: 'Cuenta Prueba', email: 'communications@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: [options.manage ? 'SECRETARY' : 'STUDENT'], permissions: options.denied ? [] : ['communications.view'], institution: { id: 1, name: 'Institución de prueba', code: 'TEST' } }
  const attempts: Record<string, number> = {}, writes: string[] = [], gets: string[] = []
  cy.intercept('/api/**', req => {
    const url = new URL(req.url), path = url.pathname
    if (req.method !== 'GET') { writes.push(req.method + ' ' + path); return req.reply({ statusCode: 500, body: { message: 'Escritura fallida de prueba' } }) }
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    gets.push(url.pathname + url.search)
    if (path.startsWith('/api/v1/communications')) {
      const n = Number(url.searchParams.get('page') ?? 1), key = path + '_' + n
      attempts[key] = (attempts[key] ?? 0) + 1
      req.alias = path === '/api/v1/communications' ? 'list' : 'detail' + path.split('/').at(-1)
      return req.reply(reply(path, n, attempts[key]))
    }
    return req.reply({ statusCode: 403, body: { message: 'No autorizado' } })
  })
  cy.visit('/app/communications')
  return { writes, gets }
}
const normal = (path: string, n: number): Reply => ({ body: path === '/api/v1/communications' ? page(n) : { data: item(Number(path.split('/').at(-1))) } })

// Chromium native Enter includes a carriage return; do not synthesize a DOM click.
function nativeEnter() {
  cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' } }))
  cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
}

describe('BOLT-MIS-006 M-01: consultas de comunicados (API simulada)', () => {
  it('muestra carga, pagina y mantiene solo datos de la consulta actual', () => {
    setup((path, n) => ({ ...normal(path, n), delay: 600 }))
    cy.get(listRegion).should('contain', 'Cargando comunicaciones… Página 1.')
    cy.wait('@list'); cy.get(listRegion).should('contain', 'Comunicado 10')
    cy.get(listRegion).contains('button', 'Siguiente').click()
    cy.get(listRegion).should('contain', 'Página 2.').and('not.contain', 'Comunicado 10')
    cy.wait('@list'); cy.get(listRegion).should('contain', 'Página 2 de 2').and('contain', 'Comunicado 20')
  })

  it('recupera página 2 con el mismo GET sin repetir escrituras ni perder el detalle', () => {
    const { writes, gets } = setup((path, n, attempt) => path === '/api/v1/communications' && n === 2 && attempt === 1 ? { statusCode: 500, body: { message: 'Error temporal' } } : normal(path, n))
    cy.wait('@list'); cy.get(listRegion).contains('button', 'Leer comunicado').first().click(); cy.wait('@detail10')
    cy.get(listRegion).contains('button', 'Siguiente').click(); cy.wait('@list')
    cy.get(listRegion).should('contain', 'No se pudo completar esta consulta').and('not.contain', 'No hay comunicaciones disponibles')
    cy.get(listRegion).contains('button', 'Reintentar consulta').click(); cy.wait('@list').its('request.url').should('include', 'page=2')
    cy.get(listRegion).should('contain', 'Página 2 de 2').and('not.contain', 'Error temporal')
    cy.get(detailRegion).should('contain', 'Contenido 10')
    cy.then(() => { expect(writes).to.have.length(0); expect(gets.filter(url => url === '/api/v1/communications/10')).to.have.length(1) })
  })

  it('reintenta solo detalle y conserva texto del editor', () => {
    let failing = true
    const { writes, gets } = setup((path, n) => path === '/api/v1/communications' ? { body: page(n, true) } : failing ? { statusCode: 500, body: {} } : { body: { data: item(10, true) } }, { manage: true })
    cy.wait('@list'); cy.contains('button', 'Nuevo comunicado').click()
    cy.get('[name="title"]').type('Texto pendiente')
    cy.get(listRegion).contains('button', 'Leer comunicado').first().click(); cy.wait('@detail10')
    cy.get(detailRegion).find('[role="alert"]').should('be.visible')
    cy.then(() => { failing = false })
    cy.get(detailRegion).contains('button', 'Reintentar consulta').click(); cy.wait('@detail10')
    cy.get(detailRegion).should('contain', 'Contenido 10'); cy.get('[name="title"]').should('have.value', 'Texto pendiente')
    cy.then(() => { expect(writes).to.have.length(0); expect(gets.filter(url => url.startsWith('/api/v1/communications?')).every(url => url.endsWith('page=1'))).to.eq(true) })
  })

  for (const status of [403, 404, 422]) {
    it('presenta error ' + status + ' sin reintento automático ni contenido privado', () => {
      setup((path, n) => path === '/api/v1/communications' ? normal(path, n) : { statusCode: status, body: { message: 'Detalle privado del servidor' } })
      cy.wait('@list'); cy.get(listRegion).contains('button', 'Leer comunicado').first().click(); cy.wait('@detail10')
      cy.get(detailRegion).find('[role="alert"]').should('be.visible')
      cy.get(detailRegion).should('not.contain', 'Detalle privado del servidor').and('not.contain', 'Contenido 10')
      cy.get(detailRegion).contains('button', 'Reintentar consulta').should('not.exist')
      cy.get(listRegion).should('contain', 'Comunicado 10')
    })
  }

  it('distingue vacío de fallo y conserva las restricciones del receptor', () => {
    setup(() => ({ body: { data: [], meta: { current_page: 1, last_page: 1 }, abilities: {} } }))
    cy.wait('@list'); cy.get(listRegion).should('contain', 'No hay comunicaciones disponibles.').and('not.contain', 'otros filtros')
    cy.get(listRegion).find('[role="alert"]').should('not.exist')
    cy.contains('button', 'Nuevo comunicado').should('not.exist'); cy.contains('button', 'Publicar comunicado').should('not.exist')
  })

  it('ignora detalle tardío al seleccionar otro comunicado', () => {
    setup((path, n) => ({ ...normal(path, n), delay: path.endsWith('/10') ? 900 : 0 }))
    cy.wait('@list'); cy.get(listRegion).contains('[data-testid="communication-card"]', 'Comunicado 10').contains('button', 'Leer comunicado').click()
    cy.get(listRegion).contains('[data-testid="communication-card"]', 'Comunicado 11').contains('button', 'Leer comunicado').click()
    cy.wait('@detail11'); cy.get(detailRegion).should('contain', 'Contenido 11')
    cy.wait('@detail10'); cy.get(detailRegion).should('contain', 'Contenido 11').and('not.contain', 'Contenido 10')
  })

  it('protege la ruta sin permiso de consulta', () => {
    const { gets, writes } = setup(normal, { denied: true })
    cy.contains('Comunicaciones').should('not.exist')
    cy.then(() => { expect(gets.filter(url => url.startsWith('/api/v1/communications'))).to.have.length(0); expect(writes).to.have.length(0) })
  })

  it('recupera con Enter en móvil con nombre accesible y sin desbordamiento', () => {
    cy.viewport(390, 844)
    let failing = true
    setup((path, n) => failing ? { statusCode: 500, body: {} } : normal(path, n))
    cy.wait('@list')
    cy.get(listRegion).find('[role="alert"]').should('be.visible')
    cy.then(() => { failing = false })
    // Focus the application frame before sending a native key to its focused control.
    cy.get(listRegion).click('topRight')
    cy.get(listRegion).contains('button', 'Reintentar consulta').should('be.visible').and('be.enabled').should(button => { expect(button.attr('type')).to.eq('button') }).focus().should('have.focus')
    const events: string[] = []
    cy.get(listRegion).contains('button', 'Reintentar consulta').then(button => {
      for (const kind of ['keydown', 'keyup', 'click']) button[0].addEventListener(kind, event => events.push(kind + ':' + event.isTrusted))
    })
    nativeEnter()
    cy.then(() => expect(events, 'native keyboard activation events').to.include('click:true'))
    cy.wait('@list'); cy.get(listRegion).should('contain', 'Comunicado 10')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })

  it('no desborda horizontalmente en móvil durante error y después de recuperar la consulta', () => {
    cy.viewport(390, 844)
    let failing = true
    setup((path, n) => failing ? { statusCode: 500, body: {} } : normal(path, n))
    cy.get(listRegion).find('[role="alert"]').should('be.visible')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
    cy.then(() => { failing = false })
    cy.get(listRegion).contains('button', 'Reintentar consulta').click()
    cy.get(listRegion).should('contain', 'Comunicado 10')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })

  it('mantiene errores de escritura separados y no repite publicación al recuperar detalle', () => {
    const { writes } = setup((path, n) => path === '/api/v1/communications' ? { body: page(n, true) } : { statusCode: 500, body: {} }, { manage: true })
    cy.on('window:confirm', () => true)
    cy.wait('@list'); cy.get(listRegion).contains('button', 'Publicar comunicado').first().click()
    cy.contains('[role="alert"]', 'Escritura fallida de prueba').should('be.visible')
    cy.get(listRegion).contains('button', 'Leer comunicado').first().click(); cy.wait('@detail10')
    cy.get(detailRegion).contains('button', 'Reintentar consulta').click(); cy.wait('@detail10')
    cy.contains('[role="alert"]', 'Escritura fallida de prueba').should('be.visible')
    cy.then(() => expect(writes).to.deep.eq(['POST /api/v1/communications/10/publish']))
  })
})
