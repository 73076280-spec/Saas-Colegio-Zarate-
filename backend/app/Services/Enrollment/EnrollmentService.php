<?php

namespace App\Services\Enrollment;

use App\Models\Academic\AcademicYear;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\PaymentConcept;
use App\Models\Enrollment\StudentPayment;
use App\Models\Institution;
use App\Models\People\Student;
use App\Services\InstitutionContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EnrollmentService
{
    public function __construct(private EnrollmentAudit $audit) {}

    public function lock(): void
    {
        Institution::whereKey(app(InstitutionContext::class)->requireId())->lockForUpdate()->firstOrFail();
    }

    public function invalid(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => $message]);
    }

    public function validateReferences(array $data): array
    {
        $student = Student::find($data['student_id']);
        $year = AcademicYear::find($data['academic_year_id']);
        $grade = GradeLevel::with('educationLevel')->find($data['grade_level_id']);
        $section = Section::lockForUpdate()->find($data['section_id']);
        if (! $student || $student->status->value !== 'ACTIVE') {
            $this->invalid('student_id', 'Selecciona un estudiante activo de tu institución.');
        }
        if (! $year || $year->status->value === 'CLOSED') {
            $this->invalid('academic_year_id', 'Selecciona un año académico válido y no cerrado.');
        }
        if (! $grade || $grade->status->value !== 'ACTIVE' || $grade->educationLevel?->status->value !== 'ACTIVE') {
            $this->invalid('grade_level_id', 'Selecciona un grado y nivel activos.');
        }
        if (! $section || $section->status->value !== 'ACTIVE' || $section->academic_year_id != $year->id || $section->grade_level_id != $grade->id) {
            $this->invalid('section_id', 'La sección debe estar activa y corresponder al grado y año seleccionados.');
        }

        return [$student, $year, $grade, $section];
    }

    public function unique(array $data, ?int $except = null): void
    {
        if (Enrollment::withTrashed()->where('student_id', $data['student_id'])->where('academic_year_id', $data['academic_year_id'])->whereIn('status', ['DRAFT', 'PENDING', 'OBSERVED', 'APPROVED'])->when($except, fn ($q) => $q->whereKeyNot($except))->exists()) {
            $this->invalid('student_id', 'Ya existe una matrícula activa para este estudiante y año.');
        }
    }

    public function save(array $data, Request $request, ?int $id = null): Enrollment
    {
        return DB::transaction(function () use ($data, $request, $id) {
            $this->lock();
            $e = $id ? Enrollment::lockForUpdate()->findOrFail($id) : new Enrollment;
            if ($id && ! in_array($e->status->value, ['DRAFT', 'OBSERVED'])) {
                $this->invalid('status', 'Solo se puede editar un borrador o una matrícula observada.');
            }
            if ($id && isset($data['student_id']) && $data['student_id'] != $e->student_id) {
                $this->invalid('student_id', 'El estudiante es inmutable.');
            }
            $old = $id ? $e->attributesToArray() : null;
            $values = array_merge($old ?? [], $data);
            [, $year] = $this->validateReferences($values);
            $this->unique($values, $id);
            if (! $id) {
                // Institution lock serializes generation; archived records retain their codes.
                $next = (int) Enrollment::withTrashed()->max('id') + 1;
                $e->enrollment_code = 'MAT-'.$year->start_date->format('Y').'-'.str_pad((string) $next, 6, '0', STR_PAD_LEFT);
                $e->status = 'DRAFT';
            }
            $e->fill($data)->save();
            if (! $id) {
                $e->history()->create(['previous_status' => null, 'new_status' => 'DRAFT', 'changed_by' => $request->user()->id]);
            }
            $this->audit->record($id ? 'UPDATE' : 'CREATE', $e, $old, $request);

            return $e;
        }, 3);
    }

    public function approve(Enrollment $e): void
    {
        [, $year, ,$section] = $this->validateReferences($e->attributesToArray());
        if ($year->status->value !== 'ACTIVE') {
            $this->invalid('academic_year_id', 'El año académico debe estar ACTIVE para aprobar.');
        }
        $this->unique($e->attributesToArray(), $e->id);
        $occupied = Enrollment::withTrashed()->where('section_id', $section->id)->where('status', 'APPROVED')->whereKeyNot($e->id)->count();
        if ($section->capacity !== null && $occupied >= $section->capacity) {
            $this->invalid('section_id', 'La sección no tiene cupos disponibles.');
        }
        // Active year-specific concept makes payment mandatory; no frontend bypass.
        $concept = PaymentConcept::where('code', 'MATRICULA_'.$year->start_date->format('Y'))->where('status', 'ACTIVE')->first();
        if ($concept && ! StudentPayment::where('student_id', $e->student_id)->where('academic_year_id', $year->id)->where('payment_concept_id', $concept->id)->where('status', 'PAID')->whereNotNull('validated_by')->whereNotNull('paid_at')->where('amount', '>=', $concept->amount)->exists()) {
            $this->invalid('payment', 'Falta un pago de matrícula completo y validado para este estudiante y año.');
        }
    }
}
