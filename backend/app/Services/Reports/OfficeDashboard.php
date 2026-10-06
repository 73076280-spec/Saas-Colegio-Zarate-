<?php

namespace App\Services\Reports;

use App\Models\Academic\EducationLevel;
use App\Models\Attendance\AbsenceJustification;
use App\Models\AuditLog;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\StudentPayment;
use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Models\People\Student;
use App\Models\People\Teacher;
use App\Models\User;

class OfficeDashboard
{
    public function data(User $user, ?int $year, string $role): array
    {
        $d = new DashboardData($user);
        $e = Enrollment::when($year, fn ($q) => $q->where('academic_year_id', $year));
        $d->metric('students.view', 'Estudiantes activos', fn () => Student::where('status', 'ACTIVE')->count());
        $d->metric('enrollments.view', 'Matrículas pendientes', fn () => (clone $e)->where('status', 'PENDING')->count());
        $d->metric('requests.view', 'Solicitudes pendientes', fn () => AcademicRequest::whereIn('status', ['REGISTERED', 'OBSERVED'])->count());
        $d->metric('justifications.view', 'Justificaciones pendientes', fn () => AbsenceJustification::whereIn('status', ['PENDING', 'IN_REVIEW'])->count());
        if ($role === 'ADMINISTRATOR') {
            $d->metric('teachers.view', 'Docentes activos', fn () => Teacher::where('status', 'ACTIVE')->count());
            $d->metric('enrollments.view', 'Matrículas aprobadas', fn () => (clone $e)->where('status', 'APPROVED')->count());
            $d->metric('courses.view', 'Cursos activos', fn () => Course::when($year, fn ($q) => $q->where('academic_year_id', $year))->where('status', 'ACTIVE')->count());
            $d->metric('payments.view', 'Pagos pendientes', fn () => StudentPayment::when($year, fn ($q) => $q->where('academic_year_id', $year))->whereIn('status', ['PENDING', 'OVERDUE'])->count());
            $d->table('enrollments.view', 'Matrículas por estado', fn () => (clone $e)->selectRaw('status AS Estado, COUNT(*) AS Total')->groupBy('status')->get()->toArray());
            $d->table('enrollments.view', 'Estudiantes aprobados por nivel', function () use ($e) {
                $counts = (clone $e)->where('enrollments.status', 'APPROVED')->join('grade_levels', 'grade_levels.id', '=', 'enrollments.grade_level_id')
                    ->selectRaw('grade_levels.education_level_id, COUNT(DISTINCT enrollments.student_id) AS total')
                    ->groupBy('grade_levels.education_level_id')->pluck('total', 'education_level_id');

                return EducationLevel::get()->map(fn ($l) => ['Nivel' => $l->name, 'Estudiantes' => (int) ($counts[$l->id] ?? 0)])->all();
            });
            $d->table('audit.view', 'Actividad reciente', fn () => AuditLog::latest('id')->limit(5)->get()->map(fn ($a) => ['Acción' => $a->action->value, 'Fecha' => $a->created_at?->toDateTimeString()])->all());
        } else {
            $d->metric('enrollments.view', 'Matrículas observadas', fn () => (clone $e)->where('status', 'OBSERVED')->count());
            $d->metric('requests.view', 'Solicitudes en revisión', fn () => AcademicRequest::where('status', 'IN_REVIEW')->count());
            $d->metric('documents.view', 'Documentos pendientes', fn () => AcademicDocument::where('status', 'DRAFT')->count());
        }
        $d->table('requests.view', 'Solicitudes recientes', fn () => AcademicRequest::latest('id')->limit(5)->get()->map(fn ($r) => ['Código' => $r->request_code, 'Estado' => $r->status])->all());
        foreach ([['enrollments.view', 'Matrículas', '/app/enrollments'], ['justifications.view', 'Justificaciones', '/app/justifications'], ['requests.view', 'Solicitudes', '/app/requests'], ['documents.view', 'Documentos', '/app/documents'], ['communications.view', 'Comunicaciones', '/app/communications']] as $link) {
            $d->link(...$link);
        }

        return $d->toArray();
    }
}
