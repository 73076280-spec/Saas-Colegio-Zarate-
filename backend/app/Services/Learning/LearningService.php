<?php

namespace App\Services\Learning;

use App\Models\Academic\AcademicPeriod;
use App\Models\Classroom\CourseUnit;
use App\Models\Courses\Course;
use App\Models\Learning\Assessment;
use App\Models\Learning\AssessmentType;
use App\Models\Learning\Assignment;
use App\Models\Learning\LearningRecord;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class LearningService
{
    public function fail(string $key, string $message): never
    {
        throw ValidationException::withMessages([$key => $message]);
    }

    public function active(Course $course): void
    {
        if ($course->status->value !== 'ACTIVE') {
            $this->fail('course_id', 'El curso debe estar activo.');
        }
    }

    public function save(string $kind, int $courseId, array $data, Request $request, ?int $id = null, ?string $operation = null): LearningRecord
    {
        return DB::transaction(function () use ($kind, $courseId, $data, $request, $id, $operation) {
            app(EnrollmentService::class)->lock();
            $course = Course::lockForUpdate()->findOrFail($courseId);
            $class = $kind === 'assignments' ? Assignment::class : Assessment::class;
            $record = $id ? $class::where('course_id', $courseId)->lockForUpdate()->findOrFail($id) : new $class;
            Gate::forUser($request->user())->authorize($id ? ($operation ?? 'update') : 'create', $id ? $record : [$class, $course, $kind]);
            $this->active($course);
            if ($record->status === 'CLOSED') {
                $this->fail('status', 'El registro cerrado conserva su historial.');
            }
            $old = $id ? $record->attributesToArray() : null;
            if ($operation) {
                if ($operation === 'publish' && $record->status !== 'DRAFT') {
                    $this->fail('status', 'Solo se publica un borrador.');
                }
                $data = ['status' => $operation === 'publish' ? 'PUBLISHED' : 'CLOSED'];
                if ($operation === 'publish' && $kind === 'assignments') {
                    $data['published_at'] = now();
                }
            } elseif (! $id) {
                $data += ['course_id' => $courseId, 'created_by' => $request->user()->id, 'status' => 'DRAFT'];
            }
            $v = array_merge($old ?? [], $data);
            if ($kind === 'assignments') {
                if (($v['course_unit_id'] ?? null) && ! CourseUnit::where('course_id', $courseId)->where('status', '!=', 'ARCHIVED')->whereKey($v['course_unit_id'])->exists()) {
                    $this->fail('course_unit_id', 'Selecciona una unidad disponible del mismo curso.');
                }
            } else {
                $period = AcademicPeriod::where('academic_year_id', $course->academic_year_id)->find($v['academic_period_id']);
                if (! $period) {
                    $this->fail('academic_period_id', 'El periodo no corresponde al año del curso.');
                }
                if (! AssessmentType::where('status', 'ACTIVE')->whereKey($v['assessment_type_id'])->exists()) {
                    $this->fail('assessment_type_id', 'Selecciona un tipo de evaluación activo de tu institución.');
                }
                if ($id && $record->scores()->exists()) {
                    foreach (['academic_period_id', 'max_score', 'assessment_type_id'] as $field) {
                        if ($v[$field] != $old[$field]) {
                            $this->fail($field, 'No se cambia la estructura de una evaluación con notas.');
                        }
                    }
                }
            }
            if ($kind === 'assignments' && array_key_exists('due_at', $data)) {
                $data['due_at'] = Carbon::parse($data['due_at'])->utc();
            }
            $record->fill($data)->save();
            $record->refresh();
            app(LearningAudit::class)->record($record, $operation ? strtoupper($operation) : ($id ? 'UPDATE' : 'CREATE'), $old, $request);

            return $record;
        });
    }
}
