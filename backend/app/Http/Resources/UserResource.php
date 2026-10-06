<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'institution_id' => $this->institution_id,
            'first_name' => $this->first_name, 'last_name' => $this->last_name, 'name' => $this->name,
            'email' => $this->email, 'phone' => $this->phone, 'avatar_path' => $this->avatar_path,
            'status' => $this->status->value, 'must_change_password' => $this->must_change_password,
            'last_login_at' => $this->last_login_at?->toISOString(),
            'roles' => $this->getRoleNames(), 'permissions' => $this->getAllPermissions()->pluck('name')->values(),
            'institution' => ['id' => $this->institution->id, 'name' => $this->institution->name, 'code' => $this->institution->code]];
    }
}
