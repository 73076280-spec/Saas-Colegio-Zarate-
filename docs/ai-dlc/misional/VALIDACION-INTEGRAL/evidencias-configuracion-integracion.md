# Configuración aislada de Laravel, Pest y Cypress — Prompt 12

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama: `test/integracion-misional`. HEAD inicial: `a3022d0` (`docs(qa): registrar base y usuario MySQL aislados`). Git inicialmente limpio.

**Resultado: CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES.** Se prepararon y resolvieron mediante los bootstrappers reales de Laravel dos perfiles privados, Pest y HTTP, con destinos exclusivos y credencial restringida. Las guardas rechazaron configuraciones heredadas peligrosas. **La conexión PDO se bloqueó antes de SQL:** el certificado existente no identifica a 127.0.0.1. También siguen pendientes los adaptadores de ejecución de Pest/HTTP y la coherencia de los orígenes de Cypress.

No se arrancaron MySQL, Laravel HTTP ni Vite. No se ejecutaron SQL, migraciones, seeders, Pest o Cypress. **Las pruebas reales no están habilitadas.** El éxito SQL del cliente VERIFY_CA en Prompt 11 no se presenta como una conexión PDO/Laravel verificada hoy.

## 1. Fuentes revisadas y alcance

Se revisaron íntegramente en esta conversación `diagnostico-entorno.md`, `plan-aislamiento.md`, `evidencias-correcciones.md` y `evidencias-base-usuario.md`. Se contrastó Git para verificar conservación de los documentos previos y se inspeccionaron las plantillas locales existentes.

Fuentes funcionales leídas, sin modificación: `backend/bootstrap/app.php`, `backend/config/database.php`, `session.php`, `filesystems.php`, `logging.php`, `services.php`, `auth.php`, `permission.php` y `cors.php`; `backend/phpunit.xml`, `tests/Pest.php`, `tests/TestCase.php`, tests de conexión/salud, migraciones y referencias a transacciones; `AppServiceProvider.php`, `ResolveInstitution.php`, `AuthService.php` y `routes/console.php`. Frontend/E2E: `frontend/vite.config.ts`, `frontend/src/api/client.ts`, `e2e/cypress.config.ts`, `e2e/scripts/run-cypress.cjs` y cabeceras de specs existentes.

Se contrastaron también las implementaciones instaladas de Application, LoadEnvironmentVariables, LoadConfiguration, el TestCase base de Laravel y PhpHandler de PHPUnit. No se ejecutaron proveedores, kernels HTTP/consola ni pruebas para inspeccionarlos.

## 2. Perfiles Laravel preparados

Los perfiles se guardaron exclusivamente bajo `.tools/misional-isolated/evidence/prompt12`, sin activar o cambiar `.env` del proyecto. Comparten:

| Configuración | Valor propuesto y resuelto offline |
| --- | --- |
| Laravel/PHP | Laravel **13.34.0** instalado, PHP portable **8.4.26** |
| APP_ENV / APP_DEBUG | **testing / false** |
| Conexión | **mysql**, host **127.0.0.1**, puerto **3308** |
| Base / principal | **zarate_test / zarate_test**; nunca root |
| Credencial | Leída del recurso privado de Prompt 11; no incluida en perfiles JSON ni argumentos |
| DB_URL / socket | Vacíos explícitamente, sin redirección implícita |
| Charset/collation | utf8mb4 / utf8mb4_unicode_ci |
| APP_KEY | Clave nueva privada por perfil, separada del código y de la clave de desarrollo |
| APP_URL / FRONTEND_URL | http://127.0.0.1:8001 / http://127.0.0.1:5174 |
| Caché | array |
| Cola / fallos | null / null, sin ejecución de jobs por el driver seleccionado |
| Correo | array, sin SMTP |
| Discos seleccionados | local, public, avatars y materials, todos con roots privados |
| Sanctum / CORS propuestos | 127.0.0.1:5174 / origen http://127.0.0.1:5174 con credenciales |

