import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { User } from '../auth/types'
import { api, errorMessage } from '../api/client'
import { Field, Message, PageHeading } from '../components/Form'
export default function PasswordPage() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const result = await api<{data: User}>('/api/v1/auth/change-password','POST',Object.fromEntries(new FormData(event.currentTarget)))
      setUser(result.data); navigate('/app', { replace: true })
    } catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  return <><PageHeading title="Cambiar contraseña" description={user?.must_change_password ? 'Actualiza tu contraseña inicial para continuar.' : 'Protege tu cuenta con una contraseña personal.'} /><section className="institutional-card max-w-2xl"><Message error>{error}</Message>
    <form onSubmit={submit} className="grid gap-5">
      <Field label="Contraseña actual" type="password" name="current_password" autoComplete="current-password" required />
      <Field label="Nueva contraseña" type="password" name="password" autoComplete="new-password" minLength={12} maxLength={128} required />
      <p className="text-sm text-brown-medium">Mínimo 12 caracteres, con mayúsculas, minúsculas y números.</p>
      <Field label="Confirmar nueva contraseña" type="password" name="password_confirmation" autoComplete="new-password" required />
      <button className="institutional-button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar contraseña'}</button>
    </form></section></>
}
