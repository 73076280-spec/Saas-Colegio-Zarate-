<?php

namespace App\Models\Concerns;

use App\Models\Institution;
use App\Models\Scopes\InstitutionScope;
use App\Services\InstitutionContext;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToInstitution
{
    protected static function bootBelongsToInstitution(): void
    {
        static::addGlobalScope(new InstitutionScope);
        static::creating(function ($model) {
            $id = app(InstitutionContext::class)->requireId();
            if ($model->institution_id !== null && (int) $model->institution_id !== $id) {
                throw new \LogicException('Cross-institution creation denied.');
            }
            $model->institution_id = $id;
        });
        static::updating(function ($model) {
            if ($model->isDirty('institution_id')) {
                throw new \LogicException('Institution is immutable.');
            }
            if ((int) $model->institution_id !== app(InstitutionContext::class)->requireId()) {
                throw new \LogicException('Cross-institution update denied.');
            }
        });
        static::deleting(function ($model) {
            if ((int) $model->institution_id !== app(InstitutionContext::class)->requireId()) {
                throw new \LogicException('Cross-institution deletion denied.');
            }
        });
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
