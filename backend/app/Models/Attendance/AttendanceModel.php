<?php

namespace App\Models\Attendance;

use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Model;

abstract class AttendanceModel extends Model
{
    use BelongsToInstitution;

    protected $guarded = ['id', 'institution_id'];

    protected $hidden = ['file_path'];

    protected static function booted(): void
    {
        static::deleting(fn () => throw new \LogicException('Attendance history must be preserved.'));
    }
}