| Recurso | Pest | HTTP |
| --- | --- | --- |
| Sesiones | array | file |
| Storage | `.tools/misional-isolated/storage-pest` | `.tools/misional-isolated/storage-http` |
| Bootstrap caches | `bootstrap-pest` | `bootstrap-http` |
| Sesiones/vistas/log | Subdirectorios privados del storage Pest | Subdirectorios privados del storage HTTP |
| Clave | Recurso privado propio | Recurso privado propio |

Cookie HTTP: `misional_isolated_session`, dominio host-only, SameSite=lax y secure=false para el HTTP local previsto. Esto es configuración, **no una prueba de sesión multi-request**. La cookie XSRF y el perfil del navegador aún requieren comprobación operativa.

Las rutas APP_*_CACHE son relativas al basePath backend y se normalizaron a directorios exclusivos; se conserva la consideración Windows del framework, que no reconoce todas las rutas con letra de unidad igual que una absoluta Unix. No se usó config:cache/config:clear ni se generó un archivo de caché de configuración con secretos.

## 3. Loader local y comprobación efectiva offline

`Loader12.php` es un **lanzador diagnóstico cerrado**, no un wrapper de Artisan, Pest o servidor HTTP. Solo admite perfiles pest/http y modos offline/connection. No acepta comandos arbitrarios, migraciones o seeders. No exporta variables al proceso padre: ejecutar este diagnóstico y después Artisan/Pest en otra terminal **no configura ese segundo proceso**.

Antes de resolver configuración:

1. Comprueba perfil, entorno, host/puerto/base/principal exactos, referencias a credencial y clave privadas y ausencia de autorizaciones de escritura/tests/HTTP.
2. Rechaza variables heredadas ambiguas o distintas de los valores aislados, incluidas credenciales y destinos de servicios externos. No imprime valores.
3. Inyecta únicamente los valores del perfil en el proceso PHP dedicado y selecciona un archivo de entorno exclusivo y vacío como barrera; no carga backend/.env ni backend/.env.testing.
4. Rechaza una caché de configuración ya generada en el destino antes de cargarla. Redirige storage y los cinco caches de arranque a los perfiles privados.
5. Ejecuta **LoadEnvironmentVariables y LoadConfiguration reales**, sin RegisterProviders, BootProviders o kernels. La configuración efectiva del repositorio se inspecciona sin arrancar la aplicación completa ni abrir conexiones.

Dentro de ese repositorio de configuración temporal se mantiene únicamente la conexión SQL mysql, se retiran conexiones Redis y discos remotos no utilizados y se limita el transporte de cola/correo al perfil nulo/array. Se eliminan enlaces de filesystem hacia public/storage compartido y se añade explícitamente la verificación estricta del certificado PDO. Son cambios solo en memoria del diagnóstico aislado, sin escribir backend/config ni alterar roles, permisos o lógica de negocio.

Se verificaron las rutas resueltas de storage, sesiones, vistas, log, cuatro discos y config/packages/services/routes/events caches. **Los dos perfiles aprobaron con salida 0**, manteniendo providersBooted=false, sqlConnections=0, pestReady=false y cypressReady=false. No se presenta ese resultado como un boot HTTP completo o una autenticación de aplicación.

`Check12.ps1` verifica además rama, configuración MySQL inalterada, procesos/puerto, propietarios, ACL, reparse points, hardlinks y snapshots protegidos antes de invocar el diagnóstico. La inspección final registró **405 objetos** del contenedor. No se usa la condición de datadir vacío para una instancia ya inicializada.

## 4. TLS: bloqueo demostrado antes de conectar

El análisis offline del certificado y del runtime produjo:

| Control | Resultado |
| --- | --- |
| PDO_MYSQL disponible | Sí |
| Opción de CA y SSL_VERIFY_SERVER_CERT | Disponibles |
| Firma del certificado por la CA local | Válida |
| Fechas del certificado | Vigentes |
| Subject Alternative Name | Ausente |
| IP SAN 127.0.0.1 | Ausente |
| Coincidencia de identidad con 127.0.0.1 | **No** |
| Verificación estricta PDO en el perfil | **true**, no se desactivó |
| Conexiones SQL de esta comprobación | **0** |

