<?php

namespace App\Models\People;

use App\Enums\DocumentType;
use App\Enums\GuardianStatus;
use Database\Factories\GuardianFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guardian extends Person
{
    protected function casts(): array
    {
        return ['status' => GuardianStatus::class, 'document_type' => DocumentType::class];
    }

    protected static function newFactory()
    {
        return GuardianFactory::new();
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_guardian')->withPivot(['id', 'relationship', 'is_primary', 'can_pick_up', 'receives_notifications'])->withTimestamps();
    }

    public function familyLinks(): HasMany
    {
        return $this->hasMany(StudentGuardian::class);
    }
}
