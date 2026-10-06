<?php

namespace App\Enums;

enum StudentStatus: string
{
    case ACTIVE = 'ACTIVE';
    case INACTIVE = 'INACTIVE';
    case GRADUATED = 'GRADUATED';
    case WITHDRAWN = 'WITHDRAWN';
}
