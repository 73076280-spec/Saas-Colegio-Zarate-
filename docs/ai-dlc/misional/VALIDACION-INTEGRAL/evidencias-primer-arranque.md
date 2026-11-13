# Primer arranque y detención de MySQL aislado — Prompt 08

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama: `test/integracion-misional`. HEAD inicial: `ea10ad1` (`docs(qa): verificar inicializacion aislada y planificar primer arranque`). Estado Git inicial limpio.

**Resultado: ARRANQUE Y DETENCIÓN CONTROLADOS, con incidencias de supervisión conservadas.** Se inició una única instancia aislada, se acreditaron disponibilidad técnica y escucha en `127.0.0.1:3308`, y se solicitó su cierre mediante Ctrl+C en su consola exclusiva. El servidor terminó con código nativo **0**, registró cierre completo y quedó detenido. No se ejecutaron SQL, clientes ni aplicaciones.

El proceso monitor de Windows terminó con código distinto: **3221225786 / 0xC000013A** al recibir el evento de consola. No se convierte ese resultado en 0 ni se declara que el supervisor inicial funcionó sin fallos. Las pruebas reales siguen sin habilitarse.

## 1. Revisión y alcance autorizado

Se revisaron íntegramente `plan-aislamiento.md`, `evidencias-correcciones.md`, `evidencias-inicializacion.md` y `evidencias-post-inicializacion.md`, además de la plantilla MySQL, el manifest y `Test-Isolation.ps1`. El procedimiento previsto era `--defaults-file` explícito y `--console`, con captura privada, control de PID/listeners y cierre por evento de consola sin mysqladmin.

La autorización de este prompt comprende el primer arranque y cierre, y las escrituras internas normales exclusivamente bajo `.tools/misional-isolated`. No incluye SQL, rotación de contraseñas, provisión de bases/cuentas, Laravel, migraciones, seeders o tests.

El código de salida de la inicialización del Prompt 06 continúa **desconocido**. Los resultados de esta fase son nuevos y no lo reconstruyen. No se repitió `--initialize` ni se borró o limpió el datadir.

## 2. Precondiciones comprobadas

| Control | Resultado anterior al arranque |
| --- | --- |
| Rama y conservación Git | Rama requerida; sin cambios previos; luego únicamente el prompt nuevo |
| Ejecutable | `D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe`, versión 8.4.11 |
| Identidad del binario | SHA-256 `B83561F885785133B79CFE53F225DFFBDBDEC160EA54B5245CFB30CC7A440FA7` |
| Opciones revisadas | `.tools/misional-isolated/mysql.ini.template`, SHA-256 `7580BE576C1E2FA457786228664C0749230531DC643FBDBEE12836B5FE2272BE` |
| Configuración completa | Las 12 opciones exactas, sin includes, duplicados o destinos adicionales; parser MySQL con defaults-file exclusivo |
| Validación no operativa | `--defaults-file=<archivo revisado> --console --validate-config`, código nativo 0 |
| Recuperación de código nativo | `--version` mediante handle nativo, código 0 y versión esperada |
| Datadir reconocido | 169 archivos antes de arrancar; archivos MySQL/InnoDB esperados presentes y no vacíos |
| Separación de desarrollo | Datadir `.tools/misional-isolated/mysql-data`, distinto de `.tools/mysql-data` protegido |
| Rutas físicas | Rutas absolutas y ancestros sin reparse; revisión de ACL, propietarios y hardlinks dentro del contenedor |
| tmp/log/PID | Destinos exclusivos; sin PID residual antes de arrancar |
| Red y servicios | Sin mysqld activo, conexiones locales en 3308 ni servicios relacionados; no se arrancó o detuvo desarrollo |
| Datos protegidos | 303 archivos conservan hashes, tamaño, fechas UTC y ACL respecto al snapshot previo; cuatro configuraciones protegidas intactas |
| Cierre sin SQL | Prueba auxiliar inocua concluida con Ctrl+C y salida 0 antes del arranque real, tras una primera prueba no concluyente |

