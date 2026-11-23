# Cambio controlado de contraseña e identidad MySQL — Prompt 10

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama comprobada: `test/integracion-misional`. HEAD inicial: `62fbe7a` (`docs(qa): registrar autenticacion pendiente de MySQL aislado`). Git inicialmente limpio.

**Resultado: CONTRASEÑA ACTUALIZADA E IDENTIDAD VERIFICADA.** MySQL confirmó el único cambio de contraseña autorizado. La autenticación posterior con la clave nueva funcionó sin la capacidad de manejar contraseñas expiradas. Se verificaron por SQL versión, puerto, datadir, UUID y cuenta efectiva, y se leyeron sus grants. La instancia quedó detenida con código nativo del servidor **0**.

No se crearon bases, usuarios, grants, migraciones o fixtures. **Las pruebas reales siguen sin habilitarse:** todavía falta una base y una cuenta de aplicación con privilegios limitados, además de configuración Laravel aislada y verificada.

## 1. Documentación y revisión previa

Se revisaron `evidencias-correcciones.md`, `evidencias-inicializacion.md`, `evidencias-primer-arranque.md` y `evidencias-identidad-sql.md`. Los tres primeros, leídos íntegramente en las fases anteriores, no presentan cambios en la comparación Git entre `46431a2` y HEAD; se releyó íntegramente la evidencia del Prompt 09. Se inspeccionaron configuración y supervisor locales. Las evidencias anteriores permanecen intactas, incluidos sus errores y el código de inicialización desconocido.

El supervisor local de esta fase conserva consola exclusiva oculta, reconoce monitor y servidor hijo, lee logs concurrentes con acceso compartido y obtiene códigos mediante handles nativos. La comprobación de cierre distingue ausencia de listener de estados TCP transitorios; no se reescribió el resultado fallido histórico por TIME_WAIT del Prompt 09.

## 2. Precondiciones comprobadas

| Control | Resultado de esta ejecución |
| --- | --- |
| Rama y Git | Rama requerida; estado inicial limpio |
| Binario | `.tools/mysql-8.4.11-winx64/bin/mysqld.exe`, versión 8.4.11 y hash concordante con la revisión anterior |
| Configuración | `mysql.ini.template` exclusivo, contenido y hash conservados; parser devuelve las 12 opciones exactas sin includes o duplicados |
| Datadir | `.tools/misional-isolated/mysql-data`, inicializado y con 172 archivos al comenzar; archivos de sistema presentes |
| Rutas y enlaces | Rutas absolutas y ancestros/descendientes sin reparse; archivos sin hardlinks ajenos |
| ACL y propietarios | Identidades Windows autorizadas y acceso necesario conservado; raíz privada sin herencia amplia |
| PID, tmp y logs | Destinos exclusivos; ningún PID residual antes de arrancar |
| Puerto/procesos | 3308 libre antes de arrancar; ningún mysqld ni servicio relacionado activo |
| Bind y MySQL X | 127.0.0.1 y 3308 explícitos; mysqlx=0; named pipe y shared memory OFF |
| Redirecciones | Datadir, tmpdir, PID y logs bajo el contenedor, sin fallback a desarrollo; persisted-globals-load OFF |
| Cierre sin autenticación | Prueba auxiliar de consola/Ctrl+C con código nativo **0** antes del arranque real |
| Validación no operativa | Configuración más las opciones temporales de privacidad, --validate-config: código **0** |
| Desarrollo protegido | 303 archivos y cuatro configuraciones comparados antes y después, sin cambios |

El preflight registró **306 objetos** del contenedor a las **10:51:28 -05:00**. No se exigió datadir vacío ni se reutilizó una autorización de inicialización.

## 3. Arranque y privacidad de la operación

Se inició una única instancia mediante el binario y archivo de opciones acreditados. Se conservaron --defaults-file en primer lugar y --console; para esta ejecución de cambio de contraseña se añadieron únicamente controles de registro:

```text
--skip-log-bin --general-log=OFF --slow-query-log=OFF --log-raw=OFF
```

