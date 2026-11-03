# PE-02.1 — Auditoría de periodos y calendario académico

**Estado:** auditoría técnica/documental. No verifica el calendario oficial del Colegio ni sustituye su aprobación institucional.

## Estado y alcance

- **PE-02.1 en EcoAula:** **PARCIALMENTE IMPLEMENTADO**. Se pueden configurar años académicos y periodos con fechas, estados, año actual y cierre; no se encontró un calendario institucional de feriados/eventos ni evidencia del calendario oficial aprobado.
- **RF:** no se identificó un RF dedicado a configurar años/periodos en `requirements-status.md` ni una trazabilidad directa en `traceability.md`. No se debe asignar RF por inferencia.
- **Datos demo:** la guía de Sprint 2 especifica que las fechas de demostración no representan el calendario oficial. No deben editarse para validar el proceso del colegio.
- **Ejecución:** no se modificó código ni se ejecutaron pruebas, seeders o migraciones. Los casos existentes se revisaron como código/documentación.

## Superficies verificadas

| Capa | Evidencia |
|---|---|
| Modelos | [AcademicYear.php](../../../../backend/app/Models/Academic/AcademicYear.php): fechas, estado, `is_current`, relación de periodos ordenada por secuencia y scope institucional. [AcademicPeriod.php](../../../../backend/app/Models/Academic/AcademicPeriod.php): fechas, secuencia, estado, `grading_open` y pertenencia institucional heredada del año padre. |
| Migración | [2026_10_01_160000_create_academic_structure.php](../../../../backend/database/migrations/2026_10_01_160000_create_academic_structure.php): tabla `academic_years` con institución directa, fechas, estado, año actual y unicidad de año/nombre; tabla `academic_periods` vinculada a `academic_years`, con fechas, secuencia, estado y unicidad año/secuencia. Los periodos no guardan `institution_id` directo. |
| Controlador y validación | [AcademicController.php](../../../../backend/app/Http/Controllers/Api/AcademicController.php), [SaveAcademicRequest.php](../../../../backend/app/Http/Requests/Academic/SaveAcademicRequest.php) y [AcademicListRequest.php](../../../../backend/app/Http/Requests/Academic/AcademicListRequest.php). Autorizan acciones y validan formato/campos. |
| Servicio de dominio | [AcademicService.php](../../../../backend/app/Services/Academic/AcademicService.php) valida intervalos, límites del año, solapamiento, cierre y auditoría en transacción. |
| Catálogo y rutas | [AcademicCatalog.php](../../../../backend/app/Services/Academic/AcademicCatalog.php) registra `academic-years`/`academic-periods`; [api.php](../../../../backend/routes/api.php) los conecta con GET/POST/PUT/PATCH y acciones de cierre bajo `/api/v1`. |
| Interfaz | [catalogs.ts](../../../../frontend/src/academic/catalogs.ts), [AcademicPage.tsx](../../../../frontend/src/academic/AcademicPage.tsx) y [AcademicForm.tsx](../../../../frontend/src/academic/AcademicForm.tsx). Presentan fechas, secuencia, año padre, estado, `grading_open`, detalle, filtro por año y control de cierre. |
| Reglas documentadas | [Sprint 2](../../../../docs/sprints/sprint-2.md) registra alcance, estados, validaciones, aislamiento, permisos, auditoría, UI, datos demo y pruebas. |

## Reglas verificadas en la implementación

