import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import promptRouter from './routes/prompt.routes.js';
import cors from "cors";   // use for connect with frontend
dotenv.config()
const app = express()
const port = process.env.PORT || 4001;
const mongo_url = process.env.MONGO_URI;


const allowedOrigins = [
    "https://www.aithinkr.online",
    "https://ai-thinkr-frontend.vercel.app",
    "http://localhost:3000" // for local testing
];

// using cors for connected with frontend 
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

// middleware 
app.use(express.json());
app.use(cookieParser());

// db connection code  
mongoose.connect(mongo_url || "mongodb+srv://ys5401519:UPbvxvuU9k3BFqRP@cluster0.icotnww.mongodb.net/deepseek?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("connected to Database");
}).catch((err) => {
    console.error("mongodb connection error!");
})


// user routes 
app.use('/api/v1/user', userRoutes);

// prompt Routes
app.use('/api/v1/deepseekai', promptRouter);


export default app;
