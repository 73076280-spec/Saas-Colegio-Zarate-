# Adaptadores locales Laravel/Pest y preparación de migraciones — Prompt 14

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama comprobada: `test/integracion-misional`. HEAD inicial: `2c85105` (`docs(qa): cerrar validacion TLS y conexion Laravel MySQL`). Git inicialmente limpio.

**Resultado: CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES.** Se implementaron y comprobaron adaptadores locales de construcción/configuración de Application, bootstrap Pest y XML PHPUnit independiente. Pasaron **30 controles locales: cinco positivos y 25 rechazos esperados**. No equivalen a casos Pest/Cypress. La ejecución completa permanece bloqueada antes de proveedores y kernels: falta el supervisor de acreditación SQL en vivo y la integración autorizada de ese resultado con el arranque completo. No se habilitó ningún comando de migración.

**En esta fase: 0 conexiones SQL, 0 consultas SQL, 0 peticiones HTTP funcionales, 0 migraciones, 0 seeders y 0 casos Pest/Cypress ejecutados.** No se arrancaron MySQL, Laravel HTTP ni Vite. Los resultados PDO/Laravel del Prompt 13 se conservan como evidencia histórica, sin repetirlos ni usarlos como autorización vigente de escritura.

## 1. Revisión y alcance

Se revisaron íntegramente los informes de base/cuenta, configuración de integración y corrección TLS; se contrastaron perfiles y scripts locales sin imprimir credenciales. Fuentes reales inspeccionadas: `backend/bootstrap/app.php`, `backend/app/Providers/AppServiceProvider.php`, configuración de base/sesiones/caché/logging/Sanctum/CORS, `backend/phpunit.xml`, `backend/tests/Pest.php`, `backend/tests/TestCase.php`, tests propios, seeders académicos/personas y migraciones. También las implementaciones instaladas de TestCase/Application/bootstrappers Laravel y Loader/PhpHandler de PHPUnit. Frontend/E2E: Vite, Cypress y cliente API.

Se reutilizan PHP portable **8.4.26**, Laravel **13.34.0**, CA/certificado del Prompt 13 y referencias privadas originales. No se generaron claves, certificados, contraseñas o usuarios nuevos. No se modificaron `.env`, configuraciones activas ni código funcional.

## 2. Recursos locales creados

Todos bajo `.tools/misional-isolated/evidence/prompt14`, ignorados por Git:

| Archivo | Comportamiento real |
| --- | --- |
| `Adapter14.php` | Factory reutilizable pest/http: valida perfil y entorno heredado, carga entorno/configuración reales, restringe recursos en memoria y comprueba configuración efectiva. Retorna Application y un informe saneado; no retorna secretos en el informe |
| `Http14.php` | Construye la Application HTTP configurada. No atiende solicitudes ni inicia servidor |
| `PestBootstrap14.php` | Carga el perfil y la clase TestCase local antes de que Composer resuelva la del proyecto; rechaza que esa clase ya esté cargada |
| `TestCase14.php` | Clase local `Tests\TestCase`, sin editar la del backend. Reaplica la factory en cada createApplication; detiene ejecución antes del kernel y de traits de BD |
| `phpunit-isolated.xml` | Bootstrap, directorio Feature y caché PHPUnit con rutas absolutas locales; variables públicas del perfil Pest con force=false, sin credenciales/APP_KEY |
| `MigrationGuard14.php` | Verifica configuración efectiva y bloquea por ausencia de acreditación vigente de instancia/privilegios/autorización. No acepta un JSON histórico como permiso ni ejecuta migraciones |
| `Inspect14.php`, `Probe14.php` | Controles offline, mutaciones negativas exclusivamente en memoria, factory HTTP y selección/recreación de TestCase local |
| `PhpunitPrecedence14.php` | Procesa XML con Loader y PhpHandler reales de PHPUnit, sin runner, suite o test discovery |
| `Validate14.ps1` | Sintaxis, casos positivos/negativos y resultados saneados; restaura variables del proceso PowerShell tras cada caso |
| `Preflight14.ps1` | Comprobación independiente de rutas/ACL/enlaces/hashes, opciones MySQL, desarrollo protegido y ausencia de instancia activa; no arranca servicios |

