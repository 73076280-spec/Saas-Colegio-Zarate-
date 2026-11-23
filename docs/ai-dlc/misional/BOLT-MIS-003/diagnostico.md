# BOLT-MIS-003 — Diagnóstico de enseñanza-aprendizaje

Fecha: 28/10/2026. Sistema: EcoAula SaaS, Colegio Zárate de Huancayo. Auditoría documental y estática del repositorio `D:\zarate-saas`.

## Alcance y evidencia

Se verificó la rama `feature/ensenanza-aprendizaje`, HEAD `e1b64e3`. `git status --short` no mostró cambios al iniciar. Se consultaron las instrucciones de `backend/AGENTS.md`. Esta entrega crea exclusivamente los dos documentos de BOLT-MIS-003; no cambia componentes, lógica, roles, permisos, migraciones ni otros módulos.

Se inspeccionaron documentación, rutas, modelos, servicios, Policies, validación, recursos API, componentes y definiciones de pruebas. No se ejecutaron Pest, Cypress, Pint, build ni TypeScript, ni se recorrió una sesión de navegador. Por tanto, la ejecución actual y el comportamiento visual son **NO VERIFICADO**. No se iniciaron servicios ni se consultaron datos personales o archivos de configuración con secretos.

Convenciones para los estados:

- **IMPLEMENTADO**: existe código coherente con el alcance y pruebas definidas que respaldan el flujo. No equivale a ejecución aprobada en esta auditoría.
- **PARCIAL**: existe soporte, pero la correspondencia con el procedimiento presenta una brecha explícita.
- **PENDIENTE**: capacidad concreta no encontrada dentro de las fuentes revisadas y cuya necesidad debe confirmarse antes de implementarla.
- **NO VERIFICADO**: falta evidencia suficiente o ejecución actual. Se aplica también a hipótesis de defectos hasta reproducirlas.

## Base documental de los Sprints 1–10

| Fuente | Aporte al diagnóstico |
| --- | --- |
| `docs/sprints/sprint-1.md` | Autenticación Sanctum, contexto institucional, roles, autorización y auditoría; base transversal de PM-02 |
| `docs/sprints/sprint-2.md` | Años, periodos, niveles, grados, secciones y asignaturas; no define un catálogo específico de áreas académicas |
| `docs/sprints/sprint-3.md` | Docentes y estudiantes vinculados a usuarios; apoderados y relaciones familiares |
| `docs/sprints/sprint-4.md` | Matrícula aprobada como fuente de elegibilidad; no se propone modificarla |
| `docs/sprints/sprint-5.md` | Asignaciones docentes, cursos y roster derivado de matrícula; la mención de aula informativa corresponde a ese sprint, anterior a los Sprints 6–7 |
| `docs/sprints/sprint-6.md` | Unidades, materiales de archivo/enlace/texto, publicación, archivo y privacidad |
| `docs/sprints/sprint-7.md` | Tareas, entregas, revisión, devolución, evaluaciones, notas e historial; no incluye promedio automático |
| `docs/sprints/sprint-8.md` | Asistencia integrada por curso; proceso adyacente, fuera de los cuatro procedimientos auditados |
| `docs/sprints/sprint-9.md` | Comunicaciones y notificaciones internas existentes; no demuestra avisos automáticos de publicación de tareas |
| `docs/sprints/sprint-10.md` | Consolidación, dashboards, reportes y cierre; registra avisos React de claves duplicadas sin atribuirlos a estos componentes |
| `docs/aula-virtual-fase-1.md` | Separación `/virtual` y `/app`, sesión compartida, permisos, componentes reutilizados y validación histórica focalizada |
| `docs/requirements-status.md`, `docs/traceability.md` | Definiciones RF-01 a RF-24 y cobertura declarada; no se inventan RF adicionales |

La documentación de Aula Virtual registra históricamente 34 casos Pest de Sprints 5–7 y 28 Cypress de varias suites, con reejecución focalizada de 15 casos. El cierre de Sprint 10 registra 311 Pest y 42 Cypress. Son alcances y momentos diferentes: no se suman entre sí ni se presentan como resultados nuevos. No se validaron los logs históricos durante esta auditoría.

## Matriz de diagnóstico por procedimiento

### PM-02.1 — Asignar docentes a áreas académicas

