# API REST final

Inventario del router Laravel: **210 combinaciones método + ruta API**, contando PUT y PATCH por separado y excluyendo HEAD implícito. Las rutas parametrizadas cuentan una vez por método, no una por ID ni una por los veinte tipos de reporte. Fuente: rutas cargadas por Laravel desde backend/routes/api.php, consultadas el 6 de octubre de 2026.

Salvo /api/health y login, se requiere sesión Sanctum y contexto institucional; las rutas de negocio además exigen password.changed. La SPA obtiene CSRF en GET /sanctum/csrf-cookie (ruta de Sanctum fuera de este inventario API). Enviar cookies, Accept: application/json y X-XSRF-TOKEN en escrituras. La institución nunca se selecciona mediante un header arbitrario.

401: sesión inválida; 403: autorización denegada; 404: registro inexistente/no visible; 422: validación; 419: CSRF; 429: límite de solicitudes. No interpretar un botón oculto como control de seguridad: Laravel decide siempre.

La columna de permisos indica el control aplicable; los nombres exactos por catálogo/recurso y acción se resuelven en las Policies y Form Requests referidas. Véase [roles-permissions.md](roles-permissions.md) y los contratos de cada [sprint](sprints/).

## Health

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/health | Público: estado técnico mínimo | Comprobación técnica |

## Auth

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| POST | /api/v1/auth/login | Sesión Sanctum; login público limitado; cambio de contraseña: usuario autenticado | Autenticar en institución |
| GET | /api/v1/auth/me | Sesión Sanctum; login público limitado; cambio de contraseña: usuario autenticado | Identidad autenticada |
| POST | /api/v1/auth/logout | Sesión Sanctum; login público limitado; cambio de contraseña: usuario autenticado | Invalidar sesión |
| POST | /api/v1/auth/change-password | Sesión Sanctum; login público limitado; cambio de contraseña: usuario autenticado | Cambiar contraseña |

## Dashboard

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/dashboard | profile.view; rol y permisos de indicadores; vínculo familiar comprobado | Indicadores reales por rol |

## Reports

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/reports | ReportPolicy; rol y permiso del módulo, docente solo sus cursos | Catálogo permitido |
| GET | /api/v1/reports/{report}/options/{option} | ReportPolicy; opciones institucionales y alcance docente | Opciones de consulta autorizada |
| GET | /api/v1/reports/{report}/export | ReportPolicy; rol y permiso del módulo, docente solo sus cursos | CSV completo con filtros |
| GET | /api/v1/reports/{report} | ReportPolicy; rol y permiso del módulo, docente solo sus cursos | Listado paginado |

## Classroom

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/courses/{course}/units | ClassroomPolicy; docente asignado o estudiante aprobado | Listado paginado |
| POST | /api/v1/courses/{course}/units | ClassroomPolicy; docente asignado o estudiante aprobado | Creación |
| GET | /api/v1/course-units/{id} | ClassroomPolicy; docente asignado o estudiante aprobado | Consulta de detalle |
| PATCH | /api/v1/course-units/{id} | ClassroomPolicy; docente asignado o estudiante aprobado | Actualización / transición |
| POST | /api/v1/course-units/{id}/publish | ClassroomPolicy; docente asignado o estudiante aprobado | Actualización / transición |
| POST | /api/v1/course-units/{id}/archive | ClassroomPolicy; docente asignado o estudiante aprobado | Actualización / transición |
| GET | /api/v1/courses/{course}/materials | ClassroomPolicy; docente asignado o estudiante aprobado | Listado paginado |
| POST | /api/v1/courses/{course}/materials | ClassroomPolicy; docente asignado o estudiante aprobado | Creación |
| GET | /api/v1/materials/{id} | ClassroomPolicy; docente asignado o estudiante aprobado | Consulta de detalle |
| PATCH | /api/v1/materials/{id} | ClassroomPolicy; docente asignado o estudiante aprobado | Actualización / transición |
| POST | /api/v1/materials/{id}/publish | ClassroomPolicy; docente asignado o estudiante aprobado | Actualización / transición |
| POST | /api/v1/materials/{id}/archive | ClassroomPolicy; docente asignado o estudiante aprobado | Actualización / transición |

| GET | /api/v1/materials/{id}/download | ClassroomPolicy; docente asignado o estudiante aprobado | Descarga privada autorizada |

