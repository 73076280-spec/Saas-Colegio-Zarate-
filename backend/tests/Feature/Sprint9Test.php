<?php

use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\Office\AcademicRequest;
use App\Models\Office\RequestType;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Models\User;
use App\Services\InstitutionContext;
use App\Services\Office\OfficeAudit;
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
    [$this->course,$this->student,$this->profile,$this->guardian,$this->secretary,$this->type,$this->teacher] = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $c = Course::factory()->create(['status' => 'ACTIVE']);
        $e = Enrollment::where('section_id', $c->section_id)->firstOrFail();
        $e->update(['status' => 'APPROVED']);
        $g = Guardian::factory()->create()->load('user');
        StudentGuardian::create(['student_id' => $e->student_id, 'guardian_id' => $g->id, 'relationship' => 'MOTHER', 'is_primary' => true]);
        $u = User::factory()->create();
        $u->assignRole('SECRETARY');
        $type = RequestType::create(['name' => 'Constancia', 'code' => 'CONSTANCIA', 'status' => 'ACTIVE']);

        return [$c, $e->student->user, $e->student, $g, $u, $type, $c->teacher->user];
    });
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->student, 'web');
});
afterEach(fn () => app(InstitutionContext::class)->set(null));
function officeLogin($t, User $u)
{
    Auth::forgetGuards();
    app('session')->flush();

    return $t->actingAs($u, 'web');
}
function officeCreate($t): int
{
    return $t->postJson('/api/v1/academic-requests', ['request_type_id' => $t->type->id, 'subject' => 'Solicitud ficticia', 'description' => 'Descripción privada ficticia'])->assertCreated()->json('data.id');
}
function officeReview($t, int $id)
{
    officeLogin($t, $t->secretary)->postJson("/api/v1/academic-requests/$id/review")->assertOk();
}
function officeCommunication($t, array $targets): int
{
    officeLogin($t, $t->secretary);

    return $t->postJson('/api/v1/communications', ['title' => 'Comunicado ficticio', 'body' => 'Mensaje institucional', 'targets' => $targets])->assertCreated()->json('data.id');
}

