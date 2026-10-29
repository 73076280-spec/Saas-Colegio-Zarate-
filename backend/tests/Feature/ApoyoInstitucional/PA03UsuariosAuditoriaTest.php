
<?php

use App\Models\AuditLog;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\Role;
use App\Models\User;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

uses(DatabaseTransactions::class);

beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');

    app(PermissionRegistrar::class)->forgetCachedPermissions();
    app(InstitutionContext::class)->set(null);

    $this->institution = Institution::factory()->create();

    $this->admin = app(InstitutionContext::class)->run(
        $this->institution->id,
        function () {
            (new RolePermissionSeeder)->run();

            $admin = User::factory()->create();
            $admin->assignRole('ADMINISTRATOR');

            return $admin;
        }
    );

    $this->withHeaders([
        'Origin' => 'http://localhost:5173',
        'Accept' => 'application/json',
    ])->actingAs($this->admin, 'web');
});

afterEach(fn () => app(InstitutionContext::class)->set(null));

it('PA03-01 preserves the role required by a student profile', function () {
    $studentUser = app(InstitutionContext::class)->run(
        $this->institution->id,
        function () {
            $enrollment = Enrollment::factory()->create();

            return $enrollment->student->user;
        }
    );

    $originalRoles = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => $studentUser->getRoleNames()->sort()->values()->all()
    );

    expect($originalRoles)->toContain('STUDENT');

    $this->patchJson(
        '/api/v1/users/'.$studentUser->id,
        ['roles' => ['GUARDIAN']]
    )->assertUnprocessable()
     ->assertJsonValidationErrors('roles');

    $currentRoles = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => $studentUser->fresh()
            ->getRoleNames()
            ->sort()
            ->values()
            ->all()
    );

    expect($currentRoles)->toBe($originalRoles);
});

it('PA03-02 preserves role permissions after a rejected update', function () {
    $role = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => Role::where('name', 'TEACHER')->firstOrFail()
    );

    $originalPermissions = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => $role->permissions
            ->pluck('name')
            ->sort()
            ->values()
            ->all()
    );

    $this->putJson(
        '/api/v1/roles/'.$role->id.'/permissions',
        ['permissions' => ['profile.view', 'PERMISO_INEXISTENTE_PA03']]
    )->assertUnprocessable()
     ->assertJsonValidationErrors('permissions.1');

    $currentPermissions = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => $role->fresh()
            ->permissions
            ->pluck('name')
            ->sort()
            ->values()
            ->all()
    );

    expect($currentPermissions)->toBe($originalPermissions);
});

it('PA03-03 orders and paginates institutional audit records', function () {
    $createdIds = app(InstitutionContext::class)->run(
        $this->institution->id,
        function () {
            $ids = [];

            for ($i = 1; $i <= 25; $i++) {
                $log = AuditLog::create([
                    'user_id' => $this->admin->id,
                    'action' => 'LOGIN',
                    'entity_type' => 'user',
                    'entity_id' => $this->admin->id,
                    'created_at' => now()->subMinutes(30)->addSeconds($i),
                ]);

                $ids[] = $log->id;
            }

            return $ids;
        }
    );

    $firstPage = $this->getJson('/api/v1/audit-logs')
        ->assertOk()
        ->assertJsonCount(20, 'data')
        ->assertJsonPath('current_page', 1);

    $firstPageIds = collect($firstPage->json('data'))
        ->pluck('id')
        ->all();

    $expectedIds = array_reverse($createdIds);

    expect($firstPageIds)->toBe(
        array_slice($expectedIds, 0, 20)
    );

    $secondPage = $this->getJson('/api/v1/audit-logs?page=2')
        ->assertOk()
        ->assertJsonPath('current_page', 2);

    $secondPageIds = collect($secondPage->json('data'))
        ->pluck('id')
        ->all();

    expect(array_slice($secondPageIds, 0, 5))->toBe(
        array_slice($expectedIds, 20, 5)
    );
});
