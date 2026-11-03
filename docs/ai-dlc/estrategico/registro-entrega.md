# Registro de Bolts realizados — macroproceso estratégico

**Propósito:** inventario fiel de trabajo de esta rama a la fecha de Prompt 17. Distingue lectura/documentación, pruebas realmente intentadas y cambios de aplicación. No certifica los procesos institucionales.

## Datos de entrega de la rama

| Dato | Estado comprobado |
|---|---|
| Rama | `feature/macro-estrategico` |
| HEAD / base | `0d986126da3e21cf96e15a0a881d165727d5d5ff` |
| `main` local al comparar | `0d986126da3e21cf96e15a0a881d165727d5d5ff` |
| Commit de los Bolts documentales | Ninguno. Los documentos están sin seguimiento de Git. |
| Pull Request | No creado; URL no existe todavía. |
| Merge / push | No realizados. |
| Archivos de aplicación | Se ajustó el bloqueo de sesión concurrente para corregir logout; se añadió una aserción E2E de revocación. No se implementó capacidad del macroproceso estratégico. |
| Responsable/autora humana real | No visible/proporcionado en la información disponible. Completar por la persona responsable; no inferirlo del perfil o ruta local. |
| Herramienta/modelo | Copilot en VS Code; modelo y versión exactos no expuestos por el registro disponible. |
| Fecha documentada | 2026-11-02, hora local UTC-05:00. Hora individual de cada prompt no conservada; no se inventa. |
| Aprobaciones institucionales / de código | No registradas. La confirmación del usuario para avanzar de prompt autorizó la revisión/documentación, no la construcción de funciones nuevas. |
| Matriz `Matriz de registro.xlsx` | No encontrada en la copia disponible del repositorio. No hay filas/tickets atribuidos. |

## Resumen por Bolt

| ID / PE | RF | Objetivo y resultado real | Autor/modelo/fecha | Pruebas y estado | SHA / PR | Riesgos o límites |
|---|---|---|---|---|---|---|
| [BOLT-EST-001](BOLT-EST-001/evidencias.md) — PE-01.1 | Sin RF directo identificado; RF-23 no autoriza objetivos/metas. | Inventariar y auditar definición de objetivos/metas; proponer plan y ficha provisional. No existe flujo dedicado verificado. Prompts 01–05. | Nombre de responsable y versión IA no disponibles; Copilot en VS Code. 2026-11-02; hora individual pendiente. | Revisión documental/código; no se ejecutó Pest/Cypress. La ficha no es AS-IS/TO-BE institucional aprobado. | Base `0d98612…`; ningún commit ni PR. | Actor, insumos, horizonte, metas y aprobadores institucionales pendientes. No automatizar sin RF/aprobación. |
| [BOLT-EST-002](BOLT-EST-002/evidencias.md) — PE-01.2 | RF-23 relacionado con reportes; sin RF de seguimiento de objetivos. | Auditar reportes/dashboards y la mejora condicionada. Hay métricas operativas, no seguimiento formal de objetivos. Prompts 06–07. | Nombre de responsable y versión IA no disponibles; Copilot en VS Code. 2026-11-02; hora individual pendiente. | Fuentes y pruebas históricas revisadas; no se ejecutaron pruebas nuevas. | Base `0d98612…`; ningún commit ni PR. | Definiciones, fórmulas, metas, umbrales y aprobaciones institucionales faltan; no crear KPIs supuestos. |
| [BOLT-EST-003](BOLT-EST-003/evidencias.md) — PE-02.1 | Sin RF directo identificado para calendario. | Auditar años/periodos, validaciones, permisos, tenant y dependencias; Prompt 09 no pasó condición de mejora aprobada. Prompts 08–09. | Nombre de responsable y versión IA no disponibles; Copilot en VS Code. 2026-11-02; hora individual pendiente. | No se ejecutó prueba en el Bolt. Las pruebas relacionadas incluidas en la suite focalizada posterior de Prompt 16 pasaron; resultados agregados allí. | Base `0d98612…`; ningún commit ni PR. | Calendario oficial y aprobación institucional no verificados; no alterar datos demo. |
| [BOLT-EST-004](BOLT-EST-004/evidencias.md) — PE-02.2 | Sin RF directo identificado. | Auditar niveles, grados, secciones, asignaturas y dependencias; Prompt 11 no pasó condición de brecha aprobada. Prompts 10–11. | Nombre de responsable y versión IA no disponibles; Copilot en VS Code. 2026-11-02; hora individual pendiente. | No se ejecutó prueba en el Bolt. Las pruebas relacionadas incluidas en la suite focalizada posterior de Prompt 16 pasaron; resultados agregados allí. | Base `0d98612…`; ningún commit ni PR. | “Área” no está definida/modelada como catálogo verificado. “Aula” existente es contenido virtual por curso, no inventario de salones físicos. |
| [BOLT-EST-005](BOLT-EST-005/evidencias.md) — PE-03.1 | RF-23 cubre generación de reportes, no evaluación estratégica completa. | Auditar los 20 reportes, seis dashboards, filtros, fuentes/cálculos, permisos, privacidad, CSV y pruebas; Prompt 13 no pasó condición de aprobación. Prompts 12–13. | Nombre de responsable y versión IA no disponibles; Copilot en VS Code. 2026-11-02; hora individual pendiente. | Fuentes y pruebas Sprint 10 revisadas; no se ejecutaron pruebas en el Bolt. `Sprint10Test.php` se ejecutó posteriormente y pasó en Prompt 16. | Base `0d98612…`; ningún commit ni PR. | KPIs/metas oficiales, responsables, periodicidad, reuniones/decisiones no verificados. No inferir PDF ni automatización de decisiones. |
| [BOLT-EST-006](BOLT-EST-006/evidencias.md) — PE-03.2 | Sin RF específico de acciones de mejora entre RF-01–RF-24. RF-16/17 solicitudes y RF-24 auditoría no son equivalentes. | Auditar acciones de mejora versus auditoría; no se implementó funcionalidad estratégica. Se corrigió además una carrera de sesión/logout encontrada durante Prompt 16. Prompts 14–16. | Nombre de responsable y versión IA no disponibles; Copilot en VS Code. 2026-11-02; hora individual pendiente. | Pest focalizado: 130/130, 994 aserciones; Pest autenticación: 62/62. Cypress smoke: 4/4; funcional aislado: 16/16. `auth.cy.ts`: 8/9 por expectativa preexistente del nombre docente. Ver Prompt 16. | Base `0d98612…`; ningún commit ni PR. | Dueño, procedimiento, estados, evidencias, fechas y aprobadores institucionales no definidos. Automatización opcional fuera de RF necesita autorización explícita. |

