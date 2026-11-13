# Prompt 37 — Recuperación y cierre de regresión Pest misional

Fecha de recuperación: 06/11/2026. Rama comprobada: `test/integracion-misional`.

## Punto de partida conservado

Se verificaron mediante hashes y lectura de JUnit los 201 casos distintos aprobados y sus 1.404 aserciones. No se ejecutaron nuevamente. El inventario anterior conserva 113 pendientes: 75 por entorno y 38 por operaciones o contratos no admitidos.

R36-039, `Sprint1Test`, `denies non administrators protected resources`, dataset `('STUDENT')`, conserva el error histórico de infraestructura: expiración de guarda durante una suspensión de Windows, cero aserciones. El registro anterior acredita rollback raíz y limpieza externa; no acredita un recibo posterior de limpieza en la misma conexión. No se transforma ese resultado en aprobación.

La recuperación de solo lectura de las 20:16:10 (-05) no encontró reanudaciones nuevas desde el checkpoint de las 20:04:30, supervisores anteriores activos, procesos MySQL/Pest ni listeners en 3308/3307/8000/5173. Una consola ajena previamente identificada se conservó. No se cambiaron opciones de energía.

## Preparación nueva

- Cohorte privada `prompt37`: 75 casos, orden original R36-039 a R36-113; primer grupo de un único caso y grupos siguientes de hasta diez.
- Descubrimiento: 75 filtros verifican exactamente una clase, método y dataset; no ejecuta fixtures ni SQL.
- Controles de seguridad offline aprobados; verificador nativo: 13 comprobaciones aprobadas, cero fallidas, sin conexiones SQL.
- Guarda de 120 segundos conservada. Cada caso exige autorización nueva, rollback raíz, limpieza en la misma conexión y comparación externa del esquema y filas. No se renueva la guarda dentro de una transacción.
- Comprobación adicional de eventos de suspensión antes del arranque y de cada caso. Un evento nuevo impide continuar; no se realizan reintentos automáticos.
- Copias privadas conservan las aserciones y fixtures originales; únicamente adaptan los literales de base de pruebas y Origin ya autorizados.

La primera auditoría documental comparó por error el hash completo de un documento al que se había agregado el anexo solicitado. Se conservó ese resultado. La segunda verifica el prefijo original en los dos documentos autorizados para anexos: 70 documentos preservados, 201 JUnit intactos, 2.886 archivos fijados sin cambios y cero coincidencias de contraseña o APP_KEY. Este ajuste afecta al auditor documental, no a la guarda SQL.

## Alcance excluido

Los 38 casos bloqueados no están autorizados para ejecución automática. La revisión individual y sus rutas originales se conservan en `prompt37/blocked-review.json` y en el inventario anterior.

| Causa | Preparación o autorización necesaria |
|---|---|
| DELETE, forceDelete y borrados de relaciones | Revisar SQL transitivo por caso y autorizar expresamente las operaciones necesarias solo en `zarate_pest`, con rollback y pruebas negativas; la prohibición vigente continúa. |
| Sincronización de permisos, roles, tokens y destinatarios | Revisar los servicios y sus DELETE implícitos. No basta con que el test no llame DELETE directamente; requiere autorización específica. |
| Archivos, cargas, descargas, reemplazo y limpieza | Disponer de directorios privados aislados, comprobar límites y ausencia de rutas de desarrollo y autorizar sus efectos y limpieza. |
| Seeders demo | Mantenerlos excluidos. Cualquier futura sustitución por fixtures sintéticos requiere revisión; no se ejecutan seeders demo en este alcance. |
| Contrato histórico MySQL y ausencia de transacciones | Diseñar una verificación aislada compatible sin debilitar identidad, TLS o contratos del launcher. No modificar las pruebas originales para forzar aprobación. |
| Otros efectos no admitidos | Revisar cuerpo, servicios, SQL y efectos transitivos antes de seleccionar casos. |

