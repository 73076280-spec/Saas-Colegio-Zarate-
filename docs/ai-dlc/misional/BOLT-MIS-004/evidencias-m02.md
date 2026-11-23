# BOLT-MIS-004 — Evidencias de M-02: consulta y recuperación del historial

Fecha de ejecución: 01/11/2026. Rama comprobada: `feature/evaluacion-academica`. HEAD inicial: `33c4a1c` — `feat(misional): mejorar contexto de evaluaciones y registro de notas`. `git status --short` estaba vacío al iniciar; no había cambios pendientes que atribuir al usuario. Este documento registra exclusivamente la implementación M-02; no sustituye evidencias anteriores.

## Problema y verificación previa

Se leyeron `diagnostico.md`, `plan-mejoras.md` y `evidencias-m01.md` de este Bolt. Se contrastó el componente interno `ScoreHistory` de `frontend/src/learning/LearningPanel.tsx` con el endpoint, el modelo y las pruebas existentes antes de editarlo.

Antes, el resultado de la página anterior permanecía visible durante la siguiente consulta; `!result && !error` solo indicaba carga inicial. Un éxito actualizaba `result` sin limpiar `error`, de modo que podían coexistir datos nuevos y un error obsoleto. Faltaban reintento y vacío específicos. Son defectos del estado de lectura en la interfaz, no pérdida de información persistida.

La protección `alive` del efecto **ya existía**, al igual que `key={history}` al montar el historial de otra nota. No se presentan como protecciones creadas desde cero. Se conservan y se complementan con una clave de petición que invalida inmediatamente la presentación anterior.

Contrato inspeccionado: `backend/app/Http/Controllers/Api/LearningController.php::history` obtiene la nota y exige `Gate::allows('view', $score)` antes de devolver `history()->paginate(per_page ?? 20)`. Ante una nota no visible devuelve 404. `backend/app/Models/Learning/Score.php::history` establece `orderBy('id')`. `LearningAccess.php::view/visible` limita la lectura por contexto institucional, curso y estudiante; la consulta personal exige evaluación publicada. No se cambió ninguna de estas reglas. El 403 de Cypress es una respuesta simulada adicional para probar la reacción del cliente, no una afirmación de que este controlador devuelva siempre ese código.

## Archivos afectados

| Archivo | Cambio |
| --- | --- |
| `frontend/src/learning/LearningPanel.tsx` | Solo el componente interno `ScoreHistory`: estado de consulta, carga, error, reintento, vacío y título accesible. |
| `e2e/cypress/e2e/score-history.cy.ts` | Nueve casos nuevos con API simulada y datos sintéticos. |
| `docs/ai-dlc/misional/BOLT-MIS-004/prompt-04-implementacion-m02.md` | Copia íntegra del prompt adjunto, comprobada por SHA-256. |
| `docs/ai-dlc/misional/BOLT-MIS-004/evidencias-m02.md` | Este registro. |

No se editaron backend, modelos, servicios, Policies, permisos, migraciones, configuración o datos. No se modificaron M-01, Centro de Matrículas ni la lógica de tareas, entregas y filtros de Enseñanza-aprendizaje. El archivo compartido `LearningPanel.tsx` solo cambia en el historial de notas. No se instalaron dependencias ni se ejecutaron commits, push, merge o Pull Requests.

## Comportamiento implementado

- La respuesta contiene su clave `nota:página:reintento`. Solo se muestra cuando coincide con la consulta vigente; datos y errores anteriores dejan de representarse como actuales al cambiar de página o reintentar.
- Cada petición informa `Cargando historial… Página N.` mediante `role="status"`. El error usa el componente `Message` existente con `role="alert"` y el texto «No se pudo consultar el historial» más el mensaje del helper actual.
- El botón nativo «Reintentar historial» vuelve a consultar mediante GET la misma nota y página. No escribe datos. El éxito deja el error vacío.
- `EmptyState` informa «No hay cambios registrados para esta nota». No fabrica un cambio inicial si el servidor devuelve una lista vacía.
- El efecto conserva su limpieza `alive`; una respuesta o error de un componente desmontado no altera la nueva nota. `key={history}` mantiene el reinicio de página al cambiar de nota.
- Se reutiliza `Pager` únicamente con el resultado vigente, respetando metadatos y orden del servidor. Mientras carga o falla no se ofrecen controles basados en metadatos anteriores. El fallo se recupera con reintento o seleccionando/ocultando la nota.
- La sección y su etiqueta accesible dicen «Historial de cambios de la nota», con el identificador de la nota actual. Se conservan valor anterior/nuevo, motivo, identificador del actor y fecha local, así como las alternativas existentes «Sin nota» y «Registro inicial». No se solicitan nombres ni perfiles adicionales.

