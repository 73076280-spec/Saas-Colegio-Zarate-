# BOLT-MIS-003 — Evidencias de M-01

Fecha: 28/10/2026. Rama verificada: `feature/ensenanza-aprendizaje`. HEAD inicial: `0cd23ec`. El árbol de trabajo estaba limpio antes de esta intervención. Se leyeron `diagnostico.md`, `plan-mejoras.md` y `prompt-02-validacion.md` antes de modificar código.

## Problema y justificación

El menú virtual utilizaba `virtualSectionsFor`, que permite la consulta personal de notas a estudiantes con `scores.view`, mientras `courseTabs` exigía además `assessments.view`. El detalle institucional de cursos condicionaba todo `CourseLearning` a `materials.view` y `course-units.view`; por ello ocultaba tareas autorizadas a docentes sin acceso a materiales.

Se contrastaron `access.ts`, `CourseLearning.tsx`, `TeachingPage.tsx`, `VirtualLayout.tsx`, `App.tsx`, el menú institucional y los seeders y servicios de autorización existentes. `LearningAccess::visible` permite notas propias publicadas con `scores.view`, matrícula aprobada y curso elegible. No se necesita conceder permisos de evaluaciones para consultar `/api/v1/my/scores`. La autorización permanece en Laravel.

## Archivos realmente modificados o creados

| Archivo | Cambio |
| --- | --- |
| `frontend/src/learning/CourseLearning.tsx` | Reutiliza `virtualSectionsFor` para las pestañas; mantiene el criterio existente de asistencia; ofrece el acceso personal a notas cuando el estudiante carece de permiso de evaluaciones |
| `frontend/src/courses/TeachingPage.tsx` | Monta contenido si existe una pestaña autorizada, sin dependencia global de materiales |
| `e2e/cypress/e2e/virtual-access.cy.ts` | Nuevo spec con nueve casos focalizados de UI y sesiones simuladas |
| `docs/ai-dlc/misional/BOLT-MIS-003/prompt-03-implementacion-m01.md` | Prompt íntegro recibido, sin reconstrucción retrospectiva |
| `docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m01.md` | Este registro |

No fue necesario modificar `access.ts`, `VirtualLayout.tsx`, `VirtualPages.tsx`, `App.tsx` o el menú institucional: ya consumen el criterio reutilizado. No se alteraron backend, permisos, roles, dependencias, migraciones ni Centro de Matrículas. M-02 y M-03 no se implementaron.

## Cambios implementados

1. `courseTabs` deriva las secciones del mismo predicado que el menú y las tarjetas del aula, conservando la etiqueta institucional «Aula Virtual» y el tratamiento independiente de asistencia.
2. El detalle institucional utiliza `courseTabs(user).length > 0` para mostrar las actividades disponibles. Un permiso de tareas ya no depende de permisos de materiales.
3. En la pestaña Calificaciones, solo para el modo estudiante sin `assessments.view`, se muestra un enlace explícito a «Mis notas» en `/virtual/scores`. Se informa que la consulta reúne las calificaciones publicadas de todos sus cursos. Se reutiliza la pantalla personal con `/api/v1/my/scores`, evitando solicitar evaluaciones del curso sin autorización. No se finge un filtrado por curso que la API personal no ofrece.
4. Docentes, administración y estudiantes que ya disponen de permisos de evaluaciones conservan el recorrido anterior por evaluaciones y notas. Los perfiles mixtos conservan `studentLearning`: una cuenta STUDENT + TEACHER no se trata automáticamente como estudiante de consulta personal.

## Roles, permisos y escenarios comprobados

El spec nuevo simula `/auth/me` y respuestas API exclusivamente en Cypress, sin alterar roles ni permisos de base de datos. Comprueba comportamiento de interfaz, no sustituye una auditoría de autorización del servidor.

| Caso | Comprobación |
| --- | --- |
| STUDENT con `scores.view`, sin `assessments.view` ni materiales | Pestaña visible desde Gestión Institucional y curso virtual, acceso a nota personal, sin consultas de evaluaciones/materiales/unidades ni controles de registro de nota |
| TEACHER con `assignments.view/create`, sin materiales | Tareas y capacidad de crear devuelta por API en ambos espacios; no consulta unidades o materiales |
| TEACHER sin permisos de contenido | Sin panel de contenido institucional ni entrada al aula; URL virtual denegada |
| TEACHER con tareas, URL `classroom` | Sección denegada y sin solicitud de contenido restringido |
| ADMINISTRATOR, TEACHER y STUDENT con los permisos habituales de contenido | Se conservan cuatro pestañas y el panel previo de evaluaciones/calificaciones; tres casos independientes |
| STUDENT + TEACHER con solo `scores.view` | Conserva restricción del modo docente y no habilita aula sin sección disponible |
| TREASURY con permiso aislado de tareas | Se conserva restricción de entrada por rol |

Los permisos sintéticos delimitan los casos de UI; no prueban una política nueva para roles arbitrarios. El tipo de usuario actual conserva los seis nombres de roles existentes. No se amplía `canEnterVirtual` a otros roles.

## Pruebas y comprobaciones ejecutadas

