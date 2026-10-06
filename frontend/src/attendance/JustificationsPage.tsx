import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { AttendanceBadge, attendanceLabels, type Justification } from './shared'
import JustificationDetail from './JustificationDetail'

export default function JustificationsPage() {
  const { user } = useAuth()
  const [result, setResult] = useState<Page<Justification> | null>(null), [selected, setSelected] = useState<number | null>(null)
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0), [filters, setFilters] = useState('')
  const [error, setError] = useState(''), [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    api<Page<Justification>>('/api/v1/absence-justifications?page=' + page + filters)
      .then(v => { if (active) { setResult(v); setError('') } }).catch(e => { if (active) setError(errorMessage(e)) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page, filters, revision])
  if (!user?.roles.some(r => ['ADMINISTRATOR', 'SECRETARY'].includes(r))) return <Message error>No tienes acceso a la revisión institucional.</Message>
  return <section className="space-y-5"><h1 className="text-2xl font-bold">Justificaciones</h1><Message error>{error}</Message>
    <form className="institutional-card grid gap-3 p-4 sm:grid-cols-2" onSubmit={e => {
      e.preventDefault(); const data = new FormData(e.currentTarget), params = new URLSearchParams()
      for (const [k, v] of data.entries()) if (v) params.set(k, String(v))
      setFilters('&' + params.toString()); setPage(1); setLoading(true); setRevision(v => v + 1)
    }}>
      <label>Estado<select className="institutional-field block w-full" name="status"><option value="">Todos</option>{['PENDING','IN_REVIEW','APPROVED','REJECTED'].map(s => <option key={s} value={s}>{attendanceLabels[s]}</option>)}</select></label>
      <StudentFilter />
      <label>Fecha de asistencia<input className="institutional-field block w-full" name="date" type="date" /></label>
      <button className="institutional-button self-end">Filtrar</button>
    </form>
    {loading && <p role="status">Cargando justificaciones…</p>}
    {!loading && result?.data.length === 0 && <p>No hay justificaciones con estos filtros.</p>}
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Estudiante','Fecha','Curso','Motivo','Estado','Acciones'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
      <tbody>{result?.data.map(j => <tr key={j.id} className="border-t border-beige" data-testid="justification-row">
        <td className="p-3">{j.student}</td><td className="p-3">{j.date}</td><td className="p-3">{j.course}</td><td className="max-w-xs break-words p-3">{j.reason}</td>
        <td className="p-3"><AttendanceBadge value={j.status} /></td><td className="p-3"><button className="institutional-button" onClick={() => setSelected(j.id)}>Ver justificación</button></td>
      </tr>)}</tbody></table></div><Pager page={result} onPage={p => { setPage(p); setLoading(true) }} />
    {selected && <JustificationDetail key={selected} id={selected} changed={() => setRevision(v => v + 1)} />}
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
    <select className="institutional-field w-full" name="student_id" value={selected?.id ?? ''} onChange={e => setSelected(result?.data.find(s => s.id === Number(e.target.value)) ?? null)}>
      <option value="">Todos los estudiantes</option>
      {selected && !result?.data.some(s => s.id === selected.id) && <option value={selected.id}>{selected.user?.name ?? 'Estudiante archivado'}</option>}
      {result?.data.map(s => <option key={s.id} value={s.id}>{s.user?.name ?? 'Estudiante archivado'}</option>)}
    </select><Message error>{error}</Message><Pager page={result} onPage={setPage} />
  </fieldset>
}
