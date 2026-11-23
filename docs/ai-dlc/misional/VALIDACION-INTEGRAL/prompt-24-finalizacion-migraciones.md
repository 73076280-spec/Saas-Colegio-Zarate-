# PROMPT 24 — FINALIZACIÓN CONTROLADA DE LAS MIGRACIONES 6–14

Actúa como ingeniero senior especializado en Laravel 13, MySQL 8.4, seguridad de datos, migraciones y aseguramiento de calidad.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**No comenzar desde cero. Continuar desde el cierre verificado del Prompt 23.**

## 1. ESTADO CONFIRMADO

El Prompt 23 finalizó con:

**QUINTA MIGRACIÓN RECUPERADA Y VERIFICADA.**

Resultados:

- 5 de 14 migraciones registradas.
- 15 tablas en `zarate_test`.
- Quinta migración completada, incluida su inscripción en el batch 2.
- 18 de 18 verificaciones de seguridad aprobadas.
- Rechazo esperado de autorización vencida.
- Identidad del servidor MySQL aislado comprobada.
- TLS verificado.
- Protección de `zarate_dev` conservada.
- Falso bloqueo por archivos InnoDB volátiles corregido.
- Sin pruebas Pest, Cypress ni seeders ejecutados.

Quedan pendientes las migraciones 6–14.

## 2. OBJETIVO

Completar y verificar las nueve migraciones restantes del entorno MySQL aislado, respetando las guardas existentes.

El objetivo final es:

**14/14 migraciones registradas y esquema verificado.**

No modificar la base de desarrollo.

No utilizar procedimientos destructivos.

## 3. DIAGNÓSTICO INICIAL

Antes de escribir:

1. Comprobar rama y estado de Git.
2. Leer el resultado completo del Prompt 23.
3. Inspeccionar las guardas corregidas.
4. Confirmar que los hashes de las migraciones y configuraciones protegidas permanecen válidos.
5. Confirmar el estado SQL real en `zarate_test`.
6. Verificar que las primeras cinco migraciones continúan registradas.
7. Revisar las nueve migraciones pendientes y su orden.
8. Identificar dependencias, claves foráneas y posibles conflictos.
9. Comprobar que los scripts locales no contienen operaciones destructivas imprevistas.
10. Revisar los permisos del usuario restringido.

Si el estado actual no coincide con el cierre del Prompt 23, detenerse y documentar las diferencias.

## 4. SEGURIDAD DEL ENTORNO

La ejecución debe utilizar exclusivamente:

- MySQL aislado en `127.0.0.1:3308`.
- Base de datos `zarate_test`.
- Usuario restringido de pruebas.
- TLS validado.
- Directorio físico autorizado.
- Guarda de autorización corregida durante el Prompt 23.

Comprobar que el mecanismo de autorización es efectivo inmediatamente antes de cada migración.

No aceptar autorizaciones vencidas.

No modificar los controles de seguridad para conseguir que una migración se ejecute.

Si el procedimiento requiere una nueva autorización explícita, solicitarla y detener las escrituras hasta obtenerla.

Mantener aislados los servicios de demostración que utilizan los puertos 3307, 8000 y 5173.

## 5. ANÁLISIS PREVIO DE CADA MIGRACIÓN

Antes de ejecutar cualquiera de las migraciones 6–14:

1. Leer su contenido original.
2. Identificar tablas, índices y relaciones que creará o modificará.
3. Comprobar que las dependencias existen.
4. Confirmar que la migración aún no está registrada.
5. Comprobar si sus efectos ya existen parcial o totalmente.
6. Detectar posibles operaciones destructivas.
7. Confirmar la identidad y autorización de la conexión.

Si existe una migración parcialmente aplicada, no volver a ejecutarla de forma ciega.

Preparar un diagnóstico y detenerse cuando sea necesario.

## 6. EJECUCIÓN CONTROLADA

