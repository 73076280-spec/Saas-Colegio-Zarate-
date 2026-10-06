<?php

namespace Database\Factories;

use App\Models\Enrollment\PaymentConcept;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentConceptFactory extends Factory
{
    protected $model = PaymentConcept::class;

    public function definition(): array
    {
        return ['name' => 'Concepto ficticio', 'code' => 'TEST-'.fake()->unique()->numerify('########'), 'amount' => '150.00', 'status' => 'ACTIVE'];
    }
}
