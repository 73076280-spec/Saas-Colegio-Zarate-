Registro retrospectivo: prompt reconstruido el 28/10/2026 a partir del código, documentación y pruebas de BOLT-MIS-002. No corresponde a una transcripción literal del historial original de Codex.

# Prompt 01 — Auditoría y análisis del módulo existente

Trabaja en `D:\zarate-saas`, rama `feature/centro-matriculas`, para analizar BOLT-MIS-002, Centro de Matrículas del macroproceso misional, proceso PM-01 — Admisión y matrícula. Antes de modificar código, audita el módulo existente y entrega un diagnóstico trazable a archivos reales.

## Fuentes y revisión requerida

1. Revisa `docs/matriculas-fase-2-1.md`, `frontend/src/App.tsx`, `frontend/src/layouts/AppLayout.tsx`, `frontend/src/enrollment/EnrollmentsPage.tsx`, los auxiliares de matrícula, la autenticación y las protecciones de rutas. Contrasta los contratos de API y permisos actuales con el backend, sin alterarlo.
2. Identifica la búsqueda, filtros académicos, paginación, detalle, formulario y transiciones ya disponibles. Distingue creación y edición de las acciones de enviar, observar, aprobar, rechazar y cancelar, condicionadas por permiso y estado. Determina cómo el detalle recibe el historial de cambios.
3. Examina `EnrollmentDashboard.tsx`, `EnrollmentCapacity.tsx`, `EnrollmentLayout.tsx` y `EnrollmentNavigation.tsx` como referencias de la solución reconstruida. Revisa `enrollment-center.cy.ts` y `enrollment.cy.ts` para separar cobertura del centro y regresión del trámite existente.
4. Documenta el alcance institucional y la consulta propia o de estudiantes vinculados. Identifica el acceso de Secretaría, Administración, Tesorería, estudiantes, apoderados y docentes según permisos efectivos; no deduzcas autorización únicamente del nombre del rol.

## Alcance esperado del análisis

Define una entrada en `/app/enrollments` con dashboard y navegación hacia lista, nueva matrícula, consulta de cupos e historial. Conserva la sesión institucional, el retorno a `/app` y la continuidad de `/virtual`. La lista y el formulario deben reutilizarse; el formulario por pasos corresponde a una fase posterior.

Evalúa los contratos existentes: `GET /api/v1/enrollments` para indicadores y lista, `GET /api/v1/enrollments/{id}` para detalle e historial, `/api/v1/dashboard` para años cuando existe `profile.view` y `/api/v1/enrollment-options` para catálogos paginados de años, grados y secciones. No propongas nuevos endpoints ni la descarga completa de matrículas para contar registros.

Relaciona PM-01 solo con actividades observables: registro y consulta de solicitudes de matrícula, seguimiento de estados e historial y consulta informativa de cupos. Distingue las reglas preexistentes de validación de pago y aprobación de los cambios de navegación del centro. No atribuyas evaluación de admisión, vacantes reservadas, automatización de pagos ni procedimientos sin evidencia. Si no existe catálogo formal, no inventes códigos de subprocedimientos.

## Entregable y criterios de aceptación

Presenta un inventario de componentes reutilizables, rutas, contratos, permisos, riesgos y límites. Propón verificaciones de indicadores por año, historial sin escritura, acceso directo a rutas restringidas y continuidad del Aula Virtual. Define como validación la compilación del frontend, TypeScript de E2E, ambos specs Cypress y `git diff --check`, sin afirmar resultados antes de ejecutarlos.

No cambies backend, migraciones, permisos, reglas de pago, aprobación o reserva de cupos, datos demo ni otros módulos. Conserva cambios ajenos del árbol de trabajo. No hagas commit, push, merge ni Pull Request.
