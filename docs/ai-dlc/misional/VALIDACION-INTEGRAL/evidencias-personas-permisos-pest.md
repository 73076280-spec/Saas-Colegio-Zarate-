# Prompt 34 — Personas, unicidad institucional y permisos

Fecha: 06/11/2026, America/Lima. Rama: `test/integracion-misional`.

## Continuidad, estado Git y alcance

Se recuperó el cierre aprobado del Prompt 33: 314 casos inventariados, 66 distintos aprobados, 377 aserciones acreditadas y 248 pendientes. Se contrastaron los 66 JUnit anteriores y sus hashes, sin reejecutarlos. Se revisaron evidencias 28–33 y las limitaciones históricas de expiración/instrumental; no se borran ni se transforman intentos fallidos anteriores en aprobaciones adicionales.

Los cambios previos de Git se conservan, incluido `evidencias-finalizacion-migraciones.md` y los documentos históricos sin seguimiento. El instrumental y resultados privados quedan en `.tools/misional-isolated/evidence/prompt34`, ignorado por Git. No se modifican originales de backend/frontend, factories, tests, migraciones o archivos de desarrollo. Sin commit, push ni cambios globales. La autorización expresa del usuario de `zarate_pest` prevalece sobre el destino histórico de `backend/AGENTS.md`; no se modifica ese archivo.

## Inventario, clasificación y selección

Se seleccionan 40 IDs nuevos de Sprint3Test presentes en el inventario restante. Grupo A: ninguna ejecución directa sin adaptar el contrato original, porque el hook exige `zarate_test` y Origin de desarrollo. Grupo B: los 40 seleccionados requieren exclusivamente dos sustituciones literales privadas (expectativa DB y Origin), conservando fixtures/aserciones originales, `DatabaseTransactions` y savepoints. Grupo C: quedan excluidos DELETE, demo y efectos no autorizados. `inventory-classification.json` registra los 248 IDs y distingue los revisados de los no revisados; no clasifica como seguros los otros módulos por su nombre.

Se excluyen expresamente de Sprint3Test: `rejects cross tenant family IDs and bindings` y `requires family management permission` porque incluyen peticiones DELETE aunque esperen rechazo; `detaches only the relation preserving both people and audit history` por desvinculación; `retains uniqueness after soft deletion` por borrado lógico conservador; `reproduces fictitious people without duplicating accounts or relationships` por PeopleDemoSeeder. No se suprimen líneas o aserciones para admitirlos. Otros casos compatibles de validación de fechas/estados, cuentas bloqueadas, búsqueda y rollback por fallo de auditoría permanecen pendientes por el límite de 40 y prioridad del lote.

Las áreas son exclusivas para no duplicar cómputos: los casos transversales de Secretaría y exposición mínima se cuentan en Roles y permisos; duplicados/códigos en Unicidad; perfiles y cuentas ajenas en Aislamiento. No se equipara esta selección a una matriz completa de permisos ni a todas las validaciones de personas.

