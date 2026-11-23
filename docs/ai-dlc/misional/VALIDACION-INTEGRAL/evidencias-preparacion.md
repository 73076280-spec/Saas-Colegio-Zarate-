# Validación integral misional — Preparación no destructiva

Fecha: 02/11/2026. Rama: `test/integracion-misional`. HEAD inicial: `1f82776`. Estado inicial de Git limpio. Se revisaron diagnóstico, plan y prompt 02 y se contrastaron las configuraciones existentes.

**Estado final: REQUIERE AJUSTES.** Se prepararon rutas y plantillas no activas. **Inicialización, escrituras SQL y pruebas reales siguen BLOQUEADAS** hasta revisar controles pendientes y autorizar una fase posterior. No se afirma que una instancia esté preparada operativamente, ni que el aislamiento SQL esté acreditado.

Solicitud íntegra en [prompt-03-preparacion-entorno.md](prompt-03-preparacion-entorno.md), copiada del adjunto y verificada por hash.

## 1. Alcance y acciones efectivamente realizadas

- Versiones explícitas, extensiones PHP, inspección de rutas/ACL y configuración, listeners y procesos.
- Validación de ancestros y no solapamiento de rutas antes de crearlas.
- Comprobación puntual de disponibilidad de puertos mediante bind exclusivo temporal, sin Listen ni servicio de aplicación.
- Creación de **31 carpetas nuevas, incluido el contenedor raíz**, y **6 plantillas no activas sin secretos**. El datadir queda vacío.
- Creación de los dos documentos de esta fase; los anteriores se conservan.

No se ejecutaron mysqld --initialize, MySQL servidor, conexión SQL, CREATE/GRANT/ALTER/DROP/TRUNCATE, migraciones, seeders, Artisan, Pest o Cypress. No se realizaron login, instalación, modificación de código/.env/phpunit, detención de servicios, commit, push, merge o PR. Ninguna prueba real se declara aprobada.

## 2. Herramientas y rutas reales verificadas

| Recurso | Ruta / resultado |
| --- | --- |
| PHP portátil | `D:\zarate-saas\.tools\php\php.exe`, **8.4.26**. |
| INI cargado | `D:\zarate-saas\.tools\php\php.ini`; sin otros ini adicionales en la salida de `--ini`. |
| Extensiones PHP | PDO/pdo_mysql/mysqlnd, openssl, mbstring, intl, curl, fileinfo, DOM/XML, zip, bcmath y otras enumeradas por `-m`. No se usa PHP 8.2 del PATH. |
| Composer | `C:\ProgramData\ComposerSetup\bin\composer.phar`, **2.10.2**, invocado con PHP portátil; identifica PHP 8.4.26. |
| MySQL servidor/cliente | `.tools\mysql-8.4.11-winx64\bin\mysqld.exe` y `mysql.exe`, ambos **8.4.11**, solo `--version`. |
| Desarrollo configurado | `.tools\mysql-local.ini`: basedir portátil, datadir `D:/zarate-saas/.tools/mysql-data`, loopback y **3307**. El datadir existe y se considera protegido. |
| Backend/frontend/E2E | `D:\zarate-saas\backend`, `frontend` y `e2e`; se leyeron configuraciones actuales. No se arrancaron procesos nuevos. |

Se inspeccionaron configuración DB, sesión/caché/colas/correo/discos, Sanctum/CORS, Vite, Cypress y overrides de caché del Laravel instalado. `.env` sigue apuntando a desarrollo/3307 y `.env.testing` al esquema de pruebas en 3307. Esas configuraciones existentes **no se modificaron ni se consideran el perfil de la instancia nueva**. No hay `backend/bootstrap/cache/config.php` al inspeccionar.

## 3. Puertos, procesos y límites de la observación

El inventario inicial Get-NetTCPConnection/Get-CimInstance dentro del sandbox devolvió CimException. Se repitió únicamente la consulta de metadatos fuera del sandbox con aprobación de la herramienta, sin mostrar líneas de comandos completas ni credenciales. La segunda consulta sí acreditó listeners y procesos en ese momento:

