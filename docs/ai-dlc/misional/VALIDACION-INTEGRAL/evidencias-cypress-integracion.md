# Prompt 38 — Cypress: preparación e integración controlada

## Estado inicial y alcance

07/11/2026. Rama comprobada: `test/integracion-misional`. Se conserva el cierre de Prompt 37: 276 casos Pest distintos aprobados, 1.724 aserciones y 38 excluidos. No se repite Pest ni se habilitan sus 38 casos bloqueados.

La lectura de los cierres 35–37 confirma MySQL aislado apagado, 52 tablas, 14 migraciones y cero residuos como última evidencia SQL. En Prompt 38 no se reutilizan credenciales ni la base `zarate_pest` para HTTP. La observación inicial de procesos y puertos no encontró listeners en 3307/3308/8000/8001/5173/5174 ni procesos Node/PHP/MySQL/Cypress. No se modifican servicios de demostración.

## Inventario descubierto

Se registraron **188 casos en 26 specs** mediante transpilación TypeScript y ejecución exclusiva del registro de suites/casos en una VM sin red, `require`, comandos `cy` ni callbacks de pruebas/hooks. Los bucles y datasets se expandieron durante ese registro. No son cantidades copiadas de ejecuciones históricas ni equivalen por sí solas a casos ejecutados en navegador. El runner contrastará las cantidades de los specs seleccionados con este inventario.

Referencias privadas: `prompt38/inventory.json` (selección inicial), `inventory-reviewed.json` (selección revisada), casos expandidos, imports, hooks y llamadas relevantes con líneas de código.

| Módulo principal | Inventariados | Seleccionados | Bloqueados por entorno/contrato |
|---|---:|---:|---:|
| Autenticación | 9 | 0 | 9 |
| Matrículas | 6 | 0 | 6 |
| Aula Virtual | 41 | 29 | 12 |
| Evaluaciones | 21 | 21 | 0 |
| Asistencia | 54 | 51 | 3 |
| Comunicaciones | 40 | 37 | 3 |
| Transversal | 17 | 4 | 13 |
| Total | 188 | 142 | 46 |

La asignación es por módulo principal del spec; no se duplica un caso para atribuirle cobertura secundaria de permisos, accesibilidad o navegación.

Se seleccionaron 141 casos de API simulada en 12 specs y un caso de HTTP real en `integration.cy.ts`, limitado a `/api/health`. Los 46 excluidos pertenecen a specs con contratos de Laravel/datos reales, autenticación, escrituras, descargas o archivos que todavía no tienen un entorno de datos autorizado. La exclusión por spec no significa que cada uno de sus casos ejecute SQL destructivo.

Specs simulados seleccionados: `ui`, `virtual-access`, `submission-deadline`, `learning-filters`, `assessment-context`, `score-history`, `attendance-draft`, `justification-query`, `personal-attendance-query`, `communication-queries`, `communication-drafts` y `notification-consistency`, todos bajo `e2e/cypress/e2e/*.cy.ts`.

## Arquitectura HTTP sin SQL

- Frontend: Vite en `127.0.0.1:5174`, sirviendo los componentes originales de React. Configuración privada, `configFile:false`, directorio env vacío/controlado y caché privada; no carga `frontend/vite.config.ts` ni variables de desarrollo. La URL técnica se fija a `/api`.
- Backend: PHP/Laravel original en `127.0.0.1:8001`, con router privado que permite exclusivamente GET `/api/health`. No se añade ninguna ruta al repositorio funcional. El controlador original `backend/app/Http/Controllers/Api/HealthController.php` devuelve salud técnica sin SQL.
- El router rechaza las rutas de negocio y todos los métodos de escritura antes de arrancar Laravel. La identidad diagnóstica privada comprueba PID y nonce; no es un endpoint del sistema funcional.
- Laravel: `APP_ENV=testing`, debug deshabilitado, sesión y caché en memoria, correo en array, cola nula, archivos/logs/bootstrap/temporales privados. No carga `.env` de desarrollo. Sanctum y CORS se limitan a `127.0.0.1:5174`; nombre de cookie exclusivo.
- SQL: ninguna conexión configurada y `DatabaseManager` privado que rechaza cualquier intento antes de abrir PDO. No hay cuenta MySQL, migraciones, seeders, fixtures SQL, tokens persistentes ni base Cypress nueva. No se importa ni modifica la guarda SQL de 120 segundos.
- Procesos hijos con entorno reducido; no heredan variables APP/DB de desarrollo. PID, ejecutable, comando, padre y listeners se contrastan con Windows. Se vigilan eventos de suspensión antes de cada spec.
- Cypress usa configuración privada, baseUrl exacta, capturas/resultados/descargas/temporales privados y cero reintentos automáticos. No se modifican las aserciones ni callbacks de los specs originales. Un soporte privado bloquea peticiones del navegador fuera del origen autorizado y registra denegaciones; no añade escenarios de negocio ni cuenta casos adicionales.

