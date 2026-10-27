# Sprint 1 — Núcleo SaaS, autenticación y autorización

## Objetivo y alcance

Implementar instituciones, cuentas institucionales, seis roles, once permisos, autenticación SPA, perfil, aislamiento, auditoría de acceso y dashboards base. Se conserva la identidad visual de Iteración 0. No se implementan módulos académicos, pagos ni vínculos familiares.

## Entidades y migraciones

`2026_10_01_150000_create_saas_core.php` crea institutions y audit_logs y adapta users.
Institutions incluye nombre, razón social, código único, identificación tributaria, correo, teléfono, dirección, logo, estado, timestamps y soft deletes.
Users tiene institution_id obligatorio con FK, nombres, apellidos, correo único compuesto por institución, contraseña con hash, teléfono, avatar, estado, cambio obligatorio de contraseña, último acceso, verificación de correo, remember_token y soft deletes.
Se conserva la infraestructura previa de Sanctum y Spatie teams con institution_id.
Enums PHP: InstitutionStatus (ACTIVE/INACTIVE), UserStatus (ACTIVE/INACTIVE/BLOCKED), RoleName y AuditAction.

La migración conserva las cuentas del scaffold, si existen, asignándolas a ZARATE y separando su nombre. No ejecutar rollback sobre datos reales sin respaldo y un plan de restauración.

## Autenticación

Sanctum usa cookies de sesión HttpOnly y CSRF; React no almacena tokens en localStorage.
El cliente pide primero GET /sanctum/csrf-cookie y envía X-XSRF-TOKEN en las mutaciones.
Login requiere institution_code, email y password, porque un correo puede existir en varias instituciones.
La institución se elige durante la autenticación; después se obtiene exclusivamente del usuario autenticado.
Los errores de credenciales son genéricos (422), incluso para cuentas inexistentes o inactivas.
Login regenera la sesión y actualiza last_login_at junto con LOGIN dentro de una transacción.
Logout registra LOGOUT e invalida la sesión.
El cambio de contraseña verifica la contraseña actual, exige confirmación, mínimo 12 caracteres con mayúsculas, minúsculas y números, y rechaza reutilizar la contraseña actual.
Se revocan tokens personales existentes y las sesiones anteriores se invalidan por hash de contraseña.
No hay emisión de tokens personales, registro público ni recuperación de contraseña en este sprint.

Límites: login 5 intentos/minuto por institución+correo+IP y 20/minuto por IP; cambio de contraseña 6/minuto.
Cuentas INACTIVE/BLOCKED, usuarios eliminados e instituciones inactivas/eliminadas pierden acceso.
Las cuentas nuevas exigen cambiar su contraseña antes de usar los endpoints de negocio.

## Contexto y aislamiento institucional

InstitutionContext es un servicio scoped. ResolveInstitution establece el contexto y el team de Spatie después de autenticar y antes del route model binding; lo limpia en finally.
InstitutionScope y BelongsToInstitution filtran usuarios, roles administrativos y auditoría. Sin contexto las consultas no devuelven registros; las escrituras requieren contexto. institution_id es inmutable.
El provider InstitutionUserProvider omite únicamente ese scope al recuperar la identidad de sesión, conservando SoftDeletes; la ruta pasa después por ResolveInstitution.
El login hace una búsqueda explícita por institución y correo.
No se aceptan institution_id del body ni headers para cambiar contexto.

Spatie mantiene su modelo interno Role sin scope para construir correctamente su caché global de permisos. Sus relaciones de usuario se filtran por teams.
App/Models/Role agrega scope para los endpoints administrativos. Esta separación evita que la caché se construya solo con los roles de la primera institución.
Las pruebas comprueban accesos alternados entre dos instituciones con permisos diferentes.

Los controladores usan Form Requests y Policies. Servicios concentran autenticación, usuarios y auditoría.
UserService usa transacciones y bloquea la fila de institución para proteger al último administrador ante operaciones concurrentes.
Las consultas Query Builder, SQL directo, actualizaciones masivas y trabajos futuros deben establecer y validar contexto explícitamente: un global scope Eloquent no sustituye esas garantías.
No existe superadministrador global ni selector de institución después del login.

## Roles y permisos

ADMINISTRATOR: todos los permisos.
SECRETARY, TREASURY, TEACHER, STUDENT y GUARDIAN: profile.view y profile.update inicialmente.
No se asignan permisos académicos inexistentes.

Permisos: users.view, users.create, users.update, users.disable, roles.view, roles.manage, institutions.view, institutions.update, profile.view, profile.update, audit.view.

No se pueden delegar permisos que el actor no posea. Asignar roles exige roles.manage.
Cambiar el estado de otra cuenta exige users.disable, además de users.update si se usa PATCH.
Se protege al último administrador activo y se impide desactivar la propia cuenta.
Los permisos del rol ADMINISTRATOR no se editan desde la API.
El perfil solo permite nombres, apellidos y teléfono; no puede modificar rol, institución, correo ni estado.

## Endpoints

Prefijo /api/v1:

| Método | Ruta | Protección |
|---|---|---|
| POST | /auth/login | CSRF + rate limit |
| POST | /auth/logout | Sesión + contexto |
| GET | /auth/me | Sesión + contexto |
| POST | /auth/change-password | Sesión + contexto + rate limit |
| GET | /users | users.view |
| POST | /users | users.create; roles.manage para asignar roles |
| GET | /users/{user} | users.view + misma institución |
| PUT/PATCH | /users/{user} | users.update + misma institución |
| POST | /users/{user}/disable | users.disable + misma institución |
| GET | /institutions | institutions.view; solo institución actual |
| GET | /institutions/{institution} | institutions.view + misma institución |
| PUT/PATCH | /institutions/{institution} | institutions.update + misma institución |
| GET | /roles | roles.view |
| GET | /permissions | roles.view |
| PUT | /roles/{role}/permissions | roles.manage + misma institución |
| GET | /profile | profile.view |
| PATCH | /profile | profile.update |
| GET | /audit-logs | audit.view; paginado y filtrado por institución |

