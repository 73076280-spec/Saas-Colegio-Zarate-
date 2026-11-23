# BOLT-MIS-006 — Validación de brechas y plan de mejoras

Fecha: 02/11/2026. Rama verificada: `feature/comunicacion-institucional`. HEAD: `07392ec`. Estado inicial de Git limpio. Documento de planificación para revisión; no constituye aprobación institucional ni registro de implementación.

Fuentes: [diagnostico.md](diagnostico.md), [prompt-01-auditoria.md](prompt-01-auditoria.md), [prompt-02-validacion.md](prompt-02-validacion.md), `docs/architecture.md`, `docs/requirements-status.md`, `docs/traceability.md` y código citado abajo. La auditoría anterior examinó `4b39e76`; esta validación registra el HEAD actual sin alterar aquella evidencia.

## Trazabilidad y alcance verificados

| Referencia existente | Relación con este plan |
| --- | --- |
| RF-19 — Gestión de comunicaciones | M-01 mejora la consulta de comunicados; M-02 protege su redacción y guardado. |
| RF-20 — Gestión de notificaciones | M-03 mejora la coherencia entre bandeja, popover y contador, manteniendo marcado explícito de lectura. |
| RF-04 — Gestión de roles y permisos | Restricción transversal a conservar; no se agregan permisos ni se cambian roles. |
| RF-24 — Auditoría del sistema | Conservar auditoría de creación/edición/publicación/archivo; sin nuevos contenidos sensibles en logs. |

Los códigos y denominaciones originales de procedimientos institucionales siguen **NO VERIFICADOS**: las fuentes revisadas no aportan el mapa AS-IS/TO-BE original. «Gestión de comunicaciones» y «Gestión de notificaciones» son nombres de RF, no procedimientos PM inventados. La adscripción formal de responsabilidades a misional/estratégico/apoyo sigue pendiente de documentación institucional. Ninguna mejora requiere cambiar esa clasificación para corregir el comportamiento local demostrado.

No se propone intervenir solicitudes/documentos, reportes ni Bolts anteriores. La agrupación técnica `Office` contiene código compartido; no equivale a autorización para rediseñar todos sus consumidores.

## Resultado de la contrastación

Las comprobaciones de esta fase son **lectura de código**, sin ejecución de navegador ni pruebas automatizadas. «Confirmado por código» describe la estructura y la secuencia posible; no implica reproducción dinámica.

| Función o recomendación de auditoría | Estado contrastado | Evidencia y decisión |
| --- | --- | --- |
| Listado y detalle de comunicaciones | IMPLEMENTADO | `frontend/src/office/CommunicationsPage.tsx` consulta página y selección; API paginada. Conservar. |
| Carga, error y vacío | IMPLEMENTADO | `useOffice`, `Message`, `EmptyState` y textos de carga existen. Mejorar ubicación/contexto; no crearlos de nuevo. |
| Reintento directo de GET fallido | PARCIAL | La revisión del hook permite recargar, pero la pantalla no ofrece acción de recuperación de listado/detalle. Seleccionar M-01. |
| Protección contra respuestas de efectos anteriores | IMPLEMENTADO | `frontend/src/office/shared.tsx`: clave URL/revisión y limpieza `active=false`. Conservar y probar; no se demuestra una carrera general que exija reconstruir el hook. |
| Búsqueda/filtros de comunicados | API IMPLEMENTADA; controles de listado ausentes | `OfficeController` filtra `status`, `date` de creación y `search` por título. La pantalla solo envía `page`. Oportunidad secundaria; no incluir nuevos filtros como obligación de M-01. |
| Bandeja y archivo | IMPLEMENTADO | No hay bandejas separadas por estado en UI. El listado de personal incluye estados; el receptor solo PUBLISHED autorizado. Archivar oculta el comunicado al destinatario; la notificación permanece. No es un defecto de seguridad demostrado. |
| Crear/editar borrador y validación | IMPLEMENTADO | `CommunicationForm`, `OfficeRequest`, `CommunicationService`; DRAFT editable, límites de texto y criterios. |
| Protección de ediciones durante solicitud pendiente | PARCIAL | Se captura `FormData`, se dejan campos editables y `saved` desmonta el formulario al responder. Ediciones posteriores al envío pueden perderse. Seleccionar M-02. |
| Cambio de editor con cambios sin guardar | PARCIAL | «Nuevo comunicado»/«Editar borrador» cambian `editing`; la clave del formulario cambia sin comprobación de modificaciones. M-02 debe proteger ese reemplazo y cancelación. |
| Publicación duplicada | Protección IMPLEMENTADA | `busy` desactiva acciones durante transición; servicio transaccional con bloqueo publica solo DRAFT. Repetir publicación se rechaza. No modificar reglas ni añadir un sistema de publicación paralelo. |
| Permisos y destinatarios | IMPLEMENTADO por lectura | `OfficeAccess`, `OfficePolicy`, `CommunicationRecipients` y DTO de capacidades. No se identificó una brecha que justifique ampliar acceso. |
| Marcado individual/masivo propio | IMPLEMENTADO | `OfficeNotificationsController`: relación del usuario, UUID propio, idempotencia individual y total de no leídas. |
| Coherencia entre contador y distintas bandejas | PARCIAL | Solo `NotificationBell` escucha `office-notifications`/foco/temporizador; las instancias de `NotificationsPage` mantienen revisión independiente. Seleccionar M-03. |
| Abrir comunicado = marcar notificación leída | No es el contrato actual | «Abrir» es un Link y «Marcar como leída» es una acción separada. No convertir la consulta en una escritura automática. |
| Accesibilidad y móvil | Soporte estático existente; comprobación dinámica NO VERIFICADA | Etiquetas, estados, botones nativos, flex-wrap y popover adaptable existen; el selector de destinatario necesita nombre individual. No hay evidencia para declarar contraste o teclado aprobados/fallidos. |

