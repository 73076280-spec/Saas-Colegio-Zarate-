# BOLT-MIS-005 — PROMPT 02: Validación de brechas y planificación de mejoras de asistencia

Actúa como arquitecto de software senior, analista de procesos educativos y especialista en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress, seguridad y calidad de software.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio local: D:\zarate-saas

Rama obligatoria: feature/asistencia-seguimiento

Macroproceso: Misional.

Bolt: BOLT-MIS-005.

Proceso: PM-04 — Asistencia y seguimiento.

## DOCUMENTACIÓN OBLIGATORIA

Lee completamente:

- docs/ai-dlc/misional/BOLT-MIS-005/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-005/prompt-01-auditoria.md
- Los requerimientos funcionales y documentos de trazabilidad pertinentes.
- Los documentos de arquitectura y Sprints relacionados con asistencia.

Contrasta cada hallazgo con el código real. No asumas que una recomendación de la auditoría demuestra por sí misma un defecto.

## PROCEDIMIENTOS

PM-04.1 — Registrar asistencia de estudiantes.

PM-04.2 — Justificar inasistencias.

PM-04.3 — Consultar indicadores de asistencia y seguimiento.

Conserva los códigos y denominaciones existentes en la documentación si encuentras diferencias.

## OBJETIVO

Identificar brechas funcionales reales y seleccionar hasta tres mejoras justificadas para BOLT-MIS-005.

En esta etapa no debes modificar el código funcional.

## ACTIVIDAD 1 — Protección del registro de asistencia

Verifica:

1. Cómo registra asistencia un docente.
2. Si existe un borrador temporal de marcaciones antes de guardar.
3. Qué ocurre al cambiar de curso, fecha o sección.
4. Si los datos escritos pueden perderse durante una recarga o error.
5. Cómo se manejan conflictos y errores HTTP.
6. Si existen avisos de cambios sin guardar.
7. Qué controles impiden asistencia duplicada.
8. Qué comportamiento corresponde al frontend y cuál al backend.

Determina si hay pérdida de datos demostrable mediante análisis del código.

No propongas guardar automáticamente datos académicos en el servidor sin un requisito aprobado.

## ACTIVIDAD 2 — Justificaciones

Verifica:

- Flujo de justificación existente.
- Permisos de solicitud, aprobación o rechazo.
- Estados y reglas de negocio.
- Observaciones y evidencias disponibles.
- Validación de registros asociados.
- Trazabilidad de modificaciones.
- Manejo de errores.
- Comportamiento cuando una solicitud no puede completarse.

No agregues nuevos estados, adjuntos ni actores que no existan en el sistema.

## ACTIVIDAD 3 — Indicadores y consultas

Analiza:

1. Indicadores existentes de asistencia.
2. Consultas por estudiante, curso, sección y fecha.
3. Filtros y paginación disponibles.
4. Diferencia entre registros de asistencia e indicadores agregados.
5. Manejo de estados de carga, vacío y error.
6. Recuperación mediante reintento.
7. Conservación del contexto de consulta.
8. Protección de información académica.
9. Accesibilidad y comportamiento móvil.

Si el diagnóstico menciona un filtro por periodo académico, comprueba si ese filtro está respaldado por los requisitos actuales o necesita una decisión institucional.

## ACTIVIDAD 4 — Seguridad y pruebas

Identifica los permisos reales para docentes, administración, estudiantes y apoderados.

Comprueba si el backend valida institución, curso, matrícula y registros relacionados.

Revisa las pruebas Pest y Cypress existentes y determina:

- Qué casos están cubiertos.
- Qué funcionalidades tienen pruebas no ejecutadas.
- Qué riesgos no tienen pruebas.
- Qué casos requieren pruebas nuevas.

No declares pruebas aprobadas solamente porque los archivos de prueba existen.

No ejecutes pruebas que modifiquen bases de datos sin confirmar un entorno de pruebas aislado.

## ACTIVIDAD 5 — Selección de mejoras

Selecciona como máximo tres mejoras, priorizando problemas comprobados.

Para cada mejora documenta:

- Código M-01, M-02 o M-03.
- Procedimiento PM-04 relacionado.
- RF existente relacionado.
- Problema demostrado.
- Evidencia técnica y archivos específicos.
- Impacto para docentes y estudiantes.
- Solución mínima.
- Archivos previstos.
- Criterios de aceptación.
- Pruebas necesarias.
- Riesgos y limitaciones.
- Prioridad.
- Necesidad de aprobación institucional, si corresponde.

Evita duplicar módulos de asistencia o cambiar reglas académicas que ya funcionan correctamente.

## DOCUMENTACIÓN AI-DLC

Guarda este prompt completo en:

docs/ai-dlc/misional/BOLT-MIS-005/prompt-02-validacion.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-005/plan-mejoras.md

El plan debe incluir el diagnóstico actualizado, las brechas confirmadas, las mejoras seleccionadas, sus criterios de aceptación y el orden de implementación recomendado.

## RESTRICCIONES

- No modificar frontend ni backend.
- No alterar datos ni migraciones.
- No crear nuevos endpoints.
- No cambiar roles o permisos.
- No modificar Matrículas, Enseñanza-aprendizaje o Evaluación académica.
- No intervenir en macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No realizar commits, push, merge ni Pull Requests.
- No inventar resultados de pruebas.

En esta etapa solo puedes crear los dos documentos indicados dentro de BOLT-MIS-005.

## RESULTADO ESPERADO

Presenta:

1. Estado actualizado de PM-04.1, PM-04.2 y PM-04.3.
2. Brechas reales comprobadas mediante código.
3. Hasta tres mejoras priorizadas.
4. Archivos que se necesitaría modificar.
5. Pruebas necesarias.
6. Recomendación de qué mejora implementar primero.

No programes las mejoras todavía.