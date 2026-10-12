import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { api, errorMessage } from '../api/client'
import { useResource } from '../api/useResource'
import { Message } from '../components/Form'
import { familyLabels } from './config'
import type { Family, Paged } from './config'
import PeopleLookup from './PeopleLookup'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
export default function FamilyPanel({ path, studentId, own = false }: { path: string; studentId?: number; own?: boolean }) {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const result = useResource<Paged<Family>>(path+'?page='+page)
  const [editing, setEditing] = useState<Family | 'new' | null>(null)
  const [guardian, setGuardian] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const manage = !own && !!studentId && !!user?.permissions.includes('student-guardians.manage')
  const record = editing && editing !== 'new' ? editing : null
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true)
    const data = new FormData(event.currentTarget)
    const body = { ...(record ? {} : {guardian_id: Number(guardian)}), relationship: data.get('relationship'),is_primary:data.has('is_primary'),can_pick_up:data.has('can_pick_up'),receives_notifications:data.has('receives_notifications') }
    try { await api('/api/v1/students/'+studentId+'/guardians'+(record ? '/'+record.guardian_id : ''), record ? 'PATCH' : 'POST',body); setEditing(null); await result.reload() }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  async function detach(link: Family) {
    if (!window.confirm('¿Quitar esta relación? Se conservarán ambas personas.')) return
    setBusy(true); setError('')
    try { await api('/api/v1/students/'+studentId+'/guardians/'+link.guardian_id,'DELETE'); await result.reload() }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  return <section className="institutional-card mt-6"><h2 className="text-xl font-semibold">{own ? 'Mis relaciones familiares' : studentId ? 'Apoderados asociados' : 'Estudiantes asociados'}</h2>
    {own && !!result.data?.data.length && <div className="my-5 grid gap-3 sm:grid-cols-2">{result.data.data.map(link => <article className="flex items-center gap-3 rounded-xl border border-beige bg-background-soft p-4" key={link.id}><Avatar name={user?.roles.includes('GUARDIAN') ? link.student.name : link.guardian.name} /><div className="min-w-0"><p className="font-semibold break-words">{user?.roles.includes('GUARDIAN') ? link.student.name : link.guardian.name}</p><p className="mt-1 text-xs text-brown-medium">{link.student.student_code} · {familyLabels[link.relationship]}{link.is_primary ? ' · Principal' : ''}</p></div></article>)}</div>}
    <Message error>{error || result.error}</Message>
    {manage && !editing && <button className="institutional-button my-5" onClick={() => { setGuardian(''); setEditing('new') }}>+ Asociar apoderado</button>}
    {editing && <form onSubmit={save} key={record?.id || 'new'} className="my-5 grid gap-4 rounded-xl border border-beige p-5 sm:grid-cols-2">
      {!record && <div className="sm:col-span-2"><PeopleLookup path="/api/v1/guardians" label="Apoderado" name="guardian_id" value={guardian} change={setGuardian} /></div>}
      <label className="grid gap-2 text-sm">Parentesco<select className="institutional-field" name="relationship" defaultValue={record?.relationship || 'GUARDIAN'}>{Object.entries(familyLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      {[['is_primary','Principal'],['can_pick_up','Puede recoger'],['receives_notifications','Recibe notificaciones']].map(([name,label]) => <label className="flex items-center gap-2 text-sm" key={name}><input type="checkbox" name={name} defaultChecked={!!record?.[name as keyof Family]} />{label}</label>)}
      <p className="text-sm text-brown-medium sm:col-span-2">Al elegir un nuevo principal se actualizará automáticamente la relación anterior.</p>
      <div className="flex gap-4 sm:col-span-2"><button className="institutional-button" disabled={busy}>Guardar relación</button><button className="underline" type="button" onClick={() => setEditing(null)}>Cancelar</button></div>
    </form>}
    {result.loading ? <p className="mt-5" role="status">Cargando relaciones…</p> : !result.data?.data.length ? <EmptyState hint="Aquí aparecerán los vínculos registrados por tu institución.">Sin relaciones familiares registradas.</EmptyState> :
      <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Estudiante','Apoderado','Parentesco','Principal','Notificaciones','Puede recoger',...(manage?['Acciones']:[])].map(label => <th key={label} className="border-b border-beige p-3">{label}</th>)}</tr></thead><tbody>
        {result.data.data.map(link => <tr key={link.id}><td className="p-3">{link.student.name}</td><td className="p-3">{link.guardian.name}</td><td className="p-3">{familyLabels[link.relationship]}</td><td className="p-3">{link.is_primary?'Sí':'No'}</td><td className="p-3">{link.receives_notifications?'Sí':'No'}</td><td className="p-3">{link.can_pick_up?'Sí':'No'}</td>{manage && <td className="p-3"><div className="flex gap-3"><button className="underline" onClick={() => setEditing(link)}>Editar relación</button><button className="underline" disabled={busy} onClick={() => void detach(link)}>Quitar</button></div></td>}</tr>)}
      </tbody></table></div>}
    <div className="mt-5 flex gap-4"><button className="institutional-button" disabled={page===1 || result.loading} onClick={() => setPage(page-1)}>Anterior</button><span className="self-center text-sm">Página {page}</span><button className="institutional-button" disabled={page >= (result.data?.meta?.last_page || 1) || result.loading} onClick={() => setPage(page+1)}>Siguiente</button></div>
  </section>
}
