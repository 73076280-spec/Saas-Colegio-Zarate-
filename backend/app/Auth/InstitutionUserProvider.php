<?php

namespace App\Auth;

use App\Models\Scopes\InstitutionScope;
use Illuminate\Auth\EloquentUserProvider;

class InstitutionUserProvider extends EloquentUserProvider
{
    // Authentication must load the session identity before its tenant context exists.
    // SoftDeletes remains active. All application queries retain InstitutionScope.
    protected function newModelQuery($model = null)
    {
        return parent::newModelQuery($model)->withoutGlobalScope(InstitutionScope::class);
    }
}