## Trazabilidad y criterios

| Procedimiento / RF existente | Alcance demostrado | Evidencia |
| --- | --- | --- |
| PM-03.2; RF-08 Gestión de calificaciones | Lectura fiable del rastro de correcciones de una nota; sin alterar alta, edición ni validación. | `ScoreHistory`; regresión `assessment-context.cy.ts`; cobertura Pest identificada de motivo/actor y rollback. |
| PM-03.4; RF-09 Consulta de calificaciones | Historial de modificaciones de **una nota autorizada**, no expediente longitudinal completo. | GET `/api/v1/scores/{id}/history`; nuevo spec de lectura personal y reacción ante rechazo. |
| RF-24 Auditoría del sistema | Presentación del historial ya asociado a la nota; se preserva la trazabilidad existente. | `Score::history`; prueba Pest de historial/auditoría identificada. No se consultó `/audit-logs` ni se amplió su acceso. |

Los nombres RF proceden de `docs/traceability.md` y `docs/requirements-status.md`. Esta mejora no declara completamente resuelto el alcance amplio de PM-03.4. M-03 conserva su estado **PENDIENTE DE CONFIRMACIÓN** institucional.

| Criterio del plan M-02 | Comprobación focalizada |
| --- | --- |
| Carga por nota/página y ausencia de datos obsoletos | Casos de carga inicial y segunda página; se verifica parámetro `page=2` y retorno con Anterior. |
| Error → éxito, reintento con misma nota/página, vacío | Caso HTTP 500, reintento de `/scores/12/history?page=2`, desaparición del error y caso de lista vacía. |
| Respuestas antiguas y cambio de nota | Dos casos con respuesta correcta/error retrasados; otro caso cambia desde página 2 y comprueba página 1 de la otra nota. |
| Conservación de campos y orden | Valores, motivo, actor, fecha local, nulos y orden tal como llega, sin ordenar en cliente. |
| Sin ampliación de acceso | Lectura de código y caso 403 sin filas/actor de página anterior; no se solicitan rutas familiares ni audit-logs. IDOR real queda pendiente de Pest. |
| Accesibilidad y móvil | Región etiquetada, estados anunciables, botón nativo con foco comprobado y activación por clic; viewport 390 × 844 sin desbordamiento horizontal. La activación por teclado no quedó validada en esta ejecución; no equivale a certificación WCAG. |

## Ejecución y resultados

La aplicación se comprobó disponible en `http://localhost:5173` (HTTP 200). Cypress utiliza Electron y todas las solicitudes de los cinco specs seleccionados son simuladas; no se ejecutaron escrituras académicas reales.

Primera ejecución conjunta desde `e2e`:

```text
npm test -- --spec cypress/e2e/score-history.cy.ts,cypress/e2e/assessment-context.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts,cypress/e2e/learning-filters.cy.ts
```

Resultado inicial: **49 aprobadas, 1 fallida, 0 pendientes, 0 omitidas; código 1**. El nuevo spec obtuvo 8/9; las 41 regresiones aprobaron. El fallo fue la aserción de carga después de simular Enter mediante `.type('{enter}')` en el botón: no se observó el reintento esperado. Se probó `cy.press(Cypress.Keyboard.Keys.ENTER)` y se repitió el spec: **8 aprobadas, 1 fallida, código 1**, en la misma aserción. La captura conservaba el botón enfocado y el error, sin recuperación. No se considera acreditada la activación por teclado en Electron/Cypress ni se atribuye automáticamente el resultado a un defecto de React o del navegador.

El caso focalizado de recuperación se ajustó para comprobar foco y activación por clic del botón nativo; mantiene todas las aserciones de carga, ruta/nota/página, desaparición del error y datos recuperados. No se modificó la aplicación tras estos fallos. La repetición final se registra a continuación. La activación específica por teclado queda como limitación explícita; los dos intentos fallidos no se presentan como aprobados.

