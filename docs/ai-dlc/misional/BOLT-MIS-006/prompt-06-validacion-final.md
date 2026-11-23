# BOLT-MIS-006 — PROMPT 06: Validación integral y cierre técnico de comunicación institucional

Actúa como ingeniero senior de calidad de software especializado en Laravel 13, React 19, TypeScript, Pest, Cypress, seguridad, accesibilidad, UX/UI y trazabilidad AI-DLC.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/comunicacion-institucional

Macroproceso: Misional.

Bolt: BOLT-MIS-006.

Proceso: Comunicación institucional.

Requerimientos relacionados: RF-19 y RF-20, según documentación verificada.

Los códigos institucionales originales de los procedimientos permanecen NO VERIFICADOS. No inventar códigos PM.

## OBJETIVO

Validar conjuntamente las mejoras M-01, M-02 y M-03 de comunicación institucional, comprobar las regresiones y preparar el cierre técnico AI-DLC para su revisión mediante Pull Request.

No modificar código funcional en esta fase.

## FASE 1 — REVISIÓN DOCUMENTAL Y GIT

Lee completamente:

- docs/ai-dlc/misional/BOLT-MIS-006/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-006/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m01.md
- docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m02.md
- docs/ai-dlc/misional/BOLT-MIS-006/evidencias-m03.md
- Todos los prompts previos de BOLT-MIS-006.

Verifica:

1. Rama actual.
2. Estado del repositorio.
3. Commits reales de cada mejora.
4. Comparación contra feature/macro-misional.
5. Archivos modificados.
6. Ausencia de cambios inesperados.
7. Conservación de roles y permisos.
8. Ausencia de modificaciones en backend, migraciones o datos.
9. Ausencia de cambios en otros macroprocesos.

No inventes commits ni evidencias.

## FASE 2 — VALIDACIÓN M-01

Mejora: Recuperación de consultas de comunicados.

Comprueba:

- Carga del listado y detalle.
- Contexto de página y selección.
- Recuperación mediante GET.
- Errores de lectura separados de errores de escritura.
- Estados de carga y vacío.
- Protección frente a respuestas tardías.
- Ausencia de escrituras duplicadas.
- Navegación mediante teclado.
- Comportamiento móvil.
- Ausencia de regresiones.

Conserva la evidencia histórica del fallo inicial de Enter.

La validación posterior con secuencia nativa permitió activarlo correctamente, pero esto no certifica accesibilidad global.

## FASE 3 — VALIDACIÓN M-02

Mejora: Protección de borradores de comunicados.

Comprueba:

- Detección de cambios pendientes.
- Confirmación de descarte.
- Cancelación del descarte.
- Conservación del borrador ante errores.
- Guardado exitoso.
- Bloqueo de operaciones incompatibles.
- Respuestas tardías.
- Aviso de recarga.
- Indicadores visuales.
- Accesibilidad.
- Diseño móvil.

IMPORTANTE:

M-02 permanece PARCIAL debido a la navegación SPA global.

No declares COMPLETADA la protección integral de borradores.

No modifiques el router ni improvises nuevos bloqueos.

## FASE 4 — VALIDACIÓN M-03

Mejora: Sincronización de campana y bandejas.

Comprueba:

- Contador de notificaciones pendientes.
- Filas leídas y no leídas.
- Marcado individual.
- Marcado masivo.
- Confirmación del servidor antes de actualizar la interfaz.
- Recuperación de consultas GET.
- Coherencia entre campana y bandejas.
- Cambios de filtro.
- Respuestas tardías.
- Cambio de usuario o institución.
- Ausencia de escrituras duplicadas.
- Accesibilidad mediante teclado.
- Diseño móvil.

Revisa expresamente la decisión documentada de eliminar el temporizador de 60 segundos.

Distingue:

- Sincronización tras eventos y foco.
- Sincronización en tiempo real.
- Actualizaciones entre dispositivos.

No declares implementadas las dos últimas si no existe evidencia.

## FASE 5 — PRUEBAS AUTOMATIZADAS

Ejecuta una validación conjunta de:

- communication-queries.cy.ts
- communication-drafts.cy.ts
- notification-consistency.cy.ts

Y las regresiones relacionadas con comunicación institucional que puedan ejecutarse de forma segura.

Ejecuta:

1. Build frontend.
2. ESLint.
3. TypeScript E2E.
4. Cypress focalizado.
5. Comprobación de formato Git.
6. Revisión de errores de TypeScript.
7. Verificación móvil focalizada.
8. Verificación de navegación por teclado que sea reproducible.

Antes de ejecutar Pest o Cypress con backend real:

