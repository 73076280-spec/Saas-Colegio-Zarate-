<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;

class AuditService
{
    public function record(AuditAction $action, User $user, Request $request): void
    {
        AuditLog::create(['user_id' => $user->id, 'action' => $action, 'entity_type' => 'user',
            'entity_id' => $user->id, 'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500)]);
    }
}
