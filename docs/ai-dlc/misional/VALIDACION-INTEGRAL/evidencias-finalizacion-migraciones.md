# Prompt 21 — Verificación de recuperación y finalización de migraciones

Fecha: 04/11/2026, America/Lima. Rama comprobada: `test/integracion-misional`. HEAD: `280b96c` (`docs(qa): diagnosticar migracion parcial y planificar recuperacion`). Git inicialmente limpio.

**Clasificación: BLOQUEADO POR SEGURIDAD.** No se acreditó la recuperación del Prompt 20; persiste en el código el defecto de vigencia descrito por el Prompt 19. Además, el directorio de desarrollo protegido difiere del snapshot histórico. No se inició MySQL ni se abrió una conexión SQL. No se ejecutaron migraciones ni se reparó la quinta en esta intervención. La validación integral no está completada.

## 1. Estado inicial y resultado del Prompt 20

Se revisaron los informes de los Prompts 16, 17, 18 y 19, el inspector y comparador 19, el supervisor compartido y las guardas locales, el inventario de migraciones y el archivo original de Spatie Permission.

No existe un directorio `evidence/prompt20`, ni documentación de resultados del Prompt 20 en VALIDACION-INTEGRAL. El último commit y las evidencias disponibles llegan al Prompt 19. La existencia del prompt solicitado anteriormente no acredita su ejecución. No se encontró evidencia que permita declarar recuperada ni registrada la quinta migración.

El último snapshot SQL disponible, del **03/11/2026 y del Prompt 19**, contiene cuatro migraciones registradas en batch 1 y 14 tablas. Estos son resultados históricos, **no una consulta SQL nueva del Prompt 21**:

| Migración registrada | Batch |
| --- | --- |
| 0001_01_01_000000_create_users_table | 1 |
| 0001_01_01_000001_create_cache_table | 1 |
| 0001_01_01_000002_create_jobs_table | 1 |
| 2026_10_01_131619_create_personal_access_tokens_table | 1 |

La quinta, `2026_10_01_131621_create_permission_tables`, no figura en ese snapshot. Las pendientes históricas son diez: la quinta parcial y las nueve siguientes. No se puede certificar un número SQL actual de registros sin una nueva inspección acreditada.

## 2. Esquema de permisos

| Tabla | Última evidencia SQL del Prompt 19 | Comprobación offline actual |
| --- | --- | --- |
| permissions | Columnas, PK y unique conformes a las propiedades comparadas | Archivo .ibd presente |
| roles | Columnas, PK, índice de equipo y unique conformes | Archivo .ibd presente |
| model_has_permissions | Columnas, PK, índices y FK presentes | Archivo .ibd presente |
| model_has_roles | Columnas y PK presentes; dos índices explícitos y FK pendientes | Archivo .ibd presente; sus índices/FK no pueden comprobarse por el nombre del archivo |
| role_has_permissions | Ausente | Archivo .ibd ausente |

Actualmente se enumeraron **14 archivos .ibd** en el directorio aislado zarate_test, coherentes con el inventario anterior. Esto no sustituye el catálogo MySQL ni demuestra por sí solo la ausencia de una tabla en cualquier configuración de tablespaces. No se declara equivalencia completa del esquema.

La fuente original mantiene la creación de role_has_permissions con dos columnas unsigned, PK compuesta y dos FK con borrado en cascada; model_has_roles requiere los dos índices explícitos y su FK a roles. Se conserva la PK existente: no se propone volver a crear la quinta ni marcarla completada sin reparar y verificar sus efectos.

## 3. Guardas y aislamiento

En `evidence/prompt15/CheckLive15.ps1`, la edad se comprueba en AGE_AT_START; posteriormente se inspeccionan CIM, árbol de procesos, imágenes/opciones, creación, listener, PID-file y hashes. No hay un segundo rechazo por caducidad inmediatamente antes de devolver LIVE_PROCESS_VERIFIED. La traza de edad final del Prompt 19 registra observabilidad, pero no corrige por sí sola la autorización de escritura. Las fases admitidas siguen siendo prompt15–prompt19.

`evidence/prompt14/MigrationGuard14.php` conserva la verificación previa de conexión y proceso, pero depende de ese helper. No se encontró una corrección del Prompt 20 que permita acreditar vigencia inmediatamente antes de cada operación. No se reutilizó un gate histórico, no se aumentó su TTL y no se desactivaron comprobaciones.

