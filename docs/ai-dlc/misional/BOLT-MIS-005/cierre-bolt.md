# BOLT-MIS-005 — Cierre técnico de asistencia y seguimiento

Fecha de validación: **02/11/2026, America/Lima**. EcoAula SaaS — Colegio Zárate de Huancayo, 2026. Macroproceso misional, proceso PM-04. Documento nuevo de cierre: no sustituye diagnóstico, plan, prompts o evidencias originales.

## Objetivos y decisión de cierre

Auditar y mejorar el módulo existente de asistencia, proteger el borrador local docente, recuperar consultas de justificaciones y hacer fiables las consultas personales/familiares. Validar el alcance implementado sin crear módulos, estadísticas, permisos, relaciones o reglas nuevas.

**BOLT-MIS-005: LISTO CON LIMITACIONES para revisión mediante Pull Request. La validación integral del proceso NO está completada.** La ejecución nueva de cierre aprobó 101 casos Cypress con API simulada y build/lint/tipos/formato; no hay fallos de ejecución actuales pendientes. M-01 permanece **PARCIAL** por navegación SPA global y cambios externos de curso/pestaña; M-02/M-03 están **COMPLETADAS en frontend**, sin validación real actual de Laravel/MySQL. Los 13 casos reales identificados no se ejecutaron por falta de entorno seguro disponible.

No se atribuye aprobación institucional, del profesor, de despliegue o de merge a esta validación. El filtro nominal por periodo académico sigue **PENDIENTE DE CONFIRMACIÓN INSTITUCIONAL**: no hay sustento en los RF revisados para incorporarlo como requisito nuevo ni relación directa de sesión con periodo. Los nombres PM-04 se conservan como fueron asignados; la correspondencia con un mapa institucional externo no se deduce de un cambio de código.

## Repositorio, commits y comparación con la base

Rama inicial y final requerida: `feature/asistencia-seguimiento`. HEAD revisado: `3d4156e`. Estado inicial: limpio, sin cambios pendientes del usuario. `feature/macro-misional` y el ancestro común devuelven `4672a6e0301737c5efab24e009fd75be995067b5`; por tanto, el diff de tres puntos representa los cambios propios del Bolt sobre esa base.

| Commit real, preexistente | Asunto obtenido de Git |
| --- | --- |
| `0bbfa64` | `docs(misional): auditar asistencia y seguimiento PM-04` |
| `6533ece` | `docs(misional): validar brechas y planificar mejoras PM-04` |
| `789ccc1` | `feat(misional): proteger borradores de asistencia y documentar limites SPA` |
| `a8d83c3` | `fix(misional): mejorar recuperacion de consultas de justificaciones` |
| `3d4156e` | `fix(misional): mejorar consultas personales y familiares de asistencia` |

Comandos de revisión: `git branch --show-current`, `git status --short`, `git log --oneline feature/macro-misional..HEAD`, `git merge-base HEAD feature/macro-misional`, `git diff --name-status feature/macro-misional...HEAD` y diff funcional. No se creó ningún commit en esta intervención.

Antes del cierre, la rama añade/modifica **18 archivos: 14 añadidos y 4 modificados**, con **2478 inserciones y 78 eliminaciones**, según Git. Se enumeran todos:

| Grupo | Archivos relativos a la raíz |
| --- | --- |
| Cuatro componentes modificados | `frontend/src/attendance/AttendanceCourse.tsx`, `frontend/src/attendance/JustificationsPage.tsx`, `frontend/src/attendance/JustificationDetail.tsx`, `frontend/src/attendance/PersonalAttendance.tsx` |
| Tres specs añadidos | `e2e/cypress/e2e/attendance-draft.cy.ts`, `e2e/cypress/e2e/justification-query.cy.ts`, `e2e/cypress/e2e/personal-attendance-query.cy.ts` |
| Once documentos añadidos dentro de `docs/ai-dlc/misional/BOLT-MIS-005/` | `diagnostico.md`, `plan-mejoras.md`, `evidencias-m01.md`, `evidencias-m02.md`, `evidencias-m03.md`, `prompt-01-auditoria.md`, `prompt-02-validacion.md`, `prompt-03-implementacion-m01.md`, `prompt-03b-navegacion.md`, `prompt-04-implementacion-m02.md`, `prompt-05-implementacion-m03.md` |

