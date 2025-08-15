import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from "cors"; // use for connect with frontend
import userRoutes from './routes/user.routes.js';
import promptRouter from './routes/prompt.routes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4001;
const mongo_url = process.env.MONGO_URI;

// Allowed origins for CORS
const allowedOrigins = [
    "https://www.aithinkr.online",
    "https://ai-thinkr-frontend.vercel.app",
    "http://localhost:3000" // for local testing
];

// CORS middleware
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

// Body parser & cookie parser
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(
    mongo_url || "mongodb+srv://ys5401519:UPbvxvuU9k3BFqRP@cluster0.icotnww.mongodb.net/deepseek?retryWrites=true&w=majority&appName=Cluster0"
).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/deepseekai', promptRouter);

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
