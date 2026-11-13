# Verificación posterior de MySQL y plan de primer arranque — Prompt 07

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama verificada: `test/integracion-misional`. HEAD: `14bb0a5` (`docs(qa): registrar inicializacion MySQL y bloqueo de verificacion`). Estado inicial Git limpio.

**Clasificación: APTO PARA PRIMER ARRANQUE CONTROLADO**, como recomendación técnica para una fase posterior expresamente autorizada. Las evidencias independientes son consistentes con una inicialización finalizada; no se observan indicios de incompletitud en los controles realizados. No se acredita integridad lógica completa ni operación del servidor sin arrancarlo. **No se arrancó MySQL en esta fase y las pruebas de integración siguen sin habilitarse.**

Se conserva el código de salida de `--initialize` como **NO DISPONIBLE**. Esta conclusión nueva no lo reconstruye, no lo sustituye por la salida de `--validate-config` y no modifica el bloqueo ni los resultados históricos del Prompt 06.

## 1. Fuentes y método

Se leyeron íntegramente `prompt-06-inicializacion-mysql.md` y `evidencias-inicializacion.md`. Se inspeccionaron localmente `initialize-attempt.json`, `initialize-result.json`, `post-verification.json`, el inventario de archivos y los snapshots protegidos de `evidence/prompt06`. Se revisó la configuración realmente usada y se contrastó con el datadir actual.

Las verificaciones se ejecutaron como comandos PowerShell de lectura, sin crear scripts ni archivos adicionales en `.tools`. Se emplearon Get-Item/Get-ChildItem/Get-Acl, normalización de rutas, fsutil hardlink list, hashes SHA-256, consultas CIM de procesos/servicios, Get-NetTCPConnection y análisis local de registros. Solo se invocaron `mysqld --version` y `my_print_defaults --defaults-file=<archivo revisado> mysqld`; este último es un parser de opciones, no una conexión SQL. No se ejecutaron `--initialize`, `--validate-config`, clientes ni servidor operativo.

No se ejecutó `Test-Isolation.ps1 -Scope Offline`: su condición de datadir vacío pertenece a la fase anterior a inicialización. Se reemplazó esa condición, exclusivamente en las comprobaciones de esta sesión, por la inspección del datadir poblado y su inventario esperado, conservando los controles de rutas, enlaces, ACL, configuración, procesos y recursos protegidos. El script original no se modificó y no se ocultó un rechazo suyo para fabricar aprobación.

## 2. Evidencias independientes de inicialización

Inspección a las **09:55:23 -05:00**, complementada por comprobaciones a las **09:56:17 -05:00**:

| Elemento | Resultado observado | Alcance |
| --- | --- | --- |
| Estructura del datadir | 169 archivos y 5 directorios; se conservan las 22 entradas superiores documentadas | Inventario compatible con la fase 06 |
| Diccionario de datos | `mysql.ibd` presente y no vacío | Existencia; no se leen tablas ni se valida su contenido lógico |
| Archivos InnoDB | `ibdata1`, `undo_001`, `undo_002`, archivos doublewrite e `ib_buffer_pool` presentes | Estructura esperada; no es una comprobación de páginas/checksums |
| Redo | `#innodb_redo` contiene 32 archivos, todos no vacíos | No se infiere que todos sean activos; no se modifican |
| Directorios de sistema | `mysql`: 6 archivos; `performance_schema`: 113; `sys`: 1; `#innodb_temp` presente | No se exigen archivos .frm de versiones antiguas |
| Identidad local | `auto.cnf` presente, con UUID de formato válido | No se publica el valor ni se equipara a identidad SQL confirmada |
| Historial del motor | `mysql_upgrade_history` presente y JSON parseable | No sustituye una consulta de versión/esquema en ejecución |
| Claves y certificados | CA, servidor, cliente y par RSA presentes y no vacíos | No se mostraron contenidos ni se certificó criptográficamente el material |
| Archivos obligatorios | Cero faltantes en la lista explícita de 14 archivos esenciales revisados | Lista detallada debajo; no pretende enumerar cada archivo interno posible |
| Señales superficiales de operación incompleta | Cero archivos con sufijo .tmp/.temp/.partial en el inventario | No prueba por sí solo ausencia de corrupción |
| Correspondencia con inventario 06 | Cantidades, nombres y tamaños compatibles | El inventario histórico no conserva hashes del datadir nuevo; no se afirma identidad binaria completa |

