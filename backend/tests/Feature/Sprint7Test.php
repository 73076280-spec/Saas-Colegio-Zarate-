<?php

use App\Models\Academic\AcademicPeriod;
use App\Models\AuditLog;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\Learning\Assessment;
use App\Models\Learning\AssessmentType;
use App\Models\Learning\Score;
use App\Models\Learning\ScoreHistory;
use App\Models\People\Student;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\Learning\LearningAudit;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

uses(DatabaseTransactions::class);
beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    Storage::fake('materials');
    $this->institution = Institution::factory()->create();
    [$this->course, $this->teacher, $this->student, $this->enrollment, $this->period, $this->type] = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $course = Course::factory()->create(['status' => 'ACTIVE']);
        $e = Enrollment::where('section_id', $course->section_id)->firstOrFail();
        $e->update(['status' => 'APPROVED']);
        $period = AcademicPeriod::create(['academic_year_id' => $course->academic_year_id, 'name' => 'Periodo de prueba', 'sequence' => 1, 'start_date' => '2026-03-01', 'end_date' => '2026-12-20', 'grading_open' => true, 'status' => 'ACTIVE']);
        $type = AssessmentType::create(['name' => 'Práctica', 'code' => 'PRACTICE', 'status' => 'ACTIVE']);

        return [$course, $course->teacher->user, $e->student->user, $e, $period, $type];
    });
    $this->base = "/api/v1/courses/{$this->course->id}";
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->teacher, 'web');
});
afterEach(fn () => app(InstitutionContext::class)->set(null));
function learningLogin($test, User $user)
{
    Auth::forgetGuards();
    app('session')->flush();

    return $test->actingAs($user, 'web');
}
function learningTask($test, array $extra = []): int
{
    return $test->postJson($test->base.'/assignments', $extra + ['title' => 'Tarea ficticia', 'description' => 'Resolver ejercicio', 'due_at' => now()->addDay()->toIso8601String()])->assertCreated()->json('data.id');
}
function learningAssessment($test): int
{
    $id = $test->postJson($test->base.'/assessments', ['title' => 'Evaluación ficticia', 'academic_period_id' => $test->period->id, 'assessment_type_id' => $test->type->id, 'max_score' => 20])->assertCreated()->json('data.id');
    $test->postJson("/api/v1/assessments/$id/publish")->assertOk();

    return $id;
}

it('lets assigned teachers manage tasks with audited publication and immutable closure', function () {
    $deadline = now()->startOfSecond()->addHours(2)->setTimezone('America/Lima');
    $id = learningTask($this, ['due_at' => $deadline->toIso8601String()]);
    $this->getJson("/api/v1/assignments/$id")->assertOk()->assertJsonPath('data.due_at', $deadline->copy()->utc()->toJSON());
    $this->patchJson("/api/v1/assignments/$id", ['instructions' => 'Leer y responder'])->assertOk();
    $this->postJson("/api/v1/assignments/$id/publish")->assertOk();
    $this->postJson("/api/v1/assignments/$id/close")->assertOk();
    $this->patchJson("/api/v1/assignments/$id", ['title' => 'No cambiar'])->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        expect(AuditLog::where('entity_type', 'assignments')->where('entity_id', $id)->orderBy('id')->pluck('action')->map(fn ($a) => $a->value)->all())->toBe(['CREATE', 'UPDATE', 'PUBLISH', 'CLOSE']);
    });
});

it('denies other teachers and isolates assignment assessment and unit references', function () {
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Course::factory()->create(['status' => 'ACTIVE']));
    $this->postJson("/api/v1/courses/$other->id/assignments", ['title' => 'Intrusión', 'description' => 'No', 'due_at' => now()->addDay()->toIso8601String()])->assertForbidden();
    $foreign = Institution::factory()->create();
    $a = app(InstitutionContext::class)->run($foreign->id, function () {
        (new RolePermissionSeeder)->run();
        $c = Course::factory()->create();
        $type = AssessmentType::create(['name' => 'Examen', 'code' => 'EXAM']);

        return Assessment::create(['course_id' => $c->id, 'academic_period_id' => $this->period->id, 'assessment_type_id' => $type->id, 'title' => 'Ajena', 'max_score' => 20, 'status' => 'DRAFT', 'created_by' => $c->teacher->user_id]);
    });
    $this->getJson("/api/v1/assessments/$a->id")->assertNotFound();
    $this->postJson("/api/v1/assessments/$a->id/publish")->assertNotFound();
    $this->postJson($this->base.'/assessments', ['title' => 'Cruce', 'academic_period_id' => $this->period->id, 'assessment_type_id' => $a->assessment_type_id, 'max_score' => 20])->assertUnprocessable();
});

