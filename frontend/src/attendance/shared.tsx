import StatusBadge from '../components/StatusBadge'
export type Session = { id: number; date: string; topic: string | null; status: string; abilities: Record<string, boolean> }
export type Attendance = { id: number; student_id: number; student: string; date: string; course: string; status: string; observations: string | null; can_justify: boolean; justification: { id: number; status: string } | null }
export type Justification = { id: number; attendance_record_id: number; student_id: number; student: string; date: string; course: string; reason: string; status: string; original_filename: string | null; review_comment: string | null; abilities: Record<string, boolean> }
export const attendanceLabels: Record<string, string> = { OPEN: 'Abierta', CLOSED: 'Cerrada', PRESENT: 'Presente', ABSENT: 'Falta', LATE: 'Tardanza', JUSTIFIED: 'Justificada', PENDING: 'Pendiente', IN_REVIEW: 'En revisión', APPROVED: 'Aprobada', REJECTED: 'Rechazada' }
export function AttendanceBadge({ value }: { value: string }) { return <StatusBadge value={value}>{attendanceLabels[value] ?? value}</StatusBadge> }
