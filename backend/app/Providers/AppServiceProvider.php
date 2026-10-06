<?php

namespace App\Providers;

use App\Auth\InstitutionUserProvider;
use App\Models\Attendance\AbsenceJustification;
use App\Models\Attendance\AttendanceRecord;
use App\Models\Attendance\AttendanceSession;
use App\Models\Classroom\CourseUnit;
use App\Models\Classroom\Material;
use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Models\Enrollment\Enrollment;
use App\Models\Enrollment\StudentPayment;
use App\Models\Learning\Assessment;
use App\Models\Learning\Assignment;
use App\Models\Learning\Score;
use App\Models\Learning\Submission;
use App\Models\Office\AcademicDocument;
use App\Models\Office\AcademicRequest;
use App\Models\Office\Communication;
use App\Models\People\StudentGuardian;
use App\Policies\AcademicPolicy;
use App\Policies\AttendancePolicy;
use App\Policies\ClassroomPolicy;
use App\Policies\CoursePolicy;
use App\Policies\EnrollmentPolicy;
use App\Policies\FamilyPolicy;
use App\Policies\LearningPolicy;
use App\Policies\OfficePolicy;
use App\Policies\PaymentPolicy;
use App\Policies\PersonPolicy;
use App\Policies\TeacherAssignmentPolicy;
use App\Services\Academic\AcademicCatalog;
use App\Services\InstitutionContext;
use App\Services\People\PeopleCatalog;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(InstitutionContext::class);
    }

    public function boot(): void
    {
        foreach (AcademicCatalog::MODELS as $model) {
            Gate::policy($model, AcademicPolicy::class);
        }
        foreach (PeopleCatalog::MODELS as $model) {
            Gate::policy($model, PersonPolicy::class);
        }
        foreach ([AttendanceSession::class, AttendanceRecord::class, AbsenceJustification::class] as $model) {
            Gate::policy($model, AttendancePolicy::class);
        }
        foreach ([AcademicRequest::class, AcademicDocument::class, Communication::class] as $model) {
            Gate::policy($model, OfficePolicy::class);
        }
        Gate::policy(StudentGuardian::class, FamilyPolicy::class);
        Gate::policy(StudentPayment::class, PaymentPolicy::class);
        Gate::policy(Enrollment::class, EnrollmentPolicy::class);
        Gate::policy(Course::class, CoursePolicy::class);
        foreach ([Assignment::class, Assessment::class, Submission::class, Score::class] as $model) {
            Gate::policy($model, LearningPolicy::class);
        }
        Gate::policy(CourseUnit::class, ClassroomPolicy::class);
        Gate::policy(Material::class, ClassroomPolicy::class);
        Gate::policy(TeacherAssignment::class, TeacherAssignmentPolicy::class);
        Auth::provider('institution-eloquent', fn ($app, array $config) => new InstitutionUserProvider($app['hash'], $config['model']));
        RateLimiter::for('login', fn (Request $request) => [
            Limit::perMinute(20)->by('ip:'.$request->ip()),
            Limit::perMinute(5)->by('account:'.hash('sha256', mb_strtolower((string) $request->input('institution_code')).'|'.mb_strtolower((string) $request->input('email')).'|'.$request->ip())),
        ]);
    }
}
