# Sprint 3 — Gestión de personas

## Objetivo y alcance

Gestión institucional de estudiantes, docentes, padres/apoderados y relaciones familiares.
Se reutilizan usuarios, autenticación, contexto institucional, permisos, auditoría e identidad visual.
No se implementan matrículas, cursos, notas, asistencia, aula virtual, tareas, solicitudes, pagos ni reportes finales.

## Tablas y relaciones

Migración: `2026_10_01_170000_create_people.php`.

| Tabla | Relaciones | Unicidad e historial |
|---|---|---|
| students | institution_id, user_id | usuario único; código y documento únicos por institución; soft deletes |
| teachers | institution_id, user_id | usuario único; código y documento únicos por institución; soft deletes |
| guardians | institution_id, user_id | usuario único; documento único por institución; soft deletes |
| student_guardian | institution_id, student_id, guardian_id | par único; máximo un principal por estudiante |

Los perfiles incluyen los campos personales solicitados. Documentos, códigos y estados se validan en Laravel.
Se añade institution_id al vínculo familiar para reutilizar el scope y reforzar el aislamiento con FK compuestas hacia ambos perfiles.
La columna generada interna primary_student_id y su índice único impiden dos principales simultáneos. No se expone en JSON.
Las FK restringen borrados. El único DELETE de API elimina exclusivamente el vínculo familiar, dentro de una transacción; no elimina ninguna persona ni cuenta.
Los perfiles archivados conservan la reserva de su usuario, código y documento.
Documento único por institución **dentro de cada tipo de perfil**. Un docente y apoderado pueden representar a la misma persona con una sola cuenta y roles compatibles.

## Estados y documentos

Enums:
- StudentStatus: ACTIVE, INACTIVE, GRADUATED, WITHDRAWN.
- TeacherStatus: ACTIVE, INACTIVE, ON_LEAVE.
- GuardianStatus: ACTIVE, INACTIVE.
- FamilyRelationship: FATHER, MOTHER, GUARDIAN, GRANDPARENT, OTHER.
- DocumentType: DNI, CE, PASSPORT.
- PersonGender: FEMALE, MALE, OTHER, NOT_SPECIFIED; también nullable.

DNI exige 8 dígitos. CE/PASSPORT admiten letras, números y guiones, hasta 30 caracteres.
La unicidad del documento no se elude cambiando su tipo.
Nacimiento no puede estar en el futuro; ingreso no puede precederlo. Fechas en formato YYYY-MM-DD.
Estado del perfil y estado de cuenta son independientes: desactivar un perfil conserva acceso a su cuenta y datos propios; bloquear acceso se realiza en Usuarios con los permisos del Sprint 1.
Cualquier transición del estado de una persona exige su permiso disable, incluso si se intenta por PATCH. Crear un perfil en estado distinto de ACTIVE también lo exige.
No se ofrece DELETE/restauración de perfiles por API.

## Creación transaccional y reutilización de cuentas

Flujo recomendado: una operación administrativa crea User + perfil + rol fijo + auditoría dentro de una transacción.
El formulario reúne datos de acceso y del perfil en la misma pantalla.
La contraseña inicial la define el operador, con las reglas existentes: mínimo 12 caracteres, mayúsculas, minúsculas y números; se guarda únicamente con hash.
La cuenta nueva siempre tiene must_change_password=true. No se devuelve contraseña, ni hash, ni tokens.
No se envían correos reales.

Alternativa: enviar user_id de una cuenta existente de la misma institución, activa, con el rol correspondiente y sin ese perfil (incluidos archivados).
No se cambia su contraseña ni sus roles ni se duplica la cuenta.
Se admiten combinaciones de STUDENT/TEACHER/GUARDIAN si el rol requerido ya existe; no se vinculan cuentas con roles administrativos incompatibles.
Por ejemplo, una cuenta TEACHER + GUARDIAN puede tener ambos perfiles.
El selector muestra solo cuentas compatibles y tiene búsqueda y paginación.
Si el correo ya existe, la creación se rechaza: nunca se fusionan cuentas por correo automáticamente.

