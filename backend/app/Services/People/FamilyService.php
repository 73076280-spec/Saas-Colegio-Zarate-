<?php

namespace App\Services\People;

use App\Enums\AuditAction;
use App\Enums\GuardianStatus;
use App\Enums\StudentStatus;
use App\Models\Institution;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Services\InstitutionContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FamilyService
{
    public function __construct(private PeopleAudit $audit) {}

    public function save(Student $student, array $data, Request $request, ?StudentGuardian $link = null, bool $detach = false): ?StudentGuardian
    {
        return DB::transaction(function () use ($student, $data, $request, $link, $detach) {
            Institution::whereKey(app(InstitutionContext::class)->requireId())->lockForUpdate()->firstOrFail();
            $student = Student::lockForUpdate()->findOrFail($student->id);
            if ($link) {
                $link = StudentGuardian::where('student_id', $student->id)->lockForUpdate()->findOrFail($link->id);
            }
            $old = $link?->attributesToArray();
            if ($detach) {
                $link->delete();
                $this->audit->record(AuditAction::UNRELATE, $link, $old, null, $request);

                return null;
            }
            $guardian = Guardian::findOrFail($link?->guardian_id ?? $data['guardian_id']);
            if (! $link && StudentGuardian::where('student_id', $student->id)->where('guardian_id', $guardian->id)->exists()) {
                throw ValidationException::withMessages(['guardian_id' => 'El apoderado ya está asociado al estudiante.']);
            }
            if ((! $link || ($data['is_primary'] ?? false)) && ($student->status !== StudentStatus::ACTIVE || $guardian->status !== GuardianStatus::ACTIVE)) {
                throw ValidationException::withMessages(['guardian_id' => 'Estudiante y apoderado deben estar activos para una nueva relación o principal.']);
            }
            if ($data['is_primary'] ?? false) {
                foreach (StudentGuardian::where('student_id', $student->id)->where('is_primary', true)->when($link, fn ($q) => $q->whereKeyNot($link->id))->get() as $previous) {
                    $before = $previous->attributesToArray();
                    $previous->update(['is_primary' => false]);
                    $this->audit->record(AuditAction::UPDATE, $previous, $before, $previous->attributesToArray(), $request);
                }
            }
            $result = $link ?? new StudentGuardian(['student_id' => $student->id, 'guardian_id' => $guardian->id]);
            $result->fill(array_intersect_key($data, array_flip(['relationship', 'is_primary', 'can_pick_up', 'receives_notifications'])))->save();
            $result->refresh();
            $this->audit->record($link ? AuditAction::UPDATE : AuditAction::RELATE, $result, $old, $result->attributesToArray(), $request);

            return $result;
        }, 3);
    }
}
