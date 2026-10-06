# Sprint 4 — Matrícula digital y validación administrativa

## Alcance

Matrículas, historial, aprobación de Secretaría, control de cupos y validación económica básica de Tesorería. No se implementan cursos, aula virtual, tareas, notas, asistencia, facturación, contabilidad ni Sprint 5. Se conserva la identidad naranja, beige y café.

## Modelo

- `enrollments`: institución, estudiante, año, grado, sección, código, estado, fechas, aprobador, observaciones y soft delete.
- `enrollment_status_history`: institución, matrícula, estado anterior/nuevo, usuario, comentario y fecha. Inmutable; no dispone de endpoints de edición o eliminación.
- `payment_concepts`: institución, nombre, código único por institución, descripción, importe decimal y estado ACTIVE/INACTIVE.
- `student_payments`: institución, estudiante, concepto, año, importe decimal, vencimiento, fecha de pago, estado, validador y observaciones.

La columna generada `active_student_id` tiene un índice único por institución y año. DRAFT, PENDING, OBSERVED y APPROVED impiden un segundo trámite activo; REJECTED y CANCELLED permiten un nuevo trámite. Archivar no libera artificialmente la unicidad ni un cupo aprobado. No se expone eliminación de matrículas; forceDelete está bloqueado y las claves foráneas preservan el historial.

Cada relación Eloquent se consulta en el contexto institucional. Grado hereda la institución de su nivel; sección debe corresponder al grado y año. El historial lleva institution_id adicional para proteger también consultas directas.

## Estados y transiciones

```text
DRAFT -> PENDING -> APPROVED -> CANCELLED
            |          (cupo definitivo)
            +-> OBSERVED -> PENDING
            +-> REJECTED
```

No se reabre REJECTED: se crea un nuevo borrador, conservando el expediente rechazado. No hay transiciones genéricas por PATCH. Solo DRAFT/OBSERVED se editan. El estudiante no cambia tras crear el trámite. Observar, rechazar y cancelar requieren motivo.

Se registra DRAFT inicial y cada transición con usuario y fecha. APPROVED registra approved_by, approved_at y enrolled_at. Una cancelación conserva quién y cuándo aprobó originalmente. La habilitación académica corresponde a una matrícula APPROVED; no cambia el estado global de la persona ni habilita módulos futuros.

## Aprobación y cupos

Se vuelven a consultar y validar, dentro de la transacción:

1. Estudiante ACTIVE de la institución.
2. Año ACTIVE (un borrador puede prepararse en año DRAFT; CLOSED impide creación/envío/aprobación).
3. Nivel, grado y sección ACTIVE, coherentes e institucionales.
4. Ausencia de otro trámite activo del estudiante/año.
5. Cupo disponible: solo APPROVED consume; capacity null es ilimitado y 0 no admite aprobaciones.
6. Pago válido, cuando exista el concepto activo MATRICULA_<año de inicio>.

Se bloquea la fila de institución y la sección con FOR UPDATE. Esto serializa las operaciones del módulo en una institución, incluidos pagos y transiciones, e impide dos aprobaciones simultáneas del último cupo. Las transacciones reintentan bloqueos hasta tres veces. Una cancelación libera el cupo. El frontend muestra ocupación; el backend decide sobre los datos actuales.

Código backend: MAT-AAAA-NNNNNN, generado bajo bloqueo institucional, incluyendo registros archivados, y protegido por índice único institucional. No se promete secuencia sin saltos. El código original permanece estable si se corrige el año del borrador.

## Tesorería

Estados: PENDING, PAID, OVERDUE y CANCELLED. El vencimiento se almacena; no hay scheduler de vencimientos en este sprint. Tesorería puede marcar OVERDUE mediante edición.

Solo payments.validate permite pasar PENDING/OVERDUE a PAID. Se registran usuario y fecha del servidor; no se aceptan desde el cliente. El importe debe cubrir el concepto, con precisión de centavos. Los pagos PAID/CANCELLED son inmutables; las referencias estudiante/año/concepto no se reasignan.

