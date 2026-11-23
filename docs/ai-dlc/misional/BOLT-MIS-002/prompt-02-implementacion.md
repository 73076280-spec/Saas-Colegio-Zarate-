Registro retrospectivo: prompt reconstruido el 28/10/2026 a partir del código, documentación y pruebas de BOLT-MIS-002. No corresponde a una transcripción literal del historial original de Codex.

# Prompt 02 — Implementación del Centro de Matrículas

En `D:\zarate-saas`, rama `feature/centro-matriculas`, implementa la organización del Centro de Matrículas de BOLT-MIS-002 dentro del marco institucional existente. Parte de la auditoría del módulo, conserva las operaciones ya implementadas y reutiliza sus contratos de API. El alcance corresponde a la fase 2.1 documentada en `docs/matriculas-fase-2-1.md`.

## Rutas y componentes

- Integra `EnrollmentLayout` en `/app/enrollments`, bajo autenticación, con navegación del centro y enlace «Volver a Gestión Institucional» hacia `/app`, manteniendo la sesión.
- Usa `EnrollmentDashboard` como ruta índice; `/list` reutiliza `EnrollmentsPage`; `/new` reutiliza el mismo componente con `initialCreate` y protección `enrollments.create`; `/history` utiliza `historyOnly`; `/capacity` presenta `EnrollmentCapacity`.
- Organiza los enlaces en `EnrollmentNavigation`, condicionando nueva matrícula y cupos por sus permisos efectivos. Conserva `/app/enrollments` como destino de enlaces anteriores y actualiza el menú institucional a «Centro de Matrículas».

## Dashboard y reutilización de datos

Muestra total, pendientes, aprobadas y observadas mediante cuatro consultas independientes a `GET /api/v1/enrollments?per_page=1`. Añade respectivamente los filtros `status=PENDING`, `APPROVED` y `OBSERVED`; utiliza siempre `meta.total`. El total incluye todos los estados y pendientes no incluye borradores ni observadas. No recorras páginas para calcular indicadores.

Inicia en «Todos los años». Si existe `profile.view`, reutiliza los años de `/api/v1/dashboard`; sin ese permiso informa que el selector no está disponible y conserva la consulta global dentro del alcance autorizado. Envía `academic_year_id` al filtrar y propágalo en los accesos del dashboard. Ofrece actualización manual, estados de carga, error y ausencia de matrículas. Evita que respuestas de una selección anterior sustituyan la consulta vigente. No presentes las cuatro lecturas como una instantánea transaccional.

## Historial y cupos

Reutiliza búsqueda, paginación y detalle de `EnrollmentsPage`. En historial, conserva la consulta y los filtros disponibles, oculta creación, edición, comentario de transición y acciones de cambio de estado. Presenta el historial al abrir «Detalle», con fecha, estado anterior, nuevo estado, usuario y comentario, usando los datos del endpoint existente; no construyas un historial agregado nuevo.

Para cupos, reutiliza `Lookup`, `Pager` y `/api/v1/enrollment-options` con `kind=years|grades|sections`. Solicita secciones solo después de seleccionar año y grado, con `academic_year_id`, `grade_level_id` y página. Reinicia grado y paginación cuando corresponda. Muestra sección, capacidad, ocupados y disponibles; calcula disponibles como `max(0, capacidad - ocupados)`, representa capacidad nula como «Sin límite» y ocupación ausente como «No disponible». Incluye actualización, carga, error y consulta sin secciones activas. Aclara que la disponibilidad es informativa y se revalida al aprobar; no reserves cupos.

## Límites y entrega

Respeta los permisos y el alcance institucional del backend, el formulario existente y las reglas vigentes de pago y aprobación. No cambies el Aula Virtual, Laravel, migraciones, datos demo ni conviertas el formulario en pasos. Relaciona PM-01 únicamente con consulta y gestión de solicitudes, seguimiento e información de cupos respaldados por estos componentes, sin crear códigos de procedimientos.

Entrega la relación de archivos y contratos reutilizados y verifica compilación, TypeScript y ambos specs de matrícula. Documenta resultados y pendientes con su evidencia, sin extrapolar a una regresión completa del sistema. No hagas commit, push, merge ni Pull Request.
