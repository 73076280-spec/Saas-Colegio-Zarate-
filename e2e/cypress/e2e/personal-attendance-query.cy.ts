import type { User } from '../../../frontend/src/auth/types'

const rows = '[data-testid="personal-attendance"]'
const paginate = (data: unknown[], current = 1, last = 2) => ({ data, current_page: current, last_page: last })
type Reply = { body?: unknown; statusCode?: number; delay?: number }
function setup(options: { family?: boolean; role?: User['roles'][number]; permission?: boolean; links?: (page: number, attempt: number) => Reply | undefined; attendance?: (id: number, page: number, attempt: number) => Reply | undefined; postError?: boolean; postDelay?: number; afterPostError?: boolean } = {}) {
  const user: User = { id: 1, institution_id: 1, first_name: 'Cuenta', last_name: 'Prueba', name: 'Alumno 10', email: 'personal@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: [options.role ?? (options.family ? 'GUARDIAN' : 'STUDENT')], permissions: options.permission === false ? [] : ['attendance.view', 'profile.view', 'justifications.view', 'justifications.create'], institution: { id: 1, name: 'Prueba', code: 'TEST' } }
  const calls = { writes: 0, attendance: [] as string[], links: [] as string[] }
  const attempts: Record<string, number> = {}
  let refreshes = 0
  cy.intercept('/api/v1/**', req => {
    const url = new URL(req.url), path = url.pathname
    if (req.method !== 'GET') {
      calls.writes++; req.alias = 'personalWrite'
      return req.reply(options.postError ? { delay: options.postDelay ?? 0, statusCode: 422, body: { message: 'Justificación rechazada' } } : { delay: options.postDelay ?? 0, statusCode: 201, body: { data: {} } })
    }
    const key = path + url.search
    attempts[key] = (attempts[key] ?? 0) + 1
    const current = Number(url.searchParams.get('page') ?? '1')
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    if (path === '/api/v1/profile/family') {
      calls.links.push(url.search); req.alias = 'familyLinks' + current
      return req.reply(options.links?.(current, attempts[key]) ?? { body: paginate((current === 1 ? [10, 11] : [12]).map(id => ({ guardian_id: 7, student_id: id, student: { name: 'Alumno ' + id } })), current) })
    }
    const match = path.match(/^\/api\/v1\/guardians\/7\/students\/(\d+)\/attendance$/)
    if (match || path === '/api/v1/my/attendance') {
      const id = match ? Number(match[1]) : 10
      calls.attendance.push(path + url.search)
      req.alias = calls.writes ? 'personalRefresh' : 'personalAttendance' + id + '_' + current
      if (calls.writes && options.afterPostError && ++refreshes === 1) return req.reply({ statusCode: 500, body: { message: 'Fallo posterior de consulta' } })
      return req.reply(options.attendance?.(id, current, attempts[key]) ?? { body: paginate([{ id: id * 10, student_id: id, student: 'Alumno ' + id, date: '2026-11-01', course: 'Curso autorizado', status: 'ABSENT', observations: 'Observación ' + id + '/' + current, can_justify: !!options.family && !calls.writes, justification: null }, { id: id * 10 + 1, student_id: id, student: 'Alumno ' + id, date: '2026-10-31', course: 'Curso autorizado', status: 'JUSTIFIED', observations: '', can_justify: false, justification: { id: 91, status: 'APPROVED' } }], current) })
    }
    if (path === '/api/v1/absence-justifications/91') return req.reply({ data: { id: 91, student: 'Alumno 10', date: '2026-10-31', course: 'Curso autorizado', reason: 'Sustento autorizado', status: 'APPROVED', abilities: {} } })
    if (path === '/api/v1/absence-justifications/91/history') return req.reply(paginate([], 1, 1))
    return req.reply({ statusCode: 403, body: { message: 'Sin acceso' } })
  })
  cy.visit(options.family ? '/app/family-attendance' : '/app/my-attendance')
  return calls
}
function ready(id = 10) { cy.get(rows).should('contain', 'Observación ' + id + '/1') }
function select(id: number) { cy.contains('label', /^Estudiante/).find('select').select(String(id)) }
function next() { cy.get('[aria-label="Páginas de asistencia"]').contains('button', 'Siguiente').click() }

describe('BOLT-MIS-005 M-03: asistencia personal y familiar (API simulada)', () => {
  it('muestra consulta propia y contexto sin añadir estadísticas ni controles administrativos', () => {
    const calls = setup(); ready()
    cy.get('[aria-label="Contexto de consulta de asistencia"]').should('contain', 'Alumno 10').and('contain', 'Página 1')
    cy.contains('button', /^Justificar$/).should('not.exist')
    cy.get('input[type="date"]').should('not.exist')
    cy.then(() => { expect(calls.attendance.every(path => path.startsWith('/api/v1/my/attendance?'))).to.eq(true); expect(calls.links).to.have.length(0) })
  })

  it('mantiene carga de asistencia aunque los vínculos ya terminaron', () => {
    setup({ family: true, attendance: () => ({ delay: 900, body: paginate([], 1, 1) }) })
    cy.get('[aria-label="Contexto de consulta de asistencia"]').should('contain', 'Alumno 10')
    cy.contains('Cargando asistencia… Página 1.').should('be.visible')
    cy.contains('Cargando estudiantes vinculados').should('not.exist')
    cy.contains('No hay registros de asistencia.').should('be.visible')
  })

  it('retira datos anteriores al elegir estudiante y reinicia página', () => {
    setup({ family: true }); ready(); next(); cy.wait('@personalAttendance10_2')
    select(11); cy.wait('@personalAttendance11_1')
    cy.get(rows).should('contain', 'Observación 11/1').and('not.contain', 'Observación 10/2')
    cy.get('[aria-label="Contexto de consulta de asistencia"]').should('contain', 'Alumno 11').and('contain', 'Página 1')
  })

  it('recupera GET 500 de la misma página/estudiante sin repetir escrituras', () => {
    const calls = setup({ family: true, attendance: (_id, current, attempt) => current === 2 && attempt === 1 ? { statusCode: 500, body: { message: 'Error temporal' } } : undefined })
    ready(); next(); cy.wait('@personalAttendance10_2')
    cy.get(rows).should('not.exist'); cy.contains('Error temporal').should('be.visible')
    cy.contains('button', 'Reintentar consulta de asistencia').click()
    cy.wait('@personalAttendance10_2').its('request.url').should('include', '/guardians/7/students/10/attendance?page=2')
    cy.get(rows).should('contain', 'Observación 10/2'); cy.contains('Error temporal').should('not.exist')
    cy.then(() => expect(calls.writes).to.eq(0))
  })

  it('recupera la página fallida de vínculos sin mostrar asistencia anterior', () => {
    const calls = setup({ family: true, links: (current, attempt) => current === 2 && attempt === 1 ? { statusCode: 500, body: { message: 'Vínculos no disponibles' } } : undefined })
    ready(); cy.get('[aria-label="Páginas de estudiantes vinculados"]').contains('button', 'Siguiente').click()
    cy.contains('Vínculos no disponibles').should('be.visible'); cy.get(rows).should('not.exist')
    cy.contains('button', 'Reintentar consulta de estudiantes').click(); cy.wait('@familyLinks2')
    ready(12); cy.get('[aria-label="Contexto de consulta de asistencia"]').should('contain', 'Alumno 12')
    cy.then(() => { expect(calls.links.at(-1)).to.eq('?page=2'); expect(calls.writes).to.eq(0) })
  })

  it('distingue vínculos vacíos de error y no consulta IDs inventados', () => {
    const calls = setup({ family: true, links: () => ({ body: paginate([], 1, 1) }) })
    cy.contains('No tienes estudiantes vinculados.').should('be.visible')
    cy.contains('Cargando asistencia').should('not.exist'); cy.get(rows).should('not.exist')
    cy.then(() => expect(calls.attendance).to.have.length(0))
  })

  it('muestra vacío personal conservando identidad y sin inventar porcentajes', () => {
    setup({ attendance: () => ({ body: paginate([], 1, 1) }) })
    cy.contains('No hay registros de asistencia.').should('be.visible')
    cy.get('[aria-label="Contexto de consulta de asistencia"]').should('contain', 'Alumno 10')
    cy.get(rows).should('not.exist')
  })

  it('ignora la respuesta tardía de otro estudiante', () => {
    let started = false
    setup({ family: true, attendance: id => {
      if (id === 10) { started = true; return { delay: 1500, body: paginate([{ id: 100, student: 'Dato anterior tardío', can_justify: false }]) } }
    } })
    cy.wrap(null).should(() => expect(started).to.eq(true)); select(11); ready(11)
    cy.wait('@personalAttendance10_1')
    cy.get(rows).should('contain', 'Observación 11/1').and('not.contain', 'Dato anterior tardío')
  })

  it('volver rápidamente al estudiante anterior inicia una consulta nueva sin reutilizar su caché visual', () => {
    let started = false
    setup({ family: true, attendance: (id, _page, attempt) => {
      if (id === 11) { started = true; return { delay: 1400, body: paginate([]) } }
      if (id === 10 && attempt > 1) return { delay: 650, body: paginate([{ id: 100, student_id: 10, student: 'Alumno 10', status: 'PRESENT', observations: 'Registro actualizado de 10', can_justify: false }]) }
    } })
    ready(); select(11); cy.wrap(null).should(() => expect(started).to.eq(true)); select(10)
    cy.contains('Cargando asistencia… Página 1.').should('be.visible'); cy.get(rows).should('not.exist')
    cy.get(rows).should('contain', 'Registro actualizado de 10')
    cy.wait('@personalAttendance11_1'); cy.get(rows).should('contain', 'Registro actualizado de 10')
  })

  for (const status of [403, 404]) {
    it('retira registros y acciones anteriores al recibir ' + status, () => {
      setup({ family: true, attendance: (_id, current) => current === 2 ? { statusCode: status, body: { message: 'Consulta denegada' } } : undefined })
      ready(); next(); cy.contains('Consulta denegada').should('be.visible')
      cy.get(rows).should('not.exist'); cy.contains('button', /^Justificar$/).should('not.exist')
      cy.contains('No hay registros de asistencia.').should('not.exist')
    })
  }

  it('no consulta para un rol ajeno ni usa un ID del navegador para ampliar acceso', () => {
    const calls = setup({ family: true, role: 'TEACHER' })
    cy.contains('No tienes acceso a esta sección.').should('be.visible')
    cy.then(() => { expect(calls.links).to.have.length(0); expect(calls.attendance).to.have.length(0) })
  })

  it('respeta la ruta sin permiso attendance.view', () => {
    const calls = setup({ permission: false })
    cy.contains('No tienes permiso para acceder a esta sección.').should('be.visible')
    cy.then(() => expect(calls.attendance).to.have.length(0))
  })

  it('cancelar cambio de estudiante/página conserva motivo; confirmar descarta el contexto', () => {
    setup({ family: true }); ready(); cy.contains('button', /^Justificar$/).click()
    cy.get('[name="reason"]').type('Motivo pendiente')
    const confirm = cy.stub().returns(false); cy.on('window:confirm', confirm)
    select(11); cy.get('[name="reason"]').should('have.value', 'Motivo pendiente')
    cy.get('[aria-label="Contexto de consulta de asistencia"]').should('contain', 'Alumno 10')
    next(); cy.get('[name="reason"]').should('have.value', 'Motivo pendiente')
    cy.then(() => confirm.returns(true)); select(11); ready(11)
    cy.get('[data-testid="justification-form"]').should('not.exist')
  })

  it('retira detalle de M-02 al paginar asistencia sin modificar sus acciones', () => {
    setup({ family: true }); ready(); cy.contains('button', 'Ver justificación').click()
    cy.get('[data-testid="justification-detail"]').should('contain', 'Sustento autorizado')
    next(); cy.wait('@personalAttendance10_2')
    cy.get('[data-testid="justification-detail"]').should('not.exist')
  })

  it('conserva motivo ante POST rechazado y bloquea cambio de contexto durante el envío', () => {
    const calls = setup({ family: true, postError: true, postDelay: 700 }); ready(); cy.contains('button', /^Justificar$/).click()
    cy.get('[name="reason"]').type('Motivo conservado'); cy.contains('button', 'Enviar justificación').click()
    cy.contains('label', /^Estudiante/).find('select').should('be.disabled')
    cy.get('[aria-label="Páginas de asistencia"]').contains('button', 'Siguiente').should('be.disabled')
    cy.wait('@personalWrite')
    cy.contains('Justificación rechazada').should('be.visible'); cy.get('[name="reason"]').should('have.value', 'Motivo conservado')
    cy.then(() => expect(calls.writes).to.eq(1))
  })

  it('un GET fallido después del envío no repite la justificación al reintentar', () => {
    const calls = setup({ family: true, afterPostError: true }); ready(); cy.contains('button', /^Justificar$/).click()
    cy.get('[name="reason"]').type('Motivo enviado'); cy.contains('button', 'Enviar justificación').click(); cy.wait('@personalWrite')
    cy.contains('Justificación enviada.').should('be.visible'); cy.contains('Fallo posterior de consulta').should('be.visible')
    cy.contains('button', 'Reintentar consulta de asistencia').click(); cy.wait('@personalRefresh')
    cy.get(rows).should('be.visible'); cy.then(() => expect(calls.writes).to.eq(1))
  })

  it('recupera con Enter nativo y mantiene nombres accesibles y presentación móvil', () => {
    let failed = true
    setup({ family: true, attendance: () => failed ? { statusCode: 500, body: { message: 'Fallo de lectura' } } : undefined })
    cy.viewport(390, 844)
    cy.contains('button', 'Reintentar consulta de asistencia').focus().should('have.focus')
    cy.window().then(win => win.focus()); cy.then(() => { failed = false })
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
    ready(); cy.contains('label', /^Estudiante/).find('select').should('be.visible')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })
})
