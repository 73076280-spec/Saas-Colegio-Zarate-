# Validación integral misional — Diagnóstico del entorno

Fecha: 02/11/2026. Repositorio `D:\zarate-saas`. Rama verificada: `test/integracion-misional`. HEAD: `4e40a13`, merge de comunicación institucional. Estado inicial de Git limpio y sin diferencias de archivos frente a `feature/macro-misional` en la comparación de ramas.

**Clasificación: REQUIERE CONFIGURACIÓN.** Hay herramientas y dependencias locales suficientes para planificar un entorno aislado, pero todavía no está acreditado un backend HTTP de pruebas ni el aislamiento operativo de MySQL. El PHP predeterminado es incompatible con el requisito del proyecto. No está autorizado iniciar pruebas reales con escritura en el entorno actual.

Esta fase es exclusivamente diagnóstica. Se ejecutaron versiones de herramientas, lecturas de archivos/metadatos, inventario de procesos, sondas TCP sin SQL y un GET al frontend existente. **No se ejecutaron Pest, Cypress, build, migraciones, seeders, Artisan, consultas SQL ni pruebas de integración.** No se iniciaron servicios ni se modificó configuración. Pruebas funcionales actuales: **0 ejecutadas; ninguna aprobación o fallo funcional declarado**. Las suites identificadas quedan NO EJECUTADAS en esta fase.

Prompt completo en [prompt-01-auditoria-entorno.md](prompt-01-auditoria-entorno.md). Únicos documentos creados: ese prompt y este diagnóstico. No se modifican Bolts anteriores, código, datos o permisos; no se realizan commits, push, merge ni Pull Requests.

## 1. Herramientas y dependencias verificadas

| Elemento | Evidencia local observada | Implicación |
| --- | --- | --- |
| PHP de PATH | **8.2.12**, `C:\xampp\php\php.exe`, mediante `php --version` | No cumple `php:^8.4` de `backend/composer.json`; evitar invocar `php artisan` o Composer con ese runtime. |
| PHP portátil | **8.4.26**, `.tools/php/php.exe`; carga `.tools/php/php.ini` | Runtime compatible disponible, sin instalar nada. |
| Extensiones del portátil | `PDO`, `pdo_mysql`, `mysqlnd`, `mbstring`, `intl`, `fileinfo`, `openssl`, `curl`, `dom`, `xml`, `zip`, `bcmath`, entre otras, con `-m` | Prerrequisitos principales observados; no equivale a una ejecución funcional del backend. |
| Composer | **2.10.2**, wrapper `C:\ProgramData\ComposerSetup\bin\composer.bat` | El wrapper llama al PHP de PATH y usa 8.2.12. El mismo PHAR se comprobó con PHP portátil y reportó 8.4.26. No se ejecutó install/update/diagnose ni scripts. |
| Node/npm | **26.7.0 / 11.19.0** | Compatibles con el rango Node declarado por frontend/E2E. |
| MySQL portátil | Cliente y servidor **8.4.11**, `.tools/mysql-8.4.11-winx64/bin/`, mediante `--version` | Binarios disponibles; no se inicializó ni arrancó MySQL. No se encontró cliente mysql en PATH. |
| Backend instalado | `backend/vendor/autoload.php` presente; metadatos `vendor/composer/installed.json`: Laravel **13.34.0**, Sanctum **4.3.3**, Spatie Permission **7.4.2**, Pest **4.7.8**, PHPUnit **12.5.33** | Dependencias presentes, no acreditación de conexión o integridad completa de vendor. |
| Frontend instalado | `node_modules` presente; React **19.3.0**, Vite **8.3.2**, TypeScript **6.0.3** leídos de paquetes instalados | Diferenciar versión instalada de rango declarado (`~6.0.2` para TS). No se compiló en esta fase. |
| E2E instalado | `node_modules` presente; Cypress **16.1.1**, TypeScript **6.0.2**; caché `.tools/cypress-cache` disponible | No se arrancó el runner; versión del paquete no demuestra arranque actual del binario/navegador. |

La invocación futura debe escoger explícitamente `.tools/php/php.exe`, también para el PHAR de Composer o `vendor/bin/pest`. No se cambió PATH ni se instaló otra versión.

## 2. Servicios, puertos y React/Vite

