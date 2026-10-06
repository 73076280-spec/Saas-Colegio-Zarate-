<?php

namespace App\Services\Learning;

use App\Models\AuditLog;
use App\Models\Learning\LearningRecord;
use Illuminate\Http\Request;

class LearningAudit
{
    public function record(LearningRecord $record, string $action, ?array $old, Request $request): void
    {
        $keys = array_flip(['id', 'institution_id', 'course_id', 'assignment_id', 'assessment_id', 'student_id', 'course_unit_id', 'academic_period_id', 'assessment_type_id', 'title', 'status', 'due_at', 'max_score', 'allow_late_submission', 'attempt', 'is_late', 'submitted_at', 'reviewed_by', 'reviewed_at', 'graded_by', 'graded_at']);
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $action, 'entity_type' => $record->getTable(), 'entity_id' => $record->id,
            'old_values' => $old === null ? null : array_intersect_key($old, $keys),
            'new_values' => array_intersect_key($record->attributesToArray(), $keys),
            'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500)]);
    }
}
