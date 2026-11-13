# BOLT-MIS-004 — Diagnóstico de evaluación académica

Fecha: 01/11/2026. EcoAula SaaS — Colegio Zárate de Huancayo. Macroproceso misional, procedimientos PM-03.1 a PM-03.4.

## Alcance, estado inicial y evidencia

Repositorio: `D:\zarate-saas`. Rama comprobada: `feature/evaluacion-academica`. HEAD: `a1dc16d`. `git status --short` estaba vacío al iniciar. Se comprobó que `6b3e216` — Matrículas — y `c844244` — M-03 de Enseñanza-aprendizaje — son antecesores de `feature/macro-misional`; no se deduce de ello una aprobación docente ni un despliegue.

Esta es una auditoría de documentación y código. **No se ejecutaron Pest, Cypress, build, lint ni TypeScript; cero casos de prueba ejecutados en esta intervención.** No se conectó a bases de datos ni se prepararon entornos, migraciones o seeders. La ejecución funcional actual es **NO VERIFICADA**. Los resultados de BOLT-MIS-003 son históricos y no se trasladan como aprobaciones actuales de BOLT-MIS-004.

Solo se crean este diagnóstico y el prompt íntegro. No se modifican funcionalidades, Enseñanza-aprendizaje, Matrículas, roles, permisos, dependencias ni otros macroprocesos. Se consultó `backend/AGENTS.md` para conocer las restricciones de pruebas aisladas; no se aplican ejecuciones de Pest/Pint a una intervención sin cambios backend.

### Interpretación de estados

- **IMPLEMENTADO:** hay soporte verificable en código para el alcance descrito; no significa que se haya ejecutado satisfactoriamente ahora.
- **PARCIAL:** el procedimiento amplio tiene soporte, pero no debe confundirse con una capacidad más extensa no demostrada. No implica automáticamente incumplimiento de los RF del proyecto.
- **PENDIENTE:** una capacidad concreta no fue encontrada y requeriría confirmar su necesidad antes de desarrollarla.
- **NO VERIFICADO:** falta ejecución o decisión institucional para afirmar el comportamiento o la equivalencia funcional.

## Documentación y alcance heredado

| Fuente | Aporte al análisis |
| --- | --- |
| `docs/sprints/sprint-1.md` | Sanctum, contexto institucional, roles, Policies y auditoría |
| `docs/sprints/sprint-2.md` | Año, periodo, fechas, `grading_open` y cierre académico |
| `docs/sprints/sprint-3.md` | Perfiles de docente/estudiante y vínculo familiar |
| `docs/sprints/sprint-4.md` | Matrícula aprobada como elegibilidad de curso |
| `docs/sprints/sprint-5.md` | Cursos, asignaciones docentes y roster autorizado |
| `docs/sprints/sprint-6.md` | Aula Virtual y autorización de contenido |
| `docs/sprints/sprint-7.md` | Evaluaciones, tipos, notas, historial y límites explícitos de publicación/cierre |
| `docs/sprints/sprint-8.md` | Asistencia y justificaciones, adyacentes y fuera de PM-03 |
| `docs/sprints/sprint-9.md` | Documentos/comunicaciones/notificaciones; no equivale a boletín automático de notas |
| `docs/sprints/sprint-10.md` | Reportes, CSV y resumen académico familiar |
| `docs/requirements-status.md`, `docs/traceability.md` | Catálogo de 24 RF y trazabilidad; RF-08/09/10 y alcance de consulta familiar |
| `docs/aula-virtual-fase-1.md`, `docs/ai-dlc/misional/BOLT-MIS-003/cierre-bolt.md` | Rutas independientes, permisos y mejoras de acceso/filtros integradas |

Sprint 7 declara que cerrar una evaluación retira sus notas de las consultas estudiantiles y que no hay promedios automáticos ni editor de tipos. La matriz de RF limita el resumen familiar a cinco notas recientes y excluye la libreta oficial automática. Estos límites son decisiones existentes documentadas; no se presentan como defectos nuevos sin un requerimiento que las contradiga.

## Inventario funcional existente

