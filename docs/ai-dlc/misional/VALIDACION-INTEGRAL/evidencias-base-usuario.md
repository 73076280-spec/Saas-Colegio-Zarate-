# Base y cuenta MySQL exclusivas para pruebas — Prompt 11

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama: `test/integracion-misional`. HEAD inicial: `dd64484` (`docs(qa): registrar rotacion de clave e identidad MySQL aislado`). Estado Git inicial limpio.

**Resultado: BASE Y CUENTA AISLADAS VERIFICADAS.** Se crearon exclusivamente en la instancia aislada la base vacía **zarate_test** y la cuenta **zarate_test@127.0.0.1**, con nueve privilegios de esquema, sin delegación ni privilegios administrativos/globales. Se verificaron identidad, autenticación, permisos y ausencia de tablas; una lectura ajena de metadatos fue denegada con **1142 / 42000**. La instancia terminó detenida con código nativo del servidor **0**.

No se ejecutaron migraciones, seeders ni Pest/Cypress. **Las pruebas de integración siguen sin habilitarse** hasta configurar y verificar Laravel/Cypress con este destino y esta cuenta.

## 1. Fuentes y elección de nombres

Se revisaron íntegramente en esta conversación `plan-aislamiento.md`, `evidencias-correcciones.md`, `evidencias-primer-arranque.md`, `evidencias-identidad-sql.md` y `evidencias-cambio-clave.md`; se contrastó Git para confirmar conservación de los documentos anteriores y se releyó la evidencia de rotación. Se inspeccionaron supervisor y cliente locales, `backend/config/database.php`, `backend/phpunit.xml`, `backend/AGENTS.md`, las migraciones y `backend/tests/Feature/MySqlConnectionTest.php`, sin ejecutarlos ni modificarlos.

Los nombres del prompt eran propuestas, no valores obligatorios. Se eligieron **zarate_test** para esquema y usuario porque phpunit fuerza DB_DATABASE/DB_USERNAME con esos nombres, MySqlConnectionTest los comprueba y AGENTS los exige para las pruebas MySQL. Esto evita crear ahora recursos incompatibles con el código existente. No se alteraron esos contratos.

La exclusividad corresponde a la identidad completa **127.0.0.1:3308 + datadir `.tools/misional-isolated/mysql-data` + cuenta nueva**, no solamente al nombre. No se reutilizó la base de igual nombre observada históricamente en el datadir de desarrollo. Antes de crear se comprobó por SQL que la base candidata no existía y que no había ninguna cuenta `zarate_test` en ningún host de la instancia aislada.

## 2. Precondiciones e identidad anteriores a las escrituras

| Control | Resultado |
| --- | --- |
| Rama y estado | Rama requerida; Git limpio al comenzar |
| Ejecutable | MySQL portable 8.4.11, ruta absoluta y hash coincidentes con la revisión anterior |
| Archivo de opciones | mysql.ini.template exclusivo, contenido/hash intactos y 12 opciones exactas del parser |
| Datadir | Inicialización reconocida, 172 archivos antes del arranque, distinto de `.tools/mysql-data` protegido |
| Rutas físicas | Ancestros/descendientes sin reparse/junctions; archivos sin hardlinks ajenos |
| ACL y propietarios | Contenedor privado; acceso solo de las identidades Windows previamente autorizadas |
| tmp/log/PID | Destinos exclusivos; ningún PID-file residual |
| Puerto/procesos/servicios | 3308 libre; ningún mysqld ni servicio relacionado activo antes del arranque |
| Bind y transportes | Bind 127.0.0.1, puerto 3308, mysqlx=0 y transportes Windows adicionales OFF |
| Privacidad | Credencial administrativa aislada del Prompt 10; ninguna credencial de desarrollo usada |
| Validación no operativa | --validate-config con los argumentos de privacidad de esta corrida: código **0** |
| Cierre disponible | Prueba auxiliar de consola/Ctrl+C: código **0** antes de iniciar MySQL |
| Desarrollo | Snapshots de 303 archivos y cuatro configuraciones protegidas comprobados antes y después |

El preflight registró **342 objetos** a las **11:17:16 -05:00**. Se utilizó la guarda aplicable a una instancia inicializada; no la condición de datadir vacío.

