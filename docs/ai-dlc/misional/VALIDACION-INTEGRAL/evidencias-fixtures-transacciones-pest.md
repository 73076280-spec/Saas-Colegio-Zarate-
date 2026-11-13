# Prompt 28 — Fixtures y transacciones Pest

Fecha: 05/11/2026, America/Lima. Rama comprobada: `test/integracion-misional`. Continuación de los Prompts 26/27; sin reinicializar MySQL ni el esquema.

## Estado inicial y autorización

Se parte de zarate_pest en 127.0.0.1:3308, cuenta exclusiva con SSL obligatorio y ocho privilegios limitados al esquema, sin DROP. Hay 14 migraciones y 52 tablas. El Prompt 27 aprobó cuatro HealthTest con seis aserciones; quedan 310 casos distintos sin ejecutar. No se autoriza aquí la regresión integral, seeders demo, DDL, cambios de credenciales o servicios de desarrollo.

Se leyeron las evidencias completas de 26/27, tests/Pest.php, phpunit.xml, launcher y guardas privados, traits del framework instalado, factories, seeders y servicios involucrados. `backend/AGENTS.md` conserva el destino histórico zarate_test; la autorización explícita del usuario para este procedimiento prevalece sin cambiar ese archivo. Se conservan las evidencias anteriores y los cambios pendientes de Git.

## Casos elegidos y contrato de fixtures

| N.º | Fuente original | Caso seleccionado | Datos necesarios |
| --- | --- | --- | --- |
| 1 | backend/tests/Feature/Sprint1Test.php | logs in with institution and audits without exposing secrets | Institución, usuario administrador, roles/permisos, auditoría |
| 2 | backend/tests/Feature/Sprint1Test.php | requires password change before business routes | Misma preparación; cambio del indicador del usuario y autorización |
| 3 | backend/tests/Feature/Sprint4Test.php | creates unique codes rejects duplicate and protected fields and filters results | Institución, administrador, estudiante, catálogo académico, matrícula y auditoría |
| 4 | backend/tests/Feature/Sprint3Test.php | associates family members and audits flags | Institución, administrador, estudiante, apoderado, relación familiar y auditoría |

No se inventan casos funcionales ni se reducen sus fixtures. Se usan las factories, servicios, beforeEach/afterEach, seeders de permisos y DatabaseTransactions originales. RolePermissionSeeder y los seeders de permisos de módulos crean datos sintéticos de RBAC dentro de la transacción; no son seeders demo. No se modifica ninguna factory global.

Para conservar intactos los tests del repositorio se prepararon tres copias privadas de sus archivos en `prompt28/tests/Feature`. Inicialmente se cambió **una expresión técnica**: la expectativa literal del nombre de base en beforeEach, de zarate_test a zarate_pest. Tras la incidencia de origen descrita abajo, el contrato final tiene **exactamente dos cambios de literales por archivo**: ese destino y el Origin del beforeEach, de localhost:5173 al frontend aislado 127.0.0.1:5174. Los cuerpos y aserciones funcionales no se cambian. El nombre real devuelto por la conexión no se simula; además se verifican DATABASE(), CURRENT_USER(), puerto, datadir, UUID, TLS y PDO. No se sustituye la expectativa por el valor de configuración que se está comprobando. `cases.json` registra hashes original/copia, número de cambios y los cuatro nombres originales presentes en el inventario de 314 casos. `fixture-contract-verification.json` comprobó las tres copias byte por byte contra esas dos sustituciones y ningún otro cambio.

La selección mediante descubrimiento, sin setup ni SQL, confirmó exactamente un caso por filtro. El primer intento de descubrimiento se lanzó desde el directorio raíz y no encontró la ruta relativa al backend; se corrigió únicamente el cwd. No fue una ejecución funcional fallida.

## Launcher y autorización SQL

Todo el código nuevo está en `.tools/misional-isolated/evidence/prompt28`, ignorado por Git. Se crearon Adapter28, Guard28, Pdo28/Statement28/Connection28, Runtime28, TestCase28, Launch28, Bootstrap28, XML, perfil, pruebas auxiliares, inspector y supervisor. Almacenamiento/cache quedan separados en storage-pest28/bootstrap-pest28. No se reemplazan .env, phpunit.xml, tests/Pest.php ni los launchers anteriores.

