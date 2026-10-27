
<?php

use App\Enums\InstitutionStatus;
use App\Models\AuditLog;
use App\Models\Institution;
use App\Models\User;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

uses(DatabaseTransactions::class);

beforeEach(function () {
    // Evitar ejecutar pruebas sobre la base de desarrollo.
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');

    app(PermissionRegistrar::class)->forgetCachedPermissions();
    app(InstitutionContext::class)->set(null);

    $this->institution = Institution::factory()->create();

    app(InstitutionContext::class)->run(
        $this->institution->id,
        function () {
            (new RolePermissionSeeder)->run();

            $this->admin = User::factory()->create();
            $this->admin->assignRole('ADMINISTRATOR');
        }
    );

    $this->withHeaders([
        'Origin' => 'http://localhost:5173',
        'Accept' => 'application/json',
    ]);
});

afterEach(function () {
    app(InstitutionContext::class)->set(null);
});

// PA-01: Login incorrecto sin registrar acceso exitoso.
it('PA-01 no registra auditoria de login exitoso cuando falla la contraseña', function () {
    $this->postJson('/api/v1/auth/login', [
        'institution_code' => $this->institution->code,
        'email' => $this->admin->email,
        'password' => 'ClaveIncorrecta123!',
    ])->assertUnprocessable();

    app(InstitutionContext::class)->run(
        $this->institution->id,
        function () {
            expect($this->admin->fresh()->last_login_at)->toBeNull();

            expect(
                AuditLog::where('action', 'LOGIN')->count()
            )->toBe(0);
        }
    );
});

// PA-02: Revocación cuando se desactiva la institución.

it('PA-02 revoca el acceso cuando la institucion se desactiva', function () {

    // Comprobar que inicialmente tiene acceso.
    $this->actingAs($this->admin)
        ->getJson('/api/v1/auth/me')
        ->assertOk();

    // Desactivar la institución.
    $this->institution->update([
        'status' => InstitutionStatus::INACTIVE,
    ]);

    // Eliminar la relación previamente cargada en memoria.
    $this->admin->unsetRelation('institution');

    // Comprobar que el acceso sea rechazado.
    $this->getJson('/api/v1/auth/me')
        ->assertUnauthorized();
});


// PA-03: La contraseña anterior deja de funcionar.
it('PA-03 permite ingresar solo con la nueva contraseña', function () {
    $this->actingAs($this->admin)
        ->postJson('/api/v1/auth/change-password', [
            'current_password' => 'TestingPass123!',
            'password' => 'NuevaClaveSegura456!',
            'password_confirmation' => 'NuevaClaveSegura456!',
        ])
        ->assertOk();

    $this->postJson('/api/v1/auth/logout')
        ->assertNoContent();

    Auth::forgetGuards();

    $this->postJson('/api/v1/auth/login', [
        'institution_code' => $this->institution->code,
        'email' => $this->admin->email,
        'password' => 'TestingPass123!',
    ])->assertUnprocessable();

    $this->postJson('/api/v1/auth/login', [
        'institution_code' => $this->institution->code,
        'email' => $this->admin->email,
        'password' => 'NuevaClaveSegura456!',
    ])->assertOk();
});
