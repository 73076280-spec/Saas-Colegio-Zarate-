<?php

namespace App\Enums;

enum EnrollmentStatus: string
{
    case DRAFT = 'DRAFT';
    case PENDING = 'PENDING';
    case OBSERVED = 'OBSERVED';
    case APPROVED = 'APPROVED';
    case REJECTED = 'REJECTED';
    case CANCELLED = 'CANCELLED';
}
