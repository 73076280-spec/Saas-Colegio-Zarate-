<?php

use App\Models\AuditLog;
use App\Models\Classroom\CourseUnit;
use App\Models\Classroom\Material;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\User;
use App\Services\Classroom\ClassroomService;
use App\Services\InstitutionContext;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

uses(DatabaseTransactions::class);

beforeEach(function () {
    expect(DB::connection()->getDatabaseName())->toBe('zarate_test');
    Storage::fake('materials');
    $this->institution = Institution::factory()->create();
    [$this->admin, $this->course, $this->teacher, $this->student, $this->enrollment] = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $admin = User::factory()->create();
        $admin->assignRole('ADMINISTRATOR');
        $course = Course::factory()->create(['status' => 'ACTIVE']);
        $enrollment = Enrollment::where('section_id', $course->section_id)->firstOrFail();
        $enrollment->update(['status' => 'APPROVED']);

        return [$admin, $course, $course->teacher->user, $enrollment->student->user, $enrollment];
    });
    $this->base = "/api/v1/courses/{$this->course->id}";
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->admin, 'web');
});
afterEach(fn () => app(InstitutionContext::class)->set(null));

function classroomLogin($test, User $user)
{
    Auth::forgetGuards();
    app('session')->flush();

    return $test->actingAs($user, 'web');
}
function classroomUnit($test): int
{
    return $test->postJson($test->base.'/units', ['title' => 'Unidad crítica', 'sequence' => 1])->assertCreated()->json('data.id');
}
function classroomText($test, array $extra = []): int
{
    return $test->postJson($test->base.'/materials', $extra + ['title' => 'Texto crítico', 'type' => 'TEXT', 'description' => 'Contenido ficticio'])->assertCreated()->json('data.id');
}

it('lets assigned teachers create edit publish archive units with ordered uniqueness and audit', function () {
    classroomLogin($this, $this->teacher);
    $id = classroomUnit($this);
    $this->patchJson("/api/v1/course-units/$id", ['title' => 'Unidad editada'])->assertOk();
    $this->postJson($this->base.'/units', ['title' => 'Duplicada', 'sequence' => 1])->assertUnprocessable();
    $this->postJson("/api/v1/course-units/$id/publish")->assertOk()->assertJsonPath('data.status', 'PUBLISHED')->assertJsonMissingPath('data.file_path');
    $this->postJson("/api/v1/course-units/$id/archive")->assertOk()->assertJsonPath('data.status', 'ARCHIVED');
    $this->patchJson("/api/v1/course-units/$id", ['sequence' => 2])->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        expect(AuditLog::where('entity_type', 'course_units')->where('entity_id', $id)->orderBy('id')->pluck('action')->map(fn ($a) => $a->value)->all())->toBe(['CREATE', 'UPDATE', 'PUBLISH', 'ARCHIVE']);
    });
});

it('requires active courses for publication and published parent units for materials', function () {
    $u = classroomUnit($this);
    $m = classroomText($this, ['course_unit_id' => $u]);
    $this->postJson("/api/v1/materials/$m/publish")->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->course->update(['status' => 'INACTIVE']));
    $this->postJson("/api/v1/course-units/$u/publish")->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->course->update(['status' => 'ACTIVE']));
    $this->postJson("/api/v1/course-units/$u/publish")->assertOk();
    $this->postJson("/api/v1/materials/$m/publish")->assertOk();
    $this->postJson("/api/v1/course-units/$u/archive")->assertOk();
    classroomLogin($this, $this->student)->getJson("/api/v1/materials/$m")->assertNotFound();
    $this->getJson($this->base.'/materials')->assertJsonCount(0, 'data');
    classroomLogin($this, $this->admin)->postJson("/api/v1/materials/$m/archive")->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($u) {
        expect(fn () => CourseUnit::find($u)->delete())->toThrow(LogicException::class);
        expect(fn () => CourseUnit::find($u)->forceDelete())->toThrow(LogicException::class);
    });
});

it('creates updates and publishes link and text materials and rejects incomplete payloads', function () {
    $m = classroomText($this);
    $this->patchJson("/api/v1/materials/$m", ['description' => 'Texto actualizado'])->assertOk();
    $this->postJson("/api/v1/materials/$m/publish")->assertOk();
    $link = $this->postJson($this->base.'/materials', ['title' => 'Enlace', 'type' => 'LINK', 'external_url' => 'https://example.org/lesson'])->assertCreated()->json('data.id');
    $this->patchJson("/api/v1/materials/$link", ['external_url' => null])->assertUnprocessable();
    $this->postJson($this->base.'/materials', ['title' => 'Vacío', 'type' => 'TEXT'])->assertUnprocessable();
    $this->postJson($this->base.'/materials', ['title' => 'Enlace', 'type' => 'LINK', 'external_url' => 'javascript:alert(1)'])->assertUnprocessable();
    $this->patchJson("/api/v1/materials/$m", ['type' => 'LINK'])->assertUnprocessable();
    $this->postJson($this->base.'/units', ['title' => 'Inyección', 'sequence' => 2, 'institution_id' => 999, 'status' => 'PUBLISHED'])->assertUnprocessable();
    $this->getJson($this->base.'/materials?per_page=101')->assertUnprocessable();
});

