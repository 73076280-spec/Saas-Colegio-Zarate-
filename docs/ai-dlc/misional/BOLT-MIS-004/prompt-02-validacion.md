# BOLT-MIS-004 — PROMPT 02: Validación de brechas y planificación de mejoras de evaluación académica

Actúa como arquitecto de software senior, analista funcional de sistemas educativos y especialista en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress, seguridad de datos y calidad de software.

## CONTEXTO

Proyecto: Implementación de una plataforma SaaS para mejorar la gestión académica del Colegio Zárate de Huancayo, 2026.

Sistema: EcoAula SaaS.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/evaluacion-academica

Macroproceso: Misional.

Bolt: BOLT-MIS-004.

Proceso: PM-03 — Evaluación académica.

Los procesos de matrícula y enseñanza-aprendizaje ya fueron integrados a feature/macro-misional.

## DOCUMENTACIÓN OBLIGATORIA

Lee completamente:

- docs/ai-dlc/misional/BOLT-MIS-004/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-004/prompt-01-auditoria.md
- Los requerimientos funcionales y documentos de trazabilidad existentes.
- La documentación de las funcionalidades de evaluaciones, calificaciones y Aula Virtual.

Contrasta cada conclusión del diagnóstico con el código real.

## PROCEDIMIENTOS

PM-03.1 — Configurar evaluaciones.

PM-03.2 — Registrar calificaciones.

PM-03.3 — Publicar resultados.

PM-03.4 — Consultar historial académico.

## RESULTADO PREVIO

La primera auditoría encontró:

- PM-03.1: IMPLEMENTADO por inspección de código.
- PM-03.2: IMPLEMENTADO por inspección de código.
- PM-03.3: PARCIAL por una posible dependencia entre publicación de evaluaciones y visibilidad de resultados.
- PM-03.4: PARCIAL por las características actuales del historial de notas y del resumen familiar.

Estas clasificaciones son preliminares y no equivalen a pruebas funcionales ejecutadas.

## OBJETIVO

Validar las brechas reales del módulo de evaluación académica y seleccionar como máximo tres mejoras justificadas, sin modificar todavía el código del proyecto.

## ACTIVIDAD 1 — Configuración de evaluaciones

Revisa:

1. Creación y edición de evaluaciones.
2. Relación con cursos, asignaturas, docentes y periodos.
3. Tipos de evaluación.
4. Validaciones de fechas y estados.
5. Restricciones de edición, publicación y cierre.
6. Autorizaciones docentes y administrativas.
7. Registro de auditoría.

Determina si PM-03.1 está realmente cubierto por las funcionalidades existentes.

No propongas otro módulo de configuración si el actual ya satisface el procedimiento.

## ACTIVIDAD 2 — Registro de calificaciones

Analiza:

1. Cómo se registran y actualizan las notas.
2. Qué rangos y formatos de calificación permite el sistema.
3. Si existen validaciones para estudiantes no matriculados o cursos no autorizados.
4. Qué ocurre cuando una evaluación se cierra.
5. Si se conserva el historial de cambios.
6. Cómo se controlan los permisos de docentes.
7. Qué pruebas automatizadas verifican estos comportamientos.

Determina si existen problemas reales de integridad, autorización o trazabilidad.

No cambies escalas de calificación ni fórmulas académicas sin un requisito aprobado.

## ACTIVIDAD 3 — Publicación de resultados

Investiga especialmente la diferencia entre:

- Publicar una evaluación o actividad.
- Registrar una calificación.
- Publicar una calificación.
- Cerrar una evaluación.
- Permitir que el estudiante consulte un resultado.
- Permitir que el apoderado consulte el resultado.

Identifica el comportamiento actual con referencias concretas a modelos, servicios, políticas, endpoints y componentes React.

Responde:

1. ¿Una nota puede mostrarse antes de que el docente quiera publicar resultados?
2. ¿Existe un estado de publicación independiente para las calificaciones?
3. ¿Qué relación existe entre una evaluación publicada y la visibilidad de sus notas?
4. ¿Qué ocurre al cerrar una evaluación?
5. ¿Existen escenarios donde estudiantes o apoderados vean resultados incompletos?
6. ¿El sistema satisface PM-03.3 con las reglas actuales?
7. ¿La posible brecha es funcional, documental o depende de una decisión institucional?

