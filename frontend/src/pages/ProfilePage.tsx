import OwnPeopleProfile from '../people/OwnPeopleProfile'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import type { User } from '../auth/types'
import { api, errorMessage } from '../api/client'
import { Field, Message, PageHeading } from '../components/Form'
export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (!user) return null
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(''); setError('')
    try {
      const response = await api<{data: User}>('/api/v1/profile','PATCH',Object.fromEntries(new FormData(event.currentTarget)))
      setUser(response.data); setMessage('Perfil actualizado.')
    } catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  return <><PageHeading title="Mi perfil" description="Tu información dentro de la comunidad." /><section className="institutional-card max-w-2xl"><Message>{message}</Message><Message error>{error}</Message>
    <form onSubmit={submit} className="grid gap-5">
      <Field label="Nombres" name="first_name" defaultValue={user.first_name} required maxLength={100} />
      <Field label="Apellidos" name="last_name" defaultValue={user.last_name} required maxLength={100} />
      <Field label="Teléfono" name="phone" defaultValue={user.phone || ''} maxLength={30} />
      <Field label="Correo institucional" value={user.email} disabled />
      <button className="institutional-button" disabled={busy || !user.permissions.includes('profile.update')}>{busy ? 'Guardando…' : 'Guardar perfil'}</button>
    </form></section><OwnPeopleProfile /></>
}
