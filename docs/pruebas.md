# Pruebas del proyecto

Los resultados y pendientes del cierre de Sprint 10 se registran en [quality-metrics.md](quality-metrics.md). Los comandos de este documento no sustituyen la evidencia de ejecución final.

## Pest y MySQL

Usar PHP 8.4 y una base MySQL dedicada zarate_test, usuario zarate_test sin acceso a zarate_dev.
Configurar .env.testing desde su ejemplo, sin sobrescribir claves existentes.
phpunit.xml fuerza entorno testing, base, usuario, DB_URL vacío y dominio SPA de prueba.
No ejecutar pruebas con config cacheada.

Desde backend:

```text
php artisan migrate --env=testing
php vendor/bin/pint --test
php vendor/bin/pest
```

Sprint1Test usa DatabaseTransactions y revierte sus datos al terminar cada caso.
No usa RefreshDatabase ni borra tablas.
Las pruebas de conexión verifican MySQL real y que el usuario de testing no pueda consultar desarrollo.
No basta ejecutar --exclude-group=mysql: las pruebas SaaS también requieren MySQL.
Con PHP portátil puede usarse D:\zarate-saas\.tools\php\php.exe en lugar de php.

## Frontend

Desde frontend:

```text
npm ci
npm run lint
npm run build
```

ESLint 10 valida React/TypeScript; build ejecuta tsc y Vite.
La salida dist es generada, no se versiona.

## Cypress

Con Laravel en localhost:8000, Vite en localhost:5173 y MySQL local disponible.
Preparar las cuentas demo una vez, desde backend:

```text
php artisan migrate
php artisan db:seed --class=DevelopmentSeeder
```

DevelopmentSeeder prepara en local/testing todo el conjunto idempotente de datos demo, incluidos cursos, grados, secciones y matrículas aprobadas. Desde Sprint 2 los seeders de permisos conceden permisos de forma aditiva. DevelopmentSeeder reasigna los roles de las cuentas demo; no usarlo para cuentas personalizadas.
Desde e2e:

```text
npm ci
npm run typecheck
npm test
```

auth.cy.ts valida login correcto/incorrecto, seis dashboards, identidad, recarga, sesión, logout, autorización, móvil y CSRF con backend real.
integration.cy.ts consulta /api/health real.
ui.cy.ts simula respuestas del endpoint de salud para probar éxito, fallo y reintento.
Cypress agrega únicamente auditoría y last_login_at al usar las cuentas demo; no reinicia bases.
Login tiene rate limiting: esperar un minuto si se repite rápidamente la suite de autenticación varias veces.
El runner elimina ELECTRON_RUN_AS_NODE y reutiliza .tools/cypress-cache si existe.
Electron 146 pasa actualmente; Cypress anuncia su futura retirada como navegador de pruebas. Evaluar Chrome antes de actualizar Cypress.

## Resultados

La documentación del Sprint 1 registra el total de la ejecución final.
Los controles de formato, lint y compilación se reportan separados del número de tests.

## Regresión académica — Sprint 2

Sprint2Test.php utiliza transacciones en zarate_test y cubre entidades, relaciones, invariantes, Policies, filtros y auditoría.
academic.cy.ts utiliza las cuentas demo del Sprint 1 y los datos de AcademicDemoSeeder.
Crea asignaturas y años con prefijo E2E y sufijos únicos; al terminar los desactiva/cierra, sin borrar registros.
No requiere resetear MySQL ni limpiar las pruebas anteriores.
Ejecutar `npm test` desde e2e para incluir tanto los cuatro flujos nuevos como las 13 pruebas previas.
Ver resultados finales en [Sprint 2](sprints/sprint-2.md).

## Regresión de personas — Sprint 3

