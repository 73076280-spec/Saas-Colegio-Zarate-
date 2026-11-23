# Correcciones controladas del entorno aislado — Prompt 05

Fecha: 02/11/2026, zona America/Lima. Rama comprobada: `test/integracion-misional`.
Base Git observada: `9a59552` (`docs(qa): verificar controles de seguridad del entorno aislado`). Inicio sin cambios pendientes. No se generaron commits.

**Estado: APTO PARA INICIALIZACIÓN CONTROLADA, exclusivamente respecto de la preparación offline.** No constituye autorización para inicializar: esa operación necesita una fase posterior expresamente autorizada y repetir las comprobaciones. Activación de Laravel, pruebas reales y escrituras SQL continúan BLOQUEADAS. La guarda de activación devuelve error deliberadamente y no hay un ejecutor de inicialización.

## 1. Antecedentes y alcance

Se leyeron `diagnostico-entorno.md`, `plan-aislamiento.md`, `evidencias-preparacion.md` y `verificacion-seguridad.md`. Se conservan íntegros: sus estados describen las fases anteriores, no el resultado de esta corrección.

El contenedor exclusivo es `D:\zarate-saas\.tools\misional-isolated`. Al comenzar había 37 objetos (31 directorios y seis plantillas), datadir con cero entradas, sin reparse points y con ACL heredadas demasiado amplias. Las plantillas carecían de tmpdir y de desactivación efectiva de MySQL X. No contenían credenciales reales: APP_KEY, usuario y contraseña eran marcadores.

Se verificaron las rutas y ancestros antes de modificar, los ejecutables portables, la ausencia de procesos mysqld y de listeners en los puertos candidatos. Se identificaron por SID la cuenta operadora, la propietaria del contenedor, SYSTEM y Administrators. No se publican los identificadores locales ni el respaldo de seguridad.

## 2. Cambios locales, no publicados

Todo lo siguiente permanece bajo `.tools/misional-isolated`, ignorado por Git:

| Recurso | Cambio |
| --- | --- |
| `mysql.ini.template` | tmpdir exclusivo; MySQL X desactivado; named pipe/shared memory OFF; lectura de variables persistidas OFF; importación/exportación SQL de archivos deshabilitada mediante secure-file-priv=NULL. |
| `laravel-pest.env.template` | Sanctum propuesto limitado a `127.0.0.1:5174`; cola `"null"` en lugar de sync. |
| `laravel-http.env.template` | Cola `"null"` en lugar de sync; conserva las sesiones file aisladas. |
| `run-manifest.template.json` | Registra la revisión local de DACL, existencia de guardas y validación no operativa de configuración; conserva initialized/running/SQL identity/grants/runtime/external effects/writes en false y activationBlocked en true. No se usa como credencial ni prueba de identidad efectiva. |
| `Test-Isolation.ps1` | Guarda de solo lectura con ámbitos Offline y Activation; no importa variables, no hace boot de Laravel ni ejecuta SQL/servicios. |
| `tmp/` | Nuevo directorio temporal exclusivo. |
| Contenedor y descendientes | DACL privada aplicada desde la raíz, conservando propietario. |
| `evidence/pre-prompt05/` | Respaldo local previo de las seis plantillas, ACL de los 37 objetos originales y seis ACL protegidas externas. |
| `evidence/prompt05-offline.txt`, `prompt05-activation.txt`, `prompt05-results.json` | Salidas y snapshot local de las verificaciones. El registro de salida lo realiza el comando que invoca la guarda; la guarda no escribe archivos. |

`vite.env.template` y `cypress.env.template` fueron revisadas y no necesitaron cambios: proxy propuesto `http://127.0.0.1:8001` y baseUrl `http://127.0.0.1:5174`. Ninguna plantilla fue activada. No se modificaron archivos funcionales, pruebas, `.env`, phpunit ni otros Bolts.

## 3. MySQL: configuración y validación no operativa

El ejecutable comprobado es `.tools/mysql-8.4.11-winx64/bin/mysqld.exe`, versión 8.4.11 para Windows x86_64. PHP comprobado: `.tools/php/php.exe`, versión 8.4.26; no se usa el PHP de XAMPP disponible en PATH.

