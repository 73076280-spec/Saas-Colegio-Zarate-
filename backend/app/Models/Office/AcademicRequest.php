<?php

namespace App\Models\Office;

use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademicRequest extends OfficeRecord
{
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class)->withTrashed();
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Guardian::class)->withTrashed();
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(RequestType::class, 'request_type_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to')->withTrashed();
    }

    public function history(): HasMany
    {
        return $this->hasMany(RequestStatusHistory::class)->orderBy('id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(AcademicDocument::class);
    }
}