Los 14 archivos comprobados individualmente como presentes y no vacíos fueron: `mysql.ibd`, `ibdata1`, `undo_001`, `undo_002`, `auto.cnf`, `mysql_upgrade_history`, `ca.pem`, `ca-key.pem`, `server-cert.pem`, `server-key.pem`, `client-cert.pem`, `client-key.pem`, `private_key.pem` y `public_key.pem`.

El log privado conserva **6 líneas**, **0 ERROR/FATAL y 0 advertencias**. El análisis emitió únicamente indicadores y códigos: MY-015017 y MY-015018 para inicio/fin de inicialización; MY-013576 y MY-013577 para inicio/fin de InnoDB; MY-010454 para generación de la credencial temporal; y MY-013169. No se encontraron los términos de diagnóstico aborting/corrupt/failed/incomplete. No se imprimieron líneas del log ni valores de credenciales.

La secuencia de inicio, final de InnoDB, generación de credencial y final de inicialización, junto con los archivos presentes, **permite inferir coherencia suficiente para intentar un primer arranque supervisado**. Es una conclusión técnica acotada, no una certificación de ausencia de cualquier defecto interno. MySQL documenta las estructuras internas y la generación de la contraseña temporal como parte de la inicialización: [procedimiento oficial de MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/data-directory-initialization.html).

## 3. Aislamiento actual

| Control | Resultado de esta fase |
| --- | --- |
| Datadir exclusivo | `D:\zarate-saas\.tools\misional-isolated\mysql-data`, distinto de `.tools/mysql-data` protegido |
| Rutas y enlaces | Ancestros y descendientes inspeccionados sin reparse points; 201 archivos con un único hardlink que corresponde a su propia ruta |
| Propiedad y ACL | 240 objetos inspeccionados; propietarios autorizados, raíz protegida de herencia amplia y reglas Allow solo para las cuatro identidades aprobadas; acceso Modify o superior conservado |
| Configuración exclusiva | `mysql.ini.template` mantiene exactamente sus 12 opciones; parser con defaults-file explícito devuelve esos valores, sin includes ni claves adicionales |
| Destinos auxiliares | tmpdir, logs y PID normalizados dentro del contenedor; no hay PID residual en `pids/mysql.pid` |
| Red | Puerto 3308 sin conexiones TCP locales observadas, incluidos listeners |
| MySQL X y transportes | `mysqlx=0`, named-pipe OFF y shared-memory OFF; desactivación comprobada en configuración, listeners efectivos pendientes del futuro arranque |
| Procesos y servicios | 0 procesos mysqld y 0 servicios relacionados por nombre/ejecutable o referencia explícita al contenedor |
| Desarrollo | Los 303 archivos protegidos conservan inventario, SHA-256, tamaños, fechas UTC de modificación y ACL frente al snapshot anterior a inicialización |
| Configuraciones protegidas | `.tools/mysql-local.ini`, `.tools/mysql-admin.ini`, `backend/.env` y `backend/.env.testing`: hashes y ACL conservados, sin imprimir contenido |

Se confirmó nuevamente MySQL **8.4.11** por el ejecutable absoluto usado en Prompt 06. Sus hashes siguen coincidiendo con `initialize-attempt.json`:

- Binario `.tools/mysql-8.4.11-winx64/bin/mysqld.exe`: `B83561F885785133B79CFE53F225DFFBDBDEC160EA54B5245CFB30CC7A440FA7`.
- Archivo `.tools/misional-isolated/mysql.ini.template`: `7580BE576C1E2FA457786228664C0749230531DC643FBDBEE12836B5FE2272BE`.

La configuración mantiene bind `127.0.0.1`, puerto 3308, basedir portable y rutas exclusivas para datadir, tmpdir, log y PID. `persisted-globals-load=OFF` evita overrides persistidos y `secure-file-priv=NULL` deshabilita importación/exportación de archivos. No se aceptaron rutas deducidas ni defaults críticos ausentes.

Estos resultados son una observación puntual, sin reserva del puerto ni exclusión de carreras. Las consultas de servicios/procesos inspeccionan las identidades y comandos disponibles; no enumeran todos los handles ni configuraciones indirectas de cualquier programa del equipo. Deben repetirse antes de un arranque futuro.

## 4. Credenciales

