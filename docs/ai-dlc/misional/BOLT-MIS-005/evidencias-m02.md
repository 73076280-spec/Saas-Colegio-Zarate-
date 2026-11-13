# BOLT-MIS-005 — Evidencias M-02: recuperación de consultas de justificaciones

Fecha: 01/11/2026. Rama comprobada: `feature/asistencia-seguimiento`. HEAD inicial: `789ccc1`. El estado Git estaba limpio al iniciar, con M-01 y su validación complementaria ya conservadas en Git. Se leyeron diagnóstico, plan y evidencias M-01 y se contrastaron archivos/endpoints antes de implementar exclusivamente M-02.

## Problema identificado y comportamiento anterior

`frontend/src/attendance/JustificationsPage.tsx` conserva filtros aplicados y page, pero no ofrecía retry de la consulta; al paginar/filtrar mantenía filas de la respuesta anterior mientras esperaba la siguiente. selected no se invalidaba al cambiar consulta. El éxito ya limpiaba el error y el efecto ya protegía con active frente a respuestas obsoletas: se conservan esas protecciones, no se presentan como nuevas.

`frontend/src/attendance/JustificationDetail.tsx` consulta detalle e historial mediante Promise.all. Un fallo inicial mantenía item null y por eso presentaba «Cargando» junto al error, sin recuperación propia. Al cambiar página de historial no distinguía el resultado anterior del vigente. El comentario de una decisión rechazada ya permanecía en el estado local; no se afirmó que se perdiera en todos los errores HTTP.

Se inspeccionaron `backend/app/Http/Controllers/Api/AttendanceController.php::justifications/justification/history/transition`, `backend/app/Policies/AttendancePolicy.php` y el contrato de `AttendanceAccess`, `AttendanceRequest` y `JustificationService`: las lecturas y decisiones siguen autorizadas por institución, rol, permiso y vínculo/alcance en servidor. No se modificaron.

## Archivos realmente modificados o creados

| Archivo | Justificación |
| --- | --- |
| `frontend/src/attendance/JustificationsPage.tsx` | Estado asociado a consulta, carga/error/retry GET, paginación/filtros, invalidación de detalle y etiqueta específica del selector de estudiante. |
| `frontend/src/attendance/JustificationDetail.tsx` | Consulta conjunta recuperable por ID/página, vacío de historial, protección de comentario y separación de errores/confirmación de escritura. |
| `e2e/cypress/e2e/justification-query.cy.ts` | Diecisiete casos nuevos con API simulada, sin datos institucionales. |
| `docs/ai-dlc/misional/BOLT-MIS-005/prompt-04-implementacion-m02.md` | Prompt íntegro recibido como texto del usuario. |
| `docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m02.md` | Este registro. |

No se modificaron AttendanceCourse, sus pruebas de borrador, las evidencias de M-01, PersonalAttendance, rutas, router, backend, roles/permisos, migraciones, almacenamiento o datos reales. No se implementaron M-03 ni módulos de otros procesos. JustificationDetail es compartido con consulta familiar; su mejora de lectura pertenece a M-02 y no modifica el flujo de consultas personales/familiares que está pendiente en M-03.

## Solución aplicada

### Listado y filtros

