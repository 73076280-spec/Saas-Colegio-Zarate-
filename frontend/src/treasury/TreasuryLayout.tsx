import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Icon from '../components/Icon'
import { Message } from '../components/Form'
import './treasury.css'

export const treasuryLinks = [
  { path: '', label: 'Inicio', icon: 'home' },
  { path: '/payments', label: 'Pagos', icon: 'wallet' },
  { path: '/concepts', label: 'Conceptos de pago', icon: 'file' },
  { path: '/history', label: 'Historial', icon: 'calendar' },
]

export function LegacyPaymentsRedirect() {
  const { search } = useLocation()
  return <Navigate to={'/app/treasury/payments' + search} replace />
}

export default function TreasuryLayout() {
  const { user } = useAuth()
  if (!user?.permissions.includes('payments.view')) return <Message error>No tienes permiso para acceder al Centro de Tesorería.</Message>
  return <section className="treasury-center space-y-6" data-testid="treasury-center" key={user.institution_id + ':' + user.id}>
    <div className="treasury-banner">
      <div className="flex min-w-0 items-center gap-4">
        <span className="treasury-emblem"><Icon name="wallet" className="size-7" /></span>
        <div className="min-w-0"><p className="treasury-kicker">Gestión financiera</p><p className="mt-1 text-xl font-semibold">Centro de Tesorería</p><p className="mt-1 text-sm text-brown-medium break-words">{user.institution.name}</p></div>
      </div>
      <Link to="/app" className="button-secondary"><Icon name="arrow" className="rotate-180" />Volver a Gestión Institucional</Link>
    </div>
    <nav aria-label="Navegación de Tesorería" className="treasury-navigation">{treasuryLinks.map(link => <NavLink key={link.path} end to={'/app/treasury' + link.path} className="button-secondary"><Icon name={link.icon} />{link.label}</NavLink>)}</nav>
    <div className="min-w-0" data-testid="treasury-content"><Outlet /></div>
  </section>
}