1. La fecha inicial debe ser estrictamente anterior a la final; las fechas se reciben como `YYYY-MM-DD`.
2. Cada periodo debe quedar dentro de las fechas del año al que pertenece.
3. Los periodos del mismo año no se solapan; los límites son inclusivos, por lo que compartir un día final/inicial se rechaza. Un periodo que comience al día siguiente puede ser adyacente.
4. No se repite `sequence` dentro del mismo año. La restricción también está respaldada por índice único en base de datos.
5. Cerrar un periodo lo marca `CLOSED`, fija `grading_open=false`, registra auditoría y no permite edición o reapertura ordinaria.
6. Cerrar un año lo desmarca como actual, cierra sus periodos y cierra la calificación en ellos; estas modificaciones y auditorías se ejecutan en transacción.
7. El año cerrado no admite cambios ni nuevos periodos/secciones. Las fechas del año no pueden reducirse si dejan periodos existentes fuera.
8. Cambiar estado a `CLOSED` por PATCH no evita el permiso de cierre; la acción de cierre requiere permiso específico.
9. No se encontró una entidad o conjunto de eventos de calendario para feriados, ceremonias u otras fechas institucionales. Años y periodos académicos no deben presentarse como calendario oficial completo.

## Aislamiento institucional y roles

- Las rutas están detrás de `auth:sanctum`, middleware `institution` y `password.changed`.
- El año usa pertenencia institucional directa; el periodo usa `BelongsToInstitutionThroughParent` y obtiene su institución del año. Las consultas de recursos usan scopes; el cliente no define el tenant.
- La solicitud de escritura valida que `academic_year_id` pertenezca a la institución del contexto. Una relación extranjera o inexistente se rechaza con 422; un ID ajeno en detalle/actualización no queda visible y responde 404.
- `AcademicPolicy` verifica propietario y permiso de la acción. ADMINISTRATOR recibe permisos de gestión; SECRETARY y TEACHER tienen consulta de catálogos según Sprint 2; estudiantes, apoderados y tesorería no reciben administración académica.
- La unicidad de un año actual se refuerza por institución en MySQL; cambiar el actual no cambia el de otra institución.

## Pruebas de caja negra propuestas

Estas son pruebas que se pueden ejecutar en una etapa aprobada; no representan una ejecución realizada. Usar una institución de prueba, un año no demo y datos aislados; no correr seeders sobre desarrollo ni cerrar el año 2026 demo.

| Caso | Dado | Cuando | Entonces esperado |
|---|---|---|---|
| Intervalo invertido al crear año | Administrador autorizado y año de prueba con `start_date=2040-12-01`, `end_date=2040-03-01`. | `POST /api/v1/academic-years`. | HTTP 422 con error de validación en fechas; no aparece un nuevo año en el listado y no se conserva una mutación parcial. |
| Intervalo invertido al crear periodo | Año de prueba activo con fechas que cubren el periodo solicitado. | `POST /api/v1/academic-periods` con inicio posterior al fin. | HTTP 422; no se crea periodo. |
| Solapamiento interior | Año abierto con un periodo existente `2040-03-01`–`2040-05-01`. | Crear otro periodo `2040-04-15`–`2040-06-01`. | HTTP 422; el listado conserva solo el primer periodo y no aumenta el total. |
| Límite compartido | Mismo periodo existente. | Crear otro que empiece `2040-05-01`. | HTTP 422, porque el límite es inclusivo. |
| Periodos adyacentes válidos | Mismo periodo existente, termina `2040-05-01`. | Crear otro desde `2040-05-02` con secuencia distinta. | HTTP 201; listado/detalle muestra ambos en orden de secuencia. |
| Fuera del año | Año con intervalo definido. | Crear periodo que empieza antes del año o termina después. | HTTP 422; no se crea registro. |
| Cierre de periodo | Periodo de prueba no cerrado y usuario con `academic-periods.close`. | `POST /api/v1/academic-periods/{id}/close`, luego consultar detalle y tratar de editarlo. | HTTP 200 al cerrar; `status=CLOSED`, `grading_open=false`; edición posterior HTTP 422. Historial de cierre visible al rol con acceso de auditoría. |
| Cierre de año | Año de prueba con periodos abiertos y usuario con `academic-years.close`. | Cerrar el año y consultar año/periodos. | HTTP 200; año deja de ser actual, periodos quedan cerrados y con calificación cerrada; no se pueden añadir periodos. No se cambian datos del año demo. |
| Usuario sin permiso de consulta | Estudiante/apoderado o usuario autenticado sin `academic-periods.view`. | `GET /api/v1/academic-periods`. | HTTP 403, sin exponer catálogo. |
| Usuario sin permiso de cierre | Usuario autenticado con lectura pero sin `academic-periods.close`. | `POST /api/v1/academic-periods/{id}/close`. | HTTP 403; consultar detalle confirma que estado y `grading_open` no cambiaron. |
| Intento de saltar permiso por PATCH | Usuario con update, sin close. | `PATCH /api/v1/academic-periods/{id}` con `status=CLOSED`. | HTTP 403; el periodo sigue en el estado original. |
| Aislamiento del padre | Año existente en institución B, usuario de institución A. | Crear periodo con `academic_year_id` de B; luego listar/consultar ID extranjero. | Creación HTTP 422; ID ajeno no se lista y detalle/actualización retorna 404. |

