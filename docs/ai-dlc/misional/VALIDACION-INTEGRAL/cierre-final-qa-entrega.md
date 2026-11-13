# Cierre final de QA y preparación académica — Prompt 48

Fecha: 12/11/2026 (America/Lima). Auditoría documental y Git; **no se ejecutaron Pest ni Cypress ni se integraron cambios**.

## Conclusión y versión recomendada

La campaña del Prompt 47 conserva clasificación **A para su contenido validado**: revisión 1a043035c126a5bc3e5ed14cf43fdd49a4e171bf junto con los 603 archivos sellados. Recomiendo entregar ese contenido funcional, con sus documentos de cierre y los dos archivos health ya sellados, sin los siete cambios pendientes. Un commit posterior que solo registre ese mismo contenido no debe presentarse como una ejecución nueva de pruebas.

La preparación para GitHub queda **condicionada a revisión**, no a otra campaña completa: el main remoto diverge del main local y contiene cambios funcionales no cubiertos por Prompt 47. Además hay literales demo/prueba ya rastreados que requieren una decisión de higiene para cumplir la instrucción de no publicar contraseñas. No se borró ni modificó ninguna evidencia histórica para ocultar esos hechos.

No se recomienda forzar main a 1a04303: perdería dos commits que ya existen en GitHub. El main final debe conservar el historial remoto mediante una integración revisada; ese futuro resultado tendrá otra identidad y necesitará comprobaciones focalizadas antes de atribuirle calidad propia. El cierre QA histórico permanece referido a 1a04303 y a sus sellos.

## Los siete archivos conservados

Todos están en el worktree D:/zarate-saas-macro-misional, rama feature/macro-misional, HEAD 4e40a13. Seis están modificados y uno es nuevo sin seguimiento. La base confirmada de los seis coincide con la versión validada; los cambios existen solo en la copia de trabajo. Autoría y aprobación: NO VERIFICADAS. No se detectó conflicto Git materializado: no se ensayó ninguna fusión.

| Ruta | Módulo | Diferencia respecto del contenido validado | Dependencias | Clasificación y recomendación | Riesgo |
|---|---|---|---|---|---|
| `frontend/src/enrollment/shared.tsx` | Matrículas, pagos y formularios de docencia | Añade useId y aria-labelledby al select de Lookup; conserva consultas, valores y paginación. Es un cambio de DOM/accesibilidad, no de reglas de matrícula. | React useId; consumidores EnrollmentForm, PaymentForm y TeachingForm. | Opcional y aplazable. Excluir de esta entrega. | Bajo–medio por reutilización transversal. |
| `frontend/src/learning/CourseLearning.tsx` | Cursos, Aula Virtual y asistencia | Añade navegación de pestañas con flechas/Home/End, activación por click, foco y relaciones ARIA. Cambia el comportamiento de teclado y el montaje de paneles. | React useId/KeyboardEvent; callbacks de pestaña; Classroom, LearningPanel y AttendanceCourse. | Opcional y aplazable. Revisar aparte; no incorporar como simple cambio cosmético. | Medio: navegación, foco y formularios con borrador. |
| `frontend/src/learning/ScoreForm.tsx` | Evaluaciones y calificaciones | Captura errores del servidor por campo, limpia marcas al enviar y agrega mensajes/ARIA. Conserva payload, endpoints, escala y motivo del cambio. | Nuevo useFieldErrors; LearningSelect con fieldError en learning/shared.tsx; ApiError existente. | Opcional y aplazable. No trasladar aisladamente. | Medio: registro/edición de notas y errores422. |
| `frontend/src/learning/SubmissionForm.tsx` | Tareas, entregas y revisión docente | Añade captura y mensajes por campo para contenido, archivo, feedback y estado. Conserva reglas de plazo y payloads. | Nuevo useFieldErrors; ApiError existente. No requiere por sí solo el nuevo LearningSelect. | Opcional y aplazable. Mantener con su dependencia. | Medio: archivos, devoluciones y conservación del texto. |
| `frontend/src/learning/shared.tsx` | Selectores de aprendizaje y evaluación | Añade prop opcional fieldError, useId, aria-invalid/describedby y un mensaje asociado; conserva carga API y páginas. | React useId; consumidores LearningForm y ScoreForm. ScoreForm pendiente necesita esta firma nueva. | Opcional y aplazable. Revisión conjunta con formularios. | Medio por uso compartido. |
| `frontend/src/reports/ReportsPage.tsx` | Reportes y exportación CSV | Traduce etiquetas de estados manteniendo value del servidor, añade accessibleLabel y anuncia totales con aria-live. Contiene el literal deteriorado «En revisi?n». | OfficeSelect ya admite accessibleLabel en la versión validada; DataTable/Pager existentes. | Experimental o no validado. Excluir; corregir el texto y validar antes de proponerlo. | Bajo–medio; defecto de presentación comprobado solo en esta copia no validada. |
| `frontend/src/learning/useFieldErrors.tsx` | Utilidad nueva de formularios de aprendizaje | Nuevo hook con estado de errores ApiError, IDs y generador de atributos/mensajes. No existe en la revisión validada. | React useId/useState y ApiError.errors existente. Lo importan los dos formularios pendientes. | Experimental o no validado. No necesario para entregar el código probado. | Medio: dependencia nueva y contrato de errores/ARIA. |

