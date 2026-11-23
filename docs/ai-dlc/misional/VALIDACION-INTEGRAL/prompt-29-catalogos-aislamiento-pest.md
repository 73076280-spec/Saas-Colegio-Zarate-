# PROMPT 29 — VALIDACIÓN PEST DE CATÁLOGOS ACADÉMICOS Y AISLAMIENTO INSTITUCIONAL

Actúa como ingeniero senior de aseguramiento de calidad, Laravel 13, PHP 8.4, MySQL 8.4, Pest y seguridad multiinstitución.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa desde el cierre exitoso del Prompt 28. No reinicies el proyecto ni repitas las validaciones que ya quedaron acreditadas.**

## 1. ESTADO ACTUAL

El Prompt 28 terminó con:

**A. FIXTURES Y TRANSACCIONES VALIDADOS — PRUEBAS ADICIONALES APROBADAS.**

Resultados verificados:

- 14/14 migraciones completadas.
- 52 tablas en `zarate_pest`.
- Launcher Pest habilitado para casos explícitamente autorizados.
- 8 casos Pest distintos aprobados acumulados.
- 43 aserciones acumuladas de ejecuciones aprobadas.
- 306 casos pendientes de ejecutar.
- INSERT, SELECT y UPDATE verificados.
- Transacciones raíz y savepoints comprobados.
- Rollback correcto en los cuatro casos adicionales.
- Cero residuos persistentes reportados.
- 60 controles offline aprobados.
- Dos denegaciones reales de acceso a bases protegidas.
- TLS verificado.
- Sin cambios funcionales ni migraciones modificadas.
- Sin commits ni push.

Todavía están pendientes la validación de DELETE, los efectos externos y los dos casos dependientes de seeders de demostración.

## 2. OBJETIVO PRINCIPAL

Ampliar las pruebas Pest mediante un lote controlado de **6 a 12 casos distintos**, priorizando:

1. Catálogos académicos.
2. Roles y permisos.
3. Aislamiento entre instituciones.
4. Relaciones académicas.
5. Acceso indebido a recursos institucionales.

No ejecutar todavía la suite completa de 314 casos.

No repetir los ocho casos ya acreditados como si fueran casos nuevos, aunque se permite ejecutarlos nuevamente como regresión.

## 3. FASE A — INSPECCIÓN Y SELECCIÓN

Antes de ejecutar:

1. Confirmar la rama y el estado de Git.
2. Leer las evidencias de los Prompts 26, 27 y 28.
3. Revisar el launcher privado y sus restricciones.
4. Identificar los archivos Pest existentes relacionados con catálogos académicos y seguridad institucional.
5. Inspeccionar `tests/Pest.php`, factories, fixtures y hooks.
6. Determinar qué casos usan `RefreshDatabase`, `DatabaseTransactions` u otros mecanismos de inicialización.
7. Identificar las conexiones y escrituras utilizadas.
8. Seleccionar entre 6 y 12 casos reales de bajo riesgo que sean compatibles con el aislamiento existente.
9. Documentar por qué se selecciona cada caso.
10. Identificar los casos que deben permanecer bloqueados.

No inventar nombres de pruebas ni crear casos artificiales para alcanzar un número.

Si existen menos de seis casos compatibles, ejecutar solamente los que puedan validarse de manera segura.

## 4. FASE B — COMPROBACIÓN DE SEGURIDAD

Antes de cada ejecución, verificar:

- Host MySQL aislado.
- Puerto 3308.
- Base `zarate_pest`.
- Cuenta exclusiva.
- Entorno Laravel `testing`.
- TLS válido.
- Identidad del servidor.
- Autorización vigente.
- Integridad de migraciones y esquema.
- Ausencia de acceso autorizado a `zarate_dev` y `zarate_test`.

Mantener las guardas existentes sin debilitarlas.

Verificar también que el proceso de pruebas y sus conexiones secundarias utilicen exclusivamente el entorno autorizado.

No basta con que las variables de entorno indiquen `zarate_pest`: comprobar la conexión efectiva.

## 5. FASE C — VALIDACIÓN DE CATÁLOGOS ACADÉMICOS

