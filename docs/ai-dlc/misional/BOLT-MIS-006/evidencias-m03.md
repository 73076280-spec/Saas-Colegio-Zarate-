# BOLT-MIS-006 — Evidencias de M-03: campana y bandejas

Fecha: 02/11/2026. Rama confirmada: `feature/comunicacion-institucional`. HEAD inicial: `20f2dcc`. Git inicialmente limpio. Estado de M-03: **COMPLETADA en el alcance de interfaz con API simulada**; no equivale a integración real certificada ni cierre de todo el Bolt. M-02 conserva su estado PARCIAL por navegación SPA global.

Prompt íntegro: [prompt-05-implementacion-m03.md](prompt-05-implementacion-m03.md), copia del adjunto con hash SHA-256 coincidente. Se contrastaron diagnóstico, plan y evidencias M-01/M-02 con los componentes y contrato existentes. No se modifican registros anteriores.

## Problema original y evidencia

En `frontend/src/office/NotificationsPage.tsx`, la campana escuchaba `office-notifications`, foco y un temporizador de 60 segundos, mientras cada bandeja mantenía una revisión independiente. Marcar desde una instancia renovaba su propia consulta y el contador, pero no solicitaba actualizar las otras instancias montadas. La bandeja y la campana no ofrecían recuperación GET explícita; el error de consulta y el de escritura se combinaban con OR. El estado local de consultas no estaba delimitado explícitamente por identidad/institución en este componente.

El contrato en `backend/app/Http/Controllers/Api/OfficeNotificationsController.php` exige `notifications.view`, consulta la relación de notificaciones del usuario y devuelve `read_at` y `unread_count` total propio, independiente del filtro/página. Marcar individual o masivamente es un POST separado. «Abrir» es navegación, no confirmación de lectura.

## Archivos afectados

| Archivo | Cambio |
| --- | --- |
| `frontend/src/office/NotificationsPage.tsx` | Invalidación compartida por evento/foco, aislamiento por identidad, reintentos GET, mensajes contextuales y protección de escritura pendiente/desmontaje. |
| `e2e/cypress/e2e/notification-consistency.cy.ts` | 13 casos nuevos con API simulada. |
| `docs/ai-dlc/misional/BOLT-MIS-006/prompt-05-implementacion-m03.md` | Prompt completo. |
| `docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m03.md` | Esta evidencia. |

M-01/M-02, sus pruebas, hook compartido, backend, permisos, migraciones, contratos, router, menú y estilos globales no se modificaron. Solo se ejecutaron sus pruebas de regresión pertinentes.

## Componentes, endpoints y solución

Se conservan `NotificationsPage`, modo compacto y `NotificationBell`, con componentes internos identificados por institución y usuario. Se reutilizan `useOffice`, `Message`, `StatusBadge`, `EmptyState` y `Pager`.

| Operación | Endpoint conservado |
| --- | --- |
| Contador de la campana | GET `/api/v1/notifications?per_page=1` |
| Bandeja completa/compacta | GET `/api/v1/my/notifications?page=…&per_page=20|5`, con `status=read|unread` cuando se selecciona |
| Marcar una | POST `/api/v1/notifications/{uuid}/read` |
| Marcar todas | POST `/api/v1/notifications/read-all` |
| Abrir comunicado enlazado | Navegación a `/app/communications?communication={id}`, con GET de listado/detalle existente y autorización del recurso por backend |

Cambios funcionales:

1. Todas las instancias visibles escuchan `office-notifications` y `window.focus` mediante un hook local que retira listeners al desmontar. Se conserva filtro/página durante invalidación.
2. Un POST exitoso emite una sola invalidación por evento; se elimina el incremento local adicional del emisor. No se dispara el evento si falla el POST. La interfaz no marca filas ni decrementa contadores de forma optimista.
3. Un ref impide doble escritura mientras está pendiente. Una respuesta de escritura de un componente desmontado no dispara mensajes ni invalidaciones en la sesión nueva.
4. Las envolturas comprueban sesión/permisos y montan el estado de campana/bandeja con clave institución/usuario. Al cambiar contexto, se descarta el estado anterior y se aplican las limpiezas de consultas existentes. No se conserva un caché privado entre identidades.
5. Cada consulta fallida puede recuperarse con GET cuando el fallo es transitorio (red, 5xx, 408/429). 403/404/422 muestran mensajes locales sin bucle de recuperación; la gestión 401/419 del cliente de sesión se conserva. Reintentar no vuelve a enviar lectura ni otra escritura.
6. El GET mantiene la protección de URL/revisión y limpieza de efectos de `useOffice`, evitando filas de otro filtro y respuestas de consultas anteriores como si fueran actuales. Paginación solo con respuesta disponible; cambio de filtro conserva el reinicio a página 1.
7. Abrir la campana refresca su contador y monta la bandeja reciente; cerrar no añade un GET del contador. Abrir un aviso no cambia `read_at` automáticamente.

**Sin polling:** se retiró el temporizador preexistente. Aunque el plan inicial contemplaba conservarlo, el prompt de implementación más reciente prohíbe polling continuo y prevalece. La actualización ocurre por lectura confirmada, evento existente de publicación, apertura, reintento o recuperación de foco. No se agregaron timers, WebSockets, push ni servicios externos. La prueba de evento/foco verifica recuperación y contexto; la ausencia de temporizadores se comprueba por lectura del código, no por una medición prolongada de tráfico.

## Ajustes visuales y accesibilidad

- Se conserva la distinción «Leída»/«Sin leer» y el estilo existente, sin depender únicamente del color.
- Bandejas nombradas «Bandeja de notificaciones» y «Bandeja reciente de notificaciones», con `aria-busy`; campana conserva nombre, `aria-expanded`, control de región y Escape.
- Error de escritura y GET se presentan por separado. El contador muestra «—» o «…» cuando no está confirmado; la bandeja informa «Pendientes no disponibles»/«Consultando pendientes…», evitando aparentar cero.
- Botón nativo «Reintentar consulta» junto al error correspondiente, con clases institucionales. No se modifica la estructura general del layout.
- Se verificó Enter nativo en campana con secuencia CDP completa y apertura del panel. Se verificó el handler de Escape con un evento de teclado de Cypress; no se describe esa última prueba como pulsación física nativa.
- Sin desbordamiento horizontal del documento a 390×844 con bandeja y popover visibles. Esto no certifica todos los tamaños ni todos los estados de error posibles.

## Trazabilidad y seguridad

RF-20 — Gestión de notificaciones: relación directa. RF-19 — Gestión de comunicaciones: origen de avisos y enlace al comunicado existente. RF-04: restricción transversal de permisos; RF-24: auditoría existente no modificada. Los códigos originales de procedimientos permanecen **NO VERIFICADOS**; no se inventan códigos PM.

Se conserva el cálculo del contador del servidor y el alcance de UUID/relación propia. No se añade consulta global de notificaciones ni se usa el contador para decidir acceso al comunicado enlazado. No se persisten mensajes privados en almacenamiento del navegador ni se registran en logs. Las pruebas de identidad/permisos de esta fase simulan respuestas y verifican interfaz; no demuestran por sí mismas aislamiento efectivo del backend.

## Pruebas ejecutadas

Entorno: Cypress 16.1.1, Edge 156 headless, Node 26.7.0, servidor frontend local. Los tres specs interceptan las peticiones API; login/logout de la prueba de cambio de usuario también son simulados. No se ejecutaron escrituras reales ni se prepararon usuarios demo.

Comando desde `e2e`:

```text
npm test -- --browser edge --spec cypress/e2e/notification-consistency.cy.ts,cypress/e2e/communication-queries.cy.ts,cypress/e2e/communication-drafts.cy.ts
```

