# BOLT-MIS-006 — Evidencias de M-02: protección de borradores

Fecha: 02/11/2026. Rama: `feature/comunicacion-institucional`. HEAD inicial: `63df5a5`. Git inicialmente limpio. Estado final: **PARCIAL** por navegación SPA global sin bloqueo; las protecciones locales y la regresión ejecutada aprobaron. No se implementó M-03 ni se alteró M-01 para resolver fallos.

El prompt se conserva íntegro en [prompt-04-implementacion-m02.md](prompt-04-implementacion-m02.md), copiado del adjunto y con SHA-256 coincidente. Se consultaron diagnóstico, plan y evidencias M-01, incluida su validación complementaria de teclado. Este registro no reemplaza ni reescribe evidencias anteriores.

## Problema original y contraste con el código

En `frontend/src/office/CommunicationsPage.tsx`, el padre reemplazaba el formulario mediante una clave de editor sin preguntar por cambios. Los campos título/cuerpo eran no controlados; los destinatarios tenían estado local, sin comparación con el valor inicial. Guardar capturaba una instantánea, pero los campos permanecían editables durante la solicitud; el éxito cerraba el formulario y podía descartar modificaciones posteriores al envío. Cancelar cerraba sin confirmar. Abrir otro detalle no reemplazaba el editor, comportamiento que debe conservarse para no romper M-01.

Se verificó que crear/editar borrador y publicar son operaciones diferentes: POST/PATCH de contenido frente a POST de transición. No se unificaron ni se agregó publicación automática. Las respuestas de consulta de M-01 mantienen URL/revisión, protección de efectos obsoletos y reintentos exclusivamente GET.

El enrutamiento actual es `BrowserRouter` con `Routes` en `frontend/src/App.tsx`; la inspección no identificó un bloqueo SPA reutilizable. No se migró el router ni se interceptó globalmente history/clics. El precedente de asistencia con `beforeunload` no equivale a bloqueo SPA y no se modificó.

## Archivos realmente afectados

| Archivo | Modificación |
| --- | --- |
| `frontend/src/office/CommunicationsPage.tsx` | Modelo local controlado del borrador, comparación de cambios, confirmación local de descarte, bloqueo durante guardado, estado visual, beforeunload y protección de callbacks tras desmontaje. |
| `frontend/src/office/shared.tsx` | Propiedad opcional `accessibleLabel` en `OfficeSelect`, aplicada al selector de destinatarios del comunicado. No cambia el hook GET de M-01 ni exige cambios en otros consumidores. |
| `e2e/cypress/e2e/communication-drafts.cy.ts` | 12 casos nuevos con API simulada. |
| `docs/ai-dlc/misional/BOLT-MIS-006/prompt-04-implementacion-m02.md` | Prompt completo. |
| `docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m02.md` | Esta evidencia. |

No se modificaron backend, contratos, roles, permisos, migraciones, datos, layout, router, estilos globales, campana ni otros módulos. `communication-queries.cy.ts` se ejecutó como regresión sin alterarlo.

## Solución aplicada y comportamiento nuevo

1. **Cambios reales:** título, cuerpo y criterios se comparan con una instantánea inicial estable del editor. Revertir los valores devuelve el estado limpio. Para comparar destinatarios se utiliza el conjunto ordenado de pares kind/target: duplicación/orden de criterios equivalentes no simula un cambio de audiencia. No se recorta ni normaliza el contenido textual silenciosamente.
2. **Cambio de editor:** Nuevo/Editar/Cancelar comprueban estado pendiente. Si hay cambios, preguntan «Hay cambios sin guardar. ¿Descartar el borrador local?». Rechazar conserva título, mensaje, destinatarios y editor. Confirmar permite el descarte. Una versión de editor fuerza reinicio también al reemplazar un borrador nuevo por otro nuevo, donde una clave constante no lo haría.
3. **Consulta durante edición:** Leer otro comunicado conserva la edición, sin descartar ni publicar. Durante guardado ese control queda deshabilitado para evitar cambios de contexto incompatibles. Consultar otro detalle no equivale a editarlo.
4. **Guardado pendiente:** un fieldset deshabilita texto, criterios, buscadores y acciones del formulario. Nuevo/Editar/Leer y transiciones quedan bloqueados durante la escritura. Un ref evita envíos duplicados antes de que React refleje `busy`. Se muestra «Guardando borrador…» y `aria-busy`.
5. **Publicar/archivar:** conservan sus capacidades y confirmaciones existentes; mientras haya edición modificada se deshabilitan con una indicación de guardar o cancelar primero. No cambian reglas del servidor ni privilegios. Guardar solo envía el POST/PATCH de contenido.
6. **Confirmación real del servidor:** el editor cierra y se limpia después de una respuesta de éxito. Si falla, conserva todos los valores, el contexto, el estado de modificación y un error local. No hay repetición automática de escrituras.
7. **Respuesta tardía:** si el usuario sale por navegación global y el editor se desmonta, su respuesta no ejecuta `saved`, no selecciona un registro ni modifica un editor nuevo. No se aborta deliberadamente la solicitud del servidor. No se promete cancelar una operación ya enviada.
8. **Recarga/cierre:** se registra `beforeunload` solo cuando hay cambios o guardado; se retira al quedar limpio/desmontarse. El navegador decide si muestra el aviso y su texto. No se promete restaurar datos después de recarga/cierre.

