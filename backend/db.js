const mysql = require('mysql2');

// Crear conexión con la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto si usas otro usuario
    password: '061213', // Si tienes contraseña en MySQL
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

module.exports = db;
