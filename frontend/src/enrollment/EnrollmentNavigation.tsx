import { NavLink } from 'react-router-dom'
import type { User } from '../auth/types'
export function enrollmentAccess(user: User | null) {
  return !!user && (user.permissions.includes('enrollments.view') || user.permissions.includes('enrollments.create') || user.permissions.includes('enrollments.update') || user.permissions.includes('payments.create') || user.roles.some(role => ['STUDENT', 'GUARDIAN'].includes(role)))
}
export function capacityAccess(user: User | null) {
  return !!user?.permissions.some(p => ['enrollments.create', 'enrollments.update', 'payments.create'].includes(p))
}
export function enrollmentLinks(user: User | null) {
  return [
    { path: '', label: 'Inicio de Matrículas' },
    { path: '/list', label: 'Lista y solicitudes' },
    ...(user?.permissions.includes('enrollments.create') ? [{ path: '/new', label: 'Nueva matrícula' }] : []),
    ...(capacityAccess(user) ? [{ path: '/capacity', label: 'Consulta de cupos' }] : []),
    { path: '/history', label: 'Historial de matrículas' },
  ]
}
export default function EnrollmentNavigation({ user }: { user: User | null }) {
  return <nav aria-label="Navegación de Matrículas" className="mb-7 flex flex-wrap gap-2">{enrollmentLinks(user).map(item => <NavLink key={item.path} end to={'/app/enrollments' + item.path} className={({ isActive }) => 'button-secondary ' + (isActive ? 'bg-beige font-bold' : '')}>{item.label}</NavLink>)}</nav>
}
