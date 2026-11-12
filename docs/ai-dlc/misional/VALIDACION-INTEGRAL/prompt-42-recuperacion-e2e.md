# PROMPT 42 — RECUPERACIÓN SEGURA Y CONTINUACIÓN DE CYPRESS E2E REAL

Actúa como ingeniero senior en Laravel 13, React 19, MySQL 8.4, Cypress, seguridad SQL y recuperación de entornos de pruebas.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## OBJETIVO PRINCIPAL

Continuar desde el último checkpoint del Prompt 41, recuperar de manera segura el estado del entorno E2E y completar progresivamente los casos Cypress reales pendientes.

No comenzar desde cero. No repetir bootstrap, migraciones ni pruebas aprobadas.

## 1. ESTADO CONFIRMADO

El Prompt 41 consiguió:

- Instancia MySQL exclusiva en puerto 3309.
- Base `zarate_cypress_e2e`.
- Cuentas SQL exclusivas.
- TLS e identidad verificados.
- 14 migraciones aplicadas.
- 52 tablas creadas.
- Fixtures completamente sintéticos.
- Restauración fría validada antes de la última suspensión.
- Un caso E2E real aprobado: `CY39-010`.
- 22 peticiones HTTP y 169 consultas SQL reales en el caso aprobado.
- Tres ejecuciones Cypress: una aprobada y dos fallidas.
- Un caso académico con problema de parametrización institucional.
- Su reintento interrumpido por suspensión de Windows a las 15:52:19.
- 44 casos E2E sin ejecutar.
- Estado posterior al último intento todavía no verificado.

Además:

- Pest conserva 276 casos aprobados y 1.724 aserciones.
- Cypress conserva 141 aprobaciones con API simulada.
- Las bases protegidas permanecieron intactas según el informe anterior.
- Sin commits ni push.

Checkpoint de recuperación:

`.tools/cypress-e2e/evidence/prompt41/recovery-after-e2e.json`

## 2. FASE A — RECUPERACIÓN OBLIGATORIA

Antes de ejecutar cualquier prueba o escritura:

1. Leer el checkpoint completo.
2. Recuperar el historial de las ejecuciones E2E.
3. Confirmar la rama y el estado de Git.
4. Verificar la identidad del datadir existente.
5. Confirmar que no hay procesos privados abandonados.
6. Comprobar los eventos de suspensión de Windows.
7. Verificar que el equipo se encuentra estable.
8. Revisar el estado del monitor y worker de seguridad.
9. Confirmar disponibilidad del puerto 3309.
10. Conservar las evidencias anteriores.

No ejecutar `mysqld --initialize`.

No recrear la instancia ni reinstalar dependencias innecesariamente.

No repetir las migraciones.

No repetir el caso `CY39-010` salvo que exista una razón de regresión expresamente documentada.

## 3. FASE B — VERIFICAR EL ESTADO POSTERIOR A LA SUSPENSIÓN

La última ejecución fue interrumpida y no quedó acreditada su restauración.

Por tanto:

1. Comprobar la integridad del datadir.
2. Verificar la identidad efectiva de MySQL.
3. Confirmar TLS mediante conexión real.
4. Confirmar host, puerto y base.
5. Inspeccionar las 52 tablas y las 14 migraciones.
6. Revisar los registros del último caso académico.
7. Identificar posibles transacciones incompletas.
8. Detectar datos sintéticos residuales.
9. Verificar el estado de sesiones, tokens y auditoría.
10. Revisar efectos sobre archivos y almacenamiento privado.

Primero inspeccionar el estado sin modificarlo.

Si se necesita restaurar, usar exclusivamente el mecanismo privado de restauración fría ya autorizado para `zarate_cypress_e2e`, después de verificar inequívocamente su destino e identidad.

No utilizar la restauración sobre bases existentes.

No ejecutar una restauración si la identidad o integridad son inciertas.

Registrar el estado antes y después.

## 4. FASE C — INVESTIGAR LA SUSPENSIÓN RECURRENTE

Revisar los eventos de energía de Windows y la configuración efectiva de suspensión.

Identificar:

- Suspensión por inactividad.
- Cierre de tapa.
- Hibernación.
- Políticas de energía.
- Suspensión automática.
- Eventos del sistema.
- Posibles interrupciones del monitor.

Realizar el diagnóstico mediante consultas de solo lectura.

No modificar automáticamente configuraciones globales de Windows.

No desactivar guardas.

No aumentar el límite de autorización de 120 segundos.

Las suspensiones anteriores pueden conservarse como históricas únicamente después de verificar la recuperación y establecer un nuevo punto de control.

Cualquier nueva suspensión durante la ejecución obliga a detenerse.

Si no puede mantenerse estable el entorno, cerrar con diagnóstico y no iniciar nuevos casos.

## 5. FASE D — RESOLVER LA PARAMETRIZACIÓN INSTITUCIONAL

Investigar por qué falló el caso académico.

Revisar:

- Código institucional enviado.
- Identidad del usuario ficticio.
- Institución vinculada.
- Encabezados HTTP.
- Variables E2E.
- Contexto de autenticación.
- Configuración de Sanctum.
- Fixtures sintéticos.
- Respuestas de Laravel.
- Registros del backend.
- Expectativas originales de la prueba.

Determinar si el error procede de los datos sintéticos, de la configuración o de una regla funcional.

