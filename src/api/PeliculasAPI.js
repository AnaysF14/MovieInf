// src/utils/tmdb.js
import axios from 'axios';

const API_URL = 'https://api.themoviedb.org/3'; // URL CORRECTA

// Verifica que las variables de entorno existen
if (!process.env.REACT_APP_TMDB_API_KEY) {
  console.error('ERROR: REACT_APP_TMDB_API_KEY no está definido');
}

export const tmdb = axios.create({
  baseURL: API_URL,
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
    language: 'es-ES',
    region: 'ES'
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar errores
tmdb.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición TMDB:', error.config.url);
    console.error('Detalles del error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

/**
 * Obtiene algunas películas ordenadas por popularidad (limitadas a N páginas)
 * @param {number} maxPages - Número máximo de páginas a obtener (por defecto 3)
 * @returns {Promise<Array>} - Array de películas
 */
export const fetchAllMovies = async (maxPages = 8) => {
  const allMovies = [];
  let page = 1;
  let totalPages = 1;

  try {
    // Mientras haya más páginas y no hayamos llegado al máximo de páginas, seguir obteniendo resultados
    while (page <= totalPages && page <= maxPages) {
      const response = await tmdb.get('/discover/movie', {
        params: { 
          sort_by: 'popularity.desc', 
          page,
          language: 'es-ES'
        }
      });

      // Agregar las películas obtenidas
      allMovies.push(...response.data.results);
      
      // Actualizar el número total de páginas
      totalPages = response.data.total_pages;
      page++; // Incrementar la página para la próxima solicitud
    }

    return allMovies; // Devolver algunas de las películas obtenidas
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de géneros disponibles
 * @returns {Promise<Array>} - Array de géneros
 */
export const fetchGenres = async () => {
  try {
    const response = await tmdb.get('/genre/movie/list', {
      params: { language: 'es-ES' }
    });
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

/**
 * Obtiene películas filtradas por género
 * @param {number} genreId - ID del género
 * @param {number} page - Página a obtener (por defecto 1)
 * @returns {Promise<Array>} - Array de películas
 */
export const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdb.get('/discover/movie', {
      params: { 
        with_genres: genreId, 
        sort_by: 'popularity.desc', 
        page,
        language: 'es-ES'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

/**
 * Busca películas por texto
 * @param {string} query - Texto de búsqueda
 * @param {number} page - Página a obtener (por defecto 1)
 * @returns {Promise<Array>} - Array de películas
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdb.get('/search/movie', {
      params: { 
        query, 
        page,
        language: 'es-ES'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Obtiene los detalles completos de una película
 * @param {number} movieId - ID de la película
 * @returns {Promise<Object>} - Objeto con detalles de la película
 */
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdb.get(`/movie/${movieId}`, {
      params: { 
        append_to_response: 'credits,similar',
        language: 'es-ES'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

/**
 * Obtiene las próximas películas a estrenarse
 * @param {number} page - Página a obtener (por defecto 1)
 * @returns {Promise<Array>} - Array de películas
 */
export const fetchUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdb.get('/movie/upcoming', { 
      params: { 
        page,
        language: 'es-ES',
        region: 'ES' // Opcional: filtrar por región
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};
