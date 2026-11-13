# BOLT-MIS-003 — PROMPT 02: Validación de brechas y planificación de mejoras

Actúa como arquitecto de software senior, analista de procesos educativos y especialista en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress y arquitectura SaaS.

Estamos trabajando en EcoAula SaaS del Colegio Zárate de Huancayo, 2026.

Ruta local: D:\zarate-saas

Rama: feature/ensenanza-aprendizaje

Macroproceso: Misional.

Proceso: PM-02 Enseñanza-aprendizaje.

## CONTEXTO

Ya realizamos una auditoría inicial de los procedimientos PM-02.1, PM-02.2, PM-02.3 y PM-02.4.

El resultado se encuentra en:

docs/ai-dlc/misional/BOLT-MIS-003/diagnostico.md

Según la auditoría:

- PM-02.1 presenta una posible brecha entre asignación docente a asignaturas y áreas académicas.
- PM-02.2 está implementado.
- PM-02.3 está implementado.
- PM-02.4 está implementado.

También se identificaron riesgos de navegación, restricciones de entregas, revisión de tareas y accesibilidad.

No debes asumir que las recomendaciones de la auditoría son defectos confirmados. Debes contrastarlas con el código real.

## OBJETIVO

Determinar exactamente qué mejoras conviene implementar dentro de BOLT-MIS-003, evitando duplicar funcionalidades y respetando el alcance del proyecto.

## ACTIVIDAD 1. PM-02.1 — Asignación docente

Analiza el modelo académico existente.

Verifica:

1. Cómo se relacionan las áreas académicas, asignaturas, cursos, docentes, grados, secciones y periodos académicos.
2. Qué modelos, migraciones, endpoints y componentes React representan esas relaciones.
3. Si la asignación docente actual ya satisface el procedimiento PM-02.1.
4. Si la diferencia entre área y asignatura es terminológica, documental o funcional.
5. Si existe una brecha real que afecte las operaciones del colegio.
6. Qué modificación mínima solucionaría esa brecha, si corresponde.

No generes nuevas tablas, relaciones o módulos si el modelo existente ya resuelve el procedimiento.

## ACTIVIDAD 2. Aula Virtual y navegación

Examina las rutas de Aula Virtual independiente y las pantallas de cursos.

Identifica posibles problemas relacionados con:

- Permisos personalizados.
- Navegación entre Gestión Institucional y Aula Virtual.
- Acceso de docentes, estudiantes y otros roles.
- Cursos activos e inactivos.
- Estados de carga y errores.
- Diseño responsivo y accesibilidad.

Comprueba si los problemas realmente existen antes de proponer cambios.

## ACTIVIDAD 3. Planificación, tareas y entregas

Revisa:

- Unidades de aprendizaje.
- Actividades académicas.
- Fechas de publicación y entrega.
- Materiales académicos.
- Restricciones por fechas.
- Entregas de estudiantes.
- Devoluciones y retroalimentación.
- Cierre de actividades.
- Historial de intentos.

Determina si existen comportamientos incorrectos o únicamente oportunidades de mejora visual.

## ACTIVIDAD 4. Pruebas

Identifica las pruebas Pest y Cypress que cubren cada comportamiento.

Diferencia claramente:

- Funciones verificadas mediante lectura de código.
- Funciones cubiertas por pruebas existentes no ejecutadas.
- Funciones con pruebas ejecutadas correctamente.
- Brechas sin cobertura.

No declares pruebas aprobadas si no las ejecutaste.

## ACTIVIDAD 5. Selección de mejoras

Propón un máximo de tres mejoras concretas para este Bolt.

Para cada mejora indica:

- Procedimiento relacionado.
- Problema demostrado.
- Evidencia técnica y ruta del archivo.
- Requerimiento funcional asociado.
- Solución mínima.
- Archivos que modificarías.
- Riesgos.
- Criterios de aceptación.
- Pruebas Pest o Cypress necesarias.
- Prioridad.

No propongas cambios cosméticos sin relación con los procedimientos o la usabilidad.

## DOCUMENTACIÓN AI-DLC

Guarda este prompt completo en:

docs/ai-dlc/misional/BOLT-MIS-003/prompt-02-validacion.md

Crea también:

docs/ai-dlc/misional/BOLT-MIS-003/plan-mejoras.md

El segundo archivo debe contener las mejoras seleccionadas, su justificación y las evidencias que las respaldan.

## RESTRICCIONES

No modifiques todavía backend, frontend, pruebas, migraciones ni datos.

No hagas commit, push ni merge.

No alteres el Centro de Matrículas.

No cambies los roles o permisos existentes.

No inventes requerimientos funcionales.

No agregues dependencias ni reconstruyas módulos que ya funcionan.

No expongas secretos ni credenciales.

Primero necesito revisar y aprobar las mejoras propuestas.

Al finalizar presenta un resumen del diagnóstico y recomienda cuál de las mejoras debería implementarse primero.