## Inventario documental por Bolt

La columna “archivos” es el conjunto creado en cada carpeta por el trabajo de auditoría. El índice y el plan comunes se documentan aparte. Todos son Markdown locales sin seguimiento de Git al revisar Prompt 17.

| Bolt | Archivos |
|---|---|
| BOLT-EST-001 | [01-prompt-inventario.md](BOLT-EST-001/01-prompt-inventario.md), [02-prompt-diagnostico.md](BOLT-EST-001/02-prompt-diagnostico.md), [03-prompt-plan-ai-dlc.md](BOLT-EST-001/03-prompt-plan-ai-dlc.md), [04-prompt-auditoria-pe-01-1.md](BOLT-EST-001/04-prompt-auditoria-pe-01-1.md), [05-prompt-mejora-condicionada-pe-01-1.md](BOLT-EST-001/05-prompt-mejora-condicionada-pe-01-1.md), [evidencias.md](BOLT-EST-001/evidencias.md), [procedimiento-pe-01-1.md](BOLT-EST-001/procedimiento-pe-01-1.md). |
| BOLT-EST-002 | [06-prompt-auditoria-pe-01-2.md](BOLT-EST-002/06-prompt-auditoria-pe-01-2.md), [07-prompt-mejora-condicionada-pe-01-2.md](BOLT-EST-002/07-prompt-mejora-condicionada-pe-01-2.md), [auditoria-pe-01-2.md](BOLT-EST-002/auditoria-pe-01-2.md), [decision-mejora-pe-01-2.md](BOLT-EST-002/decision-mejora-pe-01-2.md), [evidencias.md](BOLT-EST-002/evidencias.md). |
| BOLT-EST-003 | [08-prompt-auditoria-pe-02-1.md](BOLT-EST-003/08-prompt-auditoria-pe-02-1.md), [09-prompt-mejora-condicionada-pe-02-1.md](BOLT-EST-003/09-prompt-mejora-condicionada-pe-02-1.md), [auditoria-pe-02-1.md](BOLT-EST-003/auditoria-pe-02-1.md), [evidencias.md](BOLT-EST-003/evidencias.md). |
| BOLT-EST-004 | [10-prompt-auditoria-pe-02-2.md](BOLT-EST-004/10-prompt-auditoria-pe-02-2.md), [11-prompt-mejora-condicionada-pe-02-2.md](BOLT-EST-004/11-prompt-mejora-condicionada-pe-02-2.md), [auditoria-pe-02-2.md](BOLT-EST-004/auditoria-pe-02-2.md), [decision-mejora-pe-02-2.md](BOLT-EST-004/decision-mejora-pe-02-2.md), [evidencias.md](BOLT-EST-004/evidencias.md). |
| BOLT-EST-005 | [12-prompt-auditoria-pe-03-1.md](BOLT-EST-005/12-prompt-auditoria-pe-03-1.md), [13-prompt-mejora-condicionada-pe-03-1.md](BOLT-EST-005/13-prompt-mejora-condicionada-pe-03-1.md), [auditoria-pe-03-1.md](BOLT-EST-005/auditoria-pe-03-1.md), [decision-mejora-pe-03-1.md](BOLT-EST-005/decision-mejora-pe-03-1.md), [evidencias.md](BOLT-EST-005/evidencias.md). |
| BOLT-EST-006 | [14-prompt-auditoria-pe-03-2.md](BOLT-EST-006/14-prompt-auditoria-pe-03-2.md), [15-prompt-mejora-condicionada-pe-03-2.md](BOLT-EST-006/15-prompt-mejora-condicionada-pe-03-2.md), [16-prompt-pruebas-seguridad-regresion.md](BOLT-EST-006/16-prompt-pruebas-seguridad-regresion.md), [analisis-pe-03-2.md](BOLT-EST-006/analisis-pe-03-2.md), [decision-mejora-pe-03-2.md](BOLT-EST-006/decision-mejora-pe-03-2.md), [evidencias.md](BOLT-EST-006/evidencias.md). |
| Comunes | [indice-bolts.md](indice-bolts.md), [plan-ai-dlc.md](plan-ai-dlc.md), [17-prompt-registro-entrega.md](17-prompt-registro-entrega.md), este [registro-entrega.md](registro-entrega.md). |