| Puerto | Resultado de inventario |
| --- | --- |
| 3306 | Sin listener observado; no hay PID asociado en el inventario. |
| 3307 | Sin listener observado; no se inició la instancia configurada de desarrollo. |
| 3308 | Sin listener observado; candidato nuevo. |
| 33060 | Sin listener observado; no garantiza cómo arrancaría MySQL X después. |
| 8000 / 8001 | Sin listener observado. |
| 5173 | Dos listeners: IPv4 127.0.0.1, PID **2932**; IPv6 ::1, PID **4528**. Ambos `node.exe`, `C:\Program Files\nodejs\node.exe`. No se tocaron. |
| 5174 | Sin listener observado; candidato Vite separado. |

CIM identificó **0 procesos mysqld.exe**. Por ello no hay una instancia MySQL activa observada cuyo datadir efectivo pueda obtenerse con seguridad. El datadir de desarrollo anterior es **configurado en archivo**, no una identidad de servidor SQL comprobada. No se usaron credenciales administrativas ni se abrió SQL para averiguarlo.

En **3308, 8001 y 5174** se creó un socket IPv4 de loopback con `ExclusiveAddressUse=true`, se ejecutó Bind y se liberó inmediatamente en finally, **sin Listen**. Los tres binds aprobaron. Esto demuestra disponibilidad puntual de esos endpoints, no reserva futura, disponibilidad IPv6 ni permisos de firewall de un servicio que aún no existe. Repetir inventario/bind antes de cualquier arranque autorizado.

## 4. Validación física y permisos

Se comprobó antes de crear que `D:\zarate-saas\.tools\misional-isolated` no existía. Se normalizó su ruta absoluta y se comparó en ambos sentidos con:

- `D:\zarate-saas\.tools\mysql-data` — datadir protegido configurado.
- `D:\zarate-saas\backend\storage` — almacenamiento compartido protegido.