Los **únicos archivos nuevos de esta fase** son `prompt-06-validacion-final.md` y `cierre-bolt.md`, en el mismo directorio documental del Bolt. Son adicionales al inventario de 18 archivos ya comprometidos; no se presentan como funcionalidad nueva.

## Resultado por mejora

| Mejora | Estado mantenido | Comportamiento contrastado |
| --- | --- | --- |
| M-01 — Protección de borradores | **PARCIAL**, no COMPLETADA | Dirty/baseline de estado y observaciones; confirmación para descartar/cancelar cambios locales de sesión/página/fecha; bloqueo durante POST y refresco; error de POST conserva borrador; POST confirmado + GET fallido distingue ambos resultados y reintenta solo lectura; respuesta antigua de roster desmontado se ignora. Antes podía descartarse el borrador al seleccionar otra sesión y una recarga sustituir ediciones recientes. |
| M-02 — Recuperación de justificaciones | **COMPLETADA en el alcance frontend**, sin integración real acreditada | Listado vinculado a filtros/página/revisión; retry GET conserva criterios aplicados; filtros reinician página y retiran detalle anterior con confirmación de comentario pendiente. Detalle/historial tienen carga/error/vacío y recuperación por ID/página; POST no se reenvía automáticamente. Conserva comentario ante rechazo y distingue decisión confirmada de fallo posterior de lectura. |
| M-03 — Consultas personales/familiares | **COMPLETADA en el alcance frontend**, sin integración real acreditada | Cargas de vínculos/asistencia separadas; identidad autorizada/página visibles; retry del GET exacto; cambio de estudiante reinicia página y retira filas/contexto anteriores; revisión adicional evita reutilizar respuesta al regresar A → B → A; confirmación de motivo/archivo al cambiar consulta y bloqueo durante envío; no se añaden indicadores o filtros. |

Los cambios no sustituyen las validaciones finales de Laravel. Las condiciones de botones se conservan o verifican mediante las mismas abilities/roles/estados existentes; no otorgan derechos nuevos.

### Límite no resuelto de M-01: navegación SPA

`frontend/src/App.tsx` usa **BrowserRouter + Routes**, React Router 7.18.4. La revisión complementaria 03B constató que useBlocker requiere un router de datos; usePrompt depende del mismo mecanismo. No se introdujo un hook incompatible, un router adicional, parche de history/navigator, interceptor genérico de clics o reversión de popstate.

Además, `TeachingPage::show` y `CourseLearning` pueden desmontar asistencia al cambiar curso/pestaña mediante estado React sin cambiar URL. Incluso una futura migración del router no sustituye la coordinación de esas transiciones locales. **Salir por menú lateral, otra ruta, otro curso o pestaña externos no está protegido globalmente**. No se declara resuelta esta pérdida potencial por las pruebas de cambio local de sesión.

El beforeunload nativo solo solicita aviso mientras hay borrador o escritura pendiente. Su test comprueba cancelación de un evento beforeunload y limpieza del listener; no certifica que todos los navegadores muestren diálogo ni recuperación tras aceptar recarga/cierre. No existe persistencia del borrador. Esta limitación está documentada en plan, prompt 03B y evidencias M-01 y permanece en el cierre.

## Matriz de trazabilidad de PM-04

Los nombres RF proceden de `docs/traceability.md` y `docs/requirements-status.md`. Los procedimientos no añaden RF ni un cuarto procedimiento. IMPLEMENTADO por inspección no equivale a autorización real probada en esta sesión.

