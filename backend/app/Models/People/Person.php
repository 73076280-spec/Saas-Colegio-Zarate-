<?php

namespace App\Models\People;

use App\Models\Concerns\BelongsToInstitution;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class Person extends Model
{
    use BelongsToInstitution,HasFactory,SoftDeletes;

    protected $guarded = ['id', 'institution_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::saving(function (self $person) {
            if ($person->exists && $person->isDirty('user_id')) {
                throw new \LogicException('Person account cannot be reassigned.');
            }
            if (! $person->user()->exists()) {
                throw new \LogicException('Account must belong to the same institution.');
            }
        });
    }
}
