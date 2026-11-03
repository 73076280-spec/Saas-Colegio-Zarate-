# Plan AI-DLC propuesto — Macroproceso estratégico

**Estado:** propuesta para revisión humana. No autoriza ni registra implementación.
**Base revisada:** rama `feature/macro-estrategico`, commit `0d98612`.
**Responsable institucional:** integrante asignado al macroproceso; nombre y aprobaciones pendientes de confirmación.

| ID | PE | Descripción y categoría | RF | Responsable | Entradas | Entregables y aceptación | Pruebas y evidencias previstas | Riesgos |
|---|---|---|---|---|---|---|---|---|
| BOLT-EST-001 | PE-01.1 | Auditar y documentar cómo se definen objetivos y metas. Tipo A: procedimiento institucional documentable. La auditoría inicial de existencia en EcoAula está realizada; la descripción institucional AS-IS/TO-BE sigue pendiente de información del responsable. | Sin RF / requerir aprobación para automatización. | Integrante asignado; nombre por confirmar. | Procedimiento aprobado, responsables, horizonte, fuentes y formatos institucionales que el responsable proporcione. | Ficha AS-IS/TO-BE con actor, disparador, entradas, actividades, reglas, salidas y evidencias; cada dato ausente se marca pendiente, no se inventa. Aceptación: revisión del responsable institucional. | Revisión documental y referencias al código/matriz; prompts y decisiones en esta carpeta. No requiere prueba de código si solo es documentación. | Presentar como institucional un flujo que solo se supuso; confundir indicadores operativos con metas. |
| BOLT-EST-002 | PE-01.2 | Auditar y documentar la supervisión institucional de objetivos; la auditoría técnica de reportes/dashboards está completada, pero validar indicadores aprobados y proceso institucional sigue pendiente. Tipo A/B. | Sin RF directo / RF-23 solo si se confirma que el reporte aprobado corresponde al indicador. | Integrante asignado; nombre por confirmar. | Objetivos aprobados, periodicidad, fórmula, umbral, dueño y fuente autorizada. | Matriz objetivo-indicador-fuente-fórmula-periodicidad-responsable-decisión. Aceptación: responsable aprueba cada definición y las capacidades existentes quedan trazadas o marcadas no disponibles. | Revisión de código y pruebas de reportes ya existentes; evidencia de aprobación institucional. | Métricas incompatibles, fórmulas ambiguas o atribuir capacidad estratégica a un dashboard operativo. |
| BOLT-EST-003 | PE-02.1 | Confirmar el procedimiento institucional del calendario y documentar el uso/reglas aprobadas frente a la configuración existente de años y periodos. Prompts 08–09: auditoría completada; la mejora condicionada no cumple aprobación. Tipo A/B. | Sin RF directo identificado para configuración de calendario; revisar RF relacionado solo con una definición oficial del responsable. | Integrante asignado; nombre por confirmar. | Calendario oficial, autoridad de aprobación, cierres y excepciones institucionales. | Procedimiento y trazabilidad entre reglas institucionales y años/periodos existentes. Aceptación: calendario oficial y desviaciones verificadas; no se modifican fechas ni datos de demo. | Revisión de Sprint 2, pruebas Pest/Cypress existentes y aprobación del calendario. | Confundir datos demo con calendario oficial o alterar datos históricos. |
| BOLT-EST-004 | PE-02.2 | Aclarar si “áreas” significa asignaturas u otro concepto institucional y documentar la organización aprobada frente a niveles, grados, secciones y asignaturas actuales. Prompts 10–11: auditoría completada; mejora condicionada no aprobada. Tipo A/B. | Sin RF directo identificado para PE-02.2. | Integrante asignado; nombre por confirmar. | Definición institucional de área curricular, jerarquía, responsables y reglas de asignación; confirmar si incluye aulas físicas. | Glosario y mapa de correspondencia aprobado; diferencias quedan registradas como brechas, sin duplicar catálogos. | Revisión de Sprint 2, modelos, pantallas y pruebas; aprobación del responsable académico. | Equiparar sin validación áreas con asignaturas, aulas físicas con aula virtual o crear catálogos duplicados. |
| BOLT-EST-005 | PE-03.1 | Trazar indicadores institucionales aprobados a los 20 reportes y seis dashboards existentes, incluidos definición, fuente, cálculo, filtros y permisos. Prompts 12–13: auditoría del sistema terminada; definiciones estratégicas y aprobación de una mejora aún no disponibles. Tipo B. | RF-23 Generación de reportes es relacionado, no evidencia por sí solo de evaluación estratégica. | Integrante asignado; nombre por confirmar. | Lista aprobada de indicadores, fórmulas, fuentes, periodicidad, segmentación y roles autorizados. | Matriz de cobertura que identifique reporte/datos/pruebas existentes o marque “no disponible”; no se inventan KPIs. Aceptación: responsable confirma fórmula y uso de cada indicador. | Sprint10Test, reportes Cypress, lectura del servicio de reportes y revisión de fórmulas aprobadas. | Duplicar reportes, exponer datos o interpretar una métrica operativa como cumplimiento de objetivo. |
| BOLT-EST-006 | PE-03.2 | Prompts 14–17: auditoría AS-IS/TO-BE y decisión de documentar sin programar mientras no haya autorización explícita; pruebas intentadas, bloqueadas por entorno; checklist de entrega pendiente de PR/commit. Tipo A; una futura aplicación sería D. | Sin RF / requerir aprobación. | Integrante asignado; nombre por confirmar. | Flujo vigente, responsable, estados, evidencias, plazos, aprobadores y retención institucional. | Ficha AS-IS/TO-BE; si se solicita software, una propuesta separada con historia, permisos, institución, trazabilidad y criterios. Aceptación: proceso aprobado; no se crea módulo en este Bolt. | Revisión documental y aprobación humana; pruebas de código solo en un Bolt futuro aprobado. | Confundir auditoría técnica con plan de mejora, introducir estados no aprobados o ampliar alcance. |

