# BOLT-MIS-004 — Validación de brechas y plan de mejoras

Fecha: 01/11/2026. EcoAula SaaS — Colegio Zárate de Huancayo. Proceso PM-03 — Evaluación académica.

## Resumen ejecutivo y alcance

Rama comprobada: `feature/evaluacion-academica`, HEAD `ffab7eb`. El estado Git estaba limpio al iniciar. Se revisaron diagnóstico y prompt 01, catálogo de 24 RF, trazabilidad, documentación de Sprint 7/Aula Virtual y código vigente de configuración, notas, historial, autorización, resumen familiar y reportes.

**No hay evidencia que justifique sustituir el módulo existente o modificar automáticamente la visibilidad de notas.** La configuración y el registro están implementados; publicación e historial requieren distinguir la funcionalidad codificada de una interpretación institucional más amplia.

Se seleccionan como máximo tres mejoras, identificadas exclusivamente dentro de **BOLT-MIS-004**:

| Código | Propuesta | Prioridad | Situación |
| --- | --- | --- | --- |
| M-01 | Contexto de evaluación y orientación de registro de notas con datos existentes | P1 | PROPUESTA, pendiente de aprobación técnica del alcance |
| M-02 | Consulta fiable del historial de cambios por nota: carga, error, vacío y recuperación | P2 | PROPUESTA, pendiente de aprobación técnica del alcance |
| M-03 | Precisar y validar el contrato institucional de publicación/cierre y consulta histórica | P1 para la decisión, sin implementación funcional inmediata | **PENDIENTE DE CONFIRMACIÓN** institucional |

Recomendación de implementación inicial: **M-01**, seguida de M-02. La confirmación de M-03 puede tramitarse en paralelo, pero no autoriza nuevos estados, persistencia, permisos o exposición de resultados. Los identificadores no sustituyen las mejoras homónimas de BOLT-MIS-003, que ya existen y no forman parte de este plan.

Esta fase solo crea `prompt-02-validacion.md` y este documento. No se ejecutaron Pest, Cypress, build ni comprobaciones de navegador: **cero pruebas funcionales ejecutadas**. No se accedió a datos institucionales ni se comprobó la disponibilidad de bases. Los hallazgos técnicos se sustentan en lectura y análisis de flujo, no en reproducción en sesión real. No se modificó el diagnóstico original.

## Confirmación y precisión del diagnóstico inicial

| Procedimiento | Resultado actualizado | Confirmación o precisión |
| --- | --- | --- |
| PM-03.1 — Configurar evaluaciones | **IMPLEMENTADO por código**; ejecución actual NO VERIFICADA | Crear/editar, periodo del año, tipo institucional activo, escala, publicación/cierre y auditoría ya existen. Que no haya editor de tipos o promedios no demuestra incumplimiento de RF-10 |
| PM-03.2 — Registrar calificaciones | **IMPLEMENTADO por código**; ejecución actual NO VERIFICADA | Rango, precisión, máximo, matrícula, docente, periodo, unicidad, motivo e historial/transacción están presentes. No se confirmó una falla de integridad o autorización mediante ejecución |
| PM-03.3 — Publicar resultados | Visibilidad vigente **IMPLEMENTADA**; clasificación **PARCIAL solo respecto a publicación independiente**, que sigue NO VERIFICADA institucionalmente | No convertir el PARCIAL preliminar en obligación de desarrollar otro flujo. El sistema publica evaluaciones y expone sus notas conforme se registran, sin publicación separada de calificación |
| PM-03.4 — Consultar historial académico | Consulta personal/reportes/resumen e historial de cambios por nota **IMPLEMENTADOS**; **PARCIAL respecto a expediente longitudinal integral no definido** | Historial de modificaciones no equivale a trayectoria académica. Cinco notas familiares y ausencia de boletín automático son límites explícitos de los RF. No se confirma obligación de ampliar acceso familiar |

No se reclasifica el catálogo de 24 RF como incumplido por interpretar de forma más amplia el nombre de un procedimiento. RF-08, RF-09, RF-10, RF-21, RF-22, RF-23 y RF-24 son los vínculos directos o de soporte; RF-01/02/03/04 son transversales y RF-05/06/07 aportan identidad/elegibilidad. Los demás RF no autorizan nuevas fórmulas, boletines o certificados para este Bolt.

## PM-03.1 — Configuración contrastada

