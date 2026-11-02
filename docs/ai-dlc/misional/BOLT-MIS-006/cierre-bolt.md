# BOLT-MIS-006 — Cierre técnico para revisión

Fecha: 02/11/2026. Repositorio: `D:\zarate-saas`. Rama: `feature/comunicacion-institucional`. HEAD validado: `ef59a31`.

**Clasificación: LISTO CON LIMITACIONES para revisión mediante Pull Request hacia `feature/macro-misional`.** La última ejecución conjunta aprobó 37/37 casos con API simulada. M-02 permanece PARCIAL por navegación SPA global sin bloqueo. **La validación integral con Laravel/MySQL no está completada.** Este documento no autoriza una fusión ni certifica un despliegue productivo.

En esta fase se crearon únicamente este archivo y [prompt-06-validacion-final.md](prompt-06-validacion-final.md). No se modificó código, configuración, pruebas, datos ni evidencias anteriores; no se hicieron commits, push, merge o Pull Requests.

## 1. Objetivo, alcance y requerimientos

Mejorar la recuperación de consultas, la protección local de redacción y la coherencia de notificaciones sobre el módulo de comunicaciones existente, conservando API, permisos, audiencia institucional y reglas de publicación/archivo.

| Requerimiento documental existente | Funcionalidad y alcance de este Bolt |
| --- | --- |
| RF-19 — Gestión de comunicaciones | Ya existían borradores, edición autorizada, audiencias, publicación, archivo, consulta y notificaciones derivadas. M-01 añade recuperación/contexto de GET; M-02 protege el editor local. |
| RF-20 — Gestión de notificaciones | Ya existían avisos propios, contador, filtro read/unread, marcado individual/masivo y campana. M-03 sincroniza vistas e incorpora recuperación segura de GET. |
| RF-04 — Gestión de roles y permisos | Restricción transversal conservada, sin nuevos permisos ni ampliación de privilegios. |
| RF-24 — Auditoría del sistema | Auditoría existente conservada; no se añade contenido privado a logs ni versionado del mensaje. |

Fuentes: `docs/requirements-status.md`, `docs/traceability.md`, `docs/architecture.md`, Sprint 9 y documentos AI-DLC del Bolt. **Códigos y denominaciones originales de procedimientos institucionales: NO VERIFICADOS.** Se usan nombres funcionales descriptivos, sin asignar códigos PM. La falta del mapa AS-IS/TO-BE no se convierte en una tarea de desarrollo inventada.

No se crearon chat, acuses de lectura del comunicado, servicios externos, nuevas audiencias ni versiones del contenido. «Abrir» y «Marcar como leída» siguen siendo acciones diferentes. El historial de notificaciones y la auditoría no se presentan como confirmación humana de lectura.

## 2. Git, commits y alcance real del diff

El estado inicial de Git era limpio. La base local `feature/macro-misional` y el merge-base corresponden a `4b39e768737308c0a242b6de362405aae9ffcdfd`. `git rev-list --left-right --count feature/macro-misional...HEAD` devolvió **0 / 5**: cinco commits exclusivos de esta rama y ninguno exclusivo de la base local. No se realizó fetch; la comparación corresponde a referencias locales.

| Commit real obtenido de Git | Descripción |
| --- | --- |
| `07392ec` | `docs(misional): auditar comunicacion institucional BOLT-MIS-006` |
| `c5730cf` | `docs(misional): planificar mejoras de comunicacion institucional` |
| `63df5a5` | `fix(misional): mejorar consultas de comunicados y validar teclado` — M-01 y validación complementaria. |
| `20f2dcc` | `feat(misional): proteger borradores de comunicados con limites SPA` — M-02. |
| `ef59a31` | `fix(misional): sincronizar campana y bandejas de notificaciones` — M-03. |

Estos commits existían al comenzar este cierre; no fueron creados durante esta fase.

`git diff --stat feature/macro-misional...HEAD`: **17 archivos, 2.484 inserciones y 50 eliminaciones**. Son 11 documentos, 3 componentes/frontend compartido y 3 specs. Los dos documentos nuevos de cierre no forman parte de esas cifras versionadas; al incorporarlos habría 19 archivos respecto a la base, sin otros cambios locales.

