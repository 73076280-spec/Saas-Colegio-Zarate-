# PROMPT 43 — ESTABILIZACIÓN DEL ENTORNO Y CONTINUACIÓN DE CYPRESS E2E

Actúa como ingeniero senior de QA especializado en React 19, Laravel 13, MySQL 8.4, Cypress y recuperación segura de pruebas.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## OBJETIVO

Continuar desde el Prompt 42, recuperar el estado SQL posterior a la suspensión y ejecutar los casos E2E reales pendientes que sean seguros.

No repetir instalaciones, migraciones, fixtures innecesarios ni pruebas ya acreditadas.

## ESTADO CONFIRMADO

- MySQL E2E exclusivo: puerto 3309.
- Base: `zarate_cypress_e2e`.
- 52 tablas y 14 migraciones.
- TLS e identidad verificados anteriormente.
- Dos casos E2E distintos aprobados: `CY39-010` y `CY39-001`.
- 44 casos pendientes, incluidos dos excluidos por DELETE.
- `CY39-023` fue cancelado, sin resultado definitivo.
- Última suspensión: 16:16:51, motivo `Button or Lid`.
- Restauración del último intento cancelado pendiente de verificar.
- 276 casos Pest aprobados anteriormente.
- 141 casos Cypress con API simulada conservados.
- Sin modificaciones funcionales, commits ni push.

Checkpoint:

`.tools/cypress-e2e/evidence/prompt42/recovery-checkpoint.json`

## FASE 1 — DIAGNÓSTICO DE ESTABILIDAD

Antes de arrancar MySQL:

1. Leer checkpoint y evidencias anteriores.
2. Confirmar rama y estado de Git.
3. Comprobar procesos y puertos.
4. Examinar los eventos recientes de suspensión.
5. Comprobar en modo lectura la configuración efectiva de energía.
6. Identificar si existe evidencia que distinga cierre de tapa y pulsación de botón.
7. Confirmar que Windows permanece estable desde el inicio del nuevo preflight.
8. Revisar el funcionamiento del monitor y worker de seguridad.

No modificar automáticamente la configuración de energía.

No desactivar las guardas ni ampliar su autorización de 120 segundos.

Si existen nuevas suspensiones o la estabilidad sigue siendo insuficiente, detenerse y documentarlo.

## FASE 2 — RECUPERACIÓN MYSQL

Usar únicamente el datadir E2E existente.

Prohibido volver a ejecutar `mysqld --initialize`.

Verificar:

- Instancia exclusiva 3309.
- UUID y directorio autorizados.
- TLS real.
- Identidad efectiva.
- Base `zarate_cypress_e2e`.
- 52 tablas.
- 14 migraciones.
- Estado posterior al caso cancelado `CY39-023`.
- Sesiones, tokens, auditoría y residuos.
- Protección de las bases existentes.

Inspeccionar primero sin modificar datos.

Si hay residuos y la identidad del entorno es inequívoca, aplicar únicamente la restauración fría previamente autorizada para la base E2E.

Registrar evidencia del estado anterior y posterior.

Si la restauración no puede verificarse, no ejecutar nuevos casos.

## FASE 3 — REANUDAR CYPRESS

Con el entorno estable y restaurado:

1. Recuperar los 44 casos pendientes.
2. Excluir `CY39-010` y `CY39-001` porque ya aprobaron.
3. Mantener excluidos los dos casos DELETE sobre `communication_targets`.
4. Revisar el resultado incompleto de `CY39-023`.
5. Ejecutar primero un grupo piloto pequeño de pruebas seguras.
6. Confirmar HTTP real, Laravel real y MySQL E2E real.
7. Verificar restauración y cero residuos.
8. Registrar JUnit, reportes Cypress y checkpoint.

Si el piloto aprueba, continuar automáticamente con los demás casos autorizados, de manera secuencial, sin necesidad de un nuevo prompt por módulo.

Orden:

- Autenticación.
- Matrículas.
- Aula Virtual.
- Evaluaciones.
- Asistencia.
- Comunicaciones.
- Regresión transversal.

No utilizar mocks para acreditar pruebas E2E reales.

No cambiar código funcional ni aserciones originales.

## FASE 4 — CHECKPOINT POR CASO

Después de cada prueba:

- Registrar caso exacto.
- Registrar resultado.
- Confirmar interacción HTTP y SQL.
- Comprobar restauración.
- Confirmar identidad y TLS.
- Verificar ausencia de residuos.
- Revisar suspensiones posteriores al preflight.
- Actualizar el próximo caso pendiente.

Si se detecta una nueva suspensión, detener inmediatamente el siguiente trabajo y verificar el estado de la operación interrumpida.

No repetir automáticamente escrituras de resultado incierto.

## RESTRICCIONES

Mantener protegidas:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.
- Servicios de demostración.
- Código funcional React/Laravel.
- Migraciones originales.

No ejecutar los 38 Pest excluidos.

No ejecutar los dos casos Cypress DELETE excluidos.

No aumentar privilegios ni desactivar TLS.

No modificar configuración global de Windows.

No realizar commits ni push.

## DOCUMENTACIÓN

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-43-continuacion-e2e.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-continuacion-e2e.md`

Actualizar por anexos las evidencias del Prompt 42.

Registrar resultados, restauraciones, incidencias, suspensión de Windows, controles de seguridad y progreso real por módulo.

## INFORME FINAL

Entregar:

| Indicador | Resultado |
|---|---|
| Casos E2E aprobados acumulados | Real |
| Nuevos casos aprobados | Real |
| Fallidos | Real |
| Cancelados | Real |
| Pendientes | Real |
| Bloqueados por operaciones | Real |
| Restauraciones verificadas | Real |
| Suspensiones nuevas | Real |
| TLS e identidad | Resultado |
| Bases protegidas | Estado |

Indicar el estado final de `CY39-023` y los siguientes casos pendientes.

Clasificar:

A. E2E AUTORIZADO COMPLETADO.

B. E2E PARCIAL CON AVANCES.

C. DEFECTOS FUNCIONALES DETECTADOS.

D. BLOQUEADO POR ENTORNO O SEGURIDAD.

**Objetivo: continuar los casos E2E seguros de EcoAula SaaS, sin repetir trabajo ni comprometer la integridad de los datos.**