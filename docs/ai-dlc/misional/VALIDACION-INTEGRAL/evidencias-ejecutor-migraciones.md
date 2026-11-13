# Ejecutor local controlado de migraciones — Prompt 16

Fecha: **03/11/2026**, America/Lima. Repositorio `D:\zarate-saas`; rama comprobada `test/integracion-misional`. Se continuó el trabajo existente, incluidos Control16.php y Executor16.php, sin reiniciarlo.

**Clasificación: EJECUTOR PREPARADO — PENDIENTE DE AUTORIZACIÓN DE MIGRACIÓN.** Se preparó y verificó el mecanismo de control y la fijación de conexión del repositorio/migrador Laravel. La ejecución real está expresamente inhabilitada en esta fase: el resultado no autoriza DDL/DML, no habilita Artisan y no acredita una migración completada.

Resultado real: **una conexión, 19 lecturas SQL, cero escrituras y cero métodos de migración llamados**. Repositorio y migrador resolvieron exactamente el PDO guardado. El esquema continúa con **0 tablas**, sin repositorio migrations. MySQL quedó detenido con código nativo **0**. **Pest, Cypress, migraciones y seeders: NO EJECUTADOS.**

## 1. Estado recuperado y conservación

Se revisaron los informes de TLS, adaptadores y guardas SQL, sus scripts/perfiles, configuración PHPUnit y las implementaciones instaladas de Migrator, DatabaseMigrationRepository y ConnectionResolverInterface. Se reutilizó el inventario de migraciones del Prompt 15, revalidando los 14 nombres/hashes contra los archivos actuales, sin ejecutar su código.

Git tenía pendientes los dos documentos del Prompt 15. Se conservaron y no se publicaron archivos de `.tools`. La comprobación final por hashes confirmó **52 archivos JSON de resultados del Prompt 15 y sus dos documentos sin cambios** (`preservation-result.json`). El gate de proceso del Prompt 16 y sus capturas se escribieron en su propio directorio; no se sobrescribió el gate anterior para reutilizar una aprobación histórica.

## 2. Componentes y archivos locales

Se mantienen PHP portable **8.4.26**, MySQL **8.4.11**, perfiles exclusivos del Prompt 13, credencial restringida del Prompt 11, APP_KEY del perfil Pest del Prompt 12 y CA/certificado TLS del Prompt 13. No se duplicaron claves, credenciales o perfiles.

| Recurso local | Cambio y finalidad |
| --- | --- |
| `evidence/prompt16/Control16.php` | Política cerrada de operaciones; manifiesto de 14 migraciones; PinnedResolver16 y PreparedMigrator16; construcción y verificación del contexto real de repositorio/migrador |
| `evidence/prompt16/Executor16.php` | Entrada PHP local, perfil pest y modos diagnostic/preview; salidas saneadas, salida 21 al bloquear; sin CLI Artisan genérica |
| `evidence/prompt16/Checks16.php` | Controles offline de política/configuración y rechazo por falta de identidad viva; no despacha comandos destructivos |
| `evidence/prompt16/EntryChecks16.ps1` | Ocho rechazos desde la entrada real Executor16.php con variables incompatibles, restauradas después de cada caso; cero conexiones |
| `evidence/prompt14/MigrationGuard14.php` | Guarda SQL existente, extendida para seleccionar únicamente evidencia de proceso prompt15 o prompt16; captura la fase en cada instancia. Se conserva prompt15 como valor predeterminado |
| `evidence/prompt15/CheckLive15.ps1` | Verificador Windows compartido: admite esas dos fases mediante ValidateSet; mismos controles de PID/fecha de creación/listener/hash/TTL; sin argumento de ruta arbitraria |
| `evidence/prompt15/Run15.ps1` | Supervisor compartido con EvidencePhase limitado a prompt15/prompt16; cliente fijo para cada fase y capturas propias. Prompt 16 usa una sola conexión diagnóstica Pest, sin segunda ejecución HTTP |

