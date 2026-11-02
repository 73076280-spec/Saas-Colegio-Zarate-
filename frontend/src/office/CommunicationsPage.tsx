import EmptyState from '../components/EmptyState'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager } from '../enrollment/shared'
import { OfficeBadge, OfficeSelect, dateLabel, useOffice, type OfficePage, type OfficeItem, type Target } from './shared'

export default function CommunicationsPage() {
  const [params] = useSearchParams()
  return <CommunicationsContent key={params.toString()} />
}
function CommunicationsContent() {
  const [params] = useSearchParams()
  const [selected, setSelected] = useState<number | null>(Number(params.get('communication')) || null), [listRevision, setListRevision] = useState(0), [detailRevision, setDetailRevision] = useState(0), [page, setPage] = useState(1)
  const [editing, setEditing] = useState<OfficeItem | null>(null), [form, setForm] = useState(false), [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const { data, loading, error: loadError, errorStatus: listStatus } = useOffice<OfficePage>('/api/v1/communications?page=' + page, listRevision)
  const { data: detail, error: detailError, errorStatus: detailStatus, loading: detailLoading } = useOffice<{ data: OfficeItem }>(selected ? '/api/v1/communications/' + selected : '', detailRevision)
  function refresh() { setListRevision(v => v + 1); setDetailRevision(v => v + 1) }
  async function transition(item: OfficeItem, operation: string) {
    if (!window.confirm(operation === 'publish' ? '¿Publicar y notificar a los destinatarios seleccionados? El contenido ya no podrá editarse.' : '¿Archivar este comunicado? Dejará de estar disponible para sus destinatarios.')) return
    setBusy(true); setError('')
    try { await api('/api/v1/communications/' + item.id + '/' + operation, 'POST'); refresh(); window.dispatchEvent(new Event('office-notifications')) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  function card(item: OfficeItem, full = false) {
    return <article key={item.id} data-testid={full ? 'communication-detail' : 'communication-card'} className="institutional-card space-y-3 p-5">
      <h2 className="text-lg font-semibold break-words">{item.title}</h2><OfficeBadge value={item.status} /><p className="text-sm text-brown-medium">{dateLabel(item.published_at ?? item.created_at)}</p>
      {full && <p className="whitespace-pre-wrap break-words">{item.body}</p>}
      <div className="flex flex-wrap gap-2">{!full && <button className="institutional-button" onClick={() => setSelected(item.id)}>Leer comunicado</button>}
        {item.status === 'DRAFT' && item.abilities.update && <button className="institutional-button" onClick={() => { setEditing(item); setForm(true) }}>Editar borrador</button>}
        {item.status === 'DRAFT' && item.abilities.publish && <button className="institutional-button" disabled={busy} onClick={() => void transition(item, 'publish')}>Publicar comunicado</button>}
        {item.status !== 'ARCHIVED' && item.abilities.archive && <button className="institutional-button" disabled={busy} onClick={() => void transition(item, 'archive')}>Archivar comunicado</button>}
      </div>
    </article>
  }
  return <section className="space-y-5"><h1 className="text-2xl font-bold">Comunicaciones</h1><Message error>{error}</Message>
    {data?.abilities?.create && <button className="institutional-button" onClick={() => { setEditing(null); setForm(true) }}>Nuevo comunicado</button>}
    {form && <CommunicationForm key={editing?.id ?? 'new'} item={editing} cancel={() => setForm(false)} saved={id => { setSelected(id); setForm(false); refresh() }} />}
    <section aria-label="Listado de comunicados" aria-busy={loading} className="space-y-3">
      {loading && <p role="status">Cargando comunicaciones… Página {page}.</p>}
      <QueryError error={loadError} status={listStatus} retry={() => setListRevision(v => v + 1)} />
      {data?.data.length === 0 && <EmptyState hint="No hay comunicados para esta consulta. Puedes volver más adelante.">No hay comunicaciones disponibles.</EmptyState>}
      <div className="space-y-3">{data?.data.map(item => card(item))}</div>{data && <Pager page={data} onPage={setPage} />}
    </section>
    {selected && <section aria-label="Detalle del comunicado" aria-busy={detailLoading} className="space-y-3">
      {detailLoading && <p role="status">Cargando comunicado…</p>}
      <QueryError error={detailError} status={detailStatus} retry={() => setDetailRevision(v => v + 1)} />
      {detail && card(detail.data, true)}
    </section>}
  </section>
}
function QueryError({ error, status, retry }: { error: string; status?: number; retry: () => void }) {
  if (!error) return null
  const message = status === 403 ? 'No tienes autorización para consultar estos comunicados.'
    : status === 404 ? 'El contenido solicitado no está disponible.'
    : status === 422 ? 'La consulta no es válida. Revisa el contexto e inténtalo de nuevo.'
    : status === 401 || status === 419 ? 'La sesión ha caducado. Vuelve a iniciar sesión.'
    : 'No se pudo completar esta consulta. ' + error
  const retryable = status === undefined || status >= 500 || status === 408 || status === 429
  return <div><Message error>{message}</Message>{retryable && <button type="button" className="institutional-button" onClick={retry}>Reintentar consulta</button>}</div>
}
function CommunicationForm({ item, saved, cancel }: { item: OfficeItem | null; saved: (id: number) => void; cancel: () => void }) {
  const { user } = useAuth()
  const [targets, setTargets] = useState<Target[]>(item?.targets ?? [{ kind: 'institution', target: String(user!.institution_id) }])
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const names: Record<string, string> = { institution: 'Institución', role: 'Rol', grade: 'Grado', section: 'Sección', course: 'Curso', user: 'Usuario' }
  const endpoints: Record<string, string> = { role: 'roles', grade: 'grades', section: 'sections', course: 'courses', user: 'users' }
  function setTarget(index: number, target: Target) { setTargets(targets.map((t, i) => i === index ? target : t)) }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('')
    const f = new FormData(e.currentTarget)
    try {
      const result = await api<{ data: OfficeItem }>('/api/v1/communications' + (item ? '/' + item.id : ''), item ? 'PATCH' : 'POST', { title: f.get('title'), body: f.get('body'), targets })
      saved(result.data.id)
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <form data-testid="communication-form" className="institutional-card space-y-4 p-5" onSubmit={submit}><Message error>{error}</Message>
    <label className="block">Título<input className="institutional-field block w-full" name="title" required maxLength={180} defaultValue={item?.title} /></label>
    <label className="block">Mensaje<textarea className="institutional-field block w-full" name="body" required maxLength={20000} defaultValue={item?.body} /></label>
    <h3 className="font-semibold">Destinatarios</h3><p className="text-sm text-brown-medium">Cada persona recibirá una sola notificación aunque coincida con varios criterios.</p>
    {targets.map((t, i) => <div key={i} data-testid="communication-target" className="space-y-2 rounded-xl border border-beige p-3">
      <label>Dirigido a<select className="institutional-field block w-full" name={'target_kind_' + i} value={t.kind} onChange={e => setTarget(i, { kind: e.target.value, target: e.target.value === 'institution' ? String(user!.institution_id) : '' })}>{Object.entries(names).map(([k, label]) => <option key={k} value={k}>{label}</option>)}</select></label>
      {t.kind === 'institution' ? <p>{user?.institution.name}</p> : <OfficeSelect key={t.kind} label={names[t.kind]} name={'target_value_' + i} endpoint={'/api/v1/office-options/' + endpoints[t.kind]} value={t.target} onChange={value => setTarget(i, { ...t, target: value })} />}
      <button className="institutional-button" type="button" disabled={targets.length === 1 || busy} onClick={() => setTargets(targets.filter((_, n) => n !== i))}>Quitar destinatario</button>
    </div>)}
    <button type="button" className="institutional-button" disabled={targets.length >= 30 || busy} onClick={() => setTargets([...targets, { kind: 'user', target: '' }])}>Agregar destinatario</button>
    <div className="flex flex-wrap gap-2"><button className="institutional-button" disabled={busy}>Guardar borrador</button><button type="button" className="institutional-button" disabled={busy} onClick={cancel}>Cancelar</button></div>
  </form>
}
