import { Link } from 'react-router-dom'
import { useOffice } from '../office/shared'
import { Status } from '../enrollment/shared'
import { Message } from '../components/Form'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'

type Item = { id: number; status: string; name?: string; enrollment_code?: string; academic_year: { name: string }; grade_level: { name: string }; section: { name: string } }
export default function ProfileAcademicSummary({ studentId }: { studentId?: number }) {
  const { data, error, loading } = useOffice<{ data: Item[] }>(studentId ? '/api/v1/students/' + studentId + '/enrollments?per_page=3' : '/api/v1/my/courses?per_page=3')
  return <div className="mt-6 border-t border-beige pt-5"><h3 className="mb-4 flex items-center gap-2 font-semibold"><Icon name={studentId ? 'calendar' : 'book'} />{studentId ? 'Matrículas recientes' : 'Cursos asignados'}</h3><Message error>{error}</Message>{loading && <p role="status">Cargando resumen académico…</p>}
    {data && !data.data.length && <EmptyState hint="Los registros aparecerán cuando estén disponibles.">{studentId ? 'Sin matrículas registradas.' : 'Sin cursos asignados.'}</EmptyState>}
    <div className="grid gap-3 sm:grid-cols-2">{data?.data.slice(0,3).map(item => <article key={item.id} className="rounded-xl border border-beige bg-background-soft p-4"><Status value={item.status} /><p className="mt-3 font-semibold">{item.name || item.enrollment_code}</p><p className="mt-1 text-sm text-brown-medium">{item.academic_year.name} · {item.grade_level.name} · Sección {item.section.name}</p></article>)}</div>
    <Link className="button-secondary mt-4" to={studentId ? '/app/enrollments' : '/app/my-courses'}>{studentId ? 'Consultar mi matrícula y sección' : 'Ver mis cursos asignados'}<Icon name="arrow" /></Link>
  </div>
}
