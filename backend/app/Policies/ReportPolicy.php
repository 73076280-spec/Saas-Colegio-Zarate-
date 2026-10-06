<?php

namespace App\Policies;

use App\Models\User;
use App\Services\Reports\ReportCatalog;

class ReportPolicy
{
    public function view(User $user, string $report): bool
    {
        $definition = ReportCatalog::get($report);
        if ($user->hasRole('ADMINISTRATOR')) {
            return $user->can($definition[2]);
        }
        $roles = match ($definition[3]) {
            'payments' => ['TREASURY'],
            'scores', 'assessments', 'assignments', 'missing', 'courses', 'workload' => ['TEACHER'],
            'attendance', 'incidents' => ['TEACHER', 'SECRETARY'],
            default => ['SECRETARY'],
        };
        $permission = $user->hasRole('TEACHER') && in_array($definition[3], ['courses', 'workload'])
            ? 'profile.view' : $definition[2];

        return $user->hasAnyRole($roles) && $user->can($permission);
    }
}
