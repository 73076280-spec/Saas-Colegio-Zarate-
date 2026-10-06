<?php

use App\Models\Academic\AcademicYear;
use App\Models\Academic\Section;
use App\Models\AuditLog;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\EnrollmentStatusHistory;
use App\Models\Enrollment\StudentPayment;
use App\Models\Institution;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Models\User;
use App\Services\Enrollment\EnrollmentAudit;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

uses(DatabaseTransactions::class);
beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    $this->institution = Institution::factory()->create();
    [$this->admin,$this->fixture] = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $u = User::factory()->create();
        $u->assignRole('ADMINISTRATOR');

        return [$u, Enrollment::factory()->create()];
    });
    $this->payload = array_intersect_key($this->fixture->getAttributes(), array_flip(['student_id', 'academic_year_id', 'grade_level_id', 'section_id']));
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->fixture->update(['status' => 'CANCELLED']));
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->admin, 'web');
});
afterEach(fn () => app(InstitutionContext::class)->set(null));
function enrollmentRole($test, string $role): User
{
    return app(InstitutionContext::class)->run($test->institution->id, function () use ($role) {
        $u = User::factory()->create();
        $u->assignRole($role);

        return $u;
    });
}
function newEnrollment($test): int
{
    return $test->postJson('/api/v1/enrollments', $test->payload)->assertCreated()->json('data.id');
}
it('creates unique codes rejects duplicate and protected fields and filters results', function () {
    $id = newEnrollment($this);
    $this->getJson('/api/v1/enrollments/'.$id)->assertOk()->assertJsonPath('data.status', 'DRAFT')->assertJsonCount(1, 'data.history')->assertJsonMissingPath('data.student.document_number');
    $this->postJson('/api/v1/enrollments', $this->payload)->assertUnprocessable()->assertJsonValidationErrors('student_id');
    $this->postJson('/api/v1/enrollments', array_merge($this->payload, ['status' => 'APPROVED', 'institution_id' => 999]))->assertUnprocessable()->assertJsonValidationErrors(['status', 'institution_id']);
    $this->getJson('/api/v1/enrollments?status=DRAFT&student_id='.$this->payload['student_id'])->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/api/v1/enrollments?per_page=101')->assertUnprocessable();
});
it('runs correction approval cancellation with immutable history and audit', function () {
    $id = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$id/approve")->assertUnprocessable();
    $this->patchJson("/api/v1/enrollments/$id", ['observations' => 'Corrección ficticia'])->assertOk();
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk()->assertJsonPath('data.status', 'PENDING');
    $this->patchJson("/api/v1/enrollments/$id", ['observations' => 'No permitido'])->assertUnprocessable();
    $this->postJson("/api/v1/enrollments/$id/observe")->assertUnprocessable();
    $this->postJson("/api/v1/enrollments/$id/observe", ['comment' => 'Revisar datos'])->assertOk();
    $this->patchJson("/api/v1/enrollments/$id", ['observations' => 'Corregido'])->assertOk();
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk();
    $this->postJson("/api/v1/enrollments/$id/approve")->assertOk()->assertJsonPath('data.status', 'APPROVED')->assertJsonPath('data.approved_by', $this->admin->id);
    $this->postJson("/api/v1/enrollments/$id/cancel", ['comment' => 'Solicitud ficticia'])->assertOk()->assertJsonCount(6, 'data.history');
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        expect(AuditLog::where('entity_type', 'enrollments')->where('entity_id', $id)->count())->toBe(8);
        expect(fn () => EnrollmentStatusHistory::first()->update(['comment' => 'alterado']))->toThrow(LogicException::class);
        expect(fn () => Enrollment::find($id)->forceDelete())->toThrow(LogicException::class);
    });
    newEnrollment($this);
});
it('rejects nonexistent or inconsistent academic references', function (string $field) {
    $payload = $this->payload;
    $payload[$field] = 99999999;
    $this->postJson('/api/v1/enrollments', $payload)->assertUnprocessable()->assertJsonValidationErrors($field);
})->with(['student_id', 'academic_year_id', 'grade_level_id', 'section_id']);
it('rechecks student year and section before approval', function (string $target) {
    $id = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($target) {
        match ($target) {
            'student' => Student::find($this->payload['student_id'])->update(['status' => 'INACTIVE']), 'year' => AcademicYear::find($this->payload['academic_year_id'])->update(['status' => 'CLOSED']), 'section' => Section::find($this->payload['section_id'])->update(['status' => 'INACTIVE'])
        };
    });
    $this->postJson("/api/v1/enrollments/$id/approve")->assertUnprocessable();
    $this->getJson("/api/v1/enrollments/$id")->assertJsonPath('data.status', 'PENDING')->assertJsonCount(2, 'data.history');
})->with(['student', 'year', 'section']);
it('consumes only approved capacity and releases it on cancellation', function () {
    app(InstitutionContext::class)->run($this->institution->id, fn () => Section::find($this->payload['section_id'])->update(['capacity' => 1]));
    $first = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$first/submit")->assertOk();
    $this->payload['student_id'] = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create()->id);
    $second = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$second/submit")->assertOk();
    $this->postJson("/api/v1/enrollments/$first/approve")->assertOk();
    $this->postJson("/api/v1/enrollments/$second/approve")->assertUnprocessable()->assertJsonValidationErrors('section_id');
    $this->postJson("/api/v1/enrollments/$first/cancel", ['comment' => 'Liberar cupo'])->assertOk();
    $this->postJson("/api/v1/enrollments/$second/approve")->assertOk();
});
it('requires correct validated payment and separates secretary from treasury', function () {
    $concept = $this->postJson('/api/v1/payment-concepts', ['name' => 'Matrícula', 'code' => 'MATRICULA_2026', 'amount' => '150.00'])->assertCreated()->json('data.id');
    $id = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk();
    $this->postJson("/api/v1/enrollments/$id/approve")->assertUnprocessable()->assertJsonValidationErrors('payment');
    $treasury = enrollmentRole($this, 'TREASURY');
    $secretary = enrollmentRole($this, 'SECRETARY');
    enrollmentLogin($this, $treasury, 'web');
    $payment = $this->postJson('/api/v1/student-payments', ['student_id' => $this->payload['student_id'], 'academic_year_id' => $this->payload['academic_year_id'], 'payment_concept_id' => $concept, 'amount' => '150.00'])->assertCreated()->json('data.id');
    $this->postJson("/api/v1/enrollments/$id/approve")->assertForbidden();
    enrollmentLogin($this, $secretary, 'web')->postJson("/api/v1/student-payments/$payment/validate")->assertForbidden();
    $this->postJson("/api/v1/enrollments/$id/approve")->assertUnprocessable();
    enrollmentLogin($this, $treasury, 'web')->postJson("/api/v1/student-payments/$payment/validate")->assertOk()->assertJsonPath('data.status', 'PAID');
    $this->patchJson("/api/v1/student-payments/$payment", ['amount' => '1.00'])->assertUnprocessable();
    enrollmentLogin($this, $secretary, 'web')->postJson("/api/v1/enrollments/$id/approve")->assertOk();
});
it('does not accept another students payment or forged paid status', function () {
    $concept = $this->postJson('/api/v1/payment-concepts', ['name' => 'Matrícula', 'code' => 'MATRICULA_2026', 'amount' => '150.00'])->assertCreated()->json('data.id');
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create()->id);
    $data = ['student_id' => $other, 'academic_year_id' => $this->payload['academic_year_id'], 'payment_concept_id' => $concept, 'amount' => '150.00'];
    $this->postJson('/api/v1/student-payments', $data + ['status' => 'PAID'])->assertUnprocessable();
    $p = $this->postJson('/api/v1/student-payments', $data)->assertCreated()->json('data.id');
    $this->postJson("/api/v1/student-payments/$p/validate")->assertOk();
    $id = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk();
    $this->postJson("/api/v1/enrollments/$id/approve")->assertUnprocessable()->assertJsonValidationErrors('payment');
});
it('isolates foreign enrollment student section payment and history', function () {
    $foreign = Institution::factory()->create();
    [$e,$p] = app(InstitutionContext::class)->run($foreign->id, function () {
        (new RolePermissionSeeder)->run();

        return [Enrollment::factory()->create(), StudentPayment::factory()->create()];
    });
    $this->getJson("/api/v1/enrollments/$e->id")->assertNotFound();
    $this->postJson("/api/v1/enrollments/$e->id/submit")->assertNotFound();
    $this->getJson("/api/v1/student-payments/$p->id")->assertNotFound();
    $this->postJson("/api/v1/student-payments/$p->id/validate")->assertNotFound();
    foreach (['student_id', 'section_id'] as $field) {
        $this->postJson('/api/v1/enrollments', array_merge($this->payload, [$field => $e->$field]))->assertUnprocessable();
    }
    $this->getJson('/api/v1/enrollments')->assertJsonMissing(['id' => $e->id, 'enrollment_code' => $e->enrollment_code]);
});
it('limits student guardian and teacher access and minimal treasury lookup', function () {
    $id = newEnrollment($this);
    [$student,$guardian,$unrelated] = app(InstitutionContext::class)->run($this->institution->id, function () {
        $s = Student::find($this->payload['student_id']);
        $g = Guardian::factory()->create();
        $other = Guardian::factory()->create();
        StudentGuardian::create(['student_id' => $s->id, 'guardian_id' => $g->id, 'relationship' => 'GUARDIAN']);

        return [$s->user, $g->user, $other->user];
    });
    foreach ([$student, $guardian] as $user) {
        enrollmentLogin($this, $user, 'web')->getJson("/api/v1/enrollments/$id")->assertOk();
        $this->getJson('/api/v1/enrollments')->assertJsonCount(2, 'data');
        $this->postJson("/api/v1/enrollments/$id/submit")->assertForbidden();
        $this->getJson('/api/v1/student-payments')->assertForbidden();
    }
    enrollmentLogin($this, $unrelated, 'web')->getJson("/api/v1/enrollments/$id")->assertNotFound();
    $this->getJson('/api/v1/enrollments')->assertJsonCount(0, 'data');
    enrollmentLogin($this, enrollmentRole($this, 'TEACHER'), 'web')->postJson('/api/v1/enrollments', $this->payload)->assertForbidden();
    enrollmentLogin($this, enrollmentRole($this, 'TREASURY'), 'web')->getJson('/api/v1/enrollment-options?kind=students')->assertOk()->assertJsonMissingPath('data.0.document_number');
});
it('rolls back enrollment history and payment validation when audit fails', function () {
    $this->mock(EnrollmentAudit::class)->shouldReceive('record')->andThrow(new RuntimeException('audit unavailable'));
    $this->postJson('/api/v1/enrollments', $this->payload)->assertStatus(500);
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(Enrollment::where('status', 'DRAFT')->count())->toBe(0));
    $this->forgetMock(EnrollmentAudit::class);
    $id = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk();
    $this->mock(EnrollmentAudit::class)->shouldReceive('record')->andThrow(new RuntimeException('audit unavailable'));
    $this->postJson("/api/v1/enrollments/$id/approve")->assertStatus(500);
    $this->getJson("/api/v1/enrollments/$id")->assertJsonPath('data.status', 'PENDING')->assertJsonCount(2, 'data.history');
});
it('rejects a pending application with history and allows a fresh application', function () {
    $id = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk();
    $this->postJson("/api/v1/enrollments/$id/reject", ['comment' => 'Requisitos no cumplidos'])->assertOk()->assertJsonPath('data.status', 'REJECTED');
    $this->postJson("/api/v1/enrollments/$id/submit")->assertUnprocessable();
    newEnrollment($this);
});

