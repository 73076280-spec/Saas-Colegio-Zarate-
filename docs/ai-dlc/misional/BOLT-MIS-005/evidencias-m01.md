# BOLT-MIS-005 — Evidencias de M-01: protección de borradores de asistencia

Fecha: 01/11/2026. Rama verificada: `feature/asistencia-seguimiento`. HEAD inicial: `6533ece`. `git status --short` estaba vacío: no había cambios previos del usuario que conservar. Se leyeron diagnóstico, plan y prompt 02 y se contrastaron componentes, contrato de asistencia y permisos antes de modificar código.

## Problema original y alcance

En `frontend/src/attendance/AttendanceCourse.tsx`, el componente interno `AttendanceRoster` mantiene marcaciones/observaciones en memoria. Seleccionar otra sesión remonta el componente por ID y perdía la edición no enviada sin aviso. Al guardar, la instantánea del POST podía diferir de nuevas ediciones permitidas mientras se resolvía POST/GET; el GET de refresco reemplazaba todo el borrador. No se afirma corrupción de datos persistidos.

El error de POST ya conservaba el borrador y las confirmaciones al paginar/cerrar ya existían. El efecto ya ignoraba respuestas antiguas mediante `active`. Se mantienen esas capacidades y se prueban; no se presentan como funciones inventadas desde cero.

La implementación sigue **M-01 del plan**: transiciones locales de asistencia y guardado/recarga. No se implementan M-02 ni M-03. La protección de toda navegación SPA entre cursos/pestañas está excluida expresamente por el plan y requeriría coordinar componentes de Enseñanza-aprendizaje que este prompt prohíbe modificar. Esa parte del objetivo amplio no queda resuelta por este cambio.

## Archivos modificados o creados

| Archivo | Motivo |
| --- | --- |
| `frontend/src/attendance/AttendanceCourse.tsx` | Comparar borrador/base; confirmar cambio de sesión/fecha local; bloquear operaciones durante POST/GET; distinguir éxito de escritura y fallo de lectura; reintentar GET; aviso de recarga/cierre. Solo asistencia. |
| `e2e/cypress/e2e/attendance-draft.cy.ts` | Dieciséis casos focalizados con API y datos sintéticos; ningún dato institucional. |
| `docs/ai-dlc/misional/BOLT-MIS-005/prompt-03-implementacion-m01.md` | Copia íntegra del adjunto recibido, contrastada por SHA-256. |
| `docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m01.md` | Este registro de cambios, ejecución y límites. |

No se modificaron backend, reglas, roles/permisos, migraciones, tablas, endpoints, datos ni dependencias. No se editaron TeachingPage, CourseLearning, router, módulos de Matrículas/Evaluación u otros procesos. Tampoco PersonalAttendance, JustificationDetail o JustificationsPage: M-02/M-03 permanecen pendientes. Diagnóstico, plan y prompts anteriores se conservan intactos. No se realizaron commits, push, merge o Pull Requests.

## Solución y comportamiento

- Se conserva una base en memoria por sesión/página y se compara con estado/observaciones del borrador. Restablecer los valores originales elimina «Cambios sin guardar»; un borrador limpio no permite un guardado innecesario. No hay autosave ni persistencia local.
- Seleccionar otra sesión pide confirmar solo si existen cambios. Cancelar mantiene la sesión y los campos; confirmar descarta expresamente. Seleccionar la misma sesión no remonta ni pregunta. Crear otra fecha exige confirmar el abandono en la acción explícita «Crear sesión», antes del POST: cancelar no crea sesión ni guarda asistencia.
- El roster comunica al componente padre si tiene edición o petición pendiente. Durante POST/recarga se bloquean marcaciones, observaciones, guardado, cambio local de sesión/creación y paginación/cierre incompatibles. Los Pagers reutilizados se incluyen en fieldsets deshabilitados sin modificar su módulo compartido.
- Se mantienen confirmaciones al cambiar página y cerrar; al cambiar página se invalidan las filas anteriores. La lista de sesiones no representa filas anteriores como vigentes mientras carga.
- POST rechazado deja el borrador y libera controles, mostrando el error del servidor. POST confirmado actualiza la base de la instantánea guardada y muestra «Asistencia guardada»; se bloquea edición hasta concluir refresco. Si falla ese GET, se informa el fallo de consulta separado del éxito de escritura y se permite **reintentar únicamente GET de la misma sesión/página**. No se repite POST automáticamente.
- Cerrar con confirmación explícita conserva la operación existente; tras éxito se recarga para mostrar lo realmente persistido, sin representar una edición descartada como si se hubiera guardado. CLOSED sigue sin permitir edición.
- La limpieza `active` del efecto evita aplicar respuestas de un roster desmontado a otro contexto. No se cancela físicamente la petición antigua ni se implementa resolución de conflictos entre dos docentes.
- Se registran estados mediante `role=status` y errores mediante Message existente. Inputs y selects conservan nombres accesibles. Guardado con Enter nativo y disposición móvil se prueban con datos simulados.

