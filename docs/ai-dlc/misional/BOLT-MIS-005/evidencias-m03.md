# BOLT-MIS-005 — Evidencias M-03: consulta personal y familiar de asistencia

Fecha: 02/11/2026, America/Lima. Rama comprobada: `feature/asistencia-seguimiento`; HEAD inicial `a8d83c3`. `git status --short` estaba vacío: no había cambios previos sin conservar. Se consultaron diagnóstico, plan y evidencias M-01/M-02 y se contrastó el contrato de consulta antes de modificar exclusivamente M-03.

## Problema original y alcance

`frontend/src/attendance/PersonalAttendance.tsx` compartía un loading entre vínculos y asistencia; terminar el primer GET podía retirar prematuramente la carga del segundo. Al paginar conservaba filas anteriores y no tenía reintento de lectura. Cambiar estudiante ya limpiaba parte del contexto y los efectos ya ignoraban respuestas antiguas mediante active; estas capacidades se mantienen, no se atribuyen como creaciones nuevas. Paginar asistencia no retiraba formulario/detalle de otra página.

El plan M-03 autoriza recuperación/contexto de las consultas personales y familiares existentes, no estadísticas nuevas, filtro por periodo o ampliación de datos. No se modifican fórmulas de dashboard/reportes, permisos, matrícula ni reglas de justificación. M-01 sigue PARCIAL por navegación SPA; M-02 se reutiliza sin cambios.

## Archivos afectados

| Archivo | Cambio |
| --- | --- |
| `frontend/src/attendance/PersonalAttendance.tsx` | Estados de consulta separados, contexto estudiante/página, reintentos GET, resultados vigentes, limpieza/confirmación de contexto y conservación del formulario ante errores. |
| `e2e/cypress/e2e/personal-attendance-query.cy.ts` | Casos focalizados con API y nombres/IDs ficticios, sin información institucional. |
| `docs/ai-dlc/misional/BOLT-MIS-005/prompt-05-implementacion-m03.md` | Copia íntegra del adjunto; SHA-256 coincidente. |
| `docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m03.md` | Este registro. |

No se modifica AttendanceCourse, JustificationsPage, JustificationDetail ni sus pruebas de M-01/M-02. Tampoco backend, migraciones, rutas, roles, permisos, otros procesos o dependencias. No se escriben credenciales o datos personales en almacenamiento persistente ni logs. Los documentos anteriores permanecen intactos.

## Contrato, permisos y alcance de información

Se inspeccionaron `backend/app/Http/Controllers/Api/AttendanceController.php::personal`, `backend/app/Services/Attendance/AttendanceAccess.php` y las reglas/recursos ya enumerados en el diagnóstico:

- GET `/api/v1/my/attendance?page=N`: exige attendance.view y perfil STUDENT activo del usuario. No acepta un ID libre para sustituir al titular.
- GET `/api/v1/profile/family?page=N`: vínculos existentes del apoderado autorizado; la UI usa solo IDs/nombres recibidos, sin obtener un catálogo global de estudiantes.
- GET `/api/v1/guardians/{guardian}/students/{student}/attendance?page=N`: el servidor comprueba permiso, perfil del apoderado, coincidencia del guardian de ruta y vínculo con el estudiante; no se omite Gate ni se confía en el ID elegido por navegador para conceder acceso.
- Las consultas de asistencia siguen paginadas, ordenadas por ID descendente; no se incorpora date/status/periodo como filtro no consumido por este endpoint. La consulta histórica propia sigue el contrato existente aunque cambie una matrícula; la elegibilidad de escritura no se redefine.
- Justificar continúa usando POST `/api/v1/attendance-records/{record}/justifications`, can_justify, motivo obligatorio y archivo opcional con validación definitiva del servidor. El detalle/historial de justificación reutiliza el componente de M-02 y sus GET autorizados.

No se añade porcentaje, promedio, indicador, nivel de acceso o relación familiar. Los nombres provienen del vínculo autorizado o, para identidad propia, de la sesión autenticada. React presenta el dato; no certifica por sí mismo titularidad ni aislamiento institucional.

## Solución y antes/después

