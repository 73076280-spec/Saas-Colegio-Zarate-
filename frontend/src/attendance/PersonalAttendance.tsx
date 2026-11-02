import EmptyState from '../components/EmptyState'
import { useEffect, useState } from 'react'
import { api, ApiError, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { useAuth } from '../auth/AuthContext'
import { AttendanceBadge, type Attendance } from './shared'
import JustificationDetail from './JustificationDetail'

type Family = { guardian_id: number; student_id: number; student: { name: string } }
type QueryResult<T> = { key: string; result: Page<T> | null; error: string; denied: boolean }
export default function PersonalAttendance({ family = false }: { family?: boolean }) {
  const { user } = useAuth()
  const [familyPage, setFamilyPage] = useState(1), [familyRevision, setFamilyRevision] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [attendancePage, setAttendancePage] = useState({ endpoint: '', page: 1 }), [revision, setRevision] = useState(0)
  const [target, setTarget] = useState<Attendance | null>(null)
  const [detail, setDetail] = useState<number | null>(null), [busy, setBusy] = useState(false)
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [reason, setReason] = useState(''), [hasFile, setHasFile] = useState(false)
  const [detailState, setDetailState] = useState({ dirty: false, busy: false })
  const allowed = !!user?.roles.includes(family ? 'GUARDIAN' : 'STUDENT') && user.permissions.includes('attendance.view')
  const linksKey = familyPage + ':' + familyRevision
  const [linksResponse, setLinksResponse] = useState<QueryResult<Family> | null>(null)
  const linksCurrent = linksResponse?.key === linksKey ? linksResponse : null
  const links = linksCurrent?.result
  const selected = links?.data.find(link => link.student_id === selectedId) ?? links?.data[0]
  useEffect(() => {
    if (!family || !allowed) return
    let active = true
    api<Page<Family>>('/api/v1/profile/family?page=' + familyPage)
      .then(result => { if (active) setLinksResponse({ key: linksKey, result, error: '', denied: false }) })
      .catch(error => { if (active) setLinksResponse({ key: linksKey, result: null, error: errorMessage(error), denied: error instanceof ApiError && [403, 404].includes(error.status) }) })
    return () => { active = false }
  }, [family, familyPage, linksKey, allowed])
  const endpoint = family ? (selected ? '/api/v1/guardians/' + selected.guardian_id + '/students/' + selected.student_id + '/attendance' : '') : '/api/v1/my/attendance'
  const page = attendancePage.endpoint === endpoint ? attendancePage.page : 1
  const queryKey = endpoint + ':' + page + ':' + revision
  const [response, setResponse] = useState<QueryResult<Attendance> | null>(null)
  const current = response?.key === queryKey ? response : null
  const result = current?.result, loading = !!endpoint && !current
  function canChangeContext() {
    return !busy && !detailState.busy && (!(reason || hasFile || detailState.dirty) || window.confirm('Hay una justificación sin enviar. ¿Descartar los cambios y cambiar de consulta?'))
  }
  function clearContext() { setTarget(null); setDetail(null); setReason(''); setHasFile(false); setDetailState({ dirty: false, busy: false }); setError(''); setNotice('') }
  useEffect(() => {
    if (!endpoint || !allowed) return
    let active = true
    api<Page<Attendance>>(endpoint + '?page=' + page)
      .then(result => { if (active) setResponse({ key: queryKey, result, error: '', denied: false }) })
      .catch(error => {
        if (active) {
          const denied = error instanceof ApiError && [403, 404].includes(error.status)
          if (denied) { setTarget(null); setDetail(null); setReason(''); setHasFile(false); setDetailState({ dirty: false, busy: false }) }
          setResponse({ key: queryKey, result: null, error: errorMessage(error), denied })
        }
      })
    return () => { active = false }
  }, [endpoint, page, queryKey, allowed])
  async function justify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy || !target || !target.can_justify || !family) return
    setBusy(true); setError(''); setNotice('')
    const data = new FormData(e.currentTarget)
    const file = data.get('file')
    if (file instanceof File && !file.name) data.delete('file')
    try { await api('/api/v1/attendance-records/' + target.id + '/justifications', 'POST', data); setTarget(null); setReason(''); setHasFile(false); setNotice('Justificación enviada.'); setRevision(v => v + 1) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  if (!allowed) return <Message error>No tienes acceso a esta sección.</Message>
  return <section className="space-y-5">
    <h1 className="text-2xl font-bold">{family ? 'Asistencia de mis estudiantes' : 'Mi asistencia'}</h1>
    <Message error>{error}</Message><Message>{notice}</Message>
    {family && <div className="institutional-card p-4">
      {!linksCurrent && <p role="status">Cargando estudiantes vinculados… Página {familyPage}.</p>}
      {linksCurrent?.error && <><Message error>No se pudieron consultar los estudiantes vinculados. {linksCurrent.error}</Message><button type="button" className="institutional-button" onClick={() => setFamilyRevision(v => v + 1)}>Reintentar consulta de estudiantes</button></>}
      <label>Estudiante<select className="institutional-field block w-full" disabled={busy || detailState.busy || !links} value={selected?.student_id ?? ''} onChange={e => {
        if (Number(e.target.value) !== selected?.student_id && canChangeContext()) { clearContext(); setSelectedId(Number(e.target.value)); setAttendancePage({ endpoint: '', page: 1 }); setRevision(v => v + 1) }
      }}>
      {links?.data.map(l => <option key={l.student_id} value={l.student_id}>{l.student.name}</option>)}
    </select></label>{links && <fieldset disabled={busy || detailState.busy} aria-label="Páginas de estudiantes vinculados"><Pager page={links} onPage={p => { if (canChangeContext()) { clearContext(); setFamilyPage(p); setSelectedId(null); setAttendancePage({ endpoint: '', page: 1 }); setRevision(v => v + 1) } }} /></fieldset>}
      {links?.data.length === 0 && <p>No tienes estudiantes vinculados.</p>}
    </div>}
    {(!family || selected) && <p aria-label="Contexto de consulta de asistencia">Asistencia de {family ? selected?.student.name : user?.name} · Página {page}.</p>}
    {loading && <p role="status">Cargando asistencia… Página {page}.</p>}
    {current?.error && <><Message error>No se pudo consultar la asistencia. {current.error}</Message><button type="button" className="institutional-button" disabled={busy || detailState.busy} onClick={() => setRevision(v => v + 1)}>Reintentar consulta de asistencia</button></>}
    {!loading && result?.data.length === 0 && <EmptyState>No hay registros de asistencia.</EmptyState>}
    <div className="space-y-3">{result?.data.map(r => <article key={r.id} data-testid="personal-attendance" className="institutional-card space-y-2 p-5">
      <h2 className="font-semibold">{r.date} · {r.course}</h2><p>{r.student}</p><AttendanceBadge value={r.status} /><p className="break-words">{r.observations || 'Sin observación'}</p>
      {r.justification && <div>Justificación: <AttendanceBadge value={r.justification.status} />{family && <button className="institutional-button ml-2" disabled={busy || detailState.busy} onClick={() => { if (canChangeContext()) { clearContext(); setDetail(r.justification!.id) } }}>Ver justificación</button>}</div>}
      {family && r.can_justify && <button className="institutional-button" disabled={busy || detailState.busy} onClick={() => { if (target?.id !== r.id && canChangeContext()) { clearContext(); setTarget(r) } }}>Justificar</button>}
    </article>)}</div>{result && <fieldset disabled={busy || detailState.busy} aria-label="Páginas de asistencia"><Pager page={result} onPage={p => { if (canChangeContext()) { clearContext(); setAttendancePage({ endpoint, page: p }); setRevision(v => v + 1) } }} /></fieldset>}
    {family && target && target.student_id === selected?.student_id && <form data-testid="justification-form" onSubmit={justify} className="institutional-card space-y-4 p-5">
      <h2 className="font-semibold">Justificar falta del {target.date} · {target.student}</h2>
      <label className="block">Motivo<textarea className="institutional-field block w-full" name="reason" disabled={busy} required maxLength={5000} value={reason} onChange={e => setReason(e.target.value)} /></label>
      <label className="block">Archivo opcional<input className="institutional-field block w-full" name="file" type="file" disabled={busy} onChange={e => setHasFile(!!e.target.files?.length)} accept=".pdf,.txt,.jpg,.jpeg,.png,.gif,.webp,.doc,.xls,.ppt,.docx,.xlsx,.pptx" /></label>
      <p className="text-sm text-brown-medium">Máximo 2 MiB. El archivo será privado y accesible para la revisión.</p>
      <button className="institutional-button" disabled={busy}>Enviar justificación</button> <button className="institutional-button" type="button" disabled={busy} onClick={clearContext}>Cancelar</button>
    </form>}
    {family && selected && detail && <JustificationDetail key={detail} id={detail} onStateChange={setDetailState} />}
  </section>
}
