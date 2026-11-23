# Prompt 29 — Catálogos académicos y aislamiento institucional

Fecha: 05/11/2026, America/Lima. Rama: `test/integracion-misional`.

## Continuidad y alcance

Se continúa desde el cierre del Prompt 28: zarate_pest en MySQL aislado 127.0.0.1:3308, 14 migraciones/52 tablas, cuenta exclusiva con TLS, ocho privilegios sin DROP, 8 casos distintos aprobados y 43 aserciones de corridas aprobadas. Quedan 306 casos sin ejecutar. Las incidencias históricas de infraestructura/fixtures del Prompt 28 permanecen en sus documentos y JUnit; no se vuelven a contar como casos nuevos.

Se revisaron evidencias 26/27/28, launcher privado, backend/phpunit.xml, tests/Pest.php, Sprint2Test, AcademicCatalog, AcademicService, AcademicPolicy, modelos/scopes, fixtures/factories, seeders de permisos y traits de inicialización. El destino histórico de backend/AGENTS.md y phpunit.xml permanece intacto; la autorización expresa para zarate_pest gobierna esta ejecución privada. No se usa composer test ni se modifica .env.

No se repiten HealthTest, los cuatro casos del Prompt 28, sus probes DML ni los 60 controles offline acreditados. Las verificaciones vivas de identidad/TLS/grants y estado SQL se renuevan porque pertenecen a cada proceso/ejecución, no constituyen una aprobación histórica reutilizable.

## Selección de ocho casos reales

Todos proceden de `backend/tests/Feature/Sprint2Test.php`, usan DatabaseTransactions y pertenecen al inventario original de 314 casos. Un dataset concreto es un caso distinto del inventario, no una repetición ficticia del mismo caso. `cases.json` conserva el originalId completo con dataset y hashes.

| ID | Nombre original y dataset | Área principal, sin doble conteo | Justificación |
| --- | --- | --- | --- |
| C29-01 | creates reads edits and audits an academic catalog — ('academic-periods') | Catálogos académicos | Alta, consulta, edición y auditoría real de periodos |
| C29-02 | creates reads edits and audits an academic catalog — ('sections') | Catálogos académicos | Sección relacionada con año/grado propios, consulta y edición |
| C29-03 | closes a period and blocks grading and subsequent edits | Catálogos académicos | Cierre, grading_open=false, rechazo de edición y auditoría |
| C29-04 | assigns read only academic permissions to secretary and teacher — ('SECRETARY') | Roles y permisos | GET autorizado y POST prohibido en los seis catálogos reales |
| C29-05 | isolates academic records and policies — ('subjects') | Aislamiento institucional | GET/PATCH ajenos rechazados, lista sin recurso ajeno y Policy denegada |
| C29-06 | isolates academic records and policies — ('sections') | Aislamiento institucional | Sección ajena con padres válidos de otra institución, filtros y Policy |
| C29-07 | preserves parent relationships on historical records | Relaciones académicas | Rechazo del cambio de año de una sección histórica |
| C29-08 | prevents cross institution section relations at model level | Relaciones académicas | Modelo rechaza el grado de otra institución antes de persistir |

Los ocho son nuevos respecto de los ocho ya aprobados. El lote cubre acceso propio mediante CRUD, recursos ajenos realmente creados en la transacción, identificadores GET/PATCH, filtrado Laravel, permisos administrativos y relaciones indirectas. No se basa en botones React ocultos. Las pruebas implementadas no se convierten en requisitos inventados: Subject es el catálogo real de asignaturas; no se presupone una entidad independiente de áreas/aulas. Cursos/Aula Virtual quedan fuera de este lote.

