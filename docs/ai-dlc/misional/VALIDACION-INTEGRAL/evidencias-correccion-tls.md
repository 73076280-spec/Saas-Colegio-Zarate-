# Corrección de identidad TLS de MySQL aislado — Prompt 13

Fecha: 02/11/2026, America/Lima. Repositorio: `D:\zarate-saas`. Rama: `test/integracion-misional`. HEAD inicial: `9253172` (`docs(qa): registrar configuracion parcial y bloqueo TLS`). Git inicialmente limpio.

**Resultado: TLS CORREGIDO Y CONEXIÓN VERIFICADA.** Se creó una CA local exclusiva y un certificado de servidor con **SAN IP:127.0.0.1**, se configuró MySQL explícitamente y se verificaron conexiones desde **PDO y el conector real de Laravel**, con comprobación de certificado activa y la cuenta restringida. En la validación final se ejecutaron **cinco lecturas SQL, sin escrituras**. MySQL quedó detenido con código nativo del servidor **0**.

Se conservan dos intentos anteriores bloqueados por el clasificador del error de la prueba negativa, sin consultas posteriores. No se ocultan ni se convierten en aprobaciones históricas. Solucionar TLS **no habilita Pest/Cypress ni acredita un arranque completo de la aplicación**.

## 1. Documentación y diagnóstico original

Se revisaron `evidencias-base-usuario.md`, `evidencias-configuracion-integracion.md` y `evidencias-correcciones.md`, leídos íntegramente en esta conversación; se contrastó Git para conservar los documentos anteriores y se inspeccionaron perfiles, plantilla y código de diagnóstico. También se leyó el MySqlConnector instalado para limitar la comprobación a lecturas.

El certificado anterior era `mysql-data/server-cert.pem`, firmado por la CA autogenerada de `mysql-data/ca.pem`. Su clave correspondiente permanecía en `mysql-data/server-key.pem`. La firma y correspondencia con la clave resultaron válidas, pero **no tenía SAN IP para 127.0.0.1**. La plantilla no fijaba rutas TLS explícitas y se apoyaba en los archivos autogenerados. La instancia estaba detenida: no se presenta esa inspección de archivos/defaults como captura de un certificado servido en red en esta fase.

El cliente anterior VERIFY_CA validaba la CA, pero no la identidad de host. El perfil PDO mantenía verificación estricta y estaba bloqueado. No se consideró suficiente un Common Name ni se desactivó la comprobación de certificado para continuar.

## 2. Precondiciones y respaldo

Antes de generar claves se comprobaron rama, binario portable 8.4.11, configuración, puerto 3308 libre, ausencia de mysqld/servicios relacionados, rutas canónicas, ACL privadas, propietarios, ausencia de junctions/reparse y hardlinks ajenos. El preflight inicial inspeccionó **413 objetos**; también comparó el desarrollo protegido.

Se respaldaron en `evidence/prompt13/backup` las tres plantillas locales que se modificarían y los JSON de perfiles anteriores. **No se copiaron claves privadas TLS**: los archivos autogenerados originales se conservaron en sus rutas y los nuevos se generaron en rutas distintas. No se modificó el almacén de confianza Windows, certificados de desarrollo o configuración .env.

## 3. Certificados nuevos y validación offline

Recursos nuevos bajo `.tools/misional-isolated/tls-p13`:

| Recurso | Función |
| --- | --- |
| `ca-cert.pem` / `ca-key.private.pem` | CA exclusiva para las pruebas locales |
| `server-cert.pem` / `server-key.private.pem` | Certificado y clave del servidor aislado |
| `openssl.cnf` | Extensiones y parámetros explícitos de generación |
| `wrong-name-cert.pem` | Fixture público firmado por la CA nueva, con identidad DNS incorrecta |
| `untrusted-server-cert.pem` | Fixture público no firmado por la CA de confianza |

La generación se hizo con la extensión OpenSSL del PHP portable **8.4.26**, sin instalar herramientas. Claves **RSA 3072**, firmas **SHA-256**, CA con validez **365 días** y servidor **90 días**, generados el 02/11/2026. Los plazos son los de emisión, no autorización para reutilizar certificados después de caducar.

Extensiones comprobadas:

- CA: Basic Constraints crítico CA:TRUE, pathlen:0; uso de firma de certificados/CRL y identificadores de clave.
- Servidor: Basic Constraints crítico CA:FALSE; Digital Signature y Key Encipherment; Extended Key Usage **serverAuth**; **SAN IP:127.0.0.1**. Su Common Name descriptivo no se usó para sustituir la identidad IP.
- Fechas vigentes y vencimiento del servidor dentro del de la CA; firmas y claves coincidentes.

