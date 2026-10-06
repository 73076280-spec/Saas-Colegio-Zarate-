<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LearningRequest;
use App\Http\Resources\LearningResource;
use App\Models\Academic\AcademicPeriod;
use App\Models\Courses\Course;
use App\Models\Learning\Assessment;
use App\Models\Learning\AssessmentType;
use App\Models\Learning\Assignment;
use App\Models\Learning\LearningRecord;
use App\Models\Learning\Score;
use App\Models\Learning\Submission;
use App\Services\Classroom\ClassroomAccess;
use App\Services\Learning\LearningAccess;
use App\Services\Learning\LearningService;
use App\Services\Learning\ScoreService;
use App\Services\Learning\SubmissionService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class LearningController extends Controller
{
    public function __construct(private LearningAccess $access) {}

    private function model(string $kind): string
    {
        return match ($kind) {
            'assignments' => Assignment::class, 'assessments' => Assessment::class, 'submissions' => Submission::class, 'scores' => Score::class
        };
    }

    private function record(LearningRequest $r): LearningRecord
    {
        return $this->model($r->route('kind'))::findOrFail($r->route('id'));
    }

    public function index(LearningRequest $r)
    {
        $kind = $r->route('kind');
        $query = $this->access->visible($r->user(), $kind, (bool) $r->route('personal'));
        $abilities = [];
        if ($courseId = $r->route('course')) {
            $course = Course::findOrFail($courseId);
            abort_unless(app(ClassroomAccess::class)->browse($r->user(), $course, $kind), 404);
            $query->where('course_id', $courseId);
            $abilities['create'] = $this->access->manage($r->user(), $course, $kind, 'create');
        }
        if ($assignmentId = $r->route('assignment')) {
            $assignment = Assignment::findOrFail($assignmentId);
            abort_unless(Gate::allows('view', $assignment), 404);
            $query->where('assignment_id', $assignmentId);
        }
        if ($assessmentId = $r->route('assessment')) {
            $assessment = Assessment::findOrFail($assessmentId);
            abort_unless(Gate::allows('view', $assessment), 404);
            $query->where('assessment_id', $assessmentId);
            $abilities['create'] = $this->access->manage($r->user(), $assessment->course, 'scores', 'create');
        }
        $filters = $r->validated();
        if (! empty($filters['status']) && $kind !== 'scores') {
            $query->where('status', $filters['status']);
        }
        $relations = match ($kind) {
            'assignments' => ['course', 'unit'], 'assessments' => ['course', 'period'],
            'submissions' => ['assignment.course', 'student.user'], 'scores' => ['assessment.course', 'assessment.period', 'student.user'],
        };

        return LearningResource::collection($query->with($relations)->orderByDesc('id')->paginate($filters['per_page'] ?? 20))->additional(['abilities' => $abilities]);
    }

    public function show(LearningRequest $r)
    {
        $record = $this->record($r);
        abort_unless(Gate::allows('view', $record), 404);

        return new LearningResource($record);
    }

    public function store(LearningRequest $r)
    {
        $kind = $r->route('kind');
        $data = $r->validated();
        $record = match ($kind) {
            'submissions' => app(SubmissionService::class)->save((int) $r->route('assignment'), $data, $r),
            'scores' => app(ScoreService::class)->save((int) $r->route('assessment'), $data, $r),
            default => app(LearningService::class)->save($kind, (int) $r->route('course'), $data, $r),
        };

        return (new LearningResource($record))->response()->setStatusCode(201);
    }

    public function update(LearningRequest $r)
    {
        $record = $this->record($r);
        $data = $r->validated();
        $result = match ($r->route('kind')) {
            'submissions' => app(SubmissionService::class)->save($record->assignment_id, $data, $r, $record->id, $r->route('operation') === 'review'),
            'scores' => app(ScoreService::class)->save($record->assessment_id, $data, $r, $record->id),
            default => app(LearningService::class)->save($r->route('kind'), $record->course_id, $data, $r, $record->id, $r->route('operation')),
        };

        return new LearningResource($result);
    }

    public function download(LearningRequest $r)
    {
        $record = $this->record($r);
        abort_unless(Gate::allows('view', $record) && $record->file_path, 404);
        $disk = Storage::disk('materials');
        abort_unless($disk->exists($record->file_path), 404);

        return $disk->download($record->file_path, $record->original_filename, ['Content-Type' => 'application/octet-stream', 'X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'private, no-store']);
    }

    public function history(LearningRequest $r)
    {
        $score = $this->record($r);
        abort_unless(Gate::allows('view', $score), 404);

        return $score->history()->paginate($r->validated('per_page') ?? 20);
    }

    public function options(LearningRequest $r)
    {
        $course = Course::findOrFail($r->route('course'));
        abort_unless(app(ClassroomAccess::class)->browse($r->user(), $course, 'assessments'), 404);
        if ($r->route('option') === 'types') {
            return AssessmentType::where('status', 'ACTIVE')->orderBy('name')->paginate($r->validated('per_page') ?? 20);
        }

        return AcademicPeriod::where('academic_year_id', $course->academic_year_id)->orderBy('sequence')->paginate($r->validated('per_page') ?? 20);
    }
}
