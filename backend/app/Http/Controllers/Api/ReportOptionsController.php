<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReportRequest;
use App\Models\Academic\AcademicPeriod;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\EducationLevel;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Academic\Subject;
use App\Models\Courses\Course;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Student;
use App\Models\People\Teacher;
use App\Policies\ReportPolicy;
use App\Services\Reports\ReportCatalog;

class ReportOptionsController extends Controller
{
    public function __invoke(ReportRequest $r)
    {
        $key = $r->route('report');
        abort_unless(app(ReportPolicy::class)->view($r->user(), $key), 403);
        $field = $r->route('option');
        abort_unless(in_array($field, ReportCatalog::filters($key)), 404);
        $class = [
            'academic_year_id' => AcademicYear::class, 'academic_period_id' => AcademicPeriod::class,
            'education_level_id' => EducationLevel::class, 'grade_level_id' => GradeLevel::class,
            'section_id' => Section::class, 'subject_id' => Subject::class,
            'course_id' => Course::class, 'student_id' => Student::class, 'teacher_id' => Teacher::class,
        ][$field] ?? null;
        abort_unless($class, 404);
        $q = $class::query();
        $person = in_array($field, ['student_id', 'teacher_id']);
        if ($person) {
            $q->with('user');
        }
        if ($r->user()->hasRole('TEACHER') && ! $r->user()->hasRole('ADMINISTRATOR')) {
            $ownCourses = Course::whereHas('teacher', fn ($t) => $t->where('user_id', $r->user()->id)->where('status', 'ACTIVE'));
            if ($field === 'course_id') {
                $q = $ownCourses;
            } elseif ($field === 'teacher_id') {
                $q->where('user_id', $r->user()->id);
            } elseif ($field === 'student_id') {
                $q->whereIn('id', Enrollment::where('status', 'APPROVED')->whereExists(function ($c) use ($r) {
                    $c->selectRaw('1')->from('courses')->join('teachers', 'teachers.id', '=', 'courses.teacher_id')
                        ->where('teachers.user_id', $r->user()->id)->where('teachers.status', 'ACTIVE')
                        ->whereNull('teachers.deleted_at')->whereNull('courses.deleted_at')
                        ->whereColumn('courses.institution_id', 'enrollments.institution_id')
                        ->whereColumn('courses.academic_year_id', 'enrollments.academic_year_id')
                        ->whereColumn('courses.grade_level_id', 'enrollments.grade_level_id')
                        ->whereColumn('courses.section_id', 'enrollments.section_id');
                })->select('student_id'));
            }
        }
        if ($search = $r->validated('search')) {
            $like = '%'.addcslashes($search, '%_\\').'%';
            $person ? $q->whereHas('user', fn ($u) => $u->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$like])) : $q->where('name', 'like', $like);
        }

        return $q->orderBy('id')->paginate(20)->through(fn ($row) => ['id' => $row->id, 'name' => $person ? $row->user?->name : $row->name]);
    }
}
