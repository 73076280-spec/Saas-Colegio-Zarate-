# Prompt 25 — Recuperación de migración 9 y finalización del esquema

Fecha de cierre y reanudación: **05/11/2026**, America/Lima. Repositorio `D:\zarate-saas`; rama **test/integracion-misional**.

**A. MIGRACIONES 14/14 COMPLETADAS Y VERIFICADAS.** La migración 9 se registró mediante el repositorio Laravel en **batch 6, sin repetir DDL**. Se ejecutaron y verificaron las fuentes originales 10–14, en batches 7–11. La consulta final confirmó **14 registros, 52 tablas y ninguna migración pendiente del manifest**. MySQL cerró limpiamente. No se ejecutaron Pest, Cypress ni seeders.

## 1. Recuperación desde la interrupción

Se retomaron los archivos existentes de evidence/prompt25, no se regeneró el entorno ni el plan. Git conservaba los documentos pendientes del Prompt 24 y el prompt 25 nuevo. No se descartaron cambios ni se cambió de rama.

Se identificaron y revisaron Checks25.php, ComparatorTests25.php, Execute25.php, Expression25.php, GuardTests25.php, Registration25.php, Run25.ps1, Scope25.php, ScopeTests25.php, Validate25.php y sus planes/resultados. También estaban preparados los cambios mínimos de contexto prompt25 en MigrationGuard14.php y CheckLive15.ps1. No había launch.json, resultados SQL, marcadores de registro ni evidencia de arranque del Prompt 25: la interrupción ocurrió **antes de ejecutar SQL en esta fase**.

Los **14 hashes de migraciones originales y cuatro configuraciones protegidas** coincidieron. La consulta de procesos/listeners, de solo lectura y salida 0, no encontró mysqld ni listeners en los puertos consultados 3307/3308/8000/5173; PID-file aislado ausente. No se detuvo ningún servicio para conseguir disponibilidad.

Se repitieron únicamente las **37 pruebas del comparador** solicitadas por la continuación: 37 aprobadas, cero fallidas, cero conexiones SQL. Se archivó el resultado previo y el nuevo conserva el mismo hash. Las 18 pruebas de identidad/configuración y 16 del ámbito SQL, ya ejecutadas en la preparación anterior, se conservaron; **no se presentan como nuevas ejecuciones durante la reanudación**. Se comprobó sintaxis PHP y parser PowerShell antes del arranque.

El prompt original permanece como prefijo binario intacto de prompt-25-recuperacion-migracion-9.md; se agregó el texto íntegro de la continuación como registro adicional fechado. El prefijo coincide con el primer adjunto y el sufijo con el segundo. No se reescribieron los informes de errores de los Prompts 21–24.

## 2. Causa y corrección del comparador

El fallo del Prompt 24 estaba en normalize24/verify24 de Validate24.php: comparaba texto de GENERATION_EXPRESSION después de eliminar espacios, paréntesis, backticks e introductor de charset, pero no interpretaba las comillas escapadas del catálogo. **INFORMATION_SCHEMA y SHOW CREATE TABLE representaban de forma distinta la misma expresión** de enrollments.active_student_id.

La fuente declara un CASE que conserva student_id para DRAFT, PENDING, OBSERVED y APPROVED, y devuelve NULL en otro caso. El catálogo representaba los delimitadores con barras inversas; SHOW CREATE TABLE devolvía literales SQL ordinarios con introductor _utf8mb4. No se atribuyó el rechazo a corrupción, permisos o error SQL del servidor.

La versión activa usa **Validate25.php y Expression25.php**, preservando el comparador fallido original. La corrección no consiste en borrar comillas/barras arbitrariamente:

- Un lexer reconoce identificadores, keywords, números, literales, comparadores y paréntesis. Distingue el formato del catálogo del SQL ordinario.
- Un parser limitado construye un árbol para CASE/WHEN/THEN/ELSE/END, AND/OR, comparaciones, IN e IS NULL. Conserva agrupación, precedencia, columnas, operadores y valores literales.
- Solo admite el introductor de charset _utf8mb4 del contexto comprobado. El decodificado de delimitadores escapados del catálogo es acotado; escapes ambiguos, funciones o sintaxis no soportada se rechazan.
- Los literales conservan contenido y mayúsculas. IN puede reordenarse por equivalencia de pertenencia; no se aceptan elementos duplicados o NULL mediante una normalización genérica.
- Los DEFAULT de texto se comparan exactamente; los numéricos se canonicalizan sin redondeo por float, y CURRENT_TIMESTAMP solo se admite en la forma correspondiente a useCurrent. No se eliminan espacios o diferencias reales de cadenas.

