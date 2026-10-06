import { useState } from 'react'
import { api, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { OfficeBadge, OfficeSelect, dateLabel, useOffice, type OfficeItem } from './shared'
import DocumentsPage from './DocumentsPage'

type History = { id: number; new_status: string; comment: string | null; created_at: string; changed_by: number }
export default function RequestDetail({ id, changed }: { id: number; changed: () => void }) {
  const { user } = useAuth()
  const [revision, setRevision] = useState(0), [page, setPage] = useState(1), [edit, setEdit] = useState(false)
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [comment, setComment] = useState(''), [resolution, setResolution] = useState('')
  const [assignee, setAssignee] = useState('')
  const { data, loading, error: loadError } = useOffice<{ data: OfficeItem }>('/api/v1/academic-requests/' + id, revision)
  const { data: history, error: historyError } = useOffice<Page<History>>('/api/v1/academic-requests/' + id + '/history?page=' + page, revision)
  const item = data?.data
  async function save(body: object, operation?: string) {
    if (operation && !window.confirm('¿Confirmar el cambio de estado de la solicitud?')) return
    setBusy(true); setError('')
    try {
      await api('/api/v1/academic-requests/' + id + (operation ? '/' + operation : ''), operation ? 'POST' : 'PATCH', body)
      setRevision(v => v + 1); changed(); setEdit(false); setComment(''); setResolution('')
      window.dispatchEvent(new Event('office-notifications'))
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  const operations: Record<string, string[]> = { REGISTERED: ['review'], OBSERVED: ['review'], IN_REVIEW: ['observe','approve','reject'], APPROVED: ['complete'] }
  const labels: Record<string, string> = { review: 'Iniciar revisión', observe: 'Observar solicitud', approve: 'Aprobar solicitud', reject: 'Rechazar solicitud', complete: 'Completar solicitud' }
  return <section data-testid="request-detail" className="institutional-card space-y-4 p-5"><h2 className="text-xl font-semibold">Detalle de solicitud</h2>
    <Message error>{error || loadError || historyError}</Message>{loading && <p role="status">Cargando detalle…</p>}
    {item && <><h3 className="font-semibold">{item.request_code} · {item.subject}</h3><span data-testid="request-status"><OfficeBadge value={item.status} /></span><p>{item.student} · {item.type}</p><p className="whitespace-pre-wrap break-words">{item.description}</p>
      <p>Responsable: {item.responsible || 'Sin asignar'}</p>{item.resolution && <p className="whitespace-pre-wrap break-words">Resolución: {item.resolution}</p>}
      {item.abilities.update && ['REGISTERED','OBSERVED'].includes(item.status) && user?.roles.some(r => ['STUDENT','GUARDIAN'].includes(r)) && <button className="institutional-button" onClick={() => setEdit(!edit)}>Corregir solicitud</button>}
      {edit && <form className="space-y-3" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); void save({ subject: f.get('subject'), description: f.get('description') }) }}>
        <label className="block">Asunto<input name="subject" className="institutional-field block w-full" defaultValue={item.subject} maxLength={180} required /></label>
        <label className="block">Descripción<textarea name="description" className="institutional-field block w-full" defaultValue={item.description} maxLength={10000} required /></label><button disabled={busy} className="institutional-button">Guardar corrección</button>
      </form>}
      {item.abilities.review && ['REGISTERED','IN_REVIEW','OBSERVED'].includes(item.status) && <form className="space-y-2" onSubmit={e => { e.preventDefault(); void save({ assigned_to: assignee ? Number(assignee) : null }) }}>
        <OfficeSelect label="Asignar responsable" name="assigned_to" endpoint="/api/v1/office-options/assignees" value={assignee} onChange={setAssignee} optional />
        <button disabled={busy} className="institutional-button">Guardar responsable</button>
      </form>}
      {(operations[item.status] ?? []).some(op => item.abilities[op]) && <div className="space-y-3">
        <label className="block">Comentario / observación<textarea name="comment" className="institutional-field block w-full" maxLength={3000} value={comment} onChange={e => setComment(e.target.value)} /></label>
        <label className="block">Resolución<textarea name="resolution" className="institutional-field block w-full" maxLength={5000} value={resolution} onChange={e => setResolution(e.target.value)} /></label>
        <p className="text-sm text-brown-medium">Observar requiere comentario. Aprobar y completar requieren resolución; rechazar requiere ambos.</p>
        <div className="flex flex-wrap gap-2">{(operations[item.status] ?? []).filter(op => item.abilities[op]).map(op => <button key={op} className="institutional-button" disabled={busy || (['observe','reject'].includes(op) && !comment.trim()) || (['approve','reject','complete'].includes(op) && !resolution.trim())} onClick={() => void save({ comment: comment || null, resolution: resolution || null }, op)}>{labels[op]}</button>)}</div>
      </div>}
      <h3 className="font-semibold">Historial y observaciones</h3><ol className="space-y-2">{history?.data.map(h => <li className="rounded-xl bg-background-soft p-3" key={h.id}><OfficeBadge value={h.new_status} /> <span className="text-sm">{dateLabel(h.created_at)}</span><p className="whitespace-pre-wrap break-words">{h.comment}</p></li>)}</ol><Pager page={history} onPage={setPage} />
      <DocumentsPage requestId={id} studentId={item.student_id} embedded />
    </>}
  </section>
}
