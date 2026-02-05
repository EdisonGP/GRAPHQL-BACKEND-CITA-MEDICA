const { db } = require("./cnn")

/**
 * Resolvers de GraphQL para manejar las consultas (Queries) y mutaciones (Mutations)
 */
const blogResolver = {
    // Definición de las consultas de lectura
    Query: {
        /**
         * Obtiene la lista de pacientes o un paciente por su ID
         */
        async pacientes(root, { id }) {
            if (id == undefined) {
                // Retornar todos los pacientes activos
                return await db.any("select * from paciente where pac_estado=true");
            } else {
                // Retornar un paciente específico por ID
                return await db.any("select * from paciente where pac_id=$1", [id])
            }
        },
        /**
         * Obtiene la lista de médicos o un médico por su ID
         */
        async medicos(root, { id }) {
            if (id == undefined) {
                // Retornar todos los médicos activos
                return await db.any("select * from medico where med_estado=true");
            } else {
                // Retornar un médico específico por ID
                return await db.any("select * from medico where med_id=$1", [id])
            }
        },
        /**
         * Obtiene la lista de especialidades o una especialidad específica
         */
        async especialidades(root, { id }) {
            if (id == undefined) {
                return await db.any("select * from especialidad where esp_estado=true");
            } else {
                return await db.any("select * from especialidad where esp_id=$1", [id])
            }
        },
        /**
         * Obtiene la lista de citas médicas o una cita específica
         */
        async citas_medicas(root, { id }) {
            if (id == undefined) {
                return await db.any("select * from cita_medica where cit_med_estado=true");
            } else {
                return await db.any("select * from cita_medica where cit_med_id=$1", [id])
            }
        },
    },

    // Resolvers de campo para el tipo 'paciente'
    paciente: {
        /**
         * Resuelve las citas médicas asociadas a un paciente
         */
        async citas_medicas(paciente) {
            return await db.any(`select cm.* from cita_medica cm where cm.pac_id=$1`, [paciente.pac_id]);
        },
    },

    // Resolvers de campo para el tipo 'medico'
    medico: {
        /**
         * Resuelve las especialidades asociadas a un médico
         */
        async especialidades(medico) {
            return await db.any(`select e.* from especialidad e, medico m where m.esp_id=e.esp_id and m.med_id=$1`, [medico.med_id]);
        },
        /**
         * Resuelve las citas médicas asociadas a un médico
         */
        async citas_medicas(medico) {
            return await db.any(`select cm.* from cita_medica cm where cm.med_id=$1`, [medico.med_id]);
        },
    },

    // Resolvers de campo para el tipo 'cita_medica'
    cita_medica: {
        /**
         * Resuelve el médico asociado a una cita médica
         */
        async medicos(cita_medica) {
            return await db.any(`select m.* from medico m where m.med_id=$1`, [cita_medica.med_id]);
        },
        /**
         * Resuelve el paciente asociado a una cita médica
         */
        async pacientes(cita_medica) {
            return await db.any(`select p.* from paciente p where p.pac_id=$1`, [cita_medica.pac_id]);
        },
    },

    // Definición de las mutaciones (operaciones de escritura, actualización y eliminación)
    Mutation: {
        // --- Operaciones de PACIENTE ---
        
        /**
         * Inserta un nuevo paciente en la base de datos
         */
        async insertarPaciente(root, { paciente }) {
            if (!paciente) return null;
            return await db.any(`INSERT INTO paciente(pac_identificacion, pac_nombre, pac_telefono, pac_email, pac_direccion, pac_estado) 
                                 VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
                [paciente.pac_identificacion, paciente.pac_nombre, paciente.pac_telefono, paciente.pac_email, paciente.pac_direccion, true]);
        },
        /**
         * Actualiza los datos de un paciente existente
         */
        async actualizarPaciente(root, { id, paciente }) {
            return await db.any(`UPDATE paciente SET pac_identificacion=$1, pac_nombre=$2, pac_telefono=$3, pac_email=$4, pac_direccion=$5 
                                 WHERE pac_id=$6 RETURNING *`,
                [paciente.pac_identificacion, paciente.pac_nombre, paciente.pac_telefono, paciente.pac_email, paciente.pac_direccion, id]);
        },
        /**
         * Elimina un paciente de forma lógica (cambia el estado a false)
         */
        async eliminarPaciente(root, { id }) {
            return await db.any(`UPDATE paciente SET pac_estado=false WHERE pac_id=$1 RETURNING *`, [id]);
        },

        // --- Operaciones de MEDICO ---
        
        /**
         * Inserta un nuevo médico, buscando primero su especialidad por nombre
         */
        async insertarMedico(root, { medico }) {
            if (!medico) return null;
            const especialidad = await db.one(`select esp_id from especialidad where esp_nombre=$1`, [medico.esp_nombre]);
            return await db.any(`INSERT INTO medico(esp_id, med_identificacion, med_nombre, med_telefono, med_email, med_direccion, med_estado) 
                                 VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [especialidad.esp_id, medico.med_identificacion, medico.med_nombre, medico.med_telefono, medico.med_email, medico.med_direccion, true]);
        },
        /**
         * Actualiza los datos de un médico existente
         */
        async actualizarMedico(root, { id, medico }) {
            const especialidad = await db.one(`select esp_id from especialidad where esp_nombre=$1`, [medico.esp_nombre]);
            return await db.any(`UPDATE medico SET esp_id=$1, med_identificacion=$2, med_nombre=$3, med_telefono=$4, med_email=$5, med_direccion=$6 
                                 WHERE med_id=$7 RETURNING *`,
                [especialidad.esp_id, medico.med_identificacion, medico.med_nombre, medico.med_telefono, medico.med_email, medico.med_direccion, id]);
        },
        /**
         * Elimina un médico de forma lógica
         */
        async eliminarMedico(root, { id }) {
            return await db.any(`UPDATE medico SET med_estado=false WHERE med_id=$1 RETURNING *`, [id]);
        },

        // --- Operaciones de CITA MEDICA ---
        
        /**
         * Registra una nueva cita médica
         */
        async insertarCitaMedica(root, { cita_medica }) {
            if (!cita_medica) return null;
            return await db.any(`INSERT INTO cita_medica(pac_id, med_id, cit_med_fecha, cit_med_agendado, cit_med_estado) 
                                 VALUES($1, $2, $3, $4, $5) RETURNING *`,
                [cita_medica.pac_id, cita_medica.med_id, cita_medica.cit_med_fecha, true, true]);
        },
        /**
         * Actualiza los detalles de una cita médica
         */
        async actualizarCitaMedica(root, { id, cita_medica }) {
            return await db.any(`UPDATE cita_medica SET pac_id=$1, med_id=$2, cit_med_fecha=$3 
                                 WHERE cit_med_id=$4 RETURNING *`,
                [cita_medica.pac_id, cita_medica.med_id, cita_medica.cit_med_fecha, id]);
        },
        /**
         * Cancela/Elimina una cita médica de forma lógica
         */
        async eliminarCitaMedica(root, { id }) {
            return await db.any(`UPDATE cita_medica SET cit_med_estado=false WHERE cit_med_id=$1 RETURNING *`, [id]);
        },
    }
}

module.exports = blogResolver
