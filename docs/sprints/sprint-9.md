# Sprint 9 — Solicitudes académicas, documentos, comunicaciones y notificaciones

## Alcance

Gestión de solicitudes con códigos generados, responsable, correcciones, resolución e historial; documentos privados; comunicaciones dirigidas; notificaciones internas de Laravel con lectura individual y masiva. Se mantienen Sanctum, Policies, Form Requests, Services, transacciones, contexto institucional y la identidad visual naranja/beige/café.

No incluye reportes finales, dashboard final, despliegue, Docker, correo, SMS ni WhatsApp. No hay código de Sprint 10.

## Tablas

| Tabla | Contenido y restricciones |
| --- | --- |
| request_types | Institución, nombre, code único por institución, descripción, status ACTIVE/INACTIVE y timestamps. |
| academic_requests | Institución, request_code único global, estudiante, apoderado opcional, tipo, asunto, descripción, estado, responsable, resolución y timestamps. |
| request_status_history | Institución, solicitud, estado anterior/nuevo, actor, comentario y created_at. Inmutable. |
| academic_documents | Institución, solicitud opcional, estudiante, tipo, número generado, metadatos del archivo privado, emisión, emisor, estado y timestamps. |
| communications | Institución, título, cuerpo, creador, estado, publicación y timestamps. |
| communication_targets | Institución, comunicado, kind y target; combinación comunicado/kind/target única. |
| notifications | Esquema database de Laravel (UUID, type, notifiable, data, read_at, timestamps), ampliado con institution_id y scope institucional. |

Las relaciones restringen borrados. No hay eliminación física de solicitudes, documentos ni comunicaciones. Solo los destinatarios de un borrador pueden reemplazarse antes de publicar.

Se reutilizan factories existentes de cursos, usuarios y personas; no se crean factories redundantes para aumentar el contador.

## Solicitudes: reglas y transiciones

El backend genera SOL-<año>-<ID con al menos seis dígitos> dentro de una transacción. El ID autoincremental evita colisiones entre instituciones y solicitudes simultáneas. El código no puede enviarse ni modificarse por API.

- STUDENT crea para su propio perfil activo; un student_id ajeno devuelve 403.
- GUARDIAN crea para un estudiante vinculado y requiere perfil activo. Puede consultar y corregir solicitudes de estudiantes vinculados.
- El tipo debe estar ACTIVE y pertenecer a la institución.
- Correcciones de asunto/descripción solo por estudiante/apoderado autorizado, en REGISTERED u OBSERVED.
- Secretaría administra responsable y transiciones; assigned_to solo puede referenciar un usuario activo de su institución con rol SECRETARY/ADMINISTRATOR.
- La primera revisión asigna al revisor si no había responsable.
- REGISTERED → IN_REVIEW.
- IN_REVIEW → OBSERVED → IN_REVIEW.
- IN_REVIEW → APPROVED → COMPLETED.
- IN_REVIEW → REJECTED.
- Observar exige comentario. Aprobar/completar exigen resolución. Rechazar exige comentario y resolución.
- Los estados terminales no se reabren ni permiten alterar la solicitud.
- Creación y cada transición generan request_status_history. Las correcciones de contenido y responsable generan auditoría UPDATE sin inventar una transición.
- Cada transición notifica al estudiante y a sus apoderados activos vinculados, una vez por usuario, con mensaje genérico sin descripción ni resolución privada.
- Cambios de estado, historial, auditoría y notificaciones se confirman juntos; si falla una operación, se revierten.

## Documentos

Se crean en DRAFT para un estudiante institucional, vinculados opcionalmente a una solicitud del mismo estudiante. Número DOC-<año>-<ID> generado por servidor.

DRAFT → ISSUED. Si hay solicitud vinculada, debe estar APPROVED o COMPLETED antes de emitir. issued_by e issued_at se establecen en servidor. No hay edición posterior de contenido/archivo ni reemisión.

DRAFT o ISSUED → CANCELLED, mediante la acción cancel con documents.issue. Se conserva archivo y auditoría, pero deja de estar disponible para estudiante y apoderado. Secretaría conserva consulta de documentos cancelados.

Estudiantes y apoderados vinculados consultan y descargan únicamente ISSUED. Los borradores y archivos ajenos son inaccesibles. Un documento sin archivo registra metadatos de emisión; no se genera un PDF complejo.