## Recarga y navegación: mecanismo y límite

Se instala un listener nativo `beforeunload` solo mientras hay borrador modificado o una escritura pendiente. Ejecuta `preventDefault` y asigna returnValue; se retira al quedar limpio o desmontar. No escribe en localStorage, sessionStorage, IndexedDB, archivos o servidor. La pantalla advierte que el borrador solo permanece allí y que debe guardarse antes de cambiar de curso/pestaña.

El test despacha un evento beforeunload cancelable y comprueba su cancelación cuando hay cambios y ausencia cuando está limpio/tras descarte. **Esto verifica el listener, no que el navegador muestre siempre un diálogo nativo.** La política de activación del navegador, cierre del proceso/sistema operativo y ciertas plataformas pueden impedir el aviso. Si el usuario confirma salir o recargar, el borrador puede perderse; no hay recuperación tras recarga.

**No bloquea la navegación SPA entre cursos, pestañas o rutas del resto de la aplicación.** El componente de asistencia no controla esas transiciones y no se modificaron módulos excluidos. La prueba de respuesta tardía al abrir otro curso se realiza sin borrador cargado: acredita limpieza HTTP al desmontar, no protección global de edición al navegar. No se utiliza beforeunload como sustituto de un bloqueador de rutas.

## Trazabilidad y reglas preservadas

Procedimiento principal: **PM-04.1 — Registrar asistencia de estudiantes**. RF directo: **RF-13 Gestión de asistencia**. RF-04 Gestión de roles y permisos y RF-24 Auditoría del sistema siguen como controles existentes, no nuevas funciones de este cambio. RF-05/06 sustentan identidad/elegibilidad. Fuentes: `docs/traceability.md` y `docs/requirements-status.md`.

Contratos inspeccionados: `backend/app/Services/Attendance/AttendanceService.php::records/session`, `backend/app/Policies/AttendancePolicy.php`, `backend/app/Http/Requests/AttendanceRequest.php`, `backend/app/Services/Attendance/AttendanceAccess.php`, `backend/app/Services/Courses/CourseAccess.php`. El servidor conserva OPEN/CLOSED, curso ACTIVE, roster APPROVED, ámbito de docente/institución, lote 1–100, estados PRESENT/ABSENT/LATE, upsert/índices únicos y transacción/auditoría. JUSTIFIED continúa reservado a la aprobación de justificaciones.

En UI se conserva `session.abilities.update/close`, curso cerrado, filas can_record y exclusión de faltas con justificación. El test del payload confirma que no se envían filas históricas no elegibles ni justificadas. Los casos de solo lectura y sesión cerrada no muestran guardado/cierre. Son comprobaciones de presentación y solicitudes simuladas, **no validación real de RBAC ni de aislamiento institucional**.

## Correspondencia con aceptación del plan

| Criterio M-01 | Evidencia disponible |
| --- | --- |
| Cancelar/confirmar cambio local, misma sesión y limpio | Casos Cypress de cambio de sesión, descarte y retorno a valores originales. |
| Crear otra fecha sin sustituir silenciosamente ni autoguardar | Caso cancelar/confirmar Crear sesión; cuenta de POST de creación/guardado. |
| Paginación/cierre con confirmación y error de POST conservando draft | Casos de cancelar paginación/cierre, descarte explícito y POST 403/422/500. |
| Bloqueo de edición durante POST/GET, escritura confirmada + lectura fallida | POST/GET retrasados, campos/acciones deshabilitados, GET 500 seguido de retry sin otro POST. |
| Misma sesión/página, solo elegibles y estados reales | Payload esperado exacto y casos de solo lectura/CLOSED. Integridad real pendiente de Pest. |
| Respuestas antiguas, recuperación y accesibilidad | GET anterior tras desmontar, listener de recarga, Enter nativo para guardar, nombres de campos y móvil 390 × 844. No certifica accesibilidad completa. |