Un concepto ACTIVE con código MATRICULA_2026 exige pago para años que comienzan en 2026. Si no existe concepto activo del año, la matrícula no exige pago. Esta regla es explícita y no admite un flag de bypass del frontend. La aprobación exige un pago PAID, validado, del mismo estudiante, institución, año y concepto, con importe suficiente. No se agregan cuotas parciales ni pagos de otros estudiantes. El importe demo no es una tarifa oficial.

## Permisos

Se agregan 12 permisos, total 58:

- enrollments.view/create/update/submit/observe/approve/reject/cancel.
- payments.view/create/update/validate.

| Rol | Matrículas | Pagos |
| --- | --- | --- |
| ADMINISTRATOR | Gestión completa | Gestión y validación |
| SECRETARY | Gestión completa, incluida cancelación | Consulta |
| TREASURY | Sin gestión | Gestión y validación |
| TEACHER | Sin gestión | Sin acceso |
| STUDENT | Solo propias | Sin acceso |
| GUARDIAN | Solo estudiantes asociados | Sin acceso |

Los portales propios no reciben permiso de listado administrativo: las consultas filtran por el usuario o sus relaciones familiares. Tesorería usa un selector mínimo de estudiantes, sin documentos, teléfonos o direcciones. Policies y Form Requests verifican autorización; las consultas fuera de institución devuelven 404 o un error de referencia genérico, sin revelar existencia sensible.

## API

Todas las rutas requieren Sanctum, institución activa y contraseña inicial cambiada, bajo /api/v1.

| Método | Ruta | Uso |
| --- | --- | --- |
| GET / POST | /enrollments | Listado / creación |
| GET / PATCH | /enrollments/{id} | Detalle con historial / edición |
| POST | /enrollments/{id}/submit | Enviar |
| POST | /enrollments/{id}/observe | Observar |
| POST | /enrollments/{id}/approve | Aprobar |
| POST | /enrollments/{id}/reject | Rechazar |
| POST | /enrollments/{id}/cancel | Cancelar |
| GET | /students/{student}/enrollments | Histórico autorizado |
| GET / POST | /payment-concepts | Conceptos / crear |
| GET / POST | /student-payments | Pagos / crear |
| GET / PATCH | /student-payments/{id} | Detalle / edición |
| POST | /student-payments/{id}/validate | Validar pago |
| GET | /enrollment-options | Selectores mínimos paginados |

Matrículas admite academic_year_id, grade_level_id, section_id, student_id, status y search (código/nombre). Pagos admite academic_year_id, student_id, status y search. Los listados de matrículas, pagos, conceptos y selectores paginan; per_page entre 1 y 100. Los selectores admiten kind=students/years/grades/sections y búsqueda. Grados dependen del año con secciones activas; secciones dependen del grado y año y devuelven capacity/occupied.

Crear matrícula:
```json
{"student_id":1,"academic_year_id":1,"grade_level_id":1,"section_id":1,"observations":"Datos ficticios"}
```

Transición:
```json
{"comment":"Motivo de la decisión"}
```

## Auditoría y atomicidad

CREATE, UPDATE, SUBMIT, OBSERVE, APPROVE, REJECT, CANCEL y PAYMENT_VALIDATE. Se guardan old_values/new_values operativos, usuario, institución y fecha. Se excluyen documentos, credenciales, nombres, observaciones y comentarios libres de la auditoría general; los comentarios necesarios quedan en el historial del trámite. Fallar la auditoría revierte la matrícula, historial y validación del pago correspondientes.

## Frontend

- Gestión Académica -> Matrículas y acceso en navegación/dashboard.
- Formulario con búsqueda paginada de estudiantes y selects Año -> Grado -> Sección.
- Cupos visibles, filtros, tabla responsive, estados cálidos y detalle con historial.
- Acciones por permiso/estado; confirmación para aprobar/rechazar/cancelar.
- Tesorería -> Pagos / Validaciones, conceptos, registro/edición y validación.
- Mi matrícula para estudiantes y apoderados, solo lectura.
- Errores del backend visibles, vacíos y carga; las validaciones del servidor son definitivas.

