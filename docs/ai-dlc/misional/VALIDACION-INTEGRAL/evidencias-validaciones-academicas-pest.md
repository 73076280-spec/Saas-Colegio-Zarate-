# Prompt 31 — Campos obligatorios y duplicados académicos

Fecha de inicio: 05/11/2026, America/Lima. Rama: `test/integracion-misional`.

## Continuidad

Se continúa desde Prompt 30: 314 casos originales, 28 distintos aprobados, 207 aserciones acreditadas y 286 pendientes. Se recuperaron el inventario y los JUnit finales de los Prompts 27/28/29c/30: 28 testcase aprobados, 207 aserciones, hashes conservados, sin reejecutarlos. La evidencia se registra en `prompt31/previous-junit-verification.json`.

Se revisaron el cierre del Prompt 30, el instrumental aprobado, Sprint2Test, factories de Institution/User, hooks, AcademicCatalog, SaveAcademicRequest y AcademicService::unique. Los cambios Git existentes se conservan, incluida la modificación anterior de evidencias-finalizacion-migraciones.md y los documentos no versionados. No se modifica backend/AGENTS.md ni su destino histórico: la autorización expresa actual exige zarate_pest con cuenta exclusiva en el servidor aislado.

## Doce datasets nuevos y alcance exacto

Origen: `backend/tests/Feature/Sprint2Test.php`. Métodos originales:

- `rejects missing academic fields`: POST vacío, HTTP 422 y error de validación en `name`.
- `rejects duplicates in the proper academic scope`: primer POST con payload válido, HTTP 201; repetición del payload, HTTP 422.

Cada método tiene seis datasets del catálogo real, identificado por el inventario original de Pest. Dos métodos parametrizados producen doce casos distintos; descubrimientos y reejecuciones no se suman como casos nuevos.

| Caso | Método | Dataset | Grupo operativo |
| --- | --- | --- | ---: |
| C31-01 | rejects missing academic fields | ('academic-years') | 1 |
| C31-02 | rejects missing academic fields | ('academic-periods') | 1 |
| C31-03 | rejects missing academic fields | ('education-levels') | 1 |
| C31-04 | rejects missing academic fields | ('grade-levels') | 2 |
| C31-05 | rejects missing academic fields | ('sections') | 2 |
| C31-06 | rejects missing academic fields | ('subjects') | 2 |
| C31-07 | rejects duplicates in the proper academic scope | ('academic-years') | 3 |
| C31-08 | rejects duplicates in the proper academic scope | ('academic-periods') | 3 |
| C31-09 | rejects duplicates in the proper academic scope | ('education-levels') | 3 |
| C31-10 | rejects duplicates in the proper academic scope | ('grade-levels') | 4 |
| C31-11 | rejects duplicates in the proper academic scope | ('sections') | 4 |
| C31-12 | rejects duplicates in the proper academic scope | ('subjects') | 4 |

Los doce IDs aparecen exactamente una vez en el inventario pendiente del Prompt 30. Los filtros se comprobaron por descubrimiento protegido: un caso por filtro, sin setup, bootstrap de Laravel ni conexión SQL. `cases.json` conserva ID original, método, dataset, hashes y filtro. La copia privada mantiene íntegros los cuerpos y aserciones; solo adapta los dos literales ya autorizados de base y Origin.

No se inventan entidades de áreas/aulas: Subject es el catálogo real de asignaturas. Los tests vacíos no comprueban individualmente todos los campos obligatorios ni formatos, rangos y combinaciones. Los tests de duplicados no afirman por sí solos qué campo o índice produjo el 422. En periodos puede intervenir también la regla de solapamiento. El código de unicidad distingue nombre/código o secuencia y relaciones de ámbito, con scopes institucionales; aquí no se ejecuta un nuevo caso de duplicado permitido entre instituciones ni de rechazo directo de un índice MySQL.

La conservación de filas entre los dos POST no tiene una aserción de conteo adicional en el test original. No se añade ni se atribuye esa cobertura. Se documentan las respuestas originales, el comportamiento transaccional del servicio y los conteos antes/después del caso. La comprobación de cero residuos corresponde al rollback final, no a una medición inventada dentro del cuerpo.

## Fixtures, guardas y ejecución

Los hooks originales usan DatabaseTransactions, factories sintéticas, institución/administrador y año/nivel/grado propios. RolePermissionSeeder se conserva como fixture sintético de permisos, igual que en los lotes ya autorizados; no se invoca db:seed ni un seeder demo. No se identificaron DELETE, DDL, archivos, jobs externos, commits exteriores o conexiones secundarias en estos doce caminos. Los traits reconstructivos siguen rechazados.

Se creó una copia privada en `.tools/misional-isolated/evidence/prompt31`, sin modificar Prompt 30 ni código funcional. Mantiene host 127.0.0.1, puerto 3308, zarate_pest, cuenta exclusiva, Laravel testing, TLS estricto, UUID/directorio, procesos/listener, grants exactos y mismo PDO/CONNECTION_ID sin reconexión. El gate de 120 segundos se emite después de las inspecciones preparatorias; no se renueva dentro de transacciones. Cada caso debe terminar con un BEGIN/un ROLLBACK, DELETE=0 y comprobantes limpios desde el mismo PDO y otro proceso.

Se cambia únicamente la lista explícita y el agrupamiento operativo a cuatro grupos de tres. Solo se avanza tras salida correcta, JUnit individual, rollback e inspección de esquema/conteos aprobados. Se detiene ante cualquier salida no cero, sin reintentos automáticos. Denegaciones iniciales/finales e inspecciones finales se guardan en archivos separados.

Se conservaron las pruebas negativas previas. La copia actual aprobó 13 controles offline de vigencia, configuración, TLS y SQL prohibido, sin conexión SQL; no son casos Pest. Se comprobó la sintaxis de 17 PHP privados y del supervisor, y la igualdad del mirror con los dos cambios de contrato permitidos. No se repitió el diagnóstico completo de infraestructura ya acreditado; las comprobaciones vivas requeridas por cada proceso se renuevan antes de operar.

## Resultados

Se incorporarán desde JUnit, métricas, rollbacks e inspecciones reales. No se anticipa la aprobación del lote.


## Cierre parcial — expiración de autorización

**D. BLOQUEADO POR SEGURIDAD O ENTORNO. Prompt 31 no completado.** El supervisor se detuvo ante la salida 2 del segundo caso y no reintentó ni ejecutó los diez restantes. No se modificaron TTL, guardas, aserciones o lógica funcional para superar el error.

| Grupo | Ejecutados | Aprobados | Fallidos de aserción | Errores de entorno | Bloqueados sin ejecutar | Aserciones acreditadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Campos obligatorios | 2 | 1 | 0 | 1 | 4 | 4 |
| Duplicados académicos | 0 | 0 | 0 | 0 | 6 | 0 |

Dentro de los doce seleccionados: un aprobado, un caso con error y diez no ejecutados. Los once sin aprobación no son once casos nuevos ejecutados. JUnit registra ocho aserciones en los dos intentos, pero solo cuatro pertenecen a una ejecución aprobada y se acreditan. El acumulado queda en **29 casos distintos aprobados, 211 aserciones acreditadas y 285 casos pendientes de aprobación**. De esos pendientes, uno tiene el error actual y 284 no se han ejecutado.

| Caso | Resultado | Aserciones registradas | Acreditadas | Rollback | Limpieza |
| --- | --- | ---: | ---: | --- | --- |
| C31-01 | PASSED | 4 | 4 | Explícito verificado | Mismo PDO y comprobación externa |
| C31-02 | ERROR | 4 | 0 | Explícito verificado | Externa aprobada; falta comprobante vigente del mismo PDO |
| C31-03 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-04 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-05 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-06 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-07 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-08 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-09 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-10 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-11 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |
| C31-12 | NOT_EXECUTED | 0 | 0 | NO EJECUTADO | NO EJECUTADA |

