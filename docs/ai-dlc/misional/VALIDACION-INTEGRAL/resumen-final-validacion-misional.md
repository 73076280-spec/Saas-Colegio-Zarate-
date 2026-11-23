# Cierre priorizado de validación misional — Prompt 45

Fecha: 11/11/2026, America/Lima. Repositorio validado: `D:\zarate-saas`. Rama: `test/integracion-misional`. El alcance es una entrega académica de la versión revisada, no una autorización de despliegue productivo ni una aprobación del profesor.

**D. BLOQUEADO POR SEGURIDAD O INFRAESTRUCTURA.** El lote priorizado se cierra sin iniciar mas grupos: ocho casos nuevos aprobaron, pero el ejecutor interrumpio CY39-032 a los 115 segundos. Sus datos posteriores no se inspeccionaron/restauraron. No se recomienda presentar una validacion integral completada ni una entrega tecnica definitiva hasta disponer el estado residual y resolver el alcance de la version a entregar. Este bloqueo no demuestra por si solo un defecto critico funcional del producto.

## Alcance y evidencia

Se recuperó el checkpoint del Prompt 44: nueve casos E2E distintos aprobados, 37 sin acreditar, 276 Pest con 1.724 aserciones y 141 Cypress con API simulada. No se repitieron los nueve éxitos. Se autorizó un único lote de hasta diez casos nuevos, sin reintentos ni grupos adicionales. Los fallos se conservan y no se modifican aserciones originales para obtener aprobaciones.

Fuentes de requisitos: [requirements-status.md](../../../requirements-status.md) y [traceability.md](../../../traceability.md). Sus 24 RF describen implementación; ese estado no equivale a 24 RF íntegramente acreditados por E2E real. La cobertura de este cierre se limita a los recorridos con resultados y artefactos verificables.

| Módulo | RF existentes | Evidencia E2E real | Cobertura y limite |
| --- | --- | --- | --- |
| Autenticación y RBAC | RF-01/02/04/24 | Exitos previos y CY39-025; consulta y restricciones por rol | Acreditada parcialmente; logout de Tesoreria/Estudiante pendiente |
| Matrículas | RF-06/07/21 | CY39-023 previo y CY39-024/025 nuevos | Consulta/alcance acreditados; ciclo completo CY39-026 no ejecutado |
| Aula Virtual y tareas | RF-10/12/22; RF-11 como consulta de recursos | CY39-042, CY39-029, CY39-030 | Navegacion, publicacion/revision y entrega acreditadas |
| Evaluaciones y notas | RF-08/09/10/22 | CY39-031 | Publicacion de evaluacion, registro y consulta de nota acreditados |
| Asistencia y justificación | RF-13/14/15/21 | CY39-005, CY39-006 | Registro/cierre y justificacion familiar con archivo acreditados |
| Solicitudes/documentos | RF-16/17/18 | CY39-032 interrumpido | HTTP/SQL parciales; NO acredita el recorrido completo |
| Comunicados y campana | RF-19/20 | CY39-033/034 excluidos | Sin E2E de publicacion/marcado; API simulada no sustituye SQL real |
| Otros transversales | RF-03/05/23 | Evidencias Pest previas; E2E fuera de este lote | No se acredita un recorrido E2E completo adicional de estos RF |

La consulta de cursos y navegación no acredita por sí sola publicación de todos los materiales. Del mismo modo, las solicitudes académicas no sustituyen a la publicación de comunicados ni al marcado de campana. Los casos CY39-033 y CY39-034 siguen excluidos por DELETE sobre `communication_targets`; no se inventó un sustituto para atribuir cobertura RF-19/RF-20.

## Resultados separados por tipo

| Tipo | Resultado acreditado | No ejecutado / limite |
| --- | --- | --- |
| Pest + MySQL aislado | 276/314 aprobados; 1.724 aserciones | 38 bloqueados; no reejecutados en Prompt45 |
| Cypress con API simulada | 141 aprobados conservados | No son validacion navegador-Laravel-MySQL |
| HTTP real sin SQL, integration.cy.ts | 1 caso original aprobado en 3 ejecuciones del Prompt40 | No sumar 3 casos distintos |
| Inventario de E2E reales (46 candidatos) | 17 distintos aprobados; 15 con SQL y 2 controles HTTP sin SQL de aplicacion | 29 sin acreditar; no equivalen a 29 pruebas fallidas |
| Ultimo lote de 10 | 8 aprobados; 0 aserciones nuevas fallidas acreditadas | 1 interrumpido sin resultado final y 1 no iniciado |