Ejecutar las migraciones pendientes únicamente mediante los mecanismos seguros existentes.

Trabajar secuencialmente:

- Migración 6.
- Migración 7.
- Migración 8.
- Migración 9.
- Migración 10.
- Migración 11.
- Migración 12.
- Migración 13.
- Migración 14.

Para cada migración:

- Verificar autorización vigente.
- Ejecutar únicamente la operación autorizada.
- Comprobar el resultado real.
- Verificar el esquema.
- Comprobar el registro en la tabla `migrations`.
- Registrar evidencia.
- Confirmar que no hubo escrituras a `zarate_dev`.

Si una migración falla, detener la ejecución y conservar el estado.

No intentar automáticamente las migraciones siguientes.

No modificar migraciones originales para forzar una ejecución exitosa.

## 7. OPERACIONES PROHIBIDAS

No ejecutar:

- `migrate:fresh`
- `db:wipe`
- `migrate:rollback`
- Seeders
- Eliminación de tablas
- Recreación de bases de datos
- Restauraciones automáticas de snapshots

No modificar contraseñas, usuarios, certificados ni archivos privados de MySQL.

No ejecutar migraciones sobre la conexión de desarrollo.

No detener los servicios del sistema que ya están funcionando.

No realizar cambios funcionales en React o Laravel durante esta intervención.

## 8. VERIFICACIÓN FINAL

Si se completan todas las migraciones, comprobar:

1. Las 14 migraciones están registradas.
2. No existen migraciones pendientes dentro del alcance definido.
3. Las tablas esperadas existen.
4. Las claves foráneas son coherentes.
5. Los índices esperados están presentes.
6. No existen tablas duplicadas por errores de ejecución.
7. El historial de migraciones es consistente.
8. Las guardas de seguridad siguen funcionando.
9. La base de desarrollo continúa fuera del alcance.
10. Las conexiones y verificaciones de cierre de MySQL terminan correctamente.

No asumir una cantidad exacta de tablas. Informar el número real obtenido.

## 9. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-24-finalizacion-migraciones.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-finalizacion-migraciones.md`

Registrar:

- Estado inicial.
- Migraciones ejecutadas.
- Resultado individual de cada migración.
- Tablas creadas o modificadas.
- Verificaciones de claves e índices.
- Controles de seguridad.
- Estado final del esquema.
- Errores y recuperaciones, si existieron.
- Evidencia de aislamiento.
- Archivos modificados.
- Estado de Git.

No publicar información sensible.

## 10. INFORME FINAL

Presentar una tabla:

| Migración | Estado inicial | Resultado | Verificación |
|---|---|---|---|
| 6 | Pendiente | Resultado real | Evidencia |
| 7 | Pendiente | Resultado real | Evidencia |
| 8 | Pendiente | Resultado real | Evidencia |
| 9 | Pendiente | Resultado real | Evidencia |
| 10 | Pendiente | Resultado real | Evidencia |
| 11 | Pendiente | Resultado real | Evidencia |
| 12 | Pendiente | Resultado real | Evidencia |
| 13 | Pendiente | Resultado real | Evidencia |
| 14 | Pendiente | Resultado real | Evidencia |

Concluir con:

- Total de migraciones registradas.
- Total de tablas.
- Resultado de seguridad.
- Migraciones pendientes.
- Posibilidad de iniciar pruebas Pest.
- Estado de Git.

Clasificar el resultado:

**A. MIGRACIONES 14/14 COMPLETADAS Y VERIFICADAS**

**B. MIGRACIONES PARCIALMENTE COMPLETADAS — ESTADO CONSERVADO**

**C. BLOQUEADO POR SEGURIDAD**

**D. BLOQUEADO POR ERROR DE ESQUEMA**

No realizar commits ni push automáticamente.

No ejecutar todavía Pest ni Cypress.

**Prioridad: completar correctamente las migraciones sin comprometer las bases de desarrollo ni los datos existentes.**