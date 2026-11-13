# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 19: Diagnóstico y recuperación planificada de migración parcial

Actúa como ingeniero senior de Laravel 13, MySQL 8.4, PHP 8.4, migraciones y administración segura de bases de datos.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo.

Repositorio: D:\zarate-saas

Rama: test/integracion-misional

Entorno: .tools/misional-isolated

MySQL: 127.0.0.1:3308

Base exclusiva: zarate_test

## ESTADO DEL PROMPT 18

- Resolver Laravel corregido.
- Conexión mysql y PDO verificados.
- 4 de 14 migraciones registradas.
- 14 tablas acreditadas, incluyendo migrations.
- Quinta migración parcialmente ejecutada.
- Fallo relacionado con la comprobación viva de identidad del proceso.
- PHP terminó con código 21.
- MySQL cerró con código 0.
- No hubo reintentos ni limpiezas.

## OBJETIVO

Determinar el estado exacto de la quinta migración, identificar los objetos de base de datos que dejó creados y diagnosticar la causa del rechazo de la guarda del proceso.

Diseñar una continuación segura y verificable.

EN ESTA FASE NO EJECUTAR MIGRACIONES NI OPERACIONES SQL DE ESCRITURA.

## FASE 1 — REVISAR EVIDENCIAS

Leer íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-guardas-identidad-sql.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ejecutor-migraciones.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-migracion-controlada.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-resolver.md

Inspeccionar los ejecutores y controles locales de los Prompts 17 y 18.

No repetir auditorías ya acreditadas salvo que sea necesario comprobar una condición vigente.

## FASE 2 — INSPECCIÓN DE SOLO LECTURA

Si las guardas permiten iniciar MySQL aislado:

1. Verificar PID, ejecutable, puerto y datadir.
2. Verificar TLS estricto.
3. Confirmar usuario zarate_test.
4. Confirmar base zarate_test.
5. Leer el contenido de la tabla migrations.
6. Enumerar todas las tablas existentes.
7. Inspeccionar columnas y restricciones.
8. Consultar claves primarias y foráneas.
9. Identificar índices y demás objetos afectados por la quinta migración.
10. Comparar el esquema real con las primeras cinco migraciones del código.

Utilizar únicamente consultas de lectura de metadatos.

No consultar información personal ni institucional.

No ejecutar SQL que modifique el esquema.

## FASE 3 — IDENTIFICAR LA QUINTA MIGRACIÓN

Determinar:

- Nombre exacto y orden del archivo.
- Operaciones previstas.
- Operaciones realmente completadas.
- Operaciones pendientes.
- Objetos creados sin registro en migrations.
- Dependencias con migraciones posteriores.
- Riesgos de una segunda ejecución.

No asumir que la quinta migración es idempotente.

No ejecutar rollback, migrate:fresh, db:wipe ni comandos equivalentes.

## FASE 4 — DIAGNÓSTICO DE LA GUARDA DE PROCESO

Investigar por qué la comprobación viva del proceso rechazó la operación.

Verificar:

1. Identificación del PID.
2. Proceso hijo o padre.
3. Ruta del ejecutable.
4. Línea de comandos.
5. Permisos de inspección.
6. Cambios de proceso durante la migración.
7. Momento exacto del rechazo.
8. Riesgo de falsos negativos.
9. Vigencia de la identidad MySQL.
10. Comportamiento de la guarda cuando no puede acreditar el proceso.

Proponer una corrección mínima y segura.

No eliminar, desactivar o relajar las guardas para hacer pasar la migración.

## FASE 5 — PLAN DE RECUPERACIÓN

Diseñar una recuperación que:

- Conserve las cuatro migraciones registradas.
- Conserve las tablas existentes.
- No modifique otras bases.
- No use limpieza destructiva.
- Acredite el esquema exacto antes de cualquier escritura.
- Evite duplicar objetos creados parcialmente.
- Determine si hace falta una corrección puntual o una migración de reparación.
- Defina criterios para detenerse ante inconsistencias.
- Documente cómo verificar la recuperación.

No ejecutar ese plan todavía.

## FASE 6 — CIERRE

Detener MySQL aislado mediante el procedimiento seguro.

Confirmar el puerto 3308 libre y la conservación de desarrollo.

Documentar los resultados sin revelar secretos.

## DOCUMENTACIÓN AI-DLC

Guardar íntegramente el prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-19-diagnostico-migracion-parcial.md

Crear:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-diagnostico-migracion-parcial.md

Incluir:

1. Estado inicial.
2. Inventario exacto de tablas y migraciones.
3. Objetos de la quinta migración.
4. Causa del bloqueo.
5. Evidencias de la guarda.
6. Diferencias entre esquema esperado y real.
7. Estrategia de recuperación.
8. Riesgos.
9. Criterios de autorización de la siguiente fase.
10. Resultado de detención.

## RESTRICCIONES

- No ejecutar migraciones.
- No ejecutar SQL de escritura.
- No borrar tablas.
- No modificar registros de migrations.
- No ejecutar seeders.
- No ejecutar Pest ni Cypress.
- No modificar código funcional.
- No modificar archivos .env de desarrollo.
- No cambiar privilegios o contraseñas.
- No modificar otros Bolts.
- No realizar commits ni push.
- No publicar secretos ni archivos locales de .tools.

## RESULTADO ESPERADO

Clasificar:

- DIAGNÓSTICO COMPLETO — RECUPERACIÓN PLANIFICADA.
- DIAGNÓSTICO PARCIAL — REQUIERE VERIFICACIONES.
- BLOQUEADO POR SEGURIDAD.

No declarar recuperada una migración que no se ha completado.

Prioriza resolver esta incidencia concreta y evita crear infraestructura adicional innecesaria.