### Error, tiempos y causa demostrada

C31-01 (años académicos) aprobó cuatro aserciones: destino de prueba, respuesta 422 y validación de name en POST vacío. C31-02 (periodos) registró cuatro aserciones sin fallos, pero terminó con `RuntimeException: ISOLATION_BLOCKED_42`. El stack de case2.xml localiza el rechazo en validAge23, llamado por Runtime31::assertClean31 durante disconnect, **después del rollback**. No se declara aprobado ese caso ni se extiende el resultado a otros catálogos. No se ejecutó ningún caso de duplicados; no hay nueva evidencia positiva de esa parte del objetivo.

| Etapa desde arranque CLI | C31-01 (s) | C31-02 (s) |
| --- | ---: | ---: |
| Selección/hash completos | 0,055 | 0,056 |
| Inicio configuración | 0,354 | 0,346 |
| Fin configuración | 0,420 | 0,426 |
| Bootstrap/inspección limpia completados | 1,865 | 1,744 |
| BEGIN raíz | 2,044 | 1,938 |
| ROLLBACK raíz | 74,361 | 119,371 |
| Cierre CLI | 74,708 | 120,825 |
| Máxima edad observada del gate | 75,428 | 120,299 |
| Atestaciones de seguridad (cantidad) | 559 | 559 |
| Tiempo agregado de atestaciones (s) | 65,233 | 104,969 |
| Máxima duración de una atestación (s) | 0,248 | 1,638 |

Los dos procesos registraron los mismos contadores de operaciones interceptadas: SELECT 265, INSERT 162, UPDATE 0, DELETE 0 y SAVEPOINT 122; ambos con BEGIN=1 y ROLLBACK=1. Son contadores de operaciones, no filas persistidas ni aserciones. La diferencia de tiempo agregado de atestación es aproximadamente 39,736 s. Los relojes de pared y monotónico del segundo proceso difieren menos de 0,00002 s: no hay evidencia de salto de reloj en ese caso.

Está demostrada la expiración durante el cierre y un mayor costo de atestación. **No está identificada la causa raíz de esa latencia**: el temporizador engloba comprobación nativa de procesos/listener, validación de configuración efectiva y diagnósticos SQL. No permite atribuirla por separado a WMI, disco, MySQL, CPU, Internet o Windows. Se requiere observabilidad más fina antes de proponer una corrección segura. Las duraciones de atestación se superponen con las etapas y no se suman al CLI. No se renueva un gate dentro de la transacción ni se aumenta el límite para evitar el error.

### Rollback y estado SQL final

El rollback del segundo proceso se ejecutó y su contador quedó persistido. El comprobante `clean-1876-after-rollback.json` no se emitió porque falló la validación final de vigencia: **no se presenta como aprobado**. Las inspecciones independientes post-case2 y after utilizaron procesos nuevos con autorización fresca y confirmaron esquema y conteos limpios. No se repitió el test para obtenerlos.

Se conservaron las **52 tablas y 14 migraciones**; esquema completo de tablas InnoDB, columnas, índices, claves, reglas, triggers y registros de migrations idéntico al baseline. migrations mantiene 14 filas y las 51 tablas de aplicación cero. Cero residuos persistentes. La igualdad es lógica, no binaria ni de contadores autoincrementales. No se ejecutaron DELETE, DDL, DROP, TRUNCATE, migraciones, seeders demo, Cypress ni la suite completa.

### Seguridad y cierre del servidor

Paridad nativa/PowerShell aprobada para la identidad de procesos/listener. Inspecciones iniciales/finales: MySQL 8.4.11 en 127.0.0.1:3308, zarate_pest, cuenta exclusiva, UUID/directorio correctos, mismo PDO/CONNECTION_ID, grants originales exactos y TLS estricto con TLS_AES_256_GCM_SHA384. live-negative.json y live-negative-final.json acreditan dos denegaciones reales MySQL 1044 cada uno a zarate_dev/zarate_test y cero escrituras intentadas. Esas cuatro comprobaciones no se suman como casos Pest. No se ampliaron privilegios, cambiaron contraseñas ni desactivaron controles.

Servidor cerrado: true; worker exit 0; errores MySQL 0; procesos 0; PID ausente true. Avisos 1: el log identifica la CA privada autofirmada; la verificación TLS sigue activa. El informe de cierre contó 0 entradas TCP. La comprobación posterior (`post-shutdown-network.json`) registra 0 entradas, 0 listeners, 0 procesos y PID ausente. El monitor se cerró mediante la señal prevista al árbol propiedad del supervisor. No se detuvieron servicios de demostración.

### Evidencias, archivos e inventario actualizado

Ubicación privada: `.tools/misional-isolated/evidence/prompt31`. Resultados: run/case1.xml y case2.xml; metrics-14264.json y metrics-1876.json; effects-PID.json; pre/post-caseN.stdout.json y snapshots; after.stdout.json; negative*.stdout.json; run/result.json. incident-expiration-case2.json registra el diagnóstico sin nuevas conexiones SQL. summary31.json consolida resultados e inventory-remaining.json conserva los 285 pendientes con estado ERROR / NOT_EXECUTED / NOT_SELECTED. El inventario inicial de 286 se mantiene intacto. No se completó ningún grupo operativo de tres.

Los dos documentos públicos de Prompt 31 son nuevos. Instrumental nuevo: Build31.php, PrepareReports31.php, Summary31.php, Audit31.php, Diagnose31.php y CloseBlocked31.php, más wrappers/perfiles/validadores y salidas en prompt31. DocumentResults31.php se preparó como plantilla antes del incidente y **no se ejecutó**; este cierre parcial lo generó CloseBlocked31.php. Las copias de los prompts anteriores, los 28 JUnit acreditados y los cambios Git previos permanecen sin alterar. preservation-audit31-final.json verifica sus hashes y ausencia de exposición de la credencial privada de pruebas/APP_KEY; el prompt actual se conserva íntegro. git diff --check se registra al cierre. Sin cambios funcionales ni en migraciones, datos de desarrollo, roles o permisos; sin commits ni push.

### Plan condicionado para próximos lotes

| Clasificación estructural heredada | Pendientes | Limitación |
| --- | ---: | --- |
| Compatibles con mecanismo de Sprint2 | 61 | Todos bloqueados operativamente hasta resolver la latencia; requieren lista/filtros/autorización |
| Ajustes de fixtures/contrato de conexión | 2 | Contratos históricos MySqlConnectionTest |
| DELETE/eliminación o limpieza especial | 18 | Algunas llamadas esperan rechazo o son soft delete; no se afirma DELETE SQL para todas |
| Archivos privados | 41 | Revisar hooks y efectos no revertidos por rollback SQL |
| Seeders demo | 2 | Prohibidos en esta intervención |
| Operaciones externas adicionales | 0 confirmadas | No se certifica su ausencia en casos sin revisar servicios transitivos |
| Otras restricciones/revisión pendiente | 161 | No declarados compatibles |

Estas categorías son primarias; no excluyen riesgos secundarios. Los 61 compatibles incluyen el caso con error y los diez seleccionados no ejecutados.

Primero se requiere diagnosticar por componente el tiempo de atestación, validar cualquier optimización sin reducir garantías y reanudar solo los casos sin aprobación, con nuevas autorizaciones después de comprobar limpieza. No debe repetirse C31-01 como caso nuevo. No se autoriza automáticamente ningún reintento ni un lote mayor.

