<?php

namespace App\Models\Academic;

use App\Enums\AcademicYearStatus;
use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicYear extends AcademicRecord
{
    use BelongsToInstitution, SoftDeletes;

    protected function casts(): array
    {
        return ['status' => AcademicYearStatus::class, 'start_date' => 'date:Y-m-d', 'end_date' => 'date:Y-m-d', 'is_current' => 'boolean'];
    }

    public function ownerInstitutionId(): int
    {
        return (int) $this->institution_id;
    }

    public function periods(): HasMany
    {
        return $this->hasMany(AcademicPeriod::class)->orderBy('sequence');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }
}
