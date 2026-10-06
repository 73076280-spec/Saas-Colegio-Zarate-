<?php

namespace Database\Factories;

use App\Models\Classroom\CourseUnit;
use App\Models\Courses\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class CourseUnitFactory extends Factory
{
    protected $model = CourseUnit::class;

    public function definition(): array
    {
        return ['course_id' => Course::factory(), 'title' => 'Unidad ficticia', 'description' => 'Contenido de prueba.', 'sequence' => 1, 'status' => 'DRAFT'];
    }
}
