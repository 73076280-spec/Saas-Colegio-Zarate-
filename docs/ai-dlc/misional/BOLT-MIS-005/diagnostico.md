# BOLT-MIS-005 — Diagnóstico de asistencia y seguimiento académico

Fecha: 01/11/2026. EcoAula SaaS — Colegio Zárate de Huancayo, 2026. Macroproceso misional. Auditoría funcional y técnica por inspección del repositorio, sin implementación.

## Alcance y evidencia de esta intervención

Rama comprobada: `feature/asistencia-seguimiento`. HEAD inicial: `4672a6e` — `Merge pull request #5 from 73076280-spec/feature/evaluacion-academica`. `git status --short` estaba vacío. Git confirmó que `feature/macro-misional` es antecesora de HEAD y que `d68c62b`, implementación M-02 de evaluación, está integrado en esa base. Esto acredita ascendencia de Git, no aprobación institucional ni despliegue.

**Cero pruebas funcionales ejecutadas en esta auditoría.** No se ejecutaron Pest, Cypress, build, lint o TypeScript; no se consultó MySQL ni se inició Laravel. Se identificaron pruebas y se leyeron sus aserciones. La disponibilidad actual de un entorno de pruebas aislado es **NO VERIFICADA**; no se reutilizan fallos de conexión ni resultados de otros Bolts como comprobaciones actuales.

Solo se crean este diagnóstico y `prompt-01-auditoria.md`, íntegro, dentro de BOLT-MIS-005. No se modifican funcionalidades, roles, permisos, bases, migraciones, otros Bolts o macroprocesos. No se ejecutan seeders, instalación de dependencias, commits, push, merge o Pull Requests. No se reproducen credenciales presentes en documentación histórica.

**Estados:** IMPLEMENTADO significa soporte localizado en código para el alcance descrito; no implica ejecución aprobada. PARCIAL identifica una parte concreta no cubierta de un alcance definido, no incumplimientos inventados. PENDIENTE se reserva para funcionalidad requerida sin soporte encontrado. NO VERIFICADO indica ausencia de reproducción, pruebas ejecutadas o decisión institucional.

## Nomenclatura PM-04 y fuentes

La búsqueda `rg -n 'PM-04|PM.04' docs` previa a crear estos archivos no encontró una definición anterior identificada con esos códigos. Se conservan exactamente los **tres** nombres proporcionados en el prompt:

| Código solicitado | Nombre conservado | Correspondencia documental verificable |
| --- | --- | --- |
| PM-04.1 | Registrar asistencia de estudiantes | Sprint 8: sesiones por curso/fecha y asistencia masiva; RF-13 Gestión de asistencia. |
| PM-04.2 | Justificar inasistencias | Sprint 8: justificaciones, revisión, historial y archivos; RF-15 Justificación de inasistencias. |
| PM-04.3 | Consultar indicadores de asistencia y seguimiento | RF-14 Consulta de asistencia; Sprint 10: dashboards/reportes; RF-21 Portal del padre/apoderado y RF-23 Generación de reportes. |

**Diferencia explícita:** los RF nombran «Consulta de asistencia» y «Generación de reportes», no un procedimiento formal titulado «Consultar indicadores de asistencia y seguimiento». La equivalencia formal de la nomenclatura PM-04 con un mapa institucional externo es **NO VERIFICADA**. No se crea PM-04.4 ni se renombra documentación anterior. «Seguimiento académico» se interpreta aquí como consultas y resúmenes existentes; no autoriza alertas predictivas, tutoría, comunicaciones o un nuevo módulo.

Fuentes consultadas: `docs/requirements-status.md` (catálogo completo RF-01 a RF-24), `docs/traceability.md`, `docs/sprints/sprint-8.md`, `docs/sprints/sprint-10.md`, `docs/architecture.md` y `docs/arquitectura.md` (histórico, remite a arquitectura consolidada). Se contrastaron con API, servicios, modelos, validaciones, políticas, React y pruebas reales del repositorio.

