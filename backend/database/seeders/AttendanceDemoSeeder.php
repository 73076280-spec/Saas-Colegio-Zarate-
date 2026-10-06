<?php

namespace Database\Seeders;

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
            $course = Course::where('code', 'DEMO-MAT-2026')->firstOrFail();
            $student = app(CourseAccess::class)->roster($course)->whereHas('student.user', fn ($q) => $q->where('email', 'student@zarate.test'))->firstOrFail()->student;
            $guardian = Guardian::whereHas('user', fn ($q) => $q->where('email', 'guardian@zarate.test'))->whereHas('students', fn ($q) => $q->where('students.id', $student->id))->firstOrFail();
            $request = Request::create('/demo/attendance', 'POST');
            $request->setUserResolver(fn () => $course->teacher->user);
            $service = app(AttendanceService::class);
            foreach (['2026-10-01' => 'PRESENT', '2026-10-02' => 'ABSENT', '2026-10-03' => 'LATE'] as $date => $status) {
                // Preserve existing sessions, attendance and review decisions on repeated seeding.
                if (AttendanceSession::where('course_id', $course->id)->whereDate('date', $date)->exists()) {
                    continue;
                }
                $session = $service->session($course->id, ['date' => $date, 'topic' => 'Asistencia demo — '.$status], $request);
                $record = $service->records($session->id, [['student_id' => $student->id, 'status' => $status, 'observations' => 'Registro ficticio de desarrollo.']], $request)[0];
                if ($status !== 'LATE') {
                    $service->session($course->id, [], $request, $session->id, true);
                }
                if ($status === 'ABSENT') {
                    $familyRequest = clone $request;
                    $familyRequest->setUserResolver(fn () => $guardian->user);
                    app(JustificationService::class)->create($record->id, ['reason' => 'Motivo familiar ficticio para revisión demo.'], $familyRequest);
                }
            }
        });
    }
}
