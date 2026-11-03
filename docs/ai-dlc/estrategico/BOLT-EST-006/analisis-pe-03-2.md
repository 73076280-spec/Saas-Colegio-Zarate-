# PE-03.2 — Registrar acciones de mejora

**Estado:** auditoría de proceso y software. No se comprobó el procedimiento institucional vigente ni se aprobó automatización.

## Hallazgos

- No se encontró una entidad o módulo para acciones correctivas/mejora con descripción del hallazgo, plan, responsable, fecha objetivo, estado propio, evidencia de avance/verificación y resultado de eficacia.
- La tabla genérica `audit_logs` almacena eventos que ocurrieron: institución, actor, acción, tipo/ID de entidad, valores anteriores/nuevos y fecha. No representa una tarea futura ni registra responsable/fecha límite/seguimiento de una acción de mejora.
- `academic_requests` sí almacena solicitudes académicas orientadas a un estudiante/familiar: tipo, asunto, descripción, estado de trámite, `assigned_to`, `resolution`, fechas de creación/actualización y una tabla inmutable `request_status_history` con transiciones, actor, comentario y fecha. Es una capacidad parcial de seguimiento de solicitudes, no un registro de acciones correctivas institucionales. No tiene fecha límite ni modelo de eficacia de una acción.
- No se afirma que la institución use las solicitudes académicas como instrumento de mejora; falta una regla institucional aprobada que permita esa equivalencia.
- La matriz RF documenta RF-01–RF-24. RF-16/17 cubren gestión/seguimiento de solicitudes académicas y RF-24 auditoría del sistema; ninguno está nombrado como gestión de acciones correctivas o mejora continua. En ese sentido, PE-03.2 no está cubierto por un RF explícito en el alcance disponible.

## Comparación AS-IS / TO-BE (escenario para validar, no flujo aprobado)

| Aspecto | AS-IS verificable en EcoAula | TO-BE documental sujeto a aprobación |
|---|---|---|
| Disparador | Reporte, auditoría o trámite puede mostrar un dato/evento; no se encontró un registro que transforme ese hallazgo en acción de mejora. | El dueño del proceso define qué hallazgos califican, quién los valida y cómo autoriza abrir una acción. |
| Entradas | Evento de auditoría con entidad/actor/fecha, o datos operativos/reportes; solicitudes académicas contienen asunto/descripción centrados en un trámite del estudiante. | Hallazgo validado, evidencia/fuente y decisión de tratarlo. Los tipos de entrada y validación deben ser definidos por la institución. |
| Responsable | `audit_logs.user_id` identifica al actor de un evento; `academic_requests.assigned_to` asigna una solicitud a personal de Secretaría/Administración. No hay propietario institucional de acción correctiva definido. | Responsable institucional y responsables de acción nombrados por rol/instancia competente; por definir por el dueño del proceso. |
| Fechas | Auditoría e historial de solicitud tienen timestamps de ocurrencia/transición; no hay fecha objetivo/vencimiento de acción. | Fecha de compromiso, revisión y cierre solo si la institución las requiere y aprueba. |
| Estado | Auditoría registra acción pasada; las solicitudes recorren `REGISTERED`, `IN_REVIEW`, `OBSERVED`, `APPROVED`, `REJECTED`, `COMPLETED`. | Estados y transiciones específicos de mejora son desconocidos; no se copian estados de solicitudes sin justificación. |
| Evidencia / resultado | Valores de auditoría describen cambios en registros; resolución de solicitud cierra un trámite. No se vincula una evidencia de ejecución con verificación de eficacia. | Evidencia de avance/cierre, verificador y decisión sobre eficacia son elementos a consultar, no requisitos asumidos. |
| Salida | Historial de un evento o resultado de una solicitud académica. | Decisión aprobada y registro trazable del resultado de la acción si así lo define el proceso. Formato y retención pendientes. |

### Escenarios

1. **AS-IS: dato que requiere seguimiento.** Un responsable observa una anomalía en reporte o evento auditado. El SaaS permite consultar el reporte/evento, pero no crear una acción correctiva asociada con dueño, fecha objetivo y progreso. No se presupone que hoy el colegio lo registre fuera del sistema: ese proceso debe levantarse con el responsable.
2. **AS-IS: solicitud académica.** Un estudiante/familiar inicia un trámite; el personal autorizado asigna/gestiona la solicitud, registra transiciones y resolución. Este flujo termina en la resolución del trámite; su registro no acredita por sí mismo análisis de causa, acción correctiva o verificación de eficacia institucional.
3. **TO-BE por definir.** Una vez confirmado el procedimiento, documentar disparador, actor que aprueba, entradas, responsable, calendario, estado, evidencia, verificación, decisión y salida. Solo si la institución aprueba que el SaaS lo gestione, comparar integración justificada con Requests/Audit y una nueva historia, respetando que ambos módulos actuales tienen propósitos diferentes.

## Responsable institucional, decisión y alcance

- **Responsable del procedimiento:** no identificable en la evidencia técnica ni proporcionado por la institución. La unidad que dirige PE-03.2 debe nombrar dueño, aprobador y ejecutores.
- **Entradas/salidas y autoridad:** no verificadas institucionalmente; el cuadro AS-IS/TO-BE expone preguntas por resolver y no instituye reglas.
- **Decisión recomendada:** **documentar primero el proceso actual con el dueño institucional**. No integrar en solicitudes académicas por analogía. Si, tras aprobar el proceso, se requiere registro SaaS, elaborar una historia y Bolt acotados que comparen una integración válida y capacidad nueva.
- **Clasificación:** PE-03.2 es un proceso administrativo no identificado entre los 24 RF existentes. Puede documentarse como proceso; cualquier función de software nueva queda fuera del alcance RF verificado y requiere autorización explícita.

## Evidencia técnica revisada

- [AcademicRequest.php](../../../../backend/app/Models/Office/AcademicRequest.php), [RequestService.php](../../../../backend/app/Services/Office/RequestService.php) y [2026_10_05_110000_create_academic_office_tables.php](../../../../backend/database/migrations/2026_10_05_110000_create_academic_office_tables.php): solicitudes, asignación a usuario y estados/resolución.
- [RequestStatusHistory.php](../../../../backend/app/Models/Office/RequestStatusHistory.php): historial inmutable de transición y actor.
- [AuditLog.php](../../../../backend/app/Models/AuditLog.php) y [2026_10_01_150000_create_saas_core.php](../../../../backend/database/migrations/2026_10_01_150000_create_saas_core.php): log genérico de operaciones y marcas de tiempo; sin columnas de acción futura o vencimiento.
- [requirements-status.md](../../../../docs/requirements-status.md) y [traceability.md](../../../../docs/traceability.md): RF-16/17 corresponden a solicitudes y RF-24 a auditoría del sistema; no hay RF de acciones correctivas.
- [Sprint9Test.php](../../../../backend/tests/Feature/Sprint9Test.php): pruebas existentes de autorización, estados, asignación/trámite, historial e aislamiento de solicitudes. Fueron inspeccionadas; la ejecución se reporta aparte en Prompt 16.
