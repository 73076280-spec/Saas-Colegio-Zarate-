<?php

namespace App\Services;

use App\Enums\RoleName;
use App\Enums\UserStatus;
use App\Models\Institution;
use App\Models\Role;
use App\Models\User;
use App\Services\People\PeopleCatalog;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function save(User $actor, array $data, ?User $target = null): User
    {
        return DB::transaction(function () use ($actor, $data, $target) {
            Institution::whereKey($actor->institution_id)->lockForUpdate()->firstOrFail();
            $roles = $data['roles'] ?? null;
            unset($data['roles']);
            if ($roles !== null) {
                abort_unless($actor->can('roles.manage'), 403);
                if ($target) {
                    foreach (PeopleCatalog::MODELS as $type => $model) {
                        if ($model::where('user_id', $target->id)->exists() && ! in_array(PeopleCatalog::role($type)->value, $roles, true)) {
                            throw ValidationException::withMessages(['roles' => 'An existing person profile requires its corresponding role.']);
                        }
                    }
                }
                $roleModels = Role::whereIn('name', $roles)->get();
                foreach ($roleModels as $role) {
                    foreach ($role->permissions as $permission) {
                        abort_unless($actor->can($permission->name), 403, 'No puedes delegar permisos que no posees.');
                    }
                }
            }
            if ($target && isset($data['status']) && $data['status'] !== $target->status->value) {
                abort_unless($actor->can('users.disable'), 403);
            }
            if ($target?->hasRole(RoleName::ADMINISTRATOR->value) &&
                (($data['status'] ?? $target->status->value) !== UserStatus::ACTIVE->value ||
                ($roles !== null && ! in_array(RoleName::ADMINISTRATOR->value, $roles, true)))) {
                $otherAdmins = User::where('id', '!=', $target->id)->where('status', UserStatus::ACTIVE)->role(RoleName::ADMINISTRATOR->value)->exists();
                if (! $otherAdmins) {
                    throw ValidationException::withMessages(['status' => 'Debe permanecer al menos un administrador activo.']);
                }
            }
            if ($target && $actor->id === $target->id && isset($data['status']) && $data['status'] !== UserStatus::ACTIVE->value) {
                throw ValidationException::withMessages(['status' => 'No puedes desactivar tu propia cuenta.']);
            }
            $user = $target ?? new User;
            if (! $target) {
                $user->must_change_password = true;
            }
            $user->fill($data)->save();
            if ($roles !== null) {
                $user->syncRoles($roleModels);
            }

            return $user->refresh();
        });
    }

    public function disable(User $actor, User $target): User
    {
        return $this->save($actor, ['status' => UserStatus::INACTIVE->value], $target);
    }
}
