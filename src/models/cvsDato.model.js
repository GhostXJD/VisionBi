import mongoose from "mongoose";

const csvDatoSchema = new mongoose.Schema({
    codProducto: {
        type: String,
        required: true,
    },
    cantidadProducto: {
        type: Number,
        required: true
    },
    precioUnitario: {
        type: Number,
        required: true
    },
    descuento: {
        type: Boolean,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    fechaVenta: { 
        type: Date, 
        required: true,
    }  
}, { timestamps: false }  )