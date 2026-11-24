import { useState } from 'react'
import { useOffice } from '../office/shared'
import { Message } from '../components/Form'
import EmptyState from '../components/EmptyState'
import { Pager, Status } from '../enrollment/shared'
import type { Concept } from '../enrollment/PaymentsPage'
import type { Page } from '../enrollment/shared'

// Equivale al punto de p[role="status"]::before (index.css), que no aplica a <output>.
const loadingClass = "block before:mr-[.6rem] before:inline-block before:size-[.55rem] before:rounded-full before:bg-[#ECA13E] before:content-['']"

export default function ConceptsPanel({ revision }: Readonly<{ revision: number }>) {
  const [page, setPage] = useState(1), [search, setSearch] = useState(''), [query, setQuery] = useState(''), [retry, setRetry] = useState(0)
  const result = useOffice<Page<Concept>>('/api/v1/payment-concepts?' + new URLSearchParams({ page: String(page), search: query }), revision + retry)
  return <section className="space-y-4" aria-label="Catálogo de conceptos de pago" aria-busy={result.loading}>
    <form className="treasury-filters" onSubmit={event => { event.preventDefault(); setQuery(search); setPage(1) }}>
      <label className="grid gap-2 text-sm font-semibold">Buscar concepto<input className="institutional-field" name="search" value={search} maxLength={100} placeholder="Nombre del concepto" onChange={event => setSearch(event.target.value)} /></label>
      <button type="submit" className="institutional-button">Buscar conceptos</button>
    </form>
    <Message error>{result.error}</Message>
    {result.loading && <output className={loadingClass}>Cargando conceptos de pago…</output>}
    {result.error && <button type="button" className="button-secondary" onClick={() => setRetry(value => value + 1)}>Reintentar consulta</button>}
    {result.data && <div className="treasury-table-wrap institutional-card"><table className="w-full text-left text-sm"><caption className="sr-only">Conceptos de pago de la institución</caption><thead><tr>{['Concepto', 'Código', 'Importe (PEN)', 'Estado'].map(label => <th scope="col" className="p-3" key={label}>{label}</th>)}</tr></thead><tbody>{result.data.data.map(concept => <tr key={concept.id} className="border-t border-beige"><th scope="row" className="p-3 font-semibold">{concept.name}</th><td className="p-3 break-words">{concept.code}</td><td className="p-3 tabular-nums">{concept.amount}</td><td className="p-3"><Status value={concept.status} /></td></tr>)}</tbody></table>
      {result.data.data.length === 0 && <EmptyState>No hay conceptos que coincidan con la búsqueda.</EmptyState>}
      <Pager page={result.data} onPage={setPage} />
    </div>}
  </section>
}
