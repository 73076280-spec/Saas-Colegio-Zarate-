<?php

namespace App\Enums;

enum TeacherStatus: string
{
    case ACTIVE = 'ACTIVE';
    case INACTIVE = 'INACTIVE';
    case ON_LEAVE = 'ON_LEAVE';
}