| Caso | Grupo | Área | Nombre original | Dataset |
| --- | ---: | --- | --- | --- |
| C34-01 | 1 | Estudiantes | requires person fields and a secure initial password | `('students')` |
| C34-02 | 1 | Docentes | requires person fields and a secure initial password | `('teachers')` |
| C34-03 | 1 | Apoderados | requires person fields and a secure initial password | `('guardians')` |
| C34-04 | 1 | Estudiantes | reuses a compatible account without duplicating or modifying it | `('students')` |
| C34-05 | 1 | Docentes | reuses a compatible account without duplicating or modifying it | `('teachers')` |
| C34-06 | 2 | Apoderados | reuses a compatible account without duplicating or modifying it | `('guardians')` |
| C34-07 | 2 | Unicidad institucional | rejects duplicate document and code without leaving accounts | `('students')` |
| C34-08 | 2 | Unicidad institucional | rejects duplicate document and code without leaving accounts | `('teachers')` |
| C34-09 | 2 | Unicidad institucional | rejects duplicate document and code without leaving accounts | `('guardians')` |
| C34-10 | 2 | Aislamiento | rejects missing foreign and incompatible accounts | `('students')` |
| C34-11 | 2 | Aislamiento | rejects missing foreign and incompatible accounts | `('teachers')` |
| C34-12 | 2 | Aislamiento | rejects missing foreign and incompatible accounts | `('guardians')` |
| C34-13 | 2 | Roles y permisos | rejects malicious mass assignment | `('students')` |
| C34-14 | 2 | Roles y permisos | rejects malicious mass assignment | `('teachers')` |
| C34-15 | 2 | Roles y permisos | rejects malicious mass assignment | `('guardians')` |
| C34-16 | 3 | Estudiantes | reads updates and disables a person while retaining history | `('students')` |
| C34-17 | 3 | Docentes | reads updates and disables a person while retaining history | `('teachers')` |
| C34-18 | 3 | Apoderados | reads updates and disables a person while retaining history | `('guardians')` |
| C34-19 | 3 | Unicidad institucional | allows same documents and codes in different institutions | `('students')` |
| C34-20 | 3 | Unicidad institucional | allows same documents and codes in different institutions | `('teachers')` |
| C34-21 | 3 | Unicidad institucional | allows same documents and codes in different institutions | `('guardians')` |
| C34-22 | 3 | Roles y permisos | protects sensitive state transitions from secretary | `('students')` |
| C34-23 | 3 | Roles y permisos | protects sensitive state transitions from secretary | `('teachers')` |
| C34-24 | 3 | Roles y permisos | protects sensitive state transitions from secretary | `('guardians')` |
| C34-25 | 3 | Roles y permisos | permits secretary onboarding of students and guardians only | `('students')` |
| C34-26 | 4 | Roles y permisos | permits secretary onboarding of students and guardians only | `('guardians')` |
| C34-27 | 4 | Roles y permisos | prevents teacher creation by secretary | `` |
| C34-28 | 4 | Roles y permisos | denies administrative person access to student guardian and treasury | `('STUDENT')` |
| C34-29 | 4 | Roles y permisos | denies administrative person access to student guardian and treasury | `('GUARDIAN')` |
| C34-30 | 4 | Roles y permisos | denies administrative person access to student guardian and treasury | `('TREASURY')` |
| C34-31 | 4 | Roles y permisos | limits teacher student data to authorized basic information | `` |
| C34-32 | 4 | Roles y permisos | requires authentication for people | `` |
| C34-33 | 4 | Aislamiento | restricts profiles and family queries to the authenticated account | `('students')` |
| C34-34 | 4 | Aislamiento | restricts profiles and family queries to the authenticated account | `('teachers')` |
| C34-35 | 4 | Aislamiento | restricts profiles and family queries to the authenticated account | `('guardians')` |
| C34-36 | 5 | Relaciones familiares | guardian sees only linked students without private identity fields | `` |
| C34-37 | 5 | Relaciones familiares | rejects duplicate family relationships and invalid fields | `` |
| C34-38 | 5 | Relaciones familiares | switches the single primary transactionally and supports many to many families | `` |
| C34-39 | 5 | Relaciones familiares | enforces single primary and same institution with database constraints | `` |
| C34-40 | 5 | Relaciones familiares | denies association to inactive guardians without losing existing links | `` |

## Revisión de código y contrato de fixtures

Se revisó `backend/tests/Feature/Sprint3Test.php`, su beforeEach/afterEach, factories de Institution/User/Student/Teacher/Guardian y el fixture sintético RolePermissionSeeder ya admitido. Rutas y controles: `backend/app/Http/Controllers/Api/PeopleController.php`, `FamilyController.php`, `backend/app/Http/Requests/People/SavePersonRequest.php`, `FamilyRequest.php`, `backend/app/Services/People/PersonService.php`, `FamilyService.php`, `PeopleAudit.php`, `backend/app/Policies/PersonPolicy.php` y `FamilyPolicy.php`.

