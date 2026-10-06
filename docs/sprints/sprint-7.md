# Sprint 7 — Tareas, entregas, evaluaciones y calificaciones

## Alcance

Tareas, entregas con revisión y feedback, tipos de evaluación, evaluaciones, calificaciones e historial de notas. Integración dentro del curso con pestañas Aula Virtual, Tareas, Evaluaciones y Calificaciones. El estudiante dispone de Mis tareas, Mis entregas, Mis evaluaciones y Mis notas.

No incluye asistencia, justificaciones, solicitudes, comunicaciones, reportes finales ni funcionalidades de Sprint 8. No hay promedio automático ni ponderación calculada.

## Tablas y relaciones

| Tabla | Contenido |
| --- | --- |
| assignments | Curso, unidad opcional, título, descripción, instrucciones, due_at, max_score opcional, allow_late_submission, estado, publicación, creador, timestamps y deleted_at |
| assignment_submissions | Tarea, estudiante, intento, contenido/archivo privado, fecha, marca tardía, estado, feedback y revisor |
| assessment_types | Institución, nombre, código único institucional, peso opcional y estado |
| assessments | Curso, periodo académico, tipo, título, descripción, escala, peso opcional, fecha, estado y creador |
| scores | Evaluación, estudiante, nota, observaciones, calificador y fecha |
| score_history | Nota, valor anterior/nuevo, actor, motivo y fecha |

Las seis tablas tienen institution_id para reutilizar el aislamiento global existente. Las claves foráneas restringen borrado. La entrega tiene unicidad tarea/estudiante/intento; la nota tiene unicidad evaluación/estudiante. Se conservan registros e historial, sin endpoints de borrado.

La factory AssignmentFactory reutiliza CourseFactory. Se evita crear variantes redundantes de factories.

## Reglas de tareas y entregas

- Tareas: DRAFT → PUBLISHED → CLOSED; un borrador también puede cerrarse sin publicarse. CLOSED es inmutable.
- Crear y modificar exige un curso ACTIVE y docente asignado activo o administrador con el permiso correspondiente.
- La unidad opcional debe pertenecer al curso y no estar archivada.
- due_at es una fecha válida. El frontend convierte la hora local a ISO/UTC; la presentación usa la zona local del navegador.
- Solo se entregan tareas PUBLISHED de un curso accesible por matrícula APPROVED del estudiante.
- Pasado due_at se rechaza la entrega salvo allow_late_submission=true; se marca is_late y estado LATE. No se permiten entregas en tareas CLOSED.
- La entrega requiere texto o archivo. Estados: SUBMITTED, LATE, REVIEWED y RETURNED.
- Una entrega SUBMITTED/LATE puede editarse por su propietario mientras la tarea siga admitiendo entregas. La revisión no se sobrescribe.
- RETURNED permite un nuevo intento; REVIEWED no. Cada intento nuevo conserva el anterior y aumenta attempt bajo bloqueo/transacción.
- El docente revisa SUBMITTED/LATE e indica feedback y REVIEWED o RETURNED. Puede revisar entregas conservadas tras el cierre de la tarea mientras el curso siga activo.
- Mis entregas conserva el historial propio, incluso si la tarea se cerró, mientras el curso y la matrícula sigan siendo accesibles.

## Evaluaciones y notas

- Tipos demo: EXAM, PRACTICE, PROJECT y PARTICIPATION. El peso es opcional; se suministran por seeder y se consultan en un catálogo paginado. No se implementa un editor de tipos ni promedios automáticos.
- Evaluaciones: DRAFT, PUBLISHED, CLOSED. Requieren periodo del mismo año académico del curso y tipo activo de la misma institución.
- Crear/modificar exige curso activo. CLOSED no permite cambios ordinarios.
- Se califican evaluaciones PUBLISHED, con periodo grading_open=true y no CLOSED.
- Nota decimal con hasta dos decimales: 0–20, sin superar max_score de la evaluación. No se cambia la escala, el periodo ni el tipo una vez existen notas.
- El estudiante calificado debe tener perfil activo y matrícula APPROVED para el año, grado y sección del curso.
- La primera nota crea un historial con old_score=null. Toda modificación posterior, incluso de observaciones, exige reason y agrega historial con usuario y valor anterior/nuevo.
- Nota, historial y auditoría se guardan en una misma transacción. Si falla la auditoría, se revierten.
- Cerrar el periodo bloquea cambios, también para administradores. No hay excepción administrativa de reapertura desde este módulo.
- El estudiante ve únicamente sus notas de evaluaciones PUBLISHED; cerrar una evaluación retira esa evaluación y sus notas de las consultas estudiantiles. El personal autorizado conserva la consulta histórica.

## Autorización y arquitectura

