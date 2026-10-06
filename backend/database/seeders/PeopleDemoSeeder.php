<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\StudentGuardian;
use App\Models\People\Teacher;
use App\Models\User;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PeopleDemoSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('Datos ficticios solo para local/testing.');
        }
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () use ($institution) {
            DB::transaction(function () use ($institution) {
                Institution::whereKey($institution->id)->lockForUpdate()->firstOrFail();
                $this->call(PeoplePermissionSeeder::class);
                $studentUser = $this->account('student@zarate.test', 'Demo', 'STUDENT', 'STUDENT');
                $secondStudent = $this->account('student2@zarate.test', 'Estudiante', 'Ficticio Dos', 'STUDENT');
                $teacherUser = $this->account('teacher@zarate.test', 'Demo', 'TEACHER', 'TEACHER');
                $guardianUser = $this->account('guardian@zarate.test', 'Demo', 'GUARDIAN', 'GUARDIAN');
                $secondGuardian = $this->account('guardian2@zarate.test', 'Apoderado', 'Ficticio Dos', 'GUARDIAN');
                $students = [];
                foreach ([$studentUser, $secondStudent] as $i => $user) {
                    $students[] = Student::firstOrCreate(['user_id' => $user->id], ['student_code' => 'DEMO-STU-0'.($i + 1), 'document_type' => 'PASSPORT', 'document_number' => 'DEMO-STU-DOC-0'.($i + 1), 'birth_date' => '2012-06-15', 'admission_date' => '2026-03-02', 'status' => 'ACTIVE']);
                }
                Teacher::firstOrCreate(['user_id' => $teacherUser->id], ['teacher_code' => 'DEMO-TCH-01', 'document_type' => 'PASSPORT', 'document_number' => 'DEMO-TCH-DOC-01', 'specialty' => 'Matemática (demo)', 'hire_date' => '2026-02-01', 'status' => 'ACTIVE']);
                $guardians = [];
                foreach ([$guardianUser, $secondGuardian] as $i => $user) {
                    $guardians[] = Guardian::firstOrCreate(['user_id' => $user->id], ['document_type' => 'PASSPORT', 'document_number' => 'DEMO-GUA-DOC-0'.($i + 1), 'occupation' => 'Ocupación ficticia', 'status' => 'ACTIVE']);
                }
                foreach ($students as $student) {
                    foreach ($guardians as $i => $guardian) {
                        StudentGuardian::firstOrCreate(['student_id' => $student->id, 'guardian_id' => $guardian->id],
                            ['relationship' => $i === 0 ? 'GUARDIAN' : 'GRANDPARENT', 'is_primary' => $i === 0 && ! StudentGuardian::where('student_id', $student->id)->where('is_primary', true)->exists(),
                                'can_pick_up' => true, 'receives_notifications' => true]);
                    }
                }
            });
        });
    }

    private function account(string $email, string $first, string $last, string $role): User
    {
        $user = User::firstOrCreate(['email' => $email], ['first_name' => $first, 'last_name' => $last, 'password' => 'ZarateDemo2026!', 'must_change_password' => false, 'status' => 'ACTIVE']);
        $user->assignRole($role);

        return $user;
    }
}
