# Iteración 0 — registro de implementación

## Implementado
- Monorepo en D:\zarate-saas; Git inicializado en main, sin commits ni remoto.
- backend/: Laravel 13.34.0, Sanctum 4.3.3, Spatie Permission 7.4.2.
- frontend/: React 19.3.0, TypeScript 6.0.3, Vite 8.3.2, Tailwind 4.3.3.
- Pest 4.7.8 / PHPUnit 12.5.33; Cypress 16.1.1.
- GET /api/health; pantalla técnica con estados de carga, éxito y error.
- Configuración Spatie teams con institution_id; sin datos ni rutas de negocio.
- Dockerfiles, Compose, MySQL de desarrollo y testing separados.
- Ejemplos de entorno sin secretos, documentación y carpetas reservadas para módulos futuros.
- PHP 8.4.26 y MySQL 8.4.11 portátiles en .tools, excluidos de Git.
- MySQL local en 127.0.0.1:3307, bases zarate_dev / zarate_test y usuarios separados.
- Cinco migraciones base aplicadas en ambas bases, sin seeders de usuarios ni académicos.

## Comandos principales ejecutados
- git init -b main
- Composer create-project laravel/laravel backend ^13.0 --no-scripts
- Composer require laravel/sanctum:^4.0 spatie/laravel-permission:^7.0
- Composer require --dev pestphp/pest:^4.0 pestphp/pest-plugin-laravel:^4.0
- Publicación de configuración/migraciones con artisan vendor:publish.
- Generación de claves locales; migraciones de desarrollo y testing.
- npm create vite@9.2.1 frontend -- --template react-ts --no-interactive
- Instalación npm de React, Vite, Tailwind y Cypress, conservando lockfiles.
- npx cypress install; composer validate --strict; composer check-platform-reqs.
- php vendor/bin/pint --test; php vendor/bin/pest.
- npm run lint; npm run build; npm run typecheck (e2e); npm test (e2e).
- Validación de sintaxis YAML de Compose y existencia de los Dockerfiles.

Composer se invocó mediante PHP y composer.phar al especificar rangos ^, para evitar
que composer.bat alterase los argumentos. La instalación inicial con ese wrapper falló
y Composer revirtió sus archivos; la invocación directa resolvió la instalación.

## Resultados verificados
| Verificación | Resultado |
| --- | --- |
| Composer validate --strict | Correcto |
| Requisitos PHP de dependencias | Correctos |
| Pint --test | Correcto |
| Pest con MySQL real | 6 aprobadas, 16 aserciones |
| Lint frontend | Correcto |
| TypeScript + build Vite | Correcto |
| Tipos de Cypress | Correctos |
| Cypress UI + integración real | 4 aprobadas |
| HTTP GET /api/health | 200 y JSON esperado |
| Migraciones desarrollo/testing | 5 aplicadas en cada base |
| YAML y rutas Dockerfile | Correctos |
| Build y ejecución Docker Compose | Pendiente: Docker no disponible |

Cypress se ejecutó con Electron 146 headless y Node 26.7.0. Electron está marcado como
deprecated por Cypress; mantener la versión fijada y migrar a Chrome al actualizar Cypress.
El lanzador de e2e elimina ELECTRON_RUN_AS_NODE solo del proceso hijo para funcionar desde
el entorno del editor.

## Límites y pendientes
- No se ejecutaron cambios de Windows ni instalaciones de WSL/Docker durante esta implementación.
- No hay login, registro, gestión de usuarios/instituciones ni módulos académicos.
- institution_id es una preparación de configuración; el aislamiento completo requiere
  membresías, resolución de contexto, Policies y pruebas cruzadas antes de exponer negocio.
- Docker está preparado, pero sus imágenes, volúmenes, red y perfiles deben verificarse
  en un equipo con Docker operativo. Validar YAML no equivale a ejecutar Compose.
- No hay GitHub remoto, commits ni publicación.
- .env y .tools no se versionan; otro equipo debe preparar sus propios entornos.

## Siguiente paso
Verificar Docker Compose y ambos perfiles de pruebas cuando Docker esté disponible.
Después acordar el alcance de la siguiente iteración, comenzando por contexto institucional
y autenticación, antes de módulos académicos.
