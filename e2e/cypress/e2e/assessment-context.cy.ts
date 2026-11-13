import type { User } from '../../../frontend/src/auth/types'

const course = { id: 7, name: 'Matemática aplicada', status: 'ACTIVE', teacher: { name: 'Docente de prueba' }, subject: { name: 'Matemática' }, academic_year: { name: '2026' }, grade_level: { name: 'Primero', level: 'Secundaria' }, section: { name: 'A' } }
const page = (data: unknown[]) => ({ data, meta: { current_page: 1, last_page: 1, total: data.length } })
function setup(options: { status?: string; open?: boolean; missing?: boolean; empty?: boolean; readonly?: boolean; denied?: boolean } = {}) {
  const canWrite = !options.readonly
  const user: User = { id: 1, institution_id: 1, first_name: 'Cuenta', last_name: 'Evaluación', name: 'Cuenta Evaluación', email: 'evaluation@example.test', phone: null, avatar_path: null, status: 'ACTIVE', must_change_password: false, roles: ['TEACHER'], permissions: ['assessments.view', 'scores.view', ...(canWrite ? ['scores.create', 'scores.update'] : [])], institution: { id: 1, name: 'Institución de prueba', code: 'TEST' } }
  const assessment = { id: 21, title: 'Práctica de fracciones', status: options.status ?? 'PUBLISHED', course, max_score: options.missing ? null : '10.00', evaluation_date: options.missing ? null : '2026-11-02', period: options.missing ? undefined : { id: 3, name: 'Segundo periodo', grading_open: options.open ?? true }, abilities: {} }
  const second = { ...assessment, id: 22, title: 'Práctica de geometría', max_score: '20.00', period: { id: 4, name: 'Tercer periodo', grading_open: true } }
  const makeScore = (id: number, score: string, name: string) => ({ id, score, student: { id: id === 12 ? 1 : 2, name }, course, assessment: { id: 21, title: assessment.title }, period: assessment.period, abilities: { update: canWrite } })
  let scores = options.empty ? [] : [makeScore(12, '7.50', 'Estudiante Uno')]
  const requests: string[] = []
  cy.intercept('GET', '/api/v1/**', req => {
    const path = new URL(req.url).pathname
    requests.push(path)
    if (path === '/api/v1/auth/me') return req.reply({ data: user })
    if (path === '/api/v1/courses/7') return req.reply(options.denied ? { statusCode: 404, body: { message: 'Curso no disponible' } } : { data: course })
    if (path === '/api/v1/courses/7/assessments') { req.alias = 'contextAssessments'; return req.reply({ ...page([assessment, second]), abilities: {} }) }
    if (path === '/api/v1/courses/7/students') return req.reply(page([{ student_id: 1, name: 'Estudiante Uno' }, { student_id: 2, name: 'Estudiante Dos' }]))
    if (path === '/api/v1/assessments/21/scores') { req.alias = 'contextScores'; return req.reply({ ...page(scores), abilities: { create: canWrite } }) }
    return req.reply({ statusCode: 403, body: { message: 'No autorizado en esta prueba' } })
  })
  cy.intercept('POST', '/api/v1/assessments/21/scores', req => {
    const record = makeScore(13, String(req.body.score), 'Estudiante Dos')
    scores = [...scores, record]
    req.reply({ statusCode: 201, body: { data: record } })
  }).as('createContextScore')
  cy.intercept('PATCH', '/api/v1/scores/12', req => {
    scores = [makeScore(12, String(req.body.score), 'Estudiante Uno')]
    req.reply({ data: scores[0] })
  }).as('editContextScore')
  return requests
}
function openAssessments() {
  cy.visit('/virtual/courses/7/assessments')
  cy.wait('@contextAssessments')
}
function openScores() {
  openAssessments()
  cy.contains('[data-testid="learning-card"]', 'Práctica de fracciones').contains('button', 'Ver notas').click()
  cy.wait('@contextScores')
}

