<?php

namespace App\Models\Office;

use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Model;

abstract class OfficeRecord extends Model
{
    use BelongsToInstitution;

    protected $guarded = ['id', 'institution_id'];

    protected $hidden = ['file_path'];

    protected static function booted(): void
    {
        static::deleting(fn () => throw new \LogicException('Institutional history must be preserved.'));
    }
}
