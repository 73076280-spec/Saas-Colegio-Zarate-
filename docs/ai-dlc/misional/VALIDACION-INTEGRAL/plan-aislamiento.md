# Validación integral misional — Plan de aislamiento

Fecha: 02/11/2026. Rama comprobada: `test/integracion-misional`. HEAD: `dda10da`. Estado inicial limpio. Fuentes: [diagnostico-entorno.md](diagnostico-entorno.md), [prompt-01-auditoria-entorno.md](prompt-01-auditoria-entorno.md), [prompt-02-plan-aislamiento.md](prompt-02-plan-aislamiento.md) y configuraciones/código citados abajo.

**Preparación: REQUIERE AJUSTES. Estado operativo: BLOQUEADO PARA ESCRITURAS.** Las herramientas permiten una instancia de pruebas separada, pero aún no existen los recursos exclusivos, el guard reproducible ni la comprobación efectiva de identidad, grants, rutas y conexión. Este plan no es una autorización de ejecución.

**Ningún bloque de comandos de preparación o pruebas de este documento se ejecutó.** En esta fase solo se leyeron archivos y se ejecutaron versiones con rutas explícitas. No se arrancaron servicios, se creó infraestructura, se conectó SQL, se ejecutaron migraciones/seeders/Pest/Cypress ni se modificaron .env. Se crean únicamente este archivo y el prompt 02 íntegro. Los resultados anteriores se mantienen como antecedentes, no pruebas actuales.

## 1. Rutas existentes y herramientas verificadas

| Recurso real | Ruta verificada | Resultado de solo lectura |
| --- | --- | --- |
| PHP portátil | `D:\zarate-saas\.tools\php\php.exe` | PHP **8.4.26** mediante `--version`. |
| INI de ese PHP | `D:\zarate-saas\.tools\php\php.ini` | `--ini` confirma que es el archivo cargado; el diagnóstico ya identificó pdo_mysql. |
| Composer PHAR | `C:\ProgramData\ComposerSetup\bin\composer.phar` | Composer **2.10.2**, invocado con PHP portátil; reporta PHP 8.4.26. |
| Wrapper Composer | `C:\ProgramData\ComposerSetup\bin\composer.bat` | Usa PHP del PATH: el diagnóstico identificó XAMPP 8.2.12, incompatible con backend. No usar ese wrapper para el plan. |
| Servidor MySQL | `D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe` | **8.4.11**, `--version`. |
| Cliente MySQL | `D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysql.exe` | **8.4.11**, `--version`. |
| Administración MySQL | `D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqladmin.exe` | Existencia comprobada; no se conectó al servidor. |
| Config/datadir actuales | `D:\zarate-saas\.tools\mysql-local.ini`, `.tools\mysql-data` | Existen; configuración previa 3307 y datos de desarrollo/pruebas compartiendo datadir. No reutilizarlos para esta preparación. |
| Laravel | `D:\zarate-saas\backend` | `composer.json`, `phpunit.xml`, `.env.example`, `.env.testing`, config y vendor presentes. |
| React/Vite | `D:\zarate-saas\frontend`; `frontend\vite.config.ts` | Vite usa 5173 strictPort y proxy API/Sanctum configurable. |
| Cypress | `D:\zarate-saas\e2e`; `e2e\cypress.config.ts` | Base URL por `CYPRESS_BASE_URL` o localhost:5173. |
| Node/npm | `C:\Program Files\nodejs\node.exe`, `npm.cmd` | **26.7.0 / 11.19.0**, comprobados por rutas concretas. |

Comandos efectivamente ejecutados en esta fase: PHP `--version`/`--ini`, PHP portátil + Composer `--version`, mysql/mysqld `--version`, Node/npm `--version`, lecturas e inventarios de rutas y Git. No se considera una versión de herramienta una prueba aprobada de integración.

## 2. Elección de aislamiento y comparación

