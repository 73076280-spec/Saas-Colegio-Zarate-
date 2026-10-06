<?php

use App\Models\Academic\AcademicPeriod;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\EducationLevel;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Academic\Subject;
use App\Models\AuditLog;
use App\Models\Institution;
use App\Models\User;
use App\Services\Academic\AcademicCatalog;
use App\Services\InstitutionContext;
use Database\Seeders\AcademicDemoSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\PermissionRegistrar;

uses(DatabaseTransactions::class);
function academicFixtures(Institution $institution): array
{
    return app(InstitutionContext::class)->run($institution->id, function () {
        $year = AcademicYear::create(['name' => '2026', 'start_date' => '2026-03-02', 'end_date' => '2026-12-18', 'status' => 'ACTIVE', 'is_current' => true]);
        $level = EducationLevel::create(['name' => 'Primaria', 'code' => 'PRI', 'sort_order' => 1]);
        $grade = GradeLevel::create(['education_level_id' => $level->id, 'name' => 'Quinto', 'code' => '5', 'sort_order' => 5]);

        return compact('year', 'level', 'grade');
    });
}
beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    app(PermissionRegistrar::class)->forgetCachedPermissions();
    $this->institution = Institution::factory()->create();
    $this->admin = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $user = User::factory()->create();
        $user->assignRole('ADMINISTRATOR');

        return $user;
    });
    $this->fixtures = academicFixtures($this->institution);
    $this->payloads = [
        'academic-years' => ['name' => '2027', 'start_date' => '2027-03-01', 'end_date' => '2027-12-17', 'status' => 'DRAFT'],
        'academic-periods' => ['academic_year_id' => $this->fixtures['year']->id, 'name' => 'Bimestre 1', 'sequence' => 1, 'start_date' => '2026-03-02', 'end_date' => '2026-05-08', 'grading_open' => true, 'status' => 'ACTIVE'],
        'education-levels' => ['name' => 'Secundaria', 'code' => 'SEC', 'sort_order' => 2],
        'grade-levels' => ['education_level_id' => $this->fixtures['level']->id, 'name' => 'Sexto', 'code' => '6', 'sort_order' => 6],
        'sections' => ['academic_year_id' => $this->fixtures['year']->id, 'grade_level_id' => $this->fixtures['grade']->id, 'name' => 'A', 'capacity' => 30],
        'subjects' => ['name' => 'Matemática', 'code' => 'MAT-001', 'description' => 'Demo'],
    ];
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->admin, 'web');
});
afterEach(fn () => app(InstitutionContext::class)->set(null));

it('creates reads edits and audits an academic catalog', function (string $catalog) {
    $result = $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertCreated()->json('data');
    $this->getJson('/api/v1/'.$catalog.'/'.$result['id'])->assertOk()->assertJsonPath('data.name', $this->payloads[$catalog]['name']);
    $this->patchJson('/api/v1/'.$catalog.'/'.$result['id'], ['name' => 'Nombre actualizado'])->assertOk()->assertJsonPath('data.name', 'Nombre actualizado');
    app(InstitutionContext::class)->run($this->institution->id, function () use ($result, $catalog) {
        $logs = AuditLog::where('entity_type', str_replace('-', '_', $catalog))->where('entity_id', $result['id'])->orderBy('id')->get();
        expect($logs)->toHaveCount(2);
        expect($logs[0]->action->value)->toBe('CREATE');
        expect($logs[1]->action->value)->toBe('UPDATE');
        expect($logs[1]->old_values['name'])->toBe($this->payloads[$catalog]['name']);
    });
})->with(array_keys(AcademicCatalog::MODELS));

it('rejects missing academic fields', function (string $catalog) {
    $this->postJson('/api/v1/'.$catalog, [])->assertUnprocessable()->assertJsonValidationErrors('name');
})->with(array_keys(AcademicCatalog::MODELS));

it('rejects duplicates in the proper academic scope', function (string $catalog) {
    $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertCreated();
    $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertUnprocessable();
})->with(array_keys(AcademicCatalog::MODELS));