El verificador conserva tipos, nulabilidad, defaults, autoincremento esperado, STORED GENERATED y ausencia de expresiones inesperadas. Comprueba columnas ordenadas, índices/unicidad, FK y reglas referenciales, restricciones declaradas, motor y colación. Solo admite índices adicionales de soporte FK identificados. La lectura nueva agrega **charset/colación por columna y precisión temporal**; las tablas previas no modificadas deben conservar su metadato.

El parser es deliberadamente limitado a las expresiones requeridas. No evalúa SQL ni pretende resolver equivalencia de SQL arbitrario; una forma futura no soportada debe detenerse, no aprobarse por parecido textual.

## 3. Pruebas y comprobaciones

| Comprobación | Resultado | Alcance y momento |
| --- | --- | --- |
| Comparador semántico y esquema | **37 aprobadas, 0 fallidas** | Ejecutadas en preparación y repetidas al reanudar; mismo reporte |
| Identidad, vigencia, TLS y configuración | **18 aprobadas, 0 fallidas** | Ejecutadas antes de la interrupción; resultados preservados |
| Ámbito SQL / planes originales | **16 aprobadas, 0 fallidas** | Ejecutadas antes de la interrupción; resultados preservados |
| Sintaxis PHP / parser PowerShell | Aprobados | Revisión de los archivos preparados antes de ejecutar |
| Registro controlado de 9 | Aprobado, cliente 0 | SQL real con backend Laravel y MySQL aislado |
| Migraciones 10–14 | **5 aprobadas, 0 fallidas** | Up originales y repositorio Laravel reales |
| Acreditaciones vivas | **235 válidas, 0 rechazadas** | Mayor edad al terminar inspección: **106 segundos**, límite 120 |
| Pest / Cypress / seeders | **NO EJECUTADOS** | Fuera de esta intervención |

Son **71 casos offline distintos**, no 108 casos distintos por repetir los 37. Las pruebas de esquema mutan fixtures en memoria, no tablas: rechazan columna ausente, tipo o nulabilidad distintos, columna virtual en lugar de almacenada, DEFAULT diferente, índice ausente/no único/con otra columna, FK ausente/a otra base/con regla distinta, restricción faltante y motor/colación incorrectos.

Las pruebas de expresiones aceptan el catálogo original, el SHOW CREATE independiente y agrupaciones equivalentes, y rechazan estados/columnas/ELSE diferentes, NOT IN, cambios de literal, charset inesperado, comentarios, otra sentencia y distinta precedencia booleana. Las de autorización rechazan base/puerto/usuario/datadir/UUID ajenos, autorización vencida/futura y certificados o configuración TLS no válidos. No se probó una escritura rechazada contra zarate_dev.

## 4. Inspección SQL previa y recuperación exclusiva de 9

Con el servidor aislado acreditado, la primera fase fue exclusivamente de lectura, antes de habilitar el permiso de metadatos. migration09/initial-schema.json confirmó **31 tablas y ocho migraciones registradas**, y sus secciones históricas coincidieron exactamente con el diagnóstico final del Prompt 24. Las ocho filas correspondían al manifest original; 9 seguía ausente.

Se comparó el esquema completo del noveno plan con su fuente fijada por hash: **46 columnas, ocho índices explícitos y 15 FK**, además de PK/UNIQUE, nulabilidad/defaults, almacenamiento generado, tabla/charset/colaciones y dependencias. Se obtuvieron SHOW CREATE TABLE de payment_concepts, student_payments, enrollments y enrollment_status_history; el árbol de la expresión de SHOW CREATE coincidió con la fuente y con el del catálogo. No se alteró el snapshot para forzar la equivalencia.

COUNT(*) acreditó vacías las **30 tablas de aplicación existentes**; no se consultaron filas personales. Se conservaron los agregados y el diagnóstico previo al registro. Cualquier diferencia habría impedido abrir la capacidad de escritura.

Solo después de esa equivalencia se creó el marcador exclusivo registration.once. La capacidad permitió el SELECT exacto del siguiente batch y **un único INSERT del nombre de la novena**, ejecutado por DatabaseMigrationRepository real con el resolver y PDO guardados. Laravel calculó **batch 6** desde el historial real, cuyo máximo era 5. No se insertó una marca por SQL manual ni se repitió el up.

La consulta posterior confirmó **9/14**, batch 6 para `2026_10_02_000000_create_enrollment_tables`, las ocho filas previas intactas y 31 tablas. Se repitió la verificación completa antes de autorizar la siguiente migración. Evidencias: migration09/schema-verification.json, show-create.json, metadata-ledger.json, final-schema.json y outcome.json. **DDL de recuperación: cero**.

