# Contribución

1. Crear una rama desde main. No versionar .env, credenciales, vendor, node_modules ni .tools.
2. Respetar backend Laravel / frontend React / MySQL y el alcance de cada iteración.
3. Backend: Form Requests, Policies, Eloquent, Services/Actions y transacciones.
4. Todo acceso institucional debe validar institution_id en servidor.
5. Cada módulo requiere pruebas positivas, negativas, de autorización y aislamiento institucional.
6. Antes de proponer cambios ejecutar Pint, Pest, build/lint del frontend y Cypress pertinentes.
7. Mantener composer.lock y ambos package-lock.json. Actualizar dependencias conscientemente.
8. Documentar comandos, resultados y verificaciones pendientes; no declarar pruebas no ejecutadas.
9. No hacer cambios del sistema operativo como parte de tareas del repositorio.

Ver docs/pruebas.md. Esta base no implementa funcionalidades académicas.
