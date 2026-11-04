# BOLT-APO-003 — Ejecución y validación de pruebas de usuarios, roles y auditoría

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-003 |
| Área | Administración de usuarios, roles, permisos y auditoría |
| Procedimientos | PA-03.1 Administrar usuarios y roles; PA-03.2 Controlar permisos y auditar accesos |
| Actividad | Ejecución de pruebas funcionales y regresión |
| Framework | Pest (Laravel) |
| Entorno | Docker Compose y MySQL |
| Base de datos | `zarate_test` |
| Fecha de documentación | 03/11/2026 |

## 2. Objetivo

Comprobar el comportamiento de las tres pruebas complementarias de PA-03 y verificar que su incorporación no genere fallos en las pruebas existentes de autenticación, gestión de usuarios, roles y permisos.

Se busca conservar evidencia de las ejecuciones, incidencias identificadas, correcciones y resultados finales.

## 3. Casos de prueba complementarios

| ID | Procedimiento | Escenario | Resultado |
|---|---|---|---|
| CP-PA03-01 | PA-03.1 | Impedir retirar el rol requerido por un perfil de estudiante | Aprobado |
| CP-PA03-02 | PA-03.2 | Conservar permisos cuando una actualización es rechazada | Aprobado |
| CP-PA03-03 | PA-03.2 | Verificar orden y paginación de registros de auditoría | Aprobado |

Archivo ejecutado:

`backend/tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php`

## 4. Preparación del entorno

Las pruebas se ejecutaron mediante Docker Compose con el perfil `testing`.

Se utilizaron:

- Servicio `backend-test` para ejecutar Laravel y Pest.
- Base de datos MySQL `zarate_test`.
- `DatabaseTransactions` para aislar los datos generados.
- `InstitutionContext` para ejecutar consultas dentro de la institución de prueba.
- `RolePermissionSeeder` para preparar roles y permisos.
- `PermissionRegistrar` para limpiar la caché de permisos.
- Registros ficticios de institución, usuarios, matrículas y auditorías.

El entorno de pruebas se mantuvo separado de los datos institucionales reales.

## 5. Primera ejecución de las pruebas adicionales

Se ejecutó el comando:

```powershell
docker compose --profile testing run --rm -v "./backend/.env.testing:/var/www/html/.env:ro" backend-test php vendor/bin/pest tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php --compact
```

### Resultado inicial

| Indicador | Valor |
|---|---|
| Pruebas ejecutadas | 3 |
| Aprobadas | 2 |
| Fallidas | 1 |
| Aserciones | 18 |
| Duración | 1.85 segundos |

La prueba fallida fue CP-PA03-02.

### Incidencia detectada

La prueba esperaba un error de validación en el campo `permissions`, pero Laravel devolvió el error en `permissions.1`, correspondiente al segundo elemento del arreglo.

El servidor ya había respondido con HTTP 422, por lo que el fallo no demostró un defecto funcional del sistema.

## 6. Corrección aplicada

Se modificó la aserción de:

`assertJsonValidationErrors('permissions')`

a:

`assertJsonValidationErrors('permissions.1')`

Esta corrección permitió verificar el campo exacto rechazado por Laravel.

No se alteraron `RoleController.php`, `UpdateRoleRequest.php` ni el comportamiento del sistema.

Posteriormente, el desarrollador confirmó que las tres pruebas complementarias aprobaron.

La cantidad exacta de aserciones de esa ejecución individual no quedó registrada.

## 7. Regresión con pruebas existentes

Se ejecutaron conjuntamente:

- `Sprint1Test.php`
- `AutenticacionAdicionalTest.php`
- `PA03UsuariosAuditoriaTest.php`

Comando utilizado:

```powershell
docker compose --profile testing run --rm -v "./backend/.env.testing:/var/www/html/.env:ro" backend-test php vendor/bin/pest tests/Feature/Sprint1Test.php tests/Feature/AutenticacionAdicionalTest.php tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php --compact
```

### Resultado registrado

| Indicador | Valor |
|---|---|
| Pruebas aprobadas | 68 |
| Pruebas fallidas | 0 |
| Aserciones | 255 |
| Duración | 33.47 segundos |

Las 68 pruebas corresponden al conjunto completo de tres archivos y no exclusivamente a las pruebas complementarias de PA-03.

## 8. Validaciones confirmadas

### CP-PA03-01 — Protección de perfiles académicos

Se comprobó que el sistema rechaza una modificación que intenta retirar el rol requerido por el perfil de estudiante.

También se verificó que los roles originales permanecieran sin cambios.

### CP-PA03-02 — Integridad de permisos

Se comprobó que una actualización con un permiso inexistente es rechazada.

Posteriormente se verificó que la lista original de permisos del rol permaneciera intacta.

### CP-PA03-03 — Consulta de auditoría

Se comprobó que la primera página devuelve 20 registros y que el orden corresponde a identificadores descendentes.

También se verificó la recuperación de registros restantes mediante una segunda página.

## 9. Evidencia de control de versiones

La implementación quedó registrada en el commit técnico:

`7e7c9de — test(apoyo): agregar pruebas de usuarios roles y auditoria PA-03`

Rama utilizada:

`feature/macro-apoyo`

Archivo incorporado:

`backend/tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php`

El commit añadió un archivo de pruebas con 162 líneas. No se modificaron los controladores ni los servicios existentes.

## 10. Participación de inteligencia artificial

ChatGPT brindó asistencia en:

- Selección de escenarios complementarios.
- Elaboración del código de las pruebas.
- Interpretación del error de validación.
- Propuesta de corrección de la aserción.
- Organización de los resultados de ejecución.

El desarrollador ejecutó los comandos y confirmó los resultados.

Este documento es una reconstrucción retrospectiva del proceso.

**Pendiente:** incorporar los prompts originales o referencias verificables a la conversación utilizada.

## 11. Evidencias disponibles y pendientes

**Disponibles:**

- Archivo `PA03UsuariosAuditoriaTest.php`.
- Commit `7e7c9de`.
- Salida de la regresión registrada durante la ejecución.
- Información de la incidencia inicial y su corrección.

**Pendientes:**

- Captura verificable del resultado de Pest.
- Incorporación o referencia de prompts originales.
- Vinculación con la matriz de doble entrada de MA-01.
- Identificación de requisitos aplicables de ISO 9001.

## 12. Conclusión

Las tres pruebas complementarias de PA-03 fueron aprobadas.

La regresión conjunta registró 68 pruebas aprobadas, 255 aserciones y ningún fallo.

Los resultados respaldan el comportamiento de los escenarios verificados, sin acreditar una cobertura total del sistema ni una certificación ISO 9001.