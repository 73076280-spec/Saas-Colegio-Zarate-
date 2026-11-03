# BOLT-EST-002 — Evidencias de auditoría PE-01.2

## Estado y alcance

- Procedimiento: PE-01.2, supervisar el cumplimiento de objetivos.
- Tipo: auditoría de solo lectura de dashboards, reportes, filtros, permisos y pruebas documentadas.
- Rama/base: `feature/macro-estrategico`, commit `0d98612`.
- Fecha: 2026-11-02, hora local UTC-05:00.
- Resultado: dashboard y reportes operativos implementados; seguimiento formal de objetivos institucionales no encontrado.
- No se modificó código ni se ejecutaron pruebas o migraciones. Los resultados históricos de pruebas citados se revisaron en documentación/código, no se reprodujeron en esta ejecución.
- Responsable humano: integrante asignado; nombre institucional no proporcionado. Herramienta: Copilot en VS Code; modelo/versión exactos no disponibles en la sesión.
- Prompt literal y solicitud: [06-prompt-auditoria-pe-01-2.md](06-prompt-auditoria-pe-01-2.md).
- Hallazgos detallados y matriz indicador–fuente–cálculo–limitación: [informe de auditoría PE-01.2](auditoria-pe-01-2.md).
- Revisión de mejora condicionada sin autorización para programar: [Prompt 07 y decisión](07-prompt-mejora-condicionada-pe-01-2.md).

## Hallazgo principal

EcoAula calcula datos operativos a partir de sus registros y ofrece seis experiencias de dashboard por rol y veinte reportes. No se encontró un catálogo institucional de objetivos estratégicos, metas/valores esperados, umbrales, versiones aprobadas, responsables de objetivo, periodicidad formal de evaluación ni flujo para registrar decisiones correctivas. Por ello, **PE-01.2 está PARCIALMENTE CUBIERTO solo como consulta de indicadores operativos; la supervisión del cumplimiento de objetivos institucionales NO ESTÁ IMPLEMENTADA ni se puede verificar como proceso institucional**.

Los valores que sí calcula el software son trazables a registros existentes y a consultas de código. No son indicadores estratégicos aprobados por el solo hecho de aparecer en un dashboard. El RF-23 corresponde a generación de reportes; no define metas ni aprueba una interpretación estratégica. Fuentes: [ReportCatalog.php](../../../../backend/app/Services/Reports/ReportCatalog.php), [ReportService.php](../../../../backend/app/Services/Reports/ReportService.php), [DashboardService.php](../../../../backend/app/Services/Reports/DashboardService.php), [requirements-status.md](../../../../docs/requirements-status.md) y [traceability.md](../../../../docs/traceability.md).

## Matriz de reportes: indicador, fuente, cálculo y limitación

Los reportes presentan registros o valores derivados; salvo cuando se describe una fórmula visible en el código, no deben interpretarse como una medición agregada de cumplimiento de meta.

