# BOLT-MIS-006 — PROMPT 03: Implementación M-01 — Recuperación de consultas de comunicados institucionales

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, Cypress, Pest, seguridad, accesibilidad y diseño UX/UI de plataformas SaaS educativas.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/comunicacion-institucional

Macroproceso: Misional.

Bolt: BOLT-MIS-006.

Mejora: M-01 — Recuperación y contexto de consultas de comunicados.

Requerimientos relacionados: RF-19 y RF-20, según la trazabilidad existente.

Los códigos institucionales originales de los procedimientos permanecen NO VERIFICADOS. No inventarlos.

## DOCUMENTACIÓN OBLIGATORIA

Antes de modificar código, lee completamente:

- docs/ai-dlc/misional/BOLT-MIS-006/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-006/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-006/prompt-02-validacion.md

Contrasta el alcance exacto de M-01 y sus criterios de aceptación contra el código real.

No implementar M-02 ni M-03.

## OBJETIVO

Mejorar las consultas existentes de comunicados institucionales para que los usuarios autorizados puedan recuperarse de errores de red sin perder innecesariamente el contexto de búsqueda, la página seleccionada o el contenido autorizado.

Incorporar pequeños ajustes visuales que mejoren la comprensión de los estados de carga, error y vacío, conservando el diseño actual de EcoAula.

## FASE 1 — REVISIÓN TÉCNICA

1. Confirma la rama feature/comunicacion-institucional.
2. Ejecuta git status y verifica los cambios existentes.
3. Identifica los componentes React de consulta de comunicados.
4. Localiza los endpoints y tipos TypeScript utilizados.
5. Comprueba filtros, paginación y categorías existentes.
6. Revisa los estados de carga, error y vacío.
7. Comprueba qué sucede ante errores 403, 404, 422 y 500.
8. Determina si las respuestas tardías pueden sobrescribir consultas recientes.
9. Verifica las restricciones de destinatarios y permisos.
10. Identifica la estructura visual y los componentes reutilizables.
11. Revisa las pruebas existentes relacionadas con comunicación.
12. Contrasta los hallazgos con M-01 del plan-mejoras.md.

Documenta qué problemas están demostrados.

## FASE 2 — IMPLEMENTACIÓN FUNCIONAL M-01

Realiza cambios mínimos para:

1. Mostrar el estado de carga mientras se consultan comunicados.
2. Presentar errores comprensibles según el contexto de consulta.
3. Permitir reintentar operaciones GET fallidas.
4. Conservar los filtros y la página seleccionada durante el reintento.
5. Reiniciar la página cuando cambie un filtro que invalide la página anterior.
6. Evitar mostrar datos de una consulta anterior como si fueran actuales.
7. Proteger contra respuestas HTTP fuera de orden.
8. Mostrar un estado vacío claro cuando no existan comunicados.
9. Mantener los controles de paginación existentes.
10. Conservar las operaciones y permisos actuales de publicación, archivo y lectura.
11. Evitar que un reintento de consulta repita operaciones de escritura.
12. Mantener los contratos API originales.

Los reintentos automáticos o manuales deben limitarse a consultas GET seguras.

No volver a ejecutar POST, PATCH, PUT o DELETE como consecuencia de un reintento de lectura.

Si un cambio requiere nuevas reglas institucionales, no implementarlo.

## FASE 3 — MEJORAS VISUALES PUNTUALES

Se autorizan únicamente mejoras locales en las pantallas afectadas por M-01.

Aplicar donde sea conveniente:

- Mensajes de error con texto claro.
- Botón "Reintentar" visualmente identificable.
- Indicador de carga discreto.
- Mejor diferenciación entre lista vacía y error de conexión.
- Espaciado coherente entre controles.
- Etiquetas accesibles.
- Foco visible para navegación por teclado.
- Contraste adecuado.
- Ajustes responsivos menores.

Mantener la identidad visual actual de EcoAula:

- Naranja.
- Beige.
- Blanco.
- Café claro.
- Componentes y estilos ya existentes.

No rediseñar pantallas completas.

No modificar el menú lateral, el dashboard general ni otros módulos.

No agregar bibliotecas visuales, animaciones innecesarias o dependencias.

## FASE 4 — SEGURIDAD

Conservar:

1. Los permisos existentes.
2. Los destinatarios autorizados.
3. El aislamiento institucional.
4. Las restricciones de roles.
5. Las validaciones del backend.
6. La auditoría de comunicaciones.
7. Los estados de publicación y archivo.

No almacenar mensajes privados en almacenamiento persistente del navegador.

No introducir nuevas APIs ni modificar la estructura de datos.

## FASE 5 — PRUEBAS

Agrega pruebas Cypress focalizadas para:

1. Consulta exitosa.
2. Carga inicial.
3. Error HTTP y recuperación.
4. Reintento exclusivamente mediante GET.
5. Conservación de filtros.
6. Conservación de página.
7. Cambio de filtro.
8. Estado vacío.
9. Respuestas fuera de orden.
10. Usuario sin autorización.
11. Ausencia de escrituras duplicadas.
12. Controles accesibles.
13. Vista móvil.
14. Regresión de las funciones existentes relacionadas.

Ejecuta las verificaciones disponibles:

- Build del frontend.
- ESLint.
- TypeScript E2E.
- Cypress focalizado.
- Regresión pertinente.
- git diff --check.

Ejecuta Pest únicamente si existe una base de pruebas aislada y segura.

Diferencia resultados con API simulada y pruebas con backend real.

No declares pruebas aprobadas sin ejecutarlas.

## FASE 6 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-006/prompt-03-implementacion-m01.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m01.md

Incluye:

1. Problema original.
2. Evidencia técnica.
3. RF relacionados.
4. Archivos modificados.
5. Solución implementada.
6. Ajustes visuales realizados.
7. Comportamiento anterior y nuevo.
8. Criterios de aceptación cumplidos.
9. Pruebas aprobadas, fallidas y no ejecutadas.
10. Diferencias entre simulación e integración real.
11. Riesgos residuales.
12. Limitaciones.

## RESTRICCIONES

- No implementar M-02 ni M-03.
- No modificar backend ni migraciones.
- No cambiar roles o permisos.
- No cambiar reglas de publicación, lectura o archivo.
- No modificar Matrículas, Enseñanza-aprendizaje, Evaluación académica ni Asistencia.
- No intervenir en otros macroprocesos.
- No instalar dependencias.
- No modificar el diseño global.
- No realizar commits, push, merge ni Pull Requests.
- No inventar resultados de pruebas.

## RESULTADO ESPERADO

Entrega:

1. Estado de M-01: COMPLETADA, PARCIAL o BLOQUEADA.
2. Archivos modificados.
3. Mejoras funcionales.
4. Mejoras visuales puntuales.
5. Pruebas ejecutadas con resultados exactos.
6. Limitaciones de integración real.
7. Riesgos pendientes.

Si el problema identificado requiere cambios arquitectónicos importantes, documenta la limitación en lugar de introducir una solución frágil.