PersonService usa transacciones, aislamiento y unicidad con scope institucional; disable actualiza status sin borrar perfiles. FamilyService crea/actualiza relaciones y cambia el principal mediante UPDATE, con auditoría; la rama `$detach` que elimina la relación no es invocada por los cinco casos familiares seleccionados. La prueba de constraints provoca violaciones esperadas de índices/FK sobre INSERT, no cambia el esquema. Los registros son sintéticos y la auditoría se comprueba sin exportar información personal al documento. No se identificaron conexiones secundarias, archivos ni efectos externos en las rutas seleccionadas.

Se comprobaron los 40 filtros mediante descubrimiento bloqueante sin bootstrap/fixtures/SQL: cada filtro selecciona exactamente la clase, método y dataset originales. Los mensajes heredados de Prepare34/Security34 son etiquetas históricas; el conteo acreditado procede de `filter-verification.json` y `cases.json`, no del texto de consola que menciona 26.

## Guardas y ejecución progresiva

Destino único `127.0.0.1:3308/zarate_pest`, cuenta exclusiva existente, Laravel testing, TLS estricto CA/IP, mismo PDO/CONNECTION_ID, UUID/datadir y grants verificados. Se mantiene el límite de 120 segundos, fresh gate tras inspecciones preparatorias y antes de cada caso, nunca durante transacción. No hay reconexiones permisivas ni paralelismo ni reintentos automáticos.

El supervisor inicia cinco casos y continúa grupos de diez, diez, diez y cinco. Cada avance exige JUnit aprobado, BEGIN/ROLLBACK raíz explícitos, limpieza del mismo PDO, comparación externa de las 52 tablas/14 migraciones y conteos cero fuera de migrations. La progresión exige además edad máxima observada menor de 100 segundos, como margen conservador; la autorización efectiva sigue siendo 120 segundos.

Se conserva el checker nativo del Prompt 32, sin cambiar predicados de PID/padre/ruta/argumentos/creación, nombre, listener ni hashes/handles bloqueados de archivos. Windows actual: 10.0.26200 x64, cero mysqld abandonados antes del arranque. Se repiten únicamente la revalidación necesaria de este perfil/ejecución: paridad de propiedades y pruebas negativas offline y con servidor real. NtQueryInformationProcess es una interfaz interna: incompatibilidad, acceso fallido o información incompleta bloquean; no se presume compatibilidad universal ni se elimina la referencia WMI.

## Incidencias preparatorias

Antes del arranque hubo errores de invocación del compilador C# por rutas con barras `/`, y una referencia omitida a NativeProcess34 en el probe. Se corrigieron únicamente las invocaciones privadas usando rutas Windows y la fuente requerida. No hubo SQL ni Pest durante esos errores. Hubo asimismo un comando PHP inline mal citado y una búsqueda PowerShell con expansión de llaves no admitida; se sustituyeron por lecturas compatibles. No son fallos funcionales ni aserciones Pest. No se ocultaron errores históricos.

## Preparación de matrículas — análisis, NO EJECUTADO

Se revisó `backend/tests/Feature/Sprint4Test.php`: DatabaseTransactions, fixture Enrollment que prepara institución, estudiante, año, grado/sección y cambia su matrícula sintética a CANCELLED, con RolePermissionSeeder. No se ejecutó ningún caso Sprint4 ni se incorporó al launcher permitido.