Se inventariaron procesos: se observaron procesos Node; no se observaron procesos `php`/`mysqld` en esa consulta. El inventario de procesos y puertos es una foto temporal, no garantía global del sistema.

| IPv4 local, sonda TCP | Resultado observado |
| --- | --- |
| 3306 | No completó conexión en 500 ms. |
| 3307 | No completó conexión en 500 ms. |
| 8000 | No completó conexión en 500 ms. |
| 8001 | No completó conexión en 500 ms. |
| 5173 | TCP accesible; GET `http://127.0.0.1:5173/` devolvió **HTTP 200** y entrada Vite/React. |
| 5174 | No completó conexión en 500 ms. |

Las sondas no enviaron SQL ni autenticaron usuarios. No se debe convertir un timeout corto en prueba absoluta de servicio detenido o puerto libre: confirmar ocupación/permisos nuevamente antes de cualquier arranque. El HTTP 200 de Vite tampoco acredita Laravel, MySQL o compilación productiva.

`frontend/vite.config.ts` usa host `0.0.0.0`, puerto **5173** y `strictPort:true`. Proxy `/api` y `/sanctum` apunta a `API_PROXY_TARGET` o por defecto `http://127.0.0.1:8000`. Solo se encontró `.env.example` en frontend, con ese destino; no hay `.env`/`.env.local`/`.env.testing` activo en esa carpeta en el inventario. Variables del proceso podrían prevalecer; no se certifica el proxy efectivo de un proceso ya arrancado solo por leer el archivo. Intentar otro Vite en 5173 produciría conflicto mientras siga ocupado.

`e2e/cypress.config.ts` toma `CYPRESS_BASE_URL` o `http://localhost:5173`, `supportFile:false`, sin video y con captura ante fallo. El script `e2e/scripts/run-cypress.cjs` quita `ELECTRON_RUN_AS_NODE` y reutiliza la caché local. No configura Laravel, conexión de base ni fixtures. `cy.intercept` sin respuesta solo observa tráfico; no convierte un spec real en simulado.

## 3. Laravel y conexiones declaradas

| Fuente | Declaración inspeccionada, sin credenciales |
| --- | --- |
| `backend/.env` | Entorno local, MySQL `127.0.0.1:3307`, **zarate_dev**; sesión/cache file; cola sync y correo log. |
| `backend/.env.testing` | Entorno testing, MySQL `127.0.0.1:3307`, **zarate_test**; sesión/cache array; cola sync y correo array. |
| `backend/.env.example` | Entorno local y **zarate_dev**, pero puerto **3306**, distinto de los archivos locales. No es una configuración de aislamiento. |
| `backend/phpunit.xml` | Fuerza APP_ENV testing, MySQL, base/principal de pruebas, DB_URL vacío, cache/sesión array. No fuerza host/puerto: deben verificarse además de nombre y usuario. |
| `backend/config/database.php` | Lee URL/host/puerto/base/principal desde entorno; el fallback de conexión predeterminada es sqlite y de MySQL es 3306. Una DB_URL no vacía podría alterar la conexión fuera del runner. |
| `backend/bootstrap/cache/config.php` | No presente al inspeccionar. No se ejecutó config:clear ni config:cache. |
| `backend/bootstrap/app.php` | API stateful Sanctum, contexto institucional y cambio de contraseña; no se arrancó la aplicación para validar su configuración efectiva. |

**zarate_dev se considera protegida.** También se considera protegido cualquier dato institucional aunque esté en otro esquema o en una carpeta llamada test.

Se detectó presencia de configuración sensible en los archivos de entorno y de acceso administrativo en `.tools/mysql-admin.ini`; se registra solo existencia y ubicación, nunca valores. También existen credenciales ficticias de fixtures en seeders/specs históricos: no se reproducen en el diagnóstico. No se imprimieron valores de APP_KEY, contraseñas, tokens o principales configurados.

### Diferencia entre Pest y HTTP E2E

Los valores `force=true` de phpunit.xml actúan al usar ese runner; **no protegen automáticamente `artisan serve`, Vite ni Cypress**. El script `composer test` también ejecuta `artisan config:clear`; no se utilizó como supuesto chequeo de solo lectura.

