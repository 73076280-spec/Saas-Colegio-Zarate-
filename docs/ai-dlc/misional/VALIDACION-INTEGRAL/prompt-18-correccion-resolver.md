# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 18: Corrección del resolver Laravel y continuación segura de migraciones

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4, MySQL 8.4, Eloquent, migraciones, QA y seguridad de entornos aislados.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Entorno aislado: .tools/misional-isolated

MySQL: 127.0.0.1:3308

Base: zarate_test

Usuario: zarate_test

## ESTADO EXACTO DEL PROMPT 17

El Prompt 17 finalizó con:

FALLO DE MIGRACIÓN — ESQUEMA CONSERVADO.

Resultados:

- Se creó únicamente la tabla migrations.
- Cero de las 14 migraciones fueron aplicadas.
- Laravel recibió null como nombre lógico de conexión.
- El resolver no pudo identificar correctamente la conexión mysql del adaptador.
- PHP terminó con código 21.
- MySQL cerró limpiamente con código 0.
- Se aprobaron 16 controles de política.
- No se realizaron limpiezas ni reintentos.
- Desarrollo permaneció intacto.

El esquema parcial debe conservarse.

## OBJETIVO

Corregir de forma mínima el nombre lógico de la conexión y su integración con el resolver de Laravel.

Después de verificar la corrección, continuar exclusivamente las migraciones pendientes sobre zarate_test, siempre que todas las condiciones de seguridad permanezcan acreditadas.

NO reiniciar el entorno ni reconstruir la base.

## FASE 1 — RECUPERAR LAS EVIDENCIAS

Leer íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-guardas-identidad-sql.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ejecutor-migraciones.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-migracion-controlada.md

Inspeccionar especialmente:

- Los adaptadores locales de Laravel.
- El ejecutor del Prompt 17.
- La reproducción de la causa raíz.
- El registro de conexión en Laravel.
- El repositorio de migraciones.
- El resolver de conexiones.

No volver a implementar lo que ya funciona.

## FASE 2 — CORRECCIÓN MÍNIMA

Identificar por qué Laravel recibe null en lugar del nombre lógico mysql.

Comprobar la inicialización, el registro y la selección de la conexión dentro de Laravel.

Corregir únicamente el adaptador local en .tools/misional-isolated.

Requisitos:

1. La conexión debe conservar el nombre lógico mysql.
2. El repositorio de migraciones y el migrador deben utilizar esa conexión.
3. El PDO debe seguir siendo el mismo objeto previamente acreditado.
4. Debe conservarse TLS estricto.
5. La configuración no debe permitir conexiones alternativas.
6. No debe existir fallback hacia desarrollo.
7. No se deben modificar archivos del backend funcional.
8. No se deben modificar las 14 migraciones.

Evitar parches artificiales que oculten el problema.

## FASE 3 — COMPROBACIÓN DEL ESQUEMA PARCIAL

Antes de cualquier escritura:

1. Iniciar exclusivamente MySQL aislado.
2. Verificar PID, ejecutable, puerto y datadir.
3. Verificar TLS e identidad SQL mediante la conexión efectiva.
4. Confirmar usuario zarate_test.
5. Confirmar base zarate_test.
6. Comprobar que existe la tabla migrations.
7. Verificar su estructura y su contenido mediante consultas de lectura.
8. Confirmar que no se han aplicado las 14 migraciones.
9. Comprobar si existen otras tablas inesperadas.
10. Confirmar que no existen datos institucionales.

Si el esquema difiere de las evidencias anteriores, detenerse.

No eliminar ni recrear la tabla migrations.

## FASE 4 — VERIFICAR LA CORRECCIÓN SIN ESCRITURAS

Antes de continuar:

- Comprobar sintaxis del adaptador.
- Verificar que Laravel resuelve mysql correctamente.
- Verificar que el repositorio de migraciones utiliza el mismo PDO.
- Verificar el contexto APP_ENV=testing.
- Verificar que el comando apunta únicamente a zarate_test.
- Revalidar las guardas de identidad, privilegios y almacenamiento.
- Comprobar que las migraciones restantes son seguras para este esquema.
- Rechazar cualquier alteración posterior de la conexión.

No ejecutar escrituras si falla alguna comprobación.

## FASE 5 — CONTINUACIÓN CONTROLADA

Esta fase autoriza exclusivamente continuar la migración convencional pendiente, sin comandos destructivos, si todas las verificaciones anteriores son satisfactorias.

Condiciones:

1. Usar el ejecutor aislado corregido.
2. Utilizar la misma conexión PDO validada.
3. Conservar la tabla migrations existente.
4. Ejecutar solo las migraciones pendientes sobre zarate_test.
5. No ejecutar migrate:fresh.
6. No ejecutar migrate:reset.
7. No ejecutar migrate:rollback.
8. No ejecutar db:wipe.
9. No ejecutar db:seed.
10. No ejecutar comandos de limpieza ni reconstrucción.
11. No crear ni modificar bases distintas de zarate_test.
12. No utilizar credenciales administrativas.

Si una migración falla, detener inmediatamente la ejecución, conservar el estado parcial y documentar el error exacto.

No repetir automáticamente el comando ante un fallo.

## FASE 6 — VERIFICACIÓN POSTERIOR

Si las migraciones terminan:

1. Comprobar el código de salida nativo.
2. Revisar la tabla migrations.
3. Confirmar cuántas de las 14 migraciones quedaron aplicadas.
4. Contabilizar las tablas creadas.
5. Revisar restricciones y claves foráneas.
6. Comprobar que no se insertaron datos académicos reales.
7. Confirmar que las operaciones afectaron exclusivamente a zarate_test.
8. Verificar que zarate_dev no fue modificado.
9. Detener MySQL de forma controlada.
10. Confirmar puerto 3308 libre.

Si el resultado es parcial, no clasificarlo como éxito.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente el prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-18-correccion-resolver.md

Crear:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-resolver.md

Incluir:

- Causa exacta del fallo anterior.
- Archivos locales corregidos.
- Pruebas de la corrección.
- Estado inicial del esquema.
- Controles de seguridad aprobados.
- Comando de migración utilizado, sin secretos.
- Código de salida.
- Migraciones aplicadas.
- Tablas creadas.
- Fallos o bloqueos.
- Estado final del esquema.
- Verificación de desarrollo.
- Riesgos pendientes.
- Próxima fase recomendada.

No modificar las evidencias de los Prompts 01–17.

## RESTRICCIONES

- No modificar zarate_dev.
- No reinicializar MySQL.
- No borrar ni reconstruir el esquema de pruebas.
- No ejecutar comandos de limpieza.
- No ejecutar seeders.
- No ejecutar Pest ni Cypress todavía.
- No modificar código funcional.
- No modificar archivos .env activos.
- No cambiar privilegios ni contraseñas.
- No publicar secretos.
- No modificar otros Bolts.
- No hacer commits, push, merge ni Pull Requests.

## RESULTADO ESPERADO

Clasificar como:

- MIGRACIONES COMPLETADAS Y VERIFICADAS.
- MIGRACIÓN PARCIAL — ESQUEMA CONSERVADO.
- CORRECCIÓN VERIFICADA — EJECUCIÓN BLOQUEADA.
- BLOQUEADO POR SEGURIDAD.

Reportar exactamente cuántas de las 14 migraciones se aplicaron, cuántas tablas existen y si MySQL terminó correctamente.

No declarar completada la validación integral ni aprobadas las pruebas funcionales.