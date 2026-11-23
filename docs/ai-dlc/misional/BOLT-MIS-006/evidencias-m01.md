# BOLT-MIS-006 — Evidencias de M-01

Fecha: 02/11/2026. Rama comprobada: `feature/comunicacion-institucional`. HEAD inicial: `c5730cf`. Estado inicial de Git limpio. Estado de M-01: **PARCIAL**: recuperación implementada y diez casos aprobados en la última ejecución, pero un caso de activación con Enter continúa fallando. No se declara validación integral completada.

El prompt completo se conserva en [prompt-03-implementacion-m01.md](prompt-03-implementacion-m01.md); copia byte a byte del adjunto, verificada por hash. Se leyeron el diagnóstico, plan y prompt de validación y se contrastó M-01 con los componentes actuales. No se implementan M-02 ni M-03.

## Problema y evidencia original

`frontend/src/office/CommunicationsPage.tsx` usaba una revisión común para listado/detalle, no ofrecía recuperación explícita de consultas GET fallidas y combinaba errores de escritura/listado/detalle en una sola salida mediante OR. Cambiar el contexto o recargar la pantalla era una recuperación indirecta.

`frontend/src/office/shared.tsx`, `useOffice`, ya vinculaba datos/error a URL y revisión y descartaba respuestas de efectos anteriores mediante limpieza `active=false`. Esa protección se conserva. El hook solo exponía error como texto, sin estado HTTP para distinguir denegación, recurso no disponible y fallo temporal.

La pantalla actual no tiene filtros visibles de título/estado/fecha, aunque el backend los soporta. M-01 no introduce filtros ni categorías nuevas. Conservación y cambio de filtros: **NO APLICA a controles inexistentes**; no se declara una prueba de filtros aprobada. Se conserva la paginación existente y el ID del detalle durante recuperación.

## Archivos afectados

| Archivo | Cambio |
| --- | --- |
| `frontend/src/office/CommunicationsPage.tsx` | Revisiones GET independientes; errores contextuales y reintentos; regiones accesibles de listado/detalle; vacío y carga locales. |
| `frontend/src/office/shared.tsx` | Expone `errorStatus` como dato adicional del error tipado; mantiene `data/error/loading`, URL/revisión y limpieza existentes. |
| `e2e/cypress/e2e/communication-queries.cy.ts` | Nuevo spec de 11 casos con API simulada; captura escrituras para comprobar ausencia de repetición. Conserva el caso de Enter que falla. |
| `docs/ai-dlc/misional/BOLT-MIS-006/prompt-03-implementacion-m01.md` | Prompt íntegro del usuario. |
| `docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m01.md` | Este registro de implementación y ejecuciones. |

No se modifican backend, permisos, migraciones, configuración del router, estilos globales, notificaciones, formulario de borrador ni documentos anteriores.

## Solución funcional y visual

- Listado y detalle tienen revisiones separadas. Reintentar incrementa únicamente la revisión de la consulta afectada: se conserva página o ID y no se vuelve a ejecutar una mutación.
- Guardar/publicar/archivar conserva su flujo de escritura e invalidación de ambas consultas mediante `refresh`; las reglas y permisos siguen siendo del servidor.
- Se separa el error de escritura de los errores de lectura, evitando que un error oculte otro de contexto distinto.
- 403 muestra falta de autorización; 404 muestra contenido no disponible sin confirmar existencia ajena; 422 indica consulta inválida. No se ofrece reintento para esos errores. 401/419 mantienen el manejo de sesión del cliente existente.
- Error de red, 5xx, 408 y 429 permiten recuperación explícita mediante GET; no se incorporan reintentos automáticos ni temporizadores.
- Durante nueva consulta se conservan las garantías existentes de no mostrar datos de una URL/revisión anterior como actuales ni aceptar respuestas de efectos obsoletos.
- Se usan `section` con nombres accesibles y `aria-busy`, mensajes `role=alert`, carga `role=status`, botón nativo «Reintentar consulta» y clases institucionales existentes. El botón es hermano de `Message`, sin anidarlo en su párrafo.
- El vacío de listado exitoso tiene una indicación local coherente; no sugiere utilizar filtros ausentes. El paginador se muestra solo con respuesta disponible y conserva su componente y orden del servidor.

