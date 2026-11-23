# Prompt 22 — Recuperación segura: diagnóstico y parada

Fecha: 04/11/2026, America/Lima. Rama comprobada: `test/integracion-misional`.

**Cierre: BLOQUEO POR DIFERENCIAS CRÍTICAS.** Se aplicó la parada expresa de la fase 2: «Si existe una diferencia crítica sin resolver, detener la intervención y documentarla». Se encontraron cambios físicos no explicados en los tablespaces de usuarios y auditoría de desarrollo. No se demuestra corrupción ni acceso indebido; tampoco existe evidencia suficiente para aprobar su procedencia. No se ejecutaron las fases 3–5 ni se modificó la guarda, SQL o los servicios.

## Estado y revisión

Git inicialmente conserva dos documentos no rastreados del Prompt 21: prompt-21-finalizacion-migraciones.md y evidencias-finalizacion-migraciones.md. No se descartaron ni editaron. Los informes 16–19 y 21 y los controles actuales mantienen la secuencia: ejecutor preparado, primer fallo del resolver, corrección de nombre lógico, quinta parcial, diagnóstico de recuperación y bloqueo. No se encontró documentación del Prompt 20 ni directorio de evidencia de esa fase. La búsqueda de nombres con 20 dentro de misional-isolated solo devolvió archivos internos del motor, que no son evidencia de recuperación.

Snapshot utilizado: `.tools/misional-isolated/evidence/prompt06/protected-datadir-before.json`; configuraciones: protected-config-before.json. Son referencias históricas, no una instantánea de esta intervención. No se reemplazaron ni actualizaron para hacer pasar controles.

## Comparación detallada

Se repitió la comparación de existencia y SHA-256 sin leer filas de negocio: **22 diferentes, cuatro ausentes y dos agregados**. Todas las rutas corresponden a **herramientas locales / archivos físicos de MySQL** fuera del código rastreado. Ninguna entrada es fuente, configuración de Laravel, migración, documentación o prueba. Por ello Git no permite atribuirles una evolución legítima; los hashes solo demuestran diferencias físicas.

Categorías:

- **E — Esperable por naturaleza del archivo:** temporal, PID, redo, undo, doublewrite o binlog; actividad, reinicio y rotación del motor pueden explicar cambios. No se confirma que esa sea la causa histórica concreta. No constituyen por sí mismos un defecto de Laravel ni de la conexión aislada.
- **I — Inspección adicional:** tablespace del sistema y diccionario. Un cambio puede ser normal, pero no se puede concluir equivalencia de esquema, cuentas o seguridad a partir de hashes.
- **C — Crítica no resuelta:** tablespaces de users y audit_logs en zarate_dev. Pueden cambiar incluso por mantenimiento físico, sin cambio lógico de filas. No se conocen operación, autor ni momento causal. No se aprueba su legitimidad ni se infiere manipulación de datos. Impiden continuar bajo la condición de preservación histórica actual.

| Ruta exacta | Estado | Categoría | Explicación y efecto |
| --- | --- | --- | --- |
| `D:\zarate-saas\.tools\mysql-data\#ib_16384_0.dblwr` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\binlog.000001` | Ausente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\binlog.000002` | Ausente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\binlog.000003` | Ausente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\binlog.000017` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\binlog.index` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\ibdata1` | Diferente | I | Sistema/diccionario del motor; contenido lógico y seguridad no acreditados. |
| `D:\zarate-saas\.tools\mysql-data\ibtmp1` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\IDC.pid` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\mysql.ibd` | Diferente | I | Sistema/diccionario del motor; contenido lógico y seguridad no acreditados. |
| `D:\zarate-saas\.tools\mysql-data\undo_001` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\undo_002` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_redo\#ib_redo109` | Ausente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_redo\#ib_redo110` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_1.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_10.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_2.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_3.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_4.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_5.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_6.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_7.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_8.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_temp\temp_9.ibt` | Diferente | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\zarate_dev\audit_logs.ibd` | Diferente | C | Datos de desarrollo; procedencia pendiente. Parada obligatoria; no restaurar. |
| `D:\zarate-saas\.tools\mysql-data\zarate_dev\users.ibd` | Diferente | C | Datos de desarrollo; procedencia pendiente. Parada obligatoria; no restaurar. |
| `D:\zarate-saas\.tools\mysql-data\binlog.000018` | Agregado | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |
| `D:\zarate-saas\.tools\mysql-data\#innodb_redo\#ib_redo141_tmp` | Agregado | E | Archivo operativo mutable o rotación compatible con uso normal; causa no probada. |

Resumen: **24 entradas E, dos I y dos C**. E describe la función de los archivos, no una aprobación forense de sus cambios. Hay 301 archivos actuales frente a 303 históricos: cuatro ausencias y dos incorporaciones. No se inspeccionó contenido de binlogs, páginas de datos, cuentas o información personal.

Todas estas diferencias afectan al preflight de migraciones: `evidence/prompt15/Run15.ps1`, función CheckProtected, exige inventario, timestamps, ACL, longitud y hashes originales; se invoca antes de arrancar MySQL. La comprobación por hashes ya incumple esa condición. No se ejecutó el supervisor para provocar otro rechazo ni se relajó la condición. Los archivos de desarrollo no son el datadir aislado, pero el contrato actual los protege; no se puede ignorar su diferencia silenciosamente.