## Entorno y registro de verificaciones

Se ejecutaron comprobaciones con dependencias existentes. Vite no estaba disponible en la comprobación inicial; se inició con `npm run dev -- --host localhost` en `frontend`, sin editar configuración. No se lanzó Cypress antes de disponer de Vite.

El primer TypeScript E2E detectó **TS2769** en el nuevo spec: alias concatenado de cy.wait inferido como string en lugar de `@${string}`. Se corrigió con template literal y se repitió el comando correctamente. No se modificó aplicación para hacer pasar esa comprobación. El comando inicial que encadenaba consulta HTTP no representa typecheck aprobado por su código de salida final: se conserva el error reportado.

Los fixtures usan IDs y nombres ficticios; no hay logs nuevos de estudiantes reales. Todas las llamadas de los specs seleccionados se interceptan y no se escribe en una base académica. Cypress usa Electron 146 headless y emite aviso de deprecación, sin instalar otro navegador ni dependencias.

| Verificación | Resultado real |
| --- | --- |
| `npm run build`, desde `frontend` | APROBADO; TypeScript y Vite finalizaron, 100 módulos transformados. |
| `npm run lint`, desde `frontend` | APROBADO, código 0, sin errores reportados. |
| `npm run typecheck`, desde `e2e`, después de corregir el alias | APROBADO, código 0. El primer TS2769 se conserva documentado arriba. |
| `attendance-draft.cy.ts` | **16 aprobadas, 0 fallidas, 0 pendientes/omitidas**, 38 segundos del runner. |
| `assessment-context.cy.ts` | **12 aprobadas, 0 fallidas**, regresión simulada de contexto de evaluaciones. |
| `score-history.cy.ts` | **9 aprobadas, 0 fallidas**, regresión simulada de historial de notas. |
| `virtual-access.cy.ts` | **9 aprobadas, 0 fallidas**, regresión simulada de navegación/permisos del aula. |
| `submission-deadline.cy.ts` | **10 aprobadas, 0 fallidas**, regresión simulada de vencimientos de entregas. |
| `learning-filters.cy.ts` | **10 aprobadas, 0 fallidas**, regresión simulada de filtros docentes. |
| Conjunto Cypress | **66 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas; código 0; 1 minuto 57 segundos.** Una ejecución conjunta; no se suman pruebas de sesiones anteriores. |
| `git diff --check` y revisión adicional de archivos nuevos | APROBADO, sin errores de formato detectados. |
| Integridad del prompt | SHA-256 de adjunto y copia coinciden. |

Comando ejecutado desde `e2e`:

```powershell
npm test -- --spec cypress/e2e/attendance-draft.cy.ts,cypress/e2e/assessment-context.cy.ts,cypress/e2e/score-history.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts,cypress/e2e/learning-filters.cy.ts
```

Casos nuevos ejecutados: base limpia y retorno a valores originales; cancelar cambio de sesión; descarte explícito/misma sesión; creación de otra fecha; paginación con borrador; POST/GET lentos y exclusión de filas no editables del payload; errores POST 403, 422 y 500 (tres casos); POST exitoso + GET fallido/reintento; respuesta de curso anterior; cierre con confirmación y refresco real de fixture; permiso mínimo y sesión cerrada (dos casos); listener de recarga; Enter nativo/móvil. Total: 16, sin añadir reintentos o variantes dentro de un caso como casos separados.

La activación de Guardar por teclado utiliza CDP con keyDown de Enter incluyendo `text` y `unmodifiedText` de retorno de carro, seguido de keyUp, sobre botón enfocado. Se comprueba la petición y su resultado, sin clic sobre Guardar como sustituto de la tecla. La comprobación móvil usa 390 × 844 y verifica ausencia de desbordamiento horizontal. No se certifican todos los navegadores, tecnologías asistivas o conformidad WCAG completa.

## Pruebas reales no ejecutadas

