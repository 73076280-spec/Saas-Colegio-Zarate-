<?php

namespace App\Services\Enrollment;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class EnrollmentAudit
{
    public function record(string $action, Model $model, ?array $old, Request $request): void
    {
        $keys = array_flip(['id', 'institution_id', 'student_id', 'academic_year_id', 'grade_level_id', 'section_id', 'status', 'enrollment_code', 'approved_by', 'approved_at', 'enrolled_at', 'payment_concept_id', 'amount', 'validated_by', 'paid_at', 'code']);
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $action, 'entity_type' => $model->getTable(), 'entity_id' => $model->id, 'old_values' => $old === null ? null : array_intersect_key($old, $keys), 'new_values' => array_intersect_key($model->attributesToArray(), $keys), 'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500)]);
    }
}
