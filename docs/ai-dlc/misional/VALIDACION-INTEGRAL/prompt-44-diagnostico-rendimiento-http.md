# PROMPT 44 — DIAGNÓSTICO DE RENDIMIENTO HTTP Y RECUPERACIÓN DE CYPRESS E2E

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4, React 19, Cypress, MySQL 8.4, Windows y aseguramiento de calidad.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

## OBJETIVO PRINCIPAL

Ejecutar el plan de diagnóstico HTTP preparado durante la consolidación del Prompt 43, identificar la causa de la latencia y continuar con las pruebas E2E reales únicamente si se demuestra que el entorno es estable.

**No empezar desde cero. No repetir las ocho pruebas E2E acreditadas. No reconstruir MySQL.**

## 1. ESTADO CONFIRMADO

Resultados conservados:

- Pest: 276 casos aprobados y 1.724 aserciones.
- Cypress con API simulada: 141 aprobados.
- Cypress E2E real: 8 casos distintos aprobados.
- E2E no acreditados: 38.
- Fallos históricos: Tesorería y Estudiante.
- Dos casos DELETE sobre `communication_targets` excluidos.
- MySQL E2E: puerto 3309.
- Base exclusiva: `zarate_cypress_e2e`.
- Esquema: 52 tablas y 14 migraciones.
- TLS, identidad y restauración verificados en la recuperación anterior.
- Evidencias del Prompt 43 consolidadas.
- Sin procesos privados activos después del cierre.
- Sin cambios funcionales, commits ni push.

Plan existente:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/plan-diagnostico-rendimiento-http.md`

Debes utilizar este documento como base, no crear otro diagnóstico independiente sin revisar su contenido.

## 2. FASE A — RECUPERACIÓN

Antes de ejecutar:

1. Leer el plan de rendimiento HTTP.
2. Recuperar los checkpoints del Prompt 43.
3. Confirmar los ocho casos E2E acreditados.
4. Revisar los dos fallos registrados.
5. Confirmar estado y rama de Git.
6. Comprobar procesos y puertos.
7. Revisar eventos recientes de suspensión de Windows.
8. Verificar identidad del entorno MySQL E2E.
9. Conservar evidencias y archivos existentes.
10. Establecer una nueva referencia temporal de seguridad.

No reutilizar autorizaciones vencidas.

No iniciar pruebas si existen procesos desconocidos, suspensiones nuevas no evaluadas o inconsistencias de aislamiento.

## 3. FASE B — MEDICIÓN SEPARADA DE RENDIMIENTO

Instrumentar exclusivamente el entorno privado de pruebas.

Medir por separado:

### A. Arranque de Laravel

- Inicio del proceso PHP.
- Carga inicial del framework.
- Tiempo hasta que el servidor comienza a escuchar.
- Tiempo hasta que acepta conexiones.
- Errores durante el arranque.

### B. Disponibilidad HTTP

- Momento en que el puerto está disponible.
- Primera solicitud de salud.
- Resultado HTTP.
- Conexiones rechazadas o pendientes.
- Diferencias entre servidor disponible y aplicación preparada.

### C. Tiempo de respuesta HTTP

Una vez confirmada la disponibilidad:

- Tiempo de conexión.
- Tiempo hasta el primer byte.
- Tiempo total de respuesta.
- Primera solicitud frente a solicitudes posteriores.
- Respuestas 200.
- Errores y timeouts.

### D. Dependencias

Investigar posibles esperas relacionadas con:

- PHP.
- Laravel.
- MySQL.
- TLS.
- Consultas SQL.
- Autenticación.
- Sesiones.
- Disco.
- CPU.
- Antivirus o inspección de archivos, sin modificar sus configuraciones.
- Procesos auxiliares.
- Solicitudes concurrentes.

Registrar marcas temporales y correlacionarlas con los logs existentes.

## 4. FASE C — DETERMINAR LA CAUSA

Distinguir expresamente entre:

1. Laravel tarda en iniciar.
2. El puerto escucha, pero Laravel todavía no está preparado.
3. Laravel está preparado, pero el endpoint responde lentamente.
4. Una dependencia SQL o del entorno introduce latencia.
5. La herramienta de supervisión provoca una espera.
6. El navegador o Cypress espera incorrectamente una solicitud.

No atribuir el problema a MySQL, Windows o Laravel sin evidencia.

No aumentar arbitrariamente el timeout de diez segundos.

No eliminar verificaciones de seguridad.

## 5. FASE D — CORRECCIÓN CONTROLADA

Si el problema es del instrumental privado:

- Aplicar una corrección mínima.
- Separar la comprobación de disponibilidad de la medición de respuesta.
- Evitar condiciones de carrera.
- Mantener el requisito HTTP 200.
- Mantener la comprobación del JSON.
- Conservar el comportamiento original de las pruebas.
- Registrar comparación antes y después.

No modificar código funcional de Laravel o React.

No modificar aserciones originales.

Si la corrección requiere alterar una prueba Cypress original, presentar primero el cambio propuesto y su justificación.

Si se descubre un defecto funcional auténtico, documentarlo sin ocultarlo.

## 6. FASE E — REVISAR TESORERÍA Y ESTUDIANTE

### Tesorería

El backend respondió 204 al cerrar sesión, pero Cypress no observó la redirección dentro de su espera.

Investigar:

- Duración del logout.
- Finalización de solicitudes pendientes.
- Cambio del estado de autenticación.
- Momento de la navegación.
- Ruta final esperada.
- Posibles condiciones de carrera.

No sustituir una comprobación funcional por una espera arbitraria.

### Estudiante

Revisar el fallo registrado durante el retorno a `/app` después del logout.

Verificar si:

- La sesión fue invalidada correctamente.
- El frontend aplicó la navegación esperada.
- La ruta observada coincide con la regla funcional.
- Existió una solicitud pendiente.
- Hubo un problema de sincronización o de lógica.

No declarar fallos funcionales sin evidencia.

Conservar ambos resultados históricos.

## 7. FASE F — PILOTO E2E REAL

Solo si el diagnóstico demuestra estabilidad y la seguridad aprueba:

1. Verificar identidad de MySQL 3309.
2. Confirmar TLS.
3. Confirmar conexión exclusiva a `zarate_cypress_e2e`.
4. Verificar el esquema.
5. Confirmar el baseline restaurado.
6. Comprobar disponibilidad real del backend.
7. Ejecutar entre uno y tres casos E2E seguros todavía no acreditados.
8. Registrar resultados HTTP y SQL reales.
9. Verificar restauración después de cada caso.
10. Guardar checkpoints.

No repetir las ocho pruebas ya aprobadas.

No ejecutar los dos casos DELETE excluidos.

No ejecutar los 38 Pest bloqueados.

No modificar los entornos protegidos.

Si el piloto es estable, preparar la continuación progresiva del inventario restante. No iniciar automáticamente un lote extenso en esta intervención.

## 8. FASE G — SEGURIDAD Y CIERRE

Mantener:

- Guarda de autorización máxima de 120 segundos.
- TLS obligatorio.
- Identidad efectiva.
- Aislamiento del directorio MySQL.
- Protección de `zarate_dev`, `zarate_test` y `zarate_pest`.
- Protección de los servicios de demostración.
- Restauración privada verificada.
- Detección de suspensiones de Windows.
- Ejecución secuencial.

Ante cualquier suspensión, pérdida de aislamiento o restauración incompleta, detener las pruebas.

Al terminar, cerrar exclusivamente los procesos privados iniciados.

No ejecutar commits ni push.

## 9. DOCUMENTACIÓN

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-44-diagnostico-rendimiento-http.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-rendimiento-http.md`

