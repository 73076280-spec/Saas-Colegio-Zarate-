<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('profile.update');
    }

    public function rules(): array
    {
        return ['first_name' => ['sometimes', 'required', 'string', 'max:100'], 'last_name' => ['sometimes', 'required', 'string', 'max:100'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'email' => ['prohibited'], 'institution_id' => ['prohibited'], 'roles' => ['prohibited'], 'permissions' => ['prohibited'],
            'status' => ['prohibited'], 'password' => ['prohibited'], 'must_change_password' => ['prohibited'], 'avatar_path' => ['prohibited']];
    }
}