El destino configurado y acreditado históricamente es 127.0.0.1:3308, zarate_test, cuenta restringida zarate_test, datadir misional-isolated/mysql-data, nombre lógico Laravel mysql y TLS estricto. **TLS, grants, identidad SQL, PDO y nombre lógico en ejecución no se verificaron de nuevo**, pues no se abrió conexión. No deben presentarse como controles vigentes aprobados.

La consulta CIM inicial sin elevación falló con acceso denegado (comando de salida 1). Se repitió únicamente la inspección de procesos/listeners con elevación autorizada: salida **0**, sin procesos mysqld y sin listeners en 3307, 3308, 8000 y 5173. PID-file aislado ausente. No se inició ni detuvo ningún servicio, incluidos los de demostración; no se afirma que estuvieran activos.

## 4. Preservación de desarrollo y fuentes

La comparación de los 14 archivos de migración con sus hashes del inventario del Prompt 15 aprobó: **14 comprobados, cero diferencias**. Cuatro configuraciones protegidas del snapshot del Prompt 06 conservan su hash de contenido: **cuatro comprobadas, cero diferencias**. No se imprimieron sus contenidos ni secretos.

La comparación del directorio protegido `.tools/mysql-data` con `protected-datadir-before.json` encontró, entre los **303 archivos históricos**, **cuatro ausentes y 22 con hash distinto**. El directorio contiene actualmente **301 archivos**, incluyendo por tanto archivos adicionales respecto de aquel inventario. No se verificaron ACL ni metadatos completos en esta intervención. Este resultado impide afirmar que desarrollo permanece idéntico al snapshot del Prompt 06.

No se atribuyen estas diferencias al Prompt 20 ni a una causa específica: no hay evidencia temporal suficiente. En esta intervención no se accedió por SQL a zarate_dev, no se escribió en su directorio y no se modificó ninguna configuración. Se conservaron las diferencias sin restaurar, borrar o reconstruir archivos. La ausencia de escrituras propias no equivale a certificar la integridad histórica de desarrollo.

## 5. Ejecución y resultados exactos

| Verificación u operación | Resultado de esta intervención |
| --- | --- |
| Rama / estado inicial / historial | Rama requerida; Git limpio; HEAD 280b96c |
| Prompt 20 | Resultados no encontrados; recuperación no acreditada |
| Hashes de migraciones | 14/14 coincidentes |
| Hashes de configuraciones protegidas | 4/4 coincidentes |
| Archivos históricos de desarrollo | 277 coincidentes; 22 distintos; cuatro ausentes |
| Inventario físico aislado | 14 .ibd; role_has_permissions.ibd ausente |
| Procesos y listeners con elevación | Comando 0; sin coincidencias en los destinos consultados |
| Inspección SQL actual | NO EJECUTADA: autorización de continuación no acreditada |
| Registro SQL antes / después | No reconsultado; último resultado histórico: cuatro / no hay nuevo resultado SQL |
| Tablas SQL antes / después | No reconsultadas; último resultado histórico: 14 / no hay nuevo resultado SQL |
| Migraciones ejecutadas / escrituras SQL | **0 / 0** |
| Procesos PHP/MySQL de migración | NO INICIADOS; no hay códigos de salida nuevos de esos procesos |
| Seeders, Pest y Cypress | NO EJECUTADOS |

No hubo fallos SQL nuevos porque no se ejecutó SQL. El fallo inicial de CIM se conserva expresamente; su repetición de solo lectura aprobó. No se ejecutó ninguna prueba funcional ni se declara aprobada.

## 6. Decisión y siguientes pasos

La fase B no se habilitó. Se aplica la condición del prompt: no continuar a las migraciones 6–14 sin acreditar quinta completa y registro coherente. Adicionalmente, la guarda pendiente y las diferencias de desarrollo justifican la clasificación de seguridad.

Antes de continuar corresponde investigar las diferencias de desarrollo sin sobrescribirlas, completar la corrección acotada de vigencia, realizar una inspección SQL nueva supervisada y recuperar únicamente los objetos faltantes de la quinta. Solo después de equivalencia completa debe registrarse mediante el repositorio Laravel real, preservando los cuatro registros previos y calculando el lote. La reparación no se ejecutó aquí; no se insertó una marca manual ni se intentó migrar automáticamente.

**No está preparado para comenzar Pest contra este esquema.** Primero deben cerrarse los bloqueos y verificarse las 14 migraciones mediante el mecanismo controlado. No ejecutar pruebas que borren o reconstruyan el esquema como sustituto de esa recuperación.

## 7. Evidencias y archivos

