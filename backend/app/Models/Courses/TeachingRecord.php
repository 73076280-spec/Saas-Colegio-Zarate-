<?php

namespace App\Models\Courses;

use App\Models\Academic\AcademicYear;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Academic\Subject;
use App\Models\Concerns\BelongsToInstitution;
use App\Models\People\Teacher;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

abstract class TeachingRecord extends Model
{
    use BelongsToInstitution;

    protected $guarded = ['id', 'institution_id'];

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function gradeLevel(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    protected static function booted(): void
    {
        static::saving(function (self $r) {
            if (! $r->academicYear()->exists() || ! $r->teacher()->exists() || ! $r->subject()->exists() || ! $r->gradeLevel()->exists() || ! $r->section()->where('academic_year_id', $r->academic_year_id)->where('grade_level_id', $r->grade_level_id)->exists()) {
                throw new \LogicException('Invalid institutional teaching references.');
            }
        });
    }
}
