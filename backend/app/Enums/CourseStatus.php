<?php

namespace App\Enums;

enum CourseStatus: string
{
    case DRAFT = 'DRAFT';
    case ACTIVE = 'ACTIVE';
    case INACTIVE = 'INACTIVE';
    case CLOSED = 'CLOSED';
}
