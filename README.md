<<<<<<< Updated upstream
# MovieInf - Control de Versiones

Este repositorio implementa Git Flow como modelo de trabajo:

## Ramas principales
- `main`: Código en producción
- `develop`: Integración de nuevas funcionalidades

## Ramas de trabajo
- `feature/*`: Funcionalidades nuevas
- `hotfix/*`: Correcciones urgentes

## Flujo de trabajo
1. Crear feature desde `develop`
2. Merge a `develop` (PR simulado)
3. Merge a `main` desde `develop` para release
4. Hotfix directo a `main` y merge a `develop`

## Herramientas
- Git + GitHub Desktop
- Hooks locales con Husky
- Despliegue automático con Netlify (pendiente)
=======
# MovieInf

Proyecto MovieInf - Plataforma web para descubrir, organizar y compartir información sobre películas.

## Estructura del proyecto

- `src/`
  - `pages/` - Páginas principales (Home, Películas, Comunidad, etc.)
  - `components/` - Componentes reutilizables (botones, tarjetas, etc.)
  - `services/` - Servicios para conexión con API/backend
  - `context/` - Context API para manejo de estado global
  - `utils/` - Funciones auxiliares

## Dependencias principales

- React
- react-router-dom
- axios
- formik
- yup
- date-fns
- (Opcional) UI framework como Material-UI, Chakra UI o Bootstrap

## Cómo levantar el proyecto localmente

1. Instalar dependencias:

```bash
npm install
>>>>>>> Stashed changes
