<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Institution;
use App\Models\User;
use App\Services\InstitutionContext;
use Illuminate\Database\Seeder;

class DevelopmentSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new \LogicException('DevelopmentSeeder solo está permitido en local/testing.');
        }
        $this->call(DatabaseSeeder::class);
        $institution = Institution::where('code', 'ZARATE')->firstOrFail();
        app(InstitutionContext::class)->run($institution->id, function () {
            foreach (RoleName::cases() as $role) {
                $isTeacher = $role === RoleName::TEACHER;
                $user = User::firstOrCreate(['email' => strtolower($role->value).'@zarate.test'], [
                    'first_name' => $isTeacher ? 'Docente' : 'Demo',
                    'last_name' => $isTeacher ? 'Demo' : $role->value,
                    'password' => 'ZarateDemo2026!', 'status' => 'ACTIVE', 'must_change_password' => false,
                ]);
                if ($isTeacher && $user->first_name === 'Demo' && $user->last_name === 'TEACHER') {
                    $user->update(['first_name' => 'Docente', 'last_name' => 'Demo']);
                }
                $user->syncRoles([$role->value]);
            }
        });
        $this->call([
            AcademicDemoSeeder::class,
            PeopleDemoSeeder::class,
            EnrollmentDemoSeeder::class,
            CourseDemoSeeder::class,
            ClassroomDemoSeeder::class,
            LearningDemoSeeder::class,
            AttendanceDemoSeeder::class,
            OfficeDemoSeeder::class,
        ]);
    }
}
