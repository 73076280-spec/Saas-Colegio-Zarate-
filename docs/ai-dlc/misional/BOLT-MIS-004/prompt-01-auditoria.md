# BOLT-MIS-004 — PROMPT 01: Auditoría de evaluación académica

Actúa como arquitecto de software senior, analista de procesos educativos y especialista en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress y calidad de software.

## CONTEXTO

Proyecto: Implementación de una plataforma SaaS para mejorar la gestión académica del Colegio Zárate de Huancayo, 2026.

Sistema: EcoAula SaaS.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/evaluacion-academica

Macroproceso: Misional.

Bolt: BOLT-MIS-004.

Ya se integraron BOLT-MIS-002 y BOLT-MIS-003 en feature/macro-misional.

## PROCEDIMIENTOS

PM-03.1 — Configurar evaluaciones.

PM-03.2 — Registrar calificaciones.

PM-03.3 — Publicar resultados.

PM-03.4 — Consultar historial académico.

## OBJETIVO

Realizar una auditoría funcional y técnica de los procedimientos de evaluación académica, identificando cuáles ya están implementados, qué pruebas existen y qué brechas necesitan atención.

No comenzar el desarrollo desde cero.

## ACTIVIDADES

1. Verifica la rama Git actual y el estado del repositorio.
2. Lee la documentación de los Sprints 1 al 10, los 24 requerimientos funcionales y los documentos de trazabilidad.
3. Identifica los módulos de evaluaciones, notas, boletines, periodos académicos, publicación de resultados e historial académico.
4. Analiza los modelos, servicios, controladores, políticas, rutas API y componentes React existentes.
5. Identifica qué roles pueden crear evaluaciones, registrar notas, publicar resultados y consultar historiales.
6. Verifica el aislamiento institucional, las relaciones entre estudiantes y cursos y las restricciones por periodo.
7. Revisa las validaciones de calificaciones y estados de publicación.
8. Identifica cómo se mantiene la trazabilidad y auditoría de cambios de notas.
9. Examina cómo los estudiantes y apoderados consultan sus resultados, si esa funcionalidad existe.
10. Comprueba si las vistas de evaluación están integradas correctamente con el Aula Virtual.
11. Identifica las pruebas Pest y Cypress relacionadas y su cobertura.
12. Detecta posibles problemas de autorización, consistencia de datos, usabilidad y accesibilidad.

## MATRIZ DE DIAGNÓSTICO

Para cada procedimiento PM-03.1 a PM-03.4, documenta:

- Objetivo y actores.
- Entradas, actividades y salidas.
- Requerimientos funcionales relacionados.
- Archivos frontend y backend.
- Endpoints existentes.
- Permisos necesarios.
- Estado: IMPLEMENTADO, PARCIAL, PENDIENTE o NO VERIFICADO.
- Evidencias técnicas encontradas.
- Brechas y riesgos.
- Pruebas existentes.
- Mejoras recomendadas.

Diferencia claramente el funcionamiento comprobado mediante código del funcionamiento comprobado mediante pruebas ejecutadas.

## PROPUESTA INICIAL

Identifica oportunidades de mejora, priorizando:

- Configuración segura de evaluaciones.
- Registro y validación de calificaciones.
- Control de publicación de resultados.
- Protección de datos académicos.
- Consulta del historial académico.
- Trazabilidad de modificaciones.
- Accesibilidad y usabilidad.
- Pruebas automatizadas.

No inventes requisitos nuevos ni propongas funciones que ya estén implementadas correctamente.

## DOCUMENTACIÓN AI-DLC

Guarda este prompt íntegro en:

docs/ai-dlc/misional/BOLT-MIS-004/prompt-01-auditoria.md

Crea también:

docs/ai-dlc/misional/BOLT-MIS-004/diagnostico.md

El diagnóstico debe contener hallazgos verificables, referencias a rutas reales de código y recomendaciones justificadas.

## RESTRICCIONES

- No modificar código funcional.
- No modificar bases de datos ni migraciones.
- No cambiar roles o permisos.
- No alterar Matrículas o Enseñanza-aprendizaje.
- No modificar los macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No ejecutar pruebas que puedan alterar datos sin verificar previamente un entorno aislado.
- No realizar commits, push, merge ni Pull Requests.
- No inventar resultados de pruebas.

En esta fase únicamente se permite crear la documentación de BOLT-MIS-004.

## RESULTADO ESPERADO

Entrega:

1. Diagnóstico de los cuatro procedimientos.
2. Matriz de trazabilidad.
3. Funcionalidades existentes.
4. Brechas técnicas y funcionales reales.
5. Pruebas identificadas.
6. Recomendaciones priorizadas.

No implementes mejoras todavía.
