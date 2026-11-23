# Prompt 40 — Cierre HTTP y preparación E2E real

Fecha: 10/11/2026. Rama: `test/integracion-misional`. HEAD sin cambios: `1a043035c126a5bc3e5ed14cf43fdd49a4e171bf`.

## Resultado

**A. TEST HTTP CORREGIDO — ENTORNO E2E PREPARADO PARA AUTORIZACIÓN.** Esta clasificación acredita el test HTTP corregido y el diseño revisable del entorno futuro. No significa instancia SQL instalada ni 46 casos ejecutados. La infraestructura todavía requiere autorización, implementación de sus adaptadores de ejecución y verificación real de identidad/TLS/privilegios antes de usarla.

Se aplicó exclusivamente el parche autorizado del Prompt 39 al test original de salud y a su helper de prueba. El archivo original corregido, no una copia privada del escenario, aprobó **tres ejecuciones independientes**, cada una en un navegador Cypress nuevo, sin retries. Se conservaron las aserciones de HTTP 200, JSON exacto y actualización de pantalla. No se modificó React, Laravel, migraciones ni configuración funcional.

## Recuperación e integridad

Se recuperaron las evidencias del Prompt 39 y su variante 3/3 sin repetirlas. El preflight de procesos/puertos no encontró procesos de pruebas/MySQL abandonados ni listeners ocupando los puertos revisados. Los cambios anteriores de Git se preservaron: evidencias-finalizacion-migraciones.md ya tenía 116 líneas agregadas y había documentación no rastreada de intervenciones anteriores. No se atribuyen a este prompt.

La auditoría comprobó 603 fuentes después del parche (incluido el helper nuevo), 76 documentos anteriores, 13 archivos de resultados Cypress anteriores y 276 JUnit Pest mediante SHA-256, sin diferencias no autorizadas. De las 602 fuentes previas, solo cambió integration.cy.ts. Los 141 éxitos simulados y el checkpoint Pest 276/314 con 1.724 aserciones se conservaron; no se ejecutaron otra vez. Los 38 casos Pest bloqueados siguen bloqueados.

## Cambio exacto y motivo

En desarrollo, StrictMode realiza una limpieza adicional del efecto de TechnicalPage.tsx, cuyo AbortController cancela la primera petición. El test esperaba esa primera intercepción sin response. No se modificó este comportamiento funcional legítimo. Se reemplazó la espera singular por la observación del conjunto de intercepciones y su finalización real.

`e2e/cypress/e2e/integration.cy.ts`:

```diff
diff --git a/e2e/cypress/e2e/integration.cy.ts b/e2e/cypress/e2e/integration.cy.ts
index 024f947..23ca002 100644
--- a/e2e/cypress/e2e/integration.cy.ts
+++ b/e2e/cypress/e2e/integration.cy.ts
@@ -1,12 +1,15 @@
+import { observeHealth } from '../support/observeHealth'
+
 describe('Comunicación real frontend–Laravel', () => {
   it('consulta la API real a través del proxy y actualiza la pantalla', () => {
     cy.request('/api/health').then((response) => {
       expect(response.status).to.eq(200)
       expect(response.body).to.deep.eq({ status: 'ok', service: 'backend' })
     })
+    const health = observeHealth()
     cy.intercept('GET', '/api/health').as('health')
     cy.visit('/')
-    cy.wait('@health').its('response.statusCode').should('eq', 200)
+    health.assertResponse('@health.all')
     cy.get('[data-testid="backend-status"]').should('contain', 'Backend conectado correctamente.')
   })
 })
```

Se agregó `e2e/cypress/support/observeHealth.ts` (65 líneas), idéntico al helper validado en Prompt 39. El diff íntegro, incluido el contenido del helper, se conserva en `.tools/misional-isolated/evidence/prompt40/applied.patch` y coincide con la propuesta aprobada del Prompt 39. No se eliminaron aserciones: la petición cy.request conserva response.status=200 y el JSON esperado; las respuestas interceptadas completadas también exigen statusCode=200 y el mismo JSON; se conserva el texto de conexión en pantalla.

El helper observa fetch/abort nativos sin responder con mocks. Admite como máximo una cancelación, exclusivamente la primera, comprobando AbortError, pila de TechnicalPage/StrictMode y BrowserConnectionClosedError en su intercepción. Esa cancelación nunca se considera una respuesta válida. Errores de red adicionales, cancelaciones distintas, navegación inesperada, HTTP no 200 o JSON incorrecto fallan. No hay cy.wait con tiempos fijos, desactivación de StrictMode ni bypass de errores de servidor. La dependencia de nombres de pila de React/Cypress debe revisarse ante cambios de versión.

