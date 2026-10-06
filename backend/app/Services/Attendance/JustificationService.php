<?php

namespace App\Services\Attendance;

use App\Models\Attendance\AbsenceJustification;
use App\Models\Attendance\AttendanceRecord;
use App\Services\Classroom\MaterialFiles;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class JustificationService
{
    public function create(int $recordId, array $data, Request $request): AbsenceJustification
    {
        $path = null;
        try {
            return DB::transaction(function () use ($recordId, $data, $request, &$path) {
                app(EnrollmentService::class)->lock();
                $record = AttendanceRecord::lockForUpdate()->findOrFail($recordId);
                Gate::forUser($request->user())->authorize('justify', $record);
                if ($record->status !== 'ABSENT' || $record->justification()->exists()) {
                    app(AttendanceService::class)->fail('attendance_record_id', 'Solo se justifica una falta sin solicitud previa.');
                }
                $file = [];
                if (isset($data['file'])) {
                    $file = app(MaterialFiles::class)->store($data['file'], $record->institution_id, $record->session->course_id);
                    $path = $file['file_path'];
                }
                $justification = AbsenceJustification::create($file + [
                    'attendance_record_id' => $recordId, 'student_id' => $record->student_id,
                    'guardian_id' => app(AttendanceAccess::class)->guardian($request->user())->id,
                    'reason' => $data['reason'], 'status' => 'PENDING',
                ]);
                $justification->history()->create(['previous_status' => null, 'new_status' => 'PENDING', 'changed_by' => $request->user()->id]);
                app(AttendanceAudit::class)->record($justification, 'JUSTIFY', null, $request);

                return $justification;
            });
        } catch (\Throwable $e) {
            if ($path) {
                app(MaterialFiles::class)->discard($path);
            }
            throw $e;
        }
    }

    public function transition(int $id, string $operation, array $data, Request $request): AbsenceJustification
    {
        return DB::transaction(function () use ($id, $operation, $data, $request) {
            app(EnrollmentService::class)->lock();
            $item = AbsenceJustification::lockForUpdate()->findOrFail($id);
            Gate::forUser($request->user())->authorize($operation, $item);
            $expected = $operation === 'review' ? 'PENDING' : 'IN_REVIEW';
            if ($item->status !== $expected) {
                app(AttendanceService::class)->fail('status', 'La transición no está permitida desde el estado actual.');
            }
            $record = AttendanceRecord::lockForUpdate()->findOrFail($item->attendance_record_id);
            if ($record->status !== 'ABSENT') {
                app(AttendanceService::class)->fail('status', 'La justificación requiere una falta vigente.');
            }
            $old = $item->attributesToArray();
            $status = match ($operation) {
                'review' => 'IN_REVIEW', 'approve' => 'APPROVED', 'reject' => 'REJECTED'
            };
            $item->fill(['status' => $status, 'reviewed_by' => $request->user()->id, 'reviewed_at' => now(), 'review_comment' => $data['review_comment'] ?? null])->save();
            $item->history()->create(['previous_status' => $old['status'], 'new_status' => $status, 'changed_by' => $request->user()->id, 'comment' => $data['review_comment'] ?? null]);
            if ($operation === 'approve') {
                $before = $record->attributesToArray();
                $record->update(['status' => 'JUSTIFIED']);
                app(AttendanceAudit::class)->record($record, 'APPROVE', $before, $request);
            }
            app(AttendanceAudit::class)->record($item, strtoupper($operation), $old, $request);

            return $item->refresh();
        });
    }
}
