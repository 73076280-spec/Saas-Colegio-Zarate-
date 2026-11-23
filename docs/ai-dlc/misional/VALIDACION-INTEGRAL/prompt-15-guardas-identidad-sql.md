# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 15: Integración de guardas SQL y autorización de migraciones aisladas

Actúa como ingeniero senior de Laravel 13, PHP 8.4, MySQL 8.4, PHPUnit, Pest y DevOps en Windows.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: `D:\zarate-saas`

Rama obligatoria: `test/integracion-misional`

Entorno local de pruebas: `.tools/misional-isolated`

MySQL: `127.0.0.1:3308`

Base: `zarate_test`

Cuenta: `zarate_test@127.0.0.1`

TLS: obligatorio, con CA local y certificado verificado para `127.0.0.1`.

## ANTECEDENTES

Prompt 13: TLS y conexión PDO/Laravel verificados.

Prompt 14: adaptadores HTTP/Pest preparados, nueve scripts PHP sintácticamente válidos y 30 controles satisfactorios.

Bloqueo pendiente: integrar la comprobación vigente de identidad, datadir y privilegios SQL con los mecanismos que permitirán ejecutar Laravel y Pest.

Las migraciones y pruebas reales continúan bloqueadas.

## OBJETIVO

Completar los adaptadores y guardas locales para que, inmediatamente antes de cualquier futura migración o prueba con escritura, se compruebe la identidad efectiva de MySQL y su aislamiento.

Preparar una autorización técnica documentada para la siguiente etapa, sin ejecutar todavía operaciones SQL de escritura.

## FASE 1 — RECUPERAR EL TRABAJO

Leer íntegramente:

- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-base-usuario.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-tls.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-adaptadores-laravel-pest.md`

Inspeccionar los adaptadores y guardas existentes en `.tools/misional-isolated`.

No duplicar scripts ni crear mecanismos innecesarios.

Confirmar rama, estado Git y que no existen modificaciones funcionales ajenas.

## FASE 2 — IDENTIDAD SQL VIGENTE

Diseñar e integrar en las guardas existentes las comprobaciones de:

1. Host efectivo `127.0.0.1`.
2. Puerto efectivo `3308`.
3. Base seleccionada `zarate_test`.
4. Cuenta efectiva restringida.
5. Datadir exclusivo.
6. Versión y servidor esperados.
7. Conexión TLS con certificado validado.
8. Privilegios limitados a `zarate_test`.
9. Ausencia de privilegios globales peligrosos.
10. Ausencia de conexión o permisos sobre `zarate_dev`.

Las comprobaciones deberán ejecutarse sobre la conexión real utilizada por Laravel, no únicamente sobre archivos `.env`.

No aceptar una evidencia histórica del Prompt 11 como sustituto de una verificación vigente.

## FASE 3 — GUARDAS DE EJECUCIÓN

Asegurar que los adaptadores locales:

- Bloqueen cualquier ejecución ante identidad SQL incorrecta.
- Bloqueen si no pueden comprobar datadir o cuenta efectiva.
- Rechacen configuraciones que permitan fallback a desarrollo.
- Verifiquen que PHPUnit no sobrescriba silenciosamente la conexión.
- Mantengan `APP_ENV=testing`.
- Aíslen sesiones, caché, almacenamiento y colas.
- Utilicen exclusivamente PHP 8.4 portátil.
- No expongan credenciales.
- No ejecuten comandos de escritura automáticamente.

Una guarda debe fallar de manera segura ante cualquier duda.

Evitar que una comprobación aprobada pueda reutilizarse después de cambiar la conexión o el proceso MySQL.

## FASE 4 — VERIFICACIÓN REAL DE SOLO LECTURA

Si los controles offline son satisfactorios:

1. Iniciar únicamente el MySQL aislado.
2. Verificar PID, puerto y datadir.
3. Autenticar exclusivamente con `zarate_test`.
4. Ejecutar consultas SQL de solo lectura para confirmar identidad, versión, cuenta, base y privilegios.
5. Verificar TLS.
6. Confirmar que Laravel utiliza esa misma conexión.
7. Probar los adaptadores en modo diagnóstico, sin ejecutar migraciones.
8. Confirmar que el esquema continúa sin tablas académicas.
9. Detener MySQL de forma controlada.
10. Verificar que desarrollo permanece intacto.

No utilizar `root` para las verificaciones de Laravel.

No ejecutar SQL de escritura.

## FASE 5 — PRUEBAS NEGATIVAS

Verificar que las guardas rechazan:

- Puerto incorrecto.
- Base incorrecta.
- Usuario administrativo.
- TLS inválido.
- Datadir inesperado.
- APP_ENV distinto de testing.
- Configuración PHPUnit incompatible.
- Caché o almacenamiento compartido.
- Identidad SQL no verificable.
- Conexión a un servidor diferente.

Las comprobaciones negativas no deben ejecutar escrituras ni conectarse a bases de desarrollo.

## FASE 6 — PLAN DE MIGRACIONES

Inspeccionar las migraciones Laravel existentes.

Identificar:

1. Orden esperado de ejecución.
2. Dependencias entre migraciones.
3. Operaciones destructivas, si existen.
4. Referencias a conexiones externas.
5. Seeders que puedan ejecutarse automáticamente.
6. Necesidad de tablas iniciales.
7. Riesgos para la base `zarate_test`.
8. Procedimiento de recuperación ante un fallo parcial.
9. Cómo comprobar que las migraciones afectarían únicamente a la base aislada.
10. Cómo evitar que Pest limpie esquemas diferentes del autorizado.

No ejecutar `php artisan migrate`, `migrate:fresh`, `db:wipe`, `db:seed` ni comandos equivalentes.

No ejecutar Pest ni Cypress todavía.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente este prompt en:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-15-guardas-identidad-sql.md`

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-guardas-identidad-sql.md`

Documentar:

- Adaptadores modificados.
- Resultados de identidad SQL.
- Comprobaciones de privilegios.
- Verificación TLS.
- Guardas positivas y negativas.
- Pruebas de aislamiento.
- Estado del esquema.
- Riesgos de migraciones.
- Bloqueadores.
- Procedimiento de recuperación.
- Decisión sobre la siguiente etapa.

No registrar secretos.

## RESTRICCIONES

- No reinicializar MySQL.
- No modificar `zarate_dev`.
- No crear, borrar o modificar tablas.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest ni Cypress reales.
- No modificar código funcional.
- No cambiar archivos `.env` activos.
- No modificar otros Bolts.
- No publicar archivos locales de `.tools`.
- No realizar commits, push, merge ni PR.

## RESULTADO ESPERADO

Clasificar como:

- `GUARDAS SQL VERIFICADAS — APTO PARA MIGRACIÓN CONTROLADA`.
- `CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES`.
- `BLOQUEADO POR SEGURIDAD`.

Indicar exactamente qué falta antes de ejecutar la primera migración real.

No declarar las pruebas integrales completadas.