Se conserva la propuesta estática de veinte IDs en proposed-next-20-not-authorized.json: seis de status/inyección institucional, seis de autenticación, seis de intervalos de fechas y dos de periodos fuera del año. **No están preparados para ejecución mientras persista el bloqueo actual**; no se descubrieron/ejecutaron ni añadieron al launcher. Un futuro lote de veinte, en grupos de cuatro con procesos y autorizaciones independientes, solo puede recomendarse operativamente después de validar el entorno. No se recomienda cuarenta con esta incidencia abierta. DELETE, archivos, seeders y otros efectos requieren autorización específica.

<details>
<summary>Los 285 casos pendientes al cierre</summary>

Categorías 1–6 heredadas de Prompt 30; los datasets de contraseña se identifican por huella SHA-256 del ID sin reproducir sus valores sintéticos. El JSON privado conserva los IDs exactos.

| ID original / huella de dataset | Archivo y línea | Categoría | Estado P31 |
| --- | --- | ---: | --- |
| `P\Tests\Feature\AvatarTest::__pest_evaluable_it_uploads_replaces_reads_and_removes_the_own_private_avatar_without_exposing_its_path` | backend/tests/Feature/AvatarTest.php:41 | 3 | NOT_SELECTED |
| `P\Tests\Feature\AvatarTest::__pest_evaluable_it_rejects_unsafe_and_oversized_files_and_unauthorized_profile_changes` | backend/tests/Feature/AvatarTest.php:52 | 3 | NOT_SELECTED |
| `P\Tests\Feature\AvatarTest::__pest_evaluable_it_denies_peer_and_cross_institution_avatar_access_while_allowing_authorized_administration` | backend/tests/Feature/AvatarTest.php:64 | 5 | NOT_SELECTED |
| `P\Tests\Feature\MySqlConnectionTest::__pest_evaluable_it_se_conecta_únicamente_a_la_base_MySQL_de_testing` | backend/tests/Feature/MySqlConnectionTest.php:6 | 2 | NOT_SELECTED |
| `P\Tests\Feature\MySqlConnectionTest::__pest_evaluable_it_impide_que_el_usuario_de_testing_consulte_desarrollo` | backend/tests/Feature/MySqlConnectionTest.php:18 | 2 | NOT_SELECTED |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_serves_all_report_families_with_real_rows_filters_and_pagination` | backend/tests/Feature/Sprint10Test.php:71 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_isolates_institutions_and_restricts_report_and_selector_access_by_role_and_ownership` | backend/tests/Feature/Sprint10Test.php:85 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_exports_filtered_CSV_with_private_fields_excluded_and_spreadsheet_formulas_neutralized` | backend/tests/Feature/Sprint10Test.php:111 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_serves_six_real_dashboards_while_keeping_family_and_student_summaries_private` | backend/tests/Feature/Sprint10Test.php:122 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint10Test::__pest_evaluable_it_counts_missing_deliveries_once_per_student_and_financial_validation_including_absent_payments` | backend/tests/Feature/Sprint10Test.php:147 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_incorrect_credentials#('password')` | backend/tests/Feature/Sprint1Test.php:57 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_incorrect_credentials#('email')` | backend/tests/Feature/Sprint1Test.php:57 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_incorrect_credentials#('institution_code')` | backend/tests/Feature/Sprint1Test.php:57 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_validates_login_input` | backend/tests/Feature/Sprint1Test.php:62 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_inactive_and_blocked_accounts#('INACTIVE')` | backend/tests/Feature/Sprint1Test.php:66 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_inactive_and_blocked_accounts#('BLOCKED')` | backend/tests/Feature/Sprint1Test.php:66 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_inactive_institutions` | backend/tests/Feature/Sprint1Test.php:70 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_deleted_users` | backend/tests/Feature/Sprint1Test.php:74 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('auth/me')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('users')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('institutions')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('roles')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('permissions')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('profile')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_authentication#('audit-logs')` | backend/tests/Feature/Sprint1Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_returns_authenticated_identity_and_institution` | backend/tests/Feature/Sprint1Test.php:81 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_logs_out_and_audits_the_session` | backend/tests/Feature/Sprint1Test.php:86 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_revokes_access_when_an_account_becomes_blocked` | backend/tests/Feature/Sprint1Test.php:93 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_changes_password_securely_and_clears_the_initial_password_flag` | backend/tests/Feature/Sprint1Test.php:101 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:dcd86d61143322876ae829a0169c639aa2d13e18d56007fd8da74d2ac2791981` | backend/tests/Feature/Sprint1Test.php:108 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:fc8314197771839fc3ac0b778bd41cee89f14203659c37d93043928cb01f5184` | backend/tests/Feature/Sprint1Test.php:108 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:13106fe4fad806a0ace7321d73f4a5271f1414474d30ceacd122286f26153453` | backend/tests/Feature/Sprint1Test.php:108 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_invalid_password_changes#dataset-sha256:fa018a53d42f689ffd9a2546700bec7daee5b3da14c7d559f5bbeedd4ec9b446` | backend/tests/Feature/Sprint1Test.php:108 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_isolates_user_lists_and_ignores_forged_institution_headers` | backend/tests/Feature/Sprint1Test.php:116 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_hides_foreign_user_bindings#('getJson')` | backend/tests/Feature/Sprint1Test.php:122 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_hides_foreign_user_bindings#('patchJson')` | backend/tests/Feature/Sprint1Test.php:122 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_disabling_another_institution_user` | backend/tests/Feature/Sprint1Test.php:126 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_creates_users_only_within_the_current_institution_with_hashed_passwords` | backend/tests/Feature/Sprint1Test.php:130 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_tenant_injection_and_invalid_user_fields` | backend/tests/Feature/Sprint1Test.php:137 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_valid_names_on_user_creation` | backend/tests/Feature/Sprint1Test.php:142 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_duplicate_email_in_an_institution` | backend/tests/Feature/Sprint1Test.php:145 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_allows_the_same_email_in_different_institutions` | backend/tests/Feature/Sprint1Test.php:150 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_updates_and_disables_an_institutional_user` | backend/tests/Feature/Sprint1Test.php:156 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_protects_the_last_administrator` | backend/tests/Feature/Sprint1Test.php:161 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_prevents_self_deactivation` | backend/tests/Feature/Sprint1Test.php:164 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('SECRETARY')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('TREASURY')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('TEACHER')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('STUDENT')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('GUARDIAN')` | backend/tests/Feature/Sprint1Test.php:168 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_privilege_escalation_by_users_managers` | backend/tests/Feature/Sprint1Test.php:176 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_limits_institutional_access_and_validates_updates` | backend/tests/Feature/Sprint1Test.php:183 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_limits_role_catalogs_to_current_institution` | backend/tests/Feature/Sprint1Test.php:190 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_updates_role_permissions_and_protects_administrator_role` | backend/tests/Feature/Sprint1Test.php:197 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_updates_only_permitted_profile_fields` | backend/tests/Feature/Sprint1Test.php:203 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_isolates_audit_records` | backend/tests/Feature/Sprint1Test.php:208 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_fails_closed_without_an_institution_context` | backend/tests/Feature/Sprint1Test.php:214 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_prevents_reassigning_a_user_to_another_institution` | backend/tests/Feature/Sprint1Test.php:219 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_enforces_login_rate_limiting` | backend/tests/Feature/Sprint1Test.php:225 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_persists_institution_fields__enum_and_user_relationship` | backend/tests/Feature/Sprint1Test.php:233 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_enforces_unique_institution_codes_in_MySQL` | backend/tests/Feature/Sprint1Test.php:242 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_enforces_tenant_email_uniqueness_in_MySQL` | backend/tests/Feature/Sprint1Test.php:246 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_soft_deletes_institutions_and_denies_their_accounts` | backend/tests/Feature/Sprint1Test.php:250 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_obsolete_password_session_hashes` | backend/tests/Feature/Sprint1Test.php:256 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_keeps_permission_caches_isolated_between_two_authenticated_institutions` | backend/tests/Feature/Sprint1Test.php:260 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_delegated_permissions_the_actor_does_not_possess` | backend/tests/Feature/Sprint1Test.php:273 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rejects_institutional_writes_from_an_unprivileged_user` | backend/tests/Feature/Sprint1Test.php:282 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_requires_users_disable_to_change_account_status` | backend/tests/Feature/Sprint1Test.php:287 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_rolls_back_new_users_when_role_delegation_is_forbidden` | backend/tests/Feature/Sprint1Test.php:293 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_does_not_allow_anonymous_password_changes_or_logout` | backend/tests/Feature/Sprint1Test.php:299 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | ERROR |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('education-levels')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('sections')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_academic_fields#('subjects')` | backend/tests/Feature/Sprint2Test.php:71 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('academic-years')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('education-levels')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('sections')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_duplicates_in_the_proper_academic_scope#('subjects')` | backend/tests/Feature/Sprint2Test.php:75 | 1 | NOT_EXECUTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('academic-years')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('education-levels')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('sections')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_academic_status_and_rejects_tenant_injection#('subjects')` | backend/tests/Feature/Sprint2Test.php:80 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('academic-years')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('academic-periods')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('education-levels')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('sections')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_requires_authentication_for_academic_endpoints#('subjects')` | backend/tests/Feature/Sprint2Test.php:103 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_expose_academic_administration_to_other_roles#('GUARDIAN')` | backend/tests/Feature/Sprint2Test.php:125 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_expose_academic_administration_to_other_roles#('TREASURY')` | backend/tests/Feature/Sprint2Test.php:125 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_activating_a_year_makes_it_current_and_leaves_another_institution_unchanged` | backend/tests/Feature/Sprint2Test.php:148 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_enforces_single_current_year_with_a_MySQL_unique_constraint` | backend/tests/Feature/Sprint2Test.php:154 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-years', '2027-04-01', '2027-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-years', '2027-05-01', '2027-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-periods', '2026-04-01', '2026-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-periods', '2026-05-01', '2026-04-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-years', '2027-02-30', '2027-12-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_invalid_academic_date_intervals#('academic-periods', 'not-a-date', '2026-12-01')` | backend/tests/Feature/Sprint2Test.php:158 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_periods_outside_the_year#('2026-01-01', '2026-04-01')` | backend/tests/Feature/Sprint2Test.php:165 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_periods_outside_the_year#('2026-10-01', '2026-12-31')` | backend/tests/Feature/Sprint2Test.php:165 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_overlapping_and_shared_boundary_periods#('2026-04-01', '2026-06-01')` | backend/tests/Feature/Sprint2Test.php:169 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_overlapping_and_shared_boundary_periods#('2026-05-08', '2026-06-01')` | backend/tests/Feature/Sprint2Test.php:169 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_overlapping_and_shared_boundary_periods#('2026-03-02', '2026-12-18')` | backend/tests/Feature/Sprint2Test.php:169 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_allows_adjacent_non_overlapping_periods_but_not_duplicate_sequence` | backend/tests/Feature/Sprint2Test.php:173 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_shrink_a_year_beyond_its_periods` | backend/tests/Feature/Sprint2Test.php:179 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_closes_a_year_and_its_periods_and_rejects_new_academic_changes` | backend/tests/Feature/Sprint2Test.php:189 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_cannot_bypass_close_or_disable_permissions_through_status_fields#('academic-years', 'CLOSED')` | backend/tests/Feature/Sprint2Test.php:197 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_cannot_bypass_close_or_disable_permissions_through_status_fields#('academic-periods', 'CLOSED')` | backend/tests/Feature/Sprint2Test.php:197 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_cannot_bypass_close_or_disable_permissions_through_status_fields#('subjects', 'INACTIVE')` | backend/tests/Feature/Sprint2Test.php:197 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#(-1)` | backend/tests/Feature/Sprint2Test.php:209 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#(0)` | backend/tests/Feature/Sprint2Test.php:209 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#(2.5)` | backend/tests/Feature/Sprint2Test.php:209 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_validates_section_capacity#('many')` | backend/tests/Feature/Sprint2Test.php:209 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_accepts_nullable_capacity` | backend/tests/Feature/Sprint2Test.php:212 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_and_foreign_parent_relationships#('academic-periods', 'academic_year_id', 'year')` | backend/tests/Feature/Sprint2Test.php:215 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_and_foreign_parent_relationships#('grade-levels', 'education_level_id', 'level')` | backend/tests/Feature/Sprint2Test.php:215 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rejects_missing_and_foreign_parent_relationships#('sections', 'academic_year_id', 'year')` | backend/tests/Feature/Sprint2Test.php:215 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_disables_subjects_without_removing_history_and_audits_the_change` | backend/tests/Feature/Sprint2Test.php:225 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_searches_filters_paginates_and_orders_academic_lists` | backend/tests/Feature/Sprint2Test.php:234 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_allows_identical_grade_codes_under_different_education_levels` | backend/tests/Feature/Sprint2Test.php:243 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_does_not_reserve_section_names_globally` | backend/tests/Feature/Sprint2Test.php:248 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_soft_deletes_catalogs_without_freeing_historical_unique_codes` | backend/tests/Feature/Sprint2Test.php:253 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_rolls_back_academic_mutation_when_audit_persistence_fails` | backend/tests/Feature/Sprint2Test.php:259 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_reproduces_demo_data_without_duplicates_or_overwriting_edits` | backend/tests/Feature/Sprint2Test.php:275 | 4 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_editing_a_non_current_active_year_does_not_change_the_current_year` | backend/tests/Feature/Sprint2Test.php:287 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_audits_catalog_deactivation_as_disable#('education-levels')` | backend/tests/Feature/Sprint2Test.php:295 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_audits_catalog_deactivation_as_disable#('grade-levels')` | backend/tests/Feature/Sprint2Test.php:295 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint2Test::__pest_evaluable_it_audits_catalog_deactivation_as_disable#('sections')` | backend/tests/Feature/Sprint2Test.php:295 | 1 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_creates_a_hashed_account_and_person_atomically_with_the_fixed_role#('students')` | backend/tests/Feature/Sprint3Test.php:60 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_creates_a_hashed_account_and_person_atomically_with_the_fixed_role#('teachers')` | backend/tests/Feature/Sprint3Test.php:60 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_creates_a_hashed_account_and_person_atomically_with_the_fixed_role#('guardians')` | backend/tests/Feature/Sprint3Test.php:60 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_person_fields_and_a_secure_initial_password#dataset-sha256:726b1117e3ffe214c0d3bea81b3f2060d0a0c5b30baa68163530296f6b2eee55` | backend/tests/Feature/Sprint3Test.php:74 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_person_fields_and_a_secure_initial_password#dataset-sha256:1294204370f6a83b68885682f18c9c182b27d6ac2dcbe73cb9cd7b715e417b6f` | backend/tests/Feature/Sprint3Test.php:74 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_person_fields_and_a_secure_initial_password#dataset-sha256:4969769145cce4aa7f53f4b655f982d84ed10ea777eaa5e83cc7a852ed5c8bd6` | backend/tests/Feature/Sprint3Test.php:74 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_compatible_account_without_duplicating_or_modifying_it#('students')` | backend/tests/Feature/Sprint3Test.php:81 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_compatible_account_without_duplicating_or_modifying_it#('teachers')` | backend/tests/Feature/Sprint3Test.php:81 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_compatible_account_without_duplicating_or_modifying_it#('guardians')` | backend/tests/Feature/Sprint3Test.php:81 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_document_and_code_without_leaving_accounts#('students')` | backend/tests/Feature/Sprint3Test.php:95 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_document_and_code_without_leaving_accounts#('teachers')` | backend/tests/Feature/Sprint3Test.php:95 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_document_and_code_without_leaving_accounts#('guardians')` | backend/tests/Feature/Sprint3Test.php:95 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_missing_foreign_and_incompatible_accounts#('students')` | backend/tests/Feature/Sprint3Test.php:107 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_missing_foreign_and_incompatible_accounts#('teachers')` | backend/tests/Feature/Sprint3Test.php:107 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_missing_foreign_and_incompatible_accounts#('guardians')` | backend/tests/Feature/Sprint3Test.php:107 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_malicious_mass_assignment#('students')` | backend/tests/Feature/Sprint3Test.php:116 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_malicious_mass_assignment#('teachers')` | backend/tests/Feature/Sprint3Test.php:116 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_malicious_mass_assignment#('guardians')` | backend/tests/Feature/Sprint3Test.php:116 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reads_updates_and_disables_a_person_while_retaining_history#('students')` | backend/tests/Feature/Sprint3Test.php:123 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reads_updates_and_disables_a_person_while_retaining_history#('teachers')` | backend/tests/Feature/Sprint3Test.php:123 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reads_updates_and_disables_a_person_while_retaining_history#('guardians')` | backend/tests/Feature/Sprint3Test.php:123 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_isolates_person_lists_bindings_and_policies_by_institution#('students')` | backend/tests/Feature/Sprint3Test.php:135 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_isolates_person_lists_bindings_and_policies_by_institution#('teachers')` | backend/tests/Feature/Sprint3Test.php:135 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_isolates_person_lists_bindings_and_policies_by_institution#('guardians')` | backend/tests/Feature/Sprint3Test.php:135 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_allows_same_documents_and_codes_in_different_institutions#('students')` | backend/tests/Feature/Sprint3Test.php:144 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_allows_same_documents_and_codes_in_different_institutions#('teachers')` | backend/tests/Feature/Sprint3Test.php:144 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_allows_same_documents_and_codes_in_different_institutions#('guardians')` | backend/tests/Feature/Sprint3Test.php:144 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_protects_sensitive_state_transitions_from_secretary#('students')` | backend/tests/Feature/Sprint3Test.php:150 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_protects_sensitive_state_transitions_from_secretary#('teachers')` | backend/tests/Feature/Sprint3Test.php:150 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_protects_sensitive_state_transitions_from_secretary#('guardians')` | backend/tests/Feature/Sprint3Test.php:150 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_permits_secretary_onboarding_of_students_and_guardians_only#('students')` | backend/tests/Feature/Sprint3Test.php:163 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_permits_secretary_onboarding_of_students_and_guardians_only#('guardians')` | backend/tests/Feature/Sprint3Test.php:163 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_prevents_teacher_creation_by_secretary` | backend/tests/Feature/Sprint3Test.php:166 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_administrative_person_access_to_student_guardian_and_treasury#('STUDENT')` | backend/tests/Feature/Sprint3Test.php:169 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_administrative_person_access_to_student_guardian_and_treasury#('GUARDIAN')` | backend/tests/Feature/Sprint3Test.php:169 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_administrative_person_access_to_student_guardian_and_treasury#('TREASURY')` | backend/tests/Feature/Sprint3Test.php:169 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_limits_teacher_student_data_to_authorized_basic_information` | backend/tests/Feature/Sprint3Test.php:176 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_authentication_for_people` | backend/tests/Feature/Sprint3Test.php:183 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['2099-01-01'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['2020-02-30'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['2000-01-01'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('teachers', ['not-a-date'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['INVALID'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['BLOCKED'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('teachers', ['GRADUATED'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('guardians', ['ON_LEAVE'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('students', ['123'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('guardians', ['INVALID'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_validates_dates_document_format_and_state#('teachers', ['unsafe<script>'])` | backend/tests/Feature/Sprint3Test.php:191 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_accepts_supported_lifecycle_states#('students', 'GRADUATED')` | backend/tests/Feature/Sprint3Test.php:199 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_accepts_supported_lifecycle_states#('students', 'WITHDRAWN')` | backend/tests/Feature/Sprint3Test.php:199 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_accepts_supported_lifecycle_states#('teachers', 'ON_LEAVE')` | backend/tests/Feature/Sprint3Test.php:199 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_preserves_profile_roles_and_immutable_account_binding` | backend/tests/Feature/Sprint3Test.php:203 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_finds_compatible_accounts_but_not_foreign_or_privileged_accounts` | backend/tests/Feature/Sprint3Test.php:208 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_account_duplication_and_simultaneous_create_plus_reuse` | backend/tests/Feature/Sprint3Test.php:215 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_account_profile_and_assigned_role_when_auditing_fails#('students')` | backend/tests/Feature/Sprint3Test.php:221 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_account_profile_and_assigned_role_when_auditing_fails#('teachers')` | backend/tests/Feature/Sprint3Test.php:221 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_account_profile_and_assigned_role_when_auditing_fails#('guardians')` | backend/tests/Feature/Sprint3Test.php:221 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_retains_uniqueness_after_soft_deletion#('students')` | backend/tests/Feature/Sprint3Test.php:242 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_retains_uniqueness_after_soft_deletion#('teachers')` | backend/tests/Feature/Sprint3Test.php:242 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_retains_uniqueness_after_soft_deletion#('guardians')` | backend/tests/Feature/Sprint3Test.php:242 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_searches_filters_and_paginates_people` | backend/tests/Feature/Sprint3Test.php:251 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_duplicate_family_relationships_and_invalid_fields` | backend/tests/Feature/Sprint3Test.php:267 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_switches_the_single_primary_transactionally_and_supports_many_to_many_families` | backend/tests/Feature/Sprint3Test.php:277 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_enforces_single_primary_and_same_institution_with_database_constraints` | backend/tests/Feature/Sprint3Test.php:293 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rejects_cross_tenant_family_IDs_and_bindings` | backend/tests/Feature/Sprint3Test.php:305 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_detaches_only_the_relation_preserving_both_people_and_audit_history` | backend/tests/Feature/Sprint3Test.php:318 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_requires_family_management_permission` | backend/tests/Feature/Sprint3Test.php:332 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_restricts_profiles_and_family_queries_to_the_authenticated_account#('students')` | backend/tests/Feature/Sprint3Test.php:345 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_restricts_profiles_and_family_queries_to_the_authenticated_account#('teachers')` | backend/tests/Feature/Sprint3Test.php:345 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_restricts_profiles_and_family_queries_to_the_authenticated_account#('guardians')` | backend/tests/Feature/Sprint3Test.php:345 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_guardian_sees_only_linked_students_without_private_identity_fields` | backend/tests/Feature/Sprint3Test.php:354 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reproduces_fictitious_people_without_duplicating_accounts_or_relationships` | backend/tests/Feature/Sprint3Test.php:365 | 4 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_refuses_onboarding_a_role_with_permissions_the_operator_cannot_delegate` | backend/tests/Feature/Sprint3Test.php:373 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_does_not_reuse_a_blocked_account` | backend/tests/Feature/Sprint3Test.php:379 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_reuses_a_teacher_guardian_account_without_changing_its_roles` | backend/tests/Feature/Sprint3Test.php:387 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_rolls_back_primary_switch_when_relation_audit_fails` | backend/tests/Feature/Sprint3Test.php:404 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint3Test::__pest_evaluable_it_denies_association_to_inactive_guardians_without_losing_existing_links` | backend/tests/Feature/Sprint3Test.php:426 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_runs_correction_approval_cancellation_with_immutable_history_and_audit` | backend/tests/Feature/Sprint4Test.php:59 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('student_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('academic_year_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('grade_level_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_nonexistent_or_inconsistent_academic_references#('section_id')` | backend/tests/Feature/Sprint4Test.php:78 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rechecks_student_year_and_section_before_approval#('student')` | backend/tests/Feature/Sprint4Test.php:83 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rechecks_student_year_and_section_before_approval#('year')` | backend/tests/Feature/Sprint4Test.php:83 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rechecks_student_year_and_section_before_approval#('section')` | backend/tests/Feature/Sprint4Test.php:83 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_consumes_only_approved_capacity_and_releases_it_on_cancellation` | backend/tests/Feature/Sprint4Test.php:94 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_requires_correct_validated_payment_and_separates_secretary_from_treasury` | backend/tests/Feature/Sprint4Test.php:106 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_does_not_accept_another_students_payment_or_forged_paid_status` | backend/tests/Feature/Sprint4Test.php:122 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_isolates_foreign_enrollment_student_section_payment_and_history` | backend/tests/Feature/Sprint4Test.php:133 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_limits_student_guardian_and_teacher_access_and_minimal_treasury_lookup` | backend/tests/Feature/Sprint4Test.php:149 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rolls_back_enrollment_history_and_payment_validation_when_audit_fails` | backend/tests/Feature/Sprint4Test.php:170 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_a_pending_application_with_history_and_allows_a_fresh_application` | backend/tests/Feature/Sprint4Test.php:181 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_sections_from_another_year_or_grade_and_inactive_drafts` | backend/tests/Feature/Sprint4Test.php:196 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_enforces_duplicate_prevention_in_the_database_including_soft_deleted_active_rows` | backend/tests/Feature/Sprint4Test.php:208 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_allows_unlimited_capacity_and_rejects_zero_capacity` | backend/tests/Feature/Sprint4Test.php:217 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_short_payments_supports_overdue_validation_and_rolls_it_back_on_audit_failure` | backend/tests/Feature/Sprint4Test.php:225 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint4Test::__pest_evaluable_it_rejects_foreign_payment_references_and_cancelled_validation` | backend/tests/Feature/Sprint4Test.php:243 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_creates_assignments_and_rejects_equivalence_while_allowing_co_teachers` | backend/tests/Feature/Sprint5Test.php:56 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_rejects_missing_inactive_and_academically_inconsistent_assignment_references` | backend/tests/Feature/Sprint5Test.php:63 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_creates_activates_edits_and_closes_courses_with_audit_and_unique_codes` | backend/tests/Feature/Sprint5Test.php:75 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_requires_an_active_matching_assignment_and_prevents_detaching_active_teaching` | backend/tests/Feature/Sprint5Test.php:88 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_limits_teachers_to_assigned_courses_and_an_approved_minimal_roster` | backend/tests/Feature/Sprint5Test.php:100 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_derives_student_access_from_approved_enrollment_and_revokes_it_on_cancellation` | backend/tests/Feature/Sprint5Test.php:114 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_denies_students_without_approved_enrollment_or_in_another_section` | backend/tests/Feature/Sprint5Test.php:131 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_isolates_institution_references_course_queries_and_IDOR_writes` | backend/tests/Feature/Sprint5Test.php:145 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_authorizes_secretary_read_only_and_denies_treasury_guardian_and_unauthenticated_management` | backend/tests/Feature/Sprint5Test.php:161 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_rolls_back_course_and_audit_atomically` | backend/tests/Feature/Sprint5Test.php:175 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_validates_filters_pagination_and_protects_state_and_institution_fields` | backend/tests/Feature/Sprint5Test.php:180 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint5Test::__pest_evaluable_it_checks_live_academic_eligibility_on_activation_and_hides_inactive_courses_from_students` | backend/tests/Feature/Sprint5Test.php:187 | 6 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_lets_assigned_teachers_create_edit_publish_archive_units_with_ordered_uniqueness_and_audit` | backend/tests/Feature/Sprint6Test.php:56 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_requires_active_courses_for_publication_and_published_parent_units_for_materials` | backend/tests/Feature/Sprint6Test.php:69 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_creates_updates_and_publishes_link_and_text_materials_and_rejects_incomplete_payloads` | backend/tests/Feature/Sprint6Test.php:88 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_stores_files_privately_with_generated_names_and_authorizes_live_downloads` | backend/tests/Feature/Sprint6Test.php:101 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_rejects_executable_disguised_oversized_and_invalid_office_uploads_without_orphan_files` | backend/tests/Feature/Sprint6Test.php:114 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_shows_only_published_content_to_approved_students_and_denies_management` | backend/tests/Feature/Sprint6Test.php:129 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_denies_non_assigned_teachers_and_non_classroom_roles_with_current_permission_checks` | backend/tests/Feature/Sprint6Test.php:145 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_isolates_foreign_institutions_and_rejects_units_belonging_to_another_course` | backend/tests/Feature/Sprint6Test.php:165 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_rolls_back_metadata_audit_and_uploaded_files_together_on_failure` | backend/tests/Feature/Sprint6Test.php:182 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_preserves_material_history_and_audits_create_update_publish_archive_without_private_paths` | backend/tests/Feature/Sprint6Test.php:189 | 3 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_supports_multipart_file_replacement_and_hides_all_content_after_course_deactivation` | backend/tests/Feature/Sprint6Test.php:204 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint6Test::__pest_evaluable_it_paginates_ordered_units_and_material_filters_and_requires_authentication` | backend/tests/Feature/Sprint6Test.php:214 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_lets_assigned_teachers_manage_tasks_with_audited_publication_and_immutable_closure` | backend/tests/Feature/Sprint7Test.php:61 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_denies_other_teachers_and_isolates_assignment_assessment_and_unit_references` | backend/tests/Feature/Sprint7Test.php:74 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_shows_published_tasks_only_to_approved_students_and_blocks_foreign_submission_and_score_IDOR` | backend/tests/Feature/Sprint7Test.php:90 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_records_private_submissions_review_feedback_and_returned_attempts_without_overwriting_history` | backend/tests/Feature/Sprint7Test.php:114 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_enforces_deadlines_late_configuration_and_closed_tasks` | backend/tests/Feature/Sprint7Test.php:129 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_records_a_valid_score_only_for_approved_students_and_rejects_duplicates_and_non_teacher_grading` | backend/tests/Feature/Sprint7Test.php:139 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_rejects_scores_outside_zero_to_twenty_and_mismatched_academic_periods` | backend/tests/Feature/Sprint7Test.php:151 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_blocks_ordinary_grading_in_locked_periods_and_closed_assessments` | backend/tests/Feature/Sprint7Test.php:159 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_preserves_previous_scores_reason_and_actor_with_atomic_audit_rollback` | backend/tests/Feature/Sprint7Test.php:169 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint7Test::__pest_evaluable_it_rejects_unsafe_files_and_cleans_failed_uploads_while_respecting_revoked_enrollment` | backend/tests/Feature/Sprint7Test.php:183 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_allows_assigned_teachers_to_manage_unique_sessions_and_preserves_closure` | backend/tests/Feature/Sprint8Test.php:67 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_blocks_other_teachers_from_creating_reading_and_writing_course_attendance` | backend/tests/Feature/Sprint8Test.php:80 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_records_attendance_atomically_only_for_approved_roster_students` | backend/tests/Feature/Sprint8Test.php:88 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_rejects_duplicated_bulk_students_and_upserts_without_duplicate_records` | backend/tests/Feature/Sprint8Test.php:99 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_lets_linked_guardians_submit_one_safe_private_justification_with_history` | backend/tests/Feature/Sprint8Test.php:106 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_denies_unrelated_guardians_private_records_justification_history_and_files` | backend/tests/Feature/Sprint8Test.php:119 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_approves_after_review_atomically_including_closed_sessions_and_audit_rollback` | backend/tests/Feature/Sprint8Test.php:130 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_requires_rejection_reasons_and_keeps_rejected_absences_unchanged` | backend/tests/Feature/Sprint8Test.php:151 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_exposes_only_personal_historical_attendance_to_students_and_denies_writes` | backend/tests/Feature/Sprint8Test.php:159 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint8Test::__pest_evaluable_it_isolates_all_attendance_and_justification_references_between_institutions` | backend/tests/Feature/Sprint8Test.php:170 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_creates_student_owned_requests_with_unique_generated_codes_and_denies_impersonation` | backend/tests/Feature/Sprint9Test.php:64 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_allows_a_linked_guardian_to_create_and_consult_a_student_request` | backend/tests/Feature/Sprint9Test.php:78 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_denies_unrelated_guardians_creation_reading_editing_and_transitions` | backend/tests/Feature/Sprint9Test.php:85 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_observes_and_reopens_requests_with_owner_corrections_and_complete_history` | backend/tests/Feature/Sprint9Test.php:95 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_approves_completes_and_rejects_only_valid_transitions_with_atomic_notifications_and_history` | backend/tests/Feature/Sprint9Test.php:109 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_keeps_documents_private_and_issues_only_approved_linked_documents_to_the_correct_student` | backend/tests/Feature/Sprint9Test.php:131 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_deduplicates_overlapping_communication_targets_and_keeps_published_recipients_stable` | backend/tests/Feature/Sprint9Test.php:151 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_restricts_communications_to_recipients_and_protects_foreign_targets_and_management` | backend/tests/Feature/Sprint9Test.php:162 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_marks_only_owned_notifications_read_and_supports_unread_filters_and_mark_all` | backend/tests/Feature/Sprint9Test.php:172 | 5 | NOT_SELECTED |
| `P\Tests\Feature\Sprint9Test::__pest_evaluable_it_isolates_requests_documents_communications_and_notifications_between_institutions` | backend/tests/Feature/Sprint9Test.php:186 | 5 | NOT_SELECTED |

