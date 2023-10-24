import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
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