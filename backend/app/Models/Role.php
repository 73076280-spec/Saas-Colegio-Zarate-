<?php

namespace App\Models;

use App\Models\Concerns\BelongsToInstitution;

class Role extends \Spatie\Permission\Models\Role
{
    use BelongsToInstitution;
}