it('validates academic status and rejects tenant injection', function (string $catalog) {
    $this->postJson('/api/v1/'.$catalog, array_merge($this->payloads[$catalog], ['status' => 'UNKNOWN', 'institution_id' => 999]))
        ->assertUnprocessable()->assertJsonValidationErrors(['status', 'institution_id']);
})->with(array_keys(AcademicCatalog::MODELS));

it('isolates academic records and policies', function (string $catalog) {
    $other = Institution::factory()->create();
    $fixtures = academicFixtures($other);
    $payload = $this->payloads[$catalog];
    foreach (['academic_year_id' => 'year', 'education_level_id' => 'level', 'grade_level_id' => 'grade'] as $field => $key) {
        if (isset($payload[$field])) {
            $payload[$field] = $fixtures[$key]->id;
        }
    }
    $foreign = app(InstitutionContext::class)->run($other->id, fn () => AcademicCatalog::model($catalog)::create($payload));
    $this->getJson('/api/v1/'.$catalog.'/'.$foreign->id)->assertNotFound();
    $this->patchJson('/api/v1/'.$catalog.'/'.$foreign->id, ['name' => 'Intrusion'])->assertNotFound();
    $this->getJson('/api/v1/'.$catalog.'?search='.urlencode($payload['name']))->assertOk()->assertJsonMissing(['id' => $foreign->id]);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($foreign) {
        expect(Gate::forUser($this->admin)->allows('update', $foreign))->toBeFalse();
    });
})->with(array_keys(AcademicCatalog::MODELS));

it('requires authentication for academic endpoints', function (string $catalog) {
    Auth::guard('web')->logout();
    Auth::forgetGuards();
    $this->flushSession();
    $this->getJson('/api/v1/'.$catalog)->assertUnauthorized();
    $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertUnauthorized();
})->with(array_keys(AcademicCatalog::MODELS));

it('assigns read only academic permissions to secretary and teacher', function (string $role) {
    $user = app(InstitutionContext::class)->run($this->institution->id, function () use ($role) {
        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    });
    $this->actingAs($user, 'web');
    foreach (array_keys(AcademicCatalog::MODELS) as $catalog) {
        $this->getJson('/api/v1/'.$catalog)->assertOk();
        $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertForbidden();
    }
})->with(['SECRETARY', 'TEACHER']);

it('does not expose academic administration to other roles', function (string $role) {
    $user = app(InstitutionContext::class)->run($this->institution->id, function () use ($role) {
        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    });
    $this->actingAs($user, 'web');
    foreach (array_keys(AcademicCatalog::MODELS) as $catalog) {
        $this->getJson('/api/v1/'.$catalog)->assertForbidden();
        $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertForbidden();
    }
})->with(['STUDENT', 'GUARDIAN', 'TREASURY']);

