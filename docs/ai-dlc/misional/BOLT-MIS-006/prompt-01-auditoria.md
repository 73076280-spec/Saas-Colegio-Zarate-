# BOLT-MIS-006 — PROMPT 01: Auditoría funcional y técnica de comunicación institucional

Actúa como arquitecto de software senior, analista de procesos educativos y especialista en Laravel 13, React 19, TypeScript, MySQL, Pest, Cypress, seguridad y calidad de software.

## CONTEXTO

Proyecto: Implementación de una plataforma SaaS para mejorar la gestión académica del Colegio Zárate de Huancayo, 2026.

Sistema: EcoAula SaaS.

Repositorio local: D:\zarate-saas

Rama obligatoria: feature/comunicacion-institucional

Macroproceso: Misional.

Bolt: BOLT-MIS-006.

Proceso de trabajo: Comunicación institucional.

## ANTECEDENTES

Se integraron los siguientes Bolts:

- BOLT-MIS-002: Matrículas.
- BOLT-MIS-003: Enseñanza-aprendizaje.
- BOLT-MIS-004: Evaluación académica.
- BOLT-MIS-005: Asistencia y seguimiento.

El objetivo es identificar las funcionalidades existentes de comunicación institucional y las mejoras realmente necesarias.

No construir otro módulo desde cero si ya existe soporte en código.

## FASE 1 — VERIFICACIÓN DEL REPOSITORIO

1. Comprueba que la rama activa sea feature/comunicacion-institucional.
2. Ejecuta git status.
3. Revisa la arquitectura del proyecto.
4. Examina los 24 requerimientos funcionales.
5. Revisa los documentos de procesos AS-IS y TO-BE.
6. Identifica los procedimientos de comunicación institucional con sus denominaciones y códigos originales.
7. Busca referencias en los documentos académicos y de trazabilidad.
8. Distingue las funcionalidades pertenecientes al macroproceso misional de las asignadas a los macroprocesos estratégico y de apoyo.

No inventes códigos PM o RF cuando la documentación no permita verificarlos.

## FASE 2 — IDENTIFICACIÓN DE FUNCIONALIDADES

Analiza la existencia y el estado real de las funciones relacionadas con:

- Comunicados institucionales.
- Avisos y notificaciones académicas.
- Comunicación entre docentes, estudiantes y apoderados.
- Publicación y consulta de mensajes.
- Destinatarios y audiencias autorizadas.
- Confirmaciones de lectura, si están implementadas.
- Historial de comunicaciones.
- Filtros y búsquedas.
- Estados de carga, error y vacío.
- Accesibilidad y compatibilidad móvil.

Estas categorías son áreas de revisión, no requisitos nuevos.

Si alguna funcionalidad no corresponde a los requerimientos del Colegio Zárate, identifícala como fuera de alcance y no la propongas para implementación.

## FASE 3 — REVISIÓN DE BACKEND

Localiza los elementos existentes relacionados con comunicación institucional:

1. Modelos Eloquent.
2. Migraciones.
3. Controladores.
4. Servicios.
5. Rutas API.
6. Políticas y permisos.
7. Validaciones.
8. Relaciones con estudiantes, docentes y apoderados.
9. Auditoría.
10. Pruebas Pest.

Para cada funcionalidad identifica las rutas reales de archivos.

Comprueba si el backend aplica aislamiento institucional y restricciones de destinatarios.

No modifiques código ni datos.

## FASE 4 — REVISIÓN DE FRONTEND

Analiza los componentes React existentes relacionados con avisos, notificaciones y comunicación.

Comprueba:

1. Formularios de publicación.
2. Listados.
3. Consulta de detalle.
4. Navegación.
5. Roles autorizados.
6. Manejo de errores HTTP.
7. Estados de carga.
8. Resultados vacíos.
9. Actualización de contenido.
10. Protección frente a respuestas fuera de orden.
11. Accesibilidad mediante teclado.
12. Comportamiento responsivo.

Distingue los problemas confirmados de las mejoras opcionales.

## FASE 5 — SEGURIDAD Y PRIVACIDAD

Comprueba:

- Que un usuario no pueda acceder a mensajes ajenos.
- Que los permisos de publicación respeten los roles existentes.
- Que estudiantes y apoderados solo accedan a comunicaciones autorizadas.
- Que no exista exposición de información entre instituciones.
- Que las operaciones de lectura y escritura sean coherentes con el backend.
- Que no se utilicen datos académicos sensibles sin necesidad.
- Que no existan nuevos permisos propuestos sin sustento documental.

No amplíes roles, públicos destinatarios o políticas institucionales.

## FASE 6 — PRUEBAS EXISTENTES

Localiza las pruebas Pest y Cypress relacionadas con comunicación.

Documenta:

- Casos identificados.
- Procedimientos y RF relacionados.
- Funcionalidad cubierta.
- Riesgos no cubiertos.
- Pruebas faltantes.
- Posibles regresiones.

No declares pruebas aprobadas solamente por encontrar archivos de prueba.

No ejecutes pruebas que alteren bases de datos sin confirmar un entorno aislado y seguro.

## FASE 7 — MATRIZ DE DIAGNÓSTICO

Para cada procedimiento real identificado documenta:

1. Código y nombre.
2. Objetivo.
3. Actores.
4. Requerimientos funcionales relacionados.
5. Funcionalidades existentes.
6. Archivos backend.
7. Archivos frontend.
8. Endpoints.
9. Permisos.
10. Pruebas disponibles.
11. Estado: IMPLEMENTADO, PARCIAL, PENDIENTE o NO VERIFICADO.
12. Evidencias.
13. Brechas.
14. Riesgos.

Identifica expresamente las funcionalidades que corresponden a otros macroprocesos, evitando duplicar responsabilidades.

## FASE 8 — MEJORAS CANDIDATAS

Propón únicamente mejoras basadas en problemas observables del código.

Prioriza:

- Recuperación de consultas.
- Manejo de errores.
- Contexto de comunicaciones.
- Seguridad de destinatarios.
- Prevención de contenido obsoleto.
- Accesibilidad.
- Trazabilidad.
- Cobertura de pruebas.

No implementes mensajería en tiempo real, correos electrónicos, SMS, notificaciones push ni servicios externos si no están respaldados por requerimientos y decisiones institucionales.

No inventes nuevas funcionalidades para completar artificialmente el Bolt.

## DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-006/prompt-01-auditoria.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-006/diagnostico.md

El diagnóstico debe contener:

- Procedimientos reales encontrados.
- Requerimientos funcionales asociados.
- Funcionalidades implementadas.
- Matriz de evidencias técnicas.
- Problemas demostrados.
- Riesgos.
- Mejoras candidatas priorizadas.
- Funcionalidades fuera de alcance.
- Estado de pruebas.

## RESTRICCIONES

- No modificar backend ni frontend.
- No crear endpoints.
- No instalar dependencias.
- No modificar roles ni permisos.
- No alterar datos o migraciones.
- No tocar los Bolts anteriores.
- No intervenir en otros macroprocesos.
- No realizar commits, push, merge ni Pull Requests.
- No inventar requisitos, pruebas o evidencias.

Únicamente puedes crear los dos documentos de auditoría indicados dentro de BOLT-MIS-006.

## RESULTADO ESPERADO

Entrega:

1. Procedimientos reales de comunicación institucional.
2. Funcionalidades existentes en el código.
3. Estado de cada procedimiento.
4. Requerimientos funcionales relacionados.
5. Pruebas localizadas y estado de ejecución.
6. Brechas verificables.
7. Propuesta inicial de mejoras priorizadas.

No implementar cambios funcionales todavía.