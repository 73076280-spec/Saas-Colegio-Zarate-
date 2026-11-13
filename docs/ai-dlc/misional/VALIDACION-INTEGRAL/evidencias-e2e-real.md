# Prompt 41 — Implementación E2E: interrupción segura y checkpoint

Fecha: 10/11/2026, America/Lima. Rama: `test/integracion-misional`. HEAD: `1a043035c126a5bc3e5ed14cf43fdd49a4e171bf`.

## Estado final

**D. BLOQUEADO POR SEGURIDAD O INFRAESTRUCTURA — suspensión de Windows durante la preparación.** Se inicializó y arrancó exclusivamente una instancia nueva MySQL 8.4.11 en 127.0.0.1:3309. La primera guarda rechazó el modelo de procesos monitor/worker; la recuperación posterior fue bloqueada por una suspensión real de Windows. Se cumplió el criterio de detención del usuario: no se continuó con SQL de aplicación, migraciones, fixtures ni Cypress. La instancia fue cerrada normalmente, sin terminación forzada, y se preservó su datadir para recuperación.

No se acredita integración React–Laravel–MySQL ni resultados E2E nuevos. La autorización de dos casos DELETE permanece denegada. El bloqueo no es una falta de autorización general para el entorno: es una condición operativa detectada por las guardas.

## Recuperación del trabajo anterior

Se revisaron Git, la documentación y checkpoints de los Prompts 37–40, la matriz de los 46 casos y el test HTTP corregido. El estado previo se conservó: **276/314 Pest aprobados, 1.724 aserciones, 38 bloqueados; 141 Cypress aprobados con mocks; un caso HTTP corregido acreditado 3/3 en Prompt 40**. Las tres pruebas HTTP auxiliares y variante privada de Prompt 39 permanecen históricas, sin contarlas otra vez.

El preflight de 14:38:46 de Lima no detectó procesos abandonados, listeners ocupados ni suspensiones en los cinco minutos previos. No se detuvieron servicios demo para liberar puertos. Los cambios pendientes existentes, incluidos integration.cy.ts, observeHealth.ts y documentación anterior, no se descartaron ni modificaron. No se usó git clean/reset ni se hicieron commits, push, merge o PR.

## Arquitectura efectivamente preparada

| Recurso | Estado real |
|---|---|
| Binario portátil | MySQL 8.4.11 existente, solo lectura; SHA-256 B83561F885785133B79CFE53F225DFFBDBDEC160EA54B5245CFB30CC7A440FA7 |
| Instancia nueva | Inicializada y arrancada en 127.0.0.1:3309; cerrada normalmente al terminar |
| Configuración | .tools/cypress-e2e/mysql-e2e.ini independiente; bind local, mysqlx=0, logs privados, require_secure_transport=ON, TLS 1.2/1.3, local-infile OFF, secure-file-priv NULL, general/slow/raw/binlog desactivados |
| Datadir | D:/zarate-saas/.tools/cypress-e2e/mysql-data; creado nuevo, sin copiar InnoDB ni datos de otras instancias |
| UUID nuevo | 386e58e7-dd3f-11f1-9f92-50ebf64eff02, leído de auto.cnf del datadir nuevo |
| ACL privada | Acceso al árbol nuevo restringido al usuario de ejecución, SYSTEM y administradores; no se cambiaron ACL existentes |
| TLS | CA/certificado RSA 3072/SHA256 nuevos, SAN IP:127.0.0.1; clave/cadena/propósito comprobados offline. No se completó verificación de sesión SQL TLS |
| Base zarate_cypress_e2e | **NO CREADA**; Provision41.php no llegó a ejecutarse |
| Cuentas de aplicación/preparación | **NO CREADAS**; solo existe la inicialización interna del servidor nuevo. La contraseña bootstrap temporal sigue privada y expirada; no se completó su rotación |
| Credenciales candidatas | Generadas solo en archivos privados del árbol E2E; no equivalen a cuentas configuradas. No se publican valores |
| HTTP React/Laravel | Directorios y adaptador privados preparados; **no se iniciaron** servicios HTTP en este prompt |
| Esquema/fixtures/baseline | **NO CREADOS**; 0 migraciones de aplicación ejecutadas |

La inicialización interna de MySQL escribe sus propias tablas de sistema en el datadir nuevo; no debe confundirse con ejecutar las 14 migraciones de EcoAula ni con crear la base candidata. No se estableció una sesión SQL cliente ni se accedió a bases protegidas. Hubo un sondeo TCP local de disponibilidad del servidor, sin autenticación ni consultas SQL.

## Incidencias y detención

