<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClassroomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policies are checked by the controller and again inside the transaction.
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return [
                'page' => ['sometimes', 'integer', 'min:1'],
                'per_page' => ['sometimes', 'integer', 'between:1,100'],
                'course_unit_id' => ['sometimes', 'nullable', 'integer', 'min:1'],
                'status' => ['sometimes', Rule::in(['DRAFT', 'PUBLISHED', 'ARCHIVED'])],
            ];
        }
        $rules = [];
        foreach (['institution_id', 'course_id', 'created_by', 'file_path', 'original_filename', 'mime_type', 'file_size', 'status', 'published_at', 'deleted_at'] as $field) {
            $rules[$field] = ['prohibited'];
        }
        if ($this->route('operation')) {
            return $rules;
        }
        $required = $this->route('id') ? 'sometimes' : 'required';
        $rules += [
            'title' => [$required, 'required', 'string', 'max:180'],
            'description' => ['sometimes', 'nullable', 'string', 'max:20000'],
        ];
        if ($this->route('kind') === 'course-units') {
            return $rules + ['sequence' => [$required, 'required', 'integer', 'between:1,100000']];
        }

        return $rules + [
            'type' => [$required, 'required', Rule::in(['FILE', 'LINK', 'TEXT'])],
            'course_unit_id' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'external_url' => ['sometimes', 'nullable', 'url:http,https', 'max:2000'],
            'file' => ['sometimes', 'file', 'max:2048'],
        ];
    }
}
