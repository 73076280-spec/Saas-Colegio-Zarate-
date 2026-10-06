<?php

namespace App\Models\Enrollment;

use App\Models\Concerns\BelongsToInstitution;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnrollmentStatusHistory extends Model
{
    use BelongsToInstitution;

    protected $table = 'enrollment_status_history';

    public $timestamps = false;

    protected $guarded = ['id', 'institution_id'];

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    protected static function booted(): void
    {
        static::creating(function (self $h) {
            if (! $h->enrollment()->exists() || ! $h->actor()->exists()) {
                throw new \LogicException('Invalid institutional history.');
            }
        });
        static::updating(fn () => throw new \LogicException('History is immutable.'));
        static::deleting(fn () => throw new \LogicException('History is immutable.'));
    }
}
