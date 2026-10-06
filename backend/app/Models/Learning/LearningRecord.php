<?php

namespace App\Models\Learning;

use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Database\Eloquent\Model;

abstract class LearningRecord extends Model
{
    use BelongsToInstitution;

    protected $guarded = ['id', 'institution_id'];

    protected $hidden = ['file_path', 'deleted_at'];

    protected static function booted(): void
    {
        static::deleting(fn () => throw new \LogicException('Academic history must be preserved.'));
    }
}