## Registro cronológico y fidelidad de prompts

Cada `NN-prompt-*.md` conserva el texto completo de la **plantilla fuente** correspondiente de la guía, cuando dicha plantilla está presente en el documento, y diferencia esa plantilla de la solicitud literal del chat. No es correcto afirmar que la plantilla se envió literalmente: en la conversación varios pasos se solicitaron con respuestas breves como “prompt08”, “prompt12”, “prompt13” o “prompt17” y autorizaciones para avanzar.

El historial antiguo fue resumido. Por ello, donde el archivo no conserva una solicitud literal completa, su redacción no se reconstruye. El registro no sustituye un log exportado de conversación. Las fechas/herramienta/modelo anotadas se citan como disponibles; responsable nominal y versión del modelo quedan pendientes de confirmación. Este es el límite explícito para el requisito de guardar exactamente lo enviado a la IA.

| Orden | Bolt / PE | Plantilla guía y ejecución documentadas |
|---:|---|---|
| 01 | BOLT-001 / PE-01.1 | [Prompt 01](BOLT-EST-001/01-prompt-inventario.md) |
| 02 | BOLT-001 / diagnóstico global | [Prompt 02](BOLT-EST-001/02-prompt-diagnostico.md) |
| 03 | BOLT-001 / plan AI-DLC | [Prompt 03](BOLT-EST-001/03-prompt-plan-ai-dlc.md) |
| 04 | BOLT-001 / PE-01.1 | [Prompt 04](BOLT-EST-001/04-prompt-auditoria-pe-01-1.md) |
| 05 | BOLT-001 / PE-01.1 | [Prompt 05](BOLT-EST-001/05-prompt-mejora-condicionada-pe-01-1.md) |
| 06 | BOLT-002 / PE-01.2 | [Prompt 06](BOLT-EST-002/06-prompt-auditoria-pe-01-2.md) |
| 07 | BOLT-002 / PE-01.2 | [Prompt 07](BOLT-EST-002/07-prompt-mejora-condicionada-pe-01-2.md) |
| 08 | BOLT-003 / PE-02.1 | [Prompt 08](BOLT-EST-003/08-prompt-auditoria-pe-02-1.md) |
| 09 | BOLT-003 / PE-02.1 | [Prompt 09](BOLT-EST-003/09-prompt-mejora-condicionada-pe-02-1.md) |
| 10 | BOLT-004 / PE-02.2 | [Prompt 10](BOLT-EST-004/10-prompt-auditoria-pe-02-2.md) |
| 11 | BOLT-004 / PE-02.2 | [Prompt 11](BOLT-EST-004/11-prompt-mejora-condicionada-pe-02-2.md) |
| 12 | BOLT-005 / PE-03.1 | [Prompt 12](BOLT-EST-005/12-prompt-auditoria-pe-03-1.md) |
| 13 | BOLT-005 / PE-03.1 | [Prompt 13](BOLT-EST-005/13-prompt-mejora-condicionada-pe-03-1.md) |
| 14 | BOLT-006 / PE-03.2 | [Prompt 14](BOLT-EST-006/14-prompt-auditoria-pe-03-2.md) |
| 15 | BOLT-006 / PE-03.2 | [Prompt 15](BOLT-EST-006/15-prompt-mejora-condicionada-pe-03-2.md) |
| 16 | BOLT-006 / validación transversal | [Prompt 16](BOLT-EST-006/16-prompt-pruebas-seguridad-regresion.md) |
| 17 | Todos / entrega | [Prompt 17](17-prompt-registro-entrega.md) |

