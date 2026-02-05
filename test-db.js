// Cargar configuración de variables de entorno
require('dotenv').config()
// Importar la instancia de base de datos desde cnn.js
const { db } = require('./cnn')

/**
 * Función para probar la conexión a la base de datos y listar tablas
 */
async function testConnection() {
    try {
        console.log('Probando conexión con la configuración:', {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER
        })

        // Ejecutar una consulta simple para verificar la base de datos y usuario actual
        const result = await db.one('SELECT current_database(), current_user')
        console.log('¡Conexión exitosa!')
        console.log('DB/Usuario Actual:', result)
        
        // Consultar el esquema público para listar las tablas existentes
        const tables = await db.any("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        console.log('Tablas en el esquema público:', tables.map(t => t.table_name))
        
        // Contar el número de registros en la tabla 'medico' como prueba adicional
        const medicosCount = await db.one('SELECT count(*) FROM medico')
        console.log('Total de médicos en la tabla:', medicosCount.count)
        
    } catch (error) {
        console.error('¡La conexión falló!')
        console.error(error)
    } finally {
        // Finalizar el proceso
        process.exit()
    }
}

// Ejecutar la prueba de conexión
testConnection()

