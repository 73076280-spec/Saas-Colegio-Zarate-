# BOLT-MIS-005 — Validación de brechas y plan de mejoras de asistencia

Fecha: 01/11/2026. EcoAula SaaS — Colegio Zárate de Huancayo. Proceso PM-04 — Asistencia y seguimiento.

## Resultado y límites de esta fase

Rama verificada: `feature/asistencia-seguimiento`. HEAD: `0bbfa64` — `docs(misional): auditar asistencia y seguimiento PM-04`. El repositorio estaba limpio al iniciar. Se leyeron completamente `diagnostico.md` y `prompt-01-auditoria.md` de este Bolt y se contrastaron sus hallazgos con los componentes y servicios actuales, documentación de arquitectura, RF/trazabilidad y Sprints 8/10.

**Se seleccionan tres mejoras de interfaz; ninguna está implementada ni aprobada para implementación por este documento.** No se necesita reconstruir asistencia, duplicar justificaciones o crear indicadores nuevos. La evidencia es análisis de código: **cero pruebas ejecutadas**, sin navegador, MySQL, Laravel, migraciones, seeders o datos reales. No se presentan resultados de otros Bolts como actuales.

| Código | Mejora seleccionada | Procedimientos / RF principales | Prioridad |
| --- | --- | --- | --- |
| M-01 | Proteger el borrador de asistencia entre sesiones/páginas y durante guardado/recarga | PM-04.1; RF-13 Gestión de asistencia | P1 — implementar primero tras aprobación |
| M-02 | Recuperación y contexto fiable del listado, detalle e historial de justificaciones | PM-04.2/03; RF-15 Justificación de inasistencias, RF-14 Consulta de asistencia | P1 — segunda |
| M-03 | Consulta personal/familiar recuperable y vinculada al estudiante/página correctos | PM-04.3, relación con PM-04.2; RF-14 y RF-21 Portal del padre/apoderado | P2 — tercera |

RF-04 Gestión de roles y permisos y RF-24 Auditoría del sistema son controles transversales a conservar. RF-23 Generación de reportes aporta consultas ya existentes, pero no justifica modificar su módulo. Accesibilidad y pruebas se incluyen en las tres mejoras, no se convierten en una cuarta.

Este documento precisa el diagnóstico sin reescribirlo. Los códigos PM-04.1, PM-04.2 y PM-04.3 conservan los nombres del prompt 01. No se encontró otra definición formal previa en la búsqueda documental original: la equivalencia con un mapa institucional externo continúa **NO VERIFICADA**, especialmente el alcance amplio de «indicadores y seguimiento».

## Estado actualizado de procedimientos

| Procedimiento | Estado por inspección actual | Precisión y límite |
| --- | --- | --- |
| PM-04.1 — Registrar asistencia de estudiantes | **IMPLEMENTADO** en el alcance RF-13; ejecución actual **NO VERIFICADA** | Sesiones, registro masivo, corrección, cierre, unicidad y auditoría existen. Se confirma descarte de estado local al cambiar sesión y posibilidad de sobrescritura de nuevas ediciones por recarga; no pérdida comprobada de registros persistidos. |
| PM-04.2 — Justificar inasistencias | **IMPLEMENTADO** en el alcance RF-15; ejecución actual **NO VERIFICADA** | Solicitud por apoderado, archivo privado, revisión, aprobación/rechazo e historial ya existen. La brecha es recuperación/contexto de consulta y accesibilidad puntual, no falta de flujo o permisos. |
| PM-04.3 — Consultar indicadores de asistencia y seguimiento | **IMPLEMENTADO** para RF-14/21/23 inspeccionados; ejecución actual **NO VERIFICADA** | Consultas propias/vinculadas, reportes y resúmenes existen. No se acredita necesidad de un tablero adicional ni de filtro nominal de periodo. Se confirman problemas de presentación/recuperación y contexto de las consultas actuales. |

