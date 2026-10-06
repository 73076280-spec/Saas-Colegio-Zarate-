<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LearningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return ['page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'between:1,100'], 'status' => ['sometimes', Rule::in(['DRAFT', 'PUBLISHED', 'CLOSED', 'SUBMITTED', 'LATE', 'REVIEWED', 'RETURNED'])]];
        }
        $rules = [];
        foreach (['institution_id', 'course_id', 'created_by', 'graded_by', 'graded_at', 'published_at', 'assignment_id', 'assessment_id', 'attempt', 'submitted_at', 'is_late', 'reviewed_by', 'reviewed_at', 'file_path', 'original_filename', 'mime_type', 'file_size', 'deleted_at'] as $field) {
            $rules[$field] = ['prohibited'];
        }
        $kind = $this->route('kind');
        $operation = $this->route('operation');
        if ($operation === 'review') {
            return $rules + ['status' => ['required', Rule::in(['REVIEWED', 'RETURNED'])], 'feedback' => ['required', 'string', 'max:5000']];
        }
        $rules['status'] = ['prohibited'];
        if ($operation) {
            return $rules;
        }
        $required = $this->route('id') ? 'sometimes' : 'required';
        if ($kind === 'submissions') {
            return $rules + ['student_id' => ['prohibited'], 'content' => ['sometimes', 'nullable', 'string', 'max:20000'], 'file' => ['sometimes', 'file', 'max:2048'], 'feedback' => ['prohibited']];
        }
        if ($kind === 'scores') {
            return $rules + [
                'student_id' => $this->route('id') ? ['prohibited'] : ['required', 'integer', 'min:1'],
                'score' => ['required', 'numeric', 'between:0,20', 'decimal:0,2'],
                'observations' => ['sometimes', 'nullable', 'string', 'max:5000'],
                'reason' => [$this->route('id') ? 'required' : 'sometimes', 'string', 'max:1000'],
            ];
        }
        $rules += ['title' => [$required, 'required', 'string', 'max:180'], 'description' => [$kind === 'assignments' ? $required : 'sometimes', $kind === 'assignments' ? 'required' : 'nullable', 'string', 'max:20000']];
        if ($kind === 'assignments') {
            return $rules + [
                'course_unit_id' => ['sometimes', 'nullable', 'integer', 'min:1'],
                'instructions' => ['sometimes', 'nullable', 'string', 'max:20000'],
                'due_at' => [$required, 'required', 'date'],
                'max_score' => ['sometimes', 'nullable', 'numeric', 'gt:0', 'max:20', 'decimal:0,2'],
                'allow_late_submission' => ['sometimes', 'boolean'],
            ];
        }

        return $rules + [
            'academic_period_id' => [$required, 'required', 'integer', 'min:1'],
            'assessment_type_id' => [$required, 'required', 'integer', 'min:1'],
            'max_score' => [$required, 'required', 'numeric', 'gt:0', 'max:20', 'decimal:0,2'],
            'weight' => ['sometimes', 'nullable', 'numeric', 'between:0,100', 'decimal:0,2'],
            'evaluation_date' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
        ];
    }
}
