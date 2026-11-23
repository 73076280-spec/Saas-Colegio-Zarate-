# PROMPT MAESTRO 47 — CIERRE TOTAL DE PEST Y CYPRESS E2E DE ECOAULA SAAS

Actúa como arquitecto senior de software, ingeniero principal de QA, especialista en Laravel 13, PHP 8.4, React 19, TypeScript, MySQL 8.4, Pest, Cypress, seguridad, automatización y DevOps.

**Proyecto:** `D:\zarate-saas`

**Rama actual esperada:** `test/integracion-misional`

## INSTRUCCIÓN PRINCIPAL

Quiero completar definitivamente la campaña de pruebas de EcoAula SaaS.

No quiero continuar con decenas de prompts pequeños ni repetir innecesariamente diagnósticos ya resueltos.

**Tu objetivo es alcanzar, si técnicamente es posible y sin alterar la veracidad de los resultados:**

- PEST: 314 de 314 casos aprobados.
- CYPRESS E2E REAL: 46 de 46 casos aprobados.

Debes trabajar de forma continua, planificada y automatizada, con checkpoints verificables.

No debes detenerte artificialmente al terminar un módulo ni solicitar un nuevo prompt para cada grupo de pruebas.

Sin embargo, no debes inventar aprobaciones, debilitar aserciones, ocultar defectos ni poner en riesgo los datos existentes para alcanzar estas cifras.

## 1. ESTADO INICIAL ACREDITADO

Los Prompts 1–45 contienen todo el trabajo anterior.

### Pest

- 314 casos inventariados.
- 276 aprobados.
- 1.724 aserciones acreditadas.
- 38 casos pendientes por restricciones de operaciones o contratos de prueba.

### Cypress

- 188 casos inventariados originalmente.
- 141 pruebas aprobadas con API simulada.
- Prueba HTTP de salud original corregida y validada.
- 46 casos seleccionados para validación E2E real.
- 17 casos E2E reales aprobados.
- 29 casos E2E todavía sin acreditar.
- Dos fallos históricos de sincronización relacionados con Tesorería y Estudiante.

### Infraestructura

- Laravel, React y MySQL reales.
- MySQL Pest aislado en 3308.
- MySQL E2E aislado en 3309.
- 14 migraciones y 52 tablas.
- TLS, identidad, restauración y guardas previamente validados.
- Autorización temporal de 120 segundos.
- Optimización del verificador nativo Windows.
- Preparación separada de Laravel y OPcache privado.
- Evidencias AI-DLC conservadas.
- Sin commits ni push recientes.

### Última incidencia

El caso `CY39-032` quedó interrumpido sin restauración final acreditada durante el Prompt 45.

También existen siete archivos funcionales pendientes de revisión en otro worktree.

No asumir que el entorno está restaurado ni integrar automáticamente esos siete archivos.

## 2. AUTORIZACIÓN PARA INFRAESTRUCTURA DESCARTABLE

Autorizo exclusivamente crear una NUEVA instancia MySQL local y descartable para completar las pruebas que requieren operaciones previamente restringidas.

Condiciones:

- Directorio de datos nuevo, separado de todos los existentes.
- Puerto local libre, preferentemente 3310.
- Servidor enlazado únicamente a 127.0.0.1.
- TLS obligatorio.
- Bases nuevas y exclusivas para QA final.
- Usuarios exclusivos con privilegios limitados a dichas bases.
- Datos completamente sintéticos.
- Migraciones originales aplicadas únicamente en las bases nuevas.
- Restauración reproducible mediante baseline propio.

Dentro de esta nueva infraestructura, autorizo las operaciones SQL necesarias para probar los comportamientos originales, incluyendo INSERT, UPDATE y DELETE, siempre que operen exclusivamente sobre datos sintéticos de las bases descartables recién creadas.

Las operaciones DDL se autorizan exclusivamente para preparar y restaurar el esquema de estas bases nuevas, después de verificar su identidad.

Esta autorización NO alcanza ninguna base, instancia, cuenta, archivo o servicio preexistente.

