// src/pages/Peliculas.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  fetchAllMovies,
  fetchGenres,
  fetchMoviesByGenre,
  searchMovies,
  fetchMovieDetails
} from '../api/PeliculasAPI'
import { MdMovie, MdSearch, MdAccountCircle } from 'react-icons/md'
import './Peliculas.css'

const Peliculas = () => {
  const navigate = useNavigate()
  const username   = localStorage.getItem('username') || ''
  const token      = localStorage.getItem('token')
  const isLoggedIn = Boolean(username && token)

  // controla abierto/cerrado del dropdown
  const [showLogout, setShowLogout] = useState(false)

  const favKey  = `favoritas_${username}`
  const pendKey = `pendientes_${username}`

  const [favoritas, setFavoritas]   = useState([])
  const [pendientes, setPendientes] = useState([])
  const [genres, setGenres]         = useState([])
  const [movies, setMovies]         = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalMovie, setModalMovie] = useState(null)

  useEffect(() => {
    fetchAllMovies().then(setMovies).catch(console.error)
    fetchGenres().then(setGenres).catch(console.error)

    if (isLoggedIn) {
      setFavoritas(JSON.parse(localStorage.getItem(favKey)) || [])
      setPendientes(JSON.parse(localStorage.getItem(pendKey)) || [])
    } else {
      setFavoritas([])
      setPendientes([])
    }
  }, [isLoggedIn, favKey, pendKey])

  useEffect(() => {
    if (!selectedGenre) return
    fetchMoviesByGenre(selectedGenre).then(setMovies).catch(console.error)
  }, [selectedGenre])

  useEffect(() => {
    const term = searchTerm.trim()
    if (term) {
      searchMovies(term).then(setMovies).catch(console.error)
      setSelectedGenre(null)
    } else if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre).then(setMovies).catch(console.error)
    } else {
      fetchAllMovies().then(setMovies).catch(console.error)
    }
  }, [searchTerm, selectedGenre])

  const handleSearchChange = e => setSearchTerm(e.target.value)

  const toggleLista = (key, list, setter, movie, addMsg, remMsg) => {
    const exists  = list.some(m => m.id === movie.id)
    const updated = exists
      ? list.filter(m => m.id !== movie.id)
      : [...list, movie]

    setter(updated)
    localStorage.setItem(key, JSON.stringify(updated))

    Swal.fire({
      icon: 'success',
      title: exists ? remMsg : addMsg,
      toast: true,
      position: 'top-end',
      timer: 800,
      showConfirmButton: false
    }).then(() => navigate('/tuslistas'))
  }

  const handleFavoriteClick = (e, movie) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      return Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión',
        text: 'Guarda tus favoritas tras iniciar sesión',
        confirmButtonText: 'Ir a login'
      }).then(() => navigate('/perfil'))
    }
    toggleLista(
      favKey,
      favoritas,
      setFavoritas,
      movie,
      'Añadida a Favoritas',
      'Eliminada de Favoritas'
    )
  }

  const handlePendingClick = (e, movie) => {
    e.stopPropagation()
    if (!isLoggedIn) {
      return Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión',
        text: 'Guarda tus pendientes tras iniciar sesión',
        confirmButtonText: 'Ir a login'
      }).then(() => navigate('/perfil'))
    }
    toggleLista(
      pendKey,
      pendientes,
      setPendientes,
      movie,
      'Añadida a Pendientes',
      'Eliminada de Pendientes'
    )
  }

  // cerrar dropdown al hacer click fuera
  useEffect(() => {
    if (!showLogout) return
    const handler = () => setShowLogout(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [showLogout])

  return (
    <div className="peliculas-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          🎬<span style={{ color: '#ffcc00', marginLeft: 4 }}>MovieInf</span>
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
              <button
                className="profile-btn"
                onClick={e => {
                  e.stopPropagation()
                  setShowLogout(v => !v)
                }}
              >
                <MdAccountCircle size={24} />
                <span>¡Hola, {username}!</span>
              </button>
              {showLogout && (
                <ul className="dropdown-menu">
                  <li
                    onClick={() => {
                      localStorage.removeItem('username')
                      localStorage.removeItem('token')
                      navigate('/perfil')
                    }}
                  >
                    Cerrar sesión
                  </li>
                </ul>
              )}
            </>
          ) : (
            <button
              className="profile-btn"
              onClick={() => navigate('/perfil')}
            >
              <MdAccountCircle size={24} />
              <span>Perfil</span>
            </button>
          )}
        </div>
      </nav>

      {/* BÚSQUEDA + MIS LISTAS */}
      <div className="search-and-lists">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="search-icon"
            onClick={e => e.preventDefault()}
          >
            <MdSearch size={20} />
          </button>
        </div>
        {isLoggedIn && (
          <button
            className="listas-btn-outside"
            onClick={() => navigate('/tuslistas')}
          >
            Mis Listas
          </button>
        )}
      </div>

      {/* GÉNEROS */}
      <div className="genre-scroll">
        {genres.map(g => (
          <button
            key={g.id}
            className={`genre-btn ${selectedGenre === g.id ? 'active' : ''}`}
            onClick={() => {
              setSearchTerm('')
              setSelectedGenre(g.id)
            }}
          >
            <MdMovie className="genre-icon" size={18} />
            <span>{g.name}</span>
          </button>
        ))}
      </div>

      {/* PELÍCULAS */}
      <div className="movie-list">
        {movies.length ? (
          movies.map(m => (
            <div
              key={m.id}
              className="movie-card"
              onClick={() => fetchMovieDetails(m.id).then(setModalMovie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                alt={m.title}
              />
              <div className="card-info">
                <h4>{m.title}</h4>
                {m.release_date && <p>{m.release_date.slice(0, 4)}</p>}
              </div>
              <div className="icon-container">
                <button
                  className={`favorite-btn ${
                    favoritas.some(f => f.id === m.id) ? 'active' : ''
                  }`}
                  onClick={e => handleFavoriteClick(e, m)}
                >
                  <i className="fa fa-heart" />
                </button>
                <button
                  className={`pending-btn ${
                    pendientes.some(p => p.id === m.id) ? 'active' : ''
                  }`}
                  onClick={e => handlePendingClick(e, m)}
                >
                  <i className="fa fa-list" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No se encontraron películas.</p>
        )}
      </div>

      {/* MODAL */}
      {modalMovie && (
        <div
          className="modal-overlay"
          onClick={e => e.target === e.currentTarget && setModalMovie(null)}
        >
          <div className="modal-content horizontal">
            <button className="modal-close" onClick={() => setModalMovie(null)}>×</button>
            <div className="modal-body">
              <img
                className="modal-poster"
                src={`https://image.tmdb.org/t/p/w300${modalMovie.poster_path}`}
                alt={modalMovie.title}
              />
              <div className="modal-details">
                <h2>
                  {modalMovie.title}
                  {modalMovie.release_date && ` (${modalMovie.release_date.slice(0, 4)})`}
                </h2>
                <p><strong>Géneros:</strong> {modalMovie.genres.map(g => g.name).join(', ')}</p>
                <p><strong>Duración:</strong> {modalMovie.runtime} min</p>
                <p><strong>Idioma:</strong> {modalMovie.original_language.toUpperCase()}</p>
                <p><strong>Actores:</strong></p>
                <div className="actors-list">
                  {modalMovie.credits.cast.slice(0, 6).map(actor => (
                    <span key={actor.id} className="actor-chip">{actor.name}</span>
                  ))}
                </div>
                <p className="sinopsis"><strong>Sinopsis:</strong> {modalMovie.overview}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Peliculas
