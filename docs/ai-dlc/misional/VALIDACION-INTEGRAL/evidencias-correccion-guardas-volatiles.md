# Prompt 23 — Guardas, archivos volátiles y recuperación limitada

Fecha: **04/11/2026**, America/Lima. Rama comprobada: `test/integracion-misional`.

**Resultado: QUINTA MIGRACIÓN RECUPERADA Y VERIFICADA.** Se corrigió el modelo de preservación y la comprobación de vigencia; se ejecutaron seis DDL de reparación y se verificó el esquema de permisos. El primer intento de registro falló por un literal SQL demasiado restrictivo. Se conservó ese fallo, se reprodujo offline y se preparó una operación separada de registro, sin repetir DDL, con preflight y autorización nuevos. Laravel registró la quinta en **batch 2**. Estado SQL final verificado: **15 tablas, cinco migraciones registradas y cuatro FK de permisos**. Las migraciones 6–14 y la validación funcional siguen pendientes.

## 1. Contexto y diagnóstico rectificado

Se revisaron las evidencias 19, 21 y 22, el diagnóstico y plan de recuperación, scripts compartidos y las definiciones originales. No existe evidencia de ejecución del Prompt 20. Git tenía cuatro documentos nuevos pendientes de los Prompts 21/22; se conservaron.

Las 28 diferencias se encuentran exclusivamente en `.tools/mysql-data`, el datadir de desarrollo. **No son cambios de código, configuración, migraciones o documentación.** Son archivos internos, operativos o de datos de MySQL. Los cambios físicos de users.ibd y audit_logs.ibd no demuestran corrupción, ataque ni alteración lógica de filas. Tampoco se acredita retrospectivamente su causa concreta.

El diagnóstico anterior impedía avanzar por exigir igualdad con un snapshot antiguo de una base susceptible de actividad normal. Se rectifica esa interpretación expresamente conforme al Prompt 23. Los registros anteriores no se reescribieron. Las diferencias se conservan como observaciones; no se restauraron datos ni se accedió a su contenido privado.

El listado individual completo está en evidencias-recuperacion-seguridad.md. Se reclasifican **las 28 entradas**, sin excepciones, como MySQL mutable:

| Clase | Entradas exactas relativas a D:\zarate-saas\.tools\mysql-data | Cantidad / estado |
| --- | --- | --- |
| Doublewrite | #ib_16384_0.dblwr | Una diferente |
| Binlogs e índice | binlog.000001, binlog.000002, binlog.000003; binlog.000017, binlog.index; binlog.000018 | Tres ausentes, dos diferentes y una agregada |
| Sistema, temporal, PID y undo | ibdata1, ibtmp1, IDC.pid, mysql.ibd, undo_001, undo_002 | Seis diferentes |
| Redo | #innodb_redo\#ib_redo109; #innodb_redo\#ib_redo110; #innodb_redo\#ib_redo141_tmp | Una ausente, una diferente y una agregada |
| Temporales InnoDB | #innodb_temp\temp_1.ibt a temp_10.ibt, inclusive | Diez diferentes |
| Tablespaces de datos | zarate_dev\users.ibd, zarate_dev\audit_logs.ibd | Dos diferentes |

Total conservado: **22 diferentes, cuatro ausentes, dos agregadas**. Todas son susceptibles de cambio por actividad del motor. **La causa histórica permanece sin determinar**, pero su hash mutable no se usa como condición de integridad de código. Ninguna de esas diferencias se considera por sí sola autorización para leer o escribir desarrollo.

## 2. Preservación de inmutables y protección independiente

Se creó un supervisor local separado, evidence/prompt23/Run23.ps1, derivado del supervisor existente. Su CheckProtected verifica hashes de **23 archivos críticos**: 14 migraciones, herramientas de seguridad y reparación, validación TLS y configuración de permisos. Verifica también las cuatro configuraciones protegidas originales mediante hash y ACL. Mantiene comprobación de rutas, ausencia de enlaces, opciones MySQL, identidad de binario y árbol privado de ACL/propietarios/hardlinks.