Launch28 precarga el TestCase privado antes del autoload de Pest, exige el XML privado, directorio de tests privado, archivo/filtro de la lista explícita y hashes original/copia. Rechaza las opciones de paralelismo/reintento previstas y bloquea autoload de clases DemoSeeder. TestCase28 acepta únicamente los cuatro nombres/clases autorizados, exige DatabaseTransactions y rechaza RefreshDatabase, DatabaseMigrations y DatabaseTruncation antes de los traits.

El perfil conserva mysql, testing, 127.0.0.1:3308, zarate_pest y su cuenta exclusiva. Se fija el gestor DB y el PDO antes de proveedores/traits; se restablece el gestor después de registrar proveedores y se comprueba antes de arrancarlos y después del kernel. Las respuestas HTTP y reglas funcionales son las originales, sin API simulada.

La validación de conexión conserva UUID, versión, usuario, datadir, puerto, grants exactos, mismo PDO/CONNECTION_ID, TLS estricto CA/certificado/IP y gate de **120 segundos**, sin ampliarlo. Cada ejecución tiene un gate fresco. No se permite reconexión transparente. Las otras conexiones no están configuradas; un nombre distinto de mysql es rechazado por el resolver y las mutaciones de configuración fallan al verificar identidad efectiva.

Pdo28 protege también prepare/execute, query, exec y las transacciones; no depende solo de beforeExecuting. Statement28 vuelve a comprobar la política y la identidad al ejecutar una sentencia preparada. El PDO se crea con sentencias múltiples deshabilitadas y atributos de seguridad sellados.

- INSERT/UPDATE/DELETE solo sobre tablas conocidas de aplicación, dentro de la única transacción raíz temporal habilitada expresamente.
- Prohibidos DDL, TRUNCATE, USE, COMMIT exterior, autocommit, tablas desconocidas, escritura del repositorio migrations, otros esquemas, SQL múltiple, comentarios y operaciones de archivos/bloqueos no autorizadas.
- Las transacciones anidadas de Laravel usan savepoints transN; sus commits internos no confirman la transacción física exterior.
- El COMMIT exterior por PDO siempre lanza OUTER_COMMIT_FORBIDDEN. El rollback de cierre se ejecuta únicamente en el PDO original; si la atestación falla, se revierte ese PDO y se propaga el error, sin reconectar ni transformar limpieza en commit.
- Connection28 comprueba ausencia de transacción y conteos de las 52 tablas antes de desconectar; el supervisor vuelve a inspeccionar desde otro proceso antes y después de cada caso. No se limpia con DELETE/TRUNCATE para esconder residuos.

## Verificador de proceso persistente

Un PowerShell nuevo por consulta resultaría costoso durante la preparación de permisos. Se preparó `LiveProof28.exe` desde código C# local, sin instalar dependencias: mantiene el proceso de comprobación abierto, pero **repite las verificaciones en cada solicitud**, sin aceptar una identidad cacheada como autorización.

Comprueba mediante WMI los dos procesos MySQL, padre/hijo, imagen, argumentos y tiempos de creación; consulta la tabla TCP nativa para exigir el único listener 127.0.0.1:3308 del worker; comprueba PID-file, SHA-256 del ejecutable, configuración y CA, y edad del gate al inicio/final. PHP conserva la igualdad del proceso probado y vuelve a verificar identidad SQL, TLS y grants en el mismo PDO por operación. No se elevó el TTL ni se usa una prueba histórica para autorizar escrituras.

`NativeParity28.php` contrastó en vivo su resultado con el verificador PowerShell conservado: **NATIVE_AND_POWERSHELL_PROOFS_MATCH**. Los errores del helper son denegaciones, no reconexiones ni autorizaciones implícitas.

## Prueba auxiliar de DML y rollback

`Probe28.php` usa el kernel real, InstitutionFactory y UserFactory existentes; crea únicamente una institución y usuario sintéticos. Inicia la transacción, inserta/consulta, actualiza, ejecuta una actualización anidada con savepoint y verifica que la transacción exterior sigue abierta. Una inserción con institución inexistente obtiene **FK 1452**. El intento controlado de commit exterior es rechazado. Después hace rollback y comprueba la desaparición de usuario/institución, transacción cerrada y los conteos completos.

