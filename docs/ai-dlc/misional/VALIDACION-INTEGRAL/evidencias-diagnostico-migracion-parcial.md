# Diagnóstico del esquema parcial y recuperación planificada — Prompt 19

Fecha: **03/11/2026**, America/Lima. Repositorio `D:\zarate-saas`; rama `test/integracion-misional`; HEAD inicial `36ee1f6` (`docs(qa): registrar migraciones parciales y diagnostico del resolver`). Git inicialmente limpio.

**Resultado: DIAGNÓSTICO COMPLETO — RECUPERACIÓN PLANIFICADA.** La consulta SQL vigente confirmó **14 tablas, cuatro registros de migración en batch 1 y una quinta migración parcial sin registro**. Se identificaron sus objetos presentes y pendientes. El plan de reparación **no se ejecutó** y el estado continúa parcial.

Se realizaron **12 consultas de metadatos más 12 lecturas internas de guarda, cero SQL de escritura y cero métodos de migración**. No se consultaron filas de usuarios, roles/asignaciones u otros datos personales/institucionales. MySQL cerró con código **0**; puerto 3308 libre. No se ejecutaron migraciones, seeders, Pest ni Cypress.

## 1. Estado recuperado y componentes reutilizados

Se revisaron los informes de guardas SQL, ejecutor, migración controlada y corrección del resolver, los controles locales 17/18 y el código real de las primeras cinco migraciones. Se revalidó el manifest de 14 archivos/hashes mediante el mecanismo existente, sin cargar ni ejecutar sus up/down.

Se conservan PHP portable **8.4.26**, MySQL **8.4.11**, cuenta **zarate_test**, TLS/CA del Prompt 13, perfiles y conexión Laravel corregida con nombre lógico mysql. No se creó otra base, entorno o servicio.

Se añadió exclusivamente diagnóstico local en `evidence/prompt19`:

- **Inspect19.php:** lote fijo de SELECT/SHOW del catálogo y contenido permitido de migrations, sobre el mismo PDO verificado; acreditación antes/después del lote. No acepta SQL arbitrario ni utiliza una capacidad de escritura.
- **Compare19.php:** comparación posterior del snapshot con nombres/orden/tipos/nullabilidad, índices y FK previstos en el código; no abre SQL.
- **CheckLive15.ps1 compartido:** trazas privadas para fase19 con etapa, tiempos, antigüedad, árbol de PID y categoría de error. Sus condiciones de aceptación no se relajaron; su salida estable de identidad se conserva.
- **Run15.ps1 compartido:** selección fija del cliente de lectura 19 y preflight que exige los 186 archivos esperados y los 14 nombres .ibd ya acreditados en Prompt 18.
- **MigrationGuard14.php compartido:** admite el contexto de diagnóstico prompt19; no habilita una capacidad de escritura en esa fase.

Versiones previas del código compartido en `evidence/prompt19/backup`; resultados propios separados. Se comprobaron **479 archivos de evidencias anteriores y 36 documentos por hashes, sin cambios**. No se reescribió la salida bruta incorrecta del Prompt 18.

## 2. Inspección SQL real y seguridad

Comando ejecutado una sola vez:

```powershell
.tools/misional-isolated/evidence/prompt15/Run15.ps1 -EvidencePhase prompt19
```

El supervisor invocó Inspect19.php pest, sin Artisan ni runners. Preflight de rutas/ACL/propietarios/enlaces, opciones/binario, inventario, PID/puerto libre y desarrollo protegido aprobado. Se arrancó solo el MySQL aislado y se comprobó su identidad vigente:

| Comprobación | Resultado |
| --- | --- |
| Versión / destino | MySQL 8.4.11, **127.0.0.1:3308** |
| Base / cuenta efectiva | **zarate_test / zarate_test@127.0.0.1**, no root |
| Datadir / UUID | Directorio `.tools/misional-isolated/mysql-data`; UUID coincidente con auto.cnf, sin publicar su valor |
| TLS | CA/certificado/IP verificados; **TLS_AES_256_GCM_SHA384** |
| Nombre / PDO | mysql y el mismo PDO antes/después del lote; sin reconexión transparente |
| Grants / rol | Los nueve privilegios exclusivos de esquema, sin grants ajenos/delegación; CURRENT_ROLE=NONE |
| Entorno | testing; rutas privadas, sesiones/caché array, colas null y correo array; sin kernels/proveedores completos |
| Pruebas de proceso | Cinco acreditaciones válidas, todas con edad final entre **2 y 8 segundos**, dentro del límite diagnóstico de 120 segundos |

El lote leyó INFORMATION_SCHEMA.TABLES, COLUMNS, STATISTICS, TABLE_CONSTRAINTS, KEY_COLUMN_USAGE, REFERENTIAL_CONSTRAINTS y TRIGGERS; SELECT id,migration,batch de migrations; y SHOW CREATE TABLE de las cuatro tablas presentes de la quinta migración. No leyó registros de otras tablas ni se conectó a zarate_dev.

Los triggers son los visibles para la cuenta de pruebas; no se presenta esa consulta como una auditoría administrativa global. No se modificaron permisos para ampliar la visibilidad.

## 3. Inventario exacto y registros existentes

El catálogo devolvió **14 tablas**:

| Grupo | Tablas |
| --- | --- |
| Repositorio | migrations |
| Primera migración | users, password_reset_tokens, sessions |
| Segunda migración | cache, cache_locks |
| Tercera migración | jobs, job_batches, failed_jobs |
| Cuarta migración | personal_access_tokens |
| Quinta, parcial | permissions, roles, model_has_permissions, model_has_roles |

Contenido SQL de migrations, sin inferirlo del ledger:

| id | migration | batch |
| --- | --- | --- |
| 1 | 0001_01_01_000000_create_users_table | 1 |
| 2 | 0001_01_01_000001_create_cache_table | 1 |
| 3 | 0001_01_01_000002_create_jobs_table | 1 |
| 4 | 2026_10_01_131619_create_personal_access_tokens_table | 1 |

La quinta no tiene registro; las migraciones 6–14 tampoco. El diagnóstico no insertó, modificó o eliminó esos registros.

Snapshot: **79 columnas, 44 filas de componentes de índices y una columna de FK**. Las 44 filas no son 44 índices: un índice compuesto produce varias filas en STATISTICS. Se recogieron asimismo restricciones, reglas referenciales y DDL de las tablas de permisos.

La comparación de las propiedades especificadas encontró **13 de las 14 tablas presentes coincidentes**; model_has_roles conserva columnas/PK correctas pero carece de objetos secundarios. La tabla adicional esperada por las primeras cinco migraciones, role_has_permissions, no existe. No se identificaron tablas inesperadas respecto del estado conservado.

Las columnas/índices de las nueve tablas creadas por las cuatro migraciones registradas, y del repositorio, coinciden con el código revisado. Esto no equivale a pruebas de datos o de toda la aplicación. En particular sessions.user_id tiene índice, pero el scaffold no declara FK a users; no se propone agregarla como supuesto defecto.

## 4. Quinta migración: esperado frente a real

Archivo exacto: **backend/database/migrations/2026_10_01_131621_create_permission_tables.php**, quinto en el manifest. Configuración efectiva: teams=true, team_foreign_key=institution_id, model_morph_key=model_id; pivotes role_id/permission_id. No se cambió esa configuración.

| Objeto | Estado verificado |
| --- | --- |
| permissions | Cinco columnas correctas, id auto_increment/PK y UNIQUE(name,guard_name) |
| roles | Seis columnas correctas; institution_id nullable; PK(id), índice roles_team_foreign_key_index e UNIQUE(institution_id,name,guard_name) |
| model_has_permissions | Cuatro columnas correctas; PK compuesta, índices explícitos, FK e índice de soporte presentes |
| model_has_roles | Cuatro columnas correctas y **PK compuesta presente**; faltan los índices secundarios y FK detallados abajo |
| role_has_permissions | **Tabla ausente**; sus columnas, PK y dos FK están pendientes |

