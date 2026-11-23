# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 07: Verificación posterior de MySQL y autorización del primer arranque

Actúa como ingeniero senior DevOps, administrador de MySQL 8.4 y especialista en seguridad de entornos de pruebas de Laravel 13.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Directorio aislado: D:\zarate-saas\.tools\misional-isolated

## ANTECEDENTES

El Prompt 06 ejecutó una única inicialización de MySQL mediante --initialize.

Resultado observado:

- 14 verificaciones previas aprobadas.
- Se generaron archivos de sistema MySQL.
- Se reportaron cero errores y advertencias en los registros revisados.
- El supervisor no conservó el código de salida nativo.
- El datadir ya no está vacío.
- No se inició el servidor posteriormente.
- No se ejecutaron comandos SQL.
- No se modificaron archivos de desarrollo.
- Las credenciales temporales permanecen privadas.

Clasificación anterior: BLOQUEADO POR SEGURIDAD.

## OBJETIVO

Comprobar mediante verificaciones independientes y no destructivas si la instancia MySQL aislada presenta evidencias suficientes de una inicialización coherente para planificar su primer arranque seguro.

NO repetir la inicialización.

NO iniciar todavía MySQL.

## FASE 1 — VERIFICAR ESTADO

1. Confirmar rama Git y estado.
2. Leer los documentos del Prompt 06.
3. Inspeccionar la evidencia de inicialización.
4. Revisar el estado actual de las carpetas aisladas.
5. Identificar los ejecutables y archivos de configuración realmente utilizados.
6. Comprobar que no existen procesos activos de la instancia aislada.

No cambiar archivos.

## FASE 2 — ANALIZAR LA INICIALIZACIÓN

Inspeccionar de forma segura:

- Estructura del datadir.
- Archivos de sistema esperados de MySQL 8.4.
- Archivos InnoDB y diccionario de datos, según corresponda.
- Registros de inicialización.
- Indicadores de finalización.
- Errores críticos o señales de inicialización incompleta.
- Permisos NTFS.
- Propiedad y acceso de los archivos.
- Posibles archivos faltantes.

No mostrar contraseñas temporales, secretos ni contenido sensible de los logs.

Si la inspección de un log puede revelar credenciales, utilizar un análisis local que produzca únicamente indicadores booleanos y resúmenes saneados.

No copiar logs completos al directorio de documentación.

No considerar el código de salida 0 de --validate-config como sustituto del código de salida faltante de --initialize.

No reconstruir ni inventar retrospectivamente el código de salida.

## FASE 3 — AISLAMIENTO

Ejecutar verificaciones de solo lectura para confirmar:

1. Datadir exclusivo.
2. Ausencia de solapamiento con desarrollo.
3. Archivo de opciones exclusivo.
4. tmpdir exclusivo.
5. Logs y PID exclusivos.
6. MySQL X desactivado.
7. Puerto 3308 disponible actualmente.
8. Ausencia de servicios que utilicen el mismo datadir.
9. ACL privadas conservadas.
10. Ausencia de modificaciones no autorizadas en los recursos de desarrollo.

Adaptar las verificaciones anteriores al hecho de que el datadir ahora contiene archivos: una guarda que exige datadir vacío para inicialización NO debe utilizarse como condición para arrancar una instancia ya inicializada.

No desactivar ni omitir controles de seguridad para obtener artificialmente un resultado aprobado.

## FASE 4 — CREDENCIALES

Verificar únicamente:

- Si el proceso generó credenciales temporales.
- Si permanecen en almacenamiento privado.
- Si los permisos de acceso son adecuados.
- Si existe un procedimiento seguro para cambiarlas en una fase posterior.

No imprimirlas.

No copiar contraseñas a Git.

No realizar conexiones SQL.

## FASE 5 — ANÁLISIS DE BLOQUEOS

Determinar:

1. Qué conclusiones sí permiten las evidencias actuales.
2. Qué aspectos siguen sin acreditarse por falta del código de salida.
3. Si existen indicios de inicialización incompleta.
4. Si la situación requiere detener toda activación.
5. Si es posible autorizar un primer arranque estrictamente controlado sin ejecutar SQL ni aplicaciones cliente.
6. Qué controles adicionales se deberán realizar durante ese primer arranque.
7. Cómo detener la instancia sin afectar desarrollo.

No declarar la instancia operativa antes de iniciarla y verificarla.

## FASE 6 — PLAN DE PRIMER ARRANQUE

Si las evidencias resultan suficientemente consistentes, preparar exclusivamente un plan para una fase posterior:

- Ejecutable exacto.
- Archivo de opciones explícito.
- Puerto exclusivo.
- Bind local.
- Datadir exclusivo.
- Control de PID y logs.
- Comprobaciones contra servicios de desarrollo.
- Criterios de detención.
- Procedimiento de cierre seguro.
- Verificación futura de host, puerto, identidad y privilegios SQL.

No ejecutar el arranque en este prompt.

Si falta información esencial, mantener el bloqueo.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-07-verificacion-post-inicializacion.md

Crear:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-post-inicializacion.md

Registrar:

1. Evidencias de inicialización.
2. Controles ejecutados.
3. Resultados comprobados.
4. Archivos de sistema inspeccionados.
5. Estado del aislamiento.
6. Seguridad de credenciales.
7. Información faltante.
8. Riesgos.
9. Bloqueadores.
10. Recomendación del primer arranque.

No modificar evidencias anteriores.

## RESTRICCIONES

- No volver a ejecutar mysqld --initialize.
- No borrar ni limpiar el datadir.
- No arrancar MySQL.
- No ejecutar SQL.
- No conectar clientes.
- No cambiar contraseñas.
- No crear usuarios ni bases.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest ni Cypress real.
- No instalar dependencias.
- No modificar frontend/backend.
- No modificar datos de desarrollo.
- No detener servicios existentes.
- No modificar otros Bolts.
- No hacer commits, push, merge ni PR.
- No publicar secretos.

Solo crear los dos documentos indicados.

## RESULTADO ESPERADO

Clasificar:

- APTO PARA PRIMER ARRANQUE CONTROLADO.
- REQUIERE VERIFICACIONES ADICIONALES.
- BLOQUEADO POR SEGURIDAD.

Justificar la clasificación mediante evidencias verificables.

No declarar que las pruebas de integración ya están habilitadas.