Queda terminantemente prohibido ejecutar operaciones destructivas sobre:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.
- `zarate_cypress_e2e`.
- Cualquier otra base preexistente.

No utilizar datos personales reales.

No ampliar permisos sobre instancias existentes.

No ejecutar operaciones destructivas si la identidad del servidor o del destino no puede demostrarse inequívocamente.

Si no puede construirse una infraestructura descartable con esas garantías, mantener bloqueadas las operaciones correspondientes y documentar el motivo.

## 3. FASE 0 — RECUPERACIÓN SEGURA

Antes de ejecutar pruebas:

1. Confirmar rama, worktrees y estado de Git.
2. Leer el resumen final del Prompt 45.
3. Recuperar checkpoints Pest y Cypress.
4. Confirmar los 276 Pest y 17 E2E distintos acreditados.
5. Inspeccionar el estado posterior a `CY39-032`.
6. Comprobar procesos MySQL, PHP, Node y Cypress.
7. Confirmar las identidades de las instancias protegidas.
8. Verificar los eventos recientes de suspensión de Windows.
9. Preservar íntegramente las evidencias anteriores.
10. Comprobar los archivos y directorios afectados antes de realizar escrituras.

Si existen residuos de `CY39-032`, conservar la evidencia y aplicar únicamente la restauración fría previamente autorizada sobre `zarate_cypress_e2e`, después de verificar su identidad y destino.

No repetir bootstrap, inicialización ni migraciones sobre instancias existentes.

La recuperación debe terminar con un estado verificable y seguro.

## 4. FASE 1 — INVENTARIO DE TODOS LOS CASOS RESTANTES

Crear un inventario definitivo de los 67 casos pendientes de acreditación:

- 38 Pest.
- 29 Cypress E2E.

Para cada caso registrar:

- Identificador original.
- Archivo.
- Dataset.
- Módulo.
- Operaciones ejecutadas.
- Dependencias.
- Fixtures.
- Motivo histórico de bloqueo o fallo.
- Requisitos de aislamiento.
- Posibilidad de ejecutarlo sobre la nueva infraestructura descartable.
- Estado actual.

No modificar aserciones para facilitar la ejecución.

No duplicar los casos acreditados.

Identificar expresamente qué pruebas contienen DELETE, forceDelete, sincronización destructiva, manejo de archivos o limpieza de datos.

## 5. FASE 2 — COMPLETAR LOS 38 PEST PENDIENTES

Preparar un entorno Pest totalmente aislado en la nueva infraestructura descartable.

Debe utilizar el código real de Laravel y las aserciones originales.

Revisar los 38 casos y resolver las limitaciones de los contratos de prueba mediante:

- Fixtures sintéticos.
- Conexiones aisladas.
- Permisos exclusivos de la nueva base.
- Manejo seguro de DELETE dentro de la base descartable.
- Almacenamiento temporal privado.
- Verificación de efectos secundarios.
- Restauración reproducible.

Ejecutar secuencialmente.

Verificar después de cada caso:

1. Resultado Pest.
2. Aserciones originales.
3. Estado SQL.
4. Ausencia de efectos externos no autorizados.
5. Identidad efectiva del servidor.
6. Restauración.
7. Checkpoint.

Si un caso presenta un defecto funcional auténtico, conservarlo y documentar cómo reproducirlo.

No alterar el resultado esperado para obtener una aprobación.

Si es un defecto del instrumental privado, corregirlo de forma mínima y volver a verificar.

No modificar automáticamente el código funcional de EcoAula sin autorización adicional.

### Resultado esperado de esta fase

Intentar acreditar los 38 casos restantes y alcanzar 314/314 casos Pest distintos.

No declarar éxito si persisten fallos o bloqueos.

## 6. FASE 3 — COMPLETAR LOS 29 CYPRESS E2E PENDIENTES

Utilizar React real, Laravel real y MySQL real en una infraestructura HTTP aislada, conectada exclusivamente a la base descartable autorizada para esta fase.

No utilizar mocks de respuestas críticas para acreditar E2E.

Priorizar:

