# BOLT-MIS-005 — PROMPT 04: Implementación M-02 — Recuperación de consultas de justificaciones

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, Cypress, Pest, seguridad y calidad de software.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Ruta: D:\zarate-saas

Rama obligatoria: feature/asistencia-seguimiento

Macroproceso: Misional.

Bolt: BOLT-MIS-005.

Procedimiento: PM-04.2 — Justificar inasistencias.

La mejora M-01 se encuentra implementada parcialmente, con la limitación de navegación SPA documentada.

Implementa exclusivamente M-02.

## DOCUMENTACIÓN

Lee íntegramente:

- docs/ai-dlc/misional/BOLT-MIS-005/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-005/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m01.md

Verifica en el código los archivos y endpoints reales de justificaciones antes de hacer cambios.

## OBJETIVO

Mejorar la consulta de justificaciones de asistencia para que los usuarios autorizados puedan recuperar errores de red sin perder innecesariamente los filtros, la página seleccionada ni el contexto de consulta.

No alterar las reglas de creación, aprobación o rechazo de justificaciones.

## FASE 1 — VERIFICACIÓN

1. Comprueba la rama y el estado de Git.
2. Localiza el componente de consulta de justificaciones.
3. Identifica sus filtros, paginación y estados de carga.
4. Revisa los endpoints utilizados y los permisos existentes.
5. Verifica cómo responde ante errores 403, 404, 422 y 500.
6. Comprueba si conserva datos anteriores después de un error.
7. Determina si permite reintentar una consulta fallida.
8. Identifica si respuestas fuera de orden pueden mostrar un contexto incorrecto.
9. Contrasta los hallazgos con M-02 del plan de mejoras.
10. Define los archivos mínimos que necesitan modificación.

## FASE 2 — IMPLEMENTACIÓN

Realiza solamente los cambios justificados para:

1. Mostrar carga al consultar justificaciones.
2. Mostrar mensajes de error claros.
3. Incorporar reintento de consultas fallidas cuando corresponda.
4. Conservar filtros y página durante el reintento.
5. Reiniciar la paginación cuando cambie un filtro incompatible con la consulta anterior.
6. Evitar mostrar datos de otra página o consulta como actuales.
7. Impedir que una respuesta HTTP antigua sobrescriba resultados posteriores.
8. Mostrar un estado vacío comprensible.
9. Mantener controles accesibles mediante teclado.
10. Preservar el comportamiento móvil y los permisos existentes.

El botón de reintento debe repetir únicamente una operación GET. No debe repetir automáticamente un POST, PATCH o acción de aprobación.

No guardar datos personales en almacenamiento persistente del navegador.

## FASE 3 — SEGURIDAD

Mantén:

- Autorizaciones y roles existentes.
- Aislamiento institucional.
- Restricciones de estudiantes y apoderados.
- Estados actuales de las justificaciones.
- Auditoría y validaciones del servidor.
- Reglas de asistencia existentes.

No crear nuevos endpoints, permisos o estados.

## FASE 4 — PRUEBAS

Agrega pruebas Cypress focalizadas para:

- Consulta exitosa.
- Error HTTP y reintento.
- Conservación de filtros y página.
- Cambio de filtro.
- Resultado vacío.
- Respuesta tardía.
- Usuario sin autorización.
- Ausencia de repetición de escrituras.
- Regresión de M-01.

Ejecuta build, ESLint, TypeScript E2E, Cypress y verificaciones de formato.

Ejecuta Pest solamente con una base de pruebas aislada y segura.

Registra las pruebas ejecutadas y sus resultados exactos, diferenciando API simulada de backend real.

## FASE 5 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-005/prompt-04-implementacion-m02.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m02.md

Documenta:

- Problema identificado.
- Solución aplicada.
- Archivos modificados.
- Procedimiento y RF asociados.
- Pruebas aprobadas, fallidas y no ejecutadas.
- Comportamiento antes y después.
- Riesgos pendientes.
- Limitaciones conocidas.

## RESTRICCIONES

- No modificar M-01 ni implementar M-03.
- No modificar backend, permisos ni migraciones.
- No alterar Matrículas, Enseñanza-aprendizaje o Evaluación académica.
- No modificar macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No realizar commits, push, merge ni Pull Requests.
- No inventar resultados de pruebas.

## RESULTADO ESPERADO

Indica si M-02 está COMPLETADA, PARCIAL o BLOQUEADA.

Entrega los archivos modificados, pruebas ejecutadas y limitaciones de integración real.
