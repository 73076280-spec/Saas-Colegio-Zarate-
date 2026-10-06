import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PageHeading } from '../components/Form'
import { catalogs } from './catalogs'
export default function AcademicHome() {
  const { user } = useAuth()
  const available = Object.entries(catalogs).filter(([key]) => user?.permissions.includes(key+'.view'))
  return <><PageHeading title="Gestión Académica" description="Organiza la estructura académica de tu institución." />
    {user?.permissions.includes('enrollments.view') && <Link to="/app/enrollments" className="institutional-card mb-5 block border-t-4 border-t-primary"><h2 className="text-xl font-semibold">Matrículas</h2><p>Trámite, cupos y validación administrativa.</p></Link>}
    <div className="mb-5 flex flex-wrap gap-3">{user?.permissions.includes('teacher-assignments.view')&&<Link className="institutional-button" to="/app/teacher-assignments">Asignación docente</Link>}{user?.permissions.includes('courses.view')&&<Link className="institutional-button" to="/app/courses">Cursos</Link>}</div>
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{available.map(([key, catalog]) => <Link to={'/app/academic/'+key} key={key} className="institutional-card border-t-4 border-t-primary transition-shadow hover:shadow-md"><h2 className="text-xl font-semibold">{catalog.title}</h2><p className="mt-3 text-sm leading-6 text-brown-medium">{catalog.description}</p></Link>)}</div>
    {!available.length && <p role="alert">No tienes permisos para consultar la estructura académica.</p>}
  </>
}
