# BOLT-MIS-004 — PROMPT 05: Validación integral y cierre técnico de evaluación académica

Actúa como ingeniero senior de calidad de software, especializado en Laravel 13, React 19, TypeScript, Pest, Cypress, seguridad y accesibilidad.

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/evaluacion-academica

Macroproceso: Misional.

Bolt: BOLT-MIS-004.

## OBJETIVO

Validar las mejoras M-01 y M-02 de evaluación académica, revisar las limitaciones pendientes y preparar las evidencias de cierre AI-DLC.

M-03 permanecerá PENDIENTE DE CONFIRMACIÓN INSTITUCIONAL. No implementarla.

## FASE 1 — REVISIÓN

Lee:

- docs/ai-dlc/misional/BOLT-MIS-004/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-004/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-004/evidencias-m01.md
- docs/ai-dlc/misional/BOLT-MIS-004/evidencias-m02.md

Verifica la rama y el estado de Git.

Compara feature/evaluacion-academica con feature/macro-misional.

Identifica todos los commits y archivos cambiados.

Comprueba que no se hayan modificado reglas de calificaciones, permisos, publicación, cierre o datos.

## FASE 2 — ACCESIBILIDAD PENDIENTE

Revisa específicamente los dos intentos fallidos de comprobación mediante Enter documentados en evidencias-m02.md.

Determina:

1. Qué control se intentó activar.
2. Qué herramienta y procedimiento se utilizaron.
3. Si el problema fue del entorno de prueba, del test o del componente.
4. Si existe evidencia suficiente de un defecto real.
5. Qué prueba reproducible permitiría comprobar el comportamiento.

Si la comprobación puede realizarse de manera segura sin modificar código funcional, ejecútala.

Si encuentras un defecto, documenta la corrección recomendada, pero no modifiques componentes sin revisión.

No declares accesibilidad por teclado aprobada sin una prueba concluyente.

## FASE 3 — PRUEBAS

Verifica:

- Build del frontend.
- ESLint.
- TypeScript E2E.
- Cypress de assessment-context.cy.ts.
- Cypress de score-history.cy.ts.
- Regresión de las mejoras M-01 y M-02.
- Pruebas Pest relacionadas con evaluaciones, notas y autorización, solo en un entorno aislado.

Antes de utilizar MySQL o Laravel, comprueba que las pruebas no puedan afectar la base zarate_dev ni datos institucionales.

No crees usuarios demo ni modifiques bases existentes únicamente para forzar las pruebas.

Distingue los resultados con API simulada de los obtenidos con backend real.

Registra resultados exactos, incluyendo pruebas fallidas, no ejecutadas y limitaciones.

## FASE 4 — TRAZABILIDAD

Documenta PM-03.1, PM-03.2, PM-03.3 y PM-03.4.

Para cada procedimiento indica:

- Requerimientos funcionales relacionados.
- Funcionalidad existente.
- Mejora implementada, si corresponde.
- Evidencia técnica.
- Pruebas ejecutadas.
- Limitaciones.

Aclara expresamente que PM-03.3 conserva el comportamiento actual y que una publicación independiente de resultados requiere confirmación institucional.

No confundas historial de cambios de una nota con expediente académico longitudinal.

## FASE 5 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-004/prompt-05-validacion-final.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-004/cierre-bolt.md

Incluye:

1. Objetivos del Bolt.
2. Procedimientos cubiertos.
3. Resultados de M-01.
4. Resultados de M-02.
5. Situación pendiente de M-03.
6. Commits reales.
7. Trazabilidad con RF.
8. Pruebas aprobadas, fallidas y no ejecutadas.
9. Verificación de accesibilidad mediante teclado.
10. Riesgos y limitaciones.
11. Recomendación para Pull Request.

## RESTRICCIONES

- No modificar frontend ni backend.
- No cambiar permisos, escalas, notas o publicación.
- No modificar migraciones o datos.
- No afectar Matrículas o Enseñanza-aprendizaje.
- No instalar dependencias.
- No realizar commits, push, merge ni Pull Requests.
- No inventar pruebas ni aprobaciones.
- No alterar evidencias anteriores.

## RESULTADO ESPERADO

Entrega un reporte final con el estado de BOLT-MIS-004:

- LISTO.
- LISTO CON LIMITACIONES.
- BLOQUEADO.

Justifica la clasificación con evidencia verificable.

Si existen pruebas fallidas o defectos sin resolver, descríbelos claramente y no declares la validación integral completada.