Se reutilizan MaterialFiles y el disco privado materials, con la carpeta institucional documents. Las llamadas anteriores por curso conservan su comportamiento. Máximo 2 MiB, extensión permitida y MIME real; OOXML valida estructura y macros. Descargas pasan por Laravel con autorización, attachment, nosniff y no-store. Las rutas internas no aparecen en JSON. Fallos transaccionales descartan el archivo nuevo.

## Comunicaciones y destinatarios

DRAFT → PUBLISHED → ARCHIVED. Un borrador también puede archivarse. Solo DRAFT admite editar texto o destinatarios. Publicar dos veces no genera notificaciones adicionales.

| kind | target y resolución |
| --- | --- |
| institution | ID de la institución actual; todos sus usuarios activos. |
| role | Nombre de rol institucional; usuarios activos con ese rol. |
| grade | ID de grado; estudiantes activos con matrícula APPROVED en ese grado, sus apoderados activos y docentes con asignación activa. |
| section | ID de sección; el mismo criterio dentro de esa sección. |
| course | ID de curso ACTIVE con asignación activa; roster APPROVED de CourseAccess, apoderados activos y docente activo asignado. |
| user | ID de un usuario activo de la institución. |

Todos los IDs se validan con scopes institucionales. Se admiten hasta treinta criterios. Se normalizan criterios repetidos y la unión de usuarios se deduplica antes de enviar.

Los destinatarios quedan fijados al publicar mediante sus notificaciones persistidas. Un cambio posterior de rol/matrícula no redistribuye ni modifica comunicaciones anteriores. Solo sus destinatarios pueden leer PUBLISHED; Secretaría/administración supervisan los estados institucionales. ARCHIVED deja de mostrarse a destinatarios, aunque la notificación histórica permanece.

No se expone la lista de destinatarios al receptor. Publicación, notificaciones y auditoría son transaccionales y se serializan mediante el bloqueo institucional existente. No se publica si no hay destinatarios activos.

## Notificaciones

Se usa Illuminate Notifications con canal database, sin colas ni servicios externos. User conserva Notifiable; su relación notifications utiliza InstitutionNotification para aplicar el scope institucional.

Cada usuario solo consulta y marca sus UUID propios. La institución se toma de la sesión, no del cliente. read es idempotente; read-all afecta exclusivamente sus notificaciones no leídas.

La respuesta incluye unread_count total, independiente de paginación/filtro, tipo, mensaje, fecha, read_at y enlace interno. Los avisos de solicitudes no incluyen su contenido sensible.

La campana muestra contador y las cinco notificaciones recientes; la bandeja completa pagina veinte por defecto, permite filtrar read/unread y marcar todas. El contador se actualiza al interactuar, recuperar foco y cada minuto. No se implementan websockets.

## Permisos y Policies

Quince permisos nuevos:

- requests.view/create/review/observe/approve/reject/complete.
- documents.view/create/issue.
- communications.view/create/publish/archive.
- notifications.view.

| Rol | Alcance |
| --- | --- |
| ADMINISTRATOR | Supervisión y delegación de los quince permisos, limitada a su institución. |
| SECRETARY | Gestionar trámites, documentos, comunicaciones y avisos propios. Crear una solicitud sigue requiriendo perfil estudiantil/familiar autorizado. |
| STUDENT | requests.view/create, documents.view, communications.view, notifications.view; acceso propio. |
| GUARDIAN | Los mismos permisos, restringidos a estudiantes vinculados. |
| TEACHER y TREASURY | communications.view y notifications.view; únicamente destinatarios y avisos propios. |

OfficePolicy/OfficeAccess verifican permisos y contexto; los Services repiten la autorización dentro de la transacción. GET ajeno devuelve 404; escrituras sin permiso, 403; reglas inválidas, 422. No se permite imponer códigos, estados administrativos, autores ni rutas privadas.

## API REST

Prefijo /api/v1, auth:sanctum, institution y password.changed.

| Método | Ruta |
| --- | --- |
| GET | /request-types |
| GET, POST | /academic-requests |
| GET, PATCH | /academic-requests/{id} |
| POST | /academic-requests/{id}/review |
| POST | /academic-requests/{id}/observe |
| POST | /academic-requests/{id}/approve |
| POST | /academic-requests/{id}/reject |
| POST | /academic-requests/{id}/complete |
| GET | /academic-requests/{id}/history |
| GET | /my/requests |
| GET, POST | /academic-documents |
| GET | /academic-documents/{id} |
| POST | /academic-documents/{id}/issue |
| POST | /academic-documents/{id}/cancel |
| GET | /academic-documents/{id}/download |
| GET, POST | /communications |
| GET, PATCH | /communications/{id} |
| POST | /communications/{id}/publish |
| POST | /communications/{id}/archive |
| GET | /notifications |
| GET | /my/notifications |
| POST | /notifications/{uuid}/read |
| POST | /notifications/read-all |
| GET | /office-options/{option} |

