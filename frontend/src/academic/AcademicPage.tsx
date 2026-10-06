import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { api, errorMessage } from '../api/client'
import { useResource } from '../api/useResource'
import { Message, PageHeading } from '../components/Form'
import { catalogs, displayValue, statusLabels } from './catalogs'
import type { AcademicEntry, AcademicList } from './catalogs'
import AcademicForm from './AcademicForm'
import RelationSelect from './RelationSelect'

export default function AcademicPage() {
  const { catalog = '' } = useParams()
  const { user } = useAuth()
  if (!catalogs[catalog]) return <Message error>Catálogo no encontrado.</Message>
  if (!user?.permissions.includes(catalog+'.view')) return <Message error>No tienes permiso para acceder a esta sección.</Message>
  return <CatalogPage key={catalog} catalog={catalog} />
}
function CatalogPage({ catalog }: { catalog: string }) {
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const definition = catalogs[catalog]
  const resource = useResource<AcademicList>('/api/v1/'+catalog+'?'+params.toString())
  const [editing, setEditing] = useState<AcademicEntry | 'new' | null>(null)
  const [detail, setDetail] = useState<AcademicEntry | null>(null)
  const [search, setSearch] = useState(params.get('search') || '')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const can = (ability: string) => !!user?.permissions.includes(catalog+'.'+ability)
  const page = Number(params.get('page') || 1)
  function filter(name: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(name,value)
    else next.delete(name)
    next.delete('page')
    setParams(next)
  }
  function changePage(page: number) {
    const next = new URLSearchParams(params)
    next.set('page',String(page)); setParams(next)
  }
  async function show(record: AcademicEntry) {
    setBusy(true); setError('')
    try { setDetail((await api<{data: AcademicEntry}>('/api/v1/'+catalog+'/'+record.id)).data) }
    catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  async function action(record: AcademicEntry, operation: 'close' | 'disable' | 'current') {
    const question = operation === 'close' ? '¿Cerrar '+record.name+'? No admitirá nuevas modificaciones.' : operation === 'disable' ? '¿Desactivar '+record.name+'? Se conservará su historial.' : '¿Establecer '+record.name+' como año actual?'
    if (!window.confirm(question)) return
    setBusy(true); setError(''); setMessage('')
    try {
      await api('/api/v1/'+catalog+'/'+record.id+(operation === 'current' ? '' : '/'+operation), operation === 'current' ? 'PATCH' : 'POST', operation === 'current' ? { is_current: true } : undefined)
      setDetail(null); setMessage('Operación completada.'); await resource.reload()
    } catch (failure) { setError(errorMessage(failure)) } finally { setBusy(false) }
  }
  function childLink(record: AcademicEntry) {
    if (catalog === 'academic-years') return <Link className="underline" to={'/app/academic/academic-periods?academic_year_id='+record.id}>Ver periodos</Link>
    if (catalog === 'education-levels') return <Link className="underline" to={'/app/academic/grade-levels?education_level_id='+record.id}>Ver grados</Link>
    if (catalog === 'grade-levels') return <Link className="underline" to={'/app/academic/sections?grade_level_id='+record.id}>Ver secciones</Link>
    return null
  }
  return <>
    <Link to="/app/academic" className="mb-5 inline-block text-sm text-brown-medium underline">Gestión Académica</Link>
    <PageHeading title={definition.title} description={definition.description} />
    <Message error>{error || resource.error}</Message><Message>{message}</Message>
    {can('create') && !editing && <button className="institutional-button mb-6" onClick={() => { setEditing('new'); setDetail(null); setMessage('') }}>+ Crear {definition.singular}</button>}
    {editing && <AcademicForm key={editing === 'new' ? 'new' : editing.id} catalog={catalog} record={editing === 'new' ? null : editing} defaults={Object.fromEntries(params)} cancel={() => setEditing(null)} saved={() => { setEditing(null); setDetail(null); setMessage('Registro guardado.'); void resource.reload() }} />}
    {detail && <section className="institutional-card mb-6" aria-label="Detalle">
      <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-semibold">{detail.name}</h2><button className="underline" onClick={() => setDetail(null)}>Cerrar detalle</button></div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">{definition.fields.map(field => <div key={field.name}><dt className="text-sm text-brown-medium">{field.label}</dt><dd className="mt-1 break-words">{displayValue(detail[field.relation ? field.name.replace('_id','') : field.name])}</dd></div>)}<div><dt className="text-sm text-brown-medium">Estado</dt><dd>{statusLabels[detail.status]}</dd></div></dl>
      {detail.periods && <div className="mt-6"><h3 className="font-semibold">Periodos académicos</h3>{detail.periods.length ? <ul className="mt-3 space-y-2">{detail.periods.map(period => <li key={period.id} className="text-sm">{period.name}: {displayValue(period.start_date)} — {displayValue(period.end_date)} · {statusLabels[period.status]}</li>)}</ul> : <p className="mt-2 text-sm">Este año todavía no tiene periodos.</p>}</div>}
      <div className="mt-4 text-sm">{childLink(detail)}</div>
    </section>}
    <section className="institutional-card">
      <div className="mb-6 grid items-end gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <form onSubmit={event => { event.preventDefault(); filter('search',search) }} className="grid gap-2"><label htmlFor="catalog-search" className="text-sm font-medium">Buscar por nombre o código</label><div className="flex gap-2"><input id="catalog-search" className="institutional-field min-w-0" value={search} onChange={event => setSearch(event.target.value)} maxLength={100} /><button className="institutional-button">Buscar</button></div></form>
        <label className="grid gap-2 text-sm font-medium">Filtrar estado<select className="institutional-field" value={params.get('status') || ''} onChange={event => filter('status',event.target.value)}><option value="">Todos</option>{(catalog.startsWith('academic-') ? ['DRAFT','ACTIVE','CLOSED'] : ['ACTIVE','INACTIVE']).map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
        {definition.filters.map(field => <RelationSelect key={field.name} catalog={field.relation!} name={'filter-'+field.name} label={field.label} value={params.get(field.name) || ''} onChange={value => filter(field.name,value)} />)}
        {catalog === 'academic-years' && <label className="grid gap-2 text-sm font-medium">Año actual<select className="institutional-field" value={params.get('is_current') || ''} onChange={event => filter('is_current',event.target.value)}><option value="">Todos</option><option value="1">Actual</option><option value="0">No actual</option></select></label>}
        {params.size > 0 && <button className="justify-self-start text-sm underline" onClick={() => { setParams({}); setSearch('') }}>Limpiar filtros</button>}
      </div>
      {resource.loading ? <p role="status">Cargando registros…</p> : resource.error ? <button className="institutional-button" onClick={() => void resource.reload()}>Volver a intentar</button> : !resource.data?.data.length ? <p className="rounded-xl bg-background-soft p-6 text-sm">No hay registros que coincidan con los filtros.</p> :
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">{definition.title}</caption><thead><tr>{['Nombre',...definition.columns.map(column => column.label),'Estado','Acciones'].map(label => <th className="border-b border-beige p-3" key={label}>{label}</th>)}</tr></thead><tbody>
          {resource.data.data.map(record => <tr key={record.id} className="border-b border-beige last:border-b-0"><td className="p-3 font-semibold">{record.name}</td>
            {definition.columns.map(column => <td className="max-w-xs p-3 break-words" key={column.key}>{column.key === 'is_current' && record.is_current ? <span className="institutional-badge">Actual</span> : displayValue(record[column.key])}</td>)}
            <td className="p-3"><span className="institutional-badge">{statusLabels[record.status]}</span></td>
            <td className="p-3"><div className="flex flex-wrap gap-3">
              <button className="underline" disabled={busy} onClick={() => void show(record)}>Detalle</button>
              {childLink(record)}
              {can('update') && record.status !== 'CLOSED' && <button className="underline" onClick={() => { setEditing(record); setDetail(null); setMessage('') }}>Editar</button>}
              {catalog === 'academic-years' && can('update') && record.status !== 'CLOSED' && !record.is_current && <button className="underline" disabled={busy} onClick={() => void action(record,'current')}>Hacer actual</button>}
              {catalog.startsWith('academic-') && can('close') && record.status !== 'CLOSED' && <button className="underline" disabled={busy} onClick={() => void action(record,'close')}>Cerrar</button>}
              {catalog === 'subjects' && can('disable') && record.status === 'ACTIVE' && <button className="underline" disabled={busy} onClick={() => void action(record,'disable')}>Desactivar</button>}
            </div></td></tr>)}
        </tbody></table></div>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm">{resource.data?.total || 0} registros · Página {page} de {resource.data?.last_page || 1}</p>
        <div className="flex gap-3"><button className="institutional-button" disabled={resource.loading || page <= 1} onClick={() => changePage(page-1)}>Anterior</button><button className="institutional-button" disabled={resource.loading || page >= (resource.data?.last_page || 1)} onClick={() => changePage(page+1)}>Siguiente</button></div>
      </div>
    </section>
  </>
}
