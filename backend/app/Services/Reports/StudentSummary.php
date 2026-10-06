<?php

namespace App\Services\Reports;

use App\Models\Attendance\AbsenceJustification;
use App\Models\Attendance\AttendanceRecord;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Learning\Assignment;
use App\Models\Learning\Score;
use App\Models\Office\AcademicRequest;
use App\Models\People\Student;
use App\Models\User;
use App\Services\Courses\CourseAccess;

class StudentSummary
{
    public function sections(User $user, Student $student, ?int $year, bool $family): array
    {
        $ids = app(CourseAccess::class)->studentQuery(Course::query(), $student->id)
            ->when($year, fn ($c) => $c->where('academic_year_id', $year))->pluck('id');
        $enrollment = Enrollment::with(['academicYear', 'section'])->where('student_id', $student->id)
            ->when($year, fn ($e) => $e->where('academic_year_id', $year))->latest('id')->first();
        $rows = [
            ['Indicador' => 'Matrícula', 'Valor' => $enrollment?->status?->value ?? 'Sin matrícula'],
            ['Indicador' => 'Año', 'Valor' => $enrollment?->academicYear?->name ?? 'Sin matrícula'],
            ['Indicador' => 'Sección', 'Valor' => $enrollment?->section?->name ?? 'Sin matrícula'],
            ['Indicador' => 'Cursos activos', 'Valor' => $ids->count()],
        ];
        // profile.view plus the verified family link authorizes this read-only family summary.
        if ($family || $user->can('assignments.view')) {
            $pending = Assignment::whereIn('course_id', $ids)->where('status', 'PUBLISHED')
                ->whereDoesntHave('submissions', fn ($s) => $s->where('student_id', $student->id));
            $rows[] = ['Indicador' => 'Tareas pendientes', 'Valor' => (clone $pending)->count()];
            $rows[] = ['Indicador' => 'Tareas próximas (7 días)', 'Valor' => (clone $pending)->whereBetween('due_at', [now(), now()->addDays(7)])->count()];
        }
        if ($user->can('attendance.view')) {
            $attendance = AttendanceRecord::where('student_id', $student->id)
                ->whereHas('session.course', fn ($c) => $c->when($year, fn ($c) => $c->where('academic_year_id', $year)));
            $total = (clone $attendance)->count();
            $present = (clone $attendance)->whereIn('status', ['PRESENT', 'LATE'])->count();
            $rows[] = ['Indicador' => 'Asistencia (presente o tardanza / registros)', 'Valor' => $total ? round(100 * $present / $total, 1).'%' : 'Sin registros'];
            $rows[] = ['Indicador' => 'Faltas', 'Valor' => (clone $attendance)->where('status', 'ABSENT')->count()];
            $rows[] = ['Indicador' => 'Justificaciones', 'Valor' => AbsenceJustification::whereIn('attendance_record_id', (clone $attendance)->select('id'))->count()];
        }
        if ($user->can('requests.view')) {
            $rows[] = ['Indicador' => 'Solicitudes', 'Valor' => AcademicRequest::where('student_id', $student->id)->count()];
        }
        $sections = [['title' => $student->user?->name ?? 'Estudiante', 'rows' => $rows]];
        if ($family || $user->can('scores.view')) {
            $sections[] = ['title' => 'Notas recientes · '.($student->user?->name ?? 'Estudiante'), 'rows' => Score::with('assessment.course')->where('student_id', $student->id)
                ->whereHas('assessment', fn ($a) => $a->where('status', 'PUBLISHED')->whereIn('course_id', $ids))
                ->latest('graded_at')->limit(5)->get()->map(fn ($s) => ['Curso' => $s->assessment?->course?->name, 'Evaluación' => $s->assessment?->title, 'Nota' => $s->score])->all()];
        }

        return $sections;
    }
}
