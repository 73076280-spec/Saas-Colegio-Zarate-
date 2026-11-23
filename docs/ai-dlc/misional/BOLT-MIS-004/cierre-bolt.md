# BOLT-MIS-004 — Validación y cierre técnico de evaluación académica

Fecha: 01/11/2026. EcoAula SaaS — Colegio Zárate de Huancayo, 2026. Macroproceso misional, proceso PM-03. Registro de una ejecución nueva: los resultados históricos de M-01/M-02 se mantienen en sus archivos originales y no se suman como ejecuciones de este cierre.

## Objetivo, alcance y decisión

Validar M-01 — contexto de evaluación y orientación del registro — y M-02 — consulta fiable del historial de cambios por nota —, revisar la comprobación pendiente de teclado y establecer trazabilidad verificable. No se desarrollaron funcionalidades ni se modificaron componentes, backend, pruebas existentes, reglas, migraciones o datos.

**Estado de preparación para Pull Request: LISTO CON LIMITACIONES, para revisión técnica del alcance M-01/M-02. La validación integral NO está completada.** La suite funcional/regresión tiene 50 aprobaciones nuevas; Enter nativo mediante CDP aporta otra aprobación concluyente del control examinado. Sigue fallando la vía `Cypress.press` del script diagnóstico y no se ejecutaron 16 casos reales por falta de entorno aislado disponible. No se recomienda presentar todo el proceso académico como certificado ni dar aprobación de merge con una suite global verde inexistente.

M-01 y M-02 están implementadas y validadas en su alcance simulado descrito; M-02 cuenta ahora con comprobación positiva acotada de Enter. Para cerrar la validación integral se requiere revisar/normalizar el procedimiento de automatización de teclado sin ocultar su fallo y ejecutar las pruebas reales en un entorno aislado acreditado. La revisión de PR puede avanzar con estas limitaciones explícitas; no se crea PR ni se autoriza un cambio de política académica.

M-03 queda **PENDIENTE DE CONFIRMACIÓN INSTITUCIONAL**, sin implementación. No se atribuye aprobación académica, del profesor, despliegue o aceptación institucional a este cierre.

## Git, commits y alcance de cambios

Se comprobó `feature/evaluacion-academica`; `git status --short` estaba vacío al iniciar. HEAD: `d68c62b`. La base `feature/macro-misional` y el ancestro común son `a1dc16d671f065bc38826c7473eaba693c0c9562`. Por tanto, el diff de tres puntos identifica los cambios propios de esta rama, sin omitir divergencias por una base distinta.

Comandos de evidencia: `git log --oneline feature/macro-misional..HEAD`, `git merge-base HEAD feature/macro-misional`, `git diff --name-status feature/macro-misional...HEAD`, `git diff feature/macro-misional...HEAD -- frontend` y comparación de backend/rutas ajenas al alcance.

| Commit real | Asunto |
| --- | --- |
| `ffab7eb` | `docs(misional): auditar evaluacion academica PM-03` |
| `e49ba69` | `docs(misional): validar brechas y planificar mejoras PM-03` |
| `33c4a1c` | `feat(misional): mejorar contexto de evaluaciones y registro de notas` |
| `d68c62b` | `fix(misional): mejorar consulta y recuperacion del historial de notas` |

Son commits preexistentes obtenidos de Git, no creados durante esta intervención. La comparación inicial comprende **13 archivos: 11 añadidos y 2 modificados**, 1707 inserciones y 6 eliminaciones:

| Grupo | Archivos relativos a la raíz del repositorio |
| --- | --- |
| Frontend | `frontend/src/learning/AssessmentContext.tsx` (nuevo), `frontend/src/learning/LearningPanel.tsx`, `frontend/src/learning/ScoreForm.tsx` |
| Cypress | `e2e/cypress/e2e/assessment-context.cy.ts`, `e2e/cypress/e2e/score-history.cy.ts` (nuevos) |
| Documentación dentro de `docs/ai-dlc/misional/BOLT-MIS-004/` | `diagnostico.md`, `plan-mejoras.md`, `evidencias-m01.md`, `evidencias-m02.md`, `prompt-01-auditoria.md`, `prompt-02-validacion.md`, `prompt-03-implementacion-m01.md`, `prompt-04-implementacion-m02.md` (nuevos) |

