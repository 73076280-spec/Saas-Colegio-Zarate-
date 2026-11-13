# Validación integral misional — Verificación offline de seguridad

Fecha: 02/11/2026. Rama: `test/integracion-misional`. HEAD: `eae9e4a`. Git inicialmente limpio. Se contrastaron diagnóstico, plan, evidencias de preparación, prompt 03 y las seis plantillas locales. Prompt actual íntegro: [prompt-04-verificacion-seguridad.md](prompt-04-verificacion-seguridad.md).

**Decisión: REQUIERE AJUSTES. Inicialización y escrituras: BLOQUEADAS.** La separación de directorios está acreditada offline, pero las ACL permiten acceso amplio, falta un directorio temporal MySQL exclusivo y la plantilla no desactiva X Plugin explícitamente. Las guardas están diseñadas, no implementadas ni acreditadas en ejecución. No puede garantizarse todavía un futuro arranque seguro basándose solo en estas plantillas.

Únicos archivos creados en esta fase: este informe y el prompt 04. **No se modificaron ACL, propietarios, carpetas, plantillas, .env, código, pruebas o documentos anteriores.** No se ejecutó MySQL salvo `--version`, ni se inicializó, arrancó, conectó SQL, migró, sembró, instaló o ejecutó pruebas reales. No se detuvieron servicios ni se hicieron commits, push, merge o PR.

## 1. Estado Git y recursos locales

`git ls-files -- .tools/misional-isolated` no devuelve archivos versionados. La regla existente `.gitignore:1:.tools/` ignora el contenedor, confirmada con `git check-ignore -v`. No hay archivos no ignorados dentro de él según `git ls-files --others --exclude-standard`. Las seis plantillas son archivos locales ignorados, no secretos preparados para publicación; no se forzó su seguimiento.

Se mantienen **31 carpetas, raíz incluida, y 6 plantillas**. No hay configuración operativa ni script launcher/guard. `mysql-data` conserva **0 entradas** incluidas ocultas. El manifest sigue declarando initialized/running/grantsVerified/runtimeConfigurationVerified/privateAclApproved/guardsImplemented/writesAuthorized en false. Esos flags no son evidencia de aislamiento efectivo: solo evitan confundir el diseño con una habilitación.

Documentos anteriores y código quedan conservados. El nuevo prompt se copia del adjunto sin resumir; se comprueba su integridad mediante hash al finalizar.

## 2. Rutas y equivalencia física

| Recurso | Ruta verificada / estado |
| --- | --- |
| MySQL de desarrollo configurado | `D:\zarate-saas\.tools\mysql-local.ini`; datadir `D:\zarate-saas\.tools\mysql-data`, puerto 3307. Archivo leído solo en claves no sensibles. No es identificación SQL de una instancia activa. |
| Binario MySQL compartido, solo lectura | `D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe`, **8.4.11** mediante `--version`. Compartir binario no exige compartir configuración/datadir. |
| PHP portátil | `D:\zarate-saas\.tools\php\php.exe`; ini `.tools\php\php.ini`, ya acreditados 8.4.26 en preparación. No se usó PHP de PATH. |
| Contenedor nuevo | `D:\zarate-saas\.tools\misional-isolated`. |
| Datadir test | Contenedor + `mysql-data`, existente y vacío. |
| Opciones test | Contenedor + `mysql.ini.template`; no hay `mysql.ini` operativo. |
| Logs/PID test | Contenedor + `logs` / `pids`, existentes; archivo futuro bajo cada ruta, todavía inexistente. |
| Temporales MySQL | **No existe `tmp` propio** ni `tmpdir` en plantilla: destino exclusivo BLOQUEADO hasta corregirlo en otra fase. No se aprueba el temporal del sistema. |
| Laravel protegido | `D:\zarate-saas\backend\storage`; no se toca. |
| Laravel test | Contenedor + `storage-pest` y `storage-http`, con sesiones/cache/archivos propios preparados. |
| Cachés de arranque test | Contenedor + `bootstrap-pest` y `bootstrap-http`; rutas de APP_*_CACHE normalizadas offline desde el basePath backend. |

