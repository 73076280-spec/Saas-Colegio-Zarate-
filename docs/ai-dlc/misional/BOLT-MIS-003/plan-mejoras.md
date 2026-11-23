# BOLT-MIS-003 — Validación de brechas y plan de mejoras

Fecha: 28/10/2026. EcoAula SaaS. PM-02 Enseñanza-aprendizaje.

## Alcance y decisión propuesta

Rama comprobada: `feature/ensenanza-aprendizaje`. HEAD al revisar: `cb9b7cf`. El árbol de trabajo estaba limpio. Se conserva sin cambios el diagnóstico previo, que referencia un HEAD anterior, y se contrasta su contenido con el código actual.

Se proponen exactamente tres mejoras: coherencia de navegación con permisos personalizados, orientación de entregas vencidas y filtros docentes por estado. La primera debe implementarse antes que las otras. Ninguna requiere nuevas tablas, endpoints, dependencias, roles o permisos. Todas quedan **PROPUESTAS, PENDIENTES DE APROBACIÓN**, sin implementar.

La validación fue estática, con un sondeo adicional de funciones puras del frontend ejecutado en memoria mediante Node y TypeScript ya instalado. No se ejecutaron Pest, Cypress, build, TypeScript del proyecto ni pruebas de navegador. No se modificaron datos, pruebas o código. No se consultaron secretos ni se realizaron migraciones, commits, push o merge.

## PM-02.1: modelo académico y brecha real

| Relación | Representación real y evidencia |
| --- | --- |
| Institución → asignatura | `backend/app/Models/Academic/Subject.php`; tabla `subjects` con nombre, código, descripción y estado. No tiene `area_id` |
| Nivel → grado → sección | `Models/Academic/EducationLevel.php`, `GradeLevel.php`, `Section.php`; sección también pertenece a año e institución |
| Año → periodos | `Models/Academic/AcademicYear.php`, `AcademicPeriod.php`; cada periodo tiene fechas, secuencia, estado y `grading_open` |
| Docente → asignación | `Models/People/Teacher.php`, `Models/Courses/TeacherAssignment.php`, `TeachingRecord.php`; asignación relaciona docente, asignatura, año, grado y sección |
| Asignación → curso | `Models/Courses/Course.php`; vínculo `teacher_assignment_id`, más las mismas referencias académicas. `Services/Courses/TeachingService.php` exige coincidencia y asignación activa |
| Periodo → evaluación | `Models/Learning/Assessment.php`, `Services/Learning/LearningService.php`; el periodo debe pertenecer al año del curso. La asignación docente se realiza por año/sección, no por periodo |
| Estudiante → curso | `Services/Courses/CourseAccess.php`: acceso derivado de matrícula APPROVED coherente con año, grado y sección, curso y asignación activos; no crea otra inscripción |

Las rutas de modelos abreviadas de esta tabla son relativas a `backend/app/`. Las migraciones relevantes son:

- `backend/database/migrations/2026_10_01_160000_create_academic_structure.php`: estructura, asignaturas, años y periodos.
- `backend/database/migrations/2026_10_02_120000_create_courses_and_teacher_assignments.php`: asignaciones y cursos; unicidad por institución, año, asignatura, grado, sección y docente. Permite distintos docentes mediante registros diferenciados.
- `backend/database/migrations/2026_10_04_100000_create_learning_tables.php`: tareas, entregas, evaluaciones y notas; no convierte los periodos en asignaciones docentes nuevas.

`frontend/src/courses/TeachingForm.tsx` ofrece Docente, Asignatura, Año académico, Grado y Sección; `TeachingPage.tsx` consulta y gestiona los registros. `frontend/src/academic/` contiene el catálogo académico. `backend/routes/api.php` expone GET/POST `/api/v1/teacher-assignments`, GET/PATCH `/api/v1/teacher-assignments/{id}`, POST `/{id}/disable`, `/api/v1/teaching-options` y los contratos de cursos. `TeachingController`, `TeachingRequest`, `TeacherAssignmentPolicy` y `TeachingService` conservan autorización, coherencia y auditoría.

**Conclusión:** la operación de asignar un docente a una asignatura por año, grado y sección está implementada. La búsqueda en modelos, migraciones, componentes y documentación no encontró una entidad de área académica ni una especificación de agrupación área → varias asignaturas. Esto demuestra una diferencia de vocabulario/modelo, pero **no demuestra una operación escolar incumplida**.

