<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['email' => mb_strtolower(trim((string) $this->input('email'))), 'institution_code' => mb_strtoupper(trim((string) $this->input('institution_code')))]);
    }

    public function rules(): array
    {
        return ['institution_code' => ['required', 'string', 'max:40'], 'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'max:128'], 'institution_id' => ['prohibited']];
    }
}
