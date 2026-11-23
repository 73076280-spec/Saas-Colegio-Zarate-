# Prompt 26 — Inspección Pest y conservación del MySQL de referencia

Fecha: **05/11/2026**, America/Lima. Rama comprobada: **test/integracion-misional**.

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.** Pest listó **314 casos en 13 archivos Feature**, pero **no se ejecutó ninguno**: no existe un destino de escritura autorizado distinto de la referencia y el adaptador conserva su bloqueo de ejecución. No hay pruebas en tests/Unit. La inspección SQL de lectura confirmó **14 migraciones y 52 tablas**, sin cambios respecto del cierre del Prompt 25 ni entre las lecturas de esta intervención.

No se creó una base, no se utilizó una cuenta administrativa, no se escribieron fixtures y no se ejecutaron migraciones, seeders, Pest de ejecución o Cypress. El listado de Pest **no es una suite aprobada**. No se declara validación integral de los cinco Bolts.

## 1. Estado inicial y preservación

Se continuó desde las evidencias 23–25 y el cierre 14/14. Git tenía pendientes los documentos de los Prompts 24/25; se conservaron. No se cambió de rama, descartaron archivos o realizaron commits/push.

Se revisaron backend/phpunit.xml, composer.json, tests/Pest.php, tests/TestCase.php, los 13 archivos Feature, traits Laravel, factories, seeders relacionados y las herramientas privadas de aislamiento. Las 14 migraciones conservan sus hashes. No se modificó código funcional, tests, factories, migraciones, credenciales o certificados.

La cuenta disponible es zarate_test@127.0.0.1. Sus grants efectivos son USAGE global y nueve privilegios exclusivamente sobre el esquema literal zarate_test; rol NONE, sin grant option ni privilegios globales de creación. Por ello **no autoriza crear ni usar zarate_pest**. La consulta de esquemas visibles devolvió zarate_test entre los dos nombres consultados; no se interpreta visibilidad restringida como prueba de inexistencia administrativa de zarate_pest.

## 2. Pruebas existentes y efectos

El listado siguiente proviene del XML generado por Pest/PHPUnit, con los casos de datasets incluidos. Cada clase se cuenta una sola vez; los aspectos de seguridad transversales no se suman como casos adicionales.

| Archivo Feature | Casos listados | Alcance identificado por código |
| --- | --- | --- |
| AvatarTest.php | 3 | Avatar privado, archivos y acceso entre usuarios/instituciones |
| HealthTest.php | 4 | Salud técnica, métodos, rutas inexistentes y acceso anónimo |
| MySqlConnectionTest.php | 2 | Identidad MySQL y denegación de consulta a desarrollo |
| Sprint1Test.php | 62 | Login/logout, credenciales, Sanctum, usuarios, roles, permisos y auditoría |
| Sprint2Test.php | 84 | Estructura y periodos académicos, validaciones y aislamiento |
| Sprint3Test.php | 79 | Personas, estudiantes/apoderados vinculados, referencias y aislamiento |
| Sprint4Test.php | 21 | Matrículas, estados, cupos, pagos, historial y separación de funciones |
| Sprint5Test.php | 12 | Asignaciones docentes, cursos y permisos |
| Sprint6Test.php | 12 | Unidades, materiales, publicación, archivos privados y matrículas aprobadas |
| Sprint7Test.php | 10 | Tareas/entregas, fechas/intentos, evaluaciones/notas, periodos e historial |
| Sprint8Test.php | 10 | Asistencia, duplicados, justificaciones, revisión y consultas personales/familiares |
| Sprint9Test.php | 10 | Solicitudes, documentos privados, comunicaciones, destinatarios y notificaciones |
| Sprint10Test.php | 5 | Reportes, exportaciones, dashboards y regresión transversal |
| **Total** | **314** | **Solo descubiertos; ninguno ejecutado** |

No existe una suite Unit con archivos de prueba. HealthTest es Feature: aunque sus rutas puedan responder sin DB, necesita arrancar Laravel. No se cambió su clasificación ni se presentaron como unitarias las comprobaciones locales del adaptador.

