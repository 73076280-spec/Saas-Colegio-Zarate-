<?php

namespace App\Services\Reports;

class ReportCatalog
{
    public const ITEMS = [
        'active-students' => ['Estudiantes activos', 'Académicos', 'students.view', 'students'],
        'enrolled-students' => ['Matriculados por año', 'Matrícula', 'enrollments.view', 'enrollments'],
        'students-by-section' => ['Estudiantes por grado y sección', 'Matrícula', 'enrollments.view', 'enrollments'],
        'enrollment-status' => ['Matrículas por estado', 'Matrícula', 'enrollments.view', 'enrollments'],
        'section-capacity' => ['Ocupación y cupos', 'Matrícula', 'sections.view', 'sections'],
        'active-teachers' => ['Docentes activos', 'Docentes', 'teachers.view', 'teachers'],
        'teacher-courses' => ['Cursos por docente', 'Docentes', 'courses.view', 'courses'],
        'teacher-workload' => ['Carga docente (asignaciones)', 'Docentes', 'teacher-assignments.view', 'workload'],
        'student-scores' => ['Notas por estudiante', 'Calificaciones', 'scores.view', 'scores'],
        'course-scores' => ['Notas por curso', 'Calificaciones', 'scores.view', 'scores'],
        'period-scores' => ['Notas por periodo', 'Calificaciones', 'scores.view', 'scores'],
        'course-assessments' => ['Evaluaciones por curso', 'Calificaciones', 'assessments.view', 'assessments'],
        'assignment-submissions' => ['Tareas y entregas', 'Académicos', 'assignments.view', 'assignments'],
        'missing-submissions' => ['Tareas pendientes / no entregadas', 'Académicos', 'assignments.view', 'missing'],
        'student-attendance' => ['Asistencia por estudiante', 'Asistencia', 'attendance.view', 'attendance'],
        'course-attendance' => ['Asistencia por curso', 'Asistencia', 'attendance.view', 'attendance'],
        'attendance-incidents' => ['Faltas, tardanzas y justificaciones', 'Asistencia', 'attendance.view', 'incidents'],
        'request-status' => ['Solicitudes por estado', 'Solicitudes', 'requests.view', 'requests'],
        'enrollment-payments' => ['Pagos de matrícula', 'Pagos', 'payments.view', 'payments'],
        'published-communications' => ['Comunicaciones publicadas', 'Académicos', 'communications.view', 'communications'],
    ];

    public static function get(string $key): array
    {
        abort_unless(isset(self::ITEMS[$key]), 404);

        return self::ITEMS[$key];
    }

    public static function filters(string $key): array
    {
        $kind = self::get($key)[3];
        $academic = ['academic_year_id', 'education_level_id', 'grade_level_id', 'section_id'];
        $course = [...$academic, 'course_id', 'subject_id', 'teacher_id'];

        return match ($kind) {
            'students' => ['student_id', 'date_from', 'date_to'],
            'teachers' => ['teacher_id', 'date_from', 'date_to'],
            'enrollments' => [...$academic, 'student_id', 'status', 'date_from', 'date_to'],
            'sections' => [...$academic, 'status'],
            'courses', 'workload' => [...$course, 'status', 'date_from', 'date_to'],
            'scores' => [...$course, 'academic_period_id', 'student_id', 'date_from', 'date_to'],
            'assessments' => [...$course, 'academic_period_id', 'status', 'date_from', 'date_to'],
            'assignments', 'missing' => [...$course, 'student_id', 'status', 'date_from', 'date_to'],
            'attendance', 'incidents' => [...$course, 'student_id', 'status', 'date_from', 'date_to'],
            'payments' => ['academic_year_id', 'student_id', 'status', 'date_from', 'date_to'],
            'requests' => ['student_id', 'status', 'date_from', 'date_to'],
            default => ['date_from', 'date_to'],
        };
    }
}