model_has_roles existe con:

- role_id bigint unsigned NOT NULL.
- model_type varchar(255) NOT NULL.
- model_id bigint unsigned NOT NULL.
- institution_id bigint unsigned NOT NULL.
- **PRIMARY(institution_id,role_id,model_id,model_type), ya creada y correcta. No debe recrearse.**

Pendientes comprobados en model_has_roles:

| Objeto pendiente | Definición del código |
| --- | --- |
| model_has_roles_model_id_model_type_index | Índice no único (model_id,model_type) |
| model_has_roles_team_foreign_key_index | Índice no único (institution_id), declarado expresamente por la migración |
| model_has_roles_role_id_foreign | FK(role_id) → roles(id), DELETE CASCADE, UPDATE por defecto NO ACTION |
| Índice de soporte de esa FK | Ausente; InnoDB lo generará si necesita soporte al agregar la FK. No se planifica como DDL independiente duplicado |

La FK ya existente es **model_has_permissions_permission_id_foreign**, permission_id → permissions.id, DELETE CASCADE, UPDATE NO ACTION, dentro de zarate_test. model_has_permissions tiene además PRIMARY(institution_id,permission_id,model_id,model_type), índice (model_id,model_type), índice institution_id e índice de soporte permission_id.

role_has_permissions debe contener permission_id y role_id bigint unsigned NOT NULL, PRIMARY(permission_id,role_id), FK a permissions(id) y FK a roles(id), ambas con DELETE CASCADE. Se conservarán los nombres de constraints generados por el código. Los índices automáticos de InnoDB deben evaluarse por columnas/soporte; no se deben duplicar ciegamente.

El contraste con el ledger del Prompt 18 es coherente: el último CREATE exitoso fue model_has_roles. **Su PK ya estaba incluida en el CREATE**; por ello no sería correcto deducir que falta simplemente porque no figura un ALTER PRIMARY posterior. No se alcanzó role_has_permissions ni la invalidación final de caché de la quinta migración.

Las migraciones posteriores dependen del funcionamiento de permisos y de las bases SaaS/académicas que aún no se han creado. No es seguro repetir la quinta: volvería a ejecutar CREATE permissions/roles sobre objetos existentes y podría ocultar o agravar el parcial si se agregaran comprobaciones genéricas de existencia.

## 5. Diagnóstico de la guarda del proceso

### Reconstrucción del Prompt 18

| Hito | UTC / equivalente America/Lima |
| --- | --- |
| Emisión del gate | 20:50:35Z / 15:50:35 -05:00 |
| Fin de su ventana de 600 segundos | 21:00:35Z / 16:00:35 -05:00 |
| Creación de model_has_roles.ibd | **21:18:14.7854638Z / 16:18:14.7854638 -05:00** |
| Escritura de la salida de fallo PHP | **21:18:15.8506278Z / 16:18:15.8506278 -05:00** |

La última tabla se creó a una edad de **1.659 segundos**, ya fuera de ventana. El siguiente control secuencial ejecuta la condición de antigüedad antes de consultar CIM. Con esas marcas y el orden del código, **la caducidad es una condición que necesariamente incumplía esa siguiente validación**. Es una reconstrucción temporal; el helper original no guardó un mensaje de razón ni el instante exacto de la evaluación. El rechazo queda acotado por los hitos anteriores, no se inventa una precisión de milisegundos inexistente.

El error capturado, ISOLATION_BLOCKED_34, corresponde a currentProcessProof: resultado no aceptado del helper Windows. No acredita un cambio de datadir/PDO o una excepción SQL. La salida bruta BLOCKED_BEFORE_SCHEMA_WRITES ya documentada en Prompt 18 era incorrecta porque el manejador confundió inventario no verificable con array vacío; no se reescribió aquí.

