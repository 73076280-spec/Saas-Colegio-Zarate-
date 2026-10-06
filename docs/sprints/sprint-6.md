# Sprint 6 — Aula Virtual: unidades y materiales

## Alcance

Unidades y materiales dentro del detalle de cada curso, accesibles desde Cursos (administración) o Mis cursos (docentes y estudiantes). Se mantiene la identidad naranja suave, beige, blanco y café, la navegación existente y el diseño adaptable.

No se implementan tareas, entregas, evaluaciones, calificaciones ni asistencia.

## Datos y arquitectura

Migración: 2026_10_02_140000_create_classroom_tables.

- course_units: course_id, title, description, sequence, status, published_at, timestamps y deleted_at.
- materials: course_id, course_unit_id opcional, title, description, type, external_url, file_path, original_filename, mime_type, file_size, status, published_at, created_by, timestamps y deleted_at.
- Ambas tablas incorporan institution_id además de los campos solicitados para reutilizar el aislamiento global existente. Se valida que curso y unidad pertenezcan al mismo contexto. Las referencias tienen claves foráneas restrictivas.
- Secuencia única por curso, incluso entre registros archivados o eliminados lógicamente.
- Relaciones Eloquent entre curso, unidades, materiales y creador; factories mínimas.
- ClassroomRequest valida entradas. ClassroomPolicy y ClassroomAccess autorizan. ClassroomService concentra reglas, bloqueo institucional, transacción y auditoría. CourseAccess mantiene la regla de matrícula APPROVED.

## Estados y reglas

Unidades y materiales nacen DRAFT. Se publican mediante acción explícita PUBLISH y pasan a PUBLISHED con published_at. ARCHIVE conserva el registro en ARCHIVED y bloquea ediciones posteriores. No hay endpoint DELETE ni restauración en este sprint.

Solo se publica un borrador dentro de un curso ACTIVE. Un material asociado requiere una unidad PUBLISHED para publicarse. Archivar una unidad oculta también sus materiales a estudiantes, sin borrar ni alterar sus estados históricos. El archivo individual del material sigue permitido al personal autorizado.

Los cursos CLOSED son de solo lectura. Los cursos inactivos admiten preparación de borradores y archivado, pero no publicación ni edición de contenido publicado. El tipo de un material no cambia después de creado.

LINK exige una URL HTTP/HTTPS; no se recupera su contenido en el servidor. TEXT exige contenido en description y se representa como texto, sin HTML ejecutable. FILE exige archivo válido; puede reemplazarse conservando la revisión privada anterior.

## Permisos y acceso

Diez permisos nuevos:

- course-units.view/create/update/publish/archive.
- materials.view/create/update/publish/archive.

ADMINISTRATOR recibe todos, dentro de su institución. TEACHER recibe estos permisos pero solo opera sobre cursos con su perfil docente activo y asignación activa. Cada operación comprueba su permiso específico; tener el rol no sustituye el permiso.

STUDENT recibe únicamente los dos permisos de lectura. Necesita perfil activo, curso y asignación activos y matrícula APPROVED para el mismo año/grado/sección. Ve solo contenido PUBLISHED y materiales generales o pertenecientes a una unidad publicada. La matrícula y las condiciones se vuelven a comprobar al listar, consultar por ID y descargar.

El alta de estudiantes por Secretaría conserva una excepción limitada para delegar course-units.view y materials.view al rol STUDENT fijo. Son lecturas personales condicionadas por matrícula; otros permisos añadidos al rol continúan exigiendo que el actor pueda delegarlos. No se amplían los permisos de Secretaría.

SECRETARY, TREASURY y GUARDIAN no reciben acceso al aula. Las lecturas no autorizadas devuelven 404; las escrituras sin permiso, 403; los IDs ajenos a la institución, 404. Todo el API usa Sanctum, contexto institucional y cambio de contraseña inicial del núcleo existente.

## API

