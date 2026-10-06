<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Enrollment\EnrollmentListRequest;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Student;

class EnrollmentOptionsController extends Controller
{
    public function __invoke(EnrollmentListRequest $r)
    {
        abort_unless($r->user()->can('enrollments.create') || $r->user()->can('enrollments.update') || $r->user()->can('payments.create'), 403);
        $kind = $r->validated('kind', 'students');
        $q = match ($kind) {
            'students' => Student::with('user')->where('status', 'ACTIVE'),'years' => AcademicYear::where('status', '!=', 'CLOSED'),'grades' => GradeLevel::with('educationLevel')->where('status', 'ACTIVE')->whereHas('educationLevel', fn ($l) => $l->where('status', 'ACTIVE')),'sections' => Section::where('status', 'ACTIVE')
        };
        if ($kind === 'sections') {
            $q->where('academic_year_id', $r->validated('academic_year_id', 0))->where('grade_level_id', $r->validated('grade_level_id', 0));
        }
        if ($kind === 'grades') {
            $q->whereHas('sections', fn ($s) => $s->where('academic_year_id', $r->validated('academic_year_id', 0))->where('status', 'ACTIVE'));
        }
        if ($r->filled('search')) {
            $search = '%'.addcslashes($r->validated('search'), '%_\\').'%';
            if ($kind === 'students') {
                $q->where(fn ($s) => $s->where('student_code', 'like', $search)->orWhereHas('user', fn ($u) => $u->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$search])));
            } else {
                $q->where('name', 'like', $search);
            }
        }

        return $q->orderBy('id')->paginate($r->validated('per_page', 25))->through(function ($v) use ($kind) {
            $result = ['id' => $v->id, 'name' => $kind === 'students' ? $v->user?->name.' — '.$v->student_code : $v->name];
            if ($kind === 'grades') {
                $result['name'] = $v->educationLevel?->name.' — '.$v->name;
            }
            if ($kind === 'sections') {
                $result['capacity'] = $v->capacity;
                $result['occupied'] = Enrollment::withTrashed()->where('section_id', $v->id)->where('status', 'APPROVED')->count();
            }

            return $result;
        });
    }
}
