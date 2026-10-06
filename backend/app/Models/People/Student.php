<?php

namespace App\Models\People;

use App\Enums\DocumentType;
use App\Enums\PersonGender;
use App\Enums\StudentStatus;
use Database\Factories\StudentFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Person
{
    protected function casts(): array
    {
        return ['status' => StudentStatus::class, 'document_type' => DocumentType::class, 'birth_date' => 'date:Y-m-d', 'admission_date' => 'date:Y-m-d', 'gender' => PersonGender::class];
    }

    protected static function newFactory()
    {
        return StudentFactory::new();
    }

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class, 'student_guardian')->withPivot(['id', 'relationship', 'is_primary', 'can_pick_up', 'receives_notifications'])->withTimestamps();
    }

    public function familyLinks(): HasMany
    {
        return $this->hasMany(StudentGuardian::class);
    }
}
