<?php

namespace Database\Seeders;

use App\Models\Academic\AcademicPeriod;
use App\Models\Courses\Course;
use App\Models\Institution;
use App\Models\Learning\Assessment;
use App\Models\Learning\AssessmentType;
use App\Models\Learning\Assignment;
use App\Models\Learning\Score;
use App\Models\Learning\Submission;
use App\Models\User;
use App\Services\Academic\AcademicService;
use App\Services\Courses\CourseAccess;
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
            $courses = Course::whereIn('code', ['DEMO-MAT-2026', 'DEMO-COM-2026', 'DEMO-CYT-2026', 'DEMO-ING-2026'])->with(['teacher.user', 'subject'])->get();
            foreach ($courses as $course) {
                $teacher = $course->teacher->user;
                $enrollments = app(CourseAccess::class)->roster($course)->get();
                $request = Request::create('/demo', 'POST');
                $request->setUserResolver(fn () => $teacher);
                $service = app(LearningService::class);
                $subject = $course->subject->name;
                $taskTitles = $course->code === 'DEMO-MAT-2026'
                ? ['Ejercicios de números naturales (demo)', 'Proyecto de operaciones (borrador demo)']
                : ['Actividad práctica: '.$subject.' (demo)', 'Actividad complementaria: '.$subject.' (borrador demo)'];
                foreach ($taskTitles as $index => $title) {
                    if (! Assignment::withTrashed()->where('course_id', $course->id)->where('title', $title)->exists()) {
                        $task = $service->save('assignments', $course->id, ['title' => $title, 'description' => 'Resuelve tres ejercicios de '.$subject.'. Datos ficticios.', 'instructions' => 'Explica tus pasos con texto o archivo.', 'due_at' => now()->addWeek(), 'max_score' => 20, 'allow_late_submission' => true], $request);
                        if ($index === 0) {
                            $service->save('assignments', $course->id, [], $request, $task->id, 'publish');
                        }
                    }
                }
                $task = Assignment::where('course_id', $course->id)->where('title', $taskTitles[0])->where('status', 'PUBLISHED')->first();
                foreach ($enrollments as $enrollment) {
                    if ($task && ! Submission::where('assignment_id', $task->id)->where('student_id', $enrollment->student_id)->exists()) {
                        $studentRequest = clone $request;
                        $studentRequest->setUserResolver(fn () => $enrollment->student->user);
                        app(SubmissionService::class)->save($task->id, ['content' => 'Respuesta ficticia demo de '.$subject.'.'], $studentRequest);
                    }
                }
                $assessmentTitle = $course->code === 'DEMO-MAT-2026'
                ? 'Práctica de números naturales (demo)'
                : 'Evaluación de '.$subject.' (demo)';
                $assessment = Assessment::where('course_id', $course->id)->where('title', $assessmentTitle)->first();
                if (! $assessment) {
                    $period = AcademicPeriod::where('academic_year_id', $course->academic_year_id)->where('status', '!=', 'CLOSED')->orderBy('sequence')->firstOrFail();
                    if (! $period->grading_open && ! Assessment::where('academic_period_id', $period->id)->exists()) {
                        $adminRequest = clone $request;
                        $adminRequest->setUserResolver(fn () => User::where('email', 'administrator@zarate.test')->firstOrFail());
                        app(AcademicService::class)->save('academic-periods', ['grading_open' => true], $adminRequest, $period);
                    }
                    $assessment = $service->save('assessments', $course->id, ['title' => $assessmentTitle, 'academic_period_id' => $period->id, 'assessment_type_id' => AssessmentType::where('code', 'PRACTICE')->firstOrFail()->id, 'max_score' => 20, 'evaluation_date' => now()->toDateString()], $request);
                    $service->save('assessments', $course->id, [], $request, $assessment->id, 'publish');
                    $assessment->refresh();
                }
                if ($assessment->status === 'PUBLISHED' && $assessment->period->grading_open) {
                    foreach ($enrollments as $enrollment) {
                        if (! Score::where('assessment_id', $assessment->id)->where('student_id', $enrollment->student_id)->exists()) {
                            app(ScoreService::class)->save($assessment->id, ['student_id' => $enrollment->student_id, 'score' => 18, 'observations' => 'Calificación ficticia de desarrollo.'], $request);
                        }
                    }
                }
            }
        });
    }
}