| Opción | Ventaja | Riesgo / decisión |
| --- | --- | --- |
| Reutilizar instancia 3307 con esquema y cuenta test separados | Menos procesos y aprovecha datos existentes | Datadir compartido con desarrollo; arranque, recuperación, errores administrativos y privilegios globales podrían afectarlo. No se acreditaron grants ni que zarate_test sea descartable. **No recomendada para esta preparación.** |
| Instancia MySQL portátil separada | Mismo binario ya instalado, puerto/config/datadir exclusivos, sin restaurar información institucional | Requiere inicialización y administración inicial controladas; solo se autorizan en fase posterior. **Recomendada.** |
| Otro motor o infraestructura nueva | Podría aislar recursos | SQLite no verifica contratos MySQL; introducir Docker/otro motor o dependencias amplía el alcance sin necesidad demostrada. No propuesto. |

Cambiar DB_DATABASE, APP_ENV o usar DatabaseTransactions no garantiza aislamiento. Tampoco basta un puerto diferente si el datadir, storage, credenciales o tareas de limpieza siguen compartidos.

## 3. Arquitectura y nombres propuestos, no existentes

El contenedor de recursos **`D:\zarate-saas\.tools\misional-isolated` no existe**, comprobado con Test-Path. Sus subrutas siguientes son propuestas para crear después, no rutas descubiertas ni scripts ya implementados:

| Recurso propuesto | Destino / valor | Separación |
| --- | --- | --- |
| MySQL | `127.0.0.1:3308`; `misional-isolated\mysql.ini` y `mysql-data` | Nunca el ini/datadir actuales de 3307. Validar puerto y endpoints auxiliares antes de arrancar. |
| Esquema | `zarate_test` en la instancia nueva | Respeta el nombre exigido por phpunit/tests/AGENTS; distinto de zarate_dev. No importar/copiar desarrollo. |
| Principal de aplicación | Cuenta test exigida por phpunit, solo ese esquema | Sin privilegios globales, delegación ni cuentas administrativas en Laravel. Contraseña nueva, secreta y exclusiva. |
| Administración inicial | Archivo privado local de la instancia nueva | Independiente de `.tools/mysql-admin.ini`; no versionar ni imprimir sus valores. |
| Storage Pest | `misional-isolated\storage-pest` | Archivos fake, logs y caché sin alcanzar backend/storage ni E2E. |
| Storage HTTP | `misional-isolated\storage-http` | Sesiones multi-request y archivos ficticios de navegador separados del runner y desarrollo. |
| Cachés bootstrap | `misional-isolated\bootstrap-pest` y `bootstrap-http` | Incluye rutas de config/packages/services/routes/events; evitar cache:clear/package discovery sobre cachés compartidas. |
| Backend E2E | `http://127.0.0.1:8001` | Proceso PHP portátil exclusivo y APP_ENV testing. |
| Frontend E2E | `http://127.0.0.1:5174` | Vite separado, strictPort y proxy exclusivo a 8001. No tomar el servicio de 5173 como backend test. |
| Evidencia y procesos | `misional-isolated\evidence`, `run-manifest.json`, logs y PIDs propios | Registrar versiones, destinos y resultados sanitizados; no guardar mensajes, claves, SQL con contraseñas ni datos institucionales. |

Los puertos son candidatos: no se afirma que estén libres actualmente. No se habilitará acceso de red general ni servicios Windows permanentes. La instancia se liga a loopback y se verifican también listener MySQL X/otros puertos auxiliares, con desactivación o puerto exclusivo revisados para la versión instalada.

## 4. Configuración necesaria de Laravel

Fuentes revisadas: `backend/config/database.php`, `session.php`, `cache.php`, `queue.php`, `mail.php`, `filesystems.php`, `sanctum.php`, `cors.php`, `phpunit.xml`, `tests/Pest.php` y el código instalado de Application.