La preparación sintética existente crea institución, administrador, permisos y año/nivel/grado; los casos de aislamiento crean una segunda institución y sus padres académicos, sin ejecutar el seeder completo de roles para ella. No se copian datos reales. Los servicios académicos/auditoría usan la conexión predeterminada y transacciones/savepoints del mecanismo validado. No se identificaron DDL, SQL DELETE, TRUNCATE, commits exteriores, jobs externos o conexiones secundarias en estos ocho cuerpos/fixtures. RolePermissionSeeder es un fixture de permisos, no un seeder demo.

## Contrato privado y guardas conservadas

Se creó `.tools/misional-isolated/evidence/prompt29`, sin modificar las herramientas anteriores. Adapter29/Guard29/Pdo29/Runtime29 conservan el algoritmo del Prompt 28: testing, destino fijo, mismo PDO/CONNECTION_ID, UUID/datadir, grants exactos, TLS CA/certificado/IP, no reconexión, TTL de 120 segundos y comprobación de procesos/listener por operación. El verificador local mantiene hashes y handles de archivos bloqueados contra escritura/renombrado con identidad por handle, sin alargar el gate.

Launch29 precarga el TestCase protegido, exige XML/directorio/archivo/filtro de la lista, verifica hashes y bloquea DemoSeeder/paralelismo. TestCase29 añade la comparación exacta del **dataName** al nombre de método y clase: autorizar un dataset no autoriza los demás. Se exige DatabaseTransactions y se rechazan traits reconstructivos antes de fixtures.

La única copia funcional de test es Sprint2Test.php en el directorio privado. Se comprueba byte por byte contra el original con exactamente dos sustituciones del beforeEach: expectativa literal de base zarate_pest y Origin 127.0.0.1:5174. Se mantienen cuerpos, datasets, hooks y aserciones funcionales. No se desactiva middleware ni se simula el nombre de base.

Para este lote **DELETE se rechaza expresamente incluso dentro de una transacción**. No se aprovecha que la cuenta tenga el privilegio histórico ni se amplían grants. Se hicieron únicamente tres controles nuevos focalizados de rechazo de DELETE (tabla propia, migrations y esquema protegido): 3 aprobados, 0 fallidos, sin SQL. No son tres casos Pest.

Los ocho filtros se comprobaron por descubrimiento: exactamente un caso por filtro, sin setup/conexión SQL. El supervisor ejecuta cada caso secuencialmente y se detiene ante salida no cero; no tiene bucles de reintento. Antes y después de cada caso se verifican catálogo completo y conteos desde otro proceso. El cierre del PDO exige rollback y conteos iniciales; no se borra información para ocultar residuos.

NativeParity29 y las denegaciones reales de acceso a zarate_dev/zarate_test se utilizan para comprobar el servidor actual antes de los casos. No se utilizan credenciales administrativas ni se modifican cuentas. Los perfiles usan almacenamiento/bootstrap privados storage-pest29/bootstrap-pest29; no sirven HTTP ni inician servicios de demostración.

## Exclusiones y riesgos pendientes

- No se ejecutan los otros datasets de los métodos seleccionados ni los demás casos de Sprint2, salvo los enumerados. Un descubrimiento de declaraciones no es una ejecución aprobada.
- Los dos casos que prueban AcademicDemoSeeder/PeopleDemoSeeder permanecen bloqueados: reemplazar esas llamadas por factories ocultaría su intención de idempotencia. No se ejecutan seeders demo.
- DELETE real, archivos, jobs/afterCommit y efectos externos siguen pendientes. Los casos de soft delete, eliminación, delegación que requiera detach/sync destructivo o conexiones diferentes necesitan revisión expresa antes de otro lote.
- No se utiliza RefreshDatabase ni DatabaseMigrations; no se cambia/desactiva el trait para superar fallos. No hay fresh/wipe/rollback de migraciones.
- El rollback demuestra igualdad lógica de filas y esquema, no identidad de archivos InnoDB o contadores autoincrementales. Las 51 tablas de aplicación deben regresar a cero filas y migrations a sus 14 registros originales.
- Los permisos y relaciones evaluados son los de las políticas/servicios reales; no se certifica todavía la seguridad de toda la suite ni todos los flujos académicos.

