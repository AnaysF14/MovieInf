// src/pages/Recomendaciones.jsx
import React, { useState, useEffect } from 'react'
import { MdAccountCircle } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import './Recomendaciones.css'

const Recomendaciones = () => {
  const navigate = useNavigate()
  const apiKey   = process.env.REACT_APP_TMDB_API_KEY
  const idioma   = 'es-ES'

  // usuario / login state
  const username   = localStorage.getItem('username') || ''
  const token      = localStorage.getItem('token')
  const isLoggedIn = Boolean(username && token)

  // dropdown “Cerrar sesión”
  const [showLogout, setShowLogout] = useState(false)
  useEffect(() => {
    if (!showLogout) return
    const handler = () => setShowLogout(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [showLogout])

  // claves de listas
  const favKey  = `favoritas_${username}`
  const pendKey = `pendientes_${username}`

  // datos TMDB
  const [trending, setTrending]       = useState([])
  const [recommended, setRecommended] = useState([])
  const [modalMovie, setModalMovie]   = useState(null)

  useEffect(() => {
    if (!apiKey) return

    // en tendencia
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=${idioma}`
    )
      .then(r => r.json())
      .then(d => setTrending(d.results||[]))
      .catch(console.error)

    // recomendaciones basadas en tus listas
    const favList  = JSON.parse(localStorage.getItem(favKey))  || []
    const pendList = JSON.parse(localStorage.getItem(pendKey)) || []
    const ids      = [...favList, ...pendList].map(m=>m.id)

    if (ids.length) {
      Promise.all(
        ids.map(id =>
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/recommendations`+
            `?api_key=${apiKey}&language=${idioma}`
          ).then(r=>r.json())
        )
      )
        .then(arrs => {
          const all = arrs
            .flatMap(x=>x.results||[])
            .filter((m,i,a)=>a.findIndex(y=>y.id===m.id)===i)
          setRecommended(all)
        })
        .catch(console.error)
    }
  }, [apiKey, idioma, favKey, pendKey])

  const handleCardClick = m => {
    fetch(
      `https://api.themoviedb.org/3/movie/${m.id}`+
      `?api_key=${apiKey}&language=${idioma}&append_to_response=credits`
    )
      .then(r=>r.json())
      .then(det=>setModalMovie(det))
      .catch(console.error)
  }

  return (
    <div className="recomendaciones-page">
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
                  setShowLogout(v=>!v)
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
                      navigate('/', { replace: true })
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

      <main className="main-content">
        <section>
          <h3>En tendencia</h3>
          <div className="movies-grid">
            {trending.map(m => (
              <div
                key={m.id}
                className="movie-card"
                onClick={()=>handleCardClick(m)}
              >
                <img
                  src={
                    m.poster_path
                      ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                      : '/placeholder.jpg'
                  }
                  alt={m.title}
                />
                <div className="card-info">
                  <h4>{m.title}</h4>
                  {m.release_date && <p>{m.release_date.slice(0,4)}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>Recomendadas para ti</h3>
          {recommended.length > 0 ? (
            <div className="movies-grid">
              {recommended.map(m => (
                <div
                  key={m.id}
                  className="movie-card"
                  onClick={()=>handleCardClick(m)}
                >
                  <img
                    src={
                      m.poster_path
                        ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                        : '/placeholder.jpg'
                    }
                    alt={m.title}
                  />
                  <div className="card-info">
                    <h4>{m.title}</h4>
                    {m.release_date && <p>{m.release_date.slice(0,4)}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">
              Agrega películas a Favoritas o Pendientes para ver recomendaciones
            </p>
          )}
        </section>
      </main>

      {modalMovie && (
        <div
          className="modal-overlay"
          onClick={e=>e.target===e.currentTarget&&setModalMovie(null)}
        >
          <div className="modal-content horizontal">
            <button
              className="modal-close"
              onClick={()=>setModalMovie(null)}
            >×</button>
            <div className="modal-body">
              <img
                className="modal-poster"
                src={`https://image.tmdb.org/t/p/w300${modalMovie.poster_path}`}
                alt={modalMovie.title}
              />
              <div className="modal-details">
                <h2>
                  {modalMovie.title}
                  {modalMovie.release_date&&` (${modalMovie.release_date.slice(0,4)})`}
                </h2>
                <p>
                  <strong>Géneros:</strong>{' '}
                  {modalMovie.genres.map(g=>g.name).join(', ')}
                </p>
                <p>
                  <strong>Duración:</strong> {modalMovie.runtime} min
                </p>
                <p>
                  <strong>Idioma:</strong>{' '}
                  {modalMovie.original_language.toUpperCase()}
                </p>
                <p><strong>Actores:</strong></p>
                <div className="actors-list">
                  {modalMovie.credits.cast.slice(0,6).map(a=>(
                    <span key={a.id} className="actor-chip">{a.name}</span>
                  ))}
                </div>
                <p className="sinopsis">
                  <strong>Sinopsis:</strong> {modalMovie.overview}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Recomendaciones