## Factories y datos demo

Factories Enrollment, PaymentConcept y StudentPayment requieren contexto institucional; los estudiantes usan cuentas ficticias de factories previas.

Con sprints anteriores preparados:
```text
cd backend
php artisan migrate
php artisan db:seed --class=EnrollmentDemoSeeder
php artisan migrate --env=testing
```

Seeder local/testing, transaccional e idempotente: no sobrescribe trámites existentes. Usa institución ZARATE, año 2026 y personas demo existentes. Crea concepto MATRICULA_2026 por 150.00 ficticios, matrícula aprobada/pago validado para student@zarate.test y matrícula observada/pago pendiente para student2@zarate.test. guardian@zarate.test consulta sus relaciones existentes. No se cambian contraseñas.

## Pruebas y calidad

Pest prioriza transiciones, pago correcto, permisos, IDOR, cupos límites, unicidad en base de datos, historial inmutable y rollback. Cypress agrupa el flujo Secretaría/Tesorería, consulta propia/familiar y bloqueo docente. Los datos E2E tienen códigos únicos y estructura académica aislada; no alteran los seeds esenciales.

```text
cd backend
php vendor/bin/pest --compact
php vendor/bin/pint --test
cd ../frontend
npm run lint
npm run build
cd ../e2e
npm run typecheck
npm test
```

## Resultados finales

| Comprobación | Resultado |
| --- | --- |
| Pest, regresión completa | 252 aprobadas, 1295 aserciones |
| Cypress, especificaciones previas | 22 aprobadas en la regresión completa |
| Cypress, matrícula | 3 aprobadas en la reejecución final de la especificación corregida |
| Total Cypress | 25 pruebas distintas aprobadas |
| Total acumulado | 277 pruebas distintas aprobadas |
| Nuevas pruebas Sprint 4 | 21 Pest + 3 Cypress = 24 |
| Pint | Aprobado |
| ESLint | Aprobado |
| TypeScript frontend / Cypress | Aprobado |
| Build de producción | Aprobado |

Se ejecutó la regresión Cypress completa. Tras corregir el registro duplicado de interceptores en el test multirol, se repitió únicamente enrollment.cy.ts: sus tres casos pasaron; las otras cinco especificaciones ya estaban aprobadas y no cambiaron. No se suman reejecuciones al contador.

La prueba académica previa ahora espera las respuestas de periodos y grados antes de contar filas. Se corrigió una carrera de interfaz al editar matrícula: el detalle anterior se oculta hasta terminar la recarga. No quedan fallos conocidos dentro del alcance del Sprint 4.


## Prueba manual

1. Abrir http://localhost:5173/login con institución ZARATE.
2. Ingresar como secretary@zarate.test, contraseña demo ZarateDemo2026! (salvo cambio previo).
3. Abrir Matrículas; usar una persona y estructura de prueba sin otro trámite activo del año.
4. Crear matrícula: estudiante, año, grado y sección; comprobar cupos y guardar.
5. Abrir Detalle -> Enviar -> escribir motivo -> Observar.
6. Editar observaciones, guardar y enviar nuevamente.
7. Intentar aprobar sin pago: debe informar la validación pendiente si aplica MATRICULA_<año>.
8. Cerrar sesión e ingresar como treasury@zarate.test.
9. Abrir Tesorería -> Registrar pago; seleccionar el mismo estudiante, año y concepto y el importe completo.
10. Guardar -> Validar pago; confirmar. Comprobar fecha y validador.
11. Volver como Secretaría, buscar código y Aprobar. Comprobar estado, fecha e historial.
12. Consultar la ocupación de sección desde Nueva matrícula; cancelar una matrícula de prueba con motivo libera cupo.
13. Ingresar como student@zarate.test o guardian@zarate.test -> Mi matrícula; no deben aparecer botones administrativos.
14. Como administrador, revisar Auditoría. La tarifa y los datos demo son ficticios.

## Próximo sprint

Definir Sprint 5 de cursos y asignación docente sobre matrículas aprobadas, con contexto institucional, permisos y pruebas críticas. No se implementa en este sprint.
