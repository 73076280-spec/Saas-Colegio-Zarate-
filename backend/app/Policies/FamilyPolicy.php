<?php

namespace App\Policies;

use App\Models\People\StudentGuardian;
use App\Models\User;

class FamilyPolicy
{
    public function view(User $user, StudentGuardian $link): bool
    {
        return (int) $user->institution_id === (int) $link->institution_id && $user->can('student-guardians.view');
    }

    public function update(User $user, StudentGuardian $link): bool
    {
        return (int) $user->institution_id === (int) $link->institution_id && $user->can('student-guardians.manage');
    }
}