## Resultado del diagnóstico Prompt 02

| Procedimiento | Categoría comprobada | Brecha principal y RF |
|---|---|---|
| PE-01.1 — Definir objetivos y metas | A: procedimiento institucional documentable. D si se solicita automatizarlo. | No hay función ni proceso institucional verificado en el repositorio. Sin RF directo identificado. Auditoría detallada en [BOLT-EST-001](BOLT-EST-001/evidencias.md). |
| PE-01.2 — Supervisar cumplimiento | A para documentar; B para contrastar definiciones aprobadas con reportes existentes; D si se pide seguimiento de metas. | Hay reportes operativos, no medición frente a objetivos/metas aprobados. Sin RF directo; RF-23 solo podría relacionarse con reportes validados. |
| PE-02.1 — Configurar periodos y calendario | B: años y periodos ya están implementados y cubiertos por pruebas. | No se verificó el calendario oficial, su aprobación ni eventos/feriados. No se halló un RF directo de calendario en la matriz; no alterar datos demo. |
| PE-02.2 — Organizar grados, secciones y áreas | B: niveles, grados, secciones y asignaturas existen y tienen pruebas. | La definición institucional de “áreas” no está verificada y no debe equipararse automáticamente con asignaturas. Sin RF directo identificado. |
| PE-03.1 — Evaluar indicadores de gestión | B para consultar datos operativos; A para definir institucionalmente indicadores. D si requiere evaluación automatizada de metas. | Veinte reportes y seis dashboards están implementados; no se encontró correspondencia aprobada de metas/fórmulas estratégicas. RF-23 es relacionado, no cobertura total de PE-03.1. |
| PE-03.2 — Registrar acciones de mejora | A: proceso documentable. D si se solicita un módulo de acciones. | No hay función ni flujo institucional verificado. Sin RF directo identificado. |

No se comprobó una brecha de categoría C que justifique un cambio pequeño de código: antes hay que validar el proceso institucional y la definición de “áreas” e indicadores. No se recomienda duplicar catálogos ni reportes.

## Mejoras priorizadas para decisión humana

Las tres opciones son propuestas y no equivalen a aprobación. No se programa en esta etapa.

### Prioridad 1 — Documentar PE-01.1 AS-IS/TO-BE con el dueño del proceso

- **Categoría:** A, documentación institucional.
- **Historia:** como integrante asignado al macroproceso estratégico, quiero registrar el proceso aprobado para definir objetivos y metas, para que sus responsables, entradas, validaciones y salidas sean verificables sin suponer una función de software.
- **Objetivo medible:** obtener aprobación del dueño del proceso para todos los campos conocidos —actor/aprobador, evento, entradas, secuencia, reglas, salida y evidencia— y marcar explícitamente cada dato no proporcionado como pendiente.
- **Precondiciones:** acceso a procedimiento/acta institucional vigente y confirmación de quién tiene autoridad para validarlo.
- **Aceptación:** **Dado** que el dueño entrega el procedimiento vigente, **cuando** se documente PE-01.1, **entonces** cada etapa y responsable queda respaldado por esa fuente, los datos ausentes se señalan como “NO VERIFICADO” y el dueño confirma el documento.
- **Ruta prevista:** `docs/ai-dlc/estrategico/BOLT-EST-001/`; todavía no existe una ficha institucional aprobada.
- **Efectos colaterales:** ninguno en el producto; riesgo de institucionalizar supuestos si se redacta antes de obtener la fuente.
- **Pruebas/evidencia:** revisión del responsable y enlaces comprobables a la fuente entregada; no requiere pruebas de código.
- **Tamaño estimado:** S, condicionado a disponer de las fuentes y del aprobador.

