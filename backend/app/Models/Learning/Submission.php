<?php

namespace App\Models\Learning;

use App\Models\People\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends LearningRecord
{
    protected $table = 'assignment_submissions';

    protected function casts(): array
    {
        return ['submitted_at' => 'datetime', 'reviewed_at' => 'datetime', 'is_late' => 'boolean'];
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
