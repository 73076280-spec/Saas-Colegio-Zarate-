import EmptyState from '../components/EmptyState'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, errorMessage } from '../api/client'
import { Message } from '../components/Form'
import { Pager, type Page } from '../enrollment/shared'
import { dateLabel, useOffice } from './shared'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../auth/AuthContext'

type Notice = { id: string; type: string; message: string; path: string | null; read_at: string | null; created_at: string }
type Notices = Page<Notice> & { unread_count: number }
export default function NotificationsPage({ compact = false }: { compact?: boolean }) {
  const { user, loading } = useAuth()
  if (loading || !user?.permissions.includes('notifications.view')) return null
  return <NotificationsContent key={user.institution_id + ':' + user.id} compact={compact} />
}
function useNotificationRevision() {
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    const refresh = () => setRevision(v => v + 1)
    window.addEventListener('office-notifications', refresh); window.addEventListener('focus', refresh)
    return () => { window.removeEventListener('office-notifications', refresh); window.removeEventListener('focus', refresh) }
  }, [])
  return [revision, () => setRevision(v => v + 1)] as const
}
function NotificationQueryError({ error, status, retry }: { error: string; status?: number; retry: () => void }) {
  if (!error) return null
  const message = status === 403 ? 'No tienes autorización para consultar estas notificaciones.'
    : status === 404 ? 'La consulta de notificaciones no está disponible.'
    : status === 422 ? 'La consulta de notificaciones no es válida.' : 'No se pudieron consultar las notificaciones. ' + error
  const retryable = status === undefined || status >= 500 || status === 408 || status === 429
  return <div><Message error>{message}</Message>{retryable && <button type="button" className="institutional-button" onClick={retry}>Reintentar consulta</button>}</div>
}
function NotificationsContent({ compact }: { compact: boolean }) {
  const [page, setPage] = useState(1), [status, setStatus] = useState('')
  const [revision, refresh] = useNotificationRevision()
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const mounted = useRef(false), pending = useRef(false)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  const { data, error: loadError, errorStatus, loading } = useOffice<Notices>('/api/v1/my/notifications?page=' + page + '&per_page=' + (compact ? 5 : 20) + (status ? '&status=' + status : ''), revision)
  async function read(id?: string) {
    if (pending.current) return
    pending.current = true
    setBusy(true); setError('')
    try {
      await api('/api/v1/notifications/' + (id ? id + '/read' : 'read-all'), 'POST')
      if (mounted.current) window.dispatchEvent(new Event('office-notifications'))
    } catch (e) { if (mounted.current) setError(errorMessage(e)) } finally {
      pending.current = false
      if (mounted.current) setBusy(false)
    }
  }
  return <section className="space-y-4" data-testid="notifications-panel" aria-label={compact ? 'Bandeja reciente de notificaciones' : 'Bandeja de notificaciones'} aria-busy={loading}>
    {compact ? <h2 className="text-lg font-semibold">Notificaciones</h2> : <h1 className="text-2xl font-bold">Mis notificaciones</h1>}
    <Message error>{error}</Message>
    <NotificationQueryError error={loadError} status={errorStatus} retry={refresh} />
    <p data-testid="unread-count">{data ? data.unread_count + ' sin leer' : loadError ? 'Pendientes no disponibles' : 'Consultando pendientes…'}</p>
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
    </li>)}</ul>{data && <Pager page={data} onPage={setPage} />}
    {compact && <Link className="institutional-button inline-block" to="/app/notifications">Ver todas las notificaciones</Link>}
  </section>
}
export function NotificationBell() {
  const { user, loading } = useAuth()
  if (loading || !user?.permissions.includes('notifications.view')) return null
  return <NotificationBellContent key={user.institution_id + ':' + user.id} />
}
function NotificationBellContent() {
  const [open, setOpen] = useState(false)
  const [revision, refresh] = useNotificationRevision()
  const { data, error, errorStatus, loading } = useOffice<Notices>('/api/v1/notifications?per_page=1', revision)
  return <div className="relative" onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}>
    <button className="button-secondary relative flex items-center gap-2" aria-label="Notificaciones" aria-busy={loading} aria-expanded={open} aria-controls="notification-popover" onClick={() => { setOpen(!open); if (!open) refresh() }}>
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
      <span className="rounded-full bg-[#FFF0D8] px-2 py-0.5 text-xs font-bold text-[#8F501B]" data-testid="notification-count">{error ? '—' : data?.unread_count ?? '…'}</span>
    </button>
    <NotificationQueryError error={error} status={errorStatus} retry={refresh} />
    {open && <div id="notification-popover" role="region" aria-label="Notificaciones recientes" className="absolute right-0 top-full z-30 mt-3 max-h-[75vh] w-[min(88vw,26rem)] overflow-y-auto rounded-2xl border border-beige bg-white p-5 shadow-lg">
      <button className="institutional-button mb-3" onClick={() => setOpen(false)}>Cerrar notificaciones</button><NotificationsPage compact />
    </div>}
  </div>
}
