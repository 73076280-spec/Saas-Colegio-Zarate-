# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 09: Identidad SQL y seguridad de MySQL aislado

Actúa como ingeniero senior DevOps, administrador MySQL 8.4 y especialista en seguridad de bases de datos para Laravel 13, Pest y Cypress en Windows.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Entorno exclusivo: D:\zarate-saas\.tools\misional-isolated

Instancia candidata: 127.0.0.1:3308.

## ANTECEDENTES

El Prompt 08 confirmó:

- Arranque y detención controlados de la instancia MySQL aislada.
- Puerto 3308 disponible durante la ejecución.
- Código de salida nativo del motor 0.
- Código 0xC000013A del monitor por Ctrl+C.
- Una advertencia de CA autofirmada.
- Ningún proceso MySQL aislado activo al terminar.
- Archivos de desarrollo conservados.

Todavía no se ha comprobado la identidad SQL, el usuario efectivo ni sus privilegios.

## OBJETIVO

Verificar de forma controlada la identidad del servidor MySQL aislado, su configuración efectiva y las condiciones para crear posteriormente una base de pruebas exclusiva.

No crear bases ni usuarios durante esta fase.

## FASE 1 — DOCUMENTACIÓN

Lee completamente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-inicializacion.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-post-inicializacion.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-primer-arranque.md

Revisa los scripts y archivos de configuración locales del entorno aislado.

No modificar las evidencias existentes.

## FASE 2 — PRECONDICIONES DE SEGURIDAD

Antes de iniciar la instancia:

1. Confirma rama y estado Git.
2. Identifica el ejecutable mysqld.
3. Verifica rutas canónicas de datadir, tmpdir, PID y logs.
4. Revalida ACL privadas.
5. Comprueba que el puerto 3308 esté libre.
6. Verifica ausencia de instancias que utilicen el datadir aislado.
7. Comprueba que MySQL X permanezca desactivado.
8. Verifica bind-address local.
9. Ejecuta las guardas aplicables a una instancia ya inicializada.
10. Confirma que la configuración es la utilizada en el Prompt 08.

Si alguna comprobación falla, detente.

No utilizar configuraciones de desarrollo como alternativa.

## FASE 3 — ARRANQUE CONTROLADO

Si las verificaciones previas son satisfactorias:

1. Inicia únicamente la instancia MySQL aislada.
2. Registra el PID y las rutas efectivas.
3. Confirma que escucha en 127.0.0.1:3308.
4. Comprueba que el PID y el ejecutable son los esperados.
5. Comprueba que no se inició ningún servicio de desarrollo.

No iniciar Laravel ni Vite adicionales.

No ejecutar migraciones.

## FASE 4 — VERIFICACIÓN DE CREDENCIALES

Comprueba si las credenciales temporales generadas durante la inicialización permiten establecer una conexión de administración controlada.

Considera que MySQL puede exigir cambiar una contraseña temporal antes de permitir otras consultas.

Si esto sucede:

- No usar --skip-grant-tables.
- No restablecer contraseñas de desarrollo.
- No modificar privilegios.
- No ejecutar ALTER USER en este prompt.
- Documentar que el cambio de contraseña requiere una fase separada y controlada.
- No intentar eludir la restricción.

No imprimir contraseñas ni incorporarlas a argumentos visibles del proceso, logs, capturas o archivos versionados.

Si no existe un mecanismo seguro de autenticación, mantener la conexión SQL bloqueada.

## FASE 5 — VERIFICACIONES SQL DE SOLO LECTURA

Únicamente si la conexión se establece de manera segura y el servidor de destino ya está acreditado, ejecutar las consultas mínimas necesarias para comprobar:

- Versión del servidor.
- Puerto efectivo.
- Directorio de datos efectivo.
- Identificador de instancia.
- Usuario autenticado.
- Usuario efectivo.
- Base de datos seleccionada.
- Privilegios disponibles.
- Configuración de MySQL X.
- Ausencia de conexión a zarate_dev.

Utilizar SELECT, SHOW o consultas equivalentes exclusivamente de lectura.

No consultar tablas con información personal.

No usar instrucciones que modifiquen usuarios, esquemas, sesiones persistentes o datos.

No utilizar el nombre del puerto como única garantía de identidad: contrastar datadir, PID y configuración efectiva.

## FASE 6 — VERIFICACIÓN DE PRIVILEGIOS

Documenta:

1. Identidad efectiva del usuario.
2. Permisos existentes.
3. Riesgo de utilizar una cuenta administrativa en Pest.
4. Privilegios mínimos que necesitará una cuenta exclusiva de pruebas.
5. Restricciones necesarias para impedir acceso a zarate_dev.
6. Configuración recomendada de Laravel para una fase posterior.

No crear todavía el usuario de pruebas.

No crear la base de pruebas.

No ejecutar GRANT, REVOKE o ALTER USER.

## FASE 7 — DETENCIÓN SEGURA

Al finalizar:

1. Identifica el proceso aislado.
2. Utiliza un mecanismo de detención controlada ya acreditado.
3. Confirma su finalización.
4. Comprueba que el puerto 3308 queda libre.
5. Verifica que el datadir permanece íntegro.
6. Confirma que no se alteró la instancia de desarrollo.

Si no puede detenerse de forma segura, conserva la evidencia y no fuerces una terminación genérica.

No usar taskkill /F como procedimiento normal.

## FASE 8 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-09-identidad-sql.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-identidad-sql.md

Incluye:

1. Precondiciones.
2. Proceso y puerto verificados.
3. Resultado de autenticación.
4. Consultas ejecutadas, si corresponde.
5. Identidad de la instancia.
6. Privilegios observados.
7. Resultado de la detención.
8. Riesgos.
9. Bloqueadores.
10. Próxima operación segura recomendada.

No incluir secretos ni datos personales.

## RESTRICCIONES

- No reinicializar MySQL.
- No borrar ni modificar bases.
- No crear usuarios.
- No cambiar contraseñas.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest ni Cypress con backend real.
- No modificar frontend/backend.
- No modificar archivos .env activos.
- No instalar dependencias.
- No detener servicios de desarrollo.
- No modificar otros Bolts.
- No realizar commits, push, merge ni Pull Requests.
- No publicar archivos de .tools.

## RESULTADO ESPERADO

Clasifica el estado como:

- IDENTIDAD SQL VERIFICADA.
- AUTENTICACIÓN PENDIENTE.
- BLOQUEADO POR SEGURIDAD.

Indica claramente qué verificaciones fueron efectivamente ejecutadas y cuáles siguen pendientes.

No declarar habilitadas las pruebas reales hasta que existan una base, una cuenta y una configuración Laravel aisladas y verificadas.