Los informes JSON y los dos incidentes de preparación se conservan en el mismo directorio. El bootstrap local no convierte la invocación ordinaria de Artisan/Pest desde otra terminal en una ejecución aislada. Tampoco protege comandos ejecutados fuera de este mecanismo; no se alteró el enrutamiento global de Composer ni el TestCase versionado.

## 3. Variables, precedencias y aislamiento comprobados

La factory comprueba ejecutable PHP/ruta/hash, hash de opciones MySQL del Prompt 13, nombres y referencias exactas del perfil. Lee en memoria la credencial restringida del Prompt 11 y la APP_KEY del perfil del Prompt 12, sin duplicarlas en scripts, XML o documentación.

Inspecciona **por separado** getenv, `$_ENV` y `$_SERVER`: una fuente no puede ocultar un valor contradictorio de otra por la precedencia de un array combinado. Las variables sensibles de destino/servicio desconocidas o contradictorias no vacías se rechazan. Los valores obligatorios deben existir en el perfil; la falta de host efectivo también se probó como rechazo. Una ausencia de variables en el proceso se satisface desde el perfil privado, nunca desde desarrollo.

| Recurso | Valor efectivo comprobado |
| --- | --- |
| Entorno | testing, debug=false |
| SQL | única conexión mysql; 127.0.0.1:3308, base/usuario zarate_test; DB_URL/socket vacíos; sin read/write hosts alternativos |
| TLS | CA exclusiva de Prompt 13, firma/fechas/SAN IP/cadena comprobados offline; PDO SSL_VERIFY_SERVER_CERT=true |
| `.env` | Archivo guard exclusivo y vacío del Prompt 13; selección antes de LoadEnvironmentVariables; backend/.env y .env.testing no cargados por el adaptador |
| APP_KEY/contraseña | Leídas de recursos privados originales; informe solo indica presencia, nunca valor/hash |
| Storage | storage-pest o storage-http, incluidos cuatro discos locales; sin enlaces public/storage ni discos remotos seleccionables |
| Sesión | array en Pest; file en HTTP; cookie misional_isolated_session, host-only, HttpOnly, SameSite=lax, secure=false para HTTP loopback |
| Caché | Solo store array; cinco destinos bootstrap exclusivos, comprobados ausentes antes de cargar |
| Logs | Canales locales single/emergency y null; sin canales externos seleccionables |
| Cola/correo/broadcast | Solo null / array / null; servicios externos retirados del repositorio temporal de configuración |
| Temporales | TMP, TEMP y TMPDIR del proceso hijo redirigidos al tmp privado; sys_get_temp_dir efectivo comprobado |
| Web | APP_URL http://127.0.0.1:8001, FRONTEND_URL http://127.0.0.1:5174, Sanctum 127.0.0.1:5174 y CORS con ese origen y credenciales |

Las variables temporales generales de Windows se sustituyen deliberadamente solo en PHP; no se modifica el entorno persistente del usuario/sistema. El preflight inspecciona rutas físicas/ACL/hardlinks; PHP comprueba destinos canónicos. La factory no reproduce por sí sola todas las verificaciones Windows: un futuro supervisor de ejecución deberá acoplarlas y volver a comprobarlas para reducir cambios entre verificación y uso.

El XML local usa **force=false** para que una variable heredada insegura no quede silenciada por una sustitución forzada antes del bootstrap. El procesamiento real de PHPUnit se probó tanto con entorno compatible como con DB_PORT contradictorio. El XML activo original se rechazó por incompatibilidad con el perfil: fuerza Sanctum 5173 y conserva una cola sync. No se modificó ese XML ni se declara que sea defectuoso para su contexto original.

