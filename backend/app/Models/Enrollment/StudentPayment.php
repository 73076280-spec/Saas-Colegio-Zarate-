<?php

namespace App\Models\Enrollment;

use App\Enums\PaymentStatus;
use App\Models\Academic\AcademicYear;
use App\Models\Concerns\BelongsToInstitution;
use App\Models\People\Student;
use App\Models\User;
use Database\Factories\StudentPaymentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentPayment extends Model
{
    use BelongsToInstitution, HasFactory;

    protected $guarded = ['id', 'institution_id'];

    protected function casts(): array
    {
        return ['amount' => 'decimal:2', 'status' => PaymentStatus::class, 'due_date' => 'date:Y-m-d', 'paid_at' => 'datetime'];
    }

    protected static function newFactory()
    {
        return StudentPaymentFactory::new();
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function concept(): BelongsTo
    {
        return $this->belongsTo(PaymentConcept::class, 'payment_concept_id');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    protected static function booted(): void
    {
        static::saving(function (self $p) {
            if (! $p->student()->exists() || ! $p->academicYear()->exists() || ! $p->concept()->exists() || ($p->validated_by && ! $p->validator()->exists())) {
                throw new \LogicException('Invalid institutional payment references.');
            }
        });
    }
}
