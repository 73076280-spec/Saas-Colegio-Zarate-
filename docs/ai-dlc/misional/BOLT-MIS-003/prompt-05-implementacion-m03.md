# BOLT-MIS-003 — PROMPT 05: Implementación M-03 — Filtros docentes por estado

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, Cypress, Pest y calidad de software.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Ruta: D:\zarate-saas

Rama: feature/ensenanza-aprendizaje

Bolt: BOLT-MIS-003.

Macroproceso: Misional.

Procedimientos: PM-02.2, PM-02.3 y PM-02.4.

Las mejoras M-01 y M-02 ya fueron desarrolladas. Tu tarea consiste exclusivamente en implementar M-03 del plan aprobado.

## REVISIÓN PREVIA

Lee estos documentos:

- docs/ai-dlc/misional/BOLT-MIS-003/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-003/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m01.md
- docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m02.md

Revisa también:

- frontend/src/learning/LearningPanel.tsx
- frontend/src/learning/shared.tsx
- backend/app/Http/Requests/LearningRequest.php
- backend/app/Http/Controllers/Api/LearningController.php
- e2e/cypress/e2e/learning.cy.ts

Verifica el estado de Git antes de modificar archivos. Si hay cambios pendientes ajenos a esta tarea, consérvalos y explica su origen.

## OBJETIVO

Mejorar la organización de las actividades y la revisión de entregas mediante filtros por estado, aprovechando los parámetros existentes de la API.

No crear nuevos endpoints, controladores ni tablas.

## IMPLEMENTACIÓN

1. Incorporar filtros accesibles en el listado de actividades para personal autorizado.
2. Permitir seleccionar Todos, DRAFT, PUBLISHED y CLOSED, utilizando etiquetas legibles en español.
3. Incorporar filtros de entregas en el contexto docente correspondiente: Todos, SUBMITTED, LATE, REVIEWED y RETURNED.
4. Utilizar el parámetro status de la API existente cuando el filtro esté activo.
5. Al cambiar de filtro, regresar a la primera página y evitar mostrar detalles obsoletos.
6. Conservar paginación y ordenamiento definidos por el servidor.
7. Mostrar mensajes claros cuando no existan registros.
8. Mantener indicadores de carga y mensajes de error.
9. Evitar que una respuesta HTTP anterior sobrescriba un resultado de una búsqueda más reciente.
10. Mantener las acciones de revisión condicionadas por permisos y estados reales del servidor.
11. Incorporar etiquetas accesibles y comprobar el funcionamiento en pantallas móviles.
12. No incorporar estos filtros administrativos a la vista personal de entregas del estudiante.

No realizar filtrado únicamente sobre los elementos de la página descargada.

No utilizar los filtros para determinar si un estudiante tiene derecho a realizar otro intento.

## PRUEBAS

Implementa pruebas Cypress focalizadas que verifiquen:

- Filtro de tareas por DRAFT, PUBLISHED y CLOSED.
- Filtro de entregas por SUBMITTED, LATE, REVIEWED y RETURNED.
- Envío correcto del parámetro status.
- Reinicio de la paginación al cambiar el filtro.
- Mensaje de resultado vacío y recuperación con Todos.
- Protección ante respuestas HTTP fuera de orden.
- Conservación de las capacidades de revisión docente.
- Ausencia de controles administrativos para estudiantes.
- Regresión de M-01 y M-02.

Ejecuta build, ESLint, TypeScript E2E y Cypress focalizado.

Ejecuta pruebas Pest focalizadas si corresponde verificar el contrato de filtrado del backend. No inventes pruebas aprobadas.

## DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-003/prompt-05-implementacion-m03.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m03.md

Documenta problemas, cambios, archivos afectados, criterios de aceptación, pruebas ejecutadas y resultados reales.

## RESTRICCIONES

- No modificar migraciones ni bases de datos.
- No cambiar roles ni permisos.
- No modificar la API si ya soporta los filtros requeridos.
- No alterar M-01 ni M-02 sin una regresión comprobada.
- No modificar el Centro de Matrículas.
- No modificar macroprocesos estratégico o de apoyo.
- No instalar dependencias nuevas.
- No hacer commits, push, merge o Pull Requests.

## RESULTADO ESPERADO

Implementa M-03 con cambios mínimos, documenta los resultados y comunica si la mejora está COMPLETADA, PARCIAL o BLOQUEADA.

Indica exactamente qué pruebas pasaron y cuáles no fueron ejecutadas.