Los RF directos son **RF-13, RF-14 y RF-15**. RF-21/23 soportan consulta familiar/reportes; RF-24 Auditoría del sistema y RF-04 Gestión de roles y permisos son transversales. RF-01/02/03 dan identidad y sesión; RF-05/06/07 dan información/elegibilidad del estudiante. RF-22 es integración con cursos/aula. RF-08/09/10/11/12 son procesos académicos adyacentes; RF-16/17/18/19/20 no se convierten en requisitos de este Bolt por compartir términos como seguimiento, documentos o notificaciones. No se modifica el catálogo que declara los 24 RF implementados dentro del alcance de Sprints 1–10.

## Inventario técnico y relaciones

| Capa | Archivos reales y responsabilidad |
| --- | --- |
| Persistencia | `backend/database/migrations/2026_10_05_100000_create_attendance_tables.php`: sesiones, registros, justificaciones e historial de estados. Solo leída. |
| Modelos | `backend/app/Models/Attendance/AttendanceSession.php`, `AttendanceRecord.php`, `AbsenceJustification.php`, `JustificationStatusHistory.php`, `AttendanceModel.php`. |
| Negocio y seguridad | `backend/app/Services/Attendance/AttendanceService.php`, `JustificationService.php`, `AttendanceAccess.php`, `AttendanceAudit.php`; `backend/app/Policies/AttendancePolicy.php`. |
| HTTP | `backend/app/Http/Controllers/Api/AttendanceController.php`, `backend/app/Http/Requests/AttendanceRequest.php`, `backend/app/Http/Resources/AttendanceResource.php`, `backend/routes/api.php`. |
| Dependencias de acceso | `backend/app/Services/Classroom/ClassroomAccess.php`, `backend/app/Services/Courses/CourseAccess.php`, `backend/app/Models/Concerns/BelongsToInstitution.php`; `backend/database/seeders/AttendancePermissionSeeder.php` (solo inspeccionado). |
| React | `frontend/src/attendance/AttendanceCourse.tsx` (incluye `AttendanceRoster`), `PersonalAttendance.tsx`, `JustificationsPage.tsx` (incluye `StudentFilter`), `JustificationDetail.tsx`, `shared.tsx`. |
| Integración | `frontend/src/App.tsx`, `frontend/src/layouts/AppLayout.tsx`, `frontend/src/learning/CourseLearning.tsx`: rutas personales/familiares, menú y pestaña institucional de asistencia por curso. |
| Indicadores/reportes | `backend/app/Services/Reports/StudentSummary.php`, `TeacherDashboard.php`, `ReportCatalog.php`, `ReportService.php`; `backend/app/Policies/ReportPolicy.php`; `backend/app/Http/Controllers/Api/ReportController.php`; `frontend/src/reports/ReportsPage.tsx`, `frontend/src/pages/DashboardPage.tsx`. |

Relación académica: sesión → curso → docente/asignación, año académico, grado y sección; registro → sesión + estudiante; justificación → registro original + estudiante + apoderado; historial → justificación + actor. `CourseAccess::roster` selecciona matrículas APPROVED del mismo año/grado/sección del curso, bajo scope institucional. No se elige una sección arbitraria dentro del registro masivo. `ClassroomAccess::staff/allowed` exige institución actual y docente activo/asignación activa, o Administración, además del permiso efectivo.

`AttendanceModel` utiliza `BelongsToInstitution`, oculta `file_path` y prohíbe borrado mediante eventos Eloquent. El historial de justificación también prohíbe actualización. Sesiones y estudiantes históricos usan relaciones `withTrashed` donde están previstas. Esto no certifica inmutabilidad frente a SQL administrativo ni integridad de una base poblada.

## Matriz de diagnóstico

### PM-04.1 — Registrar asistencia de estudiantes