function enrollmentLogin($test, User $user, string $guard = 'web')
{
    Auth::forgetGuards();
    app('session')->flush();

    return $test->actingAs($user, $guard);
}
it('rejects sections from another year or grade and inactive drafts', function () {
    app(InstitutionContext::class)->run($this->institution->id, function () {
        $other = Enrollment::factory()->create();
        $this->wrongSection = $other->section_id;
        Student::find($this->payload['student_id'])->update(['status' => 'INACTIVE']);
    });
    $this->postJson('/api/v1/enrollments', $this->payload)->assertUnprocessable()->assertJsonValidationErrors('student_id');
    app(InstitutionContext::class)->run($this->institution->id, fn () => Student::find($this->payload['student_id'])->update(['status' => 'ACTIVE']));
    $this->postJson('/api/v1/enrollments', array_merge($this->payload, ['section_id' => $this->wrongSection]))->assertUnprocessable()->assertJsonValidationErrors('section_id');
    app(InstitutionContext::class)->run($this->institution->id, fn () => AcademicYear::find($this->payload['academic_year_id'])->update(['status' => 'CLOSED']));
    $this->postJson('/api/v1/enrollments', $this->payload)->assertUnprocessable()->assertJsonValidationErrors('academic_year_id');
});
it('enforces duplicate prevention in the database including soft deleted active rows', function () {
    $id = newEnrollment($this);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        $e = Enrollment::find($id);
        expect(fn () => DB::table('enrollments')->insert(array_merge($this->payload, ['institution_id' => $this->institution->id, 'status' => 'APPROVED', 'enrollment_code' => 'DUPLICATE-TEST', 'created_at' => now(), 'updated_at' => now()])))->toThrow(QueryException::class);
        $e->delete();
    });
    $this->postJson('/api/v1/enrollments', $this->payload)->assertUnprocessable();
});
it('allows unlimited capacity and rejects zero capacity', function () {
    app(InstitutionContext::class)->run($this->institution->id, fn () => Section::find($this->payload['section_id'])->update(['capacity' => 0]));
    $id = newEnrollment($this);
    $this->postJson("/api/v1/enrollments/$id/submit")->assertOk();
    $this->postJson("/api/v1/enrollments/$id/approve")->assertUnprocessable()->assertJsonValidationErrors('section_id');
    app(InstitutionContext::class)->run($this->institution->id, fn () => Section::find($this->payload['section_id'])->update(['capacity' => null]));
    $this->postJson("/api/v1/enrollments/$id/approve")->assertOk();
});
it('rejects short payments supports overdue validation and rolls it back on audit failure', function () {
    $concept = $this->postJson('/api/v1/payment-concepts', ['name' => 'Matrícula', 'code' => 'MATRICULA_2026', 'amount' => '150.00'])->assertCreated()->json('data.id');
    $payment = $this->postJson('/api/v1/student-payments', ['student_id' => $this->payload['student_id'], 'academic_year_id' => $this->payload['academic_year_id'], 'payment_concept_id' => $concept, 'amount' => '100.00', 'status' => 'OVERDUE'])->assertCreated()->json('data.id');
    $this->postJson("/api/v1/student-payments/$payment/validate")->assertUnprocessable()->assertJsonValidationErrors('amount');
    $this->patchJson("/api/v1/student-payments/$payment", ['amount' => '150.00'])->assertOk();
    $this->mock(EnrollmentAudit::class)->shouldReceive('record')->andThrow(new RuntimeException('audit unavailable'));
    $this->postJson("/api/v1/student-payments/$payment/validate")->assertStatus(500);
    $this->getJson("/api/v1/student-payments/$payment")->assertOk()->assertJsonPath('data.status', 'OVERDUE')->assertJsonPath('data.validated_by', null);
    $this->forgetMock(EnrollmentAudit::class);
    $this->postJson("/api/v1/student-payments/$payment/validate")->assertOk()->assertJsonPath('data.status', 'PAID');
    $this->postJson("/api/v1/student-payments/$payment/validate")->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($payment) {
        $log = AuditLog::where('entity_type', 'student_payments')->where('entity_id', $payment)->where('action', 'PAYMENT_VALIDATE')->firstOrFail();
        expect($log->old_values['status'])->toBe('OVERDUE');
        expect($log->new_values['status'])->toBe('PAID');
        expect($log->new_values)->not->toHaveKeys(['observations', 'password', 'document_number']);
    });
});
it('rejects foreign payment references and cancelled validation', function () {
    $foreign = Institution::factory()->create();
    $p = app(InstitutionContext::class)->run($foreign->id, function () {
        (new RolePermissionSeeder)->run();

        return StudentPayment::factory()->create();
    });
    $base = ['student_id' => $this->payload['student_id'], 'academic_year_id' => $this->payload['academic_year_id'], 'payment_concept_id' => $p->payment_concept_id, 'amount' => '150.00'];
    $this->postJson('/api/v1/student-payments', $base)->assertUnprocessable()->assertJsonValidationErrors('payment_concept_id');
    $c = $this->postJson('/api/v1/payment-concepts', ['name' => 'Demo', 'code' => 'DEMO', 'amount' => '150.00'])->assertCreated()->json('data.id');
    $base['payment_concept_id'] = $c;
    foreach (['student_id', 'academic_year_id'] as $key) {
        $this->postJson('/api/v1/student-payments', array_merge($base, [$key => $p->$key]))->assertUnprocessable()->assertJsonValidationErrors($key);
    }
    $id = $this->postJson('/api/v1/student-payments', $base + ['status' => 'CANCELLED'])->assertCreated()->json('data.id');
    $this->postJson("/api/v1/student-payments/$id/validate")->assertUnprocessable();
});
