<?php

namespace App\Policies;

use App\Models\Academic\AcademicRecord;
use App\Models\User;
use App\Services\Academic\AcademicCatalog;

class AcademicPolicy
{
    public function view(User $user, AcademicRecord $record): bool
    {
        return $this->allows($user, $record, 'view');
    }

    public function update(User $user, AcademicRecord $record): bool
    {
        return $this->allows($user, $record, 'update');
    }

    public function close(User $user, AcademicRecord $record): bool
    {
        return $this->allows($user, $record, 'close');
    }

    public function disable(User $user, AcademicRecord $record): bool
    {
        return $this->allows($user, $record, 'disable');
    }

    private function allows(User $user, AcademicRecord $record, string $ability): bool
    {
        return (int) $user->institution_id === $record->ownerInstitutionId() && $user->can(AcademicCatalog::key($record).'.'.$ability);
    }
}
