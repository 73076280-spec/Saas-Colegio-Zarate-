# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 02: Plan de aislamiento de Laravel y MySQL para pruebas reales

Actúa como ingeniero senior DevOps, QA y administrador de bases de datos especializado en Laravel 13, PHP 8.4, MySQL, Pest, Cypress y Windows PowerShell.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Rama base: feature/macro-misional

Etapa: VALIDACION-INTEGRAL del macroproceso misional.

## RESULTADO DE LA AUDITORÍA ANTERIOR

- PHP predeterminado: 8.2.12, incompatible con el backend.
- PHP portátil: 8.4.26, disponible con pdo_mysql.
- Frontend React/Vite: respondió HTTP 200 en el puerto 5173.
- Disponibilidad de Laravel y MySQL de pruebas: no acreditada.
- Aislamiento efectivo de las pruebas: no verificado.
- No se ejecutaron migraciones ni pruebas reales.

## DOCUMENTACIÓN OBLIGATORIA

Lee íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/diagnostico-entorno.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-01-auditoria-entorno.md

Consulta el código y las configuraciones existentes de Laravel, Pest, Cypress y MySQL.

## OBJETIVO

Preparar un plan técnico, seguro y reproducible para ejecutar pruebas reales de integración sin afectar la base zarate_dev, datos institucionales ni el entorno de desarrollo habitual.

Esta fase es exclusivamente de planificación y verificaciones de solo lectura.

## FASE 1 — VERIFICACIÓN DE HERRAMIENTAS

Identifica las rutas reales de:

1. PHP 8.4 portátil.
2. Archivo php.ini utilizado por ese ejecutable.
3. Composer.
4. MySQL portátil.
5. Ejecutables mysqld y mysql, si existen.
6. Directorio de datos actual de MySQL.
7. Backend Laravel.
8. Frontend React.
9. Configuración de Vite.
10. Configuración de Cypress.

No inventes rutas.

Comprueba las versiones mediante comandos de solo lectura y utilizando los ejecutables concretos.

No publiques contraseñas ni tokens.

## FASE 2 — AISLAMIENTO DE MYSQL

Determina si es viable utilizar una instancia MySQL exclusiva para pruebas.

Evalúa:

- Puerto diferente del utilizado por desarrollo.
- Directorio de datos independiente.
- Archivo de configuración independiente.
- Cuenta restringida a la base de pruebas.
- Base de datos exclusiva para pruebas.
- Ausencia de conexiones a zarate_dev.
- Riesgo de utilizar un servicio MySQL ya existente.
- Procedimiento seguro de inicio y detención.
- Posibilidad de repetir el proceso.

No presupongas que cambiar DB_DATABASE es suficiente para demostrar aislamiento.

No ejecutes mysqld --initialize, CREATE DATABASE, CREATE USER, migraciones ni otros comandos que escriban datos en esta fase.

Si detectas una opción de aislamiento más sencilla y verificablemente segura, compárala con la instancia separada.

## FASE 3 — CONFIGURACIÓN DE LARAVEL

Revisa:

- backend/.env.example
- phpunit.xml y archivos de configuración de pruebas.
- Configuración actual de conexiones.
- Configuración de sesiones.
- Caché.
- Colas.
- Almacenamiento de archivos.
- Entorno APP_ENV.
- Configuración de Pest.
- Uso de RefreshDatabase.
- Seeders y factories utilizados por las pruebas.

Identifica los archivos de configuración adicionales que serían necesarios para pruebas.

No modificar .env existente.

No copiar credenciales institucionales a documentación.

No compartir claves de aplicación ni contraseñas.

Comprueba si el entorno puede evitar efectos externos mediante drivers de prueba seguros, sin escribir mensajes o archivos institucionales.

## FASE 4 — FRONTEND Y CYPRESS

Revisa:

1. URL del backend.
2. Proxy de Vite.
3. Configuración de cookies y Sanctum.
4. Sesiones.
5. CORS.
6. Base URL de Cypress.
7. Configuración de interceptaciones.
8. Posibilidad de ejecutar Cypress contra backend real.
9. Identidad de los usuarios de prueba.
10. Riesgos de pruebas que modifiquen datos.

Distingue claramente Cypress con API simulada de Cypress con API real.

No inventes usuarios, claves o cuentas institucionales.

## FASE 5 — COMPROBACIONES DE SEGURIDAD OBLIGATORIAS

Diseña verificaciones que deberán ejecutarse antes de cualquier migración o prueba con escritura:

1. Confirmación del ejecutable PHP activo.
2. Confirmación del host y puerto MySQL efectivos.
3. Confirmación del directorio de datos MySQL.
4. Confirmación del nombre de la base de datos.
5. Confirmación de identidad y privilegios del usuario MySQL.
6. Confirmación de APP_ENV=testing.
7. Confirmación de almacenamiento y sesiones aislados.
8. Confirmación de que zarate_dev no es el destino.
9. Confirmación de que no se usa una base institucional.
10. Confirmación de que ningún proceso de limpieza alcanzará datos ajenos.

Si alguna verificación no puede acreditarse, el entorno permanece BLOQUEADO PARA ESCRITURAS.

## FASE 6 — PLAN DE IMPLEMENTACIÓN

Propón una secuencia segura para una siguiente fase:

1. Crear recursos aislados.
2. Configurar Laravel para pruebas.
3. Verificar conexiones.
4. Preparar datos sintéticos.
5. Ejecutar pruebas Pest.
6. Iniciar backend de pruebas.
7. Configurar Cypress para backend real.
8. Ejecutar pruebas de integración misional.
9. Recoger evidencias.
10. Detener servicios sin afectar desarrollo.

Para cada paso indica:

- Precondiciones.
- Comando PowerShell propuesto.
- Ruta.
- Riesgo.
- Verificación posterior.
- Criterio de detención.
- Posibilidad de revertirlo.

Los comandos de escritura solo deben documentarse como propuestas; NO ejecutarlos ahora.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-02-plan-aislamiento.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md

Incluye:

1. Inventario de rutas verificadas.
2. Arquitectura propuesta del entorno.
3. Separación entre desarrollo y pruebas.
4. Configuraciones necesarias.
5. Riesgos y medidas preventivas.
6. Comandos propuestos.
7. Comprobaciones de seguridad.
8. Plan de ejecución por etapas.
9. Criterios para autorizar pruebas con escritura.
10. Bloqueadores pendientes.

## RESTRICCIONES

- No modificar frontend ni backend.
- No modificar archivos .env.
- No iniciar servicios que escriban datos.
- No crear bases ni usuarios MySQL.
- No ejecutar migraciones o seeders.
- No ejecutar Pest ni Cypress con backend real.
- No instalar dependencias.
- No modificar datos.
- No modificar otros Bolts.
- No realizar commits, push, merge ni PR.
- No publicar secretos.

Solo puedes crear los dos documentos indicados.

## RESULTADO ESPERADO

Entrega:

1. Rutas y herramientas verificadas.
2. Estrategia recomendada de aislamiento.
3. Comandos seguros propuestos para configurar el entorno.
4. Riesgos identificados.
5. Verificaciones obligatorias.
6. Estado de preparación: APTO PARA CONFIGURAR, REQUIERE AJUSTES o BLOQUEADO.

No realizar todavía operaciones de escritura.