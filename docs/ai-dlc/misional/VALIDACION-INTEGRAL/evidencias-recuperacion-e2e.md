# Prompt 42 — Recuperación y continuación E2E real

Fecha: 10/11/2026, America/Lima. Rama: test/integracion-misional. HEAD sin cambios: 1a043035c126a5bc3e5ed14cf43fdd49a4e171bf.

## Resultado

**D. BLOQUEADO POR ENTORNO O SEGURIDAD: nueva suspensión durante la ejecución.** Se recuperó y verificó la instancia existente, se acreditó el caso académico pendiente y se restauró su estado. La siguiente preparación fue cancelada por una nueva suspensión. No se declara completada la ejecución E2E autorizada.

| Indicador | Resultado |
|---|---|
| E2E aprobados anteriormente | **1**, CY39-010; no repetido |
| E2E nuevos aprobados | **1**, CY39-001, academic.cy.ts #1 |
| E2E fallidos en Prompt 42 | **0 ejecuciones completas fallidas**; una preparación cancelada sin resultado Cypress |
| E2E pendientes | **44**: 42 autorizados sin acreditar y 2 DELETE excluidos |
| Tablas MySQL | **52**, todas CHECK TABLE OK en la recuperación |
| Migraciones | **14 existentes**, ninguna repetida |
| Restauración del entorno | Recuperación inicial verificada sin necesitar restauración; restauración de CY39-001 aprobada; estado posterior a cancelación pendiente |
| TLS e identidad | Conexión real por PDO, CA/identidad verificadas, TLS_AES_256_GCM_SHA384, UUID/puerto/datadir/base/cuenta correctos |
| Suspensiones nuevas | **1 ciclo**, posterior a la referencia del preflight |
| Bases protegidas | Sin acceso SQL propio ni modificaciones; configuraciones/hash/ACL conservados |

Historial Cypress de estos casos: Prompt 41 conserva sus tres ejecuciones (una aprobada y dos fallidas); Prompt 42 agrega una ejecución completa aprobada y una cancelación. No se borra el historial ni se contabiliza la cancelación como aprobación/fallo Cypress terminado. **Acumulado: dos casos distintos aprobados con React–HTTP–Laravel–MySQL reales.** Los 141 éxitos con API simulada, el caso HTTP sin SQL y los 276 Pest/1.724 aserciones siguen siendo niveles separados; no se repitieron.

## Recuperación antes de escribir

Se leyó prompt41/recovery-after-e2e.json y se estableció una referencia nueva: **16:06:22.9654644 -05:00**. Los eventos anteriores se conservaron como históricos. El preflight no encontró MySQL/Pest/Cypress privados abandonados ni listeners ocupando los puertos revisados. El datadir existente conservaba el UUID **386e58e7-dd3f-11f1-9f92-50ebf64eff02**. No se ejecutó --initialize, bootstrap, creación de cuentas, seeders ni migraciones.

Se arrancó solo la instancia 127.0.0.1:3309 y se comprobó la cadena supervisor→monitor→worker, ejecutable/hash, fechas, PID-file y listener. Las guardas conservaron HMAC, vigencia máxima de **120 segundos**, rechazo de conexiones equivocadas, bloqueo durante transiciones y comprobación real de puerto, datadir, UUID, CURRENT_USER(), DATABASE() y cifrado antes de consultas. No se ampliaron privilegios ni se desactivó TLS.

La inspección inicial fue de lectura y precedió a cualquier restauración o prueba. Resultado:

- **52 CHECK TABLE con estado OK**; 52 tablas y 14 nombres/batches de migración existentes.
- **0 transacciones activas/incompletas** en INNODB_TRX de la instancia nueva; lectura administrativa únicamente para ese metadato, sin modificar cuentas ni permisos.
- **112 restricciones FK comprobadas**, sin huérfanos ni referencias a otras bases; foreign_key_checks activo.
- Conteos y hashes de filas de todas las tablas coincidentes con el baseline, incluidos usuarios, sesiones/tokens, auditoría y notificaciones.
- Manifiesto de archivos de storage privado también coincidente con la copia de referencia. No se leyeron valores de credenciales en salidas públicas ni se copiaron datos de otras bases.

