<?php

namespace App\Http\Requests;

use App\Models\Courses\Course;
use App\Models\People\Student;
use App\Models\People\Teacher;
use App\Services\Reports\ReportCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $rules = [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'status' => ['sometimes', 'nullable', 'string', 'max:30', 'regex:/^[A-Z_]+$/'],
            'date_from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'date_to' => ['sometimes', 'nullable', 'date_format:Y-m-d', ...($this->filled('date_from') ? ['after_or_equal:date_from'] : [])],
            'institution_id' => ['prohibited'],
        ];
        foreach (['academic_year', 'academic_period', 'education_level', 'grade_level', 'section', 'course', 'subject', 'teacher', 'student'] as $name) {
            $class = match ($name) {
                'student' => Student::class,
                'teacher' => Teacher::class,
                'course' => Course::class,
                default => '\\App\\Models\\Academic\\'.Str::studly($name),
            };
            $rules[$name.'_id'] = ['sometimes', 'nullable', 'integer', function ($attribute, $value, $fail) use ($class) {
                if (! $class::whereKey($value)->exists()) {
                    $fail('La selección no está disponible en tu institución.');
                }
            }];
        }
        if ($key = $this->route('report')) {
            $allowed = ReportCatalog::filters($key);
            foreach (array_keys($rules) as $field) {
                if (! in_array($field, [...$allowed, 'page', 'per_page', ...($this->route('option') ? ['search'] : [])])) {
                    $rules[$field] = ['prohibited'];
                }
            }
        }

        return $rules;
    }
}
