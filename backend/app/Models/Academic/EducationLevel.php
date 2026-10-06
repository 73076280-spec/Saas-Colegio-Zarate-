<?php

namespace App\Models\Academic;

use App\Enums\CatalogStatus;
use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EducationLevel extends AcademicRecord
{
    use BelongsToInstitution, SoftDeletes;

    protected function casts(): array
    {
        return ['status' => CatalogStatus::class, 'sort_order' => 'integer'];
    }

    public function ownerInstitutionId(): int
    {
        return (int) $this->institution_id;
    }

    public function gradeLevels(): HasMany
    {
        return $this->hasMany(GradeLevel::class);
    }
}