| Procedimiento | RF existentes | Funcionalidad y mejora | Archivos/endpoints reales | Roles/permisos | Evidencia ejecutada y limitaciones |
| --- | --- | --- | --- | --- | --- |
| **PM-04.1 — Registrar asistencia de estudiantes** | RF-13 Gestión de asistencia; RF-05/06 de identidad/matrícula; RF-04/24 de autorización/auditoría; RF-22 de integración heredada | Sesión por curso/fecha, lote de estados y observaciones, upsert, corrección y cierre. M-01 protege edición y solicitudes locales, con excepción SPA global. | `AttendanceCourse.tsx`; backend existente `AttendanceService`, `AttendanceController`, `AttendanceRequest`, `AttendancePolicy`, `CourseAccess`. GET/POST `/api/v1/courses/{course}/attendance-sessions`; GET/PATCH `/attendance-sessions/{id}`; POST `/{id}/close`; GET/POST `/attendance-sessions/{session}/records`; PATCH `/attendance-records/{id}`. | TEACHER asignado o ADMINISTRATOR con attendance.view/create/update/close según operación, curso ACTIVE, sesión OPEN y roster APPROVED; scope institucional. | `attendance-draft.cy.ts`: comparación/retorno a baseline, cancelación/descarte, fecha, página, POST/GET lentos, errores 403/422/500, GET retry sin POST duplicado, cierre, lectura sin edición/CLOSED, beforeunload, Enter y móvil. Regla/atomicidad real pendientes de Pest; navegación externa sigue sin bloqueo. |
| **PM-04.2 — Justificar inasistencias** | RF-15 Justificación de inasistencias; RF-13/14; RF-21 familiar; RF-04/24 transversales | Apoderado solicita sobre falta ABSENT sin solicitud previa; adjunto privado opcional; revisión/decisión e historial. M-02 recupera consultas/contexto, M-03 conserva formulario al cambiar consulta o fallar envío. | `JustificationsPage.tsx`, `JustificationDetail.tsx`, `PersonalAttendance.tsx`; backend existente `JustificationService`, `AttendanceAccess`, `AttendancePolicy`, `AttendanceController`, `MaterialFiles`. GET `/absence-justifications`, `/{id}`, `/{id}/history`, `/{id}/download`; POST `/attendance-records/{record}/justifications`; POST `/absence-justifications/{id}/review`, `/approve`, `/reject` bajo `/api/v1`. | GUARDIAN activo/vinculado con justifications.create/view para solicitar/consultar; SECRETARY/ADMINISTRATOR con view/review/approve/reject para decidir. Administración con create no sustituye vínculo familiar. Estudiante/docente no obtienen aprobación por consultar asistencia. | `justification-query.cy.ts`: filtros/página, 403/404/422/500, retry GET, detalle/historial, vacío, respuestas tardías, comentario, POST rechazado y éxito + GET fallido sin duplicación, rol/permiso/capacidades, Enter y móvil. Archivo privado, estados y rollback reales NO EJECUTADOS. |
| **PM-04.3 — Consultar indicadores de asistencia y seguimiento** | RF-14 Consulta de asistencia; RF-21 Portal del padre/apoderado; RF-23 Generación de reportes existente; RF-13/15 de origen de datos; RF-04/24 de soporte | Consulta propia/vinculada e indicadores/reportes ya existentes. M-03 mejora contexto/carga/vacío/error/retry de esas asistencias; M-02 mejora lectura de sus justificaciones. No genera estadísticas nuevas. | `PersonalAttendance.tsx`; backend existente `AttendanceController::personal`, `AttendanceAccess`, `StudentSummary`, `TeacherDashboard`, `ReportCatalog`, `ReportService`, `ReportPolicy`. GET `/api/v1/my/attendance`; `/guardians/{guardian}/students/{student}/attendance`; `/profile/family`; `/dashboard`; `/reports/student-attendance`, `/course-attendance`, `/attendance-incidents` y exportaciones autorizadas. | STUDENT con attendance.view y perfil propio activo; GUARDIAN con permiso/perfil y vínculo validado; consulta de vínculos bajo permisos de perfil existentes. Reportes institucionales para Administración/docente/Secretaría con permiso/alcance, no para familias por attendance.view solamente. | `personal-attendance-query.cy.ts`: propia/familiar, cargas separadas, estudiante/página, retry GET de vínculos/asistencia, vacíos, respuestas tardías/A-B-A, 403/404, rol/permiso, cancelar/descarte de motivo, detalle al paginar, POST rechazado y GET fallido posterior, Enter/móvil. No valida indicadores/reportes contra datos reales ni una política nueva de periodo. |

