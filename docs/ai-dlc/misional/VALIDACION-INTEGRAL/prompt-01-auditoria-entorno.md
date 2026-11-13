# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 01: Auditoría del entorno Laravel, React y MySQL

Actúa como ingeniero senior de QA, DevOps y seguridad, especializado en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress y plataformas SaaS educativas.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Rama de referencia: feature/macro-misional

Etapa: Validación integral del macroproceso misional.

Los Bolts BOLT-MIS-002 al BOLT-MIS-006 ya fueron integrados.

## OBJETIVO

Auditar el entorno actual de desarrollo y pruebas para determinar cómo ejecutar las pruebas reales con Laravel, React y MySQL sin afectar la base de desarrollo ni información institucional.

Esta fase es exclusivamente de diagnóstico.

NO configurar ni modificar todavía bases de datos.

## FASE 1 — ENTORNO LOCAL

Revisa:

1. Rama activa y estado Git.
2. Versiones instaladas de PHP, Composer, Node y npm.
3. Disponibilidad de PHP portátil.
4. Disponibilidad de MySQL portátil.
5. Dependencias locales del frontend y backend.
6. Configuración de Laravel.
7. Configuración de Vite.
8. Configuración de Cypress.
9. Configuración de Pest.
10. Posibles conflictos de puertos.

No instalar dependencias.

No iniciar servicios si hacerlo puede cambiar datos.

## FASE 2 — CONFIGURACIÓN DE BASES DE DATOS

Inspecciona, sin modificar:

- Configuración de conexión de Laravel.
- Configuración de pruebas Pest.
- phpunit.xml.
- Archivos .env.example y equivalentes.
- Configuración existente de MySQL.
- Migraciones.
- Seeders y factories.
- Uso de RefreshDatabase o mecanismos equivalentes.

IMPORTANTE:

La base zarate_dev y cualquier base institucional deben considerarse protegidas.

No ejecutar:

- migrate:fresh
- migrate:refresh
- db:wipe
- db:seed
- migrate
- Comandos SQL de escritura
- Pruebas que limpien tablas

Hasta demostrar aislamiento efectivo.

No modificar .env ni revelar contraseñas, tokens o credenciales en el informe.

Si encuentras secretos, registra únicamente su existencia y ubicación general, nunca sus valores.

## FASE 3 — PRUEBAS EXISTENTES

Localiza las pruebas relacionadas con:

- Autenticación y autorización.
- Matrículas.
- Enseñanza-aprendizaje.
- Evaluación académica.
- Asistencia y seguimiento.
- Comunicación institucional.

Clasifícalas:

1. Unitarias.
2. Integración.
3. Funcionales.
4. E2E con backend real.
5. E2E con API simulada.

Identifica qué pruebas requieren base de datos y qué operaciones de escritura podrían ejecutar.

No declares aprobadas pruebas que no se ejecutaron en esta fase.

## FASE 4 — ESTRATEGIA DE AISLAMIENTO

Propón una estrategia segura para preparar una base de datos exclusiva para pruebas.

Evalúa la opción más adecuada para la infraestructura existente.

El entorno debe garantizar:

- Nombre y conexión diferentes de zarate_dev.
- Ausencia de datos institucionales.
- Configuración exclusiva de pruebas.
- Prohibición de apuntar accidentalmente a desarrollo o producción.
- Verificación explícita antes de cualquier migración.
- Posibilidad de limpiar únicamente datos de pruebas.
- Repetibilidad.
- Compatibilidad con Laravel y Cypress.

No crees todavía bases ni usuarios.

## FASE 5 — PRUEBAS DE INTEGRACIÓN

Propón el orden de ejecución más seguro:

1. Health check del backend.
2. Conexión controlada a base de pruebas.
3. Autenticación.
4. Permisos y roles.
5. Matrículas.
6. Enseñanza-aprendizaje.
7. Calificaciones.
8. Asistencia.
9. Justificaciones.
10. Comunicaciones y notificaciones.

Para cada proceso identifica las pruebas existentes y las condiciones previas necesarias.

Diferencia las verificaciones que pueden hacerse sin escrituras de aquellas que requieren datos de prueba.

## FASE 6 — LIMITACIONES PENDIENTES

Revisa los documentos cierre-bolt.md de BOLT-MIS-002 a BOLT-MIS-006, cuando existan.

Consolida:

- Pruebas pendientes.
- Problemas confirmados.
- Riesgos residuales.
- Limitaciones de navegación SPA.
- Dependencias institucionales.
- Necesidades de validación con backend real.

No consideres resuelto un problema solamente porque su Bolt fue fusionado.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-01-auditoria-entorno.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/diagnostico-entorno.md

El diagnóstico debe contener:

1. Inventario de herramientas.
2. Estado de Laravel.
3. Estado de React/Vite.
4. Estado de MySQL.
5. Configuración de pruebas existente.
6. Riesgos de bases de datos.
7. Pruebas identificadas.
8. Recomendación de aislamiento.
9. Orden seguro de validación.
10. Bloqueadores.
11. Próximas acciones concretas.

## RESTRICCIONES

- No modificar frontend ni backend.
- No crear ni modificar bases de datos.
- No ejecutar migraciones.
- No ejecutar seeders.
- No iniciar pruebas con escritura de datos.
- No alterar .env.
- No instalar dependencias.
- No cambiar permisos ni roles.
- No publicar secretos.
- No modificar Bolts anteriores.
- No realizar commits, push, merge ni Pull Requests.
- No inventar pruebas ni resultados.

Únicamente se permite crear los dos documentos indicados.

## RESULTADO ESPERADO

Entrega una evaluación del entorno indicando:

- Qué herramientas y servicios están disponibles.
- Qué impide actualmente ejecutar Pest y Cypress reales.
- Cómo aislar una base de pruebas.
- Qué verificaciones se necesitan antes de cualquier operación de escritura.
- Qué pruebas ejecutar primero.
- Qué riesgos permanecen.

Clasifica el entorno como:

- APTO PARA PREPARAR PRUEBAS.
- REQUIERE CONFIGURACIÓN.
- BLOQUEADO.

No ejecutar todavía las pruebas de integración.