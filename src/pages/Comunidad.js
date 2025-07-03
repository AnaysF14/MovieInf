// src/pages/Comunidad.js
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { fetchAllMovies, fetchMovieDetails } from "../api/PeliculasAPI";
import "./Comunidad.css";

const API = process.env.REACT_APP_API || "http://localhost:5001";

const Comunidad = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

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

  // carga películas y todos los comentarios
  useEffect(() => {
    fetchAllMovies().then(setMovies).catch(console.error);
    if (selectedMovie) {
      fetch(`${API}/comments/${selectedMovie.id}`)
        .then((res) => res.json())
        .then(setComments)
        .catch(console.error);
    }
  }, [selectedMovie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment || newRating === 0) {
      return Swal.fire({
        icon: "warning",
        title: "¡Error!",
        text: "Por favor, llena todos los campos.",
        confirmButtonColor: "#ff5733",
      });
    }
    if (!isLoggedIn) {
      const result = await Swal.fire({
        icon: "info",
        title: "¡Atención!",
        text: "Debes iniciar sesión para comentar.",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#00aaff",
        cancelButtonColor: "#ff5733",
      });
      if (result.isConfirmed) navigate("/perfil");
      return;
    }

    const entry = {
      movieId: selectedMovie.id,
      user: username,
      rating: newRating,
      text: newComment,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const saved = await res.json();
      setComments([saved, ...comments]);
      setNewComment("");
      setNewRating(0);
      Swal.fire({
        icon: "success",
        title: "Comentario guardado!",
        text: "Tu comentario se ha guardado correctamente.",
        confirmButtonColor: "#00aaff",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar tu comentario", "error");
    }
  };

  // comentarios de la peli seleccionada
  const filtered = selectedMovie
    ? comments.filter((c) => c.movieId === selectedMovie.id)
    : [];

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

        {/* Todos los comentarios (debajo del grid) */}
        <section className="all-comments-section">
          <h3>Todos los comentarios</h3>
          <div className="comments-list">
            {comments.length > 0 ? (
              comments
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((c) => {
                  const movie = movies.find((m) => m.id === c.movieId) || {};
                  return (
                    <div key={c.id} className="comment-card">
                      <img
                        className="comment-movie-poster"
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w92/${movie.poster_path}` : "/placeholder.png"}
                        alt={movie.title}
                      />
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="username">{c.user}</span>
                          <span className="movie-title">{movie.title || "Película"}</span>
                          <div className="rating">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <FaStar key={i} className={i <= c.rating ? "star selected" : "star"} />
                            ))}
                          </div>
                        </div>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="no-comments">Aún no hay comentarios.</p>
            )}
          </div>
        </section>

        {/* Sección de comentario para la película seleccionada */}
        {selectedMovie && (
          <section className="comments-section">
            <h3>Comenta en {selectedMovie.title}</h3>
            <img
              className="movie-poster"
              src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w300/${selectedMovie.poster_path}` : "/placeholder.png"}
              alt={selectedMovie.title}
            />

            {isLoggedIn ? (
              <form className="comment-form" onSubmit={handleSubmit}>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <FaStar key={st} className={st <= newRating ? "star selected" : "star"} onClick={() => setNewRating(st)} />
                  ))}
                </div>
                <textarea
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit">Enviar</button>
              </form>
            ) : (
              <p className="login-msg">🔒 Debes iniciar sesión para dejar un comentario.</p>
            )}

            <div className="comments-list">
              {filtered.length > 0 ? (
                filtered.map((c, i) => (
                  <div key={i} className="comment-card">
                    <div className="comment-header">
                      <span className="username">{c.user}</span>
                      <div className="rating">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <FaStar key={i} className={i <= c.rating ? "star selected" : "star"} />
                        ))}
                      </div>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="no-comments">Sé el primero en comentar esta película.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Comunidad;