### Archivos funcionales y pruebas cambiados en la rama

| Ruta | Alcance |
| --- | --- |
| `frontend/src/office/CommunicationsPage.tsx` | Recuperación contextual y editor protegido localmente. |
| `frontend/src/office/NotificationsPage.tsx` | Campana/bandejas sincronizadas por evento y foco, consultas y sesión. |
| `frontend/src/office/shared.tsx` | `errorStatus` aditivo en `useOffice`; `accessibleLabel` opcional en `OfficeSelect`. Conserva contrato anterior de datos/error/carga. |
| `e2e/cypress/e2e/communication-queries.cy.ts` | 12 casos M-01. |
| `e2e/cypress/e2e/communication-drafts.cy.ts` | 12 casos M-02. |
| `e2e/cypress/e2e/notification-consistency.cy.ts` | 13 casos M-03. |

Los 11 documentos restantes están bajo `docs/ai-dlc/misional/BOLT-MIS-006`: diagnóstico, plan, tres evidencias y seis prompts previos, enumerados en la sección 10.

La lista completa del diff no incluye backend, migraciones, permisos, contratos API, datos, dependencias, estilos globales, dashboard, router, layout ni módulos de otros macroprocesos. Una comparación específica de `backend`, `frontend/src/App.tsx`, `frontend/src/layouts` y `frontend/src/index.css` devolvió código 0, sin diferencias. El diff completo se revisó sin detectar archivos ajenos al alcance. El componente compartido implica riesgo de regresión en consumidores existentes, explicitado más adelante.

## 3. Resultado por mejora y trazabilidad

| Mejora / nombre funcional | RF | Resultado y comportamiento comprobado | Código / prueba | Limitación |
| --- | --- | --- | --- | --- |
| M-01 — Recuperación de consultas de comunicados | RF-19 directo; RF-20 como origen/enlace existente | **COMPLETADA en frontend simulado**. GET independiente de listado/detalle, página/selección conservadas, errores separados, vacío/carga, respuesta tardía ignorada, recuperación sin repetir escritura, Enter y móvil. | `CommunicationsPage.tsx`, `shared.tsx`; `communication-queries.cy.ts`: 12/12. | No prueba publicación/archivo reales ni aislamiento de Laravel/MySQL. No se añadieron filtros ausentes. |
| M-02 — Protección local de borradores | RF-19 directo; RF-20 indirecto por publicación existente | **PARCIAL**. Detecta cambios/reversión, confirma descarte, conserva edición si se cancela o falla el guardado, bloquea campos y operaciones incompatibles durante escritura, espera éxito y descarta callbacks de editor desmontado. | `CommunicationsPage.tsx`, `shared.tsx`; `communication-drafts.cy.ts`: 12/12. | Salida SPA global no bloqueada. Beforeunload complementario no garantiza recuperación ni diálogo en todo navegador. |
| M-03 — Coherencia de campana y bandejas | RF-20 directo; RF-19 como origen y consulta del comunicado | **COMPLETADA en frontend simulado**. Marcado solo tras respuesta confirmada, actualización de instancias visibles, GET recuperable con filtro/página, respuestas tardías y sesión anterior descartadas. | `NotificationsPage.tsx`; `notification-consistency.cy.ts`: 13/13. | Sin tiempo real, sin propagación inmediata entre dispositivos y sin integración real certificada. |

La aprobación de los 12 tests de M-02 incluye un caso que **demuestra la salida SPA no protegida** y la inocuidad del callback tardío. No equivale a una prueba de bloqueo global exitosa.

### M-01 y el fallo histórico de Enter

`evidencias-m01.md` conserva el arranque fallido `ENOMEM`, ejecuciones 9/11 y 10/11 y la investigación posterior. El procedimiento anterior enviaba `keydown/keyup` confiables sin click nativo; la secuencia completa de Enter por CDP, con retorno de carro y keyUp, produjo `click:true` y recuperó el GET. Se corrigió el mecanismo de simulación, sin añadir un manejador artificial al botón nativo. La validación complementaria aprobó 12/12 y la ejecución actual vuelve a comprobarlos. El texto inicial PARCIAL en la evidencia es histórico; su sección complementaria registra el estado posterior.