| Campo | Hallazgo |
| --- | --- |
| Objetivo | Registrar y mantener asistencia de estudiantes elegibles por curso y fecha, preservando cierre y trazabilidad. |
| Actor principal | Docente asignado con permisos; Administración supervisa con permisos. Secretaría no obtiene escritura por poseer `attendance.view`. |
| Entradas | Curso, fecha `Y-m-d`, tema opcional; sesión OPEN de curso ACTIVE; estudiante del roster; estado y observación. |
| Actividades | Crear/listar/abrir sesión, seleccionar estados, guardar lote de la página, corregir registro existente y cerrar con confirmación. |
| Salidas | Sesión y registros persistidos, IDs estables por upsert, estado CLOSED y auditoría de creación/modificación/cierre. |
| RF | RF-13 directo; RF-05/06 de referencia/elegibilidad; RF-04/24 transversales; RF-22 de integración. |
| Frontend | `frontend/src/attendance/AttendanceCourse.tsx`, `shared.tsx`; pestaña en `frontend/src/learning/CourseLearning.tsx`. |
| Backend | `AttendanceService`, `AttendanceController`, `AttendanceRequest`, `AttendanceResource`, `AttendancePolicy`, `AttendanceAccess`; modelos AttendanceSession/AttendanceRecord y migración del inventario. |
| Endpoints | GET/POST `/api/v1/courses/{course}/attendance-sessions`; GET/PATCH `/api/v1/attendance-sessions/{id}`; POST `/api/v1/attendance-sessions/{id}/close`; GET/POST `/api/v1/attendance-sessions/{session}/records`; PATCH `/api/v1/attendance-records/{id}`. |
| Permisos | `attendance.view/create/update/close` según operación, más alcance de curso. Registrar lote exige update sobre sesión, no solo permiso create de sesiones. |
| Funcionalidad/estado | **IMPLEMENTADO por código**. Ejecución actual **NO VERIFICADA**. La UI permite crear, marcar/guardar y cerrar; el PATCH de fecha/tema existe en backend, pero no se localizó un formulario React de edición de sesión. No se propone otro CRUD sin necesidad demostrada. |
| Evidencia técnica | `AttendanceService::session/records`, `AttendanceRequest::rules`, `AttendanceController::records`: unicidad curso/fecha, sesión/estudiante, roster histórico con `can_record`, transacciones y bloqueo institucional. |
| Pruebas existentes | Sprint8Test: gestión/cierre, docente ajeno, lote atómico/roster, duplicados/upsert, aislamiento; primer caso de `attendance.cy.ts`. No ejecutadas aquí. |
| Brechas demostradas | Cambiar de sesión reemplaza `AttendanceRoster key={selected.id}` sin comprobar borrador; la recarga tras guardar puede reemplazar el draft mientras ya se reanudó edición. Consultas sin reintento directo y datos anteriores conservados durante carga. Ver E-01/E-03. |
| Riesgos/recomendación | Posible pérdida de edición no enviada o confusión de página/sesión; confirmar con pruebas simuladas antes de implementar una protección mínima del borrador. No modificar unicidad ni elegibilidad que ya existen. |

**Reglas comprobadas por lectura:**

- Sesión OPEN → CLOSED; no hay reapertura. Fecha no cambia si la sesión tiene registros. Fecha se valida por formato; no se encontró regla que obligue a hoy, al intervalo del periodo o que prohíba días futuros. No se inventa esa regla.
- El docente registra **PRESENT, ABSENT o LATE**. **JUSTIFIED** solo procede de aprobar una justificación; el cliente no puede imponerlo en registro ordinario.
- Cada lote contiene 1–100 filas, student_id distintos, estados admitidos y observaciones opcionales hasta 2000 caracteres. Tema hasta 250. Institución, autores y relaciones administradas no se aceptan desde el cuerpo.
- Servicio e índices únicos evitan duplicar curso/fecha y sesión/estudiante. El upsert actualiza el mismo registro; una fila inválida revierte todo el lote. No se requiere otra tabla para prevenir duplicados.
- El roster de lectura incluye estudiantes antes registrados aunque pierdan elegibilidad; `can_record=false` evita su escritura ordinaria. CLOSED bloquea escritura ordinaria. Una falta con solicitud de justificación existente no es editable por el docente, incluso tras decisión final.
- `AttendanceAudit` guarda CREATE/UPDATE/CLOSE, actor, institución, entidad y metadatos de estado/referencias. No copia observaciones privadas ni motivos/comentarios a `audit_logs`. No hay un historial de texto completo de cada observación en un endpoint de asistencia; no se presenta la auditoría como tal.

### PM-04.2 — Justificar inasistencias

