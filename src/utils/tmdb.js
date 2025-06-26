// src/utils/tmdb.js
import axios from 'axios';

export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_READ_TOKEN}`,
    accept: 'application/json'
  },
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
    language: 'es-ES'
  }
});
