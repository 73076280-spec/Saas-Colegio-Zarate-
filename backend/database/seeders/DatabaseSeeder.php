<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $institution = Institution::firstOrCreate(['code' => 'ZARATE'], ['name' => 'Colegio Zárate de Huancayo', 'status' => 'ACTIVE']);
        app(InstitutionContext::class)->run($institution->id, fn () => $this->call(RolePermissionSeeder::class));
    }
}