Se comprobó únicamente que existe el registro de generación de credencial temporal y que el log y los archivos de claves heredan las ACL privadas comprobadas. `.tools` continúa siendo un recurso local no destinado a Git. No se mostraron, copiaron a documentación ni utilizaron contraseñas para autenticación.

Existe un procedimiento documentado para una fase posterior: después de autorizar y verificar la instancia, usar el cliente administrativo exclusivo con entrada privada de la credencial temporal y cambiarla mediante el mecanismo normal de cuenta expirada. Antes de hacerlo se deberán revisar la captura de entrada, los historiales y los logs para impedir que guarden la nueva contraseña. No pasarla en argumentos ni publicar sentencias con valores; no usar skip-grant-tables o initialize-insecure. La rotación requerirá autorización de conexión y SQL, **no incluida en esta fase ni en el primer arranque propuesto sin clientes**. Referencia: [asignación posterior de contraseña, MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/data-directory-initialization.html).

## 5. Código de salida faltante y decisión

El `exitCode: null` del registro anterior sigue siendo desconocido. El `initialized: false` de ese registro era un cálculo del supervisor ante el código ausente, no prueba de que no existan estructuras. No se alteraron esos campos ni se recuperó retrospectivamente un código.

La falta de ese dato impide afirmar que el proceso de inicialización terminó con salida nativa 0. No anula, por sí sola, los indicadores independientes observados hoy. No hay indicios positivos de inicialización incompleta en el alcance de la inspección actual; quedan sin acreditar la apertura real del diccionario/InnoDB, integridad lógica, autenticación, grants, listeners y cierre limpio del servidor operativo.

**Recomendación: permitir planificar un primer arranque acotado y supervisado de la instancia existente**, con nueva autorización de ejecución, sin SQL, clientes ni aplicación. No hay motivo demostrado para reinicializar o borrar. La clasificación APTO de esta fase no reescribe el BLOQUEADO histórico del Prompt 06 ni habilita aprovisionamiento o pruebas reales.

## 6. Plan de primer arranque — NO EJECUTADO

### Precondiciones y alcance

1. Obtener autorización explícita para primer arranque y parada limpia de esta única instancia; mantener prohibidos SQL, clientes, Laravel, migraciones y tests. Repetir rama/Git, hashes, rutas, ACL, puerto, procesos y servicios. No exigir datadir vacío: exigir el inventario inicializado reconocido y rechazar desviaciones sin revisión.
2. Conservar los logs de inicialización y la evidencia anterior. Preparar supervisión y registros nuevos privados en otra fase, con ACL comprobadas, sin sobrescribir evidencia. El arranque escribirá archivos normales del motor en el datadir aislado: no es una operación offline de solo lectura.
3. Usar exactamente el binario y archivo de opciones anteriores, sin `--initialize` y sin instalar servicio Windows. Mantener bind/puerto/datadir/tmpdir; no permitir includes o overrides de destino. TMP/TEMP del proceso hijo deben quedar dentro del contenedor, sin cambios globales.
4. Preparar una consola exclusiva y supervisada que permita cierre por control de consola; no iniciar en una ventana oculta desacoplada sin mecanismo de parada limpio. No compartir esa consola con desarrollo. Un supervisor futuro debe conservar el handle y capturar el código nativo antes de descartar/refrescar su estado; validar primero esa captura con una operación inocua como `--version`.

### Invocación prevista

La invocación propuesta es el ejecutable absoluto `D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe`, primer argumento `--defaults-file=D:\zarate-saas\.tools\misional-isolated\mysql.ini.template`, seguido únicamente de `--console` para la modalidad de control de consola propuesta. **No se ejecutó.**