Once archivos —Sprint1–10 y Avatar— usan **DatabaseTransactions**: **308 casos** necesitan sus fixtures de escritura. No se encontraron usos de RefreshDatabase, DatabaseMigrations o DatabaseTruncation en los tests actuales. DatabaseTransactions inicia transacciones y revierte al destruir la aplicación; **rollback no significa que no haya habido escrituras** ni permite ignorar la obligación del Prompt 26 de proteger la referencia.

Los seis casos restantes son Health (cuatro) y MySQL (dos). No se ejecutaron: los primeros necesitan kernel y los segundos el adaptador de ejecución autorizado; el mecanismo actual permanece cerrado.

Las fixtures crean instituciones, usuarios, roles/permisos y entidades académicas mediante factories y seeders de permisos. Los tests usan datos sintéticos y Storage::fake en archivos; algunos también actualizan/eliminan registros o verifican rollback de auditoría. No se copiaron datos privados.

Dos casos históricos invocan expresamente seeders demo: Sprint2, «reproduces demo data without duplicates or overwriting edits» (AcademicDemoSeeder), y Sprint3, «reproduces fictitious people without duplicating accounts or relationships» (PeopleDemoSeeder). Estos están sujetos a la prohibición de seeders demo aun si se habilita un nuevo destino. No se ejecutaron ni se cambiaron para ocultar el conflicto.

## 3. Configuración y límites del ejecutor

backend/phpunit.xml fuerza testing, mysql, base/usuario zarate_test y DB_URL vacío, pero **no fija host/puerto ni TLS completo**. Depende del entorno para esos valores; por ello no se utilizó composer test ni un comando de ejecución con esa configuración. El script composer test además limpia configuración e invoca Artisan, acciones que no se ejecutaron aquí.

Las fixtures de los Sprints y Avatar afirman de forma literal que la conexión sea zarate_test; MySqlConnectionTest también espera ese nombre y usuario. Cambiar solo una variable para apuntar a zarate_pest no ofrece un entorno compatible. **No se falseó getDatabaseName ni se relajaron esas aserciones**. La separación futura exige revisar explícitamente el contrato de destino junto al launcher y la identidad SQL, sin convertir la comprobación en una tautología.

Las herramientas del Prompt 14 fijan paths privados, conexión, TLS y servicios aislados, pero conservan blockExecution, que lanza LIVE_IDENTITY_AND_WRITE_AUTHORIZATION_REQUIRED. TestCase14 y los hooks previos a proveedores no se habilitaron ni eliminaron. Los perfiles históricos no son una autorización vigente de ejecución o escritura.

## 4. Descubrimiento controlado e incidencias

Se intentó únicamente listar pruebas, nunca correr sus cuerpos:

1. `pest --configuration .../phpunit-discovery.xml --list-tests-xml .../discovered-tests.xml --no-coverage --do-not-cache-result`: **salida 2**, ISOLATION_BLOCKED_31 antes del listado. Adapter14::create dependía de global $root, pero PHPUnit incluye su bootstrap dentro de un método y esa variable no llega al ámbito global.
2. Se corrigió **solo la herramienta local**: `global $root` pasó a `$root=ROOT`, reutilizando la constante inmutable. No se cambió ninguna comparación de seguridad. El segundo listado, con temporales privados, **salida 2**, llegó a la siguiente guarda: Pest ya había cargado Tests\\TestCase y PestBootstrap14 exige registrar su clase protegida antes de esa carga. No se quitó esa condición para forzar una ejecución.
3. Para obtener inventario se creó una configuración **exclusiva de declaraciones**, sin arrancar Laravel. DiscoveryOnly26.php exige --list-tests-xml y rechaza autoload de kernels y conectores SQL; no autoriza setup, entorno ni conexión. El listado con phpunit-declarations-only.xml terminó **0** y produjo el XML de **314 casos**, con cero intentos de cargar las clases de ejecución bloqueadas.

Los tres intentos conservan stdout/stderr y sus códigos. Los dos errores de bootstrap **no son dos casos backend fallidos**: no se alcanzaron cuerpos de prueba ni aserciones. La configuración de declaraciones no es un ejecutor alternativo para saltar la guarda; sin la bandera de listado se rechaza.