`SESSION_DRIVER=array` es adecuado para pruebas Laravel controladas, pero no debe trasladarse sin análisis al servidor HTTP de Cypress: el login real necesita persistencia entre peticiones. La sesión E2E deberá tener almacenamiento exclusivo y cookie diferenciada. `backend/config/session.php` fija archivos bajo `storage_path('framework/sessions')`; cache y archivos privados también usan storage. Por ello separar solo el esquema MySQL dejaría compartidos sesiones, caché, logs, avatares y materiales si se reutiliza el mismo storage.

La versión instalada de Laravel contempla `LARAVEL_STORAGE_PATH` en `Application::storagePath`; es una opción existente para planificar almacenamiento exclusivo sin cambiar componentes. Debe comprobarse su resolución efectiva antes de preparar directorios o arrancar un servidor futuro.

## 4. MySQL existente y riesgos

`.tools/mysql-local.ini` declara servidor ligado a `127.0.0.1`, puerto **3307**, basedir portátil y datadir **`.tools/mysql-data`**. En ese datadir se observaron carpetas `zarate_dev`, `zarate_test` y esquemas de sistema. No se leyeron tablas ni se demostró que el esquema test esté vacío o sea descartable. No se usó `.tools/mysql-admin.ini` para conectar.

Riesgos concretos:

- Ambas bases están bajo el mismo datadir/instancia declarada. Arrancar o recuperar esa instancia puede escribir redo/metadatos incluso sin ejecutar SQL de negocio; no se inició.
- El mismo host/puerto diferencia bases solo por configuración y privilegios. Un nombre distinto no demuestra que la cuenta de pruebas tenga prohibido desarrollo.
- No se verificaron grants, roles MySQL heredados, CURRENT_USER, DATABASE, motores de tablas ni estado de migraciones actuales.
- `.env.example` usa otro puerto y Composer/PHP de PATH pueden ejecutar un entorno diferente del esperado.
- El backend real no quedó accesible mediante las sondas; no hay un HTTP de pruebas vinculado inequívocamente a zarate_test.

No se ejecutaron CREATE/DROP/ALTER/TRUNCATE/INSERT/UPDATE/DELETE, GRANT, migraciones ni limpieza. Tampoco se realizó conexión SQL de lectura en esta fase.

## 5. Migraciones, seeders, factories y transacciones

- `backend/database/migrations` contiene estructura SaaS, roles, años/periodos/grados, personas, matrícula/pagos, asignaciones/cursos, aula/materiales, tareas/notas, asistencia y Office. `up` crea/transforma tablas; `down` elimina tablas. No son comprobaciones inocuas y no se ejecutaron.
- `DatabaseSeeder.php` crea/reutiliza institución y permisos. `DevelopmentSeeder.php` y los `*DemoSeeder.php` preparan usuarios y datos con operaciones de escritura. El guard local/testing permite también entorno local: **no demuestra base aislada**. Algunos flujos demo publican tareas/comunicados, aprueban matrículas o llaman servicios con efectos adicionales.
- `RolePermissionSeeder.php` y los seeders de permisos escriben roles/asignaciones; no son solo catálogos en memoria.
- Las factories pueden crear dependencias desde `definition()`: por ejemplo `CourseFactory` crea una asignación docente. No tratarlas como funciones puras.
- `backend/tests/Pest.php` vincula Feature a `Tests\TestCase`; no se localizaron archivos de prueba en `backend/tests/Unit`, aunque phpunit declara esa suite.
- Los Sprints 1–10 y `AvatarTest.php` usan **DatabaseTransactions**. No se localizó RefreshDatabase en los tests propios revisados. El trait empieza la transacción antes de ejecutar el caso y revierte al destruir la aplicación; no crea el esquema ni evita enviar escrituras a una conexión errónea. Las comprobaciones de nombre en beforeEach no sustituyen un preflight previo al runner.
- Rollback no garantiza ausencia de efectos de archivos, secuencias/autoincrementos, caché o solicitudes HTTP de otro proceso. Pest y Cypress real deben ejecutarse secuencialmente, no compartiendo fixtures vivas.

## 6. Inventario y clasificación de pruebas existentes

Todas las suites de esta sección están **NO EJECUTADAS en esta fase**. Son categorías solapadas: una prueba Feature puede ser integración y funcional a la vez. No se suman como tres pruebas distintas.