| Campo | Hallazgo |
| --- | --- |
| Objetivo | Solicitar y revisar el sustento de una falta sin borrar ni sustituir su registro original. |
| Actor principal | Apoderado activo y vinculado solicita; Secretaría/Administración autorizadas revisan y deciden. Estudiante y docente no aprueban ni justifican por esos roles. |
| Entradas | Registro ABSENT sin solicitud previa, motivo obligatorio (máximo 5000), archivo opcional y comentario de revisión (máximo 2000, obligatorio al rechazar). |
| Actividades | Enviar solicitud, consultar detalle/archivo/historial, iniciar revisión y aprobar o rechazar conforme al estado. |
| Salidas | Justificación PENDING → IN_REVIEW → APPROVED o REJECTED; historial inmutable de estados/actor/comentario/fecha; aprobación cambia el registro original a JUSTIFIED, rechazo mantiene ABSENT. |
| RF | RF-15 directo; RF-13/14 de registro/consulta; RF-21 familiar; RF-04/24 transversales. Adjuntos son parte del flujo existente, no un nuevo requisito RF-18. |
| Frontend | `frontend/src/attendance/PersonalAttendance.tsx`, `JustificationsPage.tsx`, `JustificationDetail.tsx`, `shared.tsx`. |
| Backend | `JustificationService`, `AttendanceController`, `AttendanceAccess`, `AttendancePolicy`, `AttendanceRequest`, `AttendanceResource`, `AttendanceAudit`; AbsenceJustification/JustificationStatusHistory; `backend/app/Services/Classroom/MaterialFiles.php`. |
| Endpoints | POST `/api/v1/attendance-records/{record}/justifications`; GET `/api/v1/absence-justifications`, `/{id}`, `/{id}/history`, `/{id}/download`; POST `/{id}/review`, `/{id}/approve`, `/{id}/reject` bajo el mismo prefijo. |
| Permisos | `justifications.create` + vínculo para solicitar; `justifications.view` + alcance para leer; `justifications.review/approve/reject` + rol SECRETARY/ADMINISTRATOR para decidir. Administración con create no sustituye el vínculo de apoderado. |
| Funcionalidad/estado | **IMPLEMENTADO por código**, incluida revisión/aprobación/adjuntos. Ejecución actual **NO VERIFICADA**. No hay razón para proponer crear un flujo nuevo. |
| Evidencia técnica | `JustificationService::create/transition`: falta vigente, solicitud única por registro, transición esperada, bloqueo/transacción conjunta de decisión/historial/registro/auditoría; limpieza del archivo si falla creación. |
| Pruebas existentes | Sprint8Test: adjunto válido/inválido y solicitud duplicada, apoderado ajeno, decisión tras revisión/rollback incluso con sesión cerrada, rechazo, aislamiento. Casos 2/3 de `attendance.cy.ts`. No ejecutadas aquí. |
| Brechas demostradas | Detalle/historial dependen de `Promise.all`, sin reintento propio ni estados independientes. Un fallo inicial mantiene «Cargando justificación…» junto al error; una página posterior conserva historial anterior. Filtrar listado no invalida el detalle seleccionado. Ver E-02/E-04. |
| Riesgos/recomendación | Una decisión podría intentarse desde un detalle de contexto anterior; el servidor conserva control y puede rechazarla. Mejorar consulta y contexto antes de añadir estados. No crear apelación/reenvío sin regla institucional. |

**Privacidad y conservación:** `MaterialFiles` valida extensión y MIME real, tamaño >0 y ≤2 MiB, estructura OOXML y ausencia de macros donde corresponde; almacena nombres/rutas generados en disco privado. La descarga autoriza de nuevo el recurso y responde como attachment, `nosniff`, `private, no-store`. No se expone la ruta física. Esto no equivale a certificación antivirus.

El historial ordena por ID y conserva estado anterior/nuevo, actor, comentario y fecha; el motivo original reside en la solicitud. El modelo de justificación no ofrece edición del motivo ni apelación. No hay funcionalidad «no implementada» que deba suplirse para permitir el flujo básico: ya existe; después de rechazo no hay reenvío por decisión explícita de Sprint 8. Aprobar sobre sesión cerrada es una excepción administrativa existente, no una regresión nueva.

### PM-04.3 — Consultar indicadores de asistencia y seguimiento

