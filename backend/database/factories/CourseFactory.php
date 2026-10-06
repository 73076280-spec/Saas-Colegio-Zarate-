<?php

namespace Database\Factories;

use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Services\Courses\TeachingService;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $a = TeacherAssignment::factory()->create();

        return array_intersect_key($a->getAttributes(), array_flip(TeachingService::KEYS)) + ['teacher_assignment_id' => $a->id, 'name' => 'Curso ficticio', 'code' => 'TEST-'.fake()->unique()->numerify('########'), 'status' => 'DRAFT'];
    }
}
