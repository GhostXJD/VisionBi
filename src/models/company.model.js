import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    businessRut:{
        type: String,
        required: true,
        unique: true
    }, 
    businessName: {
        type: String,
        required: true
    },
    agent:{
        type: String,
        required: true
    }
})

export default mongoose.model('company', companySchema)