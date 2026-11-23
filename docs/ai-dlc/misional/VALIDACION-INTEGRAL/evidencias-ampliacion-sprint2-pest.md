# Prompt 30 — Ampliación controlada de Sprint2

Fecha de inicio: 05/11/2026, America/Lima. Rama: `test/integracion-misional`.

## Continuidad y alcance

Se continúa desde Prompt 29: 16 casos distintos aprobados, 103 aserciones de ejecuciones aprobadas y 298 casos pendientes del inventario original de 314. Se revisaron los JUnit finales de Prompt 27/run4 (4), Prompt 28/run4 (4) y Prompt 29c/run (8), sin reejecutarlos: exactamente 16 testcase aprobados y 103 aserciones. Referencias y hashes: `prompt30/previous-junit-verification.json`.

Se conservaron las evidencias 27/28/29, sus métricas y guardas negativas. La expiración histórica del Prompt 29 mantiene causa de demora no determinada; no se cambia el límite de 120 segundos. Los cambios Git anteriores son previos y se conservan, incluida la modificación de evidencias-finalizacion-migraciones.md y los documentos todavía no versionados. No se hacen commits ni push.

Se revisaron Sprint2Test completo, DatabaseTransactions, hooks, fixtures, AcademicService, AcademicPolicy, SaveAcademicRequest y el instrumental privado aprobado de Prompt 29c. La cuenta exclusiva y zarate_pest/3308 se mantienen bajo la autorización vigente; los destinos históricos en backend/AGENTS.md, phpunit.xml y tests originales no se modifican. No se usan datos de demostración ni institucionales.

## Selección: doce casos nuevos, tres grupos de cuatro

Todos proceden de `backend/tests/Feature/Sprint2Test.php`; cada dataset pertenece al descubrimiento original. `prompt30/cases.json` conserva método, dataset exacto, originalId, grupo, filtro y hashes. Se contrastaron sus IDs contra los 16 aprobados: cero coincidencias. Los doce filtros se verificaron individualmente por descubrimiento protegido, sin bootstrap de Laravel, fixtures ni conexión SQL: un caso por filtro.

| Caso | Grupo | Nombre original | Dataset | Alcance |
| --- | ---: | --- | --- | --- |
| C30-01 | 1 | creates reads edits and audits an academic catalog | ('academic-years') | CRUD/auditoría de años |
| C30-02 | 1 | creates reads edits and audits an academic catalog | ('education-levels') | CRUD/auditoría de niveles |
| C30-03 | 1 | creates reads edits and audits an academic catalog | ('grade-levels') | CRUD/auditoría de grados |
| C30-04 | 1 | creates reads edits and audits an academic catalog | ('subjects') | CRUD/auditoría de asignaturas |
| C30-05 | 2 | isolates academic records and policies | ('academic-years') | Rechazo de acceso ajeno, filtrado y Policy |
| C30-06 | 2 | isolates academic records and policies | ('academic-periods') | Aislamiento de periodos con padres válidos |
| C30-07 | 2 | isolates academic records and policies | ('education-levels') | Aislamiento de niveles |
| C30-08 | 2 | isolates academic records and policies | ('grade-levels') | Aislamiento de grados y sus relaciones |
| C30-09 | 3 | assigns read only academic permissions to secretary and teacher | ('TEACHER') | Lectura docente y prohibición de creación en seis catálogos |
| C30-10 | 3 | does not expose academic administration to other roles | ('STUDENT') | GET/POST administrativos prohibidos en seis catálogos |
| C30-11 | 3 | switches current academic year atomically | Sin dataset | UPDATE del anterior, nuevo actual único y auditoría |
| C30-12 | 3 | rejects missing and foreign parent relationships | ('sections', 'grade_level_id', 'grade') | Rechazo de padre inexistente y grado de otra institución |

Los cuerpos revisados utilizan INSERT/SELECT/UPDATE y transacciones anidadas/savepoints. El fixture original RolePermissionSeeder crea permisos sintéticos dentro de la transacción; no es un seeder demo. No se identificaron DELETE, DDL, archivos, jobs externos o conexiones secundarias en estos doce caminos. No se inventan entidades independientes de áreas/aulas: el catálogo real aquí es Subject/asignaturas. Los demás módulos no quedan certificados por este lote.

## Adaptaciones privadas y seguridad

Se creó `.tools/misional-isolated/evidence/prompt30` mediante Build30.php, copiando el instrumental aprobado sin modificar Prompt 29c. Se conservan TLS estricto, destino fijo, UUID/datadir, identidad de procesos/listener, mismo PDO/CONNECTION_ID, grants exactos, prohibición de reconexión y SQL destructivo, TTL 120 y rollback raíz protegido. No se emite/renueva autorización dentro de una transacción. Las inspecciones costosas preceden al gate operativo por caso.

La copia privada de Sprint2 solo adapta los dos literales históricos autorizados: expectativa de base zarate_test a zarate_pest y Origin localhost:5173 a 127.0.0.1:5174. Se conservaron hooks, factories, fixtures, lógica y aserciones. La lista exige clase/método/dataset exactos; no habilita todos los datasets de un método. El descubrimiento tiene su propio bootstrap bloqueante y sus propias salidas, sin sobrescribir registros del Prompt 26.

El supervisor incorpora grupos de cuatro: después de cada salida correcta e inspección externa exige un BEGIN/un ROLLBACK, DELETE=0 y comprobante limpio del mismo PDO. Solo entonces continúa. Cada cuarto caso genera un comprobante de grupo; una salida no cero detiene el lote, sin reintento automático. Se mantienen snapshots completos de esquema/conteos antes y después de cada caso. Se añaden denegaciones reales de bases protegidas al final, en archivos separados de las iniciales.

Validación previa offline: 13 controles aprobados, cero fallidos y cero conexiones SQL (vigencia válida/vencida/futura, perfil válido, base/puerto/usuario incorrectos, ambas bases protegidas, verificación TLS desactivada y cuatro comandos prohibidos rechazados). No cuentan como casos Pest. Sintaxis comprobada en los 18 PHP privados preparados y en el supervisor PowerShell; fixtures comparados byte por byte contra el contrato original.

## Inventario y límites de la clasificación

