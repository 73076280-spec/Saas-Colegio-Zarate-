import { NotificationBell } from '../office/NotificationsPage'
import { catalogs } from '../academic/catalogs'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { roleLabels } from '../auth/types'
import { errorMessage } from '../api/client'
import { Message } from '../components/Form'
import Brand from '../components/Brand'
import Avatar from '../components/Avatar'
import Icon, { navigationIcon } from '../components/Icon'
import ThemeToggle, { savedTheme } from '../components/ThemeToggle'
import type { Theme } from '../components/ThemeToggle'
import { canEnterVirtual } from '../virtual/access'
import { enrollmentAccess } from '../enrollment/EnrollmentNavigation'
export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const themeKey = 'zarate.theme.' + user?.institution_id + '.' + user?.id
  const [theme, setTheme] = useState<Theme>(() => savedTheme(themeKey))
  function changeTheme(next: Theme) {
    setTheme(next)
    try { localStorage.setItem(themeKey, next) } catch { /* The session still supports changing the theme when storage is unavailable. */ }
  }
  if (!user) return null
  const links = [['/app','Inicio',''],['/app/profile','Mi perfil','profile.view'],['/app/users','Usuarios','users.view'],['/app/institution','Institución','institutions.view'],['/app/roles','Roles y permisos','roles.view'],['/app/audit','Auditoría','audit.view']]
  if (Object.keys(catalogs).some(key => user.permissions.includes(key+'.view'))) links.push(['/app/academic','Gesti\u00f3n Acad\u00e9mica',''])
  if (['students','teachers','guardians'].some(type => user.permissions.includes(type+'.view'))) links.push(['/app/people','Personas',''])
  if (enrollmentAccess(user)) links.push(['/app/enrollments','Centro de Matrículas',''])
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
  const visibleLinks = links.filter(([, , permission]) => !permission || user.permissions.includes(permission))
  const current = [...visibleLinks].sort((a,b) => b[0].length - a[0].length).find(([path]) => location.pathname === path || location.pathname.startsWith(path + '/'))
  const group = (path: string) => /^\/app\/(users|institution|roles|audit)$/.test(path) ? 'Administración' : /requests|documents|communications|notifications|payments|justifications/.test(path) ? 'Gestión y comunidad' : path === '/app' || path === '/app/profile' ? 'Mi espacio' : 'Vida académica'
  async function signOut() {
    setBusy(true); setError('')
    try { await logout(); navigate('/login', { replace: true }) }
    catch (failure) { setError(errorMessage(failure)) }
    finally { setBusy(false) }
  }
  return <div data-theme={theme} className="app-shell min-h-screen bg-background-soft text-text-dark lg:grid lg:grid-cols-[260px_1fr]">
    <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-4">Ir al contenido</a>
    <aside className="app-sidebar">
      <div className="border-b border-beige px-2 pb-5 pt-2"><Brand /><p className="mt-4 text-xs font-medium leading-5 text-brown-medium" data-testid="institution-name">{user.institution.name}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#AE6627]">Campus digital</p></div>
      {!user.must_change_password && canEnterVirtual(user) && <Link to="/virtual" className="institutional-button my-4 text-center"><Icon name="book" />Ir al Aula Virtual</Link>}
      <nav aria-label="Navegación principal" className="mt-1 flex flex-wrap gap-x-2 lg:block">
        {!user.must_change_password && ['Mi espacio','Vida académica','Gestión y comunidad','Administración'].map(section => {
          const items = visibleLinks.filter(([path]) => group(path) === section)
          return items.length > 0 && <div key={section} className="contents lg:block"><p className="sidebar-group w-full">{section}</p>{items.map(([path,label]) => <NavLink key={path} end={path === '/app'} to={path} className={({ isActive }) => 'sidebar-link ' + (isActive ? 'active' : '')}><Icon name={navigationIcon(path)} /><span>{label}</span></NavLink>)}</div>
        })}
        <NavLink to="/app/change-password" className={({isActive}) => 'sidebar-link mt-3 ' + (isActive ? 'active' : '')}><Icon name="shield" />Cambiar contraseña</NavLink>
      </nav>
      <div className="mt-7 hidden items-center gap-3 rounded-xl bg-background-soft p-3 lg:flex"><Avatar name={user.name} src={user.avatar_url} size="sm" /><div className="min-w-0"><p className="truncate text-xs font-semibold">{user.first_name}</p><p className="text-[10px] text-brown-medium">Mi comunidad educativa</p></div></div>
    </aside>
    <div className="min-w-0">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-beige bg-white px-5 py-4 sm:px-8">
        <div className="hidden text-xs text-brown-medium xl:block"><Link to="/app" className="hover:underline">Campus digital</Link><span aria-hidden="true" className="mx-2">/</span><span className="font-semibold text-text-dark">{current?.[1] || 'Mi espacio'}</span></div>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={user.name} src={user.avatar_url} />
          <div className="min-w-0"><p className="font-semibold break-words" data-testid="user-name">{user.name}</p><p className="text-sm text-brown-medium" data-testid="user-role">{user.roles.map(role => roleLabels[role]).join(' · ') || 'Sin rol asignado'}</p></div>
        </div><div className="flex flex-wrap items-center gap-3"><ThemeToggle theme={theme} change={changeTheme} />{!user.must_change_password && user.permissions.includes('notifications.view') && <NotificationBell />}<button onClick={signOut} disabled={busy} className="button-secondary">{busy ? 'Cerrando…' : 'Cerrar sesión'}</button></div>
      </header>
      <main id="contenido" tabIndex={-1} className="mx-auto max-w-6xl px-5 py-9 sm:px-10"><Message error>{error}</Message><Outlet /></main>
    </div>
  </div>
}
