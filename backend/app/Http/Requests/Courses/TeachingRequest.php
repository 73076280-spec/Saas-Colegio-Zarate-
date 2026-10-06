<?php

namespace App\Http\Requests\Courses;

use Illuminate\Foundation\Http\FormRequest;

class TeachingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $type = $this->route('teaching');
        $operation = $this->route('operation') ?: ($this->isMethod('post') ? 'create' : 'update');
        if ($type === 'teacher-assignments' && $this->input('status') === 'INACTIVE' && ! $this->user()->can('teacher-assignments.disable')) {
            return false;
        }

        return $this->user()->can($type.'.'.$operation);
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('code')) {
            $this->merge(['code' => mb_strtoupper(trim((string) $this->input('code')))]);
        }
    }

    public function rules(): array
    {
        if ($this->route('operation')) {
            return ['institution_id' => ['prohibited'], 'status' => ['prohibited']];
        }
        $create = $this->isMethod('post');
        $required = $create ? 'required' : 'sometimes';
        $rules = ['institution_id' => ['prohibited'], 'status' => $create ? ['prohibited'] : ['sometimes', $this->route('teaching') === 'courses' ? 'in:INACTIVE' : 'in:ACTIVE,INACTIVE']];
        foreach (['academic_year_id', 'teacher_id', 'subject_id', 'grade_level_id', 'section_id'] as $field) {
            $rules[$field] = [$required, 'integer', 'min:1'];
        }
        if ($this->route('teaching') === 'courses') {
            $rules += ['name' => [$required, 'string', 'max:150'], 'code' => [$required, 'regex:/^[A-Z0-9_-]+$/', 'max:60'], 'description' => ['nullable', 'string', 'max:2000'], 'teacher_assignment_id' => ['nullable', 'integer', 'min:1']];
        }

        return $rules;
    }
}