Por esa coincidencia, **no hizo falta restaurar el estado inicial**. Se registraron antes/después y se revalidó la instancia tras un cierre/arranque controlado. No se utilizó la restauración para ocultar una inconsistencia. Evidencia: recovery/initial.json, comparison, verified.json y result. La copia fría del Prompt 41 y sus hashes siguen conservados para restauraciones posteriores; solo contienen el datadir y almacenamiento de la instancia nueva.

## Diagnóstico de suspensión

Las consultas de solo lectura powercfg y los mensajes de eventos identificaron:

- Plan **Equilibrado**; suspensión por inactividad a **600 segundos** tanto en corriente alterna como continua.
- Hibernación a **10.800 segundos**; suspensión híbrida desactivada.
- Cierre de tapa y botón de suspensión configurados para suspender.
- Varios eventos históricos describen **System Idle**; existe también historial **Button or Lid**. No debe atribuirse todo a una única causa.

La nueva suspensión del Prompt 42 se registró como **Button or Lid**: Kernel-Power 42 a las **16:16:51.6278731**, reanudación 107 a las 16:16:52.9627328 y Power-Troubleshooter 1 a las 16:16:59.9208202, todos -05:00. Son tres registros de **un ciclo**, no tres suspensiones. El campo SleepTime del evento de reanudación indica 16:16:43.9772917; se conserva esa diferencia respecto al momento de registro Kernel-Power. Los eventos no distinguen concluyentemente entre botón físico y tapa ni identifican quién lo activó.

La tarjeta MediaTek aparece como origen de reactivación; eso no demuestra que causara la suspensión. No se cambiaron planes, políticas, tapa, controladores ni servicios. Se consultó una preferencia sobre mantenimiento manual o una solicitud temporal del proceso; **no se recibió ni se asumió autorización para aplicar esa solicitud**, y no se ejecutó ninguna. Una solicitud que prevenga inactividad tampoco sustituye evitar suspensión manual/cierre de tapa.

El entorno no se mantuvo estable durante todo el lote. Por la restricción del usuario se detuvo y no se iniciaron casos adicionales tras el evento. Fuentes: power-scheme.txt, power-sleep.txt, power-buttons-hidden.txt, power-event-messages.json y new-power-events.json.

## Causa académica y corrección comprobada

El primer fallo del Prompt 41 fue una dependencia del entorno anterior: academicLogin() rellena email/contraseña, pero omite institution_code; frontend/src/pages/LoginPage.tsx:40 deja **ZARATE** como valor por defecto. La institución sintética es **E2E41**, por lo que aquel intento recibió HTTP 422 antes de autenticar correctamente. El código institucional de los fixtures no era inválido ni se demostró un defecto funcional del módulo académico.

La copia privada v2 ya preparada rellena explícitamente E2E41 tras visitar /login. En este prompt se conservó esa parametrización y se comprobó con éxito: usuario ficticio administrator@e2e.invalid, institución sintética, Origin/Sanctum/CORS exclusivos y sesión privada. No se modificaron frontend, backend, identificadores de la institución ni aserciones originales.

**CY39-001, academic.cy.ts #1: APROBADO.** Consultó año/bimestres, navegó niveles/grados/secciones y comprobó la vista móvil. El test completo y sus aserciones originales aprobaron contra React/Vite 127.0.0.2:5174 → proxy HTTP → Laravel 127.0.0.2:8001 → MySQL E2E 3309.

Evidencia de integración: **29 peticiones HTTP reales y 201 sentencias de aplicación trazadas en SQL**, sin mocks críticos. El contexto SQL conservó la base/UUID autorizados. La consulta de negocio fue de lectura; el login produjo cambios reales de users/audit_logs, por lo que no se presenta como un caso sin escrituras SQL. Después se cerraron los procesos propios, se preservó el estado en cuarentena y se restauró la copia fría; un nuevo arranque confirmó conteos, hashes y relaciones iguales al baseline. Checkpoint del caso: restorationVerified=true.

Los dos fallos previos de CY39-001 permanecen en Prompt 41: el 422 de parametrización y el reintento afectado por suspensión. Esta aprobación resuelve su estado funcional actual; no altera esas evidencias. CY39-010 no se repitió.

## Cancelación y control del supervisor

El instrumental anterior dejaba que Cypress terminara de arrancar después de HALTED. Se agregó **solo al ejecutor privado** un Windows Job Object con kill-on-close: crea el proceso Node de Cypress suspendido, lo asigna al contenedor antes de reanudar y cancela exclusivamente ese árbol si aparece HALTED o vence su tiempo. SQL/HTTP se supervisan y cierran por separado, manteniendo sus guardas. No se cambió ninguna configuración global de Windows ni se instalaron dependencias.

