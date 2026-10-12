import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { roleLabels } from '../auth/types'
import type { User, RoleName } from '../auth/types'
import { api, errorMessage } from '../api/client'
import { useResource } from '../api/useResource'
import { Field, Message, PageHeading } from '../components/Form'

export default function UsersPage() {
  const { user: actor } = useAuth()
  const [page, setPage] = useState(1)
  const resource = useResource<{data: User[]; meta: { current_page: number; last_page: number }}>('/api/v1/users?page='+page)
  const [editing, setEditing] = useState<User | 'new' | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const can = (permission: string) => !!actor?.permissions.includes(permission)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    const form = new FormData(event.currentTarget)
    const data: Record<string, unknown> = Object.fromEntries(form)
    if (can('roles.manage')) data.roles = form.getAll('roles')
    try {
      await api(editing === 'new' ? '/api/v1/users' : '/api/v1/users/'+editing?.id, editing === 'new' ? 'POST' : 'PATCH', data)
      setEditing(null); setMessage('Usuario guardado.'); await resource.reload()
    } catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  async function disable(user: User) {
    if (!window.confirm('¿Desactivar la cuenta de '+user.name+'?')) return
    setBusy(true); setError(''); setMessage('')
    try { await api('/api/v1/users/'+user.id+'/disable','POST'); setMessage('Usuario desactivado.'); await resource.reload() }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  const target = editing && editing !== 'new' ? editing : null
  return <><PageHeading title="Usuarios" description="Cuentas y accesos de tu institución." />
    <Message error>{error || resource.error}</Message><Message>{message}</Message>
    {can('users.create') && !editing && <button className="institutional-button mb-6" onClick={() => { setEditing('new'); setError('') }}>Crear usuario</button>}
    {editing && <section className="institutional-card mb-6"><h2 className="mb-5 text-xl font-semibold">{target ? 'Editar usuario' : 'Nuevo usuario'}</h2>
      <form key={target?.id || 'new'} onSubmit={save} className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombres" name="first_name" defaultValue={target?.first_name} maxLength={100} required />
        <Field label="Apellidos" name="last_name" defaultValue={target?.last_name} maxLength={100} required />
        <Field label="Correo electrónico" name="email" type="email" defaultValue={target?.email} required />
        <Field label="Teléfono" name="phone" defaultValue={target?.phone || ''} maxLength={30} />
        {!target && <Field label="Contraseña inicial (12 caracteres, mayúsculas, minúsculas y números)" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />}
        {target && can('users.disable') && <label className="grid gap-2 text-sm font-medium">Estado<select name="status" defaultValue={target.status} className="institutional-field"><option>ACTIVE</option><option>INACTIVE</option><option>BLOCKED</option></select></label>}
        {can('roles.manage') && <fieldset className="sm:col-span-2"><legend className="mb-3 text-sm font-semibold">Roles</legend><div className="flex flex-wrap gap-4">{(Object.keys(roleLabels) as RoleName[]).map(role => <label className="flex items-center gap-2 text-sm" key={role}><input type="checkbox" name="roles" value={role} defaultChecked={target ? target.roles.includes(role) : role === 'STUDENT'} />{roleLabels[role]}</label>)}</div></fieldset>}
        <div className="flex flex-wrap gap-3 sm:col-span-2"><button disabled={busy} className="institutional-button">Guardar usuario</button><button type="button" disabled={busy} className="px-4 underline" onClick={() => setEditing(null)}>Cancelar</button></div>
      </form></section>}
    <section className="institutional-card">{resource.loading ? <p role="status">Cargando usuarios…</p> : <><div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Usuarios institucionales</caption><thead><tr>{['Nombre','Correo','Rol','Estado','Acciones'].map(label => <th className="border-b border-beige p-3" key={label}>{label}</th>)}</tr></thead><tbody>{resource.data?.data.map(user => <tr key={user.id}>
      <td className="p-3 font-medium"><div className="flex items-center gap-3"><Avatar name={user.name} src={user.avatar_url} size="sm" /><span>{user.name}</span></div></td><td className="p-3">{user.email}</td><td className="p-3">{user.roles.map(role => roleLabels[role]).join(', ') || 'Sin rol'}</td><td className="p-3"><span className="institutional-badge">{user.status}</span></td>
      <td className="p-3"><div className="flex gap-3">{can('users.update') && <button className="underline" onClick={() => { setEditing(user); setError('') }}>Editar</button>}{can('users.disable') && user.id !== actor?.id && user.status === 'ACTIVE' && <button className="underline" disabled={busy} onClick={() => void disable(user)}>Desactivar</button>}</div></td>
    </tr>)}</tbody></table></div><div className="mt-5 flex flex-wrap items-center gap-4"><button disabled={page === 1} onClick={() => setPage(page-1)} className="institutional-button">Anterior</button><span className="text-sm">Página {page} de {resource.data?.meta.last_page || 1}</span><button disabled={!resource.data || page >= resource.data.meta.last_page} onClick={() => setPage(page+1)} className="institutional-button">Siguiente</button></div></>}</section></>
}
import Avatar from '../components/Avatar'
