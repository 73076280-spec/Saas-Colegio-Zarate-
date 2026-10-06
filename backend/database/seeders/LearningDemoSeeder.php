<?php

namespace Database\Seeders;

use App\Models\Academic\AcademicPeriod;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\Learning\Assessment;
use App\Models\Learning\AssessmentType;
use App\Models\Learning\Assignment;
use App\Models\Learning\Score;
use App\Models\Learning\Submission;
use App\Models\User;
use App\Services\Academic\AcademicService;
use App\Services\InstitutionContext;
use App\Services\Learning\LearningService;
use App\Services\Learning\ScoreService;
use App\Services\Learning\SubmissionService;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;

class LearningDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Demo local/testing only.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () {
            $this->call(LearningPermissionSeeder::class);
            foreach (['EXAM' => 'Examen', 'PRACTICE' => 'Práctica', 'PROJECT' => 'Proyecto', 'PARTICIPATION' => 'Participación'] as $code => $name) {
                AssessmentType::firstOrCreate(['code' => $code], ['name' => $name, 'status' => 'ACTIVE']);
            }
            $course = Course::where('code', 'DEMO-MAT-2026')->firstOrFail();
            $teacher = $course->teacher->user;
            $student = User::where('email', 'student@zarate.test')->firstOrFail();
            $enrollment = Enrollment::where('status', 'APPROVED')->whereHas('student', fn ($q) => $q->where('user_id', $student->id))->where('section_id', $course->section_id)->firstOrFail();
            $request = Request::create('/demo', 'POST');
            $request->setUserResolver(fn () => $teacher);
            $service = app(LearningService::class);
            foreach (['Ejercicios de números naturales (demo)' => true, 'Proyecto de operaciones (borrador demo)' => false] as $title => $publish) {
                if (! Assignment::withTrashed()->where('course_id', $course->id)->where('title', $title)->exists()) {
                    $task = $service->save('assignments', $course->id, ['title' => $title, 'description' => 'Resuelve tres operaciones sencillas. Datos ficticios.', 'instructions' => 'Explica tus pasos con texto o archivo.', 'due_at' => now()->addWeek(), 'max_score' => 20, 'allow_late_submission' => true], $request);
                    if ($publish) {
                        $service->save('assignments', $course->id, [], $request, $task->id, 'publish');
                    }
                }
            }
            $task = Assignment::where('course_id', $course->id)->where('title', 'Ejercicios de números naturales (demo)')->where('status', 'PUBLISHED')->first();
            if ($task && ! Submission::where('assignment_id', $task->id)->where('student_id', $enrollment->student_id)->exists()) {
                $studentRequest = clone $request;
                $studentRequest->setUserResolver(fn () => $student);
                app(SubmissionService::class)->save($task->id, ['content' => 'Respuesta ficticia demo: 2 + 3 = 5.'], $studentRequest);
            }
            $title = 'Práctica de números naturales (demo)';
            $assessment = Assessment::where('course_id', $course->id)->where('title', $title)->first();
            if (! $assessment) {
                $period = AcademicPeriod::where('academic_year_id', $course->academic_year_id)->where('status', '!=', 'CLOSED')->orderBy('sequence')->firstOrFail();
                if (! $period->grading_open && ! Assessment::where('academic_period_id', $period->id)->exists()) {
                    // First-time local demo preparation only; preserve later administrative locks.
                    $adminRequest = clone $request;
                    $adminRequest->setUserResolver(fn () => User::where('email', 'administrator@zarate.test')->firstOrFail());
                    app(AcademicService::class)->save('academic-periods', ['grading_open' => true], $adminRequest, $period);
                }
                $assessment = $service->save('assessments', $course->id, ['title' => $title, 'academic_period_id' => $period->id, 'assessment_type_id' => AssessmentType::where('code', 'PRACTICE')->firstOrFail()->id, 'max_score' => 20, 'evaluation_date' => now()->toDateString()], $request);
                $service->save('assessments', $course->id, [], $request, $assessment->id, 'publish');
                $assessment->refresh();
            }
            if ($assessment->status === 'PUBLISHED' && $assessment->period->grading_open && ! Score::where('assessment_id', $assessment->id)->where('student_id', $enrollment->student_id)->exists()) {
                app(ScoreService::class)->save($assessment->id, ['student_id' => $enrollment->student_id, 'score' => 18, 'observations' => 'Calificación ficticia de desarrollo.'], $request);
            }
        });
    }
}