`frontend/src/learning/LearningForm.tsx` reutiliza `LearningSelect` para periodo y tipo, permite título, descripción, fecha opcional, peso opcional y nota máxima. Guarda mediante POST `/api/v1/courses/{course}/assessments` o PATCH `/api/v1/assessments/{id}`. `backend/app/Http/Requests/LearningRequest.php` exige los identificadores y valida formato de fecha, escala >0 y ≤20, dos decimales y peso 0–100.

`backend/app/Services/Learning/LearningService.php::save` exige curso activo, autoriza por Gate, comprueba periodo del mismo año y tipo activo institucional y crea DRAFT. Publicar exige DRAFT y cerrar deja CLOSED inmutable. Si ya existen notas no cambia periodo, escala o tipo. La operación se audita mediante `LearningAudit` dentro de una transacción.

Las relaciones proceden de `backend/app/Models/Learning/Assessment.php`: curso, periodo, tipo y notas. `backend/app/Models/Courses/Course.php`/`TeachingRecord.php` relacionan curso con asignatura, docente, año, grado y sección. `ClassroomAccess::staff/allowed` limita gestión a Administración o docente activo asignado al curso, con asignación activa y permiso efectivo. Los permisos de periodo son independientes; ser docente no habilita su modificación por poseer permisos de evaluaciones.

Los catálogos GET `/api/v1/courses/{course}/assessment-types` y `/assessment-periods` son paginados y autorizados por `LearningController::options`. No se encontró un editor de tipos de evaluación; Sprint 7 lo excluye. No se propone crearlo.

La fecha solo se valida por formato: no se obliga a ubicarla dentro de las fechas del periodo. Esto es una **regla institucional no especificada**, no un defecto confirmado. La posibilidad de configurar una evaluación que todavía no admite notas no es una inconsistencia por sí sola: la preparación y la apertura para calificación son momentos distintos.

## PM-03.2 — Registro y trazabilidad contrastados

Contrato existente: GET/POST `/api/v1/assessments/{assessment}/scores`, PATCH `/api/v1/scores/{id}` y GET `/api/v1/scores/{id}/history`.

`backend/app/Services/Learning/ScoreService.php::save` conserva:

- Permiso `scores.create` o `scores.update`, ámbito institucional y docente, curso activo y evaluación PUBLISHED.
- Periodo no CLOSED con `grading_open=true`; no se sustituye por un calendario basado en la fecha actual.
- Perfil estudiantil activo y matrícula APPROVED en el curso según `CourseAccess::studentQuery`.
- Nota 0–20 y no superior al máximo de la evaluación. `LearningRequest` admite hasta dos decimales; no se introduce otra escala o fórmula.
- Unicidad evaluación/estudiante, comprobada por servicio e índice de la migración de aprendizaje.
- Motivo no vacío al modificar; nota, historial y auditoría atómicos con bloqueos. No se altera la escala, el periodo o el tipo de una evaluación con notas.

`frontend/src/learning/ScoreForm.tsx` ya tiene límites numéricos, motivo, manejo de error y controles ocupados. `LearningPanel.tsx` condiciona botones por capacidades y contexto de evaluación/periodo; el servidor verifica además curso, perfil y matrícula. Esta diferencia justifica explicar mejor las condiciones conocidas, **no copiar reglas de autorización ni conceder permisos desde React**.

El historial se agrega con valor anterior/nuevo, motivo, usuario y fecha en `ScoreHistory`. Ese modelo bloquea actualización y hereda prohibición de borrado desde `LearningRecord`; no hay API de edición del historial. `LearningAudit` guarda metadatos de GRADE/SCORE_UPDATE sin copiar valores de notas, observaciones o motivos libres al log general. No se promete inmutabilidad frente a SQL administrativo ajeno a Eloquent.

## PM-03.3 — Publicación: respuestas explícitas

Fuentes: `LearningService`, `ScoreService`, `LearningAccess::visible`, `LearningPolicy`, `LearningController`, `StudentSummary` y `backend/database/migrations/2026_10_04_100000_create_learning_tables.php`.

