<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('roles.view');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->institution_id === $role->institution_id && $user->can('roles.manage');
    }
}
