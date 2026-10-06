<?php

namespace App\Services\Reports;

use App\Models\Academic\Section;
use App\Models\Attendance\AttendanceRecord;
use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\StudentPayment;
use App\Models\Learning\Assessment;
use App\Models\Learning\Assignment;
use App\Models\Learning\Score;
use App\Models\Office\AcademicRequest;
use App\Models\Office\Communication;
use App\Models\People\Student;
use App\Models\People\Teacher;
use App\Models\User;
use App\Policies\ReportPolicy;
use Illuminate\Database\Eloquent\Builder;

class ReportService
{
    public function query(User $user, string $key, array $filters = []): Builder
    {
        abort_unless(app(ReportPolicy::class)->view($user, $key), 403);
        $kind = ReportCatalog::get($key)[3];
        $q = match ($kind) {
            'students' => Student::with('user')->where('status', 'ACTIVE'),
            'teachers' => Teacher::with('user')->where('status', 'ACTIVE'),
            'enrollments' => Enrollment::with(['student.user', 'academicYear', 'gradeLevel.educationLevel', 'section']),
            'sections' => Section::with(['academicYear', 'gradeLevel.educationLevel'])->addSelect(['occupied' => Enrollment::withTrashed()->selectRaw('COUNT(*)')->whereColumn('section_id', 'sections.id')->where('status', 'APPROVED')]),
            'courses' => Course::with(['teacher.user', 'academicYear', 'subject', 'gradeLevel', 'section']),
            'workload' => TeacherAssignment::with(['teacher.user', 'academicYear', 'subject', 'gradeLevel', 'section'])->withCount('courses'),
            'scores' => Score::with(['student.user', 'assessment.course', 'assessment.period']),
            'assessments' => Assessment::with(['course', 'period'])->withCount('scores'),
            'assignments', 'missing' => Assignment::with('course'),
            'attendance', 'incidents' => AttendanceRecord::with(['student.user', 'session.course', 'justification']),
            'requests' => AcademicRequest::with(['student.user', 'type']),
            'payments' => StudentPayment::with(['student.user', 'academicYear', 'concept'])->whereHas('concept', fn ($c) => $c->where('code', 'like', 'MATRICULA\\_%')),
            'communications' => Communication::where('status', 'PUBLISHED'),
        };
        if (in_array($key, ['enrolled-students', 'students-by-section'])) {
            $q->where('status', 'APPROVED');
        }
        if ($kind === 'incidents') {
            $q->whereIn('status', ['ABSENT', 'LATE', 'JUSTIFIED']);
        }
        $relation = match ($kind) {
            'scores' => 'assessment.course', 'assessments', 'assignments', 'missing' => 'course',
            'attendance', 'incidents' => 'session.course', default => null,
        };
        if ($user->hasRole('TEACHER') && ! $user->hasRole('ADMINISTRATOR')) {
            $scope = fn ($c) => $c->whereHas('teacher', fn ($t) => $t->where('user_id', $user->id)->where('status', 'ACTIVE'));
            if ($relation) {
                $q->whereHas($relation, $scope);
            } elseif (in_array($kind, ['courses', 'workload'])) {
                $scope($q);
            }
        }
        if (in_array($kind, ['assignments', 'missing'])) {
            $roster = Enrollment::selectRaw('COUNT(*)')->where('status', 'APPROVED')
                ->whereHas('student', fn ($s) => $s->where('status', 'ACTIVE'))
                ->whereExists(function ($c) {
                    $c->selectRaw('1')->from('courses')->whereColumn('courses.id', 'assignments.course_id')
                        ->whereColumn('courses.institution_id', 'enrollments.institution_id')
                        ->whereColumn('courses.academic_year_id', 'enrollments.academic_year_id')
                        ->whereColumn('courses.grade_level_id', 'enrollments.grade_level_id')
                        ->whereColumn('courses.section_id', 'enrollments.section_id')->whereNull('courses.deleted_at');
                })->when($filters['student_id'] ?? null, fn ($e, $id) => $e->where('student_id', $id));
            $missing = (clone $roster)->whereNotExists(function ($s) {
                $s->selectRaw('1')->from('assignment_submissions')
                    ->whereColumn('assignment_submissions.institution_id', 'enrollments.institution_id')
                    ->whereColumn('assignment_submissions.assignment_id', 'assignments.id')
                    ->whereColumn('assignment_submissions.student_id', 'enrollments.student_id');
            });
            $q->addSelect(['expected_count' => $roster, 'pending_count' => $missing]);
            if (isset($filters['student_id'])) {
                $q->having('expected_count', '>', 0);
            }
            if ($kind === 'missing') {
                $q->whereIn('status', ['PUBLISHED', 'CLOSED'])->having('pending_count', '>', 0);
            }
        }
        $this->filters($q, $kind, $relation, $filters);

        return $q->orderByDesc($q->getModel()->qualifyColumn('id'));
    }

