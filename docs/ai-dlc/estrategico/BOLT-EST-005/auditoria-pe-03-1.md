# PE-03.1 — Indicadores de gestión y Sprint 10

**Estado:** auditoría de solo lectura. El catálogo real de reportes no equivale por sí mismo a evaluación de objetivos estratégicos.

## Conclusión

- **PE-03.1 en EcoAula:** **PARCIALMENTE IMPLEMENTADO** para consulta de información operativa y algunos valores derivados; **NO IMPLEMENTADO** como proceso integral de evaluación de indicadores/objetivos estratégicos.
- Sprint 10 implementa 20 reportes con filtros, paginación y exportación CSV, y dashboards para seis roles: administrador, secretaría, tesorería, docente, estudiante y apoderado.
- Las fuentes, cálculos, permisos, filtros, formato/precisión y casos de prueba de los reportes y dashboards se describen abajo. No se hallaron objetivos aprobados, valores meta, líneas base, umbrales, responsables/validadores, periodicidad formal ni decisión por cumplimiento.
- La fuente del proceso PE-03.1 no permite determinar si el colegio exige una reunión, acta o decisión humana externa. El SaaS no registra ese flujo de evaluación; hace falta que el responsable institucional lo defina. Los reportes actuales no deben usarse como sustituto de esa aprobación.
- RF-23 se relaciona con generación de reportes, no es evidencia de un motor de evaluación estratégica ni de metas.
- No se proponen KPIs ficticios, reportes PDF, nuevas tablas ni cambios de software.

## Catálogo real de reportes

**Convenciones:** todos los recursos se limitan a la institución del usuario autenticado. `N/A` en denominador significa que la salida es una lista de registros, no una razón o porcentaje; `N/A` en periodo indica que no hay dimensión de corte agregada. Las fechas `date_from`/`date_to` son inclusivas. El CSV conserva los campos del reporte y no añade metas.

