// src/pages/Peliculas.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MdMovie, MdAccountCircle } from 'react-icons/md';
import {
  fetchAllMovies,
  fetchGenres
} from '../api/PeliculasAPI';
import './Peliculas.css';

const Peliculas = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';
  const token = localStorage.getItem('token');
  const isLoggedIn = Boolean(username && token);

  const [showLogout, setShowLogout] = useState(false);
  const [favoritas, setFavoritas] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]); // Almacena todas las películas
  const [filteredMovies, setFilteredMovies] = useState([]); // Almacena las películas filtradas
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');  // Término de búsqueda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const favKey = `favoritas_${username}`;
  const pendKey = `pendientes_${username}`;

  // Cargar todos los datos iniciales (películas y géneros)
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [moviesData, genresData] = await Promise.all([fetchAllMovies(), fetchGenres()]);
      setMovies(moviesData); // Guardar todas las películas
      setFilteredMovies(moviesData); // Mostrar todas las películas al inicio
      setGenres(genresData);

      if (isLoggedIn) {
        setFavoritas(JSON.parse(localStorage.getItem(favKey)) || []);
        setPendientes(JSON.parse(localStorage.getItem(pendKey)) || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar las películas. Intenta recargar la página.');
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las películas. Verifica tu conexión a internet.' });
    } finally {
      setLoading(false);
    }
  }, [favKey, pendKey, isLoggedIn]);

  useEffect(() => {
    loadInitialData(); // Llamada inicial para cargar las películas
  }, [loadInitialData]);

  // Filtrar películas por búsqueda y género
  const filterMovies = useCallback(() => {
    let filtered = [...movies]; // Empieza con todas las películas

    // Si el término de búsqueda no está vacío, filtrar por título
    if (searchTerm) {
      filtered = filtered.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filtrar por género (si hay uno seleccionado)
    if (selectedGenre) {
      filtered = filtered.filter(m => m.genre_ids.includes(selectedGenre));
    }

    setFilteredMovies(filtered); // Actualiza las películas filtradas
  }, [movies, searchTerm, selectedGenre]);

  useEffect(() => {
    filterMovies(); // Aplica los filtros solo después de cargar las películas
  }, [searchTerm, selectedGenre, filterMovies]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  // Actualizar término de búsqueda
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);  // Actualizar género seleccionado
  };

  const toggleLista = (key, list, setter, movie, addMsg, remMsg) => {
    const exists = list.some(m => m.id === movie.id);
    const updated = exists ? list.filter(m => m.id !== movie.id) : [...list, movie];
    setter(updated);
    localStorage.setItem(key, JSON.stringify(updated));

    Swal.fire({
      icon: 'success',
      title: exists ? remMsg : addMsg,
      toast: true,
      position: 'top-end',
      timer: 800,
      showConfirmButton: false
    });
  };

  const handleFavoriteClick = (e, movie) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      return Swal.fire({ icon: 'warning', title: 'Debes iniciar sesión', text: 'Guarda tus favoritas tras iniciar sesión', confirmButtonText: 'Ir a login' }).then(() => navigate('/perfil'));
    }
    toggleLista(favKey, favoritas, setFavoritas, movie, 'Añadida a Favoritas', 'Eliminada de Favoritas');
  };

  const handlePendingClick = (e, movie) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      return Swal.fire({ icon: 'warning', title: 'Debes iniciar sesión', text: 'Guarda tus pendientes tras iniciar sesión', confirmButtonText: 'Ir a login' }).then(() => navigate('/perfil'));
    }
    toggleLista(pendKey, pendientes, setPendientes, movie, 'Añadida a Pendientes', 'Eliminada de Pendientes');
  };

  if (loading) {
    return (
      <div className="peliculas-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando películas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="peliculas-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadInitialData}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="peliculas-page">
      <nav className="navbar">
        <div className="logo">
          🎬<span style={{ color: '#ffcc00', marginLeft: '4px' }}>MovieInf</span>
        </div>
        <ul className="nav-links">
          <li><a href="/">Inicio</a></li>
          <li><a href="/peliculas">Películas</a></li>
          <li><a href="/comunidad">Comunidad</a></li>
          <li><a href="/recomendaciones">Recomendaciones</a></li>
        </ul>
        <div className="user-info dropdown">
          {isLoggedIn ? (
            <>
              <button className="profile-btn" onClick={e => { e.stopPropagation(); setShowLogout(v => !v); }}>
                <MdAccountCircle size={24} />
                <span>¡Hola, {username}!</span>
              </button>
              {showLogout && (
                <ul className="dropdown-menu">
                  <li onClick={() => { localStorage.removeItem('username'); localStorage.removeItem('token'); navigate('/perfil'); }}>Cerrar sesión</li>
                </ul>
              )}
            </>
          ) : (
            <button className="profile-btn" onClick={() => navigate('/perfil')}>
              <MdAccountCircle size={24} />
              <span>Perfil</span>
            </button>
          )}
        </div>
      </nav>

      {/* Barra de búsqueda */}
      <div className="search-bar-container">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <input
            type="text"
            placeholder="Buscar película..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchChange}  // Cambiar búsqueda en tiempo real
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      {/* GÉNEROS */}
      <div className="genre-scroll">
        {genres.map(g => (
          <button
            key={g.id}
            className={`genre-btn ${selectedGenre === g.id ? 'active' : ''}`}
            onClick={() => handleGenreChange(g.id)}
          >
            <i className="fas fa-film"></i>
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* Botón Mis Listas debajo de la barra de navegación */}
      <div className="mis-listas-container">
        <button
          className="mis-listas-btn"
          onClick={() => navigate('/tuslistas')}
        >
          Mis Listas
        </button>
      </div>

      {/* Películas */}
      <div className="movie-list">
        {filteredMovies.length ? (
          filteredMovies.map(m => (
            <div
              key={m.id}
              className="movie-card"
              onClick={() => navigate(`/pelicula/${m.id}`)}  // Redirigir a la página de detalles
            >
              {m.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                  alt={m.title}
                  onError={(e) => {
                    e.target.src = '/placeholder-movie.png';
                  }}
                />
              ) : (
                <div className="poster-placeholder">
                  <MdMovie size={72} />
                </div>
              )}
              <div className="card-info">
                <h4>{m.title}</h4>
                {m.release_date && <p>{m.release_date.slice(0, 4)}</p>}
              </div>
              <div className="icon-container">
                <button
                  className={`favorite-btn ${favoritas.some(f => f.id === m.id) ? 'active' : ''}`}
                  onClick={e => handleFavoriteClick(e, m)}  
                >
                  <i className="fa fa-heart" />
                </button>
                <button
                  className={`pending-btn ${pendientes.some(p => p.id === m.id) ? 'active' : ''}`}
                  onClick={e => handlePendingClick(e, m)}  
                >
                  <i className="fa fa-list" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron películas.</p>
            <button onClick={loadInitialData}>
              Mostrar todas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Peliculas;