La plantilla local mantiene basedir en el paquete portable, bind `127.0.0.1` y puerto `3308`. Datadir, tmpdir, log y PID se resuelven respectivamente a `mysql-data`, `tmp`, `logs/mysql-error.log` y `pids/mysql.pid`, dentro del contenedor. Se establecen `mysqlx=0`, `named-pipe=OFF`, `shared-memory=OFF`, `persisted-globals-load=OFF` y `secure-file-priv=NULL`. El archivo completo permanece local y no se publica.

El parser `my_print_defaults.exe --defaults-file=<ruta absoluta a mysql.ini.template> mysqld` devolvió exactamente las opciones esperadas. La guarda rechaza claves adicionales, duplicadas, includes y grupos no permitidos, y normaliza los destinos; no acepta una simple coincidencia parcial de cadenas.

Se ejecutó una única validación de compatibilidad del binario con:

```powershell
& 'D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe' `
  '--defaults-file=D:\zarate-saas\.tools\misional-isolated\mysql.ini.template' `
  --validate-config
```

Resultado: **salida 0**, sin diagnóstico de error. No se inició un servidor operativo ni se inicializó el datadir, que permaneció con cero entradas. No apareció `logs/mysql-error.log` en esta ejecución. No se ejecutó SQL.

Este modo comprueba configuración sin iniciar motores ni subsistemas normales; por ello no demuestra que un servidor futuro escuche correctamente ni valida todos los subsistemas/plugins. No se confunde compatibilidad estática con arranque probado. Referencia: [MySQL 8.4 — validación de configuración](https://dev.mysql.com/doc/refman/8.4/en/server-configuration-validation.html). MySQL X desactivado deberá confirmarse también en los listeners de una futura instancia autorizada.

## 4. ACL: respaldo, aplicación y límites

Antes de aplicar cambios se creó `evidence/pre-prompt05/acl-original.json`, con Path y SDDL de cada objeto original, y `protected-acl.json`, con el estado de repositorio, `.tools`, backend, frontend, datadir de desarrollo y storage de backend. Se guardaron las plantillas originales. El respaldo queda fuera de Git y, después del ajuste, bajo la misma DACL privada.

Política aplicada únicamente a la raíz aislada:

- Deshabilitar herencia de la DACL amplia, sin conservar sus ACE heredadas.
- SYSTEM y Administrators: FullControl, heredable a archivos y carpetas.
- Cuenta operadora identificada: FullControl heredable, para operación y reversión.
- Cuenta propietaria/sandbox identificada: Modify heredable; se conserva el propietario original.
- Eliminar acceso heredado de Users, Authenticated Users, grupo general de sandbox y SIDs no resueltos; no se reasignan por analogía.

Los descendientes heredan las cuatro identidades permitidas. Se releyeron todas las DACL mediante la guarda y se comprobó la disponibilidad del acceso necesario por reglas Allow/Modify, sin ACE ajenas ni Deny. Se verificó el propietario contra el SDDL original, no contra un nombre supuesto. Las seis ACL protegidas externas permanecen idénticas al respaldo. No se cambiaron propietarios ni permisos del desarrollo.

La inspección DACL y el acceso realizado por las cuentas de ejecución no sustituyen pruebas de acceso con cada otra cuenta posible. El entorno restringido no permite consultar CIM/puertos directamente; para la ejecución completa de la guarda se usó el contexto de lectura autorizado fuera del sandbox. Una consulta imposible debe bloquear, nunca omitirse como aprobada. Las herramientas conservaron acceso al contenedor tras el ajuste.

## 5. Laravel, Vite y Cypress propuestos

Ambos perfiles conservan `APP_ENV=testing`, DB mysql explícita en `127.0.0.1:3308`, base candidata `zarate_test`, DB_URL vacío y marcadores sin secretos. APP_URL termina en 8001 y FRONTEND_URL en 5174. No se crearon claves ni cuentas.

Sesión Pest: array. Sesión HTTP: file con cookie propia y storage propio. Caché: array. Correo: array. Cola propuesta: `QUEUE_CONNECTION="null"`; el Laravel instalado contempla este valor en `backend/vendor/laravel/framework/src/Illuminate/Queue/QueueManager.php::getConfig`, que devuelve el driver null incluso sin una entrada propia en `config/queue.php`. Es lectura de código, no prueba de boot ejecutada. QUEUE_FAILED_DRIVER se mantiene null. La cola null evita ejecutar jobs en ese perfil, pero también impide verificar su comportamiento real: los tests que dependan de jobs necesitarán estrategia explícita posterior. No acredita ausencia de llamadas síncronas externas ajenas a la cola.

Storage: `storage-pest` y `storage-http` exclusivos. Los cinco APP_*_CACHE de cada perfil son relativos al basePath de backend y se resuelven a `bootstrap-pest`/`bootstrap-http`, dentro del contenedor. Se conservaron rutas relativas porque la resolución de caché instalada no trata una ruta Windows con letra de unidad igual que una ruta absoluta Unix. No hay caches generados en esos destinos.

Las propuestas Vite/Cypress coinciden entre sí y con Sanctum. **Su ejecución efectiva no está habilitada:** Vite aún tiene defaults 5173/proxy 8000 y Cypress localhost:5173 en la configuración funcional. Además, `e2e/cypress/e2e/learning.cy.ts`, `virtual.cy.ts`, `enrollment.cy.ts`, `attendance.cy.ts` y otros specs mantienen Origin/Referer fijos a localhost:5173. No se modificaron pruebas ni se amplió CORS. Falta un loader/harness que controle todos los overrides, host y strictPort, evite fallback y garantice origen correcto antes de autenticación.

## 6. Guardas y resultados ejecutados

Invocación reproducible, de solo lectura, con permisos de consulta de procesos y red:

```powershell
powershell.exe -NoProfile -File D:\zarate-saas\.tools\misional-isolated\Test-Isolation.ps1 -Scope Offline
powershell.exe -NoProfile -File D:\zarate-saas\.tools\misional-isolated\Test-Isolation.ps1 -Scope Activation
```

La guarda no inicializa, borra, migra, crea usuarios ni ejecuta SQL. Cada control emite APROBADO/BLOQUEADO. Una condición insegura o no comprobable produce salida 1. El ámbito Activation es una barrera cerrada deliberada: no admite habilitación mediante un flag del manifest; deberá revisarse en otra fase para incorporar comprobaciones efectivas.

| Control offline | Resultado final |
| --- | --- |
| Raíz absoluta, local y exactamente autorizada | APROBADO |
| Ancestros/descendientes sin enlaces, junctions ni superposición con destinos protegidos | APROBADO |
| Archivos sin hardlinks externos: fsutil devuelve un único enlace a su ruta | APROBADO |
| Datadir vacío y tmp/logs/pids exclusivos existentes | APROBADO |
| MySQL: opciones exactas, sin includes y destinos normalizados exclusivos | APROBADO |
| Binarios MySQL/PHP previstos, rutas sin enlaces y versiones | APROBADO |
| Parser MySQL usando solo el archivo explícito y opciones esperadas | APROBADO |
| Ningún mysqld, ningún runtime PHP/Node/Cypress con referencias explícitas al contenedor y ningún listener candidato 3308/8001/5174 | APROBADO |
| DACL privada y acceso necesario declarado para las cuatro identidades | APROBADO |
| Laravel Pest propuesto: entorno, destinos, marcadores y perfiles | APROBADO |
| Laravel HTTP propuesto: entorno, destinos, marcadores y perfiles | APROBADO |
| Vite/Cypress propuestos: URL y proxy exclusivos | APROBADO |
| Recursos locales ignorados y no versionados | APROBADO |
| Manifest no autoriza operaciones ni aprueba identidad efectiva | APROBADO |

**Ejecución final Offline: 14 APROBADOS, 0 BLOQUEADOS, salida 0.** Se ejecutó también una primera versión con 13 controles aprobados antes de agregar el control del manifest; no se suman ambas ejecuciones como pruebas diferentes.

**Ejecución final Activation: los mismos 14 APROBADOS offline, 3 BLOQUEADOS, salida 1 esperada:**

1. Loader, destinos efectivos y credenciales: no hay loader revisado ni valores privados activados.
2. Identidad SQL, cuenta, grants e institución: requiere instancia futura; no se consultó SQL.
3. Cypress efectivo y efectos externos: harness/orígenes y canales externos pendientes.

Pruebas negativas adicionales, sin modificar datos ni crear rutas inseguras:

| Invocación | Resultado |
| --- | --- |
| `-Root D:\zarate-saas\.tools\mysql-data` | BLOQUEADO por raíz no autorizada; salida 1 antes de explorar ese destino. |
| `-Root .tools\misional-isolated` | BLOQUEADO por ruta no absoluta; salida 1. |

Ambos rechazos son resultados esperados de seguridad, no fallos funcionales ocultados. Análisis sintáctico PowerShell: aprobado sin errores. `--validate-config`: salida 0. Estos controles no son casos Pest/Cypress ni verifican la aplicación.

Los intentos auxiliares iniciales de comparar propietario no fueron concluyentes (comparación contra un objeto vacío y constructor PowerShell incorrecto). La comprobación final reconstruyó el SDDL original con `RawSecurityDescriptor(string)` y confirmó coincidencia del propietario. No hubo cambio de propietario ni un defecto de ACL acreditado por esos intentos.

Snapshot local registrado a las 09:32:45 -05:00: 0 entradas en datadir, 0 procesos mysqld y 0 listeners en los tres puertos candidatos. Se repitió la guarda tras ampliar la inspección de runtimes a PHP/Node/Cypress. No se detuvo ningún servicio. La observación no reserva puertos ni elimina carreras entre comprobación y uso. La inspección de líneas de comandos no es una enumeración de todos los handles abiertos del sistema; un uso indirecto no declarado requiere revisión adicional antes de operar.

## 7. Reversión controlada

Procedimiento preparado, **no ejecutado**, porque se conservan las correcciones:

1. Usar la cuenta operadora con FullControl o Administrators; mantener el entorno detenido y sin secretos/datos nuevos. Si existen secretos futuros, no restaurar una DACL amplia sin tratarlos antes.
2. Leer localmente `evidence/pre-prompt05/acl-original.json`; exigir que cada Path normalizado sea exactamente la raíz aislada o un descendiente. Repetir inspección de enlaces/hardlinks antes de restaurar. Rechazar rutas exteriores, ambiguas o desaparecidas.
3. Reconstruir para cada objeto existente su seguridad de acceso desde el SDDL original mediante `SetSecurityDescriptorSddlForm(..., AccessControlSections.Access)` y aplicar con `Set-Acl -LiteralPath`. Restaurar hijos antes de la raíz; no cambiar propietario ni SACL. El último paso restablece la herencia original de la raíz. No usar reset recursivo sobre `.tools` o el repositorio.
4. Para los objetos creados en esta fase, que no tenían SDDL propio en el respaldo, mantener la herencia de la raíz restaurada; no eliminarlos ni borrar datos automáticamente. Comparar las ACL originales objeto a objeto y las seis ACL protegidas externas.
5. Si se decide revertir también plantillas, comparar y copiar exclusivamente las seis copias originales hacia sus rutas equivalentes dentro del contenedor. No tocar `.env`, storage de desarrollo ni datadir protegido. Conservar esta evidencia y el respaldo; no se proporciona un script de restauración ejecutable ni se programa la reversión.

## 8. Pendientes y recomendación

La preparación offline permite plantear la siguiente fase de **inicialización controlada del datadir nuevo**, con autorización independiente, repetición de guardas, ejecutable/archivo de opciones exactos y comprobación posterior de procesos/listeners. No se declara inicializado ni operativo hoy.

Antes de cualquier test con efectos siguen pendientes: clave exclusiva privada, cuenta SQL restringida y grants comprobados, identidad real de instancia/datadir/puerto/base/cuenta, fixtures institucionales sintéticos, resolución efectiva de Laravel sin herencia peligrosa, loader/harness revisado, cookies/CSRF/orígenes y revisión de efectos externos. La guarda Activation bloquea hasta esa revisión; ni un nombre de base candidato ni el manifest acreditan aislamiento efectivo.

**Pest/Cypress con backend real: NO EJECUTADOS (0 casos de integración ejecutados).** No se hicieron SQL, inicialización, arranque operativo, migraciones, seeders, instalación de dependencias ni cambios de datos. No se inventa un total de casos pendientes: dependerá de la selección de suites de la siguiente fase.

Documentos creados para Git: este archivo y `prompt-05-correcciones-seguridad.md`. El prompt se copió sin reconstrucción y su SHA-256 coincide con el adjunto. Las plantillas, guardas, ACL y registros permanecen locales e ignorados. No se alteraron evidencias anteriores ni se hizo commit/push/merge/PR.

Comprobación final: `git diff --check` sin errores; se comprobaron además los dos documentos no versionados mediante diff no-index y lectura de whitespace, sin errores. Git advirtió que normalizará CRLF a LF en el prompt al incorporarlo: no es un fallo de formato y la copia actual coincide byte a byte con el adjunto. `git status --short` muestra únicamente los dos documentos nuevos; no hay cambios funcionales versionados.
