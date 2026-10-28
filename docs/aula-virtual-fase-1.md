# Aula Virtual independiente — Fase 1

El Aula Virtual tiene su entrada en `/virtual` y un layout separado de la Gestión Institucional (`/app`). Ambos espacios comparten el mismo `AuthProvider`, sesión Sanctum, identidad, avatar y preferencia de tema. No se crean endpoints, permisos, tablas ni dependencias.

## Navegación y acceso

El botón **Ir al Aula Virtual** aparece en Gestión Institucional para Administración, Docentes y Estudiantes con permisos de contenido existentes. **Volver a Gestión Institucional** retorna a `/app` sin cerrar sesión. Las rutas antiguas permanecen disponibles, incluyendo `/app/my-courses`, `/app/courses` y las vistas personales de aprendizaje.

| Ruta | Contenido |
| --- | --- |
| `/virtual` | Bienvenida y tarjetas de cursos reales; total informado por la API |
| `/virtual/courses` | Cursos autorizados, búsqueda, estado y paginación |
| `/virtual/courses/:courseId` | Aula existente: unidades y materiales autorizados |
| `/virtual/courses/:courseId/classroom` | Unidades y materiales |
| `/virtual/courses/:courseId/assignments` | Tareas y entregas mediante componentes existentes |
| `/virtual/courses/:courseId/assessments` | Evaluaciones |
| `/virtual/courses/:courseId/scores` | Evaluaciones y sus calificaciones |
| `/virtual/materials` | Selección de curso para consultar sus materiales |
| `/virtual/assignments` | Tareas personales del estudiante; selección de curso para docentes/administración |
| `/virtual/assessments` | Evaluaciones personales del estudiante; selección de curso para docentes/administración |
| `/virtual/scores` | Calificaciones personales del estudiante; selección de curso para docentes/administración |

La navegación y las rutas comprueban los permisos reales `course-units.view`, `materials.view`, `assignments.view`, `assessments.view` y `scores.view`. Las pantallas por curso verifican primero el acceso al curso en Laravel. No se ofrecen enlaces a funcionalidades inexistentes.

## Reutilización y seguridad

- `TeachingPage` conserva la administración institucional y ofrece un modo de tarjetas enlazadas para el aula.
- `Classroom`, `CourseLearning`, `LearningPanel` y `CourseRoster` mantienen sus operaciones actuales. Los controles de escritura dependen de las capacidades devueltas por Laravel.
- Administración utiliza `/api/v1/courses` cuando cuenta con `courses.view`; docentes y estudiantes utilizan `/api/v1/my/courses`.
- El estudiante accede mediante matrícula `APPROVED`; el docente, mediante asignación autorizada. Las Policies siguen protegiendo cada recurso y el almacenamiento privado.
- Los endpoints personales `/api/v1/my/assignments`, `/api/v1/my/assessments` y `/api/v1/my/scores` se reutilizan para estudiantes. Para docentes se selecciona un curso, sin inventar un endpoint global.
- El listado de estudiantes se ofrece a docentes y a usuarios con `courses.view`; el backend aplica nuevamente la autorización.
- Matrículas, Tesorería, Portal de Familias y reglas de negocio no se modifican. Asistencia conserva su acceso institucional existente.

## Presentación

Layout propio, navegación de aprendizaje, tarjetas, estados de carga/error/vacío, naranja suave, beige, blancos y café. Se conservan el tema oscuro, la identidad y el avatar institucionales. La navegación se adapta a móvil y tablet; no se muestran porcentajes de progreso ni estadísticas simuladas.

## Validación

Validación focalizada del 26 de octubre de 2026:

- ESLint frontend: aprobado (`npm run lint`).
- TypeScript frontend y build Vite: aprobados (`npm run build`).
- TypeScript Cypress: aprobado (`npm run typecheck`).
- Pint: aprobado (`vendor/bin/pint --test`).
- Pest: **34/34**, 374 aserciones, ejecutando `Sprint5Test.php`, `Sprint6Test.php` y `Sprint7Test.php` en `zarate_test`. Incluye asignación docente, matrícula aprobada, privacidad, autorización e aislamiento institucional; sin nuevas pruebas backend.
- Cypress, resultado final consolidado: **28/28 aprobadas**. La repetición focalizada del 27 de octubre terminó con **15/15**, sin fallos ni omitidas; las otras 13 conservan su ejecución aprobada anterior. No representa una regresión completa del repositorio.

| Verificación | Aprobadas | Fallidas finales | No ejecutadas del alcance | Evidencia |
| --- | ---: | ---: | ---: | --- |
| Pest cursos/materiales/aprendizaje | 34 | 0 | 0 | `virtual-phase1-pest.log` |
| Cypress Aula Virtual independiente | 3 | 0 | 0 | `virtual-phase1-verified.log` |
| Cypress materiales y privacidad | 3 | 0 | 0 | `virtual-phase1-verified.log` |
| Cypress autenticación y roles | 9 | 0 | 0 | `virtual-phase1-verified.log` |
| Cypress cursos/asignaciones | 3 | 0 | 0 | `virtual-phase1-regression.log` |
| Cypress tareas/entregas/calificaciones | 3 | 0 | 0 | `virtual-phase1-regression.log` |
| Cypress Matrículas/Tesorería | 3 | 0 | 0 | `virtual-phase1-regression.log` |
| Cypress Gestión Académica | 4 | 0 | 0 | `virtual-phase1-regression.log` |
| **Total de casos únicos verificados** | **62** | **0** | **0** | 34 Pest + 28 Cypress |

