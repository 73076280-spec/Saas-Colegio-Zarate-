# BOLT-MIS-003 — PROMPT 01: Auditoría del proceso de enseñanza-aprendizaje

Actúa como arquitecto de software senior, analista de procesos educativos y especialista en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress y calidad de software.

## CONTEXTO

Proyecto: Implementación de una plataforma SaaS para mejorar la gestión académica del Colegio Zárate de Huancayo, 2026.

Sistema: EcoAula SaaS.

Repositorio local: D:\zarate-saas

Rama actual: feature/ensenanza-aprendizaje

Estamos desarrollando el macroproceso misional y ya contamos con los Sprints 1 al 10, Aula Virtual independiente y Centro de Matrículas.

No debes comenzar el desarrollo desde cero. Necesitamos aprovechar el código y las funcionalidades existentes.

## PROCEDIMIENTOS ASIGNADOS

PM-02.1 — Asignar docentes a áreas académicas.

PM-02.2 — Planificar actividades de aprendizaje.

PM-02.3 — Publicar materiales y tareas.

PM-02.4 — Recibir y revisar tareas.

## OBJETIVO PRINCIPAL

Realiza una auditoría técnica y funcional del proceso de enseñanza-aprendizaje para identificar las funcionalidades existentes, las brechas reales y las mejoras necesarias.

## ACTIVIDADES

1. Verifica la rama Git actual y el estado del repositorio.
2. Analiza los documentos de los Sprints 1 al 10 y la documentación del Aula Virtual.
3. Revisa los módulos backend y frontend de asignaciones docentes, cursos, actividades académicas, materiales, tareas y entregas.
4. Identifica los endpoints y permisos utilizados.
5. Revisa las relaciones entre docentes, estudiantes, cursos, grados y secciones.
6. Verifica las condiciones de acceso al Aula Virtual según los roles.
7. Comprueba el funcionamiento de las actividades y sus estados de publicación, entrega, revisión y cierre.
8. Identifica las pruebas Pest y Cypress existentes.
9. Compara los procedimientos PM-02.1 a PM-02.4 con los 24 requerimientos funcionales definidos en el proyecto.
10. Detecta funcionalidades incompletas, posibles errores, duplicación de componentes o dificultades de usabilidad.

## MATRIZ DE DIAGNÓSTICO

Para cada procedimiento, entrega:

- Código.
- Nombre.
- Objetivo.
- Actor principal.
- Entradas.
- Actividades.
- Salidas.
- Requerimientos funcionales relacionados.
- Archivos frontend y backend.
- Endpoint utilizado.
- Estado funcional.
- Evidencias encontradas.
- Mejoras recomendadas.

Clasifica los estados como IMPLEMENTADO, PARCIAL, PENDIENTE o NO VERIFICADO.

## PROPUESTA DE MEJORAS

Sugiere mejoras específicas y justificadas, priorizando:

- Navegación y organización del Aula Virtual.
- Experiencia docente al gestionar cursos.
- Planificación de actividades académicas.
- Publicación de materiales y tareas.
- Entrega de tareas por estudiantes.
- Revisión y retroalimentación docente.
- Accesibilidad y diseño responsivo.
- Manejo de errores y estados vacíos.
- Seguridad y permisos por rol.
- Pruebas automatizadas y trazabilidad.

No propongas crear funcionalidades que ya están implementadas correctamente.

## REGISTRO AI-DLC

Este trabajo corresponde a BOLT-MIS-003.

Crea el archivo:

docs/ai-dlc/misional/BOLT-MIS-003/prompt-01-auditoria.md

Guarda allí este prompt completo, sin resumirlo, para su posterior publicación en GitHub.

También crea:

docs/ai-dlc/misional/BOLT-MIS-003/diagnostico.md

En ese documento registra los hallazgos, rutas de código y pruebas identificadas.

## RESTRICCIONES

- No modifiques componentes ni lógica del sistema.
- No realices migraciones.
- No alteres las reglas de roles ni permisos.
- No modifiques el Centro de Matrículas.
- No cambies funcionalidades del macroproceso estratégico o de apoyo.
- No generes commits ni hagas push.
- No inventes resultados de pruebas.
- No reemplaces funcionalidades existentes sin justificarlo.
- No expongas credenciales ni información sensible.

En esta etapa solamente se permite crear documentación dentro de BOLT-MIS-003.

Al finalizar, presenta la auditoría completa y una propuesta priorizada de mejoras. No implementes las mejoras todavía.