## Ejecuciones reales

| Ejecución del mismo test original corregido | Aprobadas | Fallidas | Pendientes/omitidas | Abort inicial legítimo |
|---|---:|---:|---:|---:|
| 1 | 1 | 0 | 0 | 5 ms |
| 2 | 1 | 0 | 0 | 5 ms |
| 3 | 1 | 0 | 0 | 4 ms |

**3/3 ejecuciones aprobadas, 0 fallidas; un caso lógico, no tres casos distintos.** Las ejecuciones finalizaron el 10/11/2026 a las 19:26:55 UTC (14:26:55 de Lima). Cada traza incluye ID/URL/statusCode/body de la respuesta válida y la pila de la cancelación; las tres respuestas verificadas fueron HTTP 200 y `{status:'ok',service:'backend'}`. No hubo navegación inesperada.

- TypeScript E2E: `node e2e/node_modules/typescript/bin/tsc --noEmit -p e2e/tsconfig.json`, aprobado, salida 0.
- Sintaxis Node de supervisor y ejecutor: aprobada; git diff --check: sin errores.
- No se solicitó ni ejecutó build/ESLint de módulos funcionales: no se modificaron. No se ejecutaron los otros 187 casos Cypress ni Pest en este prompt.
- El inventario original continúa siendo 188 casos. Estado actualizado por último resultado acreditado: **142 aprobados (141 simulados + 1 HTTP real sin SQL), 46 no ejecutados**. Los fallos originales y auxiliares de Prompt 38/39 se preservan como historia y no se borran por este resultado.

La ejecución HTTP utilizó Laravel real en 127.0.0.1:8001 y Vite/React en 127.0.0.1:5174, con proxy real /api/health, caché/bootstrap/storage/env privados y conexiones SQL vacías. La guarda DatabaseManager rechaza SQL antes de PDO. El preflight demostró ese rechazo y bloqueó GET a una ruta de negocio con 503. El interceptor de soporte solo destruye peticiones a orígenes externos; no responde a /api/health. Los eventos de servidor y trazas corroboran el tráfico real.

No se inició MySQL, no se abrieron conexiones SQL y no hubo DDL/DML, migraciones, seeders, cuentas o fixtures SQL. No se afirma haber inspeccionado filas de bases protegidas: no fueron abiertas. Backend PID 28760 y frontend PID 17500 fueron cerrados por su supervisor; la comprobación posterior no encontró procesos privados/MySQL ni listeners en los puertos revisados. El registro de energía no mostró suspensión durante la ejecución/cierre comprobados. No se cambió la configuración de energía.

## Arquitectura definitiva propuesta, no aprovisionada

| Recurso | Contrato propuesto |
|---|---|
| Instancia SQL | Exclusiva 127.0.0.1:3309, disponibilidad a revalidar antes del arranque; no servicio global de Windows |
| Base | zarate_cypress_e2e; sin datos reales ni copias de otras bases |
| Datadir | D:/zarate-saas/.tools/cypress-e2e/mysql-data |
| Baseline frío | D:/zarate-saas/.tools/cypress-e2e/baseline-cold, sellado y separado del datadir activo |
| Cuenta de runtime | Nueva zarate_cypress_app@127.0.0.1, sin reutilizar credenciales existentes |
| Cuenta de preparación | Nueva zarate_cypress_migrator@127.0.0.1; preparación auditada y retirada del runtime |
| TLS SQL | CA/certificado privados nuevos con SAN correcto, require_secure_transport, verificación de CA e identidad obligatoria; no confiar globalmente ni desactivar TLS |
| Identidad | Validar ejecutable/hash, PID/creación/padre, UUID, datadir, host/puerto, CURRENT_USER(), DATABASE(), versión y Ssl_cipher; autorización por proceso con TTL 120 s, sin ampliarlo |
| Laravel exclusivo | 127.0.0.2:8001; código original con adaptador privado de entorno/guardas, sin cargar .env/.env.testing de desarrollo |
| React exclusivo | 127.0.0.2:5174; configFile false, env/cache privados y proxy solo al backend privado |
| Cookie y Sanctum | SESSION_DOMAIN nulo, eco_cypress_e2e_session, Sanctum 127.0.0.2:5174 y CORS al Origin exacto con credenciales |
| Aislamiento de navegador | Perfil, cookies, descargas, capturas y temporales exclusivos; sin cuentas demo ni tokens heredados |
| Storage y servicios | Árbol privado nuevo, sesión/cache file persistentes, correo array, cola sync solo con jobs/notificaciones locales revisados |

