import AttendanceCourse from '../attendance/AttendanceCourse'
import { useState } from 'react'
import Classroom from '../classroom/Classroom'
import LearningPanel from './LearningPanel'
import { useAuth } from '../auth/AuthContext'

export default function CourseLearning({ course, closed }: { course: number; closed: boolean }) {
  const [tab, setTab] = useState('classroom')
  const { user } = useAuth()
  const tabs = [
    ['classroom', 'Aula Virtual', 'materials.view'],
    ['assignments', 'Tareas', 'assignments.view'],
    ['assessments', 'Evaluaciones', 'assessments.view'],
    ['scores', 'Calificaciones', 'scores.view'],
  ]
  if (user?.roles.some(r => ['TEACHER','ADMINISTRATOR'].includes(r))) tabs.push(['attendance', 'Asistencia', 'attendance.view'])
  return <section className="space-y-4"><div role="tablist" aria-label="Contenido del curso" className="flex flex-wrap gap-2">
    {tabs.filter(([, , permission]) => user?.permissions.includes(permission)).map(([key, label]) => <button key={key} role="tab" aria-selected={tab === key} className={'rounded-xl border border-beige px-4 py-3 font-semibold ' + (tab === key ? 'bg-beige' : 'bg-white')} onClick={() => setTab(key)}>{label}</button>)}
  </div><div role="tabpanel">
    {tab === 'attendance' ? <AttendanceCourse course={course} closed={closed} /> : tab === 'classroom' ? <Classroom course={course} closed={closed} /> : <LearningPanel key={tab} course={course} kind={tab === 'assignments' ? 'assignments' : 'assessments'} gradeMode={tab === 'scores'} />}
  </div></section>
}
