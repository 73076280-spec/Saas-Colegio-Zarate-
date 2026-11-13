# Prompt 43 — Plan de diagnóstico de rendimiento HTTP

Estado: PREPARADO, NO EJECUTADO. La autorización de consolidación del 11/11/2026 no permite arrancar servicios ni ejecutar este plan. Recuperar primero `prompt43/run-05/recovery-checkpoint.json`. No repetir los ocho casos acreditados.

## Pregunta por resolver

El GET de salud excedió 10 segundos en el primer intento de dos arranques privados. En el segundo arranque, otro GET respondió 200. Se verificó previamente la disponibilidad del socket y la identidad de PHP; eso no identifica el tiempo de bootstrap Laravel ni demuestra que el primer GET cumpliera el criterio. No se considera resuelto por un GET posterior satisfactorio.

## Medición propuesta para una intervención posterior autorizada

| Fase | Medición y evidencia | Condición |
| --- | --- | --- |
| Preflight | Referencia temporal nueva; procesos, puertos, PID, rutas, hashes, ACL y ausencia de suspensión nueva | Si hay inconsistencias, detener antes de iniciar servicios |
| MySQL exclusivo | Identidad, puerto 3309, UUID, base efectiva, certificado TLS, esquema y baseline | Solo `zarate_cypress_e2e`; no inicializar, migrar ni tocar bases protegidas |
| Arranque | T0: creación del proceso; PID, padre y ejecutable. T1: primer socket disponible | Separar duración T1−T0 de cualquier petición HTTP |
| Identidad | T2: respuesta de identidad con nonce y PID esperados | La respuesta de identidad no acredita preparación de Laravel |
| Primer ciclo Laravel | Identificador y reloj monotónico en entrada PHP, carga del autoloader, bootstrap, entrada al controlador y cierre de respuesta | Instrumentación privada propuesta, sin modificar código funcional; registrar también shutdown aunque `finally` no termine |
| Respuesta HTTP | Inicio del cliente, llegada al proxy, entrada al backend, primer byte y fin del cuerpo | GET `/api/health`, límite de 10.000 ms sin cambios; registrar HTTP y cuerpo esperado |
| Dependencias | Si intervienen, medir por separado conexión TLS/SQL y las consultas de ese request ID | No inferir latencia SQL del timeout HTTP; el controlador de salud no consulta SQL explícitamente |
| Recursos y concurrencia | CPU, memoria disponible, disco y solicitudes activas alrededor de la misma ventana | Una muestra posterior no demuestra causalidad; no registrar credenciales, cookies ni datos personales |

Usar marcas UTC y duraciones monotónicas. Correlacionar request ID, PID y nonce; distinguir cola del proxy, entrada PHP y procesamiento. Medir en instancias privadas existentes y conservar todos los intentos, incluidos timeouts. No cambiar la configuración global de energía ni servicios demo.

## Reglas de decisión

- Mantener TTL máximo de 120 segundos, TLS, aislamiento y todas las guardas. No emitir autorizaciones durante esta consolidación.
- Si vence el primer GET, registrar el fallo; un GET posterior no transforma esa medición en aprobada. No repetir indefinidamente ni aumentar el límite.
- Si se necesita calentamiento, documentarlo por separado del tiempo HTTP medido. No excluir silenciosamente el primer ciclo ni cambiar el criterio de aceptación.
- Ante suspensión, identidad incorrecta, guarda vencida o timeout sin causa identificada, detener, cerrar solo los procesos propios y conservar los artefactos.
- Antes de otra prueba E2E, exigir diagnóstico respaldado por tiempos y estado de base verificado. El siguiente piloto debe ser un único caso pendiente, con HTTP/SQL reales y restauración comprobada.
- Mantener los fallos de Tesorería y estudiante. Para Tesorería, evaluar una espera explícita del POST logout 204 conservando redirección y `/auth/me` 401; modificar la prueba original requiere autorización. El fallo del estudiante ocurre tras volver a `/app` y requiere su propio diagnóstico de recarga y sesión.

