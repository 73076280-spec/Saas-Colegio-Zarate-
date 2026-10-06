<?php

namespace App\Policies;

use App\Models\Enrollment\Enrollment;
use App\Models\People\Student;
use App\Models\User;

class EnrollmentPolicy
{
    public function view(User $user, Enrollment $enrollment): bool
    {
        return (int) $user->institution_id === (int) $enrollment->institution_id && ($user->can('enrollments.view') || self::owns($user, $enrollment->student_id));
    }

    public static function owns(User $user, int $student): bool
    {
        return Student::whereKey($student)->where(function ($q) use ($user) {
            $q->where('user_id', $user->id)->orWhereHas('guardians', fn ($g) => $g->where('user_id', $user->id));
        })->exists();
    }

    public function update(User $u, Enrollment $e): bool
    {
        return $u->institution_id === $e->institution_id && $u->can('enrollments.update');
    }
}
