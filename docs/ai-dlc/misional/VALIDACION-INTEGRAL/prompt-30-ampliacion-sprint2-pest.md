# PROMPT 30 — AMPLIACIÓN CONTROLADA DE PEST: CATÁLOGOS, PERMISOS Y AISLAMIENTO

Actúa como ingeniero senior de QA, Laravel 13, PHP 8.4, MySQL 8.4, Pest y seguridad multiinstitucional.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa desde el cierre aprobado del Prompt 29. No comiences desde cero, no descartes cambios y no repitas innecesariamente los casos ya acreditados.**

## 1. ESTADO CONFIRMADO

El Prompt 29 finalizó con:

**A. PROMPT 29 COMPLETADO — OCHO CASOS APROBADOS.**

Resultados acumulados:

- 16 pruebas Pest distintas aprobadas.
- 103 aserciones en ejecuciones aprobadas.
- 298 casos pendientes de ejecutar.
- 52 tablas y 14 migraciones verificadas.
- Cero residuos persistentes después de rollback.
- TLS e identidad MySQL verificados.
- Acceso rechazado a las bases protegidas.
- Sin modificaciones funcionales ni cambios en migraciones.
- Sin commits ni push.

La autorización de 120 segundos se conserva. Su expiración anterior no tiene causa confirmada, aunque no reapareció durante la última ejecución.

## 2. OBJETIVO PRINCIPAL

Ampliar de manera controlada las pruebas existentes de `Sprint2Test`, priorizando catálogos académicos, permisos, relaciones y aislamiento institucional.

Seleccionar inicialmente **entre 12 y 20 casos adicionales distintos**, siempre que el análisis previo confirme que son compatibles con la infraestructura actual.

No inventar pruebas nuevas para alcanzar la cantidad solicitada.

Si existen menos casos seguros, ejecutar únicamente los compatibles.

No ejecutar todavía la suite Pest completa.

## 3. FASE A — RECUPERAR EL ENTORNO

1. Confirmar rama actual y estado de Git.
2. Leer las evidencias de los Prompts 27, 28 y 29.
3. Inspeccionar los scripts privados del launcher.
4. Identificar los últimos wrappers aprobados en `prompt29b` y `prompt29c`.
5. Conservar las métricas y las pruebas negativas de las guardas.
6. Confirmar que ningún proceso MySQL aislado anterior permanece ejecutándose.
7. Verificar el estado de `zarate_pest`.
8. Confirmar 14 migraciones y 52 tablas.
9. Revisar los resultados JUnit de los 16 casos acreditados.
10. Comprobar que no existen residuos de fixtures.

No modificar archivos anteriores sin identificar primero su función.

## 4. FASE B — INVENTARIO DE CASOS PENDIENTES

Analizar `Sprint2Test` e identificar los casos todavía no acreditados.

Clasificarlos por:

- Catálogos académicos.
- Periodos y reglas de cierre.
- Niveles, grados y secciones.
- Áreas y aulas.
- Roles y permisos.
- Aislamiento institucional.
- Relaciones y dependencias académicas.

Determinar cuáles son compatibles con:

- `DatabaseTransactions`.
- Fixtures sintéticos.
- Rollback controlado.
- Operaciones INSERT, SELECT y UPDATE.

Separar los que requieren:

- DELETE.
- DDL.
- TRUNCATE.
- Reconstrucción de tablas.
- Seeders de demostración.
- Conexiones externas.
- Operaciones que no pueden revertirse de forma segura.

Mantener bloqueados los casos incompatibles.

## 5. FASE C — PREPARAR EL LOTE

Seleccionar entre 12 y 20 casos nuevos, siempre que todos cumplan los controles establecidos.

Para cada caso:

1. Registrar nombre original y archivo.
2. Comprobar que no fue acreditado previamente.
3. Revisar fixtures.
4. Revisar operaciones de escritura.
5. Revisar hooks y transacciones.
6. Confirmar que no necesita operaciones prohibidas.
7. Verificar que el filtro ejecuta exactamente el caso esperado.
8. Conservar intactas sus aserciones.

Preparar únicamente las adaptaciones privadas del launcher y del contrato de conexión ya autorizadas.

No alterar la lógica de las pruebas para facilitar su aprobación.

## 6. FASE D — SEGURIDAD OBLIGATORIA

La ejecución utilizará exclusivamente:

- MySQL aislado en `127.0.0.1:3308`.
- Base `zarate_pest`.
- Cuenta MySQL exclusiva.
- TLS obligatorio.
- Laravel en entorno `testing`.

Antes de cada caso, verificar la identidad efectiva de conexión.

Mantener protegidas:

- `zarate_dev`.
- `zarate_test`.

