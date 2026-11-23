# Prompt 43 — Continuación de Cypress E2E

## Historial recuperado del 10/11/2026

Este documento recupera resultados de archivos existentes; no convierte intentos cancelados en aprobaciones. Rama comprobada: `test/integracion-misional`. HEAD: `1a043035c126a5bc3e5ed14cf43fdd49a4e171bf`.

El consolidado privado `prompt43/run-03/result` registra seis aprobados acumulados: CY39-010, CY39-001, CY39-009, CY39-011, CY39-008 y CY39-013. Los cuatro últimos fueron incorporados en el Prompt 43. CY39-008 acredita HTTP real sin consultas SQL de aplicación; los otros cinco acreditan SQL real. No se repitieron los seis casos.

CY39-012 (Tesorería) terminó con una aserción fallida de redirección y restauración verificada. CY39-014 (estudiante) fue cancelado por suspensión, sin resultado Cypress ni JUnit final en `run-03`. CY39-023 conserva la cancelación histórica del Prompt 42 y no tiene una aprobación nueva.

Los archivos `environment-final.json` y `power-events-final.json` del Prompt 43 existen. El primero registra procesos y listeners vacíos a las 17:06:53 del 10/11 y deja explícitamente sin verificar las filas posteriores a la cancelación. Su existencia se comprobó; no se asumió que un comando interrumpido hubiera terminado.

Las suspensiones de las 16:59:25 (Button or Lid) y 17:01:43 (System Idle) se conservan como históricas. La primera interrumpió el lote y la segunda ocurrió después del cierre controlado. Se encontraron además eventos históricos a las 17:15:47 y 18:23:15. No se cambiaron las opciones de energía de Windows.

## Anexo — Recuperación del 11/11/2026

### Preservación y cliente

Los comandos locales de lectura y preparación funcionaron durante la recuperación. Esto comprueba operatividad de esas herramientas; no acredita una versión específica del cliente Codex.

Antes de modificar documentación se verificaron los hashes de 603 archivos originales y 82 documentos anteriores. También se contrastaron los 276 JUnit Pest, con 1.724 aserciones, los 13 archivos de resultados que respaldan el lote de API simulada y los tres intentos históricos crudos del Prompt 41. Los seis aprobados E2E se comprobaron contra resultados Cypress y existencia de JUnit. Evidencia: `prompt43/run-04/historical-accreditation-verified.json` y `recovery-readonly-audit.json`.

Se conservan 276 Pest acreditados y 141 Cypress con API simulada; no se ejecutaron nuevamente. Los 38 Pest restringidos y CY39-033/CY39-034, que implican DELETE sobre `communication_targets`, siguen excluidos.

### SQL y restauración

La referencia de ejecución nueva fue `2026-11-11T14:58:40.694Z` (09:58:40, Lima). Los supervisores conservaron esa referencia durante los dos intentos privados, sin reiniciarla para ocultar eventos.

La inspección inicial se efectuó antes de restaurar. Comprobó:

- Servidor exclusivo `127.0.0.1:3309`, base efectiva `zarate_cypress_e2e`.
- UUID `386e58e7-dd3f-11f1-9f92-50ebf64eff02`, datadir exclusivo y linaje de procesos verificados por las guardas.
- TLS real con verificación de certificado y cifrado `TLS_AES_256_GCM_SHA384`.
- 52 tablas, 14 migraciones, cero transacciones activas y 112 restricciones foráneas sin infracciones.
- CHECK TABLE satisfactorio sobre las 52 tablas.
- Diferencias respecto al baseline en filas y almacenamiento privado, compatibles con residuos del caso cancelado.

Se preservó el estado anterior en cuarentena y se aplicó únicamente la restauración fría autorizada. Se verificaron los archivos del baseline y, tras arrancar nuevamente, los conteos y digests de filas. No se repitieron inicialización, migraciones, seeders ni creación de fixtures.

`run-04/recovery/result` acredita la recuperación inicial. `run-05/recovery/result` acredita otra recuperación tras el preflight HTTP fallido, conservando su estado anterior. Los tres casos terminados en `run-05` tienen `restored.json`, cierre normal de MySQL y resumen con `restorationVerified: true`.

