# Automatización del proceso de autenticación - EcoAula

## 1. Información general

**Proyecto:** Implementación de una plataforma SaaS para mejorar
la gestión académica del Colegio Zárate de Huancayo, 2026.

**Software:** EcoAula.

**Proceso seleccionado:** Autenticación de usuarios.

**Tipo de automatización:** Pruebas automatizadas mediante
integración continua (CI).

**Rama de desarrollo:** feature/pruebas-autenticacion.

## 2. Objetivo

Automatizar la ejecución de pruebas del proceso de autenticación
de EcoAula para verificar su correcto funcionamiento e identificar
regresiones durante el desarrollo del software.

## 3. Descripción del proceso

El proceso de autenticación permite que los usuarios registrados
accedan a EcoAula mediante sus credenciales institucionales.

El sistema verifica la identidad del usuario, las credenciales
proporcionadas y las condiciones de acceso correspondientes.

Se incluyen comprobaciones relacionadas con:

- Inicio de sesión.
- Credenciales incorrectas.
- Estado de usuarios e instituciones.
- Cierre de sesión.
- Cambio de contraseña.
- Autorización y restricciones de acceso.

## 4. Tecnologías utilizadas

| Herramienta | Función |
|---|---|
| Laravel | Desarrollo del backend |
| Pest | Ejecución de pruebas automatizadas |
| Docker Compose | Entorno aislado de ejecución |
| MySQL | Base de datos de pruebas |
| GitHub Actions | Integración continua |
| Git y GitHub | Versionamiento y revisión |

## 5. Implementación de la automatización

La automatización se configuró mediante el archivo:

.github/workflows/pruebas-autenticacion.yml

Este flujo permite ejecutar pruebas desde GitHub Actions
cuando se producen los eventos definidos en el workflow.

El entorno utiliza contenedores Docker y una base de datos
MySQL independiente para evitar trabajar con los datos
de uso normal del sistema.

## 6. Archivos de pruebas

### 6.1. Pruebas existentes

Archivo:

backend/tests/Feature/Sprint1Test.php

Se ejecutaron 62 pruebas existentes del Sprint 1,
con 223 aserciones.

### 6.2. Pruebas adicionales

Archivo:

backend/tests/Feature/AutenticacionAdicionalTest.php

Se incorporaron tres pruebas adicionales:

**PA-01: Intento de autenticación incorrecto**

Verifica que un intento fallido de inicio de sesión
no se registre como un acceso exitoso.

**PA-02: Institución desactivada**

Verifica que el acceso sea rechazado cuando una
institución se encuentra desactivada.

**PA-03: Cambio de contraseña**

Verifica que, después de modificar la contraseña,
la contraseña anterior deje de permitir el inicio de sesión.

## 7. Ejecución local

Desde la raíz del proyecto se ejecutó:

```powershell
docker compose --profile testing run --rm -v "./backend/.env.testing:/var/www/html/.env:ro" backend-test php vendor/bin/pest tests/Feature/Sprint1Test.php tests/Feature/AutenticacionAdicionalTest.php --compact
```

La ejecución se efectuó mediante el servicio
backend-test y la base de datos destinada a pruebas.

## 8. Resultados

| Indicador | Resultado |
|---|---|
| Pruebas originales | 62 |
| Pruebas adicionales | 3 |
| Total de pruebas | 65 |
| Aserciones | 236 |
| Pruebas fallidas | 0 |
| Resultado local | Aprobado |
| Resultado GitHub Actions | Exitoso |

La ejecución local finalizó con:

Tests: 65 passed (236 assertions)

GitHub Actions también finalizó correctamente
para los cambios de la rama de autenticación.

## 9. Integración continua

La integración continua permite ejecutar las
pruebas de forma automatizada y detectar errores
antes de incorporar cambios a la rama principal.

El trabajo se desarrolló en:

feature/pruebas-autenticacion

Commits principales:

- 1e55818: configuración de pruebas automáticas con Pest.
- 3af6895: incorporación de pruebas adicionales.

Se creó un Pull Request para revisar los cambios
antes de integrarlos a main.

## 10. Evidencias

Evidencia 1: ejecución local de las 62 pruebas originales.

Evidencia 2: ejecución de las 3 pruebas adicionales.

Evidencia 3: ejecución conjunta de 65 pruebas y 236 aserciones.

Evidencia 4: ejecución exitosa en GitHub Actions.

Evidencia 5: Pull Request sin conflictos y con
comprobaciones automáticas aprobadas.

## 11. Limitaciones

Las pruebas realizadas verifican comportamientos del proceso
de autenticación, pero no demuestran por sí solas
la seguridad integral ni la escalabilidad de EcoAula.

Será necesario complementar el trabajo con pruebas
de carga, seguridad, rendimiento y otros módulos
del sistema antes de considerar su comercialización.

## 12. Conclusiones

Se consiguió automatizar satisfactoriamente la ejecución
de 65 pruebas mediante Pest, Docker y GitHub Actions.

La incorporación de integración continua permite detectar
posibles regresiones en el proceso de autenticación.

El uso de una rama independiente y un Pull Request
facilita la colaboración y la revisión del código.

Esta implementación constituye una primera etapa
del aseguramiento de calidad de EcoAula.