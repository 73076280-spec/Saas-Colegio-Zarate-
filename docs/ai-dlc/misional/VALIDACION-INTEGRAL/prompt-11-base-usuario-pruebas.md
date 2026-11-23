# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 11: Creación controlada de base y usuario MySQL de pruebas

Actúa como ingeniero senior DevOps, DBA de MySQL 8.4 y especialista en Laravel 13, Pest, Cypress y seguridad de entornos de integración.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Entorno local exclusivo: D:\zarate-saas\.tools\misional-isolated

Instancia aislada verificada: 127.0.0.1:3308

## ANTECEDENTES

El Prompt 10 verificó:

- MySQL 8.4.11.
- Contraseña administrativa actualizada.
- Nueva autenticación correcta.
- Usuario administrativo root@localhost.
- Datadir exclusivo del entorno de pruebas.
- Cierre limpio con código 0.
- Servicios y archivos de desarrollo intactos.

Todavía no existe una base académica de pruebas acreditada ni una cuenta exclusiva para Laravel.

## OBJETIVO

Crear exclusivamente en la instancia MySQL aislada:

1. Una base de datos vacía para pruebas integrales.
2. Una cuenta exclusiva para las pruebas.
3. Privilegios limitados al esquema de pruebas.

Verificar que la cuenta no tenga permisos sobre zarate_dev, otras bases de desarrollo ni recursos institucionales.

No ejecutar todavía migraciones o pruebas.

## FASE 1 — DOCUMENTACIÓN Y ESTADO

Leer íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-primer-arranque.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-identidad-sql.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cambio-clave.md

Comprobar la rama y los cambios locales.

No modificar la documentación de los Bolts anteriores.

## FASE 2 — PRECONDICIONES DE SEGURIDAD

Antes de cualquier instrucción SQL de escritura:

1. Verificar la ruta absoluta del ejecutable mysqld.
2. Verificar la versión MySQL 8.4.11.
3. Confirmar archivo de configuración exclusivo.
4. Confirmar datadir aislado.
5. Confirmar tmpdir, logs y PID exclusivos.
6. Confirmar las ACL privadas.
7. Confirmar ausencia de junctions y enlaces a desarrollo.
8. Confirmar que el puerto 3308 está libre antes del arranque.
9. Confirmar que MySQL X permanece desactivado.
10. Confirmar que no se utilizarán configuraciones ni credenciales de desarrollo.
11. Confirmar disponibilidad del mecanismo de detención segura.
12. Confirmar que las credenciales administrativas permanecen privadas.

Si un control falla, BLOQUEAR cualquier operación SQL.

## FASE 3 — ARRANQUE E IDENTIDAD

Iniciar únicamente MySQL aislado mediante el procedimiento verificado en los Prompts 08 a 10.

Antes de crear cualquier recurso:

1. Comprobar PID y ejecutable.
2. Confirmar interfaz 127.0.0.1 y puerto 3308.
3. Confirmar la conexión TCP explícita.
4. Consultar el puerto efectivo.
5. Consultar el datadir efectivo.
6. Consultar la versión.
7. Confirmar identidad de usuario y cuenta efectiva.
8. Confirmar que la instancia corresponde al entorno aislado.

No considerar el número de puerto como prueba suficiente.

Si identidad o datadir no coinciden, DETENER la operación sin escribir.

## FASE 4 — DISEÑO DE LA BASE Y CUENTA

Usar nombres inequívocamente exclusivos, por ejemplo:

- Base candidata: zarate_misional_test.
- Usuario candidato: misional_test.

Estos nombres son propuestas. Verificar primero que no existan recursos con dichos nombres.

No sobrescribir, reutilizar ni modificar una base o cuenta preexistente.

Si existe cualquiera de los recursos candidatos, documentar el bloqueo y no ejecutar modificaciones.

Elegir la codificación y colación compatibles con las migraciones Laravel existentes.

El usuario deberá estar restringido a conexiones locales apropiadas para 127.0.0.1.

Los privilegios concedidos deben limitarse estrictamente al esquema de pruebas.

Incluir únicamente los privilegios de esquema necesarios para ejecutar migraciones y pruebas durante una futura fase autorizada.

No conceder:

- SUPER.
- FILE.
- GRANT OPTION.
- Privilegios globales.
- Acceso a zarate_dev.
- Acceso a otras bases.
- Acceso a información institucional.

No crear cuentas administrativas adicionales.

## FASE 5 — GENERACIÓN Y PROTECCIÓN DE CREDENCIALES

Generar una contraseña exclusiva y fuerte para la cuenta de pruebas.

No utilizar credenciales administrativas de desarrollo.

No escribir contraseñas en:

- Documentos Markdown.
- Git.
- Comandos visibles con argumentos de contraseña.
- Salidas de consola.
- Capturas.
- Historial de PowerShell.
- Archivos temporales inseguros.

Utilizar un mecanismo local privado para las operaciones de creación.

Guardar cualquier recurso de autenticación solo en la infraestructura local ignorada por Git, con ACL restrictivas.

No compartir secretos en el reporte final.

Si la herramienta no puede garantizar esa protección, BLOQUEAR la fase.

## FASE 6 — OPERACIONES SQL AUTORIZADAS

Solamente después de verificar la identidad real de la instancia:

1. Crear una base nueva y vacía para pruebas.
2. Crear un usuario nuevo restringido a pruebas.
3. Conceder exclusivamente los privilegios mínimos sobre esa base.
4. Comprobar que la cuenta y los permisos quedaron correctamente registrados.

No utilizar comandos destructivos.

No ejecutar DROP, TRUNCATE, DELETE o cambios a datos preexistentes.

No ejecutar migraciones ni seeders.

No crear tablas académicas todavía.

No poblar registros.

No ejecutar pruebas Pest o Cypress.

Si una operación falla parcialmente, no realizar limpieza destructiva automática. Conservar evidencias y documentar el estado real.

## FASE 7 — VERIFICACIÓN CON LA CUENTA DE PRUEBAS

Verificar que:

1. La cuenta puede autenticarse en 127.0.0.1:3308.
2. La base seleccionada es exclusivamente la de pruebas.
3. La cuenta tiene los permisos necesarios sobre su esquema.
4. La cuenta no tiene privilegios globales innecesarios.
5. No hay privilegios sobre zarate_dev.
6. No hay privilegios sobre otras bases.
7. El esquema de pruebas continúa sin tablas académicas.
8. No existen conexiones a servicios de desarrollo.

Distinguir entre privilegios SQL observados y pruebas de denegación efectivamente ejecutadas.

No intentar escrituras de prueba sobre bases ajenas para demostrar que el acceso está denegado.

## FASE 8 — DETENCIÓN SEGURA

Finalizadas las verificaciones:

1. Detener solo la instancia aislada.
2. Registrar el resultado nativo de detención.
3. Confirmar ausencia del proceso.
4. Confirmar puerto 3308 libre.
5. Comprobar la integridad del datadir aislado.
6. Verificar la conservación del entorno de desarrollo.

## FASE 9 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente el prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-11-base-usuario-pruebas.md

Crear:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-base-usuario.md

Documentar:

- Verificaciones previas.
- Identidad del servidor.
- Base creada.
- Usuario creado.
- Privilegios concedidos, sin secretos.
- Pruebas de conexión.
- Verificaciones de aislamiento.
- Resultado de detención.
- Riesgos pendientes.
- Bloqueos, si existen.
- Próximo paso recomendado.

## RESTRICCIONES

No modificar backend ni frontend.

No modificar los archivos .env activos.

No conectar Laravel.

No ejecutar migraciones, seeders ni pruebas.

No eliminar datos ni recursos preexistentes.

No detener servicios de desarrollo.

No publicar secretos.

No modificar otros Bolts.

No hacer commits, push, merge ni Pull Requests.

La única escritura SQL autorizada es crear los recursos nuevos y exclusivos indicados y concederles sus permisos limitados.

## RESULTADO ESPERADO

Clasifica el resultado como:

- BASE Y CUENTA AISLADAS VERIFICADAS.
- CREACIÓN PARCIAL — BLOQUEADO.
- BLOQUEADO POR SEGURIDAD.

No declarar habilitadas las pruebas de integración hasta configurar y verificar Laravel y Cypress contra esta base aislada.