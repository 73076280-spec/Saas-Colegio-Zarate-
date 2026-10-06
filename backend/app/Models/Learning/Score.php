<?php

namespace App\Models\Learning;

use App\Models\People\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Score extends LearningRecord
{
    protected function casts(): array
    {
        return ['score' => 'decimal:2', 'graded_at' => 'datetime'];
    }

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    public function history(): HasMany
    {
        return $this->hasMany(ScoreHistory::class)->orderBy('id');
    }
}