| Campo | Hallazgo |
| --- | --- |
| Objetivo | Consultar asistencia propia/vinculada e información institucional autorizada, con filtros, reportes y resúmenes existentes. |
| Actor principal | Estudiante titular y apoderado vinculado para consulta personal/familiar; docente asignado, Secretaría y Administración para vistas institucionales según permisos. |
| Entradas | Identidad/vínculo, curso/estudiante; filtros autorizados de año, nivel/grado/sección, docente/asignatura, estado y rango de fechas; page/per_page. |
| Actividades | Consultar registros propios/familiares, paginar, elegir estudiante vinculado, consultar indicadores de dashboard y reportes/exportaciones autorizadas. |
| Salidas | Listas paginadas, resumen de asistencia/faltas/justificaciones, sesiones recientes docentes y CSV de reportes. |
| RF | RF-14 directo; RF-13/15 como origen de datos; RF-21/23 de consulta familiar/reportes; RF-04/24 de soporte. |
| Frontend | `PersonalAttendance.tsx`; `frontend/src/reports/ReportsPage.tsx`, `frontend/src/pages/DashboardPage.tsx`; menú/rutas del inventario. |
| Backend | `AttendanceController::personal`, `AttendanceAccess`; `StudentSummary`, `TeacherDashboard`, `ReportCatalog`, `ReportService`, `ReportPolicy`, `ReportController` enumerados en el inventario. |
| Endpoints | GET `/api/v1/my/attendance`; GET `/api/v1/guardians/{guardian}/students/{student}/attendance`; GET `/api/v1/profile/family`; GET `/api/v1/dashboard`; GET `/api/v1/reports`; GET `/api/v1/reports/student-attendance`, `/course-attendance`, `/attendance-incidents` y sus `/export`. |
| Permisos | `attendance.view` y perfil/titularidad/vínculo; dashboards aplican permisos y perfil/vínculo existentes. ReportPolicy permite reportes de asistencia a ADMINISTRATOR, TEACHER o SECRETARY con permiso/alcance, no al estudiante/apoderado por tener attendance.view. |
| Funcionalidad/estado | **IMPLEMENTADO para el alcance RF-14/21/23 inspeccionado**, con limitaciones de consulta y usabilidad detalladas. Nombre formal PM-04.3 y posible expectativa de periodo nominal: **NO VERIFICADOS** institucionalmente. No se declara requerido un panel nuevo. |
| Evidencia técnica | `AttendanceController::personal` conserva consulta histórica por estudiante aunque cambie matrícula; `ReportCatalog::filters`/`ReportService::filters` definen filtros reales, `ReportPolicy` delimita roles y `StudentSummary::sections` calcula indicadores. |
| Pruebas existentes | Sprint8Test de histórico propio/privacidad y aislamiento; cinco casos de Sprint10Test sobre reportes/filtros/CSV, roles/vínculos e indicadores; `reports.cy.ts` (dos casos generales) y consulta final en `attendance.cy.ts`. No ejecutadas aquí; no todas las ramas de filtro tienen caso específico. |
| Brechas demostradas | Consultas personales y familiares sin reintento de GET fallido; datos previos visibles durante paginación; detalle/formulario pueden persistir al cambiar página de asistencias. Accesibilidad parcial de selector administrativo de estudiante. Ver E-01/E-04/E-05. |
| Riesgos/recomendación | Mostrar contexto anterior como vigente, dificultar recuperación o selección asistida. Reutilizar las consultas actuales, sin conceder reportes institucionales a familias ni crear estadísticas no exigidas. |

**Indicadores reales:** `StudentSummary::sections` calcula `(PRESENT + LATE) / total de registros × 100`, faltas ABSENT y número de solicitudes de justificación. JUSTIFIED queda dentro del denominador pero no del numerador; «Justificaciones» cuenta solicitudes, no solo aprobadas. El texto del indicador explica presentes o tardanzas sobre registros. Cambiar esa fórmula exige definición institucional, no corregirla por preferencia. El resumen puede limitarse por año; no se infiere que incluya estudiantes sin registros como si tuvieran 0 %.

`TeacherDashboard` muestra hasta cinco sesiones recientes de cursos activos propios y otros resúmenes académicos existentes; no es un tablero predictivo de inasistencias. Los reportes son filas reales, no estadísticas nuevas: `attendance-incidents` restringe a ABSENT/LATE/JUSTIFIED; los otros dos reportes comparten consulta de asistencia y permiten seleccionar estudiante/curso mediante filtros. CSV comparte consulta autorizada, preserva contexto institucional al transmitir y neutraliza fórmulas.