El diff no contiene backend, permisos, seeders, migraciones, configuración o datos. No contiene componentes de Matrículas, estratégico o apoyo. En los componentes compartidos con Enseñanza-aprendizaje solo se modifica presentación de evaluaciones/notas y el historial de notas; tareas, entregas, filtros y navegación no cambian. El guardado/payload y límites de `ScoreForm`, los predicados de autorización y las transiciones publish/close se mantienen. La regresión simulada aporta evidencia adicional, sin sustituir pruebas reales del servidor.

## Resultados de las mejoras

| Mejora | Implementación contrastada y evidencia |
| --- | --- |
| M-01 | `AssessmentContext.tsx` presenta curso, periodo, máximo y fecha ya disponibles. Los valores ausentes tienen alternativas explícitas; fecha de calendario a medianoche local. `gradingGuidance` explica estados conocidos sin otorgar permisos. `LearningPanel.tsx` y `ScoreForm.tsx` lo reutilizan; capacidades y validaciones existentes siguen siendo definitivas. Doce casos simulados aprobados en esta ejecución. |
| M-02 | `ScoreHistory`, dentro de `LearningPanel.tsx`, asocia respuesta/error a nota:página:reintento; informa carga por consulta, permite reintento por GET de la misma página y presenta vacío. Conserva `alive` y remonte por nota, y respeta orden/paginación del servidor. No muestra datos anteriores como actuales. Mantiene valores, actor, motivo y fecha. Nueve casos simulados aprobados en esta ejecución. |
| M-03 | No implementada. Falta decisión institucional sobre publicación independiente, visibilidad al cierre y alcance de consulta histórica/familiar. El mecanismo actual no se redefine mediante mensajes o permisos nuevos. |

## Matriz de trazabilidad

Los RF y sus nombres proceden de `docs/traceability.md` y `docs/requirements-status.md`; no se crean RF adicionales. Se distinguen funcionalidades existentes por inspección y comportamientos ejecutados con API simulada.

| Procedimiento | RF relacionados | Funcionalidad existente / mejora | Evidencia técnica y endpoints | Pruebas ejecutadas / limitaciones |
| --- | --- | --- | --- | --- |
| PM-03.1 Configurar evaluaciones | RF-10 Gestión de actividades académicas; RF-08 Gestión de calificaciones como dependencia; RF-22 Aula virtual; RF-04/24 transversales | Configura evaluación, tipo, periodo, máximo y fecha; DRAFT/PUBLISHED/CLOSED. M-01 añade contexto sin otro CRUD. | `LearningForm.tsx`, `AssessmentContext.tsx`, `LearningPanel.tsx`; `LearningRequest.php`, `LearningService.php`, `LearningPolicy.php`, `Assessment.php`. GET/POST `/api/v1/courses/{course}/assessments`; catálogos `/assessment-types` y `/assessment-periods`; PATCH `/api/v1/assessments/{id}`. | `assessment-context.cy.ts` y caso de evaluaciones de `learning-filters.cy.ts` aprobaron con API simulada. No se ejecutó creación real ni Pest. No se introduce editor de tipos, promedio o bloqueo de fecha no definido. |
| PM-03.2 Registrar calificaciones | RF-08 directo; RF-24 trazabilidad; RF-04 y RF-05/06 como autorización/elegibilidad; RF-22 de integración | Nota única por evaluación/estudiante, rango y máximo, periodo habilitado, matrícula aprobada y motivo de modificación; transacción de nota/historial/auditoría. M-01 orienta alta/edición; M-02 mejora lectura de sus cambios. | `ScoreForm.tsx`, `LearningPanel.tsx`; `ScoreService.php`, `LearningRequest.php`, `LearningPolicy.php`, `Score.php`, `ScoreHistory.php`. GET/POST `/api/v1/assessments/{id}/scores`; PATCH `/api/v1/scores/{id}`; GET `/api/v1/scores/{id}/history`. | 12 casos M-01 y 9 M-02 simulados aprobados. Backend inalterado: validación definitiva no se vuelve a acreditar dinámicamente. Pest de rango, periodo, cierre, motivo/rollback e IDOR está identificado y NO EJECUTADO. |
| PM-03.3 Publicar resultados | RF-10, RF-09 Consulta de calificaciones; RF-08; RF-21 Portal del padre/apoderado; RF-22; RF-24 | Conserva visibilidad ligada a evaluación PUBLISHED. Registrar/corregir nota la hace consultable por actores elegibles. No hay publicación independiente de notas/lote. M-01 describe el contexto; M-03 no se implementa. | `LearningService.php`, `ScoreService.php`, `LearningAccess.php`, `StudentSummary.php`; `LearningPanel.tsx`. POST `/api/v1/assessments/{id}/publish` y `/close`; GET `/api/v1/my/scores`, `/api/v1/dashboard`. | UI de DRAFT/CLOSED/periodo bloqueado y filtros de evaluación comprobados con simulación. Publicación real, consulta tras cierre y lectura familiar NO EJECUTADAS. Una publicación independiente requiere confirmación institucional. |
| PM-03.4 Consultar historial académico | RF-09; RF-24; RF-08 de soporte; RF-21 familiar, RF-23 Generación de reportes y RF-22 | Consulta propia, reportes autorizados y resumen familiar de cinco notas; historial de cambios por nota. M-02 mejora exclusivamente este último, no un expediente longitudinal. | `LearningController.php::history`, `Score.php::history`, `LearningAccess.php`, `StudentSummary.php`, `ReportService.php`, `ReportPolicy.php`; `LearningPanel.tsx`, `ReportsPage.tsx`. GET `/api/v1/my/scores`, `/scores/{id}/history`, `/dashboard`, `/reports/student-scores`, `/course-scores`, `/period-scores` y sus exportaciones autorizadas. | Nueve casos simulados cubren carga, páginas, 500/reintento, vacío, respuestas tardías, cambio de nota, campos y 403. No se acreditan IDOR real, consulta multianual ni privacidad familiar mediante ejecución; no se amplía acceso. |