Se eliminó únicamente en este supervisor nuevo la exigencia de hashes, timestamps e inventario estáticos sobre `.tools/mysql-data`. No se amplió una exclusión a código/configuración ni se sustituyeron snapshots antiguos. Run15.ps1 original permanece intacto y conserva su política histórica. La lista nueva de inmutables se capturó antes del arranque; **23/23 permanecen sin cambios al cierre**. Las cuatro configuraciones protegidas aprobaron antes/después. Se comprobaron **505 resultados anteriores por hash, cero cambios**.

La protección de zarate_dev descansa ahora en controles independientes: cuenta SQL restringida exclusivamente al esquema zarate_test; identidad de base, puerto, UUID y datadir; TLS estricto; mismo PDO y CONNECTION_ID; configuración efectiva fijada; sin reconexión transparente; plan SQL fijo y capacidad de registro limitada. No existe un comando que copie, restaure o escriba archivos de desarrollo. No se probaron escrituras rechazadas contra zarate_dev.

No se certifica igualdad histórica de los archivos mutables, ni se presenta una sesión restringida como auditoría administrativa global de desarrollo. Los servicios de demostración no se iniciaron, detuvieron ni modificaron. El supervisor conserva rechazo ante procesos/servicios ajenos; no los termina para conseguir un entorno disponible.

## 3. Corrección de vigencia

El gate sigue emitiéndose después del arranque y acreditación del árbol aislado, antes del cliente. Para Prompt 23 se mantuvo **120 segundos**, sin renovación ni ampliación. La comprobación de antigüedad al inicio era insuficiente: la inspección CIM/listeners/hashes podía terminar después del vencimiento. La reconstrucción histórica del Prompt 18 ya situaba un CREATE a 1.659 segundos de un gate de 600 segundos; la causa física del retraso sigue desconocida.

Cambios en herramientas locales:

- CheckLive15.ps1 comprueba también edad al finalizar la inspección; rechaza vencimiento o fecha futura antes de devolver LIVE_PROCESS_VERIFIED. Mantiene PID/creación, parentesco, imagen/opciones, listener único 127.0.0.1:3308, PID-file, hashes de binario/configuración/CA. Las trazas de fase 23 se escriben separadamente.
- MigrationGuard14.php admite fase 23, fija en memoria el hash del gate y vuelve a validar su edad/hash al terminar las lecturas SQL de identidad/TLS/grants. assertFresh23 se exige inmediatamente antes de cada DDL y después de autorizar consultas del repositorio. Un gate reemplazado o vencido no es aceptable. El nombre lógico sigue siendo mysql; no se amplían nombres, bases ni usuarios admitidos.
- Se añadió comprobación de certificado local para la fase 23; se conservan los controles criptográficos previos y la verificación de certificado del conector PDO.

Si el plazo se agota, esta capacidad se detiene; **no renueva automáticamente la autorización**. La corrección evita escrituras con prueba caducada, pero no garantiza que un trabajo futuro de duración mayor que 120 segundos llegue a terminar. No se ejecutó Artisan ni el migrador de las pendientes 6–14.

## 4. Pruebas positivas y negativas

GuardTests23.php ejecutó **18 comprobaciones offline: 18 aprobadas, cero fallidas, cero conexiones SQL**. Se repitieron tras preparar el ejecutor, conservando el mismo resultado. Son controles locales, no Pest ni pruebas funcionales de EcoAula.

| Grupo | Resultado |
| --- | --- |
| Cuatro controles positivos | Identidad aislada simulada, edad vigente, certificado local y configuración efectiva: 4/4 |
| Identidad negativa | Rechaza zarate_dev, puerto 3307, root, datadir de desarrollo y UUID distinto: 5/5 |
| Vigencia negativa | Rechaza vencida, vencida al finalizar inspección y emitida en el futuro: 3/3 |
| Certificados negativos | Certificado inválido y CA incorrecta: 2/2 |
| Configuración negativa | Otra base, puerto, usuario y verificación TLS desactivada: 4/4 |

Además, se ejecutó el helper real contra el primer gate de fase 23 **ya vencido**, después de su cierre: devolvió BLOCKED y salida **21**, rechazo esperado. No abrió SQL ni inició procesos MySQL. La traza de las primeras pruebas vivas se conservó antes de esta comprobación negativa en live-process-proof-trace.jsonl. La operación posterior de registro generó un gate nuevo después de un preflight completo y del arranque, preservando el anterior.

