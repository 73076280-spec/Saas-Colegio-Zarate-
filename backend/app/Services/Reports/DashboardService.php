<?php

namespace App\Services\Reports;

use App\Models\Academic\AcademicYear;
use App\Models\User;

class DashboardService
{
    public function data(User $user, ?int $yearId): array
    {
        abort_unless($user->can('profile.view'), 403);
        $year = $yearId ? AcademicYear::findOrFail($yearId) : AcademicYear::where('is_current', true)->first();
        $role = collect(['ADMINISTRATOR', 'SECRETARY', 'TREASURY', 'TEACHER', 'STUDENT', 'GUARDIAN'])
            ->first(fn ($role) => $user->hasRole($role));
        $data = match ($role) {
            'ADMINISTRATOR', 'SECRETARY' => app(OfficeDashboard::class)->data($user, $year?->id, $role),
            'TREASURY' => app(TreasuryDashboard::class)->data($user, $year?->id),
            'TEACHER' => app(TeacherDashboard::class)->data($user, $year?->id),
            'STUDENT', 'GUARDIAN' => app(FamilyDashboard::class)->data($user, $year?->id, $role),
            default => ['cards' => [], 'sections' => [], 'links' => []],
        };
        if ($user->can('notifications.view')) {
            $data['cards'][] = ['label' => 'Notificaciones no leídas', 'value' => $user->notifications()->whereNull('read_at')->count()];
            $data['links'][] = ['label' => 'Mis notificaciones', 'path' => '/app/notifications'];
        }

        return $data + [
            'role' => $role,
            'academic_year' => $year ? ['id' => $year->id, 'name' => $year->name] : null,
            'years' => AcademicYear::orderByDesc('start_date')->get(['id', 'name'])->toArray(),
            'scope_note' => 'Matrículas, cursos, pagos y aprendizaje: año seleccionado o actual. Personas y trámites: estado institucional actual.',
        ];
    }
}
