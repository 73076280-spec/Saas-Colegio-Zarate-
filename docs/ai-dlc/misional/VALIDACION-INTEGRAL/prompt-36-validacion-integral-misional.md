# PROMPT MAESTRO 36 — VALIDACIÓN INTEGRAL DE LOS CINCO BOLTS MISIONALES DE ECOAULA SAAS

Actúa como ingeniero senior de QA, arquitectura de software, Laravel 13, PHP 8.4, MySQL 8.4, React 19, Pest, Cypress y seguridad multiinstitucional.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## INSTRUCCIÓN PRINCIPAL

**Quiero que continúes automáticamente con la validación de TODOS los módulos misionales de EcoAula SaaS, sin necesitar un prompt nuevo para cada módulo.**

No comiences desde cero.

No repitas innecesariamente las pruebas acreditadas.

No descartes las modificaciones existentes.

Trabaja de manera secuencial, conservando los controles de seguridad y las evidencias reales.

**No interpretes esta instrucción como autorización para operaciones destructivas, ampliación de privilegios o acceso a bases protegidas.**

## 1. CONTEXTO DEL PROYECTO

EcoAula SaaS es una plataforma de gestión educativa desarrollada para el Colegio Zárate.

Tecnologías:

- Backend: Laravel 13 y PHP 8.4.
- Frontend: React 19 y TypeScript.
- Base de datos: MySQL 8.4.
- Autenticación: Laravel Sanctum.
- Permisos: Spatie Permission.
- Pruebas backend: Pest.
- Pruebas frontend: Cypress.

El objetivo es validar de forma integral los cinco Bolts misionales y las dependencias que utilizan.

### Estado conocido antes del Prompt 35

- 314 casos Pest inventariados.
- 106 casos distintos aprobados.
- 607 aserciones acreditadas.
- 208 casos pendientes.
- 14 migraciones verificadas.
- 52 tablas en la base aislada.
- Guardas de seguridad activas.
- Autorización de 120 segundos.
- TLS verificado.
- Rollback y cero residuos acreditados en los casos ejecutados.
- Sin modificaciones funcionales ni migraciones alteradas.

**Debes actualizar estas cifras con el resultado real del Prompt 35. No utilizar las cifras anteriores como estado final.**

## 2. RECUPERAR EL RESULTADO DEL PROMPT 35

Antes de cualquier ejecución:

1. Confirmar la rama actual y el estado de Git.
2. Leer la documentación y las evidencias completas del Prompt 35.
3. Identificar exactamente cuáles casos de Matrículas aprobaron.
4. Identificar los casos fallidos, bloqueados y no ejecutados.
5. Revisar si existe alguna operación parcial.
6. Verificar el estado real de `zarate_pest`.
7. Confirmar las 14 migraciones y las 52 tablas.
8. Revisar JUnit y las evidencias conservadas.
9. Recuperar el inventario actualizado de casos pendientes.
10. Preservar todos los archivos y resultados anteriores.

Si el Prompt 35 no ha finalizado de forma verificable, no asumirlo completado.

No repetir los casos aprobados salvo para una regresión justificada.

## 3. OBJETIVO GLOBAL

Completar la mayor cantidad segura y verificable de casos Pest de los cinco Bolts misionales, sin detenerse artificialmente al finalizar cada módulo.

Orden obligatorio:

1. Gestión de Matrículas.
2. Enseñanza-Aprendizaje y Aula Virtual.
3. Evaluaciones y Calificaciones.
4. Asistencia y Justificaciones.
5. Comunicaciones y Solicitudes Académicas.
6. Regresión transversal de autenticación, permisos y aislamiento institucional.

Puedes continuar automáticamente al siguiente módulo cuando las comprobaciones del anterior sean satisfactorias.

Si un caso individual está bloqueado por un requisito específico, documentarlo y continuar con otros casos seguros, siempre que el bloqueo no comprometa la seguridad global ni la integridad del entorno.

Si existe una incidencia de seguridad o integridad no resuelta, detener toda ejecución con escrituras.

## 4. FASE 1 — GESTIÓN DE MATRÍCULAS

Conservar los resultados ya acreditados del Prompt 35.

Ejecutar únicamente los casos pendientes que sean compatibles con el entorno autorizado.

Validar, según los casos reales existentes:

- Registro de solicitudes.
- Validaciones de datos.
- Estados y transiciones.
- Cupos y disponibilidad.
- Prevención de matrículas duplicadas.
- Aprobación y rechazo.
- Validación económica.
- Restricciones de Secretaría.
- Historial y auditoría.
- Aislamiento institucional.
- Consulta por estudiantes y apoderados autorizados.

Mantener bloqueados los casos que requieran DELETE o forceDelete no autorizados.

No modificar las reglas de negocio.

Al finalizar, registrar los resultados y continuar automáticamente con Aula Virtual si es seguro hacerlo.

## 5. FASE 2 — ENSEÑANZA-APRENDIZAJE Y AULA VIRTUAL