Todo el borrador permanece en memoria React. No se utiliza localStorage, sessionStorage, IndexedDB, autosave, servicios externos ni logs del contenido.

## Ajustes visuales y accesibilidad acotada

- Indicadores «Sin cambios pendientes», «Cambios sin guardar…» y «Guardando borrador…», utilizando texto de estado accesible y clases existentes.
- Campos y botones deshabilitados de manera coherente durante guardado, sin colores nuevos ni rediseño.
- Fieldset con leyenda para contenido/destinatarios y formulario nombrado «Borrador de comunicado».
- Selector de destinatario con nombre individual, por ejemplo «Destinatario 1: Usuario», mediante propiedad opcional; buscador y etiquetas existentes conservados.
- Enter nativo comprobado para guardar; viewport 390×844 comprobado con editor abierto y después del éxito. No constituye certificación completa WCAG, de contraste, lector de pantalla o recorrido Tab de toda la aplicación.

## Trazabilidad y seguridad conservadas

**RF-19 — Gestión de comunicaciones:** relación directa con redacción, edición y guardado. **RF-20 — Gestión de notificaciones:** relación indirecta por la publicación existente; M-02 no modifica entrega de avisos, marcado de lectura ni bandejas. RF-04 y RF-24 son restricciones transversales conservadas. Códigos y denominaciones originales de procedimientos: **NO VERIFICADOS**, sin inventar códigos PM.

La autoridad del servidor permanece en `CommunicationService`, `CommunicationRecipients`, `OfficeAccess`, `OfficePolicy` y `OfficeAudit`: edición solo DRAFT, gestión según permisos, destinatarios institucionales, transiciones y auditoría sin cambios. Las pruebas simuladas no certifican aislamiento efectivo de MySQL ni permisos del backend.

## Pruebas ejecutadas y resultados exactos

Entorno: Cypress 16.1.1, Edge 156 headless, Node 26.7.0. API completamente interceptada en los specs: GET, POST y PATCH simulados; el test no depende de cuentas demo ni modifica bases de datos. Las ejecuciones del navegador usaron el permiso de ejecución fuera del sandbox, conservando los mocks.

| Verificación | Resultado |
| --- | --- |
| `frontend`: `npm run build` | APROBADO, código 0; `tsc -b` y Vite; 100 módulos transformados. |
| `frontend`: `npm run lint` | APROBADO, código 0. |
| `e2e`: `npm run typecheck` | APROBADO, código 0; repetido después del ajuste final del test. |
| `git diff --check` | Sin errores detectados en cambios versionados. |
| Integridad del prompt | SHA-256 del adjunto y copia coincidentes. |

### Historial Cypress, incluido el fallo inicial

Primera ejecución desde `e2e`:

```text
npm test -- --browser edge --spec cypress/e2e/communication-drafts.cy.ts,cypress/e2e/communication-queries.cy.ts
```

| Spec | Aprobadas | Fallidas | Pendientes | Omitidas |
| --- | --- | --- | --- | --- |
| `communication-drafts.cy.ts` | 11 | 1 | 0 | 0 |
| `communication-queries.cy.ts` (M-01 sin cambios) | 12 | 0 | 0 | 0 |
| Total de esa ejecución | 23 | 1 | 0 | 0 |

El fallo fue en «mantiene teclado nativo y ancho móvil al editar y confirmar guardado», **antes de pulsar Enter**: `cy.click()` sobre la esquina superior derecha del formulario detectó que el punto quedaba cubierto por el section contenedor. Ese clic auxiliar pretendía enfocar el marco; no era una acción de usuario sobre un control. Se eliminó ese clic y se conservó el foco explícito del botón, la activación nativa con CDP y la aserción `event.isTrusted` del click generado. No se añadió `force:true`, no se cambió el componente para hacer pasar la prueba ni se reemplazó Enter por un click.

