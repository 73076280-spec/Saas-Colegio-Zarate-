# Prompt 39 — Diagnóstico HTTP y plan E2E

Fecha de cierre documental: 10/11/2026. Rama: `test/integracion-misional`. HEAD: `1a043035c126a5bc3e5ed14cf43fdd49a4e171bf`.

## Estado y alcance

**B — HTTP REAL PARCIAL, con diagnóstico concluido y plan SQL preparado para revisión.** React → proxy → Laravel responde correctamente en las comprobaciones realizadas. El caso original continúa fallando y permanece sin modificar; la variante privada demuestra una corrección del test, cuya aplicación requiere aprobación expresa. No se certifica todavía la suite original ni integración con MySQL.

Se conservaron 141 casos Cypress simulados aprobados y el checkpoint Pest de 276 casos/1.724 aserciones; no se repitieron. Los 38 casos Pest bloqueados continúan fuera del alcance. No se creó ninguna base, usuario, privilegio, migración ni fixture SQL. No se ejecutó Pest.

## Causa demostrada

En `frontend/src/main.tsx`, StrictMode ejecuta el ciclo adicional de montaje y limpieza de efectos en desarrollo. El efecto de `frontend/src/pages/TechnicalPage.tsx` crea un AbortController y su limpieza llama a abort(). `frontend/src/api/health.ts` transmite esa señal al fetch real. La traza inicial registra AbortError a los **7 ms**; la siguiente petición obtiene HTTP 200 y JSON exacto `{status:'ok', service:'backend'}`.

La instrumentación complementaria capturó la pila del abort: TechnicalPage.tsx → commitHookEffectListUnmount → disconnectPassiveEffect → doubleInvokeEffectsOnFiber → commitDoubleInvokeEffectsInDEV. Las tres repeticiones finales cancelaron la primera petición a los **4, 4 y 3 ms**, y completaron la siguiente con 200 y el JSON esperado. No hubo navegación, redirección ni cambio de dependencia provocado por el escenario; no fue el timeout de 10 segundos. El interceptor se registra antes de cy.visit(). No se demostró un defecto funcional de este flujo: la limpieza cancela la petición anterior, el indicador active evita actualizar desde ella y la segunda deja visible “Backend conectado correctamente.” Esto no equivale a validar todo el frontend.

El contrato original es correcto: cy.request devuelve response.status; cy.wait devuelve una intercepción cuya response.statusCode existe cuando recibió respuesta. En `e2e/cypress/e2e/integration.cy.ts`, cy.wait('@health') selecciona primero la petición cancelada, con BrowserConnectionClosedError y sin response. Por eso falla la lectura encadenada de response.statusCode. No se trata de intercambiar indiscriminadamente status y statusCode.

## Prueba privada y cambio propuesto

El parche revisable está en `.tools/misional-isolated/evidence/prompt39/propuesta-integracion-normalizada.diff`. Afectaría exclusivamente al test integration.cy.ts y a un helper nuevo `e2e/cypress/support/observeHealth.ts`. **No se aplicó.** git apply --check aprobó sin alterar archivos. La propuesta TypeScript pasó comprobación noEmit, sin errores.

La variante conserva la petición directa, el HTTP 200, el JSON exacto y la comprobación visual. Observa todas las intercepciones reales y valida las respuestas terminadas. Solo reconoce como cancelación esperada la primera petición si coinciden AbortError, pila de limpieza TechnicalPage/StrictMode y error de conexión del interceptor. Cualquier cancelación adicional, navegación, error de red distinto, respuesta no 200 o JSON incorrecto falla. Guarda ID, URL, estado y cuerpo de la respuesta validada. No usa mocks, no desactiva StrictMode ni añade esperas temporales fijas. Los IDs se reutilizan entre navegadores nuevos y no deben considerarse globalmente únicos.

El helper de diagnóstico depende de las pilas de React en desarrollo y del contrato de intercepción de Cypress; requiere revisión si cambian esas versiones. El código compilado de la variante conserva las aserciones de la propuesta.

## Resultados exactos y fallos conservados

