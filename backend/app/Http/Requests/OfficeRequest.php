<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfficeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return ['page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'between:1,100'],
                'search' => ['sometimes', 'nullable', 'string', 'max:180'], 'status' => ['sometimes', Rule::in(['ACTIVE', 'INACTIVE', 'REGISTERED', 'IN_REVIEW', 'OBSERVED', 'APPROVED', 'REJECTED', 'COMPLETED', 'DRAFT', 'ISSUED', 'CANCELLED', 'PUBLISHED', 'ARCHIVED', 'read', 'unread'])],
                'student_id' => ['sometimes', 'integer', 'min:1'], 'request_type_id' => ['sometimes', 'integer', 'min:1'], 'academic_request_id' => ['sometimes', 'integer', 'min:1'], 'date' => ['sometimes', 'date_format:Y-m-d']];
        }
        $rules = [];
        foreach (['institution_id', 'request_code', 'guardian_id', 'created_by', 'changed_by', 'document_number', 'file_path', 'original_filename', 'mime_type', 'file_size', 'issued_by', 'issued_at', 'published_at', 'status'] as $field) {
            $rules[$field] = ['prohibited'];
        }
        $op = $this->route('operation');
        $kind = $this->route('kind');
        $edit = (bool) $this->route('id');
        if ($op) {
            return $rules + ['comment' => [in_array($op, ['observe', 'reject']) ? 'required' : 'sometimes', 'nullable', 'string', 'max:3000'],
                'resolution' => [in_array($op, ['approve', 'reject', 'complete']) ? 'required' : 'sometimes', 'nullable', 'string', 'max:5000']];
        }
        if ($kind === 'requests') {
            return $rules + ['student_id' => [$edit ? 'prohibited' : 'sometimes', 'integer', 'min:1'], 'request_type_id' => [$edit ? 'prohibited' : 'required', 'integer', 'min:1'],
                'subject' => [$edit ? 'sometimes' : 'required', 'required', 'string', 'max:180'], 'description' => [$edit ? 'sometimes' : 'required', 'required', 'string', 'max:10000'],
                'assigned_to' => [$edit ? 'sometimes' : 'prohibited', 'nullable', 'integer', 'min:1'], 'resolution' => ['prohibited']];
        }
        if ($kind === 'documents') {
            return $rules + ['student_id' => ['required_without:academic_request_id', 'integer', 'min:1'], 'academic_request_id' => ['sometimes', 'nullable', 'integer', 'min:1'],
                'document_type' => ['required', 'string', 'max:100'], 'file' => ['sometimes', 'file', 'max:2048']];
        }
        if ($kind === 'communications') {
            return $rules + ['title' => [$edit ? 'sometimes' : 'required', 'required', 'string', 'max:180'], 'body' => [$edit ? 'sometimes' : 'required', 'required', 'string', 'max:20000'],
                'targets' => [$edit ? 'sometimes' : 'required', 'array', 'min:1', 'max:30'], 'targets.*' => ['required', 'array:kind,target'],
                'targets.*.kind' => ['required', Rule::in(['institution', 'role', 'grade', 'section', 'course', 'user'])],
                'targets.*.target' => ['required', 'string', 'max:60']];
        }

        return $rules;
    }
}