Priorizar pruebas existentes relacionadas con:

### Periodos académicos

- Consulta de periodos.
- Validación de estados y fechas.
- Restricciones sobre periodos cerrados cuando correspondan.

### Niveles, grados y secciones

- Registro y consulta autorizados.
- Unicidad dentro de la institución.
- Relaciones entre niveles, grados y secciones.
- Validación de datos incorrectos.

### Áreas, cursos y aulas

- Consulta según permisos.
- Relaciones académicas válidas.
- Restricciones sobre registros ajenos.

### Seguridad de operaciones

- Usuarios autorizados.
- Usuarios sin permisos.
- Rechazo de operaciones sobre instituciones diferentes.

Utilizar únicamente las reglas realmente implementadas en el proyecto.

No inventar validaciones inexistentes ni modificar reglas académicas para conseguir que las pruebas aprueben.

## 6. FASE D — AISLAMIENTO MULTIINSTITUCIÓN

Seleccionar pruebas que demuestren:

1. Un usuario de la institución A consulta registros propios.
2. Un usuario de la institución A no accede a registros privados de la institución B.
3. Los identificadores ajenos no permiten saltarse las políticas.
4. Las rutas administrativas respetan roles y permisos.
5. Los filtros institucionales se aplican desde Laravel.
6. Los recursos relacionados no permiten acceder indirectamente a información ajena.

Los tests deben verificar respuestas y efectos reales del backend.

No considerar suficiente que un botón esté oculto en React.

No utilizar información privada de la base de demostración.

## 7. FASE E — CONTROL DE TRANSACCIONES Y FIXTURES

Utilizar el mecanismo transaccional validado durante el Prompt 28.

Para cada caso:

1. Comprobar la identidad de la conexión.
2. Preparar fixtures sintéticos mínimos.
3. Ejecutar el caso Pest.
4. Recoger sus aserciones.
5. Ejecutar el rollback correspondiente.
6. Verificar que no quedan residuos.
7. Comprobar integridad de tablas y relaciones.
8. Registrar el resultado.

Revisar los efectos de eventos, listeners y conexiones secundarias.

No suponer que todas las escrituras participan automáticamente en la misma transacción.

Si un caso utiliza DELETE, DDL, TRUNCATE, commits implícitos, jobs externos o seeders, analizar su alcance antes de admitirlo.

**No habilitar automáticamente DELETE ni ampliar privilegios.**

Si el caso no puede ejecutarse bajo las restricciones actuales, dejarlo pendiente y documentar por qué.

## 8. FASE F — EJECUCIÓN PROGRESIVA

Ejecutar los casos de manera secuencial y por grupos pequeños.

Orden recomendado:

1. Catálogos académicos.
2. Roles y permisos.
3. Aislamiento institucional.
4. Relaciones académicas.

Registrar por caso:

- Identificador y nombre.
- Archivo de origen.
- Módulo.
- Resultado.
- Aserciones.
- Error, si ocurre.
- Corrección necesaria.
- Estado del rollback.
- Estado del esquema.
- Evidencia JUnit.

Si aparece un fallo:

- Distinguir un problema del launcher de un defecto funcional.
- Conservar el error original.
- Diagnosticar la causa.
- No modificar los tests para ocultar errores.
- No continuar si existe riesgo para la integridad de datos.

Corregir únicamente defectos bien identificados y dentro del alcance autorizado. Los cambios funcionales que requieran alterar reglas de negocio deben quedar documentados para revisión, no aplicarse silenciosamente.

## 9. FASE G — REGRESIÓN Y RESULTADOS

Después de los casos seleccionados:

1. Confirmar resultados finales.
2. Verificar nuevamente los rollbacks.
3. Comprobar que las 52 tablas siguen presentes.
4. Comparar el estado persistente antes y después.
5. Verificar que no quedaron datos temporales.
6. Comprobar que las bases protegidas permanecen fuera del alcance.
7. Registrar el total de casos distintos aprobados.
8. Separar nuevos casos de reejecuciones.
9. Registrar fallos históricos y resultados finales.
10. Identificar el siguiente grupo de pruebas que puede habilitarse.