No se identificó una categoría adicional demostrada de conexiones externas; no se inventan casos para esa categoría. Las causas pueden solaparse, por lo que esta tabla no suma casos; el inventario individual contiene exactamente 38 identificadores distintos.

## Evidencia privada

Directorio: `.tools/misional-isolated/evidence/prompt37/`.

Registros iniciales: `recovery-readonly.json`, `preparation.json`, `prior-junit-verification.json`, `cases.json`, `filter-verification.json`, `blocked-review.json`, `documents-before.json`, `immutable.json` y auditorías de preservación. Los resultados de ejecución se incorporan por anexo al concluir la fase supervisada.

No se ejecuta Cypress. No se modifican código funcional, migraciones, credenciales ni privilegios. Se conservan las modificaciones de Git anteriores, incluida `evidencias-finalizacion-migraciones.md`. No se realizan commits ni push.

## Cierre complementario — 07/11/2026

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.** La regresión no se completó.

Los eventos de Windows acreditan dos suspensiones posteriores a la admisión inicial:

- SleepTime `2026-11-07T01:25:15.7228063Z`, WakeTime `2026-11-07T02:53:47.6246205Z`: 06/11, aproximadamente 20:25–21:53 en Lima.
- SleepTime `2026-11-07T02:53:56.3215361Z`, WakeTime `2026-11-07T13:29:53.6497183Z`: 06/11 21:53–07/11 08:29 en Lima.

El supervisor seguía en el preflight de archivos/ACL. No existían `run/launch.json`, PID MySQL ni JUnit de casos. Se detuvo únicamente el supervisor propio PID 23076 después de comprobar nombre, instante de creación y comando. No se cerró la consola ajena PID 20052. La comprobación posterior encontró cero procesos MySQL y ningún supervisor 23076. No hubo transacción de pruebas que revertir en Prompt 37.

No se reinició el supervisor ni se reintentaron casos tras las nuevas suspensiones. Los registros anteriores y la primera auditoría documental no satisfactoria se conservan.

| Indicador | Resultado real |
|---|---|
| Inventario original | 314 casos |
| Casos distintos aprobados acumulados | 201; sin cambios respecto del checkpoint anterior |
| Aserciones acreditadas acumuladas | 1.404 |
| Nuevos casos Pest ejecutados / aprobados / recuperados | 0 / 0 / 0 |
| Fallos funcionales nuevos | 0; ningún caso nuevo ejecutado |
| Errores históricos de infraestructura Pest | 2 intentos: R36-014 recuperado anteriormente y R36-039 aún pendiente |
| Nuevas incidencias del entorno | 1 interrupción del preflight, con dos ciclos de suspensión; no es un nuevo error JUnit |
| Pendientes por entorno / bloqueados por operaciones | 75 / 38; total 113 |
| Rollbacks nuevos | 0 necesarios; 0 ejecutados |
| Rollbacks acreditados del Prompt 36 | 77 aprobaciones con comprobación completa; dos intentos fallidos conservan las limitaciones de recibo ya documentadas |
| Tablas / migraciones / residuos | Última evidencia anterior: 52 / 14 / cero residuos. No se revalidaron mediante SQL en Prompt 37 |
| TLS, UUID, datadir y cuenta efectivos | Pendientes de nueva comprobación en vivo; MySQL no arrancó |
| Denegación real de acceso a bases protegidas | Evidencia histórica conservada; no repetida en vivo. Controles offline aprobados |
| Verificador nativo offline | 13 aprobadas, 0 fallidas; no sustituye la equivalencia con MySQL activo |
| Descubrimiento de filtros | 75 comprobaciones exactas; no cuentan como casos Pest ejecutados |

R36-039 conserva exclusivamente su ERROR histórico de infraestructura de cero aserciones. No tiene una nueva aprobación ni una ejecución en Prompt 37. El primer caso de una futura reanudación sigue siendo R36-039, dataset `('STUDENT')`.