it('switches current academic year atomically', function () {
    $data = array_merge($this->payloads['academic-years'], ['is_current' => true]);
    $this->postJson('/api/v1/academic-years', $data)->assertCreated()->assertJsonPath('data.is_current', true)->assertJsonPath('data.status', 'ACTIVE');
    app(InstitutionContext::class)->run($this->institution->id, function () {
        expect(AcademicYear::where('is_current', true)->count())->toBe(1);
        expect($this->fixtures['year']->fresh()->is_current)->toBeFalse();
        expect(AuditLog::where('entity_id', $this->fixtures['year']->id)->where('action', 'UPDATE')->exists())->toBeTrue();
    });
});
it('activating a year makes it current and leaves another institution unchanged', function () {
    $other = Institution::factory()->create();
    $otherFixtures = academicFixtures($other);
    $this->postJson('/api/v1/academic-years', array_merge($this->payloads['academic-years'], ['status' => 'ACTIVE']))->assertCreated()->assertJsonPath('data.is_current', true);
    app(InstitutionContext::class)->run($other->id, fn () => expect($otherFixtures['year']->fresh()->is_current)->toBeTrue());
});
it('enforces single current year with a MySQL unique constraint', function () {
    expect(fn () => app(InstitutionContext::class)->run($this->institution->id, fn () => AcademicYear::create(array_merge($this->payloads['academic-years'], ['is_current' => true]))))
        ->toThrow(QueryException::class);
});
it('rejects invalid academic date intervals', function (string $catalog, string $start, string $end) {
    $this->postJson('/api/v1/'.$catalog, array_merge($this->payloads[$catalog], ['start_date' => $start, 'end_date' => $end]))->assertUnprocessable();
})->with([
    ['academic-years', '2027-04-01', '2027-04-01'], ['academic-years', '2027-05-01', '2027-04-01'],
    ['academic-periods', '2026-04-01', '2026-04-01'], ['academic-periods', '2026-05-01', '2026-04-01'],
    ['academic-years', '2027-02-30', '2027-12-01'], ['academic-periods', 'not-a-date', '2026-12-01'],
]);
it('rejects periods outside the year', function (string $start, string $end) {
    $this->postJson('/api/v1/academic-periods', array_merge($this->payloads['academic-periods'], ['start_date' => $start, 'end_date' => $end]))
        ->assertUnprocessable()->assertJsonValidationErrors('start_date');
})->with([['2026-01-01', '2026-04-01'], ['2026-10-01', '2026-12-31']]);
it('rejects overlapping and shared boundary periods', function (string $start, string $end) {
    $this->postJson('/api/v1/academic-periods', $this->payloads['academic-periods'])->assertCreated();
    $this->postJson('/api/v1/academic-periods', array_merge($this->payloads['academic-periods'], ['sequence' => 2, 'start_date' => $start, 'end_date' => $end]))->assertUnprocessable();
})->with([['2026-04-01', '2026-06-01'], ['2026-05-08', '2026-06-01'], ['2026-03-02', '2026-12-18']]);
it('allows adjacent non overlapping periods but not duplicate sequence', function () {
    $this->postJson('/api/v1/academic-periods', $this->payloads['academic-periods'])->assertCreated();
    $second = array_merge($this->payloads['academic-periods'], ['start_date' => '2026-05-09', 'end_date' => '2026-07-01']);
    $this->postJson('/api/v1/academic-periods', $second)->assertUnprocessable()->assertJsonValidationErrors('sequence');
    $this->postJson('/api/v1/academic-periods', array_merge($second, ['sequence' => 2]))->assertCreated();
});
it('does not shrink a year beyond its periods', function () {
    $this->postJson('/api/v1/academic-periods', $this->payloads['academic-periods'])->assertCreated();
    $this->patchJson('/api/v1/academic-years/'.$this->fixtures['year']->id, ['start_date' => '2026-04-01'])->assertUnprocessable();
});
it('closes a period and blocks grading and subsequent edits', function () {
    $id = $this->postJson('/api/v1/academic-periods', $this->payloads['academic-periods'])->assertCreated()->json('data.id');
    $this->postJson('/api/v1/academic-periods/'.$id.'/close')->assertOk()->assertJsonPath('data.grading_open', false)->assertJsonPath('data.status', 'CLOSED');
    $this->patchJson('/api/v1/academic-periods/'.$id, ['grading_open' => true])->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(AuditLog::where('action', 'CLOSE')->where('entity_id', $id)->exists())->toBeTrue());
});
it('closes a year and its periods and rejects new academic changes', function () {
    $period = $this->postJson('/api/v1/academic-periods', $this->payloads['academic-periods'])->assertCreated()->json('data.id');
    $this->postJson('/api/v1/academic-years/'.$this->fixtures['year']->id.'/close')->assertOk()->assertJsonPath('data.is_current', false);
    $this->getJson('/api/v1/academic-periods/'.$period)->assertOk()->assertJsonPath('data.status', 'CLOSED')->assertJsonPath('data.grading_open', false);
    $this->postJson('/api/v1/sections', $this->payloads['sections'])->assertUnprocessable();
    $this->postJson('/api/v1/academic-periods', $this->payloads['academic-periods'])->assertUnprocessable();
    $this->patchJson('/api/v1/academic-years/'.$this->fixtures['year']->id, ['status' => 'ACTIVE'])->assertUnprocessable();
});
it('cannot bypass close or disable permissions through status fields', function (string $catalog, string $status) {
    $id = $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertCreated()->json('data.id');
    $manager = app(InstitutionContext::class)->run($this->institution->id, function () use ($catalog) {
        $user = User::factory()->create();
        $user->givePermissionTo($catalog.'.update');

        return $user;
    });
    Auth::forgetGuards();
    $this->flushSession();
    $this->actingAs($manager, 'web')->patchJson('/api/v1/'.$catalog.'/'.$id, ['status' => $status])->assertForbidden();
})->with([['academic-years', 'CLOSED'], ['academic-periods', 'CLOSED'], ['subjects', 'INACTIVE']]);
it('validates section capacity', function ($capacity) {
    $this->postJson('/api/v1/sections', array_merge($this->payloads['sections'], ['capacity' => $capacity]))->assertUnprocessable()->assertJsonValidationErrors('capacity');
})->with([-1, 0, 2.5, 'many']);
it('accepts nullable capacity', function () {
    $this->postJson('/api/v1/sections', array_merge($this->payloads['sections'], ['capacity' => null]))->assertCreated()->assertJsonPath('data.capacity', null);
});
it('rejects missing and foreign parent relationships', function (string $catalog, string $field, string $fixture) {
    $this->postJson('/api/v1/'.$catalog, array_merge($this->payloads[$catalog], [$field => 999999999]))->assertUnprocessable()->assertJsonValidationErrors($field);
    $other = academicFixtures(Institution::factory()->create());
    $this->postJson('/api/v1/'.$catalog, array_merge($this->payloads[$catalog], [$field => $other[$fixture]->id]))->assertUnprocessable()->assertJsonValidationErrors($field);
})->with([['academic-periods', 'academic_year_id', 'year'], ['grade-levels', 'education_level_id', 'level'], ['sections', 'academic_year_id', 'year'], ['sections', 'grade_level_id', 'grade']]);
it('preserves parent relationships on historical records', function () {
    $id = $this->postJson('/api/v1/sections', $this->payloads['sections'])->assertCreated()->json('data.id');
    $year = $this->postJson('/api/v1/academic-years', $this->payloads['academic-years'])->assertCreated()->json('data.id');
    $this->patchJson('/api/v1/sections/'.$id, ['academic_year_id' => $year])->assertUnprocessable()->assertJsonValidationErrors('academic_year_id');
});
it('disables subjects without removing history and audits the change', function () {
    $id = $this->postJson('/api/v1/subjects', $this->payloads['subjects'])->assertCreated()->json('data.id');
    $this->postJson('/api/v1/subjects/'.$id.'/disable')->assertOk()->assertJsonPath('data.status', 'INACTIVE');
    $this->getJson('/api/v1/subjects/'.$id)->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        expect(Subject::find($id)->deleted_at)->toBeNull();
        expect(AuditLog::where('action', 'DISABLE')->where('entity_type', 'subjects')->count())->toBe(1);
    });
});
it('searches filters paginates and orders academic lists', function () {
    $this->postJson('/api/v1/subjects', $this->payloads['subjects'])->assertCreated();
    $this->postJson('/api/v1/subjects', ['name' => 'Inglés', 'code' => 'ING-001', 'status' => 'INACTIVE'])->assertCreated();
    $this->getJson('/api/v1/subjects?search=matematica&status=ACTIVE')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.code', 'MAT-001');
    $this->getJson('/api/v1/subjects?per_page=1&page=2')->assertOk()->assertJsonPath('total', 2)->assertJsonPath('current_page', 2);
    $this->getJson('/api/v1/subjects?per_page=1000&status=INVALID')->assertUnprocessable();
    $this->getJson('/api/v1/grade-levels?education_level_id='.$this->fixtures['level']->id)->assertOk()->assertJsonCount(1, 'data');
    $this->getJson('/api/v1/sections?academic_year_id=999999')->assertOk()->assertJsonCount(0, 'data');
});
it('allows identical grade codes under different education levels', function () {
    $level = $this->postJson('/api/v1/education-levels', $this->payloads['education-levels'])->assertCreated()->json('data.id');
    $data = ['name' => 'Quinto', 'code' => '5', 'education_level_id' => $level];
    $this->postJson('/api/v1/grade-levels', $data)->assertCreated();
});
it('does not reserve section names globally', function () {
    $this->postJson('/api/v1/sections', $this->payloads['sections'])->assertCreated();
    $grade = $this->postJson('/api/v1/grade-levels', $this->payloads['grade-levels'])->assertCreated()->json('data.id');
    $this->postJson('/api/v1/sections', array_merge($this->payloads['sections'], ['grade_level_id' => $grade]))->assertCreated();
});
it('soft deletes catalogs without freeing historical unique codes', function () {
    $id = $this->postJson('/api/v1/subjects', $this->payloads['subjects'])->assertCreated()->json('data.id');
    app(InstitutionContext::class)->run($this->institution->id, fn () => Subject::findOrFail($id)->delete());
    $this->getJson('/api/v1/subjects/'.$id)->assertNotFound();
    $this->postJson('/api/v1/subjects', $this->payloads['subjects'])->assertUnprocessable();
});
it('rolls back academic mutation when audit persistence fails', function () {
    $before = app(InstitutionContext::class)->run($this->institution->id, fn () => Subject::count());
    AuditLog::creating(fn () => throw new RuntimeException('Audit unavailable'));
    try {
        $this->withoutExceptionHandling();
        try {
            $this->postJson('/api/v1/subjects', $this->payloads['subjects']);
        } catch (RuntimeException $error) {
            expect($error->getMessage())->toBe('Audit unavailable');
        }
        app(InstitutionContext::class)->run($this->institution->id, fn () => expect(Subject::count())->toBe($before));
    } finally {
        AuditLog::flushEventListeners();
        AuditLog::clearBootedModels();
    }
});
it('reproduces demo data without duplicates or overwriting edits', function () {
    $this->institution->update(['code' => 'ZARATE']);
    $this->seed(AcademicDemoSeeder::class);
    $first = app(InstitutionContext::class)->run($this->institution->id, fn () => [AcademicYear::count(), AcademicPeriod::count(), EducationLevel::count(), GradeLevel::count(), Section::count(), Subject::count()]);
    app(InstitutionContext::class)->run($this->institution->id, fn () => Subject::where('code', 'MAT-001')->firstOrFail()->update(['description' => 'Personalizada']));
    $this->seed(AcademicDemoSeeder::class);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($first) {
        expect([AcademicYear::count(), AcademicPeriod::count(), EducationLevel::count(), GradeLevel::count(), Section::count(), Subject::count()])->toBe($first);
        expect(Subject::where('code', 'MAT-001')->firstOrFail()->description)->toBe('Personalizada');
    });
});