## Assignments

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/courses/{course}/assignments | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |
| POST | /api/v1/courses/{course}/assignments | LearningPolicy; permiso por recurso y alcance docente/estudiante | Creación |
| POST | /api/v1/assignments/{id}/publish | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| POST | /api/v1/assignments/{id}/close | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| GET | /api/v1/assignments/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Consulta de detalle |
| PATCH | /api/v1/assignments/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| GET | /api/v1/my/assignments | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |

## Assessments

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/courses/{course}/assessments | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |
| POST | /api/v1/courses/{course}/assessments | LearningPolicy; permiso por recurso y alcance docente/estudiante | Creación |
| POST | /api/v1/assessments/{id}/publish | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| POST | /api/v1/assessments/{id}/close | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| GET | /api/v1/assessments/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Consulta de detalle |
| PATCH | /api/v1/assessments/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| GET | /api/v1/my/assessments | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |

## Submissions

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/submissions/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Consulta de detalle |
| PATCH | /api/v1/submissions/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| GET | /api/v1/my/submissions | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |
| GET | /api/v1/assignments/{assignment}/submissions | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |
| POST | /api/v1/assignments/{assignment}/submissions | LearningPolicy; permiso por recurso y alcance docente/estudiante | Creación |
| POST | /api/v1/submissions/{id}/review | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| GET | /api/v1/submissions/{id}/download | LearningPolicy; permiso por recurso y alcance docente/estudiante | Descarga privada autorizada |

## Scores

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/scores/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Consulta de detalle |
| PATCH | /api/v1/scores/{id} | LearningPolicy; permiso por recurso y alcance docente/estudiante | Actualización / transición |
| GET | /api/v1/my/scores | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |
| GET | /api/v1/assessments/{assessment}/scores | LearningPolicy; permiso por recurso y alcance docente/estudiante | Listado paginado |
| POST | /api/v1/assessments/{assessment}/scores | LearningPolicy; permiso por recurso y alcance docente/estudiante | Creación |
| GET | /api/v1/scores/{id}/history | LearningPolicy; permiso por recurso y alcance docente/estudiante | Historial de cambios |

## Learning

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/courses/{course}/assessment-types | LearningPolicy; permiso por recurso y alcance docente/estudiante | Opciones permitidas |
| GET | /api/v1/courses/{course}/assessment-periods | LearningPolicy; permiso por recurso y alcance docente/estudiante | Opciones permitidas |

## Attendance

| Método | Ruta | Rol / permiso / alcance | Descripción |

| --- | --- | --- | --- |
| GET | /api/v1/courses/{course}/attendance-sessions | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Sesiones del curso |
| POST | /api/v1/courses/{course}/attendance-sessions | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Guardar/cerrar sesión |
| GET | /api/v1/attendance-sessions/{id} | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Detalle de sesión |
| PATCH | /api/v1/attendance-sessions/{id} | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Guardar/cerrar sesión |
| POST | /api/v1/attendance-sessions/{id}/close | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Guardar/cerrar sesión |
| GET | /api/v1/attendance-sessions/{session}/records | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Registros de asistencia |
| POST | /api/v1/attendance-sessions/{session}/records | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Registrar/corregir asistencia |
| PATCH | /api/v1/attendance-records/{id} | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Registrar/corregir asistencia |
| GET | /api/v1/my/attendance | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Consulta personal/familiar |
| GET | /api/v1/guardians/{guardian}/students/{student}/attendance | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Consulta personal/familiar |

## Justifications

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/absence-justifications | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Justificaciones permitidas |
| POST | /api/v1/attendance-records/{record}/justifications | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Crear justificación |
| GET | /api/v1/absence-justifications/{id} | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Detalle de justificación |
| GET | /api/v1/absence-justifications/{id}/history | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Historial de cambios |
| GET | /api/v1/absence-justifications/{id}/download | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Descarga privada autorizada |
| POST | /api/v1/absence-justifications/{id}/review | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Transición validada |
| POST | /api/v1/absence-justifications/{id}/approve | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Transición validada |
| POST | /api/v1/absence-justifications/{id}/reject | AttendancePolicy; docente asignado, consulta propia o familiar vinculado | Transición validada |

## Requests

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/academic-requests | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Listado paginado |
| POST | /api/v1/academic-requests | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Creación |
| GET | /api/v1/academic-requests/{id} | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Consulta de detalle |
| PATCH | /api/v1/academic-requests/{id} | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Actualización / transición |
| POST | /api/v1/academic-requests/{id}/review | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| POST | /api/v1/academic-requests/{id}/observe | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| POST | /api/v1/academic-requests/{id}/approve | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| POST | /api/v1/academic-requests/{id}/reject | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| POST | /api/v1/academic-requests/{id}/complete | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| GET | /api/v1/academic-requests/{id}/history | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Historial de cambios |
| GET | /api/v1/my/requests | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Listado paginado |

