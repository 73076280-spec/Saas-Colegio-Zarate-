<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\InstitutionContext;
use App\Services\People\PeopleCatalog;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PeoplePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        foreach (PeopleCatalog::permissions() as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
        Role::where('name', 'ADMINISTRATOR')->firstOrFail()->givePermissionTo(PeopleCatalog::permissions());
        Role::where('name', 'SECRETARY')->firstOrFail()->givePermissionTo(['students.view', 'students.create', 'students.update', 'guardians.view', 'guardians.create', 'guardians.update', 'student-guardians.view', 'student-guardians.manage', 'teachers.view']);
        Role::where('name', 'TEACHER')->firstOrFail()->givePermissionTo('students.view');
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
