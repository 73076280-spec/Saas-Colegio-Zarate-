<?php

namespace App\Http\Requests\Academic;

use App\Enums\AcademicPeriodStatus;
use App\Enums\AcademicYearStatus;
use App\Enums\CatalogStatus;
use App\Models\Academic\AcademicRecord;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\EducationLevel;
use App\Models\Academic\GradeLevel;
use App\Services\Academic\AcademicCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveAcademicRequest extends FormRequest
{
    private ?AcademicRecord $record = null;

    public function record(): ?AcademicRecord
    {
        if (! $this->route('record')) {
            return null;
        }

        return $this->record ??= AcademicCatalog::model($this->route('catalog'))::findOrFail($this->route('record'));
    }

    public function authorize(): bool
    {
        $action = $this->route('operation') ?? 'update';

        return $this->record() ? $this->user()->can($action, $this->record()) : $this->user()->can($this->route('catalog').'.create');
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('code'))) {
            $this->merge(['code' => mb_strtoupper(trim($this->input('code')))]);
        }
    }

    public function rules(): array
    {
        if ($this->route('operation')) {
            return ['institution_id' => ['prohibited']];
        }
        $catalog = $this->route('catalog');
        $required = $this->record() ? 'sometimes' : 'required';
        $rules = ['name' => [$required, 'required', 'string', 'max:100'], 'institution_id' => ['prohibited'],
            'current_institution_id' => ['prohibited'], 'id' => ['prohibited'],
            'status' => ['sometimes', 'required', Rule::enum(match ($catalog) {
                'academic-years' => AcademicYearStatus::class,'academic-periods' => AcademicPeriodStatus::class,default => CatalogStatus::class,
            })]];
        if (in_array($catalog, ['academic-years', 'academic-periods'])) {
            $rules += ['start_date' => [$required, 'required', 'date_format:Y-m-d'], 'end_date' => [$required, 'required', 'date_format:Y-m-d']];
        }
        if ($catalog === 'academic-years') {
            $rules['is_current'] = ['sometimes', 'boolean'];
        }
        if ($catalog === 'academic-periods') {
            $rules += ['sequence' => [$required, 'required', 'integer', 'min:1', 'max:65535'], 'grading_open' => ['sometimes', 'boolean']];
        }
        if (in_array($catalog, ['education-levels', 'grade-levels', 'subjects'])) {
            $rules['code'] = [$required, 'required', 'string', 'max:40'];
        }
        if (in_array($catalog, ['education-levels', 'grade-levels'])) {
            $rules['sort_order'] = ['sometimes', 'integer', 'min:0', 'max:65535'];
        }
        if ($catalog === 'subjects') {
            $rules['description'] = ['sometimes', 'nullable', 'string', 'max:5000'];
        }
        if ($catalog === 'sections') {
            $rules['capacity'] = ['sometimes', 'nullable', 'integer', 'min:1', 'max:100000'];
        }
        $relations = match ($catalog) {
            'academic-periods' => ['academic_year_id' => AcademicYear::class],
            'grade-levels' => ['education_level_id' => EducationLevel::class],
            'sections' => ['academic_year_id' => AcademicYear::class, 'grade_level_id' => GradeLevel::class],
            default => [],
        };
        foreach ($relations as $field => $class) {
            $rules[$field] = [$required, 'required', 'integer', function ($attribute, $value, $fail) use ($class) {
                if (! $class::whereKey($value)->exists()) {
                    $fail('La referencia no existe en tu institución.');
                }
            }];
        }

        return $rules;
    }
}
