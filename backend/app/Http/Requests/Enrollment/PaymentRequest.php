<?php

namespace App\Http\Requests\Enrollment;

use App\Services\InstitutionContext;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('payments.'.($this->route('operation') === 'validate' ? 'validate' : ($this->isMethod('post') ? 'create' : 'update')));
    }

    public function rules(): array
    {
        if ($this->route('operation') === 'validate') {
            return ['comment' => ['nullable', 'string', 'max:2000']];
        }
        if ($this->route('concept')) {
            return [
                'name' => ['required', 'string', 'max:255'],
                'code' => ['required', 'regex:/^[A-Z0-9_-]+$/', 'max:60', Rule::unique('payment_concepts')->where('institution_id', app(InstitutionContext::class)->requireId())],
                'description' => ['nullable', 'string', 'max:2000'], 'amount' => ['required', 'numeric', 'decimal:0,2', 'min:0.01', 'max:9999999999.99'],
                'status' => ['sometimes', 'in:ACTIVE,INACTIVE'], 'institution_id' => ['prohibited']];
        }
        $r = $this->isMethod('post') ? 'required' : 'sometimes';

        return ['student_id' => [$r, 'integer', 'min:1'], 'academic_year_id' => [$r, 'integer', 'min:1'], 'payment_concept_id' => [$r, 'integer', 'min:1'], 'amount' => [$r, 'numeric', 'decimal:0,2', 'min:0.01', 'max:9999999999.99'],
            'due_date' => ['nullable', 'date_format:Y-m-d'], 'observations' => ['nullable', 'string', 'max:2000'],
            'status' => ['sometimes', 'in:PENDING,OVERDUE,CANCELLED'], 'institution_id' => ['prohibited'], 'paid_at' => ['prohibited'], 'validated_by' => ['prohibited']];
    }
}
