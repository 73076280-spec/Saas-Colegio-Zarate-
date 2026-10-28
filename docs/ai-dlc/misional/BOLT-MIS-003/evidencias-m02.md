# BOLT-MIS-003 — Evidencias de M-02

Fecha: 28/10/2026. Rama: `feature/ensenanza-aprendizaje`. HEAD al iniciar: `7b459cf`, implementación de M-01. `git status --short` estaba limpio. Se revisaron diagnóstico, plan y evidencia de M-01, además de los componentes, contratos y pruebas indicados por el prompt. No se modificaron archivos de M-01 ni se implementó M-03.

## Problema detectado y comportamiento anterior

`LearningAccess::submit` comprueba capacidad, titularidad estudiantil, tarea publicada y elegibilidad de curso/matrícula. El vencimiento y los intentos se validan definitivamente en `SubmissionService::save`: `now()->gt($assignment->due_at)`, rechazo si venció sin tardanza y nuevo intento solo tras RETURNED. La capacidad de consulta/entrega no incorpora por sí sola la restricción temporal.

En el frontend, el botón «Entregar tarea» dependía de `abilities.submit` y de la consulta de intentos, sin considerar fecha límite ni actualizarse al vencer. Podía iniciar un formulario destinado al rechazo del servidor. La tarjeta de tarea ya mostraba fecha y política de tardanza, pero el panel anidado de entregas no mostraba ese contexto ni lo actualizaba.

El formulario ya mantenía su estado al capturar errores; se conserva ese comportamiento y se comprueba explícitamente con pruebas de texto y archivo. No se presenta la retención ante errores como una capacidad creada desde cero.

## Solución y comportamiento posterior

- El panel de entregas de una tarea muestra fecha/hora local con zona horaria, plazo vigente o vencido y política de tardanza. Informa que el servidor confirma la disponibilidad al enviar.
- El cálculo compara instantes ISO mediante `Date.parse` y usa estrictamente `now > due_at`. En el instante exacto del límite el plazo sigue vigente. Se respetan offsets, sin reinterpretarlos como fechas locales sin zona.
- Un hook actualiza la referencia temporal cada segundo y limpia el intervalo al desmontar. El botón no se ofrece al vencer si no se admite tardanza. El manejador de apertura vuelve a comprobar `Date.now()`, evitando depender solo del último render.
- La tardanza permitida conserva la opción de entrega únicamente si también está presente `abilities.submit` y se cumplen las condiciones existentes de intentos. El reloj no concede capacidades ni calcula autorización alternativa.
- El formulario recibe la tarea padre cuando existe ese contexto, comprueba nuevamente capacidad y vencimiento al enviar y actualiza el botón mientras permanece abierto. Si vence, no desmonta el formulario ni borra la respuesta: muestra aviso y permite copiar el texto antes de salir.
- Ante un rechazo definitivo del servidor, se conserva el formulario, el texto y el archivo seleccionado; se muestra el motivo obtenido mediante el manejo de errores existente y no se informa éxito.
- Intentos previos y feedback siguen visibles. No se cambia el orden/paginación de intentos ni las condiciones de devolución, revisión o cierre.

## Archivos realmente modificados o creados

| Archivo | Cambio |
| --- | --- |
| `frontend/src/learning/shared.tsx` | Helpers de vencimiento estricto y hook temporal reutilizado por panel/formulario |
| `frontend/src/learning/LearningPanel.tsx` | Contexto de fecha/estado en entregas, guardia de apertura y propagación de tarea padre |
| `frontend/src/learning/SubmissionForm.tsx` | Revalidación de contexto antes de enviar y aviso/bloqueo temporal sin borrar contenido |
| `e2e/cypress/e2e/submission-deadline.cy.ts` | Diez casos nuevos con reloj y respuestas API controladas |
| `docs/ai-dlc/misional/BOLT-MIS-003/prompt-04-implementacion-m02.md` | Copia íntegra del prompt adjunto recibido |
| `docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m02.md` | Esta evidencia |

Backend revisado sin cambios: `LearningAccess.php`, `SubmissionService.php`, `LearningService.php` y `Models/Learning/Assignment.php`. El formulario existente convierte fecha local a ISO y el servicio normaliza a UTC; no se altera esa cadena ni la configuración horaria. No se modificaron permisos, roles, tablas, migraciones, dependencias, Centro de Matrículas, macroprocesos estratégico/de apoyo o reglas de cierre/revisión.

## Pruebas ejecutadas

| Verificación | Resultado comprobado |
| --- | --- |
| `npm run build`, en `frontend` | APROBADO, código 0; TypeScript `tsc -b` y Vite, 99 módulos transformados |
| `npm run lint`, en `frontend` | APROBADO, código 0, sin errores reportados |
| `npm run typecheck`, en `e2e` | APROBADO, código 0; `tsc --noEmit` |
| `npm test -- --spec cypress/e2e/submission-deadline.cy.ts`, en `e2e` | APROBADO, código 0: 10 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |

El spec nuevo utiliza sesión de estudiante y API simuladas, sin modificar roles o datos persistidos. Congela Date y los intervalos, conservando los demás temporizadores normales del navegador. No depende de la fecha actual del equipo. Casos ejecutados:

1. Tarea vigente, envío permitido y visualización del resultado.
2. Tarea vencida sin tardanza: no ofrece inicio ni envía solicitud.
3. Vencida con tardanza permitida y capacidad positiva: permite enviar y presenta el estado LATE simulado.
4. Instante exacto del límite aún vigente y transición posterior sin recargar.
5. Formulario abierto al vencer: conserva texto y deshabilita envío; un evento submit directo también se bloquea sin petición.
6. Devolución vigente: nuevo intento con conservación de intento anterior y feedback.
7. Devolución vencida: conserva historial y no habilita intento nuevo.
8. Respuesta 422 del servidor: motivo comprensible, texto y archivo intactos, sin mensaje de éxito.
9. Tardanza habilitada con `abilities.submit=false`: no ofrece entrega.
10. Fecha ISO con offset `-05:00`: comparación por instante, incluido el límite exacto.

Estos diez casos prueban la interfaz y sus peticiones, no la implementación de las reglas de Laravel. Las respuestas de éxito, estados e intentos de estos casos son fixtures deliberadas.

### Regresión relevante ejecutada

Comando desde `e2e`: `npm test -- --spec cypress/e2e/learning.cy.ts,cypress/e2e/virtual.cy.ts,cypress/e2e/virtual-access.cy.ts`.

| Spec | Alcance | Resultado |
| --- | --- | --- |
| `learning.cy.ts` | Servicios locales reales: publicación/revisión docente, entrega de archivo del estudiante, registro/consulta de nota | 3 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `virtual.cy.ts` | Servicios locales reales: sesión entre espacios, navegación PC/tablet/móvil, roles y denegación de curso no autorizado | 3 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `virtual-access.cy.ts` | API simulada: regresión de los nueve escenarios de M-01, incluidos permisos mínimos y usuarios sin acceso | 9 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |

La ejecución conjunta terminó con código 0: **15/15 aprobadas** en 2 minutos y 18 segundos. Se conservaron los specs anteriores sin cambios. Los flujos de aprendizaje realizan las escrituras de prueba previstas en el entorno local; no se ejecutaron seeders ni se alteraron roles. Cypress generó las cuatro capturas previstas del aula en su carpeta de artefactos, fuera del seguimiento Git. Se utilizó Electron fuera del sandbox; su aviso de deprecación no impidió las pruebas.

Total actual: **25 pruebas Cypress aprobadas, 0 fallidas, 0 pendientes y 0 omitidas**, sin sumar reintentos ni resultados de M-01 anteriores: 10 nuevas de M-02 y 15 de regresión ejecutadas en esta intervención. De ellas, 19 usan API simulada y 6 los servicios locales reales.

## Casos no verificados y límites

- Pest focalizado: **NO EJECUTADO**. No se modificó backend. Se revisó la regla en código y se identificaron los casos existentes `enforces deadlines late configuration and closed tasks` y `records private submissions review feedback and returned attempts without overwriting history` de `backend/tests/Feature/Sprint7Test.php`; sus aprobaciones históricas no se cuentan como resultados actuales.
- Un reloj del navegador adelantado/atrasado puede orientar incorrectamente. La comprobación definitiva sigue en servidor; no se modifica su regla por el resultado local. El intervalo puede sufrir throttling en pestañas suspendidas; abrir y enviar vuelven a comprobar el tiempo actual.
- La orientación temporal se aplica al contexto de tarea disponible. La edición desde «Mis entregas» sin tarea padre conserva su comportamiento y validación de servidor; no se añade una consulta de tarea ni se inventa un vencimiento ausente.
- El contenido retenido está en el formulario montado: no es un borrador persistente y no se garantiza conservación al cancelar, navegar, recargar o expirar la sesión. El aviso de vencimiento lo explicita para permitir copiarlo antes de salir.
- No se cambia el contrato de capacidades ni se intenta sincronizar en vivo cambios de permisos, fechas o estado hechos por otra sesión. Sus rechazos se muestran sin borrar la respuesta.
- No se implementan filtros docentes, nueva bandeja, cambios de intentos, notas, revisión/cierre, nuevas autorizaciones ni M-03. No se certifica toda la suite del proyecto ni todos los escenarios de seguridad.

## Trazabilidad

PM-02.4 — Recibir y revisar tareas: orientación de recepción, restricciones temporales y conservación de respuesta/retroalimentación. RF-12 — Entrega de actividades es el principal; RF-10 — Gestión de actividades académicas aporta tarea, vencimiento y política de tardanza; RF-22 — Aula virtual aporta su contexto de acceso. No se crean nuevos RF ni se alteran las reglas existentes.

## Revisión final y estado

`git diff --check`: APROBADO, sin errores detectados. Los archivos nuevos de prueba/evidencia se comprobaron adicionalmente por espacios finales y marcadores de conflicto; el prompt se verificó como copia íntegra del adjunto mediante SHA-256. El estado Git se limita a los seis archivos enumerados. No se realizaron commits, push, merge ni Pull Requests.

**M-02: COMPLETADO dentro del alcance aprobado.** La orientación temporal y la conservación del contenido están verificadas por los diez casos nuevos; la regresión relevante aprobó sus quince casos y los controles de compilación, lint y tipos aprobaron. Esta conclusión no certifica pruebas Pest no ejecutadas, la suite completa del repositorio o la sincronización del reloj local con el servidor.
