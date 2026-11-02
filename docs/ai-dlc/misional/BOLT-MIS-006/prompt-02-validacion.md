# BOLT-MIS-006 — PROMPT 02: Validación de brechas y planificación de mejoras funcionales y visuales

Actúa como arquitecto de software senior, desarrollador React 19 + TypeScript, especialista en UX/UI de plataformas educativas SaaS, accesibilidad, Laravel 13, Cypress y calidad de software.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio local: D:\zarate-saas

Rama obligatoria: feature/comunicacion-institucional

Macroproceso: Misional.

Bolt: BOLT-MIS-006.

Proceso: Comunicación institucional.

Los Bolts anteriores ya fueron integrados en feature/macro-misional.

## NUEVA INDICACIÓN DEL RESPONSABLE DEL PROYECTO

Además de corregir problemas funcionales, se autorizan mejoras pequeñas y puntuales de diseño, únicamente en pantallas de Comunicación institucional donde exista una necesidad real.

NO realizar un rediseño general.

NO cambiar la identidad visual existente.

Mantener la estética de EcoAula: colores cálidos, naranja, beige, blanco y café claro, según los estilos y variables existentes del proyecto.

Los cambios visuales deben respetar la coherencia con el resto del SaaS.

## DOCUMENTACIÓN OBLIGATORIA

Lee:

- docs/ai-dlc/misional/BOLT-MIS-006/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-006/prompt-01-auditoria.md
- Requerimientos funcionales pertinentes, especialmente RF-19 y RF-20.
- Documentación de arquitectura.
- Código existente de comunicación institucional.
- Estilos, componentes reutilizables y patrones visuales actuales.

No inventes códigos de procedimientos cuya denominación institucional no esté verificada.

## OBJETIVO

Validar las brechas identificadas en la auditoría y seleccionar hasta tres mejoras funcionales, incluyendo ajustes visuales pequeños donde aporten valor.

En esta fase NO modificar código.

## FASE 1 — CONSULTAS DE COMUNICADOS

Revisa:

1. Listado de comunicados.
2. Filtros y paginación.
3. Estados de carga.
4. Errores HTTP.
5. Reintentos.
6. Datos obsoletos.
7. Contexto de la consulta.
8. Bandejas y archivo.
9. Permisos de lectura.
10. Pruebas existentes.

Determina qué problemas están realmente demostrados.

## FASE 2 — REDACCIÓN DE COMUNICADOS

Comprueba:

1. Formulario de creación.
2. Formulario de edición, si existe.
3. Estado de cambios pendientes.
4. Cambio de destinatarios.
5. Guardado y publicación.
6. Errores de servidor.
7. Prevención de publicaciones duplicadas.
8. Navegación con cambios sin guardar.
9. Conservación de borradores.
10. Validaciones y accesibilidad.

No implementar guardado automático ni almacenamiento persistente de información sensible sin justificación y autorización.

No cambiar las reglas institucionales de publicación.

## FASE 3 — CAMPANA Y NOTIFICACIONES

Analiza:

1. Indicador de notificaciones pendientes.
2. Bandeja de notificaciones.
3. Marcado de lectura.
4. Actualización tras consultar una notificación.
5. Coherencia entre campana y bandeja.
6. Respuestas tardías.
7. Permisos.
8. Estados vacíos.
9. Reintentos seguros.
10. Pruebas existentes.

Distingue defectos confirmados de comportamientos que dependen del contrato de la API.

## FASE 4 — REVISIÓN UX/UI

Realiza una revisión visual focalizada de las pantallas de comunicación institucional.

Busca problemas concretos en:

- Espaciado entre elementos.
- Jerarquía visual de títulos.
- Distinción entre comunicados leídos y no leídos.
- Visibilidad de botones.
- Estados de carga y error.
- Mensajes vacíos.
- Etiquetas de formularios.
- Contraste de texto.
- Foco visible al navegar con teclado.
- Diseño responsivo.
- Coherencia entre campana, bandeja y detalles.

