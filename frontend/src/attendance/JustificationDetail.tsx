import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { AttendanceBadge, type Justification } from './shared'
import EmptyState from '../components/EmptyState'

type History = { id: number; previous_status: string | null; new_status: string; changed_by: number; comment: string | null; created_at: string }
export default function JustificationDetail({ id, changed, onStateChange }: { id: number; changed?: () => void; onStateChange?: (state: { dirty: boolean; busy: boolean }) => void }) {
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0), [comment, setComment] = useState('')
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false)
  const queryKey = id + ':' + page + ':' + revision
  const [response, setResponse] = useState<{ key: string; item: Justification | null; history: Page<History> | null; error: string } | null>(null)
  const current = response?.key === queryKey ? response : null
  const item = current?.item, history = current?.history
  const dirty = comment.length > 0
  useEffect(() => { onStateChange?.({ dirty, busy }) }, [dirty, busy, onStateChange])
  useEffect(() => {
    let active = true
    Promise.all([api<{ data: Justification }>('/api/v1/absence-justifications/' + id), api<Page<History>>('/api/v1/absence-justifications/' + id + '/history?page=' + page)])
      .then(([r, h]) => { if (active) setResponse({ key: queryKey, item: r.data, history: h, error: '' }) })
      .catch(error => { if (active) setResponse({ key: queryKey, item: null, history: null, error: errorMessage(error) }) })
    return () => { active = false }
  }, [id, page, queryKey])
  async function transition(operation: string) {
    if (busy || !item || !item.abilities[operation] || !(operation === 'review' ? item.status === 'PENDING' : item.status === 'IN_REVIEW')) return
    if (!window.confirm('¿Confirmar esta decisión sobre la justificación?')) return
    setBusy(true); setError(''); setNotice('')
    try { await api<{ data: Justification }>('/api/v1/absence-justifications/' + id + '/' + operation, 'POST', { review_comment: comment || null }); setNotice('Decisión registrada.'); setRevision(v => v + 1); setComment(''); changed?.() }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  async function download() {
    if (busy || !item) return
    setBusy(true)
    try {
      const r = await fetch('/api/v1/absence-justifications/' + id + '/download', { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      if (!r.ok) throw new Error('download')
      const url = URL.createObjectURL(await r.blob()), a = document.createElement('a')
      a.href = url; a.download = item!.original_filename!; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch { setError('No se pudo descargar el archivo o ya no tienes acceso.') } finally { setBusy(false) }
  }
  return <section className="institutional-card space-y-4 p-5" data-testid="justification-detail">
    <h2 className="text-lg font-semibold">Detalle de justificación</h2><Message error>{error}</Message><Message>{notice}</Message>
    {!current && <p role="status">Cargando justificación e historial… Página {page}.</p>}
    {current?.error && <Message error>No se pudo consultar el detalle o historial. {current.error}</Message>}
    {(current?.error || error) && <button type="button" className="institutional-button" disabled={busy || !current} onClick={() => { setError(''); setRevision(v => v + 1) }}>Reintentar consulta del detalle e historial</button>}
    {item && <><h3>{item.student} · {item.date} · {item.course}</h3><AttendanceBadge value={item.status} /><p className="whitespace-pre-wrap break-words">{item.reason}</p>
      {item.original_filename && <button className="institutional-button max-w-full break-all" disabled={busy} onClick={download}>Descargar {item.original_filename}</button>}
      {item.review_comment && <p className="break-words">Comentario: {item.review_comment}</p>}
      {((item.status === 'PENDING' && item.abilities.review) || (item.status === 'IN_REVIEW' && (item.abilities.approve || item.abilities.reject))) && <div className="space-y-3">
        <label className="block">Comentario de revisión<textarea name="review_comment" className="institutional-field block w-full" disabled={busy} maxLength={2000} value={comment} onChange={e => setComment(e.target.value)} /></label>
        <p className="text-sm">El rechazo requiere un comentario.</p>
        {item.status === 'PENDING' && item.abilities.review && <button disabled={busy} className="institutional-button" onClick={() => void transition('review')}>Iniciar revisión</button>}
        {item.status === 'IN_REVIEW' && item.abilities.approve && <button disabled={busy} className="institutional-button mr-2" onClick={() => void transition('approve')}>Aprobar justificación</button>}
        {item.status === 'IN_REVIEW' && item.abilities.reject && <button disabled={busy || !comment.trim()} className="institutional-button" onClick={() => void transition('reject')}>Rechazar justificación</button>}
      </div>}
      <h3 className="font-semibold">Historial</h3>{history?.data.length === 0 && <EmptyState>No hay cambios registrados en el historial de esta justificación.</EmptyState>}<ol className="space-y-2">{history?.data.map(h => <li key={h.id} className="rounded-xl bg-background-soft p-3">
        <AttendanceBadge value={h.new_status} /> <span className="text-sm">{h.created_at} · Usuario #{h.changed_by}</span><p className="break-words">{h.comment}</p>
      </li>)}</ol><fieldset disabled={busy} aria-label="Páginas del historial de justificación"><Pager page={history ?? null} onPage={setPage} /></fieldset>
    </>}
  </section>
}
