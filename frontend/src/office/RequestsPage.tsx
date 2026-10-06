import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Message } from '../components/Form'
import { Pager } from '../enrollment/shared'
import { OfficeBadge, OfficeSelect, dateLabel, useOffice, type OfficePage } from './shared'
import RequestDetail from './RequestDetail'

export default function RequestsPage({ personal = false }: { personal?: boolean }) {
  const [params] = useSearchParams()
  return <RequestsContent key={params.toString()} personal={personal} />
}
function RequestsContent({ personal }: { personal: boolean }) {
  const { user } = useAuth(), [params] = useSearchParams()
  const [selected, setSelected] = useState<number | null>(Number(params.get('request')) || null)
  const [page, setPage] = useState(1), [revision, setRevision] = useState(0), [filters, setFilters] = useState('')
  const [form, setForm] = useState(false), [type, setType] = useState(''), [student, setStudent] = useState('')
  const [filterType, setFilterType] = useState(''), [filterStudent, setFilterStudent] = useState('')
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const { data, error: loadError, loading } = useOffice<OfficePage>('/api/v1/' + (personal ? 'my/requests' : 'academic-requests') + '?page=' + page + filters, revision)
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('')
    const values = new FormData(e.currentTarget)
    try {
      const result = await api<{ data: { id: number } }>('/api/v1/academic-requests', 'POST', { request_type_id: Number(type), subject: values.get('subject'), description: values.get('description'), ...(student ? { student_id: Number(student) } : {}) })
      setSelected(result.data.id); setForm(false); setRevision(v => v + 1)
    } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <section className="space-y-5"><h1 className="text-2xl font-bold">{personal ? 'Mis solicitudes' : 'Solicitudes académicas'}</h1>
    <Message error>{error || loadError}</Message>
    <form className="institutional-card grid gap-3 p-4 sm:grid-cols-2" onSubmit={e => {
      e.preventDefault(); const values = new FormData(e.currentTarget), query = new URLSearchParams()
      for (const [k, v] of values.entries()) if (v) query.set(k, String(v))
      setFilters('&' + query.toString()); setPage(1); setRevision(v => v + 1)
    }}>
      <label>Buscar<input name="search" className="institutional-field block w-full" placeholder="Código o asunto" /></label>
      <label>Estado<select name="status" className="institutional-field block w-full"><option value="">Todos</option>{['REGISTERED','IN_REVIEW','OBSERVED','APPROVED','REJECTED','COMPLETED'].map(s => <option key={s} value={s}>{({ REGISTERED: 'Registrada', IN_REVIEW: 'En revisión', OBSERVED: 'Observada', APPROVED: 'Aprobada', REJECTED: 'Rechazada', COMPLETED: 'Completada' } as Record<string, string>)[s]}</option>)}</select></label>
      <OfficeSelect label="Tipo de solicitud" name="request_type_id" endpoint="/api/v1/request-types" value={filterType} onChange={setFilterType} optional />
      {!personal && <OfficeSelect label="Estudiante" name="student_id" endpoint="/api/v1/office-options/students" value={filterStudent} onChange={setFilterStudent} optional />}
      <label>Fecha de registro<input name="date" type="date" className="institutional-field block w-full" /></label>
      <button className="institutional-button self-end">Filtrar solicitudes</button>
    </form>
    {data?.abilities?.create && <button className="institutional-button" onClick={() => setForm(!form)}>Nueva solicitud</button>}
    {form && <form data-testid="request-form" className="institutional-card space-y-4 p-5" onSubmit={create}>
      <OfficeSelect label="Tipo" name="request_type_id" endpoint="/api/v1/request-types" value={type} onChange={setType} />
      {user?.roles.includes('GUARDIAN') && <OfficeSelect label="Estudiante de la solicitud" name="student_id" endpoint="/api/v1/office-options/students" value={student} onChange={setStudent} />}
      <label className="block">Asunto<input className="institutional-field block w-full" name="subject" maxLength={180} required /></label>
      <label className="block">Descripción<textarea className="institutional-field block w-full" name="description" maxLength={10000} required /></label>
      <button className="institutional-button" disabled={busy}>Registrar solicitud</button> <button type="button" className="institutional-button" disabled={busy} onClick={() => setForm(false)}>Cancelar</button>
    </form>}
    {loading && <p role="status">Cargando solicitudes…</p>}
    {data?.data.length === 0 && <p>No hay solicitudes con estos filtros.</p>}
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Código','Estudiante / tipo','Fecha','Estado','Asunto','Responsable','Acciones'].map(h => <th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>
      {data?.data.map(r => <tr key={r.id} data-testid="request-row" className="border-t border-beige"><td className="p-3">{r.request_code}</td><td className="p-3">{r.student}<br />{r.type}</td><td className="p-3">{dateLabel(r.created_at)}</td><td className="p-3"><OfficeBadge value={r.status} /></td><td className="max-w-xs break-words p-3">{r.subject}</td><td className="p-3">{r.responsible || 'Sin asignar'}</td><td className="p-3"><button className="institutional-button" onClick={() => setSelected(r.id)}>Ver solicitud</button></td></tr>)}
    </tbody></table></div><Pager page={data} onPage={setPage} />
    {selected && <RequestDetail key={selected} id={selected} changed={() => setRevision(v => v + 1)} />}
  </section>
}
