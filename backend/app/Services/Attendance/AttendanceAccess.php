<?php

namespace App\Services\Attendance;

use App\Models\Attendance\AbsenceJustification;
use App\Models\Attendance\AttendanceRecord;
use App\Models\Courses\Course;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Models\User;
use App\Services\Classroom\ClassroomAccess;
use Illuminate\Database\Eloquent\Builder;

class AttendanceAccess
{
    public function manage(User $user, Course $course, string $action): bool
    {
        return app(ClassroomAccess::class)->allowed($user, $course, 'attendance', $action);
    }

    public function student(User $user): ?Student
    {
        return $user->hasRole('STUDENT') ? Student::where('user_id', $user->id)->where('status', 'ACTIVE')->first() : null;
    }

    public function guardian(User $user): ?Guardian
    {
        return $user->hasRole('GUARDIAN') ? Guardian::where('user_id', $user->id)->where('status', 'ACTIVE')->first() : null;
    }

    public function linked(User $user, int $student): bool
    {
        $guardian = $this->guardian($user);

        return $guardian && StudentGuardian::where('guardian_id', $guardian->id)->where('student_id', $student)->whereHas('student')->exists();
    }

    public function review(User $user, string $action = 'view'): bool
    {
        return $user->hasAnyRole(['ADMINISTRATOR', 'SECRETARY']) && $user->can("justifications.$action");
    }

    public function viewRecord(User $user, AttendanceRecord $record): bool
    {
        return $user->can('attendance.view') && ($this->manage($user, $record->session->course, 'view') ||
            $this->review($user) || $this->student($user)?->id === $record->student_id || $this->linked($user, $record->student_id));
    }

    public function justifications(User $user): Builder
    {
        $query = AbsenceJustification::query();
        if (! $user->can('justifications.view')) {
            return $query->whereRaw('1=0');
        }
        if ($this->review($user)) {
            return $query;
        }
        $guardian = $this->guardian($user);

        return $guardian ? $query->whereIn('student_id', StudentGuardian::where('guardian_id', $guardian->id)->whereHas('student')->select('student_id')) : $query->whereRaw('1=0');
    }
}