Los servicios y modelos de la tabla residen en `backend/app/Services/Learning/`, `backend/app/Models/Learning/`, `backend/app/Http/Requests/`, `backend/app/Http/Controllers/Api/` y `backend/app/Policies/` según sus nombres. `StudentSummary`, `ReportService` residen en `backend/app/Services/Reports/`; los componentes, en `frontend/src/learning/` salvo `ReportsPage` en `frontend/src/reports/`.

**Contrato conservado de PM-03.3:** solo se registran notas sobre evaluación PUBLISHED. La consulta personal exige titularidad/permiso y curso/matrícula elegibles; el resumen familiar exige vínculo verificado. Cerrar evaluación bloquea escritura ordinaria y retira sus notas de consultas estudiantiles y resumen familiar, sin borrarlas. La consulta de personal sigue sus propias reglas. No se interpreta este comportamiento como publicación separada ni se modifica sin decisión institucional.

**Límite de PM-03.4:** el historial devuelve correcciones de una calificación autorizada. No representa trayectoria de todos los cursos/años, promedio final, libreta oficial ni expediente completo para apoderados. Los reportes y resumen existentes no autorizan ampliar permisos.

## Pruebas de esta validación

Entorno: dependencias previamente instaladas, Vite disponible en `http://localhost:5173` (HTTP 200), Cypress 16.1.1 / Electron 146 headless. No se instalaron paquetes, se prepararon usuarios demo ni se cambiaron archivos de entorno. Electron emitió un aviso de deprecación que no impidió la suite focalizada.

| Verificación | Resultado actual |
| --- | --- |
| `npm run build`, desde `frontend` | APROBADO: `tsc -b` y Vite; 100 módulos, compilación finalizada. |
| `npm run lint`, desde `frontend` | APROBADO, código 0. |
| `npm run typecheck`, desde `e2e` | APROBADO, código 0. |
| `assessment-context.cy.ts` | 12 aprobadas, 0 fallidas, 0 pendientes/omitidas. |
| `score-history.cy.ts` | 9 aprobadas, 0 fallidas, 0 pendientes/omitidas. |
| `virtual-access.cy.ts` | 9 aprobadas, 0 fallidas, 0 pendientes/omitidas. |
| `submission-deadline.cy.ts` | 10 aprobadas, 0 fallidas, 0 pendientes/omitidas. |
| `learning-filters.cy.ts` | 10 aprobadas, 0 fallidas, 0 pendientes/omitidas. |
| Total suite focalizada/regresión | **50 aprobadas, 0 fallidas, 0 pendientes/omitidas; código 0; 1 minuto 55 segundos**. Todas con API simulada. |
| `git diff --check feature/macro-misional...HEAD` | APROBADO, sin errores reportados en la rama implementada. |

