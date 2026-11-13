# Prompt Maestro 36 — Validación integral misional

Fecha: 06/11/2026, America/Lima. Rama: `test/integracion-misional`.

## Estado inicial recuperado

Prompt 35 finalizado y verificable: 18/18 aprobados nuevos, 158 aserciones, 18 rollbacks y cero residuos; 52 tablas y 14 migraciones conservadas; worker MySQL cerrado y cero listeners/procesos posteriores. Se revisó su informe completo, summary35.json, 18 JUnit, inspecciones, negativo final, result.json y auditorías. El acumulado inicial correcto es **124 casos distintos / 765 aserciones / 190 pendientes**, no las cifras previas al Prompt 35. Los 124 JUnit anteriores se contrastaron sin repetirlos. No hay operación SQL parcial documentada pendiente.

Git conserva modificaciones anteriores, incluidos evidencias-finalizacion-migraciones.md y documentos sin seguimiento. No se usa reset/clean, commit ni push. Las herramientas privadas son ignoradas por Git; no se modifican backend/frontend funcional, tests/factories originales, migraciones, credenciales/grants o configuración de desarrollo. Se conserva la autorización expresa de zarate_pest frente al destino histórico de backend/AGENTS.md, sin editar ese archivo.

## 1. Matrículas

Se conserva el cierre de Prompt 35 y sus 18 casos: no son casos nuevos del Prompt 36. Los dos pendientes de Sprint4Test permanecen C: ciclo con forceDelete esperado-rechazado e índice/duplicidad tras soft delete. Análisis y condiciones de autorización futura: evidencias-matriculas-pest.md. No se habilitan ahora. Cobertura histórica parcial; ciclo completo de observación/inmutabilidad específica/soft delete no acreditados. Estado inicial: **B. VALIDACIÓN PARCIAL CON CASOS PENDIENTES**.

## 2. Aula Virtual y enseñanza-aprendizaje

Primer lote: 19 casos nuevos existentes de Sprint5/Sprint6 y escenarios de tareas de Sprint7. Se revisaron hooks DatabaseTransactions, TeachingService/TeachingService::KEYS, CourseAccess y factories TeacherAssignment/Course/Enrollment, ClassroomService y ramas MaterialFiles, LearningService/LearningAccess/SubmissionService. Relaciones: matrícula APPROVED de sección/año deriva acceso al curso; cancelación revoca acceso vigente; contenido borrador se diferencia del publicado. No se presupone que un nombre de test acredite todas sus palabras.

Se excluyen llamadas forceDelete/delete, revokePermissionTo (DELETE en pivote) y escenarios de archivos. Caso de curso cerrado con auditoría/forceDelete queda pendiente íntegro, sin suprimir su última aserción. Enlaces HTTP de material TEXT/LINK se almacenan/validan; el servicio no visita esos enlaces.

## 3. Evaluaciones

Cinco casos nuevos de Sprint7: referencias/aislamiento, registro de nota para matrícula aprobada, escala/periodos, bloqueo de periodo/evaluación cerrada, historial/actor/motivo y rollback de auditoría. ScoreService conserva transacciones/savepoints, permisos del docente, matrícula y restricciones de publicación/grading_open. No se cambia la regla de publicación ni se interpreta historial de cambios de una nota como expediente longitudinal. No se inventa una prueba de consulta familiar que no exista.

## 4. Asistencia

Nueve casos nuevos de Sprint8, excluyendo el caso de justificación con upload/download. Se revisaron AttendanceService/AttendanceAccess/JustificationService: sesiones, registros de lista aprobada, upsert y duplicidad, justificaciones textuales, revisión/resolución, auditoría y consultas propias/familiares. Las ramas con archivo no son alcanzadas por los payloads textuales seleccionados. No se acredita subida de sustento.

## 5. Comunicaciones y solicitudes

Seis casos nuevos de Sprint9 compatibles: solicitudes propias/familiares, rechazo de apoderados ajenos, observación/corrección, resolución, notificaciones y lectura. OfficeNotifications::send usa notifyNow; OfficeNotification::via devuelve únicamente database, sin correo ni cola externa. RequestService realiza INSERT/UPDATE y transiciones transaccionales sobre el mismo PDO.

Los casos que llaman a CommunicationService::save permanecen C: targets()->delete() se ejecuta incluso al crear un comunicado con destinos vacíos. No se suprime ese DELETE ni se amplía el guard. El caso de documentos con archivos queda pendiente. Por tanto aprobar solicitudes/notificaciones no equivale a validar publicación de comunicados.

## 6. Seguridad y regresión transversal

Se mantiene host 127.0.0.1, puerto 3308, base zarate_pest, cuenta exclusiva existente, TLS CA/IP, APP_ENV testing, UUID/datadir, grants, mismo PDO/CONNECTION_ID y prohibición de reconexión. TTL 120 segundos sin ampliación/renovación en transacción; gate fresco tras inspección y antes de cada caso. Identidad efectiva desde PHP y negativas de bases protegidas antes/después; no se consultan datos institucionales. No se cambian servicios de demostración 3307/8000/5173 ni Windows.

Checker nativo del Prompt 32 conservado: predicados de nombre/PID/padre/ruta/argumentos/creación, listener y archivos bloqueados. Windows x64 actual exige revalidación por ejecución y falla cerrado ante información incompleta. Se distinguen benchmark/harness/denegaciones auxiliares de Pest.

La selección transversal restante de autenticación, permisos y dependencias se prepara después de los módulos, con revisión individual de DELETE indirecto (syncRoles/syncPermissions), demo, archivos y efectos. No se habilita toda la suite por pertenecer a un archivo. Los inventarios distinguen B admitidos, C bloqueados y pendientes aún no admitidos; no se presume seguridad por el nombre.

### Storage::fake en hooks sin adjuntos

Se revisó Laravel Storage::fake: llama a cleanDirectory sobre storage_path('framework/testing/disks/materials'). El adapter fija storage-pest36, raíz privada nueva y separada de desarrollo. Storage36::emptyFake36 verifica ausencia de TEST_TOKEN, raíz canónica, sin enlaces y **cero entradas** antes de fixtures y tras rollback. El hook original no cambia: cleanDirectory solo encuentra raíz ausente/vacía en los casos admitidos, sin archivos previos que borrar. Hay recibos fake-storage-PID-before-fixtures/after-rollback.json. No se permite considerar que SQL rollback limpie archivos. Upload/reemplazo/download con datos siguen C; no se usan archivos privados existentes ni se instala nada.

### Lotes y checkpoints

Primer lote de 39 casos revisados, grupos de hasta cuatro y límites de grupo al cambiar módulo. No es un límite global: se continuará con la regresión segura revisada. Cada caso requiere filtro exacto, JUnit aprobado, BEGIN/ROLLBACK raíz, limpieza misma conexión, inspección externa de esquema/conteos y margen gate. A 100 segundos de edad observada se detiene avance para revisar margen; TTL real sigue 120. Checkpoint36.php guarda IDs/aserciones/próximo caso tras cada grupo sin sobrescribir checkpoints anteriores y agrega actualización al informe. No hay paralelismo ni reintentos automáticos. Cualquier bloqueo global suspende escrituras; un fallo individual se diagnostica antes de admitir otra ejecución.

## 7. Incidencias

Antes de SQL: el generador privado tuvo un error de sintaxis de comillas al insertar el checkpoint de PowerShell; se corrigió y se validó el generador. Algunas búsquedas de rutas se corrigieron para usar la sintaxis de PowerShell/rg adecuada. No fueron ejecuciones Pest ni defectos funcionales. Todos los errores históricos permanecen en sus documentos previos. Las incidencias nuevas se añadirán con JUnit, causa y rollback, sin alterar aserciones.

## 8. Pruebas pendientes e inventario único

Inventario inicial privado: inventory-initial-190.json. Clasificación por ID/módulo/razón: inventory-classification.json. Primer lote admitido: cases.json, 39 IDs distintos (19 Aula, 5 evaluaciones, 9 asistencia, 6 solicitudes). Quedan sin admitir casos con DELETE/forceDelete, sincronización destructiva de pivotes, demo, archivos y módulos/dependencias todavía no revisados. Se actualizará el inventario solo descontando aprobaciones JUnit con aislamiento comprobado. Los bloqueados siguen pendientes, no son aprobados ni defectos demostrados.

## 9. Resultados acumulados y evidencias

Inicio acreditado 124/765; no se anticipa resultado del Prompt 36. Por caso se conservan JUnit, métricas, efectos, runtime identity, rollback limpio, storage vacío y pre/post esquema/conteos; por grupo, group-N.json y checkpoint-NNNN.json. El esquema esperado sigue 52 tablas InnoDB, 14 migrations, cero triggers y 51 tablas de aplicación vacías. No se confunde igualdad lógica con identidad binaria de datos/autoincrementos.

Públicos creados: este informe y prompt-36-validacion-integral-misional.md (literal). Privados: Build36/Reports36/Checkpoint36/Summary36/Audit36 y perfil/wrappers/checker/mirrors de prompt36, sin exponer secretos. Auditoría final contrastará pins, documentos anteriores, 124 JUnit previos y posible exposición de credencial/APP_KEY; git status y diff --check se registrarán al cierre. Sin commits/push.

## 10. Preparación de Cypress

Pendiente de revisión tras Pest. No se ejecuta Cypress sobre desarrollo ni se utilizan cuentas demo. Se identificarán specs, API simulada frente a backend real, fixtures, URLs/puertos alternativos y operaciones de setup/limpieza, antes de afirmar aislamiento. Un servidor HTTP de integración necesitaría un perfil/guardas y fixtures propios, distinto del launcher transaccional Pest; no se presupone que levantar Vite o cambiar baseUrl garantice seguridad. No se ampliará autorización para escrituras/limpieza no revisadas.

## Selección inicial por caso