Reejecución de la sección afectada:

```text
npm test -- --browser edge --spec cypress/e2e/communication-drafts.cy.ts
```

Resultado: **12 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas**, código 0. Sumadas a la regresión M-01 ya aprobada sin cambios funcionales posteriores, quedan **24 casos únicos comprobados**: 12 de M-02 y 12 de M-01. Esto combina la ejecución inicial y la reejecución focalizada; no es una nueva ejecución única de ambos archivos ni una suma de reintentos como casos adicionales.

### Escenarios comprobados de M-02

| Caso | Resultado con API simulada |
| --- | --- |
| Inicial limpio y reversión de texto/destinatarios | APROBADO; cambio entre editores limpios sin confirmación. |
| Cancelación del descarte | APROBADO; conserva título, cuerpo, destinatarios y editor; una confirmación. |
| Confirmación de descarte | APROBADO; cambia editor y reinicia incluso nuevo→nuevo. |
| Cancelar edición | APROBADO para rechazo y aceptación de descarte. |
| Leer otro comunicado con edición pendiente | APROBADO; mantiene borrador, sin escrituras y sin publicar. |
| Creación exitosa | APROBADO; un POST a `/communications`, sin publicación; cierre tras respuesta. |
| Error PATCH 422 | APROBADO; contenido conservado y una sola escritura. |
| Error PATCH 500 | APROBADO; contenido conservado y una sola escritura. |
| Escritura demorada | APROBADO; campos y operaciones incompatibles deshabilitados, progreso y envío único. |
| Beforeunload limpio/modificado/descarte | APROBADO para registro/limpieza del handler mediante evento cancelable y `defaultPrevented`. No prueba de diálogo real de cierre. |
| Salida SPA y respuesta de editor desmontado | APROBADO como comprobación de la limitación y del aislamiento del callback: salida permitida por menú, retorno, nuevo editor y respuesta anterior sin sobrescribirlo. No es aprobación de bloqueo SPA. |
| Teclado y móvil | APROBADO; Enter mediante secuencia nativa CDP produce click confiable y un guardado; sin desbordamiento a 390×844 antes/después del guardado. |

### Pruebas no ejecutadas y límites de la evidencia

- Pest y regresión `office.cy.ts` con backend real: **NO EJECUTADAS**, por no haberse confirmado base/usuario aislados. No se ejecutaron Laravel, MySQL, migraciones ni seeders para forzar esos casos.
- Autorización, transacciones, auditoría y entrega real de notificaciones: conservadas por código sin cambios; **NO VERIFICADAS dinámicamente** en esta fase.
- Popup real de recarga/cierre y conservación de sesión después de cerrar la pestaña: **NO EJECUTADOS**. El test valida la cancelación del evento, no una garantía de aviso en todos los navegadores.
- Protección de navegación global por enlaces, atrás/adelante, cambio de parámetros y otras rutas: **NO IMPLEMENTADA como bloqueo**; la prueba de menú demuestra esa limitación. No se declara aprobada.
- Teclado en navegadores no Chromium, lector de pantalla, contraste medido y accesibilidad integral: **NO EJECUTADOS**.

## Limitaciones de SPA, riesgos y estado final

M-02 queda **PARCIAL**, aunque las pruebas focalizadas y la regresión actual aprobaron, porque la salida SPA global no queda bloqueada. Un enlace del menú puede desmontar un borrador y perder cambios locales; cambiar parámetros que remontan la pantalla presenta un riesgo equivalente no cubierto por un bloqueo. La solicitud ya enviada podría confirmarse en el servidor aunque el usuario salga; la protección de callback evita afectar otra pantalla, pero no revierte ni cancela el guardado real.

La solución completa requeriría evaluar un mecanismo compatible de bloqueo de navegación y su impacto global antes de cambiar la arquitectura. No se migró `BrowserRouter`, no se parcheó history ni se interceptaron clics de todo el SaaS. La confirmación local y `beforeunload` no sustituyen esa protección. No se promete recuperación tras cerrar/recargar y no se persiste información institucional en el navegador.

Las protecciones locales requeridas sí están implementadas y probadas: advertencia de descarte, conservación tras error, bloqueo durante guardado y respuesta tardía aislada. M-03 permanece fuera de alcance. No se hicieron commits, push, merge ni Pull Requests.
