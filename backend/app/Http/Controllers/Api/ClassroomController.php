<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClassroomRequest;
use App\Models\Classroom\ClassroomRecord;
use App\Models\Classroom\CourseUnit;
use App\Models\Classroom\Material;
use App\Models\Courses\Course;
use App\Services\Classroom\ClassroomAccess;
use App\Services\Classroom\ClassroomService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class ClassroomController extends Controller
{
    public function __construct(private ClassroomAccess $access, private ClassroomService $service) {}

    private function kind(ClassroomRequest $request): string
    {
        return $request->route('kind');
    }

    private function record(ClassroomRequest $request): ClassroomRecord
    {
        return ($this->kind($request) === 'course-units' ? CourseUnit::class : Material::class)::findOrFail($request->route('id'));
    }

    public function index(ClassroomRequest $request)
    {
        $kind = $this->kind($request);
        $course = Course::findOrFail($request->route('course'));
        abort_unless($this->access->browse($request->user(), $course, $kind), 404);
        $class = $kind === 'course-units' ? CourseUnit::class : Material::class;
        $query = $this->access->visible($class::where('course_id', $course->id), $request->user(), $course, $kind);
        $data = $request->validated();
        if (! empty($data['status'])) {
            $query->where('status', $data['status']);
        }
        if ($kind === 'materials' && ! empty($data['course_unit_id'])) {
            $query->where('course_unit_id', $data['course_unit_id']);
        }
        $result = $query->orderBy($kind === 'course-units' ? 'sequence' : 'id')->paginate($data['per_page'] ?? 20)->toArray();
        $result['abilities'] = [];
        foreach (['create', 'update', 'publish', 'archive'] as $ability) {
            $result['abilities'][$ability] = $this->access->allowed($request->user(), $course, $kind, $ability);
        }

        return response()->json($result);
    }

    public function show(ClassroomRequest $request)
    {
        $record = $this->record($request);
        abort_unless(Gate::allows('view', $record), 404);

        return response()->json(['data' => $record]);
    }

    public function store(ClassroomRequest $request)
    {
        $kind = $this->kind($request);
        $course = Course::findOrFail($request->route('course'));
        Gate::authorize('create', [$kind === 'course-units' ? CourseUnit::class : Material::class, $course, $kind]);
        $record = $this->service->save($kind, $course->id, $request->validated(), $request);

        return response()->json(['data' => $record], 201);
    }

    public function update(ClassroomRequest $request)
    {
        $record = $this->record($request);
        Gate::authorize($request->route('operation') ?? 'update', $record);

        return response()->json(['data' => $this->service->save($this->kind($request), $record->course_id, $request->validated(), $request, $record->id, $request->route('operation'))]);
    }

    public function download(ClassroomRequest $request)
    {
        $record = $this->record($request);
        abort_unless(Gate::allows('view', $record) && $record->type === 'FILE' && $record->file_path, 404);
        $disk = Storage::disk('materials');
        abort_unless($disk->exists($record->file_path), 404);

        return $disk->download($record->file_path, $record->original_filename, [
            'Content-Type' => 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store',
        ]);
    }
}
