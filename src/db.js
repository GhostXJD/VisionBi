import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/VisionBiDb");
        console.log("Connect to database")
    } catch (error) {
        console.error(error)
    }
}

