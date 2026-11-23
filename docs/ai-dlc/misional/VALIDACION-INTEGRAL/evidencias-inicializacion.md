# Inicialización controlada de MySQL — Prompt 06

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`.
Rama comprobada: `test/integracion-misional`. HEAD inicial: `bc59c79` (`docs(qa): documentar guardas y seguridad del entorno aislado`). Git estaba limpio. La comparación con `feature/macro-misional` mostró exclusivamente los documentos de VALIDACION-INTEGRAL de las fases anteriores, sin diferencias funcionales.

**Clasificación final: BLOQUEADO POR SEGURIDAD.** Se ejecutó una sola inicialización segura, que produjo archivos de sistema y un registro de fin de inicialización sin errores ni advertencias. Sin embargo, el mecanismo de supervisión PowerShell no conservó el código nativo de salida. No se declara una inicialización plenamente validada ni se deduce salida 0 a partir del log. Se conserva el datadir, sin reintentos, borrados ni arranque posterior.

El bloqueo es de evidencia de cierre y autorización de continuación: **no se ha demostrado un error del motor MySQL ni daño en desarrollo**. La inicialización no implica habilitación de Laravel, migraciones o pruebas reales.

## 1. Alcance autorizado y fuentes revisadas

Se leyeron íntegramente `diagnostico-entorno.md`, `plan-aislamiento.md`, `verificacion-seguridad.md` y `evidencias-correcciones.md`. Se inspeccionaron la plantilla MySQL, el manifest y el código de `Test-Isolation.ps1`; no se asumió que seguían iguales. Se consultó el procedimiento oficial de [inicialización del datadir en MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/data-directory-initialization.html).

La autorización de este prompt permite exclusivamente generar una instancia nueva mediante `--initialize`. El mecanismo genera las estructuras y cuentas internas iniciales del propio motor y una contraseña administrativa temporal; no equivale a aprovisionar bases académicas, usuarios de aplicación ni fixtures. No se utilizó `--initialize-insecure` ni se omitieron controles de autenticación.

## 2. Verificaciones previas

La guarda Offline se ejecutó dos veces en esta fase, incluida una inmediatamente antes de la inicialización: **14 APROBADOS, 0 BLOQUEADOS, salida 0 en ambas ejecuciones**. Son comprobaciones repetidas de los mismos controles; no se suman como 28 pruebas diferentes. No se modificó la guarda.

| Verificación exigida | Evidencia actual | Resultado previo |
| --- | --- | --- |
| Rama y estado Git | Rama requerida; estado inicial limpio | APROBADO |
| Ejecutable y versión | `.tools/mysql-8.4.11-winx64/bin/mysqld.exe`, versión 8.4.11 para Windows x86_64 | APROBADO |
| Guarda actualizada | 14 controles, salida 0 | APROBADO |
| Rutas absolutas y canónicas | Raíz exacta; normalización y comprobación de ancestros | APROBADO |
| Ausencia de enlaces | Sin reparse points/junctions; archivos con un único hardlink | APROBADO |
| Datadir vacío | Cero entradas, incluidas ocultas, antes de la operación | APROBADO |
| Separación de desarrollo | Datadir nuevo dentro del contenedor; distinto de `.tools/mysql-data` protegido | APROBADO |
| tmp/log/PID/config exclusivos | Rutas explícitas dentro de `misional-isolated` | APROBADO |
| ACL privadas y acceso necesario | Allowlist de operador, propietario/sandbox, SYSTEM y Administrators; propietario autorizado | APROBADO |
| Puerto candidato | Sin listener 3308; también libres 8001 y 5174 en la consulta | APROBADO |
| Procesos | Ningún mysqld; sin referencias explícitas al contenedor en runtimes PHP/Node/Cypress inspeccionados | APROBADO |
| MySQL X | `mysqlx=0` explícito; named pipe/shared memory OFF | APROBADO para configuración; listener real pendiente |
| Opciones compatibles | `my_print_defaults` exacto y nueva ejecución `--validate-config`, salida 0 | APROBADO dentro del alcance de validación no operativa |
| Sin redirecciones a desarrollo | Opciones exactas, sin includes ni claves adicionales; variables persistidas OFF | APROBADO |
| Configuración utilizada idéntica | SHA-256 comprobado antes de validar, inmediatamente antes de inicializar y después | APROBADO |

Hashes técnicos, sin secretos:

- Binario mysqld: `B83561F885785133B79CFE53F225DFFBDBDEC160EA54B5245CFB30CC7A440FA7`.
- `mysql.ini.template`: `7580BE576C1E2FA457786228664C0749230531DC643FBDBEE12836B5FE2272BE`.

La plantilla revisada se utilizó directamente como archivo de opciones exclusivo, con `--defaults-file` en primer lugar. No se creó una copia alternativa ni se cambió el contenido. Su extensión `.template` no altera el parser de MySQL. Se autorizó este uso limitado de inicialización; no se activó para operación normal.

Configuración relevante: basedir del paquete portable; datadir `D:\zarate-saas\.tools\misional-isolated\mysql-data`; tmpdir `...\tmp`; log `...\logs\mysql-error.log`; PID `...\pids\mysql.pid`; bind `127.0.0.1`; puerto 3308. Se mantienen `mysqlx=0`, transportes Windows adicionales OFF, `persisted-globals-load=OFF` y `secure-file-priv=NULL`.

## 3. Protección previa de desarrollo y de secretos

Antes de inicializar se guardaron localmente hashes SHA-256, tamaños, fechas de modificación UTC y SDDL del datadir protegido: **303 archivos, 239.244.488 bytes**, además de sus directorios. Son metadatos y hashes: no se copiaron datos institucionales ni contenido de tablas.

Se registraron hashes y ACL de cuatro archivos protegidos, sin publicar su contenido: `.tools/mysql-local.ini`, `.tools/mysql-admin.ini`, `backend/.env` y `backend/.env.testing`. Se consultaron los servicios Windows cuyo nombre o ejecutable correspondía a MySQL/MariaDB, sin modificar ni detener servicios.

El directorio de evidencia nuevo es `.tools/misional-isolated/evidence/prompt06`, bajo la DACL privada existente e ignorado por Git. Las salidas completas de los procesos se redirigieron a archivos locales privados, sin imprimirlas. La contraseña temporal quedó exclusivamente en el log privado del motor; no se copió a documentación, argumentos, Git ni archivos de aplicación. Los archivos de claves TLS/RSA generados también permanecen locales bajo el datadir privado y no se mostraron.

## 4. Operación ejecutada y resultados exactos

Comando equivalente ejecutado una sola vez, sin secretos:

```powershell
& 'D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe' `
  '--defaults-file=D:\zarate-saas\.tools\misional-isolated\mysql.ini.template' `
  --initialize
