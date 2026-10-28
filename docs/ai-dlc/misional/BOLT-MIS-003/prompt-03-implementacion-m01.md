# BOLT-MIS-003 — PROMPT 03: Implementación de M-01 — Coherencia de acceso al Aula Virtual

Actúa como desarrollador senior especializado en Laravel 13, React 19, TypeScript, control de acceso RBAC, Pest y Cypress.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Ruta: D:\zarate-saas

Rama obligatoria: feature/ensenanza-aprendizaje

Macroproceso: Misional.

Bolt: BOLT-MIS-003.

Procedimientos: PM-02.2, PM-02.3 y PM-02.4.

## DOCUMENTACIÓN OBLIGATORIA

Antes de modificar código, lee:

- docs/ai-dlc/misional/BOLT-MIS-003/diagnostico.md
- docs/ai-dlc/misional/BOLT-MIS-003/plan-mejoras.md
- docs/ai-dlc/misional/BOLT-MIS-003/prompt-02-validacion.md

Implementaremos exclusivamente la mejora M-01 del plan aprobado.

No implementes M-02 ni M-03 todavía.

## OBJETIVO

Corregir las diferencias entre los permisos efectivos de los usuarios y las opciones de navegación de Gestión Institucional y Aula Virtual.

La interfaz debe mostrar únicamente las opciones que el usuario tiene realmente autorizadas, sin ocultar funcionalidades legítimas por depender de permisos no relacionados.

## FASE 1 — VERIFICACIÓN

Antes de programar:

1. Confirma que la rama sea feature/ensenanza-aprendizaje.
2. Comprueba git status. Conserva cualquier cambio previo del usuario.
3. Revisa los siguientes archivos:
   - frontend/src/virtual/access.ts
   - frontend/src/learning/CourseLearning.tsx
   - frontend/src/courses/TeachingPage.tsx
   - frontend/src/virtual/VirtualLayout.tsx
   - frontend/src/App.tsx
4. Revisa los permisos definidos en backend y frontend.
5. Identifica exactamente dónde los predicados de navegación no coinciden con las capacidades autorizadas.
6. Comprueba específicamente los casos de estudiantes con acceso a sus notas y docentes con permisos de tareas, pero sin permisos de materiales.

No supongas que todo el diagnóstico es correcto sin contrastarlo con el código actual.

## FASE 2 — IMPLEMENTACIÓN M-01

Realiza la modificación mínima necesaria para:

1. Unificar los criterios de visibilidad entre menú institucional, cursos y Aula Virtual.
2. Evitar que los permisos de materiales oculten actividades autorizadas.
3. Conservar el acceso a notas propias cuando el permiso correspondiente lo permita.
4. Mantener la navegación correcta con roles personalizados.
5. No mostrar opciones que conduzcan a recursos no autorizados.
6. Mantener la autorización del backend como fuente definitiva de seguridad.

Reutiliza las funciones y componentes existentes.

Si conviene extraer un predicado compartido, hazlo únicamente cuando evite duplicación real y no amplíe permisos.

## FASE 3 — PRUEBAS

Agrega pruebas focalizadas para comprobar:

- Estudiante autorizado para consultar sus notas.
- Docente con permiso de tareas y sin permiso de materiales.
- Usuario sin permiso de acceso al contenido.
- Navegación entre Gestión Institucional y Aula Virtual.
- Ausencia de regresiones con roles existentes.

Ejecuta las pruebas disponibles y relevantes utilizando el entorno local.

Prioriza:

- Compilación del frontend.
- Comprobación TypeScript.
- Cypress focalizado, si el entorno está disponible.
- Pest focalizado, únicamente si modificas comportamiento del backend o necesitas verificar una autorización existente.

No alteres pruebas para hacerlas pasar artificialmente.

Si alguna prueba no puede ejecutarse, explica el motivo y registra NO EJECUTADA.

## FASE 4 — DOCUMENTACIÓN AI-DLC

Guarda este prompt íntegro en:

docs/ai-dlc/misional/BOLT-MIS-003/prompt-03-implementacion-m01.md

Crea:

docs/ai-dlc/misional/BOLT-MIS-003/evidencias-m01.md

Incluye:

- Problema identificado.
- Justificación técnica.
- Archivos realmente modificados.
- Cambios implementados.
- Permisos y roles comprobados.
- Pruebas ejecutadas.
- Resultados exactos.
- Limitaciones pendientes.
- Relación con PM-02 y requerimientos funcionales existentes.

Diferencia claramente pruebas ejecutadas de pruebas solamente identificadas.

## RESTRICCIONES

- No crear tablas ni migraciones.
- No modificar roles o permisos del backend.
- No ampliar privilegios.
- No eliminar verificaciones de autorización.
- No modificar Centro de Matrículas.
- No modificar macroprocesos estratégico o de apoyo.
- No cambiar reglas de notas, tareas, entregas o evaluaciones.
- No instalar nuevas dependencias.
- No implementar M-02 ni M-03.
- No realizar commits, push, merge o Pull Requests.

## RESULTADO ESPERADO

Al terminar, proporciona:

1. Resumen de la implementación M-01.
2. Archivos modificados.
3. Pruebas y resultados.
4. Riesgos o limitaciones.
5. Estado de M-01: COMPLETADO, PARCIAL o BLOQUEADO, con justificación.

No afirmes que todo funciona si no fue verificado mediante pruebas.
