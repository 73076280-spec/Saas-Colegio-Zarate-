<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeRequest;
use App\Http\Resources\OfficeResource;
use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Models\Office\Communication;
use App\Models\Office\RequestType;
use App\Services\Office\CommunicationService;
use App\Services\Office\DocumentService;
use App\Services\Office\OfficeAccess;
use App\Services\Office\RequestService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class OfficeController extends Controller
{
    public function __construct(private OfficeAccess $access) {}

    private function model(string $kind): string
    {
        return match ($kind) {
            'requests' => AcademicRequest::class,'documents' => AcademicDocument::class,'communications' => Communication::class
        };
    }

    public function index(OfficeRequest $r)
    {
        $kind = $r->route('kind');
        Gate::authorize("$kind.view");
        $q = match ($kind) {
            'requests' => $this->access->requests($r->user(), (bool) $r->route('personal'))->with(['student.user', 'type', 'assignee']),
            'documents' => $this->access->documents($r->user())->with('student.user'), 'communications' => $this->access->communications($r->user())
        };
        $filters = $r->validated();
        if (! empty($filters['status'])) {
            $q->where('status', $filters['status']);
        }
        if (! empty($filters['date'])) {
            $q->whereDate('created_at', $filters['date']);
        }
        foreach ($kind === 'requests' ? ['student_id', 'request_type_id'] : ($kind === 'documents' ? ['student_id', 'academic_request_id'] : []) as $field) {
            if (! empty($filters[$field])) {
                $q->where($field, $filters[$field]);
            }
        }
        if (! empty($filters['search'])) {
            $search = '%'.addcslashes($filters['search'], '%_\\').'%';
            $fields = match ($kind) {
                'requests' => ['request_code', 'subject'],'documents' => ['document_number', 'document_type'],'communications' => ['title']
            };
            $q->where(function ($query) use ($fields, $search) {
                foreach ($fields as $field) {
                    $query->orWhere($field, 'like', $search);
                }
            });
        }

        return OfficeResource::collection($q->orderByDesc('id')->paginate($filters['per_page'] ?? 20))->additional(['abilities' => ['create' => Gate::allows('create', [$this->model($kind), $kind])]]);
    }

    public function show(OfficeRequest $r)
    {
        $item = $this->model($r->route('kind'))::findOrFail($r->route('id'));
        abort_unless(Gate::allows('view', $item), 404);

        return new OfficeResource($item);
    }

    public function store(OfficeRequest $r)
    {
        $item = match ($r->route('kind')) {
            'requests' => app(RequestService::class)->save($r->validated(), $r),
            'documents' => app(DocumentService::class)->create($r->validated(), $r),
            'communications' => app(CommunicationService::class)->save($r->validated(), $r),
        };

        return (new OfficeResource($item))->response()->setStatusCode(201);
    }

    public function update(OfficeRequest $r)
    {
        $item = $r->route('kind') === 'requests' ? app(RequestService::class)->save($r->validated(), $r, (int) $r->route('id')) :
            app(CommunicationService::class)->save($r->validated(), $r, (int) $r->route('id'));

        return new OfficeResource($item);
    }

    public function transition(OfficeRequest $r)
    {
        $id = (int) $r->route('id');
        $item = match ($r->route('kind')) {
            'requests' => app(RequestService::class)->transition($id, $r->route('operation'), $r->validated(), $r),
            'documents' => app(DocumentService::class)->transition($id, $r->route('operation'), $r),
            'communications' => app(CommunicationService::class)->transition($id, $r->route('operation'), $r),
        };

        return new OfficeResource($item);
    }

    public function types(OfficeRequest $r)
    {
        Gate::authorize('requests.view');

        return RequestType::where('status', 'ACTIVE')->orderBy('name')->paginate($r->validated('per_page') ?? 20);
    }

    public function history(OfficeRequest $r)
    {
        $item = AcademicRequest::findOrFail($r->route('id'));
        abort_unless(Gate::allows('view', $item), 404);

        return $item->history()->paginate($r->validated('per_page') ?? 20);
    }

    public function download(OfficeRequest $r)
    {
        $item = AcademicDocument::findOrFail($r->route('id'));
        abort_unless(Gate::allows('view', $item) && $item->file_path, 404);
        $disk = Storage::disk('materials');
        abort_unless($disk->exists($item->file_path), 404);

        return $disk->download($item->file_path, $item->original_filename, ['Content-Type' => 'application/octet-stream', 'X-Content-Type-Options' => 'nosniff', 'Cache-Control' => 'private, no-store']);
    }
}
