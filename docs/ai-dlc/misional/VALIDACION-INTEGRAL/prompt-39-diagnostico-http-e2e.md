# PROMPT 39 — DIAGNÓSTICO CYPRESS Y PREPARACIÓN DEL ENTORNO E2E REAL

Actúa como ingeniero senior de QA, Laravel 13, React 19, TypeScript, Cypress, MySQL 8.4, seguridad de aplicaciones SaaS y automatización de pruebas.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## OBJETIVO GENERAL

Continuar desde el Prompt 38 y preparar la validación E2E real de EcoAula SaaS sin perder ni repetir los resultados acreditados.

Prioridades:

1. Diagnosticar el caso HTTP real fallido.
2. Verificar la comunicación entre React y Laravel.
3. Diseñar una infraestructura SQL exclusiva y descartable para Cypress.
4. Revisar los 46 casos Cypress no ejecutados.
5. Preparar una estrategia de ejecución real, sin simulaciones.
6. Conservar evidencias AI-DLC y preparar el cierre del proyecto.

**No crear ni alterar bases de datos nuevas sin autorización expresa.**

## 1. ESTADO CONFIRMADO

Pest:

- 314 casos inventariados.
- 276 distintos aprobados.
- 1.724 aserciones acreditadas.
- 38 bloqueados.
- Sin fallos de aserción en las pruebas autorizadas.

Cypress:

- 188 casos inventariados.
- 142 ejecutados.
- 141 aprobados con API simulada.
- 1 fallo en la comprobación HTTP real de salud.
- 46 casos no ejecutados por restricciones.
- Ninguna integración React–Laravel–MySQL real acreditada.

Los servicios privados de Cypress quedaron detenidos.

Las bases existentes no fueron modificadas.

No hay cambios funcionales, commits ni push.

## 2. FASE A — RECUPERACIÓN

Antes de realizar operaciones:

1. Verificar rama y estado de Git.
2. Leer las evidencias de los Prompts 37 y 38.
3. Recuperar los reportes Cypress originales.
4. Confirmar los 141 casos aprobados.
5. Identificar exactamente el caso HTTP fallido.
6. Recuperar el mensaje completo del fallo.
7. Examinar la captura y los logs.
8. Revisar los scripts de ejecución.
9. Comprobar que no existen procesos anteriores abandonados.
10. Preservar todas las evidencias.

No repetir los 141 casos sin justificación.

## 3. FASE B — INVESTIGAR EL FALLO HTTP

Inspeccionar exactamente cómo se solicita `/api/health`.

Identificar si el caso utiliza:

- `cy.request()`.
- `cy.intercept()`.
- `cy.wait()`.
- `fetch()`.
- Un comando personalizado.
- Una llamada HTTP del navegador.

Comprobar las propiedades realmente disponibles de la respuesta.

En Cypress:

- `cy.request()` expone normalmente `response.status`.
- `cy.wait('@alias')` sobre una intercepción permite consultar `response.statusCode`.

Determinar si existe una confusión entre ambos contratos.

Examinar también:

- URL y puerto.
- Endpoint efectivo.
- Respuesta HTTP.
- Código de estado.
- Redirecciones.
- CORS.
- Ausencia de respuesta.
- Tiempo de espera.
- Intercepción incorrecta.
- Orden de registro del interceptor.
- Condición de carrera.

No asumir que el problema es de sincronización sin evidencia.

No modificar una aserción para convertir artificialmente un fallo en éxito.

Si existe una incompatibilidad demostrada entre la propiedad utilizada y el tipo de respuesta de Cypress, documentar la corrección mínima necesaria, conservando la intención de exigir HTTP 200. Presentar el cambio propuesto antes de modificar la prueba original.

## 4. FASE C — VALIDACIÓN HTTP REAL SIN ESCRITURAS

Diseñar y, si el aislamiento es verificable, ejecutar un conjunto mínimo de pruebas HTTP reales de solo lectura.

Comprobar:

1. Identidad y puerto del servidor Laravel de pruebas.
2. Ruta `/api/health`.
3. Respuesta HTTP esperada.
4. Estructura JSON real.
5. Identidad y puerto del servidor React/Vite de pruebas.
6. Accesibilidad del frontend aislado.
7. Comunicación hacia la API autorizada.
8. Ausencia de conexiones hacia la demostración.
9. Ausencia de escrituras SQL.
10. Detención segura de procesos privados.

Si el endpoint de salud accede a la base de datos, verificar ese acceso previamente y no asumir que es una prueba sin efectos.

Separar claramente:

- Pruebas de HTTP real.
- Pruebas de interfaz con mocks.
- Pruebas E2E con MySQL real.

No considerar equivalentes estas categorías.

## 5. FASE D — DISEÑO DE MYSQL EXCLUSIVO PARA CYPRESS

Analizar cómo crear una infraestructura descartable para pruebas E2E.

No utilizar automáticamente:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.

Proponer una base exclusiva, por ejemplo `zarate_cypress_e2e`, solamente como nombre candidato.

Determinar:

- Servidor o instancia aislada.
- Puerto libre.
- Directorio de datos exclusivo.
- Cuenta de permisos mínimos.
- TLS.
- Variables Laravel.
- Variables React.
- Configuración Sanctum.
- Fixtures sintéticos.
- Mecanismo de preparación de datos.
- Migraciones necesarias.
- Mecanismo de restauración entre casos.
- Limpieza de sesiones y tokens.
- Auditoría.
- Manejo de archivos.
- Manejo de colas y notificaciones.
- Protección frente a conexiones incorrectas.
- Recuperación después de un cierre inesperado.

Los flujos Cypress con peticiones HTTP no pueden depender únicamente del rollback de una transacción abierta por el proceso Cypress.

Proponer una estrategia segura y reproducible para preparar y restaurar el estado de cada prueba.

No crear la base, ejecutar migraciones, seeders ni operaciones destructivas durante este prompt.

## 6. FASE E — REVISAR LOS 46 CASOS NO EJECUTADOS

Clasificar:

- Autenticación: 9.
- Matrículas: 6.
- Aula Virtual: 12.
- Asistencia: 3.
- Comunicaciones: 3.
- Transversal: 13.

Comprobar cuáles requieren:

- Datos persistentes.
- Autenticación real.
- Escrituras HTTP.
- DELETE.
- Gestión de archivos.
- Simulación de servicios externos.
- Limpieza de datos.
- Permisos especiales.
- Actualización de estados.
- Datos de varias instituciones.

No ejecutar automáticamente esos casos.

Preparar una matriz de requisitos de infraestructura y autorizaciones.

Indicar cuáles son prioritarios para una demostración académica de EcoAula SaaS.

## 7. FASE F — PLAN DE EJECUCIÓN E2E

Diseñar una futura ejecución secuencial por etapas:

1. Salud HTTP.
2. Inicio y cierre de sesión.
3. Rutas protegidas.
4. Permisos por rol.
5. Gestión de Matrículas.
6. Aula Virtual.
7. Evaluaciones.
8. Asistencia.
9. Comunicaciones.
10. Regresión transversal.

Para cada módulo indicar:

- Pruebas existentes.
- Precondiciones.
- Fixtures necesarios.
- Operaciones de escritura.
- Estrategia de limpieza.
- Riesgos de seguridad.
- Resultado esperado.
- Evidencias necesarias.

El objetivo posterior será validar React + Laravel + MySQL reales, sin utilizar datos de demostración.

## 8. RESTRICCIONES

No modificar:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.
- Migraciones originales.
- Credenciales actuales.
- Privilegios existentes.
- Código funcional sin autorización.
- Aserciones originales sin diagnóstico y aprobación.
- Configuración global de Windows.

No realizar:

- DELETE, DROP o TRUNCATE no autorizados.
- Migraciones sobre bases existentes.
- Seeders de demostración.
- Ejecuciones paralelas no aisladas.
- Commits ni push.

Mantener archivos privados fuera de Git.

