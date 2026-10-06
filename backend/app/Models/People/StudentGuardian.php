<?php

namespace App\Models\People;

use App\Enums\FamilyRelationship;
use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentGuardian extends Model
{
    use BelongsToInstitution;

    protected $table = 'student_guardian';

    protected $guarded = ['id', 'institution_id', 'primary_student_id'];

    protected $hidden = ['primary_student_id'];

    protected function casts(): array
    {
        return ['relationship' => FamilyRelationship::class, 'is_primary' => 'boolean', 'can_pick_up' => 'boolean', 'receives_notifications' => 'boolean'];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Guardian::class);
    }

    protected static function booted(): void
    {
        static::saving(function (self $link) {
            if (! $link->student()->exists() || ! $link->guardian()->exists()) {
                throw new \LogicException('Family members must belong to the current institution.');
            }
            if ($link->exists && ($link->isDirty('student_id') || $link->isDirty('guardian_id'))) {
                throw new \LogicException('Family relation identities are immutable.');
            }
        });
    }
}
