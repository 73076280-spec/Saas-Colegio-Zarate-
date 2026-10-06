# Sprint 5 — Cursos y asignación docente

## Alcance

Asignaciones docentes, cursos, portales de docente/estudiante, roster de matrículas aprobadas y auditoría. No incluye unidades, materiales, tareas, entregas, notas ni asistencia. Aula Virtual es únicamente un espacio informativo sin acciones funcionales.

## Entidades y relaciones

- **teacher_assignments**: institution_id, academic_year_id, teacher_id, subject_id, grade_level_id, section_id, status y timestamps. Estados ACTIVE/INACTIVE.
- **courses**: las mismas referencias académicas, teacher_assignment_id nullable, name, code, description, status, timestamps y soft delete.
- Course pertenece a TeacherAssignment, Teacher, Subject, AcademicYear, GradeLevel y Section.
- TeacherAssignment expone courses como relación Eloquent; la unicidad de equivalencia permite un curso por combinación, incluso si fue archivado.
- No se crea otra tabla de inscripción: el acceso y roster se derivan de enrollments.

Las claves foráneas restringen eliminaciones físicas. El modelo bloquea forceDelete de cursos. No hay endpoints DELETE. Los códigos y equivalencias de cursos archivados permanecen reservados.

## Coherencia y unicidad

Toda referencia se consulta en el contexto institucional. Docente, asignatura, nivel, grado y sección deben estar ACTIVE al crear o activar; el año no puede estar CLOSED. La sección debe corresponder al año y grado.

Equivalencia: institución + año + asignatura + grado + sección + docente. Incluye docente para permitir varios docentes de una asignatura en la misma sección, mediante asignaciones/cursos diferenciados. Cada docente puede tener muchas asignaturas y secciones. La base de datos protege esta unicidad; course.code es único por institución/año.

La creación del curso exige una asignación ACTIVE con las mismas referencias. Si teacher_assignment_id se omite, el servidor resuelve esa asignación; no la crea implícitamente. El campo nullable permite compatibilidad del esquema, pero la API de creación siempre vincula una asignación válida.

Un curso no cambia de estructura/docente después de crearse. Una asignación vinculada a cursos tampoco cambia sus referencias: se crea otra para una nueva combinación, conservando historia. Nombre, código y descripción pueden editarse mientras el curso no esté CLOSED.

No se deshabilita una asignación con cursos ACTIVE. Primero se inactivan o cierran sus cursos. La reactivación de asignaciones vuelve a validar sus referencias.

## Estados y operaciones

```text
Asignación: ACTIVE <-> INACTIVE

Curso:
DRAFT -> ACTIVE -> INACTIVE -> ACTIVE
DRAFT / ACTIVE / INACTIVE -> CLOSED
```

El curso siempre nace DRAFT. Activar requiere courses.activate y valida nuevamente la coherencia y asignación. Inactivar requiere courses.update. Cerrar requiere courses.close y es terminal: no se edita ni reactiva un curso cerrado. Cerrar/inactivar siguen siendo posibles aunque un padre haya quedado inactivo o el año se haya cerrado.

Las escrituras usan transacciones y el bloqueo institucional existente, con tres intentos ante deadlock. La comprobación de duplicados, el cambio y la auditoría forman una operación atómica.

## Acceso y permisos

Nueve permisos nuevos; total acumulado de permisos: 67.

| Rol | Asignaciones | Cursos / roster |
| --- | --- | --- |
| ADMINISTRATOR | view/create/update/disable | view/create/update/activate/close y roster |
| SECRETARY | Consulta | Consulta y roster |
| TEACHER | Sin gestión administrativa | Solo cursos de su perfil docente activo y asignación activa; roster de esos cursos |
| STUDENT | Sin acceso | Solo cursos ACTIVE derivados de su matrícula APPROVED |
| GUARDIAN | Sin acceso añadido en este sprint | Sin acceso añadido |
| TREASURY | Sin acceso añadido | Sin acceso académico añadido |

