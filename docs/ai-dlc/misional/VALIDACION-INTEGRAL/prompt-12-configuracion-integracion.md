# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 12: Configuración segura de Laravel, Pest y Cypress para el entorno aislado

Actúa como ingeniero senior de Laravel 13, PHP 8.4, MySQL 8.4, React 19, Vite, Pest, Cypress, DevOps y seguridad de aplicaciones SaaS multiinstitución.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio local: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Rama base: feature/macro-misional

Entorno aislado: D:\zarate-saas\.tools\misional-isolated

## ESTADO CONFIRMADO

El Prompt 11 completó la creación y verificación de una base y cuenta de pruebas:

- Motor: MySQL 8.4.11.
- Host: 127.0.0.1.
- Puerto: 3308.
- Base: zarate_test.
- Usuario: zarate_test@127.0.0.1.
- Base vacía: cero tablas.
- Privilegios restringidos al esquema de pruebas.
- TLS obligatorio.
- Instancia aislada detenida correctamente.
- Entorno de desarrollo conservado.

Las pruebas de integración todavía NO están habilitadas.

## OBJETIVO

Preparar y verificar una configuración exclusiva para Laravel, Pest, Vite y Cypress, de modo que las futuras pruebas reales puedan ejecutarse sin utilizar por accidente la base zarate_dev ni servidores de desarrollo.

El objetivo NO es modificar todavía el esquema de la base, sino acreditar la configuración y los destinos efectivos.

## FASE 1 — REVISIÓN DE DOCUMENTACIÓN

Leer íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/diagnostico-entorno.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-base-usuario.md

Revisar las plantillas locales de .tools/misional-isolated.

Identificar también las configuraciones reales de:

- Laravel.
- PHPUnit/Pest.
- Vite.
- Cypress.
- Sanctum.
- Sesiones.
- Caché.
- Almacenamiento.
- CORS.
- Autenticación.
- Multiinstitución.

No modificar archivos funcionales del proyecto.

## FASE 2 — VERIFICACIÓN DE LARAVEL

Determinar la forma segura de arrancar Laravel utilizando PHP 8.4 portátil y una configuración exclusiva de pruebas.

Comprobar:

1. APP_ENV=testing.
2. APP_DEBUG configurado para un entorno local controlado.
3. DB_CONNECTION=mysql.
4. DB_HOST=127.0.0.1.
5. DB_PORT=3308.
6. DB_DATABASE=zarate_test.
7. DB_USERNAME=zarate_test.
8. Autenticación mediante credencial exclusiva, nunca root.
9. Configuración TLS compatible con la cuenta MySQL.
10. Sesiones aisladas.
11. Caché aislada.
12. Almacenamiento exclusivo.
13. Colas y tareas programadas sin efectos externos.
14. Correo sin envíos reales.
15. Ausencia de conexiones a otros servicios institucionales.
16. Ausencia de fallback hacia zarate_dev.

No utilizar php artisan config:cache ni comandos que escriban cachés compartidas de desarrollo.

Si Laravel necesita archivos de bootstrap o almacenamiento, utilizar únicamente ubicaciones exclusivas verificadas.

## FASE 3 — CONTROL DE TLS

La cuenta zarate_test exige TLS.

Antes de configurar Laravel:

1. Inspeccionar el modo TLS del servidor.
2. Comprobar qué parámetros admite PDO MySQL con el PHP portátil.
3. Revisar la CA local de la instancia aislada.
4. Determinar cómo validar el certificado sin desactivar la verificación de identidad o autenticidad de forma insegura.
5. Distinguir conexión cifrada de conexión autenticada con verificación de certificado.
6. Documentar cualquier limitación derivada de certificados autofirmados.

No copiar claves privadas TLS a Git.

No desactivar el requisito TLS del usuario.

No utilizar configuraciones inseguras como solución silenciosa.

Si la verificación TLS no puede acreditarse, documentar el bloqueo antes de permitir pruebas con escritura.

## FASE 4 — LOADER AISLADO

Diseñar un mecanismo local de lanzamiento que:

- Cargue explícitamente las variables de pruebas.
- No dependa de backend/.env de desarrollo.
- No imprima credenciales.
- No use contraseñas en argumentos visibles.
- Verifique las rutas canónicas antes de iniciar.
- Compruebe APP_ENV=testing.
- Rechace zarate_dev.
- Rechace el puerto MySQL de desarrollo.
- Compruebe DB_DATABASE=zarate_test.
- Compruebe DB_USERNAME=zarate_test.
- Compruebe el destino efectivo de cachés y sesiones.
- Rechace configuraciones ausentes o ambiguas.
- Interrumpa la ejecución ante cualquier fallo.

Si la carga de configuración del proyecto tiene precedencias que puedan sustituir los valores aislados, identificarlo y bloquear la ejecución hasta resolverlo.

No crear mecanismos que permitan lanzar migraciones o seeders automáticamente.

