<?php

namespace App\Enums;

enum RoleName: string
{
    case ADMINISTRATOR = 'ADMINISTRATOR';
    case SECRETARY = 'SECRETARY';
    case TREASURY = 'TREASURY';
    case TEACHER = 'TEACHER';
    case STUDENT = 'STUDENT';
    case GUARDIAN = 'GUARDIAN';
}
