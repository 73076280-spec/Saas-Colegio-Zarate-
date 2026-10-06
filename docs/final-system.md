# Documento final del sistema

## 1. Propósito

La Plataforma SaaS Colegio Zárate integra procesos académicos y administrativos de una institución educativa, con arquitectura preparada para varias instituciones en una misma aplicación. Su primer entorno demostrativo corresponde al Colegio Zárate de Huancayo.

## 2. Problema

La gestión separada de matrícula, evidencias académicas, asistencia y trámites dificulta la consulta oportuna, la autorización consistente y la trazabilidad. El proyecto aborda esa fragmentación mediante un registro integrado y responsabilidades explícitas por usuario.

## 3. Solución

Una aplicación web permite registrar y consultar información según seis roles. El backend valida reglas críticas y conserva historiales; el frontend facilita navegación, formularios y seguimiento. Los reportes y dashboards presentan datos derivados de los registros, sin duplicar un sistema analítico independiente.

## 4. Arquitectura

React, TypeScript y Tailwind consumen una API REST Laravel/PHP; MySQL conserva datos. Sanctum gestiona sesión/CSRF y Spatie implementa permisos por institución. Form Requests, Policies, Services, relaciones Eloquent, scopes y transacciones separan validación, autorización y negocio. Véase [architecture.md](architecture.md).

## 5. Módulos

Identidad y RBAC; institución y estructura académica; estudiantes/docentes/apoderados; matrícula y pagos; asignación docente y cursos; aula virtual; tareas y entregas; evaluaciones, notas e historial; asistencia y justificaciones; solicitudes y documentos; comunicaciones y notificaciones; auditoría; reportes y dashboards.

El inventario real es de 52 tablas y 210 endpoints API por combinación método/ruta, excluyendo HEAD implícito. Reportes y dashboards reutilizan tablas existentes.

## 6. Roles

ADMINISTRATOR supervisa configuración y gestión institucional. SECRETARY tramita matrículas, justificaciones, solicitudes y documentos. TREASURY valida pagos. TEACHER conduce sus cursos. STUDENT consulta y entrega su trabajo. GUARDIAN acompaña exclusivamente a estudiantes vinculados. Detalle en [roles-permissions.md](roles-permissions.md).

## 7. Procesos principales

La matrícula pasa por registro, revisión y decisión; la aprobación exige elegibilidad, cupo y pago cuando corresponde. La matrícula aprobada habilita cursos activos y contenido publicado. Las tareas conservan entregas e intentos; las calificaciones conservan historial. La asistencia permite justificación con revisión. Las solicitudes conservan transiciones y notificaciones; los documentos permanecen privados. Las comunicaciones resuelven destinatarios sin duplicados.

## 8. Seguridad

El contexto institution_id procede de la sesión y se aplica mediante scopes directos o heredados del padre. Las Policies verifican permisos y relación con el registro. CSRF, contraseña cifrada, cambio inicial obligatorio y revocación de sesión protegen el acceso. Los archivos validan MIME/tamaño y se descargan con autorización. CSV protege contra fórmulas y excluye contenido sensible no necesario. La revisión es de código y pruebas, no una certificación de pentesting externo.

## 9. Pruebas

La línea base fue 306 Pest y 40 Cypress. Sprint 10 agrega únicamente cinco pruebas Pest y dos flujos Cypress críticos para reportes, exportación y dashboards. Las pruebas del backend usan zarate_test y transacciones; Cypress usa la aplicación local real. Los resultados finales y porcentajes comprobados están en [quality-metrics.md](quality-metrics.md).

## 10. Calidad y trazabilidad

Los 24 RF definidos por el responsable del proyecto se relacionan con endpoint, interfaz, regla y prueba en [traceability.md](traceability.md). [requirements-status.md](requirements-status.md) contiene la matriz de cumplimiento. Pint, ESLint, TypeScript y build complementan la regresión funcional, sin aumentar artificialmente el número de casos.

## 11. Limitaciones

La validación corresponde al entorno local y datos ficticios, no a una carga productiva certificada. No incluye app nativa, correo/SMS/WhatsApp, integración bancaria, contabilidad completa, nómina, IA, reportes oficiales PDF ni analítica predictiva. La carga docente se expresa en asignaciones/cursos; el portal familiar muestra notas publicadas recientes. Reportes CSV consultan datos vigentes, sin congelar una instantánea histórica durante toda una exportación.

## 12. Mejoras futuras

Sin implementarlas en este cierre: preparar despliegue con HTTPS, respaldos y restauración ensayada; medir concurrencia con volumen real; acordar formatos oficiales de documentos/reportes; realizar validación con usuarios de la institución y revisión externa de seguridad. Cualquier ampliación requiere alcance y criterios de aceptación propios.

## Sustentación

Usar [demo-guide.md](demo-guide.md) para una demostración de 10–15 minutos y [manual-test-guide.md](manual-test-guide.md) para comprobaciones por rol. Presentar evidencia verificable, sin atribuir al proyecto prestaciones fuera de su alcance.