Fuentes RF: `docs/requirements-status.md`, `docs/traceability.md`. Arquitectura: `docs/architecture.md` y referencia histórica `docs/arquitectura.md`. Contrato del módulo: `docs/sprints/sprint-8.md`; reportes/dashboards: `docs/sprints/sprint-10.md`. Los RF no se reclasifican como incumplidos solo porque se identifiquen mejoras de usabilidad.

## Contraste técnico de registro y pérdida de borrador

Archivo principal: `frontend/src/attendance/AttendanceCourse.tsx`.

1. `AttendanceRoster` mantiene `draft` en memoria, indexado por student_id, con estado y observaciones. No es persistencia local ni guardado automático. El GET inicial lo construye desde `record` del servidor; `save` toma una instantánea del lote antes de esperar el POST.
2. «Abrir asistencia» ejecuta `setSelected(s)` sin preguntar por cambios. `AttendanceRoster key={selected.id}` remonta otro componente; al volver a la sesión previa se reconstruye desde el servidor. **La pérdida de las ediciones no enviadas se deduce directamente de este flujo**, aunque no se reprodujo en navegador en esta fase.
3. Crear otra sesión también cambia `selected` después del POST, por lo que puede abandonar el borrador previo sin aviso. La fecha se elige al crear sesión; no hay un editor React identificado para cambiar fecha de una sesión ya registrada.
4. Al guardar, un POST exitoso incrementa `revision` y dispara otro GET. Ese GET ejecuta `setDraft(...)` completo. Los selects y observaciones **no están bloqueados por `busy`**, por lo que se puede editar incluso mientras el POST está pendiente, además de durante la recarga posterior. Una respuesta válida puede sustituir esas ediciones más recientes. Esta precisión amplía E-03 del diagnóstico: el intervalo vulnerable no empieza únicamente después de liberar el botón Guardar.
5. El `catch` del POST no borra `draft`: **un error de guardado por sí solo conserva marcaciones y observaciones**. No se confirma «pérdida ante cualquier error». Tampoco se interpreta un fallo del GET posterior como reversión de un POST que ya confirmó éxito.
6. La paginación del roster ya advierte con confirmación; cerrar sesión también advierte sobre cambios no guardados. No se propone recrear esos avisos como si no existieran. La comparación de cambios respecto al resultado cargado permitiría evitar avisos cuando no hay modificaciones reales.
7. Cambiar de curso en `frontend/src/courses/TeachingPage.tsx` remonta `CourseLearning key={detail.id}`; cambiar de pestaña en `frontend/src/learning/CourseLearning.tsx` desmonta AttendanceCourse. No hay protección de borrador en ese recorrido inspeccionado. Grado/sección se determinan por curso/roster; no hay un selector independiente de sección en el formulario de asistencia. No debe anunciarse un supuesto cambio de sección sin localizar el control real.

**Límite deliberado de M-01:** proteger transiciones controladas dentro de AttendanceCourse y su recarga. Proteger toda navegación de curso/pestaña/ruta requeriría coordinar componentes de Enseñanza-aprendizaje; no se preautoriza modificarlos en este plan. Ese riesgo de salida se conserva explícitamente. Un `beforeunload` solo cubre recarga/cierre del documento y no resuelve por sí solo la navegación SPA; no se ofrece como solución universal. Tampoco se propone guardar borradores académicos en localStorage, sesiones persistentes o servidor.

## Backend y reglas que ya resuelven integridad

| Aspecto | Evidencia actual y decisión |
| --- | --- |
| Duplicados | `backend/database/migrations/2026_10_05_100000_create_attendance_tables.php`: índices únicos curso/fecha, sesión/estudiante y justificación/registro. `AttendanceService::session/records` valida duplicados y actualiza el mismo registro. No crear otra prevención paralela. |
| Lote y elegibilidad | `backend/app/Http/Requests/AttendanceRequest.php`: 1–100 filas, student_id distintos, PRESENT/ABSENT/LATE y longitudes. `AttendanceService::records` valida roster APPROVED; una fila inválida revierte todo. |
| Curso/institución | `AttendanceAccess::manage` delega en `ClassroomAccess::allowed`, que exige permiso y personal autorizado en la institución/curso. `CourseAccess::roster` usa año/grado/sección/matrícula aprobada; modelos con scope institucional. |
| Cierre | OPEN → CLOSED, curso ACTIVE para escribir. Sesión con registros no cambia fecha. Falta con justificación existente no se modifica por el docente. No se cambian reglas para facilitar reintentos. |
| Historial/auditoría | `AttendanceAudit.php` guarda actor, entidad, estado y referencias; excluye observaciones/motivos privados del log general. Historial de estados de justificación es otro recurso, no historial completo de textos de asistencia. No usar audit-logs como sustituto ni ampliar su acceso. |
| Conflictos | Servicio/Gate devuelve rechazo según autorización/regla; UI presenta `errorMessage`. No existe en el flujo leído un protocolo de versionado optimista de borradores entre dos docentes. No se propone inventar 409 ni resolver conflictos sobrescribiendo automáticamente. |

