// src/pages/Perfil.js
import React, { useState, useEffect } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Perfil.css";

const Perfil = () => {
  const nav = useNavigate();

  // formularios
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // precargo username si ya hay token
  useEffect(() => {
    if (isLoggedIn) {
      const usr = localStorage.getItem("username");
      if (usr) setUsername(usr);
    }
  }, [isLoggedIn]);

  const alert = (msg, type) =>
    Swal.fire({
      icon: type === "error" ? "error" : "success",
      title: type === "error" ? "¡Error!" : "¡Éxito!",
      text: msg,
      confirmButtonColor: type === "error" ? "#ff5733" : "#00aaff",
    });

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", result.token || "logged_in");
        setIsLoggedIn(true);
        await alert("¡Inicio de sesión exitoso!", "success");
        nav("/");
      } else {
        alert(result.message || "Credenciales incorrectas.", "error");
      }
    } catch {
      alert("Error conectando al servidor.", "error");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          email,
          password: newPassword,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("username", newUsername);
        localStorage.setItem("token", result.token || "logged_in");
        setIsLoggedIn(true);
        await alert("¡Registro exitoso!", "success");
        nav("/");
      } else {
        alert(result.message || "Error al registrarte.", "error");
      }
    } catch {
      alert("Error conectando al servidor.", "error");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Has cerrado sesión correctamente",
      confirmButtonText: "OK",
      confirmButtonColor: "#00aaff",
    }).then(() => {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUsername("");
      nav("/", { replace: true });
    });
  };

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
          {isLoggedIn && <li><a href="/tuslistas">Mis Listas</a></li>}
          {isLoggedIn ? (
            <li className="user-info">
              <span>¡Hola, {username}!</span>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </li>
          ) : (
            <li><a href="/perfil">Inicia sesión</a></li>
          )}
        </ul>
      </nav>

      <main className="main-content">
        {!isLoggedIn ? (
          <div className="auth-form-container">
            {!isRegistering ? (
              <div className="login-form">
                <h3>Iniciar Sesión</h3>
                <form onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="eye-icon"
                    >
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </span>
                  </div>
                  <button type="submit">Entrar</button>
                </form>
                <p>
                  ¿No tienes cuenta?{" "}
                  <span onClick={() => setIsRegistering(true)} className="link-btn">
                    Regístrate
                  </span>
                </p>
              </div>
            ) : (
              <div className="register-form">
                <h3>Crear Cuenta</h3>
                <form onSubmit={handleRegister}>
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                  />
                  <div className="password-container">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="eye-icon"
                    >
                      {showNewPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </span>
                  </div>
                  <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Registrar</button>
                </form>
                <p>
                  ¿Ya tienes cuenta?{" "}
                  <span onClick={() => setIsRegistering(false)} className="link-btn">
                    Inicia sesión
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="welcome">
            <h3>¡Muchas Gracias Por Visitarnos!, {username}!</h3>
            <p>Vuelve Pronto!!!.</p>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Perfil;
