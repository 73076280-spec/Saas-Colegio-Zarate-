<?php

namespace App\Models\Scopes;

use App\Services\InstitutionContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class InstitutionScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $id = app(InstitutionContext::class)->id();
        $id === null ? $builder->whereRaw('1 = 0') : $builder->where($model->qualifyColumn('institution_id'), $id);
    }
}
