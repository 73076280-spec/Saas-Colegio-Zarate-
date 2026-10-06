<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'student_id' => $this->student_id, 'guardian_id' => $this->guardian_id,
            'student' => ['id' => $this->student_id, 'name' => $this->student?->user?->name ?? 'Cuenta archivada', 'student_code' => $this->student?->student_code, 'status' => $this->student?->status->value],
            'guardian' => ['id' => $this->guardian_id, 'name' => $this->guardian?->user?->name ?? 'Cuenta archivada', 'status' => $this->guardian?->status->value],
            'relationship' => $this->relationship->value, 'is_primary' => $this->is_primary, 'can_pick_up' => $this->can_pick_up, 'receives_notifications' => $this->receives_notifications];
    }
}
