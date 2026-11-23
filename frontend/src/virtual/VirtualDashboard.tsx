import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useOffice } from '../office/shared'
import type { TeachingRecord } from '../courses/TeachingForm'
import CourseCards from '../courses/CourseCards'
import Icon from '../components/Icon'
import EmptyState from '../components/EmptyState'
import { Message } from '../components/Form'
import { personalCourses, virtualSectionsFor } from './access'
export default function VirtualDashboard() {
  const { user } = useAuth()
  const result = useOffice<{data: TeachingRecord[]; meta: {total: number}}>('/api/v1/' + (personalCourses(user) ? 'my/courses' : 'courses') + '?per_page=6')
  return <>
    <section className="virtual-welcome mb-8"><div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-brown-medium">Aprender · Compartir · Crecer</p><h1 className="text-3xl font-semibold leading-tight">Tu aula, más cerca.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-brown-medium">Hola, {user?.first_name}. Continúa con tus cursos y encuentra los recursos de tu comunidad educativa.</p><Link className="institutional-button mt-5" to="/virtual/courses">Explorar mis cursos<Icon name="arrow" /></Link></div><div className="virtual-welcome-art" aria-hidden="true"><Icon name="book" /><span /><span /></div></section>
    <nav aria-label="Herramientas del aula" className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{virtualSectionsFor(user).map(item => <Link className="virtual-tool" key={item.path} to={'/virtual/' + item.path}><span className="metric-icon mb-0"><Icon name={item.icon} /></span><span className="font-semibold">{item.label}</span><Icon name="arrow" className="ml-auto size-4" /></Link>)}</nav>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold">Tus cursos</h2><p className="mt-2 text-sm text-brown-medium">{result.data ? result.data.meta.total + ' cursos autorizados · Mostrando ' + result.data.data.length : 'Cursos disponibles para tu cuenta'}</p></div><Link to="/virtual/courses" className="text-sm font-semibold underline underline-offset-4">Ver todos</Link></div>
    <Message error>{result.error}</Message>{result.loading && <p role="status">Cargando tus cursos…</p>}
    {result.error && <Link className="button-secondary" to="/virtual/courses">Volver a consultar cursos</Link>}
    {result.data && (result.data.data.length ? <CourseCards courses={result.data.data} href={id => '/virtual/courses/' + id} showRosterCount={user?.roles.includes('TEACHER')} /> : <EmptyState hint="Los cursos aparecerán cuando tu institución habilite tu asignación o matrícula.">Todavía no tienes cursos disponibles.</EmptyState>)}
  </>
}
