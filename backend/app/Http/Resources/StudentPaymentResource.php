<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentPaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        $this->resource->loadMissing(['student.user', 'concept', 'academicYear', 'validator']);
        $data = $this->resource->attributesToArray();
        $data['student'] = ['id' => $this->student_id, 'name' => $this->student?->user?->name, 'student_code' => $this->student?->student_code];
        $data['concept'] = ['id' => $this->payment_concept_id, 'name' => $this->concept?->name, 'code' => $this->concept?->code];
        $data['academic_year'] = ['id' => $this->academic_year_id, 'name' => $this->academicYear?->name];
        $data['validator'] = $this->validator?->name;

        return $data;
    }
}
