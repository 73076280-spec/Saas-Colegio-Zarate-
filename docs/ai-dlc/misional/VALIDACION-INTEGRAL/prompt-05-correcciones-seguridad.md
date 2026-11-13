# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 05: Corrección controlada de seguridad y guardas del entorno aislado

Actúa como ingeniero senior DevOps, QA y administrador de MySQL 8.4, especializado en Windows PowerShell, Laravel 13, PHP 8.4, Pest y Cypress.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Directorio local exclusivo: D:\zarate-saas\.tools\misional-isolated

Etapa: VALIDACION-INTEGRAL.

## RESULTADO ANTERIOR

El Prompt 04 confirmó:

- Separación de rutas de desarrollo y pruebas.
- Ausencia de enlaces físicos o rutas superpuestas.
- Datadir aislado vacío.
- ACL demasiado amplias.
- Falta de tmpdir exclusivo.
- Falta de desactivación explícita de MySQL X.
- Ausencia de guardas de configuración e identidad.

Estado actual: REQUIERE AJUSTES.

La inicialización de MySQL y las escrituras de datos siguen BLOQUEADAS.

## DOCUMENTACIÓN OBLIGATORIA

Lee:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/diagnostico-entorno.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-preparacion.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/verificacion-seguridad.md

Respeta las rutas, riesgos y medidas de seguridad documentadas.

## OBJETIVO

Resolver de forma controlada los problemas de configuración del entorno aislado para preparar su futura inicialización.

Esta fase permite modificaciones limitadas de plantillas locales y la creación de guardas de seguridad, pero NO permite inicializar bases de datos.

## FASE 1 — COMPROBACIÓN PREVIA

1. Confirma la rama test/integracion-misional.
2. Ejecuta git status.
3. Comprueba las rutas absolutas y canónicas.
4. Confirma que el datadir sigue vacío.
5. Identifica las plantillas preparadas.
6. Comprueba que no haya procesos MySQL asociados al directorio aislado.
7. Revisa los permisos NTFS actuales.
8. Identifica al usuario actual, SYSTEM y Administrators sin publicar información privada innecesaria.
9. Verifica que los ejecutables MySQL y PHP sean los previstos.
10. Comprueba si las plantillas contienen secretos.

No continuar ante rutas ambiguas o datos inesperados.

## FASE 2 — CONFIGURACIÓN MYSQL

Ajusta únicamente las plantillas de MySQL aislado dentro de .tools/misional-isolated.

Configura, según las opciones realmente admitidas por la versión instalada:

- Puerto exclusivo candidato 3308.
- Bind-address local.
- Datadir exclusivo.
- tmpdir exclusivo dentro del entorno aislado.
- Logs exclusivos.
- Archivos temporales y PID independientes cuando corresponda.
- Desactivación explícita de MySQL X Plugin.
- Archivo de opciones exclusivo.
- Ausencia de referencias al datadir de desarrollo.

Comprueba las opciones mediante métodos seguros de validación de configuración, sin iniciar mysqld.

Si una opción no está disponible o resulta incompatible, documenta el bloqueo.

No incluir contraseñas en las plantillas.

No inicializar MySQL.

## FASE 3 — GUARDAS DE SEGURIDAD

Crea scripts PowerShell de verificación previa, exclusivamente dentro de .tools/misional-isolated.

Los scripts deben:

1. Comprobar las rutas absolutas y canónicas.
2. Detectar enlaces, junctions y superposición de directorios.
3. Verificar el archivo de opciones MySQL.
4. Verificar el puerto esperado.
5. Verificar datadir y tmpdir exclusivos.
6. Confirmar que el datadir sigue vacío antes de su futura inicialización.
7. Verificar la ausencia de procesos que utilicen esas rutas.
8. Detectar puertos ocupados por otros procesos.
9. Verificar los permisos NTFS necesarios.
10. Verificar que los archivos no incluyan rutas de desarrollo como destino.
11. Revisar la configuración propuesta de Laravel.
12. Impedir aceptar APP_ENV distinto de testing.
13. Rechazar zarate_dev como base de pruebas.
14. Rechazar destinos ambiguos o variables obligatorias faltantes.
15. Verificar que Vite y Cypress apunten exclusivamente al entorno aislado.
16. Devolver un resultado explícito APROBADO o BLOQUEADO para cada control.
17. Finalizar con error si existe cualquier condición insegura.