    private function filters(Builder $q, string $kind, ?string $relation, array $f): void
    {
        $academic = function (Builder $c) use ($f) {
            foreach (['academic_year_id', 'grade_level_id', 'section_id', 'teacher_id', 'subject_id'] as $field) {
                if (isset($f[$field])) {
                    $c->where($field, $f[$field]);
                }
            }
            if (isset($f['education_level_id'])) {
                $c->whereHas('gradeLevel', fn ($g) => $g->where('education_level_id', $f['education_level_id']));
            }
        };
        if ($relation) {
            $q->whereHas($relation, function ($c) use ($academic, $f) {
                $academic($c);
                if (isset($f['course_id'])) {
                    $c->whereKey($f['course_id']);
                }
            });
        } elseif (in_array($kind, ['enrollments', 'sections', 'courses', 'workload'])) {
            $local = $f;
            if ($kind === 'sections' && isset($local['section_id'])) {
                $q->whereKey($local['section_id']);
                unset($local['section_id']);
            }
            foreach (['academic_year_id', 'grade_level_id', 'section_id', 'teacher_id', 'subject_id'] as $field) {
                if (isset($local[$field])) {
                    $q->where($field, $local[$field]);
                }
            }
            if (isset($f['education_level_id'])) {
                $q->whereHas('gradeLevel', fn ($g) => $g->where('education_level_id', $f['education_level_id']));
            }
            if (isset($f['course_id'])) {
                $kind === 'workload' ? $q->whereHas('courses', fn ($c) => $c->whereKey($f['course_id'])) : $q->whereKey($f['course_id']);
            }
        }
        if (isset($f['academic_period_id'])) {
            $kind === 'scores' ? $q->whereHas('assessment', fn ($a) => $a->where('academic_period_id', $f['academic_period_id'])) : $q->where('academic_period_id', $f['academic_period_id']);
        }
        if ($kind === 'payments' && isset($f['academic_year_id'])) {
            $q->where('academic_year_id', $f['academic_year_id']);
        }
        if (isset($f['student_id']) && ! in_array($kind, ['assignments', 'missing'])) {
            $kind === 'students' ? $q->whereKey($f['student_id']) : $q->where('student_id', $f['student_id']);
        }
        if ($kind === 'teachers' && isset($f['teacher_id'])) {
            $q->whereKey($f['teacher_id']);
        }
        if (isset($f['status'])) {
            $q->where('status', $f['status']);
        }
        foreach (['date_from' => '>=', 'date_to' => '<='] as $field => $operator) {
            if (! isset($f[$field])) {
                continue;
            }
            if (in_array($kind, ['attendance', 'incidents'])) {
                $q->whereHas('session', fn ($s) => $s->whereDate('date', $operator, $f[$field]));
            } else {
                $column = match ($kind) {
                    'scores' => 'graded_at', 'assessments' => 'evaluation_date', 'assignments', 'missing' => 'due_at',
                    'payments' => 'due_date', 'communications' => 'published_at', default => 'created_at',
                };
                $q->whereDate($column, $operator, $f[$field]);
            }
        }
    }

