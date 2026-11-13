# Plan de integración final GitHub — Prompt 48

Fecha:12/11/2026, America/Lima. **Documento de propuesta; ninguno de los comandos de escritura siguientes fue ejecutado.** No se ejecutaron pruebas, fetch, staging, stash, checkout, commits, merges, cherry-pick, reset, push, tags o PR en esta auditoría. GitHub se consultó por API de solo lectura.

## Decisión de integración

Conservar el código que aprobó Prompt 47 y aplazar los siete archivos. test→macro sigue siendo avance rápido local si se preservan los pendientes. macro→main remoto **no** lo es:main real contiene dos commits de cursos interactivos ausentes de la rama validada. La ruta completa recomendada es test→macro→candidato basado en main remoto→main, con revisión de conflicto, higiene y comprobaciones focalizadas. Nunca sobrescribir el main remoto para recuperar una versión antigua.

La versión académica ya respaldada por 314/46 es 1a04303 + contenido sellado. El futuro commit documental de entrega podrá registrar exactamente ese árbol funcional, pero no se le inventa una ejecución de pruebas. El futuro merge con main remoto será otro código: no puede heredar automáticamente esas cifras. No se conoce aún su SHA porque no se hizo la integración.

## Estado exacto observado

| Rama/ref local | SHA | Estado |
|---|---|---|
| `feature/asistencia-seguimiento` | `007e26f0f6398425b6aaf13e9c2b577fe90e136f` | origin/feature/asistencia-seguimiento |
| `feature/aula-virtual` | `b58c661747507403015d25864457a273c0f552b0` | origin/feature/aula-virtual |
| `feature/centro-matriculas` | `b1c25fd038d9a8d20e39d9ab9265fbfd4517abc7` | origin/feature/centro-matriculas |
| `feature/comunicacion-institucional` | `edbf89dcc998932a9c6977ebca9641ab37bc6c20` | origin/feature/comunicacion-institucional |
| `feature/ensenanza-aprendizaje` | `fecca7253d8ddad5c1b960c1b7c4d0db44f30640` | origin/feature/ensenanza-aprendizaje |
| `feature/evaluacion-academica` | `a5cedf2dab9336631739cdaf603e6880f5070101` | origin/feature/evaluacion-academica |
| `feature/macro-misional` | `4e40a13af02475cd153bc4e4df01472a04dcefda` | origin/feature/macro-misional |
| `main` | `8a8f42a46adb7f46f2e834b15af97e434192cde8` | origin/main |
| `test/integracion-misional` | `1a043035c126a5bc3e5ed14cf43fdd49a4e171bf` | [ahead 1] |
| `origin/feature/asistencia-seguimiento` | `007e26f0f6398425b6aaf13e9c2b577fe90e136f` | Sin upstream indicado |
| `origin/feature/aula-virtual` | `b58c661747507403015d25864457a273c0f552b0` | Sin upstream indicado |
| `origin/feature/centro-matriculas` | `b1c25fd038d9a8d20e39d9ab9265fbfd4517abc7` | Sin upstream indicado |
| `origin/feature/comunicacion-institucional` | `edbf89dcc998932a9c6977ebca9641ab37bc6c20` | Sin upstream indicado |
| `origin/feature/ensenanza-aprendizaje` | `fecca7253d8ddad5c1b960c1b7c4d0db44f30640` | Sin upstream indicado |
| `origin/feature/evaluacion-academica` | `a5cedf2dab9336631739cdaf603e6880f5070101` | Sin upstream indicado |
| `origin/feature/macro-misional` | `4e40a13af02475cd153bc4e4df01472a04dcefda` | Sin upstream indicado |
| `origin/main` | `8a8f42a46adb7f46f2e834b15af97e434192cde8` | Sin upstream indicado |
| `origin/test/integracion-misional` | `4d72a5d5a52059e0e42d75e0a7383d5e61c36806` | Sin upstream indicado |

