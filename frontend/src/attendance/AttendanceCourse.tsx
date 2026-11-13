import EmptyState from '../components/EmptyState'
import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { AttendanceBadge, type Attendance, type Session } from './shared'

type Row = { student_id: number; student: string; can_record: boolean; record: Attendance | null }
type Draft = Record<number, { status: string; observations: string }>
type DraftState = { dirty: boolean; pending: boolean }
const discardWarning = 'Hay cambios de asistencia sin guardar. ¿Descartarlos y continuar?'
export default function AttendanceCourse({ course, closed }: { course: number; closed: boolean }) {
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const [result, setResult] = useState<(Page<Session> & { abilities: { create: boolean } }) | null>(null)
  const [selected, setSelected] = useState<Session | null>(null), [form, setForm] = useState(false)
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true)
  const [rosterState, setRosterState] = useState<DraftState>({ dirty: false, pending: false })
  function canLeave() { return !busy && !rosterState.pending && (!rosterState.dirty || window.confirm(discardWarning)) }
  function selectSession(session: Session) {
    if (selected?.id === session.id || !canLeave()) return
    setRosterState({ dirty: false, pending: true }); setSelected(session)
  }
  useEffect(() => {
    let active = true
    api<Page<Session> & { abilities: { create: boolean } }>('/api/v1/courses/' + course + '/attendance-sessions?page=' + page)
      .then(v => { if (active) { setResult(v); setError('') } }).catch(e => { if (active) setError(errorMessage(e)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [course, page, revision])
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canLeave()) return
    setBusy(true); setError('')
    const data = new FormData(e.currentTarget)
    try {
      const r = await api<{ data: Session }>('/api/v1/courses/' + course + '/attendance-sessions', 'POST', { date: data.get('date'), topic: data.get('topic') })
      setForm(false); setRosterState({ dirty: false, pending: true }); setSelected(r.data); setPage(1); setLoading(true); setRevision(v => v + 1)
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <section className="space-y-4" aria-label="Asistencia del curso">
    <h2 className="text-xl font-semibold">Asistencia</h2><Message error>{error}</Message>
    {loading && <p role="status">Cargando sesiones…</p>}
    {result?.abilities.create && !closed && <button className="institutional-button" disabled={busy || rosterState.pending} onClick={() => setForm(!form)}>Nueva asistencia</button>}
    {form && <form onSubmit={create} className="institutional-card space-y-4 p-5" data-testid="attendance-session-form">
      <label className="block">Fecha<input className="institutional-field block w-full" type="date" name="date" required /></label>
      <label className="block">Tema<input className="institutional-field block w-full" name="topic" maxLength={250} /></label>
      <button className="institutional-button" disabled={busy || rosterState.pending}>Crear sesión</button>
    </form>}
    {!loading && result?.data.length === 0 && <EmptyState>No hay sesiones de asistencia.</EmptyState>}
    <div className="grid gap-3 sm:grid-cols-2">{!loading && result?.data.map(s => <article key={s.id} className="institutional-card space-y-2 p-4" data-testid="attendance-session">
      <h3 className="font-semibold">{s.date} · {s.topic || 'Sin tema'}</h3><AttendanceBadge value={s.status} />
      <button className="institutional-button block" disabled={busy || rosterState.pending} onClick={() => selectSession(s)}>Abrir asistencia</button>
    </article>)}</div>
    <fieldset disabled={busy || rosterState.pending || loading} aria-label="Páginas de sesiones"><Pager page={result} onPage={p => { if (!busy && !rosterState.pending && !loading) { setLoading(true); setPage(p) } }} /></fieldset>
    {selected && <AttendanceRoster key={selected.id} session={selected} closed={closed || busy} onStateChange={setRosterState} onClose={s => { setSelected(s); setLoading(true); setRevision(v => v + 1) }} />}
  </section>
}
function AttendanceRoster({ session, closed, onClose, onStateChange }: { session: Session; closed: boolean; onClose: (s: Session) => void; onStateChange: (state: DraftState) => void }) {
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const [result, setResult] = useState<Page<Row> | null>(null), [draft, setDraft] = useState<Draft>({}), [baseline, setBaseline] = useState<Draft>({})
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true)
  const [readError, setReadError] = useState('')
  const writable = session.status === 'OPEN' && !closed && session.abilities.update
  const dirty = Object.entries(draft).some(([id, row]) => row.status !== baseline[Number(id)]?.status || row.observations !== baseline[Number(id)]?.observations)
  const pending = busy || loading
  const locked = pending || !!readError
  useEffect(() => { onStateChange({ dirty, pending }) }, [dirty, pending, onStateChange])
  useEffect(() => {
    if (!dirty && !busy) return
    function warn(event: BeforeUnloadEvent) { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty, busy])
  useEffect(() => {
    let active = true
    api<Page<Row>>('/api/v1/attendance-sessions/' + session.id + '/records?page=' + page).then(v => {
      if (active) {
        const loaded = Object.fromEntries(v.data.map(r => [r.student_id, { status: r.record?.status ?? '', observations: r.record?.observations ?? '' }]))
        setResult(v); setDraft(loaded); setBaseline(loaded); setReadError('')
      }
    }).catch(e => { if (active) setReadError(errorMessage(e)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [session.id, page, revision])
  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!writable || locked || !dirty) return
    setBusy(true); setError(''); setMessage('')
    const records = result!.data.filter(r => r.can_record && !r.record?.justification && draft[r.student_id]?.status).map(r => ({ student_id: r.student_id, ...draft[r.student_id] }))
    try { await api('/api/v1/attendance-sessions/' + session.id + '/records', 'POST', { records }); setBaseline(draft); setMessage('Asistencia guardada.'); setLoading(true); setRevision(v => v + 1) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  async function close() {
    if (!writable || locked || !session.abilities.close) return
    if (!window.confirm('¿Cerrar la sesión? Los cambios sin guardar se perderán y no podrás editar la asistencia.')) return
    setBusy(true); setError('')
    try { const r = await api<{ data: Session }>('/api/v1/attendance-sessions/' + session.id + '/close', 'POST'); onClose(r.data); setBaseline(draft); setMessage('Sesión cerrada.'); setLoading(true); setRevision(v => v + 1) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <section className="institutional-card space-y-4 p-5" data-testid="attendance-roster">
    <h3 className="text-lg font-semibold">Registro del {session.date}</h3><AttendanceBadge value={session.status} />
    <Message error>{error}</Message><Message>{message}</Message>
    <p role="status">{busy ? 'Procesando solicitud…' : loading ? 'Cargando estudiantes…' : dirty ? 'Cambios sin guardar.' : 'Sin cambios pendientes.'}</p>
    {readError && <><Message error>No se pudo actualizar el registro de esta sesión. {readError}</Message><button type="button" className="institutional-button" disabled={pending} onClick={() => { setReadError(''); setLoading(true); setRevision(v => v + 1) }}>Reintentar consulta de asistencia</button></>}
    {dirty && <p className="text-sm">El borrador solo permanece en esta pantalla. Guarda antes de cambiar de curso o pestaña. Recargar o salir puede descartarlo.</p>}
    {!loading && result?.data.length === 0 && <EmptyState>No hay estudiantes con matrícula aprobada ni registros previos.</EmptyState>}
    {result && <form onSubmit={save}><div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <thead><tr><th className="p-2">Estudiante</th><th className="p-2">Asistencia</th><th className="p-2">Observación</th></tr></thead>
      <tbody>{result?.data.map(r => <tr key={r.student_id} className="border-t border-beige"><td className="p-2">{r.student}</td>
        <td className="p-2">{writable && r.can_record && !r.record?.justification ? <select className="institutional-field" disabled={locked} aria-label={'Asistencia de ' + r.student} value={draft[r.student_id]?.status ?? ''} onChange={e => setDraft({ ...draft, [r.student_id]: { ...draft[r.student_id], status: e.target.value } })}>
          <option value="">Sin registrar</option><option value="PRESENT">Presente</option><option value="ABSENT">Falta</option><option value="LATE">Tardanza</option>
        </select> : <AttendanceBadge value={r.record?.status ?? 'Sin registrar'} />}</td>
        <td className="p-2"><input className="institutional-field w-full" aria-label={'Observación de ' + r.student} maxLength={2000} disabled={locked || !writable || !r.can_record || !!r.record?.justification} value={draft[r.student_id]?.observations ?? ''} onChange={e => setDraft({ ...draft, [r.student_id]: { ...draft[r.student_id], observations: e.target.value } })} /></td>
      </tr>)}</tbody></table></div>
      {writable && !!result?.data.length && <button className="institutional-button mt-4" disabled={locked || !dirty}>Guardar asistencia de esta página</button>}
    </form>}
    <fieldset disabled={locked} aria-label="Páginas de estudiantes"><Pager page={result} onPage={p => { if (!locked && (!dirty || window.confirm(discardWarning))) { setResult(null); setDraft({}); setBaseline({}); setMessage(''); setError(''); setLoading(true); setPage(p) } }} /></fieldset>
    {writable && session.abilities.close && <button className="institutional-button" disabled={locked} onClick={close}>Cerrar asistencia</button>}
  </section>
}
