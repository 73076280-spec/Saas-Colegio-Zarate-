import { useEffect, useState } from 'react'
import { useResource } from '../api/useResource'
import type { Paged } from './config'
type Option = { id: number; first_name?: string; last_name?: string; email?: string; user?: { name: string } }
export default function PeopleLookup({ path, label, name, value, change, error }: { path: string; label: string; name: string; value: string; change: (id: string) => void; error?: string }) {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  useEffect(() => {
    const timeout = window.setTimeout(() => setQuery(search), 250)
    return () => window.clearTimeout(timeout)
  }, [search])
  const [page, setPage] = useState(1)
  const result = useResource<Paged<Option>>(path+'?per_page=15&page='+page+'&search='+encodeURIComponent(query))
  const last = result.data?.meta?.last_page || result.data?.last_page || 1
  return <div className="grid gap-2"><label htmlFor={name} className="text-sm font-medium">{label}</label>
    <input aria-label={'Buscar '+label.toLowerCase()} className="institutional-field" placeholder="Buscar por nombre…" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} />
    <select id={name} name={name} className="institutional-field" required value={value} onChange={event => change(event.target.value)} aria-invalid={!!error}>
      <option value="">{result.loading ? 'Cargando…' : 'Seleccionar'}</option>
      {value && !result.data?.data.some(item => String(item.id) === value) && <option value={value}>Selección #{value}</option>}
      {result.data?.data.map(item => <option key={item.id} value={item.id}>{item.user?.name || [item.first_name,item.last_name].join(' ')}{item.email ? ' · '+item.email : ''}</option>)}
    </select>
    {last > 1 && <div className="flex gap-3 text-sm"><button type="button" disabled={page === 1} onClick={() => setPage(page-1)}>Anterior</button><span>{page}/{last}</span><button type="button" disabled={page >= last} onClick={() => setPage(page+1)}>Siguiente</button></div>}
    {(error || result.error) && <p role="alert" className="text-sm">{error || result.error}</p>}
    {!result.loading && !result.error && !result.data?.data.length && <p className="text-sm text-brown-medium">No hay cuentas o perfiles compatibles con esta búsqueda.</p>}
  </div>
}
