# Prompt 35 — Validación funcional de Matrículas con Pest/MySQL real

Fecha: 06/11/2026, America/Lima. Rama: `test/integracion-misional`.

## Estado recuperado y conservación

Se continúa desde el cierre aprobado de Prompt 34: 314 casos inventariados, 106 distintos aprobados, 607 aserciones acreditadas y 208 pendientes. Se revisaron las evidencias 28–34, el plan de matrículas y el instrumental transaccional; se contrastaron 106 JUnit previos y sus hashes, sin repetirlos. Los errores históricos de entorno/instrumental y las ejecuciones anteriores permanecen en sus evidencias originales.

Git conserva el cambio previo de `evidencias-finalizacion-migraciones.md` y los documentos históricos sin seguimiento. No se modifican originales de backend/frontend, tests, factories, migraciones, credenciales o configuraciones de desarrollo. Los archivos privados permanecen bajo `.tools/misional-isolated/evidence/prompt35`, ignorado por Git. La autorización expresa de `zarate_pest` prevalece sobre el destino histórico de backend/AGENTS.md, sin editarlo. No hay reset/clean, commits ni push.

## Inventario de veinte casos pendientes

Todos pertenecen a `backend/tests/Feature/Sprint4Test.php`. Se cotejó cada ID con los 208 pendientes y los 106 acreditados. El caso `creates unique codes rejects duplicate and protected fields and filters results` ya está aprobado anteriormente: no integra estos veinte ni se reejecuta/recuerda como caso nuevo.

Grupo A: no se ejecuta directamente el hook original, que exige base/Origin de desarrollo históricos. Grupo B: 18 candidatos admitidos tras revisar cuerpo, fixtures, servicios, modelos, validaciones y autorizaciones; requieren solo espejo privado con dos sustituciones literales (expectativa DB y Origin), además del perfil/allowlist de este launcher. Las aserciones funcionales originales se conservan. Grupo C: dos casos excluidos expresamente; no se ejecutan ni se recortan para admitirlos.

`enrollment-inventory-20.json` conserva los veinte IDs originales, clase, método, dataset y clasificación. `cases.json` registra selección, grupo, área exclusiva, filtros, hash de original/espejo y cambios de contrato.

| Caso | Grupo operativo | Área | Nombre original | Dataset | Clasificación |
| --- | ---: | --- | --- | --- | --- |
| C35-01 | 1 | Solicitudes | rejects nonexistent or inconsistent academic references | `('student_id')` | B |
| C35-02 | 1 | Solicitudes | rejects nonexistent or inconsistent academic references | `('academic_year_id')` | B |
| C35-03 | 1 | Solicitudes | rejects nonexistent or inconsistent academic references | `('grade_level_id')` | B |
| C35-04 | 1 | Solicitudes | rejects nonexistent or inconsistent academic references | `('section_id')` | B |
| C35-05 | 2 | Estados y transiciones | rechecks student year and section before approval | `('student')` | B |
| C35-06 | 2 | Estados y transiciones | rechecks student year and section before approval | `('year')` | B |
| C35-07 | 2 | Estados y transiciones | rechecks student year and section before approval | `('section')` | B |
| C35-08 | 2 | Estados y transiciones | rejects a pending application with history and allows a fresh application | `` | B |
| C35-09 | 3 | Solicitudes | rejects sections from another year or grade and inactive drafts | `` | B |
| C35-10 | 3 | Cupos | consumes only approved capacity and releases it on cancellation | `` | B |
| C35-11 | 3 | Cupos | allows unlimited capacity and rejects zero capacity | `` | B |
| C35-12 | 3 | Validación económica | requires correct validated payment and separates secretary from treasury | `` | B |
| C35-13 | 4 | Validación económica | does not accept another students payment or forged paid status | `` | B |
| C35-14 | 4 | Validación económica | rejects foreign payment references and cancelled validation | `` | B |
| C35-15 | 4 | Validación económica | rejects short payments supports overdue validation and rolls it back on audit failure | `` | B |
| C35-16 | 4 | Historial y auditoría | rolls back enrollment history and payment validation when audit fails | `` | B |
| C35-17 | 5 | Permisos y aislamiento | isolates foreign enrollment student section payment and history | `` | B |
| C35-18 | 5 | Permisos y aislamiento | limits student guardian and teacher access and minimal treasury lookup | `` | B |
| NO EJECUTAR | — | Historial y auditoría | runs correction approval cancellation with immutable history and audit | — | C |
| NO EJECUTAR | — | Solicitudes | enforces duplicate prevention in the database including soft deleted active rows | — | C |

