import { NotificationBell } from '../office/NotificationsPage'
import { catalogs } from '../academic/catalogs'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { roleLabels } from '../auth/types'
import { errorMessage } from '../api/client'
import { Message } from '../components/Form'
export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (!user) return null
  const links = [['/app','Inicio',''],['/app/profile','Mi perfil','profile.view'],['/app/users','Usuarios','users.view'],['/app/institution','Institución','institutions.view'],['/app/roles','Roles y permisos','roles.view'],['/app/audit','Auditoría','audit.view']]
  if (Object.keys(catalogs).some(key => user.permissions.includes(key+'.view'))) links.push(['/app/academic','Gesti\u00f3n Acad\u00e9mica',''])
  if (['students','teachers','guardians'].some(type => user.permissions.includes(type+'.view'))) links.push(['/app/people','Personas',''])
  if (user.permissions.includes('enrollments.view') || user.roles.some(r => ['STUDENT','GUARDIAN'].includes(r))) links.push(['/app/enrollments',user.permissions.includes('enrollments.view')?'Matrículas':'Mi matrícula',''])
  if (user.permissions.includes('payments.view')) links.push(['/app/payments','Tesorería','payments.view'])
  if (user.permissions.includes('teacher-assignments.view')) links.push(['/app/teacher-assignments','Asignación docente','teacher-assignments.view'])
  if (user.permissions.includes('courses.view')) links.push(['/app/courses','Cursos','courses.view'])
  if (user.roles.some(r=>['TEACHER','STUDENT'].includes(r))) links.push(['/app/my-courses','Mis cursos',''])
  if (user.roles.includes('STUDENT')) {
    for (const [kind, label] of [['assignments', 'Mis tareas'], ['submissions', 'Mis entregas'], ['assessments', 'Mis evaluaciones'], ['scores', 'Mis notas']]) {
      links.push(['/app/my-' + kind, label, kind + '.view'])
    }
  }
  if (user.roles.includes('STUDENT')) links.push(['/app/my-attendance', 'Mi asistencia', 'attendance.view'])
  if (user.roles.includes('GUARDIAN')) links.push(['/app/family-attendance', 'Asistencia de mis estudiantes', 'attendance.view'])
  if (user.roles.some(r => ['ADMINISTRATOR','SECRETARY'].includes(r))) links.push(['/app/justifications', 'Justificaciones', 'justifications.view'])
  if (user.roles.some(r => ['ADMINISTRATOR','SECRETARY'].includes(r))) links.push(['/app/requests','Solicitudes académicas','requests.view'])
  if (user.roles.some(r => ['STUDENT','GUARDIAN'].includes(r))) links.push(['/app/my-requests','Mis solicitudes','requests.view'])
  links.push(['/app/documents','Documentos académicos','documents.view'], ['/app/communications','Comunicaciones','communications.view'], ['/app/notifications','Mis notificaciones','notifications.view'])
  if (user.roles.some(role => ['ADMINISTRATOR','SECRETARY','TREASURY','TEACHER'].includes(role))) links.push(['/app/reports','Reportes',''])
  async function signOut() {
    setBusy(true); setError('')
    try { await logout(); navigate('/login', { replace: true }) }
    catch (failure) { setError(errorMessage(failure)) }
    finally { setBusy(false) }
  }
  return <div className="min-h-screen bg-background-soft text-text-dark lg:grid lg:grid-cols-[250px_1fr]">
    <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-4">Ir al contenido</a>
    <aside className="border-b border-beige bg-white p-6 lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3"><span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-beige text-xl font-bold">Z</span><div className="min-w-0"><p className="font-semibold break-words" data-testid="institution-name">{user.institution.name}</p><p className="text-xs text-brown-medium">Plataforma educativa</p></div></div>
      <nav aria-label="Navegación principal" className="mt-7 flex flex-wrap gap-2 lg:flex-col">
        {!user.must_change_password && links.filter(([, , permission]) => !permission || user.permissions.includes(permission)).map(([path,label]) => <NavLink key={path} end={path === '/app'} to={path} className={({ isActive }) => 'rounded-xl px-4 py-3 text-sm font-semibold ' + (isActive ? 'bg-beige' : 'hover:bg-background-soft')}>{label}</NavLink>)}
        <NavLink to="/app/change-password" className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-background-soft">Cambiar contraseña</NavLink>
      </nav>
    </aside>
    <div className="min-w-0">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-beige bg-white px-6 py-5 sm:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-beige font-semibold">{user.first_name[0]}{user.last_name[0]}</span>
          <div className="min-w-0"><p className="font-semibold break-words" data-testid="user-name">{user.name}</p><p className="text-sm text-brown-medium" data-testid="user-role">{user.roles.map(role => roleLabels[role]).join(' · ') || 'Sin rol asignado'}</p></div>
        </div><div className="flex flex-wrap items-center gap-3">{!user.must_change_password && user.permissions.includes('notifications.view') && <NotificationBell />}<button onClick={signOut} disabled={busy} className="institutional-button">{busy ? 'Cerrando…' : 'Cerrar sesión'}</button></div>
      </header>
      <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-5 py-9 sm:px-10"><Message error>{error}</Message><Outlet /></main>
    </div>
  </div>
}
