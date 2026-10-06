import { useEffect, useState } from 'react'
import { fetchHealth } from '../api/health'
import { InstitutionalLayout } from '../layouts/InstitutionalLayout'

type Status = 'loading' | 'ok' | 'error'

function App() {
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    let active = true
    fetchHealth(controller.signal)
      .then(() => { if (active) setStatus('ok') })
      .catch(() => { if (active) setStatus('error') })
      .finally(() => window.clearTimeout(timeout))
    return () => {
      active = false
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  const checkConnection = () => {
    setStatus('loading')
    setAttempt((value) => value + 1)
  }

  return (
    <InstitutionalLayout>
      <div className="max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-brown-medium uppercase">Nuestro espacio educativo</p>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">Plataforma SaaS Colegio Zárate</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-brown-medium">
          Un espacio para acompañar la gestión académica de nuestra comunidad.
        </p>
      </div>

      <div className="mt-10 grid items-start gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="institutional-card" aria-labelledby="connection-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="connection-heading" className="text-xl font-semibold">Estado de la plataforma</h2>
            <span className="institutional-badge">Verificación técnica</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-brown-medium">
            Comprueba la comunicación con el servicio de la plataforma.
          </p>

          <div className={`mt-6 flex items-start gap-3 rounded-xl border p-5 ${status === 'error' ? 'border-brown-light bg-beige' : 'border-beige bg-background-soft'}`}>
            <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white font-bold text-brown-medium">
              {status === 'ok' ? '✓' : status === 'error' ? '!' : '…'}
            </span>
            <div>
              <p role="status" aria-live="polite" data-testid="backend-status" className="text-sm leading-6 font-semibold">
                {status === 'loading' && 'Consultando backend…'}
                {status === 'ok' && 'Backend conectado correctamente.'}
                {status === 'error' && 'No se pudo verificar la conexión con el backend.'}
              </p>
              <p className="mt-1 text-sm leading-6 text-text-dark">
                {status === 'loading' && 'La comprobación puede tardar unos segundos.'}
                {status === 'ok' && 'El servicio está disponible y responde a la consulta.'}
                {status === 'error' && 'Puedes volver a comprobar la conexión cuando el servicio esté disponible.'}
              </p>
            </div>
          </div>

          <button type="button" className="institutional-button mt-6" disabled={status === 'loading'} onClick={checkConnection}>
            {status === 'loading' ? 'Comprobando…' : 'Volver a comprobar'}
          </button>
        </section>

        <section className="institutional-card border-t-4 border-t-primary" aria-labelledby="stage-heading">
          <p className="text-xs font-semibold tracking-wider text-brown-medium uppercase">Punto de partida</p>
          <h2 id="stage-heading" className="mt-3 text-xl font-semibold">Construyendo la base</h2>
          <p className="mt-3 text-sm leading-7 text-brown-medium">
            Estamos preparando el entorno de la plataforma. Las funcionalidades académicas estarán disponibles en próximas iteraciones.
          </p>
          <div className="mt-6 border-t border-beige pt-5">
            <p className="text-sm font-semibold">Colegio Zárate</p>
            <p className="mt-1 text-sm text-brown-medium">Huancayo, Perú</p>
          </div>
        </section>
      </div>
      <footer className="mt-10 text-xs leading-6 text-brown-medium">
        Plataforma educativa · Entorno de desarrollo
      </footer>
    </InstitutionalLayout>
  )
}

export default App
