<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class OfficePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(InstitutionContext::class)->requireId();
        $permissions = [];
        foreach (['requests' => ['view', 'create', 'review', 'observe', 'approve', 'reject', 'complete'], 'documents' => ['view', 'create', 'issue'], 'communications' => ['view', 'create', 'publish', 'archive'], 'notifications' => ['view']] as $kind => $actions) {
            foreach ($actions as $action) {
                $name = "$kind.$action";
                Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
                $permissions[] = $name;
            }
        }
        foreach (['ADMINISTRATOR', 'SECRETARY'] as $role) {
            Role::where('name', $role)->firstOrFail()->givePermissionTo($permissions);
        }
        foreach (['STUDENT', 'GUARDIAN'] as $role) {
            Role::where('name', $role)->firstOrFail()->givePermissionTo(['requests.view', 'requests.create', 'documents.view', 'communications.view', 'notifications.view']);
        }
        foreach (['TEACHER', 'TREASURY'] as $role) {
            Role::where('name', $role)->firstOrFail()->givePermissionTo(['communications.view', 'notifications.view']);
        }
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
