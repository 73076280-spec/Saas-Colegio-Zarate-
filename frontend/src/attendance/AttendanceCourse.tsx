import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { AttendanceBadge, type Attendance, type Session } from './shared'

type Row = { student_id: number; student: string; can_record: boolean; record: Attendance | null }
export default function AttendanceCourse({ course, closed }: { course: number; closed: boolean }) {
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const [result, setResult] = useState<(Page<Session> & { abilities: { create: boolean } }) | null>(null)
  const [selected, setSelected] = useState<Session | null>(null), [form, setForm] = useState(false)
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    api<Page<Session> & { abilities: { create: boolean } }>('/api/v1/courses/' + course + '/attendance-sessions?page=' + page)
      .then(v => { if (active) { setResult(v); setError('') } }).catch(e => { if (active) setError(errorMessage(e)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [course, page, revision])
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('')
    const data = new FormData(e.currentTarget)
    try {
      const r = await api<{ data: Session }>('/api/v1/courses/' + course + '/attendance-sessions', 'POST', { date: data.get('date'), topic: data.get('topic') })
      setForm(false); setSelected(r.data); setPage(1); setRevision(v => v + 1)
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <section className="space-y-4" aria-label="Asistencia del curso">
    <h2 className="text-xl font-semibold">Asistencia</h2><Message error>{error}</Message>
    {loading && <p role="status">Cargando sesiones…</p>}
    {result?.abilities.create && !closed && <button className="institutional-button" onClick={() => setForm(!form)}>Nueva asistencia</button>}
    {form && <form onSubmit={create} className="institutional-card space-y-4 p-5" data-testid="attendance-session-form">
      <label className="block">Fecha<input className="institutional-field block w-full" type="date" name="date" required /></label>
      <label className="block">Tema<input className="institutional-field block w-full" name="topic" maxLength={250} /></label>
      <button className="institutional-button" disabled={busy}>Crear sesión</button>
    </form>}
    {!loading && result?.data.length === 0 && <p>No hay sesiones de asistencia.</p>}
    <div className="grid gap-3 sm:grid-cols-2">{result?.data.map(s => <article key={s.id} className="institutional-card space-y-2 p-4" data-testid="attendance-session">
      <h3 className="font-semibold">{s.date} · {s.topic || 'Sin tema'}</h3><AttendanceBadge value={s.status} />
      <button className="institutional-button block" onClick={() => setSelected(s)}>Abrir asistencia</button>
    </article>)}</div>
    <Pager page={result} onPage={p => { setLoading(true); setPage(p) }} />
    {selected && <AttendanceRoster key={selected.id} session={selected} closed={closed} onClose={s => { setSelected(s); setRevision(v => v + 1) }} />}
  </section>
}
function AttendanceRoster({ session, closed, onClose }: { session: Session; closed: boolean; onClose: (s: Session) => void }) {
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const [result, setResult] = useState<Page<Row> | null>(null), [draft, setDraft] = useState<Record<number, { status: string; observations: string }>>({})
  const [error, setError] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true)
  const writable = session.status === 'OPEN' && !closed && session.abilities.update
  useEffect(() => {
    let active = true
    api<Page<Row>>('/api/v1/attendance-sessions/' + session.id + '/records?page=' + page).then(v => {
      if (active) { setResult(v); setDraft(Object.fromEntries(v.data.map(r => [r.student_id, { status: r.record?.status ?? '', observations: r.record?.observations ?? '' }]))); setError('') }
    }).catch(e => { if (active) setError(errorMessage(e)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [session.id, page, revision])
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('')
    const records = result!.data.filter(r => r.can_record && !r.record?.justification && draft[r.student_id]?.status).map(r => ({ student_id: r.student_id, ...draft[r.student_id] }))
    try { await api('/api/v1/attendance-sessions/' + session.id + '/records', 'POST', { records }); setMessage('Asistencia guardada.'); setRevision(v => v + 1) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  async function close() {
    if (!window.confirm('¿Cerrar la sesión? Los cambios sin guardar se perderán y no podrás editar la asistencia.')) return
    setBusy(true); setError('')
    try { const r = await api<{ data: Session }>('/api/v1/attendance-sessions/' + session.id + '/close', 'POST'); onClose(r.data); setMessage('Sesión cerrada.') }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <section className="institutional-card space-y-4 p-5" data-testid="attendance-roster">
    <h3 className="text-lg font-semibold">Registro del {session.date}</h3><AttendanceBadge value={session.status} />
    <Message error>{error}</Message><Message>{message}</Message>{loading && <p role="status">Cargando estudiantes…</p>}
    {!loading && result?.data.length === 0 && <p>No hay estudiantes con matrícula aprobada ni registros previos.</p>}
    {!loading && <form onSubmit={save}><div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <thead><tr><th className="p-2">Estudiante</th><th className="p-2">Asistencia</th><th className="p-2">Observación</th></tr></thead>
      <tbody>{result?.data.map(r => <tr key={r.student_id} className="border-t border-beige"><td className="p-2">{r.student}</td>
        <td className="p-2">{writable && r.can_record && !r.record?.justification ? <select className="institutional-field" aria-label={'Asistencia de ' + r.student} value={draft[r.student_id]?.status ?? ''} onChange={e => setDraft({ ...draft, [r.student_id]: { ...draft[r.student_id], status: e.target.value } })}>
          <option value="">Sin registrar</option><option value="PRESENT">Presente</option><option value="ABSENT">Falta</option><option value="LATE">Tardanza</option>
        </select> : <AttendanceBadge value={r.record?.status ?? 'Sin registrar'} />}</td>
        <td className="p-2"><input className="institutional-field w-full" aria-label={'Observación de ' + r.student} maxLength={2000} disabled={!writable || !r.can_record || !!r.record?.justification} value={draft[r.student_id]?.observations ?? ''} onChange={e => setDraft({ ...draft, [r.student_id]: { ...draft[r.student_id], observations: e.target.value } })} /></td>
      </tr>)}</tbody></table></div>
      {writable && !!result?.data.length && <button className="institutional-button mt-4" disabled={busy}>Guardar asistencia de esta página</button>}
    </form>}
    <Pager page={result} onPage={p => { if (window.confirm('Guarda los cambios antes de cambiar de página. ¿Continuar?')) { setLoading(true); setPage(p) } }} />
    {writable && session.abilities.close && <button className="institutional-button" disabled={busy || loading} onClick={close}>Cerrar asistencia</button>}
  </section>
}
