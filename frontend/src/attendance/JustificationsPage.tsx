import EmptyState from '../components/EmptyState'
import { useEffect, useState } from 'react'
import { api, ApiError, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { AttendanceBadge, attendanceLabels, type Justification } from './shared'
import JustificationDetail from './JustificationDetail'

export default function JustificationsPage() {
  const { user } = useAuth()
  const [selected, setSelected] = useState<number | null>(null)
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0), [filters, setFilters] = useState('')
  const [detailState, setDetailState] = useState({ dirty: false, busy: false })
  const authorized = !!user?.roles.some(r => ['ADMINISTRATOR', 'SECRETARY'].includes(r)) && user.permissions.includes('justifications.view')
  const endpoint = '/api/v1/absence-justifications?page=' + page + filters
  const queryKey = endpoint + ':' + revision
  const [response, setResponse] = useState<{ key: string; result: Page<Justification> | null; error: string; denied: boolean } | null>(null)
  const current = response?.key === queryKey ? response : null
  const result = current?.result, error = current?.error, loading = !current
  function canChangeContext() { return !detailState.busy && (!detailState.dirty || window.confirm('Hay un comentario sin enviar. ¿Descartarlo y cambiar de consulta?')) }
  function clearDetail() { setSelected(null); setDetailState({ dirty: false, busy: false }) }
  useEffect(() => {
    if (!authorized) return
    let active = true
    api<Page<Justification>>(endpoint)
      .then(result => { if (active) setResponse({ key: queryKey, result, error: '', denied: false }) })
      .catch(error => {
        if (active) {
          const denied = error instanceof ApiError && [403, 404].includes(error.status)
          if (denied) { setSelected(null); setDetailState({ dirty: false, busy: false }) }
          setResponse({ key: queryKey, result: null, error: errorMessage(error), denied })
        }
      })
    return () => { active = false }
  }, [authorized, endpoint, queryKey])
  if (!authorized) return <Message error>No tienes acceso a la revisión institucional.</Message>
  return <section className="space-y-5"><h1 className="text-2xl font-bold">Justificaciones</h1><Message error>{error && <>No se pudo consultar las justificaciones. {error}</>}</Message>
    {error && <button type="button" className="institutional-button" disabled={detailState.busy} onClick={() => setRevision(v => v + 1)}>Reintentar consulta de justificaciones</button>}
    <form className="institutional-card grid gap-3 p-4 sm:grid-cols-2" onSubmit={e => {
      e.preventDefault()
      if (!canChangeContext()) return
      const data = new FormData(e.currentTarget), params = new URLSearchParams()
      for (const [k, v] of data.entries()) if (v) params.set(k, String(v))
      clearDetail(); setFilters('&' + params.toString()); setPage(1); setRevision(v => v + 1)
    }}>
      <label>Estado<select className="institutional-field block w-full" name="status"><option value="">Todos</option>{['PENDING','IN_REVIEW','APPROVED','REJECTED'].map(s => <option key={s} value={s}>{attendanceLabels[s]}</option>)}</select></label>
      <StudentFilter />
      <label>Fecha de asistencia<input className="institutional-field block w-full" name="date" type="date" /></label>
      <button className="institutional-button self-end" disabled={detailState.busy}>Filtrar</button>
    </form>
    {loading && <p role="status">Cargando justificaciones… Página {page}.</p>}
    {!loading && result?.data.length === 0 && <EmptyState>No hay justificaciones con estos filtros.</EmptyState>}
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Estudiante','Fecha','Curso','Motivo','Estado','Acciones'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
      <tbody>{result?.data.map(j => <tr key={j.id} className="border-t border-beige" data-testid="justification-row">
        <td className="p-3">{j.student}</td><td className="p-3">{j.date}</td><td className="p-3">{j.course}</td><td className="max-w-xs break-words p-3">{j.reason}</td>
        <td className="p-3"><AttendanceBadge value={j.status} /></td><td className="p-3"><button className="institutional-button" disabled={detailState.busy} onClick={() => { if (selected !== j.id && canChangeContext()) { clearDetail(); setSelected(j.id) } }}>Ver justificación</button></td>
      </tr>)}</tbody></table></div>{result && <fieldset disabled={detailState.busy} aria-label="Páginas de justificaciones"><Pager page={result} onPage={p => { if (canChangeContext()) { clearDetail(); setPage(p) } }} /></fieldset>}
    {selected && !current?.denied && <JustificationDetail key={selected} id={selected} onStateChange={setDetailState} changed={() => setRevision(v => v + 1)} />}
  </section>
}

type StudentOption = { id: number; user: { name: string } | null }
function StudentFilter() {
  const [search, setSearch] = useState(''), [page, setPage] = useState(1)
  const [result, setResult] = useState<Page<StudentOption> | null>(null), [selected, setSelected] = useState<StudentOption | null>(null), [error, setError] = useState('')
  useEffect(() => {
    let active = true
    const timer = setTimeout(() => {
      api<Page<StudentOption>>('/api/v1/students?search=' + encodeURIComponent(search) + '&page=' + page)
        .then(v => { if (active) { setResult(v); setError('') } }).catch(e => { if (active) setError(errorMessage(e)) })
    }, 200)
    return () => { active = false; clearTimeout(timer) }
  }, [search, page])
  return <fieldset className="min-w-0 rounded-xl border border-beige p-3"><legend>Estudiante</legend>
    <input className="institutional-field mb-2 w-full" aria-label="Buscar estudiante" placeholder="Buscar por nombre o código" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
    <select className="institutional-field w-full" aria-label="Estudiante para filtrar justificaciones" name="student_id" value={selected?.id ?? ''} onChange={e => setSelected(result?.data.find(s => s.id === Number(e.target.value)) ?? null)}>
      <option value="">Todos los estudiantes</option>
      {selected && !result?.data.some(s => s.id === selected.id) && <option value={selected.id}>{selected.user?.name ?? 'Estudiante archivado'}</option>}
      {result?.data.map(s => <option key={s.id} value={s.id}>{s.user?.name ?? 'Estudiante archivado'}</option>)}
    </select><Message error>{error}</Message><Pager page={result} onPage={setPage} />
  </fieldset>
}
