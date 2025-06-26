// src/api/PeliculasAPI.js
import { tmdb } from '../utils/tmdb';

/**
 * Trae todas las películas ordenadas por popularidad.
 */
export const fetchAllMovies = (page = 1) =>
  tmdb
    .get('/discover/movie', {
      params: { sort_by: 'popularity.desc', page }
    })
    .then(res => res.data.results);

/**
 * Trae la lista de géneros disponibles.
 */
export const fetchGenres = () =>
  tmdb.get('/genre/movie/list').then(res => res.data.genres);

/**
 * Trae películas filtradas por un ID de género.
 */
export const fetchMoviesByGenre = (genreId, page = 1) =>
  tmdb
    .get('/discover/movie', {
      params: { with_genres: genreId, sort_by: 'popularity.desc', page }
    })
    .then(res => res.data.results);

/**
 * Busca películas por texto.
 */
export const searchMovies = (query, page = 1) =>
  tmdb
    .get('/search/movie', {
      params: { query, page }
    })
    .then(res => res.data.results);

/**
 * Trae los detalles completos de una peli (incluye créditos).
 */
export const fetchMovieDetails = (movieId) =>
  tmdb
    .get(`/movie/${movieId}`, {
      params: { append_to_response: 'credits' }
    })
    .then(res => res.data);

/**
 * Trae las próximas películas a estrenarse
 */
export const fetchUpcomingMovies = (page = 1) =>
  tmdb
    .get('/movie/upcoming', { params: { page } })
    .then(res => res.data.results);