it('creates student owned requests with unique generated codes and denies impersonation', function () {
    $a = officeCreate($this);
    $b = officeCreate($this);
    $this->getJson("/api/v1/academic-requests/$a")->assertJsonPath('data.student_id', $this->profile->id);
    $codes = $this->getJson('/api/v1/my/requests')->assertJsonCount(2, 'data')->json('data');
    expect($codes[0]['request_code'])->not->toBe($codes[1]['request_code']);
    expect($codes[0]['request_code'])->toMatch('/^SOL-\d{4}-\d{6,}$/');
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create()->load('user'));
    $data = ['student_id' => $other->id, 'request_type_id' => $this->type->id, 'subject' => 'No', 'description' => 'No'];
    $this->postJson('/api/v1/academic-requests', $data)->assertForbidden();
    $this->postJson('/api/v1/academic-requests', ['request_code' => 'SOL-forged'] + $data)->assertUnprocessable();
    officeLogin($this, $other->user)->getJson("/api/v1/academic-requests/$a")->assertNotFound();
    $this->getJson('/api/v1/my/requests')->assertJsonCount(0, 'data');
});
it('allows a linked guardian to create and consult a student request', function () {
    officeLogin($this, $this->guardian->user);
    $id = $this->postJson('/api/v1/academic-requests', ['student_id' => $this->profile->id, 'request_type_id' => $this->type->id, 'subject' => 'Solicitud familiar', 'description' => 'Ficticia'])->assertCreated()->assertJsonPath('data.guardian_id', $this->guardian->id)->json('data.id');
    $this->getJson('/api/v1/my/requests')->assertJsonCount(1, 'data');
    $this->getJson("/api/v1/academic-requests/$id/history")->assertJsonPath('data.0.new_status', 'REGISTERED');
    officeLogin($this, $this->student)->getJson("/api/v1/academic-requests/$id")->assertOk();
});
it('denies unrelated guardians creation reading editing and transitions', function () {
    $id = officeCreate($this);
    $g = app(InstitutionContext::class)->run($this->institution->id, fn () => Guardian::factory()->create()->load('user'));
    officeLogin($this, $g->user);
    $this->postJson('/api/v1/academic-requests', ['student_id' => $this->profile->id, 'request_type_id' => $this->type->id, 'subject' => 'No', 'description' => 'No'])->assertForbidden();
    $this->getJson("/api/v1/academic-requests/$id")->assertNotFound();
    $this->getJson("/api/v1/academic-requests/$id/history")->assertNotFound();
    $this->patchJson("/api/v1/academic-requests/$id", ['subject' => 'No'])->assertForbidden();
    $this->postJson("/api/v1/academic-requests/$id/review")->assertForbidden();
});
it('observes and reopens requests with owner corrections and complete history', function () {
    $id = officeCreate($this);
    $this->postJson("/api/v1/academic-requests/$id/review")->assertForbidden();
    officeLogin($this, $this->secretary);
    $this->postJson("/api/v1/academic-requests/$id/observe", ['comment' => 'No'])->assertUnprocessable();
    $this->postJson("/api/v1/academic-requests/$id/review")->assertOk();
    $this->postJson("/api/v1/academic-requests/$id/observe")->assertUnprocessable();
    $this->postJson("/api/v1/academic-requests/$id/observe", ['comment' => 'Completar descripción'])->assertOk();
    officeLogin($this, $this->student)->patchJson("/api/v1/academic-requests/$id", ['description' => 'Corrección ficticia'])->assertOk();
    $this->patchJson("/api/v1/academic-requests/$id", ['assigned_to' => $this->student->id])->assertForbidden();
    officeReview($this, $id);
    $this->getJson("/api/v1/academic-requests/$id/history")->assertJsonCount(4, 'data')->assertJsonPath('data.2.new_status', 'OBSERVED');
    officeLogin($this, $this->student)->getJson('/api/v1/my/notifications?status=unread')->assertJsonCount(3, 'data');
});
it('approves completes and rejects only valid transitions with atomic notifications and history', function () {
    $id = officeCreate($this);
    officeReview($this, $id);
    $audit = app(OfficeAudit::class);
    $this->mock(OfficeAudit::class)->shouldReceive('record')->andThrow(new RuntimeException('Audit unavailable'));
    $this->postJson("/api/v1/academic-requests/$id/approve", ['resolution' => 'Conforme'])->assertStatus(500);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($id) {
        $r = AcademicRequest::findOrFail($id);
        expect($r->status)->toBe('IN_REVIEW');
        expect($r->history()->count())->toBe(2);
        expect($this->student->notifications()->count())->toBe(1);
    });
    $this->instance(OfficeAudit::class, $audit);
    $this->postJson("/api/v1/academic-requests/$id/approve", ['resolution' => 'Conforme'])->assertOk();
    $this->postJson("/api/v1/academic-requests/$id/complete", ['resolution' => 'Trámite completado'])->assertOk();
    $this->postJson("/api/v1/academic-requests/$id/reject", ['resolution' => 'No', 'comment' => 'No'])->assertUnprocessable();
    $this->getJson("/api/v1/academic-requests/$id/history")->assertJsonCount(4, 'data');
    officeLogin($this, $this->student);
    $other = officeCreate($this);
    officeReview($this, $other);
    $this->postJson("/api/v1/academic-requests/$other/reject", ['resolution' => 'No procede', 'comment' => 'Solicitud improcedente'])->assertOk()->assertJsonPath('data.status', 'REJECTED');
});
it('keeps documents private and issues only approved linked documents to the correct student', function () {
    $id = officeCreate($this);
    officeReview($this, $id);
    $doc = $this->post('/api/v1/academic-documents', ['academic_request_id' => $id, 'document_type' => 'CONSTANCIA', 'file' => UploadedFile::fake()->createWithContent('constancia.txt', 'Documento ficticio')])->assertCreated()->assertJsonMissingPath('data.file_path')->json('data.id');
    $this->postJson("/api/v1/academic-documents/$doc/issue")->assertUnprocessable();
    officeLogin($this, $this->student)->get("/api/v1/academic-documents/$doc/download")->assertNotFound();
    officeLogin($this, $this->secretary)->postJson("/api/v1/academic-requests/$id/approve", ['resolution' => 'Aprobada'])->assertOk();
    $this->postJson("/api/v1/academic-documents/$doc/issue")->assertOk();
    $this->postJson("/api/v1/academic-documents/$doc/issue")->assertUnprocessable();
    officeLogin($this, $this->student)->get("/api/v1/academic-documents/$doc/download")->assertOk()->assertDownload('constancia.txt');
    $this->postJson("/api/v1/academic-documents/$doc/issue")->assertForbidden();
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create()->load('user')->user);
    officeLogin($this, $other)->get("/api/v1/academic-documents/$doc/download")->assertNotFound();
    officeLogin($this, $this->secretary);
    $this->post('/api/v1/academic-documents', ['student_id' => $this->profile->id, 'document_type' => 'OTRO', 'file' => UploadedFile::fake()->createWithContent('bad.php', '<?php exit;')])->assertUnprocessable();
    $this->postJson("/api/v1/academic-documents/$doc/cancel")->assertOk()->assertJsonPath('data.status', 'CANCELLED');
    $this->postJson("/api/v1/academic-documents/$doc/issue")->assertUnprocessable();
    officeLogin($this, $this->student)->get("/api/v1/academic-documents/$doc/download")->assertNotFound();

});
it('deduplicates overlapping communication targets and keeps published recipients stable', function () {
    $id = officeCommunication($this, [['kind' => 'role', 'target' => 'STUDENT'], ['kind' => 'user', 'target' => (string) $this->student->id], ['kind' => 'course', 'target' => (string) $this->course->id], ['kind' => 'grade', 'target' => (string) $this->course->grade_level_id], ['kind' => 'section', 'target' => (string) $this->course->section_id]]);
    officeLogin($this, $this->student)->getJson("/api/v1/communications/$id")->assertNotFound();
    officeLogin($this, $this->secretary)->postJson("/api/v1/communications/$id/publish")->assertOk();
    $this->postJson("/api/v1/communications/$id/publish")->assertUnprocessable();
    $this->patchJson("/api/v1/communications/$id", ['body' => 'No'])->assertUnprocessable();
    officeLogin($this, $this->student)->getJson('/api/v1/notifications')->assertJsonCount(1, 'data')->assertJsonPath('unread_count', 1);
    $this->getJson("/api/v1/communications/$id")->assertOk()->assertJsonCount(0, 'data.targets');
    officeLogin($this, $this->guardian->user)->getJson("/api/v1/communications/$id")->assertOk();
    officeLogin($this, $this->teacher)->getJson("/api/v1/communications/$id")->assertOk();
});
it('restricts communications to recipients and protects foreign targets and management', function () {
    $id = officeCommunication($this, [['kind' => 'user', 'target' => (string) $this->teacher->id]]);
    $this->postJson("/api/v1/communications/$id/publish")->assertOk();
    officeLogin($this, $this->student)->getJson("/api/v1/communications/$id")->assertNotFound();
    $this->postJson("/api/v1/communications/$id/archive")->assertForbidden();
    officeLogin($this, $this->secretary)->postJson("/api/v1/communications/$id/archive")->assertOk();
    officeLogin($this, $this->teacher)->getJson("/api/v1/communications/$id")->assertNotFound();
    officeLogin($this, $this->secretary);
    $this->postJson('/api/v1/communications', ['title' => 'No', 'body' => 'No', 'targets' => [['kind' => 'institution', 'target' => (string) ($this->institution->id + 9999)]]])->assertUnprocessable();
});
it('marks only owned notifications read and supports unread filters and mark all', function () {
    $id = officeCreate($this);
    officeReview($this, $id);
    $this->postJson("/api/v1/academic-requests/$id/observe", ['comment' => 'Completar'])->assertOk();
    officeLogin($this, $this->student);
    $n = $this->getJson('/api/v1/notifications?status=unread')->assertJsonCount(2, 'data')->json('data.0.id');
    $this->postJson("/api/v1/notifications/$n/read")->assertNoContent();
    $this->postJson("/api/v1/notifications/$n/read")->assertNoContent();
    $this->getJson('/api/v1/my/notifications?status=read')->assertJsonCount(1, 'data')->assertJsonPath('unread_count', 1);
    officeLogin($this, $this->guardian->user)->postJson("/api/v1/notifications/$n/read")->assertNotFound();
    $this->getJson('/api/v1/notifications')->assertJsonPath('unread_count', 2);
    officeLogin($this, $this->student)->postJson('/api/v1/notifications/read-all')->assertNoContent();
    $this->getJson('/api/v1/notifications')->assertJsonPath('unread_count', 0);
});
it('isolates requests documents communications and notifications between institutions', function () {
    $request = officeCreate($this);
    officeReview($this, $request);
    $doc = $this->postJson('/api/v1/academic-documents', ['student_id' => $this->profile->id, 'document_type' => 'CONSTANCIA'])->assertCreated()->json('data.id');
    $comm = officeCommunication($this, [['kind' => 'institution', 'target' => (string) $this->institution->id]]);
    $this->postJson("/api/v1/communications/$comm/publish")->assertOk();
    $notification = $this->getJson('/api/v1/notifications')->json('data.0.id');
    $foreign = Institution::factory()->create();
    $admin = app(InstitutionContext::class)->run($foreign->id, function () {
        (new RolePermissionSeeder)->run();
        $u = User::factory()->create();
        $u->assignRole('ADMINISTRATOR');

        return $u;
    });
    officeLogin($this, $admin);
    foreach (["academic-requests/$request", "academic-requests/$request/history", "academic-documents/$doc", "academic-documents/$doc/download", "communications/$comm"] as $path) {
        $this->getJson('/api/v1/'.$path)->assertNotFound();
    }
    $this->postJson("/api/v1/academic-requests/$request/review")->assertNotFound();
    $this->postJson("/api/v1/notifications/$notification/read")->assertNotFound();
    $this->getJson('/api/v1/notifications')->assertJsonCount(0, 'data');
    $this->postJson('/api/v1/communications', ['title' => 'Cruce', 'body' => 'No', 'targets' => [['kind' => 'user', 'target' => (string) $this->student->id]]])->assertUnprocessable();
});