La dirección HTTP futura 127.0.0.2 evita compartir cookies host-only, incluido XSRF-TOKEN, con demos en localhost/127.0.0.1: los puertos no aíslan cookies. No requiere editar hosts. Las validaciones HTTP de este prompt usaron 127.0.0.1; no acreditan todavía el login/cookie futuro. Se repitió la comprobación de bind el 10/11/2026 a las 19:30:15 UTC: 127.0.0.1:3309 y 127.0.0.2:8001/5174 disponibles; los sockets se cerraron inmediatamente sin iniciar servicios (candidate-bind-checks.json). No constituye una reserva: repetir al aprovisionar.

### Variables y privilegios

El manifiesto privado `prompt40/sql-plan/manifest.json` define APP_ENV=testing, APP_URL=http://127.0.0.2:8001, FRONTEND_URL=http://127.0.0.2:5174, DB_CONNECTION=mysql, DB_HOST=127.0.0.1, DB_PORT=3309, DB_DATABASE=zarate_cypress_e2e, DB_USERNAME=zarate_cypress_app, SESSION_DRIVER=file, CACHE_STORE=file, SESSION_DOMAIN nulo, SANCTUM_STATEFUL_DOMAINS=127.0.0.2:5174, QUEUE_CONNECTION=sync, MAIL_MAILER=array y FILESYSTEM_DISK=local. APP_KEY, contraseñas y CA serán archivos privados nuevos, fuera de Git y reportes. Los placeholders no son credenciales operativas.

Runtime: SELECT/INSERT/UPDATE únicamente sobre tablas necesarias de la base nueva; no DDL, FILE, SUPER, privilegios globales ni GRANT OPTION. Dos casos necesitan una excepción **DELETE solo en zarate_cypress_e2e.communication_targets**, que requiere aprobación separada; el manifiesto la mantiene desautorizada. La cuenta migradora necesitará los permisos de esquema concretos de los 14 ups originales (CREATE/ALTER/INDEX/REFERENCES y lecturas/escrituras de registro de migraciones/fixtures que requieran), solo en esta base; no usarla desde HTTP. Revisar el SQL efectivo de cada up antes de conceder permisos adicionales, sin modificar las migraciones. No se autoriza DROP/TRUNCATE por defecto.

La creación inicial de cuentas y grants de esta **nueva instancia** requiere una identidad administrativa privada propia: no tocar usuarios ni privilegios de servidores existentes. TLS y privilegios reales solo podrán aprobarse después del arranque autorizado. Las pruebas negativas deberán rechazar zarate_dev, zarate_test, zarate_pest, 3307/3308, TLS inválido, datadir/cuenta/UUID distintos, TTL vencido y procesos sustituidos, antes de escrituras o conexiones equivocadas.

### Preparación offline realizada

- PreparePlan.cjs creó el manifiesto con los 46 IDs y SHA-256 de las 14 migraciones originales.
- ValidatePlan.cjs aprobó **11 controles offline**, 0 fallidos: contrato candidato más rechazos de tres bases protegidas, dos puertos protegidos, TLS desactivado, TTL ampliado, datadir fuera del árbol, DELETE preautorizado y ejecución preautorizada.
- Install-E2E.ps1 se preparó y revisó en **modo PLAN_ONLY**: enumera los pasos; no contiene una vía autorizada de instalación y rechaza -Execute. Es un esquema de preparación, no un instalador SQL certificado. No se ejecutó instalación alguna.

Estas comprobaciones son contratos locales; **no son pruebas TLS/SQL positivas o negativas contra un servidor real**. Tras autorización se deberán implementar/revisar los adaptadores de aprovisionamiento y runtime, conservando estas condiciones y verificándolos antes del primer DDL. Los scripts no habilitan por sí mismos ninguna operación.

### Fixtures y restauración

Preparar únicamente datos sintéticos propios: institución, año/periodos, catálogos, seis roles y actores sin cambio de contraseña pendiente; perfiles/vínculos familiares; solicitudes aprobadas/observadas y cupos; cursos y docente asignado; unidades/materiales privados; tareas/entregas/evaluaciones; sesiones/ausencias; tipos de solicitudes/comunicados y notificaciones; datos mínimos de informes. Conservar F-CORE, F-ACA, F-PEOPLE, F-MAT, F-COURSE, F-CONTENT, F-LEARN, F-ATT, F-OFFICE, F-NOTICE y F-REPORT de la matriz. No usar DatabaseSeeder, AcademicDemo, PeopleDemo ni copiar datos institucionales.