Las rutas siguen en `backend/routes/api.php`; controladores en `backend/app/Http/Controllers/Api/AttendanceController.php`, políticas en `backend/app/Policies/AttendancePolicy.php`, servicios en `backend/app/Services/Attendance/`. Ninguna mejora seleccionada necesita alterar esas capas.

## Justificaciones: confirmación y precisión

`JustificationService::create/transition` ya exige falta ABSENT sin solicitud previa, apoderado activo vinculado y permiso create; añade motivo y adjunto opcional privado. Estados existentes: PENDING → IN_REVIEW → APPROVED o REJECTED. Revisar/decidir corresponde a SECRETARY/ADMINISTRATOR con permiso; no se salta revisión, no hay apelación/reenvío y el rechazo exige comentario. Aprobar cambia la falta a JUSTIFIED, incluso si la sesión está cerrada; rechazar conserva ABSENT. Historial, cambio del registro y auditoría se confirman juntos y la creación fallida limpia su archivo nuevo.

El estudiante no justifica. El docente no obtiene archivo o aprobación por registrar asistencia. Administración con permiso create no sustituye el vínculo de apoderado. `MaterialFiles` y el controlador ya protegen archivo, tipo/tamaño y descarga; no añadir adjuntos, actores o estados nuevos.

`frontend/src/attendance/PersonalAttendance.tsx::justify` captura error y conserva el formulario montado; `JustificationDetail.tsx::transition` conserva comentario si falla el POST y solo lo limpia tras éxito. **No se confirma pérdida automática del motivo/comentario ante un 422.** Si una solicitud no se completa, no se muestra éxito desde esos catches. Si una respuesta es incierta por red, no se debe repetir automáticamente una decisión o alta: primero permitir verificar el estado por GET autorizado.

La brecha confirmada está en `JustificationDetail.tsx`: `Promise.all` solo asigna item/history si ambas consultas resuelven; ante fallo inicial, item continúa null y `!item` mantiene el texto de carga junto al error, sin botón de reintento. Al paginar no se invalida el historial anterior ni se señala carga de la nueva página. Su limpieza `active` **ya descarta respuestas obsoletas** y un éxito **ya limpia error**; no presentar estas capacidades como inexistentes.

En `JustificationsPage.tsx`, aplicar filtros y cambiar página conserva selected; el detalle previo puede seguir visible bajo otra consulta. Los filtros de servidor existentes son estado, estudiante y fecha de asistencia; no se requiere inventar uno. En `StudentFilter`, el campo de búsqueda tiene aria-label, pero select student_id carece de etiqueta propia asociada; legend etiqueta el grupo, no individualiza ese control.

## Indicadores, filtros y consulta personal/familiar

`backend/app/Services/Reports/StudentSummary.php::sections` define porcentaje `(PRESENT + LATE) / registros × 100`, cantidad ABSENT y número de solicitudes de justificación. JUSTIFIED está en el denominador, no en el numerador; las solicitudes contadas no son exclusivamente aprobadas. Son semánticas explícitas, no errores matemáticos confirmados. Sin registros muestra «Sin registros»; no inventar porcentajes.