### Prioridad 2 — Trazar indicadores aprobados a reportes existentes

- **Categoría:** B, validación/documentación de funcionalidad existente.
- **Historia:** como responsable institucional de evaluación, quiero saber cuáles indicadores oficiales pueden calcularse con los reportes actuales, para distinguir datos operativos disponibles de medidas estratégicas no soportadas.
- **Objetivo medible:** clasificar el 100 % de indicadores oficialmente proporcionados con fuente, fórmula, filtros, permiso y evidencia de prueba existentes, o marcarlo “no disponible”.
- **Precondiciones:** lista oficial de indicadores con definición, fórmula, periodicidad, umbral y responsable; autorización para revisar los datos pertinentes.
- **Aceptación:** **Dado** el catálogo aprobado de indicadores, **cuando** se compare con el catálogo actual de reportes y dashboards, **entonces** cada indicador queda vinculado a una consulta/prueba existente o explícitamente marcado sin cobertura, sin crear métricas ni informes ficticios.
- **Ruta prevista:** registro documental bajo `docs/ai-dlc/estrategico/`; la interfaz vigente es `/app/reports` y el endpoint de catálogo es `GET /api/v1/reports`, ninguno de los cuales se cambiaría en esta opción.
- **Efectos colaterales:** documentar una fórmula incorrecta o revelar datos si no se confirman dueño y permisos; no se prevé cambio de producto.
- **Pruebas/evidencia:** revisión de fórmulas y permisos contra `ReportCatalog`, `ReportService`, `Sprint10Test.php` y Cypress; ejecutar pruebas solo en un Bolt aprobado.
- **Tamaño estimado:** S–M según cantidad/calidad de definiciones institucionales.

### Prioridad 3 — Evaluar una función de objetivos/metas y acciones de mejora

- **Categoría:** D, funcionalidad nueva no aprobada; **aplazar** hasta contar con alcance y RF.
- **Historia:** como responsable estratégico, quiero evaluar un registro institucional de objetivos, metas y acciones para dar seguimiento al cumplimiento y la mejora.
- **Objetivo medible:** solo después de aprobar alcance, medir cobertura de historias y criterios aprobados; no se fija métrica de producto antes de tener requisitos.
- **Precondiciones:** RF/ticket aprobado; actores y permisos; reglas por institución; estados y aprobaciones; definición de indicadores; historial, evidencia y retención; validación del equipo de integración.
- **Aceptación:** **Dado** que existe aprobación formal y criterios aceptados, **cuando** se diseñe la solución, **entonces** se entrega primero un contrato de datos, permisos institucionales, reglas y pruebas para revisión; no se escribe código sin aprobación posterior del diseño.
- **Ruta prevista:** no se define endpoint, tabla ni pantalla hasta aprobar el RF y arquitectura; si se autoriza el análisis, su documentación iría a un Bolt nuevo.
- **Efectos colaterales:** nuevas tablas/migraciones, aislamiento multiinstitución, controles de acceso, auditoría, carga operativa y posible duplicación de reportes.
- **Pruebas/evidencia:** revisión del diseño aprobado y, solo tras autorizar implementación, pruebas Pest de permisos/aislamiento/auditoría y Cypress del flujo.
- **Tamaño estimado:** L, muy preliminar; no estimable con fiabilidad hasta acotar requisitos.

## Decisiones que requieren autorización o información humana

1. Identidad institucional del responsable y quién aprueba cada PE.
2. Si el trabajo documental AS-IS/TO-BE y el plan propuesto coinciden con la asignación del equipo.
3. Fichas y reglas institucionales vigentes, especialmente calendario oficial y significado de “áreas”.
4. Definiciones de objetivos, metas e indicadores estratégicos: fórmula, fuente, periodicidad, umbral, responsable y evidencia.
5. Si se permite proponer una funcionalidad nueva para PE-01.1, PE-01.2 o PE-03.2. No hay RF o autorización verificados para ello.
6. La ruta y permisos de `Matriz de registro.xlsx`, además del formato de registro que el equipo exige. El archivo no está en esta copia del repositorio.
7. El nombre/versión exactos del modelo de IA y el nombre del responsable que deben completar el registro; esos datos no están disponibles en la sesión.

## Convención de registro

- Guardar cada interacción literal y la plantilla fuente usada, distinguiéndolas para no atribuir al chat texto que solo estaba en el DOCX.
- Registrar fecha/hora local, herramienta/modelo y responsable cuando sean verificables.
- Para un Bolt ejecutado, relacionar ID, PE, RF, commit y PR con la fila correspondiente de `Matriz de registro.xlsx`, una vez que el archivo y sus columnas estén disponibles.
- La propuesta no afirma que existan aprobaciones, tickets, ejecuciones de pruebas o cambios de código.