La regresión completa de todos los sprints no se ejecutó: queda fuera del alcance de esta validación focalizada. ESLint, TypeScript frontend, build y Pint conservan sus resultados aprobados del 26 de octubre porque no hubo cambios funcionales posteriores. TypeScript Cypress se confirmó el 27 de octubre. Se revisaron las capturas del dashboard y el comportamiento responsive; no se detectaron errores visuales pendientes en las vistas comprobadas.

**Estado: COMPLETA.** Se verificaron navegación entre espacios sin perder sesión, recursos reales, permisos, acceso sin matrícula denegado y compatibilidad de los módulos institucionales cubiertos. No hay pendientes funcionales conocidos de esta fase. No se implementó Fase 2.

Se conservan los logs locales en `.tools/virtual-phase1-pest.log` y `.tools/virtual-phase1-regression.log`. No se ejecuta una regresión completa de todos los sprints ni se contabilizan reejecuciones como pruebas nuevas.

Durante la validación se corrigieron las cabeceras `Origin` y `Accept` de las peticiones directas del nuevo test para usar la sesión Sanctum como la SPA. Las capturas se limitan al viewport para evitar bloqueos al componer páginas largas. En el test existente de autenticación se espera la respuesta de sesión antes de comprobar el rechazo de la ruta protegida.

Diagnóstico de los incidentes: la regresión inicial tuvo 23/28 aprobadas; dos fallos correspondían a capturas que agotaban su espera, uno a comprobar permisos antes de resolver la sesión y dos a demoras de consulta/carga en materiales. Las correcciones de test mantienen las aserciones; materiales aprobó posteriormente sin modificar sus tests ni ampliar tiempos. No se identificó una regresión funcional del Aula Virtual. Cypress emite una advertencia de deprecación de Electron, sin impedir la validación.

Verificación del 27 de octubre: MySQL `3307`, Laravel `8000` y Vite `5173` disponibles. Al iniciar PHP directamente se detectó un directorio de trabajo incorrecto para el router de Laravel: HTTP 200 por sí solo no acreditaba una respuesta API válida. Se corrigió exclusivamente el proceso local para ejecutarlo desde `backend/public`; `/api/health` directo y mediante Vite devolvió `application/json` y `{"status":"ok","service":"backend"}`. La ejecución afectada (`.tools/virtual-phase1-final.log`) se interrumpió y se clasifica como fallo de infraestructura de prueba, no como regresión funcional.

No se ejecutaron migraciones ni reinicios de bases de datos. La repetición posterior conserva los tiempos de espera y las aserciones originales; su evidencia se guarda en `.tools/virtual-phase1-verified.log`.

## Archivos de esta fase

Creados:

- `frontend/src/layouts/VirtualLayout.tsx`
- `frontend/src/virtual/VirtualDashboard.tsx`
- `frontend/src/virtual/VirtualPages.tsx`
- `frontend/src/virtual/access.ts`
- `frontend/src/courses/CourseCards.tsx`
- `e2e/cypress/e2e/virtual.cy.ts` (3 casos nuevos)
- `docs/aula-virtual-fase-1.md`

Modificados:

- `frontend/src/App.tsx`
- `frontend/src/layouts/AppLayout.tsx`
- `frontend/src/courses/TeachingPage.tsx`
- `frontend/src/learning/CourseLearning.tsx`
- `frontend/src/index.css`
- `e2e/cypress/e2e/auth.cy.ts` (espera explícita de sesión; sin casos nuevos)
- `README.md`

## Prueba manual

1. Iniciar los servicios locales habituales y abrir `http://localhost:5173/login`.
2. Ingresar con `student@zarate.test` y contraseña demo `ZarateDemo2026!`; pulsar **Ir al Aula Virtual**.
3. Abrir un curso, consultar materiales y navegar por Tareas, Evaluaciones y Calificaciones. Volver a Gestión Institucional y comprobar que la sesión continúa.
4. Repetir con `teacher@zarate.test`: seleccionar el curso demo y comprobar sus herramientas y listado de estudiantes autorizados.
5. Con `administrator@zarate.test`, comprobar las tarjetas de cursos de su institución.
6. Con `student2@zarate.test`, sin matrícula aprobada para el curso demo, comprobar que no puede entrar a ese curso mediante URL directa.
7. Con `treasury@zarate.test`, comprobar que no aparece el acceso al aula y que `/virtual` lo deniega; Tesorería permanece en Gestión Institucional.
8. Probar ventanas de PC, tablet y móvil, y alternar el tema antes de cambiar de espacio.

Esta entrega comprende únicamente la Fase 1.
