# Prompt 09 — Decisión de mejora condicionada PE-02.1

## Registro de ejecución

- Fecha: 2026-11-02, 13:33 (hora local UTC-05:00).
- Rama/base: `feature/macro-estrategico`, commit `0d98612`.
- Herramienta: Copilot en VS Code; modelo/versión exactos no disponibles en la sesión.
- Responsable humano: integrante asignado; nombre institucional pendiente.
- Solicitud recibida: continuar hasta Prompt 11.
- Resultado: condición previa para cambiar software no satisfecha. No se halló aprobación para una mejora ni una brecha de software confirmada dentro del calendario institucional.
- Sin cambios de código, pruebas ejecutadas, commit ni push.

## Plantilla fuente aplicada

> Si el diagnóstico muestra una brecha comprobada en PE-02.1 y el cambio está aprobado, realiza una sola mejora de validación o usabilidad del calendario. Mantén los contratos de API y el historial; no abras periodos cerrados automáticamente, no alteres fechas de datos existentes y no ejecutes seeders destructivos. Antes del cambio especifica aceptación y tests Pest/Cypress; después implementa, ejecuta pruebas, muestra resultados reales, diff, riesgos residuales y rutas modificadas.

## Decisión

Prompt 08 encontró reglas funcionales implementadas y cubiertas por pruebas para años y periodos. El punto no resuelto es la definición y aprobación del calendario institucional oficial, no una falla técnica confirmada. La instrucción exige que la brecha esté comprobada **y** que el cambio esté aprobado; ambas condiciones no se cumplen con la evidencia disponible.

Por tanto, no se propone ni implementa una mejora de validación o usabilidad, no se escriben pruebas de producto como si existiera una aceptación aprobada y no se modifica contrato, historial o datos. La auditoría permanece documentada en [PE-02.1](auditoria-pe-02-1.md); la decisión no altera su clasificación.

## Entrada necesaria para reabrir

El dueño institucional debe aportar el calendario aprobado, el actor que lo aprueba y la regla concreta que difiere del comportamiento existente. Si después de ese contraste se confirma una brecha de software, se registra aprobación y criterio de aceptación antes de implementar una única mejora, con casos Pest/Cypress que usen datos de prueba aislados.