it('stores files privately with generated names and authorizes live downloads', function () {
    $m = $this->post($this->base.'/materials', ['title' => 'PDF ficticio', 'type' => 'FILE', 'file' => UploadedFile::fake()->createWithContent('guia.pdf', "%PDF-1.4\nContenido ficticio\n%%EOF")])->assertCreated()->assertJsonMissingPath('data.file_path')->json('data.id');
    $path = app(InstitutionContext::class)->run($this->institution->id, fn () => Material::find($m)->file_path);
    Storage::disk('materials')->assertExists($path);
    expect($path)->toStartWith($this->institution->id.'/'.$this->course->id.'/')->not->toContain('guia.pdf');
    classroomLogin($this, $this->student)->getJson("/api/v1/materials/$m/download")->assertNotFound();
    classroomLogin($this, $this->teacher)->postJson("/api/v1/materials/$m/publish")->assertOk();
    classroomLogin($this, $this->student)->get("/api/v1/materials/$m/download")->assertOk()->assertDownload('guia.pdf')->assertHeader('X-Content-Type-Options', 'nosniff');
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->enrollment->update(['status' => 'CANCELLED']));
    $this->getJson("/api/v1/materials/$m/download")->assertNotFound();
    $this->getJson($this->base.'/materials')->assertNotFound();
});

it('rejects executable disguised oversized and invalid office uploads without orphan files', function () {
    $files = [
        UploadedFile::fake()->createWithContent('virus.exe', 'MZ executable'),
        UploadedFile::fake()->createWithContent('fake.pdf', '<?php echo "unsafe";'),
        UploadedFile::fake()->create('large.pdf', 2049, 'application/pdf'),
        UploadedFile::fake()->createWithContent('fake.docx', 'Not an office document'),
    ];
    foreach ($files as $file) {
        $response = $this->post($this->base.'/materials', ['title' => 'Inválido', 'type' => 'FILE', 'file' => $file]);
        expect($response->status(), $file->getClientOriginalName())->toBe(422);
        $response->assertJsonValidationErrors('file');
    }
    expect(Storage::disk('materials')->allFiles())->toBe([]);
});

it('shows only published content to approved students and denies management', function () {
    $u = classroomUnit($this);
    $published = classroomText($this);
    $draft = classroomText($this, ['title' => 'Oculto']);
    $this->postJson("/api/v1/materials/$published/publish")->assertOk();
    classroomLogin($this, $this->student)->getJson($this->base.'/units')->assertOk()->assertJsonCount(0, 'data');
    $this->getJson($this->base.'/materials')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('abilities.create', false);
    $this->getJson("/api/v1/materials/$draft")->assertNotFound();
    $this->getJson("/api/v1/course-units/$u")->assertNotFound();
    $this->patchJson("/api/v1/materials/$published", ['title' => 'No autorizado'])->assertForbidden();
    $this->postJson("/api/v1/materials/$published/archive")->assertForbidden();
    $this->postJson($this->base.'/units', ['title' => 'No autorizado', 'sequence' => 3])->assertForbidden();
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->enrollment->update(['status' => 'OBSERVED']));
    $this->getJson("/api/v1/materials/$published")->assertNotFound();
});

it('denies non assigned teachers and non classroom roles with current permission checks', function () {
    $m = classroomText($this);
    $users = app(InstitutionContext::class)->run($this->institution->id, function () {
        $users = [];
        foreach (['TEACHER', 'SECRETARY', 'TREASURY', 'GUARDIAN'] as $role) {
            $u = User::factory()->create();
            $u->assignRole($role);
            $users[] = $u;
        }

        return $users;
    });
    foreach ($users as $user) {
        classroomLogin($this, $user)->getJson($this->base.'/materials')->assertNotFound();
        $this->postJson("/api/v1/materials/$m/publish")->assertForbidden();
    }
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->teacher->roles()->first()->revokePermissionTo('materials.publish'));
    classroomLogin($this, $this->teacher)->postJson("/api/v1/materials/$m/publish")->assertForbidden();
});

