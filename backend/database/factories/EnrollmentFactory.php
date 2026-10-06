<?php

namespace Database\Factories;

use App\Models\Academic\AcademicYear;
use App\Models\Academic\EducationLevel;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition(): array
    {
        $suffix = fake()->unique()->numerify('########');
        $year = AcademicYear::create(['name' => 'TEST-'.$suffix, 'start_date' => '2026-03-01', 'end_date' => '2026-12-20', 'status' => 'ACTIVE']);
        $level = EducationLevel::create(['name' => 'TEST-'.$suffix, 'code' => $suffix, 'status' => 'ACTIVE']);
        $grade = GradeLevel::create(['education_level_id' => $level->id, 'name' => 'Primero', 'code' => 'G1', 'status' => 'ACTIVE']);
        $section = Section::create(['academic_year_id' => $year->id, 'grade_level_id' => $grade->id, 'name' => 'A', 'capacity' => 30, 'status' => 'ACTIVE']);

        return ['student_id' => Student::factory(), 'academic_year_id' => $year->id, 'grade_level_id' => $grade->id, 'section_id' => $section->id, 'enrollment_code' => 'TEST-'.$suffix, 'status' => 'DRAFT'];
    }
}