No confiar únicamente en coincidencias de cadenas: validar las rutas efectivas y configuraciones disponibles.

Las guardas deben FALLAR DE FORMA SEGURA cuando no puedan demostrar el aislamiento.

No crear scripts que ejecuten automáticamente migraciones, inicialización, borrados, seeders o SQL.

## FASE 4 — ACL PRIVADAS

Revisa las ACL de las carpetas nuevas de .tools/misional-isolated.

Determina una política mínima que permita el funcionamiento futuro de MySQL y Laravel sin conceder permisos amplios a Usuarios o Usuarios autenticados.

Antes de cualquier modificación:

1. Identifica exactamente las carpetas afectadas.
2. Comprueba que no existan junctions o enlaces hacia desarrollo.
3. Guarda una copia local de las ACL originales fuera de Git.
4. Identifica un procedimiento de reversión.
5. Conserva el acceso necesario de la cuenta actual, SYSTEM y administradores.
6. Comprueba que los cambios no afectarán carpetas superiores ni archivos del proyecto.

Puedes aplicar ajustes de ACL únicamente a directorios exclusivos del entorno aislado y sus contenidos, si están plenamente identificados.

No modificar permisos de D:\zarate-saas, .tools general, backend, frontend ni directorios compartidos.

No modificar propietarios de carpetas de desarrollo.

Si no puedes garantizar la conservación del acceso o una reversión segura, NO modifiques las ACL; documenta el bloqueo.

## FASE 5 — LARAVEL Y CYPRESS

Revisa y ajusta únicamente las plantillas no activas del entorno aislado.

Comprueba:

- APP_ENV=testing.
- Base de datos exclusiva.
- Puerto y host explícitos.
- Sesiones aisladas.
- Caché aislada.
- Cola sin efectos externos.
- Correo sin envíos externos.
- Almacenamiento exclusivo.
- Host y puerto del backend de pruebas.
- Host y puerto de Vite de pruebas.
- Origin/Referer compatibles con el entorno aislado.
- Ausencia de fallback hacia desarrollo.

No modificar backend/.env ni activar las plantillas.

No crear credenciales reales.

No modificar todavía las pruebas Cypress existentes.

## FASE 6 — VERIFICACIÓN

Ejecuta las guardas mediante operaciones de solo lectura.

Comprueba:

1. Configuraciones corregidas.
2. ACL efectivas.
3. Compatibilidad de opciones MySQL.
4. Rutas seguras.
5. Ausencia de referencias peligrosas.
6. Datadir vacío.
7. Puertos candidatos.
8. Entorno Laravel propuesto.
9. Aislamiento de Cypress.
10. Ausencia de secretos versionados.

Distingue los controles verificables offline de los que requieren una instancia inicializada.

No marques como aprobados los controles que todavía requieran conexión real a MySQL.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-05-correcciones-seguridad.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md

Documenta:

1. Estado inicial.
2. Problemas corregidos.
3. Archivos locales modificados.
4. Scripts de verificación creados.
5. Resultados de las guardas.
6. ACL anteriores y posteriores, sin divulgar información sensible.
7. Configuración MySQL.
8. Configuración Laravel/Cypress.
9. Controles aprobados.
10. Controles pendientes.
11. Riesgos residuales.
12. Procedimiento de reversión.
13. Recomendación para la siguiente fase.

No incluir secretos ni credenciales.

## RESTRICCIONES

- No inicializar MySQL.
- No iniciar el servidor de pruebas.
- No crear bases de datos ni usuarios SQL.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest o Cypress con backend real.
- No instalar dependencias.
- No modificar código funcional del SaaS.
- No modificar datos de desarrollo.
- No detener servicios existentes.
- No modificar otros Bolts.
- No modificar archivos .env activos.
- No publicar plantillas o scripts locales.
- No realizar commits, push, merge ni Pull Requests.

## RESULTADO ESPERADO

Entrega:

- Archivos modificados.
- Controles de seguridad implementados.
- Resultado de las comprobaciones offline.
- Riesgos pendientes.
- Estado final: APTO PARA INICIALIZACIÓN CONTROLADA, REQUIERE AJUSTES o BLOQUEADO.

No declarar habilitadas las pruebas reales sin verificar el destino efectivo de MySQL, la cuenta, los permisos y la configuración de Laravel.