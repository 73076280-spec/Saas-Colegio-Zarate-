import type { User } from '../../../frontend/src/auth/types'

const detail = '[data-testid="justification-detail"]'
const page = (data: unknown[], current = 1, last = 2) => ({ data, current_page: current, last_page: last })
type Reply = { body?: unknown; statusCode?: number; delay?: number }
type Query = (url: URL, attempt: number) => Reply | undefined
function setup(options: { list?: Query; history?: Query; record?: Query; role?: User['roles'][number]; permission?: boolean; actionError?: boolean; readonly?: boolean } = {}) {
  const user: User = { id: 1, institution_id: 1, first_name: 'Cuenta', last_name: 'Consulta', name: 'Cuenta Consulta', email: 'query@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: [options.role ?? 'SECRETARY'], permissions: options.permission === false ? [] : ['justifications.view', 'justifications.review', 'justifications.approve', 'justifications.reject', 'students.view'], institution: { id: 1, name: 'Prueba', code: 'TEST' } }
  const calls = { writes: 0, lists: [] as string[], histories: [] as string[] }
  const attempts: Record<string, number> = {}
  let status = 'IN_REVIEW'
  const record = (id: number) => ({ id, attendance_record_id: id, student_id: 5, student: 'Estudiante simulado ' + id, date: '2026-11-01', course: 'Curso simulado', reason: 'Motivo simulado ' + id, status, original_filename: 'sustento.txt', review_comment: null, abilities: { review: !options.readonly, approve: !options.readonly, reject: !options.readonly } })
  cy.intercept('/api/v1/**', req => {
    const url = new URL(req.url), path = url.pathname, key = path + url.search
    if (req.method !== 'GET') {
      calls.writes++; req.alias = 'queryWrite'
      if (options.actionError) return req.reply({ statusCode: 422, body: { message: 'Decisión rechazada por el servidor' } })
      status = 'APPROVED'; return req.reply({ data: record(10) })
    }
    attempts[key] = (attempts[key] ?? 0) + 1
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    if (path === '/api/v1/students') return req.reply(page([{ id: 5, user: { name: 'Estudiante para filtro' } }], 1, 1))
    if (path === '/api/v1/absence-justifications') {
      calls.lists.push(url.search); req.alias = 'queryList' + url.searchParams.get('page') + (url.searchParams.get('status') || 'ALL')
      return req.reply(options.list?.(url, attempts[key]) ?? { body: page([record(10), record(11)], Number(url.searchParams.get('page'))) })
    }
    const match = path.match(/absence-justifications\/(\d+)(\/history)?$/)
    if (match) {
      const id = Number(match[1])
      if (match[2]) {
        calls.histories.push(path + url.search); req.alias = 'queryHistory' + id
        return req.reply(options.history?.(url, attempts[key]) ?? { body: page([{ id: 1, previous_status: 'PENDING', new_status: status, changed_by: 2, comment: 'Comentario de historial ' + id, created_at: '2026-11-01T15:00:00Z' }], Number(url.searchParams.get('page'))) })
      }
      req.alias = 'queryDetail' + id
      return req.reply(options.record?.(url, attempts[key]) ?? { body: { data: record(id) } })
    }
    return req.reply({ statusCode: 403, body: { message: 'Sin acceso a este recurso' } })
  })
  cy.visit('/app/justifications')
  return calls
}
function open(id = 10) { cy.contains('[data-testid="justification-row"]', 'Estudiante simulado ' + id).contains('button', 'Ver justificación').click(); cy.get(detail).should('contain', 'Motivo simulado ' + id) }
function filter(status = 'PENDING') { cy.get('select[name="status"]').select(status); cy.contains('button', /^Filtrar$/).click() }

describe('BOLT-MIS-005 M-02: consultas de justificaciones (API simulada)', () => {
  it('consulta filas y detalle/historial conservando campos y nombre accesible del selector', () => {
    setup(); cy.wait('@queryList1ALL'); open()
    cy.get('[aria-label="Estudiante para filtrar justificaciones"]').should('be.visible')
    cy.get(detail).should('contain', 'Usuario #2').and('contain', 'Comentario de historial 10').and('contain', '2026-11-01T15:00:00Z')
  })

  it('conserva filtros aplicados y página al recuperar un GET 500, sin escrituras', () => {
    const calls = setup({ list: (url, attempt) => url.searchParams.get('page') === '2' && attempt === 1 ? { statusCode: 500, body: { message: 'Fallo temporal de listado' } } : undefined })
    cy.wait('@queryList1ALL')
    cy.get('select[name="student_id"]').select('5'); cy.get('input[name="date"]').type('2026-11-01'); filter('IN_REVIEW'); cy.wait('@queryList1IN_REVIEW')
    cy.get('[aria-label="Páginas de justificaciones"]').contains('button', 'Siguiente').click(); cy.wait('@queryList2IN_REVIEW')
    cy.contains('Fallo temporal de listado').should('be.visible'); cy.get('[data-testid="justification-row"]').should('not.exist')
    cy.contains('button', 'Reintentar consulta de justificaciones').click()
    cy.wait('@queryList2IN_REVIEW').then(call => {
      const params = new URL(call.request.url).searchParams
      expect(params.get('page')).to.eq('2'); expect(params.get('status')).to.eq('IN_REVIEW'); expect(params.get('student_id')).to.eq('5'); expect(params.get('date')).to.eq('2026-11-01')
    })
    cy.contains('Fallo temporal de listado').should('not.exist')
    cy.get('select[name="status"]').should('have.value', 'IN_REVIEW'); cy.get('input[name="date"]').should('have.value', '2026-11-01')
    cy.then(() => expect(calls.writes).to.eq(0))
  })

  it('reinicia página y retira detalle y filas anteriores al aplicar otro filtro', () => {
    setup({ list: url => url.searchParams.get('status') ? { delay: 600, body: page([], 1, 1) } : undefined }); cy.wait('@queryList1ALL')
    cy.get('[aria-label="Páginas de justificaciones"]').contains('button', 'Siguiente').click(); cy.wait('@queryList2ALL'); open()
    filter()
    cy.get(detail).should('not.exist'); cy.get('[data-testid="justification-row"]').should('not.exist')
    cy.contains('Cargando justificaciones… Página 1.').should('be.visible')
    cy.wait('@queryList1PENDING').its('request.url').should('include', 'page=1')
    cy.contains('No hay justificaciones con estos filtros.').should('be.visible')
    filter(''); cy.wait('@queryList1ALL'); cy.get('[data-testid="justification-row"]').should('have.length', 2)
  })

  for (const code of [403, 404, 422]) {
    it('retira filas previas y permite repetir exclusivamente GET tras ' + code, () => {
      const calls = setup({ list: (url, attempt) => url.searchParams.get('page') === '2' && attempt === 1 ? { statusCode: code, body: { message: 'Consulta rechazada ' + code } } : undefined })
      cy.wait('@queryList1ALL'); open()
      cy.get('[aria-label="Páginas de justificaciones"]').contains('button', 'Siguiente').click(); cy.wait('@queryList2ALL')
      cy.get(detail).should('not.exist'); cy.get('[data-testid="justification-row"]').should('not.exist')
      cy.contains('Consulta rechazada ' + code).should('be.visible')
      cy.contains('button', 'Reintentar consulta de justificaciones').click(); cy.wait('@queryList2ALL')
      cy.get('[data-testid="justification-row"]').should('have.length', 2)
      cy.then(() => expect(calls.writes).to.eq(0))
    })
  }

  it('una respuesta de filtro anterior no reemplaza la búsqueda más reciente', () => {
    let started = false
    setup({ list: url => {
      if (url.searchParams.get('status') === 'PENDING') { started = true; return { delay: 1400, body: page([{ id: 99, student: 'Respuesta antigua', abilities: {} }]) } }
      if (url.searchParams.get('status') === 'REJECTED') return { body: page([], 1, 1) }
    } }); cy.wait('@queryList1ALL'); filter()
    cy.wrap(null).should(() => expect(started).to.eq(true)); filter('REJECTED')
    cy.contains('No hay justificaciones con estos filtros.').should('be.visible')
    cy.wait('@queryList1PENDING'); cy.wait('@queryList1REJECTED')
    cy.get('[data-testid="justification-row"]').should('not.exist'); cy.contains('Respuesta antigua').should('not.exist')
  })

  it('recupera el detalle cuando falla su historial sin dejar carga perpetua ni repetir acciones', () => {
    let failed = true
    const calls = setup({ history: () => failed ? { statusCode: 500, body: { message: 'Historial no disponible' } } : undefined }); cy.wait('@queryList1ALL')
    cy.contains('[data-testid="justification-row"]', 'Estudiante simulado 10').contains('button', 'Ver justificación').click()
    cy.contains('Historial no disponible').should('be.visible'); cy.get(detail).should('not.contain', 'Cargando justificación')
    cy.get(detail).contains('button', 'Aprobar justificación').should('not.exist')
    cy.then(() => { failed = false })
    cy.get(detail).contains('button', 'Reintentar consulta del detalle e historial').click()
    cy.get(detail).should('contain', 'Motivo simulado 10').and('not.contain', 'Historial no disponible')
    cy.then(() => expect(calls.writes).to.eq(0))
  })

  it('conserva ID y página del historial al reintentar y muestra vacío explícito', () => {
    const calls = setup({ history: (url, attempt) => url.searchParams.get('page') === '2' ? attempt === 1 ? { statusCode: 500, body: { message: 'Fallo página dos' } } : { body: page([], 2, 2) } : undefined })
    cy.wait('@queryList1ALL'); open()
    cy.get(detail).contains('button', 'Siguiente').click(); cy.contains('Fallo página dos').should('be.visible')
    cy.get(detail).should('not.contain', 'Comentario de historial 10')
    cy.get(detail).contains('button', 'Reintentar consulta del detalle e historial').click()
    cy.get(detail).should('contain', 'No hay cambios registrados en el historial').and('contain', 'Página 2 de 2')
    cy.then(() => { expect(calls.histories.at(-1)).to.eq('/api/v1/absence-justifications/10/history?page=2'); expect(calls.writes).to.eq(0) })
  })

  it('ignora detalle e historial tardíos al seleccionar otra solicitud', () => {
    let started = false
    setup({ record: url => url.pathname.endsWith('/10') ? { delay: 1500, body: { data: { id: 10, reason: 'Detalle antiguo', abilities: {} } } } : undefined, history: url => {
      if (url.pathname.includes('/10/')) { started = true; return { delay: 1500, body: page([]) } }
    } }); cy.wait('@queryList1ALL')
    cy.contains('[data-testid="justification-row"]', 'Estudiante simulado 10').contains('button', 'Ver justificación').click()
    cy.wrap(null).should(() => expect(started).to.eq(true)); open(11)
    cy.wait('@queryDetail10'); cy.wait('@queryHistory10')
    cy.get(detail).should('contain', 'Motivo simulado 11').and('not.contain', 'Detalle antiguo')
  })

  it('cancelar cambio de consulta conserva comentario y confirmar lo descarta', () => {
    setup(); cy.wait('@queryList1ALL'); open(); cy.get('textarea[name="review_comment"]').type('Comentario pendiente')
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    filter('APPROVED'); cy.get('textarea[name="review_comment"]').should('have.value', 'Comentario pendiente')
    cy.then(() => confirm.returns(true)); cy.contains('button', /^Filtrar$/).click(); cy.wait('@queryList1APPROVED')
    cy.get(detail).should('not.exist')
  })

  it('conserva comentario tras POST rechazado y el retry de consulta no reenvía el POST', () => {
    const calls = setup({ actionError: true }); cy.wait('@queryList1ALL'); open(); cy.on('window:confirm', () => true)
    cy.get('textarea[name="review_comment"]').type('Comentario conservado')
    cy.get(detail).contains('button', 'Aprobar justificación').click(); cy.wait('@queryWrite')
    cy.get('textarea[name="review_comment"]').should('have.value', 'Comentario conservado')
    cy.get(detail).contains('button', 'Reintentar consulta del detalle e historial').click()
    cy.get('textarea[name="review_comment"]').should('have.value', 'Comentario conservado')
    cy.then(() => expect(calls.writes).to.eq(1))
  })

  it('mantiene éxito de decisión si falla la lectura posterior y retry solo relee', () => {
    let written = false
    const calls = setup({ history: () => written ? { statusCode: 500, body: { message: 'Fallo posterior a decisión' } } : undefined })
    cy.wait('@queryList1ALL'); open(); cy.on('window:confirm', () => true)
    cy.intercept('POST', '/api/v1/absence-justifications/10/approve', req => { calls.writes++; written = true; req.reply({ data: {} }) }).as('approvedQuery')
    cy.get(detail).contains('button', 'Aprobar justificación').click(); cy.wait('@approvedQuery')
    cy.get(detail).should('contain', 'Decisión registrada.').and('contain', 'Fallo posterior a decisión')
    cy.then(() => { written = false })
    cy.get(detail).contains('button', 'Reintentar consulta del detalle e historial').click()
    cy.get(detail).should('contain', 'Motivo simulado 10').and('not.contain', 'Fallo posterior a decisión')
    cy.then(() => expect(calls.writes).to.eq(1))
  })

  it('no inicia consulta administrativa para rol no autorizado aunque tenga permiso aislado', () => {
    const calls = setup({ role: 'GUARDIAN' })
    cy.contains('No tienes acceso a la revisión institucional.').should('be.visible')
    cy.then(() => { expect(calls.lists).to.have.length(0); expect(calls.writes).to.eq(0) })
  })

  it('respeta la falta de permiso y capacidades sin ofrecer acciones de decisión', () => {
    setup({ readonly: true }); cy.wait('@queryList1ALL'); open()
    cy.get(detail).contains('button', 'Aprobar justificación').should('not.exist')
    cy.get(detail).contains('button', 'Rechazar justificación').should('not.exist')
  })

  it('rechaza la ruta sin justifications.view y no consulta el listado', () => {
    const calls = setup({ permission: false })
    cy.contains('No tienes permiso para acceder a esta sección.').should('be.visible')
    cy.then(() => expect(calls.lists).to.have.length(0))
  })

  it('recupera por Enter nativo y conserva presentación móvil', () => {
    let failed = true
    setup({ list: () => failed ? { statusCode: 500, body: { message: 'Fallo inicial' } } : undefined })
    cy.viewport(390, 844)
    cy.contains('button', 'Reintentar consulta de justificaciones').focus().should('have.focus')
    cy.window().then(win => win.focus())
    cy.then(() => { failed = false })
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    cy.get('[data-testid="justification-row"]').should('have.length', 2)
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })
})