## Documents

| Método | Ruta | Rol / permiso / alcance | Descripción |

| --- | --- | --- | --- |
| GET | /api/v1/academic-documents | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Listado paginado |
| POST | /api/v1/academic-documents | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Creación |
| GET | /api/v1/academic-documents/{id} | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Consulta de detalle |
| POST | /api/v1/academic-documents/{id}/issue | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| POST | /api/v1/academic-documents/{id}/cancel | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| GET | /api/v1/academic-documents/{id}/download | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Descarga privada autorizada |

## Communications

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/communications | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Listado paginado |
| POST | /api/v1/communications | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Creación |
| GET | /api/v1/communications/{id} | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Consulta de detalle |
| PATCH | /api/v1/communications/{id} | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Actualización / transición |
| POST | /api/v1/communications/{id}/publish | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |
| POST | /api/v1/communications/{id}/archive | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Transición validada |

## Office

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/request-types | OfficePolicy; permiso por recurso, titular/vínculo o Secretaría | Tipos activos |
| GET | /api/v1/office-options/{option} | OfficeAccess; selector limitado a rol y alcance | Opciones de consulta autorizada |

## Notifications

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/notifications | notifications.view; exclusivamente destinatario autenticado | Listado paginado |
| GET | /api/v1/my/notifications | notifications.view; exclusivamente destinatario autenticado | Listado paginado |
| POST | /api/v1/notifications/read-all | notifications.view; exclusivamente destinatario autenticado | Marcar propia(s) como leída(s) |
| POST | /api/v1/notifications/{id}/read | notifications.view; exclusivamente destinatario autenticado | Marcar propia(s) como leída(s) |

## Courses

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/teaching-options | Opciones de gestión docente autorizada | Opciones de consulta autorizada |
| GET | /api/v1/teacher-assignments | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Listado paginado |
| POST | /api/v1/teacher-assignments | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Creación |
| GET | /api/v1/teacher-assignments/{id} | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Consulta de detalle |
| PATCH | /api/v1/teacher-assignments/{id} | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Actualización / transición |
| GET | /api/v1/courses | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Listado paginado |
| POST | /api/v1/courses | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Creación |
| GET | /api/v1/courses/{id} | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Consulta de detalle |
| PATCH | /api/v1/courses/{id} | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Actualización / transición |
| POST | /api/v1/courses/{id}/activate | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Actualización / transición |
| POST | /api/v1/courses/{id}/close | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Actualización / transición |
| POST | /api/v1/teacher-assignments/{id}/disable | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Actualización / transición |
| GET | /api/v1/teachers/{teacher}/courses | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Listado paginado |

| GET | /api/v1/students/{student}/courses | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Listado paginado |
| GET | /api/v1/my/courses | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Listado paginado |
| GET | /api/v1/courses/{id}/students | CoursePolicy / TeacherAssignmentPolicy; gestión o curso propio/aprobado | Estudiantes con matrícula aprobada |

## Enrollments

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/enrollment-options | Opciones mínimas autorizadas de matrícula | Opciones de consulta autorizada |
| GET | /api/v1/enrollments | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Listado paginado |
| POST | /api/v1/enrollments | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Creación |
| GET | /api/v1/enrollments/{id} | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Consulta de detalle |
| PATCH | /api/v1/enrollments/{id} | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Actualización / transición |
| POST | /api/v1/enrollments/{id}/submit | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Transición validada |
| POST | /api/v1/enrollments/{id}/observe | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Transición validada |
| POST | /api/v1/enrollments/{id}/approve | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Transición validada |
| POST | /api/v1/enrollments/{id}/reject | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Transición validada |
| POST | /api/v1/enrollments/{id}/cancel | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Transición validada |
| GET | /api/v1/students/{student}/enrollments | enrollments.*; consulta propia/vinculada mediante EnrollmentPolicy | Listado paginado |

## Payments

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/payment-concepts | payments.view/create/update/validate; PaymentPolicy | Conceptos de pago |
| POST | /api/v1/payment-concepts | payments.view/create/update/validate; PaymentPolicy | Crear concepto |
| GET | /api/v1/student-payments | payments.view/create/update/validate; PaymentPolicy | Listado paginado |
| POST | /api/v1/student-payments | payments.view/create/update/validate; PaymentPolicy | Creación |
| GET | /api/v1/student-payments/{id} | payments.view/create/update/validate; PaymentPolicy | Consulta de detalle |
| PATCH | /api/v1/student-payments/{id} | payments.view/create/update/validate; PaymentPolicy | Actualización / transición |
| POST | /api/v1/student-payments/{id}/validate | payments.view/create/update/validate; PaymentPolicy | Validar pago |