Comando ejecutado desde `e2e`:

```powershell
npm test -- --spec cypress/e2e/assessment-context.cy.ts,cypress/e2e/score-history.cy.ts,cypress/e2e/virtual-access.cy.ts,cypress/e2e/submission-deadline.cy.ts,cypress/e2e/learning-filters.cy.ts
```

No se trasladan los 41/50 aprobados históricos de las evidencias anteriores como ejecuciones nuevas: la tabla proviene de volver a ejecutar los cinco specs. Build/lint/tipos/formato y preflight no se suman como casos Cypress.

## Accesibilidad pendiente: análisis y prueba reproducible

Control examinado: botón nativo `type="button"` «Reintentar historial» de `ScoreHistory`. Su único manejador `onClick` incrementa la revisión y repite el GET de nota/página; no hay manejador de teclado propio ni cambio de autorización. No se encontró en el flujo examinado una cancelación de Enter que demostrara un defecto del componente.

Según `evidencias-m02.md`, primer intento: Cypress `.focus().should('have.focus').type('{enter}')`. Segundo: botón enfocado y `cy.press(Cypress.Keyboard.Keys.ENTER)`. Ambos fallaron al esperar el estado transitorio de carga; la captura conservaba botón enfocado y error. El spec terminó comprobando recuperación por clic. Esto prueba que esas comprobaciones no validaron Enter, pero no identifica por sí solo la causa: foco DOM no acredita foco del documento AUT; tampoco se registraron eventos nativos o una petición para distinguir activación de una aserción de carga tardía.

Para resolverlo sin modificar componentes se añade `verificacion-teclado.cy.js` junto a esta documentación. Es una comprobación reproducible de dos vías, `Cypress.press` y Chrome DevTools Protocol (CDP), con datos/API simulados. Provoca un 500 en página 2; enfoca el documento mediante el título (sin activar Reintentar), verifica foco real del documento y botón, envía keyDown/keyUp nativos de Enter, exige evento de teclado y click confiables (`isTrusted`) y verifica nuevo GET de la misma nota/página y recuperación. No depende de capturar un indicador transitorio ni usa clic sobre Reintentar como sustituto de Enter. Rechaza cualquier petición no GET interceptada.

Comando reproducible, desde `e2e`:

```powershell
npm test -- --spec ../docs/ai-dlc/misional/BOLT-MIS-004/verificacion-teclado.cy.js --config specPattern=../docs/ai-dlc/misional/BOLT-MIS-004/verificacion-teclado.cy.js
```

### Resultados exactos de la investigación

| Ejecución documental | Resultado | Interpretación |
| --- | --- | --- |
| Primer contraste: `Cypress.press` y CDP sin carácter de Enter | 0 aprobadas, 2 fallidas, código 1; 17 segundos del runner | Ambas esperas del nuevo GET expiraron. La falta de recuperación no dependía de observar una carga fugaz. |
| Repetición con instrumentación de foco, eventos y rutas | 0 aprobadas, 2 fallidas, código 1; 24 segundos | Se guardó `verificacion-teclado-sin-caracter.json`: foco real y keydown/keyup confiables en el botón, sin clic/reintento. Aún no se registraba `keypress` como tipo de evento; no se infiere su ausencia solo de ese archivo. |
| Intento de añadir selección de método al script | 0 aprobadas, 1 fallo sintético fuera de un test; código 1 | Error del script: `Cypress.env()` fue eliminado en Cypress 16. Se retiró ese selector innecesario; no se modificó aplicación/configuración. No es un caso funcional académico. |
| Última ejecución: `Cypress.press` frente a CDP completo con `text`/`unmodifiedText` = retorno de carro | **1 aprobada (CDP), 1 fallida (`Cypress.press`), 0 pendientes/omitidas; código 1; 19 segundos** | El GET de reintento ocurre únicamente con la secuencia nativa completa. `Cypress.press` conserva fallo de espera por ausencia de petición. |