| Caso | Grupo | Módulo | Fuente | Nombre original | Dataset |
| --- | ---: | --- | --- | --- | --- |
| C36-01 | 1 | Aula Virtual | Sprint5Test.php | creates assignments and rejects equivalence while allowing co teachers | `` |
| C36-02 | 1 | Aula Virtual | Sprint5Test.php | rejects missing inactive and academically inconsistent assignment references | `` |
| C36-03 | 1 | Aula Virtual | Sprint5Test.php | requires an active matching assignment and prevents detaching active teaching | `` |
| C36-04 | 1 | Aula Virtual | Sprint5Test.php | limits teachers to assigned courses and an approved minimal roster | `` |
| C36-05 | 2 | Aula Virtual | Sprint5Test.php | derives student access from approved enrollment and revokes it on cancellation | `` |
| C36-06 | 2 | Aula Virtual | Sprint5Test.php | denies students without approved enrollment or in another section | `` |
| C36-07 | 2 | Aula Virtual | Sprint5Test.php | isolates institution references course queries and IDOR writes | `` |
| C36-08 | 2 | Aula Virtual | Sprint5Test.php | authorizes secretary read only and denies treasury guardian and unauthenticated management | `` |
| C36-09 | 3 | Aula Virtual | Sprint5Test.php | rolls back course and audit atomically | `` |
| C36-10 | 3 | Aula Virtual | Sprint5Test.php | validates filters pagination and protects state and institution fields | `` |
| C36-11 | 3 | Aula Virtual | Sprint5Test.php | checks live academic eligibility on activation and hides inactive courses from students | `` |
| C36-12 | 3 | Aula Virtual | Sprint6Test.php | lets assigned teachers create edit publish archive units with ordered uniqueness and audit | `` |
| C36-13 | 4 | Aula Virtual | Sprint6Test.php | creates updates and publishes link and text materials and rejects incomplete payloads | `` |
| C36-14 | 4 | Aula Virtual | Sprint6Test.php | shows only published content to approved students and denies management | `` |
| C36-15 | 4 | Aula Virtual | Sprint6Test.php | isolates foreign institutions and rejects units belonging to another course | `` |
| C36-16 | 4 | Aula Virtual | Sprint6Test.php | paginates ordered units and material filters and requires authentication | `` |
| C36-17 | 5 | Aula Virtual | Sprint7Test.php | lets assigned teachers manage tasks with audited publication and immutable closure | `` |
| C36-18 | 5 | Aula Virtual | Sprint7Test.php | shows published tasks only to approved students and blocks foreign submission and score IDOR | `` |
| C36-19 | 5 | Aula Virtual | Sprint7Test.php | enforces deadlines late configuration and closed tasks | `` |
| C36-20 | 6 | Evaluaciones | Sprint7Test.php | denies other teachers and isolates assignment assessment and unit references | `` |
| C36-21 | 6 | Evaluaciones | Sprint7Test.php | records a valid score only for approved students and rejects duplicates and non teacher grading | `` |
| C36-22 | 6 | Evaluaciones | Sprint7Test.php | rejects scores outside zero to twenty and mismatched academic periods | `` |
| C36-23 | 6 | Evaluaciones | Sprint7Test.php | blocks ordinary grading in locked periods and closed assessments | `` |
| C36-24 | 7 | Evaluaciones | Sprint7Test.php | preserves previous scores reason and actor with atomic audit rollback | `` |
| C36-25 | 8 | Asistencia | Sprint8Test.php | allows assigned teachers to manage unique sessions and preserves closure | `` |
| C36-26 | 8 | Asistencia | Sprint8Test.php | blocks other teachers from creating reading and writing course attendance | `` |
| C36-27 | 8 | Asistencia | Sprint8Test.php | records attendance atomically only for approved roster students | `` |
| C36-28 | 8 | Asistencia | Sprint8Test.php | rejects duplicated bulk students and upserts without duplicate records | `` |
| C36-29 | 9 | Asistencia | Sprint8Test.php | denies unrelated guardians private records justification history and files | `` |
| C36-30 | 9 | Asistencia | Sprint8Test.php | approves after review atomically including closed sessions and audit rollback | `` |
| C36-31 | 9 | Asistencia | Sprint8Test.php | requires rejection reasons and keeps rejected absences unchanged | `` |
| C36-32 | 9 | Asistencia | Sprint8Test.php | exposes only personal historical attendance to students and denies writes | `` |
| C36-33 | 10 | Asistencia | Sprint8Test.php | isolates all attendance and justification references between institutions | `` |
| C36-34 | 11 | Comunicaciones | Sprint9Test.php | creates student owned requests with unique generated codes and denies impersonation | `` |
| C36-35 | 11 | Comunicaciones | Sprint9Test.php | allows a linked guardian to create and consult a student request | `` |
| C36-36 | 11 | Comunicaciones | Sprint9Test.php | denies unrelated guardians creation reading editing and transitions | `` |
| C36-37 | 11 | Comunicaciones | Sprint9Test.php | observes and reopens requests with owner corrections and complete history | `` |
| C36-38 | 12 | Comunicaciones | Sprint9Test.php | approves completes and rejects only valid transitions with atomic notifications and history | `` |
| C36-39 | 12 | Comunicaciones | Sprint9Test.php | marks only owned notifications read and supports unread filters and mark all | `` |

### Checkpoint 4 casos nuevos — 2026-11-06T18:27:49+00:00

- Aula Virtual: 4 aprobados nuevos.

Aserciones nuevas: 59. Acumulado: 128 distintos / 824 aserciones. Pendientes: 186. Próximo: C36-05 derives student access from approved enrollment and revokes it on cancellation. Evidencia privada: checkpoint-0004.json. No es una declaración de cierre integral.

### Checkpoint 8 casos nuevos — 2026-11-06T18:31:25+00:00

- Aula Virtual: 8 aprobados nuevos.

Aserciones nuevas: 109. Acumulado: 132 distintos / 874 aserciones. Pendientes: 182. Próximo: C36-09 rolls back course and audit atomically. Evidencia privada: checkpoint-0008.json. No es una declaración de cierre integral.

### Checkpoint 12 casos nuevos — 2026-11-06T18:34:19+00:00

- Aula Virtual: 12 aprobados nuevos.

Aserciones nuevas: 139. Acumulado: 136 distintos / 904 aserciones. Pendientes: 178. Próximo: C36-13 creates updates and publishes link and text materials and rejects incomplete payloads. Evidencia privada: checkpoint-0012.json. No es una declaración de cierre integral.

### Checkpoint 16 casos nuevos — 2026-11-06T19:30:07+00:00

- Aula Virtual: 16 aprobados nuevos.

Aserciones nuevas: 186. Acumulado: 140 distintos / 951 aserciones. Pendientes: 174. Próximo: C36-17 lets assigned teachers manage tasks with audited publication and immutable closure. Evidencia privada: checkpoint-0016.json. No es una declaración de cierre integral.

### Checkpoint 19 casos nuevos — 2026-11-06T19:32:33+00:00

- Aula Virtual: 19 aprobados nuevos.

Aserciones nuevas: 221. Acumulado: 143 distintos / 986 aserciones. Pendientes: 171. Próximo: C36-20 denies other teachers and isolates assignment assessment and unit references. Evidencia privada: checkpoint-0019.json. No es una declaración de cierre integral.

### Checkpoint 23 casos nuevos — 2026-11-06T19:35:56+00:00

- Aula Virtual: 19 aprobados nuevos.
- Evaluaciones: 4 aprobados nuevos.

Aserciones nuevas: 249. Acumulado: 147 distintos / 1014 aserciones. Pendientes: 167. Próximo: C36-24 preserves previous scores reason and actor with atomic audit rollback. Evidencia privada: checkpoint-0023.json. No es una declaración de cierre integral.

### Checkpoint 24 casos nuevos — 2026-11-06T19:36:42+00:00

- Aula Virtual: 19 aprobados nuevos.
- Evaluaciones: 5 aprobados nuevos.

Aserciones nuevas: 263. Acumulado: 148 distintos / 1028 aserciones. Pendientes: 166. Próximo: C36-25 allows assigned teachers to manage unique sessions and preserves closure. Evidencia privada: checkpoint-0024.json. No es una declaración de cierre integral.

### Checkpoint 28 casos nuevos — 2026-11-06T19:39:48+00:00

- Aula Virtual: 19 aprobados nuevos.
- Evaluaciones: 5 aprobados nuevos.
- Asistencia: 4 aprobados nuevos.

Aserciones nuevas: 294. Acumulado: 152 distintos / 1059 aserciones. Pendientes: 162. Próximo: C36-29 denies unrelated guardians private records justification history and files. Evidencia privada: checkpoint-0028.json. No es una declaración de cierre integral.

### Checkpoint 32 casos nuevos — 2026-11-06T19:43:19+00:00

- Aula Virtual: 19 aprobados nuevos.
- Evaluaciones: 5 aprobados nuevos.
- Asistencia: 8 aprobados nuevos.

Aserciones nuevas: 338. Acumulado: 156 distintos / 1103 aserciones. Pendientes: 158. Próximo: C36-33 isolates all attendance and justification references between institutions. Evidencia privada: checkpoint-0032.json. No es una declaración de cierre integral.

### Checkpoint 33 casos nuevos — 2026-11-06T19:44:29+00:00

- Aula Virtual: 19 aprobados nuevos.
- Evaluaciones: 5 aprobados nuevos.
- Asistencia: 9 aprobados nuevos.

Aserciones nuevas: 348. Acumulado: 157 distintos / 1113 aserciones. Pendientes: 157. Próximo: C36-34 creates student owned requests with unique generated codes and denies impersonation. Evidencia privada: checkpoint-0033.json. No es una declaración de cierre integral.

### Checkpoint 37 casos nuevos — 2026-11-06T19:47:50+00:00

- Aula Virtual: 19 aprobados nuevos.
- Evaluaciones: 5 aprobados nuevos.
- Asistencia: 9 aprobados nuevos.
- Comunicaciones: 4 aprobados nuevos.

Aserciones nuevas: 385. Acumulado: 161 distintos / 1150 aserciones. Pendientes: 153. Próximo: C36-38 approves completes and rejects only valid transitions with atomic notifications and history. Evidencia privada: checkpoint-0037.json. No es una declaración de cierre integral.

