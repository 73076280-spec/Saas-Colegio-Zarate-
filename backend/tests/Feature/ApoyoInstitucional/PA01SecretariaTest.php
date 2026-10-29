
<?php

use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Models\Office\RequestType;
use App\Models\People\Student;
use App\Models\User;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

uses(DatabaseTransactions::class);

beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');

    Storage::fake('materials');

    $this->institution = Institution::factory()->create();

    [$this->student, $this->profile, $this->secretary, $this->type] =
        app(InstitutionContext::class)->run(
            $this->institution->id,
            function () {
                (new RolePermissionSeeder)->run();

                $course = Course::factory()->create([
                    'status' => 'ACTIVE',
                ]);

                $enrollment = Enrollment::where(
                    'section_id',
                    $course->section_id
                )->firstOrFail();

                $enrollment->update(['status' => 'APPROVED']);

                $secretary = User::factory()->create();
                $secretary->assignRole('SECRETARY');

                $type = RequestType::create([
                    'name' => 'Constancia',
                    'code' => 'CONSTANCIA',
                    'status' => 'ACTIVE',
                ]);

                return [
                    $enrollment->student->user,
                    $enrollment->student,
                    $secretary,
                    $type,
                ];
            }
        );

    $this->withHeaders([
        'Origin' => 'http://localhost:5173',
        'Accept' => 'application/json',
    ])->actingAs($this->student, 'web');
});

afterEach(function () {
    app(InstitutionContext::class)->set(null);
});

function apoyoLogin($test, User $user)
{
    Auth::forgetGuards();
    app('session')->flush();

    return $test->actingAs($user, 'web');
}

function apoyoCreateRequest($test): int
{
    return $test->postJson('/api/v1/academic-requests', [
        'request_type_id' => $test->type->id,
        'subject' => 'Solicitud de prueba',
        'description' => 'Descripción ficticia',
    ])->assertCreated()->json('data.id');
}

/*
|--------------------------------------------------------------------------
| CP-PA01-01
| Rechazar tipos de solicitud inactivos
|--------------------------------------------------------------------------
*/

it('PA01-01 rejects inactive request types', function () {
    app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => $this->type->update(['status' => 'INACTIVE'])
    );

    $before = AcademicRequest::count();

    $this->postJson('/api/v1/academic-requests', [
        'request_type_id' => $this->type->id,
        'subject' => 'Solicitud no permitida',
        'description' => 'Tipo de solicitud inactivo',
    ])->assertUnprocessable();

    expect(AcademicRequest::count())->toBe($before);
});

/*
|--------------------------------------------------------------------------
| CP-PA01-02
| Rechazar documentos vinculados a otro estudiante
|--------------------------------------------------------------------------
*/

it('PA01-02 rejects documents linked to another student', function () {
    $requestId = apoyoCreateRequest($this);

    $otherStudent = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => Student::factory()->create()
    );

    apoyoLogin($this, $this->secretary);

    $before = AcademicDocument::count();

    $this->postJson('/api/v1/academic-documents', [
        'academic_request_id' => $requestId,
        'student_id' => $otherStudent->id,
        'document_type' => 'CONSTANCIA',
    ])->assertUnprocessable();

    expect(AcademicDocument::count())->toBe($before);
});

/*
|--------------------------------------------------------------------------
| CP-PA01-03
| Impedir cancelaciones repetidas
|--------------------------------------------------------------------------
*/

it('PA01-03 rejects repeated document cancellation', function () {
    apoyoLogin($this, $this->secretary);

    $documentId = $this->postJson('/api/v1/academic-documents', [
        'student_id' => $this->profile->id,
        'document_type' => 'CONSTANCIA',
    ])->assertCreated()->json('data.id');

    $this->postJson(
        "/api/v1/academic-documents/{$documentId}/cancel"
    )->assertOk()->assertJsonPath('data.status', 'CANCELLED');

    $this->postJson(
        "/api/v1/academic-documents/{$documentId}/cancel"
    )->assertUnprocessable();

    $status = app(InstitutionContext::class)->run(
    $this->institution->id,
    fn () => AcademicDocument::findOrFail($documentId)->status
);

expect($status)->toBe('CANCELLED');
  }
);