- La respuesta contiene su clave de consulta: endpoint con filtros/página aplicados y revisión de lectura. Solo se representa cuando coincide con la consulta vigente. Datos/error anteriores dejan de mostrarse como actuales al cambiar de consulta o reintentar.
- «Reintentar consulta de justificaciones» incrementa la revisión y repite únicamente GET con los mismos filtros aplicados y page; no vuelve a leer el formulario para cambiar criterios inadvertidamente. Los valores visibles del formulario permanecen montados.
- Aplicar filtros reinicia page=1 e invalida el detalle seleccionado. Cambiar página/solicitud también cambia el contexto explícitamente. Si hay comentario sin enviar se pide confirmar; cancelar mantiene consulta y comentario. El formulario puede mostrar criterios editados aún no aplicados, como antes; retry usa los criterios efectivamente aplicados.
- Las solicitudes anteriores mantienen la limpieza active. La carga se muestra con página identificable; error no se confunde con vacío. El vacío indica «No hay justificaciones con estos filtros».
- Un 403/404 retira las filas y el detalle anterior y restablece su estado local de selección. Se permite reconsultar por GET, sin ampliar derechos; el servidor vuelve a decidir. 422/500 muestran error recuperable sin conservar filas previas como resultado actual.
- La consulta administrativa solo se inicia para roles ADMINISTRATOR/SECRETARY con `justifications.view`, coherente con la pantalla y el acceso de revisión existentes. No se concede acceso administrativo al apoderado por un permiso aislado.
- El select student_id obtiene el nombre accesible «Estudiante para filtrar justificaciones»; se reutilizan Pager, Message y EmptyState sin alterar sus módulos.

### Detalle, historial y decisiones

- Se conserva Promise.all para ambos GET existentes; no se agrega endpoint ni dependencia. La respuesta queda asociada a ID/página/revisión. Carga y fallo son estados distintos: si cualquiera falla no se presenta como vigente el detalle/historial de otra consulta ni queda carga perpetua.
- Retry repite **GET de detalle y GET de la misma página del historial**. Es una consulta de dos recursos, no un POST de decisión ni un reenvío de aprobación/rechazo. El historial vacío tiene mensaje explícito y mantiene orden/paginación del servidor.
- Respuestas tardías no actualizan un contexto nuevo. El comentario permanece en estado React al reconsultar la misma solicitud; cambiar de solicitud/filtro/página administrativa exige confirmar su descarte si estaba editado.
- Los errores de acciones y la confirmación «Decisión registrada» se distinguen del error de lectura posterior. Un POST rechazado conserva comentario. Un POST confirmado limpia comentario y refresca por GET; un fallo de ese refresco no se interpreta como reversión ni dispara otra escritura. Retry posterior sigue siendo GET.
- Durante escritura/descarga se bloquean acciones incompatibles y cambio de consulta administrativa. Las acciones mantienen condiciones de abilities y estado PENDING/IN_REVIEW; el servidor sigue siendo definitivo. No se agregan estados, apelación o reenvío automático.
- Detalle puede consultarse independientemente del listado dentro del mismo contexto seleccionado. Un error transitorio del listado no convierte por sí mismo en ajeno un detalle autorizado independiente; al cambiar filtros/página o recibir 403/404 de listado se retira. Una lectura fallida del propio detalle no deja acciones ni archivo previo habilitados.

Los reintentos solo usan memoria de React. No se agregan localStorage, sessionStorage, IndexedDB, logs de estudiantes ni persistencia del comentario.

## Procedimientos y RF

| Referencia existente | Alcance de M-02 y evidencia |
| --- | --- |
| PM-04.2 — Justificar inasistencias; RF-15 Justificación de inasistencias | Recuperar listado, detalle e historial del flujo ya implementado; conservar revisión/decisión y comentario. |
| PM-04.3 — Consultar indicadores de asistencia y seguimiento; RF-14 Consulta de asistencia | Coherencia y recuperación de consulta de justificaciones vinculadas a asistencia; no se crean indicadores o filtros de periodo. |
| RF-21 Portal del padre/apoderado | Se reutiliza el detalle mejorado desde el flujo familiar existente, sin ampliar roles, vínculos o reportes. No se declara completada M-03. |
| RF-04 Gestión de roles y permisos; RF-24 Auditoría del sistema | Controles de autorización/trazabilidad heredados intactos; no se consulta audit-logs como sustituto del historial. |