### Checkpoint 39 casos nuevos — 2026-11-06T19:49:38+00:00

- Aula Virtual: 19 aprobados nuevos.
- Evaluaciones: 5 aprobados nuevos.
- Asistencia: 9 aprobados nuevos.
- Comunicaciones: 6 aprobados nuevos.

Aserciones nuevas: 416. Acumulado: 163 distintos / 1181 aserciones. Pendientes: 151. Próximo: primer lote de módulos terminado; revisar regresión transversal. Evidencia privada: checkpoint-0039.json. No es una declaración de cierre integral.

## Recuperación tras límite de uso — 06/11/2026

El usuario informó interrupción por límite de uso y autorizó continuar desde evidencia verificable. El supervisor anterior siguió en segundo plano: se recuperaron **39/39 casos aprobados**, 416 aserciones y 39 rollbacks/inspecciones limpias, no solo los seis previamente comunicados. No se repite ninguno. Checkpoint0039 acredita 19 Aula / 5 evaluaciones / 9 asistencia / 6 solicitudes. Acumulado recuperado **163 distintos / 1181 aserciones / 151 pendientes**. Summary36, los 39 JUnit, effects/clean/fake-storage, snapshots pre/post, group/checkpoint y cierre se revisaron.

El supervisor terminó con exit 0, worker 0, shutdown completo, cero errores MySQL, PID ausente, cero procesos y conexiones 3308 en result.json. No hay una transacción incompleta documentada. La inspección de procesos se realiza sin detener procesos desconocidos ni lanzar duplicados. Antes de ejecutar regresión se requiere nuevo preflight y snapshots reales, con TLS, identidad, guardas y versión Windows actuales. No se usa un gate antiguo como autorización vigente.

Descubrimiento de regresión aún sin ejecutar fixtures ni SQL: intento inicial se detuvo en filtro11 (auth/me); el segundo se detuvo en filtro49. Este último reconstruía un nombre desde un identificador normalizado y perdió la coma de `persists institution fields, enum and user relationship`. Se conserva el resultado vacío y se corrige solo nombre/filtro privado. El segundo intento también emitió un aviso al guardar el recibo offline porque un reemplazo demasiado amplio alteró la cadena de ruta del bootstrap; no se abrió conexión ni se ejecutó caso. El tercer intento usa prefijos nuevos de resultados y conserva intactos los intentos anteriores. Las aserciones, fixtures y guardas de selección clase/método/dataset no cambian.

El prompt maestro conserva íntegro su texto original y agrega íntegra esta continuación; prompt-continuation-contract.json registra los hashes separados y combinados. Las evidencias previas permanecen intactas. Los 113 candidatos no se declaran ejecutados/aprobados hasta completar descubrimiento y revisión, y acreditar cada ejecución JUnit/rollback.

## Cierre recuperado del primer lote de módulos

| Módulo | Nuevos aprobados | Fallidos/errores | Aserciones | Rollbacks verificados | Último caso / checkpoint |
| --- | ---: | ---: | ---: | ---: | --- |
| Aula Virtual | 19 | 0 | 221 | 19 | C36-19 / checkpoint-0019.json |
| Evaluaciones | 5 | 0 | 42 | 5 | C36-24 / checkpoint-0024.json |
| Asistencia | 9 | 0 | 85 | 9 | C36-33 / checkpoint-0033.json |
| Comunicaciones | 6 | 0 | 68 | 6 | C36-39 / checkpoint-0039.json |

Los 39 cases tienen BEGIN/ROLLBACK raíz, recibo de misma conexión limpia, root fake vacío y snapshot externo post-case que conserva 52 tablas/14 migrations/cero residuos. La edad máxima del gate fue 53,026 s, margen mínimo 66,974 s. Checker original 68,344 ms; nativo 14,792 ms, con paridad/negativas aprobadas. No se observó expiración ni reintento. La primera auditoría recuperada aprobó 1149 pins, 68 documentos anteriores y 124 JUnit previos, con cero cambios/exposiciones detectadas y literalidad del prompt original más continuación. La admisión posterior volvió a comprobar 163 JUnit / 1181 aserciones, sin ejecutarlos.

Matrículas no añade casos: se mantienen los dos C del Prompt35. Aula/Asistencia/Comunicaciones tienen escenarios críticos de archivos o DELETE pendientes, por lo que sus módulos siguen B aunque el alcance ejecutado haya aprobado. Evaluaciones tiene cinco casos aprobados en el alcance ejecutado (A), sin atribuir cobertura de consulta familiar ni expediente longitudinal inexistente en estos tests. Las asignaciones de módulos son exclusivas para contar; al consolidar bloqueos se normaliza que los dos casos de archivos de entregas de Sprint7 pertenecen a Aula, no a Evaluaciones. El inventario original de selección se conserva sin reescribir.

## Admisión de la regresión transversal — cohorte 36r

La regresión utiliza un perfil privado nuevo, no otro prompt ni un reinicio del proyecto. Quedan 151 pendientes y se admiten 113 tras revisión individual: Sprint1 55, Sprint2 30, Sprint3 25 y Sprint10 3. No se incluyen MySqlConnectionTest (contrato histórico/no DatabaseTransactions, no sustituye guardas negativas auxiliares), AvatarTest ni archivos sin aislamiento aprobado. El primer grupo es de cuatro, luego hasta diez, con autorización fresca e inspección por caso y checkpoints acumulativos.

Se revisaron AuthService/UserService/RoleController y Spatie HasRoles/HasPermissions: los rechazos de payload/roles/permiso se detienen antes de sync/delete. Se excluyen el cambio efectivo de contraseña (tokens()->delete), alta de usuario con syncRoles, reemplazo exitoso de permisos (syncPermissions), soft deletes, desvinculaciones familiares y demo. Los cambios sintéticos de permisos con givePermissionTo son INSERT transaccional en fixtures, sin alterar grants MySQL o configuración funcional. Los tres casos Sprint10 admitidos son lecturas/reportes y CSV por php://output en memoria; no se guarda un archivo ni se crean comunicados mediante el servicio que usa DELETE.

El descubrimiento tuvo tres bloqueos sin SQL: filtro11 por slash, filtro49 por coma perdida y filtro56 por punto perdido en users.disable. El cuarto intento reconstruye el nombre literal desde el source usando Pest Support Str::evaluable y verifica los 113 IDs exactos. Mantiene el filtro de slash como clase de carácter literal y el guard de clase/método/dataset en runtime. Conserva discovery/discovery2/discovery3 y crea discovery4 para la verificación final; el aviso de recibo offline del intento2 quedó documentado y no se volvió a producir tras corregir solo el prefijo de salida. **113 filtros aprobados no son 113 tests ejecutados**.

Guards SQL/TLS/TTL/Windows y predicados de procesos se conservan sin debilitarlos. No hay ejecución paralela Pest: el primer supervisor terminó antes de lanzar la cohorte 36r. Los procesos desconocidos se observaron sin detenerlos. Los checkpoints de regresión añaden resultados a los 39 recuperados, sin repetirlos; ante otro límite de uso se consulta el último checkpoint y caso/JUnit pendiente, no se relanza la suite.

### Selección transversal revisada

