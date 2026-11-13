# BOLT-MIS-006 — Diagnóstico de comunicación institucional

Fecha: 02/11/2026. Rama comprobada: `feature/comunicacion-institucional`. HEAD auditado: `4b39e76`. El estado inicial de Git no presentaba cambios pendientes. Auditoría estática; no se modificaron componentes, servicios, pruebas, configuración, permisos ni datos. El prompt original se conserva íntegro en [prompt-01-auditoria.md](prompt-01-auditoria.md).

## Alcance y nivel de comprobación

Existe un módulo de comunicaciones dirigidas y notificaciones internas construido en Sprint 9. No corresponde reconstruirlo. Se contrastaron documentación, rutas, modelos, validaciones, servicios, políticas, componentes y pruebas. **IMPLEMENTADO** significa soporte identificado mediante lectura de código, no certificación de funcionamiento en esta sesión. **PARCIAL** identifica una capacidad concreta incompleta; **PENDIENTE** requiere un requisito confirmado aún no implementado; **NO VERIFICADO** indica falta de evidencia o de ejecución. Una oportunidad de usabilidad no convierte automáticamente todo un RF en parcial.

No se ejecutaron Pest, Cypress, build, ESLint ni TypeScript durante esta auditoría. No se inició Laravel ni se conectó MySQL; no se comprobó un entorno de pruebas aislado. No se reutilizan resultados históricos como resultados actuales.

## Fuentes y clasificación de procesos

- Arquitectura: `docs/architecture.md` y el documento histórico `docs/arquitectura.md`. SPA React/TypeScript, API Laravel, Sanctum con cookies/CSRF, RBAC institucional, servicios transaccionales y MySQL. Notificaciones por canal `database`, sin servicios externos.
- Requerimientos: las 24 filas de `docs/requirements-status.md`; trazabilidad en `docs/traceability.md`. RF-19 es **Gestión de comunicaciones** y RF-20 es **Gestión de notificaciones**. Sus estados históricos no sustituyen esta inspección.
- Contexto: revisión del alcance de `docs/sprints/sprint-1.md` a `sprint-10.md`, con revisión detallada de `sprint-9.md`. Sprints 1–5 aportan identidad, estructura, personas, matrículas y cursos; 6–8 desarrollan aprendizaje/asistencia; 9 contiene los flujos auditados; 10 agrega reportes y consolidación.
- Se buscaron referencias AS-IS, TO-BE, comunicación institucional y códigos PM en `docs`, además de nombres de archivos de procesos/AS-IS/TO-BE en el repositorio. No se localizó una fuente del mapa original que permita confirmar códigos o denominaciones oficiales de procedimientos de comunicación.

**Códigos y nombres originales de procedimientos: NO VERIFICADOS.** Las dos agrupaciones siguientes usan los nombres de RF-19/RF-20 para describir flujos reales del software; no crean procedimientos oficiales ni asignan un código PM por analogía con Bolts anteriores. La aprobación del encaje de estos flujos en el macroproceso misional requiere contrastar el mapa institucional original.

Límites de responsabilidad: solicitudes y seguimiento (RF-16/RF-17), documentos (RF-18), reportes (RF-23), RBAC (RF-04) y auditoría (RF-24) son capacidades existentes adyacentes o transversales, no nuevos procedimientos de comunicación. Las notificaciones de solicitudes reutilizan RF-20, sin trasladar la gestión del trámite a este Bolt. El directorio técnico `Office` y el menú «Gestión y comunidad» no prueban adscripción a un macroproceso. **No se pudo verificar documentalmente cuáles de esas capacidades pertenecen formalmente al estratégico o al de apoyo**; no se reasignan ni se propone intervenirlas. Matrículas, aprendizaje, evaluaciones y asistencia conservan sus responsabilidades previas.

## Matriz de diagnóstico por flujo existente

