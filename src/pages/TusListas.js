import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./TusListas.css"

const TusListas = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const user  = localStorage.getItem("username")

  const [favoritas, setFavoritas]   = useState([])
  const [pendientes, setPendientes] = useState([])

  // cargar listas al montar
  useEffect(() => {
    if (!token || !user) {
      navigate("/perfil", { replace: true })
      return
    }
    const favKey  = `favoritas_${user}`
    const pendKey = `pendientes_${user}`
    setFavoritas(JSON.parse(localStorage.getItem(favKey)) || [])
    setPendientes(JSON.parse(localStorage.getItem(pendKey)) || [])
  }, [token, user, navigate])

  // elimina de una lista y actualiza storage
  const handleRemove = (id, list, setter, key) => {
    const updated = list.filter(m => m.id !== id)
    setter(updated)
    localStorage.setItem(key, JSON.stringify(updated))
  }

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token")
    navigate("/perfil")
  }

  if (!token || !user) return null

  const favKey  = `favoritas_${user}`
  const pendKey = `pendientes_${user}`

  return (
    <div className="tus-listas-container">
      <nav className="navbar">
        <div className="logo">
          🎬<span style={{ color: "#ffcc00" }}>MovieInf</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/peliculas">Películas</Link></li>
          <li><Link to="/comunidad">Comunidad</Link></li>
          <li><Link to="/recomendaciones">Recomendaciones</Link></li>
          <li><Link to="/tuslistas">Mis Listas</Link></li>
          <li><button onClick={handleLogout}>Cerrar sesión</button></li>
        </ul>
      </nav>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Volver
      </button>

      <h2>Tus Listas</h2>

      <section className="lista">
        <h3>Favoritas</h3>
        {favoritas.length > 0 ? (
          <div className="movie-list">
            {favoritas.map(m => (
              <div key={m.id} className="movie-card">
                <img
                  src={m.poster_path
                    ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
                    : m.poster}
                  alt={m.title}
                />
                <div className="overlay">
                  <h4>{m.title}{m.release_date && ` (${m.release_date.slice(0,4)})`}</h4>
                  <div className="overlay-buttons">
                    <button
                      onClick={() =>
                        handleRemove(m.id, favoritas, setFavoritas, favKey)
                      }
                    >
                      Eliminar
                    </button>
                    <button onClick={() => navigate(`/pelicula/${m.id}`)}>
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes películas favoritas.</p>
        )}
      </section>

      <section className="lista">
        <h3>Pendientes</h3>
        {pendientes.length > 0 ? (
          <div className="movie-list">
            {pendientes.map(m => (
              <div key={m.id} className="movie-card">
                <img
                  src={m.poster_path
                    ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
                    : m.poster}
                  alt={m.title}
                />
                <div className="overlay">
                  <h4>{m.title}{m.release_date && ` (${m.release_date.slice(0,4)})`}</h4>
                  <div className="overlay-buttons">
                    <button
                      onClick={() =>
                        handleRemove(m.id, pendientes, setPendientes, pendKey)
                      }
                    >
                      Eliminar
                    </button>
                    <button onClick={() => navigate(`/pelicula/${m.id}`)}>
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes películas pendientes.</p>
        )}
      </section>
    </div>
  )
}

export default TusListas