</details>

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.** Un caso aprobado no completa el objetivo de doce datasets; el error de vigencia permanece abierto, sin defectos funcionales confirmados en el backend ni correcciones funcionales aplicadas.


## Recuperación y diagnóstico complementario — 06/11/2026

Se continúa desde el cierre parcial anterior, sin reiniciar el trabajo ni descartar cambios. Rama test/integracion-misional. Se recuperaron los informes 28–31, el inventario, JUnit, métricas y código privado. Los 306 pins del intento original coincidieron; el launcher no estaba parcialmente escrito. La inspección inicial CIM no encontró mysqld ni listeners 3307/3308/8000/5173; el PID aislado estaba ausente. No se atribuye la interrupción de Internet a una causa de latencia sin evidencia.

Se conservó C31-01 aprobado (academic-years/campos obligatorios); C31-02 (academic-periods/campos obligatorios) mantiene su error histórico; C31-03 a C31-12 continúan no ejecutados. La lista privada de recuperación contiene solo los once sin aprobación, con IDs originales y los mismos fixtures/aserciones. C31-01 fue excluido y no se repitió. El prompt de continuación se agregó íntegro al archivo existente; ambos documentos previos se conservaron como prefijos y snapshots.

### Desglose de latencia: evidencia y límites

Se añadieron relojes monotónicos por componente sin registrar SQL, bindings, credenciales ni datos personales: configuración efectiva, espera del checker nativo, lectura de UUID, identidad SQL, TLS, grants, archivo de gate y conexión/negociación TLS. El checker mide enumeración WMI, TCP, archivos/hashes, tiempo de pared y CPU del propio proceso.