### M-02 y navegación SPA

`BrowserRouter`/`Routes` permanece sin cambios y no se introdujo un bloqueo global reutilizable. Nuevo/Editar/Cancelar están protegidos por confirmación local. Leer otro comunicado conserva el editor, sin reemplazarlo. El menú puede abandonar la pantalla con cambios o escritura pendiente, y los cambios locales pueden perderse. Una operación ya enviada podría confirmarse en el servidor después de salir; el guard de desmontaje solo evita que su respuesta afecte un editor nuevo. No se promete reversión del servidor ni recuperación tras cierre/recarga. No hay almacenamiento persistente del borrador.

### M-03 y eliminación del temporizador

El plan inicial contemplaba conservar el temporizador de 60 segundos; el prompt 05 posterior prohíbe polling continuo y prevaleció. La eliminación está documentada en M-03 y se confirma por lectura del componente actual, sin `setInterval`.

- **Implementado:** invalidación por marcado confirmado/evento `office-notifications`, recuperación de foco, apertura de campana y reintentos explícitos.
- **No implementado ni afirmado:** WebSockets, tiempo real o actualización inmediata entre dispositivos/pestañas.
- Los avisos externos pueden no verse hasta foco/apertura/evento o consulta explícita. Los GET de cada vista son independientes; puede haber carga o un breve desfase hasta completar todas las respuestas. No hay snapshot atómico común.

## 4. Validación conjunta ejecutada en este cierre

Entorno: Cypress 16.1.1, Edge 156 headless, Node 26.7.0 y frontend local. Las APIs de los tres specs están interceptadas; POST/PATCH, identidades y login/logout también se simulan. No se crearon registros institucionales ni usuarios demo. Se usó ejecución autorizada del navegador fuera del sandbox, sin cambiar configuración ni pruebas.

Comando desde `e2e`, idéntico en los dos intentos:

```text
npm test -- --browser edge --spec cypress/e2e/communication-queries.cy.ts,cypress/e2e/communication-drafts.cy.ts,cypress/e2e/notification-consistency.cy.ts
```

| Ejecución de cierre | M-01 aprobadas/fallidas | M-02 aprobadas/fallidas | M-03 aprobadas/fallidas | Total | Salida |
| --- | --- | --- | --- | --- | --- |
| Inicial | 11 / 1 | 12 / 0 | 13 / 0 | 36 aprobadas, 1 fallida; 0 pendientes/omitidas | 1 |
| Repetición conjunta sin cambios | **12 / 0** | **12 / 0** | **13 / 0** | **37 aprobadas, 0 fallidas; 0 pendientes/omitidas** | **0** |

**Fallo conservado:** en el primer caso de M-01, `cy.visit` agotó `pageLoadTimeout=60000ms`: la página no emitió `load` a tiempo. Falló la carga inicial antes de alcanzar las comprobaciones funcionales de ese caso. No fue el fallo histórico de Enter. No se modificó el timeout, el código ni la prueba; la repetición completa aprobó. La causa última del incidente de carga no está determinada y no se atribuye como defecto confirmado del módulo; se conserva como riesgo de estabilidad del entorno/procedimiento a observar.

El total final es **37 casos únicos**, no 73 aprobaciones ni 74 pruebas nuevas por sumar intentos. El resultado previo 36/1 no se borra ni se transforma retroactivamente en éxito. La conclusión funcional se basa en la segunda ejecución conjunta completa.

| Control actual | Resultado |
| --- | --- |
| `frontend`: `npm run build` | APROBADO, código 0; ejecutó `tsc -b` y Vite, 100 módulos. Sin errores TypeScript frontend en esa ejecución. |
| `frontend`: `npm run lint` | APROBADO, código 0. |
| `e2e`: `npm run typecheck` | APROBADO, código 0. |
| Cypress conjunto final | 37 aprobadas, 0 fallidas, 0 pendientes/omitidas; API simulada. |
| `git diff --check feature/macro-misional...HEAD` | Sin errores detectados en los cambios versionados del Bolt. |
| `git diff --check` | Sin errores detectados en cambios de trabajo versionados; los dos documentos nuevos se revisan también por separado. |