1. Autenticación y permisos.
2. Matrículas.
3. Aula Virtual.
4. Tareas y entregas.
5. Evaluaciones y calificaciones.
6. Asistencia y justificaciones.
7. Comunicaciones y notificaciones.
8. Regresión transversal.

Incluir los casos históricamente excluidos por DELETE de `communication_targets`, pero ejecutarlos únicamente sobre la nueva base descartable.

Investigar y resolver los problemas de sincronización de Tesorería y Estudiante, sin desactivar aserciones.

Conservar el historial de fallos.

Si se confirma que la prueba espera un evento antes de finalizar una respuesta HTTP real, permitir una corrección mínima del instrumental o sincronización de prueba que mantenga todas las comprobaciones funcionales.

No utilizar esperas arbitrarias para esconder lentitud.

Si se comprueba un defecto funcional real, documentarlo antes de cualquier corrección.

No modificar automáticamente código funcional de producción.

### Ejecución

Para cada caso:

- Preparar los datos sintéticos.
- Verificar el backend y frontend correctos.
- Confirmar la conexión SQL real.
- Ejecutar Cypress.
- Registrar las aserciones.
- Guardar capturas y logs pertinentes.
- Comprobar la restauración.
- Verificar la ausencia de residuos.
- Guardar checkpoint.

Continuar automáticamente entre módulos cuando todas las condiciones de seguridad estén satisfechas.

### Resultado esperado de esta fase

Intentar acreditar los 29 casos restantes para alcanzar 46/46 Cypress E2E reales.

## 7. FASE 4 — CONTROL DE DEFECTOS Y CORRECCIONES

Si aparecen fallos, clasificarlos como:

A. Defecto de instrumental.

B. Error de fixture o datos sintéticos.

C. Error de configuración.

D. Problema de sincronización.

E. Defecto funcional real.

F. Bloqueo de infraestructura o seguridad.

Para A, B, C y D, corregir únicamente el entorno privado de pruebas cuando la corrección esté demostrada, sea segura y conserve las aserciones.

Para E, entregar el diagnóstico técnico y la corrección funcional propuesta. Solicitar autorización antes de alterar código funcional.

No convertir una prueba fallida en aprobada mediante:

- Eliminación de aserciones.
- Modificación de respuestas esperadas sin justificación.
- Mocks engañosos.
- Omisión de funcionalidades.
- Cambios artificiales de datos.
- Desactivación de validaciones.
- Manipulación de reportes.

Conservar evidencia antes y después de cada corrección.

## 8. FASE 5 — REGRESIÓN FINAL

Si todos los casos pendientes aprueban:

1. Consolidar los resultados individuales.
2. Verificar que no existen duplicidades.
3. Confirmar que los casos acreditados corresponden a una versión identificable del código.
4. Ejecutar una regresión final controlada en entornos descartables para detectar incompatibilidades introducidas por correcciones.
5. Verificar los 314 casos Pest.
6. Verificar los 46 casos E2E reales.
7. Confirmar que las aserciones originales mantienen su significado.
8. Verificar restauración y seguridad.
9. Registrar las versiones de código y pruebas.
10. Consolidar todos los reportes.

La ejecución puede organizarse en lotes secuenciales con checkpoints, sin comprometer la integridad.

Si algún caso de regresión falla, no declarar el 100 %.

## 9. RESTRICCIONES GENERALES

- Mantener la autorización temporal máxima de 120 segundos.
- No reutilizar una autorización vencida.
- No desactivar TLS.
- No debilitar verificaciones de identidad.
- No ejecutar pruebas en paralelo.
- No modificar servicios de demostración.
- No tocar datos reales.
- No aplicar comandos destructivos sobre bases preexistentes.
- No modificar configuraciones globales de Windows.
- No reinicializar directorios MySQL existentes.
- No integrar automáticamente los siete archivos funcionales pendientes de otro worktree.
- No realizar commits, push ni merges automáticamente.
- No publicar secretos, contraseñas, certificados privados ni directorios `.tools`.

Si Windows se suspende, detener las escrituras, conservar evidencia y recuperar el estado antes de continuar.