| Ejecución | Aprobadas | Fallidas | Observación |
|---|---:|---:|---|
| Original integration.cy.ts, reproducido | 0 | 1 | Misma cancelación inicial; original intacto |
| Diagnóstico HTTP real | 3 | 0 | Laravel directo, proxy y consumo React |
| Primera preparación de variante | 0 | 0 casos | Fallo del empaquetador TS18002; un fallo de preparación, no un caso ejecutado |
| Segunda variante | 0 | 1 | Instrumentación usó Cypress.env(), eliminado en Cypress 16; se detuvo |
| Variante final, tres navegadores consecutivos | 3 ejecuciones | 0 | Un único escenario lógico repetido tres veces, sin retries |

Total auxiliar de Prompt 39: **8 ejecuciones de casos: 6 aprobadas y 2 fallidas**, más un fallo de preparación sin ejecutar casos. Son cuatro escenarios auxiliares distintos aprobados, no seis casos nuevos distintos. No se borraron los fallos intermedios ni se sumaron estas repeticiones al inventario original de 188. Este conserva 141 aprobados simulados, un fallo HTTP original y **46 no ejecutados**. No se ejecutó E2E SQL real.

Evidencias privadas, relativas a `.tools/misional-isolated/evidence/`:

- prompt39/run/result.json, trace-original.json y trace-react.json: fallo original y tres éxitos HTTP; cancelación inicial de 7 ms.
- prompt39v/run/: fallo de preparación TS18002.
- prompt39v2/run/: fallo de instrumentación Cypress.env; conservado.
- prompt39v3/run/result.json, variant-trace-1.json a variant-trace-3.json, resultados individuales y JUnit: tres ejecuciones finales aprobadas; capturas en el perfil privado correspondiente.
- prompt39/proposal-typecheck.json, prior-cypress-verification.json y closure-audit.json: comprobación TypeScript, resultados históricos e integridad.
- prompt39/e2e-plan.json y blocked46-review.json: inventario estructurado y revisión de código, no resultados de ejecución SQL.

## Infraestructura propuesta, todavía inexistente

| Recurso | Propuesta y condición de seguridad |
|---|---|
| MySQL | Instancia exclusiva 127.0.0.1:3309; base zarate_cypress_e2e |
| Directorio | D:/zarate-saas/.tools/cypress-e2e/mysql-data; baseline-cold separado bajo el mismo árbol privado |
| Cuentas nuevas | zarate_cypress_migrator@127.0.0.1 y zarate_cypress_app@127.0.0.1; sin modificar cuentas existentes |
| Privilegios | Migrador: solo creación del esquema mediante los 14 ups originales y preparación autorizada; aplicación: SELECT/INSERT/UPDATE solo en la base nueva. DELETE de communication_targets solo si se autorizan expresamente los dos casos afectados. Sin privilegios globales ni GRANT OPTION |
| TLS | CA privada, certificado con SAN de la dirección SQL, verificación efectiva de CA e identidad; require_secure_transport; sin desactivar TLS ni cambiar confianza global de Windows |
| HTTP | Backend 127.0.0.2:8001 y React 127.0.0.2:5174, procesos privados identificados; no servicios demo |
| Cookies | Host distinto para aislar cookies: los puertos por sí solos no aíslan XSRF-TOKEN. SESSION_DOMAIN nulo y nombre exclusivo eco_cypress_e2e_session; sin editar hosts |
| Sanctum/CORS | APP_ENV=testing; APP_URL y FRONTEND_URL privados; Origin exacto y SANCTUM_STATEFUL_DOMAINS=127.0.0.2:5174 |
| Archivos | Storage, uploads, caché, sesiones, logs, temporales, descargas y capturas privados; no compartir storage de desarrollo |
| Cache/sesión | File en directorios privados persistentes entre solicitudes; no array si rompe autenticación o límites |
| Servicios | Mail array, sin envío externo; cola sync solo tras revisar notificaciones locales necesarias; no integraciones externas implícitas |

