# BOLT-MIS-004 — PROMPT 04: Implementación M-02 — Consulta y recuperación del historial de calificaciones

Actúa como desarrollador senior especializado en React 19, TypeScript, Laravel 13, Cypress, Pest, seguridad y calidad de software.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/evaluacion-academica

Macroproceso: Misional.

Bolt: BOLT-MIS-004.

Procedimientos:
- PM-03.2 — Registrar calificaciones.
- PM-03.4 — Consultar historial académico.

Requerimientos: RF-09, RF-24 y RF-08, conforme a la trazabilidad existente.

La mejora M-01 ya fue desarrollada y publicada mediante el commit 33c4a1c.

Implementa exclusivamente la mejora M-02 del plan aprobado.

## DOCUMENTACIÓN OBLIGATORIA

Lee antes de programar:

- docs/ai-dlc/misional/BOLT-MIS-004/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-004/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-004/evidencias-m01.md

Examina particularmente:

- frontend/src/learning/LearningPanel.tsx
- Componente interno ScoreHistory.
- backend/app/Http/Controllers/Api/LearningController.php
- backend/app/Models/Learning/Score.php
- Pruebas Cypress y Pest relacionadas con notas e historial.

Comprueba el estado Git y conserva todo cambio previo.

## OBJETIVO

Mejorar la fiabilidad de la consulta del historial de modificaciones de una calificación, permitiendo visualizar correctamente la carga, los errores, los resultados vacíos, la paginación y la recuperación ante fallos.

Este historial es el registro de cambios de una nota específica, no un expediente académico completo del estudiante.

## FASE 1 — VERIFICACIÓN

1. Confirma la rama feature/evaluacion-academica.
2. Revisa git status.
3. Comprueba el flujo actual de consulta del historial.
4. Identifica cómo se almacenan result, error y page.
5. Verifica qué ocurre cuando falla una petición y la siguiente tiene éxito.
6. Comprueba si al cambiar de nota se reutilizan resultados anteriores.
7. Identifica cómo responde el sistema a solicitudes HTTP fuera de orden.
8. Revisa el contrato real del endpoint GET /api/v1/scores/{id}/history.
9. Verifica las capacidades de acceso y los campos existentes del historial.
10. Relaciona cada cambio propuesto con los criterios de aceptación de M-02.

No modifiques código hasta terminar esta verificación.

## FASE 2 — IMPLEMENTACIÓN

Realiza los cambios mínimos necesarios para:

1. Mostrar un indicador de carga adecuado al consultar cada nota o página.
2. Evitar presentar datos anteriores como si correspondieran a la página actual.
3. Limpiar mensajes de error obsoletos cuando la consulta posterior tenga éxito.
4. Mostrar un mensaje comprensible si la consulta falla.
5. Incorporar una opción accesible para reintentar la petición fallida.
6. Mantener la nota y página correctas durante el reintento.
7. Presentar un estado vacío explícito cuando no existan modificaciones.
8. Proteger la interfaz contra respuestas HTTP antiguas que lleguen después de una consulta más reciente.
9. Limpiar o invalidar correctamente el resultado al cambiar de nota.
10. Conservar la paginación y el orden establecidos por el servidor.
11. Mostrar los datos existentes de cada modificación: valor anterior, valor nuevo, fecha, actor y motivo, cuando estén disponibles.
12. Identificar la sección como Historial de cambios de la nota.
13. Mantener una interfaz accesible mediante teclado y etiquetas comprensibles.

Reutiliza los componentes y helpers existentes.

No agregues dependencias.

## FASE 3 — SEGURIDAD

Respeta los permisos existentes.

No permitas que un usuario consulte notas de estudiantes ajenos.

No amplíes acceso a apoderados ni habilites nuevos permisos.

No crees endpoints ni consultes audit-logs para reemplazar el historial actual.

No modifiques datos persistidos, modelos, políticas ni servicios backend.

La autorización del servidor debe seguir siendo definitiva.

## FASE 4 — PRUEBAS

Crea o ajusta pruebas Cypress focalizadas que comprueben:

- Carga inicial del historial.
- Cambio a una página posterior.
- Error HTTP 500 y recuperación mediante reintento.
- Error anterior seguido de una respuesta correcta.
- Historial vacío.
- Respuesta HTTP tardía.
- Cambio de una nota a otra.
- Conservación de valores, actor, motivo y fechas.
- Respuesta HTTP 403 sin mostrar información restringida.
- Regresión de M-01.

Utiliza interceptaciones y fixtures con datos simulados para evitar alterar información académica real.

Si existen pruebas Pest relevantes, ejecútalas únicamente en un entorno de base de datos aislado y seguro.

Ejecuta las verificaciones disponibles:

- Build de React.
- ESLint.
- TypeScript E2E.
- Cypress focalizado.
- Regresión pertinente.
- git diff --check.

Distingue las pruebas con API simulada de las realizadas contra un backend real.

No inventes resultados.

## FASE 5 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-004/prompt-04-implementacion-m02.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-004/evidencias-m02.md

Documenta:

1. Problema original.
2. Justificación técnica.
3. Archivos modificados.
4. Comportamiento anterior y nuevo.
5. Procedimientos y requerimientos relacionados.
6. Criterios de aceptación.
7. Pruebas ejecutadas.
8. Resultados exactos.
9. Pruebas no ejecutadas.
10. Riesgos y limitaciones pendientes.

## RESTRICCIONES

- No implementar M-03.
- No alterar M-01 salvo regresión demostrada.
- No modificar reglas de calificación.
- No modificar publicación o cierre de evaluaciones.
- No cambiar roles o permisos.
- No añadir migraciones.
- No modificar Centro de Matrículas ni Enseñanza-aprendizaje.
- No modificar macroprocesos estratégico o de apoyo.
- No instalar nuevas dependencias.
- No hacer commits, push, merge ni Pull Requests.

## RESULTADO ESPERADO

Entrega un resumen con:

- Mejoras implementadas.
- Archivos modificados.
- Pruebas aprobadas, fallidas y no ejecutadas.
- Limitaciones de integración con backend real.
- Estado de M-02: COMPLETADO, PARCIAL o BLOQUEADO.

No declares completada una prueba que no haya sido ejecutada.