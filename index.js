import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from "cors";

// Routes
import userRoutes from './routes/user.routes.js';
import promptRouter from './routes/prompt.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;
const mongo_url = process.env.MONGO_URI;

if (!mongo_url) {
    console.error("❌ MONGO_URI not found in .env");
    process.exit(1);
}

// Allowed frontend origins
const allowedOrigins = [
    "https://www.aithinkr.online",
    "https://ai-thinkr-frontend.vercel.app",
    "http://localhost:3000"
];

// CORS setup
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/deepseekai', promptRouter);

// Start server only after DB connects
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
        console.log(`🚀 Server running on port ${port}`);
    });
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});

export default app;
