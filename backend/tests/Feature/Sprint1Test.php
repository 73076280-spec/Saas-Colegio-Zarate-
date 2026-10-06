<?php

use App\Enums\InstitutionStatus;
use App\Enums\UserStatus;
use App\Models\AuditLog;
use App\Models\Institution;
use App\Models\Role;
use App\Models\User;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;

uses(DatabaseTransactions::class);

function sprintInstitution(): Institution
{
    $institution = Institution::factory()->create();
    app(InstitutionContext::class)->run($institution->id, fn () => (new RolePermissionSeeder)->run());

    return $institution;
}
function sprintUser(Institution $institution, string $role = 'ADMINISTRATOR', array $attributes = []): User
{
    return app(InstitutionContext::class)->run($institution->id, function () use ($attributes, $role) {
        $user = User::factory()->create($attributes);
        $user->assignRole($role);

        return $user;
    });
}
beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    app(InstitutionContext::class)->set(null);
    $this->institution = sprintInstitution();
    $this->admin = sprintUser($this->institution);
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json']);
});
afterEach(fn () => app(InstitutionContext::class)->set(null));

it('logs in with institution and audits without exposing secrets', function () {
    $this->postJson('/api/v1/auth/login', [
        'institution_code' => $this->institution->code, 'email' => $this->admin->email, 'password' => 'TestingPass123!',
    ])->assertOk()->assertJsonPath('data.institution_id', $this->institution->id)
        ->assertJsonPath('data.roles.0', 'ADMINISTRATOR')->assertJsonMissingPath('data.password');
    app(InstitutionContext::class)->run($this->institution->id, function () {
        expect($this->admin->fresh()->last_login_at)->not->toBeNull();
        expect(AuditLog::where('action', 'LOGIN')->count())->toBe(1);
        expect(AuditLog::first()->new_values)->toBeNull();
    });
});
it('rejects incorrect credentials', function (string $kind) {
    $data = ['institution_code' => $this->institution->code, 'email' => $this->admin->email, 'password' => 'TestingPass123!'];
    $data[$kind] = $kind === 'email' ? 'missing@example.test' : 'incorrect';
    $this->postJson('/api/v1/auth/login', $data)->assertUnprocessable()->assertJsonPath('message', 'Credenciales incorrectas o cuenta no disponible.');
})->with(['password', 'email', 'institution_code']);
it('validates login input', function () {
    $this->postJson('/api/v1/auth/login', ['email' => 'invalid', 'institution_id' => 999])->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'institution_code', 'password', 'institution_id']);
});
it('denies inactive and blocked accounts', function (string $status) {
    $user = sprintUser($this->institution, 'STUDENT', ['status' => $status]);
    $this->postJson('/api/v1/auth/login', ['institution_code' => $this->institution->code, 'email' => $user->email, 'password' => 'TestingPass123!'])->assertUnprocessable();
})->with(['INACTIVE', 'BLOCKED']);
it('denies inactive institutions', function () {
    $this->institution->update(['status' => 'INACTIVE']);
    $this->postJson('/api/v1/auth/login', ['institution_code' => $this->institution->code, 'email' => $this->admin->email, 'password' => 'TestingPass123!'])->assertUnprocessable();
});
it('denies deleted users', function () {
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->admin->delete());
    $this->postJson('/api/v1/auth/login', ['institution_code' => $this->institution->code, 'email' => $this->admin->email, 'password' => 'TestingPass123!'])->assertUnprocessable();
});
it('requires authentication', function (string $path) {
    $this->getJson('/api/v1/'.$path)->assertUnauthorized();
})->with(['auth/me', 'users', 'institutions', 'roles', 'permissions', 'profile', 'audit-logs']);
it('returns authenticated identity and institution', function () {
    $this->actingAs($this->admin)->getJson('/api/v1/auth/me')->assertOk()
        ->assertJsonPath('data.name', $this->admin->name)->assertJsonPath('data.institution.code', $this->institution->code);
    expect(app(InstitutionContext::class)->id())->toBeNull();
});
it('logs out and audits the session', function () {
    $this->actingAs($this->admin)->postJson('/api/v1/auth/logout')->assertNoContent();
    $this->assertGuest('web');
    Auth::forgetGuards();
    $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(AuditLog::where('action', 'LOGOUT')->count())->toBe(1));
});
it('revokes access when an account becomes blocked', function () {
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->admin->update(['status' => UserStatus::BLOCKED]));
    $this->actingAs($this->admin)->getJson('/api/v1/auth/me')->assertUnauthorized();
});
it('requires password change before business routes', function () {
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->admin->update(['must_change_password' => true]));
    $this->actingAs($this->admin)->getJson('/api/v1/users')->assertForbidden()->assertJsonPath('code', 'PASSWORD_CHANGE_REQUIRED');
});
it('changes password securely and clears the initial password flag', function () {
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->admin->update(['must_change_password' => true]));
    $this->actingAs($this->admin)->postJson('/api/v1/auth/change-password', [
        'current_password' => 'TestingPass123!', 'password' => 'ChangedPass456!', 'password_confirmation' => 'ChangedPass456!',
    ])->assertOk()->assertJsonPath('data.must_change_password', false);
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(Hash::check('ChangedPass456!', $this->admin->fresh()->password))->toBeTrue());
});
it('rejects invalid password changes', function (array $data) {
    $this->actingAs($this->admin)->postJson('/api/v1/auth/change-password', $data)->assertUnprocessable();
})->with([
    [['current_password' => 'wrong', 'password' => 'ChangedPass456!', 'password_confirmation' => 'ChangedPass456!']],
    [['current_password' => 'TestingPass123!', 'password' => 'short', 'password_confirmation' => 'short']],
    [['current_password' => 'TestingPass123!', 'password' => 'ChangedPass456!', 'password_confirmation' => 'different']],
    [['current_password' => 'TestingPass123!', 'password' => 'TestingPass123!', 'password_confirmation' => 'TestingPass123!']],
]);
it('isolates user lists and ignores forged institution headers', function () {
    $other = sprintInstitution();
    $foreign = sprintUser($other);
    $this->actingAs($this->admin)->withHeader('X-Institution-Id', (string) $other->id)->getJson('/api/v1/users?institution_id='.$other->id)
        ->assertOk()->assertJsonCount(1, 'data')->assertJsonMissing(['email' => $foreign->email]);
});
it('hides foreign user bindings', function (string $method) {
    $other = sprintUser(sprintInstitution());
    $this->actingAs($this->admin)->{$method}('/api/v1/users/'.$other->id, [])->assertNotFound();
})->with(['getJson', 'patchJson']);
it('denies disabling another institution user', function () {
    $other = sprintUser(sprintInstitution());
    $this->actingAs($this->admin)->postJson('/api/v1/users/'.$other->id.'/disable')->assertNotFound();
});
it('creates users only within the current institution with hashed passwords', function () {
    $this->actingAs($this->admin)->postJson('/api/v1/users', [
        'first_name' => 'Ana', 'last_name' => 'Pérez', 'email' => 'ana@example.test', 'password' => 'InitialPass123!', 'roles' => ['TEACHER'],
    ])->assertCreated()->assertJsonPath('data.institution_id', $this->institution->id)->assertJsonPath('data.must_change_password', true)
        ->assertJsonPath('data.roles.0', 'TEACHER')->assertJsonMissingPath('data.password');
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(Hash::check('InitialPass123!', User::where('email', 'ana@example.test')->firstOrFail()->password))->toBeTrue());
});
it('rejects tenant injection and invalid user fields', function () {
    $this->actingAs($this->admin)->postJson('/api/v1/users', [
        'first_name' => 'Ana', 'last_name' => 'Pérez', 'email' => 'bad', 'password' => 'weak', 'institution_id' => 999, 'roles' => ['ROOT'],
    ])->assertUnprocessable()->assertJsonValidationErrors(['email', 'password', 'institution_id', 'roles.0']);
});
it('requires valid names on user creation', function () {
    $this->actingAs($this->admin)->postJson('/api/v1/users', [])->assertUnprocessable()->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'password']);
});
it('rejects duplicate email in an institution', function () {
    $this->actingAs($this->admin)->postJson('/api/v1/users', [
        'first_name' => 'Ana', 'last_name' => 'Pérez', 'email' => $this->admin->email, 'password' => 'InitialPass123!',
    ])->assertUnprocessable()->assertJsonValidationErrors('email');
});
it('allows the same email in different institutions', function () {
    $other = sprintInstitution();
    $user = sprintUser($other, 'STUDENT', ['email' => $this->admin->email]);
    $this->postJson('/api/v1/auth/login', ['institution_code' => $other->code, 'email' => $user->email, 'password' => 'TestingPass123!'])
        ->assertOk()->assertJsonPath('data.id', $user->id);
});
it('updates and disables an institutional user', function () {
    $user = sprintUser($this->institution, 'TEACHER');
    $this->actingAs($this->admin)->patchJson('/api/v1/users/'.$user->id, ['first_name' => 'Actualizado'])->assertOk()->assertJsonPath('data.first_name', 'Actualizado');
    $this->postJson('/api/v1/users/'.$user->id.'/disable')->assertOk()->assertJsonPath('data.status', 'INACTIVE');
});
it('protects the last administrator', function () {
    $this->actingAs($this->admin)->patchJson('/api/v1/users/'.$this->admin->id, ['roles' => ['STUDENT']])->assertUnprocessable();
});
it('prevents self deactivation', function () {
    sprintUser($this->institution);
    $this->actingAs($this->admin)->postJson('/api/v1/users/'.$this->admin->id.'/disable')->assertUnprocessable();
});
it('denies non administrators protected resources', function (string $role) {
    $user = sprintUser($this->institution, $role);
    $this->actingAs($user)->getJson('/api/v1/users')->assertForbidden();
    $this->getJson('/api/v1/roles')->assertForbidden();
    $this->getJson('/api/v1/audit-logs')->assertForbidden();
    $this->postJson('/api/v1/users', [])->assertForbidden();
    $this->getJson('/api/v1/profile')->assertOk();
})->with(['SECRETARY', 'TREASURY', 'TEACHER', 'STUDENT', 'GUARDIAN']);
it('denies privilege escalation by users managers', function () {
    $user = sprintUser($this->institution, 'SECRETARY');
    app(InstitutionContext::class)->run($this->institution->id, fn () => $user->givePermissionTo('users.create'));
    $this->actingAs($user)->postJson('/api/v1/users', [
        'first_name' => 'Ana', 'last_name' => 'Pérez', 'email' => 'ana@example.test', 'password' => 'InitialPass123!', 'roles' => ['ADMINISTRATOR'],
    ])->assertForbidden();
});
it('limits institutional access and validates updates', function () {
    $other = sprintInstitution();
    $this->actingAs($this->admin)->getJson('/api/v1/institutions')->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/api/v1/institutions/'.$other->id)->assertForbidden();
    $this->patchJson('/api/v1/institutions/'.$this->institution->id, ['name' => 'Colegio actualizado'])->assertOk()->assertJsonPath('data.name', 'Colegio actualizado');
    $this->patchJson('/api/v1/institutions/'.$this->institution->id, ['status' => 'INACTIVE'])->assertUnprocessable();
});
it('limits role catalogs to current institution', function () {
    $other = sprintInstitution();
    $foreign = app(InstitutionContext::class)->run($other->id, fn () => Role::where('name', 'TEACHER')->firstOrFail());
    $this->actingAs($this->admin)->getJson('/api/v1/roles')->assertOk()->assertJsonCount(6, 'data');
    $this->getJson('/api/v1/permissions')->assertOk()->assertJsonCount(116, 'data');
    $this->putJson('/api/v1/roles/'.$foreign->id.'/permissions', ['permissions' => []])->assertNotFound();
});
it('updates role permissions and protects administrator role', function () {
    [$teacher,$admin] = app(InstitutionContext::class)->run($this->institution->id, fn () => [Role::where('name', 'TEACHER')->firstOrFail(), Role::where('name', 'ADMINISTRATOR')->firstOrFail()]);
    $this->actingAs($this->admin)->putJson('/api/v1/roles/'.$teacher->id.'/permissions', ['permissions' => ['profile.view', 'profile.update', 'users.view']])->assertOk();
    $this->putJson('/api/v1/roles/'.$teacher->id.'/permissions', ['permissions' => ['unknown']])->assertUnprocessable();
    $this->putJson('/api/v1/roles/'.$admin->id.'/permissions', ['permissions' => []])->assertUnprocessable();
});
it('updates only permitted profile fields', function () {
    $user = sprintUser($this->institution, 'STUDENT');
    $this->actingAs($user)->patchJson('/api/v1/profile', ['first_name' => 'Nombre', 'phone' => '999111222'])->assertOk()->assertJsonPath('data.first_name', 'Nombre');
    $this->patchJson('/api/v1/profile', ['roles' => ['ADMINISTRATOR'], 'institution_id' => 999, 'status' => 'ACTIVE'])->assertUnprocessable();
});
it('isolates audit records', function () {
    $other = sprintInstitution();
    $foreign = sprintUser($other);
    app(InstitutionContext::class)->run($other->id, fn () => AuditLog::create(['user_id' => $foreign->id, 'action' => 'LOGIN', 'entity_type' => 'user', 'entity_id' => $foreign->id, 'created_at' => now()]));
    $this->actingAs($this->admin)->getJson('/api/v1/audit-logs')->assertOk()->assertJsonCount(0, 'data');
});
it('fails closed without an institution context', function () {
    expect(User::count())->toBe(0);
    expect(Role::count())->toBe(0);
    expect(fn () => User::factory()->create())->toThrow(LogicException::class);
});
it('prevents reassigning a user to another institution', function () {
    $other = sprintInstitution();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($other) {
        expect(fn () => $this->admin->forceFill(['institution_id' => $other->id])->save())->toThrow(LogicException::class);
    });
});
it('enforces login rate limiting', function () {
    $data = ['institution_code' => $this->institution->code, 'email' => 'throttle@example.test', 'password' => 'incorrect'];
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/v1/auth/login', $data)->assertUnprocessable();
    }
    $this->postJson('/api/v1/auth/login', $data)->assertTooManyRequests();
});

