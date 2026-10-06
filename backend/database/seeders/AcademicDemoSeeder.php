<?php

namespace Database\Seeders;

use App\Models\Academic\AcademicPeriod;
use App\Models\Academic\AcademicYear;
use App\Models\Academic\EducationLevel;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Academic\Subject;
use App\Models\Institution;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AcademicDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Solo datos demo local/testing.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () use ($institution) {
            DB::transaction(function () use ($institution) {
                Institution::whereKey($institution->id)->lockForUpdate()->firstOrFail();
                $this->call(AcademicPermissionSeeder::class);
                $year = AcademicYear::firstOrCreate(['name' => '2026'], ['start_date' => '2026-03-02', 'end_date' => '2026-12-18',
                    'status' => 'ACTIVE', 'is_current' => ! AcademicYear::where('is_current', true)->exists()]);
                if ($year->status->value !== 'CLOSED') {
                    foreach ([['2026-03-02', '2026-05-08'], ['2026-05-11', '2026-07-17'], ['2026-08-03', '2026-10-09'], ['2026-10-12', '2026-12-18']] as $i => $dates) {
                        if ($year->start_date->format('Y-m-d') <= $dates[0] && $year->end_date->format('Y-m-d') >= $dates[1] &&
                            ! AcademicPeriod::where('academic_year_id', $year->id)->where('start_date', '<=', $dates[1])->where('end_date', '>=', $dates[0])->exists()) {
                            AcademicPeriod::firstOrCreate(['academic_year_id' => $year->id, 'sequence' => $i + 1],
                                ['name' => 'Bimestre '.($i + 1), 'start_date' => $dates[0], 'end_date' => $dates[1], 'status' => 'DRAFT', 'grading_open' => false]);
                        }
                    }
                }
                foreach (['INI' => ['Inicial', ['3 años', '4 años', '5 años']], 'PRI' => ['Primaria', ['1.º', '2.º', '3.º', '4.º', '5.º', '6.º']], 'SEC' => ['Secundaria', ['1.º', '2.º', '3.º', '4.º', '5.º']]] as $code => [$name,$grades]) {
                    $level = EducationLevel::firstOrCreate(['code' => $code], ['name' => $name, 'sort_order' => array_search($code, ['INI', 'PRI', 'SEC']) + 1, 'status' => 'ACTIVE']);
                    foreach ($grades as $i => $gradeName) {
                        $grade = GradeLevel::firstOrCreate(['education_level_id' => $level->id, 'code' => $code.'-'.($i + 1)], ['name' => $gradeName, 'sort_order' => $i + 1, 'status' => 'ACTIVE']);
                        if ($year->status->value !== 'CLOSED' && $level->status->value === 'ACTIVE' && $grade->status->value === 'ACTIVE') {
                            foreach (['A', 'B'] as $section) {
                                Section::firstOrCreate(['academic_year_id' => $year->id, 'grade_level_id' => $grade->id, 'name' => $section], ['capacity' => 30, 'status' => 'ACTIVE']);
                            }
                        }
                    }
                }
                foreach (['MAT-001' => 'Matemática', 'COM-001' => 'Comunicación', 'CYT-001' => 'Ciencia y Tecnología', 'ING-001' => 'Inglés'] as $code => $name) {
                    Subject::firstOrCreate(['code' => $code], ['name' => $name, 'status' => 'ACTIVE', 'description' => 'Asignatura de demostración.']);
                }
            });
        });
    }
}