La clasificación literal PARCIAL del diagnóstico anterior no basta para ordenar cambios de esquema. Para el alcance codificado de asignación por asignatura, el estado es **IMPLEMENTADO por inspección**, con pruebas existentes sin ejecutar. La equivalencia institucional entre área y asignatura es **NO VERIFICADA**. Si son equivalentes, basta documentar esa correspondencia en BOLT-MIS-003 tras confirmación del responsable. Si área supone agrupación o coordinación distinta, debe aportarse el caso operativo y su alcance antes de decidir una modificación. No se selecciona una mejora funcional de PM-02.1 ni se propone renombrar unilateralmente asignaturas o crear áreas.

## Contraste de navegación y acceso

| Aspecto | Resultado del contraste | Clasificación |
| --- | --- | --- |
| Sesión entre espacios | `frontend/src/App.tsx` contiene ambos layouts dentro del mismo `AuthProvider`; `AppLayout.tsx` enlaza a `/virtual`, `VirtualLayout.tsx` vuelve a `/app` | Implementado por lectura; `virtual.cy.ts` define comprobación no ejecutada |
| Entrada por rol | `virtual/access.ts::canEnterVirtual` requiere ADMINISTRATOR, TEACHER o STUDENT y alguna sección autorizada. SECRETARY, TREASURY y GUARDIAN solos no satisfacen el predicado | Regla vigente, no defecto demostrado |
| Curso y matrícula | `CourseAccess::studentQuery` exige curso/asignación activos y matrícula APPROVED; docentes asignados pueden consultar también información de cursos no activos | Distinción intencional; no ocultar todos los cursos inactivos al docente |
| Notas con permisos personalizados | Un estudiante con solo `scores.view` puede entrar y recibe sección `scores`, pero `courseTabs` elimina esa pestaña al faltar `assessments.view` | Contradicción ejecutada en sondeo de funciones; navegador/API no ejecutados; seleccionada en M-01 |
| Detalle institucional con tareas sin materiales | `TeachingPage.tsx:55` solo monta `CourseLearning` con ambos permisos de materiales, aun cuando `courseTabs` permite tareas con `assignments.view` | Bloqueo deducido directamente de condiciones; no reproducido en navegador; seleccionado en M-01 |
| Curso no autorizado por URL | `VirtualCourse` valida ID y sección, consulta curso antes de renderizar; servidor aplica `CoursePolicy` | Protección existente; no se propone sustituirla |
| Carga/error del curso virtual | `VirtualPages` utiliza `useOffice`; `frontend/src/office/shared.tsx` asocia estado a URL/revisión y devuelve datos nulos ante error | No trasladar automáticamente el riesgo del listado institucional a esta vista |
| Recuperación del listado/roster | `TeachingPage` conserva resultado tras error y `CourseRoster` no limpia error al recibir éxito | Riesgo demostrado por flujo de estado, sin reproducción dinámica. Diferido para mantener tres mejoras |
| Accesibilidad | `CourseLearning.tsx` usa roles de pestañas sin relaciones ARIA entre pestaña/panel ni control de flechas; `VirtualLayout` ya tiene salto al contenido | Limitación estática comprobada, sin certificación WCAG ni prueba de teclado; diferida, no motivo para rehacer el layout |
| Responsive | Tarjetas con grid, contenedores adaptables y specs de PC/tablet/móvil existentes | No se reprodujo desbordamiento ni otro defecto visual actual; no se propone rediseño |

### Sondeo ejecutado, reproducible sin alterar archivos

Se leyeron los archivos reales `frontend/src/virtual/access.ts` y `frontend/src/learning/CourseLearning.tsx`, se transpilaron a CommonJS mediante `typescript.transpileModule` y se evaluaron en un contexto Node `vm`. Los imports ajenos a las funciones se sustituyeron por objetos vacíos; no se llamó a hooks ni se renderizó React. Entradas sintéticas sin datos personales:

| Entrada | Función | Salida observada |
| --- | --- | --- |
| roles `[STUDENT]`, permisos `[scores.view]` | `virtualSectionsFor` | `[scores]` |
| Misma entrada | `canEnterVirtual` | `true` |
| Misma entrada | `courseTabs(user, false)` | `[]` |
| roles `[TEACHER]`, permisos `[assignments.view]` | `courseTabs(user, false)` | `[assignments]` |
| Misma entrada docente | `canEnterVirtual` | `true` |

