# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 14: Adaptadores seguros Laravel/Pest y preparación de migraciones

Actúa como ingeniero senior de Laravel 13, PHP 8.4, MySQL 8.4, Pest, PHPUnit, Cypress y DevOps en Windows.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: `D:\zarate-saas`

Rama obligatoria: `test/integracion-misional`

Entorno aislado: `.tools/misional-isolated`

Instancia MySQL: `127.0.0.1:3308`

Base exclusiva: `zarate_test`

Usuario exclusivo: `zarate_test`

PHP portátil: utilizar la ruta real y la versión previamente verificadas.

## ANTECEDENTES

El Prompt 13 fue cerrado satisfactoriamente:

- Certificado TLS válido con SAN IP:127.0.0.1.
- Cadena de confianza y claves verificadas.
- PDO y conector Laravel con TLS estricto.
- Dos conexiones y cinco consultas SQL de lectura.
- Cero escrituras SQL.
- Instancia MySQL detenida correctamente.
- Desarrollo conservado.

Pendientes: adaptadores HTTP/Pest, precedencias de PHPUnit, guardas previas a migraciones y configuración Sanctum/Cypress.

## OBJETIVO

Implementar y verificar los mecanismos locales necesarios para ejecutar Laravel HTTP y Pest exclusivamente contra la base de pruebas aislada.

Determinar las condiciones exactas para autorizar las migraciones en una fase posterior.

No ejecutar todavía migraciones, seeders ni suites de pruebas con escritura.

## FASE 1 — REVISIÓN

Leer íntegramente:

- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-base-usuario.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-configuracion-integracion.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-tls.md`

Revisar las configuraciones reales de Laravel, Pest, PHPUnit, Sanctum y Vite.

Inspeccionar los perfiles y scripts locales existentes, sin exponer credenciales.

Verificar rama y estado Git.

## FASE 2 — ADAPTADORES HTTP Y PEST

Preparar únicamente dentro de `.tools/misional-isolated`:

1. Un mecanismo de carga de variables para Laravel HTTP.
2. Un mecanismo de carga de variables para Pest.
3. Comprobaciones de rutas y ejecutables.
4. Verificación de configuración efectiva.
5. Detección de valores heredados del entorno.
6. Bloqueo por variables ausentes o contradictorias.
7. Registro de evidencias sin secretos.

Utilizar PHP 8.4 portátil.

No modificar los archivos `.env` de desarrollo.

No copiar credenciales a archivos versionados.

No permitir fallback hacia la base de desarrollo.

## FASE 3 — PRECEDENCIAS Y AISLAMIENTO

Comprobar la precedencia efectiva de:

- Variables de entorno del proceso.
- Archivos `.env` y `.env.testing`.
- Configuración de PHPUnit.
- Variables PHP.
- Configuración de Laravel.
- Conexiones de base de datos.
- Almacenamiento.
- Sesiones.
- Cachés.
- Colas.
- Correo.
- Archivos temporales.

Rechazar cualquier configuración que apunte a `zarate_dev`, puerto de desarrollo o recursos institucionales.

No escribir en cachés compartidas.

## FASE 4 — GUARDAS ANTES DE MIGRACIONES

Implementar un mecanismo que BLOQUEE cualquier futura migración si no se acredita:

1. `APP_ENV=testing`.
2. `DB_CONNECTION=mysql`.
3. `DB_HOST=127.0.0.1`.
4. `DB_PORT=3308`.
5. `DB_DATABASE=zarate_test`.
6. `DB_USERNAME=zarate_test`.
7. TLS estricto y CA de pruebas.
8. Identidad efectiva del servidor.
9. Datadir aislado.
10. Ausencia de conexión a desarrollo.
11. Cuenta restringida al esquema de pruebas.
12. Almacenamiento y sesiones aislados.
13. Ausencia de configuración de caché compartida.
14. Ausencia de destinos externos para notificaciones, correo o colas.

El guard debe fallar de forma segura.

No crear un comando que ejecute automáticamente migraciones.

## FASE 5 — PEST Y REFRESHDATABASE

Auditar los archivos de pruebas actuales.

Identificar:

- Pruebas que utilizan RefreshDatabase.
- Pruebas que ejecutan migraciones.
- Pruebas que utilizan seeders o factories.
- Dependencias de datos institucionales.
- Configuraciones SQLite/MySQL.
- Riesgos de limpieza de datos.
- Requisitos de aislamiento multiinstitución.
- Dependencias entre pruebas.

Crear una clasificación de pruebas:

- Seguras para una futura ejecución aislada.
- Requieren preparación.
- Bloqueadas.

No ejecutar suites Pest todavía.

## FASE 6 — HTTP, SANCTUM Y CYPRESS

Revisar la coherencia entre:

- Laravel: `127.0.0.1:8001`.
- Vite: `127.0.0.1:5174`.
- MySQL: `127.0.0.1:3308`.

Comprobar:

1. Cookies y sesiones Sanctum.
2. Orígenes autorizados.
3. Configuración CORS.
4. Cabeceras Origin y Referer.
5. Proxy de Vite.
6. Base URL de Cypress.
7. Specs con puertos fijos 5173/8000.
8. Uso de interceptaciones API.
9. Riesgo de peticiones a desarrollo.

Documentar los cambios mínimos necesarios.

No modificar todavía los specs Cypress existentes.

## FASE 7 — VERIFICACIONES NO DESTRUCTIVAS

Ejecutar:

- Validación sintáctica de scripts.
- Pruebas de guardas negativas.
- Inspección de configuración efectiva sin escritura.
- Verificaciones de aislamiento de rutas.
- Verificación de ausencia de secretos.
- Comprobaciones de estado Git.

Si fuera indispensable una conexión, permitir únicamente consultas SQL de lectura después de verificar identidad y TLS.

No iniciar Laravel HTTP para atender peticiones funcionales todavía.

No ejecutar migraciones ni pruebas Pest/Cypress.

## FASE 8 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente este prompt en:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-14-adaptadores-laravel-pest.md`

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-adaptadores-laravel-pest.md`

Documentar:

1. Estado inicial.
2. Adaptadores creados.
3. Variables y precedencias verificadas.
4. Guardas de seguridad.
5. Pruebas negativas.
6. Clasificación de Pest.
7. Configuración de HTTP.
8. Hallazgos de Sanctum/Cypress.
9. Riesgos pendientes.
10. Condiciones para autorizar migraciones.
11. Próximo paso recomendado.

## RESTRICCIONES

- No reinicializar MySQL.
- No modificar `zarate_dev`.
- No crear ni borrar bases.
- No ejecutar migraciones.
- No ejecutar seeders.
- No ejecutar Pest o Cypress reales.
- No modificar código funcional.
- No modificar `.env` activos.
- No modificar otros Bolts.
- No publicar secretos.
- No instalar dependencias.
- No hacer commits, push, merge ni PR.

Solo están permitidos scripts locales de preparación, comprobaciones seguras y documentación.

## RESULTADO ESPERADO

Clasificar:

- `ADAPTADORES VERIFICADOS — APTO PARA PLANIFICAR MIGRACIONES`.
- `CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES`.
- `BLOQUEADO POR SEGURIDAD`.

Distinguir con precisión lo verificado de lo pendiente.

No declarar ejecutadas las pruebas integrales.