| Dependencia / escenario | Evidencia y preparación siguiente |
| --- | --- |
| Estudiantes y apoderados | Factories originales, vínculos StudentGuardian; contrastar resultados de este lote y no volver a contar aprobados. |
| Año, grado, sección y referencias | `rejects nonexistent or inconsistent academic references` (4 datasets), `rechecks student year and section before approval` (3). Candidatos B: copia privada exacta DB/Origin y descubrimiento individual. |
| Solicitud/código, estados, historial/auditoría | `creates unique codes rejects duplicate and protected fields and filters results` ya está acreditado anteriormente y no figura entre los pendientes: no volver a contarlo. `rejects a pending application with history and allows a fresh application` sí es candidato B después de verificar todos los caminos del servicio. |
| Cupos | `consumes only approved capacity and releases it on cancellation`, `allows unlimited capacity and rejects zero capacity`. Cancelación es transición de estado, no DELETE; revisar tiempos y rollback antes de admitir. |
| Validación económica / Secretaría | `requires correct validated payment and separates secretary from treasury`, `does not accept another students payment or forged paid status`, `rejects foreign payment references and cancelled validation`. Revisar StudentPayment/PaymentConcept y servicios/rutas/grants SQL requeridos sin ampliar privilegios. |
| Aislamiento / consultas familiares | `isolates foreign enrollment student section payment and history`, `limits student guardian and teacher access and minimal treasury lookup`; `enrollmentLogin` está declarado en `Sprint4Test.php:189`: limpia Auth guards y sesión, luego actingAs, sin SQL destructivo. Mantenerlo en el espejo completo del archivo. |
| Rollback por fallo de auditoría | `rolls back enrollment history and payment validation when audit fails`, y caso de pago insuficiente/auditoría: revisar mocks/eventos y restauración, no adaptar aserciones. |
| Borrado y protección de histórico | `enforces duplicate prevention in the database including soft deleted active rows` invoca delete; conservar C. `runs correction approval cancellation with immutable history and audit` invoca forceDelete aunque espera excepción: revisión/autorización adicional, no habilitar automáticamente. |

Plan siguiente: recuperar inventario exacto, conservar helper enrollmentLogin ya localizado en Sprint4Test.php:189, revisar EnrollmentService/EnrollmentAudit, requests/policies, factories académicas y pagos; preparar espejo privado con cambios de contrato mínimos y descubrimiento sin SQL. Empezar cinco casos de referencias/solicitud, luego cupos/estados y pagos, únicamente tras nueva selección autorizada y rollback limpio. El launcher actual permite solo los 40 IDs de personas; los candidatos de matrículas necesitan nuevo perfil/lista/mirror, aunque los guards transaccionales puedan reutilizarse. No se autoriza ejecutar el siguiente lote ni ampliar DELETE/DDL/fixtures externos.

El inventario restante contiene exactamente 20 casos de Sprint4Test distribuidos en 15 métodos. Dos quedan sujetos a la exclusión conservadora por delete/forceDelete; los otros 18 son candidatos de revisión, no aprobaciones ni admisión automática. Lectura adicional de `PaymentService.php` y `TransitionEnrollmentStatusAction.php` confirma transacciones y transiciones mediante UPDATE/INSERT; no se observaron llamadas DELETE/DDL/Storage/dispatch en esos servicios. Las factories están en `backend/database/factories/EnrollmentFactory.php`, `StudentPaymentFactory.php` y `PaymentConceptFactory.php`. La compatibilidad completa de esos 18 requiere revisar sus requests/policies/factories y medir tiempos en el siguiente prompt; no se certifica ahora.

## Resultados de ejecución

Los resultados se incorporarán exclusivamente desde JUnit, métricas e inspecciones reales al cerrar el supervisor. Ningún caso se declara aprobado anticipadamente.


## Cierre del lote Prompt 34

Resultados del backend Laravel/MySQL real, sin API simulada. Se cuentan testcase individuales de JUnit, no los totales anidados de suites. Los 66 acreditados previamente no se ejecutaron de nuevo.

| Área | Nuevos ejecutados | Aprobados | Fallidos de aserción | Errores Pest | Sin ejecutar | Aserciones acreditadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Estudiantes | 3 | 3 | 0 | 0 | 0 | 27 |
| Docentes | 3 | 3 | 0 | 0 | 0 | 27 |
| Apoderados | 3 | 3 | 0 | 0 | 0 | 27 |
| Relaciones familiares | 5 | 5 | 0 | 0 | 0 | 25 |
| Unicidad institucional | 6 | 6 | 0 | 0 | 0 | 30 |
| Roles y permisos | 14 | 14 | 0 | 0 | 0 | 71 |
| Aislamiento | 6 | 6 | 0 | 0 | 0 | 23 |

