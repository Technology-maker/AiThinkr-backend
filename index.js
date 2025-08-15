import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import promptRouter from './routes/prompt.routes.js';
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 4001;
const mongo_url = process.env.MONGO_URI;

// Allowed frontend origins
const allowedOrigins = [
    "https://www.aithinkr.online",
    "https://ai-thinkr-frontend.vercel.app",
    "http://localhost:3000" // local testing
];

// CORS setup
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/deepseekai', promptRouter);

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to Database");

        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Exit if DB connection fails
    }
};

startServer();

export default app;