No sumar pruebas repetidas al total de casos distintos.

## 10. RESTRICCIONES

Prohibido:

- Modificar `zarate_dev` o `zarate_test`.
- Ejecutar `migrate:fresh`.
- Ejecutar `db:wipe`.
- Ejecutar `migrate:rollback`.
- Eliminar tablas o bases.
- Ejecutar seeders de demostración.
- Modificar las migraciones originales.
- Desactivar TLS.
- Debilitar las guardas.
- Aumentar privilegios MySQL sin autorización.
- Ejecutar los 306 casos restantes de una sola vez.
- Ejecutar pruebas en paralelo.
- Ejecutar Cypress.
- Detener los servidores de demostración.
- Realizar commits o push automáticamente.

No publicar credenciales ni información sensible.

## 11. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-29-catalogos-aislamiento-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-catalogos-aislamiento-pest.md`

Incluir:

- Estado inicial.
- Casos seleccionados.
- Riesgos identificados.
- Cambios del launcher.
- Resultados Pest.
- Aserciones.
- Evidencias de rollback.
- Errores y correcciones.
- Controles de seguridad.
- Bases protegidas.
- Cambios en archivos.
- Estado de Git.
- Casos pendientes.

## 12. INFORME FINAL

Presentar una tabla:

| Área | Casos ejecutados | Aprobados | Fallidos | Pendientes |
|---|---|---|---|---|
| Catálogos académicos | Real | Real | Real | Real |
| Roles y permisos | Real | Real | Real | Real |
| Aislamiento institucional | Real | Real | Real | Real |
| Relaciones académicas | Real | Real | Real | Real |

Informar también:

1. Nuevos casos Pest distintos aprobados.
2. Total acumulado de casos distintos aprobados.
3. Total acumulado de aserciones aprobadas.
4. Cantidad de casos pendientes.
5. Resultado de rollback.
6. Estado de las 52 tablas.
7. Seguridad y TLS.
8. Defectos funcionales encontrados.
9. Correcciones realizadas.
10. Grupo de pruebas recomendado para la siguiente etapa.

Clasificar el resultado como:

**A. LOTE DE CATÁLOGOS Y AISLAMIENTO APROBADO.**

**B. LOTE PARCIAL — INCIDENCIAS FUNCIONALES.**

**C. PRUEBAS PARCIALMENTE EJECUTADAS — LIMITACIONES DE FIXTURES.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

**Objetivo final: comenzar a validar de forma progresiva las reglas académicas y el aislamiento multiinstitucional de EcoAula SaaS mediante pruebas reales de Pest, manteniendo intactos los entornos protegidos.**

---

Registro de continuación del 05/11/2026. Se conserva íntegro el prompt original anterior.

# CONTINUACIÓN DEL PROMPT 29 — CORRECCIÓN DE EXPIRACIÓN DE GUARDA Y REANUDACIÓN DE PRUEBAS PEST

Actúa como ingeniero senior especializado en Laravel 13, Pest, MySQL 8.4, seguridad de bases de datos y automatización QA.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**No comiences desde cero. Continúa exactamente desde el último estado recuperado del Prompt 29.**

## 1. CONTEXTO

El Prompt 29 estaba validando catálogos académicos y aislamiento institucional mediante ocho casos existentes de `Sprint2Test`.

Después de un reinicio de Windows, se recuperaron los archivos y evidencias.

El último diagnóstico confirmó:

- Ocho casos seleccionados correctamente.
- Primer caso iniciado, pero interrumpido por expiración de la guarda de autorización de 120 segundos durante los fixtures.
- Cero casos nuevos aprobados.
- Cero fallos de aserción.
- Un error de entorno.
- Siete casos no ejecutados.
- Rollback registrado.
- 52 tablas conservadas.
- 14 migraciones registradas.
- Cero residuos de datos.
- Ausencia de procesos MySQL aislados activos al realizar la última inspección.

Archivos preparados:

- `.tools/misional-isolated/evidence/Build29.php`
- `.tools/misional-isolated/evidence/prompt29/Prepare29.php`
- `docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-catalogos-aislamiento-pest.md`

