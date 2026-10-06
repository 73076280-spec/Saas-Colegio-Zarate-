# Matriz de cumplimiento

Alcance: definiciones RF entregadas por el responsable del proyecto, implementadas en los Sprints 1–10. La evidencia detallada por endpoint, interfaz y prueba está en [traceability.md](traceability.md); el resultado real de regresión se registra en [quality-metrics.md](quality-metrics.md).

| RF | Nombre | Estado | Evidencia | Observación |
| --- | --- | --- | --- | --- |
| RF-01 | Autenticación de usuarios | IMPLEMENTADO | Auth; Sprint1Test.php | Sesión Sanctum, institución activa y límite de intentos. |
| RF-02 | Cierre de sesión | IMPLEMENTADO | Auth; Sprint1Test.php | Invalida sesión y regenera CSRF; registra auditoría. |
| RF-03 | Gestión de usuarios | IMPLEMENTADO | Users; Sprint1Test.php | Permisos delegables, contraseña cifrada y cambio inicial obligatorio. |
| RF-04 | Gestión de roles y permisos | IMPLEMENTADO | RBAC; Sprint1Test.php | Roles por institución; administrador protegido y sin escalamiento. |
| RF-05 | Gestión de información del estudiante | IMPLEMENTADO | People; Sprint3Test.php | Cuenta compatible, unicidad institucional y conservación histórica. |
| RF-06 | Gestión de matrículas | IMPLEMENTADO | Enrollments; Sprint4Test.php | Aprobación exige elegibilidad, cupo y pago válido cuando corresponde. |
| RF-07 | Consulta del estado de matrícula | IMPLEMENTADO | Enrollments; Sprint4Test.php | Estudiante propio o familiar vinculado; historial del trámite. |
| RF-08 | Gestión de calificaciones | IMPLEMENTADO | Scores; Sprint7Test.php | Docente asignado, matrícula aprobada, periodo habilitado y trazabilidad de cambios. |
| RF-09 | Consulta de calificaciones | IMPLEMENTADO | Scores; Sprint7Test.php | Notas propias publicadas; apoderado solo resumen de estudiantes vinculados. |
| RF-10 | Gestión de actividades académicas | IMPLEMENTADO | Assignments / Assessments; Sprint7Test.php | Publicación y cierre autorizados; no se edita una actividad cerrada. |
| RF-11 | Gestión de materiales académicos | IMPLEMENTADO | Classroom; Sprint6Test.php | Unidades y materiales publicados, carga validada y archivo privado. |
| RF-12 | Entrega de actividades | IMPLEMENTADO | Submissions; Sprint7Test.php | Titular aprobado, fecha límite y nuevos intentos sin sobrescribir historial. |
| RF-13 | Gestión de asistencia | IMPLEMENTADO | Attendance; Sprint8Test.php | Docente asignado; registro único por sesión y estudiante aprobado. |
| RF-14 | Consulta de asistencia | IMPLEMENTADO | Attendance; Sprint8Test.php | Consulta propia o vinculada; sin escritura del estudiante. |
| RF-15 | Justificación de inasistencias | IMPLEMENTADO | Justifications; Sprint8Test.php | Apoderado vinculado; revisión institucional e historial con archivo privado. |
| RF-16 | Gestión de solicitudes académicas | IMPLEMENTADO | Requests; Sprint9Test.php | Código de servidor y transiciones con historial, auditoría y notificación atómicos. |
| RF-17 | Seguimiento de solicitudes | IMPLEMENTADO | Requests; Sprint9Test.php | Titular o familiar vinculado; observación, corrección y resolución visibles. |
| RF-18 | Gestión de documentos académicos | IMPLEMENTADO | Documents; Sprint9Test.php | Emisión autorizada; titular solo documentos emitidos; descarga privada. |
| RF-19 | Gestión de comunicaciones | IMPLEMENTADO | Communications; Sprint9Test.php | Destinatarios institucionales validados y deduplicados al publicar. |
| RF-20 | Gestión de notificaciones | IMPLEMENTADO | Notifications; Sprint9Test.php | UUID propio, filtro leído/no leído y marcado individual o masivo. |
| RF-21 | Portal del padre/apoderado | IMPLEMENTADO | Family / Dashboard; Sprint10Test.php | Solo estudiantes asociados; resumen académico sin administrar notas. |
| RF-22 | Aula virtual | IMPLEMENTADO | Classroom / Courses; Sprint6Test.php | Matrícula APPROVED y curso activo; borradores ocultos a estudiantes. |
| RF-23 | Generación de reportes | IMPLEMENTADO | Reports; Sprint10Test.php | 20 reportes, filtros autorizados, CSV completo y protección de fórmulas. |
| RF-24 | Auditoría del sistema | IMPLEMENTADO | Audit; Sprint1Test.php | Registro institucional de operaciones críticas; sin contraseñas ni archivos. |

24 RF implementados dentro del alcance definido; ninguno parcial o pendiente de implementación. Esto no certifica requisitos externos no especificados. Limitaciones: demo local, sin despliegue productivo certificado; CSV sin Excel/PDF; cinco notas recientes en el resumen familiar; no libreta oficial automática, correo/SMS, pagos bancarios ni contabilidad.