1. Vínculos y asistencia tienen respuestas y claves de consulta independientes. La carga de estudiantes vinculados no sustituye a la de asistencia. Solo se representan resultados de la consulta vigente; errores de lectura no se confunden con listas vacías.
2. El contexto indica «Asistencia de [nombre] · Página N». En vista familiar se obtiene nombre del vínculo seleccionado; en personal se usa el usuario autenticado. No se inventan datos para una selección inexistente.
3. Cada GET fallido tiene un reintento específico: estudiantes vinculados conserva familyPage, asistencia conserva endpoint de estudiante y page. Se limpian errores obsoletos mediante respuesta vigente. Ningún retry reenvía POST, PATCH o decisión.
4. Cambiar estudiante reinicia asistencia en página 1; paginar vínculos elige únicamente datos de esa página autorizada y retira contexto anterior. Cada cambio intencional incrementa la revisión de consulta: regresar rápidamente A → B → A no reutiliza una respuesta anterior de A como si fuera la nueva. Las respuestas tardías se ignoran con la limpieza de efectos y las claves vigentes.
5. «No tienes estudiantes vinculados» y «No hay registros de asistencia» son resultados vacíos distintos. Si no hay vínculo/selección no se fabrica endpoint ni ID ni se consulta asistencia de un estudiante anterior.
6. Cambiar estudiante/página retira formulario y detalle. Si existe motivo o archivo seleccionado, se pide confirmación; cancelar conserva selección, página y formulario. El motivo permanece en estado React y el archivo en el input montado, sin persistencia del navegador. Cancelar expresamente el formulario limpia su contexto local.
7. Durante envío se bloquean cambios de contexto y campos incompatibles. Un POST rechazado mantiene motivo/formulario y muestra el rechazo. Un POST confirmado muestra «Justificación enviada», limpia formulario y actualiza asistencia por GET. Si falla ese refresco, se reintenta GET sin repetir alta.
8. 403/404 retiran datos y acciones de la consulta anterior; servidor sigue siendo definitivo. La pantalla verifica rol/permiso ya exigidos y no lanza consultas desde rol ajeno. Se conserva asistencia propia de estudiantes y consulta familiar del apoderado, sin controles administrativos nuevos.

## Criterios y trazabilidad

| Criterio del plan M-03 | Evidencia focalizada |
| --- | --- |
| Carga separada de vínculos/asistencia | GET de asistencia retrasado tras finalizar vínculos; aviso específico de carga hasta completar asistencia. |
| Retry mantiene estudiante/página sin escritura | GET 500 de página 2 familiar y de página 2 de vínculos; URL/parámetros verificados y contador de POST sin cambios. |
| Contexto y borrador al cambiar estudiante/página | Reinicio de página, limpieza de detalle de M-02, cancelar/descarte de motivo al cambiar estudiante o paginar. |
| Respuestas fuera de orden y rechazos | Estudiante anterior retrasado tras nueva selección; 403/404 sin filas/acciones anteriores ni vacío engañoso. |
| Creación conserva reglas/formulario | POST rechazado con motivo conservado; POST confirmado + GET fallido/retry sin segundo envío. |
| Accesibilidad y móvil | Select con etiqueta, estados anunciables, paginación nativa y retry activado por Enter nativo; viewport 390 × 844 sin desbordamiento. |

Procedimiento principal: **PM-04.3 — Consultar indicadores de asistencia y seguimiento**; RF-14 Consulta de asistencia y RF-21 Portal del padre/apoderado. RF-15 Justificación de inasistencias se relaciona solo con conservación del flujo existente. RF-04/24 son controles de seguridad/trazabilidad a conservar, no nuevos módulos. Fuentes: `docs/traceability.md`, `docs/requirements-status.md` y plan del Bolt. No se declara cubierta una estadística adicional o un cuarto procedimiento.

## Pruebas y resultados de esta intervención

Dependencias instaladas; Vite disponible en localhost:5173 (HTTP 200). Build, lint y TypeScript E2E se ejecutan por separado de pruebas funcionales. Cypress 16.1.1 utiliza Electron 146 headless y muestra aviso de deprecación que no impide los casos. Los specs seleccionados interceptan API y usan fixtures sintéticos; no escriben datos académicos reales.

Primera ejecución conjunta de ocho specs: **100 aprobadas, 0 fallidas, 0 pendientes/omitidas; código 0; 3 minutos 10 segundos**. Incluía 17 casos iniciales de M-03 y 83 regresiones. Después se refinó la invalidación al regresar rápidamente al estudiante anterior, se acotó el render del formulario/detalle al contexto familiar correspondiente y se añadió un caso de A → B → A. También se reforzó la aserción de bloqueo durante un POST retrasado. Esta revisión fue preventiva por análisis, no corrección de una prueba fallida. Se repitieron build/lint/tipos y el spec completo de M-03 sobre el código final.

| Verificación | Último resultado comprobado |
| --- | --- |
| `npm run build`, frontend | APROBADO; TypeScript y Vite completados, 100 módulos, repetido tras el ajuste final. |
| `npm run lint`, frontend | APROBADO, código 0, repetido tras el ajuste final. |
| `npm run typecheck`, e2e | APROBADO, código 0, repetido con los 18 casos finales. |
| `personal-attendance-query.cy.ts`, repetición final | **18 aprobadas, 0 fallidas, 0 pendientes/omitidas; código 0; 25 segundos del runner.** |
| `justification-query.cy.ts`, regresión M-02 | **17 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `attendance-draft.cy.ts`, regresión M-01 | **16 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `assessment-context.cy.ts` | **12 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `score-history.cy.ts` | **9 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `virtual-access.cy.ts` | **9 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `submission-deadline.cy.ts` | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `learning-filters.cy.ts` | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| Formato | `git diff --check` sin errores y revisión de espacios/marcadores de conflicto de archivos nuevos. |
| Prompt | SHA-256 de adjunto y copia coinciden: `E2A511812079843438736657342330BDA1D3567F969B7C82F0CE2D77E36E29C0`. |