| Parámetro | Pest | Servidor HTTP E2E |
| --- | --- | --- |
| APP_ENV | testing explícito | testing explícito, antes de arrancar |
| PHP | Ejecutable portátil confirmado | Mismo ejecutable; proceso hijo debe heredarlo |
| MySQL | Host 127.0.0.1, puerto 3308, esquema/principal test verificados | Mismo destino exclusivo, no fallback a .env local |
| DB_URL / conexiones secundarias | Vacía/controlada; inventariar todas | Igual; verificar sesiones, colas y cachés, no solo conexión default |
| SESSION_DRIVER | array, impuesto por phpunit | **file** bajo storage-http para conservar login entre peticiones |
| CACHE_STORE | array | array para evitar caché persistente compartida; si un caso exige file, solo bajo storage-http y con evidencia |
| QUEUE_CONNECTION | sync | sync; revisar jobs porque sync aún ejecuta sus efectos, no es un sandbox universal |
| MAIL_MAILER | array | array, sin SMTP ni servicios externos; no asumir que afecta clientes HTTP externos |
| FILESYSTEM_DISK | local y disks actuales | local; comprobar roots de materiales/avatares bajo storage-http |
| LARAVEL_STORAGE_PATH | Ruta absoluta storage-pest | Ruta absoluta storage-http |
| APP_KEY | Nueva clave exclusiva de pruebas, secreta | Clave exclusiva y estable durante la corrida; nunca copiar la institucional ni imprimirla |
| SESSION_COOKIE / dominio | No es aislamiento relevante del runner interno | Cookie test diferente; dominio host-only revisado, mismo host en SPA/proxy y perfil Cypress exclusivo |
| APP_URL / FRONTEND_URL | Compatibles con casos internos existentes | Backend 8001 / frontend 5174; sin redirecciones a desarrollo |
| SANCTUM_STATEFUL_DOMAINS | phpunit fuerza hosts 5173 usados por pruebas internas | Allowlist mínima del origen test efectivo; comprobar compatibilidad de los specs reales indicados abajo |

`phpunit.xml` fuerza nombre/principal de DB, APP_ENV, sesión/cache array y DB_URL, pero **no fuerza host/puerto**; `artisan serve` no aplica phpunit.xml. El mismo `.env.testing` actual conserva 3307: no basta `--env=testing`.

Se propone inyectar configuración completa en un proceso PowerShell dedicado y sus hijos, restaurarla al salir y no modificar `.env`/`.env.testing`. El archivo privado nuevo de credenciales y el perfil de proceso nunca se publican. Si se optara por archivos de entorno adicionales, deben ser nuevos y exclusivos, con nombres diferentes de los actuales y revisión expresa; no son imprescindibles si la inyección completa y los preflights funcionan.

Application instalado admite `LARAVEL_STORAGE_PATH` y overrides `APP_CONFIG_CACHE`, `APP_PACKAGES_CACHE`, `APP_SERVICES_CACHE`, `APP_ROUTES_CACHE`, `APP_EVENTS_CACHE`. Asignar rutas **absolutas** exclusivas para Pest/HTTP; no ejecutar config:clear sobre bootstrap/cache compartido. La resolución real de todos esos paths debe verificarse antes de comandos Artisan, porque el arranque también puede generar cachés o logs.

### Recursos adicionales propuestos

Además de ini/storage/manifest, una fase posterior deberá crear y revisar scripts locales de orquestación y guards. Nombres candidatos dentro del directorio nuevo: `Initialize-TestResources.ps1`, `Enter-TestProfile.ps1`, `Test-Isolation.ps1`, `Prepare-Fixtures.ps1` y `Stop-TestServices.ps1`. **No existen ni se crean ahora**. Sus invocaciones en las siguientes etapas describen contratos pendientes de implementación; ejecutar una muestra sin ellos debe fallar, nunca saltarse el control.

## 5. Sesiones, Sanctum, CORS y Cypress real