## 9. DOCUMENTACIÓN

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-39-diagnostico-http-e2e.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-diagnostico-http-e2e.md`

Incluir:

- Resultado del diagnóstico HTTP.
- Causa demostrada o hipótesis pendientes.
- Pruebas HTTP reales efectuadas.
- Estado de los 141 casos simulados.
- Inventario de los 46 casos excluidos.
- Arquitectura E2E propuesta.
- Privilegios y operaciones requeridas.
- Estrategia de limpieza.
- Riesgos.
- Plan de habilitación.
- Autorizaciones necesarias.
- Estado Git.
- Próximas acciones.

## 10. INFORME FINAL

Responder:

1. ¿Por qué falló exactamente el caso HTTP?
2. ¿Se corrigió algún problema de infraestructura?
3. ¿Cuántas pruebas HTTP reales aprobaron?
4. ¿Se confirmó una comunicación real React–Laravel?
5. ¿Se validó alguna conexión real con MySQL?
6. ¿Qué falta para ejecutar Cypress E2E completo?
7. ¿Cuáles son los riesgos y privilegios necesarios?
8. ¿Qué casos requieren una base descartable?
9. ¿Qué autorización concreta debe dar el usuario?
10. ¿Cuál será el siguiente paso para cerrar la validación?

Clasificar:

**A. HTTP REAL VALIDADO — E2E SQL PREPARADO PARA AUTORIZACIÓN.**

**B. HTTP REAL PARCIAL — INCIDENCIAS PENDIENTES.**

**C. PLAN DE AISLAMIENTO LISTO — SIN EJECUCIÓN E2E.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

No declarar completada una integración que no se haya ejecutado.

**OBJETIVO FINAL: identificar y resolver técnicamente el bloqueo HTTP cuando sea posible sin alterar aserciones, y dejar preparada una infraestructura E2E real, descartable, segura y lista para solicitar autorización.**

---

## Continuación recibida: cierre del diagnóstico HTTP y plan E2E

# CONTINUACIÓN DEL PROMPT 39 — CIERRE DEL DIAGNÓSTICO HTTP Y PLAN E2E

Actúa como ingeniero senior especializado en React 19, Cypress, Laravel 13, MySQL 8.4 y pruebas de integración.

Proyecto: `D:\zarate-saas`

Rama: `test/integracion-misional`.

## OBJETIVO

Recuperar el trabajo del Prompt 39 interrumpido por el límite de Codex, completar el diagnóstico de la solicitud cancelada y cerrar el diseño del entorno E2E con MySQL real.

No comenzar desde cero ni repetir las pruebas acreditadas.

## 1. RESULTADOS PREVIOS

El Prompt 39 encontró:

- Primera solicitud `fetch`: cancelada a los 7 ms con `AbortError`.
- Segunda solicitud: HTTP 200 con JSON correcto.
- Tres pruebas HTTP reales nuevas aprobadas.
- La prueba Cypress original continúa fallando.
- No se modificaron sus aserciones.
- SQL estuvo bloqueado.
- Los 141 casos Cypress simulados conservan sus resultados.
- Pest conserva 276 casos aprobados y 1.724 aserciones.
- No se ejecutó ninguna integración E2E con MySQL real.

Se preparó instrumental privado en `.tools/misional-isolated/evidence/prompt39/`.

## 2. RECUPERACIÓN

Primero:

1. Revisar el estado de Git.
2. Inspeccionar los cambios anteriores.
3. Recuperar las trazas del `AbortError`.
4. Confirmar los resultados de las tres pruebas HTTP.
5. Verificar si los procesos privados anteriores permanecen detenidos.
6. Comprobar que no existan escrituras SQL ni residuos.
7. Conservar todos los reportes y capturas.
8. Confirmar que el código funcional permanece sin cambios.

No repetir las pruebas que ya tienen evidencia suficiente.

## 3. INVESTIGAR EL ORIGEN EXACTO DEL ABORT

Inspeccionar el frontend React y el caso Cypress original.

Verificar:

- Uso de React `StrictMode`.
- Efectos ejecutados al montar el componente.
- Limpieza de `useEffect`.
- `AbortController`.
- Cambios de dependencias.
- Desmontaje del componente.
- Navegación o redirecciones.
- Registro y orden del interceptor Cypress.
- Primera y segunda solicitud al endpoint.
- Momento exacto del `cy.wait()`.
- Existencia o ausencia de respuesta en la intercepción.

Determinar si el `AbortError` es consecuencia de un ciclo legítimo de limpieza o de un defecto de comportamiento.

No desactivar `StrictMode` para conseguir que el test apruebe.

No añadir esperas arbitrarias como `cy.wait(5000)`.

## 4. PROPONER UNA CORRECCIÓN MÍNIMA

Si se confirma que Cypress espera la primera solicitud cancelada, diseñar una solución que espere y verifique la respuesta válida de una solicitud real posterior.

La solución debe:

1. Conservar la exigencia de HTTP 200.
2. Comprobar el JSON esperado.
3. No utilizar mocks.
4. No aceptar un error de red como éxito.
5. No ocultar cancelaciones inesperadas.
6. Evitar esperas temporales arbitrarias.
7. Ser reproducible en varias ejecuciones.
8. Conservar evidencia de la solicitud realmente validada.

Preparar una variante privada de prueba para comprobar el enfoque sin alterar el archivo original.

Si la variante aprueba de manera estable, presentar el diagnóstico, la evidencia y el cambio mínimo propuesto.

**No modificar todavía la prueba original sin aprobación expresa.**

Si se identifica un defecto funcional real, documentarlo por separado.

## 5. CERRAR EL PLAN E2E CON MYSQL

Completar la propuesta de infraestructura exclusiva para Cypress.

Definir:

- Base de datos descartable.
- Instancia y puerto aislados.
- Directorio físico exclusivo.
- Usuario de privilegios mínimos.
- TLS.
- Backend HTTP exclusivo.
- Frontend React exclusivo.
- Configuración de Sanctum y cookies.
- Fixtures sintéticos.
- Preparación y restauración de datos.
- Gestión de DELETE y operaciones destructivas.
- Aislamiento de archivos.
- Limpieza de tokens y sesiones.
- Procesos y cierre seguro.
- Evidencias de integración.

No crear bases ni usuarios todavía.

No ejecutar migraciones ni seeders.

No modificar `zarate_dev`, `zarate_test` ni `zarate_pest`.

## 6. CASOS CYPRESS PENDIENTES

Completar la clasificación de los 46 casos no ejecutados.

Identificar cuáles pueden ejecutarse con una base E2E exclusiva y cuáles requieren otras adaptaciones.

Separar:

- Casos con datos sintéticos.
- Casos con autenticación real.
- Operaciones con DELETE.
- Operaciones con archivos.
- Casos de solicitudes, matrículas y comunicaciones.
- Casos que necesitan servicios externos.
- Escenarios de solo lectura.

No presentar los 141 casos simulados como validación SQL real.

## 7. DOCUMENTACIÓN

Completar y actualizar:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-39-diagnostico-http-e2e.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-diagnostico-http-e2e.md`