Identificar las pruebas existentes relacionadas con:

- Cursos.
- Asignación de docentes.
- Unidades académicas.
- Materiales educativos.
- Publicación de contenidos.
- Actividades y tareas.
- Entregas de estudiantes.
- Fechas límite.
- Restricciones sobre actividades cerradas.
- Acceso exclusivo de estudiantes matriculados.
- Separación entre contenidos publicados y borradores.
- Aislamiento institucional.

Verificar las relaciones reales entre Gestión Académica, Matrículas y Aula Virtual.

No utilizar archivos privados existentes sin evaluar sus efectos.

Si algunos tests requieren operaciones sobre archivos, clasificarlos y mantenerlos pendientes hasta contar con un entorno aislado y verificado.

Ejecutar los casos compatibles por lotes progresivos.

Documentar el resultado y continuar con Evaluaciones.

## 6. FASE 3 — EVALUACIONES Y CALIFICACIONES

Validar los casos existentes sobre:

- Creación de evaluaciones.
- Publicación y cierre.
- Registro de calificaciones.
- Restricciones de periodos académicos.
- Docentes autorizados.
- Estudiantes matriculados.
- Modificaciones autorizadas.
- Historial de cambios.
- Prevención de alteraciones indebidas.
- Consulta de notas propias.
- Acceso del apoderado a información autorizada.
- Aislamiento entre instituciones.

Prestar atención a los cambios de estado y a la trazabilidad.

No modificar una aserción para ocultar una diferencia funcional.

Registrar resultados y continuar con Asistencia.

## 7. FASE 4 — ASISTENCIA Y JUSTIFICACIONES

Identificar y ejecutar los casos compatibles de:

- Registro de sesiones.
- Asistencia de estudiantes.
- Ausencias.
- Tardanzas.
- Prevención de registros duplicados.
- Consulta de asistencia propia.
- Acceso de apoderados vinculados.
- Justificaciones.
- Revisión y resolución.
- Restricciones de docentes.
- Integridad referencial.
- Auditoría.
- Aislamiento institucional.

Si una prueba implica archivos adjuntos, verificar primero su aislamiento y su limpieza.

Si requiere efectos no reversibles o permisos no autorizados, mantenerla bloqueada.

Documentar resultados y continuar con Comunicaciones.

## 8. FASE 5 — COMUNICACIONES Y SOLICITUDES

Validar los casos existentes relacionados con:

- Comunicados institucionales.
- Destinatarios autorizados.
- Solicitudes académicas.
- Estados de solicitudes.
- Observaciones.
- Correcciones.
- Seguimiento.
- Documentos académicos.
- Notificaciones.
- Marcado como leído.
- Permisos por rol.
- Historial de operaciones.
- Aislamiento institucional.

Revisar los efectos secundarios, especialmente notificaciones, auditoría, eventos, archivos y trabajos en cola.

No suponer que un rollback SQL revierte efectos sobre archivos o servicios externos.

Bloquear los casos cuyo aislamiento no pueda verificarse.

## 9. FASE 6 — REGRESIÓN TRANSVERSAL

Después de los cinco módulos:

1. Revisar los casos pendientes de autenticación.
2. Revisar roles y permisos.
3. Revisar aislamiento multiinstitucional.
4. Comprobar relaciones entre módulos.
5. Identificar incidencias de compatibilidad.
6. Ejecutar únicamente las pruebas de regresión compatibles con el entorno seguro.
7. Consolidar los resultados de todos los lotes.
8. Distinguir pruebas nuevas de reejecuciones.
9. Registrar defectos reproducibles.
10. Preparar la lista definitiva de casos Pest pendientes.

No ejecutar indiscriminadamente toda la suite si siguen existiendo operaciones sin autorización o aislamiento validado.

## 10. SEGURIDAD DE BASES DE DATOS

Utilizar exclusivamente:

- Host `127.0.0.1`.
- Puerto `3308`.
- Base `zarate_pest`.
- Cuenta exclusiva de pruebas.
- TLS obligatorio.
- Entorno Laravel `testing`.
- Guarda de autorización vigente.

Proteger:

- `zarate_dev`.
- `zarate_test`.
- Los servicios de demostración de puertos 3307, 8000 y 5173.

Verificar la identidad efectiva de conexión desde cada proceso de pruebas.

Mantener la autorización de 120 segundos.

Conservar el verificador nativo optimizado del Prompt 32, con sus pruebas de equivalencia y sus restricciones de compatibilidad con Windows.

No reutilizar autorizaciones vencidas.

No ampliar privilegios MySQL.

No desactivar guardas.

## 11. EJECUCIÓN AUTOMÁTICA POR LOTES

Para reducir el número de intervenciones manuales:

1. Generar un inventario único de todos los casos pendientes.
2. Clasificar cada caso por módulo y nivel de riesgo.
3. Seleccionar exclusivamente pruebas compatibles.
4. Ejecutar primero un grupo pequeño para comprobar la estabilidad.
5. Continuar por lotes moderados, preferentemente de hasta 20–40 casos cuando el análisis individual lo permita.
6. Ejecutar cada caso de manera secuencial.
7. Comprobar autorización vigente en cada operación sensible.
8. Registrar JUnit, aserciones, rollback y latencia.
9. Confirmar cero residuos después de cada caso.
10. Continuar automáticamente con los siguientes casos compatibles cuando todas las verificaciones aprueben.

No limitar el total de casos solamente por una cifra arbitraria si existen más casos seguros y tiempo de ejecución disponible.

No ejecutar pruebas en paralelo.

No reintentar automáticamente errores de entorno sin diagnosticar su causa.

No repetir pruebas aprobadas para aumentar artificialmente las estadísticas.

Si se interrumpe la sesión de Codex, registrar un checkpoint con los casos completados y el siguiente caso pendiente, para permitir una reanudación segura.

## 12. OPERACIONES NO AUTORIZADAS

No ejecutar:

- DELETE o forceDelete no autorizados.
- DROP.
- TRUNCATE.
- DDL.
- `migrate:fresh`.
- `migrate:rollback`.
- `db:wipe`.
- Seeders de demostración.
- Reconstrucción de bases protegidas.
- Operaciones externas no aisladas.

No modificar:

- Las 14 migraciones originales.
- Credenciales existentes.
- Privilegios MySQL.
- Código funcional para ocultar fallos.
- Configuraciones globales de Windows.
- Servicios de demostración.

No realizar commits ni push automáticamente.

Si alguna prueba requiere autorización adicional, documentar exactamente la operación, el alcance y los riesgos. Continuar con otros casos seguros, pero no ejecutar esa operación hasta contar con aprobación específica.

## 13. CONTROL DE DEFECTOS

Ante un fallo:

1. Conservar el resultado original.
2. Identificar el módulo afectado.
3. Distinguir infraestructura, fixture y defecto funcional.
4. Comprobar rollback y ausencia de residuos.
5. Registrar pasos de reproducción.
6. Clasificar la severidad.
7. Identificar archivos y reglas involucradas.
8. Proponer la corrección necesaria.

No modificar código funcional sin autorización.

No alterar las aserciones originales para obtener aprobaciones artificiales.

Un fallo funcional no debe contarse como prueba aprobada.

## 14. DOCUMENTACIÓN AI-DLC AUTOMÁTICA

Crear un documento maestro:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-36-validacion-integral-misional.md`

Y un informe consolidado:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validacion-integral-misional.md`

El informe debe contener secciones independientes para:

1. Matrículas.
2. Aula Virtual.
3. Evaluaciones.
4. Asistencia.
5. Comunicaciones.
6. Seguridad y regresión transversal.
7. Incidencias.
8. Pruebas pendientes.
9. Resultados acumulados.
10. Preparación de Cypress.

Conservar los documentos y evidencias anteriores, sin sobrescribir el historial.

Al terminar cada módulo, actualizar el informe y dejar un checkpoint verificable.

Mantener evidencias privadas, credenciales, tokens y certificados fuera de Git.

## 15. PREPARACIÓN DE CYPRESS

Cuando termine la validación Pest:

1. Revisar los flujos Cypress existentes.
2. Identificar las pruebas de los cinco módulos misionales.
3. Determinar las dependencias con backend y fixtures.
4. Proponer un entorno de integración separado de la demostración.
5. Verificar que ninguna ejecución pueda alterar las bases protegidas.
6. Identificar qué pruebas pueden ejecutarse sin operaciones destructivas.

Si el entorno Cypress está completamente aislado, autorizado y verificado, documentar su preparación.

**No ejecutar Cypress automáticamente sobre la base de desarrollo ni utilizar cuentas de demostración para pruebas con escrituras.**

Si requiere nueva autorización, dejarlo preparado y explicar exactamente qué falta.

## 16. INFORME FINAL OBLIGATORIO

Entregar una tabla:

| Módulo | Casos nuevos ejecutados | Aprobados | Fallidos | Bloqueados | Aserciones |
|---|---|---|---|---|---|
| Matrículas | Real | Real | Real | Real | Real |
| Aula Virtual | Real | Real | Real | Real | Real |
| Evaluaciones | Real | Real | Real | Real | Real |
| Asistencia | Real | Real | Real | Real | Real |
| Comunicaciones | Real | Real | Real | Real | Real |
| Regresión transversal | Real | Real | Real | Real | Real |

Informar:

- Total de casos Pest distintos aprobados.
- Total de aserciones acreditadas.
- Casos pendientes.
- Defectos funcionales detectados.
- Defectos de infraestructura.
- Casos bloqueados por autorización.
- Rollbacks verificados.
- Estado de las 52 tablas.
- Estado de las 14 migraciones.
- Resultado de TLS e identidad.
- Estado de las bases protegidas.
- Archivos modificados.
- Estado de Git.
- Estado de preparación de Cypress.
- Trabajo restante para cerrar el macroproceso misional.

Clasificar cada módulo como:

**A. VALIDACIÓN APROBADA EN EL ALCANCE EJECUTADO.**

**B. VALIDACIÓN PARCIAL CON CASOS PENDIENTES.**

**C. INCIDENCIAS FUNCIONALES DETECTADAS.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

No declarar completado todo un módulo si existen escenarios críticos sin ejecutar.

## 17. CRITERIO DE FINALIZACIÓN

Continúa ejecutando los módulos en el orden establecido hasta alcanzar uno de estos puntos:

1. Todos los casos compatibles y autorizados están ejecutados y documentados.
2. Se identifica un bloqueo global de seguridad o integridad.
3. Aparece una incidencia que impide continuar de forma segura.
4. Se necesita una autorización adicional para las operaciones restantes.
5. Se interrumpe la sesión o se alcanza el límite de ejecución disponible.

En los casos 4 y 5, conservar un checkpoint con la lista exacta de pruebas acreditadas y el próximo trabajo, sin inventar resultados.

**OBJETIVO FINAL: terminar la mayor parte posible de la validación misional de EcoAula SaaS en una sola intervención continua, sin generar un prompt independiente para cada módulo y sin comprometer la seguridad del sistema.**

---

## Continuación recibida tras límite de uso

# CONTINUACIÓN DEL PROMPT MAESTRO 36 — RECUPERACIÓN DESPUÉS DEL LÍMITE DE USO

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4, MySQL 8.4, Pest, QA y seguridad multiinstitucional.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## INSTRUCCIÓN PRINCIPAL

**Continúa exactamente desde el último checkpoint verificable del Prompt Maestro 36.**

La ejecución anterior fue interrumpida porque Codex alcanzó su límite de uso. No se ha confirmado un fallo funcional del sistema.

No comiences desde cero.

No descartes cambios.

No repitas innecesariamente pruebas aprobadas.

No reinicies el proyecto.

No ejecutes operaciones sobre bases protegidas.

Quiero que continúes automáticamente con los cinco módulos misionales y la regresión autorizada, respetando los controles de seguridad existentes.

## 1. ESTADO ANTES DE LA INTERRUPCIÓN

El Prompt 35 finalizó con:

- 124 casos Pest distintos aprobados acumulados.
- 765 aserciones acreditadas.
- 190 casos pendientes.
- Dos casos de Matrículas excluidos por DELETE/forceDelete.

Durante el Prompt Maestro 36:

- Se preparó un primer lote de 39 casos.
- 19 pertenecen a Aula Virtual y cursos.
- 5 pertenecen a evaluaciones.
- 9 pertenecen a asistencia.
- 6 pertenecen a solicitudes y notificaciones.
- Los 39 filtros seleccionaron correctamente sus casos.
- El preflight de seguridad aprobó.
- El primer grupo de cuatro casos aprobó y generó checkpoint.
- Posteriormente se reportaron seis casos de Aula Virtual aprobados.
- Se identificaron 113 candidatos de regresión transversal todavía no ejecutados.
- Se corrigió un filtro privado que no seleccionaba correctamente el dataset `auth/me`.
- La comprobación completa de los 113 filtros quedó interrumpida.
- Codex alcanzó su límite de uso antes de emitir el informe final.

Entre los archivos creados o modificados se encuentran:

- `.tools/misional-isolated/evidence/Build36.php`
- `.tools/misional-isolated/evidence/Build36R.php`
- `.tools/misional-isolated/evidence/Checkpoint36.php`
- Los documentos maestros y los registros privados del Prompt 36.

**Estos datos son el último estado reportado, no una autorización para asumir que todos los procesos terminaron limpiamente.**

## 2. FASE A — RECUPERAR EL ESTADO REAL

Antes de ejecutar cualquier caso:

1. Comprobar rama y `git status`.
2. Inspeccionar todos los archivos modificados durante el Prompt 36.
3. Leer las evidencias y checkpoints conservados.
4. Revisar `.tools/misional-isolated/evidence/prompt36/`.
5. Identificar los seis casos que se reportaron aprobados.
6. Comprobar que cada resultado tenga evidencia JUnit válida.
7. Confirmar cuáles están contabilizados por primera vez.
8. Identificar los casos iniciados pero sin resultado definitivo.
9. Revisar procesos PHP, PowerShell y MySQL que puedan continuar activos.
10. Comprobar que no exista otro supervisor ejecutando las mismas pruebas.

No lanzar dos supervisores concurrentes.

No detener procesos desconocidos.

Si una ejecución anterior continúa activa, evaluar su estado y evitar duplicarla.

Si existen procesos huérfanos, seguir el procedimiento seguro documentado para recuperarlos, sin afectar los servicios de demostración.

## 3. FASE B — VERIFICACIÓN DE MYSQL Y SEGURIDAD

Confirmar:

- Host `127.0.0.1`.
- Puerto `3308`.
- Base exclusiva `zarate_pest`.
- Cuenta exclusiva de pruebas.
- TLS válido.
- Identidad efectiva de MySQL.
- Directorio físico autorizado.
- 14 migraciones.
- 52 tablas.
- Cero residuos persistentes.
- Guardas positivas y negativas funcionales.

