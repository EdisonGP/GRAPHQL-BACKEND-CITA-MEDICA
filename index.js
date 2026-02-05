// Cargar variables de entorno desde el archivo .env
require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const http = require('http')
const cors = require('cors')
const { importSchema } = require('graphql-import')
const { makeExecutableSchema } = require('@graphql-tools/schema')

/**
 * Función asíncrona para iniciar el servidor Apollo y Express
 */
async function startServer() {
    // Inicialización de la aplicación Express y el servidor HTTP
    const app = express()
    const httpServer = http.createServer(app)

    // Importación del esquema GraphQL desde el archivo type-system.graphql
    const typeDefs = importSchema('./type-system.graphql')
    // Importación de los resolvers definidos en resolver.js
    const resolvers = require('./resolver')
    
    // Creación del esquema ejecutable combinando tipos y resolvers
    const schema = makeExecutableSchema({ typeDefs, resolvers })

    // Configuración del servidor Apollo
    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })

    // Iniciar el servidor Apollo
    await server.start()

    // Configuración de Middlewares globales
    app.use(cors()) // Habilitar CORS para permitir peticiones desde otros dominios (ej. el frontend)
    app.use(express.json()) // Middleware para parsear cuerpos JSON en las peticiones
    app.use(express.urlencoded({ extended: true })) // Middleware para parsear datos de formularios

    // Integración de Apollo Server con Express en la ruta /cita_medica
    app.use(
        '/cita_medica',
        expressMiddleware(server),
    )

    // Definición del puerto del servidor, por defecto 4005 si no se especifica en .env
    const PORT = process.env.PORT || 4005
    // Iniciar la escucha del servidor en el puerto configurado
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve))
    
    // Mensajes de confirmación en consola
    console.log(`Servidor listo en http://localhost:${PORT}/cita_medica`)
    console.log(`Sandbox de Apollo listo en https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:${PORT}/cita_medica`)
}

// Ejecutar el inicio del servidor
startServer()