Los binds efímeros de 3309 y de 127.0.0.2:8001/5174 aprobaron el 10/11/2026 a las 17:50:49 UTC; se cerraron inmediatamente. No iniciaron MySQL ni aplicaciones. Es una comprobación puntual: repetir antes de aprovisionar. Los ensayos HTTP ejecutados usaron 127.0.0.1, no la dirección futura 127.0.0.2.

Cada arranque y acceso SQL debe atestar PID, ejecutable, fecha de creación, UUID, puerto, datadir, cuenta, esquema y TLS **antes de permitir PDO**. Mantener TTL de 120 segundos, sin ampliarlo ni renovarlo dentro de una transacción. Rechazar zarate_dev, zarate_test y zarate_pest, puertos 3307/3308 y cualquier identidad distinta; comprobar negativas antes de habilitar escrituras. No reutilizar sin adaptación una guarda Pest de un solo proceso para un servidor HTTP persistente.

Las siguientes migraciones originales se aplicarían únicamente tras autorización y guardas positivas/negativas; no se modifican sus fuentes:

- 0001_01_01_000000_create_users_table.php
- 0001_01_01_000001_create_cache_table.php
- 0001_01_01_000002_create_jobs_table.php
- 2026_10_01_131619_create_personal_access_tokens_table.php
- 2026_10_01_131621_create_permission_tables.php
- 2026_10_01_150000_create_saas_core.php
- 2026_10_01_160000_create_academic_structure.php
- 2026_10_01_170000_create_people.php
- 2026_10_02_000000_create_enrollment_tables.php
- 2026_10_02_120000_create_courses_and_teacher_assignments.php
- 2026_10_02_140000_create_classroom_tables.php
- 2026_10_04_100000_create_learning_tables.php
- 2026_10_05_100000_create_attendance_tables.php
- 2026_10_05_110000_create_academic_office_tables.php

Objetivo de verificación posterior: 14 migraciones y 52 tablas, cotejadas con el manifiesto esperado; **todavía no comprobado en la base candidata**. No usar migrate:fresh, DROP, TRUNCATE ni seeders demo.

## Fixtures, restauración y recuperación

Fixtures exclusivamente sintéticos: F-CORE (institución y actores de seis roles, contraseña inicial no pendiente); F-ACA (año/periodos/niveles/grados/secciones/asignaturas y duplicados controlados); F-PEOPLE (perfiles y vínculos familiares); F-MAT (solicitudes aprobadas/observadas, historial, cupo controlado y concepto de pago); F-COURSE (curso activo, docente asignado y estudiantes matriculados); F-CONTENT (unidades publicadas/borrador y material privado); F-LEARN (tareas, entrega y evaluación habilitada); F-ATT (sesión/ausencia); F-OFFICE (tipo de solicitud); F-NOTICE (destinatarios/notificaciones); F-REPORT (datos mínimos de consulta). Dos instituciones sintéticas permitirían negativas adicionales de aislamiento, que estos 46 casos no prueban explícitamente.

No copiar datos ni credenciales demo. Los tests contienen credenciales, etiquetas y Origin ligados al entorno anterior: requieren parametrización aprobada hacia estos fixtures, manteniendo las aserciones funcionales y 200/403/404/419. Cambiar solo baseUrl no basta. Credenciales nuevas fuera de Git y documentos; task privada con log:false, sin usar Cypress.env() eliminado ni volcarlas en config.env/resultados. No crear usuarios hoy.

Restauración propuesta por caso, nunca entre cambios de rol de un mismo flujo: cerrar acceso HTTP, verificar transacciones, detener solo procesos propios, conservar logs/JUnit y datos fallidos en cuarentena, restaurar una copia **fría** sellada de la instancia nueva junto con storage sintético, y revalidar identidad/esquema/fixtures al arrancar. No copiar InnoDB en caliente ni asumir rollback SQL de un test de navegador que hace múltiples requests. Sesiones, cookies y tokens se reinician con su entorno privado; no se autoriza DELETE global de tokens. Las tareas de fixtures solo aceptarán IDs de caso de una lista cerrada, nunca SQL o rutas libres.

