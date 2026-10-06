<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class EnrollmentPermissionSeeder extends Seeder
{
    public const ENROLLMENTS = ['enrollments.view', 'enrollments.create', 'enrollments.update', 'enrollments.submit', 'enrollments.observe', 'enrollments.approve', 'enrollments.reject', 'enrollments.cancel'];

    public const PAYMENTS = ['payments.view', 'payments.create', 'payments.update', 'payments.validate'];

    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        foreach (array_merge(self::ENROLLMENTS, self::PAYMENTS) as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
        Role::where('name', 'ADMINISTRATOR')->firstOrFail()->givePermissionTo(array_merge(self::ENROLLMENTS, self::PAYMENTS));
        Role::where('name', 'SECRETARY')->firstOrFail()->givePermissionTo(array_merge(self::ENROLLMENTS, ['payments.view']));
        Role::where('name', 'TREASURY')->firstOrFail()->givePermissionTo(self::PAYMENTS);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
