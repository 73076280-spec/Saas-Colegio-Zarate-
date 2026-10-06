<?php

namespace App\Models;

use App\Enums\AuditAction;
use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use BelongsToInstitution;

    public $timestamps = false;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return ['action' => AuditAction::class, 'old_values' => 'array', 'new_values' => 'array', 'created_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