Los casos existentes se solapan con varias de estas propuestas; la tabla es un guion de comprobación de caja negra, no una indicación para duplicar pruebas.

## Cobertura de pruebas encontrada

- [Sprint2Test.php](../../../../backend/tests/Feature/Sprint2Test.php) incluye fechas inválidas, periodo fuera del año, solapamiento y límites, adyacencia/secuencia, cierre y bloqueo de edición, cierre de año, permiso de cierre, relaciones foráneas, aislamiento de registros y año actual multiinstitución.
- [academic.cy.ts](../../../../e2e/cypress/e2e/academic.cy.ts) comprueba navegación al año y sus periodos, detalle/listado, fechas invertidas para un año de prueba, cierre de un año E2E y controles de consulta docente. La suite no muestra actualmente un flujo E2E dedicado al solapamiento o cierre de periodo; las reglas están cubiertas por Pest.
- [Sprint 2](../../../../docs/sprints/sprint-2.md) documenta 152/152 casos Pest y 17/17 Cypress en su validación histórica al 2026-10-01. No se ejecutaron pruebas para esta auditoría.

## Riesgos de regresión sobre matrícula y calificaciones

- **Matrícula:** las solicitudes/matrículas apuntan a un año académico. [EnrollmentService.php](../../../../backend/app/Services/Enrollment/EnrollmentService.php) rechaza un año inexistente o `CLOSED`; [PaymentService.php](../../../../backend/app/Services/Enrollment/PaymentService.php) también impide operar con años cerrados. Cambiar reglas de activación/cierre puede bloquear altas legítimas, reabrir accidentalmente años históricos o afectar validación de pagos.
- **Calificaciones:** las evaluaciones apuntan a periodos. [ScoreService.php](../../../../backend/app/Services/Learning/ScoreService.php) bloquea crear/actualizar notas cuando `grading_open=false` o el periodo está `CLOSED`. Cerrar año también cierra sus periodos; una regresión podría permitir notas tras el cierre o impedir correcciones autorizadas en un periodo abierto.
- **Integridad histórica:** mover fechas de año/periodos puede dejar incoherentes evaluaciones existentes; reabrir periodos sin autorización afectaría el historial académico. El servicio actual no ofrece reapertura ordinaria y conserva auditoría.
- **Datos compartidos del colegio:** los datos demo 2026 se usan por flujos dependientes y están explícitamente protegidos por las instrucciones de prueba E2E; no deben cerrarse o alterarse para ensayar esta auditoría.

## Recomendación

La configuración de años y periodos existente tiene validación, autorización, aislamiento y pruebas documentadas; por ello PE-02.1 es **PARCIALMENTE IMPLEMENTADO** respecto a la configuración académica en el SaaS. El procedimiento institucional completo y calendario oficial siguen **NO VERIFICADOS**. Antes de una mejora, el dueño debe confirmar calendario y autoridad de aprobación. No se identifica una brecha técnica que justifique cambiar contratos o reglas sin esa evidencia.
