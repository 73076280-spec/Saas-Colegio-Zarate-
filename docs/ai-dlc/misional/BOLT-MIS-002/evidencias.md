# BOLT-MIS-002 — Centro de Matrículas

## Macroproceso
Misional

## Proceso
PM-01 — Admisión y matrícula

## Rama de desarrollo
feature/centro-matriculas

## Evidencia de pruebas

Registro histórico conservado del commit de implementación; estos resultados no implican una nueva ejecución durante la reconstrucción documental.

- Frontend: npm run build — APROBADO.
- Cypress enrollment-center.cy.ts — 3/3 aprobadas.
- Cypress enrollment.cy.ts — 3/3 aprobadas.
- TypeScript E2E: npm run typecheck — APROBADO.
- Git diff --check — Sin errores detectados.

## Resultado
Se verificaron escenarios de navegación, permisos,
matrícula, historial y cupos.

## Evidencias pendientes
- Prompts originales utilizados.
- Commit de implementación.
- Pull Request de integración.

## Actualización documental — 28/10/2026

- Commit de implementación: `6b3e216` — `feat(misional): implementar centro de matriculas y pruebas`.
- Rama: `feature/centro-matriculas`.
- Se conserva arriba el registro original, incluidos sus pendientes. El commit queda identificado en esta actualización; los prompts originales no se han recuperado. Los cuatro documentos añadidos son reconstrucciones retrospectivas, no transcripciones.
- No se crea Pull Request ni se realiza commit, push o merge en esta tarea documental.

### Resultados reales registrados

Resultados proporcionados para esta actualización y concordantes con el registro histórico de aprobaciones. No se adjuntan nuevos logs ni se vuelven a ejecutar build, Cypress o TypeScript durante esta revisión documental.

| Comprobación | Resultado registrado | Alcance |
| --- | --- | --- |
| `npm run build`, en `frontend` | Aprobado | `tsc -b` y compilación Vite |
| `enrollment-center.cy.ts` | 3 pruebas aprobadas, 0 fallidas | Navegación, indicadores, historial, cupos, permisos y continuidad del Aula Virtual en los escenarios del spec |
| `enrollment.cy.ts` | 3 pruebas aprobadas, 0 fallidas | Regresión del trámite de matrícula con corrección, pago, aprobación, consulta e historial; accesos de estudiante, apoderado y docente |
| `npm run typecheck`, en `e2e` | Aprobado | TypeScript de E2E mediante `tsc --noEmit` |
| `git diff --check` | Sin errores detectados | Revisión de espacios y conflictos del diff; no acredita pruebas funcionales |

### Respaldo revisado en el repositorio

Se comprobó la rama activa y la existencia del commit `6b3e216` como antecesor de HEAD. Se inspeccionaron `docs/matriculas-fase-2-1.md`, los componentes `EnrollmentDashboard`, `EnrollmentCapacity`, `EnrollmentLayout`, `EnrollmentNavigation`, `EnrollmentsPage`, las rutas de `App.tsx` y ambos specs Cypress. Cada spec contiene tres casos. La inspección confirma la cobertura definida, pero no sustituye sus resultados de ejecución.

En esta revisión documental se ejecutó nuevamente `git diff --check`, con salida exitosa y sin errores detectados; Git mostró un aviso de normalización CRLF/LF. Los cuatro prompts, todavía sin seguimiento, se revisaron adicionalmente para comprobar la nota inicial exacta y ausencia de espacios finales o marcadores de conflicto.

El dashboard consulta cuatro indicadores con `per_page=1` y `meta.total`, con filtro opcional por año. La lista y el formulario existentes se reutilizan; el historial se abre por detalle y la vista de historial oculta escrituras. Cupos utiliza los catálogos existentes y muestra disponibilidad informativa. Los permisos del centro y sus rutas preservan el acceso institucional y propio/vinculado previsto; la continuidad docente hacia `/virtual` está incluida en el spec del centro.

### Relación sustentada con PM-01 — Admisión y matrícula

No se encontró en la documentación revisada un catálogo numerado de procedimientos PM-01. Se relacionan actividades por su denominación funcional, sin asignar códigos nuevos.

| Actividad respaldada | Evidencia de implementación y cobertura |
| --- | --- |
| Registro y consulta de solicitudes de matrícula | `EnrollmentsPage.tsx`, rutas `/list` y `/new`; creación y consulta en `enrollment.cy.ts` |
| Seguimiento y validación administrativa de matrícula | Indicadores de `EnrollmentDashboard.tsx`, transiciones preexistentes y detalle con historial de `EnrollmentsPage.tsx`; regresión de observación, corrección y aprobación condicionada al pago |
| Consulta de historial de matrícula | Ruta `/history` con `historyOnly`, detalle e historial existente; ambos specs consultan historial |
| Consulta informativa de cupos por año, grado y sección | `EnrollmentCapacity.tsx`, endpoint `/api/v1/enrollment-options`; consulta en el spec del centro y ocupación en la regresión de matrícula |

La validación de pago es una dependencia preexistente ejercitada por la regresión. BOLT-MIS-002 organiza el acceso al trámite; no acredita un nuevo procedimiento de Tesorería, evaluación de postulantes, admisión automatizada o reserva de vacantes.

### Límites y aspectos no verificados

- `docs/matriculas-fase-2-1.md` conserva una descripción anterior con resultados pendientes y ejecución limitada al spec del centro. Esta actualización registra los resultados posteriores proporcionados para ambos specs sin reescribir aquella fuente histórica.
- No se acredita ejecución de la suite completa del proyecto, auditoría exhaustiva de aislamiento entre instituciones, todas las combinaciones de permisos, concurrencia o todas las transiciones posibles. El spec compara el indicador total con la API; no compara individualmente los cuatro indicadores.
- El formulario por pasos de fase 2.2 está fuera del alcance. No se verifican despliegue, integración mediante PR ni recuperación del historial original de conversaciones.

### Documentos retrospectivos

- [Prompt 01 — Análisis](prompt-01-analisis.md): auditoría previa, contratos, reutilización y delimitación de PM-01.
- [Prompt 02 — Implementación](prompt-02-implementacion.md): dashboard, rutas, navegación, historial y cupos.
- [Prompt 03 — Permisos](prompt-03-permisos.md): autorización por permisos y roles, alcance institucional y continuidad del Aula Virtual.
- [Prompt 04 — Pruebas](prompt-04-pruebas.md): compilación, TypeScript, Cypress, regresión y criterios de evidencia.
