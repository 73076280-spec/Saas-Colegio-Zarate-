import type { User } from '../../../frontend/src/auth/types'

const historyPanel = '[aria-label="Historial de cambios de la nota"]'
const entry = (id: number, reason: string) => ({ id, old_score: '10.00', new_score: '12.50', changed_by: 8, reason, created_at: '2026-10-28T15:00:00Z' })
const historyPage = (data: unknown[], current = 1, last = 2) => ({ data, current_page: current, last_page: last, total: last * data.length })
type Reply = { body?: unknown; statusCode?: number; delay?: number }
function setup(reply: (id: number, page: number, attempt: number) => Reply) {
  const user: User = { id: 1, institution_id: 1, first_name: 'Estudiante', last_name: 'Prueba', name: 'Estudiante Prueba', email: 'history@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: ['STUDENT'], permissions: ['scores.view'], institution: { id: 1, name: 'Institución de prueba', code: 'TEST' } }
  const attempts: Record<string, number> = {}
  const requests: string[] = []
  cy.intercept('GET', '/api/v1/**', req => {
    const url = new URL(req.url)
    requests.push(url.pathname)
    if (url.pathname === '/api/v1/auth/me') return req.reply({ data: user })
    if (url.pathname === '/api/v1/my/scores') {
      req.alias = 'personalScores'
      return req.reply({ data: [12, 13].map(id => ({ id, score: '12.50', student: { id: 1, name: user.name }, course: { id: 7, name: 'Matemática' }, assessment: { id, title: 'Evaluación ' + id }, period: { name: 'Periodo 1' }, abilities: {} })), current_page: 1, last_page: 1 })
    }
    const match = url.pathname.match(/^\/api\/v1\/scores\/(\d+)\/history$/)
    if (match) {
      const id = Number(match[1]), page = Number(url.searchParams.get('page'))
      const key = id + '_' + page
      attempts[key] = (attempts[key] ?? 0) + 1
      req.alias = 'history_' + key
      return req.reply(reply(id, page, attempts[key]))
    }
    return req.reply({ statusCode: 403, body: { message: 'Acceso no autorizado' } })
  })
  cy.visit('/app/my-scores')
  cy.wait('@personalScores')
  return requests
}
function openNote(index = 0) { cy.get('[data-testid="score-row"]').eq(index).contains('button', 'Historial').click() }
function nextPage() { cy.get(historyPanel).contains('button', 'Siguiente').click() }

describe('BOLT-MIS-004 M-02: historial de cambios de una nota (API simulada)', () => {
  it('indica carga inicial y conserva valores, motivo, actor, fecha y orden del servidor', () => {
    setup(() => ({ delay: 700, body: historyPage([entry(9, 'Primero recibido'), entry(3, 'Segundo recibido')]) }))
    openNote()
    cy.get(historyPanel).should('contain', 'Cargando historial… Página 1.').and('not.contain', 'Primero recibido')
    cy.wait('@history_12_1')
    cy.get(historyPanel).should('contain', '10.00 → 12.50').and('contain', 'Usuario #8').and('not.contain', 'Cargando historial')
    cy.get(historyPanel).find('p.my-3').eq(0).should('contain', 'Primero recibido')
    cy.get(historyPanel).find('p.my-3').eq(1).should('contain', 'Segundo recibido')
    cy.window().then(win => cy.get(historyPanel).should('contain', new win.Date('2026-10-28T15:00:00Z').toLocaleString('es-PE')))
    cy.contains('button', 'Modificar nota').should('not.exist')
  })

  it('carga la página siguiente sin presentar filas o paginación anteriores como actuales', () => {
    setup((_id, page) => ({ delay: page === 2 ? 700 : 0, body: historyPage([entry(page, 'Cambio página ' + page)], page) }))
    openNote(); cy.wait('@history_12_1'); nextPage()
    cy.get(historyPanel).should('contain', 'Cargando historial… Página 2.').and('not.contain', 'Cambio página 1')
    cy.get(historyPanel).contains('button', 'Siguiente').should('not.exist')
    cy.wait('@history_12_2').its('request.url').should('include', 'page=2')
    cy.get(historyPanel).should('contain', 'Cambio página 2').and('contain', 'Página 2 de 2')
    cy.get(historyPanel).contains('button', 'Anterior').click()
    cy.wait('@history_12_1')
    cy.get(historyPanel).should('contain', 'Cambio página 1')
  })

  it('recupera un error 500 reintentando la misma nota y página y limpia el error obsoleto', () => {
    setup((_id, page, attempt) => page === 2 && attempt === 1 ? { statusCode: 500, body: { message: 'Fallo temporal' } } : { delay: page === 2 ? 500 : 0, body: historyPage([entry(page, 'Recuperado página ' + page)], page) })
    openNote(); cy.wait('@history_12_1'); nextPage(); cy.wait('@history_12_2')
    cy.get(historyPanel).should('contain', 'No se pudo consultar el historial.').and('contain', 'Fallo temporal').and('not.contain', 'Recuperado página 1')
    cy.get(historyPanel).contains('button', 'Reintentar historial').focus().should('have.focus').click()
    cy.get(historyPanel).should('contain', 'Cargando historial… Página 2.').and('not.contain', 'Fallo temporal')
    cy.wait('@history_12_2').its('request.url').should('include', '/scores/12/history?page=2')
    cy.get(historyPanel).should('contain', 'Recuperado página 2').and('not.contain', 'No se pudo consultar').and('not.contain', 'Fallo temporal')
    cy.get(historyPanel).contains('button', 'Reintentar historial').should('not.exist')
  })

  it('presenta vacío explícito y permite ocultar y volver a consultar', () => {
    setup(() => ({ body: historyPage([], 1, 1) }))
    openNote(); cy.wait('@history_12_1')
    cy.get(historyPanel).should('contain', 'No hay cambios registrados para esta nota.').and('not.contain', 'No se pudo consultar')
    cy.contains('button', 'Ocultar historial').click(); cy.get(historyPanel).should('not.exist')
    openNote(); cy.wait('@history_12_1')
    cy.get(historyPanel).should('contain', 'No hay cambios registrados')
  })

  for (const lateError of [false, true]) {
    it('ignora una respuesta ' + (lateError ? 'fallida' : 'correcta') + ' tardía al cambiar de nota', () => {
      let started = false
      setup((id, page) => {
        if (id === 12) { started = true; return { delay: 1600, statusCode: lateError ? 500 : 200, body: lateError ? { message: 'Error de nota anterior' } : historyPage([entry(1, 'Dato de nota anterior')], page) } }
        return { body: historyPage([entry(2, 'Nota vigente')], 1, 1) }
      })
      openNote(); cy.wrap(null).should(() => expect(started).to.eq(true))
      openNote(1); cy.wait('@history_13_1')
      cy.get(historyPanel).should('contain', 'Nota #13').and('contain', 'Nota vigente')
      cy.wait('@history_12_1')
      cy.get(historyPanel).should('contain', 'Nota vigente').and('not.contain', 'Dato de nota anterior').and('not.contain', 'Error de nota anterior')
    })
  }

  it('reinicia la página al seleccionar otra nota sin reutilizar sus datos', () => {
    setup((id, page) => ({ body: historyPage([entry(id, 'Cambio ' + id + '/' + page)], page) }))
    openNote(); cy.wait('@history_12_1'); nextPage(); cy.wait('@history_12_2')
    openNote(1); cy.wait('@history_13_1')
    cy.get(historyPanel).should('contain', 'Cambio 13/1').and('contain', 'Página 1 de 2').and('not.contain', 'Cambio 12/2')
  })

  it('descarta datos previos ante 403 y no consulta audit-logs ni rutas familiares', () => {
    const requests = setup((_id, page) => page === 2 ? { statusCode: 403, body: { message: 'No autorizado' } } : { body: historyPage([entry(1, 'Solo primera página')]) })
    openNote(); cy.wait('@history_12_1'); nextPage(); cy.wait('@history_12_2')
    cy.get(historyPanel).should('contain', 'No autorizado').and('not.contain', 'Solo primera página').and('not.contain', 'Usuario #8')
    cy.then(() => expect(requests.some(path => /audit-logs|family/.test(path))).to.eq(false))
  })

  it('mantiene las alternativas iniciales para valor/motivo nulos y presentación móvil', () => {
    setup(() => ({ body: historyPage([{ ...entry(1, 'Inicial'), old_score: null, reason: null }], 1, 1) }))
    cy.viewport(390, 844); openNote(); cy.wait('@history_12_1')
    cy.get(historyPanel).should('be.visible').and('contain', 'Sin nota → 12.50').and('contain', 'Registro inicial')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })
})
