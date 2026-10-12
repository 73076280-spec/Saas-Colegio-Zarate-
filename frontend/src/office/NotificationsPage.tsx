import EmptyState from '../components/EmptyState'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { dateLabel, useOffice } from './shared'
import StatusBadge from '../components/StatusBadge'

type Notice = { id: string; type: string; message: string; path: string | null; read_at: string | null; created_at: string }
type Notices = Page<Notice> & { unread_count: number }
export default function NotificationsPage({ compact = false }: { compact?: boolean }) {
  const [page, setPage] = useState(1), [status, setStatus] = useState(''), [revision, setRevision] = useState(0)
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const { data, error: loadError, loading } = useOffice<Notices>('/api/v1/my/notifications?page=' + page + '&per_page=' + (compact ? 5 : 20) + (status ? '&status=' + status : ''), revision)
  async function read(id?: string) {
    setBusy(true); setError('')
    try { await api('/api/v1/notifications/' + (id ? id + '/read' : 'read-all'), 'POST'); setRevision(v => v + 1); window.dispatchEvent(new Event('office-notifications')) }
    catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  return <section className="space-y-4" data-testid="notifications-panel">
    {compact ? <h2 className="text-lg font-semibold">Notificaciones</h2> : <h1 className="text-2xl font-bold">Mis notificaciones</h1>}
    <Message error>{error || loadError}</Message><p data-testid="unread-count">{data?.unread_count ?? '…'} sin leer</p>
    <div className="flex flex-wrap gap-2"><label>Mostrar<select className="institutional-field ml-2" aria-label="Estado de notificaciones" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}><option value="">Todas</option><option value="unread">Sin leer</option><option value="read">Leídas</option></select></label>
      <button className="institutional-button" disabled={busy || !data?.unread_count} onClick={() => void read()}>Marcar todas como leídas</button>
    </div>
    {loading && <p role="status">Cargando notificaciones…</p>}{data?.data.length === 0 && <EmptyState>No hay notificaciones.</EmptyState>}
    <ul className="space-y-3">{data?.data.map(n => <li key={n.id} data-testid="notification-item" className={'rounded-xl border border-beige p-4 ' + (n.read_at ? 'bg-white' : 'bg-background-soft')}>
      <p className="text-xs text-brown-medium">{n.type === 'request' ? 'Solicitud académica' : 'Comunicado'} · {dateLabel(n.created_at)}</p>
      <p className="my-2 break-words">{n.message}</p><StatusBadge>{n.read_at ? 'Leída' : 'Sin leer'}</StatusBadge>
      <div className="mt-3 flex flex-wrap gap-2">{n.path?.startsWith('/app/') && <Link className="institutional-button" to={n.path}>Abrir</Link>}
        {!n.read_at && <button className="institutional-button" disabled={busy} onClick={() => void read(n.id)}>Marcar como leída</button>}
      </div>
    </li>)}</ul><Pager page={data} onPage={setPage} />
    {compact && <Link className="institutional-button inline-block" to="/app/notifications">Ver todas las notificaciones</Link>}
  </section>
}
export function NotificationBell() {
  const [open, setOpen] = useState(false), [revision, setRevision] = useState(0)
  const { data, error } = useOffice<Notices>('/api/v1/notifications?per_page=1', revision)
  useEffect(() => {
    const refresh = () => setRevision(v => v + 1)
    window.addEventListener('office-notifications', refresh); window.addEventListener('focus', refresh)
    const timer = setInterval(refresh, 60000)
    return () => { clearInterval(timer); window.removeEventListener('office-notifications', refresh); window.removeEventListener('focus', refresh) }
  }, [])
  return <div className="relative" onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}>
    <button className="button-secondary relative flex items-center gap-2" aria-label="Notificaciones" aria-expanded={open} aria-controls="notification-popover" onClick={() => { setOpen(!open); setRevision(v => v + 1) }}>
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
      <span className="rounded-full bg-[#FFF0D8] px-2 py-0.5 text-xs font-bold text-[#8F501B]" data-testid="notification-count">{error ? '—' : data?.unread_count ?? '…'}</span>
    </button>
    {open && <div id="notification-popover" role="region" aria-label="Notificaciones recientes" className="absolute right-0 top-full z-30 mt-3 max-h-[75vh] w-[min(88vw,26rem)] overflow-y-auto rounded-2xl border border-beige bg-white p-5 shadow-lg">
      <button className="institutional-button mb-3" onClick={() => setOpen(false)}>Cerrar notificaciones</button><NotificationsPage compact />
    </div>}
  </div>
}
