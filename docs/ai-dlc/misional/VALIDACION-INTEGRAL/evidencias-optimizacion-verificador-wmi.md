# Prompt 32 — Diagnóstico y alternativa al verificador WMI

Fecha: 06/11/2026, America/Lima. Rama: `test/integracion-misional`.

## Estado inicial y alcance

Se conserva el cierre bloqueado del Prompt 31: 29 casos distintos aprobados, 211 aserciones acreditadas, 285 pendientes; C31-01 aprobado, C31-02 con error histórico de expiración posterior al rollback y diez casos no ejecutados. Se revisaron informes y herramientas 28–31, variantes R/S/T/U, JUnit y métricas. Los tres ensayos previos descartados no se repiten: opciones de enumeración, dos consultas WMI directas y canal WMI reutilizado. El instrumental original sigue intacto.

Se prepara un directorio privado nuevo `.tools/misional-isolated/evidence/prompt32`, con referencia original y candidato. Solo se admiten los once IDs sin aprobación del Prompt 31; el aprobado queda fuera. No hay autorización para la suite completa, otros datasets, DELETE, DDL, seeders demo o Cypress. Se conservan cambios Git anteriores y las credenciales permanecen fuera de documentos y Git.

## Contrato de seguridad y matriz de equivalencia

El mecanismo original solicita ProcessId, ParentProcessId, ExecutablePath, CommandLine y CreationDate de Win32_Process con filtro Name=mysqld.exe. Son cinco propiedades devueltas y un filtro por nombre. El proveedor puede enumerar internamente para responder; no se afirma su implementación sin trazas. La enumeración/resultados, no los getters individuales, concentran la latencia medida. Obtener solo ruta o PID mediante Get-Process no reemplaza el contrato completo.

| Comprobación | Fuente original e información | Tiempo observado inicial | Riesgo que previene | Alternativa y condición de equivalencia |
| --- | --- | --- | --- | --- |
| Inventario de motores | Win32_Process filtrado por Name; exactamente monitor/worker | Comparte consulta WMI, 57–81 ms en benchmarks locales | Tercer motor o proceso equivocado | Snapshot fresco Toolhelp32; mismos nombres y exactamente dos IDs |
| PID y proceso vivo | ProcessId y pertenencia al conjunto autorizado | Getter pequeño; coste compartido de enumeración | Confusión de procesos o desaparición | OpenProcess de solo consulta y sincronización, GetProcessId y comprobación de vida antes/después |
| Proceso padre | ParentProcessId del worker igual al monitor | Coste compartido | Worker ajeno al árbol controlado | Parent PID del snapshot actual, comparado con monitor vigente |
| Ruta ejecutable | ExecutablePath igual a la ruta aprobada | Coste compartido | Ejecutable distinto | QueryFullProcessImageNameW con ruta Win32 completa, comparación sin distinguir mayúsculas |
| Argumentos | CommandLine contiene los seis flags originales | Coste compartido | Defaults/logs/arranque no autorizados | Lectura fresca específica de command line; conservar todos los flags originales, sin sustituirlos por ruta |
| Momento de inicio | CreationDate convertido a ticks UTC | Coste compartido | Reutilización de PID | GetProcessTimes normalizado a microsegundos, precisión original de CIM; coincidencia exacta comprobada |
| Listener | GetExtendedTcpTable, loopback 3308 y PID correcto | Se conserva; referencia previa ~0,4 ms | Servidor/puerto ajenos | Sin cambio de API ni predicado |
| Imagen/configuración/CA | Hash inicial, handles sin escritura/renombrado, identidad de archivo por operación | Se conserva; agregado previo incluye aperturas frías | Sustitución o alteración de archivos | Sin cambio; no cache de autorización, sino evidencia de inmutabilidad por handle |
| Usuario/base/host/puerto/TLS | Configuración efectiva y consultas de la conexión PDO original | Se conservan todos los diagnósticos SQL | Conexión institucional equivocada | Sin cambio; mismas autorizaciones, mismo PDO/CONNECTION_ID y sin reconexión |
| Vigencia | Gate íntegro y edad máxima 120 s | Se conserva | Uso de autorización vencida | Sin renovación dentro de transacción; rechazo antes de continuar |
| Propietario del proceso Windows | No era una propiedad consultada por el contrato original | NO APLICA | No se inventa esa cobertura | No se declara una comprobación de propietario nueva; ACL de archivos y CURRENT_USER MySQL son controles distintos |

