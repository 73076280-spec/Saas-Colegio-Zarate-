<?php

namespace App\Services\Office;

use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Models\Enrollment\Enrollment;
use App\Models\People\Guardian;
use App\Models\People\Student;
use App\Models\People\Teacher;
use App\Models\Role;
use App\Models\User;
use App\Services\Courses\CourseAccess;
use App\Services\InstitutionContext;
use Illuminate\Support\Collection;

class CommunicationRecipients
{
    public function validate(array $targets): array
    {
        $result = [];
        foreach ($targets as $t) {
            $kind = $t['kind'];
            $value = $t['target'];
            if ($kind !== 'role') {
                if (! ctype_digit($value) || (int) $value < 1) {
                    app(RequestService::class)->fail('targets', 'Selecciona destinatarios válidos.');
                }
                $value = (string) (int) $value;
            }
            $valid = match ($kind) {
                'institution' => (int) $value === app(InstitutionContext::class)->requireId(),
                'role' => Role::where('name', $value)->exists(),
                'grade' => GradeLevel::whereKey($value)->exists(), 'section' => Section::whereKey($value)->exists(),
                'course' => Course::whereKey($value)->where('status', 'ACTIVE')->exists(),
                'user' => User::whereKey($value)->where('status', 'ACTIVE')->exists(),
                default => false,
            };
            if (! $valid) {
                app(RequestService::class)->fail('targets', 'El destinatario no pertenece a tu institución o no está disponible.');
            }
            $result[$kind.':'.$value] = ['kind' => $kind, 'target' => $value];
        }

        return array_values($result);
    }

    public function resolve(array $targets): Collection
    {
        $ids = [];
        foreach ($targets as $target) {
            $kind = $target['kind'];
            $value = $target['target'];
            if ($kind === 'institution') {
                return User::where('status', 'ACTIVE')->get();
            }
            if ($kind === 'role') {
                $ids = array_merge($ids, User::role($value)->pluck('id')->all());

                continue;
            }
            if ($kind === 'user') {
                $ids[] = (int) $value;

                continue;
            }
            if ($kind === 'course') {
                $course = Course::where('status', 'ACTIVE')->findOrFail($value);
                $enrollments = app(CourseAccess::class)->roster($course);
                $teachers = Teacher::whereKey($course->teacher_id)->where('status', 'ACTIVE')->whereHas('user');
                if (! $course->assignment()->where('status', 'ACTIVE')->exists()) {
                    continue;
                }
            } else {
                $field = $kind === 'grade' ? 'grade_level_id' : 'section_id';
                $enrollments = Enrollment::where($field, $value)->where('status', 'APPROVED');
                $assignments = TeacherAssignment::where($field, $value)->where('status', 'ACTIVE')->select('teacher_id');
                $teachers = Teacher::whereIn('id', $assignments)->where('status', 'ACTIVE');
            }
            $students = Student::whereIn('id', $enrollments->select('student_id'))->where('status', 'ACTIVE');
            $studentIds = (clone $students)->pluck('id')->all();
            $ids = array_merge($ids, $students->pluck('user_id')->all(), $teachers->pluck('user_id')->all(),
                Guardian::where('status', 'ACTIVE')->whereHas('students', fn ($q) => $q->whereIn('students.id', $studentIds))->pluck('user_id')->all());
        }

        return User::whereIn('id', array_unique($ids))->where('status', 'ACTIVE')->get();
    }
}