`prompt30/inventory-initial-298.json` registra individualmente los 298 IDs pendientes al inicio, archivo de origen, categoría primaria, motivo, confianza y selección en Prompt 30. La clasificación es conservadora: **compatible con el mecanismo no significa ya autorizado por la lista ni aprobado mediante ejecución**. Los casos fuera de Sprint2 no se declaran seguros por ausencia de palabras clave.

- Categoría 1: restantes cuerpos de Sprint2 revisados, compatibles con el mecanismo transaccional; requieren su lista/filtro propio antes de ejecución.
- Categoría 2: los dos contratos históricos de MySqlConnectionTest necesitan revisión específica de expectativas/destino, sin cambiar reglas funcionales.
- Categoría 3: soft delete de catálogo excluido por alcance de eliminación/limpieza especial, aunque Eloquent normalmente lo implemente como UPDATE. No se habilita silenciosamente.
- Categoría 4: AcademicDemoSeeder y PeopleDemoSeeder, prohibidos en esta intervención.
- Categoría 5: Avatar y Sprints 6–9 con hooks de almacenamiento/archivos; la transacción SQL no acredita reversión de esos efectos. No se presume que todos sus casos escriban archivos, pero requieren revisión por caso.
- Categoría 6: otros casos pendientes de revisión de fixture, servicios, SQL y efectos transitivos. No se presentan como defectos ni incompatibilidades confirmadas.

## Resultados de ejecución

Se incorporarán exclusivamente desde JUnit, métricas, comprobantes de rollback y snapshots finales. No se anticipa la aprobación del lote.


## Cierre de la ejecución del Prompt 30

Resultados con backend Laravel/MySQL real, sin API simulada ni Cypress. JUnit se contabiliza por testcase, sin sumar de nuevo las suites anidadas. No se repitieron los 16 casos aprobados anteriormente.

| Caso | Resultado | Aserciones | CLI (s) | BEGIN–ROLLBACK (s) | Edad máxima del gate (s) | Rollback y limpieza |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| C30-01 | PASSED | 10 | 74,090 | 59,283 | 74,335 | VERIFICADOS |
| C30-02 | PASSED | 10 | 53,665 | 51,333 | 54,350 | VERIFICADOS |
| C30-03 | PASSED | 10 | 52,908 | 51,012 | 53,215 | VERIFICADOS |
| C30-04 | PASSED | 10 | 56,697 | 54,436 | 57,332 | VERIFICADOS |
| C30-05 | PASSED | 6 | 90,705 | 87,436 | 91,274 | VERIFICADOS |
| C30-06 | PASSED | 6 | 61,044 | 58,799 | 61,214 | VERIFICADOS |
| C30-07 | PASSED | 6 | 59,051 | 56,792 | 59,671 | VERIFICADOS |
| C30-08 | PASSED | 6 | 55,626 | 53,639 | 56,044 | VERIFICADOS |
| C30-09 | PASSED | 13 | 63,243 | 61,267 | 64,080 | VERIFICADOS |
| C30-10 | PASSED | 13 | 55,955 | 53,955 | 56,929 | VERIFICADOS |
| C30-11 | PASSED | 7 | 55,114 | 53,165 | 55,665 | VERIFICADOS |
| C30-12 | PASSED | 7 | 60,834 | 58,838 | 61,172 | VERIFICADOS |

Evidencia individual en `.tools/misional-isolated/evidence/prompt30/run/`: `caseN.xml`, `runtime-identities.jsonl`, `effects-PID.json`, `clean-PID-before-fixtures.json`, `clean-PID-after-rollback.json`, `metrics-PID.json`, `pre-caseN.stdout.json`, `post-caseN.stdout.json` y snapshots completos. El supervisor comprobó un BEGIN, un ROLLBACK y DELETE=0 por caso antes de avanzar. `summary30.json` consolida los resultados y los indicadores.

| Indicador | Resultado real |
| --- | ---: |
| Casos nuevos seleccionados | 12 |
| Casos nuevos ejecutados | 12 |
| Casos nuevos aprobados | 12 |
| Fallos de aserción | 0 |
| Errores Pest | 0 |
| No aprobados/bloqueados dentro del lote | 0 |
| Nuevas aserciones aprobadas | 104 |
| Acumulado de casos distintos aprobados | 28 |
| Acumulado de aserciones acreditadas | 207 |
| Casos pendientes del inventario | 286 |

### Grupos y comprobaciones de seguridad

- Grupo 1: cuatro aprobados; rollback y estado persistente comprobados antes de avanzar.
- Grupo 2: cuatro aprobados; rollback y estado persistente comprobados antes de avanzar.
- Grupo 3: cuatro aprobados; rollback y estado persistente comprobados antes de avanzar.

Se renovó la evidencia viva de seguridad antes del lote: paridad nativa/PowerShell, identidad de procesos y listener, TLS estricto, host/puerto/base/cuenta exclusivos, directorio/UUID, grants exactos y ausencia de reconexiones. Las dos denegaciones reales iniciales y las dos finales (`live-negative.json`, `live-negative-final.json` y `negative*.stdout.json`) requieren error MySQL 1044 y cero escrituras a las bases protegidas. Son comprobaciones de seguridad, no cuatro casos Pest nuevos. No se aumentaron privilegios ni se modificaron credenciales.

El primer gate operativo se emitió a los 118,398 segundos del supervisor, después de las comprobaciones preparatorias. La máxima antigüedad observada en el lote fue 91,274 segundos (caso 5). El gate sigue limitado a 120 segundos, emitido por el supervisor después de cada inspección preparatoria y antes del launcher, sin renovación dentro de transacciones. `stage-timings.jsonl` registra el momento operativo de cada emisión y el fin de cada CLI. Los eventos de `metrics-PID.json` miden selección, configuración, bootstrap/inspección limpia, BEGIN, ROLLBACK y cierre con reloj de pared/monotónico; agregan tiempos de atestación y edad de autorización. BEGIN–ROLLBACK incluye fixtures y cuerpo del test: no es una medida aislada de factories. Las duraciones agregadas de atestación se superponen con esas etapas y no deben sumarse otra vez.

### Estado final SQL y cierre del servidor

