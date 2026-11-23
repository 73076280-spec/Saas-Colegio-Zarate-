# PROMPT 28 — HABILITACIÓN SEGURA DE FIXTURES Y PRUEBAS TRANSACCIONALES PEST

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4, MySQL 8.4, Pest, pruebas de integración y seguridad de datos.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa desde el resultado exitoso del Prompt 27. No reinicies el proyecto ni descartes los avances existentes.**

## 1. CONTEXTO ACTUAL

EcoAula SaaS ya cuenta con:

- 14/14 migraciones originales verificadas.
- 52 tablas en `zarate_pest`.
- Cuenta MySQL exclusiva de pruebas.
- TLS obligatorio.
- Aislamiento frente a `zarate_dev` y `zarate_test`.
- 25 comprobaciones offline aprobadas.
- Dos denegaciones reales de acceso a las bases protegidas.
- Launcher Pest habilitado para HealthTest.
- Cuatro pruebas Pest ejecutadas y aprobadas.
- Seis aserciones verificadas.
- 310 casos restantes sin ejecutar.

El Prompt 27 identificó los siguientes pendientes:

1. Adaptar el contrato de fixtures a `zarate_pest`.
2. Habilitar y validar operaciones DML.
3. Comprobar transacciones y rollback.
4. Ampliar gradualmente la selección de pruebas.
5. Resolver posteriormente dos casos que requieren seeders de demostración.

## 2. OBJETIVO PRINCIPAL

Preparar y validar la infraestructura de pruebas Pest que utiliza datos temporales mediante factories y fixtures.

El objetivo NO es ejecutar inmediatamente los 310 casos restantes.

Primero debemos demostrar que Laravel puede crear, consultar y modificar datos sintéticos dentro de `zarate_pest` y revertir los cambios sin afectar las bases protegidas.

Después, si todo funciona correctamente, ejecutar entre tres y cinco casos Pest adicionales que representen operaciones reales del backend.

## 3. FASE A — INSPECCIÓN DEL ESTADO

Antes de realizar escrituras:

1. Confirmar rama y estado de Git.
2. Leer las evidencias completas de los Prompts 26 y 27.
3. Inspeccionar el launcher privado habilitado.
4. Revisar `tests/Pest.php`.
5. Revisar `phpunit.xml`.
6. Analizar los traits utilizados por las pruebas.
7. Identificar el funcionamiento de `RefreshDatabase`, `DatabaseTransactions` y `DatabaseMigrations` en este proyecto.
8. Revisar factories, fixtures, dependencias y conexiones utilizadas.
9. Identificar cuáles de los 310 casos pendientes pueden ejecutar transacciones sin operaciones destructivas.
10. Conservar los cambios funcionales y documentales anteriores.

No modificar las migraciones originales.

No restaurar configuraciones antiguas sobre las actuales.

## 4. FASE B — CONFIGURACIÓN DE PRUEBAS

Adaptar el launcher privado para utilizar exclusivamente:

- Host `127.0.0.1`.
- Puerto `3308`.
- Base `zarate_pest`.
- Usuario exclusivo ya creado.
- TLS obligatorio.
- `APP_ENV=testing`.

Verificar estos valores desde el proceso PHP que realmente ejecutará Pest.

No confiar únicamente en variables de entorno declaradas.

Rechazar la ejecución si la identidad de conexión no coincide con el entorno autorizado.

Conservar intactos los servicios de desarrollo de los puertos 3307, 8000 y 5173.

## 5. FASE C — HABILITAR FIXTURES CONTROLADOS

Revisar las factories existentes y preparar los datos sintéticos mínimos necesarios para las pruebas.

Priorizar fixtures pequeños y reutilizables.

Verificar:

- Instituciones de prueba.
- Usuarios y roles.
- Estudiantes.
- Docentes.
- Apoderados.
- Relaciones institucionales.
- Matrículas.
- Cursos.

No es obligatorio crear todos estos datos en esta fase: preparar únicamente los necesarios para los casos seleccionados.

No copiar información real desde `zarate_dev`.

No ejecutar los seeders de demostración.

No modificar globalmente las factories para ocultar errores.

Si es necesario corregir una factory defectuosa, documentar el problema y agregar una prueba que compruebe su comportamiento.

## 6. FASE D — PRUEBAS DE DML Y TRANSACCIONES

Verificar primero mediante pruebas controladas:

1. Conexión efectiva a `zarate_pest`.
2. Inicio de una transacción.
3. Inserción de un registro sintético válido.
4. Consulta de ese registro.
5. Actualización del registro si la estructura lo permite.
6. Ejecución de `ROLLBACK`.
7. Confirmación de que los cambios transaccionales fueron revertidos.
8. Integridad referencial.
9. Ausencia de residuos persistentes.
10. Conservación del esquema de 52 tablas.

La verificación debe considerar:

- Escrituras que utilizan más de una conexión.
- Eventos y listeners.
- Jobs.
- Auditoría.
- Triggers y efectos secundarios.
- Operaciones que realizan commits explícitos.
- DDL o comandos que provocan commits implícitos.
- Limpieza de datos que no participa de una transacción.

Si se detectan efectos que no puedan revertirse con seguridad, detener las pruebas afectadas.

No cambiar los permisos de la cuenta para forzar el resultado.