No son la misma ruta ni ancestro/descendiente entre sí. Se revisaron todos los ancestros hasta `D:\`, incluidos repo y `.tools`; no presentaban ReparsePoint/LinkType. Después de crear se volvió a recorrer el contenedor y no se encontraron reparse points. Cada subruta creada se validó dentro del prefijo exacto del contenedor, con comparación sin distinción de mayúsculas.

Se inspeccionaron ACL del disco, repo, `.tools`, datadir actual y raíz nueva. La raíz nueva **hereda las ACL existentes**; no se cambiaron permisos en ningún recurso previo. Las ACE observadas incluyen permisos de modificación/full-control; no se imprimieron identidades locales ni se deduce de ello acceso indebido demostrado. **No se certifica una ACL privada para secretos**. No se crearon claves, archivos administrativos ni contraseñas en ese directorio. Antes de inicializar —que generará un secreto temporal en logs— debe revisarse y aprobarse protección de acceso al nuevo contenedor y logs.

## 5. Recursos realmente preparados

Contenedor: **`D:\zarate-saas\.tools\misional-isolated`**, creado ahora. El plan lo describía como candidato inexistente; este registro acredita solo su preparación física posterior, sin reescribir el plan histórico.

### Carpetas

31 en total, raíz incluida:

- Raíz y `mysql-data`, `logs`, `pids`, `evidence`, `bootstrap-pest`, `bootstrap-http`.
- Para cada perfil `storage-pest` y `storage-http`: raíz de perfil, `framework`, `framework/cache`, `framework/cache/data`, `framework/sessions`, `framework/views`, `logs`, `app`, `app/private`, `app/private/avatars`, `app/private/materials`, `app/public`.

Las carpetas no contienen datos de aplicación ni esquemas; las seis plantillas se ubican solo en la raíz. **`mysql-data` tiene 0 entradas, incluidas ocultas.** No se copiaron archivos de desarrollo o institucionales.

### Plantillas sin credenciales reales

| Archivo nuevo bajo el contenedor | Contenido y límite |
| --- | --- |
| `mysql.ini.template` | Basedir real, datadir nuevo, loopback 3308, log y PID bajo el contenedor. MySQL X/opciones auxiliares quedan pendientes de validación. No existe `mysql.ini` operativo. |
| `laravel-pest.env.template` | APP_ENV testing, MySQL candidato 3308/zarate_test, sesión/cache array, correo array, cola sync y storage-pest. APP_KEY/principal/contraseña son marcadores obligatorios, no valores reales. |
| `laravel-http.env.template` | Sesión file multi-request, cookie diferenciada, correo/cache array, cola sync y storage-http; URL 8001/origen 5174. Misma prohibición de cargar marcadores o usar fallback. |
| `vite.env.template` | Proxy candidato exclusivo a 8001; puerto/host se definirían en el proceso de Vite independiente. No se cargó. |
| `cypress.env.template` | Base URL candidata 5174; recuerda que Origin/Referer del spec no se reescribe por cambiar baseUrl. No se cargó. |
| `run-manifest.template.json` | Estado `TEMPLATES_ONLY_WRITES_BLOCKED`; initialized/running/runtimeConfigurationVerified/grantsVerified/guardsImplemented/writesAuthorized en false. No contiene un PID ni identidad SQL inventados. |

Los seis archivos llevan extensión de plantilla. No se crearon `.env` operativo, perfil ejecutable, scripts de guard, archivos administrativos, bases, usuarios o servicios. El JSON se parseó correctamente y se comprobó que las autorizaciones/estados de ejecución siguen en false. Ningún archivo existente fue sobrescrito.

`.tools/misional-isolated/...` queda ignorado por la configuración Git existente, confirmado con `git check-ignore`. No se cambió .gitignore ni se forzará su inclusión. Por tanto **Git no transporta estas plantillas locales**: para repetir la preparación en otra máquina deberá reconstruirse el contenedor según el plan y esta evidencia, sin copiar datadirs existentes. Los únicos archivos visibles nuevos en Git en esta fase son los dos documentos AI-DLC.

### Hallazgo adicional: rutas de caché en Windows

En el código instalado, `Application::normalizeCachePath` reconoce como prefijos absolutos `/` y `\\`; un valor con unidad `D:/...` no coincide con esos prefijos y puede ser unido erróneamente al basePath. Esto matiza la propuesta anterior de usar cadenas de unidad absolutas directamente en APP_*_CACHE.

Para conservar **el mismo destino físico aprobado**, las plantillas usan `../.tools/misional-isolated/bootstrap-pest/...` o `bootstrap-http/...`, resueltas desde el basePath del backend. Se normalizaron offline las cinco rutas de cada perfil con el backend real y se confirmó que las diez terminan dentro del contenedor. LARAVEL_STORAGE_PATH conserva la ruta absoluta del perfil, soportada de forma independiente por storagePath.

Esta es una comprobación estática/canónica; **no se arrancó Laravel para certificar sus rutas efectivas**. El guard futuro deberá exigir los paths efectivos absolutos y detenerse si difieren. No se modificó el framework ni configuración compartida para suplir esta condición.

## 6. Configuración de aplicación y efectos externos

El principal futuro de pruebas deberá coincidir con el contrato exigido por `phpunit.xml` y tener privilegios solo sobre zarate_test en la nueva instancia. Los marcadores actuales no crean ni acreditan una cuenta. La identidad administrativa temporal pertenece únicamente a la inicialización futura; no se reutilizará `.tools/mysql-admin.ini` ni una credencial institucional.

Se proponen correo array, discos locales bajo storage exclusivo y caché array. La cola sync coincide con el plan y los tests existentes, pero **no garantiza ausencia de efectos externos de un job arbitrario**; no se inició ningún worker ni se ejecutó un job. Revisar jobs/clientes externos y conexiones secundarias antes de permitir escrituras/pruebas. Las notificaciones Office conservan el canal database existente: también escribirían en el esquema test y requieren autorización posterior.

Las plantillas **no están cargadas ni son una protección operacional por sí mismas**. Falta un loader/guard revisado que valide todos los campos requeridos, rechace marcadores, variables inesperadas, DB_URL o cachés desviados y no continúe hacia `.env` de desarrollo si falla el perfil. Sin ese guard no se permite invocar Artisan o iniciar el servidor desde esta preparación.

Pest fuerza algunos valores en phpunit, no host/puerto; su sesión array es distinta de la sesión file necesaria para HTTP E2E. Los dos perfiles tienen storage y cachés separados para evitar mezclar sesiones/logs/fixtures. No se generaron claves nuevas en esta fase.

## 7. Frontend, Sanctum y Cypress

Se conserva Vite actual 5173 con strictPort y proxy por API_PROXY_TARGET o fallback 8000. No se modifica ni detiene. La propuesta test es otro proceso loopback **5174** con proxy `/api` y `/sanctum` al mismo Laravel **8001**; no usar el frontend actual como si phpunit hubiera cambiado su backend.

`cors.php` usa FRONTEND_URL y credenciales; Sanctum necesita host/puerto stateful. El perfil HTTP propuesto usa `127.0.0.1:5174`, cookie de sesión distinta y host consistente. Los puertos no separan cookies de un mismo host: navegador/perfil test debe ser independiente, con CSRF y persistencia multi-request verificados. No se desactiva CORS/CSRF ni se propone wildcard con credenciales.

Siguen existiendo cabeceras Origin/Referer fijas a localhost:5173 en specs reales. Se localizaron nuevamente en auth, enrollment, courses, attendance y otros. No se editaron. Se requiere decisión explícita sobre el harness o compatibilidad restringida del backend test; no se permite suponer que cambiar CYPRESS_BASE_URL basta.

Los specs de mejoras con API interceptada son pruebas de interfaz; `auth`, `enrollment`, `enrollment-center`, `courses`, `classroom`, `learning`, `attendance`, `office`, entre otros, necesitan backend real y pueden escribir. Login/logout también escriben auditoría/último acceso. cy.request no se aísla mediante cy.intercept. Ninguno se ejecutó ni se inició sesión en esta fase.

## 8. Checklist de aislamiento

APROBADO significa únicamente el alcance de evidencia indicado, no una autorización general. PENDIENTE requiere una comprobación posterior; BLOQUEADO identifica una operación que no puede ejecutarse todavía.

| Requisito | Estado | Evidencia / condición restante |
| --- | --- | --- |
| Rama y preservación de cambios | APROBADO | Rama correcta, inicio limpio; no se sobrescribieron fuentes previas. |
| PHP/ini/extensiones | APROBADO | 8.4.26 portátil e ini real, módulos enumerados. |
| Binarios MySQL/Composer | APROBADO | Rutas reales y versiones comprobadas sin iniciar servicios. |
| Inventario 3306/3308 | APROBADO para la observación puntual | Sin listener/PID ni mysqld observado; no acredita ocupación futura. |
| Puertos candidatos 3308/8001/5174 | APROBADO para bind puntual | Socket exclusivo temporal liberado; repetir antes de uso real. |
| Ruta/datadir/storage exclusivos | APROBADO físicamente | Sin solapamiento/reparse; carpetas nuevas y datadir vacío. No certifica @@datadir. |
| Permisos de escritura de preparación | APROBADO para crear recursos no secretos | Carpetas/plantillas creadas sin cambiar ACL existentes. |
| ACL privada para futuros secretos/logs | PENDIENTE | Herencia inspeccionada; acceso privado no acreditado. Resolver antes de generar secretos al inicializar. |
| Config MySQL efectiva y MySQL X | PENDIENTE | Solo plantilla; falta revisión de opciones/listeners antes de inicializar. |
| Base exclusiva / ausencia de datos institucionales en DB | PENDIENTE | Datadir vacío comprobado, pero no existe una DB preparada ni un inventario SQL. |
| Cuenta administrativa nueva / cuenta test / grants | PENDIENTE | No creadas ni usadas; no se verificó principal SQL. |
| APP_ENV/host/puerto/DB efectivos | PENDIENTE | Valores propuestos en plantillas; Laravel no arrancado. |
| Sesiones/storage/cachés efectivos | PENDIENTE | Separación física y normalización offline; falta validación de resolución en aplicación. |
| Ausencia de fallback a desarrollo | PENDIENTE | No hay loader/guard implementado. Plantillas no deben cargarse parcialmente. |
| Efectos externos/cola | PENDIENTE | Drivers propuestos; jobs y conexiones deben revisarse antes de ejecución. |
| Cypress/proxy/Sanctum/Origin efectivos | PENDIENTE | No hay procesos test ni sesión real; specs conservan dependencia 5173. |
| Limpieza/parada | PENDIENTE | Manifest solo plantilla; no existen scripts/identidades de instancia que permitan autorizar limpieza o shutdown. |
| Inicializar MySQL/crear base/usuarios | BLOQUEADO en esta fase | Prohibidos por prompt 03, además de ACL/guards/opciones pendientes. |
| Migraciones/seeders/Pest/Cypress real | BLOQUEADO | Aislamiento runtime/grants y autorización de escritura no acreditados. |

## 9. Comandos ejecutados y verificación documental

Se ejecutaron únicamente estas clases de operaciones:

1. Git: branch/status/rev-parse, check-ignore y comprobaciones de diff; lectura de documentos.
2. PHP portátil `--version`, `--ini`, `-m`; PHP portátil con Composer PHAR `--version`; mysqld/mysql `--version`.
3. Test-Path/Get-Item/Resolve-Path y normalización de rutas, inspección de Attributes/LinkType y Get-Acl. No se ejecutó Set-Acl ni se cambiaron permisos de desarrollo.
4. Get-NetTCPConnection/Get-CimInstance; primer intento restringido fallido y repetición de solo lectura satisfactoria fuera del sandbox. Solo se imprimieron puertos/PIDs/rutas y flags de opciones seleccionados; no comandos completos con posibles secretos.
5. Bind exclusivo temporal de tres sockets, cerrados en finally sin Listen. No se conectó a MySQL ni se lanzó un servidor.
6. New-Item para carpetas **solo si no existían**, tras validación de raíz y subrutas. No se usó sobrescritura ni eliminación.
7. Creación de seis archivos nuevos de plantilla; parseo JSON, inspección de flags false, conteo de datadir vacío y normalización de las diez rutas de caché.
8. Copia íntegra del adjunto al prompt 03 y creación de este registro; comparación de hash y comprobación de formato al terminar.

Pruebas de integración ejecutadas: **0**. El error inicial de inventario CIM no es una prueba funcional fallida; la repetición acredita la observación de metadatos indicada. No se atribuyen aprobaciones de conexión SQL, login ni pruebas a lecturas de plantilla.

## 10. Bloqueadores y siguiente operación segura

Antes de solicitar inicialización: revisar ACL únicamente del contenedor nuevo para proteger futuros secretos/logs, resolver opciones de MySQL X y generar/revisar un guard de identidad/rutas/configuración que falle cerrado. Confirmar nuevamente puertos y la inexistencia de datos/links ajenos. Los scripts del plan siguen siendo propuestas; esta fase solo permite plantillas y no los implementó.

Una fase posterior expresamente autorizada podrá convertir las plantillas revisadas en configuración operativa y **después** inicializar solo el datadir nuevo; no debe arrancar la instancia compartida para suplirlo. Tras la inicialización: acreditar proceso y @@datadir/puerto, crear credenciales exclusivas de forma privada, verificar grants/esquema con cuenta restringida y validar los dos perfiles Laravel. Solo entonces considerar migraciones y datos sintéticos, con otra autorización de alcance y guards completos.

Si cambian rutas/puertos, aparece un reparse point, un recurso deja de ser propio o no puede comprobarse su identidad, detener sin borrar ni sobrescribir. No se proporcionó ni ejecutó limpieza de bases existentes.

**Resultado: REQUIERE AJUSTES, con preparación física no destructiva realizada. No está PREPARADO PARA INICIALIZACIÓN AISLADA todavía y las pruebas reales no están habilitadas.** No se afectaron bases, servicios de desarrollo ni Bolts previos.