| Campo | Gestión de comunicaciones | Gestión de notificaciones |
| --- | --- | --- |
| Código y nombre institucional | Código NO VERIFICADO; nombre funcional tomado de RF-19 | Código NO VERIFICADO; nombre funcional tomado de RF-20 |
| Objetivo | Redactar, dirigir, publicar, consultar y archivar comunicados institucionales | Consultar avisos propios y gestionar su estado personal de lectura |
| Actores | ADMINISTRATOR/SECRETARY con permisos efectivos para gestionar; usuarios destinatarios autorizados para leer | Usuario autenticado con `notifications.view`; servidor emisor de avisos |
| Entradas | Título, cuerpo, hasta 30 criterios de destinatarios; selección de comunicado y página | Usuario de sesión, página, tamaño y filtro leído/no leído; UUID propio para marcar |
| Actividades y salidas | Crear/editar DRAFT; resolver destinatarios; publicar con notificación deduplicada; consultar PUBLISHED autorizado; archivar conservando registro | Listar/filtrar; abrir enlace interno; marcar una o todas; devolver `read_at` y contador total propio |
| RF | RF-19 directo; RF-04/RF-24 transversales; RF-20 para avisos de publicación | RF-20 directo; RF-04 transversal; RF-19 como origen; RF-16/RF-17 como origen adyacente |
| Backend | `Communication`, `CommunicationTarget`, `OfficeRecord`; `CommunicationService`, `CommunicationRecipients`, `OfficeAccess`, `OfficeNotifications`, `OfficeAudit`; `OfficeController`, `OfficeOptionsController`, `OfficeRequest`, `OfficeResource`, `OfficePolicy` | `InstitutionNotification`, relación de `User`, `OfficeNotification`, `OfficeNotifications`, `OfficeNotificationsController`, `OfficeRequest` |
| Frontend | `frontend/src/office/CommunicationsPage.tsx`, `frontend/src/office/shared.tsx`, `frontend/src/App.tsx`, `frontend/src/layouts/AppLayout.tsx` | `frontend/src/office/NotificationsPage.tsx` (incluye campana), `shared.tsx`, `App.tsx`, `layouts/AppLayout.tsx` |
| API, prefijo `/api/v1` | GET/POST `/communications`; GET/PATCH `/communications/{id}`; POST `/{id}/publish` y `/{id}/archive` bajo `/communications`; GET `/office-options/{roles,grades,sections,courses,users}` para selectores | GET `/notifications` y `/my/notifications`; POST `/notifications/{uuid}/read` y `/notifications/read-all` |
| Permisos | `communications.view/create/publish/archive`; editar reutiliza `communications.create`, no existe permiso separado `communications.update` | `notifications.view` para consultar y marcar; no concede por sí solo acceso al recurso enlazado |
| Estado por código | IMPLEMENTADO; recuperación explícita de consultas PARCIAL | IMPLEMENTADO; sincronización entre instancias PARCIAL |
| Evidencias | Gates, transacciones, estados, validación de targets, unión de usuarios activos, capacidades en DTO e interfaz | Relación del usuario + scope institucional, UUID propio, filtros, contador, operaciones de lectura explícitas y campana |
| Pruebas disponibles | Casos de destinatarios/gestión/aislamiento en `backend/tests/Feature/Sprint9Test.php`; publicación en `e2e/cypress/e2e/office.cy.ts` | Casos de propiedad/lectura/aislamiento en `Sprint9Test.php`; campana y marcado en `office.cy.ts` |
| Brechas | Sin reintento GET directo; formulario permite ediciones durante guardado y reemplazo sin protección; filtros de API no expuestos en listado | Sin reintento GET directo; listado completo y compacto no escuchan la actualización que sí escucha la campana |
| Riesgos | Pérdida de ediciones posteriores al envío; pérdida de borrador al cambiar editor; consulta difícil de recuperar | Indicadores y filas pueden discrepar entre vistas; una notificación histórica puede enlazar a comunicado archivado |

Los nombres de clase de la matriz se ubican en `backend/app/Models/Office`, `backend/app/Services/Office`, `backend/app/Http/Controllers/Api`, `backend/app/Http/Requests`, `backend/app/Http/Resources`, `backend/app/Policies` y `backend/app/Notifications`, según su responsabilidad. Las rutas completas y contratos se detallan a continuación.

## Evidencias de backend, seguridad y destinatarios