it('isolates foreign institutions and rejects units belonging to another course', function () {
    $other = Institution::factory()->create();
    [$foreignUnit, $foreignMaterial] = app(InstitutionContext::class)->run($other->id, function () {
        (new RolePermissionSeeder)->run();

        return [CourseUnit::factory()->create(), Material::factory()->create()];
    });
    $this->getJson("/api/v1/course-units/$foreignUnit->id")->assertNotFound();
    $this->postJson("/api/v1/materials/$foreignMaterial->id/publish")->assertNotFound();
    $this->getJson("/api/v1/materials/$foreignMaterial->id/download")->assertNotFound();
    $this->getJson("/api/v1/courses/$foreignUnit->course_id/units")->assertNotFound();
    $this->postJson($this->base.'/materials', ['title' => 'Cruce', 'type' => 'TEXT', 'description' => 'Contenido', 'course_unit_id' => $foreignUnit->id])->assertUnprocessable();
    $sameInstitutionUnit = app(InstitutionContext::class)->run($this->institution->id, fn () => CourseUnit::factory()->create());
    $m = classroomText($this);
    $this->patchJson("/api/v1/materials/$m", ['course_unit_id' => $sameInstitutionUnit->id])->assertUnprocessable();
});

it('rolls back metadata audit and uploaded files together on failure', function () {
    $this->partialMock(ClassroomService::class)->shouldReceive('audit')->andThrow(new RuntimeException('Audit unavailable'));
    $this->post($this->base.'/materials', ['title' => 'Reversión', 'type' => 'FILE', 'file' => UploadedFile::fake()->createWithContent('demo.txt', 'Contenido seguro')])->assertStatus(500);
    expect(Storage::disk('materials')->allFiles())->toBe([]);
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(Material::where('course_id', $this->course->id)->count())->toBe(0));
});

it('preserves material history and audits create update publish archive without private paths', function () {
    $m = classroomText($this);
    $this->patchJson("/api/v1/materials/$m", ['title' => 'Revisado'])->assertOk();
    $this->postJson("/api/v1/materials/$m/publish")->assertOk();
    $this->postJson("/api/v1/materials/$m/archive")->assertOk();
    $this->patchJson("/api/v1/materials/$m", ['title' => 'No cambiar'])->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($m) {
        $logs = AuditLog::where('entity_type', 'materials')->where('entity_id', $m)->orderBy('id')->get();
        expect($logs->pluck('action')->map(fn ($a) => $a->value)->all())->toBe(['CREATE', 'UPDATE', 'PUBLISH', 'ARCHIVE']);
        expect($logs->last()->old_values['status'])->toBe('PUBLISHED');
        expect($logs->last()->new_values)->not->toHaveKeys(['file_path', 'description', 'external_url']);
        expect(fn () => Material::find($m)->forceDelete())->toThrow(LogicException::class);
    });
});

it('supports multipart file replacement and hides all content after course deactivation', function () {
    $m = $this->post($this->base.'/materials', ['title' => 'Archivo', 'type' => 'FILE', 'file' => UploadedFile::fake()->createWithContent('old.txt', 'Texto anterior')])->assertCreated()->json('data.id');
    $this->post("/api/v1/materials/$m", ['_method' => 'PATCH', 'file' => UploadedFile::fake()->createWithContent('new.txt', 'Texto nuevo')])->assertOk()->assertJsonPath('data.original_filename', 'new.txt');
    $this->postJson("/api/v1/materials/$m/publish")->assertOk();
    classroomLogin($this, $this->student)->getJson("/api/v1/materials/$m")->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->course->update(['status' => 'INACTIVE']));
    $this->getJson("/api/v1/materials/$m")->assertNotFound();
    $this->getJson("/api/v1/materials/$m/download")->assertNotFound();
});

it('paginates ordered units and material filters and requires authentication', function () {
    $u = classroomUnit($this);
    $this->postJson($this->base.'/units', ['title' => 'Segunda', 'sequence' => 2])->assertCreated();
    classroomText($this, ['course_unit_id' => $u]);
    classroomText($this);
    $this->getJson($this->base.'/units?per_page=1&page=2')->assertOk()->assertJsonPath('data.0.sequence', 2)->assertJsonPath('total', 2);
    $this->getJson($this->base."/materials?course_unit_id=$u")->assertOk()->assertJsonCount(1, 'data');
    Auth::forgetGuards();
    app('session')->flush();
    $this->getJson($this->base.'/units')->assertUnauthorized();
    $this->getJson('/api/v1/materials/1/download')->assertUnauthorized();
});
