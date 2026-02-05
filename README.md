# Graph Backend Cita Médica

Este es el proyecto backend para el sistema de gestión de citas médicas, utilizando **Node.js**, **Apollo Server** y **GraphQL**. El sistema se conecta a una base de datos **PostgreSQL** para gestionar pacientes, médicos, especialidades y citas.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- `index.js`: Punto de entrada de la aplicación. Configura Express y Apollo Server.
- `cnn.js`: Configuración de la conexión a la base de datos PostgreSQL mediante `pg-promise`.
- `resolver.js`: Definición de los resolvers de GraphQL para manejar las Queries y Mutations.
- `type-system.graphql`: Esquema de GraphQL que define los tipos de datos, consultas y mutaciones disponibles.
- `test-db.js`: Script de utilidad para verificar la conexión con la base de datos.
- `.env`: Archivo de configuración para variables de entorno (Base de Datos, Puerto, etc.).

## Estructura de GraphQL

### Consultas (Queries)

- `pacientes(id: Int)`: Lista de pacientes registrados o un paciente específico.
- `medicos(id: Int)`: Lista de médicos registrados o un médico específico.
- `especialidades(id: Int)`: Lista de especialidades médicas.
- `citas_medicas(id: Int)`: Lista de citas agendadas.

### Mutaciones (Mutations)

- **Pacientes**: `insertarPaciente`, `actualizarPaciente`, `eliminarPaciente`.
- **Médicos**: `insertarMedico`, `actualizarMedico`, `eliminarMedico`.
- **Citas Médicas**: `insertarCitaMedica`, `actualizarCitaMedica`, `eliminarCitaMedica`.

## Requisitos Previos

- **Node.js**: v16+ recomendado.
- **PostgreSQL**: Instancia de base de datos activa.

## Instalación

1. Clona el repositorio o accede a la carpeta del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` en la raíz del proyecto con tus credenciales de base de datos:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cita_medica
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   PORT=4005
   ```

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm start
```

El servidor estará disponible en: `http://localhost:4005/cita_medica`

Puedes acceder al **Apollo Sandbox** para probar las consultas directamente desde el navegador en el enlace que aparecerá en la consola al iniciar.

## Comprobación de Base de Datos

Puedes verificar que la conexión a la base de datos sea correcta ejecutando:

```bash
node test-db.js
```

Este proyecto está licenciado bajo la **MIT License** - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado por Edison Guaichico** - [Tu Perfil de GitHub](https://github.com/EdisonGP)
