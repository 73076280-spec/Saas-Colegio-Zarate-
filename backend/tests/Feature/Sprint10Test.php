<?php

use App\Http\Controllers\Api\ReportController;
use App\Models\Academic\AcademicPeriod;
use App\Models\Attendance\AttendanceRecord;
use App\Models\Attendance\AttendanceSession;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\PaymentConcept;
use App\Models\Enrollment\StudentPayment;
use App\Models\Institution;
use App\Models\Learning\Assessment;
use App\Models\Learning\AssessmentType;
use App\Models\Learning\Assignment;
use App\Models\Learning\Score;
use App\Models\Learning\Submission;
use App\Models\Office\AcademicRequest;
use App\Models\Office\Communication;
use App\Models\Office\RequestType;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\Reports\ReportCatalog;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

uses(DatabaseTransactions::class);
beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    $this->institution = Institution::factory()->create();
    app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $this->admin = User::factory()->create();
        $this->admin->assignRole('ADMINISTRATOR');
        $this->course = Course::factory()->create(['status' => 'ACTIVE']);
        $this->course->academicYear->update(['is_current' => true]);
        $this->enrollment = Enrollment::where('section_id', $this->course->section_id)->firstOrFail();
        $this->enrollment->update(['status' => 'APPROVED']);
        $this->student = $this->enrollment->student->load('user');
        $this->teacher = $this->course->teacher->user;
        $this->guardian = Guardian::factory()->create()->load('user');
        StudentGuardian::create(['student_id' => $this->student->id, 'guardian_id' => $this->guardian->id, 'relationship' => 'MOTHER', 'is_primary' => true]);
        $period = AcademicPeriod::create(['academic_year_id' => $this->course->academic_year_id, 'name' => 'Periodo final', 'sequence' => 1, 'start_date' => '2026-03-01', 'end_date' => '2026-12-20', 'grading_open' => true, 'status' => 'ACTIVE']);
        $type = AssessmentType::create(['name' => 'Práctica', 'code' => 'PR', 'status' => 'ACTIVE']);
        $this->assessment = Assessment::create(['course_id' => $this->course->id, 'academic_period_id' => $period->id, 'assessment_type_id' => $type->id, 'title' => 'Evaluación privada', 'max_score' => 20, 'status' => 'PUBLISHED', 'created_by' => $this->admin->id, 'evaluation_date' => today()]);
        Score::create(['assessment_id' => $this->assessment->id, 'student_id' => $this->student->id, 'score' => 17, 'graded_by' => $this->admin->id, 'graded_at' => now()]);
        $this->assignment = Assignment::create(['course_id' => $this->course->id, 'title' => 'Tarea pendiente', 'description' => 'Prueba', 'due_at' => now()->addDay(), 'status' => 'PUBLISHED', 'created_by' => $this->admin->id]);
        $session = AttendanceSession::create(['course_id' => $this->course->id, 'date' => today(), 'status' => 'CLOSED', 'created_by' => $this->admin->id]);
        AttendanceRecord::create(['attendance_session_id' => $session->id, 'student_id' => $this->student->id, 'status' => 'ABSENT', 'recorded_by' => $this->admin->id]);
        $rt = RequestType::create(['name' => 'Constancia', 'code' => 'CONST', 'status' => 'ACTIVE']);
        AcademicRequest::create(['request_code' => 'SOL-TEST', 'student_id' => $this->student->id, 'request_type_id' => $rt->id, 'subject' => 'Privado', 'description' => 'No exportar descripción', 'status' => 'REGISTERED']);
        Communication::create(['title' => '=HYPERLINK("https://example.invalid")', 'body' => 'No exportar cuerpo', 'created_by' => $this->admin->id, 'status' => 'PUBLISHED', 'published_at' => now()]);
        $this->concept = PaymentConcept::create(['code' => 'MATRICULA_2026', 'name' => 'Matrícula', 'amount' => 150, 'status' => 'ACTIVE']);
        $this->payment = StudentPayment::create(['student_id' => $this->student->id, 'academic_year_id' => $this->course->academic_year_id, 'payment_concept_id' => $this->concept->id, 'amount' => 150, 'status' => 'PENDING', 'due_date' => today()->subDay()]);
    });
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json']);
    reportLogin($this, $this->admin);
});
afterEach(fn () => app(InstitutionContext::class)->set(null));
function reportLogin($test, User $user): void
{
    Auth::forgetGuards();
    app('session')->flush();
    $test->actingAs($user, 'web');
}

