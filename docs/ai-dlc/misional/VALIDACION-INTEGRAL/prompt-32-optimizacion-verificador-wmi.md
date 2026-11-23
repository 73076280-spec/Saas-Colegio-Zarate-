# PROMPT 32 — DIAGNÓSTICO Y CORRECCIÓN DEL VERIFICADOR WMI PARA REANUDAR PEST

Actúa como ingeniero senior especializado en Windows, PowerShell, PHP 8.4, Laravel 13, Pest, MySQL 8.4, seguridad de procesos y optimización de herramientas de QA.

Proyecto: `D:\zarate-saas`

Rama esperada: `test/integracion-misional`.

**Continúa desde el último resultado del Prompt 31. No comiences desde cero ni descartes ninguna modificación existente.**

## 1. CONTEXTO VERIFICADO

El Prompt 31 continúa bloqueado por latencia del verificador nativo de Windows.

Estado confirmado:

- 314 casos Pest inventariados.
- 29 casos distintos aprobados.
- 211 aserciones acreditadas.
- 285 casos pendientes de aprobación.
- 1 de los 12 casos del Prompt 31 aprobado.
- 1 caso interrumpido por expiración de autorización.
- 10 casos del lote sin ejecutar.
- 52 tablas y 14 migraciones conservadas.
- TLS e identidad MySQL verificados.
- Cero residuos persistentes.
- Guarda con vigencia máxima de 120 segundos.
- Sin cambios funcionales ni commits.

El diagnóstico anterior encontró que el verificador nativo representa aproximadamente el 83 % del tiempo de atestación, principalmente por consultas WMI.

Se probaron tres variantes de optimización que no demostraron mejoras suficientes y fueron descartadas.

No repetir esas variantes sin una justificación técnica nueva.

## 2. OBJETIVO

Identificar exactamente qué comprobaciones WMI consumen más tiempo y evaluar un mecanismo de verificación equivalente, medible y seguro.

Solo cuando exista evidencia suficiente de equivalencia funcional, seguridad y rendimiento, aplicar una corrección mínima y reanudar los once casos pendientes de aprobación del Prompt 31.

**No aumentar la duración de 120 segundos ni desactivar comprobaciones.**

## 3. FASE A — INSPECCIÓN DEL VERIFICADOR ACTUAL

Antes de modificar el instrumental:

1. Confirmar rama y estado de Git.
2. Leer las evidencias de los Prompts 28–31.
3. Inspeccionar los registros privados de `prompt31r`, `prompt31s`, `prompt31t` y `prompt31u`.
4. Localizar las funciones que llaman a WMI o CIM.
5. Identificar los procesos y propiedades consultados.
6. Determinar si se consulta toda la lista de procesos cuando solo se necesita verificar uno.
7. Medir el tiempo individual de cada llamada.
8. Revisar la cantidad de procesos PowerShell que se inician.
9. Determinar si las consultas se repiten innecesariamente.
10. Documentar qué propiedad de seguridad aporta cada comprobación.

Crear una matriz que relacione:

- Comprobación.
- Información verificada.
- Fuente actual.
- Tiempo observado.
- Riesgo que previene.
- Posible alternativa.
- Condición de equivalencia.

No retirar una comprobación simplemente por ser lenta.

## 4. FASE B — EVALUAR ALTERNATIVAS DE WINDOWS

Investigar, cuando corresponda:

- Consultas CIM filtradas por identificador de proceso.
- Selección limitada de propiedades mediante `Get-CimInstance`.
- Reutilización segura de sesiones CIM, si procede.
- `Get-Process -Id`.
- `System.Diagnostics.Process`.
- API nativas de Windows como `QueryFullProcessImageName`, únicamente para las propiedades que realmente permiten consultar.
- Reducción de arranques repetidos de PowerShell.
- Lectura eficiente de identidad y ruta del proceso.

No asumir equivalencia entre las herramientas.

Por ejemplo, obtener solamente la ruta del ejecutable no sustituye una validación que también necesita comprobar la línea de comandos, propietario, argumentos, proceso padre o momento de inicio.

Identificar todas las propiedades necesarias para evitar confusión entre procesos, reutilización de PID o sustitución del ejecutable.

No introducir bibliotecas externas, dependencias nuevas ni herramientas con privilegios elevados sin justificar su necesidad.

## 5. FASE C — MEDICIONES SIN ESCRITURAS

Construir un benchmark local de solo lectura.

Comparar el mecanismo original y las alternativas candidatas.

Medir:

- Tiempo por operación.
- Tiempo total.
- Variabilidad entre ejecuciones.
- Uso de CPU cuando sea medible.
- Número de procesos auxiliares.
- Resultados obtenidos.
- Fallos de acceso.
- Coincidencia de identidades.
- Comportamiento en consultas repetidas.

Realizar varias mediciones independientes, incluyendo condiciones iniciales y ejecuciones posteriores, para evitar seleccionar solamente el resultado más favorable.

No modificar configuraciones de Windows, servicios WMI, antivirus, firewall ni permisos del sistema operativo.

No ejecutar todavía Pest.

## 6. FASE D — COMPROBAR EQUIVALENCIA DE SEGURIDAD

Una alternativa solo será aceptable si conserva todas las verificaciones que realmente realiza el mecanismo original.

Probar situaciones positivas y negativas que incluyan:

1. Proceso correcto.
2. PID inexistente.
3. PID diferente.
4. Proceso terminado.
5. Ruta ejecutable diferente.
6. Argumentos diferentes, cuando formen parte del contrato de seguridad.
7. Identidad de proceso incorrecta.
8. Reutilización de PID, cuando sea posible simularla de forma segura.
9. Información inaccesible o incompleta.
10. Autorización vencida.
11. Base no autorizada.
12. Conexión MySQL incorrecta.
13. TLS inválido.
14. Directorio de datos no autorizado.

La falta de información debe provocar rechazo seguro, nunca aceptación automática.

Mantener verificaciones de la identidad efectiva de MySQL, autorización, TLS, host, puerto, usuario y base.

No sustituir comprobaciones dinámicas esenciales por resultados antiguos almacenados en caché.

## 7. FASE E — CORRECCIÓN MÍNIMA

Si se encuentra una alternativa equivalente y con mejora suficiente:

1. Aplicar el cambio únicamente al instrumental privado de validación.
2. Conservar una referencia al comportamiento original.
3. Agregar pruebas de regresión de seguridad.
4. Mantener una autorización de 120 segundos.
5. Confirmar la identidad antes de cada operación sensible.
6. Medir nuevamente el ciclo completo.
7. Verificar que las pruebas negativas siguen rechazando los accesos incorrectos.
8. Confirmar que no existen regresiones de seguridad.

Si ninguna alternativa demuestra equivalencia y mejora suficiente, detenerse.

No justificar cambios inseguros por la necesidad de completar las pruebas académicas.

## 8. FASE F — REANUDAR EL PROMPT 31

Esta fase es estrictamente condicional.

Solo continuar si:

- La corrección anterior está validada.
- Se mantienen las garantías originales.
- Los controles negativos aprueban.
- Las mediciones demuestran margen suficiente respecto a los 120 segundos.
- MySQL aislado está correctamente identificado.
- Las 52 tablas y 14 migraciones permanecen verificadas.
- No hay residuos de la ejecución anterior.

Entonces:

1. Recuperar los doce casos originales del Prompt 31.
2. Conservar el primer caso aprobado.
3. Reintentar de forma controlada el caso con error de entorno, si su causa ya está resuelta.
4. Ejecutar los diez casos todavía no ejecutados.
5. Utilizar exclusivamente `zarate_pest`.
6. Ejecutar casos secuencialmente.
7. Confirmar rollback después de cada caso.
8. Verificar ausencia de residuos.
9. Registrar resultados JUnit.
10. Detenerse ante cualquier nueva expiración o anomalía.

No modificar las aserciones ni los fixtures funcionales originales.

No contar reejecuciones como pruebas nuevas.

## 9. RESTRICCIONES

Mantener protegidas:

- `zarate_dev`.
- `zarate_test`.
- Los servicios de demostración en puertos 3307, 8000 y 5173.

Prohibido:

- Desactivar WMI a nivel del sistema.
- Modificar políticas de seguridad de Windows.
- Desactivar antivirus o firewall.
- Aumentar arbitrariamente el plazo de autorización.
- Ignorar autorizaciones vencidas.
- Ejecutar DELETE, DROP, TRUNCATE o DDL.
- Ejecutar migraciones destructivas.
- Ejecutar seeders de demostración.
- Ampliar privilegios MySQL.
- Modificar código funcional de EcoAula.
- Ejecutar Pest en paralelo.
- Ejecutar la suite completa de 314 casos.
- Ejecutar Cypress.
- Realizar commits o push automáticamente.

No publicar secretos ni información privada.

## 10. DOCUMENTACIÓN AI-DLC

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-32-optimizacion-verificador-wmi.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-optimizacion-verificador-wmi.md`

Actualizar por anexos las evidencias del Prompt 31 únicamente si se reanudan las pruebas.

Registrar:

- Diagnóstico exacto de latencia.
- Propiedades que verificaba WMI.
- Alternativas evaluadas.
- Benchmarks comparativos.
- Pruebas de equivalencia.
- Pruebas negativas.
- Cambios aplicados o descartados.
- Resultados Pest, si corresponden.
- Rollbacks.
- Estado final SQL.
- Archivos modificados.
- Estado Git.
- Bloqueos restantes.

## 11. INFORME FINAL

Entregar:

| Componente | Antes | Después | Evidencia |
|---|---|---|---|
| Latencia del verificador | Medición original | Medición real | Benchmark |
| Cobertura de seguridad | Original | Verificada | Pruebas negativas |
| Autorización | 120 segundos | 120 segundos | Comprobación |
| Casos Pest acreditados | 29 | Total real | JUnit |
| Aserciones acumuladas | 211 | Total real | JUnit |
| Esquema MySQL | 52 tablas | Estado real | SQL |
| Migraciones | 14 | Estado real | SQL |

Clasificar el resultado como:

**A. VERIFICADOR OPTIMIZADO — PROMPT 31 COMPLETADO.**

**B. VERIFICADOR OPTIMIZADO — PRUEBAS PARCIALES.**

**C. DIAGNÓSTICO COMPLETADO — CORRECCIÓN NO VALIDADA.**

**D. BLOQUEADO POR SEGURIDAD O LATENCIA.**

Prioridad: resolver el cuello de botella del verificador nativo sin debilitar la seguridad, conservando todos los resultados anteriores de EcoAula SaaS.

**No declarar optimización ni aprobación funcional sin mediciones y ejecuciones verificables.**