IMPORTANTE: no propongas alterar automáticamente la visibilidad de las calificaciones. Cualquier cambio debe respetar la privacidad y las reglas académicas existentes.

## ACTIVIDAD 4 — Historial académico

Analiza:

1. Consulta de calificaciones por estudiante.
2. Consulta por curso y periodo académico.
3. Historial de evaluaciones y resultados.
4. Resumen familiar o del apoderado.
5. Posibilidad de consultar periodos anteriores.
6. Protección de datos personales.
7. Aislamiento institucional.
8. Comportamiento ante registros vacíos.
9. Exportaciones existentes, si las hay.
10. Accesibilidad y experiencia de consulta.

Determina si PM-03.4 requiere alguna mejora y evita confundir historial de calificaciones con auditoría interna de modificaciones.

No propongas boletines oficiales, certificados ni reportes adicionales sin sustento en los requerimientos existentes.

## ACTIVIDAD 5 — Seguridad y pruebas

Verifica las autorizaciones existentes para:

- Administrador.
- Docente.
- Estudiante.
- Apoderado.
- Otros roles definidos en el proyecto.

Identifica si es posible consultar información académica ajena mediante cambios de identificadores o rutas.

Revisa las pruebas Pest y Cypress relacionadas.

Diferencia:

- Funcionalidad comprobada por lectura del código.
- Funcionalidad cubierta por una prueba no ejecutada.
- Funcionalidad verificada con pruebas ejecutadas.
- Riesgos identificados sin reproducción.

No ejecutes pruebas que escriban datos sin confirmar un entorno aislado.

## ACTIVIDAD 6 — Selección de mejoras

Propón como máximo tres mejoras para BOLT-MIS-004.

Para cada una indica:

- Código de mejora M-01, M-02 o M-03.
- Procedimiento PM-03 relacionado.
- Requerimiento funcional existente.
- Problema demostrado.
- Evidencia técnica con ruta de archivo.
- Impacto para el Colegio Zárate.
- Solución mínima recomendada.
- Archivos que sería necesario modificar.
- Riesgos de seguridad e integridad.
- Criterios de aceptación.
- Pruebas Pest y Cypress requeridas.
- Prioridad.
- Necesidad de aprobación institucional, si corresponde.

Si una mejora depende de una decisión académica no documentada, clasifícala como PENDIENTE DE CONFIRMACIÓN y evita recomendar su implementación inmediata.

No inventes reglas institucionales.

## DOCUMENTACIÓN AI-DLC

Guarda este prompt completo, sin resumirlo, en:

docs/ai-dlc/misional/BOLT-MIS-004/prompt-02-validacion.md

Crea también:

docs/ai-dlc/misional/BOLT-MIS-004/plan-mejoras.md

El plan debe incluir:

1. Resumen ejecutivo.
2. Confirmación o corrección del diagnóstico inicial.
3. Análisis de PM-03.1 a PM-03.4.
4. Brechas reales comprobadas.
5. Decisiones institucionales pendientes.
6. Máximo tres mejoras priorizadas.
7. Criterios de aceptación.
8. Pruebas necesarias.
9. Orden recomendado de implementación.
10. Limitaciones de la auditoría.

## RESTRICCIONES

- No modificar backend ni frontend.
- No cambiar reglas de calificaciones.
- No cambiar la visibilidad de resultados.
- No agregar tablas ni migraciones.
- No modificar permisos, políticas ni roles.
- No alterar matrículas ni enseñanza-aprendizaje.
- No afectar los macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No modificar datos institucionales.
- No realizar commits, push, merge o Pull Requests.
- No inventar pruebas ni resultados.

En esta etapa solamente puedes crear los dos documentos de AI-DLC indicados.

## RESULTADO ESPERADO

Presenta una matriz de diagnóstico actualizada y un máximo de tres mejoras justificadas.

Recomienda cuál conviene implementar primero y explica si alguna requiere autorización académica o institucional.

No implementes cambios funcionales todavía.