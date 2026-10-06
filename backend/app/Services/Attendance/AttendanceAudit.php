<?php

namespace App\Services\Attendance;

use App\Models\Attendance\AttendanceModel;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AttendanceAudit
{
    public function record(AttendanceModel $record, string $action, ?array $old, Request $request): void
    {
        $keys = array_flip(['id', 'institution_id', 'course_id', 'date', 'status', 'attendance_session_id', 'student_id', 'attendance_record_id', 'guardian_id', 'created_by', 'recorded_by', 'closed_at', 'reviewed_by', 'reviewed_at']);
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $action, 'entity_type' => $record->getTable(), 'entity_id' => $record->id,
            'old_values' => $old === null ? null : array_intersect_key($old, $keys),
            'new_values' => array_intersect_key($record->attributesToArray(), $keys),
            'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500)]);
    }
}
