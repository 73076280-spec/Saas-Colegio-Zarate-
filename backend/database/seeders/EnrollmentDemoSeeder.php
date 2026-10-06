<?php

namespace Database\Seeders;

use App\Models\Academic\AcademicYear;
use App\Models\Academic\Section;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\PaymentConcept;
use App\Models\Enrollment\StudentPayment;
use App\Models\Institution;
use App\Models\People\Student;
use App\Models\User;
use App\Services\Enrollment\EnrollmentService;
use App\Services\Enrollment\PaymentService;
use App\Services\Enrollment\TransitionEnrollmentStatusAction;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnrollmentDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Demo local/testing only.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () {
            DB::transaction(function () {
                app(EnrollmentService::class)->lock();
                $this->call(EnrollmentPermissionSeeder::class);
                $admin = User::where('email', 'administrator@zarate.test')->firstOrFail();
                $request = Request::create('/demo', 'POST');
                $request->setUserResolver(fn () => $admin);
                $concept = PaymentConcept::firstOrCreate(['code' => 'MATRICULA_2026'], ['name' => 'Matrícula 2026', 'amount' => '150.00', 'description' => 'Importe ficticio de desarrollo.', 'status' => 'ACTIVE']);
                $year = AcademicYear::where('name', '2026')->where('status', 'ACTIVE')->firstOrFail();
                $section = Section::where('academic_year_id', $year->id)->where('status', 'ACTIVE')->whereHas('gradeLevel', fn ($g) => $g->where('status', 'ACTIVE'))->firstOrFail();
                foreach (['student@zarate.test', 'student2@zarate.test'] as $index => $email) {
                    $student = Student::whereHas('user', fn ($u) => $u->where('email', $email))->firstOrFail();
                    if (Enrollment::withTrashed()->where('student_id', $student->id)->where('academic_year_id', $year->id)->exists()) {
                        continue;
                    }
                    $e = app(EnrollmentService::class)->save(['student_id' => $student->id, 'academic_year_id' => $year->id, 'grade_level_id' => $section->grade_level_id, 'section_id' => $section->id, 'observations' => 'Demostración ficticia Sprint 4'], $request);
                    $p = StudentPayment::where('student_id', $student->id)->where('academic_year_id', $year->id)->where('payment_concept_id', $concept->id)->first();
                    if (! $p) {
                        $p = app(PaymentService::class)->save(['student_id' => $student->id, 'academic_year_id' => $year->id, 'payment_concept_id' => $concept->id, 'amount' => $concept->amount], $request);
                    }
                    if ($index === 0) {
                        if ($p->status->value === 'PENDING') {
                            app(PaymentService::class)->validate($p->id, $request);
                        }
                        app(TransitionEnrollmentStatusAction::class)->execute($e->id, 'submit', $request);
                        app(TransitionEnrollmentStatusAction::class)->execute($e->id, 'approve', $request);
                    } else {
                        app(TransitionEnrollmentStatusAction::class)->execute($e->id, 'submit', $request);
                        $request->merge(['comment' => 'Verificar información ficticia de demostración.']);
                        app(TransitionEnrollmentStatusAction::class)->execute($e->id, 'observe', $request);
                    }
                }
            });
        });
    }
}