    public function row(string $key, $r): array
    {
        $status = $r->status instanceof \BackedEnum ? $r->status->value : $r->status;
        $name = fn ($person) => $person?->user?->name ?? 'Cuenta no disponible';
        $date = fn ($value) => $value instanceof \DateTimeInterface ? $value->format('Y-m-d') : $value;
        $kind = ReportCatalog::get($key)[3];

        return match ($kind) {
            'students', 'teachers' => ['ID' => $r->id, 'Nombre' => $name($r), 'Estado' => $status],
            'enrollments' => ['ID' => $r->id, 'Estudiante' => $name($r->student), 'Año' => $r->academicYear?->name, 'Nivel' => $r->gradeLevel?->educationLevel?->name, 'Grado' => $r->gradeLevel?->name, 'Sección' => $r->section?->name, 'Estado' => $status],
            'sections' => ['ID' => $r->id, 'Año' => $r->academicYear?->name, 'Grado' => $r->gradeLevel?->name, 'Sección' => $r->name, 'Capacidad' => $r->capacity ?? 'Sin límite', 'Ocupados' => (int) $r->occupied, 'Disponibles' => $r->capacity === null ? 'Sin límite' : max(0, $r->capacity - $r->occupied)],
            'courses', 'workload' => ['ID' => $r->id, 'Docente' => $name($r->teacher), 'Año' => $r->academicYear?->name, 'Asignatura' => $r->subject?->name, 'Grado' => $r->gradeLevel?->name, 'Sección' => $r->section?->name, $kind === 'courses' ? 'Curso' : 'Cursos asociados' => $kind === 'courses' ? $r->name : $r->courses_count, 'Estado' => $status],
            'scores' => ['ID' => $r->id, 'Estudiante' => $name($r->student), 'Curso' => $r->assessment?->course?->name, 'Periodo' => $r->assessment?->period?->name, 'Evaluación' => $r->assessment?->title, 'Nota' => $r->score, 'Máximo' => $r->assessment?->max_score, 'Fecha' => $date($r->graded_at)],
            'assessments' => ['ID' => $r->id, 'Curso' => $r->course?->name, 'Periodo' => $r->period?->name, 'Evaluación' => $r->title, 'Fecha' => $date($r->evaluation_date), 'Calificaciones' => $r->scores_count, 'Estado' => $status],
            'assignments', 'missing' => ['ID' => $r->id, 'Curso' => $r->course?->name, 'Tarea' => $r->title, 'Vence' => $date($r->due_at), 'Estudiantes esperados' => (int) $r->expected_count, 'Entregaron' => (int) $r->expected_count - (int) $r->pending_count, 'Sin entrega' => (int) $r->pending_count, 'Plazo' => $r->due_at->isPast() ? 'Vencido' : 'En plazo', 'Estado' => $status],
            'attendance', 'incidents' => ['ID' => $r->id, 'Estudiante' => $name($r->student), 'Curso' => $r->session?->course?->name, 'Fecha' => $date($r->session?->date), 'Estado' => $status, 'Justificación' => $r->justification?->status ?? 'Sin justificación'],
            'requests' => ['ID' => $r->id, 'Código' => $r->request_code, 'Estudiante' => $name($r->student), 'Tipo' => $r->type?->name, 'Estado' => $status, 'Fecha' => $date($r->created_at)],
            'payments' => ['ID' => $r->id, 'Estudiante' => $name($r->student), 'Año' => $r->academicYear?->name, 'Concepto' => $r->concept?->name, 'Monto PEN' => $r->amount, 'Vence' => $date($r->due_date), 'Estado' => $status, 'Validado' => $r->validated_by ? 'Sí' : 'No'],
            'communications' => ['ID' => $r->id, 'Título' => $r->title, 'Publicado' => $date($r->published_at), 'Estado' => $status],
        };
    }
}
