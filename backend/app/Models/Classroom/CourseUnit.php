<?php

namespace App\Models\Classroom;

use Database\Factories\CourseUnitFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseUnit extends ClassroomRecord
{
    use HasFactory;

    protected static function newFactory()
    {
        return CourseUnitFactory::new();
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }
}