| Suite | Aprobadas | Fallidas | Pendientes | Omitidas |
| --- | --- | --- | --- | --- |
| M-03: `notification-consistency.cy.ts` | 13 | 0 | 0 | 0 |
| Regresión M-01: `communication-queries.cy.ts` | 12 | 0 | 0 | 0 |
| Regresión M-02: `communication-drafts.cy.ts` | 12 | 0 | 0 | 0 |
| **Total en una ejecución** | **37** | **0** | **0** | **0** |

Son 37 casos únicos de esta ejecución; no se suman ejecuciones históricas de M-01/M-02. No hubo casos fallidos en esta ejecución de M-03. Los fallos históricos de las fases anteriores permanecen en sus documentos.

| Comprobación adicional | Resultado |
| --- | --- |
| `frontend`: `npm run build` | APROBADO, código 0; TypeScript y Vite, 100 módulos transformados. |
| `frontend`: `npm run lint` | APROBADO, código 0. |
| `e2e`: `npm run typecheck` | APROBADO, código 0. |
| `git diff --check` | Sin errores detectados en cambios versionados. |
| Integridad del prompt | Hash SHA-256 coincidente con adjunto. |

### Cobertura de los 13 casos nuevos

1. Contador inicial y filas leídas/no leídas según servidor.
2. Marcado desde bandeja compacta que actualiza contador y ambas bandejas; un POST y una recarga adicional de la bandeja completa por acción. Marcado masivo desde bandeja completa con actualización de ambas.
3. POST demorado: contador anterior hasta confirmación y controles deshabilitados.
4. POST rechazado: error visible, contador y lectura sin cambio, una escritura.
5. GET fallido en página 2 y filtro unread: reintento conserva ambos; cambiar a read vuelve a página 1; cero escrituras.
6. GET del contador fallido: muestra desconocido y recupera sin enviar POST.
7. Filtro unread demorado seguido de read: espera específica a la respuesta tardía y conserva filas de read.
8. «Abrir» consulta el detalle real de navegación sin marcado automático.
9. Invalidación por evento y foco manteniendo página 2.
10. Sin permiso: ruta denegada, sin campana ni peticiones de notificaciones.
11. Vacío exitoso con cero confirmado y marcado masivo deshabilitado, sin error.
12. Cambio de usuario e institución mediante logout/login simulados: datos anteriores retirados y respuesta demorada anterior sin sobrescribir la nueva sesión.
13. Enter nativo, apertura de popover, handler Escape y ancho móvil 390×844.

## Pruebas no ejecutadas, límites y riesgos residuales

- Pest y `e2e/cypress/e2e/office.cy.ts` con backend real: **NO EJECUTADOS**, sin entorno de base/usuario aislados confirmado. No se ejecutaron migraciones, seeders, Laravel ni MySQL para forzar resultados.
- Autorización efectiva, aislamiento institucional, auditoría y entrega de avisos en backend real: **NO VERIFICADOS dinámicamente** en esta fase; sus reglas se conservaron sin modificación.
- Pruebas específicas de todos los códigos HTTP, lector de pantalla, contraste medido, recorrido Tab integral, Firefox y ejecución final en otros navegadores: **NO EJECUTADAS**. No se certifica WCAG global.
- Las tres consultas visibles son independientes. Puede haber un breve estado de carga/desfase mientras terminan sus GET; convergen al estado confirmado después de la invalidación y respuestas exitosas. No hay snapshot atómico común ni sincronización en tiempo real entre dispositivos/pestañas.
- Sin sondeo, un aviso creado externamente puede permanecer sin reflejar hasta recuperar foco, abrir la campana o realizar otra acción explícita de consulta/evento. Es el límite deliberado del alcance solicitado, no una capacidad de tiempo real simulada.
- Errores de POST no provocan reintento automático. Una incertidumbre de transporte después de enviar una escritura sigue requiriendo consulta y decisión explícita; no se promete revertir una acción del servidor.
- M-02 sigue PARCIAL por salida SPA global; la aprobación de su regresión no certifica protección de navegación que no se implementó.

M-03 queda **COMPLETADA para la sincronización y recuperación local verificada con API simulada**. No se hicieron commits, push, merge ni Pull Requests.