- Identifica la base configurada.
- Comprueba que sea una base de pruebas aislada.
- Confirma que no pueda afectar zarate_dev ni datos institucionales.
- No ejecutes migraciones, seeders ni limpieza contra bases existentes sin garantías de aislamiento.

Si no existe un entorno seguro, registra las pruebas como NO EJECUTADAS.

Registra resultados exactos:

- Aprobadas.
- Fallidas.
- No ejecutadas.
- API simulada.
- Backend real.

No sumes ejecuciones históricas como si fueran pruebas nuevas.

## FASE 6 — SEGURIDAD

Comprueba que se preserven:

- Autenticación.
- Permisos de publicación.
- Permisos de consulta.
- Destinatarios autorizados.
- Aislamiento institucional.
- Relaciones propias de notificaciones.
- Auditoría existente.
- Contratos API.
- Validaciones del servidor.

Distingue revisión estática de pruebas dinámicas.

No declares demostrado el aislamiento del backend si únicamente se utilizaron interceptaciones Cypress.

## FASE 7 — REVISIÓN UX/UI

Verifica que los ajustes visuales realizados sean exclusivamente locales:

- Errores contextualizados.
- Indicadores de carga.
- Estados vacíos.
- Indicadores de borrador.
- Estados de guardado.
- Distinción entre notificaciones leídas y no leídas.
- Botones de reintento.
- Etiquetas accesibles.
- Foco visible.
- Responsividad.

Comprueba que no se haya rediseñado el dashboard, la navegación general ni otros módulos.

No modificar componentes en esta fase.

## FASE 8 — TRAZABILIDAD AI-DLC

Documenta:

1. Objetivo del proceso.
2. RF-19 y RF-20 según su alcance documental.
3. Funcionalidades existentes.
4. Resultado M-01.
5. Resultado M-02.
6. Resultado M-03.
7. Archivos modificados.
8. Endpoints conservados.
9. Roles y permisos.
10. Pruebas ejecutadas.
11. Resultados.
12. Limitaciones.

No inventes procedimientos institucionales no confirmados.

Si existe información insuficiente para asignar códigos PM, utiliza nombres funcionales descriptivos sin asignar códigos nuevos.

## FASE 9 — RIESGOS PENDIENTES

Documenta como mínimo:

- Navegación SPA global no protegida durante edición.
- Falta de validación con Laravel/MySQL real.
- Limitaciones de accesibilidad no evaluadas.
- Ausencia de sincronización en tiempo real.
- Actualización de notificaciones externas dependiente de foco, apertura o eventos disponibles.
- Posibles diferencias entre pruebas simuladas y contratos reales.

No presentes estos riesgos como defectos confirmados sin evidencia reproducible.

## FASE 10 — CIERRE DOCUMENTAL

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-006/prompt-06-validacion-final.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-006/cierre-bolt.md

Incluye:

1. Objetivo de BOLT-MIS-006.
2. Alcance funcional.
3. Requerimientos verificados.
4. Resultado de M-01.
5. Resultado de M-02.
6. Resultado de M-03.
7. Commits reales.
8. Archivos cambiados.
9. Evidencias AI-DLC.
10. Pruebas aprobadas.
11. Pruebas fallidas.
12. Pruebas no ejecutadas.
13. Seguridad.
14. Accesibilidad y UX/UI.
15. Limitación de navegación SPA.
16. Limitación de pruebas reales.
17. Riesgos residuales.
18. Recomendación para Pull Request.
19. Recomendaciones posteriores para integración completa del SaaS.

## CLASIFICACIÓN FINAL

Clasifica el Bolt como:

- LISTO.
- LISTO CON LIMITACIONES.
- BLOQUEADO.

La clasificación debe reflejar las limitaciones documentadas y los resultados reales.

No declarar validación integral completada si faltan pruebas de integración.

## RESTRICCIONES

- No modificar frontend ni backend.
- No modificar datos o migraciones.
- No cambiar permisos.
- No instalar dependencias.
- No modificar otros macroprocesos.
- No alterar las mejoras implementadas.
- No reescribir evidencias anteriores.
- No ejecutar operaciones peligrosas en bases reales.
- No realizar commit, push, merge ni Pull Request.
- No inventar resultados.

En esta fase únicamente se permite crear:

- prompt-06-validacion-final.md
- cierre-bolt.md

## RESULTADO ESPERADO

Entrega:

1. Estado final de BOLT-MIS-006.
2. Resultados conjuntos de las tres mejoras.
3. Pruebas aprobadas, fallidas y no ejecutadas.
4. Limitaciones pendientes.
5. Riesgos de integración.
6. Recomendación de Pull Request desde feature/comunicacion-institucional hacia feature/macro-misional.

No realizar la fusión automáticamente.