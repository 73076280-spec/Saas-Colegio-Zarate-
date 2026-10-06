<?php

namespace App\Http\Resources;

use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Services\Office\OfficeAccess;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class OfficeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $r = $this->resource;
        $base = ['id' => $r->id, 'status' => $r->status, 'created_at' => $r->created_at];
        if ($r instanceof AcademicRequest) {
            $abilities = [];
            foreach (['update', 'review', 'observe', 'approve', 'reject', 'complete'] as $a) {
                $abilities[$a] = Gate::allows($a, $r);
            }

            return $base + ['request_code' => $r->request_code, 'student_id' => $r->student_id, 'student' => $r->student?->user?->name ?? 'Estudiante archivado',
                'guardian_id' => $r->guardian_id, 'request_type_id' => $r->request_type_id, 'type' => $r->type->name, 'subject' => $r->subject, 'description' => $r->description,
                'assigned_to' => $r->assigned_to, 'responsible' => $r->assignee?->name, 'resolution' => $r->resolution, 'abilities' => $abilities];
        }
        if ($r instanceof AcademicDocument) {
            return $base + ['student_id' => $r->student_id, 'student' => $r->student?->user?->name ?? 'Estudiante archivado', 'academic_request_id' => $r->academic_request_id,
                'document_type' => $r->document_type, 'document_number' => $r->document_number, 'original_filename' => $r->original_filename, 'issued_at' => $r->issued_at,
                'issued_by' => $r->issued_by, 'abilities' => ['issue' => Gate::allows('issue', $r)]];
        }

        return $base + ['title' => $r->title, 'body' => $r->body, 'published_at' => $r->published_at,
            'targets' => app(OfficeAccess::class)->staff($request->user(), 'communications.view') ? $r->targets()->get(['kind', 'target'])->toArray() : [],
            'abilities' => ['update' => Gate::allows('update', $r), 'publish' => Gate::allows('publish', $r), 'archive' => Gate::allows('archive', $r)]];
    }
}