| Caso | Resultado | Aserciones registradas | CLI (s) | BEGIN–ROLLBACK (s) | Máxima edad gate (s) | Rollback/limpieza |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| C34-01 | PASSED | 10 | 26,078 | 24,270 | 26,412 | VERIFICADOS |
| C34-02 | PASSED | 10 | 25,759 | 24,240 | 26,402 | VERIFICADOS |
| C34-03 | PASSED | 10 | 26,164 | 24,498 | 26,475 | VERIFICADOS |
| C34-04 | PASSED | 7 | 27,842 | 26,331 | 28,220 | VERIFICADOS |
| C34-05 | PASSED | 7 | 27,329 | 25,801 | 27,392 | VERIFICADOS |
| C34-06 | PASSED | 7 | 27,220 | 25,750 | 27,368 | VERIFICADOS |
| C34-07 | PASSED | 9 | 28,072 | 26,480 | 28,310 | VERIFICADOS |
| C34-08 | PASSED | 9 | 26,571 | 25,106 | 26,814 | VERIFICADOS |
| C34-09 | PASSED | 6 | 26,855 | 25,317 | 27,190 | VERIFICADOS |
| C34-10 | PASSED | 4 | 41,482 | 39,950 | 42,012 | VERIFICADOS |
| C34-11 | PASSED | 4 | 40,888 | 39,453 | 41,642 | VERIFICADOS |
| C34-12 | PASSED | 4 | 40,780 | 39,158 | 40,866 | VERIFICADOS |
| C34-13 | PASSED | 7 | 25,126 | 23,667 | 25,959 | VERIFICADOS |
| C34-14 | PASSED | 7 | 24,390 | 22,925 | 24,824 | VERIFICADOS |
| C34-15 | PASSED | 7 | 27,010 | 25,407 | 27,713 | VERIFICADOS |
| C34-16 | PASSED | 10 | 27,531 | 26,067 | 28,066 | VERIFICADOS |
| C34-17 | PASSED | 10 | 27,128 | 25,686 | 27,825 | VERIFICADOS |
| C34-18 | PASSED | 10 | 28,325 | 26,798 | 29,271 | VERIFICADOS |
| C34-19 | PASSED | 2 | 41,212 | 39,762 | 42,190 | VERIFICADOS |
| C34-20 | PASSED | 2 | 40,738 | 39,260 | 40,789 | VERIFICADOS |
| C34-21 | PASSED | 2 | 41,101 | 39,666 | 41,327 | VERIFICADOS |
| C34-22 | PASSED | 4 | 26,418 | 24,928 | 27,017 | VERIFICADOS |
| C34-23 | PASSED | 3 | 26,252 | 24,726 | 26,483 | VERIFICADOS |
| C34-24 | PASSED | 4 | 26,596 | 25,132 | 27,185 | VERIFICADOS |
| C34-25 | PASSED | 2 | 26,265 | 24,797 | 26,428 | VERIFICADOS |
| C34-26 | PASSED | 2 | 26,295 | 24,800 | 26,528 | VERIFICADOS |
| C34-27 | PASSED | 2 | 26,092 | 24,632 | 26,552 | VERIFICADOS |
| C34-28 | PASSED | 7 | 25,025 | 23,249 | 25,570 | VERIFICADOS |
| C34-29 | PASSED | 7 | 25,552 | 24,023 | 26,559 | VERIFICADOS |
| C34-30 | PASSED | 7 | 25,985 | 24,488 | 26,554 | VERIFICADOS |
| C34-31 | PASSED | 6 | 28,081 | 26,577 | 28,820 | VERIFICADOS |
| C34-32 | PASSED | 6 | 25,425 | 23,565 | 26,358 | VERIFICADOS |
| C34-33 | PASSED | 4 | 27,679 | 26,073 | 28,687 | VERIFICADOS |
| C34-34 | PASSED | 3 | 28,436 | 26,920 | 28,697 | VERIFICADOS |
| C34-35 | PASSED | 4 | 26,901 | 25,270 | 27,634 | VERIFICADOS |
| C34-36 | PASSED | 6 | 28,606 | 27,098 | 28,734 | VERIFICADOS |
| C34-37 | PASSED | 5 | 28,646 | 27,176 | 29,004 | VERIFICADOS |
| C34-38 | PASSED | 8 | 32,075 | 30,520 | 33,005 | VERIFICADOS |
| C34-39 | PASSED | 3 | 42,880 | 41,411 | 43,485 | VERIFICADOS |
| C34-40 | PASSED | 3 | 26,735 | 25,235 | 27,395 | VERIFICADOS |

