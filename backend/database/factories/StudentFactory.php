<?php

namespace Database\Factories;

use App\Enums\DocumentType;
use App\Enums\StudentStatus;
use App\Models\People\Student;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\People\PeopleCatalog;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        app(InstitutionContext::class)->requireId();

        return ['user_id' => function () {
            $user = User::factory()->create();
            $user->assignRole(PeopleCatalog::role('students')->value);

            return $user->id;
        },
            'document_type' => DocumentType::PASSPORT, 'document_number' => 'TEST-'.fake()->unique()->bothify('??########'),
            'student_code' => 'STU-'.fake()->unique()->bothify('??######'), 'birth_date' => '2012-06-15', 'admission_date' => '2026-03-02', 'status' => StudentStatus::ACTIVE];
    }
}
