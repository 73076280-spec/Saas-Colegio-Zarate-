# Tesorería — Fase 3

## Objetivo y alcance

Cierre del Centro de Tesorería en el frontend: un dashboard con indicadores y un espacio de trabajo con navegación propia (Inicio, Pagos, Conceptos de pago, Historial). Reutiliza los endpoints y permisos financieros existentes. No se crearon endpoints, reglas de negocio, migraciones ni dependencias.

Rama de trabajo: `integration/eco-aula-entrega-final`. Los archivos de Tesorería siguen sin confirmar (commit) en el repositorio.

## Funcionalidades

- **Dashboard (`/app/treasury`)**: cuatro indicadores con enlace a su detalle: pagos registrados, pagos pendientes (pendientes + vencidos), pagos confirmados y conceptos registrados. Incluye el botón «Actualizar resumen» y tres accesos rápidos.
- **Pagos (`/app/treasury/payments`)**: listado paginado con búsqueda por estudiante y filtro por estado; registrar pago, editar y validar según permisos. El acceso «Validaciones» abre la lista con `?status=PENDING`.
- **Conceptos de pago (`/app/treasury/concepts`)**: catálogo paginado con búsqueda por nombre (`ConceptsPanel`) y alta de concepto. `?create=1` abre el formulario de alta si el usuario puede crear.
- **Historial (`/app/treasury/history`)**: pagos en modo lectura, con filtro inicial `PAID`. Es una consulta de pagos, no un historial de cambios (auditoría); la propia página lo indica.
- **Ruta anterior**: `/app/payments` redirige a `/app/treasury/payments` conservando la query string (`LegacyPaymentsRedirect`).
- **Menú lateral**: la entrada «Tesorería» pasó a «Centro de Tesorería» (`/app/treasury`), dentro del grupo «Gestión y comunidad».

## Rutas

| Ruta | Componente | Permiso |
|---|---|---|
| `/app/treasury` | `TreasuryLayout` → `TreasuryDashboard` (index) | `payments.view` |
| `/app/treasury/payments` | `PaymentsPage view="payments" center` | `payments.view` |
| `/app/treasury/concepts` | `PaymentsPage view="concepts" center` → `ConceptsPanel` | `payments.view` |
| `/app/treasury/history` | `PaymentsPage view="history" center` | `payments.view` |
| `/app/payments` (anterior) | `LegacyPaymentsRedirect` | `payments.view` |

`Protected` en `App.tsx` y el propio `TreasuryLayout` comprueban `payments.view`; sin él se muestra un mensaje de error y no se consulta ningún dato.

## Datos e indicadores

Todos los indicadores se calculan con `GET` existentes y `per_page=1`, leyendo solo el total de la respuesta (`meta.total` o `total`):

| Indicador | Consulta |
|---|---|
| Pagos registrados | `/api/v1/student-payments` |
| Pagos pendientes | `student-payments?status=PENDING` + `status=OVERDUE` (suma) |
| Pagos confirmados | `student-payments?status=PAID` |
| Conceptos registrados | `/api/v1/payment-concepts` (activos e inactivos) |

Cada tarjeta muestra «—» y «Consultando…» mientras carga, y «Dato no disponible» si falla o el total no es un entero válido. No se inventan valores. No existen indicadores agregados de montos u obligaciones, y el dashboard lo indica.

## Permisos

| Permiso | Efecto en la interfaz |
|---|---|
| `payments.view` | Menú, dashboard, listados, conceptos e historial |
| `payments.create` | «Registrar pago» y «Nuevo concepto» |
| `payments.update` | «Editar pago» (solo `PENDING` y `OVERDUE`) |
| `payments.validate` | «Validar pago» (solo `PENDING` y `OVERDUE`) |