| Campo | Diagnóstico |
| --- | --- |
| Objetivo | Organizar la responsabilidad docente en el contexto académico institucional |
| Actor principal | Administración con permisos `teacher-assignments.*`; Secretaría dispone de consulta según el seeder |
| Entradas | Docente y asignatura activos, año no cerrado, grado/nivel activos, sección coherente con año y grado |
| Actividades | Consultar catálogos; crear, consultar y actualizar asignación; deshabilitar/reactivar respetando cursos activos; crear y activar curso asociado |
| Salidas | `TeacherAssignment` ACTIVE/INACTIVE, curso vinculado y auditoría de las operaciones |
| RF relacionados | RF-22 como soporte del aula; RF-04 y RF-24 transversales; RF-05 y RF-06 como dependencias. Los 24 RF no contienen uno explícito llamado asignación docente |
| Frontend | `frontend/src/courses/TeachingPage.tsx`, `TeachingForm.tsx`; rutas en `frontend/src/App.tsx`: `/app/teacher-assignments`, `/app/courses`, `/app/my-courses` |
| Backend | `backend/app/Http/Controllers/Api/TeachingController.php`, `TeachingOptionsController.php`; `Http/Requests/Courses/TeachingRequest.php`, `TeachingListRequest.php`; `Services/Courses/TeachingService.php`, `CourseAccess.php`; `Models/Courses/TeacherAssignment.php`, `Course.php`; `Policies/CoursePolicy.php`, `TeacherAssignmentPolicy.php` |
| Endpoints | GET/POST `/api/v1/teacher-assignments`; GET/PATCH `/api/v1/teacher-assignments/{id}`; POST `/{id}/disable`; GET `/api/v1/teaching-options`; endpoints de cursos detallados más abajo |
| Estado funcional | **PARCIAL** frente a la denominación literal: la asignación a **asignaturas** está implementada, pero no se identificó entidad ni relación específica de **área académica**. Si área equivale formalmente a asignatura, el flujo existente satisface esa interpretación; no se asume esa equivalencia |
| Evidencias | `TeachingService::coherent` valida referencias; `save` evita equivalentes y protege estructura vinculada; `Sprint5Test.php` cubre asignaciones, coherencia, docentes distintos, cursos e aislamiento; `courses.cy.ts` cubre creación y activación |
| Mejora recomendada | Acordar y documentar área versus asignatura antes de proponer datos nuevos. Mejorar etiquetas y contexto de la asignación reutilizando formularios y catálogos existentes |

### PM-02.2 — Planificar actividades de aprendizaje

| Campo | Diagnóstico |
| --- | --- |
| Objetivo | Preparar y organizar actividades de un curso antes de publicarlas |
| Actor principal | Docente asignado o Administración, con permisos efectivos sobre el curso |
| Entradas | Curso, unidades opcionales, título, descripción, instrucciones, fecha límite y aceptación de entregas tardías; para evaluaciones, periodo, tipo, escala, peso opcional y fecha |
| Actividades | Crear y ordenar unidades; crear/editar tareas y evaluaciones en borrador; asociar una tarea a una unidad del mismo curso; publicar y cerrar |
| Salidas | Unidades organizadas, tareas/evaluaciones persistidas y trazabilidad de cambios |
| RF relacionados | RF-10 directo; RF-11 y RF-22 para organización por unidades; RF-08 en evaluaciones y RF-24 transversal |
| Frontend | `frontend/src/classroom/Classroom.tsx`, `ClassroomForm.tsx`; `frontend/src/learning/LearningForm.tsx`, `LearningPanel.tsx`, `CourseLearning.tsx`, `shared.tsx` |
| Backend | `backend/app/Services/Learning/LearningService.php`, `LearningAccess.php`, `LearningAudit.php`; `Services/Classroom/ClassroomService.php`; `Models/Learning/Assignment.php`, `Assessment.php`; `Models/Classroom/CourseUnit.php`; `Http/Requests/LearningRequest.php`; `Http/Controllers/Api/LearningController.php` |
| Endpoints | GET/POST `/api/v1/courses/{course}/units`, `/assignments`, `/assessments`; PATCH `/api/v1/course-units/{id}`, `/assignments/{id}`, `/assessments/{id}`; GET `/api/v1/courses/{course}/assessment-periods` y `/assessment-types` |
| Estado funcional | **IMPLEMENTADO** para la planificación definida en RF-10 mediante unidades, borradores, fechas e instrucciones. No se acredita un plan curricular formal con competencias o sesiones; su necesidad adicional es **NO VERIFICADO**, no un incumplimiento automático de RF-10 |
| Evidencias | `LearningForm` ofrece los campos; `LearningService` comprueba unidad del mismo curso y periodo del año; `Sprint6Test.php` y `Sprint7Test.php`; creación de tareas/evaluaciones en `learning.cy.ts` |
| Mejora recomendada | Facilitar consulta por estado y contexto de unidad sin duplicar el CRUD. Confirmar requisitos de planificación pedagógica formal antes de ampliar el modelo |

