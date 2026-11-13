# Resultado de integración local — Prompt 49

Fecha: 12/11/2026, America/Lima. **C. INTEGRACIÓN PARCIAL CON CONFLICTOS.**

Se creó el candidato y se preservaron ambos historiales para su fusión. No se resolvieron los dos conflictos funcionales, no existe un commit de integración y no se hizo push. La compilación y las pruebas del candidato quedan pendientes: no se presenta como una versión lista para publicar.

## Ramas, commits y estado conservado

| Elemento | Identidad / resultado |
|---|---|
| Revisión QA histórica | `1a043035c126a5bc3e5ed14cf43fdd49a4e171bf` más 603 archivos sellados |
| Rama de origen | `test/integracion-misional` |
| Commit local público creado | `01b4c963f3aa8183d32aea7c7c8e4f5ff118475c` — `test(qa): registrar cierre validado y evidencias publicas de entrega` |
| Contenido de ese commit | 54 rutas: 52 documentos y dos archivos Cypress; 15.345 inserciones y una eliminación |
| Candidato | `integration/eco-aula-entrega-final` |
| Worktree candidato | `D:/zarate-saas-entrega-final` |
| Base y HEAD actual del candidato | `0d986126da3e21cf96e15a0a881d165727d5d5ff` — `origin/main` actualizado |
| MERGE_HEAD pendiente | `01b4c963f3aa8183d32aea7c7c8e4f5ff118475c` |
| Ancestro común de main remoto y origen | `8a8f42a46adb7f46f2e834b15af97e434192cde8` |
| Main local, sin modificaciones | `8a8f42a46adb7f46f2e834b15af97e434192cde8` |
| Macro misional, sin avanzar | `4e40a13af02475cd153bc4e4df01472a04dcefda` |

