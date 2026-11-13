import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, errorMessage } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { Message, PageHeading } from '../components/Form'
import { useOffice } from '../office/shared'
import { enrollmentLinks } from './EnrollmentNavigation'

const indicators = [['', 'Total de matrículas'], ['PENDING', 'Matrículas pendientes'], ['APPROVED', 'Matrículas aprobadas'], ['OBSERVED', 'Matrículas observadas']]
export default function EnrollmentDashboard() {
  const { user } = useAuth()
  const [year, setYear] = useState(''), [revision, setRevision] = useState(0)
  const [counts, setCounts] = useState<{ key: string; values: number[]; error: string } | null>(null)
  const key = year + ':' + revision
  const years = useOffice<{ years: { id: number; name: string }[] }>(user?.permissions.includes('profile.view') ? '/api/v1/dashboard' : '')
  useEffect(() => {
    let alive = true
    Promise.all(indicators.map(([status]) => api<{meta: {total: number}}>('/api/v1/enrollments?' + new URLSearchParams({ per_page: '1', ...(year ? { academic_year_id: year } : {}), ...(status ? { status } : {}) }))))
      .then(results => { if (alive) setCounts({ key, values: results.map(result => result.meta.total), error: '' }) })
      .catch(error => { if (alive) setCounts({ key, values: [], error: errorMessage(error) }) })
    return () => { alive = false }
  }, [year, key])
  const current = counts?.key === key ? counts : null
  return <><PageHeading title="Inicio de Matrículas" description="Consulta el estado de las matrículas y accede a los trámites disponibles para tu cuenta." />
    <div className="institutional-card mb-6 flex flex-wrap items-end gap-4"><label className="grid gap-2">Año académico
      {user?.permissions.includes('profile.view') ? <select aria-label="Año de matrículas" className="institutional-field" value={year} onChange={e => setYear(e.target.value)}><option value="">Todos los años</option>{years.data?.years.map(y => <option value={y.id} key={y.id}>{y.name}</option>)}</select> : <span>Todos los años (selector no disponible para tu cuenta).</span>}
    </label><button className="institutional-button" onClick={() => setRevision(v => v + 1)}>Actualizar indicadores</button></div>
    <Message error>{years.error || current?.error}</Message>{years.loading && <p role="status">Cargando años académicos…</p>}{!current && <p role="status">Cargando matrículas…</p>}
    <p className="mb-5 text-sm text-brown-medium">{user?.permissions.includes('enrollments.view') ? 'Matrículas de tu institución.' : 'Solo matrículas propias o de estudiantes vinculados.'} {year ? 'Año seleccionado.' : 'Todos los años.'} Pendientes: enviadas para revisión, sin incluir borradores.</p>
    {current && !current.error && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{indicators.map(([, label], index) => <section key={label} className="metric-card"><h2 className="text-sm text-brown-medium">{label}</h2><p data-testid={'enrollment-count-' + index} className="mt-3 text-3xl font-semibold">{current.values[index]}</p></section>)}</div>}
    {current?.values[0] === 0 && <p className="my-5">No hay matrículas visibles para el año y alcance seleccionados.</p>}
    <nav aria-label="Operaciones de Matrículas" className="mt-7 grid gap-4 sm:grid-cols-2">{enrollmentLinks(user).filter(item => item.path).map(item => <Link key={item.path} className="institutional-card hover:border-primary" to={'/app/enrollments' + item.path + (year ? '?academic_year_id=' + year : '')}><h2 className="text-lg font-semibold">{item.label}</h2><p className="mt-2 text-sm text-brown-medium">Abrir {item.label.toLowerCase()} →</p></Link>)}</nav>
  </>
}