1. **Modelo de proceso incompleto en la guarda inicial.** El supervisor Node PID 8796 lanzó mysqld PID 4996. MySQL Windows creó el worker PID 7720; este último era dueño del listener 3309 y figuraba en mysql.pid. La guarda exigía que el listener perteneciera directamente al PID lanzado, y rechazó el arranque. No se emitió un gate válido ni se ejecutó la rotación bootstrap, Provision41.php o una migración. El supervisor conservó el árbol para diagnóstico y registró que no pudo completar su cierre SQL ordinario.
2. **Corrección privada de identificación, sin relajar identidad.** Check41.ps1 se ajustó para exigir mismo ejecutable/hash/comando, cadena supervisor→monitor→worker, creación temporal coherente, PID-file igual al worker y listener exclusivo en 127.0.0.1. La comprobación de recuperación superó esas comprobaciones de árbol pero **no obtuvo aprobación global**, porque falló el control de energía. No se declara la guarda corregida validada para nuevas escrituras: faltan pruebas positivas/negativas completas en un nuevo preflight.
3. **Suspensión real.** Kernel-Power 42: **14:46:55.3189802 -05:00**; reanudación 107: 14:46:56.2193337; Power-Troubleshooter 1: 14:47:01.5645234. RecoverShutdown41.cjs se detuvo antes de ejecutar el cliente SQL; conservó stderr con P41_POWER_OR_EVENT_READ_FAILURE. No se reutilizó una autorización temporal vencida ni se amplió el límite de 120 segundos.
4. **Cierre seguro sin SQL.** Se buscó primero el evento del worker, que no existía; esa tentativa no señaló nada ni forzó procesos. La inspección de eventos identificó mysqld4996_shutdown del monitor propio. ShutdownOwned41.ps1 volvió a comprobar binario/hash, árbol, comando, listener, PID-file y UUID del datadir, y señaló únicamente ese evento de cierre. A las **14:50:29 -05:00** se confirmó salida de ambos procesos, desaparición de mysql.pid, 0 listeners 3309 y log “Shutdown complete”. No se terminó ningún proceso por fuerza ni se señaló un evento genérico de otro MySQL.

Se creó run/HALTED.json y gate41() rechaza SQL mientras exista ese marcador. No se continuará automáticamente desde la guarda fallida. No ejecutar de nuevo Prepare41.cjs, Supervisor41.cjs ni --initialize sobre el datadir existente.

## Verificaciones y resultados

| Comprobación | Resultado real |
|---|---|
| Rama/Git, procesos/puertos y energía previa | Aprobado en la ventana inicial indicada |
| Certificado, clave, firma/cadena, propósito y SAN | Aprobado offline; certificados nuevos sin cambiar confianza global |
| Sintaxis Guard41/Laravel41/Migrate41/Provision41 y Node supervisor | Aprobada antes del arranque |
| Inicialización de datadir nuevo | Aprobada; archivos internos creados exclusivamente allí |
| Identidad integral primera guarda | **FALLIDA**, diferencia monitor/worker |
| Guarda de recuperación tras adaptar árbol | **RECHAZADA** por suspensión; no aprobación integral |
| Cierre controlado específico | Aprobado; sin SQL ni terminación forzada |
| TLS de conexión/identidad SQL/permisos efectivos | **NO EJECUTADOS** |
| Negativas reales de base/puerto/cuenta/TLS | **NO EJECUTADAS**; los controles offline de Prompt 40 siguen siendo históricos |
| Migraciones y esquema 52 tablas/14 registros | **NO EJECUTADOS/NO VERIFICADOS** en E2E |
| Fixtures y restauración | **NO EJECUTADOS**; no hay baseline ni limpieza de datos que certificar |
| Piloto Cypress | **NO EJECUTADO** por criterio de detención |
| Cypress 46 candidatos / Pest excluidos | **NO EJECUTADOS**, sin repetir éxitos anteriores |
| Preservación de fuentes/documentos/evidencias | 603 fuentes y 78 documentos sin cambios; 13 resultados Cypress y 276 JUnit Pest SHA-256 intactos |
| git diff --check | Sin errores en el cierre |

No se presentan fallos de infraestructura como casos Cypress fallidos: **0 ejecutados, 0 aprobados, 0 fallidos, 46 no ejecutados/bloqueados**. Son controles de seguridad rechazados, no fallos funcionales demostrados de EcoAula. No se ejecutó build/ESLint/Pest/Cypress porque no hubo cambios funcionales ni entorno aprobado para el piloto.

## Resultados por módulo

| Módulo | Candidatos E2E | Ejecutados | Aprobados | Fallidos | Bloqueados/no ejecutados |
|---|---:|---:|---:|---:|---:|
| Autenticación | 9 | 0 | 0 | 0 | 9 |
| Matrículas | 6 | 0 | 0 | 0 | 6 |
| Aula Virtual | 11 | 0 | 0 | 0 | 11 |
| Evaluaciones | 1 | 0 | 0 | 0 | 1 |
| Asistencia | 3 | 0 | 0 | 0 | 3 |
| Comunicaciones | 3 | 0 | 0 | 0 | 3 |
| Regresión transversal | 13 | 0 | 0 | 0 | 13 |
| **Total** | **46** | **0** | **0** | **0** | **46** |

Para evitar duplicación, learning.cy.ts #3 se cuenta aquí en Evaluaciones: Aula Virtual queda en 11 y Evaluaciones en 1. En la clasificación original ambos sumaban 12 bajo Aula/aprendizaje. De los 46, **44 están autorizados en principio** pero detenidos por el entorno; **office.cy.ts #2 y #3** permanecen excluidos por la prohibición expresa de DELETE sobre communication_targets. La preparación no concede ese permiso ni permite ejecutar esos casos con la cuenta migradora.

