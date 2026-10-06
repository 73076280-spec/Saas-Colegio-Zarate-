# Arquitectura final

## Componentes

React + TypeScript + Tailwind presenta la interfaz; Laravel/PHP expone la API REST y aplica las reglas, validación y autorización final; MySQL conserva información y restricciones. Sanctum autentica la SPA con sesión/cookies y CSRF. Spatie Permission implementa RBAC institucional. Pest/PHPUnit comprueba backend y MySQL; Cypress recorre navegador y API reales.

~~~mermaid
flowchart TD
    R[React + TypeScript + Tailwind] -->|REST /api/v1 y cookies CSRF| L[Laravel / PHP]
    L --> F[Form Requests]
    F --> P[Policies y permisos]
    P --> S[Services y transacciones]
    S --> E[Eloquent y scopes]
    E --> M[(MySQL)]
    S --> A[Auditoría e historiales]
    S --> D[Storage privado]
~~~

Repositorio: backend/, frontend/, e2e/, docs/, docker/. Los archivos Docker son preexistentes; Sprint 10 se valida con herramientas locales y no modifica Docker, WSL ni el sistema operativo.

## Separación de responsabilidades

Controladores pequeños delegan en Services; Form Requests validan campos y relaciones. Policies y servicios de acceso comprueban permiso y alcance del registro. Las operaciones críticas (matrícula, pagos, notas, estados, documentos, comunicaciones) usan transacciones y auditoría; operaciones dependientes del cupo utilizan bloqueo institucional. React muestra capacidades y errores del servidor, sin decidir autorización.

ReportCatalog define veinte vistas sobre consultas compartidas de ReportService. ReportPolicy reutiliza permisos de los módulos y restringe el rol; no agrega permisos ficticios reports.*. Un reporte de docente solo consulta sus cursos. CSV comparte consulta y filtros con JSON, recorre resultados en lotes y neutraliza celdas que podrían ejecutar fórmulas. El contexto institucional se restaura durante el streaming, después del middleware.

DashboardService coordina OfficeDashboard, TreasuryDashboard, TeacherDashboard y FamilyDashboard. StudentSummary se utiliza solo tras resolver estudiantes propios/vinculados. No hay métricas fijas ni tablas de métricas duplicadas.

## Multiinstitución

ResolveInstitution obtiene la institución de la cuenta autenticada, verifica cuenta/institución activas y establece InstitutionContext junto con el team ID de Spatie. institution_id del cliente no define el contexto. El middleware limpia el contexto al terminar; las relaciones y scopes vuelven a comprobarlo.

La mayoría de entidades usa BelongsToInstitution. academic_periods hereda la institución de academic_years; grade_levels, de education_levels, mediante BelongsToInstitutionThroughParent. No se supone que todas las tablas tengan una columna directa. Los filtros nuevos usan los modelos con sus scopes, incluyendo relaciones heredadas. Las tablas globales de infraestructura y permissions tienen semántica propia.

Los estudiantes acceden a cursos activos mediante matrícula APPROVED. El docente requiere su asignación. El apoderado solo accede a estudiantes vinculados; el dashboard familiar ofrece resúmenes de notas publicadas sin conceder edición ni acceso al reporte institucional.

## Seguridad revisada

- Login por institución y correo, contraseña cifrada, límite de intentos y rechazo de cuentas inactivas.
- Sanctum stateful, CSRF, logout con invalidación y cambio inicial obligatorio de contraseña.
- Permisos actuales, protección del último administrador y restricciones de delegación.
- Rechazo de IDOR y de institution_id/estados/autores/rutas privadas impuestos por cliente.
- Archivos en disco privado materials, nombres generados; máximo 2 MiB, extensión y MIME real. Office Open XML valida estructura y ausencia de macros.
- Descargas autorizadas por Laravel, attachment, nosniff y no-store; no rutas internas en DTO.
- Historial y auditoría preservados; sin contraseñas, contenido privado ni binarios en audit_logs.
- React renderiza texto; CSV neutraliza fórmulas y exporta únicamente columnas explícitas.
- Pruebas de acceso ajeno y de otra institución en los Sprints 1–10; no equivalen a una auditoría de penetración externa.

## Límites de operación

Demo local con MySQL, Laravel :8000 y Vite :5173. No se declara listo un despliegue público: HTTPS, respaldo/restauración, secretos productivos, monitoreo y pruebas de carga requieren preparación propia. Notificaciones database sin workers, email ni websockets. Montos corresponden a Tesorería de matrícula, no ERP.