Rutas frontend de componentes: `frontend/src/attendance/`. Servicios backend de asistencia: `backend/app/Services/Attendance/`; controller/request en `backend/app/Http/Controllers/Api/AttendanceController.php` y `backend/app/Http/Requests/AttendanceRequest.php`; política en `backend/app/Policies/AttendancePolicy.php`; acceso de curso en `backend/app/Services/Courses/CourseAccess.php`. Servicios de indicadores/reportes en `backend/app/Services/Reports/`; ReportPolicy en `backend/app/Policies/ReportPolicy.php`. Estas rutas de backend son fuentes inspeccionadas, no archivos modificados por el Bolt.

### Indicadores y filtros conservados

StudentSummary calcula `(PRESENT + LATE) / total de registros × 100`, faltas ABSENT y número de solicitudes de justificación, con «Sin registros» cuando corresponde. JUSTIFIED forma parte del denominador, no del numerador; solicitudes no equivale a aprobaciones. No se cambia fórmula ni se interpreta como error sin requisito institucional.

Los reportes existentes permiten año/nivel/grado/sección/curso/docente/asignatura/estudiante, estado y rango de fechas según ReportCatalog. Asistencia no tiene academic_period_id en ese catálogo; un rango de fechas no equivale a filtro nominal de periodo. Los GET personales siguen paginación y contrato existentes, sin simular filtros que el backend no consume. **El filtro nominal por periodo permanece pendiente de confirmación**, no PENDIENTE de desarrollar automáticamente.

## Seguridad y revisión de regresiones

La comparación completa de la rama no contiene cambios de backend o migraciones. Se verificó expresamente ausencia de diferencias en Matrículas (`frontend/src/enrollment`), Enseñanza-aprendizaje/Evaluación (`frontend/src/learning`, `frontend/src/courses`), App/router/layouts, manifiestos y lockfiles de frontend/E2E. El inventario de todos los cambios limita el código a los cuatro componentes de asistencia y los tres specs. No hay cambios inesperados que eliminar.

Por inspección del contrato existente:

- Institución se deriva de sesión/middleware y scopes, no del cuerpo ni del ID elegido por React. Se conservan roles/permisos/Gates y relaciones familiares.
- Consulta propia resuelve perfil STUDENT del usuario; consulta familiar verifica guardian de ruta y vínculo antes de devolver datos. Tener una opción/ID en navegador no sustituye esta autorización.
- Registro valida curso/sesión/roster y no permite JUSTIFIED manual. Duplicados se previenen con servicio e índices únicos; el lote es transaccional.
- Justificación conserva PENDING → IN_REVIEW → APPROVED/REJECTED, comentario obligatorio al rechazar, una solicitud por falta y cambio a JUSTIFIED solo al aprobar. No se cambia auditoría ni archivo privado.
- No se añaden localStorage/sessionStorage/IndexedDB o logs de datos académicos en asistencia. No se modifica escala de notas, matrícula, vínculo familiar, API o lógica de otros macroprocesos.
- Retry vuelve a leer; los specs comprueban que no repita un POST ya enviado/confirmado. Una escritura de respuesta incierta no se reenvía automáticamente ni se interpreta un fallo GET como rollback.

Estas conclusiones son inspección de código y comprobaciones del cliente con respuestas simuladas. **No constituyen una nueva validación real de IDOR, aislamiento, transacción, privacidad familiar o datos persistidos**; requieren el backend aislado pendiente. No se identificó mediante esta revisión un nuevo defecto de seguridad reproducido; tampoco se certifica ausencia universal de vulnerabilidades.

