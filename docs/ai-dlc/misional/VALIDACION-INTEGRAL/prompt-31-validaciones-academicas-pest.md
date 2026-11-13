# PROMPT 31 — VALIDACIÓN PEST DE CAMPOS OBLIGATORIOS Y DUPLICADOS ACADÉMICOS

Actúa como ingeniero senior de QA, Laravel 13, MySQL 8.4, PHP 8.4 y Pest, especializado en pruebas de integración, validación de formularios y seguridad multiinstitucional.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa exactamente desde el cierre aprobado del Prompt 30. No reinicies el proyecto, no descartes modificaciones y no repitas las pruebas ya acreditadas salvo que sea necesario para regresión.**

## 1. ESTADO CONFIRMADO

El Prompt 30 finalizó con:

**A. LOTE AMPLIADO APROBADO.**

Resultados acumulados:

- 314 casos Pest descubiertos originalmente.
- 28 casos distintos aprobados.
- 207 aserciones acreditadas.
- 286 casos pendientes.
- 14/14 migraciones verificadas.
- 52 tablas en `zarate_pest`.
- 12 nuevos casos aprobados durante el Prompt 30.
- 12 rollbacks verificados.
- Cero residuos persistentes.
- TLS e identidad MySQL comprobados.
- Aislamiento de `zarate_dev` y `zarate_test` conservado.
- Guarda de autorización de 120 segundos sin modificaciones.
- Sin expiraciones durante el último lote.
- Sin cambios funcionales ni modificaciones de migraciones.
- Sin commits ni push.

Reutiliza el instrumental validado de `.tools/misional-isolated`, especialmente las evidencias de los Prompts 28, 29 y 30.

## 2. OBJETIVO

Ejecutar el siguiente conjunto de pruebas Pest existentes de Sprint 2.

Priorizar los **12 datasets de campos obligatorios y registros académicos duplicados** identificados en el inventario del Prompt 30.

El objetivo es comprobar que Laravel rechaza correctamente datos inválidos y evita duplicados según las reglas de negocio implementadas.

No inventar validaciones nuevas ni modificar aserciones para obtener resultados positivos.

## 3. FASE A — INSPECCIÓN PREVIA

Antes de ejecutar:

1. Confirmar la rama y `git status`.
2. Leer las evidencias del Prompt 30.
3. Recuperar el inventario de los casos pendientes.
4. Identificar los 12 datasets recomendados.
5. Inspeccionar los tests originales de `Sprint2Test`.
6. Revisar los fixtures y factories requeridos.
7. Comprobar que cada dataset selecciona exactamente el caso esperado.
8. Confirmar que no hayan sido acreditados anteriormente.
9. Verificar que los hooks no ejecuten operaciones prohibidas.
10. Revisar el comportamiento de transacciones y rollback.

Distinguir entre casos parametrizados, datasets y ejecuciones repetidas.

Para el acumulado, contar únicamente los casos distintos tal como los identifica el inventario de Pest; no duplicar resultados por reejecuciones.

## 4. FASE B — VALIDACIÓN DE CAMPOS OBLIGATORIOS

Seleccionar los casos existentes que evalúan las restricciones de datos en catálogos académicos.

Priorizar, según lo disponible:

- Periodos académicos.
- Niveles educativos.
- Grados.
- Secciones.
- Áreas académicas.
- Aulas.
- Relaciones entre registros académicos.

Comprobar:

1. Rechazo de campos obligatorios vacíos.
2. Rechazo de datos con formato incorrecto.
3. Validación de valores fuera de las restricciones admitidas.
4. Respuestas de validación esperadas.
5. Ausencia de registros inválidos persistentes.
6. Conservación de registros válidos preexistentes.

Utilizar únicamente los campos y las reglas que aparecen realmente en las pruebas y en el código Laravel.

No inventar límites, formatos ni restricciones.

## 5. FASE C — VALIDACIÓN DE DUPLICADOS

Ejecutar pruebas existentes sobre registros académicos duplicados.

Comprobar, cuando corresponda:

- Duplicidad de códigos institucionales.
- Duplicidad de periodos.
- Duplicidad de grados y secciones.
- Restricciones de unicidad por institución.
- Relaciones académicas duplicadas.
- Rechazo de registros que violen índices únicos.

