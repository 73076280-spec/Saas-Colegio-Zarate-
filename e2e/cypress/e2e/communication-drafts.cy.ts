import type { User } from '../../../frontend/src/auth/types'

const form = '[data-testid="communication-form"]'
type Reply = { statusCode?: number; body?: unknown; delay?: number }
const record = (id: number) => ({ id, title: 'Borrador ' + id, body: 'Texto inicial ' + id, status: 'DRAFT', targets: [{ kind: 'institution', target: '1' }], abilities: { update: true, publish: true, archive: true } })
function setup(write: (method: string, body: Record<string, unknown>) => Reply = (_method, body) => ({ statusCode: 201, body: { data: { ...record(30), ...body } } })) {
  const user: User = { id: 1, institution_id: 1, first_name: 'Secretaría', last_name: 'Prueba', name: 'Secretaría Prueba', email: 'drafts@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: ['SECRETARY'], permissions: ['communications.view', 'communications.create', 'communications.publish', 'communications.archive'], institution: { id: 1, name: 'Institución de prueba', code: 'TEST' } }
  const writes: { method: string; path: string; body: Record<string, unknown> }[] = []
  cy.intercept('/api/**', req => {
    const path = new URL(req.url).pathname
    if (req.method !== 'GET') {
      writes.push({ method: req.method, path, body: req.body })
      req.alias = 'saveDraft'
      return req.reply(write(req.method, req.body))
    }
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    if (path === '/api/v1/communications') { req.alias = 'draftList'; return req.reply({ data: [record(10), record(11)], meta: { current_page: 1, last_page: 1 }, abilities: { create: true } }) }
    if (/\/communications\/\d+$/.test(path)) { req.alias = 'draftDetail'; return req.reply({ data: record(Number(path.split('/').at(-1))) }) }
    if (path.startsWith('/api/v1/office-options/')) return req.reply({ data: [{ id: 2, name: 'Destinatario de prueba' }], meta: { current_page: 1, last_page: 1 } })
    return req.reply({ statusCode: 403, body: { message: 'No autorizado en simulación' } })
  })
  cy.visit('/app/communications')
  cy.get('[data-testid="communication-card"]').should('have.length', 2)
  return writes
}
function edit(id = 10) { cy.contains('[data-testid="communication-card"]', 'Borrador ' + id).contains('button', 'Editar borrador').click() }
function newDraft() { cy.contains('button', 'Nuevo comunicado').click() }
function fill() { cy.get(form + ' [name="title"]').clear().type('Título local'); cy.get(form + ' [name="body"]').clear().type('Texto local') }
function beforeUnload(cancelled: boolean) {
  cy.window().then(win => {
    const event = new win.Event('beforeunload', { cancelable: true })
    win.dispatchEvent(event)
    expect(event.defaultPrevented).to.eq(cancelled)
  })
}

describe('BOLT-MIS-006 M-02: borradores de comunicados (API simulada)', () => {
  it('distingue limpio, cambios reales y reversión de texto y destinatarios', () => {
    setup(); edit(); cy.get(form).should('contain', 'Sin cambios pendientes.')
    cy.get(form + ' [name="title"]').type(' modificado'); cy.get(form).should('contain', 'Cambios sin guardar')
    cy.get(form + ' [name="title"]').clear().type('Borrador 10')
    cy.get(form + ' [name="target_kind_0"]').select('user')
    cy.get(form + ' [name="target_value_0"]').should('have.attr', 'aria-label', 'Destinatario 1: Usuario').select('2')
    cy.get(form).should('contain', 'Cambios sin guardar')
    cy.get(form + ' [name="target_kind_0"]').select('institution')
    cy.get(form).should('contain', 'Sin cambios pendientes.')
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    edit(11); cy.get(form + ' [name="title"]').should('have.value', 'Borrador 11')
    cy.then(() => expect(confirm).not.to.have.been.called)
  })

  it('cancela el reemplazo y conserva título, cuerpo, destinatarios y editor', () => {
    setup(); edit(); fill()
    cy.get(form + ' [name="target_kind_0"]').select('user'); cy.get(form + ' [name="target_value_0"]').select('2')
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    edit(11)
    cy.get(form + ' [name="title"]').should('have.value', 'Título local'); cy.get(form + ' [name="body"]').should('have.value', 'Texto local')
    cy.get(form + ' [name="target_value_0"]').should('have.value', '2')
    cy.then(() => expect(confirm).to.have.been.calledOnce)
  })

  it('confirma el descarte al cambiar de editor y reinicia también un borrador nuevo', () => {
    setup(); edit(); fill(); cy.on('window:confirm', () => true)
    edit(11); cy.get(form + ' [name="title"]').should('have.value', 'Borrador 11'); cy.get(form).should('contain', 'Sin cambios pendientes.')
    newDraft(); fill(); newDraft()
    cy.get(form + ' [name="title"]').should('have.value', ''); cy.get(form + ' [name="body"]').should('have.value', '')
  })

  it('cancelar conserva el borrador si se rechaza el descarte y cierra si se confirma', () => {
    setup(); newDraft(); fill()
    let discard = false
    cy.on('window:confirm', () => discard)
    cy.get(form).contains('button', 'Cancelar').click(); cy.get(form).should('contain', 'Cambios sin guardar')
    cy.then(() => { discard = true })
    cy.get(form).contains('button', 'Cancelar').click(); cy.get(form).should('not.exist')
  })

  it('consultar otro comunicado conserva el editor sin descartar ni publicar', () => {
    const writes = setup(); edit(); fill()
    cy.contains('[data-testid="communication-card"]', 'Borrador 11').contains('button', 'Leer comunicado').click()
    cy.get('[aria-label="Detalle del comunicado"]').should('contain', 'Texto inicial 11')
    cy.get(form + ' [name="title"]').should('have.value', 'Título local')
    cy.get('[data-testid="communication-card"]').contains('button', 'Publicar comunicado').should('be.disabled')
    cy.then(() => expect(writes).to.have.length(0))
  })

  it('guarda una creación solo tras confirmación del servidor y sin publicar', () => {
    const writes = setup(); newDraft(); fill(); cy.get(form).contains('button', 'Guardar borrador').click()
    cy.wait('@saveDraft').its('request.method').should('eq', 'POST')
    cy.get(form).should('not.exist'); cy.get('[aria-label="Detalle del comunicado"]').should('contain', 'Borrador 30')
    beforeUnload(false)
    cy.then(() => { expect(writes).to.have.length(1); expect(writes[0].path).to.eq('/api/v1/communications'); expect(writes[0].body.title).to.eq('Título local') })
  })

  for (const status of [422, 500]) {
    it('conserva la edición tras error ' + status + ' sin repetir PATCH', () => {
      const writes = setup(() => ({ statusCode: status, body: { message: 'No se pudo guardar el borrador' } }))
      edit(); fill(); cy.get(form).contains('button', 'Guardar borrador').click(); cy.wait('@saveDraft')
      cy.get(form).should('contain', 'No se pudo guardar el borrador').and('contain', 'Cambios sin guardar')
      cy.get(form + ' [name="title"]').should('have.value', 'Título local').and('be.enabled')
      cy.get(form + ' [name="body"]').should('have.value', 'Texto local')
      cy.then(() => { expect(writes).to.have.length(1); expect(writes[0].method).to.eq('PATCH'); expect(writes[0].path).to.eq('/api/v1/communications/10') })
    })
  }

  it('bloquea campos y operaciones incompatibles durante guardado pendiente', () => {
    const writes = setup((_method, body) => ({ delay: 1200, body: { data: { ...record(10), ...body } } }))
    edit(); fill(); cy.get(form).contains('button', 'Guardar borrador').click()
    cy.get(form).should('have.attr', 'aria-busy', 'true').and('contain', 'Guardando borrador…')
    cy.get(form + ' input, ' + form + ' textarea, ' + form + ' select, ' + form + ' button').each(control => cy.wrap(control).should('be.disabled'))
    cy.contains('button', 'Nuevo comunicado').should('be.disabled')
    cy.get('[data-testid="communication-card"]').find('button').each(control => cy.wrap(control).should('be.disabled'))
    cy.wait('@saveDraft'); cy.get(form).should('not.exist')
    cy.then(() => expect(writes).to.have.length(1))
  })

  it('registra beforeunload solo con cambios o guardado y lo limpia al descartar', () => {
    setup(); edit(); beforeUnload(false); fill(); beforeUnload(true)
    cy.on('window:confirm', () => true)
    cy.get(form).contains('button', 'Cancelar').click(); beforeUnload(false)
  })

  it('documenta salida SPA no bloqueada e ignora una respuesta de guardado del editor desmontado', () => {
    setup((_method, body) => ({ delay: 1800, body: { data: { ...record(30), ...body } } }))
    edit(); fill(); cy.get(form).contains('button', 'Guardar borrador').click()
    cy.get(form).should('contain', 'Guardando borrador…')
    cy.get('nav a[href="/app"]').first().click()
    cy.location('pathname').should('eq', '/app')
    cy.go('back'); cy.get('[data-testid="communication-card"]').should('have.length', 2)
    newDraft(); cy.get(form + ' [name="title"]').type('Otro editor posterior')
    cy.wait('@saveDraft')
    cy.get(form + ' [name="title"]').should('have.value', 'Otro editor posterior')
    cy.get('[aria-label="Detalle del comunicado"]').should('not.exist')
  })

  it('mantiene teclado nativo y ancho móvil al editar y confirmar guardado', () => {
    cy.viewport(390, 844)
    const writes = setup(); newDraft(); fill()
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
    cy.get(form).contains('button', 'Guardar borrador').focus().should('have.focus')
    const clicks: boolean[] = []
    cy.get(form).contains('button', 'Guardar borrador').then(button => button[0].addEventListener('click', event => clicks.push(event.isTrusted)))
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' } }))
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    cy.wait('@saveDraft'); cy.get(form).should('not.exist')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
    cy.then(() => { expect(clicks).to.deep.eq([true]); expect(writes).to.have.length(1) })
  })
})
