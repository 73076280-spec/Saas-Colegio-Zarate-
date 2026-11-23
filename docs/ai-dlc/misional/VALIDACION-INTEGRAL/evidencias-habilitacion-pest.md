# Prompt 27 — Habilitación segura de Pest

Fecha: 05/11/2026. Repositorio: `D:\zarate-saas`. Rama comprobada: `test/integracion-misional`.

## Alcance y estado inicial

Continuación del Prompt 26 y su autorización, sin recrear el entorno. `zarate_pest` contiene 14 migraciones y 52 tablas en el MySQL aislado 3308. Cuenta exclusiva, ocho privilegios limitados al esquema, sin DROP, con SSL obligatorio. La referencia `zarate_test`, desarrollo y sus servicios quedan protegidos. Se conservan los cambios pendientes y evidencias anteriores.

La autorización permite entre tres y cinco casos reales, después de verificar seguridad; no permite ejecutar los 314, migrar, reconstruir, usar seeders demo ni ejecutar Cypress. Se seleccionan los cuatro casos originales de `backend/tests/Feature/HealthTest.php`: salud HTTP, método no admitido, ruta inexistente y acceso anónimo a una ruta Sanctum. Son afirmaciones funcionales reales de la aplicación y no simples comprobaciones del launcher. No validan operaciones académicas con fixtures.

## Diagnóstico del arranque

- `backend/phpunit.xml` fuerza la base y usuario históricos zarate_test; no debe utilizarse para este entorno. `composer test` ejecutaría config:clear y artisan test; no se utiliza ni se cambia.
- `backend/tests/Pest.php` extiende `Tests\TestCase`; el TestCase original arranca el kernel normal. Los bootstraps privados 14/26 conservan bloqueos explícitos y no se modifican.
- `PestAdapter26.php` bloquea antes de proveedores y usa una configuración restringida. El kernel normal volvería a cargar configuración, y `DatabaseServiceProvider` registra de nuevo el gestor DB: habilitarlo exige conservar la configuración y restablecer el resolver protegido antes de arrancar proveedores.
- Once archivos transaccionales exigen literalmente zarate_test en beforeEach. Los dos casos de MySqlConnectionTest también esperan ese destino/usuario; uno presupone SQLSTATE 42000, mientras que la denegación observada con PDO al conectar a una base protegida fue HY000/1044. No se cambian expectativas para ocultar un fallo ni se simula el nombre de base.
- `backend/AGENTS.md` prescribe el destino histórico. La autorización expresa del usuario para zarate_pest prevalece en este procedimiento aislado, sin cambiar dicho archivo ni el flujo de desarrollo.

## Clasificación de los 314 casos

Inventario basado en el XML de descubrimiento válido del Prompt 26 y revisión actual de tests, factories, seeders y traits. `Classify27.php` produce `risk-inventory.json` sin ejecutar tests.

| Archivo Feature | Casos | Impacto y limpieza |
| --- | ---: | --- |
| HealthTest.php | 4 | HTTP, sin fixtures ni trait DB; seleccionados para esta fase |
| MySqlConnectionTest.php | 2 | Lecturas SQL y rechazo de acceso; contrato histórico pendiente, no seleccionados |
| AvatarTest.php | 3 | Factories y permisos, DatabaseTransactions; Storage::fake privado |
| Sprint1Test.php | 62 | Autenticación/RBAC/auditoría; factories y permisos, DatabaseTransactions |
| Sprint2Test.php | 84 | Catálogo académico; DatabaseTransactions; un caso requiere AcademicDemoSeeder |
| Sprint3Test.php | 79 | Personas/familias; DatabaseTransactions; un caso requiere PeopleDemoSeeder |
| Sprint4Test.php | 21 | Matrículas; DatabaseTransactions; incluye inserción directa para comprobar restricción |
| Sprint5Test.php | 12 | Cursos/asignaciones; DatabaseTransactions |
| Sprint6Test.php | 12 | Aula Virtual/materiales; DatabaseTransactions y Storage::fake |
| Sprint7Test.php | 10 | Aprendizaje; DatabaseTransactions y Storage::fake |
| Sprint8Test.php | 10 | Aprendizaje/evaluaciones; DatabaseTransactions y Storage::fake |
| Sprint9Test.php | 10 | Asistencia/seguimiento; DatabaseTransactions y Storage::fake |
| Sprint10Test.php | 5 | Oficina/comunicaciones; DatabaseTransactions |
| **Total** | **314** | **308 transaccionales, 4 HTTP y 2 de conexión** |

