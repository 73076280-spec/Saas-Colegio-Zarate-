<?php

namespace App\Services\Academic;

use App\Models\Academic\AcademicPeriod;
use App\Models\Academic\AcademicRecord;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\EducationLevel;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Academic\Subject;

class AcademicCatalog
{
    public const MODELS = ['academic-years' => AcademicYear::class, 'academic-periods' => AcademicPeriod::class,
        'education-levels' => EducationLevel::class, 'grade-levels' => GradeLevel::class, 'sections' => Section::class, 'subjects' => Subject::class];

    public const RELATIONS = ['academic-years' => [], 'academic-periods' => ['academicYear'], 'education-levels' => [],
        'grade-levels' => ['educationLevel'], 'sections' => ['academicYear', 'gradeLevel.educationLevel'], 'subjects' => []];

    public const FILTERS = ['academic-years' => ['is_current'], 'academic-periods' => ['academic_year_id'],
        'education-levels' => [], 'grade-levels' => ['education_level_id'], 'sections' => ['academic_year_id', 'grade_level_id'], 'subjects' => []];

    public static function model(string $catalog): string
    {
        return self::MODELS[$catalog] ?? abort(404);
    }

    public static function key(AcademicRecord $record): string
    {
        return array_search($record::class, self::MODELS, true);
    }

    public static function permissions(): array
    {
        $permissions = [];
        foreach (self::MODELS as $key => $model) {
            foreach (['view', 'create', 'update'] as $verb) {
                $permissions[] = "$key.$verb";
            }
            if (in_array($key, ['academic-years', 'academic-periods'])) {
                $permissions[] = "$key.close";
            }
            if ($key === 'subjects') {
                $permissions[] = 'subjects.disable';
            }
        }

        return $permissions;
    }
}