Secretaría mantiene consulta, sin nuevas facultades de gestión. No se conceden courses.view ni teacher-assignments.view a docentes/estudiantes: estos permisos habilitan consulta administrativa general. Sus portales usan acceso por relación y Policies.

El acceso estudiantil se resuelve en cada consulta con el perfil Student ACTIVE del usuario, curso ACTIVE, asignación ACTIVE y matrícula no archivada APPROVED de la misma institución, año, grado y sección. Cancelar la matrícula revoca el acceso en la siguiente consulta; no existe una lista paralela que sincronizar. Matrícula pendiente, observada, rechazada, cancelada, inexistente o de otra sección no habilita el curso.

Docentes ven sus cursos, incluso borradores/cerrados para consultar su información, mientras su perfil y asignación estén activos. No ven cursos de otros docentes. El roster exige autorización propia: estudiantes no acceden a nombres ni códigos de sus compañeros. Solo muestra código y nombre del estudiante y código de matrícula aprobada; excluye documentos, contactos y datos financieros.

Los accesos a registros ajenos devuelven 404. Los listados personales vacíos no revelan otros registros. La consulta personal /my/courses no se convierte en consulta administrativa por tener courses.view.

## API

Bajo /api/v1, con Sanctum, institución validada y contraseña inicial cambiada.

| Método | Ruta |
| --- | --- |
| GET / POST | /teacher-assignments |
| GET / PATCH | /teacher-assignments/{id} |
| POST | /teacher-assignments/{id}/disable |
| GET / POST | /courses |
| GET / PATCH | /courses/{id} |
| POST | /courses/{id}/activate |
| POST | /courses/{id}/close |
| GET | /teachers/{teacher}/courses |
| GET | /students/{student}/courses |
| GET | /my/courses |
| GET | /courses/{id}/students |
| GET | /teaching-options |

Listados: academic_year_id, teacher_id, subject_id, grade_level_id, section_id, status, search, page y per_page (1–100). Search consulta asignatura/docente y, en cursos, nombre/código. Roster y opciones también paginan. Opciones admite kind=teachers/subjects/years/grades/sections; grado y sección dependen del año.

Crear asignación:
```json
{"academic_year_id":1,"teacher_id":1,"subject_id":1,"grade_level_id":1,"section_id":1}
```

Crear curso: las mismas referencias más name y code; description y teacher_assignment_id son opcionales. No se acepta institution_id ni status inicial desde el cliente.

## Organización técnica y auditoría

- TeachingRequest / TeachingListRequest validan entradas.
- CoursePolicy / TeacherAssignmentPolicy autorizan registros y roster.
- TeachingService concentra coherencia, creación, edición, activación, cierre/deshabilitación y transacciones.
- CourseAccess concentra consulta personal, acceso derivado y roster.
- TeachingResource expone referencias mínimas, sin serializar perfiles personales completos.

Auditoría: CREATE, UPDATE, ACTIVATE, CLOSE y DISABLE, con usuario, institución, fecha y old_values/new_values. Se guardan identificadores, estado y metadatos del curso; se excluyen credenciales, documentos personales y descripción libre. Un fallo de auditoría revierte la escritura.

## Frontend

Gestión Académica incluye Asignación docente y Cursos. Los listados administrativos tienen búsqueda, filtros dependientes, paginación, formularios, loading, vacíos, errores y acciones según permisos/estado.

Mis cursos muestra tarjetas para docente/estudiante. El detalle incluye información académica y un placeholder de Aula Virtual. Solo docentes autorizados y personal con consulta general acceden al roster.

Se conserva la paleta institucional y responsividad. Se reutiliza el selector paginado anterior con endpoint configurable; su comportamiento predeterminado sigue siendo el de matrícula. Los botones de paginación usan type=button para no enviar formularios accidentalmente.

## Factories, seeds y demo

TeacherAssignmentFactory y CourseFactory generan estructura ficticia coherente en contexto institucional, reutilizando las fixtures académicas existentes.