## Accesibilidad y responsividad

Los tres specs focalizados verifican controles nativos con nombres comprensibles, estados/carga y errores existentes con roles anunciables, confirmación/cancelación y vista móvil **390 × 844**, incluyendo ausencia de desbordamiento horizontal en el escenario probado. El select administrativo de estudiante tiene nombre propio accesible; las consultas personal/familiar conservan label de selección.

Enter se prueba por CDP con secuencia nativa completa (keyDown con retorno de carro y keyUp) sobre el botón enfocado y se comprueba la solicitud/recuperación o guardado; no se usa clic sobre ese botón como sustituto de la tecla. La controversia histórica de Cypress.press de otro Bolt no se traslada aquí como aprobación o defecto del módulo. El beforeunload probado es un evento cancelable, no certificación del diálogo real del navegador.

No hay auditoría completa WCAG, todos los navegadores/lectores de pantalla, subida/descarga real de adjuntos o bloqueo de navegación SPA aprobado. Los formularios conservan texto en el componente montado, no después de recarga o salida global.

## Pruebas ejecutadas en este cierre

Entorno: dependencias ya instaladas, Vite accesible en `http://localhost:5173` (HTTP 200), Cypress 16.1.1 con Electron 146 headless. No se instalaron paquetes ni prepararon datos demo. Aviso de deprecación de Electron observado, sin impedir el arranque.

Comando desde `e2e`:

```powershell
npm test -- --spec cypress/e2e/attendance-draft.cy.ts,cypress/e2e/justification-query.cy.ts,cypress/e2e/personal-attendance-query.cy.ts,cypress/e2e/assessment-context.cy.ts,cypress/e2e/score-history.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts,cypress/e2e/learning-filters.cy.ts
```

| Verificación en este cierre | Resultado exacto |
| --- | --- |
| `npm run build`, desde `frontend` | APROBADO; `tsc -b` y Vite completados, 100 módulos. |
| `npm run lint`, desde `frontend` | APROBADO, código 0, sin errores reportados. |
| `npm run typecheck`, desde `e2e` | APROBADO, código 0. |
| `attendance-draft.cy.ts` — M-01 | **16 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `justification-query.cy.ts` — M-02 | **17 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `personal-attendance-query.cy.ts` — M-03 | **18 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `assessment-context.cy.ts` — regresión | **12 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `score-history.cy.ts` — regresión | **9 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `virtual-access.cy.ts` — regresión | **9 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `submission-deadline.cy.ts` — regresión | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| `learning-filters.cy.ts` — regresión | **10 aprobadas, 0 fallidas**, 0 pendientes/omitidas. |
| Total Cypress de esta única ejecución conjunta | **101 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas; código 0; 2 minutos 43 segundos. API simulada.** |
| `git diff --check feature/macro-misional...HEAD` y `git diff --check` | APROBADOS, sin errores; revisión adicional de formato de los dos archivos nuevos. |
| Control de alcance | `git diff --quiet HEAD` confirmó que todos los archivos previamente versionados siguen sin cambios. Solo aparecen los dos documentos de cierre nuevos. |
| Integridad del prompt 06 | SHA-256 de adjunto y copia coinciden: `91513AAC53A31D05AF2CC26477ED4889077DBE2AC2AD1A9CF1D921E9D2574938`. |

Consolidado actual: **101 aprobadas y 0 fallidas con API simulada; 0 aprobadas y 0 fallidas con backend real, porque los 13 casos reales identificados son NO EJECUTADOS.** No hubo fallos funcionales o de compilación/tipos nuevos en este cierre. No se añadieron, ajustaron ni reescribieron pruebas para obtener esos resultados. Los fallos históricos se mantienen en sus evidencias y en el apartado documental posterior.

Se distinguen **51 casos focalizados de BOLT-MIS-005** (16 + 17 + 18) de **50 de regresión de evaluación/aprendizaje** (12 + 9 + 9 + 10 + 10). No se incluyen compilación, lint, tipos, formato o preflight como casos Cypress. Las cifras de fases anteriores no se suman ni se convierten en ejecución de este cierre.