Referencias locales históricas, no publicadas: `evidence/prompt19/schema-snapshot.json`, `comparison.json`, `result.json`; `evidence/prompt15/migration-inventory.json`; snapshots protegidos del Prompt 06; helper CheckLive15.ps1 y MigrationGuard14.php. Se consultaron sin modificarlos.

Únicos archivos creados por esta intervención:

- `prompt-21-finalizacion-migraciones.md`: copia íntegra del adjunto, coincidencia SHA-256 comprobada.
- `evidencias-finalizacion-migraciones.md`: este informe, con separación entre evidencia histórica, comprobaciones actuales y pendientes.

No se modificaron scripts locales, código funcional, migraciones, bases, credenciales ni evidencias anteriores. No hubo commit, push, merge ni PR. Git al cierre muestra únicamente estos dos documentos nuevos. `git diff --check` no informó errores; la comprobación adicional del informe nuevo mediante diff --no-index --check tampoco informó errores de whitespace (salida 1 propia de un archivo añadido). `.tools` no contiene archivos rastreados por Git.

---

# Prompt 24 — Registro complementario y cierre vigente

Fecha: **04/11/2026**, America/Lima. Este registro se agrega al final para conservar íntegro el informe histórico del Prompt 21. La clasificación anterior corresponde a aquella intervención; **el resultado vigente del Prompt 24 es B. MIGRACIONES PARCIALMENTE COMPLETADAS — ESTADO CONSERVADO**.

Se completaron y verificaron las migraciones **6, 7 y 8**. La **9 ejecutó sus 23 DDL, pero no se registró**, porque el comparador de expresiones generadas rechazó la representación textual del catálogo. Se detuvo el ciclo y **no se ejecutaron 10–14**. Una inspección SQL posterior exclusivamente de lectura confirmó **ocho migraciones registradas y 31 tablas**. No se declara 14/14 ni validación integral completada.

## 24.1. Estado inicial comprobado

Rama `test/integracion-misional`, Git inicialmente limpio, HEAD `1a04303` (`docs(qa): documentar recuperacion de quinta migracion`). Se revisaron el cierre completo del Prompt 23, las guardas corregidas, las 14 fuentes originales y el orden de las nueve pendientes. Los hashes de las migraciones y de las cuatro configuraciones protegidas coinciden con las referencias.

Antes de escribir, la lectura SQL de migration06/initial-schema.json coincidió exactamente con prompt23/registration/final-schema.json: **15 tablas y cinco registros**; primeros cuatro en batch 1 y quinta en batch 2. Cuenta, base, puerto, TLS, datadir, UUID, rol, grants y PDO fueron acreditados nuevamente. No se dedujo el estado solo de archivos .ibd.

Se comprobó mediante COUNT(*) que las tablas de aplicación estaban vacías; se repitió este requisito al iniciar cada migración intentada. No se leyeron filas personales. Los únicos registros de negocio interno consultados fueron los nombres/lotes de migrations.

## 24.2. Revisión de las pendientes y mecanismo

Se capturó offline la gramática y los blueprints de los up originales 6–14, usando MySQL 8.4.11 como fixture explícita y una resolución PDO que lanza si se intenta conectar. Esa preparación produjo nueve planes exactos de SQL, sin abrir SQL ni ejecutar DDL. La ejecución real utilizó las fuentes originales con el Migrator y DatabaseMigrationRepository instalados de Laravel, no SQL reconstruido como sustituto de los up.

La migración 6 crea institutions/audit_logs y transforma users. Se comprobó users vacío antes de autorizarla; la rama de traslado de cuentas quedó sin ejecutar y se bloqueó todo INSERT/UPDATE de negocio. Las únicas eliminaciones de objetos permitidas fueron el índice scaffold users_email_unique y la columna name sobre la tabla vacía, expresamente incluidas en esa fuente. No se autorizaron eliminaciones de tablas, resets ni comandos destructivos generales.

El orden de dependencias revisado es: instituciones → estructura académica → personas → matrículas → cursos/asignaciones → unidades/materiales → aprendizaje/evaluación → asistencia → oficina académica/comunicación. Se revisaron las FK compuestas de student_guardian y los índices de columnas generadas. Las tablas nuevas debían estar ausentes antes de cada up; un parcial o diferencia con el snapshot previo obliga a parar.

