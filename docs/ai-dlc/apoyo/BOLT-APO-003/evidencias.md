# BOLT-APO-003 — Registro de evidencias y trazabilidad de usuarios, roles y auditoría

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-003 |
| Procedimientos | PA-03.1 Administrar usuarios y roles; PA-03.2 Controlar permisos y auditar accesos |
| Metodología | Desarrollo incremental asistido por IA (AI-DLC) |
| Fecha de documentación | 03/11/2026 |
| Estado | Pruebas aprobadas; evidencias complementarias pendientes |

## 2. Objetivo

Consolidar la trazabilidad de los procedimientos PA-03.1 y PA-03.2 mediante los casos de prueba implementados, los resultados de ejecución y los cambios registrados en Git.

Este documento permite relacionar las actividades de diagnóstico, implementación y validación funcional con evidencias verificables del proyecto EcoAula.

## 3. Matriz de trazabilidad

| ID | Procedimiento | Caso de prueba | Resultado | Evidencia técnica |
|---|---|---|---|---|
| CP-PA03-01 | PA-03.1 | Impedir retirar el rol requerido por un perfil académico | Aprobado | Prueba Pest y commit `7e7c9de` |
| CP-PA03-02 | PA-03.2 | Conservar permisos después de una actualización rechazada | Aprobado | Prueba Pest y commit `7e7c9de` |
| CP-PA03-03 | PA-03.2 | Verificar ordenamiento y paginación de auditorías | Aprobado | Prueba Pest y commit `7e7c9de` |

## 4. Evidencia de implementación

**Archivo incorporado:**

`backend/tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php`

**Commit técnico:** `7e7c9de`

**Mensaje:**

`test(apoyo): agregar pruebas de usuarios roles y auditoria PA-03`

**Rama:** `feature/macro-apoyo`

El commit añadió un único archivo nuevo con 162 líneas de pruebas.

No se modificaron los controladores, servicios ni las pruebas originales del proyecto.

## 5. Evidencia de ejecución

### 5.1. Ejecución inicial

Se ejecutó el archivo de pruebas complementarias de PA-03.

Resultado:

| Indicador | Valor |
|---|---|
| Pruebas ejecutadas | 3 |
| Pruebas aprobadas | 2 |
| Pruebas fallidas | 1 |
| Aserciones | 18 |
| Duración | 1.85 segundos |

La incidencia se presentó en CP-PA03-02.

### 5.2. Incidencia y corrección

La prueba esperaba un error de validación asociado con `permissions`.

Sin embargo, Laravel respondió con el campo `permissions.1`, identificando el segundo elemento inválido del arreglo.

Se corrigió la aserción del archivo de pruebas para verificar `permissions.1`.

Posteriormente, el desarrollador confirmó que las tres pruebas complementarias aprobaron.

No fue necesario modificar la lógica de negocio.

### 5.3. Regresión conjunta

Se ejecutaron:

- `Sprint1Test.php`
- `AutenticacionAdicionalTest.php`
- `PA03UsuariosAuditoriaTest.php`

Comando utilizado:

```powershell
docker compose --profile testing run --rm -v "./backend/.env.testing:/var/www/html/.env:ro" backend-test php vendor/bin/pest tests/Feature/Sprint1Test.php tests/Feature/AutenticacionAdicionalTest.php tests/Feature/ApoyoInstitucional/PA03UsuariosAuditoriaTest.php --compact
```

**Resultados verificados:**

| Indicador | Resultado |
|---|---|
| Pruebas aprobadas | 68 |
| Pruebas fallidas | 0 |
| Aserciones | 255 |
| Duración | 33.47 segundos |
| Base de datos | `zarate_test` |

El total incluye las pruebas originales de autenticación y usuarios junto con las tres pruebas adicionales.

## 6. Evidencia del análisis técnico

| Archivo revisado | Aspecto evaluado |
|---|---|
| `UserController.php` | Registro, consulta, actualización y desactivación de usuarios |
| `RoleController.php` | Gestión y protección de permisos |
| `AuditController.php` | Consulta autorizada de auditorías |
| `UserService.php` | Integridad de roles, delegación y transacciones |
| `AuditLog.php` | Modelo y aislamiento institucional de auditorías |
| `Sprint1Test.php` | Pruebas existentes de autenticación, usuarios y permisos |
| `AutenticacionAdicionalTest.php` | Pruebas adicionales de autenticación |
| `Sprint3Test.php` | Pruebas de perfiles académicos y roles |

## 7. Documentación AI-DLC

| Documento | Propósito |
|---|---|
| `prompt-01-diagnostico.md` | Identificar funcionalidades, riesgos y cobertura existente |
| `prompt-02-implementacion.md` | Documentar las pruebas complementarias y su implementación |
| `prompt-03-pruebas.md` | Registrar ejecuciones, incidencia, corrección y regresión |
| `evidencias.md` | Consolidar los resultados y su trazabilidad |

**Observación:** estos documentos son informes retrospectivos del trabajo realizado. No contienen necesariamente transcripciones literales de los prompts originales.

La recuperación o referencia de dichos prompts queda pendiente para completar la trazabilidad del uso de IA.

## 8. Hallazgos de calidad

### 8.1. Integridad de perfiles y roles

CP-PA03-01 verificó que el sistema rechaza una modificación que intenta retirar un rol requerido por el perfil académico del usuario.

### 8.2. Conservación de permisos

CP-PA03-02 comprobó que una operación rechazada no altera la lista original de permisos.

### 8.3. Consulta de auditoría

CP-PA03-03 comprobó la consulta de registros mediante orden descendente y paginación de 20 elementos.

Estas verificaciones respaldan los escenarios evaluados, pero no constituyen una auditoría integral de seguridad del sistema.

## 9. Evidencias complementarias pendientes

- Captura verificable de la ejecución de Pest.
- Transcripción o referencia a los prompts originales utilizados.
- Relación entre procedimientos, casos y criterios de aceptación.
- Incorporación de los resultados a la matriz de doble entrada.
- Verificación de los requisitos aplicables de ISO 9001.

No se consideran disponibles las capturas hasta comprobar su existencia.

## 10. Relación preliminar con la gestión de calidad

Las actividades documentadas pueden servir como evidencia de prácticas de control de cambios, verificación funcional, evaluación de resultados y conservación de información documentada.

La correspondencia con cláusulas específicas de ISO 9001 se determinará posteriormente mediante la matriz del proyecto.

Las pruebas aprobadas no acreditan una certificación ISO 9001.

## 11. Conclusión

BOLT-APO-003 consolida los resultados del diagnóstico y la implementación de tres pruebas complementarias relacionadas con la administración de usuarios, roles, permisos y auditoría.

La regresión conjunta finalizó con 68 pruebas aprobadas y 255 aserciones, sin fallos.

Los resultados están vinculados con el commit `7e7c9de`, permitiendo identificar el archivo de pruebas incorporado.

La documentación constituye una base para completar la trazabilidad AI-DLC y la futura matriz de doble entrada relacionada con ISO 9001.