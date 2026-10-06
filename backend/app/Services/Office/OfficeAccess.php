<?php

namespace App\Services\Office;

use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Models\Office\Communication;
use App\Models\People\StudentGuardian;
use App\Models\User;
use App\Services\Attendance\AttendanceAccess;
use Illuminate\Database\Eloquent\Builder;

class OfficeAccess
{
    public function staff(User $u, string $permission): bool
    {
        return $u->hasAnyRole(['ADMINISTRATOR', 'SECRETARY']) && $u->can($permission);
    }

    public function students(User $u): array
    {
        $access = app(AttendanceAccess::class);
        $ids = [];
        if ($student = $access->student($u)) {
            $ids[] = $student->id;
        }
        if ($guardian = $access->guardian($u)) {
            $ids = array_merge($ids, StudentGuardian::where('guardian_id', $guardian->id)->whereHas('student')->pluck('student_id')->all());
        }

        return array_values(array_unique($ids));
    }

    public function requests(User $u, bool $personal = false): Builder
    {
        $q = AcademicRequest::query();
        if (! $u->can('requests.view')) {
            return $q->whereRaw('1=0');
        }

        return ! $personal && $this->staff($u, 'requests.view') ? $q : $q->whereIn('student_id', $this->students($u));
    }

    public function documents(User $u): Builder
    {
        $q = AcademicDocument::query();
        if (! $u->can('documents.view')) {
            return $q->whereRaw('1=0');
        }

        return $this->staff($u, 'documents.view') ? $q : $q->where('status', 'ISSUED')->whereIn('student_id', $this->students($u));
    }

    public function communications(User $u): Builder
    {
        $q = Communication::query();
        if (! $u->can('communications.view')) {
            return $q->whereRaw('1=0');
        }
        if ($this->staff($u, 'communications.view')) {
            return $q;
        }

        return $q->where('status', 'PUBLISHED')->whereIn('id', $u->notifications()->where('data->kind', 'communication')->selectRaw("JSON_UNQUOTE(JSON_EXTRACT(data, '$.entity_id'))"));
    }
}
