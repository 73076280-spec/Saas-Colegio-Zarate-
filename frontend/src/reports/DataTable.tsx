export type ReportRow = Record<string, string | number | null>
export default function DataTable({ rows, caption }: { rows: ReportRow[]; caption: string }) {
  if (!rows.length) return <EmptyState>No hay resultados para esta consulta.</EmptyState>
  const columns = Object.keys(rows[0])
  return <div className="max-w-full overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">{caption}</caption>
    <thead><tr>{columns.map(column => <th className="border-b border-beige p-3" key={column}>{column}</th>)}</tr></thead>
    <tbody>{rows.map((row, index) => <tr className="border-b border-beige last:border-0" key={String(row.ID ?? index)}>
      {columns.map(column => <td className="p-3" key={column}>{column === 'Estado' ? <StatusBadge value={row[column]} /> : row[column] ?? '—'}</td>)}
    </tr>)}</tbody></table></div>
}
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
