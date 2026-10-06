<?php

namespace App\Models\Attendance;

use App\Models\People\Guardian;
use App\Models\People\Student;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AbsenceJustification extends AttendanceModel
{
    protected function casts(): array
    {
        return ['reviewed_at' => 'datetime'];
    }

    public function record(): BelongsTo
    {
        return $this->belongsTo(AttendanceRecord::class, 'attendance_record_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class)->withTrashed();
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Guardian::class);
    }

    public function history(): HasMany
    {
        return $this->hasMany(JustificationStatusHistory::class)->orderBy('id');
    }
}