Durante esta continuación se acreditan cinco restauraciones frías: dos de recuperación y tres posteriores a casos. Las seis registradas anteriormente en el Prompt 43 se conservan. La última verificación es `run-05/cases/CY39-016/restored.json`, de las 10:10:45 del 11/11; el cierre normal consta a las 10:10:50. El caso cancelado del estudiante ya no deja una restauración pendiente: se recuperó su estado histórico y su nuevo intento terminó y fue restaurado.

### Diagnóstico HTTP

Backend privado: `http://127.0.0.2:8001`; frontend/proxy: `http://127.0.0.2:5174`; salud consultada: `http://127.0.0.2:5174/api/health`. La identidad de PHP y de los listeners se comprobó antes de consultar la salud.

`run-04` terminó antes de Cypress porque el GET de salud excedió 10.000 ms. No hay resultado Cypress para ese intento. Los procesos se cerraron normalmente.

En `run-05` se permitió un máximo de tres GET de disponibilidad, cada uno con el mismo límite de 10.000 ms y guardas vigentes. El primer GET volvió a vencer; el segundo respondió 200 con el cuerpo esperado. Los otros dos casos obtuvieron salud 200 al primer GET. Evidencias: `health-attempts.jsonl` y `health-readiness.json` de cada caso. No se aumentó el timeout ni se cambiaron aserciones originales.

Esto demuestra latencia variable del preflight, pero **no identifica su causa**. El servidor ya aceptaba conexiones y respondía a la identidad antes del GET lento. La disponibilidad del socket no demuestra que el primer ciclo completo Laravel esté preparado. El arranque frío de PHP/Laravel, la carga de archivos, el proxy y la presión de recursos siguen siendo hipótesis; no se atribuye el retraso a TLS o SQL sin medición aislada. `backend/app/Http/Controllers/Api/HealthController.php` devuelve un JSON fijo sin consultas SQL explícitas.

Los registros PHP muestran conexiones aceptadas y cerradas; algunas respuestas Laravel no aparecen como registros completos en el `finally` del adaptador privado. Por tanto, la instrumentación disponible no separa con precisión espera en proxy, arranque Laravel y tiempo de respuesta. Una muestra posterior mostró aproximadamente 0,86 GiB de memoria libre y CPU al 30%; no es una medición contemporánea del timeout ni demuestra causalidad.

**No se autoriza una expansión automática del lote con esta evidencia.** El siguiente diagnóstico debe medir por separado disponibilidad e identidad, entrada de la petición, bootstrap Laravel y respuesta, mediante instrumentación privada; debe mantener el criterio de 10 segundos y las guardas de 120 segundos. Si el timeout vuelve a ocurrir sin explicación, debe detenerse el lote. No se iniciaron más casos después de revisar la última continuación del usuario.

### Resultados nuevos y fallos preservados

| Caso | Resultado de esta continuación | Evidencia real | Restauración |
| --- | --- | --- | --- |
| CY39-014, estudiante | 1 fallida | HTTP y 101 consultas SQL de aplicación | Verificada |
| CY39-015, apoderado | 1 aprobada | HTTP y 127 consultas SQL de aplicación | Verificada |
| CY39-016, login sin CSRF | 1 aprobada | HTTP real; cero consultas SQL de aplicación | Verificada |

Los resultados crudos, JUnit, `integration-proof`, `checkpoint`, snapshots y cierres permanecen en `prompt43/run-05/cases/<ID>/`. El supervisor cerró con `stopReason: null` porque terminó su lote acotado; esto **no** significa que la regresión completa haya aprobado.

Tesorería mantiene el fallo original: `expected '/app/users' to equal '/login'` en cuatro segundos. El backend respondió POST logout 204 en 3.742 ms; una consulta previa de notificaciones tardó 6.461 ms. `AuthContext.tsx` espera el POST antes de borrar el usuario y `AppLayout.tsx` navega después de esperar logout. La prueba original no espera explícitamente esa respuesta. La hipótesis principal es sincronización/latencia; no se confirma un defecto funcional ni se acredita la invalidación final de sesión en ese intento.