it('editing a non current active year does not change the current year', function () {
    $this->postJson('/api/v1/academic-years', array_merge($this->payloads['academic-years'], ['status' => 'ACTIVE']))->assertCreated();
    $this->patchJson('/api/v1/academic-years/'.$this->fixtures['year']->id, ['name' => '2026 editado', 'status' => 'ACTIVE', 'is_current' => false])->assertOk()->assertJsonPath('data.is_current', false);
});
it('prevents cross institution section relations at model level', function () {
    $other = academicFixtures(Institution::factory()->create());
    expect(fn () => app(InstitutionContext::class)->run($this->institution->id, fn () => Section::create(array_merge($this->payloads['sections'], ['grade_level_id' => $other['grade']->id]))))->toThrow(LogicException::class);
});
it('audits catalog deactivation as disable', function (string $catalog) {
    $id = $this->postJson('/api/v1/'.$catalog, $this->payloads[$catalog])->assertCreated()->json('data.id');
    $this->patchJson('/api/v1/'.$catalog.'/'.$id, ['status' => 'INACTIVE'])->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(AuditLog::where('entity_type', str_replace('-', '_', $catalog))->where('entity_id', $id)->where('action', 'DISABLE')->exists())->toBeTrue());
})->with(['education-levels', 'grade-levels', 'sections']);