El proceso terminó con código 0 tras comprobar esos resultados. Es una **comprobación aislada ejecutada del comportamiento actual**, que confirma la discrepancia; no es un caso Pest/Cypress aprobado ni acredita autorización de una sesión real. El bloqueo adicional del docente en el detalle de `TeachingPage` se comprobó por lectura de su condición, no por este sondeo.

## Contraste de planificación, publicación, entrega y revisión

| Comportamiento | Evidencia técnica y conclusión |
| --- | --- |
| Unidades y planificación | `ClassroomService` mantiene secuencias únicas y unidades del curso; `LearningForm` permite borrador, título, descripción, instrucciones, unidad y vencimiento; evaluaciones usan periodo y tipo. PM-02.2 implementado para RF-10; no hay necesidad demostrada de otro planificador |
| Materiales | `ClassroomService` admite FILE/LINK/TEXT, exige unidad publicada cuando corresponde y conserva archivados; `MaterialFiles` valida y almacena en privado. PM-02.3 implementado |
| Publicación | Se publica expresamente desde DRAFT, con curso activo; `published_at` se registra en servidor para tareas y contenido del aula. No se identificó requisito de publicación programada; no se propone añadirla |
| Fechas | `LearningForm` convierte fecha local a ISO y `LearningService` normaliza UTC; `SubmissionService` compara el tiempo del servidor y marca LATE solo si se permite tardanza |
| Botón de entrega vencida | `LearningAccess::submit` no considera vencimiento; `LearningPanel.tsx:58` se basa en capacidad y listado. Tarea publicada vencida sin tardanza y sin intentos puede ofrecer formulario que el servicio rechazará. Inconsistencia de orientación, no omisión de validación de servidor; seleccionada en M-02 |
| Entregas e historial | `SubmissionService` conserva intentos; solo el último SUBMITTED/LATE es editable y un nuevo intento exige RETURNED. No hay evidencia de que deban reconstruirse estos flujos |
| Feedback | `LearningRequest` exige feedback para REVIEWED/RETURNED; se conservan revisor y fecha; `SubmissionForm` y `LearningPanel` muestran revisión y retroalimentación |
| Cierre | `LearningService` impide modificar la actividad CLOSED y `LearningAccess::submit` exige PUBLISHED. La revisión de una entrega en tarea cerrada sigue permitida si el curso está activo y el actor autorizado. Es una política existente sin contradicción con un requisito aportado; no se cambia |
| Organización de revisión | API admite `status`, pero `LearningPanel` solo consulta `?page=`. El docente debe recorrer una mezcla de estados para localizar lo revisable; oportunidad funcional de usabilidad seleccionada en M-03, no fallo de integridad |

PM-02.2, PM-02.3 y PM-02.4 permanecen implementados dentro del alcance especificado. La planificación por competencias, un calendario global, rúbricas, avisos automáticos o una bandeja docente global no se deducen de los RF actuales y quedan fuera de esta selección.

## Pruebas y fuerza de la evidencia

| Comportamiento | Pruebas existentes identificadas | Situación en esta validación |
| --- | --- | --- |
| Asignación/coherencia, activación, matrícula, revocación y roles | `backend/tests/Feature/Sprint5Test.php`: 12 casos; `e2e/cypress/e2e/courses.cy.ts`: 3 | Leídas/identificadas, no ejecutadas |
| Publicación de unidad/material, privacidad, aislamiento y archivos | `backend/tests/Feature/Sprint6Test.php`: 12; `e2e/cypress/e2e/classroom.cy.ts`: 3 | Leídas/identificadas, no ejecutadas |
| Publicación y cierre de tareas | `Sprint7Test.php`, caso `lets assigned teachers manage tasks with audited publication and immutable closure` | Cubierto en definición, no ejecutado |
| Devolución, feedback e intentos | `Sprint7Test.php`, caso `records private submissions review feedback and returned attempts without overwriting history` | Cubierto en definición, no ejecutado |
| Vencimiento, tardanza y tarea cerrada | `Sprint7Test.php`, caso `enforces deadlines late configuration and closed tasks` | Cubierto en servidor en definición; no comprueba el botón visible del navegador; no ejecutado |
| Estudiante propio, IDOR y notas | `Sprint7Test.php`, caso `shows published tasks only to approved students and blocks foreign submission and score IDOR` | Cubierto en definición, no ejecutado |
| Entrega y revisión en UI | `e2e/cypress/e2e/learning.cy.ts`: 3 casos de tarea/revisión, archivo de estudiante y evaluación/nota | No ejecutados; no cubren todos los estados de interfaz propuestos |
| Navegación, sesión y roles habituales | `e2e/cypress/e2e/virtual.cy.ts`: 3 casos | No ejecutados; no cubren las combinaciones personalizadas de M-01 |
| Predicados de permisos personalizados | Sondeo Node descrito arriba | Ejecutado correctamente; confirma discrepancia actual. Sin persistencia de archivos ni datos |
| Filtro docente de entregas, vencimiento visible, ARIA/teclado y revisión posterior al cierre | No se identificó caso específico en los specs focalizados para cada escenario | Brechas de cobertura; no son por sí mismas evidencia de defecto de negocio |