## Revisión UX/UI focalizada

Fuentes: `frontend/src/index.css`, `frontend/src/components/Form.tsx`, `frontend/src/components/StatusBadge.tsx`, `frontend/src/components/EmptyState.tsx` y los componentes `office`.

- **Espaciado y jerarquía:** las pantallas ya usan `space-y-*`, tarjetas, título principal y títulos de comunicado. No hay evidencia visual ejecutada que justifique rediseñar esa jerarquía. Ubicar el error de consulta junto a la región afectada y su botón de reintento mejora comprensión sin alterar el layout.
- **Carga/error/vacío:** conservar `Message` (`role=alert` para error), texto de carga `role=status` y `EmptyState`. Los errores de escritura y de consultas no deben ocultarse mutuamente por `error || loadError || detailError`. El mensaje vacío no debe presentarse como resultado de un error o como falta de permiso.
- **Texto de vacío:** `EmptyState` sugiere por defecto probar otros filtros. La pantalla de comunicados no expone filtros; pasar un `hint` local acorde con la consulta, sin cambiar el componente global, evita una indicación imposible de seguir.
- **Leído/no leído:** las notificaciones ya distinguen fondo y texto con `StatusBadge` («Leída»/«Sin leer»). Conservar esa señal textual. Los comunicados no tienen un campo de lectura personal en su DTO: no trasladarles una insignia inventada ni deducirla de abrir el detalle.
- **Botones:** reutilizar `institutional-button` y `button-secondary`, de altura mínima existente; colocar «Reintentar consulta» junto al error y «Guardando borrador…» en el contexto del formulario. Sin nuevos colores principales, iconotecas ni animaciones.
- **Etiquetas:** título/cuerpo y tipo de destinatario tienen etiquetas. `OfficeSelect` usa `fieldset/legend` y un buscador nombrado, pero el select carece de etiqueta individual asociada. M-02 debe aportar un nombre accesible inequívoco al selector usado en comunicación, preferentemente mediante una propiedad opcional para no cambiar otros consumidores.
- **Contraste y foco:** existen tokens cálidos, variantes de tema y `:focus-visible` global. No hay medición ni prueba de foco realizada en esta fase. Conservar tokens y comprobar los controles nuevos en ambos temas cuando estén disponibles, sin declarar una infracción de contraste por inspección aislada.
- **Responsividad:** se usan ancho completo, ajuste de palabras, flex-wrap y popover `min(88vw,26rem)` con scroll. Revalidar a 390×844 y en escritorio, incluyendo mensajes largos y foco visible. No proponer cambios a `index.css`, al layout o a navegación institucional.

## Selección de mejoras

