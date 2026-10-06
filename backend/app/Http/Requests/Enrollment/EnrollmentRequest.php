<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;

class EnrollmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $action = $this->route('operation');

        return $this->user()->can('enrollments.'.($action ?: ($this->isMethod('post') ? 'create' : 'update')));
    }

    public function rules(): array
    {
        if ($this->route('operation')) {
            return ['comment' => ['nullable', 'string', 'max:2000'], 'status' => ['prohibited'], 'institution_id' => ['prohibited']];
        }
        $required = $this->isMethod('post') ? 'required' : 'sometimes';

        return [
            'student_id' => [$required, 'integer', 'min:1'],
            'academic_year_id' => [$required, 'integer', 'min:1'],
            'grade_level_id' => [$required, 'integer', 'min:1'],
            'section_id' => [$required, 'integer', 'min:1'],
            'observations' => ['nullable', 'string', 'max:2000'],
            'status' => ['prohibited'], 'institution_id' => ['prohibited'], 'enrollment_code' => ['prohibited'],
            'approved_by' => ['prohibited'], 'approved_at' => ['prohibited'], 'enrolled_at' => ['prohibited'],
        ];
    }
}