### Clasificación final de los 38 casos excluidos

Por causa principal, sin duplicar identificadores:

| Causa principal | Casos |
|---|---:|
| Llamadas DELETE/forceDelete/deleteJson o exclusiones de borrado | 16 |
| Sincronización o borrados transitivos de roles, permisos, tokens y destinatarios | 7 |
| Operaciones sobre archivos | 11 |
| Seeders demo | 2 |
| Contrato MySQL histórico y ausencia de DatabaseTransactions | 2 |
| Total | 38 |

Estas clasificaciones expresan el motivo de exclusión, no que todas las llamadas HTTP DELETE lleguen a ejecutar DELETE SQL. No se modificaron permisos ni pruebas para admitirlas.

### Pendientes y recomendación

Para continuar los 75 casos no falta una ampliación de privilegios: hace falta una nueva reanudación expresamente solicitada tras este bloqueo y un preflight completo con el equipo activo. Se mantiene la guarda de 120 segundos y no se cambian opciones de energía. Las autorizaciones/gates anteriores no se reutilizan.

Los 38 casos requieren revisión y autorización específica de sus efectos, según la tabla de preparación anterior. No se solicita una autorización genérica para ejecutarlos todos.

Cypress permanece **NO EJECUTADO**. Antes de habilitarlo debe revisarse un entorno HTTP separado con fixtures sintéticos, frontend 5174 y backend 8001, guardas y operaciones permitidas explícitas; el launcher Pest no autoriza por sí solo servicios HTTP ni fixtures persistentes. No se crean usuarios demo.

Evidencia nueva principal: `prompt37/new-power-incident.json` y `prompt37/controlled-preflight-stop.json`. La ausencia de lanzamiento y de JUnit está registrada; no existe un resultado SQL posterior inventado ni un checkpoint de aprobación nuevo.

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
### Recuperación de R36-039 acreditada — cohorte prompt37r

`prompt37r/run/case1.xml` acredita exactamente un caso, dataset `('STUDENT')`, 6 aserciones, cero errores y cero fallos. La aprobación se aceptó después de la inspección externa, un begin/rollback raíz, cero DELETE y recibo de limpieza en la misma conexión. Edad máxima observada de la guarda: 48,3373 segundos; no se amplió su TTL.

Checkpoint `prompt37r/checkpoint-0001.json`: 202 casos distintos y 1.410 aserciones acumuladas; 74 pendientes por entorno más 38 bloqueados. El error histórico de R36-039 no se borra: esta es su recuperación mediante un nuevo intento autorizado y verificable. No se repitió ninguno de los 201 casos ya aprobados.
## Cierre definitivo de la reanudación autorizada — 07/11/2026, 12:32 (-05)

**A. REGRESIÓN PEST AUTORIZADA COMPLETADA.** Esta clasificación corresponde exclusivamente a los 75 casos compatibles autorizados. **La suite completa de 314 casos no está aprobada: permanecen 38 casos sin ejecutar y bloqueados por operaciones o contratos.** Los bloqueos históricos anteriores se conservan como registros de intentos previos, no como estado final de esta reanudación.

### Resultados JUnit y ausencia de duplicados

| Indicador | Resultado comprobado |
|---|---:|
| Inventario original | 314 |
| Casos anteriores conservados, sin repetir | 201 |
| Casos nuevos ejecutados / aprobados | 75 / 75 |
| Fallos de aserción / errores nuevos de infraestructura | 0 / 0 |
| Aserciones nuevas | 320 |
| Casos distintos aprobados acumulados | 276 |
| Aserciones acreditadas acumuladas | 1.724 |
| Casos pendientes por entorno | 0 |
| Casos bloqueados y no ejecutados | 38 |
| Rollbacks nuevos comprobados | 75 |
| Casos previamente erróneos recuperados en esta continuación | 1: R36-039 |