`TeacherDashboard.php` aporta sesiones recientes; `ReportCatalog.php` y `ReportService.php` aportan `student-attendance`, `course-attendance`, `attendance-incidents`, paginación y exportación autorizada. Son filas/reportes, distintos de los agregados de dashboard. Reportes filtran por año, nivel/grado/sección, curso, docente/asignatura, estudiante, estado y fechas. ReportPolicy restringe Administración/docente/Secretaría y alcance; tener attendance.view como familia no habilita esos reportes.

**Periodo nominal:** el catálogo de asistencia no incluye academic_period_id y la sesión no referencia directamente periodo. Sí existe rango de fechas. Los RF-13/14/15/21/23 leídos no obligan a añadir ese filtro nominal. Su necesidad y equivalencia institucional quedan **NO VERIFICADAS**; no se selecciona como mejora, no se crea tabla/relación y no se toca reportes ni otros macroprocesos.

En `PersonalAttendance.tsx`, existen consultas `/api/v1/my/attendance`, `/api/v1/profile/family` y `/api/v1/guardians/{guardian}/students/{student}/attendance`, paginadas. El primer GET familiar puede resolver y desactivar loading antes de terminar la asistencia del estudiante seleccionado. Paginar asistencias pone loading pero mantiene result; en error no hay reintento propio. Elegir otro estudiante sí limpia result/target/detail y reinicia página; paginar sus asistencias no limpia target/detail. Hay una limpieza active que protege frente a respuestas tardías: conservarla.

Estos son defectos de presentación/contexto y recuperación deducidos del flujo. No se ha demostrado acceso a un estudiante ajeno ni incidente de privacidad real. Formularios y mensajes tienen etiquetas/roles y las tablas admiten scroll; móvil, teclado, lectores de pantalla y ausencia de desbordamiento siguen **NO VERIFICADOS por ejecución**. No se hereda a este módulo el fallo de Enter de BOLT-MIS-004.

## Brechas confirmadas y correspondencia

| Hallazgo original | Resultado de la validación | Mejora seleccionada |
| --- | --- | --- |
| E-01 carga/recuperación | Confirmado result anterior durante consultas y ausencia de retry; no ausencia de active ni de limpieza de error tras éxito. Carga de sesiones/roster se aborda solo para coherencia del guardado. | M-01 para sesiones/roster; M-03 para consulta personal/familiar. |
| E-02 detalle/historial | Confirmados carga persistente tras fallo inicial, dependencia de Promise.all y falta de retry/carga de página. | M-02. |
| E-03 borrador | Confirmado descarte al cambiar sesión y sobrescritura posible por GET; precisión: campos editables incluso durante POST. Error de guardado aislado no elimina draft. | M-01; navegación externa queda como limitación explícita. |
| E-04 contexto | Confirmado selected conservado en listado administrativo y target/detail conservados al paginar asistencia personal/familiar. Elegir otro estudiante ya los limpia. | M-02 y M-03, sin duplicar su responsabilidad. |
| E-05 select sin nombre | Confirmado en StudentFilter; no certificación global de accesibilidad. | M-02 incluye etiqueta y prueba focalizada; accesibilidad transversal de controles nuevos. |
| E-06 periodo/indicadores | Contrato actual confirmado; necesidad de cambio institucional NO VERIFICADA. | No seleccionado; preservar fechas y fórmulas actuales. |

## M-01 — Protección del borrador de asistencia

**Prioridad:** P1, primera. **Estado:** PROPUESTA para revisión; no implementada. **Procedimiento:** PM-04.1. **RF:** RF-13 directo; RF-04/24 a conservar. **Problema demostrado/evidencia:** remonte por selected.id, reemplazo completo de draft en GET y campos sin bloqueo busy en `frontend/src/attendance/AttendanceCourse.tsx` (aproximadamente líneas 25, 40–43, 48–62 y 77–85).

**Impacto:** el docente puede perder marcaciones/observaciones todavía no enviadas o las escritas después de la instantánea guardada. El estudiante podría quedar con el valor previo si el docente cree haber guardado la última edición. No se mide frecuencia ni se afirma pérdida de datos persistidos.

