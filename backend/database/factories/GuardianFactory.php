<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Enums\GuardianStatus;
use App\Models\People\Guardian;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\People\PeopleCatalog;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuardianFactory extends Factory
{
    protected $model = Guardian::class;

    public function definition(): array
    {
        app(InstitutionContext::class)->requireId();

        return ['user_id' => function () {
            $user = User::factory()->create();
            $user->assignRole(PeopleCatalog::role('guardians')->value);

            return $user->id;
        },
            'document_type' => DocumentType::PASSPORT, 'document_number' => 'TEST-'.fake()->unique()->bothify('??########'),
            'occupation' => 'Ocupación ficticia', 'status' => GuardianStatus::ACTIVE];
    }
}