`cors.php` limita orígenes a FRONTEND_URL, cubre API y sanctum/csrf-cookie y admite credenciales. `sanctum.php` determina hosts stateful con puerto. El cliente usa cookies y cabecera X-XSRF-TOKEN. Deben funcionar dos peticiones sucesivas autenticadas, no solo un login que devolvió 200.

1. Fijar un único hostname de navegación (`127.0.0.1`) y no alternarlo con localhost durante una sesión; proxy API y Sanctum al mismo backend 8001.
2. FRONTEND_URL del HTTP test debe ser el origen 5174. No ampliar CORS a `*` con credenciales ni desactivar CSRF para conseguir aprobaciones.
3. Cookie de sesión exclusiva y navegador de prueba sin sesión de desarrollo. Los puertos no separan cookies del mismo host; XSRF también debe verificarse en ese perfil. HTTP local y secure-cookie deben ser coherentes, sin cambiar producción.
4. **Dependencia encontrada:** varios specs reales fijan Origin/Referer a `http://localhost:5173` en cy.request (`auth`, `enrollment`, `courses`, `classroom`, `attendance`, `office`, `reports`, entre otros). Cambiar baseUrl a 5174 no reescribe esas cabeceras. Debe decidirse y probarse un ajuste focalizado del harness para usar el origen real antes de declararlo portable; no se modifican specs ahora. Como alternativa de compatibilidad, una allowlist adicional exclusivamente en el backend test requiere revisión explícita y no prueba el origen real del navegador. No usarla para esconder una configuración incorrecta.
5. La aplicación y los datos de prueba deben aislarse antes de login: AuthService escribe último acceso y auditoría. Las credenciales demo ya están definidas por fixtures/specs existentes; solo se usarían en la instancia sintética preparada. No se inventan cuentas del colegio ni se copian sus claves en este documento.

Cypress real incluye `auth`, `enrollment`, `enrollment-center`, `courses`, `classroom`, `learning`, `attendance`, `office` y otras regresiones. Los specs de mejoras con respuestas interceptadas prueban interfaz. `cy.request` no queda aislado por cy.intercept; los intercepts sin body son observación, no simulación. La selección real debe listar previamente sus endpoints/escrituras.

## 6. Gates obligatorios y evidencia antes de escribir

Si cualquiera falla o no puede demostrarse, el estado permanece **BLOQUEADO PARA ESCRITURAS**. No se permite continuar con avisos ignorables.

| Gate | Acreditación que deberá recoger el guard |
| --- | --- |
| Runtime | Ruta absoluta y versión PHP 8.4 portátil, ini y extensiones. Sin depender del PATH del padre. |
| Paths | Comparación de rutas canónicas, ancestros y reparse points de datadir/storage/cachés; no coincidir con ni contener los protegidos, tampoco mediante junction/symlink. |
| Proceso MySQL | PID propio y ejecutable/config/datadir esperados, loopback/puerto del manifest y ausencia de listeners auxiliares compartidos. |
| Servidor SQL | Consultas de lectura `@@port`, `@@datadir`, versión y, si está disponible, server_uuid; identidad de instancia concordante con manifest, no solo DB_DATABASE. |
| Esquema | `DATABASE()` es zarate_test; nunca zarate_dev; inventario sin datos institucionales y procedencia sintética documentada. Antes de migrar, esquema vacío o estado esperado del manifest. |
| Principal/grants | `CURRENT_USER()`, usuario efectivo y SHOW GRANTS, incluidos roles activos/heredados. No valores secretos en informe; principal de app sin privilegios globales/delegación/otros esquemas. |
| Laravel | APP_ENV testing y conexión efectiva default/secundarias; DB_URL y cachés no desvían la configuración. Validar con el mismo proceso/perfil que ejecutará el comando. |
| Sesión/archivos | Resolved storagePath, sesiones, cache paths, logs y cada disk root dentro del contenedor autorizado; cookie/origen correctos para HTTP. |
| Limpieza | Allowlist exacta del recurso y manifest de propiedad; nunca iterar todas las bases ni usar filtros de nombre como única protección. Revalidar inmediatamente antes de cada operación destructiva. |
| Aprobación del destino | Todas las pruebas anteriores guardadas con fecha y salidas sanitizadas; permiso para la fase de creación/escritura, que no se concede en esta solicitud. |

