# PROMPT 37 — RECUPERACIÓN POR SUSPENSIÓN Y CIERRE DE REGRESIÓN PEST MISIONAL

Actúa como ingeniero senior de QA especializado en Laravel 13, MySQL 8.4, Pest, Windows y seguridad de bases de datos.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## OBJETIVO PRINCIPAL

Continuar desde el último checkpoint verificable del Prompt Maestro 36 y completar la mayor cantidad posible de pruebas Pest pendientes que sean compatibles con el entorno autorizado.

**No comenzar desde cero. No repetir las 201 pruebas aprobadas. No iniciar nuevamente los supervisores anteriores desde el principio.**

## 1. ESTADO CONFIRMADO

El Prompt Maestro 36 reportó:

- 314 casos Pest inventariados.
- 201 casos distintos aprobados.
- 1404 aserciones acreditadas.
- 113 casos pendientes.
- 75 pendientes por entorno.
- 38 bloqueados por operaciones o contratos no admitidos.
- 77 nuevos casos aprobados durante el Prompt 36.
- 77 rollbacks completamente verificados.
- Dos errores históricos de infraestructura: uno recuperado y otro pendiente.
- Cero fallos de aserción.
- 52 tablas y 14 migraciones conservadas.
- TLS e identidad MySQL verificados.
- Cero residuos persistentes.

La ejecución se interrumpió por una suspensión de Windows que provocó la expiración de la guarda de 120 segundos.

El siguiente caso exacto es:

- Identificador: `R36-039`.
- Archivo: `Sprint1Test`.
- Prueba: `denies non administrators protected resources`.
- Dataset: `('STUDENT')`.

Checkpoint principal:

`.tools/misional-isolated/evidence/prompt36/checkpoint-terminal-0201-complemento.json`

## 2. FASE A — RECUPERACIÓN

Antes de ejecutar:

1. Comprobar rama y estado de Git.
2. Leer el checkpoint anterior.
3. Revisar las evidencias del Prompt 36.
4. Confirmar los 201 casos acreditados mediante registros reales.
5. Identificar el estado del caso R36-039.
6. Comprobar que no existan supervisores anteriores activos.
7. Verificar el estado de PHP, MySQL y los procesos auxiliares.
8. Determinar si Windows volvió a suspenderse desde el último intento.
9. Revisar, en modo lectura, los eventos de suspensión y reanudación disponibles en Windows.
10. Preservar todos los archivos y checkpoints existentes.

No modificar automáticamente las opciones de energía del sistema.

No cerrar procesos desconocidos ni descartar cambios de Git.

## 3. FASE B — VERIFICACIÓN DE SEGURIDAD

Antes de cualquier escritura comprobar:

- MySQL aislado en `127.0.0.1:3308`.
- Base exclusiva `zarate_pest`.
- Cuenta de pruebas autorizada.
- TLS obligatorio.
- Identidad efectiva del servidor.
- Directorio físico autorizado.
- 52 tablas.
- 14 migraciones.
- Cero residuos.
- Guarda activa de 120 segundos.
- Compatibilidad del verificador nativo del Prompt 32.

Confirmar las denegaciones de acceso a `zarate_dev` y `zarate_test`.

No reutilizar autorizaciones vencidas.

Si se detecta una nueva suspensión, un proceso desconocido o una inconsistencia de seguridad, detenerse antes de ejecutar pruebas.

## 4. FASE C — REANUDAR DESDE R36-039

Una vez aprobado el preflight:

1. Recuperar la selección exacta de R36-039.
2. Comprobar que no tiene un resultado exitoso definitivo.
3. Verificar que su ejecución anterior quedó completamente revertida.
4. Ejecutar únicamente ese caso, si es compatible con las restricciones actuales.
5. Registrar resultado JUnit y aserciones.
6. Comprobar rollback.
7. Verificar cero residuos.
8. Confirmar integridad del esquema.
9. Registrar un checkpoint nuevo.

Si aprueba, continuar con los siguientes casos pendientes.

No repetir las 201 pruebas acreditadas ni los casos ya finalizados durante el Prompt 36.

## 5. FASE D — COMPLETAR LA REGRESIÓN AUTORIZADA

Recuperar el inventario de los 75 casos pendientes por entorno.

Revisar cuáles son realmente compatibles con el launcher existente.

Continuar automáticamente con los casos seguros, manteniendo el orden original de la regresión.