En el proceso diagnóstico 6888 (`prompt31r/diagnostic-run/metrics-6888.json`) se midieron 44 atestaciones de solo lectura:

| Componente | Total (ms) | Media por atestación (ms) |
| --- | ---: | ---: |
| Atestación completa | 4046,542 | 91,967 |
| Espera del checker nativo | 3353,458 | 76,215 |
| Configuración efectiva | 20,450 | 0,465 |
| Archivo UUID | 14,323 | 0,326 |
| Diagnóstico de identidad SQL | 243,765 | 5,540 |
| Diagnóstico de TLS SQL | 206,944 | 4,703 |
| Diagnóstico de grants SQL | 187,172 | 4,254 |
| Archivo/vigencia del gate | 17,138 | 0,390 |

La conexión TLS inicial consumió 9,127 ms y la configuración inicial 62,466 ms, una vez, fuera del total por operación. El checker representó aproximadamente 82,9% del tiempo de atestación; dentro de las 110 muestras del checker original, WMI promedió 67,443 ms, TCP 0,426 ms y archivos/hashes 11,733 ms (este último agregado incluye aperturas/hash iniciales de varios procesos). El tiempo de pared nativo medio fue 81,012 ms y su CPU propia 16,619 ms. La diferencia incluye espera y ejecución fuera de ese proceso; **no mide la CPU de WmiPrvSE ni demuestra espera de disco o antivirus**. Los tiempos SQL son cliente/política/transporte, no un perfil de CPU del motor.