Se reutilizan CourseAccess y ClassroomAccess, Sanctum, el contexto institucional y el middleware de cambio de contraseña. LearningAccess filtra cada consulta y comprueba la matrícula vigente; LearningPolicy autoriza las operaciones. LearningRequest valida el contrato final.

LearningService gestiona tareas/evaluaciones; SubmissionService gestiona entregas/revisión; ScoreService guarda notas e historial; LearningAudit registra eventos. Las escrituras críticas usan transacción y el bloqueo institucional existente; las notas bloquean también el periodo.

Permisos nuevos (15):

- assignments.view/create/update/publish/close
- submissions.view/review
- assessments.view/create/update/publish/close
- scores.view/create/update

ADMINISTRATOR recibe los quince, limitado a su institución. TEACHER los recibe con alcance exclusivo a sus cursos y asignaciones activas. STUDENT recibe assignments.view, submissions.view, assessments.view y scores.view; entregar exige además perfil estudiantil y acceso por matrícula. SECRETARY, TREASURY y GUARDIAN no reciben gestión ni consulta de estos recursos.

Se amplía únicamente la delegación existente de lecturas personales al dar de alta estudiantes: Secretaría puede crear el rol STUDENT con esos permisos propios sin recibir acceso al contenido del estudiante. Los demás controles de delegación se conservan.

Una lectura ajena devuelve 404; una escritura sin permiso devuelve 403; validaciones de negocio devuelven 422. No se aceptan institución, estado, autor, intento, fechas de revisión ni rutas privadas proporcionadas por el cliente.

## API REST

Prefijo /api/v1. Listados con page y per_page, 20 por defecto y máximo 100; filtro status donde corresponde. Respuestas incluyen capacidades calculadas por Laravel para los controles de UI.

| Método | Ruta |
| --- | --- |
| GET / POST | /courses/{course}/assignments |
| GET / PATCH | /assignments/{id} |
| POST | /assignments/{id}/publish |
| POST | /assignments/{id}/close |
| GET / POST | /assignments/{assignment}/submissions |
| GET / PATCH | /submissions/{id} |
| POST | /submissions/{id}/review |
| GET | /submissions/{id}/download |
| GET / POST | /courses/{course}/assessments |
| GET / PATCH | /assessments/{id} |
| POST | /assessments/{id}/publish |
| POST | /assessments/{id}/close |
| GET / POST | /assessments/{assessment}/scores |
| GET / PATCH | /scores/{id} |
| GET | /scores/{id}/history |
| GET | /courses/{course}/assessment-types |
| GET | /courses/{course}/assessment-periods |
| GET | /my/assignments |
| GET | /my/submissions |
| GET | /my/assessments |
| GET | /my/scores |

Entregas con archivos: multipart; editar usa POST con _method=PATCH. La revisión acepta status REVIEWED/RETURNED y feedback obligatorio. Registrar una nota acepta student_id, score y observations; modificar exige score y reason, sin permitir cambiar el estudiante.

## Archivos y privacidad

Se reutiliza MaterialFiles y el disco privado materials del Sprint 6, sin otro sistema de carga. Mismo límite de 2 MiB, lista permitida de extensiones y MIME detectado desde bytes. OOXML valida sus partes internas; ejecutables y extensiones no permitidas se rechazan.

Las rutas UUID se generan en el servidor y no salen en respuestas. Las descargas vuelven a comprobar propietario, docente/institución y matrícula vigente, y usan attachment, nosniff y cache privado no-store. El estudiante no descarga la entrega de otro estudiante.

Una transacción fallida descarta el archivo recién cargado. Los archivos anteriores se conservan privados; no hay purga ni pantalla de revisiones de archivos.

## Auditoría

CREATE, UPDATE, PUBLISH, CLOSE, SUBMIT, REVIEW, GRADE y SCORE_UPDATE. Se registra actor, institución, entidad, ID y metadatos anteriores/nuevos. No se guardan binarios, rutas, contenido de entrega, feedback, observaciones ni valores de notas en audit_logs. Los valores de notas y motivos permanecen en score_history, disponible únicamente mediante autorización sobre la nota.

## Demo y preparación

Con el Sprint 6 preparado, desde backend:

~~~text
php artisan migrate
php artisan migrate --env=testing
php artisan db:seed --class=LearningDemoSeeder
~~~

En esta estación usar ..\.tools\php\php.exe si no hay PHP en PATH. No reinstalar dependencias ni regenerar claves.

LearningDemoSeeder solo admite local/testing y conserva registros existentes:

- DEMO-MAT-2026, Matemática — curso demo.
- Ejercicios de números naturales (demo), publicada y con entregas tardías permitidas.
- Proyecto de operaciones (borrador demo), borrador.
- Una entrega ficticia de student@zarate.test.
- Práctica de números naturales (demo), publicada, max_score=20.
- Una nota ficticia 18 con registro inicial en score_history.
- Cuatro tipos de evaluación institucionales.