| Mejora | Problema funcional | Ajuste visual | Archivos | Prioridad | Pruebas |
| --- | --- | --- | --- | --- | --- |
| M-01 — Recuperación y contexto de consultas de comunicados | No hay recuperación directa de listado/detalle fallido; errores distintos comparten una única salida | Error y reintento junto a su región; hint vacío coherente y carga contextual | `frontend/src/office/CommunicationsPage.tsx`; condicional `frontend/src/office/shared.tsx`; nuevo `e2e/cypress/e2e/communication-queries.cy.ts` | Alta, primera | GET fallido→éxito, misma página/ID, consultas independientes, HTTP fuera de orden, acceso denegado, cero repetición de escrituras |
| M-02 — Protección de borradores de publicación | Formulario editable durante guardado y reemplazo de editor sin proteger cambios | Indicador de cambios/guardado, acciones claras, selector etiquetado y controles bloqueados de forma coherente | `frontend/src/office/CommunicationsPage.tsx`; condicional `frontend/src/office/shared.tsx`; nuevo `e2e/cypress/e2e/communication-drafts.cy.ts` | Alta, segunda | Guardado demorado, fallo con conservación, editor cancelado/confirmado, formulario limpio y publicación sin regresión |
| M-03 — Coherencia de notificaciones y bandejas | Revisión independiente entre instancias; GET fallido sin recuperación directa | Reintento local y error junto al listado/contador; conservar insignias y estados de lectura | `frontend/src/office/NotificationsPage.tsx`; nuevo `e2e/cypress/e2e/notification-consistency.cy.ts` | Media, tercera | Bandeja y popover simultáneos, evento de lectura, filtro/página conservados, conteo, error/reintento, respuesta tardía y escritura única |

Los nombres de pruebas nuevas son **rutas previstas**, no archivos ya creados. Todos los demás archivos citados en esta planificación son fuentes existentes. No se necesita modificar backend ni API.

### M-01 — Recuperación y contexto de consultas de comunicados

**Problema demostrado:** en `CommunicationsPage.tsx` ambas consultas reciben la misma revisión de página y no disponen de reintento explícito; el error visible combina mutación/listado/detalle mediante OR. El caso concreto a corregir es un GET fallido con contexto aún válido, no un supuesto defecto general de paginación.

**RF/procedimiento:** RF-19; RF-04 como restricción. Procedimiento institucional: NO VERIFICADO.

**Solución mínima:** separar revisiones y regiones de recuperación para listado y detalle; repetir solo el GET afectado con URL/página/ID actuales. Mantener datos ligados a la consulta y la limpieza de efectos existente. Cuando sea necesario distinguir errores HTTP, conservar metadatos tipados del error de consulta; el hook actual expone solo texto. Una extensión aditiva y compatible en `shared.tsx` podría exponer el status sin cambiar `data/error/loading`, ni el comportamiento de consumidores ajenos. Si no hace falta para la solución final, no modificar ese archivo.

**Ajuste visual:** utilizar `Message` para el texto y un botón hermano en la región afectada; no introducir botones dentro del párrafo interno de `Message`. Identificar «Listado de comunicados»/«Detalle del comunicado» por su texto o estructura. Mensaje de recurso no disponible sin distinguir existencia ajena de archivo.

**Criterios de aceptación:**

1. Error de red/500 en listado: acción explícita repite el mismo GET, conserva página y no ejecuta POST/PATCH. Detalle o formulario independiente no se pierde.
2. Error de detalle: se identifica el detalle como región afectada; reintentar conserva ID y página del listado y no recarga innecesariamente este último.
3. 403/404 informan falta de acceso o recurso no disponible sin confirmar existencia privada; no hay reintento automático ni bucle. 422 informa consulta inválida; 401/419 conserva la gestión de sesión existente.
4. Un GET nuevo no muestra como actuales resultados de otra consulta; una respuesta vieja no reemplaza la selección posterior. Los vacíos solo corresponden a un GET exitoso sin registros.
5. La recuperación no borra texto del editor y los mensajes de escritura no quedan ocultos por errores de consulta.
6. Botones nuevos funcionan con Tab/Enter, tienen foco visible y caben en móvil; se reutilizan clases existentes.

**Pruebas necesarias:** Cypress simulado para error/reintento de cada región, página 2 conservada, cambio de ID con respuesta demorada, vacío y recuperación, 403/404/422, 401/419 sin alterar contrato y contador de escrituras en cero durante recuperación. Reejecutar casos existentes de lectura/publicación cuando el entorno sea seguro.

