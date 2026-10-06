import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { homePath } from '../auth/types'
import { errorMessage } from '../api/client'
import { Field, Message } from '../components/Form'
export default function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (auth.loading) return <p role="status" className="p-8">Consultando sesión…</p>
  if (auth.user) return <Navigate to={homePath(auth.user)} replace />
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>
    setBusy(true); setError('')
    try { const user = await auth.login(data); navigate(homePath(user), { replace: true }) }
    catch (failure) { setError(errorMessage(failure)) }
    finally { setBusy(false) }
  }
  return <main className="flex min-h-screen items-center justify-center bg-background-soft px-5 py-10">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-beige bg-white shadow-sm md:grid-cols-2">
      <section className="flex flex-col justify-between bg-beige p-8 sm:p-10">
        <div><span className="inline-flex size-14 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-brown-medium" aria-hidden="true">Z</span><p className="mt-6 text-sm font-semibold">Plataforma educativa</p><h1 className="mt-3 text-3xl font-semibold">Bienvenido a tu comunidad</h1><p className="mt-5 leading-7">Un espacio cercano y seguro para acompañar la gestión de tu institución.</p></div>
        <p className="mt-10 text-sm">Colegio Zárate · Huancayo</p>
      </section>
      <section className="p-8 sm:p-10" aria-labelledby="login-title">
        <h2 id="login-title" className="text-2xl font-semibold">Iniciar sesión</h2><p className="mb-6 mt-2 text-sm text-brown-medium">Ingresa con tu cuenta institucional.</p>
        <Message error>{error || auth.error}</Message>
        <form onSubmit={submit} className="grid gap-5">
          <Field label="Código de institución" name="institution_code" defaultValue="ZARATE" autoComplete="organization" required maxLength={40} />
          <Field label="Correo electrónico" name="email" type="email" autoComplete="username" required />
          <Field label="Contraseña" name="password" type="password" autoComplete="current-password" required maxLength={128} />
          <button className="institutional-button mt-1" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
        </form><Link to="/" className="mt-6 inline-block text-sm text-brown-medium underline">Estado de la plataforma</Link>
      </section>
    </div>
  </main>
}
