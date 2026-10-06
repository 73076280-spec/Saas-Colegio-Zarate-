<?php

namespace App\Services\Office;

use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Models\People\Student;
use App\Services\Classroom\MaterialFiles;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class DocumentService
{
    public function create(array $data, Request $request): AcademicDocument
    {
        $path = null;
        try {
            return DB::transaction(function () use ($data, $request, &$path) {
                app(EnrollmentService::class)->lock();
                Gate::forUser($request->user())->authorize('create', [AcademicDocument::class, 'documents']);
                $academic = empty($data['academic_request_id']) ? null : AcademicRequest::findOrFail($data['academic_request_id']);
                $student = Student::findOrFail($data['student_id'] ?? $academic?->student_id);
                if ($academic && $academic->student_id !== $student->id) {
                    app(RequestService::class)->fail('student_id', 'El documento y la solicitud deben pertenecer al mismo estudiante.');
                }
                $file = [];
                if (isset($data['file'])) {
                    $file = app(MaterialFiles::class)->store($data['file'], $student->institution_id, 'documents');
                    $path = $file['file_path'];
                }
                $r = AcademicDocument::create($file + ['student_id' => $student->id, 'academic_request_id' => $academic?->id,
                    'document_type' => $data['document_type'], 'document_number' => 'TMP-'.Str::uuid(), 'status' => 'DRAFT']);
                $r->update(['document_number' => 'DOC-'.now()->year.'-'.str_pad((string) $r->id, 6, '0', STR_PAD_LEFT)]);
                app(OfficeAudit::class)->record($r, 'CREATE', null, $request);

                return $r;
            });
        } catch (\Throwable $e) {
            if ($path) {
                app(MaterialFiles::class)->discard($path);
            }
            throw $e;
        }
    }

    public function transition(int $id, string $operation, Request $request): AcademicDocument
    {
        return DB::transaction(function () use ($id, $operation, $request) {
            app(EnrollmentService::class)->lock();
            $r = AcademicDocument::lockForUpdate()->findOrFail($id);
            Gate::forUser($request->user())->authorize('issue', $r);
            if ($operation === 'cancel') {
                if ($r->status === 'CANCELLED') {
                    app(RequestService::class)->fail('status', 'El documento ya está cancelado.');
                }
                $old = $r->attributesToArray();
                $r->update(['status' => 'CANCELLED']);
                app(OfficeAudit::class)->record($r, 'CANCEL', $old, $request);

                return $r;
            }
            if ($r->status !== 'DRAFT') {
                app(RequestService::class)->fail('status', 'Solo se emite un documento en borrador.');
            }
            if ($r->request && ! in_array($r->request->status, ['APPROVED', 'COMPLETED'])) {
                app(RequestService::class)->fail('academic_request_id', 'La solicitud vinculada debe estar aprobada o completada.');
            }
            $old = $r->attributesToArray();
            $r->update(['status' => 'ISSUED', 'issued_by' => $request->user()->id, 'issued_at' => now()]);
            app(OfficeAudit::class)->record($r, 'ISSUE', $old, $request);

            return $r;
        });
    }
}
