# Métricas de calidad — Sprint 10

Estado al 10 de octubre de 2026: Sprint 10 cerrado para demostración y sustentación local. Regresión completa consolidada con las ejecuciones conservadas y la revalidación de la suite afectada.

| Verificación | Última evidencia comprobada |
| --- | --- |
| Pest completo | 311 aprobadas de 311; 2.028 aserciones; 100 % en la ejecución completada. |
| Pest nuevas de Sprint 10 | 5 aprobadas; incluidas en las 311, no adicionales al total. |
| Cypress nuevas de Sprint 10 | 2 aprobadas de 2 en ejecución focalizada. |
| Cypress completo | 42 casos distintos aprobados: 40 existentes y 2 nuevos. Las 12 suites tienen resultado aprobado; véase desglose y logs debajo. |
| Total de casos distintos | 353 aprobados: 311 Pest + 42 Cypress. Las reejecuciones no aumentan el total. |
| Porcentaje global aprobado | 100 % de los casos en sus resultados finales consolidados; hubo fallos de sincronización corregidos durante el proceso. |
| Pint | Último control --test aprobado. |
| ESLint | Último control aprobado. |
| TypeScript frontend | Aprobado mediante npm run build. |
| TypeScript Cypress | Último npm run typecheck aprobado. |
| Build frontend | Aprobado; 79 módulos transformados. |
| Inventario | 52 tablas y 210 combinaciones método/ruta API, excluyendo HEAD implícito. |

## Alcance comprobado

Los cinco casos nuevos de Pest comprueban los veinte reportes con datos reales, filtros y paginación; permisos e institución; CSV sin campos privados y con fórmulas neutralizadas; los seis dashboards y vínculos familiares; conteo de entregas y validación económica. Los dos flujos Cypress comprueban reporte filtrado/CSV/responsividad y dashboards por rol.

La ejecución inicial completó ocho suites (29 casos) y quedó detenida durante office.cy.ts tras una pausa prolongada. Se conservaron sus resultados y se ejecutaron únicamente las cuatro suites restantes. Personas presentó dos esperas insuficientes de perfiles; se corrigió solo el test, esperando las respuestas HTTP y el renderizado, incluida la URL paginada de relaciones familiares. Su revalidación final aprobó 5/5. No es una única ejecución ininterrumpida ni se suman los intentos repetidos.

| Suite Cypress | Casos finales aprobados |
| --- | ---: |
| academic.cy.ts | 4 |
| attendance.cy.ts | 3 |
| auth.cy.ts | 9 |
| classroom.cy.ts | 3 |
| courses.cy.ts | 3 |
| enrollment.cy.ts | 3 |
| integration.cy.ts | 1 |
| learning.cy.ts | 3 |
| office.cy.ts | 3 |
| people.cy.ts | 5 |
| reports.cy.ts | 2 |
| ui.cy.ts | 3 |
| **Total** | **42** |

Evidencia local conservada, excluida de Git por pertenecer a .tools:

- `.tools/sprint10-pest-final.log`: 311/311, 2.028 aserciones, proceso con salida 0.
- `.tools/sprint10-cypress-final.log`: ocho primeras suites, 29 aprobadas; ejecución interrumpida, sin atribuirle aprobación global.
- `.tools/sprint10-cypress-remaining.log`: office 3/3, reports 2/2 y ui 3/3; el fallo de people de esta ejecución fue reemplazado por su revalidación.
- `.tools/sprint10-cypress-people-complete.log`: people 5/5, salida 0.

Pint, ESLint, TypeScript frontend/Cypress y build se confirmaron durante este cierre. Después solo se modificaron documentación y sincronización de tests; TypeScript Cypress se volvió a validar. Health a través del frontend respondió HTTP 200. Inventario reconfirmado: 52 tablas y 210 combinaciones API.

## QA e inventario

Las seis cuentas demo estaban activas y su contraseña inicial coincidía con la documentada, sin restablecerla. El curso DEMO-MAT-2026 estaba ACTIVE. Se comprobaron los archivos privados referenciados: 7 materiales, 5 entregas, 5 justificaciones y 2 documentos; ninguno faltante en esa revisión.

Los módulos y RF-01 a RF-24 están relacionados con evidencia de implementación en traceability.md y requirements-status.md. La seguridad se revisó mediante código y pruebas de autenticación, CSRF, permisos, aislamiento, IDOR, validación de archivos y descargas; no se presenta como certificación externa de penetración o producción.

## Observaciones y límites

No quedan fallos funcionales reproducidos por la regresión ni pruebas pendientes de este cierre. El log de Vite mostró avisos React de claves duplicadas; queda pendiente localizar y corregir su origen fuera de este cierre, sin atribuirles un impacto funcional no comprobado. Cypress también advierte que su navegador Electron está deprecado. Ambas observaciones se conservan; no se modificaron dependencias ni funcionalidades para ocultarlas.

El bloqueo previo del shell quedó resuelto por autorización expresa del responsable. Se utilizó PowerShell exclusivamente para comandos del proyecto. No se modificaron Windows, WSL, Docker ni System32. La aprobación corresponde a sustentación local, no a certificación de despliegue productivo.
