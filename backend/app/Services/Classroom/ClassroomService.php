<?php

namespace App\Services\Classroom;

use App\Models\AuditLog;
use App\Models\Classroom\ClassroomRecord;
use App\Models\Classroom\CourseUnit;
use App\Models\Classroom\Material;
use App\Models\Courses\Course;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class ClassroomService
{
    public function fail(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => $message]);
    }

    public function audit(ClassroomRecord $record, string $action, ?array $old, Request $request): void
    {
        // Metadata only: no file bytes, storage paths, links or free-form content.
        $keys = array_flip(['id', 'institution_id', 'course_id', 'course_unit_id', 'title', 'sequence', 'type', 'status', 'published_at', 'created_by', 'file_size', 'mime_type']);
        AuditLog::create([
            'user_id' => $request->user()->id, 'action' => $action,
            'entity_type' => $record->getTable(), 'entity_id' => $record->id,
            'old_values' => $old === null ? null : array_intersect_key($old, $keys),
            'new_values' => array_intersect_key($record->attributesToArray(), $keys),
            'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500),
        ]);
    }

    public function save(string $kind, int $courseId, array $data, Request $request, ?int $id = null, ?string $operation = null): ClassroomRecord
    {
        $newPath = null;
        try {
            return DB::transaction(function () use ($kind, $courseId, $data, $request, $id, $operation, &$newPath) {
                app(EnrollmentService::class)->lock();
                $course = Course::lockForUpdate()->findOrFail($courseId);
                $class = $kind === 'course-units' ? CourseUnit::class : Material::class;
                $record = $id ? $class::where('course_id', $courseId)->lockForUpdate()->findOrFail($id) : new $class;
                Gate::forUser($request->user())->authorize($id ? ($operation ?? 'update') : 'create', $id ? $record : [$class, $course, $kind]);
                if ($course->status->value === 'CLOSED') {
                    $this->fail('course_id', 'El curso está cerrado y conserva su historial.');
                }
                if ($id && $record->status === 'ARCHIVED') {
                    $this->fail('status', 'El contenido archivado conserva su historial y no se modifica.');
                }
                $old = $id ? $record->attributesToArray() : null;
                unset($data['file']);
                if ($operation) {
                    $data = ['status' => $operation === 'publish' ? 'PUBLISHED' : 'ARCHIVED'];
                    if ($operation === 'publish') {
                        if ($record->status !== 'DRAFT' || $course->status->value !== 'ACTIVE') {
                            $this->fail('status', 'Solo se publica un borrador de un curso activo.');
                        }
                        $data['published_at'] = now();
                    }
                } elseif (! $id) {
                    $data += ['course_id' => $courseId, 'status' => 'DRAFT'];
                    if ($kind === 'materials') {
                        $data['created_by'] = $request->user()->id;
                    }
                }
                $values = array_merge($old ?? [], $data);
                if ($kind === 'course-units') {
                    if (CourseUnit::withTrashed()->where('course_id', $courseId)->where('sequence', $values['sequence'])->when($id, fn ($q) => $q->whereKeyNot($id))->exists()) {
                        $this->fail('sequence', 'La secuencia ya está reservada en este curso.');
                    }
                } else {
                    if ($values['course_unit_id'] ?? null) {
                        $unit = CourseUnit::where('course_id', $courseId)->find($values['course_unit_id']);
                        if (! $unit) {
                            $this->fail('course_unit_id', 'La unidad no pertenece a este curso.');
                        }
                        if ($operation !== 'archive' && ($unit->status === 'ARCHIVED' || ($values['status'] === 'PUBLISHED' && $unit->status !== 'PUBLISHED'))) {
                            $this->fail('course_unit_id', 'Publica primero la unidad; una unidad archivada no admite cambios.');
                        }
                    }
                    if (! $operation) {
                        if ($id && $record->type !== $values['type']) {
                            $this->fail('type', 'El tipo del material es inmutable.');
                        }
                        if ($values['type'] === 'LINK' && empty($values['external_url'])) {
                            $this->fail('external_url', 'El enlace requiere una URL HTTP o HTTPS.');
                        }
                        if ($values['type'] !== 'LINK' && ! empty($values['external_url'])) {
                            $this->fail('external_url', 'Solo un material LINK admite una URL.');
                        }
                        if ($values['type'] === 'TEXT' && empty(trim($values['description'] ?? ''))) {
                            $this->fail('description', 'El material de texto requiere contenido.');
                        }
                        if ($request->hasFile('file') && $values['type'] !== 'FILE') {
                            $this->fail('file', 'Solo un material FILE admite archivos.');
                        }
                        if ($values['type'] === 'FILE') {
                            if ($request->hasFile('file')) {
                                $metadata = app(MaterialFiles::class)->store($request->file('file'), $course->institution_id, $courseId);
                                $newPath = $metadata['file_path'];
                                $data = array_merge($data, $metadata);
                            } elseif (! $id || ! $record->file_path) {
                                $this->fail('file', 'Selecciona un archivo.');
                            }
                        }
                    }
                }
                // Published edits also require an active course.
                if ($values['status'] === 'PUBLISHED' && $course->status->value !== 'ACTIVE') {
                    $this->fail('status', 'El curso debe estar activo.');
                }
                $record->fill($data)->save();
                $record->refresh();
                $this->audit($record, $operation ? strtoupper($operation) : ($id ? 'UPDATE' : 'CREATE'), $old, $request);

                // Keep previous private file revisions for history; never expose their paths.
                return $record;
            });
        } catch (\Throwable $error) {
            app(MaterialFiles::class)->discard($newPath);
            throw $error;
        }
    }
}
