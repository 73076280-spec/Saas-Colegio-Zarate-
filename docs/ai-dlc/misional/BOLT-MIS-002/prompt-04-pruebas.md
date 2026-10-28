Registro retrospectivo: prompt reconstruido el 28/10/2026 a partir del código, documentación y pruebas de BOLT-MIS-002. No corresponde a una transcripción literal del historial original de Codex.

# Prompt 04 — Validación y regresión de matrículas

Valida BOLT-MIS-002 en `D:\zarate-saas`, rama `feature/centro-matriculas`, tomando como referencia la implementación `6b3e216`. Antes de ejecutar, revisa los scripts reales, la configuración Cypress, los servicios requeridos y el estado del repositorio. Utiliza el entorno local de pruebas configurado y conserva cambios ajenos. No registres credenciales ni afirmes ejecuciones sin sus resultados.

## Comprobaciones técnicas

Desde `frontend`, ejecuta `npm run build`: el script realiza `tsc -b && vite build`, por lo que verifica TypeScript del frontend y compilación de producción. Desde `e2e`, ejecuta `npm run typecheck` para comprobar los tipos de los specs sin emitir archivos.

Desde `e2e`, ejecuta por separado:

```powershell
npm test -- --spec cypress/e2e/enrollment-center.cy.ts
npm test -- --spec cypress/e2e/enrollment.cy.ts
```

El segundo spec crea datos de prueba y recorre operaciones de matrícula y pagos; no lo describas como una prueba de solo lectura. No sustituyas estos specs por una ejecución de toda la suite ni afirmes regresión integral del proyecto.

## Cobertura que debe contrastarse

1. `enrollment-center.cy.ts`, tres casos: administrador navega al centro, compara el indicador total filtrado por año con `meta.total` de la API, abre y cierra el formulario sin guardar, consulta detalle e historial sin edición, consulta cupos y regresa a `/app`; estudiante y apoderado consultan la lista y reciben denegación al abrir creación y cupos directamente; docente sin acceso al centro conserva navegación a `/virtual` y retorno institucional. El caso administrativo comprueba ancho móvil de 390 × 844. No atribuyas al spec comparación individual de los cuatro indicadores ni todos los estados de error.
2. `enrollment.cy.ts`, tres casos de regresión: Secretaría crea, envía, observa, corrige y reenvía una matrícula; la aprobación sin pago devuelve 422; Tesorería registra y valida el pago y Secretaría aprueba, consulta historial y observa la ocupación 1/1. El segundo caso verifica consulta propia del estudiante y vinculada del apoderado sin acciones administrativas. El tercero comprueba denegación del centro y pagos al docente, además de una lista API vacía. Conserva las verificaciones móviles existentes. No atribuyas cobertura ejecutada de rechazo, cancelación o concurrencia de cupos.
3. Contrasta las rutas `/app/enrollments`, `/list`, `/new`, `/capacity` y `/history` con sus componentes. Revisa en código los permisos y la reutilización de endpoints, diferenciando inspección estática de comprobación dinámica.

Ejecuta `git diff --check` desde la raíz e inspecciona el alcance del diff y los archivos sin seguimiento. Registra comando, ubicación, resultado, número de pruebas aprobadas/fallidas y limitaciones. Si falla una comprobación o no hay servicios disponibles, informa el bloqueo sin convertirlo en aprobado.

## Registro de evidencia

Actualiza `evidencias.md` conservando los registros anteriores. Distingue resultados comunicados, resultados ejecutados en la sesión y verificaciones pendientes; identifica rama y commit de implementación. Relaciona PM-01 solo con registro y consulta de matrícula, seguimiento de estados e historial y consulta informativa de cupos. La validación de pagos es una dependencia del trámite existente, no una nueva implementación de Tesorería.

No modifiques backend, migraciones, permisos ni otros módulos para hacer pasar pruebas; no hagas commit, push, merge ni Pull Request. Este prompt es un registro documental retrospectivo y no constituye evidencia de que sus comandos se ejecutaron al redactarlo.
