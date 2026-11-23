# Centro de Matrículas — Fase 2.1

## Alcance

Dashboard y navegación del módulo en `/app/enrollments`, dentro de la sesión y el marco institucional existentes. `EnrollmentLayout`, `EnrollmentNavigation` y `EnrollmentDashboard` organizan el centro; `EnrollmentCapacity` consulta cupos. No se modifica el Aula Virtual ni Laravel, permisos, migraciones, datos demo o reglas de aprobación, pago y reserva de cupos.

## Rutas

| Ruta | Función |
| --- | --- |
| `/app/enrollments` | Inicio e indicadores; la URL anterior se conserva como entrada al centro |
| `/app/enrollments/list` | `EnrollmentsPage` existente, con búsqueda, detalle y operaciones autorizadas |
| `/app/enrollments/new` | Abre el formulario existente, protegido por `enrollments.create` |
| `/app/enrollments/capacity` | Consulta de secciones activas por año/grado |
| `/app/enrollments/history` | Misma lista y detalle con historial, sin acciones de escritura |

Los enlaces anteriores de los dashboards y reportes continúan llegando al centro. Desde allí se accede a la lista. El menú muestra **Centro de Matrículas** y el enlace de retorno lleva a `/app` sin cerrar sesión. El formulario no se convierte en pasos.

## Datos y seguridad

- Los cuatro indicadores utilizan `GET /api/v1/enrollments?per_page=1`, con `academic_year_id` cuando se selecciona un año; tres consultas añaden `status=PENDING`, `APPROVED` u `OBSERVED`. Se usa `meta.total`, nunca el tamaño de la página. Máximo cuatro registros de matrículas transferidos por actualización, sin recorrer páginas.
- Total incluye todos los estados; pendientes excluye borradores y observadas. La selección inicial es explícitamente **Todos los años**.
- El selector de años reutiliza los metadatos de `/api/v1/dashboard`, una consulta al montar para quienes tienen `profile.view`. No se agrega un endpoint ni se descarga el listado completo de matrículas. Si ese permiso falta, se conserva la consulta de todos los años y se informa que el selector no está disponible.
- Laravel mantiene el scope institucional y limita las matrículas a las propias/vinculadas cuando no existe `enrollments.view`. Los indicadores siguen exactamente ese alcance.
- Secretaría/Administración disponen de sus permisos actuales. Estudiantes y apoderados acceden al centro para lectura propia/vinculada. Otros roles requieren los permisos existentes de matrícula o `payments.create`; no se amplía la autorización del backend.
- Cupos reutiliza `/api/v1/enrollment-options` con `kind=years|grades|sections` y paginación. Solo se ofrece a quienes tienen `enrollments.create`, `enrollments.update` o `payments.create`, como exige ese endpoint. La capacidad y ocupación provienen de Laravel; la disponibilidad mostrada es informativa y se revalida al aprobar.
- El historial se consulta seleccionando **Detalle** de una matrícula autorizada. No se inventa un historial agregado ni se cambian sus transiciones.
- Los indicadores son consultas de lectura independientes, no una instantánea transaccional; pueden actualizarse con el botón del dashboard.

## Archivos

Creados: `frontend/src/enrollment/EnrollmentLayout.tsx`, `EnrollmentNavigation.tsx`, `EnrollmentDashboard.tsx`, `EnrollmentCapacity.tsx`; `e2e/cypress/e2e/enrollment-center.cy.ts`; este documento.

Modificados: `frontend/src/App.tsx`, `frontend/src/layouts/AppLayout.tsx`, `frontend/src/enrollment/EnrollmentsPage.tsx` y los enlaces/expectativa de acceso en `e2e/cypress/e2e/enrollment.cy.ts`.

El estado inicial contenía únicamente un artefacto generado sin seguimiento en `e2e/cypress/downloads/`; Cypress limpia sus carpetas de artefactos al iniciar. No se descartaron cambios de código ni se hizo commit o push.

## Validación

Resultados finales pendientes de registrar. Se ejecuta únicamente el spec `enrollment-center.cy.ts` (3 casos sin escrituras de matrículas): navegación administrativa y datos reales, acceso de estudiante/apoderado, denegación al docente y continuidad de `/virtual`. La suite histórica de matrículas solo actualiza sus enlaces; no se ejecuta la regresión de pagos/aprobación ni la regresión completa del proyecto.

## Fase 2.2

Pendiente de autorización: diseño e implementación del formulario por pasos. No se incluye en esta entrega.