Este diseño permite validar React y respuestas simuladas, además de un recorrido HTTP real React→Vite→Laravel para salud técnica. **No valida integración con MySQL ni autenticación, autorización o escrituras reales de los módulos.**

## Preparación y registros previos a Cypress

El preflight offline rechazó inicialmente comparaciones de rutas con separadores Windows, el literal `null` de la cola y la interpretación de rutas absolutas de caché por Laravel. Se corrigieron únicamente el adaptador privado y sus rutas; los rechazos permanecen en `run/http-events.jsonl`. No hubo conexión SQL ni ejecución Cypress durante esos intentos.

La sonda posterior aprobó: Laravel testing, cero conexiones configuradas, intento SQL bloqueado, sesión/cache array y storage/bootstrap privados. TypeScript E2E (`tsc --project e2e/tsconfig.json --noEmit`) terminó con código 0. Son comprobaciones de preparación, no casos Cypress aprobados.

Los resultados reales de navegador y las limitaciones finales se incorporarán por anexo. No se declara aprobada ninguna selección antes de recibir los resultados del runner.

## Primer intento y recuperación de infraestructura

El primer intento permitió verificar HTTP real de salud, las identidades de procesos y el rechazo de GET/POST a una ruta de negocio, sin SQL. Cypress se detuvo al preparar `ui.cy.ts`: `TsConfigNotFoundError: No tsconfig.json found. ts-loader needs a tsconfig.json file to work`, referido al soporte privado TypeScript situado fuera de `e2e`. Resultado original: `totalTests=0`, `totalPassed=0`, `totalFailed=1`, sin callbacks de casos ejecutados. Ese fallo de preparación se conserva y no se contabiliza como un caso funcional ejecutado.

No se continuó con otros specs. El supervisor cerró sus procesos propios; una comprobación posterior confirmó cero procesos PHP/Node/Cypress/MySQL y puertos vigilados libres. Registros originales: `prompt38/run/ui.cy.ts.result.json`, sus logs y `run/result.json`; `processes-after-attempt1.json` confirma el estado de cierre.

Se preparó una recuperación separada en `prompt38r`, sin sobrescribir resultados: soporte privado equivalente en JavaScript, para evitar buscar un tsconfig fuera del proyecto; originales TypeScript y aserciones intactos. Se corrigió además la lectura de la estructura devuelta por `Cypress.run` (los resultados completos no incluyen necesariamente un campo `status`). El código de supervisión ahora distingue preparación fallida de resultados reales de casos.

Se restringió la lista de archivos servibles de Vite al frontend y su caché privada, con denegación explícita de archivos privados. Antes de ejecutar pruebas se exigirá un rechazo 403 de la ruta al archivo privado. No hubo casos ejecutados ni solicitudes de ese archivo en el primer intento; no se afirma una aprobación retrospectiva del control que faltaba.

La recuperación requiere preflight HTTP nuevo, PID/nonce nuevos y la misma prohibición total de SQL. No hay repetición de casos previamente aprobados: el intento anterior ejecutó cero.
## Recuperación y fallo real del caso de salud

En `prompt38r` aprobaron los 3 casos de `ui.cy.ts`. El caso único de `integration.cy.ts` se ejecutó y **falló**; se conserva sin cambiarlo ni repetirlo:

`AssertionError: Timed out retrying after 4000ms: expected undefined to equal 200`, en `integration.cy.ts:9:50`, al comprobar `cy.wait('@health').its('response.statusCode')`.

La solicitud `cy.request('/api/health')` superó sus aserciones previas. Laravel registró las solicitudes de salud y la captura muestra «Backend conectado correctamente», pero esto no convierte el caso completo en aprobado. La captura muestra dos interceptaciones de salud y una primera espera sin código de respuesta. `frontend/src/main.tsx` usa StrictMode; `TechnicalPage.tsx` cancela el AbortController al limpiar el efecto. El síntoma es compatible con que la espera tome la petición cancelada del primer montaje. Se clasifica como fallo de sincronización de la prueba pendiente de revisión; no hay evidencia suficiente para afirmar un defecto funcional de la API. No se elimina StrictMode ni se cambian aserciones para hacerlo pasar.

