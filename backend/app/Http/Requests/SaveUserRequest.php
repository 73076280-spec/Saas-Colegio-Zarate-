<?php

namespace App\Http\Requests;

use App\Enums\UserStatus;
use App\Models\User;
use App\Services\InstitutionContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class SaveUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->route('user') ? $this->user()->can('update', $this->route('user')) : $this->user()->can('create', User::class);
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('email')) {
            $this->merge(['email' => mb_strtolower(trim((string) $this->input('email')))]);
        }
    }

    public function rules(): array
    {
        $required = $this->route('user') ? 'sometimes' : 'required';

        return [
            'first_name' => [$required, 'string', 'max:100'], 'last_name' => [$required, 'string', 'max:100'],
            'email' => [$required, 'email', 'max:255', Rule::unique('users')->where('institution_id', app(InstitutionContext::class)->requireId())->ignore($this->route('user'))],
            'password' => $this->route('user') ? ['prohibited'] : ['required', 'string', 'max:128', Password::min(12)->letters()->mixedCase()->numbers()],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'status' => ['sometimes', Rule::enum(UserStatus::class)],
            'roles' => ['sometimes', 'array', 'min:1', 'max:6'],
            'roles.*' => ['required', 'string', 'distinct', Rule::exists('roles', 'name')->where('institution_id', app(InstitutionContext::class)->requireId())],
            'institution_id' => ['prohibited'], 'permissions' => ['prohibited'], 'must_change_password' => ['prohibited'],
            'email_verified_at' => ['prohibited'], 'avatar_path' => ['prohibited'],
        ];
    }
}
