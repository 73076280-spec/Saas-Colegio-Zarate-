import type { User } from '../../../frontend/src/auth/types'

const now = Date.parse('2026-10-28T15:00:00Z')
const responseText = 'Respuesta que debe conservarse'
function openTask(options: { due?: string; late?: boolean; allowed?: boolean; returned?: boolean; reject?: boolean } = {}) {
  cy.clock(now, ['Date', 'setInterval', 'clearInterval'])
  const user: User = { id: 1, institution_id: 1, first_name: 'Estudiante', last_name: 'Prueba', name: 'Estudiante Prueba', email: 'deadline@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: ['STUDENT'], permissions: ['assignments.view', 'submissions.view'], institution: { id: 1, name: 'Institución de prueba', code: 'TEST' } }
  const task = { id: 7, title: 'Tarea de plazo', status: 'PUBLISHED', course: { id: 1, name: 'Curso de prueba' }, due_at: options.due ?? new Date(now + 60000).toISOString(), allow_late_submission: options.late ?? false, abilities: { submit: options.allowed ?? true } }
  const attempts = options.returned ? [{ id: 10, status: 'RETURNED', attempt: 1, feedback: 'Completar la explicación', content: 'Primera respuesta', course: task.course, assignment: { id: 7, title: task.title }, abilities: {} }] : []
  const page = () => ({ data: attempts, meta: { current_page: 1, last_page: 1, total: attempts.length } })
  cy.intercept('GET', '/api/v1/auth/me', { data: user })
  cy.intercept('GET', '/api/v1/my/assignments*', { data: [task], meta: { current_page: 1, last_page: 1, total: 1 } })
  cy.intercept('GET', '/api/v1/assignments/7/submissions*', req => req.reply(page()))
  let posts = 0
  cy.intercept('POST', '/api/v1/assignments/7/submissions', req => {
    posts++
    if (options.reject) return req.reply({ statusCode: 422, body: { message: 'No se pudo enviar.', errors: { due_at: ['La fecha límite venció y no se permiten entregas tardías.'] } } })
    const attempt = { id: 11, status: options.late ? 'LATE' : 'SUBMITTED', attempt: options.returned ? 2 : 1, feedback: '', content: responseText, course: task.course, assignment: { id: 7, title: task.title }, abilities: {} }
    attempts.unshift(attempt)
    req.reply({ statusCode: 201, body: { data: attempt } })
  }).as('sendDeadline')
  cy.visit('/app/my-assignments')
  cy.contains('button', 'Ver entregas').click()
  cy.get('[data-testid="learning-submissions"]').should('be.visible')
  cy.get('[data-testid="submission-deadline"]').should('contain', 'Fecha límite (hora local)')
  return () => posts
}
function fill() {
  cy.contains('button', 'Entregar tarea').click()
  cy.get('[data-testid="submission-form"] textarea[name="content"]').type(responseText)
}

describe('M-02: orientación de plazos (reloj y API controlados)', () => {
  it('permite una entrega vigente y muestra su resultado', () => {
    openTask()
    cy.get('[data-testid="submission-deadline"]').should('contain', 'Plazo vigente')
    fill()
    cy.contains('button', 'Enviar entrega').click()
    cy.wait('@sendDeadline').its('response.statusCode').should('eq', 201)
    cy.get('[data-testid="learning-submissions"]').should('contain', 'Entregada').and('contain', responseText)
  })

  it('impide iniciar una entrega vencida sin tardanza', () => {
    const posts = openTask({ due: new Date(now - 1).toISOString() })
    cy.get('[data-testid="submission-deadline"]').should('contain', 'Plazo vencido. No se permiten entregas tardías.')
    cy.contains('button', 'Entregar tarea').should('not.exist')
    cy.then(() => expect(posts()).to.eq(0))
  })

  it('mantiene entrega tardía cuando la capacidad lo permite', () => {
    openTask({ due: new Date(now - 1000).toISOString(), late: true })
    cy.get('[data-testid="submission-deadline"]').should('contain', 'Admite entregas tardías')
    fill()
    cy.contains('button', 'Enviar entrega').click()
    cy.wait('@sendDeadline').its('response.body.data.status').should('eq', 'LATE')
    cy.get('[data-testid="learning-submissions"]').should('contain', 'Tardía')
  })

  it('respeta el instante exacto y actualiza una vista abierta después del límite', () => {
    openTask({ due: new Date(now + 1000).toISOString() })
    cy.tick(1000)
    cy.contains('button', 'Entregar tarea').should('exist')
    cy.get('[data-testid="submission-deadline"]').should('contain', 'Plazo vigente')
    cy.tick(1000)
    cy.contains('button', 'Entregar tarea').should('not.exist')
    cy.get('[data-testid="submission-deadline"]').should('contain', 'Plazo vencido')
  })

  it('al vencer con formulario abierto conserva texto e impide enviar', () => {
    const posts = openTask({ due: new Date(now + 1000).toISOString() })
    fill()
    cy.tick(2000)
    cy.contains('button', 'Enviar entrega').should('be.disabled')
    cy.get('textarea[name="content"]').should('have.value', responseText)
    cy.get('[data-testid="submission-form"]').should('contain', 'Conservamos tu respuesta')
    // Incluso un submit directo vuelve a comprobar el plazo, sin depender del botón.
    cy.get('[data-testid="submission-form"]').trigger('submit')
    cy.get('[role="alert"]').should('contain', 'Conservamos tu respuesta')
    cy.then(() => expect(posts()).to.eq(0))
  })

  it('permite reintento devuelto vigente y conserva intento previo y feedback', () => {
    openTask({ returned: true })
    cy.get('[data-testid="learning-submissions"]').should('contain', 'Intento 1').and('contain', 'Completar la explicación')
    fill()
    cy.contains('button', 'Enviar entrega').click()
    cy.wait('@sendDeadline')
    cy.get('[data-testid="learning-submissions"]').should('contain', 'Intento 2').and('contain', 'Intento 1').and('contain', 'Primera respuesta').and('contain', 'Completar la explicación')
  })

  it('una devolución vencida conserva historial y no habilita intento nuevo', () => {
    openTask({ returned: true, due: new Date(now - 1).toISOString() })
    cy.contains('button', 'Entregar tarea').should('not.exist')
    cy.get('[data-testid="learning-submissions"]').should('contain', 'Intento 1').and('contain', 'Completar la explicación')
  })

  it('un rechazo definitivo del servidor muestra motivo y conserva texto y archivo', () => {
    openTask({ reject: true })
    fill()
    cy.get('input[name="file"]').selectFile({ contents: Cypress.Buffer.from('Contenido de prueba'), fileName: 'respuesta.txt', mimeType: 'text/plain' })
    cy.contains('button', 'Enviar entrega').click()
    cy.wait('@sendDeadline').its('response.statusCode').should('eq', 422)
    cy.get('[role="alert"]').should('contain', 'La fecha límite venció')
    cy.get('textarea[name="content"]').should('have.value', responseText)
    cy.get('input[name="file"]').then(input => expect((input[0] as HTMLInputElement).files?.[0]?.name).to.eq('respuesta.txt'))
    cy.contains('Registro guardado.').should('not.exist')
  })

  it('tardanza permitida no reemplaza una capacidad submit denegada', () => {
    openTask({ allowed: false, late: true, due: new Date(now - 1).toISOString() })
    cy.contains('button', 'Entregar tarea').should('not.exist')
    cy.get('[data-testid="submission-form"]').should('not.exist')
  })

  it('compara el instante ISO con offset sin tratarlo como hora local distinta', () => {
    openTask({ due: '2026-10-28T10:00:00-05:00' })
    cy.get('[data-testid="submission-deadline"]').should('contain', 'Plazo vigente')
    cy.tick(1000)
    cy.get('[data-testid="submission-deadline"]').should('contain', 'Plazo vencido')
  })
})
