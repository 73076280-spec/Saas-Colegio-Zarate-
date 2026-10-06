<?php

namespace App\Policies;

use App\Models\Enrollment\StudentPayment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, StudentPayment $payment): bool
    {
        return (int) $user->institution_id === (int) $payment->institution_id && $user->can('payments.view');
    }

    public function update(User $user, StudentPayment $payment): bool
    {
        return (int) $user->institution_id === (int) $payment->institution_id && $user->can('payments.update');
    }

    public function validatePayment(User $user, StudentPayment $payment): bool
    {
        return (int) $user->institution_id === (int) $payment->institution_id && $user->can('payments.validate');
    }
}