Resultado del primer intento: **DML_AND_NESTED_TRANSACTION_ROLLBACK_VERIFIED**. Resultado después de ajustar la lectura ORM: el mismo estado aprobado, con salida **0** y esquema/conteos conservados. Son comprobaciones auxiliares, **cero casos Pest** en cada probe. Sus contadores incluyen intentos SQL, por lo que la inserción inválida se registra como intento y no como una fila persistente.

La primera prueba registró 3 intentos INSERT (uno rechazado por FK), 2 UPDATE, 4 SELECT de aplicación, un savepoint, un BEGIN, un ROLLBACK y un COMMIT rechazado; las consultas diagnósticas están separadas. No hubo residuos ni DDL.

## Incidencia preservada: metadatos de Eloquent

En `run`, el primer caso real seleccionado produjo JUnit con **1 error, 0 fallos de aserción y 0 aserciones**, salida Pest **2**. El error ocurrió en beforeEach, al preparar permisos: la política rechazó `MySqlGrammar::compileColumns(null, 'permissions')`, lectura de information_schema.columns que Eloquent utiliza para atributos asignables. No se confirmó un defecto de negocio.

La ejecución se detuvo y no se intentaron los otros casos. DatabaseTransactions revirtió: un BEGIN, dos operaciones de savepoint, un ROLLBACK y ningún commit. El cierre y una inspección independiente confirmaron las 52 tablas y cero filas de aplicación. El servidor cerró correctamente a las 15:14:59 -05:00, servidor 0, sin proceso/listener; había cuatro conexiones residuales de cierre, no listeners. Se preservan JUnit, fuente, política original, logs, manifiesto y snapshots.

Tras revisar el código instalado `backend/vendor/laravel/framework/src/Illuminate/Database/Schema/Grammars/MySqlGrammar.php:144`, se admite **solo la cadena exacta** generada por compileColumns con esquema implícito schema() y una tabla del catálogo de 52 tablas. No se acepta otro esquema, tabla desconocida ni sufijos. La política inicial aprobó 33 comprobaciones; la corregida aprobó **37/37**, incluidas esas cuatro variantes. Las escrituras, bases protegidas y metadatos arbitrarios siguen bloqueados; no se cambian grants.

La reanudación `run2` es una corrida revisada tras comprobar rollback y ausencia de residuos, con salidas nuevas y sin bucles de reintento. Los probes se repiten como regresión de la política ajustada, no para duplicar escrituras persistentes. También se conserva un error de generación/parsing del supervisor anterior al arranque SQL, corregido antes de ejecutarlo.

### Segundo bloqueo y verificación de inmutabilidad

En run2, la preparación del mismo primer caso volvió a terminar con **1 error JUnit, 0 aserciones y salida 2**, esta vez por caducidad del gate de 120 segundos. La política permitió los metadatos correctos y se registraron 193 SELECT, 128 intentos INSERT y 105 operaciones de savepoint antes de detenerse. Las lecturas diagnósticas no se suman a esos contadores. Los demás casos no se ejecutaron.

El intento no tuvo COMMIT. Su contador registra **0 rollbacks raíz explícitos**: la caducidad también impidió el rollback anidado por SQL; el cierre del PDO revirtió la transacción física. La comprobación externa post-case1 y final confirmó cero filas persistentes y esquema intacto. No se presenta ese cierre implícito como una prueba aprobada del rollback explícito del trait. La prueba auxiliar sí había comprobado el rollback explícito; ambos hechos se distinguen.

Run2 cerró a las **15:20:24 -05:00**, servidor 0, shutdown completo, cero procesos/conexiones MySQL, cuatro configuraciones protegidas intactas. Se preservaron fuentes, política, resultado del probe, JUnit, contadores y snapshots. No se repitió el caso automáticamente ni se amplió el TTL.

La medición offline identificó el coste de repetir SHA-256 del ejecutable de 51.604.608 bytes por consulta; cambiar la implementación criptográfica no bastaba. Se preparó `LiveProof28Locked-v2.exe`: calcula y verifica el SHA-256 al abrir cada archivo, conserva **el mismo handle abierto con FileShare.Read**, que impide nuevas aperturas de escritura y renombrado, y por solicitud verifica que los handles siguen válidos y que el path apunta al mismo identificador de archivo/volumen, con un único hardlink. No se presume inmutabilidad por fecha/tamaño ni se acepta una huella histórica sin protección de escritura efectiva. Al terminar cada proceso PHP se cierra el helper y se liberan los handles.