it('shows published tasks only to approved students and blocks foreign submission and score IDOR', function () {
    $task = learningTask($this);
    learningLogin($this, $this->student)->getJson('/api/v1/my/assignments')->assertJsonCount(0, 'data');
    learningLogin($this, $this->teacher)->postJson("/api/v1/assignments/$task/publish")->assertOk();
    $assessment = learningAssessment($this);
    $score = $this->postJson("/api/v1/assessments/$assessment/scores", ['student_id' => $this->enrollment->student_id, 'score' => 17])->assertCreated()->json('data.id');
    learningLogin($this, $this->student)->getJson('/api/v1/my/assignments')->assertJsonCount(1, 'data');
    $submission = $this->postJson("/api/v1/assignments/$task/submissions", ['content' => 'Respuesta'])->assertCreated()->json('data.id');
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create()->load('user')->user);
    learningLogin($this, $other)->getJson("/api/v1/assignments/$task")->assertNotFound();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($other) {
        $enrollment = $this->enrollment->replicate(['active_student_id']);
        $enrollment->student_id = Student::where('user_id', $other->id)->firstOrFail()->id;
        $enrollment->enrollment_code = 'TEST-S7-OTHER';
        $enrollment->save();
    });
    $this->getJson("/api/v1/assignments/$task")->assertOk();
    $this->getJson("/api/v1/submissions/$submission")->assertNotFound();
    $this->patchJson("/api/v1/submissions/$submission", ['content' => 'No'])->assertForbidden();
    $this->getJson("/api/v1/scores/$score")->assertNotFound();
    $this->getJson("/api/v1/scores/$score/history")->assertNotFound();
    $this->patchJson("/api/v1/scores/$score", ['score' => 20, 'reason' => 'No autorizado'])->assertForbidden();
});

it('records private submissions review feedback and returned attempts without overwriting history', function () {
    $task = learningTask($this);
    $this->postJson("/api/v1/assignments/$task/publish")->assertOk();
    learningLogin($this, $this->student);
    $id = $this->post("/api/v1/assignments/$task/submissions", ['file' => UploadedFile::fake()->createWithContent('respuesta.txt', 'Respuesta segura')])->assertCreated()->assertJsonMissingPath('data.file_path')->json('data.id');
    $this->get("/api/v1/submissions/$id/download")->assertOk()->assertDownload('respuesta.txt');
    $this->postJson("/api/v1/assignments/$task/submissions", ['content' => 'Duplicado'])->assertUnprocessable();
    learningLogin($this, $this->teacher)->postJson("/api/v1/submissions/$id/review", ['status' => 'RETURNED', 'feedback' => 'Completar respuesta'])->assertOk();
    learningLogin($this, $this->student)->patchJson("/api/v1/submissions/$id", ['content' => 'Alterado'])->assertUnprocessable();
    $next = $this->postJson("/api/v1/assignments/$task/submissions", ['content' => 'Nuevo intento'])->assertCreated()->assertJsonPath('data.attempt', 2)->json('data.id');
    learningLogin($this, $this->teacher)->postJson("/api/v1/submissions/$next/review", ['status' => 'REVIEWED', 'feedback' => 'Correcto'])->assertOk();
    learningLogin($this, $this->student)->patchJson("/api/v1/submissions/$next", ['content' => 'Cambiar'])->assertUnprocessable();
    $this->getJson('/api/v1/my/submissions')->assertJsonCount(2, 'data');
});

it('enforces deadlines late configuration and closed tasks', function () {
    $task = learningTask($this, ['due_at' => now()->subHour()->toIso8601String()]);
    $this->postJson("/api/v1/assignments/$task/publish")->assertOk();
    learningLogin($this, $this->student)->postJson("/api/v1/assignments/$task/submissions", ['content' => 'Tardía'])->assertUnprocessable();
    learningLogin($this, $this->teacher)->patchJson("/api/v1/assignments/$task", ['allow_late_submission' => true])->assertOk();
    learningLogin($this, $this->student)->postJson("/api/v1/assignments/$task/submissions", ['content' => 'Tardía'])->assertCreated()->assertJsonPath('data.status', 'LATE')->assertJsonPath('data.is_late', true);
    learningLogin($this, $this->teacher)->postJson("/api/v1/assignments/$task/close")->assertOk();
    learningLogin($this, $this->student)->postJson("/api/v1/assignments/$task/submissions", ['content' => 'Cerrada'])->assertForbidden();
});