La validación criptográfica anterior a ambos arranques aprobó cadena, firma, clave/certificado, SAN IP, fechas, certificado servidor y rechazos de CA/nombre incorrectos. La reparación tuvo **26 acreditaciones vivas, cero rechazadas**, edades finales entre **3 y 95 segundos**. La operación complementaria tuvo **13 acreditaciones vivas, cero rechazadas**, edades entre **2 y 27 segundos**. En total son **39 acreditaciones vivas válidas**, además del rechazo esperado del gate vencido. La excepción del primer registro no fue una caducidad.

Sintaxis PHP de guarda y reparador aprobada; parser PowerShell de supervisor y helper sin errores. `git diff --check` sin errores. Las simulaciones no equivalen a intentos de conexión a otros servidores ni a pruebas con datos institucionales.

## 5. Lectura SQL vigente y alcance de reparación

Se ejecutó una sola vez Run23.ps1 con elevación para inspección/control del árbol propio. El cliente abrió únicamente la conexión de pruebas. Se comprobaron por las guardas ejecutadas:

| Control | Estado acreditado durante esta ejecución |
| --- | --- |
| Host / puerto | 127.0.0.1:3308 |
| Base / cuenta efectiva | zarate_test / zarate_test@127.0.0.1 |
| Motor / datadir | MySQL 8.4.11 / .tools/misional-isolated/mysql-data |
| UUID / rol / grants | UUID correspondiente al datadir, rol NONE, nueve privilegios exclusivos de esquema y sin delegación/globales peligrosos |
| Laravel / PDO | Nombre mysql, PDO idéntico, CONNECTION_ID estable, sin PDO de lectura alternativo ni reconexión |
| TLS | CA y certificado/IP verificados, PDO exige verificación; la operación final registró TLS_AES_256_GCM_SHA384 |

El snapshot inicial SQL coincidió exactamente, en sus secciones de catálogo, con el del Prompt 19: 14 tablas, cuatro migraciones batch 1, columnas/índices/restricciones/FK/triggers sin diferencias inesperadas. Se verificaron las 14 fuentes mediante manifest/hashes y configuración de equipos institution_id/model_id. Se comprobaron mediante COUNT(*) las **13 tablas de aplicación existentes: todas vacías**, sin leer filas personales. Las únicas filas leídas fueron las cuatro del repositorio migrations.

El plan fijo, un marcador repair.once creado de modo exclusivo y las guardas limitaron la intervención a seis DDL:

1. Índice model_has_roles_model_id_model_type_index(model_id,model_type).
2. Índice model_has_roles_team_foreign_key_index(institution_id).
3. FK model_has_roles_role_id_foreign a roles(id), DELETE CASCADE.
4. CREATE role_has_permissions con permission_id/role_id unsigned y PK compuesta, InnoDB/utf8mb4_unicode_ci.
5. FK de permission_id a permissions(id), DELETE CASCADE.
6. FK de role_id a roles(id), DELETE CASCADE.

Se verificó catálogo después de cada operación y se guardó cada snapshot. Se conservaron tablas existentes y PK de model_has_roles. Los índices de soporte de FK se dejaron al motor y se comprobaron sus columnas/nombres, sin duplicarlos. No hubo DROP, TRUNCATE, desactivación de FK, seeders ni modificaciones de datos de negocio.

Después del sexto DDL la equivalencia comprobó las 15 tablas, conservación exacta de columnas previas, índices y restricciones de tablas no reparadas, tipos/nullabilidad/defaults/extra de columnas nuevas, índices completos de las dos tablas reparadas y cuatro FK correctas. Se verificaron colación/motor y ausencia de triggers visibles. Se preservaron los cuatro registros originales. Se realizó el efecto final de invalidación de caché únicamente en store array aislado, sin cache:clear global.

## 6. Fallo conservado del registro Laravel

El intento posterior utilizó DatabaseMigrationRepository real y el resolver fijado. **No llegó a insertar el quinto registro.** La capacidad permitía consultar el siguiente lote, pero su literal esperaba:

```sql
select max(`batch`) as aggregate from `migrations`
```

Laravel 13 realmente compila:

```sql
select max(`batch`) as `aggregate` from `migrations`
```

La diferencia de comillas del alias provocó el rechazo exacto en la lista permitida antes de ejecutar esa consulta. Se reprodujo **offline**, con la gramática instalada y Connection::pretend, sobre un PDO cuya resolución lanza: cero conexiones, cero escrituras. El código fuente de compileAggregate y la reproducción respaldan la causa; no se atribuye al servidor, TLS, contraseña o falta de privilegios.

El manejador capturó RuntimeException, archivo Adapter14.php/línea 10, SQLSTATE null, seis DDL exitosos, seis intentados y migrationRegistered=false. Guardó REPAIR_PARTIAL_SCHEMA_PRESERVED. El mensaje heredado del supervisor «Pest diagnostic blocked» corresponde a ese cliente: **no se ejecutó Pest**.

El primer proceso se detuvo y conservó marcador, ledger y salida de fallo. No se reejecutó Repair23.php ni se repitió ningún DDL. A continuación se preparó una capacidad separada, Registration23.php, que permite exactamente el SELECT legítimo compilado y un único INSERT Laravel de la quinta en batch 2. Se conservó el gate anterior en registration/previous-gate.json y se realizó un arranque supervisado nuevo. Esto constituye una autorización fresca para otra operación acotada; no una renovación del gate dentro del mismo objeto PDO ni una aceptación de autorización vencida.

La operación complementaria volvió a verificar los inmutables, TLS, proceso, conexión y catálogo. Exigió coincidencia exacta con after-operation-6.json, equivalencia con el código original, cuatro registros previos y **14 tablas de aplicación vacías** mediante agregados. No contiene instrucciones DDL. La gramática real también se comprobó con pretend antes de autorizar SQL. DatabaseMigrationRepository calculó el siguiente lote **2** e insertó un único registro de `2026_10_01_131621_create_permission_tables`.

Después se volvió a consultar y validar todo el catálogo: 15 tablas, cuatro FK de permisos y **cinco registros**, con los cuatro originales intactos y la quinta en batch 2. registration/final-schema.json y registration/outcome.json acreditan FIFTH_RECOVERED_VERIFIED. El fallo inicial no se borró ni se presenta como una prueba aprobada; su causa fue resuelta en la capacidad de registro separada.

## 7. Resultados exactos, cierre y pendientes

| Elemento | Antes | Después / resultado |
| --- | --- | --- |
| Falso bloqueo por hashes .ibd | Exigencia de igualdad histórica | Corregido en el supervisor nuevo; diferencias preservadas como volátiles |
| Protección de zarate_dev | Configuración y snapshot | Controles independientes activos; sin acceso SQL ni escrituras propias a desarrollo |
| Vigencia | Solo comprobación inicial | Comprobación final e inmediata antes de DDL; plazo intacto |
| Esquema | 14 tablas, quinta parcial | **15 tablas; cuatro FK de permisos verificadas** |
| Registro Laravel | Cuatro filas, batch 1 | **Cinco filas; cuatro originales intactas y quinta en batch 2** |
| DDL | Pendientes de reparación | **6/6 exitosos**, verificados individualmente |
| Metadatos escritos | Ninguno de la quinta | **Un INSERT mediante repositorio Laravel**, en la operación complementaria; cero en el primer intento |
| Comprobaciones offline | No ejecutadas en fase 23 | **18/18 aprobadas** + helper vencido rechazado como se esperaba |
| Registro de quinta | Pendiente | Primer intento fallido conservado; operación complementaria aprobada y verificada |
| Migraciones 6–14 / seeders / Pest / Cypress | No autorizadas en esta fase | **Cero ejecutadas** |

Preflight a las **21:46:54 -05:00**: 925 objetos privados comprobados; prueba de consola, versión y validate-config terminaron **0**. Monitor **8496**, worker **12256**. Cierre a las **21:49:04 -05:00**: cliente PHP **23**, supervisor **1**, servidor MySQL **0**, monitor **3221225786 / 0xC000013A** por Ctrl+C. Shutdown completo, cero ERROR/FATAL y una advertencia del motor. Se comprobaron 964 objetos al cierre; PID-file ausente, cero procesos MySQL y cero conexiones en 3308 según el supervisor. Solo se señaló el árbol propio acreditado.

