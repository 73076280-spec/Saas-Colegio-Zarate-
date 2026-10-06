<?php

namespace App\Models\Classroom;

use App\Models\Concerns\BelongsToInstitution;
use App\Models\Courses\Course;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class ClassroomRecord extends Model
{
    use BelongsToInstitution, SoftDeletes;

    protected $guarded = ['id', 'institution_id'];

    protected $hidden = ['file_path', 'deleted_at'];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    protected static function booted(): void
    {
        static::saving(function (self $record) {
            if (! $record->course()->exists()) {
                throw new \LogicException('Course outside institution context.');
            }
            if ($record instanceof Material && $record->course_unit_id && ! $record->unit()->where('course_id', $record->course_id)->exists()) {
                throw new \LogicException('Unit outside course.');
            }
        });
        static::deleting(function (self $record) {
            if ($record->isForceDeleting() || ($record instanceof CourseUnit && $record->materials()->withTrashed()->exists())) {
                throw new \LogicException('Classroom history must be preserved; archive instead.');
            }
        });
    }
}