Distinguir entre una duplicidad prohibida dentro de una institución y un mismo identificador permitido entre instituciones diferentes, cuando las reglas del proyecto lo establezcan.

Verificar los resultados mediante respuestas reales del backend y consultas controladas.

No cambiar índices ni restricciones de MySQL para hacer aprobar las pruebas.

## 6. FASE D — SEGURIDAD Y AISLAMIENTO

Ejecutar exclusivamente en:

- Host: `127.0.0.1`.
- Puerto: `3308`.
- Base: `zarate_pest`.
- Usuario exclusivo de pruebas.
- TLS obligatorio.
- Laravel en entorno `testing`.

Antes de cada ejecución:

1. Comprobar identidad efectiva de conexión.
2. Confirmar que el destino es `zarate_pest`.
3. Verificar la autorización vigente.
4. Comprobar las restricciones del launcher.
5. Mantener la guarda de 120 segundos.
6. Rechazar cualquier conexión a bases protegidas.

No modificar:

- `zarate_dev`.
- `zarate_test`.
- Credenciales existentes.
- Privilegios MySQL.
- Migraciones originales.
- Servicios de demostración en los puertos 3307, 8000 y 5173.

## 7. FASE E — EJECUCIÓN CONTROLADA

Preparar los 12 datasets, siempre que todos sean compatibles con las restricciones existentes.

Ejecutar secuencialmente en grupos de 3 a 4.

Para cada caso:

1. Verificar preflight y autorización vigente.
2. Confirmar que el filtro selecciona el caso correcto.
3. Preparar los fixtures sintéticos originales.
4. Ejecutar Pest.
5. Registrar resultado y aserciones.
6. Verificar rollback.
7. Confirmar ausencia de residuos.
8. Revisar integridad del esquema.
9. Guardar evidencia JUnit y métricas.
10. Continuar solo si las comprobaciones aprueban.

No repetir automáticamente casos que fallen.

Si aparece un defecto:

- Determinar si corresponde a fixtures, launcher o backend.
- Conservar la evidencia.
- No modificar aserciones para ocultarlo.
- No alterar reglas funcionales sin una autorización específica.
- Detener las operaciones que puedan comprometer la integridad del entorno.

Si algún dataset requiere DELETE, DDL, TRUNCATE, seeders o efectos externos, mantenerlo bloqueado y explicar el motivo.

## 8. FASE F — VERIFICACIÓN FINAL

Cuando concluya el lote:

1. Confirmar las 52 tablas.
2. Confirmar las 14 migraciones.
3. Verificar rollback de cada ejecución.
4. Comprobar cero residuos persistentes.
5. Verificar identidad y TLS.
6. Ejecutar comprobaciones negativas de aislamiento.
7. Revisar los resultados JUnit.
8. Comparar el estado persistente anterior y posterior.
9. Separar nuevas pruebas aprobadas de reejecuciones.
10. Actualizar el inventario de pruebas pendientes.

No declarar aprobados los casos no ejecutados.

## 9. FASE G — PLAN PARA ACELERAR LA REGRESIÓN

Utilizar el inventario de 286 casos pendientes del Prompt 30 para diseñar una estrategia de ejecución más eficiente.

Clasificar los casos restantes en:

- Compatibles inmediatamente con el launcher.
- Compatibles después de adaptar fixtures.
- Dependientes de DELETE.
- Dependientes de archivos privados.
- Dependientes de seeders de demostración.
- Dependientes de operaciones externas.
- Bloqueados por otras restricciones.

Proponer lotes de 20 a 40 casos únicamente cuando exista evidencia de que pueden ejecutarse con seguridad.

No ejecutarlos todavía en este prompt.

Evitar repetir diagnósticos de infraestructura que ya estén demostrados, salvo comprobaciones necesarias después de cambios o reinicios.

Conservar las guardas antes de cualquier escritura.

## 10. RESTRICCIONES

No ejecutar:

- DELETE.
- DROP.
- TRUNCATE.
- DDL.
- `migrate:fresh`.
- `migrate:rollback`.
- `db:wipe`.
- Seeders de demostración.
- Cypress.
- La suite completa de Pest.

No alterar archivos funcionales de EcoAula, migraciones originales ni permisos del usuario MySQL.

No desactivar TLS ni la guarda de autorización.

