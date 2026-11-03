# Índice de Bolts — Macroproceso estratégico

Base de trabajo: rama `feature/macro-estrategico`, commit `0d98612`.

| ID | PE | Estado | RF |
|---|---|---|---|
| BOLT-EST-001 | PE-01.1 | Auditorías y ficha documental provisional completadas; proceso institucional pendiente de validación. Sin cambios de código ni pruebas ejecutadas. | Sin RF directo identificado; automatización no aprobada. |
| BOLT-EST-002 | PE-01.2 | Auditoría y revisión condicionada de mejora completadas; sin aprobación para implementar. No se modificó código ni se ejecutaron pruebas. | RF-23 es relacionado; sin RF de seguimiento estratégico identificado. |
| BOLT-EST-003 | PE-02.1 | Prompts 08–09: auditoría completada; mejora condicionada no aprobada. Calendario oficial pendiente. Sin cambios de código ni pruebas ejecutadas. | Sin RF directo identificado para calendario. |
| BOLT-EST-004 | PE-02.2 | Prompts 10–11: auditoría completada; mejora condicionada no aprobada. Definición de “área” y aula física pendiente. Sin cambios de código ni pruebas ejecutadas. | Sin RF directo identificado. |
| BOLT-EST-005 | PE-03.1 | Prompts 12–13: auditoría completada; mejora condicionada no aprobada. Reportes/dashboards operativos; KPIs/metas institucionales y decisión de evaluación pendientes. Sin cambios de código ni pruebas ejecutadas. | RF-23 relacionado con reportes, no con evaluación estratégica completa. |
| BOLT-EST-006 | PE-03.2 | Prompts 14–17: auditoría, validación y registro de entrega. Mejora estratégica no autorizada; Pest pasó 130/130 y 62/62, Cypress smoke 4/4 y E2E funcional 16/16 tras corregir una carrera de sesión/logout. `auth.cy.ts` conserva un fallo de fixture/aserción del nombre docente. Sin commit ni PR. | Sin RF / requerir aprobación. |

Los detalles del plan están en [plan-ai-dlc.md](plan-ai-dlc.md); la evidencia de BOLT-EST-001 está en [su registro](BOLT-EST-001/evidencias.md), y la ficha provisional PE-01.1 en [procedimiento-pe-01-1.md](BOLT-EST-001/procedimiento-pe-01-1.md). La auditoría y evidencias de PE-01.2 están en [BOLT-EST-002](BOLT-EST-002/evidencias.md), la de PE-02.1 en [BOLT-EST-003](BOLT-EST-003/evidencias.md), la de PE-02.2 en [BOLT-EST-004](BOLT-EST-004/evidencias.md), la de PE-03.1 en [BOLT-EST-005](BOLT-EST-005/evidencias.md), y la de PE-03.2/Prompt 16 en [BOLT-EST-006](BOLT-EST-006/evidencias.md). El [registro de entrega y checklist PR](registro-entrega.md) consolida los Bolts y los límites de la evidencia; [Prompt 17](17-prompt-registro-entrega.md) conserva la plantilla fuente. La Matriz de registro.xlsx no está presente en esta copia del repositorio, así que todavía no se atribuye ningún número de fila ni relación con una matriz institucional.
