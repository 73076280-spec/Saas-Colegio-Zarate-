<?php

namespace App\Models\Learning;

use App\Models\Academic\AcademicPeriod;
use App\Models\Courses\Course;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assessment extends LearningRecord
{
    protected function casts(): array
    {
        return ['evaluation_date' => 'date:Y-m-d', 'max_score' => 'decimal:2', 'weight' => 'decimal:2'];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(AcademicPeriod::class, 'academic_period_id');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(AssessmentType::class, 'assessment_type_id');
    }

    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }
}