El supervisor conserva el árbol MySQL propio y ejecuta un proceso PHP nuevo por migración. Antes de cada proceso vuelve a acreditar árbol y hashes, emite un **gate nuevo de 120 segundos** y archiva su copia en migrationNN. No amplía TTL ni reemplaza el gate durante la vida de una misma conexión. Cada consulta autorizada verifica proceso, identidad SQL, conexión y vigencia final/inmediata. Una autorización vencida, modificada o ambigua se rechaza.

La capacidad permite únicamente la secuencia DDL exacta del plan actual, dos SET de sesión explícitos, lecturas delimitadas del repositorio, el exists(users) del sexto up y un INSERT Laravel del nombre/lote actual. Guarda intentos y sentencias exitosas por separado. El registro se autoriza después del evento MigrationEnded y de verificar esquema; se vuelve a consultar tras el INSERT. Cualquier fallo evita la emisión del siguiente gate y conserva el estado.

## 24.3. Resultado individual

| Migración | Fuente / grupo | Estado inicial | Resultado real | Verificación y evidencia local |
| --- | --- | --- | --- | --- |
| 6 | 2026_10_01_150000_create_saas_core | Pendiente | **APROBADA**, batch 3; 22 DDL | 17 tablas / seis registros; institutions y audit_logs creadas, users transformada vacía. migration06/final-schema.json y outcome.json |
| 7 | 2026_10_01_160000_create_academic_structure | Pendiente | **APROBADA**, batch 4; 24 DDL | 23 tablas / siete registros; seis tablas académicas y FK/índices verificados. migration07/final-schema.json |
| 8 | 2026_10_01_170000_create_people | Pendiente | **APROBADA**, batch 5; 26 DDL | 27 tablas / ocho registros; students, teachers, guardians y student_guardian, incluidas FK compuestas. migration08/final-schema.json |
| 9 | 2026_10_02_000000_create_enrollment_tables | Pendiente | **FALLO DE VERIFICACIÓN**, 23 DDL exitosos; sin registro | Cuatro tablas añadidas; rechazo en active_student_id antes del INSERT. migration09/outcome.json y diagnostic/schema-snapshot.json |
| 10 | 2026_10_02_120000_create_courses_and_teacher_assignments | Pendiente | **NO EJECUTADA** | Bloqueada por la parada en 9 |
| 11 | 2026_10_02_140000_create_classroom_tables | Pendiente | **NO EJECUTADA** | Bloqueada por la parada en 9 |
| 12 | 2026_10_04_100000_create_learning_tables | Pendiente | **NO EJECUTADA** | Bloqueada por la parada en 9 |
| 13 | 2026_10_05_100000_create_attendance_tables | Pendiente | **NO EJECUTADA** | Bloqueada por la parada en 9 |
| 14 | 2026_10_05_110000_create_academic_office_tables | Pendiente | **NO EJECUTADA** | Bloqueada por la parada en 9 |

Ledger real: **95 DDL exitosos** (16 CREATE y 79 ALTER), tres INSERT de metadatos, ocho SET de sesión y nueve lecturas del framework. Son conteos del ledger de consultas Laravel; no incluyen todas las lecturas directas adicionales de guardas, catálogos o agregados. Se conservaron las cinco filas originales y se agregaron únicamente los registros 6–8. No se ejecutaron seeders, Pest ni Cypress.

## 24.4. Fallo de comparación y diagnóstico sin escrituras

El verificador falló en Validate24.php, línea 30, al comparar enrollments.active_student_id: RuntimeException desde Adapter14.php, línea 10; **SQLSTATE y código nativo SQL null**. No se capturó un error SQL del servidor. El scope registró 23 DDL exitosos y metadataLogged=false. El manejador distingue que su último snapshot previo al fallo tenía 27 tablas/ocho registros y podía estar desactualizado; **no se usa ese snapshot como inventario final**.

Se detuvo el ciclo, se cerró el árbol propio y no se corrigió ni reintentó la migración. Después se autorizó únicamente una inspección de lectura, sin capacidad de escritura, que confirmó **31 tablas y ocho registros** y obtuvo el DDL/catálogo de enrollments.

INFORMATION_SCHEMA.GENERATION_EXPRESSION devuelve las comillas de los literales DRAFT, PENDING, OBSERVED y APPROVED escapadas con barra inversa. El comparador eliminaba paréntesis/backticks y el introductor de charset, pero no decodificaba ese escape de representación. La columna sí tiene EXTRA=STORED GENERATED. La condición fallida es una comparación textual del control local; no demuestra por sí misma que la definición Laravel se haya aplicado mal.

