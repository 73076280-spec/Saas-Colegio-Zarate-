# Plataforma SaaS Colegio Zárate

Sistema web educativo multiinstitución, orientado inicialmente al Colegio Zárate de Huancayo. Integra administración institucional, procesos académicos, seguimiento familiar, trámites, reportes y auditoría. Sprint 10 consolida el cierre funcional para demostración y sustentación; no incluye despliegue productivo ni integraciones externas.

## Arquitectura y stack

React + TypeScript + Tailwind → API REST Laravel/PHP → MySQL. Laravel valida y autoriza; React presenta la experiencia. Sanctum utiliza sesiones y CSRF; Spatie Permission aplica roles por institución. El contexto institucional se obtiene del usuario autenticado y se conserva en consultas y operaciones.

Versiones del proyecto: PHP 8.4, Laravel 13, Sanctum 4, Spatie Permission 7, MySQL 8.4 LTS, React 19, TypeScript 6, Tailwind 4, Vite 8, Pest 4/PHPUnit 12 y Cypress 16. Node compatible según package.json; esta estación usa Node 26.7.0. Los lockfiles son la referencia exacta.

## Estructura

~~~text
zarate-saas/
├── backend/       Laravel, API, Policies, Services, migraciones y Pest
├── frontend/      React, TypeScript, Tailwind y Vite
├── e2e/           Cypress y flujos funcionales
├── docs/          Arquitectura, trazabilidad, manuales y sprints
├── docker/        Configuración preexistente; fuera del cierre local
├── .tools/        Herramientas portátiles locales, excluidas de Git
├── docker-compose.yml
├── README.md
└── CONTRIBUTING.md
~~~

## Requisitos e instalación inicial

PHP 8.4 con pdo_mysql, mbstring, openssl, curl, fileinfo, intl y zip; Composer; Node compatible; MySQL 8.4. No instalar ni regenerar dependencias al iniciar una instalación ya preparada.

Solo en una copia nueva:

1. En backend ejecutar composer install usando composer.lock.
2. Copiar backend/.env.example a backend/.env y backend/.env.testing.example a backend/.env.testing únicamente si no existen.
3. Configurar bases separadas zarate_dev y zarate_test, con usuarios diferentes y permisos limitados a su propia base. En esta estación MySQL local escucha en 127.0.0.1:3307. Nunca publicar .env ni usar secretos en VITE_*.
4. Generar APP_KEY solo si falta, ejecutar migraciones en ambas bases y seeders demo en desarrollo.
5. Ejecutar npm ci en frontend y e2e. Preparar el binario de Cypress solo si no está disponible.

Desde backend, para esa instalación inicial:

~~~text
php artisan key:generate
php artisan key:generate --env=testing
php artisan migrate
php artisan migrate --env=testing
php artisan db:seed --class=DevelopmentSeeder
~~~

DevelopmentSeeder crea las cuentas y prepara la demo completa: grados, secciones, matrículas aprobadas, cursos del docente y datos relacionados. Los seeders demo solo se permiten en local/testing y son idempotentes; no restablecen contraseñas previamente modificadas. Para una instalación Docker ya migrada, ejecutar desde la raíz `docker compose exec backend php artisan db:seed --class=DevelopmentSeeder`. No ejecutar migrate:fresh ni reseedear al preparar cada demostración. Sprint 10 no crea tablas ni requiere nuevas dependencias.

## Arranque de la instalación existente

Reutilizar los servicios activos. Iniciar solo los ausentes en tres terminales, sin reinstalar, migrar ni regenerar claves:

Terminal 1, desde D:\zarate-saas:

~~~powershell
& '.\.tools\mysql-8.4.11-winx64\bin\mysqld.exe' --defaults-file='D:/zarate-saas/.tools/mysql-local.ini' --console
~~~

Terminal 2, desde D:\zarate-saas\backend:

~~~powershell
$env:PATH = 'D:\zarate-saas\.tools\php;' + $env:PATH
& '..\.tools\php\php.exe' artisan serve --host=127.0.0.1 --port=8000
~~~

Terminal 3, desde D:\zarate-saas\frontend:

~~~powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
~~~

Abrir **http://localhost:5173/login** y mantener localhost para las cookies. Vite reenvía /api y /sanctum a Laravel :8000. GET http://localhost:5173/api/health permite comprobar el proxy; la pantalla técnica permanece en /. No cambiar puertos sin ajustar la configuración correspondiente.

Los binarios de .tools no se distribuyen como código del producto. No se modificaron Windows, WSL ni Docker durante Sprint 10. Más detalles del entorno existente en [desarrollo-local.md](docs/desarrollo-local.md).


## Cuentas demo

Institución: **ZARATE**. Contraseña inicial: **ZarateDemo2026!**, si no se modificó. Solo desarrollo.

