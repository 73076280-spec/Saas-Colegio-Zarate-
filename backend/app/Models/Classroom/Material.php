<?php

namespace App\Models\Classroom;

use App\Models\User;
use Database\Factories\MaterialFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Material extends ClassroomRecord
{
    use HasFactory;

    protected static function newFactory()
    {
        return MaterialFactory::new();
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(CourseUnit::class, 'course_unit_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