## Resultados

Los resultados se incorporan desde JUnit, comprobantes de identidad, contadores transaccionales y snapshots posteriores; no se anticipa su aprobación.

## Recuperación tras reinicio — 05/11/2026

Se recuperó la corrida original en `.tools/misional-isolated/evidence/prompt29/run/`. No quedó solamente en preflight: llegó a ejecutar C29-01 y se detuvo. Se conservaron todos sus archivos y no se reejecutaron casos en esta recuperación.

### Resultado real recuperado

`run/case1.xml` contiene un único testcase: **0 aprobados, 0 fallos de aserción, 1 error, 0 aserciones**; salida Pest 2. El error es `ISOLATION_BLOCKED_41`, originado en `Guard29.php:41` (`validAge23`) durante una lectura de permissions en los fixtures. La guarda exige una autorización de antigüedad máxima de 120 segundos. No se alcanzaron las aserciones del catálogo.

Está demostrado el rechazo por vigencia; no está demostrada la causa de la demora ni una relación causal con la pérdida de Internet o el reinicio. Tampoco se acredita un defecto funcional de Laravel. No se amplió el TTL, no se renovó la autorización dentro del caso y no se recortaron fixtures para eludirlo.

| Área | Casos ejecutados | Aprobados | Fallidos de aserción | Errores de entorno | Pendientes sin ejecutar |
| --- | ---: | ---: | ---: | ---: | ---: |
| Catálogos académicos | 1 | 0 | 0 | 1 | 2 |
| Roles y permisos | 0 | 0 | 0 | 0 | 1 |
| Aislamiento institucional | 0 | 0 | 0 | 0 | 2 |
| Relaciones académicas | 0 | 0 | 0 | 0 | 2 |
| Total del lote | 1 | 0 | 0 | 1 | 7 |

C29-01 queda bloqueado por el error y C29-02 a C29-08 no ejecutados. Los ocho siguen pendientes de aprobación. El acumulado conserva **8 casos distintos aprobados y 43 aserciones de ejecuciones aprobadas** de los Prompts 27/28. Del inventario de 314, hay **305 casos nunca ejecutados** y **306 todavía no aprobados**, incluyendo el caso con error. No se suman descubrimientos ni controles de guardas como casos Pest.

### Seguridad acreditada por la corrida anterior

- `run/native.stdout.json`: coincidencia entre las pruebas de identidad nativa y PowerShell del servidor entonces activo.
- `run/negative.stdout.json`: dos denegaciones reales de acceso a las bases protegidas, sin cambiar privilegios.
- `run/before.stdout.json`, `pre-case1.stdout.json`, `post-case1.stdout.json` y `after.stdout.json`: esquema preservado, 52 tablas, 14 migraciones y cero filas fuera del repositorio de migraciones. Identidad efectiva zarate_pest/3308/cuenta exclusiva, TLS estricto con TLS_AES_256_GCM_SHA384, ocho privilegios de esquema, cero privilegios globales peligrosos y cero grants de otros esquemas.
- `run/effects-25176.json`: un BEGIN y un ROLLBACK; contadores de operaciones interceptadas SELECT 231, INSERT 151, UPDATE 0, DELETE 0 y SAVEPOINT 122. Son contadores del adaptador, no un total de filas persistidas ni de aserciones. Las comprobaciones independientes posteriores acreditan ausencia de residuos.
- `run/result.json`: cierre completo del servidor propiedad del supervisor, salida del servidor 0, PID ausente, cero procesos MySQL y conexiones 3308 al terminar; configuraciones de desarrollo conservadas (4). El éxito del supervisor al cerrar no equivale a éxito de Pest (`authClientExit: 2`).

### Verificaciones actuales de recuperación