Prefijo /api/v1. Listados paginados: page y per_page (20 por defecto, máximo 100), filtro status; materiales admiten course_unit_id. Devuelven abilities calculadas por el backend para presentar los controles.

| Método | Ruta | Uso |
| --- | --- | --- |
| GET / POST | /courses/{course}/units | Listar / crear unidad |
| GET / PATCH | /course-units/{id} | Consultar / editar |
| POST | /course-units/{id}/publish | Publicar |
| POST | /course-units/{id}/archive | Archivar |
| GET / POST | /courses/{course}/materials | Listar / crear material |
| GET / PATCH | /materials/{id} | Consultar / editar |
| POST | /materials/{id}/publish | Publicar |
| POST | /materials/{id}/archive | Archivar |
| GET | /materials/{id}/download | Descargar archivo autorizado |

Creación de unidades: title, description opcional, sequence.
Creación de materiales: title, type, description, course_unit_id opcional; external_url para LINK, file para FILE.
El estado, institución, creador y metadatos del archivo no se aceptan del cliente.
Para reemplazar un archivo se envía multipart por POST con _method=PATCH a /materials/{id}; Laravel lo procesa con la ruta PATCH. El cliente compartido conserva las peticiones JSON y admite FormData sin fijar su Content-Type.

## Archivos privados

Disco materials en storage/app/private/materials, sin serving público ni enlaces públicos. Ruta generada por el servidor: institución/curso/UUID.extensión. file_path no aparece en respuestas ni auditoría.

Límite de **2 MiB**, compatible con PHP local sin modificar configuraciones. Extensiones permitidas: PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX, TXT, JPG/JPEG, PNG, GIF y WEBP. Se validan tamaño, extensión y MIME detectado desde los bytes con fileinfo. OOXML comprueba partes internas del ZIP y rechaza vbaProject.bin; no se extraen archivos. SVG, HTML, PHP, scripts, ejecutables y extensiones de macros no se permiten. Esta validación no equivale a un análisis antivirus de los documentos permitidos.

Descarga mediante Laravel con autorización, attachment, application/octet-stream, nosniff y cache privado no-store. Un archivo perdido devuelve 404. Si falla la transacción o auditoría tras una carga, se descarta el archivo nuevo. Las revisiones anteriores se conservan privadas, sin endpoint de recuperación ni purga automática.

## Auditoría

CREATE, UPDATE, PUBLISH y ARCHIVE registran usuario, institución, entidad, ID, fecha, IP y agente. Se incluyen valores anteriores/nuevos de metadatos: título, estado, secuencia, tipo, referencias, publicación y tamaño/MIME. No se registran binarios, rutas privadas, URL ni el texto libre del contenido.

## Preparación y demo

Sobre los sprints anteriores ya preparados, desde backend:

~~~text
php artisan migrate
php artisan migrate --env=testing
php artisan db:seed --class=ClassroomDemoSeeder
~~~

En esta estación puede usarse ..\.tools\php\php.exe en lugar de php. El seeder solo admite local/testing y puede repetirse sin sobrescribir estados ni contraseñas. Requiere el curso DEMO-MAT-2026 del Sprint 5.

- Matemática — curso demo.
- Unidad 1: números naturales, publicada.
- Unidad 2: operaciones básicas, borrador.
- Guía de números naturales (demo), archivo classroom-demo.txt publicado.
- Enlace de consulta (demo), https://example.org, publicado.
- Todo el contenido es ficticio.

Institución ZARATE. Cuentas: administrator@zarate.test, teacher@zarate.test, student@zarate.test y student2@zarate.test. Contraseña inicial de desarrollo: ZarateDemo2026!; no se restablecen contraseñas modificadas.

## Pruebas

Doce casos Pest nuevos cubren el ciclo de unidades; unicidad; curso activo y unidad publicada; tipos de material y entradas protegidas; descarga y revocación de matrícula; archivos disfrazados/tamaño; lectura publicada; permisos docentes y roles excluidos; aislamiento institucional y unidad de otro curso; rollback con archivo; auditoría/historial; reemplazo multipart; paginación y autenticación. Se agrupan aserciones relacionadas, sin datasets redundantes.