Ninguno es necesario para conservar la entrega que aprobó QA. Todos alteran archivos o comportamiento frente al estado sellado, incluso cuando solo modifican accesibilidad o mensajes. No se les atribuyen 314 Pest/46 E2E.

ScoreForm no puede incorporarse sin useFieldErrors y la firma fieldError de LearningSelect; SubmissionForm necesita useFieldErrors. El hook y shared pueden existir por separado, pero una revisión conjunta de los cuatro evita una integración incompleta. CourseLearning y Lookup son mejoras independientes. ReportsPage utiliza una prop que ya existe en OfficeSelect: no se identificó una dependencia faltante allí.

Se creó un respaldo privado por copia, con SHA256 y parche de los seis rastreados, en .tools/qa-final47/evidence/prompt48/pending-backup/. No se movieron los originales, no se aplicó stash y no se alteró ninguna rama. Los siete hashes coinciden con los conservados al cerrar Prompt 47.

### Comprobaciones si se propone incorporarlos después

| Grupo | Comprobaciones mínimas propuestas, NO ejecutadas |
|---|---|
| Todos los cambios frontend | Build (incluye TypeScript), ESLint y typecheck E2E sobre el candidato nuevo. No trasladar automáticamente los resultados de Prompt 47. |
| Lookup | Nombre accesible del select, teclado, búsqueda/paginación y selección de año/grado/sección; matrícula/pago y asignación docente. |
| CourseLearning | Tab/Shift+Tab, flechas/Home/End, foco y panel activo; permisos efectivos, cursos cerrados y conservación de borradores al cambiar de panel; Aula Virtual y Gestión Institucional. |
| ScoreForm/shared/hook | Errores422 asociados al campo y aria-describedby válido; alta/edición de nota, motivo obligatorio y conservación de valores; ausencia de cambios en payload/escala. |
| SubmissionForm/hook | Errores422 de texto/archivo/feedback/estado; entrega vigente/vencida, revisión/devolución y conservación de borradores. |
| ReportsPage | Corregir el literal deteriorado; verificar que los códigos status enviados no cambien, nombre accesible, total anunciado, filtros, páginas, CSV y móvil. |

Las pruebas UI con API simulada deben distinguirse de las que usan backend real. El backend no cambia en estos siete archivos: no se justifica repetir 314 Pest por una modificación exclusivamente frontend. Si cambia el contrato o se incorporan los seeders remotos, se requiere validación backend focalizada y aislada. No se ejecutó ninguna de estas comprobaciones en Prompt 48.

## Resumen académico de EcoAula SaaS

