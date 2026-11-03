# Guardas vigentes de identidad SQL e integración Laravel — Prompt 15

Fecha: 02/11/2026, America/Lima. Rama: `test/integracion-misional`. HEAD inicial: `ed88fdf` (`docs(qa): registrar adaptadores aislados Laravel y Pest`). Git inicialmente limpio. Repositorio `D:\zarate-saas`.

**Resultado: CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES.** Las guardas SQL de lectura quedaron integradas y verificadas con las conexiones reales de Laravel en ambos perfiles. El ciclo final aprobó dos conexiones, **34 lecturas SQL y cero escrituras**, y MySQL cerró con código 0. No se habilitó todavía un ejecutor de migraciones ni el arranque completo: el filtro SQL permite solo las lecturas diagnósticas y conserva el bloqueo de fase antes de proveedores/kernel. No se presenta esa restricción deliberada como autorización operativa de escritura.

La siguiente etapa puede preparar la ejecución controlada usando las identidades/grants comprobados, pero deberá integrar un alcance explícito de escritura, revisar la inicialización de sesión del conector y el arranque completo y obtener autorización del comando concreto. **No se ejecutaron migraciones, seeders, Pest ni Cypress.** Las pruebas integrales no están completadas.

## 1. Recuperación y fuentes

Se leyeron los informes de base/cuenta, corrección TLS y adaptadores Laravel/Pest. Se inspeccionaron los adaptadores, supervisor Windows y perfiles privados existentes; el TestCase, MySqlConnector, MySqlConnection, DatabaseManager y DatabaseServiceProvider instalados; configuración PHPUnit y las 14 migraciones existentes. No se cambió código funcional o configuración activa del backend/frontend.

Se reutilizan PHP **8.4.26**, MySQL portable **8.4.11**, Laravel **13.34.0**, CA/certificado del Prompt 13 y credencial de pruebas del Prompt 11. No se usó root para autenticar Laravel ni se cambiaron cuentas, grants o secretos. La base sigue siendo `zarate_test` en el datadir exclusivo; el nombre de esquema por sí solo no se acepta como prueba de aislamiento.

## 2. Adaptadores modificados y recursos nuevos

Se modificaron únicamente estos scripts locales existentes en `evidence/prompt14`, con copia previa de su código en `evidence/prompt15/backup`:

| Script local | Cambio |
| --- | --- |
| `MigrationGuard14.php` | Sustituye el bloqueo sin comprobación SQL por validadores de identidad/grants y LiveSqlGuard15. Construye PDO mediante MySqlConnector real, enlaza ese PDO a MySqlConnection y al DatabaseManager de la Application y revalida antes de cada consulta permitida |
| `Adapter14.php` | Los hooks antes de RegisterProviders y tras recarga de configuración invocan la guarda vigente antes de mantener el bloqueo de ejecución de fase |
| `TestCase14.php` | Cada createApplication local aplica configuración, invoca la guarda real y conserva el bloqueo antes de kernel/traits de BD |

Se conservan los nombres/entradas HTTP, bootstrap Pest y XML local existentes; no se creó otro juego paralelo de perfiles, claves o adaptadores. Los informes históricos de Prompt 14 no se reescribieron.

Recursos nuevos bajo `evidence/prompt15`:

- `CheckLive15.ps1`: prueba vigente del árbol Windows y listener, ejecutada desde PHP antes de conectar y durante las revalidaciones.
- `Offline15.php`: validadores puros con fixtures de identidad/grants y negativos de configuración; no abre SQL.
- `Diagnostic15.php`: Application configurada por perfil, guarda real, dos lecturas mediante DatabaseManager/MySqlConnection y negativos de invalidación. No ejecuta un runner ni atiende HTTP.
- `Run15.ps1`: adaptación del supervisor existente con los mismos mecanismos de handles/consola/cierre. Se conserva la evidencia separada de cada ciclo, sin duplicar la lógica de adaptadores.
- JSON de resultados, inventario/hashes de migraciones, estado final y auditor de secretos. Todo permanece ignorado dentro de `.tools`.

## 3. Enlace a la conexión real y prevención de reutilización

Antes de abrir PDO se comprueban configuración efectiva y preflight Windows: rutas/ACL/propietarios/enlaces, binarios/opciones, desarrollo protegido, ausencia de instancia previa, cierre auxiliar y TLS offline. El supervisor inicia exclusivamente MySQL loopback 3308 y conserva los handles del monitor/servidor.

