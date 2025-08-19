import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import promptRouter from "./routes/prompt.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
const mongo_url = process.env.MONGO_URI;

// ✅ CORS setup
const allowedOrigins = [
    "https://www.aithinkr.online",
    "https://ai-thinkr-frontend.vercel.app", // frontend domain
    "https://ai-thinkr.vercel.app",          // backend domain (optional if you call backend → backend)
    "http://localhost:3000",                 // local React dev
    "http://localhost:5173"                  // local Vite dev
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.get("/", (req, res) => {
    res.send("Backend is running !");
})

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/deepseekai", promptRouter);

// ✅ Global error handler (better debugging)
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// ✅ MongoDB connection + start server only when DB is ready
const connectDBAndStart = async () => {
    try {
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");

        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1); // Stop app if DB fails
    }
};

connectDBAndStart();

export default app;