| Tipo | Archivos y alcance | Necesidad de DB / escrituras |
| --- | --- | --- |
| Unitarias puras | No se localizaron tests propios en `backend/tests/Unit`. | No afirmar cobertura unitaria por la mera suite declarada. |
| Funcionales HTTP sin DB de negocio | `backend/tests/Feature/HealthTest.php`: 4 definiciones; salud, 405, 404 y ruta protegida sin autenticar. | Salud no certifica MySQL; no crea fixtures. No se ejecutó. |
| Integración de conexión/permisos SQL | `backend/tests/Feature/MySqlConnectionTest.php`: 2 definiciones, grupo mysql. | SELECT de base/control y comprobación de denegación de lectura en desarrollo. No tiene escrituras intencionadas, pero conecta/arranca Laravel; reservado hasta preflight. |
| Integración y funcionales con DB | `Sprint1Test.php` a `Sprint10Test.php`, más `AvatarTest.php`. | Factories/seeders, transacciones, escritura de identidad/academia/auditoría y archivos fake. Requieren esquema preparado y principal exclusivo. |
| E2E real | `auth`, `academic`, `people`, `enrollment`, `enrollment-center`, `courses`, `classroom`, `learning`, `attendance`, `office`, `reports`, `virtual`, `visual` (`.cy.ts`). | Login/logout ya pueden escribir auditoría y último acceso; otros flujos escriben matrícula, notas, entregas, archivos, lectura de avisos. Requieren fixtures y backend aislados. |
| Integración frontend/API real mínima | `e2e/cypress/e2e/integration.cy.ts`: health por proxy y pantalla técnica. | No crea datos de negocio por diseño; requiere servicios y verificar el endpoint destino. No reemplaza conexión MySQL. |
| E2E con API simulada de mejoras misionales | `virtual-access`, `submission-deadline`, `learning-filters`, `assessment-context`, `score-history`, `attendance-draft`, `justification-query`, `personal-attendance-query`, `communication-queries`, `communication-drafts`, `notification-consistency` (`.cy.ts`). | Fixtures/respuestas interceptadas; validan interfaz y pueden simular POST/PATCH. Revisar interceptaciones y cualquier cy.request antes de cada selección para impedir tráfico real accidental. |
| UI técnica con health simulado | `e2e/cypress/e2e/ui.cy.ts`. | Simula salud correcta/fallo/formato; no acredita API real. No se asume que simular un endpoint aísle cualquier tráfico no interceptado. |

Se localizaron **26 specs `.cy.ts`** en `e2e/cypress/e2e`. No se convierte esa cifra en cantidad de casos: existen variantes y bucles de definición. No se ejecutó el runner para descubrir/contar todos los casos.

### Correspondencia de procesos y pruebas prioritarias

Todos los archivos Pest están bajo `backend/tests/Feature/`; todos los specs bajo `e2e/cypress/e2e/`, salvo el script diagnóstico documental de BOLT-MIS-004.

| Área | Pest existente | Cypress real / simulado | Escrituras y condiciones previas |
| --- | --- | --- | --- |
| Autenticación/autorización | `Sprint1Test.php` | `auth.cy.ts`; `virtual-access.cy.ts` simulado | Usuarios, roles y auditoría; institución activa y pruebas de denegación. |
| Estructura/personas, soporte del misional | `Sprint2Test.php`, `Sprint3Test.php` | `academic.cy.ts`, `people.cy.ts` | Catálogos, año/periodo, estudiantes/docentes y vínculos familiares ficticios. |
| Matrículas | `Sprint4Test.php` | `enrollment.cy.ts`, `enrollment-center.cy.ts` | Crear/observar/corregir/pagar/aprobar; año, sección, cupo y cuentas preparadas. Incluso navegación de solo consulta autentica con efectos de auditoría. |
| Enseñanza-aprendizaje | `Sprint5Test.php`, `Sprint6Test.php`, `Sprint7Test.php` | `courses`, `classroom`, `learning`, `virtual` reales; `virtual-access`, `submission-deadline`, `learning-filters` simulados | Asignación docente, curso activo, matrícula aprobada, unidades/materiales y tareas; carga/descarga privada, entrega/revisión y estados. |
| Evaluaciones/calificaciones | `Sprint7Test.php`; reportes/resumen en `Sprint10Test.php` | `learning.cy.ts` real; `assessment-context`, `score-history` simulados | Evaluación publicada, periodo habilitado, rango y motivo de corrección. Historial de cambios de nota no equivale a expediente longitudinal. |
| Asistencia/justificaciones | `Sprint8Test.php` | `attendance.cy.ts` real; `attendance-draft`, `justification-query`, `personal-attendance-query` simulados | Sesión de curso, roster aprobado, marcas, apoderado vinculado, adjuntos, revisión y cierre. |
| Comunicaciones/notificaciones | `Sprint9Test.php` | `office.cy.ts` real; `communication-queries`, `communication-drafts`, `notification-consistency` simulados | Personal autorizado, targets activos, publicación/archivo, UUID propio y marcado de lectura. Office también cubre trámites/documentos, sin inventar otro proceso. |
| Resúmenes/reportes y perfil | `Sprint10Test.php`, `AvatarTest.php` | `reports.cy.ts`, `visual.cy.ts` | Permisos y vínculos; login, archivos/sesión y posibles cambios deben permanecer aislados. |

