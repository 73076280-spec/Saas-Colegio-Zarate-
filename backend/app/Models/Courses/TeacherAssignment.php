<?php

namespace App\Models\Courses;

use App\Enums\CatalogStatus;
use Database\Factories\TeacherAssignmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeacherAssignment extends TeachingRecord
{
    use HasFactory;

    protected function casts(): array
    {
        return ['status' => CatalogStatus::class];
    }

    protected static function newFactory()
    {
        return TeacherAssignmentFactory::new();
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
