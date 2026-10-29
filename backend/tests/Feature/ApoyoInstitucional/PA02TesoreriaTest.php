
<?php

use App\Models\Academic\AcademicYear;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\PaymentConcept;
use App\Models\Enrollment\StudentPayment;
use App\Models\Institution;
use App\Models\User;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;

uses(DatabaseTransactions::class);

beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');

    $this->institution = Institution::factory()->create();

    app(InstitutionContext::class)->run(
        $this->institution->id,
        function () {
            (new RolePermissionSeeder)->run();

            $this->treasury = User::factory()->create();
            $this->treasury->assignRole('TREASURY');

            $this->enrollment = Enrollment::factory()->create();

            $this->studentId = $this->enrollment->student_id;
            $this->yearId = $this->enrollment->academic_year_id;
        }
    );

    $this->withHeaders([
        'Origin' => 'http://localhost:5173',
        'Accept' => 'application/json',
    ])->actingAs($this->treasury, 'web');
});

afterEach(fn () => app(InstitutionContext::class)->set(null));

it('PA02-01 rejects duplicate payment concept codes', function () {
    $data = [
        'name' => 'Matrícula de prueba',
        'code' => 'MATRICULA_PA02',
        'amount' => '150.00',
    ];

    $this->postJson('/api/v1/payment-concepts', $data)
        ->assertCreated();

    $this->postJson('/api/v1/payment-concepts', [
        'name' => 'Otro concepto',
        'code' => 'MATRICULA_PA02',
        'amount' => '200.00',
    ])->assertUnprocessable()
      ->assertJsonValidationErrors('code');

    $count = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => PaymentConcept::where('code', 'MATRICULA_PA02')->count()
    );

    expect($count)->toBe(1);
});

it('PA02-02 rejects payments with inactive concepts', function () {
    $concept = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => PaymentConcept::create([
            'name' => 'Concepto inactivo',
            'code' => 'INACTIVO_PA02',
            'amount' => 100,
            'status' => 'INACTIVE',
        ])
    );

    $this->postJson('/api/v1/student-payments', [
        'student_id' => $this->studentId,
        'academic_year_id' => $this->yearId,
        'payment_concept_id' => $concept->id,
        'amount' => '100.00',
    ])->assertUnprocessable()
      ->assertJsonValidationErrors('payment_concept_id');

    $count = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => StudentPayment::where(
            'payment_concept_id',
            $concept->id
        )->count()
    );

    expect($count)->toBe(0);
});

it('PA02-03 calculates pending amount for selected academic year', function () {
    $concept = app(InstitutionContext::class)->run(
        $this->institution->id,
        fn () => PaymentConcept::create([
            'name' => 'Mensualidad PA02',
            'code' => 'MENSUALIDAD_PA02',
            'amount' => 150,
            'status' => 'ACTIVE',
        ])
    );

    app(InstitutionContext::class)->run(
        $this->institution->id,
        function () use ($concept) {
            StudentPayment::create([
                'student_id' => $this->studentId,
                'academic_year_id' => $this->yearId,
                'payment_concept_id' => $concept->id,
                'amount' => 150,
                'status' => 'PENDING',
            ]);
        }
    );

    $cards = collect(
        $this->getJson(
            '/api/v1/dashboard?academic_year_id='.$this->yearId
        )->assertOk()->json('cards')
    )->pluck('value', 'label');

    expect((float) $cards['Monto pendiente (PEN)'])->toBe(150.0);
});
