<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance\AbsenceJustification;
use App\Models\Attendance\AttendanceRecord;
use App\Models\Attendance\AttendanceSession;
use App\Models\Courses\Course;
use App\Models\People\Student;
use App\Services\Attendance\AttendanceAccess;
use App\Services\Attendance\AttendanceService;
use App\Services\Attendance\JustificationService;
use App\Services\Courses\CourseAccess;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class AttendanceController extends Controller
{
    public function __construct(private AttendanceAccess $access) {}

    public function sessions(AttendanceRequest $r)
    {
        $course = Course::findOrFail($r->route('course'));
        abort_unless($this->access->manage($r->user(), $course, 'view'), 404);

        return AttendanceResource::collection(AttendanceSession::where('course_id', $course->id)->orderByDesc('date')->paginate($r->validated('per_page') ?? 20))
            ->additional(['abilities' => ['create' => $this->access->manage($r->user(), $course, 'create') && $course->status->value === 'ACTIVE']]);
    }

    public function saveSession(AttendanceRequest $r)
    {
        $session = $r->route('id') ? AttendanceSession::findOrFail($r->route('id')) : null;
        $result = app(AttendanceService::class)->session($session?->course_id ?? (int) $r->route('course'), $r->validated(), $r, $session?->id, $r->route('operation') === 'close');

        return (new AttendanceResource($result))->response()->setStatusCode($session ? 200 : 201);
    }

    public function showSession(AttendanceRequest $r)
    {
        $session = AttendanceSession::findOrFail($r->route('id'));
        abort_unless(Gate::allows('view', $session), 404);

        return new AttendanceResource($session);
    }

    public function records(AttendanceRequest $r)
    {
        $session = AttendanceSession::findOrFail($r->route('session'));
        abort_unless(Gate::allows('view', $session), 404);
        // Include historical records even if a later enrollment change removed someone from the roster.
        $roster = app(CourseAccess::class)->roster($session->course)->select('student_id');
        $students = Student::with('user')->where(fn ($q) => $q->whereIn('id', $roster)->orWhereIn('id', $session->records()->select('student_id')))->orderBy('id')->paginate($r->validated('per_page') ?? 20);
        $records = $session->records()->with(['student.user', 'session.course', 'justification'])->whereIn('student_id', $students->pluck('id'))->get()->keyBy('student_id');
        $eligible = app(CourseAccess::class)->roster($session->course)->whereIn('student_id', $students->pluck('id'))->pluck('student_id')->all();
        $students->through(fn ($s) => ['student_id' => $s->id, 'can_record' => in_array($s->id, $eligible, true), 'student' => $s->user?->name ?? 'Estudiante archivado', 'record' => isset($records[$s->id]) ? (new AttendanceResource($records[$s->id]))->resolve($r) : null]);

        return $students;
    }

    public function saveRecords(AttendanceRequest $r)
    {
        $record = $r->route('id') ? AttendanceRecord::findOrFail($r->route('id')) : null;
        $rows = app(AttendanceService::class)->records($record?->attendance_session_id ?? (int) $r->route('session'), $record ? $r->validated() : $r->validated('records'), $r, $record?->id);

        return $record ? new AttendanceResource($rows[0]) : AttendanceResource::collection(collect($rows));
    }

    public function personal(AttendanceRequest $r)
    {
        Gate::authorize('attendance.view');
        if ($r->route('guardian')) {
            $guardian = $this->access->guardian($r->user());
            abort_unless($guardian && $guardian->id === (int) $r->route('guardian') && $this->access->linked($r->user(), (int) $r->route('student')), 404);
            $student = (int) $r->route('student');
        } else {
            $student = $this->access->student($r->user())?->id;
            abort_unless($student, 403);
        }

        return AttendanceResource::collection(AttendanceRecord::with(['session.course', 'student.user', 'justification'])->where('student_id', $student)->orderByDesc('id')->paginate($r->validated('per_page') ?? 20));
    }

    public function justifications(AttendanceRequest $r)
    {
        Gate::authorize('justifications.view');
        $q = $this->access->justifications($r->user())->with(['record.session.course', 'student.user']);
        foreach (['status', 'student_id'] as $key) {
            if ($r->validated($key)) {
                $q->where($key, $r->validated($key));
            }
        }
        if ($r->validated('date')) {
            $q->whereHas('record.session', fn ($s) => $s->whereDate('date', $r->validated('date')));
        }

        return AttendanceResource::collection($q->orderByDesc('id')->paginate($r->validated('per_page') ?? 20));
    }

    public function createJustification(AttendanceRequest $r)
    {
        return (new AttendanceResource(app(JustificationService::class)->create((int) $r->route('record'), $r->validated(), $r)))->response()->setStatusCode(201);
    }

    private function justification(AttendanceRequest $r): AbsenceJustification
    {
        $item = AbsenceJustification::findOrFail($r->route('id'));
        abort_unless(Gate::allows('view', $item), 404);

        return $item;
    }

    public function showJustification(AttendanceRequest $r)
    {
        return new AttendanceResource($this->justification($r));
    }

    public function transition(AttendanceRequest $r)
    {
        return new AttendanceResource(app(JustificationService::class)->transition((int) $r->route('id'), $r->route('operation'), $r->validated(), $r));
    }

    public function history(AttendanceRequest $r)
    {
        return $this->justification($r)->history()->paginate($r->validated('per_page') ?? 20);
    }

    public function download(AttendanceRequest $r)
    {
        $item = $this->justification($r);
        $disk = Storage::disk('materials');
        abort_unless($item->file_path && $disk->exists($item->file_path), 404);

        return $disk->download($item->file_path, $item->original_filename, ['Content-Type' => 'application/octet-stream', 'X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'private, no-store']);
    }
}
