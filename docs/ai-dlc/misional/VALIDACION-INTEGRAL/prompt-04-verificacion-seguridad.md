# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 04: Verificación offline de aislamiento, ACL y guardas de seguridad

Actúa como ingeniero senior DevOps, QA y administrador de MySQL especializado en Windows PowerShell, Laravel 13, PHP 8.4, Pest y Cypress.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Directorio preparado: .tools/misional-isolated

Etapa: VALIDACION-INTEGRAL.

## ANTECEDENTES

El Prompt 03 preparó:

- 31 carpetas aisladas.
- 6 plantillas de configuración sin activar.
- Un directorio de datos MySQL vacío.
- Puertos candidatos 3308, 8001 y 5174.

Estado anterior: REQUIERE AJUSTES.

Las escrituras de base de datos siguen BLOQUEADAS.

## DOCUMENTACIÓN OBLIGATORIA

Lee completamente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/diagnostico-entorno.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-aislamiento.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-preparacion.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-03-preparacion-entorno.md

Inspecciona las seis plantillas locales y los recursos preparados en .tools/misional-isolated.

No actives todavía las plantillas.

## OBJETIVO

Verificar de manera offline que el entorno aislado está correctamente diseñado y que la futura inicialización de MySQL no podrá modificar la instancia, archivos o datos del entorno de desarrollo.

Esta fase NO autoriza inicialización, creación de bases de datos, migraciones ni pruebas con escritura.

## FASE 1 — ESTADO DEL REPOSITORIO

1. Confirma la rama test/integracion-misional.
2. Revisa git status y los cambios locales.
3. Comprueba que los documentos anteriores estén conservados.
4. Identifica archivos versionados, ignorados y no versionados dentro de .tools/misional-isolated.
5. No prepares ni publiques archivos que contengan secretos.
6. No cambies archivos de los Bolts anteriores.

## FASE 2 — VERIFICACIÓN DE RUTAS

Inspecciona las rutas reales y normalizadas de:

- MySQL de desarrollo.
- MySQL aislado propuesto.
- Datadir.
- Archivos de opciones.
- Logs.
- Archivos temporales.
- Carpetas de sesiones y almacenamiento Laravel.
- Directorios de caché.
- Ejecutables PHP y MySQL.

Comprueba que no exista solapamiento físico, ni mediante enlaces simbólicos, junctions o rutas equivalentes.

Verifica que el datadir aislado continúe vacío.

No modificar ni borrar recursos existentes.

Si una ruta no puede acreditarse, documenta BLOQUEADO.

## FASE 3 — ACL Y PRIVACIDAD

Inspecciona los permisos NTFS de las carpetas aisladas mediante comandos de solo lectura.

Determina:

1. Qué usuarios pueden leerlas.
2. Qué usuarios pueden escribirlas.
3. Qué permisos se heredan.
4. Si existen permisos excesivamente amplios.
5. Si las carpetas destinadas a secretos y datos pueden quedar restringidas a la cuenta local de pruebas.
6. Si cambiar ACL podría afectar carpetas compartidas o de desarrollo.

Propón los comandos específicos de PowerShell o icacls necesarios para corregir permisos, pero NO los ejecutes todavía.

No cambiar propietarios ni permisos de carpetas existentes.

No modificar permisos de D:\zarate-saas completo.

## FASE 4 — CONFIGURACIÓN MYSQL

Inspecciona las plantillas y la versión real del servidor.

Comprueba:

- Port=3308 como candidato.
- Bind-address exclusivamente local.
- Datadir exclusivo.
- Logs y archivos temporales exclusivos.
- Socket o named pipe independiente, si corresponde.
- Archivo PID exclusivo, si corresponde.
- Configuración de MySQL X Plugin y su puerto.
- Riesgo de conexiones a instancias existentes.
- Comportamiento del servidor si falta algún parámetro.
- Posibles rutas por defecto que deban impedirse.

Propón parámetros compatibles con la versión de MySQL instalada.

No asumas que los parámetros de otra versión son válidos.

No iniciar mysqld.

No ejecutar mysqld --initialize.

No ejecutar SQL.

## FASE 5 — GUARDAS DE CONFIGURACIÓN