La guarda antigua que exige datadir vacío **no se utilizó para aprobar un arranque**. Las verificaciones específicas exigieron el inventario ya inicializado, manteniendo las demás restricciones. `Test-Isolation.ps1` y el manifest de plantilla se conservaron sin cambios: no representan aprobación de una conexión Laravel ni estado operativo actualizado.

## 3. Supervisión local y prueba previa

Se prepararon recursos locales indispensables en `evidence/prompt08` dentro del contenedor privado e ignorado por Git. El supervisor usa APIs Windows para crear una consola nueva **oculta**, redirigir stdout/stderr a archivos privados, conservar el handle del proceso y recuperar el código con GetExitCodeProcess. No instala dependencias ni servicios.

La señal Ctrl+C se implementó mediante un auxiliar que se adjunta exclusivamente a la consola objetivo. Antes de emitirla verifica la lista completa de procesos de esa consola y rechaza miembros ajenos. No se usaron TerminateProcess, taskkill o Stop-Process. TMP/TEMP se limitaron temporalmente al directorio exclusivo durante compilación/ejecución y se restauraron al salir.

Incidencias que se conservan:

1. El primer supervisor probó adjuntar su propio proceso a la consola auxiliar y terminó con salida 1 sin una confirmación utilizable. El auxiliar ya no estaba activo al inspeccionar. **No se había iniciado MySQL**: no existe launch.json de esa preparación. No se atribuye una causa definitiva a ese primer fallo sin registro suficiente. Su código y archivos locales no se sobrescribieron.
2. Se preparó `attempt2`, con un proceso de señal separado. La prueba de control de consola pasó con código nativo 0. No fue un reintento de MySQL: el único arranque real ocurrió después de esta prueba.
3. El supervisor asumía un único mysqld. Windows generó un monitor y un servidor hijo para la misma instancia. La primera guarda de señal rechazó la consola de tres miembros con código **23**; no emitió una señal a una consola no reconocida. El comando supervisor terminó con salida **1**, sin completar su JSON final.
4. Una lectura ordinaria del log abierto también mostró un conflicto de compartición. Se pudo leer después con FileShare.ReadWrite para diagnóstico saneado. No se ocultó esta limitación ni se tomó un archivo temporalmente vacío como prueba de ausencia de disponibilidad.

Se continuó únicamente la inspección y **parada de la instancia ya iniciada**. No se arrancó otra instancia, no se cambió su configuración para forzar aprobación y no se reinicializó.

## 4. Arranque observado

Comando del único arranque real, sin secretos:

```powershell
& 'D:\zarate-saas\.tools\mysql-8.4.11-winx64\bin\mysqld.exe' `
  '--defaults-file=D:\zarate-saas\.tools\misional-isolated\mysql.ini.template' `
  --console
```

Se ejecutó mediante CreateProcess con consola nueva oculta y handles de salida privados, no escribiendo los mensajes del motor en la conversación. Fecha de lanzamiento registrada: **02/11/2026 10:11:44 -05:00**.

| Identidad observada | Evidencia |
| --- | --- |
| Monitor | PID **15224**, creado por el supervisor de esta ejecución |
| Servidor real | PID **26864**, ParentProcessId **15224** |
| Binarios y argumentos | Ambos muestran el ejecutable exacto, defaults-file exclusivo y --console |
| PID-file | `pids/mysql.pid` contenía **26864**, coincidente con el servidor real |
| Listener | Una escucha TCP **127.0.0.1:3308**, propiedad de **26864** |
| Otros listeners del árbol | No observados en la enumeración de ambos PID; no se observó MySQL X |
| Disponibilidad | Marcador MY-010931 / ready for connections en el log nuevo |
| InnoDB | Marcadores MY-013576 y MY-013577 en el arranque nuevo |
| Errores | **0 ERROR/FATAL** en la captura de esta ejecución |
| Advertencias | **1**, MY-010068: CA autofirmada; conservada como limitación TLS, sin cambiar configuración para ocultarla |