### Matriz recuperada, no ejecutada

L=lectura; I=INSERT; U=UPDATE; A=escrituras de autenticación/auditoría. Los fixtures F-* son requisitos del plan, no datos creados en este prompt. Todos los renglones siguen pendientes; los dos office indicados tienen además bloqueo de autorización.

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


Hay 44 candidatos con necesidad de SQL y 43 con escrituras de autenticación/auditoría, incluso si el negocio es de consulta. Los casos auth anónimo/CSRF tampoco se ejecutaron, porque no hubo HTTP privado aprobado. Cargas, descargas y reportes precisan storage/Cypress privado; el CSV usa una ruta relativa que deberá conservarse. No se identificaron servicios externos imprescindibles ni negativas explícitas entre dos instituciones en estos 46: no atribuir esa cobertura. Las adaptaciones de credenciales/Origin/datos deben permanecer en copias privadas revisables, sin sustituir respuestas por mocks ni alterar aserciones.

## Contrato para la recuperación y fases pendientes

Se conserva el plan acotado de Prompt 40: instancia nueva 3309, base zarate_cypress_e2e, cuentas zarate_cypress_app y zarate_cypress_migrator con TLS y sin DELETE. Runtime SELECT/INSERT/UPDATE solo en el esquema nuevo; migrador con CREATE/ALTER/INDEX/REFERENCES y DML necesario a los 14 ups originales y fixtures autorizados. Sin privilegios globales de aplicación ni GRANT OPTION, sin tocar cuentas existentes. Los dos DELETE no se habilitan.

Backend futuro 127.0.0.2:8001 y frontend 127.0.0.2:5174, sujeto a preflight de disponibilidad; APP_ENV testing, entorno/storage/bootstrap/cache privados, Sanctum/CORS al Origin exacto, SESSION_DOMAIN nulo, cookie exclusiva, sesión/cache file, correo array y colas sin efectos externos. La dirección distinta a demo aísla cookies host-only que los puertos no separan. El adaptador privado Laravel se preparó pero no se ejecutó; no se da por compatible hasta su validación.

La vigencia máxima sigue en 120 segundos. Una reanudación debe revisar proceso/padre/worker/creación/exe/hash/configuración/listener, comprobar ausencia de suspensión y emitir una autorización nueva solo después de demostrar identidad. No renovar dentro de una operación crítica ni prolongar el límite. Antes de cada operación sensible, verificar TLS, UUID, datadir, cuenta y base efectivos. Las negativas deben impedir conexiones a zarate_dev, zarate_test y zarate_pest antes de escribir.

**Punto exacto de reanudación:** datadir nuevo ya inicializado, UUID conservado y servidor parado limpiamente; **antes de completar la contraseña bootstrap y crear base/cuentas**. No repetir la inicialización ni borrar archivos. La contraseña bootstrap solo está en archivos privados y no se debe imprimir. El supervisor inicial no debe reutilizarse tal cual: se requiere un supervisor de recuperación que ateste el estado existente, preserve resultados y registre un arranque nuevo.

Después de recuperar de forma segura: completar bootstrap exclusivamente en el servidor nuevo; comprobar TLS/identidad y privilegios; crear base/cuentas; aplicar uno a uno los 14 ups fijados por hash; verificar esquema y relaciones; crear fixtures propios (sin demo); demostrar restauración fría dentro del árbol nuevo; arrancar HTTP privado; ejecutar piloto pequeño y solo después los 44 compatibles, secuencialmente con checkpoints. Si falla el piloto por integridad/seguridad no ampliar. Mantener evidencia de cada respuesta real y del acceso SQL, más estado antes/después y restauración. No asumir rollback Pest para HTTP.

Los 38 Pest no se ejecutaron y siguen excluidos. Una infraestructura Cypress podría ayudar a casos SQL compatibles, pero sus contratos/operaciones prohibidas requieren revisión independiente: no quedan automáticamente habilitados ni se trasladan a esta base sin autorización específica de su ejecución.

## Protección de bases, limpieza y limitaciones

No se conectó a zarate_dev, zarate_test o zarate_pest, ni se alteraron sus cuentas, esquemas, archivos o servicios. La preservación se apoya en configuración y datadir nuevos, ausencia de sesiones SQL propias, fuentes/configuraciones protegidas verificadas y cierre de procesos propios. No se realizó un conteo ni comparación de filas de bases protegidas: no se afirma una auditoría forense de su actividad ajena.

No hubo fixtures ni sesiones/tokens de aplicación que limpiar. No se ejecutó restauración ni se borró la nueva instancia: se conservaron su datadir, certificados, credenciales, logs y checkpoints. No hay baseline aprobado. La restauración futura debe parar únicamente los servicios propios, preservar estado fallido, copiar en frío solo el datadir E2E y storage emparejado con rutas absolutas verificadas, y revalidar identidad/esquema al arrancar. Nunca copiar archivos de otras instancias ni usar DROP/TRUNCATE en destinos ambiguos.

## Evidencia y archivos

