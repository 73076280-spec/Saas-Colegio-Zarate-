<?php

namespace App\Services\People;

use App\Enums\GuardianStatus;
use App\Enums\RoleName;
use App\Enums\StudentStatus;
use App\Enums\TeacherStatus;
use App\Models\People\Guardian;
use App\Models\People\Person;
use App\Models\People\Student;
use App\Models\People\Teacher;

class PeopleCatalog
{
    public const MODELS = ['students' => Student::class, 'teachers' => Teacher::class, 'guardians' => Guardian::class];

    public static function model(string $type): string
    {
        return self::MODELS[$type] ?? abort(404);
    }

    public static function key(Person $person): string
    {
        return array_search($person::class, self::MODELS, true);
    }

    public static function role(string $type): RoleName
    {
        return match ($type) {
            'students' => RoleName::STUDENT,'teachers' => RoleName::TEACHER,'guardians' => RoleName::GUARDIAN
        };
    }

    public static function status(string $type): string
    {
        return match ($type) {
            'students' => StudentStatus::class,'teachers' => TeacherStatus::class,'guardians' => GuardianStatus::class
        };
    }

    public static function fields(string $type): array
    {
        return array_merge(['document_type', 'document_number', 'status'], match ($type) {
            'students' => ['student_code', 'birth_date', 'gender', 'address', 'admission_date'],
            'teachers' => ['teacher_code', 'specialty', 'hire_date'],
            'guardians' => ['occupation', 'address'],
        });
    }

    public static function permissions(): array
    {
        $list = ['student-guardians.view', 'student-guardians.manage'];
        foreach (array_keys(self::MODELS) as $type) {
            foreach (['view', 'create', 'update', 'disable'] as $verb) {
                $list[] = "$type.$verb";
            }
        }

        return $list;
    }
}
