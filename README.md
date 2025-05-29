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
