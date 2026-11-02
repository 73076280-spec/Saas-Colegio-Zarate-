# BOLT-MIS-006 — PROMPT 04: Implementación M-02 — Protección de borradores de comunicados

Actúa como desarrollador senior especializado en React 19, TypeScript, Laravel 13, Cypress, accesibilidad, seguridad y diseño UX/UI para plataformas educativas SaaS.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/comunicacion-institucional

Macroproceso: Misional.

Bolt: BOLT-MIS-006.

Mejora: M-02 — Protección de borradores de comunicados.

Requerimientos asociados: RF-19 y RF-20, únicamente en la medida respaldada por la documentación.

Los códigos institucionales de procedimientos siguen NO VERIFICADOS. No inventarlos.

M-01 se implementó y validó con API simulada. No modificarla salvo regresión demostrada.

## OBJETIVO

Proteger los cambios sin guardar durante la creación y edición de comunicados institucionales, especialmente al cambiar de editor, seleccionar otro comunicado o ejecutar operaciones de guardado.

La solución debe evitar pérdidas silenciosas sin modificar las reglas del backend ni introducir almacenamiento persistente de mensajes privados.

Incorporar mejoras visuales pequeñas donde sean útiles.

## FASE 1 — ANÁLISIS

Antes de modificar código:

1. Confirma la rama y revisa git status.
2. Lee íntegramente diagnostico.md y plan-mejoras.md de BOLT-MIS-006.
3. Lee evidencias-m01.md y comprueba el estado actual.
4. Localiza los formularios de creación y edición de comunicados.
5. Identifica cómo se mantienen el título, contenido, destinatarios y otros campos existentes.
6. Revisa las acciones de selección, cancelación, edición y publicación.
7. Comprueba si existen borradores locales y cómo se descartan.
8. Identifica qué sucede al cambiar de comunicado durante una edición.
9. Comprueba qué ocurre durante un guardado pendiente.
10. Analiza el comportamiento ante errores HTTP.
11. Identifica el mecanismo real de navegación SPA.
12. Contrasta los hallazgos con los criterios exactos de M-02 en plan-mejoras.md.

No supongas que las acciones de guardar y publicar son equivalentes si el sistema las distingue.

## FASE 2 — IMPLEMENTACIÓN FUNCIONAL

Implementa la solución mínima para:

1. Detectar modificaciones reales respecto al contenido inicialmente cargado.
2. Distinguir entre un formulario limpio y otro con cambios pendientes.
3. Advertir antes de reemplazar un borrador por otro comunicado.
4. Permitir cancelar el descarte y conservar la edición.
5. Permitir descartar expresamente cuando el usuario lo confirme.
6. Evitar operaciones incompatibles durante el guardado.
7. Mostrar el progreso de guardado.
8. Conservar el contenido local tras errores recuperables.
9. Evitar que una respuesta tardía sobrescriba otro borrador.
10. Limpiar el estado de cambios pendientes únicamente cuando el servidor confirme una operación exitosa.
11. Mantener los controles de creación, edición, archivo y publicación actuales.
12. Preservar los reintentos GET de M-01 sin repetir escrituras.

No realizar publicación automática.

No repetir POST, PATCH, PUT o DELETE de forma automática después de un error.

No declarar guardado exitoso si la respuesta del servidor no lo confirma.

## FASE 3 — NAVEGACIÓN SPA Y RECARGA

Revisa las limitaciones de BrowserRouter y los cambios de editor que no modifican la URL.

Prioriza protecciones locales compatibles con la arquitectura actual.

Evalúa un aviso nativo beforeunload para recarga o cierre de pestaña si es seguro y compatible.

Si la navegación global no puede protegerse sin modificaciones arquitectónicas amplias:

- No improvisar un bloqueo frágil.
- Documentar la limitación.
- Clasificar M-02 como PARCIAL si corresponde.

No prometer que los datos se recuperarán después de cerrar o recargar la aplicación.

No utilizar localStorage, sessionStorage o IndexedDB para guardar borradores con información institucional.

## FASE 4 — MEJORAS VISUALES PEQUEÑAS

Incorpora únicamente donde resulte conveniente:

- Indicador "Cambios sin guardar".
- Indicador "Guardando".
- Estado visual de botones deshabilitados.
- Mensajes de error contextualizados.
- Confirmación de descarte comprensible.
- Etiquetas accesibles para controles.
- Foco visible mediante teclado.
- Espaciado discreto para mensajes informativos.

Mantener la paleta y los componentes actuales de EcoAula.

No rediseñar el formulario ni cambiar la estructura general.

No modificar otros módulos.

## FASE 5 — SEGURIDAD

Conserva los permisos actuales de publicación y edición.

Mantén las restricciones de destinatarios y aislamiento institucional.

No modificar reglas de publicación o archivo.

No introducir endpoints ni migraciones.

No exponer contenido de comunicados en logs, trazas o almacenamiento persistente.

## FASE 6 — PRUEBAS

Agrega pruebas Cypress focalizadas para:

1. Formulario inicialmente limpio.
2. Edición con cambios pendientes.
3. Cambio de comunicado con borrador pendiente.
4. Cancelación del descarte.
5. Confirmación del descarte.
6. Guardado exitoso.
7. Error de guardado que conserva el borrador.
8. Protección durante solicitudes pendientes.
9. Respuestas fuera de orden.
10. Aviso de recarga, si se implementa.
11. Navegación SPA y limitaciones documentadas.
12. Controles accesibles mediante teclado.
13. Diseño móvil sin desbordamiento.
14. Regresión de M-01.

Ejecuta:

- Build del frontend.
- ESLint.
- TypeScript E2E.
- Cypress focalizado y regresión pertinente.
- git diff --check.

Pest únicamente en un entorno de base de datos aislado y seguro.

Registra resultados exactos, diferenciando API simulada de backend real.

No declares aprobados escenarios de navegación global que no estén cubiertos por pruebas reales.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-006/prompt-04-implementacion-m02.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m02.md

Documenta:

1. Problema original.
2. Evidencia técnica.
3. Relación con RF-19 y RF-20.
4. Archivos modificados.
5. Solución implementada.
6. Mejoras visuales pequeñas.
7. Comportamiento anterior y nuevo.
8. Pruebas ejecutadas y resultados.
9. Pruebas fallidas y no ejecutadas.
10. Limitaciones de navegación SPA.
11. Riesgos residuales.
12. Estado final de M-02: COMPLETADA, PARCIAL o BLOQUEADA.

## RESTRICCIONES

- No implementar M-03.
- No alterar M-01 sin defecto demostrado.
- No modificar backend, contratos API, permisos ni migraciones.
- No modificar otros módulos misionales.
- No intervenir en otros macroprocesos.
- No instalar dependencias.
- No rediseñar la plataforma.
- No hacer commits, push, merge ni PR.
- No ocultar fallos ni inventar resultados.

## RESULTADO ESPERADO

Entrega el estado de M-02 con:

- Funcionalidades implementadas.
- Archivos modificados.
- Cambios visuales realizados.
- Pruebas aprobadas, fallidas y no ejecutadas.
- Limitaciones de SPA e integración real.
- Riesgos pendientes.

Si una protección completa requiere modificar la arquitectura global, documenta el impedimento y conserva M-02 como PARCIAL.