**Solución mínima:** comparar draft con una base de la misma sesión/página; confirmar abandono cuando una selección/creación local sustituya un borrador modificado. Mientras se guarda y se reconcilia el resultado, impedir edición/transiciones que luego serían sobrescritas, o conservar explícitamente las ediciones posteriores a la instantánea; se prefiere bloqueo temporal acotado por ser menor cambio. Diferenciar POST confirmado de fallo de refresco y permitir reintentar solamente el GET. Evitar mostrar lista/roster de otro contexto como vigente. No autoguardar ni introducir persistencia de borradores.

**Archivos previstos:** `frontend/src/attendance/AttendanceCourse.tsx`; nuevo spec focalizado propuesto `e2e/cypress/e2e/attendance-draft.cy.ts` (no existe como resultado de esta fase). Mantener `attendance.cy.ts` para regresión. No se prevén cambios backend, TeachingPage, CourseLearning, router o Pager compartido.

**Criterios de aceptación:**

1. Editar estado u observación y cancelar cambio de sesión mantiene sesión, página y draft; confirmar permite descartarlo conscientemente. Abrir la misma sesión no descarta innecesariamente. Sin cambios no se requiere aviso de borrador.
2. Crear/abrir otra fecha dentro del componente no sustituye silenciosamente el borrador; no se crea una sesión por efecto secundario de confirmar un descarte ni se autoguarda asistencia.
3. Se conserva advertencia existente al paginar/cerrar; cancelar no pierde datos. Un POST rechazado conserva edición y presenta el error sin comunicar éxito.
4. Durante POST y recarga no puede introducirse edición que una respuesta posterior elimine silenciosamente. POST confirmado + GET fallido informa ambos resultados; retry no repite POST ni genera otra sesión.
5. El lote sigue usando la sesión/página correctas, solo filas elegibles y sin justificación; no concede JUSTIFIED manual, reapertura ni derechos nuevos. No altera validaciones ni upsert.
6. Sin mezcla de respuestas de contextos anteriores; recuperación identifica sesión/página y conserva confirmaciones/controles accesibles. Nueva protección no bloquea permanentemente tras error.

**Pruebas necesarias:** Cypress con API simulada para borrador por campo, cancelar/confirmar selección, paginación/cierre, creación de otra fecha, POST lento, GET tardío, POST 403/422/500 y POST correcto + GET 500 + retry GET. Verificar método/ruta/payload y ausencia de POST extra. Regresión real de `attendance.cy.ts` y Pest de roster/atomicidad/duplicados/cierre solo con aislamiento acreditado.

**Riesgos/limitaciones:** estado dirty mal calculado por valores nulos/vacíos; doble confirmación; bloqueo que no se libera; confundir fallo de lectura con fallo de escritura. No ofrece recuperación tras salida de curso/pestaña/ruta, recarga completa o cierre del navegador, ni resolución automática de edición concurrente de dos usuarios. Si se exige protección global de navegación, se necesita revisar ese alcance antes de modificar componentes de otros procesos.

**Aprobación institucional:** no exige regla nueva para proteger edición local. Sí requiere aprobación técnica de implementación. Autosave, persistencia o cambios de cierre/elegibilidad no quedan autorizados por este plan.

## M-02 — Consulta fiable de justificaciones

**Prioridad:** P1, segunda. **Estado:** PROPUESTA. **Procedimientos:** PM-04.2 y PM-04.3. **RF:** RF-15 y RF-14; RF-21 de lectura familiar y RF-24 de trazabilidad existente. **Evidencia:** `frontend/src/attendance/JustificationDetail.tsx` — efecto Promise.all, render !item e historial/Pager; `JustificationsPage.tsx` — submit de filtros, page, selected y select de StudentFilter.

**Impacto:** apoderado o revisor puede quedar sin recuperación clara ante fallo o interpretar un detalle anterior como perteneciente al nuevo filtro. La auditoría no acredita decisiones incorrectas consumadas; backend sigue validando.