Toda restauración de archivos requiere autorización específica sobre el árbol nuevo, validación de rutas absolutas y retención previa de evidencias. Ante suspensión, caída o guarda vencida: parar, preservar el estado y diagnosticar; no reintentar automáticamente ni asumir limpieza. No tocar directorios ni procesos de demo/Pest.

## Clasificación de los 46 pendientes

Todos siguen NO EJECUTADOS. Distribución: autenticación 9; matrículas 6; Aula Virtual/aprendizaje 12; asistencia 3; comunicación 3; transversales 13. **44 necesitan SQL; 43 incluyen escrituras de autenticación** (last_login_at/auditoría), aunque la operación de negocio sea lectura. Auth #1 (redirección anónima) y #9 (CSRF ausente) podrían resolverse antes de SQL, pero requieren habilitar rutas HTTP; no se ejecutaron aquí. Auth #2 necesita consultas para credenciales incorrectas.

L=lectura; I=INSERT; U=UPDATE; A=escrituras de autenticación/auditoría al login/logout; D=DELETE. No hay llamadas HTTP DELETE directas. **office.cy.ts #2 y #3** crean comunicaciones cuyos targets ejecutan DELETE en CommunicationService.php, incluso si inicialmente afectan cero filas. Limitar el permiso propuesto a communication_targets; no generalizarlo. Logout no elimina tokens en estos casos.