CompareFailure24.php reprodujo offline la diferencia, decodificó **solo en memoria** las comillas escapadas de ese metadato y volvió a aplicar el verificador. La comparación resultante aprobó las cuatro tablas del noveno plan: **46 columnas, ocho índices explícitos y 15 FK**, con las ocho filas previas intactas. El detalle está en diagnostic/representation-comparison.json. Ese resultado no convierte el intento original en aprobado: **la migración 9 continúa sin registrar**, el verificador ejecutado no se modificó y no hubo nueva escritura ni ejecución de las siguientes.

La siguiente intervención debe revisar y probar el tratamiento de esa representación en el comparador, volver a acreditar SQL y demostrar la equivalencia de todo el noveno up antes de decidir un registro controlado por el repositorio Laravel. **No reejecutar ciegamente el up 9**: sus tablas ya existen. No insertar una marca manual, repetir DDL, borrar objetos ni arrancar automáticamente 10–14.

## 24.5. Esquema final comprobado y límites

La inspección SQL final devolvió:

- **31 tablas BASE TABLE, InnoDB**; ningún nombre duplicado en el catálogo observado.
- **Ocho migraciones registradas**: 1–4 en batch 1, quinta en batch 2, sexta en batch 3, séptima en batch 4 y octava en batch 5.
- **39 restricciones FK**, con **41 componentes de columnas** por las relaciones compuestas; destinos dentro de zarate_test.
- **99 índices distintos por tabla/nombre**, con **144 componentes de columnas**. No confundir componentes con índices independientes.
- Las cuatro tablas del noveno up presentes: payment_concepts, student_payments, enrollments y enrollment_status_history. El catálogo comparado offline es compatible al decodificar la representación indicada; no se presenta como aprobación del control original ni como validación funcional con datos.

No se asume una cantidad final de tablas para las 14 migraciones: se informa el número SQL observado tras la detención. **Pendientes de registro: seis migraciones, 9–14**, con 9 aplicada en esquema pero aún no certificada/registrada por la capacidad de migración. Las cinco restantes no se ejecutaron.

**No está listo para iniciar Pest**: primero debe resolverse el registro de 9 y completarse/verificarse 10–14 en una fase autorizada. No utilizar pruebas que reconstruyan el esquema para ocultar este parcial.

## 24.6. Seguridad, comprobaciones y cierre de procesos

Identidad real en ambas ejecuciones: MySQL **8.4.11**, **127.0.0.1:3308**, **zarate_test / zarate_test@127.0.0.1**, datadir **.tools/misional-isolated/mysql-data**, UUID correspondiente al datadir, rol NONE y nueve privilegios exclusivos del esquema. Dos filas de SHOW GRANTS, sin delegación ni privilegios globales peligrosos. Laravel conservó nombre lógico **mysql**, PDO y CONNECTION_ID; sin reconexión ni conexión de lectura alterna. TLS estricto y cifrado **TLS_AES_256_GCM_SHA384**.

Las herramientas compartidas solo incorporaron el contexto prompt24 a los mismos controles del Prompt 23 y pasaron la identidad ya verificada al callback del ámbito SQL. No se eliminaron comprobaciones de usuario, base, puerto, datadir, proceso o TLS. Los hashes de **39 archivos inmutables** del contexto diagnóstico permanecen intactos, incluidas las migraciones y scripts críticos. Se comprobaron las cuatro configuraciones protegidas por hash/ACL al inicio/cierre. **580 resultados históricos** conservaron su contenido por SHA-256.

Los archivos InnoDB, PID, redo y binlogs de desarrollo continúan clasificados como volátiles. No se exige igualdad con un snapshot antiguo ni se restauran datos. La preservación se apoya en configuración/cuenta/datadir separados, prohibiciones SQL y ausencia de escrituras propias sobre desarrollo. No se pretende certificar forensemente su actividad histórica. No se detuvo ni modificó ningún servicio de demostración en 3307/8000/5173.

Pruebas y comprobaciones, sin Pest/Cypress:

| Comprobación | Resultado real |
| --- | --- |
| Identidad, edad, certificado y configuración, simulaciones locales | **18/18 aprobadas**, cero conexiones SQL en esas pruebas |
| Ámbito SQL, siete rechazos y nueve planes exactos | **16/16 aprobadas**, cero SQL real |
| Captura offline de nueve fuentes originales | Aprobada tras resolver dos incidencias de fixture, sin SQL |
| Ejecución real de migraciones | **Tres aprobadas (6–8), una fallida en verificación (9), cinco no ejecutadas (10–14)** |
| Acreditaciones vivas de proceso | **182 válidas, cero rechazadas**, edades finales 1–73 segundos, dentro de 120 |
| Inspección posterior solo lectura | Aprobada, **31 tablas/ocho registros**, cero escrituras |
| Comparación de representación offline posterior | Aprobada después de decodificación en memoria; sin modificar el control fallido ni datos |
| Sintaxis PHP / parser PowerShell | Aprobados antes de ejecutar las respectivas herramientas |
| Seeders / Pest / Cypress | **NO EJECUTADOS** |

