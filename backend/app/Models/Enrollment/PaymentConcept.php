<?php

namespace App\Models\Enrollment;

use App\Models\Concerns\BelongsToInstitution;
use Database\Factories\PaymentConceptFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentConcept extends Model
{
    use BelongsToInstitution, HasFactory;

    protected $guarded = ['id', 'institution_id'];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2'];
    }

    protected static function newFactory()
    {
        return PaymentConceptFactory::new();
    }
}
