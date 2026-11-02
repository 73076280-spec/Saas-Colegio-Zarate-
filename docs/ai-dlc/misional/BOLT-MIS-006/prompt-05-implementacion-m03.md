# BOLT-MIS-006 — PROMPT 05: Implementación M-03 — Sincronización de campana y bandejas de notificaciones

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, Cypress, accesibilidad, seguridad y diseño UX/UI para plataformas SaaS educativas.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/comunicacion-institucional

Macroproceso: Misional.

Bolt: BOLT-MIS-006.

Mejora: M-03 — Coherencia entre campana de notificaciones y bandejas.

Requerimientos relacionados: RF-19 y RF-20, únicamente según el alcance que confirme la documentación.

Los códigos institucionales originales de procedimientos permanecen NO VERIFICADOS. No inventarlos.

## ANTECEDENTES

- M-01: Recuperación de consultas de comunicados, completada en frontend mediante pruebas simuladas.
- M-02: Protección de borradores de comunicados, PARCIAL debido a la navegación SPA global.

Implementar exclusivamente M-03.

No modificar M-01 ni M-02 salvo que se demuestre una regresión directamente relacionada.

## DOCUMENTACIÓN OBLIGATORIA

Lee íntegramente:

- docs/ai-dlc/misional/BOLT-MIS-006/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-006/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m01.md
- docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m02.md

Identifica los criterios de aceptación exactos de M-03 y contrástalos con el código real.

## OBJETIVO

Mejorar la consistencia visual y funcional entre la campana de notificaciones, el contador de pendientes y las bandejas de comunicaciones existentes.

Cuando un usuario consulta o marca una notificación como leída, la interfaz debe reflejar el estado confirmado por el servidor sin mostrar información obsoleta o contradictoria.

No introducir notificaciones en tiempo real si el sistema no dispone de dicha capacidad.

## FASE 1 — AUDITORÍA DEL FLUJO ACTUAL

1. Confirma la rama Git y ejecuta git status.
2. Localiza los componentes de campana, notificaciones y bandejas.
3. Identifica los endpoints reales.
4. Revisa el contrato de marcado de lectura.
5. Comprueba cómo se calcula el número de pendientes.
6. Identifica si existen estados duplicados entre componentes.
7. Revisa qué sucede después de marcar una notificación como leída.
8. Analiza los efectos de cambiar entre bandejas.
9. Comprueba los estados de carga, vacío y error.
10. Verifica el comportamiento ante respuestas HTTP tardías.
11. Comprueba los permisos y destinatarios autorizados.
12. Revisa los componentes visuales reutilizables.
13. Identifica las pruebas existentes.

Documenta los problemas realmente demostrados.

## FASE 2 — IMPLEMENTACIÓN M-03

Implementa solamente las mejoras necesarias para:

1. Mantener la coherencia entre el contador y las notificaciones visibles.
2. Actualizar el estado de lectura después de una confirmación exitosa del servidor.
3. Evitar mostrar como leída una notificación cuyo cambio fue rechazado.
4. Recuperar el contador y la bandeja cuando corresponda.
5. Permitir reintentar consultas GET fallidas.
6. Evitar que los reintentos GET repitan operaciones de escritura.
7. Conservar el contexto de la bandeja durante reintentos.
8. Proteger frente a respuestas fuera de orden.
9. Evitar mostrar datos de un usuario anterior durante cambios de sesión.
10. Mostrar errores claros cuando falle una operación.
11. Mantener las restricciones de permisos existentes.
12. Evitar llamadas duplicadas innecesarias.

Respeta los contratos API actuales.

No inventar nuevos estados de lectura, nuevas categorías ni indicadores que el backend no proporcione.

Si la actualización del contador depende de un mecanismo existente de recarga o eventos, reutilízalo cuando sea seguro y consistente.

No incorporar WebSockets, polling continuo, notificaciones push ni servicios externos.

## FASE 3 — MEJORAS VISUALES PUNTUALES