Operación complementaria: preflight a las **21:55:51 -05:00**, 978 objetos comprobados; monitor **13288**, worker **15692**. Cierre a las **21:56:42 -05:00**, **PHP 0, supervisor 0, servidor MySQL 0**, monitor 3221225786 por Ctrl+C. Shutdown completo, cero ERROR/FATAL y una advertencia del motor; 1.006 objetos comprobados al cerrar. PID-file ausente, cero procesos MySQL y cero conexiones 3308. Los **28 archivos inmutables de esta segunda capacidad** conservaron sus hashes, al igual que los 505 resultados históricos. No se tocaron servicios de demostración.

Se realizaron dos arranques aislados: el primero reparó esquema y se detuvo antes del registro; el segundo revalidó y registró exclusivamente la quinta. El último snapshot acreditado es **registration/final-schema.json: 15 tablas y cinco migraciones**. Las salidas y los snapshots de ambos arranques permanecen separados.

Persisten estos límites: las nueve migraciones siguientes están fuera del alcance y pendientes; no hay validación funcional Pest/Cypress; no existe auditoría forense del historial de actividad de desarrollo; los snapshots y privilegios son visibles para la cuenta restringida, no un inventario administrativo global. Ambas capacidades tienen marcadores exclusivos y no deben reutilizarse automáticamente. No iniciar Pest sobre el esquema todavía incompleto de las 14 migraciones.

## 8. Archivos y evidencias

Documentos nuevos de esta fase:

- prompt-23-correccion-guardas-volatiles.md: prompt íntegro del adjunto.
- evidencias-correccion-guardas-volatiles.md: este informe.

Herramientas locales modificadas, ignoradas por Git:

- evidence/prompt14/MigrationGuard14.php: fase 23, vigencia final, gate fijado, certificado y permiso limitado de repositorio.
- evidence/prompt15/CheckLive15.ps1: vigencia al finalizar y trazas separadas.
- evidence/prompt23: Run23.ps1, Repair23.php, GuardTests23.php y RepositoryGrammar23.php; Registration23.php, ChecksRegistration23.php y RunRegistration23.ps1 para la operación complementaria; Audit23.php, backups, manifests de inmutables y resultados propios.

Resultados locales principales: guard-tests.json, immutable.json, preservation-summary.json, initial-schema.json, empty-table-counts.json, plan.json, repair.once, ledger.json, after-operation-1 a 6.json, equivalence.json, outcome.json, repository-grammar.json, live-process-proof-trace.jsonl, negative-expired-helper.json, preflight.json, result.json y server.stop.json. No se publican estos recursos de .tools ni certificados/credenciales.

La operación complementaria conserva sus propios initial-schema.json, final-schema.json, metadata-ledger.json, registration.once, outcome.json, preflight/result/server.stop.json y gate anterior, dentro de registration. immutable-registration.json fija su código; final-summary.json resume 15 tablas/cinco migraciones/cuatro FK, preservación y hashes. La salida genérica de la guarda mantiene writesAuthorized=false porque no concede autorización global; la capacidad específica permite únicamente las sentencias delimitadas de reparación o registro.

No se modificaron fuentes funcionales, las 14 migraciones, las cuatro configuraciones protegidas, credenciales ni documentos anteriores. No hubo commits, push, merge o PR. Git conserva los cuatro documentos previos de 21/22 y añade únicamente los dos documentos de 23; las herramientas están ignoradas y no rastreadas. La copia del prompt coincide por SHA-256 con el adjunto. La auditoría local examinó **150 archivos, incluidos ambos documentos, con cero coincidencias de secretos fuera de recursos dedicados**; `git diff --check` terminó sin errores. Se conservó también el incidente de preparación PowerShell de la capacidad complementaria: una sustitución trató una cadena como carácter; se corrigió antes de arrancarla y su parser aprobó. No tuvo efectos SQL ni se ocultó como defecto del servidor.

**QUINTA MIGRACIÓN RECUPERADA Y VERIFICADA.** Esquema completo y registro Laravel comprobados; fallo inicial conservado y resuelto mediante operación separada. Las nueve migraciones siguientes y las pruebas funcionales requieren una fase posterior.