| Archivo original | Casos nuevos aprobados | Aserciones nuevas |
|---|---:|---:|
| `backend/tests/Feature/Sprint1Test.php` | 20 | 76 |
| `backend/tests/Feature/Sprint2Test.php` | 30 | 156 |
| `backend/tests/Feature/Sprint3Test.php` | 25 | 88 |
| Total | 75 | 320 |

Las pruebas usaron Laravel/Pest y MySQL real aislado, no una API simulada. Las copias privadas conservan las aserciones y fixtures originales con las dos adaptaciones autorizadas de base de pruebas y Origin. No se modificaron pruebas originales ni código funcional. Se verificaron los 276 JUnit por hash y se comprobaron 276 identidades canónicas únicas de archivo y nombre de caso/dataset, sin duplicados.

R36-039 fue el primer caso ejecutado y aprobó con 6 aserciones. Su limpieza y checkpoint se confirmaron antes de continuar. R36-014 y R36-039 conservan sus dos errores históricos de infraestructura; ambos tienen recuperaciones exitosas acreditadas. Los recibos ausentes de los intentos históricos no se inventan ni se completan retroactivamente.

Los 75 casos nuevos acreditan un begin/rollback raíz, cero DELETE y limpieza en la misma conexión, además de inspección externa posterior. Se añaden a las 77 aprobaciones con rollback completo documentadas en Prompt 36: 152 comprobaciones completas en el alcance conjunto de esos dos prompts; no se extrapola este número a toda la suite histórica.

### Seguridad y cierre del entorno

- Destino efectivo: `127.0.0.1:3308`, base `zarate_pest`, cuenta exclusiva `zarate_pest_runner@127.0.0.1`. Identidad, UUID, datadir y configuración se contrastaron con las guardas autorizadas.
- TLS estricto aprobado; conexión final `TLS_AES_256_GCM_SHA384`. Las pruebas negativas de acceso a `zarate_dev` y `zarate_test` aprobaron antes y después del lote, sin escrituras sobre ellas.
- Esquema final idéntico al esperado: 52 tablas InnoDB, 14 migraciones, cero triggers y cero filas de aplicación; únicamente permanecen las 14 filas del repositorio de migraciones.
- Guarda de 120 segundos intacta, sin renovación durante transacciones. Edad máxima observada en los casos: 75,7319 segundos, margen mínimo aproximado de 44,2681 segundos. Ningún caso alcanzó el umbral preventivo de 100 segundos.
- Validación nativa: tres snapshots equivalentes, 40 muestras intercaladas por verificador, seis tokens inválidos rechazados por ambos verificadores y siete denegaciones adicionales de identidad/certificado. Son controles de seguridad, no casos adicionales del inventario Pest.
- Revisión final: 12.240 objetos con comprobaciones de ACL, propietario, hardlinks y reparse points. Cuatro configuraciones protegidas sin cambios; log de inicialización sin cambios.
- Apagado controlado del servidor con código 0, cero errores del motor y una advertencia por CA autofirmada, propia de la CA privada validada. La verificación TLS no se desactivó. El código de señal del monitor está registrado separadamente del código del servidor.
- Observación final de 12:32:18 (-05): PID anterior 23076 ausente, supervisor nuevo 26460 ausente, cero procesos PHP/MySQL, cero conexiones en 3308 y archivo PID ausente. Ningún evento nuevo de suspensión desde 10:16:54; lectura de eventos sin errores. No se cambiaron opciones de energía.

No se comparan hashes físicos de archivos InnoDB volátiles ni se afirma una inspección del contenido de las bases protegidas. La preservación demostrada corresponde a las denegaciones, la ausencia de operaciones dirigidas a esas bases, las configuraciones protegidas y el esquema/recuentos del entorno exclusivo de pruebas.

