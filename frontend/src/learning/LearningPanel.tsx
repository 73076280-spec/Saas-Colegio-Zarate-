import EmptyState from '../components/EmptyState'
import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message, PageHeading } from '../components/Form'
import { Pager } from '../enrollment/shared'
import type { Page } from '../enrollment/shared'
import LearningForm from './LearningForm'
import SubmissionForm from './SubmissionForm'
import ScoreForm from './ScoreForm'
import { downloadSubmission, LearningStatus } from './shared'
import type { LearningKind, LearningPage, LearningRecord } from './shared'

const titles: Record<LearningKind, string> = { assignments: 'Tareas', submissions: 'Entregas', assessments: 'Evaluaciones', scores: 'Notas' }
type History = { id: number; old_score: string | null; new_score: string; reason: string | null; changed_by: number; created_at: string }
function ScoreHistory({ id }: { id: number }) {
  const [page, setPage] = useState(1), [result, setResult] = useState<Page<History> | null>(null), [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    api<Page<History>>('/api/v1/scores/' + id + '/history?page=' + page).then(r => { if (alive) setResult(r) }).catch(e => { if (alive) setError(errorMessage(e)) })
    return () => { alive = false }
  }, [id, page])
  return <section className="institutional-card my-4"><h3 className="font-semibold">Historial de nota</h3><Message error>{error}</Message>{!result && !error && <p role="status">Cargando historial…</p>}
    {result?.data.map(h => <p key={h.id} className="my-3 break-words">{h.old_score ?? 'Sin nota'} → {h.new_score} · {h.reason ?? 'Registro inicial'} · Usuario #{h.changed_by} · {new Date(h.created_at).toLocaleString('es-PE')}</p>)}<Pager page={result} onPage={setPage} /></section>
}
export default function LearningPanel({ kind, course, parent, gradeMode = false }: {
  kind: LearningKind; course?: number; parent?: LearningRecord; gradeMode?: boolean
}) {
  const personal = !course && !parent
  const endpoint = parent ? '/api/v1/' + (kind === 'submissions' ? 'assignments' : 'assessments') + '/' + parent.id + '/' + kind : course ? '/api/v1/courses/' + course + '/' + kind : '/api/v1/my/' + kind
  const [result, setResult] = useState<LearningPage | null>(null), [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false)
  const [form, setForm] = useState<{ mode: 'content' | 'submission' | 'review' | 'score'; record: LearningRecord | null } | null>(null)
  const [child, setChild] = useState<LearningRecord | null>(null), [history, setHistory] = useState<number | null>(null)
  useEffect(() => {
    let alive = true
    api<LearningPage>(endpoint + '?page=' + page).then(r => { if (alive) { setResult(r); setError('') } })
      .catch(e => { if (alive) { setError(errorMessage(e)); setResult(null) } }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [endpoint, page, revision])
  function reload() { setLoading(true); setRevision(v => v + 1) }
  function saved() { setForm(null); setNotice('Registro guardado.'); reload() }
  async function transition(record: LearningRecord, operation: 'publish' | 'close') {
    if (!window.confirm((operation === 'publish' ? '¿Publicar ' : '¿Cerrar ') + record.title + '?')) return
    setBusy(true); setError(''); setNotice('')
    try { await api('/api/v1/' + kind + '/' + record.id + '/' + operation, 'POST', {}); setChild(null); reload() }
    catch (error) { setError(errorMessage(error)) } finally { setBusy(false) }
  }
  async function download(record: LearningRecord) {
    setBusy(true); setError('')
    try { await downloadSubmission(record) } catch (error) { setError(error instanceof Error ? error.message : errorMessage(error)) } finally { setBusy(false) }
  }
  const gradingOpen = parent?.status === 'PUBLISHED' && parent?.period?.grading_open
  return <section className="my-4 space-y-4" data-testid={'learning-' + kind}>
    <PageHeading title={personal ? 'Mis ' + titles[kind].toLowerCase() : gradeMode ? 'Calificaciones' : titles[kind]} description={parent?.title ?? 'Seguimiento académico del curso.'} />
    <Message error>{error}</Message><Message>{notice}</Message>
    {error && <button className="institutional-button" onClick={reload}>Volver a intentar</button>}
    {!gradeMode && course && result?.abilities?.create && (kind === 'assignments' || kind === 'assessments') && <button className="institutional-button" onClick={() => setForm({ mode: 'content', record: null })}>{kind === 'assignments' ? 'Crear tarea' : 'Crear evaluación'}</button>}
    {kind === 'submissions' && parent?.abilities.submit && result && (!result.data.length || result.data[0]?.status === 'RETURNED') && <button className="institutional-button" onClick={() => setForm({ mode: 'submission', record: null })}>Entregar tarea</button>}
    {kind === 'scores' && result?.abilities?.create && <>{gradingOpen ? <button className="institutional-button" onClick={() => setForm({ mode: 'score', record: null })}>Registrar nota</button> : <p role="status">La evaluación o su periodo no admite cambios de notas.</p>}</>}
    {form?.mode === 'content' && course && (kind === 'assignments' || kind === 'assessments') && <LearningForm key={form.record?.id ?? 'new'} course={course} kind={kind} record={form.record} onSaved={saved} onCancel={() => setForm(null)} />}
    {(form?.mode === 'submission' || form?.mode === 'review') && <SubmissionForm key={form.record?.id ?? 'new'} assignment={parent?.id ?? form.record?.assignment?.id ?? 0} record={form.record} review={form.mode === 'review'} onSaved={saved} onCancel={() => setForm(null)} />}
    {form?.mode === 'score' && parent && <ScoreForm key={form.record?.id ?? 'new'} assessment={parent} record={form.record} onSaved={saved} onCancel={() => setForm(null)} />}
    {loading && <p role="status">Cargando registros…</p>}
    {!loading && result?.data.length === 0 && <EmptyState>No hay registros disponibles.</EmptyState>}
    {kind === 'scores' ? <div className="institutional-card overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Estudiante', 'Curso / Periodo', 'Evaluación', 'Nota', 'Observación', 'Acción'].map(t => <th key={t} className="p-3">{t}</th>)}</tr></thead><tbody>{result?.data.map(r => <tr key={r.id} className="border-t border-beige" data-testid="score-row"><td className="p-3">{r.student?.name}</td><td className="p-3">{r.course.name} / {r.period?.name}</td><td className="p-3">{r.assessment?.title}</td><td className="p-3 font-semibold">{r.score}</td><td className="p-3 whitespace-pre-wrap">{r.observations}</td><td className="space-y-2 p-3">{r.abilities.update && gradingOpen && <button className="institutional-button" onClick={() => setForm({ mode: 'score', record: r })}>Modificar nota</button>}<button className="institutional-button" onClick={() => setHistory(r.id)}>Historial</button></td></tr>)}</tbody></table></div> :
      <div className="grid gap-4">{result?.data.map(r => <article key={r.id} className="institutional-card min-w-0 space-y-3" data-testid="learning-card">
        <h3 className="break-words text-lg font-semibold">{r.title ?? r.assignment?.title}</h3><LearningStatus status={r.status} /><p className="text-sm text-brown-medium">{r.course.name}{r.period ? ' · ' + r.period.name : ''}</p>
        {r.due_at && <p>Fecha límite: {new Date(r.due_at).toLocaleString('es-PE')} · {r.allow_late_submission ? 'Admite entregas tardías' : 'Sin entregas tardías'}</p>}
        {r.description && <p className="whitespace-pre-wrap break-words">{r.description}</p>}
        {r.instructions && <p className="whitespace-pre-wrap break-words">Instrucciones: {r.instructions}</p>}
        {kind === 'submissions' && <><p>{r.student?.name} · Intento {r.attempt} · {r.submitted_at && new Date(r.submitted_at).toLocaleString('es-PE')}</p><p className="whitespace-pre-wrap break-words">{r.content}</p>{r.feedback && <p className="rounded-xl bg-beige p-3 whitespace-pre-wrap">Feedback: {r.feedback}</p>}{r.original_filename && <button className="institutional-button" disabled={busy} onClick={() => void download(r)}>Descargar entrega</button>}</>}
        <div className="flex flex-wrap gap-2">
          {!gradeMode && (kind === 'assignments' || kind === 'assessments') && r.status !== 'CLOSED' && <>
            {r.abilities.update && <button className="institutional-button" onClick={() => setForm({ mode: 'content', record: r })}>Editar</button>}
            {r.abilities.publish && r.status === 'DRAFT' && <button className="institutional-button" disabled={busy} onClick={() => void transition(r, 'publish')}>Publicar</button>}
            {r.abilities.close && <button className="institutional-button" disabled={busy} onClick={() => void transition(r, 'close')}>Cerrar</button>}
          </>}
          {kind === 'assignments' && <button className="institutional-button" disabled={busy || loading} onClick={() => setChild(r)}>Ver entregas</button>}
          {kind === 'assessments' && <button className="institutional-button" disabled={busy || loading} onClick={() => setChild(r)}>Ver notas</button>}
          {kind === 'submissions' && ['SUBMITTED', 'LATE'].includes(r.status) && <>
            {r.abilities.update && <button className="institutional-button" onClick={() => setForm({ mode: 'submission', record: r })}>Editar entrega</button>}
            {r.abilities.review && <button className="institutional-button" onClick={() => setForm({ mode: 'review', record: r })}>Revisar entrega</button>}
          </>}
        </div>
      </article>)}</div>}
    <Pager page={result} onPage={p => { setPage(p); setLoading(true) }} />
    {history && <><button className="institutional-button" onClick={() => setHistory(null)}>Ocultar historial</button><ScoreHistory key={history} id={history} /></>}
    {child && <div className="rounded-xl border border-beige bg-background-soft p-4"><button className="institutional-button" onClick={() => setChild(null)}>Cerrar detalle</button><LearningPanel key={child.id} kind={kind === 'assignments' ? 'submissions' : 'scores'} parent={child} /></div>}
  </section>
}