Documentos públicos creados:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-41-e2e-real.md — adjunto íntegro, sin resumir.
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-e2e-real.md — este informe, incluidos bloqueos y recuperación.

Instrumental y evidencia privados bajo .tools/cypress-e2e, ignorados por Git:

- Prepare41.cjs, Certificates41.php, mysql-e2e.ini, tls/, private/: preparación exclusivamente nueva; valores secretos no publicados.
- Guard41.php, Laravel41.php, Migrate41.php, Provision41.php: adaptadores preparados, **sin ejecutar las fases de aplicación**.
- Supervisor41.cjs y Check41.ps1: primer intento y corrección de identidad monitor/worker; el supervisor no debe relanzarse sobre este datadir.
- RecoverShutdown41.cjs: tentativa que se detuvo ante energía antes de SQL; conservar su fallo.
- ShutdownOwned41.ps1 y evidence/prompt41/controlled-shutdown.json: cierre normal confirmado.
- evidence/prompt41/preflight.json, certificates.json, checkpoint.json, supervisor-result.json, recovery-identity.* y power-incidents.json: resultados originales intactos.
- evidence/prompt41/shutdown-event-probes.json, recovery-checkpoint.json y run/HALTED.json: recuperación/pausa de seguridad; no reutilizar gates vencidos.
- evidence/prompt41/closure-audit.json y comprobación final de entorno: integridad y estado final.

No se encontró un defecto funcional de EcoAula porque no se alcanzó la ejecución de aplicación. Los problemas acreditados son el supuesto inicial de la guarda sobre procesos Windows y la suspensión durante recuperación. Para consolidar la entrega académica faltan recuperación segura, infraestructura TLS/SQL validada, esquema/fixtures/restauración y ejecución real de candidatos; los dos DELETE y los 38 Pest seguirán separados.


---

## Anexo de reanudación — 10/11/2026, preflight 15:12:48 de Lima

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.** Se recuperó el checkpoint existente sin reinicializar ni arrancar MySQL. La instrucción de reanudación exige: “Si se detecta una nueva suspensión, detener la ejecución y conservar checkpoint.” La consulta de eventos encontró dos ciclos posteriores al cierre documentado anterior; por ese motivo se detuvo la reanudación antes del arranque.

### Eventos posteriores al cierre previo

| Entrada en suspensión (Lima) | Reanudación Kernel-Power | Registro Power-Troubleshooter |
|---|---|---|
| 10/11/2026 14:54:36.8666256 | 14:54:37.5187573 | 14:54:42.5377178 |
| 10/11/2026 14:57:10.0597786 | 14:57:10.9929219 | 14:57:17.5136676 |

Son seis registros correspondientes a **dos ciclos**, no seis suspensiones. Ocurrieron después del cierre limpio del MySQL E2E a las 14:50:29 y antes de esta nueva recuperación; **no se afirma que hubiera SQL ni una operación E2E activa durante ellos**. La última consulta, a las 15:12:48, no mostró otro ciclo posterior. Se conserva el XML convertido a campos en resume-01/preflight.json. Kernel-Power registra Reason=7, TargetState=4 y EffectiveState=4; no se interpreta el código como una causa demostrada. Un registro identifica MediaTek Wi-Fi 6 MT7921 Wireless LAN Card como origen de reactivación; eso no demuestra que la tarjeta causara la suspensión. No se modificó energía, servicios, controladores ni configuración de Windows.

### Estado recuperado sin SQL

- Rama: test/integracion-misional; HEAD: 1a043035c126a5bc3e5ed14cf43fdd49a4e171bf. Cambios pendientes conservados, sin reset/clean/commit/push.
- No hay procesos MySQL/Pest/Cypress privados abandonados ni listeners en los puertos comprobados. 3309 no tenía listener; no se arrancó un servidor para comprobarlo.
- Datadir existente: D:/zarate-saas/.tools/cypress-e2e/mysql-data; no es un reparse point. UUID **386e58e7-dd3f-11f1-9f92-50ebf64eff02**, coincidente con el checkpoint; auto.cnf conservado. El log mantiene el cierre normal y no existe mysql.pid.
- Configuración privada: datadir exclusivo, puerto 3309, bind 127.0.0.1 y require_secure_transport=ON comprobados mediante lectura. Las cuatro configuraciones protegidas conservan SHA-256 y ACL.
- La lectura de metadatos y el cierre normal permiten reconocer la procedencia del estado conservado. **No sustituyen una validación física completa de InnoDB ni una sesión SQL de identidad/TLS**: ambas siguen pendientes. No se infiere el esquema desde la ausencia del directorio de la base de aplicación.
- El marcador HALTED.json y el checkpoint original permanecen intactos. No se eliminó ni renovó una guarda; no se reutilizaron autorizaciones vencidas. No se ejecutó --initialize ni --initialize-insecure, ni se borró/recreó el datadir.

### Resultado de esta reanudación

