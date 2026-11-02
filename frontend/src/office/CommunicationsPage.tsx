import EmptyState from '../components/EmptyState'
import { useEffect, useRef, useState } from 'react'
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
  const [editorState, setEditorState] = useState({ dirty: false, saving: false }), [editorVersion, setEditorVersion] = useState(0)
  const { data, loading, error: loadError, errorStatus: listStatus } = useOffice<OfficePage>('/api/v1/communications?page=' + page, listRevision)
  const { data: detail, error: detailError, errorStatus: detailStatus, loading: detailLoading } = useOffice<{ data: OfficeItem }>(selected ? '/api/v1/communications/' + selected : '', detailRevision)
  function refresh() { setListRevision(v => v + 1); setDetailRevision(v => v + 1) }
  function discardAllowed() {
    return !busy && !editorState.saving && (!editorState.dirty || window.confirm('Hay cambios sin guardar. ¿Descartar el borrador local?'))
  }
  function openEditor(item: OfficeItem | null) {
    if (!discardAllowed()) return
    setEditing(item); setEditorState({ dirty: false, saving: false }); setEditorVersion(v => v + 1); setForm(true)
  }
  function closeEditor() {
    if (!discardAllowed()) return
    setForm(false); setEditorState({ dirty: false, saving: false })
  }
  async function transition(item: OfficeItem, operation: string) {
    if (busy || editorState.saving || editorState.dirty) return
    if (!window.confirm(operation === 'publish' ? '¿Publicar y notificar a los destinatarios seleccionados? El contenido ya no podrá editarse.' : '¿Archivar este comunicado? Dejará de estar disponible para sus destinatarios.')) return
    setBusy(true); setError('')
    try { await api('/api/v1/communications/' + item.id + '/' + operation, 'POST'); refresh(); window.dispatchEvent(new Event('office-notifications')) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  function card(item: OfficeItem, full = false) {
    return <article key={item.id} data-testid={full ? 'communication-detail' : 'communication-card'} className="institutional-card space-y-3 p-5">
      <h2 className="text-lg font-semibold break-words">{item.title}</h2><OfficeBadge value={item.status} /><p className="text-sm text-brown-medium">{dateLabel(item.published_at ?? item.created_at)}</p>
      {full && <p className="whitespace-pre-wrap break-words">{item.body}</p>}
      <div className="flex flex-wrap gap-2">{!full && <button className="institutional-button" disabled={editorState.saving} onClick={() => setSelected(item.id)}>Leer comunicado</button>}
        {item.status === 'DRAFT' && item.abilities.update && <button className="institutional-button" disabled={busy || editorState.saving} onClick={() => openEditor(item)}>Editar borrador</button>}
        {item.status === 'DRAFT' && item.abilities.publish && <button className="institutional-button" disabled={busy || editorState.saving || editorState.dirty} onClick={() => void transition(item, 'publish')}>Publicar comunicado</button>}
        {item.status !== 'ARCHIVED' && item.abilities.archive && <button className="institutional-button" disabled={busy || editorState.saving || editorState.dirty} onClick={() => void transition(item, 'archive')}>Archivar comunicado</button>}
      </div>
    </article>
  }
  return <section className="space-y-5"><h1 className="text-2xl font-bold">Comunicaciones</h1><Message error>{error}</Message>
    {data?.abilities?.create && <button className="institutional-button" disabled={busy || editorState.saving} onClick={() => openEditor(null)}>Nuevo comunicado</button>}
    {form && <CommunicationForm key={editorVersion} item={editing} stateChanged={setEditorState} cancel={closeEditor} saved={id => { setSelected(id); setForm(false); setEditorState({ dirty: false, saving: false }); refresh() }} />}
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
function CommunicationForm({ item, saved, cancel, stateChanged }: { item: OfficeItem | null; saved: (id: number) => void; cancel: () => void; stateChanged: (state: { dirty: boolean; saving: boolean }) => void }) {
  const { user } = useAuth()
  const [initial] = useState(() => ({ title: item?.title ?? '', body: item?.body ?? '', targets: item?.targets ?? [{ kind: 'institution', target: String(user!.institution_id) }] }))
  const [draft, setDraft] = useState(initial)
  const { targets } = draft
  const targetKey = (values: Target[]) => JSON.stringify([...new Set(values.map(t => JSON.stringify([t.kind, t.target])))].sort())
  const isDirty = (value: typeof draft) => value.title !== initial.title || value.body !== initial.body || targetKey(value.targets) !== targetKey(initial.targets)
  const dirty = isDirty(draft)
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const pending = useRef(false), mounted = useRef(false)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  useEffect(() => {
    if (!dirty && !busy) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty, busy])
  const names: Record<string, string> = { institution: 'Institución', role: 'Rol', grade: 'Grado', section: 'Sección', course: 'Curso', user: 'Usuario' }
  const endpoints: Record<string, string> = { role: 'roles', grade: 'grades', section: 'sections', course: 'courses', user: 'users' }
  function change(next: typeof draft) {
    if (pending.current) return
    setDraft(next); stateChanged({ dirty: isDirty(next), saving: false })
  }
  function setTargets(next: Target[]) { change({ ...draft, targets: next }) }
  function setTarget(index: number, target: Target) { setTargets(targets.map((t, i) => i === index ? target : t)) }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending.current) return
    pending.current = true; setBusy(true); setError(''); stateChanged({ dirty, saving: true })
    let succeeded = false
    try {
      const result = await api<{ data: OfficeItem }>('/api/v1/communications' + (item ? '/' + item.id : ''), item ? 'PATCH' : 'POST', draft)
      if (mounted.current) { succeeded = true; saved(result.data.id) }
    } catch (e) { if (mounted.current) setError(errorMessage(e)) } finally {
      pending.current = false
      if (mounted.current && !succeeded) { setBusy(false); stateChanged({ dirty, saving: false }) }
    }
  }
  return <form data-testid="communication-form" aria-label="Borrador de comunicado" aria-busy={busy} className="institutional-card space-y-4 p-5" onSubmit={submit}><Message error>{error}</Message>
    <p role="status">{busy ? 'Guardando borrador…' : dirty ? 'Cambios sin guardar. Guarda o cancela la edición antes de publicar o archivar.' : 'Sin cambios pendientes.'}</p>
    <fieldset disabled={busy} className="min-w-0 space-y-4">
    <legend className="sr-only">Contenido y destinatarios del borrador</legend>
    <label className="block">Título<input className="institutional-field block w-full" name="title" required maxLength={180} value={draft.title} onChange={e => change({ ...draft, title: e.target.value })} /></label>
    <label className="block">Mensaje<textarea className="institutional-field block w-full" name="body" required maxLength={20000} value={draft.body} onChange={e => change({ ...draft, body: e.target.value })} /></label>
    <h3 className="font-semibold">Destinatarios</h3><p className="text-sm text-brown-medium">Cada persona recibirá una sola notificación aunque coincida con varios criterios.</p>
    {targets.map((t, i) => <div key={i} data-testid="communication-target" className="space-y-2 rounded-xl border border-beige p-3">
      <label>Dirigido a<select className="institutional-field block w-full" name={'target_kind_' + i} value={t.kind} onChange={e => setTarget(i, { kind: e.target.value, target: e.target.value === 'institution' ? String(user!.institution_id) : '' })}>{Object.entries(names).map(([k, label]) => <option key={k} value={k}>{label}</option>)}</select></label>
      {t.kind === 'institution' ? <p>{user?.institution.name}</p> : <OfficeSelect key={t.kind} label={names[t.kind]} accessibleLabel={'Destinatario ' + (i + 1) + ': ' + names[t.kind]} name={'target_value_' + i} endpoint={'/api/v1/office-options/' + endpoints[t.kind]} value={t.target} onChange={value => setTarget(i, { ...t, target: value })} />}
      <button className="institutional-button" type="button" disabled={targets.length === 1 || busy} onClick={() => setTargets(targets.filter((_, n) => n !== i))}>Quitar destinatario</button>
    </div>)}
    <button type="button" className="institutional-button" disabled={targets.length >= 30 || busy} onClick={() => setTargets([...targets, { kind: 'user', target: '' }])}>Agregar destinatario</button>
    <div className="flex flex-wrap gap-2"><button className="institutional-button" disabled={busy}>{busy ? 'Guardando borrador…' : 'Guardar borrador'}</button><button type="button" className="institutional-button" disabled={busy} onClick={cancel}>Cancelar</button></div>
    </fieldset>
  </form>
}
