<?php

namespace Database\Factories;

use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\PaymentConcept;
use App\Models\Enrollment\StudentPayment;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentPaymentFactory extends Factory
{
    protected $model = StudentPayment::class;

    public function definition(): array
    {
        $e = Enrollment::factory()->create();

        return ['student_id' => $e->student_id, 'academic_year_id' => $e->academic_year_id, 'payment_concept_id' => PaymentConcept::factory(), 'amount' => '150.00', 'status' => 'PENDING'];
    }
}