La consolidación tuvo un error de lectura de un JSON UTF-16 generado por PowerShell. Se adaptó únicamente el lector privado para esa codificación y se repitió la consolidación, no las pruebas. Los archivos de resultados no se reescribieron. El incidente de posprocesamiento se conserva en `uniqueness-and-postprocessing.json`; no es un fallo Pest.

### Evidencias finales

Directorio privado: `.tools/misional-isolated/evidence/prompt37r/`.

- `run/case1.xml` a `run/case75.xml`: JUnit originales de esta reanudación.
- `summary37r.json`: resultados, aserciones, duraciones, métricas y comprobaciones por caso.
- `checkpoint-0001.json`, `checkpoint-0011.json`, `checkpoint-0021.json`, `checkpoint-0031.json`, `checkpoint-0041.json`, `checkpoint-0051.json`, `checkpoint-0061.json`, `checkpoint-0071.json` y `checkpoint-0075.json`.
- `approved-junit-cumulative.json`: 276 referencias JUnit y hashes, con 1.724 aserciones.
- `inventory-remaining.json`: exactamente los 38 casos bloqueados originales; ninguno ejecutado.
- `consolidated-final.json`, `uniqueness-and-postprocessing.json`, `final-process-power.json`.
- `run/after.stdout.json`, `run/negative-final.stdout.json`, `run/native-validation.json`, `run/result.json` y recibos de efectos/limpieza por PID.

La clasificación por causas y la preparación necesaria para los 38 bloqueados siguen vigentes en las secciones anteriores y en `prompt37/blocked-review.json`. No se solicitan ni asumen autorizaciones genéricas de DELETE, archivos, seeders o contratos alternativos.

### Preparación de Cypress

**Sí se puede pasar a la preparación controlada de Cypress**, conservando como limitación los 38 casos Pest excluidos. Esto no autoriza ejecutar Cypress todavía, crear usuarios demo, reutilizar servicios de desarrollo ni cargar fixtures persistentes sin revisar su aislamiento.

El siguiente paso debe revisar los specs, separar pruebas simuladas de backend real y definir frontend 5174 / backend 8001, credenciales privadas, fixtures sintéticos y guardas específicas para HTTP y limpieza. Las autorizaciones del launcher Pest no se trasladan automáticamente a servicios HTTP. No se ejecutó Cypress en esta intervención.

Rama conservada: `test/integracion-misional`. Se preservan las modificaciones anteriores de Git. No se modificaron migraciones, datos institucionales, permisos, credenciales existentes ni archivos funcionales, y no se hicieron commits o push.
### Auditoría documental y formato al cierre

`prompt37r/preservation-audit37r-final.json` acredita 3.601 entradas fijadas intactas, 72 documentos anteriores preservados por hash/prefijo autorizado, 201 JUnit anteriores sin cambios, 1.816 salidas privadas/públicas examinadas y cero coincidencias de contraseña/APP_KEY. La verificación adicional `public-documents-final.json` examinó los cuatro documentos públicos del cierre, con cero coincidencias y prompt fuente íntegro. La unicidad y hashes de los 276 JUnit acumulados se comprobaron separadamente.

`git diff --check`: sin errores. Se revisaron además los dos documentos nuevos con `git diff --no-index --check`: sin errores de espacios; Git emitió únicamente el aviso de futura normalización CRLF a LF del prompt íntegro. El código 1 de esas comparaciones corresponde a comparar archivos nuevos con NUL, no a una prueba Pest fallida. No se normalizó el prompt para conservar sus bytes originales.

Los archivos documentales de esta intervención son `prompt-37-cierre-regresion-pest.md` y `evidencias-cierre-regresion-pest.md`, más anexos en `prompt-36-validacion-integral-misional.md` y `evidencias-validacion-integral-misional.md`. Los constructores, supervisores, consolidadores y registros nuevos permanecen privados en `.tools/misional-isolated/evidence/`. Los cambios previos del repositorio se conservan; no hubo commits ni push.