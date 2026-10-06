<?php

namespace App\Services\Reports;

use App\Models\Attendance\AttendanceSession;
use App\Models\Enrollment\Enrollment;
use App\Models\Learning\Assessment;
use App\Models\Learning\Assignment;
use App\Models\Learning\Submission;
use App\Models\User;
use App\Services\Courses\CourseAccess;

class TeacherDashboard
{
    public function data(User $user, ?int $year): array
    {
        $d = new DashboardData($user);
        $ids = app(CourseAccess::class)->visible($user, true)->where('status', 'ACTIVE')
            ->when($year, fn ($c) => $c->where('academic_year_id', $year))->pluck('id');
        $d->metric('profile.view', 'Cursos activos', fn () => $ids->count());
        $d->metric('profile.view', 'Estudiantes', fn () => Enrollment::where('status', 'APPROVED')->whereHas('student', fn ($s) => $s->where('status', 'ACTIVE'))->whereExists(function ($c) use ($ids) {
            $c->selectRaw('1')->from('courses')->whereIn('courses.id', $ids)->whereColumn('courses.institution_id', 'enrollments.institution_id')
                ->whereColumn('courses.academic_year_id', 'enrollments.academic_year_id')->whereColumn('courses.grade_level_id', 'enrollments.grade_level_id')->whereColumn('courses.section_id', 'enrollments.section_id');
        })->distinct()->count('student_id'));
        $d->metric('assignments.view', 'Tareas activas', fn () => Assignment::whereIn('course_id', $ids)->where('status', 'PUBLISHED')->count());
        $d->metric('submissions.view', 'Entregas pendientes de revisión', fn () => Submission::whereHas('assignment', fn ($a) => $a->whereIn('course_id', $ids))->whereNull('reviewed_at')->count());
        $d->metric('assessments.view', 'Evaluaciones próximas (7 días)', fn () => Assessment::whereIn('course_id', $ids)->where('status', 'PUBLISHED')->whereBetween('evaluation_date', [today(), today()->addDays(7)])->count());
        $d->table('attendance.view', 'Sesiones recientes', fn () => AttendanceSession::with('course')->whereIn('course_id', $ids)->latest('date')->limit(5)->get()->map(fn ($s) => ['Curso' => $s->course?->name, 'Fecha' => $s->date?->toDateString(), 'Estado' => $s->status])->all());
        $d->link('profile.view', 'Mis cursos', '/app/my-courses');
        foreach (['assignments.view' => 'Tareas', 'assessments.view' => 'Evaluaciones', 'scores.view' => 'Calificaciones', 'attendance.view' => 'Asistencia'] as $permission => $label) {
            $d->link($permission, $label.' por curso', '/app/my-courses');
        }

        return $d->toArray();
    }
}