### PM-02.3 — Publicar materiales y tareas

| Campo | Diagnóstico |
| --- | --- |
| Objetivo | Habilitar contenido académico autorizado a estudiantes matriculados |
| Actor principal | Docente asignado o Administración con permiso de publicación |
| Entradas | Unidad/material/tarea en borrador, curso activo; archivo validado, URL HTTP/HTTPS o texto según tipo |
| Actividades | Crear/editar, publicar unidad y material, publicar tarea; consultar contenido y descargar archivos privados; archivar material/unidad o cerrar actividad |
| Salidas | Contenido publicado y visible según autorización, metadatos de publicación y auditoría |
| RF relacionados | RF-10, RF-11 y RF-22 directos; RF-01, RF-04 y RF-24 transversales |
| Frontend | `frontend/src/classroom/Classroom.tsx`, `ClassroomForm.tsx`; `frontend/src/learning/LearningPanel.tsx`; `frontend/src/virtual/VirtualPages.tsx`, `access.ts` |
| Backend | `backend/app/Http/Controllers/Api/ClassroomController.php`, `LearningController.php`; `Services/Classroom/ClassroomService.php`, `ClassroomAccess.php`, `MaterialFiles.php`; `Policies/ClassroomPolicy.php`, `LearningPolicy.php`; `Models/Classroom/Material.php` |
| Endpoints | POST `/api/v1/course-units/{id}/publish`, `/materials/{id}/publish`, `/assignments/{id}/publish`; GET `/api/v1/courses/{course}/materials`; GET `/api/v1/materials/{id}/download`; POST `/course-units/{id}/archive`, `/materials/{id}/archive`, `/assignments/{id}/close` bajo `/api/v1` |
| Estado funcional | **IMPLEMENTADO**; la publicación y el almacenamiento privado ya existen. La ejecución actual es **NO VERIFICADO** |
| Evidencias | `ClassroomService` requiere curso activo para publicar y unidad publicada para material vinculado; `ClassroomAccess` oculta borradores y materiales de unidades no publicadas al estudiante; `Sprint6Test.php`, `Sprint7Test.php`, `classroom.cy.ts`, `learning.cy.ts` |
| Mejora recomendada | Hacer visibles en la interfaz las condiciones que impiden publicar y añadir filtros que reutilicen los contratos disponibles; no crear otra API de materiales ni publicación |

### PM-02.4 — Recibir y revisar tareas

| Campo | Diagnóstico |
| --- | --- |
| Objetivo | Recibir evidencias del estudiante y permitir revisión y retroalimentación trazables |
| Actor principal | Estudiante para entrega; docente asignado o Administración autorizada para revisión |
| Entradas | Tarea publicada, matrícula aprobada del estudiante, respuesta o archivo, fecha límite y política de tardanza; feedback y resultado de revisión |
| Actividades | Entregar/editar último intento no revisado, consultar/descargar, revisar o devolver; generar nuevo intento tras devolución |
| Salidas | Entrega SUBMITTED/LATE, revisión REVIEWED/RETURNED, feedback, revisor y fecha; intentos previos conservados |
| RF relacionados | RF-12 directo; RF-10 y RF-22 de contexto; RF-06 como dependencia de acceso y RF-24 transversal. RF-08/09 se gestionan mediante evaluaciones/notas, no se debe equiparar revisión de entrega con calificación automática |
| Frontend | `frontend/src/learning/SubmissionForm.tsx`, `LearningPanel.tsx`, `shared.tsx`; acceso desde curso o vistas personales de `frontend/src/App.tsx` |
| Backend | `backend/app/Services/Learning/SubmissionService.php`, `LearningAccess.php`, `LearningAudit.php`; `Policies/LearningPolicy.php`; `Http/Controllers/Api/LearningController.php`; `Http/Requests/LearningRequest.php`; `Http/Resources/LearningResource.php`; `Models/Learning/Submission.php` |
| Endpoints | GET/POST `/api/v1/assignments/{assignment}/submissions`; GET/PATCH `/api/v1/submissions/{id}`; POST `/api/v1/submissions/{id}/review`; GET `/api/v1/submissions/{id}/download`; GET `/api/v1/my/submissions` |
| Estado funcional | **IMPLEMENTADO** para recepción, revisión, feedback y reintentos; mejora de usabilidad de bandeja y anticipación de restricciones pendiente de priorización, sin negar el flujo existente |
| Evidencias | `SubmissionService` aplica bloqueo/transacción, plazos, intento incremental y devolución previa; `LearningRequest` exige feedback al revisar; `Sprint7Test.php` cubre privacidad, reintentos, tardanza, cierre y revocación; `learning.cy.ts` define entrega y revisión |
| Mejora recomendada | Exponer filtros de entregas por estado y reducir rechazos evitables por plazo; preservar los intentos y el endpoint de revisión actual |

