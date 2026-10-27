<?php

namespace Database\Seeders;

use App\Models\Attendance\AttendanceRecord;
use App\Models\Attendance\AttendanceSession;
use App\Models\Courses\Course;
use App\Models\Institution;
use App\Models\People\Guardian;
use App\Services\Attendance\AttendanceService;
use App\Services\Attendance\JustificationService;
use App\Services\Courses\CourseAccess;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;

class AttendanceDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Demo local/testing only.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () {
            $this->call(AttendancePermissionSeeder::class);
            $service = app(AttendanceService::class);
            foreach (Course::whereIn('code', ['DEMO-MAT-2026', 'DEMO-COM-2026', 'DEMO-CYT-2026', 'DEMO-ING-2026'])->with(['teacher.user', 'subject'])->get() as $course) {
                $roster = app(CourseAccess::class)->roster($course)->get();
                $request = Request::create('/demo/attendance', 'POST');
                $request->setUserResolver(fn () => $course->teacher->user);
                foreach (['2026-10-01', '2026-10-02', '2026-10-03'] as $dateIndex => $date) {
                    $session = AttendanceSession::where('course_id', $course->id)->whereDate('date', $date)->first();
                    $created = ! $session;
                    if ($created) {
                        $session = $service->session($course->id, ['date' => $date, 'topic' => 'Asistencia demo — '.$course->subject->name], $request);
                    }
                    $recorded = AttendanceRecord::where('attendance_session_id', $session->id)->pluck('student_id')->all();
                    $rows = [];
                    foreach ($roster as $studentIndex => $enrollment) {
                        if (in_array($enrollment->student_id, $recorded, true)) {
                            continue;
                        }
                        $statuses = ['PRESENT', 'ABSENT', 'LATE'];
                        $rows[] = ['student_id' => $enrollment->student_id, 'status' => $statuses[($studentIndex + $dateIndex) % count($statuses)], 'observations' => 'Registro ficticio de desarrollo.'];
                    }
                    if ($rows && $session->status === 'OPEN') {
                        $service->records($session->id, $rows, $request);
                    }
                    if ($created && $date !== '2026-10-03') {
                        $service->session($course->id, [], $request, $session->id, true);
                    }
                    if ($course->code === 'DEMO-MAT-2026' && $date === '2026-10-02') {
                        $student = $roster->first(fn ($enrollment) => $enrollment->student->user->email === 'student@zarate.test')?->student;
                        $record = $student ? AttendanceRecord::where('attendance_session_id', $session->id)->where('student_id', $student->id)->first() : null;
                        if ($record && $record->status === 'ABSENT' && ! $record->justification()->exists()) {
                            $guardian = Guardian::whereHas('user', fn ($query) => $query->where('email', 'guardian@zarate.test'))->whereHas('students', fn ($query) => $query->where('students.id', $student->id))->firstOrFail();
                            $familyRequest = clone $request;
                            $familyRequest->setUserResolver(fn () => $guardian->user);
                            app(JustificationService::class)->create($record->id, ['reason' => 'Motivo familiar ficticio para revisión demo.'], $familyRequest);
                        }
                    }
                }
            }
        });
    }
}
