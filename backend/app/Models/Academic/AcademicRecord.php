<?php

namespace App\Models\Academic;

use Illuminate\Database\Eloquent\Model;

abstract class AcademicRecord extends Model
{
    protected $guarded = ['id', 'institution_id', 'current_institution_id'];

    protected $hidden = ['current_institution_id'];

    abstract public function ownerInstitutionId(): int;
}