Se permiten cambios pequeños en campana y bandejas, únicamente cuando estén relacionados con M-03.

Prioriza:

- Distinción clara entre notificaciones leídas y no leídas.
- Contador legible y discreto.
- Estado de carga.
- Mensajes de error comprensibles.
- Botón de reintento accesible.
- Estados vacíos.
- Foco visible con teclado.
- Etiquetas accesibles.
- Ajustes mínimos de espaciado y contraste.
- Responsividad móvil.

Conserva los colores, tipografía, componentes y estilos actuales de EcoAula.

No rediseñar el dashboard ni el menú lateral.

No instalar nuevas bibliotecas.

No incorporar animaciones decorativas innecesarias.

## FASE 4 — SEGURIDAD

Conservar:

- Autenticación existente.
- Permisos de comunicación.
- Aislamiento institucional.
- Restricciones de destinatarios.
- Relaciones de usuarios.
- Auditoría.
- Contratos API.

No exponer notificaciones de otros usuarios.

No almacenar mensajes privados en almacenamiento persistente del navegador.

No modificar backend, migraciones ni reglas de publicación.

## FASE 5 — PRUEBAS

Agrega pruebas Cypress focalizadas que comprueben:

1. Contador inicial de pendientes.
2. Bandeja con notificaciones leídas y no leídas.
3. Consulta de detalle.
4. Marcado de lectura exitoso.
5. Error de marcado de lectura.
6. Coherencia entre campana y bandeja.
7. Actualización del contador después de una respuesta confirmada.
8. Error GET y reintento.
9. Reintento que no repite escrituras.
10. Respuestas fuera de orden.
11. Cambio de usuario o contexto.
12. Acceso no autorizado.
13. Estado vacío.
14. Accesibilidad mediante teclado.
15. Vista móvil.
16. Regresión de M-01 y M-02.

Usa los endpoints y mecanismos de navegación reales.

No inventes pruebas que no puedan reproducirse con el código existente.

Ejecuta:

- Build del frontend.
- ESLint.
- TypeScript E2E.
- Cypress focalizado.
- Regresión pertinente.
- git diff --check.

Ejecuta Pest únicamente cuando exista un entorno de pruebas aislado y seguro.

Diferencia claramente:

- Pruebas con API simulada.
- Pruebas con backend real.
- Pruebas fallidas.
- Pruebas no ejecutadas.

No sumar repetidas ejecuciones como si fueran casos diferentes.

## FASE 6 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-006/prompt-05-implementacion-m03.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m03.md

Documenta:

1. Problema original.
2. Evidencia técnica.
3. RF relacionados.
4. Componentes y endpoints.
5. Solución implementada.
6. Archivos modificados.
7. Ajustes visuales realizados.
8. Pruebas aprobadas, fallidas y no ejecutadas.
9. Verificación de accesibilidad.
10. Regresiones.
11. Riesgos pendientes.
12. Limitaciones de integración real.
13. Estado final de M-03.

## RESTRICCIONES

- No modificar M-01 ni M-02 sin defecto demostrado.
- No cambiar reglas de publicación o archivo.
- No modificar permisos ni roles.
- No crear endpoints ni migraciones.
- No modificar otros módulos misionales.
- No intervenir en macroprocesos estratégico o de apoyo.
- No instalar dependencias.
- No rediseñar la plataforma.
- No hacer commits, push, merge ni Pull Requests.
- No inventar resultados de pruebas.

## RESULTADO ESPERADO

Entrega:

- Estado de M-03: COMPLETADA, PARCIAL o BLOQUEADA.
- Archivos modificados.
- Mejoras funcionales.
- Ajustes visuales.
- Pruebas ejecutadas y resultados exactos.
- Limitaciones de backend real.
- Riesgos residuales.

Si la sincronización completa requiere un contrato API nuevo o una modificación arquitectónica importante, documenta la limitación en lugar de introducir una solución frágil.