| R36 | Grupo | Fuente | Nombre original | Dataset |
| --- | ---: | --- | --- | --- |
| 001 | 1 | Sprint10Test.php | serves all report families with real rows filters and pagination | `` |
| 002 | 1 | Sprint10Test.php | isolates institutions and restricts report and selector access by role and ownership | `` |
| 003 | 1 | Sprint10Test.php | exports filtered CSV with private fields excluded and spreadsheet formulas neutralized | `` |
| 004 | 1 | Sprint1Test.php | rejects incorrect credentials | `('password')` |
| 005 | 2 | Sprint1Test.php | rejects incorrect credentials | `('email')` |
| 006 | 2 | Sprint1Test.php | rejects incorrect credentials | `('institution_code')` |
| 007 | 2 | Sprint1Test.php | validates login input | `` |
| 008 | 2 | Sprint1Test.php | denies inactive and blocked accounts | `('INACTIVE')` |
| 009 | 2 | Sprint1Test.php | denies inactive and blocked accounts | `('BLOCKED')` |
| 010 | 2 | Sprint1Test.php | denies inactive institutions | `` |
| 011 | 2 | Sprint1Test.php | requires authentication | `('auth/me')` |
| 012 | 2 | Sprint1Test.php | requires authentication | `('users')` |
| 013 | 2 | Sprint1Test.php | requires authentication | `('institutions')` |
| 014 | 2 | Sprint1Test.php | requires authentication | `('roles')` |
| 015 | 3 | Sprint1Test.php | requires authentication | `('permissions')` |
| 016 | 3 | Sprint1Test.php | requires authentication | `('profile')` |
| 017 | 3 | Sprint1Test.php | requires authentication | `('audit-logs')` |
| 018 | 3 | Sprint1Test.php | returns authenticated identity and institution | `` |
| 019 | 3 | Sprint1Test.php | logs out and audits the session | `` |
| 020 | 3 | Sprint1Test.php | revokes access when an account becomes blocked | `` |
| 021 | 3 | Sprint1Test.php | rejects invalid password changes | `(['wrong', 'ChangedPass456!', 'ChangedPass456!'])` |
| 022 | 3 | Sprint1Test.php | rejects invalid password changes | `(['TestingPass123!', 'short', 'short'])` |
| 023 | 3 | Sprint1Test.php | rejects invalid password changes | `(['TestingPass123!', 'ChangedPass456!', 'different'])` |
| 024 | 3 | Sprint1Test.php | rejects invalid password changes | `(['TestingPass123!', 'TestingPass123!', 'TestingPass123!'])` |
| 025 | 4 | Sprint1Test.php | isolates user lists and ignores forged institution headers | `` |
| 026 | 4 | Sprint1Test.php | hides foreign user bindings | `('getJson')` |
| 027 | 4 | Sprint1Test.php | hides foreign user bindings | `('patchJson')` |
| 028 | 4 | Sprint1Test.php | denies disabling another institution user | `` |
| 029 | 4 | Sprint1Test.php | rejects tenant injection and invalid user fields | `` |
| 030 | 4 | Sprint1Test.php | requires valid names on user creation | `` |
| 031 | 4 | Sprint1Test.php | rejects duplicate email in an institution | `` |
| 032 | 4 | Sprint1Test.php | allows the same email in different institutions | `` |
| 033 | 4 | Sprint1Test.php | updates and disables an institutional user | `` |
| 034 | 4 | Sprint1Test.php | protects the last administrator | `` |
| 035 | 5 | Sprint1Test.php | prevents self deactivation | `` |
| 036 | 5 | Sprint1Test.php | denies non administrators protected resources | `('SECRETARY')` |
| 037 | 5 | Sprint1Test.php | denies non administrators protected resources | `('TREASURY')` |
| 038 | 5 | Sprint1Test.php | denies non administrators protected resources | `('TEACHER')` |
| 039 | 5 | Sprint1Test.php | denies non administrators protected resources | `('STUDENT')` |
| 040 | 5 | Sprint1Test.php | denies non administrators protected resources | `('GUARDIAN')` |
| 041 | 5 | Sprint1Test.php | denies privilege escalation by users managers | `` |
| 042 | 5 | Sprint1Test.php | limits institutional access and validates updates | `` |
| 043 | 5 | Sprint1Test.php | limits role catalogs to current institution | `` |
| 044 | 5 | Sprint1Test.php | updates only permitted profile fields | `` |
| 045 | 6 | Sprint1Test.php | isolates audit records | `` |
| 046 | 6 | Sprint1Test.php | fails closed without an institution context | `` |
| 047 | 6 | Sprint1Test.php | prevents reassigning a user to another institution | `` |
| 048 | 6 | Sprint1Test.php | enforces login rate limiting | `` |
| 049 | 6 | Sprint1Test.php | persists institution fields, enum and user relationship | `` |
| 050 | 6 | Sprint1Test.php | enforces unique institution codes in MySQL | `` |
| 051 | 6 | Sprint1Test.php | enforces tenant email uniqueness in MySQL | `` |
| 052 | 6 | Sprint1Test.php | rejects obsolete password session hashes | `` |
| 053 | 6 | Sprint1Test.php | keeps permission caches isolated between two authenticated institutions | `` |
| 054 | 6 | Sprint1Test.php | rejects delegated permissions the actor does not possess | `` |
| 055 | 7 | Sprint1Test.php | rejects institutional writes from an unprivileged user | `` |
| 056 | 7 | Sprint1Test.php | requires users.disable to change account status | `` |
| 057 | 7 | Sprint1Test.php | rolls back new users when role delegation is forbidden | `` |
| 058 | 7 | Sprint1Test.php | does not allow anonymous password changes or logout | `` |
| 059 | 7 | Sprint2Test.php | does not expose academic administration to other roles | `('GUARDIAN')` |
| 060 | 7 | Sprint2Test.php | does not expose academic administration to other roles | `('TREASURY')` |
| 061 | 7 | Sprint2Test.php | activating a year makes it current and leaves another institution unchanged | `` |
| 062 | 7 | Sprint2Test.php | enforces single current year with a MySQL unique constraint | `` |
| 063 | 7 | Sprint2Test.php | rejects overlapping and shared boundary periods | `('2026-04-01', '2026-06-01')` |
| 064 | 7 | Sprint2Test.php | rejects overlapping and shared boundary periods | `('2026-05-08', '2026-06-01')` |
| 065 | 8 | Sprint2Test.php | rejects overlapping and shared boundary periods | `('2026-03-02', '2026-12-18')` |
| 066 | 8 | Sprint2Test.php | allows adjacent non overlapping periods but not duplicate sequence | `` |
| 067 | 8 | Sprint2Test.php | does not shrink a year beyond its periods | `` |
| 068 | 8 | Sprint2Test.php | closes a year and its periods and rejects new academic changes | `` |
| 069 | 8 | Sprint2Test.php | cannot bypass close or disable permissions through status fields | `('academic-years', 'CLOSED')` |
| 070 | 8 | Sprint2Test.php | cannot bypass close or disable permissions through status fields | `('academic-periods', 'CLOSED')` |
| 071 | 8 | Sprint2Test.php | cannot bypass close or disable permissions through status fields | `('subjects', 'INACTIVE')` |
| 072 | 8 | Sprint2Test.php | validates section capacity | `(-1)` |
| 073 | 8 | Sprint2Test.php | validates section capacity | `(0)` |
| 074 | 8 | Sprint2Test.php | validates section capacity | `(2.5)` |
| 075 | 9 | Sprint2Test.php | validates section capacity | `('many')` |
| 076 | 9 | Sprint2Test.php | accepts nullable capacity | `` |
| 077 | 9 | Sprint2Test.php | rejects missing and foreign parent relationships | `('academic-periods', 'academic_year_id', 'year')` |
| 078 | 9 | Sprint2Test.php | rejects missing and foreign parent relationships | `('grade-levels', 'education_level_id', 'level')` |
| 079 | 9 | Sprint2Test.php | rejects missing and foreign parent relationships | `('sections', 'academic_year_id', 'year')` |
| 080 | 9 | Sprint2Test.php | disables subjects without removing history and audits the change | `` |
| 081 | 9 | Sprint2Test.php | searches filters paginates and orders academic lists | `` |
| 082 | 9 | Sprint2Test.php | allows identical grade codes under different education levels | `` |
| 083 | 9 | Sprint2Test.php | does not reserve section names globally | `` |
| 084 | 9 | Sprint2Test.php | rolls back academic mutation when audit persistence fails | `` |
| 085 | 10 | Sprint2Test.php | editing a non current active year does not change the current year | `` |
| 086 | 10 | Sprint2Test.php | audits catalog deactivation as disable | `('education-levels')` |
| 087 | 10 | Sprint2Test.php | audits catalog deactivation as disable | `('grade-levels')` |
| 088 | 10 | Sprint2Test.php | audits catalog deactivation as disable | `('sections')` |
| 089 | 10 | Sprint3Test.php | validates dates document format and state | `('students', ['2099-01-01'])` |
| 090 | 10 | Sprint3Test.php | validates dates document format and state | `('students', ['2020-02-30'])` |
| 091 | 10 | Sprint3Test.php | validates dates document format and state | `('students', ['2000-01-01'])` |
| 092 | 10 | Sprint3Test.php | validates dates document format and state | `('teachers', ['not-a-date'])` |
| 093 | 10 | Sprint3Test.php | validates dates document format and state | `('students', ['INVALID'])` |
| 094 | 10 | Sprint3Test.php | validates dates document format and state | `('students', ['BLOCKED'])` |
| 095 | 11 | Sprint3Test.php | validates dates document format and state | `('teachers', ['GRADUATED'])` |
| 096 | 11 | Sprint3Test.php | validates dates document format and state | `('guardians', ['ON_LEAVE'])` |
| 097 | 11 | Sprint3Test.php | validates dates document format and state | `('students', ['123'])` |
| 098 | 11 | Sprint3Test.php | validates dates document format and state | `('guardians', ['INVALID'])` |
| 099 | 11 | Sprint3Test.php | validates dates document format and state | `('teachers', ['unsafe<script>'])` |
| 100 | 11 | Sprint3Test.php | accepts supported lifecycle states | `('students', 'GRADUATED')` |
| 101 | 11 | Sprint3Test.php | accepts supported lifecycle states | `('students', 'WITHDRAWN')` |
| 102 | 11 | Sprint3Test.php | accepts supported lifecycle states | `('teachers', 'ON_LEAVE')` |
| 103 | 11 | Sprint3Test.php | preserves profile roles and immutable account binding | `` |
| 104 | 11 | Sprint3Test.php | finds compatible accounts but not foreign or privileged accounts | `` |
| 105 | 12 | Sprint3Test.php | rejects account duplication and simultaneous create plus reuse | `` |
| 106 | 12 | Sprint3Test.php | rolls back account profile and assigned role when auditing fails | `('students')` |
| 107 | 12 | Sprint3Test.php | rolls back account profile and assigned role when auditing fails | `('teachers')` |
| 108 | 12 | Sprint3Test.php | rolls back account profile and assigned role when auditing fails | `('guardians')` |
| 109 | 12 | Sprint3Test.php | searches filters and paginates people | `` |
| 110 | 12 | Sprint3Test.php | refuses onboarding a role with permissions the operator cannot delegate | `` |
| 111 | 12 | Sprint3Test.php | does not reuse a blocked account | `` |
| 112 | 12 | Sprint3Test.php | reuses a teacher guardian account without changing its roles | `` |
| 113 | 12 | Sprint3Test.php | rolls back primary switch when relation audit fails | `` |

### Checkpoint de regresión 4 — 2026-11-06T20:14:36+00:00

4 aprobados / 111 aserciones nuevas de regresión, 4 rollbacks comprobados. Acumulado 167 distintos / 1292 aserciones; 147 pendientes. Próximo: R36-005 rejects incorrect credentials dataset ('email'). Evidencia privada: prompt36r/checkpoint-0004.json.

## Incidente R36-014 y recuperación diagnosticada

La cohorte 36r ejecutó 14 casos distintos: 13 aprobaron (136 aserciones) y R36-014 tuvo **1 error de infraestructura / 0 aserciones / exit2**. Los casos 15–113 no se iniciaron. JUnit original: prompt36r/run/case14.xml; fallo ISOLATION_BLOCKED_40 durante SELECT de permissions en OfficePermissionSeeder, antes de la prueba funcional `requires authentication` dataset `('roles')`. No se declara un defecto funcional de EcoAula por ese error.

El gate dejó de ser válido durante una pausa prolongada: la atestación máxima registrada fue 279518,7332 ms, y la raíz llegó a rollback a los 301,010 s del proceso. La edad gate de PHP solo alcanzó 20,998 s en sus muestras exitosas: no se usa ese máximo como evidencia de que la autorización seguía vigente tras la pausa. El checker nativo devolvió BLOCKED y PHP no continuó SQL con una autorización vencida. El reason interno de ese retorno no se desglosa, pero el transcurso excede por sí solo la ventana de 120 s.

