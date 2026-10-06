<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
{
    public function toArray($request): array
    {
        $this->resource->loadMissing(['student.user', 'academicYear', 'gradeLevel.educationLevel', 'section']);
        $data = parent::toArray($request);
        unset($data['student'],$data['academic_year'],$data['grade_level'],$data['section'],$data['history']);
        $data['student'] = ['id' => $this->student_id, 'name' => $this->student?->user?->name, 'student_code' => $this->student?->student_code];
        $data['academic_year'] = ['id' => $this->academic_year_id, 'name' => $this->academicYear?->name];
        $data['grade_level'] = ['id' => $this->grade_level_id, 'name' => $this->gradeLevel?->name, 'level' => $this->gradeLevel?->educationLevel?->name];
        $data['section'] = ['id' => $this->section_id, 'name' => $this->section?->name, 'capacity' => $this->section?->capacity];
        if ($this->resource->relationLoaded('history')) {
            $data['history'] = $this->history->map(fn ($h) => ['id' => $h->id, 'previous_status' => $h->previous_status, 'new_status' => $h->new_status, 'changed_by' => $h->changed_by, 'actor' => $h->actor?->name, 'comment' => $h->comment, 'created_at' => $h->created_at]);
        }

        return $data;
    }
}
