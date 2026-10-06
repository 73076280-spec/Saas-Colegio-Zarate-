<?php

namespace App\Enums;

enum AcademicYearStatus: string
{
    case DRAFT = 'DRAFT';
    case ACTIVE = 'ACTIVE';
    case CLOSED = 'CLOSED';
}