**Riesgos y dependencias:** acoplar de nuevo las revisiones puede remontar innecesariamente el editor; el hook compartido afecta otras pantallas si se cambia su comportamiento. Evitarlo mediante cambios locales o extensión exclusivamente aditiva. No requiere nueva decisión de destinatarios ni filtros; no se incluyen nuevas bandejas por estado. La revisión de este plan debe preceder a implementar.

### M-02 — Protección de borradores de publicación

**Problema demostrado:** `CommunicationForm.submit` toma una instantánea mediante `FormData` y `targets`; campos permanecen editables durante la espera y `saved` cierra el editor. El padre cambia `key={editing?.id ?? 'new'}` sin proteger entradas. «Cancelar» también cierra sin consultar si hubo modificaciones. No hay detección local de cambios pendientes.

**RF/procedimiento:** RF-19; RF-04 y RF-24 como restricciones. Procedimiento institucional: NO VERIFICADO.

**Solución mínima:** comparar texto y criterios con el valor inicial del editor, distinguiendo formulario limpio de modificado. Mientras se guarda, deshabilitar de forma coherente los controles editables y los cambios de editor que pudieran desmontarlo; un `fieldset disabled` local puede abarcar los selectores sin modificar su API. Proteger cancelación y reemplazo del editor mediante confirmación clara; cancelar el descarte conserva todos los datos. Preservar el editor y sus valores cuando falla POST/PATCH. No utilizar localStorage/sessionStorage, autosave ni cambios de publicación.

**Ajuste visual:** aviso discreto de cambios pendientes y estado «Guardando borrador…», sin insinuar que ya se publicó. Mantener las confirmaciones de publicación/archivo. Para el selector de destinatario, prever propiedad opcional de nombre accesible en `OfficeSelect`, aplicada solo en comunicación; no rehacer el selector de solicitudes/documentos.

**Criterios de aceptación:**

1. Durante POST/PATCH pendiente no se puede producir una edición que se pierda silenciosamente al llegar éxito, ni cerrar/reemplazar el editor con una solicitud activa.
2. Fallo 422/500 o de red conserva título, cuerpo y criterios; no repite automáticamente la escritura. El usuario decide cuándo enviar de nuevo.
3. Nuevo/editar otro/cancelar con cambios solicita una sola confirmación. Cancelar mantiene contexto y valores; confirmar descarta y permite la acción. Si no hay cambios, no hay confirmación innecesaria.
4. Guardado exitoso establece el nuevo estado limpio o cierra conforme al flujo existente; no crea una publicación ni duplica un envío por interacción reiterada.
5. Mantener límites de texto y hasta 30 criterios; publicación exclusivamente autorizada y desde DRAFT, con decisión final del servidor.
6. Selector con nombre accesible individual; tabulación, edición y confirmación verificadas; móvil sin desbordamiento de acciones o avisos.

**Navegación: límite explícito.** `frontend/src/App.tsx` usa `BrowserRouter` con `Routes`; no se localizó un bloqueo SPA reutilizable en las búsquedas de `useBlocker/usePrompt`. La protección de asistencia encontrada es `beforeunload`, que no demuestra bloqueo SPA. Este alcance mínimo protege acciones controladas dentro del editor; no certifica salidas por menú, historial, enlace o cambio externo de parámetros URL. Antes de prometer protección global se requiere un análisis compatible con el router real. No se autoriza cambiar `App.tsx`, capturar indiscriminadamente clics o parchear `history`. Puede evaluarse `beforeunload` local como protección complementaria de recarga/cierre, con límites del navegador documentados; no sustituye la SPA. Si la aprobación exige toda salida SPA, M-02 debe permanecer PARCIAL hasta resolver esa decisión técnica, no declararse completa por proteger solo botones locales.

**Pruebas necesarias:** Cypress simulado con POST/PATCH demorado y fallo, intento de cambiar cada campo/editor durante guardado, conservación de texto/targets al fallar o cancelar descarte, confirmación de descarte y formulario limpio. Probar publicación y rechazo de repetición con backend aislado mediante suite existente. Registrar el alcance real del teclado y de cualquier prueba `beforeunload`, sin equipararlo a navegación SPA.

**Riesgos y dependencias:** falsos positivos de cambios por normalizar texto/orden de criterios, pérdida por remount externo y diálogos inaccesibles si se construye uno innecesario. Preferir confirmación existente/nativa y no alterar valores originales silenciosamente. El alcance de SPA completa requiere revisión adicional; las reglas institucionales actuales no necesitan modificarse.