Al preparar **CY39-023, enrollment-center.cy.ts #1**, se detectó la nueva suspensión. El contenedor registró jobAssigned=true, haltCancellation=true, childExit=42, timeout=false y nativeError=0. No existe cypress-result.json, JUnit ni resultado final del caso cancelado, por lo que **no se cuenta como ejecución completa aprobada/fallida ni se atribuye cobertura SQL de matrícula**. Se preservaron sus logs y snapshot anterior. Su estado de filas/archivos después de cancelar no se inspeccionó ni restauró, porque la guarda obligó a parar.

Laravel/Vite propios cerraron y MySQL se detuvo mediante el evento normal de su monitor con verificación de identidad, sin SQL de cierre ni terminación forzada. final/mysql-final-stop.json y environment-final.json confirman el cierre y ausencia de procesos/listeners privados. HALTED y el datadir actual permanecen para una recuperación futura.

## Estado de candidatos por módulo

| Módulo | Candidatos | Aprobados previos | Nuevos aprobados | Fallidos completos nuevos | Pendientes sin acreditar |
|---|---:|---:|---:|---:|---:|
| Autenticación | 9 | 1 | 0 | 0 | 8 |
| Matrículas | 6 | 0 | 0 | 0 | 6 |
| Aula Virtual | 11 | 0 | 0 | 0 | 11 |
| Evaluaciones | 1 | 0 | 0 | 0 | 1 |
| Asistencia | 3 | 0 | 0 | 0 | 3 |
| Comunicaciones | 3 | 0 | 0 | 0 | 3 |
| Regresión transversal | 13 | 0 | 1 | 0 | 12 |
| **Total** | **46** | **1** | **1** | **0** | **44** |

CY39-023 está incluido entre los seis pendientes de matrículas como cancelado sin resultado. Los **dos DELETE de office #2/#3 (CY39-033/CY39-034)** siguen excluidos, aunque existan cuentas de preparación; no se concedió DELETE ni se ejecutaron esos casos. Los **38 Pest** permanecen excluidos y no se ejecutaron. No se amplió la validación a otros módulos tras la suspensión.

## Preservación y documentación

603 fuentes originales y 80 documentos existentes se verificaron antes de anexar; 13 resultados históricos Cypress y 276 JUnit Pest mantienen sus SHA-256. Los tres resultados E2E anteriores también conservan los hashes del checkpoint. Los cambios pendientes previos de Git se preservaron. No hubo modificaciones funcionales React/Laravel, migraciones, roles/permisos existentes, dependencias, commits, push, merge ni PR.

Los cuatro archivos de configuración protegidos mantienen hash y ACL. No se contactó ni se escribió en zarate_dev, zarate_test o zarate_pest, ni se detuvieron servicios demo. La preservación se basa en destinos exclusivos, guardas, trazas y comprobaciones de configuración/procesos; no se inventa una comparación de filas de bases protegidas no consultadas.

Archivos documentales de este prompt:

- prompt-42-recuperacion-e2e.md: adjunto íntegro, verificado por hash.
- evidencias-recuperacion-e2e.md: este reporte independiente.
- prompt-41-e2e-real.md y evidencias-e2e-real.md: anexos de continuidad, conservando los prefijos anteriores.