**Solución mínima:** representar carga/error/resultado vigente por justificación/página y ofrecer retry de lectura; puede mantenerse consulta conjunta si su estado es explícito, sin reestructurar servicios. No mostrar carga interminable junto a error ni historial anterior como actual. Invalidar o cerrar detalle al cambiar filtros/página y añadir nombre accesible específico a select student_id. Mantener comentario cuando falla decisión y no repetir POST automáticamente. Advertir si descartar detalle implica perder comentario editado.

**Archivos previstos:** `frontend/src/attendance/JustificationDetail.tsx`, `frontend/src/attendance/JustificationsPage.tsx`; nuevo spec propuesto `e2e/cypress/e2e/justification-query.cy.ts`. No cambiar transiciones, archivos, endpoints ni permisos. Reutilizar Message, Pager y helpers actuales sin alterar módulos compartidos.

**Criterios de aceptación:**

1. Fallo de GET inicial termina carga e informa error recuperable; retry mantiene ID/página. Éxito posterior no conserva error obsoleto.
2. Historial tiene carga/vacío y página vigentes, conservando orden y datos recibidos: estado, actor, comentario, fecha. Respuesta/error tardío no reemplaza otro contexto.
3. Cambiar filtros o página administrativa no deja un detalle anterior presentado como parte de la nueva consulta. Si hay comentario sin enviar, cancelar mantiene contexto/comentario.
4. GET fallido no dispara review/approve/reject; las acciones se basan en item/abilities/estado vigentes y el servidor decide definitivamente. 403/404 no dejan contenido anterior ni habilitan descarga/decisión como si siguiera autorizado.
5. Un POST rechazado conserva comentario y muestra error; uno confirmado no se reenvía por error posterior de historial. Se mantienen PENDING → IN_REVIEW → APPROVED/REJECTED y comentario obligatorio al rechazar.
6. Select de estudiante tiene nombre accesible individual, búsqueda/selección siguen paginadas y mantienen filtros de API. Retry y avisos se usan por teclado y la pantalla conserva adaptación móvil.

**Pruebas necesarias:** Cypress simulado de GET 500 inicial/parcial de Promise.all, retry correcto, historial vacío/página 2, detalle A retrasado después de B, filtros/resultado vacío y cancelación de comentario; 403/404 sin datos anteriores; error POST sin borrado, éxito POST + fallo de historial sin doble decisión; nombre accesible/foco/activación nativa y viewport móvil. Regresión real `attendance.cy.ts` y Pest de justificación/vínculos/rollback/rechazo en aislamiento.

**Riesgos/limitaciones:** habilitar acciones desde un detalle anterior, perder comentario al desmontar, mezclar error de descarga/decisión con error GET. No supone apelación, reenvío, nueva descarga o acceso familiar a audit-logs. Teclado se debe comprobar, no dar por aprobado por usar botones nativos.

**Aprobación institucional:** no requiere otro estado o actor; aprobación técnica previa de los cambios. Cualquier ampliación de acceso o posibilidad de reenvío tras rechazo exige definición nueva y queda excluida.

## M-03 — Recuperación y contexto de consulta personal/familiar

**Prioridad:** P2, tercera. **Estado:** PROPUESTA. **Procedimiento:** PM-04.3; PM-04.2 por coherencia del formulario/detalle asociados. **RF:** RF-14 y RF-21; RF-15 de solicitud existente. No modifica RF-23/reportes ni cálculos de indicadores. **Evidencia:** `frontend/src/attendance/PersonalAttendance.tsx` — efectos de links/asistencia, loading compartido, result mantenido y callbacks de Pager/selección.

**Impacto:** estudiante/apoderado puede confundir una página anterior con la actual o no poder recuperar fácilmente una consulta fallida. El apoderado puede mantener visible un formulario de otra página. No se demuestra fuga de datos entre estudiantes: cambio de estudiante ya limpia el contexto y backend exige vínculo.

**Solución mínima:** separar o derivar estados de carga de vínculos/asistencia y asociar resultados a estudiante/página. Retry de GET con contexto conservado; vacíos distintos (sin vínculos / sin asistencias), mensajes accesibles. Al paginar/cambiar contexto, cerrar o identificar correctamente detalle/formulario; si se abandona motivo editado, confirmarlo sin perderlo al cancelar. No restablecer un formulario por un simple fallo GET/POST.