### M-03 — Coherencia de notificaciones y bandejas

**Problema demostrado:** en `NotificationsPage.tsx`, cada instancia conserva `revision`; el marcado actualiza su propia revisión y emite `office-notifications`. Solo la campana escucha ese evento, foco y temporizador. Así, bandeja y popover pueden seguir mostrando estados anteriores aunque el contador haya solicitado datos nuevos. El reintento manual del GET tampoco está expuesto en esas vistas.

**RF/procedimiento:** RF-20; RF-19 como origen de avisos y RF-04 como restricción. Procedimiento institucional: NO VERIFICADO.

**Solución mínima:** suscribir las instancias montadas al evento ya existente y definir una única vía de invalidación tras marcado exitoso para no sumar revisión local más evento propio. Refrescar mediante GET conservando filtro/página; limpiar listeners al desmontar. Conservar el temporizador existente de la campana sin agregar otros globales. Establecer una estrategia de refresco de bandeja al recuperar foco cuando corresponda; documentar que no hay sincronización en tiempo real entre equipos/pestañas. Añadir reintento GET explícito en la región fallida, incluido contador si falla, sin repetir marcado de lectura.

**Ajuste visual:** error y recuperación próximos a bandeja/contador; conservar indicador textual leído/no leído y estilo existente. En error del contador, mantener estado desconocido, sin mostrar cero como si fuera éxito. La carga no debe parecer una nueva cantidad confirmada.

**Criterios de aceptación:**

1. Con bandeja completa y popover montados, marcar desde uno actualiza filas y contador de las vistas visibles tras sus GET exitosos.
2. Cada acción genera un solo POST; no hay bucles de eventos, reenvío de escritura ni listeners acumulados. Un error de POST no se presenta como éxito de lectura.
3. Se conserva filtro/página durante invalidación y reintento; cambio de filtro reinicia página como ahora. Una página que quede vacía muestra vacío y conserva una vía para volver a otra página, sin usar filas previas como actuales.
4. GET fallido se puede repetir sin perder el filtro. Respuesta tardía de consulta anterior no sustituye datos posteriores.
5. Abrir un enlace no marca automáticamente lectura. UUID y autorización de recursos enlazados siguen siendo del servidor.
6. Controles accesibles por teclado, Escape en popover y diseño móvil conservados; no se duplican IDs ni se introduce gestión modal en una región que no es modal.

**Pruebas necesarias:** Cypress simulado con ambas vistas simultáneas, marcado individual/masivo, evento de publicación, error del contador/bandeja, reintento manteniendo filtro/página, orden invertido de respuestas, montaje/desmontaje y conteo de POST. Verificar «Abrir» sin escritura implícita y falta de permiso sin controles indebidos. Regresión real con `office.cy.ts` solo con entorno seguro.

**Riesgos y dependencias:** ráfagas de GET al combinar evento/foco/timer y desfase momentáneo de peticiones independientes. Evitar doble invalidación propia; probar resultado consistente una vez resueltas las respuestas, sin prometer atomicidad entre endpoints separados. No requiere canales nuevos, permisos ni una decisión de acuse de lectura.

## Contratos de seguridad que deben conservarse

Fuentes revisadas: `backend/app/Services/Office/CommunicationService.php`, `CommunicationRecipients.php`, `OfficeAccess.php`, `OfficeAudit.php`; `backend/app/Policies/OfficePolicy.php`; `backend/app/Http/Controllers/Api/OfficeController.php`, `OfficeNotificationsController.php`; `backend/app/Http/Requests/OfficeRequest.php`; `backend/app/Http/Resources/OfficeResource.php`; `backend/routes/api.php` y relación de notificaciones del usuario.

- Gestión requiere ADMINISTRATOR/SECRETARY y permisos efectivos. Editar reutiliza `communications.create`; no inventar `communications.update`. Publicar/archivar comprueba permisos y recurso autorizado.
- Destinatario ordinario solo lee PUBLISHED notificado a su usuario. Audiencia validada por institución, unión deduplicada de usuarios activos y fijada al publicar. No sustituir ese contrato por permisos del frontend.
- Notificaciones solo se consultan/marcan en la relación propia con scope institucional; `notifications.view` no concede acceso a todo comunicado enlazado.
- DRAFT editable; publicar dos veces se rechaza; archivar también puede partir de DRAFT. Conservar transacción, bloqueo, auditoría y prohibición de autor/estado/institución impuestos por cliente.
- No copiar contenido sensible a almacenamiento persistente ni logs, ni revelar por mensaje de 404 si un comunicado existe para otro usuario.