En `verificacion-teclado-eventos.json`, el caso CDP registra `keydown Enter` → `keypress Enter` → `click` confiable sobre «Reintentar historial»; el GET es `/api/v1/scores/12/history?page=2` y vuelve a recibirse la corrección, con error eliminado. El caso comprueba foco real antes de la tecla y **no ejecuta `.click()` sobre Reintentar**. La única diferencia de generación CDP respecto al intento anterior es incluir el carácter `\r` para la pulsación; no se alteró React ni se añadieron manejadores.

En la misma ejecución, `Cypress.press` registra keydown/keyup confiables sobre el botón, sin cancelación observada, pero no registra keypress/click ni nuevo GET. **Conclusión acotada:** hay evidencia suficiente de que el botón responde a Enter nativo completo en este entorno; no hay evidencia suficiente de un defecto del componente que justifique corregirlo. La diferencia apunta al procedimiento/herramienta de simulación y su secuencia de eventos, no a los permisos ni al servidor. No se afirma una causa universal para todos los navegadores o versiones de Cypress, ni que esto explique retrospectivamente cada detalle del intento `.type()` original.

**Enter del control examinado: APROBADO mediante CDP con API simulada. Vía `Cypress.press`: FALLIDA, pendiente de revisión del harness.** No se convierte esa vía fallida en aprobación ni se modifica el spec existente para esconderla. No se recomienda añadir un `onKeyDown` al botón por este hallazgo: ya funciona con activación nativa completa y un manejador adicional podría duplicar la operación. La corrección recomendada es revisar la automatización y adoptar una secuencia nativa completa aprobada para este control; cualquier cambio posterior de componente requeriría evidencia adicional y revisión.

**Consolidado por último resultado de los 52 casos regulares distintos:** 51 aprobados (50 funcionales/regresión + 1 CDP), **1 fallido** (`Cypress.press`), 0 pendientes/omitidos del runner; **16 casos reales NO EJECUTADOS** aparte. Si se cuentan todos los intentos efectuados durante este cierre, hubo 51 aprobaciones de ejecución y 6 fallos de ejecución en 57 ejecuciones de caso, incluyendo el fallo sintético de carga del script; no representan 57 casos funcionales distintos. Los dos intentos históricos de M-02 y los de M-01 no se suman a estos números. No existe un comando global de validación integral aprobado.

El alcance de accesibilidad no es una certificación WCAG: los specs también comprueban contexto semántico, labels, errores/estados y vista móvil 390 × 844, pero no todos los lectores de pantalla, navegadores o patrones de pestañas del aula.

## Backend real y pruebas no ejecutadas

Antes del preflight se inspeccionaron `backend/AGENTS.md` y `backend/phpunit.xml`: exclusivamente MySQL/base/usuario `zarate_test`. Se forzaron esas opciones y `APP_ENV=testing` en memoria, con `DB_URL` vacío, caché/sesión array; se verificó ausencia de configuración cacheada y destino antes de intentar exclusivamente `SELECT DATABASE(), CURRENT_USER()` mediante el PHP portátil `..\.tools\php\php.exe`. La conexión falló con **código 2002**. No se accedió a `zarate_dev`, se ejecutaron fixtures, migraciones o seeders ni se imprimieron credenciales. Disponibilidad y aislamiento operativo no quedaron acreditados, por lo que no se ejecutaron pruebas de escritura.

| Pruebas identificadas no ejecutadas | Cantidad | Motivo |
| --- | --- | --- |
| Pest `backend/tests/Feature/Sprint7Test.php` | 10 casos | MySQL de pruebas no disponible; incluye referencias/roles, score IDOR, nota válida, rango/periodo, bloqueo por cierre y motivo/historial/rollback. |
| Cypress real `e2e/cypress/e2e/learning.cy.ts` | 3 casos | Laravel en puerto 8000 no disponible y base aislada no acreditada. No se ejecuta autenticación/escritura académica contra desarrollo. |
| Cypress real `e2e/cypress/e2e/virtual.cy.ts` | 3 casos | Mismas limitaciones de entorno seguro. |
| Total del alcance contado pendiente | **16 casos** | NO EJECUTADOS; no son fallos ni skipped del runner. |

