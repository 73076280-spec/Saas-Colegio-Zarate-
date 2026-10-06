<?php

namespace App\Services\Courses;

use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class CourseAccess
{
    public function studentQuery(Builder $query, int $studentId): Builder
    {
        return $query->where('courses.status', 'ACTIVE')->whereHas('assignment', fn ($a) => $a->where('status', 'ACTIVE'))->whereExists(function ($q) use ($studentId) {
            $q->selectRaw('1')->from('enrollments')->whereColumn('enrollments.institution_id', 'courses.institution_id')->whereColumn('enrollments.academic_year_id', 'courses.academic_year_id')->whereColumn('enrollments.grade_level_id', 'courses.grade_level_id')->whereColumn('enrollments.section_id', 'courses.section_id')->where('enrollments.student_id', $studentId)->where('enrollments.status', 'APPROVED')->whereNull('enrollments.deleted_at');
        });
    }

    public function visible(User $user, bool $personal = false): Builder
    {
        $q = Course::query();
        if (! $personal && $user->can('courses.view')) {
            return $q;
        }

        return $q->where(function ($q) use ($user) {
            $q->whereHas('teacher', fn ($t) => $t->where('user_id', $user->id)->where('status', 'ACTIVE'))->whereHas('assignment', fn ($a) => $a->where('status', 'ACTIVE'));
            $student = Student::where('user_id', $user->id)->where('status', 'ACTIVE')->first();
            if ($student) {
                $q->orWhere(fn ($q) => $this->studentQuery($q, $student->id));
            }
        });
    }

    public function roster(Course $course): Builder
    {
        return Enrollment::where('academic_year_id', $course->academic_year_id)->where('grade_level_id', $course->grade_level_id)->where('section_id', $course->section_id)->where('status', 'APPROVED')->with('student.user');
    }
}
