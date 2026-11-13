# Primera migración controlada — Prompt 17

Fecha: **03/11/2026**, America/Lima. Repositorio `D:\zarate-saas`; rama `test/integracion-misional`; HEAD inicial `94b06cb` (`docs(qa): cerrar guardas SQL y preparar ejecutor de migraciones`). Git inicialmente limpio.

**Resultado: FALLO DE MIGRACIÓN — ESQUEMA CONSERVADO.** Se intentó una única operación convencional. Se creó exclusivamente la tabla **migrations** y el ejecutor se detuvo por una incompatibilidad del adaptador antes de ejecutar el primer up. **0 de 14 migraciones aplicadas/registradas según el ejecutor y su ledger; ninguna tabla académica creada.** No se reintentó, borró, revirtió o reinicializó el esquema.

PHP devolvió **21**, el supervisor PowerShell terminó con error/salida **1** y MySQL cerró correctamente con código nativo **0**. La validación integral y las pruebas funcionales **no están aprobadas**. Pest, Cypress y seeders **NO EJECUTADOS**.

## 1. Alcance y recuperación del trabajo

Se revisaron los informes de base/cuenta, TLS, adaptadores, guardas SQL y ejecutor; se reutilizaron los perfiles, credencial restringida, certificado y supervisor existentes. Se inspeccionaron las migraciones y el código instalado del migrador/repositorio/eventos de Laravel. No se creó otro entorno ni se modificaron migraciones, backend/frontend o .env activos.

La autorización del Prompt 17 se interpretó exclusivamente para crear objetos nuevos en zarate_test vacío y registrar las migraciones. Se mantuvieron prohibidos DROP DATABASE/TABLE, TRUNCATE, limpiezas, seeders, rollback/reset/fresh, DML institucional y conexiones ajenas. La política solo admitía ajustes del scaffold si la tabla se había creado durante este ciclo; la eliminación de users.name/índice global también exigía users vacío y el archivo SaaS exacto. **Esos ajustes no llegaron a ejecutarse**.

La comprobación final de hashes preservó **73 archivos JSON de resultados anteriores de los Prompts 15 y 16**, sin modificaciones. Los documentos anteriores también se conservaron; los únicos nuevos documentos destinados a Git son el prompt íntegro y este informe.

## 2. Archivos locales preparados

Todos bajo `.tools/misional-isolated`, ignorados por Git:

| Recurso | Cambio |
| --- | --- |
| `evidence/prompt17/Scope17.php` | Capacidad acotada a una operación, ledger de objetos nuevos, validación de SQL/archivo activo, eventos y reserva persistente migration.once |
| `evidence/prompt17/Executor17.php` | Entrada fija para perfil pest; configura servicios/facades mínimos, sesión, repositorio/migrador y verificación; conserva el parcial ante fallo |
| `evidence/prompt17/PolicyChecks17.php` | Pruebas puras de política con fixtures; no envían las cadenas SQL a un servidor |
| `evidence/prompt17/RootCause17.php` | Reproducción posterior del defecto del nombre lógico, sin conexión SQL y sin corregir el código de ejecución |
| `evidence/prompt14/MigrationGuard14.php` | Reutiliza identidad/grants/PDO existentes y admite exclusivamente una capacidad MigrationScope17 en fase prompt17; diagnósticos anteriores siguen cerrados a escritura |
| `evidence/prompt16/Control16.php` | Mantiene run/reset/rollback ordinarios bloqueados; agrega runAuthorized17 tipado y ligado a capacidad, rutas y objetos exactos |
| `evidence/prompt15/Run15.ps1` / `CheckLive15.ps1` | Supervisor/verificador compartidos con fase prompt17 y capturas propias. Identidad/proceso se comprueban en cada validación; ventana fija de esta fase de 600 segundos, frente a 120 de los diagnósticos anteriores |

Se respaldó el código previo de los cuatro componentes compartidos en `evidence/prompt17/backup`. No se copiaron claves privadas ni se cambió la configuración de desarrollo. No se agregó un argumento que omita todas las guardas.

## 3. Precondiciones realmente comprobadas

Antes de la escritura de esquema se acreditó:

- PHP portable **8.4.26**, ruta/hash esperados; MySQL **8.4.11** y opciones explícitas aisladas.
- Proceso/árbol propios, PID-file, listener **127.0.0.1:3308**, configuración, datadir/UUID y ausencia de servicio ajeno; prueba auxiliar de cierre y validate-config con salida 0.
- Laravel **testing**, base/usuario **zarate_test**, cuenta efectiva **zarate_test@127.0.0.1**, sin root; TLS estricto con CA/IP verificados y **TLS_AES_256_GCM_SHA384**.
- Exactamente dos filas SHOW GRANTS: USAGE global y nueve permisos del esquema literal zarate\_test, sin delegación, roles activos o grants a otras bases. No se consultó zarate_dev.
- **0 tablas** en el esquema antes de escribir; evidencia vigente en `empty-schema.json`. No se reutilizó una aprobación histórica como permiso de escritura.
- Repositorio/migrador/resolver sobre la misma conexión PDO acreditada; sesiones/caché array, storage/caches/temporales privados, cola null y correo array. XML PHPUnit procesado en el mismo proceso con precedencias controladas, sin ejecutar su runner.
- Facades DB/Schema y caché mínima vinculadas a esa Application, sin arrancar providers/kernel completos. SET NAMES y sql_mode de sesión ejecutados y comprobados antes de entrar en la migración convencional.

**Limitación que no detectó el preflight:** igualdad de PDO e identidad SQL no garantizaban que el objeto Connection tuviera configurado su **nombre lógico** para el cambio de conexión que hace Migrator::runMethod. Ese control faltó y causó la detención tras crear el repositorio. No se presenta el conjunto de precondiciones como una garantía completa que hubiera sido suficiente.

## 4. Revisión de las 14 migraciones

La vista previa estática volvió a aprobar **14 nombres/hashes coincidentes** con el inventario revisado. No cargó ni ejecutó los métodos de migración. No se identificaron en esos archivos conexiones explícitas ajenas, triggers/eventos/procedimientos externos, importaciones de datos o seeders automáticos. La política SQL adicional no admitía esos tipos de operación.

Dependencias revisadas: scaffold users antes de SaaS; instituciones antes de estructura académica/personas; estructura/personas antes de matrículas/cursos; cursos/unidades antes de actividades/evaluación/asistencia; oficina/notificaciones después de sus referencias. Las FK, índices únicos/compuestos y columnas generadas exigen ese orden y MySQL real.

Se conservaron como riesgos: los down eliminan objetos y no deben ejecutarse para limpiar; la migración SaaS contiene DROP de columna/índice del scaffold y DML condicional para usuarios preexistentes; la migración de permisos borra una entrada de caché y requiere store array. La capacidad solo habría permitido INSERT de metadatos en migrations, no INSERT/UPDATE de usuarios o instituciones. Ninguna de esas ramas se ejecutó.

| Orden | Archivo en backend/database/migrations | Resultado de esta operación |
| --- | --- | --- |
| 1 | 0001_01_01_000000_create_users_table.php | NO APLICADA; detención al preparar la conexión antes de up |
| 2 | 0001_01_01_000001_create_cache_table.php | NO EJECUTADA |
| 3 | 0001_01_01_000002_create_jobs_table.php | NO EJECUTADA |
| 4 | 2026_10_01_131619_create_personal_access_tokens_table.php | NO EJECUTADA |
| 5 | 2026_10_01_131621_create_permission_tables.php | NO EJECUTADA |
| 6 | 2026_10_01_150000_create_saas_core.php | NO EJECUTADA |
| 7 | 2026_10_01_160000_create_academic_structure.php | NO EJECUTADA |
| 8 | 2026_10_01_170000_create_people.php | NO EJECUTADA |
| 9 | 2026_10_02_000000_create_enrollment_tables.php | NO EJECUTADA |
| 10 | 2026_10_02_120000_create_courses_and_teacher_assignments.php | NO EJECUTADA |
| 11 | 2026_10_02_140000_create_classroom_tables.php | NO EJECUTADA |
| 12 | 2026_10_04_100000_create_learning_tables.php | NO EJECUTADA |
| 13 | 2026_10_05_100000_create_attendance_tables.php | NO EJECUTADA |
| 14 | 2026_10_05_110000_create_academic_office_tables.php | NO EJECUTADA |

## 5. Operación ejecutada y resultados

Lanzador utilizado una sola vez:

```powershell
.tools/misional-isolated/evidence/prompt15/Run15.ps1 -EvidencePhase prompt17
```

Invocó Executor17.php pest con PHP portable. La ruta autorizada creó el repositorio migrations y llamó **una vez** al Migrator convencional de Laravel con pretend=false y step=false; no se llamó a Artisan genérico. El motor permitió la creación de migrations y la guarda detuvo el paso al primer up. No hubo una segunda operación de migración.

