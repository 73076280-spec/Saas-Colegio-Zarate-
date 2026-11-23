# PROMPT 40 — CIERRE DE CYPRESS HTTP Y PREPARACIÓN DEFINITIVA DE E2E REAL

Actúa como ingeniero senior especializado en React 19, Laravel 13, Cypress, MySQL 8.4, seguridad multiinstitucional y QA.

Proyecto: `D:\zarate-saas`

Rama: `test/integracion-misional`.

## AUTORIZACIÓN LIMITADA

Autorizo exclusivamente la modificación mínima del test Cypress original de salud HTTP, basándose en la variante privada validada en el Prompt 39.

La autorización permite corregir cómo Cypress identifica y espera una respuesta HTTP real completada, conservando la exigencia de HTTP 200 y del JSON esperado.

**No autorizo modificar código funcional de React o Laravel, eliminar aserciones, simular la respuesta HTTP ni modificar bases de datos.**

## 1. CONTEXTO

Estado confirmado:

- Pest: 276/314 aprobados, 1.724 aserciones.
- Cypress: 141 casos aprobados con API simulada.
- Tres pruebas HTTP reales aprobadas.
- Variante privada de corrección HTTP: 3/3 aprobadas.
- 46 casos Cypress pendientes.
- 38 casos Pest bloqueados.

Diagnóstico confirmado:

React StrictMode ejecuta la limpieza de efectos que cancela la primera solicitud `fetch`. Cypress espera esa intercepción sin respuesta; la segunda solicitud termina con HTTP 200 y el JSON correcto.

El test original permanece sin modificar.

## 2. RECUPERACIÓN

Antes de cambiar archivos:

1. Leer las evidencias del Prompt 39.
2. Localizar el test original de salud.
3. Recuperar la variante privada 3/3.
4. Revisar el estado de Git.
5. Confirmar los archivos que se modificarán.
6. Preservar todos los resultados anteriores.
7. Comprobar que no existan procesos de pruebas abandonados.
8. Confirmar que Windows y los servicios están estables.

No repetir los 141 casos simulados ni las 276 pruebas Pest.

## 3. CORRECCIÓN MÍNIMA DEL TEST HTTP

Aplicar únicamente el cambio de sincronización justificado por las trazas.

La corrección debe:

- Conservar una petición HTTP real.
- Exigir HTTP 200.
- Verificar el JSON esperado.
- No utilizar mocks.
- No ocultar errores de servidor.
- No considerar una petición cancelada como respuesta válida.
- Evitar `cy.wait()` con tiempos fijos arbitrarios.
- No desactivar React StrictMode.
- No modificar componentes de producción.
- No alterar el propósito de la prueba original.

Reutilizar el mecanismo validado de la variante privada, siempre que siga siendo compatible con el test original.

Registrar el diff exacto y explicar la modificación.

## 4. VALIDACIÓN DE LA CORRECCIÓN

Una vez aplicado el parche:

1. Ejecutar exclusivamente el test HTTP corregido.
2. Comprobar que utiliza HTTP real.
3. Verificar HTTP 200 y JSON correcto.
4. Ejecutarlo al menos tres veces de forma independiente.
5. Conservar los resultados Cypress.
6. Comprobar que no hay respuestas simuladas.
7. Registrar las cancelaciones legítimas observadas.
8. Verificar que los procesos privados se cierren.
9. Confirmar que no hubo operaciones SQL.
10. Documentar el resultado final.

Si el test sigue siendo inestable, no modificar más aserciones ni ampliar los cambios sin diagnosticar la causa.

## 5. PREPARACIÓN DEL ENTORNO E2E SQL

Completar el plan del Prompt 39 para una instancia MySQL completamente aislada.

Puerto propuesto: `3309`, sujeto a comprobación de disponibilidad.

Base propuesta: `zarate_cypress_e2e`.

Definir específicamente:

- Directorio físico exclusivo.
- Cuenta exclusiva de pruebas.
- Privilegios mínimos necesarios.
- TLS obligatorio.
- Identidad y autorización del proceso.
- Backend Laravel aislado.
- Frontend React aislado.
- Configuración de Sanctum, cookies y CORS.
- Variables de entorno exclusivas.
- Fixtures completamente sintéticos.
- Estrategia de carga inicial y restauración.
- Tratamiento seguro de INSERT, UPDATE y DELETE.
- Aislamiento de almacenamiento y archivos.
- Control de sesiones, auditoría, colas y notificaciones.
- Mecanismo de cierre y recuperación ante suspensión de Windows.
- Evidencias que demostrarán ausencia de afectación a las bases existentes.

No asumir que el rollback Pest puede emplearse directamente para revertir peticiones HTTP Cypress.

**En este prompt no está autorizada la creación de la base, la instalación de una nueva instancia SQL ni la ejecución de DDL o seeders.**

Preparar los scripts privados de instalación y validación, sin ejecutarlos, si resulta seguro hacerlo.

## 6. PREPARAR LOS 46 CASOS CYPRESS

Recuperar su clasificación del Prompt 39.

Identificar cuáles podrán ejecutarse en la futura instancia E2E y cuáles requieren tratamiento específico de archivos, permisos o servicios externos.

Priorizar los flujos completos:

1. Autenticación.
2. Matrículas.
3. Aula Virtual.
4. Evaluaciones.
5. Asistencia.
6. Comunicaciones.
7. Seguridad y aislamiento institucional.

Preparar una secuencia segura de ejecución con checkpoints y limpieza verificable.

No ejecutarlos todavía contra SQL real.

## 7. RESTRICCIONES

No modificar:

- `zarate_dev`.
- `zarate_test`.
- `zarate_pest`.
- Migraciones originales.
- Credenciales y privilegios actuales.
- Componentes funcionales de React.
- Código funcional Laravel.
- Configuraciones globales de Windows.

No ejecutar migraciones, seeders ni operaciones destructivas sobre bases actuales.

No ejecutar Cypress con cuentas o datos de demostración.

No realizar commits ni push automáticamente.

Conservar los documentos y registros anteriores.

## 8. DOCUMENTACIÓN

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-40-cierre-http-preparacion-e2e.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cierre-http-preparacion-e2e.md`

Documentar:

- Cambio exacto del test original.
- Justificación técnica.
- Tres o más ejecuciones de validación.
- Resultados reales.
- Estado de los 141 casos simulados.
- Arquitectura SQL propuesta.
- Matriz de 46 casos.
- Operaciones que requieren autorización.
- Archivos modificados.
- Estado Git.
- Estado final de procesos y bases.
- Próximos pasos.

## 9. INFORME FINAL

Indicar expresamente:

1. ¿El test HTTP original quedó corregido?
2. ¿Cuántas ejecuciones aprobaron?
3. ¿Se conserva la verificación HTTP 200 y JSON?
4. ¿Se modificó algún código funcional?
5. ¿Se realizó alguna operación SQL?
6. ¿Está lista la arquitectura E2E aislada?
7. ¿Cuáles son los 46 casos que podremos ejecutar?
8. ¿Cuáles requieren operaciones adicionales?
9. ¿Qué permisos exactos se necesitarán?
10. ¿Qué autorización concreta debo entregar para iniciar E2E real?

Clasificar el resultado como:

A. TEST HTTP CORREGIDO — ENTORNO E2E PREPARADO PARA AUTORIZACIÓN.

B. TEST HTTP CORREGIDO — PLAN E2E INCOMPLETO.

C. CORRECCIÓN HTTP PENDIENTE.

D. BLOQUEADO POR SEGURIDAD O ENTORNO.

**OBJETIVO FINAL: cerrar el fallo HTTP original con una modificación mínima y comprobada, dejando preparados los 46 casos Cypress para una ejecución posterior con React, Laravel y MySQL reales.**