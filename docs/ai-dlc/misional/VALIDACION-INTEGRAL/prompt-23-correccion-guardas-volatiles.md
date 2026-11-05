# PROMPT 23 — CORRECCIÓN DE GUARDA, CLASIFICACIÓN DE ARCHIVOS VOLÁTILES Y RECUPERACIÓN SEGURA

Actúa como ingeniero senior de Laravel 13, MySQL 8.4, seguridad de datos y automatización de pruebas.

Proyecto: `D:\zarate-saas`

Rama de trabajo esperada: `test/integracion-misional`.

No reinicies el proyecto. Continúa desde los resultados reales de los Prompts 19, 20, 21 y 22.

## 1. SITUACIÓN

El Prompt 22 se detuvo por diferencias críticas frente al snapshot de desarrollo.

Se registraron:

- 22 archivos modificados.
- 4 archivos ausentes.
- 2 archivos agregados.
- Dos diferencias críticas en `zarate_dev/users.ibd` y `zarate_dev/audit_logs.ibd`.
- Guarda de vigencia todavía sin corregir.
- Última evidencia SQL: 4 de 14 migraciones registradas, 14 tablas y quinta migración parcialmente aplicada.

No se ejecutaron escrituras SQL ni migraciones en el Prompt 22.

Los hashes de las 14 migraciones originales y las cuatro configuraciones protegidas coinciden.

## 2. OBJETIVO

Eliminar los falsos bloqueos producidos por una comparación inadecuada de archivos de datos vivos, corregir la vigencia de la guarda y recuperar un mecanismo seguro para continuar la migración aislada.

La seguridad no debe depender de que los archivos `.ibd` de una base activa mantengan hashes estáticos.

**No interpretar automáticamente un cambio en `.ibd` como corrupción, ataque o pérdida de integridad.**

Tampoco asumir que todo cambio es legítimo: conservar un registro de diferencias y verificar separadamente la identidad y protección del entorno.

## 3. REVISIÓN DEL DIAGNÓSTICO ANTERIOR

Leer:

- Evidencias del Prompt 19.
- Resultados disponibles del Prompt 20.
- Prompt y evidencias 21.
- Prompt y evidencias 22.
- Scripts de `.tools/misional-isolated`.

Revisar el listado completo de las 28 diferencias.

Determinar cuáles corresponden a:

1. Código y configuraciones inmutables.
2. Migraciones Laravel.
3. Archivos internos y volátiles de MySQL.
4. Documentación o logs.
5. Diferencias todavía inexplicadas.

Los archivos `users.ibd` y `audit_logs.ibd` deben tratarse como archivos de datos InnoDB susceptibles de cambio durante la actividad normal.

No acceder a sus contenidos privados ni intentar restaurarlos.

## 4. CORREGIR EL MODELO DE INTEGRIDAD

Separar dos conceptos:

### A. Integridad del código y configuraciones

Continuar verificando los hashes de:

- Migraciones Laravel originales.
- Configuraciones protegidas.
- Scripts críticos de seguridad.
- Configuración de conexión.
- Archivos cuya inmutabilidad sea realmente una condición del procedimiento.

### B. Protección de bases de datos activas

No comparar archivos `.ibd`, logs de transacciones ni otros archivos mutables como si fueran código inmutable.

La exclusión de hashes de archivos volátiles NO autoriza modificar sus contenidos.

Mantener medidas independientes que garanticen:

- `zarate_dev` fuera del alcance de escritura.
- Conexiones restringidas a `zarate_test`.
- Identidad del servidor y del directorio de datos.
- Puerto correcto.
- Usuario correcto.
- TLS válido.
- Prohibición de operaciones destructivas.
- Guarda vigente antes de cualquier escritura.

Documentar detalladamente qué verificaciones se ajustaron y por qué.

No utilizar una exclusión genérica que permita ocultar cambios en archivos de configuración, migraciones o scripts críticos.

## 5. CORREGIR LA VIGENCIA DE LA AUTORIZACIÓN

Identificar el punto exacto donde vence la autorización.

Corregir el orden de ejecución para que las verificaciones previas y las comprobaciones de vigencia no se contradigan.

