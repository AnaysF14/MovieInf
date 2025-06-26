import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TusListas from "./pages/TusListas";
import Pelicula     from './pages/Pelicula'
import Home from "./pages/Home";
import Peliculas from "./pages/Peliculas";
import Comunidad from "./pages/Comunidad";
import Recomendaciones from "./pages/Recomendaciones";
import Perfil from "./pages/Perfil";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/peliculas" element={<Peliculas />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/recomendaciones" element={<Recomendaciones />} />
        <Route path="/tuslistas" element={<TusListas />} />
        <Route path="/pelicula/:id" element={<Pelicula />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
