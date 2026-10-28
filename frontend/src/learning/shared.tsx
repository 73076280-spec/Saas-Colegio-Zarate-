import StatusBadge from '../components/StatusBadge'
import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager } from '../enrollment/shared'
import type { Page } from '../enrollment/shared'

export type LearningKind = 'assignments' | 'submissions' | 'assessments' | 'scores'
export type LearningRecord = {
  id: number; title?: string; description?: string; instructions?: string; status: string
  course: { id: number; name: string }; course_unit_id?: number | null
  due_at?: string; max_score?: string | null; allow_late_submission?: boolean
  academic_period_id?: number; assessment_type_id?: number; evaluation_date?: string | null; weight?: string | null
  content?: string | null; original_filename?: string; submitted_at?: string; attempt?: number; feedback?: string
  score?: string; observations?: string
  student?: { id: number; name: string }; assignment?: { id: number; title: string }
  assessment?: { id: number; title: string }; period?: { id: number; name: string; grading_open: boolean }
  abilities: Record<string, boolean>
}
export type LearningPage = Page<LearningRecord> & { abilities?: Record<string, boolean> }
type SubmissionTiming = Pick<LearningRecord, 'due_at' | 'allow_late_submission'>
export function submissionPastDue(task?: SubmissionTiming, now = Date.now()) {
  const due = task?.due_at ? Date.parse(task.due_at) : NaN
  return Number.isFinite(due) && now > due
}
export function submissionDeadlineBlocked(task?: SubmissionTiming) {
  return submissionPastDue(task) && !task?.allow_late_submission
}
export function useSubmissionTiming(task?: SubmissionTiming) {
  const [now, setNow] = useState(Date.now)
  const due = task?.due_at
  useEffect(() => {
    if (!due || !Number.isFinite(Date.parse(due))) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [due])
  const pastDue = submissionPastDue(task, now)
  return { pastDue, blocked: pastDue && !task?.allow_late_submission }
}
export const learningLabels: Record<string, string> = { DRAFT: 'Borrador', PUBLISHED: 'Publicado', CLOSED: 'Cerrado', SUBMITTED: 'Entregada', LATE: 'Tardía', REVIEWED: 'Revisada', RETURNED: 'Devuelta' }
export function LearningStatus({ status }: { status: string }) { return <StatusBadge value={status}>{learningLabels[status] ?? status}</StatusBadge> }
type Option = { id?: number; student_id?: number; name?: string; title?: string; sequence?: number; grading_open?: boolean }
export function LearningSelect({ label, name, endpoint, value, onChange, optional = false }: {
  label: string; name: string; endpoint: string; value: string; onChange: (v: string) => void; optional?: boolean
}) {
  const [page, setPage] = useState(1), [result, setResult] = useState<Page<Option> | null>(null), [error, setError] = useState('')
  useEffect(() => {
    let active = true
    api<Page<Option>>(endpoint + '?page=' + page).then(r => { if (active) { setResult(r); setError('') } }).catch(e => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [endpoint, page])
  return <fieldset className="min-w-0 rounded-xl border border-beige p-3"><legend>{label}</legend>
    <select className="institutional-field w-full" name={name} value={value} required={!optional} onChange={e => onChange(e.target.value)}>
      <option value="">{optional ? 'Sin unidad' : 'Seleccionar'}</option>
      {value && !result?.data.some(o => String(o.id ?? o.student_id) === value) && <option value={value}>Selección actual #{value}</option>}
      {result?.data.map(o => <option key={o.id ?? o.student_id} value={o.id ?? o.student_id}>{o.name ?? o.title}{o.grading_open === false ? ' (notas cerradas)' : ''}</option>)}
    </select><Message error>{error}</Message><Pager page={result} onPage={setPage} />
  </fieldset>
}
export async function downloadSubmission(record: LearningRecord) {
  const response = await fetch('/api/v1/submissions/' + record.id + '/download', { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
  if (!response.ok) throw new Error('No se pudo descargar la entrega o ya no tienes acceso.')
  const url = URL.createObjectURL(await response.blob()), link = document.createElement('a')
  link.href = url; link.download = record.original_filename ?? 'entrega'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
