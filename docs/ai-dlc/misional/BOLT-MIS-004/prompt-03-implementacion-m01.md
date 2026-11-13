# BOLT-MIS-004 — PROMPT 03: Implementación M-01 — Contexto de evaluación y registro de calificaciones

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, experiencia de usuario, Pest, Cypress y calidad de software.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/evaluacion-academica

Macroproceso: Misional.

Bolt: BOLT-MIS-004.

Procedimientos relacionados:
- PM-03.1 Configurar evaluaciones.
- PM-03.2 Registrar calificaciones.

Ya completamos la auditoría y planificación de BOLT-MIS-004.

## DOCUMENTACIÓN OBLIGATORIA

Antes de modificar código, lee íntegramente:

- docs/ai-dlc/misional/BOLT-MIS-004/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-004/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-004/prompt-02-validacion.md

Implementa EXCLUSIVAMENTE la mejora M-01 descrita en plan-mejoras.md.

No implementes M-02 ni M-03.

## OBJETIVO

Mejorar la orientación del docente durante el registro y actualización de calificaciones, utilizando la información y las reglas que ya existen en EcoAula.

La solución debe reducir errores de interpretación y mostrar claramente el contexto académico de cada evaluación.

## FASE 1 — VERIFICACIÓN

1. Comprueba la rama Git y el estado del repositorio.
2. Identifica los componentes React donde se configuran evaluaciones y registran notas.
3. Examina los modelos, servicios, políticas y endpoints relacionados.
4. Verifica la información que ya devuelve la API.
5. Revisa cómo se representan curso, asignatura, periodo, evaluación, estado y estudiante.
6. Identifica las limitaciones reales descritas en M-01 del plan de mejoras.
7. Identifica los permisos y validaciones actuales.
8. Revisa las pruebas automatizadas existentes.

Antes de modificar código, relaciona cada cambio propuesto con un criterio de aceptación de M-01.

## FASE 2 — IMPLEMENTACIÓN CONTROLADA

Implementa la solución mínima que requiera M-01, priorizando:

1. Mostrar con claridad el nombre de la evaluación y su contexto académico.
2. Distinguir correctamente la evaluación seleccionada de otras evaluaciones del curso.
3. Presentar estados o restricciones existentes cuando ayuden a comprender si una calificación se puede registrar o editar.
4. Mejorar los mensajes de orientación y validación de la interfaz sin modificar las reglas del servidor.
5. Mantener la información ya ingresada cuando ocurra un error recuperable.
6. Conservar una navegación comprensible entre evaluaciones, estudiantes y calificaciones.
7. Respetar los permisos existentes y evitar mostrar datos académicos a usuarios no autorizados.
8. Mantener accesibilidad básica y funcionamiento responsivo.

No inventes nuevas restricciones académicas ni agregues elementos que no estén justificados por el plan de mejoras.

Si una información no está disponible en la API, documenta la limitación antes de proponer cambios al contrato.

## FASE 3 — PROTECCIÓN DE REGLAS EXISTENTES

Está prohibido modificar:

- Escalas y rangos de calificación.
- Fórmulas académicas.
- Estados de publicación de resultados.
- Reglas de cierre de evaluaciones.
- Autorización docente y estudiantil.
- Historial y auditoría del backend.
- Relaciones institucionales.
- Calificaciones existentes.
- Migraciones y datos.

La autorización del backend debe continuar siendo definitiva.

## FASE 4 — PRUEBAS

Agrega pruebas focalizadas que verifiquen:

1. Visualización correcta del contexto de evaluación.
2. Identificación del curso, periodo o estudiante cuando los datos estén disponibles.
3. Comportamiento ante evaluaciones sin registros.
4. Mensajes de error y recuperación.
5. Control de acceso y ausencia de información para usuarios no autorizados.
6. Conservación de los flujos existentes de registro y edición.
7. Comportamiento responsivo básico.
8. Ausencia de regresiones en enseñanza-aprendizaje.

Ejecuta las verificaciones disponibles:

- Frontend build.
- ESLint.
- TypeScript E2E.
- Cypress focalizado.
- Regresión relevante.
- Pest focalizado cuando corresponda.

Antes de ejecutar pruebas que escriban en una base de datos, confirma que se utiliza un entorno aislado.

Diferencia las pruebas con API simulada de las pruebas con backend real.

Registra exactamente las pruebas aprobadas, fallidas y no ejecutadas.

## FASE 5 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-004/prompt-03-implementacion-m01.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-004/evidencias-m01.md

Documenta:

- Problema original de M-01.
- Justificación de los cambios.
- Archivos modificados.
- Criterios de aceptación implementados.
- Comportamiento antes y después.
- Procedimientos y RF relacionados.
- Pruebas ejecutadas y resultados.
- Limitaciones pendientes.
- Riesgos residuales.

## RESTRICCIONES

- No modificar M-02 ni M-03.
- No cambiar reglas de publicación de notas.
- No crear nuevas tablas o migraciones.
- No alterar permisos o roles.
- No modificar Centro de Matrículas ni Enseñanza-aprendizaje.
- No modificar macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No hacer commits, push, merge ni Pull Requests.
- No inventar resultados de pruebas.

## RESULTADO ESPERADO

Presenta un resumen con:

1. Problema corregido.
2. Cambios realizados.
3. Archivos afectados.
4. Pruebas ejecutadas y resultados exactos.
5. Limitaciones.
6. Estado final: COMPLETADO, PARCIAL o BLOQUEADO.

Si M-01 depende de una decisión institucional no aclarada en el plan, detén esa parte y documéntala sin inventar una regla.