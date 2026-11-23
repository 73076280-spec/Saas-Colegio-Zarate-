# PROMPT 25 — RECUPERACIÓN DE MIGRACIÓN 9 Y FINALIZACIÓN DEL ESQUEMA MYSQL

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4, MySQL 8.4, bases de datos InnoDB, migraciones y aseguramiento de calidad.

## CONTEXTO

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

Estamos desarrollando EcoAula SaaS para el Colegio Zárate.

No comiences desde cero ni repitas trabajos que ya se completaron.

El Prompt 24 terminó con:

**MIGRACIONES PARCIALMENTE COMPLETADAS — ESTADO CONSERVADO.**

Resultados conocidos:

- 8 de 14 migraciones registradas.
- 31 tablas presentes en `zarate_test`.
- Migración 6 aprobada en batch 3.
- Migración 7 aprobada en batch 4.
- Migración 8 aprobada en batch 5.
- Migración 9 con operaciones DDL aplicadas, pero sin registrar en Laravel.
- Migraciones 10–14 sin ejecutar.
- 34 comprobaciones offline aprobadas.
- Aislamiento y TLS verificados.
- Sin escrituras propias en `zarate_dev`.
- Pest, Cypress y seeders no ejecutados.

El bloqueo ocurrió al comparar la representación de comillas escapadas relacionada con `active_student_id`.

La inspección anterior sugirió una diferencia de representación entre el esquema esperado y el obtenido desde MySQL.

**No asumir que la migración 9 está correctamente aplicada hasta comprobar el esquema completo.**

## OBJETIVO GENERAL

1. Corregir de forma segura el problema del comparador SQL.
2. Verificar si la migración 9 está completamente aplicada.
3. Registrar la migración 9 únicamente si su equivalencia está demostrada.
4. Continuar con las migraciones 10–14 si todas las verificaciones son satisfactorias.
5. Finalizar con 14/14 migraciones verificadas, o detenerse documentando exactamente el bloqueo restante.

## FASE 1 — REVISIÓN OBLIGATORIA

Antes de realizar cambios:

1. Confirmar rama y estado de Git.
2. Leer las evidencias completas de los Prompts 23 y 24.
3. Inspeccionar los scripts locales utilizados para ejecutar y comparar las migraciones.
4. Comprobar que siguen activos los controles de integridad y autorización.
5. Identificar la novena migración original de Laravel.
6. Inspeccionar su contenido y las operaciones DDL esperadas.
7. Revisar las consultas que produjeron la diferencia de comillas.
8. Identificar el comparador responsable y sus limitaciones.
9. Confirmar que el servidor aislado está disponible para una inspección de lectura.
10. Comprobar la vigencia de cualquier autorización necesaria.

No modificar código ni base de datos antes de completar el diagnóstico.

## FASE 2 — IDENTIFICAR LA CAUSA DEL ERROR

Investigar específicamente la comparación del campo `active_student_id`.

Determinar si la diferencia proviene de:

- Comillas simples escapadas.
- Diferencias entre representación de cadenas SQL.
- Normalización del motor MySQL.
- Expresiones generadas.
- Definiciones DEFAULT.
- Diferencias semánticas reales.
- Errores del propio comparador.

Consultar información estructural mediante `information_schema` y, cuando corresponda, `SHOW CREATE TABLE`.

Comparar contra la definición original de la migración Laravel.

La comparación debe verificar todos los atributos relevantes:

- Nombre y tipo de columna.
- Nulabilidad.
- Expresiones generadas.
- Valores por defecto.
- Índices.
- Unicidad.
- Claves foráneas.
- Opciones relevantes de tabla.

No considerar equivalentes dos esquemas solamente porque sus cadenas se parecen después de eliminar comillas o barras invertidas.

No introducir comparaciones que siempre devuelvan verdadero.

## FASE 3 — CORREGIR EL COMPARADOR

Si se confirma que la diferencia es exclusivamente de representación:

