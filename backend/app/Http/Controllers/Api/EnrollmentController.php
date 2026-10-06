<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Enrollment\EnrollmentListRequest;
use App\Http\Requests\Enrollment\EnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Student;
use App\Policies\EnrollmentPolicy;
use App\Services\Enrollment\EnrollmentService;
use App\Services\Enrollment\TransitionEnrollmentStatusAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EnrollmentController extends Controller
{
    public function index(EnrollmentListRequest $r)
    {
        $q = Enrollment::with(['student.user', 'academicYear', 'gradeLevel.educationLevel', 'section']);
        if (! $r->user()->can('enrollments.view')) {
            $q->whereHas('student', fn ($s) => $s->where('user_id', $r->user()->id)->orWhereHas('guardians', fn ($g) => $g->where('user_id', $r->user()->id)));
        }
        if ($r->route('student')) {
            $student = Student::findOrFail($r->route('student'));
            abort_unless($r->user()->can('enrollments.view') || EnrollmentPolicy::owns($r->user(), $student->id), 404);
            $q->where('student_id', $student->id);
        }
        foreach (['academic_year_id', 'grade_level_id', 'section_id', 'student_id', 'status'] as $key) {
            if ($r->filled($key)) {
                $q->where($key, $r->validated($key));
            }
        }
        if ($r->filled('search')) {
            $search = '%'.addcslashes($r->validated('search'), '%_\\').'%';
            $q->where(fn ($q) => $q->where('enrollment_code', 'like', $search)->orWhereHas('student.user', fn ($u) => $u->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$search])));
        }

        return EnrollmentResource::collection($q->orderByDesc('id')->paginate($r->validated('per_page', 15)));
    }

    public function show(Request $r, int $id)
    {
        $e = Enrollment::with('history.actor')->findOrFail($id);
        abort_unless(Gate::allows('view', $e), 404);

        return new EnrollmentResource($e);
    }

    public function store(EnrollmentRequest $r, EnrollmentService $s)
    {
        return (new EnrollmentResource($s->save($r->validated(), $r)))->response()->setStatusCode(201);
    }

    public function update(EnrollmentRequest $r, EnrollmentService $s, int $id)
    {
        Gate::authorize('update', Enrollment::findOrFail($id));

        return new EnrollmentResource($s->save($r->validated(), $r, $id));
    }

    public function transition(EnrollmentRequest $r, TransitionEnrollmentStatusAction $s, int $id)
    {
        return new EnrollmentResource($s->execute($id, $r->route('operation'), $r)->load('history.actor'));
    }
}
