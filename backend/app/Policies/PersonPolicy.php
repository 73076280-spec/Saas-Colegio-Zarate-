<?php

namespace App\Policies;

use App\Models\People\Person;
use App\Models\User;
use App\Services\People\PeopleCatalog;

class PersonPolicy
{
    public function view(User $user, Person $person): bool
    {
        return $this->allows($user, $person, 'view');
    }

    public function update(User $user, Person $person): bool
    {
        return $this->allows($user, $person, 'update');
    }

    public function disable(User $user, Person $person): bool
    {
        return $this->allows($user, $person, 'disable');
    }

    private function allows(User $user, Person $person, string $ability): bool
    {
        return (int) $user->institution_id === (int) $person->institution_id && $user->can(PeopleCatalog::key($person).'.'.$ability);
    }
}