Roles fijos por tipo: students → STUDENT; teachers → TEACHER; guardians → GUARDIAN.
El operador no puede elegir roles ni permisos desde el payload de personas.
La creación tampoco puede delegar un rol personalizado que contenga permisos que el operador no posee.
Las modificaciones de roles desde Usuarios no pueden retirar el rol requerido por un perfil existente.
Una vez vinculado, user_id es inmutable.
Los datos de cuenta existentes se editan en Usuarios o Mi perfil conforme a sus permisos; actualizar un perfil de persona no permite cambiar credenciales, nombres o roles de otra cuenta.

## Servicios, aislamiento y Policies

PersonService coordina altas, reutilización, cambios y desactivaciones.
FamilyService coordina vínculos, principal y detach.
Cada operación bloquea la institución dentro de una transacción; las operaciones familiares también bloquean el estudiante.
Fallos de perfil, asignación de rol o auditoría revierten todas las escrituras, incluida una cuenta nueva.
Cambiar principal desmarca y audita al anterior antes de guardar el nuevo; todo se confirma conjuntamente.

Person, Student, Teacher y Guardian reutilizan BelongsToInstitution.
La relación de cuenta se verifica a nivel de modelo, y no puede reasignarse.
StudentGuardian verifica ambos padres y usa FK compuestas que impiden vínculos cruzados también en MySQL.
Los scopes se aplican en listados, detalles, filtros y relaciones; IDs ajenos responden 404 o error de validación sin revelar datos.
PersonPolicy y FamilyPolicy controlan los accesos; Form Requests validan entradas.
Todas las rutas mantienen auth:sanctum, institution y password.changed.
No se confía en institution_id, roles, permissions ni campos adicionales enviados por React.

## Permisos

14 nuevos, 46 acumulados:

- students.view/create/update/disable
- teachers.view/create/update/disable
- guardians.view/create/update/disable
- student-guardians.view/manage

| Rol | Acceso inicial |
|---|---|
| ADMINISTRATOR | Todos |
| SECRETARY | Ver/crear/actualizar estudiantes y apoderados; consultar docentes; consultar y gestionar relaciones |
| TEACHER | students.view, dentro de la institución |
| STUDENT | Su perfil mediante endpoints propios |
| GUARDIAN | Su perfil y relaciones propias |
| TREASURY | Sin permisos de personas |

SECRETARY no puede desactivar ni cambiar estados sensibles. No necesita users.create o roles.manage para el alta controlada de estudiantes/apoderados; el servicio fija el rol y limita lo delegable.
La consulta docente es institucional en este sprint; no hay asignaciones de curso que permitan un filtro académico todavía.
Lectores sin permiso update reciben documento enmascarado y no reciben nacimiento, género, dirección, correo ni teléfono privados. El titular sí puede consultar sus propios datos.
Los vínculos muestran nombres, IDs, código de estudiante, estados y atributos de relación, sin documentos ni direcciones de los familiares.
PeoplePermissionSeeder añade permisos sin eliminar personalizaciones existentes.

## API REST

Prefijo /api/v1:

| Método | Ruta | Uso |
|---|---|---|
| GET | /students, /teachers, /guardians | Listados paginados |
| POST | /students, /teachers, /guardians | Crear cuenta + perfil o reutilizar user_id |
| GET | /{tipo}/{id} | Detalle autorizado |
| PUT/PATCH | /{tipo}/{id} | Actualizar perfil |
| POST | /{tipo}/{id}/disable | Desactivar conservando historial |
| GET | /{tipo}/accounts | Cuentas compatibles, requiere permiso create del tipo |
| GET | /students/{student}/guardians | Vínculos del estudiante, paginados |
| POST | /students/{student}/guardians | Asociar apoderado |
| PATCH | /students/{student}/guardians/{guardian} | Actualizar vínculo/principal |
| DELETE | /students/{student}/guardians/{guardian} | Eliminar solo el vínculo |
| GET | /guardians/{guardian}/students | Estudiantes asociados, paginados |
| GET | /profile/people | Perfiles del usuario autenticado |
| GET | /profile/family | Vínculos propios, paginados |

