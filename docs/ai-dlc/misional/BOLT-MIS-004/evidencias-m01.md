# BOLT-MIS-004 — Evidencias de M-01: contexto de evaluación

Fecha: 01/11/2026. Rama verificada: `feature/evaluacion-academica`. HEAD inicial: `e49ba69`. `git status --short` estaba limpio, sin cambios previos ajenos. Se revisaron diagnóstico, plan y prompt 02, componentes y contrato de API antes de modificar código.

## Problema y alcance autorizado

Las tarjetas de evaluaciones no presentaban de forma consistente periodo, máximo y fecha ya recibidos por la API. Al abrir notas, el mensaje genérico de bloqueo no distinguía evaluación no publicada/cerrada de periodo no habilitado. El formulario identificaba evaluación y estudiante, pero no reunía ese contexto académico junto a la nota.

M-01 mejora la orientación de PM-03.1 — Configurar evaluaciones y PM-03.2 — Registrar calificaciones. Reutiliza RF-10 Gestión de actividades académicas, RF-08 Gestión de calificaciones y RF-22 Aula virtual. RF-09 es contexto de consulta; no se redefine publicación de resultados ni historial académico.

El plan aprobado proporciona el alcance. No se requiere una decisión académica nueva para mostrar datos existentes o explicar condiciones que el servidor ya exige. La publicación independiente y conservación al cierre permanecen pendientes de M-03; el manejo de paginación/errores de historial corresponde a M-02 y no se modifica aquí.

## Archivos realmente modificados o creados

| Archivo | Cambio |
| --- | --- |
| `frontend/src/learning/AssessmentContext.tsx` | Nuevo componente reutilizable de curso, periodo, máximo y fecha; helper descriptivo de condiciones de calificación |
| `frontend/src/learning/LearningPanel.tsx` | Presenta contexto en tarjetas de evaluación y panel anidado de notas; reemplaza el mensaje genérico por orientación basada en datos/capacidades existentes |
| `frontend/src/learning/ScoreForm.tsx` | Añade el mismo contexto a alta/edición y conserva título de evaluación y estudiante existente |
| `e2e/cypress/e2e/assessment-context.cy.ts` | Nuevo spec de doce casos con sesiones y API simuladas |
| `docs/ai-dlc/misional/BOLT-MIS-004/prompt-03-implementacion-m01.md` | Copia íntegra del prompt adjunto recibido |
| `docs/ai-dlc/misional/BOLT-MIS-004/evidencias-m01.md` | Este registro |

El componente nuevo evita duplicar tres bloques de contexto. No cambia el contrato ni descarga catálogos para enriquecer cada fila. El panel/formulario son compartidos con Enseñanza-aprendizaje, pero los cambios se limitan a la presentación de evaluaciones/notas: tareas, entregas, vencimientos, filtros previos y navegación permanecen con su lógica anterior. No se modificaron `CourseLearning`, `ScoreHistory`, `SubmissionForm`, `shared.tsx`, backend, permisos, roles, migraciones, datos, Matrículas u otros macroprocesos.

## Relación de cambios con criterios de aceptación

| Criterio de M-01 | Implementación |
| --- | --- |
| Identificar evaluación y contexto antes de registrar | Conserva título de evaluación y añade curso, periodo, máximo y fecha en tarjeta, consulta de notas y formulario. El estudiante queda identificado por el selector autorizado al crear y por su nombre al editar |
| Datos ausentes sin invenciones | Usa «Periodo no disponible», «Escala no disponible», «Fecha no disponible» o «Curso no disponible», sin asignar datos artificiales al bloque de contexto |
| Explicar restricciones conocidas | Distingue CLOSED, evaluación no PUBLISHED, `grading_open=false` y habilitación no disponible. No infiere estado completo del periodo, calendario o permisos de publicación desde el rol |
| Preservar capacidades y reglas | Los botones conservan `abilities.create/update` y la comprobación previa de evaluación PUBLISHED/periodo habilitado. Mensajes explican condiciones, sin otorgar autorización ni añadir nuevas restricciones |
| Mantener registro/edición y errores | No cambia función de guardado, payload, escala, límites HTML, motivo, estudiante o endpoint. El formulario ya retenía su estado al capturar errores; se conserva y se prueba, no se presenta como una capacidad inventada desde cero |
| Accesibilidad y móvil | Bloque semántico `dl/dt/dd` etiquetado «Contexto de evaluación», campos con etiquetas existentes, mensajes de orientación con `role=status` en consulta y disposición adaptable a móvil |
| No implementar M-02/M-03 | No cambia la recuperación del historial ni visibilidad/publicación/cierre; no agrega nombres de actor, expedientes, estados o fórmulas |