| Pregunta | Comportamiento comprobado por código y límite |
| --- | --- |
| ¿Puede verse una nota antes de que el docente quiera publicar resultados? | Una nota registrada en evaluación PUBLISHED es consultable inmediatamente por los actores elegibles. Si el docente pretendía prepararla en privado, el sistema no ofrece ese estado. La intención del docente no se deduce del código; no se ha demostrado un incidente real |
| ¿Hay publicación independiente de calificaciones? | No. `scores` no contiene estado de publicación ni se encontró acción `scores.publish`. `graded_at` no es una fecha de liberación de resultados |
| ¿Qué implica publicar una evaluación? | POST `/assessments/{id}/publish` cambia DRAFT a PUBLISHED y audita PUBLISH. Habilita escritura de notas cuando curso/periodo y permisos lo permiten. No libera un lote de notas previamente preparado, pues el servicio no registra notas sobre borrador |
| ¿Qué implica registrar o modificar una nota? | Guarda el valor y su historial. Mientras la evaluación siga PUBLISHED y el estudiante/curso sean elegibles, el valor actual es visible en la siguiente consulta. No hay un segundo paso de aprobación |
| ¿Qué ocurre al cerrar? | POST `/assessments/{id}/close` deja CLOSED; no borra notas ni historial y bloquea escritura ordinaria. `LearningAccess` excluye evaluaciones no PUBLISHED de las lecturas estudiantiles. `StudentSummary` también las excluye del resumen familiar. El personal mantiene consulta según sus propias reglas |
| ¿Puede haber resultados incompletos? | Es posible consultar las notas ya registradas aunque no se haya completado la calificación del grupo. El resumen familiar está limitado deliberadamente a cinco notas recientes. No hay señal de “resultados completos” ni promedio automático. Esto no demuestra corrupción ni un incumplimiento institucional sin definir qué significa completo |
| ¿Qué consulta estudiante y qué consulta apoderado? | El alumno usa `/my/scores`, sujeto a `scores.view`, titularidad, evaluación publicada y curso/matrícula elegibles. El apoderado usa `/dashboard` con `profile.view` y vínculo verificado; no recibe un endpoint de notas ajenas o gestión por ser apoderado |
| ¿Se satisface PM-03.3? | Sí para el flujo actual documentado de visibilidad ligada a evaluación publicada. Una publicación separada, por lote o posterior a revisión no está implementada y su necesidad es **PENDIENTE DE CONFIRMACIÓN**, no un requisito inventado |
| ¿La brecha es funcional o documental? | El mecanismo técnico está claro; la correspondencia con el proceso del colegio es una decisión académica pendiente. Puede resolverse documentando/explicando el flujo existente si se acepta; una política diferente requiere requisitos y análisis de privacidad antes de proponer código |

Las mismas condiciones aparecen en `docs/sprints/sprint-7.md`. No se interpreta CLOSED como un derecho automático a conservar consulta estudiantil ni se cambia la visibilidad por considerar útil un historial más extenso. Tampoco se sugiere marcar notas visibles desde frontend ignorando Policies.

## PM-03.4 — Historial, resultados y reportes

| Aspecto | Soporte actual y conclusión |
| --- | --- |
| Notas de estudiante | GET `/my/scores` consulta notas propias autorizadas y paginadas. La UI personal no ofrece un nuevo filtro de año/periodo; no se inventa uno que la API personal no implemente |
| Curso/periodo | Notas anidadas por evaluación en cursos autorizados. Reportes existentes `student-scores`, `course-scores`, `period-scores` y `course-assessments` admiten filtros validados y paginación según su catálogo |
| Periodos anteriores | El personal autorizado puede consultar notas/reportes de periodos previos dentro de su alcance; no se borran al cerrar periodo. La lectura personal depende de evaluación publicada y curso/matrícula todavía elegibles; un periodo anterior no equivale por sí solo a una nota prohibida o disponible |
| Historial por nota | GET `/scores/{id}/history` autoriza la nota y devuelve correcciones en orden ascendente por ID, paginadas. Es trazabilidad de una calificación; no expediente académico longitudinal |
| Auditoría interna | `LearningAudit` permite rastrear operaciones; no sustituye la lista de resultados del alumno. No se propone dar `audit.view` a estudiantes o apoderados para cubrir PM-03.4 |
| Resumen familiar | `FamilyDashboard` obtiene estudiantes activos vinculados mediante `OfficeAccess::students`; `StudentSummary` selecciona cinco notas recientes publicadas de cursos elegibles. No usa el apoderado como docente ni exige concederle `scores.view` para ese resumen previsto |
| Exportación | GET `/reports/{report}/export` reutiliza CSV del catálogo autorizado. `ReportPolicy` restringe reportes de notas a Administración/docente y permisos; no ofrece acceso familiar indiscriminado. No se crea otro reporte |
| Datos vacíos | `LearningPanel` ya presenta vacío y error/reintento. El componente interno `ScoreHistory` no tiene vacío explícito, reintento propio ni carga asociada a cada página; puede conservar un error después de una respuesta posterior exitosa |
| Accesibilidad | Formularios con labels y tablas con scroll; pestañas con límites ARIA/teclado previamente registrados. La mejora acotada de historial puede incorporar avisos y botones etiquetados sin rediseñar el aula |