SQL de diagnóstico propuesto, **no ejecutado**:

```sql
SELECT DATABASE(), CURRENT_USER(), @@port, @@datadir, @@version;
SHOW GRANTS FOR CURRENT_USER();
```

La revisión de privilegios debe abarcar roles y grants globales, no inferir seguridad solo por la ausencia física de zarate_dev en la instancia nueva. No ejecutar escrituras negativas sobre desarrollo. `MySqlConnectionTest.php` incluye un SELECT de denegación: en una instancia sin ese esquema, registrar el error real y revisar su significado (ausencia no equivale a privilegios denegados); no cambiar el test para fabricar aislamiento.

La inicialización y el provisioning son escrituras especiales anteriores a disponer de un esquema: requieren primero gates offline de ruta/proceso/instancia y autorización explícita. Migraciones/fixtures/tests requieren después todos los gates de conexión y grants de aplicación; no es válido usar la cuenta administrativa para sortearlos.

## 7. Comandos propuestos para la siguiente fase

**Solo propuestas. No ejecutar por copiar este documento.** Los comandos que usan guards/scripts dependen de archivos futuros que aún deben implementarse y revisarse. Todos se ejecutarán en una PowerShell dedicada, sin transcripción de secretos. Directorio inicial: `D:\zarate-saas`.

### Variables de rutas, sin credenciales

```powershell
$repo = 'D:\zarate-saas'
$php84 = Join-Path $repo '.tools\php\php.exe'
$mysqlBin = Join-Path $repo '.tools\mysql-8.4.11-winx64\bin'
$testRoot = Join-Path $repo '.tools\misional-isolated'
$testIni = Join-Path $testRoot 'mysql.ini'
$manifest = Join-Path $testRoot 'run-manifest.json'
```

Antes de crear, normalizar rutas absolutas, examinar ancestros/reparse points y comprobar que testRoot no existe. No asignar HOME ni otras variables de sistema. No resolver un conflicto eliminando una carpeta existente.

### Etapas: precondición, comando, verificación y reversión

