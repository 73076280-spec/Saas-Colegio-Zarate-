<?php

namespace App\Services\Learning;

use App\Models\Learning\Assignment;
use App\Models\Learning\Submission;
use App\Services\Classroom\MaterialFiles;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class SubmissionService
{
    public function save(int $assignmentId, array $data, Request $request, ?int $id = null, bool $review = false): Submission
    {
        $path = null;
        try {
            return DB::transaction(function () use ($assignmentId, $data, $request, $id, $review, &$path) {
                app(EnrollmentService::class)->lock();
                $assignment = Assignment::lockForUpdate()->findOrFail($assignmentId);
                $service = app(LearningService::class);
                $access = app(LearningAccess::class);
                $record = $id ? Submission::where('assignment_id', $assignmentId)->lockForUpdate()->findOrFail($id) : new Submission;
                Gate::forUser($request->user())->authorize($review ? 'review' : ($id ? 'update' : 'submit'), $id ? $record : $assignment);
                $service->active($assignment->course);
                $old = $id ? $record->attributesToArray() : null;
                if ($review) {
                    if (! in_array($record->status, ['SUBMITTED', 'LATE'])) {
                        $service->fail('status', 'Esta entrega ya fue revisada o devuelta.');
                    }
                    $values = ['status' => $data['status'], 'feedback' => $data['feedback'], 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()];
                } else {
                    if ($assignment->status !== 'PUBLISHED') {
                        $service->fail('status', 'La tarea no admite entregas.');
                    }
                    $late = now()->gt($assignment->due_at);
                    if ($late && ! $assignment->allow_late_submission) {
                        $service->fail('due_at', 'La fecha límite venció y no se permiten entregas tardías.');
                    }
                    $student = $access->studentId($request->user());
                    $latest = Submission::where('assignment_id', $assignmentId)->where('student_id', $student)->orderByDesc('attempt')->first();
                    if ($id && ($latest?->id !== $record->id || ! in_array($record->status, ['SUBMITTED', 'LATE']))) {
                        $service->fail('status', 'Una entrega revisada o devuelta no se modifica. Envía un nuevo intento si fue devuelta.');
                    }
                    if (! $id && $latest && $latest->status !== 'RETURNED') {
                        $service->fail('attempt', 'Ya existe una entrega. Un nuevo intento requiere devolución del docente.');
                    }
                    $values = array_intersect_key($data, array_flip(['content']));
                    if ($request->hasFile('file')) {
                        $meta = app(MaterialFiles::class)->store($request->file('file'), $assignment->institution_id, $assignment->course_id);
                        $path = $meta['file_path'];
                        $values += $meta;
                    }
                    if (empty(trim($values['content'] ?? $record->content ?? '')) && empty($values['file_path'] ?? $record->file_path)) {
                        $service->fail('content', 'Escribe tu respuesta o adjunta un archivo.');
                    }
                    $values += ['submitted_at' => now(), 'is_late' => $late, 'status' => $late ? 'LATE' : 'SUBMITTED'];
                    if (! $id) {
                        $values += ['assignment_id' => $assignmentId, 'student_id' => $student, 'attempt' => ($latest?->attempt ?? 0) + 1];
                    }
                }
                $record->fill($values)->save();
                $record->refresh();
                app(LearningAudit::class)->record($record, $review ? 'REVIEW' : ($id ? 'UPDATE' : 'SUBMIT'), $old, $request);

                return $record;
            });
        } catch (\Throwable $error) {
            app(MaterialFiles::class)->discard($path);
            throw $error;
        }
    }
}