| Ruta real | Comprobación mediante código |
| --- | --- |
| `backend/routes/api.php` | Expone operaciones de comunicaciones/notificaciones y opciones dentro del grupo autenticado con institución y cambio de contraseña. No existe ruta de chat ni historial específico de comunicaciones. |
| `backend/database/migrations/2026_10_05_110000_create_academic_office_tables.php` | Tablas `communications`, `communication_targets` y `notifications`; FK institucionales, unicidad comunicado/kind/target, UUID y `read_at`. Solo se leyó la migración. |
| `backend/app/Models/Office/Communication.php`, `CommunicationTarget.php`, `OfficeRecord.php` | Relación de criterios con comunicado; heredan scope institucional. Se preservan registros institucionales frente a eliminación por modelo. |
| `backend/app/Models/Concerns/BelongsToInstitution.php` | Scope global; institución de creación tomada del contexto; impide mutarla o actualizar un modelo de otra institución. |
| `backend/app/Services/Office/CommunicationService.php` | `save` permite editar solo DRAFT. `transition` publica solo DRAFT; permite archivar DRAFT/PUBLISHED y rechaza archivar ARCHIVED. Usa transacción, bloqueo institucional, Gate y auditoría; la publicación vuelve a validar criterios y rechaza cero destinatarios. No modifica contenidos después de publicar. |
| `backend/app/Services/Office/CommunicationRecipients.php` | Valida pertenencia institucional de institución/rol/grado/sección/curso/usuario; normaliza IDs y criterios duplicados; une usuarios activos, sin repetir destinatarios. Curso exige ACTIVE y asignación activa; utiliza roster aprobado. Grado/sección toman matrículas APPROVED, docentes con asignación activa y apoderados activos relacionados. |
| `backend/app/Services/Office/OfficeAccess.php` | Sin `communications.view` no devuelve comunicaciones. Personal ADMINISTRATOR/SECRETARY con ese permiso consulta estados institucionales. Otros usuarios solo PUBLISHED cuyo ID figura en sus propias notificaciones de comunicación. La audiencia queda fijada al publicar, no se recalcula por cada lectura. |
| `backend/app/Policies/OfficePolicy.php` | Crear/editar exige rol de personal y permiso create; publicar/archivar exige rol, permiso específico y lectura autorizada. El permiso aislado no convierte a un docente en publicador. |
| `backend/database/seeders/OfficePermissionSeeder.php` | ADMINISTRATOR/SECRETARY reciben gestión; STUDENT/GUARDIAN y TEACHER/TREASURY reciben consulta de comunicaciones y notificaciones. Es configuración semilla leída, no inventario de permisos efectivos actuales en una base. No se ejecutó. |
| `backend/app/Http/Requests/OfficeRequest.php` | Límites título 180/cuerpo 20.000, criterios 1–30 y tipos cerrados. Prohíbe imponer institución, autor, estado o fecha de publicación. La autorización final está en Gates/servicios; `authorize(): true` no los elimina. |
| `backend/app/Http/Controllers/Api/OfficeController.php` | Listado autorizado y paginado, orden descendente ID; filtros `status`, `date` de creación y `search` por título. Detalle ajeno devuelve 404. `history` corresponde a solicitudes, no a comunicaciones. |
| `backend/app/Http/Controllers/Api/OfficeOptionsController.php` | Opciones institucionales paginadas/buscables, restringidas por capacidad de gestión; cursos/usuarios activos y modelos con scopes. No se otorga el catálogo completo a estudiantes por recibir un comunicado. |
| `backend/app/Http/Resources/OfficeResource.php` | Emite título/cuerpo/fechas/estado y capacidades; los criterios de destinatarios se entregan solo a personal con consulta institucional, no al receptor ordinario. |
| `backend/app/Models/Office/InstitutionNotification.php`, `backend/app/Models/User.php` | Notificaciones con scope institucional y relación polimórfica del usuario; no se consultan globalmente solo por UUID. |
| `backend/app/Notifications/OfficeNotification.php`, `backend/app/Services/Office/OfficeNotifications.php` | Canal database; envío inmediato deduplicado a cuentas activas. Avisos de solicitudes son genéricos, sin copiar descripción ni resolución privada. |
| `backend/app/Http/Controllers/Api/OfficeNotificationsController.php` | GET y POST exigen `notifications.view`; filtros read/unread y contador total propio; marcado individual idempotente o masivo solo sobre no leídas propias. UUID ajeno no es accesible por esa relación. |
| `backend/app/Services/Office/OfficeAudit.php` | CREATE/UPDATE/PUBLISH/ARCHIVE registran actor, entidad, metadatos, estados y criterios; excluyen título/cuerpo del comunicado. No equivale a versionado del mensaje ni a recibos de lectura por destinatario. |

No se identificó por estas rutas una ampliación de privilegios o una consulta directa de comunicaciones ajenas sin restricciones. Esto **no es una prueba dinámica de ausencia de vulnerabilidades** ni una auditoría de penetración.

Aspectos que requieren interpretación institucional, no cambios automáticos: el criterio de grado no añade un filtro explícito por año académico y la audiencia publicada permanece histórica ante cambios posteriores de rol/matrícula. La fijación de destinatarios está expresamente documentada en Sprint 9. Confirmar si esa semántica satisface el mapa original antes de proponer restricciones nuevas. Tampoco se debe usar la preferencia familiar `receives_notifications` como regla obligatoria sin una definición institucional del canal.

