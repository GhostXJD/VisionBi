import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        company: {
            type: String,
            required: true,
        },
    }
);

export default mongoose.model('Goal', goalSchema);