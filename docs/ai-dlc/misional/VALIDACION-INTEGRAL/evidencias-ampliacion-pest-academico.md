# Prompt 33 — Ampliación progresiva de Pest académico

Fecha: 06/11/2026, America/Lima. Rama: test/integracion-misional.

## Continuidad y alcance

Se continúa desde Prompt 32: 314 casos inventariados, 40 distintos aprobados, 249 aserciones acreditadas y 274 pendientes. Se revisaron cierres 29–32, JUnit e inventario, junto con las fuentes del checker optimizado. Los 40 JUnit acreditados fueron contrastados sin ejecutarlos: 40 testcase aprobados y 249 aserciones, hashes intactos. No se incluyen los intentos históricos con error como casos aprobados adicionales. prior-junit-verification.json conserva esa trazabilidad.

Git mantiene los cambios previos, incluido evidencias-finalizacion-migraciones.md y documentos todavía no versionados. Las fuentes/artefactos privados permanecen bajo .tools, ignorado por Git. No se hace reset/clean, commit ni push. No se modifica el destino histórico de backend/AGENTS.md ni configuraciones funcionales: la autorización expresa actual exige zarate_pest, cuenta exclusiva y servidor aislado 3308.

## Selección de 26 casos distintos

Se seleccionaron solo IDs todavía presentes en inventory-initial-274.json: veinte de Sprint2 y seis de Sprint3. Cada dataset es un caso distinto de Pest, no una reejecución contada otra vez. cases.json conserva ID original, clase, método, dataset, hash del original/mirror, filtro, área y grupo. Los 26 filtros se comprobaron por descubrimiento bloqueante, sin SQL, bootstrap ni fixtures; seleccionan exactamente la clase/método/dataset esperados.

| Caso | Grupo operativo | Área | Archivo | Nombre original | Dataset |
| --- | ---: | --- | --- | --- | --- |
| C33-01 | 1 | Validaciones | Sprint2Test.php | validates academic status and rejects tenant injection | `('academic-years')` |
| C33-02 | 1 | Validaciones | Sprint2Test.php | validates academic status and rejects tenant injection | `('academic-periods')` |
| C33-03 | 1 | Validaciones | Sprint2Test.php | validates academic status and rejects tenant injection | `('education-levels')` |
| C33-04 | 1 | Validaciones | Sprint2Test.php | validates academic status and rejects tenant injection | `('grade-levels')` |
| C33-05 | 2 | Validaciones | Sprint2Test.php | validates academic status and rejects tenant injection | `('sections')` |
| C33-06 | 2 | Validaciones | Sprint2Test.php | validates academic status and rejects tenant injection | `('subjects')` |
| C33-07 | 2 | Roles y permisos | Sprint2Test.php | requires authentication for academic endpoints | `('academic-years')` |
| C33-08 | 2 | Roles y permisos | Sprint2Test.php | requires authentication for academic endpoints | `('academic-periods')` |
| C33-09 | 3 | Roles y permisos | Sprint2Test.php | requires authentication for academic endpoints | `('education-levels')` |
| C33-10 | 3 | Roles y permisos | Sprint2Test.php | requires authentication for academic endpoints | `('grade-levels')` |
| C33-11 | 3 | Roles y permisos | Sprint2Test.php | requires authentication for academic endpoints | `('sections')` |
| C33-12 | 3 | Roles y permisos | Sprint2Test.php | requires authentication for academic endpoints | `('subjects')` |
| C33-13 | 4 | Validaciones | Sprint2Test.php | rejects invalid academic date intervals | `('academic-years', '2027-04-01', '2027-04-01')` |
| C33-14 | 4 | Validaciones | Sprint2Test.php | rejects invalid academic date intervals | `('academic-years', '2027-05-01', '2027-04-01')` |
| C33-15 | 4 | Validaciones | Sprint2Test.php | rejects invalid academic date intervals | `('academic-periods', '2026-04-01', '2026-04-01')` |
| C33-16 | 4 | Validaciones | Sprint2Test.php | rejects invalid academic date intervals | `('academic-periods', '2026-05-01', '2026-04-01')` |
| C33-17 | 5 | Validaciones | Sprint2Test.php | rejects invalid academic date intervals | `('academic-years', '2027-02-30', '2027-12-01')` |
| C33-18 | 5 | Validaciones | Sprint2Test.php | rejects invalid academic date intervals | `('academic-periods', 'not-a-date', '2026-12-01')` |
| C33-19 | 5 | Catálogos académicos | Sprint2Test.php | rejects periods outside the year | `('2026-01-01', '2026-04-01')` |
| C33-20 | 5 | Catálogos académicos | Sprint2Test.php | rejects periods outside the year | `('2026-10-01', '2026-12-31')` |
| C33-21 | 6 | Personas | Sprint3Test.php | creates a hashed account and person atomically with the fixed role | `('students')` |
| C33-22 | 6 | Personas | Sprint3Test.php | creates a hashed account and person atomically with the fixed role | `('teachers')` |
| C33-23 | 6 | Personas | Sprint3Test.php | creates a hashed account and person atomically with the fixed role | `('guardians')` |
| C33-24 | 6 | Aislamiento | Sprint3Test.php | isolates person lists bindings and policies by institution | `('students')` |
| C33-25 | 7 | Aislamiento | Sprint3Test.php | isolates person lists bindings and policies by institution | `('teachers')` |
| C33-26 | 7 | Aislamiento | Sprint3Test.php | isolates person lists bindings and policies by institution | `('guardians')` |