Mantener contexto dentro de cada caso que cambia de rol. Entre casos: bloquear HTTP, cerrar navegador/cookies, comprobar transacciones, detener exclusivamente procesos propios, preservar evidencia y estado fallido en cuarentena, restaurar **copia fría** sellada del datadir nuevo y su storage emparejado; arrancar con identidad/TTL nuevos y comprobar esquema/fixtures. No copiar InnoDB en caliente ni asumir que DatabaseTransactions de Pest revierte múltiples peticiones HTTP. La limpieza de sesiones/tokens debe limitarse al snapshot nuevo, sin DELETE global ni tocar otras bases. Restaurar archivos solo tras verificar rutas absolutas bajo .tools/cypress-e2e y aprobación expresa. No hay limpieza destructiva autorizada hoy.

Esperado después de aplicar únicamente los 14 ups originales: 52 tablas/14 migraciones, contrastadas con manifiesto, sin residuos fuera de fixtures. **Pendiente de comprobar en la nueva base.** Conservar JUnit, trazas, manifests y hashes fuera del snapshot restaurable. Si ocurre suspensión, caída, PID nuevo, error o TTL vencido: detener escrituras, conservar todo y recuperar mediante preflight nuevo; no reintentar automáticamente ni prolongar la guarda.

La evidencia de no afectación incluirá hashes/ACL de configuración protegida, procesos/listeners anteriores y posteriores, identidad positiva/negativa, permisos restringidos, logs del servidor nuevo y validación de destinos del adaptador. No atribuir una comparación de filas de bases protegidas si no se realiza una consulta de solo lectura expresamente autorizada.

## Los 46 casos preparados en el plan

**Todos pendientes de ejecución real.** Autenticación 9, matrículas 6, Aula/aprendizaje 12, asistencia 3, comunicación 3 y transversales 13. Hay 44 que necesitan SQL y 43 con escrituras de login/auditoría aun cuando la consulta funcional sea de lectura. Auth #1 y #9 pueden ser previos a SQL, pero permanecen pendientes. Auth #2 requiere consultas para credenciales incorrectas.

Leyenda: L=SELECT, I=INSERT, U=UPDATE, A=escrituras de autenticación/auditoría, D=DELETE. F-* identifica el fixture sintético requerido. Los títulos y referencias corresponden al código existente, no a ejecuciones nuevas.

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


### Tratamientos adicionales

- No hay HTTP DELETE directo. **office.cy.ts #2 y #3** invocan creación de comunicaciones cuyo servicio elimina targets antes de crearlos; necesitan DELETE acotado aunque la primera eliminación afecte cero filas. No generalizar ese permiso ni confundirlo con logout, que no borra tokens en estos casos.
- classroom #1, learning #2, attendance #2 y office #1 requieren uploads privados; classroom #2/#3 necesitan fixtures de descarga y denegación. reports #1 usa cypress/downloads/active-students.csv: mantener ese contrato en un proyecto Cypress privado con downloadsFolder propio.
- visual #2 previsualiza/cancela una imagen Blob, sin POST de avatar. Separar capturas de evidencia de archivos funcionales.
- No se identificó dependencia obligatoria de servicios externos: pagos manuales, enlaces inspeccionados sin navegación y notificaciones locales. Mail real, push externo o proveedores de pago no están autorizados ni cubiertos.
- No hay negativas explícitas entre dos instituciones en esos 46; preparar dos tenants para pruebas adicionales de aislamiento y solicitar su aprobación aparte. No declarar cobertura multiinstitucional HTTP inexistente.
- Se requiere adaptar de forma revisable credenciales demo, etiquetas/fixtures y Origin fijos hacia datos sintéticos privados. **No autorizado ni realizado ahora**; no eliminar aserciones 200/403/404/419 ni convertir casos reales a mocks. No usar Cypress.env() retirado en Cypress 16; credenciales mediante mecanismo privado con log:false y redacción de resultados.

## Secuencia y checkpoints futuros

