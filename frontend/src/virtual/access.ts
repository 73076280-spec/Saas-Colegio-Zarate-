import type { User } from '../auth/types'
export const virtualSections = [
  { path: 'materials', label: 'Materiales', icon: 'book', permissions: ['materials.view', 'course-units.view'], tab: 'classroom' },
  { path: 'assignments', label: 'Tareas', icon: 'file', permissions: ['assignments.view'], tab: 'assignments' },
  { path: 'assessments', label: 'Evaluaciones', icon: 'calendar', permissions: ['assessments.view'], tab: 'assessments' },
  { path: 'scores', label: 'Calificaciones', icon: 'chart', permissions: ['scores.view'], tab: 'scores' },
] as const
export function virtualSectionsFor(user: User | null) {
  return virtualSections.filter(section => section.permissions.every(permission => user?.permissions.includes(permission)) && (section.path !== 'scores' || studentLearning(user) || user?.permissions.includes('assessments.view')))
}
export function canEnterVirtual(user: User | null): boolean {
  return !!user && user.roles.some(role => ['ADMINISTRATOR', 'TEACHER', 'STUDENT'].includes(role)) && virtualSectionsFor(user).length > 0
}
export function personalCourses(user: User | null): boolean {
  return !user?.roles.includes('ADMINISTRATOR') || !user.permissions.includes('courses.view')
}
export function studentLearning(user: User | null): boolean {
  return !!user?.roles.includes('STUDENT') && !user.roles.some(role => ['TEACHER', 'ADMINISTRATOR'].includes(role))
}