**No usar «solo GET» del listado como prueba de que un spec no escribe:** `AuthService.php` actualiza último acceso/auditoría al autenticar y registra logout. Asimismo cy.request no se vuelve simulado por cy.intercept del navegador.

## 7. Estrategia de aislamiento propuesta, todavía no ejecutada

Se recomienda **segunda instancia MySQL portátil con datadir nuevo y puerto exclusivo**, reutilizando los binarios ya disponibles. Es preferible a arrancar/modificar la instancia compartida de 3307 cuyo datadir contiene desarrollo. No requiere introducir Docker ni instalar motores adicionales.

| Capa | Propuesta para una fase posterior autorizada |
| --- | --- |
| MySQL | Puerto candidato **3308**, pendiente de comprobar; datadir candidato `.tools/mysql-test-data`, nuevo y vacío, separado de `.tools/mysql-data`. No tocar el datadir existente. |
| Esquema | Mantener **zarate_test**, compatible con `phpunit.xml`, tests y `backend/AGENTS.md`, pero dentro de la instancia exclusiva. No cambiar nombres arbitrariamente sin revisar guards. |
| Principal | Exclusivo de pruebas, privilegios mínimos sobre ese esquema; sin acceso global, GRANT OPTION, administración del servidor ni acceso a desarrollo/otras bases. Revisar también roles heredados y grants por host. No usar el archivo administrativo actual en la aplicación. |
| Laravel Pest | PHP portátil, configuración testing explícita, host/puerto/base/principal comprobados; sesiones/cache array para runner. No usar el PHP de PATH ni scripts amplios que muten configuración antes de comprobarla. |
| Laravel HTTP E2E | Proceso separado en puerto candidato **8001**, APP_ENV testing y conexión exclusiva comprobada. Sesión persistente para login multi-request, correo sin entrega real y cookie distinta de desarrollo. |
| Storage | Directorio exclusivo, por ejemplo `.tools/integration-storage`, resuelto por `LARAVEL_STORAGE_PATH`. Separar sesiones, caché, logs y materiales/avatares; no limpiar `backend/storage` compartido. Verificar valores efectivos de discos/configuración antes de usarlo. |
| React/Vite | Instancia candidata **5174** con strictPort y proxy de API/Sanctum exclusivamente al backend de pruebas. No reutilizar el frontend de 5173 como si phpunit cambiara su backend. |
| Cypress | `CYPRESS_BASE_URL` del frontend de pruebas, navegador/perfil de pruebas; probar que `/api` y `/sanctum` llegan al mismo backend. Configurar origen stateful Sanctum del puerto/host elegido, cookies y CSRF sin alterar producción. |

Los puertos/rutas candidatos no se crearon ni se certificaron libres; requieren verificación futura. La configuración de prueba HTTP y la de Pest tienen necesidades de sesión diferentes, aunque compartan esquema. Separar los procesos, storage y navegador evita colisiones de cookies por host y archivos; los puertos por sí solos no separan cookies.

No basta añadir `--env=testing`: overrides, DB_URL, configuración cacheada, proxy, principal y conexiones secundarias pueden desviar el destino. La preparación debe **fallar cerrada** ante datos incompletos o discrepancias.

### Condiciones verificables antes de cualquier escritura futura

