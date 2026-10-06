<?php

namespace App\Policies;

use App\Models\Classroom\ClassroomRecord;
use App\Models\Classroom\CourseUnit;
use App\Models\Courses\Course;
use App\Models\User;
use App\Services\Classroom\ClassroomAccess;

class ClassroomPolicy
{
    public function __construct(private ClassroomAccess $access) {}

    public function view(User $user, ClassroomRecord $record): bool
    {
        return $this->access->view($user, $record);
    }

    public function create(User $user, Course $course, string $kind): bool
    {
        return $this->access->allowed($user, $course, $kind, 'create');
    }

    public function update(User $user, ClassroomRecord $record): bool
    {
        return $this->manage($user, $record, 'update');
    }

    public function publish(User $user, ClassroomRecord $record): bool
    {
        return $this->manage($user, $record, 'publish');
    }

    public function archive(User $user, ClassroomRecord $record): bool
    {
        return $this->manage($user, $record, 'archive');
    }

    private function manage(User $user, ClassroomRecord $record, string $operation): bool
    {
        return $record->course && $this->access->allowed($user, $record->course, $record instanceof CourseUnit ? 'course-units' : 'materials', $operation);
    }
}
