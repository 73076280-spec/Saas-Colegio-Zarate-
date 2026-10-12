import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { homePath } from '../auth/types'
import { errorMessage } from '../api/client'
import { Field, Message } from '../components/Form'
import Brand from '../components/Brand'
import Icon from '../components/Icon'
import CampusVisual from '../components/CampusVisual'
export default function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
  return <main className="flex min-h-screen items-center justify-center bg-background-soft px-4 py-6 sm:px-8 sm:py-10">
    <div className="login-shell">
      <section className="login-hero">
        <Brand className="relative z-10 w-48" />
        <div className="relative mt-10 lg:mt-14"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#94501F]">Tu comunidad, más conectada</p><h1 className="mt-4 max-w-sm text-3xl leading-tight font-semibold tracking-tight sm:text-[2.6rem]">Un lugar para aprender. <br /><span className="text-[#A84C1E]">Un camino para crecer.</span></h1><p className="mt-5 max-w-sm text-sm leading-7 text-brown-medium">La vida académica de tu comunidad, organizada en un mismo espacio.</p></div>
        <div className="mt-8 hidden lg:block"><CampusVisual /><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-brown-medium"><span className="flex items-center gap-2"><Icon name="book" className="size-4" />Aprendizaje conectado</span><span className="flex items-center gap-2"><Icon name="shield" className="size-4" />Tu comunidad, cerca</span></div></div>
        <div className="mt-7 flex items-center gap-3 text-xs text-brown-medium"><span className="h-px w-8 bg-[#D49551]" />Colegio Zárate · Huancayo</div>
      </section>
      <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 lg:py-16" aria-labelledby="login-title">
        <span className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-background-soft text-[#AD5B26]"><Icon name="book" /></span>
        <p className="mb-2 text-sm font-medium text-brown-medium">Qué gusto tenerte aquí</p><h2 id="login-title" className="text-3xl font-semibold tracking-tight">Iniciar sesión</h2><p className="mb-8 mt-3 text-sm leading-6 text-brown-medium">Ingresa con tu cuenta institucional para continuar.</p>
        <Message error>{error || auth.error}</Message>
        <form onSubmit={submit} className="grid gap-5">
          <Field label="Código de institución" name="institution_code" defaultValue="ZARATE" autoComplete="organization" required maxLength={40} />
          <Field label="Correo electrónico" name="email" type="email" autoComplete="username" required />
          <div><Field label="Contraseña" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required maxLength={128} /><button type="button" className="mt-2 min-h-8 text-xs font-semibold text-[#93531E] underline-offset-4 hover:underline" aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}</button></div>
          <button className="institutional-button mt-1 w-full" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}<Icon name="arrow" /></button>
        </form><div className="mt-8 flex items-start gap-2 border-t border-beige pt-6 text-xs leading-5 text-brown-medium"><Icon name="shield" className="size-4" /><p>Acceso privado a tu institución.<br /><Link to="/" className="mt-2 inline-block underline underline-offset-4">Estado de la plataforma</Link></p></div>
      </section>
    </div>
  </main>
}
