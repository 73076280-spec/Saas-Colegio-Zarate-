# Matrículas — Fase 2.2

## Objetivo y alcance

Transformar el formulario de creación y edición en un asistente de cinco pasos, dentro de EnrollmentLayout. Rama inicial: `test/integracion-misional`. Antes de editar se ejecutaron `git status --short` y `git branch --show-current`; únicamente existía `Microsoft/` sin seguimiento y se conserva. No se modifican Laravel, Tesorería, Aula Virtual, reglas de negocio, migraciones, seeders ni archivos de entorno. Sin commit ni push.

## Análisis previo

Se revisaron `docs/matriculas-fase-2-1.md`, los componentes de matrícula y sus selectores compartidos, las rutas de App.tsx y api.php, EnrollmentOptionsController, EnrollmentController, EnrollmentRequest, EnrollmentService, EnrollmentResource, FamilyController, FamilyRequest, FamilyResource y las políticas y el scope institucional relacionados.

Problemas identificados: formulario plano sin orientación ni revisión; botón de guardar sin explicación del estado resultante; sin resumen del estudiante o vínculo familiar; selectores sin asociación explícita entre etiqueta e identificador; errores agrupados sin relación con los campos; falta de un bloqueo inmediato para dobles envíos y de avisos de carga y listas vacías en los selectores.

Datos realmente disponibles:

- `/api/v1/enrollment-options?kind=students`: identificador y nombre con código del estudiante activo. No aporta documento, fecha de nacimiento, contacto u otros datos personales; no se inventan.
- `kind=years|grades|sections`: años no cerrados, grados y niveles activos con secciones en el año y secciones activas del año/grado. Sección incluye capacidad y cantidad de matrículas aprobadas. Se respetan la búsqueda y la paginación.
- `/api/v1/students/{student}/guardians`: vínculos familiares paginados; nombre, parentesco y condición de principal. Requiere `student-guardians.view`. Los modelos Student y StudentGuardian usan BelongsToInstitution/InstitutionScope. La consulta solo se hace con ese permiso y para el estudiante elegido mediante el selector existente. No se descargan listados generales de familias.

## Flujo anterior y nuevo

Antes: seleccionar estudiante/año/grado/sección, escribir observaciones y guardar; el detalle aparecía inmediatamente.

Ahora:

1. Buscar y seleccionar un estudiante existente; mostrar el nombre/código disponible. En edición el estudiante permanece inmutable.
2. Consultar apoderados vinculados con el permiso existente; mostrar nombre, parentesco y principal, con paginación. Sin permiso, sin vínculos o con error, se explica la situación y se permite continuar porque el guardado no exige ese dato. Las respuestas tardías de otro estudiante se ignoran.
3. Elegir año, grado y sección. Cambiar el año limpia grado/sección; cambiar grado limpia sección. Se reinician las búsquedas dependientes. Se muestran carga, ausencia de opciones, ocupación y disponibilidad informativa cuando están disponibles. Observaciones conserva el máximo existente de 2000 caracteres.
4. Revisar nombres de estudiante, año, grado, sección, observaciones y vínculos familiares disponibles. Permite retroceder sin perder valores. No se exige un pago adicional para guardar.
5. Confirmar únicamente después de la respuesta exitosa de POST/PATCH. Mostrar código y estado real; ofrecer detalle o listado. El formulario usa un bloqueo síncrono y deshabilita controles durante la petición para evitar envíos duplicados.

El POST sigue creando DRAFT; PATCH conserva el estado de la matrícula editable. Guardar no significa enviar ni aprobar. Enviar produce PENDING según las reglas actuales. Las operaciones submit, observe, approve, reject y cancel y sus permisos/estados permanecen en el detalle existente. El backend conserva unicidad por estudiante/año, referencias institucionales, transacciones y validación final de cupos al aprobar, además del requisito condicional de pago existente para aprobación. No se incorpora lógica alternativa en React.

## Archivos

Creados:

- `frontend/src/enrollment/EnrollmentForm.tsx`: asistente compartido por creación y edición.
- `e2e/cypress/e2e/enrollment-wizard.cy.ts`: casos específicos con contratos API simulados y filtro opcional wizardCase para repetir solo casos fallidos o nuevos.
- `docs/matriculas-fase-2-2.md`: este informe.

Modificados:

- `frontend/src/enrollment/EnrollmentsPage.tsx`: extrae el formulario; conserva detalle y transiciones; evita abrir otro formulario mientras uno está activo y refresca la lista al cerrarlo.
- `frontend/src/enrollment/shared.tsx`: asociación de etiquetas, selección de metadatos, estados de carga/error/lista vacía y atributos de error opcionales. Conserva el endpoint y la interfaz anterior para sus otros consumidores; no se cambia PaymentsPage.
- `e2e/cypress/e2e/enrollment.cy.ts`: adapta exclusivamente la navegación del formulario y el acceso al detalle al asistente; no se ejecuta su escenario histórico que incluye Tesorería.

No se necesitan rutas nuevas ni cambios en App.tsx.

## Diseño y accesibilidad

Se reutilizan institutional-card, institutional-field, institutional-button, Message y Status, con los colores institucionales existentes. Progreso numerado con aria-current, tarjetas de revisión y rejillas responsive; controles principales con altura mínima táctil de 44 px. No hay librerías nuevas ni animaciones propias.

Los controles nativos permiten teclado; las etiquetas se asocian con identificadores, el encabezado del paso recibe foco al avanzar/retroceder y el primer campo inválido recibe foco, o su búsqueda si aún carga. Errores del backend junto al campo con aria-invalid/aria-describedby y regiones alert; carga y confirmación con status; aria-busy durante guardado. Los errores de campos ocultos se llevan al paso correspondiente. Los valores permanecen en el estado del formulario al cambiar de paso, sin persistir datos personales en almacenamiento del navegador. Se reutiliza el foco visible institucional. WCAG 2.2 AA es referencia; no se declara conformidad ni se realizó una auditoría completa de contraste/lectores de pantalla.

## Seguridad y límites

Se mantienen Sanctum, Spatie, EnrollmentPolicy y FamilyPolicy, el middleware y los scopes institucionales. No se agregan endpoints, permisos ni campos de escritura. La UI respeta enrollments.create/update y student-guardians.view; Laravel sigue siendo la autoridad. La revisión del código confirma que los endpoints de opciones y familia filtran mediante el scope institucional; las pruebas con interceptores no sustituyen pruebas reales de aislamiento entre instituciones.

El bloqueo del formulario evita doble envío desde esa instancia. No se añade idempotencia al servidor; ante pérdida de la respuesta, la regla de unicidad existente sigue siendo la protección de integridad. Los cupos no se reservan al guardar. Los vínculos se presentan por página, no como una lista exhaustiva descargada en segundo plano.

## Validación y resultados reales

- ESLint del frontend: aprobado.
- TypeScript y build del frontend (`npm --prefix frontend run build`): aprobados.
- TypeScript de e2e (`npm --prefix e2e run typecheck`): aprobado.
- Cypress específico del asistente: seis casos aprobados en ejecuciones selectivas; cero fallos finales. Se conservaron los dos casos aprobados previamente y se ejecutaron por separado el caso principal corregido y los tres adicionales.
- Dos casos aprobados: errores 422 junto al campo conservando observaciones y ausencia de consultas familiares sin permiso con denegación de creación.
- Caso principal aprobado mediante `--env wizardCase=valida`: validación obligatoria, foco, navegación de vuelta, conservación de sección/observaciones, disponibilidad, ancho móvil, petición única y confirmación posterior a éxito. Los casos excluidos por filtro aparecen como pending y no son fallos.

Los tres casos adicionales aprobaron con `--env wizardCase=adicional`: reinicio de dependencias y lista de secciones vacía sin perder observaciones; edición por PATCH conservando OBSERVED y acceso al detalle editable; navegación del Centro y entrada al Aula Virtual con sus contratos simulados. No se ejecutaron operaciones reales de envío/aprobación ni otras transiciones.

Incidencias corregidas durante la validación: fixture de sesión sin institution, selectores de pruebas que confundían botones de paginación con avance/retroceso y uso del mecanismo antiguo Cypress.env (reemplazado por cy.env de Cypress 16). Se corrigió también el foco cuando el selector todavía estaba cargando. Solo se repitieron casos fallidos; no se repitieron suites históricas aprobadas.

Infraestructura: el primer intento aislado de Cypress falló antes de ejecutar pruebas con ENOMEM/uv_os_get_passwd; se pudo ejecutar fuera del aislamiento. El PHP del PATH es 8.2.12 y no satisface >=8.4.1; se encontró `.tools/php/php.exe`, con el que Laravel pudo iniciar y auth/me respondió 401 sin sesión. No se usó Docker ni WSL. La validación del asistente usa interceptores sin escrituras reales; no se ejecutaron migraciones, seeders, regresión de Tesorería ni la regresión completa del SaaS.