| Actividad | Resultado |
|---|---|
| Recuperación documental, Git, UUID/configuración y procesos | Comprobados de solo lectura |
| Control de nuevas suspensiones | **Detención requerida** por los dos ciclos descritos |
| Arranque MySQL 3309 | **NO EJECUTADO** |
| Creación de base/cuentas, bootstrap y verificación TLS SQL | **NO EJECUTADOS** |
| Migraciones | **0 aplicadas**, sin repetir inicialización |
| Fixtures y restauración | **NO EJECUTADOS**; no hay datos de aplicación que restaurar |
| Laravel/React privados y piloto | **NO EJECUTADOS** |
| Cypress E2E nuevo | **0 ejecutados, 0 aprobados, 0 fallidos, 46 no ejecutados** |
| Pest | No ejecutado; 38 excluidos conservados |

El inventario y el cuadro por módulo del cuerpo anterior se mantienen: autenticación 9, matrículas 6, Aula 11, evaluación 1, asistencia 3, comunicaciones 3 y transversales 13. **44 candidatos mantienen la autorización general pero están pendientes por el entorno; office #2/#3 continúan expresamente excluidos por DELETE.** No se cuentan bloqueos de infraestructura como fallos Cypress ni se acreditan mocks como integración SQL.

Se verificaron 603 fuentes y 78 documentos anteriores sin cambios, además de 13 resultados Cypress y los 276 JUnit Pest con 1.724 aserciones. Los 141 éxitos simulados y el test HTTP original corregido 3/3 permanecen históricos y no se repitieron. No hubo cambios funcionales ni acceso SQL a zarate_dev, zarate_test o zarate_pest; no se afirma una inspección de sus filas.

### Checkpoint y condición para continuar

El punto de recuperación **no cambió**: servidor nuevo inicializado y cerrado, antes de completar bootstrap y crear base/cuentas. Se agregó resume-01/checkpoint.json con el motivo de esta detención, sin sobrescribir recovery-checkpoint.json ni el resultado original.

La autorización SQL del Prompt 41 sigue vigente dentro de su alcance; no se necesita conceder privilegios nuevos ni habilitar los DELETE. Para reanudar se requiere revisar los dos eventos históricos ahora documentados y confirmar el criterio de continuación, además de un preflight nuevo y completo. No se asumió que una orden de continuar permita ignorar la cláusula expresa de detenerse ante nuevas suspensiones. Hasta esa revisión no se arrancará MySQL ni se quitará HALTED.json. Después corresponderá preparar el supervisor de recuperación, validar guardas monitor/worker y TTL máximo 120 segundos, y seguir desde el datadir existente sin repetir --initialize.

Evidencia privada nueva: .tools/cypress-e2e/evidence/prompt41/resume-01/preflight.json, git-status-before.txt, checkpoint.json y append-audit.json. Los dos documentos públicos solo recibieron anexos; sus prefijos anteriores permanecen byte por byte. No hay procesos nuevos que cerrar ni residuos SQL de esta reanudación.


---

## Anexo de continuación autorizada — 10/11/2026, referencia 15:16:57 de Lima

Este anexo actualiza el estado operativo; las secciones anteriores se conservan como registros históricos. El usuario autorizó tratar como históricos exclusivamente los ciclos de 14:54:36 y 14:57:10 y establecer un nuevo preflight. El texto íntegro de esa autorización se agregó al prompt y se conserva en resume-02/authorization-user.md. No se cambió energía de Windows ni se amplió el TTL.

### Estado al detener esta continuación

**D. BLOQUEADO POR SEGURIDAD O ENTORNO, con avance E2E parcial acreditado.** Hubo una nueva suspensión a las **15:52:19.4891934 -05:00**, posterior a la referencia **15:16:57.8040499 -05:00**. Las guardas detuvieron SQL. Laravel, Vite y MySQL propios quedaron cerrados; la comprobación final no encontró procesos privados ni listeners en los puertos revisados. No se continuaron migraciones, pruebas o restauraciones después del bloqueo.

Ahora sí están creados **zarate_cypress_e2e, sus cuentas, las 14 migraciones y los fixtures sintéticos**. El último caso quedó pendiente de verificación posterior a la interrupción: no se afirma que su estado haya sido restaurado. Se conserva el datadir actual, el baseline y los estados en cuarentena; no se borró nada para ocultar el fallo.

### Recuperación, TLS y cuentas

Se arrancó el **datadir existente**, sin --initialize ni --initialize-insecure. UUID conservado: **386e58e7-dd3f-11f1-9f92-50ebf64eff02**; puerto **3309**, bind **127.0.0.1**, datadir exclusivo .tools/cypress-e2e/mysql-data. Check41 verifica árbol monitor/worker, PID-file, listener, ejecutable/hash, creación y ausencia de nuevos eventos de energía. La autorización HMAC sigue con vigencia máxima de **120 segundos** y cada conexión/consulta comprueba destino efectivo; no se reutilizaron gates vencidos.

GuardOffline41.php aprobó **17 controles offline, 0 fallidos y 0 conexiones SQL**: firma/edad/TTL/destino y configuraciones protegidas. Son comprobaciones de contratos, separadas de las pruebas con servidor.

