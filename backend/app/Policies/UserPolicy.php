<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAvatar(User $actor, User $target): bool
    {
        if (! $this->same($actor, $target)) {
            return false;
        }
        if ($actor->id === $target->id) {
            return $actor->can('profile.view');
        }
        if ($actor->can('users.view')) {
            return true;
        }
        foreach (['student' => 'students', 'teacher' => 'teachers', 'guardian' => 'guardians'] as $relation => $permission) {
            if ($actor->can($permission.'.view') && $target->$relation()->exists()) {
                return true;
            }
        }

        return $actor->can('profile.view') && $actor->hasRole('GUARDIAN')
            && $actor->guardian?->status->value === 'ACTIVE'
            && $actor->guardian->students()->where('user_id', $target->id)->where('status', 'ACTIVE')->exists();
    }

    public function viewAny(User $actor): bool
    {
        return $actor->can('users.view');
    }

    public function view(User $actor, User $target): bool
    {
        return $this->same($actor, $target) && $actor->can('users.view');
    }

    public function create(User $actor): bool
    {
        return $actor->can('users.create');
    }

    public function update(User $actor, User $target): bool
    {
        return $this->same($actor, $target) && $actor->can('users.update');
    }

    public function disable(User $actor, User $target): bool
    {
        return $this->same($actor, $target) && $actor->can('users.disable');
    }

    private function same(User $a, User $b): bool
    {
        return (int) $a->institution_id === (int) $b->institution_id;
    }
}