| Evidencia | Resultado exacto |
| --- | --- |
| Política offline | **16 controles aprobados, 0 fallidos**; 13 rechazos y tres casos permitidos sintéticos; cero SQL/conexiones |
| Inventario estático | **0**, 14 archivos/hashes aprobados, cero SQL |
| Entrada PHP de migración | **21 / MIGRATION_FAILED_SCHEMA_PRESERVED**, etapa CONVENTIONAL_MIGRATION |
| Error fatal capturado | RuntimeException, **ISOLATION_BLOCKED_39**; SQLSTATE y código nativo SQL null, no una excepción SQL fatal capturada |
| Supervisor | Salida/error **1** después del cierre; mensaje histórico “Pest diagnostic blocked” no significa que se ejecutara Pest |
| Conexiones | **1**, con zarate_test |
| Ledger de sentencias exitosas | Dos configuraciones de sesión, tres lecturas Laravel y **un CREATE TABLE migrations**; **0 INSERT de metadatos**, 0 cambios en tablas académicas |
| Lecturas de guarda | **60** llamadas registradas por la guarda; además siete lecturas auxiliares de Scope y la consulta de inventario en el manejador de fallo |
| Estado posterior leído | Únicamente **migrations**, devuelto por INFORMATION_SCHEMA tras el fallo |
| Migraciones aplicadas/registradas | **0/14**, según el flujo/ledger; no se ejecutó un conteo SQL posterior de filas de migrations |
| Reproducción del defecto | **0 / ROOT_CAUSE_REPRODUCED_OFFLINE**, sin conectar a MySQL |
| Pest/Cypress/seeders | **0 ejecutados**; no aprobados ni simulados como suites |

No se declara que hubiera cero escrituras: **sí se creó migrations**. Los dos SET cambian estado de sesión, no datos institucionales. La tabla quedó preservada. La instrumentación distingue intentos de sentencias y eventos QueryExecuted exitosos; el rechazo final fue anterior al primer up y no figura como DDL académico ejecutado.

### Advertencias y límites de la instrumentación

El ledger guardó seis observaciones de SHOW WARNINGS con **Level=Error y Code=1295**, una por cada sentencia exitosa monitorizada. No se conservó el texto de mensaje y no se acreditó en esta fase si esas entradas proceden del protocolo/preparación de la consulta diagnóstica o de la sentencia observada. **No se presentan como seis migraciones fallidas ni como seis errores fatales del motor, tampoco se ocultan.** La recopilación de advertencias deberá revisarse antes de otra ejecución.

El log de proceso del servidor registró **0 ERROR/FATAL y una advertencia**; esto es un indicador distinto del diagnóstico de sesión anterior. La causa de detención de PHP fue el rechazo de la guarda, no un código SQL 1295 capturado como excepción fatal.

No se ejecutó el bloque completo de verificación de 52 tablas, filas, engines y FK porque no se completaron las migraciones. La integridad estructural académica y las restricciones resultantes quedan **NO VERIFICADAS**; las tablas requeridas no se crearon. La ausencia de tablas académicas está comprobada por inventario, no por pruebas funcionales.

## 6. Causa reproducida sin SQL

La conexión de `LiveSqlGuard15` se construye con MySqlConnection y un config sin clave **name**. Puede apuntar al PDO y esquema correctos y, aun así, devolver **null** desde getNameWithReadWriteType.

Laravel Migrator::runMethod ejecuta setDefaultConnection(connection->getNameWithReadWriteType()) antes de llamar a up. PinnedResolver16::setDefaultConnection solo admite mysql. Al recibir null, rechaza en **Control16.php, línea 39**. El código ISOLATION_BLOCKED_39 por sí solo no incluía el archivo; se contrastó con las rutas del framework y la reproducción offline.

RootCause17.php construyó dos Connection con una closure que impide abrir PDO. Confirmó que la conexión sin name devuelve null y el resolver la rechaza; una conexión de prueba con name=mysql devuelve mysql y el método del resolver la admite. **No modifica la conexión usada ni aplica la corrección; no ejecuta SQL.**

Corrección mínima propuesta para revisión posterior: asignar el nombre lógico mysql al config de la instancia Laravel **antes** de construir la Connection guardada, conservando el mismo PDO, endpoints, fingerprint y validación estricta. No se recomienda aceptar null en el resolver ni permitir fallback. Añadir una comprobación de getName/getNameWithReadWriteType al preflight y verificar el ciclo de cambio/restauración de conexión de Migrator sin escrituras antes de otra operación real.

No se corrigió el ejecutor después del fallo para reintentarlo dentro de este prompt. Se conservó el esquema parcial y su reserva migration.once; no se quitó el bloqueo para aparentar éxito.

## 7. Cierre y preservación

Preflight a las **14:40:25 -05:00**: **773 objetos** privados revisados; binario, rutas, hashes/opciones, ACL/propietarios y enlaces comprobados; prueba de cierre, versión y validate-config con salida 0. Monitor **16436**, servidor **27200**, único listener de su árbol 127.0.0.1:3308.