Diseña un mecanismo explícito de verificación previa que falle de forma segura si:

1. El directorio aislado no es el esperado.
2. El datadir coincide con desarrollo.
3. El puerto difiere del autorizado.
4. El destino de base de datos es zarate_dev.
5. APP_ENV no es testing.
6. Faltan variables obligatorias.
7. El usuario o institución no corresponde al entorno de pruebas.
8. Laravel utiliza una configuración distinta de la propuesta.
9. Las sesiones o el almacenamiento apuntan a desarrollo.
10. Cypress utiliza un backend distinto del aislado.
11. Los puertos necesarios están ocupados.
12. La configuración permite efectos externos no autorizados.

No confíes solo en nombres de variables; define cómo comprobar el destino efectivo antes de cualquier escritura.

No crear scripts que ejecuten migraciones, borrados o cambios de datos automáticamente.

Si es seguro crear un script de diagnóstico de solo lectura, mantenlo sin capacidad de escritura y documenta su comportamiento.

## FASE 6 — SEGURIDAD DE LARAVEL

Revisa las plantillas Laravel de pruebas.

Comprueba que:

- El entorno sea testing.
- Se utilice una conexión explícita.
- No exista un fallback silencioso hacia desarrollo.
- Sesiones, caché y colas estén aisladas.
- El almacenamiento sea exclusivo.
- El envío externo de correos esté deshabilitado.
- No se utilicen cuentas institucionales.
- No se versionen secretos.
- No se reutilice la configuración de zarate_dev.

No modificar backend/.env.

## FASE 7 — CYPRESS Y SANCTUM

Revisa:

- URL de Laravel en pruebas.
- URL de Vite en pruebas.
- Origin y Referer de los tests.
- Cookies y sesión.
- Configuración de Sanctum.
- Posibles referencias fijas a los puertos 5173 y 8000.
- Protección frente a peticiones enviadas al entorno de desarrollo.

Propón los cambios mínimos necesarios para una fase futura.

No modificar todavía las pruebas existentes ni ejecutarlas contra backend real.

## FASE 8 — CHECKLIST Y DECISIÓN

Elabora una tabla con:

- Control.
- Evidencia.
- Resultado: APROBADO, PENDIENTE o BLOQUEADO.
- Riesgo.
- Acción correctiva.
- Verificación posterior.

Distingue controles verificados mediante lectura de archivos de controles que solo podrán verificarse cuando se cree la instancia aislada.

No aprobar anticipadamente los controles posteriores a la inicialización.

## FASE 9 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-04-verificacion-seguridad.md

Crea:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/verificacion-seguridad.md

Incluye:

1. Estado Git.
2. Rutas verificadas.
3. ACL actuales.
4. Riesgos de permisos.
5. Configuración MySQL analizada.
6. Compatibilidad de MySQL X Plugin.
7. Validaciones Laravel.
8. Validaciones Vite/Cypress.
9. Guardas necesarias.
10. Criterios de detención.
11. Comandos correctivos propuestos.
12. Controles pendientes.
13. Decisión sobre la siguiente fase.

No publicar contraseñas, tokens, claves ni credenciales.

## RESTRICCIONES

- No inicializar MySQL.
- No arrancar servicios de bases de datos.
- No crear bases ni usuarios.
- No modificar ACL.
- No modificar archivos .env.
- No ejecutar SQL.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest ni Cypress con backend real.
- No instalar dependencias.
- No detener servicios existentes.
- No modificar frontend ni backend.
- No modificar otros Bolts.
- No hacer commits, push, merge ni Pull Requests.

Solo crear los dos documentos AI-DLC indicados y, si se justifica, un script estrictamente de diagnóstico y solo lectura que no exponga secretos.

## RESULTADO ESPERADO

Entrega:

1. Rutas y permisos verificados.
2. Análisis de las plantillas y del servidor MySQL.
3. Riesgos detectados.
4. Guardas necesarias.
5. Comandos correctivos propuestos, sin ejecutarlos.
6. Estado final: APTO PARA CONFIGURACIÓN CONTROLADA, REQUIERE AJUSTES o BLOQUEADO.

No declarar las pruebas reales habilitadas.