Evidencias: `prompt38r/run/integration.cy.ts.result.json`, JUnit, logs y captura en `prompt38r/screenshots/integration.cy.ts/`. El supervisor detuvo la cohorte al fallar la prueba de humo. La observación posterior confirmó cero procesos de pruebas y puertos vigilados libres.

Se preparó `prompt38m` para ejecutar exclusivamente los 138 casos simulados todavía no ejecutados. Se excluyen expresamente los 3 aprobados de UI y el caso real fallido. No es un reintento del caso de salud. Requiere preflight nuevo y mantiene SQL prohibido. Se retiró un argumento de navegador que Electron reportó como no soportado; no se atribuye a ese argumento un bloqueo efectivo de red.

La recomendación para el caso de salud es revisar la sincronización de la espera con una respuesta completada de HTTP y conservar la comprobación de estado y cuerpo. No se implementa esa corrección en este prompt.

## Consolidación final — 10/11/2026

**B. CYPRESS — VALIDACIÓN PARCIAL.** Las ejecuciones terminaron el **07/11/2026**; esta consolidación posterior no cambia sus fechas ni repite casos. La ventana del último lote fue aproximadamente 13:06–13:20 de Lima. La observación de procesos actual corresponde al 10/11 y se conserva separadamente.

### Matriz de resultados reales

| Módulo | Inventariados | Ejecutados | Aprobados | Fallidos | Bloqueados |
|---|---:|---:|---:|---:|---:|
| Autenticación | 9 | 0 | 0 | 0 | 9 |
| Matrículas | 6 | 0 | 0 | 0 | 6 |
| Aula Virtual | 41 | 29 | 29 | 0 | 12 |
| Evaluaciones | 21 | 21 | 21 | 0 | 0 |
| Asistencia | 54 | 51 | 51 | 0 | 3 |
| Comunicaciones | 40 | 37 | 37 | 0 | 3 |
| Transversal | 17 | 4 | 3 | 1 | 13 |
| **Total** | **188** | **142** | **141** | **1** | **46** |

Los 46 no ejecutados están bloqueados por el contrato de datos/HTTP real; no son aprobados ni fallos funcionales demostrados. Se ejecutaron **141 casos con API simulada, todos aprobados**, y **un caso HTTP real de salud, fallido**. No se ejecutó ningún flujo con MySQL. El primer error de preparación reportó un fallo del runner pero cero casos: se registra aparte y no se suma como un caso número 143. No hubo casos pendientes/skipped en las ejecuciones completas.

### Inventario por spec

| Archivo bajo e2e/cypress/e2e | Casos descubiertos | Ejecutados | Aprobados | Fallidos | Modalidad/estado |
|---|---:|---:|---:|---:|---|
| academic.cy.ts | 4 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| assessment-context.cy.ts | 12 | 12 | 12 | 0 | API simulada |
| attendance-draft.cy.ts | 16 | 16 | 16 | 0 | API simulada |
| attendance.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| auth.cy.ts | 9 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| classroom.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| communication-drafts.cy.ts | 12 | 12 | 12 | 0 | API simulada |
| communication-queries.cy.ts | 12 | 12 | 12 | 0 | API simulada |
| courses.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| enrollment-center.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| enrollment.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| integration.cy.ts | 1 | 1 | 0 | 1 | HTTP real, sin SQL |
| justification-query.cy.ts | 17 | 17 | 17 | 0 | API simulada |
| learning-filters.cy.ts | 10 | 10 | 10 | 0 | API simulada |
| learning.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| notification-consistency.cy.ts | 13 | 13 | 13 | 0 | API simulada |
| office.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| people.cy.ts | 5 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| personal-attendance-query.cy.ts | 18 | 18 | 18 | 0 | API simulada |
| reports.cy.ts | 2 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| score-history.cy.ts | 9 | 9 | 9 | 0 | API simulada |
| submission-deadline.cy.ts | 10 | 10 | 10 | 0 | API simulada |
| ui.cy.ts | 3 | 3 | 3 | 0 | API simulada |
| virtual-access.cy.ts | 9 | 9 | 9 | 0 | API simulada |
| virtual.cy.ts | 3 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |
| visual.cy.ts | 2 | 0 | 0 | 0 | Bloqueado: entorno/datos reales |

