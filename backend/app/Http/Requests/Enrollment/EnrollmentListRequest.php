<?php

namespace App\Http\Requests\Enrollment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EnrollmentListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return ['academic_year_id' => ['nullable', 'integer', 'min:1'], 'grade_level_id' => ['nullable', 'integer', 'min:1'], 'section_id' => ['nullable', 'integer', 'min:1'], 'student_id' => ['nullable', 'integer', 'min:1'], 'status' => ['nullable', Rule::in(str_contains($this->path(), 'student-payments') ? ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'] : (str_contains($this->path(), 'payment-concepts') ? ['ACTIVE', 'INACTIVE'] : ['DRAFT', 'PENDING', 'OBSERVED', 'APPROVED', 'REJECTED', 'CANCELLED']))], 'search' => ['nullable', 'string', 'max:100'], 'page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'], 'kind' => ['sometimes', 'in:students,years,grades,sections']];
    }
}
