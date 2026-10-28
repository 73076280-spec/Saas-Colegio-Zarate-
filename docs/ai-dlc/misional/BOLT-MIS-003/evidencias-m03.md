# BOLT-MIS-003 — Evidencias de M-03

Fecha: 28/10/2026. Rama verificada: `feature/ensenanza-aprendizaje`. HEAD inicial: `dbc7f64`. El estado Git estaba limpio: no había cambios pendientes ajenos que preservar. Se leyeron diagnóstico, plan, evidencias M-01/M-02 y las fuentes solicitadas antes de implementar.

## Problema y alcance

`LearningPanel` solo enviaba la página de consulta. El docente no podía organizar tareas/evaluaciones por borrador, publicación o cierre, ni localizar entregas pendientes de revisión por estado, aunque la API ya soportaba `status`.

Se comprobó por lectura que `backend/app/Http/Requests/LearningRequest.php` valida `status` y que `backend/app/Http/Controllers/Api/LearningController.php::index` aplica el filtro a la consulta autorizada antes de `orderByDesc('id')` y `paginate`. No se requiere alterar API, controladores, permisos ni datos.

## Archivos afectados

| Archivo | Cambio real |
| --- | --- |
| `frontend/src/learning/LearningPanel.tsx` | Selección de estado para personal autorizado, envío a API, reinicio de consulta y limpieza de detalles, mensaje de vacío filtrado |
| `e2e/cypress/e2e/learning-filters.cy.ts` | Diez casos focalizados con API simulada y sin escrituras en base de datos |
| `docs/ai-dlc/misional/BOLT-MIS-003/prompt-05-implementacion-m03.md` | Prompt recibido íntegro |
| `docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m03.md` | Esta evidencia |

No se modificaron `shared.tsx`, `SubmissionForm.tsx`, los componentes de M-01, helpers temporales de M-02, backend, roles, permisos, migraciones, Centro de Matrículas, macroprocesos estratégico/de apoyo ni dependencias. El panel compartido recibe cambios exclusivamente para M-03; conserva su lógica previa de capacidades, entregas y vencimiento.

## Implementación y criterios de aceptación

| Criterio | Implementación y comprobación |
| --- | --- |
| Actividades por estado | Selector con Todos, Borrador (DRAFT), Publicado (PUBLISHED) y Cerrado (CLOSED), para tareas y evaluaciones por curso fuera del modo notas |
| Entregas por estado | Selector con Todos, Entregada (SUBMITTED), Tardía (LATE), Revisada (REVIEWED) y Devuelta (RETURNED), en entregas anidadas de personal autorizado |
| Acceso al filtro | Requiere rol TEACHER/ADMINISTRATOR, permiso de consulta del recurso y contexto por curso/tarea. No cambia autorización de Laravel ni amplía capacidades |
| Consulta de servidor | Envía `status` únicamente si hay filtro activo; Todos omite el parámetro. No filtra ni reordena elementos en memoria |
| Paginación | Conserva `Pager` y metadatos del servidor. Cambiar filtro vuelve a página 1; cambiar página conserva el estado seleccionado |
| Detalles anteriores | Al cambiar filtro limpia resultado, error y aviso previos, cierra panel hijo, formulario e historial y muestra carga. No permite operar sobre los registros de la consulta anterior mientras espera |
| Respuestas fuera de orden | Añade el estado efectivo a las dependencias del efecto de consulta y conserva su guardia `alive` con limpieza. Respuestas, errores o finalizaciones anteriores no actualizan la consulta vigente |
| Vacío y error | Mensaje de vacío filtrado orienta a seleccionar Todos; mantiene estados de carga, error y reintento con la consulta actual |
| Revisión | Conserva acciones solo para SUBMITTED/LATE con `abilities.review`; filtrar no concede revisión ni cambia estado real. La API conserva la validación final |
| Accesibilidad y móvil | Select nativo dentro de etiqueta visible específica del recurso; ancho adaptable. Caso a 390 × 844 comprueba visibilidad, operación y ausencia de desbordamiento horizontal |
| Estudiantes | No muestra filtros en cursos de estudiantes ni en sus entregas personales, ni añade `status` a sus consultas. No calcula nuevos intentos a partir de resultados filtrados |
| Perfiles mixtos | Si la tarea padre devuelve `abilities.submit`, no ofrece filtro administrativo de entregas incluso con rol docente, evitando usar esa lista filtrada para habilitar un intento propio |

El filtro es una ayuda de navegación/consulta. No agrega estados, acciones de escritura, endpoints ni reglas de negocio. Los mensajes y etiquetas reutilizan `learningLabels`.

## Pruebas nuevas identificadas

`e2e/cypress/e2e/learning-filters.cy.ts` contiene diez casos:

1. DRAFT/PUBLISHED/CLOSED enviados correctamente y ausencia de `status` al volver a Todos.
2. SUBMITTED/LATE/REVIEWED/RETURNED y conservación de acciones según estado; cierre del formulario de revisión al cambiar filtro.
3. Reinicio desde página 2, limpieza de detalle hijo y conservación del estado al paginar entregas.
4. Resultado vacío, recuperación con Todos y selector móvil etiquetado.
5. Error 500 sin registros anteriores y recuperación mediante reintento del filtro actual.
6. Respuesta DRAFT retrasada que llega después de PUBLISHED sin sobrescribirla; carga visible durante espera.
7. Ausencia de revisión cuando `abilities.review=false`.
8. Ausencia de filtros administrativos para estudiante en curso y vista personal; sin parámetros `status` añadidos.
9. Reutilización del filtro de actividades para evaluaciones, sin cambiar la consulta de notas.
10. Perfil STUDENT + TEACHER con capacidad de entrega: sin filtro de entregas ni habilitación artificial de otro intento.

