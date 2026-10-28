import AttendanceCourse from '../attendance/AttendanceCourse'
import { useState } from 'react'
import Classroom from '../classroom/Classroom'
import LearningPanel from './LearningPanel'
import { useAuth } from '../auth/AuthContext'
import type { User } from '../auth/types'
import { Message } from '../components/Form'

export function courseTabs(user: User | null, includeAttendance = true) {
  const tabs = [
    ['classroom', 'Aula Virtual', 'materials.view'],
    ['assignments', 'Tareas', 'assignments.view'],
    ['assessments', 'Evaluaciones', 'assessments.view'],
    ['scores', 'Calificaciones', 'scores.view'],
  ]
  if (includeAttendance && user?.roles.some(r => ['TEACHER','ADMINISTRATOR'].includes(r))) tabs.push(['attendance', 'Asistencia', 'attendance.view'])
  return tabs.filter(([key, , permission]) => user?.permissions.includes(permission) && (key !== 'classroom' || user.permissions.includes('course-units.view')) && (key !== 'scores' || user.permissions.includes('assessments.view')))
}

export default function CourseLearning({ course, closed, activeTab, onTabChange, includeAttendance = true }: { course: number; closed: boolean; activeTab?: string; onTabChange?: (tab: string) => void; includeAttendance?: boolean }) {
  const [selected, setSelected] = useState('classroom')
  const { user } = useAuth()
  const tabs = courseTabs(user, includeAttendance)
  const requested = activeTab ?? selected
  const tab = tabs.some(([key]) => key === requested) ? requested : tabs[0]?.[0]
  if (!tab) return <Message error>No tienes permiso para consultar contenido de este curso.</Message>
  return <section className="space-y-4"><div role="tablist" aria-label="Contenido del curso" className="flex flex-wrap gap-2">
    {tabs.map(([key, label]) => <button key={key} role="tab" aria-selected={tab === key} className={'rounded-xl border border-beige px-4 py-3 font-semibold ' + (tab === key ? 'bg-beige' : 'bg-white')} onClick={() => { setSelected(key); onTabChange?.(key) }}>{label}</button>)}
  </div><div role="tabpanel">
    {tab === 'attendance' ? <AttendanceCourse course={course} closed={closed} /> : tab === 'classroom' ? <Classroom course={course} closed={closed} /> : <LearningPanel key={tab} course={course} kind={tab === 'assignments' ? 'assignments' : 'assessments'} gradeMode={tab === 'scores'} />}
  </div></section>
}