## Relaciones académicas y reglas de acceso

`Teacher` y `Student` vinculan los perfiles académicos con `User`. `TeacherAssignment` relaciona docente, asignatura, año, grado y sección. `Course` contiene esas mismas referencias y pertenece a la asignación. `TeachingService` exige una asignación activa coincidente para cursos habilitados; `Course::booted` comprueba la coherencia al guardar. Los identificadores estructurales del curso y la asignación ya vinculada se protegen frente a reasignaciones que alteren el historial. No se deshabilita una asignación mientras mantenga cursos activos.

No hay una nueva inscripción por curso: `CourseAccess::studentQuery` deriva acceso de matrícula APPROVED del mismo año, grado, sección e institución, con curso y asignación activos. `CourseAccess::roster` consulta matrículas aprobadas del contexto del curso. Las unidades y materiales pertenecen a un curso; una tarea puede pertenecer a una unidad; una entrega pertenece a tarea y estudiante. Las evaluaciones pertenecen a curso, periodo y tipo; las notas pertenecen a evaluación y estudiante y mantienen historial separado.

Todos los endpoints citados pasan por `auth:sanctum`, `institution` y `password.changed` en `backend/routes/api.php`. Los scopes institucionales y las Policies protegen datos; los controles React son complementarios. La descarga de entregas vuelve a autorizar el recurso y utiliza almacenamiento privado con `nosniff` y `private, no-store` en `LearningController::download`.

### Roles y permisos efectivos

| Rol/contexto | Aula Virtual e intervención |
| --- | --- |
| ADMINISTRATOR | Puede entrar si tiene alguna sección habilitada; usa `/courses` cuando posee `courses.view`; gestión de contenido requiere permiso concreto |
| TEACHER | Entrada con sección habilitada; usa `/my/courses`; gestión limitada al docente del curso con perfil y asignación activos más permiso concreto |
| STUDENT | Entrada con sección habilitada; cursos derivados de matrícula aprobada; contenido publicado, entregas propias y notas autorizadas; no gestiona contenido |
| SECRETARY | Consulta institucional de cursos/asignaciones según permisos del seeder; `canEnterVirtual` no incluye este rol por sí solo |
| TREASURY / GUARDIAN | No entran al aula por esos roles; el portal familiar y Tesorería conservan su alcance propio |
| Cuenta con varios roles | Se evalúan roles y permisos acumulados; `studentLearning` excluye modo personal de estudiante si también tiene TEACHER o ADMINISTRATOR |

`frontend/src/virtual/access.ts` requiere ADMINISTRATOR, TEACHER o STUDENT y al menos una sección disponible. Materiales exige `materials.view` y `course-units.view`; tareas exige `assignments.view`; evaluaciones `assessments.view`; notas `scores.view`, con condiciones adicionales según contexto. `VirtualCourse` valida ID y sección y consulta primero `GET /api/v1/courses/{id}`. No se deduce acceso a un curso por la mera posibilidad de abrir `/virtual`.

Permisos existentes identificados en los seeders:

- `CoursePermissionSeeder.php`: `teacher-assignments.view/create/update/disable` y `courses.view/create/update/activate/close`. Secretaría recibe consulta.
- `ClassroomPermissionSeeder.php`: `course-units` y `materials` con `view/create/update/publish/archive`; docente y administración reciben gestión, estudiante consulta.
- `LearningPermissionSeeder.php`: `assignments` y `assessments` con `view/create/update/publish/close`; `submissions.view/review`; `scores.view/create/update`. Estudiante recibe los cuatro permisos de consulta.
- La entrega no usa un permiso inexistente `submissions.create`: `LearningAccess::submit` exige `submissions.view`, estudiante activo y matrícula elegible en una tarea publicada. El servicio añade las restricciones de estado, plazo e intento.

