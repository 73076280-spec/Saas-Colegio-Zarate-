# BOLT-MIS-003 — PROMPT 04: Implementación M-02 — Restricciones de entrega por vencimiento

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, pruebas Cypress, experiencia de usuario y arquitectura SaaS.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Ruta local: D:\zarate-saas

Rama obligatoria: feature/ensenanza-aprendizaje

Macroproceso: Misional.

Bolt: BOLT-MIS-003.

Procedimiento: PM-02.4 — Recibir y revisar tareas.

Requerimientos relacionados: RF-12, RF-10 y RF-22, según la trazabilidad existente.

La mejora M-01 ya fue implementada, probada y publicada mediante el commit 7b459cf.

Ahora debes implementar exclusivamente M-02.

## DOCUMENTACIÓN OBLIGATORIA

Antes de modificar código, revisa:

- docs/ai-dlc/misional/BOLT-MIS-003/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-003/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m01.md

Analiza también:

- frontend/src/learning/LearningPanel.tsx
- frontend/src/learning/SubmissionForm.tsx
- frontend/src/learning/shared.tsx
- backend/app/Services/Learning/LearningAccess.php
- backend/app/Services/Learning/SubmissionService.php
- e2e/cypress/e2e/learning.cy.ts

## OBJETIVO

Mejorar la experiencia de los estudiantes al entregar actividades académicas, mostrando claramente las fechas límite y las restricciones de entrega, sin modificar las reglas de negocio o autorización existentes.

## FASE 1 — VERIFICACIÓN

1. Confirma la rama Git y revisa el estado del repositorio.
2. Comprueba cómo se reciben due_at y allow_late_submission.
3. Identifica cómo se habilita actualmente el botón Entregar tarea.
4. Revisa cómo se manejan devoluciones y nuevos intentos.
5. Verifica las reglas temporales reales del backend.
6. Comprueba el manejo de zona horaria y la comparación de fechas.
7. Revisa las pruebas existentes antes de modificarlas.

No asumas que todos los problemas descritos en el diagnóstico siguen presentes sin comprobarlo.

## FASE 2 — IMPLEMENTACIÓN

Realiza únicamente los cambios mínimos necesarios para:

1. Mostrar al estudiante la fecha y hora límite de entrega en su contexto correspondiente.
2. Indicar claramente si la entrega está vigente, vencida o admite entregas tardías.
3. Impedir desde la interfaz que se inicie una nueva entrega claramente vencida cuando no se permiten entregas tardías.
4. Mantener habilitada la entrega tardía cuando esté autorizada por el servidor.
5. Respetar siempre abilities.submit y las demás capacidades recibidas del backend.
6. Actualizar el estado temporal si la fecha límite se alcanza mientras la pantalla permanece abierta.
7. Evitar la pérdida silenciosa de texto escrito si el servidor rechaza el envío.
8. Mantener visibles los intentos anteriores, la retroalimentación y el historial.

Respeta la regla temporal real del backend. No cambies una comparación estricta de now > due_at por now >= due_at.

El reloj del navegador solamente orienta la interfaz. La validación definitiva corresponde al servidor.

No dupliques lógica de autorización.

## FASE 3 — PRUEBAS

Añade o ajusta pruebas Cypress focalizadas para comprobar:

- Tarea vigente y entrega permitida.
- Tarea vencida sin entregas tardías.
- Tarea vencida con entregas tardías permitidas.
- Actividad que vence mientras la vista permanece abierta.
- Nuevo intento después de una devolución.
- Conservación del historial y feedback.
- Mensajes comprensibles ante rechazo del servidor.
- Ausencia de acceso para usuarios no autorizados.

Utiliza fechas controladas cuando sea necesario y evita pruebas dependientes del reloj real.

Ejecuta las verificaciones disponibles:

- Build del frontend.
- ESLint.
- TypeScript de E2E.
- Cypress focalizado y regresión relevante.
- git diff --check.

Ejecuta Pest focalizado si resulta necesario comprobar una regla del backend; si no se ejecuta, registra NO EJECUTADO.

No inventes resultados.

## FASE 4 — DOCUMENTACIÓN AI-DLC

Guarda este prompt completo en:

docs/ai-dlc/misional/BOLT-MIS-003/prompt-04-implementacion-m02.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m02.md

Documenta:

- Problema detectado.
- Justificación de la solución.
- Procedimiento y RF relacionados.
- Archivos realmente modificados.
- Comportamiento antes y después.
- Pruebas ejecutadas y resultados exactos.
- Casos no verificados.
- Riesgos pendientes.

## RESTRICCIONES

- No modificar reglas de autorización del backend.
- No alterar migraciones ni tablas.
- No cambiar roles y permisos.
- No modificar M-01 salvo corrección de una regresión demostrada y justificada.
- No implementar M-03.
- No modificar Centro de Matrículas.
- No modificar macroprocesos estratégico o de apoyo.
- No instalar dependencias nuevas.
- No cambiar reglas de cierre o revisión de tareas.
- No realizar commits, push, merge ni Pull Requests.

## RESULTADO ESPERADO

Entrega un resumen de M-02 con:

1. Cambios implementados.
2. Archivos afectados.
3. Pruebas ejecutadas y resultados.
4. Riesgos o limitaciones.
5. Estado final: COMPLETADO, PARCIAL o BLOQUEADO.

No afirmes que la mejora funciona sin pruebas suficientes.