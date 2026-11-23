# Identidad SQL y seguridad del MySQL aislado — Prompt 09

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama comprobada: `test/integracion-misional`. HEAD inicial: `46431a2` (`docs(qa): registrar primer arranque controlado de MySQL aislado`). Estado inicial Git limpio.

**Estado: AUTENTICACIÓN PENDIENTE.** Se arrancó únicamente la instancia aislada y se realizó un intento administrativo seguro. MySQL devolvió **1862 / HY000**, correspondiente a contraseña expirada. PDO no estableció una sesión utilizable y **no se ejecutaron consultas SQL de identidad ni privilegios**. No se cambió la contraseña ni se eludió la restricción. La instancia terminó con cierre completo y código nativo del servidor **0**.

**No se declara IDENTIDAD SQL VERIFICADA ni habilitación de pruebas reales.** El puerto, PID, configuración y archivos quedaron acreditados a nivel de sistema operativo; la identidad y los permisos por SQL continúan pendientes.

## 1. Documentación y recursos revisados

Se revisaron los cinco documentos obligatorios: `plan-aislamiento.md`, `evidencias-correcciones.md`, `evidencias-inicializacion.md`, `evidencias-post-inicializacion.md` y `evidencias-primer-arranque.md`. Los cuatro primeros ya se habían leído íntegramente en fases anteriores; se contrastó Git y no presentan cambios entre `ea10ad1` y HEAD. Se releyó el cierre del Prompt 08 y se revisaron configuración y auxiliares locales antes de preparar esta ejecución. No se sobrescribieron evidencias anteriores.

El supervisor nuevo conserva el mecanismo de consola exclusiva, pero reconoce el árbol monitor/servidor y lee capturas abiertas con FileShare.ReadWrite. No reutiliza el ejecutable de cierre con PID fijos de Prompt 08. La guarda original de inicialización y el manifest de plantilla se mantienen intactos: no sirven como aprobación de un servidor ya inicializado ni de una conexión Laravel.

## 2. Precondiciones y arranque

| Control | Resultado actual |
| --- | --- |
| Rama/estado | Rama requerida y Git limpio al comenzar |
| Binario | `D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe`, versión 8.4.11 |
| SHA-256 del binario | `B83561F885785133B79CFE53F225DFFBDBDEC160EA54B5245CFB30CC7A440FA7`, igual al revisado |
| Archivo de opciones | `.tools/misional-isolated/mysql.ini.template`, SHA-256 `7580BE576C1E2FA457786228664C0749230531DC643FBDBEE12836B5FE2272BE`, igual al Prompt 08 |
| Opciones efectivas del parser | Exactamente las 12 revisadas; sin includes, duplicados ni claves adicionales |
| Rutas | Datadir, tmpdir, PID y log normalizados dentro de `.tools/misional-isolated`, separados de desarrollo |
| Archivos/ACL | Datadir poblado reconocido: 171 archivos antes del arranque; propietarios y ACL autorizados; sin reparse ni hardlinks ajenos |
| Red | Sin conexiones locales en 3308 antes del arranque; bind previsto 127.0.0.1 |
| Procesos/servicios | Sin mysqld previo ni servicios relacionados; no se inició o detuvo desarrollo |
| MySQL X y otros transportes | mysqlx=0, named-pipe OFF y shared-memory OFF |
| Validación no operativa | Mismo archivo con --console y --validate-config: código nativo **0** |
| Captura de códigos | Prueba --version con handle nativo: código **0** |
| Prueba de parada | Proceso auxiliar inocuo, consola exclusiva y Ctrl+C: código **0** |
| Recursos protegidos | Comprobación previa y posterior de los 303 archivos del datadir protegido y cuatro configuraciones |

La revisión previa registró **278 objetos** del contenedor. No se exigió que el datadir estuviera vacío: esa condición correspondería a una reinicialización, que no se ejecutó.

Comando del único arranque de esta fase, sin secretos:

```powershell
& 'D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe' `
  '--defaults-file=D:\zarate-saas\.tools\misional-isolated\mysql.ini.template' `
  --console
```

El supervisor creó consola nueva oculta, capturas privadas y conservó handles nativos. TMP/TEMP de su proceso se limitaron al directorio exclusivo y se restauraron al finalizar. La configuración conserva `persisted-globals-load=OFF` y `secure-file-priv=NULL`, sin overrides a desarrollo.

A las **10:31:11 -05:00** se acreditó:

- Monitor PID **356** y servidor hijo PID **25796**.
- Ejecutables y argumentos correspondientes exclusivamente a la configuración aislada.
- PID-file con **25796** y un único listener del árbol, **127.0.0.1:3308**, propiedad del servidor.
- Readiness registrado en la captura nueva; ningún servicio MySQL/MariaDB iniciado.

## 3. Mecanismo de autenticación y protección del secreto

Se utilizó PHP portátil 8.4.26 con PDO_MYSQL, sin cargar Laravel ni archivos .env. Se verificó previamente la disponibilidad de `PDO::MYSQL_ATTR_SERVER_PUBLIC_KEY`. Una comprobación inicial por PHP -r falló por escapado de comillas en la línea de comandos, antes de cualquier conexión; se sustituyó por un archivo local cuyo análisis sintáctico y comprobación de capacidades aprobaron. No se inventa una autenticación para ese intento fallido de diagnóstico.