| Área | Implementación real y archivos de referencia |
| --- | --- |
| Evaluaciones | `backend/app/Models/Learning/Assessment.php`, `AssessmentType.php`; `Services/Learning/LearningService.php`; `frontend/src/learning/LearningForm.tsx` |
| Notas | `backend/app/Models/Learning/Score.php`; `Services/Learning/ScoreService.php`; `frontend/src/learning/ScoreForm.tsx`, `LearningPanel.tsx` |
| Historial de nota | `backend/app/Models/Learning/ScoreHistory.php`; `LearningController::history`; componente interno `ScoreHistory` de `LearningPanel.tsx` |
| Validación/autorización | `backend/app/Http/Requests/LearningRequest.php`, `Policies/LearningPolicy.php`, `Services/Learning/LearningAccess.php`, `Services/Classroom/ClassroomAccess.php`, `Services/Courses/CourseAccess.php` |
| Periodos | `backend/app/Models/Academic/AcademicPeriod.php`, `Services/Academic/AcademicService.php`, `Policies/AcademicPolicy.php`; `frontend/src/academic/AcademicPage.tsx`, `catalogs.ts` |
| Resumen personal/familiar | `backend/app/Services/Reports/DashboardService.php`, `FamilyDashboard.php`, `StudentSummary.php`; vínculo mediante `Services/Office/OfficeAccess.php`; `frontend/src/pages/DashboardPage.tsx` |
| Reportes académicos | `backend/app/Services/Reports/ReportCatalog.php`, `ReportService.php`, `Policies/ReportPolicy.php`; `frontend/src/reports/ReportsPage.tsx` |
| Integración del aula | `frontend/src/App.tsx`, `virtual/access.ts`, `virtual/VirtualPages.tsx`, `learning/CourseLearning.tsx`, `courses/TeachingPage.tsx` |
| Persistencia | `backend/database/migrations/2026_10_04_100000_create_learning_tables.php` y `2026_10_01_160000_create_academic_structure.php`, solo leídas |

Los nombres de servicio/modelo abreviados de la tabla conservan el directorio de su primera referencia en cada fila. No se encontró un módulo de boletines oficiales, libreta automática o consolidado de promedio final. Sí existen reportes de notas por estudiante/curso/periodo y exportación CSV, que deben reutilizarse. No se confunde un archivo de documento académico emitido con un boletín calculado.

## Matriz de diagnóstico de procedimientos

### PM-03.1 — Configurar evaluaciones

| Campo | Diagnóstico |
| --- | --- |
| Objetivo y actores | Preparar evaluaciones coherentes con curso, periodo y tipo. Docente asignado activo y Administración, con permisos específicos |
| Entradas | Curso activo; título, descripción opcional, periodo del año del curso, tipo activo institucional, `max_score`, peso y fecha opcionales |
| Actividades | Consultar periodos/tipos, crear en DRAFT, editar, publicar o cerrar según permiso y estado |
| Salidas | Evaluación persistida y capacidades calculadas; auditoría CREATE/UPDATE/PUBLISH/CLOSE |
| RF | RF-10 directo, RF-22 de acceso; RF-04 y RF-24 transversales; RF-08 como dependencia de configuración de escala |
| Frontend | `frontend/src/learning/LearningForm.tsx`, `LearningPanel.tsx`, `CourseLearning.tsx`; configuración de periodo en `frontend/src/academic/AcademicPage.tsx` |
| Backend | `backend/app/Models/Learning/Assessment.php`, `AssessmentType.php`; `Services/Learning/LearningService.php`; `Http/Requests/LearningRequest.php`; `Http/Controllers/Api/LearningController.php`; `Policies/LearningPolicy.php` |
| Endpoints | GET/POST `/api/v1/courses/{course}/assessments`; GET/PATCH `/api/v1/assessments/{id}`; GET `/api/v1/courses/{course}/assessment-types` y `/assessment-periods`; POST `/api/v1/assessments/{id}/publish` y `/close` |
| Permisos | `assessments.view/create/update/publish/close`, más autorización de curso del servidor. Cambiar periodos exige permisos separados `academic-periods.*` |
| Estado | **IMPLEMENTADO** para configurar evaluaciones con tipos existentes. Ejecución actual **NO VERIFICADA** |
| Evidencia | Se valida periodo del mismo año y tipo activo. CLOSED no se edita. Con notas existentes no se cambia periodo, escala ni tipo. `LearningRequest` limita escala a >0 y ≤20, dos decimales y peso 0–100 |
| Brechas/riesgos | No existe editor de tipos en el alcance actual; no se debe crear sin confirmar necesidad. Fecha de evaluación no se valida contra intervalo del periodo en el servicio revisado. La UI ofrece periodos sin ocultar los cerrados; el registro de notas sí aplica bloqueo definitivo |
| Pruebas | `Sprint7Test.php`: periodos/tipos ajenos, rango y periodo inválido, bloqueo; `learning.cy.ts`: creación/publicación de evaluación; `learning-filters.cy.ts`: estados de evaluación con API simulada |
| Recomendación | Verificar cobertura de escala menor a 20 y estructura con notas; aclarar si fecha dentro del periodo es regla institucional antes de añadir restricciones |

