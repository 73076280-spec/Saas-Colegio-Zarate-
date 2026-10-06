<?php

namespace App\Enums;

enum FamilyRelationship: string
{
    case FATHER = 'FATHER';
    case MOTHER = 'MOTHER';
    case GUARDIAN = 'GUARDIAN';
    case GRANDPARENT = 'GRANDPARENT';
    case OTHER = 'OTHER';
}