El resumen de cinco notas y la falta de boletín oficial/promedio automático ya están delimitados en `docs/requirements-status.md` y `docs/traceability.md`. No constituyen, por sí mismos, una obligación de desarrollar otra consulta o ampliar acceso familiar.

## Seguridad, roles y rutas manipuladas

| Actor | Gestión y consulta efectiva según código |
| --- | --- |
| ADMINISTRATOR | Permiso concreto y misma institución para gestión; no elude bloqueo del periodo o evaluación. Reportes según catálogo y permiso |
| TEACHER | Permiso concreto, perfil docente activo y curso con asignación activa; no administra cursos ajenos por poseer solo un permiso de escritura |
| STUDENT | Lectura propia con `scores.view`, evaluación PUBLISHED y matrícula aprobada/curso elegible. No registra/publica notas |
| GUARDIAN | Resumen de estudiantes vinculados con `profile.view`; no publica, modifica ni accede a reportes institucionales de notas por ese rol |
| SECRETARY | Permisos académicos generales no equivalen a gestión de aprendizaje; no recibe notas por el seeder de Sprint 7 |
| TREASURY | No recibe acceso a notas por su función económica |

Fuentes: `backend/app/Policies/LearningPolicy.php`, `Services/Learning/LearningAccess.php`, `Services/Classroom/ClassroomAccess.php`, `Services/Courses/CourseAccess.php`, `Policies/ReportPolicy.php`, `Services/Reports/FamilyDashboard.php`, `StudentSummary.php`, `Services/Office/OfficeAccess.php` y `database/seeders/LearningPermissionSeeder.php` — rutas abreviadas relativas a `backend/app/`, salvo el seeder, relativo a `backend/`.

Cambiar `/scores/{id}` o `/scores/{id}/history` no constituye autorización: `LearningController` consulta modelo con scope institucional y aplica Gate. `LearningAccess::visible` limita al alumno titular; los modelos de aprendizaje heredan `BelongsToInstitution`. Las escrituras pasan por Gate y validación del servicio. `ReportPolicy` y el alcance docente del reporte evitan convertir un filtro en acceso general. No se identificó por lectura una ruta pública que omita estas protecciones. **No se reprodujo ni se descartó exhaustivamente un IDOR**: se identificaron controles y pruebas negativas existentes, sin ejecutar peticiones reales.

No se consultaron roles o permisos persistidos de cuentas concretas. Se conserva el tratamiento actual de cuentas con múltiples roles; las pruebas propuestas deben cubrirlo sin reasignar permisos de desarrollo.

## Contraste de los hallazgos E-01 a E-08

| Hallazgo inicial | Validación actual | Decisión |
| --- | --- | --- |
| E-01, publicación acoplada | Confirmado: no hay estado propio de nota; visibilidad inmediata de valor registrado en evaluación publicada | M-03 pendiente de confirmación; M-01 puede explicar el contexto existente sin alterar reglas |
| E-02, retirada al cerrar | Confirmada en código y documentada en Sprint 7 | No “corregir” automáticamente. Solicitar decisión de conservación/visibilidad en M-03 |
| E-03, historial/resumen limitados | Confirmado por endpoint por nota y `limit(5)` familiar | Precisar significado; no añadir expediente/boletín. M-02 mejora la consulta existente |
| E-04, fecha y periodos | Formato validado, sin regla de intervalo; el selector permite preparación en periodos que quizá no estén abiertos para calificar | La regla de fecha dentro del periodo es pendiente institucional. No se selecciona una nueva prohibición |
| E-05, contexto e historial | Confirmado por JSX y flujo de estado: metadatos disponibles poco visibles; `ScoreHistory` no limpia error al recibir éxito ni marca carga por página | Seleccionar M-01 y M-02. Defectos de estado demostrables por inspección, no reproducidos en navegador |
| E-06, pestañas accesibles | Se conservan roles tab/tablist/tabpanel sin el patrón completo de teclado/relaciones | Deuda válida pero no seleccionada como cuarta mejora; no se rehace el layout |
| E-07, cobertura | Los casos de nota existentes no cubren toda la consulta tras cierre ni la corrección/historial paginado en UI | Añadir cobertura como parte de M-01/M-02 y caracterización de M-03, sin afirmar pruebas nuevas aprobadas |
| E-08, módulos ausentes | Editor de tipos, promedios/boletines/publicación por lote no están implementados en el alcance revisado | No seleccionados; necesidad institucional no demostrada y varios están fuera del alcance RF declarado |

