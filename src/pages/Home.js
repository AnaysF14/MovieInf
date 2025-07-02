// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import "./Home.css"

import pelicula1 from "../assets/images/pelicula1.jpg"
import pelicula2 from "../assets/images/pelicula2.jpeg"
import pelicula5 from "../assets/images/pelicula9.jpg"
import pelicula6 from "../assets/images/pelicula6.jpg"
import pelicula7 from "../assets/images/pelicula7.jpg"
import pelicula8 from "../assets/images/pelicula8.jpg"
import { MdAccountCircle } from "react-icons/md"

import { fetchUpcomingMovies } from "../api/PeliculasAPI"

const carouselImages = [
  { src: pelicula5, alt: "Carrusel 1" },
  { src: pelicula6, alt: "Carrusel 2" },
  { src: pelicula7, alt: "Carrusel 3" },
  { src: pelicula8, alt: "Carrusel 4" },
]

const Home = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [showLogout, setShowLogout] = useState(false)
  const isLoggedIn = Boolean(username)

  const [current, setCurrent] = useState(0)
  const timeoutRef = useRef(null)

  const [upcoming, setUpcoming] = useState([]) // Películas próximas
  const notifiedRef = useRef([]) // Para evitar notificar varias veces la misma película

  // 1) Obtener usuario
  useEffect(() => {
    const saved = localStorage.getItem("username")
    if (saved) setUsername(saved)
  }, [])

  // 2) Carousel automático
  useEffect(() => {
    timeoutRef.current = setTimeout(
      () => setCurrent(i => (i + 1) % carouselImages.length),
      2000
    )
    return () => clearTimeout(timeoutRef.current)
  }, [current])

  const nextSlide = () =>
    setCurrent(i => (i + 1) % carouselImages.length)
  const prevSlide = () =>
    setCurrent(i => (i === 0 ? carouselImages.length - 1 : i - 1))

  // 3) Manejo de logout
  const handleLogout = e => {
    e.stopPropagation()
    localStorage.removeItem("username")
    setUsername("")
    setShowLogout(false)
    navigate("/perfil")
  }
  useEffect(() => {
    if (!showLogout) return
    const h = () => setShowLogout(false)
    window.addEventListener("click", h)
    return () => window.removeEventListener("click", h)
  }, [showLogout])

useEffect(() => {
  fetchUpcomingMovies()
    .then(arr => {
      console.log("Películas obtenidas:", arr); // Debugging: Verificando las películas obtenidas
      const hoy = new Date();
      const filt = arr
        .filter(m => {
          const rd = new Date(m.release_date);
          return rd >= hoy && rd.getFullYear() >= 2025;
        })
        .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      setUpcoming(filt);
    })
    .catch(console.error);
}, []);

useEffect(() => {
  console.log("Películas en `upcoming`:", upcoming); // Debugging: Verificando las películas en `upcoming`

  const hoy = new Date();
  upcoming.forEach(m => {
    if (!m.release_date) return;

    const rd = new Date(m.release_date);
    const diff = Math.floor((rd - hoy) / (1000 * 60 * 60 * 24));

    console.log(`Película: ${m.title} - Días hasta el estreno: ${diff}`); // Debugging: Verificando la diferencia de días

    if (diff > 0 && diff <= 3 && !notifiedRef.current.includes(m.id)) {
      console.log("Mostrando notificación para:", m.title); // Debugging: Verificando si se mostrará la notificación
      Swal.fire({
        icon: "info",
        title: `Próximo estreno`,
        text: `${m.title} se estrena el ${m.release_date}`,
        position: "center", // Usamos "center" en lugar de "top-end"
        toast: false, // Desactivamos el modo "toast"
        showConfirmButton: true, // Añadimos el botón de confirmación
        timer: 5000, // Hacemos la notificación visible por 5 segundos
        background: "#333",
        color: "#fff"
      });
      notifiedRef.current.push(m.id);
    }
  });
}, [upcoming]);

  // 6) Notificar de nuevas películas siempre que el componente cargue
  useEffect(() => {
    if (upcoming.length > 0) {
      const hoy = new Date()
      console.log("Verificando películas para notificar...") // Debugging: Verificando ejecución de este efecto
      upcoming.forEach(m => {
        if (!m.release_date) return
        const rd = new Date(m.release_date)
        const diff = (rd - hoy) / (1000 * 60 * 60 * 24)
        console.log(`Película: ${m.title} - Días hasta el estreno: ${diff}`) // Debugging: Verificando la diferencia de días
        if (diff > 0 && diff <= 3 && !notifiedRef.current.includes(m.id)) {
          Swal.fire({
            icon: "info",
            title: `Nueva película`,
            text: `${m.title} se estrena el ${m.release_date}`,
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: "#333",
            color: "#fff"
          })
          notifiedRef.current.push(m.id)
        }
      })
    }
  }, [upcoming])

  return (
    <div className="home-container">
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
                  <li onClick={handleLogout}>Cerrar sesión</li>
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
        <div className="welcome">
          <h3>¡Bienvenido!</h3>
          <p>Explora las mejores películas y comparte tu opinión</p>
        </div>

        <div className="carousel">
          <button className="carousel-btn left" onClick={prevSlide}>
            &lt;
          </button>
          <img
            src={carouselImages[current].src}
            alt={carouselImages[current].alt}
            className="carousel-image"
          />
          <button className="carousel-btn right" onClick={nextSlide}>
            &gt;
          </button>
        </div>

        <div className="movie-images">
          <img src={pelicula1} alt="Película 1" />
          <button className="go-movies" onClick={() => navigate("/peliculas")}>
            Películas
          </button>
          <img src={pelicula2} alt="Película 2" />
        </div>

        <section className="release-calendar">
          <h3>Próximos Estrenos</h3>
          <div className="weekdays">
            <div>lun</div><div>mar</div><div>mié</div><div>jue</div>
            <div>vie</div><div>sáb</div><div>dom</div>
          </div>
          <div className="calendar-list">
            {upcoming.map(m => {
              const rd = new Date(m.release_date)
              const dow = rd.getDay()
              const col = dow === 0 ? 7 : dow
              return (
                <div
                  key={m.id}
                  className="release-item"
                  style={{ gridColumnStart: col }}
                  onClick={() => navigate(`/pelicula/${m.id}`)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                    alt={m.title}
                  />
                  <div>
                    <p className="release-title">{m.title}</p>
                    <p className="release-date">{m.release_date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
