<?php

namespace App\Services\Reports;

use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\StudentPayment;
use App\Models\User;

class TreasuryDashboard
{
    public function data(User $user, ?int $year): array
    {
        $d = new DashboardData($user);
        $payments = StudentPayment::when($year, fn ($q) => $q->where('academic_year_id', $year));
        $d->metric('payments.view', 'Pagos pendientes', fn () => (clone $payments)->whereIn('status', ['PENDING', 'OVERDUE'])->count());
        $d->metric('payments.view', 'Pagos validados', fn () => (clone $payments)->where('status', 'PAID')->whereNotNull('validated_by')->whereNotNull('paid_at')->count());
        $d->metric('payments.view', 'Pagos vencidos', fn () => (clone $payments)->whereIn('status', ['PENDING', 'OVERDUE'])->whereDate('due_date', '<', today())->count());
        $d->metric('payments.view', 'Monto pendiente (PEN)', fn () => number_format((float) (clone $payments)->whereIn('status', ['PENDING', 'OVERDUE'])->sum('amount'), 2, '.', ''));
        $d->metric('payments.view', 'Matrículas pendientes de validación económica', function () use ($year) {
            return Enrollment::when($year, fn ($q) => $q->where('academic_year_id', $year))->whereIn('status', ['PENDING', 'OBSERVED'])
                ->whereExists(function ($concept) {
                    $concept->selectRaw('1')->from('payment_concepts')
                        ->join('academic_years', 'academic_years.id', '=', 'enrollments.academic_year_id')
                        ->whereColumn('payment_concepts.institution_id', 'enrollments.institution_id')
                        ->whereRaw("payment_concepts.code = CONCAT('MATRICULA_', YEAR(academic_years.start_date))")
                        ->where('payment_concepts.status', 'ACTIVE')->whereNotExists(function ($p) {
                            $p->selectRaw('1')->from('student_payments')
                                ->whereColumn('student_payments.institution_id', 'enrollments.institution_id')
                                ->whereColumn('student_payments.student_id', 'enrollments.student_id')
                                ->whereColumn('student_payments.academic_year_id', 'enrollments.academic_year_id')
                                ->whereColumn('student_payments.payment_concept_id', 'payment_concepts.id')
                                ->whereColumn('student_payments.amount', '>=', 'payment_concepts.amount')
                                ->where('student_payments.status', 'PAID')->whereNotNull('student_payments.validated_by')->whereNotNull('student_payments.paid_at');
                        });
                })->count();
        });
        $d->link('payments.view', 'Pagos y validación', '/app/payments');

        return $d->toArray();
    }
}