La primera recuperación encontró ERROR 1130 antes de ejecutar SQL: el usuario bootstrap root@localhost no admitía TCP 127.0.0.1 con skip-name-resolve=ON. Se conservó ese intento en resume-02 y se cerró el servidor. Se cambió **solo la configuración de la instancia nueva** a skip-name-resolve=OFF; se mantuvieron loopback, TLS, certificado SAN y verificación de cuenta. No se tocaron usuarios/configuraciones de los servidores protegidos. La contraseña bootstrap se completó privadamente después de un nuevo control de procesos/energía.

La conexión real por PDO aprobó identidad, puerto, datadir y UUID, con verificación de CA/identidad activa y cifrado **TLS_AES_256_GCM_SHA384**. Se crearon:

- zarate_cypress_app@127.0.0.1: **SELECT, INSERT, UPDATE**, exclusivamente en el esquema nuevo.
- zarate_cypress_migrator@127.0.0.1: SELECT, INSERT, UPDATE, CREATE, ALTER, INDEX y REFERENCES, solo en el esquema nuevo.

Ambas requieren SSL; SHOW GRANTS no contiene DELETE, DROP ni GRANT OPTION. Los tres destinos protegidos fueron rechazados por configuración **antes del conector**, sin contactar a esos servidores. Un intento con CA ajena fue rechazado por PDO en el servidor nuevo; el reporte de esa negativa conserva el rechazo, pero no el texto detallado de la excepción. No se ejecutó DELETE ni siquiera como prueba negativa: el guard lo rechazó antes del SQL. Evidencias de conexión y privilegios: resume-02/tls-identity-initial.json, resume-02/security-sql.json, provision.json y resume-04/security-sql.json.

### Migraciones y esquema

La primera llamada a migración falló durante el bootstrap privado de Laravel por una entrada de disco S3 vacía (Undefined array key driver). No era una incompatibilidad de las migraciones. La inspección real posterior confirmó **0 tablas y 0 migraciones** antes del reintento. Se corrigió únicamente Laravel41.php para retirar el disco externo no autorizado en lugar de dejar una configuración vacía. No se modificó Laravel funcional.

Después se ejecutaron uno a uno los **14 ups originales**, fijados por SHA-256, mediante Migrator y repositorio Laravel reales. Resultado: **14 registros y 52 tablas InnoDB**. Los registros migration-1.json a migration-14.json de resume-04 contienen nombre, hash, identidad y conteos por paso. No se repitieron después de inicializar el esquema. Las inspecciones de referencia comprobaron **112 restricciones FK**, sin referencias a otras bases ni violaciones detectadas, con foreign_key_checks activo. No se ejecutaron downs, migrate:fresh, DROP o TRUNCATE.

### Fixtures creados

Todos son nuevos y ficticios: institución **E2E41 / Colegio Ficticio E2E 41**; siete usuarios (los seis roles y un segundo estudiante); dos perfiles de estudiante, un docente, un apoderado y sus dos vínculos familiares; año 2026, cuatro bimestres habilitados, Primaria con seis grados y dos secciones por grado; asignatura, concepto/pago ficticio; dos matrículas (aprobada y observada) con historial; asignación docente, curso activo, unidad publicada y borrador, material privado/enlace, tipos de evaluación, tarea inicial y tipo de solicitud. Los flujos preparan las sesiones de asistencia, entregas, evaluaciones y solicitudes que necesitan dentro de cada caso; no se inventa que esas operaciones hayan sido probadas.

Se reutilizó **solo RolePermissionSeeder y sus reglas originales** para poblar permisos de esta base nueva; no se ejecutó ningún seeder demo ni se copiaron datos/credenciales de desarrollo. Credenciales nuevas permanecen privadas. Se creó un archivo sintético de material en storage exclusivo. Evidencia: resume-04/fixtures.json y snapshots posteriores.

### Restauración comprobada

Con MySQL cerrado limpiamente se creó baseline-cold: **216 archivos, 205.354.655 bytes** del datadir y storage exclusivos, sellados por SHA-256. Se verificaron rutas reales, ausencia de enlaces, procesos detenidos y configuración/TLS fijados por hash.

La prueba controlada insertó una institución marcador sintética dentro de la base E2E y creó un archivo privado. Se observaron dos instituciones antes de restaurar. El estado modificado se conservó en cuarentena, y se repuso la copia **en frío**, sin DELETE/DROP/TRUNCATE ni rollback supuesto de HTTP. La primera verificación posterior fue interrumpida por una carrera del supervisor: durante el cierre autorizado, su watcher confundió la desaparición esperada del monitor con una pérdida de identidad. Se detuvo y conservó e2e-run-01.

Se corrigió únicamente el instrumental para distinguir STARTING/RUNNING/STOPPING/STOPPED. Durante transiciones se mantiene el control de energía y un marcador **SQL_TRANSITION.json bloquea conexiones**; solo se retira tras una nueva acreditación/gate válido. No se omitió ninguna identidad de proceso en estado RUNNING. En e2e-run-02 se completó la lectura posterior **sin repetir la escritura del marcador**: conteos y hashes de filas volvieron al baseline y el archivo marcador desapareció. También aprobaron las restauraciones de los dos primeros casos ejecutados. Cada estado anterior fue preservado, no eliminado.

