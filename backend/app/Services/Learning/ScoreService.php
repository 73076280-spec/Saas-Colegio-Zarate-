<?php

namespace App\Services\Learning;

use App\Models\Academic\AcademicPeriod;
use App\Models\Learning\Assessment;
use App\Models\Learning\Score;
use App\Models\Learning\ScoreHistory;
use App\Models\People\Student;
use App\Services\Courses\CourseAccess;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ScoreService
{
    public function save(int $assessmentId, array $data, Request $request, ?int $id = null): Score
    {
        return DB::transaction(function () use ($assessmentId, $data, $request, $id) {
            app(EnrollmentService::class)->lock();
            $assessment = Assessment::lockForUpdate()->findOrFail($assessmentId);
            $record = $id ? Score::where('assessment_id', $assessmentId)->lockForUpdate()->findOrFail($id) : new Score;
            Gate::forUser($request->user())->authorize($id ? 'update' : 'create', $id ? $record : [Score::class, $assessment->course, 'scores']);
            $service = app(LearningService::class);
            $service->active($assessment->course);
            if ($assessment->status !== 'PUBLISHED') {
                $service->fail('status', 'Solo se califican evaluaciones publicadas y abiertas.');
            }
            $period = AcademicPeriod::lockForUpdate()->findOrFail($assessment->academic_period_id);
            if (! $period->grading_open || $period->status->value === 'CLOSED') {
                $service->fail('academic_period_id', 'El periodo está cerrado para calificaciones.');
            }
            $student = $id ? $record->student_id : $data['student_id'];
            if (! Student::whereKey($student)->where('status', 'ACTIVE')->exists() ||
                ! app(CourseAccess::class)->studentQuery($assessment->course->newQuery()->whereKey($assessment->course_id), $student)->exists()) {
                $service->fail('student_id', 'El estudiante no tiene matrícula aprobada en este curso.');
            }
            if ($data['score'] < 0 || $data['score'] > 20 || $data['score'] > $assessment->max_score) {
                $service->fail('score', 'La nota debe estar entre 0 y 20 y no superar la escala de la evaluación.');
            }
            if (! $id && Score::where('assessment_id', $assessmentId)->where('student_id', $student)->exists()) {
                $service->fail('student_id', 'Ya existe una nota para esta evaluación y estudiante.');
            }
            if ($id && empty(trim($data['reason'] ?? ''))) {
                $service->fail('reason', 'Indica el motivo de la modificación.');
            }
            $old = $id ? $record->attributesToArray() : null;
            $record->fill(array_intersect_key($data, array_flip(['score', 'observations'])) + [
                'assessment_id' => $assessmentId, 'student_id' => $student, 'graded_by' => $request->user()->id, 'graded_at' => now(),
            ])->save();
            ScoreHistory::create(['score_id' => $record->id, 'old_score' => $old['score'] ?? null, 'new_score' => $record->score, 'changed_by' => $request->user()->id, 'reason' => $data['reason'] ?? null]);
            app(LearningAudit::class)->record($record, $id ? 'SCORE_UPDATE' : 'GRADE', $old, $request);

            return $record->refresh();
        });
    }
}