## M-01 — Contexto de evaluación y orientación de registro

**Prioridad:** P1. **Estado:** PROPUESTA, pendiente de aprobación de implementación. **Procedimientos:** PM-03.1 y PM-03.2; aclaración de operación existente en PM-03.3. **RF:** RF-10, RF-08, RF-22; RF-09 como contexto de consulta.

**Problema demostrado:** `LearningPanel.tsx` muestra de una evaluación título, estado y descripción, pero no muestra consistentemente periodo, escala y fecha que ya recibe. La comprobación `gradingOpen` produce un mensaje genérico cuando no se puede registrar, sin separar las condiciones conocidas de evaluación publicada y periodo habilitado. Esto dificulta reconocer el contexto antes de ingresar notas; no se afirmó que se haya registrado una nota errónea en el colegio.

**Evidencia técnica:** `frontend/src/learning/LearningPanel.tsx` — tarjetas, `gradingOpen`, botones de notas; `frontend/src/learning/shared.tsx::LearningRecord` ya tipa escala/fecha/periodo; `backend/app/Http/Resources/LearningResource.php` expone atributos y `period.name/grading_open`; `frontend/src/learning/ScoreForm.tsx` mantiene validación local y mensajes de error. La API no expone todos los nombres de catálogos ni el estado del periodo en ese objeto: no se inventan datos ausentes.

**Impacto esperado:** ayudar a distinguir evaluaciones similares y entender por qué el registro no está disponible, reduciendo intentos evitables de operación. El impacto es cualitativo; no se han medido tiempos o incidentes reales.

**Solución mínima recomendada:** presentar periodo, escala máxima y fecha cuando existan en el payload; mostrar ausencia de dato con una etiqueta clara. Explicar solo bloqueos deducibles de datos disponibles y conservar los errores definitivos del servidor. Distinguir semánticamente “publicar evaluación” de registrar notas, sin anunciar una nueva publicación de resultados. Conservar botones por `abilities` y los límites numéricos actuales. No calcular promedios, simular estado del periodo o descargar listados globales para enriquecer cada tarjeta.

**Archivos propuestos:** `frontend/src/learning/LearningPanel.tsx`; `ScoreForm.tsx` únicamente si se precisa el contexto en su encabezado; un spec Cypress focalizado de evaluación en `e2e/cypress/e2e/` y regresión de `learning.cy.ts`. No se requiere cambiar `LearningResource`, Policies o servicios para los datos mínimos seleccionados.

**Riesgos:** confundir una evaluación publicada con un resultado completo; esconder acciones válidas por reglas locales nuevas; exponer detalles de otro alumno. No inferir permisos por rol solamente ni prometer que una validación visual sustituye a Laravel. No mostrar identificadores internos como si fueran nombres de tipo o periodo.

**Criterios de aceptación:**

1. El docente identifica periodo, máximo y fecha de la evaluación antes de abrir notas, usando datos reales de esa evaluación; los valores ausentes no generan cifras o fechas inventadas.
2. Una evaluación cerrada o no publicada y un periodo con `grading_open=false` tienen explicación coherente con los datos recibidos; no se transforma una falta de información en permiso.
3. `scores.create/update` y capacidades de servidor conservan el control de botones; no se permite escribir al estudiante/apoderado ni en un contexto rechazado por API.
4. No cambian escala 0–20, máximo por evaluación, precisión, motivo, visibilidad ni transiciones. Publicar/cerrar siguen utilizando las acciones vigentes.
5. Etiquetas legibles, navegación por teclado de los controles añadidos y presentación móvil sin desbordamiento.

