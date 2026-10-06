<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Courses\TeachingListRequest;
use App\Http\Requests\Courses\TeachingRequest;
use App\Http\Resources\TeachingResource;
use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Student;
use App\Models\People\Teacher;
use App\Services\Courses\CourseAccess;
use App\Services\Courses\TeachingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TeachingController extends Controller
{
    private function isCourse(Request $r): bool
    {
        return $r->route('teaching') === 'courses';
    }

    private function record(Request $r, int $id)
    {
        return ($this->isCourse($r) ? Course::class : TeacherAssignment::class)::findOrFail($id);
    }

    public function index(TeachingListRequest $r, CourseAccess $access)
    {
        if (! $this->isCourse($r)) {
            Gate::authorize('teacher-assignments.view');
            $q = TeacherAssignment::query();
        } else {
            $q = $access->visible($r->user(), (bool) $r->route('personal'));
            if ($r->route('teacher')) {
                $teacher = Teacher::findOrFail($r->route('teacher'));
                abort_unless($r->user()->can('courses.view') || $teacher->user_id === $r->user()->id, 404);
                $q->where('teacher_id', $teacher->id);
            }
            if ($r->route('student')) {
                $student = Student::findOrFail($r->route('student'));
                abort_unless($r->user()->can('courses.view') || $student->user_id === $r->user()->id, 404);
                $access->studentQuery($q, $student->id);
            }
            $q->addSelect(['students_count' => Enrollment::selectRaw('COUNT(*)')->whereColumn('enrollments.academic_year_id', 'courses.academic_year_id')->whereColumn('enrollments.grade_level_id', 'courses.grade_level_id')->whereColumn('enrollments.section_id', 'courses.section_id')->where('status', 'APPROVED')]);
        }
        foreach (['academic_year_id', 'teacher_id', 'subject_id', 'grade_level_id', 'section_id', 'status'] as $key) {
            if ($r->filled($key)) {
                $q->where($key, $r->validated($key));
            }
        }
        if ($r->filled('search')) {
            $search = '%'.addcslashes($r->validated('search'), '%_\\').'%';
            $q->where(function ($q) use ($search, $r) {
                $q->whereHas('subject', fn ($s) => $s->where('name', 'like', $search))->orWhereHas('teacher.user', fn ($u) => $u->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$search]));
                if ($this->isCourse($r)) {
                    $q->orWhere('name', 'like', $search)->orWhere('code', 'like', $search);
                }
            });
        }

        return TeachingResource::collection($q->with(['academicYear', 'teacher.user', 'subject', 'gradeLevel.educationLevel', 'section'])->orderByDesc('id')->paginate($r->validated('per_page', 15)));
    }

    public function show(Request $r, int $id)
    {
        $record = $this->record($r, $id);
        abort_unless(Gate::allows('view', $record), 404);

        return new TeachingResource($record);
    }

    public function store(TeachingRequest $r, TeachingService $service)
    {
        return (new TeachingResource($service->save($this->isCourse($r), $r->validated(), $r)))->response()->setStatusCode(201);
    }

    public function update(TeachingRequest $r, TeachingService $service, int $id)
    {
        $record = $this->record($r, $id);
        Gate::authorize('manage', [$record, $r->route('operation') ?: 'update']);

        return new TeachingResource($service->save($this->isCourse($r), $r->validated(), $r, $id, $r->route('operation')));
    }

    public function roster(TeachingListRequest $r, CourseAccess $access, int $id)
    {
        $course = Course::findOrFail($id);
        abort_unless(Gate::allows('roster', $course), 404);

        return $access->roster($course)->paginate($r->validated('per_page', 25))->through(fn ($e) => ['student_id' => $e->student_id, 'student_code' => $e->student?->student_code, 'name' => $e->student?->user?->name, 'enrollment_code' => $e->enrollment_code]);
    }
}
