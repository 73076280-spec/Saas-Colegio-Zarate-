# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 03: Preparación segura del entorno aislado de pruebas

Actúa como ingeniero senior de DevOps, QA y administración MySQL, especializado en Laravel 13, PHP 8.4, React 19, Cypress, Pest y Windows PowerShell.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio local: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Rama base: feature/macro-misional

Etapa: VALIDACION-INTEGRAL.

## DOCUMENTACIÓN OBLIGATORIA

Lee íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/diagnostico-entorno.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-02-plan-aislamiento.md

Respeta el plan de aislamiento aprobado, sus rutas reales y todos los criterios de detención.

No presupongas que los puertos 3308, 8001 y 5174 están libres: son únicamente candidatos.

## OBJETIVO

Preparar los recursos de configuración de un entorno de pruebas independiente, validar sus rutas y comprobar que las operaciones posteriores no puedan afectar la base zarate_dev ni otras bases existentes.

Esta fase NO autoriza inicializar, crear, migrar, borrar o modificar una base de datos.

## FASE 1 — VERIFICACIONES PREVIAS

1. Confirma que la rama sea test/integracion-misional.
2. Ejecuta git status.
3. Verifica las rutas reales de PHP portátil, MySQL y Composer.
4. Confirma que PHP 8.4 tiene las extensiones necesarias.
5. Verifica qué instancias MySQL están funcionando.
6. Identifica los puertos utilizados.
7. Identifica los procesos asociados a 3306 y 3308, si existen.
8. Determina las rutas efectivas de los directorios de datos de las instancias identificadas, únicamente cuando pueda verificarse de forma segura.
9. Identifica el directorio de datos de desarrollo.
10. Comprueba que las rutas candidatas de pruebas no se solapan con desarrollo.
11. Revisa permisos de carpetas.
12. Revisa la configuración de Laravel, Vite y Cypress.

No detener servicios de desarrollo.

No ejecutar comandos que cambien información.

No mostrar credenciales o valores secretos.

## FASE 2 — DISEÑO FÍSICO DEL AISLAMIENTO

Define rutas concretas y verificadas para:

- Instancia MySQL exclusiva de pruebas.
- Directorio datadir exclusivo.
- Configuración MySQL exclusiva.
- Logs exclusivos de la instancia.
- Base exclusiva de pruebas.
- Archivo de configuración Laravel exclusivo.
- Sesiones y almacenamiento Laravel de pruebas.
- Caché y cola de pruebas.
- Servidor Laravel independiente.
- Servidor Vite independiente.

Utiliza los puertos propuestos solo después de comprobar que estén disponibles.

No reutilices el datadir ni el archivo de configuración de la instancia de desarrollo.

No copies datos reales o institucionales.

## FASE 3 — VERIFICACIÓN DE MYSQL

Diseña y verifica, sin crear todavía la instancia:

1. Ruta del ejecutable mysqld.
2. Versión del servidor.
3. Ubicación de la instancia de desarrollo.
4. Datadir candidato de pruebas.
5. Archivo de opciones candidato.
6. Puerto candidato.
7. Riesgos de servicio existente.
8. Cuenta administrativa local necesaria para configurar la instancia futura.
9. Procedimiento para crear una cuenta restringida a pruebas.
10. Comprobaciones que impedirán conexiones al servidor de desarrollo.

No ejecutar mysqld --initialize ni inicializar servicios.

No ejecutar CREATE DATABASE, CREATE USER, GRANT, DROP, TRUNCATE o ALTER.

No ejecutar migraciones.

Si las rutas se superponen o no puedes acreditarlas, detener la preparación y marcar BLOQUEADO.

## FASE 4 — CONFIGURACIÓN DE LARAVEL

Revisa la configuración requerida para ejecutar Laravel mediante PHP 8.4 portátil.

Propón una configuración exclusiva para pruebas que incluya:

- APP_ENV=testing.
- Conexión MySQL de pruebas.
- Host y puerto exclusivos.
- Nombre de base exclusivo.
- Usuario limitado a pruebas.
- Sesiones aisladas.
- Caché aislada.
- Colas sin efectos externos.
- Correo y notificaciones externas desactivados mediante drivers seguros.
- Almacenamiento de archivos exclusivo.
- Ausencia de datos institucionales.