it('persists institution fields, enum and user relationship', function () {
    expect($this->institution->status)->toBe(InstitutionStatus::ACTIVE);
    expect($this->institution->legal_name)->toBeNull();
    app(InstitutionContext::class)->run($this->institution->id, function () {
        expect($this->institution->users()->first()->id)->toBe($this->admin->id);
        expect($this->admin->institution->id)->toBe($this->institution->id);
        expect($this->admin->status)->toBe(UserStatus::ACTIVE);
    });
});
it('enforces unique institution codes in MySQL', function () {
    expect(fn () => Institution::factory()->create(['code' => $this->institution->code]))
        ->toThrow(QueryException::class);
});
it('enforces tenant email uniqueness in MySQL', function () {
    expect(fn () => sprintUser($this->institution, 'STUDENT', ['email' => $this->admin->email]))
        ->toThrow(QueryException::class);
});
it('soft deletes institutions and denies their accounts', function () {
    $this->institution->delete();
    expect(Institution::find($this->institution->id))->toBeNull();
    expect(Institution::withTrashed()->find($this->institution->id))->not->toBeNull();
    $this->actingAs($this->admin)->getJson('/api/v1/auth/me')->assertUnauthorized();
});
it('rejects obsolete password session hashes', function () {
    $this->actingAs($this->admin)->withSession(['auth_password_hash' => Hash::make('OldPassword123!')])
        ->getJson('/api/v1/auth/me')->assertUnauthorized();
});
it('keeps permission caches isolated between two authenticated institutions', function () {
    $other = sprintInstitution();
    $teacherA = sprintUser($this->institution, 'TEACHER');
    $teacherB = sprintUser($other, 'TEACHER');
    app(InstitutionContext::class)->run($this->institution->id, fn () => Role::where('name', 'TEACHER')->firstOrFail()->givePermissionTo('users.view'));
    $this->actingAs($teacherA, 'web')->getJson('/api/v1/users')->assertOk();
    Auth::forgetGuards();
    $this->flushSession();
    $this->actingAs($teacherB, 'web')->getJson('/api/v1/users')->assertForbidden();
    Auth::forgetGuards();
    $this->flushSession();
    $this->actingAs($teacherA, 'web')->getJson('/api/v1/users')->assertOk();
});
it('rejects delegated permissions the actor does not possess', function () {
    $manager = sprintUser($this->institution, 'SECRETARY');
    $role = app(InstitutionContext::class)->run($this->institution->id, function () use ($manager) {
        $manager->givePermissionTo('roles.manage');

        return Role::where('name', 'TEACHER')->firstOrFail();
    });
    $this->actingAs($manager)->putJson('/api/v1/roles/'.$role->id.'/permissions', ['permissions' => ['users.disable']])->assertForbidden();
});
it('rejects institutional writes from an unprivileged user', function () {
    $teacher = sprintUser($this->institution, 'TEACHER');
    $this->actingAs($teacher)->patchJson('/api/v1/institutions/'.$this->institution->id, ['name' => 'Changed'])->assertForbidden();
    $this->postJson('/api/v1/users/'.$this->admin->id.'/disable')->assertForbidden();
});
it('requires users.disable to change account status', function () {
    $manager = sprintUser($this->institution, 'SECRETARY');
    $target = sprintUser($this->institution, 'TEACHER');
    app(InstitutionContext::class)->run($this->institution->id, fn () => $manager->givePermissionTo('users.update'));
    $this->actingAs($manager)->patchJson('/api/v1/users/'.$target->id, ['status' => 'BLOCKED'])->assertForbidden();
});
it('rolls back new users when role delegation is forbidden', function () {
    $manager = sprintUser($this->institution, 'SECRETARY');
    app(InstitutionContext::class)->run($this->institution->id, fn () => $manager->givePermissionTo(['users.create', 'roles.manage']));
    $this->actingAs($manager)->postJson('/api/v1/users', ['first_name' => 'Test', 'last_name' => 'Test', 'email' => 'rollback@example.test', 'password' => 'InitialPass123!', 'roles' => ['ADMINISTRATOR']])->assertForbidden();
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(User::where('email', 'rollback@example.test')->exists())->toBeFalse());
});
it('does not allow anonymous password changes or logout', function () {
    $this->postJson('/api/v1/auth/change-password', [])->assertUnauthorized();
    $this->postJson('/api/v1/auth/logout')->assertUnauthorized();
});