1. Localizar el código exacto del comparador.
2. Aplicar la corrección mínima.
3. Mantener estricta la comparación semántica.
4. Agregar pruebas positivas con definiciones equivalentes.
5. Agregar pruebas negativas con definiciones realmente diferentes.
6. Verificar que el comparador rechace columnas, índices o restricciones faltantes.
7. Confirmar que no se ha desactivado ninguna guarda.

Si se detecta una diferencia real del esquema, no ocultarla mediante normalización.

En ese caso, detener la intervención y documentar el problema.

## FASE 4 — RECUPERACIÓN DE LA MIGRACIÓN 9

Primero realizar una inspección SQL exclusivamente de lectura.

Confirmar:

- MySQL aislado: `127.0.0.1:3308`.
- Base: `zarate_test`.
- Usuario restringido.
- TLS válido.
- Directorio físico aislado.
- Migraciones 1–8 registradas.
- Migración 9 todavía pendiente en el historial.
- Estructuras creadas por la novena migración.

Si todo el esquema coincide exactamente con lo esperado:

1. Confirmar la autorización vigente para escritura.
2. Verificar nuevamente la identidad de la conexión.
3. Registrar únicamente la novena migración en el historial Laravel mediante el procedimiento controlado existente.
4. Determinar el batch correcto de acuerdo con el historial real y la estrategia documentada.
5. No repetir el DDL ya aplicado.
6. Consultar nuevamente el historial y el esquema.
7. Comprobar que existen 9/14 migraciones registradas.
8. Registrar la evidencia.

No insertar registros duplicados en `migrations`.

No ejecutar automáticamente la migración 9 desde el principio cuando sus operaciones DDL ya existen.

Si existe cualquier diferencia real o incertidumbre sobre su equivalencia, detenerse sin realizar escrituras.

## FASE 5 — CONTINUAR CON LAS MIGRACIONES 10–14

Esta fase solo puede comenzar si la migración 9 fue recuperada y verificada completamente.

Para cada migración pendiente:

1. Inspeccionar el archivo original.
2. Revisar sus dependencias.
3. Comprobar ausencia de aplicaciones parciales previas.
4. Verificar autorización vigente.
5. Confirmar servidor, base, usuario y TLS.
6. Ejecutar exclusivamente la migración autorizada.
7. Comprobar tablas, columnas, índices y relaciones.
8. Verificar el historial Laravel.
9. Conservar evidencia técnica.
10. Continuar a la siguiente únicamente si la anterior se completó correctamente.

Orden:

- Migración 10.
- Migración 11.
- Migración 12.
- Migración 13.
- Migración 14.

Detener inmediatamente ante cualquier fallo.

No realizar reparaciones automáticas no previstas en el procedimiento seguro.

## FASE 6 — RESTRICCIONES DE SEGURIDAD

Mantener protegida la base `zarate_dev`.

No modificar los servicios de demostración:

- MySQL: puerto 3307.
- Laravel: puerto 8000.
- Vite: puerto 5173.

Trabajar exclusivamente en el entorno aislado del puerto 3308.

Prohibido:

- `migrate:fresh`.
- `migrate:rollback`.
- `db:wipe`.
- Seeders.
- Eliminación o recreación de bases.
- Eliminación de tablas existentes.
- Desactivación de TLS.
- Modificaciones de credenciales.
- Restauración de snapshots antiguos sobre archivos InnoDB activos.
- Alteración de migraciones originales.
- Desactivación o ampliación arbitraria de guardas.
- Repetición de operaciones DDL ya aplicadas.
- Ejecución de Pest o Cypress durante esta intervención.

Si el mecanismo exige una autorización nueva, respetarla y detener cualquier escritura hasta obtenerla.

No considerar suficiente una autorización que ya haya vencido.

## FASE 7 — VERIFICACIÓN FINAL

Si las migraciones 9–14 terminan satisfactoriamente, verificar:

- 14/14 migraciones registradas.
- Ninguna migración pendiente dentro del alcance.
- Cantidad real de tablas existentes.
- Integridad de claves foráneas.
- Integridad de índices.
- Esquema consistente con los archivos Laravel originales.
- Historial coherente de batches.
- Guardas de seguridad funcionando.
- Pruebas negativas de autorización aprobadas.
- Ausencia de escrituras propias en `zarate_dev`.
- Cierre limpio de los procesos MySQL utilizados.

