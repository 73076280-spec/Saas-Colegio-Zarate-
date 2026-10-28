import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Message, PageHeading } from '../components/Form'
import { useOffice } from '../office/shared'
import { Lookup, Pager, type Option, type Page } from './shared'
import { capacityAccess } from './EnrollmentNavigation'
export default function EnrollmentCapacity() {
  const { user } = useAuth()
  const [year, setYear] = useState(''), [grade, setGrade] = useState(''), [page, setPage] = useState(1), [revision, setRevision] = useState(0)
  const allowed = capacityAccess(user)
  const result = useOffice<Page<Option>>(allowed && year && grade ? '/api/v1/enrollment-options?' + new URLSearchParams({ kind: 'sections', academic_year_id: year, grade_level_id: grade, page: String(page) }) : '', revision)
  if (!allowed) return <Message error>No tienes permiso para consultar cupos.</Message>
  return <><PageHeading title="Consulta de cupos" description="Consulta informativa. La disponibilidad se valida nuevamente al aprobar una matrícula." /><div className="grid gap-4 md:grid-cols-2"><Lookup label="Año académico" name="capacity_year" kind="years" value={year} onChange={v => { setYear(v); setGrade(''); setPage(1) }} />{year && <Lookup label="Grado" name="capacity_grade" kind="grades" year={year} value={grade} onChange={v => { setGrade(v); setPage(1) }} />}</div>
    {(!year || !grade) && <p className="my-5">Selecciona año y grado para consultar sus secciones activas.</p>}
    <Message error>{result.error}</Message>{result.loading && <p role="status">Consultando cupos…</p>}
    {result.data && <><div className="institutional-card mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="mb-4 text-left font-semibold">Cupos por sección</caption><thead><tr>{['Sección', 'Capacidad', 'Ocupados', 'Disponibles'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead><tbody>{result.data.data.map(section => <tr key={section.id}><td className="p-3">{section.name}</td><td className="p-3">{section.capacity ?? 'Sin límite'}</td><td className="p-3">{section.occupied}</td><td className="p-3">{section.capacity == null ? 'Sin límite' : section.occupied === undefined ? 'No disponible' : Math.max(0, section.capacity - section.occupied)}</td></tr>)}</tbody></table>{!result.data.data.length && <p>No hay secciones activas para esta consulta.</p>}</div><Pager page={result.data} onPage={setPage} /></>}
    {year && grade && <button className="button-secondary mt-4" onClick={() => setRevision(v => v + 1)}>Actualizar cupos</button>}
  </>
}