Trabajar en lotes controlados, secuenciales y con un checkpoint al finalizar cada grupo.

Para cada caso:

- Verificar autorización vigente.
- Confirmar destino MySQL.
- Ejecutar Pest.
- Registrar aserciones.
- Verificar rollback.
- Comprobar cero residuos.
- Registrar duración.
- Guardar evidencia JUnit.
- Actualizar el inventario de pendientes.

Si un caso falla por motivos funcionales, conservar el defecto y sus evidencias.

Si un caso falla por entorno, diagnosticarlo y no reintentarlo indefinidamente.

Si vuelve a producirse una suspensión del equipo, detener la ejecución, inspeccionar las transacciones y conservar el último checkpoint seguro.

## 6. FASE E — REVISAR LOS 38 CASOS BLOQUEADOS

No ejecutarlos automáticamente.

Preparar una clasificación final por causa:

- DELETE o forceDelete.
- Sincronización destructiva de permisos o relaciones.
- Operaciones sobre archivos.
- Seeders de demostración.
- Conexiones externas.
- Otros efectos no autorizados.

Para cada grupo, indicar qué preparación o autorización específica sería necesaria para ejecutarlo de forma segura.

No modificar permisos MySQL ni código funcional para desbloquear artificialmente las pruebas.

## 7. FASE F — CIERRE PEST

Cuando terminen los casos compatibles:

1. Consolidar resultados reales.
2. Eliminar duplicidades de conteo.
3. Registrar aserciones de los casos distintos aprobados.
4. Confirmar que todos los rollbacks necesarios fueron verificados.
5. Comprobar cero residuos persistentes.
6. Verificar las 52 tablas y 14 migraciones.
7. Confirmar TLS, identidad y aislamiento.
8. Registrar defectos funcionales y de infraestructura.
9. Identificar los casos todavía bloqueados.
10. Determinar si puede cerrarse la validación Pest en el alcance ejecutado.

No declarar aprobada la suite completa si todavía existen pruebas sin ejecutar.

## 8. RESTRICCIONES

No modificar:

- `zarate_dev`.
- `zarate_test`.
- Migraciones originales.
- Credenciales existentes.
- Privilegios MySQL.
- Configuraciones globales de Windows.
- Código funcional sin autorización.

No ejecutar operaciones DELETE, DROP, TRUNCATE o DDL no autorizadas.

No ejecutar seeders de demostración.

No desactivar TLS ni guardas.

No aumentar el límite de 120 segundos.

No ejecutar Pest en paralelo.

No ejecutar Cypress todavía.

No realizar commits ni push automáticamente.

No publicar secretos.

## 9. DOCUMENTACIÓN AI-DLC

Actualizar por anexos:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-36-validacion-integral-misional.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validacion-integral-misional.md`

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-37-cierre-regresion-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-regresion-pest.md`

Mantener los registros y checkpoints privados dentro de `.tools/misional-isolated/evidence/`.

Registrar qué casos fueron nuevos, cuáles se recuperaron después de la suspensión y cuáles siguen bloqueados.

## 10. INFORME FINAL

Entregar:

| Indicador | Resultado real |
|---|---|
| Casos distintos aprobados | Total |
| Aserciones acreditadas | Total |
| Nuevos casos aprobados | Total |
| Fallos funcionales | Total |
| Errores de infraestructura | Total |
| Casos pendientes por entorno | Total |
| Casos bloqueados por operaciones | Total |
| Rollbacks verificados | Total |
| Tablas y migraciones | Estado |
| TLS y aislamiento | Resultado |

Indicar también:

1. Resultado final del caso R36-039.
2. Cantidad de pruebas recuperadas.
3. Casos que siguen pendientes.
4. Motivos concretos de los bloqueos.
5. Evidencias generadas.
6. Estado de Git.
7. Recomendación para preparar Cypress.
8. Si es necesario solicitar alguna autorización adicional.

Clasificar el resultado como:

**A. REGRESIÓN PEST AUTORIZADA COMPLETADA.**

**B. REGRESIÓN PEST PARCIAL — CASOS PENDIENTES.**

**C. INCIDENCIAS FUNCIONALES DETECTADAS.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

No declarar éxito sin resultados JUnit verificables.

**Objetivo final: terminar los casos Pest seguros pendientes desde el checkpoint actual, evitando repeticiones y manteniendo íntegramente protegidas las bases de EcoAula SaaS.**