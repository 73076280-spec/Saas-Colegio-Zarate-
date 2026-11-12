import type { Interception } from 'cypress/types/net-stubbing'

type FetchTrace = { number: number; url: string; start: number; aborted?: number; abortStack?: string; errorName?: string; status?: number; redirected?: boolean; body?: unknown; jsonError?: string }
const expected = { status: 'ok', service: 'backend' }

// Test-only observation: preserves native fetch/abort, has no mocked responses.
export function observeHealth() {
  const fetches: FetchTrace[] = [], navigation: string[] = []
  let verified: { id: string; url: string; statusCode: number; body: unknown }[] = []
  cy.on('window:before:load', win => {
    const signals = new WeakMap<AbortSignal, FetchTrace>()
    const errorType = win.Error as ErrorConstructor & { stackTraceLimit?: number }
    errorType.stackTraceLimit = 80
    const abort = win.AbortController.prototype.abort
    win.AbortController.prototype.abort = function (this: AbortController, reason?: unknown) {
      const record = signals.get(this.signal)
      if (record) { record.aborted = Date.now(); record.abortStack = new win.Error().stack || '' }
      abort.call(this, reason)
    }
    for (const event of ['pagehide', 'beforeunload', 'popstate', 'hashchange']) win.addEventListener(event, () => navigation.push(event))
    const nativeFetch = win.fetch.bind(win)
    win.fetch = (input, init) => {
      const url = new URL(input instanceof win.Request ? input.url : String(input), win.location.href)
      if (url.pathname !== '/api/health') return nativeFetch(input, init)
      const record: FetchTrace = { number: fetches.length + 1, url: url.href, start: Date.now() }
      fetches.push(record)
      const signal = init?.signal || (input instanceof win.Request ? input.signal : null)
      if (signal) signals.set(signal, record)
      return nativeFetch(input, init).then(response => {
        record.status = response.status; record.redirected = response.redirected
        void response.clone().json().then(body => { record.body = body }).catch(error => { record.jsonError = String(error.name) })
        return response
      }, error => { record.errorName = String(error.name); throw error })
    }
  })
  function verify(rows: Interception[]) {
    expect(rows.length, 'todas las solicitudes observadas tienen intercepción').to.eq(fetches.length)
    expect(navigation, 'sin navegación/desmontaje inesperado').to.have.length(0)
    expect(rows.every(row => row.response || row.error), 'todas las solicitudes finalizaron').to.eq(true)
    const cancelled = fetches.filter(row => row.errorName)
    expect(cancelled.length, 'como máximo una limpieza inicial').to.be.at.most(1)
    for (const row of cancelled) {
      expect(row.number, 'solo puede cancelarse la primera solicitud').to.eq(1)
      expect(row.errorName).to.eq('AbortError')
      expect(row.abortStack).to.match(/TechnicalPage\.tsx/)
      expect(row.abortStack).to.match(/doubleInvokeEffectsOnFiber|commitDoubleInvokeEffectsInDEV/)
    }
    const errors = rows.filter(row => row.error)
    expect(errors.length, 'ningún error de red adicional').to.eq(cancelled.length)
    for (const row of errors) {
      expect(row).to.eq(rows[0]); expect(row.error?.name).to.eq('BrowserConnectionClosedError')
    }
    const completed = rows.filter(row => row.response)
    expect(completed.length, 'respuesta HTTP real completada').to.be.greaterThan(0)
    for (const row of completed) { expect(row.response?.statusCode).to.eq(200); expect(row.response?.body).to.deep.eq(expected) }
    for (const row of fetches.filter(row => row.status !== undefined)) {
      expect(row.status).to.eq(200); expect(row.redirected).to.eq(false); expect(row.jsonError).to.eq(undefined); expect(row.body).to.deep.eq(expected)
    }
    verified = completed.map(row => ({ id: row.id, url: row.request.url, statusCode: row.response!.statusCode, body: row.response!.body }))
  }
  return {
    assertResponse(alias: `@${string}`) { return cy.get<Interception[]>(alias).should(rows => { verify(rows) }) },
    snapshot() { return { fetches, navigation, validatedResponses: verified } },
  }
}
