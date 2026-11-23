# PROMPT 34 — VALIDACIÓN INTEGRAL DE PERSONAS, UNICIDAD INSTITUCIONAL Y PERMISOS

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4, MySQL 8.4, Pest, seguridad multiinstitucional y aseguramiento de calidad.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa desde el cierre exitoso del Prompt 33. No comiences desde cero, no descartes modificaciones existentes y no repitas innecesariamente las verificaciones ya acreditadas.**

## 1. ESTADO ACTUAL

El Prompt 33 finalizó con **A. LOTE AMPLIADO APROBADO**.

Resultados acumulados:

- 314 casos Pest inventariados.
- 66 casos distintos aprobados.
- 377 aserciones acreditadas.
- 248 casos pendientes.
- 26 casos nuevos aprobados en el Prompt 33.
- 26 rollbacks verificados y cero residuos.
- 52 tablas y 14 migraciones conservadas.
- MySQL aislado en `127.0.0.1:3308`.
- Base exclusiva `zarate_pest`.
- TLS e identidad efectiva verificados.
- Bases `zarate_dev` y `zarate_test` protegidas.
- Guarda de autorización de 120 segundos.
- Verificador nativo optimizado, validado en el entorno Windows x64 actual.
- Sin expiraciones ni reintentos durante el último lote.
- Sin cambios funcionales, commits ni push.

## 2. OBJETIVO

Ampliar las pruebas funcionales reales de EcoAula SaaS, priorizando el manejo de personas y los permisos institucionales.

Seleccionar hasta **40 casos distintos nuevos**, únicamente si son compatibles con el launcher y las restricciones de seguridad existentes.

Prioridades:

1. Registro y validación de estudiantes.
2. Gestión de docentes.
3. Gestión de apoderados.
4. Relaciones familiares y académicas.
5. Unicidad de registros por institución.
6. Roles y permisos de Secretaría.
7. Aislamiento institucional.
8. Dependencias necesarias para el módulo de matrículas.

No inventar casos para alcanzar la meta numérica.

## 3. FASE A — RECUPERAR EL ESTADO

Antes de realizar operaciones:

- Comprobar rama actual y `git status`.
- Leer las evidencias de los Prompts 28–33.
- Identificar los 66 casos distintos ya acreditados.
- Recuperar el inventario de 248 casos pendientes.
- Inspeccionar el launcher y las guardas.
- Validar el verificador nativo en el Windows actual.
- Comprobar que no existen procesos MySQL aislados abandonados.
- Preservar los cambios y resultados históricos.

No ejecutar comandos que descarten trabajo.

No realizar commits ni push automáticamente.

## 4. FASE B — INVENTARIO Y CLASIFICACIÓN

Revisar los casos pendientes, especialmente las pruebas de Sprint 3 y los casos relacionados con permisos y personas.

Clasificarlos en:

**Grupo A — Compatibles inmediatamente**

Casos que utilizan INSERT, SELECT, UPDATE, `DatabaseTransactions` y rollback controlado.

**Grupo B — Compatibles con adaptación privada**

Casos que requieren adaptar exclusivamente el contrato de fixtures, conexión o launcher, sin alterar sus aserciones.

**Grupo C — Pendientes de autorización adicional**

Casos que requieren DELETE, reconstrucción de tablas, seeders de demostración, archivos privados, efectos externos u operaciones no cubiertas por la infraestructura validada.

Seleccionar únicamente casos seguros de los grupos A y B.

No habilitar automáticamente los casos del grupo C.

## 5. FASE C — VALIDACIÓN DE PERSONAS

Priorizar casos existentes relacionados con:

### Estudiantes

- Registro autorizado.
- Campos obligatorios.
- Documento de identidad y unicidad según reglas implementadas.
- Relaciones con institución.
- Validaciones de información académica.
- Rechazo de datos inválidos.

### Docentes

- Registro y consulta.
- Validaciones de información.
- Permisos institucionales.
- Restricciones de acceso a registros ajenos.

### Apoderados

- Registro y consulta.
- Vinculación con estudiantes.
- Relaciones familiares autorizadas.
- Restricciones de acceso a estudiantes no vinculados.
- Conservación de relaciones históricas.

### Unicidad institucional

- Prevención de duplicados prohibidos.
- Identificadores únicos por institución, cuando corresponda.
- Relaciones entre registros.
- Rechazo de referencias pertenecientes a otra institución.

Utilizar exclusivamente las reglas y pruebas que realmente existen en el repositorio.

## 6. FASE D — PERMISOS Y SEGURIDAD

Verificar que:

- Secretaría solamente realice operaciones autorizadas.
- Los docentes no administren personas o datos fuera de sus permisos.
- Los apoderados no accedan a estudiantes ajenos.
- Los estudiantes no accedan a información privada de otros usuarios.
- Los identificadores externos no permitan acceder a registros de otras instituciones.
- Laravel aplique la autorización en el backend.

No considerar suficiente que React oculte botones.

La autorización debe comprobarse en los endpoints o servicios correspondientes.

## 7. FASE E — VERIFICAR EL ENTORNO

Antes de cada ejecución:

- Host `127.0.0.1`.
- Puerto `3308`.
- Base `zarate_pest`.
- Usuario exclusivo de pruebas.
- TLS obligatorio.
- Entorno Laravel `testing`.
- Identidad efectiva del proceso.
- Directorio físico autorizado.
- Guarda de 120 segundos vigente.
- Migraciones y esquema correctos.

Las bases `zarate_dev` y `zarate_test` deben permanecer fuera del alcance.

Si el verificador nativo muestra incompatibilidades con Windows, detener la ejecución.

No omitir verificaciones para acelerar las pruebas.