**Archivos previstos:** `frontend/src/attendance/PersonalAttendance.tsx`; nuevo spec propuesto `e2e/cypress/e2e/personal-attendance-query.cy.ts`. `JustificationDetail.tsx` se reutiliza tal como quede en M-02; no duplicar sus estados ni volver a modificar reglas. Sin cambios en StudentSummary, dashboards, reportes, controles globales o backend.

**Criterios de aceptación:**

1. GET de vínculos y GET de asistencia tienen carga y error coherentes; concluir uno no hace desaparecer prematuramente la carga del otro. No mostrar datos de estudiante/página anterior como actuales.
2. Retry mantiene estudiante, página y endpoint fallidos; éxito elimina error y no envía ninguna solicitud de justificación. Distinguir ausencia real de vínculos/registros de fallo HTTP.
3. Elegir estudiante conserva reinicio de page=1 y limpieza existente; paginar vínculos/asistencias no deja formulario o detalle atribuido a contexto equivocado. Cancelar abandono de motivo conserva consulta y texto.
4. Respuestas fuera de orden no reemplazan consulta más reciente. Rechazo 403/404 no conserva registros/acciones anteriores como vigentes. Roles y vínculos del servidor siguen siendo definitivos.
5. Enviar justificación continúa exigiendo can_justify, motivo y archivo opcional válido; error conserva el formulario, sin autoguardado ni POST automático por retry de consulta. No añade controles administrativos al estudiante.
6. Foco, etiquetas, estados anunciables y paginación se comprueban con teclado y móvil. Las fórmulas y filtros de los reportes permanecen iguales.

**Pruebas necesarias:** Cypress simulado de estudiante propio; apoderado con dos vínculos/páginas; GET lento/500 y retry de la consulta exacta; vínculos vacíos/asistencia vacía; A retrasado después de B; formulario y detalle abiertos al paginar; cancelar descarte; 403/404; POST fallido con motivo conservado. Regresión `attendance.cy.ts` y `reports.cy.ts`; Pest existente de histórico propio/vínculos/privacidad de dashboard solo en aislamiento. No exigir casos nuevos de estadísticas para justificar un cambio de fórmula inexistente.

**Riesgos/limitaciones:** selecciones reseteadas por retry de vínculos, limpiar motivo por error de consulta, atribuir éxito POST a otro estudiante después de cambiar contexto, confundir vacío y prohibición. No ofrece historial familiar global ni nuevos filtros por fecha/periodo para la API personal. Las pruebas de indicadores existentes caracterizan el contrato; no desarrollan estadísticas adicionales.

**Aprobación institucional:** no se requiere regla nueva para recuperación de lectura; sí aprobación técnica del alcance. La necesidad de periodo nominal, otra fórmula o alertas sigue fuera de la selección y requiere decisión institucional.

## Seguridad y pruebas: situación actual y siguiente etapa

| Actor/control | Comprobado por lectura | Pruebas existentes pertinentes, no ejecutadas |
| --- | --- | --- |
| Docente | attendance.view/create/update/close + institución y curso asignado; registro exige sesión OPEN/curso ACTIVE/roster APPROVED. | Sprint8Test: gestión/cierre, docente ajeno, roster/atomicidad, duplicados. |
| Administración | Permisos efectivos y contexto institucional; revisión con rol/permisos. Crear justificación sigue exigiendo vínculo de apoderado. | Sprint8Test: aislamiento y decisiones; Sprint10Test: restricciones de reportes. |
| Secretaría | attendance.view, justifications.view/review/approve/reject; sin escritura ordinaria de asistencia por su rol estándar. | Sprint8Test: revisión/rollback/rechazo; attendance.cy.ts. |
| Estudiante | attendance.view y perfil propio activo; histórico permanece tras cambio de matrícula. No justifica ni registra asistencia. | Sprint8Test: histórico personal/denegación de escrituras y otro estudiante. |
| Apoderado | attendance.view, justifications.view/create + perfil activo/vínculo; el guardian de ruta debe ser el de la cuenta. Sin aprobación/reportes institucionales. | Sprint8Test: vínculo y archivo privado, apoderado ajeno; Sprint10Test: privacidad de dashboards. |
| Institución y relaciones | Scope BelongsToInstitution; campos institucionales/autoría/rutas de archivo prohibidos en AttendanceRequest; referencias por modelos autorizados. | Sprint8Test: aislamiento de sesiones/registros/justificaciones; Sprint10Test: filtros/selectores/propiedad. |