Las cantidades ejecutadas se contrastaron con los resultados originales de Cypress y con los nombres expandidos de cada caso/dataset. Se acreditan 142 identidades únicas; no se repitieron los tres casos de UI aprobados ni el caso HTTP fallido en el lote final de 138. Los 26 archivos TypeScript originales y sus aserciones no fueron modificados.

### Cobertura comprobada y límites

- Aula Virtual: visibilidad por permisos efectivos, roles personalizados/mixtos, tareas sin materiales, notas propias autorizadas, filtros docentes y orientación de plazos; **API simulada**. Cursos, materiales reales, cargas y descargas permanecen sin ejecución.
- Evaluaciones: contexto de evaluación, formularios y rechazos simulados, historial de cambios de una nota, paginación, reintento, respuestas tardías, privacidad visual y móvil; no es expediente académico longitudinal ni autorización real del servidor.
- Asistencia: borradores y avisos locales, carga/guardado/recarga simulados, consultas y justificaciones personales/familiares, filtros, errores y teclado/móvil. No se registra ni aprueba asistencia real en una base. No se convierte en resuelta la limitación histórica de navegación SPA por ejecutar los tests que la documentan.
- Comunicaciones: consultas recuperables, borradores, sincronización de campana/bandejas y estados simulados. No se publican comunicados ni se crean solicitudes/documentos reales.
- Transversal: tres casos técnicos de React aprobados. El recorrido HTTP real salud tiene evidencia parcial positiva pero falla una aserción de espera: no se declara aprobado. Los escenarios de autenticación real, Matrículas, personas y reportes quedan limitados por sus dependencias de datos y efectos persistentes.
- Accesibilidad y diseño adaptable: únicamente las comprobaciones concretas incluidas en los specs aprobados, entre ellas Enter nativo y ancho móvil; no es una certificación integral de accesibilidad.

### Cierre de seguridad y efectos

No se arrancó MySQL, no se abrió una conexión SQL ni se crearon bases, cuentas, privilegios, fixtures SQL, migraciones o seeders. Las escrituras de los tests simulados terminaron en interceptaciones del navegador. Las sondas negativas POST del preflight fueron rechazadas por el router privado antes de entrar en rutas de negocio. Las sesiones de salud fueron array; no hubo usuarios demo ni tokens institucionales. Los artefactos de navegador, cachés y logs son privados y se conservaron.

El estado de 52 tablas/14 migraciones/cero residuos corresponde al cierre SQL comprobado en Prompt 37; **no se reconsulta ni se presenta como verificación MySQL de Cypress**. Las bases protegidas no se usaron. La guarda Pest de 120 segundos y TLS no fueron modificados ni reutilizados como autorización de HTTP.

Las comprobaciones antes de cada spec y al final acreditaron procesos PHP/Vite propios, padres y listeners 8001/5174. La ruta de archivo privado recibió 403 en el preflight recuperado; no se sirvieron sus contenidos. El soporte registró cero peticiones de aplicación a orígenes externos. No se atribuye a los argumentos ignorados por Electron una protección que no aplicaron.

Los tres intentos conservaron sus resultados y cerraron exclusivamente los procesos lanzados por sus supervisores. La observación actual no encuentra procesos PHP/Node/Cypress/MySQL, listeners vigilados ni PID MySQL. La consulta acotada a la ventana real del lote final no encontró suspensiones y no presentó errores; no se extrapola esa conclusión a los días posteriores.

Pest permanece separado: **276 casos / 1.724 aserciones**, 38 bloqueados, cero ejecuciones Pest en este prompt. Se verificaron por hash los 276 JUnit, 602 archivos versionados, 72 documentos anteriores y 3601 entradas protegidas del cierre previo, sin cambios.

### Evidencias y estado Git