Los ocho casos cubren periodos, secciones, cierre de periodos, permisos de Secretaría, aislamiento de asignaturas y secciones, relaciones históricas y restricciones entre instituciones.

## 2. OBJETIVO

Resolver correctamente el problema de expiración de la guarda y reanudar los ocho casos autorizados del Prompt 29.

No ampliar todavía la selección de pruebas.

No iniciar la suite completa de Pest.

## 3. FASE A — DIAGNÓSTICO DE EXPIRACIÓN

Antes de modificar cualquier archivo:

1. Confirmar rama y `git status`.
2. Revisar las evidencias de los Prompts 27, 28 y 29.
3. Inspeccionar el supervisor y el launcher utilizados.
4. Localizar el mecanismo que establece la vigencia de 120 segundos.
5. Determinar en qué momento comienza a contar el tiempo.
6. Revisar cuándo se ejecutan las verificaciones de seguridad.
7. Identificar cuánto tiempo consumen los fixtures.
8. Determinar si el tiempo se consume en inicialización, preflight, arranque PHP, hashing, consultas, factories o preparación de relaciones.
9. Comprobar si la autorización se obtiene demasiado pronto.
10. Identificar el punto preciso donde ocurrió la expiración.

Agregar métricas de duración por etapa, sin registrar secretos ni información privada.

No asumir que el problema es únicamente de rendimiento sin comprobarlo.

## 4. FASE B — CORREGIR EL CICLO DE AUTORIZACIÓN

La solución debe conservar las mismas garantías de seguridad que aprobaron los Prompts anteriores.

Priorizar:

- Realizar las verificaciones preparatorias que no requieren autorización de escritura antes de solicitarla.
- Solicitar una autorización reciente al llegar al punto operativo correspondiente.
- Validar su vigencia inmediatamente antes de las operaciones sensibles.
- Comprobar nuevamente la identidad efectiva de MySQL y el destino de escritura.
- Gestionar los permisos por ejecución o por caso cuando el mecanismo existente lo permita.
- Evitar que una autorización obtenida durante una preparación prolongada venza antes de utilizarse.

**No está permitido:**

- Desactivar la guarda.
- Ignorar expiraciones.
- Ampliar arbitrariamente los 120 segundos.
- Crear autorizaciones ficticias.
- Reutilizar autorizaciones vencidas.
- Eliminar comprobaciones TLS.
- Desactivar la protección de `zarate_dev` o `zarate_test`.
- Renovar autorizaciones dentro de una transacción activa sin un procedimiento previamente validado.

Si la autorización vence durante un caso, detenerlo y verificar rollback y ausencia de residuos antes de cualquier reintento.

Si el límite sigue siendo incompatible con la ejecución real, documentar el problema y detenerse. No forzar un éxito.

## 5. FASE C — RECUPERAR EL MYSQL AISLADO

El reinicio de Windows dejó detenido el servidor MySQL aislado, según la última revisión.

Utilizar exclusivamente los procedimientos locales autorizados para recuperar el entorno de pruebas.

Verificar:

- MySQL aislado en `127.0.0.1:3308`.
- Base `zarate_pest`.
- Usuario exclusivo de pruebas.
- TLS obligatorio.
- Directorio físico correcto.
- Identidad del servidor.
- 14 migraciones registradas.
- 52 tablas presentes.
- Ausencia de residuos de la ejecución fallida.

No modificar ni reiniciar los servicios de demostración que utilizan los puertos 3307, 8000 y 5173.

No ejecutar migraciones nuevamente.

## 6. FASE D — VALIDAR LA CORRECCIÓN SIN EJECUTAR TODAVÍA EL LOTE

Realizar pruebas controladas del launcher y de la guarda.

Confirmar que:

1. Una autorización válida es aceptada únicamente dentro de su alcance.
2. Una autorización vencida es rechazada.
3. Una base distinta de `zarate_pest` es rechazada.
4. Un puerto incorrecto es rechazado.
5. Un usuario no autorizado es rechazado.
6. TLS continúa siendo obligatorio.
7. Las bases protegidas permanecen inaccesibles.
8. El preflight no consume innecesariamente la vigencia de la autorización operativa.
9. Los cambios no alteran las aserciones ni los fixtures originales de Pest.