| Rama real en GitHub | SHA obtenido por API |
|---|---|
| `feat/cursos-docentes-interactivos` | `18da31063c101d00c7be27817a6d506dc86fda93` |
| `feature/asistencia-seguimiento` | `007e26f0f6398425b6aaf13e9c2b577fe90e136f` |
| `feature/aula-virtual` | `b58c661747507403015d25864457a273c0f552b0` |
| `feature/centro-matriculas` | `b1c25fd038d9a8d20e39d9ab9265fbfd4517abc7` |
| `feature/comunicacion-institucional` | `edbf89dcc998932a9c6977ebca9641ab37bc6c20` |
| `feature/ensenanza-aprendizaje` | `fecca7253d8ddad5c1b960c1b7c4d0db44f30640` |
| `feature/evaluacion-academica` | `a5cedf2dab9336631739cdaf603e6880f5070101` |
| `feature/macro-apoyo` | `7a8edaf7349d7145382e2c031b1fa56aead9116f` |
| `feature/macro-estrategico` | `946519ab1edd590c0e9ccd515d313bce1fc0ca02` |
| `feature/macro-misional` | `4e40a13af02475cd153bc4e4df01472a04dcefda` |
| `feature/pruebas-autenticacion` | `1357546ab77bff29861b9f466f39299dbe9d20dd` |
| `main` | `0d986126da3e21cf96e15a0a881d165727d5d5ff` |
| `test/integracion-misional` | `4d72a5d5a52059e0e42d75e0a7383d5e61c36806` |

