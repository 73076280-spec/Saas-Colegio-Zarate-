# BOLT-EST-006 — Evidencias de PE-03.2 y Prompt 16

## Estado

- Procedimiento: PE-03.2, registrar acciones de mejora.
- Prompts 14–16: auditoría completada; no se implementa una capacidad nueva sin autorización explícita.
- Base: rama `feature/macro-estrategico`, commit `0d98612`.
- Se ajustó `backend/config/session.php` para serializar solicitudes de sesión concurrentes y `e2e/cypress/e2e/learning.cy.ts` para verificar el 401 posterior al logout. No se modificaron migraciones, manifiestos ni lockfiles; `.dockerignore` y `docker/backend/Dockerfile` se ajustaron para builds seguros en Windows.
- Se creó `.env.testing` local e ignorado por Git, se migró la base efímera de pruebas y se ejecutaron los cinco archivos Pest focalizados en `backend-test`: 130 aprobados, 0 fallidos, 994 aserciones, sin warnings.
- Cypress Docker: el typecheck y las specs smoke `integration.cy.ts` y `ui.cy.ts` pasaron 4/4. En un stack aislado con la base `zarate_e2e` en `tmpfs`, los cinco specs funcionales enfocados pasaron 15/16 antes del arreglo y 16/16 después; el cambio y resultados están detallados en Prompt 16.
- Diagnóstico de Learning: tras recibir HTTP 204 en logout, una petición posterior a `/api/v1/auth/me` podía responder 200. Se identificaron dos peticiones API aún en vuelo al iniciar logout: `/api/v1/notifications` y `/api/v1/dashboard`. Se habilitó el bloqueo de sesión de Laravel y se configuró el stack E2E con cache `database`, compartido para locks. La spec ahora verifica HTTP 401 después del logout.
- Validación posterior: `learning.cy.ts` 3/3; cinco specs funcionales 16/16; Pest `Sprint1Test.php` 62/62 (223 aserciones); typecheck E2E aprobado. `auth.cy.ts` tuvo 8/9; el único fallo compara `Demo TEACHER` con el nombre sembrado `Docente Demo`, antes de probar logout para ese rol.
- Los servicios E2E se retiraron tras la ejecución; los servicios de desarrollo permanecieron activos y no se usó `zarate_dev` para los flujos funcionales.
- Corroboración Docker: backend ejecuta PHP 8.4.26, Pest está instalado, MySQL de desarrollo está healthy y `/api/health` responde 200. El puerto MySQL no está publicado al host. Las pruebas usaron únicamente `mysql-test`/`zarate_test`; no se usó la base de desarrollo.
- Se corrigió el build Docker excluyendo del contexto el enlace local generado `backend/public/storage` y recreándolo dentro de la imagen; también se genera un `.env` vacío sin secretos. Los builds `backend-test` y `e2e` y la ejecución desde `backend-test` pasaron.
- El primer intento tuvo seis errores de sesión, resueltos al fijar `SESSION_DRIVER=array`; los seis casos y luego toda la suite focalizada pasaron.
- `/api/v1/dashboard` respondió 401 al enviar `Accept: application/json`, como corresponde a la ruta protegida sin autenticación. La solicitud de comprobación que omitió el encabezado respondió 500 por negociación de contenido; `/api/health` respondió 200.
- Responsable humano: integrante asignado; nombre institucional pendiente. Herramienta: Copilot en VS Code; modelo/versión exactos no disponibles.

## Fuentes

- Texto exacto del Prompt 14 y análisis AS-IS/TO-BE: [14-prompt-auditoria-pe-03-2.md](14-prompt-auditoria-pe-03-2.md) y [analisis-pe-03-2.md](analisis-pe-03-2.md).
- Texto exacto del Prompt 15 y decisión de no implementar: [15-prompt-mejora-condicionada-pe-03-2.md](15-prompt-mejora-condicionada-pe-03-2.md) y [decision-mejora-pe-03-2.md](decision-mejora-pe-03-2.md).
- Texto exacto del Prompt 16, chequeo estático y resultados test: [16-prompt-pruebas-seguridad-regresion.md](16-prompt-pruebas-seguridad-regresion.md).
- Registro de entrega Prompt 17 y checklist comparado con `main`: [registro-entrega.md](../registro-entrega.md) y [17-prompt-registro-entrega.md](../17-prompt-registro-entrega.md).

## Decisiones y límites

- `audit_logs` registra eventos pasados; `academic_requests` gestiona trámites de estudiantes/familias. No se asume equivalencia con acciones correctivas.
- No se nombró responsable institucional ni se verificaron reglas AS-IS fuera del producto. Se solicita validación al dueño del proceso.
- RF-16/17 y RF-24 describen solicitudes y auditoría; ninguno es un RF específico de acciones de mejora.
- Una función nueva requiere autorización explícita, una historia y diseño aprobados; no se programa por Prompt 15 sin esa decisión.
- Matriz de registro.xlsx no se encontró en la copia disponible. Commit y PR no creados.