AdapterRegression26.php reprodujo el include bajo ámbito de una función sin global root: configuración válida, cero conexiones SQL y bloqueo de ejecución todavía activo. Salida **0**. Es una comprobación local del adaptador, **no un test Pest de los Bolts**. No se identificó ni corrigió un defecto funcional del backend mediante pruebas, pues no se ejecutaron.

## 5. Inspección SQL real, solo lectura

Inspect26.ps1 arrancó únicamente el MySQL privado con controles de ACL, propietarios/enlaces, binario, opciones, PID/árbol y listener. Inspect26.php usó el adaptador de configuración, sin kernel, proveedores ni traits de pruebas.

La identidad real pasó los controles: **MySQL 8.4.11**, **127.0.0.1:3308**, **zarate_test / zarate_test@127.0.0.1**, datadir `.tools/misional-isolated/mysql-data`, UUID correspondiente, rol NONE y grants exclusivos del esquema. PDO/CONNECTION_ID estables, nombre Laravel mysql; **TLS_AES_256_GCM_SHA384 y verificación estricta de CA/certificado/IP**.

reference-schema-before.json coincidió con prompt25/migration14/final-schema.json: 14 migraciones y 52 tablas. reference-schema-after.json coincidió con el snapshot inicial. Se leyeron catálogo, historial, grants y visibilidad de los nombres de esquemas; no filas personales. **Cero DDL, DML, transacciones de prueba o migraciones.** La referencia no se reconstruyó ni se usó para factories, aun cuando la cuenta posee privilegios sobre ella.

Se mantuvo la vigencia de **120 segundos**; nueve pruebas vivas válidas, cero rechazadas, edad máxima al terminar **23 segundos**. La incorporación del contexto prompt26 al helper y la guarda compartida no cambió los criterios ni abrió una capacidad de escritura.

Preflight **05/11/2026, 13:18:56 -05:00**, 1.334 objetos comprobados; monitor **26856**, worker **25296**. Consola auxiliar, versión y validate-config: **0**. Cierre **13:20:11 -05:00**: **cliente 0, supervisor 0, MySQL 0**, monitor **3221225786 / 0xC000013A** por Ctrl+C del árbol propio. Shutdown completo, cero ERROR/FATAL y una advertencia; 1.362 objetos comprobados al cerrar. PID-file ausente, cero procesos MySQL y cero conexiones 3308 según el supervisor. No se detuvieron los servicios de demostración.

La base de desarrollo quedó fuera del alcance de conexiones/escrituras propias. No se restauraron archivos InnoDB ni se comparó una base viva con hashes históricos estáticos. Las cuatro configuraciones protegidas aprobaron hash/ACL. **56 inmutables y 781 resultados anteriores** conservaron su contenido por hash, y los tests no cambiaron.

## 6. Métricas reales y resultado por módulo

| Métrica | Resultado |
| --- | --- |
| Casos descubiertos por Pest | **314**, en 13 clases Feature |
| Casos ejecutados | **0** |
| Aprobados / fallidos | **0 / 0** |
| Bloqueados sin ejecutar | **314** |
| Skip/omisión emitidos durante una corrida | **0**; no hubo corrida de tests |
| Aserciones Pest realizadas | **0** |
| Unit disponibles | **0** |
| Duración de tests / cobertura de código | **No aplica / no medida** |
| Errores funcionales backend confirmados/corregidos | **0 / 0**, sin validación funcional ejecutada |
| Defecto local de adaptador | Uno corregido y comprobado; bloqueo de ejecución preservado |

| Módulo | Pruebas ejecutadas | Aprobadas | Fallidas | Resultado |
| --- | --- | --- | --- | --- |
| Autenticación y seguridad | 0 | 0 | 0 | BLOQUEADAS; fuentes identificadas, sin validación ejecutada |
| Matrículas | 0 | 0 | 0 | BLOQUEADAS |
| Enseñanza-aprendizaje | 0 | 0 | 0 | BLOQUEADAS |
| Evaluaciones | 0 | 0 | 0 | BLOQUEADAS |
| Asistencia | 0 | 0 | 0 | BLOQUEADAS |
| Comunicaciones | 0 | 0 | 0 | BLOQUEADAS |