| Rol | Correo |
| --- | --- |
| Administrador | administrator@zarate.test |
| Secretaría | secretary@zarate.test |
| Tesorería | treasury@zarate.test |
| Docente demo | teacher@zarate.test |
| Estudiante | student@zarate.test |
| Estudiante 2 (matrícula observada) | student2@zarate.test |
| Estudiante 3 | student3@zarate.test |
| Estudiante 4 | student4@zarate.test |
| Estudiante 5 | student5@zarate.test |
| Estudiante 6 | student6@zarate.test |
| Apoderado | guardian@zarate.test |

El docente demo tiene cuatro cursos activos (Matemática y Comunicación en 1.º A; Ciencia y Tecnología e Inglés en 2.º A), con estudiantes de matrícula aprobada en ambas secciones. Al entrar en cada curso se pueden gestionar sus propias unidades y materiales, tareas, entregas, evaluaciones, calificaciones y asistencia; las tarjetas y sus indicadores consultan la API y la base de datos. student2@zarate.test conserva una matrícula observada para demostrar que no aparece en el roster. Los perfiles vinculados y los datos de matrícula, pagos, materiales, tareas, entregas, notas, asistencia, solicitudes y comunicaciones permiten demostrar los procesos. Las pruebas E2E conservan registros identificables; buscar por nombre/código, no asumir que la demo está en la primera página.

## Módulos

Autenticación, usuarios/roles/permisos e institución; años/periodos/niveles/grados/secciones/asignaturas; estudiantes/docentes/apoderados y familias; matrículas/cupos/pagos; asignación docente/cursos; aula virtual/unidades/materiales; tareas/entregas/evaluaciones/notas e historial; asistencia/justificaciones; solicitudes/documentos/comunicaciones/notificaciones; auditoría; veinte reportes con CSV y seis dashboards reales.

Los reportes se organizan en Académicos, Matrícula, Asistencia, Calificaciones, Docentes, Pagos y Solicitudes. Los filtros disponibles corresponden al reporte y las opciones se autorizan en backend. La carga docente cuenta asignaciones/cursos; no inventa horas.

## Seguridad

Sanctum y CSRF; cuenta e institución activas; cambio obligatorio de contraseña inicial; Policies y scopes institucionales; Form Requests y transacciones; permisos delegables sin escalamiento. Estudiante y apoderado consultan exclusivamente datos propios/vinculados. Archivos privados con MIME y tamaño validados, descarga autorizada y rutas internas ocultas. CSV neutraliza fórmulas. Auditoría e historiales preservan operaciones sin registrar contraseñas ni contenido privado innecesario.

Inventario real: **52 tablas** (incluyendo infraestructura) y **213 endpoints API** por método/ruta, excluyendo HEAD implícito: 210 del cierre de Sprint 10 y 3 de fotos del refresh visual posterior. No se afirma preparación productiva: despliegue, respaldo/restauración y carga real requieren validación específica.

El [refresh visual](docs/diseno-visual.md) incorpora identidad institucional, fotos propias privadas y tema claro/oscuro persistente por cuenta. El toggle está en el header autenticado; el login permanece claro. No requiere migraciones ni nuevas dependencias.

## Pruebas y calidad

Desde backend:

~~~powershell
& '..\.tools\php\php.exe' vendor/bin/pest --compact
& '..\.tools\php\php.exe' vendor/bin/pint --test
~~~

Desde frontend:

~~~text
npm run lint
npm run build
~~~

build ejecuta TypeScript y Vite. Desde e2e:

~~~text
npm run typecheck
npm test
~~~

Pest utiliza exclusivamente zarate_test; Cypress necesita MySQL, Laravel :8000 y Vite :5173 disponibles. No contar reejecuciones como casos nuevos. Sprint 10 añade solo cinco Pest y dos Cypress críticos. Consultar cifras y resultados comprobados en [quality-metrics.md](docs/quality-metrics.md).

## Documentación final

- [Arquitectura y seguridad](docs/architecture.md).
- [Modelo de datos](docs/database.md).
- [API REST](docs/api.md).
- [Roles y permisos](docs/roles-permissions.md).
- [Trazabilidad RF-01 a RF-24](docs/traceability.md).
- [Matriz de cumplimiento](docs/requirements-status.md).
- [Métricas de calidad](docs/quality-metrics.md).
- [Documento final del sistema](docs/final-system.md).
- [Demostración de 10–15 minutos](docs/demo-guide.md).
- [Manual de prueba por rol](docs/manual-test-guide.md).
- [Sprint 10](docs/sprints/sprint-10.md).
- [Sprints anteriores](docs/sprints/) y [pruebas](docs/pruebas.md).

No se implementan app móvil nativa, email/SMS/WhatsApp, ERP, nómina, IA ni integraciones externas en este cierre.
