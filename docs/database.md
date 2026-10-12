# Modelo de datos final

Inventario consultado en MySQL del proyecto: **52 tablas**. El conteo incluye infraestructura, seguridad, migraciones y dominio; Sprint 10 no agrega tablas. Fuente de estructura: backend/database/migrations; no se ejecutó migrate:fresh ni se regeneraron datos para el cierre.

## Esquema textual por módulo

| Módulo | Tablas y relaciones principales |
| --- | --- |
| Institución e identidad | institutions → users; users tiene institución, estado, must_change_password y contraseña cifrada. |
| RBAC | roles por institución; permissions global; model_has_roles, model_has_permissions y role_has_permissions vinculan usuarios/roles/permisos. Spatie usa team institucional. |
| Autenticación | sessions, password_reset_tokens, personal_access_tokens. La SPA emplea cookies de sesión Sanctum, no tokens guardados en frontend. |
| Estructura académica | academic_years → academic_periods; education_levels → grade_levels; sections referencia año y grado; subjects representa asignaturas. |
| Personas | students, teachers y guardians referencian users; student_guardian es el vínculo N:M con relación familiar y apoderado principal. |
| Matrícula | enrollments enlaza estudiante, año, grado y sección; enrollment_status_history conserva estados y actores. |
| Tesorería | payment_concepts → student_payments, con estudiante, año, importe y validación. |
| Docencia | teacher_assignments enlaza docente, año, asignatura, grado y sección; courses referencia la asignación coherente. |
| Aula virtual | courses → course_units → materials; materiales conservan metadatos, no binarios. |
| Actividades | assignments referencia curso/unidad; assignment_submissions conserva estudiante e intentos, revisión y archivo privado opcional. |
| Evaluación | assessment_types → assessments; cada evaluación referencia curso y academic_periods; scores enlaza evaluación/estudiante; score_history conserva nota anterior/nueva, actor y motivo. |
| Asistencia | attendance_sessions por curso/fecha → attendance_records por estudiante; absence_justifications referencia registro y apoderado; justification_status_history conserva transiciones. |
| Trámites | request_types → academic_requests con estudiante, apoderado opcional y responsable; request_status_history conserva transiciones; academic_documents referencia estudiante y solicitud opcional. |
| Comunicaciones | communications → communication_targets; notifications usa UUID y relación polimórfica con destinatario, data y read_at. |
| Auditoría | audit_logs conserva institución, actor, operación y metadatos permitidos. |
| Infraestructura | migrations, cache, cache_locks, jobs, job_batches, failed_jobs. |

## Aislamiento y relaciones

Las entidades institucionales contienen institution_id o lo resuelven a través de su padre: academic_periods por academic_years y grade_levels por education_levels. Las consultas Eloquent aplican scopes y las relaciones se validan al guardar. permissions y tablas técnicas no representan datos académicos de una institución por sí solas.

No se elimina físicamente el historial de notas, matrículas, solicitudes o justificaciones para corregir estados. Las transiciones registran auditoría; la cancelación no borra la evidencia. Los códigos de solicitud/documento se generan en backend.

Soft deletes se usa donde lo declaran las migraciones/modelos: instituciones, usuarios, años, niveles educativos, grados, asignaturas, perfiles personales, matrículas, cursos, unidades, materiales y tareas. El resto emplea estado o conservación del registro; no debe asumirse borrado lógico universal. Las restricciones únicas y FKs evitan duplicados y referencias inexistentes; Policies y Services verifican además coherencia institucional.

## Pivots e historiales

- student_guardian: relación N:M con atributos; cambiar apoderado principal es transaccional.
- model_has_roles, model_has_permissions, role_has_permissions: relaciones de autorización.
- communication_targets: criterios de publicación, no una segunda lista de personas.
- enrollment_status_history, score_history, justification_status_history, request_status_history: evidencia por entidad, con actor/fecha.
- audit_logs: evidencia transversal; no sustituye a los historiales funcionales.

## Reportes y archivos

Los reportes y dashboards son consultas sobre tablas existentes. Capacidad considera matrículas APPROVED; los intentos de una tarea no se contabilizan como alumnos diferentes. Carga docente se expresa en asignaciones/cursos, no en horas inventadas.

Los archivos residen en storage privado. Las tablas guardan metadatos y rutas internas ocultas a consumidores; descargas requieren autenticación y autorización vigente. No utilizar storage:link para publicar documentos académicos.
