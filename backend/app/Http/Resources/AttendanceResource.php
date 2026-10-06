<?php

namespace App\Http\Resources;

use App\Models\Attendance\AttendanceRecord;
use App\Models\Attendance\AttendanceSession;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $r = $this->resource;
        if ($r instanceof AttendanceSession) {
            return ['id' => $r->id, 'course_id' => $r->course_id, 'date' => $r->date->format('Y-m-d'), 'topic' => $r->topic, 'status' => $r->status, 'closed_at' => $r->closed_at,
                'abilities' => ['update' => Gate::allows('update', $r), 'close' => Gate::allows('close', $r)]];
        }
        if ($r instanceof AttendanceRecord) {
            return ['id' => $r->id, 'attendance_session_id' => $r->attendance_session_id, 'student_id' => $r->student_id,
                'student' => $r->student?->user?->name ?? 'Estudiante archivado', 'date' => $r->session->date->format('Y-m-d'), 'course' => $r->session->course->name,
                'status' => $r->status, 'observations' => $r->observations,
                'justification' => $r->justification ? ['id' => $r->justification->id, 'status' => $r->justification->status] : null,
                'can_justify' => $r->status === 'ABSENT' && ! $r->justification && Gate::allows('justify', $r)];
        }

        return ['id' => $r->id, 'attendance_record_id' => $r->attendance_record_id, 'student_id' => $r->student_id,
            'student' => $r->student?->user?->name ?? 'Estudiante archivado', 'guardian_id' => $r->guardian_id,
            'date' => $r->record->session->date->format('Y-m-d'), 'course' => $r->record->session->course->name,
            'reason' => $r->reason, 'status' => $r->status, 'original_filename' => $r->original_filename, 'file_size' => $r->file_size,
            'review_comment' => $r->review_comment, 'reviewed_at' => $r->reviewed_at, 'reviewed_by' => $r->reviewed_by,
            'abilities' => ['review' => Gate::allows('review', $r), 'approve' => Gate::allows('approve', $r), 'reject' => Gate::allows('reject', $r)]];
    }
}
