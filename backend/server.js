const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '061213',
  database: 'movieinf'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para obtener todos los comentarios
app.get('/comments', (req, res) => {
  db.query('SELECT * FROM comentarios', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los comentarios' });
    }
    res.status(200).json(results);
  });
});

// Ruta para guardar un comentario
app.post('/comments', (req, res) => {
  const { movieId, user, rating, text } = req.body;

  db.query('INSERT INTO comentarios (movieId, user, rating, text) VALUES (?, ?, ?, ?)', [movieId, user, rating, text], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al guardar el comentario' });
    }
    res.status(201).json({ message: 'Comentario guardado correctamente' });
  });
});

// Iniciar el servidor
app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});