Todas las sesiones y respuestas de estos tests son fixtures: validan la interfaz y sus parámetros HTTP, no la ejecución de consultas MySQL ni la seguridad del backend real. No se alteraron permisos persistidos, datos o especificaciones de M-01/M-02.

## Historial de validación

- Primera ejecución conjunta: M-03 tuvo 4 aprobadas y 5 fallidas; M-01 9/9 y M-02 10/10. Resultado global 23 aprobadas, 5 fallidas y código 1. Las cinco fallas de M-03 correspondieron a esperas de alias genéricos que consumían solicitudes iniciales repetidas bajo React StrictMode, antes de la solicitud del filtro/página esperado.
- Se cambiaron solo las esperas del spec nuevo para identificar recurso, estado y página, manteniendo las aserciones de parámetros, contenidos y paginación. Repetición focalizada de esos nueve casos: 9 aprobadas, 0 fallidas, código 0. No se cuentan como casos nuevos.
- Se añadió después el décimo escenario de perfil mixto y su protección en el panel. TypeScript detectó dos alias construidos por concatenación como `string` en vez del tipo requerido `@…`; se sustituyeron por template literals, sin cambiar su valor o las aserciones.
- Los resultados históricos de estas ejecuciones se conservan aquí; no se ocultan los fallos iniciales ni se suman reejecuciones al total de casos distintos.

## Verificaciones, resultados y límites

### Resultados finales ejecutados

| Comando / alcance | Resultado real |
| --- | --- |
| `npm run build`, en `frontend` | APROBADO, código 0: `tsc -b` y Vite, 99 módulos transformados |
| `npm run lint`, en `frontend` | APROBADO, código 0, sin errores reportados |
| `npm run typecheck`, en `e2e` | APROBADO, código 0 después de corregir los alias dinámicos del spec nuevo |
| `learning-filters.cy.ts` | 10 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `virtual-access.cy.ts` — regresión M-01 | 9 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `submission-deadline.cy.ts` — regresión M-02 | 10 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |

Comando final desde `e2e`: `npm test -- --spec cypress/e2e/learning-filters.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts`. Terminó con código 0 en 49 segundos: **29 pruebas distintas aprobadas, 0 fallidas, 0 pendientes y 0 omitidas**. Este es un resultado consolidado de la ejecución final, sin sumar las reejecuciones previas. Cypress se ejecutó fuera del sandbox con Electron; el aviso de deprecación del navegador no impidió las comprobaciones. No se añadieron dependencias ni se alteraron los tests de M-01/M-02.

### No ejecutadas y límites del resultado

- **Pest focalizado: NO EJECUTADO.** La API no cambió y su contrato se verificó por lectura; no se hicieron fixtures ni transacciones de pruebas que escriban bases de datos, respetando la restricción expresa de esta tarea. No se declara validado dinámicamente el filtrado SQL o el aislamiento institucional en esta intervención.
- **`learning.cy.ts`, `virtual.cy.ts` y regresión completa con backend real: NO EJECUTADAS en esta tarea.** La primera realiza escrituras de datos y la autenticación real puede persistir información de sesión/auditoría. Se revisaron sus escenarios y se utilizaron las regresiones de interfaz simuladas de M-01/M-02 para conservar la restricción de no modificar bases de datos. Aprobaciones anteriores no se trasladan como actuales.
- La prueba de móvil no certifica accesibilidad integral WCAG ni todos los dispositivos. Se usa etiqueta nativa; no se rediseñan pestañas ni layouts.
- La guardia de efectos impide aplicar resultados antiguos, pero no cancela el trabajo del servidor. No se añaden dependencias o infraestructura de consultas.
- No hay una bandeja global nueva ni filtros en notas o vistas personales. Cambiar deliberadamente un filtro docente cierra formularios/detalles del listado anterior; el formulario estudiantil de M-02 no recibe este control.

## Trazabilidad

PM-02.2 — Planificar actividades y PM-02.3 — Publicar materiales y tareas: consulta de tareas/evaluaciones por sus estados existentes, sin reconstruir su CRUD. PM-02.4 — Recibir y revisar tareas: organización de entregas por estado respetando capacidades del servidor. RF-10 Gestión de actividades académicas y RF-12 Entrega de actividades son los requisitos directos; RF-22 Aula virtual aporta el contexto de navegación y RF-04 sigue como control transversal. No se inventan RF ni se modifican reglas de M-01/M-02.

## Control documental y estado final

`git diff --check`: APROBADO, sin errores detectados. Se revisan adicionalmente espacios finales y marcadores de conflicto de los tres archivos nuevos, todavía sin seguimiento. El estado Git se limita a los cuatro archivos enumerados; no se hicieron commits, push, merge ni Pull Requests.

**M-03: COMPLETADA dentro del alcance de interfaz aprobado.** Los filtros se verificaron con diez pruebas nuevas y las regresiones M-01/M-02 aprobaron sus diecinueve casos; build, lint y tipos aprobaron. No se declara comprobado dinámicamente el contrato SQL, la API real o una regresión integral: esas verificaciones quedan explícitamente no ejecutadas por el alcance sin escrituras de datos.
