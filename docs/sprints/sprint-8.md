# Sprint 8 — Asistencia y justificaciones

## Alcance

Sesiones por curso y fecha, asistencia masiva, consultas personales, justificaciones con adjunto privado opcional, revisión por Secretaría, historial y auditoría. Se integra con Sanctum, Spatie, contexto institucional, CourseAccess, matrículas APPROVED y relaciones familiares existentes.

No incluye solicitudes académicas, comunicaciones, notificaciones ni reportes finales. No implementa Sprint 9.

## Tablas

| Tabla | Contenido y restricciones |
| --- | --- |
| attendance_sessions | institution_id, course_id, date, topic opcional, status, created_by, closed_at y timestamps. Única por curso/fecha. |
| attendance_records | institution_id, attendance_session_id, student_id, status, observations, recorded_by y timestamps. Única por sesión/estudiante. |
| absence_justifications | institution_id, attendance_record_id único, student_id, guardian_id, reason, metadatos del adjunto privado, status, reviewed_by, reviewed_at, review_comment y timestamps. |
| justification_status_history | institution_id, absence_justification_id, previous_status, new_status, changed_by, comment y created_at. Inmutable. |

Las cuatro tablas reutilizan el scope institucional y claves foráneas con borrado restringido. No hay endpoints DELETE ni eliminación física de historial. Las referencias históricas a curso/estudiante admiten perfiles archivados. No se crean factories redundantes: los diez casos nuevos reutilizan CourseFactory, StudentFactory y GuardianFactory y ejercitan la creación mediante API.

## Estados y reglas

- Sesión OPEN → CLOSED. Curso ACTIVE y docente asignado activo; administración puede supervisar con permisos.
- No se cambia la fecha de una sesión con registros. No se repite curso/fecha.
- Registro PRESENT, ABSENT o LATE por el docente. JUSTIFIED solo mediante aprobación de justificación.
- Registro masivo: entre 1 y 100 filas por solicitud, student_id sin repeticiones. Upsert conserva el ID y no duplica sesión/estudiante.
- Todos los estudiantes del lote deben pertenecer al roster APPROVED del curso. Si falla una fila, no se guarda ninguna.
- Cierre bloquea actualización de sesión y asistencia ordinaria. La aprobación administrativa sí puede convertir una falta de sesión cerrada en JUSTIFIED.
- Una falta con justificación no se edita por el docente, incluso después de una decisión, para conservar consistencia.
- Solo un apoderado con perfil activo y vínculo vigente puede crear justificación; solo de un registro ABSENT sin solicitud previa.
- Se admite una justificación por falta. No hay reenvío, reapertura ni apelación tras rechazo en este sprint.
- PENDING → IN_REVIEW → APPROVED o REJECTED. No se salta la revisión, repite una decisión ni revierte un estado final.
- Rechazar exige comentario y mantiene ABSENT. Aprobar cambia a JUSTIFIED.
- Estudiantes consultan únicamente sus registros; no justifican ni acceden al roster docente.
- Apoderados consultan exclusivamente estudiantes vinculados, incluido el estado e historial de sus justificaciones.
- La asistencia histórica propia permanece disponible aunque cambie la matrícula posteriormente. Esto no concede acceso al aula ni autorización para registrar nueva asistencia.
- Las escrituras usan transacciones y el bloqueo institucional existente; historial, decisión, cambio de asistencia y auditoría se confirman juntos.

## Autorización

Se agregan nueve permisos: attendance.view/create/update/close y justifications.view/create/review/approve/reject.

| Rol | Alcance |
| --- | --- |
| TEACHER | Los cuatro permisos attendance, exclusivamente cursos asignados. |
| STUDENT | attendance.view; consulta personal con perfil activo. |
| GUARDIAN | attendance.view, justifications.view/create; estudiantes vinculados. |
| SECRETARY | attendance.view, justifications.view/review/approve/reject; revisión institucional. |
| ADMINISTRATOR | Los nueve permisos para supervisar y delegar roles; crear una justificación sigue exigiendo vínculo como apoderado en la Policy. |

AttendancePolicy utiliza AttendanceAccess, ClassroomAccess y CourseAccess. La institución se obtiene del usuario autenticado; no del cuerpo ni parámetros del cliente. GET ajeno devuelve 404 y escritura sin permiso 403; regla inválida devuelve 422.

Integración estricta con Personas: la creación de una cuenta GUARDIAN permite delegar su permiso fijo justifications.create sin otorgar a Secretaría capacidad de justificar. Se conserva el control de los demás permisos.

