<?php

namespace App\Models\Courses;

use App\Enums\CourseStatus;
use App\Models\Classroom\CourseUnit;
use App\Models\Classroom\Material;
use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends TeachingRecord
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return ['status' => CourseStatus::class];
    }

    protected static function newFactory()
    {
        return CourseFactory::new();
    }

    public function units(): HasMany
    {
        return $this->hasMany(CourseUnit::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(Material::class);
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(TeacherAssignment::class, 'teacher_assignment_id');
    }

    protected static function booted(): void
    {
        parent::booted();
        static::saving(function (self $c) {
            if ($c->teacher_assignment_id && ! $c->assignment()->where('teacher_id', $c->teacher_id)->where('academic_year_id', $c->academic_year_id)->where('subject_id', $c->subject_id)->where('grade_level_id', $c->grade_level_id)->where('section_id', $c->section_id)->exists()) {
                throw new \LogicException('Course assignment is inconsistent.');
            }
        });
        static::deleting(function (self $c) {
            if ($c->isForceDeleting()) {
                throw new \LogicException('Academic history must be preserved.');
            }
        });
    }
}
