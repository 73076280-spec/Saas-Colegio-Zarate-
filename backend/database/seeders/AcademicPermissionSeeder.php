<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\Academic\AcademicCatalog;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class AcademicPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        foreach (AcademicCatalog::permissions() as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
        foreach (['ADMINISTRATOR', 'SECRETARY', 'TEACHER'] as $name) {
            $role = Role::where('name', $name)->firstOrFail();
            $role->givePermissionTo(array_values(array_filter(AcademicCatalog::permissions(), fn ($p) => $name === 'ADMINISTRATOR' || str_ends_with($p, '.view'))));
        }
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
