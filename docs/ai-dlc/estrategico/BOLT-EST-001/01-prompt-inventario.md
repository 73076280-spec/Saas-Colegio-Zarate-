# Prompt 01 — Inventario técnico y alcance real

## Registro de ejecución

- Fecha: 2026-11-02 (hora local UTC-05:00; hora individual de envío no registrada).
- Herramienta: asistente de IA Copilot en VS Code.
- Modelo/versión: no visible para el asistente; pendiente de completar por quien registra la sesión.
- Responsable humano: integrante asignado al macroproceso estratégico; nombre institucional pendiente de confirmación.
- Rama: `feature/macro-estrategico`.
- Commit base: `0d98612`.
- Resultado: inventario de solo lectura completado. No se editaron archivos ni se ejecutaron migraciones o pruebas.
- Evidencia: [evidencias.md](evidencias.md).

## Solicitud literal recibida en el chat

> ok, al parecer ese docuemnto tengo que trabajarlo yo y me gustaria que me ayudes con todo ello pero hazlo paso por paso, osea llega hasta cierto punto o cierto prompt y dime que ya lo terminaste y recien yo te confirme para que vayas al otro prompt

> me asignaron esa rama y si no exixte pues tengo que crearla verdad y si es asi continua

## Plantilla fuente aplicada

La plantilla siguiente se transcribe literalmente de `Guia_Ampliada_Prompts_Macroproceso_Estrategico_EcoAula.docx`. Se aplicó como alcance de trabajo, no se afirma que haya sido enviada como un mensaje de chat literal.

> Actúa como arquitecto de software y analista de procesos educativos. Trabajamos sobre EcoAula SaaS del Colegio Zárate, ya implementado hasta Sprint 10. Mi responsabilidad exclusiva es el macroproceso ESTRATÉGICO: PE-01.1, PE-01.2, PE-02.1, PE-02.2, PE-03.1 y PE-03.2. Usa el repositorio abierto en VS Code, identifica rama y commit, y lee README, docs/final-system.md, docs/requirements-status.md, docs/traceability.md, arquitectura y pruebas antes de emitir conclusiones. Inspecciona rutas API, controladores, Form Requests, servicios, modelos, migraciones, pantallas React y suites Pest/Cypress relacionadas. Para CADA procedimiento entrega: propósito, actor, evento inicial, entradas, secuencia, salidas, reglas, archivos/endpoint/pantalla/prueba con ruta verificable, RF relacionado y estado IMPLEMENTADO / PARCIAL / NO IMPLEMENTADO / FUERA DEL ALCANCE. Distingue ‘existe archivo’ de ‘funciona y está probado’. No modifiques archivos ni ejecutes migraciones. Enumera evidencias faltantes y un mapa de dependencias con misional y apoyo. Si no puedes verificar algo, marca ‘NO VERIFICADO’.