Los seeders definen la configuración prevista; no se consultó la asignación real de permisos de la base actual ni se ejecutaron seeders.

## Rutas y contratos reutilizables

Prefijo API: `/api/v1`. Las rutas reales están en `backend/routes/api.php`.

| Familia | Contratos y uso |
| --- | --- |
| Cursos | GET/POST `/courses`; GET/PATCH `/courses/{id}`; POST `/courses/{id}/activate`, `/close`; GET `/my/courses`, `/teachers/{teacher}/courses`, `/students/{student}/courses`, `/courses/{id}/students` |
| Asignación docente | GET/POST `/teacher-assignments`; GET/PATCH `/teacher-assignments/{id}`; POST `/teacher-assignments/{id}/disable`; GET `/teaching-options` |
| Unidades/materiales | GET/POST `/courses/{course}/units` y `/materials`; GET/PATCH `/course-units/{id}` y `/materials/{id}`; POST `/{publish,archive}` sobre cada recurso; GET `/materials/{id}/download` |
| Actividades | GET/POST `/courses/{course}/assignments` y `/assessments`; GET/PATCH `/assignments/{id}` y `/assessments/{id}`; POST `/{publish,close}`; GET `/my/assignments`, `/my/assessments` |
| Entregas | GET/POST `/assignments/{assignment}/submissions`; GET/PATCH `/submissions/{id}`; POST `/submissions/{id}/review`; GET `/submissions/{id}/download`, `/my/submissions` |
| Evaluación/notas adyacentes | GET `/courses/{course}/assessment-types`, `/assessment-periods`; GET/POST `/assessments/{assessment}/scores`; GET/PATCH `/scores/{id}`; GET `/scores/{id}/history`, `/my/scores` |

En las filas anteriores, `{publish,archive}` y `{publish,close}` son abreviaciones de rutas independientes, no segmentos literales. El filtro `status` y la paginación de aprendizaje ya están validados por `LearningRequest` y aplicados en `LearningController::index`; el frontend solo envía página en `LearningPanel`.

La navegación independiente tiene dashboard `/virtual`, cursos `/virtual/courses`, detalle `/virtual/courses/:courseId` y secciones `classroom`, `assignments`, `assessments`, `scores`. Las entradas generales `/virtual/materials`, `/assignments`, `/assessments`, `/scores` eligen curso para personal docente/administrativo y usan vistas personales cuando corresponde al estudiante. Las rutas históricas `/app/courses`, `/app/my-courses`, `/app/my-assignments`, `/app/my-submissions`, `/app/my-assessments` y `/app/my-scores` se conservan.

## Estados y comprobación estática del ciclo

| Recurso | Ciclo y condiciones encontradas |
| --- | --- |
| Curso | DRAFT, ACTIVE, INACTIVE, CLOSED. Activación desde borrador/inactivo, cierre inmutable y comprobación de referencias vigentes |
| Unidad/material | DRAFT → PUBLISHED; archivo a ARCHIVED con conservación de historial. Publicación requiere curso activo; material de unidad requiere padre publicado. Contenido archivado no se modifica |
| Tarea/evaluación | Creación DRAFT, publicación desde DRAFT, cierre CLOSED; el servicio rechaza modificación de cerrado y exige curso activo. El cierre no exige exclusivamente estado PUBLISHED: puede cerrar también un borrador |
| Entrega | SUBMITTED o LATE según plazo; tardanza solo si la tarea la admite; respuesta o archivo requerido. Solo último intento SUBMITTED/LATE editable; nuevo intento requiere último RETURNED |
| Revisión | SUBMITTED/LATE → REVIEWED o RETURNED, con feedback obligatorio, actor y fecha. El servicio exige curso activo, pero no comprueba que la tarea siga PUBLISHED para revisar; debe acordarse si revisar después del cierre es la política deseada |
| Notas | Evaluación/periodo habilitados para escritura y reglas de escala; historial separado. La devolución de una entrega no genera automáticamente una nota |

Publicación, cierre e intentos tienen reglas en servidor, no solo botones. Las cuatro consultas de estados, la carga de archivos y las transacciones se verificaron por inspección; ninguna respuesta HTTP se comprobó en vivo en esta sesión.

## Comparación con los 24 requerimientos funcionales