```

La ejecución real usó `Start-Process`, ventana oculta, directorio de trabajo exclusivo y redirección privada separada de stdout/stderr. TMP y TEMP del proceso supervisor se apuntaron temporalmente al tmp exclusivo para heredarlos al hijo, y se restauraron en `finally`; no se cambiaron variables globales del equipo. No hubo argumentos que anularan datadir, puerto o autenticación.

| Operación | Resultado registrado |
| --- | --- |
| Validación previa `--validate-config` | Código nativo **0** |
| Inicialización `--initialize` | Un único intento; PID registrado localmente; final del supervisor a las **09:43:29 -05:00** |
| Código nativo de la inicialización | **NO DISPONIBLE**: `ExitCode` quedó null |
| Código del comando supervisor | **1**, por no poder confirmar el código nativo; no es un código de error demostrado de MySQL |
| Log del motor | 6 líneas; 0 registros ERROR/FATAL; 0 advertencias; marcador final MY-015018 y registro de generación de credencial temporal |
| stdout/stderr capturados | Archivos vacíos; el motor dirigió sus mensajes al log exclusivo |
| Intento de recuperar ExitStatus por auditoría Windows | No recuperable mediante la auditoría disponible; no se obtuvo código alternativo |
| Reintentos de inicialización | **0** |

El supervisor llamó a `WaitForExit()` y después `Refresh()`, pero la propiedad `ExitCode` no estuvo disponible. No se acredita con ello una causa interna de MySQL ni se atribuye un bug confirmado a Windows/PowerShell. El resultado local original `initialize-result.json` contiene `exitCode: null` e `initialized: false`, calculado por la comparación con el código ausente; ese booleano **no significa que el datadir siga vacío**. Se conserva ese registro original y se explica mediante `post-verification.json`, sin sustituirlo por una aprobación artificial.

El log se inspeccionó mediante conteos y marcadores, nunca imprimiendo líneas con secretos. La presencia del marcador final y de estructuras de sistema constituye evidencia positiva de inicialización, pero no se presenta como recuperación del código de salida faltante. Ante esta limitación se detuvo toda continuación operativa.

## 5. Archivos creados y comprobación posterior de lectura

El datadir tiene **22 entradas de primer nivel**, con **169 archivos y 5 directorios** en el inventario recursivo. Entre los nombres observados están `mysql`, `performance_schema`, `sys`, `#innodb_redo`, `#innodb_temp`, `mysql.ibd`, `ibdata1`, `undo_001`, `undo_002`, `auto.cnf`, archivos doublewrite y claves/certificados generados. Se documentan nombres, nunca contenido de claves ni valores de identidad internos.

No se creó `zarate_test` ni una base académica, no se importó información ni se ejecutaron CREATE USER/GRANT. Las estructuras de sistema son las propias del mecanismo de inicialización.

Snapshot posterior a las **09:47:14 -05:00**:

| Control posterior | Resultado y límite |
| --- | --- |
| Archivos de sistema | Presentes según inventario anterior |
| Fin de inicialización y errores | Marcador final presente; 0 errores críticos y 0 advertencias en el log inspeccionado |
| ACL y propietario | 238 objetos inspeccionados, todos con identidades autorizadas y acceso necesario; no se aplicaron nuevos cambios ACL |
| Enlaces | Sin reparse points; 199 archivos inspeccionados con un único hardlink |
| Proceso MySQL | 0 procesos mysqld; no se inició servidor operativo posterior |
| Puertos candidatos | 0 listeners en 3308/8001/5174 |
| Datadir protegido | Los 303 archivos conservan hashes, tamaños, fechas de modificación y ACL; inventario de objetos conservado |
| Configuraciones protegidas | Las cuatro conservan hashes y ACL |
| Servicios MySQL/MariaDB | Sin servicios coincidentes observados antes ni después; no se ejecutaron comandos de control de servicios |
| Conexiones a zarate_dev | 0 clientes SQL invocados, 0 conexiones SQL realizadas por esta tarea; no se inició la instancia de desarrollo |
| Archivos locales sensibles | Continúan bajo `.tools`, ignorados y no versionados; logs y claves no publicados |

Los conteos ACL/hardlinks corresponden a ese momento, antes de escribir los dos archivos sanitizados finales de evidencia; estos nuevos registros heredan la DACL privada del contenedor. No son cifras de pruebas Pest/Cypress ni cobertura funcional.

Una comprobación auxiliar de servicios intentó leer `services-before.json`, que no se había creado porque la consulta inicial no devolvió objetos a la tubería de serialización. Falló esa lectura; se conservó el datadir y se repitió únicamente la verificación de lectura, tratando la ausencia de coincidencias como colección vacía y comprobando que seguían siendo cero. No hubo segundo intento MySQL ni reparación de servicios.

La comparación de archivos y ACL es evidencia puntual de conservación, no una reserva de recursos frente a otras aplicaciones. La inspección de procesos por comandos no enumera todos los handles del sistema ni sustituye la identidad SQL futura.

## 6. Evidencia local y documentos creados

Archivos locales privados nuevos, sin publicarlos:

- `evidence/prompt06/preflight.txt`.
- `protected-datadir-before.json`, `protected-config-before.json` y `head-before.txt`.
- `validate.stdout.private.log` y `validate.stderr.private.log`.
- `initialize-attempt.json`, `initialize-result.json` e `initialize.pid.txt`.
- `initialize.stdout.private.log`, `initialize.stderr.private.log` y `logs/mysql-error.log` fuera de la subcarpeta de evidencia.
- `post-verification.json` y `created-files-inventory.json`.
- Los archivos de sistema y claves generados bajo el datadir exclusivo.

No se creó un ejecutor reutilizable de inicialización ni se modificaron plantillas, manifest o guarda. `run-manifest.template.json` sigue siendo el snapshot de diseño previo, no un inventario operativo actualizado. El estado observado de esta fase está en su evidencia propia. **No debe repetirse la guarda de datadir vacío como si una salida aprobada todavía fuera posible**: el recurso ya está poblado y debe impedir un nuevo `--initialize`.

Documentos AI-DLC nuevos:

- [prompt-06-inicializacion-mysql.md](prompt-06-inicializacion-mysql.md): copia íntegra del adjunto.
- Este documento: resultados y limitaciones de la operación realmente realizada.

Se conservan íntegros los documentos anteriores y sus resultados históricos. No se modificaron frontend, backend, `.env`, pruebas ni otros Bolts. No se instalaron dependencias ni se hicieron commits, push, merge o PR.

Verificación documental final: el SHA-256 del prompt coincide con el adjunto. Los dos documentos se comprobaron en memoria contra la credencial temporal sin mostrarla, y no contienen esa credencial ni bloques de clave privada. Los recursos privados continúan ignorados y sin seguimiento en Git. `git diff --check` y la comprobación adicional de los documentos nuevos no detectaron errores de whitespace. Git solo advirtió normalización futura CRLF/LF del prompt. Los dos registros sanitizados finales conservan ACL privadas. `git status --short` muestra únicamente los dos documentos nuevos y HEAD sigue en `bc59c79`.

## 7. Pendientes y próxima acción segura

No hubo arranque operativo ni clientes SQL, migraciones, seeders, Pest o Cypress: **0 pruebas reales ejecutadas**. No se declara validación Laravel/MySQL completada ni se crean aprobaciones funcionales a partir de los controles de archivos.

La siguiente fase requiere revisar esta evidencia incompleta de supervisión y autorizar por separado cualquier verificación/activación de la instancia **existente**, con guardas adaptadas a un datadir ya poblado y comprobación de identidad, rutas, binario y configuración. No volver a ejecutar `--initialize`, no usar `--initialize-insecure`, no borrar ni renombrar el datadir para fabricar un segundo intento. No sustituir el código desconocido por 0 en los registros.

Si posteriormente se autoriza arrancar, habrá que comprobar los listeners, identidad SQL real y datadir, tratar privadamente la credencial temporal, establecer la política de cuentas/grants y preparar el destino de aplicación antes de cualquier escritura académica. Continúan pendientes APP_KEY exclusiva, loader Laravel, configuración efectiva, cuenta restringida, esquema y fixtures sintéticos, revisión de efectos externos y harness Cypress/orígenes. Ninguna de esas acciones queda autorizada por este cierre.

**Resultado de esta fase: BLOQUEADO POR SEGURIDAD para continuar; datadir generado conservado, sin reintento.**
