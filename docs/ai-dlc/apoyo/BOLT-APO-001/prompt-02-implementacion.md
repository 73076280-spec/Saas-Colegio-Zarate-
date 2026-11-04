# BOLT-APO-001 — Implementación de pruebas complementarias de Secretaría

## 1. Identificación

| Campo | Descripción |
|---|---|
| Proyecto | EcoAula — SaaS de gestión académica del Colegio Zárate |
| Macroproceso | MA-01: Gestión de apoyo institucional |
| Bolt | BOLT-APO-001 |
| Procedimientos | PA-01.1 y PA-01.2 |
| Actividad | Implementación de pruebas funcionales complementarias |
| Herramientas | ChatGPT, Visual Studio Code, Laravel, Pest, Docker y Git |
| Fecha del registro | 03/11/2026 |

## 2. Objetivo

Incorporar pruebas automatizadas adicionales para verificar restricciones y reglas de negocio de la gestión de solicitudes y documentos académicos.

La implementación debía conservar las pruebas existentes y evitar modificaciones innecesarias en controladores y servicios.

## 3. Alcance de la implementación

Se desarrolló un archivo independiente:

`backend/tests/Feature/ApoyoInstitucional/PA01SecretariaTest.php`

Este archivo contiene tres pruebas funcionales complementarias.

| ID | Caso de prueba | Resultado esperado |
|---|---|---|
| CP-PA01-01 | Registro de solicitud con tipo inactivo | HTTP 422; solicitud no registrada |
| CP-PA01-02 | Documento asociado a una solicitud de otro estudiante | HTTP 422; documento no registrado |
| CP-PA01-03 | Cancelación repetida de documento | Primera cancelación aceptada; segunda rechazada con HTTP 422 |

## 4. Estrategia técnica

Se utilizaron las siguientes características:

- **Pest:** definición y ejecución de pruebas automatizadas.
- **Laravel HTTP Testing:** simulación de solicitudes a los endpoints del sistema.
- **DatabaseTransactions:** aislamiento de los cambios realizados durante cada prueba.
- **InstitutionContext:** consultas y operaciones asociadas a la institución de prueba.
- **RolePermissionSeeder:** preparación de roles y permisos.
- **Docker:** ejecución en el entorno de pruebas.
- **MySQL:** base de datos `zarate_test`.

El archivo se creó en una carpeta independiente para facilitar su identificación y mantenimiento.

## 5. Implementación de los escenarios

### CP-PA01-01 — Tipo de solicitud inactivo

Se preparó un tipo de solicitud con estado `INACTIVE`.

Posteriormente se intentó registrar una solicitud utilizando dicho tipo.

La prueba verifica que el sistema rechace la operación y que no se incremente la cantidad de solicitudes registradas.

### CP-PA01-02 — Documento asociado a otro estudiante

Se creó una solicitud académica y un segundo estudiante.

Después se intentó registrar un documento relacionando la solicitud con un estudiante diferente al que correspondía.

La prueba verifica que el sistema rechace la asociación y no cree el documento.

### CP-PA01-03 — Cancelación repetida

Se registró un documento académico y se solicitó su cancelación.

La primera operación debía finalizar correctamente, dejando el documento en estado `CANCELLED`.

Posteriormente se realizó un segundo intento de cancelación, que debía rechazarse.

La prueba también consulta el documento para comprobar que conserve el estado `CANCELLED`.

## 6. Incidencias durante la implementación

### 6.1. Archivo no detectado por Docker

Durante la primera ejecución, Pest informó que no encontraba `PA01SecretariaTest.php`.

Se comprobó que el archivo existía en Windows, pero no estaba disponible dentro del contenedor de pruebas.

Se reconstruyó la imagen de `backend-test`, permitiendo ejecutar el archivo.

### 6.2. Consulta fuera del contexto institucional

En la primera ejecución se obtuvieron dos pruebas aprobadas y una fallida.

La tercera prueba produjo una excepción `ModelNotFoundException` al consultar el documento después de su cancelación.

Se corrigió la consulta final para ejecutarla dentro del contexto institucional mediante `InstitutionContext`.

Después de la corrección, las tres pruebas adicionales aprobaron.

Estas incidencias correspondieron a la preparación y ejecución de las pruebas, sin que se demostrara un defecto en la lógica de negocio de los servicios.

## 7. Control de cambios

La implementación se realizó en la rama:

`feature/macro-apoyo`

Se incorporó un archivo nuevo de pruebas, sin modificar los controladores, servicios ni pruebas originales.

El cambio quedó registrado mediante el commit local:

`7bf4b5d — test(apoyo): agregar pruebas funcionales de secretaria PA-01`

## 8. Participación de la inteligencia artificial

ChatGPT asistió en:

- La propuesta de escenarios complementarios.
- La elaboración del código inicial de pruebas.
- La interpretación de errores de ejecución.
- La propuesta de corrección de la consulta institucional.

El desarrollador ejecutó los comandos, verificó los resultados, aplicó las correcciones y confirmó el funcionamiento.

**Trazabilidad de prompts:** el texto literal completo de las instrucciones de la conversación deberá registrarse o referenciarse por separado. Este documento describe retrospectivamente la actividad y no constituye una transcripción literal del prompt original.

## 9. Resultado

Se incorporaron tres pruebas adicionales en el módulo de Secretaría.

La regresión conjunta con `Sprint9Test.php` finalizó con:

- 13 pruebas aprobadas.
- 135 aserciones.
- 0 fallos.
- Duración: 6.99 segundos.

## 10. Conclusión

La implementación permitió complementar la cobertura funcional de Secretaría mediante escenarios negativos relacionados con tipos de solicitud inactivos, integridad de asociaciones y cancelación de documentos.

El desarrollo se realizó de forma aislada, manteniendo los archivos originales y registrando los cambios mediante Git.