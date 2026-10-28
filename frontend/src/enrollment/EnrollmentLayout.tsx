import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Message } from '../components/Form'
import EnrollmentNavigation, { enrollmentAccess } from './EnrollmentNavigation'
export default function EnrollmentLayout() {
  const { user } = useAuth()
  return <section data-testid="enrollment-center"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-brown-medium">Centro de Matrículas</p><Link to="/app" className="button-secondary">Volver a Gestión Institucional</Link></div>
    {enrollmentAccess(user) ? <><EnrollmentNavigation user={user} /><Outlet /></> : <Message error>No tienes permiso para acceder al Centro de Matrículas.</Message>}
  </section>
}
