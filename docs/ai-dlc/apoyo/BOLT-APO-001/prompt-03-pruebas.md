# BOLT-APO-001 — Ejecución y validación de pruebas funcionales

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-001 |
| Procedimientos | PA-01.1 y PA-01.2 |
| Actividad | Pruebas funcionales y regresión |
| Framework de pruebas | Pest (Laravel) |
| Entorno | Docker y MySQL de pruebas |
| Base de datos | `zarate_test` |
| Fecha de documentación | 03/11/2026 |

## 2. Objetivo

Verificar que las pruebas funcionales complementarias del módulo de Secretaría se ejecuten satisfactoriamente y que su incorporación no provoque fallos en las pruebas existentes.

## 3. Casos de prueba implementados

| ID | Caso de prueba | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| CP-PA01-01 | Registrar solicitud con tipo inactivo | HTTP 422; no crear solicitud | Aprobado |
| CP-PA01-02 | Registrar documento asociado a otro estudiante | HTTP 422; no crear documento | Aprobado |
| CP-PA01-03 | Cancelar repetidamente un documento | Primera cancelación aceptada; segunda rechazada | Aprobado |

Archivo ejecutado:

`backend/tests/Feature/ApoyoInstitucional/PA01SecretariaTest.php`

## 4. Entorno de pruebas

Las pruebas se ejecutaron utilizando:

- Laravel y Pest.
- Docker Compose con perfil `testing`.
- Contenedor `backend-test`.
- Contenedor MySQL de pruebas.
- Base de datos `zarate_test`.
- Transacciones de base de datos para aislar los escenarios.
- Contexto institucional para limitar las consultas y operaciones a la institución correspondiente.

No se utilizaron datos reales de estudiantes para los escenarios desarrollados.

## 5. Primera ejecución: detección de incidencia

Inicialmente, el archivo no fue localizado dentro del contenedor Docker.

Se verificó que existía en el equipo local, pero no estaba presente en la imagen utilizada por `backend-test`.

Después de reconstruir la imagen, Pest consiguió ejecutar las pruebas.

### Resultado inicial

- 2 pruebas aprobadas.
- 1 prueba fallida.
- 12 aserciones.
- Duración: 1.77 segundos.

La prueba fallida fue CP-PA01-03.

El error correspondía a una excepción `ModelNotFoundException` durante la consulta final del documento.

### Corrección aplicada

Se incorporó `InstitutionContext` en la consulta que verificaba el estado final del documento.

Esta corrección se aplicó únicamente al archivo nuevo de pruebas, sin modificar `DocumentService.php` ni `OfficeController.php`.

Posteriormente, el desarrollador confirmó que las tres pruebas adicionales aprobaron.

## 6. Regresión con las pruebas existentes

Se ejecutaron conjuntamente:

- `Sprint9Test.php`.
- `PA01SecretariaTest.php`.

Comando utilizado:

```powershell
docker compose --profile testing run --rm -v "./backend/.env.testing:/var/www/html/.env:ro" backend-test php vendor/bin/pest tests/Feature/Sprint9Test.php tests/Feature/ApoyoInstitucional/PA01SecretariaTest.php --compact
```

### Resultado registrado

| Indicador | Resultado |
|---|---|
| Pruebas ejecutadas | 13 |
| Pruebas aprobadas | 13 |
| Pruebas fallidas | 0 |
| Aserciones | 135 |
| Duración | 6.99 segundos |

La regresión confirmó que las pruebas nuevas y las existentes se ejecutaron conjuntamente sin registrar fallos.

## 7. Verificación del repositorio

Se utilizaron los siguientes comandos:

```powershell
git status --short --branch
git diff --cached --stat
git diff --cached --check
```

El archivo nuevo fue incorporado mediante Git y se registró el commit:

`7bf4b5d — test(apoyo): agregar pruebas funcionales de secretaria PA-01`

El commit agregó únicamente:

`backend/tests/Feature/ApoyoInstitucional/PA01SecretariaTest.php`

No se modificaron los controladores ni las pruebas originales.

## 8. Participación de inteligencia artificial

ChatGPT brindó asistencia para:

- Diseñar los escenarios complementarios.
- Elaborar el código inicial de pruebas.
- Interpretar las salidas de Pest.
- Diagnosticar el problema de acceso al archivo dentro de Docker.
- Proponer la corrección asociada al contexto institucional.

La ejecución y confirmación de resultados se efectuaron en el entorno de desarrollo del proyecto.

**Nota de trazabilidad:** este documento es un registro retrospectivo. El texto literal de los prompts originales deberá incorporarse o referenciarse posteriormente; no se presenta esta descripción como una transcripción exacta.

## 9. Evidencias disponibles y pendientes

**Disponibles:**

- Archivo de pruebas en el repositorio local.
- Commit `7bf4b5d`.
- Resultado de regresión comunicado en la terminal.
- Registro de los errores y correcciones en la conversación de trabajo.

**Pendientes de organizar:**

- Captura del resultado de Pest, si se conserva o se vuelve a ejecutar.
- Referencias a los prompts literales.
- Identificación de las evidencias según la matriz del proyecto.

## 10. Conclusión

Las tres pruebas adicionales de Secretaría fueron aprobadas y se ejecutaron satisfactoriamente junto con las diez pruebas existentes de Sprint 9.

La evidencia disponible permite afirmar que los escenarios probados funcionaron correctamente en el entorno utilizado.

No se afirma una cobertura funcional completa ni el cumplimiento certificado de ISO 9001. La trazabilidad hacia los criterios de calidad se realizará en la matriz correspondiente.