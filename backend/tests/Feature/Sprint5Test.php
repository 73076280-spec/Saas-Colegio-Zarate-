<?php

use App\Models\Academic\AcademicYear;
use App\Models\Academic\Subject;
use App\Models\AuditLog;
use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\People\Student;
use App\Models\People\Teacher;
use App\Models\User;
use App\Services\Courses\TeachingService;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

uses(DatabaseTransactions::class);
beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    $this->institution = Institution::factory()->create();
    [$this->admin,$this->assignment] = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $u = User::factory()->create();
        $u->assignRole('ADMINISTRATOR');

        return [$u, TeacherAssignment::factory()->create()];
    });
    $this->payload = array_intersect_key($this->assignment->getAttributes(), array_flip(TeachingService::KEYS));
    $this->coursePayload = $this->payload + ['teacher_assignment_id' => $this->assignment->id, 'name' => 'Curso ficticio', 'code' => 'TEST-COURSE'];
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->admin, 'web');
});
afterEach(fn () => app(InstitutionContext::class)->set(null));
function teachingLogin($test, User $user)
{
    Auth::forgetGuards();
    app('session')->flush();

    return $test->actingAs($user, 'web');
}
function teachingUser($test, string $role): User
{
    return app(InstitutionContext::class)->run($test->institution->id, function () use ($role) {
        $u = User::factory()->create();
        $u->assignRole($role);

        return $u;
    });
}
function teachingCourse($test): int
{
    return $test->postJson('/api/v1/courses', $test->coursePayload)->assertCreated()->json('data.id');
}
it('creates assignments and rejects equivalence while allowing co teachers', function () {
    $this->postJson('/api/v1/teacher-assignments', $this->payload)->assertUnprocessable();
    $this->payload['teacher_id'] = app(InstitutionContext::class)->run($this->institution->id, fn () => Teacher::factory()->create()->id);
    $id = $this->postJson('/api/v1/teacher-assignments', $this->payload)->assertCreated()->assertJsonPath('data.status', 'ACTIVE')->json('data.id');
    $this->getJson("/api/v1/teacher-assignments/$id")->assertOk()->assertJsonMissingPath('data.teacher.document_number');
    $this->postJson("/api/v1/teacher-assignments/$id/disable")->assertOk()->assertJsonPath('data.status', 'INACTIVE');
});
it('rejects missing inactive and academically inconsistent assignment references', function () {
    foreach (['teacher_id', 'subject_id', 'academic_year_id', 'grade_level_id', 'section_id'] as $key) {
        $this->postJson('/api/v1/teacher-assignments', array_merge($this->payload, [$key => 99999999]))->assertUnprocessable()->assertJsonValidationErrors($key);
    }
    foreach (['teacher_id' => Teacher::class, 'subject_id' => Subject::class, 'academic_year_id' => AcademicYear::class] as $key => $class) {
        app(InstitutionContext::class)->run($this->institution->id, fn () => $class::find($this->payload[$key])->update(['status' => $key === 'academic_year_id' ? 'CLOSED' : 'INACTIVE']));
        $this->postJson('/api/v1/teacher-assignments', $this->payload)->assertUnprocessable()->assertJsonValidationErrors($key);
        app(InstitutionContext::class)->run($this->institution->id, fn () => $class::find($this->payload[$key])->update(['status' => 'ACTIVE']));
    }
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => TeacherAssignment::factory()->create());
    $this->postJson('/api/v1/teacher-assignments', array_merge($this->payload, ['section_id' => $other->section_id]))->assertUnprocessable()->assertJsonValidationErrors('section_id');
});
it('creates activates edits and closes courses with audit and unique codes', function () {
    $id = teachingCourse($this);
    $this->postJson('/api/v1/courses', $this->coursePayload)->assertUnprocessable();
    $this->postJson("/api/v1/courses/$id/activate")->assertOk()->assertJsonPath('data.status', 'ACTIVE');
    $this->patchJson("/api/v1/courses/$id", ['description' => 'Descripción ficticia'])->assertOk();
    $this->postJson("/api/v1/courses/$id/close")->assertOk()->assertJsonPath('data.status', 'CLOSED');
    $this->postJson("/api/v1/courses/$id/activate")->assertUnprocessable();
    $this->patchJson("/api/v1/courses/$id", ['name' => 'No permitido'])->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        expect(AuditLog::where('entity_type', 'courses')->where('entity_id', $id)->orderBy('id')->pluck('action')->map(fn ($a) => $a->value)->all())->toBe(['CREATE', 'ACTIVATE', 'UPDATE', 'CLOSE']);
        expect(fn () => Course::find($id)->forceDelete())->toThrow(LogicException::class);
    });
});
it('requires an active matching assignment and prevents detaching active teaching', function () {
    $this->postJson('/api/v1/courses', array_merge($this->coursePayload, ['teacher_assignment_id' => 999999]))->assertUnprocessable();
    $id = teachingCourse($this);
    $this->postJson("/api/v1/courses/$id/activate")->assertOk();
    $this->postJson('/api/v1/teacher-assignments/'.$this->assignment->id.'/disable')->assertUnprocessable();
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Teacher::factory()->create());
    $this->patchJson('/api/v1/teacher-assignments/'.$this->assignment->id, ['teacher_id' => $other->id])->assertUnprocessable();
    $this->patchJson("/api/v1/courses/$id", ['teacher_id' => $other->id])->assertUnprocessable();
    $this->patchJson("/api/v1/courses/$id", ['status' => 'INACTIVE'])->assertOk();
    $this->postJson('/api/v1/teacher-assignments/'.$this->assignment->id.'/disable')->assertOk();
    $this->postJson("/api/v1/courses/$id/activate")->assertUnprocessable();
});
it('limits teachers to assigned courses and an approved minimal roster', function () {
    $id = teachingCourse($this);
    $this->postJson("/api/v1/courses/$id/activate")->assertOk();
    [$teacher,$other] = app(InstitutionContext::class)->run($this->institution->id, function () {
        Enrollment::where('section_id', $this->assignment->section_id)->update(['status' => 'APPROVED']);

        return [$this->assignment->teacher->user, Course::factory()->create()];
    });
    teachingLogin($this, $teacher)->getJson('/api/v1/my/courses')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.students_count', 1);
    $this->getJson("/api/v1/courses/$id/students")->assertOk()->assertJsonCount(1, 'data')->assertJsonMissingPath('data.0.document_number')->assertJsonMissingPath('data.0.email');
    $this->getJson("/api/v1/courses/$other->id")->assertNotFound();
    $this->getJson("/api/v1/courses/$other->id/students")->assertNotFound();
    $this->postJson("/api/v1/courses/$id/close")->assertForbidden();
});
it('derives student access from approved enrollment and revokes it on cancellation', function () {
    $id = teachingCourse($this);
    $this->postJson("/api/v1/courses/$id/activate")->assertOk();
    [$student,$enrollment] = app(InstitutionContext::class)->run($this->institution->id, function () {
        $e = Enrollment::where('section_id', $this->assignment->section_id)->firstOrFail();
        $e->update(['status' => 'APPROVED']);

        return [$e->student->load('user'), $e];
    });
    teachingLogin($this, $student->user)->getJson('/api/v1/my/courses')->assertOk()->assertJsonCount(1, 'data');
    $this->getJson("/api/v1/courses/$id")->assertOk();
    $this->getJson("/api/v1/students/$student->id/courses")->assertOk()->assertJsonCount(1, 'data');
    $this->getJson("/api/v1/courses/$id/students")->assertNotFound();
    app(InstitutionContext::class)->run($this->institution->id, fn () => $enrollment->update(['status' => 'CANCELLED']));
    $this->getJson('/api/v1/my/courses')->assertJsonCount(0, 'data');
    $this->getJson("/api/v1/courses/$id")->assertNotFound();
});
it('denies students without approved enrollment or in another section', function () {
    $id = teachingCourse($this);
    $this->postJson("/api/v1/courses/$id/activate")->assertOk();
    [$pending,$unregistered,$other] = app(InstitutionContext::class)->run($this->institution->id, function () {
        $e = Enrollment::where('section_id', $this->assignment->section_id)->firstOrFail();
        $other = Enrollment::factory()->create(['status' => 'APPROVED']);

        return [$e->student->user, Student::factory()->create()->user, $other->student->user];
    });
    foreach ([$pending, $unregistered, $other] as $u) {
        teachingLogin($this, $u)->getJson('/api/v1/my/courses')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson("/api/v1/courses/$id")->assertNotFound();
    }
});
it('isolates institution references course queries and IDOR writes', function () {
    $foreign = Institution::factory()->create();
    $c = app(InstitutionContext::class)->run($foreign->id, function () {
        (new RolePermissionSeeder)->run();

        return Course::factory()->create();
    });
    $this->getJson("/api/v1/courses/$c->id")->assertNotFound();
    $this->patchJson("/api/v1/courses/$c->id", ['name' => 'Intrusión'])->assertNotFound();
    $this->postJson("/api/v1/courses/$c->id/activate")->assertNotFound();
    $this->getJson('/api/v1/teacher-assignments/'.$c->teacher_assignment_id)->assertNotFound();
    foreach (TeachingService::KEYS as $key) {
        $this->postJson('/api/v1/teacher-assignments', array_merge($this->payload, [$key => $c->$key]))->assertUnprocessable();
    }
    $this->getJson('/api/v1/courses')->assertJsonCount(0, 'data');
});
it('authorizes secretary read only and denies treasury guardian and unauthenticated management', function () {
    $id = teachingCourse($this);
    teachingLogin($this, teachingUser($this, 'SECRETARY'))->getJson('/api/v1/courses')->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/api/v1/teacher-assignments')->assertOk();
    $this->postJson('/api/v1/courses', $this->coursePayload)->assertForbidden();
    foreach (['TREASURY', 'GUARDIAN', 'STUDENT'] as $role) {
        teachingLogin($this, teachingUser($this, $role))->getJson("/api/v1/courses/$id")->assertNotFound();
        $this->getJson('/api/v1/teacher-assignments')->assertForbidden();
        $this->postJson("/api/v1/courses/$id/activate")->assertForbidden();
    }
    Auth::forgetGuards();
    app('session')->flush();
    $this->getJson('/api/v1/my/courses')->assertUnauthorized();
});
it('rolls back course and audit atomically', function () {
    $this->partialMock(TeachingService::class)->shouldReceive('audit')->andThrow(new RuntimeException('Audit unavailable'));
    $this->postJson('/api/v1/courses', $this->coursePayload)->assertStatus(500);
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(Course::count())->toBe(0));
});
it('validates filters pagination and protects state and institution fields', function () {
    teachingCourse($this);
    $this->getJson('/api/v1/courses?search=TEST-COURSE&status=DRAFT&teacher_id='.$this->assignment->teacher_id)->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/api/v1/courses?per_page=101')->assertUnprocessable();
    $this->getJson('/api/v1/courses?status=UNKNOWN')->assertUnprocessable();
    $this->postJson('/api/v1/courses', array_merge($this->coursePayload, ['status' => 'ACTIVE', 'institution_id' => 999]))->assertUnprocessable()->assertJsonValidationErrors(['status', 'institution_id']);
});
it('checks live academic eligibility on activation and hides inactive courses from students', function () {
    $id = teachingCourse($this);
    app(InstitutionContext::class)->run($this->institution->id, fn () => AcademicYear::find($this->assignment->academic_year_id)->update(['status' => 'CLOSED']));
    $this->postJson("/api/v1/courses/$id/activate")->assertUnprocessable()->assertJsonValidationErrors('academic_year_id');
    app(InstitutionContext::class)->run($this->institution->id, function () {
        AcademicYear::find($this->assignment->academic_year_id)->update(['status' => 'ACTIVE']);
        Enrollment::where('section_id', $this->assignment->section_id)->update(['status' => 'APPROVED']);
    });
    $student = app(InstitutionContext::class)->run($this->institution->id, fn () => Enrollment::where('section_id', $this->assignment->section_id)->first()->student->user);
    teachingLogin($this, $student)->getJson('/api/v1/my/courses')->assertJsonCount(0, 'data');
});
