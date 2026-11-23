import { Link, useNavigate, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Message, PageHeading } from '../components/Form'
import TeachingPage, { CourseRoster } from '../courses/TeachingPage'
import type { TeachingRecord } from '../courses/TeachingForm'
import { useOffice } from '../office/shared'
import CourseLearning, { courseTabs } from '../learning/CourseLearning'
import LearningPanel from '../learning/LearningPanel'
import { Status } from '../enrollment/shared'
import { canEnterVirtual, personalCourses, studentLearning, virtualSectionsFor } from './access'

export function VirtualAccess({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  if (!canEnterVirtual(user)) return <main className="mx-auto max-w-xl p-8"><Message error>No tienes permiso para acceder al Aula Virtual.</Message><Link to="/app" className="button-secondary">Volver a Gestión Institucional</Link></main>
  return children
}
export function VirtualSection({ section = 'courses' }: { section?: string }) {
  const { user } = useAuth()
  const item = virtualSectionsFor(user).find(item => item.path === section)
  if (section !== 'courses' && !item) return <Message error>No tienes permiso para acceder a esta sección del aula.</Message>
  if (studentLearning(user) && item && item.path !== 'materials') return <LearningPanel key={section} kind={item.path} />
  return <TeachingPage key={section} personal={personalCourses(user)} virtualMode courseSection={item?.tab} heading={item ? item.label + ' por curso' : 'Mis cursos'} />
}
export function VirtualCourse() {
  const { user } = useAuth()
  const { courseId = '', section } = useParams()
  const navigate = useNavigate()
  const validId = /^\d+$/.test(courseId) && Number.isSafeInteger(Number(courseId)) && Number(courseId) > 0
  const tabs = courseTabs(user, false)
  const permitted = !section || tabs.some(([key]) => key === section)
  const { data, error, loading } = useOffice<{data: TeachingRecord}>(validId && permitted ? '/api/v1/courses/' + courseId : '')
  if (!validId || !permitted) return <Message error>Curso o sección no disponible para tu cuenta.</Message>
  return <><Link to="/virtual/courses" className="mb-5 inline-block text-sm underline underline-offset-4">Volver a Mis cursos</Link>
    <Message error>{error}</Message>{loading && <p role="status">Comprobando acceso al curso…</p>}
    {data && <div data-testid="virtual-course"><PageHeading title={data.data.name || data.data.subject.name} description={data.data.subject.name + ' · ' + data.data.teacher.name} /><div className="mb-6 flex flex-wrap items-center gap-3"><Status value={data.data.status} /><p className="text-sm text-brown-medium">{data.data.academic_year.name} · {data.data.grade_level.name} · Sección {data.data.section.name}</p></div>
      <CourseLearning key={courseId} course={data.data.id} closed={data.data.status === 'CLOSED'} includeAttendance={false} activeTab={section} onTabChange={tab => navigate('/virtual/courses/' + courseId + '/' + tab)} />
      {(user?.permissions.includes('courses.view') || user?.roles.includes('TEACHER')) && <details className="institutional-card mt-6"><summary className="cursor-pointer font-semibold">Listado de estudiantes del curso</summary><CourseRoster id={data.data.id} /></details>}
    </div>}
  </>
}