Los dos casos C se asignan a áreas distintas para contar bloqueos sin duplicar: índice/duplicidad tras soft delete en Solicitudes; ciclo completo con inmutabilidad/forceDelete en Historial y auditoría. Los casos económicos incluyen auditoría y permisos, pero se contabilizan una sola vez en su área principal.

## Revisión de código y endpoints

Fuentes revisadas: `Sprint4Test.php`, hooks DatabaseTransactions, helper `enrollmentLogin` (línea 189, limpia Auth guards/sesión y usa actingAs), `EnrollmentFactory.php`, `StudentPaymentFactory.php`, `PaymentConceptFactory.php`, factories de personas y catálogos, y RolePermissionSeeder sintético ya admitido. No se ejecuta seeder demo. La matrícula del fixture se marca CANCELLED mediante UPDATE para liberar la combinación de prueba; no se elimina.

Backend: `backend/app/Services/Enrollment/{EnrollmentService,TransitionEnrollmentStatusAction,PaymentService,EnrollmentAudit}.php`, `backend/app/Http/Requests/Enrollment/{EnrollmentRequest,PaymentRequest,EnrollmentListRequest}.php`, controladores `EnrollmentController.php` y `PaymentController.php`, `EnrollmentPolicy.php`, modelos Enrollment/EnrollmentStatusHistory/StudentPayment, trait `BelongsToInstitution`, y migración `2026_10_02_000000_create_enrollment_tables.php` solamente leída.

Los caminos admitidos usan SELECT/INSERT/UPDATE, transacciones/savepoints y auditoría. No se identificaron conexiones secundarias, jobs externos, archivos requeridos, DDL ni DELETE. Mocks originales de EnrollmentAudit simulan fallos internos y comprueban rollback de negocio, dentro de la transacción raíz supervisada. Los pagos son registros sintéticos locales, no operaciones bancarias.

Endpoints originales: POST/PATCH/GET `/api/v1/enrollments`, GET de detalle, POST `/{id}/submit`, `approve`, `reject` y `cancel`; POST `/api/v1/payment-concepts`; POST/PATCH/GET `/api/v1/student-payments` y POST `/{id}/validate`; GET `/api/v1/enrollment-options?kind=students`. Las rutas y FormRequests aplican permisos `enrollments.*` y `payments.*`; Policies/scopes restringen institución y consultas propias/familiares. El backend, no la visibilidad React, es objeto de los casos.

## Guardas y procedimiento

Destino fijo `127.0.0.1:3308/zarate_pest`, cuenta exclusiva existente, APP_ENV testing, TLS estricto CA/IP, UUID/directorio físico, grants, mismo PDO/CONNECTION_ID sin reconexión. Se mantienen 120 segundos de vigencia y denegación de `zarate_dev`/`zarate_test`. Las autorizaciones se emiten tras inspecciones preparatorias y antes de cada caso, nunca se renuevan en transacción. El límite conservador de avance por edad observada sigue siendo 100 segundos, sin alterar el TTL real.

Se reutilizan los predicados del checker optimizado: nombre/PID/padre/ruta/argumentos/creación, listener e identidad/hashes de archivos bloqueados. Windows observado: 10.0.26200 x64; no había mysqld abandonados. NtQueryInformationProcess es una interfaz interna validada solo en este entorno; información incompleta, acceso fallido o divergencia de contrato deben bloquear. No se cambia Windows, WMI, antivirus ni firewall.