Utiliza los componentes y clases existentes de React/Tailwind.

No agregues bibliotecas de iconos ni dependencias.

No introduzcas nuevos colores principales.

No cambies el diseño de otras pantallas.

No propongas efectos visuales innecesarios ni animaciones excesivas.

Prioriza ajustes pequeños que mejoren legibilidad, accesibilidad y comprensión.

## FASE 5 — DEFINICIÓN DE MEJORAS

Selecciona hasta tres mejoras:

M-01: Recuperación y contexto de consultas de comunicados, si la brecha se confirma.

M-02: Protección de borradores de publicación, si la brecha se confirma.

M-03: Coherencia de notificaciones y bandejas, si la brecha se confirma.

Para cada mejora indica:

1. Problema demostrado.
2. Evidencia técnica.
3. RF relacionado.
4. Procedimiento institucional, si se verificó.
5. Solución funcional mínima.
6. Ajuste visual opcional y justificado.
7. Archivos exactos previstos.
8. Criterios de aceptación.
9. Pruebas necesarias.
10. Riesgos.
11. Prioridad.
12. Dependencias y decisiones institucionales.

Si alguna mejora no está justificada, no la fuerces para completar tres.

## FASE 6 — CRITERIOS DE CALIDAD VISUAL

Las propuestas de diseño deben cumplir:

- Mantener identidad visual de EcoAula.
- No rediseñar el layout institucional.
- No alterar la navegación general.
- Reutilizar componentes y estilos.
- Preservar responsividad.
- Mantener compatibilidad con teclado.
- Evitar introducir nuevos problemas de contraste.
- No alterar formularios sin necesidad.
- Minimizar los archivos modificados.
- Mantener consistencia con Matrículas, Enseñanza-aprendizaje, Evaluación académica y Asistencia.

La mejora visual debe ser secundaria respecto de la funcionalidad y seguridad.

## FASE 7 — SEGURIDAD Y PRUEBAS

Revisa:

- Permisos de publicación.
- Restricciones de destinatarios.
- Acceso a mensajes privados.
- Aislamiento institucional.
- Validaciones.
- Auditoría.
- Contratos API.
- Pruebas Pest y Cypress.

Identifica los casos que necesitarán nuevas pruebas.

No declares aprobaciones sin ejecutar los casos correspondientes.

No uses bases de datos reales para pruebas sin confirmar aislamiento.

## FASE 8 — DOCUMENTACIÓN AI-DLC

Guarda este prompt íntegro en:

docs/ai-dlc/misional/BOLT-MIS-006/prompt-02-validacion.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-006/plan-mejoras.md

El plan debe contener:

- Procedimientos y RF verificados.
- Brechas confirmadas.
- Mejoras seleccionadas.
- Ajustes visuales recomendados.
- Archivos previstos.
- Criterios de aceptación.
- Estrategia de pruebas.
- Riesgos.
- Orden de implementación.

Incluye una tabla con:

Mejora | Problema funcional | Ajuste visual | Archivos | Prioridad | Pruebas

## RESTRICCIONES

- No modificar frontend ni backend.
- No modificar migraciones ni datos.
- No crear nuevos endpoints.
- No cambiar permisos.
- No instalar dependencias.
- No modificar los Bolts anteriores.
- No intervenir en otros macroprocesos.
- No realizar commits, push, merge ni Pull Requests.
- No inventar problemas ni resultados de pruebas.

En esta fase solo pueden crearse los dos documentos indicados.

## RESULTADO ESPERADO

Entrega un informe indicando:

1. Estado de las funcionalidades existentes.
2. Brechas verificadas.
3. Hasta tres mejoras priorizadas.
4. Ajustes visuales pequeños y convenientes.
5. Archivos que deberán modificarse.
6. Pruebas necesarias.
7. Mejora recomendada para implementar primero.

No programes todavía.