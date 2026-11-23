// Evidencia reproducible de cierre. API simulada; no cambia datos ni componentes.
const panel = '[aria-label="Historial de cambios de la nota"]'
const user = { id: 1, institution_id: 1, first_name: 'Estudiante', last_name: 'Prueba', name: 'Estudiante Prueba', email: 'keyboard@example.test', status: 'ACTIVE', must_change_password: false, roles: ['STUDENT'], permissions: ['scores.view'], institution: { id: 1, name: 'Prueba', code: 'TEST' } }
const observations = []
afterEach(() => cy.writeFile('../docs/ai-dlc/misional/BOLT-MIS-004/verificacion-teclado-eventos.json', observations))

for (const method of ['Cypress.press', 'CDP']) {
  describe('Cierre BOLT-MIS-004: Enter mediante ' + method, () => {
    it('activa Reintentar historial con foco real, conserva nota/página y recupera datos', () => {
      let attempts = 0
      const events = []
      const observation = { method, events, requests: [] }
      observations.push(observation)
      const page = (data, current = 1) => ({ data, current_page: current, last_page: 2 })
      const change = { id: 1, old_score: '10.00', new_score: '12.00', reason: 'Corrección simulada', changed_by: 8, created_at: '2026-11-01T15:00:00Z' }
      cy.intercept('/api/v1/**', req => {
        const url = new URL(req.url)
        observation.requests.push(req.method + ' ' + url.pathname + url.search)
        if (req.method !== 'GET') throw new Error('La comprobación no permite escrituras')
        if (url.pathname === '/api/v1/auth/me') return req.reply({ data: user })
        if (url.pathname === '/api/v1/my/scores') {
          req.alias = 'keyboardScores'
          return req.reply(page([{ id: 12, score: '12.00', student: { id: 1, name: user.name }, course: { id: 7, name: 'Matemática' }, assessment: { id: 21, title: 'Prueba de teclado' }, abilities: {} }]))
        }
        if (url.pathname === '/api/v1/scores/12/history') {
          const current = Number(url.searchParams.get('page'))
          if (current === 1) { req.alias = 'keyboardFirst'; return req.reply(page([change])) }
          attempts++
          req.alias = attempts === 1 ? 'keyboardFailure' : 'keyboardRetry'
          return req.reply(attempts === 1 ? { statusCode: 500, body: { message: 'Fallo simulado' } } : { body: page([change], 2) })
        }
        return req.reply({ statusCode: 403, body: { message: 'No autorizado' } })
      })
      cy.visit('/app/my-scores')
      cy.wait('@keyboardScores')
      cy.get('[data-testid="score-row"]').contains('button', 'Historial').click()
      cy.wait('@keyboardFirst')
      cy.get(panel).contains('button', 'Siguiente').click()
      cy.wait('@keyboardFailure')
      cy.get(panel).should('contain', 'Fallo simulado')
      // Un clic sobre el título enfoca el documento del AUT, nunca activa Reintentar.
      cy.get(panel).find('h3').click()
      cy.window().then(win => {
        win.focus()
        for (const type of ['keydown', 'keypress', 'keyup', 'click']) {
          win.document.addEventListener(type, event => {
            events.push({ type, key: event.key ?? null, trusted: event.isTrusted, prevented: event.defaultPrevented, target: event.target.textContent, focused: win.document.hasFocus() })
          })
        }
      })
      cy.get(panel).contains('button', 'Reintentar historial').focus().should('have.focus').and('have.attr', 'type', 'button')
      cy.document().should(doc => {
        observation.focusBeforeKey = { document: doc.hasFocus(), target: doc.activeElement.textContent }
        expect(doc.hasFocus(), 'documento AUT con foco real').to.eq(true)
      })
      if (method === 'Cypress.press') {
        cy.press(Cypress.Keyboard.Keys.ENTER)
      } else {
        cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
        cy.then(() => Cypress.automation('remote:debugger:protocol', { command: 'Input.dispatchKeyEvent', params: { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 } }))
      }
      cy.wait('@keyboardRetry').then(call => {
        expect(call.request.method).to.eq('GET')
        expect(new URL(call.request.url).pathname).to.eq('/api/v1/scores/12/history')
        expect(new URL(call.request.url).searchParams.get('page')).to.eq('2')
      })
      cy.get(panel).should('contain', 'Corrección simulada').and('contain', 'Página 2 de 2').and('not.contain', 'Fallo simulado')
      cy.then(() => {
        expect(attempts, 'fallo y un reintento').to.eq(2)
        expect(events.some(e => e.type === 'keydown' && e.key === 'Enter' && e.trusted && e.focused)).to.eq(true)
        expect(events.some(e => e.type === 'click' && e.target === 'Reintentar historial' && e.trusted)).to.eq(true)
        Cypress.log({ name: 'eventos nativos', message: JSON.stringify(events) })
      })
    })
  })
}
