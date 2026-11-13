# BOLT-MIS-005 — PROMPT 03B: Completar protección de borradores durante navegación SPA

Actúa como desarrollador senior especializado en React 19, TypeScript, React Router, Cypress y seguridad de aplicaciones SaaS.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Ruta: D:\zarate-saas

Rama: feature/asistencia-seguimiento

Bolt: BOLT-MIS-005.

Mejora: M-01 — Protección de borradores de asistencia.

La implementación anterior quedó PARCIAL porque protege cambios locales de asistencia, pero no toda la navegación interna SPA.

## OBJETIVO

Completar la protección frente a pérdida accidental de marcaciones de asistencia al navegar desde la pantalla de registro hacia otro módulo, curso o sección.

## REVISIÓN PREVIA

1. Lee el plan y las evidencias de M-01.
2. Examina AttendanceCourse.tsx, App.tsx y la navegación institucional.
3. Identifica el mecanismo de enrutamiento realmente utilizado.
4. Comprueba si existe una solución reutilizable para bloquear navegación.
5. Determina si la protección puede implementarse sin alterar el enrutador global.
6. Revisa los cambios locales existentes y consérvalos.

## IMPLEMENTACIÓN

Si existe un mecanismo compatible y seguro de bloqueo de navegación:

1. Detecta si existen marcaciones modificadas sin guardar.
2. Intercepta la navegación SPA cuando se abandona el contexto protegido.
3. Muestra una confirmación comprensible.
4. Si el docente cancela, permanece en la pantalla conservando los cambios.
5. Si confirma el descarte, permite navegar.
6. No bloquees cuando el formulario está limpio.
7. Evita múltiples confirmaciones por la misma navegación.
8. Conserva las protecciones existentes durante guardado y recarga.
9. No interrumpas solicitudes del servidor ni descartes cambios silenciosamente.
10. Mantén accesibilidad y funcionamiento móvil.

No alteres permisos, rutas institucionales o reglas de asistencia.

Si el enrutador no admite una solución compatible sin cambios arquitectónicos importantes, NO introduzcas una implementación frágil. Documenta el impedimento y conserva M-01 como PARCIAL.

## PRUEBAS

Agrega pruebas Cypress que comprueben:

- Navegación con borrador pendiente.
- Cancelación de navegación.
- Confirmación de descarte.
- Navegación sin cambios pendientes.
- Navegación mediante menú lateral.
- Conservación de datos al cancelar.
- Ausencia de regresiones en guardado y recarga.

Ejecuta build, ESLint, TypeScript E2E, Cypress focalizado y regresión pertinente.

No inventes resultados. Distingue API simulada de backend real.

## DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-005/prompt-03b-navegacion.md

Actualiza:

docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m01.md

Conserva los resultados originales y agrega una sección de validación complementaria, indicando pruebas nuevas y limitaciones.

## RESTRICCIONES

- No implementar M-02 ni M-03.
- No modificar backend ni migraciones.
- No cambiar roles ni permisos.
- No instalar dependencias nuevas.
- No modificar otros macroprocesos.
- No realizar commit, push o Pull Request.
- No reescribir ni ocultar pruebas fallidas.

## RESULTADO

Indica si M-01 queda COMPLETADA o PARCIAL.

Enumera archivos modificados, pruebas ejecutadas, resultados exactos y limitaciones pendientes.
