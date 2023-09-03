import mongoose from "mongoose";

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    correo: { type: String, 
        required: true
    },
    password: { type: String, 
        required: true
    },
    active: {type: Boolean
    },
    tipoUsuario: {type: String,
        required: true  
    }
})

export default mongoose.model('usuario', usuarioSchema)
/* Escribir el nombre de la tabla en singular */