<?php

namespace App\Models;

use App\Enums\UserStatus;
use App\Models\Concerns\BelongsToInstitution;
use App\Models\Office\InstitutionNotification;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\Teacher;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use BelongsToInstitution, HasApiTokens, HasFactory, HasRoles, Notifiable, SoftDeletes;

    public function notifications(): MorphMany
    {
        return $this->morphMany(InstitutionNotification::class, 'notifiable')->latest();
    }

    protected $fillable = ['first_name', 'last_name', 'email', 'password', 'phone', 'status', 'must_change_password'];

    protected $hidden = ['password', 'remember_token'];

    protected $guard_name = 'web';

    protected function casts(): array
    {
        return ['status' => UserStatus::class, 'password' => 'hashed', 'must_change_password' => 'boolean',
            'email_verified_at' => 'datetime', 'last_login_at' => 'datetime'];
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function teacher(): HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    public function guardian(): HasOne
    {
        return $this->hasOne(Guardian::class);
    }

    public function getNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }
}
