# Manual de prueba por rol

Abrir http://localhost:5173/login. Institución: ZARATE. Contraseña inicial demo: ZarateDemo2026! (si no fue cambiada). No restablecerla para ejecutar este manual. Cerrar sesión antes de cambiar de cuenta. Usar registros ficticios de demostración; las operaciones registran auditoría.

## Administrador — administrator@zarate.test

Menús: Inicio, Mi perfil, Usuarios, Institución, Roles y permisos, Auditoría, Gestión Académica, Personas, Matrículas, Tesorería, Asignación docente, Cursos, Justificaciones, Solicitudes académicas, Documentos académicos, Comunicaciones, Mis notificaciones y Reportes.

Debe: ver indicadores reales; seleccionar año; consultar catálogos/personas; gestionar permisos válidos; abrir un curso; filtrar un reporte y exportar CSV; consultar auditoría.
No debe: acceder por URL/ID a otra institución, desactivarse indebidamente o dejar la institución sin administrador. Crear solicitudes exige perfil propio de estudiante/apoderado.

## Secretaría — secretary@zarate.test

Menús de consulta/gestión académica y personas autorizadas, Matrículas, Cursos, Justificaciones, Solicitudes académicas, Documentos académicos, Comunicaciones, notificaciones y reportes operativos.

Debe: observar y revisar matrícula, comprobar impedimento de aprobación sin pago/cupo, tramitar solicitudes, emitir documento privado, revisar justificación y publicar comunicación.
No debe: validar pagos, asignarse privilegios, registrar notas o consultar archivos de otra institución.

## Tesorería — treasury@zarate.test

Menús: Inicio, Mi perfil, Tesorería, Comunicaciones, Mis notificaciones, Reportes y cambio de contraseña.

Debe: ver importes reales y pendientes, consultar pago de matrícula, validarlo con datos correctos, comprobar cambio de indicador y exportar reporte financiero.
No debe: aprobar una matrícula académica, gestionar estudiantes/usuarios ni acceder a calificaciones.

## Docente — teacher@zarate.test

Menús: Inicio, Mi perfil, consultas académicas permitidas, Mis cursos, Comunicaciones, Mis notificaciones y Reportes.

Debe: abrir DEMO-MAT-2026, consultar roster, Aula Virtual, Tareas, Evaluaciones, Calificaciones y Asistencia; revisar entrega o registrar datos en un registro de prueba habilitado.
No debe: abrir curso de otro docente, revisar entrega ajena, publicar en curso inactivo ni calificar fuera de periodo habilitado.

## Estudiante — student@zarate.test

Menús: Inicio, Mi perfil, Mi matrícula, Mis cursos, Mis tareas, Mis entregas, Mis evaluaciones, Mis notas, Mi asistencia, Mis solicitudes, Documentos académicos, Comunicaciones y Mis notificaciones.

Debe: consultar matrícula APPROVED, contenido publicado, descargar material, abrir su entrega/nota, consultar asistencia, registrar solicitud propia y marcar aviso leído.
No debe: ver borradores, compañeros, archivos ajenos ni reportes institucionales; editar notas o gestionar estados administrativos. Si el plazo está vencido, el sistema aplica la regla real de entregas tardías.

## Apoderado — guardian@zarate.test

Menús: Inicio, Mi perfil, Mi matrícula, Asistencia de mis estudiantes, Mis solicitudes, Documentos académicos, Comunicaciones y Mis notificaciones.

Debe: ver únicamente estudiantes asociados, resumen de matrícula/notas/asistencia, abrir falta y registrar justificación, crear solicitud para estudiante vinculado y consultar su seguimiento.
No debe: cambiar student_id por otro alumno, consultar bandeja ajena, modificar notas, gestionar cursos ni entregar tareas como estudiante.

## Comprobaciones compartidas

1. Recargar mantiene sesión; Cerrar sesión invalida acceso a /app.
2. Cambiar a 390 px: navegación, tablas con desplazamiento interno y formularios sin desborde de página.
3. Filtros y paginación conservan institución y permisos; CSV corresponde al filtro aplicado y no solo a la página.
4. URL/API ajena devuelve 403/404 o 422 para selector inválido, sin datos privados.
5. Un documento cancelado deja de descargarse por estudiante/apoderado.
6. Una comunicación con criterios superpuestos genera una notificación por destinatario.
7. Comparar indicadores contra reportes del mismo año, estado y criterio; no confundir alumnos únicos con matrículas/intentos.

Evidencia automatizada: suites auth, academic, people, enrollment, courses, classroom, learning, attendance, office y reports de Cypress, más pruebas Pest de autorización y aislamiento.