Conservar la guarda de 120 segundos.

Realizar las verificaciones preparatorias antes de emitir la autorización operativa, cuando el diseño de seguridad lo permita.

No renovar una autorización dentro de una transacción activa.

Si vence una autorización, detener la ejecución y comprobar rollback y residuos.

No ampliar privilegios ni desactivar controles para conseguir más pruebas aprobadas.

## 7. FASE E — EJECUCIÓN PROGRESIVA

Ejecutar los casos secuencialmente, inicialmente en grupos pequeños de 3 a 5.

Después de cada caso:

1. Registrar resultado Pest.
2. Registrar aserciones.
3. Confirmar rollback.
4. Verificar que no quedan residuos.
5. Verificar integridad del esquema.
6. Conservar evidencia JUnit.
7. Registrar duración y consumo de vigencia de autorización.
8. Confirmar aislamiento de bases protegidas.

Solo ampliar el siguiente grupo si las verificaciones anteriores aprueban.

Si aparece un fallo:

- Identificar si corresponde a entorno, fixtures o funcionalidad.
- Conservar los logs.
- Evitar reintentos automáticos.
- No ocultar errores modificando aserciones.
- Detenerse si existe riesgo para la integridad de las bases.

Las reejecuciones no deben contarse como casos distintos nuevos.

## 8. FASE F — REVISIÓN DE REGRESIÓN

Cuando termine el lote:

- Comparar esquema y datos persistentes con el estado inicial.
- Confirmar las 52 tablas.
- Confirmar las 14 migraciones.
- Verificar ausencia de residuos.
- Comprobar TLS.
- Ejecutar pruebas negativas de seguridad.
- Verificar que los datos protegidos permanecen fuera del alcance.
- Consolidar únicamente resultados finales demostrados.

No sumar aserciones de ejecuciones repetidas al acumulado de casos distintos.

## 9. FASE G — PLAN PARA ACELERAR LA VALIDACIÓN

Una vez comprobado el comportamiento del lote, evaluar si los siguientes grupos pueden ejecutarse con mayor tamaño sin disminuir las verificaciones.

Preparar un inventario de las 298 pruebas pendientes que distinga:

1. Compatibles con el launcher actual.
2. Compatibles después de ajustes de fixtures.
3. Dependientes de DELETE o limpieza especial.
4. Dependientes de seeders.
5. Dependientes de efectos externos.
6. Bloqueadas por otras causas.

Recomendar un orden de ejecución que permita avanzar por módulos de forma eficiente.

No ejecutar las pruebas incompatibles durante esta intervención.

## 10. RESTRICCIONES

No ejecutar:

- DELETE, DROP o TRUNCATE.
- DDL.
- `migrate:fresh`.
- `migrate:rollback`.
- `db:wipe`.
- Seeders demo.
- Cypress.
- La suite completa de 314 casos.

No modificar:

- `zarate_dev`.
- `zarate_test`.
- Las migraciones originales.
- Los privilegios MySQL.
- Credenciales existentes.
- Código funcional de EcoAula, salvo autorización posterior explícita.

No realizar commits ni push.

No publicar información sensible.

## 11. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-30-ampliacion-sprint2-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ampliacion-sprint2-pest.md`

Registrar:

- Estado inicial.
- Casos seleccionados.
- Riesgos descartados.
- Resultado individual de cada prueba.
- Aserciones.
- Duraciones.
- Rollback.
- Verificaciones de seguridad.
- Errores e incidencias.
- Cambios en el launcher.
- Estado final SQL.
- Archivos modificados.
- Estado Git.
- Plan de ampliación.

Conservar el historial previo.

## 12. INFORME FINAL

Entregar:

| Indicador | Resultado real |
|---|---|
| Casos nuevos seleccionados | Número |
| Casos nuevos ejecutados | Número |
| Casos nuevos aprobados | Número |
| Casos fallidos | Número |
| Casos bloqueados | Número |
| Nuevas aserciones aprobadas | Número |
| Acumulado de casos distintos aprobados | Número |
| Acumulado de aserciones acreditadas | Número |
| Casos pendientes del inventario | Número |
| Estado de rollback | Resultado |
| Estado de seguridad | Resultado |
| Estado de las 52 tablas | Resultado |

Clasificar:

**A. LOTE AMPLIADO APROBADO.**

**B. LOTE PARCIAL — INCIDENCIAS DETECTADAS.**

**C. LOTE LIMITADO POR FIXTURES.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

Al finalizar, indicar qué conjunto de pruebas conviene ejecutar después y cuáles requieren adaptar las restricciones de manera explícita.

**Objetivo final: ampliar la cobertura real de Pest de forma progresiva, sin comprometer las bases protegidas ni perder los resultados anteriores.**