Corrección mínima propuesta para Tesorería: observar la petición real de logout y esperar su HTTP 204 antes de conservar las aserciones originales `/login` y `/auth/me` 401. No aumentar arbitrariamente tiempos. No se aplicó esa modificación a la prueba original; requiere revisión previa.

El nuevo fallo de estudiante es distinto: la primera redirección tras logout fue superada; falla la segunda aserción, tras `cy.visit('/app')`, que todavía observa `/app`. El logout respondió 204 en 856 ms. No basta la hipótesis de Tesorería para explicar este segundo fallo: falta correlacionar recarga, consulta de sesión y eventos del navegador. Se conserva sin corregir componentes ni aserciones.

### Mensaje Bad Request y límite de consolidación

El mensaje anterior reportado por el usuario no pudo atribuirse de manera concluyente a un servicio local. No se presentó un registro Laravel que lo vincule a HTTP 400.

Durante esta recuperación sí se reprodujo un mensaje idéntico en una herramienta: `Automatic approval review failed: {"detail":"Bad Request"}`. La herramienta indicó expresamente que **el comando no fue ejecutado**, que falló la revisión automática y que no era una determinación de inseguridad. Ese error corresponde al mecanismo de aprobación de Codex, no a Laravel. Esto no demuestra que todos los mensajes anteriores tuvieran el mismo origen.

El comando rechazado intentaba generar `run-05/recovery-checkpoint.json`, `http-diagnosis.json`, `diagnosis-reference.json` y `environment-final.json`. **Esos archivos no se consideran creados ni verificados por ese intento.** No se eludió el control. El checkpoint válido continúa siendo `run-05/checkpoint.json`, junto con `run-05/result` y los artefactos individuales. Esta documentación pública recoge el cierre sin inventar una consolidación privada exitosa.

### Estado acumulado y siguiente paso

| Indicador | Estado comprobado |
| --- | --- |
| E2E distintos aprobados acumulados | 8: CY39-010, CY39-001, CY39-009, CY39-011, CY39-008, CY39-013, CY39-015, CY39-016 |
| Aprobados nuevos en esta continuación | 2 |
| Aprobados incorporados por todo el Prompt 43 | 6 |
| Fallidos distintos pendientes | 2: CY39-012 y CY39-014 |
| Ejecuciones nuevas terminadas | 3: 2 aprobadas, 1 fallida |
| Cancelaciones nuevas | 0; se conserva la cancelación histórica de estudiante y la de CY39-023 |
| Candidatos sin acreditar | 38 de 46; incluye dos fallidos y dos excluidos por DELETE |
| Pendientes compatibles con el alcance | 36; no todos fueron ejecutados |
| Suspensiones nuevas durante la ejecución comprobada | 0 desde la referencia de las 09:58:40 |
| Procesos privados al comprobar a las 10:14:57 | Ningún MySQL, PHP, Node o Cypress activo; sin listeners 3309/8001/5174 |

De los ocho aprobados, seis acreditan SQL de aplicación y dos solamente HTTP real (CY39-008 y CY39-016). La propiedad `remaining: 36` del resultado privado resta todos los casos terminados, incluidos los fallidos; no equivale a pendientes sin aprobación. El cálculo correcto de pendientes sin acreditar es 46 − 8 = 38.

La preservación de `zarate_dev`, `zarate_test` y `zarate_pest` se sustenta en destinos exclusivos, guardas y trazas del entorno 3309; no se ejecutó una comparación de filas de esas bases ni se las abrió para documentarla. No se cambiaron migraciones originales, código funcional, permisos, servicios demo ni configuración global de energía. La recopilación final adicional de hashes/ACL quedó sin ejecutar por el fallo de revisión automática; no se presenta como aprobada.

