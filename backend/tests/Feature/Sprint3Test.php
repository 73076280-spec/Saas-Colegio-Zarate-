<?php

use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\Institution;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Models\People\Teacher;
use App\Models\Role;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\People\PeopleCatalog;
use Database\Seeders\PeopleDemoSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;

uses(DatabaseTransactions::class);
function peopleTenant(): Institution
{
    $institution = Institution::factory()->create();
    app(InstitutionContext::class)->run($institution->id, fn () => (new RolePermissionSeeder)->run());

    return $institution;
}
function peopleAccount(Institution $institution, string $role): User
{
    return app(InstitutionContext::class)->run($institution->id, function () use ($role) {
        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    });
}
function peopleFixture(Institution $institution, string $type)
{
    return app(InstitutionContext::class)->run($institution->id, fn () => PeopleCatalog::model($type)::factory()->create());
}
beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $this->institution = peopleTenant();
    $this->admin = peopleAccount($this->institution, 'ADMINISTRATOR');
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->admin, 'web');
    $this->account = ['first_name' => 'Persona', 'last_name' => 'Ficticia', 'email' => 'person@example.test', 'password' => 'InitialPass123!', 'phone' => '000000000'];
    $this->payloads = [
        'students' => ['account' => $this->account, 'student_code' => 'TEST-STU', 'document_type' => 'DNI', 'document_number' => '00000001', 'birth_date' => '2012-06-15', 'admission_date' => '2026-03-02'],
        'teachers' => ['account' => $this->account, 'teacher_code' => 'TEST-TCH', 'document_type' => 'DNI', 'document_number' => '00000002', 'specialty' => 'Especialidad ficticia', 'hire_date' => '2026-02-01'],
        'guardians' => ['account' => $this->account, 'document_type' => 'DNI', 'document_number' => '00000003', 'occupation' => 'Ocupación ficticia'],
    ];
});
afterEach(fn () => app(InstitutionContext::class)->set(null));

it('creates a hashed account and person atomically with the fixed role', function (string $type) {
    $data = $this->postJson('/api/v1/'.$type, $this->payloads[$type])->assertCreated()->assertJsonPath('data.status', 'ACTIVE')->assertJsonMissingPath('data.user.password')->json('data');
    app(InstitutionContext::class)->run($this->institution->id, function () use ($data, $type) {
        $user = User::findOrFail($data['user_id']);
        expect(Hash::check('InitialPass123!', $user->password))->toBeTrue();
        expect($user->must_change_password)->toBeTrue();
        expect($user->getRoleNames()->all())->toBe([PeopleCatalog::role($type)->value]);
        expect(PeopleCatalog::model($type)::findOrFail($data['id'])->institution_id)->toBe($this->institution->id);
        $audit = AuditLog::where('entity_type', $type)->firstOrFail();
        expect($audit->action->value)->toBe('CREATE');
        expect($audit->new_values)->not->toHaveKeys(['password', 'document_number', 'address', 'email']);
    });
})->with(array_keys(PeopleCatalog::MODELS));

it('requires person fields and a secure initial password', function (string $type) {
    $this->postJson('/api/v1/'.$type, [])->assertUnprocessable()->assertJsonValidationErrors(['account', 'user_id', 'document_type', 'document_number']);
    $payload = $this->payloads[$type];
    $payload['account']['password'] = 'weak';
    $this->postJson('/api/v1/'.$type, $payload)->assertUnprocessable()->assertJsonValidationErrors('account.password');
})->with(array_keys(PeopleCatalog::MODELS));

it('reuses a compatible account without duplicating or modifying it', function (string $type) {
    $user = peopleAccount($this->institution, PeopleCatalog::role($type)->value);
    $payload = $this->payloads[$type];
    unset($payload['account']);
    $payload['user_id'] = $user->id;
    $this->postJson('/api/v1/'.$type, $payload)->assertCreated()->assertJsonPath('data.user_id', $user->id);
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(User::count())->toBe(2));
    $payload['document_number'] = '00000009';
    if ($type !== 'guardians') {
        $payload[$type === 'students' ? 'student_code' : 'teacher_code'] = 'OTHER';
    }
    $this->postJson('/api/v1/'.$type, $payload)->assertUnprocessable()->assertJsonValidationErrors('user_id');
})->with(array_keys(PeopleCatalog::MODELS));