**Filtros y periodo:** sesiones por curso están ordenadas por fecha descendente y paginadas; roster por ID. Consulta personal/familiar ordena registros por ID descendente y no aplica date/status/student_id aunque el FormRequest común pueda validar algunos de esos campos. Justificaciones sí aplica status, student_id y fecha de asistencia; page/per_page (20 predeterminado, máximo 100). No confundir campos validados con filtros efectivamente consumidos.

Los reportes de asistencia admiten año/nivel/grado/sección/curso/docente/asignatura/estudiante, status, date_from/date_to y paginación. **No incluyen `academic_period_id` en su catálogo**, a diferencia de reportes de notas/evaluaciones. La sesión de asistencia no se relaciona directamente con un periodo. Puede acotarse por fechas; eso no equivale a un filtro nominal automático de periodo. Confirmar necesidad y semántica institucional antes de proponerlo; no crear una relación o tabla para cubrir una diferencia terminológica.

## Roles, seguridad e integración

| Rol estándar | Capacidad existente y límite |
| --- | --- |
| TEACHER | attendance.view/create/update/close; registro de cursos asignados, no decisión de justificaciones. Reportes limitados a sus cursos por ReportService. |
| ADMINISTRATOR | Nueve permisos de asistencia/justificaciones del seeder, sujetos a institución y validaciones. No sustituye vínculo familiar para crear solicitud. |
| SECRETARY | attendance.view y justifications.view/review/approve/reject; revisión institucional y reportes autorizados, sin alta/modificación ordinaria de asistencia por ese rol. |
| STUDENT | attendance.view; registros propios de perfil activo, incluida asistencia histórica. No justifica ni consulta roster docente. |
| GUARDIAN | attendance.view, justifications.view/create; estudiante vinculado y perfil de apoderado activo. No obtiene reportes institucionales ni aprobación. |
| TREASURY / otros | No reciben permisos de asistencia/justificaciones en AttendancePermissionSeeder. Tener permiso aislado no elimina los demás predicados de rol y alcance. |

Los permisos listados proceden del seeder, no de consultar usuarios reales. Policies/servicios siguen siendo la fuente definitiva; roles personalizados o mixtos requieren pruebas concretas, no suponer que cualquier permiso equivale a acceso global. `AttendanceRequest::authorize=true` no omite seguridad: el controlador/servicio aplica Gate y alcance del recurso.

Sanctum y middleware institucional protegen rutas en `backend/routes/api.php`; la institución procede de la sesión y el scope, no de parámetros del cliente. La consulta familiar comprueba que guardian de ruta sea el de la cuenta y que el estudiante esté vinculado. Lecturas ajenas se ocultan con 404 y escrituras sin permiso se rechazan mediante Gate; reglas inválidas devuelven 422. El endpoint personal no exige que la matrícula siga activa para devolver historial, a diferencia de la elegibilidad de escritura. Es una regla expresa de Sprint 8.

La pestaña institucional por curso exige rol TEACHER/ADMINISTRATOR y attendance.view en `CourseLearning::courseTabs`. Las rutas `/app/my-attendance`, `/app/family-attendance` y `/app/justifications` están protegidas por permiso y la pantalla aplica el rol correspondiente. No se necesita duplicar asistencia dentro de las cuatro secciones del Aula Virtual independiente ni modificar Bolts anteriores para esta auditoría.

## Brechas y riesgos respaldados por código