Se conserva la nomenclatura de `docs/requirements-status.md`. La relación siguiente no crea requisitos nuevos ni reclasifica como incompletos los 24 RF que esa fuente declara implementados. El diagnóstico se limita a PM-02; las dependencias externas no se reauditan íntegramente.

| RF | Nombre | Relación con PM-02.1–PM-02.4 |
| --- | --- | --- |
| RF-01 | Autenticación de usuarios | Transversal a los cuatro procedimientos; sesión requerida |
| RF-02 | Cierre de sesión | Transversal; conservar sesión entre espacios hasta cierre explícito |
| RF-03 | Gestión de usuarios | Dependencia de cuentas docentes/estudiantiles; no es asignación académica |
| RF-04 | Gestión de roles y permisos | Transversal a los cuatro; autorización de gestión y consulta |
| RF-05 | Gestión de información del estudiante | Dependencia de identidad y perfil para roster/entregas |
| RF-06 | Gestión de matrículas | Dependencia de acceso aprobado; no se modifica en PM-02 |
| RF-07 | Consulta del estado de matrícula | Contexto de elegibilidad, fuera del flujo directo de enseñanza |
| RF-08 | Gestión de calificaciones | Adyacente a planificación de evaluaciones y revisión; no equivale a feedback de entrega |
| RF-09 | Consulta de calificaciones | Salida académica adyacente para estudiante; ya implementada |
| RF-10 | Gestión de actividades académicas | Directo PM-02.2 y PM-02.3; contexto de PM-02.4 |
| RF-11 | Gestión de materiales académicos | Directo PM-02.3; organización mediante unidades en PM-02.2 |
| RF-12 | Entrega de actividades | Directo PM-02.4, incluidos revisión, devolución e intentos |
| RF-13 | Gestión de asistencia | Adyacente por curso; fuera de estos cuatro procedimientos |
| RF-14 | Consulta de asistencia | Fuera del alcance directo |
| RF-15 | Justificación de inasistencias | Fuera del alcance directo |
| RF-16 | Gestión de solicitudes académicas | Fuera del alcance directo |
| RF-17 | Seguimiento de solicitudes | Fuera del alcance directo |
| RF-18 | Gestión de documentos académicos | Fuera del alcance directo; no confundir documentos institucionales con materiales del aula |
| RF-19 | Gestión de comunicaciones | Adyacente; no acredita notificación de tareas automática |
| RF-20 | Gestión de notificaciones | Adyacente; subsistema existente, sin ampliar su alcance en esta auditoría |
| RF-21 | Portal del padre/apoderado | Adyacente; no otorga entrada al Aula Virtual |
| RF-22 | Aula virtual | Directo PM-02.2–PM-02.4 y soporte de cursos/asignación de PM-02.1 |
| RF-23 | Generación de reportes | Adyacente; no justifica crear otro reporte durante esta fase |
| RF-24 | Auditoría del sistema | Transversal; operaciones de asignación, contenido, entrega y revisión |

La asignación docente es una capacidad existente de Sprint 5 que soporta RF-22; no hay un RF separado de área académica en el catálogo. La falta de competencias, rúbricas o calendario agregado no se considera incumplimiento de los 24 RF sin una especificación adicional.

## Pruebas identificadas y límites de validación

| Archivo | Casos definidos | Evidencia cubierta por el código de prueba |
| --- | ---: | --- |
| `backend/tests/Feature/Sprint5Test.php` | 12 | Equivalencia de asignación, coherencia académica, activación/cierre, protección de asignación con curso activo, roster aprobado, cancelación de matrícula, instituciones e IDOR, roles y rollback de auditoría |
| `backend/tests/Feature/Sprint6Test.php` | 12 | Unidades ordenadas, publicación de padre/material, texto/enlace/archivo, privacidad, archivos inseguros, roles, instituciones, rollback y paginación |
| `backend/tests/Feature/Sprint7Test.php` | 10 | Publicación/cierre, docente ajeno, visibilidad e IDOR, entrega privada, feedback, devolución/reintentos, plazo/tardanza, notas, periodo cerrado, auditoría y archivos |
| `e2e/cypress/e2e/courses.cy.ts` | 3 | Creación de asignación y curso, activación/cierre, responsive, docente/roster, estudiante aprobado y exclusión del no elegible |
| `e2e/cypress/e2e/classroom.cy.ts` | 3 | Crear/publicar/archivar, descarga privada de estudiante aprobado y ocultamiento de borradores/acceso no elegible |
| `e2e/cypress/e2e/learning.cy.ts` | 3 | Crear/publicar tarea y revisar entrega; estudiante entrega archivo; evaluación y consulta de nota |
| `e2e/cypress/e2e/virtual.cy.ts` | 3 | Sesión entre espacios, PC/tablet/móvil, cursos docentes, administración y denegación de acceso |