Las áreas son exclusivas para contar sin duplicación. Validaciones incluye status/inyección institucional y fechas inválidas; roles/permisos aquí comprueba rechazo anónimo (no una matriz completa de roles); catálogos comprueba periodos fuera del año. Personas cubre creación atómica y rol fijo de estudiante/docente/apoderado; aislamiento cubre listas, binding y Policy frente a personas de otra institución. No se inventan entidades separadas de áreas/aulas. Relaciones familiares tienen cobertura previa del Prompt 28, no se repiten ni se certifican nuevos flujos de vinculación en este lote.

## Revisión técnica y restricciones

Se inspeccionaron Sprint2Test/Sprint3Test y hooks DatabaseTransactions, factories de User/Institution/Student/Teacher/Guardian, RolePermissionSeeder y sus seeders de permisos, AcademicService/SaveAcademicRequest, PeopleController, PersonService/SavePersonRequest, PeopleAudit, PersonPolicy y modelos/scopes. El fixture de permisos es sintético y ya autorizado; no es un seeder de demostración ni requiere db:seed. Los permisos de segunda institución son roles nuevos con givePermissionTo, no sync destructivo.

Los caminos admitidos usan INSERT/SELECT/UPDATE y savepoints; no se identificaron archivos, jobs externos ni DDL/DELETE en ellos. La llamada delete de FamilyService queda fuera: no se ejecuta un test de desvinculación. Los casos de soft delete/forceDelete, demo seeders, archivos no preparados y otros efectos permanecen excluidos. No se modifican reglas o aserciones para conseguir aprobaciones.

Las copias privadas de ambos archivos coinciden con los originales salvo los dos literales permitidos por archivo: expectativa de base y Origin. El test de hashing utiliza una contraseña sintética ya presente en el original, que no se reproduce en esta documentación. Los datos personales de factories no se exportan a documentos; solo se guardan métricas/IDs de casos y resultados sin secretos.

## Verificador y avance seguro

Se reutiliza sin cambiar semántica el verificador del Prompt 32: snapshot actual, handles de proceso de solo consulta/sincronización, ruta, argumentos, padre y creación, cinco propiedades normalizadas y filtro por nombre. Mantiene hash/identidad de archivos bloqueados, listener, mismo PDO/CONNECTION_ID sin reconexión, identidad SQL, grants, TLS y vigencia. La interfaz interna es específica del Windows x64 actual y falla cerrado: no hay fallback con datos incompletos ni decisiones cacheadas.