describe('BOLT-MIS-004 M-01: contexto de evaluación (API simulada)', () => {
  it('distingue evaluaciones, curso, periodo, fecha y máximo sin nuevas consultas', () => {
    const requests = setup(); openScores()
    cy.contains('[data-testid="learning-card"]', 'Práctica de geometría').should('contain', 'Tercer periodo').and('contain', '20.00')
    cy.get('[data-testid="learning-scores"]').within(() => {
      cy.get('[aria-label="Contexto de evaluación"]').should('contain', 'Matemática aplicada').and('contain', 'Segundo periodo').and('contain', '10.00')
      cy.contains('Práctica de fracciones').should('be.visible')
      cy.get('[aria-label="Contexto de evaluación"]').should('not.contain', 'Tercer periodo')
      cy.get('[aria-label="Contexto de evaluación"]').should('not.contain', 'Fecha no disponible')
    })
    cy.window().then(win => {
      const expected = new win.Date('2026-11-02T00:00:00').toLocaleDateString('es-PE')
      cy.get('[data-testid="learning-scores"] [aria-label="Contexto de evaluación"]').should('contain', expected)
    })
    cy.then(() => expect(requests.some(path => /assessment-types|assessment-periods/.test(path))).to.eq(false))
  })

  it('mantiene contexto y registro habilitado cuando la evaluación no tiene notas', () => {
    setup({ empty: true }); openScores()
    cy.get('[data-testid="learning-scores"]').should('contain', 'No hay registros disponibles.').and('contain', 'Segundo periodo')
    cy.contains('button', 'Registrar nota').should('be.visible')
  })

  it('no inventa escala, periodo o fecha ausentes ni habilitación del periodo', () => {
    setup({ missing: true }); openScores()
    cy.get('[data-testid="learning-scores"]').should('contain', 'Escala no disponible').and('contain', 'Periodo no disponible').and('contain', 'Fecha no disponible')
    cy.contains('No se dispone de la habilitación del periodo.').should('be.visible')
    cy.contains('button', 'Registrar nota').should('not.exist')
  })

  for (const status of ['DRAFT', 'CLOSED']) {
    it('explica ' + status + ' sin permitir registrar ni modificar', () => {
      setup({ status }); openScores()
      cy.get('[data-testid="learning-scores"]').should('contain', status === 'CLOSED' ? 'Evaluación cerrada.' : 'La evaluación aún no está publicada.')
      cy.contains('button', 'Registrar nota').should('not.exist')
      cy.contains('button', 'Modificar nota').should('not.exist')
    })
  }

  it('explica periodo no habilitado usando el dato recibido', () => {
    setup({ open: false }); openScores()
    cy.contains('El periodo no está habilitado para registrar o modificar notas.').should('be.visible')
    cy.contains('button', 'Registrar nota').should('not.exist')
    cy.contains('button', 'Modificar nota').should('not.exist')
  })

  it('conserva el alta y los límites del formulario en móvil', () => {
    setup(); openScores()
    cy.viewport(390, 844)
    cy.contains('button', 'Registrar nota').click()
    cy.get('[data-testid="score-form"]').within(() => {
      cy.contains('Registrar nota · Práctica de fracciones').should('be.visible')
      cy.get('[aria-label="Contexto de evaluación"]').should('contain', 'Segundo periodo').and('contain', '10.00')
      cy.get('select[name="student_id"]').select('2')
      cy.get('input[name="score"]').should('have.attr', 'max', '10').and('have.attr', 'min', '0').and('have.attr', 'step', '0.01').type('8.25')
      cy.get('textarea[name="observations"]').type('Observación de prueba')
      cy.contains('button', 'Guardar nota').click()
    })
    cy.wait('@createContextScore').then(call => expect(call.request.body).to.deep.eq({ student_id: 2, score: 8.25, observations: 'Observación de prueba' }))
    cy.get('[data-testid="score-row"]').should('contain', 'Estudiante Dos').and('contain', '8.25')
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth))
  })

  it('conserva la edición con estudiante identificado y motivo obligatorio', () => {
    setup(); openScores()
    cy.contains('button', 'Modificar nota').click()
    cy.get('[data-testid="score-form"]').within(() => {
      cy.contains('Estudiante Uno').should('be.visible')
      cy.get('input[name="score"]').clear().type('8.75')
      cy.get('textarea[name="reason"]').should('have.attr', 'required')
      cy.get('textarea[name="reason"]').type('Corrección justificada')
      cy.contains('button', 'Guardar nota').click()
    })
    cy.wait('@editContextScore').then(call => expect(call.request.body).to.deep.eq({ score: 8.75, observations: '', reason: 'Corrección justificada' }))
    cy.get('[data-testid="score-row"]').should('contain', '8.75')
  })

  for (const statusCode of [403, 422]) {
    it('muestra rechazo ' + statusCode + ' y conserva la información ingresada', () => {
      setup(); openScores()
      cy.intercept('POST', '/api/v1/assessments/21/scores', { statusCode, body: { message: 'Registro rechazado por el servidor' } }).as('rejectedContextScore')
      cy.contains('button', 'Registrar nota').click()
      cy.get('[data-testid="score-form"]').within(() => {
        cy.get('select[name="student_id"]').select('2')
        cy.get('input[name="score"]').type('8.25')
        cy.get('textarea[name="observations"]').type('Texto a conservar')
        cy.contains('button', 'Guardar nota').click()
      })
      cy.wait('@rejectedContextScore').its('response.statusCode').should('eq', statusCode)
      cy.get('[data-testid="score-form"]').within(() => {
        cy.get('[role="alert"]').should('contain', 'Registro rechazado por el servidor')
        cy.get('select[name="student_id"]').should('have.value', '2')
        cy.get('input[name="score"]').should('have.value', '8.25')
        cy.get('textarea[name="observations"]').should('have.value', 'Texto a conservar')
        cy.get('[aria-label="Contexto de evaluación"]').should('contain', 'Segundo periodo')
      })
      cy.contains('Registro guardado.').should('not.exist')
      cy.intercept('POST', '/api/v1/assessments/21/scores', { statusCode: 201, body: { data: { id: 13 } } }).as('recoveredContextScore')
      cy.get('[data-testid="score-form"]').contains('button', 'Guardar nota').click()
      cy.wait('@recoveredContextScore')
      cy.get('[data-testid="score-form"]').should('not.exist')
      cy.contains('Registro guardado.').should('be.visible')
    })
  }

  it('no revela contexto de evaluación de un curso denegado por el backend', () => {
    const requests = setup({ denied: true })
    cy.visit('/virtual/courses/7/assessments')
    cy.get('[role="alert"]').should('contain', 'Curso no disponible')
    cy.contains('Práctica de fracciones').should('not.exist')
    cy.get('[aria-label="Contexto de evaluación"]').should('not.exist')
    cy.then(() => expect(requests).not.to.include('/api/v1/courses/7/assessments'))
  })

  it('no agrega escritura a una consulta autorizada sin capacidades de notas', () => {
    setup({ readonly: true }); openScores()
    cy.get('[data-testid="learning-scores"]').should('contain', 'Segundo periodo')
    cy.contains('button', 'Registrar nota').should('not.exist')
    cy.contains('button', 'Modificar nota').should('not.exist')
  })
})
