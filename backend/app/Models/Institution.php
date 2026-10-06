<?php

namespace App\Models;

use App\Enums\InstitutionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'legal_name', 'code', 'tax_id', 'email', 'phone', 'address', 'logo_path', 'status'];

    protected function casts(): array
    {
        return ['status' => InstitutionStatus::class];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
