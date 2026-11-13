# PROMPT 21 — VERIFICACIÓN DE RECUPERACIÓN Y FINALIZACIÓN DE MIGRACIONES

Actúa como ingeniero senior especializado en Laravel 13, PHP 8.4, MySQL 8.4 y aseguramiento de calidad de software.

Estamos desarrollando el proyecto **EcoAula SaaS — Colegio Zárate**, ubicado en:

`D:\zarate-saas`

**No comiences el proyecto desde cero. Continúa exactamente desde el estado actual del repositorio.**

## 1. CONTEXTO

Nuestro proyecto utiliza:

- Backend: Laravel 13 + PHP 8.4.
- Frontend: React 19 + TypeScript.
- Base de datos: MySQL 8.4.
- Pruebas: Pest y Cypress.
- Rama de validación: `test/integracion-misional`.
- Rama funcional: `feature/macro-misional`.

Se han desarrollado cinco Bolts misionales: matrículas, enseñanza-aprendizaje, evaluación, asistencia y comunicación.

En el Prompt 19 se documentó el siguiente estado de la base de pruebas aislada:

- Base: `zarate_test`.
- Servidor MySQL aislado: `127.0.0.1:3308`.
- 14 migraciones Laravel inventariadas.
- 4 migraciones registradas como completadas.
- 14 tablas existentes.
- Quinta migración de Spatie Permission parcialmente aplicada.
- Tabla `model_has_roles` incompleta.
- Tabla `role_has_permissions` ausente.
- Problema de vigencia en la guarda de autorización.

El Prompt 20 fue diseñado para recuperar la quinta migración y corregir la guarda, pero **su resultado final todavía debe comprobarse**.

## 2. OBJETIVO

Verificar el resultado real del Prompt 20 y, únicamente si la quinta migración está completa y correctamente registrada, ejecutar de manera segura las migraciones restantes hasta completar las 14.

No asumir que el Prompt 20 terminó exitosamente.

## 3. FASE A — DIAGNÓSTICO OBLIGATORIO

Antes de realizar cualquier escritura:

1. Confirmar la rama actual y el estado de Git.
2. Revisar la documentación de los Prompts 16, 17, 18, 19 y 20, si esta última existe.
3. Comprobar los scripts de validación contenidos en `.tools/misional-isolated`.
4. Confirmar que la conexión utiliza exclusivamente `zarate_test`.
5. Verificar el puerto `3308`, usuario restringido, TLS y directorio de datos aislado.
6. Inspeccionar las migraciones registradas en la tabla `migrations`.
7. Examinar el estado físico de las tablas de Spatie Permission.
8. Comparar el esquema real con las migraciones originales.
9. Confirmar que la guarda de autorización sigue siendo efectiva y que su vigencia se verifica inmediatamente antes de cada operación.
10. Comprobar que la base de desarrollo `zarate_dev` permanece fuera del alcance.

**Si la quinta migración continúa incompleta, detenerse y entregar un diagnóstico preciso. No ejecutar las migraciones 6–14.**

Si las tablas están completas pero la quinta migración no está registrada, no continuar automáticamente. Primero determinar un procedimiento de recuperación que respete el historial de Laravel y no duplique operaciones.

## 4. FASE B — EJECUCIÓN CONTROLADA

Solo si se cumplen todas las condiciones:

- La quinta migración está completa.
- Su registro en `migrations` es coherente.
- Las comprobaciones de seguridad aprueban.
- El acceso a MySQL corresponde inequívocamente al entorno aislado.
- La guarda de autorización está vigente.

Entonces:

1. Registrar el estado inicial del esquema.
2. Verificar qué migraciones faltan realmente.
3. Ejecutar las migraciones pendientes mediante el mecanismo controlado existente.
4. Comprobar la autorización antes de cada operación.
5. No modificar migraciones anteriores para ocultar errores.
6. Detenerse ante cualquier error SQL, conflicto de esquema o pérdida de autorización.
7. Conservar el estado y registrar el resultado, incluso si es parcial.
8. Verificar finalmente que las 14 migraciones figuren correctamente registradas y que las tablas esperadas existan.

## 5. RESTRICCIONES ABSOLUTAS

**Prohibido:**

- Ejecutar `migrate:fresh`.
- Ejecutar `db:wipe`.
- Ejecutar `migrate:rollback`.
- Ejecutar seeders.
- Borrar o recrear bases de datos.
- Modificar datos de `zarate_dev`.
- Modificar contraseñas o claves existentes.
- Desactivar TLS o los controles de seguridad.
- Escribir directamente en tablas sin justificación y autorización controlada.
- Detener los servicios de demostración que utilizan los puertos `3307`, `8000` y `5173`.
- Realizar cambios funcionales en los módulos de EcoAula.
- Subir secretos o herramientas locales a GitHub.

No ejecutar pruebas que borren o reconstruyan el esquema. El objetivo de este prompt es completar las migraciones, no iniciar todavía la regresión integral.

## 6. VERIFICACIONES FINALES

Documentar:

- Cantidad de migraciones registradas antes y después.
- Cantidad de tablas antes y después.
- Estado de las tablas de Spatie Permission.
- Resultado de las guardas de seguridad.
- Nombre lógico de la conexión Laravel.
- Estado de TLS.
- Código de salida de los procesos.
- Confirmación de que `zarate_dev` no fue afectada.
- Errores encontrados, si los hubiera.

No informar éxito si existen migraciones pendientes o verificaciones incompletas.

## 7. DOCUMENTACIÓN AI-DLC

Registrar el prompt y sus resultados en:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-21-finalizacion-migraciones.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-finalizacion-migraciones.md`

No incorporar archivos `.env`, contraseñas, certificados privados, bases de datos ni scripts sensibles.

## 8. INFORME FINAL

Entregar un informe con:

1. Estado inicial encontrado.
2. Resultado verificado del Prompt 20.
3. Migraciones ejecutadas en esta intervención.
4. Migraciones pendientes.
5. Número de tablas y comprobaciones del esquema.
6. Controles de seguridad ejecutados.
7. Evidencias generadas.
8. Archivos modificados.
9. Estado final de Git.
10. Recomendación para comenzar las pruebas Pest.

Clasificar el resultado como:

- **MIGRACIONES COMPLETADAS Y VERIFICADAS**.
- **QUINTA MIGRACIÓN PENDIENTE — EJECUCIÓN DETENIDA**.
- **MIGRACIÓN PARCIAL — ESQUEMA CONSERVADO**.
- **BLOQUEADO POR SEGURIDAD**.

**Trabaja únicamente con los resultados reales. No inventes evidencias ni declares completadas actividades que no se hayan ejecutado.**