<?php

namespace App\Http\Requests\People;

use App\Services\People\PeopleCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PersonListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can($this->route('people').($this->route('accounts') ? '.create' : '.view'));
    }

    public function rules(): array
    {
        return ['search' => ['nullable', 'string', 'max:100'], 'status' => ['nullable', Rule::enum(PeopleCatalog::status($this->route('people')))],
            'document_number' => ['nullable', 'string', 'max:30'], 'student_code' => ['nullable', 'string', 'max:40'], 'teacher_code' => ['nullable', 'string', 'max:40'],
            'page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'min:1', 'max:100']];
    }
}
