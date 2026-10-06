# Sprint 2 — Estructura académica institucional

## Alcance

Se incorporan años académicos, periodos, niveles educativos, grados escolares (grade_levels), secciones y asignaturas.
Cada catálogo tiene consulta, creación, detalle y actualización según permisos, filtros, paginación y auditoría.
No se implementan estudiantes, docentes académicos, padres, matrículas, cursos, notas, tareas ni asistencia.
Se reutilizan Sanctum, contexto institucional, Spatie, Policies, auditoría y la identidad visual del Sprint 1.

## Entidades y relaciones

Migración: `2026_10_01_160000_create_academic_structure.php`.

| Tabla | Pertenencia | Unicidad | Histórico |
|---|---|---|---|
| academic_years | institution_id | institución + nombre; un is_current por institución | soft deletes |
| academic_periods | academic_year_id | año + sequence | no DELETE expuesto |
| education_levels | institution_id | institución + nombre / código | soft deletes |
| grade_levels | education_level_id | nivel + nombre / código | soft deletes |
| sections | institución + año + grado | institución + año + grado + nombre | no DELETE expuesto |
| subjects | institution_id | institución + nombre / código | soft deletes |

Todos los vínculos tienen FK con restricción de borrado. Los registros archivados conservan sus claves únicas; no se reutilizan silenciosamente sus códigos.
Años incorpora una columna generada interna current_institution_id con índice único MySQL para reforzar la exclusividad del año actual. No aparece en respuestas API.
Las columnas de dominio y campos opcionales corresponden al alcance solicitado.
capacity es nullable o entero entre 1 y 100000; sequence entre 1 y 65535; sort_order entre 0 y 65535.

## Estados y reglas

AcademicYearStatus y AcademicPeriodStatus: DRAFT, ACTIVE, CLOSED.
CatalogStatus: ACTIVE, INACTIVE.

- Inicio estrictamente anterior al fin; formato de fecha YYYY-MM-DD.
- Activar un año o establecer is_current=true lo hace actual y desmarca el anterior, sin cerrar automáticamente el año anterior.
- Editar un año ACTIVE que no es actual no lo convierte involuntariamente en actual.
- Un año CLOSED no admite modificaciones ni nuevos periodos/secciones. Su is_current es false.
- Cerrar un año cierra también sus periodos y pone grading_open=false, con auditoría por registro, en una transacción.
- Un periodo debe quedar dentro del año; no puede solaparse con otro. Los límites son inclusivos: compartir una fecha final/inicial cuenta como solapamiento.
- Un periodo CLOSED no admite reapertura ordinaria ni edición; grading_open=false.
- No se permite reducir las fechas del año dejando periodos fuera.
- Los padres de periodos, grados y secciones no se reasignan después del alta: para otra relación histórica se crea otro registro.
- Secciones solo se crean/actualizan con grado y nivel activos; nuevos grados requieren nivel activo.
- Las asignaturas desactivadas siguen consultables y conservan el historial.
- No hay endpoints de DELETE, restauración o reapertura en este sprint.

## Aislamiento y autorización

Las entidades con institution_id usan BelongsToInstitution e InstitutionScope existentes.
Periodos y grados usan BelongsToInstitutionThroughParent: sus consultas quedan acotadas por el año o nivel institucional.
Las escrituras validan la pertenencia del padre. Section comprueba sus dos relaciones también a nivel Eloquent.
No se acepta institution_id del cliente. Los padres se validan mediante consultas con scope.
Los IDs de otra institución no aparecen en listados ni filtros; detalle y modificación retornan 404.
AcademicPolicy comprueba permiso y propietario en lectura, actualización, cierre y desactivación.
El cálculo de propietario para Policy puede consultar el ID institucional del padre sin scope, pero no expone el registro; las consultas de datos mantienen el scope.
Todo endpoint pasa por auth:sanctum, institution y password.changed.
No se cambió el mecanismo de login ni la identidad de usuario del Sprint 1.

## Servicios y concurrencia

AcademicCatalog declara los seis recursos permitidos y sus relaciones/filtros.
AcademicController coordina HTTP; SaveAcademicRequest y AcademicListRequest validan entradas.
AcademicService concentra intervalos, unicidad, año actual, cierres y auditoría.
Cada escritura bloquea la fila de institución dentro de una transacción. Esto serializa modificaciones académicas de una misma institución y evita carreras en periodos/año actual.
Las reglas de unicidad se vuelven a consultar dentro de la transacción; MySQL mantiene los índices únicos.
Si falla la auditoría, se revierte la modificación.
Los scopes no protegen SQL directo ni operaciones masivas que omitan eventos Eloquent; futuras funcionalidades deben reutilizar servicios/contexto.

## API REST

Prefijo `/api/v1`. Para cada recurso:
`academic-years`, `academic-periods`, `education-levels`, `grade-levels`, `sections`, `subjects`:

| Método | Ruta | Propósito |
|---|---|---|
| GET | /{recurso} | Listado paginado |
| POST | /{recurso} | Crear |
| GET | /{recurso}/{id} | Detalle |
| PUT/PATCH | /{recurso}/{id} | Actualizar campos enviados |

Acciones:
- POST /academic-years/{id}/close
- POST /academic-periods/{id}/close
- POST /subjects/{id}/disable
- PATCH /academic-years/{id} con {"is_current":true} establece el año actual.

Cambiar status a CLOSED o INACTIVE por PATCH no evade permisos de cierre/desactivación.
GET /academic-years/{id} incluye sus periodos ordenados por sequence.
Listados retornan data, current_page, last_page, total y enlaces de paginación.

Parámetros generales: search, status, page, per_page (1–100; predeterminado 15).
Búsqueda por nombre y, donde existe, código; MySQL usa su comparación de texto sin distinguir acentos en esta configuración.
Orden: años por inicio descendente; periodos por año y secuencia; niveles/grados por sort_order y nombre; secciones/asignaturas por nombre. ID desambigua empates.

| Recurso | Filtros adicionales |
|---|---|
| academic-years | is_current=0/1 |
| academic-periods | academic_year_id |
| grade-levels | education_level_id |
| sections | academic_year_id, grade_level_id |

Ejemplos:
`GET /api/v1/subjects?search=matematica&status=ACTIVE`
`GET /api/v1/sections?academic_year_id=1&grade_level_id=5&page=1`
`GET /api/v1/grade-levels?education_level_id=2`

Errores: 401 sin sesión; 403 sin permiso; 404 ID ajeno/inexistente; 422 validación/reglas; CSRF de Sanctum permanece activo.

## Permisos

21 permisos nuevos; 32 acumulados con Sprint 1:

- academic-years.view/create/update/close
- academic-periods.view/create/update/close
- education-levels.view/create/update
- grade-levels.view/create/update
- sections.view/create/update
- subjects.view/create/update/disable

ADMINISTRATOR recibe todos.
SECRETARY y TEACHER reciben los seis permisos de consulta.
STUDENT, GUARDIAN y TREASURY no reciben permisos de administración académica.
Las desactivaciones de niveles, grados y secciones se realizan mediante update, sin añadir permisos no solicitados.
AcademicPermissionSeeder agrega permisos sin quitar personalizaciones existentes.
RolePermissionSeeder integra el nuevo seeder y pasa a conceder permisos de forma aditiva para no borrar permisos de otros sprints.
UpdateRoleRequest admite el catálogo ampliado; la única expectativa de Sprint 1 ajustada es el conteo de permisos (11 → 32).

## Auditoría

Se amplía AuditAction con CLOSE y DISABLE.
Las altas registran CREATE; cambios ordinarios UPDATE; cierres CLOSE; desactivaciones DISABLE.
También se auditan el año que deja de ser actual y los periodos cerrados por cierre de año.
entity_type identifica la tabla, entity_id el registro; old_values/new_values contienen los campos académicos sin campos internos ni timestamps de mantenimiento.
Se conservan institución, actor, IP y user agent. No se añaden credenciales, tokens ni información sensible.
Los seeders de demostración no se presentan como operaciones realizadas por un usuario.

## Interfaz

Se conserva la paleta institucional naranja, beige, blanco y café.
Gestión Académica aparece en dashboard y sidebar según permisos.
Ruta principal: /app/academic.
Rutas de catálogo: /app/academic/{recurso}.
AcademicHome, AcademicPage, AcademicForm y RelationSelect evitan seis interfaces duplicadas.
Incluyen tabla, estado, búsqueda, filtros, paginación, detalle, formularios, mensajes de campo, confirmaciones, loading, vacío y errores.
Los selectores de padres también permiten búsqueda y paginación.
Navegación: año → periodos; nivel → grados → secciones.
Los botones de gestión no aparecen a usuarios de consulta; Laravel sigue siendo la autoridad final.
El hook de consultas descarta respuestas antiguas para que cambios rápidos de filtro no sobrescriban los resultados actuales.
La pantalla de auditoría existente describe ahora accesos y cambios institucionales.

## Datos demo reproducibles

Ejecutar desde backend, sobre el entorno de desarrollo ya configurado:

```text
php artisan migrate
php artisan db:seed --class=AcademicDemoSeeder
```

Requiere la institución ZARATE y roles del Sprint 1.
AcademicDemoSeeder solo admite local/testing.
En una instalación nueva, ejecutar primero los seeders del Sprint 1.
No sobrescribe campos de registros existentes ni vuelve a abrir un año cerrado.
No duplica códigos/secuencias y no agrega periodos solapados. Reponer datos archivados requiere una decisión explícita; no restaura soft deletes.

