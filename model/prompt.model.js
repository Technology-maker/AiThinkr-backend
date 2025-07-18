import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        require: true
    },
    content: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
export const Prompt = mongoose.model("Prompt", promptSchema);