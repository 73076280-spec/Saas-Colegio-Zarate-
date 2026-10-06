<?php

namespace App\Services\Courses;

use App\Models\Academic\AcademicYear;
use App\Models\Academic\GradeLevel;
use App\Models\Academic\Section;
use App\Models\Academic\Subject;
use App\Models\AuditLog;
use App\Models\Courses\Course;
use App\Models\Courses\TeacherAssignment;
use App\Models\Courses\TeachingRecord;
use App\Models\People\Teacher;
use App\Services\Enrollment\EnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TeachingService
{
    public const KEYS = ['academic_year_id', 'teacher_id', 'subject_id', 'grade_level_id', 'section_id'];

    public function fail(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => $message]);
    }

    public function coherent(array $v): void
    {
        if (! Teacher::whereKey($v['teacher_id'])->where('status', 'ACTIVE')->exists()) {
            $this->fail('teacher_id', 'Selecciona un docente activo de tu institución.');
        }
        if (! Subject::whereKey($v['subject_id'])->where('status', 'ACTIVE')->exists()) {
            $this->fail('subject_id', 'Selecciona una asignatura activa de tu institución.');
        }
        if (! AcademicYear::whereKey($v['academic_year_id'])->where('status', '!=', 'CLOSED')->exists()) {
            $this->fail('academic_year_id', 'El año académico no está disponible o está cerrado.');
        }
        if (! GradeLevel::whereKey($v['grade_level_id'])->where('status', 'ACTIVE')->whereHas('educationLevel', fn ($q) => $q->where('status', 'ACTIVE'))->exists()) {
            $this->fail('grade_level_id', 'El grado o nivel no está activo.');
        }
        if (! Section::whereKey($v['section_id'])->where('academic_year_id', $v['academic_year_id'])->where('grade_level_id', $v['grade_level_id'])->where('status', 'ACTIVE')->exists()) {
            $this->fail('section_id', 'La sección no corresponde al año y grado activos.');
        }
    }

    public function audit(string $action, TeachingRecord $record, ?array $old, Request $r): void
    {
        $keys = array_flip(array_merge(self::KEYS, ['id', 'institution_id', 'status', 'teacher_assignment_id', 'code', 'name']));
        AuditLog::create(['user_id' => $r->user()->id, 'action' => $action, 'entity_type' => $record->getTable(), 'entity_id' => $record->id, 'old_values' => $old === null ? null : array_intersect_key($old, $keys), 'new_values' => array_intersect_key($record->attributesToArray(), $keys), 'ip_address' => $r->ip(), 'user_agent' => mb_substr($r->userAgent() ?? '', 0, 500)]);
    }

    public function save(bool $course, array $data, Request $r, ?int $id = null, ?string $operation = null): TeachingRecord
    {
        return DB::transaction(function () use ($course, $data, $r, $id, $operation) {
            app(EnrollmentService::class)->lock();
            $class = $course ? Course::class : TeacherAssignment::class;
            $record = $id ? $class::lockForUpdate()->findOrFail($id) : new $class;
            $old = $id ? $record->attributesToArray() : null;
            if ($course && $id && $record->status->value === 'CLOSED') {
                $this->fail('status', 'El curso cerrado conserva su historial y no se modifica.');
            }
            if ($operation) {
                $target = match ($operation) {
                    'activate' => 'ACTIVE','close' => 'CLOSED','disable' => 'INACTIVE'
                };
                if ($operation === 'activate' && ! in_array($record->status->value, ['DRAFT', 'INACTIVE'])) {
                    $this->fail('status', 'Solo se activan cursos en borrador o inactivos.');
                }
                if ($record->status->value === $target) {
                    $this->fail('status', 'El registro ya tiene ese estado.');
                }
                $data = ['status' => $target];
            }
            if ($course && ! $id) {
                $data['status'] = 'DRAFT';
            }
            if (! $course && ! $id) {
                $data['status'] = 'ACTIVE';
            }
            $v = array_merge($old ?? [], $data);
            if ($id) {
                $immutable = $course || $record->courses()->withTrashed()->exists();
                if ($immutable) {
                    foreach (self::KEYS as $key) {
                        if ($v[$key] != $old[$key]) {
                            $this->fail($key, 'La estructura vinculada es inmutable; crea una nueva asignación o curso.');
                        }
                    }
                }
                if ($course && array_key_exists('teacher_assignment_id', $data) && $data['teacher_assignment_id'] != $record->teacher_assignment_id) {
                    $this->fail('teacher_assignment_id', 'La asignación del curso es inmutable.');
                }
            }
            // Closing/disabling must remain possible even after a parent becomes inactive.
            if (! in_array($v['status'], ['INACTIVE', 'CLOSED'])) {
                $this->coherent($v);
            }
            if (! $course && $v['status'] === 'INACTIVE' && $id && $record->courses()->where('status', 'ACTIVE')->exists()) {
                $this->fail('status', 'Inactiva o cierra los cursos activos antes de deshabilitar la asignación.');
            }
            $equivalent = array_intersect_key($v, array_flip(self::KEYS));
            $q = $course ? Course::withTrashed() : TeacherAssignment::query();
            if ($q->where($equivalent)->when($id, fn ($q) => $q->whereKeyNot($id))->exists()) {
                $this->fail('section_id', 'Ya existe un registro equivalente para ese docente, asignatura y sección.');
            }
            if ($course) {
                if (Course::withTrashed()->where('academic_year_id', $v['academic_year_id'])->where('code', $v['code'])->when($id, fn ($q) => $q->whereKeyNot($id))->exists()) {
                    $this->fail('code', 'El código ya existe en este año académico.');
                }
                if (! in_array($v['status'], ['INACTIVE', 'CLOSED'])) {
                    $assignment = TeacherAssignment::where($equivalent)->where('status', 'ACTIVE')->when($v['teacher_assignment_id'] ?? null, fn ($q, $value) => $q->whereKey($value))->first();
                    if (! $assignment) {
                        $this->fail('teacher_assignment_id', 'Se requiere una asignación docente activa y coherente.');
                    }
                    $data['teacher_assignment_id'] = $assignment->id;
                }
            }
            $record->fill($data)->save();
            $record->refresh();
            $action = $operation ? strtoupper($operation) : ($id ? 'UPDATE' : 'CREATE');
            if (! $course && $id && $old['status'] !== 'INACTIVE' && $record->status->value === 'INACTIVE') {
                $action = 'DISABLE';
            }
            $this->audit($action, $record, $old, $r);

            return $record;
        }, 3);
    }
}
