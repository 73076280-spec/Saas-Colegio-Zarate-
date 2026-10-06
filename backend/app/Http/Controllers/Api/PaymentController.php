<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Enrollment\EnrollmentListRequest;
use App\Http\Requests\Enrollment\PaymentRequest;
use App\Http\Resources\StudentPaymentResource;
use App\Models\Enrollment\PaymentConcept;
use App\Models\Enrollment\StudentPayment;
use App\Services\Enrollment\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PaymentController extends Controller
{
    public function concepts(EnrollmentListRequest $r)
    {
        Gate::authorize('payments.view');
        $q = PaymentConcept::query();
        if ($r->filled('search')) {
            $q->where('name', 'like', '%'.addcslashes($r->validated('search'), '%_\\').'%');
        }

        return $q->orderByDesc('id')->paginate($r->validated('per_page', 15));
    }

    public function storeConcept(PaymentRequest $r, PaymentService $s)
    {
        return response()->json(['data' => $s->concept($r->validated(), $r)], 201);
    }

    public function index(EnrollmentListRequest $r)
    {
        Gate::authorize('payments.view');
        $q = StudentPayment::query();
        foreach (['student_id', 'academic_year_id', 'status'] as $key) {
            if ($r->filled($key)) {
                $q->where($key, $r->validated($key));
            }
        }
        if ($r->filled('search')) {
            $search = '%'.addcslashes($r->validated('search'), '%_\\').'%';
            $q->whereHas('student.user', fn ($u) => $u->whereRaw("CONCAT(first_name,' ',last_name) LIKE ?", [$search]));
        }

        return StudentPaymentResource::collection($q->orderByDesc('id')->paginate($r->validated('per_page', 15)));
    }

    public function show(Request $r, int $id)
    {
        Gate::authorize('payments.view');

        Gate::authorize('view', StudentPayment::findOrFail($id));

        return new StudentPaymentResource(StudentPayment::findOrFail($id));
    }

    public function store(PaymentRequest $r, PaymentService $s)
    {
        return (new StudentPaymentResource($s->save($r->validated(), $r)))->response()->setStatusCode(201);
    }

    public function update(PaymentRequest $r, PaymentService $s, int $id)
    {
        Gate::authorize('update', StudentPayment::findOrFail($id));

        return new StudentPaymentResource($s->save($r->validated(), $r, $id));
    }

    public function validatePayment(PaymentRequest $r, PaymentService $s, int $id)
    {
        Gate::authorize('validatePayment', StudentPayment::findOrFail($id));

        return new StudentPaymentResource($s->validate($id, $r));
    }
}
