import mongoose from "mongoose";

const csvDatoSchema = new mongoose.Schema({
    archivoCSV: {
        type: Buffer,
        required: true,
    },
    date: { 
        type: Date,
        default: Date.now,
    },
    userUploader: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model('csvDato', csvDatoSchema);
