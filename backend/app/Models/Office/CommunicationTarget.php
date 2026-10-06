<?php

namespace App\Models\Office;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommunicationTarget extends OfficeRecord
{
    public $timestamps = false;

    public function communication(): BelongsTo
    {
        return $this->belongsTo(Communication::class);
    }
}