| Orden | Lote | Cantidad única | Condición antes de continuar |
|---|---|---:|---|
| 0 | Salud corregida y preflight de identidad/TLS/guardas | Ya validada sin SQL | No sustituye preflight futuro de la instancia |
| 1 | auth.cy.ts | 9 | Sesión, CSRF, redirecciones y RBAC reales; restauración por caso |
| 2 | enrollment.cy.ts, enrollment-center.cy.ts | 6 | Solicitudes/cupos/historial con datos sintéticos |
| 3 | courses/classroom/learning/virtual | 12 | Docente/estudiante y archivos privados; registro completo |
| 4 | Evaluaciones: learning #3 | 0 adicionales | Ya contado en los 12; no confundir mocks de historial con SQL |
| 5 | attendance.cy.ts | 3 | Marcas/cierre/justificación y roles familiares |
| 6 | office.cy.ts | 3 | Autorización específica de DELETE para #2/#3 |
| 7 | academic/people/reports/visual | 13 | Catálogos/vínculos/reportes y controles móviles |

Total: 46. En cada lote, ejecutar primero un caso smoke y avanzar secuencialmente sin duplicar éxitos acreditados. Guardar checkpoint por ID de matriz, hash de spec, identidad y fixtures, JUnit, resultado y limpieza comprobada; detener al primer fallo. Permisos negativos existentes se ejecutan dentro de sus casos. Pruebas adicionales de aislamiento entre tenants serán un lote separado aprobado, no parte ficticia de estos 46.

## Autorización concreta requerida para el siguiente prompt

El parche HTTP ya está autorizado y aplicado; no se solicita autorización nuevamente para él. La siguiente autorización debe permitir explícitamente:

> Preparar una instancia MySQL exclusiva en 127.0.0.1:3309, usando únicamente D:/zarate-saas/.tools/cypress-e2e para datadir, TLS, baseline y almacenamiento privado; crear zarate_cypress_e2e y dos cuentas nuevas con los permisos limitados descritos, sin modificar cuentas ni bases existentes. Autorizar los 14 ups originales, después de identidad/TLS/guardas positivas y negativas, y fixtures completamente sintéticos sin seeders demo. Permitir la adaptación revisable de credenciales/Origin/fixtures de los 46 casos, preservando sus aserciones. Autorizar sus SELECT/INSERT/UPDATE y, separadamente, DELETE solo en communication_targets para office #2/#3. Permitir restauración fría únicamente de los archivos nuevos y comprobados bajo ese árbol, con evidencias preservadas y sin DROP/TRUNCATE. Ejecutar por fases los 46 casos después de cada preflight, deteniéndose ante fallos o suspensión. Proteger zarate_dev, zarate_test y zarate_pest y los servicios demo; mantener TTL 120 segundos. No habilitar los 38 Pest bloqueados ni servicios externos. No realizar commits ni push.

Esta es una propuesta para aprobación, **no una autorización concedida**. Puede aprobarse en etapas: aprovisionamiento y guardas primero; ejecución de casos/DELETE/restauración después. Si falta alguna autorización, conservar los casos afectados bloqueados. El alcance no incluye cambios funcionales de React/Laravel ni migraciones originales.

## Archivos y evidencia

Cambios públicos de este prompt:

1. e2e/cypress/e2e/integration.cy.ts — sincronización del test original.
2. e2e/cypress/support/observeHealth.ts — helper de observación/aserciones, sin mocks.
3. docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-40-cierre-http-preparacion-e2e.md — prompt íntegro, sin resumir.
4. docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-http-preparacion-e2e.md — este cierre y plan.

Instrumental privado ignorado en .tools/misional-isolated/evidence/prompt40:

- applied.patch y source-before/source-after-approved-patch/documents-before: diff íntegro y pins.
- run/variant-1.result.json a variant-3.result.json: resultados de Cypress ejecutando **el mismo integration.cy.ts original corregido**; el nombre del artefacto no implica una variante del spec.
- run/variant-*.xml y trace-*.json: JUnit y trazas por ejecución; run/result.json: resumen/cierre; run/http-preflight.json y laravel-probe.stdout.json: aislamiento sin SQL.
- environment-before.json, environment-after.json y run/*.identity.stdout.json: procesos, energía e identidad. Cuatro configuraciones protegidas conservaron hash y ACL.
- closure-audit.json: 603 fuentes, 76 documentos, 13 resultados Cypress y 276 JUnit Pest verificados.
- sql-plan/manifest.json, PreparePlan.cjs, ValidatePlan.cjs, offline-validation.json e Install-E2E.ps1: preparación offline, no instalación.

No hubo commits, push, merge ni PR. El siguiente paso es aprobar el plan acotado y verificarlo en la instancia nueva antes de ejecutar SQL real. La corrección HTTP queda cerrada; la validación integral SQL y las limitaciones institucionales/de contratos pendientes del proyecto permanecen abiertas.
