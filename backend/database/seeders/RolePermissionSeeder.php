<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Role;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public const PERMISSIONS = ['users.view', 'users.create', 'users.update', 'users.disable', 'roles.view', 'roles.manage', 'institutions.view', 'institutions.update', 'profile.view', 'profile.update', 'audit.view'];

    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        foreach (self::PERMISSIONS as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
        foreach (RoleName::cases() as $role) {
            $model = Role::firstOrCreate(['name' => $role->value, 'guard_name' => 'web', 'institution_id' => app(InstitutionContext::class)->requireId()]);
            $model->givePermissionTo($role === RoleName::ADMINISTRATOR ? self::PERMISSIONS : ['profile.view', 'profile.update']);
        }
        $this->call(AcademicPermissionSeeder::class);
        $this->call(PeoplePermissionSeeder::class);
        $this->call(EnrollmentPermissionSeeder::class);
        $this->call(CoursePermissionSeeder::class);
        $this->call(ClassroomPermissionSeeder::class);
        $this->call(LearningPermissionSeeder::class);
        $this->call(AttendancePermissionSeeder::class);
        $this->call(OfficePermissionSeeder::class);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