No inventar una cantidad esperada de tablas.

## FASE 8 — EVIDENCIAS AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-25-recuperacion-migracion-9.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-recuperacion-migracion-9.md`

Documentar:

1. Diagnóstico inicial.
2. Causa real del error de comillas.
3. Corrección del comparador.
4. Pruebas positivas y negativas.
5. Verificación del esquema de la migración 9.
6. Recuperación del registro Laravel, si corresponde.
7. Migraciones 10–14 ejecutadas, si corresponde.
8. Conteo final de tablas.
9. Resultado de seguridad.
10. Estado de Git.
11. Riesgos pendientes.
12. Posibilidad de iniciar las pruebas Pest.

Preservar el historial completo de errores previos.

No publicar contraseñas, tokens, claves ni certificados privados.

## INFORME FINAL OBLIGATORIO

Entregar una tabla de resultados individuales para las migraciones 9, 10, 11, 12, 13 y 14.

Indicar:

- Estado inicial.
- Estado final.
- Número de migraciones registradas.
- Número de tablas.
- Resultados de las guardas.
- Confirmación de aislamiento.
- Archivos modificados.
- Posibilidad de iniciar Pest.
- Pendientes.

Clasificar el resultado:

**A. MIGRACIONES 14/14 COMPLETADAS Y VERIFICADAS.**

**B. MIGRACIÓN 9 RECUPERADA — OTRAS PENDIENTES.**

**C. MIGRACIONES PARCIALMENTE COMPLETADAS — ESTADO CONSERVADO.**

**D. BLOQUEADO POR SEGURIDAD O INCONSISTENCIA DEL ESQUEMA.**

No realizar commits ni push automáticamente.

Prioridad: resolver el error real de comparación y finalizar el esquema sin comprometer la integridad del entorno.

---

Registro adicional: continuación recibida el 05/11/2026. Se conserva a continuación su texto íntegro.

# CONTINUACIÓN DEL PROMPT 25 — REANUDAR DESDE EL LÍMITE DE USO

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4 y MySQL 8.4.

Estamos trabajando en el proyecto **EcoAula SaaS — Colegio Zárate**, ubicado en:

`D:\zarate-saas`

**IMPORTANTE: No comiences desde cero, no repitas todo el Prompt 25 y no descartes los archivos modificados. Continúa exactamente desde el punto donde se interrumpió Codex por límite de uso.**

## ESTADO ANTES DE LA INTERRUPCIÓN

Durante el Prompt 25 se realizaron las siguientes actividades:

1. Se verificaron correctamente los hashes de las 14 migraciones originales y cuatro configuraciones protegidas.
2. Se comprobó que el puerto 3308 estaba libre.
3. Se identificó y corrigió el problema del comparador SQL relacionado con las representaciones de comillas escapadas en la expresión `CASE` de `active_student_id`.
4. Se ejecutaron **37 pruebas del comparador, todas aprobadas**.
5. Las pruebas incluyeron mutaciones de columnas, índices, claves foráneas, unicidad, nulabilidad, literales y precedencia lógica.
6. Se contrastó la representación de `INFORMATION_SCHEMA` con `SHOW CREATE TABLE`.
7. Se estaba preparando el registro exclusivo de la novena migración.
8. Codex alcanzó el límite de uso antes de entregar un cierre final.

Entre los archivos modificados se encuentran:

- `.tools/misional-isolated/evidence/prompt25/Checks25.php`
- `.tools/misional-isolated/evidence/prompt25/ComparatorTests25.php`
- `.tools/misional-isolated/evidence/prompt25/Expression25.php`

También existen otros archivos modificados en esta intervención que debes identificar mediante Git y el sistema de archivos.

## OBJETIVO DE ESTA CONTINUACIÓN

Finalizar las operaciones pendientes del Prompt 25, utilizando el código y las evidencias ya generados.

### FASE 1 — RECUPERAR EL ESTADO