### PM-03.2 — Registrar calificaciones

| Campo | Diagnóstico |
| --- | --- |
| Objetivo y actores | Registrar/corregir nota de estudiante elegible. Docente asignado o Administración autorizada; estudiante/apoderado no escriben notas |
| Entradas | Evaluación PUBLISHED, curso ACTIVE, periodo no CLOSED con `grading_open=true`, estudiante activo con matrícula APPROVED; nota, observación y motivo obligatorio al modificar |
| Actividades | Elegir estudiante del roster, registrar nota única, editar con motivo, consultar historial; validación y bloqueo de filas en servidor |
| Salidas | Nota decimal, actor y fecha; nueva fila de historial y auditoría atómicos |
| RF | RF-08 directo; RF-06/05 como dependencias de elegibilidad; RF-04 y RF-24 transversales |
| Frontend | `frontend/src/learning/ScoreForm.tsx`, `LearningPanel.tsx`, `shared.tsx` — selector de estudiante |
| Backend | `backend/app/Services/Learning/ScoreService.php`, `LearningAudit.php`; `Models/Learning/Score.php`, `ScoreHistory.php`; `Http/Requests/LearningRequest.php`, `Http/Resources/LearningResource.php`, `Policies/LearningPolicy.php` |
| Endpoints | GET/POST `/api/v1/assessments/{assessment}/scores`; GET/PATCH `/api/v1/scores/{id}`; GET `/api/v1/courses/{id}/students`; GET `/api/v1/scores/{id}/history` |
| Permisos | `scores.view/create/update` según operación; alcance del docente/administración en `ClassroomAccess`; consulta del padre en `LearningController` para listado de notas de evaluación |
| Estado | **IMPLEMENTADO**, con reglas verificadas por código y tests existentes sin ejecutar en esta fase |
| Evidencia | `ScoreService` comprueba 0–20 y `score <= max_score`, estudiante activo/matrícula, periodo y curso; bloquea duplicados y motivo vacío. Índice único `(assessment_id, student_id)` en migración. Transacción agrupa nota, historial y auditoría |
| Brechas/riesgos | La apertura depende de `grading_open` y estado del periodo, no de que hoy caiga entre sus fechas: no inventar bloqueo por calendario. La interfaz usa `grading_open` y estado de evaluación para botones; la API agrega validaciones de curso/periodo/perfil. Puede producir rechazos de contexto que deben explicarse sin ampliar permisos |
| Pruebas | `Sprint7Test.php`: notas válidas, duplicados, alumno observado, fuera de rango, periodo bloqueado, evaluación cerrada, motivo e historial/rollback. `learning.cy.ts`: nota propia publicada, sin modificación por estudiante |
| Recomendación | Conservar servicio y transacción; mejorar explicación del motivo de bloqueo y cubrir bordes no explícitos de escala/precisión/permisos personalizados, sin rehacer CRUD |

### PM-03.3 — Publicar resultados