El sistema observado conserva Windows 10.0.26200 x64. Antes de Pest se repiten las necesarias negativas/paridad del nuevo perfil y del servidor real. La suite de procesos aprobó 13 comprobaciones sobre auxiliar propio y la de perfil SQL otras 13 offline, sin SQL; las negativas de reuso de PID son simulaciones de creación diferente, no reciclaje forzado. La API interna no habilita privilegios adicionales ni cambia Windows, antivirus, servicios WMI o firewall.

El supervisor comienza con cuatro casos y continúa en grupos de cuatro, más dos finales, solo después de aprobar JUnit, un BEGIN/un ROLLBACK explícitos, limpieza del mismo PDO e inspección externa del esquema/conteos. Se revisa además la edad máxima del gate: si llega a 100 s se detiene antes del siguiente caso para revisar un margen menor de 20 s. Es un criterio conservador de avance; **el límite de autorización real sigue en 120 s**. Se emite un gate fresco tras la preparación y antes de cada caso, nunca dentro de transacciones. No hay paralelismo ni reintentos automáticos.

La política mantiene cerrados zarate_dev/zarate_test, puerto 3308 y cuenta exclusiva. No se altera ningún servicio de demostración. Ante fallo se detiene el lote; no se corrige código funcional sin presentar defecto e impacto.

## Resultados

Los resultados, errores y tiempos se incorporarán desde JUnit e inspecciones reales; no se anticipa aprobación.


## Cierre del lote Prompt 33

Resultados del backend Laravel/MySQL real, sin API simulada. Se cuentan testcase individuales de JUnit, no los totales anidados de suites. Los 40 acreditados previamente no se ejecutaron de nuevo.

| Área | Nuevos ejecutados | Aprobados | Fallidos de aserción | Errores Pest | Sin ejecutar | Aserciones acreditadas |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Catálogos académicos | 2 | 2 | 0 | 0 | 0 | 8 |
| Validaciones | 12 | 12 | 0 | 0 | 0 | 42 |
| Personas | 3 | 3 | 0 | 0 | 0 | 39 |
| Roles y permisos | 6 | 6 | 0 | 0 | 0 | 18 |
| Aislamiento | 3 | 3 | 0 | 0 | 0 | 21 |

| Caso | Resultado | Aserciones registradas | CLI (s) | BEGIN–ROLLBACK (s) | Máxima edad gate (s) | Rollback/limpieza |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| C33-01 | PASSED | 5 | 26,534 | 24,775 | 27,015 | VERIFICADOS |
| C33-02 | PASSED | 5 | 26,540 | 25,014 | 27,141 | VERIFICADOS |
| C33-03 | PASSED | 5 | 26,340 | 24,838 | 27,056 | VERIFICADOS |
| C33-04 | PASSED | 5 | 26,919 | 25,364 | 27,199 | VERIFICADOS |
| C33-05 | PASSED | 5 | 24,608 | 23,128 | 24,931 | VERIFICADOS |
| C33-06 | PASSED | 5 | 25,852 | 24,374 | 26,463 | VERIFICADOS |
| C33-07 | PASSED | 3 | 26,464 | 24,931 | 27,403 | VERIFICADOS |
| C33-08 | PASSED | 3 | 25,952 | 24,405 | 26,606 | VERIFICADOS |
| C33-09 | PASSED | 3 | 25,399 | 23,872 | 25,818 | VERIFICADOS |
| C33-10 | PASSED | 3 | 24,830 | 23,374 | 24,949 | VERIFICADOS |
| C33-11 | PASSED | 3 | 25,714 | 24,092 | 26,073 | VERIFICADOS |
| C33-12 | PASSED | 3 | 24,631 | 23,126 | 24,693 | VERIFICADOS |
| C33-13 | PASSED | 2 | 25,134 | 23,679 | 26,130 | VERIFICADOS |
| C33-14 | PASSED | 2 | 25,343 | 23,877 | 25,504 | VERIFICADOS |
| C33-15 | PASSED | 2 | 29,416 | 27,658 | 30,055 | VERIFICADOS |
| C33-16 | PASSED | 2 | 25,419 | 23,974 | 25,696 | VERIFICADOS |
| C33-17 | PASSED | 2 | 25,071 | 23,590 | 26,097 | VERIFICADOS |
| C33-18 | PASSED | 2 | 25,110 | 23,592 | 25,886 | VERIFICADOS |
| C33-19 | PASSED | 4 | 25,123 | 23,692 | 26,028 | VERIFICADOS |
| C33-20 | PASSED | 4 | 25,337 | 23,882 | 25,893 | VERIFICADOS |
| C33-21 | PASSED | 13 | 27,560 | 26,088 | 28,545 | VERIFICADOS |
| C33-22 | PASSED | 13 | 25,789 | 24,363 | 26,353 | VERIFICADOS |
| C33-23 | PASSED | 13 | 26,492 | 24,999 | 27,187 | VERIFICADOS |
| C33-24 | PASSED | 7 | 40,815 | 39,284 | 41,144 | VERIFICADOS |
| C33-25 | PASSED | 7 | 40,394 | 38,980 | 41,014 | VERIFICADOS |
| C33-26 | PASSED | 7 | 39,941 | 38,394 | 40,130 | VERIFICADOS |