option: students, users, roles, grades, sections, courses, assignees. Catálogos mínimos paginados para selectores; el estudiante/apoderado solo accede a students propios/vinculados. Los demás requieren gestión institucional.

Listados: page y per_page (1–100, defecto 20). Solicitudes: status, request_type_id, student_id, date de registro y search por código/asunto. Documentos: student_id, academic_request_id, status, date, search por número/tipo. Comunicaciones: status, date y search por título. Notificaciones: status=read|unread.

Crear solicitud:

~~~json
{"request_type_id":1,"subject":"Constancia de estudios","description":"Motivo de ejemplo"}
~~~

El apoderado añade student_id. PATCH admite corrección de subject/description; Secretaría puede cambiar assigned_to. Las transiciones aceptan comment y/o resolution según la regla anterior.

Crear documento: multipart con document_type, student_id o academic_request_id, y file opcional. Las acciones issue/cancel no aceptan datos de emisión del cliente.

Crear comunicado:

~~~json
{"title":"Aviso de ejemplo","body":"Mensaje institucional","targets":[{"kind":"role","target":"STUDENT"},{"kind":"user","target":"15"}]}
~~~

Los valores target se envían como strings. La unión rol/usuario no duplica notificaciones.

## Auditoría

CREATE, UPDATE, REVIEW, OBSERVE, APPROVE, REJECT, COMPLETE, ISSUE, CANCEL, PUBLISH y ARCHIVE. Se agregan COMPLETE e ISSUE a AuditAction; CANCEL ya existía.

Se registran institución, actor, entidad, ID, códigos, estados, responsable/emisor y criterios de destinatarios. No se guardan cuerpos de comunicaciones, descripción/resolución de solicitudes, binarios ni rutas privadas en audit_logs. Comentarios de trámite permanecen en el historial autorizado.

## Demo y preparación

Desde D:\zarate-saas\backend, con Sprints 1–8 preparados:

~~~powershell
& ..\.tools\php\php.exe artisan migrate
& ..\.tools\php\php.exe artisan migrate --env=testing
& ..\.tools\php\php.exe artisan db:seed --class=OfficeDemoSeeder
~~~

El seeder admite únicamente local/testing. Crea sin sobrescribir lo existente:

- Tipos CONSTANCIA, CERTIFICADO, CORRECCION_DATOS y OTRO.
- Constancia de estudios (demo registrada), estado REGISTERED.
- Constancia con observación (demo), estado OBSERVED, con revisión e historial.
- Bienvenida a los trámites académicos (demo), PUBLISHED para la institución.
- Notificaciones reales internas derivadas de las transiciones y publicación.

No restablece contraseñas, decisiones ni marcas de lectura. Los datos son ficticios. No se requieren nuevas dependencias, claves, workers ni servicios.

Institución ZARATE. Correos student@zarate.test, guardian@zarate.test, secretary@zarate.test, teacher@zarate.test, treasury@zarate.test y administrator@zarate.test. Contraseña demo inicial ZarateDemo2026! si no fue modificada.

## Prueba manual

1. Abrir http://localhost:5173/login e ingresar como student@zarate.test en ZARATE.
2. Mis solicitudes → Nueva solicitud. Seleccionar Constancia, asunto y descripción. Registrar; comprobar código SOL, estado Registrada e historial.
3. Como guardian@zarate.test, Mis solicitudes → Nueva solicitud. El selector solo ofrece estudiantes asociados.
4. Como secretary@zarate.test, Solicitudes académicas. Filtrar por estado, tipo, estudiante, fecha o código/asunto. Ver solicitud → Iniciar revisión.
5. Escribir comentario → Observar solicitud. Como estudiante/apoderado, consultar el aviso y el historial; Corregir solicitud → Guardar corrección.
6. Como Secretaría, Iniciar revisión nuevamente, escribir resolución → Aprobar solicitud.
7. Dentro del detalle, Documentos de la solicitud → Nuevo documento. Introducir tipo y adjuntar un TXT/PDF permitido de hasta 2 MiB. Guardar documento → Emitir documento.
8. Completar solicitud con resolución. Como estudiante/apoderado, comprobar Completada y descargar el documento emitido.
9. Para probar rechazo, crear otro trámite: revisar, escribir comentario y resolución, rechazar. Para cancelación documental, usar un documento de prueba y comprobar que deja de ser descargable por su titular.
10. Como Secretaría, Comunicaciones → Nuevo comunicado. Título, mensaje y uno o varios criterios; Guardar borrador → Publicar comunicado, confirmando.
11. Como destinatario, Comunicaciones → Leer comunicado. Una persona coincidente por rol y usuario recibe un único aviso.
12. Abrir campana → Ver todas las notificaciones, o Mis notificaciones. Filtrar Sin leer, marcar una como leída y usar Marcar todas como leídas; comprobar contador cero.
13. Comprobar vista móvil y que usuarios ajenos/no vinculados no ven solicitudes, documentos ni comunicaciones privadas.

