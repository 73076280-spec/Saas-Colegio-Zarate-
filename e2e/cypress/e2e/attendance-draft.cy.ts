import type { User } from '../../../frontend/src/auth/types'

const roster = '[data-testid="attendance-roster"]'
const marking = '[aria-label="Asistencia de Estudiante de prueba"]'
const observation = '[aria-label="Observación de Estudiante de prueba"]'
const paginate = (data: unknown[], current = 1, last = 1) => ({ data, current_page: current, last_page: last })
function setup(options: { readonly?: boolean; closed?: boolean; postError?: number; postDelay?: number; refreshDelay?: number; refreshError?: boolean; late?: boolean } = {}) {
  const user: User = { id: 1, institution_id: 1, first_name: 'Cuenta', last_name: 'Prueba', name: 'Cuenta Prueba', email: 'attendance@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: ['TEACHER'], permissions: ['attendance.view', ...(!options.readonly ? ['attendance.create', 'attendance.update', 'attendance.close'] : [])], institution: { id: 1, name: 'Prueba', code: 'TEST' } }
  const course = (id: number) => ({ id, code: 'TEST-' + id, name: 'Curso ' + id, status: 'ACTIVE', teacher: { name: user.name }, subject: { name: 'Matemática' }, academic_year: { name: '2026' }, grade_level: { name: 'Primero', level: 'Secundaria' }, section: { name: 'A' } })
  const session = (id: number) => ({ id, date: id === 10 ? '2026-11-01' : '2026-11-02', topic: 'Sesión ' + id, status: options.closed ? 'CLOSED' : 'OPEN', abilities: { update: !options.readonly, close: !options.readonly } })
  const stored: Record<number, { status: string; observations: string }> = { 10: { status: 'PRESENT', observations: 'Guardada' }, 11: { status: 'ABSENT', observations: 'Otra sesión' }, 12: { status: 'PRESENT', observations: '' }, 20: { status: 'LATE', observations: 'Curso nuevo' } }
  const calls = { saves: 0, creates: 0, closes: 0, refreshes: 0 }
  const row = (id: number, current: number) => ({ student_id: 1, student: 'Estudiante de prueba', can_record: true, record: { id: 1, student_id: 1, status: stored[id].status, observations: stored[id].observations, justification: null }, current })
  cy.intercept('GET', '/api/v1/**', req => {
    const url = new URL(req.url), path = url.pathname
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    if (path === '/api/v1/my/courses') { req.alias = 'draftCourses'; return req.reply(paginate([course(7), course(8)])) }
    if (/^\/api\/v1\/courses\/[78]$/.test(path)) return req.reply({ data: course(Number(path.split('/').pop())) })
    if (/\/courses\/[78]\/students$/.test(path)) return req.reply(paginate([]))
    if (/\/courses\/[78]\/attendance-sessions$/.test(path)) {
      req.alias = 'draftSessions'
      return req.reply({ ...paginate(path.includes('/7/') ? [session(10), session(11), session(12)] : [session(20)]), abilities: { create: !options.readonly } })
    }
    const match = path.match(/\/attendance-sessions\/(\d+)\/records$/)
    if (match) {
      const id = Number(match[1]), current = Number(url.searchParams.get('page'))
      req.alias = calls.saves || calls.closes ? 'draftRefresh' : 'draftRoster' + id + '_' + current
      if (id === 10 && calls.saves) {
        calls.refreshes++
        if (options.refreshError && calls.refreshes === 1) return req.reply({ statusCode: 500, body: { message: 'Lectura temporalmente no disponible' } })
      }
      const data = current === 2 ? [{ ...row(id, current), student_id: 4, student: 'Otra página' }] : [row(id, current), { student_id: 2, student: 'Histórico', can_record: false, record: { status: 'ABSENT', observations: '', justification: null } }, { student_id: 3, student: 'Con justificación', can_record: true, record: { status: 'JUSTIFIED', observations: '', justification: { id: 1, status: 'APPROVED' } } }]
      return req.reply({ delay: id === 10 && (options.late || calls.saves) ? options.late ? 1600 : options.refreshDelay ?? 0 : 0, body: paginate(data, current, 2) })
    }
    return req.reply({ statusCode: 403, body: { message: 'Sin acceso' } })
  })
  cy.intercept('POST', '/api/v1/attendance-sessions/*/records', req => {
    calls.saves++
    if (options.postError) return req.reply({ statusCode: options.postError, body: { message: 'Registro rechazado por el servidor' } })
    const id = Number(req.url.match(/attendance-sessions\/(\d+)/)![1])
    stored[id] = req.body.records[0]
    req.reply({ delay: options.postDelay ?? 0, body: { data: [] } })
  }).as('saveDraft')
  cy.intercept('POST', '/api/v1/courses/7/attendance-sessions', req => {
    calls.creates++
    req.reply({ statusCode: 201, body: { data: { ...session(12), date: req.body.date } } })
  }).as('createDraftSession')
  cy.intercept('POST', '/api/v1/attendance-sessions/*/close', req => {
    calls.closes++
    req.reply({ data: { ...session(10), status: 'CLOSED' } })
  }).as('closeDraftSession')
  cy.visit('/app/my-courses')
  cy.wait('@draftCourses')
  cy.contains('[data-testid="course-card"]', 'Curso 7').contains('button', 'Entrar al curso').click()
  cy.wait('@draftSessions')
  return calls
}
function open(id = 10) { cy.contains('[data-testid="attendance-session"]', 'Sesión ' + id).contains('button', 'Abrir asistencia').click() }
function loaded(id = 10) { cy.wait(`@draftRoster${id}_1`); cy.get(roster).contains('Sin cambios pendientes.').should('be.visible') }
function edit() { cy.get(marking).select('ABSENT'); cy.get(observation).clear().type('Pendiente local') }
function save() { cy.get(roster).contains('button', 'Guardar asistencia de esta página').click() }
function unloadCancelled(expected: boolean) {
  cy.window().then(win => {
    const event = new win.Event('beforeunload', { cancelable: true })
    win.dispatchEvent(event)
    expect(event.defaultPrevented, 'aviso nativo solicitado').to.eq(expected)
  })
}

describe('BOLT-MIS-005 M-01: borrador de asistencia (API simulada)', () => {
  it('identifica datos guardados, no autoguarda y revierte la marca dirty al restaurar valores', () => {
    const calls = setup(); open(); loaded()
    cy.get(roster).contains('button', 'Guardar asistencia').should('be.disabled')
    unloadCancelled(false)
    edit(); cy.get(roster).should('contain', 'Cambios sin guardar.')
    cy.get(marking).select('PRESENT'); cy.get(observation).clear().type('Guardada')
    cy.get(roster).should('contain', 'Sin cambios pendientes.')
    cy.then(() => expect(calls.saves).to.eq(0))
  })

  it('cancela la navegación local y conserva sesión, estado y observación', () => {
    setup(); open(); loaded(); edit()
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    open(11)
    cy.get(roster).should('contain', 'Registro del 2026-11-01')
    cy.get(marking).should('have.value', 'ABSENT'); cy.get(observation).should('have.value', 'Pendiente local')
    cy.then(() => expect(confirm).to.have.been.calledOnce)
  })

  it('permite descarte explícito y no avisa al abrir la misma sesión o un borrador limpio', () => {
    setup(); open(); loaded()
    const confirm = cy.stub().returns(true); cy.on('window:confirm', confirm)
    open(); cy.then(() => expect(confirm).not.to.have.been.called)
    edit(); open(11); loaded(11)
    cy.get(observation).should('have.value', 'Otra sesión')
    open(); loaded(); cy.get(observation).should('have.value', 'Guardada')
    cy.then(() => expect(confirm).to.have.been.calledOnce)
  })

  it('confirma antes de crear otra fecha y cancelar no crea sesiones ni guarda', () => {
    const calls = setup(); open(); loaded(); edit()
    cy.contains('button', 'Nueva asistencia').click()
    cy.get('[name="date"]').type('2026-11-03')
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    cy.contains('button', 'Crear sesión').click()
    cy.then(() => { expect(calls.creates).to.eq(0); expect(calls.saves).to.eq(0); confirm.returns(true) })
    cy.get(observation).should('have.value', 'Pendiente local')
    cy.contains('button', 'Crear sesión').click(); cy.wait('@createDraftSession'); loaded(12)
    cy.then(() => { expect(calls.creates).to.eq(1); expect(calls.saves).to.eq(0) })
  })

  it('conserva el aviso de paginación y no mezcla borradores entre páginas', () => {
    setup(); open(); loaded(); edit()
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    cy.get(roster).contains('button', 'Siguiente').click()
    cy.get(observation).should('have.value', 'Pendiente local')
    cy.then(() => confirm.returns(true))
    cy.get(roster).contains('button', 'Siguiente').click(); cy.wait('@draftRoster10_2')
    cy.get(roster).should('contain', 'Otra página').and('not.contain', 'Estudiante de prueba')
  })

  it('guarda la instantánea correcta y bloquea edición y operaciones hasta completar la recarga', () => {
    const calls = setup({ postDelay: 800, refreshDelay: 800 }); open(); loaded(); edit(); save()
    cy.get(marking).should('be.disabled'); cy.get(observation).should('be.disabled')
    cy.contains('button', 'Nueva asistencia').should('be.disabled')
    cy.get(roster).contains('button', 'Siguiente').should('be.disabled')
    cy.get(roster).contains('button', 'Cerrar asistencia').should('be.disabled')
    cy.wait('@saveDraft').then(call => expect(call.request.body).to.deep.eq({ records: [{ student_id: 1, status: 'ABSENT', observations: 'Pendiente local' }] }))
    cy.get(marking).should('be.disabled')
    cy.wait('@draftRefresh')
    cy.get(roster).should('contain', 'Asistencia guardada.').and('contain', 'Sin cambios pendientes.')
    cy.get(observation).should('be.enabled').and('have.value', 'Pendiente local')
    cy.then(() => expect(calls.saves).to.eq(1))
    unloadCancelled(false)
  })

  for (const status of [403, 422, 500]) {
    it('conserva el borrador y libera controles tras POST ' + status, () => {
      setup({ postError: status }); open(); loaded(); edit(); save(); cy.wait('@saveDraft')
      cy.get(roster).should('contain', 'Registro rechazado por el servidor').and('contain', 'Cambios sin guardar.').and('not.contain', 'Asistencia guardada.')
      cy.get(observation).should('be.enabled').and('have.value', 'Pendiente local')
      cy.get(marking).should('have.value', 'ABSENT')
    })
  }

  it('distingue POST confirmado de GET fallido y reintenta lectura sin otro guardado', () => {
    const calls = setup({ refreshError: true }); open(); loaded(); edit(); save(); cy.wait('@saveDraft'); cy.wait('@draftRefresh')
    cy.get(roster).should('contain', 'Asistencia guardada.').and('contain', 'No se pudo actualizar el registro')
    cy.get(observation).should('be.disabled').and('have.value', 'Pendiente local')
    cy.get(roster).contains('button', 'Reintentar consulta de asistencia').click(); cy.wait('@draftRefresh')
    cy.get(observation).should('be.enabled').and('have.value', 'Pendiente local')
    cy.get(roster).should('not.contain', 'No se pudo actualizar')
    cy.then(() => expect(calls.saves).to.eq(1))
  })

  it('ignora la respuesta del roster anterior al cambiar externamente de curso durante su carga', () => {
    setup({ late: true }); open()
    cy.get(roster).should('contain', 'Cargando estudiantes')
    cy.contains('[data-testid="course-card"]', 'Curso 8').contains('button', 'Entrar al curso').click(); cy.wait('@draftSessions')
    open(20); loaded(20)
    cy.wait('@draftRoster10_1')
    cy.get(observation).should('have.value', 'Curso nuevo')
  })

  it('cierra solo tras confirmación y vuelve a mostrar los datos realmente guardados', () => {
    const calls = setup(); open(); loaded(); edit()
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    cy.get(roster).contains('button', 'Cerrar asistencia').click()
    cy.then(() => { expect(calls.closes).to.eq(0); confirm.returns(true) })
    cy.get(observation).should('have.value', 'Pendiente local')
    cy.get(roster).contains('button', 'Cerrar asistencia').click(); cy.wait('@closeDraftSession'); cy.wait('@draftRefresh')
    cy.get(observation).should('be.disabled').and('have.value', 'Guardada')
    cy.get(roster).contains('button', 'Guardar asistencia').should('not.exist')
    unloadCancelled(false)
  })

  for (const options of [{ readonly: true }, { closed: true }]) {
    it('respeta lectura sin edición en ' + (options.readonly ? 'permisos mínimos' : 'sesión cerrada'), () => {
      setup(options); open(); loaded()
      cy.get(marking).should('not.exist')
      cy.get(roster).contains('button', 'Guardar asistencia').should('not.exist')
      cy.get(roster).contains('button', 'Cerrar asistencia').should('not.exist')
    })
  }

  it('solicita aviso de recarga solo para cambios pendientes y elimina el listener al desmontar', () => {
    setup(); open(); loaded(); unloadCancelled(false)
    edit(); unloadCancelled(true)
    cy.on('window:confirm', () => true); open(11); loaded(11); unloadCancelled(false)
  })

  it('permite guardar con Enter nativo y mantiene la vista móvil sin desbordamiento', () => {
    setup(); cy.viewport(390, 844); open(); loaded(); edit()
    cy.get(roster).contains('button', 'Guardar asistencia de esta página').focus().should('have.focus')
    cy.window().then(win => win.focus())
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    cy.wait('@saveDraft'); cy.wait('@draftRefresh')
    cy.get(roster).should('contain', 'Asistencia guardada.')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })
})
