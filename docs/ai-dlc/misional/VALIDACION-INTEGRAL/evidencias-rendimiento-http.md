# Prompt 44 — Diagnóstico de rendimiento HTTP y recuperación E2E

Fecha: 11/11/2026, zona America/Lima. Rama: `test/integracion-misional`. Se utilizó el [plan existente](plan-diagnostico-rendimiento-http.md) y el checkpoint consolidado del Prompt 43. El prompt íntegro se conserva en [prompt-44-diagnostico-rendimiento-http.md](prompt-44-diagnostico-rendimiento-http.md).

## Punto de partida y seguridad

Se conservaron ocho E2E acreditados, dos fallidos históricos (Tesorería y Estudiante), 38 candidatos sin acreditar, 276 Pest/1.724 aserciones y 141 Cypress con API simulada. Los ocho acreditados no se repitieron. No se ejecutaron Pest ni los dos casos DELETE excluidos.

Referencia temporal de seguridad: `2026-11-11T23:09:39.094Z`, 18:09:39 de Lima. Se conservó durante todos los intentos, sin reiniciarla para ignorar eventos. Los eventos anteriores, incluido el de las 17:16:03, se revisaron como históricos antes de esa referencia. Los supervisores comprobaron suspensiones durante la intervención y mantuvieron la guarda máxima de 120 segundos, con autorizaciones nuevas emitidas únicamente tras comprobar identidad.

Se reutilizó exclusivamente MySQL `127.0.0.1:3309`, base `zarate_cypress_e2e`, UUID `386e58e7-dd3f-11f1-9f92-50ebf64eff02`, datadir privado existente. Las inspecciones verificaron TLS real con certificado, 52 tablas, 14 migraciones y relaciones sin infracciones. No se inicializó MySQL, repitieron migraciones, reconstruyeron fixtures ni accedió a bases protegidas. El mecanismo de restauración conservó los estados anteriores en cuarentena.

## Medición antes de la corrección

Los tiempos del cliente se midieron en un proceso Node independiente del supervisor. Esto evita confundir su event loop bloqueado por comprobaciones WMI con tiempo de respuesta del servidor. Los hooks privados PHP registraron reloj monotónico, request ID, PID, etapas del framework y cierre mediante shutdown, incluso cuando Laravel finaliza la petición sin pasar por `finally`.

| Componente | Medición |
| --- | --- |
| Conexión al proxy en el GET frío | 6,993 ms |
| Primer byte | No recibido dentro del plazo |
| GET de salud del cliente | Timeout configurado de 10.000 ms; terminación observada a 10.014,439 ms |
| Petición correlacionada dentro de PHP | 13.324,117 ms; estado 200 registrado después del timeout del cliente |
| Autoload | 1.993,320 ms |
| Registro de proveedores | 2.441,298 ms |
| Arranque de proveedores | 2.826,254 ms |
| Fin de bootstrap de proveedores desde entrada PHP | 11.667,272 ms |
| Conexión TLS e identidad, tres muestras | 13,021–35,221 ms |
| SELECT 1, tres muestras sin escrituras | 0,228–0,316 ms |

Evidencias: `prompt44/run-03/diagnostic/cold-proxy.json`, `sql-latency.json` y `prompt44/diagnostic-metrics.json`, que conserva la traza PHP correlacionada.

**Causa demostrada del timeout reproducido:** la disponibilidad del socket y la respuesta de identidad precedían a la preparación de Laravel. El primer GET real asumía además el coste de autoload y bootstrap, que excedió diez segundos. El 200 posterior del servidor no acredita una respuesta recibida a tiempo.

No se demostró que MySQL o TLS provocaran ese retraso. Tampoco se aisló una causa de disco, antivirus o Windows: el coste de carga está medido, pero su causa física última sigue NO VERIFICADA. La supervisión síncrona también bloqueó su event loop hasta 5.021 ms aproximadamente; no explica por sí sola el timeout reproducido desde otro proceso. Una muestra posterior registró CPU al 49% y unos 580 MiB de memoria disponible; no prueba causalidad en la petición fría. No se modificó el antivirus ni la energía de Windows.

## Corrección exclusivamente privada y comparación

Se agregó una preparación explícita del kernel en el adaptador privado `__p44ready`, separada de `/api/health`, con comprobación de identidad, nonce y guardas. Se habilitó la extensión OPcache ya instalada mediante argumentos del proceso PHP privado, con 64 MiB y validación de timestamps. No se cambió `php.ini` global ni código de Laravel/React del producto.

El presupuesto de preparación fue de 90 segundos, inferior a la guarda de 120. Ese presupuesto corresponde al arranque; **no amplía el plazo de diez segundos de salud**, cuyo HTTP 200 y JSON se siguieron comprobando. No se ocultó la medición fría fallida.