No hacer commits ni push automáticamente.

No publicar credenciales o información privada.

## 11. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-31-validaciones-academicas-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validaciones-academicas-pest.md`

Registrar:

- Estado inicial.
- Datasets seleccionados.
- Casos ejecutados y resultados.
- Aserciones aprobadas.
- Evidencias de validación negativa.
- Rollbacks.
- Comprobaciones de seguridad.
- Incidencias.
- Archivos modificados.
- Estado final SQL.
- Estado de Git.
- Inventario actualizado de casos pendientes.
- Propuesta de próximos lotes.

## 12. INFORME FINAL

Presentar una tabla con:

| Grupo | Ejecutados | Aprobados | Fallidos | Bloqueados | Aserciones |
|---|---|---|---|---|---|
| Campos obligatorios | Real | Real | Real | Real | Real |
| Duplicados académicos | Real | Real | Real | Real | Real |

Indicar adicionalmente:

1. Nuevos casos distintos aprobados.
2. Total acumulado de casos Pest aprobados.
3. Total acumulado de aserciones.
4. Casos pendientes.
5. Rollbacks verificados.
6. Resultado de seguridad y TLS.
7. Estado de las 52 tablas.
8. Defectos encontrados.
9. Correcciones realizadas, si fueron autorizadas.
10. Próximos lotes recomendados.

Clasificar:

**A. VALIDACIONES ACADÉMICAS APROBADAS.**

**B. LOTE PARCIAL — INCIDENCIAS DETECTADAS.**

**C. CASOS BLOQUEADOS POR FIXTURES O RESTRICCIONES.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

**Objetivo final: validar los campos obligatorios y la prevención de duplicados académicos mediante pruebas Pest reales, manteniendo el aislamiento y los controles de seguridad de EcoAula SaaS.**

---

Continuación autorizada del 06/11/2026. Se conserva íntegro el registro anterior.

# CONTINUACIÓN DEL PROMPT 31 — DIAGNÓSTICO DE LATENCIA Y RECUPERACIÓN DE PRUEBAS PEST

Actúa como ingeniero senior de QA, Laravel 13, PHP 8.4, MySQL 8.4, Pest, seguridad de bases de datos y diagnóstico de rendimiento.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**IMPORTANTE: No comiences desde cero. Continúa exactamente desde el último resultado parcial del Prompt 31. Se produjo una interrupción de Internet y quiero recuperar el trabajo existente sin perder modificaciones ni repetir innecesariamente operaciones.**

## 1. ESTADO REAL DEL PROMPT 31

El Prompt 31 terminó con:

**D. BLOQUEADO POR SEGURIDAD O ENTORNO — EJECUCIÓN PARCIAL.**

Resultados:

- 314 casos Pest inventariados originalmente.
- 28 casos distintos aprobados antes del Prompt 31.
- 1 caso nuevo aprobado durante el Prompt 31.
- 29 casos distintos aprobados acumulados.
- 211 aserciones acreditadas acumuladas.
- 285 casos pendientes de aprobación.
- 12 casos seleccionados para el Prompt 31.
- 2 casos intentados: 1 aprobado y 1 con error de entorno.
- 10 casos sin ejecutar.
- Ningún fallo de aserción confirmado en ese lote.
- Dos rollbacks registrados.
- 52 tablas y 14 migraciones conservadas.
- Cero residuos persistentes.
- TLS y aislamiento verificados.
- Sin modificaciones funcionales, commits ni push.

El segundo caso excedió el límite de vigencia de la autorización de 120 segundos durante la comprobación posterior al rollback.

Las atestaciones consumieron 104,97 segundos. Todavía no se conoce la causa específica de esa latencia.

## 2. OBJETIVO

Diagnosticar y resolver la latencia del supervisor y, únicamente si las comprobaciones de seguridad lo permiten, finalizar los once casos que aún no cuentan con aprobación.

**No repetir el caso que ya fue aprobado, salvo si una regresión técnica lo hace estrictamente necesario.**

No ejecutar todavía los 285 casos pendientes de toda la suite.

## 3. FASE A — RECUPERACIÓN DEL ESTADO

Antes de realizar cualquier escritura:

1. Verificar la rama actual y `git status`.
2. Conservar todos los archivos modificados y no confirmados.
3. Leer los informes completos de los Prompts 28, 29, 30 y 31.
4. Inspeccionar los scripts locales de `.tools/misional-isolated/evidence/prompt31/`.
5. Revisar los resultados JUnit, logs y métricas existentes.
6. Identificar exactamente cuál de los 12 casos aprobó.
7. Identificar el caso que terminó con error de entorno.
8. Identificar los diez casos no ejecutados.
9. Confirmar que los archivos del launcher no quedaron parcialmente escritos.
10. Comprobar si existen procesos MySQL aislados activos después de la interrupción.

No utilizar `git reset --hard`, `git clean` ni operaciones que descarten los cambios anteriores.

No reejecutar casos sin comprobar primero las evidencias conservadas.

## 4. FASE B — DIAGNÓSTICO DE LOS 104,97 SEGUNDOS

Investigar detalladamente el tiempo consumido durante las atestaciones.

Revisar:

- Tiempo de preflight.
- Inicio del servidor MySQL aislado.
- Conexión efectiva y negociación TLS.
- Verificación de identidad y puerto.
- Comprobación de migraciones y tablas.
- Validación de hashes de archivos protegidos.
- Ejecución de fixtures.
- Inicio de transacciones.
- Ejecución real del caso Pest.
- Rollback.
- Comprobación de residuos.
- Verificación de aislamiento.
- Invocación de procesos PHP y PowerShell.
- Lectura y escritura de registros de evidencia.
- Operaciones repetidas del supervisor.
- Bloqueos, esperas de procesos y problemas de entrada/salida en disco.

Agregar métricas por fase utilizando un reloj monotónico cuando esté disponible.

Distinguir entre tiempo de CPU, espera por procesos externos y latencia de MySQL.

Comprobar si el reinicio del equipo, el antivirus, operaciones de disco o procesos duplicados pudieron influir, pero no atribuirles la causa sin evidencia.

**No suponer que el único problema es la duración de los fixtures.**

## 5. FASE C — CORRECCIÓN MÍNIMA

Si se identifica una causa demostrable de latencia, aplicar la corrección mínima al instrumental privado.

Priorizar:

1. Eliminar trabajo preparatorio innecesariamente repetido, sin eliminar verificaciones obligatorias.
2. Ejecutar comprobaciones independientes de escritura antes de obtener autorización operativa, cuando sea seguro.
3. Mantener verificaciones vigentes de identidad y TLS.
4. Evitar que tareas de documentación o procesamiento de logs consuman innecesariamente la vigencia operativa.
5. Optimizar exclusivamente verificaciones redundantes cuya reutilización sea segura y demostrable.
6. Mantener los controles críticos inmediatamente antes de las operaciones sensibles.
7. Separar claramente el cierre transaccional de las verificaciones posteriores, conservando la autorización necesaria para cada operación.
8. Comprobar que una autorización vencida sigue siendo rechazada.

No ampliar el límite de 120 segundos.

No modificar el sistema de autorización para que acepte tokens vencidos.

No renovar autorizaciones dentro de una transacción activa.

No almacenar decisiones de autorización como si fueran verificaciones permanentes.

No reducir la cobertura de seguridad para acelerar las pruebas.

Si la latencia no puede solucionarse sin debilitar controles, detener la intervención e informar el motivo.

## 6. FASE D — VERIFICACIÓN DEL ENTORNO

Antes de reanudar Pest, comprobar:

- MySQL aislado en `127.0.0.1:3308`.
- Base exclusiva `zarate_pest`.
- Usuario autorizado.
- TLS obligatorio.
- Directorio físico aislado.
- Identidad efectiva de conexión.
- 52 tablas.
- 14 migraciones.
- Cero residuos de la ejecución anterior.
- Guarda de 120 segundos operativa.
- Denegación de acceso a bases protegidas.

No modificar `zarate_dev` ni `zarate_test`.

No cambiar los servicios de demostración de los puertos 3307, 8000 y 5173.

## 7. FASE E — VERIFICACIÓN DEL SUPERVISOR

Antes de ejecutar los casos pendientes:

1. Ejecutar las comprobaciones offline de seguridad.
2. Probar el rechazo de autorizaciones vencidas.
3. Verificar que las operaciones no autorizadas no se ejecutan.
4. Medir las duraciones de las fases de preparación y cierre.
5. Confirmar que se respetan los límites de autorización.
6. Confirmar que el launcher utiliza exclusivamente las pruebas seleccionadas.
7. Verificar que no se alteraron los fixtures y aserciones originales.
8. Confirmar que la infraestructura sigue ejecutando rollback correctamente.

Si falla alguna comprobación, no ejecutar Pest.

## 8. FASE F — REANUDAR EL PROMPT 31

Solo si el supervisor y las guardas aprueban:

1. Recuperar la lista original de los 12 casos.
2. Conservar el caso aprobado como evidencia acreditada.
3. Evaluar y reintentar una sola vez el caso que terminó por error de entorno, si la causa está resuelta y el estado inicial es seguro.
4. Ejecutar los diez casos que quedaron sin ejecutar.
5. Trabajar de manera secuencial.
6. Dividirlos en grupos pequeños y controlados.
7. Verificar rollback después de cada caso.
8. Confirmar ausencia de residuos.
9. Registrar duración, aserciones y resultado JUnit.
10. Detenerse ante cualquier expiración, riesgo o fallo de integridad.

Los casos continúan organizados en:

- Campos obligatorios: 6 casos originales.
- Duplicados académicos: 6 casos originales.

No modificar sus aserciones.

No inventar casos alternativos para sustituir los que fallen.

No sumar reejecuciones como pruebas nuevas.

## 9. RESTRICCIONES ABSOLUTAS

Prohibido:

- Modificar `zarate_dev` o `zarate_test`.
- Ejecutar DELETE, DROP o TRUNCATE.
- Ejecutar DDL.
- Ejecutar `migrate:fresh`, `db:wipe` o `migrate:rollback`.
- Ejecutar seeders demo.
- Modificar migraciones originales.
- Ampliar privilegios MySQL.
- Desactivar TLS.
- Debilitar las guardas.
- Modificar código funcional de EcoAula.
- Ejecutar Pest en paralelo.
- Ejecutar toda la suite.
- Ejecutar Cypress.
- Eliminar evidencias anteriores.
- Realizar commits o push automáticamente.

Mantener las credenciales y recursos privados excluidos de Git.

## 10. DOCUMENTACIÓN AI-DLC

Actualizar los documentos existentes:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-31-validaciones-academicas-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validaciones-academicas-pest.md`

Incluir:

- Recuperación después de la interrupción.
- Diagnóstico de la latencia.
- Métricas originales y nuevas.
- Causa confirmada o incertidumbre restante.
- Correcciones al supervisor.
- Resultados de seguridad.
- Casos ejecutados.
- Aserciones.
- Rollbacks.
- Estado final SQL.
- Archivos modificados.
- Estado de Git.
- Casos pendientes.

Conservar el historial del primer intento fallido.

## 11. INFORME FINAL

Presentar:

| Grupo | Total | Aprobados | Errores | Sin ejecutar | Aserciones |
|---|---|---|---|---|---|
| Campos obligatorios | 6 | Real | Real | Real | Real |
| Duplicados académicos | 6 | Real | Real | Real | Real |

Responder también:

1. ¿Qué provocó los 104,97 segundos de latencia?
2. ¿Qué se corrigió?
3. ¿La autorización permanece en 120 segundos?
4. ¿Cuántos casos aprobaron finalmente?
5. ¿Cuántos casos nuevos se acreditaron?
6. ¿Cuántas aserciones se acumularon?
7. ¿Se verificó rollback en todos los casos ejecutados?
8. ¿Se conservaron las 52 tablas y 14 migraciones?
9. ¿Las bases protegidas permanecen intactas?
10. ¿Estamos listos para ampliar los siguientes lotes Pest?

Clasificar el cierre:

**A. PROMPT 31 COMPLETADO — 12 CASOS APROBADOS.**

**B. PROMPT 31 PARCIAL — CASOS PENDIENTES.**

**C. BLOQUEADO POR LATENCIA O ENTORNO.**

**D. INCIDENCIAS FUNCIONALES DETECTADAS.**

No declarar éxito sin resultados JUnit y verificaciones reales.

**Objetivo final: completar el Prompt 31 sin perder el avance previo y sin comprometer la seguridad de EcoAula SaaS.**