| ID | Caso original | Actor | Fixtures | Operaciones HTTP/estados | SQL esperado | Archivos | Prioridad |
|---|---|---|---|---|---|---|---|
| CY39-001 | academic.cy.ts #1 — consulta año y periodos y navega niveles, grados y secciones en móvil | Administración | F-ACA | GET catálogos/año/periodos/grados/secciones | L + A | — | P0 |
| CY39-002 | academic.cy.ts #2 — valida crea edita y desactiva una asignatura de prueba conservando su historial | Administración | F-ACA con código duplicado | POST/PATCH asignatura; POST desactivar | L/I/U + A | — | P1 |
| CY39-003 | academic.cy.ts #3 — valida fechas y cierra únicamente un año de prueba sin cambiar el actual | Administración | F-ACA; año nuevo distinto del vigente | POST año, error de fechas y cierre | L/I/U + A | — | P1 |
| CY39-004 | academic.cy.ts #4 — permite consulta académica docente sin controles de gestión | Docente | F-ACA | GET; POST asignatura debe ser 403 | L + A | — | P0 |
| CY39-005 | attendance.cy.ts #1 — docente registra asistencia y cierra la sesión sin edición posterior | Docente | F-COURSE + F-MAT | Crear sesión, registrar marcas, cerrar | L/I/U + A | — | P0 |
| CY39-006 | attendance.cy.ts #2 — apoderado vinculado envía justificación con archivo privado y consulta historial | Docente → apoderado | F-ATT; absentFixture crea una ausencia | Crear ausencia y justificación; consultar historial | L/I/U + A | Carga privada TXT | P0 |
| CY39-007 | attendance.cy.ts #3 — Secretaría revisa y aprueba y el estudiante y apoderado consultan Justificada | Docente → apoderado → Secretaría → estudiante | F-ATT; ausencia nueva propia del caso | Justificar, revisar, aprobar y consultar cambios | L/I/U + A | — | P0 |
| CY39-008 | auth.cy.ts #1 — redirige al login cuando no hay sesión | Anónimo | F-HTTP; cookies vacías | GET ruta protegida → login | No SQL esperado | — | P0 |
| CY39-009 | auth.cy.ts #2 — rechaza credenciales incorrectas | Anónimo | F-CORE; cuenta sintética conocida | POST login rechazado; consultar institución/usuario | L; sesión/caché local | — | P1 |
| CY39-010 | auth.cy.ts #3 — muestra identidad, sesión persistente y dashboard de administrator | Administración | F-CORE + datos de dashboard según rol | Login, persistencia, GET autorizados/403, logout, 401 | L/I/U de auth/auditoría | — | P0 |
| CY39-011 | auth.cy.ts #4 — muestra identidad, sesión persistente y dashboard de secretary | Secretaría | F-CORE + datos de dashboard según rol | Login, persistencia, GET autorizados/403, logout, 401 | L/I/U de auth/auditoría | — | P0 |
| CY39-012 | auth.cy.ts #5 — muestra identidad, sesión persistente y dashboard de treasury | Tesorería | F-CORE + datos de dashboard según rol | Login, persistencia, GET autorizados/403, logout, 401 | L/I/U de auth/auditoría | — | P0 |
| CY39-013 | auth.cy.ts #6 — muestra identidad, sesión persistente y dashboard de teacher | Docente | F-CORE + datos de dashboard según rol | Login, persistencia, GET autorizados/403, logout, 401 | L/I/U de auth/auditoría | — | P0 |
| CY39-014 | auth.cy.ts #7 — muestra identidad, sesión persistente y dashboard de student | Estudiante | F-CORE + datos de dashboard según rol | Login, persistencia, GET autorizados/403, logout, 401 | L/I/U de auth/auditoría | — | P0 |
| CY39-015 | auth.cy.ts #8 — muestra identidad, sesión persistente y dashboard de guardian | Apoderado | F-CORE + datos de dashboard según rol | Login, persistencia, GET autorizados/403, logout, 401 | L/I/U de auth/auditoría | — | P0 |
| CY39-016 | auth.cy.ts #9 — rechaza login sin token CSRF | Anónimo | F-HTTP; Origin correcto y sin CSRF | POST login debe detenerse con 419 | No SQL esperado antes de CSRF | — | P1 |
| CY39-017 | classroom.cy.ts #1 — el docente crea y publica unidad y archivo, luego archiva conservando el historial | Docente | F-CONTENT + F-COURSE | Crear/publicar unidad y archivo; archivar unidad | L/I/U + A | Carga privada TXT | P0 |
| CY39-018 | classroom.cy.ts #2 — el estudiante aprobado consulta publicados y descarga el archivo privado sin gestión | Estudiante aprobado | F-CONTENT con publicados, borradores y archivo | GET publicados; descarga y controles ausentes | L + A | Descarga privada existente | P0 |
| CY39-019 | classroom.cy.ts #3 — oculta borradores por URL y niega contenido a estudiante sin matrícula aprobada | Docente → estudiante → estudiante observado | F-CONTENT + matrículas diferenciadas | GET/descarga 404; POST publicación 403 | L + A | Archivo fixture para denegación 404 | P0 |
| CY39-020 | courses.cy.ts #1 — crea asignación y curso y controla activación cierre y responsive | Administración | F-CORE; docente; estructura creada dentro del caso | POST catálogos, asignación, curso, activar/cerrar | L/I/U + A | — | P0 |
| CY39-021 | courses.cy.ts #2 — muestra al docente sus cursos y roster aprobado sin controles administrativos | Docente | F-COURSE con roster aprobado y observado | GET cursos/roster; gestión oculta | L + A | — | P0 |
| CY39-022 | courses.cy.ts #3 — permite al matriculado consultar su curso y excluye al estudiante observado | Estudiante → estudiante observado | F-COURSE + F-MAT | GET curso; exclusión por matrícula observada | L + A | — | P0 |
| CY39-023 | enrollment-center.cy.ts #1 — admin consulta indicadores reales por año y abre formulario historial y cupos sin escribir datos | Administración | F-MAT con año, historia, cupos y opciones | GET indicadores/historia/opciones; abrir sin guardar | L + A | — | P0 |
| CY39-024 | enrollment-center.cy.ts #2 — estudiante y apoderado consultan su alcance y no acceden a creación ni cupos | Estudiante → apoderado | F-MAT; vínculos familiares y al menos dos filas | GET alcance propio; creación/cupos denegados | L + A | — | P0 |
| CY39-025 | enrollment-center.cy.ts #3 — docente no accede al centro y mantiene acceso al Aula Virtual | Docente | F-CORE + F-COURSE | Centro denegado; navegación a Aula Virtual | L + A | — | P0 |
| CY39-026 | enrollment.cy.ts #1 — completa Secretaría y Tesorería con corrección pago aprobación historial y cupos | Administración → Secretaría → Tesorería | F-MAT; concepto de pago; capacidad 1 | Crear persona/catálogos/matrícula, observar/corregir, pago, validar y aprobar | L/I/U + A | — | P0 |
| CY39-027 | enrollment.cy.ts #2 — permite consulta propia de estudiante y familiar sin acciones administrativas | Estudiante → apoderado | F-MAT aprobado y relaciones familiares | GET matrícula/historia sin controles de gestión | L + A | — | P0 |
| CY39-028 | enrollment.cy.ts #3 — impide gestión y acceso a pagos al docente | Docente | F-MAT + permisos existentes | GET matrículas/pagos fuera de alcance | L + A | — | P0 |
| CY39-029 | learning.cy.ts #1 — docente crea publica tarea y consulta y revisa una entrega | Docente → estudiante → docente | F-LEARN + curso/matrícula | Crear/publicar tarea, entregar texto y revisar | L/I/U + A | — | P0 |
| CY39-030 | learning.cy.ts #2 — estudiante entra al curso entrega archivo y consulta Mis entregas | Docente → estudiante | F-LEARN + curso/matrícula | Crear/publicar tarea y enviar entrega | L/I/U + A | Carga privada TXT | P0 |
| CY39-031 | learning.cy.ts #3 — docente publica evaluación registra nota y el estudiante consulta su calificación | Docente → estudiante | F-LEARN; periodo habilitado y tipo de evaluación | Crear/publicar evaluación, registrar nota y consultar propia | L/I/U + A | — | P0 |
| CY39-032 | office.cy.ts #1 — estudiante crea corrige solicitud y Secretaría observa aprueba emite documento y completa | Estudiante → Secretaría | F-OFFICE; tipo de solicitud | Crear/corregir/revisar/aprobar, emitir documento y completar | L/I/U + A | Carga y descarga privada TXT | P1 |
| CY39-033 | office.cy.ts #2 — Secretaría publica por rol y usuario y el docente recibe un único comunicado | Secretaría → docente | F-NOTICE; destinatarios rol + usuario | Crear/publicar comunicado; deduplicar destinatario | L/I/U/D + A | — | P0 |
| CY39-034 | office.cy.ts #3 — usuario recibe notificación en campana y marca individual y todas como leídas | Secretaría → estudiante | F-NOTICE; usuario destinatario | Crear/publicar dos comunicados; marcar notificaciones | L/I/U/D + A | — | P0 |
| CY39-035 | people.cy.ts #1 — crea consulta edita estudiantes y valida documentos y filtros | Administración | F-PEOPLE; documento duplicado conocido | Crear/editar estudiante; rechazo 422 duplicado | L/I/U + A | — | P1 |
| CY39-036 | people.cy.ts #2 — crea y consulta un docente sin asignaciones académicas | Administración | F-CORE | Crear docente sin asignación | L/I/U + A | — | P1 |
| CY39-037 | people.cy.ts #3 — crea un apoderado y un estudiante aislados y gestiona su relación principal | Administración | F-CORE | Crear apoderado/estudiante; asociar y cambiar principal | L/I/U + A | — | P0 |
| CY39-038 | people.cy.ts #4 — muestra al estudiante su perfil propio sin administración de personas | Estudiante | F-PEOPLE | GET perfil propio; administración denegada | L + A | — | P0 |
| CY39-039 | people.cy.ts #5 — muestra al apoderado únicamente su perfil y sus relaciones demo | Apoderado | F-PEOPLE; dos estudiantes vinculados | GET perfil y familia sin asociación administrativa | L + A | — | P0 |
| CY39-040 | reports.cy.ts #1 — consulta dashboard administrativo y filtra y exporta un reporte CSV responsive | Administración | F-REPORT con estudiante activo y datos relacionados | GET dashboard, catálogo, filtros y CSV | L + A; auditar efectos del export | CSV en sandbox de descargas | P1 |
| CY39-041 | reports.cy.ts #2 — muestra indicadores por rol y mantiene reportes institucionales fuera del acceso familiar | Cinco roles no administradores | F-REPORT + F-CORE | GET dashboards por rol; reportes familiares 403 | L + A | — | P0 |
| CY39-042 | virtual.cy.ts #1 — mantiene la sesión del estudiante y navega recursos reales en PC tablet y móvil | Estudiante | F-COURSE + F-MAT + tareas | GET sesión/cursos/tareas; PC/tablet/móvil | L + A | Capturas de evidencia | P0 |
| CY39-043 | virtual.cy.ts #2 — ofrece al docente sus cursos y herramientas y conserva el acceso institucional | Docente | F-COURSE + roster | GET cursos, tareas, roster y navegación | L + A | Captura de evidencia | P0 |
| CY39-044 | virtual.cy.ts #3 — admite administración y rechaza roles ajenos y estudiantes sin matrícula aprobada | Administración → estudiante observado → Tesorería | F-COURSE + F-MAT | GET curso 404 y restricciones por rol | L + A | — | P0 |
| CY39-045 | visual.cy.ts #1 — mantiene login claro y tema persistente en dashboard perfil y móvil | Administración | F-REPORT + F-CORE | GET login/dashboard/perfil; tema local y logout | L + A | Capturas de evidencia | P1 |
| CY39-046 | visual.cy.ts #2 — muestra ficha académica y vista previa de foto sin alterar la foto existente | Estudiante | F-PEOPLE + F-MAT | GET ficha; seleccionar y cancelar preview, sin Guardar foto | L + A | Blob PNG local; sin POST de avatar | P2 |