No se inició Laravel sobre configuración de desarrollo. La comprobación HTTP de salud del puerto 8000 no pudo conectar. No se ejecutó la suite completa ni se cuantifican casos adicionales de otras suites como si hubieran sido planificados en esta ejecución. `Sprint10Test.php`, suites de periodos/cursos y reportes son referencias de cobertura heredada, no aprobaciones actuales. El caso 403 simulado verifica presentación, no autorización efectiva de Laravel; el endpoint de historial inspeccionado utiliza Gate y 404 cuando la nota no es visible.

## Coherencia documental y riesgos residuales

- El diagnóstico y plan registran fases iniciales de inspección con cero pruebas ejecutadas. Sus estados «propuesta» y carencias previas son históricos; los prompts 03/04 autorizan implementaciones posteriores y las evidencias documentan su ejecución. No se reescriben documentos previos para ocultar esa secuencia.
- Las pruebas y resultados históricos permanecen intactos: M-01 tuvo un fallo de encadenamiento Cypress resuelto y un arranque sin Vite; M-02 tuvo los dos intentos de teclado descritos. No se declaran aprobados retrospectivamente ni se suman reejecuciones como casos nuevos.
- Se compararon los prompts 02, 03 y 04 con los adjuntos originales disponibles: las tres parejas coinciden por SHA-256. Los prompts 01 y 05 proceden de texto del usuario; no se inventa un hash de un adjunto inexistente. Los documentos no son aprobaciones institucionales.
- Falta validar contra backend real las reglas de institución, titularidad, elegibilidad, periodo, escala, motivo, transacciones y privacidad familiar. Las respuestas simuladas no certifican esas reglas ni integridad de una base poblada.
- Falta confirmación institucional M-03 sobre visibilidad al registrar/corregir, efecto del cierre y alcance del resumen familiar. No se cambia el contrato actual para satisfacer una interpretación más amplia de PM-03.3/03.4.
- El historial ignora respuestas obsoletas, no cancela físicamente la petición. Las fechas siguen la zona local del navegador. Los formularios conservan datos mientras permanecen montados, no como borrador persistente ante recarga o expiración.
- No se identificó por el diff una ampliación de privilegios o modificación de reglas. Esto es una revisión acotada, no una auditoría de seguridad exhaustiva ni prueba de ausencia universal de vulnerabilidades.

## Evidencias y archivos de este cierre

Documentos anteriores consultados, sin alteración: `diagnostico.md`, `plan-mejoras.md`, `evidencias-m01.md`, `evidencias-m02.md` y prompts 01–04 del Bolt; fuentes RF: `docs/requirements-status.md`, `docs/traceability.md`; contratos: código enumerado en la matriz y Sprint 7.

Archivos nuevos de esta intervención, todos dentro de `docs/ai-dlc/misional/BOLT-MIS-004/`:

- `prompt-05-validacion-final.md`: prompt completo proporcionado por el usuario.
- `cierre-bolt.md`: esta revisión, resultados y decisión.
- `verificacion-teclado.cy.js`: comprobación reproducible de Enter con API simulada; evidencia ejecutable, sin modificar los specs existentes.
- `verificacion-teclado-sin-caracter.json`: trazas del intento instrumental inicial, con foco, eventos y rutas sintéticas, sin carácter de Enter en CDP.
- `verificacion-teclado-eventos.json`: trazas de la última ejecución del script, escritas también después de casos fallidos para no perder el diagnóstico.

Se comprobó `git diff --quiet HEAD -- frontend backend e2e`: sin cambios de aplicación o suites existentes durante este cierre. Diagnóstico, plan y evidencias M-01/M-02 siguen idénticos a HEAD. Los cinco archivos nuevos están limitados al directorio del Bolt. Se verificaron sintaxis del script mediante `node --check`, formato con `git diff --check` y espacios/marcadores de conflicto de los documentos nuevos. No se realizaron commits, push, merge ni Pull Requests.