Evidencia privada en .tools/cypress-e2e/evidence/prompt42: reference.json, preflight-initial.json, diagnósticos power-*, recovery/*, cases/CY39-001/* (resultado, JUnit, HTTP/SQL, restauración), cases/CY39-023/* (cancelación), process-proofs.jsonl, new-power-events.json, final/*, environment-final.json y recovery-checkpoint.json. El instrumental privado está bajo .tools/cypress-e2e: Inspect42.php, Run42.cjs, CaseJob42.cs/.exe y adaptadores de configuración. Los originales Cypress no se modificaron.

## Próximo paso

**Checkpoint vigente: .tools/cypress-e2e/evidence/prompt42/recovery-checkpoint.json.** Conserva las aprobaciones CY39-010 y CY39-001; no repetirlas sin una regresión justificada. Próximo intento interrumpido: CY39-023. No repetir bootstrap ni las 14 migraciones.

Antes de reanudar hay que mantener el equipo sin suspensión por botón/tapa, establecer una referencia nueva y verificar primero el estado cancelado (SQL/TLS, 52 tablas/14 migraciones, transacciones, sesiones, auditoría y storage). No restaurarlo si su identidad/integridad es incierta; preservar el estado antes de cualquier copia fría autorizada. Después podrán continuarse los candidatos seguros con sus checkpoints y orden por módulos. El alcance E2E está incompleto: faltan **42 candidatos autorizados sin aprobación**, los dos DELETE siguen fuera del alcance y los 38 Pest requieren una etapa aparte. GitHub/entrega académica deben reflejar estas limitaciones; no se preparó ni publicó un PR.

## Anexo de continuidad — Prompt 43, recuperación del 11/11/2026

El historial anterior se conserva. El nuevo reporte es [evidencias-continuacion-e2e.md](evidencias-continuacion-e2e.md). El checkpoint posterior verificable es `.tools/cypress-e2e/evidence/prompt43/run-05/checkpoint.json`, acompañado de `run-05/result` y los resultados/JUnit/restauraciones de cada caso.

La recuperación inspeccionó primero los residuos del estudiante cancelado y verificó TLS, UUID, base exclusiva 3309, 52 tablas, 14 migraciones y 112 relaciones sin infracciones. Se preservó el estado y se efectuó la restauración fría autorizada, sin repetir migraciones ni bootstrap. Las restauraciones del piloto terminaron verificadas y MySQL cerró normalmente a las 10:10:50 del 11/11.

Se conservaron sin repetir los seis E2E aprobados anteriores. El piloto terminó con CY39-015 y CY39-016 aprobados, y CY39-014 fallido después de volver a `/app` tras cerrar sesión. Total: ocho aprobados distintos, dos fallidos pendientes (CY39-012 y CY39-014) y 38 candidatos sin acreditar, incluyendo los dos excluidos por DELETE. CY39-023 sigue sin aprobación. Pest y API simulada no se ejecutaron nuevamente.

El preflight GET de salud venció en 10 segundos antes de Cypress en `run-04`. En `run-05` venció el primer GET y respondió 200 el segundo, con el mismo límite. La causa sigue sin demostrarse; no se amplía el lote ni se declaran resueltos los fallos de autenticación. No hubo nuevas suspensiones durante la ejecución comprobada desde las 09:58:40; la comprobación posterior encontró los procesos y puertos privados cerrados.

Durante el cierre se reprodujo `Automatic approval review failed: {"detail":"Bad Request"}` en la herramienta de aprobación de Codex. El comando de consolidación privada no se ejecutó. No fue una respuesta Laravel, ni acredita la creación de `run-05/recovery-checkpoint.json` o `environment-final.json`. El origen del mensaje anterior del usuario sigue sin verificarse de manera independiente. No se eludió la revisión. Estado de continuidad: PARCIAL, con diagnóstico HTTP y consolidación privada pendientes. No hubo commits ni push.

## Anexo — Consolidación final del Prompt 43, 11/11/2026

La autorización posterior permitió completar exclusivamente la documentación pendiente. La revisión de herramientas funcionó y se crearon, sin sobrescribir el historial, los cuatro informes faltantes de `prompt43/run-05`: `recovery-checkpoint.json`, `http-diagnosis.json`, `diagnosis-reference.json` y `environment-final.json`. El manifiesto nuevo `consolidation-01/verification.json` conserva hashes de los resultados/JUnit y copias documentales anteriores al anexo.

Resultado confirmado: ocho aprobados distintos, dos fallidos y 38 candidatos sin acreditar, incluidos los dos DELETE excluidos. No se ejecutaron pruebas ni servicios. La consulta actual encontró cero procesos privados y cero listeners en los puertos comprobados. La restauración y TLS se acreditan mediante los artefactos históricos; no se abrió SQL para esta consolidación. Se preservaron las bases protegidas y los cambios de Git.

La consolidación documental está completada; la validación E2E sigue parcial. El [plan de diagnóstico HTTP](plan-diagnostico-rendimiento-http.md) prepara la separación entre arranque, disponibilidad y respuesta sin ampliar los diez segundos ni la guarda de 120 segundos. No se ejecutó ese plan. Véase el nuevo anexo de [evidencias-continuacion-e2e.md](evidencias-continuacion-e2e.md).
