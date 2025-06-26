// src/pages/Pelicula.js
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { fetchMovieDetails } from '../api/PeliculasAPI'
import './Pelicula.css'

const Pelicula = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovieDetails(id)
      .then(data => {
        setMovie(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        Swal.fire('Error', 'No se pudo cargar la película', 'error')
        navigate('/peliculas')
      })
  }, [id, navigate])

  if (loading) {
    return <div className="pd-loading">Cargando...</div>
  }

  return (
    <div className="pd-page">
      <button className="pd-back" onClick={() => navigate(-1)}>← Volver</button>
      <div className="pd-container">
        <img
          className="pd-poster"
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="pd-info neon-border">
          <h2>
            {movie.title}
            {movie.release_date && ` (${movie.release_date.slice(0,4)})`}
          </h2>
          <p><strong>Géneros:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Duración:</strong> {movie.runtime} min</p>
          <p><strong>Idioma:</strong> {movie.original_language.toUpperCase()}</p>
          <p><strong>Sinopsis:</strong> {movie.overview}</p>
          <p><strong>Actores:</strong></p>
          <ul className="pd-cast">
            {movie.credits.cast.slice(0, 8).map(a => (
              <li key={a.id}>{a.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Pelicula