## API

Prefijo **/api/v1**, sesión Sanctum, CSRF y middleware institucional. Form Request para validación final; Services para reglas y transacciones.

| Método | Ruta |
| --- | --- |
| GET, POST | /courses/{course}/attendance-sessions |
| GET, PATCH | /attendance-sessions/{id} |
| POST | /attendance-sessions/{id}/close |
| GET, POST | /attendance-sessions/{session}/records |
| PATCH | /attendance-records/{id} |
| GET | /my/attendance |
| GET | /guardians/{guardian}/students/{student}/attendance |
| GET | /absence-justifications |
| POST | /attendance-records/{record}/justifications |
| GET | /absence-justifications/{id} |
| POST | /absence-justifications/{id}/review |
| POST | /absence-justifications/{id}/approve |
| POST | /absence-justifications/{id}/reject |
| GET | /absence-justifications/{id}/history |
| GET | /absence-justifications/{id}/download |

Listados paginados: page y per_page (20 por defecto, máximo 100). Justificaciones admite status, student_id y date (fecha de asistencia). GET records devuelve roster con student_id, student, can_record y record opcional; incluye registros históricos aunque el estudiante ya no tenga matrícula aprobada. Estos se muestran en solo lectura y se excluyen del guardado masivo.

Ejemplos de cuerpos:

~~~json
{"date":"2026-10-05","topic":"Operaciones"}
~~~

~~~json
{"records":[{"student_id":1,"status":"ABSENT","observations":"Registro de ejemplo"}]}
~~~

Justificar admite reason y file opcional mediante multipart, o JSON sin archivo. Review/approve/reject admiten review_comment, obligatorio al rechazar. Institution, autores, guardian_id, rutas, metadatos y estados administrativos no pueden ser impuestos por el cliente.

## Archivos y auditoría

Se reutilizan MaterialFiles y el disco privado materials del Sprint 6: máximo 2 MiB, extensión permitida, MIME real, validación de estructura OOXML y rechazo de ejecutables. Las rutas UUID no se exponen; descarga autenticada con comprobación de permisos, attachment, nosniff y no-store. Si la transacción falla, se descarta el nuevo adjunto.

AuditAction incorpora JUSTIFY. Se registran CREATE, UPDATE, CLOSE, JUSTIFY, REVIEW, APPROVE y REJECT, con actor, institución, entidad y metadatos anteriores/nuevos. No se registran binarios, rutas, motivos ni comentarios privados en audit_logs; la razón y comentarios se consultan mediante el recurso y su historial autorizado.

## Interfaz

- Docente: Mis cursos → curso → Asistencia; crear sesión, marcar estados y observaciones, guardar la página y cerrar con confirmación.
- Estudiante: Mi asistencia; fecha, curso, estado y observación.
- Apoderado: Asistencia de mis estudiantes; selector de vínculos, justificar falta, archivo opcional, estado, detalle e historial.
- Secretaría/administración: Justificaciones; filtros por estado, estudiante por nombre y fecha; detalle, descargar sustento, iniciar revisión, aprobar o rechazar.
- Paginación, carga, errores, estados vacíos y badges en la paleta institucional naranja/beige/café. Tablas con desplazamiento dentro de su contenedor en móvil.

## Preparación y demo

Con Sprints 1–7 preparados, desde D:\zarate-saas\backend:

~~~powershell
& ..\.tools\php\php.exe artisan migrate
& ..\.tools\php\php.exe artisan migrate --env=testing
& ..\.tools\php\php.exe artisan db:seed --class=AttendanceDemoSeeder
~~~

No se reinstalan dependencias, regeneran claves ni reemplazan credenciales. El seeder solo admite local/testing y omite sesiones existentes para preservar decisiones posteriores.

DEMO-MAT-2026, estudiante student@zarate.test y docente teacher@zarate.test:

| Fecha | Sesión | Registro |
| --- | --- | --- |
| 2026-10-01 | CLOSED | PRESENT |
| 2026-10-02 | CLOSED | ABSENT, justificación PENDING del apoderado |
| 2026-10-03 | OPEN | LATE |

Se usan tres sesiones para representar los tres estados sin modificar matrículas ni agregar estudiantes ficticios innecesarios. Guardian guardian@zarate.test permanece vinculado; student2@zarate.test mantiene su matrícula observada.

