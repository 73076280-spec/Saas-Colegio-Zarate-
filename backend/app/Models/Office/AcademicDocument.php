<?php

namespace App\Models\Office;

use App\Models\People\Student;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicDocument extends OfficeRecord
{
    protected function casts(): array
    {
        return ['issued_at' => 'datetime'];
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(AcademicRequest::class, 'academic_request_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class)->withTrashed();
    }
}
