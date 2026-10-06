<?php

namespace App\Services\People;

use App\Enums\AuditAction;
use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class PeopleAudit
{
    public function record(AuditAction $action, Model $model, ?array $old, ?array $new, Request $request): void
    {
        // Operational metadata only: no credentials, documents, names or addresses.
        $allowed = array_flip(['id', 'institution_id', 'user_id', 'status', 'student_id', 'guardian_id', 'relationship', 'is_primary', 'can_pick_up', 'receives_notifications']);
        $safe = fn (?array $data) => $data === null ? null : array_intersect_key($data, $allowed);
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $action, 'entity_type' => $model->getTable(), 'entity_id' => $model->id,
            'old_values' => $safe($old), 'new_values' => $safe($new), 'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500)]);
    }
}