| Comando y ubicación | Resultado |
| --- | --- |
| `npm run build`, `frontend` | APROBADO, código 0: `tsc -b` y build Vite, 99 módulos transformados |
| `npm run lint`, `frontend` | APROBADO, código 0, sin errores reportados |
| `npm run typecheck`, `e2e` | APROBADO, código 0: `tsc --noEmit` |
| `npm test -- --spec cypress/e2e/virtual-access.cy.ts`, `e2e` | APROBADO: 9 pruebas, 9 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas; código 0 |

La regresión existente se ejecuta con `npm test -- --spec cypress/e2e/virtual.cy.ts,cypress/e2e/courses.cy.ts,cypress/e2e/classroom.cy.ts,cypress/e2e/learning.cy.ts` desde `e2e`, contra los servicios locales y sus datos de prueba. Los specs de cursos/materiales/aprendizaje realizan las escrituras de prueba previstas por sus flujos; no se ejecutaron seeders ni se cambiaron datos de roles. No se modificaron estos specs para obtener resultados favorables.

| Spec de regresión existente | Resultado |
| --- | --- |
| `virtual.cy.ts` | 3 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `courses.cy.ts` | 3 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `classroom.cy.ts` | 3 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |
| `learning.cy.ts` | 3 aprobadas, 0 fallidas, 0 pendientes, 0 omitidas |

La ejecución conjunta de estos cuatro specs terminó con código 0: **12/12 aprobadas**, 0 fallidas, 0 pendientes y 0 omitidas, en 5 minutos y 49 segundos. Incluye navegación y sesión, denegación a estudiante sin matrícula aprobada y Tesorería, consulta docente, creación/activación/cierre de cursos, publicación/archivo y descarga privada de materiales, tarea/entrega/revisión y registro/consulta de calificaciones. Se generaron las cuatro capturas previstas por `virtual.cy.ts` en la carpeta de artefactos Cypress, sin incorporarlas al seguimiento Git.

Total de casos únicos ejecutados en esta intervención: **21 aprobados, 0 fallidos** en las ejecuciones funcionales completas: 9 de UI con API simulada y 12 de regresión existente con servicios reales. El intento de arranque fallido no ejecutó casos y no se suma a este total.

El primer intento de Cypress dentro del entorno restringido no llegó a ejecutar casos: falló al iniciar con `ERR_SYSTEM_ERROR`, `ENOMEM`, `uv_os_get_passwd`. La repetición fuera del sandbox inició Electron y terminó con los nueve casos aprobados; no se cuenta el intento inicial como fallo funcional ni como prueba adicional. Se corrigió antes de esa ejecución un selector del spec nuevo para distinguir el enlace de notas virtual del institucional; no se eliminaron aserciones.

Se comprobaron respuestas HTTP 200 y contenido JSON de `/api/health` directo en Laravel y mediante Vite; Vite respondió HTML en su raíz. Un intento de iniciar Vite informó puerto 5173 ocupado: se reutilizó el servicio existente, sin detener procesos. No se instalaron herramientas ni dependencias.

## Pruebas identificadas y límites

- Pest de Sprints 5–7: **NO EJECUTADA** en esta intervención. Se identificaron como cobertura existente de relaciones, autorización, privacidad e IDOR; no hubo cambios backend y no se necesitan para verificar la lógica React implementada. No se importan sus aprobaciones históricas como resultados actuales.
- El spec nuevo no valida seguridad contra una API real para permisos personalizados. La inspección de `LearningAccess` respalda el uso de la consulta personal y las pruebas de regresión real complementan la comprobación de UI.
- No se ejecuta una regresión completa de todo el repositorio ni una certificación de accesibilidad. No se cambian plazos, intentos, filtros, revisión o cierre de tareas.
- Cypress informa deprecación del navegador Electron; no impidió ejecutar el spec nuevo. No se actualizan dependencias en este alcance.

## Trazabilidad

M-01 mantiene acceso coherente a planificación (PM-02.2), publicación/consulta de materiales y tareas (PM-02.3), y tareas/entregas (PM-02.4). RF-22 Aula virtual es el requisito principal; RF-04 Gestión de roles y permisos es transversal, RF-10 Gestión de actividades académicas y RF-12 Entrega de actividades se conservan en navegación. RF-09 Consulta de calificaciones respalda el caso específico de notas propias. No se crean requerimientos ni se modifican reglas de negocio de estos RF.

## Revisión final y estado

`git diff --check`: APROBADO, sin errores detectados. Se comprobaron adicionalmente espacios finales y marcadores de conflicto en los tres archivos nuevos, aún sin seguimiento. Se retiró únicamente `e2e/cypress/downloads/classroom-demo.txt`, descarga generada por esta regresión y ausente del estado inicial, después de verificar su ruta absoluta; no se eliminaron archivos previos del usuario. El estado Git se limita a los cinco archivos enumerados; no se realizaron commit, push, merge ni Pull Request.

**M-01: COMPLETADO dentro del alcance aprobado.** Se corrigieron los dos puntos de navegación, se preservó el acceso personal existente sin pedir permisos adicionales y aprobaron compilación, tipos, lint, nueve casos nuevos y doce casos de regresión. Esto no acredita la suite completa del proyecto ni sustituye las verificaciones de seguridad del backend para todas las combinaciones de permisos. El recorrido especial de estudiante con solo notas es una consulta personal global explícita, no un listado nuevo filtrado por curso.