Filtros: search, status, document_number, student_code o teacher_code según tipo; page y per_page (1–100, predeterminado 15).
search consulta nombres, apellidos, nombre completo, documento y código. Orden de perfiles por ID descendente.
Los filtros no cambian la institución de la consulta.
Los endpoints /profile ignoran IDs de otras personas enviados como query: siempre usan el usuario autenticado.
No se amplió /auth/me para devolver datos privados de personas en recursos usados por otros endpoints.

Ejemplo de alta (datos exclusivamente ficticios):
```json
{
  "account": {
    "first_name": "Estudiante",
    "last_name": "Ficticio",
    "email": "ejemplo@example.test",
    "password": "InitialPass123!"
  },
  "student_code": "TEST-STU-100",
  "document_type": "PASSPORT",
  "document_number": "TEST-DOC-100",
  "birth_date": "2012-06-15",
  "admission_date": "2026-03-02"
}
```

Para reutilizar: reemplazar account por user_id. Son alternativas mutuamente excluyentes.
El objeto account solo admite first_name, last_name, email, password y phone.
Las respuestas nunca devuelven contraseña ni remember_token.
422 para duplicados/validación, 403 sin permiso, 404 IDs ajenos/inexistentes y 401 sin sesión.

## Relaciones familiares

Relación N:M; el mismo apoderado puede tener varios estudiantes y viceversa.
No se duplica el par estudiante/apoderado.
Se permite cero principales; como máximo uno. Al eliminar al principal no se promueve automáticamente otro.
Nuevas asociaciones o designaciones de principal requieren perfiles ACTIVE.
can_pick_up y receives_notifications son datos operativos para módulos futuros; no disparan notificaciones.
El detach conserva personas, cuentas y auditoría.

## Auditoría

AuditAction se amplía con RELATE y UNRELATE.
Se registran CREATE, UPDATE, DISABLE, RELATE y UNRELATE; los cambios del principal anterior también generan UPDATE.
PeopleAudit usa una lista explícita de campos operativos: IDs, institución, usuario, estado y atributos del vínculo.
No registra contraseñas, hashes, nombres, documentos, direcciones, nacimiento ni teléfonos.
old_values/new_values conservan el estado operativo anterior/posterior; una modificación de datos personales genera UPDATE sin copiar esos datos privados.
La auditoría pertenece a la misma transacción que la operación.

## Frontend

/app/people: menú de personas.
 /app/people/students, /app/people/teachers y /app/people/guardians: pantallas administrativas protegidas.
Se reutiliza AppLayout y la paleta naranja/beige/blanco/café.
PeoplePage, PersonForm, PeopleLookup y FamilyPanel comparten tablas, filtros, paginación, estados, detalle, alta y edición.
El formulario permite cuenta nueva o cuenta existente; muestra errores de validación.
El detalle del estudiante incorpora apoderados y gestión de relación principal, retiro y notificaciones.
El detalle de apoderado muestra estudiantes relacionados.
Mi perfil incorpora los datos propios y sus relaciones, sin controles administrativos.
La búsqueda de cuentas/apoderados espera 250 ms de pausa de escritura para evitar una petición por tecla.
No aparecen cursos, matrículas ni información académica inventada.

## Factories y datos demo

Factories StudentFactory, TeacherFactory y GuardianFactory crean cuentas y roles válidos dentro de un InstitutionContext explícito.
Usan documentos TEST y datos ficticios. La cuenta puede sobrescribirse con un usuario existente de la misma institución.
PeopleDemoSeeder solo permite local/testing; necesita la institución ZARATE y roles del Sprint 1.
Es reproducible y no sobrescribe perfiles existentes ni cambia contraseñas de cuentas existentes.

Desde backend:
```text
php artisan migrate
php artisan db:seed --class=PeopleDemoSeeder
php artisan migrate --env=testing
```

