# Estado local de esta estación

Se descargaron herramientas portátiles dentro de D:\zarate-saas\.tools:
PHP 8.4.26 y MySQL 8.4.11. No se registraron servicios de Windows ni se modificó el PATH
permanente. .tools y los .env están excluidos de Git.

## Arranque después de cerrar las terminales

Desde la raíz, iniciar MySQL en una terminal:
```powershell
& '.\.tools\mysql-8.4.11-winx64\bin\mysqld.exe' --defaults-file='D:/zarate-saas/.tools/mysql-local.ini' --console
```
No volver a inicializar el directorio de datos. Escucha solamente en 127.0.0.1:3307.
Las bases zarate_dev y zarate_test ya tienen las migraciones base; sus usuarios son distintos
y solo tienen permisos sobre su propia base. Las contraseñas están en los .env locales.

En otra terminal:
```powershell
$env:PATH = "D:\zarate-saas\.tools\php;$env:PATH"
Set-Location D:\zarate-saas\backend
php artisan serve --host=127.0.0.1 --port=8000
```
En una tercera:
```powershell
Set-Location D:\zarate-saas\frontend
npm run dev -- --host 127.0.0.1
```

Detener Laravel y Vite con Ctrl+C. Para apagar MySQL limpiamente desde la raíz:
```powershell
& '.\.tools\mysql-8.4.11-winx64\bin\mysqladmin.exe' --defaults-extra-file='D:/zarate-saas/.tools/mysql-admin.ini' shutdown
```
mysql-admin.ini contiene credenciales locales y está ignorado por Git; no compartirlo.

## Docker posterior
Detener los servidores locales antes de publicar :8000 y :5173 desde Compose.
El MySQL local usa :3307; Compose no publica MySQL y fuerza DB_PORT=3306 dentro de su red.
Los datos portátiles no se importan automáticamente a Docker.

## Cypress desde VS Code
Los scripts npm usan un lanzador que elimina ELECTRON_RUN_AS_NODE solo del proceso hijo.
Si existe .tools/cypress-cache, la reutiliza. No altera variables del sistema.
