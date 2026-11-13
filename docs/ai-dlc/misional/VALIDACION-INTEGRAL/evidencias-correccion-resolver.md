# Corrección del resolver y continuación conservada — Prompt 18

Fecha: **03/11/2026**, America/Lima. Repositorio `D:\zarate-saas`; rama `test/integracion-misional`; HEAD inicial `9e1a56b` (`docs(qa): registrar fallo controlado de migracion y esquema conservado`). Git inicialmente limpio.

**Resultado: MIGRACIÓN PARCIAL — ESQUEMA CONSERVADO.** La corrección del nombre lógico mysql quedó verificada, incluida su utilización por Laravel durante cuatro migraciones completas. La continuación se detuvo por rechazo de la comprobación viva del proceso mientras ejecutaba la quinta. **4 de 14 migraciones registradas; 14 tablas acreditadas por SQL exitoso/ledger y archivos .ibd**, de las cuales 13 fueron nuevas y migrations se conservó.

PHP terminó con **21**, el supervisor con error/salida **1** y MySQL cerró correctamente con **0**. No se repitió la migración después de ese fallo. **No se completó el inventario SQL final ni la verificación completa de restricciones/filas.** No se presenta el resultado como éxito, validación integral completada o pruebas funcionales aprobadas. Seeders, Pest y Cypress: **NO EJECUTADOS**.

## 1. Recuperación y preservación

Se revisaron los informes de guardas SQL, ejecutor y primera migración, así como los adaptadores, reproducción de causa raíz, Migrator/DatabaseMigrationRepository y resolver instalados. Se reutilizó el mismo entorno, perfil Pest, PHP **8.4.26**, MySQL **8.4.11**, credencial restringida y CA/certificado del Prompt 13. No se reinicializó ni reconstruyó la base.

Antes de los cambios se guardaron hashes de resultados/documentos anteriores y copias del código de control compartido. Al finalizar se comprobaron **243 resultados JSON previos y 34 documentos sin cambios**. El informe y los resultados del Prompt 17 mantienen su fallo original. No se borró migration.once ni se reescribió su ledger.

Los scripts compartidos se actualizaron como código local; sus versiones anteriores quedaron en `evidence/prompt18/backup`. Las capturas, reserva, snapshots y ledger de esta continuación se escribieron exclusivamente en `evidence/prompt18`. No se modificaron las 14 migraciones ni backend/frontend, .env activos, privilegios o contraseñas.

## 2. Causa anterior y corrección mínima

El adaptador construía MySqlConnection con un config sin **name**. Aunque PDO/base/TLS eran correctos, getNameWithReadWriteType devolvía null. Migrator::runMethod usa ese valor para seleccionar la conexión predeterminada antes de up; el resolver, que exige mysql, lo rechazaba.

Se agregó logicalMysqlConfig al adaptador compartido: valida driver=mysql, rechaza un nombre alternativo y establece **name=mysql en la configuración de la instancia Laravel**. No cambia DSN, base, credencial, opciones TLS o PDO. La huella de configuración efectiva del perfil se sigue comparando y se comprueban getName y getNameWithReadWriteType en cada validación. El resolver **continúa rechazando null y otros nombres**; no se agregó fallback.

ResolverChecks18.php aprobó **cinco controles offline**, salida 0, sin abrir PDO: una fixture ejercitó el método real Migrator::runMethod y su selección/restauración con mysql; se rechazaron null, zarate_dev, root y un config con name alternativo. La closure del PDO de prueba lanza si se intenta conectar. No es una suite Pest ni una migración de los archivos del proyecto.

Dentro del proceso real se volvió a comprobar ese ciclo con una fixture sin SQL, igualdad del PDO de repositorio/migrador y rechazo de cambios posteriores de puerto, PDO y nombre de conexión. Después se ejecutaron cuatro up reales y sus INSERT de registro; el problema anterior del nombre null no se repitió.

## 3. Archivos locales corregidos/reutilizados