| Verificación | Resultado real |
| --- | --- |
| `npm run build`, `frontend` | APROBADO; TypeScript y Vite finalizaron, sin errores. |
| `npm run lint`, `frontend` | APROBADO; código 0, sin errores reportados. |
| `npm run typecheck`, `e2e` | APROBADO; código 0, repetido tras el último ajuste del spec. |
| `score-history.cy.ts`, última repetición | **9 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas**; código 0, runner 33 segundos. |
| `assessment-context.cy.ts`, regresión M-01 de este Bolt | **12 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `virtual-access.cy.ts`, regresión BOLT-MIS-003 M-01 | **9 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `submission-deadline.cy.ts`, regresión BOLT-MIS-003 M-02 | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `learning-filters.cy.ts`, regresión BOLT-MIS-003 M-03 | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `git diff --check` | APROBADO, sin errores detectados. Se comprueban también los archivos nuevos por separado. |
| Integridad del prompt | SHA-256 de adjunto y copia coinciden: `9487649AA4966C55ED8BFC1F884CD0753C252B389CF241A08A8F32DC22AC6961`. |

Comando de repetición focalizada: `npm test -- --spec cypress/e2e/score-history.cy.ts`, desde `e2e`.

**Consolidado por el último resultado de cada caso: 50 casos Cypress distintos aprobados, 0 fallidos en los specs finales, 0 pendientes/omitidos del runner.** Son 9 nuevos y 41 de regresión; no se suman las reejecuciones ni se presenta el primer comando conjunto como aprobado. No hubo cambios de aplicación después de las regresiones. La activación por teclado se retiró del caso funcional de recuperación tras los dos fallos descritos y **no se cuenta como comprobada**. Los controles de compilación, lint, tipos y formato no se suman a los casos Cypress.

## Pruebas no ejecutadas y limitaciones

- **Pest `backend/tests/Feature/Sprint7Test.php`: NO EJECUTADO, 10 casos identificados.** Son pertinentes especialmente `preserves previous scores reason and actor with atomic audit rollback` y `shows published tasks only to approved students and blocks foreign submission and score IDOR`. El PHP de PATH es 8.2.12 y no satisface Composer (>= 8.4.1), por lo que el primer preflight se detuvo antes de Laravel. Se localizó el PHP portátil documentado en `docs/pruebas.md` y se repitió con `..\.tools\php\php.exe`: entorno `testing`, MySQL/base/usuario `zarate_test`, sin configuración cacheada, comprobando destino antes de intentar exclusivamente SELECT. La conexión falló con código **2002**. No quedó acreditada disponibilidad/aislamiento operativo y no se lanzaron fixtures ni pruebas con escritura. No se preparó MySQL ni se cambiaron credenciales o configuración.
- **Cypress con backend real `learning.cy.ts` y `virtual.cy.ts`: NO EJECUTADOS, 3 casos cada uno.** La comprobación HTTP a `http://localhost:8000/api/health` no pudo conectar; tampoco hay base aislada acreditada. No se usaron datos institucionales o de desarrollo para completar estos resultados.
- El alcance identificado no ejecutado suma **16 casos** (10 Pest y 6 Cypress reales). No son fallos del runner ni casos skipped. No se atribuyen aprobaciones de ejecuciones anteriores a esta implementación.
- El caso 403 acredita presentación del cliente ante rechazo simulado, no sustituye una prueba real de aislamiento institucional, IDOR, matrícula revocada o perfiles familiares. Esas reglas se inspeccionaron y quedaron intactas, pero no se volvieron a validar contra Laravel/MySQL.
- Las solicitudes antiguas se ignoran; no se cancela físicamente el tráfico HTTP. El historial conserva el alcance y los datos que la API actual entrega. No implementa expediente académico completo ni modifica publicación/cierre.
- El formato horario sigue siendo el local del navegador. El control móvil/teclado es focalizado; no se certifican todos los navegadores, lectores de pantalla o niveles de accesibilidad.
- No se ejecutó la suite completa del proyecto. El aviso de deprecación de Electron de Cypress no bloqueó el arranque; no se instalaron navegadores ni dependencias.

## Estado y control de alcance

**M-02: COMPLETADO dentro del alcance de interfaz aprobado, con limitaciones de verificación explícitas.** Carga, error, reintento por clic, vacío, paginación, cambio de nota y respuestas tardías cuentan con pruebas simuladas aprobadas. La interfaz conserva controles HTML nativos y etiquetas accesibles; la activación efectiva mediante Enter quedó NO VERIFICADA tras los intentos descritos. Se recomienda comprobarla en navegador interactivo antes de afirmar validación completa de accesibilidad.

La integración actual con Laravel/MySQL y las autorizaciones reales no se declaran aprobadas: permanecen pendientes los 16 casos identificados. No se afirma que todo el Bolt ni PM-03.4 estén completados; M-03 continúa fuera del alcance. Se conservan sin reescritura el diagnóstico, plan y evidencia M-01. El diff funcional queda limitado a `ScoreHistory` y los cuatro archivos afectados enumerados arriba.
