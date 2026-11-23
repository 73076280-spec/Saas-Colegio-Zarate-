# PROMPT 22 — RECUPERACIÓN SEGURA DEL ENTORNO Y QUINTA MIGRACIÓN

Actúa como ingeniero senior de Laravel 13, MySQL 8.4, DevOps y seguridad de bases de datos.

Proyecto: `D:\zarate-saas`

**Continúa desde el estado actual. No reinicies el proyecto ni repitas la preparación anterior.**

## CONTEXTO

Estamos validando los cinco Bolts misionales de EcoAula SaaS en la rama `test/integracion-misional`.

El Prompt 21 finalizó con **BLOQUEADO POR SEGURIDAD** debido a:

- Ausencia de evidencia de ejecución satisfactoria del Prompt 20.
- Guarda de vigencia de autorización todavía defectuosa.
- 22 archivos diferentes y 4 ausentes frente al snapshot de desarrollo.
- Último estado SQL conocido: 4 migraciones registradas, 14 tablas y quinta migración parcial.
- Ninguna migración ejecutada durante el Prompt 21.

Los hashes de las 14 migraciones y las cuatro configuraciones protegidas coincidieron.

La instalación de demostración utiliza MySQL en el puerto 3307, Laravel en el 8000 y React en el 5173. **No debes detener ni modificar estos servicios.**

La infraestructura aislada de pruebas utiliza MySQL en `127.0.0.1:3308` y la base `zarate_test`.

## OBJETIVO PRINCIPAL

Resolver las causas reales del bloqueo de seguridad y, únicamente si las verificaciones son satisfactorias, recuperar de forma controlada la quinta migración parcial.

**No ejecutar todavía las migraciones 6–14, ni Pest ni Cypress.**

## FASE 1 — REVISIÓN DEL ESTADO ACTUAL

1. Comprobar rama actual y `git status`.
2. Leer las evidencias de los Prompts 16 al 21.
3. Buscar si existe documentación del Prompt 20 en el entorno local, sin asumir que se haya ejecutado.
4. Localizar los scripts y controles existentes bajo `.tools/misional-isolated`.
5. Identificar el snapshot de desarrollo utilizado por las guardas.
6. Comprobar qué restricciones protegen contra escrituras a `zarate_dev`.
7. Mantener intactos los archivos del proyecto y las bases de datos.

No cambiar de rama automáticamente ni descartar modificaciones.

## FASE 2 — ACLARAR LAS 22 DIFERENCIAS Y 4 AUSENCIAS

Generar una comparación detallada que identifique:

- Ruta exacta del archivo.
- Estado: diferente, ausente o agregado.
- Si pertenece al código fuente, configuración, migraciones, documentación, pruebas o herramientas locales.
- Si el cambio forma parte de una evolución legítima del repositorio.
- Si la diferencia puede afectar el funcionamiento de Laravel o la seguridad de la conexión.
- Si afecta la ejecución de las migraciones.

Separar las diferencias entre:

1. Cambios esperados y explicables.
2. Cambios que requieren inspección adicional.
3. Cambios incompatibles con una migración segura.

No restaurar automáticamente los archivos del snapshot.

No sobrescribir el código actual con archivos antiguos.

No modificar las 14 migraciones originales ni las cuatro configuraciones protegidas.

**Si existe una diferencia crítica sin resolver, detener la intervención y documentarla.**

## FASE 3 — CORREGIR EL PROBLEMA DE VIGENCIA

Inspeccionar la implementación actual de la guarda de autorización.

Determinar:

- Cuándo se genera la autorización.
- Cuándo comienza a contar su vigencia.
- Qué comprobación ocasionó el bloqueo.
- Si el proceso realiza verificaciones costosas después de obtener la autorización.
- Si existe un problema de orden de ejecución o conservación del estado.
- Si las verificaciones se realizan contra el mismo proceso y conexión que se autoriza.

Aplicar únicamente la corrección mínima necesaria en las herramientas locales aisladas.

La solución debe comprobar la autorización inmediatamente antes de cada operación sensible, utilizando una autorización válida y recién verificada.

**No está permitido:**

- Desactivar la guarda.
- Eliminar condiciones de seguridad.
- Aceptar autorizaciones vencidas.
- Ampliar arbitrariamente el tiempo de vigencia.
- Eliminar comprobaciones de identidad, TLS, base o puerto.
- Sustituir las restricciones por condiciones que siempre devuelvan verdadero.

Realizar pruebas negativas de la guarda para confirmar que sigue rechazando conexiones y estados no autorizados.