La inspección final declara `SCHEMA_AND_COUNTS_PRESERVED`: 52 tablas, 14 migraciones y 0 filas fuera del repositorio de migraciones. Se contrastaron tablas InnoDB, columnas, índices, claves, reglas, triggers y registros de migrations con el baseline; 51 tablas de aplicación vacías y migrations con sus 14 registros originales. La igualdad es lógica, no binaria ni de contadores autoincrementales. No se ejecutaron migraciones, DDL, DELETE, DROP, TRUNCATE o seeders demo.

Servidor cerrado: true; salida del worker 0; procesos MySQL 0; PID ausente true; errores MySQL 0. El monitor se termina mediante la señal controlada del procedimiento aprobado. Único aviso MySQL: CA privada autofirmada; se mantuvo verificación estricta de cadena, fechas e IP. El informe de cierre contó una entrada TCP y ningún listener; la comprobación posterior de las 20:41:07 America/Lima (`post-shutdown-network.json`) confirmó cero entradas, cero listeners, cero procesos y PID ausente. No se detuvieron servicios de demostración. Las bases protegidas permanecieron fuera del alcance SQL autorizado; no se afirma igualdad binaria de archivos InnoDB compartidos.

### Incidencias y preservación

La expiración y el error de instrumentación del Prompt 29 permanecen en sus archivos originales. En Prompt 30 hubo cero fallos, errores o expiraciones; no se realizaron reintentos. Este cierre solo acredita las ejecuciones reflejadas en los JUnit actuales. `preservation-audit30.json` y su comprobación complementaria `preservation-audit30-final.json` comprueban hashes de herramientas fijadas, documentos anteriores y los 16 JUnit previos, además de revisar exposición de la credencial privada de pruebas y APP_KEY. El prompt se conserva íntegro; no contiene secretos. `git diff --check` y `git status` se registran al cerrar. No se modificó código funcional ni migraciones, cuentas o privilegios; no hubo commits ni push.

Archivos creados: los dos documentos públicos de Prompt 30; `.tools/misional-isolated/evidence/Build30.php`; copias y validadores privados en `prompt30`; lectores de resultados `Summary30.php`, `InventoryReview30.php`, `DocumentResults30.php` y `Audit30.php` y `FinalizeDocumentation30.php`. Los wrappers anteriores se conservaron. La instrumentación y las comprobaciones de descubrimiento no cuentan como casos funcionales aprobados.

### Inventario revisado y plan de ampliación

El inventario inicial se conserva en `inventory-initial-298.json`. La revisión adicional localizó el cuerpo de los 298 IDs y su línea de origen, sin ejecutarlos: `inventory-reviewed-initial-298.json` e `inventory-review-summary.json`. Se reclasificaron invocaciones de eliminación, incluso cuando el caso espera una excepción antes de SQL. Esta detección no equivale a afirmar que todas necesiten DELETE real. Las categorías son primarias: un caso de eliminación puede requerir también revisar archivos; su hook original sigue siendo relevante.

| Categoría | Al inicio | Pendientes al cierre |
| --- | ---: | ---: |
| 1 — Compatible con el mecanismo transaccional | 74 | 62 |
| 2 — Ajustes del contrato de pruebas | 2 | 2 |
| 3 — Eliminación o limpieza especial | 18 | 18 |
| 4 — Seeders demo | 2 | 2 |
| 5 — Efectos externos / archivos | 41 | 41 |
| 6 — Otras causas / revisión pendiente | 161 | 161 |

Compatible significa revisado estáticamente para el mecanismo transaccional de Sprint2, no autorizado por la lista actual ni ejecutado. La categoría de revisión pendiente conserva esa incertidumbre expresamente; no es una aprobación implícita.

Siguiente conjunto recomendado: los seis datasets de `rejects missing academic fields` y los seis de `rejects duplicates in the proper academic scope`, previa autorización/lista/filtros exactos. Después, validaciones de fechas y estados de periodos y permisos restantes. No se ejecutaron esos conjuntos.

Puede proponerse un lote futuro mayor (16–20 casos), dividido en grupos de 4–5 con proceso PHP, autorización, rollback e inspección independientes por caso. Amortiza preflight/arranque/cierre del servidor; aumentar el tamaño no elimina verificaciones ni amplía TTL. No se recomienda paralelismo, transacciones compartidas, reutilización de autorización o recorte de fixtures/aserciones para acelerar. Otros módulos necesitan revisar servicios, SQL y efectos transitivos antes de ser clasificados como compatibles.

DELETE real/limpieza especial, seeders demo, archivos/jobs y contratos de conexión diferentes requieren análisis y autorización explícita de sus restricciones antes de ejecutarse. No se habilitaron durante esta intervención.

<details>
<summary>Inventario completo de los 298 IDs pendientes al inicio y su estado al cierre</summary>

Las categorías 1–6 corresponden a la tabla anterior. Identificadores del descubrimiento; en datasets de contraseña se publica el método original y la huella SHA-256 del ID completo, sin reproducir valores sintéticos de contraseña. El JSON privado conserva el ID exacto para trazabilidad. El número de línea es referencia de lectura, no evidencia de ejecución.

