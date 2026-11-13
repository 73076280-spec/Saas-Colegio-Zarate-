# BOLT-MIS-003 — PROMPT 06: Validación integral y cierre técnico

Actúa como ingeniero senior de calidad de software, especialista en Laravel 13, React 19, TypeScript, Pest, Cypress y metodología AI-DLC.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama: feature/ensenanza-aprendizaje

Macroproceso: Misional.

Bolt: BOLT-MIS-003.

Procedimientos: PM-02.1, PM-02.2, PM-02.3 y PM-02.4.

Se implementaron tres mejoras:

- M-01: Coherencia de navegación y permisos del Aula Virtual.
- M-02: Restricciones visuales para tareas vencidas.
- M-03: Filtros docentes de actividades y entregas por estado.

## OBJETIVO

Verificar integralmente las tres mejoras, comprobar que no generan regresiones y preparar la evidencia técnica de cierre para la matriz AI-DLC.

No desarrollar funcionalidades adicionales.

## FASE 1 — AUDITORÍA DE CAMBIOS

1. Confirma la rama actual y revisa git status.
2. Compara la rama actual con feature/macro-misional.
3. Identifica todos los archivos modificados por BOLT-MIS-003.
4. Comprueba que no existan modificaciones accidentales en Centro de Matrículas, macroproceso estratégico o de apoyo.
5. Revisa la coherencia entre los documentos de diagnóstico, plan de mejoras, prompts y evidencias.
6. Comprueba que los prompts estén íntegros y que las afirmaciones sobre pruebas coincidan con los registros.
7. Identifica posibles vulnerabilidades, regresiones o inconsistencias introducidas por M-01, M-02 y M-03.

## FASE 2 — PRUEBAS AUTOMATIZADAS

Ejecuta, cuando el entorno lo permita:

- Build del frontend.
- ESLint.
- TypeScript del proyecto E2E.
- Cypress focalizado de M-01, M-02 y M-03.
- Pruebas Cypress de regresión del Aula Virtual y aprendizaje.
- Pruebas Pest focalizadas de enseñanza-aprendizaje y permisos.

IMPORTANTE: antes de ejecutar pruebas contra bases de datos reales, verifica que se utilice un entorno de pruebas aislado. No ejecutes migraciones destructivas, seeders o pruebas que escriban sobre datos institucionales o de desarrollo que deban conservarse.

Si la base de datos de pruebas no está disponible, registra las pruebas como NO EJECUTADAS y explica el motivo. No cambies la configuración de producción.

Diferencia pruebas con API simulada de pruebas con backend real.

## FASE 3 — VERIFICACIÓN DE CRITERIOS

Comprueba:

M-01:

- Visibilidad correcta según permisos.
- Acceso a tareas sin depender de materiales.
- Consulta de notas propias autorizadas.
- Ausencia de ampliación de privilegios.

M-02:

- Tareas vigentes y vencidas.
- Entregas tardías permitidas y prohibidas.
- Actualización al cruzar la fecha límite.
- Conservación de texto y feedback.
- Validación definitiva del servidor.

M-03:

- Filtros de actividades y entregas.
- Parámetros status correctos.
- Paginación y estados vacíos.
- Respuestas HTTP fuera de orden.
- Ausencia de controles administrativos para estudiantes.

Verifica también accesibilidad básica y comportamiento responsivo dentro del alcance existente.

## FASE 4 — TRAZABILIDAD

Relaciona cada procedimiento PM-02.1 a PM-02.4 con:

- Requerimientos funcionales existentes.
- Funcionalidades implementadas.
- Mejoras realizadas.
- Archivos modificados.
- Pruebas ejecutadas.
- Evidencia disponible.

Para PM-02.1, conserva explícitamente la diferencia entre asignatura y área académica como asunto institucional NO VERIFICADO. No declares que se resolvió mediante una modificación inexistente.

## FASE 5 — DOCUMENTACIÓN AI-DLC

Guarda este prompt íntegro en:

docs/ai-dlc/misional/BOLT-MIS-003/prompt-06-validacion-final.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-003/cierre-bolt.md

Incluye:

1. Objetivo del Bolt.
2. Procedimientos cubiertos.
3. Resumen de M-01, M-02 y M-03.
4. Tabla de trazabilidad.
5. Commits reales obtenidos de Git.
6. Pruebas ejecutadas y resultados exactos.
7. Pruebas pendientes y limitaciones.
8. Riesgos residuales.
9. Archivos de evidencia.
10. Recomendación sobre si está listo para Pull Request.

No inventes métricas, ejecución de pruebas ni aprobaciones del profesor.

## RESTRICCIONES

- No modificar lógica de frontend o backend, salvo que encuentres un defecto crítico; en tal caso, documenta el hallazgo y solicita revisión antes de corregirlo.
- No modificar migraciones ni datos.
- No cambiar roles ni permisos.
- No implementar funcionalidades nuevas.
- No instalar dependencias.
- No realizar commits, push, merge ni Pull Requests.
- No eliminar ni reescribir evidencias anteriores.

## RESULTADO ESPERADO

Entrega un reporte final indicando:

- Estado de M-01, M-02 y M-03.
- Cantidad exacta de pruebas aprobadas, fallidas y no ejecutadas.
- Cobertura funcional comprobada y limitaciones.
- Archivos modificados.
- Estado de preparación para Pull Request: LISTO, LISTO CON LIMITACIONES o BLOQUEADO.

Si hay pruebas fallidas, no declares el Bolt completado.
