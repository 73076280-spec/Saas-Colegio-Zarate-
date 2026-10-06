<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class CoursePermissionSeeder extends Seeder
{
    public const PERMISSIONS = ['teacher-assignments.view', 'teacher-assignments.create', 'teacher-assignments.update', 'teacher-assignments.disable', 'courses.view', 'courses.create', 'courses.update', 'courses.activate', 'courses.close'];

    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        foreach (self::PERMISSIONS as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
        Role::where('name', 'ADMINISTRATOR')->firstOrFail()->givePermissionTo(self::PERMISSIONS);
        Role::where('name', 'SECRETARY')->firstOrFail()->givePermissionTo(['teacher-assignments.view', 'courses.view']);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