Fuentes RF: `docs/traceability.md`, `docs/requirements-status.md`; alcance de M-02: `plan-mejoras.md` de este Bolt. Endpoints vigentes: GET `/api/v1/absence-justifications` con status/student_id/date/page; GET `/api/v1/absence-justifications/{id}` y `/{id}/history?page=N`. Los POST `/{id}/review`, `/approve`, `/reject` y GET download ya existían y no cambian de contrato. El servidor mantiene PENDING → IN_REVIEW → APPROVED/REJECTED, revisión previa, comentario de rechazo, aislamiento institucional y cambio de asistencia solo al aprobar.

## Ejecuciones, errores y correcciones conservadas

1. Primer build: **falló con TS2322** porque Pager exige Page o null y history derivado podía ser undefined. Se corrigió pasando `history ?? null`. Se repitió build y aprobó. El script que también ejecutaba lint no convierte el build inicial en aprobado por su código final; se conserva el error.
2. Primer TypeScript E2E: **falló con TS2322** por role tipado como string en el fixture. Se restringió a `User['roles'][number]`, sin cambios de permisos reales, y se repitió correctamente.
3. Primera ejecución conjunta de siete specs: **82 aprobadas, 1 fallida, 0 pendientes/omitidas; código 1; 2 minutos 17 segundos**. justification-query obtuvo 16/17; las 66 regresiones aprobaron. El fallo esperaba page=1 pero el alias genérico entregó un request anterior page=2. La UI ya había retirado detalle/filas y mostrado carga de página 1. Se corrigieron los alias del spec para identificar página/filtro; se conservaron las aserciones de URL, retiro de datos y recuperación.
4. La corrección de alias también hace que el caso de respuesta tardía espere expresamente los requests del filtro antiguo y el nuevo, evitando consumir un GET inicial duplicado de StrictMode. No se modificó la aplicación tras el fallo Cypress para hacerlo pasar.

Comando conjunto desde `e2e`:

```powershell
npm test -- --spec cypress/e2e/justification-query.cy.ts,cypress/e2e/attendance-draft.cy.ts,cypress/e2e/assessment-context.cy.ts,cypress/e2e/score-history.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts,cypress/e2e/learning-filters.cy.ts
```

Comando de repetición focalizada tras corregir alias: `npm test -- --spec cypress/e2e/justification-query.cy.ts`.

| Verificación | Último resultado comprobado |
| --- | --- |
| `npm run build`, frontend | APROBADO después de corregir TS2322; TypeScript y Vite completados, 100 módulos. |
| `npm run lint`, frontend | APROBADO, código 0. |
| `npm run typecheck`, e2e | APROBADO, código 0; repetido después de corregir tipos y alias del spec. |
| `justification-query.cy.ts`, repetición focalizada | **17 aprobadas, 0 fallidas, 0 pendientes/omitidas; código 0; 24 segundos**. |
| `attendance-draft.cy.ts`, regresión M-01 | **16 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `assessment-context.cy.ts` | **12 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `score-history.cy.ts` | **9 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `virtual-access.cy.ts` | **9 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `submission-deadline.cy.ts` | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `learning-filters.cy.ts` | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `git diff --check` y comprobación adicional de archivos nuevos | APROBADO, sin errores detectados. |

**Consolidado por último resultado de cada caso: 83 casos Cypress distintos aprobados, 0 fallidos pendientes de resolver, 0 pendientes/omitidos del runner.** Son 17 nuevos y 66 de regresión, todos con API simulada; no se suman reejecuciones ni resultados de sesiones anteriores. Las regresiones aprobaron en la ejecución conjunta que tuvo un fallo del nuevo spec; después solo se ajustó el spec y no hubo cambios de aplicación que invalidaran esas regresiones. No se declara el primer comando global aprobado.

Los 17 casos cubren consulta/campos/etiqueta, 500 + filtros/página preservados, cambio de filtro/vacío/recuperación, 403/404/422 sin filas anteriores (tres casos), filtro tardío, fallo de historial/recuperación, página de historial/vacío, detalle tardío, comentario ante cambio de contexto, POST rechazado + retry GET, POST confirmado + fallo de lectura sin segundo POST, rol no administrativo, capacidades de solo lectura, falta de permiso y Enter/móvil.

