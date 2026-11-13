# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 06: Inicialización controlada de MySQL exclusivo para pruebas

Actúa como ingeniero senior DevOps, administrador MySQL 8.4 y especialista en seguridad de entornos de pruebas para Laravel 13, Pest y Cypress.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio local: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Directorio exclusivo:

D:\zarate-saas\.tools\misional-isolated

Rama de referencia: feature/macro-misional.

## ANTECEDENTES

El Prompt 05 completó las correcciones offline:

- 14 controles offline aprobados.
- 0 bloqueos offline.
- ACL privadas con respaldo.
- MySQL --validate-config aprobado.
- Datadir aislado vacío.
- Rutas separadas de desarrollo.
- MySQL X desactivado explícitamente.
- tmpdir exclusivo configurado.
- Script Test-Isolation.ps1 disponible.

Persisten tres controles de activación que todavía no pueden considerarse aprobados.

## OBJETIVO

Inicializar exclusivamente una instancia MySQL nueva para pruebas en el directorio aislado, sin modificar ni iniciar procesos de desarrollo y sin crear todavía las bases académicas de prueba.

La inicialización solo puede ejecutarse si los controles previos demuestran que el destino es seguro.

## FASE 1 — REVISIÓN OBLIGATORIA

Lee íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/diagnostico-entorno.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/verificacion-seguridad.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md

Inspecciona:

- .tools/misional-isolated/mysql.ini.template
- .tools/misional-isolated/run-manifest.template.json
- .tools/misional-isolated/Test-Isolation.ps1

No presupongas que la configuración permanece igual a la del Prompt 05.

## FASE 2 — VERIFICACIONES PREVIAS

Antes de escribir cualquier archivo de MySQL:

1. Verifica rama y estado Git.
2. Confirma ejecutable y versión exacta de mysqld.
3. Verifica el resultado actualizado de Test-Isolation.ps1.
4. Comprueba rutas absolutas y canónicas.
5. Confirma ausencia de enlaces simbólicos o junctions.
6. Verifica que mysql-data está completamente vacío.
7. Confirma que mysql-data no corresponde al datadir de desarrollo.
8. Verifica que tmpdir, logs, PID y configuración son exclusivos.
9. Verifica ACL privadas y acceso necesario.
10. Comprueba que el puerto 3308 no está ocupado.
11. Comprueba que ninguna instancia utiliza esas rutas.
12. Confirma que MySQL X está desactivado.
13. Valida las opciones de MySQL.
14. Comprueba que no existen configuraciones que redirijan a desarrollo.
15. Verifica que la configuración usada para inicializar es exactamente la configuración revisada.

Si cualquiera de estas comprobaciones falla, DETENTE.

No intentes reparar automáticamente recursos de desarrollo.

No uses rutas deducidas ni valores por defecto cuando falte una opción crítica.

## FASE 3 — PROTECCIÓN DE DATOS

Considera protegidos:

- zarate_dev.
- Bases institucionales.
- MySQL de desarrollo.
- Sus servicios Windows.
- Sus directorios de datos.
- Sus archivos de configuración.
- Sus cuentas y contraseñas.

Está prohibido operar sobre esos recursos.

No copiar información institucional a la instancia de pruebas.

No reutilizar archivos de datos existentes.

## FASE 4 — INICIALIZACIÓN LIMITADA

Solo si todas las verificaciones anteriores son satisfactorias:

1. Utiliza el ejecutable MySQL 8.4 verificado.
2. Utiliza exclusivamente el directorio mysql-data aislado.
3. Utiliza únicamente el archivo de configuración exclusivo previamente validado.
4. Ejecuta la inicialización nueva mediante el mecanismo oficial compatible con esa versión.
5. No utilices opciones que omitan controles de seguridad.
6. No uses --initialize-insecure.
7. No sobrescribas un datadir existente.
8. No elimines archivos para forzar la inicialización.
9. No inicies el servidor después de inicializar.
10. No conectes clientes SQL.
11. No crees bases ni usuarios.
12. No ejecutes migraciones.
13. No ejecutes seeders.
14. No ejecutes pruebas Pest o Cypress.

Si MySQL genera credenciales temporales, mantenlas exclusivamente en un recurso local privado con ACL restrictivas.

No imprimas contraseñas ni fragmentos de logs que contengan secretos.

No introduzcas credenciales en documentos AI-DLC o Git.

No realices reintentos de inicialización sobre un directorio parcialmente inicializado.

Si ocurre un error, conserva el estado para diagnóstico y clasifica la operación como BLOQUEADA.

## FASE 5 — VALIDACIÓN POSTERIOR

Después de una inicialización satisfactoria, comprueba únicamente mediante operaciones de lectura:

- Existencia de archivos de sistema en el datadir aislado.
- Registro de inicialización satisfactoria.
- Ausencia de errores críticos.
- Conservación de ACL privadas.
- Ausencia de procesos MySQL nuevos en ejecución.
- Ausencia de cambios en los directorios de desarrollo.
- Ausencia de conexiones realizadas a zarate_dev.
- Ausencia de secretos en archivos versionados.

No mostrar los valores de credenciales.

No iniciar MySQL todavía.

## FASE 6 — REGISTRO DE EVIDENCIAS

Documenta:

1. Fecha y entorno.
2. Rama Git.
3. Versión de MySQL.
4. Ruta de inicialización.
5. Archivo de configuración utilizado.
6. Controles previos y resultado.
7. Comando ejecutado, sin secretos.
8. Código de salida.
9. Archivos creados, sin revelar contenido sensible.
10. Verificaciones posteriores.
11. Errores, si existieran.
12. Riesgos pendientes.
13. Próxima acción segura.

No declarar habilitadas las pruebas reales.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-06-inicializacion-mysql.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-inicializacion.md

Los documentos deben contener únicamente información técnica no sensible.

## RESTRICCIONES

- No modificar frontend o backend.
- No modificar archivos .env de desarrollo.
- No instalar dependencias.
- No detener servicios existentes.
- No ejecutar SQL.
- No crear bases o usuarios.
- No iniciar el servidor MySQL después de inicializar.
- No realizar migraciones o seeders.
- No ejecutar Pest ni Cypress.
- No publicar archivos locales de .tools.
- No hacer commits, push, merge ni Pull Requests.
- No realizar operaciones destructivas para recuperar un fallo.
- No alterar Bolts anteriores.

## RESULTADO ESPERADO

Clasifica el resultado como:

- MYSQL AISLADO INICIALIZADO — PENDIENTE DE ACTIVACIÓN.
- BLOQUEADO POR SEGURIDAD.
- INICIALIZACIÓN FALLIDA.

Indica exactamente qué verificaciones se aprobaron y qué acciones siguen pendientes.

Si existe cualquier incertidumbre importante sobre rutas, privilegios o aislamiento, no inicialices y explica el motivo.

No declarar validación de Laravel/MySQL completada.