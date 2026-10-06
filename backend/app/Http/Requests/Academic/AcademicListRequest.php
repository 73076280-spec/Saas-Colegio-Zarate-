<?php

namespace App\Http\Requests\Academic;

use App\Enums\AcademicPeriodStatus;
use App\Enums\AcademicYearStatus;
use App\Enums\CatalogStatus;
use App\Services\Academic\AcademicCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AcademicListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can($this->route('catalog').'.view');
    }

    public function rules(): array
    {
        $catalog = $this->route('catalog');
        $rules = ['search' => ['nullable', 'string', 'max:100'], 'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'status' => ['nullable', Rule::enum(match ($catalog) {
                'academic-years' => AcademicYearStatus::class, 'academic-periods' => AcademicPeriodStatus::class, default => CatalogStatus::class
            })]];
        foreach (AcademicCatalog::FILTERS[$catalog] as $field) {
            $rules[$field] = $field === 'is_current' ? ['sometimes', 'boolean'] : ['nullable', 'integer', 'min:1'];
        }

        return $rules;
    }
}
