<?php

namespace App\Services\Enrollment;

use App\Models\Enrollment\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransitionEnrollmentStatusAction
{
    public const TRANSITIONS = ['submit' => [['DRAFT', 'OBSERVED'], 'PENDING'], 'observe' => [['PENDING'], 'OBSERVED'], 'approve' => [['PENDING'], 'APPROVED'], 'reject' => [['PENDING'], 'REJECTED'], 'cancel' => [['APPROVED'], 'CANCELLED']];

    public function __construct(private EnrollmentService $service, private EnrollmentAudit $audit) {}

    public function execute(int $id, string $operation, Request $request): Enrollment
    {
        return DB::transaction(function () use ($id, $operation, $request) {
            $this->service->lock();
            $e = Enrollment::lockForUpdate()->findOrFail($id);
            [$from,$to] = self::TRANSITIONS[$operation];
            if (! in_array($e->status->value, $from)) {
                $this->service->invalid('status', 'Transición no permitida desde '.$e->status->value.'.');
            }
            if (in_array($operation, ['observe', 'reject', 'cancel']) && ! trim((string) $request->input('comment'))) {
                $this->service->invalid('comment', 'Indica el motivo de esta decisión.');
            }
            if ($operation === 'submit') {
                $this->service->validateReferences($e->attributesToArray());
                $this->service->unique($e->attributesToArray(), $e->id);
            }
            if ($operation === 'approve') {
                $this->service->approve($e);
            }
            $old = $e->attributesToArray();
            $e->status = $to;
            if ($operation === 'approve') {
                $e->approved_by = $request->user()->id;
                $e->approved_at = now();
                $e->enrolled_at = now();
            }
            $e->save();
            $e->history()->create(['previous_status' => $old['status'], 'new_status' => $to, 'changed_by' => $request->user()->id, 'comment' => $request->input('comment')]);
            $this->audit->record(strtoupper($operation), $e, $old, $request);

            return $e;
        }, 3);
    }
}