En la preparación inicial, si el primer periodo no cerrado del curso no tiene evaluaciones, el seeder abre grading_open mediante AcademicService y su auditoría. No reabre periodos con evaluaciones existentes ni sobrescribe bloqueos posteriores. Las reejecuciones no cambian notas, fechas de tareas o contraseñas.

Institución ZARATE. teacher@zarate.test, student@zarate.test, administrator@zarate.test. Contraseña inicial demo: ZarateDemo2026! (si no fue modificada). student2@zarate.test mantiene matrícula observada y no accede al curso.

## Prueba manual

1. Abrir http://localhost:5173/login e ingresar como teacher@zarate.test, institución ZARATE.
2. Mis cursos → buscar DEMO-MAT-2026 → Entrar al curso → Tareas.
3. Crear tarea: título, descripción, instrucciones, fecha límite local; unidad y nota máxima opcionales. Guardar y publicar, confirmando.
4. Cerrar sesión. Ingresar como student@zarate.test → Mis cursos → mismo curso → Tareas → Ver entregas → Entregar tarea.
5. Escribir respuesta y/o seleccionar archivo permitido de hasta 2 MiB. Enviar. Consultar Mis entregas para comprobar estado, intento y fecha.
6. Como docente, Tareas → Ver entregas → Revisar entrega. Agregar feedback y marcar Revisada o Devolver para un nuevo intento.
7. Como estudiante, consultar el feedback. Si fue devuelta y la tarea sigue abierta y dentro del plazo permitido, enviar un nuevo intento. El anterior permanece.
8. Como docente, Evaluaciones → Crear evaluación. Elegir periodo del año del curso y tipo, max_score=20; guardar y publicar.
9. En Evaluaciones → Ver notas, o Calificaciones → Ver notas, seleccionar Registrar nota. Elegir estudiante matriculado, nota 0–20 y observación.
10. Modificar nota requiere motivo. Abrir Historial para comprobar valor anterior, nuevo y actor.
11. Como estudiante, Mis evaluaciones y Mis notas muestran únicamente registros propios publicados. Mis tareas permite acceder también a las entregas.
12. Como administrador, Gestión Académica → Periodos: cerrar grading_open del periodo de una evaluación de prueba. Confirmar que crear/modificar notas se bloquea. No cerrar el periodo demo si se van a ejecutar los E2E.
13. Probar con student2@zarate.test: no debe aparecer el curso ni tareas/notas ajenas. Comprobar vista móvil y mensajes de error.

## Pruebas y validación

Diez casos Pest nuevos agrupan reglas principales: gestión docente, negativa por otro curso/institución, lectura estudiantil, IDOR de entrega/nota, entrega privada y reintentos, plazo, notas válidas/duplicadas/rango, periodo bloqueado, historial y rollback de nota/archivo.

Tres flujos Cypress nuevos: docente publica tarea y revisa entrega; estudiante entrega archivo desde el curso; docente registra nota y estudiante consulta la propia. Los datos de escritura E2E llevan nombres únicos y no alteran las tareas/notas demo.

~~~text
cd backend
php vendor/bin/pest --compact
php vendor/bin/pint --test
cd ../frontend
npm run lint
npm run build
cd ../e2e
npm run typecheck
npm test
~~~

## Resultados finales

| Comprobación | Resultado |
| --- | --- |
| Pest nuevas | **10** |
| Total Pest | **286 aprobadas** |
| Cypress nuevas | **3** |
| Total Cypress | **34 aprobadas en 9 especificaciones** |
| Total general | **320 pruebas distintas aprobadas** |
| Pint | Aprobado |
| ESLint | Aprobado |
| TypeScript frontend y Cypress | Aprobado |
| Build de producción | Aprobado |

La regresión completa Pest aprobó 286 pruebas. Después de la normalización UTC y el refuerzo del caso IDOR entre estudiantes aprobados del mismo curso, los 10 casos de Sprint 7 se reejecutaron: 100 aserciones, todos aprobados. No se cuentan las reejecuciones como pruebas nuevas.

La ejecución final completa de Cypress aprobó las 34 pruebas, sin fallos, pendientes ni omisiones. Incluye los ocho archivos previos y learning.cy.ts. Se verificaron la publicación antes de abrir notas, la entrega privada, revisión y visualización de la nota propia.

LearningDemoSeeder se ejecutó dos veces satisfactoriamente y conservó la demo existente. No quedan fallos conocidos ni pendientes dentro del alcance. **Sprint 7 cerrado**; no se implementó Sprint 8.

## Próximo sprint

Definir el alcance de asistencia sobre matrícula y acceso a curso existentes. No se implementa asistencia ni otra funcionalidad del Sprint 8 aquí.