Se comprobaron múltiples Application en el mismo proceso y dos llamadas al createApplication local: ambas permanecen bloqueadas antes del kernel. Existen hooks de bloqueo antes de RegisterProviders y después de una recarga de LoadConfiguration. No se arrancaron proveedores para afirmar aislamiento operativo de todos sus efectos.

## 4. Guardas previas a una futura migración

| Condición solicitada | Estado en Prompt 14 |
| --- | --- |
| APP_ENV, conexión, host, puerto, base y usuario exactos | Verificados offline y en repositorio efectivo; cambios incompatibles rechazados |
| TLS estricto y CA de pruebas | Verificados en configuración y criptografía offline; conexión real acreditada históricamente en Prompt 13 |
| Identidad efectiva, datadir y UUID de la instancia viva | **Pendiente de nueva acreditación en el proceso supervisor que vaya a autorizar escritura** |
| Cuenta restringida solo al esquema | Nueve grants sin delegación acreditados en Prompt 11; **pendiente de revisión vigente** antes de escribir |
| Ausencia de conexiones alternativas a desarrollo | Configuración limitada a mysql aislado; no hubo ninguna conexión en esta fase |
| Storage/sesiones/cachés exclusivos | Verificados offline; arranque completo aún bloqueado |
| Correo/cola/notificaciones sin destinos externos | Drivers y configuración restringidos; no es un sandbox de red ni prueba de cada futuro canal de notificación |

La guarda de migración es **un bloqueo seguro, no un autorizador completo**. No se implementó una ruta de éxito basada en informes antiguos, flags editables o en el mero nombre de la base. Por ello no se declara apto el arranque completo ni cumplida una comprobación SQL vigente que no se ejecutó. Completar el supervisor de lectura de identidad/grants y su acoplamiento antes del kernel es trabajo pendiente, no una operación realizada.

Para autorizar posteriormente la primera migración se exige: supervisor Windows revisado con procesos/handles/listener y cierre controlado; comprobación TLS y lectura SQL vigente de versión/UUID/datadir/base/usuario/cifrado/grants; configuración efectiva verificada antes de proveedores y de cada Application; inventario y hash de migraciones aprobadas; estado del esquema e inventario de desarrollo; autorización del comando concreto sobre zarate_test. No usar migrate:fresh, refresh, db:wipe, limpieza global o seeders como preparación implícita. No hay comando de migración generado en esta fase.

## 5. Resultados de comprobaciones locales

Registro: `validation-result.json`. **30 controles aprobados, 0 fallidos en la corrida final**:

- **Cinco positivos (salida 0):** configuración Pest, configuración HTTP, factory HTTP, factory/clase local Pest con recreaciones y procesamiento del XML local con PHPUnit real.
- **Nueve negativos efectivos (salida 21 esperada):** host ausente, base de desarrollo, puerto incompatible, TLS desactivado, caché de BD, sesiones compartidas, SMTP, cola sync y Sanctum 5173.
- **Tres bloqueos de ejecución (21):** guarda de migración, proveedores y recarga de configuración.
- **Un conflicto entre fuentes PHP (21):** getenv DB_PORT=3308 frente a $_ENV DB_PORT=3307.
- **Diez heredados rechazados (21):** APP_ENV, DB_DATABASE, DB_PORT, DB_USERNAME, DB_URL, APP_CONFIG_CACHE, SANCTUM_STATEFUL_DOMAINS, QUEUE_CONNECTION, MAIL_MAILER y AWS_ENDPOINT incompatibles.
- **Dos negativos de PHPUnit real (21):** puerto heredado incompatible y configuración XML original incompatible.

Sintaxis PHP comprobada con `php -l`; scripts PowerShell ejecutados por el parser/motor real. El XML se procesó con las clases instaladas de PHPUnit, **sin ejecutar PHPUnit/Pest como runner**. Las inspecciones de configuración solo usan los bootstrappers de entorno/configuración Laravel.

Incidentes conservados, resueltos antes de la corrida final:

