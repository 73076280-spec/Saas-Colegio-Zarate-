<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class ClassroomPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        $permissions = [];
        foreach (['course-units', 'materials'] as $resource) {
            foreach (['view', 'create', 'update', 'publish', 'archive'] as $operation) {
                $name = "$resource.$operation";
                Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
                $permissions[] = $name;
            }
        }
        foreach (['ADMINISTRATOR', 'TEACHER'] as $role) {
            Role::where('name', $role)->firstOrFail()->givePermissionTo($permissions);
        }
        Role::where('name', 'STUDENT')->firstOrFail()->givePermissionTo(['course-units.view', 'materials.view']);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
