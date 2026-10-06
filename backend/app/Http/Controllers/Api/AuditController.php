<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Gate;

class AuditController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', AuditLog::class);

        return AuditLog::orderByDesc('id')->paginate(20);
    }
}
