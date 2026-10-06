import { useState } from 'react'
import { useResource } from '../api/useResource'
import { Message, PageHeading } from '../components/Form'
type Entry = { id: number; user_id: number | null; action: string; ip_address: string | null; created_at: string }
export default function AuditPage() {
  const [page, setPage] = useState(1)
  const resource = useResource<{data: Entry[]; last_page: number}>('/api/v1/audit-logs?page='+page)
  return <><PageHeading title="Auditoría institucional" description="Registro de accesos y cambios en tu institución." /><Message error>{resource.error}</Message><section className="institutional-card">
    {resource.loading ? <p role="status">Cargando registros…</p> : <><div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Registros de auditoría</caption><thead><tr>{['Fecha','Usuario (ID)','Acción','IP'].map(label => <th className="border-b border-beige p-3" key={label}>{label}</th>)}</tr></thead><tbody>{resource.data?.data.map(entry => <tr key={entry.id}><td className="p-3">{new Date(entry.created_at).toLocaleString('es-PE')}</td><td className="p-3">{entry.user_id || '—'}</td><td className="p-3"><span className="institutional-badge">{entry.action}</span></td><td className="p-3">{entry.ip_address || '—'}</td></tr>)}</tbody></table></div>{resource.data?.data.length === 0 && <p className="py-5">Todavía no hay operaciones registradas.</p>}
    <div className="mt-5 flex flex-wrap items-center gap-4"><button disabled={page === 1} className="institutional-button" onClick={() => setPage(page-1)}>Anterior</button><span>Página {page}</span><button disabled={!resource.data || page >= resource.data.last_page} className="institutional-button" onClick={() => setPage(page+1)}>Siguiente</button></div></>}
  </section></>
}