| Archivo bajo .tools/misional-isolated | Cambio |
| --- | --- |
| `evidence/prompt14/MigrationGuard14.php` | Nombre lógico mysql validado, misma conexión/PDO y soporte de fase prompt18; capacidad de escritura exige coincidencia de fase |
| `evidence/prompt15/CheckLive15.ps1` | Admite fase prompt18, manteniendo PID/fecha de creación, imagen/hash, opciones, listener, CA y ventana fija de 600 segundos para migración |
| `evidence/prompt15/Run15.ps1` | Selección fija del ejecutor 18, evidencia separada y preflight ajustado exclusivamente al archivo migrations.ibd conservado |
| `evidence/prompt16/Control16.php` | runAuthorized18 exige repositorio existente y llama al Migrator convencional; no llama a createRepository ni habilita comandos genéricos |
| `evidence/prompt17/Scope17.php` | Reutiliza política de SQL/objetos nuevos; fase18 exige inspección de la tabla conservada, reserva continuation.once y salida de evidencia propia. Prohíbe ALTER de migrations y su recreación |
| `evidence/prompt17/Executor17.php` | Factoriza la operación para 17/18, manteniendo entradas fijas y guardas; incluye comprobaciones del nombre/resolución y contexto de continuación |
| `evidence/prompt18/Executor18.php` | Entrada mínima a la ruta fija de continuación, sin comandos arbitrarios |
| `evidence/prompt18/Partial18.php` | Inspección SQL de tabla/columnas/índices/filas/triggers visibles/FK antes de escribir |
| `evidence/prompt18/ResolverChecks18.php` | Pruebas offline de la corrección usando métodos reales del framework |

Se mantuvieron bloqueados fresh/reset/rollback/wipe/seed, DROP DATABASE/TABLE, TRUNCATE y DML fuera de metadatos. La política solo permite los objetos y archivos inventariados; las transformaciones del scaffold requieren que sea nuevo y vacío. Esa parte de la migración SaaS no se alcanzó.

## 4. Esquema inicial comprobado mediante SQL

`partial-schema.json` recoge la inspección vigente, repetida antes de iniciar la operación:

| Comprobación | Resultado |
| --- | --- |
| Tablas | Exactamente **migrations**, tipo BASE TABLE, InnoDB, utf8mb4_unicode_ci |
| Columnas | id int unsigned NOT NULL, PRIMARY/auto_increment; migration varchar(255) NOT NULL; batch int NOT NULL |
| Índices | Solo PRIMARY sobre id, único |
| Contenido | **0 filas**, consulta SELECT migration,batch |
| FK | Ninguna en ese esquema inicial |
| Triggers visibles | Ninguno devuelto por INFORMATION_SCHEMA para la cuenta de pruebas; no es una inspección administrativa global |
| DDL | SHOW CREATE TABLE leído; hash guardado localmente |
| Nombre / conexión | mysql, repositorio y migrador sobre el mismo PDO acreditado |

No existían otras tablas o datos académicos en el esquema inspeccionado. La tabla migrations **no se eliminó ni recreó**: la ruta exigió repositoryExists=true y solo permitió posteriormente sus INSERT de registro. La capacidad no permitía alterar su estructura.

## 5. Controles y autorización vigentes

Antes de escribir se acreditaron APP_ENV=testing; host **127.0.0.1**, puerto **3308**, base **zarate_test**, cuenta efectiva **zarate_test@127.0.0.1**, datadir exclusivo, UUID esperado y servidor MySQL 8.4.11. TLS mantuvo verificación estricta de CA/certificado/IP y **TLS_AES_256_GCM_SHA384**. Se observaron las mismas dos filas de grants: USAGE global y nueve privilegios del esquema literal zarate\_test, sin roles/grants ajenos ni delegación.

Se conservaron storage/temporales/caches bootstrap privados, sesiones/caché array, cola null y correo array. El XML local se procesó con las clases de PHPUnit en el mismo proceso, sin runner. Se reutilizaron facades DB/Schema y caché mínima, sin arrancar providers/kernel completos. No se utilizaron credenciales administrativas o conexiones a zarate_dev.

La capacidad de continuación quedó ligada a objetos exactos, manifest/hashes, tabla conservada validada, reserva única continuation.once y revalidación antes de las consultas. No se removieron guardas para permitir nombres desconocidos. La prueba del proceso se comprueba mediante el helper Windows compartido; su rechazo es el punto de detención real descrito más adelante.

