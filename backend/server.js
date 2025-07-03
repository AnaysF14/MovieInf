const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const app = express();

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Configuración de la base de datos MySQL utilizando variables de entorno
const db = mysql.createConnection({
  uri: process.env.MYSQL_URL,  // Usamos la variable de entorno MYSQL_URL
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE username = ? OR email = ?', [username, email], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'El usuario o correo ya está registrado' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Error al encriptar la contraseña' });
      }

      db.query('INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error al registrar el usuario' });
        }

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
      });
    });
  });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al buscar el usuario' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error al comparar la contraseña' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      }

      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    });
  });
});

// Ruta para obtener todas las películas
app.get('/api/peliculas', (req, res) => {
  db.query('SELECT * FROM peliculas', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las películas' });
    }
    res.status(200).json(results);  // Asegúrate de que los resultados incluyan la sinopsis
  });
});

// Ruta para agregar una nueva película
app.post('/api/peliculas', (req, res) => {
  const { nombre, año, genero, imagen } = req.body;

  db.query('INSERT INTO peliculas (nombre, año, genero, imagen) VALUES (?, ?, ?, ?)', [nombre, año, genero, imagen], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al agregar la película' });
    }
    res.status(201).json({ message: 'Película agregada exitosamente' });
  });
});

// Ruta para guardar un comentario
app.post('/comments', (req, res) => {
  const { movieId, user, avatar, rating, text } = req.body;

  db.query('INSERT INTO comentarios (movieId, user, avatar, rating, text) VALUES (?, ?, ?, ?, ?)', [movieId, user, avatar, rating, text], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al guardar el comentario' });
    }
    res.status(201).json({ message: 'Comentario guardado correctamente' });
  });
});

// Ruta para obtener comentarios de una película
app.get('/comments/:movieId', (req, res) => {
  const { movieId } = req.params;

  db.query('SELECT * FROM comentarios WHERE movieId = ?', [movieId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los comentarios' });
    }
    res.status(200).json(results);  // Devuelve los comentarios de esa película
  });
});

// Iniciar el servidor
app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});