El inventario es de la suite actual del repositorio. No se trasladaron métricas históricas del Sprint 10, ni las 37/71 comprobaciones de herramientas de fases previas se contaron como Pest backend. No hay regresión funcional aprobada ni preparación demostrada para Cypress. Cypress tampoco se ejecutó.

## 7. Procedimiento concreto pendiente de autorización

El Prompt 26 permite una base adicional solo con los permisos existentes y exige detenerse si hace falta nueva autorización. Como la cuenta actual solo tiene zarate_test y el ejecutor está bloqueado, **no se usaron las credenciales administrativas disponibles ni se ampliaron grants**.

La siguiente fase propuesta, que requiere autorización explícita, es:

1. Crear **solo si no existe**, y previa inspección, una base nueva **zarate_pest**, utf8mb4/utf8mb4_unicode_ci, dentro de la instancia aislada 3308. No borrar/recrear ninguna existente ni copiar datos de referencia/desarrollo.
2. Preparar una cuenta exclusiva con acceso únicamente a zarate_pest, TLS obligatorio y sin permisos sobre zarate_test/zarate_dev. Privilegios previstos: SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX y REFERENCES; sin DROP, grant option o privilegios globales. No modificar credenciales existentes. La creación de cuenta/credencial nueva y los grants no están autorizados por este cierre.
3. Migrar únicamente la base nueva vacía mediante las 14 fuentes originales y procedimiento controlado, sin fresh/wipe/rollback ni seeders demo. Mantener zarate_test como referencia de solo lectura del procedimiento.
4. Preparar el adaptador Pest antes del autoload de la clase TestCase, verificando configuración efectiva, identidad, TLS y ámbito de escritura nuevo antes de proveedores/traits. No quitar la guarda actual ni simular el nombre de base. Revisar las aserciones de destino hardcodeadas bajo el nuevo contrato explícito y probar rechazos de ambos destinos protegidos.
5. Ejecutar por grupos y después regresión, preservando resultados. Mantener sin ejecutar los casos que requieren seeders demo mientras siga su prohibición, y reportarlos sin ocultarlos ni alterar reglas de negocio.

Ese es el resultado revisable para autorizar; **no se preparó una base, cuenta o permiso nuevo durante este Prompt**. Tras resolverlo faltan los tests reales, correcciones justificadas si aparecen fallos, regresión y fase Cypress. El backend no puede declararse aprobado para entrega con un inventario de pruebas y una referencia intacta solamente.

## 8. Documentos, herramientas y Git

Documentos creados: prompt-26-pruebas-pest-integracion.md, copia íntegra del adjunto, y evidencias-pruebas-pest-integracion.md, este informe.

Herramientas locales ignoradas: evidence/prompt26 contiene configuraciones de descubrimiento, DiscoveryOnly26.php, AdapterRegression26.php, Checks26.php, Inspect26.php/.ps1, backups, inventario, logs, snapshots y resultados de preservación. Cambios compartidos: **Adapter14.php** (ruta local ROOT en create), **MigrationGuard14.php y CheckLive15.ps1** (contexto diagnóstico prompt26 con criterios existentes). PestBootstrap14.php, TestCase14.php y sus bloqueos permanecen intactos.

Evidencias principales: discovery-exit.json/stdout inicial; discovery-attempt2 y discovery-attempt3 (XML, salida y safety); discovery-summary.json; adapter-regression.json; permissions.json; reference-schema-before/after.json; sql-outcome.json; preflight/result/server.stop.json; process-proof-trace.jsonl; tests-before.json y final-summary.json. No se publican herramientas, certificados privados ni secretos.

Se preservaron los documentos de 21–25 y los cambios pendientes de Git. No hubo commit, push, merge o PR. Git al cierre muestra los cuatro documentos pendientes anteriores intactos y los dos documentos nuevos del Prompt 26; .tools no tiene archivos rastreados. El prompt coincide por SHA-256 con el adjunto. git diff --check terminó sin errores y la auditoría final examinó 120 archivos, incluidos los dos documentos, sin coincidencias de secretos fuera de sus recursos dedicados.