Archivos revisados de esta tabla: `backend/app/Services/Attendance/AttendanceAccess.php`, `backend/app/Policies/AttendancePolicy.php`, `backend/app/Http/Controllers/Api/AttendanceController.php`, `backend/app/Http/Requests/AttendanceRequest.php`, servicios AttendanceService/JustificationService y pruebas indicadas. No se certifica seguridad por ejecutar solo mocks; no se amplían permisos personalizados o mixtos desde React.

Inventario heredado contrastado: **10 casos en `backend/tests/Feature/Sprint8Test.php`, 5 generales en `backend/tests/Feature/Sprint10Test.php`, 3 en `e2e/cypress/e2e/attendance.cy.ts` y 2 generales en `e2e/cypress/e2e/reports.cy.ts`: 20 casos definidos identificados, todos NO EJECUTADOS en esta fase.** No todos son exclusivos de asistencia y no cubren todas las carreras, errores o variantes propuestas. Cero aprobaciones actuales y cero fallos de ejecución actuales porque no se ejecutó ningún caso, no porque se haya obtenido suite verde.

Faltan casos focalizados de borrador entre sesiones, edición durante POST/recarga, retry GET por contexto, estados parciales de detalle/historial, cambios de filtros/páginas con formulario abierto y accesibilidad del selector. La fase de implementación deberá añadirlos con interceptaciones sintéticas, verificar build/ESLint/TypeScript E2E y registrar resultados exactos. No se escribe ahora ningún test ni se prometen cantidades aprobadas.

Pest y Cypress real requieren antes acreditar entorno aislado: para Pest, `backend/AGENTS.md` exige MySQL/base/usuario `zarate_test`, testing y configuración no cacheada; para navegador real, servicios/datos aislados verificables. La disponibilidad actual es NO VERIFICADA. No lanzar fixtures sobre zarate_dev, datos institucionales o una base no acreditada; no crear demo ni cambiar configuración para completar cifras. Pruebas de roles, institución, matrícula e historial reales no se sustituyen por pruebas de presentación con API simulada.

## Orden, decisiones excluidas y control documental

1. **Revisar y aprobar M-01 primero**: aborda el posible descarte de trabajo no enviado. La primera implementación deberá reproducir sus dos escenarios deterministas con mocks y mantener acotada la protección a transiciones locales/guardado; no extenderla a navegación global sin revisar alcance.
2. Implementar M-02 después: recupera el flujo de revisión/consulta y su contexto sin modificar estados, permisos o archivos privados.
3. Implementar M-03 finalmente: reutiliza M-02 y corrige recuperación de consulta personal/familiar. Regresión conjunta evita que filtros o limpieza de contexto borren formularios legítimos.

No se seleccionan: nuevo módulo de asistencia/justificaciones, tablas de métricas, prevención duplicada de duplicados, autoguardado, calendario obligatorio de registro, apelación/reenvío, cambio de fórmula, periodo nominal, alertas, estadísticas predictivas, permisos familiares ampliados ni refactorización de otros procesos. Las decisiones institucionales sobre nombres/periodo/fórmula siguen explícitas; no constituyen una cuarta mejora.

Solo se crean `prompt-02-validacion.md` (copia completa del adjunto, verificada por SHA-256) y este plan. El diagnóstico, prompt 01 y evidencias de otros Bolts permanecen intactos. Se comprueban formato/alcance y `git diff --check`; no se consideran pruebas funcionales. No se hicieron commits, push, merge o Pull Requests. **Este plan queda listo para revisión; no autoriza afirmar implementadas o probadas M-01, M-02 o M-03.**