## Evidencias de interfaz y problemas observables

1. **Navegación existente.** `frontend/src/App.tsx` protege `/app/communications` con `communications.view` y `/app/notifications` con `notifications.view`. `frontend/src/layouts/AppLayout.tsx` filtra enlaces por permisos y monta la campana con `notifications.view`. Las capacidades del recurso controlan edición/publicación/archivo; el backend conserva la decisión final. No se encontró mensajería directa docente–estudiante: el docente recibe comunicados según audiencia, no adquiere facultad de emitirlos por su rol.
2. **Consulta contextual ya protegida.** `frontend/src/office/shared.tsx`, `useOffice`, relaciona datos/error con URL y revisión y usa limpieza `active=false` para ignorar respuestas de efectos anteriores. En un cambio de consulta no muestra indiscriminadamente las filas previas. No corresponde proponer rehacer esa protección como si faltara. `CommunicationsPage.tsx` admite enlace `?communication=id` y remonta el contexto al cambiar los parámetros de búsqueda de la URL.
3. **Recuperación incompleta de GET.** Los listados/detalle de `CommunicationsPage.tsx` y `NotificationsPage.tsx` muestran carga, error y vacío, pero no ofrecen un botón de reintento de la misma consulta. El hook no expone un reintento; cambiar página/selección o remontar es una recuperación indirecta. Un error de listado sin paginación disponible deja pocas opciones dentro de la pantalla. El cliente `frontend/src/api/client.ts` conserva status y mensajes/validaciones; sesión 401/419 dispara `session-expired`. No hay política específica de recuperación por 403/404/422/500 en esas pantallas; no todos esos errores deben reintentarse.
4. **Ediciones posteriores al envío potencialmente descartadas.** En `CommunicationForm`, `FormData` captura texto y `targets` al enviar. Durante el POST/PATCH se desactivan guardar/cancelar/agregar/quitar, pero título, cuerpo, tipo y selector de destinatario siguen editables. Si el usuario los modifica antes de responder, `saved` cierra el formulario al llegar éxito y esas ediciones no forman parte del envío inicial. Secuencia deducida del código; no reproducida en navegador.
5. **Reemplazo del editor sin protección de borrador.** El padre permite «Nuevo comunicado» o editar otro registro y usa `key={editing?.id ?? 'new'}`: al cambiar esa clave se desmonta el formulario y se pierden entradas sin comprobación de cambios. Un cambio de parámetros URL también remonta el contenido. No se comprobó protección global de salida; no se propone cambiar el router ni reutilizar sin análisis soluciones de otros Bolts.
6. **Actualización desigual de notificaciones.** `NotificationBell` escucha `office-notifications`, foco y un temporizador de 60 segundos. Cada `NotificationsPage` conserva su revisión local, sin escuchar esos eventos. Marcar desde la campana mientras está montada la bandeja completa refresca la instancia que escribe y el contador, pero no solicita actualización de la otra bandeja. Análogamente, un popover abierto no recarga necesariamente sus filas cuando cambia solo la revisión de la campana. Es una inconsistencia de suscripciones observable en código; no una demostración dinámica de datos obsoletos.
7. **Filtros.** La bandeja filtra Todas/Sin leer/Leídas y reinicia página. Comunicaciones solo envía `page` pese a que la API soporta estado, fecha y título. Exponerlos sería una mejora de localización sobre API existente, no un endpoint faltante ni un requisito nuevo confirmado. Mantener un detalle abierto al cambiar página no es por sí mismo un defecto: listado y detalle pueden tener contexto independiente.
8. **Accesibilidad y móvil.** Botones nativos, etiquetas de texto, títulos, `role=status` para carga, ajuste de palabras y contenedores flexibles existen. La campana tiene nombre accesible, `aria-expanded`, región identificada, Escape y ancho limitado al viewport. `OfficeSelect` tiene legend de grupo e input de búsqueda nombrado, pero el `<select>` no dispone de etiqueta propia vinculada ni `aria-label`; requiere comprobar nombre accesible específico en navegador, sin confundir la leyenda del grupo con etiqueta de cada control. Es compartido con otras pantallas: cualquier propuesta posterior debe medir impacto y limitar alcance. Tab/Enter, foco, lector de pantalla y comportamiento móvil real permanecen NO VERIFICADOS en esta sesión; no se certifica conformidad WCAG.

