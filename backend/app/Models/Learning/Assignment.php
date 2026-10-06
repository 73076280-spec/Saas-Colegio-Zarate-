<?php

namespace App\Models\Learning;

use App\Models\Classroom\CourseUnit;
use App\Models\Courses\Course;
use Database\Factories\AssignmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends LearningRecord
{
    use HasFactory, SoftDeletes;

    protected static function newFactory()
    {
        return AssignmentFactory::new();
    }

    protected function casts(): array
    {
        return ['due_at' => 'datetime', 'published_at' => 'datetime', 'allow_late_submission' => 'boolean', 'max_score' => 'decimal:2'];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(CourseUnit::class, 'course_unit_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }
}