1. Resolver y revisar las rutas absolutas de datadir/storage nuevos; probar que no coinciden, contienen o redirigen mediante enlaces al datadir/storage protegido. No inicializar sobre directorios existentes con datos desconocidos.
2. Acreditar destino de instancia/puerto y que el esquema nuevo contiene solo fixtures autorizadas, nunca copia de datos institucionales. Registrar inventario/schema inicial, sin publicar información personal.
3. Verificar configuración efectiva de Laravel con el mismo runtime y entorno que usará cada proceso: entorno, driver, host, puerto, base, conexión de sesión y discos; DB_URL controlada y caché coherente. No imprimir claves ni secretos.
4. Establecer conexión de solo lectura para obtener DATABASE, identidad autenticada y versión/puerto; revisar privilegios y roles. Confirmar que el principal no puede leer ni escribir desarrollo u otros esquemas, sin ejecutar un INSERT/UPDATE de prueba contra bases protegidas.
5. Examinar grants para denegar privilegios globales/delegación y acceso a directorios protegidos; una denegación de SELECT aislada no demuestra por sí sola ausencia de todos los permisos de escritura.
6. Verificar todos los motores/tablas y estado de migraciones; preparar el esquema únicamente en la instancia autorizada, con guard externo previo a cualquier comando. No confiar solo en el beforeEach de una suite.
7. Determinar fixtures/seeders mínimos en orden de dependencias, su idempotencia y efectos. Datos ficticios y trazables por corrida, sin reutilizar usuarios/datos que deban conservarse. La limpieza debe limitarse al esquema/storage exclusivo ya comprobado.
8. Comprobar health a través del proxy de pruebas y confirmar el vínculo backend/base con evidencia de preflight separada; health por sí solo no certifica MySQL. Revisar sesión/CSRF en más de una petición.
9. Ejecutar primero un caso controlado; avanzar solo si las verificaciones son satisfactorias. Detenerse ante cualquier referencia efectiva a desarrollo o fallo de guard.

Esta lista es una propuesta de preparación, **no una autorización para ejecutar migraciones o crear usuarios en esta fase**. No se incluyen comandos destructivos listos para copiar sobre el entorno existente.

## 8. Orden seguro de validación futura

El preflight de configuración y aislamiento debe preceder a arrancar servicios con capacidad de escribir. Dentro del entorno de prueba ya acreditado:

| Orden | Verificación | Condición / distinción |
| --- | --- | --- |
| 0 | Runtime, rutas, configuración y grants | Evidencia previa offline y conexión controlada; sin escrituras de negocio. Preparación de esquema solo en fase posterior autorizada. |
| 1 | Health backend directo y por proxy; `HealthTest`/`integration.cy.ts` | Salud técnica no dependiente de DB; no login. No demuestra persistencia. |
| 2 | Conexión controlada; `MySqlConnectionTest` | Dos casos SQL de lectura/configuración, después de revisar destino/grants. Denegación sobre desarrollo no debe sustituirse por escrituras negativas. |
| 3 | Autenticación | `Sprint1Test`, luego `auth.cy.ts`; desde aquí ya hay fixtures/auditoría/sesiones. |
| 4 | Roles, instituciones, estructura y relaciones | Resto de permisos S1, S2/S3 y specs academic/people si se incluyen; probar aislamiento y titularidad antes de flujos educativos. |
| 5 | Matrícula | S4, `enrollment.cy.ts`, `enrollment-center.cy.ts`; cupos, pago y aprobación. |
| 6 | Enseñanza-aprendizaje | S5/S6/S7 y courses/classroom/virtual/learning; docente, roster y publicación/entrega/revisión. |
| 7 | Evaluación y notas | S7/learning y resúmenes S10 cuando corresponda; rango, periodo, IDOR y corrección. No inventar publicación independiente ni expediente longitudinal. |
| 8 | Asistencia | S8 y attendance; guardado/cierre con roster controlado. |
| 9 | Justificaciones y consulta propia/familiar | S8/attendance; vínculo familiar, adjunto y revisión autorizada. |
| 10 | Comunicaciones/notificaciones | S9/office; destinatarios, publicación, archivo y marcado propio. |
| 11 | Regresión UI simulada y complementaria | Specs de mejoras, reportes/visual si se seleccionan; registrar claramente tráfico simulado frente a real. No mezclar contadores históricos. |

Pest valida reglas/transacciones en su proceso; Cypress real valida navegador, cookies/CSRF, proxy y backend. No ejecutarlos en paralelo sobre los mismos fixtures. Los tests simulados pueden servir antes como baseline de interfaz en una fase autorizada, pero no son sustituto del paso real ni se ejecutaron ahora.