- **Pest `backend/tests/Feature/Sprint8Test.php`: NO EJECUTADO, 10 casos identificados.** Conforme a `backend/AGENTS.md`, se hizo un preflight de lectura con PHP portátil `..\.tools\php\php.exe`, APP_ENV testing y destino/base/usuario `zarate_test`, DB_URL vacío, sin configuración cacheada y comprobando destino antes de SELECT DATABASE()/CURRENT_USER(). La conexión falló con código **2002**. No se acreditó disponibilidad/aislamiento operativo y no se lanzaron fixtures, migraciones ni seeders. El timeout de conexión se acotó en memoria de ese proceso de testing, sin modificar configuración persistente.
- **Cypress real `e2e/cypress/e2e/attendance.cy.ts`: NO EJECUTADO, 3 casos.** El puerto local 8000 no estaba disponible en una comprobación TCP sin invocar la aplicación y no había backend/base aislados acreditados. No se inició Laravel ni se usaron usuarios/datos de desarrollo para forzar ejecución.
- Alcance real contado: **13 casos NO EJECUTADOS**, no fallidos ni skipped del runner. Las suites de reportes y otras familias backend no se reejecutaron ni se contabilizan con cifras inventadas. No se corrió toda la suite del proyecto.

## Riesgos residuales y estado

La protección es de estado local, no garantía de conservación ante recarga, cambio externo de curso/pestaña/ruta, sesión expirada o caída del navegador. No resuelve actualizaciones simultáneas de dos docentes ni sabe si una escritura cuya respuesta se pierde fue confirmada por el servidor; no reintenta POST automáticamente. Datos o permisos pueden cambiar entre consultas: el servidor sigue siendo definitivo.

Los nombres/alcances institucionales amplios de PM-04.3 y el periodo nominal continúan como asuntos no verificados del diagnóstico, sin relación con cambiar el borrador ni autorización para implementar M-02/M-03.

**Estado final: PARCIAL respecto al objetivo amplio de protección de navegación; alcance local de M-01 del plan implementado y validado con API simulada.** Los seis criterios locales del plan tienen evidencia focalizada, build/lint/tipos aprobaron y 66 casos simulados aprobaron. La parte no cubierta es la prevención del descarte al navegar globalmente entre cursos/pestañas/rutas: se mantiene el límite explícito del plan y la prohibición de editar esos módulos. No se afirma que el aviso beforeunload garantice recuperación, ni que los 13 casos reales estén aprobados.

Para ampliar la protección global se requiere revisar el alcance de coordinación con el router/componentes de Enseñanza-aprendizaje antes de modificarlos. No se introduce un interceptor genérico de navegación ni almacenamiento sensible para eludir esa restricción. No queda una prueba ejecutada fallida sin resolver; sí la limitación funcional indicada y la integración real pendiente. M-02 y M-03 no están implementadas por esta intervención.

## Validación complementaria — PROMPT 03B: navegación SPA

Fecha: 01/11/2026. Rama comprobada nuevamente: `feature/asistencia-seguimiento`, HEAD `6533ece`. Esta sección se agrega sin sustituir el registro original ni sus resultados, incluido el TS2769 inicialmente detectado y corregido en la fase anterior.

### Estado inicial y conservación de cambios

Al comenzar 03B ya estaban pendientes el cambio de `frontend/src/attendance/AttendanceCourse.tsx` y los tres archivos nuevos de 03: spec de borradores, prompt y este documento. Se conservan. No se supone un árbol limpio ni se atribuyen estos cambios a una implementación nueva de navegación. El diff de AttendanceCourse respecto a HEAD tenía 53 inserciones y 22 eliminaciones, antes de 03B.

En esta intervención solo se crea `docs/ai-dlc/misional/BOLT-MIS-005/prompt-03b-navegacion.md`, con el prompt completo del usuario, y se añade esta sección a `evidencias-m01.md`. No se altera código funcional, suites existentes, rutas, autorización, reglas, backend, dependencias ni otros macroprocesos.

### Enrutador y mecanismos realmente disponibles

Se examinaron plan/evidencias, `frontend/src/attendance/AttendanceCourse.tsx`, `frontend/src/App.tsx`, `frontend/src/main.tsx`, `frontend/src/layouts/AppLayout.tsx`, `frontend/src/courses/TeachingPage.tsx`, `frontend/src/learning/CourseLearning.tsx` y el paquete instalado `react-router`/`react-router-dom` **7.18.4**, declarado en `frontend/package.json`.

