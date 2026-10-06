<?php

namespace App\Models\People;

use App\Enums\DocumentType;
use App\Enums\TeacherStatus;
use Database\Factories\TeacherFactory;

class Teacher extends Person
{
    protected function casts(): array
    {
        return ['status' => TeacherStatus::class, 'document_type' => DocumentType::class, 'hire_date' => 'date:Y-m-d'];
    }

    protected static function newFactory()
    {
        return TeacherFactory::new();
    }
}