| ID original | Archivo y línea | Categoría | Estado final |
| --- | --- | ---: | --- |
| `P\Tests\Feature\AvatarTest::__pest_evaluable_it_uploads_replaces_reads_and_removes_the_own_private_avatar_without_exposing_its_path` | backend/tests/Feature/AvatarTest.php:41 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\AvatarTest::__pest_evaluable_it_rejects_unsafe_and_oversized_files_and_unauthorized_profile_changes` | backend/tests/Feature/AvatarTest.php:52 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\AvatarTest::__pest_evaluable_it_denies_peer_and_cross_institution_avatar_access_while_allowing_authorized_administration` | backend/tests/Feature/AvatarTest.php:64 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\MySqlConnectionTest::__pest_evaluable_it_se_conecta_únicamente_a_la_base_MySQL_de_testing` | backend/tests/Feature/MySqlConnectionTest.php:6 | 2 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\MySqlConnectionTest::__pest_evaluable_it_impide_que_el_usuario_de_testing_consulte_desarrollo` | backend/tests/Feature/MySqlConnectionTest.php:18 | 2 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_serves_all_report_families_with_real_rows_filters_and_pagination` | backend/tests/Feature/Sprint10Test.php:71 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_isolates_institutions_and_restricts_report_and_selector_access_by_role_and_ownership` | backend/tests/Feature/Sprint10Test.php:85 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_exports_filtered_CSV_with_private_fields_excluded_and_spreadsheet_formulas_neutralized` | backend/tests/Feature/Sprint10Test.php:111 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_serves_six_real_dashboards_while_keeping_family_and_student_summaries_private` | backend/tests/Feature/Sprint10Test.php:122 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_counts_missing_deliveries_once_per_student_and_financial_validation_including_absent_payments` | backend/tests/Feature/Sprint10Test.php:147 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_incorrect_credentials#('password')` | backend/tests/Feature/Sprint1Test.php:57 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_incorrect_credentials#('email')` | backend/tests/Feature/Sprint1Test.php:57 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_incorrect_credentials#('institution_code')` | backend/tests/Feature/Sprint1Test.php:57 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_validates_login_input` | backend/tests/Feature/Sprint1Test.php:62 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_inactive_and_blocked_accounts#('INACTIVE')` | backend/tests/Feature/Sprint1Test.php:66 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_inactive_and_blocked_accounts#('BLOCKED')` | backend/tests/Feature/Sprint1Test.php:66 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_inactive_institutions` | backend/tests/Feature/Sprint1Test.php:70 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_deleted_users` | backend/tests/Feature/Sprint1Test.php:74 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('auth/me')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('users')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('institutions')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('roles')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('permissions')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('profile')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('audit-logs')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_returns_authenticated_identity_and_institution` | backend/tests/Feature/Sprint1Test.php:81 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_logs_out_and_audits_the_session` | backend/tests/Feature/Sprint1Test.php:86 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_revokes_access_when_an_account_becomes_blocked` | backend/tests/Feature/Sprint1Test.php:93 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_changes_password_securely_and_clears_the_initial_password_flag` | backend/tests/Feature/Sprint1Test.php:101 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:dcd86d61143322876ae829a0169c639aa2d13e18d56007fd8da74d2ac2791981` | backend/tests/Feature/Sprint1Test.php:108 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:fc8314197771839fc3ac0b778bd41cee89f14203659c37d93043928cb01f5184` | backend/tests/Feature/Sprint1Test.php:108 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:13106fe4fad806a0ace7321d73f4a5271f1414474d30ceacd122286f26153453` | backend/tests/Feature/Sprint1Test.php:108 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:fa018a53d42f689ffd9a2546700bec7daee5b3da14c7d559f5bbeedd4ec9b446` | backend/tests/Feature/Sprint1Test.php:108 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_isolates_user_lists_and_ignores_forged_institution_headers` | backend/tests/Feature/Sprint1Test.php:116 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_hides_foreign_user_bindings#('getJson')` | backend/tests/Feature/Sprint1Test.php:122 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_hides_foreign_user_bindings#('patchJson')` | backend/tests/Feature/Sprint1Test.php:122 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_disabling_another_institution_user` | backend/tests/Feature/Sprint1Test.php:126 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_creates_users_only_within_the_current_institution_with_hashed_passwords` | backend/tests/Feature/Sprint1Test.php:130 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_tenant_injection_and_invalid_user_fields` | backend/tests/Feature/Sprint1Test.php:137 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_valid_names_on_user_creation` | backend/tests/Feature/Sprint1Test.php:142 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_duplicate_email_in_an_institution` | backend/tests/Feature/Sprint1Test.php:145 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_allows_the_same_email_in_different_institutions` | backend/tests/Feature/Sprint1Test.php:150 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_updates_and_disables_an_institutional_user` | backend/tests/Feature/Sprint1Test.php:156 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_protects_the_last_administrator` | backend/tests/Feature/Sprint1Test.php:161 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_prevents_self_deactivation` | backend/tests/Feature/Sprint1Test.php:164 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('SECRETARY')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('TREASURY')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('TEACHER')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('STUDENT')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('GUARDIAN')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_privilege_escalation_by_users_managers` | backend/tests/Feature/Sprint1Test.php:176 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_limits_institutional_access_and_validates_updates` | backend/tests/Feature/Sprint1Test.php:183 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_limits_role_catalogs_to_current_institution` | backend/tests/Feature/Sprint1Test.php:190 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_updates_role_permissions_and_protects_administrator_role` | backend/tests/Feature/Sprint1Test.php:197 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_updates_only_permitted_profile_fields` | backend/tests/Feature/Sprint1Test.php:203 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_isolates_audit_records` | backend/tests/Feature/Sprint1Test.php:208 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_fails_closed_without_an_institution_context` | backend/tests/Feature/Sprint1Test.php:214 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_prevents_reassigning_a_user_to_another_institution` | backend/tests/Feature/Sprint1Test.php:219 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_enforces_login_rate_limiting` | backend/tests/Feature/Sprint1Test.php:225 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_persists_institution_fields__enum_and_user_relationship` | backend/tests/Feature/Sprint1Test.php:233 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_enforces_unique_institution_codes_in_MySQL` | backend/tests/Feature/Sprint1Test.php:242 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_enforces_tenant_email_uniqueness_in_MySQL` | backend/tests/Feature/Sprint1Test.php:246 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_soft_deletes_institutions_and_denies_their_accounts` | backend/tests/Feature/Sprint1Test.php:250 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_obsolete_password_session_hashes` | backend/tests/Feature/Sprint1Test.php:256 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_keeps_permission_caches_isolated_between_two_authenticated_institutions` | backend/tests/Feature/Sprint1Test.php:260 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_delegated_permissions_the_actor_does_not_possess` | backend/tests/Feature/Sprint1Test.php:273 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_institutional_writes_from_an_unprivileged_user` | backend/tests/Feature/Sprint1Test.php:282 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_users_disable_to_change_account_status` | backend/tests/Feature/Sprint1Test.php:287 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rolls_back_new_users_when_role_delegation_is_forbidden` | backend/tests/Feature/Sprint1Test.php:293 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_does_not_allow_anonymous_password_changes_or_logout` | backend/tests/Feature/Sprint1Test.php:299 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_creates_reads_edits_and_audits_an_academic_catalog#('academic-years')` | backend/tests/Feature/Sprint2Test.php:58 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_creates_reads_edits_and_audits_an_academic_catalog#('education-levels')` | backend/tests/Feature/Sprint2Test.php:58 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_creates_reads_edits_and_audits_an_academic_catalog#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:58 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_creates_reads_edits_and_audits_an_academic_catalog#('subjects')` | backend/tests/Feature/Sprint2Test.php:58 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('academic-years')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('education-levels')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('sections')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('subjects')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('academic-years')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('education-levels')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('sections')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('subjects')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('academic-years')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('education-levels')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('sections')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('subjects')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_isolates_academic_records_and_policies#('academic-years')` | backend/tests/Feature/Sprint2Test.php:85 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_isolates_academic_records_and_policies#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:85 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_isolates_academic_records_and_policies#('education-levels')` | backend/tests/Feature/Sprint2Test.php:85 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_isolates_academic_records_and_policies#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:85 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('academic-years')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('education-levels')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('sections')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('subjects')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_assigns_read_only_academic_permissions_to_secretary_and_teacher#('TEACHER')` | backend/tests/Feature/Sprint2Test.php:111 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_expose_academic_administration_to_other_roles#('STUDENT')` | backend/tests/Feature/Sprint2Test.php:125 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_expose_academic_administration_to_other_roles#('GUARDIAN')` | backend/tests/Feature/Sprint2Test.php:125 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_expose_academic_administration_to_other_roles#('TREASURY')` | backend/tests/Feature/Sprint2Test.php:125 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_switches_current_academic_year_atomically` | backend/tests/Feature/Sprint2Test.php:139 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_activating_a_year_makes_it_current_and_leaves_another_institution_unchanged` | backend/tests/Feature/Sprint2Test.php:148 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_enforces_single_current_year_with_a_MySQL_unique_constraint` | backend/tests/Feature/Sprint2Test.php:154 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-years', '2027-04-01', '2027-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-years', '2027-05-01', '2027-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-periods', '2026-04-01', '2026-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-periods', '2026-05-01', '2026-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-years', '2027-02-30', '2027-12-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-periods', 'not-a-date', '2026-12-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_periods_outside_the_year#('2026-01-01', '2026-04-01')` | backend/tests/Feature/Sprint2Test.php:165 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_periods_outside_the_year#('2026-10-01', '2026-12-31')` | backend/tests/Feature/Sprint2Test.php:165 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_overlapping_and_shared_boundary_periods#('2026-04-01', '2026-06-01')` | backend/tests/Feature/Sprint2Test.php:169 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_overlapping_and_shared_boundary_periods#('2026-05-08', '2026-06-01')` | backend/tests/Feature/Sprint2Test.php:169 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_overlapping_and_shared_boundary_periods#('2026-03-02', '2026-12-18')` | backend/tests/Feature/Sprint2Test.php:169 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_allows_adjacent_non_overlapping_periods_but_not_duplicate_sequence` | backend/tests/Feature/Sprint2Test.php:173 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_shrink_a_year_beyond_its_periods` | backend/tests/Feature/Sprint2Test.php:179 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_closes_a_year_and_its_periods_and_rejects_new_academic_changes` | backend/tests/Feature/Sprint2Test.php:189 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_cannot_bypass_close_or_disable_permissions_through_status_fields#('academic-years', 'CLOSED')` | backend/tests/Feature/Sprint2Test.php:197 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_cannot_bypass_close_or_disable_permissions_through_status_fields#('academic-periods', 'CLOSED')` | backend/tests/Feature/Sprint2Test.php:197 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_cannot_bypass_close_or_disable_permissions_through_status_fields#('subjects', 'INACTIVE')` | backend/tests/Feature/Sprint2Test.php:197 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#(-1)` | backend/tests/Feature/Sprint2Test.php:209 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#(0)` | backend/tests/Feature/Sprint2Test.php:209 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#(2.5)` | backend/tests/Feature/Sprint2Test.php:209 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#('many')` | backend/tests/Feature/Sprint2Test.php:209 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_accepts_nullable_capacity` | backend/tests/Feature/Sprint2Test.php:212 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_and_foreign_parent_relationships#('academic-periods', 'academic_year_id', 'year')` | backend/tests/Feature/Sprint2Test.php:215 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_and_foreign_parent_relationships#('grade-levels', 'education_level_id', 'level')` | backend/tests/Feature/Sprint2Test.php:215 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_and_foreign_parent_relationships#('sections', 'academic_year_id', 'year')` | backend/tests/Feature/Sprint2Test.php:215 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_and_foreign_parent_relationships#('sections', 'grade_level_id', 'grade')` | backend/tests/Feature/Sprint2Test.php:215 | 1 | APROBADO P30 |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_disables_subjects_without_removing_history_and_audits_the_change` | backend/tests/Feature/Sprint2Test.php:225 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_searches_filters_paginates_and_orders_academic_lists` | backend/tests/Feature/Sprint2Test.php:234 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_allows_identical_grade_codes_under_different_education_levels` | backend/tests/Feature/Sprint2Test.php:243 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_reserve_section_names_globally` | backend/tests/Feature/Sprint2Test.php:248 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_soft_deletes_catalogs_without_freeing_historical_unique_codes` | backend/tests/Feature/Sprint2Test.php:253 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rolls_back_academic_mutation_when_audit_persistence_fails` | backend/tests/Feature/Sprint2Test.php:259 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_reproduces_demo_data_without_duplicates_or_overwriting_edits` | backend/tests/Feature/Sprint2Test.php:275 | 4 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_editing_a_non_current_active_year_does_not_change_the_current_year` | backend/tests/Feature/Sprint2Test.php:287 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_audits_catalog_deactivation_as_disable#('education-levels')` | backend/tests/Feature/Sprint2Test.php:295 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_audits_catalog_deactivation_as_disable#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:295 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_audits_catalog_deactivation_as_disable#('sections')` | backend/tests/Feature/Sprint2Test.php:295 | 1 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_creates_a_hashed_account_and_person_atomically_with_the_fixed_role#('students')` | backend/tests/Feature/Sprint3Test.php:60 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_creates_a_hashed_account_and_person_atomically_with_the_fixed_role#('teachers')` | backend/tests/Feature/Sprint3Test.php:60 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_creates_a_hashed_account_and_person_atomically_with_the_fixed_role#('guardians')` | backend/tests/Feature/Sprint3Test.php:60 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_person_fields_and_a_secure_initial_password#dataset-sha256:726b1117e3ffe214c0d3bea81b3f2060d0a0c5b30baa68163530296f6b2eee55` | backend/tests/Feature/Sprint3Test.php:74 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_person_fields_and_a_secure_initial_password#dataset-sha256:1294204370f6a83b68885682f18c9c182b27d6ac2dcbe73cb9cd7b715e417b6f` | backend/tests/Feature/Sprint3Test.php:74 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_person_fields_and_a_secure_initial_password#dataset-sha256:4969769145cce4aa7f53f4b655f982d84ed10ea777eaa5e83cc7a852ed5c8bd6` | backend/tests/Feature/Sprint3Test.php:74 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_compatible_account_without_duplicating_or_modifying_it#('students')` | backend/tests/Feature/Sprint3Test.php:81 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_compatible_account_without_duplicating_or_modifying_it#('teachers')` | backend/tests/Feature/Sprint3Test.php:81 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_compatible_account_without_duplicating_or_modifying_it#('guardians')` | backend/tests/Feature/Sprint3Test.php:81 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_document_and_code_without_leaving_accounts#('students')` | backend/tests/Feature/Sprint3Test.php:95 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_document_and_code_without_leaving_accounts#('teachers')` | backend/tests/Feature/Sprint3Test.php:95 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_document_and_code_without_leaving_accounts#('guardians')` | backend/tests/Feature/Sprint3Test.php:95 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_missing_foreign_and_incompatible_accounts#('students')` | backend/tests/Feature/Sprint3Test.php:107 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_missing_foreign_and_incompatible_accounts#('teachers')` | backend/tests/Feature/Sprint3Test.php:107 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_missing_foreign_and_incompatible_accounts#('guardians')` | backend/tests/Feature/Sprint3Test.php:107 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_malicious_mass_assignment#('students')` | backend/tests/Feature/Sprint3Test.php:116 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_malicious_mass_assignment#('teachers')` | backend/tests/Feature/Sprint3Test.php:116 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_malicious_mass_assignment#('guardians')` | backend/tests/Feature/Sprint3Test.php:116 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reads_updates_and_disables_a_person_while_retaining_history#('students')` | backend/tests/Feature/Sprint3Test.php:123 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reads_updates_and_disables_a_person_while_retaining_history#('teachers')` | backend/tests/Feature/Sprint3Test.php:123 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reads_updates_and_disables_a_person_while_retaining_history#('guardians')` | backend/tests/Feature/Sprint3Test.php:123 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_isolates_person_lists_bindings_and_policies_by_institution#('students')` | backend/tests/Feature/Sprint3Test.php:135 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_isolates_person_lists_bindings_and_policies_by_institution#('teachers')` | backend/tests/Feature/Sprint3Test.php:135 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_isolates_person_lists_bindings_and_policies_by_institution#('guardians')` | backend/tests/Feature/Sprint3Test.php:135 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_allows_same_documents_and_codes_in_different_institutions#('students')` | backend/tests/Feature/Sprint3Test.php:144 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_allows_same_documents_and_codes_in_different_institutions#('teachers')` | backend/tests/Feature/Sprint3Test.php:144 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_allows_same_documents_and_codes_in_different_institutions#('guardians')` | backend/tests/Feature/Sprint3Test.php:144 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_protects_sensitive_state_transitions_from_secretary#('students')` | backend/tests/Feature/Sprint3Test.php:150 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_protects_sensitive_state_transitions_from_secretary#('teachers')` | backend/tests/Feature/Sprint3Test.php:150 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_protects_sensitive_state_transitions_from_secretary#('guardians')` | backend/tests/Feature/Sprint3Test.php:150 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_permits_secretary_onboarding_of_students_and_guardians_only#('students')` | backend/tests/Feature/Sprint3Test.php:163 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_permits_secretary_onboarding_of_students_and_guardians_only#('guardians')` | backend/tests/Feature/Sprint3Test.php:163 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_prevents_teacher_creation_by_secretary` | backend/tests/Feature/Sprint3Test.php:166 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_administrative_person_access_to_student_guardian_and_treasury#('STUDENT')` | backend/tests/Feature/Sprint3Test.php:169 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_administrative_person_access_to_student_guardian_and_treasury#('GUARDIAN')` | backend/tests/Feature/Sprint3Test.php:169 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_administrative_person_access_to_student_guardian_and_treasury#('TREASURY')` | backend/tests/Feature/Sprint3Test.php:169 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_limits_teacher_student_data_to_authorized_basic_information` | backend/tests/Feature/Sprint3Test.php:176 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_authentication_for_people` | backend/tests/Feature/Sprint3Test.php:183 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['2099-01-01'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['2020-02-30'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['2000-01-01'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('teachers', ['not-a-date'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['INVALID'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['BLOCKED'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('teachers', ['GRADUATED'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('guardians', ['ON_LEAVE'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['123'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('guardians', ['INVALID'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('teachers', ['unsafe<script>'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_accepts_supported_lifecycle_states#('students', 'GRADUATED')` | backend/tests/Feature/Sprint3Test.php:199 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_accepts_supported_lifecycle_states#('students', 'WITHDRAWN')` | backend/tests/Feature/Sprint3Test.php:199 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_accepts_supported_lifecycle_states#('teachers', 'ON_LEAVE')` | backend/tests/Feature/Sprint3Test.php:199 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_preserves_profile_roles_and_immutable_account_binding` | backend/tests/Feature/Sprint3Test.php:203 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_finds_compatible_accounts_but_not_foreign_or_privileged_accounts` | backend/tests/Feature/Sprint3Test.php:208 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_account_duplication_and_simultaneous_create_plus_reuse` | backend/tests/Feature/Sprint3Test.php:215 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_account_profile_and_assigned_role_when_auditing_fails#('students')` | backend/tests/Feature/Sprint3Test.php:221 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_account_profile_and_assigned_role_when_auditing_fails#('teachers')` | backend/tests/Feature/Sprint3Test.php:221 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_account_profile_and_assigned_role_when_auditing_fails#('guardians')` | backend/tests/Feature/Sprint3Test.php:221 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_retains_uniqueness_after_soft_deletion#('students')` | backend/tests/Feature/Sprint3Test.php:242 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_retains_uniqueness_after_soft_deletion#('teachers')` | backend/tests/Feature/Sprint3Test.php:242 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_retains_uniqueness_after_soft_deletion#('guardians')` | backend/tests/Feature/Sprint3Test.php:242 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_searches_filters_and_paginates_people` | backend/tests/Feature/Sprint3Test.php:251 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_family_relationships_and_invalid_fields` | backend/tests/Feature/Sprint3Test.php:267 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_switches_the_single_primary_transactionally_and_supports_many_to_many_families` | backend/tests/Feature/Sprint3Test.php:277 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_enforces_single_primary_and_same_institution_with_database_constraints` | backend/tests/Feature/Sprint3Test.php:293 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_cross_tenant_family_IDs_and_bindings` | backend/tests/Feature/Sprint3Test.php:305 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_detaches_only_the_relation_preserving_both_people_and_audit_history` | backend/tests/Feature/Sprint3Test.php:318 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_family_management_permission` | backend/tests/Feature/Sprint3Test.php:332 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_restricts_profiles_and_family_queries_to_the_authenticated_account#('students')` | backend/tests/Feature/Sprint3Test.php:345 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_restricts_profiles_and_family_queries_to_the_authenticated_account#('teachers')` | backend/tests/Feature/Sprint3Test.php:345 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_restricts_profiles_and_family_queries_to_the_authenticated_account#('guardians')` | backend/tests/Feature/Sprint3Test.php:345 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_guardian_sees_only_linked_students_without_private_identity_fields` | backend/tests/Feature/Sprint3Test.php:354 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reproduces_fictitious_people_without_duplicating_accounts_or_relationships` | backend/tests/Feature/Sprint3Test.php:365 | 4 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_refuses_onboarding_a_role_with_permissions_the_operator_cannot_delegate` | backend/tests/Feature/Sprint3Test.php:373 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_does_not_reuse_a_blocked_account` | backend/tests/Feature/Sprint3Test.php:379 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_teacher_guardian_account_without_changing_its_roles` | backend/tests/Feature/Sprint3Test.php:387 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_primary_switch_when_relation_audit_fails` | backend/tests/Feature/Sprint3Test.php:404 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_association_to_inactive_guardians_without_losing_existing_links` | backend/tests/Feature/Sprint3Test.php:426 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_runs_correction_approval_cancellation_with_immutable_history_and_audit` | backend/tests/Feature/Sprint4Test.php:59 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('student_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('academic_year_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('grade_level_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('section_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rechecks_student_year_and_section_before_approval#('student')` | backend/tests/Feature/Sprint4Test.php:83 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rechecks_student_year_and_section_before_approval#('year')` | backend/tests/Feature/Sprint4Test.php:83 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rechecks_student_year_and_section_before_approval#('section')` | backend/tests/Feature/Sprint4Test.php:83 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_consumes_only_approved_capacity_and_releases_it_on_cancellation` | backend/tests/Feature/Sprint4Test.php:94 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_requires_correct_validated_payment_and_separates_secretary_from_treasury` | backend/tests/Feature/Sprint4Test.php:106 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_does_not_accept_another_students_payment_or_forged_paid_status` | backend/tests/Feature/Sprint4Test.php:122 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_isolates_foreign_enrollment_student_section_payment_and_history` | backend/tests/Feature/Sprint4Test.php:133 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_limits_student_guardian_and_teacher_access_and_minimal_treasury_lookup` | backend/tests/Feature/Sprint4Test.php:149 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rolls_back_enrollment_history_and_payment_validation_when_audit_fails` | backend/tests/Feature/Sprint4Test.php:170 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_a_pending_application_with_history_and_allows_a_fresh_application` | backend/tests/Feature/Sprint4Test.php:181 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_sections_from_another_year_or_grade_and_inactive_drafts` | backend/tests/Feature/Sprint4Test.php:196 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_enforces_duplicate_prevention_in_the_database_including_soft_deleted_active_rows` | backend/tests/Feature/Sprint4Test.php:208 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_allows_unlimited_capacity_and_rejects_zero_capacity` | backend/tests/Feature/Sprint4Test.php:217 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_short_payments_supports_overdue_validation_and_rolls_it_back_on_audit_failure` | backend/tests/Feature/Sprint4Test.php:225 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_foreign_payment_references_and_cancelled_validation` | backend/tests/Feature/Sprint4Test.php:243 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_creates_assignments_and_rejects_equivalence_while_allowing_co_teachers` | backend/tests/Feature/Sprint5Test.php:56 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_rejects_missing_inactive_and_academically_inconsistent_assignment_references` | backend/tests/Feature/Sprint5Test.php:63 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_creates_activates_edits_and_closes_courses_with_audit_and_unique_codes` | backend/tests/Feature/Sprint5Test.php:75 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_requires_an_active_matching_assignment_and_prevents_detaching_active_teaching` | backend/tests/Feature/Sprint5Test.php:88 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_limits_teachers_to_assigned_courses_and_an_approved_minimal_roster` | backend/tests/Feature/Sprint5Test.php:100 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_derives_student_access_from_approved_enrollment_and_revokes_it_on_cancellation` | backend/tests/Feature/Sprint5Test.php:114 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_denies_students_without_approved_enrollment_or_in_another_section` | backend/tests/Feature/Sprint5Test.php:131 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_isolates_institution_references_course_queries_and_IDOR_writes` | backend/tests/Feature/Sprint5Test.php:145 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_authorizes_secretary_read_only_and_denies_treasury_guardian_and_unauthenticated_management` | backend/tests/Feature/Sprint5Test.php:161 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_rolls_back_course_and_audit_atomically` | backend/tests/Feature/Sprint5Test.php:175 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_validates_filters_pagination_and_protects_state_and_institution_fields` | backend/tests/Feature/Sprint5Test.php:180 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_checks_live_academic_eligibility_on_activation_and_hides_inactive_courses_from_students` | backend/tests/Feature/Sprint5Test.php:187 | 6 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_lets_assigned_teachers_create_edit_publish_archive_units_with_ordered_uniqueness_and_audit` | backend/tests/Feature/Sprint6Test.php:56 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_requires_active_courses_for_publication_and_published_parent_units_for_materials` | backend/tests/Feature/Sprint6Test.php:69 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_creates_updates_and_publishes_link_and_text_materials_and_rejects_incomplete_payloads` | backend/tests/Feature/Sprint6Test.php:88 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_stores_files_privately_with_generated_names_and_authorizes_live_downloads` | backend/tests/Feature/Sprint6Test.php:101 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_rejects_executable_disguised_oversized_and_invalid_office_uploads_without_orphan_files` | backend/tests/Feature/Sprint6Test.php:114 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_shows_only_published_content_to_approved_students_and_denies_management` | backend/tests/Feature/Sprint6Test.php:129 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_denies_non_assigned_teachers_and_non_classroom_roles_with_current_permission_checks` | backend/tests/Feature/Sprint6Test.php:145 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_isolates_foreign_institutions_and_rejects_units_belonging_to_another_course` | backend/tests/Feature/Sprint6Test.php:165 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_rolls_back_metadata_audit_and_uploaded_files_together_on_failure` | backend/tests/Feature/Sprint6Test.php:182 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_preserves_material_history_and_audits_create_update_publish_archive_without_private_paths` | backend/tests/Feature/Sprint6Test.php:189 | 3 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_supports_multipart_file_replacement_and_hides_all_content_after_course_deactivation` | backend/tests/Feature/Sprint6Test.php:204 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_paginates_ordered_units_and_material_filters_and_requires_authentication` | backend/tests/Feature/Sprint6Test.php:214 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_lets_assigned_teachers_manage_tasks_with_audited_publication_and_immutable_closure` | backend/tests/Feature/Sprint7Test.php:61 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_denies_other_teachers_and_isolates_assignment_assessment_and_unit_references` | backend/tests/Feature/Sprint7Test.php:74 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_shows_published_tasks_only_to_approved_students_and_blocks_foreign_submission_and_score_IDOR` | backend/tests/Feature/Sprint7Test.php:90 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_records_private_submissions_review_feedback_and_returned_attempts_without_overwriting_history` | backend/tests/Feature/Sprint7Test.php:114 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_enforces_deadlines_late_configuration_and_closed_tasks` | backend/tests/Feature/Sprint7Test.php:129 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_records_a_valid_score_only_for_approved_students_and_rejects_duplicates_and_non_teacher_grading` | backend/tests/Feature/Sprint7Test.php:139 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_rejects_scores_outside_zero_to_twenty_and_mismatched_academic_periods` | backend/tests/Feature/Sprint7Test.php:151 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_blocks_ordinary_grading_in_locked_periods_and_closed_assessments` | backend/tests/Feature/Sprint7Test.php:159 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_preserves_previous_scores_reason_and_actor_with_atomic_audit_rollback` | backend/tests/Feature/Sprint7Test.php:169 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_rejects_unsafe_files_and_cleans_failed_uploads_while_respecting_revoked_enrollment` | backend/tests/Feature/Sprint7Test.php:183 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_allows_assigned_teachers_to_manage_unique_sessions_and_preserves_closure` | backend/tests/Feature/Sprint8Test.php:67 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_blocks_other_teachers_from_creating_reading_and_writing_course_attendance` | backend/tests/Feature/Sprint8Test.php:80 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_records_attendance_atomically_only_for_approved_roster_students` | backend/tests/Feature/Sprint8Test.php:88 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_rejects_duplicated_bulk_students_and_upserts_without_duplicate_records` | backend/tests/Feature/Sprint8Test.php:99 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_lets_linked_guardians_submit_one_safe_private_justification_with_history` | backend/tests/Feature/Sprint8Test.php:106 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_denies_unrelated_guardians_private_records_justification_history_and_files` | backend/tests/Feature/Sprint8Test.php:119 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_approves_after_review_atomically_including_closed_sessions_and_audit_rollback` | backend/tests/Feature/Sprint8Test.php:130 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_requires_rejection_reasons_and_keeps_rejected_absences_unchanged` | backend/tests/Feature/Sprint8Test.php:151 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_exposes_only_personal_historical_attendance_to_students_and_denies_writes` | backend/tests/Feature/Sprint8Test.php:159 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_isolates_all_attendance_and_justification_references_between_institutions` | backend/tests/Feature/Sprint8Test.php:170 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_creates_student_owned_requests_with_unique_generated_codes_and_denies_impersonation` | backend/tests/Feature/Sprint9Test.php:64 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_allows_a_linked_guardian_to_create_and_consult_a_student_request` | backend/tests/Feature/Sprint9Test.php:78 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_denies_unrelated_guardians_creation_reading_editing_and_transitions` | backend/tests/Feature/Sprint9Test.php:85 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_observes_and_reopens_requests_with_owner_corrections_and_complete_history` | backend/tests/Feature/Sprint9Test.php:95 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_approves_completes_and_rejects_only_valid_transitions_with_atomic_notifications_and_history` | backend/tests/Feature/Sprint9Test.php:109 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_keeps_documents_private_and_issues_only_approved_linked_documents_to_the_correct_student` | backend/tests/Feature/Sprint9Test.php:131 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_deduplicates_overlapping_communication_targets_and_keeps_published_recipients_stable` | backend/tests/Feature/Sprint9Test.php:151 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_restricts_communications_to_recipients_and_protects_foreign_targets_and_management` | backend/tests/Feature/Sprint9Test.php:162 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_marks_only_owned_notifications_read_and_supports_unread_filters_and_mark_all` | backend/tests/Feature/Sprint9Test.php:172 | 5 | PENDIENTE / NO EJECUTADO |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_isolates_requests_documents_communications_and_notifications_between_institutions` | backend/tests/Feature/Sprint9Test.php:186 | 5 | PENDIENTE / NO EJECUTADO |

</details>

**A. LOTE AMPLIADO APROBADO.** La clasificación se limita a los resultados acreditados del lote; no certifica la suite completa ni modifica las restricciones de los pendientes.
