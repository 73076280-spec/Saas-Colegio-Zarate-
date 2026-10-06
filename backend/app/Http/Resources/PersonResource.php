<?php

namespace App\Http\Resources;

use App\Services\People\PeopleCatalog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PersonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $type = PeopleCatalog::key($this->resource);
        $private = (int) $request->user()->id === (int) $this->user_id || $request->user()->can($type.'.update');
        $data = $this->resource->attributesToArray();
        unset($data['deleted_at']);
        if (! $private) {
            $data['document_number'] = '****'.mb_substr($data['document_number'], -4);
            unset($data['birth_date'],$data['gender'],$data['address']);
        }
        $account = $this->user;
        $data['user'] = $account ? ['id' => $account->id, 'name' => $account->name, 'first_name' => $account->first_name, 'last_name' => $account->last_name,
            'email' => $private ? $account->email : null, 'phone' => $private ? $account->phone : null, 'status' => $account->status->value] : null;

        return $data;
    }
}