- Prompt literal: [prompt-38-cypress-integracion.md](prompt-38-cypress-integracion.md).
- Privados: prompt38/inventory.json, inventory-reviewed.json, consolidated-final.json, result-manifest.json y final-process-observation.json.
- Primer error de compilación: prompt38/run/ui.cy.ts.result.json y logs, conservados.
- Primeras cuatro ejecuciones reales de casos: prompt38r/run/*.result.json y JUnit. Fallo de salud: integration.cy.ts.result.json y captura en prompt38r/screenshots/integration.cy.ts/.
- Lote de 138 aprobados: prompt38m/run/*.result.json, JUnit, progress-1.json a progress-11.json y result.json.
- Guardas HTTP y de procesos: http-preflight.json, laravel-probe.stdout.json, *.identity.stdout.json, browser-network.jsonl y http-events.jsonl por cohorte.

Rama: test/integracion-misional. Los cambios funcionales, pruebas originales, migraciones y documentos anteriores permanecen intactos. Se crean únicamente los dos documentos públicos solicitados y herramientas/evidencias privadas. Se preservan las modificaciones previas del usuario. Sin commits, push, merge o Pull Request.

## Habilitación pendiente de escenarios con escritura

No se dispone todavía de un entorno SQL autorizado para Cypress. Los siguientes puntos son una **propuesta para revisión**, no operaciones realizadas ni una solicitud genérica de privilegios:

1. **Instancia descartable independiente.** Proponer otro proceso MySQL, datadir nuevo y UUID propio, por ejemplo en puerto 3309. Ese puerto es una propuesta, no se afirma disponible: debe comprobarse nuevamente antes de autorizar el arranque. Mantener intactos 3307, `zarate_dev`, `zarate_test`, el datadir de Pest y sus cuentas. No importar datos de esas bases.
2. **Base y cuentas exclusivas.** Autorizar expresamente una base nueva, por ejemplo `zarate_cypress`, y cuentas nuevas limitadas exclusivamente a ella. Separar migrador de cuenta HTTP. Verificar grants reales y denegaciones a bases protegidas. Contraseñas y claves se crean/guardan en archivos privados, sin publicarlas ni modificar las existentes.
3. **Inicialización controlada.** Autorizar la aplicación de las 14 migraciones originales únicamente en esa nueva base, después de verificar PID, ejecutable, puerto, UUID, datadir, identidad SQL y TLS CA/IP. No modificar las migraciones ni ampliar la vigencia de guardas. El launcher transaccional Pest no autoriza automáticamente un servidor HTTP persistente: necesita un control por solicitud/fase con atestación fresca y conexión efectiva comprobada.
4. **Fixtures sintéticos y contratos.** Revisar por spec los actores, dos instituciones sintéticas cuando corresponda, matrículas, cursos, tareas, notas y estados requeridos. Los helpers reales actuales dependen de credenciales/datos demo y Origin de 5173; no deben ejecutarse con cuentas de demostración. Preparar y revisar una inyección de credenciales/Origin/fixtures de pruebas que conserve las aserciones de negocio; no adaptar las aserciones para aceptar resultados incorrectos.
5. **Autenticación y efectos HTTP.** Definir sesiones y cookies privadas persistentes para el flujo real, CORS/Sanctum en 5174/8001, tokens y auditoría, sin reutilizar sesiones de demostración. Mantener correo/colas externos deshabilitados. Autorizar las escrituras concretas de cada escenario y revisar DELETE transitivos de tokens, relaciones o destinatarios antes de permitirlos.
6. **Archivos y limpieza.** Autorizar únicamente archivos sintéticos y directorios privados verificados, sin rutas externas ni datos personales reales. Diseñar preparación/limpieza comprobable: HTTP no proporciona rollback automático entre peticiones. Cualquier DELETE, DDL de reconstrucción o descarte del entorno necesita autorización específica y comprobación efectiva de destino; nunca se aplica a las bases existentes. Conservar snapshots lógicos y recuentos por caso/lote.
7. **Ejecución progresiva.** Tras aprobar los controles anteriores, empezar por humo autenticado y escenarios de lectura, continuar por módulos y registrar resultados/efectos/limpieza. Sin paralelismo de estado compartido, sin seeders demo ni suposición de privilegios por tener un puerto distinto.

Estas autorizaciones no se conceden implícitamente por haber aprobado las pruebas simuladas. No se crearon ahora la instancia, la base, las cuentas ni los fixtures propuestos.

## Revisión exclusivamente documental de los 38 casos Pest excluidos

La fuente sigue siendo `prompt37/blocked-review.json` y el cierre de Pest; sus IDs, archivos y restricciones se conservan. No se habilitó ni ejecutó ninguno en Prompt 38.

| Causa principal de exclusión | Casos | Preparación/autorización necesaria |
|---|---:|---|
| Llamadas de eliminación, forceDelete/deleteJson o exclusión por contrato de borrado | 16 | Revisar SQL y efectos por caso; una llamada HTTP DELETE rechazada no demuestra por sí sola DELETE SQL. Autorizar solo los efectos necesarios en una instancia completamente descartable. |
| Sincronización/borrados transitivos de roles, permisos, tokens y destinatarios | 7 | Auditar servicios y límites institucionales; autorización explícita de DELETE cuando exista, con comprobación del destino y limpieza. |
| Archivos, cargas, descargas, reemplazo y limpieza | 11 | Directorios y fixtures privados, MIME seguro, control de rutas/hardlinks/reparse points y autorización de limpieza. |
| Seeders demo | 2 | Permanecen prohibidos. Requieren decisión separada sobre su finalidad y eventual alternativa sintética; no se sustituyen silenciosamente para declarar aprobación del caso original. |
| Contrato histórico de conexión y ausencia de transacciones | 2 | Revisar el contrato esperado y una infraestructura compatible, sin debilitar guardas ni apuntar a la base protegida `zarate_test`. |
| **Total** | **38** | Ninguno ejecutado ni aprobado en este prompt. |

No se inventa una categoría independiente de conexiones externas cuando el inventario revisado no la demuestra. El entorno descartable sería una preparación posible, no una autorización automática de los 38 ni de todos sus efectos.

## Reproducción y revisión del fallo de salud

El error original, sin modificar, es `AssertionError: Timed out retrying after 4000ms: expected undefined to equal 200`, en `e2e/cypress/e2e/integration.cy.ts:9:50`. La captura conservada muestra el alias de la primera petición sin código y la pantalla conectada, junto con dos interceptaciones de salud. La hipótesis de sincronización se apoya en StrictMode y el AbortController del efecto, pero se recomienda una traza correlacionada de ambas peticiones para confirmarla antes de corregir.

Para revisarlo: preparar un **nuevo** directorio de resultados y cohortes con las mismas guardas HTTP sin SQL, verificar puertos/PID/nonce, ejecutar el spec original aislado con trazas de cancelación/respuesta y conservar la captura. Los launchers archivados rechazan sobrescribir resultados: no se deben reiniciar sobre sus directorios usados. La corrección candidata debe esperar una respuesta completada conservando las comprobaciones de estado/cuerpo y la pantalla; no eliminar StrictMode ni debilitar aserciones. No se implementó ni se reintentó esa corrección aquí.

## Entorno, auditoría y entrega

- Cypress real: 16.1.1; navegador Electron 146.0.7680.216. Node observado durante la preparación: 26.7.0. TypeScript E2E terminó sin errores; no se afirma un build de producción o ESLint nuevos en este prompt.
- Cuatro configuraciones protegidas conservan contenido y ACL. La primera comprobación complementaria produjo un falso positivo por enumerar el JSON como un solo arreglo anidado; se conserva `protected-config-final.json`. La comprobación individual correcta, `protected-config-final-corrected.json`, acredita cuatro archivos y cero cambios. No fue una alteración de configuración ni un fallo Cypress.
- El código de los dos lectores/adaptadores privados se corrigió durante preparación; los errores originales se conservaron. No hubo cambios de componentes, permisos, escalas, publicación, migraciones ni specs originales.
- Las claves de HTTP y Pest están excluidas de Git. Las capturas, perfiles de navegador, JSON y logs privados no deben incluirse automáticamente en una publicación.

**Siguiente paso de GitHub:** revisar los dos documentos públicos y el fallo reproducible, mantener declaradas las limitaciones y aprobar por separado la infraestructura/datos reales. No se recomienda presentar esto como E2E completo ni integrar una afirmación de suite totalmente aprobada mientras exista el caso fallido. Cualquier commit, push, merge o PR requiere una instrucción posterior; no se realizó ninguno.

### Auditoría final de resultados y publicación

`prompt38/audit-final.json` acredita 13 JUnit con 142 casos y un fallo, referencias JSON intactas, 168 documentos/salidas examinados sin coincidencias de credenciales o APP_KEY, prompt literal y claves privadas excluidas de Git. `artifact-seals.json` conserva los hashes de resultados, logs, captura y fuentes privadas al consolidar; este último anexo se registra separadamente en `public-append-audit.json`, preservando el prefijo sellado.

`git diff --check` terminó sin errores. Las comprobaciones no-index de los dos documentos nuevos no detectaron errores de espacios; Git emitió solo el aviso informativo de normalización CRLF del prompt literal. No se cambió su codificación/contenido para eliminar ese aviso. El código 1 de esas comparaciones con NUL indica archivos diferentes, no una prueba Cypress fallida.

Estado final: **B. CYPRESS — VALIDACIÓN PARCIAL**. Permanecen **un caso ejecutado fallido** y **46 casos bloqueados sin ejecutar**; no se declara completada la validación E2E. Pest conserva sus 276 aprobados / 1.724 aserciones y 38 excluidos, sin reejecución.