Se comprobaron exactamente los 18 filtros por descubrimiento bloqueante sin bootstrap/fixtures/SQL. Cada filtro coincide con clase, método y dataset originales. Se ejecuta un primer grupo de cuatro casos, luego cuatro, cuatro, cuatro y dos, secuencialmente. Cada avance requiere salida/JUnit aprobado, un BEGIN/ROLLBACK raíz explícitos, limpieza en mismo PDO e inspección externa de esquema/conteos (52 tablas, 14 migraciones y cero filas fuera de migrations). Se registra tiempo CLI, transacción y edad gate; no se suman etapas solapadas. Ante error se detiene, conserva JUnit, verifica rollback y no reintenta automáticamente.

## Análisis exclusivo de los dos casos C — NO EJECUTADOS

### Ciclo de corrección/aprobación/cancelación con historial inmutable

`runs correction approval cancellation with immutable history and audit`, Sprint4Test.php:59–77, llama explícitamente a `Enrollment::find($id)->forceDelete()` dentro del cuerpo del caso, no en hooks/factories, y espera LogicException. Previamente recorre DRAFT→PENDING→OBSERVED→PENDING→APPROVED→CANCELLED, comprueba auditoría e intenta modificar EnrollmentStatusHistory esperando rechazo.

Lectura de `Enrollment::booted`: el evento deleting comprueba isForceDeleting y lanza `Enrollment history must be preserved.` antes de SQL físico. Es el comportamiento esperado por código, no una aprobación ejecutada. Si ese evento desapareciera, la operación podría intentar DELETE sobre enrollments; la guarda SQL vigente debe seguir rechazándolo. La tabla enrollment_status_history referencia enrollments con RESTRICT, y la institución/estudiante/año/grado/sección/aprobador también usan RESTRICT. No se identificó cascade ni efecto externo en estos modelos; no se debe confiar solo en ello para autorizar.

No se requieren privilegios nuevos para el comportamiento esperado (rechazo antes de DELETE). La cuenta ya tiene grants históricos limitados a zarate_pest, pero el launcher sigue prohibiendo DELETE. Para una ejecución futura se necesita autorización explícita de la invocación forceDelete en este caso concreto, mantener bloqueo SQL DELETE, revisar eventos/observers actualizados, probar mismo PDO/transacción y comparar historial/auditoría/esquema al rollback. No sustituir forceDelete por otra aserción ni saltarse líneas. Quitar la llamada alteraría el propósito, por lo que no se hace.

### Duplicidad incluso tras borrado lógico de una matrícula activa

`enforces duplicate prevention in the database including soft deleted active rows`, Sprint4Test.php:208–216, crea matrícula y provoca violación esperada de unicidad mediante INSERT; luego invoca `$e->delete()` en el cuerpo y espera que un nuevo POST sea inválido. Enrollment usa SoftDeletes: por código ese delete actualiza deleted_at/updated_at en enrollments, no realiza SQL DELETE físico. El índice generado active_student_id depende del status, no de deleted_at; el servicio usa withTrashed para conservar la unicidad. La fila y sus relaciones históricas permanecen.

La migración leída no incorpora cascade de borrado; el historial apunta a enrollment con RESTRICT. Las escrituras esperadas son INSERT/UPDATE y requieren esos privilegios ya existentes, no grants adicionales. Aun así la instrucción actual excluye explícitamente ambos casos y cualquier invocación delete no autorizada: permanece C sin ejecutar. Una autorización futura deberá admitir expresamente este borrado lógico exclusivamente dentro de la transacción raíz en zarate_pest, revisar SoftDeletes/eventos y ausencia de conexiones secundarias/efectos afterCommit, mantener prohibición SQL DELETE/DDL y verificar limpieza sobre mismo PDO y externa. No convertirlo en caso simplificado ni usar otra tabla.

