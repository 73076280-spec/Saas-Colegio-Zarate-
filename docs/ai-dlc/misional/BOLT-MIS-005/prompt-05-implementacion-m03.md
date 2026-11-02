# BOLT-MIS-005 — PROMPT 05: Implementación M-03 — Consultas personales y familiares de asistencia

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, Cypress, Pest, experiencia de usuario y seguridad de aplicaciones SaaS.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/asistencia-seguimiento

Macroproceso: Misional.

Bolt: BOLT-MIS-005.

Procedimiento principal: PM-04.3 — Consultar indicadores de asistencia y seguimiento.

Las mejoras anteriores son:

- M-01: Protección local de borradores de asistencia, PARCIAL por la navegación SPA.
- M-02: Recuperación de consultas de justificaciones, implementada en el frontend.

Implementa exclusivamente M-03 según el plan aprobado.

## DOCUMENTACIÓN OBLIGATORIA

Lee íntegramente:

- docs/ai-dlc/misional/BOLT-MIS-005/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-005/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m01.md
- docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m02.md

Contrasta el alcance exacto de M-03 con el código antes de programar.

No supongas que todos los hallazgos son defectos confirmados.

## OBJETIVO

Mejorar la experiencia de estudiantes y apoderados al consultar la información de asistencia que actualmente tienen autorizada.

La mejora debe facilitar la interpretación del contexto de consulta, la recuperación ante errores y la identificación de resultados vacíos, sin ampliar la información académica expuesta.

## FASE 1 — VERIFICACIÓN

1. Confirma la rama Git y revisa git status.
2. Localiza los componentes React utilizados para consultar asistencia personal y familiar.
3. Identifica los endpoints existentes y sus contratos.
4. Comprueba cómo se determina el estudiante consultado.
5. Verifica los permisos y relaciones entre estudiantes y apoderados.
6. Analiza los filtros, fechas, paginación y estados de consulta disponibles.
7. Comprueba cómo se manejan errores HTTP.
8. Verifica qué ocurre al cambiar de estudiante, página o contexto.
9. Identifica riesgos de reutilización de datos anteriores.
10. Contrasta cada hallazgo con los criterios de aceptación exactos de M-03 en plan-mejoras.md.

## FASE 2 — IMPLEMENTACIÓN

Implementa únicamente las mejoras justificadas para:

1. Mostrar claramente el contexto de asistencia consultado.
2. Identificar al estudiante seleccionado cuando la API ya proporcione esa información autorizada.
3. Mostrar estados de carga comprensibles.
4. Mostrar mensajes claros ante errores de consulta.
5. Permitir reintentar operaciones GET fallidas.
6. Conservar los filtros y el contexto apropiados durante un reintento.
7. Evitar mostrar resultados de un estudiante anterior al cambiar de contexto.
8. Proteger contra respuestas HTTP fuera de orden.
9. Mostrar estados vacíos cuando no existan registros.
10. Mantener la paginación y los filtros existentes.
11. Conservar las restricciones de acceso actuales para estudiantes y apoderados.
12. Mantener controles accesibles mediante teclado y compatibles con dispositivos móviles.

No inventes porcentajes, promedios, indicadores o estadísticas que no proporcione el sistema.

No agregues un filtro por periodo académico si el plan señala que requiere confirmación institucional.

No almacenes datos personales en localStorage, sessionStorage u otro almacenamiento persistente.

## FASE 3 — SEGURIDAD

Conserva:

- Autorizaciones y permisos existentes.
- Aislamiento institucional.
- Relaciones familiares autorizadas.
- Reglas de matrícula.
- Estados de asistencia.
- Reglas de justificaciones.
- Auditoría y validaciones del backend.

No introduzcas endpoints, permisos o relaciones nuevas.

Nunca utilices un identificador recibido del navegador para omitir las verificaciones del servidor.

## FASE 4 — PRUEBAS

Agrega pruebas Cypress focalizadas para:

- Consulta personal correcta.
- Consulta familiar autorizada.
- Cambio de estudiante.
- Estado de carga.
- Respuesta vacía.
- Error HTTP y reintento.
- Conservación de contexto.
- Respuesta HTTP tardía.
- Acceso no autorizado.
- Ausencia de datos anteriores al cambiar de estudiante.
- Navegación móvil y controles accesibles.
- Regresión de M-01 y M-02.

Ejecuta:

- Build del frontend.
- ESLint.
- TypeScript E2E.
- Cypress focalizado y regresión pertinente.
- git diff --check.

Pest únicamente debe ejecutarse con una base de datos aislada y segura.

Distingue las pruebas simuladas de las pruebas con backend real.

Registra exactamente pruebas aprobadas, fallidas y no ejecutadas.

## FASE 5 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-005/prompt-05-implementacion-m03.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m03.md

Documenta:

1. Problema original.
2. Procedimiento y RF relacionados.
3. Archivos modificados.
4. Solución implementada.
5. Comportamiento anterior y nuevo.
6. Criterios de aceptación.
7. Pruebas ejecutadas.
8. Resultados exactos.
9. Casos pendientes.
10. Riesgos residuales.

## RESTRICCIONES

- No modificar M-01 ni M-02 salvo regresión demostrada.
- No modificar backend ni migraciones.
- No cambiar permisos ni roles.
- No agregar nuevas estadísticas.
- No modificar Matrículas, Enseñanza-aprendizaje ni Evaluación académica.
- No intervenir en macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No realizar commits, push, merge ni Pull Requests.
- No inventar pruebas aprobadas.

## RESULTADO ESPERADO

Presenta:

- Estado final de M-03: COMPLETADA, PARCIAL o BLOQUEADA.
- Archivos afectados.
- Funcionalidades implementadas.
- Pruebas ejecutadas y resultados exactos.
- Limitaciones de integración.
- Riesgos pendientes.

No declares validado el backend si únicamente ejecutaste pruebas con API simulada.