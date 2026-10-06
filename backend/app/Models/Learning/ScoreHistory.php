<?php

namespace App\Models\Learning;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScoreHistory extends LearningRecord
{
    protected $table = 'score_history';

    public $timestamps = false;

    protected function casts(): array
    {
        return ['old_score' => 'decimal:2', 'new_score' => 'decimal:2', 'created_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        parent::booted();
        static::updating(fn () => throw new \LogicException('Score history is immutable.'));
    }

    public function score(): BelongsTo
    {
        return $this->belongsTo(Score::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
