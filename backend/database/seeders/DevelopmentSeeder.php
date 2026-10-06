<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Institution;
use App\Models\User;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;

class DevelopmentSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('DevelopmentSeeder solo está permitido en local/testing.');
        }
        $this->call(DatabaseSeeder::class);
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () {
            foreach (RoleName::cases() as $role) {
                $user = User::firstOrCreate(['email' => strtolower($role->value).'@zarate.test'], [
                    'first_name' => 'Demo', 'last_name' => $role->value, 'password' => 'ZarateDemo2026!', 'status' => 'ACTIVE', 'must_change_password' => false,
                ]);
                $user->syncRoles([$role->value]);
            }
        });
    }
}