Además, la edad solo se comprobaba **antes** de la inspección costosa de procesos/hash/listeners. Si esa inspección o el proceso se suspenden mucho tiempo, puede devolverse una prueba que ya caducó al terminar. La tabla creada después del límite muestra por qué no basta una comprobación de edad al inicio. **No se conoce la causa física del retraso**: no había trazas de duración para distinguir pausa, ajuste de reloj o latencia de inspección. No se atribuye sin evidencia a permisos de Windows o a MySQL.

### Comprobación vigente del Prompt 19

Las cinco trazas nuevas conservaron monitor **27280**, worker **14308**, relación padre/hijo y listener único. Ruta del binario, línea de opciones, tiempos de creación, PID-file y hashes pasaron todos los controles. No hubo denegación de inspección en esta ejecución: errorCategory=null en las cinco trazas.

Duraciones de cada inspección: **1.138, 1.153, 1.141, 1.215 y 1.141 ms**; antigüedad final 2–8 segundos. Las cinco devolvieron LIVE_PROCESS_VERIFIED. El cliente también exigió que la prueba no estuviera caducada al finalizar el lote. Se mantuvieron las validaciones SQL de UUID, cuenta, base, TLS y grants.

El Prompt 18 conservó handles del mismo monitor/worker hasta el cierre limpio y no documentó un reinicio. No existe evidencia de un cambio de instancia que explique la detención. La vigencia de una autorización temporal y la identidad activa son condiciones diferentes: caducar un gate fijo puede detener una operación que mantiene aislamiento, y no debe resolverse ignorando el rechazo.

### Corrección mínima propuesta — no aplicada a la ejecución de migraciones

1. Mantener las trazas controladas de etapa/razón, timestamps, duración, PID/creación y coincidencias, sin contraseñas ni línea de comandos sensible.
2. Comprobar vigencia **antes y después** de la inspección; no aceptar una comprobación que terminó fuera de plazo.
3. Revisar una renovación acotada de prueba viva dentro del **supervisor existente**, conservando handles, PID/creación, imagen/opciones, listener y misma sesión PDO/CONNECTION_ID, UUID/TLS/grants. No usar un JSON como permiso permanente ni ampliar indefinidamente el TTL.
4. Diferenciar caducidad, error de inspección/permisos, identidad distinta y fallo SQL. Si no puede acreditarse, detener antes de la próxima escritura y preservar el parcial.
5. Corregir el reporte del manejador: inventario no verificado no es esquema vacío; consultar el ledger de escrituras antes de clasificar.

En esta fase se añadió observabilidad y se verificó lectura vigente; **no se habilitó, eliminó o relajó una guarda para reanudar DDL**. La causa del retraso histórico y su instante original exacto son límites de la evidencia disponible, no resultados aprobados.

## 6. Recuperación planificada — NO EJECUTADA

Se recomienda una **corrección puntual local y acotada**, previa autorización, conservando las cuatro migraciones registradas y los objetos existentes. Una nueva migración de reparación no resolvería por sí sola el orden: el migrador convencional intentaría primero la quinta pendiente y chocaría con sus CREATE. No se deben modificar las 14 migraciones para hacerlas artificialmente idempotentes.

### A. Comprobaciones previas

- Acreditar de nuevo infraestructura, mismo PDO/nombre mysql/TLS/grants, configuración aislada y manifest/hashes.
- Exigir exactamente las cuatro filas/batch 1, las 14 tablas, columnas/PK/índices/FK de este snapshot y ausencia de cambios inesperados.
- Verificar el estado real de cada objeto justo antes de escribir. Una definición distinta, tabla adicional o registro inesperado obliga a detenerse; no se borra ni se adapta automáticamente.
- Con autorización específica, comprobar mediante agregados sin datos personales que no haya asignaciones huérfanas antes de agregar la FK. No borrar ni corregir filas para hacerla pasar. En Prompt 19 no se leyeron esas filas.
- Preparar punto de recuperación consistente y plan de parada. Los backups presentes son de código/evidencias, no una copia binaria de datos.