| Campo | Diagnóstico |
| --- | --- |
| Objetivo y actores | Hacer consultables los resultados autorizados. Docente/Administración publican la evaluación; estudiante titular consulta, apoderado ve resumen vinculado |
| Entradas | Evaluación DRAFT y permiso de publicación; posteriormente notas registradas sobre evaluación PUBLISHED |
| Actividades | Publicar evaluación, registrar notas, consultar notas propias/resumen; cerrar evaluación según autorización |
| Salidas | Visibilidad de notas conforme al estado de la evaluación; auditoría de publicación y registro de nota |
| RF | RF-10 y RF-09 directos; RF-08 de escritura; RF-21 familiar, RF-22 de aula y RF-24 transversal |
| Frontend | `frontend/src/learning/LearningPanel.tsx`, `CourseLearning.tsx`; `virtual/VirtualPages.tsx`; `pages/DashboardPage.tsx` |
| Backend | `backend/app/Services/Learning/LearningService.php`, `LearningAccess.php`, `ScoreService.php`; `Services/Reports/StudentSummary.php`; migración de aprendizaje |
| Endpoints | POST `/api/v1/assessments/{id}/publish`; POST `/api/v1/assessments/{id}/close`; GET `/api/v1/my/scores`, `/my/assessments`; GET `/api/v1/dashboard` |
| Permisos | `assessments.publish` para publicar evaluación; `scores.create/update` para notas; `scores.view` para consulta personal; `profile.view` y vínculo verificado para resumen familiar |
| Estado | **PARCIAL en la correspondencia con un procedimiento de publicación de resultados separado**: está implementada visibilidad ligada a evaluación PUBLISHED. No se encontró una etapa independiente de publicar notas. Si el colegio acepta ese flujo, el mecanismo existente satisface esa interpretación; la equivalencia institucional es **NO VERIFICADA** |
| Evidencia | `ScoreService` solo admite notas sobre evaluación publicada; `LearningAccess::visible` y `StudentSummary` permiten notas de evaluaciones PUBLISHED. `scores` no tiene estado/publicación propia; `assessments` no tiene `published_at` en su migración, aunque se audita PUBLISH |
| Brechas/riesgos | Registrar o corregir una nota la hace visible inmediatamente bajo el estado actual; no hay revisión privada previa de notas ni liberación por lote. Cerrar evaluación retira resultados de vistas estudiantiles y del resumen familiar. Son comportamientos explícitos de Sprint 7, no una regresión demostrada |
| Pruebas | `Sprint7Test.php` comprueba nota propia visible y bloqueo al cerrar para escritura; no se identificó aserción específica de consulta tras cierre o todas las transiciones de publicación de resultados. `learning.cy.ts` cubre publicación de evaluación y lectura de nota, no una publicación independiente |
| Recomendación | Acordar primero qué significa publicar resultados y qué debe ocurrir al cerrar. Documentar el contrato existente y añadir pruebas de visibilidad; no crear estados/endpoint de resultados sin esa decisión |

### PM-03.4 — Consultar historial académico

| Campo | Diagnóstico |
| --- | --- |
| Objetivo y actores | Consultar resultados y cambios académicos dentro del alcance autorizado. Docente/Administración, estudiante titular y apoderado vinculado con capacidades diferentes |
| Entradas | Nota autorizada e ID para historial; consultas personales; filtros de reportes por curso/estudiante/periodo/año; vínculo familiar para resumen |
| Actividades | Consultar notas propias, abrir historial de una nota, consultar reportes institucionales o cinco notas recientes del estudiante vinculado |
| Salidas | Lista paginada de notas, historial con valor anterior/nuevo, actor, motivo y fecha; reportes/CSV autorizados; resumen familiar limitado |
| RF | RF-09, RF-24; RF-08 para trazabilidad del cambio, RF-21 familiar y RF-23 reportes; RF-22 para integración |
| Frontend | `frontend/src/learning/LearningPanel.tsx` — componente interno `ScoreHistory`; `reports/ReportsPage.tsx`; `pages/DashboardPage.tsx`; `App.tsx` |
| Backend | `backend/app/Models/Learning/ScoreHistory.php`, `Score.php`, `LearningRecord.php`; `Http/Controllers/Api/LearningController.php::history`; `Services/Reports/ReportService.php`, `StudentSummary.php`, `FamilyDashboard.php`; `Policies/ReportPolicy.php` |
| Endpoints | GET `/api/v1/scores/{id}/history`, `/my/scores`, `/dashboard`; GET `/api/v1/reports/student-scores`, `/course-scores`, `/period-scores`, `/course-assessments` y sus `/export` autorizados |
| Permisos | Consulta personal `scores.view` y titularidad; historial autorizado mediante Gate de la nota, sin permiso global adicional de historial. Reportes según `ReportPolicy`: Administración o docente con permiso y alcance propio; apoderado no obtiene reportes institucionales |
| Estado | **PARCIAL respecto a historial académico longitudinal**: historial de modificaciones por nota **IMPLEMENTADO**; consulta familiar solo resumen reciente. No hay expediente completo/boletín automático en el alcance definido |
| Evidencia | `ScoreHistory` bloquea actualización y hereda prohibición de borrado; endpoint pagina tras autorizar nota. Reportes existentes ofrecen filtros y CSV. `StudentSummary` limita a cinco notas de cursos elegibles; no expone administración familiar de notas |
| Brechas/riesgos | Historial de una nota no equivale a trayectoria de todos los años. El alumno pierde acceso a nota/historial si evaluación deja de PUBLISHED o curso/matrícula dejan de ser elegibles; el personal mantiene lectura según sus reglas. Apoderado no tiene endpoint de historial completo. No se inventa requisito de boletín o promedio que el catálogo excluye |
| Pruebas | `Sprint7Test.php`: dos entradas de historial, actor, motivo, rollback e IDOR de nota/historial. `Sprint10Test.php`: reportes/filtros, privacidad familiar, exportación. Falta cobertura Cypress específica del historial paginado y corrección de nota |
| Recomendación | Aclarar alcance de “historial académico”, presentar claramente el resumen y el historial por nota, probar conservación/consulta al cierre y reutilizar reportes antes de proponer otro módulo |