| Reporte (`ReportCatalog`) | Salida/fuente y cálculo real | Denominador | Periodo y filtros realmente disponibles | Precisión/formato | Prueba existente |
|---|---|---|---|---|---|
| `active-students` | Filas de `Student` con estado `ACTIVE`. | N/A; filas de estudiantes. | Sin periodo académico; `student_id`, `date_from`, `date_to` sobre creación. | ID entero, nombre/estado; fechas ISO `YYYY-MM-DD`; sin agregación. | Pest `serves all report families with real rows filters and pagination`; Cypress aplica filtro por estudiante y descarga CSV. |
| `enrolled-students` | Filas de matrículas `APPROVED` con estudiante, año, nivel, grado y sección. | N/A; cada fila es una matrícula aprobada. | Año, nivel, grado, sección, estudiante, estado y fechas de creación. | IDs/conteos enteros; estado y nombres; fechas ISO. | Caso Pest parametrizado para los 20 reportes y paginación. |
| `students-by-section` | Filas de matrículas `APPROVED` mostrando agrupación relacional de año/nivel/grado/sección. No es una tabla agregada por conteo. | N/A; filas de matrícula. | Año, nivel, grado, sección, estudiante, estado y fechas de creación. | Campos identificadores/categóricos; no calcula porcentaje. | Caso Pest parametrizado para los 20 reportes. |
| `enrollment-status` | Filas de matrícula con estado vigente; no calcula porcentaje por estado. | N/A; el valor agrupado no tiene total denominador calculado. | Año, nivel, grado, sección, estudiante, estado y fechas de creación. | Estado categórico; campos de registro. | Caso Pest parametrizado; dashboard administrativo prueba consulta por estados. |
| `section-capacity` | `occupied=COUNT(matrículas APPROVED)`; disponibles = `max(0, capacity - occupied)`. Capacidad nula se presenta “Sin límite”. | Capacidad configurada solo sirve como cupo absoluto cuando no es nula; no hay tasa/cociente calculado. | Año, nivel, grado, sección y estado; sin filtro de fechas. | Enteros para capacidad/ocupados/disponibles; “Sin límite” en capacidad nula. | Pest afirma ocupados=1 y disponibles=29 en sección de prueba. |
| `active-teachers` | Filas de `Teacher` con estado `ACTIVE`. | N/A; filas de docentes. | Sin periodo académico; `teacher_id`, fechas de creación. | ID entero, nombre/estado; sin agregación. | Caso Pest parametrizado para los 20 reportes. |
| `teacher-courses` | Filas de cursos con docente y estructura académica asociada. | N/A; filas de cursos. | Año/nivel/grado/sección/curso/asignatura/docente/estado y fechas de creación. | Identificadores y etiquetas; sin tasa. | Caso Pest parametrizado; prueba de alcance de docente/curso propio. |
| `teacher-workload` | Asignaciones con `courses_count`, conteo de cursos asociados por asignación. | N/A; no hay horas contratadas ni carga objetivo como denominador. | Filtros académicos, curso/asignatura/docente/estado y fechas de creación. | `courses_count` entero; no son horas. | Caso Pest parametrizado para los 20 reportes. |
| `student-scores` | Filas de notas con estudiante, curso, periodo, evaluación, nota y máximo. | N/A; nota individual sobre escala de evaluación, sin promedio institucional. | Año/nivel/grado/sección/curso/asignatura/docente, periodo, estudiante y fechas por `graded_at`. | Nota y máximo `DECIMAL(4,2)`; fecha `YYYY-MM-DD`. | Caso Pest parametrizado y consultas de notas con valores `17.00`; pruebas de dashboard familiar. |
| `course-scores` | Filas de calificaciones ligadas al curso/evaluación; cada nota y su escala. | N/A; no calcula promedio de curso. | Filtros académicos, curso/asignatura/docente, periodo, estudiante y fechas por `graded_at`. | Nota/máximo con dos decimales (`DECIMAL(4,2)`); fecha ISO. | Pest consulta curso+periodo+estudiante y valida nota `17.00`; también fechas y filtros. |
| `period-scores` | Filas de calificación ligadas al periodo académico de la evaluación. | N/A; no compara resultados con una meta del periodo. | Filtros académicos, periodo, estudiante y fechas por `graded_at`. | Nota/máximo `DECIMAL(4,2)`; periodo como etiqueta. | Caso Pest parametrizado para los 20 reportes; filtro de periodo se ejercita en `course-scores`. |
| `course-assessments` | Evaluaciones con `scores_count` derivado por evaluación. | N/A; cuenta registros de notas; no cuenta estudiantes esperados ni porcentaje de cobertura. | Filtros académicos, curso/asignatura/docente, periodo, estado y fechas por `evaluation_date`. | `scores_count` entero; `max_score` es `DECIMAL(4,2)`; fecha ISO. | Caso Pest parametrizado para los 20 reportes. |
| `assignment-submissions` | Entregas por tarea: esperados = roster de matrículas aprobadas con estudiante activo que coinciden con institución/año/grado/sección del curso; entregaron = esperados − pendientes. Pendiente se calcula una vez por estudiante sin entrega. | Denominador operativo: `expected_count`; no se presenta como meta. Con filtro de estudiante sin roster, el resultado se excluye. | Filtros académicos, curso/asignatura/docente, estudiante, estado y fechas por vencimiento (`due_at`). | Esperados/entregaron/pendientes enteros; plazo categórico. | Pest prueba conteo pendiente por estudiante con intentos repetidos y valores entregaron=1/sin entrega=0. |
| `missing-submissions` | Tareas publicadas/cerradas con `pending_count>0`; faltantes = roster aprobado/activo sin entrega. | Denominador disponible internamente `expected_count`; reporte lista faltantes, no calcula tasa sobre entregas esperadas. | Mismos filtros de tareas; fecha por `due_at`; excluye tareas sin faltantes. | Conteos enteros y estado; sin porcentaje. | Pest prueba que después de completar la entrega el total de faltantes es 0. |
| `student-attendance` | Filas de registros de asistencia con estudiante, curso, fecha/sesión, estado y justificación. | N/A; no es una tasa agregada por estudiante en el reporte. | Filtros académicos, curso/asignatura/docente, estudiante, estado; fecha de sesión. | Una fila por registro; fecha ISO; estado/justificación categóricos. | Caso Pest parametrizado para los 20 reportes y filtro/alcance institucional. |
| `course-attendance` | Filas de asistencia por curso y estado. | N/A; no agrega porcentaje de asistencia del curso. | Filtros académicos, curso/asignatura/docente, estado; fecha de sesión. | Una fila por registro; fecha ISO; sin agregación. | Caso Pest parametrizado para los 20 reportes. |
| `attendance-incidents` | Filas de asistencia cuyo estado está en `ABSENT`, `LATE`, `JUSTIFIED`; incluye estado de justificación. | N/A; no hay total esperado ni tasa estratégica. | Filtros académicos, curso/asignatura/docente, estudiante, estado; fecha de sesión. | Una fila por incidencia; fecha ISO y estados categóricos. | Caso Pest parametrizado para los 20 reportes. |
| `request-status` | Filas de solicitudes académicas con código, estudiante, tipo, estado y creación. | N/A; no calcula SLA ni demora por solicitud. | Estudiante, estado, fechas de creación. | ID/código/estado; fecha ISO. | Caso Pest parametrizado y test CSV excluye descripción privada. |
| `enrollment-payments` | Filas de pagos asociados a conceptos cuyo código corresponde a matrícula; monto, vencimiento, estado y validación. | N/A; no calcula tasa de pago; los reportes no suman saldo por estudiante. | Año, estudiante, estado y fechas por vencimiento (`due_date`). | Importe almacenado `DECIMAL(12,2)` PEN; fecha ISO; validación Sí/No. | Caso Pest parametrizado, permisos de Tesorería y exportación CSV. |
| `published-communications` | Filas `PUBLISHED` con título y fecha de publicación. | N/A; no calcula alcance, lecturas o efectividad. | Fechas por `published_at`; sin filtros de año/lector. | Una fila por comunicación; fecha ISO. | Caso Pest parametrizado; test CSV verifica neutralización de fórmula y omite cuerpo privado. |