Ninguno de los 46 exige un servicio externo según su código ni contiene una negativa explícita entre instituciones; no se atribuye cobertura inexistente. Los enlaces externos del Aula solo se inspeccionan y los pagos son manuales. Los archivos reales de classroom, learning, attendance y office requieren storage privado. reports #1 lee literalmente cypress/downloads/active-students.csv: preparar raíz Cypress privada compatible. visual #2 solo previsualiza un Blob y cancela, sin guardar avatar. No se observó dependencia necesaria entre casos: los flujos que crean padres deben permanecer completos dentro del mismo caso.

## Secuencia de ejecución futura

| Fase | Casos y precondición | Datos/escrituras y restauración | Seguridad, resultado y evidencia exigida |
|---|---|---|---|
| 1. Salud | Variante aprobada; HTTP privado sin SQL | Sin fixtures; cierre de procesos propios | 200/JSON real, trazas de cancelación y respuesta; JUnit |
| 2. Autenticación | auth: login/logout y CSRF; F-CORE | Consultas, login/auditoría; baseline por caso | Cookie/Origin y 419; no credenciales en logs |
| 3. Rutas protegidas | Casos auth de redirección/acceso; mismo lote de 9, sin duplicarlos | F-CORE; sesión privada | Destino autorizado y negación anónima, JUnit |
| 4. RBAC | Resto de los 9 auth y negativas de módulos | F-CORE; auditoría real; restauración por caso | 403/404 y ausencia de controles; no ampliar permisos |
| 5. Matrículas | enrollment y enrollment-center: 6 | F-ACA/PEOPLE/MAT; I/U; pagos manuales | Cupos/historial/roles; SQL antes/después y archivos |
| 6. Aula | courses/classroom/learning/virtual: 12 | F-COURSE/CONTENT/LEARN; I/U/uploads | Roles, publicación y entregas; descarga privada, JUnit |
| 7. Evaluación | learning #3 ya contado entre los 12 | Evaluación/notas sintéticas y auditoría; reset al terminar | Aserciones originales; no contar mocks de historial como SQL |
| 8. Asistencia | attendance: 3 | F-ATT; I/U y justificante privado | Cierre/justificación y consultas familiares; permisos reales |
| 9. Comunicación | office: 3 | F-OFFICE/NOTICE; I/U y D acotado en dos casos | Notificación local y destinatarios; consentimiento DELETE previo |
| 10. Transversal | academic/people/reports/visual: 13 | Fixtures correspondientes; I/U; CSV/PNG privados | Catálogos, vínculos, reportes, móvil; evidencias preservadas |

