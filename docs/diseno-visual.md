# Identidad visual y tema — refresh posterior a Sprint 10

## Alcance

Refinamiento de presentación sobre los módulos existentes: login, layout, dashboards, perfiles, tablas, formularios, reportes y notificaciones. No cambia reglas académicas ni consultas de los dashboards. No añade dependencias. El único soporte backend incorporado durante el refresh es la foto de perfil, reutilizando `users.avatar_path`, sin migraciones.

## Identidad y recursos

Referencia pública: [Colegios Zárate](https://colegioszarate.edu.pe/) y [Facebook institucional](https://www.facebook.com/ColegiosZarate/). La web oficial aporta el logo y la imagen de infraestructura usados localmente; no se carga contenido de terceros durante la navegación.

- Logo: `frontend/src/assets/colegios-zarate.webp`, aproximadamente 5 KB. Origen: `https://colegioszarate.edu.pe/wp-content/themes/colegios-zarate/assets/img/logo-colegios-zarate.webp`.
- Infraestructura: `frontend/src/assets/campus-zarate.webp`, aproximadamente 133 KB. Origen: `https://colegioszarate.edu.pe/wp-content/themes/colegios-zarate/assets/img/base_desktop.webp`. Uso discreto en login y ficha de la institución ZARATE, con texto alternativo.
- Iconos y estados vacíos: SVG/CSS locales, sin librerías pesadas. No se descargaron fotografías de perfiles personales ni se asignaron fotos ficticias a usuarios.

## Tokens y accesibilidad

`frontend/src/index.css` centraliza fondos, superficies, texto, bordes, acentos y estados. Claro: naranja `#F6A43B`, hover `#FFB750`, amarillo `#FBBB16`, fondo `#FAF8F4`, tarjetas blancas y texto `#30312F`. Oscuro: fondo `#191C20`, tarjetas `#24282D`, texto `#F4F0E9`, texto secundario `#C5B9A8`, acento cálido `#FFC478`.

Estados positivos, advertencias y errores tienen texto e indicadores además de color. Formularios mantienen labels, foco visible, mensajes `alert/status` y controles nativos. Animaciones breves de 160–250 ms; `prefers-reduced-motion` desactiva animaciones y transiciones. Tablas conservan desplazamiento horizontal dentro de su contenedor; navegación móvil horizontal sin desbordar la página.

## Tema

Toggle discreto en el header autenticado, con nombre accesible y estado `aria-pressed`. Se guarda por institución y cuenta en `localStorage` mediante `zarate.theme.{institution_id}.{user_id}`. Si el almacenamiento no está disponible, el cambio sigue funcionando durante la sesión. El tema se aplica solo al contenedor `.app-shell`: el login y la pantalla técnica permanecen claros. No hay toggle en login ni se guarda información sensible.

## Fotos

- `POST /api/v1/profile/avatar`: foto propia, permiso `profile.update`, multipart `photo`, hasta 2 MB/4096 × 4096 px; JPG/JPEG, PNG o WebP, comprobados por Laravel. SVG y otros formatos se rechazan.
- `DELETE /api/v1/profile/avatar`: eliminar foto propia con `profile.update`.
- `GET /api/v1/users/{user}/avatar`: lectura autenticada mediante Policy, misma institución, titular autorizado, administración/consulta de personas autorizada o apoderado activo vinculado a un estudiante activo.
- Disco privado `avatars`, sin enlace público. Nombre generado, respuesta `private, no-store` y `nosniff`. DTO ofrece `avatar_url`, sin revelar ruta física. Cambio transaccional y auditado; reemplazo elimina la imagen anterior después del commit.
- Vista previa local revocada al cambiar/cancelar o desmontar; fallback de iniciales ante ausencia o fallo. Esta interfaz permite editar solamente la foto propia, sin ampliar permisos sobre fotos de terceros.

## Comprobación manual

1. Abrir `/login`: logo, imagen institucional, formulario y ausencia de toggle. Comprobar móvil.
2. Entrar con una cuenta demo existente. Cambiar tema desde el header y recargar: se conserva por cuenta.
3. Abrir Inicio, Reportes, Mi perfil y Notificaciones en ambos temas; comprobar teclado, tablas, inputs y estados.
4. En Mi perfil elegir imagen válida: revisar vista previa, cancelar o guardar. Recargar y verificar avatar de cabecera. Eliminar únicamente si se desea quitar la foto propia.
5. Con estudiante consultar el resumen de matrículas; con docente los cursos; con apoderado las relaciones. La información procede de las rutas autorizadas existentes.
6. Cerrar sesión: vuelve al login claro. Activar la preferencia de movimiento reducido del navegador para comprobar que no se reproducen animaciones.

## Validación

Validación final del 11 de octubre de 2026: Pint, ESLint, TypeScript frontend/Cypress y build aprobados. Tres pruebas Pest de avatares aprobadas (29 aserciones). Cypress focalizado: 13/13 casos distintos aprobados — 9 de autenticación, 2 de reportes y 2 visuales. Los dos visuales se revalidaron tras los ajustes móviles; no se suman nuevamente. Evidencia: `.tools/refresh-visual-qa.log` y `.tools/refresh-visual-final.log`.

Capturas revisadas: login claro en escritorio/móvil, dashboard claro/oscuro, perfil oscuro y selector de reportes oscuro. Se comprobó navegación, persistencia al recargar, ausencia del toggle en login, apertura de notificaciones, vista previa de foto y ausencia de desbordamiento de página. La revisión final corrigió únicamente un espacio entre frases del login móvil, sin repetir pruebas ni alterar comportamiento. No se detectaron otros errores visuales bloqueantes en las capturas revisadas.

Al cerrar sesión deja de aplicarse el tema oscuro y se muestra el login claro; la preferencia por cuenta permanece guardada para el siguiente ingreso. No se borra localStorage al salir.

README actualizado con enlace a esta guía, comportamiento del tema y las tres rutas de fotos. Los avisos técnicos previos sobre claves React duplicadas y deprecación de Electron no se consideran resueltos por este trabajo visual. No se presenta esta validación focalizada como una nueva ejecución de toda la regresión de los Sprints 1–10.
