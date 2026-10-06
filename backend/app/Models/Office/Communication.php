<?php

namespace App\Models\Office;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Communication extends OfficeRecord
{
    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function targets(): HasMany
    {
        return $this->hasMany(CommunicationTarget::class);
    }
}