No quedan casos fallidos en la última ejecución. Eso no elimina el incidente inicial ni equivale a pruebas reales faltantes aprobadas.

## 5. Pruebas reales no ejecutadas y comprobación de seguridad del entorno

Se inspeccionaron únicamente las claves de nombre de base, sin publicar contraseñas ni secretos:

- `backend/.env`: base declarada **zarate_dev**.
- `backend/.env.testing`: base declarada **zarate_test**.
- `backend/phpunit.xml`: fuerza entorno testing, conexión MySQL, base y usuario de pruebas `zarate_test`, y limpia DB_URL. No se encontró archivo de configuración cacheada en `backend/bootstrap/cache/config.php`.
- Esas declaraciones **no demuestran** disponibilidad del servicio, privilegios efectivos exclusivos, aislamiento de datos ni que el backend al que apunta el proxy de Cypress use la conexión de pruebas.

Por tanto, no se iniciaron Laravel/MySQL, conexiones SQL, migraciones, seeders, limpieza ni pruebas reales de escritura en esta fase. No se alteró configuración para forzar resultados.

| Suite identificada, no ejecutada | Cantidad identificada | Motivo y alcance |
| --- | --- | --- |
| `backend/tests/Feature/Sprint9Test.php` | **10 casos**, de alcance mixto | Usa transacciones, crea entidades y seeders; falta confirmar aislamiento/usuario efectivos. Cuatro casos cubren directamente comunicaciones/notificaciones/aislamiento y otros cubren trámites/documentos o avisos de trámites. |
| `e2e/cypress/e2e/office.cy.ts` | **3 casos**, de alcance mixto | Usa backend real y crea registros; no se confirmó que el servicio esté aislado de zarate_dev. Dos casos son comunicación/notificaciones y uno de trámite documental. |
| Total identificado de integración real | **13 casos NO EJECUTADOS** | No es el total de todas las pruebas del SaaS ni equivale a casos pendientes dentro de la suite simulada. |

La regresión segura ejecutada fue la conjunta de M-01/M-02/M-03. Autorización, audiencias, persistencia, transacciones, auditoría y compatibilidad exacta con respuestas reales de Laravel/MySQL siguen **NO VERIFICADAS dinámicamente** en esta validación. Pruebas de lector de pantalla, contraste, recorrido Tab completo, diálogos reales de recarga/cierre y otros navegadores tampoco se ejecutaron; no tienen un número cerrado de casos que permita sumarlas como métricas inventadas.

## 6. Seguridad, roles y contratos conservados

Revisión estática de `OfficeAccess`, `OfficePolicy`, `CommunicationService`, `CommunicationRecipients`, `OfficeNotificationsController`, `OfficeRequest`, `OfficeResource`, `OfficeAudit`, relación de `User` y scopes institucionales. Estos archivos backend no cambiaron frente a la base.

| Control | Evidencia conservada | Tipo de comprobación |
| --- | --- | --- |
| Autenticación y contexto | Sanctum, cliente con cookies/CSRF, institución del usuario y gestión previa 401/419 sin cambios. | Estática; login de Cypress simulado. |
| Gestión de comunicaciones | ADMINISTRATOR/SECRETARY y permiso efectivo; `communications.create` también rige edición. Publicar/archivar requieren permisos específicos y recurso autorizado. | Estática; interfaz según capacidades simuladas. |
| Consulta de destinatario | `communications.view`; receptor ordinario solo PUBLISHED cuyo ID aparece en sus notificaciones propias. Personal autorizado puede supervisar estados. | Estática; no prueba de IDOR real. |
| Audiencia | Criterios institucionales validados, destinatarios activos deduplicados y fijados al publicar. Sin nuevas audiencias ni redistribución histórica. | Estática. |
| Notificaciones propias | `notifications.view`; relación propia para UUID/read-all y contador calculado por servidor. | Estática y comportamiento UI simulado. |
| Estados y auditoría | DRAFT editable; publicación/archivo autorizados, transacción y auditoría con metadatos, sin cuerpo privado en logs. | Estática, sin ejecución de transacciones. |
| Privacidad del navegador | Borrador en memoria, sin localStorage/sessionStorage/IndexedDB; estado de notificaciones separado por usuario/institución. | Estática y cambio de identidad simulado. |