it('serves all report families with real rows filters and pagination', function () {
    $this->getJson('/api/v1/reports')->assertOk()->assertJsonCount(20, 'data');
    foreach (array_keys(ReportCatalog::ITEMS) as $key) {
        $this->getJson('/api/v1/reports/'.$key.'?per_page=1')->assertOk()->assertJsonPath('total', 1)->assertJsonCount(1, 'data');
    }
    $base = '/api/v1/reports/course-scores';
    $this->getJson($base.'?academic_period_id='.$this->assessment->academic_period_id.'&student_id='.$this->student->id)->assertOk()->assertJsonPath('data.0.Nota', '17.00');
    $this->getJson($base.'?date_to=2000-01-01')->assertOk()->assertJsonPath('total', 0);
    $this->getJson($base.'?date_from=2026-12-01&date_to=2026-01-01')->assertUnprocessable();
    $this->getJson($base.'?per_page=101')->assertUnprocessable();
    $this->getJson('/api/v1/reports/section-capacity?section_id='.$this->course->section_id)->assertJsonPath('data.0.Ocupados', 1)->assertJsonPath('data.0.Disponibles', 29);
    $this->getJson('/api/v1/reports/course-scores/options/course_id')->assertOk()->assertJsonCount(1, 'data');
});

it('isolates institutions and restricts report and selector access by role and ownership', function () {
    $otherInstitution = Institution::factory()->create();
    $foreign = app(InstitutionContext::class)->run($otherInstitution->id, function () {
        (new RolePermissionSeeder)->run();

        return Course::factory()->create(['name' => 'Curso ajeno']);
    });
    $this->getJson('/api/v1/reports/teacher-courses')->assertJsonCount(1, 'data')->assertDontSee('Curso ajeno');
    $this->getJson('/api/v1/reports/course-scores?course_id='.$foreign->id)->assertUnprocessable();
    $this->getJson('/api/v1/dashboard?academic_year_id='.$foreign->academic_year_id)->assertUnprocessable();
    $this->getJson('/api/v1/reports/active-students?institution_id='.$otherInstitution->id)->assertUnprocessable();
    $otherCourse = app(InstitutionContext::class)->run($this->institution->id, fn () => Course::factory()->create(['name' => 'Otro docente']));
    reportLogin($this, $this->teacher);
    $this->getJson('/api/v1/reports/teacher-courses')->assertOk()->assertJsonCount(1, 'data')->assertDontSee('Otro docente');
    $this->getJson('/api/v1/reports/course-scores/options/course_id')->assertJsonCount(1, 'data');
    $this->getJson('/api/v1/reports/teacher-courses?course_id='.$otherCourse->id)->assertJsonPath('total', 0);
    $this->getJson('/api/v1/reports/enrollment-payments/export')->assertForbidden();
    foreach ([$this->student->user, $this->guardian->user] as $user) {
        reportLogin($this, $user);
        $this->getJson('/api/v1/reports')->assertJsonCount(0, 'data');
        $this->getJson('/api/v1/reports/student-scores')->assertForbidden();
        $this->getJson('/api/v1/reports/student-scores/export')->assertForbidden();
        $this->getJson('/api/v1/reports/student-scores/options/student_id')->assertForbidden();
    }
});

