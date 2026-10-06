<?php

use App\Models\Attendance\AbsenceJustification;
use App\Models\Attendance\AttendanceRecord;
use App\Models\AuditLog;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\Institution;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Models\User;
use App\Services\Attendance\AttendanceAudit;
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
    [$this->course,$this->teacher,$this->student,$this->enrollment,$this->guardian,$this->secretary] = app(InstitutionContext::class)->run($this->institution->id, function () {
        (new RolePermissionSeeder)->run();
        $c = Course::factory()->create(['status' => 'ACTIVE']);
        $e = Enrollment::where('section_id', $c->section_id)->firstOrFail();
        $e->update(['status' => 'APPROVED']);
        $g = Guardian::factory()->create()->load('user');
        StudentGuardian::create(['student_id' => $e->student_id, 'guardian_id' => $g->id, 'relationship' => 'MOTHER', 'is_primary' => true]);
        $u = User::factory()->create();
        $u->assignRole('SECRETARY');

        return [$c, $c->teacher->user, $e->student->user, $e, $g, $u];
    });
    $this->base = "/api/v1/courses/{$this->course->id}/attendance-sessions";
    $this->withHeaders(['Origin' => 'http://localhost:5173', 'Accept' => 'application/json'])->actingAs($this->teacher, 'web');
});
afterEach(fn () => app(InstitutionContext::class)->set(null));
function attendanceLogin($t, User $u)
{
    Auth::forgetGuards();
    app('session')->flush();

    return $t->actingAs($u, 'web');
}
function attendanceSession($t): int
{
    return $t->postJson($t->base, ['date' => '2026-10-05', 'topic' => 'Sesión ficticia'])->assertCreated()->json('data.id');
}
function attendanceAbsent($t): array
{
    $s = attendanceSession($t);
    $r = $t->postJson("/api/v1/attendance-sessions/$s/records", ['records' => [['student_id' => $t->enrollment->student_id, 'status' => 'ABSENT']]])->assertOk()->json('data.0.id');

    return [$s, $r];
}
function attendanceJustify($t, int $r): int
{
    attendanceLogin($t, $t->guardian->user);

    return $t->postJson("/api/v1/attendance-records/$r/justifications", ['reason' => 'Motivo ficticio'])->assertCreated()->json('data.id');
}
it('allows assigned teachers to manage unique sessions and preserves closure', function () {
    $s = attendanceSession($this);
    $this->postJson($this->base, ['date' => '2026-10-05'])->assertUnprocessable();
    $this->patchJson("/api/v1/attendance-sessions/$s", ['topic' => 'Actualizado'])->assertOk();
    $this->postJson("/api/v1/attendance-sessions/$s/close")->assertOk();
    $this->patchJson("/api/v1/attendance-sessions/$s", ['topic' => 'No'])->assertUnprocessable();
    $this->postJson("/api/v1/attendance-sessions/$s/records", ['records' => [['student_id' => $this->enrollment->student_id, 'status' => 'PRESENT']]])->assertUnprocessable();
    app(InstitutionContext::class)->run($this->institution->id, function () use ($s) {
        expect(AuditLog::where('entity_type', 'attendance_sessions')->where('entity_id', $s)->orderBy('id')->pluck('action')->map(fn ($a) => $a->value)->all())->toBe(['CREATE', 'UPDATE', 'CLOSE']);
        $this->course->update(['status' => 'CLOSED']);
    });
    $this->postJson($this->base, ['date' => '2026-10-06'])->assertUnprocessable();
});
it('blocks other teachers from creating reading and writing course attendance', function () {
    $s = attendanceSession($this);
    $u = app(InstitutionContext::class)->run($this->institution->id, fn () => Course::factory()->create()->teacher->user);
    attendanceLogin($this, $u)->postJson($this->base, ['date' => '2026-10-06'])->assertForbidden();
    $this->getJson("/api/v1/attendance-sessions/$s")->assertNotFound();
    $this->getJson("/api/v1/attendance-sessions/$s/records")->assertNotFound();
    $this->postJson("/api/v1/attendance-sessions/$s/records", ['records' => [['student_id' => $this->enrollment->student_id, 'status' => 'PRESENT']]])->assertForbidden();
});
it('records attendance atomically only for approved roster students', function () {
    [$s,$r] = attendanceAbsent($this);
    $other = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create());
    $this->postJson("/api/v1/attendance-sessions/$s/records", ['records' => [['student_id' => $this->enrollment->student_id, 'status' => 'PRESENT'], ['student_id' => $other->id, 'status' => 'LATE']]])->assertUnprocessable();
    $this->getJson("/api/v1/attendance-sessions/$s/records")->assertJsonPath('data.0.record.status', 'ABSENT');
    $this->patchJson("/api/v1/attendance-records/$r", ['status' => 'JUSTIFIED'])->assertUnprocessable();
    $this->patchJson("/api/v1/attendance-records/$r", ['status' => 'LATE', 'observations' => 'Tardanza'])->assertOk();
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->enrollment->update(['status' => 'OBSERVED']));
    $this->patchJson("/api/v1/attendance-records/$r", ['status' => 'PRESENT'])->assertUnprocessable();
    $this->getJson("/api/v1/attendance-sessions/$s/records")->assertJsonPath('data.0.can_record', false);
});
it('rejects duplicated bulk students and upserts without duplicate records', function () {
    [$s,$r] = attendanceAbsent($this);
    $row = ['student_id' => $this->enrollment->student_id, 'status' => 'PRESENT'];
    $this->postJson("/api/v1/attendance-sessions/$s/records", ['records' => [$row, $row]])->assertUnprocessable();
    $this->postJson("/api/v1/attendance-sessions/$s/records", ['records' => [$row]])->assertOk()->assertJsonPath('data.0.id', $r);
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(AttendanceRecord::where('attendance_session_id', $s)->count())->toBe(1));
});
it('lets linked guardians submit one safe private justification with history', function () {
    [$s,$r] = attendanceAbsent($this);
    attendanceLogin($this, $this->guardian->user);
    $this->post("/api/v1/attendance-records/$r/justifications", ['reason' => 'Ficticio', 'file' => UploadedFile::fake()->createWithContent('bad.php', '<?php exit;')])->assertUnprocessable();
    $j = $this->post("/api/v1/attendance-records/$r/justifications", ['reason' => 'Privado ficticio', 'file' => UploadedFile::fake()->createWithContent('constancia.txt', 'Constancia ficticia')])->assertCreated()->assertJsonMissingPath('data.file_path')->json('data.id');
    $this->get("/api/v1/absence-justifications/$j/download")->assertOk()->assertDownload('constancia.txt');
    $this->getJson("/api/v1/absence-justifications/$j/history")->assertJsonCount(1, 'data')->assertJsonPath('data.0.new_status', 'PENDING');
    $this->postJson("/api/v1/attendance-records/$r/justifications", ['reason' => 'Duplicada'])->assertUnprocessable();
    $this->postJson("/api/v1/absence-justifications/$j/review")->assertForbidden();
    attendanceLogin($this, $this->teacher)->patchJson("/api/v1/attendance-records/$r", ['status' => 'PRESENT'])->assertUnprocessable();
    $this->get("/api/v1/absence-justifications/$j/download")->assertNotFound();
    app(InstitutionContext::class)->run($this->institution->id, fn () => expect(AuditLog::where('entity_type', 'absence_justifications')->where('entity_id', $j)->first()->new_values)->not->toHaveKey('reason'));
});
it('denies unrelated guardians private records justification history and files', function () {
    [$s,$r] = attendanceAbsent($this);
    $j = attendanceJustify($this, $r);
    $g = app(InstitutionContext::class)->run($this->institution->id, fn () => Guardian::factory()->create()->load('user'));
    attendanceLogin($this, $g->user)->postJson("/api/v1/attendance-records/$r/justifications", ['reason' => 'No'])->assertForbidden();
    $this->getJson("/api/v1/guardians/{$this->guardian->id}/students/{$this->enrollment->student_id}/attendance")->assertNotFound();
    foreach (['', '/history', '/download'] as $suffix) {
        $this->getJson("/api/v1/absence-justifications/$j$suffix")->assertNotFound();
    }
    $this->getJson('/api/v1/absence-justifications')->assertJsonCount(0, 'data');
});
it('approves after review atomically including closed sessions and audit rollback', function () {
    [$s,$r] = attendanceAbsent($this);
    $this->postJson("/api/v1/attendance-sessions/$s/close")->assertOk();
    $j = attendanceJustify($this, $r);
    attendanceLogin($this, $this->secretary);
    $this->postJson("/api/v1/absence-justifications/$j/approve")->assertUnprocessable();
    $this->postJson("/api/v1/absence-justifications/$j/review")->assertOk();
    $audit = app(AttendanceAudit::class);
    $this->mock(AttendanceAudit::class)->shouldReceive('record')->andThrow(new RuntimeException('Audit unavailable'));
    $this->postJson("/api/v1/absence-justifications/$j/approve")->assertStatus(500);
    app(InstitutionContext::class)->run($this->institution->id, function () use ($j, $r) {
        expect(AttendanceRecord::findOrFail($r)->status)->toBe('ABSENT');
        expect(AbsenceJustification::findOrFail($j)->status)->toBe('IN_REVIEW');
        expect(AbsenceJustification::findOrFail($j)->history()->count())->toBe(2);
    });
    $this->instance(AttendanceAudit::class, $audit);
    $this->postJson("/api/v1/absence-justifications/$j/approve", ['review_comment' => 'Validada'])->assertOk();
    $this->postJson("/api/v1/absence-justifications/$j/reject", ['review_comment' => 'No'])->assertUnprocessable();
    attendanceLogin($this, $this->student)->getJson('/api/v1/my/attendance')->assertJsonPath('data.0.status', 'JUSTIFIED');
    attendanceLogin($this, $this->guardian->user)->getJson("/api/v1/absence-justifications/$j/history")->assertJsonCount(3, 'data')->assertJsonPath('data.2.new_status', 'APPROVED');
});
it('requires rejection reasons and keeps rejected absences unchanged', function () {
    [$s,$r] = attendanceAbsent($this);
    $j = attendanceJustify($this, $r);
    attendanceLogin($this, $this->secretary)->postJson("/api/v1/absence-justifications/$j/review")->assertOk();
    $this->postJson("/api/v1/absence-justifications/$j/reject")->assertUnprocessable();
    $this->postJson("/api/v1/absence-justifications/$j/reject", ['review_comment' => 'Sustento insuficiente'])->assertOk()->assertJsonPath('data.status', 'REJECTED');
    attendanceLogin($this, $this->student)->getJson('/api/v1/my/attendance')->assertJsonPath('data.0.status', 'ABSENT');
});
it('exposes only personal historical attendance to students and denies writes', function () {
    [$s,$r] = attendanceAbsent($this);
    attendanceLogin($this, $this->student)->getJson('/api/v1/my/attendance')->assertJsonCount(1, 'data');
    $this->getJson("/api/v1/attendance-sessions/$s/records")->assertNotFound();
    $this->patchJson("/api/v1/attendance-records/$r", ['status' => 'PRESENT'])->assertForbidden();
    $this->postJson("/api/v1/attendance-records/$r/justifications", ['reason' => 'No'])->assertForbidden();
    $u = app(InstitutionContext::class)->run($this->institution->id, fn () => Student::factory()->create()->load('user')->user);
    attendanceLogin($this, $u)->getJson('/api/v1/my/attendance')->assertJsonCount(0, 'data');
    app(InstitutionContext::class)->run($this->institution->id, fn () => $this->enrollment->update(['status' => 'CANCELLED']));
    attendanceLogin($this, $this->student)->getJson('/api/v1/my/attendance')->assertJsonCount(1, 'data');
});
it('isolates all attendance and justification references between institutions', function () {
    [$s,$r] = attendanceAbsent($this);
    $j = attendanceJustify($this, $r);
    $foreign = Institution::factory()->create();
    $u = app(InstitutionContext::class)->run($foreign->id, function () {
        (new RolePermissionSeeder)->run();
        $u = User::factory()->create();
        $u->assignRole('ADMINISTRATOR');

        return $u;
    });
    attendanceLogin($this, $u)->getJson("/api/v1/attendance-sessions/$s")->assertNotFound();
    $this->patchJson("/api/v1/attendance-records/$r", ['status' => 'PRESENT'])->assertNotFound();
    $this->getJson("/api/v1/absence-justifications/$j")->assertNotFound();
    $this->postJson("/api/v1/absence-justifications/$j/review")->assertNotFound();
    $this->getJson('/api/v1/absence-justifications')->assertJsonCount(0, 'data');
    $this->postJson($this->base, ['date' => '2026-10-07'])->assertNotFound();
});