Los permisos de consulta iniciales de STUDENT/GUARDIAN/TEACHER/TREASURY siguen sujetos al alcance definido en backend. No se evaluó el inventario efectivo de roles personalizados en una base real. Las interceptaciones no demuestran aislamiento institucional del servidor ni certifican ausencia de vulnerabilidades.

### Endpoints preservados

Prefijo `/api/v1`, sin nuevas rutas:

- GET/POST `/communications`; GET/PATCH `/communications/{id}`; POST `/communications/{id}/publish` y `/archive`.
- GET `/office-options/{roles,grades,sections,courses,users}` para criterios existentes.
- GET `/notifications` y `/my/notifications`; POST `/notifications/{uuid}/read` y `/notifications/read-all`.

Los reintentos de lectura solo repiten GET; no reenvían guardado, publicación, archivo ni marcado. Abrir comunicado no confirma lectura de la notificación. No se creó `communications.update`, otro estado de lectura ni un contrato de acuse humano.

## 7. Accesibilidad, móvil y revisión UX/UI

| Aspecto | Evidencia actual y límite |
| --- | --- |
| Contexto de errores, carga y vacío | Regiones de consulta, mensajes independientes, rol alert/status, botón nativo de recuperación, vacío solo con respuesta exitosa. Tests M-01/M-03. |
| Borrador y guardado | Indicadores limpio/modificado/guardando, fieldset deshabilitado y nombre accesible del selector. Tests M-02. |
| Lectura de notificaciones | Texto Leída/Sin leer y estilos existentes; contador desconocido distinto de cero. Tests M-03. |
| Teclado | Enter nativo por CDP recupera consulta, guarda borrador y abre campana. M-01/M-02 observan click confiable. Escape de popover se prueba mediante evento de Cypress, sin afirmar pulsación física nativa. |
| Foco | Controles se enfocan y estilos globales focus-visible se conservaron. No se midió contraste del contorno ni se recorrió Tab en toda la página. |
| Móvil | Ausencia de desbordamiento horizontal a 390×844 en los estados focalizados: error/recuperación, editor/guardado y bandeja/popover. No garantiza todos los contenidos, tamaños o zooms. |
| Identidad visual | Reutilización de Message, EmptyState, StatusBadge, Pager y clases institucionales. Sin cambios globales de colores, dashboard, navegación o dependencias. |

No hay certificado WCAG ni aprobación global de accesibilidad. El aviso beforeunload se prueba como registro/limpieza de handler mediante evento cancelable; no certifica que el navegador muestre siempre un diálogo real.

## 8. Riesgos residuales y limitaciones

1. **Navegación SPA global sin protección:** limitación demostrada de M-02. Cambiar módulo puede perder el borrador; una escritura enviada puede terminar después de salir. No se resuelve con beforeunload ni guardado automático.
2. **Integración pendiente:** falta contrastar mocks con Laravel/MySQL reales, permisos, UUID, audiencia, auditoría y efectos transaccionales en un entorno aislado. Riesgo de diferencias de contrato; no se presenta como una incompatibilidad ya demostrada.
3. **Accesibilidad parcial:** cobertura puntual de teclado/nombres/viewport, sin lector de pantalla, contraste medido, recorrido Tab completo ni todos los navegadores.
4. **Notificaciones externas sin tiempo real:** dependen de foco, apertura y eventos/consulta disponibles. No se promete propagación inmediata entre dispositivos.
5. **Consultas independientes:** contador y bandejas pueden estar en carga o terminar en momentos distintos; no existe snapshot único de servidor. El contrato actual permite convergencia posterior, no atomicidad visual universal.
6. **Componente compartido:** adiciones compatibles en `shared.tsx`, pero consumidores Office ajenos a los tres specs tienen integración real pendiente. Build/lint no equivalen a probar todo su funcionamiento.
7. **Estabilidad de carga de pruebas:** timeout inicial de 60 segundos no reproducido en la repetición completa. Conservar diagnóstico y observar si reaparece; no ocultarlo aumentando timeouts sin investigación.
8. **Trazabilidad institucional:** mapa original y códigos de procedimientos no verificados. Audiencias por grado/año y conservación histórica requieren definición institucional antes de proponer cambios de reglas.