1. Primer diagnóstico bloqueado con salida 21 por una referencia Illuminate sin prefijo global tras introducir namespace en el adaptador. Se corrigió la referencia de clase; sin SQL/proveedores.
2. Primer verificador de factories se detuvo con salida 1 porque la comparación del archivo de TestCase normalizaba solo un lado de la ruta Windows. Se corrigió únicamente la comparación del probe; no se sustituyó la clase del backend ni se rebajó una autorización.

No se suman repeticiones como controles nuevos. Estos fallos de preparación no se presentan como pruebas funcionales fallidas ni se borran del historial.

Preflight Windows aprobado: **537 objetos** revisados, sin reparse/hardlinks ajenos ni permisos fuera de las identidades autorizadas; MySQL/3308 inactivos. Se compararon los **303 archivos de desarrollo y cuatro configuraciones protegidas** por inventario, metadatos, hashes y ACL sin diferencias.

## 6. Clasificación de las pruebas Pest existentes

Inventario leído: 13 archivos Feature, TestCase/Pest y directorio Unit sin casos propios. No se localizaron RefreshDatabase, DatabaseMigrations, llamadas a migrate, truncate o selección SQLite en los tests propios inspeccionados. Esto no afirma que el framework/vendor carezca de esos mecanismos ni que una transacción proteja toda escritura.

| Clasificación futura | Archivos/casos | Motivo y preparación |
| --- | --- | --- |
| Seguras para futura ejecución aislada, condicionadas al arranque aprobado | `backend/tests/Feature/HealthTest.php`, cuatro casos | Salud técnica, método no admitido, ruta inexistente y anónimo; sin factories/seeders propios. No ejecutados; proveedores/middleware aún requieren verificación |
| Requieren preparación | Primer caso de `MySqlConnectionTest.php` | Lecturas de conexión; revisar TLS/destino mediante supervisor antes del runner |
| Bloqueada como evidencia de denegación equivalente | Segundo caso de `MySqlConnectionTest.php` | Consulta zarate_dev.migrations. El esquema aislado no tiene por qué contener esa base: un error por inexistencia puede diferir de una denegación de permisos. No crear base de desarrollo para forzar el test; revisar el propósito y el contrato antes de seleccionarlo |
| Requieren esquema y fixtures sintéticos autorizados | `Sprint1Test.php` a `Sprint10Test.php` y `AvatarTest.php` | Usan DatabaseTransactions y factories; crean instituciones/usuarios y ejercitan mutaciones. Necesitan migraciones previas. Las comprobaciones en beforeEach pueden ocurrir después de abrir transacciones: no sustituyen una guarda previa al kernel/traits |
| Bloqueados bajo la prohibición actual de seeders | Casos de reproducibilidad demo en `Sprint2Test.php` y `Sprint3Test.php` | Invocan AcademicDemoSeeder/PeopleDemoSeeder dos veces. Buscan institución ZARATE; el test la prepara sintéticamente. Requieren autorización separada de esos seeders y sus efectos, no datos institucionales reales |

Los tests de archivos usan Storage::fake en Avatar y Sprints 6–9; ello depende del storage de la Application y no se considera aislado por el mero uso del fake. Se identificaron eliminaciones/actualizaciones deliberadas, permisos, auditoría y fixtures multiinstitución. Deben mantenerse los contextos InstitutionContext y los casos de otra institución/docente/estudiante; no reemplazarlos por usuarios reales ni desactivar scopes. Cada suite debe recrear sus fixtures y limpiar estado estático/eventos; no se verificó independencia de orden mediante ejecución.

La migración `2026_10_01_150000_create_saas_core.php` contiene escritura condicional para adaptar usuarios preexistentes, y los métodos down contienen eliminaciones de esquema. DDL MySQL no se considera transaccionalmente reversible por DatabaseTransactions. No se ejecutaron ni simularon esas migraciones.

## 7. HTTP, Sanctum y Cypress