| Punto verificado | Evidencia y consecuencia |
| --- | --- |
| Enrutamiento actual | `App.tsx` utiliza `BrowserRouter` + `Routes`, incluidas rutas descendientes dentro de AuthProvider. No hay `RouterProvider` ni router de datos creado por `createBrowserRouter`. |
| Menú institucional | `AppLayout.tsx` utiliza NavLink/Link y navegación programática con useNavigate. Un aviso beforeunload no intercepta esas transiciones internas. |
| Bloqueador oficial | En `frontend/node_modules/react-router/dist/development/chunk-GR4NQCSD.js`, `useBlocker` obtiene DataRouterContext/DataRouterStateContext y exige que existan. `useDataRouterContext` rechaza su uso sin router de datos. Los nombres de chunks pertenecen a esta instalación, no son APIs a importar. |
| Confirmación de librería | `usePrompt` de `chunk-HQO5H5CC.js` llama a useBlocker; no proporciona una alternativa para BrowserRouter. |
| Navegador declarativo | BrowserRouter construye historial y lo pasa a Router como navigator. La interfaz Navigator instalada expone createHref, go, push y replace, sin método público `block`. No se encontró un bloqueador reutilizable en `frontend/src`. |
| Cambio de curso sin cambio de URL | `TeachingPage::show` limpia detail y carga otro curso; `CourseLearning key={detail.id}` se remonta. Cambiar de curso puede desmontar el borrador en la misma ruta `/app/my-courses`. Un bloqueador de rutas, aun disponible, no cubre por sí solo esta transición. |
| Cambio de pestaña | `CourseLearning` cambia estado React y reemplaza AttendanceCourse por otro panel. Tampoco requiere navegar a otra URL. |

Se ejecutó además una prueba de compatibilidad de solo memoria con los paquetes instalados: renderizar mediante ReactDOMServer un componente que invoca `useBlocker(true)` bajo `MemoryRouter`, otro router declarativo sin DataRouterContext. Se exigió recibir el error esperado y el proceso terminó con código 0:

```text
DECLARATIVE_ROUTER_BLOCKER_REJECTED: useBlocker must be used within a data router.
```

Esta comprobación **no ejecuta App en BrowserRouter ni es una prueba Cypress de navegación**: confirma la precondición del hook en un router declarativo. La incompatibilidad concreta de BrowserRouter se respalda por la inspección de su implementación y del contexto requerido. No se cuenta como un caso académico aprobado ni como un fallo inesperado.

### Decisión técnica y alcance no implementado

Se aplica la alternativa explícita del prompt 03B: **no introducir una implementación frágil y conservar M-01 como PARCIAL**. No se afirma imposibilidad universal de proteger navegación con esta versión; la solución oficial disponible exige revisar la arquitectura de enrutamiento actual y además coordinar las transiciones locales de curso/pestaña.

La vía estable para un alcance completo requeriría evaluar migración a router de datos conservando rutas/AuthProvider/Protected, registro del borrador y estado pendiente compartido, useBlocker para navegación real y comprobaciones explícitas antes de `TeachingPage::show` y cambios de pestaña. No es insertar un hook local en AttendanceCourse. Afecta el punto global de navegación y necesita revisión y regresión de sus recorridos, por lo que no se implementa como modificación mínima de 03B.

Se descartan interceptar todos los clics del documento, reemplazar métodos de navigator/history mediante APIs internas, revertir popstate después de navegar o controlar solo enlaces del menú. Estas opciones no cubren consistentemente Atrás/Adelante, useNavigate, redirecciones y cambios de estado sin URL; podrían duplicar confirmaciones, cancelar operaciones equivocadas o desmontar el borrador antes de cancelar. No se agrega otro router ni se alteran rutas o permisos para esquivar la precondición.

Las protecciones previas permanecen: dirty/baseline, confirmaciones locales, bloqueo durante POST/recarga, conservación tras error, retry GET sin POST automático, limpieza de respuestas antiguas y aviso beforeunload acotado. **No se intercepta actualmente salir por menú lateral, cambiar curso/pestaña externamente o usar navegación programática.** No se interrumpe ninguna solicitud ni se escribe un borrador persistente.

### Pruebas complementarias y resultados

Se repiten las verificaciones solicitadas sobre el estado conservado, con dependencias instaladas y Vite disponible (HTTP 200 en localhost:5173). No se instalan paquetes, cambian servicios de backend o preparan datos demo. Cypress vuelve a usar API simulada; no es integración real con Laravel/MySQL.