El cliente local leyó la credencial temporal **solo en memoria** desde el log privado de inicialización. No se pasó por argumentos, variables de entorno, documentación o archivos nuevos de credenciales. Se estableció como destino literal `127.0.0.1:3308`, sin nombre de base y sin conexión persistente.

Antes de invocarlo se verificaron nuevamente el proceso y listener y se generó una acreditación local breve con PID, configuración, hash de la clave pública y UUID del archivo local. El cliente exige esa acreditación reciente y los hashes coincidentes. No se publican el UUID ni valores secretos.

Para proteger el intercambio de contraseña se fijó el archivo RSA público local `mysql-data/public_key.pem`. No se pidió una clave arbitraria a la red ni se desactivaron comprobaciones TLS para hacer pasar la conexión. El intercambio RSA de caching_sha2_password protege la contraseña; **no cifra toda la sesión ni constituye certificación TLS**. La CA autofirmada sigue pendiente de revisión para fases posteriores. Referencias: [opciones PDO MySQL](https://www.php.net/manual/en/class.pdo-mysql.php) y [autenticación caching_sha2_password de MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/caching-sha2-pluggable-authentication.html).

## 4. Resultado de autenticación y consultas

Se realizó **un único intento de conexión PDO**. Resultado saneado guardado localmente:

| Campo | Resultado |
| --- | --- |
| Estado del cliente | PASSWORD_CHANGE_REQUIRED |
| Código MySQL | **1862** |
| SQLSTATE | **HY000** |
| connectionEstablished | **false** |
| Consultas explícitas intentadas | **0**, lista queries vacía |
| Código del cliente de diagnóstico | **20**, definido para resultado de autenticación/consulta no completado |

El error 1862 significa que la contraseña está expirada y el cliente debe tratar su cambio antes de poder continuar. Se detuvo el intento, sin activar capacidades para sortear esa política, sin nuevos intentos y sin ALTER USER, SET PASSWORD, GRANT, REVOKE o skip-grant-tables. [MySQL 8.4: tratamiento de contraseñas expiradas](https://dev.mysql.com/doc/refman/8.4/en/expired-password-handling.html).

Se había preparado una selección exclusivamente de lectura para el caso de conexión autorizada y aceptada. **Ninguna se ejecutó**:

| Verificación SQL prevista | Estado |
| --- | --- |
| SELECT de versión, puerto, datadir y server_uuid | NO EJECUTADA: conexión rechazada por expiración |
| USER(), CURRENT_USER(), DATABASE() y CURRENT_ROLE() | NO EJECUTADA |
| SHOW GRANTS FOR CURRENT_USER | NO EJECUTADA |
| Consulta de estado de mysqlx en INFORMATION_SCHEMA.PLUGINS | NO EJECUTADA |

El principal solicitado fue el administrativo inicial, pero **la identidad efectiva y sus grants no se observaron por SQL**. No se presenta el nombre solicitado como resultado de CURRENT_USER(). La DSN no seleccionó base y no se emitió USE; DATABASE() sigue NO VERIFICADO, no un valor obtenido del servidor. No se consultaron tablas con datos personales ni zarate_dev. Tampoco se considera el UUID de auto.cnf como resultado de @@server_uuid.

## 5. Privilegios: observado frente a recomendado

**Privilegios observados: ninguno recuperado.** SHOW GRANTS no pudo ejecutarse. No se atribuyen permisos específicos, roles activos o ausencia de acceso a desarrollo a partir del nombre de cuenta. La cuenta administrativa inicial no debe utilizarse en Pest o Laravel: podría tener autoridad global; su alcance efectivo requiere revisión posterior, no una suposición de mínimos.

Para una fase de aprovisionamiento posterior, aún no autorizada:

- Mantener `zarate_test` y el principal de prueba compatibles con phpunit/tests del proyecto, pero exclusivamente en la instancia nueva y con contraseña propia distinta de la administrativa.
- Limitar grants a ese esquema: operaciones DML necesarias para fixtures/pruebas y DDL de migración estrictamente justificado por las migraciones revisadas. Considerar separar migrador y aplicación. No conceder privilegios globales, GRANT OPTION, administración de usuarios/servidor, FILE ni roles que amplíen el alcance.
- Verificar también grants por host, roles heredados/activos y conexiones secundarias. Denegar acceso a zarate_dev por política de privilegios y separación de instancia; su ausencia física no sustituye comprobar permisos. No probar escrituras negativas sobre desarrollo.
- Revisar las migraciones para fijar la lista final de privilegios de esquema antes de otorgarla; no añadir permisos amplios por comodidad. No se crearon cuentas, bases o grants en esta fase.

Laravel futuro deberá usar APP_ENV=testing, host 127.0.0.1, puerto 3308, base y principal exclusivos, DB_URL controlada, APP_KEY propia y storage/cachés separados. Pest y HTTP conservan sus diferencias de sesión. No activar las plantillas con marcadores ni permitir fallback a .env de desarrollo. Antes de migrar: acreditar identidad SQL, grants, destino efectivo del proceso Laravel y efectos externos. Ninguna configuración activa se modificó ahora.

## 6. Detención y conservación

La autenticación no completada no impidió el cierre: se ejecutó en finally mediante el auxiliar de consola, sin mysqladmin ni autenticación SQL. Se reconocieron exactamente los tres miembros de la consola: monitor, servidor y auxiliar. Se verificaron ejecutables, árbol/PID y pertenencia antes de emitir CTRL_C_EVENT; no se usó terminación forzada.

| Evidencia posterior a las 10:31:22 -05:00 | Resultado |
| --- | --- |
| Auxiliar de cierre | stopped=true, signalSent=true, 3 miembros reconocidos |
| Servidor PID 25796 | Código nativo **0**, cierre completo registrado |
| Monitor PID 356 | **3221225786 / 0xC000013A**, por Ctrl+C; no se sustituye por 0 |
| Procesos mysqld | **0** |
| PID-file | Ausente tras el cierre |
| Captura del motor | **0 ERROR/FATAL y 1 advertencia**, por CA autofirmada |
| Datos de desarrollo | 303 archivos con hashes, tamaños, fechas e inventario conservados |
| Configuración protegida | Cuatro archivos con hashes y ACL conservados |
| ACL del contenedor | 301 objetos inspeccionados después de la sesión, identidades autorizadas |
| Log de inicialización | Hash conservado, sin modificación de la credencial temporal |

La aserción final del supervisor devolvió **salida 1** al exigir que no existiera ninguna entrada TCP en 3308: había **una**, aunque ya no quedaba ningún proceso servidor. La lectura independiente a las **10:32:00 -05:00** identificó estado TCP **11 / TimeWait**, LocalAddress 127.0.0.1, LocalPort 3308, OwningProcess 0. Es un remanente del cierre de la conexión, no un listener de MySQL ni prueba de servidor vivo. No se ocultó la aserción fallida ni se volvió a arrancar para eliminarla. Debe distinguirse listener de estados TCP residuales en la supervisión futura y repetir la comprobación de disponibilidad antes de otro arranque.

La lectura final a las **10:34:52 -05:00** confirmó la desaparición natural de ese estado: **0 procesos MySQL/auxiliares, 0 listeners y 0 entradas TCP en 3308**, sin servicios relacionados y sin PID-file. Los archivos esenciales del motor permanecen presentes y el hash de configuración coincide con el revisado. Se registró aparte en `verification-final.json`; no se reescribió la salida 1 histórica del supervisor.

La apertura y cierre limpios del motor, ausencia de errores y permanencia de archivos de sistema acreditan este ciclo técnico; **no son un chequeo exhaustivo de integridad lógica**. Las escrituras internas normales permanecieron bajo el datadir aislado. No se ejecutaron reparación, borrado, reinicialización ni cambios académicos.

## 7. Archivos de evidencia y bloqueadores

Documentos nuevos: `prompt-09-identidad-sql.md`, copia íntegra del adjunto, y este informe. Se conservan todos los documentos anteriores y resultados, incluido el código de inicialización desconocido y los fallos de supervisión de Prompt 08.

Recursos locales privados nuevos bajo `evidence/prompt09`, ignorados y no publicados: `Run09.ps1`, fuente auxiliar `Session09.ps1`, `Auth09.php`, auxiliares de consola compilados y logs privados; `preflight.json`, `launch.json`, `running-check.json`, `connection-gate.json`, `auth-result.json`, `probe.stop.json`, `server.stop.json` y `result.json`. El gate contiene identidad local técnica, no una identidad SQL aprobada. Ningún recurso local constituye autorización permanente de conexión.

Bloqueador principal: **contraseña temporal expirada**. El cambio requiere otra fase expresamente autorizada, con secreto nuevo privado, identidad de proceso/destino revalidada y revisión del mecanismo para que no termine en argumentos, historiales o logs. No se realizó ese cambio. Tras autorizarlo y ejecutarlo controladamente corresponderá repetir las lecturas de identidad y grants; solo después podrá plantearse crear esquema/principal restringido y validar Laravel.

**Estado: AUTENTICACIÓN PENDIENTE; servidor detenido.** No hay base académica nueva, cuenta de aplicación provisionada ni configuración Laravel verificada. No se ejecutaron migraciones, seeders, Pest o Cypress; **0 pruebas reales ejecutadas**. No se modificaron frontend/backend, .env o permisos; no se instalaron dependencias ni se hicieron commits, push, merge o PR.

Verificación documental: el SHA-256 del prompt coincide con el adjunto; los dos documentos no contienen la contraseña temporal ni bloques de clave privada, comprobado en memoria sin mostrarlos. `git diff --check` y la revisión adicional de los documentos nuevos no detectaron errores; solo hubo aviso de normalización CRLF/LF del prompt. Los archivos locales siguen ignorados y no versionados. Git muestra únicamente los dos documentos nuevos y HEAD sigue en `46431a2`.