Incluir:

- Causa demostrada del fallo o incertidumbres restantes.
- Traza de la cancelación a los 7 ms.
- Respuesta HTTP 200 posterior.
- Tres pruebas HTTP aprobadas.
- Resultado de la variante privada.
- Propuesta de corrección del test original.
- Plan de infraestructura E2E.
- Clasificación de los 46 casos.
- Autorizaciones necesarias.
- Estado de Git.
- Estado final de procesos y bases.

## 8. INFORME FINAL

Indicar:

1. ¿Qué provocó el `AbortError`?
2. ¿Se comprobó el efecto de `StrictMode`?
3. ¿La lógica funcional del frontend está correcta?
4. ¿Qué cambio mínimo necesita Cypress?
5. ¿La variante privada aprobó?
6. ¿Se conservaron los 141 éxitos simulados?
7. ¿Qué infraestructura necesita el E2E real?
8. ¿Qué operaciones SQL necesitarían autorización?
9. ¿Cuál es el alcance exacto de la autorización solicitada?
10. ¿Qué falta para cerrar Cypress y el proyecto?

No realizar commits ni push.

No modificar pruebas originales ni código funcional sin autorización.

**OBJETIVO FINAL: cerrar el Prompt 39 con un diagnóstico verificable del fallo HTTP y una propuesta segura, concreta y lista para autorizar la integración E2E de React, Laravel y MySQL.**