Antes: error de lectura sin recuperación contextual y error combinado. Ahora: recuperación independiente y explícita, sin desmontar el editor por efecto del reintento. Esto no añade protección de borrador ante otras acciones, reservada a M-02.

## Trazabilidad y seguridad

RF-19 — Gestión de comunicaciones: relación directa. RF-20 — Gestión de notificaciones: relación de origen al publicar; no se modifica campana/bandeja ni marcado de lectura. RF-04/RF-24: restricciones transversales conservadas. Códigos originales de procedimientos: **NO VERIFICADOS**; no se crean códigos PM.

Se revisaron `OfficeAccess`, `OfficePolicy`, `CommunicationRecipients`, `CommunicationService`, `OfficeAudit` y las rutas existentes. La lectura sigue exigiendo permisos y destinatario autorizado; gestión por personal permitido; audiencia institucional validada/deduplicada; solo DRAFT editable/publicable; archivo y notificaciones conservan el contrato actual. No se añade almacenamiento persistente del contenido ni nuevas APIs.

Estas afirmaciones de backend son lectura de código sin cambios, **no pruebas dinámicas de aislamiento o auditoría**. El test de ruta sin permiso comprueba únicamente la protección de interfaz con identidad simulada.

## Verificaciones ejecutadas

| Verificación | Comando/contexto | Resultado exacto |
| --- | --- | --- |
| Frontend build | `frontend`: `npm run build` | APROBADO; ejecutó `tsc -b` y Vite; 100 módulos transformados. |
| ESLint | `frontend`: `npm run lint` | APROBADO; proceso terminó con código 0. |
| TypeScript E2E | `e2e`: `npm run typecheck` | APROBADO; primera ejecución y nueva ejecución tras introducir `cy.press`, ambas código 0. |
| Formato diff | `git diff --check` | Sin errores detectados en el diff versionado. |
| Integridad del prompt | Comparación de hash del adjunto y copia | Coincidentes. |

### Historial de Cypress: sin ocultar fallos

Comando base desde `e2e`: `npm test -- --spec cypress/e2e/communication-queries.cy.ts`. Para Edge se añadió `--browser edge`. Todas las peticiones `/api/**` del spec se interceptan, incluidas escrituras; no se usan cuentas ni registros reales.

| Intento | Entorno/procedimiento | Aprobadas | Fallidas | Pendientes/omitidas | Resultado |
| --- | --- | --- | --- | --- | --- |
| 1 | Inicio dentro del sandbox | No ejecutadas | No ejecutadas | Spec no iniciado | Falló arranque: `ERR_SYSTEM_ERROR`, `ENOMEM`, `uv_os_get_passwd`; código 1. |
| 2 | Electron 146 fuera del sandbox | 9 | 2 | 0/0 | Fallaron recuperación del detalle y Enter móvil. |
| 3 | Electron; simulación mantiene error hasta la recuperación explícita | 10 | 1 | 0/0 | Detalle recuperado; Enter seguía fallando usando `.type('{enter}')`. |
| 4 | Electron; `cy.press(Cypress.Keyboard.Keys.ENTER)` | 10 | 1 | 0/0 | Mismo fallo de recuperación con Enter. |
| 5 | Edge 156; misma prueba con `cy.press` | 10 | 1 | 0/0 | El fallo también se reprodujo en Edge; no puede atribuirse solo a Electron. |
| 6 | Edge; clic en región no interactiva para enfocar el marco, luego foco del botón y `cy.press` | 10 | 1 | 0/0 | Última ejecución: 11 casos, 10 aprobados, 1 fallido, 0 pendientes, 0 omitidos; código 1. |

Las reejecuciones no son pruebas únicas adicionales. El primer test de detalle usaba `forceNetworkError` solo en el primer intento: los reintentos de transporte pueden consumir esa simulación; la carga inicial también ocurre bajo StrictMode. Se sustituyó por error HTTP determinista hasta una acción explícita, sin cambiar el componente para hacerlo pasar. El test conserva la comprobación del editor y de ausencia de escrituras. Esta corrección no resuelve ni oculta el caso separado de Enter.