Son opciones temporales de proceso, validadas antes de arrancar; **no se modificó la plantilla** ni configuración de desarrollo. Su objetivo fue no registrar la operación sensible en binlog, general log, slow log o registro sin reescritura. Los argumentos de ambos procesos se verificaron también con esas opciones. La lectura SQL posterior confirmó los cuatro valores de registro desactivados. No se emitió SET sql_log_bin ni otra modificación de sesión para conseguirlo. Referencia: [MySQL 8.4 — contraseñas y registros](https://dev.mysql.com/doc/refman/8.4/en/password-logging.html).

A las **10:51:32 -05:00** se verificaron monitor PID **14316** y servidor hijo PID **3824**, ejecutables/argumentos correctos, PID-file con 3824 y una única escucha del árbol en **127.0.0.1:3308**. No se inició ningún servicio ni aplicación de desarrollo.

El cliente fue el `mysql.exe` 8.4.11 portable, invocado directamente sin shell. Se utilizaron:

- Archivo de opciones privado exclusivo en primer lugar y --no-login-paths, sin leer credenciales de desarrollo o login paths del usuario.
- TCP y destino literal 127.0.0.1:3308; sin seleccionar una base.
- TLS con **VERIFY_CA** y la CA local fijada del datadir aislado. Se verificó el hash de ese certificado contra la acreditación local antes de conectar. No se permitió fallback a conexión sin cifrar.
- Modo batch, reconexión automática desactivada, sin modo verbose/tee y sin historial interactivo; MYSQL_HISTFILE=NUL solo para el hijo. No se usó MYSQL_PWD.
- Credenciales en recursos locales privados separados del código. Ni la contraseña antigua ni la nueva se incluyeron en argv.

VERIFY_CA valida la CA, **no el hostname del certificado**. La identidad se completó con PID, configuración, listener y comparación SQL de datadir/UUID; no se declara un certificado válido para despliegue remoto. [MySQL 8.4 — opciones TLS](https://dev.mysql.com/doc/refman/8.4/en/connection-options.html).

## 4. Cambio de la contraseña autenticada

Tras acreditar proceso/destino, el cliente local leyó la contraseña temporal en memoria desde su log privado. Generó una clave nueva fuerte mediante random_bytes, distinta de la temporal, y la conservó únicamente en un archivo dedicado bajo ACL privadas. No hay valores ni hashes de contraseñas en este informe o en los scripts.

Se preparó antes del cambio el recurso administrativo con la clave nueva para evitar perderla si fallaba la supervisión. La copia privada de arranque con la clave antigua se eliminó de su contenido después de la confirmación; el log histórico de inicialización no se modificó. No se alteraron credenciales de desarrollo.

Se realizó **una sola sentencia modificadora**: ALTER USER de **CURRENT_USER()**, exclusivamente con la cláusula de contraseña. Se transmitió por stdin, construida en memoria; no se creó un archivo SQL con el secreto. --connect-expired-password se utilizó solo para esa conexión, según el mecanismo oficial de contraseña expirada. No se utilizaron skip-grant-tables, initialize-insecure, actualización directa de tablas del sistema, GRANT, REVOKE o restablecimientos forzados. [MySQL 8.4 — ALTER USER](https://dev.mysql.com/doc/refman/8.4/en/alter-user.html).

| Resultado | Evidencia |
| --- | --- |
| Intentos de modificación | **1**, sin reintentos automáticos |
| Confirmación del cliente MySQL | Código nativo **0** |
| Errores MySQL/SQLSTATE del cambio | Ninguno comunicado por el cliente |
| Nueva autenticación | Código **0**, con la nueva clave y sin --connect-expired-password |
| Restricción de expiración | Ya no impidió las lecturas posteriores |
| Escritos SQL adicionales | **0**: no se crearon bases, usuarios ni privilegios |

Las salidas y errores del cliente se procesaron en memoria. No se guardaron mensajes crudos que pudieran incluir un fragmento de contraseña ante un error de sintaxis; solo códigos e indicadores saneados. La contraseña no apareció en consola, capturas o trazas.

## 5. Identidad SQL y privilegios observados

Después de confirmar el cambio se abrió una nueva conexión con la clave nueva para una lectura SELECT con JSON_OBJECT de identidad y controles de registro. En otra conexión nueva se realizaron SHOW GRANTS FOR CURRENT_USER y SHOW SESSION STATUS LIKE 'Ssl_cipher'. Total explícitamente enviado por el cliente local: **3 sentencias de lectura** y una modificadora autorizada. No se consultaron tablas personales ni zarate_dev.

| Dato SQL | Resultado comprobado |
| --- | --- |
| Versión | **8.4.11** |
| Puerto | **3308** |
| Datadir | `D:\zarate-saas\.tools\misional-isolated\mysql-data\` |
| UUID | Coincide con auto.cnf del datadir acreditado; valor conservado solo en evidencia local privada |
| USER() | **root@localhost** |
| CURRENT_USER() | **root@localhost** |
| DATABASE() | **NULL**, ninguna base seleccionada |
| Roles activos | **NONE**, decodificado de la representación binaria/base64 del resultado JSON de CURRENT_ROLE() |
| General/slow/raw/binlog | Desactivados, conforme a las opciones de esta ejecución |
| Cifrado TLS de la conexión de lectura | **TLS_AES_128_GCM_SHA256**, sesión verificada con la CA fijada |
| Grants | **3 filas** recuperadas, con privilegios globales y GRANT OPTION |

Resumen saneado de permisos:

- Grant global de privilegios estáticos en *.*: incluye operaciones DML/DDL y administración; se observaron, entre otros, FILE, CREATE USER y SHUTDOWN.
- Grant global de privilegios dinámicos: incluye, entre otros, CONNECTION_ADMIN, ROLE_ADMIN y APPLICATION_PASSWORD_ADMIN.
- Grant PROXY sobre la cuenta indicada en la concesión. Las tres filas contienen WITH GRANT OPTION.

Estos permisos se observaron después del cambio y no se otorgaron en esta operación. No se dispone de una lectura SQL anterior al cambio para una comparación de grants antes/después; se acredita que la única sentencia modificadora enviada fue la de contraseña. No se afirma que la cuenta tenga privilegios mínimos: es administrativa y **no debe usarse en Pest ni Laravel**.

La comparación de UUID/datadir y la cuenta efectiva completa la identidad de esta instancia en esta ejecución. DATABASE() NULL y el destino exclusivo acreditan que las sesiones no seleccionaron zarate_dev. No se hicieron consultas negativas ni escrituras de prueba sobre desarrollo.

## 6. Detención y conservación

El cierre se ejecutó en finally mediante el auxiliar ya acreditado, reconociendo exactamente monitor, servidor y auxiliar en su consola. Se conservaron handles hasta obtener ambos códigos y se envió únicamente CTRL_C_EVENT; no se utilizó mysqladmin, taskkill ni terminación por nombre.

| Resultado a las **10:51:48 -05:00** | Valor |
| --- | --- |
| Servidor 3824 | Código nativo **0**, cierre completo registrado |
| Monitor 14316 | **3221225786 / 0xC000013A**, por Ctrl+C, sin convertirlo en 0 |
| Supervisor | Salida **0** |
| Errores del motor | **0 ERROR/FATAL** |
| Advertencias | **1**, CA autofirmada |
| Procesos MySQL | **0** |
| Conexiones locales en 3308 | **0** |
| PID-file | Ausente tras el cierre |
| ACL | **335 objetos** inspeccionados con propietarios y acceso autorizados |
| Datos de desarrollo | **303 archivos** conservan inventario, hashes, tamaños, fechas UTC y ACL |
| Configuraciones protegidas | **4** con hashes y ACL intactos |
| Log histórico de inicialización | Hash conservado |

La lectura final independiente a las **10:53:18 -05:00** confirmó cero procesos del motor, cliente o auxiliares, cero listeners y entradas TCP en 3308, cero servicios relacionados y ausencia de PID-file. No se modificó la instancia de desarrollo. La apertura/cierre sin errores y los archivos esenciales presentes acreditan este ciclo; no sustituyen una validación lógica exhaustiva de cada tabla o página.

## 7. Recursos locales y seguridad del secreto

Los recursos nuevos de ejecución quedan bajo `.tools/misional-isolated/evidence/prompt10`, ignorados por Git: supervisor y cliente local, auxiliar de consola, capturas privadas del motor y JSON saneados de preflight, proceso, cambio, nueva autenticación, identidad/grants y cierre. Se conservan todas las evidencias anteriores.

La clave administrativa actual reside en **admin.private.ini**, recurso de configuración privado separado de los scripts, bajo las ACL del contenedor. El archivo no se publica ni se imprime. La copia bootstrap.private.ini ya no contiene la contraseña temporal después del cambio confirmado. Los scripts contienen generación/lectura del secreto, no un valor incrustado. No se creó un archivo de sentencias con contraseñas. El almacenamiento se protege por ACL, no se presenta como una bóveda cifrada; solo las identidades Windows aprobadas y administración local tienen acceso.

Documentos nuevos para Git:

- `prompt-10-cambio-clave-mysql.md`: copia íntegra del adjunto.
- Este informe, con resultados técnicos no sensibles.

No se cambiaron frontend/backend, .env, permisos o archivos de opciones existentes. No se instalaron dependencias ni se hicieron commits, push, merge o PR.

Auditoría final saneada: se comprobaron **32 archivos de texto**, incluidos los dos documentos, sin encontrar la clave nueva fuera del recurso de credenciales dedicado. Se confirmó que es fuerte por longitud, diferente de la temporal y que la copia bootstrap quedó sin la contraseña antigua. No se imprimieron valores ni hashes de autenticación. El resultado queda en `secret-audit.json`; el auditor local no conecta a MySQL.

El SHA-256 del prompt coincide con el adjunto. `git diff --check` y la comprobación adicional de los dos documentos nuevos no detectaron errores; solo hubo aviso de normalización CRLF/LF del prompt. El recurso administrativo está ignorado y ningún archivo del contenedor está versionado. Git muestra únicamente los dos documentos nuevos y HEAD sigue en `62fbe7a`.

## 8. Riesgos y siguiente paso

La cuenta verificada tiene autoridad global y delegación; no habilitar con ella pruebas o migraciones. La siguiente fase deberá autorizar por separado la creación de una base exclusiva y una cuenta de prueba de privilegios mínimos, revisar sus grants/roles efectivos y comprobar la configuración Laravel resultante. Nada de ello se hizo aquí.

Persisten la advertencia de CA autofirmada, la ausencia de verificación de hostname en VERIFY_CA, la protección del recurso administrativo por ACL y el código histórico desconocido de la inicialización. No se alteró esa evidencia anterior ni se declara que el nuevo éxito recupera su código.

**Estado final: CONTRASEÑA ACTUALIZADA E IDENTIDAD VERIFICADA; instancia detenida.** No se crearon usuarios o bases y no se ejecutaron migraciones, seeders, Pest o Cypress: **0 pruebas reales ejecutadas**. Las pruebas reales continúan sin habilitarse.
