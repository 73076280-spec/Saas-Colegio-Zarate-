<?php

namespace Database\Factories;

use App\Models\Academic\Subject;
use App\Models\Courses\TeacherAssignment;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherAssignmentFactory extends Factory
{
    protected $model = TeacherAssignment::class;

    public function definition(): array
    {
        $e = Enrollment::factory()->create();
        $subject = Subject::create(['name' => 'Asignatura ficticia '.fake()->unique()->numerify('########'), 'code' => 'TEST-'.fake()->unique()->numerify('########'), 'status' => 'ACTIVE']);

        return ['academic_year_id' => $e->academic_year_id, 'grade_level_id' => $e->grade_level_id, 'section_id' => $e->section_id, 'subject_id' => $subject->id, 'teacher_id' => Teacher::factory(), 'status' => 'ACTIVE'];
    }
}
