import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { api, errorMessage } from '../api/client'
import { useResource } from '../api/useResource'
import { Message, PageHeading } from '../components/Form'
import { personCatalogs, personLabels } from './config'
import type { Person, PersonType, Paged } from './config'
import PersonForm from './PersonForm'
import FamilyPanel from './FamilyPanel'
export default function PeoplePage() {
  const { type = '' } = useParams()
  const { user } = useAuth()
  if (!(type in personCatalogs)) return <Message error>Sección no encontrada.</Message>
  if (!user?.permissions.includes(type+'.view')) return <Message error>No tienes permiso para acceder a esta sección.</Message>
  return <PersonList key={type} type={type as PersonType} />
}
function PersonList({ type }: { type: PersonType }) {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const result = useResource<Paged<Person>>('/api/v1/'+type+'?'+params.toString())
  const definition = personCatalogs[type]
  const [search, setSearch] = useState(params.get('search') || '')
  const [editing, setEditing] = useState<Person | 'new' | null>(null)
  const [detail, setDetail] = useState<Person | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const can = (action: string) => !!user?.permissions.includes(type+'.'+action)
  const page = Number(params.get('page') || 1)
  function filter(field: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(field,value); else next.delete(field)
    next.delete('page'); setParams(next)
  }
  function pagination(nextPage: number) { const next = new URLSearchParams(params); next.set('page',String(nextPage)); setParams(next) }
  async function show(person: Person) {
    setBusy(true); setError('')
    try { setDetail((await api<{data: Person}>('/api/v1/'+type+'/'+person.id)).data); setEditing(null) }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  async function disable(person: Person) {
    if (!window.confirm('¿Desactivar este perfil? Su historial y su cuenta de acceso se conservarán.')) return
    setBusy(true); setError('')
    try { await api('/api/v1/'+type+'/'+person.id+'/disable','POST'); setDetail(null); setMessage('Perfil desactivado.'); await result.reload() }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  return <>
    <Link to="/app/people" className="mb-5 inline-block text-sm text-brown-medium underline">Personas</Link>
    <PageHeading title={definition.title} description="Perfiles de tu institución, con su cuenta y estado." />
    <Message error>{error || result.error}</Message><Message>{message}</Message>
    {can('create') && !editing && <button className="institutional-button mb-6" onClick={() => { setEditing('new'); setDetail(null); setMessage('') }}>+ Nuevo {definition.singular}</button>}
    {editing && <PersonForm key={editing === 'new' ? 'new' : editing.id} type={type} person={editing === 'new' ? null : editing} cancel={() => setEditing(null)} saved={() => { setEditing(null); setDetail(null); setMessage('Persona guardada.'); void result.reload() }} />}
    {detail && <div className="mb-6" data-testid="person-detail"><section className="institutional-card">
      <div className="flex flex-wrap justify-between gap-4"><h2 className="text-xl font-semibold">{detail.user?.name || 'Cuenta archivada'}</h2><button className="underline" onClick={() => setDetail(null)}>Cerrar detalle</button></div>
      <p className="mt-3 text-sm">{detail.user?.email || 'Cuenta institucional'} · <span className="institutional-badge">{personLabels[detail.status]}</span></p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">{definition.fields.filter(field => detail[field.name] !== undefined).map(field => <div key={field.name}><dt className="text-sm text-brown-medium">{field.label}</dt><dd className="mt-1 break-words">{field.options?.[String(detail[field.name])] || String(detail[field.name] || '—')}</dd></div>)}</dl>
    </section>{user?.permissions.includes('student-guardians.view') && type !== 'teachers' && <FamilyPanel key={detail.id} path={'/api/v1/'+type+'/'+detail.id+(type === 'students'?'/guardians':'/students')} studentId={type === 'students' ? detail.id : undefined} />}</div>}
    <section className="institutional-card">
      <div className="mb-6 grid items-end gap-4 sm:grid-cols-2">
        <form onSubmit={event => { event.preventDefault(); filter('search',search) }} className="grid gap-2"><label htmlFor="people-search" className="text-sm font-medium">Buscar persona, código o documento</label><div className="flex gap-2"><input id="people-search" className="institutional-field min-w-0" value={search} onChange={event => setSearch(event.target.value)} maxLength={100} /><button className="institutional-button">Buscar</button></div></form>
        <label className="grid gap-2 text-sm font-medium">Filtrar estado<select className="institutional-field" value={params.get('status') || ''} onChange={event => filter('status',event.target.value)}><option value="">Todos</option>{definition.statuses.map(status => <option key={status} value={status}>{personLabels[status]}</option>)}</select></label>
      </div>
      {result.loading ? <p role="status">Cargando personas…</p> : result.error ? <button className="institutional-button" onClick={() => void result.reload()}>Volver a intentar</button> : !result.data?.data.length ? <p className="rounded-xl bg-background-soft p-5 text-sm">No hay personas que coincidan con los filtros.</p> :
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">{definition.title}</caption><thead><tr>{['Nombre completo',...definition.columns.map(key => key === 'students_count' ? 'Estudiantes asociados' : definition.fields.find(field => field.name === key)?.label || key),'Estado','Acciones'].map(label => <th className="border-b border-beige p-3" key={label}>{label}</th>)}</tr></thead><tbody>
          {result.data.data.map(person => <tr key={person.id}><td className="p-3 font-semibold">{person.user?.name || 'Cuenta archivada'}</td>{definition.columns.map(key => <td key={key} className="max-w-xs p-3 break-words">{String(person[key] ?? '—')}</td>)}<td className="p-3"><span className="institutional-badge">{personLabels[person.status]}</span></td><td className="p-3"><div className="flex flex-wrap gap-3"><button className="underline" disabled={busy} onClick={() => void show(person)}>Detalle</button>{can('update') && <button className="underline" onClick={() => { setEditing(person); setDetail(null) }}>Editar</button>}{can('disable') && person.status !== 'INACTIVE' && <button className="underline" disabled={busy} onClick={() => void disable(person)}>Desactivar</button>}</div></td></tr>)}
        </tbody></table></div>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><p className="text-sm">{result.data?.meta?.total || 0} registros · Página {page} de {result.data?.meta?.last_page || 1}</p><div className="flex gap-3"><button className="institutional-button" disabled={page===1 || result.loading} onClick={() => pagination(page-1)}>Anterior</button><button className="institutional-button" disabled={page >= (result.data?.meta?.last_page || 1) || result.loading} onClick={() => pagination(page+1)}>Siguiente</button></div></div>
    </section>
  </>
}
