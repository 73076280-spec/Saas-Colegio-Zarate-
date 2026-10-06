import type { ReactNode } from 'react'

export function InstitutionalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-soft text-text-dark lg:grid lg:grid-cols-[250px_1fr]">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded-lg focus:bg-white focus:p-4">
        Ir al contenido
      </a>
      <aside className="border-b border-beige bg-white px-5 py-6 lg:flex lg:min-h-screen lg:flex-col lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-beige text-xl font-bold text-brown-medium">Z</span>
          <div>
            <p className="text-lg font-semibold tracking-tight">Colegio Zárate</p>
            <p className="text-xs text-brown-medium">Huancayo · Plataforma educativa</p>
          </div>
        </div>
        <nav aria-label="Navegación principal" className="mt-6 lg:mt-12">
          <a className="institutional-nav" href="#contenido" aria-current="page">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
            </svg>
            Inicio
          </a>
        </nav>
        <p className="mt-auto hidden pt-12 text-xs leading-5 text-brown-medium lg:block">
          Plataforma de gestión académica<br />Entorno de desarrollo
        </p>
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-beige bg-white px-6 py-5 sm:px-10">
          <p className="text-sm font-medium text-brown-medium">Inicio <span aria-hidden="true" className="mx-2 text-brown-light">/</span> Vista general</p>
          <span className="institutional-badge">Iteración 0</span>
        </header>
        <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
          {children}
        </main>
      </div>
    </div>
  )
}
