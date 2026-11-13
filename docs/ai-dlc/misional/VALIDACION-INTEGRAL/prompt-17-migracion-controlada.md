# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 17: Primera migración controlada sobre MySQL aislado

Actúa como ingeniero senior de Laravel 13, MySQL 8.4, PHP 8.4, QA y DevOps.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: `D:\zarate-saas`

Rama obligatoria: `test/integracion-misional`

Infraestructura: `.tools/misional-isolated`

MySQL: `127.0.0.1:3308`

Base: `zarate_test`

Cuenta: `zarate_test`

## ESTADO ACREDITADO

El Prompt 16 terminó como:

EJECUTOR PREPARADO — PENDIENTE DE AUTORIZACIÓN DE MIGRACIÓN.

Resultados:

- 20 controles offline aprobados.
- 8 rechazos de seguridad comprobados.
- 14 migraciones inventariadas.
- 1 conexión y 19 lecturas SQL.
- 0 escrituras SQL.
- Repositorio y migrador Laravel utilizan el mismo PDO verificado.
- MySQL detenido con código 0.

Persisten requisitos de preparación de servicios, sesión, recuperación y autorización explícita de alcance.

## OBJETIVO

Completar los controles pendientes y, únicamente si todos resultan satisfactorios, ejecutar una primera migración Laravel convencional sobre la base de pruebas vacía `zarate_test`.

Esta autorización está limitada a la creación de esquema nuevo y sus metadatos de migración dentro de `zarate_test`.

No se autoriza limpiar, borrar, reinicializar ni modificar bases existentes.

## FASE 1 — RECUPERACIÓN

Leer íntegramente:

- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-base-usuario.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-tls.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-adaptadores-laravel-pest.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-guardas-identidad-sql.md`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-ejecutor-migraciones.md`

Inspeccionar el ejecutor y las guardas locales existentes.

Reutilizar el trabajo anterior; no crear otro entorno ni repetir auditorías innecesarias.

## FASE 2 — PRECONDICIONES OBLIGATORIAS

Antes de cualquier escritura:

1. Confirmar rama y estado Git.
2. Verificar PHP portátil correcto.
3. Confirmar MySQL aislado mediante PID, ejecutable, puerto y datadir.
4. Acreditar conexión Laravel real con TLS estricto.
5. Confirmar `APP_ENV=testing`.
6. Confirmar `DB_DATABASE=zarate_test`.
7. Confirmar usuario `zarate_test`.
8. Confirmar privilegios exclusivos del esquema.
9. Confirmar ausencia de conexión a `zarate_dev`.
10. Confirmar que la base de pruebas continúa vacía y que no contiene datos institucionales.
11. Comprobar almacenamiento, sesiones, cachés, colas y correo aislados.
12. Verificar que PHPUnit y variables heredadas no sobrescriben los destinos.
13. Verificar que el ejecutor usa exactamente la conexión previamente acreditada.
14. Confirmar que la operación puede detenerse ante cualquier discrepancia.

Si cualquiera falla, NO migrar.

## FASE 3 — REVISIÓN DE LAS 14 MIGRACIONES

Analizar las 14 migraciones inventariadas.

Verificar:

- Creación de tablas y claves.
- Orden correcto.
- Dependencias y claves foráneas.
- Operaciones destructivas.
- Conexiones explícitas a otras bases.
- SQL dinámico con destinos externos.
- Triggers, eventos o procedimientos con efectos fuera del esquema.
- Seeders automáticos.
- Posibles cambios sobre recursos preexistentes.

No asumir que toda migración Laravel es segura por utilizar el entorno testing.

Si una migración puede escribir fuera de `zarate_test`, detenerse y documentar.

No modificar migraciones para forzar una ejecución.

## FASE 4 — PREPARAR EJECUCIÓN CONTROLADA

Reutilizar el ejecutor local del Prompt 16.

Habilitar una ruta estrictamente limitada para migración convencional sobre la base aislada, únicamente durante esta ejecución.

No permitir comandos genéricos o arbitrarios.

Mantener bloqueados:

- `migrate:fresh`
- `migrate:reset`
- `migrate:rollback`
- `db:wipe`
- `db:seed`
- `DROP DATABASE`
- `TRUNCATE`
- Cualquier escritura fuera del esquema autorizado.

Si el ejecutor no garantiza conexión y alcance, no modificarlo para omitir las guardas: registrar BLOQUEADO.

Preparar una evidencia del esquema vacío y un plan de recuperación de una migración parcial. No borrar automáticamente un esquema parcialmente migrado.

## FASE 5 — MIGRACIÓN AUTORIZADA

Solo cuando todas las comprobaciones previas estén aprobadas:

1. Iniciar exclusivamente MySQL aislado.
2. Acreditar su identidad real.
3. Cargar el perfil Laravel de pruebas.
4. Ejecutar las guardas dentro del mismo contexto de migración.
5. Ejecutar una única operación de migración convencional, equivalente a `artisan migrate`, exclusivamente en `zarate_test`.
6. Registrar código de salida nativo y resultado real.
7. Verificar qué migraciones se aplicaron.
8. Consultar las tablas generadas.
9. Revisar restricciones y claves foráneas.
10. Confirmar ausencia de escrituras fuera del esquema.

No ejecutar seeders ni importar datos reales.

Si falla una migración, detenerse y conservar el esquema parcial para diagnóstico. No aplicar limpiezas automáticas.

## FASE 6 — VERIFICACIÓN POSTERIOR

Comprobar:

- Tablas académicas creadas.
- Tabla de migraciones.
- Estado real de las 14 migraciones.
- Errores y advertencias.
- Integridad estructural.
- Ausencia de datos institucionales.
- Preservación de servicios de desarrollo.
- Ausencia de cambios en `zarate_dev`.
- Ausencia de credenciales en Git.

Detener únicamente MySQL aislado mediante el procedimiento seguro acreditado.

Confirmar que el puerto 3308 queda libre.

## FASE 7 — DOCUMENTACIÓN

Guardar íntegramente este prompt en:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-17-migracion-controlada.md`

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-migracion-controlada.md`

Documentar:

1. Estado inicial de la base.
2. Precondiciones verificadas.
3. Migraciones revisadas.
4. Alcance autorizado.
5. Ejecutor utilizado.
6. Operación realmente ejecutada.
7. Código de salida.
8. Tablas creadas.
9. Resultado por migración.
10. Incidencias o bloqueos.
11. Integridad del esquema.
12. Preservación del desarrollo.
13. Procedimiento de recuperación si hubo un fallo.
14. Siguiente etapa recomendada.

No publicar credenciales, certificados privados ni datos personales.

## RESTRICCIONES

- No modificar `zarate_dev`.
- No acceder a bases institucionales.
- No ejecutar migraciones destructivas.
- No ejecutar seeders.
- No ejecutar Pest ni Cypress.
- No modificar código funcional.
- No modificar `.env` activos.
- No instalar dependencias.
- No modificar otros Bolts.
- No realizar commits, push, merge ni PR.
- No publicar `.tools/misional-isolated`.

## RESULTADO ESPERADO

Clasificar:

- `MIGRACIONES AISLADAS EJECUTADAS Y VERIFICADAS`.
- `MIGRACIÓN PARCIAL — REQUIERE CORRECCIONES`.
- `BLOQUEADO ANTES DE ESCRITURAS`.
- `FALLO DE MIGRACIÓN — ESQUEMA CONSERVADO`.

No declarar completada la validación integral ni aprobadas las pruebas funcionales.