Actualizar el plan existente con los resultados medidos.

Registrar:

- Duraciones de arranque.
- Disponibilidad HTTP.
- Latencia por solicitud.
- Posibles dependencias lentas.
- Causa demostrada o incertidumbres.
- Correcciones privadas efectuadas.
- Diagnóstico de Tesorería.
- Diagnóstico de Estudiante.
- Resultados del piloto.
- Seguridad y restauración.
- Estado final de procesos y bases.
- Estado Git.
- Próximos casos pendientes.

## 10. INFORME FINAL

Entregar:

| Componente | Medición / resultado |
|---|---|
| Arranque de Laravel | Tiempo real |
| Disponibilidad HTTP | Tiempo real |
| Respuesta de salud | Tiempo real |
| Latencia SQL | Resultado medido |
| Causa del timeout | Confirmada / No confirmada |
| Tesorería | Diagnóstico |
| Estudiante | Diagnóstico |
| Nuevos E2E aprobados | Total real |
| Acumulado E2E | Total real |
| Casos sin acreditar | Total real |
| Restauración | Resultado |
| TLS y aislamiento | Resultado |

Clasificar:

A. LATENCIA RESUELTA Y PILOTO E2E APROBADO.

B. LATENCIA IDENTIFICADA — CORRECCIÓN PENDIENTE.

C. DIAGNÓSTICO PARCIAL.

D. BLOQUEADO POR ENTORNO O SEGURIDAD.

**OBJETIVO FINAL: identificar la causa real del retraso HTTP, estabilizar el instrumental y permitir que la siguiente ejecución continúe los casos E2E pendientes sin repetir trabajo ni comprometer EcoAula SaaS.**