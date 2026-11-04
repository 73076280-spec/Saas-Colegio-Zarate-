# BOLT-APO-002 — Ejecución y validación de pruebas de Tesorería

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-002 |
| Área | Tesorería |
| Procedimientos | PA-02.1 Registrar conceptos y pagos; PA-02.2 Validar pagos y consultar deudas |
| Actividad | Ejecución de pruebas funcionales y regresión |
| Framework | Pest (Laravel) |
| Entorno | Docker Compose y MySQL |
| Base de datos | `zarate_test` |
| Fecha de documentación | 03/11/2026 |

## 2. Objetivo

Verificar que las tres pruebas complementarias de Tesorería se ejecuten satisfactoriamente junto con las pruebas originales relacionadas con matrículas, pagos, reportes y dashboards.

Se busca comprobar el comportamiento de los escenarios seleccionados y conservar evidencia de los resultados obtenidos.

## 3. Casos de prueba complementarios

| ID | Procedimiento | Escenario | Resultado obtenido |
|---|---|---|---|
| CP-PA02-01 | PA-02.1 | Rechazar conceptos de pago con códigos duplicados | Aprobado |
| CP-PA02-02 | PA-02.1 | Rechazar registro de pagos con conceptos inactivos | Aprobado |
| CP-PA02-03 | PA-02.2 | Comprobar el monto pendiente para el año académico utilizado | Aprobado |

Archivo de pruebas:

`backend/tests/Feature/ApoyoInstitucional/PA02TesoreriaTest.php`

## 4. Preparación del entorno

Las pruebas se ejecutaron con Docker Compose, utilizando el perfil `testing` y el servicio `backend-test`.

El entorno de prueba utiliza la base de datos `zarate_test`, separada de los datos de producción.

Las pruebas utilizan `DatabaseTransactions` y `InstitutionContext` para mantener el aislamiento de los datos.

Se emplearon registros ficticios de institución, estudiantes, conceptos y pagos.

## 5. Ejecución de las pruebas complementarias

Comando utilizado:

```powershell
docker compose --profile testing run --rm -v "./backend/.env.testing:/var/www/html/.env:ro" backend-test php vendor/bin/pest tests/Feature/ApoyoInstitucional/PA02TesoreriaTest.php --compact
```

El desarrollador confirmó que las tres pruebas adicionales aprobaron.

No se conserva en este registro la cantidad exacta de aserciones ni la duración de esa ejecución individual.

## 6. Regresión conjunta

Se ejecutaron los siguientes archivos:

- `Sprint4Test.php`
- `Sprint10Test.php`
- `PA02TesoreriaTest.php`

Comando:

```powershell
docker compose --profile testing run --rm -v "./backend/.env.testing:/var/www/html/.env:ro" backend-test php vendor/bin/pest tests/Feature/Sprint4Test.php tests/Feature/Sprint10Test.php tests/Feature/ApoyoInstitucional/PA02TesoreriaTest.php --compact
```

### Resultado registrado

| Indicador | Valor |
|---|---|
| Pruebas aprobadas | 29 |
| Pruebas fallidas | 0 |
| Aserciones | 349 |
| Duración | 16.08 segundos |

El resultado incluye pruebas originales de matrícula y reportes, además de las tres pruebas complementarias de Tesorería.

No representa 29 pruebas exclusivamente del procedimiento PA-02.

## 7. Verificaciones realizadas

### CP-PA02-01 — Unicidad de códigos

Se comprobó que el sistema rechaza un segundo concepto con código duplicado y que permanece un único registro con dicho código.

### CP-PA02-02 — Disponibilidad del concepto

Se comprobó que el registro de un pago asociado con un concepto inactivo es rechazado y que no se crea el pago correspondiente.

### CP-PA02-03 — Monto pendiente registrado

Se comprobó que el dashboard devuelve el importe preparado en el escenario de prueba.

Esta comprobación utiliza un año académico y no demuestra exhaustivamente el aislamiento entre múltiples años.

## 8. Comparación con las pruebas existentes

La revisión de `Sprint4Test.php` permitió identificar cobertura previa de:

- Autorización entre Secretaría y Tesorería.
- Importes insuficientes.
- Estados de pago no permitidos.
- Validaciones repetidas.
- Protección ante pagos cancelados.
- Aislamiento institucional.
- Reversión de operaciones cuando falla la auditoría.

La revisión de `Sprint10Test.php` permitió identificar pruebas relacionadas con reportes y validación económica de matrículas.

Las tres pruebas nuevas se seleccionaron para complementar esos escenarios.

## 9. Verificación de Git

Después de la regresión se incorporó el archivo nuevo mediante Git.

**Commit:** `299a286`

**Mensaje:** `test(apoyo): agregar pruebas funcionales de tesoreria PA-02`

**Rama:** `feature/macro-apoyo`

El commit incorporó un archivo nuevo de pruebas con 131 líneas, sin modificar los archivos originales de los Sprints.

## 10. Participación de inteligencia artificial

ChatGPT asistió en el análisis, selección y elaboración de las pruebas complementarias.

El desarrollador ejecutó las pruebas, revisó los resultados y confirmó la aprobación de los escenarios.

Este documento registra retrospectivamente las actividades realizadas.

**Pendiente:** incorporar el texto literal de los prompts originales o referencias verificables a la conversación de trabajo.

## 11. Evidencias disponibles y pendientes

**Disponibles:**

- Archivo de pruebas `PA02TesoreriaTest.php`.
- Commit técnico `299a286`.
- Salida de la regresión comunicada durante el desarrollo.
- Código de servicios, solicitudes y dashboard revisado.

**Pendientes de organizar:**

- Captura de la ejecución de Pest, si existe o se genera nuevamente.
- Registro literal de los prompts.
- Referencias cruzadas con la matriz de doble entrada relacionada con ISO 9001.

## 12. Conclusión

Las tres pruebas complementarias de Tesorería aprobaron y se ejecutaron conjuntamente con las pruebas originales de Sprint 4 y Sprint 10 sin registrar fallos.

La validación ofrece evidencia del comportamiento de los escenarios ejecutados, pero no demuestra cobertura total ni certificación ISO 9001.