Esto demuestra que la consulta repetida de procesos WMI domina la reproducción observada. **No permite repartir retrospectivamente los 104,969 segundos originales ni demostrar qué provocó su variación concreta**: antes no existía este desglose. En el intento histórico, 559 atestaciones pasaron de 65,233 a 104,969 segundos con iguales contadores SQL; sus relojes de pared/monotónico coincidían. No se halló evidencia de motores duplicados: siempre se exigieron monitor y worker propios. No se desactivó antivirus, cambió Windows, alteró prioridad ni atribuyó sin datos la demora a reinicio, Internet o disco.

### Variantes ensayadas y descartadas

Todas se prepararon en directorios nuevos; no sustituyen el ejecutor original. Las comprobaciones obligatorias se conservaron y cada lectura seguía contrastando identidad efectiva, procesos, comandos, creación/PID, listener, archivos bloqueados, TLS, grants y vigencia.

| Variante | Media original caliente (ms) | Media candidata caliente (ms) | Resultado |
| --- | ---: | ---: | --- |
| R: mismas consultas, opciones de enumeración WMI | 78,536 | 73,617 | Mejora pequeña; no adoptada |
| S: lista fresca local y consultas directas por PID | 71,141 | 92,772 | Más lenta; rechazada |
| T: mismo WQL/Get fresco, canal WMI conectado reutilizado | 73,972 | 70,007 | Mejora insuficiente; rechazada |