1. Comprobar la rama actual y `git status`.
2. Inspeccionar los cinco archivos modificados durante la intervención anterior.
3. Identificar los scripts y documentación que quedaron preparados.
4. Confirmar que las 37 pruebas anteriormente aprobadas siguen funcionando.
5. Revisar que el comparador no haya perdido ninguna validación de seguridad.
6. Verificar el estado actual de MySQL aislado, sin asumir que quedó funcionando después de la interrupción.
7. Consultar en modo lectura el historial de migraciones y el esquema actual.

No sobrescribir ni rehacer cambios válidos.

### FASE 2 — TERMINAR LA MIGRACIÓN 9

La última evidencia SQL conocida indicaba:

- 8 de 14 migraciones registradas.
- 31 tablas.
- Operaciones DDL de la novena migración ya aplicadas.
- Registro Laravel de la migración 9 pendiente.

Primero verificar nuevamente este estado.

Comprobar la equivalencia completa del esquema de la migración 9, incluyendo:

- Columnas y sus tipos.
- Expresiones generadas.
- Índices.
- Restricciones.
- Claves foráneas.
- Nulabilidad.
- Valores predeterminados.

Si el esquema coincide completamente, las pruebas del comparador aprueban y existe autorización válida:

1. Verificar identidad, aislamiento y TLS.
2. Registrar exclusivamente la novena migración utilizando el procedimiento controlado existente.
3. No repetir las operaciones DDL anteriores.
4. Verificar que el historial tenga 9 de 14 migraciones registradas.
5. Conservar la evidencia del batch correcto.

Si existe una diferencia real, detenerse y documentarla.

### FASE 3 — COMPLETAR MIGRACIONES 10–14

Solo si la novena migración queda recuperada y verificada:

1. Revisar las dependencias de cada migración.
2. Confirmar que no haya operaciones parcialmente aplicadas.
3. Comprobar autorización vigente antes de cada escritura.
4. Ejecutar las migraciones 10, 11, 12, 13 y 14 de forma secuencial.
5. Verificar el esquema y registro después de cada una.
6. Detenerse inmediatamente ante cualquier error.

El resultado esperado, si todo funciona, es **14/14 migraciones completadas y verificadas**.

No asumir éxito hasta obtener evidencia SQL.

### FASE 4 — SEGURIDAD

Conservar las protecciones existentes:

- Base aislada: `zarate_test`.
- MySQL aislado: puerto `3308`.
- Protección de `zarate_dev`.
- Identidad de conexión comprobada.
- TLS.
- Guarda de autorización vigente.
- Validaciones positivas y negativas.

No ejecutar:

- `migrate:fresh`
- `migrate:rollback`
- `db:wipe`
- Seeders
- Operaciones destructivas
- Restauraciones de snapshots
- Modificaciones de las migraciones originales

No detener los servicios de demostración de los puertos 3307, 8000 y 5173.

Si es necesaria una nueva autorización explícita, solicitarla antes de escribir.

### FASE 5 — DOCUMENTACIÓN Y RESULTADOS

Completar y actualizar los documentos del Prompt 25:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-25-recuperacion-migracion-9.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-recuperacion-migracion-9.md`

Documentar:

- Recuperación desde la interrupción.
- Cambios preservados.
- Resultado de las pruebas del comparador.
- Estado SQL inicial.
- Resultado de la migración 9.
- Resultado individual de las migraciones 10–14.
- Total de migraciones registradas.
- Total real de tablas.
- Verificaciones de seguridad.
- Archivos modificados y estado de Git.

No ejecutar todavía Pest ni Cypress.

No realizar commits ni push automáticamente.

## INFORME FINAL

Entregar un resumen con:

1. ¿Se recuperó la migración 9?
2. ¿Se completaron las migraciones 10–14?
3. ¿Cuántas migraciones y tablas existen realmente?
4. ¿Aprobaron las verificaciones de seguridad?
5. ¿Se mantuvo intacta la base de desarrollo?
6. ¿Podemos comenzar las pruebas Pest?
7. ¿Qué quedó pendiente?

**Continúa trabajando desde el estado real de los archivos. No repitas tareas completadas, no inventes resultados y no alteres datos de desarrollo.**