| Verificación en 03B | Resultado real |
| --- | --- |
| `npm run build`, frontend | APROBADO: TypeScript y Vite completados, 100 módulos. |
| `npm run lint`, frontend | APROBADO, código 0. |
| `npm run typecheck`, e2e | APROBADO, código 0. |
| `attendance-draft.cy.ts` | 16 aprobadas, 0 fallidas, 0 pendientes/omitidas; guardado, confirmación local, errores, respuesta antigua, permisos, beforeunload, Enter nativo y móvil. |
| `assessment-context.cy.ts` | 12 aprobadas, 0 fallidas. |
| `score-history.cy.ts` | 9 aprobadas, 0 fallidas. |
| `virtual-access.cy.ts` | 9 aprobadas, 0 fallidas. |
| `submission-deadline.cy.ts` | 10 aprobadas, 0 fallidas. |
| `learning-filters.cy.ts` | 10 aprobadas, 0 fallidas. |
| Total Cypress, nueva ejecución conjunta 03B | **66 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas; código 0; 1 minuto 54 segundos. API simulada.** |
| Compatibilidad useBlocker/router declarativo | Rechazo esperado comprobado, código 0; control técnico separado, no un caso académico. |
| Formato y conservación | `git diff --check` sin errores; checks SHA-256 confirman código y spec de 03 sin cambios y conservación exacta del prefijo original de evidencias. |

Se ejecutó nuevamente desde `e2e` el mismo comando de seis specs registrado en 03. No se suman ambas ejecuciones como 132 casos distintos: esta tabla registra una revalidación de los mismos **66 casos existentes**. No hubo fallos Cypress nuevos en 03B; el error de compatibilidad del hook fue el resultado esperado de un control, no un fallo ocultado ni una implementación del bloqueo.

El control de conservación tomó los primeros 15348 bytes del documento antes de añadir esta sección y verificó después su mismo SHA-256 (`e83a9918a5f9d1f8282ccfc9db1c98ceaf4d715686b936a403dd4a6b37ea6ad3`). AttendanceCourse y attendance-draft mantuvieron respectivamente `409a8e46c82eaf846fffa28c650a9b38756ad14544c79216d68fa19e7b70dbc6` y `aad1ef9774201a19bda8d4fa959753f3d044a8d4963292cb21a00275fd119397`. Así se distinguen los cambios heredados sin commit de los únicos cambios documentales de 03B.

**Pruebas nuevas de aceptación SPA: no agregadas ni ejecutadas**, al activarse la alternativa de no implementar un bloqueo incompatible con esta arquitectura. No se marcan como aprobadas por tener tests de descarte local. La cobertura pendiente para una propuesta arquitectónica posterior es:

- Menú lateral con borrador: cancelar conserva ruta, sesión, página y campos; confirmar navega una vez y descarta solo lo autorizado.
- Navegación limpia: sin confirmaciones ni restricciones adicionales.
- Atrás/Adelante y useNavigate: la cancelación debe ocurrir antes de desmontar, sin manipular historial a posteriori.
- Cambio de curso/pestaña sin cambio de URL: cancelación antes de limpiar detail o reemplazar el panel; no basta useBlocker.
- Solicitud pendiente: ninguna navegación incompatible interrumpe la escritura o duplica POST; al finalizar se conserva el estado correcto y un único aviso cuando corresponda.
- Teclado/móvil del mecanismo elegido y regresión de autenticación, rutas protegidas y navegación de los demás recorridos afectados.

Son escenarios pendientes, no casos contados por un runner ni pruebas omitidas/skipped. Los 16 casos existentes de borradores solo acreditan el alcance local descrito. Los tests nuevos de esta fase no se sustituyen por una prueba que declare «correcta» la pérdida al navegar.

No se ejecutaron Pest ni Cypress de backend real en 03B. Los 13 casos identificados en la sección original siguen **NO EJECUTADOS**; los códigos de conexión/puerto registrados arriba pertenecen al preflight de 03, no se presentan como comprobaciones nuevas en 03B. No hubo otro acceso a MySQL ni acreditación nueva de entorno aislado.

### Estado de M-01 después de 03B

**PARCIAL.** El alcance local sigue implementado y revalidado; la protección global SPA sigue pendiente por la incompatibilidad del bloqueador oficial con el router declarativo actual y por las salidas de contexto sin cambio de URL. No se declara completada con un interceptor parcial ni se afirma protección del menú lateral.

El siguiente paso técnico es una propuesta revisable de arquitectura y alcance para navegación/borrador compartido que preserve rutas, seguridad y cambios de contexto; no se ejecuta aquí una migración global ni se implementan M-02/M-03. No hay commits, push, merge o Pull Requests generados en esta intervención.