| Indicador | Resultado |
| --- | ---: |
| Seleccionados | 40 |
| Nuevos distintos ejecutados | 40 |
| Nuevos aprobados | 40 |
| Fallos de aserción | 0 |
| Errores Pest | 0 |
| Sin aprobación dentro del lote | 0 |
| Nuevas aserciones acreditadas | 230 |
| Acumulado distintos aprobados | 106 |
| Acumulado aserciones acreditadas | 607 |
| Pendientes del inventario | 208 |
| Rollbacks explícitos comprobados | 40 |

No se suman controles offline, benchmarks o denegaciones de conexión como casos Pest. Las aserciones de cualquier ejecución con error no se añaden al acumulado acreditado. summary34.json e inventory-remaining.json conservan el conteo por ID y los pendientes, sin repetir aprobados.

### Grupos y margen temporal

- Grupo 1: 5 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 2: 10 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 3: 10 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 4: 10 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 5: 5 aprobados, rollback y esquema comprobados antes de continuar.

La edad máxima observada de gate fue 43,485 s; margen mínimo observado 76,515 s. case-margin-checks.jsonl registra cada aceptación y el margen. Se conserva TTL 120, sin renovaciones en transacción ni reintentos automáticos. Los tiempos CLI incluyen bootstrap/fixtures/test/cierre; BEGIN–ROLLBACK no es un tiempo exclusivo de factories. Los agregados de atestación se superponen con esas etapas, no se suman otra vez.

### Revalidación del checker y seguridad

El contrato nativo fue revalidado en Windows x64 actual. Tres ejecutables independientes sobre monitor/worker reales coincidieron en PID/padre/ruta/command line/creación y filtro por nombre. La referencia WMI se conserva y se compararon cuarenta llamadas intercaladas por checker: original 83,045 ms, candidato 15,676 ms; atestación completa 31,127 ms. La estimación previa conservadora de 700 atestaciones más 15 segundos fue 36,789 s; no sustituyó las mediciones reales por caso ni la vigencia. native-validation.json conserva las tres muestras independientes y la dispersión, no solo el resultado más favorable.

Aprobaron las 13 comprobaciones offline de perfil, 13 del harness de proceso (una positiva y doce negativas), siete rechazos adicionales de identidad SQL/certificados y seis tokens inválidos rechazados por ambos checkers. Se distinguen simulación de creación diferente con mismo PID, ausencia de información y terminación real de auxiliar; no se fuerza reutilización de PID ni se presume acceso a todos los procesos protegidos. Los tokens negativos se restauran exactamente sin extender edad, sin transacciones activas ni SQL durante la mutación.

Paridad nativa/PowerShell, identidad efectiva, UUID/directorio, cuenta/base/puerto exclusivos, mismo PDO/CONNECTION_ID sin reconexión, grants y TLS estrictos se conservaron. Las negativas iniciales/finales del servidor rechazaron zarate_dev/zarate_test con error 1044, cero escrituras. La validación de certificados negativos es local, no una conexión a un endpoint TLS hostil. No se cambió Windows, antivirus, firewall, servicios WMI o configuración global. No se habilitaron privilegios adicionales.

La interfaz NtQueryInformationProcess sigue siendo interna y específica del entorno x64 probado: acceso fallido, formato inesperado o propiedades incompletas deben bloquear la ejecución. Una actualización de SO/instrumental exige revalidar. No se reemplazan decisiones vigentes por snapshots cacheados. GetProcessTimes mantiene la precisión de microsegundos que ofrecía CIM.

### Estado final SQL, incidencias y cierre

Inspección final: SCHEMA_AND_COUNTS_PRESERVED, 52 tablas, 14 migraciones, 0 filas fuera del repositorio de migraciones; 51 tablas de aplicación vacías y migrations con 14 filas. Tablas InnoDB, columnas, índices, claves, reglas, triggers y migraciones coinciden con el baseline antes/después de cada caso y al final. Igualdad lógica, no identidad binaria de InnoDB ni de contadores autoincrementales. No hubo DDL, migraciones, DELETE, DROP, TRUNCATE, seeders demo, Cypress o suite completa.