Solo se hicieron lecturas del sistema, hashes y revisión de evidencias. No se arrancó MySQL, no se abrió una conexión SQL, no se ejecutó Pest, no se modificaron datos ni se detuvo ningún servicio.

- `recovery-processes.json`: consulta CIM y listeners a las 19:41 America/Lima; cero procesos mysqld y ningún listener en 3307/3308/8000/5173. La ausencia actual de los servicios de demostración se observa después del reinicio; esta recuperación no los detuvo.
- `recovery-integrity-corrected.json`: 163 pins de código previo, 54 documentos previos y 188 pins de Prompt 29 comprobados, todos con cero diferencias. El prompt documental coincide byte por byte con el adjunto original. El PID real `.tools/misional-isolated/pids/mysql.pid` está ausente.
- Se conserva `recovery-integrity.json`, cuyo conteo inicial de arrays PowerShell fue incorrecto y **no es evidencia válida de integridad**. Se corrigió la enumeración sin modificar los archivos examinados. En `recovery-processes.json`, el campo pidFileExists consultó una ruta distinta; la comprobación del PID efectivo consta en el informe corregido.
- `git diff --check`: aprobado. Rama `test/integracion-misional`; cambios previos de Git conservados, sin commits ni push. No se modificó código funcional, migraciones, privilegios o configuraciones de desarrollo.

La identidad SQL/TLS y los conteos anteriores son evidencia histórica de esa corrida, **no una nueva certificación del estado SQL posterior al reinicio**. Antes de otro intento se requieren preflight y autorización frescos, identidad efectiva/TLS/grants, esquema y conteos actuales. No se presupone reutilizable el gate antiguo.

### Estado y siguiente punto seguro

**D. BLOQUEADO POR SEGURIDAD O ENTORNO. Prompt 29 no finalizado.** La instrucción de recuperación exige detenerse cuando existan condiciones de seguridad pendientes: sigue sin explicarse por qué el fixture excedió la vigencia admitida. No se relanza a ciegas ni se debilita la guarda.

El próximo paso es diagnosticar la duración del fixture y del verificador en las trazas existentes, preservando la corrida original. Una eventual corrección debe mantener las mismas comprobaciones y el límite vigente. Solo después corresponde un nuevo directorio de corrida y preflight completo para los ocho casos aún sin aprobación; no hay casos exitosos de este lote que repetir. Las restantes pruebas de Sprint2 y la suite completa permanecen fuera de esta autorización. DELETE, DDL, seeders demo y efectos externos siguen bloqueados/no validados.

En esta recuperación únicamente se amplió este documento y se añadieron tres informes privados de recuperación; Build29.php, Prepare29.php y todas las herramientas anteriores se conservaron intactos. Evidencias privadas: `.tools/misional-isolated/evidence/prompt29/`; documentación publicable: este archivo y `prompt-29-catalogos-aislamiento-pest.md`. No contienen credenciales.

## Continuación autorizada — diagnóstico y reanudación del 05/11/2026

Esta sección actualiza el estado final sin reemplazar el bloqueo ni los errores históricos anteriores. Se recibió autorización expresa para investigar la expiración, recuperar MySQL aislado y reanudar exclusivamente los ocho casos. El prompt de continuación se agregó íntegro al documento del prompt original, conservando su contenido anterior como prefijo.

### Diagnóstico de vigencia y actuación aplicada

El límite se establece en `Guard29.php::validAge23` y también en el verificador nativo: antigüedad de 0 a 120 segundos respecto de `connection-gate.json.unixTime`. El supervisor emite ese gate mediante FreshGate26 **después** de las inspecciones preparatorias y justo antes de cada PHP. El cliente conserva su hash; la autorización no se cambia ni renueva dentro de la transacción. La vigencia se comprueba antes de habilitar fixtures, antes de BEGIN y en la atestación de cada operación; esta última contrasta proceso/listener, PDO/CONNECTION_ID, identidad SQL, destino, TLS y grants.

