# PROMPT 26 — VALIDACIÓN INTEGRAL DEL BACKEND CON PEST Y MYSQL AISLADO

Actúa como ingeniero senior de QA, Laravel 13, PHP 8.4, MySQL 8.4 y seguridad de bases de datos.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**No comiences desde cero. Continúa desde el cierre exitoso del Prompt 25.**

## 1. CONTEXTO DEL PROYECTO

EcoAula SaaS es una plataforma de gestión académica y administrativa para el Colegio Zárate.

Tecnologías:

- Laravel 13 y PHP 8.4.
- React 19 y TypeScript.
- MySQL 8.4.
- Laravel Sanctum.
- Spatie Permission.
- Pest para pruebas backend.
- Cypress para pruebas frontend.

El Prompt 25 terminó con:

**MIGRACIONES 14/14 COMPLETADAS Y VERIFICADAS.**

Evidencias:

- 14 migraciones registradas.
- 52 tablas en `zarate_test`.
- 37 pruebas del comparador aprobadas.
- 235 acreditaciones de proceso válidas.
- Aislamiento y TLS verificados.
- Sin escrituras propias en `zarate_dev`.
- MySQL aislado cerrado limpiamente.
- Sin ejecuciones previas de Pest o Cypress en esta fase.

## 2. OBJETIVO

Ejecutar una validación integral del backend utilizando Pest y una base MySQL aislada, comprobando los cinco procesos misionales implementados.

Los cinco bloques funcionales son:

1. Matrículas.
2. Enseñanza-aprendizaje y Aula Virtual.
3. Evaluaciones y calificaciones.
4. Asistencia y justificaciones.
5. Comunicaciones y solicitudes académicas.

También se deben comprobar autenticación, autorización, aislamiento institucional y regresiones de los módulos relacionados.

## 3. FASE A — INSPECCIÓN ANTES DE EJECUTAR

1. Confirmar rama actual y estado de Git.
2. Leer la documentación de los Prompts 23, 24 y 25.
3. Confirmar el esquema de 14 migraciones y 52 tablas sin modificarlo.
4. Identificar los archivos de pruebas Pest existentes.
5. Revisar `phpunit.xml`, configuración de pruebas y variables de entorno.
6. Revisar los traits utilizados por los tests, especialmente `RefreshDatabase`, `DatabaseMigrations` y `DatabaseTransactions`.
7. Identificar pruebas que crean, eliminan o modifican registros.
8. Revisar factories, fixtures y dependencias.
9. Identificar pruebas específicas de los cinco Bolts.
10. Comprobar la existencia de pruebas unitarias que no necesitan base de datos.

No ejecutar automáticamente toda la suite sin analizar sus efectos.

## 4. FASE B — AISLAMIENTO ESTRICTO

Proteger estas bases:

- `zarate_dev`: base de demostración, puerto 3307.
- `zarate_test`: esquema de 52 tablas validado, puerto 3308.

La base `zarate_test` debe conservarse como referencia verificada y no debe ser reinicializada para ejecutar pruebas que utilizan `RefreshDatabase`.

Si las pruebas necesitan crear, modificar o eliminar datos:

1. Preparar una base adicional exclusiva para Pest, por ejemplo `zarate_pest`, dentro del entorno aislado, siempre que los permisos existentes permitan hacerlo.
2. No confundirla con `zarate_dev` ni con `zarate_test`.
3. Garantizar aislamiento físico y lógico.
4. Mantener TLS y los controles de conexión.
5. Comprobar que Laravel está ejecutándose con `APP_ENV=testing`.
6. Verificar la conexión efectiva del proceso de pruebas, no solamente los valores escritos en `.env`.
7. No copiar datos privados de producción o desarrollo.
8. Utilizar datos sintéticos y factories de prueba.
9. No desactivar ni eludir las guardas existentes.

Si crear una base adicional o ejecutar operaciones de reinicialización requiere una nueva autorización explícita, detenerse y solicitarla. No considerar este prompt una autorización para operaciones destructivas.

**Nunca ejecutar `migrate:fresh`, `db:wipe` o una reconstrucción automática sobre `zarate_dev` o `zarate_test`.**

Si no existe un entorno adecuado para ejecutar pruebas de escritura, ejecutar primero las pruebas unitarias seguras y documentar las pruebas de integración bloqueadas.

## 5. FASE C — PRUEBAS DE SEGURIDAD

Verificar mediante pruebas apropiadas:

- Inicio y cierre de sesión.
- Validación de credenciales.
- Protección de rutas.
- Roles y permisos.
- Acceso indebido entre instituciones.
- Acceso a registros de otros estudiantes.
- Acceso de apoderados a estudiantes no vinculados.
- Operaciones no autorizadas de docentes.
- Cambios indebidos de calificaciones.
- Restricciones de acceso a documentos privados.
- Validación de archivos cuando corresponda.

Las pruebas negativas deben confirmar que Laravel rechaza operaciones no autorizadas.

## 6. FASE D — VALIDACIÓN DE LOS CINCO BOLTS