Base definida: 34 Pest de Sprints 5–7 y 12 Cypress de los cuatro specs citados. **Cero casos Pest/Cypress ejecutados en esta sesión**. Las aprobaciones históricas de `docs/aula-virtual-fase-1.md` no se trasladan como resultados actuales. La revisión de backend fue estática, sin conectarse a MySQL. Una ejecución posterior debe respetar `backend/AGENTS.md` y su base exclusiva de pruebas; no se requieren cambios de infraestructura para aprobar este plan.

## M-01 — Coherencia de acceso a contenidos con permisos personalizados

**Prioridad P1, primera a implementar. Procedimientos:** PM-02.2, PM-02.3 y PM-02.4 por el acceso a actividades/materiales/entregas; RF-22 principal, RF-04 transversal y RF-09 para el caso específico de notas, ya incluido en el aula.

**Problema demostrado:** los predicados del menú y del curso difieren en notas de estudiantes; además el detalle histórico oculta todas las actividades si faltan permisos de materiales. Un docente autorizado para tareas puede tener pestaña calculada y acceso virtual, pero carecer del panel equivalente en Gestión Institucional. No se demuestra fuga de datos ni fallo con todos los roles predeterminados.

**Evidencias:** `frontend/src/virtual/access.ts::virtualSectionsFor`, `studentLearning`; `frontend/src/learning/CourseLearning.tsx::courseTabs`; `frontend/src/courses/TeachingPage.tsx:55`; autorización de consulta de notas propias en `backend/app/Services/Learning/LearningAccess.php::visible`. Sondeo de funciones documentado anteriormente.

**Solución mínima propuesta:** usar un criterio compartido para decidir las secciones disponibles, conservando las condiciones específicas para personal docente/administrativo y para estudiante. Montar el contenido del detalle institucional si existe al menos una pestaña autorizada, sin exigir siempre materiales. Para el estudiante, consulta de notas propias ya permitida por servidor no debe depender de conceder `assessments.view`; decidir su ruta de renderizado para consultar notas sin provocar una llamada a un endpoint de evaluaciones no autorizado. No basta con quitar una condición si la pestaña continúa usando una API inaccesible.

**Archivos que se modificarían:** `frontend/src/virtual/access.ts`, `frontend/src/learning/CourseLearning.tsx`, `frontend/src/courses/TeachingPage.tsx` y `frontend/src/virtual/VirtualPages.tsx` solo si requiere adaptar el uso del criterio común; `e2e/cypress/e2e/virtual.cy.ts` y `learning.cy.ts` para los escenarios nuevos. Sin cambios en Policies, seeders o reglas de roles. Evitar importaciones circulares al ubicar el criterio compartido.

**Riesgos:** mezclar permisos de consulta personal con los de gestión; mostrar una pestaña cuyo contenido hace una petición prohibida; modificar accidentalmente asistencia o cuentas con varios roles. Mantener comprobación de curso, capacidades de API y permisos de escritura intactos. La consistencia de navegación no concede acceso de servidor.

**Criterios de aceptación:** estudiante con `scores.view` sin `assessments.view` tiene un recorrido coherente hacia sus notas autorizadas, sin habilitar gestión ni consulta de evaluaciones ajenas; docente con `assignments.view` sin permisos de materiales ve tareas en ambos accesos para su curso; quien no tiene permiso de la sección no recibe enlace ni contenido por URL; roles habituales, perfiles mixtos y retorno `/app` ↔ `/virtual` conservan comportamiento. Cursos ajenos siguen denegados y la consulta de notas usa exclusivamente el alcance autorizado.