**D. BLOQUEADO POR SEGURIDAD O ENTORNO — 314 DESCUBIERTAS, CERO EJECUTADAS.**

## 9. Complemento autorizado: preparación de `zarate_pest` — 05/11/2026

Esta sección incorpora la autorización posterior guardada íntegramente en `prompt-26-autorizacion-entorno-pest.md`. No sustituye los resultados anteriores: el bloqueo descrito arriba corresponde a la etapa previa a esta autorización. Continúa prohibida la ejecución de los 314 casos Pest.

### Alcance y configuración efectiva

Se creó una base nueva **zarate_pest**, utf8mb4/utf8mb4_unicode_ci, únicamente en **127.0.0.1:3308**, sin copiar datos de desarrollo ni de la referencia. Se creó una cuenta exclusiva nueva, limitada por host a 127.0.0.1 y con **REQUIRE SSL**. Su contraseña fue generada por MySQL y conservada únicamente en un recurso privado local ignorado, con ACL restringida; no se incluye en este documento, argumentos de procesos ni logs.

Los únicos privilegios de esquema concedidos son **SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX y REFERENCES**. El patrón del esquema escapa el guion bajo para no conceder acceso por comodín a otras bases. No hay DROP, GRANT OPTION, roles activos, privilegios globales peligrosos ni grants sobre otros esquemas. Las huellas de autenticación y grants de las cuentas preexistentes se comprueban sin publicar sus valores sensibles.

Se prepararon adaptadores y guardas locales separados bajo `.tools/misional-isolated/evidence/pest26`, perfil APP_ENV=testing, DB_DATABASE=zarate_pest, almacenamiento `storage-pest26` y bootstrap/cache privados. Se conserva la referencia zarate_test. El resolver fijado rechaza otra conexión/base y verifica la identidad efectiva antes de autorizar operaciones. La capacidad SQL de migración admite únicamente el plan de cada fuente original, su repositorio y las instrucciones de sesión autorizadas; no habilita DML arbitrario.

Se mantienen la comprobación estricta CA/certificado/IP, PDO/CONNECTION_ID estables, UUID, datadir privado, PID/árbol/listener propios y gate de **120 segundos**, renovado entre migraciones, sin prorrogar una capacidad caducada. Se verificó **MySQL 8.4.11**, puerto **3308** y cifrado **TLS_AES_256_GCM_SHA384**. No se modificaron servicios de demostración de 3307/8000/5173, archivos funcionales, configuraciones de desarrollo ni las 14 fuentes originales.

### Guardas comprobadas, sin ejecutar la suite backend

| Grupo | Aprobadas | Fallidas en la validación final del grupo | Tipo |
| --- | ---: | ---: | --- |
| Identidad, configuración, certificado y vigencia | 19 | 0 | Comprobaciones locales offline |
| Alcance SQL: 14 planes originales y rechazos | 22 | 0 | Comprobaciones locales offline |
| Clasificación de helpers de autenticación | 4 | 0 | Comprobaciones locales offline |
| Acceso SQL a zarate_dev / zarate_test con la cuenta nueva | 2 | 0 | Denegaciones reales MySQL, sin escrituras |

Son **45 comprobaciones offline y 2 denegaciones SQL reales**, no casos Pest backend. Las repeticiones de estos grupos en preflight no se suman como pruebas diferentes. El control positivo de conexión real también aprobó identidad, TLS y ocho privilegios de esquema. Ambas bases protegidas fueron rechazadas por configuración y por MySQL: **código nativo 1044, SQLSTATE HY000**. No se intentó escribir en ellas. Los archivos `guard-tests.json`, `offline-tests/scope-tests.json`, `audit-helper-tests.json` y `live-negative.json` conservan los resultados detallados.

### Incidencias preservadas y correcciones de las herramientas