| Reporte | Fuente y cálculo verificado | Alcance / limitación para PE-01.2 |
|---|---|---|
| Estudiantes activos (`active-students`) | `students`, filtrando estado `ACTIVE`; listado de registros activos. | No compara matrícula con una meta institucional. El filtro temporal disponible usa `created_at`; no tiene filtro de año académico. |
| Matriculados por año (`enrolled-students`) | `enrollments` con estado `APPROVED`; muestra registro y relaciones de año, nivel, grado y sección. | Conteo/consulta operativa de matrículas, no avance frente a objetivo. Permite filtro de año y estructura. |
| Estudiantes por grado y sección (`students-by-section`) | `enrollments` aprobadas, con año, grado, sección y estudiante. | Desglosa registros de matrícula; no define una capacidad objetivo ni mide una meta estratégica. Filtros académicos disponibles. |
| Matrículas por estado (`enrollment-status`) | `enrollments` con estado actual; cada fila es un registro de matrícula. | El nombre de familia no implica porcentaje ni total agregado. Acepta estado y filtros académicos/de estudiante/fecha. |
| Ocupación y cupos (`section-capacity`) | `sections` y subconsulta `COUNT(*)` de matrículas aprobadas; disponibles = `max(0, capacidad - ocupados)` o “Sin límite” si no hay capacidad. | La capacidad nula no produce tasa de ocupación. Es cálculo de cupos, no resultado educativo ni meta. |
| Docentes activos (`active-teachers`) | `teachers` con estado `ACTIVE`; listado de docentes. | No mide dotación contra meta. No tiene filtro de año académico; rango temporal aplica a creación del registro. |
| Cursos por docente (`teacher-courses`) | `courses` con docente, año, asignatura, grado y sección. | Lista cursos; no evalúa calidad ni cumplimiento. Docente queda limitado a sus cursos; no es una serie de carga objetivo. |
| Carga docente (asignaciones) (`teacher-workload`) | `teacher_assignments` con `withCount('courses')`; presenta número de cursos asociados a la asignación. | La cantidad de cursos no representa carga horaria/estándar aprobado. No hay fórmula institucional de carga objetivo. |
| Notas por estudiante (`student-scores`) | `scores` y relaciones de evaluación, curso y periodo; expone nota y máximo. | Filas de notas, sin cálculo de logro agregado contra una meta estratégica. Filtros de periodo, estudiante y contexto académico. |
| Notas por curso (`course-scores`) | `scores` asociados a curso y evaluación. | No calcula promedio/tasa institucional de cumplimiento de objetivo; muestra registros de nota. |
| Notas por periodo (`period-scores`) | `scores` vinculados a `academic_periods` mediante la evaluación. | Permite filtro de periodo; no implica que exista una meta de aprendizaje aprobada ni una agregación contra ella. |
| Evaluaciones por curso (`course-assessments`) | `assessments` con `withCount('scores')`; presenta evaluación, periodo, fecha, estado y número de notas. | Conteo de notas asociadas, no resultado de aprendizaje ni cobertura esperada validada. |
| Tareas y entregas (`assignment-submissions`) | `assignments`; calcula estudiantes esperados desde matrículas aprobadas con estudiante activo, y faltantes con ausencia de submission; entregaron = esperados − faltantes. | Calcula cobertura de entrega por tarea, no calidad o logro. Depende de roster/curso/año/grado/sección vigentes y de la relación a nivel estudiante. |
| Tareas pendientes / no entregadas (`missing-submissions`) | Tareas publicadas/cerradas con subconsulta de matrícula aprobada activa y sin entrega asociada por estudiante. | No entrega una meta de cumplimiento ni una razón institucional aprobada. El conteo es por estudiante que no entregó, no por intentos. |
| Asistencia por estudiante (`student-attendance`) | `attendance_records` con su sesión, curso y justificación; una fila por registro. | No calcula en el reporte una tasa institucional agregada contra objetivo. Filtros de fecha usan la fecha de sesión. |
| Asistencia por curso (`course-attendance`) | Mismos registros de asistencia, asociados a sesión/curso. | Registros y estados, no cumplimiento de meta de asistencia. Filtros de curso/año/estructura y fecha de sesión. |
| Faltas, tardanzas y justificaciones (`attendance-incidents`) | Asistencia filtrada a estados `ABSENT`, `LATE` o `JUSTIFIED`, con relación de justificación. | Incidentes operativos; no define umbrales ni alertas institucionales aprobadas. |
| Solicitudes por estado (`request-status`) | `academic_requests` con código, estudiante, tipo, estado y fecha de creación. | Lista solicitudes, no tasa/plazo de resolución contra un SLA estratégico. No aplica filtro de año académico. |
| Pagos de matrícula (`enrollment-payments`) | `student_payments` unidos a concepto de matrícula; muestra monto, vencimiento, estado y si `validated_by` está presente. | Gestión financiera de matrícula, no indicador de calidad educativa ni meta estratégica. Filtros incluyen año y fecha de vencimiento. |
| Comunicaciones publicadas (`published-communications`) | `communications` con estado `PUBLISHED`; muestra título y fecha de publicación. | Lista publicaciones; no mide alcance, recepción o efectividad institucional. Fecha usa `published_at`. |

Catálogo y agrupación exacta de reportes: [ReportCatalog.php](../../../../backend/app/Services/Reports/ReportCatalog.php). Fuentes, filtros, fechas y filas: [ReportService.php](../../../../backend/app/Services/Reports/ReportService.php). La UI consume el catálogo autorizado en [ReportsPage.tsx](../../../../frontend/src/reports/ReportsPage.tsx).

## Dashboards: métricas reales y límites

| Rol/experiencia | Datos/fórmulas observables | Límite estratégico |
|---|---|---|
| ADMINISTRATOR | Estudiantes/docentes activos; matrículas pendientes/aprobadas por estado; cursos activos; pagos pendientes; estudiantes aprobados distintos por nivel; cinco auditorías recientes. | Totales de estado y actividad, no metas ni evaluación formal. Algunas tarjetas respetan permiso y año; el panel por nivel cuenta estudiantes distintos. |
| SECRETARY | Estudiantes activos; matrículas pendientes/observadas; solicitudes pendientes/en revisión; justificaciones y documentos pendientes; cinco solicitudes recientes. | Seguimiento administrativo actual; no compara tiempos/volúmenes con objetivo. No todos los elementos usan filtro anual. |
| TREASURY | Pagos pendientes, validados, vencidos; suma de montos pendientes; matrículas pendientes de validación económica derivadas de concepto activo y pago validado suficiente. | Indicadores financieros operativos de matrícula, no planificación estratégica. La validez depende de estado, fecha y relaciones de pagos. |
| TEACHER | Cursos activos visibles; estudiantes activos con matrícula aprobada en esos cursos; tareas publicadas; entregas sin revisión; evaluaciones publicadas en próximos siete días; sesiones recientes. | Limitado a cursos asignados. “Estudiantes” es conteo distinto dentro del roster; no mide logro frente a meta institucional. |
| STUDENT | Resumen propio: matrícula, año, sección, cursos activos; tareas pendientes/próximas; asistencia, faltas y justificaciones; solicitudes y hasta cinco notas publicadas recientes, según permisos. | Datos personales/operativos, parcialmente limitados al año elegido; no es un tablero institucional de cumplimiento. |
| GUARDIAN | Resumen equivalente de estudiantes vinculados, con datos académicos publicados; acceso comprobado por vínculo. | Solo menores vinculados y datos autorizados; no accede al catálogo de reportes institucionales. |

