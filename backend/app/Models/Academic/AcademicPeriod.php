<?php

namespace App\Models\Academic;

use App\Enums\AcademicPeriodStatus;
use App\Models\Concerns\BelongsToInstitutionThroughParent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicPeriod extends AcademicRecord
{
    use BelongsToInstitutionThroughParent;

    protected function casts(): array
    {
        return ['status' => AcademicPeriodStatus::class, 'start_date' => 'date:Y-m-d', 'end_date' => 'date:Y-m-d', 'grading_open' => 'boolean', 'sequence' => 'integer'];
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    protected function institutionParent(): string
    {
        return 'academicYear';
    }
}