Mantener protegidas:

- `zarate_dev`.
- `zarate_test`.
- Los servicios de demostración de puertos 3307, 8000 y 5173.

Mantener el plazo de autorización de 120 segundos.

Revalidar el verificador nativo optimizado del Prompt 32, comprobando compatibilidad con el Windows x64 actual.

Si falla una comprobación crítica, detener la ejecución.

## 4. FASE C — CONTINUAR LOS 39 CASOS DEL PRIMER LOTE

Recuperar la lista original de 39 casos.

Conservar los seis casos aprobados si sus evidencias son válidas.

No volver a ejecutarlos salvo necesidad justificada de regresión.

Continuar con los restantes en el orden originalmente autorizado:

1. Aula Virtual y cursos.
2. Evaluaciones y calificaciones.
3. Asistencia y justificaciones.
4. Solicitudes y notificaciones.

Ejecutar únicamente casos cuya revisión de seguridad haya aprobado.

Para cada caso:

- Verificar identidad de conexión.
- Verificar autorización vigente.
- Confirmar selección exacta.
- Preparar fixtures autorizados.
- Ejecutar Pest.
- Conservar resultado JUnit.
- Registrar aserciones.
- Verificar rollback.
- Confirmar cero residuos.
- Comprobar integridad del esquema.
- Registrar duración y margen de autorización.

Continuar automáticamente al módulo siguiente cuando sea seguro.

Si un caso presenta un error funcional, documentarlo sin ocultarlo.

Si ocurre una incidencia de seguridad o integridad, detener la ejecución.

## 5. FASE D — CASOS BLOQUEADOS

Mantener excluidos los casos que ejecuten operaciones no autorizadas.

El análisis anterior encontró:

- `delete()` y `forceDelete()` en dos casos de Matrículas.
- DELETE indirecto al gestionar destinatarios de comunicados.
- DELETE al revocar permisos.
- DELETE de tokens al cambiar contraseñas.
- Sincronizaciones destructivas al modificar roles o permisos.
- Casos que requieren subida, sustitución o descarga de archivos.

No habilitar estas operaciones automáticamente.

Para `Storage::fake()`, comprobar la raíz privada aislada, su estado inicial y los posibles efectos externos. No asumir que rollback SQL limpia archivos.

Si un caso no puede ejecutarse de manera segura, registrarlo como pendiente y continuar con otros casos independientes autorizados.

## 6. FASE E — REGRESIÓN TRANSVERSAL

Se prepararon 113 candidatos de regresión, pero todavía no se validó completamente su selección.

Antes de ejecutarlos:

1. Recuperar el inventario original.
2. Completar la comprobación de los 113 filtros.
3. Confirmar que cada filtro selecciona exactamente el caso previsto.
4. Eliminar duplicidades respecto a los casos ya acreditados.
5. Revisar los hooks, fixtures y operaciones de cada caso.
6. Clasificar los casos seguros y bloqueados.
7. Conservar la exclusión de DELETE, DDL, seeders demo y efectos externos no verificados.
8. Verificar la autorización y el aislamiento.

Solo cuando los módulos del primer lote tengan un cierre verificable, continuar con los candidatos seguros de regresión.

No considerar los 113 candidatos como automáticamente autorizados.

Ejecutar por grupos moderados, secuencialmente y con checkpoints.

## 7. CHECKPOINTS OBLIGATORIOS

Al finalizar cada módulo:

1. Guardar los casos ejecutados.
2. Guardar los casos aprobados.
3. Registrar fallidos y bloqueados.
4. Registrar las aserciones.
5. Confirmar rollbacks.
6. Verificar cero residuos.
7. Confirmar el esquema.
8. Guardar el último caso completado.
9. Identificar el siguiente caso pendiente.
10. Actualizar el informe maestro.

Si vuelve a interrumpirse la sesión, el siguiente agente debe poder continuar sin repetir innecesariamente los casos anteriores.

## 8. RESTRICCIONES

No ejecutar:

- DELETE no autorizado.
- DROP.
- TRUNCATE.
- DDL.
- Migraciones destructivas.
- Seeders de demostración.
- Operaciones externas no aisladas.
- Pest en paralelo.
- Cypress sobre la base de demostración.

No modificar:

- `zarate_dev`.
- `zarate_test`.
- Las migraciones originales.
- Credenciales y privilegios existentes.
- Guardas de seguridad.
- Configuración global de Windows.
- Código funcional para ocultar fallos.

No utilizar `git reset --hard` ni `git clean`.

No realizar commits ni push automáticamente.

No publicar secretos ni archivos privados.

## 9. DOCUMENTACIÓN AI-DLC

