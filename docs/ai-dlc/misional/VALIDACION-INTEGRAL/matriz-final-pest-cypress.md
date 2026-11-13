# Matriz final Pest y Cypress — Prompt 47

Estado de la matriz: **EN CURSO; sin aprobación global de suite**.

| Cohorte | Acreditación inicial | Pendientes iniciales | Regresión final |
| --- | --- | --- | --- |
| Pest | 276/314; 1.724 aserciones | 38 | No completada todavía |
| Cypress E2E real | 17/46 | 29 | No completada todavía |
| Cypress con API simulada | 141 históricos | Separados del E2E real | No se suman al objetivo 46 |

El inventario de los 67 pendientes, con identificador, archivo, dataset, módulo, operaciones, dependencias, fixtures y motivo histórico está en `.tools/qa-final47/evidence/inventory67.json`. Sus resultados se consolidarán sin duplicar los casos previos; las repeticiones de la regresión final se distinguirán de nuevas acreditaciones.

La infraestructura nueva admite operaciones antes restringidas solo sobre `qa47pest` y `qa47e2e` en 3310, con TLS y cuentas limitadas. No se atribuye este permiso a las instancias anteriores. Véase [evidencias-cierre-total-pruebas.md](evidencias-cierre-total-pruebas.md).

## Acumulado posterior a los 38 Pest pendientes

Los 38 casos restantes aprobaron con 333 aserciones nuevas. Acumulado Pest: **314 casos distintos y 2.057 aserciones**. Falta la regresión final controlada; no se clasifica todavía la campaña como validación total completada. Los resultados nuevos están en `evidence/pest/run-05/result.json`, con referencias a los JUnit y checkpoints individuales previos conservados.

La campaña de 29 E2E pendientes está en ejecución secuencial. Su resultado final y la matriz por identificador se consolidarán desde evidencia verificada; no se anticipan aprobaciones ni se suman las repeticiones de regresión como casos distintos.


## Recuperación comprobada — campaña detenida por suspensión

| Cohorte | Aprobados distintos | Pendientes | Regresión final |
|---|---:|---:|---|
| Pest | 314/314; 2.057 aserciones acumuladas | 0 de la cohorte inicial | Pendiente: 314 |
| Cypress E2E real | 25/46 (17 históricos + 8 nuevos) | 21 | Pendiente: 46 |
| Cypress API simulada | 141 históricos conservados | No reevaluados | No ejecutada en esta recuperación |

E2E nuevos acreditados y restaurados: CY39-012, CY39-014, CY39-026, CY39-027, CY39-028, CY39-017, CY39-018, CY39-019.

Último aprobado: **CY39-019**. Interrumpido y primero a recuperar: **CY39-020**, sin resultado definitivo ni restauración posterior acreditada. Restantes: CY39-020, CY39-021, CY39-022, CY39-043, CY39-044, CY39-007, CY39-032, CY39-033, CY39-034, CY39-002, CY39-003, CY39-004, CY39-035, CY39-036, CY39-037, CY39-038, CY39-039, CY39-040, CY39-041, CY39-045, CY39-046.

Dos suspensiones nuevas respecto de la referencia original impiden continuar este lote. Infraestructura detenida, sin servicios iniciados en la recuperación. TLS/baseline posteriores a CY39-020 pendientes de validación en vivo. No se acredita cierre al 100 % ni regresión conjunta. Detalle y limitaciones en [evidencias-cierre-total-pruebas.md](evidencias-cierre-total-pruebas.md), anexo de recuperación. Evidencia privada: `evidence/recovery-internet-01/audit.json` y `environment-readonly.json`.


## Continuación final 12/11/2026 — clasificación D

Sin nuevas ejecuciones: **314/314 Pest, 2.057 aserciones; 25/46 E2E, 21 pendientes**. Ambas regresiones finales siguen pendientes. Se inspeccionaron las dos bases descartables con 52 tablas y 14 migraciones antes de una nueva suspensión a las 10:55:25; el supervisor cerró MySQL controladamente. No se restauró el estado ni se inició Cypress. Primer caso pendiente: **CY39-020**. Clasificación **D: BLOQUEADO POR SEGURIDAD O INFRAESTRUCTURA**. Evidencia: `evidence/e2e/recovery-02/consolidation.json`; detalle en el anexo del 12/11/2026 de las evidencias.


## Control de estabilidad previo — 12/11/2026

Sin nuevas pruebas ni referencia temporal: **314/314 Pest, 2.057 aserciones; 25/46 E2E; 21 pendientes desde CY39-020**. Ambas regresiones finales pendientes. Windows mantiene suspensión por inactividad de 10 minutos en corriente y batería, suspensión al cerrar tapa y solicitudes de energía vacías. No se inició MySQL ni Cypress. Clasificación D preventiva; resolver primero las condiciones de energía. Véanse diagnóstico e integración futura en el nuevo anexo de evidencias y `evidence/stability-03/`.


## Preflight de reanudación definitiva — 12/11/2026 13:01

AC STANDBYIDLE sigue en 600 segundos; no aprueba la condición explícita de suspensión deshabilitada. Sin nuevas ejecuciones: 314/314 Pest, 2.057 aserciones, 25/46 E2E, 21 pendientes y ambas regresiones pendientes. Clasificación D. Evidencia privada: evidence/stability-04/preflight.json.


## Avance de regresión final tras recuperación de comunicación