## 6. Incidente de preflight anterior al arranque

La primera invocación se detuvo con salida **1**, antes de iniciar MySQL o abrir SQL, porque el preflight histórico exigía **172 archivos** del datadir previo a la tabla de metadatos. El estado conservado tenía **173**, cuyo único archivo adicional en zarate_test era migrations.ibd.

Se conservó `preflight-first-blocked.json`. El ajuste exige para prompt18 exactamente esos 173 archivos y únicamente migrations.ibd en la carpeta del esquema; no acepta un número arbitrario ni omite la inspección SQL. Después se realizó el único arranque/intento de migración real de esta fase. No fue un reintento automático tras un fallo de migración con escrituras.

## 7. Operación real y estado por migración

Comando del supervisor compartido:

```powershell
.tools/misional-isolated/evidence/prompt15/Run15.ps1 -EvidencePhase prompt18
```

Invocó Executor18.php pest, que reutiliza el ejecutor corregido y una única llamada al Migrator convencional con pretend=false, step=false y la ruta inventariada. Se conservó el repositorio y se ejecutaron solo los archivos pendientes. No se invocaron comandos destructivos, seeders o importaciones.

| Orden | Migración | Estado acreditado |
| --- | --- | --- |
| 1 | 0001_01_01_000000_create_users_table | APLICADA Y REGISTRADA, batch 1 |
| 2 | 0001_01_01_000001_create_cache_table | APLICADA Y REGISTRADA, batch 1 |
| 3 | 0001_01_01_000002_create_jobs_table | APLICADA Y REGISTRADA, batch 1 |
| 4 | 2026_10_01_131619_create_personal_access_tokens_table | APLICADA Y REGISTRADA, batch 1 |
| 5 | 2026_10_01_131621_create_permission_tables | PARCIAL, NO REGISTRADA; cuatro de sus tablas creadas, restricciones finales no verificadas |
| 6 | 2026_10_01_150000_create_saas_core | NO EJECUTADA |
| 7 | 2026_10_01_160000_create_academic_structure | NO EJECUTADA |
| 8 | 2026_10_01_170000_create_people | NO EJECUTADA |
| 9 | 2026_10_02_000000_create_enrollment_tables | NO EJECUTADA |
| 10 | 2026_10_02_120000_create_courses_and_teacher_assignments | NO EJECUTADA |
| 11 | 2026_10_02_140000_create_classroom_tables | NO EJECUTADA |
| 12 | 2026_10_04_100000_create_learning_tables | NO EJECUTADA |
| 13 | 2026_10_05_100000_create_attendance_tables | NO EJECUTADA |
| 14 | 2026_10_05_110000_create_academic_office_tables | NO EJECUTADA |

Resultado: **4 registradas de 14**; una pendiente con DDL parcial y nueve no iniciadas. Los cuatro registros se acreditan por eventos QueryExecuted exitosos de los INSERT permitidos, sus nombres en el ledger y batch=1 exigido por la política. No se obtuvo un SELECT final de esas filas después de la detención.

Tablas acreditadas (**14**): migrations, users, password_reset_tokens, sessions, cache, cache_locks, jobs, job_batches, failed_jobs, personal_access_tokens, permissions, roles, model_has_permissions y model_has_roles. Son **13 CREATE nuevos**, más la tabla conservada. La lista de SQL exitoso coincide exactamente con los **14 archivos .ibd** presentes tras el cierre limpio (`partial-filesystem.json`). No equivale a una comprobación SQL final de todo el catálogo/constraints.

## 8. Error exacto y límites del diagnóstico

La detención fue una **RuntimeException / ISOLATION_BLOCKED_34** durante CONVENTIONAL_MIGRATION. La línea pertinente del helper de guarda es `currentProcessProof`: se rechazó el resultado no satisfactorio del proceso PowerShell que debía acreditar la identidad viva. No se capturó una excepción SQL fatal: SQLSTATE y código SQL nativo son null.

El helper solo emitía BLOCKED, sin guardar la condición concreta ni su razón detallada. No hay evidencia suficiente para atribuir concluyentemente el rechazo a un cambio de puerto/PID/configuración o exclusivamente a caducidad. **No se inventa ese detalle**.

