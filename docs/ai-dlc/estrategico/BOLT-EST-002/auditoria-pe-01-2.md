# PE-01.2 — Auditoría de seguimiento de objetivos

**Estado:** auditoría técnica documental; no es validación institucional ni aprobación de indicadores.

## Resultado

EcoAula tiene seis dashboards por rol y veinte reportes alimentados por registros reales. Estas capacidades sirven para consultar operación y ciertos cálculos derivados, pero no se encontró un sistema formal de seguimiento de objetivos institucionales: no hay objetivos/metas registrados, valores esperados, umbrales, periodos formales de revisión, responsables ni acciones asociadas a incumplimientos.

El estado de PE-01.2 es **PARCIAL** únicamente en consulta de indicadores operativos y **NO IMPLEMENTADO** para supervisar cumplimiento de objetivos estratégicos. RF-23 se refiere a reportes; no prueba que exista un proceso de medición de objetivos.

## Matriz de indicadores disponibles

| ID del reporte | Indicador presentado | Fuente | Cálculo/campo verificable | Filtro de periodo | Roles autorizados (sujetos a permiso) | Limitación |
|---|---|---|---|---|---|---|
| `active-students` | Estudiantes activos | Estudiantes | Filtra `status=ACTIVE`; filas de estudiantes. | Sin año académico; fecha opcional por `created_at`. | Administrador, Secretaría. | No compara con una meta de matrícula. |
| `enrolled-students` | Matrículas aprobadas | Matrículas | `status=APPROVED`; filas de matrículas y sus relaciones académicas. | Año, nivel, grado, sección; fechas por creación. | Administrador, Secretaría. | No agrega logro frente a objetivo. |
| `students-by-section` | Estudiantes por grado y sección | Matrículas | Matrículas aprobadas, mostrando estudiante/sección. | Año, nivel, grado, sección; fechas por creación. | Administrador, Secretaría. | Desglose operativo; no meta de cobertura. |
| `enrollment-status` | Estado de matrícula | Matrículas | Filas con estado actual; no es porcentaje calculado. | Año, nivel, grado, sección, estudiante, estado; fechas por creación. | Administrador, Secretaría. | Sin denominador/meta aprobada. |
| `section-capacity` | Ocupación y cupos | Secciones y matrículas aprobadas | `ocupados=COUNT(matrículas aprobadas)`; `disponibles=max(0, capacidad-ocupados)`; capacidad nula = sin límite. | Año, nivel, grado, sección, estado. | Administrador, Secretaría. | Capacidad es un límite configurado, no meta estratégica; capacidad nula no tiene tasa. |
| `active-teachers` | Docentes activos | Docentes | Filtra `status=ACTIVE`; filas. | Sin año; fecha por creación. | Administrador, Secretaría. | No mide dotación contra meta. |
| `teacher-courses` | Cursos por docente | Cursos | Filas de cursos con docente y estructura académica. | Año, nivel, grado, sección, curso, asignatura, docente, estado; fecha por creación. | Administrador; Docente solo cursos propios. | No mide desempeño ni carga horaria. |
| `teacher-workload` | Carga docente (asignaciones) | Asignaciones docentes y cursos | `courses_count` por asignación. | Filtros académicos, docente, curso, estado; fecha por creación. | Administrador; Docente con alcance de sus cursos, según permisos. | Conteo de cursos no define carga horaria objetivo. |
| `student-scores` | Notas por estudiante | Calificaciones/evaluaciones | Filas individuales con nota y nota máxima. | Periodo, estudiante, curso y estructura; fecha por `graded_at`. | Administrador; Docente según permisos/alcance. | Sin agregación de logro frente a meta estratégica. |
| `course-scores` | Notas por curso | Calificaciones/evaluaciones | Filas de notas relacionadas con curso/evaluación. | Periodo, curso y estructura; fecha por `graded_at`. | Administrador; Docente según permisos/alcance. | No se calcula promedio institucional en esta consulta. |
| `period-scores` | Notas por periodo | Calificaciones y periodos | Filas de notas ligadas al periodo de la evaluación. | Periodo, curso/estructura; fecha por `graded_at`. | Administrador; Docente según permisos/alcance. | Filtro temporal académico disponible, pero no hay meta de aprendizaje definida. |
| `course-assessments` | Evaluaciones y número de calificaciones | Evaluaciones y calificaciones | `scores_count` por evaluación. | Periodo, curso/estructura, estado; fecha por `evaluation_date`. | Administrador; Docente según permisos/alcance. | Conteo de notas no demuestra cobertura/resultado esperado validado. |
| `assignment-submissions` | Entregas por tarea | Tareas, roster de matrícula aprobada y entregas | Esperados = matrículas aprobadas con estudiante activo; faltantes = roster sin entrega; entregaron = esperados − faltantes. | Curso/estructura/estudiante/estado; fecha por `due_at`. | Administrador; Docente según permisos y cursos propios. | Cobertura de entrega; no evalúa calidad ni logro. |
| `missing-submissions` | Entregas no presentadas | Tareas, roster y entregas | Tareas publicadas/cerradas con `pending_count>0`; faltantes contados por estudiante sin entrega. | Curso/estructura/estudiante/estado; fecha por `due_at`. | Administrador; Docente según permisos y cursos propios. | No es meta aprobada; depende de roster y relación de curso. |
| `student-attendance` | Asistencia por estudiante | Registros de asistencia, sesión, curso y justificación | Filas por registro de asistencia. | Curso/estructura/estudiante/estado; fecha de sesión. | Administrador, Secretaría y Docente según permiso/alcance. | No calcula tasa institucional contra meta. |
| `course-attendance` | Asistencia por curso | Registros de asistencia, sesión y curso | Filas por registro/estado. | Curso/estructura/estado; fecha de sesión. | Administrador, Secretaría y Docente según permiso/alcance. | Registros operativos, no cumplimiento agregado. |
| `attendance-incidents` | Faltas, tardanzas y justificaciones | Registros de asistencia y justificación | Solo estados `ABSENT`, `LATE`, `JUSTIFIED`; filas. | Curso/estructura/estudiante/estado; fecha de sesión. | Administrador, Secretaría y Docente según permiso/alcance. | Sin umbral estratégico ni alerta oficial. |
| `request-status` | Solicitudes por estado | Solicitudes académicas | Filas de solicitudes con estado y fecha de creación. | Estudiante, estado; fechas por `created_at`. | Administrador, Secretaría. | No mide SLA ni tiempo de resolución objetivo. |
| `enrollment-payments` | Pagos de matrícula | Pagos, conceptos y matrículas | Filas con monto, estado, vencimiento y existencia de validador. | Año, estudiante, estado; fecha por vencimiento. | Administrador; Tesorería con permiso financiero. | Dato financiero operativo, no indicador educativo. |
| `published-communications` | Comunicaciones publicadas | Comunicaciones | Filas `PUBLISHED`. | Fechas por `published_at`. | Administrador, Secretaría. | No mide alcance, lectura ni efectividad. |