## Pruebas y validación

Exactamente diez casos Pest nuevos cubren identidad estudiantil y códigos únicos, vínculo familiar, IDOR familiar, observación/corrección e historial, aprobación/completado/rechazo y rollback, privacidad/emisión/cancelación documental, destinatarios superpuestos, gestión y acceso a comunicados, read/unread y aislamiento institucional.

Exactamente tres Cypress nuevos cubren el trámite completo con corrección/documento, publicación con destinatarios superpuestos, y campana/marcado individual y masivo. Los casos usan datos E2E propios; no agregan variantes redundantes ni alteran los datos demo esenciales.

~~~text
backend: ..\.tools\php\php.exe vendor/bin/pest --compact
backend: ..\.tools\php\php.exe vendor/bin/pint --test
frontend: npm run lint
frontend: npm run build
e2e: npm run typecheck
e2e: npm test
~~~

Pest se ejecuta exclusivamente contra zarate_test. Cypress utiliza los servicios locales reales; no simula el backend en los nuevos flujos.

### Resultados finales — 5 de octubre de 2026

| Verificación | Resultado |
| --- | --- |
| Pest, regresión completa | 306 aprobadas, 1.891 aserciones; 10 pruebas nuevas de Sprint 9. |
| Cypress, casos únicos verificados | 40 aprobadas; 3 pruebas nuevas de Sprint 9. |
| Total acumulado | 346 pruebas automatizadas. |
| Pint | Aprobado (`--test`). |
| ESLint | Aprobado. |
| TypeScript frontend y build | Aprobados mediante `npm run build`. |
| TypeScript Cypress | Aprobado de nuevo tras el último ajuste de selectores. |

La ejecución completa de Cypress recorrió los 40 casos: 38 aprobaron y dos casos existentes de `academic.cy.ts` y `auth.cy.ts` requirieron corregir supuestos sobre la primera página y sincronización de carga. Se ajustaron la búsqueda del año demo, la comprobación de los usuarios realmente listados, las esperas de sesión/roles/permisos/auditoría y el enlace exacto del catálogo de Asignaturas (`/app/academic/subjects`). No se cambió código funcional para resolver estos fallos.

Después de los ajustes, la última reejecución de las dos secciones afectadas aprobó 13/13 (academic: 4; auth: 9), con código de salida 0. Sumados a los otros 27 casos aprobados en la ejecución completa, quedan verificados los 40 casos únicos. Esta confirmación combina la regresión completa y la reejecución de las secciones corregidas; no corresponde a una nueva ejecución única de los once archivos. Los tres flujos de Sprint 9 aprobaron en la regresión completa.

Comando de reejecución final desde e2e:

~~~text
npm test -- --spec cypress/e2e/academic.cy.ts,cypress/e2e/auth.cy.ts
~~~

Pint, ESLint y el build conservan su validación porque no se modificó backend ni frontend funcional después de esos controles. Al retomar, los servicios locales estaban detenidos: se iniciaron las herramientas existentes y se verificó HTTP 200 en Laravel y en el proxy de Vite, sin reinstalar dependencias, migrar ni regenerar datos.

**Sprint 9 cerrado, sin pendientes funcionales ni pruebas fallidas pendientes.** No se cuentan reejecuciones como pruebas nuevas. No se agregaron pruebas ni funcionalidades durante el cierre.

## Siguiente sprint

Definir el alcance de reportes finales y consolidación del dashboard: métricas, filtros, permisos, fuentes y criterios de aceptación. No se implementa Sprint 10 en este sprint.
