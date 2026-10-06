<?php

namespace App\Models\Academic;

use App\Enums\CatalogStatus;
use App\Models\Concerns\BelongsToInstitutionThroughParent;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class GradeLevel extends AcademicRecord
{
    use BelongsToInstitutionThroughParent, SoftDeletes;

    protected function casts(): array
    {
        return ['status' => CatalogStatus::class, 'sort_order' => 'integer'];
    }

    public function educationLevel(): BelongsTo
    {
        return $this->belongsTo(EducationLevel::class);
    }

    protected function institutionParent(): string
    {
        return 'educationLevel';
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }
}