## Family

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/profile/people | Perfil propio; apoderado vinculado | Consulta de detalle |
| GET | /api/v1/profile/family | Perfil propio; apoderado vinculado | Relaciones propias |
| GET | /api/v1/students/{student}/guardians | FamilyPolicy y permisos de relaciones familiares | Listado paginado |
| POST | /api/v1/students/{student}/guardians | FamilyPolicy y permisos de relaciones familiares | Creación |
| PATCH | /api/v1/students/{student}/guardians/{guardian} | FamilyPolicy y permisos de relaciones familiares | Actualización / transición |
| DELETE | /api/v1/students/{student}/guardians/{guardian} | FamilyPolicy y permisos de relaciones familiares | Desvinculación |
| GET | /api/v1/guardians/{guardian}/students | FamilyPolicy y permisos de relaciones familiares | Estudiantes vinculados |

## People

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/students/accounts | Permiso de people/acción; PersonPolicy | Cuentas compatibles |
| GET | /api/v1/students | Permiso de people/acción; PersonPolicy | Listado paginado |
| POST | /api/v1/students | Permiso de people/acción; PersonPolicy | Creación |
| GET | /api/v1/students/{person} | Permiso de people/acción; PersonPolicy | Consulta de detalle |
| PUT | /api/v1/students/{person} | Permiso de people/acción; PersonPolicy | Actualización / transición |
| PATCH | /api/v1/students/{person} | Permiso de people/acción; PersonPolicy | Actualización / transición |
| POST | /api/v1/students/{person}/disable | Permiso de people/acción; PersonPolicy | Actualización / transición |

| GET | /api/v1/teachers/accounts | Permiso de people/acción; PersonPolicy | Cuentas compatibles |
| GET | /api/v1/teachers | Permiso de people/acción; PersonPolicy | Listado paginado |
| POST | /api/v1/teachers | Permiso de people/acción; PersonPolicy | Creación |
| GET | /api/v1/teachers/{person} | Permiso de people/acción; PersonPolicy | Consulta de detalle |
| PUT | /api/v1/teachers/{person} | Permiso de people/acción; PersonPolicy | Actualización / transición |
| PATCH | /api/v1/teachers/{person} | Permiso de people/acción; PersonPolicy | Actualización / transición |
| POST | /api/v1/teachers/{person}/disable | Permiso de people/acción; PersonPolicy | Actualización / transición |
| GET | /api/v1/guardians/accounts | Permiso de people/acción; PersonPolicy | Cuentas compatibles |
| GET | /api/v1/guardians | Permiso de people/acción; PersonPolicy | Listado paginado |
| POST | /api/v1/guardians | Permiso de people/acción; PersonPolicy | Creación |
| GET | /api/v1/guardians/{person} | Permiso de people/acción; PersonPolicy | Consulta de detalle |
| PUT | /api/v1/guardians/{person} | Permiso de people/acción; PersonPolicy | Actualización / transición |
| PATCH | /api/v1/guardians/{person} | Permiso de people/acción; PersonPolicy | Actualización / transición |
| POST | /api/v1/guardians/{person}/disable | Permiso de people/acción; PersonPolicy | Actualización / transición |

