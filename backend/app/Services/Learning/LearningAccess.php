<?php

namespace App\Services\Learning;

use App\Models\Courses\Course;
use App\Models\Learning\Assessment;
use App\Models\Learning\Assignment;
use App\Models\Learning\LearningRecord;
use App\Models\Learning\Score;
use App\Models\Learning\Submission;
use App\Models\People\Student;
use App\Models\User;
use App\Services\Classroom\ClassroomAccess;
use App\Services\Courses\CourseAccess;
use Illuminate\Database\Eloquent\Builder;

class LearningAccess
{
    public function __construct(private ClassroomAccess $classroom) {}

    public function studentId(User $user): ?int
    {
        return $user->hasRole('STUDENT') ? Student::where('user_id', $user->id)->where('status', 'ACTIVE')->value('id') : null;
    }

    public function kind(LearningRecord $record): string
    {
        return match (true) {
            $record instanceof Assignment => 'assignments', $record instanceof Assessment => 'assessments', $record instanceof Submission => 'submissions', default => 'scores'
        };
    }

    public function course(LearningRecord $record): ?Course
    {
        return match (true) {
            $record instanceof Submission => $record->assignment?->course,
            $record instanceof Score => $record->assessment?->course,
            default => $record->course,
        };
    }

    public function manage(User $user, Course $course, string $kind, string $action): bool
    {
        return $this->classroom->allowed($user, $course, $kind, $action);
    }

    public function visible(User $user, string $kind, bool $personal = false): Builder
    {
        $class = match ($kind) {
            'assignments' => Assignment::class, 'assessments' => Assessment::class, 'submissions' => Submission::class, 'scores' => Score::class
        };
        $query = $class::query();
        if (! $user->can("$kind.view")) {
            return $query->whereRaw('1 = 0');
        }

        return $query->where(function ($q) use ($user, $kind, $personal) {
            $q->whereRaw('1 = 0');
            $relation = match ($kind) {
                'submissions' => 'assignment.course', 'scores' => 'assessment.course', default => 'course'
            };
            if (! $personal && ($user->hasRole('ADMINISTRATOR') || $user->hasRole('TEACHER'))) {
                $q->orWhereHas($relation, function ($course) use ($user) {
                    if (! $user->hasRole('ADMINISTRATOR')) {
                        $course->whereHas('teacher', fn ($t) => $t->where('user_id', $user->id)->where('status', 'ACTIVE'))
                            ->whereHas('assignment', fn ($a) => $a->where('status', 'ACTIVE'));
                    }
                });
            }
            if ($student = $this->studentId($user)) {
                $q->orWhere(function ($own) use ($relation, $student, $kind) {
                    $own->whereHas($relation, fn ($c) => app(CourseAccess::class)->studentQuery($c, $student));
                    if (in_array($kind, ['submissions', 'scores'])) {
                        $own->where('student_id', $student);
                        if ($kind === 'scores') {
                            $own->whereHas('assessment', fn ($a) => $a->where('status', 'PUBLISHED'));
                        }
                    } else {
                        $own->where('status', 'PUBLISHED');
                    }
                });
            }
        });
    }

    public function view(User $user, LearningRecord $record): bool
    {
        return $this->visible($user, $this->kind($record))->whereKey($record->id)->exists();
    }

    public function submit(User $user, Assignment $assignment): bool
    {
        return $user->can('submissions.view') && $this->studentId($user) &&
            $assignment->status === 'PUBLISHED' && $this->classroom->student($user, $assignment->course);
    }
}