## Lectura, historial y límites funcionales

El usuario marca explícitamente una notificación como leída; «Abrir» no demuestra ni registra automáticamente que haya leído el cuerpo del comunicado. No hay panel de acuses por destinatario ni medición de lectura humana. Su ausencia no constituye requisito incumplido sin definición institucional.

Hay conservación de comunicaciones, estados y notificaciones, y auditoría de acciones con metadatos. No se encontró historial de versiones del texto ni endpoint de historial de comunicaciones. No debe confundirse `request_status_history` con una funcionalidad propia de comunicados.

Al archivar, el comunicado desaparece del alcance del destinatario, pero la notificación histórica permanece con su enlace. El detalle puede responder 404: es coherente con la regla documentada, aunque conviene explicar el contexto al usuario sin revelar si existe un registro ajeno.

## Pruebas identificadas y estado de ejecución

Todas las pruebas siguientes están **NO EJECUTADAS en esta auditoría**. No se presentan como aprobadas ni fallidas.

| Archivo/caso localizado | Cobertura por lectura | Relación |
| --- | --- | --- |
| `backend/tests/Feature/Sprint9Test.php`: `deduplicates overlapping communication targets and keeps published recipients stable` | Superposición rol/usuario/curso/grado/sección, borrador oculto, publicación repetida rechazada, edición publicada rechazada, notificación única, receptor sin targets, acceso de docente/apoderado | RF-19/RF-20 |
| Mismo archivo: `restricts communications to recipients and protects foreign targets and management` | Destinatario excluido, archivo no autorizado, archivo por Secretaría, pérdida de acceso tras archivo, institución inválida como audiencia | RF-19/RF-04 |
| Mismo archivo: `marks only owned notifications read and supports unread filters and mark all` | Marcado idempotente, filtro leído/no leído, contador y UUID ajeno, marcado total propio | RF-20 |
| Mismo archivo: `isolates requests documents communications and notifications between institutions` | Detalle de otra institución, UUID de notificación ajeno, listado vacío y target usuario de otra institución | RF-19/RF-20, caso compartido con RF-16/RF-18 |
| Mismo archivo: casos de observación y transiciones atómicas de solicitudes | Avisos derivados del trámite y rollback; el fallo inyectado se prueba sobre solicitudes, no prueba por sí solo rollback de publicación de comunicado | RF-16/RF-17/RF-20 |
| `e2e/cypress/e2e/office.cy.ts`: publicación por Secretaría con rol y usuario | Crear/publicar, lectura docente, ausencia de acción de publicación docente y deduplicación | RF-19/RF-20 |
| Mismo archivo: recepción en campana y marcado individual/masivo | Bandeja, filtro, contador y comprobación de ancho a 390×844 | RF-20; ancho no equivale a auditoría móvil completa |
| `backend/tests/Feature/Sprint10Test.php`: reportes y exportación CSV | El caso de CSV usa `published-communications`, excluye cuerpo privado y neutraliza fórmulas; cobertura adyacente de RF-23 | RF-23 y datos de RF-19; fuera de una implementación nueva de este Bolt |

`Sprint9Test.php` contiene **10 casos** totales: cuatro comprueban directamente comunicaciones/notificaciones/aislamiento compartido, dos adicionales comprueban avisos de solicitudes y los demás son del trámite/documentos. `office.cy.ts` contiene **3 casos** totales: dos directamente relacionados con comunicaciones/notificaciones y uno del trámite documental. No se suman suites mixtas como si todos sus casos fueran exclusivos de RF-19/RF-20.

Los Cypress de `office.cy.ts` utilizan login y peticiones al backend real; sus `cy.intercept` observan tráfico, sin respuestas simuladas. Crean registros con POST y requieren datos preparados: no son seguros para ejecutar contra cualquier base por ser pruebas de navegador. Pest usa `DatabaseTransactions`, crea entidades y ejecuta seeders en su preparación; incluye una aserción de nombre de base `zarate_test`, pero eso no reemplaza verificar usuario, conexión y aislamiento antes de ejecutarlo. No se ejecutaron migraciones, seeders ni preparación de usuarios.

`docs/sprints/sprint-9.md` registra resultados históricos del 05/10/2026, incluida una ejecución con fallos y reejecuciones posteriores. Se conserva como antecedente; no se revalida ni se transforma en evidencia actual de este Bolt.

