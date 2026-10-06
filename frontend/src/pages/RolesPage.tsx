import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { roleLabels } from '../auth/types'
import type { RoleName } from '../auth/types'
import { api, errorMessage } from '../api/client'
import { useResource } from '../api/useResource'
import { Message, PageHeading } from '../components/Form'
type Role = { id: number; name: RoleName; permissions: { name: string }[] }
export default function RolesPage() {
  const { user } = useAuth()
  const roles = useResource<{data: Role[]}>('/api/v1/roles')
  const permissions = useResource<{data: string[]}>('/api/v1/permissions')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function save(event: FormEvent<HTMLFormElement>, role: Role) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('')
    try { await api('/api/v1/roles/'+role.id+'/permissions','PUT',{ permissions: new FormData(event.currentTarget).getAll('permissions') }); setMessage('Permisos actualizados.'); await roles.reload() }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  return <><PageHeading title="Roles y permisos" description="Define el acceso de cada rol dentro de tu institución." /><Message>{message}</Message><Message error>{error || roles.error || permissions.error}</Message>
    {roles.loading || permissions.loading ? <p role="status">Cargando permisos…</p> : <div className="grid gap-5 xl:grid-cols-2">{roles.data?.data.map(role => <section className="institutional-card" key={role.id}>
      <h2 className="text-xl font-semibold">{roleLabels[role.name]}</h2><p className="mt-1 text-xs text-brown-medium">{role.name}</p><form onSubmit={event => void save(event,role)} className="mt-5 grid gap-3">
        {permissions.data?.data.map(permission => <label key={permission} className="flex items-center gap-3 text-sm"><input type="checkbox" name="permissions" value={permission} defaultChecked={role.permissions.some(value => value.name === permission)} disabled={busy || role.name === 'ADMINISTRATOR' || !user?.permissions.includes('roles.manage')} />{permission}</label>)}
        {role.name === 'ADMINISTRATOR' ? <p className="mt-3 text-sm text-brown-medium">El acceso del administrador está protegido.</p> : user?.permissions.includes('roles.manage') && <button className="institutional-button mt-3" disabled={busy}>Guardar permisos</button>}
      </form></section>)}</div>}</>
}
