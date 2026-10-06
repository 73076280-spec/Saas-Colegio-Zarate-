<?php

namespace App\Models\Attendance;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JustificationStatusHistory extends AttendanceModel
{
    protected $table = 'justification_status_history';

    public $timestamps = false;

    protected static function booted(): void
    {
        parent::booted();
        static::updating(fn () => throw new \LogicException('Justification history is immutable.'));
    }

    public function justification(): BelongsTo
    {
        return $this->belongsTo(AbsenceJustification::class, 'absence_justification_id');
    }
}
