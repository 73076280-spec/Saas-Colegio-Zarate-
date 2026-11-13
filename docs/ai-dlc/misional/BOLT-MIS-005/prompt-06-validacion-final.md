# BOLT-MIS-005 — PROMPT 06: Validación integral y cierre técnico de asistencia y seguimiento

Actúa como ingeniero senior de calidad de software, especializado en Laravel 13, React 19, TypeScript, Pest, Cypress, seguridad, accesibilidad y trazabilidad AI-DLC.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: feature/asistencia-seguimiento

Macroproceso: Misional.

Bolt: BOLT-MIS-005.

Proceso: PM-04 — Asistencia y seguimiento.

## OBJETIVO

Validar integralmente las mejoras M-01, M-02 y M-03, verificar sus limitaciones, comprobar la ausencia de regresiones y preparar las evidencias de cierre AI-DLC para revisión mediante Pull Request.

No modificar código funcional durante esta fase.

## FASE 1 — REVISIÓN DEL REPOSITORIO

Lee completamente:

- docs/ai-dlc/misional/BOLT-MIS-005/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-005/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m01.md
- docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m02.md
- docs/ai-dlc/misional/BOLT-MIS-005/evidencias-m03.md
- Todos los prompts de BOLT-MIS-005.

Verifica:

1. Rama actual y estado Git.
2. Commits reales.
3. Diferencias respecto de feature/macro-misional.
4. Archivos funcionales y de pruebas modificados.
5. Ausencia de modificaciones en backend y migraciones.
6. Conservación de permisos, reglas académicas e aislamiento institucional.
7. Que no existan cambios ajenos al macroproceso misional.

Si encuentras cambios inesperados, documéntalos sin eliminarlos automáticamente.

## FASE 2 — VALIDACIÓN DE M-01

Revisa la protección local de borradores de asistencia.

Comprueba:

- Detección de cambios pendientes.
- Confirmación antes de descartarlos.
- Conservación de cambios cuando el docente cancela.
- Guardado exitoso.
- Manejo de errores durante el guardado.
- Protección ante respuestas tardías.
- Bloqueo de operaciones incompatibles.
- Aviso de recarga.
- Comportamiento en dispositivos móviles.
- Accesibilidad de los controles.

ATENCIÓN:

M-01 permanece PARCIAL porque la navegación SPA global y algunos cambios de curso o pestaña no están cubiertos.

No declares COMPLETADA esta mejora.

Verifica que los límites permanezcan correctamente documentados.

No implementes un nuevo enrutador ni un bloqueo improvisado.

## FASE 3 — VALIDACIÓN DE M-02

Revisa las consultas de justificaciones.

Comprueba:

- Carga inicial.
- Filtros y paginación.
- Recuperación de errores HTTP.
- Reintento exclusivamente mediante GET.
- Conservación del contexto durante el reintento.
- Consulta de detalle e historial.
- Respuestas tardías.
- Estados vacíos.
- Permisos y restricciones de acceso.
- Accesibilidad y diseño responsivo.

No confundas pruebas simuladas con integración real.

## FASE 4 — VALIDACIÓN DE M-03

Revisa las consultas personales y familiares de asistencia.

Comprueba:

- Consulta de asistencia personal.
- Consulta familiar autorizada.
- Selección de estudiante.
- Separación de consultas de vínculos y asistencia.
- Contexto de estudiante y página.
- Recuperación tras errores.
- Reintentos GET.
- Respuestas HTTP fuera de orden.
- Eliminación de datos visuales obsoletos.
- Estados de carga, vacío y error.
- Accesibilidad y funcionamiento móvil.

No amplíes permisos ni expongas información de estudiantes no autorizados.

## FASE 5 — EJECUCIÓN DE PRUEBAS

Ejecuta, cuando el entorno lo permita:

1. Build del frontend.
2. ESLint.
3. TypeScript E2E.
4. Cypress focalizado de attendance-draft.cy.ts.
5. Cypress focalizado de justification-query.cy.ts.
6. Cypress focalizado de personal-attendance-query.cy.ts.
7. Regresión relacionada con asistencia y justificaciones.
8. Verificación de formato mediante git diff --check.

Antes de ejecutar Pest:

- Comprueba qué base de datos utiliza el entorno de pruebas.
- Verifica que se encuentre aislada de zarate_dev y de cualquier base institucional.
- Comprueba que las migraciones y limpieza de pruebas no afectarán datos reales.
- No crees usuarios demo ni modifiques datos para forzar las pruebas.

Si no existe un entorno seguro, registra las pruebas Pest como NO EJECUTADAS.

Registra resultados exactos:

- Aprobadas.
- Fallidas.
- No ejecutadas.
- Simuladas.
- Con backend real.

No sumes resultados de ejecuciones repetidas como si fueran casos distintos.

Si aparecen fallos, conserva las trazas y documenta su causa.

## FASE 6 — TRAZABILIDAD DE PROCEDIMIENTOS

Documenta:

- PM-04.1 — Registrar asistencia de estudiantes.
- PM-04.2 — Justificar inasistencias.
- PM-04.3 — Consultar indicadores de asistencia y seguimiento.

Para cada procedimiento identifica:

1. Requerimientos funcionales relacionados según la documentación real.
2. Funcionalidad existente.
3. Mejoras implementadas.
4. Archivos técnicos.
5. Endpoints utilizados.
6. Roles y permisos.
7. Pruebas ejecutadas.
8. Resultados.
9. Limitaciones.
10. Riesgos pendientes.

No inventes códigos RF ni reglas institucionales.

El filtro nominal por periodo académico queda pendiente de confirmación institucional si no existe sustento documental.

## FASE 7 — REVISIÓN DE SEGURIDAD Y REGRESIONES

Comprueba que no se modificaron:

- Matrículas.
- Enseñanza-aprendizaje.
- Evaluación académica.
- Escalas de notas.
- Relaciones familiares.
- Permisos.
- Auditoría.
- Migraciones.
- Contratos de API.

Identifica posibles riesgos de:

- Pérdida de borradores.
- Exposición de información personal.
- Respuestas tardías.
- Duplicación de solicitudes.
- Consulta de información no autorizada.
- Fallos de accesibilidad.

Distingue riesgos potenciales de defectos realmente reproducidos.

## FASE 8 — CIERRE AI-DLC

Guarda íntegramente este prompt en:

docs/ai-dlc/misional/BOLT-MIS-005/prompt-06-validacion-final.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-005/cierre-bolt.md

El cierre debe incluir:

1. Objetivos del Bolt.
2. Procedimientos PM-04 cubiertos.
3. Resultado de M-01.
4. Resultado de M-02.
5. Resultado de M-03.
6. Commits Git reales.
7. Archivos modificados.
8. Matriz de trazabilidad con RF.
9. Pruebas aprobadas, fallidas y no ejecutadas.
10. Verificaciones de seguridad y accesibilidad.
11. Limitación de navegación SPA de M-01.
12. Ausencia de validación con backend real.
13. Riesgos residuales.
14. Recomendaciones posteriores.
15. Recomendación para Pull Request.

Conserva las evidencias originales sin reescribir resultados históricos.

## CLASIFICACIÓN FINAL

Clasifica BOLT-MIS-005 como:

- LISTO.
- LISTO CON LIMITACIONES.
- BLOQUEADO.

La clasificación debe reflejar que M-01 continúa PARCIAL y que las pruebas reales no se ejecutaron, salvo que haya evidencia nueva y verificable que cambie esos hechos.

No declares validación integral completada sin pruebas suficientes.

## RESTRICCIONES

- No modificar frontend ni backend.
- No cambiar reglas o permisos.
- No modificar datos.
- No crear migraciones.
- No instalar dependencias.
- No modificar M-01, M-02 ni M-03.
- No intervenir en otros macroprocesos.
- No hacer commits, push, merge ni Pull Requests.
- No inventar pruebas ni aprobaciones.

Solo crear la documentación de cierre indicada.

## RESULTADO ESPERADO

Entrega un informe final con:

1. Estado de BOLT-MIS-005.
2. Resultados verificables de M-01, M-02 y M-03.
3. Total de pruebas aprobadas, fallidas y no ejecutadas.
4. Limitaciones pendientes.
5. Riesgos de integración.
6. Recomendación para abrir Pull Request desde feature/asistencia-seguimiento hacia feature/macro-misional.

No realices la fusión automáticamente.