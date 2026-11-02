# BOLT-MIS-006 — PROMPT 03B: Investigar fallo de teclado y completar validación M-01

Actúa como ingeniero senior de calidad de software especializado en React 19, TypeScript, Cypress y accesibilidad.

Repositorio: D:\zarate-saas

Rama: feature/comunicacion-institucional

Bolt: BOLT-MIS-006.

## OBJETIVO

Investigar y resolver, si corresponde, el fallo de activación mediante Enter en M-01 — Recuperación de consultas de comunicados.

No implementar M-02 ni M-03.

## ACTIVIDADES

1. Lee evidencias-m01.md y communication-queries.cy.ts.
2. Identifica el control exacto que falla y el mensaje de Cypress.
3. Revisa si el botón utiliza HTML nativo y tiene los atributos adecuados.
4. Comprueba que el control sea visible, esté habilitado y pueda recibir foco.
5. Determina si el fallo corresponde al componente, al test o a la herramienta de simulación.
6. Intenta una prueba reproducible utilizando la activación nativa de teclado.
7. Si existe un defecto real, aplica únicamente la corrección mínima.
8. Si el componente funciona y falla el mecanismo de simulación, corrige el test sin ocultar el fallo anterior.
9. Ejecuta la prueba de desbordamiento horizontal móvil pendiente.
10. Ejecuta Cypress focalizado, build, ESLint, TypeScript E2E y git diff --check.

No declares accesibilidad aprobada sin evidencia concluyente.

## DOCUMENTACIÓN

Guarda este prompt íntegro en:

docs/ai-dlc/misional/BOLT-MIS-006/prompt-03b-validacion-teclado.md

Actualiza evidencias-m01.md agregando una sección complementaria sin borrar resultados anteriores.

Documenta pruebas aprobadas, fallidas y no ejecutadas, y clasifica el estado final de M-01.

## RESTRICCIONES

- No cambiar backend, permisos ni contratos API.
- No cambiar el diseño general.
- No instalar dependencias.
- No modificar otros módulos.
- No hacer commits, push, merge ni PR.
- No inventar resultados.

## RESULTADO

Indica si M-01 queda COMPLETADA o PARCIAL, con la causa del fallo de Enter, resultado móvil, archivos modificados y pruebas ejecutadas.