1. El primer preflight se detuvo antes de crear base/cuenta porque exigía cero plugins de tipo AUDIT. La inspección posterior identificó exclusivamente **mysqlx_cache_cleaner y sha2_cache_cleaner**, integrados (PLUGIN_LIBRARY nulo). Se sustituyó la condición por una lista cerrada de esos helpers; plugins desconocidos, externos o duplicados siguen rechazándose. No se deshabilitó ningún plugin. Su función de caché de autenticación está documentada por MySQL: [sha2_cache_cleaner](https://dev.mysql.com/doc/refman/8.4/en/caching-sha2-pluggable-authentication.html) y [mysqlx_cache_cleaner](https://dev.mysql.com/doc/refman/8.4/en/x-plugin-sha2-cache-plugin.html).
2. Tras crear correctamente la base/cuenta, una aserción de la prueba negativa esperaba SQLSTATE 42000. PDO devolvió HY000 con el código **1044**, denegación efectiva. Se preservó la salida fallida y se corrigió únicamente esa clasificación, manteniendo obligatorio el código 1044. No se recrearon la base ni la cuenta.
3. La primera reanudación creó el repositorio Laravel `migrations` vacío y se detuvo antes del primer `up`: la herramienta de alcance SQL heredaba una condición positiva para zarate_test. No se ejecutó DDL de las 14 fuentes ni se registró una migración en ese intento. Se corrigió el destino a zarate_pest y se añadió el rechazo explícito de la identidad de referencia; el grupo final es de 22 comprobaciones. La corrida posterior conserva y verifica el repositorio vacío, sin borrarlo/recrearlo.
4. Se ajustó antes del primer `up` la validación local del scaffold de users para exigir su eliminación solo desde la migración original que la realiza. Las fuentes originales permanecen intactas. También se conservaron los errores preparatorios de sintaxis de herramientas, anteriores a operaciones SQL.

Los intentos y versiones anteriores permanecen en `provision26/backup`, `diagnosis`, `audit-diagnosis`, `authorized-attempt2`, `resume-migrations` y `pest26/migration01`. No se ocultan estas detenciones ni se presentan como casos backend aprobados. La secuencia de migraciones efectiva y su verificación final se documentan a continuación.

### Migraciones y preservación: resultado real

La secuencia `provision26/RunSchemaOnly26.ps1`, con salidas independientes bajo `pest26/schema-run2/migration01` a `migration14`, aplicó **14/14 migraciones originales**, todas con `MIGRATION_EXECUTED_VERIFIED` y salida cliente **0**. No se ejecutó migrate:fresh, rollback, wipe, seeders, factories, Pest ni Cypress. Se verificaron **246 instrucciones DDL** de los planes originales, además de la creación previa del repositorio Laravel. Cada fuente se ejecutó una sola vez; las reanudaciones previas no habían ejecutado ningún `up`.

El catálogo final contiene **52 tablas, 502 columnas, 112 claves foráneas (114 componentes de columnas), 196 índices (275 componentes) y cero triggers visibles**. El repositorio registra las 14 fuentes esperadas en orden, con batches 1 a 14 porque se ejecutaron por separado. Los batches históricos de zarate_test se conservan; no se exige que coincidan con los nuevos.

`VerifyPreservation26.php` terminó con **PEST_SCHEMA_READY_AND_REFERENCE_PRESERVED**: tablas, columnas, opciones, índices, restricciones y reglas coinciden estructuralmente con la referencia, normalizando únicamente el nombre del esquema referenciado en las claves foráneas. Los nombres de las 14 migraciones coinciden. Se conservaron exactamente los metadatos y conteos de filas de **las 52 tablas de zarate_test**: 14 registros de migración y cero filas en las demás. Las cuentas y grants preexistentes conservaron sus huellas. No se copiaron datos; el procedimiento solo autorizó DDL original y los registros de migración en zarate_pest.

La protección de **zarate_dev** se acredita mediante ausencia de conexión/escritura propia a desarrollo, datadir y principal exclusivos, rechazo efectivo por servidor/guardas y hash/ACL de las cuatro configuraciones protegidas. No se afirma una comparación SQL de sus datos ni una igualdad de hashes de archivos InnoDB volátiles de una instancia independiente. No se detuvieron ni modificaron los servicios de demostración.

Evidencias locales principales, fuera de GitHub:

- `provision26/authorized-attempt2/provision-outcome.json`, `reference-before/after.json`, `reference-counts-before/after.json`, `final-preservation.json`.
- `provision26/schema-run2/migration-results.json`, preflight, resultado del supervisor y logs de cierre.
- `pest26/schema-run2/migration01..14`: gates, esquemas inicial/final, ledgers SQL, validación semántica y outcomes.
- Guardas y pruebas negativas indicadas arriba; perfiles y adaptadores locales separados, sin secretos documentales.

### Preparación para Pest y limitaciones vigentes

**ENTORNO SQL PREPARADO; SUITE PEST NO HABILITADA NI EJECUTADA.** Base, cuenta, permisos, TLS, guardas y esquema están comprobados. Se mantienen **314 casos descubiertos, 0 ejecutados, 0 aprobados y 0 fallidos de backend**; los 314 quedan sin ejecutar por la instrucción expresa del usuario. Las detenciones históricas de herramientas no se borran ni se convierten en supuestos fallos funcionales de esos casos.

El XML privado `phpunit-pest26.xml` conserva un bootstrap bloqueado explícitamente con `PEST_314_EXECUTION_NOT_AUTHORIZED_IN_PREPARATION`. La configuración preparada no constituye un ejecutor funcional habilitado: siguen pendientes la activación segura del kernel/alias TestCase descrita en la etapa original y la adaptación revisable del contrato de fixtures que todavía exige zarate_test. No se simula ese nombre ni se permite dirigir la suite a la referencia. Los dos casos históricos que invocan seeders demo requieren resolver su incompatibilidad con la prohibición vigente antes de ejecutarlos.

No se concedió DROP para facilitar reconstrucciones. Cualquier limpieza futura debe comprobar de nuevo el destino efectivo zarate_pest y utilizar solo operaciones autorizadas en esa base; los permisos actuales no habilitan fresh/wipe. No se ha ejecutado ni validado todavía el ciclo transaccional o de limpieza de los tests. La posterior ejecución requiere una fase explícita de habilitación del launcher, rechazo de ambos destinos protegidos antes de proveedores/traits y autorización de los casos correspondientes. **No se declara aprobada la validación integral del backend.**

Documentos de esta autorización: `prompt-26-autorizacion-entorno-pest.md` (nuevo, autorización íntegra) y este complemento de `evidencias-pruebas-pest-integracion.md`. Se conserva el texto de las evidencias anteriores y los cambios pendientes ajenos. No hay commits, push, merge ni Pull Requests.

### Cierre de la preparación

La corrida efectiva comenzó con preflight el **05/11/2026 a las 14:10:22 -05:00** y cerró a las **14:27:54 -05:00**. Monitor propio 23136, worker MySQL 1412: cliente final **0**, supervisor **0**, servidor **0**, shutdown completo; monitor **3221225786 / 0xC000013A** por señal de cierre del árbol propio. Quedaron cero procesos MySQL, cero conexiones en 3308 y PID-file ausente. No se ha dejado el servidor aislado ejecutándose: la próxima fase deberá arrancarlo y renovar su gate antes de conectar.

El log tiene **0 ERROR/FATAL y 1 advertencia**, relativa a la CA privada autofirmada. Esto no equivale a desactivar la verificación: la conexión utilizó esa CA explícitamente confiada, validó certificado/IP y mantuvo TLS estricto. El cierre verificó ACL de **1.871 objetos**, las cuatro configuraciones protegidas y el log de inicialización sin cambios. La comprobación final de **86 archivos fijados por hash**, incluidas las **14 migraciones originales**, encontró **0 discrepancias**.

La auditoría de secretos de `provision26`, `pest26` y los documentos de VALIDACION-INTEGRAL encontró **0 coincidencias fuera de los recursos privados dedicados**, incluyendo representaciones escapadas/codificadas de las credenciales. El texto histórico anterior a la autorización se conserva. `git diff --check` terminó sin errores; `.tools` no contiene archivos rastreados por Git. No se modifica ni se limpia ningún cambio pendiente anterior.

**Resultado de esta autorización: PREPARACIÓN SQL COMPLETADA, sin ejecución de pruebas funcionales.** Quedan pendientes exclusivamente de una fase posterior el launcher/contrato de fixtures seguro y la ejecución autorizada de Pest, con sus correspondientes resultados reales.