it('exports filtered CSV with private fields excluded and spreadsheet formulas neutralized', function () {
    $response = $this->get('/api/v1/reports/published-communications/export')->assertOk()->assertHeader('content-type', 'text/csv; charset=UTF-8');
    $csv = $response->streamedContent();
    expect($csv)->toContain("'=HYPERLINK")->not->toContain('No exportar cuerpo')->not->toContain('institution_id');
    $filtered = $this->get('/api/v1/reports/published-communications/export?date_to=2000-01-01')->assertOk()->streamedContent();
    expect($filtered)->toContain('Sin resultados')->not->toContain('HYPERLINK');
    $requests = $this->get('/api/v1/reports/request-status/export')->assertOk()->streamedContent();
    expect($requests)->toContain('SOL-TEST')->not->toContain('No exportar descripción')->not->toContain('file_path');
    expect(ReportController::csvCell(" \t+SUM(1)"))->toStartWith("'");
});

it('serves six real dashboards while keeping family and student summaries private', function () {
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create()->load('user'));
    foreach (['ADMINISTRATOR', 'SECRETARY', 'TREASURY'] as $role) {
        $user = app(InstitutionContext::class)->run($this->institution->id, function () use ($role) {
            $u = User::factory()->create();
            $u->assignRole($role);

            return $u;
        });
        reportLogin($this, $user);
        $this->getJson('/api/v1/dashboard')->assertOk()->assertJsonPath('role', $role);
    }
    reportLogin($this, $this->teacher);
    $this->getJson('/api/v1/dashboard')->assertOk()->assertJsonPath('cards.0.value', 1);
    foreach ([$this->student->user, $this->guardian->user] as $user) {
        reportLogin($this, $user);
        $this->getJson('/api/v1/dashboard')->assertOk()->assertSee('17.00')->assertDontSee($other->user->name)->assertSee($this->student->user->name);
    }
    reportLogin($this, $other->user);
    $this->getJson('/api/v1/dashboard')->assertOk()->assertDontSee('Evaluación privada');
    app(InstitutionContext::class)->run($this->institution->id, fn () => StudentGuardian::where('guardian_id', $this->guardian->id)->delete());
    reportLogin($this, $this->guardian->user);
    $this->getJson('/api/v1/dashboard')->assertOk()->assertJsonCount(0, 'sections');
});

it('counts missing deliveries once per student and financial validation including absent payments', function () {
    app(InstitutionContext::class)->run($this->institution->id, function () {
        foreach ([1, 2] as $attempt) {
            Submission::create(['assignment_id' => $this->assignment->id, 'student_id' => $this->student->id, 'attempt' => $attempt, 'content' => 'Prueba', 'submitted_at' => now(), 'status' => 'SUBMITTED']);
        }
        $this->enrollment->update(['status' => 'PENDING']);
        $this->payment->delete();
    });
    $treasury = app(InstitutionContext::class)->run($this->institution->id, function () {
        $u = User::factory()->create();
        $u->assignRole('TREASURY');

        return $u;
    });
    reportLogin($this, $treasury);
    $cards = collect($this->getJson('/api/v1/dashboard')->assertOk()->json('cards'))->pluck('value', 'label');
    expect($cards['Matrículas pendientes de validación económica'])->toBe(1);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($treasury) {
        StudentPayment::create(['student_id' => $this->student->id, 'academic_year_id' => $this->course->academic_year_id, 'payment_concept_id' => $this->concept->id, 'amount' => 150, 'status' => 'PAID', 'paid_at' => now(), 'validated_by' => $treasury->id]);
        $this->enrollment->update(['status' => 'APPROVED']);
    });
    reportLogin($this, $this->admin);
    $this->getJson('/api/v1/reports/assignment-submissions')->assertOk()->assertJsonPath('data.0.Entregaron', 1)->assertJsonPath('data.0.Sin entrega', 0);
    $this->getJson('/api/v1/reports/missing-submissions')->assertOk()->assertJsonPath('total', 0);
});