En ambos, la transacción raíz y savepoints permitirían revertir escrituras SQL del mismo PDO; no revierten por sí solos archivos, colas, conexiones ajenas o commits externos. Esas condiciones deben revalidarse antes de cualquier autorización futura. No se amplía ahora el launcher ni los privilegios ni la política SQL.

## Cobertura y limitaciones que deben reflejarse al cierre

La selección acredita solo lo que termine con JUnit y controles completos: referencias académicas, revalidación de disponibilidad antes de aprobar, rechazo y nueva solicitud, cupos finitos/cero/ilimitados, pagos validados/insuficientes/ajenos/cancelados, separación Secretaría/Tesorería, rollback de auditoría, consultas propias/familiares y aislamiento. Cada escenario se vincula a los casos de la tabla; un nombre de prueba no sustituye sus aserciones reales.

El ciclo completo de observación/corrección, la inmutabilidad específica del historial y rechazo forceDelete del caso C no se ejecutan aquí. Tampoco se acredita la duplicidad tras soft delete, concurrencia real de cupos, toda la matriz de transiciones, todos los campos obligatorios mediante payload vacío, pruebas de navegador o integraciones bancarias. DRAFT/submit/approve/cancel pueden tener cobertura en otros casos seleccionados, pero no ello autoriza atribuir el caso C como aprobado. Se distinguirá cobertura histórica de la nueva.

## Resultados

Se incorporarán únicamente resultados reales desde JUnit, métricas, inspecciones y cierre del supervisor. No se anticipan aprobaciones. Incidencia preparatoria: una búsqueda de archivos usó expansión de llaves no compatible con PowerShell; se corrigió la lectura, sin SQL ni Pest. No se modificaron aserciones ni código funcional.

Las peticiones Pest pasan por el kernel HTTP real de Laravel en el proceso de pruebas; no requieren servidor HTTP externo ni navegador. MySQL sí es una conexión real. Los HTTP 500 de C35-15/C35-16 son respuestas esperadas por los mocks originales de fallo de auditoría, no errores Pest; sus aserciones comprueban la reversión de negocio. El título original de C35-16 menciona pagos, pero su cuerpo comprueba creación/aprobación e historial de matrícula; la reversión de validación de pagos se comprueba específicamente en C35-15.

## Cierre real del Prompt 35

Backend Laravel/MySQL real, sin API simulada. Se cuentan testcase individuales JUnit, sin sumar suites anidadas, descubrimientos o controles auxiliares como casos Pest. Los 106 acreditados anteriores no se reejecutaron.

| Área de Matrículas | Ejecutados | Aprobados | Fallidos | Bloqueados por alcance | Aserciones acreditadas |
| --- | ---: | ---: | ---: | ---: | ---: |
| Solicitudes | 5 | 5 | 0 | 1 | 26 |
| Estados y transiciones | 4 | 4 | 0 | 0 | 25 |
| Cupos | 2 | 2 | 0 | 0 | 18 |
| Validación económica | 4 | 4 | 0 | 0 | 57 |
| Historial y auditoría | 1 | 1 | 0 | 1 | 8 |
| Permisos y aislamiento | 2 | 2 | 0 | 0 | 24 |

### Resultados individuales y tiempos