Los scripts locales deben permanecer dentro de .tools/misional-isolated e ignorados por Git.

## FASE 5 — VERIFICACIÓN DE CONEXIÓN REAL

Solo si las guardas previas están aprobadas:

1. Arrancar exclusivamente la instancia MySQL aislada.
2. Verificar PID, puerto y datadir.
3. Preparar el entorno Laravel de pruebas.
4. Ejecutar únicamente una comprobación de lectura para verificar la conexión.
5. Confirmar host y puerto efectivos.
6. Confirmar que la base seleccionada es zarate_test.
7. Confirmar usuario efectivo zarate_test.
8. Confirmar TLS activo y su modo de verificación.
9. Confirmar que la conexión no utiliza root.
10. Confirmar que no existe conexión a zarate_dev.

No permitir consultas de escritura.

No modificar tablas, usuarios o privilegios.

Si no puede realizarse una verificación efectiva y segura, registrar el bloqueo.

## FASE 6 — PEST

Revisar:

- phpunit.xml.
- Configuración de Pest.
- RefreshDatabase.
- Migraciones.
- Seeders.
- Factories.
- Base de datos por defecto de las pruebas.
- Configuraciones que puedan sobrescribir variables.
- Uso de bases en memoria o SQLite, si existen.
- Comandos de limpieza automática.

Determinar qué pruebas podrían ejecutarse después de garantizar el aislamiento.

No ejecutar todavía Pest ni php artisan migrate.

No permitir una prueba con RefreshDatabase hasta que se demuestre que su destino es exclusivamente zarate_test.

## FASE 7 — REACT, VITE Y CYPRESS

Preparar el diseño de un entorno separado:

- Laravel de pruebas: 127.0.0.1:8001.
- Vite de pruebas: 127.0.0.1:5174.
- MySQL de pruebas: 127.0.0.1:3308.

Comprobar:

1. Proxy de Vite.
2. URL efectiva de Laravel.
3. Configuración de Sanctum.
4. Cookies y sesiones.
5. CORS.
6. Origin.
7. Referer.
8. Cabeceras fijadas a 5173 o 8000.
9. Base URL de Cypress.
10. Interceptaciones de API.
11. Pruebas con backend simulado.
12. Pruebas con backend real.
13. Evitar que Cypress alcance servidores de desarrollo.

Proponer cambios mínimos para la próxima fase.

No modificar todavía specs existentes ni ejecutar Cypress real.

## FASE 8 — VALIDACIÓN DE SEGURIDAD

Verificar:

- Configuración de base exclusiva.
- Cuenta restringida.
- TLS.
- Ausencia de credenciales en Git.
- Ausencia de conexiones a desarrollo.
- Almacenamiento aislado.
- Sesiones aisladas.
- Cachés aisladas.
- Ausencia de llamadas externas.
- Preparación de Cypress.
- Preparación de Pest.
- Controles de identidad.
- Procedimiento de parada segura.

No declarar aprobados los controles que solo estén diseñados, pero no ejecutados.

## FASE 9 — CIERRE DE SERVICIOS

Si se inició MySQL:

1. Detener exclusivamente la instancia aislada.
2. Confirmar salida nativa.
3. Comprobar puerto libre.
4. Confirmar ausencia de procesos residuales.
5. Comprobar conservación del entorno de desarrollo.

No detener servicios ajenos.

## FASE 10 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-12-configuracion-integracion.md

Crear:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-configuracion-integracion.md

Documentar:

1. Estado inicial.
2. Configuración Laravel.
3. Loader local y sus verificaciones.
4. Conexión SQL verificada o bloqueada.
5. TLS.
6. Sesiones y almacenamiento.
7. Pest y sus riesgos.
8. Vite y Cypress.
9. Archivos locales creados.
10. Comprobaciones realizadas.
11. Servicios iniciados o detenidos.
12. Bloqueadores.
13. Plan mínimo de ajustes pendientes.
14. Recomendación para la primera prueba real.

No revelar secretos.

## RESTRICCIONES

- No modificar backend/.env.
- No modificar frontend/.env.
- No modificar código funcional.
- No cambiar migraciones.
- No alterar los Bolts anteriores.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest ni Cypress con backend real.
- No crear tablas.
- No ejecutar SQL de escritura.
- No conceder privilegios.
- No modificar contraseñas.
- No copiar secretos a documentación.
- No detener servicios de desarrollo.
- No realizar commits, push, merge ni Pull Requests.

Se permiten únicamente ajustes en archivos locales exclusivos del entorno aislado, comprobaciones de lectura y creación de documentación AI-DLC.

## RESULTADO ESPERADO

Clasifica el resultado:

- CONFIGURACIÓN AISLADA VERIFICADA.
- CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES.
- BLOQUEADO POR SEGURIDAD.

Distingue con claridad qué componentes fueron verificados realmente y cuáles siguen pendientes.

No afirmar que las pruebas reales están habilitadas si Laravel, Pest o Cypress todavía no cumplen los controles requeridos.