### B. DDL puntual previsto

Sobre model_has_roles: agregar el índice (model_id,model_type), la FK role_id → roles.id con CASCADE de borrado y el índice institution_id. **Conservar columnas y PK existente**. La FK puede generar su índice de soporte; no agregar dos veces el mismo objeto.

Crear únicamente role_has_permissions con sus dos columnas y PK compuesta, y agregar sus dos FK conforme al archivo original. Esquema, tipos unsigned, nombres y colación deben coincidir. No usar DROP/TRUNCATE ni desactivar FOREIGN_KEY_CHECKS.

El alcance lógico es **tres ALTER sobre model_has_roles y un CREATE más dos FK sobre role_has_permissions**; los índices implícitos son efectos del motor, no instrucciones adicionales independientes. No se generó ni ejecutó un reparador SQL en esta fase.

Después, verificar por catálogo las cinco tablas completas y las cuatro FK previstas. Ejecutar, si se autoriza como parte de la reparación, la invalidación de caché final del archivo original **solo en el store array aislado**, nunca un cache:clear global o sobre desarrollo.

### C. Registro y continuación posteriores

Registrar la quinta **solo después** de demostrar que todos sus efectos esperados quedaron completos. Ese registro exige autorización explícita y el repositorio Laravel real; no es una marca para omitir DDL faltante. Conservar sin UPDATE/DELETE los cuatro registros existentes.

El lote debe calcularse según el repositorio y documentarse: actualmente las cuatro filas están en batch 1. Un registro de reparación en el siguiente lote sería 2 y una ejecución convencional posterior calcularía el siguiente; **no reutilizar la constante batch=1 de la capacidad antigua** ni modificar filas anteriores para uniformar lotes.

Luego diseñar una única continuación de las pendientes 6–14, sin reejecutar la quinta ni comandos destructivos. La capacidad futura deberá tomar la secuencia pendiente del manifest menos los registros SQL verificados: el índice basado solo en count(logged) de una capacidad nueva comenzaría erróneamente en el primer archivo.

La migración SaaS siguiente modifica users, que ahora es una tabla conservada, y elimina el nombre/índice del scaffold. Antes de autorizarla deben revisarse expresamente esas transformaciones y comprobarse, mediante consulta agregada autorizada, la ausencia de filas. No tratar la tabla como recién creada en el nuevo ciclo ni permitir su DML condicional sobre datos existentes por omisión.

### D. Criterios de aceptación y detención

Aceptación de la reparación: mismas cuatro filas previas intactas; cinco tablas de permisos conformes al código; 15 tablas totales tras crear únicamente la ausente; cuatro FK de permisos correctas; registro de la quinta solo al terminar. La continuación completa tendrá sus propios conteos, lotes y verificaciones hasta las 14 migraciones.

Detener ante pérdida/caducidad de prueba, cambio de conexión/PID, hashes distintos, datos incompatibles, objeto con definición inesperada, permisos insuficientes o error SQL. DDL puede quedar confirmado parcialmente: conservar evidencia y estado, sin rollback/fresh/reset/wipe/seeders o reintentos automáticos. No duplicar índices/PK ni ocultar diferencias mediante IF NOT EXISTS.

## 7. Validaciones e incidencias de diagnóstico

| Comprobación | Resultado |
| --- | --- |
| Cliente SQL de lectura | **0 / READ_ONLY_SCHEMA_INSPECTION_VERIFIED** |
| Consultas | **12 de metadatos + 12 de guarda, 0 escrituras** |
| Identidad de proceso | Cinco pruebas válidas, sin error/permisos denegados en esta ejecución |
| Comparación | **0 / COMPARISON_SAVED**, 13 tablas presentes coincidentes; diferencias esperadas concentradas en model_has_roles y tabla ausente |
| Sintaxis | Inspect19.php, Compare19.php y guarda PHP compartida aprobados; ambos scripts PowerShell compartidos sin errores de parser |
| Migraciones/seeders/Pest/Cypress | **0 ejecutados**; recuperación no aplicada |