| Caso | Resultado JUnit | Aserciones | CLI (s) | BEGIN–ROLLBACK (s) | Máxima edad gate (s) | Rollback/limpieza/esquema |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| C35-01 | PASSED | 4 | 28,185 | 26,377 | 28,726 | VERIFICADOS |
| C35-02 | PASSED | 4 | 27,293 | 25,764 | 27,648 | VERIFICADOS |
| C35-03 | PASSED | 4 | 26,774 | 25,144 | 27,549 | VERIFICADOS |
| C35-04 | PASSED | 4 | 26,575 | 25,119 | 26,822 | VERIFICADOS |
| C35-05 | PASSED | 6 | 29,711 | 28,262 | 29,821 | VERIFICADOS |
| C35-06 | PASSED | 6 | 29,816 | 28,354 | 30,645 | VERIFICADOS |
| C35-07 | PASSED | 6 | 31,218 | 29,723 | 31,867 | VERIFICADOS |
| C35-08 | PASSED | 7 | 31,498 | 30,017 | 32,074 | VERIFICADOS |
| C35-09 | PASSED | 10 | 27,156 | 25,653 | 28,156 | VERIFICADOS |
| C35-10 | PASSED | 11 | 35,504 | 34,068 | 35,853 | VERIFICADOS |
| C35-11 | PASSED | 7 | 29,716 | 28,322 | 30,445 | VERIFICADOS |
| C35-12 | PASSED | 15 | 33,117 | 31,679 | 33,534 | VERIFICADOS |
| C35-13 | PASSED | 10 | 29,574 | 28,195 | 30,405 | VERIFICADOS |
| C35-14 | PASSED | 13 | 42,858 | 41,485 | 43,839 | VERIFICADOS |
| C35-15 | PASSED | 19 | 29,929 | 28,536 | 30,145 | VERIFICADOS |
| C35-16 | PASSED | 8 | 30,106 | 28,649 | 31,144 | VERIFICADOS |
| C35-17 | PASSED | 9 | 44,270 | 42,719 | 44,821 | VERIFICADOS |
| C35-18 | PASSED | 15 | 31,087 | 29,701 | 32,126 | VERIFICADOS |

### Consolidación y grupos

| Indicador | Resultado |
| --- | ---: |
| Nuevos seleccionados | 18 |
| Nuevos distintos ejecutados | 18 |
| Nuevos aprobados | 18 |
| Fallos de aserción | 0 |
| Errores Pest | 0 |
| Sin aprobación dentro de selección | 0 |
| Casos C no ejecutados | 2 |
| Aserciones nuevas acreditadas | 158 |
| Acumulado distintos aprobados | 124 |
| Acumulado aserciones acreditadas | 765 |
| Pendientes globales | 190 |
| Rollbacks raíz explícitos verificados | 18 |

- Grupo 1: 4 aprobados; rollback y esquema comprobados antes del avance.
- Grupo 2: 4 aprobados; rollback y esquema comprobados antes del avance.
- Grupo 3: 4 aprobados; rollback y esquema comprobados antes del avance.
- Grupo 4: 4 aprobados; rollback y esquema comprobados antes del avance.
- Grupo 5: 2 aprobados; rollback y esquema comprobados antes del avance.

Edad máxima observada del gate 44,821 s, margen mínimo 75,179 s. TTL 120 sin ampliación ni renovación en transacción. Se conserva gate fresco después de inspecciones y antes del caso; no se reutiliza uno vencido por pertenecer al mismo grupo. Tiempos CLI/transacción y atestación son mediciones solapadas y no se suman.

### Revalidación del checker, TLS y bases protegidas

Tres capturas independientes de propiedades y cuarenta llamadas intercaladas por checker acreditaron paridad. Media original 84,357 ms; nativo 16,240 ms; atestación completa 33,483 ms. No se eliminó ninguna comprobación para mejorar rendimiento ni se amplió vigencia. Las 13 comprobaciones offline de perfil, 13 del auxiliar de proceso (una positiva y doce negativas), siete rechazos adicionales de identidad/certificados y seis tokens inválidos rechazados por ambos checkers permanecen separados de los casos Pest. El reciclaje de PID se simula cambiando creación, no se fuerza. Los certificados negativos son comprobaciones locales, no conexiones a un endpoint hostil.

Identidad efectiva desde PHP, testing, base/cuenta/puerto/UUID/datadir exclusivos, mismo PDO/CONNECTION_ID sin reconexión, grants y TLS CA/IP obligatorios se verificaron durante la ejecución. Las denegaciones reales antes/después rechazaron zarate_dev y zarate_test (1044); no se consultaron datos ni se escribieron esas bases. Se conservaron las cuatro configuraciones de desarrollo vigiladas y el log de inicialización; no se afirma igualdad binaria de datos volátiles ni se inspeccionaron filas institucionales. No se ampliaron privilegios ni se cambiaron credenciales o servicios de demostración.

