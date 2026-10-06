<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeRequest;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Courses\Course;
use App\Models\People\Student;
use App\Models\Role;
use App\Models\User;
use App\Services\Office\OfficeAccess;

class OfficeOptionsController extends Controller
{
    public function __invoke(OfficeRequest $r, OfficeAccess $access)
    {
        $kind = $r->route('option');
        $staff = $access->staff($r->user(), 'requests.review') || $access->staff($r->user(), 'communications.create') || $access->staff($r->user(), 'documents.create');
        abort_unless($staff || ($kind === 'students' && $r->user()->can('requests.create')), 403);
        $q = match ($kind) {
            'students' => Student::with('user'),'users' => User::where('status', 'ACTIVE'),'roles' => Role::query(),'grades' => GradeLevel::query(),'sections' => Section::with(['gradeLevel', 'academicYear']),'courses' => Course::where('status', 'ACTIVE'),'assignees' => User::where('status', 'ACTIVE')->role(['SECRETARY', 'ADMINISTRATOR'])
        };
        if (! $staff) {
            $q->whereIn('id', $access->students($r->user()));
        }
        if ($search = $r->validated('search')) {
            $search = '%'.addcslashes($search, '%_\\').'%';
            if ($kind === 'students') {
                $q->whereHas('user', fn ($u) => $u->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$search]));
            } elseif (in_array($kind, ['users', 'assignees'])) {
                $q->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$search]);
            } else {
                $q->where('name', 'like', $search);
            }
        }

        return $q->orderBy('id')->paginate($r->validated('per_page') ?? 20)->through(fn ($o) => ['id' => $kind === 'roles' ? $o->name : $o->id,
            'name' => $kind === 'students' ? ($o->user?->name ?? 'Estudiante archivado') : ($kind === 'sections' ? $o->name.' · '.$o->gradeLevel?->name.' · '.$o->academicYear?->name : $o->name)]);
    }
}
