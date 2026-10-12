# Arquitectura del núcleo SaaS

Documento histórico del núcleo. La arquitectura consolidada de Sprint 10 se encuentra en [architecture.md](architecture.md).

React + TypeScript presenta la interfaz; Laravel valida, autoriza y ejecuta las reglas de negocio sobre MySQL.
La API REST utiliza Sanctum con cookies y CSRF. Spatie administra roles y permisos por institución.

## Aislamiento

Base compartida con institution_id obligatorio en usuarios y datos institucionales.
Cada usuario pertenece a una institución; el correo es único dentro de ella.
Login recibe código institucional, correo y contraseña.
ResolveInstitution deriva el contexto del usuario autenticado, configura el team de Spatie antes del binding y lo limpia al terminar.
InstitutionScope filtra consultas Eloquent de usuarios, roles administrativos y auditoría, y cierra el acceso cuando no hay contexto.
BelongsToInstitution impide crear sin contexto o cambiar institution_id.
Policies exigen permiso y pertenencia institucional.
No hay bypass de administrador global.

El provider de autenticación puede buscar la identidad de sesión antes de resolver el contexto, sin omitir soft deletes.
Spatie usa su Role interno para caché global y relaciones teams; App/Models/Role añade el scope de administración.
No usar SQL directo ni actualizaciones masivas suponiendo que aplican eventos/scopes del modelo; cualquier nuevo servicio, archivo, caché o job deberá respetar institución.

## Organización

Controllers/Api: coordinación HTTP.
Http/Requests: autorización de entrada y validación final.
Policies: autorización por entidad.
Services: contexto, autenticación, usuarios y auditoría; transacciones para cambios críticos.
Enums: estados, roles y acciones.
Resources: datos de respuesta sin contraseñas ni remember_token.
React comparte AppLayout, AuthProvider, componentes de formulario y cliente API.

GET /api/health es público y solo indica que Laravel responde; no certifica MySQL.
Las reglas, endpoints, permisos y límites completos están en [Sprint 1](sprints/sprint-1.md).

## Estructura académica (Sprint 2)

Las entidades académicas directas reutilizan el scope institucional existente; periodos y grados derivan su pertenencia del año/nivel.
AcademicCatalog define recursos y filtros, AcademicPolicy autoriza entidades y AcademicService ejecuta las reglas dentro de transacciones con bloqueo institucional.
El índice generado de academic_years refuerza en MySQL el único año actual por institución.
Los cierres y cambios conservan auditoría e historial. No hay DELETE físico ni reapertura ordinaria por API.
Detalle de reglas, API y decisiones en [Sprint 2](sprints/sprint-2.md).
