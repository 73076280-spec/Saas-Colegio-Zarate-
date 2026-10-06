<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
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