### Backend real: preflight y casos no ejecutados

Antes de intentar Pest se inspeccionaron `backend/phpunit.xml` y `backend/AGENTS.md`: MySQL/base/usuario **zarate_test**, APP_ENV testing y sin configuración cacheada. Se hizo preflight de solo lectura con PHP portátil `..\.tools\php\php.exe`, opciones forzadas en memoria, DB_URL vacío y validación de destino antes de intentar `SELECT DATABASE(), CURRENT_USER()`. La conexión falló con **código 2002**. El timeout se acotó en memoria del proceso de testing, sin editar configuración ni credenciales.

No se acreditó disponibilidad/aislamiento operativo, por lo que **no se lanzaron Pest, fixtures, migraciones, limpieza de pruebas, seeders ni creación de usuarios**. No se accedió a zarate_dev o una base institucional para escribir. El puerto local 8000 no estaba disponible en comprobación TCP; no se inició Laravel sobre configuración de desarrollo ni se invocó una API para forzar datos.

| Suite real identificada | Casos | Estado en este cierre |
| --- | --- | --- |
| `backend/tests/Feature/Sprint8Test.php` | 10 | **NO EJECUTADOS**. Gestión/cierre, docente ajeno, roster/atomicidad, duplicados/upsert, archivo y vínculo, apoderado ajeno, aprobación/rollback, rechazo, histórico propio y aislamiento institucional. |
| `e2e/cypress/e2e/attendance.cy.ts` | 3 | **NO EJECUTADOS**. Registro/cierre docente, solicitud familiar con archivo, revisión y consulta de JUSTIFIED. |
| Total del alcance real contado | **13** | No son fallos ni skipped del runner; falta un entorno real seguro disponible. |

No se reejecutó toda la suite del proyecto ni se cuantifican otras suites como si fueran aprobaciones o pendientes de este cierre. Sprint10Test/reportes se conservan como evidencia de cobertura histórica del inventario, no resultado actual. **Ausencia de validación con backend real** es una limitación vigente, no prueba de un fallo de negocio.

## Coherencia documental e historial conservado

Se revisaron diagnóstico, plan, evidencias y prompts 01, 02, 03, 03B, 04 y 05; prompt 06 se conserva íntegro desde el adjunto actual. El diagnóstico y plan registran fases históricas de inspección/propuesta con cero casos ejecutados: no se reescriben sus estados como si hubieran nacido implementados. Los prompts posteriores autorizan cambios acotados y sus evidencias registran resultados propios.

Historial que permanece explícito:

- M-01: TS2769 inicial en alias del spec corregido; pruebas posteriores aprobadas. 03B documenta incompatibilidad de useBlocker con BrowserRouter y cambios sin URL; no implementó bloqueo frágil y mantuvo PARCIAL.
- M-02: TS2322 inicial de Pager/history y tipado de rol corregidos; primera ejecución conjunta 82 aprobadas/1 fallida por alias genérico. Se corrigió la identificación de requests, sin alterar aplicación para forzar el test, y se repitió el spec con 17 aprobadas. Esos resultados no se ocultan ni se atribuyen al cierre actual.
- M-03: primera ejecución conjunta 100 aprobadas; revisión preventiva para A/B/A y comprobación reforzada de envío; spec final 18 aprobado y consolidado histórico de 101 por último caso. No se afirma que ese histórico fuera una única ejecución de 101.

Se verificó coincidencia SHA-256 con los adjuntos originales disponibles de prompts **01, 02, 03, 05 y 06**. Prompts 03B y 04 proceden de texto inline del usuario y se contrastan con las instrucciones de la conversación, sin atribuirles un adjunto original inexistente. No se expusieron credenciales de los documentos históricos.

## Riesgos residuales y acciones posteriores