El cálculo y control por permiso de tarjetas/tablas están en [DashboardData.php](../../../../backend/app/Services/Reports/DashboardData.php) y los servicios por rol: [OfficeDashboard.php](../../../../backend/app/Services/Reports/OfficeDashboard.php), [TreasuryDashboard.php](../../../../backend/app/Services/Reports/TreasuryDashboard.php), [TeacherDashboard.php](../../../../backend/app/Services/Reports/TeacherDashboard.php), [FamilyDashboard.php](../../../../backend/app/Services/Reports/FamilyDashboard.php) y [StudentSummary.php](../../../../backend/app/Services/Reports/StudentSummary.php).

## Filtros, institución y permisos

- **Institución:** el grupo API exige sesión y middleware institucional (`auth:sanctum`, `institution`, `password.changed`). El contexto deriva del usuario autenticado; scopes de modelos limitan consultas. `ReportRequest` prohíbe `institution_id` del cliente y valida IDs de año, periodo, curso, estudiante, etc. mediante modelos scoped. Una selección ajena no se acepta.
- **Dashboard:** acepta `academic_year_id` validado; sin selección usa el año actual y, si no existe, consulta todos los años. La interfaz incluye selector de año. No hay filtro de periodo en el dashboard. Según la nota del servicio, matrículas, cursos, pagos y aprendizaje usan el año seleccionado/actual, mientras personas y trámites representan el estado institucional actual.
- **Reportes:** filtros disponibles dependen del tipo: año, nivel, grado, sección, curso, asignatura, docente, estudiante, periodo, estado y fechas cuando están habilitados. El periodo aplica a notas/evaluaciones; no existe filtro general de objetivo ni fecha de evaluación estratégica.
- **Semántica de fechas:** asistencia usa la fecha de sesión; notas, `graded_at`; evaluaciones, `evaluation_date`; tareas, `due_at`; pagos, `due_date`; comunicaciones, `published_at`; los demás tipos, `created_at`. Esto es importante al interpretar tendencias.
- **Permisos:** ADMINISTRATOR puede ver reportes permitidos por permisos de módulo; SECRETARY recibe reportes operativos autorizados; TREASURY, pagos; TEACHER, reportes de sus cursos y datos académicos autorizados; STUDENT y GUARDIAN no reciben el catálogo institucional de reportes. En dashboards se comprueba permiso por tarjeta/tabla y se restringe el alcance docente/familiar.
- Fuentes: [ReportRequest.php](../../../../backend/app/Http/Requests/ReportRequest.php), [ReportPolicy.php](../../../../backend/app/Policies/ReportPolicy.php), [ResolveInstitution.php](../../../../backend/app/Http/Middleware/ResolveInstitution.php), [DashboardService.php](../../../../backend/app/Services/Reports/DashboardService.php), [roles-permissions.md](../../../../docs/roles-permissions.md) y [api.md](../../../../docs/api.md).

## Pruebas que cubren la funcionalidad

- [Sprint10Test.php](../../../../backend/tests/Feature/Sprint10Test.php) contiene casos para los veinte reportes con datos reales, filtros/paginación, selección de periodo, institución y rol, exportación CSV, privacidad y neutralización de fórmulas; también comprueba seis dashboards, privacidad familiar y accesos por rol.
- [reports.cy.ts](../../../../e2e/cypress/e2e/reports.cy.ts) comprueba el dashboard administrativo, catálogo de 20 reportes, filtro de reporte, opciones de estudiante, exportación CSV/responsividad y dashboards de Secretaría, Tesorería, Docente, Estudiante y Apoderado con restricciones de acceso familiar.
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
- La revisión del Prompt 07 no encontró una corrección mínima verificable que proceda sin decisiones funcionales; el resultado y los casos nulos/protección institucional están en [decision-mejora-pe-01-2.md](decision-mejora-pe-01-2.md).