## Academic

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/academic-years | Permiso del catálogo y acción; AcademicPolicy | Listado paginado |
| POST | /api/v1/academic-years | Permiso del catálogo y acción; AcademicPolicy | Creación |
| GET | /api/v1/academic-years/{record} | Permiso del catálogo y acción; AcademicPolicy | Consulta de detalle |
| PUT | /api/v1/academic-years/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| PATCH | /api/v1/academic-years/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| POST | /api/v1/academic-years/{record}/close | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| GET | /api/v1/academic-periods | Permiso del catálogo y acción; AcademicPolicy | Listado paginado |
| POST | /api/v1/academic-periods | Permiso del catálogo y acción; AcademicPolicy | Creación |
| GET | /api/v1/academic-periods/{record} | Permiso del catálogo y acción; AcademicPolicy | Consulta de detalle |
| PUT | /api/v1/academic-periods/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| PATCH | /api/v1/academic-periods/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| POST | /api/v1/academic-periods/{record}/close | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| GET | /api/v1/education-levels | Permiso del catálogo y acción; AcademicPolicy | Listado paginado |
| POST | /api/v1/education-levels | Permiso del catálogo y acción; AcademicPolicy | Creación |
| GET | /api/v1/education-levels/{record} | Permiso del catálogo y acción; AcademicPolicy | Consulta de detalle |
| PUT | /api/v1/education-levels/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| PATCH | /api/v1/education-levels/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| GET | /api/v1/grade-levels | Permiso del catálogo y acción; AcademicPolicy | Listado paginado |
| POST | /api/v1/grade-levels | Permiso del catálogo y acción; AcademicPolicy | Creación |
| GET | /api/v1/grade-levels/{record} | Permiso del catálogo y acción; AcademicPolicy | Consulta de detalle |
| PUT | /api/v1/grade-levels/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| PATCH | /api/v1/grade-levels/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| GET | /api/v1/sections | Permiso del catálogo y acción; AcademicPolicy | Listado paginado |
| POST | /api/v1/sections | Permiso del catálogo y acción; AcademicPolicy | Creación |
| GET | /api/v1/sections/{record} | Permiso del catálogo y acción; AcademicPolicy | Consulta de detalle |
| PUT | /api/v1/sections/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| PATCH | /api/v1/sections/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |

| GET | /api/v1/subjects | Permiso del catálogo y acción; AcademicPolicy | Listado paginado |
| POST | /api/v1/subjects | Permiso del catálogo y acción; AcademicPolicy | Creación |
| GET | /api/v1/subjects/{record} | Permiso del catálogo y acción; AcademicPolicy | Consulta de detalle |
| PUT | /api/v1/subjects/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| PATCH | /api/v1/subjects/{record} | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |
| POST | /api/v1/subjects/{record}/disable | Permiso del catálogo y acción; AcademicPolicy | Actualización / transición |

## Users

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/users | users.* según acción; gestión delegable y último administrador protegido | Listado paginado |
| POST | /api/v1/users | users.* según acción; gestión delegable y último administrador protegido | Creación |
| GET | /api/v1/users/{user} | users.* según acción; gestión delegable y último administrador protegido | Consulta de detalle |
| PUT | /api/v1/users/{user} | users.* según acción; gestión delegable y último administrador protegido | Actualización / transición |
| PATCH | /api/v1/users/{user} | users.* según acción; gestión delegable y último administrador protegido | Actualización / transición |
| POST | /api/v1/users/{user}/disable | users.* según acción; gestión delegable y último administrador protegido | Desactivar cuenta |

## Roles

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/roles | roles.view / roles.manage; permisos delegables | Listado paginado |
| GET | /api/v1/permissions | roles.view / roles.manage; permisos delegables | Permisos disponibles |
| PUT | /api/v1/roles/{role}/permissions | roles.view / roles.manage; permisos delegables | Actualización / transición |

## Institution

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/institutions | institutions.view / institutions.update; institución propia | Listado paginado |
| GET | /api/v1/institutions/{institution} | institutions.view / institutions.update; institución propia | Consulta de detalle |
| PUT | /api/v1/institutions/{institution} | institutions.view / institutions.update; institución propia | Actualización / transición |
| PATCH | /api/v1/institutions/{institution} | institutions.view / institutions.update; institución propia | Actualización / transición |

## Profile

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/profile | profile.view / profile.update; usuario propio | Consulta de detalle |
| PATCH | /api/v1/profile | profile.view / profile.update; usuario propio | Actualización / transición |

## Audit

| Método | Ruta | Rol / permiso / alcance | Descripción |
| --- | --- | --- | --- |
| GET | /api/v1/audit-logs | audit.view; registros institucionales | Listado paginado |

## Reportes y dashboard

GET /api/v1/reports devuelve únicamente reportes permitidos con sus filtros. Cada ID del catálogo se utiliza en /reports/{report}, /export y /options/{option}. Filtros: academic_year_id, academic_period_id, education_level_id, grade_level_id, section_id, course_id, subject_id, teacher_id, student_id, status, date_from/date_to, solo cuando el reporte los admite. page inicia en 1; per_page admite 1–100, por defecto 20. Opciones admiten search y page. No se acepta institution_id del cliente.

CSV usa las mismas columnas y filtros, todas las páginas, UTF-8 con BOM, encabezados de descarga y protección contra fórmulas. No incluye rutas de storage, documentos, contraseñas, cuerpos privados ni descripciones de solicitudes. GET /dashboard acepta academic_year_id institucional; sin filtro usa año actual y, si no existe, todos los años, indicado en respuesta.

