<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Enums\TeacherStatus;
use App\Models\People\Teacher;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\People\PeopleCatalog;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition(): array
    {
        app(InstitutionContext::class)->requireId();

        return ['user_id' => function () {
            $user = User::factory()->create();
            $user->assignRole(PeopleCatalog::role('teachers')->value);

            return $user->id;
        },
            'document_type' => DocumentType::PASSPORT, 'document_number' => 'TEST-'.fake()->unique()->bothify('??########'),
            'teacher_code' => 'TCH-'.fake()->unique()->bothify('??######'), 'specialty' => 'Especialidad ficticia', 'hire_date' => '2026-02-01', 'status' => TeacherStatus::ACTIVE];
    }
}
