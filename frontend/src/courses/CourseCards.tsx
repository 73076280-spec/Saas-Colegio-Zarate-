import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { Status } from '../enrollment/shared'
import type { TeachingRecord } from './TeachingForm'
export default function CourseCards({ courses, href, onOpen, showRosterCount = false }: {
  courses: TeachingRecord[]; href?: (id: number) => string; onOpen?: (id: number) => void; showRosterCount?: boolean
}) {
  return <div className="grid gap-5 md:grid-cols-2">{courses.map(course => <article className="virtual-course-card institutional-card" key={course.id} data-testid="course-card">
    <div className="mb-5 flex items-start justify-between gap-3"><span className="virtual-course-icon"><Icon name="book" className="size-6" /></span><Status value={course.status} /></div>
    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brown-medium">{course.subject.name}</p><h2 className="text-xl font-semibold leading-snug break-words">{course.name || course.subject.name}</h2>
    <p className="mt-3 text-sm text-brown-medium">{course.teacher.name}</p><p className="mt-2 text-sm text-brown-medium">{course.academic_year.name} · {course.grade_level.level} · {course.grade_level.name} · {course.section.name}</p>
    {showRosterCount && course.students_count !== undefined && <p className="mt-3 text-sm">{course.students_count} estudiantes matriculados</p>}
    <div className="mt-6 border-t border-beige pt-4">{href ? <Link className="institutional-button w-full" to={href(course.id)}>Entrar al curso<Icon name="arrow" /></Link> : <button className="institutional-button" onClick={() => onOpen?.(course.id)}>Entrar al curso</button>}</div>
  </article>)}</div>
}