Sprint3Test.php cubre cuentas+perfiles, reutilización, permisos, IDOR, privacidad, estados, familiares, principal, auditoría y transacciones.
people.cy.ts prueba los flujos de personas y los perfiles propios con Laravel real.
Se necesitan los datos de PeopleDemoSeeder, que incluyen las relaciones de student/guardian demo.
La suite no elimina las personas creadas por E2E: usa documentos, códigos y correos únicos con prefijo E2E.
`npm test` ejecuta las cinco especificaciones acumuladas. Los controles finales y resultados están en [Sprint 3](sprints/sprint-3.md).

## Regresión de matrícula — Sprint 4

Sprint4Test.php añade 21 pruebas de alto valor: reglas de aprobación, transiciones, aislamiento, permisos, integridad en base de datos, pagos, cupos y rollback. Se conserva la regresión previa.

EnrollmentDemoSeeder requiere los seeds anteriores y prepara concepto/pagos/matrículas ficticios. enrollment.cy.ts agrupa tres flujos: proceso Secretaría/Tesorería, consulta propia/familiar y restricción docente. Usa estudiantes, años, niveles, grados y secciones aislados con sufijos únicos. Los datos se conservan sin borrar ni cambiar seeds esenciales.

Las esperas E2E se sincronizan con respuestas HTTP de transiciones y logout; no usan pausas arbitrarias. El frontend oculta el detalle durante la edición/recarga para impedir acciones sobre un estado obsoleto.

`npm test` ejecuta las seis especificaciones acumuladas. Resultados finales: [Sprint 4](sprints/sprint-4.md).
## Regresión de cursos — Sprint 5

Sprint5Test.php añade **12 pruebas principales**, sin datasets que multipliquen el contador. Prioriza coherencia académica, duplicados, acceso por asignación/matrícula, revocación, IDOR, permisos y rollback de auditoría.

courses.cy.ts añade **3 flujos E2E**: administración, portal docente/roster y portal estudiante con negativa de acceso. CourseDemoSeeder prepara un curso sobre la matrícula aprobada demo; los datos de escritura E2E usan estructuras aisladas y sufijos únicos.

La regresión completa comprende siete especificaciones Cypress. Las reejecuciones no se suman al total. Resultados: [Sprint 5](sprints/sprint-5.md).

## Regresión del Aula Virtual — Sprint 6

Sprint6Test.php agrega **12 casos Pest principales**: ciclo de publicación/archivo, secuencia única, curso activo y unidad publicada, tipos de materiales, archivos privados, MIME real y tamaño, lectura estudiantil según matrícula, permisos, aislamiento, rollback con archivo, auditoría y paginación.

classroom.cy.ts agrega **3 flujos E2E**: gestión docente de unidad/archivo, lectura y descarga del estudiante aprobado, y denegación por borrador o matrícula no aprobada. Usa ClassroomDemoSeeder sobre el curso demo, registros ficticios únicos y esperas de respuestas HTTP; no modifica la matrícula ni las unidades demo.

La suite completa comprende ocho especificaciones Cypress. Se conservan las pruebas de los sprints anteriores, incluida el alta de estudiantes por Secretaría. Las reejecuciones no se cuentan como pruebas nuevas. Resultados finales y comandos: [Sprint 6](sprints/sprint-6.md).

## Regresión académica — Sprint 7

Sprint7Test.php agrega exactamente **10 casos Pest**. Comprueban curso propio/ajeno, matrícula aprobada, IDOR de tareas/entregas/notas, entregas privadas y tardías, revisión y reintentos, rango de notas, periodo cerrado, motivo e historial, rollback de nota/archivo y normalización UTC dentro de esos mismos casos.

learning.cy.ts agrega exactamente **3 flujos**: tarea publicada con entrega/revisión, envío estudiantil de archivo y nota registrada por docente consultada por su estudiante. Los datos nuevos usan títulos únicos; el seeder conserva las notas demo.

La suite comprende nueve especificaciones Cypress. Los intentos repetidos y aserciones agrupadas no incrementan el contador de pruebas. Preparación, comandos y resultados: [Sprint 7](sprints/sprint-7.md).