Las fases 2–4 distribuyen los mismos nueve casos de auth; la fase 7 reutiliza un caso de la fase 6. La suma sigue siendo 46. Primero un smoke por etapa, después el resto secuencial; detenerse al primer fallo y conservar evidencia. Los 141 mocks siguen siendo cobertura UI separada. Las 21 pruebas simuladas de assessment-context/score-history no se convierten automáticamente en pruebas SQL.

## Autorizaciones concretas para el siguiente paso

La restricción expresa del usuario impide modificar el test original o aprovisionar todavía. El resultado revisable es el parche privado y este plan. Se necesitan decisiones separadas:

1. Aprobar el parche de integration.cy.ts y helper observeHealth.ts, conservando 200/JSON y el rechazo de cancelaciones inesperadas. No cambiar código funcional.
2. Autorizar una instancia nueva 3309, datadir privado indicado, base zarate_cypress_e2e, dos cuentas nuevas, TLS y aplicación de los 14 ups originales exclusivamente allí. Sin modificar cuentas existentes ni las bases protegidas.
3. Autorizar fixtures sintéticos, parametrización revisable de credenciales/Origin y operaciones SELECT/INSERT/UPDATE enumeradas en los 46 casos; para office #2/#3, autorizar separadamente DELETE limitado a communication_targets de esta base. No se solicita DROP/TRUNCATE ni desbloquear los 38 Pest.
4. Autorizar baseline frío y restauración exclusivamente de los archivos nuevos bajo .tools/cypress-e2e, preservando evidencias de fallos, con guardas de ruta e identidad.
5. Aprobar ejecución secuencial por fases tras preflight, sin servicios externos ni cambios en 3307/3308/8000/5173.

