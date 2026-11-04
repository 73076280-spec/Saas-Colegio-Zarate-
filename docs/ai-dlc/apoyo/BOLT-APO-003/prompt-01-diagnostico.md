# BOLT-APO-003 — Diagnóstico de usuarios, roles, permisos y auditoría

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-003 |
| Área | Administración de usuarios, roles y seguridad |
| Procedimientos | PA-03.1 Administrar usuarios y roles; PA-03.2 Controlar permisos y auditar accesos |
| Metodología | Desarrollo incremental asistido por inteligencia artificial (AI-DLC) |
| Asistente utilizado | ChatGPT |
| Fecha de documentación | 03/11/2026 |
| Estado | Diagnóstico realizado; documentación retrospectiva |

## 2. Objetivo del diagnóstico

Analizar los mecanismos de administración de usuarios, asignación de roles, control de permisos y consulta de auditorías implementados en EcoAula.

El diagnóstico busca identificar las reglas de negocio y seguridad existentes, revisar su cobertura mediante pruebas automatizadas y seleccionar escenarios complementarios sin duplicar las verificaciones previamente realizadas por el equipo.

## 3. Alcance del análisis

### PA-03.1 — Administrar usuarios y roles

Comprende:

- Registro de usuarios institucionales.
- Consulta y actualización de cuentas.
- Desactivación de usuarios.
- Asignación y modificación de roles.
- Protección del último administrador activo.
- Prevención de autodesactivación.
- Conservación de roles requeridos por perfiles académicos.
- Validación de la capacidad del operador para delegar permisos.

### PA-03.2 — Controlar permisos y auditar accesos

Comprende:

- Consulta del catálogo de roles y permisos.
- Actualización de permisos asociados a roles.
- Restricción de operaciones sin autorización.
- Protección de permisos del rol administrador.
- Aislamiento de información entre instituciones.
- Consulta de registros de auditoría.
- Ordenamiento y paginación de auditorías.

## 4. Archivos analizados

| Archivo | Propósito |
|---|---|
| `UserController.php` | Identificar operaciones de administración de usuarios |
| `RoleController.php` | Analizar la consulta de roles y actualización de permisos |
| `AuditController.php` | Revisar la consulta de auditorías y su autorización |
| `UserService.php` | Examinar reglas de negocio, delegación de roles y transacciones |
| `AuditLog.php` | Revisar el modelo de registros de auditoría |
| `Sprint1Test.php` | Identificar pruebas existentes de autenticación, usuarios y roles |
| `AutenticacionAdicionalTest.php` | Revisar pruebas complementarias de autenticación |
| `Sprint3Test.php` | Identificar pruebas relacionadas con perfiles académicos y roles |

## 5. Hallazgos del diagnóstico

### 5.1. Administración de usuarios

`UserController.php` implementa operaciones para listar, consultar, registrar, actualizar y desactivar usuarios.

Las operaciones de registro, actualización y desactivación se delegan a `UserService.php`.

Se identificó el uso de políticas de autorización para restringir el acceso a las operaciones.

### 5.2. Reglas de negocio de usuarios

`UserService::save()` utiliza una transacción de base de datos para gestionar las modificaciones.

Se identificaron las siguientes reglas:

- Impedir la delegación de roles cuando el operador no posee el permiso correspondiente.
- Rechazar la asignación de permisos que el operador no está autorizado a delegar.
- Proteger al último administrador activo.
- Impedir que un usuario desactive su propia cuenta.
- Exigir autorización específica para cambiar el estado de una cuenta.
- Proteger los roles asociados con perfiles de personas existentes.
- Establecer el cambio obligatorio de contraseña inicial para nuevas cuentas.

### 5.3. Conservación de roles vinculados con perfiles

Se identificó una regla que impide retirar un rol cuando el usuario mantiene un perfil académico que lo requiere.

Por ejemplo, si una cuenta tiene un perfil de estudiante, no debe eliminarse el rol correspondiente sin resolver previamente la relación existente.

Esta restricción contribuye a preservar la consistencia entre los perfiles académicos y las autorizaciones del sistema.

### 5.4. Administración de permisos

`RoleController.php` permite consultar roles y permisos, así como actualizar los permisos asignados a un rol.

Se identificaron estas restricciones:

- Los permisos del rol `ADMINISTRATOR` están protegidos.
- El operador no puede asignar permisos que no posee.
- La actualización de permisos utiliza una transacción.
- La entrada es validada mediante `UpdateRoleRequest.php`.

### 5.5. Consulta de auditoría

`AuditController.php` implementa la consulta de registros de auditoría.

El controlador comprueba la autorización mediante:

`Gate::authorize('viewAny', AuditLog::class)`

Posteriormente devuelve los registros ordenados por identificador descendente, con paginación de 20 elementos por página.

El modelo `AuditLog.php` utiliza `BelongsToInstitution` y define conversiones para el tipo de acción, valores anteriores, valores nuevos y fecha de creación.

La consulta de auditoría es distinta de la generación de los registros, que se realiza mediante otros componentes del sistema.

## 6. Revisión de pruebas existentes

Se analizaron pruebas en `Sprint1Test.php`, `AutenticacionAdicionalTest.php` y partes de `Sprint3Test.php`.

Se identificó cobertura previa de:

- Inicio y cierre de sesión.
- Rechazo de credenciales incorrectas.
- Restricción de cuentas bloqueadas o instituciones inactivas.
- Creación y actualización de usuarios.
- Protección del último administrador.
- Prevención de autodesactivación.
- Restricciones de acceso por roles.
- Control de delegación de permisos.
- Protección del rol administrador.
- Aislamiento institucional de usuarios y registros de auditoría.
- Restricciones de perfiles académicos y reutilización de cuentas.

### Ejecución de referencia

Se ejecutaron conjuntamente:

- `Sprint1Test.php`
- `AutenticacionAdicionalTest.php`

Resultados registrados:

| Indicador | Resultado |
|---|---|
| Pruebas aprobadas | 65 |
| Aserciones | 236 |
| Duración | 33.27 segundos |
| Fallos | 0 |

Estos resultados corresponden a los dos archivos completos y no exclusivamente al procedimiento PA-03.

## 7. Brechas de cobertura identificadas

Se seleccionaron tres escenarios complementarios:

| ID | Procedimiento | Escenario | Comportamiento esperado |
|---|---|---|---|
| CP-PA03-01 | PA-03.1 | Intentar retirar el rol requerido por un perfil de estudiante | Rechazar la modificación y conservar los roles originales |
| CP-PA03-02 | PA-03.2 | Intentar actualizar un rol incluyendo un permiso inexistente | Rechazar la operación y conservar los permisos originales |
| CP-PA03-03 | PA-03.2 | Consultar más de 20 registros de auditoría | Mantener orden descendente y paginación correcta |

Los escenarios fueron seleccionados por su relación con la integridad de usuarios, los permisos y la trazabilidad de operaciones.

## 8. Riesgos y consideraciones

### 8.1. Integridad de roles

Eliminar un rol necesario para un perfil existente podría generar inconsistencias entre las relaciones académicas y los privilegios asignados.

### 8.2. Integridad de permisos

Una actualización rechazada no debe alterar los permisos previamente asignados a un rol.

### 8.3. Trazabilidad de auditoría

La consulta de auditoría debe permitir recuperar registros ordenados y paginados sin vulnerar el aislamiento institucional.

Estos riesgos motivaron la selección de pruebas complementarias. No constituyen defectos confirmados.

## 9. Participación de inteligencia artificial

ChatGPT asistió durante:

- La interpretación de controladores y servicios.
- La revisión de las reglas de negocio y seguridad.
- La identificación de cobertura existente.
- La selección de escenarios complementarios.
- La preparación inicial de pruebas automatizadas.

El desarrollador ejecutó los comandos de inspección y validación, revisó las respuestas y confirmó los resultados.

**Trazabilidad pendiente:** incorporar o referenciar las instrucciones textuales originales utilizadas durante el trabajo. Este documento es un registro retrospectivo, no una transcripción literal de los prompts.

## 10. Resultado del diagnóstico

Se identificaron tres escenarios complementarios que fueron implementados posteriormente en:

`backend/tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php`

La regresión conjunta de `Sprint1Test.php`, `AutenticacionAdicionalTest.php` y `PA03UsuariosAuditoriaTest.php` registró:

- 68 pruebas aprobadas.
- 255 aserciones.
- 0 fallos.
- Duración: 33.47 segundos.

El cambio técnico quedó registrado mediante el commit:

`7e7c9de — test(apoyo): agregar pruebas de usuarios roles y auditoria PA-03`

## 11. Conclusión

El diagnóstico identificó funcionalidades existentes para administrar usuarios, controlar roles y permisos, y consultar registros de auditoría.

La revisión de pruebas permitió seleccionar tres escenarios complementarios orientados a la integridad y trazabilidad, evitando repetir las validaciones previamente identificadas.

Los resultados proporcionan evidencia sobre los escenarios ejecutados, sin demostrar cobertura total del sistema ni una certificación ISO 9001.

La relación con los criterios específicos de calidad se desarrollará posteriormente en la matriz de doble entrada del proyecto.