## 5. Resultado individual de 9–14

| Migración | Estado inicial | Estado final | Batch | Registros / tablas tras verificar | DDL nuevo |
| --- | --- | --- | --- | --- | --- |
| 9 — create_enrollment_tables | DDL aplicado, sin registro | **RECUPERADA Y VERIFICADA** | 6 | 9 / 31 | **0** |
| 10 — create_courses_and_teacher_assignments | Pendiente, sin parcial | **APROBADA** | 7 | 10 / 33 | 18 |
| 11 — create_classroom_tables | Pendiente, sin parcial | **APROBADA** | 8 | 11 / 35 | 11 |
| 12 — create_learning_tables | Pendiente, sin parcial | **APROBADA** | 9 | 12 / 41 | 31 |
| 13 — create_attendance_tables | Pendiente, sin parcial | **APROBADA** | 10 | 13 / 45 | 23 |
| 14 — create_academic_office_tables | Pendiente, sin parcial | **APROBADA** | 11 | **14 / 52** | 32 |

Cada migración 10–14 se ejecutó secuencialmente desde su archivo original, con Illuminate Migrator y el repositorio Laravel instalados. Se reusaron los planes ya capturados, vinculados al manifest de 14 fuentes por hashes; no se reconstruyeron módulos ni migraciones. Antes de cada up se exigieron igualdad con el snapshot anterior, historial esperado, ausencia de sus tablas nuevas y tablas de aplicación vacías.

El ámbito SQL exige la secuencia exacta del plan y sus dependencias. No permite DML de negocio, DROP TABLE, TRUNCATE, reconstrucciones, otra base o registro anticipado. Al finalizar el up se verificó catálogo antes del INSERT; después del registro se consultaron nuevamente esquema e historial. El supervisor solo emitió el gate siguiente tras recibir un resultado aprobado. No hubo fallo SQL ni reparación adicional en esta corrida.

Se ejecutaron **115 DDL nuevos** para 10–14 y **seis registros Laravel** para 9–14. La inscripción de 9 no volvió a crear ninguna de sus cuatro tablas. Los primeros ocho registros quedaron intactos. No se invocaron down, rollback, fresh, wipe ni seeders.

## 6. Estado final real del esquema

La consulta de migration14/final-schema.json y la comparación con el manifest acreditan:

- **14 migraciones registradas, ninguna pendiente del alcance** y nombres correspondientes a las 14 fuentes originales.
- **52 tablas**, con 52 nombres distintos, BASE TABLE/InnoDB y colación verificada; es el número SQL observado, no un total supuesto.
- **502 columnas**, con los atributos comprobados por plan y conservación de tablas previas mediante snapshots encadenados.
- **112 restricciones FK**, **114 componentes de columnas** por las relaciones compuestas; destinos dentro de zarate_test y tablas presentes.
- **196 índices distintos por tabla/nombre**, **275 componentes de columnas**. No confundir componentes con índices o restricciones independientes.
- Batches: migraciones 1–4 en **1**; quinta **2**, sexta **3**, séptima **4**, octava **5**, novena **6**, décima **7**, undécima **8**, duodécima **9**, decimotercera **10** y decimocuarta **11**. La estrategia de una operación por migración se mantiene; no se uniformaron lotes anteriores.

La consistencia se respalda en el catálogo real y la secuencia de verificaciones: inicial igual al cierre anterior, comparación completa del plan actual y conservación exacta del metadato previo no afectado. Esto no sustituye pruebas funcionales con datos, endpoints, permisos de negocio o interfaz.

## 7. Aislamiento, integridad y cierre

Identidad comprobada en las operaciones: **MySQL 8.4.11, 127.0.0.1:3308, zarate_test / zarate_test@127.0.0.1**, datadir `.tools/misional-isolated/mysql-data`, UUID propio, rol NONE y nueve privilegios exclusivos del esquema, sin delegación ni privilegios globales peligrosos. Nombre lógico Laravel **mysql**, mismo PDO y CONNECTION_ID, sin reconexión ni PDO de lectura alterno. TLS estricto con **TLS_AES_256_GCM_SHA384**, CA/certificado/IP comprobados.

Se mantuvo el límite de **120 segundos por gate**. El supervisor acreditó nuevamente el árbol y los inmutables antes de emitir cada autorización, usando un proceso PHP nuevo. El gate no se sustituyó durante la conexión; su hash y vigencia se verificaron al finalizar los controles y antes de cada operación sensible. No hubo aceptación de autorizaciones vencidas ni aumento arbitrario de TTL.