El fetch autorizado confirmó el mismo remoto observado en Prompt 48. Se incorporaron al inventario local cuatro referencias remotas antes ausentes; origin/main avanzó desde el caché 8a8f42a hasta 0d98612, sin cambiar main local ni su árbol. Los dos commits remotos son 18da310 (cursos docentes interactivos) y 0d98612 (merge de PR #1). No son cambios nuevos hechos por esta intervención.

Antes del commit local, main remoto y test tenían 2/51 commits exclusivos; después de 01b4c96, 2/52. Macro es ancestro de test: este último ya contiene sus 31 commits respecto de la base común, más los 20 commits de documentación QA y el nuevo commit público. Por eso se ensayó **una sola fusión de test sobre el candidato basado en main remoto**, sin fusionar de nuevo las seis ramas funcionales ni alterar macro y su worktree con pendientes.

El ensayo fue `git merge --no-ff --no-commit test/integracion-misional`; devolvió 1 por conflictos. El índice conserva 196 rutas modificadas/añadidas sin conflicto respecto del main remoto y dos rutas sin resolver. Son cambios de todo el historial misional/QA, no 196 archivos creados por Prompt 49. HEAD aún no contiene esa fusión: están en el árbol/índice pendientes.

## Auditoría de los archivos públicos

Se examinó cada una de las [54 rutas del manifiesto](plan-integracion-final-github.md#contenido-que-se-propone-versionar): existencia, contenido completo, tipo de archivo, diferencias/sellos, dependencias y patrones sensibles. El informe privado individual registra ruta, tamaño, líneas, SHA-256 y hallazgos por archivo. La lista preparada coincidió exactamente con el manifiesto; no se utilizó `git add .`.

- **52 documentos:** evidencia histórica, prompts, matrices y planes. La modificación preexistente de evidencias-finalizacion-migraciones.md agrega el registro histórico del Prompt 24; sus resultados parciales no se sustituyeron por cifras de campañas posteriores.
- **Dos Cypress:** integration.cy.ts y observeHealth.ts, coincidentes con las fuentes selladas. El test depende del helper y ambos se registraron juntos. Observan HTTP real; no agregan un caso distinto al inventario de 46 E2E.
- **Cero coincidencias** con valores privados conocidos examinados, cero patrones de claves/tokens de alta señal y cero rutas privadas seleccionadas. No se identificaron datos personales sensibles en esas 54 rutas; no equivale a una auditoría exhaustiva de toda la historia.
- Los dos hallazgos numéricos auxiliares eran referencias al identificador público del propietario del repositorio; no documentos de identidad institucionales.

Los literales demo/prueba públicos señalados en Prompt 48 no se equiparan a credenciales privadas. No están en las 54 rutas seleccionadas y no se cambiaron seeders ni aserciones para retirarlos. Se conserva la advertencia de higiene para revisión final; no se declara que el repositorio entero carezca de contraseñas literales.

El diff preparado se conservó privadamente antes del commit y `git diff --cached --check` aprobó. La captura inicial del diff completo superó el búfer predeterminado de Node (ENOBUFS): el staging ya había finalizado y no se repitió. Se recuperó únicamente la captura con un límite de salida suficiente; no fue un fallo funcional ni de Git. Las advertencias CRLF→LF corresponden a la normalización de Git; no se reescribieron los originales para cambiar los sellos de la copia validada.

Los dos documentos de seguimiento de la fase F —este informe y el anexo del plan— se registran separadamente del commit inicial de 54 rutas. Constituyen documentación expresamente solicitada por Prompt 49. Su registro en la rama de origen no cambia el MERGE_HEAD del ensayo ya abierto; deben incorporarse tras resolverlo, sin reiniciarlo.

## Conflictos reales y propuesta pendiente de aprobación

### App.tsx — un bloque

Ruta: `frontend/src/App.tsx`, marcadores actuales en líneas 77, 80 y 88 del candidato.

- **Main remoto:** agrega `/app/my-courses/:id` con `Protected` y `TeachingPage personal`; conserva el acceso antiguo a matrícula como página única.
- **Misional:** sustituye esa página única por el Centro de Matrículas con EnrollmentLayout y rutas de dashboard, lista, nueva matrícula protegida, cupos e historial; conserva además las rutas independientes de Aula Virtual.
- **Propuesta, NO aplicada:** conservar la ruta `my-courses/:id` del remoto y el bloque completo anidado de matrículas del lado misional. Eliminar únicamente la ruta antigua de matrícula que quedaría duplicada. Conservar `Protected`, el permiso de creación de matrícula y las rutas `/virtual` existentes.
- **Motivo para detener:** la unión determina el enrutamiento efectivo de cursos y matrículas. Aunque ambos cambios pueden coexistir, no se aplica una resolución funcional sin la revisión exigida por el usuario.

### TeachingPage.tsx — tres bloques y dependencias semánticas

Ruta: `frontend/src/courses/TeachingPage.tsx`, bloques que comienzan en las líneas actuales 10, 21 y 53 del candidato.

| Bloque | Main remoto | Misional | Propuesta NO aplicada |
|---|---|---|---|
| Imports | useNavigate y useParams | CourseCards | Conservar ambos imports y sus consumidores; no elegir un lado completo. |
| Firma y contexto | Parámetro de ruta, detailView, courseId y navegación institucional | Props virtualMode, courseSection y heading | Conservar la firma ampliada y los hooks del remoto; delimitar el detalle por URL al contexto institucional personal, sin alterar VirtualCourse. |
| Cabecera y creación | Título de detalle y botón de regreso a `/app/my-courses` | Cabecera contextual y ocultación de creación en virtualMode | Componer la cabecera según contexto; mostrar regreso solo en detalle institucional y conservar `!virtualMode && !personal && can('create')`. |

No basta retirar marcadores. La fusión automática también combina los efectos de carga y detalle del remoto con CourseCards y las capacidades `courseTabs(user)` del código validado. Deben conservarse:

1. Listado personal por `/api/v1/my/courses`, detalle por `/api/v1/courses/:id`, validación del ID y rechazo del servidor a cursos ajenos.
2. CourseCards: `onOpen` para detalle institucional; enlaces `/virtual/courses/:courseId/:section?` para Aula Virtual. No desviar esos enlaces hacia `/app`.
3. Props virtualMode/courseSection/heading usadas por VirtualSection y exportación CourseRoster usada por VirtualCourse.
4. Ocultación de controles administrativos por contexto y permisos; predicado `courseTabs(user).length > 0`, sin volver a depender del permiso de materiales para mostrar tareas o notas autorizadas.
5. Fechas, cierre, entrega, retroalimentación, filtros y acciones existentes de aprendizaje sin cambios de reglas.
6. Carga y errores visibles al consultar el detalle. En el texto fusionado provisional, el Message de error queda dentro de `!detailView`: debe revisarse antes de decidir la resolución; no se aplica una corrección silenciosa ni se presenta el provisional como componente funcional.

La propuesta requiere revisar navegación directa, recarga, regreso al listado, selección sucesiva de cursos, respuesta tardía y estados 403/404. No se tomó código de los siete pendientes para resolver ninguno de estos problemas.

### README.md y cambios remotos conservados

README se fusionó automáticamente: conserva el contenido remoto y añade el enlace a Aula Virtual. No existe conflicto textual pendiente en README. No hubo resoluciones manuales de código.

Los otros 13 archivos del cambio remoto de 16 rutas conservan exactamente su blob de origin/main en el índice: siete seeders, docker-compose.yml, docs/demo-guide.md, docs/pruebas.md, docs/sprints/sprint-1.md, courses.cy.ts y vite.config.ts. No se ejecutaron esos seeders. Sus datos sintéticos y los nuevos cuatro cursos no son el fixture de la campaña congelada de Prompt 47.

## Comprobaciones realizadas y no ejecutadas

| Comprobación | Resultado real |
|---|---|
| Fetch y grafo Git | Aprobados; remoto igual al observado en Prompt 48 |
| Manifiesto preparado | Exactamente 54 rutas; ningún archivo privado ni pendiente funcional |
| Fuentes QA originales | 603/603 sellos SHA-256 conservados en el worktree de origen |
| Documentos históricos sellados del Prompt 47 | 4/4 intactos |
| Commit público vs revisión QA en frontend/backend | Sin diferencias; el nuevo commit registra documentación y el par Cypress ya sellado |
| 54 archivos en índice candidato vs commit 01b4c96 | 54/54 blobs iguales en el checkpoint anterior a documentar el resultado |
| Dependencias y locks frontend/E2E/backend | Seis archivos idénticos entre revisión QA, main remoto e índice candidato; ninguna dependencia agregada o instalada |
| Migraciones originales en el candidato | 14/14 blobs idénticos a 1a04303; ninguna ejecución SQL |
| Siete pendientes | 7/7 hashes conservados; seis versiones confirmadas del candidato coinciden con 1a04303 y el hook pendiente no existe allí |
| Rutas privadas rastreadas en el candidato | Ninguna .tools, Microsoft/, .env real, dump, clave/certificado privado o log |
| `git diff --check` en origen | Aprobado |
| `git diff --cached --check` en candidato | Aprobado para el contenido fusionado del índice; no certifica la resolución de las dos entradas unmerged |
| `git diff --check` en árbol candidato | **Salida 2:** 12 líneas de marcadores de conflicto en dos archivos; no aprobado |
| Build frontend y ESLint del candidato | **NO EJECUTADOS:** existen conflictos sintácticos/funcionales sin resolver |
| TypeScript E2E y pruebas focalizadas de integración | **NO EJECUTADOS:** la fase E requiere primero un candidato integrado; no se acredita comportamiento del código provisional |
| Pest y Cypress completos | **NO REEJECUTADOS**, conforme al alcance |
| Migraciones, seeders, conexiones o restauraciones SQL | **NO EJECUTADOS** |
| Push, cambio de main, stash o modificación de pendientes | **NO REALIZADOS** |

Las cifras históricas permanecen: Pest individual y regresión 314/314, 2.057 aserciones por campaña; E2E individual y regresión 46/46. Corresponden a 1a04303 más fuentes selladas, no al candidato. Esta intervención no añade casos aprobados ni confirma un defecto funcional nuevo de la versión validada: acredita dos conflictos de integración.

## Exclusiones e integridad

Worktree `D:/zarate-saas-macro-misional`, rama feature/macro-misional: permanecen modificados enrollment/shared.tsx, learning/CourseLearning.tsx, learning/ScoreForm.tsx, learning/SubmissionForm.tsx, learning/shared.tsx y reports/ReportsPage.tsx; sigue sin seguimiento learning/useFieldErrors.tsx. No se aplicó stash ni se alteró ninguno de sus contenidos.

Se excluyeron también .tools, Microsoft/Windows/PowerShell/ModuleAnalysisCache, credenciales, datadirs, certificados privados, trazas crudas y dependencias instaladas. El caché Microsoft/ preexistente permanece sin seguimiento en origen; no se borró ni agregó. Ningún servicio de demostración o privado fue iniciado o detenido para esta integración.

Evidencia privada no publicable: `.tools/qa-final47/evidence/prompt49/preflight.json`, staged-files.json, staged-public.diff, merge-conflicts.diff, las dos copias de archivos con conflicto e integration-checkpoint.json. Los respaldos de los siete y el plan histórico del Prompt 48 permanecen disponibles sin sobrescritura.

## Continuación exacta y publicación posterior

1. Revisar y autorizar la propuesta de resolución de los dos componentes. No reiniciar el ensayo ni ejecutar otro merge mientras exista MERGE_HEAD.
2. Aplicar solo la resolución aprobada; preparar únicamente esos dos archivos y comprobar ausencia de entradas unmerged y marcadores. Revisar todo el diff combinado y la conservación de matrículas, Aula Virtual, cursos y permisos.
3. Completar build, ESLint, TypeScript E2E y las comprobaciones focalizadas autorizadas con dependencias y fixture propios del candidato. No ejecutar los launchers históricos sellados contra otro árbol ni usar bases de desarrollo para forzar la reproducción. No atribuir las regresiones completas anteriores a esa nueva versión.
4. Solo tras esos controles, registrar el merge local pendiente. Incorporar después la documentación complementaria de test/integracion-misional, si su HEAD avanzó respecto de MERGE_HEAD; verificar ese delta antes de otra fusión.
5. Revisar higiene pública, árbol final y políticas de GitHub. Publicar únicamente con autorización posterior; main local y remoto siguen protegidos.

Comandos de inspección que no resuelven conflictos:

```powershell
$candidato = 'D:\zarate-saas-entrega-final'
git -C $candidato status --short
git -C $candidato rev-parse HEAD MERGE_HEAD
git -C $candidato diff --cc -- frontend/src/App.tsx frontend/src/courses/TeachingPage.tsx
git -C $candidato diff --name-only --diff-filter=U
```

Después de resolver, validar y registrar el candidato con autorización, la publicación propuesta es mediante rama candidata y revisión hacia main. No ejecutar todavía:

```powershell
# AUTORIZACIÓN POSTERIOR y candidato final limpio/aprobado requeridos.
git -C D:\zarate-saas fetch origin
# Si origin/main cambió, volver a auditar antes de publicar.
git -C D:\zarate-saas push --dry-run origin integration/eco-aula-entrega-final
if ($LASTEXITCODE -ne 0) { throw 'Revisar políticas y referencias; no publicar' }
git -C D:\zarate-saas push origin integration/eco-aula-entrega-final
# Preparar PR candidato -> main solo con autorización; sin force ni promoción directa de main.
```

No se ejecutó ninguno de esos push ni se creó PR. La preparación se detuvo en la revisión funcional exigida por Prompt 49, conservando el commit público, ambos historiales y el estado exacto del ensayo para continuar.

---

## Prompt 50 - Estado vigente de integracion local

Fecha: 12/11/2026.

Estado: B - Integracion local completada con validaciones pendientes.

Se resolvieron los conflictos funcionales de App.tsx y TeachingPage.tsx, conservando las rutas de cursos, matriculas y Aula Virtual.

Commits de integracion:
- f5becce: integracion funcional.
- e4e6c58: incorporacion documental.

Comprobaciones del candidato:
- Compilacion frontend: aprobada.
- ESLint focalizado: aprobado.
- TypeScript: aprobado.
- Cypress con API simulada: 17/17 aprobados.
- Conflictos Git pendientes: ninguno.

La QA historica acredita 314/314 Pest y 46/46 E2E reales para la revision 1a04303 junto con sus archivos sellados.

Estas regresiones no se atribuyen automaticamente al candidato fusionado. Quedan pendientes las comprobaciones reales focalizadas de los cambios incorporados.

Los siete archivos funcionales aplazados no se incorporaron.

No se realizo push ni se modifico main.

La publicacion debe efectuarse primero mediante una rama candidata y posterior revision de Pull Request.
