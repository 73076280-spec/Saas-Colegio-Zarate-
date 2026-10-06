import { useState } from 'react'
import { useResource } from '../api/useResource'
import type { AcademicList } from './catalogs'
import { displayValue } from './catalogs'
export default function RelationSelect({ catalog, name, label, value, onChange, disabled = false, required = false, error, selectedLabel }: {
  catalog: string; name: string; label: string; value: string; onChange: (value: string) => void; disabled?: boolean; required?: boolean; error?: string; selectedLabel?: string
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const resource = useResource<AcademicList>('/api/v1/'+catalog+'?per_page=20&page='+page+'&search='+encodeURIComponent(search))
  return <div className="grid gap-2">
    <label htmlFor={'relation-'+name} className="text-sm font-medium">{label}</label>
    {!disabled && <input aria-label={'Buscar '+label.toLowerCase()} className="institutional-field text-sm" placeholder="Buscar opciones…" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />}
    <select id={'relation-'+name} name={name} value={value} onChange={event => onChange(event.target.value)} required={required} disabled={disabled || resource.loading} aria-invalid={!!error} aria-describedby={error ? name+'-error' : undefined} className="institutional-field">
      <option value="">{resource.loading ? 'Cargando…' : 'Seleccionar'}</option>
      {value && !resource.data?.data.some(item => String(item.id) === value) && <option value={value}>{selectedLabel || 'Selección #'+value}</option>}
      {resource.data?.data.map(item => <option value={item.id} key={item.id}>{displayValue(item)}</option>)}
    </select>
    {disabled && <input type="hidden" name={name} value={value} />}
    {!disabled && (resource.data?.last_page || 1) > 1 && <div className="flex gap-4 text-sm"><button type="button" disabled={page <= 1} onClick={() => setPage(page-1)}>Anterior</button><span>{page}/{resource.data?.last_page}</span><button type="button" disabled={page >= (resource.data?.last_page || 1)} onClick={() => setPage(page+1)}>Siguiente</button></div>}
    {error && <p id={name+'-error'} className="text-sm text-brown-medium">{error}</p>}
    {resource.error && <p role="alert" className="text-sm">{resource.error}</p>}
  </div>
}