Si es un error de fixture o parametrización, corregir solamente el instrumental privado E2E, conservando las aserciones originales.

No modificar código funcional para obtener una aprobación artificial.

No modificar identificadores institucionales sin comprender sus reglas de validación.

## 6. FASE E — REANUDAR EL CASO ACADÉMICO

Una vez que el entorno esté verificado, restaurado si corresponde y estable:

1. Preparar exclusivamente los fixtures necesarios.
2. Confirmar la identidad de la instancia SQL.
3. Ejecutar el caso académico pendiente.
4. Comprobar que utiliza React real.
5. Comprobar HTTP real.
6. Confirmar Laravel real.
7. Verificar consultas y escrituras en MySQL E2E.
8. Registrar aserciones y resultado Cypress.
9. Verificar restauración.
10. Guardar checkpoint.

Si vuelve a fallar, registrar la causa real y conservar sus evidencias.

No reintentar indefinidamente.

No declarar exitoso un caso interrumpido.

## 7. FASE F — CONTINUAR LOS OTROS 44 CASOS

Recuperar el inventario de los 44 casos todavía no ejecutados.

Clasificarlos y ejecutar los compatibles en este orden:

1. Autenticación.
2. Matrículas.
3. Aula Virtual.
4. Evaluaciones.
5. Asistencia.
6. Comunicaciones.
7. Regresión transversal.

No ejecutar casos con operaciones no autorizadas.

Mantener excluidos los dos casos que requieren DELETE sobre `communication_targets`.

Para cada prueba:

- Confirmar que no está acreditada.
- Verificar autorización vigente.
- Confirmar conexión a `zarate_cypress_e2e`.
- Preparar fixtures sintéticos.
- Ejecutar Cypress de forma secuencial.
- Verificar peticiones HTTP reales.
- Verificar integración SQL cuando corresponda.
- Registrar resultados y aserciones.
- Comprobar efectos secundarios.
- Restaurar el entorno de pruebas.
- Guardar checkpoint.

No utilizar respuestas simuladas para atribuir aprobación E2E real.

Cuando aparezca una incidencia, documentarla sin debilitar las verificaciones.

Continuar con otros casos independientes solamente si la seguridad y la integridad permanecen confirmadas.

## 8. FASE G — CHECKPOINTS Y CIERRE

Después de cada grupo o módulo:

1. Registrar casos aprobados.
2. Registrar casos fallidos.
3. Registrar casos bloqueados.
4. Actualizar el inventario de pendientes.
5. Confirmar estado SQL.
6. Comprobar restauración.
7. Verificar que no hubo suspensiones nuevas.
8. Confirmar TLS e identidad.
9. Conservar evidencias privadas.
10. Registrar el próximo caso exacto.

Al finalizar, cerrar exclusivamente los procesos privados iniciados.

No borrar el datadir E2E.

No modificar las bases protegidas.

No realizar commits ni push.

## 9. RESTRICCIONES

Mantener protegidos:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.
- Servicios de demostración.
- Migraciones originales.
- Código funcional React/Laravel.

Prohibido ejecutar operaciones destructivas fuera del entorno E2E autorizado.

Prohibido ampliar privilegios, desactivar TLS o eliminar guardas.

Mantener vigente la autorización máxima de 120 segundos.

No ejecutar los 38 casos Pest bloqueados.

No ejecutar los dos casos Cypress excluidos por DELETE.

No modificar las aserciones originales.

## 10. DOCUMENTACIÓN

Actualizar por anexos:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-41-e2e-real.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-e2e-real.md`

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-42-recuperacion-e2e.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-recuperacion-e2e.md`

Documentar:

- Recuperación después de la suspensión.
- Estado inicial de la base.
- Verificación o restauración efectuada.
- Diagnóstico de la parametrización institucional.
- Resultados del caso académico.
- Resultados de los otros casos E2E.
- Casos bloqueados.
- Incidencias.
- Estado final de procesos.
- Estado Git.
- Próximo paso de cierre.

## 11. INFORME FINAL

Entregar:

| Indicador | Resultado |
|---|---|
| E2E aprobados anteriormente | 1 |
| E2E nuevos aprobados | Real |
| E2E fallidos | Real |
| E2E pendientes | Real |
| Tablas MySQL | Real |
| Migraciones | Real |
| Restauración del entorno | Verificada / No verificada |
| TLS e identidad | Resultado |
| Suspensiones nuevas | Total |
| Bases protegidas | Estado |

Informar también:

1. Causa del fallo académico.
2. Estado final del caso académico.
3. Cantidad de flujos React–Laravel–MySQL acreditados.
4. Casos bloqueados y sus motivos.
5. Si la ejecución E2E autorizada está completada.
6. Estado de los 38 Pest excluidos.
7. Trabajo restante para GitHub y la entrega académica.

Clasificar:

A. E2E AUTORIZADO COMPLETADO.

B. E2E PARCIAL CON PENDIENTES.

C. DEFECTOS FUNCIONALES DETECTADOS.

D. BLOQUEADO POR ENTORNO O SEGURIDAD.

**OBJETIVO FINAL: RECUPERAR EL ENTORNO MYSQL E2E DESPUÉS DE LA SUSPENSIÓN, CONSERVAR EL CASO YA APROBADO Y COMPLETAR EL MAYOR NÚMERO POSIBLE DE PRUEBAS REALES SIN COMPROMETER LA SEGURIDAD DE ECOAULA SAAS.**