Si la sesión de Codex se interrumpe por límite de uso, conservar un checkpoint que permita continuar exactamente desde el último caso verificado.

## 10. DOCUMENTACIÓN FINAL AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-47-cierre-total-pruebas.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-total-pruebas.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/matriz-final-pest-cypress.md`

Registrar:

- Inventario inicial.
- Estado de los 67 casos pendientes.
- Infraestructura descartable.
- Operaciones autorizadas.
- Resultados Pest.
- Resultados Cypress.
- Defectos detectados.
- Correcciones aplicadas.
- Regresión final.
- Aserciones.
- Evidencias JUnit y Cypress.
- Checkpoints.
- Restauración.
- Seguridad.
- Estado de las bases.
- Archivos modificados.
- Estado de Git.
- Limitaciones y pendientes.

No sobrescribir informes anteriores.

## 11. INFORME FINAL OBLIGATORIO

Presentar:

| Pruebas | Aprobadas | Total | Porcentaje |
|---|---|---|---|
| Pest | Resultado real | 314 | Calculado |
| Cypress E2E real | Resultado real | 46 | Calculado |
| Cypress con API simulada | Resultado real | 141 históricas | Separado |

Además, informar:

1. Cuántos casos nuevos se acreditaron.
2. Cuántas aserciones aprobaron.
3. Si existen fallos funcionales.
4. Si quedaron pruebas bloqueadas.
5. Si se completó la regresión final.
6. Si las bases protegidas permanecieron intactas.
7. Si los entornos descartables quedaron correctamente cerrados.
8. Si quedaron cambios funcionales pendientes de autorización.
9. Qué evidencias deben incorporarse al informe académico.
10. Si la campaña puede considerarse finalizada.

Clasificar el resultado como:

**A. VALIDACIÓN TOTAL COMPLETADA — 314/314 PEST Y 46/46 CYPRESS E2E.**

**B. VALIDACIÓN AMPLIADA — FALTAN CASOS O REGRESIONES.**

**C. DEFECTOS FUNCIONALES QUE REQUIEREN CORRECCIÓN AUTORIZADA.**

**D. BLOQUEADO POR INFRAESTRUCTURA O SEGURIDAD.**

## 12. CRITERIO DE FINALIZACIÓN

Trabaja automáticamente hasta que:

- Se completen todas las pruebas autorizadas; o
- Exista un bloqueo real que requiera autorización adicional; o
- Aparezca un defecto funcional que no puedas corregir dentro del alcance permitido; o
- Se pierda la seguridad o integridad del entorno; o
- Se alcance un límite de ejecución de Codex.

No te detengas simplemente porque terminó un lote.

No declares el 100 % sin las evidencias correspondientes.

**OBJETIVO FINAL: TERMINAR EN UNA SOLA CAMPAÑA COORDINADA TODAS LAS PRUEBAS PEST Y CYPRESS E2E DE ECOAULA SAAS, SIN REHACER TRABAJO, SIN MODIFICAR DATOS EXISTENTES Y SIN FALSEAR LOS RESULTADOS.**

## Anexo — Continuación recibida tras pérdida de Internet

# CONTINUACIÓN DEL PROMPT MAESTRO 47 — RECUPERACIÓN TRAS PÉRDIDA DE INTERNET

Actúa como ingeniero senior de QA, Laravel 13, React 19, MySQL 8.4, Pest, Cypress y recuperación segura de entornos de pruebas.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## OBJETIVO

Continuar exactamente desde el último checkpoint verificable del Prompt Maestro 47.

La sesión se interrumpió durante la compactación del contexto debido a un problema de conexión a Internet.

**No comenzar desde cero. No repetir las 314 pruebas Pest ni los 22 casos Cypress E2E acreditados.**

## 1. ESTADO REPORTADO ANTES DE LA INTERRUPCIÓN

### Pest

- 314/314 casos distintos aprobados.
- 2.057 aserciones acreditadas.
- 38 casos nuevos aprobados en el Prompt 47.
- 333 aserciones nuevas.
- Evidencias JUnit y verificaciones de baseline conservadas.
- Regresión conjunta final todavía no ejecutada.