Esta aprobación del mecanismo no significa que se restauró el caso interrumpido final: su comprobación posterior sigue pendiente. Evidencias: e2e-run-01/restore-probe/dirty.json, restorations.jsonl, e2e-run-02/restore-probe/verified.json y result, más restored.json de cada caso cerrado.

### HTTP y adaptaciones privadas de pruebas

Se levantaron React/Vite real en **127.0.0.2:5174** y Laravel real en **127.0.0.2:8001**, conectados al MySQL 3309. Origin/CORS/Sanctum quedaron restringidos a ese origen; SESSION_DOMAIN nulo, cookie exclusiva, sesiones/cache/storage/bootstrap/temporales/logs privados. Se usó correo array, sin envíos externos, y ninguna cola o servicio de pago externo. La dirección HTTP distinta evita compartir cookies host-only con las demos. Las rutas de salud respondieron realmente a través del proxy como preflight, sin repetir el test HTTP ya acreditado.

Se prepararon **44 copias privadas**, sin generar los dos DELETE excluidos. Se conservaron callbacks, operaciones, estados HTTP esperados y aserciones originales; solo se parametrizaron credenciales, etiquetas/IDs de fixtures, Origin y selección individual de cada caso. El conteo estático de expect/should se conserva por archivo (no es un conteo de aserciones efectivamente ejecutadas). Las respuestas críticas no tienen mocks. Un interceptor de aislamiento rechaza orígenes externos y conserva el tráfico real permitido. Las adaptaciones, hashes y selecciones constan en case-adaptations.json y case-adaptations-v2.json; no se modificaron los tests originales.

El piloto académico reveló otra dependencia del entorno anterior: academicLogin() no rellena institution_code y frontend/src/pages/LoginPage.tsx:40 ofrece ZARATE por defecto. La primera copia conservaba involuntariamente ese valor mientras los fixtures requieren E2E41, y el login devolvió 422. Se preparó v2 con el llenado explícito del campo **solo en la copia privada**; no se cambió el default funcional ni se relajó 200 a 422. El reintento no llegó a verificar satisfactoriamente esa adaptación por la suspensión posterior.

### Resultados exactos del piloto

| Intento | Caso distinto | Resultado Cypress | SQL/HTTP y restauración |
|---|---|---|---|
| e2e-run-02 | CY39-010, auth.cy.ts #3, administración | **1 aprobada, 0 fallidas** | **22 peticiones HTTP y 169 consultas SQL reales**, DOM React, sesión persistente/dashboard/usuarios y móvil; cambios en users/audit_logs; restauración íntegra aprobada |
| e2e-run-02 | CY39-001, academic.cy.ts #1 | **0 aprobadas, 1 fallida** | Login 422 por código institucional; 1 SELECT real; sin acreditar consulta académica; restauración aprobada |
| e2e-run-03 | CY39-001, reintento con parametrización v2 | **0 aprobadas, 1 fallida** | Suspensión durante preparación; guardas 503 para auth/me y CSRF; no POST signIn; restauración posterior **no ejecutada** |

**Tres ejecuciones: una aprobada y dos fallidas. Dos casos distintos ejecutados: uno aprobado y uno fallido/pendiente de recuperación; 44 casos distintos no ejecutados.** No se contó el reintento como caso nuevo ni se repitió CY39-010. De los 44 no ejecutados, dos son los DELETE denegados; quedan 43 candidatos autorizados sin aprobación si se incluye el académico pendiente. Mocks nuevos: **0**. Integración SQL exitosa acreditada: **1 caso distinto**. Las pruebas auxiliares de restauración/guardas no se suman como casos Cypress.

El resumen automático e2e-run-03/result solo incluye casos consolidados con restauración y por eso muestra la aprobación trasladada de CY39-010, no la falla del intento interrumpido. El recuento anterior se obtuvo de los **tres cypress-result.json y sus JUnit**, incluida la falla no consolidada. No se oculta ese resultado ni se declara el piloto completo.

| Módulo | Candidatos | Distintos ejecutados | Aprobados | Fallidos/pendientes | No ejecutados |
|---|---:|---:|---:|---:|---:|
| Autenticación | 9 | 1 | 1 | 0 | 8 |
| Matrículas | 6 | 0 | 0 | 0 | 6 |
| Aula Virtual | 11 | 0 | 0 | 0 | 11 |
| Evaluaciones | 1 | 0 | 0 | 0 | 1 |
| Asistencia | 3 | 0 | 0 | 0 | 3 |
| Comunicaciones | 3 | 0 | 0 | 0 | 3 |
| Regresión transversal | 13 | 1 | 0 | 1 | 12 |
| **Total** | **46** | **2** | **1** | **1** | **44** |

El caso learning #3 sigue separado como Evaluaciones para no duplicarlo en Aula. La matriz original de los 46 en el cuerpo del documento permanece válida como inventario, no como ejecución. No se ampliaron los módulos tras el piloto fallido. La falla académica no demuestra un defecto del módulo académico: no se completó su login/consulta.

### Suspensión nueva y respuesta del supervisor

