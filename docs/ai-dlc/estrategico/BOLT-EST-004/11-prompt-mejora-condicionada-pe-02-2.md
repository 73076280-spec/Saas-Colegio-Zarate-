# Prompt 11 — Mejora condicionada PE-02.2

## Registro de ejecución

- Fecha: 2026-11-02, 13:33 (hora local UTC-05:00).
- Rama/base: `feature/macro-estrategico`, commit `0d98612`.
- Herramienta: Copilot en VS Code; modelo/versión exactos no disponibles en la sesión.
- Responsable humano: integrante asignado; nombre institucional pendiente.
- Solicitud recibida: continuar hasta Prompt 11.
- Resultado: condición de entrada no satisfecha; no se encontró brecha aprobada ni aprobación para modificar un catálogo o pantalla.
- Sin cambios de código, pruebas ejecutadas, commit ni push.

## Plantilla fuente aplicada

> Si existe una brecha aprobada en PE-02.2, mejora una validación o pantalla del catálogo existente sin romper claves foráneas ni registros vinculados. Incluye análisis de impacto a matrícula, cursos y asignación docente, estrategia reversible, pruebas positivas/negativas, permisos y accesibilidad. No borres catálogos con referencias; usa comportamiento permitido por el proyecto. Entrega commit propuesto y evidencia reproducible.

## Decisión condicionada

La auditoría de Prompt 10 confirma controles existentes para relaciones, unicidad, permisos, aislamiento y conservación de referencias. La falta de definición de “área” y de un catálogo de aulas físicas es una incertidumbre institucional que requiere confirmar el proceso; no constituye por sí misma una brecha aprobada en un catálogo existente. No se especificó aprobación de cambio.

La condición explícita de Prompt 11 no se cumple. Por ello no implemento una validación/pantalla, no cambio claves foráneas ni conducta de desactivación, no preparo un commit propuesto como si hubiera cambio y no reporto evidencia de ejecución inexistente.

## Salvaguardas para una propuesta futura

Si el responsable confirma una brecha concreta y la aprueba, antes de cambiar código se debe:

1. Definir criterio verificable y actor autorizado, sin mapear automáticamente área→asignatura ni aula física→aula virtual.
2. Trazar impacto a `enrollments`, `teacher_assignments` y `courses`; preservar FKs restrictivas, historial y tenant scope.
3. Seleccionar una mejora en el catálogo actual, justificar una migración reversible si fuera necesaria, y cubrir casos positivos/negativos, permisos, aislamiento y accesibilidad.
4. Validar flujos de matrícula y docencia con pruebas Pest/Cypress focalizadas sobre datos de prueba aislados.

La decisión y el pendiente institucional se resumen en [decision-mejora-pe-02-2.md](decision-mejora-pe-02-2.md).