La interfaz nativa interna sigue validada solo para Windows x64 actual: información incompleta, acceso fallido o cambio de entorno requieren detener/revalidar. No se cachéan decisiones de autorización ni se cambian Windows, WMI, antivirus o firewall.

### Estado SQL y cierre

SCHEMA_AND_COUNTS_PRESERVED: 52 tablas, 14 migraciones y 0 filas fuera de migrations. Se conservaron esquema/columnas/índices/claves/reglas, ausencia de triggers y tablas InnoDB antes/después de cada caso y al final. 51 tablas de aplicación vacías; migrations conserva 14 filas. Igualdad lógica, no identidad binaria de InnoDB o contadores autoincrementales. No hubo DDL, DELETE, forceDelete, DROP/TRUNCATE, migraciones, seeders demo ni suite completa.

Shutdown complete=true, worker exit=0, errores MySQL=0, avisos=1, procesos=0, PID ausente=true. Monitor exit=3221225786 por señal controlada del árbol propio. El cierre contó 3 entradas TCP; comprobación posterior: 0 entradas, 0 listeners y 0 procesos. El aviso de CA privada autofirmada no desactiva verificación TLS. No se detuvieron servicios de demostración 3307/8000/5173.

No hubo fallos de aserción, errores Pest, expiraciones ni reintentos en el lote. No se confirmó defecto funcional en los casos ejecutados; no se aplicaron correcciones funcionales.

### Evidencias, cambios y continuación

Públicos creados: prompt-35-matriculas-pest.md (literal) y este documento. Privados nuevos: Build35.php, Reports35.php, Summary35.php, Audit35.php, Close35.php, perfil/wrappers/checker, espejo de Sprint4Test y resultados en .tools/misional-isolated/evidence/prompt35. Por caso: run/caseN.xml, metrics-PID.json, effects-PID.json, clean-PID-after-rollback.json, pre/post-caseN.stdout.json; por grupo: group-N.json. Consolidación: summary35.json, inventory-remaining.json, enrollment-inventory-20.json, blocked-cases.json, native-validation.json y auditoría de preservación.

Los originales funcionales, tests, factories y las 14 migraciones no se modificaron. Las evidencias previas se conservan. La auditoría aprobó 943 pins, 66 documentos anteriores y 106 JUnit previos sin cambios, literalidad exacta del prompt y cero exposiciones detectadas de credencial/APP_KEY, sin mostrar valores. Resultados: `preservation-audit35-final.json` y comprobación complementaria `preservation-audit35.json`. `git diff --check` terminó con código 0, sin errores; status se conservó en `git-status-final.txt`. El check no-index de cada documento nuevo terminó con código 1 por diferencia frente a NUL, sin errores de whitespace; el único aviso fue normalización CRLF del prompt literal. `format35.json` conserva esos resultados. Sin commits ni push.

Siguiente módulo recomendado: cursos/asignaciones y Aula Virtual (Sprint5/Sprint6 según inventario), comenzando por lectura/relaciones y RBAC que usen fixtures sintéticos reversibles; revisar individualmente materiales/archivos y entregas antes de admitirlos. Luego evaluaciones, asistencia y comunicaciones. No se ejecutaron esos módulos ni Cypress. Los dos casos C de Matrículas siguen pendientes de autorización específica, no aprobados ni defectos confirmados. Las limitaciones de cobertura están detalladas arriba: no se declara validado todo el módulo.

**A. MATRÍCULAS — LOTE FUNCIONAL APROBADO.** Acredita exclusivamente los 18 casos seguros seleccionados; los dos casos no autorizados permanecen C / NO EJECUTADOS.