Pendientes: comprobación integral del nuevo flujo con sesión y datos reales de Laravel/MySQL, incluyendo aislamiento entre instituciones. La continuidad de Centro/Aula se comprueba en navegador con contratos simulados; no equivale a repetir sus suites completas. Auditoría formal de accesibilidad fuera de este alcance.

## Registro AI-DLC

Prompt: «FASE 2.2 — REDISEÑO PROFESIONAL DEL PROCESO DE MATRÍCULA», suministrado en el adjunto del usuario. Trabajo asistido: análisis de endpoints/permisos/estados reales, extracción del formulario, implementación del asistente accesible, pruebas Cypress específicas, adaptación de navegación histórica y documentación. Se conservaron las restricciones de no alterar reglas, datos, fases anteriores, Tesorería, entorno ni historial Git.

Estado: COMPLETA CON OBSERVACIONES por validación de integración real pendiente.

## Intento de cierre — integración real (14 de noviembre de 2026)

Solicitud: validar exclusivamente el asistente contra Laravel/MySQL reales, sin repetir los seis casos simulados ni modificar el entorno si faltan servicios o datos.

Se revisaron el estado de Git, la rama `test/integracion-misional` y este documento antes de actuar. Se conservaron todos los cambios de la Fase 2.2 y la carpeta preexistente `Microsoft/` sin seguimiento.

Comprobaciones de infraestructura, realizadas en modo de lectura:

| Comprobación | Resultado real |
| --- | --- |
| Escucha local / conexión TCP MySQL, puertos 3306 y 3307 | No disponibles; conexión no establecida |
| Escucha local / conexión TCP Laravel, puerto 8000 | No disponible; conexión no establecida |
| Escucha local / conexión TCP Vite, puerto 5173 | No disponible; conexión no establecida |
| GET http://127.0.0.1:8000/api/v1/auth/me con Accept: application/json | Tiempo de espera agotado; sin respuesta HTTP/JSON verificable |
| GET http://127.0.0.1:5173/ | Tiempo de espera agotado |
| GET http://127.0.0.1:5173/api/v1/auth/me con Accept: application/json | Tiempo de espera agotado; sin respuesta del proxy verificable |
| Configuración normal, lectura exclusiva de conexión/host/puerto/base/usuario | MySQL en 127.0.0.1:3307, base zarate_dev, usuario zarate |
| Configuración de pruebas, misma lectura sin mostrar contraseñas | MySQL en 127.0.0.1:3307, base zarate_test, usuario zarate_test |

La configuración declarada no demuestra que la base ni los datos estén disponibles. No se pudo autenticar una cuenta, consultar opciones reales, crear o editar una matrícula, verificar unicidad/estado persistido, comprobar permisos institucionales en ejecución ni navegar por el Centro con datos reales. Estas comprobaciones quedan **no ejecutadas por indisponibilidad de infraestructura**, no aprobadas ni clasificadas como fallos de aplicación. Tampoco se certifica una respuesta JSON de Laravel en este intento.

Se respetó la indicación de informar la limitación sin modificar el entorno: no se iniciaron servicios, no se cambiaron conexiones, archivos .env ni credenciales, no se ejecutaron migraciones/seeders ni consultas de escritura o eliminación. No se utilizó zarate_dev para operaciones académicas. No se ejecutó Cypress ni se repitieron las seis pruebas simuladas, lint, build o regresiones históricas. No hubo correcciones de código, commit, push ni inicio de Fase 3. Único archivo modificado en este intento: este informe.

Para cerrar la integración se requiere disponer de MySQL con zarate_test/usuario zarate_test, Laravel conectado de forma verificable a esa base y Vite disponible, junto con cuentas y datos de demostración autorizados. Esa disponibilidad debe resolverse sin reutilizar inadvertidamente la conexión normal a zarate_dev. No se solicitó ni realizó una reconfiguración como parte de esta validación.

**Estado de la implementación de Fase 2.2: COMPLETA CON OBSERVACIONES. Cierre de integración real: PENDIENTE por infraestructura no disponible.** Los seis resultados simulados anteriores se conservan y no se presentan como evidencia de integración real.

## Revalidación tras aviso de inicio manual de servicios — 14 de noviembre de 2026

Se retomó exclusivamente la integración real pendiente. Se revisaron nuevamente Git (rama `test/integracion-misional`, cambios anteriores conservados), este informe, backend/AGENTS.md, e2e/cypress.config.ts, frontend/vite.config.ts, backend/phpunit.xml y únicamente las claves no secretas de conexión en los archivos de entorno, sin modificarlos.