Conservar las pruebas negativas ya existentes.

No dar por aprobada esta fase solo porque el launcher arranca.

## 7. FASE E — REANUDAR LOS OCHO CASOS DE SPRINT2TEST

Si las comprobaciones anteriores aprueban, continuar con los ocho casos ya seleccionados.

No modificar su lógica funcional ni sus aserciones.

No sustituirlos por pruebas artificialmente más sencillas.

Ejecutar de forma secuencial y sin paralelismo.

Para cada caso:

1. Confirmar destino de conexión.
2. Comprobar TLS.
3. Verificar autorización vigente.
4. Preparar fixtures sintéticos.
5. Ejecutar el test.
6. Registrar resultado y aserciones.
7. Confirmar rollback.
8. Comprobar ausencia de residuos.
9. Verificar que las 52 tablas permanecen intactas.
10. Conservar evidencia JUnit.

Si reaparece la expiración:

- Detenerse.
- Conservar los logs.
- Registrar el tiempo exacto de cada etapa.
- Identificar si hubo transacciones abiertas.
- Comprobar rollback.
- No reintentar automáticamente.

Si aparece un fallo funcional auténtico, distinguirlo del fallo del entorno y documentarlo.

## 8. RESTRICCIONES ABSOLUTAS

No ejecutar:

- DELETE.
- DROP.
- TRUNCATE.
- DDL.
- `migrate:fresh`.
- `migrate:rollback`.
- `db:wipe`.
- Seeders de demostración.

No modificar:

- `zarate_dev`.
- `zarate_test`.
- Migraciones originales.
- Contraseñas existentes.
- Privilegios MySQL.
- Reglas de negocio del sistema.
- Código funcional de React o Laravel.

No eliminar las evidencias anteriores.

No ejecutar Cypress.

No realizar commits ni push automáticamente.

## 9. DOCUMENTACIÓN

Completar los documentos existentes del Prompt 29:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-29-catalogos-aislamiento-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-catalogos-aislamiento-pest.md`

Documentar:

- Estado recuperado.
- Causa de la expiración.
- Duración de cada etapa.
- Corrección aplicada al supervisor.
- Pruebas positivas y negativas de seguridad.
- Ocho casos seleccionados.
- Resultados individuales.
- Aserciones ejecutadas.
- Rollback.
- Estado final de las bases.
- Archivos modificados.
- Estado de Git.
- Pendientes reales.

No incluir contraseñas, claves, certificados privados ni tokens.

## 10. INFORME FINAL

Entregar una tabla:

| Caso | Módulo | Resultado | Aserciones | Rollback |
|---|---|---|---|---|
| 1 | Catálogos | Real | Real | Real |
| 2 | Catálogos | Real | Real | Real |
| 3 | Catálogos | Real | Real | Real |
| 4 | Permisos | Real | Real | Real |
| 5 | Aislamiento | Real | Real | Real |
| 6 | Aislamiento | Real | Real | Real |
| 7 | Relaciones | Real | Real | Real |
| 8 | Relaciones | Real | Real | Real |

Informar:

1. Causa real de la expiración.
2. Solución implementada.
3. Cantidad de pruebas nuevas aprobadas.
4. Cantidad de pruebas fallidas.
5. Cantidad de pruebas bloqueadas.
6. Total acumulado de pruebas Pest distintas aprobadas.
7. Total de aserciones aprobadas.
8. Estado de las 52 tablas.
9. Estado de las bases protegidas.
10. Próxima etapa recomendada.

Clasificar:

**A. PROMPT 29 COMPLETADO — OCHO CASOS APROBADOS.**

**B. PROMPT 29 PARCIAL — CASOS PENDIENTES.**

**C. BLOQUEADO POR EXPIRACIÓN O ENTORNO.**

**D. INCIDENCIAS FUNCIONALES DETECTADAS.**

**Prioridad: solucionar la expiración de manera segura y finalizar los ocho casos del Prompt 29 sin repetir innecesariamente el trabajo anterior.**