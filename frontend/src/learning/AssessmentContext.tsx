import type { LearningRecord } from './shared'

export default function AssessmentContext({ assessment }: { assessment: LearningRecord }) {
  // evaluation_date is a calendar date, not a UTC timestamp.
  const date = assessment.evaluation_date ? new Date(assessment.evaluation_date + 'T00:00:00') : null
  return <dl aria-label="Contexto de evaluación" className="grid gap-3 rounded-xl border border-beige p-3 text-sm sm:grid-cols-2">
    <div className="min-w-0"><dt className="font-semibold">Curso</dt><dd className="break-words">{assessment.course.name || 'Curso no disponible'}</dd></div>
    <div className="min-w-0"><dt className="font-semibold">Periodo académico</dt><dd className="break-words">{assessment.period?.name || 'Periodo no disponible'}</dd></div>
    <div><dt className="font-semibold">Nota máxima</dt><dd>{assessment.max_score ?? 'Escala no disponible'}</dd></div>
    <div><dt className="font-semibold">Fecha de evaluación</dt><dd>{date && Number.isFinite(date.getTime()) ? date.toLocaleDateString('es-PE') : 'Fecha no disponible'}</dd></div>
  </dl>
}

export function gradingGuidance(assessment: LearningRecord) {
  if (assessment.status === 'CLOSED') return 'Evaluación cerrada. No admite registro ni modificación de notas.'
  if (assessment.status !== 'PUBLISHED') return 'La evaluación aún no está publicada. El registro de notas requiere una evaluación publicada y un periodo habilitado.'
  if (assessment.period?.grading_open === false) return 'El periodo no está habilitado para registrar o modificar notas.'
  if (assessment.period?.grading_open !== true) return 'No se dispone de la habilitación del periodo. La disponibilidad se confirma al guardar la nota.'
  return 'Evaluación publicada y periodo habilitado. La disponibilidad se confirma al guardar la nota.'
}