Los 308 transaccionales usan factories y RolePermissionSeeder, que crea permisos/roles y delega en seeders de permisos de módulos; no es un seeder demo. Generan INSERT/UPDATE/DELETE mediante servicios/modelos y algunos DB::table. Las comprobaciones directas de Sprint3 abarcan pivotes y FK; Sprint4 comprueba duplicados con INSERT. Se revisaron las factories y no se encontraron reconstrucciones ni conexiones adicionales explícitas.

No se encontraron RefreshDatabase, DatabaseMigrations, DDL, TRUNCATE ni comandos de reconstrucción explícitos en los tests revisados. Tampoco un connectionsToTransact personalizado ni transacciones manuales adicionales declaradas en ellos. Esto es inspección estática, no aprobación de su ejecución: servicios pueden usar transacciones anidadas y deben validarse en la siguiente fase.

DatabaseTransactions abre una transacción en la conexión predeterminada y registra rollback/disconnect al destruir la aplicación (`backend/vendor/laravel/framework/src/Illuminate/Foundation/Testing/DatabaseTransactions.php`). No reconstruye el esquema; tampoco garantiza por sí solo el aislamiento si se cambia de conexión, se confirma la transacción o hay DDL/commits implícitos. Los contadores autoincrementales pueden avanzar aunque se reviertan filas. Su ciclo real y las transacciones anidadas aún no se han aprobado aquí. Dos de esos 308 casos siguen incompatibles con la prohibición de seeders demo.

## Configuración local y controles

Se preparan copias separadas bajo `.tools/misional-isolated/evidence/prompt27`, ignoradas por Git: Adapter27, Guard27, TestCase27, Bootstrap27, XML privado con un único archivo HealthTest, CheckLive27, Inspect27, clasificación y supervisor nativo. No se alteran phpunit.xml, tests, traits, migraciones, lógica funcional ni archivos .env. Los secretos se leen desde sus recursos privados existentes.

El XML adapta explícitamente DB_DATABASE/DB_USERNAME al nuevo entorno, y usa almacenamiento y caches privados `storage-pest27` / `bootstrap-pest27`. Se permiten únicamente los manifests de paquetes/servicios que Laravel genera allí; configuración, rutas y eventos cacheados siguen rechazados. No se instala ni ejecuta Composer.

TestCase27 carga primero la configuración restringida y atestigua SQL; después arranca los demás bootstrappers del kernel sin volver a cargar un entorno menos restrictivo. Restablece el gestor protegido tras registrar proveedores, verifica antes de BootProviders y después del kernel que Laravel utiliza el mismo PDO/conexión. Quedan habilitados proveedores, rutas y middleware reales del proyecto. No se sustituye la respuesta HTTP bajo prueba.

Bootstrap27 exige configuración privada explícita y archivo HealthTest original con hash intacto. TestCase27 limita la clase ejecutable a HealthTest y rechaza traits transaccionales o reconstructivos. La conexión mantiene validación por consulta, ausencia de reconexión transparente, TLS CA/certificado/IP, puerto/base/usuario/datadir/UUID, vigencia de 120 segundos y proceso/listener propios. No se abre capacidad SQL de migración o DML para estos casos. El supervisor emite un gate fresco para cada caso y se detiene ante una salida no cero.

### Incidencias preparatorias conservadas