Mantener un mecanismo de autorización válido, limitado y comprobado inmediatamente antes de operaciones sensibles.

Probar que la guarda rechaza:

- Una autorización vencida.
- Una base diferente de `zarate_test`.
- Un puerto inesperado.
- Un usuario con identidad no autorizada.
- Un certificado TLS inválido.
- Una ruta de datos ajena al entorno aislado.
- Un intento de utilizar `zarate_dev`.

No desactivar ninguna de estas protecciones.

Si la autorización requiere intervención humana nueva, informar y detener cualquier escritura hasta obtenerla.

## 6. PRUEBAS DE SEGURIDAD

Realizar pruebas positivas y negativas de las guardas utilizando simulaciones y verificaciones sin efectos sobre datos.

Las pruebas negativas deben demostrar que la protección continúa funcionando.

No utilizar la base `zarate_dev` para probar escrituras rechazadas.

No detener los servicios activos de demostración:

- MySQL desarrollo: 3307.
- Laravel desarrollo: 8000.
- React/Vite: 5173.

No modificar credenciales, `.env`, datos, tablas ni las migraciones originales.

## 7. VALIDACIÓN DEL MYSQL AISLADO

Una vez aprobadas las guardas, consultar en modo lectura:

- Identidad y puerto del servidor aislado.
- Base y usuario autorizados.
- TLS.
- Directorio físico.
- Tabla `migrations`.
- Tablas existentes.
- Índices y claves foráneas de Spatie Permission.
- Estado real de la quinta migración.

Verificar que la identidad observada corresponde al mismo entorno que se utilizaría para una operación posterior.

## 8. RECUPERACIÓN CONDICIONAL DE LA QUINTA MIGRACIÓN

Solo si:

- No quedan diferencias críticas sin explicar.
- Las guardas funcionan.
- Sus pruebas negativas están aprobadas.
- La identidad aislada está verificada.
- Existe autorización de escritura vigente.
- El esquema parcial fue diagnosticado nuevamente.

Aplicar la reparación mínima de la quinta migración, conforme a las definiciones Laravel originales.

No eliminar ni recrear tablas.

No utilizar `migrate:fresh`, `db:wipe`, `rollback` ni seeders.

No modificar `zarate_dev`.

Verificar la equivalencia completa del esquema antes de decidir si corresponde registrar la quinta migración como completada.

Si no se puede asegurar esa equivalencia, detenerse conservando el estado.

**No ejecutar las migraciones 6–14. No ejecutar todavía Pest ni Cypress.**

## 9. DOCUMENTACIÓN

Crear:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-23-correccion-guardas-volatiles.md`

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-guardas-volatiles.md`

Registrar:

- Causa del bloqueo.
- Clasificación definitiva de diferencias.
- Tratamiento de archivos InnoDB volátiles.
- Modificaciones mínimas a las guardas.
- Pruebas positivas y negativas.
- Estado de la autorización.
- Estado SQL real.
- Resultado de la quinta migración, si procede.
- Archivos modificados.
- Confirmación de aislamiento.
- Estado de Git.

No incluir contraseñas, datos privados, certificados ni tokens.

## 10. INFORME FINAL

Concluir con:

1. ¿Se corrigió el falso bloqueo por archivos `.ibd`?
2. ¿La protección de `zarate_dev` permanece activa?
3. ¿Se corrigió el problema de vigencia?
4. ¿Aprobaron las pruebas negativas de seguridad?
5. ¿Pudo consultarse nuevamente el MySQL aislado?
6. ¿Se recuperó la quinta migración?
7. ¿Cuántas migraciones están registradas ahora?
8. ¿Qué impide continuar, si existe un bloqueo?

Clasificar el resultado como:

- **QUINTA MIGRACIÓN RECUPERADA Y VERIFICADA**.
- **GUARDAS CORREGIDAS — QUINTA MIGRACIÓN PENDIENTE**.
- **DIAGNÓSTICO CORREGIDO — AUTORIZACIÓN PENDIENTE**.
- **BLOQUEADO POR SEGURIDAD**.

No realizar commits ni push automáticamente.

Trabajar con evidencias reales, mantener intactos los servicios de demostración y priorizar una recuperación segura y verificable.