# PROMPT 45 — CIERRE PRIORIZADO DE PRUEBAS E2E Y PREPARACIÓN DE ENTREGA

Actúa como ingeniero senior de QA, Laravel 13, React 19, Cypress, MySQL 8.4 e integración de software.

Proyecto: `D:\zarate-saas`

Rama: `test/integracion-misional`.

## OBJETIVO

Quiero finalizar la fase de pruebas E2E de EcoAula SaaS y preparar su cierre académico.

**No quiero continuar indefinidamente con diagnósticos, optimizaciones ni pequeños lotes de pruebas.**

Debes priorizar la cobertura funcional de los módulos principales y entregar un informe final honesto, identificando los escenarios que queden pendientes.

## ESTADO ACTUAL

- Pest: 276/314 aprobados; 1.724 aserciones.
- Cypress con API simulada: 141 aprobados.
- Cypress E2E real: 9 casos distintos aprobados.
- 37 casos E2E todavía sin acreditar.
- Dos fallos históricos: Tesorería y Estudiante.
- Dos casos DELETE sobre `communication_targets` excluidos.
- MySQL E2E exclusivo: puerto 3309.
- Base `zarate_cypress_e2e`.
- 52 tablas y 14 migraciones.
- TLS, aislamiento y restauración verificados previamente.

El Prompt 44 resolvió el cuello de botella del bootstrap de Laravel mediante preparación privada y OPcache exclusivo.

El caso CY39-023 aprobó. CY39-024 y CY39-025 quedaron preparados, pero sin ejecutar.

## FASE A — REVISIÓN DE COBERTURA

Recupera el inventario y las evidencias existentes.

Identifica qué recorridos E2E reales ya están acreditados y qué módulos carecen de una comprobación crítica.

Prioriza:

1. Autenticación y control de acceso.
2. Matrículas.
3. Aula Virtual.
4. Evaluaciones.
5. Asistencia.
6. Comunicaciones.

No repitas los nueve casos E2E aprobados.

## FASE B — ÚLTIMO LOTE PRIORITARIO

Selecciona hasta diez casos E2E nuevos que aporten la mayor cobertura funcional posible.

Incluye CY39-024 y CY39-025 si siguen siendo seguros, pertinentes y no están acreditados.

Prioriza al menos un recorrido representativo de cada módulo que todavía no cuente con cobertura E2E real.

No inventes pruebas ni alteres aserciones para cumplir una cuota.

Utiliza únicamente:

- React real.
- Laravel real.
- MySQL E2E exclusivo.
- Datos sintéticos.
- HTTP real.
- Restauración verificada.

Mantén TLS, identidad, aislamiento y autorización máxima de 120 segundos.

Ejecuta secuencialmente y guarda checkpoint por caso.

Si una prueba falla por motivos de sincronización, conserva el fallo y documenta una corrección propuesta. No modifiques automáticamente código funcional ni aserciones originales.

Si aparece una suspensión, una restauración fallida o un problema de seguridad, detén la ejecución y conserva el estado.

## FASE C — CIERRE DE CASOS PENDIENTES

Al terminar el último lote, no inicies automáticamente nuevos grupos.

Clasifica todos los casos restantes como:

- Aprobado.
- Fallido por defecto reproducible.
- Fallido por infraestructura o sincronización.
- Bloqueado por operación no autorizada.
- No ejecutado por el alcance priorizado.

Separa resultados Pest, Cypress simulado, HTTP real y E2E real.

No declares aprobada toda la suite si quedan casos sin acreditar.

Identifica los riesgos críticos que impedirían una entrega y los escenarios que pueden documentarse como limitaciones.

## FASE D — PREPARAR EL CIERRE DE GITHUB

Sin realizar commits ni push todavía:

- Revisar estado de todas las ramas.
- Revisar cambios acumulados de AI-DLC.
- Identificar archivos aptos para versionar.
- Excluir `.tools`, credenciales, bases y certificados privados.
- Preparar el orden de integración de ramas.
- Detectar cambios funcionales pendientes de fusionar.
- Identificar conflictos potenciales.
- Preparar la lista exacta de archivos de documentación y pruebas que deben conservarse.

No ejecutar `git add .`, `git reset --hard` ni `git clean`.

## FASE E — DOCUMENTACIÓN FINAL

Crear o actualizar:

`docs/ai-dlc/misional/VALIDACION-INTEGRAL/resumen-final-validacion-misional.md`

Debe contener:

- Requisitos y módulos cubiertos.
- Resultados Pest.
- Resultados Cypress simulados.
- Resultados HTTP reales.
- Resultados E2E con MySQL.
- Defectos y riesgos conocidos.
- Pruebas pendientes.
- Seguridad y aislamiento.
- Limitaciones de la validación.
- Estado Git.
- Acciones imprescindibles para la entrega.

No presentar el cumplimiento de ISO 9001 como certificación.

## INFORME FINAL

Responde de forma concreta:

1. ¿Qué módulos cuentan con E2E real acreditado?
2. ¿Cuántas pruebas nuevas aprobaron?
3. ¿Cuántos casos quedaron pendientes?
4. ¿Existen defectos críticos sin resolver?
5. ¿Podemos cerrar la fase de pruebas para la entrega académica con las limitaciones documentadas?
6. ¿Qué ramas debemos integrar?
7. ¿Qué documentos deben subirse a GitHub?
8. ¿Qué pasos exactos faltan para finalizar el proyecto?

Clasifica:

A. CIERRE ACADÉMICO RECOMENDADO — COBERTURA CRÍTICA ACREDITADA.

B. CIERRE CON LIMITACIONES — RIESGOS DOCUMENTADOS.

C. NO RECOMENDADO PARA ENTREGA — DEFECTOS CRÍTICOS.

D. BLOQUEADO POR SEGURIDAD O INFRAESTRUCTURA.

No realizar commits ni push.

**OBJETIVO FINAL: CERRAR DE FORMA RESPONSABLE LA FASE DE PRUEBAS DE ECOAULA SAAS, PRIORIZANDO LOS FLUJOS CRÍTICOS Y PREPARANDO INMEDIATAMENTE LA INTEGRACIÓN DE RAMAS Y LA ENTREGA ACADÉMICA.**