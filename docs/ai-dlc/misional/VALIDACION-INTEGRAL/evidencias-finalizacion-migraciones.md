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