Servidor cerrado=true, worker exit=0, errores MySQL=0, procesos=0, PID ausente=true. Avisos=1: CA privada autofirmada, manteniendo verificación de cadena/IP. El cierre contó 3 entradas TCP; comprobación posterior: 0 entradas, 0 listeners y 0 procesos. Se señaló exclusivamente el árbol propio mediante el procedimiento validado, sin detener demostración 3307/8000/5173.

No hubo fallos, errores, expiraciones ni reintentos en el lote. No se confirmó defecto funcional en los casos ejecutados y no se aplicó corrección funcional. El margen temporal se validó por caso, sin disminuir las guardas para incorporar personas.

### Evidencia, cambios y próximos módulos

Privados: .tools/misional-isolated/evidence/prompt34. Por caso: run/caseN.xml, metrics-PID.json, effects-PID.json, clean-PID-after-rollback.json, pre/post-caseN.stdout.json y snapshots de esquema/conteos. Por grupo: group-N.json. Consolidación: summary34.json, inventory-remaining.json, native-validation.json y preservation-audit34-final.json.

Nuevos públicos: prompt-34-personas-permisos-pest.md (literal) y este documento. Nuevos privados: Build34.php, Reports34.php, PrepareClose34.php, Summary34.php, Audit34.php, Close34.php, wrappers/perfiles, mirrors y evidencias de prompt34. Los originales de backend/frontend, pruebas, factories y migraciones no se modificaron. Las modificaciones previas de Git permanecen. La auditoría revisa pins, todos los documentos anteriores y los 66 JUnit acreditados, además de exposición de la credencial privada de pruebas y APP_KEY. git diff --check se registra al cierre. Sin commits ni push.

Los pendientes conservan su inventario exacto en inventory-remaining.json. Recomendación siguiente: comenzar una selección independiente y autorizada de matrículas con el plan documentado arriba; quedan asimismo validaciones de fechas/estados, cuentas y auditoría de personas pendientes. FamilyService tiene un camino de eliminación que no debe admitirse silenciosamente; relaciones sin desvinculación pueden evaluarse después de revisar sus tests concretos. Mantener bloqueados DELETE, seeders demo, archivos privados no preparados y conexiones/efectos externos. No se ejecutó ningún lote siguiente.

**A. VALIDACIÓN DE PERSONAS Y PERMISOS APROBADA.** La cobertura se limita a los casos acreditados, no a todos los módulos ni a los pendientes.

### Comprobaciones documentales y límites de integridad

`git diff --check` terminó con código 0, sin errores. La comprobación adicional de documentos nuevos usa `git diff --no-index --check`: código 1 indica archivo nuevo frente a NUL, no un fallo Pest; cualquier aviso de normalización CRLF del prompt literal se conserva. El prompt coincide byte por byte con el adjunto. Los scripts privados y JUnit permanecen ignorados por Git.

Las bases protegidas rechazaron la cuenta exclusiva de pruebas antes y después del lote. No se hicieron consultas de datos ni escrituras en ellas. Se conservaron las cuatro configuraciones de desarrollo supervisadas y el log de inicialización; no se afirma igualdad binaria de archivos de datos volátiles ni se inspeccionaron filas institucionales para probarla. El worker MySQL salió con código 0; el monitor recibió la señal controlada del procedimiento de cierre (3221225786), no un error de Pest. La comprobación posterior confirmó cero procesos, listeners y entradas TCP de 3308.

La auditoría final `preservation-audit34-final.json` contrasta todos los pins fijados, documentos anteriores, 66 JUnit previos, literalidad del prompt y exposición de la credencial privada de pruebas/APP_KEY. Los errores preparatorios descritos arriba se distinguen de los cero fallos/errores en los 40 casos Pest. Los 208 pendientes no se declaran aprobados ni bloqueados por un defecto no demostrado. No se ejecutaron pruebas de matrículas, Cypress, migraciones ni la suite completa.