Se conservaron dos incidencias de postprocesamiento, posteriores al cierre SQL:

1. El lector de auth-result.json esperaba UTF-8, pero la redirección PowerShell produjo UTF-16LE; se corrigió únicamente su decodificación. No se reescribió el resultado original ni se repitió SQL.
2. El primer descriptor manual de failed_jobs supuso text/índice simple. La lectura del archivo real confirmó varchar(255) e índice compuesto (connection,queue,failed_at); se corrigió la comparación local contra esa fuente. El esquema y la migración no cambiaron. El resultado anterior se conserva en comparison-before-source-descriptor-fix.json.

No se presentaron esas suposiciones del comparador como defectos de la base. Los límites de la comparación son los indicados en comparison.json; no se comprobaron filas de negocio ni se aprobó funcionalidad académica.

## 8. Detención y conservación

Preflight a las **17:13:59 -05:00**, **880 objetos** privados comprobados; monitor **27280**, worker **14308**. Versión, validate-config y prueba auxiliar de cierre terminaron 0.

Cierre a las **17:14:24 -05:00**: PHP **0**, supervisor **0**, servidor MySQL **0**, monitor **3221225786 / 0xC000013A** por Ctrl+C; shutdown completo, **0 ERROR/FATAL y una advertencia** del log de proceso. Se detuvo solo el árbol propio mediante handles/consola acreditados.

Se revisaron **905 objetos** al cerrar y se compararon **303 archivos de desarrollo y cuatro configuraciones protegidas**, sin cambios por inventario, contenido/metadatos/ACL. Log histórico de inicialización intacto. No se accedió a zarate_dev; su preservación se apoya en esos snapshots y el aislamiento de la instancia/cuenta.

Snapshot independiente a las **17:56:33 -05:00**: **0 mysqld, 0 listeners en 3308/8001/5174, PID-file ausente y 0 archivos generados en storage/caches bootstrap**. No se reinició MySQL después de esta lectura ni se ejecutó el plan.

## 9. Evidencias y autorización siguiente

Recursos locales: schema-snapshot.json, auth-result.json, comparison.json, process-proof-trace.jsonl, historical-timeline.json, preflight/result/server.stop.json, preservation-result.json y final-state.json, junto a los incidentes conservados y código de diagnóstico. No se publican los archivos locales de `.tools`.

La siguiente fase requiere revisar/autorizar la corrección de vigencia, el inventario exacto y la reparación puntual con sus comprobaciones de datos agregadas, DDL, registro y lotes. **No se autoriza por este informe una escritura posterior.** No se crearon nuevos módulos ni se modificó código funcional, .env, privilegios, contraseñas u otros Bolts. No hubo commits, push, merge o PR.

Cierre documental: el prompt coincide por SHA-256 con el adjunto. La auditoría inicial de secretos examinó **100 archivos**, incluidos los dos documentos y los componentes locales pertinentes, sin coincidencias de secretos fuera de sus recursos dedicados. Audit19.php también aprobó sintaxis. `git diff --check` y las verificaciones adicionales de whitespace de ambos documentos no detectaron errores; solo se advirtió normalización CRLF/LF del prompt. `.tools` está ignorado y sin archivos rastreados; Git muestra únicamente los dos documentos nuevos de Prompt 19.

**DIAGNÓSTICO COMPLETO — RECUPERACIÓN PLANIFICADA.** Estado todavía parcial: cuatro migraciones registradas, 14 tablas, quinta incompleta y MySQL detenido. No se declara recuperada la migración ni completada la validación integral.
