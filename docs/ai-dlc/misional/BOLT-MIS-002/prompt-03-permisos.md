Registro retrospectivo: prompt reconstruido el 28/10/2026 a partir del código, documentación y pruebas de BOLT-MIS-002. No corresponde a una transcripción literal del historial original de Codex.

# Prompt 03 — Permisos, seguridad y continuidad institucional

Audita la autorización del Centro de Matrículas de BOLT-MIS-002 en `D:\zarate-saas`, rama `feature/centro-matriculas`. Contrasta `EnrollmentNavigation.tsx`, `EnrollmentLayout.tsx`, `EnrollmentDashboard.tsx`, `EnrollmentCapacity.tsx`, `EnrollmentsPage.tsx`, `App.tsx` y `AppLayout.tsx` con la autenticación, los permisos y el alcance de los endpoints existentes. No amplíes privilegios para facilitar la interfaz.

## Matriz de acceso que debe conservarse

| Recurso | Condición efectiva |
| --- | --- |
| Centro, lista, dashboard e historial | Usuario autenticado con `enrollments.view`, `enrollments.create`, `enrollments.update` o `payments.create`, o rol `STUDENT`/`GUARDIAN` |
| Nueva matrícula | `enrollments.create`, tanto en enlace como en ruta directa |
| Consulta de cupos | Al menos uno de `enrollments.create`, `enrollments.update`, `payments.create`, tanto en enlace como en componente |
| Selector de años del dashboard | `profile.view`; sin él, consultar todos los años e informar la limitación |
| Escrituras desde la lista | Permiso específico `enrollments.*` y estado permitido por cada acción; el backend decide la autorización final |
| Historial | Consulta de registros autorizados, sin acciones de escritura en la vista `historyOnly` |

Verifica Secretaría y Administración con sus permisos vigentes y el acceso que permite `payments.create` para Tesorería. Estudiantes y apoderados conservan lectura propia o vinculada; no deben recibir creación o cupos solo por esos roles. Un docente sin los permisos habilitantes no debe ver el enlace ni acceder al centro por URL. Describe las condiciones por permisos: no conviertas la denegación del usuario docente de prueba en una prohibición absoluta para cualquier cuenta con ese rol y permisos adicionales.

## Seguridad y datos

Comprueba que los indicadores y el detalle utilizan el mismo alcance institucional y propio/vinculado aplicado por Laravel. Ocultar botones no sustituye la autorización del servidor. Conserva el cliente de API y la sesión existentes; no incorpores credenciales al código ni alteres permisos, políticas, rutas del backend o relaciones institucionales.

Revisa que un usuario sin acceso a cupos no dispare la consulta de secciones y que el dashboard no solicite metadatos de años sin `profile.view`. Conserva las validaciones de pago, transición y capacidad al aprobar. La lectura de cupos no constituye reserva ni garantía de disponibilidad.

## Continuidad y evidencias

Valida el retorno a `/app` sin cerrar sesión y, para el docente de prueba, la navegación a `/virtual`, la presencia de la navegación del Aula Virtual y el retorno institucional. No modifiques funcionalidades del Aula Virtual.

Usa los escenarios de estudiante, apoderado y docente de ambos specs y el flujo administrativo de `enrollment.cy.ts`. Distingue la denegación de interfaz de una respuesta del servidor: el spec del docente comprueba lista API vacía, no un HTTP 403 del listado. No declares auditado el aislamiento entre instituciones, todos los permisos posibles o toda la seguridad del backend si no existen verificaciones ejecutadas para ello.

Entrega una matriz con condición, archivo de respaldo, escenario de prueba y limitaciones. Vincula PM-01 solo con el acceso a solicitudes, seguimiento e información de cupos demostrados. No modifiques backend, migraciones ni otros módulos; no hagas commit, push, merge ni Pull Request.
