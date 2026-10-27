<?php

namespace Database\Seeders;

use App\Models\Academic\AcademicYear;
use App\Models\Academic\Subject;
use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\People\Teacher;
use App\Models\User;
use App\Services\Courses\TeachingService;
use App\Services\Enrollment\EnrollmentService;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Demo local/testing only.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () {
            DB::transaction(function () {
                app(EnrollmentService::class)->lock();
                $this->call(CoursePermissionSeeder::class);
                $admin = User::where('email', 'administrator@zarate.test')->firstOrFail();
                $request = Request::create('/demo', 'POST');
                $request->setUserResolver(fn () => $admin);
                $year = AcademicYear::where('name', '2026')->where('status', 'ACTIVE')->firstOrFail();
                $teacher = Teacher::where('status', 'ACTIVE')->whereHas('user', fn ($u) => $u->where('email', 'teacher@zarate.test'))->firstOrFail();
                foreach ([
                    ['student@zarate.test', 'MAT-001', 'Matemática — curso demo', 'DEMO-MAT-2026'],
                    ['student@zarate.test', 'COM-001', 'Comunicación — curso demo', 'DEMO-COM-2026'],
                    ['student5@zarate.test', 'CYT-001', 'Ciencia y Tecnología — curso demo', 'DEMO-CYT-2026'],
                    ['student5@zarate.test', 'ING-001', 'Inglés — curso demo', 'DEMO-ING-2026'],
                ] as [$email, $subjectCode, $name, $code]) {
                    $enrollment = Enrollment::where('academic_year_id', $year->id)->where('status', 'APPROVED')->whereHas('student.user', fn ($u) => $u->where('email', $email))->firstOrFail();
                    $subject = Subject::where('code', $subjectCode)->where('status', 'ACTIVE')->firstOrFail();
                    $data = ['academic_year_id' => $enrollment->academic_year_id, 'grade_level_id' => $enrollment->grade_level_id, 'section_id' => $enrollment->section_id, 'teacher_id' => $teacher->id, 'subject_id' => $subject->id];
                    $assignment = TeacherAssignment::where($data)->first();
                    if (! $assignment) {
                        $assignment = app(TeachingService::class)->save(false, $data, $request);
                    }
                    if (! Course::withTrashed()->where($data)->exists() && ! Course::withTrashed()->where('academic_year_id', $enrollment->academic_year_id)->where('code', $code)->exists()) {
                        $course = app(TeachingService::class)->save(true, $data + ['teacher_assignment_id' => $assignment->id, 'name' => $name, 'code' => $code, 'description' => 'Datos ficticios para desarrollo.'], $request);
                        app(TeachingService::class)->save(true, [], $request, $course->id, 'activate');
                    }
                }
            });
        });
    }
}