Los reportes con filas individuales no calculan por sí mismos un total institucional; paginación y conteo de resultados de la API son propiedades de consulta, no metas de PE-01.2.

## Dashboards por rol

| Rol | Datos que muestra el código | Fuente/cálculo y observación |
|---|---|---|
| Administrador | Estudiantes/docentes activos; matrículas pendientes/aprobadas; solicitudes y justificaciones pendientes; cursos activos; pagos pendientes; matrículas por estado; estudiantes aprobados distintos por nivel; cinco auditorías recientes. | Conteos por estado, `COUNT(*)` y `COUNT(DISTINCT student_id)`; no hay denominadores/meta objetivos asociados. |
| Secretaría | Estudiantes activos; matrículas pendientes/observadas; solicitudes registradas/observadas/en revisión; justificaciones pendientes; documentos en borrador; solicitudes recientes. | Conteos de registros institucionales por estado; algunas tarjetas no filtran por año. |
| Tesorería | Pagos pendientes/validados/vencidos; suma del monto pendiente; matrículas pendientes de validación económica. | Conteos y suma de pagos; elegibilidad económica se deriva de concepto activo y pago suficiente validado. No es meta educativa. |
| Docente | Cursos activos, estudiantes distintos en roster aprobado, tareas publicadas, entregas sin revisión, evaluaciones publicadas en siete días y sesiones recientes. | Datos limitados a cursos propios; horizonte de siete días es una ventana operativa, no periodicidad de evaluación estratégica. |
| Estudiante | Matrícula, año, sección, cursos; tareas pendientes/próximas; porcentaje de asistencia, faltas, justificaciones, solicitudes y hasta cinco notas publicadas recientes. | Asistencia = registros `PRESENT` o `LATE` / total de registros × 100; si no hay registros muestra “Sin registros”. Datos personales y permisos aplicables. |
| Apoderado | Resumen académico de estudiante(s) vinculados, con notas publicadas, tareas y asistencia autorizadas. | Acceso limitado por vínculo; no ve reportes institucionales. No es tablero de dirección. |

Dashboard API: `GET /api/v1/dashboard`; selector opcional `academic_year_id`, sin filtro de periodo. Sin año explícito utiliza año actual o todos si no hay año actual. Los datos de personas y trámites se presentan como estado institucional actual, según la nota de alcance del servicio.

## Permisos, aislamiento y filtros