No se suman ejecuciones repetidas del mismo caso para inflar aprobaciones distintas. Los timeouts y fallos antiguos permanecen en sus evidencias; una aprobación posterior se informa junto con su antecedente. «Sin acreditar» incluye fallidos y bloqueados; no significa que todos esos casos hayan sido ejecutados.

### Último lote prioritario

Selección fija: CY39-024, CY39-025, CY39-042, CY39-029, CY39-030, CY39-031, CY39-005, CY39-006, CY39-032 y CY39-026. Aporta alcance personal/familiar y permisos, navegación del aula, tareas/entregas, notas, asistencia y justificaciones, solicitudes/documentos y el flujo completo de matrícula. Los casos de publicación de comunicados no son admisibles con la autorización vigente.

| Caso | Recorrido | Resultado | SQL | HTTP | Restauración |
| --- | --- | --- | --- | --- | --- |
| CY39-024 | estudiante y apoderado consultan su alcance y no acceden a creación ni cupos | APROBADO | 424 | 52 | Verificada |
| CY39-025 | docente no accede al centro y mantiene acceso al Aula Virtual | APROBADO | 77 | 10 | Verificada |
| CY39-042 | mantiene la sesión del estudiante y navega recursos reales en PC tablet y móvil | APROBADO | 245 | 22 | Verificada |
| CY39-029 | docente crea publica tarea y consulta y revisa una entrega | APROBADO | 706 | 59 | Verificada |
| CY39-030 | estudiante entra al curso entrega archivo y consulta Mis entregas | APROBADO | 376 | 35 | Verificada |
| CY39-031 | docente publica evaluación registra nota y el estudiante consulta su calificación | APROBADO | 501 | 44 | Verificada |
| CY39-005 | docente registra asistencia y cierra la sesión sin edición posterior | APROBADO | 384 | 28 | Verificada |
| CY39-006 | apoderado vinculado envía justificación con archivo privado y consulta historial | APROBADO | 333 | 31 | Verificada |
| CY39-032 | estudiante crea corrige solicitud y Secretaría observa aprueba emite documento y completa | INTERRUMPIDO; sin veredicto final | 1422 parciales | 156 parciales | NO VERIFICADA despues del timeout |
| CY39-026 | completa Secretaría y Tesorería con corrección pago aprobación historial y cupos | NO EJECUTADO | - | - | No aplica |

Los conteos parciales de CY39-032 son actividad del servidor, no pruebas o aserciones aprobadas. No hay resultado Cypress, JUnit ni recibo final del Job Object para ese intento; los procesos se comprobaron terminados por separado.

Se reutilizó la corrección privada del Prompt 44: preparación explícita de Laravel y OPcache solo en el proceso PHP aislado; salud HTTP 200/JSON con límite intacto de diez segundos. El fixture institucional se completó después de que el control de correo original estuviera disponible, conservando el texto de las aserciones y sus timeouts. Esa adaptación se preparó antes del lote, a partir de la carrera ya demostrada, sin cambios en React, Laravel funcional o specs originales.

## Clasificación de los 46 candidatos E2E reales

Las categorías se aplican al estado más reciente acreditado. Los fallos históricos de sincronización no se convierten en defectos funcionales reproducibles sin evidencia; los mensajes y artefactos se conservan. Cuando un recorrido no llegó a su objetivo, no se le atribuye cobertura de negocio por haber completado únicamente login.