En cada solicitud se mantienen WMI, procesos/argumentos/creación/padre, listener/PID-file, identidad del archivo bloqueado, hashes esperados, edad del gate al principio/final y todas las comprobaciones SQL/TLS por operación. Es una verificación de bytes inicialmente comprobados **y mantenidos inmutables por el sistema operativo**, sin recalcularlos mientras la escritura está impedida. Un cambio de hash esperado o de identidad del archivo sigue rechazado.

La prueba offline sobre un archivo sintético privado aprobó **4/4**: hash/identidad correctos, escritura rechazada, renombrado rechazado y hash esperado incorrecto rechazado. Se conserva también un error de compilación previo a esa prueba, por inicialización de una variable C#, corregido sin conexión SQL. La reanudación revisada run3 repite la paridad con PowerShell, denegaciones, probe y verificaciones del catálogo antes de permitir nuevos casos.

### Tercer intento: contrato del origen HTTP

Run3 completó los fixtures del primer caso dentro del plazo, ejecutó **2 aserciones JUnit en 49,575076 s** y produjo **1 fallo, 0 errores**, por recibir HTTP 419 en vez de 200. No se oculta el fallo: se conserva JUnit y se detuvieron los demás casos.

La revisión identificó una incompatibilidad del fixture, no un defecto académico confirmado: el beforeEach enviaba Origin localhost:5173, mientras que el perfil aislado fija Sanctum/frontend exclusivamente en 127.0.0.1:5174. Sanctum no inició sesión para ese origen y `backend/app/Services/AuthService.php:22` rechazó el login porque request->hasSession() era falso. No se modificó esa validación ni se excluyó CSRF/middleware para obtener éxito.

El contrato final adapta únicamente ese Origin en las copias privadas. Se conserva el origen autorizado aislado, la configuración de desarrollo y el comportamiento normal de Sanctum. Run3 registró un BEGIN y **un ROLLBACK explícito**, sin COMMIT; el callback de cierre y el inspector independiente confirmaron cero residuos en las 52 tablas. Cerró a las 15:26:59 -05:00, servidor 0 y sin procesos/listener MySQL; cuatro conexiones residuales de cierre. Run4 conserva fuentes, contratos y resultados anteriores en directorios separados y revalida seguridad/probe antes de ejecutar casos.

## Riesgos revisados y límites

Los 308 casos transaccionales usan DatabaseTransactions; los traits reconstructivos no se utilizan actualmente, pero se revisó que RefreshDatabase y DatabaseMigrations pueden invocar migrate:fresh y, el segundo, migrate:rollback. Permanecen excluidos, sin desactivarlos para forzar resultados. Los dos casos de conexión siguen con contrato histórico y fuera de esta selección.

Se revisaron factories y los servicios de autenticación, matrícula, familia y auditoría usados: las transacciones anidadas conservan el PDO predeterminado, y la auditoría se escribe en tablas transaccionales. El inspector exige InnoDB en las 52 tablas y cero triggers visibles. No se configuró ni ejecutó una conexión de escritura secundaria, Redis, mail externo, worker o job remoto; el perfil mantiene cache en memoria, cola null y correo array. Esto no demuestra reversibilidad de todos los servicios del proyecto.

AvatarService contiene afterCommit para eliminar un archivo anterior; los casos de avatar quedan fuera de esta fase. No se puede afirmar que rollback SQL revierta efectos en archivos, servicios externos o todos los callbacks posibles. No se introducen mocks para ocultar esos efectos. La comprobación de fila/esquema tampoco implica que contadores autoincrementales o archivos InnoDB físicos no hayan avanzado; no se restauran.

La tabla histórica del Prompt 27 asignaba Sprint8/9/10 de forma imprecisa. La lectura de los archivos y el inventario del Prompt 26 sitúan **evaluaciones en Sprint7, asistencia en Sprint8, oficina/comunicaciones en Sprint9 y reportes/regresión en Sprint10**. Se registra la precisión aquí sin reescribir la evidencia anterior. La selección de este Prompt se apoya en rutas y casos concretos.

## Dos casos de seeders demo: preparados para revisión, no ejecutados

