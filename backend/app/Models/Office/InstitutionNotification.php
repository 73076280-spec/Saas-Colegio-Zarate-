<?php

namespace App\Models\Office;

use App\Models\Concerns\BelongsToInstitution;
use Illuminate\Notifications\DatabaseNotification;

class InstitutionNotification extends DatabaseNotification
{
    use BelongsToInstitution;

    protected $table = 'notifications';
}