**Pruebas necesarias:** extender Cypress con sesión sintética de permisos y respuestas controladas para reproducir las condiciones React sin cambiar roles de base de datos; estas pruebas comprueban navegación, no seguridad del servidor. Conservar y ejecutar los casos reales existentes de acceso e IDOR en Sprints 5–7 y `virtual.cy.ts`. Si se añade una verificación Pest de consulta con permisos mínimos, debe ser una fixture temporal de testing, nunca una alteración de roles existentes; no es necesario cambiar backend para la solución propuesta.

## M-02 — Informar y anticipar restricciones de entrega por vencimiento

**Prioridad P1, después de M-01. Procedimiento:** PM-02.4. RF-12 principal; RF-10 como contexto de tarea y RF-22 como acceso al aula.

**Problema demostrado:** con tarea PUBLISHED, matrícula válida y `submissions.view`, `LearningAccess::submit` puede devolver capacidad verdadera incluso vencido el plazo. En el panel de entregas de esa tarea, ausencia de registros o último RETURNED habilita «Entregar tarea»; el servicio rechaza guardar cuando la fecha venció sin tardanza. Es una interacción evitable, no una aceptación indebida de archivos o datos.

**Evidencias:** `backend/app/Services/Learning/LearningAccess.php::submit`, `SubmissionService.php::save` y `frontend/src/learning/LearningPanel.tsx:58`; `LearningRecord` ya dispone de `due_at` y `allow_late_submission` en `frontend/src/learning/shared.tsx`. El caso Pest de plazos prueba la regla del servidor, no la orientación visual.

**Solución mínima propuesta:** en el panel anidado de entregas donde se dispone de la tarea padre, mostrar el vencimiento y la política de tardanza; impedir iniciar una nueva entrega claramente vencida sin tardanza y explicar el motivo. Revalidar la condición al intentar abrir/enviar el formulario y actualizar el aviso al cruzar el límite mientras la vista permanece abierta. Mantener `abilities.submit` como condición necesaria, nunca sustituirla por el reloj local. La respuesta del servidor sigue siendo definitiva ante desfase horario o cambios posteriores; conservar errores comprensibles y contenido escrito ante rechazo.

**Archivos que se modificarían:** `frontend/src/learning/LearningPanel.tsx`, `SubmissionForm.tsx` si necesita recibir el contexto temporal y `e2e/cypress/e2e/learning.cy.ts`. `shared.tsx` solo si se necesita una utilidad temporal pequeña; el contrato de tarea ya contiene los campos. No cambiar `LearningAccess`, `SubmissionService`, permisos ni la política de revisión/cierre. El alcance mínimo se limita a nueva entrega desde la tarea; edición desde «Mis entregas» sin contexto del padre conserva validación del servidor y queda explícitamente fuera de esta mejora.

**Riesgos:** diferencia entre reloj local y servidor, conversión de zona horaria, límite que vence durante la edición y rechazo por cambio de estado concurrente. No calcular nuevas autorizaciones ni ocultar feedback o intentos anteriores por vencimiento. Definir comparación compatible con la regla actual: `now > due_at`, no `>=`.

**Criterios de aceptación:** antes del plazo puede entregar si se cumplen las reglas actuales; vencida sin tardanza aparece motivo en lugar de un inicio de entrega válido; con tardanza permitida permanece habilitada y se registra LATE según servidor; devolución permite nuevo intento únicamente si siguen vigentes condiciones y plazo; el tiempo puede vencer con la vista abierta; historial y feedback continúan consultables. En errores de red o rechazo final no se inventa éxito ni se pierde silenciosamente la respuesta escrita.

**Pruebas necesarias:** Cypress con reloj controlado para antes/después del límite, formulario abierto al vencer, tardanza permitida y devolución vencida. Conservar ejecución de `Sprint7Test.php` para regla real de plazos y preservación de intentos; añadir la combinación de devolución seguida de vencimiento solo si no queda cubierta por los escenarios existentes. No se propone reescribir las pruebas generales de archivos o calificaciones.

## M-03 — Filtros docentes por estado para actividades y revisión