EcoAula SaaS es una plataforma web educativa multiinstitución orientada al Colegio Zárate de Huancayo. React 19/TypeScript presenta la interfaz; Laravel 13/PHP valida, autoriza y procesa la API; MySQL conserva los datos. Sanctum aporta sesión/CSRF y el sistema aplica permisos, contexto institucional y vínculos entre usuarios y registros. La documentación describe el alcance funcional y sus limitaciones; no se afirma certificación ISO ni aprobación del profesor.

| Módulos presentes en el contenido revisado | Referencias verificables |
|---|---|
| Identidad, roles/permisos, institución y auditoría | frontend/src/App.tsx; docs/roles-permissions.md; docs/final-system.md |
| Catálogos académicos y personas/vínculos familiares | frontend/src/academic/; frontend/src/people/; documentación Sprints2–3 |
| Centro de Matrículas, historial de matrícula, cupos y pagos | frontend/src/enrollment/; BOLT-MIS-002; docs/matriculas-fase-2-1.md |
| Asignación docente, cursos y Aula Virtual | frontend/src/courses/; frontend/src/virtual/; BOLT-MIS-003; docs/aula-virtual-fase-1.md |
| Unidades/materiales, tareas y entregas; evaluaciones y notas | frontend/src/classroom/; frontend/src/learning/; BOLT-MIS-003/004 |
| Asistencia, consulta personal/familiar y justificaciones | frontend/src/attendance/; BOLT-MIS-005 |
| Solicitudes, documentos, comunicaciones y notificaciones | frontend/src/office/; BOLT-MIS-006 |
| Reportes, filtros, CSV y dashboards por rol | frontend/src/reports/; docs/sprints/sprint-10.md |

Estas referencias confirman módulos existentes; no equivalen a que cada funcionalidad imaginable de educación o de otros macroprocesos esté implementada. No se presupone integración de las ramas remotas macro-apoyo o macro-estrategico.

### Resultados comprobados del Prompt 47

| Indicador | Resultado documentado |
|---|---|
| Pest individual |314/314, 2.057 aserciones |
| Regresión Pest |314/314, 2.057 aserciones,0 fallidos/omitidos |
| E2E individual |46/46 casos reales distintos |
| Regresión E2E |46/46 aprobados al cierre;0 sin resolver |
| Intentos de regresión E2E |47:46 positivos y1 fallido de sincronización conservado y después resuelto |
| Cypress con API simulada |141 históricos, separados; no se suman como E2E real |
| Health HTTP histórico |1 caso único,3 ejecuciones satisfactorias del Prompt 40; separado de los 46 |
| Nuevos defectos funcionales confirmados en la campaña consolidada |0 |
| Suspensiones posteriores a la referencia de campaña |0; los eventos anteriores se conservan |
| Nuevas ejecuciones de pruebas en Prompt 48 |0 |

Pest comprobó API/modelos, validaciones, permisos, relaciones, matrículas, cursos, aprendizaje, evaluación, asistencia, oficina/reportes, archivos y aislamiento institucional. La matriz final agrupa los 314 selectores únicos por archivo, método y dataset; cada ejecución acreditada conserva JUnit y verificación de rollback/baseline.

Cypress comprobó interfaz React, navegación, roles, formularios y operaciones a través de Laravel y MySQL reales. Se conservaron registros HTTP/SQL, resultados/JUnit y restauración después de cada caso. Los negativos CY39-008 y016 rechazan antes del acceso de aplicación a datos: no se inventó SQL para acreditarlos. No se publica un contador de aserciones runtime Cypress porque el reporte no lo proporciona;2.057 corresponde a Pest, no a una suma fabricada de ambas herramientas.

Se usó exclusivamente la instancia descartable 3310, bases qa47pest/qa47e2e, cuentas restringidas, TLS con verificación del servidor, UUID/datadir comprobados y leases firmados de máximo 120 s renovados tras controles válidos. Cada base conservó 52 tablas/14 migraciones originales; se verificaron integridad referencial y baselines. Las bases protegidas no se contactaron durante la continuación final; esto no es una nueva comparación global de sus filas. La inspección final dejó los procesos y puertos privados cerrados.