| ID | Módulo / recorrido | Clasificación | Detalle |
| --- | --- | --- | --- |
| CY39-001 | consulta año y periodos y navega niveles, grados y secciones en móvil | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-002 | valida crea edita y desactiva una asignatura de prueba conservando su historial | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-003 | valida fechas y cierra únicamente un año de prueba sin cambiar el actual | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-004 | permite consulta académica docente sin controles de gestión | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-005 | docente registra asistencia y cierra la sesión sin edición posterior | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-006 | apoderado vinculado envía justificación con archivo privado y consulta historial | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-007 | Secretaría revisa y aprueba y el estudiante y apoderado consultan Justificada | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-008 | redirige al login cuando no hay sesión | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-009 | rechaza credenciales incorrectas | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-010 | muestra identidad, sesión persistente y dashboard de administrator | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-011 | muestra identidad, sesión persistente y dashboard de secretary | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-012 | muestra identidad, sesión persistente y dashboard de treasury | Fallido por infraestructura o sincronización | Fallo historico; defecto funcional no confirmado |
| CY39-013 | muestra identidad, sesión persistente y dashboard de teacher | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-014 | muestra identidad, sesión persistente y dashboard de student | Fallido por infraestructura o sincronización | Fallo historico; defecto funcional no confirmado |
| CY39-015 | muestra identidad, sesión persistente y dashboard de guardian | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-016 | rechaza login sin token CSRF | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-017 | el docente crea y publica unidad y archivo, luego archiva conservando el historial | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-018 | el estudiante aprobado consulta publicados y descarga el archivo privado sin gestión | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-019 | oculta borradores por URL y niega contenido a estudiante sin matrícula aprobada | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-020 | crea asignación y curso y controla activación cierre y responsive | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-021 | muestra al docente sus cursos y roster aprobado sin controles administrativos | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-022 | permite al matriculado consultar su curso y excluye al estudiante observado | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-023 | admin consulta indicadores reales por año y abre formulario historial y cupos sin escribir datos | Aprobado | Acreditacion previa conservada, no repetida |
| CY39-024 | estudiante y apoderado consultan su alcance y no acceden a creación ni cupos | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-025 | docente no accede al centro y mantiene acceso al Aula Virtual | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-026 | completa Secretaría y Tesorería con corrección pago aprobación historial y cupos | No ejecutado por el alcance priorizado | Seleccionado pero NO INICIADO tras detener el lote; no se reintento |
| CY39-027 | permite consulta propia de estudiante y familiar sin acciones administrativas | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-028 | impide gestión y acceso a pagos al docente | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-029 | docente crea publica tarea y consulta y revisa una entrega | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-030 | estudiante entra al curso entrega archivo y consulta Mis entregas | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-031 | docente publica evaluación registra nota y el estudiante consulta su calificación | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-032 | estudiante crea corrige solicitud y Secretaría observa aprueba emite documento y completa | Fallido por infraestructura o sincronización | INTERUMPIDO a 115 s, sin resultado Cypress/JUnit final; no es una asercion fallida acreditada |
| CY39-033 | Secretaría publica por rol y usuario y el docente recibe un único comunicado | Bloqueado por operación no autorizada | DELETE sobre communication_targets fuera de autorizacion |
| CY39-034 | usuario recibe notificación en campana y marca individual y todas como leídas | Bloqueado por operación no autorizada | DELETE sobre communication_targets fuera de autorizacion |
| CY39-035 | crea consulta edita estudiantes y valida documentos y filtros | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-036 | crea y consulta un docente sin asignaciones académicas | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-037 | crea un apoderado y un estudiante aislados y gestiona su relación principal | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-038 | muestra al estudiante su perfil propio sin administración de personas | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-039 | muestra al apoderado únicamente su perfil y sus relaciones demo | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-040 | consulta dashboard administrativo y filtra y exporta un reporte CSV responsive | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-041 | muestra indicadores por rol y mantiene reportes institucionales fuera del acceso familiar | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-042 | mantiene la sesión del estudiante y navega recursos reales en PC tablet y móvil | Aprobado | Prompt45, resultado final y restauracion verificados |
| CY39-043 | ofrece al docente sus cursos y herramientas y conserva el acceso institucional | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-044 | admite administración y rechaza roles ajenos y estudiantes sin matrícula aprobada | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-045 | mantiene login claro y tema persistente en dashboard perfil y móvil | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |
| CY39-046 | muestra ficha académica y vista previa de foto sin alterar la foto existente | No ejecutado por el alcance priorizado | No seleccionado para el ultimo lote |

Distribucion: 17 aprobados, 3 incidencias de infraestructura/sincronizacion (dos fallos historicos y una interrupcion sin veredicto), 2 bloqueados por operacion y 24 no ejecutados. No se confirmo un defecto funcional reproducible nuevo. La categoria administrativa de incidencias no significa tres nuevas aserciones fallidas.

