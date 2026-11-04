# BOLT-APO-003 — Implementación de pruebas complementarias de usuarios, roles y auditoría

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-003 |
| Área | Administración de usuarios, roles, permisos y auditoría |
| Procedimientos | PA-03.1 Administrar usuarios y roles; PA-03.2 Controlar permisos y auditar accesos |
| Actividad | Implementación de pruebas funcionales complementarias |
| Metodología | Desarrollo incremental asistido por inteligencia artificial (AI-DLC) |
| Herramientas | ChatGPT, Visual Studio Code, Laravel, Pest, Docker, MySQL y Git |
| Fecha de documentación | 03/11/2026 |
| Estado | Implementación realizada; registro retrospectivo |

## 2. Objetivo

Incorporar pruebas funcionales complementarias para comprobar la integridad de los roles asociados con perfiles académicos, la conservación de permisos ante operaciones rechazadas y el comportamiento de ordenamiento y paginación de los registros de auditoría.

La implementación debía preservar el código original del sistema y evitar duplicaciones con las pruebas existentes de autenticación, usuarios y gestión de personas.

## 3. Archivo implementado

Se creó el archivo:

`backend/tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php`

El archivo incorpora tres casos de prueba:

| ID | Procedimiento | Escenario | Resultado esperado |
|---|---|---|---|
| CP-PA03-01 | PA-03.1 | Intentar retirar el rol requerido por un perfil de estudiante | HTTP 422; conservación de los roles originales |
| CP-PA03-02 | PA-03.2 | Actualizar un rol incluyendo un permiso inexistente | HTTP 422; conservación de los permisos originales |
| CP-PA03-03 | PA-03.2 | Consultar más de 20 registros de auditoría | Orden descendente y paginación correcta |

## 4. Preparación técnica

La implementación reutilizó las herramientas y estructuras disponibles en las pruebas existentes de EcoAula.

### 4.1. Entorno de pruebas

Se utilizó:

- Laravel y el framework Pest.
- Docker Compose con perfil `testing`.
- Servicio `backend-test`.
- Base de datos MySQL `zarate_test`.
- Git para el control de versiones.

### 4.2. Datos de prueba

La preparación de datos incluyó:

- Una institución generada mediante `Institution::factory()`.
- Roles y permisos creados mediante `RolePermissionSeeder`.
- Un usuario administrador generado mediante `User::factory()`.
- Asignación del rol `ADMINISTRATOR`.
- Encabezados HTTP para solicitudes JSON.
- Autenticación del administrador mediante `actingAs()`.

Se utilizó `DatabaseTransactions` para aislar las operaciones y `InstitutionContext` para ejecutar las consultas relacionadas con la institución correspondiente.

También se reinició la caché de permisos mediante `PermissionRegistrar`, siguiendo el patrón de las pruebas originales.

## 5. Implementación de CP-PA03-01

### Protección de roles asociados con perfiles académicos

Se creó un estudiante a partir de un registro de matrícula generado para la prueba.

Después se recuperó su cuenta de usuario y se comprobó que tenía asignado el rol `STUDENT`.

Se intentó actualizar la cuenta sustituyendo sus roles por `GUARDIAN`.

La prueba verifica:

1. Que el usuario tiene inicialmente el rol requerido por su perfil académico.
2. Que la modificación es rechazada mediante HTTP 422.
3. Que el error corresponde al campo `roles`.
4. Que los roles originales permanecen intactos después del rechazo.

Este escenario complementa la regla implementada en `UserService::save()` que protege los roles requeridos por perfiles existentes.

## 6. Implementación de CP-PA03-02

### Conservación de permisos ante actualizaciones rechazadas

Se recuperó el rol `TEACHER` y se obtuvo la lista de sus permisos originales.

Posteriormente se envió una solicitud de actualización incluyendo un permiso válido y otro inexistente.

La prueba verifica:

1. Que la actualización sea rechazada mediante HTTP 422.
2. Que el sistema identifique el permiso inexistente.
3. Que la lista de permisos del rol permanezca igual después de la operación rechazada.

### Incidencia encontrada

En la primera ejecución, la prueba esperaba que Laravel devolviera un error de validación asociado directamente con:

`permissions`