Se inspeccionaron atributos de ancestros hasta `D:\`, de ambas rutas protegidas y de todos los descendientes del contenedor: **0 reparse points**, sin LinkType/junction observado. Las rutas normalizadas no coinciden ni son ancestros/descendientes de las protegidas. `fsutil hardlink list` mostró **un solo nombre, dentro del contenedor, por cada una de las seis plantillas**; no se encontró alias físico de ellas hacia otro archivo. Las carpetas no son enlaces y no se siguieron junctions para validar el destino.

Esto acredita la foto actual, no impide que un usuario con permisos amplios altere un archivo o cree un enlace después. El guard debe repetir la comprobación inmediatamente antes de cualquier operación futura y rechazar cambios desde la aprobación. Las rutas futuras que aún no existen no reciben aprobación física anticipada.

## 3. ACL actuales: quién puede acceder

Se inspeccionaron con Get-Acl **37 objetos** (31 carpetas y 6 archivos): **0 DACL protegidas frente a herencia y 0 ACE explícitas**. La raíz y los perfiles heredan permisos del repositorio/disco. No se ejecutó Set-Acl ni icacls de modificación.

| Principal observado | SID o identificación | Permiso de la DACL heredada | Evaluación |
| --- | --- | --- | --- |
| SYSTEM | `S-1-5-18` | FullControl | Administración local esperable; mantener solo si se aprueba esa frontera de confianza. |
| Administradores | `S-1-5-32-544` | FullControl | Administración local; una ACL no protege frente a un administrador que pueda tomar control. |
| Usuarios autenticados | `S-1-5-11` | Modify/Synchronize | **Excesivamente amplio para secretos y configuración de arranque**: incluye capacidad de modificar, no solo leer. |
| Usuarios | `S-1-5-32-545` | ReadAndExecute/Synchronize | Lectura amplia, incompatible con tratar logs/credenciales futuros como privados. |
| Grupo local CodexSandboxUsers | SID local terminado en `-1005` | Modify/Synchronize | Acceso de herramientas; no equivale a una cuenta exclusiva de ejecución test. Revisar necesidad antes de ACL privada. |
| Tres SIDs adicionales | Terminaciones `-1379783154`, `-3086801282`, `-2339124019` | Modify/Synchronize | No se pudieron resolver a nombres. No se inventan identidades ni se dan por cuentas de pruebas autorizadas. |

Las tres traducciones de SID fallaron; se repitió la enumeración conservando cada SID con estado NO_RESUELTO, evitando atribuirle el nombre de otra regla. Esta dificultad de resolución no borra su ACE ni prueba ausencia de acceso. El listado es de permisos de DACL: no es una enumeración de todos los miembros de grupos ni una prueba de acceso efectivo de cada usuario.

**Riesgo confirmado de diseño:** las ACL no son privadas para generar claves o el log de inicialización. Además de divulgar secretos futuros, un permiso amplio de modificación permite alterar datadir/opciones entre revisión y uso. Actualmente no hay secretos reales en las plantillas ni evidencia de acceso indebido; el riesgo no se presenta como una filtración ya ocurrida.

La restricción puede aplicarse únicamente al contenedor aislado y descendientes, manteniendo el propietario y sin tocar `D:\zarate-saas`, `.tools` o recursos de desarrollo. La cuenta Windows de ejecución debe identificarse y aprobarse primero; no es la misma identidad que el usuario MySQL. No se creó una cuenta local ni se decidió automáticamente qué SID conservar.

### Corrección de ACL propuesta — NO EJECUTADA

Comandos específicos para una fase posterior autorizada. Se verificó la sintaxis de `/grant:r`, SID numérico con `*` e `/inheritance:r` en la ayuda local de icacls. No usar `/T` sobre el repositorio, `/reset`, `/setowner`, comodines de ruta ni denegaciones generales.

```powershell
# PROPUESTA, NO EJECUTAR EN ESTA FASE.
$isolatedRoot = 'D:\zarate-saas\.tools\misional-isolated'
$expectedRoot = [IO.Path]::GetFullPath($isolatedRoot)
if ((Resolve-Path -LiteralPath $isolatedRoot).ProviderPath -ne $expectedRoot) {
    throw 'Ruta distinta del contenedor revisado'
}
# Repetir guard de TODOS los ancestros/reparse points, hardlinks y DACL actuales.
# Mantener copia privada del descriptor previo y comprobar propietario, sin cambiarlo.
$testSid = '__SID_WINDOWS_DE_EJECUCION_VALIDADO__'
if ($testSid -notmatch '^S-1-5-21-\d+-\d+-\d+-\d+$') {
    throw 'Falta seleccionar y aprobar la identidad de ejecucion'
}
$null = ([Security.Principal.SecurityIdentifier]::new($testSid)).Translate(
    [Security.Principal.NTAccount]
)
$icacls = Join-Path $env:WINDIR 'System32\icacls.exe'
# Primero conservar acceso explicito de la identidad aprobada y administracion.
& $icacls $isolatedRoot /grant:r "*$($testSid):(OI)(CI)M" '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-544:(OI)(CI)F'
if ($LASTEXITCODE -ne 0) { throw 'No se pudo establecer la allowlist explicita' }
# Solo si la relectura confirma exactamente las ACE explicitas esperadas:
& $icacls $isolatedRoot /inheritance:r
if ($LASTEXITCODE -ne 0) { throw 'No se pudo retirar la herencia amplia' }
```

La propuesta requiere un guard completo, no solo Resolve-Path, y relectura entre operaciones. El marcador hace que el ejemplo falle sin identidad aprobada. Se plantea Modify para el ejecutor y FullControl para SYSTEM/Administradores; no dar FullControl a grupos amplios por comodidad. Si PHP/MySQL/automatización usan otras identidades, deben aprobarse de manera individual antes del cambio o se bloquearán; no sustituirlas por Usuarios autenticados.

Después: revisar todos los objetos, confirmar que desaparecieron las concesiones amplias y que no hay ACE explícitas ajenas/DACL protegidas inesperadas; probar lectura/escritura del ejecutor **solo en un archivo temporal nuevo del contenedor**, con autorización futura, y denegación para un principal no autorizado sin usar secretos reales. Verificar propietario y ACL de desarrollo sin cambios. Si la propagación es incompleta o el operador pierde acceso, detener y restaurar el descriptor previo solo del contenedor mediante procedimiento revisado, no reparar permisos del disco/repositorio.

## 4. Plantilla MySQL y compatibilidad 8.4

Se leyó `mysql.ini.template` sin modificarla. Declara correctamente puerto candidato 3308, bind loopback, basedir real, datadir exclusivo y rutas de log/PID propias. No define `tmpdir`, X Plugin, named pipe/shared memory, secure_file_priv o carga de variables persistidas. No contiene include activo, credenciales ni SQL.

Se consultó documentación **oficial de MySQL 8.4**, no se extrapoló una opción de 5.7/8.0. No se ejecutaron `--verbose --help`, `--validate-config` ni otra vía que pudiera arrancar componentes del servidor. `--version` verifica el binario, no valida un ini efectivo.

### Ajustes de opciones propuestos, todavía no aplicados

```ini
# FRAGMENTO PROPUESTO; NO ES CONFIGURACION ACTIVA.
# Solo dentro del futuro [mysqld] exclusivo ya revisado.
tmpdir=D:/zarate-saas/.tools/misional-isolated/tmp
mysqlx=0
named-pipe=OFF
shared-memory=OFF
persisted-globals-load=OFF
secure-file-priv=NULL
```

- `mysqlx=0`/`--skip-mysqlx` están documentados para desactivar X Plugin en 8.4. La plantilla actual solo tiene un comentario pendiente y **no lo desactiva**. Proponer desactivarlo evita un listener X innecesario; no se utiliza un valor de puerto clásico como sustituto del control X. [Manual 8.4: desactivar X Plugin](https://dev.mysql.com/doc/refman/8.4/en/x-plugin-disabling.html).
- Si X permanece activo, su listener y bind son independientes; deben acreditarse expresamente, no deducirse del puerto 3308. Esta aplicación no necesita Document Store y no hay justificación para habilitarlo en el perfil. [Opciones X Plugin 8.4](https://dev.mysql.com/doc/refman/8.4/en/x-plugin-options-system-variables.html).
- Named pipe y shared memory son opciones Windows, desactivadas por defecto, pero se propone explicitarlas. `tmpdir` fija temporales; `persisted-globals-load=OFF` evita cargar configuración persistida; `secure-file-priv=NULL` deshabilita importación/exportación por archivos. Son controles propuestos, **no efectivos ahora**. El directorio temporal nuevo debe existir y tener ACL revisada antes de uso. [Variables de servidor MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/server-system-variables.html).

No se creó `tmp` ni se cambió la plantilla en esta fase. Su ausencia **bloquea la aprobación de temporales exclusivos**. Al preparar configuración operativa se revisarán además todos los destinos de logs/binlog/archivos InnoDB/persistidos y entorno TMP/TEMP: no basta asumir que una ruta por defecto queda dentro. No se modifican TMP/TEMP globales del equipo.

### Archivo de opciones y defaults

La ejecución futura deberá rechazar la falta del ini operativo exacto, argumentos que anulen datadir/port y directivas include no aprobadas. `--defaults-file` lee el archivo indicado y falla si falta; no debe sustituirse por defaults-extra-file, que mezcla opciones. Hay excepciones de configuración persistida del servidor y login paths de clientes, que requieren control específico. [Opciones de carga MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/option-file-options.html).

Los include pueden introducir otros archivos; el guard deberá rechazarlos o validar toda la cadena y sus hashes, sin aceptar directorios arbitrarios. No debe imprimirse `--print-defaults` de archivos que puedan contener contraseñas. [Archivos de opciones MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/option-files.html).

Si falta port/datadir/tmpdir en la configuración aprobada, **el guard debe fallar antes de invocar mysqld**, aunque el servidor pueda usar defaults válidos para su funcionamiento. No se permite que la ausencia se resuelva silenciosamente hacia configuración compartida. Con TCP explícito y named pipe/shared memory/X desactivados no se depende de nombres globales como MYSQL. Confirmar todos los listeners después del arranque futuro seguirá siendo necesario.

## 5. Guardas: diseño de cierre seguro, no un ejecutor implementado

No se creó script adicional: las lecturas disponibles bastaron para identificar los bloqueos y aún falta corregir/autorizar ACL y opciones. Se evita dejar una herramienta que parezca habilitar operaciones por un resultado parcial. Ninguna guarda propuesta puede migrar, limpiar, crear datos ni arrancar servicios automáticamente.

Se define una salida de diagnóstico estructurada con control, evidencia, resultado y motivos, sin secretos; código no cero ante cualquier condición de bloqueo. Un eventual guard de solo lectura separará:

| Etapa | Verificación efectiva exigida | Detención |
| --- | --- | --- |
| Offline, previa a inicialización | Identidad Windows autorizada; ACL, ruta fija y archivo real, sin reparse/hardlinks ajenos; hashes/ini con allowlist; datadir vacío; puertos sin ocupante y opciones completas. | Cualquier duda, missing key, include, ruta nueva no acreditada o cambio desde la revisión produce bloqueo. |
| Perfil Laravel, todavía sin negocio | Cargar todos los campos desde perfil exclusivo, rechazar marcadores, tipos/duplicados y overrides heredados; comparar rutas efectivas y APP_ENV. No rellenar errores con .env de desarrollo. | Perfil incompleto, APP_ENV distinto, DB_URL no aprobada, puerto no 3308 o destino zarate_dev/otro esquema bloquean. |
| Después de instancia, fase posterior autorizada | Principal y grants/roles, identidad de servidor, puerto/datadir real, esquema y procedencia sintética; sin privilegios hacia desarrollo. | El nombre del esquema por sí solo nunca habilita migración. Estas comprobaciones no se ejecutan ni aprueban ahora. |
| Antes de cada migración/test real | Revalidar proceso/PID/binario/config/grants/rutas y estado del esquema. Token de aprobación ligado a hash/config/corrida, de corta duración; no confiar solo en un flag editable del manifest. | Diferencia o recurso no propio bloquea, sin fallback ni reparación destructiva. |
| HTTP/Vite/Cypress, fase posterior | PID/config Laravel aislados, proxy efectivo de API/Sanctum y origen exacto, sesión/cookie propias; lista de destinos de tráfico y de cuentas sintéticas. | Cualquier tráfico a 8000/5173 de desarrollo o cuenta/institución no preparada detiene la selección. |

**Identidad e institución:** antes de crear una DB no hay institución de prueba que pueda verificarse. Tras fixtures autorizadas deberá existir un inventario de IDs y cuentas sintéticas asociado a la corrida; el guard HTTP compara la identidad devuelta y su institución con ese inventario, sin publicar datos personales. No se propone inventar un usuario del colegio ni considerar test a todo usuario con un nombre conocido.

**Efectos externos:** correo array no controla un cliente HTTP arbitrario; cola sync ejecuta jobs en el proceso. Antes de habilitar ejecución deben revisarse conexiones secundarias, trabajos, listeners y canales de notificación. Si no se puede acreditar que el caso solo afecta recursos test, se bloquea. No activar ni cambiar el driver para fabricar aprobaciones sin revisar su contrato.

Los chequeos offline no demuestran el destino SQL o las rutas de un proceso Laravel aún inexistente. Para validar esas etapas habrá que autorizar posteriormente comprobaciones controladas sin negocio, separadas de la autorización de migraciones o fixtures. No se abrió SQL ni se arrancó Laravel ahora.

## 6. Plantillas Laravel: lectura y límites

Ambas declaran testing, MySQL/loopback/3308/zarate_test y DB_URL vacía; APP_KEY/principal/contraseña son marcadores obligatorios. Los marcadores son **bloqueantes**, no secretos de prueba válidos. Ninguna plantilla se cargó ni está en backend/.env o phpunit.xml.

Pest propone sesión/cache array; HTTP propone sesión file/cookie exclusiva y cache array. Storage/logs/discos apuntan por diseño al perfil separado. Se normalizaron offline las cinco rutas APP_*_CACHE por perfil desde `D:\zarate-saas\backend`, todas dentro del contenedor; se conserva el hallazgo Windows de prefijos de rutas del framework, sin cambiarlo. No se ejecutó resolución mediante bootstrap de Laravel y sigue pendiente certificar config, paquetes/servicios, sesiones y todos los disk roots efectivos.

El loader futuro debe controlar también APP_*_CACHE heredados, DB_URL y conexiones de sesión/cache/colas; una plantilla correcta no impide que una ejecución manual sin loader lea `.env.testing` actual en 3307 o `.env` de desarrollo. **No hay guardas activas hoy y no se permite ese arranque.** El servicio HTTP y Pest necesitan perfiles propios, y clave exclusiva privada que no se generó ni se copió.

MAIL_MAILER=array es un driver existente sin entrega externa de correo; Office usa notificaciones database, que requieren la DB test cuando se autorice. No se declara que todas las llamadas externas del SaaS estén bloqueadas únicamente por esos drivers.

## 7. Vite, Cypress, sesión y Sanctum

Se confirmó nuevamente: Vite default 5173 y proxy fallback 8000; Cypress default localhost:5173; frontend test propuesto 127.0.0.1:5174 y backend 8001. CORS usa FRONTEND_URL y credentials; Sanctum requiere host/puerto stateful; cookies no se separan solo por puerto.

Hay Origin/Referer fijos a localhost:5173 en specs reales. **Cambios mínimos futuros propuestos**, no realizados: parametrizar esos headers/helpers con el origen de la configuración Cypress, validar que cy.request y navegador llegan al mismo backend, exigir baseUrl 5174 y proxy 8001 antes de login, separar perfil/cookie y verificar persistencia multi-request. No ampliar CORS a wildcard, no desactivar CSRF y no cambiar roles. Si se requiere compatibilidad temporal con un origen extra, necesita revisión expresa y no sustituye probar el origen real.

`cy.intercept` sin respuesta no simula; `cy.request` no es interceptado como el fetch del navegador. El guard/harness futuro deberá distinguir specs reales de mocks y exigir allowlist de destino aun para los requests de soporte. No se cambiaron ni ejecutaron tests. Una UI que consulta sin escribir negocio también puede generar sesión/auditoría al autenticar.

## 8. Checklist de decisión

| Control | Evidencia | Resultado | Riesgo | Acción correctiva / verificación posterior |
| --- | --- | --- | --- | --- |
| Rama y conservación | Rama correcta, inicio limpio, fuentes leídas | APROBADO | Cambios ajenos si se omite Git | Confirmar al cerrar que solo aparecen dos documentos. |
| Datadir vacío | 0 entradas incluidas ocultas | APROBADO offline | Confundir vacío con DB lista | Repetir antes de inicializar; esquema/SQL pendiente. |
| Separación de rutas | Ancestros/descendientes sin reparse; hardlinks de seis archivos solo propios | APROBADO offline | Cambio entre revisión y uso | Repetir y ligar a hashes/identidad de objetos. |
| Plantillas no publicadas | 6 ignoradas, ninguna versionada/no ignorada | APROBADO | Git ignorado no sustituye privacidad | No guardar secretos hasta ACL revisada. |
| ACL privada | 37 DACL heredan, permisos amplios de lectura/modificación | BLOQUEADO para secretos/inicialización | Lectura de claves futuras y alteración de opciones | Seleccionar SID, aprobar cambios acotados, releer todos los objetos y probar permisos después. |
| SIDs no resueltos | Tres reglas Modify sin nombre traducible | PENDIENTE | Identidades mal atribuidas | Resolver o justificar eliminación heredada sin otorgar acceso por analogía. |
| MySQL versión | Binario 8.4.11 y manual oficial 8.4 | APROBADO para identificación | Confundir documentación con validación de arranque | Comprobar opciones efectivas en una fase autorizada. |
| MySQL X | Solo comentario en plantilla | BLOQUEADO para arranque aprobado | Listener adicional no controlado | Proponer mysqlx=0 y verificar ausencia de listener tras arranque futuro. |
| Temporales exclusivos | Sin tmpdir y sin carpeta tmp | BLOQUEADO | Uso de temporales compartidos | Autorizar carpeta/ACL nueva y tmpdir explícito; comprobar ruta efectiva después. |
| Named pipe/shared memory | Omitidos; defaults OFF documentados | PENDIENTE | Ingreso por transporte no revisado si se heredan opciones | Explicitarlos OFF y rechazar options/includes ajenos. |
| Logs/PID/datadir declarados | Rutas bajo contenedor | APROBADO solo estático | Overrides/defaults pueden desviar | Guard estricto, incluidos archivos persistidos y paths adicionales. |
| Puertos | Lectura puntual sin listeners 3308/8001/5174; 5173 ocupado | APROBADO solo observación | Carrera de ocupación | Repetir antes de arranque; no detener al ocupante para ganar el puerto. |
| APP_ENV/DB/storage efectivos | Marcadores/perfiles no activados | PENDIENTE | Fallback hacia desarrollo | Loader completo y guard de resolución antes de comandos con efectos. |
| Cuenta/grants/instancia real | No creada ni consultada | PENDIENTE posterior a inicialización | Privilegios o destino erróneos | Comprobación controlada futura; no aprobar por nombre propuesto. |
| Usuarios/instituciones sintéticos | No hay fixtures preparadas | PENDIENTE | Usar cuentas institucionales | Inventario autorizado de fixtures, luego comparar identidad sin publicar datos. |
| Cypress/Sanctum/origen | Dependencias 5173 localizadas | BLOQUEADO para pruebas reales | Tráfico al backend habitual o sesión inválida | Harness/origen/proxy exclusivos y validación multi-request. |
| Efectos externos | Queue sync/correo array propuestos | PENDIENTE | Job o cliente externo fuera del perímetro | Revisar casos/canales y detener ante incertidumbre. |
| Migraciones/limpieza/tests | Prohibidos y no hay guard activo | BLOQUEADO | Daño por continuar con un checklist parcial | No ejecutar; autorización posterior separada y todas las condiciones efectivas. |

### Snapshot de puertos de esta fase

Consulta de solo lectura fuera del sandbox: sin listeners observados en 3306, 3307, 3308, 33060, 8000, 8001 y 5174; dos listeners Node en 5173 (IPv4 PID 2932, IPv6 PID 4528). 0 procesos mysqld observados. No se detuvieron ni se creó ningún listener/servicio en esta fase. Ausencia puntual de listener no reserva el puerto ni acredita el datadir de un servidor futuro.

## 9. Comprobaciones ejecutadas y límites de las fuentes

Se usaron lecturas de documentos/config/plantillas, Git, Get-Item/Get-ChildItem/Get-Acl y traducción de SIDs, fsutil hardlink list, normalización de rutas, Get-NetTCPConnection/Get-CimInstance, ayuda local `icacls /?` y `mysqld --version`. Las traducciones fallidas se registran como tales; no se usó un nombre anterior como resultado de una identidad no resuelta.

La compatibilidad de parámetros se contrastó con el manual oficial 8.4 enlazado en la sección 4. No se probaron ejecutando el servidor, no se consultó SQL ni se exportaron defaults con posibles secretos. No se creó script diagnóstico adicional porque las lecturas de esta fase permiten emitir el diagnóstico sin introducir ejecutores; las guardas son especificación pendiente, no código existente.

No se hicieron pruebas de acceso efectivo con otras cuentas, de conexión SQL, de init, Artisan, Pest o Cypress. **0 pruebas de integración ejecutadas**; no se inventa un número de aprobaciones funcionales a partir de checks de archivos.

## 10. Próxima fase recomendada

Autorizar primero una **configuración controlada acotada**, sin inicialización automática: identificar SID de ejecución, restringir solo las ACL del contenedor aprobado, crear tmp exclusivo, corregir opciones X/transporte/defaults y desarrollar/revisar un guard offline estrictamente de lectura. Conservar y validar evidencias previas, no resetear permisos del repositorio.

Después deberá repetirse la verificación offline, resolver todos los bloqueos previos y autorizar expresamente la inicialización únicamente del datadir nuevo. Identidad SQL, cuenta/grants y resolución real Laravel seguirán siendo controles posteriores separados. No es posible acreditar esos controles de ejecución mediante una lectura offline ni declarar que las pruebas reales ya estén habilitadas.

**Estado final: REQUIERE AJUSTES; inicialización, secretos y escrituras siguen BLOQUEADOS.** Las correcciones mostradas son propuestas no ejecutadas. No se alteraron recursos preparados ni desarrollo.