## Riesgos y limitaciones que deben acompañar la entrega

1. **Tesorería, CY39-012:** logout 204 en 3.742 ms, pero la redirección no se observó dentro de la espera original. Se conserva como fallo de infraestructura/sincronización con causa funcional no confirmada. Propuesta: observar el POST real 204 y conservar las comprobaciones de ruta y `/auth/me` 401; no se alteró el spec original.
2. **Estudiante, CY39-014:** logout 204 en 856 ms y primera redirección superada; falló el retorno a `/app` durante la recarga del frontend. No hay comprobación final concluyente de sesión en ese intento. No se demuestra con ello un bypass de autenticación; tampoco se declara resuelto.
3. **Operaciones fuera de autorización:** 38 Pest no ejecutados por sus operaciones/contratos y dos E2E de comunicaciones excluidos. Son limitaciones de validación, no 40 defectos confirmados. La ausencia de E2E real de publicación/campana debe declararse expresamente.
4. **Límites institucionales conservados:** equivalencia área/asignatura de PM-02.1 no verificada; publicación independiente de resultados y expediente longitudinal pendientes de definición institucional; protección global de borradores ante navegación SPA parcial en asistencia y comunicaciones. No se afirma que el trabajo QA resolviera esas diferencias.
5. **Entorno académico:** datos sintéticos y entorno local aislado; no se acreditan rendimiento productivo, volumen de usuarios, configuración de despliegue, entrega de correos/SMS o pagos bancarios. Los adaptadores privados no se publican con credenciales; los specs públicos no constituyen un launcher portable de ese entorno por sí solos.
6. **Cambios funcionales ajenos al lote:** siete archivos sin confirmar en `D:\zarate-saas-macro-misional` no están incorporados en la versión probada. Debe decidirse expresamente si quedan fuera de la entrega o si requieren revisión y validación antes de incluirse. No se atribuye autoría ni aprobación a esos cambios.

**Incidencia nueva de infraestructura:** CY39-032 alcanzo el limite del ejecutor (115 s, inferior a la autorizacion maxima de 120 s). Se detuvo el lote con `P41_CHILD_TIMEOUT_cypress`; no se aumento el tiempo ni se relanzo. CY39-026 no se inicio. Hay trazas parciales de SQL/HTTP, pero falta un veredicto final y la comprobacion posterior del estado sintetico. No se atribuye el timeout a un defecto del producto sin evidencia. Antes de cualquier nuevo uso del datadir, debe inspeccionarse de forma segura y, si procede, restaurarse desde el baseline autorizado; no se hace en esta intervencion tras la parada.

No se presenta el seguimiento de calidad o la trazabilidad como certificación ISO 9001. No se atribuye aprobación institucional, docente o productiva a este informe.

## Seguridad y cierre del entorno

Entorno exclusivo: `127.0.0.1:3309`, base `zarate_cypress_e2e`, UUID `386e58e7-dd3f-11f1-9f92-50ebf64eff02`, frontend `127.0.0.2:5174` y backend `127.0.0.2:8001`. Se reutilizaron el datadir, 52 tablas, 14 migraciones y fixtures sintéticos existentes; no se inicializó MySQL, aplicaron migraciones ni recrearon usuarios demo.

La autorización máxima se mantuvo en 120 segundos y se comprobó identidad/TLS, linaje, ejecutables, destinos y suspensiones. No se abrieron conexiones a `zarate_dev`, `zarate_test` o `zarate_pest`. Las restauraciones frías preservan el estado previo en cuarentena y verifican archivos, conteos, digests y relaciones; no se ejecutan DELETE/DROP/TRUNCATE para limpiar.

Se registraron 8 restauraciones frias del lote, verificadas tras los ocho casos aprobados. El ultimo snapshot restaurado es CY39-006, de 2026-11-11T23:47:19+00:00. El snapshot anterior a CY39-032 esta preservado en `cases/CY39-032/before.json`; el estado posterior al timeout queda **NO VERIFICADO**. MySQL cerro normalmente a las 18:49:42, sin cierre forzado.

