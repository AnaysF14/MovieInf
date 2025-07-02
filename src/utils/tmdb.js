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