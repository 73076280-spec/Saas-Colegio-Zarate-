import { useState } from 'react'
import type { FormEvent } from 'react'
import { Message, PageHeading } from '../components/Form'
import { OfficeSelect, useOffice } from '../office/shared'
import { Pager } from '../enrollment/shared'
import type { Page } from '../enrollment/shared'
import DataTable from './DataTable'
import type { ReportRow } from './DataTable'

type Report = { id: string; name: string; group: string; filters: string[] }
const labels: Record<string, string> = { academic_year_id: 'Año académico', academic_period_id: 'Periodo', education_level_id: 'Nivel', grade_level_id: 'Grado', section_id: 'Sección', course_id: 'Curso', subject_id: 'Asignatura', teacher_id: 'Docente', student_id: 'Estudiante' }

function ReportView({ report }: { report: Report }) {
  const [draft, setDraft] = useState<Record<string, string>>({}), [filters, setFilters] = useState('')
  const [page, setPage] = useState(1), [busy, setBusy] = useState(false), [downloadError, setDownloadError] = useState('')
  const endpoint = '/api/v1/reports/' + report.id
  const { data, error, loading } = useOffice<Page<ReportRow> & { total: number }>(endpoint + '?page=' + page + '&' + filters)
  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    new FormData(event.currentTarget).forEach((value, name) => { if (String(value)) params.set(name, String(value)) })
    setPage(1); setFilters(params.toString())
  }
  async function download() {
    setBusy(true); setDownloadError('')
    try {
      const response = await fetch(endpoint + '/export?' + filters, { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'text/csv' } })
      if (!response.ok) throw new Error('No se pudo exportar el reporte. Comprueba tu sesión y permisos.')
      const url = URL.createObjectURL(await response.blob()), link = document.createElement('a')
      link.href = url; link.download = report.id + '.csv'; link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (failure) { setDownloadError(failure instanceof Error ? failure.message : 'No se pudo descargar el CSV.') } finally { setBusy(false) }
  }
  return <section aria-label="Reporte seleccionado" className="mt-6">
    <h2 className="mb-5 text-2xl font-semibold">{report.name}</h2>
    <form onSubmit={apply} className="institutional-card mb-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {report.filters.filter(field => field.endsWith('_id')).map(field => <OfficeSelect key={field} optional label={labels[field]} name={field}
          endpoint={endpoint + '/options/' + field} value={draft[field] ?? ''} onChange={value => setDraft(previous => ({ ...previous, [field]: value }))} />)}
        {report.filters.includes('status') && <label className="grid content-start gap-2 text-sm font-semibold">Estado<select className="institutional-field" name="status">
          <option value="">Todos los estados</option>{['ACTIVE', 'INACTIVE', 'DRAFT', 'PENDING', 'OBSERVED', 'APPROVED', 'REJECTED', 'CANCELLED', 'REGISTERED', 'IN_REVIEW', 'COMPLETED', 'PUBLISHED', 'CLOSED', 'PAID', 'OVERDUE', 'PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED'].map(status => <option key={status}>{status}</option>)}
        </select></label>}
        {report.filters.filter(field => field.startsWith('date_')).map(field => <label className="grid content-start gap-2 text-sm font-semibold" key={field}>{field === 'date_from' ? 'Desde' : 'Hasta'}<input className="institutional-field" type="date" name={field} /></label>)}
      </div><button className="institutional-button mt-5" disabled={loading}>Aplicar filtros</button>
      <p className="mt-3 text-sm text-brown-medium">El CSV utiliza los filtros aplicados e incluye todas las páginas. Las fechas corresponden a registro, vencimiento, evaluación, calificación, asistencia o publicación según el reporte.</p>
    </form>
    <Message error>{error || downloadError}</Message>
    <div className="institutional-card min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p>{data ? data.total + ' resultados' : ''}</p><button className="institutional-button" disabled={busy || loading || !!error} onClick={() => void download()}>{busy ? 'Exportando…' : 'Exportar CSV'}</button></div>
      {loading ? <p role="status">Cargando reporte…</p> : data && <><DataTable rows={data.data} caption={report.name} /><Pager page={data} onPage={setPage} /></>}
    </div>
  </section>
}
export default function ReportsPage() {
  const { data, error, loading } = useOffice<{ data: Report[] }>('/api/v1/reports')
  const [selected, setSelected] = useState('')
  const report = data?.data.find(item => item.id === selected)
  return <><PageHeading title="Reportes" description="Consulta información institucional y exporta resultados con los mismos permisos de acceso." /><Message error>{error}</Message>
    {loading && <p role="status">Cargando reportes disponibles…</p>}
    {data && !data.data.length && <p role="alert">No tienes reportes habilitados para tu rol y permisos.</p>}
    {data && data.data.length > 0 && <label className="grid gap-2 font-semibold">Seleccionar reporte<select className="institutional-field w-full" name="report" value={selected} onChange={e => setSelected(e.target.value)}>
      <option value="">Seleccionar</option>{[...new Set(data.data.map(item => item.group))].map(group => <optgroup label={group} key={group}>{data.data.filter(item => item.group === group).map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</optgroup>)}
    </select></label>}
    {report && <ReportView key={report.id} report={report} />}
  </>
}