Datos temporales acreditados: gate emitido a las **15:50:35 -05:00**, ventana de 600 segundos hasta las **16:00:35 -05:00**; shutdown completo del servidor a las **16:18:16 -05:00**. La ventana estaba vencida al cierre y es una explicación compatible. No se dispone de un timestamp/razón de la comprobación concreta que permita presentarla como causa única demostrada. La guarda no fue omitida y no se amplió para reintentar.

### Clasificación errónea de la salida bruta

`auth-result.json` conserva el texto **BLOCKED_BEFORE_SCHEMA_WRITES** y tablesPreserved=[] porque el manejador intentó repetir la comprobación viva para consultar el inventario, volvió a fallar y trató el array vacío como ausencia de tablas. **Ese estado bruto es incorrecto para este caso: hubo escrituras acreditadas.** No se reescribió la evidencia para ocultarlo.

`derived-outcome.json` registra la clasificación correcta **MIGRACION_PARCIAL_ESQUEMA_CONSERVADO**, basada en los eventos de SQL exitoso y el inventario físico coincidente. Una futura corrección del manejador deberá distinguir inventario no verificado de esquema vacío y utilizar la evidencia de escrituras; no basta con comprobar si un array quedó vacío.

## 9. Resultados y advertencias

| Verificación | Resultado |
| --- | --- |
| Corrección del resolver offline | **5 aprobadas, 0 fallidas**, sin conexión ni SQL |
| Sintaxis inicial | Siete archivos PHP corregidos/nuevos aprobados; scripts PowerShell compartidos sin errores de parser |
| Inicialización/preflight real | Aprobado tras el incidente de inventario; PID/puerto/binario/configuración/ACL y prueba de cierre correctos |
| Inspección inicial SQL | Una tabla, estructura esperada y cero registros; repetida antes de continuar |
| Nombre y PDO en contexto real | mysql, mismo PDO; rechazo comprobado de cambios de puerto/PDO y de conexión alternativa |
| Sentencias Laravel exitosas | **39**: dos SET de sesión, tres lecturas, **13 CREATE**, **17 ALTER** y **4 INSERT de metadatos** |
| Lecturas registradas | Guarda: **258**; auxiliares de Scope: **40**. No se presentan como total exhaustivo: la inspección inicial registra lecturas por separado |
| Colector de advertencias | **0 códigos observados en las 39 lecturas** posteriores a sentencias exitosas, con la instrumentación de esta fase |
| Código PHP | **21**; supervisor con error/salida **1** |
| Verificación SQL final de filas/FK/engines | **NO COMPLETADA**, por rechazo de la prueba viva |
| Pest/Cypress/seeders | **0 ejecutados**, no se declaran aprobados |

Para no introducir un error de preparación desde el propio SHOW WARNINGS, en prompt18 esa única lectura se envía con emulación PDO y se restaura inmediatamente el atributo anterior en finally, comprobando su valor. No se cambia TLS, endpoint o el modo de preparación de las escrituras. Los códigos 1295 conservados en Prompt 17 no se borraron ni se reinterpretan como una prueba aprobada; esta fase registra sus propias observaciones.

No se importaron datos académicos o institucionales: la capacidad solo permitió INSERT de metadatos, y no se ejecutaron seeders. **No se realizó un conteo SQL posterior de filas de las 14 tablas ni se aprobaron todas sus restricciones**. La quinta migración puede tener índices/FK incompletos; falta role_has_permissions y no se debe asumir que el resto de sus tablas coincide ya con el archivo completo.

## 10. Detención, desarrollo y evidencias anteriores

Preflight real a las **15:50:33 -05:00**, **824 objetos** privados revisados. Monitor **24084**, servidor **24192**. Prueba auxiliar de cierre, versión y validate-config terminaron 0. Un solo arranque MySQL real y una sola continuación con escrituras; no se reinició después del fallo.

Shutdown del servidor a las **16:18:16 -05:00**, código nativo **0**. Resultado del supervisor a las **16:18:31 -05:00**: monitor **3221225786 / 0xC000013A** por Ctrl+C, shutdown completo, **0 ERROR/FATAL del log del motor y una advertencia**; PHP 21. La etiqueta histórica “Pest diagnostic blocked” del supervisor no corresponde a una ejecución de Pest.