Se arrancó una única instancia con el binario portable y defaults-file explícito en primer lugar, seguida de --console y los controles temporales de privacidad ya utilizados en Prompt 10: binlog, general log, slow log y log-raw desactivados. No se modificó la plantilla ni se ejecutaron cambios de variables mediante SQL. El cliente comprobó también estos valores efectivos antes de crear recursos.

A las **11:17:19 -05:00** se acreditaron monitor PID **340**, servidor hijo PID **28280**, argumentos correctos, PID-file coincidente y único listener del árbol **127.0.0.1:3308**, propiedad del servidor. MySQL X no presentó listener. No se inició Laravel, Vite ni servicio Windows alguno.

La conexión administrativa se estableció mediante TCP explícito y TLS VERIFY_CA con la CA local fijada. Defaults-file privado y --no-login-paths impidieron usar alternativas de desarrollo. Antes de la primera escritura se leyó y validó:

| Identidad SQL | Resultado |
| --- | --- |
| Versión | **8.4.11** |
| Puerto | **3308** |
| Datadir | `D:\zarate-saas\.tools\misional-isolated\mysql-data\` |
| UUID | Coincide con auto.cnf del datadir acreditado; valor conservado solo localmente |
| CURRENT_USER() administrativo | **root@localhost** |
| DATABASE() administrativo | **NULL** |
| Registros de consultas sensibles | Desactivados conforme a los argumentos de proceso |
| Existencia del esquema candidato | **0** coincidencias |
| Existencia del usuario candidato en cualquier host | **0** coincidencias |
| Colación requerida | Disponible |

No se consideró el número de puerto como prueba suficiente: se contrastaron proceso, configuración, datadir y UUID. La comprobación de existencia precedió a todas las creaciones; no se usó IF NOT EXISTS para reutilizar o esconder una colisión.

## 3. Recursos creados y privilegios mínimos

Se ejecutaron exactamente **tres sentencias modificadoras explícitas**, cada una confirmada con código de cliente **0**:

1. CREATE DATABASE de **zarate_test**, con **utf8mb4 / utf8mb4_unicode_ci**, coincidente con los valores de la conexión MySQL en `backend/config/database.php`.
2. CREATE USER de **zarate_test@127.0.0.1**, con secreto exclusivo y **REQUIRE SSL**. No se crearon variantes @localhost o @%, ni se modificó una cuenta preexistente.
3. GRANT de **SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX y REFERENCES**, exclusivamente sobre el esquema nuevo, sin GRANT OPTION.

Justificación de los nueve privilegios:

| Privilegios | Necesidad prevista, no ejecutada en esta fase |
| --- | --- |
| SELECT/INSERT/UPDATE/DELETE | Lectura y fixtures/transacciones de las pruebas futuras; la migración SaaS existente también contiene lectura/actualización de datos |
| CREATE/ALTER/DROP | Tablas y cambios de columnas de migraciones y sus reversas; no conceden autoridad global |
| INDEX/REFERENCES | Índices y claves foráneas declarados en las migraciones académicas |

No se localizaron necesidades actuales de TRIGGER, EVENT, CREATE VIEW, EXECUTE, LOCK TABLES o CREATE TEMPORARY TABLES que justificaran agregarlos. No se concedieron SUPER, FILE, CREATE USER, SHUTDOWN, privilegios dinámicos globales ni delegación. No se ejecutaron DROP, TRUNCATE, DELETE, migraciones o creación de tablas: **conceder DROP dentro del esquema para futuras migraciones no equivale a haberlo ejecutado**.

### Alcance literal de la concesión

Se consultó partial_revokes y resultó **false**. En ese modo el guion bajo puede actuar como comodín en un GRANT de base, por lo que se escapó expresamente: `zarate\_test`. Se verificó que mysql.db almacenaba exactamente ese único patrón para la cuenta, evitando coincidencias como otros nombres similares. El patrón escapado no cambia el nombre real de la base.

El conjunto observado en INFORMATION_SCHEMA.SCHEMA_PRIVILEGES coincide exactamente con los nueve permisos previstos, todos con IS_GRANTABLE=NO. SHOW GRANTS devolvió únicamente USAGE sobre *.* y la concesión específica de esquema. **USAGE no concede privilegios globales de acceso**; no se presenta como un permiso de lectura de otras bases. Referencia: [MySQL 8.4 — GRANT, comodines y niveles de privilegios](https://dev.mysql.com/doc/refman/8.4/en/grant.html).

## 4. Protección de credenciales

La contraseña nueva de pruebas se generó con random_bytes dentro del proceso local y se comprobó diferente de la administrativa. Se guardó antes de crear la cuenta en `evidence/prompt11/test.private.ini`, separado de los scripts y bajo ACL privadas, para conservarla incluso si fallaba una verificación posterior. No se publica su valor, hash o material de autenticación.

El CREATE USER se construyó en memoria y viajó por stdin del cliente, nunca por argumentos ni un archivo SQL. Se mantuvieron TLS con CA fijada, modo batch sin historial interactivo, MYSQL_HISTFILE=NUL para el hijo, ausencia de MYSQL_PWD, reconexión automática desactivada y --no-login-paths. No se activaron logs de consultas y los errores del cliente se redujeron a códigos, sin guardar texto que pudiera contener fragmentos del secreto.

La cuenta administrativa del Prompt 10 se usó solo para crear/verificar estos recursos, no como cuenta de pruebas. No se alteró su contraseña. La credencial nueva permanece local e ignorada por Git; no se insertó en .env, Laravel o Cypress.

## 5. Verificación con la cuenta de pruebas

Se abrió una conexión nueva usando exclusivamente la credencial de pruebas, destino TCP 127.0.0.1:3308 y base seleccionada zarate_test.

| Comprobación | Resultado observado |
| --- | --- |
| Autenticación y selección de base | Correctas; DATABASE() = **zarate_test** |
| Cuenta efectiva | **zarate_test@127.0.0.1** |
| Versión/puerto/datadir/UUID | Coincidentes con la instancia aislada acreditada |
| Tablas en el esquema | **0**, incluso tras las verificaciones |
| Codificación/colación | **utf8mb4 / utf8mb4_unicode_ci** |
| Privilegios de esquema | Exactamente los **9** previstos, con alcance literal y sin delegación |
| Privilegios globales de acceso | **0**, excluyendo el marcador USAGE |
| Privilegios dinámicos globales | **0** según metadatos administrativos |
| Grants sobre otros esquemas | **0** |
| Roles/default roles/PROXY | **0** concesiones; CURRENT_ROLE() = **NONE** |
| Grants adicionales de tabla/columna/rutina | **0** |
| Cuentas del mismo usuario en otros hosts | **0**; solo existe la nueva cuenta @127.0.0.1 |
| Estado de la cuenta | No bloqueada, contraseña no expirada y SSL requerido |
| TLS observado | **TLS_AES_128_GCM_SHA256**, CA verificada |

Se distinguieron permisos observados de pruebas de denegación:

- **Denegación ejecutada:** un SELECT COUNT(*) de metadatos sobre mysql.user, con la cuenta de pruebas y en la instancia aislada, fue rechazado con **1142 / SQLSTATE 42000**, código de cliente **1** esperado. No se recuperaron filas de usuarios ni hashes. Es una comprobación de aislamiento aprobada, no un error funcional ocultado.
- **No se ejecutaron** consultas a zarate_dev ni intentos de escritura sobre bases ajenas. La ausencia de grants y roles fuera del esquema está comprobada en metadatos; no se presenta como una prueba de denegación ejecutada contra cada base de desarrollo.
- El acceso a metadatos propios de INFORMATION_SCHEMA es necesario para verificar permisos y no equivale a acceso a datos institucionales de otros esquemas.

Estos son controles SQL directos de conexión/aislamiento, **no suites Pest/Cypress ni pruebas de reglas académicas**. No se crearon tablas de prueba para demostrar los privilegios DDL, de modo que su ejecución efectiva en migraciones sigue pendiente.

## 6. Detención y conservación de desarrollo

El cierre se realizó en finally mediante CTRL_C_EVENT en la consola exclusiva reconocida del árbol monitor/servidor; no se usó mysqladmin, terminación por nombre ni taskkill. Los handles se conservaron hasta recuperar ambos códigos.

| Evidencia a las **11:17:31 -05:00** | Resultado |
| --- | --- |
| Servidor PID 28280 | Código nativo **0** y cierre completo |
| Monitor PID 340 | **3221225786 / 0xC000013A** por Ctrl+C; no se convierte en 0 |
| Supervisor/cliente de provisión | Código **0** |
| Motor | **0 ERROR/FATAL y 1 advertencia** por CA autofirmada |
| Procesos mysqld | **0** |
| Conexiones locales en 3308 | **0** |
| PID-file | Ausente |
| ACL y propietarios | **377 objetos** revisados, solo identidades autorizadas |
| Desarrollo | **303 archivos** conservan inventario, hashes, tamaños, fechas y ACL |
| Configuraciones protegidas | **4** con hashes y ACL intactos |
| Log de inicialización | Sin cambios |

La lectura independiente a las **11:18:28 -05:00** confirmó cero procesos relacionados, listeners, entradas TCP y servicios relacionados, sin PID residual. La apertura y cierre limpios, ausencia de errores y archivos de sistema presentes acreditan este ciclo; no son una comprobación exhaustiva de integridad de cada página del motor.

Las únicas modificaciones de datos/esquema autorizadas fueron las tres descritas, sobre recursos nuevos. No hubo fallos parciales, reintentos de provisión ni limpieza automática. Se conservó el datadir; no se modificó ningún recurso preexistente de desarrollo.

## 7. Evidencia local y documentación

Se crean únicamente para Git `prompt-11-base-usuario-pruebas.md` (copia íntegra del adjunto) y este informe. Los documentos y Bolts anteriores no se modificaron. No se cambiaron frontend/backend, phpunit, .env, plantillas o permisos; no se instalaron dependencias ni se hicieron commits, push, merge o PR.

Los recursos de esta corrida permanecen ignorados y privados bajo `evidence/prompt11`: supervisor, cliente de provisión, auxiliares de consola y capturas privadas, acreditación de conexión, identificación administrativa, comprobación previa de existencia, registros separados de CREATE DATABASE/CREATE USER/GRANT, verificación administrativa, patrón almacenado, verificación de la cuenta, denegación saneada y cierre. `test.private.ini` es un recurso de credenciales, no código o evidencia para publicar.

Auditoría final local: **39 archivos de texto** comprobados, incluidos los dos documentos, sin contraseñas administrativas o de prueba fuera de sus recursos autorizados; la clave nueva cumple la comprobación de longitud y difiere de la administrativa y la temporal. No se imprimieron valores ni hashes de autenticación. El auditor no conecta a MySQL y guarda únicamente indicadores saneados.

El prompt coincide por SHA-256 con el adjunto. `git diff --check` y la comprobación adicional de los documentos nuevos no detectaron errores; solo hubo aviso CRLF/LF del prompt. La credencial está ignorada y el contenedor no tiene archivos versionados. Git muestra únicamente estos dos documentos nuevos y HEAD permanece en `dd64484`.

## 8. Riesgos pendientes y siguiente paso

La cuenta está preparada para la futura fase de migraciones y pruebas dentro del esquema, por lo que tiene DDL de ese esquema; no debe confundirse con una cuenta de aplicación productiva limitada solo a DML. Los privilegios se justificaron por el código actual, sin ejecutar aún las migraciones. Cualquier privilegio adicional futuro requerirá evidencia y revisión, no GRANT ALL.

Persisten las limitaciones TLS conocidas: CA local autofirmada y VERIFY_CA sin verificación de hostname. La cuenta nueva exige SSL; la futura configuración PDO/Laravel deberá acreditarlo correctamente, sin desactivar comprobaciones para fabricar aprobaciones. Los archivos privados se protegen por ACL, no se presentan como bóveda cifrada.

El siguiente paso es configurar y verificar los perfiles aislados de Laravel y el destino de Cypress, incluyendo usuario/base, TLS, puerto, storage, cachés, sesiones, orígenes y ausencia de fallback a desarrollo. Solo después, con autorización independiente y guardas efectivas, se podrán ejecutar migraciones y pruebas.

**Estado final: BASE Y CUENTA AISLADAS VERIFICADAS; instancia detenida.** Esquema con **0 tablas**. **0 migraciones, 0 seeders y 0 casos Pest/Cypress ejecutados.** No se declara habilitada la integración de Laravel/Cypress.