| ID | Hallazgo demostrable por flujo de código | Alcance y recomendación mínima |
| --- | --- | --- |
| E-01 | `AttendanceCourse.tsx` y `PersonalAttendance.tsx` conservan `result` al paginar; `active` ignora respuestas obsoletas, pero datos previos siguen renderizados durante carga. El fallo de GET no ofrece reintento propio; después de crear/guardar se recarga sin restablecer siempre loading. | PM-04.1/03. Reproducir con GET retrasado/500 y adoptar estados ligados a consulta + reintento manteniendo curso/sesión/estudiante/página. No afirmar que faltaba protección HTTP: `active` ya existe. |
| E-02 | `JustificationDetail.tsx` usa Promise.all para detalle e historial; si falla inicialmente, item sigue null y `!item` muestra carga incluso con error. No hay retry; al paginar no invalida historial anterior ni indica nueva carga. | PM-04.2/03. Separar estados de consulta o distinguir error/carga/resultado vigente; vacío explícito y retry accesible, conservando Gate y contrato existentes. |
| E-03 | `AttendanceCourse.tsx`: Abrir asistencia hace setSelected sin comprobar cambios y remonta roster por key. `AttendanceRoster` sustituye draft completo tras cada GET; tras save, busy se libera antes de finalizar la recarga y se puede editar antes de que esa respuesta vuelva a reemplazar draft. | PM-04.1. Riesgos de pérdida de datos no enviados deducidos del flujo, **no reproducidos en navegador**. Probar cambio de sesión y edición durante recarga; confirmar salida solo si hay cambios y proteger draft durante recuperación. La confirmación al cambiar de página y al cerrar ya existen. |
| E-04 | `JustificationsPage.tsx` cambia filtros/page sin limpiar selected; el detalle anterior puede seguir visible bajo un listado distinto. `PersonalAttendance.tsx` limpia target/detail al elegir otro estudiante, pero no al paginar sus asistencias. | PM-04.2/03. Invalidar o identificar claramente detalle/contexto al cambiar consulta. No se demuestra acceso ajeno: el servidor sigue autorizando el recurso. |
| E-05 | En `JustificationsPage.tsx::StudentFilter`, el input tiene aria-label, pero el select student_id no tiene label asociado ni aria-label propio; legend nombra el grupo, no individualiza ambos controles. Hay tablas con scroll y controles nativos, sin comprobación dinámica de teclado en esta auditoría. | PM-04.2/03. Asociar una etiqueta específica al select y probar teclado/foco/móvil del flujo seleccionado; no atribuir aquí el fallo de Enter de otro Bolt ni certificar WCAG por inspección. |
| E-06 | Periodo nominal ausente en el contrato de reportes de asistencia; fórmulas y alcance del resumen están definidos por código. | Límite/decisión institucional **NO VERIFICADA**, no defecto confirmado ni RF nuevo. Aclarar lenguaje antes de proponer estadísticas, alertas o cambios de fórmula. |

No se identificó una vulnerabilidad de autorización confirmada mediante ejecución. La existencia de controles/índices/pruebas tampoco certifica ausencia universal de fallos. No se encontró duplicación que justifique reconstruir un módulo; los componentes comparten Pager, Message, API y servicios existentes. La similitud de estados de carga con otras pantallas no autoriza refactorizar otros Bolts en esta etapa.

## Pruebas existentes: lectura frente a ejecución

| Archivo | Casos identificados y cobertura leída | Resultado de esta auditoría |
| --- | --- | --- |
| `backend/tests/Feature/Sprint8Test.php` | **10**: sesiones únicas/cierre; docente ajeno; roster/atomicidad; duplicados/upsert; vínculo/archivo privado/solicitud única; apoderado ajeno; aprobación tras revisión con rollback incluso sobre sesión cerrada; rechazo con comentario; histórico estudiantil sin escritura; aislamiento institucional. | **NO EJECUTADAS**. No se declaran aprobadas por existir. |
| `backend/tests/Feature/Sprint10Test.php` | **5**: familias de reportes/filtros/paginación; institución/rol/propiedad y selectores; CSV y datos privados; seis dashboards y privacidad familiar/estudiantil; conteos de entregas/pagos. Cobertura general, no cinco casos exclusivos de asistencia. | **NO EJECUTADAS**. |
| `e2e/cypress/e2e/attendance.cy.ts` | **3** con backend real: docente registra/cierra; apoderado envía adjunto privado y consulta historial; Secretaría aprueba y estudiante/apoderado ven JUSTIFIED. | **NO EJECUTADAS**; crean datos, no se lanzan sin aislamiento. |
| `e2e/cypress/e2e/reports.cy.ts` | **2** generales: dashboard administrativo/reporte CSV responsive; indicadores por rol y exclusión de familias de reportes institucionales. | **NO EJECUTADAS**. No sustituyen un caso específico por cada indicador/filtro de asistencia. |