- **Institución:** el grupo API exige sesión y middleware institucional (`auth:sanctum`, `institution`, `password.changed`). El contexto deriva del usuario autenticado; scopes de modelos limitan consultas. `ReportRequest` prohíbe `institution_id` del cliente y valida IDs de año, periodo, curso, estudiante, etc. mediante modelos scoped. Una selección ajena no se acepta.
- **Dashboard:** acepta `academic_year_id` validado; sin selección usa el año actual y, si no existe, consulta todos los años. La interfaz incluye selector de año. No hay filtro de periodo en el dashboard. Según la nota del servicio, matrículas, cursos, pagos y aprendizaje usan el año seleccionado/actual, mientras personas y trámites representan el estado institucional actual.
- **Reportes:** filtros disponibles dependen del tipo: año, nivel, grado, sección, curso, asignatura, docente, estudiante, periodo, estado y fechas cuando están habilitados. El periodo aplica a notas/evaluaciones; no existe filtro general de objetivo ni fecha de evaluación estratégica.
- **Semántica de fechas:** asistencia usa la fecha de sesión; notas, `graded_at`; evaluaciones, `evaluation_date`; tareas, `due_at`; pagos, `due_date`; comunicaciones, `published_at`; los demás tipos, `created_at`. Esto es importante al interpretar tendencias.
- **Permisos:** ADMINISTRATOR puede ver reportes permitidos por permisos de módulo; SECRETARY recibe reportes operativos autorizados; TREASURY, pagos; TEACHER, reportes de sus cursos y datos académicos autorizados; STUDENT y GUARDIAN no reciben el catálogo institucional de reportes. En dashboards se comprueba permiso por tarjeta/tabla y se restringe el alcance docente/familiar.
- Fuentes: [ReportRequest.php](../../../../backend/app/Http/Requests/ReportRequest.php), [ReportPolicy.php](../../../../backend/app/Policies/ReportPolicy.php), [ResolveInstitution.php](../../../../backend/app/Http/Middleware/ResolveInstitution.php), [DashboardService.php](../../../../backend/app/Services/Reports/DashboardService.php), [roles-permissions.md](../../../../docs/roles-permissions.md) y [api.md](../../../../docs/api.md).

## Pruebas que cubren la funcionalidad

- [Sprint10Test.php](../../../../backend/tests/Feature/Sprint10Test.php) contiene casos para los veinte reportes con datos reales, filtros/paginación, selección de periodo, institución y rol, exportación CSV, privacidad y neutralización de fórmulas; también comprueba seis dashboards, privacidad familiar y accesos por rol.
- [reports.cy.ts](../../../../e2e/cypress/e2e/reports.cy.ts) comprueba el dashboard administrativo, catálogo de 20 reportes, filtro de reporte, opciones de estudiante, exportación CSV/responsividad y dashboards de Secretaría, Tesorería, Docente, Estudiante y Apoderado.
- [quality-metrics.md](../../../../docs/quality-metrics.md) documenta como evidencia histórica 311 Pest y 42 Cypress aprobados para Sprint 10. **No se ejecutaron en esta auditoría**, por lo que no se reporta una ejecución nueva.

## Datos estratégicos no definidos

No se encontraron fuentes aprobadas para:

- objetivos institucionales y metas asociadas;
- valor objetivo, unidad, línea base, umbral o fórmula estratégica;
- responsable de indicador y validador;
- periodicidad/fecha de corte de evaluación formal;
- reglas de comparación, tolerancias, excepciones o decisión resultante;
- acciones correctivas vinculadas al incumplimiento;
- aprobaciones/versiones de los indicadores.

Los campos anteriores se califican como **NO DEFINIDOS EN EL ALCANCE VERIFICADO**, no como datos nulos de los reportes. Deben ser proporcionados y aprobados por el responsable del proceso antes de diseñar una cobertura estratégica.

## Estado y recomendación

- **Estado PE-01.2:** PARCIAL respecto a consulta de indicadores operativos; NO IMPLEMENTADO respecto a supervisión del cumplimiento de objetivos institucionales.
- **RF:** RF-23, generación de reportes, cubre reportes operativos aprobados en el alcance existente; no constituye un RF de seguimiento de objetivos.
- **Dependencia:** proceso y definiciones institucionales verificables de PE-01.1, más aprobación del catálogo de indicadores. No se encontró una dependencia técnica directa a objetivos porque no existe esa entidad/flujo.
- **Recomendación:** documentar primero el procedimiento real y la matriz indicador–fuente–cálculo–responsable–periodicidad–umbral con el dueño. Solo después, si la mejora queda autorizada, evaluar filtros/etiquetas/usabilidad en reportes existentes. No crear KPIs, metas, tablas ni motor de seguimiento por inferencia.