Se resolvieron incidencias del instrumental: sincronización de respuestas reales de logout, ruta de descargas CSV en el sandbox, transición de guarda previa a ejecutar Pest y dependencia de la consulta familiar antes de asistencia. Se mantuvieron las aserciones originales y los fallos históricos. No se corrigió código funcional para fabricar aprobaciones. El Bad Request de comunicación no demuestra fallo Laravel/Pest: el supervisor siguió ejecutándose y se recuperó sin reiniciarlo; su causa exacta no se determinó.

### Versión, adaptaciones y límites

La revisión validada es 1a043035c126a5bc3e5ed14cf43fdd49a4e171bf junto con 603 archivos sellados. Los dos archivos health pendientes ya coinciden con los sellos del contenido examinado: integration.cy.ts y observeHealth.ts se deben versionar juntos. No basta indicar solo el commit si se omiten esos archivos de la copia de trabajo validada.

El ejecutor privado vinculó credenciales, Origin, datos sintéticos, rutas y comprobaciones de identidad física al entorno descartable, y conservó correcciones de sincronización. Las fuentes públicas no son copias byte a byte de ese instrumental. Las evidencias distinguen esa adaptación: no se garantiza que un clon ejecute automáticamente esas cifras en CI, Docker o contra los puertos por defecto. No ejecutar los comandos habituales de pruebas contra datos de desarrollo para reproducir este informe.

La validación no cubre los siete archivos pendientes ni los 16 archivos del cambio remoto de main. Tampoco es una certificación ISO, pentesting externo, prueba de carga productiva o autorización de despliegue. Las limitaciones institucionales ya documentadas —por ejemplo área/asignatura, publicación independiente de resultados o expediente longitudinal— no se declaran resueltas por estas pruebas. Los conteos antiguos de los Sprints se conservan como históricos y no se sustituyen silenciosamente por 314/46.

## Auditoría de ramas y publicación

La lectura GitHub se realizó mediante el conector, sin fetch, cambios de refs, commits ni escrituras remotas. Sus13 ramas difieren del inventario local de9; origin/main local está desactualizado. El estado completo y los comandos están en [plan-integracion-final-github.md](plan-integracion-final-github.md).

| Comparación | Estado comprobado |
|---|---|
| main local 8a8f42a → macro 4e40a13 |Ancestro;0/31 commits exclusivos |
| macro 4e40a13 → test 1a04303 |Ancestro;0/20;44 archivos confirmados de documentación QA |
| main local → test local |0/51 commits exclusivos |
| test local vs origin/test local y remoto real |test está1 commit por delante de4d72a5d |
| main real GitHub |0d986126da3e21cf96e15a0a881d165727d5d5ff;2 commits no presentes en main local |
| main remoto vs macro |Divergente:macro 31 por delante/2 por detrás; base común8a8f42a |

Los cambios remotos modifican seeders, rutas/pantallas de cursos, prueba de cursos, Docker/Vite y documentación. Coinciden con el trabajo misional en README.md, frontend/src/App.tsx y frontend/src/courses/TeachingPage.tsx. Son candidatos a conflicto textual o semántico, no conflictos confirmados por una fusión. No se ejecutó merge ni merge-tree. El antiguo avance rápido macro→main solo describe las refs locales antiguas; no es un plan válido de publicación al main remoto actual.

## Higiene de datos públicos

El escaneo local de652 archivos rastreados/candidatos encontró **0 coincidencias con credenciales privadas conocidas,0 patrones de token/clave de alta señal y0 archivos sensibles rastreados**. No hay .tools, .env reales, dumps, claves/certificados privados, logs sensibles o dependencias/cachés en la lista candidata54. El placeholder backend/storage/app/private/.gitignore no contiene datos privados y no equivale a publicar su almacenamiento.

Se detectaron30 ocurrencias de un literal demo público en28 archivos ya rastreados; ninguna pertenece a los 54 candidatos nuevos/pendientes. También hay literales de autenticación de prueba adicionales señalados en el inventario privado. No se ha demostrado que sean secretos de producción y no se reproducen aquí. Sin embargo, no debe declararse que el árbol entero carece de contraseñas literales bajo la política estricta solicitada.

