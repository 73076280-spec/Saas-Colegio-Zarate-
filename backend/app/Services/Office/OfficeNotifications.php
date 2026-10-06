<?php

namespace App\Services\Office;

use App\Models\Office\AcademicRequest;
use App\Models\People\Guardian;
use App\Models\User;
use App\Notifications\OfficeNotification;

class OfficeNotifications
{
    public function send(iterable $users, string $kind, int $id, string $message, string $path): void
    {
        $sent = [];
        foreach ($users as $u) {
            if (isset($sent[$u->id]) || $u->status->value !== 'ACTIVE') {
                continue;
            }
            $u->notifyNow(new OfficeNotification(['kind' => $kind, 'entity_id' => $id, 'message' => $message, 'path' => $path]));
            $sent[$u->id] = true;
        }
    }

    public function request(AcademicRequest $r): void
    {
        $ids = [$r->student?->user_id];
        $ids = array_merge($ids, Guardian::where('status', 'ACTIVE')->whereHas('students', fn ($q) => $q->where('students.id', $r->student_id))->pluck('user_id')->all());
        $label = match ($r->status) {
            'IN_REVIEW' => 'en revisión','OBSERVED' => 'observada','APPROVED' => 'aprobada','REJECTED' => 'rechazada','COMPLETED' => 'completada',default => 'registrada'
        };
        $this->send(User::whereIn('id', array_filter($ids))->get(), 'request', $r->id, "La solicitud $r->request_code está $label.", '/app/my-requests?request='.$r->id);
    }
}
