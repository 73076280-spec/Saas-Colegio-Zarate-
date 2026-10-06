<?php

namespace App\Models\Enrollment;

use App\Enums\EnrollmentStatus;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Concerns\BelongsToInstitution;
use App\Models\People\Student;
use App\Models\User;
use Database\Factories\EnrollmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enrollment extends Model
{
    use BelongsToInstitution, HasFactory, SoftDeletes;

    protected $guarded = ['id', 'institution_id', 'active_student_id'];

    protected $hidden = ['active_student_id', 'deleted_at'];

    protected function casts(): array
    {
        return ['status' => EnrollmentStatus::class, 'enrolled_at' => 'datetime', 'approved_at' => 'datetime'];
    }

    protected static function newFactory()
    {
        return EnrollmentFactory::new();
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function gradeLevel(): BelongsTo
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function history(): HasMany
    {
        return $this->hasMany(EnrollmentStatusHistory::class)->orderBy('id');
    }

    protected static function booted(): void
    {
        static::saving(function (self $e) {
            if (! $e->student()->exists() || ! $e->academicYear()->exists() || ! $e->gradeLevel()->exists() || ! $e->section()->where('academic_year_id', $e->academic_year_id)->where('grade_level_id', $e->grade_level_id)->exists()) {
                throw new \LogicException('Invalid institutional enrollment references.');
            }
        });
        static::deleting(function (self $e) {
            if ($e->isForceDeleting()) {
                throw new \LogicException('Enrollment history must be preserved.');
            }
        });
    }
}