**Consolidado por último resultado de cada caso: 101 casos Cypress distintos aprobados (18 M-03 + 83 de regresión), 0 fallidos, 0 pendientes/omitidos del runner.** No se suman las dos ejecuciones como casos nuevos ni se afirma que existiera una única ejecución conjunta de 101. Los cambios finales se limitan a PersonalAttendance y su spec; las regresiones ejecutadas no ejercitan esa pantalla y no se modificaron M-01/M-02 ni sus flujos. No hubo fallos funcionales, de compilación o tipos que ocultar en esta intervención. Los casos reales pendientes se contabilizan por separado.

Comando de ejecución conjunta desde `e2e`:

```powershell
npm test -- --spec cypress/e2e/personal-attendance-query.cy.ts,cypress/e2e/justification-query.cy.ts,cypress/e2e/attendance-draft.cy.ts,cypress/e2e/assessment-context.cy.ts,cypress/e2e/score-history.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts,cypress/e2e/learning-filters.cy.ts
```

Repetición final: `npm test -- --spec cypress/e2e/personal-attendance-query.cy.ts`.

Los 18 casos cubren consulta propia, carga familiar separada, cambio de estudiante y página, error de asistencia/retry exacto, error de vínculos/retry exacto, vínculos vacíos, asistencia vacía, respuesta tardía de otro estudiante, regreso rápido A/B/A, 403 y 404 (dos casos), rol ajeno, permiso ausente, cancelar/confirmar motivo al cambiar contexto, detalle de M-02 al paginar, POST rechazado con bloqueo del selector/paginación, POST confirmado seguido de GET fallido sin duplicación y retry por teclado/móvil. No se añade cada variante interna como un caso separado.

Enter se envía mediante CDP con keyDown que incluye `text`/`unmodifiedText` de retorno de carro y keyUp, sobre el botón enfocado; se comprueba recuperación, sin clic como sustituto de la tecla. El test de motivo verifica texto conservado; la conservación del archivo en el input montado se sustenta en código, sin afirmar una carga/descarga real aprobada.

## Pruebas reales no ejecutadas

Se respetó `backend/AGENTS.md`. Preflight de solo lectura con PHP portátil `..\.tools\php\php.exe`, APP_ENV testing, conexión MySQL, base/usuario exclusivamente `zarate_test`, DB_URL vacío y configuración no cacheada; destino validado antes de SELECT DATABASE()/CURRENT_USER(). La conexión falló con **código 2002**. El timeout se acotó en memoria del proceso, sin modificar archivos de configuración. No se intentó escribir ni se conectó a zarate_dev, ejecutaron migraciones/seeders o crearon usuarios para forzar pruebas.

| Suite real identificada | Casos | Resultado |
| --- | --- | --- |
| `backend/tests/Feature/Sprint8Test.php` | 10 | NO EJECUTADOS: disponibilidad/aislamiento operativo no acreditados. Incluye histórico propio, vínculo familiar, denegaciones y justificaciones. |
| `e2e/cypress/e2e/attendance.cy.ts` | 3 | NO EJECUTADOS: puerto local 8000 no disponible por comprobación TCP y no hay backend/base aislados acreditados. |
| Total del alcance real contado | **13** | NO EJECUTADOS, no fallos ni skipped del runner. |

No se ejecutó la suite completa ni se vuelven a contar aprobaciones históricas. Las pruebas simuladas de rol/permiso/403/404 no certifican autorización de Laravel ni privacidad entre instituciones/vínculos reales. No se declara validado backend o base de datos.

## Riesgos residuales y límites

- M-01 mantiene la limitación de navegación SPA documentada; aquí no se bloquea navegación global ni se cambia router. M-02 y sus evidencias se conservan.
- Motivo y archivo solo permanecen mientras vive el formulario. Recarga, salida global, cierre, sesión expirada o revocación pueden retirarlos; no hay recuperación persistente. La confirmación cubre cambios de contexto controlados dentro de esta pantalla.
- No se cancelan físicamente solicitudes antiguas, solo se ignoran sus resultados. No se soluciona edición concurrente o resultado incierto de una escritura cuya respuesta se perdió; nunca se repite automáticamente un POST por un fallo GET.
- La selección familiar se limita a los vínculos de la página autorizada. Nuevos filtros por periodo, cambios de fórmula o ampliación a reportes institucionales siguen fuera del alcance y necesitan confirmación institucional donde corresponda.
- Teclado/móvil se comprueban en el escenario probado; no se certifica WCAG completo, todos los navegadores o tecnologías asistivas.
- No se alteraron documentos previos ni se realizaron commits, push, merge o Pull Requests.

**M-03: COMPLETADA dentro del alcance frontend autorizado.** Los seis criterios del plan están respaldados por inspección y pruebas focalizadas aprobadas, con las limitaciones expresas de archivo/navegación y entorno. No se declara validado el backend: los 13 casos reales permanecen NO EJECUTADOS. M-01 conserva su estado PARCIAL y M-02 no se modifica. El control final de Git se limita a los cuatro archivos enumerados y comprueba que evidencias/código de las mejoras anteriores permanecen intactos.