En `run-04`, la preparación separada tardó 2.901,551 ms observada por el supervisor y 595,570 ms dentro de PHP. La diferencia incluye planificación y supervisión; no se presenta como tiempo puro del framework.

| Salud después de preparación | Conexión | Primer byte | Total | Resultado |
| --- | --- | --- | --- | --- |
| Primera por proxy | 11,747 ms | 261,643 ms | 372,294 ms | 200 y JSON esperado |
| Segunda por proxy | 9,191 ms | 205,029 ms | 210,515 ms | 200 y JSON esperado |
| Directa al backend | 11,098 ms | 180,322 ms | 186,299 ms | 200 y JSON esperado |

Se verificó después el baseline y se efectuó la restauración fría del diagnóstico, con cierre normal (`run-04/final/mysql-restored-stop.json`). La comparación combina preparación explícita, OPcache y efectos posibles de caché del sistema operativo; no permite asignar toda la mejora a un único factor.

El campo histórico `phpSpawnToIdentityAndProxyReadyMs` incluye comprobaciones previas a crear PHP y preparación del proxy; no mide solo tiempo de arranque de PHP. En el piloto, el journal de creación y el log del servidor muestran creación, escucha y primera aceptación dentro del mismo segundo, con resolución de un segundo. No se inventa precisión de milisegundos para ese arranque.

## Intentos intermedios conservados

- Intento inicial: la guarda esperaba `Http41.php` aunque se ejecutaba el adaptador instrumentado `Http44.php`. Se cerró antes de medir salud y se creó una guarda específica con idénticos controles de ejecutable, padre y listeners.
- `run-02`: el cliente de medición rechazó el nuevo subdirectorio de salida antes de emitir HTTP. Se corrigió el destino permitido en otra copia y se validó sin red.
- `run-03`: timeout real de salud, reproducido y medido; no se inició Cypress.
- `run-04`: diagnóstico corregido, tres respuestas de salud aprobadas y restauración verificada.
- `run-05`: Cypress rechazó su configuración porque aún esperaba el destino del Prompt 43. No ejecutó pruebas; conserva su resultado de infraestructura y logs. La copia corregida se cargó sin red antes de reintentar.
- `run-06`: un caso Cypress terminó fallido buscando `institution_code` en cuatro segundos. El helper privado introducía ese fixture antes de la espera original de sesión. `frontend/src/pages/LoginPage.tsx` oculta el formulario mientras `auth.loading`. No se llegó a las API de negocio; se verificó la restauración.
- `run-07`: conserva una copia nueva del fixture que introduce el código después de la espera original `initialSession` 401. No cambia el test original ni sus aserciones. Su resultado final se registra en el cierre de este documento.

No se reescribieron resultados fallidos. Los adaptadores y manifiestos anteriores permanecen disponibles; las ampliaciones del allowlist se limitaron a destinos de evidencias privados. No se eliminaron controles de autorización SQL/HTTP ni se ampliaron privilegios.

## Tesorería y Estudiante

**Tesorería (CY39-012):** se conserva la aserción de redirección fallida. El logout respondió 204 en 3.742 ms, y una consulta previa de notificaciones tardó 6.461 ms. El navegador no había incorporado una respuesta completada de logout en su registro al fallar. La secuencia funcional espera logout antes de limpiar usuario y navegar; la hipótesis de latencia/sincronización está respaldada, pero no se acredita la comprobación final de sesión de ese intento. Propuesta pendiente: observar el POST real 204 y conservar las aserciones de redirección y `/auth/me` 401. No se modificó la prueba original.

**Estudiante (CY39-014):** la primera redirección posterior al logout fue superada; falla después de `cy.visit('/app')`. El logout respondió 204 en 856 ms. Tras esa respuesta, la captura conserva cargas de módulos del frontend y no una respuesta nueva completada de `/auth/me`. El protector de rutas espera a que termine `AuthContext.refresh`; el resultado no demuestra una sesión válida indebidamente. Falta correlacionar carga del frontend, consulta de sesión y navegación. No se cambió esa lógica ni se declaró resuelto el caso.

Ambos fallos históricos siguen pendientes. La corrección del preflight de salud no los convierte en aprobados.

## Resultado final del piloto y clasificación

**A. LATENCIA RESUELTA Y PILOTO E2E APROBADO**, dentro del entorno privado medido. La regresión integral permanece parcial; no se declara completado el inventario ni resueltos Tesorería y Estudiante.

El último intento de CY39-023 aprobó en `run-07`: una prueba, una aprobada, cero fallidas, duración Cypress de 38.462 ms. Registró 35 peticiones HTTP de aplicación y 366 consultas SQL reales, sin mocks críticos. El caso consulta el Centro de Matrículas sin escrituras de negocio; las escrituras propias de autenticación/auditoría se mantuvieron dentro del entorno sintético y se restauraron.