La comprobacion final registra cero procesos MySQL/PHP/Node/Cypress, cero listeners en 3307/3308/3309/8000/8001/5173/5174, cero suspensiones nuevas y cero errores de lectura de eventos. Las cuatro configuraciones protegidas conservan hash y ACL. No se reiniciaron servicios tras el timeout y se conserva `run/HALTED.json`. No se compararon filas de bases protegidas ni se pretende haberlo hecho.

## Git e integración de ramas

Las seis ramas funcionales —Aula Virtual, Centro de Matrículas, Enseñanza-aprendizaje, Evaluación, Asistencia y Comunicaciones— ya están contenidas en `feature/macro-misional` y en `test/integracion-misional`. No se recomienda fusionarlas individualmente otra vez.

Refs locales revisados: `main` en `8a8f42a`, `feature/macro-misional` en `4e40a13`, `test/integracion-misional` en `1a04303`. El macro es ancestro de validación, con 20 commits exclusivos de validación; main es ancestro del macro, con 31 commits exclusivos del macro. No se hizo fetch: esto describe los refs locales, no una comprobación actual de GitHub.

El otro worktree del macro tiene seis archivos modificados y uno nuevo relacionados con errores por campo y formularios. Se inspeccionaron sin cambiarlos y sin modificar `safe.directory` global. La relación de ancestro evita divergencia actual por commits, pero esos cambios sin confirmar pueden superponerse a una integración; no se realizó una fusión de ensayo.

La [preparación de entrega GitHub](preparacion-entrega-github.md) enumera exactamente los documentos pendientes, los 44 documentos ya confirmados localmente frente al macro, los dos archivos de pruebas a conservar y las exclusiones. `.tools/`, bases, certificados privados, credenciales, perfiles, logs y cachés no deben versionarse. La caché `Microsoft/Windows/PowerShell/ModuleAnalysisCache` se conserva localmente y queda fuera de esa lista.

Los dos cambios públicos de pruebas pendientes provienen del Prompt 40: `e2e/cypress/e2e/integration.cy.ts` y `e2e/cypress/support/observeHealth.ts`. Deben revisarse y conservarse juntos; esta intervención no añadió cambios a esos archivos. Los cambios previos de `evidencias-finalizacion-migraciones.md` y todos los documentos históricos se preservan.

El cierre privado se encuentra en `.tools/cypress-e2e/evidence/prompt45/`: `result`, `checkpoint.json`, `case-catalogue.json`, `interrupted-case.json`, `environment-final.json`, `github-preparation.json` y los artefactos por caso. El checkpoint final registra 17 aprobados y 29 sin acreditar. El campo historico `result.remaining: 27` resta todos los casos terminados, incluidos dos fallidos; no equivale a pendientes sin aprobacion. La auditoria documental final registra hashes, preservacion de fuentes, aserciones y `git diff --check` sin errores.

## Acciones imprescindibles para finalizar

1. Para levantar el bloqueo técnico, disponer de una inspección segura del estado residual de CY39-032 y, si corresponde, de su restauración fría verificada. Esto requiere una intervención explícita posterior; no autoriza otro lote ni ampliar la guarda. Se conserva el datadir y el marcador de parada hasta esa revisión.
2. Aprobar el alcance académico y sus limitaciones sobre la versión exacta validada; no presentar toda la suite como aprobada. La campaña priorizada ya termina aquí, aunque no se certifique la validación integral.
3. Resolver la inclusión o exclusión de los siete cambios funcionales del otro worktree. Si se incluyen, no atribuirles las pruebas de esta versión. Puede conservarse la versión ya validada y mantener esos cambios fuera de esta entrega, sin borrarlos.
4. Revisar los archivos públicos enumerados, sus resultados y ausencia de secretos; versionar solo las rutas seleccionadas, sin `git add .`.
5. Tras una instrucción posterior, confirmar los cambios de documentación/pruebas en `test/integracion-misional`, integrar esa rama en `feature/macro-misional` y luego el macro en `main`, revalidando refs y conflictos antes de cada paso.
6. Fijar el commit de entrega, adjuntar este resumen, trazabilidad y evidencias públicas y preparar la demostración académica con las limitaciones declaradas. No adjuntar el entorno privado en bloque.

No se inicia automáticamente otro lote. Los recorridos no seleccionados y las operaciones excluidas quedan registrados, sin ocultarlos ni convertirlos en aprobados. No se hicieron commits, push, merge ni Pull Requests.