La comprobación de teclado activa retry con Enter nativo por CDP, incluyendo retorno de carro en keyDown y keyUp, y comprueba recuperación sin clic sobre el botón como sustituto. Móvil usa viewport 390 × 844 y comprueba que el documento no desborde horizontalmente. Estos son controles acotados de UI; no certificación global. Cypress 16.1.1/Electron 146 emitió aviso de deprecación sin impedir las ejecuciones; Vite estaba disponible en localhost:5173.

## Pruebas reales no ejecutadas

**Pest Sprint8Test.php: NO EJECUTADO, 10 casos identificados.** Se consultó `backend/AGENTS.md` y se hizo preflight con PHP portátil `..\.tools\php\php.exe`, APP_ENV testing y destino/base/usuario exclusivamente zarate_test, DB_URL vacío y sin configuración cacheada; se validó el destino antes de intentar SELECT DATABASE()/CURRENT_USER(). La conexión falló con **código 2002**. El timeout se acotó en memoria del proceso de testing, sin editar configuración. No se accedió a zarate_dev, crearon usuarios, lanzaron fixtures/migraciones/seeders ni se acreditó aislamiento operativo para escribir.

**Cypress real attendance.cy.ts: NO EJECUTADO, 3 casos.** El puerto local 8000 no estaba disponible en comprobación TCP y no se acreditó backend/base aislados. No se inició Laravel sobre desarrollo ni se usaron datos institucionales. Total contado: **13 casos reales NO EJECUTADOS**, no fallos ni skipped del runner. Otras suites backend/reportes no se cuentan con cifras inventadas ni se afirma regresión integral del proyecto.

Las pruebas de permisos/403/404 son respuestas y capacidades simuladas: acreditan presentación y ausencia de nuevas solicitudes no autorizadas de la pantalla, no aislamiento real de otra institución o vínculo familiar. Las verificaciones actuales no reemplazan Pest de acceso ajeno, archivo privado, rollback y estados reales.

## Limitaciones y control de alcance

- M-01 permanece **PARCIAL** respecto a navegación SPA, tal como sus evidencias originales; no se modificó ni se afirma resolverla desde este flujo.
- M-03 sigue pendiente: no se cambia PersonalAttendance ni la recuperación de vínculos/asistencia personal. Compartir JustificationDetail no amplía su alcance a otras consultas.
- No se cancela físicamente tráfico HTTP obsoleto; se ignoran sus resultados. No se resuelve edición simultánea entre revisores ni resultado incierto de un POST cuya respuesta se perdió; retry no reenvía esa operación.
- El comentario solo se conserva mientras vive el componente, con confirmación ante cambios de consulta controlados. No se garantiza persistencia ante salida global, recarga, cierre o expiración de sesión. Un rechazo de autorización puede retirar el detalle por seguridad.
- Se mantiene la semántica de los estados y fórmulas existentes. No se certifica cumplimiento WCAG completo ni todos los navegadores; la comprobación de teclado/móvil se limita a los casos ejecutados.
- No se modificaron evidencias anteriores ni se ocultaron los fallos iniciales de tipos/Cypress. No se instalaron dependencias ni se hicieron commits, push, merge o Pull Requests.

**M-02: COMPLETADA dentro del alcance de interfaz autorizado**, con build/lint/tipos aprobados, 17 casos nuevos y 66 de regresión aprobados por último resultado. No se declara validada contra backend real: permanecen 13 casos reales NO EJECUTADOS. M-01 conserva su limitación SPA y M-03 no se implementó. El estado Git se limita a los cinco archivos enumerados, sin cambios funcionales ajenos ni reescritura de evidencias anteriores.