**Pruebas necesarias:** Cypress con API simulada para metadatos presentes/ausentes, estados, permiso mínimo y periodo bloqueado; respuestas 403/422 sin informar éxito. Regresión real de creación/nota y lectura propia solo en entorno aislado. Pest Sprint 7 existente para rango, máximo, matrícula, duplicado, periodo/cierre e historial; complementar el máximo propio menor a 20 y estructura con notas si no está cubierto de forma explícita. No se requieren cambios de reglas backend.

**Aprobación institucional:** no requiere una regla académica nueva mientras sea una presentación fiel del comportamiento actual. La autorización de implementación de este plan sigue pendiente; cualquier bloqueo por calendario o cambio de visibilidad queda fuera de M-01.

## M-02 — Consulta fiable del historial de cambios por nota

**Prioridad:** P2. **Estado:** PROPUESTA, pendiente de aprobación de implementación. **Procedimiento:** PM-03.4, con trazabilidad de corrección de PM-03.2. **RF:** RF-09 y RF-24, RF-08 de soporte.

**Problema demostrado por flujo de código:** el componente interno `ScoreHistory` de `frontend/src/learning/LearningPanel.tsx` guarda `error` en catch, pero una respuesta posterior correcta solo actualiza `result`. Después de un error al paginar puede seguir mostrando el error junto a datos nuevos. El indicador de carga depende de `!result && !error`, de modo que al cambiar de página con datos previos no informa que esos datos son anteriores. No hay vacío específico ni botón de reintento del historial. No se ha reproducido el escenario en navegador en esta fase.

**Evidencia:** efecto y JSX de `ScoreHistory`; contrato GET `/api/v1/scores/{id}/history` en `backend/app/Http/Controllers/Api/LearningController.php::history`; orden/paginación en `backend/app/Models/Learning/Score.php::history`. El endpoint ya existe y autoriza la nota antes de devolver historial.

**Impacto esperado:** evitar que una consulta de trazabilidad se interprete como fallida cuando ya recuperó datos o como actual mientras se está solicitando otra página. No implica pérdida o alteración de historial persistido: es una mejora de confianza y recuperación de la lectura.

**Solución mínima recomendada:** asociar datos/error/carga a nota y página consultadas; limpiar el error al recuperar exitosamente, indicar carga por cada petición, permitir reintentar la consulta actual y presentar vacío claro. Mantener protección frente a respuestas fuera de orden y conservar paginación/orden de servidor. Identificar explícitamente la vista como historial de cambios de **esa nota**, no expediente del estudiante. No añadir nombres, datos personales o perfiles nuevos para sustituir `changed_by`; la mejora no necesita ampliar el payload ni sus permisos.

**Archivos propuestos:** `frontend/src/learning/LearningPanel.tsx`, componente interno `ScoreHistory`; spec Cypress focalizado del historial en `e2e/cypress/e2e/`. Reutilizar estados/helper ya disponibles cuando resulte apropiado, sin modificar otros macroprocesos ni reconstruir LearningPanel.

**Riesgos:** mezclar historial de dos notas, mostrar datos de página anterior como actuales o convertir reintento en operación de escritura. Mantener `id` y página como clave de consulta, limpieza de efectos y Gate del servidor. No acceder a `audit-logs` para suplir el historial de nota.

**Criterios de aceptación:**

1. Cada nota/página tiene carga identificable y no presenta un resultado anterior como el nuevo; los botones conservan la paginación de servidor.
2. Error → éxito elimina el mensaje obsoleto; reintento mantiene nota y página. Una lista vacía tiene mensaje explícito, sin aparentar fallo o fabricar registros.
3. Respuesta antigua o error tardío no reemplaza datos vigentes; cambiar de nota no reutiliza historial de otra.
4. Se conservan valor anterior/nuevo, actor, fecha y motivo recibidos, sin cambios de orden o persistencia.
5. Estudiante autorizado solo consulta su nota; ID ajeno, institución ajena o acceso revocado no muestran contenido. No se habilita historial familiar mediante nuevos permisos.
6. Mensajes anunciables, controles etiquetados y uso móvil/teclado dentro del panel existente.

**Pruebas necesarias:** Cypress de carga inicial y de página posterior, fallo 500 seguido de éxito, reintento de misma página, vacío, respuesta tardía y cambio de nota. Usar fixtures con varias páginas para verificar el contrato, sin escribir datos reales. Pest existente `preserves previous scores reason and actor with atomic audit rollback` e IDOR de notas/historial; ejecutar en aislamiento y añadir un caso negativo adicional solo si existe brecha concreta. No cambiar el endpoint ni el modelo.