| Riesgo/límite | Evidencia y naturaleza | Recomendación |
| --- | --- | --- |
| Pérdida de borrador al abandonar curso/pestaña/ruta | Límite funcional confirmado por flujo de montaje y 03B; no bloqueado globalmente. No equivale a pérdida de registros ya persistidos. | Revisar propuesta de router/estado de borrador compartido y coordinación de cambios sin URL antes de ampliar M-01. Mantener advertencia explícita al usuario. |
| Falta de integración real validada | Preflight falló 2002 y puerto backend no disponible; 13 casos no ejecutados. | Acreditar aislamiento y ejecutar Pest Sprint8Test y Cypress real de asistencia antes de afirmar validación completa del proceso o aceptar esos controles como probados. |
| Respuestas tardías y contexto obsoleto | Controles activos/claves y pruebas focalizadas aprobadas; tráfico no se cancela físicamente. | Conservar cobertura de A/B/A, filtros/páginas y revocación; no interpretar mocks como prueba de autorización real. |
| Duplicación de escrituras | Retry GET comprobado; resultado de POST cuya respuesta se pierde sigue siendo incierto. No se reprodujo duplicación en los casos ejecutados. | Verificar estado autorizado antes de reenvío manual; no añadir auto-retry de POST ni asumir idempotencia no definida. |
| Información personal/permisos | Scopes y Gates heredados intactos; cliente retira datos de consulta anterior. No hay exposición real reproducida en esta revisión. | Revalidar institución, otro estudiante/apoderado y permisos revocados en backend aislado; no ampliar acceso desde selección UI. |
| Texto/archivo al salir o revocarse acceso | Solo memoria/input montado; las confirmaciones cubren transiciones locales. Archivo real y persistencia no validados. | Explicar límite; no almacenar información identificable en navegador para suplirlo. |
| Accesibilidad | Controles/Enter/móvil focalizados aprobados; no certificación integral. | Ampliar revisión manual con tecnologías asistivas y otros navegadores dentro de alcance posterior. |
| Periodo nominal/fórmula | Necesidad institucional no confirmada, contrato actual sin modificaciones. | Confirmar semántica con responsable antes de proponer filtros, indicadores, estados o reglas nuevas. |

No se hallaron cambios inesperados que deban eliminarse. No se corrigieron funcionalidades durante este cierre ni se transformaron riesgos potenciales en incidentes reales inventados.

## Evidencia disponible y recomendación de Pull Request

Fuentes del Bolt: [diagnóstico](diagnostico.md), [plan](plan-mejoras.md), [M-01 y 03B](evidencias-m01.md), [M-02](evidencias-m02.md), [M-03](evidencias-m03.md), prompts originales del mismo directorio y los tres specs enumerados. Fuentes institucionales: `docs/traceability.md`, `docs/requirements-status.md`, `docs/sprints/sprint-8.md`, `docs/sprints/sprint-10.md` y `docs/architecture.md`.

Se recomienda **abrir un Pull Request para revisión técnica desde `feature/asistencia-seguimiento` hacia `feature/macro-misional`**, declarando M-01 PARCIAL y la ausencia de integración real validada. La compilación y regresión simulada respaldan la revisión del alcance implementado; no convierten el Bolt en validación completa ni autorizan una fusión automática.

Antes de aprobar el alcance como integral se requiere: documentar la aceptación explícita o resolver posteriormente la limitación SPA mediante una propuesta revisada, acreditar entorno aislado y ejecutar los 13 casos reales, y confirmar la semántica institucional del periodo si se pretende ampliar el contrato. El PR no debe anunciar M-01 COMPLETADA ni certificación del backend. No se abre ni fusiona un PR en esta intervención.

Control de esta intervención: solo se crean `docs/ai-dlc/misional/BOLT-MIS-005/prompt-06-validacion-final.md` y `docs/ai-dlc/misional/BOLT-MIS-005/cierre-bolt.md`. Se comprueban formato de la rama y nuevos archivos y ausencia de cambios en archivos previamente versionados. No se modificaron frontend/backend/tests, evidencia previa o datos. No se realizaron commits, push, merge o Pull Requests.
