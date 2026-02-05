// Cargar variables de entorno
require('dotenv').config()
// Importar la librería pg-promise para interactuar con PostgreSQL
const pgPromise = require('pg-promise')

// Configuración de la conexión a la base de datos utilizando variables de entorno
const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'cita_medica',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'entraste'
}

// Inicializar pg-promise
const pgp = pgPromise({})
// Crear la instancia de conexión a la base de datos
const db = pgp(config)

// Exportar el objeto db para ser usado en otros archivos (ej. resolvers)
exports.db = db

