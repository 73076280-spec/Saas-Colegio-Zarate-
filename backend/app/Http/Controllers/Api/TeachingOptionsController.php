<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Courses\TeachingListRequest;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Academic\Subject;
use App\Models\People\Teacher;

class TeachingOptionsController extends Controller
{
    public function __invoke(TeachingListRequest $r)
    {
        abort_unless(collect(['courses.view', 'courses.create', 'courses.update', 'teacher-assignments.view', 'teacher-assignments.create', 'teacher-assignments.update'])->contains(fn ($p) => $r->user()->can($p)), 403);
        $kind = $r->validated('kind', 'teachers');
        $q = match ($kind) {
            'teachers' => Teacher::with('user')->where('status', 'ACTIVE'),'subjects' => Subject::where('status', 'ACTIVE'),'years' => AcademicYear::where('status', '!=', 'CLOSED'),'grades' => GradeLevel::with('educationLevel')->where('status', 'ACTIVE')->whereHas('educationLevel', fn ($l) => $l->where('status', 'ACTIVE')),'sections' => Section::where('status', 'ACTIVE')
        };
        if ($kind === 'grades') {
            $q->whereHas('sections', fn ($s) => $s->where('academic_year_id', $r->validated('academic_year_id', 0))->where('status', 'ACTIVE'));
        }
        if ($kind === 'sections') {
            $q->where('academic_year_id', $r->validated('academic_year_id', 0))->where('grade_level_id', $r->validated('grade_level_id', 0));
        }
        if ($r->filled('search')) {
            $search = '%'.addcslashes($r->validated('search'), '%_\\').'%';
            if ($kind === 'teachers') {
                $q->whereHas('user', fn ($u) => $u->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$search]));
            } else {
                $q->where('name', 'like', $search);
            }
        }

        return $q->orderBy('id')->paginate($r->validated('per_page', 25))->through(fn ($v) => ['id' => $v->id, 'name' => $kind === 'teachers' ? $v->user?->name : ($kind === 'grades' ? $v->educationLevel?->name.' — '.$v->name : $v->name)]);
    }
}