El cliente de Prompt 11 utilizó VERIFY_CA, que verifica emisor y cifrado, pero no hostname. No se equipara a VERIFY_IDENTITY o a una conexión PDO con verificación de nombre. MySQL documenta que los certificados autogenerados no contienen el nombre requerido para esa validación. Referencias: [modos TLS de MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/connection-options.html) y [opciones PDO MySQL](https://www.php.net/manual/en/class.pdo-mysql.php).

`Tls12.php` devolvió salida **20**, y el modo connection del loader devolvió **CONNECTION_BLOCKED_TLS**, salida **20**, antes de cualquier intento PDO. No fue un fallo de autenticación real ni se obtuvo un error de conexión del servidor: **no se abrió una conexión**. No se rebajó el requisito SSL de la cuenta, se cambió la contraseña, se regeneraron certificados o se copiaron claves TLS.

La fase de conexión real se omitió conforme a la condición del prompt: faltan guardas TLS aprobadas. MySQL permaneció detenido. El loader también mantiene cerrada una conexión futura hasta disponer de orquestación de identidad en vivo revisada; no es un ejecutor de SQL listo para usar tras cambiar un archivo.

## 5. Controles ejecutados y resultados exactos

| Caso | Código y resultado |
| --- | --- |
| Resolución de perfil Pest | **0**, configuración offline aprobada |
| Resolución de perfil HTTP | **0**, configuración offline aprobada |
| Modo conexión estricta | **20**, bloqueo TLS esperado, no aprobación de conexión |
| APP_ENV heredado production | **21**, rechazado antes del framework |
| DB_DATABASE heredada zarate_dev | **21**, rechazada |
| DB_PORT heredado 3307 | **21**, rechazado |
| DB_USERNAME heredado root | **21**, rechazado |
| APP_CONFIG_CACHE heredada hacia backend/bootstrap/cache | **21**, rechazada |
| Perfil desconocido | **21**, rechazado antes de cargar perfiles/credenciales |

La ejecución final del verificador a las **11:36:30 -05:00** terminó con salida **0** porque los dos controles positivos y los seis rechazos negativos se comportaron como se esperaba. El control de conexión queda explícitamente BLOQUEADO; la salida del verificador no habilita pruebas ni convierte el 20 de TLS en conexión aprobada. No se suman reejecuciones como casos nuevos.

Se conservan dos incidencias de diagnóstico:

- La primera ejecución del verificador terminó con salida **1** al leer `.force` en un nodo PHPUnit sin ese atributo bajo StrictMode. Se registró `validation-first-attempt.json`, se corrigió la lectura mediante GetAttribute y se repitió la verificación de lectura; no hubo servicios o SQL.
- Una comprobación auxiliar final envolvió incorrectamente el array devuelto por ConvertFrom-Json y denunció una diferencia de inventario. La lectura corregida confirmó **311 objetos originales y 311 actuales**, con los **303 archivos** protegidos intactos por contenido y metadatos. No fue una modificación real del desarrollo ni se repararon recursos para forzar coincidencia.

Son validaciones de infraestructura y configuración, **no casos Pest/Cypress**.

## 6. Pest, PHPUnit y precedencias pendientes

`backend/phpunit.xml` fuerza APP_ENV=testing, mysql, base/principal zarate_test, DB_URL vacía y sesiones/caché array, pero no host/puerto. Además fuerza SANCTUM_STATEFUL_DOMAINS con hosts de **5173**, diferente del perfil preparado a 5174. Se comprobó esa precedencia leyendo la configuración y PhpHandler de PHPUnit; no se ejecutó el runner.

Esto requiere una decisión explícita de perfiles: el origen simulado de pruebas internas Pest puede diferir del navegador HTTP real. No se declara que el valor 5173 sea por sí solo un defecto del sistema ni se propone ampliar CORS para ocultarlo. Un eventual XML local de pruebas, con bootstrap y rutas absolutos, deberá respetar los contratos existentes y revisar esa diferencia antes de usarse.

El TestCase del proyecto hereda sin personalización de Laravel; el TestCase instalado crea una nueva Application y arranca el kernel. **El perfil diagnóstico actual no garantiza por sí solo esa nueva instancia.** Falta un adaptador local que aplique las guardas y el entorno exclusivo a cada creación de Application, antes de proveedores y traits de base. No se autoriza usar el phpunit.xml actual directamente tras ejecutar el diagnóstico en otro proceso.

Los Sprints 1–10 y AvatarTest usan DatabaseTransactions, no RefreshDatabase en las pruebas propias inspeccionadas. Las transacciones necesitan esquema y pueden empezar antes de un beforeEach de prueba; no protegen una conexión equivocada ni revierten archivos o todo DDL. Factories y seeders escriben; el esquema sigue sin migrar y las suites académicas no están preparadas para ejecutarse.

`composer test` incluye config:clear antes del runner y no se utilizó. Tampoco se invocaron migrate, migrate:fresh, refresh, db:wipe, seeders, SQLite o una base en memoria como sustitutos de MySQL.

## 7. Vite, Cypress, autenticación y multiinstitución

Diseño guardado en `browser-plan.json`, **no ejecutado**: MySQL 127.0.0.1:3308, backend HTTP 8001 y Vite 5174 con host loopback y strictPort. API_PROXY_TARGET y CYPRESS_BASE_URL apuntan exclusivamente a los destinos aislados previstos.

Hallazgos del código real:

- Vite sigue declarando host 0.0.0.0 y puerto 5173; su proxy usa API_PROXY_TARGET o fallback 8000. El futuro lanzamiento deberá controlar host/puerto/strictPort y exigir proxy explícito, sin modificar desarrollo.
- Cypress usa CYPRESS_BASE_URL o localhost:5173. Cambiar esa variable no reescribe Origin/Referer fijos en auth, enrollment, courses, classroom, learning, attendance, office, reports, virtual y otros specs.
- El cliente frontend usa cookies, X-XSRF-TOKEN y credentials=include. CORS permite credenciales y usa FRONTEND_URL; Sanctum necesita el host/puerto efectivo. Cookie propia y puerto distinto no sustituyen un perfil de navegador separado ni probar dos solicitudes autenticadas sucesivas.
- Hay specs con API simulada y con backend real. cy.request no queda simulado por cy.intercept; un intercept sin respuesta es observación. No se ejecutó Cypress ni se certificó un allowlist de todo el tráfico del harness.
- AuthService consulta institución y usuario y escribe last_login_at/auditoría al iniciar sesión. Login no es una comprobación inocua de lectura. ResolveInstitution valida estados, contexto y sesión; se revisó por código, no con usuarios o instituciones reales.

Cambios mínimos propuestos para otra fase: adaptador local HTTP de arranque con guardas; perfil Vite con proxy obligatorio y puertos fijados; harness Cypress con origen dinámico correcto y protección de destinos antes de autenticar; revisión separada de los headers internos de Pest. No se modificaron specs, permisos o frontend/backend, ni se inició otro Vite.

## 8. Seguridad, almacenamiento y efectos externos

Se verificó la resolución de todos los destinos privados y se bloquearon conexiones SQL secundarias/discos remotos en el repositorio temporal del diagnóstico. Cola null y correo array no instanciaron transportes; no se ejecutó scheduler ni jobs. routes/console.php solo define el comando inspire en el código inspeccionado.

**La ausencia de efectos externos de toda la aplicación no está acreditada:** no se arrancaron proveedores, no se probaron todos los canales ni se auditó cada futura ruta. La ejecución completa deberá revisar callbacks, clientes externos y conexiones efectivas antes de autorizar casos con escritura. No se considera que cambiar un driver cree por sí solo un sandbox de red.

El snapshot final a las **11:40:41 -05:00** confirmó:

- 0 procesos MySQL/cliente y 0 listeners candidatos en 3308, 8001 y 5174.
- 0 archivos generados en bootstrap-pest y bootstrap-http.
- 0 archivos generados en storage-pest y storage-http; claves y diagnósticos nuevos están en evidence/prompt12.
- Desarrollo conservado: 303 archivos protegidos y cuatro configuraciones intactos, según comparaciones del verificador. No se detuvieron servicios ajenos.

No se activaron plantillas existentes ni se trasladaron claves a Git. La contraseña de pruebas sigue en su recurso privado del Prompt 11; los perfiles JSON solo lo referencian. Las APP_KEY nuevas se guardan en recursos privados distintos por perfil y no en scripts.

## 9. Archivos locales creados

Todo permanece bajo `.tools/misional-isolated/evidence/prompt12` e ignorado por Git:

- `PrepareProfiles12.php`, `profile-pest.json`, `profile-http.json`, archivos de entorno guard y dos recursos privados APP_KEY.
- `Tls12.php`, `tls-offline.json`.
- `Loader12.php`, `Check12.ps1` y fuente de verificaciones `Validation12.ps1`.
- Informes offline por perfil, bloqueo de conexión, seis diagnósticos negativos, primer fallo XML, resultados finales y snapshot de servicios/storage/cachés.
- `browser-plan.json`, diseño de destinos sin servidor ni navegador lanzados.
- Auditor de secretos local e informe saneado de su resultado.

Únicos documentos nuevos destinados a Git: `prompt-12-configuracion-integracion.md`, copia íntegra del adjunto, y este informe. No se modificaron Bolts anteriores, código funcional, migraciones, .env, phpunit o configuración Vite/Cypress activa. No se hicieron commits, push, merge ni PR.

Auditoría final local: **26 archivos** comprobados, incluidos los dos documentos, con **0 apariciones de secretos fuera de sus recursos dedicados**; las dos APP_KEY son distintas. No se imprimieron credenciales, claves ni hashes de autenticación. El prompt coincide por SHA-256 con el adjunto. `git diff --check` y la comprobación adicional de los documentos nuevos no detectaron errores; solo hubo aviso CRLF/LF del prompt. Los recursos privados siguen ignorados y no versionados. Git muestra únicamente los dos documentos nuevos y HEAD permanece en `a3022d0`.

## 10. Bloqueadores y próxima verificación segura

1. **TLS estricto:** preparar en una fase controlada un certificado válido para la IP/hostname que realmente usará PDO, conservando autenticidad y requisito SSL. No proponer verify_server_cert=false ni alternar silenciosamente a otro host.
2. **Conexión Laravel:** después de TLS y guardas de instancia viva revisadas, autorizar MySQL aislado y verificar con el mismo perfil/connector Laravel solo lecturas de identidad, DATABASE(), CURRENT_USER(), TLS y estado vacío del esquema. Esa comprobación está NO EJECUTADA hoy.
3. **Adaptadores Pest/HTTP:** aplicar el perfil completo a cada Application y revisar precedencias antes de permitir kernels y pruebas. No usar config:cache compartido o una conexión administrativa.
4. **Vite/Cypress:** fijar proxy y puertos, resolver headers/orígenes y verificar cookies/sesión y destinos. Diseño estático no equivale a proxy o tráfico efectivo aprobado.

Primera comprobación real recomendada tras resolver esos bloqueos: lectura mínima por Laravel de la identidad/conexión restringida, sin fixtures ni migraciones. Después, con autorización separada, HealthTest y la selección mínima de conexión, revisando que el caso negativo existente sobre desarrollo se interprete correctamente en la instancia nueva. Las suites académicas requieren primero esquema y fixtures sintéticos autorizados.

**Estado final: CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES.** Configuración offline: 2 perfiles aprobados y 6 guardas negativas comprobadas. TLS/conexión: BLOQUEADO. **0 consultas SQL, 0 servicios iniciados, 0 migraciones/seeders y 0 casos Pest/Cypress ejecutados en esta fase.**
