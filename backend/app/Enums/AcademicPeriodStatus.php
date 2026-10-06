<?php

namespace App\Enums;

enum AcademicPeriodStatus: string
{
    case DRAFT = 'DRAFT';
    case ACTIVE = 'ACTIVE';
    case CLOSED = 'CLOSED';
}