Antes de publicar se requiere revisar esos lugares y autorizar una política explícita para fixtures no confidenciales o un saneamiento separado. No se deben cambiar seeders/tests para retirar literales y seguir atribuyéndoles automáticamente la QA anterior; habría que revisar y validar ese cambio. No se propone reescritura de historial ni eliminación de evidencias por cuenta propia. El análisis es heurístico/de coincidencias, no un escaneo exhaustivo de toda la historia ni del futuro merge remoto.

| Archivo ya rastreado | Línea | Hallazgo sin valor |
|---|---:|---|
| `README.md` | 88 | Demo público existente; valor omitido |
| `backend/database/seeders/DevelopmentSeeder.php` | 23 | Demo público existente; valor omitido |
| `backend/database/seeders/PeopleDemoSeeder.php` | 54 | Demo público existente; valor omitido |
| `docs/aula-virtual-fase-1.md` | 101 | Demo público existente; valor omitido |
| `docs/demo-guide.md` | 5 | Demo público existente; valor omitido |
| `docs/manual-test-guide.md` | 3 | Demo público existente; valor omitido |
| `docs/sprints/sprint-1.md` | 127 | Demo público existente; valor omitido |
| `docs/sprints/sprint-2.md` | 212 | Demo público existente; valor omitido |
| `docs/sprints/sprint-3.md` | 206 | Demo público existente; valor omitido |
| `docs/sprints/sprint-3.md` | 238 | Demo público existente; valor omitido |
| `docs/sprints/sprint-4.md` | 171 | Demo público existente; valor omitido |
| `docs/sprints/sprint-5.md` | 129 | Demo público existente; valor omitido |
| `docs/sprints/sprint-6.md` | 97 | Demo público existente; valor omitido |
| `docs/sprints/sprint-7.md` | 136 | Demo público existente; valor omitido |
| `docs/sprints/sprint-8.md` | 126 | Demo público existente; valor omitido |
| `docs/sprints/sprint-9.md` | 184 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/academic.cy.ts` | 5 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/attendance.cy.ts` | 15 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/auth.cy.ts` | 10 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/auth.cy.ts` | 85 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/classroom.cy.ts` | 14 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/courses.cy.ts` | 11 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/enrollment-center.cy.ts` | 8 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/enrollment.cy.ts` | 14 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/learning.cy.ts` | 15 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/office.cy.ts` | 15 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/people.cy.ts` | 5 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/reports.cy.ts` | 7 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/virtual.cy.ts` | 6 | Demo público existente; valor omitido |
| `e2e/cypress/e2e/visual.cy.ts` | 8 | Demo público existente; valor omitido |

## Evidencias listas para revisión pública

Los documentos [Prompt 47](prompt-47-cierre-total-pruebas.md), [evidencias](evidencias-cierre-total-pruebas.md) y [matriz](matriz-final-pest-cypress.md) identifican versión, casos, tipo de API, resultados, reintentos y limitaciones sin publicar passwords, certificados privados o datos institucionales. Permanecen intactos. Los JUnit/trazas completos y sus hashes están bajo .tools/qa-final47/evidence/; no se suben en bloque. La publicación de esos resúmenes es distinta de publicar el instrumental.

La lista nueva para versionado es 54 rutas:49anteriores +3 delPrompt47 +2 delPrompt48. Consta íntegra en el plan; los 44 documentos ya confirmados entre macro/test se incorporan por historial y no deben agregarse otra vez como si fueran nuevos.

## Decisiones que quedan para autorización

Autorizar la selección de54 archivos tras revisión; resolver higiene de literales demo; preservar/aislar los siete pendientes sin integrarlos; revisar los 16 cambios del main remoto y su candidato de fusión; autorizar comprobaciones focalizadas para cualquier código nuevo; y, por separado, autorizar stash/ramas/commits/merges/tags/push o PR. Nada de esto se ejecutó en Prompt 48. El próximo paso no es repetir 314 Pest/46 E2E: es revisar este plan y decidir el contenido exacto de la entrega.
