import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { roleLabels } from '../auth/types'
import Brand from '../components/Brand'
import Avatar from '../components/Avatar'
import Icon from '../components/Icon'
import ThemeToggle, { savedTheme } from '../components/ThemeToggle'
import type { Theme } from '../components/ThemeToggle'
import { virtualSectionsFor } from '../virtual/access'
export default function VirtualLayout() {
  const { user } = useAuth()
  const themeKey = 'zarate.theme.' + user?.institution_id + '.' + user?.id
  const [theme, setTheme] = useState<Theme>(() => savedTheme(themeKey))
  function changeTheme(next: Theme) {
    setTheme(next)
    try { localStorage.setItem(themeKey, next) } catch { /* Keep theme available without local storage. */ }
  }
  if (!user) return null
  const links = [{ path: '', label: 'Inicio', icon: 'home' }, { path: 'courses', label: 'Mis cursos', icon: 'book' }, ...virtualSectionsFor(user)]
  return <div data-theme={theme} className="app-shell virtual-shell min-h-screen bg-background-soft text-text-dark lg:grid lg:grid-cols-[248px_1fr]">
    <a href="#virtual-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Ir al contenido del aula</a>
    <aside className="app-sidebar"><div className="border-b border-beige px-2 pb-5 pt-2"><Brand /><p className="mt-4 text-xs font-medium text-brown-medium">{user.institution.name}</p><p className="mt-2 font-semibold text-sm">Aula Virtual</p></div>
      <nav aria-label="Navegación del Aula Virtual" className="mt-4 flex gap-2 lg:block">{links.map(item => <NavLink key={item.path} to={'/virtual' + (item.path ? '/' + item.path : '')} end={item.path === ''} className={({ isActive }) => 'sidebar-link ' + (isActive ? 'active' : '')}><Icon name={item.icon} />{item.label}</NavLink>)}</nav>
      <div className="mt-6 border-t border-beige pt-5"><Link to="/app" className="button-secondary w-full text-center"><Icon name="home" />Volver a Gestión Institucional</Link></div>
      <p className="mt-5 hidden px-2 text-xs leading-5 text-brown-medium lg:block">Tus clases, recursos y actividades en un espacio dedicado al aprendizaje.</p>
    </aside>
    <div className="min-w-0"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-beige bg-white px-5 py-4 sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-widest text-brown-medium">Campus Zárate</p><p className="mt-1 font-semibold">Aula Virtual</p></div><div className="flex items-center gap-3"><ThemeToggle theme={theme} change={changeTheme} /><Avatar name={user.name} src={user.avatar_url} /><div className="min-w-0"><p className="max-w-56 break-words text-sm font-semibold" data-testid="virtual-user">{user.name}</p><p className="text-xs text-brown-medium">{user.roles.map(role => roleLabels[role]).join(' · ')}</p></div></div></header>
      <main id="virtual-content" tabIndex={-1} className="mx-auto max-w-6xl px-5 py-8 sm:px-9"><Outlet /></main>
    </div>
  </div>
}