## Endpoints, roles y aislamiento

Las rutas están en `backend/routes/api.php`, bajo Sanctum, contexto `institution` y cambio de contraseña obligatorio. Además de los contratos anteriores:

- GET `/api/v1/assessments/{id}` y `/scores/{id}` autorizan recurso individual; GET `/my/assessments` y `/my/scores` aplican alcance personal.
- GET/PATCH `/api/v1/academic-periods/{id}` y POST `/academic-periods/{id}/close`, más listado/alta académicos, usan `AcademicPolicy` y permisos `academic-periods.view/create/update/close` según operación; no se delega gestión del periodo por poseer `scores.create`.
- GET `/api/v1/courses/{course}/assessment-types` y `/assessment-periods` son catálogos paginados; no se encontró CRUD API de tipos de evaluación.
- No hay endpoint identificado de publicar nota individual/lote, boletín automático o expediente completo familiar. No se trata a `/academic-documents` como uno de ellos.

| Rol configurado | Evaluaciones y notas | Consulta |
| --- | --- | --- |
| ADMINISTRATOR | Permisos de aprendizaje previstos por seeder, con institución actual y validación de estado/periodo | Recursos y reportes institucionales autorizados; no evade periodo bloqueado |
| TEACHER | Crea/edita/publica/cierra evaluaciones y registra/modifica notas con permiso, perfil docente activo y asignación activa del curso | Sus cursos; reportes aplican alcance docente y permiso |
| STUDENT | Sin escritura ni publicación de evaluaciones/notas | Notas propias de evaluación PUBLISHED, curso ACTIVE, asignación activa y matrícula APPROVED; historial de nota autorizada |
| GUARDIAN | Sin gestión de aprendizaje ni entrada al aula por ese rol | `profile.view` + vínculo familiar habilitan resumen de notas recientes; no administración ni reportes de notas institucionales |
| SECRETARY | No recibe gestión/lectura de aprendizaje por los seeders de Sprint 7; permisos académicos generales son independientes | Sus consultas institucionales existentes no equivalen a acceso a notas |
| TREASURY | Sin gestión de evaluaciones/notas por ese rol | No recibe acceso académico por su función económica |

Fuente de permisos: `backend/database/seeders/LearningPermissionSeeder.php`; fuente de autorización efectiva: `LearningPolicy`, `LearningAccess` y `ClassroomAccess`, no el nombre de un botón. No se consultaron permisos reales de usuarios de la base actual ni se ejecutaron seeders.

`LearningRecord` aplica `BelongsToInstitution`, y los enlaces de curso/estudiante respetan `CourseAccess::studentQuery`: matrícula APPROVED coincidente por institución, año, grado y sección; perfil estudiantil activo en aprendizaje. `LearningService` comprueba periodo del año y tipo institucional activo. Las escrituras usan transacciones y bloqueos institucionales/de filas; MySQL refuerza unicidad. Un ID de otro estudiante/institución no debe volverse accesible por manipular una URL. Esta arquitectura se comprobó por lectura; no se certifica dinámicamente aislamiento en esta sesión.

Los reportes no son idénticos a la consulta personal: `ReportPolicy` restringe roles y `ReportService` aplica alcance docente por curso. La lectura histórica de personal y la visibilidad actual de estudiantes responden a reglas distintas. No se debe ampliar la segunda copiando indiscriminadamente una consulta institucional.

## Trazabilidad de cambios de notas