Con los seeds de los sprints anteriores preparados:
```text
cd backend
php artisan migrate
php artisan db:seed --class=CourseDemoSeeder
php artisan migrate --env=testing
```

CourseDemoSeeder solo funciona en local/testing. Es transaccional e idempotente y no sobrescribe datos previamente modificados.

- Institución ZARATE.
- Curso DEMO-MAT-2026: Matemática — curso demo, ACTIVE.
- Docente teacher@zarate.test, asignatura MAT-001.
- Año/grado/sección derivados de la matrícula APPROVED de student@zarate.test.
- student2@zarate.test conserva su matrícula observada y no obtiene acceso al curso.
- Contraseña demo existente: ZarateDemo2026!, salvo cambio previo. El seed no cambia contraseñas.

## Pruebas principales

Se añaden únicamente **12 casos Pest**, sin multiplicar variantes como casos independientes. Cubren creación/duplicados/coherencia, estados, inmutabilidad, acceso docente, acceso estudiantil y revocación, negativa sin aprobación/otra sección, aislamiento/IDOR, autorización, filtros y rollback de auditoría.

Se añaden únicamente **3 flujos Cypress**:

1. Administración crea asignación y curso, activa/cierra y verifica responsive.
2. Docente consulta su curso y roster aprobado, sin gestión.
3. Estudiante matriculado consulta su curso y estudiante observado queda excluido.

Datos de escritura E2E aislados con prefijos/sufijos únicos; las consultas de portales usan los seeds ficticios sin modificarlos. Interceptores registrados una vez por prueba y esperas sobre respuestas HTTP. Las reejecuciones no se suman al contador.

```text
cd backend
php vendor/bin/pest --compact
php vendor/bin/pint --test
cd ../frontend
npm run lint
npm run build
cd ../e2e
npm run typecheck
npm test
```

## Resultados finales

| Comprobación | Resultado |
| --- | --- |
| Pest, regresión completa | 264 aprobadas, 1435 aserciones |
| Pest nuevas | 12 casos principales |
| Cypress, regresión completa | 28 aprobadas en 7 especificaciones |
| Cypress nuevas | 3 flujos principales |
| Total acumulado | 292 pruebas distintas aprobadas |
| Incremento del sprint | 15 pruebas, sin contar reejecuciones |
| Pint | Aprobado |
| ESLint | Aprobado |
| TypeScript frontend y Cypress | Aprobado |
| Build de producción | Aprobado |

La regresión completa de Cypress terminó sin fallos, omisiones ni pendientes. Pest incluye todos los sprints anteriores. CourseDemoSeeder se ejecutó nuevamente de forma satisfactoria conservando el curso existente. No quedan fallos conocidos dentro del alcance de Sprint 5.


## Prueba manual

1. Abrir http://localhost:5173/login, institución ZARATE, administrator@zarate.test y contraseña demo.
2. Gestión Académica -> Asignación docente -> Crear asignación: elegir docente/asignatura activos, año, grado y sección coherentes, y guardar. Usar una combinación distinta de la demo para evitar el duplicado esperado.
3. Cursos -> Crear curso: repetir la combinación, indicar nombre y código único; guardar en borrador.
4. Detalle -> Activar curso; confirmar. Revisar filtros y estado.
5. Para deshabilitar la asignación, primero inactivar/cerrar el curso. Revisar los eventos en Auditoría.
6. Cerrar sesión e ingresar como teacher@zarate.test -> Mis cursos -> Matemática — curso demo -> Entrar al curso. Comprobar roster aprobado y ausencia de gestión.
7. Ingresar como student@zarate.test -> Mis cursos. Comprobar curso demo y ausencia de roster de compañeros.
8. Ingresar como student2@zarate.test: no debe ver el curso con su matrícula observada.
9. Como secretary@zarate.test, comprobar consulta sin botones de creación/activación.

## Próximo sprint

Definir el alcance del Aula Virtual sobre cursos y permisos existentes. Materiales, unidades, tareas, entregas, notas y asistencia no se implementan en este sprint.