Tres flujos Cypress nuevos:
1. Docente crea/publica unidad y archivo y archiva la unidad.
2. Estudiante aprobado consulta publicados, descarga y usa vista móvil sin gestión.
3. Acceso directo a borradores y denegación por matrícula no aprobada.

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

## Resultados finales y cierre

| Comprobación | Resultado |
| --- | --- |
| Pest, regresión completa | **276 aprobadas, 1569 aserciones** |
| Pest nuevas de Sprint 6 | 12 |
| Cypress, ocho especificaciones | **31 aprobadas** |
| Cypress nuevas de Sprint 6 | 3 |
| Total general | **307 pruebas distintas aprobadas** |
| Pint | Aprobado |
| ESLint | Aprobado |
| TypeScript frontend | Aprobado mediante build |
| TypeScript Cypress | Aprobado |
| Build de producción | Aprobado |

La validación Cypress comprende una ejecución completa y reejecuciones de las especificaciones afectadas. La ejecución completa aprobó courses (3), enrollment (3), integration (1), people (5) y ui (3). Las reejecuciones finales aprobaron auth (9), classroom (3) y academic (4). No se suman intentos repetidos al contador.

Se corrigieron únicamente selectores y sincronización de las pruebas existentes: el aula espera su carga y consulta los controles dentro del ámbito correcto; catálogos espera la API y busca Primaria explícitamente, sin depender de la primera página. Logout mantiene su respuesta contractual 204. El alias dinámico de espera conserva el tipo requerido por Cypress. No se agregaron pruebas ni funcionalidades durante el cierre.

Pest confirmó también la compatibilidad del alta de estudiantes por Secretaría con los permisos personales del aula. El seeder demo se ejecutó dos veces satisfactoriamente, conservando los registros existentes.

**Sprint 6 cerrado.** No quedan fallos conocidos ni pendientes dentro del alcance. Las limitaciones descritas de archivos e historial son las del alcance implementado; tareas, entregas, notas y asistencia permanecen fuera de este sprint.

## Prueba manual

1. Abrir http://localhost:5173/login, institución ZARATE e ingresar como teacher@zarate.test con la contraseña demo.
2. Mis cursos → Matemática — curso demo → Entrar al curso → Aula Virtual.
3. Crear unidad con un título y una secuencia libre; guardar como borrador. Editar si hace falta. Publicar y confirmar.
4. Crear material: seleccionar la unidad; elegir Texto y escribir contenido, Enlace con URL HTTPS o Archivo permitido de hasta 2 MiB. Guardar y publicar. Los errores aparecen dentro del aula o formulario.
5. Usar Ver materiales en una unidad para filtrar; Todos los materiales quita el filtro. Las listas y selector de unidades tienen paginación.
6. Cerrar sesión e ingresar como student@zarate.test. Verificar solo unidades/materiales publicados, abrir el enlace y descargar classroom-demo.txt; no aparecen controles de gestión.
7. Como docente, archivar una unidad creada para la prueba. Como estudiante, confirmar que la unidad y sus materiales dejaron de aparecer.
8. Como student2@zarate.test, comprobar que la matrícula observada no concede acceso al curso.
9. Como administrator@zarate.test, entrar en Cursos → Detalle para gestionar el aula; revisar CREATE/UPDATE/PUBLISH/ARCHIVE en Auditoría.
10. Comprobar el flujo a 390 px de ancho. No modificar ni archivar la Unidad 1 demo si se van a ejecutar los E2E; usar registros nuevos para las pruebas manuales.

## Próximo sprint

Definir tareas y entregas sobre el acceso a cursos existente, con fechas y estados claros, permisos, aislamiento y pruebas principales. No se implementa Sprint 7 aquí.