**Aprobación institucional:** no requiere redefinir política de notas o historial longitudinal; sí aprobación técnica de esta mejora. Cualquier ampliación a expediente familiar completo queda excluida.

## M-03 — Contrato de publicación y conservación histórica

**Prioridad:** P1 para aclaración institucional, **sin implementación funcional inmediata**. **Estado: PENDIENTE DE CONFIRMACIÓN.** **Procedimientos:** PM-03.3 y PM-03.4. **RF:** RF-09, RF-10, RF-21 y RF-22; RF-24 de trazabilidad.

**Problema demostrado:** existe una diferencia entre los nombres amplios de los procedimientos y el flujo actual: nota visible al registrarse sobre evaluación publicada, retirada de lecturas personales al cerrar y resumen familiar de cinco notas. El código demuestra ese comportamiento, **no demuestra que el colegio necesite otro**. La brecha a resolver primero es documental/institucional.

**Evidencia técnica:** `backend/app/Services/Learning/LearningService.php`, `ScoreService.php`, `LearningAccess.php`; `backend/app/Services/Reports/StudentSummary.php`; migración de aprendizaje, `docs/sprints/sprint-7.md`, `docs/requirements-status.md` y `docs/traceability.md`.

**Impacto para el colegio:** una expectativa distinta de preparación privada, liberación de grupo o conservación de resultados al cierre puede generar confusión de docentes/familias. No se afirma que haya ocurrido divulgación anticipada o pérdida de notas; los datos se conservan y la política controla su lectura.

**Solución mínima recomendada en esta propuesta:** obtener y registrar la decisión del responsable sobre el flujo existente y caracterizarlo con pruebas. Si se acepta, documentar claramente lo que significa publicar/cerrar y el alcance del resumen, sin cambiar privacidad. **Si se exige una política diferente, detener esta mejora y replantear el alcance antes de diseñar estados, permisos, migraciones o endpoints.** Este plan no autoriza un mecanismo nuevo de publicación independiente ni un boletín.

**Archivos que podrían requerir cambios tras confirmación:** documentos de alcance/trazabilidad de BOLT-MIS-004 y, si se acepta la regla actual, documentación de usuario o mensajes de evaluación estrictamente descriptivos. Cobertura en `backend/tests/Feature/Sprint7Test.php`, `Sprint10Test.php` y un spec Cypress focalizado para demostrar el contrato aceptado. No se preautoriza modificar servicios, Policies, modelos o bases de datos; cualquier cambio de regla requiere nuevo análisis y aprobación explícita.

**Decisiones pendientes:**

- ¿Registrar/corregir una nota en evaluación publicada equivale institucionalmente a ponerla a disposición del alumno/familia elegibles?
- ¿Cerrar evaluación debe retirar su consulta personal como hoy, o solo congelar la escritura? ¿Qué alcance temporal corresponde a cursos o matrículas no activos?
- ¿Se acepta el resumen familiar de cinco notas recientes y el historial por nota como alcance de RF-09/21, distinguiéndolos de un expediente completo?
- ¿Se requiere realmente publicar un conjunto completo o preparar notas en privado? Si sí, aportar regla aprobada y condiciones de privacidad antes de proponer implementación.

**Riesgos:** mantener visibles datos que la política actual oculta, exponer notas al apoderado equivocado, permitir lectura de resultados no aprobados o confundir cierre de periodo y cierre de evaluación. No decidir estos puntos mediante una etiqueta visual o eliminando un filtro de `LearningAccess`.

**Criterios de aceptación para cerrar esta mejora de definición:** decisión institucional identificada y registrada, sin atribuir aprobación inexistente; tabla de estados/actores/visibilidad coherente con RF y código; límites de resumen e historial explícitos; pruebas de caracterización con resultados reales en entorno aislado. Si la regla cambia, se necesita una propuesta técnica posterior aprobada, no una corrección automática incluida aquí.

**Pruebas requeridas tras confirmar:** Pest de registro visible, corrección visible, cierre de evaluación y consulta propia/historial, periodo cerrado, curso o matrícula no elegible, resumen familiar vinculado y denegación a otra familia/institución. Cypress de recorrido docente → consulta propia/familiar según contrato. Primero establecer expectativas con la decisión institucional; no modificar tests existentes para forzar una nueva visibilidad sin aprobación.

