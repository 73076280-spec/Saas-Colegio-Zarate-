<?php

namespace App\Services\Attendance;

use App\Models\Attendance\AttendanceRecord;
use App\Models\Attendance\AttendanceSession;
use App\Models\Courses\Course;
use App\Services\Courses\CourseAccess;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    public function fail(string $key, string $message): never
    {
        throw ValidationException::withMessages([$key => $message]);
    }

    private function editable(AttendanceSession $session): void
    {
        if ($session->status !== 'OPEN') {
            $this->fail('status', 'La sesión cerrada conserva su historial.');
        }
        if ($session->course->status->value !== 'ACTIVE') {
            $this->fail('course_id', 'El curso debe estar activo.');
        }
    }

    public function session(int $courseId, array $data, Request $request, ?int $id = null, bool $close = false): AttendanceSession
    {
        return DB::transaction(function () use ($courseId, $data, $request, $id, $close) {
            app(EnrollmentService::class)->lock();
            $course = Course::lockForUpdate()->findOrFail($courseId);
            $session = $id ? AttendanceSession::where('course_id', $courseId)->lockForUpdate()->findOrFail($id) : new AttendanceSession(['course_id' => $courseId, 'status' => 'OPEN']);
            $session->setRelation('course', $course);
            Gate::forUser($request->user())->authorize($id ? ($close ? 'close' : 'update') : 'create', $id ? $session : [AttendanceSession::class, $course]);
            $this->editable($session);
            $old = $id ? $session->attributesToArray() : null;
            if ($close) {
                $data = ['status' => 'CLOSED', 'closed_at' => now()];
            } else {
                if ($id && isset($data['date']) && $data['date'] !== $session->date->format('Y-m-d') && $session->records()->exists()) {
                    $this->fail('date', 'No se cambia la fecha de una sesión con registros.');
                }
                if (AttendanceSession::where('course_id', $courseId)->whereDate('date', $data['date'] ?? $session->date)->when($id, fn ($q) => $q->whereKeyNot($id))->exists()) {
                    $this->fail('date', 'Ya existe una sesión para este curso y fecha.');
                }
                if (! $id) {
                    $data += ['created_by' => $request->user()->id];
                }
            }
            $session->fill($data)->save();
            app(AttendanceAudit::class)->record($session, $close ? 'CLOSE' : ($id ? 'UPDATE' : 'CREATE'), $old, $request);

            return $session->refresh();
        });
    }

    public function records(int $sessionId, array $rows, Request $request, ?int $recordId = null): array
    {
        return DB::transaction(function () use ($sessionId, $rows, $request, $recordId) {
            app(EnrollmentService::class)->lock();
            $session = AttendanceSession::lockForUpdate()->findOrFail($sessionId);
            Gate::forUser($request->user())->authorize('update', $session);
            $this->editable($session);
            if ($recordId) {
                $record = $session->records()->findOrFail($recordId);
                $rows = [array_merge($rows, ['student_id' => $record->student_id])];
            }
            $ids = array_map(fn ($row) => (int) $row['student_id'], $rows);
            if (count($ids) !== count(array_unique($ids))) {
                $this->fail('records', 'No repitas estudiantes.');
            }
            $eligible = app(CourseAccess::class)->roster($session->course)->whereIn('student_id', $ids)->pluck('student_id')->all();
            if (array_diff($ids, $eligible)) {
                $this->fail('records', 'Solo se registra asistencia de matrículas APPROVED del curso.');
            }
            $result = [];
            foreach ($rows as $row) {
                $record = $session->records()->where('student_id', $row['student_id'])->lockForUpdate()->first();
                if ($record?->justification()->exists()) {
                    $this->fail('records', 'La falta con justificación conserva su registro durante la revisión.');
                }
                $old = $record?->attributesToArray();
                $record ??= new AttendanceRecord(['attendance_session_id' => $sessionId, 'student_id' => $row['student_id']]);
                $record->fill(['status' => $row['status'], 'observations' => $row['observations'] ?? null, 'recorded_by' => $request->user()->id])->save();
                app(AttendanceAudit::class)->record($record, $old ? 'UPDATE' : 'CREATE', $old, $request);
                $result[] = $record;
            }

            return $result;
        });
    }
}