| Paso / ruta | Precondiciones | Comando PowerShell propuesto | Riesgo y verificación posterior | Detención y reversibilidad |
| --- | --- | --- | --- | --- |
| 1. Crear recursos locales, raíz del repo | Autorización futura; paths canónicos seguros, puertos disponibles y root inexistente | `New-Item -ItemType Directory -Path $testRoot` y preparación revisada de ini/ACL/manifest/directorios exclusivos | Crear solo dentro de root; confirmar ACL, paths, bind/puerto y ownership. No copiar ini de desarrollo con datadir/secretos heredados. | Si existe o apunta fuera, detener. Dejar recursos identificados; borrado posterior solo con comprobación de paths y procesos detenidos. |
| 2. Inicializar MySQL nuevo, raíz | Ini nuevo validado, datadir nuevo/vacío, gates offline y registro de autorización | `& (Join-Path $mysqlBin 'mysqld.exe') "--defaults-file=$testIni" --initialize` | Escritura de sistema en datadir exclusivo. Contraseña temporal/log privados: no imprimir ni versionar. Revisar exit code y log sanitizado. | Fallo o destino ambiguo: no reintentar sobre el mismo datadir a ciegas. Conservar para inspección, sin tocar actual. |
| 3. Arrancar instancia nueva, raíz | Inicialización correcta y listener/PID/puerto libres acreditados | `$mysqlProcess = Start-Process -FilePath (Join-Path $mysqlBin 'mysqld.exe') -ArgumentList @("--defaults-file=$testIni") -WindowStyle Hidden -PassThru` | Solo root aislado; guardar PID. El primer argumento defaults-file no debe usar ini actual. Revisar datadir/puerto reales por SQL al conectarse. | Si no responde o identidad difiere, no avanzar. Detener solo este PID/instancia por procedimiento de paso 10. |
| 4. Crear esquema/principal restringido | Instancia acreditada, sesión administrativa temporal privada y SQL revisado | `& (Join-Path $mysqlBin 'mysql.exe') "--defaults-file=$testRoot\admin.private.ini" --protocol=TCP --host=127.0.0.1 --port=3308` | Aprovisionamiento interactivo o script privado revisado; sin contraseñas en argumentos, documentación ni stdout. Verificar grants con cuenta de app, no con admin. | Cualquier grant global/rol ajeno bloquea. Retirar/recrear solo recursos de esta instancia; nunca revocar usuarios de desarrollo. |
| 5. Perfil Laravel y preflight | Scripts futuros revisados; nuevas claves/secretos privados, storage/cachés exclusivos | `. "$testRoot\Enter-TestProfile.ps1" -Mode Pest -Manifest $manifest` y `& "$testRoot\Test-Isolation.ps1" -Manifest $manifest -Mode Pest` | El perfil configura todos los valores del apartado 4 y limpia overrides heredados solo en su proceso. Guard verifica todos los gates y sale no cero ante fallo. | Si script falta o no acredita un gate, parar. Restaurar entorno del proceso/terminar PowerShell dedicada, sin tocar .env. |
| 6. Preparar esquema, backend | Todos los gates aprobados inmediatamente antes; migraciones revisadas | `Push-Location "$repo\backend"`; `& $php84 artisan migrate --env=testing --database=mysql`; `Pop-Location` | Escritura permitida solo en nueva instancia. Revisar versión/schema/migration status, columnas y motores. No usar migrate:fresh/refresh/db:wipe. Pest crea sus fixtures; la carga E2E selectiva se reserva para después del paso 7. | Primera discrepancia detiene. No asumir rollback de DDL; recreación solo del datadir/esquema exclusivo en otra operación aprobada y verificada. |
| 7. Pest secuencial, backend | Preflight renovado, esquema listo y storage-pest; no servidor E2E concurrente | `& $php84 vendor/bin/pest tests/Feature/MySqlConnectionTest.php --compact`, luego Health/Sprints por orden de apartado 8 | Registrar destino y resultados por suite; transacciones no protegen conexión equivocada. No ejecutar composer test genérico como guard. | Error de aislamiento o comportamiento: detener, conservar evidencia. Rollback parcial no garantiza reversión de archivos/DDL. |
| 8. Backend HTTP test, backend | Pest terminado; fixtures E2E y perfil HTTP validados | `. "$testRoot\Enter-TestProfile.ps1" -Mode Http -Manifest $manifest`; `& "$testRoot\Test-Isolation.ps1" -Manifest $manifest -Mode Http`; `& $php84 artisan serve --env=testing --host=127.0.0.1 --port=8001` | Ejecutar foreground en terminal dedicada; no usa configuración de Pest por magia. Verificar health, DB del preflight y sesión multi-request. Registrar árbol/PIDs propios. | Si puerto/origen/DB/storage difieren, parar. Ctrl+C en esta terminal; verificar también proceso hijo y puerto, sin matar otros PHP. |
| 9. Vite y Cypress, frontend/e2e | HTTP aislado y origin/fixtures compatibles | Ver bloques siguientes; Cypress selectivo sin interceptaciones de respuesta para la suite real | Login/logout y tests escriben. Registrar URL efectiva y evidencia real/simulada separada. | Primera desviación a desarrollo bloquea. Detener solo Vite/backend propios, no servicios por nombre. |
| 10. Evidencia y detención, raíz | Resultados recogidos y manifest/PIDs íntegros | `& "$testRoot\Stop-TestServices.ps1" -Manifest $manifest` (futuro script revisado); MySQL: `& (Join-Path $mysqlBin 'mysqladmin.exe') "--defaults-file=$testRoot\admin.private.ini" --protocol=TCP --host=127.0.0.1 --port=3308 shutdown` | Antes de shutdown comprobar identidad/datadir; parada limpia, PID y liberación de puertos. Logs sanitizados; no copiar claves. | Si identidad no coincide, no mandar shutdown. No usar taskkill/Stop-Process por nombre ni apagar servicio Windows global. Recursos quedan para revisión, sin borrado automático. |