Se consultaron eventos de energía en modo lectura, conservando solo tiempos/estados: Kernel-Power42/107 y Power-Troubleshooter1. Este último informa SleepTime `2026-11-06T20:23:12.8639701Z` y WakeTime `2026-11-06T20:27:55.4928487Z`, aproximadamente 282,629 segundos de suspensión, coincidentes con la pausa del caso. Evidencia: prompt36r/power-incident14.json. No se modificó Windows, política de energía ni servicios, y no se atribuye la suspensión a una acción concreta del usuario.

El efecto registra un BEGIN y un ROLLBACK explícitos, cero DELETE, cero commits rechazados. La comprobación de limpieza **del mismo PDO** no emitió recibo después del error porque la guarda ya bloqueaba nuevas verificaciones; esa limitación no se oculta. Sí aprobaron la inspección externa post-case14 y la final con un gate nuevo fuera de transacción: 52 tablas, 14 migrations y cero residuos. Las negativas finales volvieron a rechazar ambas bases protegidas. El worker cerró con exit0, sin procesos/listeners/conexiones3308. `authClientExit=2` conserva el error Pest aunque el supervisor completara correctamente su cierre con exit0; no se interpreta ese exit del supervisor como todos los tests aprobados.

Acumulado tras el incidente: **176 distintos aprobados / 1317 aserciones / 138 pendientes**. Los 39 módulos y los 13 regresiones aprobados no se repiten. Checkpoint de recuperación: prompt36r2/recovery-admission.json, con los 176 JUnit anteriores verificados. Se prepara una cohorte privada nueva 36r2 con los 100 IDs restantes, comenzando en R36-014: un único reintento después del diagnóstico de suspensión, no un retry automático ciego. Los otros 99 aún no se habían ejecutado. Es la continuación del mismo Prompt36, no una nueva autorización de operaciones.

Antes de ese reintento se repiten preflight, checker nativo/paridad/negativas, TLS/identidad y estado vacío del esquema. No se cambia TTL, permiso SQL, predicado ni aserción. La suspensión quedó identificada y el entorno se debe revalidar activo; si vuelve a suspenderse o falla una comprobación crítica, se detendrá otra vez. El error original permanece incluso si el caso aprueba después, y las aserciones de ese intento erróneo no se acreditan. Los checkpoints de 36r2 identifican el número local y `regressionNumber` original para reanudar sin duplicar éxitos.

La preparación de Build36R2 tuvo una corrección de sintaxis de comillas en el generador de texto del checkpoint, anterior a ejecución/SQL. Se corrigió exclusivamente el instrumental privado; los archivos originales permanecen intactos.

### Checkpoint de regresión recuperada 36r2 4 — 2026-11-06T20:52:06+00:00

4 aprobados / 8 aserciones nuevas de regresión, 4 rollbacks comprobados. Acumulado 180 distintos / 1325 aserciones; 134 pendientes. Próximo: R36r2-005 returns authenticated identity and institution dataset . Evidencia privada: prompt36r2/checkpoint-0004.json.

### Condición operativa confirmada por el usuario

Durante la continuación, el usuario confirmó: «Mantendré el equipo activo». Se continúa con esa condición operativa, sin modificar políticas de energía, servicios ni configuración global de Windows. La guarda de 120 segundos sigue siendo obligatoria; esa confirmación no sustituye identidad/TLS ni autoriza operaciones adicionales.

### Checkpoint de regresión recuperada 36r2 14 — 2026-11-06T21:03:17+00:00

14 aprobados / 37 aserciones nuevas de regresión, 14 rollbacks comprobados. Acumulado 190 distintos / 1354 aserciones; 124 pendientes. Próximo: R36r2-015 denies disabling another institution user dataset . Evidencia privada: prompt36r2/checkpoint-0014.json.

### Checkpoint de regresión recuperada 36r2 24 — 2026-11-06T21:15:36+00:00

24 aprobados / 81 aserciones nuevas de regresión, 24 rollbacks comprobados. Acumulado 200 distintos / 1398 aserciones; 114 pendientes. Próximo: R36r2-025 denies non administrators protected resources dataset ('TEACHER'). Evidencia privada: prompt36r2/checkpoint-0024.json.

## Cierre de esta continuación — bloqueo recurrente de entorno

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.** Se detienen nuevas escrituras. El usuario confirmó mantener activo el equipo; posteriormente los eventos volvieron a registrar suspensión durante un caso. No se atribuye esa suspensión a una acción concreta del usuario ni se cambia configuración de energía. No se amplía TTL ni se repite ciegamente el caso.

### Segundo incidente: 36r2-026 / R36-039

Caso `denies non administrators protected resources`, dataset `('STUDENT')`, Sprint1Test.php, id original `P\Tests\Feature\Sprint1Test::__pest_evaluable_it_denies_non_administrators_protected_resources#('STUDENT')`. JUnit: prompt36r2/run/case26.xml, exit2, 1 error / 0 aserciones. ISOLATION_BLOCKED_40 durante fixtures de CoursePermissionSeeder/savepoint, antes del comportamiento funcional. No es un defecto funcional confirmado ni un fallo de aserción.

Métricas PID19108: root-begin 1,133 s; root-rollback 443,758 s; CLI 443,873 s. Las muestras exitosas de gate llegaron a 11,694 s y no representan la vigencia después de la pausa. El registro acotado `power-incident26-window.json` confirma SleepTime `2026-11-06T21:17:08.2429250Z` y WakeTime `2026-11-06T21:24:23.6358737Z` (435,393 s), coincidentes con el bloqueo. La primera consulta `power-incident26.json` contiene eventos posteriores y se conserva como diagnóstico, pero **no se usa para atribuir la causa de este caso**.

Un BEGIN y un ROLLBACK explícitos, cero DELETE/commits; sin recibo posterior de limpieza del mismo PDO por la guarda bloqueada, limitación que se conserva. La inspección externa post-case26 y la final aprobaron: 52 tablas/14 migrations/cero residuos. TLS e identidad correctos con autorizaciones nuevas fuera de transacción; las negativas finales rechazaron ambas bases protegidas. Nadie ejecutó casos27–100 de 36r2. El caso25 se verificó y acredita aunque el grupo se interrumpiera; checkpoint terminal lo incorpora a los 24 del último checkpoint de grupo.

### Tabla final de casos distintos del Prompt36

| Módulo | Casos nuevos ejecutados | Aprobados | Fallidos/errores pendientes | Bloqueados por operación/contrato | Aserciones acreditadas | Estado |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Matrículas | 0 | 0 | 0 | 2 | 0 | B. PARCIAL CON PENDIENTES |
| Aula Virtual | 19 | 19 | 0 | 10 | 221 | B. PARCIAL CON PENDIENTES |
| Evaluaciones | 5 | 5 | 0 | 0 | 42 | A. APROBADO EN ALCANCE EJECUTADO |
| Asistencia | 9 | 9 | 0 | 1 | 85 | B. PARCIAL CON PENDIENTES |
| Comunicaciones | 6 | 6 | 0 | 4 | 68 | B. PARCIAL CON PENDIENTES |
| Regresión transversal | 39 | 38 | 1 | 21 | 223 | D. BLOQUEADO POR ENTORNO |

Matrículas conserva los 18 éxitos históricos del Prompt35, no casos nuevos aquí. Los bloqueados de operación/contrato son 38, distintos de los 75 candidatos de regresión detenidos por entorno (1 con error y 74 no ejecutados). No se declara validado todo un módulo. Los dos escenarios de archivos de entregas de Sprint7 se clasifican finalmente en Aula, sin reescribir el inventario original.

### Cantidades consolidadas

- 39 casos / 416 aserciones recuperados del supervisor anterior.
- 38 casos / 223 aserciones aprobados durante esta continuación (13 en36r y25 en36r2).
- Prompt36: **77 nuevos distintos aprobados / 639 aserciones nuevas acreditadas**.
- Acumulado: **201 distintos aprobados / 1404 aserciones / 113 pendientes** del inventario314.
- 79 ejecuciones Pest para78 casos nuevos distintos:77 ejecuciones aprobadas y2 errores de infraestructura; uno de los errores tuvo un único reintento diagnosticado y aprobó.
- Cero fallos de aserción y ningún defecto funcional confirmado;2 errores de infraestructura preservados,1 recuperado y1 pendiente. Las aserciones de ejecuciones erróneas (0) no se acreditan.
- 77 rollbacks de casos aprobados con limpieza misma conexión/externa; además2 rollbacks raíz de intentos erróneos con snapshots externos limpios y sin recibo mismo PDO. Total79 rollbacks raíz registrados; no se confunde esa diferencia.

### Regresión individual acreditada y error pendiente