Datos base:
- Año 2026: 02/03/2026–18/12/2026; ACTIVE; actual si todavía no hay otro actual.
- Bimestre 1: 02/03–08/05.
- Bimestre 2: 11/05–17/07.
- Bimestre 3: 03/08–09/10.
- Bimestre 4: 12/10–18/12.
- Los periodos demo son DRAFT y grading_open=false.
- Inicial: 3, 4 y 5 años; Primaria: 1.º a 6.º; Secundaria: 1.º a 5.º.
- Secciones A y B para cada uno de los 14 grados, capacidad demo 30.
- MAT-001 Matemática; COM-001 Comunicación; CYT-001 Ciencia y Tecnología; ING-001 Inglés.

Estas fechas, capacidades y secciones son exclusivamente demostrativas; no representan el calendario oficial del colegio.
Repetir el seeder no reactiva asignaturas desactivadas ni reemplaza descripciones editadas.

## Pruebas y controles

Pest usa únicamente MySQL zarate_test, con transacciones y credenciales separadas de desarrollo.
Cubre CRUD permitido, requeridos, duplicados, estados, fechas, límites inclusivos, cierre, current, constraints MySQL, relaciones, capacidad, aislamiento, permisos, auditoría y rollback ante fallo de auditoría.
También prueba semilla repetida, códigos por nivel, historial, filtros, orden y paginación.
No se ejecutan migraciones destructivas ni refresh de desarrollo.

Cypress usa API real: navegación de los seis catálogos, detalle de periodos, jerarquía nivel/grado/sección, validación de duplicados/fechas, creación/edición/desactivación y cierre de datos E2E, consulta docente y móvil.
Cada ejecución crea datos con prefijo E2E y sufijo único; los conserva desactivados/cerrados para no destruir historial ni tocar 2026.
Los tests anteriores de auth, integración y salud permanecen.

Comandos:
```text
cd backend
php artisan migrate --env=testing
php vendor/bin/pint --test
php vendor/bin/pest

cd ../frontend
npm run lint
npm run build

cd ../e2e
npm run typecheck
npm test
```

En esta estación php puede sustituirse por D:\zarate-saas\.tools\php\php.exe.
Los resultados finales se detallan al final de este documento.

## Prueba manual

1. Abrir http://localhost:5173/login.
2. Ingresar ZARATE / administrator@zarate.test / ZarateDemo2026!.
3. Abrir Gestión Académica → Años académicos → Detalle de 2026 y verificar sus cuatro periodos.
4. Recorrer Niveles educativos → Primaria → Ver grados → Ver secciones.
5. Abrir Asignaturas; buscar matematica y filtrar por estado.
6. Crear una asignatura de prueba con código único, editarla y desactivarla; verificar que permanece consultable.
7. Para probar cierres o cambio de actual, crear un año independiente de prueba. No cerrar 2026 si se pretende seguir usando sus secciones demo.
8. Revisar Auditoría para CREATE/UPDATE/CLOSE/DISABLE.
9. Entrar con teacher@zarate.test o secretary@zarate.test, misma contraseña demo: pueden consultar, no gestionar.
10. Comprobar vista móvil y que una sesión sin permisos no pueda abrir las rutas académicas.

## Límites y siguiente sprint

No hay errores ni pendientes funcionales dentro del alcance del Sprint 2. La regresión completa está aprobada.
No se implementaron módulos de Sprint 3.
La siguiente definición debería abordar estudiantes institucionales, identidad y estados, preservando aislamiento y referencias históricas. Matrículas requerirán una decisión posterior de alcance.

## Resultados finales de validación — 2026-10-01

| Control | Resultado |
|---|---|
| Pest, suite completa | 152/152 aprobadas; 676 aserciones |
| Cypress, suite completa | 17/17 aprobadas; sin fallos, omitidas ni pendientes |
| Pint --test | Aprobado |
| ESLint | Aprobado |
| TypeScript frontend | Aprobado mediante tsc -b |
| TypeScript Cypress | Aprobado mediante npm run typecheck |
| Build Vite | Aprobado |

Total acumulado: **169 pruebas**. Sprint 2 añade 84 casos Pest y 4 flujos Cypress a las 81 pruebas anteriores.
Cypress ejecutó academic.cy.ts (4), auth.cy.ts (9), integration.cy.ts (1) y ui.cy.ts (3).

El test de navegación a secciones espera explícitamente GET /api/v1/sections y comprueba HTTP 200 antes de verificar las filas. La comprobación de la tabla admite hasta 10 segundos para renderizar. La regresión completa posterior pasó en una única ejecución, sin reintentos configurados para ocultar fallos.
El ajuste no modifica reglas de negocio ni datos demo del año 2026.

La última ejecución completa de Pest aprobó las 152 pruebas tras los ajustes definitivos de enums, orden de periodos y auditoría. Posteriormente solo se ajustaron el cliente de consultas, la espera de Cypress y la documentación; el frontend y Cypress se volvieron a validar.
No se realizaron tareas de sistema operativo, Docker, WSL ni implementación de Sprint 3.