R comparó 40 muestras por variante secuencialmente; S/T compararon 40 por variante intercaladas para reducir sesgo de orden. En S/T se exigió antes de Pest una media candidata menor al 80% de la original y una estimación conservadora de 700 atestaciones más 15 segundos inferior a 100 s. Era un criterio previo de aceptación de rendimiento, no una modificación de la autorización. S/T no cumplieron la mejora exigida; sus estimaciones no resuelven la variación histórica y no se presentan como garantías. No se bajó el criterio a posteriori para forzar la reanudación.

La variante T conserva un canal WMI, no resultados: cada Get solicita datos nuevos. Sus pruebas negativas también aprobaron, pero al no resolver la latencia quedó descartada. No se adoptó ninguna optimización como corrección definitiva. La mejora efectiva de esta intervención es observabilidad y bloqueo explícito antes de Pest; **la latencia continúa sin solución validada**. Se decidió detenerse antes de introducir mecanismos más complejos o reducir cobertura de seguridad.

### Seguridad y ausencia de nuevas ejecuciones

Las copias R/S/T aprobaron los 13 controles offline de vigencia/configuración/TLS/SQL prohibido, sin conexiones de escritura; se conservaron los originales. Antes de considerar Pest se obtuvo paridad de pruebas nativas con el verificador PowerShell. S/T contrastaron además respuestas de los checkers antiguo/candidato y cinco tokens deliberadamente inválidos: vencido, PID erróneo, creación errónea, hash de configuración erróneo y hash de CA erróneo. Ambos verificadores rechazaron cada uno (diez rechazos por variante). Se restauraron los bytes originales del gate, sin ampliar su edad. Durante estas negativas no hubo transacción activa ni SQL. No se guardaron decisiones de autorización para aceptarlas permanentemente.

