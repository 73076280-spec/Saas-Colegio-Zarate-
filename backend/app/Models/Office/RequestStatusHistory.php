<?php

namespace App\Models\Office;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestStatusHistory extends OfficeRecord
{
    protected $table = 'request_status_history';

    public $timestamps = false;

    protected static function booted(): void
    {
        parent::booted();
        static::updating(fn () => throw new \LogicException('Request history is immutable.'));
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(AcademicRequest::class, 'academic_request_id');
    }
}