1. El generador local se detuvo al leer un JSON con BOM; se reanudó únicamente la parte pendiente. Otra comprobación offline detectó la falta del autoload antes del loader XML. Se corrigieron herramientas nuevas, sin SQL ni casos ejecutados. Los primeros archivos/scripts permanecen disponibles.
2. El sandbox denegó Get-CimInstance en preflight antes de arrancar MySQL. Se ejecutó el supervisor con acceso al sistema para verificar procesos/ACL/listener, sin omitir el control.
3. En `run`, el primer comando Pest salió **2** en bootstrap (`EXPLICIT_PRIVATE_CONFIGURATION_REQUIRED`), antes de setup/casos y sin JUnit: comparaba rutas con separadores distintos en Windows. Se corrigió la comparación mediante realpath/canonical, sin relajar el destino permitido. `run` conserva salida, manifiesto, scripts originales y comprobaciones SQL antes/después, iguales. No se cuenta este error como un caso funcional aprobado o fallido.
4. Se corrigió mediante lectura del framework, antes de cualquier caso, el uso del callback registered: Laravel lo invoca tras registrar proveedores y recibe la aplicación; no representa una notificación individual de cada proveedor. Se conserva el manifiesto previo a esa corrección.
5. En `run2`, el comando Pest salió **2**, antes de ejecutar casos, con `TEST_CASE_ALREADY_LOADED`: el bootstrap PHPUnit llega después del autoload de TestCase realizado por Pest. Se introdujo `Launch27.php` para cargar primero el TestCase protegido y después el ejecutable instalado de Pest. `BootstrapEntry27.php` comprueba por reflexión que la clase procede del archivo privado esperado. El descubrimiento de cuatro casos aprobó sin setup ni SQL.
6. En `run3`, el comando salió **1**, con JUnit vacío (`<testsuites/>`) y sin casos ejecutados: se habían elegido como filtros identificadores internos del XML en vez de las descripciones que utiliza Pest. Se preservó ese resultado. Dos descubrimientos filtrados demostraron la diferencia; se restauraron filtros por descripción. `filter-verification.json` comprueba **4/4 selecciones de un solo caso**, sin ejecución. El supervisor de `run4` comprueba además que cada reporte JUnit contenga exactamente un testcase.

El primer ciclo nativo cerró a las 14:41:14 -05:00, servidor 0, shutdown completo, cero procesos MySQL/conexiones 3308, cuatro configuraciones protegidas intactas. Su supervisor salió 0 por haber completado el cierre y la inspección; el comando Pest salió 2. Ambos resultados se distinguen expresamente.

`run2` cerró a las 14:44:19 -05:00, servidor 0, sin listener/proceso MySQL; se observó una conexión residual de cierre, no un listener. `run3` cerró a las 14:48:06 -05:00, servidor 0 y cero conexiones/procesos. En ambos ciclos el catálogo y conteos de las 52 tablas coincidieron antes/después y con el cierre del Prompt 26. No se ejecutaron migraciones ni seeders. Los reportes vacíos o fallos de bootstrap no cuentan como pruebas funcionales aprobadas ni como un fallo académico.

El launcher definitivo de esta fase utiliza `Launch27.php`, `BootstrapEntry27.php`, `phpunit27-run3.xml` y `Run27-run4.ps1`; el nombre del XML identifica su versión, no autoriza ejecutar más archivos. La autorización de entrada/clase es específica para los cuatro HealthTest. No se habilita una bandera general de suite/SQL en el perfil ni se abre la capacidad de escritura del adaptador.

## Plan para los casos restantes — sin ejecutarlo

1. Autenticación/seguridad: validar primero un caso transaccional de Sprint1 y rollback real; adaptar las aserciones de destino a un contrato explícito zarate_pest, sin reutilizar la expectativa histórica.
2. Matrículas: Sprint4 después de verificar aislamiento y limpieza, incluida la prueba de constraint; mantener fuentes funcionales y reglas.
3. Enseñanza-aprendizaje: Sprint5–7 y materiales, con transacciones y almacenamiento temporal privado comprobados.
4. Evaluaciones/calificaciones: Sprint7–8 y los casos correspondientes, conservando publicación y permisos.
5. Asistencia/justificaciones: Sprint9, con verificación de transacciones anidadas y conteos post-test.
6. Comunicaciones/solicitudes: Sprint10; validar efectos sobre auditoría/notificaciones y su rollback.
7. Regresión: Avatar y catálogo/personas (Sprint2–3) con exclusión explícita y documentada de los dos casos demo mientras siga la prohibición. Adaptar los dos MySqlConnectionTest a identidad nueva y denegaciones efectivas sin confundir bloqueo de guarda con rechazo del servidor.

Antes de esos grupos hay que ampliar de forma revisable la selección limitada del launcher y su política SQL, verificar las operaciones transaccionales en el mismo PDO y bloquear DDL, TRUNCATE, USE y SQL que nombre otros esquemas. No basta con beforeExecuting: begin/commit/rollback y acceso directo al PDO requieren atención específica. Mantener comprobaciones antes de traits, por operación y al cierre; no quitar DatabaseTransactions ni conceder DROP. No habilitar refresh/fresh/wipe para resolver fallos.

La incompatibilidad de destino y los dos seeders demo son problemas de fixtures/contrato, no defectos académicos confirmados. Los incidentes de ruta/autoload/sandbox son de infraestructura. La prueba inicial solo podrá detectar defectos HTTP dentro de su alcance; no permite aprobar operaciones académicas, limpieza transaccional ni la suite integral.