Los **50 archivos inmutables** fijados para la ejecución conservaron sus hashes. Las cuatro configuraciones protegidas aprobaron hash/ACL al inicio/cierre. Los **681 resultados históricos** conservaron su contenido por SHA-256. Los otros documentos anteriores permanecen sin cambios; los pendientes del Prompt 24 se preservaron.

zarate_dev permaneció fuera del alcance SQL y no hubo escrituras propias en sus datos o configuraciones. No se tocaron credenciales, certificados, claves, roles de aplicación o migraciones originales. Los archivos InnoDB de desarrollo se siguen tratando como volátiles, sin restauración ni exigencia de igualdad con un snapshot antiguo. Esta protección no se presenta como una auditoría forense de actividad histórica de desarrollo. No se iniciaron, detuvieron ni modificaron los servicios de demostración 3307/8000/5173.

Preflight el **05/11/2026 a las 12:52:36 -05:00**, 1.188 objetos privados comprobados; monitor **13416**, worker **25180**. Prueba de consola, versión y validate-config terminaron **0**. Cierre a las **12:59:39 -05:00**: **seis clientes PHP 0, supervisor 0, servidor MySQL 0**; monitor **3221225786 / 0xC000013A** por Ctrl+C del árbol propio. Shutdown completo, **cero ERROR/FATAL y una advertencia** del motor. Se comprobaron 1.299 objetos al cerrar; PID-file ausente, cero procesos MySQL y cero conexiones 3308 según el supervisor. No quedó un servidor aislado arrancado por esta intervención.

## 8. Archivos, evidencias y pendientes

Documentación de este trabajo:

- **prompt-25-recuperacion-migracion-9.md:** prompt original íntegro y continuación íntegra, con su procedencia diferenciada; prefijo y sufijo verificados contra los adjuntos.
- **evidencias-recuperacion-migracion-9.md:** este cierre, diferenciando preparación anterior, reanudación, simulaciones y SQL real.

Herramientas locales preparadas antes del límite y preservadas al continuar: Checks25.php, ComparatorTests25.php, Execute25.php, Expression25.php, GuardTests25.php, Registration25.php, Run25.ps1, Scope25.php, ScopeTests25.php y Validate25.php; planes y resultados propios en evidence/prompt25. Los archivos compartidos MigrationGuard14.php/CheckLive15.ps1 incorporaron solo el contexto de esta fase a sus condiciones existentes. Se conserva el código anterior en backup y el fallo original del comparador del Prompt 24 sin editar.

Evidencias locales principales: offline-tests/comparator-tests.json y scope-tests.json; guard-tests.json; immutable.json y hashes de preservación; migration09/initial-schema.json, schema-verification.json, show-create.json, metadata-ledger.json y final-schema.json; migration10–14/operation-ledger.json, schema-verification.json, final-schema.json y outcome.json; gates/marcadores exclusivos; migration-results.json; process-proof-trace.jsonl; preflight/result/server.stop.json; final-summary.json y prompt-preservation.json. No se publican .tools, contraseñas, tokens o certificados privados.

El añadido documental de la continuación se completó correctamente; el comando que intentó imprimir su confirmación terminó con error por usar true en lugar de $true en PowerShell. Se verificaron después los bytes del prefijo y sufijo sin repetir el añadido. No tuvo efecto SQL ni alteró scripts de ejecución. Se conserva el resultado operativo por separado de esa incidencia de presentación.

**Preparación para Pest:** el esquema ya no tiene migraciones pendientes y está listo como base de la siguiente fase de pruebas aisladas. No se ejecutaron ni validaron aquí las suites Pest/Cypress ni la integración completa de sus runners. La próxima fase debe utilizar el mecanismo aislado y sus autorizaciones, no asumir que el comando por defecto selecciona esta base. No hay aprobación funcional de los cinco Bolts por el solo hecho de haber completado las migraciones.

**Pendientes:** pruebas de backend/frontend, regresión funcional e integración con datos de prueba en una fase posterior. El parser rechaza sintaxis futura no soportada; deberá revisarse y probarse si aparecen nuevas expresiones fuera de este alcance. No quedan bloqueos de registro o esquema dentro de las 14 migraciones.

No se realizaron commits, push, merge ni PR. Los cambios pendientes anteriores se conservaron. Git al cierre conserva los dos cambios previos del Prompt 24 y muestra los dos documentos del Prompt 25 nuevos, sin otros archivos rastreados modificados. .tools permanece ignorado y no rastreado. git diff --check terminó sin errores. La auditoría final examinó 177 archivos, incluidos tres documentos, sin coincidencias de secretos fuera de sus recursos dedicados.

**A. MIGRACIONES 14/14 COMPLETADAS Y VERIFICADAS — 52 TABLAS REALES.**