1. `LearningRequest` prohíbe campos de servidor como institución, calificador y fecha; nota obligatoria con hasta dos decimales, rango 0–20 y motivo de actualización requerido.
2. `ScoreService` autoriza por Gate y verifica evaluación, curso, periodo, perfil/matrícula, escala y duplicidad. El primer registro crea historial con valor anterior nulo; la actualización agrega valor anterior/nuevo y actor, incluso cuando se modifica observación.
3. `ScoreHistory` es inmutable por los eventos de modelo y no hay endpoints de edición/borrado del historial. No se promete inmutabilidad frente a SQL administrativo externo a Eloquent.
4. `LearningAudit` registra GRADE/SCORE_UPDATE y metadatos sin incluir valores de nota, observaciones ni motivos libres en `audit_logs`. Los valores y motivos quedan en `score_history`, cuya lectura exige autorización sobre la nota.
5. Nota, historial y auditoría se guardan en la misma transacción; el test de rollback existente comprueba preservación ante fallo de auditoría. Se identificó, pero no se ejecutó en esta auditoría.

## Integración con Aula Virtual y experiencia de consulta

`frontend/src/App.tsx` mantiene `/virtual/assessments`, `/virtual/scores`, `/virtual/courses/:courseId/:section?`, `/app/my-assessments`, `/app/my-scores` y detalle institucional de cursos. `VirtualCourse` comprueba acceso al curso en servidor antes de mostrar `CourseLearning`. `virtualSectionsFor` y `courseTabs` comparten criterio de visibilidad.

Con permisos habituales, Calificaciones usa el panel de evaluaciones y abre sus notas. Para estudiante con `scores.view` sin `assessments.view`, M-01 conserva un enlace explícito a Mis notas globales, sin descargar evaluaciones no autorizadas. M-03 ya ofrece estados de evaluación al personal autorizado; no se propone duplicar ese filtro. El estudiante/apoderado no recibe controles administrativos por esta integración.

`ScoreForm` tiene labels, límites numéricos, motivo de corrección y estado ocupado. `LearningPanel` tiene error/reintento, carga, vacío y paginación; la tabla permite scroll horizontal. Hay límites concretos: la tarjeta de evaluación no presenta todos los datos de configuración disponibles y el historial muestra `Usuario #id`, no un nombre; el paginado de historial no limpia error previo ni activa nuevamente carga al pasar de página. `CourseLearning` mantiene roles de pestañas sin relaciones ARIA completas ni navegación de flechas. Son hallazgos estáticos; no se afirma que se reprodujeron fallos de navegador o que se certificó accesibilidad.

## Relación con los 24 RF existentes

No se crean RF adicionales ni se reemplaza la matriz de cumplimiento del proyecto. Se distingue el procedimiento educativo amplio del alcance concreto de los RF que la fuente declara implementados.

| RF del catálogo | Relación con PM-03 |
| --- | --- |
| RF-01 Autenticación, RF-02 Cierre de sesión | Transversales a acceso y protección de datos |
| RF-03 Gestión de usuarios, RF-04 Roles y permisos | Cuentas y capacidades de los actores; no justifican dar notas al apoderado como docente |
| RF-05 Información del estudiante, RF-06 Matrículas, RF-07 Consulta de matrícula | Dependencias de identidad y elegibilidad; no se modifican |
| RF-08 Gestión de calificaciones | Directo PM-03.2 y trazabilidad por nota |
| RF-09 Consulta de calificaciones | Directo PM-03.3/PM-03.4, con visibilidad personal y resumen familiar acotados |
| RF-10 Gestión de actividades académicas | Directo PM-03.1 y publicación/cierre de evaluación en PM-03.3 |
| RF-11 Materiales, RF-12 Entrega de actividades | Adyacentes; no son notas ni publicación de resultados |
| RF-13 Gestión de asistencia, RF-14 Consulta de asistencia, RF-15 Justificaciones | Fuera del alcance directo de evaluación |
| RF-16 Solicitudes, RF-17 Seguimiento de solicitudes, RF-18 Documentos académicos | Adyacentes; no prueban existencia de boletín calculado |
| RF-19 Comunicaciones, RF-20 Notificaciones | Subsistemas existentes; no se identifica requisito/ejecución de aviso automático al registrar nota |
| RF-21 Portal del padre/apoderado | Consulta de cinco notas recientes vinculadas; no expediente completo |
| RF-22 Aula virtual | Contexto de configuración, escritura y consulta personal |
| RF-23 Reportes | Consulta institucional y CSV por estudiante/curso/periodo, reutilizable en PM-03.4 |
| RF-24 Auditoría | Transversal a cambios de notas y publicaciones; complementa historial por nota |

## Pruebas identificadas y fuerza de evidencia

**Ninguna suite fue ejecutada en esta fase.** Las siguientes son definiciones existentes y cobertura por inspección, no resultados aprobados actuales.

