<?php

namespace App\Services\Enrollment;

use App\Models\Academic\AcademicYear;
use App\Models\Enrollment\PaymentConcept;
use App\Models\Enrollment\StudentPayment;
use App\Models\People\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(private EnrollmentService $service, private EnrollmentAudit $audit) {}

    public function concept(array $data, Request $request): PaymentConcept
    {
        return DB::transaction(function () use ($data, $request) {
            $this->service->lock();
            $p = PaymentConcept::create($data);
            $this->audit->record('CREATE', $p, null, $request);

            return $p;
        }, 3);
    }

    public function save(array $data, Request $request, ?int $id = null): StudentPayment
    {
        return DB::transaction(function () use ($data, $request, $id) {
            $this->service->lock();
            $p = $id ? StudentPayment::lockForUpdate()->findOrFail($id) : new StudentPayment;
            if ($id && in_array($p->status->value, ['PAID', 'CANCELLED'])) {
                $this->service->invalid('status', 'Los pagos validados o cancelados son inmutables.');
            }
            $old = $id ? $p->attributesToArray() : null;
            if ($id) {
                foreach (['student_id', 'academic_year_id', 'payment_concept_id'] as $field) {
                    if (isset($data[$field]) && $data[$field] != $p->$field) {
                        $this->service->invalid($field, 'La referencia del pago es inmutable.');
                    }
                }
            }
            $v = array_merge($old ?? [], $data);
            if (! Student::whereKey($v['student_id'])->where('status', 'ACTIVE')->exists()) {
                $this->service->invalid('student_id', 'Estudiante activo no disponible.');
            }
            if (! AcademicYear::whereKey($v['academic_year_id'])->where('status', '!=', 'CLOSED')->exists()) {
                $this->service->invalid('academic_year_id', 'Año académico no disponible.');
            }
            if (! PaymentConcept::whereKey($v['payment_concept_id'])->where('status', 'ACTIVE')->exists()) {
                $this->service->invalid('payment_concept_id', 'Concepto activo no disponible.');
            }
            $p->fill($data);
            if (! $id && ! isset($data['status'])) {
                $p->status = 'PENDING';
            } $p->save();
            $this->audit->record($id ? 'UPDATE' : 'CREATE', $p, $old, $request);

            return $p;
        }, 3);
    }

    public function validate(int $id, Request $request): StudentPayment
    {
        return DB::transaction(function () use ($id, $request) {
            $this->service->lock();
            $p = StudentPayment::lockForUpdate()->findOrFail($id);
            if (! in_array($p->status->value, ['PENDING', 'OVERDUE'])) {
                $this->service->invalid('status', 'Solo se validan pagos pendientes o vencidos.');
            }
            if ($p->concept?->status !== 'ACTIVE' || ! $p->academicYear || $p->academicYear->status->value === 'CLOSED' || $p->student?->status->value !== 'ACTIVE') {
                $this->service->invalid('payment', 'El estudiante, año y concepto deben estar disponibles.');
            }
            if ((int) round((float) $p->amount * 100) < (int) round((float) $p->concept->amount * 100)) {
                $this->service->invalid('amount', 'El importe no cubre el concepto.');
            }
            $old = $p->attributesToArray();
            $p->status = 'PAID';
            $p->paid_at = now();
            $p->validated_by = $request->user()->id;
            $p->save();
            $this->audit->record('PAYMENT_VALIDATE', $p, $old, $request);

            return $p;
        }, 3);
    }
}