Git conserva los cambios previos de `evidencias-finalizacion-migraciones.md`, `integration.cy.ts`, los documentos y el helper ya existentes. Se detectó además `Microsoft/Windows/PowerShell/ModuleAnalysisCache`, creado durante esta ejecución de herramientas; es una caché no rastreada, no código funcional. Se preservó. El instrumental nuevo es privado: supervisores/adaptadores `43r4` y `43r5`, sus ejecutores Job Object y la extensión acotada de destinos de snapshot para `run-04` y `run-05`. TTL, TLS y restricciones SQL permanecen vigentes.

**Estado: PARCIAL; expansión E2E detenida por diagnóstico HTTP pendiente y dos fallos sin resolver.** Siguiente paso exacto: recuperar `run-05/checkpoint.json`, confirmar nuevamente procesos y estabilidad, resolver la recopilación privada bloqueada por la revisión de herramientas y medir el arranque/GET de salud antes de otra prueba. Tras aprobar ese diagnóstico, ejecutar un único piloto pendiente y verificar restauración. CY39-023 sigue sin acreditar; no repetir los ocho éxitos. No se hicieron commits ni push.

Verificación documental final: `git diff --check` terminó sin errores para los cambios rastreados; los dos documentos de continuidad existen. El escaneo de términos de credenciales del nuevo reporte no encontró coincidencias. Los cambios funcionales rastreados que muestra Git corresponden al estado previo, no a esta intervención.

## Anexo — Consolidación documental final, 11/11/2026

Alcance autorizado: únicamente consolidación documental y privada. La revisión automática volvió a funcionar. No se iniciaron servicios, no se abrieron conexiones SQL ni se ejecutaron Pest, Cypress o peticiones de salud.

Se recuperaron `run-05/checkpoint.json` y `run-05/result`. Los cuatro informes cuyo comando había fallado no existían: `recovery-checkpoint.json`, `http-diagnosis.json`, `diagnosis-reference.json` y `environment-final.json`. Se crearon ahora con fechas nuevas y sin sobrescribir los checkpoints, resultados, registros ni anexos históricos. El nuevo manifiesto está en `.tools/cypress-e2e/evidence/prompt43/run-05/consolidation-01/verification.json`; incluye hashes de 20 artefactos de los diez casos terminados y copias de los dos documentos antes de este anexo.

Se comprobaron los resultados crudos y la existencia y hashes de sus JUnit: **8 aprobados** (CY39-010, CY39-001, CY39-009, CY39-011, CY39-008, CY39-013, CY39-015 y CY39-016), **2 fallidos** (CY39-012 y CY39-014) y **38 sin acreditar** de los 46 candidatos. Los dos fallidos están incluidos en los 38; también están incluidos los dos excluidos por DELETE. Quedan 36 candidatos sin acreditar compatibles con el alcance. No hubo nuevas ejecuciones ni cambios en esos resultados. Se verificaron igualmente los hashes de los 603 archivos originales, los 276 JUnit Pest y los 13 archivos de resultados de API simulada.

La última restauración se revalidó documentalmente contra los conteos y digests del baseline y su cierre controlado: snapshot `run-05/cases/CY39-016/restored.json`, 52 tablas y 14 migraciones. TLS e identidad corresponden a esa verificación histórica; **no se presentan como una conexión comprobada en vivo durante esta consolidación**.

`run-05/environment-final.json` registra cero procesos MySQL/PHP/Node/Cypress y cero listeners en los puertos consultados (3307, 3308, 3309, 8000, 8001, 5173 y 5174), sin archivo PID MySQL. Contiene snapshots actuales de hash y ACL de las cuatro configuraciones protegidas, sin credenciales ni contenido de esos archivos. Esta recopilación no constituye una comparación de filas de las bases protegidas. No se modificaron bases ni servicios de demostración.

La consolidación antes bloqueada queda **COMPLETADA**. La regresión E2E permanece **PARCIAL**, con diagnóstico HTTP y dos fallos pendientes. El plan [plan-diagnostico-rendimiento-http.md](plan-diagnostico-rendimiento-http.md) deja separados arranque, disponibilidad y tiempo HTTP; es documentación preparada, no un diagnóstico ejecutado. Se conservaron los cambios pendientes de Git y no se hicieron commits ni push.