Datos:
- student@zarate.test → DEMO-STU-01.
- student2@zarate.test → DEMO-STU-02.
- teacher@zarate.test → DEMO-TCH-01.
- guardian@zarate.test y guardian2@zarate.test → dos apoderados ficticios.
- Ambos apoderados se relacionan con los dos estudiantes; el primero es principal cuando no existe ya otro.
- Documentos PASSPORT con prefijo DEMO, no documentos personales reales.
- Contraseña inicial de cuentas demo nuevas: ZarateDemo2026!.
- Las cuentas demo omiten el cambio inicial exclusivamente para pruebas; las altas administrativas reales lo requieren.
- El seeder no restaura perfiles archivados ni sobrescribe contraseñas modificadas.

## Pruebas y controles

Pest usa únicamente zarate_test, con DatabaseTransactions.
Cubre creación por tipo, cuenta+perfil, reutilización, duplicados, roles incorrectos, mass assignment, estados, validación de fechas/documentos, hash, aislamiento, IDOR, soft deletes, permisos y perfiles propios.
Prueba rollback de cuenta/rol/perfil y rollback del cambio de principal ante fallo de auditoría.
Comprueba restricciones MySQL del principal y FK institucionales, relaciones N:M, detach sin borrar personas, privacidad y seeders repetidos.

Cypress agrega flujos de estudiantes, docentes, apoderados, vínculo principal, búsqueda, filtros, errores y móvil.
Comprueba perfiles propios de STUDENT y GUARDIAN sin administración de personas.
Los datos E2E usan códigos y correos únicos con prefijo E2E; se conservan sin tocar seeds esenciales.
Se ejecuta la regresión completa de Sprints 1 y 2.

Controles:
```text
cd backend
php vendor/bin/pint --test
php vendor/bin/pest
cd ../frontend
npm run lint
npm run build
cd ../e2e
npm run typecheck
npm test
```

## Prueba manual

1. Abrir http://localhost:5173/login.
2. Ingresar con ZARATE, administrator@zarate.test y ZarateDemo2026!.
3. Abrir Personas → Estudiantes → Nuevo estudiante; completar cuenta y datos ficticios.
4. Buscar el código, abrir detalle y editar datos del perfil.
5. Crear un apoderado; volver al detalle del estudiante y usar Asociar apoderado.
6. Seleccionar parentesco, principal y atributos; guardar. Asociar otro y cambiar principal para comprobar exclusividad.
7. Revisar los estudiantes asociados desde el detalle del apoderado.
8. Crear y consultar un docente; no hay asignación de cursos.
9. Revisar Auditoría y probar desactivación sobre un perfil de prueba.
10. Cerrar sesión e ingresar como student@zarate.test o guardian@zarate.test; abrir Mi perfil y comprobar los datos propios.
11. Con secretary@zarate.test comprobar altas autorizadas y ausencia de desactivación.
12. Para una cuenta creada por la interfaz, probar el cambio obligatorio de contraseña en su primer ingreso.

## Integraciones y límites

Sprint 1 se amplía solo para registrar permisos/rutas, relaciones Eloquent de User, conservar roles exigidos por perfiles y mostrar información propia.
La expectativa de cantidad de permisos pasa de 32 a 46. Autenticación y contexto permanecen intactos.
Sprint 2 no cambia sus reglas ni entidades.
No se implementa Sprint 4. La siguiente definición puede abordar matrículas con año, grado y sección, cupos, estados e historial, usando la estructura y personas existentes.
## Validación final

| Comprobación | Resultado |
| --- | --- |
| Pest, regresión completa | 231 aprobadas, 1097 aserciones |
| Cypress, regresión completa | 22 aprobadas en 5 especificaciones |
| Total acumulado | 253 pruebas aprobadas |
| Nuevas pruebas del Sprint 3 | 79 Pest + 5 Cypress = 84 |
| Laravel Pint | Aprobado |
| ESLint | Aprobado |
| TypeScript frontend y Cypress | Aprobado |
| Build de producción | Aprobado |

La regresión incluye los sprints anteriores. No quedan fallos ni pendientes funcionales conocidos dentro del alcance de este sprint. Las funcionalidades de Sprint 4 quedan fuera del alcance.