Se aprobaron nueve comprobaciones criptográficas positivas de generación: firma, correspondencia de clave del servidor y de CA, cadena/propósito TLS, SAN IP, fechas, condición de certificado final, EKU y uso de clave. Se repitieron las guardas de archivos antes de cada arranque. Las claves se escribieron directamente en sus recursos privados nuevos bajo la ACL existente, sin exportarlas a consola, Git, documentación o una copia de respaldo.

La cadena/propósito se validó con openssl_x509_checkpurpose y la CA explícita; los errores de API no se tomaron como rechazo esperado. Referencias: [PHP: firma de certificados](https://www.php.net/manual/en/function.openssl-csr-sign.php) y [comprobación de propósito/cadena](https://www.php.net/manual/en/function.openssl-x509-checkpurpose.php).

## 4. Configuraciones locales efectuadas

Se añadieron a `mysql.ini.template` solo tres destinos TLS explícitos:

```ini
ssl-ca=D:/zarate-saas/.tools/misional-isolated/tls-p13/ca-cert.pem
ssl-cert=D:/zarate-saas/.tools/misional-isolated/tls-p13/server-cert.pem
ssl-key=D:/zarate-saas/.tools/misional-isolated/tls-p13/server-key.private.pem
```

Se mantuvieron datadir/tmpdir/log/PID exclusivos, bind 127.0.0.1, puerto 3308, MySQL X OFF y las protecciones de opciones anteriores. La nueva guarda comprueba **15 opciones exactas**, sus destinos y el hash revisado; no omite la validación antigua para fabricar una aprobación. La guarda histórica de inicialización no es el verificador de arranque de esta fase.

Se agregó la CA nueva a las dos plantillas PHP/Laravel locales. Se prepararon perfiles Pest/HTTP nuevos bajo `evidence/prompt13` con MYSQL_ATTR_SSL_CA nuevo y **SSL_VERIFY_SERVER_CERT=true**. Referencian la misma credencial restringida y las APP_KEY privadas del Prompt 12, sin copiar sus valores. Los perfiles e informes de Prompt 12 permanecen intactos y describen su estado histórico bloqueado.

Ambos perfiles nuevos resolvieron offline el entorno testing, usuario/base zarate_test y rutas privadas con la CA nueva. No se escribió caché de configuración ni se arrancaron providers/kernels HTTP.

`tls-current.json` contiene únicamente rutas y un snapshot de la configuración verificada; referencia los perfiles nuevos y el diagnóstico final en `evidence/prompt13/attempt3`. No contiene secretos y no es una autorización permanente de arranque o de pruebas. Los auxiliares históricos no deben ejecutarse como si usaran la CA actual sin revisión.

## 5. Controles negativos

| Caso | Resultado y alcance |
| --- | --- |
| Certificado no confiable | Rechazado offline por cadena/propósito con la CA de pruebas; fixture no instalado como certificado operativo |
| Certificado con identidad incorrecta | Cadena válida contra la CA nueva, pero sin SAN IP adecuado: rechazado por la guarda de identidad IP |
| CA incorrecta | El certificado operativo no valida contra la CA antigua; rechazo offline |
| PDO con CA incorrecta | Con verificación activa y destino acreditado, rechaza el handshake con **2002 / error SSL**, sin abrir sesión ni ejecutar SQL en los intentos instrumentados |

El driver devolvió una descripción SSL genérica, **no el texto detallado de causa de certificado esperado por el primer clasificador**. La clasificación final se apoya en el rechazo SSL observado, la prueba independiente de cadena con CA equivocada y el contraste con la conexión exitosa al mismo destino usando la CA correcta. No se afirma haber recibido un mensaje de certificado que el driver no entregó. No se cambió verify_server_cert a false, no se aceptaron certificados no confiables ni se ignoraron errores de PDO.

Estos son tres casos negativos offline y un caso PDO de CA equivocada; las repeticiones del mismo caso no se suman como pruebas distintas. No se desplegaron los certificados negativos para arrancar servidores adicionales de prueba.

## 6. Conexiones verificadas e identidad efectiva

Solo después de las guardas de rutas/ACL/cripto/opciones se arrancó la instancia aislada. Cada ciclo conservó el monitor y servidor hijo, PID-file, argumentos, interfaz loopback y puerto; no se inició servicio Windows de desarrollo. --validate-config y la prueba auxiliar de cierre devolvieron **0** antes de la ejecución operativa.

Se preservaron los controles de privacidad ya utilizados: registros binario/general/slow/raw desactivados solo para la ejecución, sin cambiar privilegios o variables por SQL. No se usaron contraseñas en argv ni credenciales administrativas para las conexiones de diagnóstico.

La validación final utilizó el perfil Pest para dos conexiones positivas nuevas:

1. **PDO directo**, CA nueva explícita y verificación de certificado/identidad activa.
2. **Illuminate Database MySqlConnector real**, cargado del Laravel 13.34.0 instalado, con la misma cuenta y opciones TLS estrictas.

| Dato comprobado en ambas conexiones | Resultado |
| --- | --- |
| Servidor | **MySQL 8.4.11** |
| Puerto | **3308** |
| Base seleccionada | **zarate_test** |
| Cuenta efectiva | **zarate_test@127.0.0.1**, no root |
| Datadir | `D:\zarate-saas\.tools\misional-isolated\mysql-data\` |
| UUID | Coincide con auto.cnf del destino acreditado; valor solo en el gate privado |
| Tablas del esquema | **0** |
| Cifrado de sesión | **TLS_AES_256_GCM_SHA384** |
| Verificación de certificado | **true**, con CA nueva y SAN IP correspondiente |

Además, las variables SSL_CA, SSL_CERT y SSL_KEY leídas del servidor coincidieron con las tres rutas nuevas configuradas. Esa lectura, junto con los argumentos reales y la conexión estricta exitosa, acredita los archivos TLS operativos; no se leyó contenido de claves por SQL ni se imprimió material privado.

Se ejecutaron **cinco sentencias explícitas de lectura**: identidad por SELECT y dos SHOW en PDO; identidad y cifrado por SELECT/SHOW en el conector Laravel. **Cero sentencias de escritura.** Para esta prueba del conector se omitieron en una copia de configuración las opciones de inicialización de sesión y se usó use_db_after_connecting=false: la base ya iba en la DSN. Así no se enviaron USE ni SET de charset/modos. No se debilitó TLS ni se modificó el perfil persistido por esa copia diagnóstica.

Esto verifica el **conector y la resolución de configuración**, no todos los providers, sesiones de navegador, políticas o flujo multiinstitución. El perfil HTTP aprobó offline; no se abrió con él una segunda aplicación HTTP. Pest y Cypress no se ejecutaron.

## 7. Intentos y detención: resultados conservados

| Ciclo local | Resultado del cliente diagnóstico | Monitor / servidor | Cierre del servidor |
| --- | --- | --- | --- |
| Inicial, hasta 12:01:15 -05:00 | **21 / BLOCKED**, antes de lecturas; no conservó detalle suficiente del motivo negativo | 2700 / 2172 | **0**, shutdown completo |
| attempt2, hasta 12:04:59 -05:00 | **21 / BLOCKED**; CA rechazada, código 2002 y motivo SSL genérico, clasificador textual no satisfecho | 28544 / 20556 | **0**, shutdown completo |
| attempt3, hasta 12:06:48 -05:00 | **0 / STRICT_TLS_PDO_AND_LARAVEL_VERIFIED** | 3416 / 11824 | **0**, shutdown completo |

Los dos primeros bloqueos se conservaron sin aprobarlos retrospectivamente. Se corrigió únicamente el diagnóstico del error, manteniendo validación estricta y las mismas guardas. No hubo lecturas SQL positivas hasta el tercer ciclo, reinicialización, recuperación destructiva o escritura de datos para forzar el resultado.

La parada usó CTRL_C_EVENT solo en la consola exclusiva verificada del árbol propio, con handles conservados. Los monitores devolvieron **3221225786 / 0xC000013A** por Ctrl+C, no 0; los tres servidores devolvieron **0**. El supervisor de cierre terminó 0 en cada ciclo, lo cual no convierte el código 21 del cliente en conexión aprobada.

En el ciclo final se registraron **0 ERROR/FATAL y 1 advertencia** del motor por CA autofirmada. La CA es deliberadamente local y se confía mediante archivo explícito; no se interpreta la advertencia como sustituto de validación, que se acreditó en el cliente.

## 8. Conservación y estado final

La guarda previa al ciclo final inspeccionó **494 objetos** y la posterior **518**, solo con propietarios/ACL autorizados. Los procesos y capturas nuevos heredan la política privada existente; no se modificaron permisos de carpetas compartidas o desarrollo.

Cada cierre comparó los **303 archivos** protegidos de desarrollo y **cuatro configuraciones**, conservando inventario, hashes, tamaños, fechas y ACL. El log histórico de inicialización no cambió. No se alteraron contraseñas, usuarios, grants, tablas o datos académicos.

Snapshot independiente a las **12:08:40 -05:00**: **0 procesos relacionados, 0 listeners y 0 entradas TCP en 3308**, sin servicios relacionados o PID-file. Storage Pest/HTTP y caches bootstrap permanecen con **0 archivos generados**. La apertura y cierre sin errores son evidencia operativa acotada, no un análisis exhaustivo de cada página del datadir.

Los certificados/claves anteriores permanecen en su ubicación, sin sobrescritura ni copias de claves privadas. No se tocó el almacén de certificados del sistema. No se detuvieron servicios ajenos.

## 9. Archivos locales y reversión

Recursos locales ignorados: `tls-p13` con certificados, dos claves privadas y configuración OpenSSL; `tls-current.json`; plantillas locales ajustadas; `evidence/prompt13` con respaldo de configuración, generación/validación de certificados, perfiles nuevos, loaders, orquestadores y capturas/JSON saneados de los tres ciclos. El diagnóstico que pasó está en **attempt3/Loader13.php**; los intentos previos se conservan como evidencia, no como ejecutores actuales aprobados.

Procedimiento de reversión preparado, **no ejecutado**:

1. Confirmar ausencia de los PID propios y listeners y revalidar rutas/ACL/enlaces del contenedor.
2. Comparar y restaurar exclusivamente mysql.ini.template y las dos plantillas Laravel desde `evidence/prompt13/backup`, sin modificar .env ni certificados del sistema/desarrollo.
3. Desactivar las referencias nuevas en el snapshot tls-current y volver a los perfiles anteriores si se decide revertir. Los originales de Prompt 12 no se alteraron. La reversión vuelve al bloqueo TLS histórico, no a una conexión aprobada.
4. Conservar los certificados y claves nuevos privados para revisión; no borrarlos automáticamente ni tocar el datadir. Los certificados autogenerados siguen disponibles. No se requiere rollback SQL porque no se ejecutaron escrituras SQL.

La creación de claves nuevas se limita a los archivos exclusivos, con acceso de las identidades Windows ya autorizadas. Las claves no están cifradas con passphrase en disco: el servidor necesita leer su clave al arrancar y la protección local es la ACL. La CA privada permite emitir certificados y debe permanecer protegida; no se declara una PKI productiva, revocación implementada o renovación automática.

## 10. Pendientes y próxima acción

Se corrigió la causa de identidad IP y se verificó TLS en PDO y en el conector Laravel. Permanecen pendientes los adaptadores de arranque completo Pest/HTTP, sus precedencias y la revisión de Origin/Referer/CORS/cookies y destinos de Cypress del Prompt 12. Las claves/certificados tienen caducidad y requieren renovación controlada antes de vencer.

La siguiente fase puede preparar esos adaptadores reutilizando la CA y perfiles nuevos, con guardas actualizadas y la cuenta restringida. No usar un loader histórico que aún apunte a la CA antigua, no desactivar verificación y no ejecutar automáticamente migraciones o pruebas por haber corregido TLS.

**Estado final: TLS CORREGIDO Y CONEXIÓN VERIFICADA; instancia detenida.** No se ejecutaron migraciones, seeders, Pest o Cypress, ni SQL de escritura. No se modificó código funcional, .env, roles, contraseñas o privilegios, y no se hicieron commits, push, merge o PR. Los únicos documentos nuevos para Git son este informe y `prompt-13-correccion-tls.md`, copia íntegra del adjunto; los documentos anteriores se conservan.

## 11. Continuación y cierre documental

El 02/11/2026 se retomó el trabajo con la instrucción de continuación del Prompt 13. Se contrastaron las evidencias anteriores, sin regenerar certificados, arrancar MySQL o repetir SQL. La rama continúa siendo `test/integracion-misional`; Git solo muestra los dos documentos nuevos de esta fase.

Evidencias locales contrastadas: `certificate-validation.json`, `attempt3/auth-result.json`, `attempt3/result.json`, `attempt3/server.stop.json` y `final-state.json`, dentro de `evidence/prompt13`. Acreditan los nueve controles positivos, los tres casos negativos offline, el rechazo PDO con CA incorrecta, las dos conexiones positivas y el cierre nativo 0. La identidad incorrecta se comprobó mediante la guarda offline de SAN; no se presenta como handshake negativo de PDO ejecutado. Laravel se comprobó mediante su conector real, sin arrancar la aplicación HTTP completa.

Inspección actual de procesos y TCP a las **16:34:30 -05:00**: **0 procesos mysqld, 0 conexiones/listeners en 3308 y ausencia de PID-file**. No se detuvo ni modificó ningún proceso. La conservación del desarrollo está acreditada por la comparación registrada al cierre del ciclo final: 303 archivos y cuatro configuraciones intactos; no se repitió una comparación completa en esta continuación.

La auditoría local inicial de secretos examinó **108 archivos**; la repetición tras completar el documento examinó **109 archivos, incluidos los dos documentos**, con **0 coincidencias de secretos fuera de sus recursos dedicados**. Las claves privadas permanecen exclusivamente en sus archivos privados. Esa auditoría no publica los valores inspeccionados ni sustituye las ACL.

El hash SHA-256 del prompt guardado coincide con el adjunto original. `git diff --check` y la comprobación de ambos documentos nuevos mediante `git diff --no-index --check` no detectaron errores de whitespace; Git solo advirtió la normalización futura de CRLF a LF del prompt. `.tools` no contiene archivos rastreados y la clave privada nueva está ignorada.

### Plan mínimo para el Prompt 14 — pendiente, sin implementación

| Paso | Trabajo propuesto | Condición de aceptación antes de migrar |
| --- | --- | --- |
| 1. Guardas comunes | Reutilizar la CA, perfiles y controles actuales; comprobar binario, configuración, ACL, enlaces, procesos, puertos e identidad efectiva antes de permitir operaciones | Fallo cerrado ante cualquier destino diferente de 127.0.0.1:3308 / zarate_test, uso de root, TLS no verificado o referencia a zarate_dev |
| 2. Adaptador HTTP local | Preparar un arranque aislado que aplique el perfil antes de providers/kernel, sin leer .env de desarrollo | Storage, sesiones, vistas, logs y cachés bootstrap exclusivamente locales; credencial restringida y APP_KEY privada propia; comprobar la configuración efectiva sin escrituras de BD |
| 3. Adaptador Pest y PHPUnit | Preparar un bootstrap/XML local con rutas explícitas y guardas aplicadas a cada Application creada por Tests\\TestCase | Revisar precedencia entre entorno heredado, variables forzadas del XML y configuración Laravel; fijar host/puerto/TLS además de base/usuario; impedir cachés o DB_URL que redirijan la conexión |
| 4. Revisar efectos de las suites | Inventariar traits, conexiones adicionales, factories, seeders y comandos de migración | No ejecutar RefreshDatabase ni migrate:fresh como preparación automática; DatabaseTransactions tampoco protege una conexión equivocada ni revierte todo DDL. Aprobar explícitamente el comando y las migraciones que escribirán solo en el esquema aislado |
| 5. Coherencia web | Alinear Sanctum, CORS, cookies, Origin/Referer y puertos efectivos de frontend/backend con el perfil HTTP | Resolver el 5173 forzado por phpunit.xml frente al 5174 del perfil. Vite requiere proxy explícito, loopback y strictPort; CYPRESS_BASE_URL por sí solo no corrige headers fijos ni el fallback API 8000 |
| 6. Puerta previa a la primera migración | Presentar configuración efectiva saneada, inventario de efectos, comparación de desarrollo, procedimiento de cierre y autorización de la operación concreta | Confirmar esquema aislado y destino real de la conexión inmediatamente antes de escribir. Una conexión TLS aprobada no autoriza por sí misma una migración |

Lectura actual de `backend/phpunit.xml`, `backend/tests/TestCase.php`, `frontend/vite.config.ts` y `e2e/cypress.config.ts` confirma las dependencias descritas: PHPUnit fuerza Sanctum 5173 y no fija host/puerto; TestCase no personaliza el arranque; Vite usa 5173 y proxy 8000 por defecto; Cypress usa 5173 por defecto. Las observaciones sobre traits y creación interna de Application remiten además a la inspección documentada en el Prompt 12. No se ejecutó ningún runner en esta continuación.

**Clasificación de cierre: PROMPT 13 CERRADO — TLS Y CONEXIÓN VERIFICADOS.** No hay bloqueo TLS pendiente acreditado; siguen pendientes los adaptadores y guardas de ejecución completa. Las pruebas integrales, migraciones, seeders, Pest y Cypress continúan **NO EJECUTADOS** en esta fase. El plan anterior no constituye implementación ni autorización de ejecución automática.