### Cypress E2E real

- 46 casos definidos.
- 22 casos distintos aprobados acumulados.
- 24 casos pendientes de acreditar.
- Cinco casos nuevos aprobados durante el Prompt 47.
- Tesorería aprobada.
- Estudiante aprobado.
- Tres recorridos de Matrículas aprobados.
- El siguiente trabajo estaba relacionado con materiales y cursos.
- La ejecución fue interrumpida durante una compactación de contexto.
- No se ha confirmado el estado final de los procesos después de la pérdida de Internet.

### Infraestructura

- Nueva instancia MySQL descartable en puerto 3310.
- Bases `qa47pest` y `qa47e2e`.
- 14 migraciones y 52 tablas en ambas bases.
- Cuentas y permisos exclusivos.
- TLS y controles negativos verificados anteriormente.
- Fixtures sintéticos y baseline propio.
- Caché privada de Cypress.
- Sin autorización para modificar bases preexistentes.

Directorio de trabajo privado:

`.tools/qa-final47/`

Evidencias Pest conocidas:

`.tools/qa-final47/evidence/pest/run-05/`

## 2. FASE A — RECUPERACIÓN DE SOLO LECTURA

Antes de iniciar cualquier trabajo:

1. Verificar la rama y el estado de Git.
2. Leer los registros del Prompt 47.
3. Localizar los checkpoints E2E más recientes.
4. Comprobar los reportes Pest y confirmar los 314 éxitos distintos y las 2.057 aserciones.
5. Recuperar los 22 casos E2E aprobados mediante sus evidencias.
6. Identificar el último caso E2E completado.
7. Identificar si había un caso ejecutándose cuando se perdió Internet.
8. Inspeccionar procesos MySQL, PHP, Node, Cypress y supervisores relacionados.
9. Comprobar puertos, identidad de procesos y eventos de suspensión.
10. Confirmar si alguna ejecución local continuó después de la desconexión.

No iniciar un nuevo supervisor si el anterior continúa activo.

No detener procesos desconocidos.

No asumir que todos los procesos finalizaron correctamente.

## 3. FASE B — RECUPERAR MYSQL 3310

Comprobar la identidad del datadir privado existente y la integridad de las bases `qa47pest` y `qa47e2e`.

No ejecutar nuevamente `mysqld --initialize`.

No recrear las bases ni repetir migraciones.

Verificar:

- Instancia y puerto 3310.
- TLS e identidad real.
- Cuentas y privilegios efectivos.
- 52 tablas y 14 migraciones.
- Integridad referencial.
- Datos y archivos sintéticos.
- Baseline existente.
- Posibles residuos de una operación interrumpida.

Inspeccionar antes de realizar cualquier escritura.

Si existe un caso incompleto y el mecanismo de restauración está autorizado, aplicar exclusivamente la recuperación privada después de verificar inequívocamente el destino.

Comprobar que las bases preexistentes no fueron alteradas.

## 4. FASE C — CONSOLIDAR LOS RESULTADOS ANTERIORES

Confirmar:

- 314 Pest distintos aprobados.
- 2.057 aserciones Pest.
- 22 casos E2E reales distintos aprobados.
- Número real de casos E2E pendientes.

Si después de la interrupción se completó algún caso adicional, acreditarlo únicamente si posee resultado Cypress definitivo, verificación HTTP/SQL y restauración correspondiente.

No duplicar resultados.

Conservar los errores históricos y las evidencias anteriores.

## 5. FASE D — CONTINUAR CYPRESS E2E

Si el entorno está estable, la restauración está verificada y los controles de seguridad aprueban, continuar con los casos pendientes.

Priorizar el siguiente caso exacto identificado en el checkpoint, correspondiente a materiales y cursos, salvo que la evidencia demuestre que ya terminó.

Después continuar automáticamente con los demás casos E2E pendientes, incluyendo los escenarios de comunicaciones previamente excluidos, únicamente dentro de la nueva infraestructura descartable autorizada.

Para cada caso:

1. Verificar autorización vigente.
2. Confirmar React y Laravel reales.
3. Confirmar la conexión exclusiva a `qa47e2e`.
4. Ejecutar Cypress de forma secuencial.
5. Registrar aserciones y resultado.
6. Confirmar HTTP y SQL reales.
7. Verificar efectos sobre archivos.
8. Restaurar el estado sintético.
9. Comprobar baseline.
10. Guardar checkpoint.

No utilizar mocks para acreditar E2E real.

No modificar aserciones para obtener aprobaciones artificiales.

Si ocurre una suspensión, falla la restauración o se pierde el aislamiento, detenerse.

## 6. FASE E — REGRESIÓN FINAL

Cuando todos los casos E2E pendientes estén ejecutados y los defectos que requieran intervención estén resueltos:

1. Consolidar la unicidad de los 314 casos Pest.
2. Consolidar la unicidad de los 46 casos E2E.
3. Confirmar la versión exacta del código y las pruebas.
4. Ejecutar la regresión final autorizada sobre las bases descartables, manteniendo controles por caso y sin paralelismo.
5. Registrar los resultados reales y cualquier regresión.
6. Verificar las aserciones originales.
7. Confirmar la restauración.
8. Comprobar TLS, identidad y aislamiento.
9. Verificar ausencia de residuos.
10. Consolidar JUnit y evidencias Cypress.

No declarar 100 % final si no existe evidencia suficiente.

## 7. RESTRICCIONES

No modificar:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.
- `zarate_cypress_e2e`.
- Servicios de demostración.
- Configuraciones globales de Windows.
- Código funcional sin autorización específica.
- Los siete archivos funcionales pendientes de otro worktree.

Mantener la autorización temporal máxima de 120 segundos y las verificaciones de seguridad.

No realizar commits, push o merges.

No publicar secretos ni archivos privados.

No ejecutar nuevamente la preparación completa del Prompt 47.

## 8. DOCUMENTACIÓN FINAL