**Casos aprobados en la última ejecución:** carga/listado/paginación sin filas previas; recuperación GET de página 2 conservando detalle; recuperación de detalle conservando texto del editor; errores 403, 404 y 422 sin contenido privado ni botón de reintento; vacío exitoso con controles de gestión ausentes para receptor; respuesta de detalle tardía ignorada; ruta sin permiso; error de publicación separado sin duplicar POST al recuperar detalle.

**Caso fallido:** «recupera con Enter en móvil con nombre accesible y sin desbordamiento». Viewport 390×844. El botón se encuentra y toma foco; después de Enter, la aserción no encuentra «Comunicado 10» recuperado. Se probaron `.type`, `cy.press`, ambos navegadores y enfoque previo del marco. Se inspeccionó la captura de fallo: permanece el error con el botón enfocado. **La causa no está determinada: no se certifica defecto del componente ni se declara problema exclusivo del entorno/test.** No se añadieron manejadores de teclado artificiales a un botón nativo para forzar el resultado.

La captura de fallo de la ejecución más reciente se genera en `e2e/cypress/screenshots/communication-queries.cy.ts/` (artefacto local de Cypress; puede sobrescribirse en reejecuciones). El historial de resultados queda preservado en esta tabla.

## Criterios de aceptación y límites

| Criterio | Evidencia/estado |
| --- | --- |
| Reintento mismo GET/página, sin repetir escritura | APROBADO con API simulada. |
| Detalle independiente y conservación de texto pendiente durante recuperación | APROBADO con API simulada. |
| 403/404/422 contextuales sin revelar mensaje privado | APROBADO con API simulada. |
| 401/419 y sesión | Manejo previo conservado por código; prueba específica NO EJECUTADA. |
| Protección de selección frente a respuesta tardía | APROBADO con API simulada. |
| Vacío distinto de error y restricciones de UI | APROBADO con API simulada. |
| Regresión de escritura al fallar publicación | APROBADO con API simulada: exactamente un POST; no certifica publicación exitosa real. |
| Foco/nombre del botón | Se localiza y toma foco en test; no equivale a aprobación de navegación completa por teclado. |
| Activación con Enter | FALLIDA; pendiente de diagnóstico concluyente. |
| Ausencia de desbordamiento móvil | NO VERIFICADA: la aserción está después del paso de Enter que falla y no se alcanzó. |
| Contraste, lector de pantalla y Tab completo | NO EJECUTADOS; se conservan estilos/foco globales existentes, sin certificar WCAG. |
| Filtros/cambio de filtro | NO APLICA: no existen esos controles en la pantalla; no se añadieron. |

### Integración real no ejecutada

- `e2e/cypress/e2e/office.cy.ts`: **NO EJECUTADA**, 3 casos totales (dos directamente de comunicación/notificaciones y uno de trámites). Usa backend real y crea registros; no se confirmó un entorno de datos aislado.
- `backend/tests/Feature/Sprint9Test.php`: **NO EJECUTADA**, 10 casos mixtos identificados; no se verificó base/usuario MySQL aislados. No se ejecutaron Pest, migraciones, seeders ni usuarios demo. Backend no modificado.
- Seguridad efectiva de Laravel/MySQL, publicación/archivo exitosos reales, destinatarios, transacción y auditoría: **NO VERIFICADOS dinámicamente en esta fase**. No se extrapola de mocks una aprobación institucional.

## Riesgos residuales y conclusión

M-01 permanece **PARCIAL** por el caso fallido de Enter y la validación móvil que no llegó a ejecutarse. Antes de cerrarla, reproducir la activación con un procedimiento de navegador controlado que distinga foco del marco, evento de teclado, click nativo y GET emitido; contrastarlo con una activación manual. No eliminar el caso ni sustituir Enter por click para declararlo aprobado. La siguiente revisión debe resolver si el origen es herramienta, procedimiento o componente.