| R36 | Fuente / evidencia | Resultado final | Aserciones |
| --- | --- | --- | ---: |
| 014 intento1 | prompt36r/run/case14.xml | ERROR INFRA preservado, recuperado después | 0 |
| 001 | prompt36r/run/case1.xml | PASSED | 73 |
| 002 | prompt36r/run/case2.xml | PASSED | 20 |
| 003 | prompt36r/run/case3.xml | PASSED | 15 |
| 004 | prompt36r/run/case4.xml | PASSED | 3 |
| 005 | prompt36r/run/case5.xml | PASSED | 3 |
| 006 | prompt36r/run/case6.xml | PASSED | 3 |
| 007 | prompt36r/run/case7.xml | PASSED | 7 |
| 008 | prompt36r/run/case8.xml | PASSED | 2 |
| 009 | prompt36r/run/case9.xml | PASSED | 2 |
| 010 | prompt36r/run/case10.xml | PASSED | 2 |
| 011 | prompt36r/run/case11.xml | PASSED | 2 |
| 012 | prompt36r/run/case12.xml | PASSED | 2 |
| 013 | prompt36r/run/case13.xml | PASSED | 2 |
| 014 | prompt36r2/run/case1.xml | PASSED | 2 |
| 015 | prompt36r2/run/case2.xml | PASSED | 2 |
| 016 | prompt36r2/run/case3.xml | PASSED | 2 |
| 017 | prompt36r2/run/case4.xml | PASSED | 2 |
| 018 | prompt36r2/run/case5.xml | PASSED | 5 |
| 019 | prompt36r2/run/case6.xml | PASSED | 6 |
| 020 | prompt36r2/run/case7.xml | PASSED | 2 |
| 021 | prompt36r2/run/case8.xml | PASSED | 2 |
| 022 | prompt36r2/run/case9.xml | PASSED | 2 |
| 023 | prompt36r2/run/case10.xml | PASSED | 2 |
| 024 | prompt36r2/run/case11.xml | PASSED | 2 |
| 025 | prompt36r2/run/case12.xml | PASSED | 4 |
| 026 | prompt36r2/run/case13.xml | PASSED | 2 |
| 027 | prompt36r2/run/case14.xml | PASSED | 2 |
| 028 | prompt36r2/run/case15.xml | PASSED | 2 |
| 029 | prompt36r2/run/case16.xml | PASSED | 7 |
| 030 | prompt36r2/run/case17.xml | PASSED | 7 |
| 031 | prompt36r2/run/case18.xml | PASSED | 4 |
| 032 | prompt36r2/run/case19.xml | PASSED | 3 |
| 033 | prompt36r2/run/case20.xml | PASSED | 5 |
| 034 | prompt36r2/run/case21.xml | PASSED | 2 |
| 035 | prompt36r2/run/case22.xml | PASSED | 2 |
| 036 | prompt36r2/run/case23.xml | PASSED | 6 |
| 037 | prompt36r2/run/case24.xml | PASSED | 6 |
| 038 | prompt36r2/run/case25.xml | PASSED | 6 |
| 039 | prompt36r2/run/case26.xml | ERROR | 0 |

### Estado final seguro y supervisores

Los tres supervisores fueron secuenciales. Cierre último: worker exit0, shutdown completo, cero errores MySQL y un aviso de CA privada autofirmada, sin desactivar TLS. Monitor exit3221225786 por señal controlada del árbol propio. Se revisaron9952 objetos de ACL/identidad, cuatro configuraciones de desarrollo y log de inicialización intactos. `authClientExit=2` conserva el error Pest y **no** se transforma en éxito porque el supervisor finalizara con exit0. Comprobación posterior: 0 procesos MySQL, 0 listeners y 0 entradas TCP3308; PID ausente y sin supervisor propio activo.

Se conservaron52 tablas InnoDB,14 migraciones, esquema de columnas/índices/FK, cero triggers y cero filas en51 tablas de aplicación. migrations mantiene14 filas. Igualdad lógica, no comparación binaria de InnoDB/autoincrementos. TLS, cuenta/base/puerto/UUID/datadir y PDO/CONNECTION_ID se verificaron; los accesos a zarate_dev/zarate_test se rechazaron sin consultar sus datos. Ningún servicio demo3307/8000/5173 fue intervenido. Guardas, privilegios, credenciales, migraciones y código funcional originales no se modificaron.

### Pendientes y siguiente punto exacto

No hay una ejecución nueva autorizada hasta resolver la suspensión recurrente y revalidar el entorno activo: **R36-039**, Sprint1Test `denies non administrators protected resources`, dataset `('STUDENT')`; cohorte36r2 local26, ERROR no aprobado. El siguiente que nunca se inició es R36-040, mismo método/dataset `('GUARDIAN')`, local27. Conservar176 JUnit previos más25 nuevos de36r2 y no volver a ejecutar los201 aprobados. Cualquier reintento deberá ser posterior a un diagnóstico/condición de entorno resuelta, con gate nuevo y preflight completo, sin modificar Windows automáticamente.

`checkpoint-terminal-0201.json` contiene IDs exactos del siguiente caso, totales y límites; `inventory-remaining-final.json` conserva los113 IDs pendientes por causa. Los38 no admitidos siguen requiriendo revisión/autorización específica: delete/forceDelete, pivotes/destinatarios/tokens, demo, archivos y contratos MySqlConnectionTest. No se habilitan por el hecho de resolver la energía. Los otros75 ya revisados quedan pendientes por el entorno.

