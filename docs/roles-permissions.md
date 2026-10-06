# Roles y permisos

La autorización combina rol, permiso vigente y alcance del registro. Ocultar un menú no sustituye la comprobación de Laravel. La institución procede de la sesión; ni el administrador accede a otra institución.

| Rol | Responsabilidad y acceso | Restricciones principales |
| --- | --- | --- |
| ADMINISTRATOR | Usuarios, roles, institución, estructura, personas, matrícula, pagos, docencia, aula, seguimiento, reportes y auditoría institucional. | No puede eliminar al último administrador, delegar permisos que no posee ni acceder a otra institución. No crea solicitudes como si fuera un estudiante sin perfil autorizado. |
| SECRETARY | Gestión operativa de estudiantes/apoderados, matrículas, revisión de justificaciones y solicitudes, emisión documental y comunicaciones. Reportes permitidos de esos ámbitos. | No valida pagos ni modifica notas; no administra docentes/roles fuera de sus permisos. |
| TREASURY | Conceptos y pagos de matrícula, validación económica, dashboard financiero básico y reporte de pagos. | No aprueba matrículas, edita notas ni administra personas o usuarios. No es un ERP. |
| TEACHER | Sus cursos/asignación, roster aprobado, unidades/materiales, tareas/entregas, evaluaciones/notas y asistencia; reportes de sus cursos. | No accede a cursos de otros docentes ni a pagos, matrícula administrativa, usuarios o archivos ajenos. |
| STUDENT | Perfil, matrícula propia, cursos activos derivados de matrícula APPROVED, contenido publicado, entregas, notas/asistencia propias, solicitudes/documentos y avisos destinados a su cuenta. | No gestiona cursos, notas, asistencia ni reportes institucionales. No ve borradores ni datos de compañeros. |
| GUARDIAN | Perfil y estudiantes vinculados, matrícula, resumen de cursos/tareas/notas, asistencia, justificaciones, solicitudes/documentos y comunicaciones/notificaciones propias. | Vínculo familiar comprobado en cada consulta; no edita notas ni entrega tareas como estudiante; no tiene reportes institucionales. |

## Reportes y dashboards

ReportPolicy reutiliza los permisos de cada módulo. Administración puede consultar los veinte reportes con sus permisos. Secretaría accede a los reportes operativos y de asistencia permitidos; Tesorería al financiero; docente a notas, evaluaciones, tareas, asistencia, cursos y carga propios. Opciones de estudiantes para un docente se limitan a su roster aprobado.

El dashboard no otorga permisos de escritura. Las tarjetas institucionales comprueban el permiso correspondiente. El resumen familiar requiere profile.view, rol GUARDIAN activo y vínculo comprobado, y solo muestra notas publicadas de cursos disponibles para el estudiante. Las notificaciones son del usuario autenticado, no una lectura de la bandeja del menor.

## Reglas transversales

- Nuevas cuentas deben cambiar la contraseña inicial antes de usar rutas de negocio.
- Los permisos de Spatie se contextualizan por institución y se consultan en cada petición.
- Curso activo/asignación vigente y matrícula APPROVED determinan acceso estudiantil.
- El historial se conserva; observación, aprobación, rechazo, cierre y cancelación tienen operaciones específicas.
- Descargas privadas se autorizan de nuevo al pedir el archivo.
- Cambiar o retirar un vínculo o permiso modifica el acceso posterior.
- Las cuentas demo son de desarrollo, no credenciales productivas.