it('rejects duplicate document and code without leaving accounts', function (string $type) {
    $this->postJson('/api/v1/'.$type, $this->payloads[$type])->assertCreated();
    $payload = $this->payloads[$type];
    $payload['account']['email'] = 'duplicate@example.test';
    $this->postJson('/api/v1/'.$type, $payload)->assertUnprocessable()->assertJsonValidationErrors('document_number');
    if ($type !== 'guardians') {
        $payload['document_number'] = '00000008';
        $this->postJson('/api/v1/'.$type, $payload)->assertUnprocessable()->assertJsonValidationErrors($type === 'students' ? 'student_code' : 'teacher_code');
    }
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(User::where('email', 'duplicate@example.test')->exists())->toBeFalse());
})->with(array_keys(PeopleCatalog::MODELS));

it('rejects missing foreign and incompatible accounts', function (string $type) {
    $payload = $this->payloads[$type];
    unset($payload['account']);
    $this->postJson('/api/v1/'.$type, $payload + ['user_id' => 9999999])->assertUnprocessable();
    $foreign = peopleAccount(peopleTenant(), PeopleCatalog::role($type)->value);
    $this->postJson('/api/v1/'.$type, $payload + ['user_id' => $foreign->id])->assertUnprocessable();
    $this->postJson('/api/v1/'.$type, $payload + ['user_id' => $this->admin->id])->assertUnprocessable();
})->with(array_keys(PeopleCatalog::MODELS));

it('rejects malicious mass assignment', function (string $type) {
    $payload = $this->payloads[$type] + ['institution_id' => 999, 'roles' => ['ADMINISTRATOR'], 'permissions' => ['users.create']];
    $payload['account']['roles'] = ['ADMINISTRATOR'];
    $payload['account']['status'] = 'ACTIVE';
    $this->postJson('/api/v1/'.$type, $payload)->assertUnprocessable()->assertJsonValidationErrors(['institution_id', 'roles', 'permissions', 'account']);
})->with(array_keys(PeopleCatalog::MODELS));

it('reads updates and disables a person while retaining history', function (string $type) {
    $id = $this->postJson('/api/v1/'.$type, $this->payloads[$type])->assertCreated()->json('data.id');
    $this->getJson('/api/v1/'.$type.'/'.$id)->assertOk();
    $this->patchJson('/api/v1/'.$type.'/'.$id, ['document_number' => '00000008'])->assertOk()->assertJsonPath('data.document_number', '00000008');
    $this->postJson('/api/v1/'.$type.'/'.$id.'/disable')->assertOk()->assertJsonPath('data.status', 'INACTIVE');
    $this->getJson('/api/v1/'.$type.'/'.$id)->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($type, $id) {
        expect(PeopleCatalog::model($type)::findOrFail($id)->deleted_at)->toBeNull();
        expect(AuditLog::where('entity_type', $type)->where('action', 'DISABLE')->count())->toBe(1);
    });
})->with(array_keys(PeopleCatalog::MODELS));

it('isolates person lists bindings and policies by institution', function (string $type) {
    $foreign = peopleFixture(peopleTenant(), $type);
    $this->getJson('/api/v1/'.$type.'?institution_id='.$foreign->institution_id)->assertOk()->assertJsonCount(0, 'data');
    $this->getJson('/api/v1/'.$type.'/'.$foreign->id)->assertNotFound();
    $this->patchJson('/api/v1/'.$type.'/'.$foreign->id, ['status' => 'INACTIVE'])->assertNotFound();
    $this->postJson('/api/v1/'.$type.'/'.$foreign->id.'/disable')->assertNotFound();
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(Gate::forUser($this->admin)->allows('update', $foreign))->toBeFalse());
})->with(array_keys(PeopleCatalog::MODELS));

it('allows same documents and codes in different institutions', function (string $type) {
    $foreignTenant = peopleTenant();
    app(InstitutionContext::class)->run($foreignTenant->id, fn () => PeopleCatalog::model($type)::factory()->create(array_diff_key($this->payloads[$type], ['account' => true])));
    $this->postJson('/api/v1/'.$type, $this->payloads[$type])->assertCreated();
})->with(array_keys(PeopleCatalog::MODELS));

it('protects sensitive state transitions from secretary', function (string $type) {
    $person = peopleFixture($this->institution, $type);
    $secretary = peopleAccount($this->institution, 'SECRETARY');
    $this->actingAs($secretary, 'web');
    if ($type !== 'teachers') {
        $this->patchJson('/api/v1/'.$type.'/'.$person->id, ['document_number' => '00000009', 'document_type' => 'DNI'])->assertOk();
        $this->patchJson('/api/v1/'.$type.'/'.$person->id, ['status' => 'INACTIVE'])->assertForbidden();
    } else {
        $this->patchJson('/api/v1/'.$type.'/'.$person->id, ['specialty' => 'Changed'])->assertForbidden();
    }
    $this->postJson('/api/v1/'.$type.'/'.$person->id.'/disable')->assertForbidden();
})->with(array_keys(PeopleCatalog::MODELS));