Por tanto, no se confirmó una autorización obtenida demasiado pronto durante el preflight. La causa inmediata del error original está demostrada: vencimiento durante el fixture de permisos antes de las aserciones. **La causa de la demora original no puede determinarse con precisión**: los registros históricos carecen de cronometraje por etapa. No se atribuye sin evidencia a Internet, suspensión, hashing, SQL o Windows. La última traza nativa exitosa de aquella corrida llegó a 85 segundos; no permite reconstruir el intervalo posterior hasta el rechazo.

No se justificó modificar la duración ni la semántica del ciclo de autorización. Se instrumentó una copia privada del supervisor/launcher/guardas para medir etapas con reloj de pared y monotónico, atestaciones agregadas y antigüedad del gate. Se reanudó desde inspección limpia con autorizaciones nuevas por caso, una vez comprobados rollback y ausencia de residuos. No se renovaron gates dentro de transacciones ni se añadieron reintentos automáticos. La expiración dejó de reproducirse en los ocho casos finales; esto acredita su ejecución dentro de la vigencia, **no demuestra retrospectivamente la causa de la lentitud anterior**.

### Intentos conservados y correcciones del instrumental

1. `prompt29/run`: primer caso con error de vigencia, cero aserciones; rollback y comprobaciones posteriores conservados.
2. `prompt29b/run`: primer intento instrumentado, detenido antes de Pest/SQL por `Call to undefined function event29()` en Launch29.php. Fue un error introducido en el wrapper de métricas, no un defecto del sistema. Salida 255, sin JUnit, transacción ni fixtures. No se cuenta como un testcase ejecutado. Las inspecciones antes/después comprobaron 52 tablas, 14 migraciones y ausencia de residuos. El servidor se cerró correctamente.
3. `prompt29c/run`: se corrigió exclusivamente la llamada a `MisionalPest29c\event29` y se validó el rechazo de una invocación inválida antes de SQL. Esta corrida ejecutó los ocho casos con éxito. Las copias anteriores permanecen intactas.

Durante la preparación del instrumental hubo avisos de interpolación PHP al generar el supervisor; se regeneró correctamente **antes** de ejecutarlo y se comprobó su sintaxis. La primera agregación posterior de resultados encontró stdout JSON UTF-16 de PowerShell; se corrigió solamente su lector para reconocer BOM/UTF-16. No se modificaron JUnit, resultados, tests ni archivos originales para resolverlo. `FinishReport29.php` genera el resumen desde los testcase individuales, sin duplicar los totales de suites anidadas y excluyendo los procesos de validación offline.

### Comprobaciones de seguridad previas

- En cada copia instrumentada se aprobaron 13 controles offline: edad válida, edad vencida, fecha futura, perfil efectivo válido, rechazo de base protegida dev, puerto y usuario incorrectos, rechazo de base protegida test, verificación TLS deshabilitada y cuatro SQL prohibidos (DELETE/DROP/TRUNCATE/CREATE). Son controles de política sin conexión SQL, no casos Pest adicionales. Se conservaron los controles anteriores.
- Se comprobó la sintaxis de los 15 PHP privados de la corrida final y la del supervisor PowerShell. La copia de Sprint2 coincide exactamente con el original salvo los dos literales de contrato de base y Origin ya autorizados. Fixtures, datasets y aserciones permanecen intactos.
- `prompt29c/native-parity.json` y `run/native.stdout.json`: comprobación nativa de procesos/listener equivalente a PowerShell sobre el servidor actual.
- `prompt29c/live-negative.json` y `run/negative.stdout.json`: dos denegaciones reales de acceso a zarate_dev y zarate_test con la cuenta exclusiva, sin escrituras ni ampliación de privilegios.
- Inspecciones antes/después de cada caso: MySQL 8.4.11, 127.0.0.1:3308, zarate_pest, principal exclusivo, directorio/UUID correctos, mismo PDO, TLS estricto y cipher TLS_AES_256_GCM_SHA384. Grants originales exactos: ocho privilegios de esquema, sin grants ajenos, roles ni privilegios globales peligrosos. DELETE y todo DDL permanecieron bloqueados por el ejecutor aunque existan privilegios históricos más amplios en la cuenta.

