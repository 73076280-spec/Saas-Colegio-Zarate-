export const roleLabels = { ADMINISTRATOR: 'Administración', SECRETARY: 'Secretaría', TREASURY: 'Tesorería', TEACHER: 'Docente', STUDENT: 'Estudiante', GUARDIAN: 'Padre o apoderado' } as const
export type RoleName = keyof typeof roleLabels
export type User = {
  id: number; institution_id: number; first_name: string; last_name: string; name: string
  email: string; phone: string | null; avatar_path: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; must_change_password: boolean
  roles: RoleName[]; permissions: string[]
  institution: { id: number; name: string; code: string }
}
export const homePath = (user: User) => user.must_change_password ? '/app/change-password' : '/app'