Los tiempos compartidos de WMI no se suman por propiedad. Se miden aparte llamada Get, enumeración y cada getter. No había PowerShell nuevo por cada operación en el instrumental anterior: ya usaba un checker persistente por PHP. PowerShell se conserva para supervisión y paridad de arranque; no se atribuye una ganancia nueva a eliminar un coste que ya no existía por SQL.

Desglose individual de `local-process-valid-benchmark-1.json`, 21 consultas sobre un proceso propio: Get acumuló 67,8253 ms (3,2298 ms/consulta) y la llegada/enumeración de la instancia 1549,7793 ms (73,7990 ms/consulta). Los getters, medidos por separado, fueron:

| Getter | Acumulado de 21 lecturas (ms) | Media por lectura (ms) |
| --- | ---: | ---: |
| ProcessId | 0,2967 | 0,01413 |
| ParentProcessId | 0,0763 | 0,00363 |
| ExecutablePath | 0,1752 | 0,00834 |
| CommandLine | 0,4801 | 0,02286 |
| CreationDate | 0,1009 | 0,00480 |

La demora está antes de esos getters, no en el coste de extraer CommandLine o CreationDate del objeto ya recibido. Estos son tiempos del cliente, no un perfil interno del proveedor. La clave heredada `wmiMs` de `native-stages-native.jsonl` mide ahora la captura nativa; no representa una llamada WMI en el candidato. Las muestras positivas no tuvieron accesos incompletos; las negativas distinguen datos incompletos simulados y proceso terminado real, sin afirmar acceso probado a todos los procesos protegidos de Windows.

## Alternativas nuevas y fuentes técnicas

Se evaluó la API CIM instalada con Windows (Microsoft.Management.Infrastructure 1.0, GAC), sin instalar paquetes ni alterar servicios. Tres procesos de benchmark independientes compararon WMI, consulta CIM y GetInstance por clave Handle sobre un proceso propio, con coincidencia completa de propiedades. La consulta CIM siguió siendo lenta; por clave disminuyó el tiempo de un proceso, pero verificar dos no proporcionó un margen claro. No se adoptó como solución por equivalencia nominal.

El candidato nativo combina snapshot Toolhelp32, QueryFullProcessImageNameW, GetProcessTimes y NtQueryInformationProcess para la línea de comandos. No usa lectura/escritura arbitraria de memoria remota ni habilita SeDebugPrivilege. Solicita únicamente consulta limitada y sincronización; rechaza accesos fallidos, buffers/longitudes inválidos, APIs ausentes y datos incompletos. No hay fallback permisivo.

**Límite técnico:** ProcessCommandLineInformation (clase 60) es una interfaz interna, no una garantía portable de Windows. Se resuelve NtQueryInformationProcess dinámicamente en ntdll ya cargada; se valida el buffer dentro de la memoria asignada al llamante. Microsoft advierte que la función puede cambiar. La equivalencia se limita al Windows x64 observado (10.0.26200), los procesos y negativas comprobados; una actualización requiere revalidación. No se presenta QueryFullProcessImageName como sustituto de argumentos o padre.

