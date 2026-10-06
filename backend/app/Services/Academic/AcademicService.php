<?php

namespace App\Services\Academic;

use App\Enums\AcademicPeriodStatus;
use App\Enums\AcademicYearStatus;
use App\Enums\AuditAction;
use App\Enums\CatalogStatus;
use App\Models\Academic\AcademicPeriod;
use App\Models\Academic\AcademicRecord;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\EducationLevel;
use App\Models\Academic\GradeLevel;
use App\Models\AuditLog;
use App\Models\Institution;
use App\Services\InstitutionContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class AcademicService
{
    public function save(string $catalog, array $data, Request $request, ?AcademicRecord $record = null, ?string $operation = null): AcademicRecord
    {
        return DB::transaction(function () use ($catalog, $data, $request, $record, $operation) {
            Institution::whereKey(app(InstitutionContext::class)->requireId())->lockForUpdate()->firstOrFail();
            if ($record) {
                $record = AcademicCatalog::model($catalog)::lockForUpdate()->findOrFail($record->id);
            }
            $old = $record?->attributesToArray();
            if ($record && in_array($catalog, ['academic-years', 'academic-periods']) && $record->status->value === AcademicYearStatus::CLOSED->value) {
                $this->invalid('status', 'Un registro cerrado no admite modificaciones.');
            }
            if ($operation === 'close') {
                $data = ['status' => AcademicYearStatus::CLOSED->value];
            }
            if ($operation === 'disable') {
                $data = ['status' => CatalogStatus::INACTIVE->value];
            }
            foreach (['academic_year_id', 'education_level_id', 'grade_level_id'] as $field) {
                if ($record && isset($data[$field]) && (int) $record->{$field} !== (int) $data[$field]) {
                    $this->invalid($field, 'La relación histórica no puede cambiarse; crea un nuevo registro.');
                }
            }
            $values = array_merge($old ?? [], $data);
            $action = $record ? AuditAction::UPDATE : AuditAction::CREATE;
            if (($data['status'] ?? null) === AcademicYearStatus::CLOSED->value) {
                if ($record) {
                    Gate::authorize('close', $record);
                } else {
                    Gate::authorize($catalog.'.close');
                }
                $action = AuditAction::CLOSE;
            }
            if ($catalog === 'subjects' && ($data['status'] ?? null) === CatalogStatus::INACTIVE->value && ($old['status'] ?? null) !== CatalogStatus::INACTIVE->value) {
                if ($record) {
                    Gate::authorize('disable', $record);
                } else {
                    Gate::authorize('subjects.disable');
                }
                $action = AuditAction::DISABLE;
            }
            if ($record && ($data['status'] ?? null) === CatalogStatus::INACTIVE->value && ($old['status'] ?? null) !== CatalogStatus::INACTIVE->value) {
                $action = AuditAction::DISABLE;
            }
            if ($catalog === 'academic-years') {
                $this->dates($values);
                if (($data['is_current'] ?? false) && ($values['status'] ?? AcademicYearStatus::DRAFT->value) === AcademicYearStatus::CLOSED->value) {
                    $this->invalid('is_current', 'Un año cerrado no puede ser actual.');
                }
                if (($data['is_current'] ?? false) || (($data['status'] ?? null) === AcademicYearStatus::ACTIVE->value && ($old['status'] ?? null) !== AcademicYearStatus::ACTIVE->value)) {
                    $data['status'] = AcademicYearStatus::ACTIVE->value;
                    $data['is_current'] = true;
                }
                if (in_array($data['status'] ?? null, [AcademicYearStatus::DRAFT->value, AcademicYearStatus::CLOSED->value])) {
                    $data['is_current'] = false;
                }
                if ($record && $record->periods()->where(function ($query) use ($values) {
                    $query->where('start_date', '<', $values['start_date'])->orWhere('end_date', '>', $values['end_date']);
                })->exists()) {
                    $this->invalid('start_date', 'Las fechas deben contener todos los periodos existentes.');
                }
            }
            if (in_array($catalog, ['academic-periods', 'sections'])) {
                $year = AcademicYear::findOrFail($values['academic_year_id']);
                if ($year->status === AcademicYearStatus::CLOSED) {
                    $this->invalid('academic_year_id', 'El año académico está cerrado.');
                }
                if ($catalog === 'academic-periods') {
                    $this->dates($values);
                    if ($values['start_date'] < $year->start_date->format('Y-m-d') || $values['end_date'] > $year->end_date->format('Y-m-d')) {
                        $this->invalid('start_date', 'El periodo debe estar dentro de las fechas del año.');
                    }
                    $overlap = AcademicPeriod::where('academic_year_id', $year->id)
                        ->when($record, fn ($query) => $query->whereKeyNot($record->id))
                        ->where('start_date', '<=', $values['end_date'])->where('end_date', '>=', $values['start_date'])->exists();
                    if ($overlap) {
                        $this->invalid('start_date', 'El periodo se solapa con otro periodo del año.');
                    }
                    if (($data['status'] ?? null) === AcademicYearStatus::CLOSED->value) {
                        $data['grading_open'] = false;
                    }
                } else {
                    $grade = GradeLevel::findOrFail($values['grade_level_id']);
                    if ($grade->status !== CatalogStatus::ACTIVE || $grade->educationLevel->status !== CatalogStatus::ACTIVE) {
                        $this->invalid('grade_level_id', 'El grado y su nivel deben estar activos.');
                    }
                }
            }
            if ($catalog === 'grade-levels' && EducationLevel::findOrFail($values['education_level_id'])->status !== CatalogStatus::ACTIVE) {
                $this->invalid('education_level_id', 'El nivel debe estar activo.');
            }
            $this->unique($catalog, $values, $record);
            if ($catalog === 'academic-years' && ($data['is_current'] ?? false)) {
                foreach (AcademicYear::where('is_current', true)->when($record, fn ($q) => $q->whereKeyNot($record->id))->get() as $previous) {
                    $before = $previous->attributesToArray();
                    $previous->update(['is_current' => false]);
                    $this->audit(AuditAction::UPDATE, $previous, $before, $request);
                }
            }
            $result = $record ?? new (AcademicCatalog::model($catalog));
            $result->fill($data)->save();
            $result->refresh();
            if ($result instanceof AcademicYear && $result->status === AcademicYearStatus::CLOSED) {
                foreach ($result->periods()->where('status', '!=', AcademicPeriodStatus::CLOSED->value)->get() as $period) {
                    $before = $period->attributesToArray();
                    $period->update(['status' => AcademicPeriodStatus::CLOSED, 'grading_open' => false]);
                    $this->audit(AuditAction::CLOSE, $period, $before, $request);
                }
            }
            $this->audit($record ? $action : AuditAction::CREATE, $result, $old, $request);

            return $result->load(AcademicCatalog::RELATIONS[$catalog]);
        }, 3);
    }

    private function dates(array $values): void
    {
        if ($values['start_date'] >= $values['end_date']) {
            $this->invalid('end_date', 'La fecha final debe ser posterior a la inicial.');
        }
    }

    private function unique(string $catalog, array $values, ?AcademicRecord $record): void
    {
        $fields = match ($catalog) {
            'academic-periods' => ['sequence'],'education-levels','grade-levels','subjects' => ['name', 'code'],default => ['name']
        };
        foreach ($fields as $field) {
            $query = AcademicCatalog::model($catalog)::query();
            if (in_array($catalog, ['academic-years', 'education-levels', 'grade-levels', 'subjects'])) {
                $query->withTrashed();
            }
            $query->where($field, $values[$field])->when($record, fn ($q) => $q->whereKeyNot($record->id));
            foreach (AcademicCatalog::FILTERS[$catalog] as $parent) {
                if ($parent !== 'is_current') {
                    $query->where($parent, $values[$parent]);
                }
            }
            if ($query->exists()) {
                $this->invalid($field, 'Ya existe un registro con este valor en el mismo ámbito.');
            }
        }
    }

    private function audit(AuditAction $action, AcademicRecord $record, ?array $old, Request $request): void
    {
        $clean = fn (?array $values) => $values === null ? null : array_diff_key($values, array_flip(['created_at', 'updated_at', 'deleted_at', 'current_institution_id']));
        AuditLog::create(['user_id' => $request->user()->id, 'action' => $action, 'entity_type' => $record->getTable(), 'entity_id' => $record->id,
            'old_values' => $clean($old), 'new_values' => $clean($record->attributesToArray()),
            'ip_address' => $request->ip(), 'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500)]);
    }

    private function invalid(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => $message]);
    }
}
