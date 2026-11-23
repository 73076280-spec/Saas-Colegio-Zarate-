# PROMPT 38 — PREPARACIÓN Y EJECUCIÓN CONTROLADA DE CYPRESS PARA ECOAULA SAAS

Actúa como ingeniero senior de QA, Laravel 13, React 19, TypeScript, MySQL 8.4, Cypress, seguridad multiinstitucional y pruebas de integración end-to-end.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## 1. OBJETIVO PRINCIPAL

Continuar desde el cierre exitoso del Prompt 37 y preparar una infraestructura segura para ejecutar las pruebas Cypress de EcoAula SaaS.

**No reiniciar el proyecto, no repetir automáticamente Pest y no modificar el entorno de demostración.**

Quiero avanzar con la validación de la interfaz React, la API Laravel y su integración, conservando todas las evidencias anteriores.

## 2. ESTADO CONFIRMADO

El Prompt 37 terminó con:

- 314 casos Pest inventariados.
- 276 casos distintos aprobados.
- 1.724 aserciones acreditadas.
- 75 casos nuevos aprobados sin fallos.
- 38 casos Pest bloqueados por operaciones o contratos no autorizados.
- 52 tablas conservadas.
- 14 migraciones verificadas.
- TLS obligatorio.
- Cero residuos persistentes.
- MySQL aislado apagado correctamente.
- Sin cambios funcionales, commits ni push.

La regresión Pest autorizada está completada.

Los 38 casos excluidos no deben ejecutarse como parte de Cypress ni considerarse aprobados.

## 3. FASE A — RECUPERACIÓN E INVENTARIO

Antes de cualquier ejecución:

1. Confirmar rama y estado de Git.
2. Leer las evidencias de los Prompts 35–37.
3. Identificar los archivos Cypress existentes.
4. Contar los casos y datasets realmente descubiertos.
5. Revisar la configuración de Cypress.
6. Inspeccionar scripts de `package.json`.
7. Examinar fixtures, hooks, comandos personalizados y tareas Node.
8. Identificar dependencias HTTP, API, autenticación, datos y archivos.
9. Comprobar que las pruebas no ejecuten operaciones destructivas indirectas.
10. Conservar los cambios anteriores sin sobrescribir evidencias.

No asumir que las cantidades de Cypress de ejecuciones históricas siguen vigentes.

No modificar pruebas ni aserciones para aumentar artificialmente los resultados.

## 4. FASE B — DISEÑAR EL ENTORNO HTTP AISLADO

Se requiere un entorno independiente de la demostración existente.

Proteger:

- MySQL de desarrollo en puerto 3307.
- Base `zarate_dev`.
- Base de referencia `zarate_test`.
- Laravel de demostración en puerto 8000.
- React/Vite de demostración en puerto 5173.

Examinar la posibilidad de utilizar puertos HTTP alternativos libres para:

- Backend exclusivo de Cypress.
- Frontend exclusivo de Cypress.

No asumir que un puerto está disponible sin verificarlo.

Preparar configuraciones específicas de pruebas, evitando que Laravel o Vite puedan utilizar automáticamente las variables de desarrollo.

Revisar:

- `APP_ENV`.
- Conexión efectiva MySQL.
- Variables de frontend para la URL de API.
- Configuración real de Sanctum.
- CORS y cookies.
- Identidad del proceso Laravel.
- Identidad del proceso Vite.
- Rutas de almacenamiento.
- Logs y cachés.
- Directorios temporales.

No ejecutar comandos de caché o limpieza que afecten al entorno de demostración.

## 5. FASE C — SEGURIDAD DE BASE DE DATOS

No reutilizar automáticamente `zarate_pest` para Cypress.

Primero determinar si puede mantenerse el aislamiento entre las ejecuciones Pest y los flujos HTTP.

Para las pruebas Cypress con escrituras:

- Exigir una base aislada expresamente autorizada.
- Verificar sus privilegios efectivos.
- Usar datos sintéticos.
- Diseñar un mecanismo verificable de preparación y limpieza.
- Comprobar operaciones de auditoría y tokens.
- Controlar efectos persistentes de autenticación.
- Evitar archivos o procesos externos no reversibles.

No crear bases, usuarios ni permisos nuevos automáticamente si ello requiere una autorización no otorgada.

No ejecutar migraciones, seeders, DELETE, TRUNCATE o DROP sin autorización específica.

No considerar que las pruebas Cypress disponen de rollback automático de las peticiones HTTP.

Si no existe un entorno seguro para pruebas con escritura, limitarse a pruebas estáticas, de solo lectura o con respuestas simuladas claramente identificadas, siempre que no produzcan efectos persistentes.

No presentar pruebas simuladas como validación de integración real con MySQL.

## 6. FASE D — INVENTARIO POR MÓDULO

Clasificar los casos Cypress existentes por:

### Autenticación y seguridad

- Inicio y cierre de sesión.
- Acceso protegido.
- Redirección según rol.
- Manejo de sesión.
- Restricciones de permisos.
- Aislamiento institucional.

### Matrículas

- Solicitudes.
- Formularios.
- Validaciones.
- Estados.
- Permisos.
- Historial.

### Aula Virtual

- Navegación.
- Cursos.
- Materiales.
- Tareas.
- Entregas.
- Restricciones de acceso.

### Evaluaciones

- Registro de notas.
- Consulta de calificaciones.
- Validaciones y permisos.

### Asistencia

- Listados.
- Registro.
- Justificaciones.
- Restricciones.

### Comunicaciones

- Solicitudes.
- Comunicados.
- Notificaciones.
- Estados.

### Funciones transversales

- Navegación.
- Rutas protegidas.
- Mensajes de error.
- Accesibilidad.
- Diseño adaptable.

