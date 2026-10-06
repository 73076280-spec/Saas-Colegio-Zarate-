<?php

namespace App\Http\Requests\Courses;

use Illuminate\Foundation\Http\FormRequest;

class TeachingListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $rules = ['search' => ['nullable', 'string', 'max:100'], 'status' => ['nullable', 'in:DRAFT,ACTIVE,INACTIVE,CLOSED'], 'page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'], 'kind' => ['sometimes', 'in:teachers,subjects,years,grades,sections']];
        foreach (['academic_year_id', 'teacher_id', 'subject_id', 'grade_level_id', 'section_id'] as $field) {
            $rules[$field] = ['nullable', 'integer', 'min:1'];
        }

        return $rules;
    }
}
