import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    correo: { type: String, 
        required: true,
        unique: true
    },
    password: { type: String, 
        required: true
    },
    active: {type: Boolean,
        required: true
    },
    tipoUsuario: {type: String,
        required: true
    }  
})

export default mongoose.model('usuario', usuarioSchema)
/* Escribir el nombre de la tabla en singular */