- Sprint2Test: reproduces demo data without duplicates or overwriting edits. AcademicDemoSeeder necesita una institución sintética con el código esperado y genera catálogo 2026, periodos, niveles/grados, secciones y asignaturas. El caso invoca dos veces el seeder y comprueba idempotencia y preservación de una descripción editada.
- Sprint3Test: reproduces fictitious people without duplicating accounts or relationships. PeopleDemoSeeder necesita la institución sintética y roles; genera cuentas/personas y relaciones familiares con identificadores demo fijos. El caso lo invoca dos veces y compara conteos.

Ninguno necesita copiar datos de desarrollo. Factories pueden preparar la institución/roles o datos sintéticos iniciales, pero sustituir las llamadas al seeder por factories **eliminaría el comportamiento de idempotencia que los casos prueban**. Para ejecutar esos casos sin cambiar su intención hace falta autorización específica para los seeders demo exclusivamente sobre zarate_pest, más validación de rollback/savepoints y sus efectos. Otra opción es proponer por separado un diseño parametrizado de fixtures de demostración con pruebas propias; no se implementa ni se modifican reglas funcionales aquí. Ambos casos siguen bloqueados.

## Resultados finales

La corrida final es **run4**, con cuatro procesos PHP/Pest secuenciales, sin API simulada. Se ejecutaron los cuatro casos originales seleccionados mediante las copias privadas cuyo contrato fue verificado. Los resultados vienen de `run4/case1.xml` a `case4.xml`; `test-summary28.json` los relaciona con identidad de proceso, efectos y comprobaciones de limpieza.

| Caso | Resultado final | Aserciones JUnit | Duración JUnit |
| --- | --- | ---: | ---: |
| Login institucional y auditoría sin secretos | APROBADO | 8 | 49,936138 s |
| Cambio obligatorio de contraseña antes de rutas de negocio | APROBADO | 3 | 46,837546 s |
| Creación de matrícula, duplicados, campos protegidos y filtros | APROBADO | 16 | 54,558102 s |
| Asociación estudiante/apoderado y auditoría de atributos | APROBADO | 10 | 52,345501 s |
| **Corrida final** | **4 aprobados, 0 fallos, 0 errores, 0 omitidos** | **37** | **203,677287 s** |

La duración es la suma JUnit de los casos, no el tiempo de preparación, probes o arranque/cierre. Cada caso confirmó identidad real de zarate_pest/TLS, mantuvo **un BEGIN y un ROLLBACK explícitos**, sin COMMIT exterior y sin residuos. El callback de cierre verificó las 52 tablas antes de desconectar; una inspección independiente confirmó el mismo catálogo/conteos después de cada caso y al finalizar.

| Caso | SELECT | Intentos INSERT | UPDATE | DELETE | Operaciones de savepoint | BEGIN / ROLLBACK raíz |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | 266 | 160 | 1 | 0 | 123 | 1 / 1 |
| 2 | 257 | 159 | 1 | 0 | 122 | 1 / 1 |
| 3 | 330 | 170 | 1 | 0 | 125 | 1 / 1 |
| 4 | 304 | 167 | 0 | 0 | 123 | 1 / 1 |

Son contadores de aplicación previos a ejecutar SQL, no una garantía de éxito de cada sentencia; las consultas diagnósticas se excluyen. Los savepoints incluyen el uso interno de Eloquent firstOrCreate y los servicios originales. No se eliminaron ni sustituyeron esos comportamientos. La auditoría y los roles/permisos formaron parte de la transacción, y sus tablas volvieron a quedar vacías. DELETE está contemplado por la política y pruebas offline, pero **no se ejecutó un DELETE real en los cuatro casos/probe**; esa operación y sus efectos específicos siguen pendientes de validación funcional.

### Métricas y conservación de incidentes

