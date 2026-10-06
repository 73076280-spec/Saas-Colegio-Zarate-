import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { RoleName } from '../auth/types'
import { Message, PageHeading } from '../components/Form'
import { useOffice } from '../office/shared'
import DataTable from '../reports/DataTable'
import type { ReportRow } from '../reports/DataTable'

const titles: Record<RoleName, string> = {
  ADMINISTRATOR: 'Dashboard de administración', SECRETARY: 'Dashboard de secretaría',
  TREASURY: 'Dashboard de tesorería', TEACHER: 'Dashboard docente',
  STUDENT: 'Dashboard del estudiante', GUARDIAN: 'Portal de padres',
}
type Dashboard = {
  academic_year: { id: number; name: string } | null
  years: { id: number; name: string }[]
  cards: { label: string; value: number | string }[]
  sections: { title: string; rows: ReportRow[] }[]
  links: { label: string; path: string }[]
  scope_note: string
}
export default function DashboardPage() {
  const { user } = useAuth()
  const [year, setYear] = useState(''), [revision, setRevision] = useState(0)
  const { data, error, loading } = useOffice<Dashboard>('/api/v1/dashboard' + (year ? '?academic_year_id=' + year : ''), revision)
  const role = (Object.keys(titles) as RoleName[]).find(value => user?.roles.includes(value))
  return <><PageHeading title={role ? titles[role] : 'Mi espacio'} description="Información actual de tu comunidad educativa." />
    <div className="mb-6 flex flex-wrap items-end gap-4">
      <label className="grid gap-2 text-sm font-semibold">Año académico
        <select className="institutional-field" aria-label="Año del dashboard" value={year} onChange={e => setYear(e.target.value)}>
          <option value="">Año actual</option>
          {data?.years.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          {year && !data?.years.some(item => String(item.id) === year) && <option value={year}>Año seleccionado</option>}
        </select></label>
      <button className="institutional-button" disabled={loading} onClick={() => setRevision(value => value + 1)}>Actualizar indicadores</button>
    </div><Message error>{error}</Message>
    {loading && <p role="status">Cargando indicadores…</p>}
    {data && <div data-testid="dashboard-data">
      <p className="mb-5 text-sm text-brown-medium">{data.academic_year?.name ?? 'Sin año actual: se muestran todos los años'}. {data.scope_note}</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.cards.map(card => <section className="institutional-card border-t-4 border-primary" key={card.label}>
        <h2 className="text-sm font-medium text-brown-medium">{card.label}</h2><p className="mt-3 text-3xl font-semibold break-words">{card.value}</p>
      </section>)}</div>
      <nav aria-label="Accesos rápidos" className="my-6 flex flex-wrap gap-3">{data.links.map((link, i) => <Link className="institutional-button" key={i} to={link.path}>{link.label}</Link>)}
        {user?.roles.some(r => ['ADMINISTRATOR', 'SECRETARY', 'TREASURY', 'TEACHER'].includes(r)) && <Link className="institutional-button" to="/app/reports">Reportes</Link>}
      </nav>
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">{data.sections.map((section, i) => <section className="institutional-card min-w-0" key={i}>
        <h2 className="mb-4 text-xl font-semibold">{section.title}</h2><DataTable rows={section.rows} caption={section.title} />
      </section>)}</div>
      {!data.cards.length && !data.sections.length && <p>No hay indicadores disponibles para tu cuenta.</p>}
    </div>}
  </>
}