La salud anterior al último piloto fue 200 con el JSON esperado: conexión 5,741 ms, primer byte 97,326 ms y total 101,905 ms. La preparación separada observada por el supervisor tardó 2.017,004 ms. Se conservaron las 28 aserciones `.should` de la adaptación anterior y todas las aserciones del archivo original. La corrección privada movió únicamente el fixture institucional después de la espera original de sesión.

| Indicador | Resultado final |
| --- | --- |
| Casos E2E distintos nuevos aprobados | 1: CY39-023 |
| Ejecuciones Cypress reales terminadas en este prompt | 2 del mismo caso: 1 fallida por helper privado, 1 aprobada |
| Intento Cypress rechazado antes de ejecutar tests | 1, por destino de configuración; no se cuenta como prueba funcional fallida |
| Cancelaciones nuevas | 0 |
| Acumulado E2E distintos aprobados | 9 |
| Fallidos históricos que siguen sin aprobación | 2: CY39-012 y CY39-014 |
| Casos sin acreditar | 37 de 46; incluye dos fallidos y dos DELETE excluidos |
| Sin acreditar compatibles con el alcance | 35 |
| Pest y API simulada | 276/1.724 aserciones y 141 casos, conservados; no ejecutados de nuevo |
| Restauraciones frías registradas en el Prompt 44 | 3, con estados anteriores preservados |
| Suspensiones nuevas desde la referencia | 0; lectura del registro sin errores |
| Procesos y puertos al cierre | Cero MySQL/PHP/Node/Cypress; cero listeners en los puertos comprobados |

Las tres restauraciones registradas corresponden al diagnóstico corregido y a las dos ejecuciones reales del piloto. Los intentos rechazados antes de pruebas se conservaron e inspeccionaron en la siguiente recuperación. El último snapshot restaurado es de las 18:25:46 y el cierre normal de MySQL de las 18:25:52, sin terminación forzada. Se compararon conteos y digests con el baseline y se verificaron nuevamente 52 tablas, 14 migraciones y TLS `TLS_AES_256_GCM_SHA384`.

El resultado privado conserva `remaining: 35`, que resta todos los casos terminados, incluidos los dos fallidos históricos. Para pendientes sin aprobación debe utilizarse **46 − 9 = 37**. No sumar el fallo intermedio y la aprobación de CY39-023 como dos casos distintos.

Los hashes y ACL actuales de `.tools/mysql-local.ini`, `.tools/mysql-admin.ini`, `backend/.env` y `backend/.env.testing` coinciden con la consolidación del Prompt 43. No se consultaron filas ni se abrieron conexiones a `zarate_dev`, `zarate_test` o `zarate_pest`. Su preservación se acredita mediante exclusividad del destino, guardas, trazas y configuraciones; no se inventa un cotejo de esas bases.

## Evidencia y continuidad

Directorio privado: `.tools/cypress-e2e/evidence/prompt44/`.

- `reference.json`, `previous-checkpoint.json`, `environment-final.json`: seguridad, contexto y cierre.
- `diagnostic-metrics.json`: snapshot de los tiempos anteriores y posteriores a la corrección.
- `run-03/diagnostic/cold-proxy.json`: timeout reproducido, conservado como fallo de medición.
- `run-04/diagnostic/*`, `run-04/final/*`: preparación, tres respuestas de salud, SQL y restauración del diagnóstico.
- `run-05/cases/CY39-023/*`: error de configuración, sin pruebas ejecutadas.
- `run-06/cases/CY39-023/*`: fallo real del helper privado y restauración verificada.
- `run-07/case-adaptations-v3.json`, `fixture-adaptation-correction.json`: cambio exclusivo del fixture y pins de fuentes.
- `run-07/cases/CY39-023/*`: resultado aprobado, JUnit, HTTP/SQL, snapshots y cierre normal.
- `recovery-checkpoint.json`, `closure-metrics.json`: nueve aprobados, 37 sin acreditar y ausencia de expansión automática.

Los adaptadores privados nuevos incluyen instrumentación HTTP/Laravel, cliente independiente, medición SQL de lectura, guardas con rutas exactas actualizadas, preparación del framework y versiones acotadas del ejecutor Cypress. No se instalaron dependencias ni se modificaron permisos, migraciones o componentes funcionales. Se conservaron los cambios Git previos y la caché no rastreada de PowerShell ya documentada en el Prompt 43. No hubo commits ni push.

Siguiente paso preparado, **no ejecutado**: un grupo reducido de CY39-024 y CY39-025 para continuar el mismo módulo, reutilizando la preparación explícita y validando los helpers privados antes de cada ejecución. Antes de abrir otro lote deben revalidarse estabilidad, identidad/TLS y baseline con una referencia nueva. Mantener los nueve éxitos fuera del inventario pendiente; revisar por separado la sincronización de Tesorería y Estudiante. Los dos DELETE y los 38 Pest restringidos continúan fuera de alcance.