it('records a valid score only for approved students and rejects duplicates and non teacher grading', function () {
    $a = learningAssessment($this);
    $this->postJson("/api/v1/assessments/$a/scores", ['student_id' => $this->enrollment->student_id, 'score' => 18.5])->assertCreated();
    $this->postJson("/api/v1/assessments/$a/scores", ['student_id' => $this->enrollment->student_id, 'score' => 18])->assertUnprocessable();
    learningLogin($this, $this->student)->getJson('/api/v1/my/scores')->assertJsonPath('data.0.score', '18.50');
    $this->postJson("/api/v1/assessments/$a/scores", ['student_id' => $this->enrollment->student_id, 'score' => 20])->assertForbidden();
    learningLogin($this, $this->teacher);
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->enrollment->update(['status' => 'OBSERVED']));
    $b = learningAssessment($this);
    $this->postJson("/api/v1/assessments/$b/scores", ['student_id' => $this->enrollment->student_id, 'score' => 10])->assertUnprocessable();
});

it('rejects scores outside zero to twenty and mismatched academic periods', function () {
    $a = learningAssessment($this);
    foreach ([-1, 21] as $score) {
        $this->postJson("/api/v1/assessments/$a/scores", ['student_id' => $this->enrollment->student_id, 'score' => $score])->assertUnprocessable();
    }
    $this->postJson($this->base.'/assessments', ['title' => 'Periodo inválido', 'academic_period_id' => 99999999, 'assessment_type_id' => $this->type->id, 'max_score' => 20])->assertUnprocessable();
});

it('blocks ordinary grading in locked periods and closed assessments', function () {
    $a = learningAssessment($this);
    $id = $this->postJson("/api/v1/assessments/$a/scores", ['student_id' => $this->enrollment->student_id, 'score' => 12])->assertCreated()->json('data.id');
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->period->update(['grading_open' => false]));
    $this->patchJson("/api/v1/scores/$id", ['score' => 13, 'reason' => 'Corrección'])->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->period->update(['grading_open' => true]));
    $this->postJson("/api/v1/assessments/$a/close")->assertOk();
    $this->patchJson("/api/v1/scores/$id", ['score' => 13, 'reason' => 'Corrección'])->assertUnprocessable();
});

it('preserves previous scores reason and actor with atomic audit rollback', function () {
    $a = learningAssessment($this);
    $id = $this->postJson("/api/v1/assessments/$a/scores", ['student_id' => $this->enrollment->student_id, 'score' => 12])->assertCreated()->json('data.id');
    $this->patchJson("/api/v1/scores/$id", ['score' => 15])->assertUnprocessable();
    $this->patchJson("/api/v1/scores/$id", ['score' => 15, 'reason' => 'Corrección de registro'])->assertOk();
    $this->getJson("/api/v1/scores/$id/history")->assertOk()->assertJsonCount(2, 'data')->assertJsonPath('data.1.old_score', '12.00')->assertJsonPath('data.1.new_score', '15.00')->assertJsonPath('data.1.changed_by', $this->teacher->id);
    $this->mock(LearningAudit::class)->shouldReceive('record')->andThrow(new RuntimeException('Audit unavailable'));
    $this->patchJson("/api/v1/scores/$id", ['score' => 16, 'reason' => 'Reversión'])->assertStatus(500);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        expect(Score::find($id)->score)->toBe('15.00');
        expect(ScoreHistory::where('score_id', $id)->count())->toBe(2);
    });
});

it('rejects unsafe files and cleans failed uploads while respecting revoked enrollment', function () {
    $task = learningTask($this);
    $this->postJson("/api/v1/assignments/$task/publish")->assertOk();
    learningLogin($this, $this->student)->post("/api/v1/assignments/$task/submissions", ['file' => UploadedFile::fake()->createWithContent('virus.php', '<?php exit;')])->assertUnprocessable();
    $this->mock(LearningAudit::class)->shouldReceive('record')->andThrow(new RuntimeException('Audit unavailable'));
    $this->post("/api/v1/assignments/$task/submissions", ['file' => UploadedFile::fake()->createWithContent('ok.txt', 'Texto seguro')])->assertStatus(500);
    expect(Storage::disk('materials')->allFiles())->toBe([]);
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->enrollment->update(['status' => 'CANCELLED']));
    $this->getJson("/api/v1/assignments/$task")->assertNotFound();
    $this->postJson("/api/v1/assignments/$task/submissions", ['content' => 'Sin matrícula'])->assertForbidden();
});