Referencias primarias consultadas: [CimSession](https://learn.microsoft.com/dotnet/api/microsoft.management.infrastructure.cimsession), [QueryFullProcessImageNameW](https://learn.microsoft.com/windows/win32/api/winbase/nf-winbase-queryfullprocessimagenamew), [GetProcessTimes](https://learn.microsoft.com/windows/win32/api/processthreadsapi/nf-processthreadsapi-getprocesstimes), [Process32FirstW](https://learn.microsoft.com/windows/win32/api/tlhelp32/nf-tlhelp32-process32firstw), [NtQueryInformationProcess y su advertencia de compatibilidad](https://learn.microsoft.com/windows/win32/api/winternl/nf-winternl-ntqueryinformationprocess). El identificador 60 se contrastó con el [header primario de System Informer/phnt](https://github.com/winsiderss/phnt/blob/master/ntpsapi.h); no se importó ni instaló esa biblioteca.

## Ensayos locales previos, sin MySQL ni Pest

| Ejecución independiente | WMI (ms medios calientes) | CIM Query (ms) | CIM por clave (ms) |
| --- | ---: | ---: | ---: |
| 1 | 76,771 | 62,566 | 39,103 |
| 2 | 75,721 | 64,694 | 38,045 |
| 3 | 65,729 | 60,209 | 37,666 |

| Ejecución independiente | WMI (ms medios calientes) | Captura nativa completa (ms) | Coincidencia |
| --- | ---: | ---: | --- |
| 1 | 57,017 | 7,144 | Todas las propiedades |
| 2 | 60,322 | 7,042 | Todas las propiedades |
| 3 | 61,621 | 9,548 | Todas las propiedades |

Cada ejecutable registra primera llamada fría, veinte posteriores, mínimo, máximo, muestras y CPU propia. No mide CPU del proveedor WMI ni del motor MySQL. Los valores corresponden a un proceso propio: no bastan para autorizar Pest sobre el servidor. Se requiere paridad adicional de monitor/worker reales y margen de atestación completa.

Se conservaron dos incidencias de compilación: ambigüedad CimType, corregida calificando el tipo; imports duplicados, corregidos en el ensamblado de fuentes. No hubo SQL/Pest en esos fallos. Los archivos local-process-benchmark-1..3 producidos por el intento fallido son inválidos y no se cuentan; las mediciones válidas usan local-process-valid-benchmark-* y native-process-benchmark-*. Ningún fallo se ocultó modificando aserciones.

El harness nativo aprobó 13 comprobaciones sobre un auxiliar propio: proceso correcto; PID/ruta/argumentos/padre diferentes; cambio de creación con el mismo PID (simulación de reutilización); ausencia de cada una de las cinco claves normalizadas; PID inexistente y proceso realmente terminado. No se forzó reutilización real de PID ni se cambió MySQL para probar argumentos incorrectos. Los errores de información son rechazo, nunca aceptación. El mismo ProcessRules32 valida producción y negativas; el ejecutable real mantiene fija la ruta de mysqld, no acepta la ruta del auxiliar.

## Condición previa a la reanudación

El supervisor conserva preflight de archivos/ACL/procesos, TLS, identidad SQL, 52 tablas/14 migraciones, cero residuos y denegaciones a bases protegidas. Antes de Pest exige tres benchmarks independientes sobre los dos MySQL reales, paridad completa de PID/padre/ruta/command line/creación, comparación intercalada de los checkers y negativas. Las estimaciones de rendimiento no sustituyen identidad o autorización. Se conserva TTL 120 y la política SQL original sin DELETE/DDL.

Los resultados vivos y Pest, si la condición aprueba, se anexarán desde sus archivos reales. Todavía no se declara optimización adoptada ni finalización de Prompt 31.


## Resultado vivo y reanudación del Prompt 31

Antes de Pest se comprobaron tres procesos de benchmark independientes sobre monitor/worker MySQL reales. Coincidieron todas las propiedades normalizadas, no solo la ruta. Sus muestras frías/calientes, variabilidad, CPU propia y etapas están en run/snapshot-properties-N.json.

| Ejecución MySQL | WMI medio caliente (ms) | Nativo medio caliente (ms) | Coincidencia de las cinco propiedades devueltas y el filtro por nombre |
| --- | ---: | ---: | --- |
| 1 | 117,021 | 7,043 | APROBADA |
| 2 | 63,424 | 17,941 | APROBADA |
| 3 | 97,003 | 8,862 | APROBADA |

Además se compararon cuarenta llamadas por checker intercaladas, descartando solo la primera para la media caliente y conservando las muestras. El checker original promedió 78,728 ms y el candidato 15,138 ms; cociente 0,192. La atestación completa media fue 34,461 ms; la estimación conservadora de 700 atestaciones más 15 segundos resultó 39,123 s. No se trató como garantía: se midió después el ciclo Pest completo y se mantuvo el corte real de 120 s.

### Equivalencia y negativas

Pasaron las trece comprobaciones offline previas de perfil/vigencia/SQL prohibido, las trece del harness de procesos y las siete negativas adicionales de identidad SQL (base, puerto, cuenta, directorio, UUID) y certificados (PEM inválido y CA firmante incorrecta). Las negativas de certificados no se presentan como conexiones reales a un endpoint TLS hostil: son rechazo de configuración/certificados. El handshake real positivo conserva verificación estricta de CA/IP y cipher.

En el servidor real, ambos checkers rechazaron seis tokens deliberadamente inválidos: vencido, PID inexistente, PID diferente, creación incorrecta, hash de configuración incorrecto y hash de CA incorrecto (doce rechazos en total). Se restauraron los bytes originales del gate sin extender su edad, con cero transacciones activas y cero SQL durante la alteración. Se verificó la paridad con el checker PowerShell/CIM anterior. Las negativas iniciales/finales de MySQL rechazaron realmente zarate_dev/zarate_test mediante error 1044, sin escrituras.

La reutilización de PID se probó por simulación del mismo PID con otra creación; no se forzó una reutilización real del sistema. El proceso terminado fue un auxiliar propio que salió normalmente, no MySQL. Información ausente, API no soportada, buffers inválidos y accesos fallidos provocan rechazo en código; no se declara una prueba de ACL sobre todos los procesos protegidos de Windows. No se añadieron privilegios del SO ni se cambió antivirus/firewall/WMI.

El cambio adoptado es solo la obtención de propiedades del proceso en el checker privado. Se conservaron todos los predicados originales de PID/padre/ruta/flags/creación, inventario de dos motores, listener, archivos, identidad MySQL/TLS/grants y guardas SQL. No hay WMI por cada operación sensible en el candidato; sigue presente en el preflight/paridad y en la referencia para regresión. No se cachean capturas ni autorizaciones. Los handles de archivo inmutables conservan el mecanismo ya validado, sin ampliarlo.

### Casos Pest y tiempos reales

Se mantuvo C31-01 acreditado y se reanudaron exclusivamente los once sin aprobación. C31-02 usó el único reintento controlado; no se contó el intento antiguo como un caso distinto adicional. Los otros diez son primeras ejecuciones. Fixtures y aserciones son los originales con los dos literales privados de conexión/Origin permitidos; no hubo correcciones funcionales para aprobarlos.

| Caso original | Origen | Resultado final | Aserciones acreditadas | CLI (s) | Edad máxima del gate (s) | Rollback/limpieza final |
| --- | --- | --- | ---: | ---: | ---: | --- |
| C31-01 | Retenido P31 | PASSED | 4 | 74,708 | 75,428 | VERIFICADOS |
| C31-02 | P32 | PASSED | 4 | 52,251 | 51,480 | VERIFICADOS |
| C31-03 | P32 | PASSED | 4 | 25,938 | 26,817 | VERIFICADOS |
| C31-04 | P32 | PASSED | 4 | 25,978 | 26,149 | VERIFICADOS |
| C31-05 | P32 | PASSED | 4 | 26,895 | 27,662 | VERIFICADOS |
| C31-06 | P32 | PASSED | 4 | 26,772 | 26,847 | VERIFICADOS |
| C31-07 | P32 | PASSED | 3 | 26,588 | 27,075 | VERIFICADOS |
| C31-08 | P32 | PASSED | 3 | 26,896 | 27,643 | VERIFICADOS |
| C31-09 | P32 | PASSED | 3 | 26,818 | 26,956 | VERIFICADOS |
| C31-10 | P32 | PASSED | 3 | 31,026 | 31,136 | VERIFICADOS |
| C31-11 | P32 | PASSED | 3 | 27,561 | 27,919 | VERIFICADOS |
| C31-12 | P32 | PASSED | 3 | 26,765 | 27,362 | VERIFICADOS |

| Grupo original | Total | Aprobados finales | Errores finales | Sin ejecutar | Aserciones acreditadas |
| --- | ---: | ---: | ---: | ---: | ---: |
| Campos obligatorios | 6 | 6 | 0 | 0 | 24 |
| Duplicados académicos | 6 | 6 | 0 | 0 | 18 |

Recuperación: 11 ejecuciones Pest, 11 casos adicionales acreditados y 38 aserciones nuevas acreditadas. Prompt 31 completo conserva 12 casos distintos aprobados y 42 aserciones. Acumulado del proyecto: **40 casos distintos aprobados, 249 aserciones acreditadas y 274 pendientes**. El error de entorno original queda preservado como histórico, no como un fallo oculto ni otra prueba aprobada. summary32.json e inventory-remaining.json documentan el conteo por ID.

Los cuatro grupos de recuperación tienen 3/3/3/2 casos: solo se avanzó tras JUnit, BEGIN/ROLLBACK explícitos y comprobantes limpios del mismo PDO y de otro proceso. No hubo limpieza DELETE. Los once rollbacks nuevos se verifican en effects-PID y clean-PID-after-rollback; junto al aprobado retenido acreditan los doce casos finales, sin borrar los dos intentos originales. La ausencia del comprobante vigente del antiguo C31-02 se conserva en su historial.

Las limitaciones funcionales de los tests no se amplían: POST vacío verifica name; duplicado verifica primer 201 y siguiente 422, sin identificar por sí solo el índice causante ni comprobar cada formato o igualdad permitida entre instituciones. No se afirma que estos doce tests cubran toda evaluación académica.

### Estado SQL, seguridad y cierre

Inspección final SCHEMA_AND_COUNTS_PRESERVED: 52 tablas, 14 migraciones, 0 filas fuera del repositorio de migraciones; esquema/índices/claves/reglas/triggers iguales al baseline, 51 tablas de aplicación vacías y migrations con sus 14 filas. Igualdad lógica, no binaria de InnoDB ni de contadores autoincrementales. Sin DDL, migraciones, DELETE, DROP, TRUNCATE, seeders demo, Cypress o suite completa. TLS, cuenta/base/puerto exclusivos y aislamiento se comprobaron antes/después.

Servidor cerrado=true, worker exit=0, errores=0, procesos MySQL=0, PID ausente=true. Avisos=1: CA privada autofirmada, con verificación TLS activa. El reporte de cierre contó 1 entradas TCP; post-shutdown-network.json registró después 0 entradas, 0 listeners y 0 procesos. El monitor recibió la señal de cierre controlado al árbol propio. No se detuvieron servicios de demostración.

### Archivos, riesgos y siguiente etapa

Nuevos públicos: prompt-32-optimizacion-verificador-wmi.md (literal) y este documento. Nuevos privados: CimProbe32.cs, BuildProbe32v2.php, BuildNativeProbe32.php, BuildRuntime32.php, FinishRuntime32.php, PrepareResults32.php, Summary32.php, Audit32.php y Close32.php; fuentes/ejecutables/perfiles/checks y registros en prompt32. Evidencias P31 se actualizan solo por anexo porque las pruebas se reanudaron. No se modificó backend/frontend, migraciones, roles, permisos, cuentas, contraseñas ni configuración de desarrollo. Los cambios Git anteriores se conservaron; sin commits/push.

Audit32 comprueba los pins anteriores/nuevos, 78 archivos del intento P31, documentos previos y el prefijo de las evidencias P31, prompt literal y ausencia de la credencial privada/APP_KEY en salidas. Los intentos inválidos de compilación permanecen identificados en build-incidents.json; no son tests aprobados. git diff --check se registra al cerrar.

Riesgo residual: API interna específica del Windows x64 probado. Cambios de versión o incapacidad de leer una propiedad requieren revalidación; el diseño falla cerrado, sin sustituir command line por datos antiguos ni ruta. Las pruebas de equivalencia son evidencia local, no garantía universal sobre todas las versiones de Windows o procesos protegidos. Mantener el baseline para regresión y repetir paridad/negativas al cambiar instrumental o SO. No se habilitan automáticamente los demás casos, DELETE, archivos o seeders.

Si el lote final está aprobado, puede proponerse después el lote de veinte IDs ya revisados (status/inyección, autenticación y fechas), manteniendo procesos independientes, grupos pequeños y gates de 120 s. No se ejecutó ese lote en Prompt 32.

**A. VERIFICADOR OPTIMIZADO — PROMPT 31 COMPLETADO.**
