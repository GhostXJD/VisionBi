import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    correo: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        required: true
    },
})

export default mongoose.model('message', messageSchema)
/* Escribir el nombre de la tabla en singular */