**Aprobación institucional:** obligatoria para cualquier cambio académico o de visibilidad. Mientras no exista, conservar las reglas actuales y no recomendar implementar una nueva publicación de resultados.

## Pruebas existentes y situación de ejecución

| Evidencia | Qué respalda | Estado actual |
| --- | --- | --- |
| `backend/tests/Feature/Sprint7Test.php` | Configuración, referencias, permisos/IDOR, nota válida/duplicada, rango, periodo bloqueado, cierre, motivo e historial/rollback | Cubierta por definiciones leídas; **NO EJECUTADA** aquí |
| `backend/tests/Feature/Sprint10Test.php` | Reportes/filtros/exportación, aislamiento y privacidad de resumen familiar/estudiantil | Cubierta por definiciones leídas; **NO EJECUTADA** aquí |
| `backend/tests/Feature/Sprint2Test.php`, `Sprint5Test.php` | Periodos, curso, docente, matrícula y relaciones de acceso | Identificadas como dependencias; **NO EJECUTADAS** |
| `e2e/cypress/e2e/learning.cy.ts` | Crear/publicar evaluación, registrar nota y lectura estudiantil dentro de sus tres flujos | Identificada/revisada; **NO EJECUTADA** |
| `e2e/cypress/e2e/virtual.cy.ts`, `reports.cy.ts`, `academic.cy.ts` | Integración del aula, roles, reportes, periodos y consulta familiar acotada | Identificadas; **NO EJECUTADAS** |
| `e2e/cypress/e2e/virtual-access.cy.ts`, `learning-filters.cy.ts` | Permisos mínimos de notas y estados de evaluación con API simulada | Identificadas; **NO EJECUTADAS** |
| Recuperación/paginación de historial, escala propia y lectura posterior al cierre | No se encontró cobertura focalizada completa en los escenarios revisados | Brechas de cobertura propuestas; no se inventan casos ya aprobados |

No existe resultado aprobado de Pest/Cypress de esta intervención. Los números de BOLT-MIS-003 y las validaciones históricas de Sprint 7 no se suman ni se consideran ejecuciones actuales. Tampoco se afirma que una vulnerabilidad haya sido explotada por leer las Policies.

Antes de futuras pruebas con escrituras se debe verificar entorno aislado y, para Pest, `backend/AGENTS.md`: MySQL `zarate_test`, usuario `zarate_test`, configuración no cacheada y fixtures/transacciones de testing. No preparar cuentas mediante seeders en datos a conservar ni ejecutar regresión real contra desarrollo para completar este plan. Build, lint, tipos y pruebas se registrarán por separado cuando se autorice implementación; aquí no se ejecutan.

## Orden recomendado y límites de aprobación

1. Revisar y aprobar **M-01** como primer cambio técnico: aporta contexto operativo usando payload existente y no requiere cambiar la política académica.
2. Implementar después **M-02**, acotada al historial de cambios de una nota y su recuperación. No convierte trazabilidad en expediente ni amplía acceso.
3. Mantener **M-03 PENDIENTE DE CONFIRMACIÓN**. La decisión institucional puede obtenerse en paralelo; cualquier cambio posterior de publicación o consulta se somete a nuevo análisis de privacidad y autorización.

La cobertura de pruebas y accesibilidad indicada forma parte de estas tres propuestas, no una cuarta mejora independiente. No se propone añadir editor de tipos, promedios, fórmulas, boletines, certificados, reportes o nuevos estados de publicación.

## Limitaciones y control documental

La validación se basa en código y documentación local; no hubo entrevistas, aprobación académica, navegador, consultas de datos ni pruebas funcionales ejecutadas. No se certifica integridad de una base poblada, rendimiento, cobertura exhaustiva de permisos o conformidad WCAG. Las afirmaciones de impacto son cualitativas y los riesgos no reproducidos se etiquetan como tales.

Se conserva el diagnóstico original y se precisa su interpretación en este plan. Los únicos archivos creados son este documento y el prompt 02 íntegro. Se comprueba el prompt contra el adjunto mediante SHA-256 y se revisan formato/rutas reales; `git diff --check` se usa solo como control de formato, no como prueba funcional. No se realizaron commits, push, merge ni Pull Requests.