Se guardó el código previo de los tres componentes compartidos en `evidence/prompt16/backup`, sin copiar claves privadas. Los nuevos resultados, auditoría y snapshots están bajo `evidence/prompt16`. No se modificaron los informes históricos ni los otros Bolts.

## 3. Operaciones permitidas y bloqueo

| Operación | Estado y alcance |
| --- | --- |
| diagnostic | Permitido con configuración y prueba viva; construye el contexto Laravel y ejecuta exclusivamente lecturas autorizadas |
| preview | Permitido: inventario estático de archivos, nombres y SHA-256; cero SQL y ningún require/up/down de migraciones |
| migrate real | Bloqueado antes de abrir la ruta de ejecución |
| migrate:fresh, db:wipe, migrate:reset, migrate:rollback, db:seed | Bloqueados por política; no se invocaron para probar su rechazo |
| migrate --pretend | No se ofrece: no se presupone que cargar/ejecutar métodos de migración sea inocuo por usar pretend |
| --force o modos desconocidos | Rechazados; ningún argumento desactiva las guardas |

Las pruebas de operaciones destructivas evalúan **cadenas contra una función pura de política**; no son comandos ejecutados. PreparedMigrator16 hereda del Migrator real de Laravel, pero sobrescribe run/reset/rollback para bloquearlos. No se llamaron esos métodos ni createRepository/getRan/log/up/down en esta fase. El ejecutor no expone una opción para habilitar escritura y solo devuelve informes, no los objetos de conexión.

## 4. Configuración efectiva y fijación de conexión

El XML local de PHPUnit se procesa con Loader y PhpHandler reales **dentro del proceso del ejecutor**, sin runner/discovery de tests. Sus variables force=false no silencian valores heredados incompatibles. Después se utiliza la factory existente para cargar entorno/configuración y rechazar base/puerto/usuario/APP_ENV, CA o recursos compartidos incorrectos.

Se exigen testing, mysql, **127.0.0.1:3308**, base/usuario **zarate_test**, DB_URL/socket vacíos, CA fijada y verificación de certificado activa. Se conservan storage, temporales, sesiones array, caché array, cola null, correo array, logs y caches bootstrap privados. No se cargan `.env`/`.env.testing` de desarrollo ni se arrancan kernels HTTP/consola completos.

PinnedResolver16 implementa la interfaz real de resolución de Laravel. Únicamente acepta mysql o el nombre por defecto equivalente; vuelve a comprobar el estado efectivo y la guarda viva en cada resolución. DatabaseMigrationRepository y PreparedMigrator16 comparten ese resolver. La resolución del migrador no delega en callbacks estáticos alternativos ni permite nombres de otras conexiones.

En el diagnóstico se comprobó por igualdad estricta:

- Conexión del repositorio = conexión resuelta por el migrador = conexión del guard.
- PDO del repositorio = PDO de la conexión de migración acreditada.
- Una consulta real por esa conexión devolvió SELECT 1 correctamente.
- Un cambio posterior de puerto, la pérdida/sustitución de PDO y la selección de otra conexión desde el repositorio se rechazaron sin conectarse a esos destinos.

La comprobación no depende de ejecutar antes otro proceso diagnóstico exitoso. El objeto guardado conserva PDO/configuración/CONNECTION_ID y prueba de proceso; revalida identidad/grants en la misma sesión. El supervisor mantiene handles y el verificador Windows comprueba PID/fecha de creación, ejecutable, opciones, listener, PID-file y hashes. El gate caduca a los 120 segundos y no es una autorización permanente de migración.

La única conexión se abrió con el MySqlConnector existente en modo de lectura, omitiendo sus USE/SET implícitos. **La inicialización de charset/modos para una futura ejecución con escritura sigue pendiente de revisión**; no se confunde esa omisión diagnóstica con una configuración productiva del migrador.

## 5. Resultado SQL vigente

Fuente: `evidence/prompt16/auth-result.json`, salida **0 / EXECUTOR_CONTEXT_VERIFIED_WRITES_BLOCKED**.

