# PE-01.2 — Decisión de mejora condicionada

**Resultado:** no se implementa una mejora en esta etapa. No se verificó aprobación funcional para cambiar reportes/dashboards ni hay una definición institucional de indicadores estratégicos. La instrucción del Prompt 07 condiciona cualquier implementación a esa aprobación; definir un KPI sin fuente verificable exige detenerse.

## Evaluación de cambio mínimo

La revisión del código y las pruebas citadas en [auditoria-pe-01-2.md](auditoria-pe-01-2.md) no identificó un defecto concreto de filtro, etiqueta o validación que justifique cambiar la conducta del sistema. Inventar un cambio de interfaz o una nueva métrica solo para producir una implementación sería contrario al alcance y podría alterar resultados usados por los usuarios. Por tanto, no se propone modificar contratos, endpoints, filtros, etiquetas o exportaciones.

## Fórmulas y datos nulos observables

Las fórmulas indicadas son comportamientos operativos actuales, no fórmulas de indicadores estratégicos aprobadas.

| Métrica existente | Fórmula/caso sin datos | Tratamiento observable |
|---|---|---|
| Ocupación de sección | Ocupados = matrículas aprobadas; disponibles = máximo entre cero y capacidad menos ocupados. | Capacidad `null` se presenta como “Sin límite”; el sistema no calcula porcentaje de ocupación para capacidad nula. |
| Entregas por tarea | Esperados = roster activo con matrícula aprobada; faltantes = estudiantes esperados sin entrega; entregaron = esperados menos faltantes. | La consulta calcula conteos desde roster y entregas; no hay meta de entrega definida. |
| Asistencia del resumen familiar | (registros `PRESENT` + `LATE`) / total de registros × 100, redondeado a un decimal. | Con cero registros se muestra “Sin registros”, no un porcentaje cero. |
| Monto pendiente de Tesorería | Suma de `amount` para pagos `PENDING` o `OVERDUE`. | El resultado se convierte a número y se formatea con dos decimales; no representa una meta financiera. |
| Relación/nombre ausente en filas | Los nombres se obtienen de la relación del usuario. | Un usuario ausente se muestra como “Cuenta no disponible”; otros campos opcionales pueden aparecer vacíos en CSV. |

Referencias: `backend/app/Services/Reports/ReportService.php`, `OfficeDashboard.php`, `TreasuryDashboard.php`, `StudentSummary.php` y `ReportController.php`. Estos casos se verificaron en lectura de código; no se añadieron pruebas ni se ejecutó la suite.

## Protección por institución y acceso

- Las rutas de negocio pasan por sesión autenticada y middleware `institution`, que deriva el contexto del usuario activo.
- Los modelos de dominio consultados mantienen el alcance institucional mediante scopes/contexto; `institution_id` no es una selección de reporte admitida.
- `ReportRequest` prohíbe `institution_id` y valida IDs de filtros con modelos scoped.
- `ReportPolicy` limita cada reporte por rol y permiso; el servicio restringe cursos de docentes y el resumen familiar verifica estudiantes vinculados.
- Las pruebas de Sprint 10 contienen escenarios de aislamiento y restricciones por rol, pero esta auditoría solo revisó esos casos; no los ejecutó.

Referencias: `backend/app/Http/Middleware/ResolveInstitution.php`, `ReportRequest.php`, `ReportPolicy.php`, `ReportService.php`, `DashboardService.php`, `backend/tests/Feature/Sprint10Test.php` y `e2e/cypress/e2e/reports.cy.ts`.

## Información necesaria para retomar una mejora

El dueño de PE-01.2 debe aprobar y proporcionar:

1. Indicador y objetivo al que responde.
2. Fuente de datos verificable, definición y fórmula, incluidos numerador, denominador y tratamiento de datos faltantes.
3. Valor base, meta, umbral y periodo de medición.
4. Responsable de revisión, roles autorizados y decisión esperada.
5. Filtros necesarios y confirmación de que un reporte existente no cubre ya el caso.
6. RF/ticket, criterios de aceptación y autorización explícita para implementar.

Hasta obtener esa definición, el resultado es **DETENER IMPLEMENTACIÓN Y SOLICITAR DEFINICIÓN FUNCIONAL**. No se crean KPIs, tablas, endpoints, permisos ni reportes.
