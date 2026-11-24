import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useOffice } from '../office/shared'
import { Message, PageHeading } from '../components/Form'
import Icon from '../components/Icon'

type CountPage = { total?: number; meta?: { total?: number } }
function total(data: CountPage | null): number | null {
  const value = data?.meta?.total ?? data?.total
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null
}

function indicatorNote(item: { loading: boolean; error: string; value: number | null; note: string }): string {
  if (item.loading) return 'Consultando…'
  if (item.error || item.value === null) return 'Dato no disponible'
  return item.note
}

export default function TreasuryDashboard() {
  const { user } = useAuth()
  const [revision, setRevision] = useState(0)
  const allowed = !!user?.permissions.includes('payments.view')
  const all = useOffice<CountPage>(allowed ? '/api/v1/student-payments?per_page=1' : '', revision)
  const pending = useOffice<CountPage>(allowed ? '/api/v1/student-payments?per_page=1&status=PENDING' : '', revision)
  const overdue = useOffice<CountPage>(allowed ? '/api/v1/student-payments?per_page=1&status=OVERDUE' : '', revision)
  const paid = useOffice<CountPage>(allowed ? '/api/v1/student-payments?per_page=1&status=PAID' : '', revision)
  const concepts = useOffice<CountPage>(allowed ? '/api/v1/payment-concepts?per_page=1' : '', revision)
  if (!allowed) return <Message error>No tienes permiso para consultar pagos.</Message>
  const pendingCount = total(pending.data), overdueCount = total(overdue.data)
  const indicators = [
    { label: 'Pagos registrados', value: total(all.data), loading: all.loading, error: all.error, note: 'Todos los estados', path: '/payments', icon: 'wallet' },
    { label: 'Pagos pendientes', value: pendingCount === null || overdueCount === null ? null : pendingCount + overdueCount, loading: pending.loading || overdue.loading, error: pending.error || overdue.error, note: 'Pendientes y vencidos', path: '/payments', icon: 'calendar' },
    { label: 'Pagos confirmados', value: total(paid.data), loading: paid.loading, error: paid.error, note: 'Registrados como pagados', path: '/history', icon: 'check' },
    { label: 'Conceptos registrados', value: total(concepts.data), loading: concepts.loading, error: concepts.error, note: 'Activos e inactivos', path: '/concepts', icon: 'file' },
  ]
  const loading = indicators.some(item => item.loading)
  const errors = [...new Set(indicators.map(item => item.error).filter(Boolean))]
  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><PageHeading title="Resumen de Tesorería" description="Pagos y conceptos de tu institución, en un solo lugar." /><button type="button" className="button-secondary" disabled={loading} onClick={() => setRevision(value => value + 1)}><Icon name="chart" />Actualizar resumen</button></div>
    <Message error>{errors.length > 0 ? 'No se pudo completar el resumen. ' + errors.join(' ') : ''}</Message>
    <div className="treasury-metrics" aria-busy={loading}>{indicators.map((item, index) => <section className="metric-card" key={item.label} aria-label={item.label} aria-busy={item.loading}>
      <div className="flex items-start justify-between gap-3"><h2 className="text-sm font-semibold text-brown-medium">{item.label}</h2><span className="metric-icon"><Icon name={item.icon} /></span></div>
      <p className="treasury-number" data-testid={'treasury-count-' + index}>{item.loading || item.error || item.value === null ? '—' : item.value.toLocaleString('es-PE')}</p>
      <p className="text-sm text-brown-medium">{indicatorNote(item)}</p>
      <Link className="treasury-detail-link" to={'/app/treasury' + item.path}>Ver detalle<Icon name="arrow" className="size-4" /></Link>
    </section>)}</div>
    <p className="text-sm text-brown-medium">El resumen muestra los registros autorizados por el servidor. Los conceptos se cuentan en todos sus estados; el total de conceptos activos y las obligaciones no están disponibles como indicadores agregados.</p>
    <section className="institutional-card" aria-label="Operaciones de Tesorería"><h2 className="text-lg font-semibold">Tu espacio de trabajo</h2><div className="treasury-tools mt-4">
      <Link className="treasury-tool" to="/app/treasury/payments"><span className="treasury-emblem"><Icon name="wallet" /></span><span><strong className="block">Gestionar pagos</strong><span className="text-sm text-brown-medium">Consulta, filtros y acciones según tus permisos.</span></span><Icon name="arrow" /></Link>
      <Link className="treasury-tool" to="/app/treasury/concepts"><span className="treasury-emblem"><Icon name="file" /></span><span><strong className="block">Conceptos de pago</strong><span className="text-sm text-brown-medium">Importes y estados del catálogo institucional.</span></span><Icon name="arrow" /></Link>
      <Link className="treasury-tool" to="/app/treasury/history"><span className="treasury-emblem"><Icon name="calendar" /></span><span><strong className="block">Consultar historial</strong><span className="text-sm text-brown-medium">Revisa los registros de pago sin modificarlos.</span></span><Icon name="arrow" /></Link>
    </div></section>
  </div>
}
