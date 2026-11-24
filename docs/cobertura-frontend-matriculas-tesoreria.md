# Cobertura frontend — Matrículas 2.2 y Tesorería 3

Pruebas de comportamiento con Vitest 5.1.0, `@vitest/coverage-v8` 5.1.0, Testing Library React 16.3.3 y jsdom 31.0.1. Solo se simula `fetch` (respuestas HTTP): no hay MySQL, Laravel ni escritura de datos reales. No se modificaron componentes, endpoints, permisos ni reglas de negocio.

## Cómo ejecutarlas

```
cd frontend
npm test                # vitest run
npm run test:coverage   # genera frontend/coverage/lcov.info
```

Configuración: `frontend/vitest.config.ts` (jsdom, plugin de React de Vite, cobertura V8). El LCOV se escribe con rutas relativas a la raíz del repositorio (`frontend\src\...`), que es la base desde la que se ejecutó el escáner. `frontend/coverage/` está ignorado por Git.

## Casos aprobados (60 de 60)

| Archivo de prueba | Casos | Cubre |
|---|---|---|
| `tests/enrollment-form.test.tsx` | 19 | Asistente de 5 pasos: validación y foco por paso, `Lookup` (búsqueda, paginación, vacío, error, carga), apoderados (sin permiso, lista, vacío, error), capacidad de sección, reinicio en cascada, revisión, confirmación, bloqueo de doble envío, errores 422/500/red con regreso al paso correspondiente, edición con PATCH. |
| `tests/payments-page.test.tsx` | 25 | Permisos (`payments.view/create/update/validate`, sesión expirada), listado, carga con `<output>`, vacío, errores, filtros y paginación, estado inicial por query string, historial de solo lectura, validar (confirmación, bloqueo, error), editar y registrar pago, conceptos (alta, error, `?create=1`), enlaces del centro. |
| `tests/treasury-dashboard.test.tsx` | 7 | Sin permiso, cuatro indicadores y sus consultas, estados de carga, errores parciales y totales inválidos, actualización, enlaces. |
| `tests/concepts-panel.test.tsx` | 5 | Carga con `<output>`, tabla accesible, vacío, búsqueda y paginación, error con reintento, recarga por revisión. |
| `tests/treasury-layout.test.tsx` | 4 | Bloqueo sin permiso, navegación accesible con `aria-current`, cambio de sección, redirección de `/app/payments` conservando la query. |

## Cobertura obtenida (informe V8 real, última ejecución)

Archivos que cargan las pruebas (14): líneas 176/205 (85,85 %), ramas 385/447 (86,13 %), funciones 138/153.

| Archivo | Líneas | Ramas |
|---|---|---|
| `enrollment/EnrollmentForm.tsx` | 32/32 | 131/134 |
| `enrollment/PaymentsPage.tsx` | 32/32 | 100/104 |
| `enrollment/shared.tsx` | 16/16 | 42/46 |
| `treasury/ConceptsPanel.tsx` | 8/8 | 8/8 |
| `treasury/TreasuryDashboard.tsx` | 21/21 | 40/40 |
| `treasury/TreasuryLayout.tsx` | 7/7 | 2/2 |

Código nuevo: cruzando `git diff 3396781~1` (árbol de trabajo) con las líneas ejecutables del LCOV, 100 de 101 líneas ejecutables nuevas quedan cubiertas (99,0 %). Es un cálculo propio, no una medición de SonarQube.

## Limitaciones

- `vitest`, `@vitest/coverage-v8`, Testing Library y jsdom están en `node_modules`, pero no figuran en `package.json` ni en `package-lock.json`. No se instaló ni se declaró nada; un `npm ci` limpio no los traería. Solo se añadieron los scripts `test` y `test:coverage`.
- Sin cobertura de las líneas de `3396781` en `App.tsx` (9), `EnrollmentsPage.tsx` (4), `AppLayout.tsx` (2) ni de la línea de `navigationIcon` en `Icon.tsx`, fuera del alcance pedido. `Icon.tsx` aparece en el LCOV con esa línea sin cubrir.
- `Icon.tsx` (2/11 líneas), `office/shared.tsx` (9/22) y `AuthContext.tsx` (22/29) están en el informe porque las pruebas los cargan, pero solo se ejercita una parte.
- Las pruebas están en `frontend/tests/`, fuera de `src`. La configuración de SonarQube (`sonar.tests`, exclusiones) no se tocó.
- jsdom no evalúa estilos (`css: false`): no se verifica la apariencia, por ejemplo el punto de carga hecho con utilidades de Tailwind.
- El Quality Gate no se comprobó: no se ejecutó SonarScanner.