### Filtros y semántica temporal

Los filtros provienen de `ReportCatalog::filters`, y el backend rechaza campos no habilitados para el reporte. Todos admiten paginación `page`/`per_page` (1–100; predeterminado 20 en resultados) y fechas se validan en `YYYY-MM-DD`, con `date_to >= date_from`.

| Tipo de reporte | Filtros |
|---|---|
| Estudiantes activos | estudiante, fechas |
| Docentes activos | docente, fechas |
| Matrícula (`enrolled-students`, `students-by-section`, `enrollment-status`) | año, nivel, grado, sección, estudiante, estado, fechas |
| Capacidad de sección | año, nivel, grado, sección, estado |
| Cursos/docencia/asignaciones | año, nivel, grado, sección, curso, asignatura, docente, estado, fechas |
| Notas | año, nivel, grado, sección, curso, asignatura, docente, periodo académico, estudiante, fechas |
| Evaluaciones | año, nivel, grado, sección, curso, asignatura, docente, periodo académico, estado, fechas |
| Tareas/entregas | año, nivel, grado, sección, curso, asignatura, docente, estudiante, estado, fechas |
| Asistencia/incidencias | año, nivel, grado, sección, curso, asignatura, docente, estudiante, estado, fechas |
| Pagos | año, estudiante, estado, fechas |
| Solicitudes | estudiante, estado, fechas |
| Comunicaciones publicadas | fechas |

`date_from`/`date_to` operan sobre `created_at` por defecto; excepciones: asistencia/incidentes usan fecha de sesión, notas `graded_at`, evaluaciones `evaluation_date`, tareas `due_at`, pagos `due_date` y comunicaciones `published_at`. Los reportes de calificaciones permiten filtro de periodo; el dashboard no.

## Indicadores reales de dashboards

Las tarjetas/tablas también están sujetas a permiso mediante `DashboardData`. Los valores de conteo son enteros, salvo indicación distinta.

| Rol/dashboard | Indicadores/valores reales | Denominador, periodo y precisión |
|---|---|---|
| Administrador | Estudiantes/docentes activos; matrículas pendientes/aprobadas por estado; solicitudes/justificaciones pendientes; cursos/pagos pendientes; estudiantes distintos aprobados por nivel; actividad reciente. | Conteos sin meta/denominador; personas y solicitudes son estado actual; cursos/matrículas/pagos dependen del año seleccionado o actual. Conteos enteros; fecha de auditoría datetime. |
| Secretaría | Estudiantes activos; matrículas pendientes/observadas; solicitudes pendientes/en revisión; justificaciones y documentos pendientes; solicitudes recientes. | Conteos de estado; no se asocian todos a año académico. Enteros y estados. |
| Tesorería | Pagos pendientes, validados, vencidos; monto pendiente; matrículas pendientes de validación económica. | Conteos; suma de monto en PEN a dos decimales. Vencido compara `due_date < today()`. Pendiente de validación cuenta matrículas pendientes/observadas con concepto activo y sin pago completo validado; no usa denominador de tasa. Año seleccionado/actual. |
| Docente | Cursos activos, estudiantes distintos de roster aprobado, tareas publicadas, entregas sin revisar y evaluaciones publicadas dentro de próximos 7 días; sesiones recientes. | Conteos enteros limitados a cursos propios. La ventana próxima es `[today(), today()+7 días]`, no periodicidad de evaluación institucional. |
| Estudiante | Matrícula/año/sección, cursos activos, tareas pendientes/próximas, asistencia, faltas/justificaciones, solicitudes y hasta cinco notas publicadas recientes. | Asistencia: numerador `PRESENT` o `LATE`; denominador total de registros de asistencia del alcance seleccionado; porcentaje redondeado a 1 decimal. Con denominador 0 muestra “Sin registros”, no 0%. Tareas próximas: 7 días. |
| Apoderado | Resumen de estudiante(s) activos vinculados: matrícula/año/sección/cursos, tareas, asistencia y notas publicadas según vínculo y permisos. | Mismas fórmulas del resumen familiar; sin estudiantes vinculados devuelve secciones vacías. Asistencia a 1 decimal; fechas/categorías y conteos restantes. |