- **4 casos nuevos distintos ejecutados** en esta intervención, todos aprobados en la corrida final.
- **7 ejecuciones de casos Pest en total** en esta intervención: tres intentos previos del mismo primer caso y cuatro ejecuciones finales. No son siete casos distintos.
- Historial preservado: **2 errores de infraestructura/preparación** (lectura ORM y caducidad), **1 fallo de aserción** (419 por origen incompatible), con **2 aserciones JUnit** registradas entre esos intentos. No se los borra ni se presenta todo el historial como libre de fallos.
- **8 pruebas distintas aprobadas acumuladas**: cuatro HealthTest del Prompt 27 más estas cuatro.
- **43 aserciones en corridas aprobadas acumuladas**: 6 anteriores + 37 nuevas. Incluyendo las 2 del intento 419, hay **39 aserciones en esta intervención y 45 acumuladas en todos los intentos**. No se cuentan comprobaciones auxiliares como aserciones Pest.
- **306 de los 314 casos originales siguen sin ejecutar**, incluidos los dos casos con seeders demo y los dos casos de conexión con contrato histórico. El resto del inventario no queda aprobado por estas muestras.
- Hubo **cuatro probes auxiliares**, uno por corrida revisada, aprobados y con cero residuos; ninguno es un caso Pest.

### Seguridad y esquema final

| Verificación | Resultado real | Evidencia local prompt28 |
| --- | --- | --- |
| Identidad/configuración/TLS/vigencia offline | 19 aprobadas, 0 fallidas | guard-tests.json |
| Política SQL final | 37 aprobadas, 0 fallidas | policy-tests.json; versión inicial 33 en run |
| Inmutabilidad efectiva de archivos | 4 aprobadas, 0 fallidas | immutable-lock-tests-v2.json |
| Contrato de tres copias privadas | 3 verificaciones aprobadas; solo dos sustituciones por archivo | fixture-contract-verification.json |
| Selección individual | 4 descubrimientos de un caso, sin setup/SQL | discovery-1..4.xml |
| Paridad de verificadores vivos | APROBADA en el servidor final | native-parity.json |
| Acceso a zarate_dev y zarate_test | 2 denegaciones MySQL reales 1044/HY000, más rechazo de configuración | live-negative.json |
| DML, FK, commit rechazado y rollback auxiliar | APROBADO | run4/probe-result.json y effects/clean del probe |
| Identidad desde los procesos de prueba | 4 casos y un probe, mismo PDO verificado, TLS estricto | run4/runtime-identities.jsonl |
| Cierre transaccional por caso | 4 rollbacks explícitos y cero filas residuales | run4/clean-*-after-rollback.json; effects-*.json |
| Catálogo y filas por caso | Coincidencia antes/después y con el cierre del Prompt 26 | run4/schema/counts-pre-caseN/post-caseN.json |

Los tres grupos de seguridad offline suman **60 comprobaciones**, separados de los siete controles de contrato/selección, de las denegaciones reales y de los casos Pest. Las repeticiones por corrida no se acumulan como pruebas diferentes.

El catálogo final mantiene **52 tablas InnoDB, 502 columnas, 112 claves foráneas y 14 migraciones**, sin triggers visibles ni cambios estructurales. Los 14 registros de migrations coinciden exactamente con el estado inicial; las otras 51 tablas tienen cero filas antes y después. No hubo reconstrucciones, migraciones ni limpieza destructiva. Los contadores autoincrementales pueden haber avanzado; no se afirma igualdad física de InnoDB.

La cuenta sigue limitada al esquema de pruebas, con ocho privilegios y sin DROP. No se cambiaron cuentas, contraseñas o grants, ni se abrió una sesión administrativa. Las conexiones negativas a bases protegidas se rechazaron antes de acceder a datos; no se intentaron escrituras en ellas. No se declara una nueva auditoría SQL de filas de zarate_dev/zarate_test: su protección se basa aquí en el destino/grants efectivos, rechazo real y ausencia de operaciones propias sobre esos esquemas, conservando la referencia auditada en el Prompt 26.

El servidor final emitió **2.447 comprobantes nativos válidos**, con tres archivos bloqueados, **edad máxima registrada de 55 segundos** y cero comprobantes inválidos en su traza. No se prorrogó el TTL de 120 segundos. La traza corresponde al servidor final PID 19768; los intentos anteriores conservan sus resultados aparte.

### Cierre y archivos

Preflight final: **05/11/2026, 15:29:58 -05:00**. Monitor propio **23088**, worker **19768**. Cierre **15:34:41 -05:00**: cuatro clientes Pest **0**, inspección final **0**, supervisor **0**, servidor **0**, shutdown completo. Monitor **3221225786 / 0xC000013A** por señal de cierre del árbol propio. PID-file ausente, cero procesos MySQL y sin listener 3308; se observaron dos conexiones residuales de cierre, no listeners.

