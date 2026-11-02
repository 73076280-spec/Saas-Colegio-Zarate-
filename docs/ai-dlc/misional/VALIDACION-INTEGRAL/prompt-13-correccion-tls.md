# VALIDACIÓN INTEGRAL MISIONAL — PROMPT 13: Corrección segura de identidad TLS para Laravel y MySQL aislado

Actúa como ingeniero senior de seguridad TLS, MySQL 8.4, PHP 8.4, Laravel 13 y DevOps en Windows.

## CONTEXTO

Proyecto: EcoAula SaaS — Colegio Zárate de Huancayo, 2026.

Repositorio: D:\zarate-saas

Rama obligatoria: test/integracion-misional

Entorno exclusivo: D:\zarate-saas\.tools\misional-isolated

MySQL aislado:
- Host: 127.0.0.1
- Puerto: 3308
- Base: zarate_test
- Usuario: zarate_test
- TLS obligatorio

## ANTECEDENTES

El Prompt 12 produjo:

Estado: CONFIGURACIÓN PARCIAL — REQUIERE AJUSTES.

Resultados:
- Dos perfiles Laravel verificados offline.
- Seis guardas negativas comprobadas.
- La conexión Laravel–MySQL se bloqueó porque el certificado no identifica 127.0.0.1.
- No se desactivó la validación TLS.
- No hubo conexiones SQL ni servicios iniciados.
- El desarrollo permanece intacto.

## OBJETIVO

Corregir exclusivamente el problema de identidad TLS de la instancia MySQL aislada para permitir futuras conexiones verificadas desde PHP PDO y Laravel.

NO desactivar la validación TLS.

NO ejecutar migraciones, seeders ni pruebas funcionales.

## FASE 1 — REVISIÓN OBLIGATORIA

Lee íntegramente:

- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-base-usuario.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-configuracion-integracion.md
- docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correcciones.md

Revisa las plantillas y perfiles locales del entorno aislado.

Confirma rama, estado Git y rutas reales antes de operar.

## FASE 2 — DIAGNÓSTICO DEL CERTIFICADO

Determina con herramientas locales compatibles:

1. Qué certificado presenta actualmente MySQL.
2. Quién lo emitió.
3. Cuáles son sus Subject Alternative Names (SAN).
4. Si incluye IP:127.0.0.1.
5. Si la CA es confiable para el cliente PHP.
6. Si la cadena de certificados es válida.
7. Si el certificado y su clave privada corresponden.
8. Qué archivos TLS usa realmente MySQL.
9. Qué opciones TLS admite PDO MySQL.
10. Qué mecanismo de verificación usa la configuración Laravel.

No copiar claves privadas ni imprimir información sensible.

No asumir que el Common Name sustituye correctamente a la identidad IP.

## FASE 3 — ESTRATEGIA DE CORRECCIÓN

Priorizar una solución con:

- CA local exclusiva para pruebas, cuando sea necesaria.
- Certificado de servidor válido para 127.0.0.1.
- Subject Alternative Name con IP:127.0.0.1.
- Extensiones de uso apropiadas para servidor TLS.
- Clave privada protegida por ACL.
- Cadena de confianza verificable.
- Configuración explícita en MySQL.
- Verificación de certificado activa en PHP.
- Ausencia de secretos en Git.

No modificar certificados del sistema operativo ni de desarrollo.

No relajar TLS como solución.

## FASE 4 — CORRECCIÓN LOCAL CONTROLADA

Si el diagnóstico demuestra una solución segura y compatible:

1. Crear los certificados de pruebas exclusivamente dentro de .tools/misional-isolated.
2. Utilizar herramientas criptográficas locales confiables.
3. Generar claves privadas con permisos restrictivos.
4. Incluir SAN IP:127.0.0.1 en el certificado del servidor.
5. Configurar las plantillas locales de MySQL para utilizar los certificados nuevos.
6. Configurar los perfiles locales PHP/Laravel para confiar exclusivamente en la CA de pruebas.
7. Conservar las configuraciones anteriores mediante respaldo privado y reversible.
8. No sobrescribir certificados existentes sin respaldo.
9. Verificar la correspondencia entre certificado y clave.
10. Verificar fechas, cadena, SAN y uso del certificado.