## 8. FASE F — EJECUCIÓN PROGRESIVA

Preparar una lista de hasta 40 casos compatibles.

Ejecutar inicialmente cinco casos como comprobación de estabilidad.

Si aprueban y los controles de seguridad permanecen válidos, continuar mediante grupos de hasta diez casos, ejecutados secuencialmente.

**El tamaño del grupo no autoriza reutilizar una autorización vencida ni omitir verificaciones por caso.**

Para cada caso:

1. Verificar destino y autorización.
2. Confirmar que el filtro selecciona exactamente el caso original.
3. Preparar los fixtures correspondientes.
4. Ejecutar Pest.
5. Registrar las aserciones.
6. Confirmar rollback.
7. Comprobar cero residuos.
8. Verificar integridad del esquema.
9. Registrar duración y margen de autorización.
10. Conservar evidencia JUnit.

Detenerse ante cualquier error que comprometa la seguridad.

No reintentar automáticamente casos con fallos sin un diagnóstico.

## 9. FASE G — CONTROL DE INCIDENCIAS

Si aparece un fallo:

- Conservar el mensaje original.
- Distinguir entre error del launcher, fixtures y defecto funcional.
- Verificar rollback.
- Confirmar ausencia de residuos.
- Revisar conexiones secundarias y efectos externos.
- Documentar la causa cuando sea identificable.

No modificar pruebas para ocultar defectos.

No cambiar reglas de negocio sin una autorización posterior.

Los casos que necesiten DELETE, DDL, TRUNCATE o seeders permanecerán bloqueados.

## 10. FASE H — REGRESIÓN Y CONSOLIDACIÓN

Al finalizar:

- Contar casos distintos aprobados, sin duplicar reejecuciones.
- Registrar aserciones finales.
- Comprobar los rollbacks.
- Confirmar cero residuos.
- Verificar las 52 tablas y 14 migraciones.
- Confirmar TLS e identidad.
- Verificar las restricciones de las bases protegidas.
- Revisar las duraciones del verificador.
- Confirmar ausencia de expiraciones o registrar las que aparezcan.
- Actualizar el inventario restante.

Distinguir resultados de ejecución de Pest de los controles auxiliares de seguridad.

## 11. PREPARACIÓN DEL SIGUIENTE MACROPROCESO

Sin ejecutar todavía sus pruebas, identificar los casos pendientes relacionados con:

**Bolt 1 — Gestión de matrículas**

Revisar dependencias de:

- Estudiantes.
- Apoderados.
- Periodos académicos.
- Grados y secciones.
- Cupos.
- Estados de solicitudes.
- Validación económica.
- Permisos de Secretaría.
- Historial y auditoría.

Indicar cuáles pueden ejecutarse mediante el launcher actual y cuáles necesitan una adaptación adicional.

Preparar un plan para comenzar las pruebas funcionales de matrículas en el siguiente prompt.

No ampliar el alcance de ejecución de este prompt de forma automática.

## 12. RESTRICCIONES

Prohibido:

- Modificar `zarate_dev` o `zarate_test`.
- Ejecutar DELETE no autorizado.
- Ejecutar DROP, TRUNCATE o DDL.
- Ejecutar `migrate:fresh`, `db:wipe` o `migrate:rollback`.
- Ejecutar seeders de demostración.
- Modificar las 14 migraciones originales.
- Ampliar privilegios MySQL.
- Desactivar TLS.
- Debilitar guardas.
- Aumentar el plazo de autorización.
- Modificar configuraciones globales de Windows.
- Ejecutar pruebas en paralelo.
- Ejecutar Cypress.
- Ejecutar toda la suite Pest indiscriminadamente.
- Modificar código funcional sin autorización.
- Realizar commits ni push.

Conservar las herramientas privadas y los secretos fuera de GitHub.

## 13. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-34-personas-permisos-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-personas-permisos-pest.md`

Registrar:

- Estado inicial.
- Casos seleccionados.
- Casos descartados y razones.
- Resultados individuales.
- Aserciones.
- Rollbacks.
- Guardas de seguridad.
- Tiempos de ejecución.
- Incidencias.
- Estado final del esquema.
- Archivos modificados.
- Estado de Git.
- Casos pendientes.
- Plan para pruebas de matrículas.

No almacenar credenciales, tokens ni certificados privados.

## 14. INFORME FINAL

Entregar una tabla:

| Área | Nuevos casos ejecutados | Aprobados | Fallidos | Aserciones |
|---|---|---|---|---|
| Estudiantes | Real | Real | Real | Real |
| Docentes | Real | Real | Real | Real |
| Apoderados | Real | Real | Real | Real |
| Relaciones familiares | Real | Real | Real | Real |
| Unicidad institucional | Real | Real | Real | Real |
| Roles y permisos | Real | Real | Real | Real |
| Aislamiento | Real | Real | Real | Real |

Además, informar:

1. Casos nuevos aprobados.
2. Total acumulado de casos Pest distintos aprobados.
3. Total acumulado de aserciones.
4. Casos pendientes.
5. Rollbacks verificados.
6. Estado del verificador nativo.
7. Resultado de seguridad.
8. Estado de las bases.
9. Defectos detectados.
10. Preparación para pruebas de matrículas.

Clasificar el resultado:

**A. VALIDACIÓN DE PERSONAS Y PERMISOS APROBADA.**

**B. LOTE PARCIAL — INCIDENCIAS FUNCIONALES.**

**C. LOTE LIMITADO POR FIXTURES O RESTRICCIONES.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

**Objetivo final: completar la mayor cantidad segura de pruebas funcionales de personas y permisos y preparar la transición a la validación integral de matrículas, conservando todas las protecciones de EcoAula SaaS.**