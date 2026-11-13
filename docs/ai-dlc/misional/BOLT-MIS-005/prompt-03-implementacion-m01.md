# BOLT-MIS-005 — PROMPT 03: Implementación M-01 — Protección de borradores de asistencia

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, Cypress, Pest, seguridad y calidad de software.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/asistencia-seguimiento

Macroproceso: Misional.

Bolt: BOLT-MIS-005.

Proceso: PM-04 — Asistencia y seguimiento académico.

Procedimiento principal: PM-04.1 — Registrar asistencia de estudiantes.

Ya completamos la auditoría y planificación de BOLT-MIS-005.

## DOCUMENTACIÓN OBLIGATORIA

Antes de modificar código, lee íntegramente:

- docs/ai-dlc/misional/BOLT-MIS-005/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-005/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-005/prompt-02-validacion.md

Implementa EXCLUSIVAMENTE la mejora M-01 definida en plan-mejoras.md.

No implementes M-02 ni M-03.

## OBJETIVO

Proteger las marcaciones de asistencia que un docente todavía no ha guardado, evitando pérdidas accidentales durante cambios de sesión de asistencia, navegación, recargas o solicitudes de guardado.

No modificar las reglas de asistencia existentes en el servidor.

## FASE 1 — VERIFICACIÓN

1. Confirma la rama feature/asistencia-seguimiento y ejecuta git status.
2. Identifica los componentes React que registran asistencia.
3. Localiza el estado que almacena las marcaciones pendientes.
4. Comprueba cómo se seleccionan curso, fecha, sección y sesión de asistencia.
5. Analiza cómo se cargan y actualizan los registros.
6. Identifica qué ocurre si el docente cambia el contexto antes de guardar.
7. Verifica cómo se manejan errores HTTP, guardados parciales y conflictos.
8. Revisa las validaciones y permisos existentes.
9. Comprueba qué mecanismos de protección contra cambios no guardados existen.
10. Contrasta todo con los criterios de aceptación exactos de M-01 en plan-mejoras.md.

No asumas que el problema afecta a todos los flujos sin comprobarlo.

## FASE 2 — IMPLEMENTACIÓN M-01

Implementa la solución mínima y segura para:

1. Identificar cuándo existen marcaciones de asistencia modificadas y pendientes de guardar.
2. Distinguir claramente los registros guardados de los cambios locales.
3. Advertir antes de abandonar un contexto que contiene modificaciones sin guardar.
4. Evitar que un cambio accidental de curso, fecha o sesión descarte silenciosamente las marcaciones.
5. Permitir al docente decidir si conserva el contexto actual o descarta expresamente los cambios, cuando corresponda.
6. Mostrar un estado de guardado comprensible.
7. Evitar acciones incompatibles mientras una solicitud de guardado está pendiente.
8. Conservar los cambios locales cuando ocurra un error recuperable del servidor.
9. Recuperar el estado correcto después de guardar exitosamente.
10. Evitar que una respuesta HTTP antigua sobrescriba datos de otra sesión de asistencia.
11. Mantener la navegación y los controles accesibles mediante teclado.
12. Conservar el comportamiento responsivo existente.

Si el plan identifica una protección específica frente a recargas, implementa únicamente la alternativa justificada y compatible con la arquitectura actual.

Para cerrar o recargar la página se puede evaluar un aviso nativo de cambios sin guardar. No afirmes que un aviso garantiza recuperar los datos tras una recarga.

No guardes información académica identificable en localStorage, sessionStorage, IndexedDB u otro almacenamiento persistente sin una justificación de seguridad y un requisito aprobado.

No implementes guardado automático en el servidor ni nuevas APIs.

## FASE 3 — PROTECCIÓN DE REGLAS

Conserva:

- Los estados de asistencia existentes.
- Las validaciones de fechas y estudiantes.
- Las reglas de matrícula.
- Los permisos docentes.
- El aislamiento institucional.
- La prevención de duplicados.
- La auditoría existente.
- Las reglas de justificación.
- Los datos previamente registrados.

El servidor continúa siendo la autoridad definitiva para aceptar o rechazar asistencia.

## FASE 4 — PRUEBAS

Agrega pruebas Cypress focalizadas para comprobar:

1. Registro sin modificaciones pendientes.
2. Marcaciones modificadas sin guardar.
3. Cambio de contexto con borrador pendiente.
4. Cancelación del cambio de contexto.
5. Descarte explícito de modificaciones.
6. Guardado exitoso.
7. Error HTTP conservando el borrador.
8. Solicitudes simultáneas o respuestas fuera de orden.
9. Prevención de pérdida silenciosa al navegar.
10. Protección de permisos y ausencia de regresiones.
11. Comportamiento de teclado y controles accesibles.
12. Comportamiento en pantalla móvil.

Incluye una comprobación específica del mecanismo seleccionado para recarga. Documenta sus límites.

Ejecuta las verificaciones disponibles:

- Build del frontend.
- ESLint.
- TypeScript E2E.
- Cypress focalizado.
- Regresión pertinente.
- git diff --check.

Ejecuta Pest únicamente si corresponde y siempre sobre una base aislada.

Diferencia pruebas con API simulada y pruebas con backend real. Registra resultados exactos.

## FASE 5 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-005/prompt-03-implementacion-m01.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m01.md

Documenta:

- Problema original.
- Evidencias técnicas.
- Solución implementada.
- Archivos modificados.
- Comportamiento anterior y nuevo.
- Procedimiento y RF relacionados.
- Pruebas ejecutadas y resultados reales.
- Casos no ejecutados.
- Limitaciones de protección del borrador.
- Riesgos pendientes.

## RESTRICCIONES

- No implementar M-02 ni M-03.
- No modificar módulos de Matrículas, Enseñanza-aprendizaje ni Evaluación académica.
- No modificar macroprocesos estratégico o de apoyo.
- No cambiar roles ni permisos.
- No alterar reglas de asistencia del backend.
- No agregar tablas, migraciones o endpoints.
- No instalar dependencias.
- No exponer información de estudiantes en logs.
- No realizar commits, push, merge ni Pull Requests.
- No inventar resultados de pruebas.

## RESULTADO ESPERADO

Entrega:

1. Resumen de M-01.
2. Archivos modificados y justificación.
3. Protección implementada para cambios pendientes.
4. Pruebas aprobadas, fallidas y no ejecutadas.
5. Riesgos y limitaciones.
6. Estado final: COMPLETADO, PARCIAL o BLOQUEADO.

Si algún criterio requiere cambiar reglas institucionales o almacenar datos sensibles, documenta la limitación sin implementar ese cambio.