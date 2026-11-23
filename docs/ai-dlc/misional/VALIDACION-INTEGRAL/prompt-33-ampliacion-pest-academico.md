# PROMPT 33 — AMPLIACIÓN PROGRESIVA DE PEST Y VALIDACIÓN FUNCIONAL ACADÉMICA

Actúa como ingeniero senior de QA, Laravel 13, PHP 8.4, MySQL 8.4, Pest y seguridad multiinstitucional.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa exactamente desde el cierre aprobado del Prompt 32. No comiences desde cero ni descartes modificaciones anteriores.**

## 1. CONTEXTO CONFIRMADO

EcoAula SaaS cuenta con:

- 314 casos Pest inventariados.
- 40 casos distintos aprobados.
- 249 aserciones acreditadas.
- 274 casos pendientes.
- 14 migraciones completadas.
- 52 tablas MySQL verificadas.
- Base exclusiva de pruebas `zarate_pest`.
- Aislamiento de `zarate_dev` y `zarate_test`.
- TLS obligatorio.
- Rollback validado.
- Guarda de autorización de 120 segundos.

El Prompt 32 optimizó el verificador nativo de procesos Windows:

- Latencia media anterior: 78,73 ms.
- Latencia media posterior: 15,14 ms.
- Seguridad comprobada mediante pruebas de paridad y negativas.
- Los 11 casos pendientes del Prompt 31 aprobaron.
- El Prompt 31 quedó cerrado con 12/12 casos aprobados.

La implementación optimizada utiliza interfaces internas de Windows y está validada únicamente en el entorno actual Windows x64.

## 2. OBJETIVO

Ampliar progresivamente las pruebas Pest utilizando el launcher seguro ya verificado.

Seleccionar hasta **20–30 casos nuevos** de los 274 pendientes, dando prioridad a:

1. Catálogos académicos.
2. Validaciones de información académica.
3. Gestión de estudiantes, docentes y apoderados.
4. Roles y permisos.
5. Aislamiento institucional.
6. Relaciones académicas y familiares.

Seleccionar únicamente casos existentes y compatibles con las restricciones actuales.

No inventar pruebas para alcanzar el objetivo numérico.

## 3. FASE A — RECUPERACIÓN Y CONTROL DE CAMBIOS

Antes de ejecutar:

1. Confirmar rama y estado de Git.
2. Leer las evidencias de los Prompts 29–32.
3. Inspeccionar los cambios acumulados sin commit.
4. Identificar archivos privados, documentos y código versionable.
5. Conservar todas las modificaciones anteriores.
6. Revisar los resultados JUnit acreditados.
7. Comprobar que los 40 casos distintos anteriores no se cuenten nuevamente.
8. Inspeccionar el verificador optimizado de Windows.
9. Confirmar su compatibilidad con el sistema actual.
10. Verificar que no existen procesos MySQL aislados abandonados.

No ejecutar `git reset`, `git clean` ni comandos que descarten trabajo.

No realizar commits ni push automáticamente.

## 4. FASE B — VALIDAR NUEVAMENTE EL VERIFICADOR

Antes de lanzar nuevos casos:

- Confirmar la identidad del proceso MySQL.
- Comprobar que el mecanismo optimizado devuelve las propiedades esperadas.
- Ejecutar pruebas negativas del verificador.
- Rechazar procesos, argumentos o rutas incompatibles.
- Comprobar autorizaciones vencidas.
- Verificar que se mantiene el límite de 120 segundos.
- Confirmar que TLS es obligatorio.
- Verificar identidad efectiva de conexión.
- Confirmar que las bases protegidas son inaccesibles.

Si la interfaz interna de Windows devuelve información incompleta, falla o pierde equivalencia con el contrato original, detenerse.

No aceptar silenciosamente resultados incompletos.

No eliminar comprobaciones para mejorar el rendimiento.

## 5. FASE C — SELECCIONAR LOS CASOS

Inspeccionar el inventario de 274 casos pendientes.

Seleccionar inicialmente entre 20 y 30 casos compatibles con:

- Factories originales.
- Fixtures sintéticos.
- `DatabaseTransactions`.
- Operaciones INSERT, SELECT y UPDATE.
- Rollback comprobable.
- Conexión exclusiva a `zarate_pest`.

Revisar cada caso antes de admitirlo.

Mantener bloqueados los casos que requieran:

- DELETE no autorizado.
- DROP o TRUNCATE.
- DDL.
- Migraciones destructivas.
- Seeders de demostración.
- Archivos privados no preparados.
- Conexiones externas sin aislamiento validado.
- Operaciones que no puedan revertirse.

Si hay menos de 20 casos seguros, ejecutar solamente los que cumplan las condiciones.

No modificar las aserciones originales.

## 6. FASE D — EJECUCIÓN PROGRESIVA

Comenzar con un grupo inicial de cuatro o cinco casos.

Si ese grupo aprueba:

1. Verificar rollback.
2. Comprobar cero residuos.
3. Confirmar las 52 tablas.
4. Confirmar las 14 migraciones.
5. Comprobar seguridad y TLS.
6. Registrar duraciones.
7. Revisar margen temporal respecto a la autorización de 120 segundos.

Solo entonces continuar con nuevos grupos, de tamaño limitado y justificado.

No iniciar operaciones que dependan de una autorización próxima a vencer.

Ejecutar los casos secuencialmente y sin paralelismo.

Ante una expiración, detenerse y registrar la causa.

No realizar reintentos automáticos sin diagnóstico.

## 7. FASE E — PRUEBAS FUNCIONALES

Priorizar los siguientes escenarios, siempre que existan entre los tests pendientes.

### Gestión académica

- Validaciones de catálogos.
- Estados académicos.
- Relaciones entre niveles, grados y secciones.
- Restricciones de periodos.

### Gestión de personas

- Registro de estudiantes.
- Datos de docentes.
- Relaciones entre estudiantes y apoderados.
- Unicidad institucional.
- Conservación de relaciones históricas.

### Seguridad

- Usuarios sin permisos.
- Acceso indebido entre instituciones.
- Restricciones de roles.
- Rechazo de identificadores ajenos.

### Integridad

- Validaciones de campos.
- Reglas de unicidad.
- Restricciones referenciales.
- Aislamiento de registros.

No modificar reglas de negocio para conseguir resultados artificialmente positivos.

## 8. FASE F — CONTROL DE INCIDENCIAS

Si alguna prueba falla:

1. Registrar el error original.
2. Distinguir error de entorno, fixture o defecto funcional.
3. Comprobar rollback.
4. Verificar ausencia de residuos.
5. Detener el grupo afectado.
6. Investigar la causa.
7. Documentar cualquier defecto reproducible.

No corregir código funcional de Laravel sin presentar primero el defecto y su impacto.

No alterar aserciones originales para ocultar fallos.

Si la corrección requiere permisos o modificaciones adicionales, informar antes de continuar.

## 9. FASE G — VERIFICACIÓN FINAL

Comprobar:

- Total de casos nuevos ejecutados.
- Casos aprobados.
- Casos fallidos.
- Casos bloqueados.
- Aserciones acreditadas.
- Rollbacks verificados.
- Cero residuos persistentes.
- 52 tablas conservadas.
- 14 migraciones registradas.
- TLS válido.
- Identidad efectiva verificada.
- Protección de `zarate_dev` y `zarate_test`.
- Estado del verificador optimizado.
- Ausencia de expiraciones o registro de las que ocurran.

No sumar reejecuciones como casos nuevos.

## 10. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-33-ampliacion-pest-academico.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ampliacion-pest-academico.md`

Documentar:

- Estado inicial.
- Casos seleccionados.
- Pruebas de seguridad del verificador.
- Resultados por grupo.
- Aserciones.
- Rollback.
- Latencias.
- Incidencias.
- Estado SQL.
- Archivos modificados.
- Estado Git.
- Casos pendientes.
- Recomendación de los próximos módulos.

Mantener los registros sensibles únicamente en recursos privados ignorados por Git.

## 11. RESTRICCIONES

No modificar las bases `zarate_dev` y `zarate_test`.

No modificar las 14 migraciones originales.

No ampliar privilegios MySQL.

No ejecutar operaciones destructivas.

No desactivar TLS.

No ampliar arbitrariamente la autorización de 120 segundos.

No modificar Windows, antivirus, servicios WMI ni configuraciones globales del sistema.

No modificar código funcional sin autorización específica.

No ejecutar Cypress todavía.

No realizar commits ni push automáticamente.

## 12. INFORME FINAL

Entregar una tabla con:

| Área | Nuevos casos | Aprobados | Fallidos | Aserciones |
|---|---|---|---|---|
| Catálogos académicos | Real | Real | Real | Real |
| Validaciones | Real | Real | Real | Real |
| Personas | Real | Real | Real | Real |
| Roles y permisos | Real | Real | Real | Real |
| Aislamiento | Real | Real | Real | Real |

Indicar:

1. Total de casos nuevos aprobados.
2. Total acumulado de casos distintos.
3. Total acumulado de aserciones.
4. Casos pendientes.
5. Rollbacks verificados.
6. Resultado de seguridad.
7. Rendimiento del verificador.
8. Estado de las 52 tablas.
9. Incidencias encontradas.
10. Siguiente grupo de pruebas recomendado.

Clasificar el resultado:

**A. LOTE AMPLIADO APROBADO.**

**B. LOTE PARCIAL — INCIDENCIAS FUNCIONALES.**

**C. PRUEBAS LIMITADAS POR RESTRICCIONES.**

**D. BLOQUEADO POR ENTORNO O SEGURIDAD.**

No declarar aprobados casos sin evidencia JUnit.

**Objetivo: ampliar la cobertura real de Pest de manera eficiente, aprovechando la optimización del Prompt 32 y conservando la seguridad del entorno de EcoAula SaaS.**