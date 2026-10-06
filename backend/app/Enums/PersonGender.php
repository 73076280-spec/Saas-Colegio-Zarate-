<?php

namespace App\Enums;

enum PersonGender: string
{
    case FEMALE = 'FEMALE';
    case MALE = 'MALE';
    case OTHER = 'OTHER';
    case NOT_SPECIFIED = 'NOT_SPECIFIED';
}
