# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 10: Cambio controlado de contraseña temporal de MySQL aislado

Actúa como administrador senior de MySQL 8.4, ingeniero DevOps y especialista en seguridad de entornos de pruebas Laravel.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Entorno exclusivo: D:\zarate-saas\.tools\misional-isolated

Instancia autorizada: 127.0.0.1:3308.

## ANTECEDENTES

El Prompt 09 consiguió establecer comunicación con MySQL aislado, pero recibió:

ERROR 1862 (HY000): Your password has expired.

No se ejecutaron consultas SQL ni se modificaron privilegios.

El servidor se detuvo correctamente y los datos de desarrollo permanecieron intactos.

## OBJETIVO

Sustituir de manera segura la contraseña temporal expirada de la cuenta administrativa de la instancia MySQL aislada, verificando previamente la identidad del proceso y conservando las protecciones existentes.

Esta autorización se limita exclusivamente al cambio de contraseña de la cuenta autenticada en la instancia aislada.

NO crear bases, usuarios ni ejecutar migraciones.

## FASE 1 — VERIFICACIONES PREVIAS

Lee íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-inicializacion.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-primer-arranque.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-identidad-sql.md

Comprueba:

1. Rama Git correcta.
2. Estado del repositorio.
3. Ejecutable MySQL verificado.
4. Datadir exclusivo.
5. Puerto 3308 libre antes del arranque.
6. Archivo de configuración aislado.
7. ACL privadas.
8. Ausencia de procesos que utilicen el datadir.
9. MySQL X desactivado.
10. Bind-address local.
11. Ausencia de redirección a desarrollo.
12. Disponibilidad del procedimiento de cierre seguro.

Si una comprobación falla, detener la operación.

## FASE 2 — ARRANQUE AISLADO

Inicia únicamente la instancia de pruebas mediante el procedimiento acreditado en el Prompt 08.

Comprueba que:

- El proceso corresponde al ejecutable esperado.
- El PID es el esperado.
- Escucha en 127.0.0.1:3308.
- Usa el datadir aislado.
- No afecta los servicios de desarrollo.

No conectarse al servidor de desarrollo.

## FASE 3 — CAMBIO DE CONTRASEÑA

Utiliza el mecanismo oficial de MySQL 8.4 para resolver una contraseña temporal expirada.

Antes de ejecutar la modificación:

1. Verifica el destino mediante PID, puerto, configuración y datadir.
2. Comprueba que el cliente utilizará exclusivamente TCP hacia 127.0.0.1:3308.
3. Utiliza la contraseña temporal almacenada de forma privada.
4. Obtén una contraseña administrativa nueva, fuerte y diferente.
5. Si hace falta intervención humana, solicita únicamente su introducción en un mecanismo local y privado, nunca en el chat ni en documentación.
6. Evita transmitir contraseñas como argumentos de línea de comandos.
7. Evita imprimir secretos en consola, logs, trazas, excepciones o capturas.
8. No activar el registro de consultas sensibles.
9. No conservar sentencias SQL con contraseñas en archivos versionados.
10. No almacenar secretos en scripts permanentes.

Ejecuta únicamente la operación de cambio de contraseña de la cuenta administrativa autenticada.

No utilizar mecanismos como skip-grant-tables, initialize-insecure o restablecimientos forzados.

Si la operación requiere exponer la contraseña en un historial, log o herramienta sin garantías de privacidad, detente y documenta el bloqueo.

No generar ni revelar contraseñas dentro del reporte.

## FASE 4 — VERIFICACIÓN POSTERIOR

Después de cambiar la contraseña:

1. Comprueba que el servidor confirmó la modificación.
2. Verifica la autenticación con la contraseña nueva.
3. Comprueba que la cuenta ya no está bloqueada por expiración.
4. Ejecuta únicamente consultas de lectura necesarias para verificar versión, puerto, datadir y usuario efectivo.
5. Verifica que el destino corresponde a la instancia aislada.
6. Comprueba que no existe conexión a zarate_dev.
7. Documenta los privilegios efectivos mediante información saneada.

No realizar otras modificaciones SQL.

Si el cambio de contraseña se confirma pero alguna verificación falla, conserva la evidencia y no intentes restablecimientos automáticos.

## FASE 5 — DETENCIÓN SEGURA

Detén exclusivamente el proceso MySQL aislado mediante el mecanismo controlado ya verificado.

Comprueba:

- PID finalizado.
- Puerto 3308 liberado.
- Datadir íntegro.
- Archivos de desarrollo intactos.
- Ausencia de procesos residuales.

No detener servicios de desarrollo.

## FASE 6 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-10-cambio-clave-mysql.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cambio-clave.md

Documenta:

1. Verificaciones previas.
2. Identidad de la instancia.
3. Resultado del cambio de contraseña.
4. Resultado de autenticación posterior.
5. Versión y puerto verificados.
6. Privilegios comprobados.
7. Resultado de detención.
8. Riesgos residuales.
9. Próximo paso recomendado.

No incluir contraseñas, hashes sensibles, tokens ni material de autenticación.

## RESTRICCIONES

- No reinicializar MySQL.
- No modificar zarate_dev.
- No modificar contraseñas de desarrollo.
- No crear bases ni usuarios.
- No ejecutar GRANT o REVOKE.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest ni Cypress reales.
- No modificar frontend/backend.
- No instalar dependencias.
- No alterar otros Bolts.
- No realizar commits, push, merge ni PR.
- No publicar secretos ni archivos locales de .tools.

## RESULTADO ESPERADO

Clasifica el resultado como:

- CONTRASEÑA ACTUALIZADA E IDENTIDAD VERIFICADA.
- CONTRASEÑA ACTUALIZADA CON VERIFICACIONES PENDIENTES.
- BLOQUEADO POR SEGURIDAD.

No declarar habilitadas las pruebas reales hasta crear una cuenta y una base exclusivamente de pruebas con privilegios limitados.