Configuración local coherente offline: backend **127.0.0.1:8001**, frontend **127.0.0.1:5174**, SQL **127.0.0.1:3308**. Aún no se comprobaron cookies XSRF/sesión mediante dos solicitudes, CSRF real, CORS en navegador o autenticación multiinstitución. El login puede escribir last_login_at/auditoría: no se usó como supuesto diagnóstico de lectura.

Cambios mínimos futuros, no aplicados:

1. Supervisor HTTP con perfil aplicado antes de proveedores, cierre controlado y verificación de sesión host-only; navegador separado. Las cookies no se aíslan por puerto, por lo que un puerto distinto no basta para evitar compartir cookies del mismo host.
2. Lanzamiento Vite loopback, strictPort 5174 y API_PROXY_TARGET obligatorio a http://127.0.0.1:8001; evitar los defaults actuales host 0.0.0.0, 5173 y proxy 8000. No modificar la configuración de desarrollo.
3. Harness Cypress local con base URL 5174, proxy acreditado, origen dinámico y protección contra destinos ajenos antes de autenticar. CYPRESS_BASE_URL no cambia cabeceras literales ni el destino de cy.request.
4. Revisar cabeceras 5173 de auth, academic, attendance, classroom, courses, enrollment/enrollment-center, learning, office, reports y virtual. La coincidencia numérica en notification-consistency contiene también fechas/IDs y no se clasifica automáticamente como puerto: requiere lectura contextual.
5. Separar specs simulados y reales. Los specs focalizados de mejoras usan interceptaciones; otros usan cy.request y autenticación real. cy.intercept no simula cy.request y un intercept sin fixture/respuesta puede dejar pasar tráfico. No se modificaron specs ni se certificó un allowlist de tráfico completo.

## 8. Limitaciones, siguiente paso y conservación

Pendientes: supervisor de acreditación viva y su integración con el arranque completo; revisión de providers/canales no cubierta por simple configuración; compatibilidad final de Pest discovery con el bootstrap local; ejecución de schema/fixtures posteriormente autorizada; sesiones web y tráfico Cypress. El bloqueo no tiene un interruptor para omitir esas comprobaciones. El XML preparado no se presenta como suite habilitada.

Próximo paso recomendado: implementar y revisar exclusivamente la acreditación viva de solo lectura y el acoplamiento de guardas al arranque HTTP/Pest. Después presentar el plan de primera migración con comando, inventario, efectos y cierre. La presente fase no autoriza escrituras futuras ni demuestra las pruebas integrales.

Solo se crean para Git este informe y el prompt íntegro. Scripts e informes permanecen locales en `.tools`. No se modificaron Bolts anteriores, frontend/backend, .env, usuarios, grants o datos; no hubo instalaciones, commits, push, merge o PR.

Verificación final a las **17:24:33 -05:00**, registrada en `final-state.json`: **0 procesos mysqld, 0 listeners en 3308/8001/5174**, PID-file ausente, **0 archivos en storage Pest/HTTP y 0 caches bootstrap generados**. La auditoría de secretos comparó los recursos nuevos y ambos documentos con las credenciales y claves privadas existentes, sin coincidencias fuera de los recursos dedicados; no publicó valores. Los nueve scripts PHP, incluido el auditor, pasaron validación sintáctica.

El prompt coincide por SHA-256 con el adjunto original. `git diff --check` y las comprobaciones adicionales de whitespace sobre los dos documentos nuevos no detectaron errores; solo hubo advertencia de normalización CRLF/LF del prompt. `.tools` continúa ignorado y sin archivos rastreados. Git muestra únicamente los dos documentos de Prompt 14; los documentos anteriores permanecen sin cambios.

**Clasificación final: CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES.** Adaptadores y precedencias verificados offline; escritura y ejecución completa bloqueadas. La limitación es la falta de acreditación viva integrada y verificación del arranque completo, no una regresión TLS demostrada. No se declara completada la validación integral ni autorizadas migraciones.