Cierre a las **14:41:10 -05:00**: servidor **0**, monitor **3221225786 / 0xC000013A** por Ctrl+C, shutdown completo. Se detuvo solo el árbol propio con handles/consola verificados; no hubo taskkill, root o acciones sobre servicios de desarrollo.

Después se revisaron **801 objetos** y se compararon los **303 archivos de desarrollo y cuatro configuraciones protegidas**, sin cambios por inventario, hashes/metadatos y ACL. Log histórico de inicialización intacto. No se alteraron .env, código funcional, migraciones, cuentas, contraseñas o grants. No se accedió a bases institucionales.

Snapshot independiente a las **14:44:24 -05:00**: **0 mysqld, 0 listeners en 3308/8001/5174, sin PID-file y 0 archivos generados en storage/caches bootstrap**. No se volvió a iniciar MySQL después del fallo.

La preservación de zarate_dev se apoya en los snapshots de desarrollo y el alcance de la cuenta/SQL permitido; no se abrió una conexión a esa base para comprobarla. Los archivos internos del datadir aislado sí cambiaron por el arranque, el CREATE autorizado y el cierre, y no se presentan como intactos.

## 8. Recuperación y siguiente etapa

Antes de escribir se guardaron `empty-schema.json` y `recovery-plan.txt`. El plan aplicado tras el fallo fue detener nuevas escrituras, conservar el parcial/ledger/error y cerrar MySQL. **No se creó una copia binaria del datadir ni existe una restauración automática preparada como resultado aprobado de esta fase.** Los backups locales citados son de código de control, no una copia de los datos.

La condición original de esquema con cero tablas **ya no se cumple**: existe migrations. Para continuar se necesita una nueva revisión y autorización específica de recuperación/continuación que:

1. Corrija y pruebe offline el nombre lógico de la Connection y revise el colector de advertencias, manteniendo las demás guardas.
2. Inspeccione solo con lecturas el esquema conservado: DDL/filas de migrations, ausencia de otras tablas/triggers y estado real de metadatos. No asumir conteos no consultados.
3. Determine si puede retomarse usando esa tabla de repositorio vacía, verificando su estructura y sin borrarla. No relajar genéricamente la condición de vacío ni quitar migration.once como una limpieza implícita.
4. Autorice, si corresponde, una nueva capacidad acotada de continuación, con la misma conexión fijada, manifest/hashes y prohibiciones, evidencia de recuperación y cierre disponibles.

No ejecutar migrate:fresh/reset/rollback, db:wipe, seeders, DROP/TRUNCATE, reinitialización ni edición de registros migrations para forzar una repetición. Si se necesita reparar/restaurar, conservar primero la evidencia y someter el plan concreto a revisión.

## 9. Evidencias y documentación

Recursos principales en `evidence/prompt17`: policy-checks-final.json, manifest-review.json, empty-schema.json, recovery-plan.txt, migration.once, operation-ledger.json, auth-result.json, preflight.json, running-check.json, server.stop.json, result.json, root-cause-result.json, preservation-result.json y final-state.json. Los fixtures de política están separados de los resultados reales y no prueban que se ejecutaran sus SQL.

Se conserva íntegro el prompt en `prompt-17-migracion-controlada.md`. Los archivos locales no se publican y los documentos/evidencias anteriores no se reescriben. No se instalaron dependencias ni se hicieron commits, push, merge o PR.

Cierre documental: el prompt coincide por SHA-256 con el adjunto. La primera auditoría de secretos de esta fase revisó **103 archivos**, incluidos los dos documentos y componentes locales compartidos, con **0 coincidencias fuera de sus recursos dedicados**; no se publicaron valores o hashes de autenticación. Los siete archivos PHP preparados/modificados, incluido el auditor y la reproducción, aprobaron sintaxis; los dos scripts PowerShell compartidos pasaron el parser. `git diff --check` y las comprobaciones adicionales de whitespace de ambos documentos no detectaron errores; solo se advirtió CRLF/LF del prompt. `.tools` sigue ignorado y sin archivos rastreados; Git solo muestra los dos documentos nuevos de Prompt 17.

Inspección de cierre adicional a las **15:28:14 -05:00**, en `closure-state.json`: **0 mysqld, 0 listeners candidatos y PID-file ausente**, sin volver a iniciar servicios ni abrir SQL.

**Estado final: FALLO DE MIGRACIÓN — ESQUEMA CONSERVADO.** Una tabla nueva de metadatos, ninguna migración académica aplicada, servidor detenido y desarrollo preservado. No se declara completada la validación integral.