La fecha `evaluation_date` es una fecha de calendario. Se interpreta a medianoche local para presentarla sin retroceder un día por conversión UTC; no se altera la fecha guardada ni las reglas de intervalo del periodo. La escala recibida se muestra como máximo; no se calculan promedios ni ponderaciones.

## Antes y después

- Antes: tarjeta con título/estado/descripción y curso; notas con aviso genérico; formulario de nota sin resumen de periodo/fecha/escala.
- Después: los datos disponibles acompañan cada evaluación y el alta/edición seleccionados. El bloque distingue dos evaluaciones de un curso y no mezcla periodos. La orientación explica por qué una evaluación o periodo no admite registro, cuando esos datos están disponibles.
- Ante 403/422, se mantiene evaluación, estudiante seleccionado, nota y observaciones; se presenta el rechazo del servidor y no se comunica éxito. Un reintento válido conserva el flujo existente.
- No cambian ruta, payload, permisos, condiciones de visibilidad ni operaciones. Los mensajes no garantizan que el servidor acepte la nota: pueden haber cambiado curso, matrícula o permisos.

## Pruebas nuevas y cobertura

Los doce casos de `assessment-context.cy.ts` prueban exclusivamente UI/peticiones con API simulada, sin persistir roles o calificaciones:

1. Dos evaluaciones distinguibles, curso, periodo, máximo y fecha; sin consultas adicionales a catálogos.
2. Evaluación sin notas, contexto visible y registro disponible cuando las capacidades lo permiten.
3. Periodo/máximo/fecha ausentes, sin inventar datos ni habilitación.
4. DRAFT, orientación y ausencia de alta/edición de nota.
5. CLOSED, orientación y ausencia de alta/edición.
6. Periodo no habilitado, orientación específica y sin controles de escritura.
7. Alta con estudiante seleccionado y payload esperado; límites min=0, máximo propio y paso 0,01; móvil 390 × 844 sin desbordamiento horizontal.
8. Edición con estudiante identificado, motivo requerido y payload conservado.
9. Rechazo 403, conservación de campos, motivo comprensible y recuperación posterior.
10. Rechazo 422 con las mismas garantías de estado del formulario.
11. Curso denegado por respuesta 404: no solicita evaluaciones ni muestra contexto académico restringido.
12. Consulta autorizada sin capacidades de escritura: datos legibles sin habilitar alta/edición.

Estos tests no prueban la autorización de una sesión real contra Laravel ni escriben notas en MySQL. Los casos negativos comprueban cómo responde la UI a permisos/capacidades/respuestas de servidor simulados.

## Entorno y registro de ejecuciones

- Build, ESLint y TypeScript E2E se ejecutaron con las dependencias instaladas; no se instalaron paquetes.
- El primer intento Cypress terminó con código 1 antes de ejecutar casos porque `http://localhost:5173` no estaba disponible. Se inició Vite con `npm run dev -- --host localhost`, sin modificar configuración.
- Primera ejecución funcional conjunta: `assessment-context.cy.ts` tuvo 11 aprobadas y 1 fallida. El fallo fue de encadenamiento del test: `should('have.attr', 'required')` devolvía el atributo antes de `type()`. Se volvió a seleccionar el textarea para escribir, conservando la aserción de requerido y el payload esperado. No se cambió lógica de aplicación para superar esa prueba.
- En esa ejecución, las regresiones de BOLT-MIS-003 aprobaron 9 casos de acceso, 10 de vencimiento y 10 de filtros. Se registró globalmente 40 aprobadas y 1 fallida, código 1; no se oculta ese resultado inicial.
- Se repite únicamente el spec nuevo después de la corrección. Las reejecuciones no se contabilizan como casos nuevos.

### Resultados finales comprobados

| Verificación | Resultado real |
| --- | --- |
| `npm run build`, `frontend` | APROBADO, código 0: `tsc -b` y Vite, 100 módulos transformados |
| `npm run lint`, `frontend` | APROBADO, código 0, sin errores reportados |
| `npm run typecheck`, `e2e` | APROBADO, código 0, confirmado tras la corrección del spec |
| `assessment-context.cy.ts`, repetición focalizada final | 12 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas; código 0, 15 segundos |
| `virtual-access.cy.ts` — BOLT-MIS-003 M-01 | 9 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `submission-deadline.cy.ts` — BOLT-MIS-003 M-02 | 10 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `learning-filters.cy.ts` — BOLT-MIS-003 M-03 | 10 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `git diff --check` | APROBADO, sin errores detectados |

