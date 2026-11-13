# PROMPT 35 — VALIDACIÓN FUNCIONAL DE MATRÍCULAS CON PEST Y MYSQL REAL

Actúa como ingeniero senior de QA, Laravel 13, PHP 8.4, MySQL 8.4, Pest y seguridad de sistemas educativos multiinstitución.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa desde el cierre aprobado del Prompt 34. No comiences desde cero, no descartes modificaciones y no repitas pruebas ya acreditadas innecesariamente.**

## 1. CONTEXTO ACTUAL

El Prompt 34 terminó con:

**A. VALIDACIÓN DE PERSONAS Y PERMISOS APROBADA.**

Resultados acumulados:

- 314 casos Pest inventariados.
- 106 casos distintos aprobados.
- 607 aserciones acreditadas.
- 208 casos pendientes.
- 40 casos nuevos aprobados durante el Prompt 34.
- 40 rollbacks verificados.
- Cero residuos persistentes.
- 52 tablas y 14 migraciones conservadas.
- MySQL aislado en `127.0.0.1:3308`.
- Base exclusiva `zarate_pest`.
- TLS obligatorio.
- Guarda de autorización de 120 segundos.
- Verificador nativo optimizado en Windows x64.
- Bases `zarate_dev` y `zarate_test` protegidas.
- Sin cambios funcionales, commits ni push.

El Prompt 34 identificó **20 casos pendientes relacionados con Matrículas**:

- 18 candidatos a revisión.
- 2 excluidos temporalmente por operaciones DELETE o forceDelete.

Los 20 casos todavía no han sido ejecutados en esta fase.

## 2. OBJETIVO PRINCIPAL

Validar las funcionalidades del módulo de Matrículas mediante los casos Pest existentes y una conexión real a MySQL.

Priorizar los **18 candidatos identificados**, siempre que el análisis individual confirme que pueden ejecutarse con las restricciones actuales.

No ejecutar automáticamente los dos casos que necesitan DELETE o forceDelete.

No crear pruebas artificiales para alcanzar el objetivo.

## 3. FASE A — RECUPERACIÓN DEL ENTORNO

Antes de ejecutar:

1. Verificar la rama y el estado de Git.
2. Leer las evidencias de los Prompts 28–34.
3. Recuperar el inventario de Matrículas elaborado en el Prompt 34.
4. Identificar los 20 casos originales y sus archivos.
5. Confirmar que ninguno está contabilizado entre los 106 casos ya aprobados.
6. Revisar el launcher y las guardas actuales.
7. Comprobar la compatibilidad del verificador nativo con Windows.
8. Comprobar si quedaron procesos MySQL aislados.
9. Preservar todos los archivos y las evidencias anteriores.
10. Confirmar que no existen cambios inesperados en configuraciones o migraciones protegidas.

No utilizar comandos que descarten trabajo, como `git reset --hard` o `git clean`.

## 4. FASE B — CLASIFICACIÓN DE LOS CASOS DE MATRÍCULA

Inspeccionar los 20 casos existentes y clasificarlos según su comportamiento real.

### Grupo A — Compatibles

Casos que utilizan:

- SELECT.
- INSERT.
- UPDATE.
- Fixtures sintéticos.
- DatabaseTransactions.
- Rollback verificado.
- Conexión exclusiva a `zarate_pest`.

### Grupo B — Requieren adaptación privada

Casos que necesitan únicamente cambios de conexión, launcher o contrato de fixtures, sin modificar sus aserciones originales.

### Grupo C — Bloqueados por operaciones adicionales

Casos que requieren:

- DELETE o forceDelete.
- TRUNCATE o DROP.
- Operaciones DDL.
- Reconstrucción de tablas.
- Seeders de demostración.
- Archivos privados.
- Conexiones secundarias sin aislamiento validado.
- Efectos externos no reversibles.

Revisar especialmente los dos casos excluidos por DELETE o forceDelete.

No ejecutarlos en este prompt.

No modificar sus aserciones ni sustituirlos por casos más sencillos.

## 5. FASE C — VALIDACIÓN DEL PROCESO DE MATRÍCULA

Priorizar los escenarios realmente disponibles en los casos originales.

### A. Registro de solicitudes

Comprobar:

- Creación autorizada de solicitudes.
- Datos obligatorios.
- Vinculación con estudiantes.
- Periodo académico válido.
- Grado y sección correspondientes.
- Prevención de duplicidades cuando la regla lo establezca.

### B. Estados de matrícula

Comprobar las transiciones implementadas:

- Borrador o estado inicial, si existe.
- Enviada.
- Observada.
- Aprobada.
- Rechazada.
- Cancelada.

No asumir que todas las transiciones son válidas.

Verificar que Laravel rechaza cambios de estado prohibidos.

### C. Cupos y disponibilidad

Comprobar:

- Disponibilidad de cupos.
- Prevención de sobreasignación.
- Restricciones según sección.
- Validación del periodo correspondiente.
- Integridad de relaciones académicas.

### D. Validación económica

Comprobar, cuando corresponda:

- Relación entre solicitud y obligación económica.
- Restricciones de aprobación por pagos pendientes.
- Validación económica autorizada.
- Separación entre operaciones de Secretaría y Tesorería.

No simular pagos bancarios reales.

### E. Historial y auditoría

Comprobar:

- Registro de cambios de estado.
- Historial de solicitudes.
- Trazabilidad de operaciones.
- Identidad del usuario autorizado.
- Restricciones sobre registros de otras instituciones.

### F. Seguridad

Comprobar:

- Operaciones permitidas para Secretaría.
- Operaciones no autorizadas para otros roles.
- Acceso a solicitudes propias.
- Protección frente al acceso a matrículas ajenas.
- Aislamiento institucional.
- Rechazo de identificadores externos no autorizados.

Solo ejecutar las validaciones presentes en los casos reales seleccionados.

Si un escenario carece de cobertura, identificarlo como pendiente. No atribuirle una prueba aprobada.

## 6. FASE D — VERIFICACIÓN DEL ENTORNO SEGURO

Todas las ejecuciones deben utilizar exclusivamente:

- Host `127.0.0.1`.
- Puerto `3308`.
- Base `zarate_pest`.
- Cuenta exclusiva de pruebas.
- TLS obligatorio.
- `APP_ENV=testing`.
- Autorización vigente.

Comprobar desde el proceso PHP la identidad efectiva de la conexión.

Mantener la autorización de 120 segundos sin ampliaciones.

Mantener las pruebas negativas que rechazan conexiones hacia `zarate_dev` y `zarate_test`.

Conservar el verificador nativo optimizado y sus controles de equivalencia.

Si Windows o el verificador muestran incompatibilidades, detenerse.

## 7. FASE E — EJECUCIÓN CONTROLADA

Seleccionar únicamente los casos seguros de los 18 candidatos.

Comenzar con cuatro casos.

Si esos casos aprueban y los rollbacks quedan verificados, continuar en grupos pequeños, ejecutando cada caso de manera secuencial.

Para cada caso:

1. Confirmar su nombre original.
2. Verificar que el filtro selecciona exactamente el caso esperado.
3. Comprobar identidad de conexión.
4. Confirmar autorización vigente.
5. Preparar fixtures sintéticos.
6. Ejecutar Pest.
7. Registrar aserciones.
8. Verificar rollback.
9. Confirmar cero residuos persistentes.
10. Comprobar las 52 tablas y 14 migraciones.
11. Registrar duración y margen de autorización.
12. Conservar evidencia JUnit.

No ejecutar los 18 casos de manera indiscriminada.

Detener el grupo si aparece un problema de integridad, aislamiento o autorización.

## 8. FASE F — CONTROL DE ERRORES

Si algún caso falla:

1. Conservar el error original.
2. Determinar si procede del launcher, los fixtures, la base o la lógica funcional.
3. Confirmar rollback.
4. Verificar cero residuos.
5. Registrar los archivos y reglas involucrados.
6. Documentar la incidencia de forma reproducible.

No modificar aserciones para ocultar errores.

No modificar reglas funcionales de Matrículas sin presentar antes el diagnóstico.

No realizar reintentos automáticos que puedan duplicar operaciones.

## 9. FASE G — CASOS CON DELETE Y FORCEDELETE

Mantener los dos casos restantes sin ejecutar.

Realizar exclusivamente un análisis técnico que determine:

- Qué operaciones DELETE o forceDelete realizan.
- Si son propias del caso o de hooks/fixtures.
- Qué tablas afectan.
- Qué relaciones y efectos secundarios producen.
- Si existe riesgo de persistencia fuera de una transacción.
- Qué privilegios serían necesarios.
- Si existe una forma de comprobar su comportamiento sin alterar el propósito de la prueba.

No habilitar DELETE automáticamente.

No conceder privilegios adicionales.

No modificar el comportamiento de las pruebas para evitar esas operaciones.

Documentar las condiciones que harían segura una ejecución futura y cualquier autorización adicional que fuera necesaria.

## 10. FASE H — VERIFICACIÓN FINAL

Al terminar:

- Consolidar los resultados individuales.
- Contar exclusivamente casos distintos.
- Registrar las aserciones nuevas.
- Comprobar todos los rollbacks.
- Confirmar cero residuos.
- Verificar las 52 tablas.
- Verificar las 14 migraciones.
- Comprobar TLS y aislamiento.
- Comprobar la protección de las bases existentes.
- Registrar los casos bloqueados.
- Actualizar el inventario global de Pest.

Distinguir las pruebas de Matrículas de las comprobaciones auxiliares de seguridad.

## 11. RESTRICCIONES

Prohibido:

- Modificar `zarate_dev` o `zarate_test`.
- Ejecutar DELETE o forceDelete sin autorización.
- Ejecutar DROP, TRUNCATE o DDL.
- Ejecutar `migrate:fresh`, `migrate:rollback` o `db:wipe`.
- Ejecutar seeders de demostración.
- Alterar las migraciones originales.
- Ampliar privilegios de MySQL.
- Desactivar TLS o debilitar guardas.
- Ampliar la autorización de 120 segundos.
- Modificar servicios de Windows.
- Ejecutar Pest en paralelo.
- Ejecutar Cypress.
- Modificar código funcional sin autorización.
- Realizar commits o push automáticamente.

Mantener secretos y registros sensibles fuera de GitHub.

## 12. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-35-matriculas-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-matriculas-pest.md`

Registrar:

1. Estado inicial.
2. Inventario de los 20 casos de Matrículas.
3. Clasificación de los 18 candidatos.
4. Motivos de exclusión.
5. Resultados individuales de los casos ejecutados.
6. Aserciones.
7. Rollbacks.
8. Comprobaciones de seguridad.
9. Estado SQL final.
10. Incidencias funcionales.
11. Archivos modificados.
12. Estado de Git.
13. Total acumulado de Pest.
14. Recomendación para el siguiente módulo.

## 13. INFORME FINAL

Presentar:

| Área de Matrículas | Ejecutados | Aprobados | Fallidos | Bloqueados | Aserciones |
|---|---|---|---|---|---|
| Solicitudes | Real | Real | Real | Real | Real |
| Estados y transiciones | Real | Real | Real | Real | Real |
| Cupos | Real | Real | Real | Real | Real |
| Validación económica | Real | Real | Real | Real | Real |
| Historial y auditoría | Real | Real | Real | Real | Real |
| Permisos y aislamiento | Real | Real | Real | Real | Real |

Informar:

- Nuevos casos distintos aprobados.
- Total acumulado de casos aprobados.
- Total acumulado de aserciones.
- Pruebas pendientes.
- Rollbacks verificados.
- Resultado de TLS y seguridad.
- Estado de las 52 tablas.
- Estado de los dos casos con DELETE/forceDelete.
- Defectos funcionales identificados.
- Próximo módulo recomendado.

Clasificar el cierre como:

**A. MATRÍCULAS — LOTE FUNCIONAL APROBADO.**

**B. MATRÍCULAS — LOTE PARCIAL CON INCIDENCIAS.**

**C. MATRÍCULAS — CASOS LIMITADOS POR OPERACIONES NO AUTORIZADAS.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

No declarar validado todo el módulo únicamente porque un subconjunto haya aprobado. Indicar expresamente qué escenarios tienen y cuáles no tienen cobertura acreditada.

**Objetivo: validar el funcionamiento real de Matrículas y preparar el avance hacia Aula Virtual, evaluaciones, asistencia y comunicaciones, manteniendo la seguridad del entorno de EcoAula SaaS.**