Todas las rutas de negocio requieren completar el cambio de contraseña inicial.
Las instituciones se provisionan con seeders/contexto administrativo explícito; no hay alta pública, borrado ni cambio de institución por API.
Continúan públicos GET /api/health y GET /sanctum/csrf-cookie.
Respuestas: 401 sin sesión o cuenta no disponible, 403 sin permiso, 404 para usuario/rol de otra institución, 419 CSRF, 422 validación, 429 límite de intentos.

## Auditoría

audit_logs incluye institución, usuario nullable, acción, entidad e ID, old_values/new_values JSON nullable, IP, user agent y created_at.
Este sprint registra únicamente LOGIN y LOGOUT exitosos.
No registra contraseñas, tokens ni cookies.
CREATE, UPDATE, DELETE, APPROVE, REJECT y PUBLISH quedan definidos en AuditAction para módulos futuros.
Lectura paginada institucional; no se ofrece edición o eliminación de auditoría.

## Frontend

/login y /app con React Router, AuthProvider y protección de sesión/permisos.
/app selecciona el dashboard según los roles del servidor (prioridad ADMINISTRATOR, SECRETARY, TREASURY, TEACHER, STUDENT, GUARDIAN).
Seis títulos y mensajes específicos, un solo AppLayout con sidebar, header, institución, nombre, rol, iniciales y logout.
Rutas adicionales: /app/profile, /app/change-password, /app/users, /app/institution, /app/roles, /app/audit.
Las rutas se protegen en React para la experiencia; Laravel realiza la autorización efectiva.
La pantalla técnica permanece en /.
Se mantienen naranja #D98A3A, hover #E7A55A, beige #F3E6D3, fondo #FAF6EF, blanco #FFFFFF, café #B88A64/#8C6239 y texto #3E2F26.

## Seeders y credenciales de desarrollo

DatabaseSeeder crea Colegio Zárate de Huancayo, código ZARATE, roles y permisos.
DevelopmentSeeder solo funciona en local/testing. Crea seis cuentas demo y prepara los datos académicos y funcionales ficticios usados por la plataforma:

| Rol | Correo |
|---|---|
| ADMINISTRATOR | administrator@zarate.test |
| SECRETARY | secretary@zarate.test |
| TREASURY | treasury@zarate.test |
| TEACHER | teacher@zarate.test |
| STUDENT | student@zarate.test |
| GUARDIAN | guardian@zarate.test |

Contraseña demo común: `ZarateDemo2026!`. Código: `ZARATE`.
Son cuentas explícitas de demostración; solo ellas omiten el cambio inicial de contraseña.
Las cuentas creadas por API sí lo requieren.
DevelopmentSeeder no reemplaza contraseñas ya modificadas y puede ejecutarse de nuevo para completar datos demo faltantes sin borrar registros.
Volver a ejecutar los seeders sincroniza roles y restablece sus permisos iniciales; no hacerlo sobre personalizaciones que se deseen conservar.
No se publican credenciales de MySQL ni APP_KEY.

## Pruebas y calidad

Consultar docs/pruebas.md para comandos y aislamiento.
Pest usa MySQL real zarate_test y DatabaseTransactions. Se fuerzan base/usuario de testing en phpunit.xml.
Cubre entidades, FK/relación institucional, unicidad en MySQL, hash, estados, login/logout/me, contraseña inicial, revocación, Policies, validación, escalamiento, rate limiting, último administrador, auditoría y caché de permisos entre instituciones.
Cypress usa Laravel y MySQL de desarrollo reales para autenticación, seis roles, sesión tras recarga, logout, permisos, identidad, vista móvil y CSRF. Las pruebas técnicas previas permanecen.
La prueba de UI técnica simula salud; los tests de autenticación no simulan Laravel.
Pint, ESLint 10, TypeScript y build de producción son controles adicionales, no casos de prueba sumados.

## Decisiones y límites

Un usuario pertenece a una única institución, conforme al Sprint 1; no se introduce una identidad global ni membresías múltiples.
No se incorporan módulos de Sprint 2.
Avatar y logo tienen campos preparados; se muestran iniciales y no se implementan cargas de archivos.
Aprovisionamiento de nuevas instituciones, recuperación de contraseña, verificación de correo y auditoría de cambios quedan fuera del alcance.
Los dashboards de docente, estudiante y familia son shells; no crean entidades académicas.
El servidor Laravel local debe reiniciarse cuando cambie su configuración: durante las pruebas se corrigió un proceso que conservaba DB_PORT=3306; el proyecto local usa 3307.

## Resultado final de validación — 2026-10-01

- Pest: 68/68 aprobadas, 239 aserciones (62 casos nuevos del Sprint 1 y 6 anteriores).
- Cypress: 13/13 aprobadas (9 nuevas y 4 anteriores), sin omitidas ni pendientes.
- Total acumulado: 81 casos; 71 nuevos en Sprint 1.
- Pint --test: aprobado.
- ESLint 10: aprobado.
- TypeScript frontend y Cypress: aprobados.
- Build Vite de producción: aprobado.
- Conexión React → proxy Vite → Laravel → MySQL: verificada mediante login, consultas y logout reales.
- No hay fallos pendientes dentro del alcance implementado del Sprint 1.