La extensión de `useOffice` es aditiva, pero sus consumidores compartidos tienen regresión dinámica real pendiente. Errores de red/408/429 tienen tratamiento por código, sin prueba dedicada ejecutada. Las limitaciones de borradores y notificaciones de M-02/M-03 siguen fuera de esta implementación. No se generaron commits, push, merge ni Pull Requests.

## Validación complementaria — PROMPT 03B, 02/11/2026

Esta sección agrega resultados posteriores y conserva íntegros los fallos y conclusiones históricas anteriores. **Estado final actualizado de M-01: COMPLETADA dentro del alcance de interfaz con API simulada**, con las limitaciones de integración real y accesibilidad global indicadas al final. No se declara cerrado todo BOLT-MIS-006.

### Estado del repositorio y alcance

Rama confirmada: `feature/comunicacion-institucional`; HEAD `c5730cf`. Al comenzar existían los cambios de la implementación M-01 anterior: `CommunicationsPage.tsx`, `shared.tsx`, el nuevo spec, el prompt 03 y estas evidencias. Se conservaron. En esta validación **no se modificó código funcional** ni los cambios previos de frontend; se ajustó únicamente la simulación de teclado y se agregó una prueba móvil independiente.

Archivos creados/modificados por PROMPT 03B:

- `e2e/cypress/e2e/communication-queries.cy.ts`: secuencia nativa de Enter, comprobación de click confiable y estado del botón; caso separado de desbordamiento móvil.
- `docs/ai-dlc/misional/BOLT-MIS-006/prompt-03b-validacion-teclado.md`: prompt completo de esta solicitud.
- `docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m01.md`: esta sección agregada.

Se intentó iniciar Vite, pero el puerto 5173 ya estaba ocupado por el servicio existente. El intento no inició otro servidor; las pruebas utilizaron el servicio ya disponible. No se modificó su configuración ni se interrumpieron procesos existentes.

### Control exacto y diagnóstico reproducible

Control: botón «Reintentar consulta» dentro de `[aria-label="Listado de comunicados"]`, generado por `QueryError` en `frontend/src/office/CommunicationsPage.tsx`. HTML: `<button type="button" className="institutional-button" onClick={retry}>`. Está fuera del formulario de borrador; no tiene `disabled`, `tabIndex` negativo ni un manejador que cancele Enter. Se verificaron en navegador visibilidad, estado habilitado, atributo `type="button"` y foco.

El fallo anterior era `expected '<section.space-y-3>' to contain 'Comunicado 10'`: después de la supuesta activación no se recuperaba el listado. El alias general `@list` podía representar una petición inicial pendiente, por lo que ese `wait` aislado no demostraba una activación por teclado.

Se instrumentó el botón con listeners de observación de `keydown`, `keyup` y `click` (solo dentro del test, sin cambiar handlers ni cancelar eventos). Reejecutando el caso con `cy.press(Cypress.Keyboard.Keys.ENTER)`, los eventos observados fueron **`['keydown:true', 'keyup:true']`**, sin `click:true`. La aserción diagnóstica falló explícitamente: `native keyboard activation events: expected [ 'keydown:true', 'keyup:true' ] to include 'click:true'`. Esto demuestra que el procedimiento anterior entregaba eventos de teclado confiables pero no la activación nativa esperada en ese entorno.

Se contrastó con una secuencia nativa completa enviada al navegador Chromium mediante el canal CDP existente de Cypress (`Cypress.automation('remote:debugger:protocol')`): `Input.dispatchKeyEvent`, primero `keyDown` con `key/code=Enter`, códigos virtual/nativo 13 y `text/unmodifiedText='\r'`, después `keyUp`. El helper local se llama `nativeEnter`. **No llama a `.click()`/`HTMLElement.click()` sobre el botón, no dispara un click DOM sintético ni ejecuta el callback de React.** El clic previo en la región no interactiva sirve solo para enfocar el marco de la aplicación.

Con esa secuencia se observó **`click:true` en el botón** y el GET recuperó datos, desapareciendo el error y apareciendo «Comunicado 10». La prueba conserva la comprobación de contenido y la aserción de click confiable; no se sustituyó Enter por click para hacerla pasar.

