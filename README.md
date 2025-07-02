# MovieInf - Control de Versiones

Este repositorio implementa **Git Flow** como modelo de trabajo:

## Ramas principales
- `main`: Código en producción.
- `develop`: Integración de nuevas funcionalidades.

## Ramas de trabajo
- `feature/*`: Funcionalidades nuevas.
- `hotfix/*`: Correcciones urgentes.

## Flujo de trabajo
1. Crear feature desde `develop`.
2. Merge a `develop` (PR simulado).
3. Merge a `main` desde `develop` para release.
4. Hotfix directo a `main` y merge a `develop`.

## Herramientas
- **Git** + **GitHub Desktop**.
- **Hooks locales** con **Husky**.
- **Despliegue automático** con **Netlify** (pendiente).

---

# MovieInf

**MovieInf** es una plataforma web diseñada para ayudar a los aficionados al cine a descubrir, organizar y compartir información sobre sus películas favoritas. Con **MovieInf**, podrás buscar películas con filtros avanzados, crear listas personalizadas, recibir recomendaciones basadas en tus gustos y participar en foros para compartir opiniones con otros usuarios.

## Estructura del Proyecto

- `src/`:
  - `pages/`: Páginas principales (Home, Películas, Comunidad, etc.)
  - `components/`: Componentes reutilizables (botones, tarjetas, etc.)
  - `api/`: Servicios para conexión con API/backend.
  - `utils/`: Funciones auxiliares.
  
- `public/`: Archivos públicos como el `index.html` y el logo.

## Dependencias Principales

- **React**
- **react-router-dom**: Para manejo de rutas.
- **axios**: Para hacer peticiones HTTP.
- **formik**: Para manejo de formularios.
- **yup**: Para validaciones en formularios.

## Cómo Levantar el Proyecto Localmente

1. Clona el repositorio:
    ```bash
    git clone
    cd movieinf
    ```

2. Instala las dependencias:
    ```bash
    npm install
    ```

3. Asegúrate de que el archivo `.env` esté configurado correctamente:
    ```env
    DATABASE_URL=mysql://usuario:contraseña@host:puerto/nombre_db
    TMDB_API_KEY=tu_api_key_de_tmdb
    ```

4. Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```

5. La aplicación estará corriendo en `http://localhost:3000`.

## Rutas Disponibles (API Backend)

- **POST /api/auth/register**: Registra un nuevo usuario.
- **POST /api/auth/login**: Inicia sesión con el usuario registrado.
- **GET /api/movies**: Obtiene una lista de películas filtradas.
- **GET /api/movies/{id}**: Obtiene los detalles de una película específica.
- **POST /api/lists**: Crea una nueva lista personalizada de películas.
- **GET /api/lists**: Obtiene las listas personalizadas del usuario.
- **GET /api/recommendations**: Obtiene recomendaciones personalizadas basadas en el historial de películas.

## Pruebas

Para ejecutar las pruebas unitarias y de integración, asegúrate de tener **Jest** y **Supertest** configurados en tu proyecto. Usa los siguientes comandos para ejecutarlas:

```bash
npm run test
