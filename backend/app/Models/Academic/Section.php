<?php

namespace App\Models\Academic;

use App\Enums\CatalogStatus;
use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Section extends AcademicRecord
{
    use BelongsToInstitution;

    protected static function booted(): void
    {
        static::saving(function (self $section) {
            if (! $section->academicYear()->exists() || ! $section->gradeLevel()->exists()) {
                throw new \LogicException('Section parents must belong to the current institution.');
            }
        });
    }

    protected function casts(): array
    {
        return ['status' => CatalogStatus::class, 'capacity' => 'integer'];
    }

    public function ownerInstitutionId(): int
    {
        return (int) $this->institution_id;
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function gradeLevel(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class);
    }
}