it('permits secretary onboarding of students and guardians only', function (string $type) {
    $this->actingAs(peopleAccount($this->institution, 'SECRETARY'), 'web')->postJson('/api/v1/'.$type, $this->payloads[$type])->assertCreated();
})->with(['students', 'guardians']);
it('prevents teacher creation by secretary', function () {
    $this->actingAs(peopleAccount($this->institution, 'SECRETARY'), 'web')->postJson('/api/v1/teachers', $this->payloads['teachers'])->assertForbidden();
});
it('denies administrative person access to student guardian and treasury', function (string $role) {
    $this->actingAs(peopleAccount($this->institution, $role), 'web');
    foreach (array_keys(PeopleCatalog::MODELS) as $type) {
        $this->getJson('/api/v1/'.$type)->assertForbidden();
        $this->postJson('/api/v1/'.$type, $this->payloads[$type])->assertForbidden();
    }
})->with(['STUDENT', 'GUARDIAN', 'TREASURY']);
it('limits teacher student data to authorized basic information', function () {
    $student = peopleFixture($this->institution, 'students');
    $this->actingAs(peopleAccount($this->institution, 'TEACHER'), 'web')
        ->getJson('/api/v1/students/'.$student->id)->assertOk()->assertJsonMissingPath('data.birth_date')->assertJsonMissingPath('data.address')
        ->assertJsonPath('data.user.email', null);
    $this->postJson('/api/v1/students', $this->payloads['students'])->assertForbidden();
});
it('requires authentication for people', function () {
    Auth::guard('web')->logout();
    Auth::forgetGuards();
    $this->flushSession();
    foreach (['students', 'teachers', 'guardians', 'profile/people', 'profile/family'] as $path) {
        $this->getJson('/api/v1/'.$path)->assertUnauthorized();
    }
});
it('validates dates document format and state', function (string $type, array $changes) {
    $this->postJson('/api/v1/'.$type, array_merge($this->payloads[$type], $changes))->assertUnprocessable();
})->with([
    ['students', ['birth_date' => '2099-01-01']], ['students', ['birth_date' => '2020-02-30']], ['students', ['admission_date' => '2000-01-01']],
    ['teachers', ['hire_date' => 'not-a-date']], ['students', ['gender' => 'INVALID']], ['students', ['status' => 'BLOCKED']],
    ['teachers', ['status' => 'GRADUATED']], ['guardians', ['status' => 'ON_LEAVE']], ['students', ['document_number' => '123']],
    ['guardians', ['document_type' => 'INVALID']], ['teachers', ['document_number' => 'unsafe<script>']],
]);
it('accepts supported lifecycle states', function (string $type, string $status) {
    $person = peopleFixture($this->institution, $type);
    $this->patchJson('/api/v1/'.$type.'/'.$person->id, ['status' => $status])->assertOk()->assertJsonPath('data.status', $status);
})->with([['students', 'GRADUATED'], ['students', 'WITHDRAWN'], ['teachers', 'ON_LEAVE']]);
it('preserves profile roles and immutable account binding', function () {
    $student = peopleFixture($this->institution, 'students');
    $this->patchJson('/api/v1/students/'.$student->id, ['user_id' => $this->admin->id])->assertUnprocessable();
    $this->patchJson('/api/v1/users/'.$student->user_id, ['roles' => ['TEACHER']])->assertUnprocessable()->assertJsonValidationErrors('roles');
});
it('finds compatible accounts but not foreign or privileged accounts', function () {
    $user = peopleAccount($this->institution, 'STUDENT');
    $this->getJson('/api/v1/students/accounts?search='.urlencode($user->email))->assertOk()->assertJsonPath('data.0.id', $user->id);
    $this->getJson('/api/v1/students/accounts?search='.urlencode($this->admin->email))->assertOk()->assertJsonCount(0, 'data');
    $foreign = peopleAccount(peopleTenant(), 'STUDENT');
    $this->getJson('/api/v1/students/accounts?search='.urlencode($foreign->email))->assertOk()->assertJsonCount(0, 'data');
});
it('rejects account duplication and simultaneous create plus reuse', function () {
    $payload = $this->payloads['students'];
    $payload['account']['email'] = $this->admin->email;
    $this->postJson('/api/v1/students', $payload)->assertUnprocessable()->assertJsonValidationErrors('account.email');
    $this->postJson('/api/v1/students', $this->payloads['students'] + ['user_id' => $this->admin->id])->assertUnprocessable();
});
it('rolls back account profile and assigned role when auditing fails', function (string $type) {
    $before = DB::table('model_has_roles')->count();
    AuditLog::creating(fn () => throw new RuntimeException('Audit unavailable'));
    try {
        $this->withoutExceptionHandling();
        try {
            $this->postJson('/api/v1/'.$type, $this->payloads[$type]);
            $this->fail('Expected failure');
        } catch (RuntimeException $error) {
            expect($error->getMessage())->toBe('Audit unavailable');
        }
        app(InstitutionContext::class)->run($this->institution->id, function () use ($type) {
            expect(User::where('email', $this->account['email'])->exists())->toBeFalse();
            expect(PeopleCatalog::model($type)::count())->toBe(0);
        });
        expect(DB::table('model_has_roles')->count())->toBe($before);
    } finally {
        AuditLog::flushEventListeners();
        AuditLog::clearBootedModels();
    }
})->with(array_keys(PeopleCatalog::MODELS));
it('retains uniqueness after soft deletion', function (string $type) {
    $person = peopleFixture($this->institution, $type);
    app(InstitutionContext::class)->run($this->institution->id, fn () => $person->delete());
    $this->getJson('/api/v1/'.$type.'/'.$person->id)->assertNotFound();
    $payload = $this->payloads[$type];
    $payload['document_type'] = $person->document_type->value;
    $payload['document_number'] = $person->document_number;
    $this->postJson('/api/v1/'.$type, $payload)->assertUnprocessable();
})->with(array_keys(PeopleCatalog::MODELS));
it('searches filters and paginates people', function () {
    $this->postJson('/api/v1/students', $this->payloads['students'])->assertCreated();
    peopleFixture($this->institution, 'students');
    $this->getJson('/api/v1/students?search=Persona%20Ficticia&status=ACTIVE&student_code=TEST-STU&document_number=00000001')->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/api/v1/students?per_page=1&page=2')->assertOk()->assertJsonPath('meta.total', 2)->assertJsonPath('meta.current_page', 2);
    $this->getJson('/api/v1/students?status=UNKNOWN&per_page=999')->assertUnprocessable();
});
it('associates family members and audits flags', function () {
    $student = peopleFixture($this->institution, 'students');
    $guardian = peopleFixture($this->institution, 'guardians');
    $this->postJson('/api/v1/students/'.$student->id.'/guardians', ['guardian_id' => $guardian->id, 'relationship' => 'MOTHER', 'is_primary' => true, 'can_pick_up' => true, 'receives_notifications' => true])
        ->assertCreated()->assertJsonPath('data.is_primary', true)->assertJsonPath('data.can_pick_up', true);
    $this->getJson('/api/v1/students/'.$student->id.'/guardians')->assertOk()->assertJsonCount(1, 'data')->assertJsonMissingPath('data.0.guardian.document_number');
    $this->getJson('/api/v1/guardians/'.$guardian->id.'/students')->assertOk()->assertJsonCount(1, 'data');
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(AuditLog::where('action', 'RELATE')->count())->toBe(1));
});
it('rejects duplicate family relationships and invalid fields', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $path = '/api/v1/students/'.$s->id.'/guardians';
    $payload = ['guardian_id' => $g->id, 'relationship' => 'FATHER'];
    $this->postJson($path, $payload)->assertCreated();
    $this->postJson($path, $payload)->assertUnprocessable();
    $this->patchJson($path.'/'.$g->id, ['relationship' => 'INVALID', 'is_primary' => 'yes', 'student_id' => 999])->assertUnprocessable();
    $this->postJson($path, [])->assertUnprocessable();
});
it('switches the single primary transactionally and supports many to many families', function () {
    $s = peopleFixture($this->institution, 'students');
    $s2 = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $g2 = peopleFixture($this->institution, 'guardians');
    $path = '/api/v1/students/'.$s->id.'/guardians';
    $this->postJson($path, ['guardian_id' => $g->id, 'relationship' => 'GUARDIAN', 'is_primary' => true])->assertCreated();
    $this->postJson($path, ['guardian_id' => $g2->id, 'relationship' => 'GRANDPARENT'])->assertCreated();
    $this->patchJson($path.'/'.$g2->id, ['is_primary' => true])->assertOk();
    $this->postJson('/api/v1/students/'.$s2->id.'/guardians', ['guardian_id' => $g->id, 'relationship' => 'OTHER', 'is_primary' => true])->assertCreated();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($s, $g, $g2) {
        expect($s->guardians()->count())->toBe(2);
        expect($g->students()->count())->toBe(2);
        expect($s->familyLinks()->where('is_primary', true)->sole()->guardian_id)->toBe($g2->id);
    });
});
it('enforces single primary and same institution with database constraints', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $g2 = peopleFixture($this->institution, 'guardians');
    app(InstitutionContext::class)->run($this->institution->id, function () use ($s, $g, $g2) {
        StudentGuardian::create(['student_id' => $s->id, 'guardian_id' => $g->id, 'relationship' => 'FATHER', 'is_primary' => true]);
        expect(fn () => StudentGuardian::create(['student_id' => $s->id, 'guardian_id' => $g2->id, 'relationship' => 'MOTHER', 'is_primary' => true]))->toThrow(QueryException::class);
    });
    $foreign = peopleFixture(peopleTenant(), 'guardians');
    expect(fn () => DB::table('student_guardian')->insert(['institution_id' => $this->institution->id, 'student_id' => $s->id, 'guardian_id' => $foreign->id, 'relationship' => 'OTHER']))
        ->toThrow(QueryException::class);
});
it('rejects cross tenant family IDs and bindings', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $other = peopleTenant();
    $fs = peopleFixture($other, 'students');
    $fg = peopleFixture($other, 'guardians');
    $this->postJson('/api/v1/students/'.$s->id.'/guardians', ['guardian_id' => $fg->id, 'relationship' => 'FATHER'])->assertUnprocessable();
    $this->postJson('/api/v1/students/'.$fs->id.'/guardians', ['guardian_id' => $g->id, 'relationship' => 'FATHER'])->assertNotFound();
    $this->getJson('/api/v1/students/'.$fs->id.'/guardians')->assertNotFound();
    $this->patchJson('/api/v1/students/'.$s->id.'/guardians/'.$fg->id, ['is_primary' => true])->assertNotFound();
    $this->deleteJson('/api/v1/students/'.$s->id.'/guardians/'.$fg->id)->assertNotFound();
    $this->getJson('/api/v1/guardians/'.$fg->id.'/students')->assertNotFound();
});
it('detaches only the relation preserving both people and audit history', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $path = '/api/v1/students/'.$s->id.'/guardians';
    $this->postJson($path, ['guardian_id' => $g->id, 'relationship' => 'GUARDIAN', 'is_primary' => true])->assertCreated();
    $this->deleteJson($path.'/'.$g->id)->assertNoContent();
    $this->getJson('/api/v1/guardians/'.$g->id)->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, function () {
        expect(StudentGuardian::count())->toBe(0);
        expect(Guardian::count())->toBe(1);
        expect(Student::count())->toBe(1);
        expect(AuditLog::where('action', 'UNRELATE')->count())->toBe(1);
    });
});
it('requires family management permission', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $path = '/api/v1/students/'.$s->id.'/guardians';
    $this->postJson($path, ['guardian_id' => $g->id, 'relationship' => 'OTHER'])->assertCreated();
    Auth::forgetGuards();
    $this->flushSession();
    $this->actingAs(peopleAccount($this->institution, 'TEACHER'), 'web');
    $this->getJson($path)->assertForbidden();
    $this->postJson($path, ['guardian_id' => $g->id, 'relationship' => 'FATHER'])->assertForbidden();
    $this->patchJson($path.'/'.$g->id, ['is_primary' => true])->assertForbidden();
    $this->deleteJson($path.'/'.$g->id)->assertForbidden();
});
it('restricts profiles and family queries to the authenticated account', function (string $type) {
    $self = peopleFixture($this->institution, $type);
    $other = peopleFixture($this->institution, $type);
    $user = app(InstitutionContext::class)->run($this->institution->id, fn () => User::findOrFail($self->user_id));
    $this->actingAs($user, 'web')->getJson('/api/v1/profile/people?user_id='.$other->user_id)->assertOk()->assertJsonPath('data.'.$type.'.id', $self->id);
    if ($type !== 'teachers') {
        $this->getJson('/api/v1/'.$type.'/'.$other->id)->assertForbidden();
    }
})->with(array_keys(PeopleCatalog::MODELS));
it('guardian sees only linked students without private identity fields', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $other = peopleFixture($this->institution, 'students');
    $this->postJson('/api/v1/students/'.$s->id.'/guardians', ['guardian_id' => $g->id, 'relationship' => 'GUARDIAN'])->assertCreated();
    Auth::forgetGuards();
    $this->flushSession();
    $user = app(InstitutionContext::class)->run($this->institution->id, fn () => User::findOrFail($g->user_id));
    $this->actingAs($user, 'web')->getJson('/api/v1/profile/family?student_id='.$other->id)->assertOk()->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.student.id', $s->id)->assertJsonMissingPath('data.0.student.document_number');
});
it('reproduces fictitious people without duplicating accounts or relationships', function () {
    $this->institution->update(['code' => 'ZARATE']);
    $this->seed(PeopleDemoSeeder::class);
    $counts = app(InstitutionContext::class)->run($this->institution->id, fn () => [Student::count(), Teacher::count(), Guardian::count(), StudentGuardian::count(), User::count()]);
    $this->seed(PeopleDemoSeeder::class);
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect([Student::count(), Teacher::count(), Guardian::count(), StudentGuardian::count(), User::count()])->toBe($counts));
});