Kernel-Power 42: **15:52:19.4891934**; Kernel-Power 107: 15:52:20.3986992; Power-Troubleshooter 1: 15:52:25.6026733, todos -05:00. Estos eventos sí son posteriores a la referencia autorizada. Las comprobaciones detectaron la novedad y HALTED.json bloqueó conexiones/consultas; no se cambió la configuración de energía ni se renovó una autorización vencida para seguir.

El navegador del reintento estaba preparándose cuando ocurrió la suspensión. Cypress inició su caso a las **15:52:35.733** y terminó fallido a las 15:52:47.366; ya entonces las rutas de autenticación devolvían **503 por la guarda**. El error fue timeout esperando el primer signIn, que nunca se envió. Esto distingue el segundo fallo del 422 anterior y no acredita la corrección v2. El instrumental detuvo SQL, aunque el arranque de Cypress continuó hasta reportar el fallo: antes de una futura reanudación debe revisarse la cancelación de un navegador en preparación al activarse HALTED, sin debilitar la guarda SQL ni ocultar esta falla.

Después se cerraron los HTTP propios y el MySQL mediante su evento normal de monitor, con identidad verificada; e2e-run-03/final/mysql-final-stop.json confirma cierre controlado sin fuerza. environment-final.json confirma **0 procesos y 0 listeners** revisados, PID-file ausente, HALTED presente y los cuatro hashes/ACL protegidos intactos. No se ejecutó una restauración ni un conteo SQL después de la interrupción. No se debe tratar como certificado el estado actual de filas hasta un nuevo preflight y una recuperación controlada.

### Preservación y siguiente punto seguro

Se preservaron por SHA-256 **603 fuentes funcionales/tests, 78 documentos anteriores, 13 archivos de resultados Cypress históricos y 276 JUnit Pest / 1.724 aserciones**. Los 141 casos simulados y el HTTP corregido 3/3 no se repitieron. Los 38 Pest siguen excluidos. Los dos casos office #2/#3 (CY39-033/CY39-034) no tienen permiso DELETE ni fueron ejecutados.

No se conectó a zarate_dev, zarate_test ni zarate_pest ni se tocaron sus cuentas, migraciones, datadirs o servicios. La preservación se demuestra mediante destinos exclusivos, cuentas acotadas, guardas, hashes/ACL y procesos propios; no se inventa una auditoría de filas de bases protegidas que no se consultaron. No hubo cambios funcionales, dependencias nuevas, commits, push, merge o PR.

**Checkpoint actualizado:** .tools/cypress-e2e/evidence/prompt41/recovery-after-e2e.json. Sustituye como punto operativo de recuperación al checkpoint inicial, que se conserva histórico: ahora hay base, cuentas, esquema y fixtures. **No reinicializar, no repetir migraciones y no repetir CY39-010.** Mantener el datadir interrumpido para evidencia; con un nuevo preflight autorizado, verificar y preservar ese estado antes de cualquier restauración fría al baseline sellado. Reanudar primero CY39-001 y completar el piloto; no ampliar hasta resolver su validación. Las restricciones DELETE/Pest permanecen.

Artefactos principales: resume-02 (referencia, 17 controles y primera conexión TLS); resume-03 (bootstrap/cuentas y rechazo de bootstrap Laravel); resume-04 (14 migraciones, fixtures, inspecciones y cierre); baseline-cold/manifest.json; e2e-run-01 (carrera de cierre y marcador); e2e-run-02 (restauración verificada, caso aprobado y primer 422); e2e-run-03 (reintento interrumpido, eventos de energía y cierre). Hay JUnit, resultados Cypress, trazas HTTP/SQL, snapshots y estados en cuarentena. La preparación tuvo también un error de quoting PowerShell y una revisión automática que no pudo completarse con Bad Request: esas llamadas no ejecutaron sus operaciones; se retomó mediante scripts privados y llamadas revisadas separadas, sin omitir controles.


---

## Anexo de resultados del Prompt 42 — 10/11/2026

La recuperación de solo lectura comprobó 52 tablas (CHECK TABLE OK), 14 migraciones, cero transacciones incompletas y cero violaciones FK; filas y storage coincidieron con el baseline y no requirieron restauración inicial. CY39-001 aprobó con 29 peticiones HTTP/201 consultas de aplicación SQL reales y su restauración posterior fue verificada. Se conserva CY39-010 sin repetirlo: acumulado **2 casos E2E distintos aprobados**.

Una nueva suspensión **Button or Lid a las 16:16:51 -05:00** canceló la preparación de CY39-023 mediante un Job Object privado. No tiene resultado Cypress final y no se cuenta como aprobación/fallo completo. Prompt 42 registra **1 nuevo aprobado, 0 fallidos completos, 1 cancelación y 44 pendientes**, incluidos los dos DELETE excluidos. El estado posterior a la cancelación requiere inspección; los procesos privados cerraron y no hubo cambios funcionales ni commits/push.

Estado: **D — bloqueado por entorno**. Detalle verificable en [evidencias-recuperacion-e2e.md](evidencias-recuperacion-e2e.md). Checkpoint actualizado: .tools/cypress-e2e/evidence/prompt42/recovery-checkpoint.json. No reinicializar, no repetir migraciones ni CY39-010/CY39-001. Los 38 Pest siguen excluidos.