Continuar actualizando:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-36-validacion-integral-misional.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validacion-integral-misional.md`

Incluir secciones diferenciadas para:

- Matrículas.
- Aula Virtual.
- Evaluaciones.
- Asistencia.
- Comunicaciones.
- Regresión transversal.
- Seguridad.
- Incidencias.
- Casos pendientes.
- Preparación de Cypress.

No sobrescribir el historial anterior.

Registrar explícitamente que la ejecución fue reanudada después del límite de uso de Codex.

## 10. INFORME FINAL

Entregar una tabla:

| Módulo | Casos nuevos | Aprobados | Fallidos | Bloqueados | Aserciones |
|---|---|---|---|---|---|
| Matrículas | Real | Real | Real | Real | Real |
| Aula Virtual | Real | Real | Real | Real | Real |
| Evaluaciones | Real | Real | Real | Real | Real |
| Asistencia | Real | Real | Real | Real | Real |
| Comunicaciones | Real | Real | Real | Real | Real |
| Regresión transversal | Real | Real | Real | Real | Real |

Informar además:

1. Resultados recuperados después de la interrupción.
2. Casos nuevos aprobados en esta continuación.
3. Total acumulado de casos distintos aprobados.
4. Total de aserciones acreditadas.
5. Casos pendientes.
6. Rollbacks verificados.
7. Estado de las 52 tablas y 14 migraciones.
8. Resultado de seguridad y TLS.
9. Casos bloqueados por operaciones no autorizadas.
10. Defectos funcionales detectados.
11. Estado de preparación de Cypress.
12. Archivos modificados y estado de Git.
13. Siguiente caso exacto para una eventual reanudación.

## 11. CRITERIO DE CIERRE

Continúa automáticamente hasta:

- Terminar los casos compatibles y autorizados de los módulos.
- Terminar la regresión transversal segura.
- Encontrar un bloqueo global de seguridad.
- Detectar una incidencia que impida continuar.
- Requerir autorización adicional.
- Alcanzar el límite disponible de la sesión.

En cualquier interrupción, conservar un checkpoint verificable.

**OBJETIVO: reanudar y completar la mayor parte posible del Prompt Maestro 36, aprovechando los resultados anteriores sin repetir tareas ni comprometer las bases protegidas.**

---

## Anexo: Prompt 37 de recuperación y cierre

# PROMPT 37 — RECUPERACIÓN POR SUSPENSIÓN Y CIERRE DE REGRESIÓN PEST MISIONAL

Actúa como ingeniero senior de QA especializado en Laravel 13, MySQL 8.4, Pest, Windows y seguridad de bases de datos.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## OBJETIVO PRINCIPAL

Continuar desde el último checkpoint verificable del Prompt Maestro 36 y completar la mayor cantidad posible de pruebas Pest pendientes que sean compatibles con el entorno autorizado.

**No comenzar desde cero. No repetir las 201 pruebas aprobadas. No iniciar nuevamente los supervisores anteriores desde el principio.**

## 1. ESTADO CONFIRMADO

El Prompt Maestro 36 reportó:

- 314 casos Pest inventariados.
- 201 casos distintos aprobados.
- 1404 aserciones acreditadas.
- 113 casos pendientes.
- 75 pendientes por entorno.
- 38 bloqueados por operaciones o contratos no admitidos.
- 77 nuevos casos aprobados durante el Prompt 36.
- 77 rollbacks completamente verificados.
- Dos errores históricos de infraestructura: uno recuperado y otro pendiente.
- Cero fallos de aserción.
- 52 tablas y 14 migraciones conservadas.
- TLS e identidad MySQL verificados.
- Cero residuos persistentes.

La ejecución se interrumpió por una suspensión de Windows que provocó la expiración de la guarda de 120 segundos.

El siguiente caso exacto es:

- Identificador: `R36-039`.
- Archivo: `Sprint1Test`.
- Prueba: `denies non administrators protected resources`.
- Dataset: `('STUDENT')`.

Checkpoint principal:

`.tools/misional-isolated/evidence/prompt36/checkpoint-terminal-0201-complemento.json`

## 2. FASE A — RECUPERACIÓN

Antes de ejecutar:

1. Comprobar rama y estado de Git.
2. Leer el checkpoint anterior.
3. Revisar las evidencias del Prompt 36.
4. Confirmar los 201 casos acreditados mediante registros reales.
5. Identificar el estado del caso R36-039.
6. Comprobar que no existan supervisores anteriores activos.
7. Verificar el estado de PHP, MySQL y los procesos auxiliares.
8. Determinar si Windows volvió a suspenderse desde el último intento.
9. Revisar, en modo lectura, los eventos de suspensión y reanudación disponibles en Windows.
10. Preservar todos los archivos y checkpoints existentes.

No modificar automáticamente las opciones de energía del sistema.

No cerrar procesos desconocidos ni descartar cambios de Git.

## 3. FASE B — VERIFICACIÓN DE SEGURIDAD

Antes de cualquier escritura comprobar:

- MySQL aislado en `127.0.0.1:3308`.
- Base exclusiva `zarate_pest`.
- Cuenta de pruebas autorizada.
- TLS obligatorio.
- Identidad efectiva del servidor.
- Directorio físico autorizado.
- 52 tablas.
- 14 migraciones.
- Cero residuos.
- Guarda activa de 120 segundos.
- Compatibilidad del verificador nativo del Prompt 32.

Confirmar las denegaciones de acceso a `zarate_dev` y `zarate_test`.

No reutilizar autorizaciones vencidas.

Si se detecta una nueva suspensión, un proceso desconocido o una inconsistencia de seguridad, detenerse antes de ejecutar pruebas.

## 4. FASE C — REANUDAR DESDE R36-039

Una vez aprobado el preflight:

1. Recuperar la selección exacta de R36-039.
2. Comprobar que no tiene un resultado exitoso definitivo.
3. Verificar que su ejecución anterior quedó completamente revertida.
4. Ejecutar únicamente ese caso, si es compatible con las restricciones actuales.
5. Registrar resultado JUnit y aserciones.
6. Comprobar rollback.
7. Verificar cero residuos.
8. Confirmar integridad del esquema.
9. Registrar un checkpoint nuevo.

Si aprueba, continuar con los siguientes casos pendientes.

No repetir las 201 pruebas acreditadas ni los casos ya finalizados durante el Prompt 36.

## 5. FASE D — COMPLETAR LA REGRESIÓN AUTORIZADA

Recuperar el inventario de los 75 casos pendientes por entorno.

Revisar cuáles son realmente compatibles con el launcher existente.

Continuar automáticamente con los casos seguros, manteniendo el orden original de la regresión.

Trabajar en lotes controlados, secuenciales y con un checkpoint al finalizar cada grupo.

Para cada caso:

- Verificar autorización vigente.
- Confirmar destino MySQL.
- Ejecutar Pest.
- Registrar aserciones.
- Verificar rollback.
- Comprobar cero residuos.
- Registrar duración.
- Guardar evidencia JUnit.
- Actualizar el inventario de pendientes.

Si un caso falla por motivos funcionales, conservar el defecto y sus evidencias.

Si un caso falla por entorno, diagnosticarlo y no reintentarlo indefinidamente.

Si vuelve a producirse una suspensión del equipo, detener la ejecución, inspeccionar las transacciones y conservar el último checkpoint seguro.

## 6. FASE E — REVISAR LOS 38 CASOS BLOQUEADOS

No ejecutarlos automáticamente.

Preparar una clasificación final por causa:

- DELETE o forceDelete.
- Sincronización destructiva de permisos o relaciones.
- Operaciones sobre archivos.
- Seeders de demostración.
- Conexiones externas.
- Otros efectos no autorizados.

Para cada grupo, indicar qué preparación o autorización específica sería necesaria para ejecutarlo de forma segura.

No modificar permisos MySQL ni código funcional para desbloquear artificialmente las pruebas.

## 7. FASE F — CIERRE PEST

Cuando terminen los casos compatibles:

1. Consolidar resultados reales.
2. Eliminar duplicidades de conteo.
3. Registrar aserciones de los casos distintos aprobados.
4. Confirmar que todos los rollbacks necesarios fueron verificados.
5. Comprobar cero residuos persistentes.
6. Verificar las 52 tablas y 14 migraciones.
7. Confirmar TLS, identidad y aislamiento.
8. Registrar defectos funcionales y de infraestructura.
9. Identificar los casos todavía bloqueados.
10. Determinar si puede cerrarse la validación Pest en el alcance ejecutado.

No declarar aprobada la suite completa si todavía existen pruebas sin ejecutar.

## 8. RESTRICCIONES

No modificar:

- `zarate_dev`.
- `zarate_test`.
- Migraciones originales.
- Credenciales existentes.
- Privilegios MySQL.
- Configuraciones globales de Windows.
- Código funcional sin autorización.

No ejecutar operaciones DELETE, DROP, TRUNCATE o DDL no autorizadas.

No ejecutar seeders de demostración.

No desactivar TLS ni guardas.

No aumentar el límite de 120 segundos.

No ejecutar Pest en paralelo.

No ejecutar Cypress todavía.

No realizar commits ni push automáticamente.

No publicar secretos.

## 9. DOCUMENTACIÓN AI-DLC

Actualizar por anexos:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-36-validacion-integral-misional.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-validacion-integral-misional.md`

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-37-cierre-regresion-pest.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-regresion-pest.md`

Mantener los registros y checkpoints privados dentro de `.tools/misional-isolated/evidence/`.

Registrar qué casos fueron nuevos, cuáles se recuperaron después de la suspensión y cuáles siguen bloqueados.

## 10. INFORME FINAL

Entregar:

| Indicador | Resultado real |
|---|---|
| Casos distintos aprobados | Total |
| Aserciones acreditadas | Total |
| Nuevos casos aprobados | Total |
| Fallos funcionales | Total |
| Errores de infraestructura | Total |
| Casos pendientes por entorno | Total |
| Casos bloqueados por operaciones | Total |
| Rollbacks verificados | Total |
| Tablas y migraciones | Estado |
| TLS y aislamiento | Resultado |

Indicar también:

1. Resultado final del caso R36-039.
2. Cantidad de pruebas recuperadas.
3. Casos que siguen pendientes.
4. Motivos concretos de los bloqueos.
5. Evidencias generadas.
6. Estado de Git.
7. Recomendación para preparar Cypress.
8. Si es necesario solicitar alguna autorización adicional.

Clasificar el resultado como:

**A. REGRESIÓN PEST AUTORIZADA COMPLETADA.**

**B. REGRESIÓN PEST PARCIAL — CASOS PENDIENTES.**

**C. INCIDENCIAS FUNCIONALES DETECTADAS.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

No declarar éxito sin resultados JUnit verificables.

**Objetivo final: terminar los casos Pest seguros pendientes desde el checkpoint actual, evitando repeticiones y manteniendo íntegramente protegidas las bases de EcoAula SaaS.**

## Anexo de cierre Prompt 37 — 07/11/2026

Estado D: BLOQUEADO POR SEGURIDAD O ENTORNO. Los 201 JUnit y 1.404 aserciones anteriores se verificaron sin repetir casos. Dos nuevas suspensiones detuvieron el preflight antes del arranque de MySQL: cero casos Pest nuevos, cero transacciones y cero recuperaciones. Se conserva R36-039 como siguiente caso, ERROR histórico pendiente, junto a 74 casos seguros sin ejecutar y 38 bloqueados por operaciones/contratos. El supervisor propio fue identificado y detenido sin afectar procesos ajenos. No se revalidaron SQL/TLS en vivo; la última evidencia anterior de 52 tablas, 14 migraciones y limpieza permanece histórica. No se ejecutó Cypress.

Detalle: [evidencias-cierre-regresion-pest.md](evidencias-cierre-regresion-pest.md). Registros privados: prompt37/new-power-incident.json, controlled-preflight-stop.json y summary37-blocked.json. No se declara la regresión completa ni la suite de 314 aprobada.

## Verificación tras recuperar Internet — 07/11/2026, 10:11 (-05)

Se comprobó nuevamente la rama `test/integracion-misional`, conservando el estado de Git. La lectura de eventos de Windows detectó dos suspensiones adicionales: SleepTime `2026-11-07T13:31:35.1567857Z` / WakeTime `2026-11-07T14:40:16.5845093Z`, y SleepTime `2026-11-07T14:45:32.5282135Z` / WakeTime `2026-11-07T15:08:03.6535746Z`. Las reanudaciones corresponden aproximadamente a 09:40 y 10:08 de Lima.

Conforme a la condición de parada del Prompt 37, no se inició ningún supervisor, servicio MySQL ni caso Pest. Se verificó ausencia de procesos MySQL/PHP, listeners en 3308/3307/8000/5173 y archivo PID. La lectura de eventos no presentó errores. La recuperación de Internet no demuestra continuidad del equipo ni valida por sí sola las guardas.

El resultado se mantiene D, BLOQUEADO POR ENTORNO: 201 casos aprobados, 1.404 aserciones acreditadas, cero casos nuevos ejecutados, 75 pendientes por entorno y 38 por operaciones/contratos. R36-039 sigue siendo el siguiente caso. No se revalidó SQL/TLS en vivo, no se ejecutó Cypress y no se alteraron opciones de energía ni archivos funcionales.

Evidencia privada nueva: `prompt37/reconnection-readonly.json` y `prompt37/reconnection-power-details.json`. Los registros de bloqueos anteriores permanecen intactos.
## Anexo final de reanudación Prompt 37 — 07/11/2026

Estado A: REGRESIÓN PEST AUTORIZADA COMPLETADA, limitada a los 75 casos compatibles autorizados. Se ejecutaron 75/75, todos aprobados, con 320 aserciones nuevas, cero fallos y cero errores nuevos; 75 rollbacks y limpiezas completos. Acumulado: 276 casos distintos / 1.724 aserciones, sin duplicados; cero pendientes por entorno y 38 bloqueados por operaciones/contratos que no se ejecutaron. La suite completa de 314 no está aprobada.

R36-039 fue recuperado primero, con 6 aserciones y checkpoint, sin repetir los 201 acreditados. Los dos errores históricos siguen registrados con sus recuperaciones y limitaciones originales. MySQL real aislado y TLS estricto verificados: 52 tablas, 14 migraciones, cero residuos, bases protegidas con denegación comprobada. Servidor apagado con código 0; sin procesos, conexiones ni archivo PID al cierre; sin suspensiones nuevas durante la reanudación.

Evidencia privada: prompt37r/consolidated-final.json, approved-junit-cumulative.json, summary37r.json, checkpoint-0075.json, run/result.json y final-process-power.json. Detalle completo: [evidencias-cierre-regresion-pest.md](evidencias-cierre-regresion-pest.md). Se recomienda preparar Cypress en entorno HTTP aislado; no se ejecutó Cypress ni se autorizan automáticamente sus fixtures u operaciones. Sin commits ni push.