**Prioridad P2. Procedimientos:** PM-02.2 y PM-02.3 al organizar tareas; PM-02.4 al localizar entregas pendientes de revisión. RF-10 y RF-12, con RF-22 de soporte.

**Problema demostrado:** `LearningPanel` consume solo `?page=`. No permite al docente seleccionar borradores/publicadas/cerradas ni entregadas/tardías/revisadas/devueltas, pese a existir el filtro de servidor. La ausencia es comprobable en el JSX y la construcción de URL; el tiempo perdido por el colegio no se ha medido. Se selecciona como mejora funcional de consulta y revisión, no como incumplimiento de integridad.

**Evidencias:** `frontend/src/learning/LearningPanel.tsx:29–39`; `backend/app/Http/Requests/LearningRequest.php::rules` valida `status` y `backend/app/Http/Controllers/Api/LearningController.php::index` lo aplica antes de paginar. El orden de registros se mantiene descendente por ID.

**Solución mínima propuesta:** selector accesible por estado en las tareas por curso de personal autorizado y en sus entregas anidadas. Incluir «Todos», estados específicos del recurso, envío del filtro a la API existente y reinicio de página/cierre de detalle obsoleto al cambiar consulta. Conservar mensajes de carga, error y vacío y acciones de revisión según capacidades. No filtrar solo la página descargada ni agregar una bandeja global.

**Archivos que se modificarían:** `frontend/src/learning/LearningPanel.tsx`, `e2e/cypress/e2e/learning.cy.ts`; `backend/tests/Feature/Sprint7Test.php` si se añade cobertura específica del contrato `status`. Sin cambio de controladores, validación o API.

**Riesgos:** un listado filtrado vacío o una página antigua no demuestra ausencia de último intento. Limitar esta primera mejora al contexto docente/administrativo de revisión y no introducir filtros en entregas personales del estudiante ni calcular con ellos elegibilidad de nuevo intento. Evitar filtros de estados incompatibles, solicitudes antiguas que sobrescriban nuevas y acciones sobre una entrega ya revisada por otra sesión.

**Criterios de aceptación:** filtro de tareas DRAFT/PUBLISHED/CLOSED y de entregas SUBMITTED/LATE/REVIEWED/RETURNED con opción Todos; petición incluye `status` solo cuando corresponde; cambio vuelve a página 1 y muestra resultado actualizado; filtro vacío tiene mensaje claro y permite volver a Todos; revisión conserva permiso y estado de servidor. No cambia acceso estudiantil, notas, intentos ni API; etiqueta asociada al selector y control usable en móvil.

**Pruebas necesarias:** Cypress verifica parámetros HTTP, reinicio desde página posterior, resultado vacío y retorno a Todos, revisión desde SUBMITTED/LATE y ausencia de controles administrativos al estudiante. Pest puede ampliar un caso focalizado con estados mezclados para comprobar filtrado, paginación y aislamiento institucional; no duplicar los casos ya existentes de revisión y archivos.

## Decisiones que no requieren implementación en este Bolt

- Área académica: no crear tablas ni cambiar el catálogo de asignaturas sin una operación faltante demostrada. Documentar equivalencia solo cuando el responsable la confirme.
- Revisión después del cierre: conservar el comportamiento actual, que puede permitir terminar revisiones después de cerrar recepción. No convertir la ambigüedad pedagógica en una nueva prohibición.
- Accesibilidad de pestañas, recuperación del roster y repetición de descargas: hallazgos conservados para priorización posterior; no se incluyen como mejoras adicionales encubiertas.
- No añadir publicación programada, rúbricas, promedio automático, nuevo plan curricular, notificaciones de tareas o bandeja global docente. No hay requisito nuevo aprobado que los justifique.

## Secuencia y aprobación

Orden recomendado: **M-01 → M-02 → M-03**. M-01 elimina una contradicción de navegación confirmada por ejecución de los predicados y una dependencia indebida de permisos de materiales. M-02 evita iniciar entregas destinadas al rechazo; M-03 mejora la organización de trabajo con una API existente.

Tras aprobación, implementar y validar cada mejora por separado, registrando resultados reales y límites. La lista de archivos anterior expresa alcance propuesto, no autorización para modificarlo ahora. En esta etapa únicamente se crean este plan y el prompt completo; no se inicia implementación ni se alteran Centro de Matrículas o módulos estratégicos/de apoyo.
