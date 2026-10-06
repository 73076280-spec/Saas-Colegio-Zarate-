<?php

namespace App\Services\Reports;

use App\Models\People\Student;
use App\Models\User;
use App\Services\Office\OfficeAccess;

class FamilyDashboard
{
    public function data(User $user, ?int $year, string $role): array
    {
        $d = new DashboardData($user);
        $students = Student::with('user')->where('status', 'ACTIVE')->whereIn('id', app(OfficeAccess::class)->students($user))->get();
        foreach ($students as $student) {
            foreach (app(StudentSummary::class)->sections($user, $student, $year, $role === 'GUARDIAN') as $section) {
                $d->sections[] = $section;
            }
        }
        $d->link('profile.view', 'Matrícula', '/app/enrollments');
        if ($role === 'STUDENT') {
            $d->link('profile.view', 'Mis cursos', '/app/my-courses');
            $d->link('assignments.view', 'Mis tareas', '/app/my-assignments');
        }
        $d->link('attendance.view', 'Asistencia', $role === 'GUARDIAN' ? '/app/family-attendance' : '/app/my-attendance');
        $d->link('requests.view', 'Mis solicitudes', '/app/my-requests');

        return $d->toArray();
    }
}