Los dos procesos corresponden al mecanismo monitor/servidor de Windows, no a dos datadirs o dos instancias iniciadas manualmente. MySQL documenta esa supervisión para RESTART: [instalación Windows, MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/windows-installation.html). No se ejecutó RESTART ni se añadió --no-monitor durante esta ejecución.

La configuración declarada y parseada mantiene bind loopback, puerto 3308, MySQL X y transportes adicionales desactivados; datadir, tmpdir, logs y PID dentro del contenedor. Se corroboró con argumentos reales, PID-file, listener y archivos internos nuevos dentro del destino aprobado. **No se comprobó @@datadir ni ninguna otra variable por SQL**, ni se enumeraron todos los handles abiertos del sistema. El aislamiento efectivo por SQL sigue pendiente.

`--console` dirigió los mensajes al nuevo `attempt2/server.stderr.private.log`; stdout quedó vacío. El log anterior de inicialización, que contiene la credencial temporal, se conservó byte a byte. Ningún log completo o credencial se copió a documentación.

## 5. Detención segura y códigos reales

Antes de emitir la señal definitiva se verificaron nuevamente PID, relación padre/hijo, ejecutables y configuración del árbol existente. Un auxiliar de cierre abrió handles de consulta/espera de **15224 y 26864**, se adjuntó a la consola del servidor y comprobó que sus **tres miembros** eran exclusivamente monitor, servidor y el propio auxiliar. Solo entonces emitió CTRL_C_EVENT.

El auxiliar conservó ambos handles hasta recuperar los códigos nativos y esperó su finalización. Resultado local en `attempt2/stop-result.json`:

| Resultado | Valor |
| --- | --- |
| Señal emitida | true |
| Miembros de consola reconocidos | 3 |
| Estado final | stopped |
| Código del auxiliar de cierre | **0** |
| Código nativo del servidor 26864 | **0** |
| Código nativo del monitor 15224 | **3221225786 / 0xC000013A** |
| Marcador de cierre | MY-010910 / Shutdown complete, seguido de MY-015016 |

El código del monitor es STATUS_CONTROL_C_EXIT, terminación por Ctrl+C, no una salida 0 ni un código inventado de inicialización. [Microsoft: NTSTATUS](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-erref/596a1078-e883-4972-9bbc-49e60bebca55). Se registra junto con el cierre limpio y salida 0 del servidor; no se confunde la interrupción del monitor con una prueba de corrupción del motor.