| Archivo | Cobertura identificada | Límite |
| --- | --- | --- |
| `backend/tests/Feature/Sprint7Test.php` | Diez casos de aprendizaje en total; incluye `records a valid score only for approved students and rejects duplicates and non teacher grading`, `rejects scores outside zero to twenty and mismatched academic periods`, `blocks ordinary grading in locked periods and closed assessments`, `preserves previous scores reason and actor with atomic audit rollback`; también IDOR de nota/historial y referencias de institución ajena | No todos los diez casos son de notas. No se identificó escenario explícito de consulta de nota/historial después de cerrar evaluación ni toda la semántica de publicación de resultados |
| `backend/tests/Feature/Sprint10Test.php` | Cinco casos de consolidación: familias de reportes/filtros/paginación, aislamiento/propiedad, CSV seguro, privacidad de dashboards familiar/estudiantil y conteos adyacentes | No es un test de boletín oficial ni de historial longitudinal familiar |
| `backend/tests/Feature/Sprint2Test.php` | Periodos/años, fechas, cierre, permisos, aislamiento y auditoría | Casos parametrizados: no se equipara número de expresiones `it` con casos ejecutados |
| `backend/tests/Feature/Sprint5Test.php` | Curso, docente asignado, matrícula aprobada, revocación e IDOR | Dependencia de acceso, no prueba de publicación separada de notas |
| `e2e/cypress/e2e/learning.cy.ts` | Tres flujos; el tercero crea/publica evaluación, registra 17,50 y el alumno consulta su nota sin modificarla | API real; no cubre corrección con motivo ni historial de nota en UI |
| `e2e/cypress/e2e/virtual.cy.ts` | Tres casos de navegación/sesión/roles y curso no autorizado, con PC/tablet/móvil | API real; no certifica toda la usabilidad de registro de notas |
| `e2e/cypress/e2e/reports.cy.ts` | Dos casos de dashboard, filtros/CSV/responsive y límites familiares | API real; no demuestra boletín de notas |
| `e2e/cypress/e2e/academic.cy.ts` | Cuatro casos de catálogos/periodos, fechas/cierre y consulta docente | API real; algunos escriben datos de prueba |
| `e2e/cypress/e2e/virtual-access.cy.ts` | Nueve casos generados: incluye estudiante con solo notas y roles habituales/mixtos | API simulada; no autoriza realmente contra Laravel |
| `e2e/cypress/e2e/learning-filters.cy.ts` | Diez casos: uno verifica filtro de evaluaciones y otros la separación de permisos/estudiantes | API simulada; no prueba SQL ni cambios de nota |

Los tres Cypress de evaluación/regresión real mencionados primero requieren preparación aislada y no deben lanzarse contra datos que deban conservarse. Si se decide ejecutar Pest en una fase posterior, respetar `backend/AGENTS.md`: exclusivamente MySQL `zarate_test` y usuario `zarate_test`, sin config cacheada y verificando aislamiento antes de cualquier fixture. En esta fase no se comprobó su disponibilidad. Los 63 aprobados del cierre anterior pertenecen a BOLT-MIS-003 y no son resultados de esta auditoría.

## Hallazgos verificables y riesgos a validar