La salida esperada es una línea temporal que explique dónde transcurren los diez segundos, junto con clasificación confirmada o NO VERIFICADA de cada hipótesis. No se ejecutarán los dos casos DELETE excluidos ni los 38 Pest restringidos.

## Anexo — Mediciones del Prompt 44, 11/11/2026

El Prompt 44 autorizó ejecutar este plan. Se conservan las condiciones históricas anteriores; este anexo no convierte la consolidación del Prompt 43 en una ejecución del diagnóstico.

El cliente HTTP independiente de Cypress reprodujo el timeout: conexión al proxy en 6,993 ms y vencimiento a los 10.014,439 ms, con límite configurado de 10.000 ms. La instrumentación PHP correlacionada registró el mismo request de salud durante 13.324,117 ms. El autoload consumió 1.993,320 ms; el registro de proveedores, 2.441,298 ms; su arranque, 2.826,254 ms. El bootstrap había llegado a 11.667,272 ms antes de terminar la respuesta. Por tanto, socket e identidad disponibles no equivalían a framework preparado. No se recibió un HTTP 200 dentro del plazo del cliente; el estado 200 del cierre PHP posterior no acredita esa medición fallida.

La conexión TLS con identidad y `SELECT 1` se midieron por separado, sin escrituras. En `prompt44/run-03/diagnostic/sql-latency.json`, conexión más identidad: 13,021–35,221 ms; `SELECT 1`: 0,228–0,316 ms. Estas muestras no explican por sí solas el retraso observado. La supervisión síncrona también bloqueó su event loop hasta unos cinco segundos, pero el timeout se reprodujo en otro proceso cliente: no fue únicamente una espera del supervisor.

Corrección exclusivamente privada: preparación explícita del kernel Laravel mediante `__p44ready`, con identidad y guardas, separada de la salud; habilitación de la extensión OPcache ya instalada mediante argumentos del proceso PHP privado. No se cambió `php.ini` global, código funcional, API pública, aserciones ni el límite de salud de diez segundos. El presupuesto de preparación de 90 segundos pertenece al arranque del framework y está limitado por la guarda de 120 segundos; no sustituye el criterio de respuesta HTTP.

En `prompt44/run-04`, la preparación separada duró 2.901,551 ms vista desde el supervisor y 595,570 ms dentro del servidor. Las respuestas posteriores de salud fueron 200 con JSON comprobado: 372,294 ms y 210,515 ms por proxy, y 186,299 ms directamente. La diferencia entre duración del supervisor y duración PHP se conserva; no se presenta como tiempo puro del framework. La comparación evalúa conjuntamente preparación y caché; no permite asignar toda la mejora a OPcache ni demostrar una causa de disco o antivirus.

Los resultados completos, intentos de instrumentación rechazados, cierre, restauración y piloto acotado se registran en [evidencias-rendimiento-http.md](evidencias-rendimiento-http.md). No se autorizó un lote extenso ni repetir los ocho casos previamente acreditados.

### Cierre de la aplicación del plan

Clasificación del Prompt 44: **A, latencia resuelta y piloto aprobado en el entorno privado medido**. CY39-023 aprobó tras corregir exclusivamente el orden de inserción del fixture institucional; se conservó el fallo anterior y no se modificó el test original. Registró 35 peticiones HTTP y 366 consultas SQL reales, con restauración verificada. Salud previa al último piloto: 101,905 ms, HTTP 200 y JSON esperado; preparación separada: 2.017,004 ms desde el supervisor.

El acumulado es nueve E2E distintos aprobados y 37 sin acreditar. Los fallos de Tesorería y Estudiante continúan pendientes. La fase siguiente sugerida es CY39-024/CY39-025 en un grupo reducido, previa revalidación; no se inició. Mantener las exclusiones, el límite de diez segundos para salud y la guarda máxima de 120 segundos. El checkpoint vigente está en `.tools/cypress-e2e/evidence/prompt44/recovery-checkpoint.json`.