| Dato | Resultado |
| --- | --- |
| Servidor | MySQL 8.4.11, proceso propio loopback 127.0.0.1:3308 |
| Base / cuenta efectiva | zarate_test / zarate_test@127.0.0.1; no root |
| Datadir | `D:\zarate-saas\.tools\misional-isolated\mysql-data\` |
| UUID / sesión | UUID coincide con auto.cnf y misma sesión PDO, sin publicar sus identificadores |
| TLS | Verificación estricta de CA/certificado/IP; TLS_AES_256_GCM_SHA384 |
| Grants | Dos filas: USAGE global y exactamente nueve privilegios del esquema literal zarate\_test; sin delegación, grants peligrosos globales u otros esquemas |
| Privilegios de esquema | SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES |
| Rol / partial_revokes | NONE / 0 |
| Tablas | 0; tampoco existe migrations |
| Lecturas / escrituras | **19 / 0**; incluyen las revalidaciones internas y SELECT 1 a través de Laravel |

No se consultó zarate_dev ni se intentó autenticar con un administrador. Los grants se leyeron con la cuenta restringida. REQUIRE SSL no se reconsultó como atributo de cuenta en esta fase; se conserva la evidencia del Prompt 11 y se verifica aquí la sesión TLS estricta efectiva. Los privilegios DDL concedidos no se probaron creando tablas.

## 6. Verificaciones ejecutadas

| Verificación | Resultado |
| --- | --- |
| Checks16.php | **20 controles aprobados, 0 fallidos**: tres positivos y 17 rechazos esperados; cero conexiones/SQL |
| Entrada real del ejecutor | **Ocho rechazos esperados, 0 fallidos**: base, puerto, administrador, APP_ENV, CA incorrecta, Sanctum incompatible y destinos de storage/caché compartidos. Salida 21, cero conexiones/lecturas en cada caso; `entry-checks-result.json` |
| Vista previa final | **0 / STATIC_PREVIEW_VERIFIED**, 14 archivos y hashes coincidentes, cero SQL/métodos de migración |
| PHPUnit original incompatible | **21 esperado**, con Loader/PhpHandler existentes, sin runner ni SQL |
| Contexto real del ejecutor | **0**, una conexión y 19 lecturas, mismo PDO del repositorio/migrador |
| Invalidaciones en contexto real | Tres rechazos esperados: puerto cambiado tras la guarda, PDO sustituido y otra conexión del repositorio |
| Sintaxis | Control16.php, Executor16.php, Checks16.php y MigrationGuard14.php aprobados con php -l; Run15.ps1 y CheckLive15.ps1 sin errores de parser |
| Migraciones, seeders, Pest y Cypress | **NO EJECUTADOS**, según restricción; no se presentan como aprobados |

Los negativos offline cubren nueve operaciones no autorizadas, base/puerto/administrador/APP_ENV/caché/sesiones compartidas, TLS no verificado e identidad de conexión ausente. Los nombres peligrosos se comprobaron como datos de política, sin llamar a Artisan. La vista previa no sustituye una prueba SQL generada ni acredita que las migraciones hayan funcionado.

La primera vista previa, anterior a la continuación, quedó con **21 / Error**, sin conexiones ni SQL. La definición de la subclase Migrator ocurría antes de cargar el autoloader del backend. Se corrigió el orden de carga en Control16.php y se repitió la comprobación con salida 0. Se conservan `preview-result.json` y `preview-first-blocked.json`; el resultado aprobado está separado en `preview-result-final.json`. No se borró ni convirtió el fallo original en aprobación histórica.

Comandos de diagnóstico realmente utilizados (rutas relativas al repositorio):

```powershell
.tools/php/php.exe .tools/misional-isolated/evidence/prompt16/Executor16.php pest preview
.tools/php/php.exe .tools/misional-isolated/evidence/prompt16/Checks16.php
.tools/php/php.exe .tools/misional-isolated/evidence/prompt14/PhpunitPrecedence14.php original
.tools/misional-isolated/evidence/prompt15/Run15.ps1 -EvidencePhase prompt16
```

El supervisor invocó Executor16.php pest, equivalente al modo diagnostic predeterminado; no ejecutó Artisan. No se suman repeticiones de los controles ni revalidaciones internas como casos adicionales.

## 7. Arranque/cierre y desarrollo

Un único ciclo MySQL de Prompt 16. Preflight a las **13:26:44 -05:00**, **727 objetos** comprobados; monitor **21408**, servidor **15508**. Validación de opciones/binario y prueba auxiliar de cierre: salida 0. TLS, ACL/propietarios, enlaces y destinos exclusivos comprobados antes de abrir la conexión.

Cierre a las **13:27:11 -05:00**: servidor **0**, monitor **3221225786 / 0xC000013A** por Ctrl+C, supervisor **0**; shutdown completo, **0 ERROR/FATAL**, una advertencia de CA local autofirmada. El cierre se hizo solo sobre la consola exclusiva y handles acreditados, sin root, taskkill o servicios ajenos.

Después se comprobaron **751 objetos**, los **303 archivos de desarrollo y cuatro configuraciones protegidas**, sin diferencias de contenido/metadatos/ACL. Log histórico de inicialización intacto. Snapshot independiente a las **13:28:09 -05:00**: **0 mysqld, 0 listeners en 3308/8001/5174, sin PID-file y 0 archivos generados en storage/caches bootstrap**. Los cambios internos de archivos del motor al arrancar/cerrar no equivalen a escrituras SQL de aplicación.

## 8. Migraciones inspeccionadas y riesgos

Se revalidaron las **14 migraciones** del inventario del Prompt 15; ni nombres ni hashes cambiaron. Orden previsto y dependencias:

| Orden | Archivo en backend/database/migrations | Dependencia principal |
| --- | --- | --- |
| 1 | 0001_01_01_000000_create_users_table.php | Scaffold users, password_reset_tokens y sessions |
| 2 | 0001_01_01_000001_create_cache_table.php | cache y cache_locks |
| 3 | 0001_01_01_000002_create_jobs_table.php | jobs, job_batches y failed_jobs |
| 4 | 2026_10_01_131619_create_personal_access_tokens_table.php | Tokens Sanctum |
| 5 | 2026_10_01_131621_create_permission_tables.php | Tablas/pivotes configurados de permisos y caché array aislada |
| 6 | 2026_10_01_150000_create_saas_core.php | users previo; instituciones y auditoría |
| 7 | 2026_10_01_160000_create_academic_structure.php | Instituciones; años, periodos, niveles, grados, secciones y asignaturas |
| 8 | 2026_10_01_170000_create_people.php | Instituciones/users; personas y vínculo familiar |
| 9 | 2026_10_02_000000_create_enrollment_tables.php | Personas y estructura académica |
| 10 | 2026_10_02_120000_create_courses_and_teacher_assignments.php | Docentes y estructura académica; asignaciones antes de cursos |
| 11 | 2026_10_02_140000_create_classroom_tables.php | Cursos/users; unidades y materiales |
| 12 | 2026_10_04_100000_create_learning_tables.php | Cursos, unidades, personas y periodos |
| 13 | 2026_10_05_100000_create_attendance_tables.php | Cursos, personas y users |
| 14 | 2026_10_05_110000_create_academic_office_tables.php | Instituciones/personas/users; oficina y notificaciones |

La vista previa lee texto/hashes; no carga ni ejecuta archivos de migración. No se detectaron conexiones externas explícitas, propiedades $connection o seeders automáticos en los archivos coincidentes. No se garantiza por regex el comportamiento de cualquier código futuro: un cambio de archivo obliga a revisar el manifiesto, no a actualizar hashes para ocultar diferencias.

Riesgos ya identificados y conservados: DDL MySQL puede quedar confirmado parcialmente; los down eliminan tablas/columnas. La migración SaaS elimina users.name e índice global de email, cambia nulabilidad y crea índice institucional; si hubiera usuarios previos, realiza DML condicional. Las FK, índices compuestos/únicos y columnas generadas requieren el orden y versión MySQL previstos. La migración de permisos elimina una entrada de caché: exigir store array. No desactivar restricciones o usar SQLite para forzar aprobación.

Laravel necesitará crear su repositorio migrations antes de registrar ejecuciones. Esa escritura y los 14 archivos deben formar parte de la autorización posterior, sin seeders implícitos ni datos institucionales. No hay tablas iniciales creadas en esta fase.

## 9. Límites y condiciones antes de la primera migración

El mecanismo está preparado para **solicitar autorización técnica**, no para activar escrituras mediante un argumento. Para la primera migración controlada falta:

1. Autorizar expresamente la operación sobre zarate_test, los 14 archivos/hashes, el repositorio migrations y el DML condicional ya identificado; excluir fresh/wipe/reset/rollback/seeders.
2. Revisar y habilitar de forma acotada la ruta de escritura del ejecutor. Hoy run/reset/rollback y la guarda SQL diagnóstica siguen cerrados; no basta con cambiar el modo o agregar --force. Conservar el resolver fijado y las comprobaciones vigentes antes de cualquier escritura/reconexión.
3. Preparar los servicios/facades necesarios para ejecutar migraciones reales y verificar charset/modos de sesión, sin arrancar indiscriminadamente proveedores que puedan reemplazar la conexión. Revalidar la identidad exacta de repositorio/migrador/PDO tras esa preparación. No se acredita el arranque completo con la mera construcción de sus objetos.
4. Crear un punto de recuperación privado y consistente del entorno aislado con MySQL detenido, y registrar inventario antes de escribir. Este backup de datos no se realizó aquí.
5. Repetir preflight y acreditación SQL dentro del supervisor de la ejecución autorizada, con schema vacío confirmado, handles conservados y parada disponible. Ningún JSON actual autoriza una ejecución posterior por sí solo.

Si cualquiera de esas condiciones falla, conservar el bloqueo. No se garantiza todavía una migración real exitosa ni la compatibilidad de ejecución completa Pest/HTTP. La ventana de 120 segundos y la política de consultas son deliberadamente diagnósticas; una futura operación larga exige diseño de revalidación revisado, no su desactivación.

Recuperación ante fallo parcial futuro: detener nuevas escrituras, guardar el error saneado y el inventario real de tablas/columnas/repositorio migrations; cerrar únicamente el proceso propio; comparar desarrollo y diagnosticar qué DDL quedó confirmado. No ejecutar automáticamente down/fresh/wipe, reintentar, reinicializar datadir ni editar migrations para aparentar éxito. Una reparación/restauración exige plan revisado y debe preservar la evidencia del fallo.

## 10. Documentación y conclusión

Solo se crean para Git el prompt íntegro del Prompt 16 y este informe. Los dos documentos pendientes del Prompt 15 permanecen intactos. Los scripts y resultados locales no se publican. No hubo cambios funcionales, .env activos, bases/tablas, privilegios, dependencias, otros Bolts, commits, push, merge o PR.

El prompt coincide por SHA-256 con el adjunto original. La auditoría local de secretos no encontró coincidencias fuera de sus recursos dedicados; no se copiaron claves privadas ni se publicaron credenciales. Audit16.php también aprobó php -l y EntryChecks16.ps1 aprobó el parser/ejecución PowerShell. `git diff --check` y las verificaciones de whitespace de los documentos nuevos no detectaron errores; solo se advirtió normalización CRLF/LF del prompt. `.tools` continúa ignorado y sin archivos rastreados. Git muestra los dos documentos del Prompt 16 junto a los dos pendientes previos del Prompt 15, conservados.

**EJECUTOR PREPARADO — PENDIENTE DE AUTORIZACIÓN DE MIGRACIÓN**, limitado al mecanismo de control solicitado. La habilitación revisada de escritura y sus condiciones anteriores siguen pendientes; la validación integral no está completada.