### Bolt 1 — Matrículas

Comprobar:

- Registro de solicitudes.
- Estados permitidos.
- Cupos disponibles.
- Validación económica.
- Aprobación y rechazo.
- Historial y auditoría.
- Permisos de Secretaría y usuarios relacionados.

### Bolt 2 — Enseñanza-aprendizaje

Comprobar:

- Cursos asignados.
- Unidades académicas.
- Materiales publicados.
- Tareas.
- Entregas.
- Restricciones de acceso.
- Integración con matrículas aprobadas.

### Bolt 3 — Evaluaciones

Comprobar:

- Creación y publicación de evaluaciones.
- Registro de calificaciones.
- Periodos académicos habilitados.
- Modificación autorizada de notas.
- Historial de cambios.
- Consulta de resultados por estudiantes.

### Bolt 4 — Asistencia

Comprobar:

- Registro de asistencia.
- Prevención de registros duplicados.
- Tardanzas.
- Ausencias.
- Justificaciones.
- Revisión institucional.
- Consulta por estudiantes y apoderados autorizados.

### Bolt 5 — Comunicaciones

Comprobar:

- Comunicados institucionales.
- Solicitudes académicas.
- Estados y seguimiento.
- Notificaciones.
- Destinatarios autorizados.
- Trazabilidad y permisos.

## 7. FASE E — EJECUCIÓN CONTROLADA

Ejecutar primero las pruebas seguras sin efectos sobre bases protegidas.

Una vez establecido y autorizado un entorno de pruebas modificable:

1. Ejecutar Pest por grupos funcionales.
2. Registrar resultados individuales.
3. Capturar fallos y excepciones.
4. Distinguir errores de pruebas de errores reales de implementación.
5. Corregir problemas del backend únicamente cuando exista evidencia suficiente.
6. Agregar pruebas de regresión para los defectos corregidos.
7. Reejecutar las pruebas afectadas.
8. Ejecutar la regresión general si el entorno es seguro.

No alterar una prueba para ocultar un defecto funcional.

No cambiar reglas de negocio para conseguir resultados artificialmente positivos.

No declarar aprobada una prueba que no se ejecutó.

## 8. FASE F — RESULTADOS DE CALIDAD

Registrar:

- Total de pruebas descubiertas.
- Total de pruebas ejecutadas.
- Pruebas aprobadas.
- Pruebas fallidas.
- Pruebas omitidas o bloqueadas.
- Aserciones realizadas.
- Duración de la ejecución, si está disponible.
- Errores reales encontrados.
- Correcciones aplicadas.
- Resultado de la regresión.
- Evidencia de aislamiento.
- Cobertura de código solamente si se mide realmente.

Distinguir la suite histórica del Sprint 10 de las pruebas ejecutadas durante esta validación.

## 9. RESTRICCIONES

No:

- Modificar `zarate_dev`.
- Reinicializar `zarate_test`.
- Ejecutar seeders de demostración.
- Alterar migraciones originales.
- Eliminar bases existentes.
- Modificar credenciales o certificados.
- Desactivar TLS.
- Desactivar guardas.
- Detener los servidores de demostración.
- Realizar commits o push automáticamente.
- Ejecutar Cypress en esta fase.

Preservar los cambios y documentos de los Prompts 21–25.

## 10. EVIDENCIAS AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-26-pruebas-pest-integracion.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-pruebas-pest-integracion.md`

Incluir resultados reales, comandos ejecutados, pruebas afectadas, defectos, correcciones y evidencias del aislamiento.

No publicar secretos ni información privada.

## 11. INFORME FINAL

Presentar una tabla con:

| Módulo | Pruebas ejecutadas | Aprobadas | Fallidas | Resultado |
|---|---|---|---|---|
| Autenticación y seguridad | Real | Real | Real | Real |
| Matrículas | Real | Real | Real | Real |
| Enseñanza-aprendizaje | Real | Real | Real | Real |
| Evaluaciones | Real | Real | Real | Real |
| Asistencia | Real | Real | Real | Real |
| Comunicaciones | Real | Real | Real | Real |

Terminar indicando:

1. Estado de la conexión de pruebas.
2. Resultado de aislamiento y TLS.
3. Número real de pruebas ejecutadas.
4. Número real de pruebas aprobadas.
5. Defectos encontrados.
6. Defectos corregidos.
7. Archivos modificados.
8. Estado de Git.
9. Si el backend está listo para la fase Cypress.
10. Qué falta para la entrega final.

Clasificar el resultado como:

**A. PEST INTEGRAL APROBADO.**

**B. PEST PARCIAL — INCIDENCIAS PENDIENTES.**

**C. PRUEBAS UNITARIAS APROBADAS — INTEGRACIÓN PENDIENTE.**

**D. BLOQUEADO POR SEGURIDAD O ENTORNO.**

No inventar resultados.

**Objetivo final: demostrar con pruebas reales que los cinco Bolts misionales funcionan correctamente, conservando la seguridad y los datos de EcoAula SaaS.**