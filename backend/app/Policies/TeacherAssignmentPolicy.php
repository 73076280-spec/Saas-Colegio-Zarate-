<?php

namespace App\Policies;

use App\Models\Courses\TeacherAssignment;
use App\Models\User;

class TeacherAssignmentPolicy
{
    public function view(User $u, TeacherAssignment $a): bool
    {
        return (int) $u->institution_id === (int) $a->institution_id && $u->can('teacher-assignments.view');
    }

    public function manage(User $u, TeacherAssignment $a, string $operation): bool
    {
        return (int) $u->institution_id === (int) $a->institution_id && $u->can('teacher-assignments.'.$operation);
    }
}