Cobertura faltante o no localizada en los casos revisados: reintento GET conservando página/contexto; tratamiento contextual 403/404/422/500; HTTP fuera de orden en vistas de comunicaciones; pérdida de texto durante guardado o reemplazo de editor; sincronización entre bandeja y popover; nombre accesible del selector y recorrido Tab/Enter. El caso cuyo nombre menciona destinatarios estables no simula un cambio posterior de matrícula/rol: esa parte de la semántica está respaldada por código y documentación, no por esa simulación concreta. No se afirma que todo el repositorio carezca de cobertura más general de permisos o accesibilidad.

## Mejoras candidatas priorizadas, sin implementación

| Prioridad | Problema y RF | Solución mínima candidata | Alcance probable y comprobación necesaria |
| --- | --- | --- | --- |
| Alta | Recuperación de consulta PARCIAL, RF-19/RF-20 | Reintento explícito únicamente del GET fallido conservando página y selección; separar error de listado/detalle/escritura y comunicar contenido no disponible sin filtrar existencia ajena | `CommunicationsPage.tsx` y `NotificationsPage.tsx`; aprovechar revisión existente de `useOffice`, sin cambiar autorización ni reintentar POST/PATCH. Cypress simulado 500→éxito, mismo URL/página, 403/404 sin bucle, error de escritura sin repetición y respuesta tardía ignorada. |
| Alta | Riesgo de pérdida de borrador, RF-19 | Impedir ediciones que no puedan guardarse durante solicitud pendiente y proteger cambio de editor/nuevo borrador cuando haya entradas modificadas; conservar texto ante fallo | `CommunicationsPage.tsx`; evaluar selectores compartidos antes de tocarlos. Cypress con POST/PATCH demorado, error recuperable y cambio de editor cancelado/confirmado. No autosalvar ni publicar automáticamente; no ampliar el router global. |
| Media | Desincronización de bandejas, RF-20 | Reutilizar el evento existente para refrescar instancias visibles conservando filtros/página; evitar bucles de eventos y peticiones duplicadas | `NotificationsPage.tsx`; prueba con bandeja y campana simultáneas, marcado desde ambas, contador y filas coherentes, sin repetir escrituras. No websockets ni nuevo polling global. |

Como condición de calidad de las mejoras anteriores, comprobar etiquetas de controles, Tab/Enter, foco visible y viewport móvil. El selector sin etiqueta individual es una observación concreta para validar y corregir de manera acotada si se confirma el nombre accesible insuficiente. Exponer filtros de comunicados es una oportunidad secundaria para decidir después de las recuperaciones, usando parámetros ya existentes; no se incluye como necesidad de crear otro módulo.

No hay hallazgo que justifique ampliar audiencias o relajar permisos. Mantener pruebas de regresión de destinatarios, usuario ajeno e institución ajena al implementar cualquier mejora futura. Para pruebas reales se exige confirmar previamente base y usuario de pruebas aislados; las pruebas con API simulada validarían solo interfaz, no aislamiento efectivo de Laravel/MySQL.

## Fuera de alcance y decisiones pendientes

- Chat, mensajería bidireccional, tiempo real, email, SMS, push, WhatsApp y servicios externos: sin requerimiento y decisión institucional que los respalde; no propuestos.
- Acuses de lectura del comunicado, versiones del cuerpo, adjuntos, nuevas audiencias, nuevos permisos y nuevos códigos de procedimiento: no deducibles de las categorías de revisión del prompt.
- Reimplementar las notificaciones de solicitudes, portal familiar, reportes, autenticación o auditoría como nuevos módulos: duplicaría capacidades existentes y excedería esta auditoría.
- Obtener el mapa AS-IS/TO-BE para confirmar códigos, denominaciones y distribución formal entre misional/estratégico/apoyo. Hasta entonces esa trazabilidad es NO VERIFICADA, no PENDIENTE de desarrollo.

## Resultado de la fase

RF-19 y RF-20 cuentan con implementación verificable mediante código y pruebas existentes identificadas. Se recomiendan primero la recuperación de consultas y la protección del borrador, seguidas de sincronización de vistas. No se aprobaron mejoras ni se implementó ninguna. Ejecución automatizada actual: **0 pruebas ejecutadas; ninguna prueba aprobada o fallida declarada; suites identificadas NO EJECUTADAS**. La seguridad dinámica, accesibilidad por teclado y validación móvil permanecen NO VERIFICADAS.

Únicos documentos creados: `prompt-01-auditoria.md` y este `diagnostico.md`. No se modificaron evidencias anteriores ni se generaron commits, push, merge o Pull Requests.
