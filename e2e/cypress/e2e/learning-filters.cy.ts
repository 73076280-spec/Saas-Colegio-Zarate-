import type { User } from '../../../frontend/src/auth/types'

const course = { id: 7, name: 'Curso de filtros', status: 'ACTIVE', teacher: { name: 'Docente' }, subject: { name: 'Matemática' }, academic_year: { name: '2026' }, grade_level: { name: 'Primero', level: 'Secundaria' }, section: { name: 'A' } }
const task = (status = 'PUBLISHED', submit = false) => ({ id: 7, title: 'Actividad ' + status, status, course, abilities: { submit } })
const page = (data: unknown[], current = 1, last = 1) => ({ data, meta: { current_page: current, last_page: last, total: data.length } })
function setup(options: { student?: boolean; mixed?: boolean; empty?: boolean; fail?: boolean; review?: boolean; race?: boolean } = {}) {
  const requests: URL[] = []
  let slowStarted = false
  let failed = false
  const user: User = { id: 1, institution_id: 1, first_name: 'Cuenta', last_name: 'Filtros', name: 'Cuenta Filtros', email: 'filters@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: options.mixed ? ['STUDENT', 'TEACHER'] : [options.student ? 'STUDENT' : 'TEACHER'], permissions: ['assignments.view', 'assessments.view', 'submissions.view'], institution: { id: 1, name: 'Institución de prueba', code: 'TEST' } }
  cy.intercept('GET', '/api/v1/**', req => {
    const url = new URL(req.url), path = url.pathname
    requests.push(url)
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    if (path === '/api/v1/courses/7') return req.reply({ data: course })
    if (path === '/api/v1/courses/7/students') return req.reply(page([]))
    if (path === '/api/v1/my/submissions') return req.reply(page([]))
    if (/\/courses\/7\/(assignments|assessments)$/.test(path)) {
      const status = url.searchParams.get('status') || 'PUBLISHED'
      const current = Number(url.searchParams.get('page') || 1)
      req.alias = 'activities_' + (url.searchParams.get('status') || 'all') + '_' + current
      if (options.fail && status === 'DRAFT' && !failed) { failed = true; return req.reply({ statusCode: 500, body: { message: 'Consulta temporalmente no disponible' } }) }
      if (options.race && status === 'DRAFT') { slowStarted = true; req.alias = 'slowActivities'; return req.reply({ delay: 2500, body: page([task('DRAFT')]) }) }
      if (options.race && status === 'PUBLISHED' && url.searchParams.has('status')) req.alias = 'fastActivities'
      return req.reply(page(options.empty && status === 'CLOSED' ? [] : [task(status, options.mixed)], current, 2))
    }
    if (path === '/api/v1/assignments/7/submissions') {
      req.alias = 'deliveries_' + (url.searchParams.get('status') || 'all') + '_' + (url.searchParams.get('page') || '1')
      const status = url.searchParams.get('status') || 'SUBMITTED'
      return req.reply(page([{ id: 20, status, content: 'Respuesta ' + status, attempt: 1, course, assignment: { id: 7, title: 'Actividad' }, abilities: { review: options.review ?? !options.student } }], Number(url.searchParams.get('page') || 1), 2))
    }
    req.reply({ statusCode: 403, body: { message: 'No autorizado en esta prueba' } })
  })
  return { requests, slowStarted: () => slowStarted }
}
function openActivities(section = 'assignments') {
  cy.visit('/virtual/courses/7/' + section)
  cy.wait('@activities_all_1')
}
function activityFilter(label = 'Estado de tareas') { return cy.contains('label', label).find('select') }
function deliveryFilter() { return cy.contains('label', 'Estado de entregas').find('select') }

describe('M-03: filtros docentes (API simulada, sin escrituras de base de datos)', () => {
  it('envía estados de tareas al servidor y omite status al seleccionar Todos', () => {
    setup(); openActivities()
    for (const status of ['DRAFT', 'PUBLISHED', 'CLOSED']) {
      activityFilter().select(status)
      cy.wait(`@activities_${status}_1`).then(call => {
        const url = new URL(call.request.url)
        expect(url.searchParams.get('status')).to.eq(status)
        expect(url.searchParams.get('page')).to.eq('1')
      })
      cy.contains('h3', 'Actividad ' + status).should('be.visible')
    }
    activityFilter().select('')
    cy.wait('@activities_all_1').then(call => expect(new URL(call.request.url).searchParams.has('status')).to.eq(false))
  })

  it('filtra todos los estados de entregas y respeta estado y capacidad de revisión', () => {
    setup(); openActivities()
    cy.contains('button', 'Ver entregas').click(); cy.wait('@deliveries_all_1')
    for (const status of ['SUBMITTED', 'LATE', 'REVIEWED', 'RETURNED']) {
      deliveryFilter().select(status)
      cy.wait(`@deliveries_${status}_1`).then(call => expect(new URL(call.request.url).searchParams.get('status')).to.eq(status))
      cy.get('[data-testid="learning-submissions"]').should('contain', 'Respuesta ' + status)
      cy.get('[data-testid="learning-submissions"]').within(() => {
        if (['SUBMITTED', 'LATE'].includes(status)) cy.contains('button', 'Revisar entrega').should('exist')
        else cy.contains('button', 'Revisar entrega').should('not.exist')
      })
    }
    deliveryFilter().select('SUBMITTED'); cy.wait('@deliveries_SUBMITTED_1')
    cy.contains('button', 'Revisar entrega').click()
    cy.get('[data-testid="submission-form"]').should('be.visible')
    deliveryFilter().select('LATE'); cy.wait('@deliveries_LATE_1')
    cy.get('[data-testid="submission-form"]').should('not.exist')
  })

  it('reinicia página y cierra detalles anteriores al cambiar el filtro', () => {
    setup(); openActivities()
    cy.contains('button', 'Siguiente').click(); cy.wait('@activities_all_2')
    cy.contains('Página 2 de 2').should('exist')
    cy.contains('button', 'Ver entregas').click(); cy.wait('@deliveries_all_1')
    activityFilter().select('DRAFT')
    cy.wait('@activities_DRAFT_1').then(call => expect(new URL(call.request.url).searchParams.get('page')).to.eq('1'))
    cy.get('[data-testid="learning-submissions"]').should('not.exist')
    cy.contains('button', 'Ver entregas').click(); cy.wait('@deliveries_all_1')
    cy.get('[data-testid="learning-submissions"]').within(() => cy.contains('button', 'Siguiente').click())
    cy.wait('@deliveries_all_2')
    deliveryFilter().select('RETURNED')
    cy.wait('@deliveries_RETURNED_1').then(call => expect(new URL(call.request.url).searchParams.get('page')).to.eq('1'))
    cy.get('[data-testid="learning-submissions"]').should('contain', 'Página 1 de 2')
    cy.get('[data-testid="learning-submissions"]').within(() => cy.contains('button', 'Siguiente').click())
    cy.wait('@deliveries_RETURNED_2').then(call => {
      const url = new URL(call.request.url)
      expect(url.searchParams.get('page')).to.eq('2'); expect(url.searchParams.get('status')).to.eq('RETURNED')
    })
  })

  it('informa resultado vacío y recupera Todos en móvil con selector etiquetado', () => {
    setup({ empty: true }); openActivities()
    cy.viewport(390, 844)
    activityFilter().select('CLOSED'); cy.wait('@activities_CLOSED_1')
    cy.contains('No hay registros con el estado seleccionado.').should('be.visible')
    activityFilter().should('be.visible').select(''); cy.wait('@activities_all_1')
    cy.contains('h3', 'Actividad PUBLISHED').should('be.visible')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })

  it('mantiene carga y recuperación ante error de consulta', () => {
    setup({ fail: true }); openActivities()
    activityFilter().select('DRAFT'); cy.wait('@activities_DRAFT_1').its('response.statusCode').should('eq', 500)
    cy.get('[role="alert"]').should('contain', 'Consulta temporalmente no disponible')
    cy.contains('h3', 'Actividad PUBLISHED').should('not.exist')
    cy.contains('button', 'Volver a intentar').click(); cy.wait('@activities_DRAFT_1')
    cy.contains('h3', 'Actividad DRAFT').should('be.visible')
    cy.get('[role="alert"]').should('not.exist')
  })

  it('una respuesta retrasada no reemplaza la consulta más reciente', () => {
    const state = setup({ race: true }); openActivities()
    activityFilter().select('DRAFT')
    cy.wrap(null).should(() => expect(state.slowStarted()).to.eq(true))
    cy.contains('[role="status"]', 'Cargando registros').should('be.visible')
    cy.contains('h3', 'Actividad PUBLISHED').should('not.exist')
    activityFilter().select('PUBLISHED'); cy.wait('@fastActivities')
    cy.contains('h3', 'Actividad PUBLISHED').should('be.visible')
    cy.wait('@slowActivities')
    cy.contains('h3', 'Actividad PUBLISHED').should('be.visible')
    cy.contains('h3', 'Actividad DRAFT').should('not.exist')
  })

  it('no ofrece revisión cuando el servidor deniega su capacidad', () => {
    setup({ review: false }); openActivities()
    cy.contains('button', 'Ver entregas').click(); cy.wait('@deliveries_all_1')
    deliveryFilter().select('SUBMITTED'); cy.wait('@deliveries_SUBMITTED_1')
    cy.contains('button', 'Revisar entrega').should('not.exist')
  })

  it('no agrega filtros a estudiantes en cursos o entregas personales', () => {
    const state = setup({ student: true }); openActivities()
    cy.contains('label', 'Estado de tareas').should('not.exist')
    cy.contains('button', 'Ver entregas').click(); cy.wait('@deliveries_all_1')
    cy.contains('label', 'Estado de entregas').should('not.exist')
    cy.contains('button', 'Revisar entrega').should('not.exist')
    cy.visit('/app/my-submissions')
    cy.get('[data-testid="learning-submissions"]').should('be.visible')
    cy.contains('label', 'Estado de entregas').should('not.exist')
    cy.then(() => expect(state.requests.some(url => url.searchParams.has('status'))).to.eq(false))
  })

  it('reutiliza los estados de actividad para evaluaciones sin filtrar notas', () => {
    setup(); openActivities('assessments')
    activityFilter('Estado de evaluaciones').select('CLOSED')
    cy.wait('@activities_CLOSED_1').then(call => expect(call.request.url).to.include('/assessments?page=1&status=CLOSED'))
    cy.contains('h3', 'Actividad CLOSED').should('exist')
  })

  it('un perfil mixto con capacidad de entrega no usa una lista filtrada para habilitar intentos', () => {
    setup({ mixed: true }); openActivities()
    cy.contains('button', 'Ver entregas').click(); cy.wait('@deliveries_all_1')
    cy.contains('label', 'Estado de entregas').should('not.exist')
    cy.contains('button', 'Entregar tarea').should('not.exist')
  })
})