Se inspeccionaron **864 objetos** al cerrar; los **303 archivos de desarrollo y cuatro configuraciones protegidas** conservaron inventario, hashes/metadatos/ACL. Log histórico de inicialización intacto. No se conectó a zarate_dev para verificarla; su conservación se acredita por snapshots protegidos y el alcance de la cuenta/SQL.

Snapshot independiente a las **16:24:19 -05:00**: **0 mysqld, 0 listeners en 3308/8001/5174, PID-file ausente y 0 archivos generados en storage/caches bootstrap**. Se mantuvieron los estados parciales y ambas reservas de ejecución, sin limpiezas, DROP/TRUNCATE o rollback.

## 11. Riesgos pendientes y siguiente fase recomendada

La corrección de name=mysql está comprobada y no requiere relajar el resolver. Permanece pendiente diagnosticar/revisar la vigencia de la prueba de proceso y capturar razones controladas con timestamps. Si se renueva esa prueba, deberá hacerlo dentro del supervisor conservando PID/fecha de creación/handles, config, mismo PDO/CONNECTION_ID, UUID/TLS/grants, sin convertir un JSON o un argumento en autorización permanente. No prolongar indefinidamente ni desactivar las guardas para forzar el resultado.

Antes de otra escritura se necesita una fase específica de **inspección y plan de recuperación**, solo con lecturas inicialmente: verificar las cuatro filas registradas y la estructura/índices/FK reales de las 14 tablas, especialmente los cuatro objetos de la quinta migración. El esquema ya no es la tabla migrations vacía que autorizó esta continuación.

Una repetición convencional ciega intentaría crear otra vez tablas de permisos existentes. No ejecutar de nuevo el comando, no agregar IF NOT EXISTS a las migraciones ni marcar manualmente la quinta como aplicada para ocultar DDL pendiente. Cualquier reparación/continuación debe autorizarse con un plan concreto que preserve los objetos, complete únicamente lo demostrado como pendiente y registre metadatos solo tras verificar el esquema esperado. No se implementó ese plan ni se alteraron las 14 migraciones.

Los puntos de recuperación de esta fase son la evidencia inicial, el ledger, las versiones de código y el parcial conservado; no se creó un backup binario ni se ejecutó una restauración de datos. No están habilitadas aún las pruebas funcionales.

## 12. Documentación y cierre

Recursos principales en `evidence/prompt18`: resolver-checks.json, preflight-first-blocked.json, partial-schema.json, continuation.once, recovery-plan.txt, operation-ledger.json, auth-result.json, derived-outcome.json, partial-filesystem.json, result.json, preservation-result.json y final-state.json. Se conserva la salida bruta incorrectamente clasificada junto a su interpretación verificable; no se reemplaza.

Se crean para Git solo `prompt-18-correccion-resolver.md` y este informe. Los documentos y resultados 01–17 permanecen intactos. Los scripts/resultados locales siguen en `.tools`; no se publican claves, credenciales, certificados privados o datos personales. No hubo instalaciones, cambios funcionales o .env, cambios de privilegios/contraseñas, commits, push, merge o PR.

Cierre documental: el prompt coincide por SHA-256 con el adjunto. La auditoría inicial examinó **106 archivos**, incluidos los dos documentos y componentes locales compartidos, con **0 coincidencias de secretos fuera de sus recursos dedicados**. Audit18.php también aprobó sintaxis. `git diff --check` y las verificaciones adicionales de whitespace sobre ambos documentos no detectaron errores; solo se advirtió CRLF/LF del prompt. `.tools` está ignorado y sin archivos rastreados; Git muestra únicamente estos dos documentos nuevos.

Las precondiciones de esta continuación —173 archivos físicos y solo migrations vacía— ya no describen el parcial actual. No se deben relajar o reutilizar para otro intento: primero debe autorizarse y comprobarse un perfil de inspección del estado de 14 tablas conservadas.

**Estado final: MIGRACIÓN PARCIAL — ESQUEMA CONSERVADO. 4/14 registradas; 14 tablas acreditadas, 13 nuevas; MySQL cerrado con 0.** Verificación SQL final y validación integral pendientes.