### Resultados individuales finales — backend real, sin API simulada

| Caso | Módulo y alcance | Resultado | Aserciones | Rollback |
| --- | --- | --- | ---: | --- |
| C29-01 | Catálogos: periodos | APROBADO | 10 | Explícito, sin residuos |
| C29-02 | Catálogos: secciones | APROBADO | 10 | Explícito, sin residuos |
| C29-03 | Catálogos: cierre de periodo | APROBADO | 7 | Explícito, sin residuos |
| C29-04 | Permisos: Secretaría | APROBADO | 13 | Explícito, sin residuos |
| C29-05 | Aislamiento: asignaturas | APROBADO | 6 | Explícito, sin residuos |
| C29-06 | Aislamiento: secciones | APROBADO | 6 | Explícito, sin residuos |
| C29-07 | Relaciones: sección histórica | APROBADO | 6 | Explícito, sin residuos |
| C29-08 | Relaciones: grado de otra institución | APROBADO | 2 | Explícito, sin residuos |
| Total | Ocho casos distintos autorizados | 8 APROBADOS | 60 | 8 verificados |

Evidencia por caso: `prompt29c/run/caseN.xml`, `case-results.json`, `runtime-identities.jsonl`, `effects-PID.json`, `clean-PID-after-rollback.json`, `post-caseN.stdout.json` y snapshots de esquema/conteos. Cada caso tiene un BEGIN y un ROLLBACK explícitos, DELETE=0, una comprobación limpia en el mismo PDO y otra mediante proceso/conexión independientes.

| Área | Casos ejecutados | Aprobados | Fallidos | Pendientes del lote |
| --- | ---: | ---: | ---: | ---: |
| Catálogos académicos | 3 | 3 | 0 | 0 |
| Roles y permisos | 1 | 1 | 0 | 0 |
| Aislamiento institucional | 2 | 2 | 0 | 0 |
| Relaciones académicas | 2 | 2 | 0 | 0 |

Corrida final: 8 aprobados, 0 fallidos, 0 errores, 0 omitidos/no ejecutados. Nuevos casos distintos aprobados: **8**. Acumulado: **16/314 distintos aprobados, 103 aserciones de ejecuciones aprobadas y 298 casos pendientes**. C29-01 cuenta una sola vez como caso distinto aunque tenga un intento previo con error. El historial del Prompt 29 conserva un error Pest anterior y una invocación de launcher fallida sin testcase; no se borran ni se convierten en éxitos históricos. No se reejecutó ningún caso previamente aprobado.

### Duraciones medidas

`run/stage-timings.jsonl` mide desde el arranque del supervisor: el gate del caso 1 se emitió a los 105,967 s, después de preflight, paridad, denegaciones e inspecciones. El caso terminó a los 199,282 s. Esa preparación no consumió la vigencia operativa. Cada caso posterior recibió su propio gate después de las inspecciones, con el mismo límite de 120 s.

| Caso | CLI completo (s) | BEGIN a ROLLBACK (s) | Máxima edad observada del gate (s) |
| --- | ---: | ---: | ---: |
| 1 | 93,203 | 68,767 | 92,552 |
| 2 | 57,356 | 55,415 | 57,908 |
| 3 | 57,006 | 55,062 | 57,921 |
| 4 | 58,847 | 56,914 | 59,708 |
| 5 | 51,344 | 49,438 | 52,058 |
| 6 | 49,268 | 47,389 | 50,157 |
| 7 | 61,208 | 59,357 | 62,133 |
| 8 | 53,789 | 51,823 | 54,121 |