## 9. Consolidado de Bolts y pendientes, sin reinterpretar merges

Fuentes revisadas: cierres de BOLT-MIS-003/004/005/006 y `evidencias.md` de BOLT-MIS-002. No se encontró `cierre-bolt.md` de BOLT-MIS-002; no se creó ni se inventa uno.

| Bolt | Antecedente documentado, no ejecución actual | Pendiente/riesgo que conserva |
| --- | --- | --- |
| MIS-002 — Matrículas | Evidencias registran 3 casos centro y 3 de matrícula aprobados, build/tipos y commit de implementación; actualización retrospectiva distingue resultados proporcionados de ejecución nueva. | Regresión real actual y aislamiento no recertificados; cuatro indicadores no se compararon individualmente. No hay cierre formal en la ruta solicitada. |
| MIS-003 — Enseñanza-aprendizaje | Cierre registra 29 Cypress simulados y **34 Pest reales** S5–S7 con aislamiento entonces acreditado; 6 Cypress reales reservados. | Ese preflight histórico no prueba disponibilidad actual. Área/asignatura NO VERIFICADO institucionalmente; límites del reloj local y retención del formulario; cobertura SQL completa de filtros no declarada. |
| MIS-004 — Evaluación | Cierre registra 50 pruebas funcionales/regresión y CDP de Enter aprobado; conserva **un fallo de la vía Cypress.press**, con 16 casos reales no ejecutados y conexión histórica 2002. | No borrar ese fallo por la fusión ni confundirlo con defecto confirmado del botón. Publicación independiente requiere confirmación; historial de cambios de una nota no es expediente longitudinal. |
| MIS-005 — Asistencia | Cierre registra 101 simulados, 0 fallidos en su ejecución, 13 reales no ejecutados. | **M-01 PARCIAL** por navegación SPA global y cambios externos de contexto. Fórmula/periodo nominal requieren confirmación institucional, no reglas nuevas. |
| MIS-006 — Comunicación | Cierre final registra 37/37 simulados tras un primer 36/37 por timeout inicial de carga; 13 reales identificados no ejecutados. | **M-02 PARCIAL** por navegación SPA; actualización de avisos por eventos/foco/apertura, sin tiempo real. Accesibilidad global y contratos reales pendientes. |

No se suman los pendientes de Bolts como casos únicos: `learning.cy.ts`, `virtual.cy.ts` y suites Pest aparecen en más de un cierre. Tampoco se convierten aprobaciones históricas en pruebas actuales. El script diagnóstico de teclado de MIS-004 está en su carpeta documental, fuera de la búsqueda predeterminada de specs E2E; su fallo pendiente requiere tratamiento explícito del harness, sin añadir onKeyDown artificial ni alterar evidencias en esta fase.

## 10. Bloqueadores y siguientes acciones concretas

**Impiden iniciar escrituras ahora:** PHP predeterminado incorrecto; MySQL/HTTP de pruebas no acreditados; grants y datos existentes desconocidos; proxy actual no ligado a backend de pruebas; sesión HTTP/storage no aislados; ausencia de preflight efectivo repetible para ambos procesos. No se necesita instalar dependencias para corregirlos, pero su preparación requiere otra fase autorizada.

Acciones propuestas:

1. Revisar este diagnóstico y aprobar una preparación limitada a instancia/datadir/storage exclusivos, manteniendo protegidos los actuales.
2. Fijar invocación de PHP portátil y diseñar configuración de proceso separada para Pest y servidor E2E, sin reutilizar `.env` de desarrollo.
3. Preparar y revisar el guard de destino/grants/rutas antes de permitir cualquier migración; después acreditar servicio, esquema y fixtures sintéticas.
4. Validar health/conexión de solo lectura; probar luego autenticación y permisos antes de módulos misionales en el orden definido.
5. Registrar comandos, entorno, casos únicos y resultados reales por fase. Mantener pendientes SPA, accesibilidad y decisiones institucionales aunque el módulo esté fusionado.

**Conclusión de esta fase: REQUIERE CONFIGURACIÓN.** Herramientas portátiles y dependencias están disponibles; frontend técnico accesible, backend/MySQL de pruebas no acreditados. La estrategia segura puede prepararse en una fase posterior, pero no se ejecutó ni se autorizó aquí ninguna operación de escritura o prueba integral.