## 7. FASE E — ADAPTACIÓN DEL LAUNCHER

Una vez comprobadas las transacciones:

1. Ampliar el launcher para permitir una lista explícita de pruebas autorizadas.
2. Mantener bloqueada la ejecución indiscriminada de la suite completa.
3. Comprobar identidad, TLS y permisos antes de cada ejecución.
4. Evitar que PHPUnit o Laravel seleccionen una base diferente.
5. Verificar el comportamiento de los hooks de preparación y cierre.
6. Garantizar limpieza de fixtures dentro del mecanismo transaccional validado.
7. Registrar resultados reales en JUnit y logs privados.

No desactivar `RefreshDatabase` o los controles de las pruebas de manera general.

Si algún caso necesita reconstruir el esquema, excluirlo de esta ejecución y documentar el requisito.

## 8. FASE F — EJECUCIÓN DE PRUEBAS PEST ADICIONALES

Si todas las comprobaciones anteriores aprueban, seleccionar entre tres y cinco casos reales del proyecto que utilicen operaciones DML y sean compatibles con transacciones seguras.

Priorizar una representación de:

- Autenticación y permisos.
- Matrículas.
- Gestión académica.
- Relaciones entre estudiantes y apoderados.
- Restricciones de acceso institucional.

No es obligatorio cubrir todos los módulos en esta ejecución pequeña.

Ejecutar los casos secuencialmente, sin paralelismo.

Para cada caso:

1. Confirmar el destino real.
2. Preparar los fixtures mínimos.
3. Ejecutar el test.
4. Registrar resultado y aserciones.
5. Verificar rollback.
6. Comprobar ausencia de residuos.
7. Confirmar que las bases protegidas permanecen fuera del alcance.

Ante cualquier efecto inesperado, detenerse.

No realizar reintentos automáticos que puedan duplicar escrituras.

## 9. FASE G — PREPARACIÓN DE LOS CASOS CON SEEDERS

Identificar los dos casos que requieren seeders de demostración.

No ejecutarlos en esta fase.

Determinar:

- Qué datos necesitan.
- Si pueden utilizar factories sintéticas.
- Si dependen de información específica del demo.
- Qué cambios serían necesarios para aislarlos.
- Si su ejecución requeriría autorización adicional.

No modificar el comportamiento funcional solo para adaptar los tests.

## 10. RESTRICCIONES OBLIGATORIAS

Prohibido:

- Modificar `zarate_dev`.
- Modificar `zarate_test`.
- Ejecutar `migrate:fresh`.
- Ejecutar `db:wipe`.
- Ejecutar `migrate:rollback`.
- Eliminar tablas.
- Reconstruir bases existentes.
- Ejecutar seeders de demostración.
- Modificar las migraciones originales.
- Desactivar TLS.
- Eliminar o debilitar guardas.
- Ampliar privilegios MySQL automáticamente.
- Ejecutar Pest en paralelo.
- Ejecutar los 310 casos restantes en bloque.
- Ejecutar Cypress.
- Realizar commits o push automáticamente.

No incluir credenciales ni datos privados en los reportes.

## 11. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-28-fixtures-transacciones-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-fixtures-transacciones-pest.md`

Documentar:

- Estado inicial.
- Cambios en el launcher.
- Contrato de fixtures.
- Pruebas de inserción y actualización.
- Verificación de rollback.
- Resultados de guardas.
- Pruebas Pest adicionales.
- Aserciones ejecutadas.
- Integridad del esquema.
- Residuos detectados o ausencia de ellos.
- Bases protegidas.
- Archivos modificados.
- Estado de Git.

Distinguir pruebas reales de Pest de comprobaciones auxiliares del launcher.

## 12. INFORME FINAL

Entregar una tabla:

| Componente | Resultado | Evidencia |
|---|---|---|
| Launcher ampliado | Real | Real |
| DML permitido y verificado | Real | Real |
| Transacciones | Real | Real |
| Rollback | Real | Real |
| Fixtures | Real | Real |
| Pruebas Pest adicionales | Real | Real |
| Casos aprobados | Real | Real |
| Casos fallidos | Real | Real |
| Pruebas pendientes | Real | Real |
| 52 tablas conservadas | Real | Real |
| Bases protegidas | Real | Real |

Concluir indicando:

1. Número de casos Pest ejecutados en esta intervención.
2. Total acumulado de pruebas distintas aprobadas.
3. Total de aserciones.
4. Resultado de las verificaciones de seguridad.
5. Estado de los fixtures.
6. Estado del rollback.
7. Casos todavía bloqueados.
8. Cambios realizados.
9. Posibilidad de ampliar la ejecución por módulos.
10. Próximo paso recomendado.

Clasificar el resultado como:

**A. FIXTURES Y TRANSACCIONES VALIDADOS — PRUEBAS ADICIONALES APROBADAS.**

**B. INFRAESTRUCTURA HABILITADA — INCIDENCIAS FUNCIONALES DETECTADAS.**

**C. TRANSACCIONES PARCIALMENTE HABILITADAS — PRUEBAS PENDIENTES.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

No ejecutar la regresión completa todavía.

**Objetivo: avanzar de cuatro pruebas Pest aprobadas a pruebas de integración reales con datos transaccionales, manteniendo estrictamente protegido el entorno de EcoAula SaaS.**