En el primer caso, la selección/hash del launcher terminó a 0,058 s; Pest llegó al inicio de configuración a 11,132 s; configurar consumió 0,069 s; bootstrap/inspección limpia terminó a 22,994 s; BEGIN ocurrió a 23,194 s, rollback a 91,961 s y cierre a 93,203 s. Las 593 atestaciones sumaron 55,956 s (máxima 0,763 s), incluidas dentro de las etapas anteriores: no se suman otra vez al total. Los pares de reloj de pared/monotónico quedan en `metrics-PID.json`.

La ventana BEGIN–ROLLBACK incluye fixtures y cuerpo de prueba. No se instrumentó internamente cada factory ni cada aserción, para conservar los tests; no se presenta esa ventana como una medida exclusiva de fixtures. El historial original no dispone de estos tiempos. Ninguna autorización se amplió para producir los resultados.

### Estado final, preservación y alcance

`run/after.stdout.json` acredita nuevamente **52 tablas, las 14 migraciones originales, cero triggers, esquema idéntico al baseline y cero residuos**: migrations conserva sus 14 filas y las 51 tablas de aplicación cero. No se ejecutaron migraciones, seeders demo ni SQL destructivo. La igualdad es lógica; no implica identidad binaria de archivos InnoDB ni reversión de contadores autoincrementales.

`run/result.json`, 20:11 America/Lima: servidor propiedad del supervisor cerrado con salida 0, cero errores MySQL, PID ausente, cero procesos MySQL, cuatro configuraciones de desarrollo conservadas y log inicial intacto. El monitor terminó mediante la señal controlada prevista. Hubo un aviso de CA privada autofirmada; la verificación de cadena/certificado/IP permaneció estricta. El informe contó tres entradas TCP al cierre, sin listener; **no se afirma que ese campo fuese cero**. `post-shutdown-network.json`, 20:11:27, confirma después cero entradas 3308, cero listeners, cero procesos y ausencia del PID.

`preservation-audit.json`: 239 pins comprobados, cero cambios; 54 documentos previos conservados, cero cambios. Prompt original preservado y continuación íntegra. El escaneo de credencial privada de pruebas y APP_KEY en salidas/documentos no detectó exposición. `git diff --check` aprobado. Los cambios Git anteriores permanecen; no hay modificaciones funcionales, commits ni push.

Archivos de esta continuación: ambos documentos públicos de Prompt 29; generadores/lectores privados `Resume29.php`, `Resume29c.php`, `Metrics29.template.php`, `Record29Continuation.php`, `FinishReport29.php`, `AuditResume29.php`; nuevas copias aisladas `prompt29b` y `prompt29c` con wrappers, métricas, validaciones, manifest y resultados. `Build29.php`, `Prepare29.php`, herramientas originales de Prompt 29 y evidencias 26/27/28 se conservaron. Las copias B/C son versiones instrumentadas privadas; no sustituyen archivos funcionales de EcoAula. Las credenciales existentes siguen fuera de la documentación y Git.

**A. PROMPT 29 COMPLETADO — OCHO CASOS APROBADOS.** La clasificación acredita el lote final y sus controles; no una suite integral de 314 casos ni una causa raíz retrospectiva de rendimiento. No se detectaron defectos funcionales en estos ocho casos. Quedan 298 casos, DELETE real, seeders demo, efectos externos y otros módulos sin validar. La causa de la demora histórica permanece como limitación de observabilidad; si reaparece una expiración, debe detenerse el caso y comprobarse rollback antes de considerar otra ejecución.

Siguiente etapa recomendada: seleccionar y revisar un nuevo lote pequeño de los restantes casos de Sprint2 que no usen eliminación ni seeders demo, conservar autorizaciones explícitas por caso y los mismos controles. No se ejecutó ni habilitó ese nuevo lote ni la suite completa.