## Resultados de ejecución y cierre

La corrida válida es **run4**, con cuatro procesos PHP/Pest separados, selección individual y reportes JUnit originales `case1.xml` a `case4.xml`. Los casos provienen de HealthTest sin modificaciones. No se simuló la API ni se utilizó un servidor HTTP de demostración: Laravel atendió las peticiones dentro del proceso de pruebas, con kernel, rutas y middleware reales. Cada proceso verificó además la conexión real a MySQL aislado; no se prueba aquí un flujo funcional con escrituras SQL.

| Caso original de HealthTest | Resultado | Aserciones JUnit | Duración JUnit |
| --- | --- | ---: | ---: |
| responde con la salud técnica sin depender de la base de datos | APROBADO | 2 | 20,549453 s |
| rechaza métodos no admitidos | APROBADO | 1 | 10,208145 s |
| responde JSON para rutas API inexistentes | APROBADO | 2 | 9,853989 s |
| impide acceso anónimo a una ruta protegida por Sanctum | APROBADO | 1 | 10,517901 s |
| **Total** | **4 aprobados; 0 fallos, 0 errores, 0 omitidos** | **6** | **51,129488 s** |

La duración es la suma de los tiempos de los casos en JUnit, no la del preflight/arranque ni la de toda la sesión. Hay **314 descubiertos, 4 ejecutados y 310 sin ejecutar**. Los intentos run/run2 produjeron dos errores de bootstrap sin casos; run3 produjo una selección vacía con salida no cero. Se preservan como incidencias de infraestructura y selección, adicionales a los cuatro casos válidos, sin borrarlos del historial.

### Verificaciones de seguridad y SQL

| Comprobación | Resultado real | Evidencia local prompt27 |
| --- | --- | --- |
| Identidad/configuración/CA/certificado/vigencia | 19 aprobadas, 0 fallidas; offline | guard-tests.json |
| Entrada con configuración histórica y selección no permitida | 2 rechazos esperados aprobados, sin casos/SQL | entry-negatives.json y logs privados |
| Filtros individuales | 4 selecciones de exactamente un caso, sin setup/SQL | filter-verification.json y filter-discovery-1..4.xml |
| Rechazo de bases protegidas | 2 denegaciones reales 1044/HY000, más rechazo de configuración | live-negative.json; copias históricas en run/run2/run3 |
| Identidad desde cada proceso Pest | 4 comprobantes, MySQL 8.4.11/3308/zarate_pest, cuenta exclusiva, mismo PDO, TLS estricto | runtime-identities.jsonl |
| Esquema y filas | 52 tablas, 14 migraciones; igualdad exacta antes/después y con el esquema final del Prompt 26 | run4/schema-before/after.json y counts-before/after.json |

Las 19 comprobaciones de guardas, dos rechazos de entrada y cuatro selecciones son **25 verificaciones offline**, separadas de las dos denegaciones reales y de los cuatro casos funcionales Pest. No se suman repeticiones de preflight ni comprobaciones antiguas del Prompt 26 como nuevos casos de backend.

En las 51 tablas de aplicación hay **cero filas antes y después**; migrations conserva exactamente sus 14 registros. Los casos seleccionados no crean fixtures, no necesitan limpieza y no ejecutan DML ni DDL autorizados por el launcher. La política de consulta sigue cerrada a escrituras; las lecturas de identidad/catálogo/conteos pertenecen al diagnóstico de seguridad. No se utilizó rollback o reconstrucción para producir esta igualdad. El ciclo transaccional de los otros casos **no está validado por estos resultados**.

Las credenciales/grants existentes no se modificaron. Se utilizó únicamente la cuenta nueva y sus permisos exclusivos; ambas bases protegidas rechazan su acceso y no hubo escrituras sobre ellas. No se abrió una sesión administrativa ni una sesión de lectura de la referencia en este Prompt: la comparación con zarate_test procede del cierre SQL del Prompt 26, mientras que la nueva igualdad SQL antes/después se comprobó sobre zarate_pest. No se atribuye una nueva auditoría de filas de desarrollo a estas pruebas.

### Cierre del proceso y preservación

Preflight válido: **05/11/2026, 14:50:38 -05:00**. Monitor propio **9688**, worker **15548**. Cierre **14:52:49 -05:00**: cuatro clientes Pest **0**, cliente de inspección final **0**, supervisor **0**, servidor **0**, shutdown completo. Monitor **3221225786 / 0xC000013A** por señal de cierre del árbol propio. Cero procesos MySQL/conexiones 3308 y PID-file ausente. No se deja un servidor en marcha ni se conserva un gate válido indefinidamente; la siguiente fase debe arrancarlo y emitir nuevas pruebas vivas.

