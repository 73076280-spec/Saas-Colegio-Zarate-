# BOLT-APO-002 — Implementación de pruebas complementarias de Tesorería

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-002 |
| Área | Tesorería |
| Procedimientos | PA-02.1 Registrar conceptos y pagos; PA-02.2 Validar pagos y consultar deudas |
| Actividad | Implementación de pruebas funcionales complementarias |
| Herramientas | ChatGPT, Visual Studio Code, Laravel, Pest, Docker, MySQL y Git |
| Fecha de documentación | 03/11/2026 |
| Estado | Implementación realizada; registro retrospectivo |

## 2. Objetivo

Implementar pruebas automatizadas adicionales que permitan verificar reglas de negocio relacionadas con la integridad de los conceptos de pago, la disponibilidad de los conceptos utilizados para registrar pagos y la consulta de montos pendientes.

La implementación tuvo como condición conservar el código existente y evitar duplicaciones con las pruebas desarrolladas anteriormente por el equipo.

## 3. Archivo implementado

Se creó el archivo:

`backend/tests/Feature/ApoyoInstitucional/PA02TesoreriaTest.php`

La implementación comprende tres casos funcionales complementarios.

| ID | Procedimiento | Escenario | Resultado esperado |
|---|---|---|---|
| CP-PA02-01 | PA-02.1 | Registrar conceptos con códigos duplicados | HTTP 422 y conservación de un único registro |
| CP-PA02-02 | PA-02.1 | Registrar un pago asociado con un concepto inactivo | HTTP 422 y ausencia de registro de pago |
| CP-PA02-03 | PA-02.2 | Consultar el indicador de monto pendiente para el año académico utilizado | Respuesta HTTP 200 e importe esperado |

## 4. Estrategia de implementación

Se utilizó la estructura de pruebas de Laravel y Pest que ya estaba disponible en EcoAula.

La preparación de datos se basó principalmente en el patrón de `Sprint4Test.php`, mediante:

- `Institution::factory()` para generar una institución de prueba.
- `RolePermissionSeeder` para preparar los roles y permisos.
- `User::factory()` para generar un usuario con rol `TREASURY`.
- `Enrollment::factory()` para obtener un estudiante y un año académico relacionados.
- `InstitutionContext` para ejecutar operaciones dentro de la institución.
- `DatabaseTransactions` para aislar los cambios de cada prueba.

Las solicitudes HTTP se ejecutaron mediante los métodos de prueba proporcionados por Laravel.

## 5. Implementación de los casos

### CP-PA02-01 — Rechazar códigos duplicados

Se registró un concepto de pago utilizando un código determinado.

Después se intentó crear otro concepto dentro de la misma institución, reutilizando el código.

La prueba verifica:

1. Que el primer concepto se registre correctamente.
2. Que el segundo registro sea rechazado con HTTP 422.
3. Que la respuesta identifique el campo `code` como inválido.
4. Que permanezca un único concepto con dicho código.

Esta prueba complementa las reglas de unicidad definidas en `PaymentRequest.php`.

### CP-PA02-02 — Rechazar conceptos inactivos

Se preparó un concepto de pago con estado `INACTIVE`.

Después se intentó registrar un pago asociado con el estudiante y año académico de la prueba, utilizando el concepto inactivo.

La prueba verifica:

1. Que la solicitud sea rechazada con HTTP 422.
2. Que el error esté asociado a `payment_concept_id`.
3. Que no se cree un pago relacionado con el concepto inactivo.

Esta prueba complementa la verificación de disponibilidad de conceptos implementada en `PaymentService::save()`.

### CP-PA02-03 — Consultar el monto pendiente registrado

Se creó un concepto de pago activo y un pago con estado `PENDING`.

Posteriormente se consultó el endpoint:

`GET /api/v1/dashboard`

incluyendo el identificador del año académico utilizado en el escenario.

La prueba verifica:

1. Que el dashboard responda correctamente.
2. Que el indicador `Monto pendiente (PEN)` esté disponible.
3. Que el importe obtenido coincida con el monto pendiente preparado para el escenario.

**Alcance de esta prueba:** comprueba el indicador de monto pendiente en el conjunto de datos utilizado. No verifica de manera exhaustiva el aislamiento entre varios años académicos ni el cálculo total de obligaciones económicas de un estudiante.

## 6. Consideraciones técnicas

### 6.1. Autorización

El usuario utilizado en las pruebas posee el rol `TREASURY`, de acuerdo con los permisos configurados en el sistema.

### 6.2. Aislamiento institucional

Las consultas directas a los modelos se ejecutan mediante `InstitutionContext`, manteniendo el alcance institucional de los registros.

### 6.3. Integridad de los datos

Las pruebas comprueban que las operaciones rechazadas no generen registros no deseados.

### 6.4. Independencia de pruebas

Se utilizó `DatabaseTransactions` para evitar que los datos generados durante una prueba permanezcan como resultados de otras ejecuciones.

## 7. Control de cambios

La implementación se realizó en:

`feature/macro-apoyo`

Se agregó únicamente el archivo nuevo de pruebas de Tesorería, conservando los controladores, servicios y pruebas existentes.

El cambio quedó registrado mediante el commit local:

`299a286 — test(apoyo): agregar pruebas funcionales de tesoreria PA-02`

El commit incorporó 131 líneas correspondientes al archivo nuevo.

## 8. Uso de inteligencia artificial

ChatGPT brindó asistencia para:

- Analizar las reglas de negocio del módulo.
- Comparar los escenarios con las pruebas existentes.
- Seleccionar tres pruebas complementarias.
- Elaborar el código inicial de Pest.
- Identificar las verificaciones esperadas.

El desarrollador creó el archivo en Visual Studio Code, ejecutó las pruebas y confirmó los resultados obtenidos.

**Nota sobre los prompts:** el contenido de este documento es una reconstrucción retrospectiva. El texto literal de las instrucciones originales deberá registrarse o referenciarse por separado para completar la trazabilidad AI-DLC.

## 9. Resultados obtenidos

El desarrollador confirmó que las tres pruebas adicionales aprobaron.

Posteriormente se ejecutó una regresión conjunta con:

- `Sprint4Test.php`
- `Sprint10Test.php`
- `PA02TesoreriaTest.php`

El resultado fue:

| Indicador | Resultado |
|---|---|
| Pruebas aprobadas | 29 |
| Pruebas fallidas | 0 |
| Aserciones | 349 |
| Duración | 16.08 segundos |

La cantidad total incluye pruebas originales de matrícula y reportes, además de las pruebas complementarias de Tesorería.

## 10. Mejoras pendientes

Se identificó una oportunidad de fortalecimiento del caso CP-PA02-03: incorporar registros de dos años académicos y comprobar que el filtro excluya los importes correspondientes al año no seleccionado.

También queda pendiente establecer si el alcance de PA-02.2 requiere únicamente consultar montos pendientes registrados o calcular una deuda individual completa.

Estas oportunidades no se registran como defectos confirmados.

## 11. Conclusión

La implementación incorporó tres pruebas funcionales complementarias para el módulo de Tesorería.

Las pruebas verificaron reglas de unicidad, disponibilidad de conceptos y consulta del indicador financiero, sin introducir modificaciones en la lógica de negocio existente.

Los resultados fueron comprobados mediante ejecuciones de Pest y quedaron asociados con un commit local identificable.

Esta documentación servirá de respaldo para el registro de evidencias y la futura matriz de doble entrada vinculada con ISO 9001.