<?php

namespace App\Models\Concerns;

use App\Models\Scopes\InstitutionScope;
use App\Services\InstitutionContext;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToInstitutionThroughParent
{
    protected static function bootBelongsToInstitutionThroughParent(): void
    {
        static::addGlobalScope('institution', function (Builder $query) {
            $relation = $query->getModel()->institutionParent();
            $query->whereHas($relation);
        });
        static::saving(function ($model) {
            $context = app(InstitutionContext::class)->requireId();
            $parent = $model->{$model->institutionParent()}()->first();
            if (! $parent || $parent->ownerInstitutionId() !== $context) {
                throw new \LogicException('Parent does not belong to the institution context.');
            }
        });
        static::deleting(function ($model) {
            if ($model->ownerInstitutionId() !== app(InstitutionContext::class)->requireId()) {
                throw new \LogicException('Cross-institution deletion denied.');
            }
        });
    }

    public function ownerInstitutionId(): int
    {
        return $this->{$this->institutionParent()}()->withoutGlobalScope(InstitutionScope::class)->firstOrFail()->ownerInstitutionId();
    }
}
