**AUTORIZACIÓN CONTROLADA — PREPARACIÓN DEL ENTORNO PEST**

Sí, autorizo preparar la nueva base de datos `zarate_pest` y una cuenta MySQL exclusiva para las pruebas automatizadas de EcoAula SaaS.

La autorización se concede con las siguientes condiciones:

1. Trabajar únicamente sobre el servidor MySQL aislado del puerto `3308`.
2. Crear `zarate_pest` como base exclusiva para pruebas, sin datos reales ni información copiada de desarrollo.
3. Crear una cuenta MySQL específica con privilegios limitados a `zarate_pest`, sin modificar usuarios ni contraseñas existentes.
4. Adaptar las guardas de seguridad para admitir explícitamente este nuevo entorno, conservando el aislamiento, la validación TLS y los controles contra conexiones equivocadas.
5. Mantener completamente protegidas las bases `zarate_dev` y `zarate_test`.
6. No detener ni modificar los servicios de demostración de los puertos `3307`, `8000` y `5173`.
7. No modificar las 14 migraciones originales ni los archivos funcionales de EcoAula.
8. Mantener las credenciales nuevas fuera de GitHub y de los documentos AI-DLC. No mostrarlas en los logs.
9. Verificar mediante pruebas negativas que cualquier intento de utilizar las bases protegidas sea rechazado.

Una vez creado el entorno, autorizo aplicar las migraciones originales **exclusivamente sobre la nueva base `zarate_pest`**, siempre que la identidad de conexión, las guardas y el TLS estén verificados.

Después debes comprobar que las 14 migraciones y el esquema esperado se han aplicado correctamente en esa nueva base.

Las operaciones de limpieza o reconstrucción que los tests puedan requerir solo podrán afectar a `zarate_pest`, tras verificar de manera efectiva que el proceso utiliza esa base. Nunca podrán afectar a `zarate_dev` ni a `zarate_test`.

**No ejecutes todavía los 314 casos Pest.**

Primero quiero un informe que confirme:

- Creación de `zarate_pest`.
- Cuenta exclusiva configurada.
- Privilegios restringidos.
- Guardas positivas y negativas aprobadas.
- TLS e identidad del servidor verificados.
- Esquema de pruebas inicializado y validado.
- Bases existentes intactas.
- Preparación para ejecutar Pest.

Conserva todos los cambios y evidencias anteriores. No hagas commits ni push automáticamente.

Continúa desde el estado actual del Prompt 26, sin comenzar desde cero.
