<?php

namespace App\Models\Academic;

use App\Enums\CatalogStatus;
use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends AcademicRecord
{
    use BelongsToInstitution, SoftDeletes;

    protected function casts(): array
    {
        return ['status' => CatalogStatus::class];
    }

    public function ownerInstitutionId(): int
    {
        return (int) $this->institution_id;
    }
}