Estas autorizaciones no están concedidas por el presente documento. Si alguna se rechaza, conservar bloqueados los casos afectados; no sustituirlos por mocks para declarar SQL aprobado.

## Integridad y cierre operativo

La auditoría local closure-audit.json verifica 602 fuentes y 74 documentos anteriores sin diferencias; git diff --check y la comprobación seca del parche aprobaron. Las modificaciones previas de Git, incluida evidencias-finalizacion-migraciones.md y documentos no rastreados de prompts anteriores, se conservaron; no se atribuyen a este cierre. No hubo commit, push, merge ni PR. Solo se crearon/actualizaron los dos documentos del Prompt 39 y el instrumental privado ignorado.

Los supervisores registraron cierre de sus PHP/Vite; la comprobación final de procesos y energía se conserva en prompt39/closure-environment.json. La guarda HTTP bloqueó SQL antes de PDO; no se abrió MySQL. Por tanto no hubo escrituras SQL propias ni fixtures/residuos SQL creados por esta intervención; no se afirma haber contado filas de bases que no se abrieron. Los registros operativos de las ejecuciones no muestran eventos de suspensión en sus ventanas comprobadas.

Pendiente para cerrar Cypress/proyecto: aprobar y aplicar el parche, preparar y verificar la nueva infraestructura, ejecutar los 46 con backend/SQL reales, resolver cualquier fallo y revisar las limitaciones institucionales y los 38 Pest que permanecen bloqueados. Este informe no declara validación integral completada.

### Incidencia posterior a las pruebas: suspensión de Windows

La comprobación de cierre detectó nueve eventos correspondientes a tres ciclos de suspensión/reanudación, posteriores al cierre del supervisor final (17:39:48 UTC): entradas en suspensión a las 17:41:49, 17:44:22 y 17:46:56 UTC del 10/11/2026. Se conservan en closure-power-events.json. No hubo procesos privados ni listeners activos en el cierre; no se reanudaron pruebas ni operaciones SQL. Los resultados anteriores permanecen acreditados, pero cualquier ejecución futura requiere preflight completo y una guarda nueva; no reutilizar una autorización temporal vencida. No se puede afirmar ausencia de suspensión durante todo el cierre documental.