Los pasos de modificación de recursos no son completamente reversibles por transacción: DDL y cambios en archivos pueden persistir. La reversión se basa en descartar **solo el entorno nuevo propio**, tras parada y comprobación; no se proporciona un borrado recursivo genérico. En caso de fallo se conserva evidencia, no se «limpia» desarrollo para repetir.

### Contenido del ini nuevo y provisioning

El ini futuro deberá especificar rutas absolutas a binarios y **datadir nuevo**, bind loopback, puerto 3308 y logs/PID privados bajo testRoot. Revisar opciones válidas y listener auxiliar de MySQL 8.4 antes de usarlo. Nunca usar `.tools/mysql-local.ini` ni `.tools/mysql-admin.ini` como defaults del proceso de pruebas.

La plantilla SQL privada de provisioning deberá crear únicamente zarate_test y el principal test exigido por phpunit, con host de conexión validado y secreto nuevo, rotando/eliminando la contraseña temporal administrativa. Privilegios de aplicación/migración se limitan a ese esquema y operaciones requeridas (SELECT/INSERT/UPDATE/DELETE y DDL de esquema), sin permisos globales ni GRANT OPTION. No se publica una sentencia con contraseña ni se presupone el grant actual. Cuenta administrativa solo para provisioning/parada, no para tests.

### Fixtures: contrato de un paso futuro, no datos institucionales

Los seeders existentes dependen de institución y cuentas demo. Revisar esta secuencia antes de aplicarla únicamente al esquema nuevo: Database/Development → AcademicDemo → PeopleDemo → EnrollmentDemo → CourseDemo → ClassroomDemo → LearningDemo → AttendanceDemo → OfficeDemo, comprobando las llamadas internas de cada uno. No asumir idempotencia universal ni que etiquetarse «local/testing» limite la base.

Comando selectivo propuesto, con **clase existente revisada**, después de Pest y del guard renovado, antes de iniciar el backend HTTP del paso 8:

```powershell
# FUTURO, solo tras guards y en backend con el perfil de prueba.
& $php84 artisan db:seed --env=testing --class=DevelopmentSeeder
# Siguientes clases: seleccionar explícitamente las revisadas, en orden; no ejecutar todas por wildcard.
```

Las credenciales sintéticas que esperan los specs se revisan desde fuentes locales sin copiarlas a documentación. Decidir si se reutiliza su contrato de demo solo dentro de la instancia nueva o se autoriza parametrizar el harness; no inventar una cuenta institucional. Confirmar edades, año/periodo, matrículas aprobadas, pagos ficticios, curso activo, docente/apoderado y archivos de prueba antes de correr cada spec. Las factories de Pest crearán sus propios registros en transacciones; se recomienda cargar fixtures E2E después de Pest para no depender de estados alterados por éste.

### Frontend/Cypress propuestos

```powershell
# FUTURO, terminal dedicada, sin cambiar frontend/.env.
$env:API_PROXY_TARGET = 'http://127.0.0.1:8001'
Push-Location "$repo\frontend"
& 'C:\Program Files\nodejs\npm.cmd' run dev -- --host 127.0.0.1 --port 5174 --strictPort
Pop-Location
```

Antes de Cypress, confirmar el proxy efectivo y compatibilidad de Origin/Referer, FRONTEND_URL y Sanctum; no se corrige un 401/419 desactivando protección.