El log registra **0 ERROR/FATAL y 1 advertencia** por la CA privada autofirmada; se mantuvo validación estricta con esa CA confiada. Se comprobaron ACL de **2.500 objetos**, las cuatro configuraciones protegidas y el log de inicialización sin cambios. No se detuvieron/modificaron los servicios de 3307/8000/5173. Los próximos casos requieren arrancar de nuevo el servidor aislado y emitir gates frescos.

Documentos nuevos: `prompt-28-fixtures-transacciones-pest.md`, copia íntegra del adjunto, y este archivo. Herramientas privadas nuevas: directorio evidence/prompt28 y generador evidence/Build28.php. Incluyen código fuente/binarios locales del verificador, perfiles/XML, mirrors, pruebas offline, probes, inspectores, supervisores y salidas separadas run/run2/run3/run4. No se publican secretos ni recursos privados. No se instalaron dependencias.

Los archivos funcionales, factories/seeders, tests originales, phpunit.xml, .env y migraciones se conservan. Continúan los pendientes documentales anteriores de Git, incluido evidencias-finalizacion-migraciones.md; no se limpian ni reescriben. No se ejecutaron Composer/Pint, Cypress, migraciones, demo seeders, commit, push, merge o PR. El resumen de hashes/secretos/formato se añade tras las comprobaciones finales.

Comprobación final (`final-preservation28.json`): **128 archivos fijados del Prompt 27 y 163 del manifiesto actual, cero discrepancias**, incluidas las 14 fuentes de migraciones y los tests originales. Git no muestra cambios rastreados en backend, frontend o e2e. El prompt nuevo coincide por SHA-256 con el adjunto. La auditoría final revisó **1.037 archivos, incluidos 55 documentos**, con **cero coincidencias de secretos fuera de recursos privados dedicados**. `git diff --check` terminó sin errores y `.tools` continúa sin archivos rastreados. Los únicos documentos nuevos de esta intervención son los dos del Prompt 28; los nueve pendientes anteriores de Git se conservaron.

## Informe final

| Componente | Resultado | Evidencia |
| --- | --- | --- |
| Launcher ampliado | HABILITADO exclusivamente para los cuatro casos enumerados | Launch28/TestCase28/cases.json; JUnit run4 |
| DML permitido y verificado | INSERT/SELECT/UPDATE reales; DELETE solo política offline | Probe y contadores de casos |
| Transacciones | Una raíz por caso; savepoints originales conservados | effects-*.json y código original del trait |
| Rollback | 4 explícitos aprobados, verificación por conexión y externa | clean y snapshots post-caseN |
| Fixtures | Factories originales y permisos sintéticos, contrato privado comprobado | fixture-contract-verification.json |
| Pruebas Pest adicionales | 4 distintas; 7 ejecuciones incluyendo intentos anteriores | test-summary28.json y todos los JUnit |
| Casos aprobados | 4 finales; 8 distintos acumulados | JUnit 27/28 |
| Casos fallidos | 0 en la corrida final; historial de 1 fallo y 2 errores resueltos conservado | run/run2/run3/case1.xml |
| Pruebas pendientes | 306 distintas; suite completa bloqueada | Lista explícita y descubrimiento original de 314 |
| 52 tablas conservadas | Esquema, 14 migraciones y conteos intactos | Inspecciones antes/después de cada caso |
| Bases protegidas | Acceso rechazado, sin escrituras propias | Denegaciones reales y validación de destino |

**A. FIXTURES Y TRANSACCIONES VALIDADOS — PRUEBAS ADICIONALES APROBADAS.** La clasificación corresponde a los cuatro casos y mecanismos comprobados, sin ocultar los fallos previos. No equivale a una regresión integral del backend ni a aprobar los 306 pendientes.

Es posible ampliar gradualmente por módulos mediante nuevas listas explícitas de 3–5 casos y el mismo control previo/rollback/inspección posterior. Se recomienda revisar como siguiente lote catálogo académico y aislamiento institucional, sin demo seeders, y después completar otros flujos de matrículas/familias. Deben comprobarse aparte DELETE, archivos/jobs/afterCommit, las consultas adicionales que necesiten otros módulos y el comportamiento ante errores de sus servicios. No se amplía ahora la lista ni se ejecuta ese plan; tampoco se habilita la suite completa.