El log tiene **0 ERROR/FATAL y 1 advertencia** por la CA privada autofirmada; se mantuvieron la confianza explícita en dicha CA y la validación de certificado/IP. El cierre comprobó ACL de **2.107 objetos**, cuatro configuraciones protegidas intactas y el log de inicialización sin cambios. No se compararon archivos InnoDB vivos con hashes históricos ni se detuvieron servicios ajenos.

### Archivos y Git

Documentos nuevos: `prompt-27-habilitacion-pest.md` (copia íntegra del adjunto) y `evidencias-habilitacion-pest.md` (este registro). Las herramientas nuevas viven en `.tools/misional-isolated/evidence/prompt27`, más los generadores preparatorios Build27.php/ResumeBuild27.php en evidence, todos ignorados por Git. El runtime solo genera almacenamiento/cache privado y sus evidencias.

Se conservan los pendientes previos: evidencias-finalizacion-migraciones.md modificado; documentos 24/25/26 y evidencias de recuperación/Pest sin rastrear. No se alteraron tests/fixtures originales, phpunit.xml, .env, roles, reglas académicas, migraciones ni código funcional. No se ejecutaron Pint/Composer/Cypress, migraciones o seeders. No hubo commits, push, merge ni PR. La revisión final de hashes, secretos y formato se incorpora con el resumen local de cierre.

`final-preservation.json` confirmó **86 archivos fijados del Prompt 26 sin discrepancias** y **128 archivos del manifiesto actual sin discrepancias**, incluidas las fuentes originales de tests y las 14 migraciones. El prompt nuevo coincide por SHA-256 con el adjunto. La auditoría final revisó **668 archivos, incluidos 53 documentos**, sin coincidencias de secretos fuera de sus recursos dedicados. `git diff --check` aprobó. El único diff rastreado sigue siendo el documento evidencias-finalizacion-migraciones.md que ya estaba pendiente al inicio; los dos documentos del Prompt 27 se agregan sin alterar esos pendientes. El resumen de ejecución es `test-summary.json`, separado del informe de preservación y de la auditoría de secretos.

## Informe final y clasificación

| Componente | Resultado | Evidencia |
| --- | --- | --- |
| Launcher Pest | HABILITADO solo para HealthTest; entrada previa al autoload de Pest | Launch27.php, BootstrapEntry27.php y JUnit run4 |
| Conexión zarate_pest | VERIFICADA desde los cuatro procesos de prueba | runtime-identities.jsonl |
| Guardas de seguridad | 25 comprobaciones offline y 2 denegaciones MySQL aprobadas | reportes indicados arriba |
| Fixtures | No requeridos por selección; 308 casos transaccionales aún bloqueados | risk-inventory.json; sin adaptaciones ejecutadas a sus beforeEach |
| Casos ejecutados | 4 | run4/case1..4.xml |
| Casos aprobados | 4, con 6 aserciones | test-summary.json y JUnit |
| Casos fallidos | 0 funcionales; dos errores de bootstrap y una selección vacía previos, preservados | run/run2/run3 |
| Casos bloqueados/no ejecutados | 310, incluyendo 2 de conexión y 308 transaccionales (2 requieren demo seeders) | inventario y restricción de clase/archivo del launcher |
| Estado de las 52 tablas | Esquema y conteos iguales antes/después | run4/schema/counts-before/after.json |
| Bases protegidas | Acceso rechazado, sin escrituras ni cambios de configuración propios | live-negative.json; result.json y alcance de credencial |

**A. LAUNCHER HABILITADO — PRUEBAS INICIALES APROBADAS.** Esta clasificación se limita a las cuatro pruebas HTTP descritas. No significa que las 314 estén habilitadas o que los módulos académicos hayan aprobado regresión SQL. Para ejecutar los restantes faltan: adaptar su contrato de destino, habilitar y comprobar de forma focalizada DML/transacciones/rollback en el mismo PDO, validar almacenamiento/fixtures y transacciones anidadas, ampliar la selección por módulos con nuevas guardas comprobadas y resolver la incompatibilidad de los dos seeders demo. No se necesita ni se autoriza conceder DROP. La suite completa permanece sin ejecutar y pendiente de autorización de la siguiente fase.