No modificar backend/.env.

No modificar phpunit.xml en esta fase.

No crear valores secretos en archivos versionados.

No permitir que una configuración de desarrollo se utilice como alternativa silenciosa si falla la configuración de pruebas.

## FASE 5 — VITE, SANCTUM Y CYPRESS

Comprueba:

1. Proxy actual de Vite.
2. Cabeceras Origin y Referer.
3. Dependencias de localhost:5173.
4. Configuración de cookies y Sanctum.
5. Base URL de Cypress.
6. Contratos de sesiones.
7. Rutas y procesos que deben utilizar 8001 y 5174.
8. Pruebas que interceptan API.
9. Pruebas que necesitan backend real.

Diseña cómo evitar que las pruebas destinadas al entorno aislado terminen utilizando accidentalmente los servidores de desarrollo.

No cambiar todavía las pruebas existentes.

No realizar login contra cuentas institucionales.

## FASE 6 — PREPARACIÓN NO DESTRUCTIVA

Se permite crear únicamente carpetas nuevas y vacías para la infraestructura de pruebas, cuando su ubicación sea inequívoca y no se superponga con recursos de desarrollo.

También se permite generar plantillas de configuración sin credenciales reales, siempre que estén claramente separadas del entorno existente.

No sobrescribir archivos existentes.

No generar secretos reales dentro de Git.

No iniciar MySQL.

No iniciar migraciones.

No ejecutar Pest ni Cypress con backend real.

Si existen dudas de aislamiento, omitir la creación y documentar el bloqueo.

## FASE 7 — CHECKLIST DE SEGURIDAD

Construye una lista verificable de requisitos obligatorios antes de permitir escrituras:

- PHP correcto.
- MySQL correcto.
- Puerto exclusivo.
- Datadir exclusivo.
- Base exclusiva.
- Cuenta de pruebas.
- Privilegios limitados.
- Configuración efectiva verificada.
- Sesiones y almacenamiento aislados.
- Destino de migraciones seguro.
- Ausencia de conexiones a zarate_dev.
- Ausencia de datos institucionales.
- Cypress dirigido al entorno de pruebas.
- Criterios de parada y recuperación.

Distingue APROBADO, PENDIENTE y BLOQUEADO.

No declares aprobado ningún criterio basándote únicamente en un archivo de configuración propuesto.

## FASE 8 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-03-preparacion-entorno.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-preparacion.md

Documenta:

1. Herramientas verificadas.
2. Rutas reales.
3. Puertos inspeccionados.
4. Recursos exclusivos propuestos.
5. Archivos y carpetas preparados, si corresponde.
6. Comprobaciones aprobadas.
7. Comprobaciones pendientes.
8. Riesgos de aislamiento.
9. Bloqueadores.
10. Pasos concretos para iniciar una instancia aislada en una fase posterior.
11. Comandos ejecutados.
12. Archivos creados o modificados.

## RESTRICCIONES

- No modificar código funcional.
- No modificar bases existentes.
- No inicializar MySQL.
- No crear bases o usuarios.
- No ejecutar migraciones.
- No ejecutar seeders.
- No ejecutar pruebas que escriban.
- No instalar dependencias.
- No detener servicios existentes.
- No modificar archivos .env utilizados por desarrollo.
- No publicar secretos.
- No realizar commits, push, merge ni Pull Requests.
- No modificar los Bolts anteriores.

## RESULTADO ESPERADO

Entrega:

1. Estado de preparación del entorno.
2. Rutas y puertos verificados.
3. Recursos seguros preparados.
4. Checklist de aislamiento.
5. Bloqueadores pendientes.
6. Siguiente operación segura recomendada.

Clasifica el entorno como:

- PREPARADO PARA INICIALIZACIÓN AISLADA.
- REQUIERE AJUSTES.
- BLOQUEADO.

No afirmar que las pruebas reales están habilitadas todavía.