import { useState } from 'react'
import type { FormEvent } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { LearningSelect } from './shared'
import type { LearningRecord } from './shared'

function localDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}
export default function LearningForm({ course, kind, record, onSaved, onCancel }: {
  course: number; kind: 'assignments' | 'assessments'; record: LearningRecord | null; onSaved: () => void; onCancel: () => void
}) {
  const task = kind === 'assignments'
  const [title, setTitle] = useState(record?.title ?? ''), [description, setDescription] = useState(record?.description ?? '')
  const [instructions, setInstructions] = useState(record?.instructions ?? ''), [due, setDue] = useState(localDate(record?.due_at))
  const [late, setLate] = useState(record?.allow_late_submission ?? false), [unit, setUnit] = useState(String(record?.course_unit_id ?? ''))
  const [period, setPeriod] = useState(String(record?.academic_period_id ?? '')), [type, setType] = useState(String(record?.assessment_type_id ?? ''))
  const [max, setMax] = useState(record?.max_score ?? '20'), [weight, setWeight] = useState(record?.weight ?? ''), [date, setDate] = useState(record?.evaluation_date ?? '')
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError('')
    try {
      const body = task ? { title, description, instructions, due_at: new Date(due).toISOString(), allow_late_submission: late, course_unit_id: unit ? Number(unit) : null, max_score: max ? Number(max) : null } : {
        title, description, academic_period_id: Number(period), assessment_type_id: Number(type), max_score: Number(max), weight: weight ? Number(weight) : null, evaluation_date: date || null,
      }
      await api(record ? '/api/v1/' + kind + '/' + record.id : '/api/v1/courses/' + course + '/' + kind, record ? 'PATCH' : 'POST', body)
      onSaved()
    } catch (error) { setError(errorMessage(error)) } finally { setBusy(false) }
  }
  return <form className="institutional-card my-4 space-y-4" data-testid="learning-form" onSubmit={e => void save(e)}>
    <h3 className="text-lg font-semibold">{record ? 'Editar' : 'Crear'} {task ? 'tarea' : 'evaluación'}</h3>
    <label className="block space-y-2">Título<input className="institutional-field w-full" name="title" required maxLength={180} value={title} onChange={e => setTitle(e.target.value)} /></label>
    <label className="block space-y-2">Descripción<textarea className="institutional-field w-full" name="description" required={task} maxLength={20000} value={description} onChange={e => setDescription(e.target.value)} /></label>
    {task ? <>
      <LearningSelect label="Unidad" name="course_unit_id" endpoint={'/api/v1/courses/' + course + '/units'} value={unit} onChange={setUnit} optional />
      <label className="block space-y-2">Instrucciones<textarea className="institutional-field w-full" name="instructions" value={instructions} maxLength={20000} onChange={e => setInstructions(e.target.value)} /></label>
      <label className="block space-y-2">Fecha límite (hora local)<input className="institutional-field w-full" type="datetime-local" name="due_at" required value={due} onChange={e => setDue(e.target.value)} /></label>
      <label className="flex items-center gap-2"><input type="checkbox" name="allow_late_submission" checked={late} onChange={e => setLate(e.target.checked)} />Permitir entrega tardía</label>
    </> : <>
      <LearningSelect label="Periodo académico" name="academic_period_id" endpoint={'/api/v1/courses/' + course + '/assessment-periods'} value={period} onChange={setPeriod} />
      <LearningSelect label="Tipo de evaluación" name="assessment_type_id" endpoint={'/api/v1/courses/' + course + '/assessment-types'} value={type} onChange={setType} />
      <label className="block space-y-2">Fecha de evaluación<input className="institutional-field w-full" type="date" name="evaluation_date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <label className="block space-y-2">Peso opcional<input className="institutional-field w-full" type="number" name="weight" min={0} max={100} step="0.01" value={weight} onChange={e => setWeight(e.target.value)} /></label>
    </>}
    <label className="block space-y-2">Nota máxima (hasta 20)<input className="institutional-field w-full" type="number" name="max_score" required={!task} min="0.01" max={20} step="0.01" value={max} onChange={e => setMax(e.target.value)} /></label>
    <Message error>{error}</Message><div className="flex gap-3"><button className="institutional-button" disabled={busy}>Guardar</button><button type="button" className="institutional-button" disabled={busy} onClick={onCancel}>Cancelar</button></div>
  </form>
}
