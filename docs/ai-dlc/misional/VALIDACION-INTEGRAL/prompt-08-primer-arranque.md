# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 08: Primer arranque controlado de MySQL aislado

Actúa como ingeniero senior DevOps, administrador de MySQL 8.4 y especialista en seguridad de pruebas para Laravel 13, Pest y Cypress sobre Windows.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Directorio exclusivo: D:\zarate-saas\.tools\misional-isolated

## ANTECEDENTES

El Prompt 07 determinó que la instancia está APTA PARA PRIMER ARRANQUE CONTROLADO.

Evidencias:

- Inicialización de MySQL ejecutada una sola vez.
- Estructura MySQL/InnoDB presente.
- Finalización registrada sin errores o advertencias detectadas.
- Código de salida original desconocido.
- Datadir exclusivo.
- ACL privadas.
- Puerto candidato 3308 libre durante la comprobación.
- Desarrollo sin modificaciones detectadas.

No repetir la inicialización.

## OBJETIVO

Realizar el primer arranque controlado de la instancia MySQL exclusivamente aislada, confirmar su funcionamiento básico mediante evidencias de proceso y red, y detenerla de forma segura.

Esta fase NO autoriza ejecutar SQL, crear bases, cambiar contraseñas, iniciar Laravel ni correr pruebas académicas.

## FASE 1 — REVISIÓN OBLIGATORIA

Lee íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-inicializacion.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-post-inicializacion.md

Inspecciona los archivos locales:

- .tools/misional-isolated/mysql.ini.template
- .tools/misional-isolated/Test-Isolation.ps1
- .tools/misional-isolated/run-manifest.template.json

Identifica el procedimiento exacto de arranque y parada previsto en las evidencias anteriores.

## FASE 2 — PRECONDICIONES

Antes del arranque:

1. Confirma la rama test/integracion-misional.
2. Comprueba git status.
3. Identifica el ejecutable mysqld y su versión.
4. Verifica rutas absolutas y canónicas.
5. Confirma que el datadir contiene la inicialización anterior.
6. Comprueba que el datadir no corresponde a desarrollo.
7. Verifica tmpdir, logs, archivo PID y configuración aislados.
8. Comprueba ACL privadas.
9. Verifica que MySQL X esté desactivado.
10. Confirma que no existen procesos activos utilizando esas rutas.
11. Comprueba que el puerto 3308 esté libre en ese momento.
12. Identifica los procesos y puertos de MySQL de desarrollo sin alterarlos.
13. Valida la configuración efectiva del servidor.
14. Comprueba que no existan enlaces o junctions hacia desarrollo.
15. Identifica qué guardas corresponden a una instancia ya inicializada.

No reutilizar la condición de datadir vacío como criterio de arranque.

No desactivar controles de seguridad para forzar un resultado aprobado.

Si existe una discrepancia importante, no arrancar.

## FASE 3 — ARRANQUE CONTROLADO

Únicamente si todas las precondiciones están satisfechas:

1. Utiliza el ejecutable mysqld previamente verificado.
2. Usa el archivo de opciones aislado y explícito.
3. No permitas que configuraciones externas redirijan la instancia.
4. Comprueba que el servidor utilizará exclusivamente el datadir aislado.
5. Conserva bind-address local y puerto 3308.
6. Mantén MySQL X desactivado.
7. Usa logs, tmpdir y PID exclusivos.
8. Inicia únicamente la instancia de pruebas.
9. Captura el PID real y su ruta de ejecución.
10. Conserva el resultado nativo del proceso cuando finalice.
11. Registra únicamente información no sensible.
12. No imprimas credenciales ni logs completos.

No utilizar servicios Windows de desarrollo.

No iniciar instancias adicionales.

No ejecutar mysqld --initialize, --initialize-insecure o mecanismos de recuperación destructivos.

Si el proceso falla, conservar la evidencia y detener el procedimiento sin reinicializar el datadir.

## FASE 4 — VERIFICACIONES DURANTE EL ARRANQUE

Realiza comprobaciones de proceso y red, sin autenticación SQL:

1. Confirma que el PID pertenece al ejecutable esperado.
2. Verifica que su línea de comandos apunta al archivo de opciones aislado.
3. Comprueba que escucha únicamente en la interfaz local prevista.
4. Comprueba que el puerto es 3308.
5. Revisa indicadores saneados de disponibilidad del servidor.
6. Verifica que no existen conflictos de PID.
7. Comprueba que no se iniciaron servicios de desarrollo.
8. Verifica que las rutas exclusivas corresponden al entorno aislado.
9. Confirma que el proceso no está utilizando el datadir de desarrollo.
10. Determina si el arranque fue exitoso, fallido o no concluyente.

Si se requiere leer logs, analiza únicamente eventos técnicos y elimina cualquier información que pueda contener contraseñas temporales.

No ejecutar SELECT, SHOW, consultas de identidad ni comandos SQL en esta fase.

No ejecutar mysqladmin si ello implica autenticación o modificaciones no autorizadas.

## FASE 5 — DETENCIÓN SEGURA

El objetivo es terminar esta fase con la instancia aislada detenida.

1. Identifica exactamente el PID de la instancia iniciada en esta ejecución.
2. Utiliza el mecanismo de detención controlada compatible con MySQL y con el procedimiento autorizado.
3. Si ese mecanismo requiere autenticación SQL, no improvises credenciales ni comandos; documenta la limitación y prioriza un método de parada segura previamente validado.
4. No detener procesos por nombre genérico.
5. No utilizar taskkill /F como procedimiento normal.
6. No detener ninguna instancia de desarrollo.
7. Confirma la finalización del proceso aislado.
8. Verifica que el puerto 3308 quede liberado.
9. Revisa la finalización mediante evidencias saneadas.
10. Confirma que el datadir permanezca íntegro.

Si no es posible detener la instancia de manera segura, no fuerces la terminación. Documenta el PID, el estado y el bloqueo para revisión.

## FASE 6 — SEGURIDAD

Durante toda la ejecución:

- No conectar Laravel.
- No conectar clientes SQL.
- No crear bases o usuarios.
- No modificar contraseñas.
- No ejecutar migraciones.
- No ejecutar seeders.
- No ejecutar Pest.
- No ejecutar Cypress con backend real.
- No acceder a zarate_dev.
- No modificar recursos de desarrollo.
- No copiar datos institucionales.
- No publicar secretos.

Las escrituras normales internas que MySQL realice al iniciar y detenerse quedan restringidas al datadir y a los recursos exclusivos de esta instancia.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-08-primer-arranque.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-primer-arranque.md

Documenta:

1. Estado inicial.
2. Precondiciones verificadas.
3. Ejecutable utilizado.
4. Configuración efectiva acreditada.
5. Comando de arranque sin secretos.
6. Resultado del arranque.
7. PID aislado.
8. Puerto e interfaz utilizados.
9. Indicadores de disponibilidad.
10. Procedimiento de detención.
11. Resultado de la detención.
12. Verificación de ausencia de impactos sobre desarrollo.
13. Fallos o bloqueos.
14. Riesgos pendientes.
15. Siguiente paso recomendado.

No copiar logs con credenciales a la documentación.

## RESTRICCIONES

- No reinicializar MySQL.
- No borrar archivos de datos.
- No ejecutar SQL.
- No conectar clientes a MySQL.
- No crear bases ni usuarios.
- No cambiar contraseñas.
- No modificar frontend/backend.
- No modificar archivos .env activos.
- No instalar dependencias.
- No ejecutar pruebas reales.
- No detener servicios de desarrollo.
- No modificar otros Bolts.
- No realizar commits, push, merge ni PR.

Solo se autorizan las operaciones locales indispensables para arrancar y detener la instancia aislada, además de crear los dos documentos indicados.

## RESULTADO ESPERADO

Clasifica el resultado como:

- ARRANQUE Y DETENCIÓN CONTROLADOS.
- ARRANQUE EXITOSO CON DETENCIÓN PENDIENTE.
- ARRANQUE FALLIDO.
- BLOQUEADO POR SEGURIDAD.

Justifica el estado mediante evidencia verificable.

No declarar habilitadas las pruebas reales todavía.