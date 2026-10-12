# Sprint 10 — Consolidación y cierre

## Implementación

Se incorporaron veinte reportes con filtros, paginación y CSV, reutilizando consultas, modelos y permisos existentes. Los seis dashboards utilizan datos reales y limitan la información al rol, institución y vínculo familiar. No se agregaron tablas, dependencias pesadas ni integraciones externas.

ReportCatalog define los reportes; ReportService comparte consultas; ReportPolicy restringe el alcance; ReportRequest valida selectores mediante modelos con scopes. ReportController conserva el contexto durante el streaming CSV y neutraliza fórmulas. DashboardService delega en servicios pequeños por rol.

## Correcciones verificadas

- El filtro de periodo ahora utiliza su modelo y la institución heredada del año académico, evitando consultar una columna institution_id inexistente.
- La interfaz tipa correctamente el total de la respuesta paginada.
- Los tests Cypress esperan la petición filtrada y las opciones finales del selector, en lugar de respuestas iniciales o elementos transitorios.
- Pint normalizó formato sin cambiar reglas de negocio anteriores.

## Evidencia y documentación

311 Pest aprobadas con 2.028 aserciones, incluidas cinco nuevas de Sprint 10; 42 Cypress aprobadas, incluidas dos nuevas. Total: 353 casos distintos. No se añadieron pruebas durante este cierre. La regresión Cypress se consolidó conservando las ocho suites iniciales (29 casos), continuando las restantes y revalidando Personas (5/5) tras corregir esperas de perfiles y el interceptor de relaciones paginadas. No se reinició toda la regresión ni se sumaron reintentos. Pint, ESLint, TypeScript frontend/Cypress y build confirmados. Evidencia y desglose en [quality-metrics.md](../quality-metrics.md).

Documentación: architecture.md, database.md, api.md, roles-permissions.md, traceability.md, requirements-status.md, final-system.md, demo-guide.md, manual-test-guide.md y README. Inventario real: 52 tablas y 210 endpoints API por método/ruta, sin HEAD implícito. RF-01 a RF-24 conserva los nombres proporcionados por el responsable del proyecto.

## Estado del cierre

Sprint 10 cerrado el 10 de octubre de 2026: listo para sustentación local. Sin fallos funcionales reproducidos por las pruebas finales. Se registran como observaciones pendientes los avisos React de claves duplicadas en el log de desarrollo y la deprecación del navegador Electron de Cypress; no se modificaron funcionalidades ni dependencias durante este cierre. La preparación productiva queda fuera de alcance. No se implementó Sprint 11 ni se modificaron Windows, WSL o Docker.