Son **34 definiciones Pest y 12 Cypress** directamente relacionadas, no 46 resultados aprobados en esta sesión. Se identifican además `Sprint1Test.php`/`auth.cy.ts` como respaldo de autenticación, `Sprint2Test.php`/`academic.cy.ts` de estructura, `Sprint3Test.php`/`people.cy.ts` de perfiles, `Sprint4Test.php`/`enrollment.cy.ts` de elegibilidad, y Sprints 8–10 como cobertura adyacente. Los seis casos Cypress de matrícula y Centro de Matrículas no se suman al alcance directo de PM-02.

Para una validación posterior, ejecutar primero las pruebas focalizadas existentes con la configuración local aprobada. Pest debe usar exclusivamente MySQL `zarate_test` y usuario `zarate_test` según `backend/AGENTS.md`; no ejecutar migraciones o restablecimientos de base en esta fase. Los specs Cypress realizan escrituras: necesitan un entorno de pruebas preparado. No deben ejecutarse contra datos reales para completar un registro documental. Compilación, tipos, lint y Pint son controles separados de los conteos de casos.

## Hallazgos y riesgos concretos

| ID | Hallazgo y respaldo | Estado de evidencia | Impacto y recomendación |
| --- | --- | --- | --- |
| H-01 | PM-02.1 menciona áreas; `TeachingService::KEYS` y `TeacherAssignment` usan `subject_id`, no área | Brecha semántica comprobada en el modelo revisado; alcance institucional **NO VERIFICADO** | Confirmar equivalencia de términos; no crear un segundo catálogo por interpretación |
| H-02 | `LearningPanel` envía solo página aunque `LearningRequest` y `LearningController::index` soportan filtro `status` | Limitación de interfaz comprobada | Añadir filtros de estado a tareas/entregas reutilizando API; útil para distinguir pendientes de revisión y devueltas |
| H-03 | `LearningAccess::submit` no incorpora plazo ni estado del último intento; el servicio sí los rechaza. `LearningPanel` puede mostrar «Entregar tarea» tras vencer el plazo si no hay entrega o fue devuelta | Discrepancia de capacidad y regla comprobada estáticamente; reproducción visual **NO VERIFICADO** | Anticipar restricción y explicar la causa, manteniendo validación final del servidor; añadir caso E2E de devolución después del plazo |
| H-04 | `courseTabs` exige `assessments.view` para notas de cualquier usuario, mientras `virtualSectionsFor` exceptúa al estudiante de ese requisito | Diferencia entre predicados comprobada; efecto en cuentas con permisos personalizados **NO VERIFICADO** | Unificar criterio de navegación con autorización vigente; probar estudiante con `scores.view` sin `assessments.view`, sin ampliar permisos. Los seeders habituales incluyen ambos y no demuestran fallo actual |
| H-05 | En `TeachingPage`, la inclusión de todo `CourseLearning` del detalle histórico depende de `materials.view` y `course-units.view`, aunque el usuario pudiera tener tareas/evaluaciones | Acoplamiento comprobado; escenario de permisos personalizados **NO VERIFICADO** | Evitar que permiso de materiales bloquee pestañas independientes; conservar un único componente de contenido |
| H-06 | `CourseLearning` declara `tablist`, `tab` y `tabpanel`, pero no vincula IDs con `aria-controls`/`aria-labelledby` ni implementa flechas y roving tabindex | Ausencia comprobada en el componente; auditoría WCAG completa **NO VERIFICADO** | Completar el patrón de pestañas y probar foco/teclado, móvil y lector de pantalla |
| H-07 | `TeachingPage` conserva `result` si una nueva consulta falla; `CourseRoster` también conserva datos previos y no limpia error al recuperarse | Riesgo de información visual obsoleta por inspección; fallo reproducido **NO VERIFICADO** | Distinguir datos previos de respuesta actual y recuperación; probar error seguido de éxito. No es evidencia de fuga institucional |
| H-08 | `SubmissionService` permite revisar con curso activo aunque la tarea esté cerrada; `LearningService` impide nuevas entregas al cerrar | Política de estados comprobada; si constituye defecto **NO VERIFICADO** | Acordar si cierre congela recepción o también revisión; documentar y probar la decisión antes de cambiar reglas |
| H-09 | `LearningPanel` combina cuatro recursos, modos personales y paneles anidados; descargas blob se repiten en `Classroom` y `learning/shared.tsx` | Reutilización y repetición técnica comprobadas | Mantener reutilización; extraer solo utilidades pequeñas si hay un cambio concreto que lo justifique. No reemplazar módulos completos |
| H-10 | No se encontró bandeja general docente en el aula: `VirtualSection` pide seleccionar curso; es una decisión explícita de fase 1 | Capacidad agregada **PENDIENTE** solo si se aprueba como necesidad nueva | Priorizar filtros y acceso por curso antes de considerar API agregada, evitando inventar endpoints o contadores |