Repositorio: [73076280-spec/Saas-Colegio-Zarate-](https://github.com/73076280-spec/Saas-Colegio-Zarate-), público. La instantánea remota fue tomada en2026-11-12T23:14:06.292Z; se confirmó fin de paginación con una página vacía. No se hizo fetch para actualizar origin/* local. El main remoto 0d98612 incorpora la rama de cursos interactivos; el main local/origin-main local sigue en8a8f42a. No se presupone que ramas remotas adicionales de apoyo/estratégico estén integradas o validadas porPrompt47.

| Comparación | Adelanto/atraso |
|---|---|
| Macro local vs test local |0/20 commits exclusivos;test añade44 documentos confirmados |
| Main local vs macro local |0/31;101 archivos de diferencia |
| Main local vs test local |0/51 |
| Origin/test real4d72a5d vs test local 1a04303 |0/1 |
| Macro remoto vs test remoto |test 19 por delante;0 por detrás |
| Main remoto vs macro remoto |macro 31 por delante y2 por detrás;divergente |

Las seis ramas funcionales locales ya son ancestros del macro; no fusionarlas de nuevo individualmente. La divergencia main/macro se confirmó en GitHub, no se dedujo solo del caché local. No se calculó una fusión de ensayo y no hay una lista de conflictos efectivamente materializados.

## Contenido que se propone versionar

La lista anterior49 se conserva como historia. La lista definitiva pendiente para revisar ahora es **54 rutas:52 documentos y2 archivos Cypress**. Añade los tres archivos delPrompt47 y los dos delPrompt48. No contiene los siete funcionales, .tools, Microsoft/, credenciales, bases, certificados privados, logs, perfiles o cachés. Los44 documentos ya confirmados entre macro/test viajan con esos20 commits; no se deben volver a presentar como54 archivos nuevos.

Los dos Cypress health forman una unidad: integration.cy.ts importa observeHealth.ts. Ambos coinciden con los sellos del estado examinado. Conservan HTTP200, JSON esperado y estado visible; el helper observa fetch/abort y exige respuestas reales, tolerando únicamente la limpieza inicial identificada de StrictMode. Se relacionan con el caso health separado delPrompt40, no se suman a los 46 E2E como casos nuevos.

<!-- PUBLIC_FILES_48_BEGIN -->
```text
docs/ai-dlc/misional/VALIDACION-INTEGRAL/cierre-final-qa-entrega.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ampliacion-pest-academico.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ampliacion-sprint2-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-catalogos-aislamiento-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-http-preparacion-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-regresion-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-total-pruebas.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-continuacion-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cypress-integracion.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-diagnostico-http-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-e2e-real.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-finalizacion-migraciones.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-fixtures-transacciones-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-habilitacion-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-matriculas-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-optimizacion-verificador-wmi.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-personas-permisos-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-pruebas-pest-integracion.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-recuperacion-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-recuperacion-migracion-9.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-rendimiento-http.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validacion-integral-misional.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validaciones-academicas-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/matriz-final-pest-cypress.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-diagnostico-rendimiento-http.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-integracion-final-github.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/preparacion-entrega-github.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-24-finalizacion-migraciones.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-25-recuperacion-migracion-9.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-26-autorizacion-entorno-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-26-pruebas-pest-integracion.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-27-habilitacion-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-28-fixtures-transacciones-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-29-catalogos-aislamiento-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-30-ampliacion-sprint2-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-31-validaciones-academicas-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-32-optimizacion-verificador-wmi.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-33-ampliacion-pest-academico.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-34-personas-permisos-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-35-matriculas-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-36-validacion-integral-misional.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-37-cierre-regresion-pest.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-38-cypress-integracion.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-39-diagnostico-http-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-40-cierre-http-preparacion-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-41-e2e-real.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-42-recuperacion-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-43-continuacion-e2e.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-44-diagnostico-rendimiento-http.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-45-cierre-priorizado.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-47-cierre-total-pruebas.md
docs/ai-dlc/misional/VALIDACION-INTEGRAL/resumen-final-validacion-misional.md
e2e/cypress/e2e/integration.cy.ts
e2e/cypress/support/observeHealth.ts
```
<!-- PUBLIC_FILES_48_END -->

Toda ruta de la lista debe existir y revisarse antes del staging; si aparece otra, detener y actualizar el manifiesto mediante revisión. El código ya confirmado y sus dependencias forman parte del árbol de la rama y no se publican copiando archivos manualmente sobre main.

## Riesgos concretos antes de publicación

1. El worktree macro está sucio con los siete cambios no validados; no restaurar/resetear ni arrastrarlos a la entrega. Hay copia privada y parche verificables. Una propuesta de stash se da abajo, pero requiere autorización porque modifica la copia de trabajo.
2. main remoto diverge y cambia16 archivos. Hay tres rutas de solapamiento con misional:README.md,App.tsx yTeachingPage.tsx. Pueden surgir conflictos textuales y hay cambios semánticos aun si Git fusiona automáticamente. No elegir ours/theirs globalmente ni realizar force push.
3. En el árbol ya rastreado hay literales demo/prueba. El nuevo paquete54 no contiene coincidencias con secretos privados conocidos, pero la política estricta sobre contraseñas del árbol completo queda pendiente. Revisar el inventario de [cierre-final-qa-entrega.md](cierre-final-qa-entrega.md) antes de publicar. No cambiar fixtures/aserciones o reescribir historia sin aprobación y controles propios.
4. Los adaptadores, credenciales y trazas privados no se distribuyen. El estado QA no equivale a un CI público configurado ni a poder ejecutar las suites contra las bases por defecto. No publicar el instrumental completo para intentar hacerlo reproducible sin revisión.
5. Un nuevo código integrado no puede tomar prestada la ejecución314/46de otro árbol. No se ejecutó ninguna prueba enPrompt48; no se propone repetir ahora las suites completas.

### Cambios de main remoto que requieren revisión focalizada

Base común8a8f42a, main remoto 0d98612, dos commits. [Commit remoto](https://github.com/73076280-spec/Saas-Colegio-Zarate-/commit/0d986126da3e21cf96e15a0a881d165727d5d5ff).

| Ruta remota modificada | Revisión necesaria |
|---|---|
| `README.md` | Coherencia con la versión escogida, instrucciones de demo y ausencia de credenciales literales sensibles. |
| `backend/database/seeders/AttendanceDemoSeeder.php` | Datos demo, idempotencia, matrículas/rosters y preservación de datos/contraseñas existentes; usar solo entorno aislado autorizado. |
| `backend/database/seeders/ClassroomDemoSeeder.php` | Datos demo, idempotencia, matrículas/rosters y preservación de datos/contraseñas existentes; usar solo entorno aislado autorizado. |
| `backend/database/seeders/CourseDemoSeeder.php` | Datos demo, idempotencia, matrículas/rosters y preservación de datos/contraseñas existentes; usar solo entorno aislado autorizado. |
| `backend/database/seeders/DevelopmentSeeder.php` | Datos demo, idempotencia, matrículas/rosters y preservación de datos/contraseñas existentes; usar solo entorno aislado autorizado. |
| `backend/database/seeders/EnrollmentDemoSeeder.php` | Datos demo, idempotencia, matrículas/rosters y preservación de datos/contraseñas existentes; usar solo entorno aislado autorizado. |
| `backend/database/seeders/LearningDemoSeeder.php` | Datos demo, idempotencia, matrículas/rosters y preservación de datos/contraseñas existentes; usar solo entorno aislado autorizado. |
| `backend/database/seeders/PeopleDemoSeeder.php` | Datos demo, idempotencia, matrículas/rosters y preservación de datos/contraseñas existentes; usar solo entorno aislado autorizado. |
| `docker-compose.yml` | Revisar entorno local/Docker, hosts, cookies/CSRF y proxy; Docker no fue acreditado porPrompt47. |
| `docs/demo-guide.md` | Coherencia con la versión escogida, instrucciones de demo y ausencia de credenciales literales sensibles. |
| `docs/pruebas.md` | Coherencia con la versión escogida, instrucciones de demo y ausencia de credenciales literales sensibles. |
| `docs/sprints/sprint-1.md` | Coherencia con la versión escogida, instrucciones de demo y ausencia de credenciales literales sensibles. |
| `e2e/cypress/e2e/courses.cy.ts` | El remoto agrega cobertura de cuatro cursos y separa un caso: no reutilizar sin revisión el inventario/fixture de un curso dePrompt47. |
| `frontend/src/App.tsx` | Conservar todas las rutas virtuales/institucionales y revisar la ruta nueva my-courses/:id y sus protecciones. |
| `frontend/src/courses/TeachingPage.tsx` | Combinar acceso efectivo misional con detalle por URL; revisar navegación, filtros, estados y permisos. |
| `frontend/vite.config.ts` | Revisar entorno local/Docker, hosts, cookies/CSRF y proxy; Docker no fue acreditado porPrompt47. |

Antes de promover ese candidato: build/ESLint frontend, TypeScript E2E y pruebas focalizadas de cursos/rutas/rosters, permisos y seeders idempotentes afectados, con inventario y entorno aislado propios y autorización. No ejecutar comandos genéricos Pest/Cypress o seeders que apunten a zarate_dev/zarate_test. No modificar sellos o baselines históricos para hacer coincidir un código nuevo. Si esas comprobaciones no están autorizadas o disponibles, el candidato no está listo para promoción.

## Comandos propuestos, por fases y con autorización posterior

Ejecutar desde PowerShell con identidad propietaria autorizada de los repositorios. Un rechazo de ownership no se corrige agregando safe.directory global ni ignorando la protección. Revisar cada salida y detenerse ante un exit code no esperado.

### 1. Revalidar refs y proteger el índice

Primero aprobar la política de higiene y las 54 rutas. Los valores remotos son una instantánea, no una garantía futura. Fetch se propone, no se ejecutó.

```powershell
$repo48 = 'D:\zarate-saas'
$macro48 = 'D:\zarate-saas-macro-misional'
$candidate48 = 'D:\zarate-saas-entrega-p48'
$qa48 = '1a043035c126a5bc3e5ed14cf43fdd49a4e171bf'
$mainRemoto48 = '0d986126da3e21cf96e15a0a881d165727d5d5ff'
$testRemoto48 = '4d72a5d5a52059e0e42d75e0a7383d5e61c36806'
if ((git -C $repo48 branch --show-current) -ne 'test/integracion-misional' -or (git -C $repo48 rev-parse HEAD) -ne $qa48) { throw 'Recuperar el estado auditado antes de continuar' }
if ((git -C $macro48 branch --show-current) -ne 'feature/macro-misional' -or (git -C $macro48 rev-parse HEAD) -ne '4e40a13af02475cd153bc4e4df01472a04dcefda') { throw 'El worktree macro cambió' }
git -C $repo48 status --short
git -C $macro48 status --short
git -C $repo48 worktree list
git -C $repo48 diff --check
git -C $macro48 diff --check
git -C $repo48 diff --cached --quiet
if ($LASTEXITCODE -ne 0) { throw 'Hay cambios ya preparados: revisar sin sobrescribir el índice' }
# Solo con autorización posterior: actualizar refs, sin cambiar código ni bases.
git -C $repo48 fetch origin
if ($LASTEXITCODE -ne 0) { throw 'Fetch no completado' }
if ((git -C $repo48 rev-parse origin/main) -ne $mainRemoto48) { throw 'Main remoto cambió: repetir auditoría de diferencias' }
if ((git -C $repo48 rev-parse origin/test/integracion-misional) -ne $testRemoto48) { throw 'Rama remota de pruebas cambió: revisar' }
if ((git -C $repo48 rev-parse origin/feature/macro-misional) -ne '4e40a13af02475cd153bc4e4df01472a04dcefda') { throw 'Macro remoto cambió: revisar' }
git -C $repo48 log --left-right --oneline origin/main...test/integracion-misional
git -C $repo48 diff --name-status 8a8f42a46adb7f46f2e834b15af97e434192cde8..origin/main
```

### 2. Preparar solo el contenido público revisado

Con índice inicialmente vacío, permisos de staging/commit aprobados y mismo contenido sellado. Si un saneamiento autorizado cambia un archivo sellado, detener el guard de hashes y revisar ese delta; no modificar el inventario para ocultarlo.

```powershell
$plan48 = Get-Content -LiteralPath "$repo48\docs\ai-dlc\misional\VALIDACION-INTEGRAL\plan-integracion-final-github.md" -Raw -Encoding UTF8
$tick48 = [string][char]96
$fence48 = $tick48 + $tick48 + $tick48
$pattern48 = '(?s)<!-- PUBLIC_FILES_48_BEGIN -->\s*' + $fence48 + 'text\r?\n(.*?)\r?\n' + $fence48 + '\s*<!-- PUBLIC_FILES_48_END -->'
$match48 = [regex]::Match($plan48, $pattern48)
if (-not $match48.Success) { throw 'No se encontró el manifiesto revisado' }
$public48 = @($match48.Groups[1].Value -split '\r?\n' | Where-Object { $_ })
if ($public48.Count -ne 54 -or @($public48 | Sort-Object -Unique).Count -ne 54) { throw 'Manifiesto inesperado' }
foreach ($path48 in $public48) {
    if ($path48 -match '(^|/)\.\.|^\.tools/|^Microsoft/' -or -not (Test-Path -LiteralPath (Join-Path $repo48 $path48))) { throw "Ruta inválida: $path48" }
}
# Verificar antes los603sellos de origen del Prompt47; no modificar el inventario para forzar coincidencias.
$pins48 = Get-Content -LiteralPath "$repo48\.tools\cypress-e2e\evidence\prompt43\sources-before.json" -Raw | ConvertFrom-Json
foreach ($pin48 in $pins48) {
    if ((Get-FileHash -LiteralPath (Join-Path $repo48 $pin48.path) -Algorithm SHA256).Hash.ToLowerInvariant() -ne $pin48.hash.ToLowerInvariant()) { throw "Cambió un archivo sellado: $($pin48.path)" }
}
# AUTORIZACIÓN DE STAGING/COMMIT requerida; no usar git add .
git -C $repo48 diff --cached --quiet
if ($LASTEXITCODE -ne 0) { throw 'El índice dejó de estar vacío: no mezclar cambios' }
git -C $repo48 add -- $public48
if ($LASTEXITCODE -ne 0) { throw 'Staging incompleto: revisar el índice sin restablecer cambios' }
$staged48 = @(git -C $repo48 diff --cached --name-only)
if (Compare-Object ($public48 | Sort-Object) ($staged48 | Sort-Object)) { throw 'El índice no coincide con las54rutas' }
git -C $repo48 diff --cached --check
if ($LASTEXITCODE -ne 0) { throw 'Corregir formato antes del commit' }
git -C $repo48 diff --cached --stat
# Revisar el diff preparado completo y la higiene antes de autorizar este commit.
git -C $repo48 commit -m 'test(qa): consolidar evidencia validada y preparar entrega academica'
if ($LASTEXITCODE -ne 0) { throw 'Commit no completado' }
$qaEntrega48 = git -C $repo48 rev-parse HEAD
git -C $repo48 diff --exit-code $qa48 $qaEntrega48 -- backend frontend
if ($LASTEXITCODE -ne 0) { throw 'Se modificó código funcional frente a la revisión validada' }
# La nueva identidad $qaEntrega48 registra contenido ya sellado y documentación; no es una ejecución de QA nueva.
```

### 3. Preservar pendientes y avanzar test hacia macro

Solo si se decidió aplazar los siete. La variable de stash debe conservarse por OID; no usar pop, drop ni clean. Para recuperar mejoras más adelante, hacerlo en una rama de revisión basada en4e40a13, con autorización, aplicando ese OID y verificando los sieteSHA; no sobre release/main.

```powershell
$seven48 = @(
    'frontend/src/enrollment/shared.tsx',
    'frontend/src/learning/CourseLearning.tsx',
    'frontend/src/learning/ScoreForm.tsx',
    'frontend/src/learning/SubmissionForm.tsx',
    'frontend/src/learning/shared.tsx',
    'frontend/src/reports/ReportsPage.tsx',
    'frontend/src/learning/useFieldErrors.tsx'
)
# Antes: comprobar las siete copias/SHA de evidence/prompt48/pending-backup y conservar el respaldo.
# AUTORIZACIÓN DE STASH requerida; afecta la copia de trabajo, por eso no se ejecutó durante esta auditoría.
git -C $macro48 stash push --include-untracked -m 'Prompt48: pendientes no validados preservados' -- $seven48
if ($LASTEXITCODE -ne 0) { throw 'No continuar: preservación incompleta' }
$stashPendientes48 = git -C $macro48 rev-parse refs/stash
git -C $macro48 stash show --include-untracked --name-status $stashPendientes48
# Comprobar que incluye los seis modificados y el hook nuevo; guardar el OID privado, no hacer pop.
if (@(git -C $macro48 status --porcelain).Count -ne 0) { throw 'El worktree macro sigue sucio: detener sin descartar nada' }
git -C $macro48 merge-base --is-ancestor feature/macro-misional test/integracion-misional
if ($LASTEXITCODE -ne 0) { throw 'La relación cambió: no forzar la integración' }
# AUTORIZACIÓN DE MERGE requerida.
git -C $macro48 merge --ff-only test/integracion-misional
if ($LASTEXITCODE -ne 0) { throw 'No se completó el avance rápido' }
git -C $macro48 diff --exit-code test/integracion-misional feature/macro-misional
if ($LASTEXITCODE -ne 0) { throw 'Macro no coincide con el contenido aprobado de pruebas' }
```

### 4. Crear candidato que conserve main remoto

Esta fase es una fusión real futura en un worktree nuevo, no un comando realizado aquí. Primero autorizar su creación/merge. Git puede devolver conflicto: conservar ese estado y revisar; no continuar automáticamente al commit. El cuerpo de esta sección requiere intervención humana y las comprobaciones focalizadas anteriores.

```powershell
if (Test-Path -LiteralPath $candidate48) { throw 'El destino ya existe: revisar, no sobrescribir' }
git -C $repo48 show-ref --verify --quiet refs/heads/integration/entrega-academica-p48
if ($LASTEXITCODE -eq 0) { throw 'La rama candidata ya existe: recuperar su estado, no recrearla' }
# AUTORIZACIÓN DE CREACIÓN DE RAMA/WORKTREE requerida.
git -C $repo48 worktree add -b integration/entrega-academica-p48 $candidate48 origin/main
if ($LASTEXITCODE -ne 0) { throw 'No se creó el candidato' }
git -C $candidate48 status --short
# AUTORIZACIÓN DE FUSIÓN DE ENSAYO requerida. Conserva el main remoto, no se elige ours/theirs globalmente.
git -C $candidate48 merge --no-ff --no-commit feature/macro-misional
# Con o sin conflictos, detener aquí para revisar la unión semántica; no publicar todavía.
git -C $candidate48 status --short
git -C $candidate48 ls-files --unmerged
git -C $candidate48 diff --name-only --diff-filter=U
git -C $candidate48 diff --check
# Resolver manualmente SOLO los archivos realmente en conflicto; revisar App.tsx, TeachingPage.tsx y README.
# Registrar cada resolución con git -C $candidate48 add -- 'ruta/revisada'; nunca git checkout --ours/--theirs indiscriminado.
# Si la resolución no se aprueba, con este worktree inicialmente limpio:
# git -C $candidate48 merge --abort
# Mantener el candidato sin commit hasta validar las diferencias y recibir autorización.
```

Detenerse aquí. Resolver y preparar únicamente los archivos revisados, completar las comprobaciones focalizadas autorizadas y obtener aprobación del contenido resultante antes de ejecutar el siguiente bloque. Revisar el diff preparado completo. Si se interrumpe la sesión, recuperar los OID y el estado existente; no repetir stash, commits ni creación del candidato.

```powershell
$unmerged48 = @(git -C $candidate48 diff --name-only --diff-filter=U)
if ($LASTEXITCODE -ne 0 -or $unmerged48.Count -ne 0) { throw 'Quedan conflictos o no pudo verificarse el índice' }
git -C $candidate48 diff --cached --check
if ($LASTEXITCODE -ne 0) { throw 'El candidato tiene errores de formato' }
git -C $candidate48 commit -m 'merge: integrar misional conservando el main remoto'
if ($LASTEXITCODE -ne 0) { throw 'Integración no confirmada' }
$release48 = git -C $candidate48 rev-parse HEAD
git -C $candidate48 merge-base --is-ancestor $mainRemoto48 $release48
if ($LASTEXITCODE -ne 0) { throw 'Se perdió la ascendencia remota' }
git -C $candidate48 merge-base --is-ancestor feature/macro-misional $release48
if ($LASTEXITCODE -ne 0) { throw 'Falta la rama misional aprobada' }
git -C $candidate48 diff --name-status $qaEntrega48 $release48 -- backend frontend e2e docker-compose.yml README.md
# No atribuir314/46delPrompt47 a $release48: revisar y documentar los cambios de esta salida.
```

Registrar los conflictos, su resolución, el árbol final y las comprobaciones efectivas. Verificar que no se introdujo useFieldErrors.tsx ni los otros seis contenidos aplazados. Si se incluyen mejoras nuevas o cambios de seeders, mantener su evidencia separada dePrompt47. No autorizar la promoción solo porque no haya marcadores de conflicto.

### 5. Promover y publicar únicamente el candidato aprobado

Esta fase no está autorizada porPrompt48. Requiere limpieza controlada del worktree principal, revisión del candidato y autorización explícita de promoción/publicación. Usar las políticas de ramas de GitHub; si requieren PR, detener el push directo y preparar el PR solo cuando se autorice. Nunca forzar.

```powershell
# Solo después de revisión de seguridad, comprobaciones focalizadas del candidato y autorización de promoción/publicación.
# No repetir las suites completas por esta preparación documental.
git -C $repo48 fetch origin
if ((git -C $repo48 rev-parse origin/main) -ne $mainRemoto48) { throw 'Main cambió: volver a revisar la integración, sin force' }
$remaining48 = @(git -C $repo48 status --porcelain --untracked-files=all | Where-Object { $_ -notmatch '^\?\? Microsoft/' })
if ($remaining48.Count -ne 0) { throw 'Hay cambios sin preservar: no cambiar de rama' }
# Microsoft/ es el caché local conocido: no borrarlo ni agregarlo. Si aparece otra ruta, detenerse.
git -C $repo48 switch main
if ($LASTEXITCODE -ne 0) { throw 'No se cambió a main' }
git -C $repo48 merge --ff-only origin/main
if ($LASTEXITCODE -ne 0) { throw 'Main local divergió: no restablecerlo' }
git -C $repo48 merge --ff-only integration/entrega-academica-p48
if ($LASTEXITCODE -ne 0) { throw 'Main no puede avanzar: revisar sin force' }
if ((git -C $repo48 rev-parse main) -ne $release48) { throw 'Main no coincide con el candidato aprobado' }
git -C $repo48 diff --check
git -C $repo48 status --short
# AUTORIZACIÓN ESPECÍFICA DE PUSH requerida; verificar protecciones de GitHub antes.
git -C $repo48 push --dry-run origin test/integracion-misional feature/macro-misional main
if ($LASTEXITCODE -ne 0) { throw 'Dry-run rechazado: revisar políticas y no publicar' }
# Si exige PR o rechaza políticas, no eludirlo: preparar PR en instrucción autorizada.
git -C $repo48 push --atomic origin test/integracion-misional feature/macro-misional main
if ($LASTEXITCODE -ne 0) { throw 'Publicación no confirmada: consultar refs remotos antes de cualquier reintento' }
# No usar --force ni --force-with-lease. No borrar ramas ni stash. Tags/PR requieren aprobación separada.
```

## Criterios de cierre y actividades pendientes de autorización

| Acción | Estado/autorización |
|---|---|
| Auditoría, copias privadas, dos documentos y lectura de GitHub |Realizados; no modifican código o refs |
| Repetir314 Pest/46 E2E |No autorizado ni necesario para esta preparación; no se ejecutó |
| Integrar cualquiera de los siete |No recomendado para esta entrega; requiere aprobación y comprobaciones propias |
| Resolver literales demo/fixture y política de publicación |Pendiente de decisión; no se expusieron sus valores ni se sanearon originales por cuenta propia |
| Fetch, staging, stash, nuevas ramas/worktrees o recuperación de pendientes |Propuestos; solicitar autorización antes de ejecutarlos |
| Commit/merge/cherry-pick/reset |No ejecutados; commit/merge solo tras aprobación concreta; cherry-pick/reset no forman parte del plan |
| Validar candidato remoto nuevo |Pendiente de revisión/autorización focalizada; no hereda314/46 |
| Push, tags, PR o despliegue |No ejecutados; requieren autorización separada |

**Recomendación para main:** conservar los dos commits remotos y promover únicamente el futuro candidato revisado con misional+documentación, excluyendo los siete pendientes. Su SHA no existe aún y no se declara validado. Para entrega académica inmediata, identificar el contenido sellado de1a04303 y los resultados delPrompt47, con este plan de integración pendiente; no llamar main al snapshot local ni presentar QA como certificación ISO.

Evidencia privada de esta auditoría: .tools/qa-final47/evidence/prompt48/audit.json, remote-snapshot.json y pending-backup/. No se publican. Los informes históricos se conservan intactos. La lista54 es una lista definitiva de candidatos a versionar bajo estas condiciones, no una autorización de publicar secretos ni un staging ya realizado.

---

## Prompt 49 — Autorización e integración local (actualización del 12/11/2026)

Esta sección actualiza la propuesta del Prompt 48 sin borrar su contexto histórico. El Prompt 49 autoriza fetch, staging selectivo, commits locales, rama/worktree candidato e integración local; no autoriza push ni modificar main. Las referencias remotas se actualizaron mediante fetch: origin/main permanece en 0d986126da3e21cf96e15a0a881d165727d5d5ff. Main local permanece en 8a8f42a. Se corrigió en las tres celdas del inventario un espacio tipográfico dentro del SHA a5cedf2; no cambió esa referencia Git.

Auditoría previa: las 54 rutas existen y fueron leídas/comparadas individualmente. Cero coincidencias con las credenciales privadas examinadas, cero patrones de token/clave de alta señal y cero rutas privadas en la selección. Los únicos hallazgos numéricos adicionales corresponden al identificador público del propietario del repositorio. No se identificaron datos personales sensibles en los archivos seleccionados. Esta comprobación no es una certificación exhaustiva de secretos de toda la historia.

Los literales demo/fixture ya públicos, señalados en Prompt 48, no se confunden con credenciales privadas ni se modifican automáticamente: ninguno está dentro de las 54 rutas seleccionadas. Se conserva su advertencia para revisión final de publicación; no se afirma que todo el repositorio esté libre de contraseñas literales.

Se acreditaron otra vez los 603 sellos de fuentes, cuatro sellos de documentos históricos del Prompt 47 y los siete archivos pendientes del otro worktree. Estos últimos quedan excluidos íntegramente, sin stash ni sobrescritura. La copia histórica del plan y el informe individual por archivo se conservan únicamente en .tools/qa-final47/evidence/prompt49/.

Orden autorizado para esta intervención: registrar las 54 rutas públicas en test/integracion-misional; crear integration/eco-aula-entrega-final en un worktree nuevo basado en origin/main; fusionar test/integracion-misional, que ya contiene feature/macro-misional como ancestro. No se avanza la rama macro ni se fusionan de nuevo sus ramas hijas. Esto sustituye, para Prompt 49, las fases anteriores que proponían stash y avance de macro o promoción de main.

El ensayo se realizará con --no-ff --no-commit. Si aparecen conflictos funcionales, se conservará su estado y se documentarán ambos lados y una propuesta antes de aplicar cualquier resolución que cambie comportamiento. El informe de ejecución será resultado-integracion-local.md. Ningún candidato nuevo hereda automáticamente las regresiones históricas 314/314 y 46/46 del contenido sellado de 1a04303.

### Resultado efectivo del ensayo — Prompt 49

Se creó el commit local `01b4c963f3aa8183d32aea7c7c8e4f5ff118475c` con las 54 rutas verificadas y el candidato `integration/eco-aula-entrega-final` en `D:/zarate-saas-entrega-final`, desde `origin/main` 0d98612. La fusión conserva MERGE_HEAD 01b4c96 y HEAD 0d98612: **no existe todavía commit de integración**.

Estado **C. INTEGRACIÓN PARCIAL CON CONFLICTOS**: App.tsx tiene un bloque y TeachingPage.tsx tres bloques sin resolver. README se fusionó automáticamente, sin resolución manual. Se preservan 196 rutas sin conflicto en el índice y dos entradas unmerged. Los siete pendientes permanecen intactos y excluidos, sin mover la rama macro ni usar stash.

La propuesta de composición de rutas, props, navegación y permisos está en [resultado-integracion-local.md](resultado-integracion-local.md). No se aplicó porque modifica comportamiento y requiere revisión previa según Prompt 49. Build, ESLint, TypeScript E2E y pruebas focalizadas del candidato quedan NO EJECUTADOS. El diff --check del origen y del contenido preparado sin conflicto aprueba; el árbol candidato devuelve 2 por los 12 marcadores de conflicto, que se conservan como evidencia.

Este informe complementario y el anexo del plan constituyen documentación adicional expresamente autorizada, separada de las 54 rutas del commit inicial. No reiniciar el merge ni promover main; revisar primero la resolución propuesta y luego recuperar cualquier commit documental posterior de test. No hubo push, cambio de main, modificación de bases ni reejecución de QA.

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
