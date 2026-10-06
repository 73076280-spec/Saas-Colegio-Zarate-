<?php

namespace App\Http\Requests\People;

use App\Enums\DocumentType;
use App\Enums\PersonGender;
use App\Models\People\Person;
use App\Models\User;
use App\Services\People\PeopleCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class SavePersonRequest extends FormRequest
{
    private ?Person $person = null;

    public function person(): ?Person
    {
        return $this->route('person') ? ($this->person ??= PeopleCatalog::model($this->route('people'))::findOrFail($this->route('person'))) : null;
    }

    public function authorize(): bool
    {
        return $this->person() ? $this->user()->can($this->route('operation') ?? 'update', $this->person()) : $this->user()->can($this->route('people').'.create');
    }

    protected function prepareForValidation(): void
    {
        foreach (['student_code', 'teacher_code', 'document_number'] as $field) {
            if (is_string($this->input($field))) {
                $this->merge([$field => mb_strtoupper(trim($this->input($field)))]);
            }
        }
        if (is_array($this->input('account')) && is_string($this->input('account.email'))) {
            $account = $this->input('account');
            $account['email'] = mb_strtolower(trim($account['email']));
            $this->merge(['account' => $account]);
        }
    }

    public function rules(): array
    {
        $base = ['institution_id' => ['prohibited'], 'roles' => ['prohibited'], 'permissions' => ['prohibited'], 'must_change_password' => ['prohibited']];
        if ($this->route('operation')) {
            return $base;
        }
        $type = $this->route('people');
        $required = $this->person() ? 'sometimes' : 'required';
        $rules = $base + [
            'user_id' => $this->person() ? ['prohibited'] : ['required_without:account', Rule::prohibitedIf($this->filled('account')), 'integer', function ($attribute, $value, $fail) {
                if (! User::whereKey($value)->exists()) {
                    $fail('La cuenta no existe en tu institución.');
                }
            }],
            'account' => $this->person() ? ['prohibited'] : ['required_without:user_id', Rule::prohibitedIf($this->filled('user_id')), 'array:first_name,last_name,email,password,phone'],
            'account.first_name' => ['required_with:account', 'string', 'max:100'], 'account.last_name' => ['required_with:account', 'string', 'max:100'],
            'account.email' => ['required_with:account', 'email', 'max:255'],
            'account.password' => ['required_with:account', 'string', 'max:128', Password::min(12)->letters()->mixedCase()->numbers()],
            'account.phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'document_type' => [$required, Rule::enum(DocumentType::class)], 'document_number' => [$required, 'string', 'max:30', 'regex:/^[A-Z0-9-]+$/'],
            'status' => ['sometimes', Rule::enum(PeopleCatalog::status($type))],
        ];
        if ($type === 'students') {
            $rules += ['student_code' => [$required, 'string', 'max:40'], 'birth_date' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
                'gender' => ['sometimes', 'nullable', Rule::enum(PersonGender::class)], 'admission_date' => ['sometimes', 'nullable', 'date_format:Y-m-d']];
        }
        if ($type === 'teachers') {
            $rules += ['teacher_code' => [$required, 'string', 'max:40'], 'specialty' => ['sometimes', 'nullable', 'string', 'max:255'], 'hire_date' => ['sometimes', 'nullable', 'date_format:Y-m-d']];
        }
        if ($type === 'guardians') {
            $rules['occupation'] = ['sometimes', 'nullable', 'string', 'max:255'];
        }
        if ($type !== 'teachers') {
            $rules['address'] = ['sometimes', 'nullable', 'string', 'max:500'];
        }

        return $rules;
    }
}