Sin embargo, la respuesta identificó específicamente el segundo elemento del arreglo:

`permissions.1`

La respuesta HTTP ya era 422, por lo que el fallo correspondía a la expectativa de la prueba, no a un defecto confirmado del controlador.

### Corrección realizada

Se modificó la aserción de:

`assertJsonValidationErrors('permissions')`

a:

`assertJsonValidationErrors('permissions.1')`

Esta corrección permitió comprobar el campo realmente rechazado por Laravel, manteniendo la verificación posterior de conservación de permisos.

No fue necesario modificar `RoleController.php` ni `UpdateRoleRequest.php`.

## 7. Implementación de CP-PA03-03

### Ordenamiento y paginación de auditoría

Se generaron 25 registros de auditoría asociados con la institución de prueba.

Posteriormente se realizaron solicitudes al endpoint:

`GET /api/v1/audit-logs`

y a su segunda página:

`GET /api/v1/audit-logs?page=2`

La prueba verifica:

1. Que la primera página responda mediante HTTP 200.
2. Que se devuelvan 20 registros en la primera página.
3. Que los identificadores estén ordenados de forma descendente.
4. Que la segunda página sea accesible.
5. Que los registros restantes correspondan al orden esperado.

La prueba complementa la funcionalidad de `AuditController::index()` y la restricción institucional aplicada por el modelo `AuditLog`.

## 8. Verificación durante la implementación

### Primera ejecución

La ejecución inicial produjo:

| Indicador | Resultado |
|---|---|
| Pruebas aprobadas | 2 |
| Pruebas fallidas | 1 |
| Aserciones | 18 |
| Duración | 1.85 segundos |

El caso fallido fue CP-PA03-02, debido a la diferencia entre `permissions` y `permissions.1`.

### Corrección y segunda ejecución

Después de actualizar la aserción, el desarrollador confirmó que las tres pruebas complementarias aprobaron.

La cantidad exacta de aserciones de esa ejecución individual no quedó registrada en esta documentación.

## 9. Control de cambios

La implementación se realizó en la rama:

`feature/macro-apoyo`

Se agregó únicamente el archivo nuevo:

`backend/tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php`

El cambio quedó registrado en el commit:

`7e7c9de — test(apoyo): agregar pruebas de usuarios roles y auditoria PA-03`

El commit incorporó 162 líneas correspondientes al nuevo archivo de pruebas.

No se modificaron los controladores, servicios ni las pruebas originales de los Sprints.

## 10. Participación de inteligencia artificial

ChatGPT brindó asistencia para:

- Analizar los controladores y el servicio de usuarios.
- Identificar reglas de seguridad y permisos.
- Revisar pruebas existentes para evitar duplicaciones.
- Elaborar tres pruebas complementarias.
- Interpretar la respuesta de validación de Laravel.
- Proponer la corrección de la aserción `permissions.1`.

El desarrollador creó el archivo de pruebas, ejecutó los comandos, verificó las salidas y confirmó los resultados obtenidos.

**Nota de trazabilidad:** este documento reconstruye retrospectivamente la implementación. Las instrucciones literales utilizadas durante la conversación deberán referenciarse o transcribirse por separado para completar el registro AI-DLC.

## 11. Resultado de la implementación

Las tres pruebas complementarias aprobaron.

Posteriormente se realizó una regresión conjunta con:

- `Sprint1Test.php`
- `AutenticacionAdicionalTest.php`
- `PA03UsuariosAuditoriaTest.php`

Resultado registrado:

| Indicador | Valor |
|---|---|
| Pruebas aprobadas | 68 |
| Pruebas fallidas | 0 |
| Aserciones | 255 |
| Duración | 33.47 segundos |

El total incluye las pruebas originales y los tres casos nuevos, por lo que no representa 68 casos exclusivos de PA-03.

## 12. Conclusión

Se implementaron tres pruebas funcionales complementarias orientadas a la integridad de perfiles, conservación de permisos y consulta de auditoría.

La ejecución permitió identificar y corregir una expectativa incorrecta de validación sin modificar la lógica de negocio original.

La implementación quedó respaldada por resultados de Pest y un commit local, que servirán como evidencias para la documentación AI-DLC y la matriz de doble entrada vinculada con ISO 9001.