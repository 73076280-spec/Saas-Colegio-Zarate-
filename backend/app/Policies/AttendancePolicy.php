<?php

namespace App\Policies;

use App\Models\Attendance\AbsenceJustification;
use App\Models\Attendance\AttendanceRecord;
use App\Models\Attendance\AttendanceSession;
use App\Models\Courses\Course;
use App\Models\User;
use App\Services\Attendance\AttendanceAccess;

class AttendancePolicy
{
    public function __construct(private AttendanceAccess $access) {}

    public function create(User $user, Course $course): bool
    {
        return $this->access->manage($user, $course, 'create');
    }

    public function view(User $user, AttendanceSession|AttendanceRecord|AbsenceJustification $record): bool
    {
        return match (true) {
            $record instanceof AttendanceSession => $this->access->manage($user, $record->course, 'view'),
            $record instanceof AttendanceRecord => $this->access->viewRecord($user, $record),
            default => $this->access->justifications($user)->whereKey($record->id)->exists(),
        };
    }

    public function update(User $user, AttendanceSession|AttendanceRecord $record): bool
    {
        return $this->access->manage($user, $record instanceof AttendanceSession ? $record->course : $record->session->course, 'update');
    }

    public function close(User $user, AttendanceSession $record): bool
    {
        return $this->access->manage($user, $record->course, 'close');
    }

    public function justify(User $user, AttendanceRecord $record): bool
    {
        return $user->can('justifications.create') && $this->access->linked($user, $record->student_id);
    }

    public function review(User $user, AbsenceJustification $record): bool
    {
        return $this->access->review($user, 'review') && $this->view($user, $record);
    }

    public function approve(User $user, AbsenceJustification $record): bool
    {
        return $this->access->review($user, 'approve') && $this->view($user, $record);
    }

    public function reject(User $user, AbsenceJustification $record): bool
    {
        return $this->access->review($user, 'reject') && $this->view($user, $record);
    }
}