La vía de Ctrl+C es compatible con el manejador Windows de MySQL, que solicita shutdown cuando está preparado: [código oficial 8.4.11](https://github.com/mysql/mysql-server/blob/mysql-8.4.11/sql/mysqld.cc#L3266). No se usó autenticación, mysqladmin, cierre forzado de ventanas ni terminación por nombre. No se envió ninguna orden a servicios de desarrollo.

## 6. Comprobación posterior

Snapshot a las **10:15:59 -05:00**:

| Control | Resultado |
| --- | --- |
| Procesos mysqld | **0** |
| Conexiones locales en 3308 | **0**, puerto liberado |
| PID-file aislado | Ausente después del cierre |
| Servicios relacionados | **0**, no se crearon ni controlaron servicios |
| Captura del motor | Readiness y shutdown complete presentes; 0 errores y 1 advertencia TLS |
| Desarrollo | 303 archivos protegidos conservan inventario, hashes, tamaños, fechas y ACL |
| Configuración protegida | Cuatro archivos conservan hashes y ACL: mysql-local.ini, mysql-admin.ini, backend/.env y backend/.env.testing |
| ACL aisladas | 273 objetos revisados con propietarios y reglas de acceso exclusivamente autorizados, sin reparse points |
| Configuración y log anteriores | Hash de plantilla y hash del log de inicialización sin cambios |
| Archivos del datadir | **171**, frente a 169 antes; aparecen `binlog.000001` y `binlog.index` dentro del datadir aislado |
| Cambios internos esperados | Buffer pool y archivos del motor pudieron actualizarse durante arranque/cierre; escrituras normales autorizadas, sin borrar datos para recuperar errores |
| Clientes/SQL/Laravel/tests | **0** invocaciones de clientes SQL; no se ejecutó ninguna de esas operaciones |

La presencia de estructuras, apertura de InnoDB, ausencia de errores y cierre completo con código 0 del servidor permiten acreditar este ciclo técnico. **No equivalen a una certificación exhaustiva de integridad lógica o de cada página del datadir**: no se ejecutaron consultas ni herramientas de reparación o validación invasiva.

## 7. Recursos afectados y evidencia

Los únicos documentos nuevos visibles en Git son los dos solicitados: `prompt-08-primer-arranque.md` (prompt íntegro) y este informe; no se prepararon commits ni se añadieron al índice. No se modificaron documentos anteriores, frontend, backend, `.env`, plantillas, manifest, guarda original o permisos.

Recursos locales indispensables creados, todos ignorados y bajo ACL privadas:

- `evidence/prompt08/Run08.ps1`, prueba de consola y capturas del primer intento auxiliar no concluyente.
- `evidence/prompt08/attempt2/Run08.ps1`, auxiliares locales compilados para prueba/señal y `stop-owned-console.exe` para el árbol verificado.
- `version.*.private.log`, `validation.*.private.log`, capturas de probe/controller/server y de señales.
- `preflight.json`, `launch.json`, `stop-result.json` y `final-verification.json`. No existe un resultado completo aprobado del supervisor inicial; la verificación independiente de cierre está separada.
- Temporales privados de compilación bajo `tmp`, y archivos internos propios del motor dentro del datadir. No se publican estos ejecutores ni binarios.

Los auxiliares tienen alcance de evidencia de esta corrida; el de cierre contiene los PID concretos y **no debe reutilizarse**, porque pueden reciclarse. El supervisor conservado no es una automatización aprobada para nuevos arranques: debe corregirse su manejo del monitor, lectura concurrente y herencia de handles antes de cualquier reutilización. No ejecutar otra vez para fabricar una salida global 0.

## 8. Riesgos y siguiente paso

El objetivo técnico acotado de arrancar, observar y detener se completó mediante verificaciones independientes, pese a las incidencias del supervisor. Se conservan sus fallos, el código no cero del monitor y la advertencia TLS. La inicialización histórica mantiene su código desconocido.

Para otra fase: revisar primero la supervisión y decidir si se aprueba un nuevo arranque seguido de conexión administrativa estrictamente limitada. Solo con autorización de SQL podrá verificarse identidad real de servidor/datadir/puerto/cuenta y establecer el tratamiento de credenciales, antes de provisionar un esquema académico o principal restringido. Revisar TLS, configuración efectiva Laravel, storage, loader, efectos externos y harness Cypress. Ninguna de esas acciones queda ejecutada ni autorizada por este cierre.

**Estado final: ARRANQUE Y DETENCIÓN CONTROLADOS; instancia detenida. Pruebas de integración NO HABILITADAS y 0 pruebas académicas ejecutadas.** No se hicieron commits, push, merge ni PR.

Comprobación final a las **10:19:11 -05:00**: cero procesos MySQL o auxiliares y ninguna conexión local en 3308. El prompt coincide por SHA-256 con el adjunto. Ambos documentos se cotejaron en memoria contra la contraseña temporal, sin imprimirla; no la contienen ni incluyen bloques de clave privada. `git diff --check` y la revisión adicional de los dos documentos nuevos no detectaron errores; únicamente hubo aviso CRLF/LF del prompt. Los recursos locales siguen ignorados y no versionados. Git muestra solo los dos documentos nuevos y HEAD permanece en `ea10ad1`.