No inventar cobertura cuando no existen pruebas para un escenario.

## 7. FASE E — EJECUCIÓN CONDICIONAL

Ejecutar Cypress únicamente si el entorno HTTP y la base utilizada cumplen íntegramente los controles anteriores.

Comenzar con pruebas de humo seguras y aisladas.

Verificar:

1. Backend correcto.
2. Frontend correcto.
3. URL base autorizada.
4. Conexión efectiva a la base permitida, cuando corresponda.
5. Identidad de procesos.
6. Ausencia de escritura en bases protegidas.
7. Ausencia de efectos externos no autorizados.
8. Disponibilidad de fixtures seguros.
9. Limpieza controlada de datos de prueba.
10. Registro de resultados reales.

Si aprueban los controles, continuar progresivamente con los casos seguros de los módulos.

No ejecutar en paralelo casos que compartan estado o recursos.

Ante cualquier incidente de integridad o seguridad, detener la ejecución.

Si falta infraestructura autorizada, detener las pruebas con escrituras y entregar el plan exacto de habilitación, sin intentar eludir las restricciones.

## 8. FASE F — CONTROL DE ERRORES

Ante un fallo Cypress:

- Conservar el mensaje original.
- Registrar captura o evidencia disponible.
- Identificar el escenario.
- Revisar errores de frontend.
- Revisar respuesta HTTP.
- Distinguir fallos de entorno, datos y comportamiento funcional.
- Identificar efectos persistentes.
- Comprobar limpieza.
- Documentar pasos de reproducción.

No modificar código funcional sin autorización.

No modificar aserciones para ocultar fallos.

No declarar éxito si solamente se consiguió abrir la página.

## 9. FASE G — REGRESIÓN Y COBERTURA

Al finalizar la ejecución autorizada:

1. Contar casos Cypress realmente ejecutados.
2. Identificar aprobados y fallidos.
3. Diferenciar casos bloqueados de no ejecutados.
4. Registrar evidencias.
5. Confirmar aislamiento HTTP y SQL.
6. Comprobar que los servicios de demostración no fueron modificados.
7. Detener exclusivamente los procesos iniciados para Cypress.
8. Conservar logs y capturas pertinentes.
9. Consolidar la cobertura por módulo.
10. Preparar el siguiente paso de integración de ramas.

Mantener las estadísticas Pest separadas de las estadísticas Cypress.

## 10. REVISIÓN DE LOS 38 CASOS PEST BLOQUEADOS

Realizar solamente una revisión documental.

Clasificarlos según las autorizaciones o adaptaciones de infraestructura necesarias.

Proponer, cuando sea apropiado, un entorno completamente descartable para ejecutar pruebas destructivas sin poner en riesgo las bases existentes.

No habilitar ni ejecutar esos 38 casos en este prompt.

## 11. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-38-cypress-integracion.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-cypress-integracion.md`

Registrar:

- Estado inicial.
- Inventario Cypress.
- Arquitectura del entorno HTTP.
- Comprobaciones de seguridad.
- Casos seleccionados.
- Resultados reales.
- Capturas y logs pertinentes.
- Incidencias.
- Casos bloqueados.
- Estado final de procesos.
- Estado de las bases.
- Estado Git.
- Próximas acciones.

Guardar información sensible únicamente en rutas privadas excluidas del repositorio.

## 12. RESTRICCIONES

Prohibido:

- Alterar `zarate_dev` o `zarate_test`.
- Utilizar cuentas de demostración para pruebas con escritura.
- Ejecutar migraciones destructivas.
- Ejecutar operaciones SQL no autorizadas.
- Ampliar privilegios MySQL.
- Debilitar TLS o los controles de identidad.
- Reutilizar autorizaciones vencidas.
- Modificar configuraciones globales de Windows.
- Detener servicios ajenos.
- Ejecutar toda la suite sin clasificarla.
- Modificar código funcional sin autorización.
- Realizar commits o push automáticamente.
- Publicar secretos.

## 13. INFORME FINAL

Presentar:

| Módulo | Casos inventariados | Ejecutados | Aprobados | Fallidos | Bloqueados |
|---|---|---|---|---|---|
| Autenticación | Real | Real | Real | Real | Real |
| Matrículas | Real | Real | Real | Real | Real |
| Aula Virtual | Real | Real | Real | Real | Real |
| Evaluaciones | Real | Real | Real | Real | Real |
| Asistencia | Real | Real | Real | Real | Real |
| Comunicaciones | Real | Real | Real | Real | Real |
| Transversal | Real | Real | Real | Real | Real |

Además, informar:

1. Total Cypress inventariado.
2. Total Cypress ejecutado y aprobado.
3. Fallos reales.
4. Casos sin ejecutar.
5. Nivel de aislamiento logrado.
6. Estado del backend y frontend de pruebas.
7. Estado de las bases protegidas.
8. Cobertura funcional por módulo.
9. Requisitos para ejecutar los escenarios pendientes.
10. Recomendaciones para consolidación de GitHub y entrega final.

Clasificar:

**A. CYPRESS — VALIDACIÓN AUTORIZADA COMPLETADA.**

**B. CYPRESS — VALIDACIÓN PARCIAL.**

**C. ENTORNO PREPARADO, EJECUCIÓN PENDIENTE DE AUTORIZACIÓN.**

**D. BLOQUEADO POR SEGURIDAD O INFRAESTRUCTURA.**

No declarar validación end-to-end completa sin peticiones HTTP reales y evidencias suficientes.

**OBJETIVO FINAL: avanzar lo máximo posible en Cypress de forma segura, sin repetir Pest ni comprometer la instalación de EcoAula SaaS utilizada para demostración.**