Ya existen mensajes de error, carga, vacíos, paginación, reintento en `Classroom`/`LearningPanel`, formularios con etiquetas y layouts adaptables. No se recomienda recrearlos. Su cobertura visual completa y accesibilidad formal no están certificadas por esta inspección. El aviso histórico de claves React de Sprint 10 no se atribuye a una causa concreta sin reproducción.

## Propuesta priorizada de mejoras, sin implementación

| Prioridad | Acción propuesta y motivo | Reutilización y criterio de aceptación |
| --- | --- | --- |
| P1 | Resolver H-01: acordar área académica versus asignatura y el alcance de planificación formal | Glosario y trazabilidad aprobados; no agregar entidades hasta demostrar necesidad. Mantener asignaciones y unidades existentes |
| P1 | Validar y corregir, si se reproducen, H-04/H-05: coherencia de navegación con permisos | Reutilizar `access.ts`, `courseTabs` y Policies; matriz con roles estándar y permisos personalizados; denegación por URL preservada y sin cambio de privilegios |
| P1 | Resolver anticipación de entrega H-03 y política de cierre H-08 | Reutilizar `LearningAccess`, `SubmissionService` y formularios; probar plazo vencido, tardanza, devolución y cierre con contrato explícito; servidor sigue siendo autoridad |
| P1 | Reejecutar la regresión focalizada existente antes de cambios y cubrir los casos nuevos acordados | 34 Pest y 12 Cypress definidos como base, resultados registrados con logs y fecha; añadir pruebas de riesgos, sin duplicar publicación, privacidad y reintentos ya cubiertos |
| P2 | Mejorar organización docente y revisión: filtros de estado para tareas/entregas y contexto de unidad en listados | Consumir `status` existente; reiniciar página al cambiar filtro; mostrar pendiente/revisada/devuelta sin contadores inventados ni otro CRUD |
| P2 | Corregir recuperación de errores y datos obsoletos H-07 | Reutilizar estados actuales; caso de fallo de red, recuperación y consulta vacía sin mostrar datos como actuales tras error |
| P2 | Completar accesibilidad de pestañas y revisar responsive de entrega/revisión | IDs ARIA, foco visible, navegación por teclado y anuncios de estado; comprobación PC/tablet/móvil, sin certificar WCAG solo con ancho de pantalla |
| P2 | Mejorar señales previas a publicar y orientación en estados vacíos | Informar unidad no publicada, curso no activo y pasos siguientes solo si el permiso lo permite; mantener los endpoints y reglas existentes |
| P3 | Evaluar reducción de repetición técnica H-09 y bandeja agregada H-10 solo tras medir necesidad | Utilidades compartidas pequeñas y acceso por curso primero; no crear nuevo panel, esquema de archivos o API global sin justificación |

La recomendación es evolucionar el Aula Virtual existente y su organización, no empezar de cero. No se propone rehacer publicación, tareas, almacenamiento privado, entregas, feedback, intentos o matrícula. Tampoco alterar Centro de Matrículas, asistencia, Tesorería, procesos estratégicos o de apoyo. Las mejoras quedan propuestas para una fase posterior; esta auditoría no las implementa ni publica cambios.

## Control de la entrega documental

Se comprobó la existencia de las rutas completas de archivo citadas, se contaron las definiciones de casos Pest/Cypress indicadas y se revisaron los dos documentos en busca de espacios finales y marcadores de conflicto, sin incidencias. `git diff --check` no informó errores en los archivos versionados; los documentos nuevos se comprobaron adicionalmente porque aún no están en seguimiento. El estado final se limita a `prompt-01-auditoria.md` y `diagnostico.md` dentro de BOLT-MIS-003. No se realizaron commit, push, merge ni Pull Request.
