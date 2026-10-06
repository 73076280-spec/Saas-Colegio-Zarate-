<?php

namespace Database\Factories;

use App\Models\Classroom\Material;
use App\Models\Courses\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MaterialFactory extends Factory
{
    protected $model = Material::class;

    public function definition(): array
    {
        return ['course_id' => Course::factory(), 'title' => 'Lectura ficticia', 'type' => 'TEXT', 'description' => 'Contenido educativo ficticio.', 'status' => 'DRAFT', 'created_by' => User::factory()];
    }
}