El gate local contiene instante, PID, fecha de creación del monitor/servidor y hashes de configuración/CA; no es un permiso de escritura. CheckLive15 vuelve a consultar CIM, PID-file y listeners reales. Exige exactamente el árbol propio, ejecutable/hash, opciones/destinos y listener 127.0.0.1:3308; caduca a los **120 segundos**. Un PID reutilizado, otro servidor, un proceso detenido o un cambio de configuración invalida la prueba. No se acepta el informe del Prompt 11 o 13 para eludir estos controles.

La guarda conserva en memoria una huella de la configuración de conexión, el PDO concreto, CONNECTION_ID y la identidad del proceso. No publica la huella, que incluye datos privados de configuración. Cada consulta diagnóstica revalida:

1. Perfil y recursos efectivos, incluidos host/puerto/base/principal/TLS.
2. Misma configuración, mismo PDO y ausencia de PDO de lectura alternativo.
3. Mismo proceso vivo, PID/fecha de creación y archivos acreditados.
4. Identidad SQL, datadir/UUID, sesión TLS y grants actuales mediante **ese mismo PDO**.

El DatabaseManager devuelve exactamente esa MySqlConnection, no una conexión paralela utilizada únicamente para certificar otra. Se deshabilita la reconexión transparente: una nueva conexión exige una guarda nueva. Las mutaciones de puerto y sustitución del PDO se rechazaron sin abrir conexión a otro puerto o servidor.

Para respetar la fase de solo lectura, una copia diagnóstica del config omite inicializaciones USE/SET de charset/modos/zona horaria; la base se selecciona en DSN y TLS sigue estricto. Esto **no acredita las inicializaciones de sesión requeridas por un futuro migrador**. El config persistido del proyecto no se modificó.

El callback Laravel acepta únicamente `SELECT 1 AS healthy` y `SELECT DATABASE() AS name`, sin bindings. Las verificaciones internas son SELECT de identidad, SHOW de cifrado y SHOW GRANTS. No se construyó un comando que migre automáticamente. El bloqueo de fase sigue impidiendo el kernel, traits de transacciones y proveedores completos; no existe un flag habilitado que convierta este diagnóstico en ejecución de pruebas.

Alcance: son guardas del mecanismo local revisado, no una barrera contra un operador que ejecute Artisan por fuera, edite código o use directamente PDO. El futuro ejecutor deberá evitar rutas alternativas y acoplar la revisión vigente justo antes de cada escritura autorizada. El TTL es un límite conservador de estos diagnósticos, no un diseño de renovación para suites largas ya probado.

## 4. Identidad, TLS y privilegios vigentes

Resultados iguales en perfiles **pest** y **http**, obtenidos en procesos PHP separados:

| Comprobación | Resultado final |
| --- | --- |
| Versión | MySQL **8.4.11** |
| Host y puerto | **127.0.0.1:3308**, PDO por TCP y listener del servidor acreditado |
| Base / cuenta efectiva | **zarate_test / zarate_test@127.0.0.1** |
| Datadir | `D:\zarate-saas\.tools\misional-isolated\mysql-data\` |
| UUID | Coincide con auto.cnf del destino; valor no publicado |
| Rol activo | **NONE** |
| partial_revokes | **0**; alcance de base con guion bajo escapado |
| TLS | CA fijada y verificación de certificado/identidad activa; **TLS_AES_256_GCM_SHA384** en ambas sesiones |
| SHOW GRANTS | Exactamente dos filas: USAGE global y nueve permisos del esquema literal `zarate\_test` |
| Permisos del esquema | SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES |
| Delegación/globales peligrosos/otros esquemas | Ninguno en los grants efectivos examinados; cualquier fila, rol, privilegio o sufijo ajeno al formato autorizado bloquea |
| Tablas existentes | **0**, sin tablas académicas ni repositorio migrations |

SHOW GRANTS se consulta con la propia cuenta restringida. No se lee mysql.user ni se consulta zarate_dev; no se accede a hashes de autenticación. El rechazo de grants ajenos se prueba con fixtures offline, y la ausencia real de concesiones ajenas se verifica en los grants actuales. No son intentos ejecutados contra otras bases.

MySQL 8.4 no incluyó REQUIRE SSL en la fila USAGE observada. Se corrigió el parser para el formato vigente, sin atribuirle un dato que SHOW GRANTS no devolvió. **El requisito SSL de la cuenta fue acreditado en Prompt 11, no reconsultado como atributo en esta fase**; aquí sí se verifican TLS estricto y cifrado efectivos en cada sesión. No se bajó la verificación para lograr la conexión.

## 5. Verificaciones y resultados exactos

| Grupo final | Resultado y evidencia local |
| --- | --- |
| Validadores offline | **22 aprobados, 0 fallidos**: dos fixtures positivos y 20 rechazos esperados; `offline-result-final.json` |
| PHPUnit real sin runner | XML local: **0**; XML original incompatible: **21 esperado**. Se usaron Loader/PhpHandler, sin ejecutar Pest/PHPUnit como suite; `phpunit-positive-final.json`, `phpunit-negative-final.json` |
| Perfil Pest diagnóstico real | **0 / LIVE_LARAVEL_SQL_GUARD_VERIFIED**, una conexión y **17 lecturas**, cinco validaciones de identidad/grants; `attempt5/auth-result.json` |
| Perfil HTTP diagnóstico real | **0 / LIVE_LARAVEL_SQL_GUARD_VERIFIED**, una conexión y **17 lecturas**, cinco validaciones; `attempt5/http-result.json` |
| Invalidación real | En cada perfil se rechazaron cambio de configuración y pérdida/sustitución del PDO; no se intentó conectar al destino alterado |
| Hook antes de proveedores | En cada perfil revalidó SQL y terminó en el bloqueo de fase esperado, sin arrancar proveedores |
| Sintaxis | Cinco archivos PHP modificados/nuevos comprobados con php -l; ambos scripts PowerShell sin errores de parser |
| Migraciones/seeders/Pest/Cypress | **0 ejecutados**; no se presentan como aprobados |

No se suman las diez revalidaciones SQL como diez casos funcionales independientes. Las 34 lecturas incluyen las verificaciones repetidas y las cuatro consultas realizadas a través de Laravel. No hubo SQL de escritura ni comandos de esquema. Los cambios de archivos internos que realiza el motor al arrancar/cerrar no se presentan como ausencia absoluta de escrituras de disco.

Los 20 negativos offline cubren puerto, base, administrador, datadir, UUID/otro servidor, versión, rol, identidad sin datadir, grant global, otro esquema, sufijo global inesperado, configuración efectiva de puerto/base/usuario, TLS desactivado, APP_ENV, caché/storage compartidos, falta de prueba de proceso vivo y bloqueo de escritura de fase. Los negativos de identidad/grants usan fixtures controlados: no se montaron servidores falsos ni se hicieron conexiones a desarrollo. TLS inválido en esta fase se comprueba mediante configuración desactivada rechazada; el handshake con CA incorrecta sigue siendo evidencia del Prompt 13, no una repetición actual.

## 6. Incidencias conservadas y ciclos de MySQL

| Ciclo | Resultado diagnóstico | Monitor / servidor | Cierre servidor |
| --- | --- | --- | --- |
| Inicial | **21**, rechazo durante validación de identidad; instrumentación inicial no fiable para contar lecturas antes de completar el constructor | 9968 / 23348 | **0** |
| attempt2 | **21**, una lectura instrumentada; rechazo en normalización de datadir | 28344 / 24392 | **0** |
| attempt3 | **21**, una lectura; evidencia de datadir con escapes adicionales y rol codificado por JSON_OBJECT | 25168 / 28928 | **0** |
| attempt4 | **21**, tres lecturas; identidad ya correcta, parser esperaba REQUIRE SSL que no aparece en SHOW GRANTS | 18148 / 25024 | **0** |
| attempt5 | **0** en ambos perfiles, dos conexiones y 34 lecturas | 12564 / 28492 | **0** |

El primer informe mostraba cero lecturas porque el objeto guard no había terminado de construirse; **no se considera prueba de cero SQL**. Se añadieron contadores estáticos que también cubren fallos del constructor. No se inventa un total exacto acumulado de lecturas del primer ciclo. En los intentos 2–4 están acreditadas cinco lecturas en conjunto; las 34 corresponden exclusivamente al ciclo final.

Se sustituyó JSON_OBJECT por columnas SQL directas y fetch asociativo, manteniendo las comparaciones exactas; luego se ajustó el parser al formato real de SHOW GRANTS. No se cambiaron permisos, datadir, servidor o TLS para aprobar. Las cuatro ejecuciones bloqueadas siguen registradas y no se convierten retrospectivamente en pruebas aprobadas.

Una inspección auxiliar del inventario de migraciones tuvo un error sintáctico PowerShell al canalizar foreach directamente. Se corrigió usando un array intermedio y se guardó `migration-inventory.json`; no se ejecutó SQL ni se modificaron migraciones por ese incidente.

## 7. Detención y conservación

Todos los ciclos se cerraron en finally mediante la consola exclusiva y handles comprobados; no se usó root, mysqladmin, taskkill ni terminación por nombre. Cada monitor devolvió **3221225786 / 0xC000013A** por Ctrl+C; los servidores devolvieron **0**, sin ocultar la diferencia.

Ciclo final: preflight a las **18:41:42 -05:00**, **682 objetos** revisados; cierre a las **18:42:26 -05:00**, **706 objetos** revisados, **0 ERROR/FATAL y una advertencia** de CA local autofirmada. --validate-config, --version y prueba auxiliar de cierre terminaron 0. El supervisor final terminó 0.

En cada cierre se contrastaron **303 archivos de desarrollo y cuatro configuraciones protegidas** por inventario, hashes/metadatos/ACL; sin cambios. Log histórico de inicialización intacto. Estado independiente a las **18:44:14 -05:00**: **0 mysqld, 0 listeners en 3308/8001/5174, sin PID-file y 0 archivos generados en storage Pest/HTTP o caches bootstrap**.

No se reinicializó MySQL, crearon/borraron bases o tablas, alteraron .env, usuarios, contraseñas o grants. La cuenta/schema siguen intactos; no se eliminó evidencia anterior.

## 8. Plan de migraciones — lectura de código, NO EJECUTADO

Inventario de **14 archivos ordenados por nombre**, con hashes locales en `migration-inventory.json`. Laravel deberá crear primero su repositorio migrations en zarate_test mediante el ejecutor futuro autorizado; esa tabla aún no existe.

| Orden | Archivo en backend/database/migrations | Dependencia / efecto principal |
| --- | --- | --- |
| 1 | `0001_01_01_000000_create_users_table.php` | users, password_reset_tokens, sessions; scaffold inicial |
| 2 | `0001_01_01_000001_create_cache_table.php` | cache/cache_locks; no obliga a usar caché de BD en testing |
| 3 | `0001_01_01_000002_create_jobs_table.php` | jobs/job_batches/failed_jobs; no autoriza workers |
| 4 | `2026_10_01_131619_create_personal_access_tokens_table.php` | Tokens polimórficos Sanctum |
| 5 | `2026_10_01_131621_create_permission_tables.php` | Tablas/pivotes configurados de permisos; depende de permission config. Borra la entrada de caché de permisos: exigir store array aislado |
| 6 | `2026_10_01_150000_create_saas_core.php` | institutions/audit_logs, adaptación de users; depende de users |
| 7 | `2026_10_01_160000_create_academic_structure.php` | Años, periodos, niveles, grados, secciones, asignaturas; depende de instituciones |
| 8 | `2026_10_01_170000_create_people.php` | Estudiantes/docentes/apoderados y vínculo familiar; depende de instituciones/users; claves compuestas institucionales |
| 9 | `2026_10_02_000000_create_enrollment_tables.php` | Conceptos/pagos/matrículas/historial; depende de personas y estructura académica |
| 10 | `2026_10_02_120000_create_courses_and_teacher_assignments.php` | Asignaciones antes de courses; depende de docentes/asignaturas/grados/secciones/año |
| 11 | `2026_10_02_140000_create_classroom_tables.php` | Unidades y materiales; depende de courses/users |
| 12 | `2026_10_04_100000_create_learning_tables.php` | Actividades, entregas, evaluaciones, notas e historial; depende de cursos/unidades/personas/periodos |
| 13 | `2026_10_05_100000_create_attendance_tables.php` | Sesiones, registros, justificaciones e historial; depende de cursos/personas/users |
| 14 | `2026_10_05_110000_create_academic_office_tables.php` | Solicitudes/documentos/comunicados/notificaciones; depende de instituciones/personas/users |

No se identificaron conexiones externas explícitas, propiedades de conexión específicas ni llamadas automáticas a seeders en estos archivos. Es lectura estática, no prueba de ejecución. La configuración efectiva de nombres de tablas de permisos y de conexión por defecto deberá comprobarse de nuevo; no basta con pasar un parámetro de base a un comando mientras otra conexión permanece activa.

Riesgos reales:

- La migración SaaS elimina `users.name` y su índice global de email, modifica nulabilidad y crea el índice institucional. Si hubiera usuarios previos, inserta institución y actualiza usuarios; no es solo DDL. Con esquema vacío, esa rama no debería ejecutarse, pero se debe verificar nuevamente antes de migrar.
- Todos los down inspeccionados eliminan tablas o columnas; no son una recuperación inocua. MySQL puede confirmar DDL parcialmente y DatabaseTransactions no revierte todo DDL.
- Existen claves foráneas, índices compuestos/únicos y columnas generadas almacenadas. Respetar orden, versión MySQL y colación; no desactivar FK ni cambiar MySQL por SQLite para forzar aprobación.
- Los seeders demo no son requisito de migración automática y permanecen fuera de esta autorización. Las suites con factories necesitan permiso posterior de fixtures sintéticos.

## 9. Condiciones y recuperación de la siguiente etapa

Antes de la primera migración real falta:

1. Autorizar el comando y los 14 hashes concretos, el repositorio migrations y cualquier DML condicional del archivo SaaS; sin seeders, migrate:fresh, db:wipe o restauraciones automáticas.
2. Preparar/revisar el ejecutor de escritura con la misma conexión guardada y alcance delimitado; el callback diagnóstico actual **bloquea DDL/DML y no es un migrador habilitado**. Mantener guardas en cada Application y ante reconexiones/cambio de proceso.
3. Resolver cómo arrancar proveedores/kernel sin perder la configuración aislada ni la instancia guardada del DatabaseManager. Verificar inicialización de charset/modos de sesión del conector de ejecución; no reutilizar ciegamente las omisiones diagnósticas. No se probó el arranque completo en esta fase.
4. Repetir preflight, prueba de cierre e identidad/grants vigentes dentro del supervisor que conservará los handles durante la operación; confirmar esquema vacío y ausencia de destinos de desarrollo.
5. Disponer de punto de recuperación privado y consistente del entorno aislado, con MySQL detenido limpiamente y rutas/ACL comprobadas; preparar inventario antes de escribir. No se creó backup de datos en esta fase ni se autoriza copiar claves a ubicaciones compartidas.

Si una migración falla: detener nuevas operaciones, conservar error saneado, tabla migrations e inventario real de tablas/columnas; cerrar solo el árbol propio; comparar desarrollo; diagnosticar qué DDL quedó confirmado. **No** reintentar automáticamente, eliminar tablas, ejecutar down/fresh/wipe, reinicializar datadir o alterar la tabla migrations para aparentar éxito. Cualquier reparación/restauración del entorno aislado requiere plan específico revisado; conservar la evidencia del fallo antes de actuar.

Para Pest: confirmar previamente ausencia de RefreshDatabase/DatabaseMigrations o comandos de limpieza en la selección autorizada y revisar traits antes del kernel. Las transacciones y factories deben usar únicamente mysql guardado y esquema zarate_test; bloquear conexiones alternativas. Mantener pendientes las suites con seeders y la prueba de denegación sobre zarate_dev cuyo propósito requiere revisión. No ejecutar composer test, que incluye tareas previas, como sustituto del lanzador aislado.

## 10. Decisión y documentación

Las guardas vigentes de lectura, los privilegios y el enlace a la conexión real están comprobados. **No quedan fallos de los validadores en la corrida final; sí quedan ajustes del ejecutor y arranque completo antes de habilitar escritura.** Por eso no se clasifica aún como apto operativo para migrar. Las comprobaciones negativas son controles de infraestructura, no pruebas académicas aprobadas.

Se crean para Git únicamente `prompt-15-guardas-identidad-sql.md` (copia literal del adjunto) y este informe. Los scripts y registros privados permanecen en `.tools`; no se modificaron otros Bolts ni se hicieron commits, push, merge o PR.

Cierre documental: el prompt coincide por SHA-256 con el adjunto. La auditoría inicial examinó **190 archivos**, incluidos los scripts actuales/previos locales y los dos documentos, sin coincidencias de secretos fuera de sus recursos dedicados. No se publicaron claves, contraseñas ni hashes de autenticación. `git diff --check` y las verificaciones adicionales de whitespace de los dos documentos nuevos no detectaron errores; solo hubo advertencia CRLF/LF del prompt. El auditor PHP también pasó sintaxis, además de los cinco archivos citados en la tabla. `.tools` está ignorado y sin archivos rastreados; Git muestra solo los dos documentos nuevos de esta fase.

Los verificadores del Prompt 14 son históricos y algunos probes esperan el bloqueo sin SQL de aquella fase. No se reutilizaron sus resultados como una regresión aprobada del nuevo flujo vivo: la comprobación vigente es la registrada en Prompt 15. La compatibilidad de discovery/runner Pest y el ciclo completo de la Application siguen pendientes.
