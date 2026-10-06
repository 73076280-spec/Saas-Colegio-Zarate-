<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class AttendancePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        $attendance = ['attendance.view', 'attendance.create', 'attendance.update', 'attendance.close'];
        $justifications = ['justifications.view', 'justifications.create', 'justifications.review', 'justifications.approve', 'justifications.reject'];
        foreach (array_merge($attendance, $justifications) as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
        Role::where('name', 'ADMINISTRATOR')->firstOrFail()->givePermissionTo(array_merge($attendance, $justifications));
        Role::where('name', 'TEACHER')->firstOrFail()->givePermissionTo($attendance);
        Role::where('name', 'SECRETARY')->firstOrFail()->givePermissionTo(['attendance.view', 'justifications.view', 'justifications.review', 'justifications.approve', 'justifications.reject']);
        Role::where('name', 'STUDENT')->firstOrFail()->givePermissionTo('attendance.view');
        Role::where('name', 'GUARDIAN')->firstOrFail()->givePermissionTo(['attendance.view', 'justifications.view', 'justifications.create']);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