Si el mecanismo exige una nueva aprobación explícita para operar, respetar esa condición y detenerse hasta disponer de ella.

## FASE 4 — VERIFICACIÓN SQL EN MODO LECTURA

Una vez verificadas las guardas, realizar exclusivamente consultas de lectura en MySQL aislado.

Confirmar:

- Host `127.0.0.1`.
- Puerto `3308`.
- Base `zarate_test`.
- Usuario restringido de pruebas.
- TLS válido.
- Directorio físico de datos aislado.
- Identidad de conexión Laravel.
- Cantidad actual de tablas.
- Migraciones registradas.
- Estado de las tablas de Spatie Permission.

Comparar el esquema real de la quinta migración con su definición original.

No ejecutar escrituras en esta fase.

## FASE 5 — REPARACIÓN LIMITADA DE LA QUINTA MIGRACIÓN

Esta fase es condicional.

Solo proceder si:

1. Las diferencias de archivos ya fueron clasificadas y no representan riesgos.
2. Las guardas funcionan y sus pruebas negativas aprueban.
3. La autorización para escribir es válida.
4. La base y conexión aisladas están identificadas sin ambigüedad.
5. La lectura SQL confirma exactamente qué componentes faltan.

Utilizar el procedimiento de reparación documentado en el Prompt 19 y los controles establecidos para el Prompt 20.

Reparar únicamente los componentes faltantes de la quinta migración, respetando las definiciones originales.

En el diagnóstico previo se identificaron posibles índices y una clave foránea faltantes en `model_has_roles`, además de la ausencia de `role_has_permissions`.

**No asumir que ese estado sigue siendo idéntico: verificarlo nuevamente antes de actuar.**

No eliminar ni recrear tablas existentes.

No ejecutar comandos de limpieza, reinicialización ni seeders.

Comprobar la equivalencia exacta del esquema reparado.

El registro de la quinta migración en el historial de Laravel solo podrá completarse si se demuestra que toda la migración está efectivamente aplicada y el registro resultante es coherente con la semántica del migrador.

Si no puede garantizarse esa coherencia, conservar el esquema y detenerse sin inventar un estado de éxito.

**No ejecutar las migraciones 6–14.**

## FASE 6 — SEGURIDAD OBLIGATORIA

Prohibido:

- `migrate:fresh`
- `db:wipe`
- `migrate:rollback`
- Seeders
- Eliminación de tablas o bases de datos
- Cambios en `zarate_dev`
- Cambios en credenciales
- Desactivación de TLS
- Modificación del código funcional de EcoAula
- Detener MySQL de desarrollo, Laravel o Vite
- Alterar el historial de migraciones sin equivalencia verificada
- Publicar secretos o archivos de `.tools`

Mantener todos los scripts sensibles dentro de las carpetas locales ignoradas por Git.

## FASE 7 — EVIDENCIAS AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-22-recuperacion-seguridad.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-recuperacion-seguridad.md`

Documentar:

- Diagnóstico del bloqueo.
- Clasificación de las 22 diferencias y 4 ausencias.
- Corrección de la guarda.
- Resultado de sus pruebas negativas.
- Estado SQL antes y después.
- Componentes de la quinta migración reparados, si corresponde.
- Migraciones registradas.
- Cantidad de tablas.
- Verificación de aislamiento y TLS.
- Archivos modificados.
- Estado de Git.
- Riesgos pendientes.

No incluir credenciales, tokens ni certificados privados.

## INFORME FINAL

Finalizar con una tabla que muestre:

| Componente | Antes | Después | Resultado |
|---|---|---|---|
| Guarda de autorización | Defectuosa | Estado comprobado | Resultado real |
| Diferencias del snapshot | 22 + 4 | Clasificadas o pendientes | Resultado real |
| Quinta migración | Parcial | Estado comprobado | Resultado real |
| Migraciones registradas | 4/14 según última evidencia | Cantidad real | Resultado real |
| Base de desarrollo | Protegida | Sin alteraciones verificadas | Resultado real |

Clasificar el cierre como una de estas opciones:

- **QUINTA MIGRACIÓN RECUPERADA Y VERIFICADA**
- **GUARDAS CORREGIDAS — MIGRACIÓN PENDIENTE**
- **BLOQUEO POR DIFERENCIAS CRÍTICAS**
- **BLOQUEADO POR SEGURIDAD**

No declarar éxito si alguna verificación obligatoria falló.

No realizar commits ni push automáticamente.

**Prioridad: seguridad, recuperación mínima y avance verificable.**