La adición de `--console` debe revisarse antes de esa fase: habilita el manejador de control de consola en Windows y puede dirigir el diagnóstico a consola en lugar del archivo log-error. Debe capturarse en un destino nuevo privado dentro de `logs`, sin mostrar la salida cruda ni asumir que seguirá en mysql-error.log. No cambia los destinos de datos o red. Si la captura y el control de consola no están garantizados, no arrancar. Fuentes: [manual de arranque Windows](https://dev.mysql.com/doc/refman/8.4/en/windows-start-command-line.html) y [código oficial MySQL 8.4.11: console_event_handler/my_init_signals](https://github.com/mysql/mysql-server/blob/mysql-8.4.11/sql/mysqld.cc#L3266).

### Verificaciones durante la ejecución futura

- Registrar PID nuevo, hora de creación, ruta del ejecutable y argumentos; cotejar PID-file y proceso, sin confiar en un PID histórico que puede haberse reutilizado.
- Observar el listener del PID exacto: solo TCP loopback 127.0.0.1:3308; inventariar todos sus listeners, no limitarse a buscar 3308. Bloquear si aparece X, interfaz general u otro destino inesperado.
- Analizar únicamente la porción nueva del log/captura privada: arranque completado/readiness, apertura InnoDB/diccionario y ausencia de errores críticos. No conectar un cliente para comprobar salud en esta fase. Un listener solo no prueba funcionamiento SQL.
- Verificar que configuración, ACL, servicios y recursos de desarrollo no cambiaron. Fijar ventana breve de observación y un timeout de arranque antes de ejecutar; si no aparece readiness, conservar diagnóstico y no intentar un segundo arranque automático.
- Ante incompatibilidad de PID/ruta, escucha indebida, corrupción, errores de permisos o fallo de motor, impedir cualquier conexión/aprovisionamiento y activar el cierre limpio supervisado. No intentar reparar desarrollo, cambiar permisos amplios ni limpiar datos.

### Cierre seguro sin clientes

Para la modalidad `--console`, proponer **Ctrl+C exclusivamente en la consola dedicada al proceso aislado**, conservando la supervisión hasta completar el cierre. El código oficial 8.4.11 registra ese evento y solicita cierre limpio cuando la infraestructura de shutdown está lista; durante el arranque temprano puede ignorarlo. No se promete que Ctrl+C interrumpa cualquier bloqueo inicial ni se simula su validación aquí. [Fuente del manejador Windows](https://github.com/mysql/mysql-server/blob/mysql-8.4.11/sql/mysqld.cc#L3274).

Esperar el marcador de cierre completo, recuperar el código nativo, comprobar desaparición del PID identificado y liberación de sus puertos. Si no responde, conservar supervisión y pedir revisión; no usar taskkill, Stop-Process por nombre, cerrar la ventana a la fuerza o detener servicios del equipo. Si esa vía no puede habilitarse con seguridad, **no iniciar** bajo la restricción de cero clientes. `mysqladmin shutdown` es una alternativa documentada que utiliza una conexión administrativa, por lo que requeriría otra autorización y verificación de identidad; no se incluye en este primer arranque sin clientes.

### Fases posteriores distintas

Solo después de una nueva autorización de clientes/SQL: verificar versión, host/puerto, datadir y UUID reales de la instancia, identidad autenticada y permisos/grants, sin tomar un archivo local como sustituto. La contraseña administrativa temporal no se reutiliza en Laravel. Esquema académico, cuenta restringida, APP_KEY, configuración efectiva Laravel, storage y harness Cypress quedan para fases separadas. No crear datos académicos hasta acreditar esos controles.

## 7. Alcance documental y pendientes

Se crean únicamente este informe y `prompt-07-verificacion-post-inicializacion.md`, copia íntegra del adjunto. No se modificaron evidencia anterior, scripts, plantillas, manifest, ACL ni contenido de `.tools`. No se ejecutaron SQL, clientes, reinicialización, arranque, cambio de contraseñas, aprovisionamiento, migraciones, seeders, Pest o Cypress. No se modificó código funcional ni se hicieron commits, push, merge o PR.

Las comprobaciones de archivos/rutas/procesos son verificaciones técnicas de lectura, no pruebas de integración: **0 pruebas reales ejecutadas**. Persisten el código nativo histórico desconocido, la integridad lógica no comprobada y todas las comprobaciones de operación/SQL/Laravel. El plan de primer arranque todavía debe autorizarse y concretar su supervisión antes de ejecutarse.

Comprobación documental: SHA-256 del prompt igual al adjunto; los dos documentos se cotejaron en memoria contra la credencial temporal, sin imprimirla, y no contienen esa credencial ni bloques de clave privada. `.tools/misional-isolated` sigue sin archivos versionados y el log está ignorado. `git diff --check` y la revisión adicional de los documentos nuevos no detectaron errores; solo hubo aviso de normalización CRLF/LF del prompt. Git muestra únicamente los dos documentos nuevos y HEAD permanece en `14bb0a5`.