## Checklist de Pull Request comparado contra `main`

### Estado observado

- HEAD y `main` estaban en `0d986126da3e21cf96e15a0a881d165727d5d5ff`; merge-base igual.
- El trabajo documental aparece como `?? docs/ai-dlc/`; Git todavía no lo incluye en un diff de rama. Por tanto el PR no está listo para revisión de diff hasta que la persona usuaria decida añadir y comprometer los archivos.
- No se creó commit, rama adicional, PR, push o merge. No hay URL que reportar.

### Antes de abrir PR

- [ ] Confirmar nombre real del autor/responsable y versión real del modelo con el runtime o responsable humano.
- [ ] Si se exige transcripción literal del chat, recuperar el historial original resumido; conservar en archivos independientes, cronológicos, sin sustituir el texto de plantilla fuente.
- [ ] Confirmar calendario, áreas, KPIs y procedimiento de acciones de mejora con responsables institucionales; completar las celdas “pendiente” solo con aprobación/evidencia.
- [ ] Confirmar si `Matriz de registro.xlsx` puede incorporarse de forma segura y sin datos personales; registrar fila/ticket solo si realmente existe.
- [x] Preparar `backend/.env.testing` local e ignorado por Git; verificar las variables `MYSQL_TEST_*` sin compartir valores y ejecutar migraciones/pruebas únicamente contra `mysql-test`/`zarate_test` efímera. Los datos se descartaron al detener el contenedor.
- [x] Corroborar el estado de API: `/api/health` responde 200; `/api/v1/dashboard` está protegida y devuelve 401 al enviar `Accept: application/json`. La comprobación sin ese encabezado devolvió 500 por negociación de contenido; no se considera prueba de fallo del dashboard autenticado.
- [x] Corregir el build Docker ignorando el enlace local generado `backend/public/storage` y recreándolo dentro de la imagen; generar un `.env` vacío dentro de la imagen sin copiar secretos.
- [x] Ejecutar Pest focalizado de Sprint 2/4/7/9/10 desde el servicio Docker `backend-test`: 130 aprobados, 0 fallidos, 994 aserciones, sin warnings, contra `zarate_test` efímera.
- [x] Construir y tipar el runner Docker E2E; ejecutar las specs smoke `integration.cy.ts` y `ui.cy.ts`: typecheck correcto, 4 aprobadas y 0 fallidas. Las specs funcionales no se ejecutaron porque el frontend actual enruta al backend de desarrollo.
- [ ] Preparar un stack E2E aislado (API, base y datos demo) antes de ejecutar specs que crean o actualizan datos; no dirigirlas a `zarate_dev`.
- [ ] Revisar el diff real después de `git add`/commit: confirmar que solo contiene documentación estratégica aprobada y no datos personales, secretos, credenciales ni archivos fuera de alcance.
- [ ] Comparar el diff contra `main` actualizado; resolver conflictos sin incorporar ramas de compañeros.
- [ ] Revisar enlaces y referencias a cada archivo dentro del diff y obtener revisión del responsable institucional.
- [ ] Crear PR a `main` solo con autorización explícita; completar URL después de su creación.

### No autorizado por esta entrega

- [ ] No hacer push ni merge automático.
- [ ] No crear módulo ni modificar API, migraciones, permisos o datos demo.
- [ ] No afirmar aprobación institucional, pruebas pasadas, commit SHA de implementación ni URL de PR inexistentes.
