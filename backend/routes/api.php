<?php

use App\Http\Controllers\Api\AcademicController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvatarController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\EnrollmentOptionsController;
use App\Http\Controllers\Api\FamilyController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\LearningController;
use App\Http\Controllers\Api\OfficeController;
use App\Http\Controllers\Api\OfficeNotificationsController;
use App\Http\Controllers\Api\OfficeOptionsController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PeopleController;
use App\Http\Controllers\Api\PeopleProfileController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReportOptionsController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\TeachingController;
use App\Http\Controllers\Api\TeachingOptionsController;
use App\Http\Controllers\Api\UserController;
use App\Services\Academic\AcademicCatalog;
use App\Services\People\PeopleCatalog;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class)->name('api.health');
Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::middleware(['auth:sanctum', 'institution'])->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword'])->middleware('throttle:6,1');
        Route::middleware('password.changed')->group(function () {
            Route::get('dashboard', DashboardController::class);
            Route::get('reports', [ReportController::class, 'catalog']);
            Route::get('reports/{report}/options/{option}', ReportOptionsController::class);
            Route::get('reports/{report}/export', [ReportController::class, 'export'])->middleware('throttle:20,1');
            Route::get('reports/{report}', [ReportController::class, 'index']);

            foreach (['course-units' => 'units', 'materials' => 'materials'] as $kind => $segment) {
                Route::get('courses/{course}/'.$segment, [ClassroomController::class, 'index'])->whereNumber('course')->defaults('kind', $kind);
                Route::post('courses/{course}/'.$segment, [ClassroomController::class, 'store'])->whereNumber('course')->defaults('kind', $kind);
                Route::get($kind.'/{id}', [ClassroomController::class, 'show'])->whereNumber('id')->defaults('kind', $kind);
                Route::patch($kind.'/{id}', [ClassroomController::class, 'update'])->whereNumber('id')->defaults('kind', $kind);
                foreach (['publish', 'archive'] as $operation) {
                    Route::post($kind.'/{id}/'.$operation, [ClassroomController::class, 'update'])->whereNumber('id')->defaults('kind', $kind)->defaults('operation', $operation);
                }
            }
            Route::get('materials/{id}/download', [ClassroomController::class, 'download'])->whereNumber('id')->defaults('kind', 'materials');

            foreach (['assignments', 'assessments'] as $kind) {
                Route::get('courses/{course}/'.$kind, [LearningController::class, 'index'])->whereNumber('course')->defaults('kind', $kind);
                Route::post('courses/{course}/'.$kind, [LearningController::class, 'store'])->whereNumber('course')->defaults('kind', $kind);
                foreach (['publish', 'close'] as $operation) {
                    Route::post($kind.'/{id}/'.$operation, [LearningController::class, 'update'])->whereNumber('id')->defaults('kind', $kind)->defaults('operation', $operation);
                }
            }
            foreach (['assignments', 'assessments', 'submissions', 'scores'] as $kind) {
                Route::get($kind.'/{id}', [LearningController::class, 'show'])->whereNumber('id')->defaults('kind', $kind);
                Route::patch($kind.'/{id}', [LearningController::class, 'update'])->whereNumber('id')->defaults('kind', $kind);
                Route::get('my/'.$kind, [LearningController::class, 'index'])->defaults('kind', $kind)->defaults('personal', true);
            }
            Route::get('assignments/{assignment}/submissions', [LearningController::class, 'index'])->whereNumber('assignment')->defaults('kind', 'submissions');
            Route::post('assignments/{assignment}/submissions', [LearningController::class, 'store'])->whereNumber('assignment')->defaults('kind', 'submissions');
            Route::post('submissions/{id}/review', [LearningController::class, 'update'])->whereNumber('id')->defaults('kind', 'submissions')->defaults('operation', 'review');
            Route::get('submissions/{id}/download', [LearningController::class, 'download'])->whereNumber('id')->defaults('kind', 'submissions');
            Route::get('assessments/{assessment}/scores', [LearningController::class, 'index'])->whereNumber('assessment')->defaults('kind', 'scores');
            Route::post('assessments/{assessment}/scores', [LearningController::class, 'store'])->whereNumber('assessment')->defaults('kind', 'scores');
            Route::get('scores/{id}/history', [LearningController::class, 'history'])->whereNumber('id')->defaults('kind', 'scores');
            foreach (['types' => 'assessment-types', 'periods' => 'assessment-periods'] as $option => $segment) {
                Route::get('courses/{course}/'.$segment, [LearningController::class, 'options'])->whereNumber('course')->defaults('option', $option);
            }

            Route::get('courses/{course}/attendance-sessions', [AttendanceController::class, 'sessions'])->whereNumber('course')->defaults('kind', 'sessions');
            Route::post('courses/{course}/attendance-sessions', [AttendanceController::class, 'saveSession'])->whereNumber('course')->defaults('kind', 'sessions');
            Route::get('attendance-sessions/{id}', [AttendanceController::class, 'showSession'])->whereNumber('id')->defaults('kind', 'sessions');
            Route::patch('attendance-sessions/{id}', [AttendanceController::class, 'saveSession'])->whereNumber('id')->defaults('kind', 'sessions');
            Route::post('attendance-sessions/{id}/close', [AttendanceController::class, 'saveSession'])->whereNumber('id')->defaults('kind', 'sessions')->defaults('operation', 'close');
            Route::get('attendance-sessions/{session}/records', [AttendanceController::class, 'records'])->whereNumber('session')->defaults('kind', 'records');
            Route::post('attendance-sessions/{session}/records', [AttendanceController::class, 'saveRecords'])->whereNumber('session')->defaults('kind', 'records');
            Route::patch('attendance-records/{id}', [AttendanceController::class, 'saveRecords'])->whereNumber('id')->defaults('kind', 'records');
            Route::get('my/attendance', [AttendanceController::class, 'personal']);
            Route::get('guardians/{guardian}/students/{student}/attendance', [AttendanceController::class, 'personal'])->whereNumber(['guardian', 'student']);
            Route::get('absence-justifications', [AttendanceController::class, 'justifications']);
            Route::post('attendance-records/{record}/justifications', [AttendanceController::class, 'createJustification'])->whereNumber('record')->defaults('kind', 'justifications');
            Route::get('absence-justifications/{id}', [AttendanceController::class, 'showJustification'])->whereNumber('id');
            Route::get('absence-justifications/{id}/history', [AttendanceController::class, 'history'])->whereNumber('id');
            Route::get('absence-justifications/{id}/download', [AttendanceController::class, 'download'])->whereNumber('id');
            foreach (['review', 'approve', 'reject'] as $operation) {
                Route::post('absence-justifications/{id}/'.$operation, [AttendanceController::class, 'transition'])->whereNumber('id')->defaults('kind', 'justifications')->defaults('operation', $operation);
            }

            foreach (['requests' => 'academic-requests', 'documents' => 'academic-documents', 'communications' => 'communications'] as $kind => $segment) {
                Route::get($segment, [OfficeController::class, 'index'])->defaults('kind', $kind);
                Route::post($segment, [OfficeController::class, 'store'])->defaults('kind', $kind);
                Route::get($segment.'/{id}', [OfficeController::class, 'show'])->whereNumber('id')->defaults('kind', $kind);
                if ($kind !== 'documents') {
                    Route::patch($segment.'/{id}', [OfficeController::class, 'update'])->whereNumber('id')->defaults('kind', $kind);
                }
                $operations = match ($kind) {
                    'requests' => ['review', 'observe', 'approve', 'reject', 'complete'],'documents' => ['issue', 'cancel'],'communications' => ['publish', 'archive']
                };
                foreach ($operations as $operation) {
                    Route::post($segment.'/{id}/'.$operation, [OfficeController::class, 'transition'])->whereNumber('id')->defaults('kind', $kind)->defaults('operation', $operation);
                }
            }
            Route::get('request-types', [OfficeController::class, 'types']);
            Route::get('academic-requests/{id}/history', [OfficeController::class, 'history'])->whereNumber('id')->defaults('kind', 'requests');
            Route::get('academic-documents/{id}/download', [OfficeController::class, 'download'])->whereNumber('id')->defaults('kind', 'documents');
            Route::get('my/requests', [OfficeController::class, 'index'])->defaults('kind', 'requests')->defaults('personal', true);
            foreach (['notifications', 'my/notifications'] as $segment) {
                Route::get($segment, [OfficeNotificationsController::class, 'index'])->defaults('kind', 'notifications');
            }
            Route::post('notifications/read-all', [OfficeNotificationsController::class, 'read'])->defaults('kind', 'notifications');
            Route::post('notifications/{id}/read', [OfficeNotificationsController::class, 'read'])->whereUuid('id')->defaults('kind', 'notifications');
            Route::get('office-options/{option}', OfficeOptionsController::class)->whereIn('option', ['students', 'users', 'roles', 'grades', 'sections', 'courses', 'assignees']);

            Route::get('teaching-options', TeachingOptionsController::class);
            foreach (['teacher-assignments', 'courses'] as $teaching) {
                Route::get($teaching, [TeachingController::class, 'index'])->defaults('teaching', $teaching);
                Route::post($teaching, [TeachingController::class, 'store'])->defaults('teaching', $teaching);
                Route::get($teaching.'/{id}', [TeachingController::class, 'show'])->whereNumber('id')->defaults('teaching', $teaching);
                Route::patch($teaching.'/{id}', [TeachingController::class, 'update'])->whereNumber('id')->defaults('teaching', $teaching);
            }
            foreach (['activate', 'close'] as $operation) {
                Route::post('courses/{id}/'.$operation, [TeachingController::class, 'update'])->whereNumber('id')->defaults('teaching', 'courses')->defaults('operation', $operation);
            }
            Route::post('teacher-assignments/{id}/disable', [TeachingController::class, 'update'])->whereNumber('id')->defaults('teaching', 'teacher-assignments')->defaults('operation', 'disable');
            Route::get('teachers/{teacher}/courses', [TeachingController::class, 'index'])->whereNumber('teacher')->defaults('teaching', 'courses');
            Route::get('students/{student}/courses', [TeachingController::class, 'index'])->whereNumber('student')->defaults('teaching', 'courses');
            Route::get('my/courses', [TeachingController::class, 'index'])->defaults('teaching', 'courses')->defaults('personal', true);
            Route::get('courses/{id}/students', [TeachingController::class, 'roster'])->whereNumber('id')->defaults('teaching', 'courses');
            Route::get('enrollment-options', EnrollmentOptionsController::class);
            Route::get('enrollments', [EnrollmentController::class, 'index']);
            Route::post('enrollments', [EnrollmentController::class, 'store']);
            Route::get('enrollments/{id}', [EnrollmentController::class, 'show'])->whereNumber('id');
            Route::patch('enrollments/{id}', [EnrollmentController::class, 'update'])->whereNumber('id');
            foreach (['submit', 'observe', 'approve', 'reject', 'cancel'] as $operation) {
                Route::post('enrollments/{id}/'.$operation, [EnrollmentController::class, 'transition'])->whereNumber('id')->defaults('operation', $operation);
            }
            Route::get('students/{student}/enrollments', [EnrollmentController::class, 'index'])->whereNumber('student');
            Route::get('payment-concepts', [PaymentController::class, 'concepts']);
            Route::post('payment-concepts', [PaymentController::class, 'storeConcept'])->defaults('concept', true);
            Route::get('student-payments', [PaymentController::class, 'index']);
            Route::post('student-payments', [PaymentController::class, 'store']);
            Route::get('student-payments/{id}', [PaymentController::class, 'show'])->whereNumber('id');
            Route::patch('student-payments/{id}', [PaymentController::class, 'update'])->whereNumber('id');
            Route::post('student-payments/{id}/validate', [PaymentController::class, 'validatePayment'])->whereNumber('id')->defaults('operation', 'validate');
            Route::get('profile/people', [PeopleProfileController::class, 'show']);
            Route::get('profile/family', [PeopleProfileController::class, 'family']);
            foreach (PeopleCatalog::MODELS as $people => $model) {
                Route::get($people.'/accounts', [PeopleController::class, 'accounts'])->defaults('people', $people)->defaults('accounts', true);
                Route::get($people, [PeopleController::class, 'index'])->defaults('people', $people);
                Route::post($people, [PeopleController::class, 'store'])->defaults('people', $people);
                Route::get($people.'/{person}', [PeopleController::class, 'show'])->whereNumber('person')->defaults('people', $people);
                Route::match(['put', 'patch'], $people.'/{person}', [PeopleController::class, 'update'])->whereNumber('person')->defaults('people', $people);
                Route::post($people.'/{person}/disable', [PeopleController::class, 'update'])->whereNumber('person')->defaults('people', $people)->defaults('operation', 'disable');
            }
            Route::get('students/{student}/guardians', [FamilyController::class, 'index'])->whereNumber('student');
            Route::post('students/{student}/guardians', [FamilyController::class, 'store'])->whereNumber('student');
            Route::patch('students/{student}/guardians/{guardian}', [FamilyController::class, 'update'])->whereNumber(['student', 'guardian']);
            Route::delete('students/{student}/guardians/{guardian}', [FamilyController::class, 'destroy'])->whereNumber(['student', 'guardian']);
            Route::get('guardians/{guardian}/students', [FamilyController::class, 'students'])->whereNumber('guardian');
            foreach (AcademicCatalog::MODELS as $catalog => $model) {
                Route::get($catalog, [AcademicController::class, 'index'])->defaults('catalog', $catalog);
                Route::post($catalog, [AcademicController::class, 'store'])->defaults('catalog', $catalog);
                Route::get($catalog.'/{record}', [AcademicController::class, 'show'])->whereNumber('record')->defaults('catalog', $catalog);
                Route::match(['put', 'patch'], $catalog.'/{record}', [AcademicController::class, 'update'])->whereNumber('record')->defaults('catalog', $catalog);
                if (in_array($catalog, ['academic-years', 'academic-periods', 'subjects'])) {
                    $operation = $catalog === 'subjects' ? 'disable' : 'close';
                    Route::post($catalog.'/{record}/'.$operation, [AcademicController::class, 'update'])->whereNumber('record')->defaults('catalog', $catalog)->defaults('operation', $operation);
                }
            }
            Route::apiResource('users', UserController::class)->except('destroy');
            Route::post('/users/{user}/disable', [UserController::class, 'disable']);
            Route::get('/roles', [RoleController::class, 'index']);
            Route::get('/permissions', [RoleController::class, 'permissions']);
            Route::put('/roles/{role}/permissions', [RoleController::class, 'update']);
            Route::apiResource('institutions', InstitutionController::class)->only(['index', 'show', 'update']);
            Route::get('/profile', [ProfileController::class, 'show']);
            Route::post('/profile/avatar', [AvatarController::class, 'store'])->middleware('throttle:20,1');
            Route::delete('/profile/avatar', [AvatarController::class, 'destroy']);
            Route::get('/users/{user}/avatar', [AvatarController::class, 'show'])->whereNumber('user');
            Route::patch('/profile', [ProfileController::class, 'update']);
            Route::get('/audit-logs', [AuditController::class, 'index']);
        });
    });
});