## 9. Recomendación para Pull Request e integración posterior

**LISTO CON LIMITACIONES para abrir un PR de revisión de `feature/comunicacion-institucional` hacia `feature/macro-misional`.** La revisión debe declarar M-02 PARCIAL, la ejecución final 37/37 simulada, el timeout inicial y los 13 casos reales identificados no ejecutados. No se recomienda presentarlo como protección completa de borradores ni validación integral terminada.

Pasos posteriores recomendados, no realizados en esta fase:

1. Revisar y aceptar explícitamente el alcance parcial de navegación SPA o planificar un mecanismo compatible de bloqueo con pruebas de menú, atrás/adelante y cambios de ruta; no modificar globalmente el router como ajuste incidental.
2. Confirmar base/usuario efectivos y aislamiento de un entorno de integración, sin acceso de escritura a zarate_dev; después ejecutar Pest y Cypress reales de comunicación/Office y registrar sus resultados exactos.
3. Contrastar contratos simulados con paginación/recursos reales, permisos personalizados, destinatarios y transacciones; ampliar regresión del componente compartido sin duplicar funcionalidades.
4. Completar revisión de teclado/lector de pantalla/contraste y otros viewports/navegadores. Validar diálogos reales de recarga con el comportamiento del navegador utilizado.
5. Confirmar el mapa institucional y mantener documentada la actualización por eventos/foco, sin presentar tiempo real como implementado. Observar el incidente de carga si reaparece.

No se creó ni fusionó un PR. La recomendación de revisión no es aprobación docente/institucional ni autorización de despliegue.

## 10. Inventario AI-DLC y consistencia documental

Todos bajo `docs/ai-dlc/misional/BOLT-MIS-006/`:

| Documento | Función |
| --- | --- |
| [prompt-01-auditoria.md](prompt-01-auditoria.md) | Solicitud inicial íntegra. |
| [diagnostico.md](diagnostico.md) | Hallazgos iniciales, código y pruebas identificadas; snapshot previo a implementar. |
| [prompt-02-validacion.md](prompt-02-validacion.md) | Solicitud íntegra de contrastación y planificación. |
| [plan-mejoras.md](plan-mejoras.md) | Selección y criterios de las tres mejoras; conserva la propuesta inicial del temporizador, superada explícitamente por prompt 05. |
| [prompt-03-implementacion-m01.md](prompt-03-implementacion-m01.md) | Implementación M-01 solicitada. |
| [prompt-03b-validacion-teclado.md](prompt-03b-validacion-teclado.md) | Investigación de teclado solicitada, texto completo. |
| [evidencias-m01.md](evidencias-m01.md) | Fallos históricos y validación complementaria que actualiza M-01. |
| [prompt-04-implementacion-m02.md](prompt-04-implementacion-m02.md) | Implementación M-02 solicitada. |
| [evidencias-m02.md](evidencias-m02.md) | Protecciones locales, fallo auxiliar inicial del test móvil, reejecución y estado PARCIAL. |
| [prompt-05-implementacion-m03.md](prompt-05-implementacion-m03.md) | Implementación M-03 solicitada. |
| [evidencias-m03.md](evidencias-m03.md) | Sincronización, eliminación de polling, 37/37 de esa fase y límites. |
| [prompt-06-validacion-final.md](prompt-06-validacion-final.md) | Solicitud de cierre íntegra, creada ahora. |
| [cierre-bolt.md](cierre-bolt.md) | Estado consolidado, nueva ejecución y recomendación para revisión. |

Se comprobaron hashes coincidentes entre adjuntos y prompts 01, 02, 03, 04 y 05; el prompt 03B procede del texto directo del usuario y se conserva sin resumir. El prompt 06 se copia íntegro del adjunto. No se reescribieron documentos iniciales para ocultar resultados históricos o diferencias de alcance. Los estados más recientes se interpretan con sus validaciones complementarias y este cierre, sin convertir los antecedentes en ejecuciones actuales.