La interfaz oculta las acciones, pero la autorización real está en el servidor: `Gate::authorize('payments.view')` en listados, `PaymentRequest::authorize()` para crear, actualizar y validar, y `PaymentPolicy` por registro. Los modelos `StudentPayment` y `PaymentConcept` usan `BelongsToInstitution`. Según el seeder, `SECRETARY` recibe solo `payments.view`.

## Archivos

Creados (sin confirmar):

- `frontend/src/treasury/TreasuryLayout.tsx`: cabecera, navegación, guardia de permiso y `LegacyPaymentsRedirect`.
- `frontend/src/treasury/TreasuryDashboard.tsx`: indicadores y accesos rápidos.
- `frontend/src/treasury/ConceptsPanel.tsx`: catálogo de conceptos con búsqueda y paginación.
- `frontend/src/treasury/treasury.css`: estilos y puntos de corte responsive.

Modificados:

- `frontend/src/App.tsx`: rutas anidadas de `treasury` y redirección de `/app/payments`.
- `frontend/src/enrollment/PaymentsPage.tsx`: props `view` y `center`, tabla con `caption` y `scope="col"`, botones con `type` explícito y tipo `Concept` exportado.
- `frontend/src/layouts/AppLayout.tsx`: enlace y agrupación de menú.
- `frontend/src/components/Icon.tsx`: el icono `wallet` también aplica a rutas `treasury`.

## Accesibilidad y diseño responsive

- Navegación en `nav` con `aria-label`; el enlace activo recibe `aria-current="page"` de `NavLink`.
- Tablas con `caption` (solo lectores de pantalla) y `th scope`; en conceptos, el nombre es `th scope="row"`.
- Tarjetas con `aria-label` y `aria-busy`; carga con `role="status"`, errores con `role="alert"` (`Message`).
- Todos los controles son enlaces o botones nativos, con foco visible de 3 px y objetivos de al menos 2.75 rem en los enlaces de detalle.
- Campos con etiqueta (`label` o `aria-label`); iconos decorativos con `aria-hidden`.
- Indicadores en 4, 2 y 1 columnas (menos de 1280 px y menos de 640 px); accesos rápidos en 3 columnas o 1; tablas con desplazamiento horizontal dentro de su contenedor; `prefers-reduced-motion` desactiva animaciones.
- Los colores usan las variables existentes (`--surface`, `--accent-ink`), compatibles con el tema oscuro.

## Validaciones

Comprobaciones previas de esta fase (indicadas por el equipo; no se repitieron porque en este cierre no se modificó código):

- ESLint: aprobado.
- Build del frontend: aprobado.
- Typecheck de Cypress: aprobado.

Revisión estática de este cierre:

- Los parámetros `per_page=1`, `status` y `search` coinciden con `EnrollmentListRequest`; los estados enviados (`PENDING`, `OVERDUE`, `PAID`) son válidos para pagos.
- El total se lee tanto de recursos paginados (`meta.total`, pagos) como del paginador directo (`total`, conceptos).
- La redirección anterior conserva el caso existente de Cypress: un docente que visita `/app/payments` recibe «No tienes permiso para acceder…».

## Pendientes

- No hay pruebas E2E del Centro de Tesorería: no hay specs que cubran `/app/treasury/*`, los indicadores ni la redirección. Solo existe la aserción de permiso del docente en `enrollment.cy.ts`.
- No se hizo verificación visual en navegador (responsive, teclado, lector de pantalla); la revisión fue por lectura de código.
- «Pagos pendientes» enlaza a la lista sin filtro, porque la API no permite filtrar `PENDING` y `OVERDUE` a la vez.
- Los filtros y el formulario de pagos muestran los códigos de estado sin traducir (`PENDING`, `PAID`…); las insignias de estado sí están traducidas. Es una mejora de texto, no bloquea el uso.
- Los conceptos solo se pueden consultar y crear: la API no ofrece edición ni desactivación.
- Confirmar los cambios (commit) y ejecutar SonarQube quedan para después de la aprobación.
