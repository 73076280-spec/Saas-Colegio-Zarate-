import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { LearningSelect } from './shared'
import type { LearningRecord } from './shared'

export default function ScoreForm({ assessment, record, onSaved, onCancel }: {
  assessment: LearningRecord; record: LearningRecord | null; onSaved: () => void; onCancel: () => void
}) {
  const [student, setStudent] = useState(String(record?.student?.id ?? '')), [score, setScore] = useState(record?.score ?? '')
  const [observations, setObservations] = useState(record?.observations ?? ''), [reason, setReason] = useState('')
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      await api(record ? '/api/v1/scores/' + record.id : '/api/v1/assessments/' + assessment.id + '/scores', record ? 'PATCH' : 'POST', {
        score: Number(score), observations, ...(record ? { reason } : { student_id: Number(student) }),
      })
      onSaved()
    } catch (error) { setError(errorMessage(error)) } finally { setBusy(false) }
  }
  return <form className="institutional-card my-4 space-y-4" data-testid="score-form" onSubmit={e => void save(e)}>
    <h3 className="text-lg font-semibold">{record ? 'Modificar nota' : 'Registrar nota'} · {assessment.title}</h3>
    {record ? <p>{record.student?.name}</p> : <LearningSelect label="Estudiante matriculado" name="student_id" endpoint={'/api/v1/courses/' + assessment.course.id + '/students'} value={student} onChange={setStudent} />}
    <label className="block space-y-2">Nota<input className="institutional-field w-full" type="number" name="score" required min={0} max={Number(assessment.max_score ?? 20)} step="0.01" value={score} onChange={e => setScore(e.target.value)} /></label>
    <label className="block space-y-2">Observación<textarea className="institutional-field w-full" name="observations" maxLength={5000} value={observations} onChange={e => setObservations(e.target.value)} /></label>
    {record && <label className="block space-y-2">Motivo del cambio<textarea className="institutional-field w-full" name="reason" required maxLength={1000} value={reason} onChange={e => setReason(e.target.value)} /></label>}
    <Message error>{error}</Message><div className="flex flex-wrap gap-3"><button className="institutional-button" disabled={busy}>Guardar nota</button><button type="button" className="institutional-button" disabled={busy} onClick={onCancel}>Cancelar</button></div>
  </form>
}
