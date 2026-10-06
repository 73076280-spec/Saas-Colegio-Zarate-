<?php

namespace App\Services\Office;

use App\Models\AuditLog;
use App\Models\Office\Communication;
use App\Models\Office\OfficeRecord;
use Illuminate\Http\Request;

class OfficeAudit
{
    public function record(OfficeRecord $r, string $action, ?array $old, Request $request): void
    {
        $keys = array_flip(['id', 'institution_id', 'request_code', 'student_id', 'guardian_id', 'request_type_id', 'assigned_to', 'status', 'academic_request_id', 'document_number', 'document_type', 'issued_by', 'issued_at', 'published_at', 'created_by', 'targets']);
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $action, 'entity_type' => $r->getTable(), 'entity_id' => $r->id,
            'old_values' => $old === null ? null : array_intersect_key($old, $keys), 'new_values' => array_intersect_key($r->attributesToArray() + ($r instanceof Communication ? ['targets' => $r->targets()->get(['kind', 'target'])->toArray()] : []), $keys),
            'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500)]);
    }
}