Si no se puede asegurar la compatibilidad, detenerse y documentar el bloqueo.

No cambiar contraseñas, usuarios o privilegios SQL.

No modificar backend/.env ni frontend/.env.

## FASE 5 — VERIFICACIÓN OFFLINE

Comprobar:

- Certificado válido para IP:127.0.0.1.
- Cadena de confianza correcta.
- Certificado y clave coincidentes.
- Configuración MySQL compatible.
- Configuración PDO compatible.
- Validación TLS habilitada.
- ACL privadas conservadas.
- Ausencia de cambios en desarrollo.
- Ausencia de secretos versionados.

Realizar también comprobaciones negativas:

- Certificado no confiable rechazado.
- Certificado sin identidad IP adecuada rechazado.
- CA incorrecta rechazada.

Evitar manipular componentes compartidos del proyecto durante las verificaciones.

## FASE 6 — VERIFICACIÓN DE CONEXIÓN, SI ES SEGURA

Solo si todas las guardas previas y la verificación offline están aprobadas:

1. Iniciar exclusivamente MySQL aislado.
2. Acreditar PID, datadir, puerto y ejecutable.
3. Comprobar la conexión TLS desde PHP utilizando la cuenta zarate_test.
4. Verificar que la cadena sea confiable y la identidad del servidor coincida con 127.0.0.1.
5. Comprobar que la conexión está cifrada.
6. Confirmar usuario, base y puerto efectivos mediante consultas SQL de solo lectura.
7. Confirmar que Laravel no accede a zarate_dev.
8. Detener MySQL de forma controlada.

Si alguna guarda falla, no conectar ni continuar.

No ejecutar SQL de escritura.

No ejecutar migraciones, seeders, Pest o Cypress.

No considerar una conexión cifrada como equivalente a una identidad correctamente verificada.

## FASE 7 — DOCUMENTACIÓN AI-DLC

Guardar íntegramente este prompt en:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/prompt-13-correccion-tls.md

Crear:

docs/ai-dlc/misional/VALIDACION-INTEGRAL/evidencias-correccion-tls.md

Registrar:

1. Problema original.
2. Causa técnica identificada.
3. Certificados y SAN verificados, sin secretos.
4. Cambios locales efectuados.
5. Validación de cadena y certificado.
6. Verificación de PDO y Laravel.
7. Resultado de conexión, si se ejecutó.
8. Controles negativos.
9. Resultado de detención.
10. Riesgos pendientes.
11. Procedimiento de reversión.
12. Próxima acción recomendada.

## RESTRICCIONES

- No reinicializar MySQL.
- No modificar zarate_dev.
- No modificar datos académicos.
- No modificar código funcional.
- No ejecutar migraciones ni seeders.
- No ejecutar Pest ni Cypress reales.
- No cambiar usuarios ni contraseñas.
- No conceder privilegios.
- No modificar servicios de desarrollo.
- No desactivar TLS.
- No desactivar la verificación del certificado.
- No almacenar secretos en Git.
- No realizar commits, push, merge ni PR.

Solo se autorizan cambios en certificados y configuraciones locales exclusivos de pruebas, verificaciones seguras de lectura y los dos documentos AI-DLC.

## RESULTADO ESPERADO

Clasifica el resultado como:

- TLS CORREGIDO Y CONEXIÓN VERIFICADA.
- TLS CORREGIDO OFFLINE — CONEXIÓN PENDIENTE.
- REQUIERE AJUSTES.
- BLOQUEADO POR SEGURIDAD.

Explica qué se verificó realmente y qué permanece pendiente.

No declarar habilitadas todas las pruebas de integración por haber solucionado TLS.