| Fuente | Nombre / dataset | Causa pendiente |
| --- | --- | --- |
| backend/tests/Feature/AvatarTest.php:41 | uploads replaces reads and removes the own private avatar without exposing its path `` | OPERACIÓN/CONTRATO NO ADMITIDO — Archivos/avatar no admitidos |
| backend/tests/Feature/AvatarTest.php:52 | rejects unsafe and oversized files and unauthorized profile changes `` | OPERACIÓN/CONTRATO NO ADMITIDO — Archivos/avatar no admitidos |
| backend/tests/Feature/AvatarTest.php:64 | denies peer and cross institution avatar access while allowing authorized administration `` | OPERACIÓN/CONTRATO NO ADMITIDO — Archivos/avatar no admitidos |
| backend/tests/Feature/MySqlConnectionTest.php:6 | se conecta únicamente a la base MySQL de testing `` | OPERACIÓN/CONTRATO NO ADMITIDO — Contrato histórico base/cuenta y ausencia de DatabaseTransactions; no debilitar guardas para admitirlo |
| backend/tests/Feature/MySqlConnectionTest.php:18 | impide que el usuario de testing consulte desarrollo `` | OPERACIÓN/CONTRATO NO ADMITIDO — Contrato histórico base/cuenta y ausencia de DatabaseTransactions; no debilitar guardas para admitirlo |
| backend/tests/Feature/Sprint10Test.php:122 | serves six real dashboards while keeping family and student summaries private `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint10Test.php:147 | counts missing deliveries once per student and financial validation including absent payments `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint1Test.php:74 | denies deleted users `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint1Test.php:101 | changes password securely and clears the initial password flag `` | OPERACIÓN/CONTRATO NO ADMITIDO — No autorizado por la lista actual; requiere revisión de servicios, SQL y efectos transitivos por caso. |
| backend/tests/Feature/Sprint1Test.php:130 | creates users only within the current institution with hashed passwords `` | OPERACIÓN/CONTRATO NO ADMITIDO — No autorizado por la lista actual; requiere revisión de servicios, SQL y efectos transitivos por caso. |
| backend/tests/Feature/Sprint1Test.php:168 | denies non administrators protected resources `('STUDENT')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:168 | denies non administrators protected resources `('GUARDIAN')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:176 | denies privilege escalation by users managers `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:183 | limits institutional access and validates updates `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:190 | limits role catalogs to current institution `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:197 | updates role permissions and protects administrator role `` | OPERACIÓN/CONTRATO NO ADMITIDO — No autorizado por la lista actual; requiere revisión de servicios, SQL y efectos transitivos por caso. |
| backend/tests/Feature/Sprint1Test.php:203 | updates only permitted profile fields `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:208 | isolates audit records `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:214 | fails closed without an institution context `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:219 | prevents reassigning a user to another institution `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:225 | enforces login rate limiting `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:233 | persists institution fields  enum and user relationship `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:242 | enforces unique institution codes in MySQL `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:246 | enforces tenant email uniqueness in MySQL `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:250 | soft deletes institutions and denies their accounts `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint1Test.php:256 | rejects obsolete password session hashes `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:260 | keeps permission caches isolated between two authenticated institutions `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:273 | rejects delegated permissions the actor does not possess `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:282 | rejects institutional writes from an unprivileged user `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:287 | requires users disable to change account status `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:293 | rolls back new users when role delegation is forbidden `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint1Test.php:299 | does not allow anonymous password changes or logout `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:125 | does not expose academic administration to other roles `('GUARDIAN')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:125 | does not expose academic administration to other roles `('TREASURY')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:148 | activating a year makes it current and leaves another institution unchanged `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:154 | enforces single current year with a MySQL unique constraint `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:169 | rejects overlapping and shared boundary periods `('2026-04-01', '2026-06-01')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:169 | rejects overlapping and shared boundary periods `('2026-05-08', '2026-06-01')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:169 | rejects overlapping and shared boundary periods `('2026-03-02', '2026-12-18')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:173 | allows adjacent non overlapping periods but not duplicate sequence `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:179 | does not shrink a year beyond its periods `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:189 | closes a year and its periods and rejects new academic changes `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:197 | cannot bypass close or disable permissions through status fields `('academic-years', 'CLOSED')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:197 | cannot bypass close or disable permissions through status fields `('academic-periods', 'CLOSED')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:197 | cannot bypass close or disable permissions through status fields `('subjects', 'INACTIVE')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:209 | validates section capacity `(-1)` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:209 | validates section capacity `(0)` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:209 | validates section capacity `(2.5)` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:209 | validates section capacity `('many')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:212 | accepts nullable capacity `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:215 | rejects missing and foreign parent relationships `('academic-periods', 'academic_year_id', 'year')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:215 | rejects missing and foreign parent relationships `('grade-levels', 'education_level_id', 'level')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:215 | rejects missing and foreign parent relationships `('sections', 'academic_year_id', 'year')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:225 | disables subjects without removing history and audits the change `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:234 | searches filters paginates and orders academic lists `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:243 | allows identical grade codes under different education levels `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:248 | does not reserve section names globally `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:253 | soft deletes catalogs without freeing historical unique codes `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint2Test.php:259 | rolls back academic mutation when audit persistence fails `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:275 | reproduces demo data without duplicates or overwriting edits `` | OPERACIÓN/CONTRATO NO ADMITIDO — AcademicDemoSeeder prohibido. |
| backend/tests/Feature/Sprint2Test.php:287 | editing a non current active year does not change the current year `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:295 | audits catalog deactivation as disable `('education-levels')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:295 | audits catalog deactivation as disable `('grade-levels')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint2Test.php:295 | audits catalog deactivation as disable `('sections')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('students', ['2099-01-01'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('students', ['2020-02-30'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('students', ['2000-01-01'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('teachers', ['not-a-date'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('students', ['INVALID'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('students', ['BLOCKED'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('teachers', ['GRADUATED'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('guardians', ['ON_LEAVE'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('students', ['123'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('guardians', ['INVALID'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:191 | validates dates document format and state `('teachers', ['unsafe<script>'])` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:199 | accepts supported lifecycle states `('students', 'GRADUATED')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:199 | accepts supported lifecycle states `('students', 'WITHDRAWN')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:199 | accepts supported lifecycle states `('teachers', 'ON_LEAVE')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:203 | preserves profile roles and immutable account binding `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:208 | finds compatible accounts but not foreign or privileged accounts `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:215 | rejects account duplication and simultaneous create plus reuse `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:221 | rolls back account profile and assigned role when auditing fails `('students')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:221 | rolls back account profile and assigned role when auditing fails `('teachers')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:221 | rolls back account profile and assigned role when auditing fails `('guardians')` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:242 | retains uniqueness after soft deletion `('students')` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint3Test.php:242 | retains uniqueness after soft deletion `('teachers')` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint3Test.php:242 | retains uniqueness after soft deletion `('guardians')` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint3Test.php:251 | searches filters and paginates people `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:305 | rejects cross tenant family IDs and bindings `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint3Test.php:318 | detaches only the relation preserving both people and audit history `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint3Test.php:332 | requires family management permission `` | OPERACIÓN/CONTRATO NO ADMITIDO — Invoca delete/forceDelete/deleteJson en el cuerpo. Puede ser soft delete o esperar rechazo antes de SQL; necesita revisión explícita y no se ejecuta en este lote. |
| backend/tests/Feature/Sprint3Test.php:365 | reproduces fictitious people without duplicating accounts or relationships `` | OPERACIÓN/CONTRATO NO ADMITIDO — PeopleDemoSeeder está llamado explícitamente dos veces en el cuerpo; prohibido. |
| backend/tests/Feature/Sprint3Test.php:373 | refuses onboarding a role with permissions the operator cannot delegate `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:379 | does not reuse a blocked account `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:387 | reuses a teacher guardian account without changing its roles `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint3Test.php:404 | rolls back primary switch when relation audit fails `` | ENTORNO — Ejecución suspendida por bloqueo global de entorno; no iniciar más escrituras |
| backend/tests/Feature/Sprint4Test.php:59 | runs correction approval cancellation with immutable history and audit `` | OPERACIÓN/CONTRATO NO ADMITIDO — delete/forceDelete excluidos por Prompt35 |
| backend/tests/Feature/Sprint4Test.php:208 | enforces duplicate prevention in the database including soft deleted active rows `` | OPERACIÓN/CONTRATO NO ADMITIDO — delete/forceDelete excluidos por Prompt35 |
| backend/tests/Feature/Sprint5Test.php:75 | creates activates edits and closes courses with audit and unique codes `` | OPERACIÓN/CONTRATO NO ADMITIDO — forceDelete explícito |
| backend/tests/Feature/Sprint6Test.php:69 | requires active courses for publication and published parent units for materials `` | OPERACIÓN/CONTRATO NO ADMITIDO — delete/forceDelete explícitos |
| backend/tests/Feature/Sprint6Test.php:101 | stores files privately with generated names and authorizes live downloads `` | OPERACIÓN/CONTRATO NO ADMITIDO — archivo/upload/download no admitido |
| backend/tests/Feature/Sprint6Test.php:114 | rejects executable disguised oversized and invalid office uploads without orphan files `` | OPERACIÓN/CONTRATO NO ADMITIDO — uploads no admitidos |
| backend/tests/Feature/Sprint6Test.php:145 | denies non assigned teachers and non classroom roles with current permission checks `` | OPERACIÓN/CONTRATO NO ADMITIDO — revokePermissionTo produce DELETE |
| backend/tests/Feature/Sprint6Test.php:182 | rolls back metadata audit and uploaded files together on failure `` | OPERACIÓN/CONTRATO NO ADMITIDO — archivo/upload/cleanup no admitido |
| backend/tests/Feature/Sprint6Test.php:189 | preserves material history and audits create update publish archive without private paths `` | OPERACIÓN/CONTRATO NO ADMITIDO — forceDelete explícito |
| backend/tests/Feature/Sprint6Test.php:204 | supports multipart file replacement and hides all content after course deactivation `` | OPERACIÓN/CONTRATO NO ADMITIDO — reemplazo de archivos no admitido |
| backend/tests/Feature/Sprint7Test.php:114 | records private submissions review feedback and returned attempts without overwriting history `` | OPERACIÓN/CONTRATO NO ADMITIDO — archivo/upload/download no admitido |
| backend/tests/Feature/Sprint7Test.php:183 | rejects unsafe files and cleans failed uploads while respecting revoked enrollment `` | OPERACIÓN/CONTRATO NO ADMITIDO — archivo/upload/cleanup no admitido |
| backend/tests/Feature/Sprint8Test.php:106 | lets linked guardians submit one safe private justification with history `` | OPERACIÓN/CONTRATO NO ADMITIDO — archivo/upload/download no admitido |
| backend/tests/Feature/Sprint9Test.php:131 | keeps documents private and issues only approved linked documents to the correct student `` | OPERACIÓN/CONTRATO NO ADMITIDO — archivo/upload/download no admitido |
| backend/tests/Feature/Sprint9Test.php:151 | deduplicates overlapping communication targets and keeps published recipients stable `` | OPERACIÓN/CONTRATO NO ADMITIDO — CommunicationService::save targets()->delete incluso al crear |
| backend/tests/Feature/Sprint9Test.php:162 | restricts communications to recipients and protects foreign targets and management `` | OPERACIÓN/CONTRATO NO ADMITIDO — CommunicationService::save targets()->delete |
| backend/tests/Feature/Sprint9Test.php:186 | isolates requests documents communications and notifications between institutions `` | OPERACIÓN/CONTRATO NO ADMITIDO — CommunicationService::save targets()->delete |

### Preparación de Cypress — NO EJECUTADO

No terminó la regresión Pest segura por el bloqueo de entorno, por lo que no se inicia Cypress. Inventario estático:26 specs, `cypress-static-inventory.json`. El análisis por patrones es orientativo, no prueba aislamiento ni cobertura. Configuración real: e2e/cypress.config.ts usa localhost5173 por defecto; frontend/vite.config.ts usa host0.0.0.0/puerto5173/proxy8000 por defecto. Varios specs tienen cy.request y login con cuentas demo; un intercept sin stub solo observa tráfico real. No se usan esas cuentas ni se lanza esa configuración.

Specs identificados: Matrículas enrollment/enrollment-center; Aula courses/classroom/virtual/virtual-access/learning/learning-filters/submission-deadline; Evaluación assessment-context/score-history (learning mezcla tareas/notas); Asistencia attendance/attendance-draft/justification-query/personal-attendance-query; Comunicación office/communication-queries/communication-drafts/notification-consistency. Existen pruebas con API simulada, pero no se presupone que todo su tráfico esté interceptado. No se declaran aprobadas en esta continuación.

Para integración real falta perfil frontend loopback5174 y backend8001 verificados, proxy/Origin/host cerrados, fixtures sintéticos sin demo, identidad SQL/TLS/grants/lease vigentes por proceso HTTP, y una estrategia de limpieza sin DELETE/DDL no autorizados. El launcher transaccional Pest no autoriza servir HTTP ni conserva fixtures entre solicitudes; no se puede reutilizar como si fuera servidor Cypress. Una nueva base, limpieza destructiva o ampliación de operaciones necesitaría autorización concreta, no se infiere. Estado: preparación estática parcial, entorno real NO HABILITADO.

### Archivos, evidencias y limitaciones de cierre

Públicos creados/modificados: prompt-36-validacion-integral-misional.md (original+continuación completos), evidencias-validacion-integral-misional.md. Privados nuevos: perfiles prompt36/prompt36r/prompt36r2; Build/Reports/Recover/Readers/Checkpoint/Summary/Audit de estas cohortes; corrección y descubrimientos de filtros, diagnóstico de energía, admisión/equivalencia/sellado y este cierre parcial. Consolidate36.php quedó preparado para un cierre completo pero **no se ejecutó**, porque exigiría100/100 del último lote; ClosePartial36.php refleja el resultado real.

Se conservan todos los JUnit y errores, checkpoints, métricas y snapshots. Las auditorías finales registran pins/documentos/JUnit anteriores y ausencia detectada de exposición de credencial/APP_KEY. git status/diff --check se registran al terminar. Los cambios anteriores de Git permanecen. Sin commits, push, merge ni PR. La validación integral no está completada y se detiene por una condición global de entorno verificable.

### Complemento de trazabilidad del checkpoint final

`approved-junit-0201.json` acredita los201 JUnit aprobados con1404 aserciones y hashes intactos; `checkpoint-terminal-0201-complemento.json` enumera los77 IDs nuevos aprobados y los IDs exactos del siguiente caso. El mirror actual es prompt36r2/tests/Feature/Sprint1Test.php y la evidencia fallida prompt36r2/run/case26.xml. **No volver a ejecutar Run36/Run36r/Run36r2 desde el inicio**: una eventual recuperación necesita nueva cohorte privada que excluya los201 éxitos, tras resolver la suspensión y revalidar todos los controles. Los checkpoints originales se conservan, sin sobrescribirlos.

### Auditorías y formato finales

Aprobaron las tres auditorías: prompt36 verificó1149 entradas de hashes y124 JUnit previos; prompt36r verificó2075 entradas y163 JUnit; prompt36r2 verificó2537 entradas y176 JUnit. En cada una permanecieron intactos los68 documentos anteriores y todos los artefactos fijados, sin exposición detectada de la credencial de pruebas ni APP_KEY. No se suman esos conteos superpuestos como archivos distintos. El registro separado de201 JUnit incluye los25 éxitos posteriores de36r2. El prompt mantiene exactos el original y la continuación, comprobados contra ambos adjuntos.

`git diff --check`: exit0, sin errores. Comprobación no-index de cada documento nuevo frente a NUL: exit1 por diferencia de archivo nuevo, sin errores de whitespace; únicamente avisos de normalización CRLF. Resultados privados: prompt36/format-final36.json y git-status-final36.txt. El estado de Git conserva el cambio previo de evidencias-finalizacion-migraciones.md y documentos sin seguimiento; no hay cambios funcionales nuevos. Las herramientas y checkpoints privados siguen ignorados por Git. No hubo commit, push, merge ni Pull Request.


## Anexo de cierre Prompt 37 — 07/11/2026

Estado D: BLOQUEADO POR SEGURIDAD O ENTORNO. Los 201 JUnit y 1.404 aserciones anteriores se verificaron sin repetir casos. Dos nuevas suspensiones detuvieron el preflight antes del arranque de MySQL: cero casos Pest nuevos, cero transacciones y cero recuperaciones. Se conserva R36-039 como siguiente caso, ERROR histórico pendiente, junto a 74 casos seguros sin ejecutar y 38 bloqueados por operaciones/contratos. El supervisor propio fue identificado y detenido sin afectar procesos ajenos. No se revalidaron SQL/TLS en vivo; la última evidencia anterior de 52 tablas, 14 migraciones y limpieza permanece histórica. No se ejecutó Cypress.

Detalle: [evidencias-cierre-regresion-pest.md](evidencias-cierre-regresion-pest.md). Registros privados: prompt37/new-power-incident.json, controlled-preflight-stop.json y summary37-blocked.json. No se declara la regresión completa ni la suite de 314 aprobada.

## Verificación tras recuperar Internet — 07/11/2026, 10:11 (-05)

Se comprobó nuevamente la rama `test/integracion-misional`, conservando el estado de Git. La lectura de eventos de Windows detectó dos suspensiones adicionales: SleepTime `2026-11-07T13:31:35.1567857Z` / WakeTime `2026-11-07T14:40:16.5845093Z`, y SleepTime `2026-11-07T14:45:32.5282135Z` / WakeTime `2026-11-07T15:08:03.6535746Z`. Las reanudaciones corresponden aproximadamente a 09:40 y 10:08 de Lima.

Conforme a la condición de parada del Prompt 37, no se inició ningún supervisor, servicio MySQL ni caso Pest. Se verificó ausencia de procesos MySQL/PHP, listeners en 3308/3307/8000/5173 y archivo PID. La lectura de eventos no presentó errores. La recuperación de Internet no demuestra continuidad del equipo ni valida por sí sola las guardas.

El resultado se mantiene D, BLOQUEADO POR ENTORNO: 201 casos aprobados, 1.404 aserciones acreditadas, cero casos nuevos ejecutados, 75 pendientes por entorno y 38 por operaciones/contratos. R36-039 sigue siendo el siguiente caso. No se revalidó SQL/TLS en vivo, no se ejecutó Cypress y no se alteraron opciones de energía ni archivos funcionales.

Evidencia privada nueva: `prompt37/reconnection-readonly.json` y `prompt37/reconnection-power-details.json`. Los registros de bloqueos anteriores permanecen intactos.
## Reanudación expresamente solicitada — 07/11/2026, 10:16 (-05)

Tras la instrucción «CONTINUACIÓN DEL PROMPT 37 — INTERNET RESTABLECIDO», se abrió una cohorte privada nueva `prompt37r`, sin reiniciar supervisores anteriores ni sobrescribir sus resultados.

La comprobación directa confirmó que PID 23076 no existe, no hay procesos PHP/Pest/MySQL abandonados, archivo PID ni listeners en 3308/3307/8000/5173. El directorio `prompt37/run` solo contiene dos métricas de preparación: no hay launch.json, logs de servidor ni JUnit de casos. No hubo eventos nuevos de suspensión desde la comprobación de 10:11; el intervalo nuevo de vigilancia comienza en `2026-11-07T10:16:54.7286538-05:00`.

Se verificaron nuevamente, sin ejecutarlos, los hashes y resultados de los 201 JUnit / 1.404 aserciones. Los 75 casos conservan el orden original R36-039 a R36-113; primero `Sprint1Test`, `denies non administrators protected resources`, dataset `('STUDENT')`, en un grupo de un caso. Los 38 excluidos permanecen bloqueados.

Preparación sin SQL: 75 filtros exactos comprobados por descubrimiento, 13 controles de seguridad offline y 13 comprobaciones nativas aprobados. Auditoría inicial: 3.601 entradas fijadas intactas, 72 documentos preservados, 201 JUnit sin cambios y cero coincidencias de contraseña/APP_KEY. El primer intento del script constructor falló por BOM antes de ejecutar instrucciones; se corrigió únicamente la codificación del constructor privado. No hubo ejecución SQL ni Pest por ese error.

El supervisor nuevo mantiene todas las comprobaciones de ACL, propietario, hardlinks y reparse points. Se añadió progreso cada 250 objetos y lectura de eventos de energía durante esa revisión; no se omiten objetos ni se debilitan comprobaciones. Guarda de 120 segundos intacta. Ninguna preparación offline sustituye la verificación TLS/SQL en vivo, pendiente del preflight.

Evidencias: `prompt37r/recovery-readonly.json`, `preparation.json`, `prior-junit-verification.json`, `filter-verification.json`, `native-negative-offline.json`, `security-offline.json`, `immutable.json` y auditoría inicial. Los resultados posteriores se añadirán por anexo, sin cambiar los bloqueos históricos.
### Checkpoint de regresión Prompt 37 1 — 2026-11-07T15:27:21+00:00

1 aprobados / 6 aserciones nuevas de regresión, 1 rollbacks comprobados. Acumulado 202 distintos / 1410 aserciones; 112 pendientes. Próximo: R37-002 denies non administrators protected resources dataset ('GUARDIAN'). Evidencia privada: prompt37r/checkpoint-0001.json.

### Checkpoint de regresión Prompt 37 11 — 2026-11-07T15:45:24+00:00

11 aprobados / 53 aserciones nuevas de regresión, 11 rollbacks comprobados. Acumulado 212 distintos / 1457 aserciones; 102 pendientes. Próximo: R37-012 enforces unique institution codes in MySQL dataset . Evidencia privada: prompt37r/checkpoint-0011.json.

### Checkpoint de regresión Prompt 37 21 — 2026-11-07T16:00:04+00:00

21 aprobados / 89 aserciones nuevas de regresión, 21 rollbacks comprobados. Acumulado 222 distintos / 1493 aserciones; 92 pendientes. Próximo: R37-022 does not expose academic administration to other roles dataset ('TREASURY'). Evidencia privada: prompt37r/checkpoint-0021.json.

### Checkpoint de regresión Prompt 37 31 — 2026-11-07T16:15:19+00:00

31 aprobados / 139 aserciones nuevas de regresión, 31 rollbacks comprobados. Acumulado 232 distintos / 1543 aserciones; 82 pendientes. Próximo: R37-032 cannot bypass close or disable permissions through status fields dataset ('academic-periods', 'CLOSED'). Evidencia privada: prompt37r/checkpoint-0031.json.

### Checkpoint de regresión Prompt 37 41 — 2026-11-07T16:30:15+00:00

41 aprobados / 185 aserciones nuevas de regresión, 41 rollbacks comprobados. Acumulado 242 distintos / 1589 aserciones; 72 pendientes. Próximo: R37-042 disables subjects without removing history and audits the change dataset . Evidencia privada: prompt37r/checkpoint-0041.json.

### Checkpoint de regresión Prompt 37 51 — 2026-11-07T16:45:36+00:00

51 aprobados / 234 aserciones nuevas de regresión, 51 rollbacks comprobados. Acumulado 252 distintos / 1638 aserciones; 62 pendientes. Próximo: R37-052 validates dates document format and state dataset ('students', ['2020-02-30']). Evidencia privada: prompt37r/checkpoint-0051.json.

### Checkpoint de regresión Prompt 37 61 — 2026-11-07T17:00:06+00:00

61 aprobados / 254 aserciones nuevas de regresión, 61 rollbacks comprobados. Acumulado 262 distintos / 1658 aserciones; 52 pendientes. Próximo: R37-062 accepts supported lifecycle states dataset ('students', 'GRADUATED'). Evidencia privada: prompt37r/checkpoint-0061.json.

### Checkpoint de regresión Prompt 37 71 — 2026-11-07T17:21:12+00:00

71 aprobados / 303 aserciones nuevas de regresión, 71 rollbacks comprobados. Acumulado 272 distintos / 1707 aserciones; 42 pendientes. Próximo: R37-072 refuses onboarding a role with permissions the operator cannot delegate dataset . Evidencia privada: prompt37r/checkpoint-0071.json.

### Checkpoint de regresión Prompt 37 75 — 2026-11-07T17:26:41+00:00

75 aprobados / 320 aserciones nuevas de regresión, 75 rollbacks comprobados. Acumulado 276 distintos / 1724 aserciones; 38 pendientes. Próximo: cohorte de regresión terminada; falta consolidación/cierre. Evidencia privada: prompt37r/checkpoint-0075.json.

## Anexo final de reanudación Prompt 37 — 07/11/2026

Estado A: REGRESIÓN PEST AUTORIZADA COMPLETADA, limitada a los 75 casos compatibles autorizados. Se ejecutaron 75/75, todos aprobados, con 320 aserciones nuevas, cero fallos y cero errores nuevos; 75 rollbacks y limpiezas completos. Acumulado: 276 casos distintos / 1.724 aserciones, sin duplicados; cero pendientes por entorno y 38 bloqueados por operaciones/contratos que no se ejecutaron. La suite completa de 314 no está aprobada.

R36-039 fue recuperado primero, con 6 aserciones y checkpoint, sin repetir los 201 acreditados. Los dos errores históricos siguen registrados con sus recuperaciones y limitaciones originales. MySQL real aislado y TLS estricto verificados: 52 tablas, 14 migraciones, cero residuos, bases protegidas con denegación comprobada. Servidor apagado con código 0; sin procesos, conexiones ni archivo PID al cierre; sin suspensiones nuevas durante la reanudación.

Evidencia privada: prompt37r/consolidated-final.json, approved-junit-cumulative.json, summary37r.json, checkpoint-0075.json, run/result.json y final-process-power.json. Detalle completo: [evidencias-cierre-regresion-pest.md](evidencias-cierre-regresion-pest.md). Se recomienda preparar Cypress en entorno HTTP aislado; no se ejecutó Cypress ni se autorizan automáticamente sus fixtures u operaciones. Sin commits ni push.