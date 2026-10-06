<?php

namespace App\Models\Attendance;

use App\Models\People\Student;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AttendanceRecord extends AttendanceModel
{
    public function session(): BelongsTo
    {
        return $this->belongsTo(AttendanceSession::class, 'attendance_session_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class)->withTrashed();
    }

    public function justification(): HasOne
    {
        return $this->hasOne(AbsenceJustification::class);
    }
}