```powershell
# FUTURO, otra terminal con el destino acreditado.
$env:CYPRESS_BASE_URL = 'http://127.0.0.1:5174'
Push-Location "$repo\e2e"
& 'C:\Program Files\nodejs\npm.cmd' test -- --spec cypress/e2e/integration.cy.ts
# Después: auth y módulos, por selección explícita; no npm test sin scope al comenzar.
Pop-Location
```

El health propuesto `Invoke-WebRequest -Uri 'http://127.0.0.1:8001/api/health'` y el mismo path a través de 5174 prueban transporte, no DB. Registrar además el preflight que vincula ese proceso PHP al destino SQL exclusivo.

## 8. Orden de pruebas, stop rules y repetibilidad

Después de gates, esquema y autorización:

1. Health técnico y `MySqlConnectionTest`, luego autenticación/permisos S1 y auth. No considerar login una operación sin escrituras.
2. Catálogos/personas S2/S3 cuando correspondan a la selección; después S4 y enrollment/enrollment-center.
3. S5/S6/S7 y courses/classroom/virtual/learning; evaluar tareas, materiales, entregas, evaluaciones y notas con periodo habilitado.
4. S8 y attendance: asistencia/justificaciones, vínculos y archivos privados.
5. S9 y office: publicación/audiencias/notificaciones propias; reportes/resúmenes S10 si se incluyen expresamente.
6. UI simulada de mejoras como regresión separada, sin presentarla como backend real. No sumar reejecuciones como casos nuevos.

Cada etapa registra versiones, commit, script/spec exacto, configuración sanitizada, aprobadas/fallidas/no ejecutadas y criterio de avance. Ante error de aislamiento, falta de fixture, fallo funcional o tráfico a destino distinto, detener la etapa y registrar el motivo; no crear datos en desarrollo ni alterar pruebas para hacerlas pasar. Repetir solo tras resolver el origen y renovar gates.

Para repetibilidad, usar identificador de corrida en manifest/evidencia, fixtures revisadas y una instancia descartable propietaria. No ejecutar Pest y Cypress reales simultáneamente sobre el mismo esquema; no confiar en revertirlo todo con DatabaseTransactions. Guardar el estado previo de variables de proceso y restaurarlo en finally, o cerrar las terminales dedicadas después de parar sus hijos.

## 9. Bloqueadores pendientes y decisión

| Pendiente | Consecuencia actual |
| --- | --- |
| Instancia/ini/datadir exclusivos aún inexistentes | No hay un destino seguro de escritura acreditado. |
| Guards/scripts y manifest aún no implementados | Los ejemplos con esos scripts no son una automatización lista para ejecutar; deben revisarse en la siguiente fase. |
| Principal/grants reales y procedencia del esquema no comprobados | Prohibido migrar o preparar datos incluso si una conexión responde. |
| Configuración efectiva PHP/HTTP/storage/cachés pendientes | No se puede asegurar aislamiento solo por `.env.testing` o phpunit. |
| Origin/Referer fijos en specs reales | Portabilidad a 5174 requiere decisión y prueba del harness, sin debilitar Sanctum/CORS. |
| Sesión multi-request y proxy no verificados | Un health 200 no acredita autenticación y persistencia E2E. |

También permanecen los límites funcionales de los cierres anteriores: navegación SPA parcial de asistencia y borradores de comunicaciones, vía diagnóstica Cypress.press de evaluación y decisiones institucionales sin confirmar. Preparar infraestructura no los resuelve ni autoriza cambiar roles/reglas.

**Estado final: REQUIERE AJUSTES; BLOQUEADO PARA ESCRITURAS hasta acreditar todos los gates y recibir autorización de la fase de preparación.** El plan es viable con binarios/dependencias existentes; no hay necesidad demostrada de instalar herramientas ni intervenir en zarate_dev. Pruebas ejecutadas en esta fase: **ninguna**. Únicamente se crearon los dos documentos solicitados; no se realizó commit, push, merge o PR.