La evidencia no permite decidir si la actividad legítima de la demostración explica los dos tablespaces de negocio. Para resolverlo se necesita correlación con el uso autorizado de demostración, evidencias de operaciones y política de preservación. No corresponde reconstruir datos, inspeccionar binlogs con datos personales o aprobar un nuevo baseline automáticamente. Un futuro baseline deberá conservar la referencia histórica y distinguir preservación durante una intervención de igualdad con una instantánea antigua.

## Guarda: diagnóstico conservado, corrección no aplicada

El supervisor existente genera connection-gate.json tras acreditar el arranque del árbol MySQL. La vigencia comienza en unixTime; CheckLive15.ps1 comprueba edad antes de consultas CIM, listener y hashes. Ventana de 600 segundos en fases 17/18 y 120 en las demás. No hay rechazo final por edad antes de devolver LIVE_PROCESS_VERIFIED.

El informe 19 reconstruye un CREATE a 1.659 segundos del gate y rechazo posterior ISOLATION_BLOCKED_34. La causa física del retraso no quedó demostrada. El orden actual permite que una inspección costosa termine con autorización caducada. MigrationGuard14.php conserva el PDO exacto, CONNECTION_ID, configuración y nombre mysql; vuelve a inspeccionar proceso antes de sus consultas de identidad/TLS/grants. Esas consultas también consumen tiempo antes de devolver la verificación.

La solución pendiente debe verificar vigencia al finalizar y justo antes de cada operación sensible, conservando árbol/PID/creación, configuración, conexión y TLS; no basta ampliar TTL ni reutilizar un gate vencido. **No se implementó ni probó esa solución en esta intervención**, por la parada de fase 2. Pruebas negativas: NO EJECUTADAS. No se declara GUARDAS CORREGIDAS.

## Aislamiento y resultados SQL

Controles existentes revisados, sin conectarse: identidad SQL exige MySQL 8.4.11, puerto 3308, base y cuenta zarate_test, datadir aislado, UUID, rol NONE y grants exclusivos de esquema; assertEffective fija perfil y configuración. La conexión rechaza reconexión transparente y exige el mismo PDO, sin read PDO alternativo. Los controles TLS existentes no se eliminaron ni modificaron. Estas son verificaciones del código, **no una nueva acreditación SQL/TLS viva**.

| Dato | Antes, última evidencia SQL del Prompt 19 | Después de esta intervención |
| --- | --- | --- |
| Migraciones registradas | 4/14, batch 1 | No reconsultadas; cero migraciones ejecutadas |
| Tablas | 14 | No reconsultadas |
| Quinta | Parcial, sin registro | No reparada ni marcada como aplicada |
| model_has_roles | PK/columnas presentes; dos índices y FK pendientes | No reconsultado ni alterado |
| role_has_permissions | Ausente | No reconsultada ni creada |
| Conexión/TLS | mysql; 127.0.0.1:3308; zarate_test; TLS estricto | No revalidados en ejecución |

SQL de lectura/escritura, migraciones, seeders, Pest y Cypress: **cero ejecutados**. No se inició PHP/Laravel/MySQL para esta fase; no existen códigos de salida de esos procesos. No se detuvo ni modificó ningún servicio de 3307/8000/5173. No se accedió por SQL a zarate_dev ni se escribió en archivos de base. No se afirma integridad histórica de desarrollo.

## Archivos y cierre

Se crearon exclusivamente prompt-22-recuperacion-seguridad.md (copia íntegra del adjunto, igualdad SHA-256 aprobada) y este informe. Los 14 hashes de migraciones y los cuatro de configuraciones protegidas coinciden con sus referencias. `git diff --check` terminó 0, sin errores. Git muestra cuatro documentos no rastreados: los dos previos del Prompt 21 y los dos nuevos del Prompt 22. No se editaron scripts, migraciones, configuraciones, código funcional, contraseñas, datos ni evidencias anteriores. No hubo commits, push, merge ni PR. No se publicaron herramientas locales o secretos.

| Componente | Antes | Después | Resultado |
| --- | --- | --- | --- |
| Guarda de autorización | Defectuosa | Sin modificación; defecto identificado | Pendiente por parada de fase 2 |
| Diferencias del snapshot | 22 + 4 | 28 entradas incluyendo dos agregadas, clasificadas | Dos críticas no resueltas |
| Quinta migración | Parcial | Sin nueva verificación SQL ni reparación | Pendiente |
| Migraciones registradas | 4/14 según última evidencia | Cantidad actual no reconsultada | Cero ejecutadas |
| Base de desarrollo | Protegida por snapshot | Sin escrituras propias; diferencias históricas sin explicar | No se acredita igualdad histórica |

**BLOQUEO POR DIFERENCIAS CRÍTICAS.** La clasificación no afirma que los archivos estén dañados; expresa que no se cumple el criterio de continuación del prompt. No ejecutar aún migraciones 6–14, Pest ni Cypress.