### Evidencia nueva de disponibilidad

Las comprobaciones se realizaron primero dentro del aislamiento y después fuera de él para descartar esa causa de falta de acceso:

- No aparecen listeners en 3306, 3307, 8000 o 5173. La enumeración completa de listeners fuera del aislamiento tampoco identifica servicios PHP/MySQL/Vite en otros puertos. No se encontraron procesos php.exe o mysqld.exe ni servicios de Windows con nombre MySQL/MariaDB/XAMPP/Apache. Esto describe lo visible desde la máquina de esta sesión; no contradice que se hayan iniciado servicios en otro entorno o dirección no proporcionada.
- TCP directo a 127.0.0.1:3306 y :3307, fuera del aislamiento: conexión no establecida.
- GET 127.0.0.1:8000/api/v1/auth/me con Accept: application/json: sin respuesta HTTP; curl fuera del aislamiento devuelve código 7, no pudo conectar al servidor.
- Peticiones a localhost:5173/ y localhost:5173/api/v1/auth/me: no se pudo conectar. La comprobación directa adicional de 127.0.0.1:5173 con curl fuera del aislamiento también devuelve código 7.
- No se obtuvo contenido de Laravel que permita verificar JSON válido. Se trata de ausencia de respuesta, no de evidencia de JSON malformado ni de un fallo funcional de matrícula.

### Revisión del aislamiento antes de escribir

La configuración normal declara APP_ENV=local y conexión MySQL a 127.0.0.1:3307, base zarate_dev y usuario zarate. La configuración .env.testing declara APP_ENV=testing, base zarate_test y usuario zarate_test en ese mismo host/puerto. phpunit.xml fuerza DB_CONNECTION=mysql, DB_DATABASE=zarate_test, DB_USERNAME=zarate_test y DB_URL vacío para PHPUnit/Pest.

Cypress usa por defecto http://localhost:5173 y el proxy de Vite usa API_PROXY_TARGET o http://127.0.0.1:8000. Ni Cypress ni el proxy fuerzan la base de pruebas del servidor HTTP. Por ello, la existencia de .env.testing o de las restricciones en phpunit.xml **no garantiza** que una petición del navegador se ejecute en zarate_test. No hay servidor HTTP accesible cuyo entorno efectivo pueda verificarse ni conexión MySQL disponible para comprobar la base/usuario efectivos y los datos autorizados. No se presupone aislamiento.

### Resultado y alcance

| Comprobación | Resultado de este intento |
| --- | --- |
| Revisión de configuración de pruebas, sin modificar .env | Realizada; distinción entre configuración PHPUnit y servidor HTTP documentada |
| Disponibilidad MySQL/Laravel/Vite | Fallida por infraestructura: servicios no alcanzables desde esta sesión, también fuera del aislamiento |
| JSON de Laravel | Pendiente: no se recibió respuesta HTTP |
| Garantía de aislamiento de zarate_test y datos autorizados | No acreditada; se bloquean escrituras |
| Creación, consulta, edición, permisos, cupos y prevención de duplicados contra backend real | No ejecutadas; pendientes por los impedimentos anteriores |
| Continuidad real del Centro de Matrículas | No ejecutada; Vite/API no alcanzables |

No se lanzó ninguna suite Cypress/Pest, ni se repitieron los seis casos simulados. No se realizaron escrituras de datos, login de prueba, cambios de código, migraciones, seeders, cambios de .env/credenciales, inicio o reconfiguración de servicios, cambios de Aula Virtual/Tesorería, commit o push. Único cambio de este intento: la presente documentación. No hay pruebas funcionales reales aprobadas o fallidas en este intento; hay comprobaciones de disponibilidad fallidas y pruebas funcionales pendientes. No se atribuyen al formulario errores de infraestructura.

Pendiente para completar: servicios accesibles desde esta sesión en los endpoints configurados (o sus direcciones efectivas), verificación de que el Laravel HTTP usa zarate_test con usuario zarate_test y disponibilidad de cuentas/registros de prueba autorizados. Solo entonces corresponde ejecutar el flujo focalizado con persistencia y comprobar sus resultados reales. No se inicia Fase 3.

**Estado final de esta revalidación: integración real PENDIENTE. Implementación de Fase 2.2: COMPLETA CON OBSERVACIONES; no se declara cierre integral.**