Incidencias de preparación conservadas en este registro: la fixture offline inicial no había inicializado la gramática de esquema; después la gramática consultó si el motor era MariaDB y la closure PDO lanzó OFFLINE_PDO_FORBIDDEN, como estaba previsto. Se corrigió únicamente la fixture offline para declarar MySQL 8.4.11, manteniendo el PDO prohibido. No se desactivó ningún control de la conexión real. Ambos fallos ocurrieron antes de abrir SQL; el plan final se obtuvo correctamente. El fallo real del noveno verificador se conserva por separado.

Ejecución de migraciones: preflight **22:25:27 -05:00**, 1.037 objetos privados comprobados; monitor **15488**, worker **892**. Cierre **22:30:09 -05:00**: clientes 6–8 **0**, cliente 9 **24**, supervisor **1**, servidor MySQL **0**, monitor **3221225786 / 0xC000013A** por Ctrl+C. Shutdown completo, cero ERROR/FATAL, una advertencia; 1.118 objetos comprobados al cerrar.

Diagnóstico de lectura: preflight **22:31:37 -05:00**, 1.125 objetos; monitor **24900**, worker **20652**. Cierre **22:32:06 -05:00**: **cliente 0, supervisor 0, servidor MySQL 0**, monitor 3221225786 por Ctrl+C. Shutdown completo, cero ERROR/FATAL, una advertencia; 1.151 objetos al cerrar. Las pruebas auxiliares de consola, versión y validate-config terminaron 0 en ambos arranques. Ambos cierres acreditaron PID-file ausente, cero procesos MySQL y cero conexiones 3308. Solo se señaló el árbol propio.

## 24.7. Archivos y trazabilidad

Documentación de esta fase:

- **prompt-24-finalizacion-migraciones.md**, copia íntegra del adjunto, SHA-256 coincidente.
- **evidencias-finalizacion-migraciones.md**, este registro agregado al informe histórico, sin reescribir su contenido previo. Copia histórica conservada localmente en backup/evidencias-finalizacion-migraciones-prompt21.md.

Herramientas locales ignoradas por Git:

- MigrationGuard14.php y CheckLive15.ps1: contexto phase24, mismas condiciones de aislamiento/vigencia y trazas propias.
- evidence/prompt24: Plan24.php/plans.json, Checks24.php, Validate24.php, Scope24.php, Execute24.php y Run24.ps1; GuardTests24.php/ScopeTests24.php; InspectFailure24.php/.ps1 y CompareFailure24.php para diagnóstico sin escrituras; backups y manifests propios.

Resultados principales: migration06–09/initial-schema.json, operation-ledger.json y outcome.json; final-schema.json/schema-verification.json para 6–8; los marcadores exclusivos migration.once y copias individuales del gate; migration-results.json; diagnostic/schema-snapshot.json, enrollments-ddl.json y representation-comparison.json; preflight/result/server.stop.json de ambas ejecuciones, process-proof-trace.jsonl, immutable*.json y final-summary.json. Las carpetas 10–14 no contienen resultados de ejecución y no se presentan como pruebas pendientes intentadas.

No se modificaron fuentes funcionales, las 14 migraciones, configuraciones protegidas, credenciales, certificados o datos de desarrollo. No se publican herramientas locales, secretos o archivos privados. No hubo commits, push, merge ni PR. Git al cierre muestra únicamente este informe modificado y el prompt 24 nuevo; .tools no tiene archivos rastreados. Se verificó que el contenido histórico es un prefijo binario intacto y que los demás documentos conservan sus hashes. La auditoría examinó 180 archivos, incluidos tres documentos, con cero coincidencias de secretos fuera de sus recursos dedicados. git diff --check terminó sin errores.

**B. MIGRACIONES PARCIALMENTE COMPLETADAS — ESTADO CONSERVADO.** Estado real: **8/14 registradas, 31 tablas**, novena sin registro y 10–14 no ejecutadas. No se declara listo para Pest ni 14/14.