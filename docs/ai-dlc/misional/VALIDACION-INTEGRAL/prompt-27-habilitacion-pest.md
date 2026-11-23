# PROMPT 27 — HABILITACIÓN SEGURA DEL LAUNCHER PEST Y PRUEBAS INICIALES

Actúa como ingeniero senior de QA, Laravel 13, PHP 8.4, MySQL 8.4, Pest y seguridad de bases de datos.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**No comenzar desde cero. Continuar desde el último resultado del Prompt 26 y su autorización de preparación del entorno Pest.**

## 1. ESTADO ACTUAL VERIFICADO

Se completó la preparación de una base independiente para pruebas.

Resultados:

- Base `zarate_pest` creada en MySQL aislado, puerto 3308.
- Cuenta exclusiva con TLS obligatorio.
- Ocho privilegios limitados a `zarate_pest`, sin privilegio `DROP`.
- 14 migraciones originales aplicadas y verificadas.
- 52 tablas con esquema equivalente a la referencia.
- 45 comprobaciones offline aprobadas.
- Dos denegaciones reales de acceso a `zarate_dev` y `zarate_test`.
- Servidor y TLS verificados.
- Bases existentes protegidas.
- Ningún caso Pest ejecutado todavía.
- 314 casos Pest descubiertos.

Pendientes:

1. Habilitar el launcher seguro de Pest.
2. Adaptar las referencias de fixtures y configuración al entorno `zarate_pest`.
3. Comprobar que los tests no reconstruyan bases protegidas.
4. Realizar una primera ejecución pequeña y controlada.
5. Preparar el procedimiento para la suite integral.

## 2. OBJETIVO

Preparar una ejecución segura de Pest utilizando exclusivamente `zarate_pest`.

No ejecutar todavía los 314 casos.

Primero realizar una revisión de riesgos y, únicamente si se cumplen todas las verificaciones, ejecutar un pequeño grupo de pruebas representativas.

## 3. FASE A — REVISIÓN DEL LAUNCHER

Inspeccionar:

- Scripts dentro de `.tools/misional-isolated`.
- Archivos creados durante el Prompt 26.
- `phpunit.xml`.
- `tests/Pest.php`.
- Configuración de conexiones Laravel.
- Variables del entorno de pruebas.
- Factories y fixtures.
- Traits utilizados por los tests.
- Bootstrap de PHPUnit/Pest.
- Comandos ejecutados automáticamente antes de los tests.

Identificar exactamente qué impide ejecutar Pest con la nueva base.

No sustituir configuraciones del entorno de desarrollo.

No modificar archivos `.env` de demostración.

No modificar las migraciones originales.

## 4. FASE B — ANALIZAR EL COMPORTAMIENTO DE LOS TESTS

Revisar los 314 casos descubiertos y clasificarlos según su impacto sobre la base de datos.

Identificar:

- Tests que utilizan `RefreshDatabase`.
- Tests que utilizan `DatabaseTransactions`.
- Tests que utilizan `DatabaseMigrations`.
- Tests que ejecutan SQL directamente.
- Tests que requieren seeders o fixtures.
- Tests que realizan inserciones, actualizaciones o eliminaciones.
- Tests que ejecutan DDL o `TRUNCATE`.
- Tests que dependen de múltiples conexiones o transacciones.
- Tests que requieren reconstrucción de tablas.
- Tests que pueden funcionar con el esquema ya existente.

Explicar qué mecanismo de limpieza y aislamiento utiliza cada grupo.

No asumir que `RefreshDatabase` es seguro únicamente porque se utiliza en pruebas Laravel.

No cambiar ni desactivar indiscriminadamente los traits para conseguir ejecuciones artificialmente exitosas.

## 5. FASE C — HABILITAR LA CONEXIÓN SEGURA

Configurar un mecanismo explícito para que Pest utilice solamente:

- Servidor MySQL aislado.
- Puerto 3308.
- Base `zarate_pest`.
- Cuenta exclusiva de pruebas.
- TLS obligatorio.
- Entorno Laravel `testing`.

Verificar la conexión efectiva desde el proceso PHP que ejecutará Pest.

No confiar únicamente en el contenido de los archivos de configuración.

Mantener vigentes las guardas de identidad, usuario, puerto, base y directorio físico.

No permitir redireccionamientos automáticos hacia otras bases.

Los secretos deben permanecer en recursos privados excluidos de Git.

Si es necesario modificar los scripts locales, realizar cambios mínimos y auditables.

## 6. FASE D — VERIFICAR LA SEGURIDAD DEL CICLO DE PRUEBAS

Antes de ejecutar cualquier caso:

1. Verificar identidad de la base.
2. Confirmar que no existen referencias peligrosas a `zarate_dev` o `zarate_test`.
3. Identificar comandos que intenten eliminar o reconstruir tablas.
4. Confirmar que la cuenta de pruebas carece de privilegios sobre otras bases.
5. Comprobar TLS.
6. Verificar que las guardas rechazan conexiones incorrectas.
7. Confirmar que la limpieza de fixtures, si se realiza, está permitida y limitada a `zarate_pest`.
8. Comprobar que el esquema inicial está completo.

No ampliar automáticamente los privilegios de la cuenta.

No conceder `DROP` para solucionar fallos de `RefreshDatabase`.

No utilizar mecanismos de limpieza destructiva sin autorización específica.

Si la suite requiere reconstrucción destructiva, documentar el problema y detener ese grupo de tests.

## 7. FASE E — PRIMERA EJECUCIÓN CONTROLADA

Solo cuando las comprobaciones anteriores aprueben:

Seleccionar entre tres y cinco casos Pest representativos que sean compatibles con el entorno existente.

Condiciones:

- Deben ser pruebas reales del proyecto.
- Deben ejecutar afirmaciones funcionales.
- Deben tener efectos controlados.
- No deben requerir operaciones destructivas.
- Debe existir un procedimiento de aislamiento de datos válido.
- No deben comprometer las otras bases.

Ejecutar cada caso de forma controlada.

Registrar:

- Nombre del test.
- Módulo.
- Resultado.
- Aserciones.
- Duración.
- Consultas o efectos relevantes.
- Estado de la base después de la ejecución.

Si no existe ningún caso seguro, no ejecutar ninguno: documentar el bloqueo y proponer la solución concreta.

No declarar éxito por ejecutar solamente una comprobación del launcher.

## 8. FASE F — PREPARAR LA SUITE INTEGRAL

Sin ejecutarla todavía, determinar cómo realizar las pruebas restantes de forma segura.

Preparar un plan por módulos:

1. Autenticación y seguridad.
2. Matrículas.
3. Enseñanza-aprendizaje.
4. Evaluaciones y calificaciones.
5. Asistencia y justificaciones.
6. Comunicaciones y solicitudes.
7. Regresión general.

Identificar las pruebas que requieren adaptaciones y los cambios necesarios.

Distinguir:

- Problemas de infraestructura.
- Problemas de fixtures.
- Fallos reales del código funcional.
- Pruebas incompatibles con las restricciones actuales.

No modificar pruebas para ocultar defectos.

## 9. PROHIBICIONES

No ejecutar:

- `migrate:fresh`.
- `db:wipe`.
- `migrate:rollback`.
- `DROP DATABASE`.
- `DROP TABLE`.
- Seeders de demostración.
- Reconstrucciones de bases protegidas.

No modificar:

- `zarate_dev`.
- `zarate_test`.
- Credenciales existentes.
- Migraciones originales.
- Servicios de demostración.
- Reglas académicas de EcoAula.

No realizar commits ni push automáticamente.

No ejecutar Cypress.

No ejecutar todavía la suite Pest completa de 314 casos.

## 10. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-27-habilitacion-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-habilitacion-pest.md`

Documentar:

- Estado inicial.
- Diagnóstico del launcher.
- Clasificación de tests según riesgo.
- Modificaciones de configuración.
- Resultados de pruebas de seguridad.
- Casos Pest ejecutados.
- Resultados y aserciones reales.
- Estado SQL posterior.
- Archivos modificados.
- Estado de Git.
- Riesgos pendientes.

No registrar contraseñas ni información privada.

## 11. INFORME FINAL

Entregar una tabla:

| Componente | Resultado | Evidencia |
|---|---|---|
| Launcher Pest | Real | Real |
| Conexión `zarate_pest` | Real | Real |
| Guardas de seguridad | Real | Real |
| Fixtures | Real | Real |
| Casos ejecutados | Real | Real |
| Casos aprobados | Real | Real |
| Casos fallidos | Real | Real |
| Casos bloqueados | Real | Real |
| Estado de las 52 tablas | Real | Real |
| Bases protegidas | Real | Real |

Concluir con una de estas clasificaciones:

**A. LAUNCHER HABILITADO — PRUEBAS INICIALES APROBADAS.**

**B. LAUNCHER HABILITADO — INCIDENCIAS EN PRUEBAS.**

**C. CONFIGURACIÓN PREPARADA — PRUEBAS TODAVÍA BLOQUEADAS.**

**D. BLOQUEADO POR SEGURIDAD.**

Indicar exactamente qué falta para ejecutar la suite completa de los 314 casos.

**Prioridad: ejecutar las primeras pruebas reales de Pest de manera segura, sin alterar las bases protegidas ni comprometer el esquema verificado.**