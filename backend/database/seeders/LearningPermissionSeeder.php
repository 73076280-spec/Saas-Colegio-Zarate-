<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class LearningPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        $permissions = [];
        foreach (['assignments' => ['view', 'create', 'update', 'publish', 'close'], 'submissions' => ['view', 'review'], 'assessments' => ['view', 'create', 'update', 'publish', 'close'], 'scores' => ['view', 'create', 'update']] as $kind => $actions) {
            foreach ($actions as $action) {
                $name = "$kind.$action";
                Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
                $permissions[] = $name;
            }
        }
        foreach (['ADMINISTRATOR', 'TEACHER'] as $role) {
            Role::where('name', $role)->firstOrFail()->givePermissionTo($permissions);
        }
        Role::where('name', 'STUDENT')->firstOrFail()->givePermissionTo(['assignments.view', 'submissions.view', 'assessments.view', 'scores.view']);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
