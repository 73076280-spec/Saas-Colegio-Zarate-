<?php

namespace App\Policies;

use App\Models\Courses\Course;
use App\Models\Learning\Assignment;
use App\Models\Learning\LearningRecord;
use App\Models\Learning\Submission;
use App\Models\User;
use App\Services\Learning\LearningAccess;

class LearningPolicy
{
    public function __construct(private LearningAccess $access) {}

    public function view(User $u, LearningRecord $r): bool
    {
        return $this->access->view($u, $r);
    }

    public function create(User $u, Course $c, string $kind): bool
    {
        return $this->access->manage($u, $c, $kind, 'create');
    }

    public function update(User $u, LearningRecord $r): bool
    {
        if ($r instanceof Submission) {
            return $r->student_id === $this->access->studentId($u) && $this->access->submit($u, $r->assignment);
        }

        return $this->manage($u, $r, 'update');
    }

    public function publish(User $u, LearningRecord $r): bool
    {
        return $this->manage($u, $r, 'publish');
    }

    public function close(User $u, LearningRecord $r): bool
    {
        return $this->manage($u, $r, 'close');
    }

    public function review(User $u, Submission $r): bool
    {
        return $this->manage($u, $r, 'review');
    }

    public function submit(User $u, Assignment $r): bool
    {
        return $this->access->submit($u, $r);
    }

    private function manage(User $u, LearningRecord $r, string $op): bool
    {
        $course = $this->access->course($r);

        return $course && $this->access->manage($u, $course, $this->access->kind($r), $op);
    }
}
