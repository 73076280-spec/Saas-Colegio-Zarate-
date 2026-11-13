# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 16: Integración del ejecutor seguro de migraciones Laravel

Actúa como ingeniero senior de Laravel 13, PHP 8.4, MySQL 8.4, Pest y DevOps.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: `D:\zarate-saas`

Rama obligatoria: `test/integracion-misional`

Entorno local: `.tools/misional-isolated`

MySQL aislado: `127.0.0.1:3308`

Base: `zarate_test`

Usuario: `zarate_test`

## RESULTADOS ANTERIORES

Prompt 13:
- TLS estricto y conexión Laravel/MySQL verificados.

Prompt 14:
- Adaptadores HTTP/Pest preparados.
- 30 controles satisfactorios.

Prompt 15:
- 22 controles offline aprobados.
- Dos conexiones diagnósticas.
- 34 lecturas SQL, cero escrituras.
- Identidad, datadir, TLS y nueve privilegios exclusivos verificados.
- Rechazo de cambios de configuración y conexión PDO.
- MySQL detenido correctamente.

Bloqueo restante: integrar la verificación vigente de identidad y privilegios con el ejecutor real antes de permitir migraciones.

## OBJETIVO

Preparar un ejecutor local de migraciones que utilice los adaptadores existentes y que falle de forma segura si cualquier configuración o destino no coincide con el entorno autorizado.

En este prompt SOLO se autoriza construir y verificar el mecanismo de control.

NO ejecutar migraciones reales.

## FASE 1 — RECUPERAR Y REUTILIZAR

Leer:

- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-tls.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-adaptadores-laravel-pest.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-guardas-identidad-sql.md`

Inspeccionar los adaptadores locales, archivos PHPUnit y guardas existentes.

Reutilizar los mecanismos que ya funcionan. Evitar crear otro sistema paralelo de validación.

Comprobar rama y estado Git.

## FASE 2 — INTEGRAR EL EJECUTOR

Preparar únicamente dentro de `.tools/misional-isolated` un mecanismo local para futuras migraciones.

Debe:

1. Utilizar PHP 8.4 portátil.
2. Cargar los perfiles exclusivos de pruebas.
3. Exigir APP_ENV=testing.
4. Exigir DB_HOST=127.0.0.1.
5. Exigir DB_PORT=3308.
6. Exigir DB_DATABASE=zarate_test.
7. Exigir DB_USERNAME=zarate_test.
8. Verificar TLS y CA correcta.
9. Verificar la identidad efectiva del servidor.
10. Verificar el datadir aislado.
11. Verificar cuenta y privilegios efectivos.
12. Rechazar cualquier conexión a zarate_dev.
13. Rechazar rutas de almacenamiento compartidas.
14. Rechazar configuración PHPUnit incompatible.
15. Rechazar diferencias entre la conexión verificada y la conexión utilizada para ejecutar el comando.
16. Bloquear cualquier operación si no se puede acreditar el aislamiento.

La verificación debe producirse en el contexto de ejecución que utilizará Laravel, no solamente en un proceso diagnóstico independiente.

No aceptar un resultado de guardas guardado en un archivo como autorización permanente para migrar posteriormente.

Si no puede garantizarse que la conexión verificada sea la que realizará la migración, documentar el bloqueo.

## FASE 3 — PROTECCIÓN DE OPERACIONES

El ejecutor debe distinguir expresamente:

- Modo diagnóstico: permitido.
- Vista previa no destructiva: permitida si no escribe.
- Ejecución real de migraciones: BLOQUEADA en esta fase.
- migrate:fresh: BLOQUEADO.
- db:wipe: BLOQUEADO.
- migrate:reset: BLOQUEADO.
- migrate:rollback: BLOQUEADO.
- db:seed: BLOQUEADO.

No incluir un mecanismo que desactive todas las guardas mediante un argumento simple.

No ejecutar comandos peligrosos para demostrar que están bloqueados.

## FASE 4 — INSPECCIÓN DE MIGRACIONES

Revisar las migraciones existentes y preparar una relación resumida de:

1. Cantidad de archivos.
2. Orden de ejecución.
3. Dependencias importantes.
4. Operaciones destructivas detectadas.
5. Referencias a otras conexiones.
6. Posibles seeders automáticos.
7. Riesgos de restricciones y claves foráneas.
8. Condiciones previas necesarias.

Inspección únicamente; no modificar migraciones.

## FASE 5 — VERIFICACIÓN DEL EJECUTOR

Ejecutar pruebas de sintaxis y controles negativos sin escrituras SQL.

Comprobar que el ejecutor:

- Rechaza una base incorrecta.
- Rechaza un puerto incorrecto.
- Rechaza un usuario administrativo.
- Rechaza APP_ENV distinto de testing.
- Rechaza TLS no verificado.
- Rechaza conexiones no identificadas.
- Rechaza cambios de configuración posteriores a las guardas.
- Rechaza operaciones destructivas.
- No expone credenciales.
- No escribe en directorios de desarrollo.

Si es necesario iniciar MySQL para lecturas de validación, utilizar únicamente el procedimiento aislado ya verificado y detenerlo de forma segura.

No ejecutar SQL de escritura ni iniciar Laravel HTTP para atender solicitudes funcionales.

## FASE 6 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente este prompt en:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-16-ejecutor-migraciones.md`

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ejecutor-migraciones.md`

Registrar:

- Componentes reutilizados.
- Archivos locales creados o modificados.
- Guardas integradas.
- Resultados de controles negativos.
- Estado de las migraciones.
- Comandos de diagnóstico ejecutados.
- Riesgos y bloqueos pendientes.
- Procedimiento de recuperación.
- Condiciones exactas para autorizar la primera migración.

No incluir credenciales, certificados privados ni datos personales.

## RESTRICCIONES

- No ejecutar migraciones reales.
- No ejecutar seeders.
- No ejecutar Pest ni Cypress reales.
- No modificar código funcional.
- No modificar archivos .env activos.
- No modificar zarate_dev.
- No crear ni borrar bases de datos.
- No modificar privilegios.
- No reinicializar MySQL.
- No instalar dependencias.
- No modificar otros Bolts.
- No publicar archivos locales de .tools.
- No realizar commits, push, merge ni PR.

## RESULTADO ESPERADO

Clasificar como:

- `EJECUTOR PREPARADO — PENDIENTE DE AUTORIZACIÓN DE MIGRACIÓN`.
- `CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES`.
- `BLOQUEADO POR SEGURIDAD`.

Indicar el siguiente paso mínimo para ejecutar migraciones únicamente sobre zarate_test.

No declarar completada la validación integral.