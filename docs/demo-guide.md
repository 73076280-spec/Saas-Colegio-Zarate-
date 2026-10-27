# Guía de demostración — 10 a 15 minutos

## Preparación

Iniciar los tres servicios según README. Abrir http://localhost:5173/login y usar siempre localhost. Institución ZARATE; clave inicial ZarateDemo2026! salvo cambio previo. No reseedear ni resetear contraseñas antes de exponer.

El comando `php artisan db:seed --class=DevelopmentSeeder` prepara los datos completos en local/testing. Usar DEMO-MAT-2026 (1.º A), DEMO-COM-2026 (1.º A), DEMO-CYT-2026 (2.º A) y DEMO-ING-2026 (2.º A). En **Mis cursos**, elegir **Entrar al curso** para abrir una página propia por curso; desde ahí se pueden crear/publicar materiales y unidades, tareas y evaluaciones, registrar notas y asistencia, y consultar entregas y alumnos. Cada curso tiene datos de muestra para probar las pantallas, que operan mediante la API y guardan sus cambios. El docente `teacher@zarate.test` tiene alumnos aprobados en ambos rosters; student2@zarate.test se mantiene observado y no debe aparecer en ellos. El estudiante principal es student@zarate.test y su apoderado guardian@zarate.test. Buscar por nombre/código: los registros E2E acumulados pueden desplazar la demo de la primera página. La demostración usa datos ficticios y consulta registros existentes; cualquier nueva operación debe tener un nombre de prueba reconocible.

## Recorrido sugerido (14 minutos)

| Tiempo | Cuenta / rol | Acción concreta | Qué explicar y mostrar |
| --- | --- | --- | --- |
| 0:00–0:40 | administrator@zarate.test | Login → Ingresar → Inicio. | Autenticación institucional, rol y sesión. |
| 0:40–1:20 | Administrador | Dashboard → Año académico → Actualizar indicadores. | KPIs reales, matrículas por estado, estudiantes por nivel y actividad reciente; no valores fijos. |
| 1:20–2:00 | Administrador | Gestión Académica → Años académicos → buscar 2026 → Detalle; Niveles educativos → Ver grados → Ver secciones. | Año, periodos, jerarquía y capacidad de sección. |
| 2:00–2:30 | Administrador | Personas → Estudiantes → buscar Demo STUDENT → detalle. | Perfil, cuenta institucional y vínculo familiar. |
| 2:30–3:10 | secretary@zarate.test | Cerrar sesión, ingresar → Matrículas → buscar estudiante demo → detalle/historial. | Estado APPROVED, transiciones, cupos y separación entre revisión y validación económica. |
| 3:10–3:50 | treasury@zarate.test | Cerrar sesión, ingresar → Tesorería → consultar pago demo. | Concepto de matrícula, monto, estado y validación. Si ya está pagado, mostrar evidencia; no revalidarlo artificialmente. |
| 3:50–4:30 | teacher@zarate.test | Cerrar sesión, ingresar → Mis cursos → buscar Matemática/demo → Entrar al curso. | Docente asignado, sección y roster aprobado. |
| 4:30–5:10 | Docente | Aula Virtual → Unidad 1: números naturales → Guía de números naturales (demo) → descargar. | Solo publicados para estudiantes; archivo privado autorizado. |
| 5:10–5:50 | Docente | Tareas → Ejercicios de números naturales (demo) → entregas. | Plazo, contenido entregado e intentos; Revisar entrega si procede. |
| 5:50–6:30 | Docente | Evaluaciones → Práctica de números naturales (demo); Calificaciones → Historial. | Nota demo, escala y trazabilidad de modificación con motivo. |
| 6:30–7:00 | Docente | Asistencia → Abrir asistencia. | Sesiones, presentes/faltas/tardanzas; cierre y roster. |
| 7:00–8:00 | student@zarate.test | Cerrar sesión, ingresar → Mis cursos / Mis entregas / Mis notas. | Perspectiva del estudiante: entrega propia y nota publicada; no controles docentes. |
| 8:00–8:50 | guardian@zarate.test | Cerrar sesión, ingresar → dashboard → Asistencia de mis estudiantes. | Solo alumno asociado, resumen de notas y falta con justificación; no datos de otros alumnos. |
| 8:50–9:40 | Estudiante o apoderado | Mis solicitudes → abrir constancia demo → historial. | Código generado, observación/corrección y seguimiento. Opcional: Nueva solicitud ficticia propia. |
| 9:40–10:40 | secretary@zarate.test | Cerrar sesión, ingresar → Solicitudes académicas → detalle; Documentos académicos. | Revisión/observación/aprobación y documento privado. Mostrar estado real, sin forzar transiciones de un trámite terminado. |
| 10:40–11:30 | Secretaría | Comunicaciones → abrir comunicado demo; campana → Mis notificaciones. | Destinatarios, publicación, lectura individual/masiva. La superposición de criterios no duplica avisos. |
| 11:30–12:40 | administrator@zarate.test | Cerrar sesión, ingresar → Reportes → Estudiantes activos → buscar Demo → seleccionar estudiante → Aplicar filtros → Exportar CSV. | Correspondencia entre filtro, tabla y CSV; después mostrar Ocupación y cupos o Notas por periodo. |
| 12:40–14:00 | Administrador | Auditoría; abrir documentación de trazabilidad y métricas. | Operaciones por institución; 24 RF con evidencia y cifras reales del cierre. Cerrar sesión. |

Si se desea mostrar una entrega nueva, elegir una tarea publicada cuyo plazo/regla lo permita y un estudiante sin entrega vigente. No alterar fechas o notas estables solo para fabricar una escena. Las pruebas E2E ya cubren los flujos completos de escritura.

## Mensaje de sustentación

Explicar primero el problema de información dispersa, luego la separación de responsabilidades y roles. Mostrar una regla comprobable: otro estudiante no accede a un documento, una matrícula sin pago/cupo no se aprueba, o un apoderado no cambia de estudiante arbitrariamente. Cerrar con trazabilidad, regresión y límites documentados.

El producto demuestra procesos académicos institucionales; no declara integración bancaria, libreta oficial PDF, email, SMS, ERP ni despliegue productivo.
