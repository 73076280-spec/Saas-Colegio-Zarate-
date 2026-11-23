import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import type { LearningRecord } from './shared'
import { submissionDeadlineBlocked, useSubmissionTiming } from './shared'

export default function SubmissionForm({ assignment, task, record, review = false, onSaved, onCancel }: {
  assignment: number; task?: LearningRecord; record: LearningRecord | null; review?: boolean; onSaved: () => void; onCancel: () => void
}) {
  const [content, setContent] = useState(record?.content ?? ''), [file, setFile] = useState<File | null>(null)
  const [feedback, setFeedback] = useState(record?.feedback ?? ''), [status, setStatus] = useState('REVIEWED')
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const timing = useSubmissionTiming(!review ? task : undefined)
  async function save(event: FormEvent) {
    event.preventDefault()
    if (!review && task && (!task.abilities.submit || submissionDeadlineBlocked(task))) {
      setError('Esta tarea no admite el envío. Conservamos tu respuesta; revisa el plazo y la disponibilidad.')
      return
    }
    setBusy(true); setError('')
    try {
      if (review && record) {
        await api('/api/v1/submissions/' + record.id + '/review', 'POST', { status, feedback })
      } else {
        const data = new FormData()
        data.set('content', content)
        if (file) data.set('file', file)
        if (record) data.set('_method', 'PATCH')
        await api(record ? '/api/v1/submissions/' + record.id : '/api/v1/assignments/' + assignment + '/submissions', 'POST', data)
      }
      onSaved()
    } catch (error) { setError(errorMessage(error)) } finally { setBusy(false) }
  }
  return <form className="institutional-card my-4 space-y-4" data-testid="submission-form" onSubmit={e => void save(e)}>
    <h3 className="text-lg font-semibold">{review ? 'Revisar entrega' : record ? 'Editar entrega' : 'Entregar tarea'}</h3>
    {review ? <>
      <label className="block space-y-2">Resultado<select className="institutional-field w-full" name="status" value={status} onChange={e => setStatus(e.target.value)}><option value="REVIEWED">Revisada</option><option value="RETURNED">Devolver para un nuevo intento</option></select></label>
      <label className="block space-y-2">Feedback<textarea className="institutional-field w-full" name="feedback" required maxLength={5000} value={feedback} onChange={e => setFeedback(e.target.value)} /></label>
    </> : <>
      <label className="block space-y-2">Respuesta<textarea className="institutional-field min-h-32 w-full" name="content" maxLength={20000} value={content} onChange={e => setContent(e.target.value)} /></label>
      <label className="block space-y-2">Archivo opcional (hasta 2 MiB)<input className="institutional-field w-full" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
      <p className="text-sm text-brown-medium">Escribe una respuesta o adjunta un archivo. Solo una devolución del docente habilita un nuevo intento.</p>
    </>}
    {!review && timing.blocked && <p role="status">La fecha límite venció. Conservamos tu respuesta en este formulario; puedes copiarla antes de salir.</p>}
    <Message error>{error}</Message><div className="flex flex-wrap gap-3"><button className="institutional-button" disabled={busy || (!review && timing.blocked)}>{review ? 'Guardar revisión' : 'Enviar entrega'}</button><button type="button" className="institutional-button" disabled={busy} onClick={onCancel}>Cancelar</button></div>
  </form>
}