Institución ZARATE; cuentas teacher@zarate.test, student@zarate.test, guardian@zarate.test, secretary@zarate.test y administrator@zarate.test. Contraseña demo inicial: ZarateDemo2026! si no fue modificada.

## Prueba manual

1. Abrir http://localhost:5173/login. Ingresar con institución ZARATE, teacher@zarate.test y contraseña demo.
2. Mis cursos → buscar DEMO-MAT-2026 → Entrar al curso → Asistencia.
3. Nueva asistencia: elegir una fecha no usada y tema. Crear, marcar al estudiante como Falta, guardar. Comprobar el mensaje y cerrar con confirmación.
4. Cerrar sesión e ingresar como guardian@zarate.test → Asistencia de mis estudiantes → seleccionar Demo STUDENT.
5. En la falta recién creada pulsar Justificar, escribir motivo y adjuntar opcionalmente un TXT/PDF permitido de hasta 2 MiB. Enviar; comprobar Pendiente y abrir historial.
6. Como secretary@zarate.test → Justificaciones. Filtrar por fecha, estado o estudiante; abrir la solicitud.
7. Iniciar revisión; comprobar En revisión. Escribir comentario y Aprobar justificación, confirmando.
8. Como student@zarate.test → Mi asistencia: comprobar Justificada. Como guardian@zarate.test, comprobar Justificada/Aprobada e historial de tres estados.
9. Para rechazo, usar otra falta/fecha, justificar y revisar; rechazar con motivo. Debe conservar Falta y mostrar Rechazada.
10. Como docente, intentar modificar una sesión cerrada: no habrá edición. Comprobar las vistas móviles y que student2 no ve registros del otro estudiante.

## Pruebas y resultados

Diez casos Pest nuevos: gestión y cierre docente; docente ajeno; roster/atomicidad; duplicados; vínculo y archivo seguro; apoderado ajeno; aprobación con rollback e historial; rechazo; privacidad estudiantil e historial; aislamiento institucional.

Tres Cypress nuevos: docente registra/cierra; apoderado envía archivo privado; Secretaría aprueba y estudiante/apoderado consultan JUSTIFIED. Usan sesiones propias con prefijo E2E y fechas nuevas; no alteran la demo ni aumentan casos por variantes redundantes.

~~~text
backend: ..\.tools\php\php.exe vendor/bin/pest --compact
backend: ..\.tools\php\php.exe vendor/bin/pint --test
frontend: npm run lint
frontend: npm run build
e2e: npm run typecheck
e2e: npm test
~~~

Pest usa exclusivamente zarate_test; Cypress usa los servicios locales con datos ficticios. Las reejecuciones no cuentan como pruebas nuevas.

| Comprobación | Resultado |
| --- | --- |
| Pest nuevas | **10 aprobadas** |
| Total Pest | **296 aprobadas** |
| Cypress nuevas | **3 aprobadas** |
| Total Cypress | **37 pruebas distintas validadas** |
| Total general | **333 pruebas distintas aprobadas** |
| Pint | Aprobado |
| ESLint | Aprobado |
| TypeScript frontend y Cypress | Aprobado |
| Build de producción | Aprobado |

La regresión completa Pest aprobó 296 pruebas y 1768 aserciones. Después del ajuste final de lectura histórica/delegación, los diez casos del módulo se reejecutaron: 100 aserciones, todos aprobados.

La regresión completa Cypress ejecutó 37 casos en diez especificaciones: los 34 anteriores aprobaron y asistencia tuvo dos aprobados y un fallo de sincronización al comprobar el adjunto antes de cargar detalle e historial. Se corrigió esperando ambas respuestas reales, sin esperas fijas ni simulación del backend. La reejecución final de attendance.cy.ts aprobó sus tres casos, sin fallos, omisiones ni pendientes. Por tanto, quedan validadas 37 pruebas distintas mediante regresión completa y reejecución de la especificación corregida; no se afirma que las 37 pasaran en una sola ejecución.

AttendanceDemoSeeder se ejecutó dos veces satisfactoriamente, conservando sesiones, decisiones y credenciales existentes. Las interrupciones temporales de aprobación automática por capacidad del servicio se resolvieron mediante la revisión normal; no quedó ninguna acción bloqueada.

No hay errores conocidos ni pendientes funcionales dentro del alcance. **Sprint 8 cerrado.** No se implementó Sprint 9.

## Próximo sprint

Definir alcance y estados de solicitudes académicas, permisos y documentación necesaria antes de implementarlas. No hay código de Sprint 9 en este sprint.