it('refuses onboarding a role with permissions the operator cannot delegate', function () {
    $secretary = peopleAccount($this->institution, 'SECRETARY');
    app(InstitutionContext::class)->run($this->institution->id, fn () => Role::where('name', 'STUDENT')->firstOrFail()->givePermissionTo('roles.manage'));
    $this->actingAs($secretary, 'web')->postJson('/api/v1/students', $this->payloads['students'])->assertForbidden();
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(User::where('email', $this->account['email'])->exists())->toBeFalse());
});
it('does not reuse a blocked account', function () {
    $user = peopleAccount($this->institution, 'STUDENT');
    app(InstitutionContext::class)->run($this->institution->id, fn () => $user->update(['status' => UserStatus::BLOCKED]));
    $payload = $this->payloads['students'];
    unset($payload['account']);
    $payload['user_id'] = $user->id;
    $this->postJson('/api/v1/students', $payload)->assertUnprocessable()->assertJsonValidationErrors('user_id');
});
it('reuses a teacher guardian account without changing its roles', function () {
    $teacher = peopleFixture($this->institution, 'teachers');
    $user = app(InstitutionContext::class)->run($this->institution->id, function () use ($teacher) {
        $user = User::findOrFail($teacher->user_id);
        $user->assignRole('GUARDIAN');

        return $user;
    });
    $payload = $this->payloads['guardians'];
    unset($payload['account']);
    $payload['user_id'] = $user->id;
    $this->postJson('/api/v1/guardians', $payload)->assertCreated()->assertJsonPath('data.user_id', $user->id);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($user) {
        expect($user->fresh()->hasAllRoles(['TEACHER', 'GUARDIAN']))->toBeTrue();
        expect(User::count())->toBe(2);
    });
});
it('rolls back primary switch when relation audit fails', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $g2 = peopleFixture($this->institution, 'guardians');
    $path = '/api/v1/students/'.$s->id.'/guardians';
    $this->postJson($path, ['guardian_id' => $g->id, 'relationship' => 'GUARDIAN', 'is_primary' => true])->assertCreated();
    $this->postJson($path, ['guardian_id' => $g2->id, 'relationship' => 'OTHER'])->assertCreated();
    AuditLog::creating(fn () => throw new RuntimeException('Audit unavailable'));
    try {
        $this->withoutExceptionHandling();
        try {
            $this->patchJson($path.'/'.$g2->id, ['is_primary' => true]);
            $this->fail('Expected audit failure');
        } catch (RuntimeException $error) {
            expect($error->getMessage())->toBe('Audit unavailable');
        }
        app(InstitutionContext::class)->run($this->institution->id, fn () => expect($s->familyLinks()->where('is_primary', true)->sole()->guardian_id)->toBe($g->id));
    } finally {
        AuditLog::flushEventListeners();
        AuditLog::clearBootedModels();
    }
});
it('denies association to inactive guardians without losing existing links', function () {
    $s = peopleFixture($this->institution, 'students');
    $g = peopleFixture($this->institution, 'guardians');
    $this->postJson('/api/v1/guardians/'.$g->id.'/disable')->assertOk();
    $this->postJson('/api/v1/students/'.$s->id.'/guardians', ['guardian_id' => $g->id, 'relationship' => 'GUARDIAN'])->assertUnprocessable();
});
