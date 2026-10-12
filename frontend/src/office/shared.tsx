import StatusBadge from '../components/StatusBadge'
import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'

export type OfficeItem = {
  id: number; status: string; created_at: string; abilities: Record<string, boolean>
  request_code?: string; subject?: string; description?: string; type?: string; student?: string; student_id?: number; request_type_id?: number
  resolution?: string | null; responsible?: string | null; assigned_to?: number | null
  document_type?: string; document_number?: string; original_filename?: string | null; issued_at?: string | null; academic_request_id?: number
  title?: string; body?: string; published_at?: string | null; targets?: Target[]
}
export type Target = { kind: string; target: string }
export type OfficePage = Page<OfficeItem> & { abilities?: Record<string, boolean> }
export const officeLabels: Record<string, string> = { REGISTERED: 'Registrada', IN_REVIEW: 'En revisión', OBSERVED: 'Observada', APPROVED: 'Aprobada', REJECTED: 'Rechazada', COMPLETED: 'Completada', DRAFT: 'Borrador', ISSUED: 'Emitido', CANCELLED: 'Cancelado', PUBLISHED: 'Publicado', ARCHIVED: 'Archivado' }
export function OfficeBadge({ value }: { value: string }) { return <StatusBadge value={value}>{officeLabels[value] ?? value}</StatusBadge> }
export function dateLabel(value?: string | null) { return value ? new Date(value).toLocaleString('es-PE') : '—' }
export function useOffice<T>(url: string, revision = 0) {
  const key = url + '|' + revision
  const [state, setState] = useState<{ key: string; data: T | null; error: string }>({ key: '', data: null, error: '' })
  useEffect(() => {
    if (!url) return
    let active = true
    api<T>(url).then(data => { if (active) setState({ key, data, error: '' }) }).catch(e => { if (active) setState({ key, data: null, error: errorMessage(e) }) })
    return () => { active = false }
  }, [url, key])
  return { data: state.key === key ? state.data : null, error: state.key === key ? state.error : '', loading: !!url && state.key !== key }
}
type Option = { id: number | string; name: string }
export function OfficeSelect({ label, name, endpoint, value, onChange, optional = false }: { label: string; name: string; endpoint: string; value: string; onChange: (value: string) => void; optional?: boolean }) {
  const [search, setSearch] = useState(''), [page, setPage] = useState(1), [chosen, setChosen] = useState('')
  const { data, error, loading } = useOffice<Page<Option>>(endpoint + '?page=' + page + '&search=' + encodeURIComponent(search))
  return <fieldset className="min-w-0 rounded-xl border border-beige p-3"><legend className="text-sm font-semibold">{label}</legend>
    <input className="institutional-field mb-2 w-full" aria-label={'Buscar ' + label} placeholder="Buscar por nombre" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
    <select className="institutional-field w-full" name={name} required={!optional} value={value} onChange={e => { onChange(e.target.value); setChosen(data?.data.find(o => String(o.id) === e.target.value)?.name ?? '') }}>
      <option value="">{optional ? 'Sin filtro / selección' : 'Seleccionar'}</option>
      {value && !data?.data.some(o => String(o.id) === value) && <option value={value}>{chosen || 'Selección guardada'}</option>}
      {data?.data.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>{loading && <p role="status" className="text-sm">Cargando opciones…</p>}<Message error>{error}</Message><Pager page={data} onPage={setPage} />
  </fieldset>
}
export async function downloadDocument(item: OfficeItem) {
  const response = await fetch('/api/v1/academic-documents/' + item.id + '/download', { credentials: 'include', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
  if (!response.ok) throw new Error('No se pudo descargar el documento.')
  const url = URL.createObjectURL(await response.blob()), link = document.createElement('a')
  link.href = url; link.download = item.original_filename ?? 'documento'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
}
