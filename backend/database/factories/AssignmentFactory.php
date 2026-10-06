<?php

namespace Database\Factories;

use App\Models\Courses\Course;
use App\Models\Learning\Assignment;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssignmentFactory extends Factory
{
    protected $model = Assignment::class;

    public function definition(): array
    {
        $course = Course::factory()->create(['status' => 'ACTIVE']);

        return ['course_id' => $course->id, 'title' => 'Tarea ficticia', 'description' => 'Ejercicio de prueba.', 'due_at' => now()->addDay(), 'allow_late_submission' => false, 'status' => 'DRAFT', 'created_by' => $course->teacher->user_id];
    }
}
