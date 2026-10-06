<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return ['first_name' => fake()->firstName(), 'last_name' => fake()->lastName(), 'email' => fake()->unique()->safeEmail(),
            'password' => 'TestingPass123!', 'status' => 'ACTIVE', 'must_change_password' => false, 'email_verified_at' => now()];
    }
}