Pest:314/314 de regresiónAPROBADOS,2.057 aserciones,0fallidos/omitidos; JUnit ybaselineverificados. E2E:46/46 individuales conservados, regresión46EN CURSO en run-90. Las reejecuciones no incrementan los totales distintos.


## Matriz de cierre — cohortes distintas y regresiones acreditadas

Estado A para la revisión 1a043035c126a5bc3e5ed14cf43fdd49a4e171bf. Totales distintos: **314 Pest / 46 E2E**. Las regresiones reejecutan los mismos casos y no se suman como nuevos. Pest individual: 2.057 aserciones; regresión final: 2057.

| Archivo Pest | Casos de regresión aprobados | Aserciones |
|---|---:|---:|
| AvatarTest.php | 3 | 29 |
| HealthTest.php | 4 | 6 |
| MySqlConnectionTest.php | 2 | 10 |
| Sprint10Test.php | 5 | 137 |
| Sprint1Test.php | 62 | 223 |
| Sprint2Test.php | 84 | 437 |
| Sprint3Test.php | 79 | 421 |
| Sprint4Test.php | 21 | 198 |
| Sprint5Test.php | 12 | 140 |
| Sprint6Test.php | 12 | 134 |
| Sprint7Test.php | 10 | 100 |
| Sprint8Test.php | 10 | 100 |
| Sprint9Test.php | 10 | 122 |

| Caso E2E | Fuente | Regresión final | Restauración |
|---|---|---|---|
| CY39-001 | academic.cy.ts | Aprobada | Verificada |
| CY39-002 | academic.cy.ts | Aprobada | Verificada |
| CY39-003 | academic.cy.ts | Aprobada | Verificada |
| CY39-004 | academic.cy.ts | Aprobada | Verificada |
| CY39-005 | attendance.cy.ts | Aprobada | Verificada |
| CY39-006 | attendance.cy.ts | Aprobada | Verificada |
| CY39-007 | attendance.cy.ts | Aprobada | Verificada |
| CY39-008 | auth.cy.ts | Aprobada | Verificada |
| CY39-009 | auth.cy.ts | Aprobada | Verificada |
| CY39-010 | auth.cy.ts | Aprobada | Verificada |
| CY39-011 | auth.cy.ts | Aprobada | Verificada |
| CY39-012 | auth.cy.ts | Aprobada | Verificada |
| CY39-013 | auth.cy.ts | Aprobada | Verificada |
| CY39-014 | auth.cy.ts | Aprobada | Verificada |
| CY39-015 | auth.cy.ts | Aprobada | Verificada |
| CY39-016 | auth.cy.ts | Aprobada | Verificada |
| CY39-017 | classroom.cy.ts | Aprobada | Verificada |
| CY39-018 | classroom.cy.ts | Aprobada | Verificada |
| CY39-019 | classroom.cy.ts | Aprobada | Verificada |
| CY39-020 | courses.cy.ts | Aprobada | Verificada |
| CY39-021 | courses.cy.ts | Aprobada | Verificada |
| CY39-022 | courses.cy.ts | Aprobada | Verificada |
| CY39-023 | enrollment-center.cy.ts | Aprobada | Verificada |
| CY39-024 | enrollment-center.cy.ts | Aprobada | Verificada |
| CY39-025 | enrollment-center.cy.ts | Aprobada | Verificada |
| CY39-026 | enrollment.cy.ts | Aprobada | Verificada |
| CY39-027 | enrollment.cy.ts | Aprobada | Verificada |
| CY39-028 | enrollment.cy.ts | Aprobada | Verificada |
| CY39-029 | learning.cy.ts | Aprobada | Verificada |
| CY39-030 | learning.cy.ts | Aprobada | Verificada |
| CY39-031 | learning.cy.ts | Aprobada | Verificada |
| CY39-032 | office.cy.ts | Aprobada | Verificada |
| CY39-033 | office.cy.ts | Aprobada | Verificada |
| CY39-034 | office.cy.ts | Aprobada | Verificada |
| CY39-035 | people.cy.ts | Aprobada | Verificada |
| CY39-036 | people.cy.ts | Aprobada | Verificada |
| CY39-037 | people.cy.ts | Aprobada | Verificada |
| CY39-038 | people.cy.ts | Aprobada | Verificada |
| CY39-039 | people.cy.ts | Aprobada | Verificada |
| CY39-040 | reports.cy.ts | Aprobada | Verificada |
| CY39-041 | reports.cy.ts | Aprobada | Verificada |
| CY39-042 | virtual.cy.ts | Aprobada | Verificada |
| CY39-043 | virtual.cy.ts | Aprobada | Verificada |
| CY39-044 | virtual.cy.ts | Aprobada | Verificada |
| CY39-045 | visual.cy.ts | Aprobada | Verificada |
| CY39-046 | visual.cy.ts | Aprobada | Verificada |

Identificadores completos, JUnit, hashes, snapshots y prueba HTTP/SQL en evidence/final-consolidation.json (privado). Pendientes de estas cohortes: 0. Siete cambios funcionales de otro worktree siguen fuera del alcance validado y requieren revisión antes de integrarse.


### Historial de intentos y control final

E2E de regresión:46casos únicos aprobados al cierre,47intentos reales (46positivos y1fallo previo de sincronización006 conservado y resuelto);0fallos sin resolver. Los28positivos de run-90 no se repitieron al continuar en run-91. Pestregresión:314positivos únicos y2.057aserciones,0fallidos/omitidos. Git diff --check aprobado; sin procesos privados activos ni suspensiones nuevas desde la referencia vigente. Sin operaciones de integración Git.