| Indicador | Resultado |
| --- | ---: |
| Seleccionados | 26 |
| Nuevos distintos ejecutados | 26 |
| Nuevos aprobados | 26 |
| Fallos de aserción | 0 |
| Errores Pest | 0 |
| Sin aprobación dentro del lote | 0 |
| Nuevas aserciones acreditadas | 128 |
| Acumulado distintos aprobados | 66 |
| Acumulado aserciones acreditadas | 377 |
| Pendientes del inventario | 248 |
| Rollbacks explícitos comprobados | 26 |

No se suman controles offline, benchmarks o denegaciones de conexión como casos Pest. Las aserciones de cualquier ejecución con error no se añaden al acumulado acreditado. summary33.json e inventory-remaining.json conservan el conteo por ID y los pendientes, sin repetir aprobados.

### Grupos y margen temporal

- Grupo 1: 4 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 2: 4 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 3: 4 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 4: 4 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 5: 4 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 6: 4 aprobados, rollback y esquema comprobados antes de continuar.
- Grupo 7: 2 aprobados, rollback y esquema comprobados antes de continuar.

La edad máxima observada de gate fue 41,144 s; margen mínimo observado 78,856 s. case-margin-checks.jsonl registra cada aceptación y el margen. Se conserva TTL 120, sin renovaciones en transacción ni reintentos automáticos. Los tiempos CLI incluyen bootstrap/fixtures/test/cierre; BEGIN–ROLLBACK no es un tiempo exclusivo de factories. Los agregados de atestación se superponen con esas etapas, no se suman otra vez.

### Revalidación del checker y seguridad

El contrato nativo fue revalidado en Windows x64 actual. Tres ejecutables independientes sobre monitor/worker reales coincidieron en PID/padre/ruta/command line/creación y filtro por nombre. La referencia WMI se conserva y se compararon cuarenta llamadas intercaladas por checker: original 74,211 ms, candidato 15,300 ms; atestación completa 31,472 ms. La estimación previa conservadora de 700 atestaciones más 15 segundos fue 37,030 s; no sustituyó las mediciones reales por caso ni la vigencia. native-validation.json conserva las tres muestras independientes y la dispersión, no solo el resultado más favorable.

Aprobaron las 13 comprobaciones offline de perfil, 13 del harness de proceso (una positiva y doce negativas), siete rechazos adicionales de identidad SQL/certificados y seis tokens inválidos rechazados por ambos checkers. Se distinguen simulación de creación diferente con mismo PID, ausencia de información y terminación real de auxiliar; no se fuerza reutilización de PID ni se presume acceso a todos los procesos protegidos. Los tokens negativos se restauran exactamente sin extender edad, sin transacciones activas ni SQL durante la mutación.

