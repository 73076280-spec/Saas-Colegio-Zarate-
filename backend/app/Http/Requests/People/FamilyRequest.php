<?php

namespace App\Http\Requests\People;

use App\Enums\FamilyRelationship;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FamilyRequest extends FormRequest
{
    public function student(): Student
    {
        return Student::findOrFail($this->route('student'));
    }

    public function link(): ?StudentGuardian
    {
        return $this->route('guardian') ? StudentGuardian::where('student_id', $this->student()->id)->where('guardian_id', $this->route('guardian'))->firstOrFail() : null;
    }

    public function authorize(): bool
    {
        $this->student();
        if ($this->isMethod('get')) {
            return $this->user()->can('student-guardians.view');
        }

        return $this->link() ? $this->user()->can('update', $this->link()) : $this->user()->can('student-guardians.manage');
    }

    public function rules(): array
    {
        if ($this->isMethod('get')) {
            return ['page' => ['sometimes', 'integer', 'min:1'], 'per_page' => ['sometimes', 'integer', 'min:1', 'max:100']];
        }
        $rules = ['institution_id' => ['prohibited'], 'student_id' => ['prohibited']];
        if ($this->isMethod('delete')) {
            return $rules;
        }

        return $rules + ['guardian_id' => $this->link() ? ['prohibited'] : ['required', 'integer', function ($attribute, $value, $fail) {
            if (! Guardian::whereKey($value)->exists()) {
                $fail('El apoderado no existe en tu institución.');
            }
        }], 'relationship' => [$this->link() ? 'sometimes' : 'required', Rule::enum(FamilyRelationship::class)], 'is_primary' => ['sometimes', 'boolean'],
            'can_pick_up' => ['sometimes', 'boolean'], 'receives_notifications' => ['sometimes', 'boolean']];
    }
}
