# Compatibilidad

Selección contrastada con documentación oficial y resolución real de dependencias.
Sin etiquetas latest; conservar composer.lock y los lockfiles npm.
Las imágenes MySQL/Nginx siguen ramas estables; antes de producción fijar digest y verificar
actualizaciones de seguridad. Estos Dockerfiles son para desarrollo.

- PHP portátil 8.4.26, archivo oficial NTS x64 y SHA-256 verificado.
- Laravel 13 requiere PHP >=8.3; el proyecto exige >=8.4 para Pest/PHPUnit.
- Spatie Permission 7 y Sanctum 4: compatibilidad con Laravel 13 verificada por Composer.
- Pest 4 + plugin Laravel 4, PHPUnit 12: compatibles con PHP 8.4.
- Vite 8 requiere Node ^20.19 o >=22.12.
- Cypress 16.1.1 requiere Node 22, 24 o >=26.
- React 19, TypeScript 6 y Tailwind 4 integrados con @tailwindcss/vite.
- MySQL 8.4 LTS: desarrollo y testing separados.

Fuentes:
- https://laravel.com/docs/13.x/releases
- https://pestphp.com/docs/installation
- https://spatie.be/docs/laravel-permission/v7/prerequisites
- https://vite.dev/guide/
- https://tailwindcss.com/docs/installation/using-vite
- https://docs.cypress.io/app/get-started/install-cypress
- https://dev.mysql.com/downloads/mysql/8.4.html

Composer se invoca directamente con php composer.phar al usar restricciones con ^
en PowerShell, para evitar que composer.bat pierda ese carácter.