Paridad nativa/PowerShell, identidad efectiva, UUID/directorio, cuenta/base/puerto exclusivos, mismo PDO/CONNECTION_ID sin reconexión, grants y TLS estrictos se conservaron. Las negativas iniciales/finales del servidor rechazaron zarate_dev/zarate_test con error 1044, cero escrituras. La validación de certificados negativos es local, no una conexión a un endpoint TLS hostil. No se cambió Windows, antivirus, firewall, servicios WMI o configuración global. No se habilitaron privilegios adicionales.

La interfaz NtQueryInformationProcess sigue siendo interna y específica del entorno x64 probado: acceso fallido, formato inesperado o propiedades incompletas deben bloquear la ejecución. Una actualización de SO/instrumental exige revalidar. No se reemplazan decisiones vigentes por snapshots cacheados. GetProcessTimes mantiene la precisión de microsegundos que ofrecía CIM.

### Estado final SQL, incidencias y cierre

Inspección final: SCHEMA_AND_COUNTS_PRESERVED, 52 tablas, 14 migraciones, 0 filas fuera del repositorio de migraciones; 51 tablas de aplicación vacías y migrations con 14 filas. Tablas InnoDB, columnas, índices, claves, reglas, triggers y migraciones coinciden con el baseline antes/después de cada caso y al final. Igualdad lógica, no identidad binaria de InnoDB ni de contadores autoincrementales. No hubo DDL, migraciones, DELETE, DROP, TRUNCATE, seeders demo, Cypress o suite completa.

Servidor cerrado=true, worker exit=0, errores MySQL=0, procesos=0, PID ausente=true. Avisos=1: CA privada autofirmada, manteniendo verificación de cadena/IP. El cierre contó 1 entradas TCP; comprobación posterior: 0 entradas, 0 listeners y 0 procesos. Se señaló exclusivamente el árbol propio mediante el procedimiento validado, sin detener demostración 3307/8000/5173.

No hubo fallos, errores, expiraciones ni reintentos en el lote. No se confirmó defecto funcional en los casos ejecutados y no se aplicó corrección funcional. El margen temporal se validó por caso, sin disminuir las guardas para incorporar personas.

### Evidencia, cambios y próximos módulos

Privados: .tools/misional-isolated/evidence/prompt33. Por caso: run/caseN.xml, metrics-PID.json, effects-PID.json, clean-PID-after-rollback.json, pre/post-caseN.stdout.json y snapshots de esquema/conteos. Por grupo: group-N.json. Consolidación: summary33.json, inventory-remaining.json, native-validation.json y preservation-audit33-final.json.

Nuevos públicos: prompt-33-ampliacion-pest-academico.md (literal) y este documento. Nuevos privados: Build33.php, PrepareReports33.php, Summary33.php, Audit33.php, Close33.php, wrappers/perfiles, mirrors y evidencias de prompt33. Los originales de backend/frontend, pruebas, factories y migraciones no se modificaron. Las modificaciones previas de Git permanecen. La auditoría revisa pins, todos los documentos anteriores y los 40 JUnit acreditados, además de exposición de la credencial privada de pruebas y APP_KEY. git diff --check se registra al cierre. Sin commits ni push.

Los pendientes conservan su inventario exacto en inventory-remaining.json. Recomendación siguiente: continuar personas con validaciones de campos/cuenta, unicidad institucional y permisos de secretaría, y revisar los vínculos familiares antes de seleccionarlos. FamilyService tiene un camino de eliminación que no debe admitirse silenciosamente; relaciones sin desvinculación pueden evaluarse después de revisar sus tests concretos. Mantener bloqueados DELETE, seeders demo, archivos privados no preparados y conexiones/efectos externos. No se ejecutó ningún lote siguiente.

**A. LOTE AMPLIADO APROBADO.** La cobertura se limita a los casos acreditados, no a todos los módulos ni a los pendientes.
