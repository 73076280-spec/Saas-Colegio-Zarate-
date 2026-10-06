import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { AttendanceBadge, type Justification } from './shared'

type History = { id: number; previous_status: string | null; new_status: string; changed_by: number; comment: string | null; created_at: string }
export default function JustificationDetail({ id, changed }: { id: number; changed?: () => void }) {
  const [item, setItem] = useState<Justification | null>(null), [history, setHistory] = useState<Page<History> | null>(null)
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0), [comment, setComment] = useState('')
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    Promise.all([api<{ data: Justification }>('/api/v1/absence-justifications/' + id), api<Page<History>>('/api/v1/absence-justifications/' + id + '/history?page=' + page)])
      .then(([r, h]) => { if (active) { setItem(r.data); setHistory(h); setError('') } }).catch(e => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [id, page, revision])
  async function transition(operation: string) {
    if (!window.confirm('¿Confirmar esta decisión sobre la justificación?')) return
    setBusy(true); setError('')
    try { const r = await api<{ data: Justification }>('/api/v1/absence-justifications/' + id + '/' + operation, 'POST', { review_comment: comment || null }); setItem(r.data); setRevision(v => v + 1); setComment(''); changed?.() }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  async function download() {
    setBusy(true)
    try {
      const r = await fetch('/api/v1/absence-justifications/' + id + '/download', { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      if (!r.ok) throw new Error('download')
      const url = URL.createObjectURL(await r.blob()), a = document.createElement('a')
      a.href = url; a.download = item!.original_filename!; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch { setError('No se pudo descargar el archivo o ya no tienes acceso.') } finally { setBusy(false) }
  }
  return <section className="institutional-card space-y-4 p-5" data-testid="justification-detail">
    <h2 className="text-lg font-semibold">Detalle de justificación</h2><Message error>{error}</Message>
    {!item && <p role="status">Cargando justificación…</p>}
    {item && <><h3>{item.student} · {item.date} · {item.course}</h3><AttendanceBadge value={item.status} /><p className="whitespace-pre-wrap break-words">{item.reason}</p>
      {item.original_filename && <button className="institutional-button max-w-full break-all" disabled={busy} onClick={download}>Descargar {item.original_filename}</button>}
      {item.review_comment && <p className="break-words">Comentario: {item.review_comment}</p>}
      {((item.status === 'PENDING' && item.abilities.review) || (item.status === 'IN_REVIEW' && (item.abilities.approve || item.abilities.reject))) && <div className="space-y-3">
        <label className="block">Comentario de revisión<textarea name="review_comment" className="institutional-field block w-full" maxLength={2000} value={comment} onChange={e => setComment(e.target.value)} /></label>
        <p className="text-sm">El rechazo requiere un comentario.</p>
        {item.status === 'PENDING' && item.abilities.review && <button disabled={busy} className="institutional-button" onClick={() => void transition('review')}>Iniciar revisión</button>}
        {item.status === 'IN_REVIEW' && item.abilities.approve && <button disabled={busy} className="institutional-button mr-2" onClick={() => void transition('approve')}>Aprobar justificación</button>}
        {item.status === 'IN_REVIEW' && item.abilities.reject && <button disabled={busy || !comment.trim()} className="institutional-button" onClick={() => void transition('reject')}>Rechazar justificación</button>}
      </div>}
      <h3 className="font-semibold">Historial</h3><ol className="space-y-2">{history?.data.map(h => <li key={h.id} className="rounded-xl bg-background-soft p-3">
        <AttendanceBadge value={h.new_status} /> <span className="text-sm">{h.created_at} · Usuario #{h.changed_by}</span><p className="break-words">{h.comment}</p>
      </li>)}</ol><Pager page={history} onPage={setPage} />
    </>}
  </section>
}