| ID | Hallazgo y respaldo | Clasificación | Consecuencia y recomendación |
| --- | --- | --- | --- |
| E-01 | `ScoreService` requiere PUBLISHED para escribir; `LearningAccess` muestra la nota inmediatamente. La migración `scores` no define publicación propia | Mecanismo confirmado por código; adecuación a PM-03.3 **NO VERIFICADA** | Confirmar si publicar evaluación equivale a liberar resultados. No añadir estado/endpoint nuevo por suposición |
| E-02 | `LearningAccess` y `StudentSummary` filtran evaluación PUBLISHED y cursos elegibles. Sprint 7 declara retirada al cerrar | Límite funcional documentado, no regresión nueva | Verificar que el colegio espera esa retirada y cubrir consulta tras cierre/revocación. No “corregir” política sin decisión institucional |
| E-03 | `StudentSummary` usa `limit(5)`; `ScoreHistory` es por una nota, no expediente completo; reportes quedan en personal autorizado | Correspondencia parcial de PM-03.4, RF existentes acotados | Describir alcance en interfaz/documentación antes de considerar un historial más amplio; no construir libreta oficial fuera del alcance |
| E-04 | `LearningForm` envía `evaluation_date`; `LearningRequest` valida formato y `LearningService` no exige que esté dentro del periodo. El selector ofrece periodos que no necesariamente admiten calificar | Validaciones observadas; regla pedagógica de fechas **NO VERIFICADA** | Acordar regla y mejorar orientación de periodos bloqueados sin inventar un calendario de prohibiciones |
| E-05 | `LearningPanel` muestra título/estado/descripción de evaluación pero no aprovecha todos los metadatos existentes; historial muestra actor numérico y no reinicia error/carga al paginar | Limitación estática de usabilidad | Priorizar contexto de periodo/escala/tipo/fecha y recuperación de historial. Verificar primero contrato de datos; reutilizar componentes/endpoints |
| E-06 | `CourseLearning` tiene roles tab/tablist/tabpanel sin asociaciones ARIA completas ni flechas. Formulario de notas sí tiene etiquetas y límites | Deuda de accesibilidad comprobada por código; impacto práctico **NO VERIFICADO** | Pruebas de teclado/foco y móvil para evaluación y nota; no declarar conformidad WCAG por un test de ancho |
| E-07 | Tests identificados no cubren de forma explícita todas las combinaciones escala menor a 20, consulta tras cierre y corrección/historial paginado en navegador | Brecha de cobertura, no fallo de negocio demostrado | Añadir pruebas focalizadas en fase autorizada y preservar las reglas/rollback actuales |
| E-08 | No hay editor de tipos, promedio ponderado calculado, boletín automático ni publicación por lote encontrados; la documentación los excluye o no los exige | Capacidad adicional no implementada; necesidad **NO VERIFICADA** | No priorizar módulos nuevos sin un RF o caso institucional aprobado; reutilizar tipos actuales/reportes CSV |

No se confirmó una vulnerabilidad explotable ni una corrupción de datos mediante ejecución. Se observaron controles relevantes en código, pero no se declara seguridad integral ni ausencia de defectos por no haber ejecutado pruebas.

## Recomendaciones priorizadas, sin implementación

1. **P1 — Precisar publicación y conservación histórica.** Resolver E-01/E-02/E-03 con el responsable: qué se publica, cuándo se ven cambios y qué debe conservar el estudiante/apoderado al cerrar. Entregable mínimo: contrato de estados y trazabilidad contra RF-09/10/21, sin modificar aún esquema ni permisos.
2. **P1 — Preparar validación aislada y cubrir riesgos de notas.** Reutilizar Pest Sprints 7/10 y Cypress de aprendizaje/aula; añadir posteriormente casos de escala propia, motivo/historial y lectura después de cierre, incluyendo instituciones, docente ajeno y familiares no vinculados. Diferenciar fixtures simuladas de API real y registrar resultados reales.
3. **P2 — Mejorar contexto y errores de evaluación/nota.** Hacer legibles periodo, escala, tipo y razones de bloqueo usando datos existentes; mejorar carga/recuperación del historial y actor mostrado cuando el contrato lo permita. No duplicar filtros M-03 ni el manejo de autorización.
4. **P2 — Completar accesibilidad básica y validar responsive.** Teclado/foco de pestañas, relaciones ARIA, etiquetas y navegación por tabla/formulario/historial. Probar el flujo completo, sin rediseñar el aula por motivos cosméticos.
5. **P3 — Considerar ampliaciones solo con alcance aprobado.** Si se requiere realmente publicación independiente o expediente longitudinal/boletín, documentar primero la diferencia con lo ya existente y el RF aplicable. Su ausencia no autoriza automáticamente nuevas tablas, roles, promedios o módulos.

## Resultado y control documental

Resumen de correspondencia: PM-03.1 **IMPLEMENTADO**; PM-03.2 **IMPLEMENTADO**; PM-03.3 **PARCIAL** como publicación independiente de resultados; PM-03.4 **PARCIAL** como historial académico integral. Los dos últimos ya tienen mecanismos útiles implementados y su alcance institucional ampliado sigue **NO VERIFICADO**. Todas las ejecuciones funcionales actuales quedan **NO VERIFICADAS**.

Se entrega matriz por procedimiento, trazabilidad con los 24 RF, inventario de funcionalidades y contratos, pruebas identificadas y recomendaciones. La única comprobación ejecutada de formato es `git diff --check`, complementada con revisión directa de los archivos nuevos sin seguimiento; no es una prueba funcional. Los cambios de esta fase se limitan a `prompt-01-auditoria.md` y `diagnostico.md` dentro de BOLT-MIS-004. No se hizo commit, push, merge o Pull Request.
