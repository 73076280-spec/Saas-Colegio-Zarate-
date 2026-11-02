# BOLT-MIS-005 — PROMPT 01: Auditoría de asistencia y seguimiento académico

Actúa como arquitecto de software senior, analista de procesos educativos y especialista en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress, seguridad y calidad de software.

## CONTEXTO

Proyecto: Implementación de una plataforma SaaS para mejorar la gestión académica del Colegio Zárate de Huancayo, 2026.

Sistema: EcoAula SaaS.

Repositorio local: D:\zarate-saas

Rama obligatoria: feature/asistencia-seguimiento

Macroproceso: Misional.

Bolt: BOLT-MIS-005.

Los procesos PM-01, PM-02 y PM-03 ya fueron integrados en feature/macro-misional.

## PROCEDIMIENTOS

PM-04.1 — Registrar asistencia de estudiantes.

PM-04.2 — Justificar inasistencias.

PM-04.3 — Consultar indicadores de asistencia y seguimiento.

Verifica los nombres y alcances exactos de estos procedimientos contra la documentación existente del proyecto. Si hay diferencias, consérvalas explícitamente en el diagnóstico, sin inventar un cuarto procedimiento ni cambiar la documentación de otros Bolts.

## OBJETIVO

Realizar una auditoría funcional y técnica de los procesos de asistencia y seguimiento académico, identificando funcionalidades existentes, brechas reales, permisos, pruebas y oportunidades de mejora.

No comenzar el desarrollo desde cero.

## FASE 1 — VERIFICACIÓN DEL PROYECTO

1. Confirma la rama Git y el estado del repositorio.
2. Revisa los 24 requerimientos funcionales del proyecto.
3. Examina los documentos de trazabilidad, Sprints y arquitectura.
4. Identifica los modelos, migraciones, servicios, controladores, políticas y endpoints de asistencia.
5. Revisa los componentes React asociados.
6. Verifica la integración con cursos, docentes, estudiantes, matrículas, años académicos, grados y secciones.

## FASE 2 — REGISTRO DE ASISTENCIA

Determina:

- Qué actores pueden registrar y modificar asistencia.
- Cómo se seleccionan fecha, curso y estudiantes.
- Qué estados de asistencia existen.
- Cómo se evitan registros duplicados.
- Qué validaciones se aplican.
- Cómo se controla el acceso a estudiantes de otras secciones o instituciones.
- Qué sucede al modificar un registro.
- Cómo se auditan los cambios.
- Qué pruebas existentes cubren estas operaciones.

No inventes nuevos estados ni reglas institucionales.

## FASE 3 — JUSTIFICACIÓN DE INASISTENCIAS

Analiza:

- Si existe un flujo de justificaciones.
- Qué actores pueden solicitar, registrar o aprobar una justificación.
- Si se permiten observaciones o documentos adjuntos.
- Qué permisos y validaciones existen.
- Cómo se relaciona una justificación con el registro original.
- Qué historial de cambios se conserva.
- Qué ocurre cuando la funcionalidad no está implementada.

No incorpores aprobaciones, documentos o reglas nuevas sin respaldo en los requerimientos.

## FASE 4 — INDICADORES Y SEGUIMIENTO

Comprueba:

- Consulta de asistencia por estudiante.
- Consulta por curso, sección y periodo.
- Indicadores de asistencia y ausencias.
- Filtros y paginación.
- Acceso de docentes, administración, estudiantes y apoderados.
- Estados vacíos, errores y recuperación de consultas.
- Accesibilidad y diseño responsivo.
- Protección de datos académicos.

Diferencia indicadores ya implementados de estadísticas adicionales no exigidas por el proyecto.

## FASE 5 — MATRIZ DE DIAGNÓSTICO

Para cada procedimiento incluye:

1. Código y nombre.
2. Objetivo.
3. Actor principal.
4. Entradas, actividades y salidas.
5. Requerimientos funcionales relacionados.
6. Archivos backend y frontend.
7. Endpoints y permisos.
8. Funcionalidades existentes.
9. Estado: IMPLEMENTADO, PARCIAL, PENDIENTE o NO VERIFICADO.
10. Evidencias técnicas.
11. Pruebas existentes.
12. Brechas demostradas.
13. Riesgos y recomendaciones.

No confundas la existencia de pruebas con su ejecución satisfactoria.

## FASE 6 — PROPUESTA INICIAL

Identifica mejoras justificadas en:

- Usabilidad del registro de asistencia.
- Prevención de duplicados.
- Justificaciones y trazabilidad.
- Consulta de indicadores.
- Seguridad y permisos.
- Accesibilidad.
- Manejo de errores.
- Cobertura de pruebas automatizadas.

Prioriza correcciones de problemas reales antes que funcionalidades nuevas.

No propongas módulos duplicados.

## DOCUMENTACIÓN AI-DLC

Guarda este prompt íntegro en:

docs/ai-dlc/misional/BOLT-MIS-005/prompt-01-auditoria.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-005/diagnostico.md

El diagnóstico debe contener rutas reales de archivos, resultados verificables y una matriz de los procedimientos.

## RESTRICCIONES

- No modificar backend ni frontend.
- No crear migraciones o tablas.
- No cambiar roles o permisos.
- No modificar datos.
- No alterar Matrículas, Enseñanza-aprendizaje ni Evaluación académica.
- No intervenir en los macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No ejecutar pruebas que escriban datos sin verificar un entorno aislado.
- No hacer commits, push, merge ni Pull Requests.
- No inventar resultados ni evidencia.

En esta fase solamente se permite crear documentación dentro de BOLT-MIS-005.

## RESULTADO ESPERADO

Entrega un diagnóstico completo de PM-04.1, PM-04.2 y PM-04.3, las funcionalidades que ya existen, las brechas identificadas y las mejoras priorizadas.

No implementes cambios funcionales todavía.