Dashboard API: `GET /api/v1/dashboard`; selector opcional `academic_year_id`. Sin selección usa año actual; si no existe, el servicio consulta sin filtro de año. La respuesta incluye nota de alcance: matrículas, cursos, pagos y aprendizaje usan año seleccionado/actual; personas y trámites representan el estado institucional actual.

## Roles, protección de datos y exportación

- Middleware de API: `auth:sanctum`, `institution`, `password.changed`; el contexto institucional deriva de la sesión, no de un ID enviado por cliente.
- `ReportRequest` prohíbe `institution_id`, valida IDs de entidades contra modelos scoped y permite solo filtros definidos para cada reporte.
- ADMINISTRATOR se sujeta al permiso requerido para el reporte. SECRETARY accede a reportes operativos permitidos; TREASURY a pagos; TEACHER a reportes autorizados con consultas limitadas a sus cursos; STUDENT y GUARDIAN no acceden al catálogo institucional. `ReportPolicy` combina rol con permiso. Dashboard protege cada tarjeta/tabla por permiso, y resumen familiar limita estudiantes por vínculo.
- Exportación disponible: **CSV**, por `GET /api/v1/reports/{report}/export`, con filtros validados, streaming y contexto de institución reestablecido. Respuesta `text/csv; charset=UTF-8`, privada/no-cache, cabecera BOM UTF-8 y descarga `Sin resultados` si no hay filas.
- `csvCell` antepone apóstrofo a texto que podría ejecutar fórmula (`=`, `+`, `-`, `@` tras caracteres de control). CSV incluye solo los campos que devuelve `ReportService::row`; el test comprueba exclusión de cuerpo/descripción privada y `institution_id`.
- No se encontró exportación de reportes PDF en el alcance auditado. No se afirma que CSV represente acta formal de evaluación.

## Evidencia de pruebas revisada (no ejecutada ahora)

- [Sprint10Test.php](../../../../backend/tests/Feature/Sprint10Test.php): caso parametrizado con datos reales para los 20 reportes, filtros/paginación, selección de periodo/fechas, 403 por rol, aislamiento institucional y de docente, exportación filtrada CSV, datos privados y neutralización de fórmula.
- El mismo archivo prueba los seis dashboards, límites de privacidad familiar, entregas esperadas/faltantes sin doble conteo por intentos, capacidad de sección, estado financiero y ausencia de notas privadas de otra institución.
- [reports.cy.ts](../../../../e2e/cypress/e2e/reports.cy.ts): Cypress prueba el dashboard admin, catálogo de 20 reportes, filtro de estudiante, exportación CSV/responsividad y sesiones para secretaría, tesorería, docente, estudiante y apoderado; verifica restricción familiar a reportes institucionales.
- [sprint-10.md](../../../../docs/sprints/sprint-10.md) registra resultados históricos: 311 Pest y 42 Cypress aprobados en el cierre. Esta auditoría no volvió a ejecutar esas pruebas.

## ¿Requiere revisión humana externa?

El código no resuelve si la institución exige reunión, acta o decisión humana específica para PE-03.1; no se encontró ese requisito aprobado. Sin embargo, para evaluar cumplimiento estratégico se necesita una persona responsable que interprete resultados frente a objetivos/umbrales aprobados y registre una decisión. El SaaS actual solo entrega datos operativos: no registra esa revisión, reunión, aprobación ni acción correctiva. El responsable del proceso debe aclarar el mecanismo (incluida reunión externa si aplica) antes de definir cambios o afirmar que el procedimiento está automatizado.

## Recomendación

PE-03.1 está parcialmente cubierto solo en disponibilidad de datos/reportes operativos; la evaluación estratégica como proceso no está implementada. Solicitar al dueño de proceso una matriz autorizada con definición, unidad, numerador/denominador, población elegible, periodo/corte, fuente, precisión/redondeo, responsable, umbral y decisión. Después se podrá trazar cada KPI institucional contra los 20 reportes disponibles y clasificarlo como cubierto, parcial o ausente. No inventar indicadores ni cambiar software hasta esa aprobación.