**Causa resuelta:** el fallo estaba en el procedimiento de simulación de Enter de la prueba, que en el entorno probado no generaba la activación predeterminada del botón. El componente nativo funciona con la secuencia completa y no requiere corrección. No se afirma una causa interna específica del código de Cypress ni un defecto general de todos los navegadores: la diferencia comprobada es ausencia/presencia de click nativo al cambiar la secuencia enviada. La conclusión no se limita a culpar a Electron; la comprobación concluyente se obtuvo en Edge 156.

### Prueba móvil independiente

Se agregó «no desborda horizontalmente en móvil durante error y después de recuperar la consulta». Viewport **390×844**. Comprueba `document.documentElement.scrollWidth <= clientWidth` en el estado de error y tras recuperar con éxito, además de verificar contenido recuperado. Se ejecuta como caso independiente para que un futuro fallo de teclado no impida verificar el ancho.

El caso de Enter también alcanzó y aprobó su aserción de ancho al final. Ambos casos aprobaron. Esto verifica desbordamiento horizontal en esos estados y dimensiones, no todos los tamaños, zooms, textos ni lectores de pantalla.

### Ejecuciones de esta validación complementaria

Comando desde `e2e`: `npm test -- --browser edge --spec cypress/e2e/communication-queries.cy.ts`. Cypress 16.1.1, Edge 156 headless, Node 26.7.0. Ejecución fuera del sandbox autorizada para el navegador; toda la API sigue simulada, sin conexiones ni escrituras de backend real.

| Ejecución complementaria | Aprobadas | Fallidas | Pendientes | Omitidas | Evidencia |
| --- | --- | --- | --- | --- | --- |
| Instrumentación del procedimiento anterior con `cy.press` | 10 | 1 | 0 | 0 | Fallo conservado: teclado confiable sin click nativo. |
| Sustitución por secuencia nativa completa CDP | 11 | 0 | 0 | 0 | Click confiable, GET recuperado y ancho móvil comprobados; código 0. |
| Versión final con caso móvil independiente | **12** | **0** | **0** | **0** | Suite completa aprobada; código 0. |

No se suman reejecuciones como casos únicos: la versión final contiene 12 pruebas. El fallo diagnóstico conserva el historial; no hay casos pendientes/omitidos ni pruebas que se hayan borrado para ocultarlo.

| Verificación complementaria | Resultado |
| --- | --- |
| `frontend`: `npm run build` | APROBADO, código 0, `tsc -b` y Vite; 100 módulos. |
| `frontend`: `npm run lint` | APROBADO, código 0. |
| `e2e`: `npm run typecheck` | APROBADO, código 0, sobre la versión final del spec. |
| Cypress focalizado, versión final | 12 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas; API simulada. |
| `git diff --check` | Sin errores detectados en cambios versionados. |
| Activación nativa Enter del botón de recuperación | APROBADA mediante click confiable y resultado funcional; control visible, habilitado y enfocado. |
| Desbordamiento horizontal a 390×844 | APROBADO durante error y recuperación. |

### Límites conservados y estado final

Se resuelven el caso fallido de Enter y la comprobación móvil pendiente que justificaban PARCIAL en el registro original. M-01 queda **COMPLETADA para el alcance implementado y verificado de interfaz**, sin cambios al botón ni a los contratos API. El helper de teclado usa el protocolo Chromium; Firefox y la versión final en Electron **NO EJECUTADOS** en esta fase. No se presenta esta comprobación puntual como certificación completa de accesibilidad WCAG, Tab de toda la página, lector de pantalla o contraste.

Pest, `office.cy.ts` con backend real y aislamiento/roles efectivos de Laravel/MySQL continúan **NO EJECUTADOS/NO VERIFICADOS dinámicamente** por no haberse confirmado el entorno aislado. No se crean usuarios, seeders, migraciones ni datos. Esas limitaciones siguen explícitas y no se sustituyen por resultados de API simulada. M-02 y M-03 no se implementaron. No se hicieron commits, push, merge ni Pull Requests.
