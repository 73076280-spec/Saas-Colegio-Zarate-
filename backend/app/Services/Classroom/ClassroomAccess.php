<?php

namespace App\Services\Classroom;

use App\Models\Classroom\ClassroomRecord;
use App\Models\Classroom\CourseUnit;
use App\Models\Courses\Course;
use App\Models\People\Student;
use App\Models\User;
use App\Services\Courses\CourseAccess;
use App\Services\InstitutionContext;
use Illuminate\Database\Eloquent\Builder;

class ClassroomAccess
{
    public function staff(User $user, Course $course): bool
    {
        if ($course->institution_id !== app(InstitutionContext::class)->requireId()) {
            return false;
        }

        return $user->hasRole('ADMINISTRATOR') || (
            $user->hasRole('TEACHER') &&
            $course->teacher()->where('user_id', $user->id)->where('status', 'ACTIVE')->exists() &&
            $course->assignment()->where('status', 'ACTIVE')->exists()
        );
    }

    public function allowed(User $user, Course $course, string $kind, string $operation): bool
    {
        return $user->can("$kind.$operation") && $this->staff($user, $course);
    }

    public function student(User $user, Course $course): bool
    {
        if (! $user->hasRole('STUDENT')) {
            return false;
        }
        $student = Student::where('user_id', $user->id)->where('status', 'ACTIVE')->first();

        return $student && app(CourseAccess::class)->studentQuery(Course::whereKey($course->id), $student->id)->exists();
    }

    public function browse(User $user, Course $course, string $kind): bool
    {
        return $user->can("$kind.view") && ($this->staff($user, $course) || $this->student($user, $course));
    }

    public function visible(Builder $query, User $user, Course $course, string $kind): Builder
    {
        if (! $this->allowed($user, $course, $kind, 'view')) {
            $query->where('status', 'PUBLISHED');
            if ($kind === 'materials') {
                $query->where(fn ($q) => $q->whereNull('course_unit_id')->orWhereHas('unit', fn ($u) => $u->where('status', 'PUBLISHED')));
            }
        }

        return $query;
    }

    public function view(User $user, ClassroomRecord $record): bool
    {
        $kind = $record instanceof CourseUnit ? 'course-units' : 'materials';
        $course = $record->course;

        return $course && $this->browse($user, $course, $kind) &&
            $this->visible($record->newQuery()->whereKey($record->id), $user, $course, $kind)->exists();
    }
}