No hay brecha demostrada que requiera cambiar la API. La restricción de audiencias por año y la política histórica de destinatarios requieren confirmación institucional antes de alterar reglas. No se incluyen en las tres mejoras.

## Estrategia de pruebas y estado actual

| Verificación | Situación en esta fase | Ejecución prevista tras implementar |
| --- | --- | --- |
| Lectura y búsqueda de código/documentos | REALIZADAS | Revisar diff acotado y correspondencia con criterios. |
| Pruebas de interfaz nuevas | NO CREADAS / NO EJECUTADAS | Los tres archivos previstos usarán respuestas API simuladas y cubrirán casos de cada mejora; no certificarán autorización real. |
| Cypress `e2e/cypress/e2e/office.cy.ts` | IDENTIFICADO, NO EJECUTADO; 3 casos totales, dos de comunicación/notificaciones | Regresión con backend real, únicamente tras confirmar base y usuarios aislados; escribe datos. |
| Pest `backend/tests/Feature/Sprint9Test.php` | IDENTIFICADO, NO EJECUTADO; 10 casos mixtos | Casos de deduplicación, destinatarios/gestión, marcado propio y aislamiento. Solo con base y usuario de pruebas aislados; no basta encontrar `DatabaseTransactions`. |
| Frontend build y ESLint | NO EJECUTADOS | En `frontend`: `npm run build` y `npm run lint`, scripts existentes. |
| TypeScript E2E | NO EJECUTADO | En `e2e`: `npm run typecheck`. |
| Teclado, móvil y contraste | NO EJECUTADOS | Tab/Enter/Escape, foco visible, nombre accesible, 390×844/escritorio; comprobar ambos temas y anunciar límites de herramientas. |

Para Cypress focalizado, utilizar desde `e2e` el script existente `npm test -- --spec cypress/e2e/<archivo-previsto>.cy.ts` una vez creado el archivo correspondiente. No ejecutar pruebas de backend, seeders ni migraciones contra `zarate_dev` o datos institucionales. No crear usuarios demo para forzar regresión. Registrar cada suite como API simulada o backend real y sus cantidades exactas después de ejecutarla; no trasladar aprobaciones históricas a este Bolt.

Los cuatro casos de Sprint9 relevantes están identificados por sus nombres: `deduplicates overlapping communication targets and keeps published recipients stable`, `restricts communications to recipients and protects foreign targets and management`, `marks only owned notifications read and supports unread filters and mark all` e `isolates requests documents communications and notifications between institutions`. La cobertura existente no sustituye pruebas nuevas de reintento, borrador pendiente o instancias simultáneas.

## Orden, decisiones y exclusiones

1. **M-01 primero:** entrega recuperación visible y acotada sin tocar reglas de publicación ni navegación global. Establece un patrón local de consulta contextual que puede orientar M-03 sin forzar abstracciones compartidas.
2. **M-02 después:** evita pérdida de contenido; revisar expresamente el límite de SPA antes de aceptar un alcance de protección total. La protección local no debe esperar a inventar una solución global frágil.
3. **M-03 al final:** sincroniza vistas reutilizando evento y contratos existentes; verificar que no reintroduzca GET duplicados ni regresiones de M-01/M-02.

Las mejoras son técnicamente separables; M-03 no exige modificar M-02. Antes de implementación, revisar el plan y delimitar la cobertura de navegación de M-02. No se declara aprobación recibida. Permanecen fuera de alcance rediseño general, nuevos filtros obligatorios, chat, tiempo real, correo/SMS/push, nuevos endpoints, nuevos roles, acuses de lectura, versiones del cuerpo y cambios a otras pantallas o macroprocesos. `App.tsx`, `AppLayout.tsx`, `index.css`, componentes globales y backend se mantienen como fuentes de consulta, no como archivos previstos de modificación.

Únicos archivos creados en esta fase: `prompt-02-validacion.md` y este `plan-mejoras.md`. El prompt se copia íntegramente del adjunto. No se modifican diagnóstico, evidencias anteriores ni código. **No se ejecutaron pruebas funcionales; no se declara ninguna aprobación de pruebas ni implementación completada.**
