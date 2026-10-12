import EmptyState from '../components/EmptyState'
import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { useAuth } from '../auth/AuthContext'
import { AttendanceBadge, type Attendance } from './shared'
import JustificationDetail from './JustificationDetail'

type Family = { guardian_id: number; student_id: number; student: { name: string } }
export default function PersonalAttendance({ family = false }: { family?: boolean }) {
  const { user } = useAuth()
  const [links, setLinks] = useState<Page<Family> | null>(null), [familyPage, setFamilyPage] = useState(1)
  const [selected, setSelected] = useState<Family | null>(null)
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const [result, setResult] = useState<Page<Attendance> | null>(null), [target, setTarget] = useState<Attendance | null>(null)
  const [detail, setDetail] = useState<number | null>(null), [busy, setBusy] = useState(false)
  const [error, setError] = useState(''), [loading, setLoading] = useState(true)
  const allowed = user?.roles.includes(family ? 'GUARDIAN' : 'STUDENT')
  useEffect(() => {
    if (!family || !allowed) return
    let active = true
    api<Page<Family>>('/api/v1/profile/family?page=' + familyPage).then(v => { if (active) { setLinks(v); setSelected(v.data[0] ?? null); setLoading(false) } })
      .catch(e => { if (active) { setError(errorMessage(e)); setLoading(false) } })
    return () => { active = false }
  }, [family, familyPage, allowed])
  const endpoint = family ? (selected ? '/api/v1/guardians/' + selected.guardian_id + '/students/' + selected.student_id + '/attendance' : '') : '/api/v1/my/attendance'
  useEffect(() => {
    if (!endpoint || !allowed) return
    let active = true
    api<Page<Attendance>>(endpoint + '?page=' + page).then(v => { if (active) { setResult(v); setError('') } })
      .catch(e => { if (active) setError(errorMessage(e)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [endpoint, page, revision, allowed])
  async function justify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('')
    const data = new FormData(e.currentTarget)
    const file = data.get('file')
    if (file instanceof File && !file.name) data.delete('file')
    try { await api('/api/v1/attendance-records/' + target!.id + '/justifications', 'POST', data); setTarget(null); setRevision(v => v + 1) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  if (!allowed) return <Message error>No tienes acceso a esta sección.</Message>
  return <section className="space-y-5">
    <h1 className="text-2xl font-bold">{family ? 'Asistencia de mis estudiantes' : 'Mi asistencia'}</h1>
    <Message error>{error}</Message>
    {family && <div className="institutional-card p-4"><label>Estudiante<select className="institutional-field block w-full" value={selected?.student_id ?? ''} onChange={e => { setSelected(links?.data.find(l => l.student_id === Number(e.target.value)) ?? null); setPage(1); setTarget(null); setDetail(null); setResult(null); setLoading(true) }}>
      {links?.data.map(l => <option key={l.student_id} value={l.student_id}>{l.student.name}</option>)}
    </select></label><Pager page={links} onPage={p => { setFamilyPage(p); setResult(null); setSelected(null); setTarget(null); setDetail(null); setPage(1); setLoading(true) }} />
      {links?.data.length === 0 && <p>No tienes estudiantes vinculados.</p>}
    </div>}
    {loading && <p role="status">Cargando asistencia…</p>}
    {!loading && result?.data.length === 0 && <EmptyState>No hay registros de asistencia.</EmptyState>}
    <div className="space-y-3">{result?.data.map(r => <article key={r.id} data-testid="personal-attendance" className="institutional-card space-y-2 p-5">
      <h2 className="font-semibold">{r.date} · {r.course}</h2><p>{r.student}</p><AttendanceBadge value={r.status} /><p className="break-words">{r.observations || 'Sin observación'}</p>
      {r.justification && <div>Justificación: <AttendanceBadge value={r.justification.status} />{family && <button className="institutional-button ml-2" onClick={() => setDetail(r.justification!.id)}>Ver justificación</button>}</div>}
      {family && r.can_justify && <button className="institutional-button" onClick={() => { setTarget(r); setDetail(null) }}>Justificar</button>}
    </article>)}</div><Pager page={result} onPage={p => { setPage(p); setLoading(true) }} />
    {target && <form data-testid="justification-form" onSubmit={justify} className="institutional-card space-y-4 p-5">
      <h2 className="font-semibold">Justificar falta del {target.date}</h2>
      <label className="block">Motivo<textarea className="institutional-field block w-full" name="reason" required maxLength={5000} /></label>
      <label className="block">Archivo opcional<input className="institutional-field block w-full" name="file" type="file" accept=".pdf,.txt,.jpg,.jpeg,.png,.gif,.webp,.doc,.xls,.ppt,.docx,.xlsx,.pptx" /></label>
      <p className="text-sm text-brown-medium">Máximo 2 MiB. El archivo será privado y accesible para la revisión.</p>
      <button className="institutional-button" disabled={busy}>Enviar justificación</button> <button className="institutional-button" type="button" disabled={busy} onClick={() => setTarget(null)}>Cancelar</button>
    </form>}
    {detail && <JustificationDetail key={detail} id={detail} />}
  </section>
}
