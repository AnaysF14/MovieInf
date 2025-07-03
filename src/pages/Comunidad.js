import React, { useState, useEffect } from "react";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchAllMovies, fetchMovieDetails } from "../api/PeliculasAPI";
import "./Comunidad.css";


const Comunidad = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const username = localStorage.getItem("username") || "";
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(username && token);

  const [showLogout, setShowLogout] = useState(false);

  // dropdown click-away
  useEffect(() => {
    if (!showLogout) return;
    const handler = () => setShowLogout(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showLogout]);

  // Cargar películas
  useEffect(() => {
    fetchAllMovies().then(setMovies).catch(console.error);
  }, []);

  return (
    <div className="comunidad-container">
      <nav className="navbar">
        <div className="logo">
          🎬<span style={{ color: "#ffcc00" }}>MovieInf</span>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLogout((v) => !v);
                }}
              >
                <MdAccountCircle size={24} />
                <span>¡Hola, {username}!</span>
              </button>
              {showLogout && (
                <ul className="dropdown-menu">
                  <li
                    onClick={() => {
                      localStorage.removeItem("username");
                      localStorage.removeItem("token");
                      navigate("/", { replace: true });
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
              onClick={() => navigate("/perfil")}
            >
              <MdAccountCircle size={24} />
              <span>Perfil</span>
            </button>
          )}
        </div>
      </nav>

      <main className="main-content">
        <h2>Comunidad</h2>

        {/* Grid de películas */}
        <div className="movie-grid">
          {movies.map((m) => (
            <div
              key={m.id}
              className={`movie-thumb ${selectedMovie?.id === m.id ? "selected" : ""}`}
              onClick={async () => {
                const full = await fetchMovieDetails(m.id);
                setSelectedMovie(full);
              }}
            >
              <img
                src={m.poster_path ? `https://image.tmdb.org/t/p/w200/${m.poster_path}` : "/placeholder.png"}
                alt={m.title}
              />
              <p>{m.title}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default Comunidad;