Los tokens negativos no fueron nuevas autorizaciones válidas. La expiración sigue rechazándose; el límite sigue en **120 segundos**. No se renovaron gates dentro de una transacción. Se preservaron los checks del mismo PDO/CONNECTION_ID y la prohibición de reconexión, DML fuera de transacción, DELETE y DDL. Los tres ensayos fueron solo lectura: cero BEGIN/DML/Pest. S/T devolvieron salida de supervisor 1 por la condición de rendimiento; **no son errores de un testcase nuevo**. El mensaje heredado 'Direct checker validation failed' identifica ese corte; direct-validation.json distingue seguridad aprobada y performanceAcceptance=false.

No se consumió el único reintento condicionado autorizado para C31-02: la causa no quedó resuelta y no se cumplió la fase previa. Tampoco se ejecutaron los diez casos nuevos. Los once quedan sin aprobación. No se declaran verificados rollbacks nuevos inexistentes: los dos rollbacks acreditados pertenecen al intento original, con la limitación ya documentada del comprobante de cierre del segundo.

| Grupo | Total original | Aprobados finales | Errores históricos no resueltos | Sin ejecutar | Aserciones acreditadas |
| --- | ---: | ---: | ---: | ---: | ---: |
| Campos obligatorios | 6 | 1 | 1 | 4 | 4 |
| Duplicados académicos | 6 | 0 | 0 | 6 | 0 |

Recuperación actual: **0 casos Pest ejecutados, 0 nuevos aprobados y 0 nuevas aserciones acreditadas**. Acumulado conservado: **29 casos distintos aprobados, 211 aserciones acreditadas y 285 pendientes de aprobación**. No se repitió el aprobado ni se sumaron ensayos del supervisor como tests. recovery-summary31.json e inventory-remaining.json en prompt31t registran esa continuidad.

### Inspección final independiente y cierre

Los ensayos S/T cerraron MySQL al fallar el prerrequisito, antes de sus pasos SQL posteriores. Esta limitación no se oculta: se realizó una fase U separada, **exclusivamente de lectura**, con inspecciones completas antes/después y negativas de aislamiento, sin benchmark ni posibilidad de ejecutar Pest en su supervisor.

`prompt31u/final-run/after.stdout.json`: SCHEMA_AND_COUNTS_PRESERVED; 52 tablas, 14 migraciones y 0 filas fuera del repositorio de migraciones. Esquema completo igual al baseline, tablas InnoDB, claves/índices/reglas/triggers sin cambios; migrations conserva 14 filas y las 51 tablas de aplicación cero. No se confunde igualdad lógica con identidad binaria de InnoDB o contadores autoincrementales.

Se verificaron versión 8.4.11, 127.0.0.1:3308, zarate_pest, cuenta exclusiva, UUID/directorio, mismo PDO, TLS estricto y grants originales exactos. Las negativas iniciales/finales de U obtuvieron denegación real MySQL 1044 a zarate_dev/zarate_test, sin escrituras. No se modificaron usuarios, contraseñas, privilegios, datos protegidos, migraciones o servicios de demostración.

Cierre U: worker exit 0, shutdownComplete=true, errores MySQL 0, procesos 0, PID ausente true. Aviso 1: CA privada autofirmada, con verificación TLS activa. Comprobación posterior: 0 conexiones 3308, 0 listeners y 0 procesos. El monitor se cerró mediante la señal al árbol propio. No se detuvo ningún servicio de demostración.

### Archivos y siguientes pasos

Actualizados únicamente los dos documentos existentes de Prompt 31, por anexos. Nuevos privados: Recover31Build.php, Recover31DiagnosticSetup.php, Recover31DirectBuild.php, Recover31CachedBuild.php, RecoveryFinalCheck31.php, RecordRecovery31.php, RecoverySummary31.php, RecoveryAudit31.php y RecoveryClose31.php; variantes/mediciones en prompt31r, prompt31s y prompt31t; inspección final en prompt31u. Los ejecutores experimentales **no están aprobados para reanudar Pest**; las marcas de lanzamiento existentes impiden un reintento automático. recovery-preservation-audit.json verifica los pins, 58 documentos anteriores sin cambios, prefijos de los dos actualizados, resultados originales retenidos y ausencia de la credencial privada/APP_KEY en salidas. El prompt de continuación queda literal. git diff --check se registra al final. No se modificó código funcional, backend/frontend, migraciones, roles, permisos o configuración de desarrollo; no hubo commits ni push.

No estamos listos para ampliar lotes Pest. El paso siguiente requiere una corrección demostrable del componente WMI o un diseño de verificación equivalente, validado con controles negativos y sin caches de decisiones, sin aumentar TTL ni omitir comprobaciones. Hasta entonces no se recomienda gastar el reintento de C31-02 ni ejecutar los diez pendientes. Los lotes de veinte/cuarenta casos siguen sin habilitarse.

**C. BLOQUEADO POR LATENCIA O ENTORNO.** Se completó el diagnóstico y la recuperación documental, pero no el objetivo de doce casos aprobados. Ningún defecto funcional nuevo fue confirmado y ninguna corrección de rendimiento quedó validada para Pest.

Nota de auditoría: el primer lector de preservación apuntó por error al manifest de resultados retenidos en prompt31s, cuando estaba en prompt31t. Falló antes de emitir una auditoría válida; se corrigió únicamente esa ruta y se repitió la lectura de hashes, sin SQL ni Pest. La auditoría válida comprobó 418 pins, 58 documentos anteriores y 78 archivos del intento original, con cero diferencias; confirmó ambos prefijos documentales conservados, continuación literal y cero exposiciones de la credencial/APP_KEY. El error y la corrección se registran en `prompt31u/audit-loader-history.json`.


## Anexo de reanudación mediante Prompt 32 — 06/11/2026

Se conserva íntegro el historial anterior. Tras benchmarks, paridad completa y negativas, el checker privado obtuvo propiedades mediante APIs nativas sin aumentar TTL ni eliminar predicados. Los once casos sin aprobación se reanudaron; C31-01 no se repitió. El error de C31-02 queda histórico; su reintento se cuenta una sola vez como caso aprobado.

Resultado actual: 12/12 casos P31 aprobados, 42 aserciones del lote; 11 casos y 38 aserciones adicionales en P32. Acumulado: 40 distintos aprobados, 249 aserciones y 274 pendientes. JUnit, métricas, once rollbacks nuevos e inspecciones antes/después: `.tools/misional-isolated/evidence/prompt32/run`. Estado final: 52 tablas, 14 migraciones y cero residuos; TLS e aislamiento comprobados y servidor cerrado. Limitaciones y API interna: evidencias-optimizacion-verificador-wmi.md. Sin cambios funcionales, commits ni push.

**A. PROMPT 31 COMPLETADO — 12 CASOS APROBADOS.**