Continuar por anexos:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-47-cierre-total-pruebas.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-total-pruebas.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/matriz-final-pest-cypress.md`

Conservar todos los checkpoints.

Registrar la interrupción por Internet y explicar cómo se recuperó el estado.

## 9. INFORME FINAL

Entregar:

| Componente | Resultado real |
|---|---|
| Pest acreditados | Total / 314 |
| Aserciones Pest | Total |
| Regresión Pest conjunta | Ejecutada / Pendiente |
| E2E reales acreditados | Total / 46 |
| E2E nuevos aprobados | Total |
| E2E pendientes | Total |
| Fallos funcionales | Total |
| Fallos de infraestructura | Total |
| Restauración y baseline | Resultado |
| TLS e identidad | Resultado |
| Bases protegidas | Estado |
| Git | Estado |

Indicar el último caso E2E acreditado y el siguiente caso exacto si vuelve a interrumpirse la sesión.

**OBJETIVO FINAL: RECUPERAR EL PROMPT MAESTRO 47 Y COMPLETAR LOS CASOS E2E PENDIENTES Y LA REGRESIÓN FINAL, SIN REPETIR TRABAJO NI COMPROMETER LOS ENTORNOS EXISTENTES.**


## Anexo — Continuación final autorizada del 12/11/2026

# CONTINUACIÓN FINAL DEL PROMPT 47 — COMPLETAR 21 E2E Y REGRESIÓN

Actúa como ingeniero senior de QA, Laravel 13, React 19, MySQL 8.4, Pest, Cypress y seguridad de entornos descartables.

Proyecto: `D:\zarate-saas`

Rama: `test/integracion-misional`.

## OBJETIVO

Quiero terminar la campaña de pruebas de EcoAula SaaS, aprovechando todos los avances anteriores.

**No comenzar desde cero. No repetir los 314 Pest ni los 25 E2E acreditados.**

## 1. ESTADO CONFIRMADO

- Pest: 314/314 casos individuales aprobados.
- Aserciones Pest: 2.057.
- Regresión conjunta final: pendiente.
- Cypress E2E real: 25/46 aprobados.
- E2E pendientes: 21.
- Último aprobado: `CY39-019`.
- Caso interrumpido: `CY39-020`.
- Restauración posterior a CY39-020 no verificada.
- MySQL descartable: puerto 3310.
- Bases nuevas: `qa47pest` y `qa47e2e`.
- TLS, cuentas exclusivas y baseline privado preparados.
- Sin commits, push ni merges.
- Sin cambios funcionales autorizados.

Los servicios anteriores quedaron detenidos de forma controlada.

## 2. AUTORIZACIÓN DE RECUPERACIÓN

Autorizo considerar las suspensiones de las 20:13:38 y 20:26:23 como históricas, únicamente después de revisar sus evidencias y verificar el cierre seguro del entorno.

Autorizo establecer una nueva referencia temporal de seguridad para esta ejecución.

Esto NO autoriza desactivar la detección de suspensiones, ampliar la guarda de 120 segundos ni ignorar nuevas interrupciones.

Si Windows vuelve a suspenderse después de la nueva referencia, detener inmediatamente las siguientes operaciones sensibles y conservar checkpoint.

## 3. RECUPERAR CY39-020

Antes de iniciar nuevos casos:

1. Leer el último checkpoint de `.tools/qa-final47/`.
2. Confirmar los 25 E2E aprobados.
3. Identificar el estado exacto de CY39-020.
4. Comprobar procesos, puertos y eventos de energía.
5. Verificar identidad del datadir MySQL 3310.
6. Inspeccionar SQL y archivos privados.
7. Confirmar TLS y cuentas efectivas.
8. Verificar las 52 tablas y 14 migraciones de cada base nueva.
9. Conservar evidencia del estado residual previo a cualquier restauración.
10. Aplicar exclusivamente la restauración privada autorizada si resulta necesaria y segura.

No reinicializar MySQL.

No ejecutar migraciones nuevamente.

No modificar bases preexistentes.

Si no es posible verificar la restauración, detenerse sin iniciar Cypress.

## 4. CONTINUAR LOS 21 CASOS E2E

Después de comprobar el entorno:

- Reanudar desde CY39-020, si continúa pendiente y es seguro.
- Recuperar el orden exacto de los casos restantes.
- Ejecutar los casos secuencialmente.
- Conservar todas las aserciones originales.
- Usar React, Laravel, HTTP y MySQL reales.
- No utilizar respuestas simuladas para acreditar E2E.
- Verificar restauración después de cada caso.
- Guardar un checkpoint por caso.
- Mantener la autorización temporal de 120 segundos.

Continuar automáticamente con los módulos siguientes sin solicitar un nuevo prompt por cada grupo.

Si una prueba falla, clasificar el origen como defecto funcional, sincronización, fixture, instrumental o entorno.

Corregir solamente el instrumental privado cuando exista evidencia de que el cambio es equivalente y mantiene las aserciones.

No modificar código funcional sin autorización.

No repetir casos aprobados para aumentar estadísticas.

## 5. REGRESIÓN FINAL

Si los 21 casos restantes aprueban:

1. Consolidar los 314 Pest distintos.
2. Consolidar los 46 Cypress E2E distintos.
3. Identificar exactamente la revisión de código sometida a pruebas.
4. Ejecutar la regresión conjunta final en los entornos descartables autorizados.
5. Conservar los resultados originales y los nuevos.
6. Verificar ausencia de fallos.
7. Comprobar restauración después de cada ejecución.
8. Confirmar TLS, identidad y aislamiento.
9. Registrar JUnit, Cypress y aserciones.
10. Verificar que las bases protegidas permanecieron intactas.

La regresión final debe mantener las restricciones de seguridad y no debe ejecutar operaciones destructivas sobre bases preexistentes.

Si la regresión detecta un fallo, no declarar el 100 % definitivo.

## 6. RESTRICCIONES

No modificar:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.
- `zarate_cypress_e2e`.
- Servicios de demostración.
- Migraciones originales.
- Configuración global de Windows.
- Los siete archivos funcionales pendientes del otro worktree.

No ejecutar commits, push ni merges.

No publicar credenciales, certificados privados o registros sensibles.

No debilitar guardas para completar las pruebas más rápido.

## 7. DOCUMENTACIÓN FINAL

Actualizar por anexos:

- `prompt-47-cierre-total-pruebas.md`
- `evidencias-cierre-total-pruebas.md`
- `matriz-final-pest-cypress.md`

Todos dentro de `docs/ai-dlc/misional/VALIDACION-INTEGRAL/`.

Conservar los checkpoints privados y registrar los resultados exactos.

## 8. INFORME FINAL OBLIGATORIO

Entregar:

| Indicador | Resultado real |
|---|---|
| Pest acreditados | X/314 |
| Aserciones Pest | Total |
| Regresión conjunta Pest | Aprobada / Pendiente / Fallida |
| E2E acreditados | X/46 |
| E2E restantes | Total |
| Regresión conjunta E2E | Aprobada / Pendiente / Fallida |
| Incidencias funcionales | Total |
| Restauración | Verificada / No verificada |
| TLS y aislamiento | Resultado |
| Estado de Git | Resultado |

Además, responder:

1. ¿Se recuperó correctamente CY39-020?
2. ¿Aprobaron los 21 E2E restantes?
3. ¿Se completó la regresión final?
4. ¿Permanecieron protegidas las bases existentes?
5. ¿Qué falta exactamente para integrar las ramas y entregar el proyecto?

Clasificación:

A. VALIDACIÓN TOTAL COMPLETADA: 314/314 PEST Y 46/46 E2E, CON REGRESIÓN FINAL APROBADA.

B. CASOS INDIVIDUALES COMPLETADOS, REGRESIÓN PENDIENTE.

C. VALIDACIÓN PARCIAL CON INCIDENCIAS.

D. BLOQUEADO POR SEGURIDAD O INFRAESTRUCTURA.

**PRIORIDAD: FINALIZAR LOS 21 E2E PENDIENTES Y LA REGRESIÓN FINAL SIN REPETIR TRABAJO NI COMPROMETER LAS BASES EXISTENTES.**


## Anexo — Alcance de estabilidad de Windows y cierre final de QA

La continuación recibida el 12/11/2026 exige comprobar primero la configuración efectiva de energía, alimentación, tapa, procesos y checkpoint, sin modificar Windows. Permite una nueva referencia solo tras verificar el cierre anterior y condiciona la campaña a estabilidad suficiente. Mantiene la recuperación privada de MySQL 3310, los 21 casos desde CY39-020 y las regresiones finales; exige detenerse ante nuevas suspensiones y conservar la guarda de 120 segundos. Este párrafo resume el alcance de la continuación y no se presenta como transcripción literal.


## Alcance de reanudación definitiva — 12/11/2026

La continuación exige comprobar mediante powercfg suspensión automática con corriente deshabilitada y prohíbe comenzar si no lo está. Mantiene los 21 E2E desde CY39-020, las regresiones posteriores, guardas de 120 segundos y prohibición de cambios funcionales o integración Git. Este párrafo es un resumen del alcance recibido, no una transcripción literal.


## Alcance recibido — configuración de energía corregida

El usuario autoriza reanudar tras comprobar AC STANDBYIDLE e HIBERNATEIDLE en cero, recuperar CY39-020 en 3310, continuar los 21 pendientes y después ejecutar ambas regresiones finales. Mantiene TLS, guarda120s, aislamiento y parada ante suspensión o restauración fallida; no autoriza cambios de Windows, código funcional, bases existentes ni operaciones Git. Este texto resume el alcance y no es una transcripción literal.


## Alcance recibido — recuperación final sin reiniciar

La continuación requiere inspeccionar primero supervisor, sesiones, JUnit, baseline, energía y Git; si regression-02 sigue sana debe observarse sin detenerla ni duplicarla. Solo después de314Pest de regresión aprobados procede la regresión46E2E ya preparada; se mantienen correcciones privadas, guardas120s, TLS y restricciones de código/Git. Este párrafo resume el alcance y no es una transcripción literal.
