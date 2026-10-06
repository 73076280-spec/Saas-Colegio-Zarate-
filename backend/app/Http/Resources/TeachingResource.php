<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TeachingResource extends JsonResource
{
    public function toArray($r): array
    {
        $this->resource->loadMissing(['academicYear', 'teacher.user', 'subject', 'gradeLevel.educationLevel', 'section']);
        $data = $this->resource->attributesToArray();
        unset($data['deleted_at']);
        $data['teacher'] = ['id' => $this->teacher_id, 'name' => $this->teacher?->user?->name];
        $data['subject'] = ['id' => $this->subject_id, 'name' => $this->subject?->name];
        $data['academic_year'] = ['id' => $this->academic_year_id, 'name' => $this->academicYear?->name];
        $data['grade_level'] = ['id' => $this->grade_level_id, 'name' => $this->gradeLevel?->name, 'level' => $this->gradeLevel?->educationLevel?->name];
        $data['section'] = ['id' => $this->section_id, 'name' => $this->section?->name];

        return $data;
    }
}
