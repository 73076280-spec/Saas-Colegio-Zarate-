<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        if ($this->isMethod('GET')) {
            return ['page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'between:1,100'],
                'status' => ['sometimes', Rule::in(['OPEN', 'CLOSED', 'PRESENT', 'ABSENT', 'LATE', 'JUSTIFIED', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED'])],
                'student_id' => ['sometimes', 'integer', 'min:1'], 'date' => ['sometimes', 'date_format:Y-m-d']];
        }
        $rules = [];
        foreach (['institution_id', 'course_id', 'attendance_session_id', 'attendance_record_id', 'created_by', 'recorded_by', 'reviewed_by', 'reviewed_at', 'closed_at', 'guardian_id', 'file_path', 'original_filename', 'mime_type', 'file_size'] as $key) {
            $rules[$key] = ['prohibited'];
        }
        $kind = $this->route('kind');
        $operation = $this->route('operation');
        if ($operation) {
            return $rules + ['status' => ['prohibited'], 'review_comment' => [$operation === 'reject' ? 'required' : 'sometimes', 'nullable', 'string', 'max:2000']];
        }
        if ($kind === 'sessions') {
            return $rules + ['status' => ['prohibited'], 'date' => [$this->route('id') ? 'sometimes' : 'required', 'date_format:Y-m-d'], 'topic' => ['sometimes', 'nullable', 'string', 'max:250']];
        }
        if ($kind === 'justifications') {
            return $rules + ['student_id' => ['prohibited'], 'status' => ['prohibited'], 'reason' => ['required', 'string', 'max:5000'], 'file' => ['sometimes', 'file', 'max:2048']];
        }
        $record = ['status' => ['required', Rule::in(['PRESENT', 'ABSENT', 'LATE'])], 'observations' => ['sometimes', 'nullable', 'string', 'max:2000']];
        if ($this->route('id')) {
            return $rules + $record + ['student_id' => ['prohibited']];
        }

        return $rules + ['records' => ['required', 'array', 'min:1', 'max:100'],
            'records.*' => ['required', 'array:student_id,status,observations'],
            'records.*.student_id' => ['required', 'integer', 'min:1', 'distinct:strict'],
            'records.*.status' => $record['status'], 'records.*.observations' => $record['observations']];
    }
}
