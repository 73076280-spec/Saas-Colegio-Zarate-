<?php

namespace App\Policies;

use App\Models\Courses\Course;
use App\Models\User;
use App\Services\Courses\CourseAccess;

class CoursePolicy
{
    public function view(User $u, Course $c): bool
    {
        return app(CourseAccess::class)->visible($u)->whereKey($c->id)->exists();
    }

    public function manage(User $u, Course $c, string $operation): bool
    {
        return (int) $u->institution_id === (int) $c->institution_id && $u->can('courses.'.$operation);
    }

    public function roster(User $u, Course $c): bool
    {
        return $this->view($u, $c) && ($u->can('courses.view') || $c->teacher()->where('user_id', $u->id)->where('status', 'ACTIVE')->exists());
    }
}