Comando conjunto ejecutado desde `e2e`: `npm test -- --spec cypress/e2e/assessment-context.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts,cypress/e2e/learning-filters.cy.ts`. Los tres specs de regresión conservaron sus aprobaciones sin cambios de aplicación posteriores que alteren sus flujos. Comando de repetición: `npm test -- --spec cypress/e2e/assessment-context.cy.ts`.

**Consolidado por último resultado de cada caso: 41 pruebas Cypress distintas aprobadas, 0 fallidas pendientes de resolver, 0 omitidas.** Son 12 nuevas y 29 de regresión, todas con API simulada. No se suman reejecuciones y se conserva arriba el resultado inicial de 40/41 con fallo de test resuelto. No se presenta el primer comando conjunto como una ejecución global aprobada.

Los 16 casos de backend/SPA real que se listan abajo son **NO EJECUTADOS**, no fallos ni skipped del runner. Build/lint/tipos/formato y preflight son controles separados, no se añaden al número de casos. Cypress usó Electron fuera del sandbox y mostró su aviso de deprecación, sin impedir los casos ejecutados.

## Verificaciones no ejecutadas y límites

- **Pest Sprint 7: NO EJECUTADO — 10 casos identificados.** Se intentó un preflight de solo lectura con entorno/destino forzados a `testing`/`zarate_test`/usuario `zarate_test`, sin config cacheada. La conexión falló con código 2002. No se verificó disponibilidad/aislamiento operativo, por lo que no se ejecutaron fixtures, seeders ni transacciones de pruebas. No se cambió configuración ni se inició/preparó MySQL.
- **Cypress real `learning.cy.ts` y `virtual.cy.ts`: NO EJECUTADOS — 3 casos cada uno.** La consulta de salud de Laravel en puerto 8000 respondió como conexión rechazada (`ECONNREFUSED`), y no se dispone de backend/base aislados acreditados. No se usaron datos de desarrollo para ejecutar alta, edición o autenticación reales.
- No se reejecutó la suite completa del proyecto. El alcance previsto tiene 41 casos Cypress simulados y 16 casos no ejecutados — 10 Pest y 6 Cypress reales —; no se cuentan otras suites como pendientes con cifras inventadas.
- La API de aprendizaje aporta curso id/nombre y periodo id/nombre/`grading_open`, pero no nombre de tipo, nombre de asignatura o estado completo del periodo en este recurso. No se añadieron llamadas o cambios de contrato; el encabezado existente del curso conserva el contexto que ya recibe por su endpoint.
- El bloque «escala no disponible» no reemplaza el fallback HTML anterior de `ScoreForm` ni agrega reglas. En datos reales, la escala de evaluación es obligatoria en el servidor; las fixtures incompletas solo comprueban presentación defensiva.
- Fecha no especificada no se rellena con hoy. Los mensajes sobre habilitación no sustituyen la validación de periodo CLOSED, curso, matrícula, perfil, permisos, duplicidad, precisión o máximo que conserva Laravel.
- La conservación de campos es en el formulario montado, no un borrador persistente. No se garantiza ante recarga, cancelación o expiración de sesión. No hay certificación integral WCAG ni prueba en todos los navegadores.

## Seguridad y decisiones institucionales

Se inspeccionaron `LearningResource`, `LearningPolicy`, `LearningService`, `ScoreService` y los contratos existentes. No se eliminó autorización, se agregó una lectura ni se modificó historial/auditoría. El contenido nuevo usa exclusivamente datos que devuelve la consulta autorizada; si el curso es rechazado, no se renderiza evaluación ni se solicitan sus datos.

El servidor sigue decidiendo definitivamente. M-01 no precisa una decisión institucional nueva para describir la información actual. M-03 — publicación independiente y conservación histórica — continúa **PENDIENTE DE CONFIRMACIÓN**; no se cambió visibilidad ni se interpretó una evaluación publicada como un lote completo de resultados aprobados.

## Control final y estado

Se comprobó mediante SHA-256 que el prompt guardado coincide íntegramente con el adjunto. Además de `git diff --check`, se revisaron espacios finales y marcadores de conflicto de los archivos nuevos todavía sin seguimiento. El estado Git se limita a los seis archivos enumerados, sin commits, push, merge ni Pull Requests.

**M-01: COMPLETADO dentro del alcance de interfaz aprobado.** Los doce casos nuevos y veintinueve de regresión aprobaron; compilación, lint y tipos aprobaron. No se afirma integración validada actualmente con Laravel/MySQL: las limitaciones de entorno y los casos no ejecutados quedan explícitos. No se implementaron M-02/M-03 de BOLT-MIS-004 ni se alteraron las reglas de Enseñanza-aprendizaje.