Inventario contado: **20 casos definidos identificados, 0 ejecutados, 0 aprobaciones actuales, 0 fallos de ejecución actuales**. No se cuentan dependencias de Sprints 1–7 ni otras suites como pendientes con cifras inventadas. Los resultados declarados en documentos de Sprints 8/10 son históricos; no se trasladan a esta auditoría. No hubo pruebas actuales con API simulada ni backend real.

Cobertura aún no encontrada de forma focalizada en los archivos revisados: GET 500/reintento y carga por página; vacío de detalle/historial; preservar borrador al cambiar sesión o durante recarga; filtros que invalidan contexto; dos estudiantes vinculados con respuestas HTTP tardías; select de estudiante con nombre accesible; teclado de controles del módulo. Las pruebas existentes comprueban duplicados/autorización: conservarlas, no reemplazarlas por nuevas implementaciones de esas funciones.

Antes de futuras ejecuciones Pest se deberá acreditar aislamiento conforme a `backend/AGENTS.md`: MySQL `zarate_test`, usuario `zarate_test`, entorno testing y configuración no cacheada. Para Cypress real, acreditar asimismo servicios y datos aislados; no usar base de desarrollo/institucional ni crear demo para completar métricas. Para las brechas de UI propuestas, preferir inicialmente interceptaciones sintéticas sin escritura real.

## Propuesta inicial priorizada — sin implementar

| Prioridad | Mejora y justificación | Archivos candidatos y criterios de validación |
| --- | --- | --- |
| P1 | **Proteger edición de asistencia** (PM-04.1, RF-13). E-03 afecta datos no enviados; no supone fallo de unicidad persistida. | `frontend/src/attendance/AttendanceCourse.tsx`. Reproducir y proteger borrador al cambiar sesión y durante recarga; conservar confirmaciones ya existentes y guardado por página. Cypress simulado de cancelar/confirmar cambio y respuesta retrasada; regresión de lote/cierre y Pest de upsert/atomicidad cuando haya aislamiento. |
| P1 | **Recuperación y coherencia de consultas** (PM-04.1/02/03, RF-13/14/15). E-01/E-02/E-04 dificultan distinguir consulta vigente y recuperarse de fallos. | Componentes de asistencia del inventario, comenzando por `JustificationDetail.tsx`. GET 500 → retry de mismo ID/página → éxito sin error/carga obsoletos; vacío explícito; sin reemplazo por respuesta antigua ni detalle engañoso al filtrar/cambiar estudiante. Conservar validación definitiva/acciones por abilities y estados reales. No crear endpoints ni replicar audit-logs. |
| P2 | **Accesibilidad y cobertura focalizada de consulta/indicadores existentes** (PM-04.2/03, RF-14/15/21/23). E-05 y ausencia de casos negativos de consulta. | Etiqueta específica de select en `JustificationsPage.tsx`; tests de teclado, foco y móvil; caracterizar indicadores PRESENT/LATE/ABSENT/JUSTIFIED con denominador y conteo de solicitudes explícitos. No cambiar fórmulas, añadir alertas o dar acceso a reportes a familias. Reutilizar reportes actuales. |

Estas son recomendaciones iniciales, no un plan de implementación aprobado ni cambios ejecutados. Se recomienda validar **primero la reproducción de E-03**, por el posible descarte de edición, y luego corregir la recuperación de consultas. Duplicados, aprobación de justificaciones, documentos privados, reportes, paginación y aislamiento ya tienen implementación y deben reutilizarse.

Quedan por confirmar institucionalmente el nombre formal PM-04.3, la necesidad de consulta por periodo nominal y cualquier expectativa distinta de la fórmula actual o de reenvío tras rechazo. No se plantea un cuarto procedimiento ni funcionalidades adicionales como solución automática.

## Control documental final

El prompt se copia desde el adjunto original, sin reconstrucción ni resumen, y se contrasta por SHA-256. Se verifica formato y alcance de los dos archivos nuevos. No se modifica ninguna evidencia previa. `git diff --check` es un control documental, no prueba del funcionamiento académico. La auditoría queda completada como **diagnóstico por inspección**, con ejecución funcional y decisiones pendientes expresamente NO VERIFICADAS; no se declara cerrado el Bolt de implementación.
